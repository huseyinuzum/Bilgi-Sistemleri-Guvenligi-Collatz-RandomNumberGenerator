BAŞLAT CollatzCipher_v2

GİRDİLER:
  - Kullanıcı Seed (Sayı)
  - Tuz (Salt - Opsiyonel Metin)
  - S-Box (16 elemanlı liste)

ADIM 1: S-Box İmzası Hesapla
  Signature = TOPLA(Değer * (İndeks + 1) FOR her eleman IN S-Box)

ADIM 2: Master Seed Oluştur
  Tuz_Değeri = Tuz metnindeki karakterlerin ASCII toplamı
  Master_Seed = Kullanıcı_Seed + Signature + Tuz_Değeri
  RNG_Motoru'nu Master_Seed ile başlat

ADIM 3: Değişkenleri Hazırla
  Hedef_Uzunluk = 32 bit
  Sıfır_Kovası = []
  Bir_Kovası = []
  State = Kullanıcı_Seed
  Önceki_SBox_Değeri = 0 (Başlangıç için)

ADIM 4: Döngü (Kovalar dolana kadar)
  EĞER (State Çift ise):
    State = State / 2
    Ham_Bit = 0
  DEĞİLSE:
    State = 3 * State + 1
    Ham_Bit = 1
  
  # Geliştirme: Önceki değer ile XORlanmış indeks
  İndeks = (State XOR Önceki_SBox_Değeri) MOD 16
  SBox_Çıktısı = SBox[İndeks]
  
  # Bit Üretimi (XOR Mantığı)
  Sonuç_Bit = (Ham_Bit XOR (SBox_Çıktısı MOD 2))
  
  # Geri Besleme Güncellemesi
  Önceki_SBox_Değeri = SBox_Çıktısı
  
  # Kova Doldurma (Dengeleme)
  EĞER Sonuç_Bit == 0 VE Sıfır_Kovası dolmadıysa:
     Sıfır_Kovası'na ekle
  EĞER Sonuç_Bit == 1 VE Bir_Kovası dolmadıysa:
     Bir_Kovası'na ekle

ADIM 5: Karıştırma ve Çıktı
  Ham_Liste = Sıfır_Kovası + Bir_Kovası
  RNG_Motoru ile Ham_Liste'yi karıştır (Shuffle)
  
BİTİR ve Ham_Liste'yi Döndür
