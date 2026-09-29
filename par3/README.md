# PAR3 storefront prototype

A clickable prototype of a new, worldwide PAR3 store for men's golf apparel, stocked with the full live range from par3.com.sg. It's a static site with no build step, and it reuses the shop, product page and bag code from the Fairway Society prototype in the repo root.

```
cd par3
python3 -m http.server 8000
# open http://localhost:8000
```

| Page | What it is |
| --- | --- |
| `index.html` | Home: banner, trust strip, bestsellers, Shop the look, shirt multi-buy, shop by course conditions, categories, size finder, email signup |
| `shop.html` | All products, with category filters (`?c=shirts`, `shorts`, `pants`), course-condition filters (`?w=hot`) and sort |
| `product.html?id=…` | Product page: photo gallery (click to view full screen), colours, fit, sizes, size finder, size chart, local delivery time, related products |
| `about.html` | A short brand story |

## Products

Every product, price, colour, size, fit, photo and size chart comes from the live shop at par3.com.sg, through its public WooCommerce Store API. The import writes `assets/js/catalog.js` and saves the photos in `assets/img/shop/`. To pick up changes on par3.com.sg, run it again:

```
pip install pillow
python3 par3/tools/import_par3.py
```

Don't edit `catalog.js` by hand. Store-only extras live in `assets/js/products.js`, so a re-import never overwrites them: the categories, the course conditions, the best-seller list (`FEATURED`) and the looks (`LOOKS`).

- **Prices** are the shop's SGD prices, including current sale prices (shown struck through, with a "Save x%" badge). Shoppers in Singapore see the exact prices. Other countries see them converted with the indicative rates in `config.js` and rounded up to a tidy local price.
- **Swatch colours** are read from each colour's main photo.
- **Photos:** each colour's photos come from the shop. When the photoshoot is done, add the on-model photo as the **second** photo of a colour (it shows when a shopper hovers the product card). Re-importing would drop it, so from then on either add those photos on par3.com.sg first or keep a list of them in `products.js`.

## Engagement features

- **Country and currency.** 16 countries across Southeast Asia, North Asia, Australia/NZ and the US/UK/EU. Prices, the free-delivery threshold and delivery times change with the country, which is guessed from the browser language and can be changed from the header.
- **Shirt multi-buy.** Any 2 shirts save 10%, 3 or more save 15%, on top of sale prices. The bag shows how many more shirts unlock the next tier. This is a proposal, so check the margins before launch.
- **Size finder.** Height and weight (cm/kg or ft/lb) plus fit preference give a shirt size (S–4XL). An optional trouser waist picks the closest waist size for shorts and pants. Both are remembered and pre-selected on every product. Each product also shows its real size chart from the shop.
- **Shop by course conditions.** Hot & humid, mild, or cool & windy.
- **Shop the look.** A clickable outfit on the home page and on each piece's product page. Tap a piece or its + marker to select it, see every available colour, pick sizes and add the whole look to the bag in one go. Until there's an on-model photo, the look shows the product photos as a styled outfit. For an on-model photo, set `photo` in `LOOKS` and an `x`/`y` hotspot position for each piece.
- **Email signup with a welcome offer.** "10% off your first order" is a placeholder, so confirm the amount before launch.

## Photoshoot

`PHOTOSHOOT.md` is the brief for the photographer: the shot list, framing, sizes and file names for every photo slot on the site, including the full-width home page banner (`HERO` in `assets/js/config.js`).

## Before launch

1. **Logo.** `brand/pariii-logo-navy.svg`, `pariii-logo-white.svg` and `pariii-label.svg` were traced from the woven PARIII neck label in a product photo. They read well at header size, but the edges carry some of the fabric texture. Swap in the official vector artwork with the same file names when you have it.
2. **Colours and font.** Every colour sits in the `:root` block at the top of `assets/css/styles.css`. `--brand` is the label navy (#1A2139).
3. **Delivery and returns.** The regions, delivery days, fees and free-delivery thresholds in `config.js` are estimates. Check them against PAR3's current shipping terms and courier rates.
4. **Email.** Connect the signup form to Shopify Email or Klaviyo (see the `TODO` in `assets/js/app.js`).

## Moving to Shopify

Each product maps to one Shopify product with "Colour", "Size" and, where it applies, "Fit" options. `catalog.js` has everything needed for a product CSV import. Use Shopify Markets for local currencies and duties, and an automatic discount (buy 2 get 10%, buy 3 get 15% on the Shirts collection) for the multi-buy.
