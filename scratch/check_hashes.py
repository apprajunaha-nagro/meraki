import hashlib
import glob
import os

files = glob.glob('public/lehenga-*.jpg')
hashes = {}

for f in sorted(files):
    with open(f, 'rb') as fp:
        h = hashlib.md5(fp.read()).hexdigest()
        size = os.path.getsize(f)
        print(f"{f}: size={size}, md5={h}")
        if h in hashes:
            print(f"  >>> DUPLICATE OF {hashes[h]} !")
        else:
            hashes[h] = f
