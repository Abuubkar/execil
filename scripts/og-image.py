"""Generates public/og.png (1200x630) and public/logo.png from the design tokens.

Two different pictures for two different jobs. og.png is the social card: the
headline, on the hero's wash. logo.png is what Organization.logo points at, and
Google reads that one for the knowledge panel -- it wants the logo itself, on a
white ground, 112px minimum in both axes.

The wordmark is rasterised from public/brand/cross-dot/ rather than redrawn
here. Reimplementing it in Pillow drifted from the real artwork three times:
Pillow has no Raqm so its layout dropped the kerning, the knockout ring
sampled its colour after the letters were drawn, and the ring ended up
biting the "l". One drawing, one source.

Static assets, not a build step: run once and commit the results. A build-time
generator would be two dependencies and a headless font pipeline to produce two
files that rarely change. See issue #30.
"""

from PIL import Image, ImageDraw, ImageFont
import io, pathlib, shutil, subprocess, tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
INK_900 = (15, 27, 45)
INK_600 = (75, 90, 104)
TEAL_600 = (14, 138, 138)
TEAL_700 = (10, 107, 107)
GREEN_600 = (46, 158, 91)
INK_50 = (247, 249, 250)
TEAL_25 = (238, 246, 246)
WHITE = (255, 255, 255)

SS = 3  # supersample; PIL draws shapes without antialiasing
W, H = 1200 * SS, 630 * SS
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
bold = load(ttf, 76 * SS, 800)
body = load(ttf, 30 * SS, 400)

BRAND = ROOT / "public" / "brand" / "cross-dot"

CHROME = next(
    (
        c
        for c in (
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            shutil.which("google-chrome"),
            shutil.which("chromium"),
        )
        if c and pathlib.Path(c).exists()
    ),
    None,
)


def render_svg(name, height):
    """The wordmark as a transparent RGBA image, cropped to its ink."""
    if CHROME is None:
        raise SystemExit("headless Chrome is required to rasterise " + name)
    src = BRAND / name
    with tempfile.TemporaryDirectory() as tmp:
        page = pathlib.Path(tmp) / "page.html"
        shot = pathlib.Path(tmp) / "shot.png"
        page.write_text(
            f'<body style="margin:0">'
            f'<img src="file://{src}" style="height:{height}px;display:block">'
            f"</body>"
        )
        subprocess.run(
            [
                CHROME,
                "--headless=new",
                "--disable-gpu",
                "--hide-scrollbars",
                "--allow-file-access-from-files",
                "--force-device-scale-factor=1",
                "--default-background-color=00000000",
                f"--window-size={height * 8},{height * 3}",
                "--virtual-time-budget=8000",
                f"--screenshot={shot}",
                f"file://{page}",
            ],
            check=True,
            capture_output=True,
        )
        im = Image.open(shot).convert("RGBA")
        box = im.getbbox()
        if box is None:
            raise SystemExit("rasterising " + name + " produced an empty image")
        return im.crop(box)


PAD = 88 * SS

# Brand lockup, at the height the rest of the card was spaced against.
LOCKUP_H = 54 * SS
lockup = render_svg("execil-wordmark-notag.svg", LOCKUP_H)
img.paste(lockup, (PAD, PAD), lockup)

# Headline, with the same two emphases as the hero. Broken into three lines so
# it fits the 1200px canvas; the size is reduced until the widest line clears
# the padding, so a copy change cannot silently overflow.
LINES = [
    [("Collect Every Dollar", INK_900)],
    [("You've ", INK_900), ("Earned", TEAL_600), (".", INK_900)],
    [("Cut Denials ", INK_900), ("Before They Happen", GREEN_600), (".", INK_900)],
]

size = 76 * SS
while size > 30 * SS:
    bold = load(ttf, size, 800)
    widest = max(
        sum(d.textlength(part, font=bold) for part, _ in line) for line in LINES
    )
    if widest <= W - 2 * PAD:
        break
    size -= 2 * SS
else:
    raise SystemExit("headline will not fit at any reasonable size")

y = 214 * SS
for line in LINES:
    x = PAD
    for part, colour in line:
        d.text((x, y), part, font=bold, fill=colour)
        x += d.textlength(part, font=bold)
    y += round(size * 1.18)

d.text((PAD, 476 * SS), "Medical billing & RCM for independent practices", font=body, fill=INK_600)
d.text((PAD, 518 * SS), "20+ providers · Inside your existing EHR · Priced upfront", font=body, fill=INK_600)

def save(image, name):
    path = ROOT / "public" / name
    image = image.resize((image.width // SS, image.height // SS), Image.LANCZOS)
    image.save(path, "PNG", optimize=True)
    print(f"wrote {path} ({path.stat().st_size / 1024:.1f} kB)")


save(img, "og.png")

# ---------------------------------------------------------------- logo.png
# The wordmark alone on white, sized so it fills a 1024px-wide card. Google
# crops and scales this itself, so the only jobs here are enough resolution and
# a white ground, which is the ground it composites onto anyway.
LOGO_W, LOGO_PAD = 1024 * SS, 72 * SS
mark = render_svg("execil-wordmark-notag.svg", 900)  # generous, then scaled to width
scale = (LOGO_W - 2 * LOGO_PAD) / mark.width
mark = mark.resize((round(mark.width * scale), round(mark.height * scale)), Image.LANCZOS)

logo = Image.new("RGB", (LOGO_W, mark.height + 2 * LOGO_PAD), WHITE)
logo.paste(mark, (LOGO_PAD, LOGO_PAD), mark)
save(logo, "logo.png")
