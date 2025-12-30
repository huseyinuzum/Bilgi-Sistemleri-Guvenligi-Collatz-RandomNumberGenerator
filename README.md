# 🎲 CollatzBitCipher V2: Chaos-Based Bit Generator

![Python Version](https://img.shields.io/badge/python-3.x-blue?style=flat&logo=python)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-experimental-orange)

**CollatzBitCipher**, ünlü matematiksel problem **Collatz Sanısı (3n+1)** ile kriptografik **S-Box (Substitution Box)** mimarisini birleştiren deneysel bir sözde rastgele bit üretecidir (PRNG). 

V2 sürümü ile birlikte; **dinamik tuzlama (salting)**, **geri beslemeli (feedback) indeksleme** ve **XOR tabanlı karıştırma** eklenerek entropi ve çığ etkisi (avalanche effect) maksimize edilmiştir.

---

## 🚀 Temel Özellikler

Bu algoritma standart `random` kütüphanelerinden farklı olarak hibrit bir yapı kullanır:

* **🌪 Collatz Kaosu:** Sayı üretiminin temeli, matematiksel olarak kaotik davranan `3n+1` yörüngelerine dayanır.
* **🔒 S-Box İmzası (Signature):** Algoritma çalışmadan önce S-Box'ın matematiksel imzasını çıkarır. S-Box içindeki tek bir sayının değişmesi, tüm üretim sürecini (seed dahil) değiştirir.
* **🔄 Geri Beslemeli (Feedback) Döngü:** Bir bit üretilirken, sadece o anki durum (state) değil, bir önceki S-Box çıktısı da indeksi etkiler. Bu, zincirleme bir bağımlılık yaratır.
* **⚖️ Dengeli Çıktı (Balancing):** Üretilen 32 bitlik dizinin her zaman %50 '0' ve %50 '1' olmasını garanti eden bir kova (bucket) sistemi kullanır.
* **🧂 Dinamik Tuzlama:** Kullanıcı seed'ine ek olarak girilen "Tuz (Salt)" metni, başlangıç entropisini artırır.

---

## 🛠️ Algoritma Mantığı (Nasıl Çalışır?)

Sistem 4 ana aşamadan oluşur:

1.  **Başlatma (Initialization):**
    * Kullanıcıdan `Seed` (Sayı) ve `Salt` (Metin) alınır.
    * `Master Seed = User_Seed + Salt_Hash + SBox_Signature` formülüyle kırılması zor bir tohum oluşturulur.
2.  **Collatz Yürüyüşü:**
    * Sayı çiftse: `n / 2` (Ham Bit: 0)
    * Sayı tekse: `3n + 1` (Ham Bit: 1)
3.  **Karıştırma & XOR (Ciphering):**
    * `İndeks = (State XOR Previous_SBox_Val) % 16`
    * `Final Bit = Ham Bit XOR (SBox_Val % 2)`
4.  **Dengeleme & Shuffle:**
    * Üretilen bitler, 0 ve 1 sayıları eşit olana kadar toplanır.
    * Son olarak dizi, Master Seed ile beslenen RNG motoruyla karıştırılır.

---

## 📊 Akış Şeması (Flowchart)

Algoritmanın çalışma prensibini gösteren UML şeması:


```mermaid
graph TD
    A([BAŞLAT]) --> B{Seed & Salt}
    B --> C[Master Seed Oluştur]
    C --> D[Collatz Döngüsü Başlat]
    D --> E[S-Box & XOR İşlemi]
    E --> F[Kovalara Doldur 0/1]
    F --> G{32 Bit Doldu mu?}
    G -- Hayır --> D
    G -- Evet --> H[Final Shuffle & Çıktı]
