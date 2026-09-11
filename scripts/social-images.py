"""Generates the LinkedIn Page logo and cover into public/brand/social/.

Sizes are LinkedIn's own recommendations, not the 300x300 / 1128x191 numbers
that are all over the web and out of date:

  logo   400 x 400   (268 x 268 minimum)
  cover  1512 x 256
  PNG or JPEG, 3MB ceiling

LinkedIn crops the cover on narrow viewports and shows the logo over both light
and dark surfaces, so the cover keeps its copy inside a generous safe box and
the logo is opaque rather than transparent.

Run once and commit the results, like scripts/og-image.py.
"""

from PIL import Image, ImageDraw

from _brand import INK_50, INK_600, INK_900, ROOT, TEAL_25, WHITE, load_font, render_svg

OUT = ROOT / "public" / "brand" / "social"
OUT.mkdir(parents=True, exist_ok=True)
SS = 3  # supersample; Pillow draws shapes without antialiasing


def save(image, name, **kw):
    path = OUT / name
    image = image.resize((image.width // SS, image.height // SS), Image.LANCZOS)
    if path.suffix == ".jpg":
        image = image.convert("RGB")
    image.save(path, optimize=True, **kw)
    print(f"wrote {path.relative_to(ROOT)} ({path.stat().st_size / 1024:.1f} kB)")


# ------------------------------------------------------------------ logo
# The badge alone, not the wordmark. LinkedIn renders this at roughly 60px in
# the feed, where "Execil" set across 400px would be about 50px wide and
# unreadable. The badge is the same mark as the favicon, so the two agree.
LOGO = 400 * SS
logo = Image.new("RGB", (LOGO, LOGO), WHITE)
mark = render_svg("execil-mark.svg", LOGO)
logo.paste(mark, ((LOGO - mark.width) // 2, (LOGO - mark.height) // 2), mark)
save(logo, "linkedin-logo.png")


# ----------------------------------------------------------------- cover
# 1512 x 256 is close to 6:1, so this is a strip: wordmark and one line of copy
# on the left, the hero photograph fading in on the right.
CW, CH = 1512 * SS, 256 * SS
PAD = 56 * SS
# Left inset for the copy. Wider than PAD because LinkedIn can crop the cover
# horizontally, and the wordmark is the first thing to go.
PAD_L = 112 * SS

cover = Image.new("RGB", (CW, CH), INK_50)
d = ImageDraw.Draw(cover)

# The hero's wash, run left to right rather than top to bottom.
for x in range(CW):
    t = x / CW
    d.line(
        [(x, 0), (x, CH)],
        fill=tuple(round(a + (b - a) * t) for a, b in zip(INK_50, TEAL_25)),
    )

# Photograph on the right, cropped to the strip's height and faded in from the
# left so it dissolves into the wash instead of butting against it.
photo = Image.open(ROOT / "src" / "assets" / "hero" / "hero-1254.webp").convert("RGBA")
strip_w = round(CW * 0.42)
scale = max(strip_w / photo.width, CH / photo.height)
photo = photo.resize((round(photo.width * scale), round(photo.height * scale)), Image.LANCZOS)
# Crop to the strip, keeping the upper part of the frame so the subject's head
# stays in shot, the same reason Image uses anchor="upperRight".
top = round((photo.height - CH) * 0.18)
photo = photo.crop((photo.width - strip_w, top, photo.width, top + CH))

fade = Image.new("L", (strip_w, CH), 255)
fd = ImageDraw.Draw(fade)
run = round(strip_w * 0.55)
for x in range(run):
    fd.line([(x, 0), (x, CH)], fill=round(255 * (x / run)))
photo.putalpha(fade)
cover.paste(photo, (CW - strip_w, 0), photo)

# Wordmark and copy, left, inside a safe box well clear of every edge.
word = render_svg("execil-wordmark-notag.svg", 60 * SS)
cover.paste(word, (PAD_L, PAD), word)

body = load_font(27 * SS, 500)
small = load_font(24 * SS, 400)
y = PAD + word.height + 20 * SS
d.text((PAD_L, y), "Medical billing & RCM for independent practices", font=body, fill=INK_900)
d.text(
    (PAD_L, y + 40 * SS),
    "20+ providers · Inside your existing EHR · Priced upfront",
    font=small,
    fill=INK_600,
)

save(cover, "linkedin-cover.jpg", quality=92)
