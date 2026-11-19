# Sample run: Furlo pet hair roller

This is the prompt's output for a sample product. Sections D–F are the files in `templates/`. Open `preview/product.html`, `preview/home.html` and `preview/listicle.html` to see them rendered.

**Input used**

```
PRODUCT_NAME:            Reusable pet hair remover roller
WHAT_IT_DOES:            Roll it back and forth over furniture. Ratchet bristles lift pet hair into a chamber. Open the lid to empty. No sticky sheets, no batteries.
PRODUCT_HANDLE:          furlo-roller
LANDED_COST_PER_UNIT:    6.40
TARGET_PRICE:            (blank)
COMPARE_AT_PRICE:        (blank)
VARIANTS:                none
SHIPPING_DAYS:           5-9
SHIPS_FROM:              US warehouse
GUARANTEE:               60-day money back
FREE_GIFT:               Mini travel roller, supplier packs it with 5-unit orders (cost 1.10)
ADD_ON_PRODUCT_HANDLE:   furlo-mini
REAL_REVIEWS:            none yet
REAL_NUMBERS:            none yet
BRAND_NAME:              (blank)
SUPPORT_EMAIL:           hello@furlo.co
```

---

## A. Strategy

- **Customer:** dog or cat owner, 28–55, with fabric furniture. The problem bites right before guests come over, or when they sit on the couch in dark clothes. They have tried sticky lint rollers (run out, surface only) and vacuums (loud, heavy, miss the weave).
- **Pains:** "my couch is more fur than fabric" · "I go through a pack of lint rollers a week" · "the vacuum doesn't get it out of the cushions" · "embarrassed when people visit" · "fur on every black outfit".
- **Outcomes:** a couch that looks clean · no refills · done in minutes · happy to have guests · keep the pet on the furniture without guilt.
- **Objections → answered by:** does it work on short hair → FAQ q1 · will it damage fabric → bullets + FAQ q2 · how do I empty it → accordion + FAQ q3 · shipping time → delivery block + FAQ q4 · what if it doesn't work → guarantee section · why not a lint roller → comparison table.
- **Mechanism:** angled ratchet bristles comb fur *out of* the weave and trap it in a sealed chamber.
- **Core angle:** "Pet hair, gone in one roll. No sticky sheets, ever."
- **Alternate hooks:** "I threw out my lint rollers" · "Watch what comes out of my couch" · "The $25 fix for a furry car".
- **Why buy more:** fur lives in many places: couch, car, bed, and a friend who has a dog.
- ASSUMPTION: price set at $24.95 (3.9× landed cost) with no compare-at price, because none was given.

## B. Brand sheet

**Furlo**: *Pet hair, gone in one roll.* Voice: warm, plain, a bit playful. Use: fur, couch, roll, gone, easy. Avoid: revolutionary, elevate, premium, ultimate, hack.

| Setting | Hex | Used for |
|---|---|---|
| primary | `#0e4d4a` | deep teal: announcement, ticker, selected bundle, timeline dots |
| button | `#c93f17` | burnt coral: every buy button and highlighted heading words (4.99:1 on white text) |
| accent / accent_text | `#ffc24b` / `#3a2600` | "Most popular" / "Best value" badges (8.97:1) |
| accent_soft | `#fff1d6` | reviews section background |
| background / surface | `#fff9f2` / `#fbf0e4` | warm cream page, alternate sections |
| text / muted | `#1f2a2a` / `#5b6766` | body (14.1:1) / secondary (5.6:1) |
| success | `#15803d` | savings pills (5.02:1) |

Fonts: Poppins 700 headings, Nunito Sans body. Radius 20, pill buttons. This follows the matrix's pets row: friendly, rounded, warm. The teal and coral echo the product's own colours.

## C. Offer

| Tier | Units | Price | Landed cost | Gross profit | Margin | Break-even CPA |
|---|---|---|---|---|---|---|
| Buy 1 | 1 | $24.95 | $6.40 | $18.55 | 74% | $18.55 |
| Buy 2, Get 1 Free (pre-selected) | 3 | $49.90 | $19.20 | $30.70 | 62% | $30.70 |
| Buy 3, Get 2 Free + Mini | 5 + gift | $74.85 | $33.10 | $41.75 | 56% | $41.75 |

All figures are before payment fees (about 2.9% + 30¢). Free shipping threshold: **$35**. That is above the $24.95 single price and below the $49.90 tier 2 total, so tier 2 "unlocks" free shipping. Upsell: Furlo Mini at $9.95.

**Shopify discount setup**
1. Discounts → Create discount → **Buy X get Y** → Automatic. Name: "Buy 2 Get 1 Free". Customer buys 2 of *Furlo Pet Hair Roller*, gets 1 *Furlo Pet Hair Roller* at 100% off, max uses per order 1. Leave combinations unticked.
2. Same again: "Buy 3 Get 2 Free". Buys 3, gets 2 free, max uses per order 1.
3. Shopify applies the better of the two automatically.
4. Free gift: tell the supplier to pack one Mini with every 5-unit order. Or use a free-gift app. Do not promise it until one of these is set up.
5. Shipping: Settings → Shipping → free shipping rate for orders over $35.

## G. Cart bar + popup

In `snippets/ck-cart-progress.liquid`: `m1 = 3500` / `'Free shipping'`, `m2 = 6000` / `'Free gift'` (only once the Mini free-gift discount exists). Popup code: create **FURLO10** (10% off, one use per customer) before launch.

The before/after slider, hotspot image and video reels use illustrations and placeholders in the sample. Swap in a real unedited photo pair and real creator clips before running ads.

## H. Images

Gallery, in order:
1. **Hero on cream:** roller at a 20° angle, soft shadow. *Prompt: "studio product photo, teal and coral pet hair roller, cream seamless background, soft shadow, 45° angle, high detail, e-commerce hero"*
2. **In use:** hand rolling across a grey fabric couch, fur visible on one half only.
3. **Close-up:** open chamber packed with fur (the "satisfying" shot; also your best ad thumbnail).
4. **Infographic:** 3 callouts: angled bristles · sealed chamber · soft-grip handle.
5. **Scale:** in a hand, next to a phone.
6. **Before/after:** the same cushion, split image.
7. **In the box:** roller + quick-start card (+ Mini for the bundle).

Section images: the problem couch with used lint sheets (image + text), and 7 listicle images: dog on couch, roller on bed, car seat, open chamber, cat tree, gift box, guarantee badge.

## I. Reviews plan (first 20 in 14 days)

1. Install Judge.me (free). Turn on review request emails 10 days after fulfilment, with a photo prompt.
2. Email text: *"Hi {first name}, did Furlo get the fur? Reply with a photo of the full chamber and we'll send you a Furlo Mini free on your next order. Honest reviews only. 2 stars is fine if that's what it earned."*
3. Send 15 units to pet owners you know or local groomers in exchange for honest reviews. Mark them as "received free product" in Judge.me.
4. Replace the 6 placeholder blocks in the reviews section with the best real ones: one per objection.

## J. Launch checklist

- [ ] Product created, handle `furlo-roller`, price $24.95, theme template `furlo-roller`
- [ ] `furlo-mini` add-on product created
- [ ] 2 automatic BXGY discounts live; checkout tested for 1, 3 and 5 units
- [ ] Free shipping over $35 set
- [ ] 7 gallery images + section images uploaded
- [ ] Cart bar threshold set to 3500
- [ ] Judge.me installed; all placeholder reviews replaced or deleted
- [ ] Theme's own announcement bar off
- [ ] Policies pages (refund 60 days, shipping 5–9 days) match the page copy
- [ ] Page tested on a phone over 4G
- [ ] Meta pixel + Conversions API connected
- [ ] Listicle page created with template `furlo-listicle` for cold traffic

## K. Ad hooks (match the headline)

1. "I threw out every lint roller I owned. Here's why." → listicle
2. *(close-up video)* "Watch what came out of ONE couch cushion." → product page
3. "Dog people: stop buying sticky sheets." → product page
4. "My car seats were 50% golden retriever." → product page
5. "The couch-saving gadget pet parents are gifting each other." → product page, bundle angle
