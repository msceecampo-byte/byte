# PAR3 storefront prototype

A clickable prototype of a new, worldwide PAR3 store for men's golf apparel. It's a static site with no build step, and it reuses the shop, product page and bag code from the Fairway Society prototype in the repo root.

```
cd par3
python3 -m http.server 8000
# open http://localhost:8000
```

| Page | What it is |
| --- | --- |
| `index.html` | Home: hero, trust strip, bestsellers, polo multi-buy, shop by course conditions, categories, size finder, email signup |
| `shop.html` | All products, with category filters (`?c=polos`), course-condition filters (`?w=hot`) and sort |
| `product.html?id=…` | Product page: colours, sizes, size finder, local delivery time, related products |
| `about.html` | A short brand story |

## Engagement features

- **Country and currency.** 16 countries across Southeast Asia, North Asia, Australia/NZ and the US/UK/EU. Prices, the free-delivery threshold and delivery times change with the country, which is guessed from the browser language and can be changed from the header.
- **Polo multi-buy.** Any 2 polos save 10%, 3 or more save 15%. The bag shows how many more polos unlock the next tier.
- **Size finder.** Height and weight (cm/kg or ft/lb) plus fit preference give a recommended size, which is remembered and pre-selected on every product.
- **Shop by course conditions.** Hot & humid, mild, or cool & windy.
- **Email signup with a welcome offer.** "10% off your first order" is a placeholder, so confirm the amount before launch.

## Before launch: replace the placeholders

1. **Logo.** Save the logo from par3.com.sg as `brand/par3-logo.png`, or change `BRAND.logo` in `assets/js/config.js` to its file name. Until that file exists the header shows "PAR3" as plain text.
2. **Colours and font.** Every colour sits in the `:root` block at the top of `assets/css/styles.css`. Set `--brand`, `--accent` and `--font` to match par3.com.sg.
3. **Products.** `assets/js/products.js` holds a sample men's range. Replace names, prices, colours and descriptions with the real ones from par3.com.sg/shop. To use a photo, add `image: "assets/img/tour-polo-white.jpg"` to a colourway. Shoot at 4:5 on a plain light background.
4. **Prices.** Base prices are in USD (US$40–90) and converted with the indicative rates in `config.js`. They are above the current S$35–45 on par3.com.sg, so decide on final pricing per market.
5. **Delivery and returns.** The regions, delivery days, fees and free-delivery thresholds in `config.js` are estimates. Check them with your courier.
6. **Email.** Connect the signup form to Shopify Email or Klaviyo (see the `TODO` in `assets/js/app.js`).

## Moving to Shopify

Each product maps to one Shopify product with "Colour" and "Size" options. Use Shopify Markets for local currencies and duties, and an automatic discount (buy 2 get 10%, buy 3 get 15% on the Polos collection) for the multi-buy.
