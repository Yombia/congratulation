import qrcode
from PIL import Image, ImageDraw

def make_heart_qr(url, output_path="qr_hati_acel.png"):
    # 1. Inisialisasi QR Code dengan Error Correction HIGH (30% Toleransi Kerusakan)
    qr = qrcode.QRCode(
        version=5,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    # Render QR Code dasar ke format RGBA (Red, Green, Blue, Alpha)
    qr_img = qr.make_image(fill_color="#c9184a", back_color="black").convert("RGBA")
    width, height = qr_img.size

    # 2. Buat Kanvas Masking Berbentuk Hati
    mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(mask)
    
    # Algoritma menggambar siluet hati yang presisi di tengah kanvas
    # Kita beri margin agar 3 kotak jangkar di sudut (Finder Patterns) TIDAK terpotong
    box = [width * 0.05, height * 0.1, width * 0.95, height * 0.95]
    
    # Menggambar bentuk hati menggunakan kombinasi dua lingkaran dan satu segitiga
    left_circle = [box[0], box[1], box[0] + (box[2]-box[0])/2, box[1] + (box[3]-box[1])/2]
    right_circle = [box[0] + (box[2]-box[0])/2, box[1], box[2], box[1] + (box[3]-box[1])/2]
    
    draw.ellipse(left_circle, fill=255)
    draw.ellipse(right_circle, fill=255)
    draw.polygon([
        (box[0], box[1] + (box[3]-box[1])/4),
        (box[2], box[1] + (box[3]-box[1])/4),
        (box[0] + (box[2]-box[0])/2, box[3])
    ], fill=255)

    # 3. Kunci Finder Patterns (3 Kotak Pojok Wajib Utuh agar Bisa Di-scan)
    # Pojok Kiri Atas
    draw.rectangle([0, 0, 110, 110], fill=255)
    # Pojok Kanan Atas
    draw.rectangle([width - 110, 0, width, 110], fill=255)
    # Pojok Kiri Bawah
    draw.rectangle([0, height - 110, 110, height], fill=255)

    # 4. Aplikasikan Masking Hati ke QR Code
    output_img = Image.new("RGBA", (width, height), (0, 0, 0, 0)) # Latar transparan atau hitam
    # Mengisi background dengan warna hitam pekat sesuai tema web
    bg = Image.new("RGBA", (width, height), "#080305")
    
    final_qr = Image.composite(qr_img, bg, mask)
    final_qr.save(output_path)
    print(f"Sukses! QR Code Hati berhasil digenerate di: {output_path}")

# Eksekusi langsung ke link Vercel Anda
make_heart_qr("https://congratulation-blush.vercel.app/")