// Flat illustrations of each garment, drawn in the product's colourway.
// Stand-ins until product photos are ready: add `image: "assets/img/…jpg"` to a
// colourway in products.js and the photo is used instead.

(function () {
  const OUTLINE = 'stroke="rgba(20,30,45,.2)" stroke-width="1.6" stroke-linejoin="round"';
  let uid = 0;

  const mark = (x, y, color, size = 14) =>
    `<text x="${x}" y="${y}" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="${size}" fill="${color}" text-anchor="middle" letter-spacing=".5">PAR3</text>`;

  // Body fill: a flat colour, or a stripe / geometric print built on it.
  function bodyFill(c) {
    if (!c.pattern) return { defs: "", fill: c.body };
    const id = `pat${++uid}`;
    const inner =
      c.pattern === "stripe"
        ? `<rect width="20" height="20" fill="${c.body}"/><rect y="12" width="20" height="4" fill="${c.accent}" opacity=".85"/>`
        : `<rect width="28" height="28" fill="${c.body}"/><path d="M0,14 L7,7 L14,14 L7,21 Z" fill="${c.accent}" opacity=".55"/><circle cx="21" cy="7" r="2.4" fill="${c.accent}" opacity=".7"/><path d="M17,24 h8" stroke="${c.accent}" stroke-width="2" opacity=".5"/>`;
    const size = c.pattern === "stripe" ? 20 : 28;
    return {
      defs: `<defs><pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">${inner}</pattern></defs>`,
      fill: `url(#${id})`,
    };
  }

  const shapes = {
    polo(c, f) {
      return `
        <path d="M140,110 L108,122 L58,178 L86,218 L118,197 L118,420 Q200,434 282,420 L282,197 L314,218 L342,178 L292,122 L260,110 Q200,138 140,110 Z" fill="${f}" ${OUTLINE}/>
        <path d="M58,178 L86,218 L96,211 L68,171 Z M342,178 L314,218 L304,211 L332,171 Z" fill="${c.trim}"/>
        <path d="M150,108 L200,138 L170,164 L138,120 Z M250,108 L200,138 L230,164 L262,120 Z" fill="${c.trim}" ${OUTLINE}/>
        <rect x="192" y="138" width="16" height="70" fill="${c.trim}" ${OUTLINE}/>
        <circle cx="200" cy="156" r="3.2" fill="${c.accent}"/><circle cx="200" cy="174" r="3.2" fill="${c.accent}"/><circle cx="200" cy="192" r="3.2" fill="${c.accent}"/>
        ${c.pattern ? "" : mark(250, 190, c.accent)}`;
    },

    longPolo(c, f) {
      return `
        <path d="M140,110 L108,122 L84,190 L66,404 L96,410 L118,236 L118,420 Q200,434 282,420 L282,236 L304,410 L334,404 L316,190 L292,122 L260,110 Q200,138 140,110 Z" fill="${f}" ${OUTLINE}/>
        <path d="M66,392 L96,398 L96,410 L66,404 Z M334,392 L304,398 L304,410 L334,404 Z" fill="${c.trim}" ${OUTLINE}/>
        <path d="M150,108 L200,138 L170,164 L138,120 Z M250,108 L200,138 L230,164 L262,120 Z" fill="${c.trim}" ${OUTLINE}/>
        <rect x="192" y="138" width="16" height="70" fill="${c.trim}" ${OUTLINE}/>
        <circle cx="200" cy="156" r="3.2" fill="${c.accent}"/><circle cx="200" cy="174" r="3.2" fill="${c.accent}"/><circle cx="200" cy="192" r="3.2" fill="${c.accent}"/>
        ${mark(250, 190, c.accent)}`;
    },

    mockNeck(c, f) {
      return `
        <path d="M146,104 L108,120 L58,178 L86,218 L118,197 L118,420 Q200,434 282,420 L282,197 L314,218 L342,178 L292,120 L254,104 Q200,120 146,104 Z" fill="${f}" ${OUTLINE}/>
        <path d="M156,82 L244,82 L254,104 Q200,120 146,104 Z" fill="${c.body}" ${OUTLINE}/>
        <path d="M152,94 Q200,106 248,94" fill="none" stroke="${c.trim}" stroke-width="3"/>
        <path d="M58,178 L86,218 L96,211 L68,171 Z M342,178 L314,218 L304,211 L332,171 Z" fill="${c.trim}"/>
        ${mark(200, 96, c.accent, 10)}`;
    },

    quarterZip(c, f) {
      return `
        <path d="M146,104 L112,118 L82,190 L62,400 L94,406 L118,232 L118,420 Q200,434 282,420 L282,232 L306,406 L338,400 L318,190 L288,118 L254,104 Q200,120 146,104 Z" fill="${f}" ${OUTLINE}/>
        <path d="M62,400 L94,406 L96,390 L64,384 Z M338,400 L306,406 L304,390 L336,384 Z" fill="${c.trim}" opacity=".85"/>
        <path d="M158,74 L242,74 L254,104 Q200,120 146,104 Z" fill="${c.body}" ${OUTLINE}/>
        <path d="M200,74 L200,206" stroke="${c.accent}" stroke-width="2.5" opacity=".8"/>
        <rect x="196" y="100" width="8" height="18" rx="2" fill="${c.accent}"/>
        ${mark(252, 178, c.accent)}`;
    },

    jacket(c, f) {
      return `
        <path d="M146,104 L110,118 L80,190 L60,402 L94,408 L118,232 L118,424 Q200,436 282,424 L282,232 L306,408 L340,402 L320,190 L290,118 L254,104 Q200,120 146,104 Z" fill="${f}" ${OUTLINE}/>
        <path d="M156,70 L244,70 L254,104 Q200,120 146,104 Z" fill="${c.trim}" ${OUTLINE}/>
        <path d="M200,72 L200,430" stroke="${c.accent}" stroke-width="2.5" opacity=".8"/>
        <path d="M134,300 L178,300 M222,300 L266,300" stroke="${c.accent}" stroke-width="2" opacity=".5"/>
        <path d="M118,404 Q200,416 282,404" fill="none" stroke="${c.trim}" stroke-width="6"/>
        ${mark(250, 176, c.accent)}`;
    },

    vest(c, f) {
      return `
        <path d="M150,96 L118,112 Q106,160 116,204 L118,420 Q200,434 282,420 L284,204 Q294,160 282,112 L250,96 Q200,114 150,96 Z" fill="${f}" ${OUTLINE}/>
        <path d="M156,74 L244,74 L250,98 Q200,114 150,98 Z" fill="${c.trim}" ${OUTLINE}/>
        <path d="M200,76 L200,428" stroke="${c.accent}" stroke-width="2.5" opacity=".8"/>
        <path d="M118,112 Q106,160 116,204 M282,112 Q294,160 284,204" fill="none" stroke="${c.trim}" stroke-width="8"/>
        <path d="M136,300 L176,300 M224,300 L264,300" stroke="${c.accent}" stroke-width="2" opacity=".5"/>
        ${mark(244, 170, c.accent)}`;
    },

    shorts(c, f) {
      return `
        <path d="M112,150 L288,150 L316,352 L214,364 L200,244 L186,364 L84,352 Z" fill="${f}" ${OUTLINE}/>
        <rect x="112" y="118" width="176" height="34" rx="3" fill="${c.trim}" ${OUTLINE}/>
        <path d="M200,152 L200,244" stroke="rgba(20,30,45,.25)" stroke-width="1.6"/>
        <path d="M140,166 Q150,196 124,208 M260,166 Q250,196 276,208" fill="none" stroke="rgba(20,30,45,.25)" stroke-width="1.6"/>
        <path d="M130,128 v16 M270,128 v16 M166,128 v16 M234,128 v16" stroke="rgba(20,30,45,.2)" stroke-width="2"/>
        ${mark(268, 336, c.accent, 11)}`;
    },

    pants(c, f) {
      return `
        <path d="M126,100 L274,100 L292,452 L222,456 L200,176 L178,456 L108,452 Z" fill="${f}" ${OUTLINE}/>
        <rect x="126" y="68" width="148" height="34" rx="3" fill="${c.trim}" ${OUTLINE}/>
        <path d="M200,102 L200,176" stroke="rgba(20,30,45,.25)" stroke-width="1.6"/>
        <path d="M152,116 Q160,146 134,158 M248,116 Q240,146 266,158" fill="none" stroke="rgba(20,30,45,.25)" stroke-width="1.6"/>
        <path d="M144,78 v16 M256,78 v16 M178,78 v16 M222,78 v16" stroke="rgba(20,30,45,.2)" stroke-width="2"/>
        ${mark(252, 190, c.accent, 11)}`;
    },

    cap(c, f) {
      return `
        <path d="M98,262 Q200,242 302,262 Q334,306 252,312 Q200,296 148,312 Q66,306 98,262 Z" fill="${c.trim}" ${OUTLINE}/>
        <path d="M112,264 Q108,142 200,134 Q292,142 288,264 Q200,248 112,264 Z" fill="${f}" ${OUTLINE}/>
        <path d="M200,136 L200,254 M200,136 Q150,160 146,258 M200,136 Q250,160 254,258" fill="none" stroke="${c.accent}" stroke-width="1.3" opacity=".25"/>
        <circle cx="200" cy="136" r="6" fill="${c.body}" ${OUTLINE}/>
        ${mark(200, 222, c.accent, 30)}`;
    },

    bucketHat(c, f) {
      return `
        <path d="M70,286 Q200,250 330,286 Q340,320 200,326 Q60,320 70,286 Z" fill="${c.body}" ${OUTLINE}/>
        <path d="M128,280 Q124,176 200,168 Q276,176 272,280 Q200,262 128,280 Z" fill="${f}" ${OUTLINE}/>
        <path d="M128,264 Q200,246 272,264" fill="none" stroke="${c.trim}" stroke-width="6"/>
        <circle cx="146" cy="222" r="4" fill="${c.trim}"/><circle cx="254" cy="222" r="4" fill="${c.trim}"/>
        ${mark(200, 232, c.accent, 18)}`;
    },
  };

  window.garmentSVG = function (type, colorway, bg) {
    const draw = shapes[type] || shapes.polo;
    const { defs, fill } = bodyFill(colorway);
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      ${defs}
      ${bg ? `<rect width="400" height="500" fill="${bg}"/>` : ""}
      <ellipse cx="200" cy="470" rx="130" ry="10" fill="rgba(20,30,45,.07)"/>
      ${draw(colorway, fill)}
    </svg>`;
  };
})();
