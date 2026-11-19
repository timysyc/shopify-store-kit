# Store Kit: a free, Elixir-style conversion setup for any Shopify store

**Start here:** open [sample-store/preview/product.html](sample-store/preview/product.html) in your browser to see a finished store built with this kit.

## What's in the box

| Folder | What it is |
|---|---|
| `STORE-BUILDER-PROMPT.md` | The prompt. Paste it into Claude or ChatGPT with your product details. You get back a brand, an offer, and 3 ready-to-upload page templates. |
| `theme/` | 14 Shopify sections + snippets + 1 CSS + 1 JS file. They work in any Online Store 2.0 theme (Dawn, Refresh, Sense, etc.). |
| `tools/validate.mjs` | Checks the prompt's output before you upload, so Shopify never rejects it. |
| `tools/build-theme-zip.sh` | Merges the kit (and your templates) into your theme in one command. |
| `sample-store/` | The prompt run on a sample product ("Furlo" pet hair roller): brief, templates, and rendered previews. |

### The sections (same building blocks as the Elixir demo stores)

- **CK Product**: the buy box. Gallery with thumbnails, real review stars, hook line, benefit bullets, **Buy 1 / Buy 2 Get 1 / Buy 3 Get 2 bundle picker** (badges, savings pills, per-unit price, perks, free gift line), variant pills, delivery-date estimate, real low-stock line, sale countdown (real end date only), add to cart with the bundle price in the button, guarantee badges, payment icons, featured review, accordions, an add-on upsell, and Product schema for Google.
- **CK Sticky add to cart**: a bar that slides in when the main button scrolls away.
- **CK Brand**: one place for colours, fonts and corners. Every section follows it, so the store looks like one brand, not a dropshipping theme.
- **CK Announcement**: rotating offer bar.
- **CK Hero**: home hero, or a centred advertorial header with byline.
- **CK Ticker / Logos**: scrolling trust phrases or press logos.
- **CK Benefits**: 4 layouts: icon cards · alternating image rows · numbered list · **listicle pre-lander**.
- **CK Image + text**: problem → mechanism → proof.
- **CK Timeline**: "what to expect".
- **CK Stats**: count-up numbers with a source line.
- **CK Comparison**: us vs. them (table or two cards).
- **CK Reviews**: masonry, grid or carousel. Accepts review-app blocks (Judge.me, Loox, Okendo).
- **CK Guarantee**: big money-back seal.
- **CK FAQ**: accordion + FAQ schema for Google.
- **Cart drawer free-shipping bar** (snippet).

---

## Install (about 20 minutes)

### Option A: zip upload (no code)

1. In Shopify admin, go to **Online Store → Themes → ⋯ (on your theme) → Download theme file**. Shopify emails you a zip.
2. Run this in Terminal from the `store-kit` folder:

```bash
./tools/build-theme-zip.sh ~/Downloads/your-theme.zip sample-store/templates
```

   Swap `sample-store/templates` for the folder that holds your own generated templates, or leave it off to add only the sections.
3. Go to **Online Store → Themes → Add theme → Upload zip file** and pick `your-theme-with-kit.zip`. It arrives unpublished, so your live store is untouched.
4. Go to **Products → your product → Theme template** (right side) and choose your new template (e.g. `furlo-roller`).
5. On the new theme, click **Customize** and upload your images into the empty image slots (gallery images come from the product itself).
6. If your theme has its own announcement bar, turn it off so you don't get two.
7. Preview on your phone, then publish.

### Option B: paste into the code editor

**Online Store → Themes → ⋯ → Edit code**, then:
1. **Sections → Add a new section** for each file in `theme/sections/`. Use the same name without `.liquid`, then paste the contents.
2. **Snippets → Add a new snippet** for each file in `theme/snippets/`.
3. **Assets → Add a new asset → upload** `ck.css` and `ck.js`.
4. **Templates → Add a new template** (product, JSON), name it after your product, and paste the generated JSON.
5. Optional free-shipping bar: open `snippets/cart-drawer.liquid` and paste `{% render 'ck-cart-progress' %}` on the line above `<cart-drawer-items`.

### Option C: Shopify CLI (developers)

```bash
shopify theme pull --store your-store.myshopify.com
```

Copy `theme/*` and your templates into the pulled folder, then:

```bash
shopify theme push --unpublished
```

---

## Build a store for any product

1. Open `STORE-BUILDER-PROMPT.md`, copy everything below the line, fill in the `INPUT` block, and send it to Claude.
2. Save the 3 JSON blocks it returns as files in a new folder (e.g. `my-store/product.my-handle.json`, `my-store/index.json`, `my-store/page.my-handle-listicle.json`).
3. Check them:

```bash
node tools/validate.mjs my-store/*.json
```

4. If it prints errors, paste them back to Claude and say "fix these". Repeat until it says `All good.`
5. Install with Option A, passing `my-store` as the second argument.

## After install: make the offer real

1. **Bundles:** create the automatic discounts the prompt lists (Discounts → Create → *Buy X get Y* or *Amount off products*). The bundle cards show the price, and the discount is applied at checkout. Test checkout once per tier.
2. **Reviews:** install **Judge.me** (free plan). Stars and review counts then appear on their own in the buy box, the reviews section and the sticky bar. Until then they stay hidden instead of showing fake numbers.
3. **Free-shipping bar:** set `ck_threshold` (in cents) and `ck_reward` at the top of `snippets/ck-cart-progress.liquid`.
4. Replace every review marked **Placeholder** with a real one, or delete it.

## Editing the kit

After you change any section's `{% schema %}`, regenerate the prompt's section reference so the AI knows about it:

```bash
node tools/schema-ref.mjs
```
