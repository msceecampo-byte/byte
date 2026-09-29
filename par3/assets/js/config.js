// Store-wide settings: brand assets, markets, currencies, delivery and offers.
// Prices in products.js are in USD and converted here for each country.

const BRAND = {
  name: "PAR3",
  // PARIII logo, traced from the woven neck label. Replace both files with the
  // official vector artwork when you have it. If a file is missing, the header
  // shows "PAR3" as plain text instead.
  logo: "brand/pariii-logo-navy.svg",
  logoLight: "brand/pariii-logo-white.svg",
  email: "customerservice@par3.com.sg",
  address: "41 Kallang Pudding Road #06-07, Singapore",
};

// Indicative exchange rates (1 USD = x). Shopify Markets will replace these
// with its own rates or a fixed local price list at launch.
// `step` rounds the converted price up to a tidy local number.
const CURRENCIES = {
  USD: { symbol: "US$", rate: 1, step: 1 },
  SGD: { symbol: "S$", rate: 1.3, step: 1 },
  MYR: { symbol: "RM", rate: 4.3, step: 1 },
  THB: { symbol: "฿", rate: 34, step: 10 },
  IDR: { symbol: "Rp", rate: 16000, step: 1000 },
  PHP: { symbol: "₱", rate: 57, step: 10 },
  VND: { symbol: "₫", rate: 25500, step: 1000 },
  JPY: { symbol: "¥", rate: 148, step: 100 },
  KRW: { symbol: "₩", rate: 1380, step: 1000 },
  HKD: { symbol: "HK$", rate: 7.8, step: 1 },
  TWD: { symbol: "NT$", rate: 31, step: 10 },
  CNY: { symbol: "CN¥", rate: 7.2, step: 1 },
  AUD: { symbol: "A$", rate: 1.52, step: 1 },
  NZD: { symbol: "NZ$", rate: 1.68, step: 1 },
  GBP: { symbol: "£", rate: 0.76, step: 1 },
  EUR: { symbol: "€", rate: 0.88, step: 1 },
};

// Delivery from Singapore. `freeOver` and `fee` are in USD.
const REGIONS = {
  sg: { label: "Singapore", days: "1–2 working days", freeOver: 50, fee: 4 },
  sea: { label: "Southeast Asia", days: "3–6 working days", freeOver: 60, fee: 8 },
  nasia: { label: "North Asia", days: "4–7 working days", freeOver: 100, fee: 12 },
  anz: { label: "Australia & New Zealand", days: "5–8 working days", freeOver: 100, fee: 14 },
  west: { label: "US, UK & Europe", days: "6–10 working days", freeOver: 120, fee: 18 },
};

const COUNTRIES = [
  { code: "SG", name: "Singapore", currency: "SGD", region: "sg" },
  { code: "MY", name: "Malaysia", currency: "MYR", region: "sea" },
  { code: "TH", name: "Thailand", currency: "THB", region: "sea" },
  { code: "ID", name: "Indonesia", currency: "IDR", region: "sea" },
  { code: "PH", name: "Philippines", currency: "PHP", region: "sea" },
  { code: "VN", name: "Vietnam", currency: "VND", region: "sea" },
  { code: "JP", name: "Japan", currency: "JPY", region: "nasia" },
  { code: "KR", name: "South Korea", currency: "KRW", region: "nasia" },
  { code: "HK", name: "Hong Kong", currency: "HKD", region: "nasia" },
  { code: "TW", name: "Taiwan", currency: "TWD", region: "nasia" },
  { code: "CN", name: "China", currency: "CNY", region: "nasia" },
  { code: "AU", name: "Australia", currency: "AUD", region: "anz" },
  { code: "NZ", name: "New Zealand", currency: "NZD", region: "anz" },
  { code: "US", name: "United States", currency: "USD", region: "west" },
  { code: "GB", name: "United Kingdom", currency: "GBP", region: "west" },
  { code: "EU", name: "European Union", currency: "EUR", region: "west" },
];

// Polo multi-buy: the biggest tier the bag qualifies for applies to every polo in it.
const MULTIBUY = {
  category: "polos",
  tiers: [
    { qty: 3, off: 0.15 },
    { qty: 2, off: 0.1 },
  ],
};

// Welcome offer shown with the email signup. Confirm the amount before launch.
const WELCOME_OFFER = "10% off your first order";

// Home page banner photo from the photoshoot (see PHOTOSHOOT.md, shot 1).
// While `photo` is null, the banner shows product photos instead.
// `phone` is an optional taller crop for small screens.
const HERO = {
  photo: null, // e.g. "assets/img/hero-fairway.jpg"
  phone: null, // e.g. "assets/img/hero-fairway-phone.jpg"
  alt: "Golfer on the fairway wearing the PARIII Solid Active Wear Shirt and Nautical Golf Short",
};
