"""Import every product from the live PAR3 shop (par3.com.sg) into the prototype.

Reads the shop's public WooCommerce Store API, downloads each product's photos
and size chart, matches photos to colours, and writes assets/js/catalog.js.
Re-run it whenever products change on par3.com.sg:

    pip install pillow
    python3 par3/tools/import_par3.py
"""

import html
import json
import re
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path

from PIL import Image

SHOP = "https://www.par3.com.sg/wp-json/wc/store/v1/products"
ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img" / "shop"
OUT = ROOT / "assets" / "js" / "catalog.js"

SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"]
CATEGORY = {"shirts": "shirts", "par3 customized shirt": "shirts", "shorts": "shorts", "pants": "pants"}
# Colours named in single-colour products ("Plain Dark Grey Golf Short"), longest first.
# Swatch colours for named colours; prints and unnamed colours are read from the photo.
HEX = {
    "Black": "#1E1E22", "White": "#F4F5F7", "Navy Blue": "#1F2A4A", "Sky Blue": "#8CC8EC", "Light Blue": "#A9D6EE",
    "Lake Blue": "#2E7FA6", "Light Green": "#B9DDB5", "Light Grey": "#C9CCD1", "Dark Grey": "#4A4F57", "Grey": "#9A9EA5",
    "Green": "#2E8B57", "Blue": "#2F5FB3", "Red": "#C8202F", "Orange": "#EA6A2F", "Peach": "#F2A68C",
}
NAMED = ["Navy Blue", "Sky Blue", "Light Blue", "Lake Blue", "Light Green", "Light Grey", "Dark Grey", "Black", "White", "Grey", "Green", "Blue", "Red", "Orange", "Peach"]


def get(url):
    # Some photo file names contain non-ASCII characters, so percent-encode the path.
    url = urllib.parse.quote(url, safe=":/?&=%#")
    req = urllib.request.Request(url, headers={"User-Agent": "par3-prototype-import"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def text(fragment):
    return html.unescape(re.sub(r"<[^>]+>", "", fragment)).replace("\xa0", " ").strip()


def title(value):
    """'navy-blue' -> 'Navy Blue', 'black-white' -> 'Black / White'."""
    parts = value.replace("-", " ").split()
    words = " ".join(w.capitalize() for w in parts)
    for combo in ("Black White", "Blue White", "Green White", "Black Grey"):
        words = words.replace(combo, combo.replace(" ", " / "))
    return words


def save_image(url, slug):
    """Download, resize and save as WebP; return (site path, swatch hex)."""
    # Include the upload folder: different photos can share a file name (e.g. Size-chart.png).
    path = url.split("/uploads/")[-1].rsplit(".", 1)[0]
    name = re.sub(r"[^a-z0-9]+", "-", path.lower()).strip("-")
    dest = IMG / f"{slug}--{name}.webp"
    im = Image.open(BytesIO(get(url)))
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        white = Image.new("RGBA", im.size, (255, 255, 255, 255))
        im = Image.alpha_composite(white, im)
    im = im.convert("RGB")
    im.thumbnail((1000, 1000))
    im.save(dest, "WEBP", quality=76)
    return f"assets/img/shop/{dest.name}", swatch(im)


def swatch(im):
    """Typical garment colour: median of the non-white pixels in the middle of the photo."""
    w, h = im.size
    box = im.crop((int(w * 0.3), int(h * 0.3), int(w * 0.7), int(h * 0.7))).resize((60, 60))
    raw = box.tobytes()
    all_px = [tuple(raw[i:i + 3]) for i in range(0, len(raw), 3)]
    px = [p for p in all_px if min(p) < 235] or all_px
    mid = sorted(px, key=sum)[len(px) // 2]
    return "#%02X%02X%02X" % mid


def sizes_of(p):
    shirt = next((a for a in p["attributes"] if "shirt size" in a["name"].lower()), None)
    if shirt:
        have = {t["name"].upper() for t in shirt["terms"]}
        return [s for s in SHIRT_SIZES if s in have]
    waist = next((a for a in p["attributes"] if "waist" in a["name"].lower()), None)
    if waist:
        return sorted((t["name"] for t in waist["terms"]), key=lambda s: int(re.sub(r"\D", "", s) or 0))
    return ["One size"]


def main():
    IMG.mkdir(parents=True, exist_ok=True)
    products = json.loads(get(f"{SHOP}?per_page=100"))
    catalog = []

    def build(p):
        slug = p["slug"]
        colour_attr = next((a for a in p["attributes"] if a["name"].lower() in ("color", "colour")), None)
        fit_attr = next((a for a in p["attributes"] if a["name"].lower() in ("cutting", "fit")), None)
        gallery = [im for im in p["images"]]
        gallery = [im for i, im in enumerate(gallery) if im["src"] not in {g["src"] for g in gallery[:i]}]

        colours = []
        if colour_attr:
            # One variation per colour gives that colour's main photo.
            per_colour = {}
            for v in p["variations"]:
                value = next(a["value"] for a in v["attributes"] if a["name"].lower() in ("color", "colour"))
                if value not in per_colour:
                    per_colour[value] = json.loads(get(f"{SHOP}/{v['id']}"))["images"]
            names = {value: title(value) for value in per_colour}
            for value, images in per_colour.items():
                name = names[value]
                srcs = [im["src"] for im in images]
                # Gallery photos whose file name mentions this colour (and no longer colour name).
                others = [n for n in names.values() if n != name and name.lower() in n.lower()]
                for g in gallery:
                    label = g["name"].lower()
                    if name.lower() in label and not any(o.lower() in label for o in others) and g["src"] not in srcs:
                        srcs.append(g["src"])
                colours.append((name, srcs))
        else:
            name = next((n for n in NAMED if n.lower() in p["name"].lower()), None)
            if not name:
                # A named print, e.g. "Hanabi Golf Short" -> "Hanabi print".
                name = re.sub(r"\s*golf\s+shorts?|\s*golf\s+pants", "", text(p["name"]), flags=re.I).strip() + " print"
            elif "pattern" in p["name"].lower():
                name = f"{name} Pattern"
            colours.append((name, [g["src"] for g in gallery]))

        out_colours = []
        for name, srcs in colours:
            saved = [save_image(s, slug) for s in srcs[:6]]
            if not saved:
                continue
            plain = name.split(" / ")[0]
            hexcode = HEX.get(plain) if "print" not in name.lower() and "pattern" not in name.lower() else None
            out_colours.append({"name": name, "hex": hexcode or saved[0][1], "images": [s for s, _ in saved]})

        charts = [s for s in re.findall(r'src="([^"]+)"', p["description"]) if "size" in s.lower() or "measure" in s.lower() or "picture5" in s.lower()]
        chart = save_image(charts[0], "size-chart")[0] if charts else None

        blurb = [text(x) for x in re.split(r"</p>|<br\s*/?>", p["short_description"]) if text(x)]
        features = [text(li) for li in re.findall(r"<li>(.*?)</li>", p["description"], re.S)]
        if fit_attr and len(fit_attr["terms"]) == 1:
            features.append(fit_attr["terms"][0]["name"])
        category = next((CATEGORY[c["name"].lower()] for c in p["categories"] if c["name"].lower() in CATEGORY), "shirts")
        price = int(p["prices"]["price"]) / 10 ** p["prices"]["currency_minor_unit"]
        regular = int(p["prices"]["regular_price"]) / 10 ** p["prices"]["currency_minor_unit"]
        return {
            "id": slug,
            "name": text(p["name"]).replace(" (NEW)", ""),
            "isNew": "(NEW)" in p["name"],
            "category": category,
            "price": price,
            "was": regular if regular > price else None,
            "summary": blurb,
            "features": features,
            "sizes": sizes_of(p),
            # A choice only when there is more than one fit; a single fit is listed as a feature.
            "fits": [t["name"] for t in fit_attr["terms"]] if fit_attr and len(fit_attr["terms"]) > 1 else None,
            "sizeChart": chart,
            "colors": out_colours,
            "source": p["permalink"],
        }

    with ThreadPoolExecutor(6) as ex:
        catalog = list(ex.map(build, products))

    OUT.write_text(
        "// Generated by tools/import_par3.py from par3.com.sg. Don't edit by hand:\n"
        "// re-run the script instead. Prices are in SGD.\n\n"
        f"const CATALOG = {json.dumps(catalog, indent=2, ensure_ascii=False)};\n"
    )
    print(f"{len(catalog)} products, {sum(len(c['images']) for p in catalog for c in p['colors'])} photos -> {OUT}")


if __name__ == "__main__":
    main()
