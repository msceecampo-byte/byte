// Drop 01 catalogue. Prices are placeholders — confirm against supplier
// costings before launch. When moving to Shopify, each entry maps to one
// product with a "Colour" and "Size" option.

const FS = {
  forest: "#1F3A2B",
  cream: "#F7F1E8",
  ivory: "#FBF8F3",
  blush: "#F2D4D7",
  rose: "#C98A94",
  claret: "#7A2837",
  sage: "#8FA88A",
  sageDeep: "#5E7A5A",
  ink: "#1C1C1C",
  white: "#FFFFFF",
};

const SIZES = ["XS", "S", "M", "L", "XL"];

const PRODUCTS = [
  {
    id: "clubhouse-knit-polo",
    name: "The Clubhouse Knit Polo",
    category: "tops",
    type: "knitPolo",
    price: 78,
    badge: "Signature",
    blurb: "Soft rib knit with contrast tipping.",
    description:
      "Our take on the heritage golf knit, cut for a modern, slightly cropped fit that sits at the high waist of a pleated skort. Breathable cotton-blend knit keeps its shape from the first tee to the clubhouse.",
    features: ["Breathable cotton-modal rib knit", "Contrast collar and cuffs", "Three-button placket", "Embroidered FS crest"],
    colors: [
      { name: "Blush", body: FS.blush, trim: FS.ivory, accent: FS.claret, bg: "#F6E7E4" },
      { name: "Cream", body: FS.ivory, trim: FS.cream, accent: FS.forest, bg: "#EFE9DE" },
      { name: "Claret", body: FS.claret, trim: FS.ivory, accent: FS.ivory, bg: "#EEDCDC" },
    ],
  },
  {
    id: "back-nine-pleated-skort",
    name: "The Back Nine Pleated Skort",
    category: "bottoms",
    type: "pleatedSkirt",
    price: 72,
    badge: "Bestseller",
    blurb: "Knife pleats, built-in shorts, ball pocket.",
    description:
      "Sixteen crisp knife pleats that move with your swing, over built-in shorts with a hidden ball pocket. The striped hem is a nod to the tipping on our polos, so the whole outfit reads as one.",
    features: ["Four-way stretch woven", "Built-in shorts with ball pocket", "Striped hem detail", "UPF 50+"],
    colors: [
      { name: "White / Blush", body: FS.white, trim: FS.forest, accent: FS.rose, bg: "#F4EEE6" },
      { name: "Claret", body: FS.claret, trim: FS.ivory, accent: FS.blush, bg: "#EEDCDC" },
      { name: "Sage", body: FS.sage, trim: FS.ivory, accent: FS.forest, bg: "#E4EADF" },
    ],
  },
  {
    id: "dawn-patrol-quarter-zip",
    name: "The Dawn Patrol Quarter-Zip",
    category: "tops",
    type: "quarterZip",
    price: 88,
    badge: "UPF 50+",
    blurb: "Long-sleeve sun layer for early tee times.",
    description:
      "For the first group out, when the dew's still on the grass and the sun's coming in low. Lightweight performance jersey with UPF 50+ protection, a mock neck and a zip you can open once the day warms up.",
    features: ["UPF 50+ — blocks 98% of UV", "Moisture-wicking, quick-dry", "Anti-odour finish", "Thumb-friendly zip pull"],
    colors: [
      { name: "Ivory", body: FS.ivory, trim: FS.cream, accent: FS.forest, bg: "#EFE9DE" },
      { name: "Sage", body: FS.sage, trim: FS.sageDeep, accent: FS.ivory, bg: "#E4EADF" },
      { name: "Blush", body: FS.blush, trim: FS.rose, accent: FS.claret, bg: "#F6E7E4" },
    ],
  },
  {
    id: "members-polo-dress",
    name: "The Members' Polo Dress",
    category: "dresses",
    type: "dress",
    price: 118,
    blurb: "A knit polo top on a pleated skirt.",
    description:
      "One piece, fully dressed. A fitted knit polo bodice with contrast collar, joined to a fine-pleated skirt and built-in shorts. Ready for the course, and just as ready for the drinks afterwards.",
    features: ["Knit bodice, woven pleated skirt", "Built-in shorts", "Contrast collar and waist band", "UPF 50+ skirt fabric"],
    colors: [
      { name: "White / Blush", body: FS.white, trim: FS.blush, accent: FS.rose, bg: "#F6E7E4" },
      { name: "White / Sage", body: FS.white, trim: FS.sage, accent: FS.forest, bg: "#E4EADF" },
    ],
  },
  {
    id: "starter-tipped-polo",
    name: "The Starter Tipped Polo",
    category: "tops",
    type: "polo",
    price: 68,
    blurb: "Performance piqué, clean tipped edges.",
    description:
      "The polo you'll reach for every round. Lightweight performance piqué with a fine tipped edge at the collar and sleeves, cut for a full swing without riding up.",
    features: ["Performance piqué", "Moisture-wicking, 4-way stretch", "Tipped collar and cuffs", "Embroidered FS mark"],
    colors: [
      { name: "White / Forest", body: FS.white, trim: FS.forest, accent: FS.forest, bg: "#EFE9DE" },
      { name: "Forest", body: FS.forest, trim: FS.ivory, accent: FS.ivory, bg: "#E1E6DE" },
      { name: "Blush", body: FS.blush, trim: FS.ivory, accent: FS.claret, bg: "#F6E7E4" },
    ],
  },
  {
    id: "scorecard-wrap-skort",
    name: "The Scorecard Wrap Skort",
    category: "bottoms",
    type: "wrapSkort",
    price: 74,
    blurb: "Wrap front with a tie bow and piped edges.",
    description:
      "A wrap-front skort with a sculpted tie bow and contrast piping that frames the silhouette. Built-in shorts and a phone-deep side pocket keep it practical.",
    features: ["Stretch woven with soft hand-feel", "Built-in shorts", "Contrast piping", "Bow tie detail at the waist"],
    colors: [
      { name: "White / Forest", body: FS.white, trim: FS.forest, accent: FS.forest, bg: "#EFE9DE" },
      { name: "White / Claret", body: FS.white, trim: FS.claret, accent: FS.claret, bg: "#F6E7E4" },
    ],
  },
  {
    id: "range-day-cable-vest",
    name: "The Range Day Cable Vest",
    category: "tops",
    type: "vest",
    price: 92,
    blurb: "Cable knit sweater vest with striped trim.",
    description:
      "Named for all those evenings on the range. A classic cable-knit sweater vest with a striped V-neck, cut to layer over a polo or quarter-zip when the evening cools down.",
    features: ["Cotton-cashmere blend", "Striped V-neck and hem", "Relaxed layering fit", "Hand wash cold"],
    colors: [
      { name: "Cream", body: FS.ivory, trim: FS.forest, accent: FS.forest, bg: "#EFE9DE" },
      { name: "Blush", body: FS.blush, trim: FS.claret, accent: FS.claret, bg: "#F6E7E4" },
    ],
  },
  {
    id: "society-cap",
    name: "The Society Cap",
    category: "accessories",
    type: "cap",
    price: 38,
    sizes: ["One size"],
    blurb: "Six-panel cotton cap, embroidered FS.",
    description:
      "An unstructured six-panel cap in washed cotton twill with the FS monogram embroidered on the front. The adjustable strap and soft crown mean it works with a ponytail.",
    features: ["Washed cotton twill", "Embroidered FS monogram", "Adjustable brass buckle", "Ponytail-friendly back"],
    colors: [
      { name: "Cream", body: FS.ivory, trim: FS.ivory, accent: FS.forest, bg: "#EFE9DE" },
      { name: "Forest", body: FS.forest, trim: FS.forest, accent: FS.ivory, bg: "#E1E6DE" },
      { name: "Blush", body: FS.blush, trim: FS.blush, accent: FS.claret, bg: "#F6E7E4" },
    ],
  },
  {
    id: "society-visor",
    name: "The Society Visor",
    category: "accessories",
    type: "visor",
    price: 34,
    sizes: ["One size"],
    blurb: "Sun on your face, not in your eyes.",
    description:
      "A tall-crown visor with a curved brim and a stretch-fit band. The moisture-wicking sweatband keeps you comfortable on a hot afternoon.",
    features: ["Stretch-fit band", "Moisture-wicking sweatband", "Contrast brim edge", "Embroidered FS monogram"],
    colors: [
      { name: "White / Forest", body: FS.white, trim: FS.forest, accent: FS.forest, bg: "#EFE9DE" },
      { name: "Blush / Claret", body: FS.blush, trim: FS.claret, accent: FS.claret, bg: "#F6E7E4" },
    ],
  },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "tops", label: "Tops" },
  { id: "bottoms", label: "Skorts" },
  { id: "dresses", label: "Dresses" },
  { id: "accessories", label: "Accessories" },
];

const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
