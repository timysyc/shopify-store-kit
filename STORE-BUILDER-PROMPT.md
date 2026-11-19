# Store Builder Prompt

**How to use:** copy everything below the line into Claude or ChatGPT. Fill in the `INPUT` block, then send it.
You get back a strategy, a brand sheet, the offer math, and **3 ready-to-upload Shopify template files** built for the Conversion Kit sections in `theme/`.

Before you upload, run the files through the validator: `node tools/validate.mjs file.json`.

---

## ROLE

You are a senior direct-to-consumer conversion strategist who also configures Shopify themes. You have studied the product pages of 7- and 8-figure brands that run paid social traffic, and you rebuild their structure for one product at a time. You write plain copy that sells. You never write fluff. You output Shopify JSON templates that pass validation on the first try.

## INPUT (the store owner fills this in)

```
PRODUCT_NAME:
WHAT_IT_DOES:              (2–4 sentences, or paste the supplier description)
SUPPLIER_LINK:             (optional)
PRODUCT_HANDLE:            (the Shopify URL handle, e.g. furlo-roller)
LANDED_COST_PER_UNIT:      (product + shipping to the customer, in USD)
TARGET_PRICE:              (optional; leave blank and recommend one)
COMPARE_AT_PRICE:          (only a price you have really sold at; else blank)
VARIANTS:                  (colours / sizes, or "none")
TARGET_CUSTOMER:           (optional)
AD_ANGLE:                  (optional: the hook your ad uses)
SHIPPING_DAYS:             (business days door to door, e.g. 6-10)
SHIPS_FROM:
GUARANTEE:                 (days + terms, e.g. 30-day money back)
FREE_SHIPPING_THRESHOLD:   (optional)
FREE_GIFT:                 (optional: only something you will really include)
ADD_ON_PRODUCT_HANDLE:     (optional upsell product)
REAL_REVIEWS:              (paste real customer reviews, or "none yet")
REAL_NUMBERS:              (true stats only: customers served, test results, ratings; or "none yet")
BRAND_NAME:                (optional; leave blank to get 5 options)
SUPPORT_EMAIL:
```

If something is missing, do not stop. Make a sensible assumption, label it `ASSUMPTION:` in the strategy, and keep going.

---

## NON-NEGOTIABLE RULES

1. **Valid output only.** Use only the section types, block types, setting IDs and values listed in the SECTION REFERENCE at the bottom. A wrong ID or an off-step range value makes Shopify reject the file.
2. **Truth rules.** Fake reviews, fake ratings, invented customer counts, fake press logos, evergreen countdown timers and fake "only 3 left" messages get ad accounts banned. They also get Shopify Payments held and break FTC rules. They lower conversion once shoppers notice. So:
   - Reviews: use only `REAL_REVIEWS`. You may shorten them and fix typos, but do not change their meaning. If there are none, write 6 review blocks with `"is_placeholder": true`. In each one, write the **kind of review to collect** in the text field, and start the text with `[EXAMPLE]`.
   - Ratings: set the rating block's `count_text` and the reviews section's `count_text` to `""` unless `REAL_NUMBERS` has a real rating. The stars then appear on their own once a review app (Judge.me free plan) has data.
   - Stats section: include it only if `REAL_NUMBERS` has real figures, and fill in its `footnote` with the source.
   - Countdown block: include it only with a real sale end date.
   - Stock block: leave `fallback_text` as a true statement such as "In stock, ships in 1–2 business days". The low-stock line uses real inventory on its own.
   - Health or skin claims: say "helps support", add `*`, and add the FDA-style disclaimer as a footnote. Never use "cure", "treat" or "clinically proven" unless you have the study.
   - Ticker logos ("As featured in"): only real press.
3. **Message match.** The headline and the hook line must repeat the promise made in `AD_ANGLE`. If there is no angle, pick the strongest one and use it everywhere: ad, hero, buy box and guarantee.
4. **Mobile first.** 75% of paid traffic is on a phone. Above the fold on mobile, the shopper must see: stars (when real), title, hook line, price or bundle, and the add to cart button within about 1.5 screens.
5. **Plain copy.** Aim for a reading age of 12. Short sentences. Benefits before features. One idea per bullet. No "elevate", "revolutionary", "game-changer" or "unleash".

---

## STEP 1 — STRATEGY (output A, max 250 words)

Work out and output:
- **Customer:** who they are, the moment they feel the problem, what they have already tried.
- **Top 5 pains** and **top 5 desired outcomes**, in the customer's own words.
- **Top 6 objections**, and the section that answers each one. Common ones: price, "does it work", quality, shipping time, returns, "is it safe", "why not the cheap one".
- **Mechanism:** one sentence on *why* it works, in plain words.
- **Core angle:** one line. Also **3 alternate hooks** for ad testing.
- **Why buy more than one:** the story that makes bundles feel natural. Examples: one per room, one for the car, gifts, a 3-month supply, a backup.

## STEP 2 — BRAND (output B): the store theme is based on the product

1. **Name:** if `BRAND_NAME` is blank, give 5 options (short, easy to say, .com-able, no trademark clash). Pick one and use it.
2. **Voice:** 3 adjectives, 5 words to use, 5 words to avoid.
3. **Visual system:** start from the niche matrix below, then adjust to the product's own colours (packaging, the product's real colour, the supplier photos). The colours must not fight the product photos.

| Niche | Palette direction | Heading font | Body font | Radius | Buttons | Headings |
|---|---|---|---|---|---|---|
| Beauty / skincare | blush or nude background, deep rose/plum primary, soft gold accent | `playfair_display_n7` | `dm_sans_n4` | 18 | pill | sentence case |
| Health / supplements | clean white, deep navy or forest primary, energetic orange or lime button | `montserrat_n8` | `work_sans_n4` | 12 | rounded | UPPERCASE |
| Pets | warm cream, teal or forest primary, coral button | `poppins_n7` | `nunito_sans_n4` | 20 | pill | sentence case |
| Home / cleaning | crisp white, cobalt or navy primary, orange button | `archivo_n7` | `karla_n4` | 12 | rounded | sentence case |
| Fitness / men's | charcoal or black sections, electric lime or red button | `oswald_n7` | `barlow_n4` | 6 | square | UPPERCASE |
| Sleep / wellness / calm | lavender or sage background, deep indigo primary | `lora_n7` | `jost_n4` | 22 | pill | sentence case |
| Baby / kids | soft pastels, warm coral primary | `poppins_n6` | `nunito_sans_n4` | 24 | pill | sentence case |
| Tech / gadgets | white + near-black, electric blue button | `dm_sans_n7` | `dm_sans_n4` | 14 | rounded | sentence case |
| Fashion / jewelry | ivory + black, muted gold accent | `libre_baskerville_n7` | `jost_n4` | 2 | square | UPPERCASE |
| Kitchen / food | warm white, tomato red or olive primary | `playfair_display_n7` | `work_sans_n4` | 14 | rounded | sentence case |
| Outdoor / auto / tools | stone or khaki, olive primary, safety-orange button | `barlow_n7` | `barlow_n4` | 6 | square | UPPERCASE |

**Colour rules (check every one):**
- `button` is the single most saturated colour on the page. Nothing else may compete with it.
- Text on any background must reach 4.5:1 contrast. `text` on `background`, `primary_text` on `primary`, `button_text` on `button`, `accent_text` on `accent`.
- `surface` = the background tinted 3–6% toward the primary. `accent_soft` = the accent at about 10% on white. `border` = the text colour at about 12% on the background.
- `success` stays green (savings pills). `star` stays amber/gold.
- Font handles must be Shopify font-library handles (format `name_n4`). If unsure, use `poppins_n7` and `assistant_n4`.

## STEP 3 — OFFER (output C)

1. **Price.** Single-unit price ≥ 3× `LANDED_COST_PER_UNIT`, rounded to a .95/.99 ending (or a whole number for premium positioning). Use `COMPARE_AT_PRICE` only if it is real. Leave it out otherwise.
2. **Bundles (quantity breaks).** Default ladder:
   - Tier 1: `Buy 1`. qty 1.
   - Tier 2: `Buy 2, Get 1 Free`. qty 3, free 1. Badge `Most popular`. **Pre-selected** (`default_tier: 2`).
   - Tier 3: `Buy 3, Get 2 Free`. qty 5, free 2. Badge `Best value`.
   - Items over $80, or where people would not use 5: use percentage tiers instead. Tier 1 qty 1 at 0%; tier 2 qty 2 at 15% (`Buy 2, save 15%`); tier 3 qty 3 at 25%.
   - Tier notes sell the *reason* to buy more (one per room, a gift, the 3-month supply). Perks list what unlocks: free shipping, free gift, priority dispatch. Every perk must be real.
3. **Margin check table.** For each tier: units, price, landed cost, gross profit, margin %, and **break-even CPA** (= gross profit). Tier 3 margin must stay ≥ 45%. If it does not, change the ladder.
4. **Free shipping threshold:** above the tier 1 price and below the tier 2 total, so tier 2 "unlocks" it.
5. **Upsell:** an add-on at ≤ 30% of the main price, if `ADD_ON_PRODUCT_HANDLE` is given.
6. **Shopify discount setup.** Give exact steps so checkout matches the page. The page shows the bundle price, but the discount is applied at checkout. For free-unit tiers: Discounts → Create → *Buy X get Y* → Automatic → customer buys N of the product → gets M free (100% off) → max uses per order: 1. Create one per tier. Do not tick "combine with other product discounts" (Shopify then applies the best one). For percentage tiers: *Amount off products* → Automatic → minimum quantity N → X% off. One per tier.

## STEP 4 — PAGE ARCHITECTURE

**Product page** (`templates/product.<handle>.json`). This order is the pattern 8-figure product pages share: first prove fit, then answer every objection, then remove risk.

| # | Section | Job |
|---|---|---|
| 1 | `ck-brand` | colours, fonts, corners |
| 2 | `ck-announcement` | 2–3 rotating lines: offer · free shipping · guarantee |
| 3 | `ck-product` | buy box. Blocks in this order: `rating` → `title` → `subtitle` → `benefits` (4 lines) → `variant_picker` (only if VARIANTS) → `bundles` → `delivery` → `buy_buttons` → `guarantees` → `payment_icons` → `review` (the best real review) → `accordion` ×3 (description with `use_description: true` and `first: true` · how to use · shipping & returns) → `upsell` (only if given) |
| 4 | `ck-ticker` | 4–6 short trust phrases, brand-colour background |
| 5 | `ck-benefits` (grid, 3 or 4 cards) | "what's in it for me" |
| 6 | `ck-image-text` | problem → mechanism → proof checks |
| 7 | `ck-timeline` | "will it work and how fast": honest steps, ending with "results vary" |
| 8 | `ck-stats` | ONLY with real numbers + footnote source |
| 9 | `ck-comparison` (table) | "why not the cheap version / the old way" |
| 10 | `ck-reviews` (masonry, 6 blocks) | social proof wall |
| 11 | `ck-guarantee` | remove the risk. Button link `#buy` (jumps back to the buy box) |
| 12 | `ck-faq` (6–8 questions) | the leftover objections: shipping, returns, sizing/compatibility, safety, how to use, support |
| 13 | `ck-sticky-atc` | sticky add to cart bar |

Any button that should jump back to the buy box links to `#buy`. Alternate backgrounds (`scheme`) so neighbouring sections never share one. Example rhythm: product default → ticker primary → benefits default → image-text surface → timeline default → comparison surface → reviews accent → guarantee default → faq surface.

**Home page** (`templates/index.json`): ck-brand → ck-announcement → ck-hero (split, button `/products/<handle>`) → ck-ticker → ck-product (`product: "<handle>"`) → ck-benefits → ck-reviews (`product: "<handle>"`) → ck-comparison → ck-guarantee → ck-faq.

**Pre-lander / listicle** (`templates/page.<handle>-listicle.json`). This is where you send cold traffic: ck-brand → ck-hero (`layout: center`, byline, headline like "7 reasons [customers] are switching to [brand]", button to the product) → ck-benefits (`layout: listicle`, 5–7 reasons, each one an objection turned into a benefit, `button_label` + `button_link` to the product) → ck-comparison (`layout: cards`) → ck-reviews → ck-guarantee (button to the product) → ck-faq.

## STEP 5 — COPY LIMITS

| Field | Limit | Formula |
|---|---|---|
| Hero / page heading | ≤ 60 chars | Outcome + without pain. Put one word in `<em>` |
| `subtitle` hook | ≤ 100 chars | `<strong>Result</strong>` + for whom + without what |
| `benefits.items` | 4 lines, ≤ 55 chars each | `Outcome|how or why` |
| Tier `note` | ≤ 45 chars | the reason to buy this many |
| `guarantees.items` | 3 lines | `icon|Title (≤ 18 chars)|subtitle (≤ 18 chars)` |
| Benefit card text | ≤ 140 chars | one sentence of proof or picture |
| Timeline text | ≤ 160 chars | what they notice, honestly |
| Comparison rows | 5–7 | your real advantage vs. the alternative |
| FAQ answer | ≤ 280 chars | direct answer first, then the reassurance |
| Announcement | ≤ 50 chars each | offer · shipping · guarantee |

## STEP 6 — OUTPUT (in this order, nothing else)

- **A. Strategy:** step 1.
- **B. Brand sheet:** name, tagline, voice, a palette table (setting id → hex → where it is used), fonts, radius.
- **C. Offer:** price, bundle ladder, margin table, threshold, upsell, Shopify discount steps.
- **D. `templates/product.<handle>.json`**: complete, in a ```json block.
- **E. `templates/index.json`**: complete, in a ```json block.
- **F. `templates/page.<handle>-listicle.json`**: complete, in a ```json block.
- **G. Cart bar:** the two values to put in `snippets/ck-cart-progress.liquid` (`ck_threshold` in cents, and `ck_reward`).
- **H. Images:** a shot list of 7 gallery images in order (hero on white, in use, close-up of the key feature, infographic with 3 callouts, scale/size, before/after or problem/solution, what's in the box). Add 6 section images. Give each an AI image prompt.
- **I. Reviews plan:** how to get the first 20 real reviews in 14 days. Include a review-app setup, a post-purchase email asking for a photo review, and the exact email text.
- **J. Launch checklist:** at most 12 checkboxes.
- **K. 5 ad hooks:** they must match the page headline and the hook line.

### JSON rules

- Shape: `{ "sections": { "<key>": { "type": "...", "settings": {...}, "blocks": { "<id>": { "type": "...", "settings": {...} } }, "block_order": ["<id>", ...] } }, "order": ["<key>", ...] }`
- Section keys and block IDs: short, lowercase, unique (`main`, `tier`, `faq_1`).
- **Leave out every `image_picker` setting.** Images are uploaded in the theme editor afterwards. Also leave out settings you keep at their default.
- `product` settings take the product **handle** as a string.
- `richtext` values must be wrapped in `<p>…</p>`. `inline_richtext` allows only `<strong>`, `<em>` and `<a>`. In `textarea`, use `\n` between lines.
- `range` values must sit inside min–max **and** land exactly on the step.
- `url` values start with `/`, `#` or `https://`.
- No comments, no trailing commas, at most 25 sections per file.

### Self-check before you answer

- [ ] Every section type, block type and setting ID exists in the reference.
- [ ] Every range value is on its step. Every select value is one of its options.
- [ ] No invented reviews, ratings, numbers, logos or timers. Placeholders are flagged.
- [ ] The headline, hook, hero and ad hooks all carry the same promise.
- [ ] Bundle tier 2 is pre-selected, and the tier 3 margin is ≥ 45%.
- [ ] The free shipping threshold sits between the tier 1 price and the tier 2 total.
- [ ] Neighbouring sections use different `scheme` values.
- [ ] Every contrast pair reaches 4.5:1.

---

## SECTION REFERENCE (generated from the theme code; do not edit by hand)

<!-- SCHEMA:START -->

#### `ck-brand` — CK Brand
- settings: `primary` (color) = "#111827"; `primary_text` (color) = "#ffffff"; `button` (color) = "#111827"; `button_text` (color) = "#ffffff"; `accent` (color) = "#ef4444"; `accent_text` (color) = "#ffffff"; `accent_soft` (color) = "#fef2f2"; `background` (color) = "#ffffff"; `surface` (color) = "#f5f5f3"; `card` (color) = "#ffffff"; `text` (color) = "#111827"; `muted` (color) = "#6b7280"; `border` (color) = "#e5e7eb"; `star` (color) = "#f5b301"; `success` (color) = "#15803d"; `dark` (color) = "#0d0d0f"; `apply_page_bg` (checkbox) = true; `heading_font` (font_picker) = "assistant_n4"; `heading_weight` (select [500 | 600 | 700 | 800]) = "700"; `uppercase_headings` (checkbox) = false; `body_font` (font_picker) = "assistant_n4"; `radius` (range 0–28 step 2) = 14; `button_shape` (select [pill | rounded | square]) = "pill"; `uppercase_buttons` (checkbox) = true

#### `ck-announcement` — CK Announcement
- settings: `bg` (color) = "#111827"; `color` (color) = "#ffffff"; `speed` (range 2–10 step 1) = 4
- block `message`: `text` (inline_richtext) = "Free shipping on orders over $50"; `link` (url)

#### `ck-hero` — CK Hero
- settings: `layout` (select [split | rev | center]) = "split"; `rating` (range 3–5 step 0.1) = 4.8; `rating_text` (text); `eyebrow` (text); `heading` (inline_richtext) = "The headline that <em>matches your ad</em>"; `byline` (text); `text` (richtext) = "<p>One or two sentences that state the result your customer wants.</p>"; `bullets` (textarea) = "Free shipping\n30-day guarantee"; `button_label` (text) = "Shop now"; `button_link` (url); `trust_text` (text) = "30-day money-back guarantee"; `image` (image_picker); `product` (product); `scheme` (select [default | surface | accent | primary | dark]) = "surface"; `padding_top` (range 0–140 step 4) = 64; `padding_bottom` (range 0–140 step 4) = 64

#### `ck-ticker` — CK Ticker / Logos
- settings: `label` (text); `speed` (range 10–80 step 2) = 30; `scheme` (select [default | surface | accent | primary | dark]) = "primary"; `padding_top` (range 0–80 step 2) = 14; `padding_bottom` (range 0–80 step 2) = 14
- block `item`: `text` (text) = "Free shipping over $50"; `icon` (select [none | check | star | truck | shield | return | heart | leaf | sparkles | paw | bolt | award | users]) = "check"; `logo` (image_picker)

#### `ck-product` — CK Product
- settings: `product` (product); `gallery_side` (select [left | right]) = "left"; `show_thumbs` (checkbox) = true; `gallery_badge` (text); `gallery_badge_icon` (select [none | award | star | sparkles | heart | bolt | shield | leaf]) = "award"; `sticky_info` (checkbox) = true; `after_add` (select [drawer | cart | checkout]) = "drawer"; `padding_top` (range 0–120 step 4) = 32; `padding_bottom` (range 0–120 step 4) = 56
- block `@app`: review-app / app blocks (no settings, added in the editor)
- block `rating` (max 1): `use_metafields` (checkbox) = true; `rating` (range 3–5 step 0.1) = 4.8; `count_text` (text); `label` (text) = "Rated"; `star_style` (select [default | boxed]) = "default"
- block `title` (max 1): `title` (text)
- block `subtitle`: `text` (inline_richtext) = "<strong>One-line promise</strong> that matches your ad."
- block `price` (max 1): `show_save` (checkbox) = true; `save_format` (select [percent | amount]) = "percent"; `save_label` (text) = "Save"
- block `benefits`: `items` (textarea) = "Main benefit|in plain words\nSecond benefit|that removes a worry\nThird benefit|that proves it works"; `icon` (select [check | star | heart | bolt | leaf | sparkles | paw | arrow]) = "check"; `style` (select [plain | boxed]) = "plain"
- block `highlight`: `icon` (select [gift | truck | percent | bolt | sparkles | clock]) = "gift"; `text` (inline_richtext) = "Free shipping on orders over $50"
- block `social_proof`: `avatar_1` (image_picker); `avatar_2` (image_picker); `avatar_3` (image_picker); `text` (inline_richtext) = "Loved by <strong>10,000+</strong> customers"
- block `variant_picker` (max 1): `hide_option` (text)
- block `bundles` (max 1): `heading` (text) = "Bundle & save"; `layout` (select [stack | grid]) = "stack"; `default_tier` (range 1–4 step 1) = 2; `price_display` (select [total | unit]) = "total"; `unit_label` (text) = "/each"; `save_text` (text) = "Save [percent]%"; `show_images` (checkbox) = true; `tier1_enabled` (checkbox) = true; `tier1_title` (text) = "Buy 1"; `tier1_qty` (range 1–10 step 1) = 1; `tier1_free` (range 0–5 step 1) = 0; `tier1_discount` (range 0–80 step 1) = 0; `tier1_badge` (text); `tier1_note` (text); `tier1_gift` (text); `tier1_perks` (textarea); `tier1_variant` (text); `tier2_enabled` (checkbox) = true; `tier2_title` (text) = "Buy 2, Get 1 Free"; `tier2_qty` (range 1–10 step 1) = 3; `tier2_free` (range 0–5 step 1) = 1; `tier2_discount` (range 0–80 step 1) = 0; `tier2_badge` (text) = "Most popular"; `tier2_note` (text); `tier2_gift` (text); `tier2_perks` (textarea); `tier2_variant` (text); `tier3_enabled` (checkbox) = true; `tier3_title` (text) = "Buy 3, Get 2 Free"; `tier3_qty` (range 1–10 step 1) = 5; `tier3_free` (range 0–5 step 1) = 2; `tier3_discount` (range 0–80 step 1) = 0; `tier3_badge` (text) = "Best value"; `tier3_note` (text); `tier3_gift` (text); `tier3_perks` (textarea); `tier3_variant` (text); `tier4_enabled` (checkbox) = false; `tier4_title` (text) = "Buy 4"; `tier4_qty` (range 1–10 step 1) = 4; `tier4_free` (range 0–5 step 1) = 0; `tier4_discount` (range 0–80 step 1) = 40; `tier4_badge` (text); `tier4_note` (text); `tier4_gift` (text); `tier4_perks` (textarea); `tier4_variant` (text)
- block `stock` (max 1): `threshold` (range 1–50 step 1) = 10; `low_text` (text) = "Only [count] left in stock"; `fallback_text` (text) = "In stock, ready to ship"
- block `delivery` (max 1): `icon` (select [truck | box | clock | globe]) = "truck"; `text` (text) = "Order today, get it <strong>[start] – [end]</strong>"; `min_days` (range 1–30 step 1) = 5; `max_days` (range 1–45 step 1) = 9; `skip_weekends` (checkbox) = true
- block `countdown` (max 1): `end` (text); `label` (text) = "Sale ends in"
- block `buy_buttons` (max 1): `label` (text) = "Add to cart"; `soldout_label` (text) = "Sold out"; `show_price` (checkbox) = true; `pulse` (checkbox) = false; `show_dynamic_checkout` (checkbox) = false; `subtext` (text) = "30-day money-back guarantee"; `sub_icon` (select [none | shield | truck | lock | return]) = "shield"
- block `guarantees`: `items` (textarea) = "truck|Free shipping|On orders $50+\nreturn|30-day returns|Hassle free\nshield|Secure checkout|SSL encrypted"
- block `payment_icons` (max 1): `label` (text) = "Secure checkout"
- block `review`: `rating` (range 1–5 step 1) = 5; `text` (textarea); `name` (text) = "Customer"; `verified` (checkbox) = true; `avatar` (image_picker); `is_placeholder` (checkbox) = false
- block `accordion`: `title` (text) = "Description"; `icon` (select [none | box | truck | return | leaf | flask | chat | sparkles]) = "none"; `use_description` (checkbox) = false; `content` (richtext); `open` (checkbox) = false; `first` (checkbox) = false
- block `upsell`: `heading` (text) = "Frequently bought together"; `product` (product); `label` (text); `subtext` (text); `checked` (checkbox) = false
- block `notice`: `icon` (select [clock | truck | gift | sparkles | chat]) = "clock"; `text` (inline_richtext) = "Ships from our US warehouse"
- block `text`: `text` (richtext) = "<p>Add any text here.</p>"; `align` (select [left | center]) = "left"
- block `custom_liquid`: `liquid` (liquid)

#### `ck-sticky-atc` — CK Sticky add to cart
- settings: `product` (product); `label` (text) = "Add to cart"; `action` (select [add | scroll]) = "add"; `show_mobile` (checkbox) = true; `show_desktop` (checkbox) = true

#### `ck-benefits` — CK Benefits
- settings: `layout` (select [grid | alternating | numbered | listicle]) = "grid"; `columns` (select [2 | 3 | 4]) = "3"; `eyebrow` (text); `heading` (inline_richtext) = "Why customers <em>love</em> it"; `subheading` (text); `align` (select [center | left]) = "center"; `button_label` (text); `button_link` (url); `footnote` (text); `scheme` (select [default | surface | accent | primary | dark]) = "default"; `padding_top` (range 0–140 step 4) = 72; `padding_bottom` (range 0–140 step 4) = 72
- block `benefit`: `icon` (select [none | check | truck | shield | return | star | heart | leaf | lock | clock | gift | award | sparkles | bolt | moon | drop | paw | chat | box | percent | thumb | smile | sun | flask | globe | users]) = "check"; `image` (image_picker); `label` (text); `title` (text) = "Benefit title"; `text` (richtext) = "<p>Explain the benefit in one or two sentences.</p>"

#### `ck-image-text` — CK Image + text
- settings: `image` (image_picker); `image_side` (select [left | right]) = "left"; `eyebrow` (text); `heading` (inline_richtext) = "More than a product, <em>a better routine</em>"; `text` (richtext) = "<p>Describe the transformation or the problem this solves.</p>"; `checks` (textarea) = "First proof point\nSecond proof point\nThird proof point"; `button_label` (text) = "Shop now"; `button_link` (url); `scheme` (select [default | surface | accent | primary | dark]) = "default"; `padding_top` (range 0–140 step 4) = 72; `padding_bottom` (range 0–140 step 4) = 72

#### `ck-stats` — CK Stats
- settings: `eyebrow` (text); `heading` (inline_richtext) = "The numbers <em>speak</em>"; `subheading` (text); `image` (image_picker); `footnote` (text); `scheme` (select [default | surface | accent | primary | dark]) = "primary"; `padding_top` (range 0–140 step 4) = 72; `padding_bottom` (range 0–140 step 4) = 72
- block `stat`: `prefix` (text); `value` (text) = "97"; `suffix` (text) = "%"; `label` (text) = "say they would buy again"

#### `ck-timeline` — CK Timeline
- settings: `eyebrow` (text); `heading` (inline_richtext) = "What to <em>expect</em>"; `subheading` (text); `footnote` (text) = "Everyone is different. Results vary."; `scheme` (select [default | surface | accent | primary | dark]) = "default"; `padding_top` (range 0–140 step 4) = 72; `padding_bottom` (range 0–140 step 4) = 72
- block `step`: `icon` (select [none | box | truck | sparkles | heart | star | clock | sun | moon | smile]) = "none"; `label` (text) = "Day 1"; `title` (text) = "First use"; `text` (richtext) = "<p>What the customer notices at this point.</p>"

#### `ck-comparison` — CK Comparison
- settings: `layout` (select [table | cards]) = "table"; `eyebrow` (text); `heading` (inline_richtext) = "Us vs. <em>them</em>"; `subheading` (text); `us_label` (text); `us_logo` (image_picker); `them_label` (text) = "Others"; `button_label` (text); `button_link` (url); `scheme` (select [default | surface | accent | primary | dark]) = "default"; `padding_top` (range 0–140 step 4) = 72; `padding_bottom` (range 0–140 step 4) = 72
- block `row`: `feature` (text) = "Feature"; `us_text` (text) = "yes"; `them_text` (text) = "no"

#### `ck-reviews` — CK Reviews
- settings: `eyebrow` (text); `heading` (inline_richtext) = "Real customers, <em>real results</em>"; `subheading` (text); `show_summary` (checkbox) = true; `product` (product); `rating` (range 3–5 step 0.1) = 4.8; `count_text` (text); `layout` (select [masonry | grid | carousel]) = "masonry"; `columns` (select [2 | 3 | 4]) = "3"; `scheme` (select [default | surface | accent | primary | dark]) = "surface"; `padding_top` (range 0–140 step 4) = 72; `padding_bottom` (range 0–140 step 4) = 72
- block `@app`: review-app / app blocks (no settings, added in the editor)
- block `review`: `rating` (range 1–5 step 1) = 5; `title` (text); `text` (textarea); `name` (text) = "Customer"; `meta` (text); `verified` (checkbox) = true; `image` (image_picker); `is_placeholder` (checkbox) = false

#### `ck-guarantee` — CK Guarantee
- settings: `days` (text) = "30"; `seal_text` (text) = "Day money-back guarantee"; `heading` (inline_richtext) = "Try it <em>risk-free</em>"; `text` (richtext) = "<p>If you are not happy, email us within 30 days for a full refund. No forms, no hassle.</p>"; `trust` (text) = "Free returns, Fast support, Secure checkout"; `button_label` (text) = "Claim my discount"; `button_link` (url); `scheme` (select [default | surface | accent | primary | dark]) = "surface"; `padding_top` (range 0–140 step 4) = 72; `padding_bottom` (range 0–140 step 4) = 72

#### `ck-faq` — CK FAQ
- settings: `eyebrow` (text); `heading` (inline_richtext) = "Questions? <em>Answered.</em>"; `subheading` (text); `open_first` (checkbox) = false; `contact_text` (inline_richtext) = "Still unsure? Email us and a real person replies within 24 hours."; `schema_markup` (checkbox) = true; `scheme` (select [default | surface | accent | primary | dark]) = "default"; `padding_top` (range 0–140 step 4) = 72; `padding_bottom` (range 0–140 step 4) = 72
- block `question`: `question` (text) = "How long does shipping take?"; `answer` (richtext) = "<p>Give a clear, honest answer.</p>"

<!-- SCHEMA:END -->

---

## MINI EXAMPLE (format only)

```json
{
  "sections": {
    "brand": { "type": "ck-brand", "settings": { "primary": "#0f4c4a", "button": "#ff6b4a", "heading_font": "poppins_n7", "body_font": "nunito_sans_n4", "radius": 20 } },
    "main": {
      "type": "ck-product",
      "blocks": {
        "rating": { "type": "rating", "settings": { "count_text": "" } },
        "title": { "type": "title", "settings": {} },
        "tier": { "type": "bundles", "settings": { "tier2_note": "One for the couch, car and bed" } },
        "buy": { "type": "buy_buttons", "settings": { "label": "Add to cart" } }
      },
      "block_order": ["rating", "title", "tier", "buy"]
    }
  },
  "order": ["brand", "main"]
}
```
