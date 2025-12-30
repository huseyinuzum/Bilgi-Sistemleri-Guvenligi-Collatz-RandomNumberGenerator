import random

class CollatzBitCipherV2:
    def __init__(self):
        # ÖRNEK S-BOX (Değişirse imza değişir, shuffle değişir)
        self.sbox = [12, 5, 6, 11, 9, 0, 10, 13, 3, 14, 15, 8, 4, 7, 1, 2]
        
    def calculate_signature(self):
        """S-Box içeriğine göre benzersiz bir imza üretir."""
        return sum(val * (i + 1) for i, val in enumerate(self.sbox))

    def run(self):
        print("--- S-BOX DUYARLI & GERİ BESLEMELİ BİT ÜRETECİ (V2) ---")
        
        # 1. GİRDİ ALMA (Seed + Opsiyonel Tuz)
        try:
            seed_input = input("Başlangıç Tohumu (Seed - Sayı) giriniz: ")
            user_seed = int(seed_input)
        except ValueError:
            user_seed = 1923
            print(f"-> Geçersiz giriş, varsayılan seed atandı: {user_seed}")

        salt_input = input("Tuzlama Metni (Salt - Opsiyonel): ")
        # Metni sayısal bir değere dönüştürme (Basit bir hash mantığı)
        salt_val = sum(ord(c) for c in salt_input) if salt_input else 0

        # 2. İMZA VE MASTER SEED OLUŞTURMA
        sbox_signature = self.calculate_signature()
        
        # Seed + Salt + S-Box İmzası = Kırılması çok daha zor bir RNG tohumu
        # S-Box'ın tek bir hanesi değişse bile 'final_seed' tamamen değişir.
        final_seed = user_seed + salt_val + sbox_signature
        
        print(f"\n[SİSTEM] S-Box İmzası: {sbox_signature}")
        print(f"[SİSTEM] Final Shuffle Seed: {final_seed}")
        
        # Python'un RNG motorunu bu güçlendirilmiş seed ile başlatıyoruz
        rng = random.Random(final_seed)
        
        target_total = 32
        target_half = target_total // 2
        
        collected_zeros = []
        collected_ones = []
        
        state = user_seed 
        previous_sbox_val = 0 # Geri besleme (Feedback) için hafıza
        
        loop_count = 0
        
        # 3. COLLATZ MOTORU VE BİT ÜRETİMİ
        while len(collected_zeros) < target_half or len(collected_ones) < target_half:
            loop_count += 1
            
            # A) Collatz Adımı
            if state % 2 == 0:
                state //= 2
                raw_bit = 0
            else:
                state = 3 * state + 1
                raw_bit = 1
            
            # B) S-Box Karıştırma (GELİŞTİRİLMİŞ KISIM)
            # İndeksi sadece state'e değil, bir önceki S-Box değerine de bağlıyoruz.
            # Bu, "zincirleme" (chaining) etkisi yaratır.
            dynamic_index = (state ^ previous_sbox_val) % 16
            sbox_val = self.sbox[dynamic_index]
            
            # C) Bit Belirleme (XOR kullanımı)
            # (Raw Bit) XOR (S-Box Değerinin LSB'si)
            processed_bit = raw_bit ^ (sbox_val % 2)
            
            # Geri besleme hafızasını güncelle
            previous_sbox_val = sbox_val
            
            # D) Kova Doldurma (Balancing)
            if processed_bit == 0:
                if len(collected_zeros) < target_half:
                    collected_zeros.append(0)
            else:
                if len(collected_ones) < target_half:
                    collected_ones.append(1)
            
            # Sonsuz döngü koruması
            if loop_count > 100000: 
                print("\n[UYARI] Döngü sınırı aşıldı, eksik bitlerle devam ediliyor.")
                break

        # 4. FİNAL KARIŞTIRMA (SHUFFLE)
        # Bu kısım senin orijinal "S-Box İmza" mantığın sayesinde güvende.
        final_bits = collected_zeros + collected_ones
        rng.shuffle(final_bits)
        
        # ÇIKTI
        print("="*50)
        print("SONUÇ: ŞİFRELİ BİT DİZİSİ (V2)")
        print("="*50)
        
        bit_string = "".join(map(str, final_bits))
        hex_output = hex(int(bit_string, 2)) # Ekstra: Hex karşılığı
        
        print(f"\n>> ÇIKTI (Binary): {bit_string}")
        print(f">> ÇIKTI (Hex)   : {hex_output}")
        print(f">> ÇIKTI (Liste) : {final_bits}")
        
        print("\n" + "-"*50)
        zeros = final_bits.count(0)
        ones = final_bits.count(1)
        
        if zeros == ones and (zeros + ones) == target_total:
            print(f"DURUM    : ✅ BAŞARILI VE DENGELİ (0:{zeros}, 1:{ones})")
        else:
            print(f"DURUM    : ❌ DENGE HATASI")
        print("="*50)

if __name__ == "__main__":
    algo = CollatzBitCipherV2()
    algo.run()
