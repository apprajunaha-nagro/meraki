import re
import os

with open('src/lib/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all image paths in mockData.ts
image_paths = re.findall(r'["\'](/[^"\']+\.(?:jpg|jpeg|png|webp|svg))["\']', content)

unique_images = sorted(list(set(image_paths)))
print(f"Total unique image paths referenced in mockData.ts: {len(unique_images)}")

missing = []
found = 0

for img in unique_images:
    rel_path = img.lstrip('/')
    full_path = os.path.join('public', rel_path)
    if os.path.exists(full_path):
        found += 1
    else:
        missing.append(img)

print(f"Found in public/: {found}/{len(unique_images)}")
if missing:
    print(f"MISSING FILES ({len(missing)}):")
    for m in missing:
        print(f"  - {m}")
else:
    print("SUCCESS: 100% of all image files exist locally in public/!")
