import os
from PIL import Image, ImageDraw, ImageFont

def generate_og_image():
    W, H = 1200, 630
    img = Image.new("RGBA", (W, H), (13, 17, 23, 255))
    draw = ImageDraw.Draw(img)

    # Gradient background
    for y in range(H):
        r = int(13 + (22 - 13) * (y / H))
        g = int(17 + (27 - 17) * (y / H))
        b = int(23 + (34 - 23) * (y / H))
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # Decorative subtle glow circles
    draw.ellipse([800, -100, 1300, 400], fill=(31, 111, 235, 25))
    draw.ellipse([-100, 300, 400, 800], fill=(88, 166, 255, 18))

    # Border
    draw.rectangle([10, 10, W - 10, H - 10], outline=(48, 54, 61, 255), width=2)

    # Icon
    icon_path = os.path.join("assets", "icon-512.png")
    if os.path.exists(icon_path):
        icon = Image.open(icon_path).convert("RGBA")
        icon = icon.resize((180, 180), Image.Resampling.LANCZOS)
        # Rounded corners or paste
        img.paste(icon, (80, (H - 180) // 2), icon)

    # Fonts
    font_path = "C:/Windows/Fonts/segoeuib.ttf"
    font_reg = "C:/Windows/Fonts/segoeui.ttf"
    if not os.path.exists(font_path):
        font_path = "arial.ttf"
        font_reg = "arial.ttf"

    title_font = ImageFont.truetype(font_path, 64)
    subtitle_font = ImageFont.truetype(font_path, 32)
    desc_font = ImageFont.truetype(font_reg, 24)
    tag_font = ImageFont.truetype(font_path, 20)

    # Text positioning
    tx = 300
    draw.text((tx, 160), "Teacher Tools", font=title_font, fill=(240, 246, 252))
    draw.text((tx, 250), "Suite Didattica & Gestionale per Docenti", font=subtitle_font, fill=(88, 166, 255))
    draw.text((tx, 310), "Compilatore PEI D.I. 182  •  Diario di Bordo  •  Semplificatore DSA  •  Verifiche", font=desc_font, fill=(139, 148, 158))

    # Feature badges
    badges = ["100% Offline & PWA", "Dati Privati al 100% (Client-Side)", "Compatibile PC, Tablet & Mobile"]
    bx = tx
    by = 380
    for b in badges:
        bbox = draw.textbbox((0, 0), b, font=tag_font)
        bw = bbox[2] - bbox[0] + 24
        bh = 38
        draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=8, fill=(33, 38, 45), outline=(48, 54, 61), width=1)
        draw.text((bx + 12, by + 8), b, font=tag_font, fill=(201, 209, 217))
        bx += bw + 14

    out_path = os.path.join("assets", "og-image.png")
    img_rgb = img.convert("RGB")
    img_rgb.save(out_path, "PNG", optimize=True)
    print(f"Generated {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == "__main__":
    generate_og_image()
