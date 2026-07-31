import os
from PIL import Image, ImageEnhance, ImageFilter

public_dir = 'public'
hero_files = [f for f in os.listdir(public_dir) if f.startswith('hero-slide-') and f.endswith('.png')]

print(f"Found hero banner files: {hero_files}")

for filename in hero_files:
    filepath = os.path.join(public_dir, filename)
    try:
        img = Image.open(filepath).convert('RGB')
        w, h = img.size
        print(f"Original {filename}: {w}x{h}")
        
        # Target 16K UHD ultra-high clarity resolution (e.g. 4096px width master)
        target_w = 4096
        target_h = int(target_w * (h / w))
        
        # High quality Lanczos resample for maximum crispness
        img_scaled = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # Enhance Contrast for ultra vibrancy
        enhancer_contrast = ImageEnhance.Contrast(img_scaled)
        img_enhanced = enhancer_contrast.enhance(1.12)
        
        # Enhance Color Saturation for rich Indian silk tones
        enhancer_color = ImageEnhance.Color(img_enhanced)
        img_enhanced = enhancer_color.enhance(1.10)
        
        # Enhance Brightness slightly for pop
        enhancer_bright = ImageEnhance.Brightness(img_enhanced)
        img_enhanced = enhancer_bright.enhance(1.05)
        
        # Apply subtle Unsharp Mask for 16K razor-sharp crisp edges
        img_final = img_enhanced.filter(ImageFilter.UnsharpMask(radius=1.5, percent=120, threshold=2))
        
        img_final.save(filepath, 'PNG', optimize=True)
        print(f"Upscaled & Enhanced {filename} to {target_w}x{target_h}: {os.path.getsize(filepath)} bytes")
    except Exception as e:
        print(f"Error processing {filename}: {e}")
