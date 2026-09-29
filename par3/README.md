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
| `product.html?id=…` | Product page: photo gallery (click to view full screen), colours, sizes, size finder, local delivery time, related products |
| `about.html` | A short brand story |

## Engagement features

- **Country and currency.** 16 countries across Southeast Asia, North Asia, Australia/NZ and the US/UK/EU. Prices, the free-delivery threshold and delivery times change with the country, which is guessed from the browser language and can be changed from the header.
- **Polo multi-buy.** Any 2 polos save 10%, 3 or more save 15%. The bag shows how many more polos unlock the next tier.
- **Size finder.** Height and weight (cm/kg or ft/lb) plus fit preference give a recommended size, which is remembered and pre-selected on every product.
- **Shop by course conditions.** Hot & humid, mild, or cool & windy.
- **Shop the look.** A clickable outfit on the home page and on each piece's product page. Tap a piece or its + marker to select it, see every available colour, pick sizes and add the whole look to the bag in one go. Until there's an on-model photo, an illustrated golfer (`assets/js/model.js`) wears the look: his shirt changes to the colour the shopper picks and his shorts use the real fabric print. Looks are set up in `LOOKS` in `assets/js/products.js`: add an on-model `photo` and an `x`/`y` hotspot position for each piece, and the photo replaces the illustration.
- **Email signup with a welcome offer.** "10% off your first order" is a placeholder, so confirm the amount before launch.

## Before launch: replace the placeholders

1. **Logo.** `brand/pariii-logo-navy.svg`, `pariii-logo-white.svg` and `pariii-label.svg` were traced from the woven PARIII neck label in a product photo. They read well at header size, but the edges carry some of the fabric texture. Swap in the official vector artwork with the same file names when you have it.
2. **Colours and font.** Every colour sits in the `:root` block at the top of `assets/css/styles.css`. `--brand` is the label navy (#1A2139). Check `--accent` and `--font` against par3.com.sg.
3. **Products and photos.** The PARIII Solid Active Wear Shirt, Nautical Golf Short and Shoulder Stripe Polo use real PAR3 photos. Their prices, and the Shoulder Stripe Polo's name and description, are placeholders to confirm. **Only the Black shirt photos are real. The Green, Navy Blue, Orange and Sky Blue shirt photos are recoloured previews made from them, so replace them with real photos (same file names, `assets/img/solid-shirt-<colour>-front/back.webp`) before launch.** The other products in `assets/js/products.js` are samples: replace their names, prices, colours and descriptions with the real ones from par3.com.sg/shop. Give each colourway `images: ["…main.jpg", "…on-model.jpg", "…detail.jpg"]`. The first is the main shot and the second shows when a shopper hovers the product card, so make that the photo of a person wearing it. Every photo appears in the product page gallery. Save photos in `assets/img/` as JPG or WebP under 400 KB, ideally at 4:5 (1600×2000 px).
4. **Prices.** Base prices are in USD (US$40–90) and converted with the indicative rates in `config.js`. They are above the current S$35–45 on par3.com.sg, so decide on final pricing per market.
5. **Delivery and returns.** The regions, delivery days, fees and free-delivery thresholds in `config.js` are estimates. Check them with your courier.
6. **Email.** Connect the signup form to Shopify Email or Klaviyo (see the `TODO` in `assets/js/app.js`).

## Moving to Shopify

Each product maps to one Shopify product with "Colour" and "Size" options. Use Shopify Markets for local currencies and duties, and an automatic discount (buy 2 get 10%, buy 3 get 15% on the Polos collection) for the multi-buy.
