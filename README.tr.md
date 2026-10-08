# Font Specimen

[English](README.md)

Başlık ve gövde yazı tipi adaylarını **kendi** sitenizle karşılaştırın: kendi renkleriniz, başlığınız, hizmetleriniz ve dilleriniz. Araç 10 başlık ve 10 gövde yazı tipi önerir, bunları tasarım değişkenlerinizle kurulmuş bir sayfada önizler ve karar vermeden önce dile özgü her harfi bozuk glif açısından denetler.

Her şey tarayıcıda çalışır. Sunucu, hesap, çerez, analiz aracı ya da üçüncü taraf isteği yoktur. Yazı tipleri bu siteden sunulur ve açık lisanslıdır.

## Neler yapar

- **Proje kurulumu:** ad, ton (lüks, samimi, teknik, …), site dilleri, mevcut yazı tipleri, renk değişkenleri ve gerçek içerik (başlık, giriş cümlesi, üç hizmet, sayısal bilgiler, küçük bir tablo). Başlamak için altı kurgusal hazır proje vardır.
- **Adaylar:** öneri motoru, 207 açık lisanslı aileden oluşan seçkiyi tona göre puanlar, seçimi farklı tasarım ailelerine yayar (art arda on geometrik sans yok), değişken ve italiği olan yazı tiplerini öne alır, her yerde kullanılan varsayılanlardan ise mevcut fontunuz değilse kaçınır. Mevcut yazı tipleriniz her zaman listededir ve “mevcut” rozeti taşır.
- **Deneme sayfası:** giriş, yapışkan seçim çubuğu (gerçek radyo grupları, `aria-live` özeti, kopyalama düğmesi), yalnızca sizin renk ve içeriğinizi kullanan canlı önizleme ve düğme gibi davranan 20 kartlık galeri. Izgara: normal ekranda 3 başlık / 4 gövde sütunu, dar ekranda 2, mobilde 1.
- **Glif denetimi:** her özel harf 200px boyutunda bir canvas'a çizilir ve temel harfiyle karşılaştırılır (Türkçe `ı/i`, `İ/I`, `ş/s`, `ğ/g`, … ve Lehçe `ł/l`). Birebir aynı görüntü, glifin bozuk olduğu anlamına gelir. Türkçe noktasız `ı` için x yüksekliğinin üstünde mürekkep olmadığı da kontrol edilir. Eksik glifler iki farklı yedek yazı tipiyle karşılaştırılarak bulunur.
- **Dışa aktarma:** CSS değişkenleri, gerçek `unicode-range` içeren `@font-face` kuralları, Fontsource ve `next/font` örnekleri, JSON yedeği ve tüm projeyi URL'nin `#` kısmında taşıyan paylaşım bağlantısı (sunucuya hiç gönderilmez).
- **Arayüz:** Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, İtalyanca, Portekizce, Felemenkçe, İsveççe, Lehçe, Çekçe, Romence, Macarca, Rusça, Ukraynaca ve Yunanca. Katalog notları Türkçe ve İngilizce kalır.

### Bilinmesi gereken bulgular

Denetim kâğıt üstünde kalmıyor. Mevcut katalogda Türkçe için şu aileleri işaretliyor. Tenor Sans, Lato, Bagel Fat One ve Golos Text ayrıca gözle de doğrulandı:

| Aile | Türkçedeki sorun |
| --- | --- |
| Tenor Sans | noktasız `ı` noktalı çiziliyor; `Ş/ş` alt virgülle çiziliyor |
| Lato (Fontsource sürümü) | `İ`, `Ğ`, `ğ`, `Ş`, `ş` eksik |
| Bagel Fat One | `İ`, `Ğ`, `ğ`, `Ş`, `ş` eksik |
| Golos Text | `Ğ/ğ` kısa çizgisi (breve) olmadan çiziliyor |
| Assistant | `İ`, `Ğ`, `ğ`, `Ş`, `ş` eksik; `Ç` de `C` gibi çiziliyor |
| Expletus Sans | `İ`, `Ğ`, `ğ`, `Ş`, `ş` eksik |
| Ballet | büyük `İ`, noktasız `I` gibi çiziliyor |

Bu yazı tipleri katalogda uyarı taşır ve Türkçe projelere hiç önerilmez. Katalogdaki diğer el yazısı yazı tipleri aynı Türkçe denetiminden geçti.

## Başlarken

Gereksinim: Node.js 22.18 veya üstü (betikler TypeScript'tir ve Node tarafından doğrudan çalıştırılır). Depo `.nvmrc` ile Node 24'e sabitlenmiştir.

```bash
npm install
npm run dev        # eksik yazı tipi dosyalarını indirir, ardından Vite'ı başlatır
```

Diğer betikler:

| Betik | Ne yapar |
| --- | --- |
| `npm run build` | tip denetimi, ardından `dist/` klasörüne üretim derlemesi |
| `npm run preview` | `dist/` klasörünü yerelde sunar (CSP burada etkindir, geliştirme modunda değil) |
| `npm test` | birim testleri (Vitest) |
| `npm run typecheck` | `tsc -b` |
| `npm run fonts` | `src/generated/fontMeta.json` içinde listelenip yerelde olmayan yazı tipi dosyalarını indirir |
| `npm run fonts:sync` | Fontsource, npm ve kaynak depodaki lisans verisini yeniden okuyup `fontMeta.json` dosyasını yeniden yazar |
| `npm run notices` | `public/THIRD_PARTY_NOTICES.txt` dosyasını yazar |

Derleme göreli dosya yolları ve hash tabanlı yönlendirme kullanır; bu yüzden `dist/` ek ayar gerekmeden herhangi bir statik sunucuda veya alt klasörde (GitHub Pages dahil) çalışır.

## Yazı tipleri nasıl yönetiliyor

- `src/generated/fontMeta.json` depoya dahildir. Her aileyi kesin bir Fontsource sürümüne sabitler; alt kümelerini, eksenlerini, dosyalarını, lisansını, kaynak lisans adresini ve telif satırını kaydeder.
- `.woff2` dosyaları (yaklaşık 30 MB) depoya **dahil edilmez**. `npm run fonts`, sabitlenmiş dosyaları jsDelivr Fontsource aynasından `public/fonts/<id>/` klasörüne indirir; yanına ailenin kendi `LICENSE.txt` dosyasını, kaynak [google/fonts](https://github.com/google/fonts) deposundan alarak koyar.
- Çalışma anında yazı tipleri `FontFace` API'siyle aynı kaynaktan, `unicode-range` ile bölünmüş olarak yüklenir; tarayıcı yalnızca dillerinizin gerektirdiği alt kümeleri indirir.
- Hiçbir ziyaretçi Google'a, Fontsource'a veya bir CDN'e bağlanmaz.

## Klasör yapısı

```
scripts/            yazı tipi eşitleme/indirme ve üçüncü taraf bildirimleri
src/data/           katalog, diller, hazır projeler, ortak tipler
src/generated/      fontMeta.json (üretilir, depoya dahildir)
src/lib/            öneri motoru, glif denetimi, depolama, paylaşım, kod örnekleri, kontrast
src/i18n/           arayüz sözlükleri (16 dil)
src/components/     ortak arayüz ve deneme sayfası parçaları
src/pages/          sayfalar; proje sekmeleri src/pages/project/ içinde
.cursor/commands/   bu aracın çıktığı özgün Cursor komutu
```

## Gizlilik ve güvenlik

- Projeler tarayıcınızın `localStorage` alanında tutulur ve Gizlilik sayfasından istediğiniz an silinebilir.
- Paylaşım bağlantıları sıkıştırılmış projeyi URL'nin **`#` kısmına** (`#/share/…`) koyar; tarayıcılar bu kısmı sunucuya göndermez. Gelen veri boyut sınırına tabidir ve kullanılmadan önce Zod ile doğrulanır.
- Üretim derlemesi sıkı bir İçerik Güvenliği Politikası (CSP) ile gelir: her şey `'self'` kaynağından, satır içi betik yok, dış bağlantı yok, `object-src 'none'`, `base-uri 'none'`.

Güvenlik açığı bildirmek için [SECURITY.md](SECURITY.md) dosyasına bakın.

## Hukuki

- **Kod:** MIT, bkz. [LICENSE](LICENSE).
- **Yazı tipleri:** 206 aile SIL Open Font License 1.1, bir aile (Roboto Slab) Apache License 2.0 altındadır. Her biri kendi telif hakkını ve lisansını korur; bu depo onları yeniden lisanslamaz. Uygulamadaki Hukuki sayfası her aileyi lisansı ve telif satırıyla listeler, derleme de `THIRD_PARTY_NOTICES.txt` dosyasını içerir. Bazı yazı tipi adları “Ayrılmış Yazı Tipi Adı”dır (Reserved Font Name): bir yazı tipini değiştirirseniz adını da değiştirmeniz gerekir.
- **Markalar:** yazı tipi adları ile Google Fonts ve Fontsource adları sahiplerine aittir ve yalnızca yazı tiplerini tanımlamak için kullanılır. Bu proje bağımsızdır; Google, Fontsource ya da herhangi bir yazı tipi tasarımcısıyla bağlantılı değildir ve onlar tarafından onaylanmamıştır.
- **Hazır projeler:** altı örnek işletme (Ekşimaya Fırın, Meridyen Hukuk, Nordlicht Studio, Tidepool Analytics, Maison Ondine, Bilmece Atölyesi) kurgusaldır. Gerçek işletmelerle benzerlik tesadüftür.
- **Garanti yoktur:** öneriler ve glif denetimleri yardımcı araçtır, güvence değildir. Son seçimi gerçek sitenizde deneyin ve her yazı tipinin lisansını kendi kullanımınız için kontrol edin.

## Cursor komutu

Bu araç, mevcut bir kod tabanına doğrudan deneme sayfası ekleyen bir Cursor komutu olarak başladı. Komut [`.cursor/commands/font-specimen.md`](.cursor/commands/font-specimen.md) dosyasında duruyor. Kullanmak için dosyayı başka bir projenin `.cursor/commands/` klasörüne kopyalayın ve Cursor sohbetinde `/font-specimen` yazın.

## Katkı

Bkz. [CONTRIBUTING.md](CONTRIBUTING.md).
