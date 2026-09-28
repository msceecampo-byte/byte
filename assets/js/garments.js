// Flat illustrations of each garment, drawn in the product's colourway.
// Stand-ins until the February 2027 campaign photography is ready — swap a
// product's `image` field in products.js for a photo URL and it is used instead.

(function () {
  const OUTLINE = 'stroke="rgba(31,58,43,.22)" stroke-width="1.6" stroke-linejoin="round"';

  const mark = (x, y, color, size = 15) =>
    `<text x="${x}" y="${y}" font-family="'Playfair Display',serif" font-weight="600" font-size="${size}" fill="${color}" text-anchor="middle" letter-spacing="-1">FS</text>`;

  function pleats(x0, y0, x1, y1, bx0, by, bx1, n, color) {
    // lines from the waist (x0..x1 at y0/y1) fanning to the hem (bx0..bx1 at by)
    let out = "";
    for (let i = 1; i < n; i++) {
      const t = i / n;
      const tx = x0 + (x1 - x0) * t;
      const bx = bx0 + (bx1 - bx0) * t;
      const hemDip = Math.sin(t * Math.PI) * 12;
      out += `<path d="M${tx},${y0} L${bx},${by + hemDip}" stroke="${color}" stroke-width="1.4" opacity=".35"/>`;
    }
    return out;
  }

  function cable(x, y0, y1, color) {
    let d = `M${x},${y0}`;
    for (let y = y0; y < y1; y += 24) {
      d += ` C${x + 12},${y + 6} ${x + 12},${y + 18} ${x},${y + 24}`;
    }
    let d2 = `M${x},${y0}`;
    for (let y = y0; y < y1; y += 24) {
      d2 += ` C${x - 12},${y + 6} ${x - 12},${y + 18} ${x},${y + 24}`;
    }
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="3" opacity=".45"/><path d="${d2}" fill="none" stroke="${color}" stroke-width="3" opacity=".45"/>`;
  }

  const shapes = {
    polo({ body, trim, accent }) {
      return `
        <path d="M140,110 L108,122 L58,178 L86,218 L118,197 L118,420 Q200,434 282,420 L282,197 L314,218 L342,178 L292,122 L260,110 Q200,138 140,110 Z" fill="${body}" ${OUTLINE}/>
        <path d="M58,178 L86,218 L96,211 L68,171 Z M342,178 L314,218 L304,211 L332,171 Z" fill="${trim}"/>
        <path d="M150,106 Q200,94 250,106 L246,116 Q200,106 154,116 Z" fill="${trim}"/>
        <path d="M150,108 L200,138 L170,164 L138,120 Z M250,108 L200,138 L230,164 L262,120 Z" fill="${body}" ${OUTLINE}/>
        <path d="M170,164 L138,120 M230,164 L262,120" stroke="${trim}" stroke-width="5"/>
        <rect x="192" y="138" width="16" height="70" fill="${body}" ${OUTLINE}/>
        <circle cx="200" cy="156" r="3.2" fill="${accent}"/><circle cx="200" cy="174" r="3.2" fill="${accent}"/><circle cx="200" cy="192" r="3.2" fill="${accent}"/>
        ${mark(248, 190, accent)}`;
    },

    knitPolo({ body, trim, accent }) {
      let ribs = "";
      for (let x = 130; x <= 270; x += 10) ribs += `<path d="M${x},200 L${x},418" stroke="${accent}" stroke-width="1" opacity=".18"/>`;
      return `
        <path d="M140,110 L112,122 L70,172 L96,206 L120,192 L120,420 Q200,432 280,420 L280,192 L304,206 L330,172 L288,122 L260,110 Q200,138 140,110 Z" fill="${body}" ${OUTLINE}/>
        ${ribs}
        <path d="M120,392 Q200,404 280,392 L280,420 Q200,432 120,420 Z" fill="${trim}" opacity=".9"/>
        <path d="M70,172 L96,206 L104,200 L78,166 Z M330,172 L304,206 L296,200 L322,166 Z" fill="${trim}"/>
        <path d="M150,108 L200,138 L166,166 L134,120 Z M250,108 L200,138 L234,166 L266,120 Z" fill="${trim}" ${OUTLINE}/>
        <rect x="192" y="138" width="16" height="62" fill="${body}" ${OUTLINE}/>
        <circle cx="200" cy="154" r="3.2" fill="${accent}"/><circle cx="200" cy="170" r="3.2" fill="${accent}"/><circle cx="200" cy="186" r="3.2" fill="${accent}"/>
        <circle cx="244" cy="238" r="18" fill="none" stroke="${accent}" stroke-width="1.5" opacity=".6"/>${mark(244, 244, accent, 13)}`;
    },

    quarterZip({ body, trim, accent }) {
      return `
        <path d="M146,104 L112,118 L82,190 L62,400 L94,406 L118,232 L118,420 Q200,434 282,420 L282,232 L306,406 L338,400 L318,190 L288,118 L254,104 Q200,120 146,104 Z" fill="${body}" ${OUTLINE}/>
        <path d="M62,400 L94,406 L96,390 L64,384 Z M338,400 L306,406 L304,390 L336,384 Z" fill="${trim}" opacity=".85"/>
        <path d="M158,74 L242,74 L254,104 Q200,120 146,104 Z" fill="${body}" ${OUTLINE}/>
        <path d="M200,74 L200,206" stroke="${trim}" stroke-width="3"/>
        <rect x="196" y="100" width="8" height="18" rx="2" fill="${accent}"/>
        ${mark(250, 176, accent)}`;
    },

    pleatedSkirt({ body, trim, accent }) {
      return `
        <path d="M128,150 L272,150 L324,380 Q200,398 76,380 Z" fill="${body}" ${OUTLINE}/>
        ${pleats(128, 150, 272, 150, 76, 380, 324, 12, accent)}
        <rect x="128" y="118" width="144" height="34" rx="3" fill="${body}" ${OUTLINE}/>
        <path d="M128,140 L272,140" stroke="${trim}" stroke-width="3"/>
        <path d="M82,356 Q200,374 318,356" fill="none" stroke="${trim}" stroke-width="5"/>
        <path d="M80,366 Q200,384 320,366" fill="none" stroke="${accent}" stroke-width="3"/>`;
    },

    wrapSkort({ body, trim, accent }) {
      return `
        <path d="M134,150 L266,150 L306,372 Q200,386 94,372 Z" fill="${body}" ${OUTLINE}/>
        <rect x="134" y="120" width="132" height="32" rx="3" fill="${body}" ${OUTLINE}/>
        <path d="M232,152 L268,376" stroke="${trim}" stroke-width="6"/>
        <path d="M96,370 Q200,384 304,370" fill="none" stroke="${trim}" stroke-width="6"/>
        <path d="M134,120 L266,120 M134,152 L266,152" stroke="${trim}" stroke-width="4"/>
        <path d="M232,136 C204,110 196,146 232,136 C262,110 270,146 232,136 Z" fill="${body}" stroke="${trim}" stroke-width="4"/>
        <path d="M232,136 L220,196 M232,136 L246,202" stroke="${trim}" stroke-width="5" stroke-linecap="round"/>
        <rect x="150" y="300" width="22" height="22" rx="3" fill="${accent}"/>${mark(161, 317, body, 11)}`;
    },

    dress({ body, trim, accent }) {
      return `
        <path d="M150,262 L250,262 L318,452 Q200,470 82,452 Z" fill="${body}" ${OUTLINE}/>
        ${pleats(150, 262, 250, 262, 82, 452, 318, 14, trim)}
        <path d="M148,72 L120,84 L86,128 L110,160 L130,150 L136,264 L264,264 L270,150 L290,160 L314,128 L280,84 L252,72 Q200,98 148,72 Z" fill="${body}" ${OUTLINE}/>
        <path d="M86,128 L110,160 L118,154 L94,122 Z M314,128 L290,160 L282,154 L306,122 Z" fill="${trim}"/>
        <path d="M158,70 L200,98 L172,122 L144,82 Z M242,70 L200,98 L228,122 L256,82 Z" fill="${trim}" ${OUTLINE}/>
        <rect x="193" y="98" width="14" height="54" fill="${body}" ${OUTLINE}/>
        <circle cx="200" cy="112" r="3" fill="${accent}"/><circle cx="200" cy="128" r="3" fill="${accent}"/><circle cx="200" cy="144" r="3" fill="${accent}"/>
        <rect x="136" y="254" width="128" height="12" fill="${trim}"/>`;
    },

    vest({ body, trim, accent }) {
      return `
        <path d="M150,96 L118,112 Q106,160 116,204 L118,420 Q200,434 282,420 L284,204 Q294,160 282,112 L250,96 L200,206 Z" fill="${body}" ${OUTLINE}/>
        ${cable(160, 226, 400, accent)}${cable(240, 226, 400, accent)}${cable(200, 230, 400, accent)}
        <path d="M150,96 L200,206 L250,96" fill="none" stroke="${trim}" stroke-width="12" stroke-linejoin="round"/>
        <path d="M150,96 L200,206 L250,96" fill="none" stroke="${accent}" stroke-width="3" stroke-linejoin="round" opacity=".7"/>
        <path d="M118,112 Q106,160 116,204" fill="none" stroke="${trim}" stroke-width="9"/>
        <path d="M282,112 Q294,160 284,204" fill="none" stroke="${trim}" stroke-width="9"/>
        <path d="M118,396 Q200,408 282,396 L282,420 Q200,434 118,420 Z" fill="${trim}"/>
        <path d="M118,404 Q200,416 282,404" fill="none" stroke="${accent}" stroke-width="2.5" opacity=".7"/>`;
    },

    cap({ body, trim, accent }) {
      return `
        <path d="M98,262 Q200,242 302,262 Q334,306 252,312 Q200,296 148,312 Q66,306 98,262 Z" fill="${trim}" ${OUTLINE}/>
        <path d="M112,264 Q108,142 200,134 Q292,142 288,264 Q200,248 112,264 Z" fill="${body}" ${OUTLINE}/>
        <path d="M200,136 L200,254 M200,136 Q150,160 146,258 M200,136 Q250,160 254,258" fill="none" stroke="${accent}" stroke-width="1.3" opacity=".3"/>
        <circle cx="200" cy="136" r="6" fill="${body}" ${OUTLINE}/>
        ${mark(200, 222, accent, 30)}`;
    },

    visor({ body, trim, accent }) {
      return `
        <path d="M100,238 Q200,214 300,238 Q330,306 200,314 Q70,306 100,238 Z" fill="${body}" ${OUTLINE}/>
        <path d="M104,236 Q200,212 296,236" fill="none" stroke="${trim}" stroke-width="4"/>
        <path d="M112,196 Q200,176 288,196 L292,240 Q200,218 108,240 Z" fill="${body}" ${OUTLINE}/>
        <path d="M112,204 Q200,184 288,204" fill="none" stroke="${trim}" stroke-width="3"/>
        ${mark(200, 226, accent, 22)}`;
    },
  };

  window.garmentSVG = function (type, colorway, bg) {
    const draw = shapes[type] || shapes.polo;
    return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      ${bg ? `<rect width="400" height="500" fill="${bg}"/>` : ""}
      <ellipse cx="200" cy="468" rx="130" ry="10" fill="rgba(31,58,43,.08)"/>
      ${draw(colorway)}
    </svg>`;
  };
})();
