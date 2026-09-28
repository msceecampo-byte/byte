# Fairway Society

Storefront prototype and logo system for Fairway Society, a golf apparel brand for young, self-taught, public-course golfers.

## Preview the site

It's a static site with no build step:

```
python3 -m http.server 8000
# open http://localhost:8000
```

| Page | What it is |
| --- | --- |
| `index.html` | Home: hero, featured pieces, fabric features, story teaser, waitlist |
| `shop.html` | Collection with category filters and sort (`?c=men` shows the menswear "coming soon" page) |
| `product.html?id=…` | Product page: colour swatches, sizes, add to bag, details |
| `story.html` | Brand story, launch timeline and founder quote |
| `brand.html` | Brand guide: logo before/after, logo files, palette, type, do's and don'ts |
| `marketing.html` | Marketing kit: Drop 01 posting plan, 16 downloadable assets with captions, and a copy bank |

The bag is saved in the browser. Checkout shows a "opens February 2027" message with a waitlist signup, because this is the design-first step before moving onto Shopify.

## Editing products

All products live in `assets/js/products.js`: names, prices, descriptions and colourways. Product images are illustrations drawn in each colourway (`assets/js/garments.js`). To use a photo instead, add `image: "path/to/photo.jpg"` to a colourway.

Prices are in SGD (S$79–119 for apparel, S$39–45 for accessories). They assume a supplier cost of up to S$20 per piece, which gives roughly a 4–6× markup. Free delivery starts at S$100. Change these in `assets/js/app.js` (`CURRENCY`, `FREE_SHIPPING_AT`).

## Logo files

Everything is in `brand/`. The text in each SVG is converted to outlines, so the files look the same everywhere and can go straight to an embroidery or print vendor.

- `wordmark-*` primary logo (with and without the "Golf · Leisure · Connection" tagline)
- `stacked-*` square version
- `monogram-*` FS monogram for embroidery and small sizes, in five options: interlocked (`monogram-forest`), `ring`, `crest`, `flag` and `tee`. See them compared on `brand.html`.
- `badge-*` circular seal
- `favicon.svg` browser-tab icon

To regenerate them after changing colours or spacing:

```
pip install fonttools uharfbuzz
python3 tools/build_logos.py
```

The fonts in `tools/fonts` (Great Vibes, Playfair Display, Montserrat) are from Google Fonts under the SIL Open Font License and are free for commercial use.

## Marketing kit

`marketing.html` lists every launch asset with its caption and when to post it. The images in `marketing/png/` are exported from `marketing/kit.html`, where each asset is drawn at its exact size (Instagram 1080×1350 and 1080×1920, email 1200×600, A5 poster, 5×7 in thank-you card, 2×4 in hang tag). Product names, prices and illustrations come from `products.js`, so they stay in sync.

To change an asset, edit `marketing/kit.html` and re-export:

```
npm i -g playwright
node tools/build_marketing.mjs
```

The export uses the fonts in `tools/fonts`. Only Montserrat Medium is bundled, so all sans text in the exports is set in that weight.

## Next steps toward the Shopify launch

1. Replace the illustrations with your own photos. Shoot product images at a 4:5 ratio (1600×2000 px is ideal) on a plain cream or light background, with the same lighting for every product. Save them as JPG or WebP under 400 KB, put them in `assets/img/`, and add `image: "assets/img/clubhouse-knit-polo-blush.jpg"` to that colourway in `products.js`.
2. Connect the waitlist forms to an email tool (Shopify Email or Klaviyo). Look for the `TODO` in `assets/js/app.js`.
3. Move the layout into a Shopify theme and load the products from `products.js` into Shopify.
