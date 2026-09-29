// Shared site behaviour: header/footer, country and currency, bag with shirt
// multi-buy, size finder, email signup, and per-page rendering.
// The bag, country and saved size live in localStorage so they survive page
// loads. Checkout is a placeholder until the store moves onto Shopify.

const KEYS = { bag: "p3-bag", country: "p3-country", size: "p3-size", waist: "p3-waist", signup: "p3-signup" };

// "32" -> "Waist 32" for shorts and pants; the fit, if any, is already in the string.
const sizeLabel = (p, size) => (isWaistSized(p) ? `Waist ${size}` : size);

// The size to pre-select for a product from the shopper's size-finder result.
function savedSizeFor(p) {
  if (p.sizes.length === 1) return p.sizes[0];
  if (isWaistSized(p)) return pickWaist(p.sizes, store.get(KEYS.waist, null));
  const shirt = store.get(KEYS.size, null);
  return p.sizes.includes(shirt) ? shirt : null;
}

const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* private mode — settings just won't persist */
    }
  },
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/* ------------------------------------------------------------ market */

function guessCountry() {
  const saved = store.get(KEYS.country, null);
  if (saved && COUNTRIES.some((c) => c.code === saved)) return saved;
  const langs = navigator.languages || [navigator.language || ""];
  for (const l of langs) {
    const region = (l.split("-")[1] || "").toUpperCase();
    if (COUNTRIES.some((c) => c.code === region)) return region;
    if (["DE", "FR", "IT", "ES", "NL", "IE", "BE", "AT", "PT", "FI"].includes(region)) return "EU";
  }
  return "SG";
}

const market = {
  country: null,
  init() {
    this.country = COUNTRIES.find((c) => c.code === guessCountry());
    this.cur = CURRENCIES[this.country.currency];
    this.region = REGIONS[this.country.region];
  },
  set(code) {
    store.set(KEYS.country, code);
    location.reload();
  },
  // An amount in `base` currency (product prices are SGD, delivery settings USD)
  // -> local price. The shop's own currency keeps its exact price; others are
  // converted and rounded up to a tidy local number.
  price(amount, base = "SGD") {
    if (base === this.country.currency) return amount;
    const { rate, step } = this.cur;
    const usd = amount / CURRENCIES[base].rate;
    return Math.ceil((usd * rate) / step) * step;
  },
  // Round a local amount (e.g. a discount) to what the currency can show.
  round(n) {
    const step = this.cur.step;
    return step >= 10 ? Math.round(n / step) * step : Math.round(n * 100) / 100;
  },
  freeOver() {
    return this.price(this.region.freeOver, "USD");
  },
  fee() {
    return this.price(this.region.fee, "USD");
  },
};

const money = (n) =>
  `${market.cur.symbol}${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

const priceOf = (p) => market.price(p.price);

// Price with the original price struck through when the product is on sale.
const priceTag = (p) =>
  p.was ? `<span class="now">${money(priceOf(p))}</span> <s class="was">${money(market.price(p.was))}</s>` : money(priceOf(p));

// A colourway's photos, in order. Put the on-model shot second so product
// cards show it on hover.
function photosOf(product, colorIndex = 0) {
  const c = product.colors[colorIndex] || product.colors[0];
  return c.images || [];
}

function productImage(product, colorIndex = 0, n = 0) {
  const c = product.colors[colorIndex] || product.colors[0];
  const src = photosOf(product, colorIndex)[n];
  if (src) return `<img src="${esc(src)}" alt="${esc(product.name)} in ${esc(c.name)}, photo ${n + 1}" loading="lazy"${c.crop ? ' class="crop"' : ""}>`;
  return `<div class="no-photo" role="img" aria-label="${esc(product.name)} in ${esc(c.name)}" style="--c:${c.body}"></div>`;
}

// Card art: the first photo, plus the second (on-model) one revealed on hover.
function cardArt(product, colorIndex = 0) {
  const hover = photosOf(product, colorIndex).length > 1;
  return productImage(product, colorIndex) + (hover ? `<div class="card-alt">${productImage(product, colorIndex, 1)}</div>` : "");
}

function lightbox(product, colorIndex, start = 0) {
  const photos = photosOf(product, colorIndex);
  const total = Math.max(1, photos.length);
  let n = start;
  const wrap = document.createElement("div");
  wrap.className = "lightbox";
  wrap.setAttribute("role", "dialog");
  wrap.setAttribute("aria-modal", "true");
  wrap.setAttribute("aria-label", `${product.name} photos`);
  wrap.innerHTML = `
    <button class="lb-close" aria-label="Close">✕</button>
    ${total > 1 ? `<button class="lb-nav prev" aria-label="Previous photo">‹</button><button class="lb-nav next" aria-label="Next photo">›</button>` : ""}
    <figure class="lb-stage"></figure>
    <p class="lb-count"></p>`;
  const draw = () => {
    wrap.querySelector(".lb-stage").innerHTML = productImage(product, colorIndex, n);
    wrap.querySelector(".lb-count").textContent = total > 1 ? `${n + 1} / ${total}` : "";
  };
  const go = (d) => {
    n = (n + d + total) % total;
    draw();
  };
  const close = () => {
    wrap.remove();
    document.removeEventListener("keydown", onKey);
  };
  const onKey = (e) => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };
  document.addEventListener("keydown", onKey);
  wrap.addEventListener("click", (e) => (e.target === wrap || e.target.classList.contains("lb-stage")) && close());
  wrap.querySelector(".lb-close").addEventListener("click", close);
  wrap.querySelector(".prev")?.addEventListener("click", () => go(-1));
  wrap.querySelector(".next")?.addEventListener("click", () => go(1));
  document.body.appendChild(wrap);
  draw();
  wrap.querySelector(".lb-close").focus();
}

/* ------------------------------------------------------------ chrome */

function logoMarkup() {
  return `<a class="logo" href="index.html" aria-label="${BRAND.name} home"><img src="${esc(BRAND.logo)}" alt="PARIII" height="34"></a>`;
}

// Fall back to a text wordmark until the real logo file is added.
function bindLogos(root = document) {
  root.querySelectorAll(".logo img, .footer-logo img").forEach((img) => {
    const swap = () => {
      const span = document.createElement("span");
      span.className = "wordmark";
      span.textContent = BRAND.name;
      img.replaceWith(span);
    };
    if (img.complete && img.naturalWidth === 0) swap();
    else img.addEventListener("error", swap);
  });
}

function renderChrome() {
  const page = document.body.dataset.page;
  const cat = new URLSearchParams(location.search).get("c");
  const link = (href, label, active) => `<a href="${href}"${active ? ' aria-current="page"' : ""}>${label}</a>`;
  const nav = [
    link("shop.html", "Shop all", page === "shop" && !cat),
    link("shop.html?c=shirts", "Shirts", cat === "shirts"),
    link("shop.html?c=shorts", "Shorts", cat === "shorts"),
    link("shop.html?c=pants", "Pants", cat === "pants"),
    link("about.html", "About", page === "about"),
  ];

  document.getElementById("site-header").innerHTML = `
    <div class="announce">
      Free delivery to ${esc(market.country.name)} over ${money(market.freeOver())} · Arrives in ${market.region.days}
    </div>
    <div class="header-inner">
      <button class="icon-btn menu-toggle" aria-label="Open menu" aria-expanded="false">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" stroke-width="1.8"/></svg>
      </button>
      ${logoMarkup()}
      <nav class="nav" aria-label="Main">${nav.join("")}</nav>
      <div class="header-tools">
        <button class="country-btn" aria-label="Change country and currency">
          <span>${market.country.code}</span><span class="muted">${esc(market.cur.symbol)}</span>
        </button>
        <button class="icon-btn size-btn" aria-label="Find my size" title="Find my size">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="8" width="19" height="8" rx="1.5"/><path d="M6.5 8v3M10 8v4M13.5 8v3M17 8v4"/></svg>
        </button>
        <button class="icon-btn bag-toggle" aria-label="Open bag">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>
          <span class="bag-count" hidden>0</span>
        </button>
      </div>
    </div>
    <div class="mobile-nav" hidden>${nav.join("")}</div>`;

  document.getElementById("site-footer").innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-logo"><img src="${esc(BRAND.logoLight)}" alt="PARIII" height="34"></span>
        <p>Men's golf apparel from Singapore, made to play well and look sharp wherever you tee off.</p>
      </div>
      <div>
        <h4>Shop</h4>
        ${CATEGORIES.filter((c) => c.id !== "all").map((c) => `<a href="shop.html?c=${c.id}">${c.label}</a>`).join("")}
      </div>
      <div>
        <h4>Help</h4>
        <a href="#" data-sizeguide>Size guide</a><a href="#" data-shipping>Shipping &amp; returns</a><a href="mailto:${BRAND.email}">Contact us</a>
      </div>
      <div>
        <h4>PAR3</h4>
        <a href="about.html">About</a><a href="#" data-country>Ship to: ${esc(market.country.name)}</a>
      </div>
    </div>
    <div class="footer-base">
      <span>© ${new Date().getFullYear()} ${BRAND.name} · ${esc(BRAND.address)}</span>
      <span>${esc(BRAND.email)}</span>
    </div>`;

  const toggle = document.querySelector(".menu-toggle");
  const mobile = document.querySelector(".mobile-nav");
  toggle.addEventListener("click", () => {
    const open = mobile.hidden;
    mobile.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.querySelector(".bag-toggle").addEventListener("click", () => bag.open());
  document.querySelector(".size-btn").addEventListener("click", () => sizeFinder());
  bindLogos();
  bindActions();
}

// Links anywhere on the page that open the shared modals.
function bindActions(root = document) {
  const on = (sel, fn) =>
    root.querySelectorAll(`${sel}:not([data-bound])`).forEach((el) => {
      el.dataset.bound = "1";
      el.addEventListener("click", (e) => {
        e.preventDefault();
        fn();
      });
    });
  on("[data-country], .country-btn", countryPicker);
  on("[data-sizeguide]", sizeGuide);
  on("[data-sizefinder]", () => sizeFinder());
  on("[data-shipping]", shippingInfo);
}

/* ------------------------------------------------------------ country picker */

function countryPicker() {
  const groups = Object.entries(REGIONS)
    .map(([id, r]) => {
      const list = COUNTRIES.filter((c) => c.region === id);
      return `
        <div class="country-group">
          <h3>${r.label}</h3>
          ${list
            .map(
              (c) => `<button class="country-opt${c.code === market.country.code ? " on" : ""}" data-code="${c.code}">
                <span>${c.name}</span><span class="muted">${CURRENCIES[c.currency].symbol}</span></button>`
            )
            .join("")}
        </div>`;
    })
    .join("");
  const wrap = modal(
    `<h2>Where are you playing?</h2>
     <p class="muted">We'll show prices in your currency, with delivery times and free-delivery offers for your country.</p>
     <div class="country-grid">${groups}</div>`,
    "wide"
  );
  wrap.querySelectorAll(".country-opt").forEach((b) => b.addEventListener("click", () => market.set(b.dataset.code)));
}

function shippingInfo() {
  const rows = Object.values(REGIONS)
    .map((r) => `<tr><td>${r.label}</td><td>${r.days}</td><td>Over US$${r.freeOver}</td></tr>`)
    .join("");
  modal(
    `<h2>Shipping &amp; returns</h2>
     <p class="muted">All orders ship from Singapore with tracking.</p>
     <table class="table"><thead><tr><th>Ship to</th><th>Delivery</th><th>Free delivery</th></tr></thead><tbody>${rows}</tbody></table>
     <p class="muted small">Import duties and taxes for your country are shown at checkout, so there are no surprises on delivery. Unworn items can be returned within 30 days.</p>`,
    "wide"
  );
}

/* ------------------------------------------------------------ size finder */

// The shop's own size charts, one per category (or just this product's).
function sizeGuide(product) {
  const charts = product?.sizeChart
    ? [[product.name, product.sizeChart]]
    : CATEGORIES.filter((c) => c.id !== "all")
        .map((c) => [c.label, PRODUCTS.find((p) => p.category === c.id && p.sizeChart)?.sizeChart])
        .filter(([, src]) => src);
  modal(
    `<h2>Size guide</h2>
     <p class="muted">Shirts use EU sizes with a regular fit. Shorts and pants are sized by waist in inches and are true to size.</p>
     <div class="charts">${charts.map(([label, src]) => `<figure><figcaption>${esc(label)}</figcaption><img src="${esc(src)}" alt="${esc(label)} size chart" loading="lazy"></figure>`).join("")}</div>
     <button class="btn btn-block" data-sizefinder>Not sure? Find my size</button>`,
    "wide"
  );
}

// Waist sizes (inches) are in product.sizes as "30", "32"…; shirts use S–4XL.
const isWaistSized = (p) => (p.sizes || []).every((s) => /^\d+$/.test(s));

// Closest stocked waist size at or above the shopper's waist, else the largest.
const pickWaist = (sizes, waist) => (waist ? sizes.find((s) => Number(s) >= waist) || sizes[sizes.length - 1] : null);

function recommendSize(heightCm, weightKg, fit) {
  const byWeight = [65, 76, 88, 100, 112, 124];
  let i = byWeight.findIndex((w) => weightKg < w);
  if (i === -1) i = SIZES.length - 1;
  if (heightCm >= 185) i++;
  if (fit === "relaxed") i++;
  return SIZES[Math.min(i, SIZES.length - 1)];
}

// `forWaist`: the product is sized by waist, so "Use this size" picks the waist.
function sizeFinder(onPick, forWaist = false) {
  const savedShirt = store.get(KEYS.size, null);
  const savedWaist = store.get(KEYS.waist, null);
  const saved = savedShirt && { shirt: savedShirt, waist: savedWaist };
  const wrap = modal(`
    <h2>Find my size</h2>
    <p class="muted">A few quick questions. We'll remember your sizes on every product.</p>
    <form class="finder">
      <div class="unit-toggle" role="radiogroup" aria-label="Units">
        <label><input type="radio" name="unit" value="metric" checked> cm / kg</label>
        <label><input type="radio" name="unit" value="imperial"> ft / lb</label>
      </div>
      <div class="finder-row metric">
        <label>Height <input name="cm" type="number" inputmode="numeric" min="140" max="220" placeholder="175" required> <span>cm</span></label>
        <label>Weight <input name="kg" type="number" inputmode="numeric" min="40" max="180" placeholder="75" required> <span>kg</span></label>
      </div>
      <div class="finder-row imperial" hidden>
        <label>Height <input name="ft" type="number" min="4" max="7" placeholder="5"> <span>ft</span> <input name="in" type="number" min="0" max="11" placeholder="9"> <span>in</span></label>
        <label>Weight <input name="lb" type="number" min="90" max="400" placeholder="165"> <span>lb</span></label>
      </div>
      <div class="finder-row">
        <label>Trouser waist <input name="waist" type="number" inputmode="numeric" min="26" max="50" placeholder="34"> <span>in</span></label>
        <p class="muted small" style="margin:0">For shorts and pants. Use the waist size of trousers that fit you well.</p>
      </div>
      <fieldset class="fit-pick">
        <legend>How do you like your shirts to fit?</legend>
        <label><input type="radio" name="fit" value="regular" checked> Close to the body</label>
        <label><input type="radio" name="fit" value="relaxed"> Relaxed, a bit roomier</label>
      </fieldset>
      <button class="btn btn-block" type="submit">Show my size</button>
    </form>
    <div class="finder-result" ${saved ? "" : "hidden"}>${saved ? resultHTML(saved) : ""}</div>`);

  const form = wrap.querySelector(".finder");
  const rows = { metric: form.querySelector(".metric"), imperial: form.querySelector(".imperial") };
  form.querySelectorAll("[name=unit]").forEach((r) =>
    r.addEventListener("change", () => {
      const imperial = form.unit.value === "imperial";
      rows.metric.hidden = imperial;
      rows.imperial.hidden = !imperial;
      rows.metric.querySelectorAll("input").forEach((i) => (i.required = !imperial));
      rows.imperial.querySelectorAll("[name=ft], [name=lb]").forEach((i) => (i.required = imperial));
    })
  );
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const imperial = form.unit.value === "imperial";
    const cm = imperial ? (Number(form.ft.value) * 12 + Number(form.in.value || 0)) * 2.54 : Number(form.cm.value);
    const kg = imperial ? Number(form.lb.value) * 0.4536 : Number(form.kg.value);
    const result = { shirt: recommendSize(cm, kg, form.fit.value), waist: Number(form.waist.value) || null };
    store.set(KEYS.size, result.shirt);
    store.set(KEYS.waist, result.waist);
    const out = wrap.querySelector(".finder-result");
    out.hidden = false;
    out.innerHTML = resultHTML(result);
    out.querySelector(".use-size")?.addEventListener("click", () => {
      onPick?.(result);
      wrap.remove();
    });
  });

  function resultHTML({ shirt, waist }) {
    const pick = forWaist ? waist && `waist ${waist}` : `size ${shirt}`;
    return `<div class="big-sizes">
        <div><p>Shirts</p><div class="big-size">${shirt}</div></div>
        ${waist ? `<div><p>Shorts &amp; pants</p><div class="big-size">${waist}"</div></div>` : ""}
      </div>
      ${onPick && pick ? `<button class="btn btn-block use-size">Use ${pick}</button>` : `<p class="muted small">We'll pre-select your size on every product page.</p>`}`;
  }
  wrap.querySelector(".use-size")?.addEventListener("click", () => {
    onPick?.(saved);
    wrap.remove();
  });
}

/* ------------------------------------------------------------ bag */

const bag = {
  items: store.get(KEYS.bag, []),

  save() {
    store.set(KEYS.bag, this.items);
    this.render();
  },

  add(productId, colorIndex, size, qty = 1) {
    const key = `${productId}|${colorIndex}|${size}`;
    const line = this.items.find((i) => i.key === key);
    if (line) line.qty += qty;
    else this.items.push({ key, productId, colorIndex, size, qty });
    this.save();
    this.open();
  },

  setQty(key, qty) {
    const line = this.items.find((i) => i.key === key);
    if (!line) return;
    line.qty = qty;
    if (line.qty <= 0) this.items = this.items.filter((i) => i.key !== key);
    this.save();
  },

  lines() {
    return this.items.map((i) => ({ ...i, product: getProduct(i.productId) })).filter((l) => l.product);
  },

  count() {
    return this.lines().reduce((n, l) => n + l.qty, 0);
  },

  subtotal() {
    return this.lines().reduce((sum, l) => sum + priceOf(l.product) * l.qty, 0);
  },

  // Multi-buy on shirts: returns the tier reached, the saving, and how many more
  // shirts unlock the next tier.
  multibuy() {
    const polos = this.lines().filter((l) => l.product.category === MULTIBUY.category);
    const qty = polos.reduce((n, l) => n + l.qty, 0);
    const value = polos.reduce((s, l) => s + priceOf(l.product) * l.qty, 0);
    const tier = MULTIBUY.tiers.find((t) => qty >= t.qty);
    const next = [...MULTIBUY.tiers].reverse().find((t) => qty < t.qty);
    return { qty, tier, saving: tier ? market.round(value * tier.off) : 0, next };
  },

  mount() {
    const el = document.createElement("div");
    el.innerHTML = `
      <div class="scrim" hidden></div>
      <aside class="drawer" aria-label="Your bag" aria-hidden="true">
        <header><h2>Your bag</h2><button class="icon-btn drawer-close" aria-label="Close bag">✕</button></header>
        <div class="meters"></div>
        <div class="drawer-lines"></div>
        <footer class="drawer-foot"></footer>
      </aside>`;
    document.body.append(...el.children);
    document.querySelector(".scrim").addEventListener("click", () => this.close());
    document.querySelector(".drawer-close").addEventListener("click", () => this.close());
    document.addEventListener("keydown", (e) => e.key === "Escape" && this.close());
    this.render();
  },

  open() {
    document.querySelector(".drawer").classList.add("open");
    document.querySelector(".drawer").setAttribute("aria-hidden", "false");
    document.querySelector(".scrim").hidden = false;
  },

  close() {
    document.querySelector(".drawer")?.classList.remove("open");
    document.querySelector(".drawer")?.setAttribute("aria-hidden", "true");
    const scrim = document.querySelector(".scrim");
    if (scrim) scrim.hidden = true;
  },

  render() {
    const count = this.count();
    const badge = document.querySelector(".bag-count");
    if (badge) {
      badge.hidden = count === 0;
      badge.textContent = count;
    }
    const lines = document.querySelector(".drawer-lines");
    if (!lines) return;

    const sub = this.subtotal();
    const mb = this.multibuy();
    const afterDiscount = sub - mb.saving;
    const free = market.freeOver();
    const left = free - afterDiscount;

    const polosLeft = mb.next ? mb.next.qty - mb.qty : 0;
    document.querySelector(".meters").innerHTML = count
      ? `<div class="meter-block">
           <p>${left > 0 ? `You're <strong>${money(market.round(left))}</strong> away from free delivery` : "You've unlocked <strong>free delivery</strong>"}</p>
           <div class="meter"><span style="width:${Math.min(100, (afterDiscount / free) * 100)}%"></span></div>
         </div>
         <div class="meter-block multibuy">
           <p>${
             mb.next
               ? `Add <strong>${polosLeft} more shirt${polosLeft > 1 ? "s" : ""}</strong> to save ${Math.round(mb.next.off * 100)}% on your shirts`
               : `Multi-buy unlocked: <strong>${Math.round(mb.tier.off * 100)}% off</strong> all your shirts`
           }</p>
           <a class="link small" href="shop.html?c=shirts">Shop shirts</a>
         </div>`
      : "";

    if (!count) {
      lines.innerHTML = `<div class="empty"><p>Your bag is empty.</p><a class="btn" href="shop.html">Start shopping</a></div>`;
      document.querySelector(".drawer-foot").innerHTML = "";
      return;
    }

    lines.innerHTML = this.lines()
      .map(({ key, product: p, colorIndex, size, qty }) => {
        const c = p.colors[colorIndex] || p.colors[0];
        return `
          <div class="line">
            <a class="line-img" href="product.html?id=${p.id}&c=${colorIndex}">${productImage(p, colorIndex)}</a>
            <div class="line-info">
              <a href="product.html?id=${p.id}&c=${colorIndex}" class="line-name">${esc(p.name)}</a>
              <span class="muted">${esc(c.name)} · ${esc(sizeLabel(p, size))}</span>
              <div class="qty" data-key="${esc(key)}">
                <button aria-label="Decrease quantity" data-d="-1">−</button><span>${qty}</span><button aria-label="Increase quantity" data-d="1">+</button>
              </div>
            </div>
            <span class="line-price">${money(priceOf(p) * qty)}</span>
          </div>`;
      })
      .join("");
    lines.querySelectorAll(".qty button").forEach((b) =>
      b.addEventListener("click", () => {
        const key = b.parentElement.dataset.key;
        const line = this.items.find((i) => i.key === key);
        this.setQty(key, line.qty + Number(b.dataset.d));
      })
    );

    const shipping = left > 0 ? market.fee() : 0;
    document.querySelector(".drawer-foot").innerHTML = `
      <div class="sum"><span>Subtotal</span><span>${money(sub)}</span></div>
      ${mb.saving ? `<div class="sum save"><span>Shirt multi-buy (${Math.round(mb.tier.off * 100)}% off)</span><span>−${money(mb.saving)}</span></div>` : ""}
      <div class="sum"><span>Delivery to ${esc(market.country.name)}</span><span>${shipping ? money(shipping) : "Free"}</span></div>
      <div class="sum total"><span>Total</span><span>${money(market.round(afterDiscount + shipping))}</span></div>
      <p class="muted small">Arrives in ${market.region.days}. Any import duties are shown at checkout.</p>
      <button class="btn btn-block checkout">Checkout</button>`;
    document.querySelector(".checkout").addEventListener("click", () => checkoutSoon());
  },
};

function checkoutSoon() {
  modal(`
    <h2>Checkout is coming soon</h2>
    <p>This is a preview of the new ${BRAND.name} store, and checkout switches on at launch. Your bag is saved. Leave your email and we'll send you ${WELCOME_OFFER} when we open.</p>
    ${signupForm("checkout")}`);
}

/* ------------------------------------------------------------ signup */

function signupForm(source) {
  return `
    <form class="signup" data-source="${source}">
      <label class="sr-only" for="su-${source}">Email address</label>
      <input id="su-${source}" type="email" name="email" placeholder="Your email" required autocomplete="email">
      <button class="btn" type="submit">Sign up</button>
      <p class="consent">You'll get emails from ${BRAND.name} about new colours and offers. Unsubscribe anytime.</p>
    </form>`;
}

function bindSignups(root = document) {
  root.querySelectorAll("form.signup:not([data-bound])").forEach((form) => {
    form.dataset.bound = "1";
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // TODO: send to the email platform (Shopify Email / Klaviyo) at launch.
      const list = store.get(KEYS.signup, []);
      list.push({ email: form.email.value, source: form.dataset.source, country: market.country.code, at: new Date().toISOString() });
      store.set(KEYS.signup, list);
      form.outerHTML = `<p class="joined"><strong>You're in.</strong> Look out for ${WELCOME_OFFER} in your inbox.</p>`;
    });
  });
}

/* ------------------------------------------------------------ ui bits */

function modal(html, size = "") {
  const wrap = document.createElement("div");
  wrap.className = "modal-wrap";
  wrap.innerHTML = `<div class="modal ${size}" role="dialog" aria-modal="true"><button class="icon-btn modal-close" aria-label="Close">✕</button>${html}</div>`;
  document.body.appendChild(wrap);
  const close = () => {
    wrap.remove();
    document.removeEventListener("keydown", onKey);
  };
  const onKey = (e) => e.key === "Escape" && close();
  document.addEventListener("keydown", onKey);
  wrap.addEventListener("click", (e) => e.target === wrap && close());
  wrap.querySelector(".modal-close").addEventListener("click", close);
  // A link inside a modal that opens another modal replaces this one.
  wrap.querySelectorAll("[data-sizefinder], [data-sizeguide], [data-country], [data-shipping]").forEach((a) => a.addEventListener("click", close));
  bindSignups(wrap);
  bindActions(wrap);
  wrap.querySelector("input, button:not(.modal-close)")?.focus();
  return wrap;
}

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 300);
  }, 2600);
}

function productCard(p) {
  const swatches = p.colors
    .map((c, i) => `<button class="swatch${i === 0 ? " on" : ""}" style="--c:${c.body}" data-i="${i}" aria-label="${esc(c.name)}"></button>`)
    .join("");
  return `
    <article class="card" data-id="${p.id}">
      <a class="card-img" href="product.html?id=${p.id}">
        ${p.badge ? `<span class="tag">${esc(p.badge)}</span>` : ""}
        <div class="card-art">${cardArt(p, 0)}</div>
      </a>
      <div class="card-body">
        <div class="card-row"><a href="product.html?id=${p.id}" class="card-name">${esc(p.name)}</a><span class="price">${priceTag(p)}</span></div>
        <p class="muted small">${esc(p.blurb)}</p>
        <div class="swatches">${swatches}</div>
      </div>
    </article>`;
}

function bindCards(root) {
  root.querySelectorAll(".card").forEach((card) => {
    const p = getProduct(card.dataset.id);
    card.querySelectorAll(".swatch").forEach((s) =>
      s.addEventListener("click", () => {
        const i = Number(s.dataset.i);
        card.querySelector(".card-art").innerHTML = cardArt(p, i);
        card.querySelectorAll(".swatch").forEach((x) => x.classList.toggle("on", x === s));
        card.querySelectorAll("a[href^='product.html']").forEach((a) => (a.href = `product.html?id=${p.id}&c=${i}`));
      })
    );
  });
}

/* ------------------------------------------------------------ shop the look */

// Hotspot spots on the styled outfit, used until a look has an on-model photo.
const STACK_SPOTS = [
  { x: 50, y: 25 },
  { x: 50, y: 74 },
];

function renderLook(root, look) {
  const pieces = look.pieces.map((pc) => {
    const p = getProduct(pc.product);
    // Products with a Regular/Slim choice go in the bag as the first fit (Regular).
    return { ...pc, p, sizes: p.sizes, fit: p.fits?.[0], colorIndex: Math.min(pc.color || 0, p.colors.length - 1), size: savedSizeFor(p) };
  });
  // Ways to show the outfit: an on-model photo, or the product photos.
  const modes = [look.photo && { id: "photo", label: "On model" }, { id: "flat", label: "Product photos" }].filter(Boolean);
  let mode = modes[0].id;
  let active = -1;

  root.innerHTML = `
    <div class="look">
      <div>
        ${modes.length > 1 ? `<div class="look-modes" role="tablist">${modes.map((m) => `<button role="tab" data-mode="${m.id}">${m.label}</button>`).join("")}</div>` : ""}
        <div class="look-visual"></div>
      </div>
      <div class="look-panel">
        <p class="eyebrow">Shop the look</p>
        <h2>${esc(look.title)}</h2>
        <p class="muted">${esc(look.note)} Tap any piece to shop it.</p>
        <div class="look-rows">
          ${pieces
            .map(
              (pc, i) => `
            <div class="look-row" data-i="${i}">
              <button class="look-thumb" aria-label="View ${esc(pc.p.name)} photos"></button>
              <div class="look-info">
                <div class="card-row"><a class="card-name" href="product.html?id=${pc.p.id}">${esc(pc.p.name)}</a><span class="price">${priceTag(pc.p)}</span></div>
                <div class="look-colour small">Colour: <strong></strong> <span class="muted">· ${pc.p.colors.length} colour${pc.p.colors.length > 1 ? "s" : ""} available</span></div>
                <div class="swatches">${pc.p.colors
                  .map((c, ci) => `<button class="swatch" style="--c:${c.body}" data-ci="${ci}" aria-label="${esc(c.name)}"></button>`)
                  .join("")}</div>
                ${isWaistSized(pc.p) ? `<span class="muted small">Waist (inches)${pc.fit ? ` · ${esc(pc.fit)}` : ""}</span>` : ""}
                <div class="sizes sm">${pc.sizes.map((s) => `<button class="size${s === pc.size ? " on" : ""}" data-s="${s}">${s}</button>`).join("")}</div>
                <a class="link small" href="product.html?id=${pc.p.id}">View details</a>
              </div>
            </div>`
            )
            .join("")}
        </div>
        <div class="look-total"><span>Complete look</span><strong>${money(pieces.reduce((n, pc) => n + priceOf(pc.p), 0))}</strong></div>
        <button class="btn btn-block look-add">Add the look to bag</button>
        <p class="muted small">Pick a size for each piece. Shirt multi-buy and free delivery still apply.</p>
      </div>
    </div>`;

  const rows = root.querySelectorAll(".look-row");
  const drawPiece = (i) => {
    const pc = pieces[i];
    const row = rows[i];
    row.querySelector(".look-thumb").innerHTML = productImage(pc.p, pc.colorIndex);
    row.querySelector(".look-colour strong").textContent = pc.p.colors[pc.colorIndex].name;
    row.querySelectorAll(".swatch").forEach((s) => s.classList.toggle("on", Number(s.dataset.ci) === pc.colorIndex));
    drawVisual();
  };
  const visual = root.querySelector(".look-visual");
  const drawVisual = () => {
    let stage;
    let spots;
    if (mode === "photo") {
      stage = `<img src="${esc(look.photo)}" alt="${esc(look.title)}: ${pieces.map((pc) => esc(pc.p.name)).join(" and ")}">`;
      spots = pieces.map((pc) => ({ x: pc.x, y: pc.y }));
    } else {
      stage = `<div class="look-stack">${pieces
        .map((pc, i) => `<button class="look-piece lp${i}" data-i="${i}" aria-label="Select ${esc(pc.p.name)}">${productImage(pc.p, pc.colorIndex)}</button>`)
        .join("")}</div>`;
      spots = pieces.map((_, i) => STACK_SPOTS[i] || { x: 50, y: 50 });
    }
    visual.className = `look-visual mode-${mode}`;
    visual.innerHTML =
      stage +
      spots
        .map((sp, i) => `<button class="hotspot" data-i="${i}" style="left:${sp.x}%;top:${sp.y}%" aria-label="Shop ${esc(pieces[i].p.name)}"><span>+</span></button>`)
        .join("");
    visual.querySelectorAll(".hotspot, .look-piece").forEach((h) => {
      h.addEventListener("click", () => select(Number(h.dataset.i)));
      h.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && h.tagName !== "BUTTON" && (e.preventDefault(), select(Number(h.dataset.i))));
    });
    markActive();
  };
  const markActive = () => {
    rows.forEach((r, n) => r.classList.toggle("active", n === active));
    visual.querySelectorAll(".hotspot, .look-piece").forEach((h) => h.classList.toggle("active", Number(h.dataset.i) === active));
  };
  const select = (i) => {
    active = i;
    markActive();
    if (matchMedia("(max-width: 820px)").matches) rows[i].scrollIntoView({ behavior: "smooth", block: "center" });
  };
  root.querySelectorAll(".look-modes button").forEach((b) =>
    b.addEventListener("click", () => {
      mode = b.dataset.mode;
      root.querySelectorAll(".look-modes button").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
      drawVisual();
    })
  );
  root.querySelector(`.look-modes button[data-mode="${mode}"]`)?.setAttribute("aria-selected", "true");

  pieces.forEach((pc, i) => {
    const row = rows[i];
    row.querySelectorAll(".swatch").forEach((s) =>
      s.addEventListener("click", () => {
        pc.colorIndex = Number(s.dataset.ci);
        drawPiece(i);
        select(i);
      })
    );
    row.querySelectorAll(".size").forEach((b) =>
      b.addEventListener("click", () => {
        pc.size = b.dataset.s;
        row.querySelectorAll(".size").forEach((x) => x.classList.toggle("on", x === b));
        row.querySelector(".sizes").classList.remove("need");
        select(i);
      })
    );
    row.querySelector(".look-thumb").addEventListener("click", () => lightbox(pc.p, pc.colorIndex));
    drawPiece(i);
  });

  root.querySelector(".look-add").addEventListener("click", () => {
    const missing = pieces.map((pc, i) => (pc.size ? -1 : i)).filter((i) => i >= 0);
    if (missing.length) {
      missing.forEach((i) => rows[i].querySelector(".sizes").classList.add("need"));
      select(missing[0]);
      toast("Pick a size for each piece");
      return;
    }
    pieces.forEach((pc) => bag.add(pc.p.id, pc.colorIndex, pc.fit ? `${pc.size} · ${pc.fit}` : pc.size));
  });
}

/* ------------------------------------------------------------ pages */

const pages = {
  home() {
    const grid = document.getElementById("featured");
    const picks = FEATURED.map(productNamed).filter(Boolean);
    if (LOOKS[0]) renderLook(document.getElementById("look"), LOOKS[0]);
    else document.getElementById("look").closest("section").remove();
    grid.innerHTML = picks.map(productCard).join("");
    bindCards(grid);

    if (HERO.photo) {
      const banner = document.querySelector(".hero");
      banner.classList.add("hero-photo");
      // Absolute URLs: a relative url() in a custom property resolves against the stylesheet.
      const abs = (src) => new URL(src, location.href).href;
      banner.style.setProperty("--hero", `url("${abs(HERO.photo)}")`);
      banner.style.setProperty("--hero-phone", `url("${abs(HERO.phone || HERO.photo)}")`);
      banner.setAttribute("aria-label", HERO.alt);
    }
    const hero = document.getElementById("hero-art");
    // The look's pieces first (in the look's colours), then the next featured product.
    const heroPieces = [...(LOOKS[0]?.pieces || []).map((pc) => [getProduct(pc.product), pc.color]), ...picks.map((p) => [p, 0])]
      .filter(([p], i, all) => all.findIndex(([q]) => q.id === p.id) === i)
      .slice(0, 3);
    hero.innerHTML = heroPieces
      .map(([p, c], n) => `<a href="product.html?id=${p.id}&c=${c}" class="hero-tile t${n}" aria-label="${esc(p.name)}">${productImage(p, c)}</a>`)
      .join("");

    // Each category tile shows its best-known product.
    const cats = document.getElementById("cats");
    cats.innerHTML = CATEGORIES.filter((c) => c.id !== "all")
      .map((c) => {
        const p = picks.find((x) => x.category === c.id) || PRODUCTS.find((x) => x.category === c.id);
        return p ? `<a class="tile" href="shop.html?c=${c.id}">${productImage(p, 0)}<span>${c.label}</span></a>` : "";
      })
      .join("");

    const conds = document.getElementById("conditions");
    conds.innerHTML = CONDITIONS.map(
      (c) => `<a class="cond cond-${c.id}" href="shop.html?w=${c.id}">
        <strong>${c.label}</strong><span>${c.note}</span>
        <em>${PRODUCTS.filter((p) => p.conditions.includes(c.id)).length} pieces →</em></a>`
    ).join("");

    const example = picks.find((p) => p.category === MULTIBUY.category);
    if (example) {
      const each = priceOf(example);
      document.getElementById("mb-example").textContent = `Three ${example.name}s: ${money(market.round(each * 3))} → ${money(market.round(each * 3 * 0.85))}`;
    }

    document.querySelectorAll("[data-signup]").forEach((el) => (el.innerHTML = signupForm(el.dataset.signup)));
    document.querySelectorAll("[data-offer]").forEach((el) => (el.textContent = WELCOME_OFFER));
    document.querySelectorAll("[data-ship-country]").forEach((el) => (el.textContent = market.country.name));
    document.querySelectorAll("[data-ship-days]").forEach((el) => (el.textContent = market.region.days));
  },

  shop() {
    const params = new URLSearchParams(location.search);
    let cat = params.get("c") || "all";
    let weather = params.get("w") || "any";
    if (!CATEGORIES.some((c) => c.id === cat)) cat = "all";

    const chips = document.getElementById("chips");
    const wchips = document.getElementById("wchips");
    const grid = document.getElementById("grid");
    const sort = document.getElementById("sort");
    const count = document.getElementById("count");
    const title = document.getElementById("shop-title");

    const sync = () => {
      const q = new URLSearchParams();
      if (cat !== "all") q.set("c", cat);
      if (weather !== "any") q.set("w", weather);
      history.replaceState(null, "", `shop.html${q.toString() ? `?${q}` : ""}`);
    };

    const draw = () => {
      title.textContent = cat === "all" ? "Men's golf apparel" : CATEGORIES.find((c) => c.id === cat).label;
      chips.innerHTML = CATEGORIES.map((c) => `<button class="chip${c.id === cat ? " on" : ""}" data-c="${c.id}">${c.label}</button>`).join("");
      wchips.innerHTML =
        `<span class="muted small">Course conditions:</span>` +
        [{ id: "any", label: "Any" }, ...CONDITIONS]
          .map((c) => `<button class="chip sm${c.id === weather ? " on" : ""}" data-w="${c.id}">${c.label}</button>`)
          .join("");
      chips.querySelectorAll(".chip").forEach((b) =>
        b.addEventListener("click", () => {
          cat = b.dataset.c;
          sync();
          draw();
        })
      );
      wchips.querySelectorAll(".chip").forEach((b) =>
        b.addEventListener("click", () => {
          weather = b.dataset.w;
          sync();
          draw();
        })
      );
      let list = PRODUCTS.filter((p) => (cat === "all" || p.category === cat) && (weather === "any" || p.conditions.includes(weather)));
      if (sort.value === "low") list = [...list].sort((a, b) => a.price - b.price);
      if (sort.value === "high") list = [...list].sort((a, b) => b.price - a.price);
      grid.innerHTML = list.length
        ? list.map(productCard).join("")
        : `<p class="muted empty-grid">Nothing matches those filters yet. <a class="link" href="shop.html">See everything</a></p>`;
      count.textContent = `${list.length} item${list.length === 1 ? "" : "s"}`;
      bindCards(grid);
    };
    sort.addEventListener("change", draw);
    draw();
  },

  product() {
    const params = new URLSearchParams(location.search);
    const p = getProduct(params.get("id")) || PRODUCTS[0];
    let colorIndex = Math.min(Number(params.get("c")) || 0, p.colors.length - 1);
    const sizes = p.sizes;
    let size = savedSizeFor(p);
    const fromFinder = sizes.length > 1 && size;
    let fit = p.fits?.[0] || null;
    document.title = `${p.name} | ${BRAND.name}`;
    const isShirt = p.category === MULTIBUY.category;
    const waist = isWaistSized(p);
    const sized = sizes.length > 1;

    const el = document.getElementById("product");
    el.innerHTML = `
      <nav class="crumbs"><a href="shop.html">Shop</a> / <a href="shop.html?c=${p.category}">${CATEGORIES.find((c) => c.id === p.category).label}</a></nav>
      <div class="pdp">
        <div class="pdp-media">
          <button class="pdp-art" aria-label="Open photo full screen"></button>
          <div class="thumbs"></div>
        </div>
        <div class="pdp-info">
          ${p.badge ? `<span class="tag static">${esc(p.badge)}</span>` : ""}
          <h1>${esc(p.name)}</h1>
          <p class="pdp-price">${priceTag(p)}</p>
          ${isShirt ? `<p class="mb-note"><strong>Multi-buy:</strong> any 2 shirts save 10%, 3 or more save 15%. Mix styles and colours.</p>` : ""}
          ${p.description ? `<p>${esc(p.description)}</p>` : ""}
          <div class="cond-tags">${p.conditions.map((c) => `<a href="shop.html?w=${c}" class="cond-tag">${CONDITIONS.find((x) => x.id === c).label}</a>`).join("")}</div>
          <div class="opt">
            <div class="opt-label">Colour: <strong class="color-name"></strong></div>
            <div class="swatches lg">${p.colors
              .map((c, i) => `<button class="swatch" style="--c:${c.body}" data-i="${i}" aria-label="${esc(c.name)}"></button>`)
              .join("")}</div>
          </div>
          ${
            p.fits
              ? `<div class="opt">
            <div class="opt-label">Fit: <strong class="fit-name">${esc(fit)}</strong></div>
            <div class="sizes fits">${p.fits.map((f) => `<button class="size fit${f === fit ? " on" : ""}" data-f="${esc(f)}">${esc(f)}</button>`).join("")}</div>
          </div>`
              : ""
          }
          <div class="opt">
            <div class="opt-label">${waist ? "Waist size (inches)" : "Size"}${sized ? '<span class="size-links"><a href="#" class="link small find-size">Find my size</a> <a href="#" class="link small open-chart">Size chart</a></span>' : ""}</div>
            <div class="sizes picks">${sizes.map((s) => `<button class="size${s === size ? " on" : ""}" data-s="${s}">${s}</button>`).join("")}</div>
            ${fromFinder ? `<p class="muted small size-hint">Pre-selected from your size finder result.</p>` : ""}
          </div>
          <button class="btn btn-block add">Add to bag · ${money(priceOf(p))}</button>
          <ul class="assure">
            <li>Delivers to ${esc(market.country.name)} in ${market.region.days}</li>
            <li>Free delivery over ${money(market.freeOver())}</li>
            <li>30-day returns on unworn items</li>
          </ul>
          <div class="accordions">
            <details open><summary>Details</summary><ul>${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></details>
            ${p.sizeChart ? `<details><summary>Size chart</summary><button class="chart-btn open-chart" aria-label="Open size chart"><img src="${esc(p.sizeChart)}" alt="${esc(p.name)} size chart" loading="lazy"></button></details>` : ""}
            <details><summary>Reviews</summary><p>No reviews yet. Reviews from verified buyers will appear here once the store is live.</p></details>
          </div>
        </div>
      </div>
      ${LOOKS.some((l) => l.pieces.some((pc) => pc.product === p.id)) ? `<section class="section look-section" id="pdp-look"></section>` : ""}
      <section class="section">
        <div class="section-head"><h2>You might also like</h2></div>
        <div class="grid" id="related"></div>
      </section>`;

    const art = el.querySelector(".pdp-art");
    const thumbs = el.querySelector(".thumbs");
    let shot = 0;
    const drawShot = () => {
      art.innerHTML = productImage(p, colorIndex, shot) + `<span class="zoom-hint">Click to enlarge</span>`;
      thumbs.querySelectorAll("button").forEach((b) => b.classList.toggle("on", Number(b.dataset.n) === shot));
    };
    art.addEventListener("click", () => lightbox(p, colorIndex, shot));
    const drawColor = () => {
      shot = 0;
      const photos = photosOf(p, colorIndex);
      thumbs.innerHTML =
        photos.length > 1
          ? photos.map((_, n) => `<button data-n="${n}" aria-label="Show photo ${n + 1}">${productImage(p, colorIndex, n)}</button>`).join("")
          : "";
      thumbs.querySelectorAll("button").forEach((b) =>
        b.addEventListener("click", () => {
          shot = Number(b.dataset.n);
          drawShot();
        })
      );
      drawShot();
      el.querySelector(".color-name").textContent = p.colors[colorIndex].name;
      el.querySelectorAll(".swatches .swatch").forEach((s) => s.classList.toggle("on", Number(s.dataset.i) === colorIndex));
    };
    el.querySelectorAll(".swatches .swatch").forEach((s) =>
      s.addEventListener("click", () => {
        colorIndex = Number(s.dataset.i);
        history.replaceState(null, "", `product.html?id=${p.id}&c=${colorIndex}`);
        drawColor();
      })
    );
    const picks = el.querySelector(".sizes.picks");
    const pickSize = (s) => {
      size = s;
      picks.querySelectorAll(".size").forEach((x) => x.classList.toggle("on", x.dataset.s === s));
      picks.classList.remove("need");
    };
    picks.querySelectorAll(".size").forEach((b) => b.addEventListener("click", () => pickSize(b.dataset.s)));
    el.querySelectorAll(".fit").forEach((b) =>
      b.addEventListener("click", () => {
        fit = b.dataset.f;
        el.querySelectorAll(".fit").forEach((x) => x.classList.toggle("on", x === b));
        el.querySelector(".fit-name").textContent = fit;
      })
    );
    el.querySelector(".find-size")?.addEventListener("click", (e) => {
      e.preventDefault();
      sizeFinder((r) => {
        const s = waist ? pickWaist(sizes, r.waist) : sizes.includes(r.shirt) ? r.shirt : null;
        if (s) pickSize(s);
        else toast(waist ? "Add your trouser waist to get a size" : `${r.shirt} isn't available in this style`);
      }, waist);
    });
    el.querySelectorAll(".open-chart").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.preventDefault();
        sizeGuide(p);
      })
    );
    el.querySelector(".add").addEventListener("click", () => {
      if (!size) {
        picks.classList.add("need");
        toast("Pick a size first");
        return;
      }
      bag.add(p.id, colorIndex, fit ? `${size} · ${fit}` : size);
    });
    drawColor();

    const look = LOOKS.find((l) => l.pieces.some((pc) => pc.product === p.id));
    if (look) renderLook(document.getElementById("pdp-look"), look);

    const pairs = { shirts: ["shorts", "pants"], shorts: ["shirts"], pants: ["shirts"] };
    const related = PRODUCTS.filter((x) => x.id !== p.id && pairs[p.category].includes(x.category)).slice(0, 4);
    const grid = document.getElementById("related");
    grid.innerHTML = related.map(productCard).join("");
    bindCards(grid);
  },

  about() {
    document.querySelectorAll("[data-signup]").forEach((el) => (el.innerHTML = signupForm(el.dataset.signup)));
  },
};

document.addEventListener("DOMContentLoaded", () => {
  market.init();
  pages[document.body.dataset.page]?.();
  renderChrome();
  bag.mount();
  bindSignups();
  bindActions();
});
