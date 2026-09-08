"""Shared by the brand-asset generators: rasterise a committed SVG.

Both generators composite the same wordmark, and redrawing it in Pillow drifted
from the real artwork three times. There is one drawing, in
public/brand/cross-dot/, and everything else renders that.
"""

import pathlib
import shutil
import subprocess
import tempfile

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
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

INK_900 = (15, 27, 45)
INK_600 = (75, 90, 104)
INK_50 = (247, 249, 250)
TEAL_700 = (10, 107, 107)
TEAL_600 = (14, 138, 138)
TEAL_25 = (238, 246, 246)
GREEN_600 = (46, 158, 91)
WHITE = (255, 255, 255)


def render_svg(name, height):
    """A committed SVG as a transparent RGBA image, cropped to its ink."""
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


def load_font(size, weight=None):
    """Satoshi at a weight. Pillow cannot read WOFF2, so the variable TTF from
    the same kit is used for rendering only; nothing converted is shipped."""
    from PIL import ImageFont

    face = ImageFont.truetype(str(ROOT / "scripts" / ".og-font" / "Satoshi-Variable.ttf"), size)
    if weight is not None:
        try:
            face.set_variation_by_axes([weight])
        except Exception:
            pass
    return face
