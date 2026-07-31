import re

with open('src/lib/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all product names and images
pattern = r'id:\s*(\d+),\s*name:\s*"([^"]+)",\s*slug:\s*"([^"]+)".*?image_url:\s*"([^"]+)"'
matches = re.findall(pattern, content, re.DOTALL)

print(f"Total product matches: {len(matches)}")
lehenga_matches = [m for m in matches if 'lehenga' in m[2] or 'lehenga' in m[1].lower() or 'lehenga' in m[3].lower()]
for m in lehenga_matches:
    print(m)
