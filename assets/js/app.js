// Shared site behaviour: header/footer, bag, waitlist, and per-page rendering.
// The bag lives in localStorage so it survives page loads. Checkout is a
// placeholder until the store moves onto Shopify for the February 2027 launch.

const CURRENCY = "S$";
const FREE_SHIPPING_AT = 100;
const BAG_KEY = "fs-bag";

const money = (n) => `${CURRENCY}${n.toFixed(n % 1 ? 2 : 0)}`;

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
      /* private mode — the bag just won't persist */
    }
  },
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function productImage(product, colorIndex = 0) {
  const c = product.colors[colorIndex] || product.colors[0];
  if (c.image) return `<img src="${esc(c.image)}" alt="${esc(product.name)} in ${esc(c.name)}" loading="lazy">`;
  return garmentSVG(product.type, c, c.bg);
}

/* ------------------------------------------------------------ chrome */

function renderChrome() {
  const page = document.body.dataset.page;
  const link = (href, label, key) =>
    `<a href="${href}"${page === key ? ' aria-current="page"' : ""}>${label}</a>`;

  document.getElementById("site-header").innerHTML = `
    <div class="announce">Drop 01 lands February 2027 · <a href="index.html#join">Join the Society</a> for early access</div>
    <div class="header-inner">
      <button class="icon-btn menu-toggle" aria-label="Open menu" aria-expanded="false">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" stroke-width="1.6"/></svg>
      </button>
      <nav class="nav nav-left" aria-label="Main">
        ${link("shop.html", "Shop Women", "shop")}
        ${link("shop.html?c=men", "Men <span class='soon'>Soon</span>", "men")}
        ${link("story.html", "Our Story", "story")}
      </nav>
      <a class="logo" href="index.html" aria-label="Fairway Society home">
        <img src="brand/wordmark-simple-forest.svg" alt="Fairway Society" width="220" height="56">
      </a>
      <nav class="nav nav-right" aria-label="Secondary">
        ${link("brand.html", "Brand", "brand")}
        <button class="icon-btn bag-toggle" aria-label="Open bag">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>
          <span class="bag-count" hidden>0</span>
        </button>
      </nav>
    </div>
    <div class="mobile-nav" hidden>
      ${link("shop.html", "Shop Women", "shop")}
      ${link("shop.html?c=men", "Men — coming soon", "men")}
      ${link("story.html", "Our Story", "story")}
      ${link("brand.html", "Brand", "brand")}
    </div>`;

  document.getElementById("site-footer").innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="brand/monogram-cream.svg" alt="" width="64" height="64">
        <p>Refined golf apparel for the new generation of golfers. Designed in Singapore.</p>
      </div>
      <div>
        <h4>Shop</h4>
        <a href="shop.html?c=tops">Tops</a><a href="shop.html?c=bottoms">Skorts</a>
        <a href="shop.html?c=dresses">Dresses</a><a href="shop.html?c=accessories">Accessories</a>
      </div>
      <div>
        <h4>Society</h4>
        <a href="story.html">Our Story</a><a href="brand.html">Brand</a><a href="index.html#join">Join the waitlist</a>
      </div>
      <div>
        <h4>Help</h4>
        <a href="#" data-soon>Shipping &amp; returns</a><a href="#" data-soon>Size guide</a><a href="#" data-soon>Contact</a>
      </div>
    </div>
    <div class="footer-base">
      <span>© ${new Date().getFullYear()} Fairway Society</span>
      <span class="script">For the love of the fairway</span>
    </div>`;

  const toggle = document.querySelector(".menu-toggle");
  const mobile = document.querySelector(".mobile-nav");
  toggle.addEventListener("click", () => {
    const open = mobile.hidden;
    mobile.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.querySelector(".bag-toggle").addEventListener("click", () => bag.open());
  bindSoonLinks();
}

function bindSoonLinks(root = document) {
  root.querySelectorAll("[data-soon]:not([data-soon-bound])").forEach((a) => {
    a.dataset.soonBound = "1";
    a.addEventListener("click", (e) => {
      e.preventDefault();
      toast("That page is coming with the February launch.");
    });
  });
}

/* ------------------------------------------------------------ bag */

const bag = {
  items: store.get(BAG_KEY, []),

  save() {
    store.set(BAG_KEY, this.items);
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

  count() {
    return this.items.reduce((n, i) => n + i.qty, 0);
  },

  subtotal() {
    return this.items.reduce((sum, i) => sum + (getProduct(i.productId)?.price || 0) * i.qty, 0);
  },

  mount() {
    const el = document.createElement("div");
    el.innerHTML = `
      <div class="scrim" hidden></div>
      <aside class="drawer" aria-label="Your bag" aria-hidden="true">
        <header><h2>Your bag</h2><button class="icon-btn drawer-close" aria-label="Close bag">✕</button></header>
        <div class="ship-meter"></div>
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
    const left = FREE_SHIPPING_AT - sub;
    document.querySelector(".ship-meter").innerHTML = count
      ? `<p>${left > 0 ? `You're <strong>${money(left)}</strong> away from free delivery` : "You've unlocked <strong>free delivery</strong>"}</p>
         <div class="meter"><span style="width:${Math.min(100, (sub / FREE_SHIPPING_AT) * 100)}%"></span></div>`
      : "";

    if (!count) {
      lines.innerHTML = `<div class="empty"><img src="brand/monogram-forest.svg" alt="" width="72"><p>Your bag is empty.</p><a class="btn" href="shop.html">Shop Drop 01</a></div>`;
      document.querySelector(".drawer-foot").innerHTML = "";
      return;
    }

    lines.innerHTML = this.items
      .map((i) => {
        const p = getProduct(i.productId);
        if (!p) return "";
        const c = p.colors[i.colorIndex] || p.colors[0];
        return `
          <div class="line">
            <a class="line-img" href="product.html?id=${p.id}&c=${i.colorIndex}">${productImage(p, i.colorIndex)}</a>
            <div class="line-info">
              <a href="product.html?id=${p.id}&c=${i.colorIndex}" class="line-name">${esc(p.name)}</a>
              <span class="muted">${esc(c.name)} · ${esc(i.size)}</span>
              <div class="qty" data-key="${esc(i.key)}">
                <button aria-label="Decrease quantity" data-d="-1">−</button><span>${i.qty}</span><button aria-label="Increase quantity" data-d="1">+</button>
              </div>
            </div>
            <span class="line-price">${money(p.price * i.qty)}</span>
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

    document.querySelector(".drawer-foot").innerHTML = `
      <div class="subtotal"><span>Subtotal</span><span>${money(sub)}</span></div>
      <p class="muted small">Prices include GST. Delivery calculated at checkout.</p>
      <button class="btn btn-block checkout">Checkout</button>`;
    document.querySelector(".checkout").addEventListener("click", () => checkoutSoon());
  },
};

function checkoutSoon() {
  modal(`
    <img src="brand/badge-forest.svg" alt="" width="120" class="modal-badge">
    <h2>Checkout opens February 2027</h2>
    <p>Drop 01 isn't on sale just yet. We'll keep your bag saved. Join the Society and you'll get first access before the public launch.</p>
    ${waitlistForm("checkout")}`);
}

/* ------------------------------------------------------------ waitlist */

function waitlistForm(source) {
  return `
    <form class="waitlist" data-source="${source}">
      <label class="sr-only" for="wl-${source}">Email address</label>
      <input id="wl-${source}" type="email" name="email" placeholder="Your email" required autocomplete="email">
      <button class="btn" type="submit">Join the Society</button>
      <p class="consent">By joining, you agree to receive emails from Fairway Society about the launch. Unsubscribe anytime. See our <a href="#" data-soon>privacy policy</a>.</p>
    </form>`;
}

function bindWaitlists(root = document) {
  root.querySelectorAll("form.waitlist:not([data-bound])").forEach((form) => {
    form.dataset.bound = "1";
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // TODO: send to the email platform (Shopify Customers / Klaviyo) at launch.
      const list = store.get("fs-waitlist", []);
      list.push({ email: form.email.value, source: form.dataset.source, at: new Date().toISOString() });
      store.set("fs-waitlist", list);
      form.outerHTML = `<p class="joined"><span class="script">Welcome to the Society.</span><br>We'll be in touch before Drop 01 goes live.</p>`;
    });
  });
}

/* ------------------------------------------------------------ ui bits */

function modal(html) {
  const wrap = document.createElement("div");
  wrap.className = "modal-wrap";
  wrap.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><button class="icon-btn modal-close" aria-label="Close">✕</button>${html}</div>`;
  document.body.appendChild(wrap);
  const close = () => wrap.remove();
  wrap.addEventListener("click", (e) => e.target === wrap && close());
  wrap.querySelector(".modal-close").addEventListener("click", close);
  bindWaitlists(wrap);
  bindSoonLinks(wrap);
  wrap.querySelector("input, button")?.focus();
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
        <div class="card-art">${productImage(p, 0)}</div>
      </a>
      <div class="card-body">
        <div class="card-row"><a href="product.html?id=${p.id}" class="card-name">${esc(p.name)}</a><span class="price">${money(p.price)}</span></div>
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
        card.querySelector(".card-art").innerHTML = productImage(p, i);
        card.querySelectorAll(".swatch").forEach((x) => x.classList.toggle("on", x === s));
        card.querySelectorAll("a[href^='product.html']").forEach((a) => (a.href = `product.html?id=${p.id}&c=${i}`));
      })
    );
  });
}

/* ------------------------------------------------------------ pages */

const pages = {
  home() {
    const grid = document.getElementById("featured");
    const picks = ["clubhouse-knit-polo", "back-nine-pleated-skort", "dawn-patrol-quarter-zip", "members-polo-dress"];
    grid.innerHTML = picks.map((id) => productCard(getProduct(id))).join("");
    bindCards(grid);

    const hero = document.getElementById("hero-art");
    const heroPieces = [
      ["clubhouse-knit-polo", 0],
      ["back-nine-pleated-skort", 1],
      ["society-cap", 0],
    ];
    hero.innerHTML = heroPieces
      .map(([id, c], n) => {
        const p = getProduct(id);
        return `<a href="product.html?id=${id}&c=${c}" class="hero-tile t${n}" aria-label="${esc(p.name)}">${productImage(p, c)}</a>`;
      })
      .join("");

    document.querySelectorAll("[data-waitlist]").forEach((el) => (el.innerHTML = waitlistForm(el.dataset.waitlist)));
  },

  shop() {
    const params = new URLSearchParams(location.search);
    let cat = params.get("c") || "all";
    const main = document.getElementById("shop");

    if (cat === "men") {
      document.body.dataset.page = "men";
      main.innerHTML = `
        <section class="coming-soon">
          <img src="brand/badge-forest.svg" alt="" width="160">
          <p class="eyebrow">Menswear</p>
          <h1>The men's line is on its way</h1>
          <p>We're launching with womenswear first. Men's polos, quarter-zips and caps come in a later drop. Leave your email and you'll hear first.</p>
          ${waitlistForm("men")}
          <a class="link" href="shop.html">Shop the women's collection →</a>
        </section>`;
      renderChrome();
      return;
    }

    const chips = document.getElementById("chips");
    const grid = document.getElementById("grid");
    const sort = document.getElementById("sort");
    const count = document.getElementById("count");

    const draw = () => {
      chips.innerHTML = CATEGORIES.map(
        (c) => `<button class="chip${c.id === cat ? " on" : ""}" data-c="${c.id}">${c.label}</button>`
      ).join("");
      chips.querySelectorAll(".chip").forEach((b) =>
        b.addEventListener("click", () => {
          cat = b.dataset.c;
          history.replaceState(null, "", cat === "all" ? "shop.html" : `shop.html?c=${cat}`);
          draw();
        })
      );
      let list = PRODUCTS.filter((p) => cat === "all" || p.category === cat);
      if (sort.value === "low") list = [...list].sort((a, b) => a.price - b.price);
      if (sort.value === "high") list = [...list].sort((a, b) => b.price - a.price);
      grid.innerHTML = list.map(productCard).join("");
      count.textContent = `${list.length} piece${list.length === 1 ? "" : "s"}`;
      bindCards(grid);
    };
    sort.addEventListener("change", draw);
    draw();
  },

  product() {
    const params = new URLSearchParams(location.search);
    const p = getProduct(params.get("id")) || PRODUCTS[0];
    let colorIndex = Math.min(Number(params.get("c")) || 0, p.colors.length - 1);
    const sizes = p.sizes || SIZES;
    let size = sizes.length === 1 ? sizes[0] : null;
    document.title = `${p.name} — Fairway Society`;

    const el = document.getElementById("product");
    el.innerHTML = `
      <nav class="crumbs"><a href="shop.html">Shop</a> / <a href="shop.html?c=${p.category}">${CATEGORIES.find((c) => c.id === p.category).label}</a></nav>
      <div class="pdp">
        <div class="pdp-media"><div class="pdp-art"></div></div>
        <div class="pdp-info">
          ${p.badge ? `<span class="tag static">${esc(p.badge)}</span>` : ""}
          <h1>${esc(p.name)}</h1>
          <p class="pdp-price">${money(p.price)}</p>
          <p>${esc(p.description)}</p>
          <div class="opt">
            <div class="opt-label">Colour: <strong class="color-name"></strong></div>
            <div class="swatches lg">${p.colors
              .map((c, i) => `<button class="swatch" style="--c:${c.body}" data-i="${i}" aria-label="${esc(c.name)}"></button>`)
              .join("")}</div>
          </div>
          <div class="opt">
            <div class="opt-label">Size${sizes.length > 1 ? ' <a href="#" class="link small" data-soon>Size guide</a>' : ""}</div>
            <div class="sizes">${sizes
              .map((s) => `<button class="size${s === size ? " on" : ""}" data-s="${s}">${s}</button>`)
              .join("")}</div>
          </div>
          <button class="btn btn-block add">Add to bag — ${money(p.price)}</button>
          <p class="muted small center">Free Singapore delivery over ${money(FREE_SHIPPING_AT)} · Free 30-day returns</p>
          <div class="accordions">
            <details open><summary>Details</summary><ul>${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></details>
            <details><summary>Fabric &amp; care</summary><p>Machine wash cold on a delicate cycle and lay flat to dry. Don't iron over the embroidery. Final fabric composition will be confirmed once sampling is finished.</p></details>
            <details><summary>Fit</summary><p>True to size, with a slightly tailored fit. If you're between sizes and like room for a full swing, size up.</p></details>
          </div>
        </div>
      </div>
      <section class="section">
        <div class="section-head"><h2>Complete the look</h2></div>
        <div class="grid" id="related"></div>
      </section>`;

    const art = el.querySelector(".pdp-art");
    const drawColor = () => {
      art.innerHTML = productImage(p, colorIndex);
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
    el.querySelectorAll(".size").forEach((b) =>
      b.addEventListener("click", () => {
        size = b.dataset.s;
        el.querySelectorAll(".size").forEach((x) => x.classList.toggle("on", x === b));
        el.querySelector(".sizes").classList.remove("need");
      })
    );
    el.querySelector(".add").addEventListener("click", () => {
      if (!size) {
        el.querySelector(".sizes").classList.add("need");
        toast("Pick a size first");
        return;
      }
      bag.add(p.id, colorIndex, size);
    });
    drawColor();

    const pairs = { tops: ["bottoms", "accessories"], bottoms: ["tops", "accessories"], dresses: ["accessories", "tops"], accessories: ["tops", "bottoms"] };
    const related = PRODUCTS.filter((x) => x.id !== p.id && pairs[p.category].includes(x.category)).slice(0, 4);
    const grid = document.getElementById("related");
    grid.innerHTML = related.map(productCard).join("");
    bindCards(grid);
  },

  story() {
    document.querySelectorAll("[data-waitlist]").forEach((el) => (el.innerHTML = waitlistForm(el.dataset.waitlist)));
  },

  brand() {},
};

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  pages[page]?.();
  if (document.body.dataset.page !== "men") renderChrome();
  bag.mount();
  bindWaitlists();
  bindSoonLinks();
});
