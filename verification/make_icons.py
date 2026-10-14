"""Render original geometric app marks (no Mobile Legends or Moonton assets)."""
from PIL import Image, ImageDraw
from pathlib import Path
ASSETS = Path(__file__).resolve().parents[1] / 'packages/mobile/assets'
image = Image.new('RGBA', (1024, 1024), '#090F1D')
draw = ImageDraw.Draw(image)
draw.rounded_rectangle((138, 138, 886, 886), radius=160, fill='#111C2E', outline='#26364D', width=8)
shield = [(512, 263), (711, 340), (695, 557), (635, 673), (512, 761), (389, 673), (329, 557), (313, 340), (512, 263)]
draw.line(shield, fill='#F2C75C', width=20, joint='curve')
draw.line([(416, 504), (485, 572), (616, 424)], fill='#F2C75C', width=24, joint='curve')
image.save(ASSETS / 'icon.png')
image.save(ASSETS / 'splash-icon.png')
image.resize((64, 64), Image.Resampling.LANCZOS).save(ASSETS / 'favicon.png')
print('Rendered icon, splash and favicon')