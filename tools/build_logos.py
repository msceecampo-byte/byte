"""Generate the Fairway Society logo system as font-independent SVGs.

Every letter is converted to an outline path, so the files render identically
on any machine, in any browser, and at any embroidery/print vendor.

    pip install fonttools uharfbuzz
    python tools/build_logos.py
"""

import math
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.boundsPen import ControlBoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "tools" / "fonts"
OUT = ROOT / "brand"

FOREST = "#1F3A2B"
CREAM = "#F7F1E8"
BLUSH = "#F2D4D7"
ROSE = "#C98A94"
CLARET = "#7A2837"
SAGE = "#7E9A78"


BOUNDS = []  # every outlined glyph box since the last reset, for tight viewBoxes


def fit(pad):
    """Return (x, y, w, h) enclosing everything outlined since the last call."""
    x0 = min(b[0] for b in BOUNDS) - pad
    y0 = min(b[1] for b in BOUNDS) - pad
    x1 = max(b[2] for b in BOUNDS) + pad
    y1 = max(b[3] for b in BOUNDS) + pad
    BOUNDS.clear()
    return x0, y0, x1 - x0, y1 - y0


class Face:
    def __init__(self, filename):
        path = FONTS / filename
        self.tt = TTFont(path)
        self.glyphs = self.tt.getGlyphSet()
        self.order = self.tt.getGlyphOrder()
        self.upem = self.tt["head"].unitsPerEm
        blob = hb.Blob.from_file_path(str(path))
        self.hb_font = hb.Font(hb.Face(blob))

    def shape(self, text):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(self.hb_font, buf, {"kern": True, "liga": True})
        return list(zip(buf.glyph_infos, buf.glyph_positions))

    def glyph_path(self, gid, transform):
        glyph = self.glyphs[self.order[gid]]
        pen = SVGPathPen(self.glyphs, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
        glyph.draw(TransformPen(pen, transform))
        bounds = ControlBoundsPen(self.glyphs)
        glyph.draw(TransformPen(bounds, transform))
        if bounds.bounds:
            BOUNDS.append(bounds.bounds)
        return pen.getCommands()

    def measure(self, text, size, tracking=0.0):
        scale = size / self.upem
        shaped = self.shape(text)
        return sum(p.x_advance * scale for _, p in shaped) + tracking * size * (len(shaped) - 1)

    def text(self, text, size, x, y, anchor="middle", tracking=0.0):
        """Outline `text` with its baseline at y. tracking is in em."""
        scale = size / self.upem
        width = self.measure(text, size, tracking)
        cx = {"start": x, "middle": x - width / 2, "end": x - width}[anchor]
        parts = []
        for info, pos in self.shape(text):
            gx = cx + pos.x_offset * scale
            gy = y - pos.y_offset * scale
            parts.append(self.glyph_path(info.codepoint, (scale, 0, 0, -scale, gx, gy)))
            cx += pos.x_advance * scale + tracking * size
        return " ".join(p for p in parts if p)

    def arc_text(self, text, size, cx, cy, r, center_deg, tracking=0.0, outside=True):
        """Set text around a circle. center_deg: 0 = top, 180 = bottom.

        outside=True reads clockwise along the top; False reads
        counter-clockwise along the bottom so the letters stay upright.
        """
        scale = size / self.upem
        shaped = self.shape(text)
        adv = [p.x_advance * scale + tracking * size for _, p in shaped]
        total = sum(adv) - tracking * size
        # Baseline radius: top text sits on r, bottom text hangs from r.
        span = total / r
        direction = 1 if outside else -1
        start = math.radians(center_deg) - direction * span / 2
        parts = []
        dist = 0.0
        for (info, _), a in zip(shaped, adv):
            mid = start + direction * (dist + a / 2 - tracking * size / 2) / r
            px = cx + r * math.sin(mid)
            py = cy - r * math.cos(mid)
            rot = mid if outside else mid + math.pi
            c, s = math.cos(rot), math.sin(rot)
            half = (a - tracking * size) / 2
            # glyph space -> rotate -> translate so the glyph's centre sits on the arc
            ox = -half
            oy = 0 if outside else size * 0.72
            t = (scale * c, scale * s, scale * s, -scale * c,
                 px + c * ox - s * oy, py + s * ox + c * oy)
            parts.append(self.glyph_path(info.codepoint, t))
            dist += a
        return " ".join(p for p in parts if p)


script = Face("GreatVibes-Regular.ttf")
serif = Face("PlayfairDisplay-SemiBold.ttf")
serif_med = Face("PlayfairDisplay-Medium.ttf")
sans = Face("Montserrat-Medium.ttf")


def svg(box, body, title, bg=None):
    x, y, w, h = (round(v, 1) for v in box)
    rect = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x} {y} {w} {h}" '
        f'width="{w}" height="{h}" role="img" aria-label="{title}">'
        f"<title>{title}</title>{rect}{body}</svg>\n"
    )


def write(name, content):
    (OUT / name).write_text(content)
    print("wrote", name)


# ---------------------------------------------------------------- wordmark
def wordmark(color, tagline=True):
    cx = 450
    body = f'<path fill="{color}" d="{script.text("Fairway Society", 150, cx, 150)}"/>'
    if tagline:
        line = "GOLF · LEISURE · CONNECTION"
        size, track, base = 19, 0.32, 222
        half = sans.measure(line, size, track) / 2
        gap, rule = 22, 110
        body += (
            f'<g fill="{color}">'
            f'<rect x="{cx - half - gap - rule}" y="{base - 7.5}" width="{rule}" height="1.6"/>'
            f'<rect x="{cx + half + gap}" y="{base - 7.5}" width="{rule}" height="1.6"/>'
            f'<path d="{sans.text(line, size, cx, base, tracking=track)}"/>'
            f"</g>"
        )
    return svg(fit(24), body, "Fairway Society")


# ---------------------------------------------------------------- stacked
def stacked(color):
    w = 640
    body = (
        f'<g fill="{color}">'
        f'<path d="{script.text("Fairway", 170, w / 2 - 40, 200)}"/>'
        f'<path d="{script.text("Society", 170, w / 2 + 40, 350)}"/>'
        f'<path d="{sans.text("EST. 2026", 17, w / 2, 430, tracking=0.45)}"/>'
        f"</g>"
    )
    return svg(fit(24), body, "Fairway Society")


# ---------------------------------------------------------------- monogram
def monogram_group(color, size, cx, cy, uid):
    """Interlocked serif F and S. The S passes over the F with a clean gap."""
    f_d = serif.text("F", size, cx - size * 0.16, cy + size * 0.30)
    s_d = serif.text("S", size * 0.86, cx + size * 0.17, cy + size * 0.42)
    gap = size * 0.045
    return (
        f'<defs><mask id="gap{uid}" maskUnits="userSpaceOnUse">'
        f'<rect x="{cx - size}" y="{cy - size}" width="{size * 2}" height="{size * 2}" fill="#fff"/>'
        f'<path d="{s_d}" fill="#000" stroke="#000" stroke-width="{gap * 2}" stroke-linejoin="round"/>'
        f"</mask></defs>"
        f'<path d="{f_d}" fill="{color}" mask="url(#gap{uid})"/>'
        f'<path d="{s_d}" fill="{color}"/>'
    )


def monogram(color, bg=None):
    body = monogram_group(color, 300, 200, 200, "m")
    return svg(fit(30), body, "FS monogram", bg)


def favicon(fg, bg):
    body = f'<circle cx="32" cy="32" r="32" fill="{bg}"/>' + monogram_group(fg, 46, 32, 31, "f")
    BOUNDS.clear()
    return svg((0, 0, 64, 64), body, "Fairway Society")


# ---------------------------------------------------------------- badge
def badge(color, bg=None):
    cx = cy = 300
    body = f'<g fill="{color}">'
    body += (
        f'<circle cx="{cx}" cy="{cy}" r="286" fill="none" stroke="{color}" stroke-width="5"/>'
        f'<circle cx="{cx}" cy="{cy}" r="272" fill="none" stroke="{color}" stroke-width="1.6"/>'
        f'<circle cx="{cx}" cy="{cy}" r="172" fill="none" stroke="{color}" stroke-width="1.6"/>'
    )
    body += f'<path d="{serif_med.arc_text("FAIRWAY SOCIETY", 44, cx, cy, 206, 0, tracking=0.16)}"/>'
    body += f'<path d="{sans.arc_text("FOR THE LOVE OF THE FAIRWAY", 22, cx, cy, 222, 180, tracking=0.28, outside=False)}"/>'
    for deg in (90, 270):
        rad = math.radians(deg)
        body += f'<circle cx="{cx + 222 * math.sin(rad):.2f}" cy="{cy - 222 * math.cos(rad):.2f}" r="5"/>'
    body += "</g>"
    body += monogram_group(color, 200, cx, cy - 8, "b")
    body += f'<path fill="{color}" d="{sans.text("EST · 2026", 15, cx, cy + 112, tracking=0.4)}"/>'
    BOUNDS.clear()
    return svg((0, 0, 600, 600), body, "Fairway Society badge", bg)


OUT.mkdir(exist_ok=True)
write("wordmark-forest.svg", wordmark(FOREST))
write("wordmark-cream.svg", wordmark(CREAM))
write("wordmark-simple-forest.svg", wordmark(FOREST, tagline=False))
write("wordmark-simple-cream.svg", wordmark(CREAM, tagline=False))
write("stacked-forest.svg", stacked(FOREST))
write("stacked-claret.svg", stacked(CLARET))
write("monogram-forest.svg", monogram(FOREST))
write("monogram-cream.svg", monogram(CREAM))
write("monogram-claret.svg", monogram(CLARET))
write("badge-forest.svg", badge(FOREST))
write("badge-cream.svg", badge(CREAM))
write("favicon.svg", favicon(CREAM, FOREST))
