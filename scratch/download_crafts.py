import urllib.request
import os

os.makedirs('public/crafts', exist_ok=True)

urls = [
  ('chanderi_weaving.jpg', 'https://images.unsplash.com/photo-1544441893-675973e31985?w=1200&q=80'),
  ('banarasi_zari.jpg', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&q=80'),
  ('tussar_silk.jpg', 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=1200&q=80'),
  ('zardozi_embroidery.jpg', 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=1200&q=80'),
  ('kantha_stitching.jpg', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1200&q=80'),
  ('gotapatti_work.jpg', 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=1200&q=80'),
  ('block_printing.jpg', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=80'),
]

headers = {'User-Agent': 'Mozilla/5.0'}
for filename, url in urls:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(f'public/crafts/{filename}', 'wb') as f:
            f.write(resp.read())
        print(f"Saved {filename}: {os.path.getsize(f'public/crafts/{filename}')} bytes")
    except Exception as e:
        print(f"Error {filename}: {e}")
