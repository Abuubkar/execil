"""Generates the social profile assets into public/brand/social/.

LinkedIn publishes its sizes; these are LinkedIn's own numbers, not the
300x300 / 1128x191 ones that are all over the web and out of date:

  logo   400 x 400   (268 x 268 minimum)
  cover  1512 x 256
  PNG or JPEG, 3MB ceiling

Google does NOT publish logo or cover dimensions for a Business Profile. Its
help pages give one spec for every photo — 720x720 recommended, 250x250
minimum, JPG or PNG, between 10 KB and 5 MB. So the logo is square at the
recommended size and the cover uses the 16:9 the profile header crops to,
both well clear of the minimum:

  logo   720 x 720
  cover  1024 x 576
  square 720 x 720   (a photo for the gallery)

Every profile crops its cover differently and Google re-crops on each surface,
so the covers keep their copy inside a generous safe box. Logos are opaque
rather than transparent, because both products show them over light and dark.

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


# ------------------------------------------------------- Google Business
# Same badge as the favicon and the LinkedIn logo. It fills the frame rather
# than sitting inset: Google circle-crops the logo on several surfaces, and an
# inset mark would end up floating inside a white ring at thumbnail size. Filled
# edge to edge, the crop lands on the badge itself.
GLOGO = 720 * SS
glogo = Image.new("RGB", (GLOGO, GLOGO), WHITE)
gmark = render_svg("execil-mark.svg", GLOGO)
glogo.paste(gmark, ((GLOGO - gmark.width) // 2, (GLOGO - gmark.height) // 2), gmark)
save(glogo, "gbp-logo.png")


def wash(width, height):
    """The hero's wash, corner to corner."""
    img = Image.new("RGB", (width, height), INK_50)
    draw = ImageDraw.Draw(img)
    for x in range(width):
        t = x / width
        draw.line(
            [(x, 0), (x, height)],
            fill=tuple(round(a + (b - a) * t) for a, b in zip(INK_50, TEAL_25)),
        )
    return img


def hero_crop(width, height, focus=0.18):
    """The hero photograph, filled to a box and cropped from the right."""
    img = Image.open(ROOT / "src" / "assets" / "hero" / "hero-1254.webp").convert("RGBA")
    scale = max(width / img.width, height / img.height)
    img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    top = round((img.height - height) * focus)
    return img.crop((img.width - width, top, img.width, top + height))


# 1024 x 576. Google crops the header hard on mobile, so the wordmark and one
# line sit left of centre with the photograph fading in on the right.
BW, BH = 1024 * SS, 576 * SS
BPAD = 64 * SS

bcover = wash(BW, BH)
bd = ImageDraw.Draw(bcover)

bphoto_w = round(BW * 0.46)
bphoto = hero_crop(bphoto_w, BH)
bfade = Image.new("L", (bphoto_w, BH), 255)
bfd = ImageDraw.Draw(bfade)
brun = round(bphoto_w * 0.6)
for x in range(brun):
    bfd.line([(x, 0), (x, BH)], fill=round(255 * (x / brun)))
bphoto.putalpha(bfade)
bcover.paste(bphoto, (BW - bphoto_w, 0), bphoto)

bword = render_svg("execil-wordmark-notag.svg", 86 * SS)
bcover.paste(bword, (BPAD, round(BH * 0.34)), bword)

bbody = load_font(34 * SS, 500)
bsmall = load_font(28 * SS, 400)
by = round(BH * 0.34) + bword.height + 28 * SS
bd.text((BPAD, by), "Medical billing & RCM", font=bbody, fill=INK_900)
bd.text((BPAD, by + 46 * SS), "for independent practices", font=bbody, fill=INK_900)
bd.text(
    (BPAD, by + 104 * SS),
    "20+ providers \u00b7 Inside your existing EHR",
    font=bsmall,
    fill=INK_600,
)

save(bcover, "gbp-cover.jpg", quality=92)


# A square for the photo gallery. Google shows these in a grid and crops to
# square, so the photograph carries it and the wordmark sits along the bottom.
SQ = 720 * SS
square = hero_crop(SQ, SQ, focus=0.10).convert("RGB")
sd = ImageDraw.Draw(square, "RGBA")
sd.rectangle([(0, round(SQ * 0.72)), (SQ, SQ)], fill=(15, 27, 45, 190))
sword = render_svg("execil-wordmark-reversed.svg", 54 * SS)
square.paste(sword, ((SQ - sword.width) // 2, round(SQ * 0.80)), sword)
save(square, "gbp-square.jpg", quality=92)
