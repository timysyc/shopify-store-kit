/* Conversion Kit (ck-) runtime. One file powers every ck-* section. No dependencies. */
(function () {
  'use strict';
  if (window.__CK_LOADED) return;
  window.__CK_LOADED = true;

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function formatMoney(cents) {
    cents = Number(cents) || 0;
    var fmt = String(window.CK_MONEY_FORMAT || '${{amount}}').replace(/<[^>]*>/g, '');
    var m = fmt.match(/\{\{\s*(\w+)\s*\}\}/);
    function delim(n, prec, th, dec) {
      var parts = (n / 100).toFixed(prec).split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, th);
      return parts[1] ? parts[0] + dec + parts[1] : parts[0];
    }
    var v;
    switch (m ? m[1] : 'amount') {
      case 'amount_no_decimals': v = delim(cents, 0, ',', '.'); break;
      case 'amount_with_comma_separator': v = delim(cents, 2, '.', ','); break;
      case 'amount_no_decimals_with_comma_separator': v = delim(cents, 0, '.', ','); break;
      case 'amount_with_apostrophe_separator': v = delim(cents, 2, "'", '.'); break;
      default: v = delim(cents, 2, ',', '.');
    }
    return m ? fmt.replace(m[0], v) : '$' + v;
  }
  window.CKformatMoney = formatMoney;

  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'ck-toast'; document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600);
  }

  /* ---------- product / bundles ---------- */
  function initProduct(root) {
    if (root.__ck) return;
    root.__ck = true;
    var jsonEl = $('[data-ck-product-json]', root);
    var product = null;
    try { product = jsonEl ? JSON.parse(jsonEl.textContent) : null; } catch (e) { product = null; }
    if (!product) return;

    var form = $('[data-ck-form]', root);
    var idInput = $('[data-ck-variant-input]', root);
    var qtyInput = $('[data-ck-qty-input]', root);
    var atc = $('[data-ck-atc]', root);
    var atcText = $('[data-ck-atc-text]', root);
    var atcPrice = $('[data-ck-atc-price]', root);
    var errEl = $('[data-ck-error]', root);
    var tiers = $$('[data-ck-tier]', root);

    function byId(id) {
      for (var i = 0; i < product.variants.length; i++) if (String(product.variants[i].id) === String(id)) return product.variants[i];
      return null;
    }
    var variant = byId(idInput.value) || product.variants[0];

    function selectedTier() {
      for (var i = 0; i < tiers.length; i++) if ($('input', tiers[i]).checked) return tiers[i];
      return null;
    }

    function tierState(t) {
      var tv = t.dataset.variant ? byId(t.dataset.variant) : null;
      var base = tv || variant;
      var displayQty = parseInt(t.dataset.displayQty || '1', 10) || 1;
      var price = base.price;
      var cmp = Math.max(base.compare_at_price || 0, price);
      var total, compare, qty;
      if (tv) {
        qty = 1; total = price; compare = cmp;
      } else {
        qty = displayQty;
        var free = parseInt(t.dataset.free || '0', 10) || 0;
        var disc = parseInt(t.dataset.disc || '0', 10) || 0;
        var paid = Math.max(displayQty - free, 0);
        total = Math.floor(price * paid * (100 - disc) / 100);
        compare = cmp * displayQty;
      }
      return { variant: base, qty: qty, total: total, compare: compare, unit: Math.floor(total / displayQty) };
    }

    function setText(scope, sel, text) { $$(sel, scope).forEach(function (el) { el.textContent = text; }); }

    function render() {
      tiers.forEach(function (t) {
        var s = tierState(t);
        t.classList.toggle('is-selected', $('input', t).checked);
        setText(t, '[data-ck-tier-total]', formatMoney(s.total));
        setText(t, '[data-ck-tier-unit]', formatMoney(s.unit));
        setText(t, '[data-ck-tier-compare]', s.compare > s.total ? formatMoney(s.compare) : '');
        var pct = s.compare > s.total ? Math.floor((s.compare - s.total) * 100 / s.compare) : 0;
        setText(t, '[data-ck-tier-pct]', String(pct));
        $$('[data-ck-tier-savepill]', t).forEach(function (el) { el.hidden = pct <= 0; });
      });

      var sel = selectedTier();
      var s = sel ? tierState(sel) : {
        variant: variant, qty: 1, total: variant.price,
        compare: Math.max(variant.compare_at_price || 0, variant.price)
      };
      idInput.value = s.variant.id;
      qtyInput.value = s.qty;

      var priceHtml = formatMoney(s.total) + (s.compare > s.total ? ' <s>' + formatMoney(s.compare) + '</s>' : '');
      if (atcPrice) atcPrice.innerHTML = '· ' + priceHtml;
      $$('[data-ck-sticky-price]').forEach(function (el) { el.innerHTML = priceHtml; });

      if (atc) {
        atc.disabled = !s.variant.available;
        if (atcText) atcText.textContent = s.variant.available ? atc.dataset.label : atc.dataset.soldout;
      }

      // single-unit price block follows the chosen variant
      var cmpUnit = Math.max(variant.compare_at_price || 0, variant.price);
      setText(root, '[data-ck-price]', formatMoney(variant.price));
      $$('[data-ck-compare]', root).forEach(function (el) { el.textContent = formatMoney(cmpUnit); el.hidden = cmpUnit <= variant.price; });
      $$('[data-ck-save]', root).forEach(function (el) {
        var amt = cmpUnit - variant.price;
        el.hidden = amt <= 0;
        el.textContent = el.dataset.label + ' ' + (el.dataset.format === 'amount' ? formatMoney(amt) : Math.floor(amt * 100 / cmpUnit) + '%');
      });
    }

    tiers.forEach(function (t) { $('input', t).addEventListener('change', render); });
    if (tiers.length && !selectedTier()) $('input', tiers[0]).checked = true;

    /* variant pills */
    var optionInputs = $$('[data-ck-option]', root);
    optionInputs.forEach(function (inp) {
      inp.addEventListener('change', function () {
        var selected = (variant.options || []).slice();
        $$('[data-ck-option]:checked', root).forEach(function (c) { selected[parseInt(c.dataset.ckOption, 10)] = c.value; });
        var match = product.variants.filter(function (v) {
          return v.options.every(function (o, i) { return o === selected[i]; });
        })[0];
        $$('[data-ck-option-group]', root).forEach(function (g) {
          var c = $('input:checked', g); var lbl = $('[data-ck-option-label]', g);
          if (c && lbl) lbl.textContent = c.value;
        });
        if (!match) { if (atc) { atc.disabled = true; if (atcText) atcText.textContent = 'Unavailable'; } return; }
        variant = match;
        if (match.featured_media) goToMedia(match.featured_media.id);
        try {
          var url = new URL(window.location.href);
          url.searchParams.set('variant', match.id);
          window.history.replaceState({}, '', url.toString());
        } catch (e) {}
        render();
      });
    });

    /* gallery */
    var track = $('[data-ck-track]', root);
    var thumbs = $$('[data-ck-thumb]', root);
    function slideIndex() { return track ? Math.round(track.scrollLeft / Math.max(track.clientWidth, 1)) : 0; }
    function goTo(i) {
      if (!track) return;
      var n = track.children.length;
      i = (i + n) % n;
      track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
    }
    function goToMedia(mediaId) {
      if (!track) return;
      var kids = Array.prototype.slice.call(track.children);
      for (var i = 0; i < kids.length; i++) if (String(kids[i].dataset.mediaId) === String(mediaId)) return goTo(i);
    }
    if (track) {
      track.addEventListener('scroll', function () {
        var i = slideIndex();
        thumbs.forEach(function (t, j) { t.classList.toggle('is-active', i === j); });
      }, { passive: true });
      thumbs.forEach(function (t) { t.addEventListener('click', function () { goTo(parseInt(t.dataset.ckThumb, 10)); }); });
      var prev = $('[data-ck-prev]', root), next = $('[data-ck-next]', root);
      if (prev) prev.addEventListener('click', function () { goTo(slideIndex() - 1); });
      if (next) next.addEventListener('click', function () { goTo(slideIndex() + 1); });
    }

    /* add to cart */
    function setLoading(on) { if (atc) { atc.classList.toggle('is-loading', on); atc.setAttribute('aria-busy', on ? 'true' : 'false'); } }
    function showError(msg) { if (errEl) { errEl.textContent = msg; errEl.hidden = !msg; } else if (msg) { toast(msg); } }

    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (atc && atc.disabled) return;
      showError('');
      var items = [{ id: Number(idInput.value), quantity: Number(qtyInput.value) || 1 }];
      $$('[data-ck-upsell]:checked', root).forEach(function (u) { items.push({ id: Number(u.value), quantity: 1 }); });

      var mode = root.dataset.afterAdd || 'drawer';
      var cart = document.querySelector('cart-drawer') || document.querySelector('cart-notification');
      var useDrawer = mode === 'drawer' && cart && typeof cart.renderContents === 'function' && typeof cart.getSectionsToRender === 'function';
      var body = { items: items };
      if (useDrawer) {
        body.sections = cart.getSectionsToRender().map(function (s) { return s.id; });
        body.sections_url = window.location.pathname;
      }

      setLoading(true);
      if (window.CK_PREVIEW) {
        setTimeout(function () { setLoading(false); toast('Added ' + body.items[0].quantity + ' to cart (preview)'); }, 450);
        return;
      }
      var rootUrl = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
      fetch(rootUrl + 'cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body)
      })
        .then(function (res) { return res.json().then(function (json) { return { ok: res.ok, json: json }; }); })
        .then(function (r) {
          if (!r.ok || r.json.status) throw new Error(r.json.description || r.json.message || 'Could not add to cart');
          if (mode === 'checkout') { window.location.href = rootUrl + 'checkout'; return; }
          if (useDrawer) {
            var first = r.json.items && r.json.items[0];
            if (first) { r.json.id = first.id; r.json.key = first.key; }
            cart.classList.remove('is-empty');
            cart.renderContents(r.json);
            if (window.publish && window.PUB_SUB_EVENTS) window.publish(window.PUB_SUB_EVENTS.cartUpdate, { source: 'ck-product', cartData: r.json });
          } else {
            window.location.href = rootUrl + 'cart';
          }
        })
        .catch(function (ex) { showError(ex.message); })
        .then(function () { setLoading(false); });
    });

    render();
  }

  /* ---------- sticky add to cart ---------- */
  function initSticky(bar) {
    if (bar.__ck) return;
    bar.__ck = true;
    var target = $('[data-ck-atc]');
    if (!target) { bar.remove(); return; }
    var priceEl = $('[data-ck-sticky-price]', bar);
    var atcPrice = $('[data-ck-atc-price]');
    if (priceEl && atcPrice) priceEl.innerHTML = atcPrice.innerHTML.replace(/^·\s*/, '');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        var en = entries[0];
        bar.classList.toggle('is-visible', !en.isIntersecting && en.boundingClientRect.top < 0);
      }).observe(target);
    }
    var btn = $('[data-ck-sticky-btn]', bar);
    if (btn) btn.addEventListener('click', function () {
      if (bar.dataset.action === 'scroll') {
        target.closest('[data-ck-product]').scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        var f = target.closest('form');
        if (f && f.requestSubmit) f.requestSubmit(target); else target.click();
      }
    });
  }

  /* ---------- countdown (real end date only) ---------- */
  function initCountdown(el) {
    if (el.__ck) return;
    el.__ck = true;
    var end = new Date(String(el.dataset.end).trim().replace(' ', 'T'));
    if (isNaN(end.getTime())) return;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function tick() {
      var diff = end.getTime() - Date.now();
      if (diff <= 0) { el.hidden = true; clearInterval(timer); return; }
      el.hidden = false;
      var s = Math.floor(diff / 1000);
      var d = Math.floor(s / 86400); s -= d * 86400;
      var h = Math.floor(s / 3600); s -= h * 3600;
      var m = Math.floor(s / 60); s -= m * 60;
      var map = { d: d + 'd', h: pad(h) + 'h', m: pad(m) + 'm', s: pad(s) + 's' };
      Object.keys(map).forEach(function (k) { var x = el.querySelector('[data-' + k + ']'); if (x) x.textContent = map[k]; });
      var dEl = el.querySelector('[data-d]'); if (dEl) dEl.hidden = d === 0;
    }
    var timer = setInterval(tick, 1000);
    tick();
  }

  /* ---------- delivery estimate ---------- */
  function addBusinessDays(date, days, skip) {
    var d = new Date(date.getTime());
    var added = 0;
    while (added < days) {
      d.setDate(d.getDate() + 1);
      if (!skip || (d.getDay() !== 0 && d.getDay() !== 6)) added++;
    }
    return d;
  }
  function initDelivery(el) {
    if (el.__ck) return;
    el.__ck = true;
    var skip = el.dataset.skipWeekends !== 'false';
    var now = new Date();
    var opts = { weekday: 'short', month: 'short', day: 'numeric' };
    var a = addBusinessDays(now, parseInt(el.dataset.min, 10) || 3, skip).toLocaleDateString(undefined, opts);
    var b = addBusinessDays(now, parseInt(el.dataset.max, 10) || 7, skip).toLocaleDateString(undefined, opts);
    var out = $('[data-ck-delivery-text]', el);
    if (out && el.dataset.template) out.innerHTML = el.dataset.template.replace('[start]', a).replace('[end]', b);
  }

  /* ---------- count-up stats ---------- */
  function initCount(el) {
    if (el.__ck) return;
    el.__ck = true;
    var to = parseFloat(el.dataset.to) || 0;
    var dec = (String(el.dataset.to).split('.')[1] || '').length;
    function run() {
      var t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 1400, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = (to * e).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); run(); } }, { threshold: 0.4 });
      io.observe(el);
    } else { el.textContent = to; }
  }

  /* ---------- announcement rotator ---------- */
  function initRotator(el) {
    if (el.__ck) return;
    el.__ck = true;
    var msgs = $$('.ck-announce__msg', el);
    if (msgs.length < 2) return;
    var i = 0;
    function show(n) { i = (n + msgs.length) % msgs.length; msgs.forEach(function (m, j) { m.classList.toggle('is-active', j === i); }); }
    var secs = parseInt(el.dataset.speed, 10) || 4;
    var timer = setInterval(function () { show(i + 1); }, secs * 1000);
    var prev = $('[data-ck-a-prev]', el), next = $('[data-ck-a-next]', el);
    if (prev) prev.addEventListener('click', function () { clearInterval(timer); show(i - 1); });
    if (next) next.addEventListener('click', function () { clearInterval(timer); show(i + 1); });
  }

  /* ---------- horizontal scrollers ---------- */
  function initScroller(nav) {
    if (nav.__ck) return;
    nav.__ck = true;
    var target = document.getElementById(nav.dataset.ckScrollerNav);
    if (!target) return;
    $$('button', nav).forEach(function (b) {
      b.addEventListener('click', function () {
        target.scrollBy({ left: (b.dataset.dir === 'prev' ? -1 : 1) * target.clientWidth * 0.9, behavior: 'smooth' });
      });
    });
  }

  /* ---------- reveal on scroll ---------- */
  function initReveal(el) {
    if (el.__ck) return;
    el.__ck = true;
    if (!('IntersectionObserver' in window)) { el.classList.add('is-in'); return; }
    var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { el.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
  }

  function initAll(scope) {
    scope = scope || document;
    $$('[data-ck-sticky]', scope).forEach(initSticky);
    $$('[data-ck-product]', scope).forEach(initProduct);
    $$('[data-ck-countdown]', scope).forEach(initCountdown);
    $$('[data-ck-delivery]', scope).forEach(initDelivery);
    $$('[data-ck-count]', scope).forEach(initCount);
    $$('[data-ck-rotator]', scope).forEach(initRotator);
    $$('[data-ck-scroller-nav]', scope).forEach(initScroller);
    $$('.ck-reveal', scope).forEach(initReveal);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initAll(); });
  else initAll();
  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
})();
