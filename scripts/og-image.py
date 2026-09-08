"""Generates public/og.png (1200x630) and public/logo.png from the design tokens.

Two different pictures for two different jobs. og.png is the social card: the
headline, on the hero's wash. logo.png is what Organization.logo points at, and
Google reads that one for the knowledge panel -- it wants the logo itself, on a
white ground, 112px minimum in both axes.

Static assets, not a build step: run once and commit the results. A build-time
generator would be two dependencies and a headless font pipeline to produce two
files that rarely change. See issue #30.
"""

from PIL import Image, ImageDraw, ImageFont
import io, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
INK_900 = (15, 27, 45)
INK_600 = (75, 90, 104)
TEAL_600 = (14, 138, 138)
TEAL_700 = (10, 107, 107)
GREEN_600 = (46, 158, 91)
INK_50 = (247, 249, 250)
TEAL_25 = (238, 246, 246)
WHITE = (255, 255, 255)

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

# The wordmark, in font units at upem 1000, taken from the same geometry that
# produced public/brand/cross-dot/. Pen positions are listed rather than laid
# out: this Pillow has no Raqm, so its own text layout drops the kerning and
# would set "Execil" 25 units wide and land the badge 78 units late.
WORDMARK = [("E", 0), ("x", 550), ("e", 1073), ("c", 1648), ("i", 2217), ("l", 2487)]
WORDMARK_ADVANCE = 2810
CAP_TOP = 740
BADGE_CX, BADGE_CY, BADGE_R = 2403.5, 665.5, 141.75
NOTCH = 1.20        # knockout ring, as a multiple of the badge radius
CROSS_LEN = 0.36    # half-length of a cross bar, as a multiple of the radius
CROSS_BAR = 0.1225  # half-thickness, likewise
CROSS_R = 0.045

# Tallest point above the baseline: the badge clears the cap height.
WORDMARK_TOP = max(CAP_TOP, BADGE_CY + BADGE_R * NOTCH)


def draw_wordmark(image, draw, x0, baseline, size):
    """Draws the wordmark with its baseline at `baseline` and pen start at `x0`.

    The badge is painted over the "i" rather than the tittle being removed: it
    is larger than the tittle, and the knockout ring larger still, so the dot
    disappears underneath. The ring is filled with whatever the canvas already
    holds at that point, which is how it works on the gradient and on white
    without being told which it is on.
    """
    k = size / 1000
    cx = x0 + BADGE_CX * k
    cy = baseline - BADGE_CY * k
    r = BADGE_R * k
    ring = r * NOTCH
    # Sampled before a single letter is drawn: the badge sits on the tittle, so
    # after the text this point is ink and the ring would come out black.
    ground = image.getpixel((round(cx), round(cy)))

    face = load(ttf, size, 900)
    for char, pen in WORDMARK:
        draw.text((x0 + pen * k, baseline), char, font=face, fill=INK_900, anchor="ls")

    draw.ellipse([cx - ring, cy - ring, cx + ring, cy + ring], fill=ground)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=TEAL_700)

    half, thick, radius = r * CROSS_LEN, r * CROSS_BAR, r * CROSS_R
    draw.rounded_rectangle(
        [cx - half, cy - thick, cx + half, cy + thick], radius=radius, fill=WHITE
    )
    draw.rounded_rectangle(
        [cx - thick, cy - half, cx + thick, cy + half], radius=radius, fill=WHITE
    )

PAD = 88

# Brand lockup. Sized so the badge-to-baseline height matches the 56px mark it
# replaces, which is what the rest of the card was spaced against.
LOCKUP = 64
draw_wordmark(img, d, PAD, PAD + WORDMARK_TOP * LOCKUP / 1000, LOCKUP)

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
d.text((PAD, 518), "35-40 providers · Inside your existing EHR · Priced upfront", font=body, fill=INK_600)

def save(image, name):
    path = ROOT / "public" / name
    image.save(path, "PNG", optimize=True)
    print(f"wrote {path} ({path.stat().st_size / 1024:.1f} kB)")


save(img, "og.png")

# ---------------------------------------------------------------- logo.png
# The wordmark alone on white, sized so it fills a 1024px-wide card. Google
# crops and scales this itself, so the only jobs here are enough resolution and
# a white ground, which is the ground it composites onto anyway.
LOGO_W, LOGO_PAD = 1024, 72
logo_size = round((LOGO_W - 2 * LOGO_PAD) / WORDMARK_ADVANCE * 1000)
logo_baseline = LOGO_PAD + WORDMARK_TOP * logo_size / 1000
logo_h = round(logo_baseline + LOGO_PAD)

logo = Image.new("RGB", (LOGO_W, logo_h), WHITE)
draw_wordmark(logo, ImageDraw.Draw(logo), LOGO_PAD, logo_baseline, logo_size)
save(logo, "logo.png")
