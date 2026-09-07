"""Generates public/og.png at 1200x630 using the design tokens.

Static asset, not a build step: run once and commit the result. A build-time
generator would be two dependencies and a headless font pipeline to produce one
file that never changes. See issue #30.
"""

from PIL import Image, ImageDraw, ImageFont
import io, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
INK_900 = (15, 27, 45)
INK_600 = (75, 90, 104)
TEAL_600 = (14, 138, 138)
TEAL_700 = (10, 107, 107)
GREEN_600 = (46, 158, 91)
GREEN_200 = (159, 212, 163)
INK_50 = (247, 249, 250)
TEAL_25 = (238, 246, 246)

W, H = 1200, 630
img = Image.new("RGB", (W, H), INK_50)
d = ImageDraw.Draw(img)

# Vertical wash: surfacePage -> surfaceAccentSoft, matching the hero.
for y in range(H):
    t = y / H
    d.line([(0, y), (W, y)], fill=tuple(
        round(a + (b - a) * t) for a, b in zip(INK_50, TEAL_25)
    ))

# Satoshi ships as a variable WOFF2; Pillow cannot read WOFF2, so the variable
# TTF from the same kit is used for rendering only. Nothing is subsetted or
# re-encoded, and no converted file is shipped -- the site still serves the
# untouched WOFF2.
def load(path, size, weight=None):
    f = ImageFont.truetype(str(path), size)
    if weight is not None:
        try:
            f.set_variation_by_axes([weight])
        except Exception:
            pass
    return f

ttf = ROOT / "scripts" / ".og-font" / "Satoshi-Variable.ttf"
bold = load(ttf, 76, 800)
body = load(ttf, 30, 400)
mark = load(ttf, 34, 800)

PAD = 88

# Brand lockup
d.rounded_rectangle([PAD, PAD, PAD + 56, PAD + 56], radius=15, fill=TEAL_700)
d.rounded_rectangle([PAD + 20, PAD + 20, PAD + 36, PAD + 36], radius=5, fill=GREEN_200)
d.text((PAD + 74, PAD + 12), "Execil", font=mark, fill=INK_900)

# Headline, with the same two emphases as the hero. Broken into three lines so
# it fits the 1200px canvas; the size is reduced until the widest line clears
# the padding, so a copy change cannot silently overflow.
LINES = [
    [("Collect Every Dollar", INK_900)],
    [("You've ", INK_900), ("Earned", TEAL_600), (".", INK_900)],
    [("Cut Denials ", INK_900), ("Before They Happen", GREEN_600), (".", INK_900)],
]

size = 76
while size > 30:
    bold = load(ttf, size, 800)
    widest = max(
        sum(d.textlength(part, font=bold) for part, _ in line) for line in LINES
    )
    if widest <= W - 2 * PAD:
        break
    size -= 2
else:
    raise SystemExit("headline will not fit at any reasonable size")

y = 214
for line in LINES:
    x = PAD
    for part, colour in line:
        d.text((x, y), part, font=bold, fill=colour)
        x += d.textlength(part, font=bold)
    y += round(size * 1.18)

d.text((PAD, 476), "Medical billing & RCM for independent practices", font=body, fill=INK_600)
d.text((PAD, 518), "1-20 providers · Inside your existing EHR · Priced upfront", font=body, fill=INK_600)

out = ROOT / "public" / "og.png"
img.save(out, "PNG", optimize=True)
print(f"wrote {out} ({out.stat().st_size / 1024:.1f} kB)")
