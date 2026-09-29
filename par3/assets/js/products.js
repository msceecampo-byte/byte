// Men's range. The Shoulder Stripe Polo uses a real PAR3 photo; the rest are
// samples to replace with the products and photos from par3.com.sg/shop.
// Prices are in USD (see config.js for local pricing).
//
// Photos: give a colourway `images: [...]`. The first photo is the main shot;
// put the on-model photo second so it shows when a shopper hovers a product
// card. All photos appear in the clickable gallery on the product page.
// Each entry maps to one Shopify product with "Colour" and "Size" options.
// `conditions` drives the "Shop by course conditions" filter: hot, mild, cool.

const C = {
  white: "#FFFFFF",
  offWhite: "#F2F3F5",
  navy: "#1B2B45",
  black: "#1C1C1E",
  charcoal: "#3A3D42",
  grey: "#9AA0A8",
  stone: "#D8D2C4",
  khaki: "#B9A98A",
  red: "#C0392B",
  sky: "#8DB6D9",
  green: "#2F6B4F",
  mint: "#BFE0D0",
};

const BG = { light: "#EEF0F3", warm: "#F1EEE8", cool: "#E8EEF3", green: "#E7F0EB" };

const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

const PRODUCTS = [
  {
    id: "textured-dri-fit-polo",
    name: "Textured Dri-Fit Polo",
    category: "polos",
    type: "polo",
    price: 45,
    badge: "Bestseller",
    conditions: ["hot", "mild"],
    blurb: "Tonal texture, embroidered PARIII chest logo.",
    description:
      "A clean, classic polo in a lightweight knit with a subtle tonal stripe texture. Quick-dry and breathable, with a three-button placket and the PARIII logo embroidered on the chest. It goes with everything, especially our printed shorts.",
    features: ["Lightweight dri-fit knit with tonal texture", "Moisture-wicking and quick-dry", "Three-button placket", "Embroidered PARIII chest logo"],
    colors: [
      {
        name: "Black",
        body: C.black,
        trim: C.black,
        accent: C.white,
        bg: BG.light,
        images: ["assets/img/textured-polo-black-front.webp", "assets/img/textured-polo-black-back.webp"],
      },
    ],
  },
  {
    id: "heart-print-golf-shorts",
    name: "Heart Print Golf Shorts",
    category: "bottoms",
    type: "shorts",
    price: 59,
    badge: "New",
    conditions: ["hot"],
    blurb: "A bold all-over print that gets noticed on the tee.",
    description:
      "Tailored golf shorts with an all-over red and blue heart outline print on a dark navy base. Stretch fabric, a button waist with belt loops, and a PARIII logo on the back. Wear them with a solid polo and let the shorts do the talking.",
    features: ["Stretch woven fabric", "All-over printed pattern", "Button back pocket", "PARIII logo on back and waistband"],
    colors: [
      {
        name: "Navy Hearts",
        body: "#1E2436",
        trim: "#1E2436",
        accent: "#E4533A",
        bg: BG.cool,
        images: ["assets/img/heart-print-shorts-navy-front.webp", "assets/img/heart-print-shorts-navy-back.webp"],
      },
    ],
  },
  {
    id: "shoulder-stripe-polo",
    name: "Shoulder Stripe Polo",
    category: "polos",
    type: "polo",
    price: 45,
    badge: "New",
    conditions: ["hot", "mild"],
    blurb: "Striped shoulder tape, snap placket.",
    description:
      "A clean pique polo with a woven stripe tape across each shoulder and a snap-button placket that sits neat all round. Light, breathable and easy to wear on and off the course.",
    features: ["Breathable dri-fit pique", "Woven navy and white shoulder tape", "Snap-button placket", "Classic PARIII neck label"],
    colors: [
      { name: "Aqua", body: "#BFE6F0", trim: "#BFE6F0", accent: C.navy, bg: BG.cool, crop: true, images: ["assets/img/shoulder-stripe-polo-aqua-collar.webp"] },
    ],
  },
  {
    id: "tour-dri-fit-polo",
    name: "Tour Dri-Fit Polo",
    category: "polos",
    type: "polo",
    price: 45,
    badge: "Bestseller",
    conditions: ["hot", "mild"],
    blurb: "The everyday round polo. Cool, dry, easy.",
    description:
      "Our core polo in a lightweight dri-fit knit with a touch of stretch. It pulls sweat away from the skin and dries fast, so it still looks sharp on the 18th green.",
    features: ["Polyester-spandex dri-fit knit", "Odour control", "Moisture-wicking and quick-dry", "Three-button placket", "Embroidered PAR3 chest logo"],
    colors: [
      { name: "White", body: C.white, trim: C.offWhite, accent: C.navy, bg: BG.light },
      { name: "Navy", body: C.navy, trim: C.navy, accent: C.white, bg: BG.cool },
      { name: "Black", body: C.black, trim: C.black, accent: C.white, bg: BG.light },
      { name: "Sky", body: C.sky, trim: C.sky, accent: C.navy, bg: BG.cool },
    ],
  },
  {
    id: "signature-stripe-polo",
    name: "Signature Stripe Polo",
    category: "polos",
    type: "polo",
    price: 52,
    badge: "New",
    conditions: ["hot", "mild"],
    blurb: "Engineered stripes that flatter every build.",
    description:
      "A fine horizontal stripe knitted into the fabric, not printed on, so it stays crisp wash after wash. Same cool dri-fit feel as the Tour polo.",
    features: ["Yarn-dyed stripe knit", "Moisture-wicking and quick-dry", "Self-fabric collar", "Side vents for movement"],
    colors: [
      { name: "Navy / White", body: C.navy, trim: C.navy, accent: C.white, pattern: "stripe", bg: BG.cool },
      { name: "White / Red", body: C.white, trim: C.white, accent: C.red, pattern: "stripe", bg: BG.light },
      { name: "Green / White", body: C.green, trim: C.green, accent: C.white, pattern: "stripe", bg: BG.green },
    ],
  },
  {
    id: "unique-design-polo",
    name: "Unique Design Print Polo",
    category: "polos",
    type: "polo",
    price: 55,
    conditions: ["hot"],
    blurb: "An all-over print that stands out on the first tee.",
    description:
      "A bold all-over geometric print on our breathable dri-fit knit. Pairs with solid shorts or pants for a look that's confident without trying too hard.",
    features: ["All-over printed dri-fit knit", "Odour control", "Moisture-wicking", "UPF 30+"],
    colors: [
      { name: "White Geo", body: C.white, trim: C.navy, accent: C.navy, pattern: "print", bg: BG.light },
      { name: "Navy Geo", body: C.navy, trim: C.navy, accent: C.sky, pattern: "print", bg: BG.cool },
      { name: "Mint Geo", body: C.mint, trim: C.green, accent: C.green, pattern: "print", bg: BG.green },
    ],
  },
  {
    id: "cooling-mock-neck",
    name: "Cooling Mock Neck",
    category: "polos",
    type: "mockNeck",
    price: 55,
    conditions: ["hot", "mild"],
    blurb: "Modern collarless fit, cool-touch fabric.",
    description:
      "A clean mock-neck top in a cool-to-the-touch knit that feels lighter than it looks. Accepted at most clubs, and a nice change from the classic collar.",
    features: ["Cool-touch knit", "Four-way stretch", "Flatlock seams", "Tape logo at neck"],
    colors: [
      { name: "Black", body: C.black, trim: C.charcoal, accent: C.white, bg: BG.light },
      { name: "White", body: C.white, trim: C.offWhite, accent: C.navy, bg: BG.light },
      { name: "Charcoal", body: C.charcoal, trim: C.black, accent: C.white, bg: BG.light },
    ],
  },
  {
    id: "uv-long-sleeve-polo",
    name: "UV Long Sleeve Polo",
    category: "polos",
    type: "longPolo",
    price: 59,
    conditions: ["hot", "mild"],
    blurb: "Full-arm sun cover without the heat.",
    description:
      "Long sleeves in our lightest knit, so you're covered through the midday sun without overheating. Thumb-friendly cuffs stay in place through the swing.",
    features: ["UPF 50+", "Ultra-light dri-fit knit", "Moisture-wicking", "Rib cuffs"],
    colors: [
      { name: "White", body: C.white, trim: C.offWhite, accent: C.navy, bg: BG.light },
      { name: "Sky", body: C.sky, trim: C.sky, accent: C.navy, bg: BG.cool },
      { name: "Grey", body: C.grey, trim: C.grey, accent: C.white, bg: BG.light },
    ],
  },
  {
    id: "tech-golf-shorts",
    name: "Tech Golf Shorts",
    category: "bottoms",
    type: "shorts",
    price: 59,
    badge: "Bestseller",
    conditions: ["hot"],
    blurb: "9-inch inseam, four-way stretch.",
    description:
      "Tailored golf shorts with a 9\" inseam and four-way stretch, so they move through the swing and still look smart in the clubhouse. A zip back pocket keeps your scorecard and phone safe.",
    features: ["Four-way stretch woven", "9\" inseam", "Zip back pocket", "Silicone waist grip keeps your shirt tucked"],
    colors: [
      { name: "Navy", body: C.navy, trim: C.navy, accent: C.white, bg: BG.cool },
      { name: "Khaki", body: C.khaki, trim: C.khaki, accent: C.navy, bg: BG.warm },
      { name: "Grey", body: C.grey, trim: C.grey, accent: C.navy, bg: BG.light },
      { name: "Black", body: C.black, trim: C.black, accent: C.white, bg: BG.light },
    ],
  },
  {
    id: "stretch-golf-pants",
    name: "Stretch Golf Pants",
    category: "bottoms",
    type: "pants",
    price: 79,
    conditions: ["mild", "cool"],
    blurb: "Slim-tapered, all-day comfort.",
    description:
      "A slim-tapered pant that doesn't pull when you crouch to read a putt. The stretch waistband gives an extra 2cm of comfort after lunch at the turn.",
    features: ["Four-way stretch woven", "Hidden stretch waistband", "Water-repellent finish", "Zip back pocket"],
    colors: [
      { name: "Navy", body: C.navy, trim: C.navy, accent: C.white, bg: BG.cool },
      { name: "Stone", body: C.stone, trim: C.stone, accent: C.navy, bg: BG.warm },
      { name: "Black", body: C.black, trim: C.black, accent: C.white, bg: BG.light },
    ],
  },
  {
    id: "quarter-zip-pullover",
    name: "Quarter-Zip Pullover",
    category: "layers",
    type: "quarterZip",
    price: 85,
    conditions: ["mild", "cool"],
    blurb: "The early tee-time layer.",
    description:
      "A brushed-back midlayer for cool mornings and air-conditioned clubhouses. Light enough to swing in, warm enough to keep on until the sun comes through.",
    features: ["Brushed-back stretch jersey", "Quarter-length zip", "Thumb-free cuffs", "Embroidered PAR3 logo"],
    colors: [
      { name: "Navy", body: C.navy, trim: C.navy, accent: C.white, bg: BG.cool },
      { name: "Charcoal", body: C.charcoal, trim: C.charcoal, accent: C.white, bg: BG.light },
      { name: "Green", body: C.green, trim: C.green, accent: C.white, bg: BG.green },
    ],
  },
  {
    id: "wind-vest",
    name: "Lightweight Wind Vest",
    category: "layers",
    type: "vest",
    price: 75,
    conditions: ["mild", "cool"],
    blurb: "Core warmth, arms free.",
    description:
      "A packable, wind-resistant vest that keeps your core warm without restricting your arms. Folds into its own pocket and fits in any golf bag.",
    features: ["Wind- and water-resistant shell", "Packs into its own pocket", "Two zip hand pockets", "Reflective logo"],
    colors: [
      { name: "Black", body: C.black, trim: C.charcoal, accent: C.white, bg: BG.light },
      { name: "Navy", body: C.navy, trim: C.navy, accent: C.white, bg: BG.cool },
    ],
  },
  {
    id: "rain-jacket",
    name: "All-Weather Golf Jacket",
    category: "layers",
    type: "jacket",
    price: 90,
    conditions: ["cool"],
    blurb: "Keeps the rain out, lets the heat escape.",
    description:
      "A quiet, breathable shell with sealed seams, for the round that turns wet at the back nine. It doesn't rustle at the top of your backswing.",
    features: ["Waterproof, breathable shell", "Taped seams", "Soft-touch quiet fabric", "Adjustable cuffs and hem"],
    colors: [
      { name: "Navy", body: C.navy, trim: C.navy, accent: C.white, bg: BG.cool },
      { name: "Black", body: C.black, trim: C.charcoal, accent: C.white, bg: BG.light },
    ],
  },
  {
    id: "tour-cap",
    name: "Tour Cap",
    category: "headwear",
    type: "cap",
    price: 40,
    sizes: ["One size"],
    conditions: ["hot", "mild", "cool"],
    blurb: "Structured, sweat-wicking, adjustable.",
    description:
      "A structured six-panel cap with a sweat-wicking band and an adjustable strap. The embroidered PAR3 logo sits front and centre.",
    features: ["Performance twill", "Sweat-wicking band", "Adjustable back strap", "Embroidered front logo"],
    colors: [
      { name: "White", body: C.white, trim: C.offWhite, accent: C.navy, bg: BG.light },
      { name: "Navy", body: C.navy, trim: C.navy, accent: C.white, bg: BG.cool },
      { name: "Black", body: C.black, trim: C.black, accent: C.white, bg: BG.light },
    ],
  },
  {
    id: "bucket-hat",
    name: "Sun Bucket Hat",
    category: "headwear",
    type: "bucketHat",
    price: 40,
    sizes: ["S/M", "L/XL"],
    conditions: ["hot"],
    blurb: "360° shade for the midday round.",
    description:
      "A wide-brim bucket hat that shades your face, ears and neck. Mesh vents keep your head cool, and it folds flat into your bag.",
    features: ["UPF 50+", "Mesh side vents", "Packable", "Embroidered logo"],
    colors: [
      { name: "Stone", body: C.stone, trim: C.khaki, accent: C.navy, bg: BG.warm },
      { name: "Navy", body: C.navy, trim: C.navy, accent: C.white, bg: BG.cool },
    ],
  },
];

// Outfits for the "Shop the look" section. Each piece is clickable.
// Until `photo` is set, the look shows the product photos as a styled outfit.
// For an on-model photo, set `photo` and give each piece an `x`/`y` hotspot
// position in % of the photo (e.g. the polo's chest and the shorts' leg).
const LOOKS = [
  {
    id: "black-and-hearts",
    title: "The Weekend Round",
    note: "A clean black polo lets the heart print shorts do the talking.",
    photo: null,
    pieces: [
      { product: "textured-dri-fit-polo", x: 50, y: 30 },
      { product: "heart-print-golf-shorts", x: 50, y: 72 },
    ],
  },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "polos", label: "Polos & Tops" },
  { id: "bottoms", label: "Shorts & Pants" },
  { id: "layers", label: "Layers" },
  { id: "headwear", label: "Headwear" },
];

const CONDITIONS = [
  { id: "hot", label: "Hot & humid", note: "Light, quick-dry and sun-safe" },
  { id: "mild", label: "Mild", note: "Easy layers for changing weather" },
  { id: "cool", label: "Cool & windy", note: "Warmth without bulk" },
];

// Chest measurement (cm) for each size, used by the size guide and size finder.
const SIZE_CHART = [
  { size: "S", chest: "96–101", waist: "76–81" },
  { size: "M", chest: "102–107", waist: "82–87" },
  { size: "L", chest: "108–113", waist: "88–93" },
  { size: "XL", chest: "114–119", waist: "94–99" },
  { size: "2XL", chest: "120–125", waist: "100–105" },
  { size: "3XL", chest: "126–131", waist: "106–111" },
];

const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
