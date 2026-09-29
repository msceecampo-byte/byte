// The PAR3 range, built from catalog.js (imported from par3.com.sg by
// tools/import_par3.py). Prices are the shop's SGD prices; config.js converts
// them for other countries. Store-only extras (course conditions, looks,
// badges) are added here so re-importing never overwrites them.
//
// Photos: each colour's `images` list is shown in order. The first is the
// main shot and the second shows when a shopper hovers the product card, so
// put on-model photos from the shoot second. Every photo appears in the
// clickable gallery on the product page.

const SIZES = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "shirts", label: "Shirts" },
  { id: "shorts", label: "Shorts" },
  { id: "pants", label: "Pants" },
];

const CONDITIONS = [
  { id: "hot", label: "Hot & humid", note: "Light, quick-dry and breathable" },
  { id: "mild", label: "Mild", note: "Easy all-rounders for any day" },
  { id: "cool", label: "Cool & windy", note: "Full-length cover without the weight" },
];

const CONDITIONS_BY_CATEGORY = { shirts: ["hot", "mild"], shorts: ["hot"], pants: ["mild", "cool"] };

// Short feature-style summaries ("Super soft, light weight & quick drying")
// read better as a list; longer ones are the product description.
const isFeatureList = (lines) => lines.length >= 3 && lines.every((l) => l.length < 60);

// A product without its own size chart uses its category's.
const chartFor = (p) => p.sizeChart || CATALOG.find((q) => q.category === p.category && q.sizeChart)?.sizeChart || null;

const PRODUCTS = CATALOG.filter((p) => p.colors.length).map((p) => {
  const listy = isFeatureList(p.summary);
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    was: p.was,
    badge: p.was ? `Save ${Math.round((1 - p.price / p.was) * 100)}%` : p.isNew ? "New" : null,
    conditions: CONDITIONS_BY_CATEGORY[p.category] || ["hot", "mild"],
    blurb: listy ? p.summary.slice(0, 2).join(" · ") : p.summary[0]?.split(/[.–-]\s/)[0] || "",
    description: listy ? "" : p.summary.join(" "),
    features: listy ? [...new Set([...p.summary, ...p.features])] : p.features,
    sizes: p.sizes,
    fits: p.fits,
    sizeChart: chartFor(p),
    source: p.source,
    colors: p.colors.map((c) => ({ name: c.name, body: c.hex, images: c.images })),
  };
});

const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
const productNamed = (name) => PRODUCTS.find((p) => p.name.toLowerCase() === name.toLowerCase());

// Outfits for the "Shop the look" section. Each piece is clickable.
// Until `photo` is set, the look shows the product photos as a styled outfit.
// For an on-model photo from the shoot, set `photo` and give each piece an
// `x`/`y` hotspot position in % of the photo (e.g. the shirt's chest).
const LOOKS = [
  {
    id: "weekend-round",
    title: "The Weekend Round",
    note: "A solid shirt lets the Nautical print do the talking. Try the shirt in all five colours.",
    photo: null,
    pieces: [
      { name: "PAR3 Solid Active Wear Shirt", color: "Black", x: 50, y: 30 },
      { name: "Nautical Golf Short", x: 50, y: 72 },
    ],
  },
]
  .map((look) => ({
    ...look,
    pieces: look.pieces
      .map((pc) => {
        const p = productNamed(pc.name);
        if (!p) return null;
        const color = Math.max(0, p.colors.findIndex((c) => c.name === pc.color));
        return { ...pc, product: p.id, color };
      })
      .filter(Boolean),
  }))
  .filter((look) => look.pieces.length > 1);

// Best sellers and the home page banner tiles, by product name.
const FEATURED = ["PAR3 Solid Active Wear Shirt", "Nautical Golf Short", "PAR3 Pilot Stripes Shirts", "PAR3 New Golf Polo Shirt"];
