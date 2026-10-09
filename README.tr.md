# 🔤 Font Specimen

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[English](README.md)

Başlık ve gövde yazı tipi adaylarını kendi sitenizle karşılaştırın: kendi renkleriniz, başlığınız, hizmetleriniz ve dilleriniz. Araç 10 başlık ve 10 gövde yazı tipi önerir, bunları tasarım değişkenlerinizle kurulmuş bir sayfada önizler ve karar vermeden önce dile özgü her harfi bozuk glif açısından denetler.

Uygulama bütünüyle tarayıcıda çalışır. Sunucu, hesap, çerez, analiz aracı ya da üçüncü taraf isteği yoktur. Yazı tipleri bu siteden sunulur ve açık lisanslıdır.

## Özellikler

- **Proje kurulumu**: Ad, ton (lüks, samimi, teknik ve diğerleri), site dilleri, mevcut yazı tipleri, renk değişkenleri ve gerçek içerik: başlık, giriş cümlesi, üç hizmet, sayısal bilgiler ve küçük bir tablo. Başlamak için altı kurgusal hazır proje vardır.
- **Adaylar**: Öneri motoru, 207 açık lisanslı aileden oluşan seçkiyi tona göre puanlar, seçimi farklı tasarım ailelerine yayar, değişken yazı tiplerini ve italikleri öne alır, her yerde kullanılan varsayılanlardan ise mevcut fontunuz değilse kaçınır. Mevcut yazı tipleriniz her zaman listededir ve “mevcut” rozeti taşır.
- **Deneme sayfası**: Giriş, gerçek radyo grupları bulunan yapışkan seçim çubuğu, `aria-live` özeti ve kopyalama düğmesi, yalnızca sizin renk ve içeriğinizi kullanan canlı önizleme ve düğme gibi davranan 20 kartlık galeri. Izgara normal ekranda 3 başlık ve 4 gövde sütunu, dar ekranda 2, mobilde 1 sütundur.
- **Glif denetimi**: Her özel harf 200px boyutunda bir canvas’a çizilir ve temel harfiyle karşılaştırılır. Birebir aynı görüntü, glifin bozuk olduğu anlamına gelir. Türkçe noktasız `ı` için x yüksekliğinin üstünde mürekkep olmadığı da kontrol edilir. Eksik glifler iki farklı yedek yazı tipiyle karşılaştırılarak bulunur.
- **Dışa aktarma**: CSS değişkenleri, gerçek `unicode-range` içeren `@font-face` kuralları, Fontsource ve `next/font` örnekleri, JSON yedeği ve tüm projeyi URL’nin `#` kısmında taşıyan paylaşım bağlantısı.
- **Arayüz**: Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, İtalyanca, Portekizce, Felemenkçe, İsveççe, Lehçe, Çekçe, Romence, Macarca, Rusça, Ukraynaca ve Yunanca. Katalog notları Türkçe ve İngilizce kalır.

## Canlı demo

Yayımlanmış bir demo yoktur. Aşağıdaki kurulumdan sonra uygulamayı [http://localhost:5173/](http://localhost:5173/) adresinde açın.

## Teknolojiler

- **React 19**: Arayüz, proje sekmeleri ve deneme galerisi.
- **TypeScript**: Katalog, proje ve yazı tipi üstverisinin tipleri. Betikler Node üzerinde doğrudan TypeScript olarak çalışır.
- **Vite 8**: Geliştirme sunucusu ve statik üretim derlemesi. Göreli dosya yolları `dist/` klasörünü taşınabilir tutar.
- **Zod**: Kayıtlı projeleri, içe aktarılan JSON’u ve paylaşım bağlantısı verisini kullanılmadan önce doğrular.
- **Vitest**: Öneri motoru, glif denetimi, yönlendirme, paylaşım ve kod örnekleri için birim testleri.
- **FontFace API**: Kendi barındırdığınız `.woff2` dosyalarını tarayıcıda, `unicode-range` ile bölünmüş olarak yükler.
- **Canvas**: Glifleri denetime çizip piksel görüntülerini karşılaştırır.
- **CompressionStream**: Projeyi paylaşım bağlantısının `#` kısmına `deflate-raw` ile sıkıştırır.
- **localStorage**: Projeleri ve seçilen arayüz dilini yalnızca bu tarayıcıda tutar.

## Kurulum

Gereksinim: Node.js 22.18 veya üstü. Depo `.nvmrc` ile Node 24’e sabitlenmiştir. Yazı tipi betikleri TypeScript’tir ve Node tarafından doğrudan çalıştırılır.

### Yerel geliştirme

```bash
npm install
npm run dev
```

`npm run dev` önce `npm run fonts` çalıştırır. Bu adım yerelde eksik olan sabitlenmiş yazı tipi dosyalarını indirir, ardından Vite’ı başlatır.

### Üretim derlemesi

```bash
npm run build
npm run preview
```

`npm run build` tip denetimi yapar, üçüncü taraf bildirimlerini yeniler ve `dist/` klasörünü yazar. `npm run preview` bu klasörü yerelde sunar. İçerik Güvenliği Politikası (CSP) bu derlemede etkindir. Geliştirme modunda sıcak yenileme satır içi kod eklediği için politika konulmaz.

### Statik barındırma

`dist/` klasörünü GitHub Pages dahil herhangi bir statik sunucuya, alt klasör olarak da yükleyebilirsiniz. Hash tabanlı yönlendirme ve göreli yollar sayesinde sunucu ayarı ya da yeniden yazma kuralı gerekmez.

Diğer betikler:

| Betik | Ne yapar |
| --- | --- |
| `npm test` | Birim testleri (Vitest) |
| `npm run typecheck` | `tsc -b` |
| `npm run fonts` | `src/generated/fontMeta.json` içinde listelenip yerelde olmayan yazı tipi dosyalarını indirir |
| `npm run fonts:sync` | Fontsource, npm ve kaynak depodaki lisans verisini yeniden okuyup `fontMeta.json` dosyasını yeniden yazar |
| `npm run notices` | `public/THIRD_PARTY_NOTICES.txt` dosyasını yazar |

## Kullanım

1. Uygulamayı başlatın ve ana sayfayı açın.
2. Altı kurgusal hazır projeden birini seçin, boş bir proje oluşturun ya da bir JSON yedeği içe aktarın (en fazla 200.000 bayt).
3. **Kurulum** sekmesinde adı, tonları, dilleri, mevcut yazı tiplerini, renkleri ve önizlemenin göstereceği gerçek metni girin.
4. **Adaylar** sekmesinde 10 başlık ve 10 gövde önerisini inceleyin. Her kart, o yüzün neden uyduğunu anlatır. Zaten kullandığınız yüzler “mevcut” işaretini taşır.
5. **Deneme** sekmesinde başlık ve gövdeyi yapışkan çubuktan ya da galeriden değiştirin. Önizleme hemen güncellenir. **Seçimi kopyala** çifti panoya yazar.
6. **Glif denetimi** sekmesinde, bir yazı tipini seçmeden önce projenin dilleri için denetimi çalıştırın.
7. **Dışa aktar** sekmesinde CSS, `@font-face` kuralları ya da çerçeve örneklerini kopyalayın, JSON indirin ya da paylaşım bağlantısını kopyalayın.

Rotalar URL’nin `#` kısmını kullanır:

| Adres | Sayfa |
| --- | --- |
| `#/` | Ana sayfa |
| `#/p/<id>/setup` | Kurulum. Diğer sekmeler: `candidates`, `specimen`, `audit`, `export` |
| `#/catalogue` | 207 aile |
| `#/guide` | Deneme sayfası nasıl okunur |
| `#/legal` | Lisanslar ve telif satırları |
| `#/privacy` | Tarayıcıda kalanlar |
| `#/share/<payload>` | Paylaşılan projeyi açar |

## Nasıl çalışır?

### Aday puanı

Her yüz, rol (başlık ya da gövde) ve seçtiğiniz tonlar için bir puan alır. `toneMatches`, o yüzde sizin tonlarınızdan kaçının geçtiğidir. Listenizdeki ilk ton birincil tondur.

```text
puan = toneMatches × 3
     + 1    birincil ton bu yüzdeyse
     + 0.5  yazı tipi değişkense
     + 0.75 italik varsa ve rol gövdeyse
     + 0.25 italik varsa ve rol başlıksa
     − 4    her yerde kullanılan bir varsayılansa
     − 0.75 katalogda uyarısı varsa
```

Bir yüz şu koşullarda uygundur: rolü destekler, gereken her alt kümeyi kapsar (Türkçe için `latin-ext`), dışlanmamıştır ve projenin dillerinde bilinen bir glif sorunu yoktur.

Seçici ardından çeşitliliği korur:

1. Önce mevcut yazı tipiniz, sonra saklamayı seçtiğiniz yüzler gelir.
2. Her tasarım ailesinin en uygun yüzü alınır. Uygunluk en az bir ton eşleşmesidir; her yerde kullanılan varsayılanlar bekler.
3. Kalan yerler puana göre dolar; bir aileden en fazla 3 yüz alınır.
4. Liste hâlâ kısaysa ton şartı gevşer, sonra varsayılanlara izin verilir, aile sınırı ise yalnızca en sonda kalkar.

Önerilen çift zıtlığı tercih eder. Aynı ailenin hem başlık hem gövde olması −10 puan getirir. Serif başlık ile sans gövde +2 puan alır. Aynı gövde grubundan iki yüz −1 puan alır.

### Glif denetimi

Aksanlı harfler bir temel harfle eşlenir (`ş` ile `s`, `ğ` ile `g` ve Unicode ayrıştırmasının ifade etmediği ek Türkçe ve Lehçe çiftler). Her glif 200px boyutunda çizilir. Alfa değeri en az 64 olan piksel mürekkep sayılır. Mürekkep deseni temel harfle aynıysa, karakter yazı tipinde olsa bile aksan eksiktir. Türkçe noktasız `ı` için x yüksekliğinin üstünde mürekkep olmadığı da aranır.

### Yazı tipi dosyaları

`src/generated/fontMeta.json` depoya dahildir. Her aileyi kesin bir Fontsource sürümüne sabitler; alt kümelerini, eksenlerini, dosyalarını, lisansını, kaynak lisans adresini ve telif satırını kaydeder.

`.woff2` dosyaları (yaklaşık 30 MB) depoya dahil edilmez. `npm run fonts`, sabitlenmiş dosyaları jsDelivr Fontsource aynasından `public/fonts/<id>/` klasörüne indirir ve her ailenin kendi `LICENSE.txt` dosyasını yanına koyar. Bu lisans metni kaynak [google/fonts](https://github.com/google/fonts) deposundan gelir.

Çalışma anında `FontFace` API’si bu dosyaları aynı kaynaktan, `unicode-range` ile bölünmüş olarak yükler. Tarayıcı yalnızca dillerinizin gerektirdiği alt kümeleri indirir. Ziyaretçinin tarayıcısı Google’a, Fontsource’a ya da bir CDN’e bağlanmaz. İndirme adımı kurulum ya da derleme sırasında sizin makinenizde çalışır.

### Paylaşım bağlantıları ve depolama

Projeler bu kökene ait `localStorage` alanında durur. Paylaşım bağlantısı projeyi `deflate-raw` ile sıkıştırır, base64url olarak kodlar ve `#` kısmına koyar (`#/share/…`). Tarayıcılar bu kısmı sunucuya göndermez. Veri, kodlanmış halde 24.000 karakter ve açıldıktan sonra 64.000 bayt ile sınırlıdır; ardından Zod ile doğrulanır.

### Gizlilik ve güvenlik

- Projeleri Gizlilik sayfasından istediğiniz an silebilirsiniz.
- Üretim derlemesi sıkı bir İçerik Güvenliği Politikası ile gelir: her şey `'self'` kaynağından, satır içi betik yok, dış bağlantı yok, `object-src 'none'`, `base-uri 'none'`.
- Güvenlik açığını gizli bildirin. Ayrıntı [SECURITY.md](SECURITY.md) dosyasındadır. Güvenlik sorunları için herkese açık issue açmayın.

### Klasör yapısı

```text
scripts/            yazı tipi eşitleme, indirme ve üçüncü taraf bildirimleri
src/data/           katalog, diller, hazır projeler, ortak tipler
src/generated/      fontMeta.json (üretilir, depoya dahildir)
src/lib/            öneri motoru, glif denetimi, depolama, paylaşım, kod örnekleri, kontrast
src/i18n/           arayüz sözlükleri (16 dil)
src/components/     ortak arayüz ve deneme sayfası parçaları
src/pages/          sayfalar; proje sekmeleri src/pages/project/ içinde
.cursor/commands/   bu aracın çıktığı özgün Cursor komutu
```

## Özelleştirme

### Yazı tipi eklemek

Aile Fontsource’ta olmalı ve SIL Open Font License 1.1 ya da Apache License 2.0 altında olmalıdır. `src/data/catalogue.ts` dosyasına bir kayıt ekleyin:

```typescript
{
  id: 'your-fontsource-id',
  family: 'Family Name',
  classification: 'humanistSans',
  roles: ['body'],
  tones: ['calm', 'friendly'],
  note: {
    tr: 'Bu yüzün aklınızdaki projelere neden uyduğunu tek cümlede yazın.',
    en: 'One sentence on why this face suits the projects you have in mind.',
  },
}
```

`classification` şunlardan biridir: `didone`, `garalde`, `transitional`, `softSerif`, `editorialSerif`, `inscriptional`, `slab`, `geometricSans`, `humanistSans`, `grotesk`, `softSans`, `condensedSans`, `display`, `mono`.

Ardından çalıştırın:

```bash
npm run fonts:sync
```

Bu komut sürümü sabitler, kaynak lisansını ve telif satırını `fontMeta.json` içine yazar ve dosyaları indirir. Glif denetimi sekmesini açıp katalog denetimini çalıştırın. Yüz bir dilde başarısız olursa o dil için `glyphIssues` ve her iki dilde bir `caveat` ekleyin.

### Hazır proje eklemek

Örnek projeler `src/data/presets.ts` içindedir. Kurgusal olmalıdır: uydurma işletme adları, gerçek adres, telefon, kişi ya da logo yok. Her hazır projenin Türkçe ve İngilizce `summary` ve `content` alanları, ayrıca `languages`, `tones` ve `theme` renkleri vardır.

### Arayüz metnini değiştirmek

Kullanıcıya görünen dizeler `src/i18n/` altındadır. İngilizce ve Türkçe (`en.ts`, `tr.ts`) kaynak çifttir. Diğer on dört dil istenince yüklenir. Yazı tipi adları İngilizce kalır ve `lang="en"` taşır; çünkü Türkçe büyük harf `i` harfini `İ` yapar.

### Cursor komutunu başka bir projede kullanmak

Bu uygulama, mevcut bir kod tabanına deneme sayfası ekleyen bir Cursor komutu olarak başladı. Komut [`.cursor/commands/font-specimen.md`](.cursor/commands/font-specimen.md) dosyasındadır. Dosyayı diğer projenin `.cursor/commands/` klasörüne kopyalayın ve Cursor sohbetinde `/font-specimen` yazın. Bu depoyu açmak, komutu başka projelere kurmaz.

## Ayrıntılı özellikler

### Bilinen Türkçe glif bulguları

Denetim, mevcut katalogda şu aileleri Türkçe için işaretler. Tenor Sans, Lato, Bagel Fat One ve Golos Text ayrıca gözle de doğrulandı.

| Aile | Türkçedeki sorun |
| --- | --- |
| Tenor Sans | Noktasız `ı` noktalı çiziliyor; `Ş/ş` alt virgülle çiziliyor |
| Lato (Fontsource sürümü) | `İ`, `Ğ`, `ğ`, `Ş`, `ş` eksik |
| Bagel Fat One | `İ`, `Ğ`, `ğ`, `Ş`, `ş` eksik |
| Golos Text | `Ğ/ğ` kısa çizgisi (breve) olmadan çiziliyor |
| Assistant | `İ`, `Ğ`, `ğ`, `Ş`, `ş` eksik; `Ç` de `C` gibi çiziliyor |
| Expletus Sans | `İ`, `Ğ`, `ğ`, `Ş`, `ş` eksik |
| Ballet | Büyük `İ`, noktasız `I` gibi çiziliyor |

Bu yazı tipleri katalogda uyarı taşır ve Türkçe projelere hiç önerilmez. Katalogdaki diğer el yazısı yazı tipleri aynı Türkçe denetiminden geçti.

Öneriler ve glif denetimleri yardımcıdır. Son seçimi gerçek sitenizde deneyin.

### Bugün gelenler

- ✅ Altı kurgusal hazır proje ve JSON içe/dışa aktarma
- ✅ On başlık ve on gövde adayı, önerilen bir çift ile
- ✅ Deneme önizlemesi, yapışkan radyolar ve 20 kartlık galeri
- ✅ Türkçe ve Lehçe özel durumları dahil canvas glif denetimi
- ✅ CSS, `@font-face`, Fontsource ve `next/font` dışa aktarma
- ✅ URL’nin `#` kısmından çıkmayan paylaşım bağlantıları
- ✅ On altı arayüz dili
- ✅ Sıkı üretim İçerik Güvenliği Politikası

## Katkı

Issue ve pull request’ler İngilizce ya da Türkçe açılabilir. Katkıda bulunarak katkınızın bu deponun MIT lisansı altında lisanslanmasını kabul edersiniz.

1. Depoyu fork’layın ve bir dal oluşturun.
2. `npm install` ve `npm run dev` ile bağımlılıkları kurup uygulamayı başlatın.
3. `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:` ya da `perf:` ile başlayan bir iletiyle commit atın.
4. Pull request açmadan önce `npm run typecheck`, `npm test` ve `npm run build` çalıştırın.
5. Dalı gönderin ve bir pull request açın.

Yeni bir yazı tipinin nasıl gözden geçirileceği dahil tam kurallar [CONTRIBUTING.md](CONTRIBUTING.md) dosyasındadır.

## Lisans

Kod [MIT](LICENSE) lisanslıdır.

### Yazı tipleri

206 aile SIL Open Font License 1.1, bir aile (Roboto Slab) Apache License 2.0 altındadır. Her biri kendi telif hakkını ve lisansını korur. Bu depo onları yeniden lisanslamaz. Uygulamadaki Hukuki sayfası her aileyi lisansı ve telif satırıyla listeler; derleme `THIRD_PARTY_NOTICES.txt` dosyasını da içerir. Bazı yazı tipi adları Ayrılmış Yazı Tipi Adı’dır (Reserved Font Name): bir yazı tipini değiştirirseniz adını da değiştirmeniz gerekir.

### Markalar

Yazı tipi adları ile Google Fonts ve Fontsource adları sahiplerine aittir ve yalnızca yazı tiplerini tanımlamak için kullanılır. Bu proje bağımsızdır; Google, Fontsource ya da herhangi bir yazı tipi tasarımcısıyla bağlantılı değildir ve onlar tarafından onaylanmamıştır.

### Hazır projeler

Altı örnek işletme (Ekşimaya Fırın, Meridyen Hukuk, Nordlicht Studio, Tidepool Analytics, Maison Ondine, Bilmece Atölyesi) kurgusaldır. Gerçek işletmelerle benzerlik tesadüftür.

### Garanti yoktur

Yazılım ve yazı tipi dosyaları garanti olmadan sunulur. Her yazı tipinin lisansını kendi kullanımınız için okuyun.

## Geliştirici

**Serkanbyx**

- Site: [serkanbayraktar.com](https://serkanbayraktar.com/)
- GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- E-posta: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

## Teşekkür

- 207 ailenin yazı tipi tasarımcıları ve telif sahipleri.
- Aile paketleri, alt küme üstverisi ve eşitleme betiğinin okuduğu API için [Fontsource](https://fontsource.org/).
- Her ailenin yanına kopyalanan kaynak lisans metinleri için [google/fonts](https://github.com/google/fonts).
- Bu aileleri yeniden dağıtılabilir tutan SIL Open Font License ve Apache License 2.0.

## İletişim

- Sorular ve hatalar: [bir issue açın](https://github.com/Serkanbyx/font-specimen/issues)
- Güvenlik bildirimleri: [SECURITY.md](SECURITY.md) içinde anlatılan GitHub gizli güvenlik açığı bildirimi
- E-posta: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- Site: [serkanbayraktar.com](https://serkanbayraktar.com/)

---

⭐ Bu proje hoşunuza gittiyse bir yıldız bırakmayı unutmayın.
