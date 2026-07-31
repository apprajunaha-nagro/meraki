import os
from PIL import Image, ImageEnhance

public_dir = 'public'
hero_files = [f for f in os.listdir(public_dir) if f.startswith('hero-slide-') and f.endswith('.png')]

print(f"Softening hero banner files: {hero_files}")

for filename in hero_files:
    filepath = os.path.join(public_dir, filename)
    try:
        img = Image.open(filepath).convert('RGB')
        w, h = img.size
        
        # Smooth resolution (4096px wide) with high-quality smooth Lanczos resampling (NO unsharp mask)
        target_w = 4096
        target_h = int(target_w * (h / w))
        
        img_scaled = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # Balanced, soft, natural contrast and saturation
        enhancer_contrast = ImageEnhance.Contrast(img_scaled)
        img_soft = enhancer_contrast.enhance(1.03) # Subtle soft contrast
        
        enhancer_color = ImageEnhance.Color(img_soft)
        img_soft = enhancer_color.enhance(1.03) # Natural rich tone
        
        enhancer_bright = ImageEnhance.Brightness(img_soft)
        img_soft = enhancer_bright.enhance(1.02) # Gentle lighting
        
        img_soft.save(filepath, 'PNG', optimize=True)
        print(f"Successfully smoothed and softened {filename} to {target_w}x{target_h}")
    except Exception as e:
        print(f"Error processing {filename}: {e}")
