// An illustrated golfer wearing a look's shirt and shorts, for "Shop the look".
// A stand-in until on-model photography is ready: the shirt takes the selected
// colour and the shorts use the real fabric print (`print` on the colourway).
// Each garment is a clickable group (data-i = the piece's index in the look).

(function () {
  let uid = 0;
  const SKIN = "#D6A47C";
  const SKIN_SHADE = "#BF8B63";
  const HAIR = "#2A211B";

  // viewBox is 640 x 800 (4:5); the figure is drawn around x = 320.
  window.MODEL_SPOTS = { top: { x: 50, y: 33 }, bottom: { x: 50, y: 57 } };

  const mirror = (d) => d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${640 - Number(x)},${y}`);

  window.modelSVG = function ({ top, bottom, topIndex, bottomIndex, label }) {
    const id = `m${++uid}`;
    const shirt = top ? top.color : { body: "#FFFFFF", accent: "#1A2139" };
    const shorts = bottom ? bottom.color : { body: "#1E2436" };
    const shortsFill = shorts.print ? `url(#${id}-print)` : shorts.body;
    const light = parseInt(shirt.body.slice(1), 16) > 0x999999;

    const armL = "M210,248 L244,258 L240,330 L234,374 Q226,394 214,388 Q206,372 208,330 Z";
    const legL = "M246,514 L310,522 L302,620 L294,696 L266,696 L260,620 Z";
    const shoeL = "M256,694 L298,694 Q310,714 300,724 L248,724 Q242,710 256,694 Z";
    const sleeveL = "M238,172 L206,250 L244,262 L252,226 Z";

    return `<svg viewBox="0 0 640 800" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4EEF6"/><stop offset="1" stop-color="#F6F8FA"/></linearGradient>
        <linearGradient id="${id}-shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".16"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient>
        ${shorts.print ? `<pattern id="${id}-print" patternUnits="userSpaceOnUse" width="170" height="170"><image href="${shorts.print}" width="170" height="170" preserveAspectRatio="xMidYMid slice"/></pattern>` : ""}
      </defs>
      <rect width="640" height="800" fill="url(#${id}-sky)"/>
      <path d="M0,590 Q180,560 330,585 T640,570 V800 H0 Z" fill="#D5E6CF"/>
      <path d="M0,640 Q220,610 420,640 T640,630 V800 H0 Z" fill="#C3DBBB"/>
      <path d="M520,600 V520" stroke="#8A8F96" stroke-width="2"/><path d="M520,520 L548,530 L520,540 Z" fill="#C0392B"/>
      <ellipse cx="320" cy="728" rx="92" ry="9" fill="rgba(20,30,45,.14)"/>

      <!-- legs, socks and shoes -->
      <path d="${legL}" fill="${SKIN}"/><path d="${mirror(legL)}" fill="${SKIN}"/>
      <path d="M264,684 H296 V700 H264 Z M376,684 H344 V700 H376 Z" fill="#fff"/>
      <path d="${shoeL}" fill="#F4F4F2" stroke="#C9CCD1" stroke-width="1.5"/><path d="${mirror(shoeL)}" fill="#F4F4F2" stroke="#C9CCD1" stroke-width="1.5"/>

      <!-- arms -->
      <path d="${armL}" fill="${SKIN}"/><path d="${mirror(armL)}" fill="${SKIN}"/>
      <ellipse cx="222" cy="388" rx="12" ry="15" fill="${SKIN_SHADE}"/><ellipse cx="418" cy="388" rx="12" ry="15" fill="${SKIN_SHADE}"/>

      <!-- head -->
      <rect x="304" y="126" width="32" height="40" rx="10" fill="${SKIN_SHADE}"/>
      <ellipse cx="320" cy="96" rx="34" ry="42" fill="${SKIN}"/>
      <ellipse cx="286" cy="100" rx="6" ry="10" fill="${SKIN_SHADE}"/><ellipse cx="354" cy="100" rx="6" ry="10" fill="${SKIN_SHADE}"/>
      <path d="M286,92 Q282,52 322,50 Q360,50 356,92 Q350,70 322,68 Q296,68 286,92 Z" fill="${HAIR}"/>

      <!-- shorts -->
      <g class="m-piece" data-i="${bottomIndex}" tabindex="0" role="button" aria-label="Shop the shorts">
        <path d="M252,390 L388,390 L400,520 L330,528 L320,452 L310,528 L240,520 Z" fill="${shortsFill}"/>
        <path d="M252,390 L388,390 L400,520 L330,528 L320,452 L310,528 L240,520 Z" fill="url(#${id}-shade)"/>
        <rect x="250" y="384" width="140" height="13" rx="2" fill="#1B1B1D"/><rect x="312" y="383" width="16" height="15" rx="2" fill="none" stroke="#B8BCC2" stroke-width="2.5"/>
      </g>

      <!-- shirt -->
      <g class="m-piece" data-i="${topIndex}" tabindex="0" role="button" aria-label="Shop the shirt">
        <path d="M270,160 L238,172 L252,226 L250,392 Q320,402 390,392 L388,226 L402,172 L370,160 Q320,180 270,160 Z" fill="${shirt.body}"/>
        <path d="${sleeveL}" fill="${shirt.body}"/><path d="${mirror(sleeveL)}" fill="${shirt.body}"/>
        <path d="M270,160 L238,172 L252,226 L250,392 Q320,402 390,392 L388,226 L402,172 L370,160 Q320,180 270,160 Z" fill="url(#${id}-shade)"/>
        <path d="M206,250 L244,262 L245,254 L209,243 Z M434,250 L396,262 L395,254 L431,243 Z" fill="#000" opacity=".12"/>
        <path d="M280,156 L320,184 L298,202 L270,164 Z M360,156 L320,184 L342,202 L370,164 Z" fill="${shirt.body}" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/>
        <rect x="314" y="184" width="12" height="54" fill="${shirt.body}" stroke="rgba(0,0,0,.2)" stroke-width="1.2"/>
        <circle cx="320" cy="198" r="2.6" fill="#fff"/><circle cx="320" cy="212" r="2.6" fill="#fff"/><circle cx="320" cy="226" r="2.6" fill="#fff"/>
        <text x="360" y="222" font-family="Georgia,serif" font-size="11" font-weight="700" fill="${light ? "#1A2139" : "#fff"}">Par<tspan font-size="8">III</tspan></text>
      </g>
    </svg>`;
  };
})();
