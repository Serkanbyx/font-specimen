import type { CatalogueFont } from './types.ts';
import { moreFonts } from './catalogueMore.ts';

/**
 * Curated, openly licensed typefaces. Every id must exist on Fontsource;
 * `npm run fonts:sync` fails loudly when one does not.
 */
export const catalogue: readonly CatalogueFont[] = [
  // High-contrast didones
  {
    id: 'playfair-display',
    family: 'Playfair Display',
    classification: 'didone',
    roles: ['heading'],
    tones: ['luxurious', 'editorial', 'classic'],
    headingWeight: 600,
    note: {
      tr: 'Keskin kontrastı ve dolgun italiğiyle lüks ve editoryal markalarda başlıklara hemen ağırlık kazandırır.',
      en: 'Sharp contrast and a full italic give headlines instant weight for luxury and editorial brands.',
    },
  },
  {
    id: 'bodoni-moda',
    family: 'Bodoni Moda',
    classification: 'didone',
    roles: ['heading'],
    tones: ['luxurious', 'editorial'],
    headingWeight: 500,
    note: {
      tr: 'Optik boyutlu bir Bodoni; büyük puntoda moda dergisi zarafeti verir, ince çizgileri küçük boyutta da dağılmaz.',
      en: 'An optical-size Bodoni with fashion-magazine poise at large sizes; hairlines survive smaller settings too.',
    },
  },
  {
    id: 'dm-serif-display',
    family: 'DM Serif Display',
    classification: 'didone',
    roles: ['heading'],
    tones: ['editorial', 'luxurious', 'warm'],
    note: {
      tr: 'Sıkı aralıklı, sıcak bir display serif; kısa ve güçlü manşetlerde en iyi halini gösterir.',
      en: 'A tightly spaced, warm display serif that shines in short, confident headlines.',
    },
  },
  {
    id: 'abril-fatface',
    family: 'Abril Fatface',
    classification: 'didone',
    roles: ['heading'],
    tones: ['bold', 'editorial', 'playful'],
    note: {
      tr: 'Afiş geleneğinden gelen kalın bir fat face; tek kelimelik vurgu ve kampanya başlıkları için.',
      en: 'A heavy poster-style fat face for one-word statements and campaign headlines.',
    },
  },
  {
    id: 'prata',
    family: 'Prata',
    classification: 'didone',
    roles: ['heading'],
    tones: ['luxurious', 'classic', 'calm'],
    note: {
      tr: 'Yumuşak terminalli, sakin bir didone; Kiril alfabesi gereken lüks markalar için iyi bir aday.',
      en: 'A calm didone with soft terminals; a strong choice for luxury brands that need Cyrillic.',
    },
    caveat: {
      tr: 'Latin Extended alt kümesi yok; Türkçe, Lehçe veya Çekçe metinlerde kullanılamaz.',
      en: 'No Latin Extended subset, so it cannot set Turkish, Polish or Czech text.',
    },
  },
  {
    id: 'yeseva-one',
    family: 'Yeseva One',
    classification: 'didone',
    roles: ['heading'],
    tones: ['luxurious', 'playful', 'warm'],
    note: {
      tr: 'Kıvrımlı, cilveli bir didone; güzellik, butik ve hediye markalarına samimi bir şıklık katar.',
      en: 'A curvy, flirtatious didone that brings friendly elegance to beauty, boutique and gift brands.',
    },
  },
  {
    id: 'noto-serif-display',
    family: 'Noto Serif Display',
    classification: 'didone',
    roles: ['heading'],
    tones: ['editorial', 'institutional', 'classic'],
    headingWeight: 500,
    note: {
      tr: 'Geniş dil desteğiyle ölçülü bir yüksek kontrast serif; çok dilli kurumsal sitelerde tutarlı kalır.',
      en: 'A measured high-contrast serif with very wide script support; stays consistent across multilingual sites.',
    },
  },

  // Classic garalde and transitional serifs
  {
    id: 'cormorant',
    family: 'Cormorant',
    classification: 'garalde',
    roles: ['heading'],
    tones: ['luxurious', 'classic', 'calm'],
    headingWeight: 600,
    note: {
      tr: 'Uzun çıkıntılı, zarif bir Garamond yorumu; büyük boyutta atölye ve el işi hissi verir.',
      en: 'An elegant Garamond interpretation with long extenders that feels crafted at large sizes.',
    },
    caveat: {
      tr: 'Çok ince çizgileri küçük boyutta kaybolur; gövde metni için uygun değildir.',
      en: 'Its fine strokes disappear at small sizes; not suitable for body text.',
    },
  },
  {
    id: 'eb-garamond',
    family: 'EB Garamond',
    classification: 'garalde',
    roles: ['heading', 'body'],
    tones: ['classic', 'institutional', 'calm'],
    headingWeight: 500,
    note: {
      tr: 'Klasik kitap Garamond’u; köklü, güven veren ve uzun okumaya dayanıklı bir ses.',
      en: 'The classic book Garamond: established, trustworthy and comfortable for long reading.',
    },
  },
  {
    id: 'libre-caslon-display',
    family: 'Libre Caslon Display',
    classification: 'transitional',
    roles: ['heading'],
    tones: ['classic', 'editorial', 'luxurious'],
    note: {
      tr: 'Caslon’un büyük puntoya göre çizilmiş hali; geleneksel ama ağır olmayan başlıklar kurar.',
      en: 'Caslon drawn for large sizes; builds traditional headlines without heaviness.',
    },
  },
  {
    id: 'libre-baskerville',
    family: 'Libre Baskerville',
    classification: 'transitional',
    roles: ['heading', 'body'],
    tones: ['classic', 'institutional', 'editorial'],
    headingWeight: 600,
    note: {
      tr: 'Ekran için genişletilmiş bir Baskerville; hukuk, yayıncılık ve eğitimde ciddi ama sıcak durur.',
      en: 'A Baskerville widened for screens; serious yet warm for law, publishing and education.',
    },
  },

  // Soft modern serifs
  {
    id: 'fraunces',
    family: 'Fraunces',
    classification: 'softSerif',
    roles: ['heading'],
    tones: ['warm', 'friendly', 'editorial', 'playful'],
    headingWeight: 600,
    note: {
      tr: '“Yumuşak” ekseniyle yuvarlak, iştah açıcı bir serif; yeme-içme ve zanaat markalarına karakter verir.',
      en: 'Its “soft” axis gives a rounded, appetising serif that adds character to food and craft brands.',
    },
  },
  {
    id: 'young-serif',
    family: 'Young Serif',
    classification: 'softSerif',
    roles: ['heading'],
    tones: ['warm', 'friendly', 'classic'],
    note: {
      tr: 'Tek ağırlıklı, sıcak ve biraz retro; mahalle dükkânı samimiyeti isteyen markalara uyar.',
      en: 'Single-weight, warm and slightly retro; fits brands that want neighbourhood-shop friendliness.',
    },
  },
  {
    id: 'lora',
    family: 'Lora',
    classification: 'softSerif',
    roles: ['heading', 'body'],
    tones: ['warm', 'classic', 'calm'],
    headingWeight: 600,
    note: {
      tr: 'Kaligrafik kökenli, orta kontrastlı bir serif; hem başlıkta hem gövdede dengeli ve sıcak.',
      en: 'A calligraphy-rooted, moderate-contrast serif; balanced and warm in headings and body alike.',
    },
  },

  // Editorial serifs
  {
    id: 'instrument-serif',
    family: 'Instrument Serif',
    classification: 'editorialSerif',
    roles: ['heading'],
    tones: ['editorial', 'modern', 'luxurious'],
    note: {
      tr: 'Dar, zarif bir başlık serifi; geniş boşluklu modern düzenlerde dergi kapağı etkisi yaratır.',
      en: 'A narrow, refined headline serif that reads like a magazine cover in airy modern layouts.',
    },
  },
  {
    id: 'gloock',
    family: 'Gloock',
    classification: 'editorialSerif',
    roles: ['heading'],
    tones: ['editorial', 'bold', 'modern'],
    note: {
      tr: 'Yoğun ve yüksek kontrastlı; az kelimeyle güçlü bir editoryal duruş kurar.',
      en: 'Dense and high-contrast; makes a strong editorial statement with few words.',
    },
  },
  {
    id: 'newsreader',
    family: 'Newsreader',
    classification: 'editorialSerif',
    roles: ['heading', 'body'],
    tones: ['editorial', 'calm', 'institutional'],
    headingWeight: 500,
    note: {
      tr: 'Gazete okuması için tasarlanmış optik boyutlu bir serif; haber ve içerik ağırlıklı siteler için.',
      en: 'An optical-size serif designed for news reading; made for content-heavy sites.',
    },
  },
  {
    id: 'spectral',
    family: 'Spectral',
    classification: 'editorialSerif',
    roles: ['heading', 'body'],
    tones: ['editorial', 'calm', 'luxurious'],
    headingWeight: 500,
    note: {
      tr: 'Ekran için çizilmiş ince ve zarif bir serif; uzun makalelerde sessiz bir lüks hissi bırakır.',
      en: 'A fine, elegant serif drawn for screens; leaves a quiet luxury in long articles.',
    },
  },

  // Inscriptional
  {
    id: 'cinzel',
    family: 'Cinzel',
    classification: 'inscriptional',
    roles: ['heading'],
    tones: ['luxurious', 'classic', 'institutional'],
    headingWeight: 500,
    note: {
      tr: 'Roma yazıtlarından gelen bir büyük harf yazısı; tören, otel ve şarap markalarında anıtsal durur.',
      en: 'A capitals face derived from Roman inscriptions; monumental for hotels, wine and ceremony.',
    },
    caveat: {
      tr: 'Küçük harfleri yoktur, küçük harfler küçük büyük harf olarak çizilir; uzun başlıklarda okunurluk düşer.',
      en: 'Has no true lowercase (it uses small capitals), so long headlines lose readability.',
    },
  },
  {
    id: 'marcellus',
    family: 'Marcellus',
    classification: 'inscriptional',
    roles: ['heading'],
    tones: ['classic', 'calm', 'luxurious'],
    note: {
      tr: 'Yazıt kökenli, hafif çıkıntılı bir yazı; spa, klinik ve butik otellerde dingin bir ciddiyet verir.',
      en: 'An inscriptional flared face; brings serene gravity to spas, clinics and boutique hotels.',
    },
  },
  {
    id: 'tenor-sans',
    family: 'Tenor Sans',
    classification: 'inscriptional',
    roles: ['heading'],
    tones: ['luxurious', 'calm', 'modern'],
    glyphIssues: ['tr'],
    note: {
      tr: 'Klasik oranlı, zarif bir hümanist sans; moda ve kozmetikte sade lüks için.',
      en: 'An elegant humanist sans with classical proportions; understated luxury for fashion and cosmetics.',
    },
    caveat: {
      tr: 'Türkçe için kırık: noktasız ı noktalı çiziliyor, Ş/ş çengel yerine virgül taşıyor.',
      en: 'Broken for Turkish: the dotless ı is drawn with a dot and Ş/ş carry a comma instead of a cedilla.',
    },
  },

  // Slab serifs
  {
    id: 'roboto-slab',
    family: 'Roboto Slab',
    classification: 'slab',
    roles: ['heading'],
    tones: ['technical', 'institutional', 'friendly'],
    headingWeight: 600,
    note: {
      tr: 'Mekanik ama dostça bir slab; teknik dokümantasyon ve kamu hizmeti sitelerinde net durur.',
      en: 'A mechanical yet friendly slab that stays crisp on documentation and public-service sites.',
    },
  },
  {
    id: 'zilla-slab',
    family: 'Zilla Slab',
    classification: 'slab',
    roles: ['heading'],
    tones: ['editorial', 'technical', 'bold'],
    headingWeight: 600,
    note: {
      tr: 'Daktilo ile gazete arasında bir slab; topluluk, açık kaynak ve yayın projelerine kişilik katar.',
      en: 'A slab between typewriter and newspaper; adds personality to community, open-source and publishing projects.',
    },
  },

  // Geometric sans
  {
    id: 'outfit',
    family: 'Outfit',
    classification: 'geometricSans',
    roles: ['heading', 'body'],
    tones: ['modern', 'friendly', 'technical'],
    headingWeight: 600,
    note: {
      tr: 'Temiz daireler üzerine kurulu, dengeli bir geometrik sans; ürün ve uygulama sitelerinde çağdaş durur.',
      en: 'A balanced geometric sans built on clean circles; contemporary for product and app sites.',
    },
  },
  {
    id: 'league-spartan',
    family: 'League Spartan',
    classification: 'geometricSans',
    roles: ['heading'],
    tones: ['bold', 'institutional', 'modern'],
    headingWeight: 700,
    note: {
      tr: 'Futura geleneğinde kalın bir geometrik; kalın ağırlıkta kararlı ve kurumsal manşetler kurar.',
      en: 'A bold geometric in the Futura tradition; heavy weights give decisive, institutional headlines.',
    },
  },
  {
    id: 'josefin-sans',
    family: 'Josefin Sans',
    classification: 'geometricSans',
    roles: ['heading'],
    tones: ['luxurious', 'calm', 'modern'],
    headingWeight: 600,
    note: {
      tr: 'Alçak x-yüksekliği ve vintage geometrisiyle zarif; düğün, iç mimarlık ve butik markalara uyar.',
      en: 'Elegant with a low x-height and vintage geometry; suits weddings, interiors and boutiques.',
    },
  },
  {
    id: 'sora',
    family: 'Sora',
    classification: 'geometricSans',
    roles: ['heading', 'body'],
    tones: ['technical', 'modern'],
    headingWeight: 600,
    note: {
      tr: 'Geniş ve teknolojik bir geometrik sans; yazılım, finans ve veri ürünlerinde güven verir.',
      en: 'A wide, technological geometric sans that inspires confidence for software, finance and data products.',
    },
  },
  {
    id: 'jost',
    family: 'Jost',
    classification: 'geometricSans',
    roles: ['heading', 'body'],
    tones: ['modern', 'classic', 'calm'],
    headingWeight: 500,
    note: {
      tr: 'Futura ruhlu, sakin bir geometrik; mimarlık ve tasarım stüdyolarında modernist bir çizgi verir.',
      en: 'A calm geometric with a Futura spirit; gives architecture and design studios a modernist line.',
    },
  },

  // Grotesks
  {
    id: 'space-grotesk',
    family: 'Space Grotesk',
    classification: 'grotesk',
    roles: ['heading'],
    tones: ['technical', 'modern', 'playful'],
    headingWeight: 600,
    note: {
      tr: 'Monospace kökenli tuhaf detaylara sahip bir grotesk; teknoloji ve yaratıcı ajanslara özgün bir ses verir.',
      en: 'A grotesk with quirky monospace-derived details; gives tech and creative agencies a distinct voice.',
    },
  },
  {
    id: 'archivo',
    family: 'Archivo',
    classification: 'grotesk',
    roles: ['heading', 'body'],
    tones: ['technical', 'bold', 'institutional'],
    headingWeight: 700,
    note: {
      tr: 'Genişlik ekseni olan sağlam bir grotesk; lojistik, endüstri ve spor markalarında güçlü durur.',
      en: 'A sturdy grotesk with a width axis; strong for logistics, industry and sports brands.',
    },
  },
  {
    id: 'familjen-grotesk',
    family: 'Familjen Grotesk',
    classification: 'grotesk',
    roles: ['heading'],
    tones: ['editorial', 'modern', 'friendly'],
    headingWeight: 600,
    note: {
      tr: 'İskandinav tasarım geleneğinden gelen, sıcak detaylı bir grotesk; kültür ve yayın projelerine uyar.',
      en: 'A grotesk with warm details from the Scandinavian tradition; fits culture and publishing projects.',
    },
  },
  {
    id: 'epilogue',
    family: 'Epilogue',
    classification: 'grotesk',
    roles: ['heading', 'body'],
    tones: ['editorial', 'modern', 'bold'],
    headingWeight: 700,
    note: {
      tr: 'Kalın ağırlıklarda dramatik, ince ağırlıklarda sakin; editoryal ajans sitelerinde çok yönlü.',
      en: 'Dramatic in heavy weights and calm in light ones; versatile for editorial agency sites.',
    },
  },
  {
    id: 'schibsted-grotesk',
    family: 'Schibsted Grotesk',
    classification: 'grotesk',
    roles: ['heading', 'body'],
    tones: ['editorial', 'institutional', 'modern'],
    headingWeight: 700,
    note: {
      tr: 'Bir medya grubu için tasarlanmış, net bir haber groteski; içerik platformlarında güvenilir durur.',
      en: 'A clear news grotesk designed for a media group; reliable on content platforms.',
    },
  },

  // Condensed sans
  {
    id: 'oswald',
    family: 'Oswald',
    classification: 'condensedSans',
    roles: ['heading'],
    tones: ['bold', 'technical'],
    headingWeight: 600,
    note: {
      tr: 'Klasik dar gotik; dar alanlarda yüksek sesle konuşan etkinlik ve spor başlıkları için.',
      en: 'A classic condensed gothic for event and sports headlines that speak loudly in tight spaces.',
    },
  },
  {
    id: 'big-shoulders',
    family: 'Big Shoulders',
    classification: 'condensedSans',
    roles: ['heading'],
    tones: ['bold', 'technical', 'institutional'],
    headingWeight: 800,
    note: {
      tr: 'Şehir tabelalarından ilham alan dar bir sans; ulaşım, kentsel ve endüstriyel projelere uyar.',
      en: 'A condensed sans inspired by city signage; fits transport, civic and industrial projects.',
    },
  },

  // Expressive display
  {
    id: 'syne',
    family: 'Syne',
    classification: 'display',
    roles: ['heading'],
    tones: ['playful', 'bold', 'modern'],
    headingWeight: 700,
    note: {
      tr: 'Ağırlık arttıkça genişleyen deneysel bir yazı; sanat, müzik ve festival sitelerinde iddialı.',
      en: 'An experimental face that widens as it gets heavier; assertive for art, music and festival sites.',
    },
  },
  {
    id: 'bricolage-grotesque',
    family: 'Bricolage Grotesque',
    classification: 'display',
    roles: ['heading'],
    tones: ['friendly', 'playful', 'modern'],
    headingWeight: 700,
    note: {
      tr: 'Mürekkep tuzaklı, sıcak bir display grotesk; samimi girişimler ve topluluk markaları için.',
      en: 'A warm display grotesk with ink traps; for approachable start-ups and community brands.',
    },
  },
  {
    id: 'unbounded',
    family: 'Unbounded',
    classification: 'display',
    roles: ['heading'],
    tones: ['bold', 'technical', 'playful'],
    headingWeight: 600,
    note: {
      tr: 'Geniş, yuvarlatılmış bir display; Web3, oyun ve gençlik markalarında enerjik durur.',
      en: 'A wide, rounded display face; energetic for gaming, crypto and youth brands.',
    },
  },
  {
    id: 'dela-gothic-one',
    family: 'Dela Gothic One',
    classification: 'display',
    roles: ['heading'],
    tones: ['bold', 'playful'],
    note: {
      tr: 'Ağır ve sıkışık bir gotik; poster dili isteyen kampanya ve etkinlik sayfaları için.',
      en: 'A heavy, compact gothic for campaign and event pages that want a poster voice.',
    },
  },
  {
    id: 'bagel-fat-one',
    family: 'Bagel Fat One',
    classification: 'display',
    roles: ['heading'],
    tones: ['playful', 'friendly', 'bold'],
    glyphIssues: ['tr'],
    note: {
      tr: 'Şişkin ve neşeli; çocuk, atıştırmalık ve oyuncak markalarında hemen gülümsetir.',
      en: 'Puffy and cheerful; makes children’s, snack and toy brands smile at once.',
    },
    caveat: {
      tr: 'Türkçe için eksik: İ, Ğ, ğ, Ş ve ş glifleri yok.',
      en: 'Incomplete for Turkish: İ, Ğ, ğ, Ş and ş are missing.',
    },
  },

  // Body: geometric
  {
    id: 'dm-sans',
    family: 'DM Sans',
    classification: 'geometricSans',
    roles: ['body'],
    tones: ['modern', 'friendly', 'calm'],
    note: {
      tr: 'Düşük kontrastlı, sakin bir geometrik; küçük boyutta temiz kalır ve hemen her başlıkla eşleşir.',
      en: 'A calm, low-contrast geometric that stays clean at small sizes and pairs with almost any heading.',
    },
  },
  {
    id: 'plus-jakarta-sans',
    family: 'Plus Jakarta Sans',
    classification: 'geometricSans',
    roles: ['body'],
    tones: ['modern', 'friendly', 'technical'],
    note: {
      tr: 'Biraz dar ve yüksek x-yükseklikli; arayüz metinlerinde modern, kampanya metinlerinde canlı.',
      en: 'Slightly narrow with a tall x-height; modern in interfaces and lively in marketing copy.',
    },
  },
  {
    id: 'figtree',
    family: 'Figtree',
    classification: 'geometricSans',
    roles: ['body'],
    tones: ['friendly', 'modern', 'warm'],
    note: {
      tr: 'Net ve dostça bir geometrik; hizmet ve sağlık sitelerinde sıcak ama profesyonel okunur.',
      en: 'A clear, friendly geometric; reads warm yet professional on service and health sites.',
    },
  },
  {
    id: 'albert-sans',
    family: 'Albert Sans',
    classification: 'geometricSans',
    roles: ['body'],
    tones: ['modern', 'calm', 'classic'],
    note: {
      tr: 'İskandinav modernizminden gelen ölçülü bir geometrik; mimarlık ve mobilya markalarına yakışır.',
      en: 'A restrained geometric from Scandinavian modernism; suits architecture and furniture brands.',
    },
  },
  {
    id: 'lexend',
    family: 'Lexend',
    classification: 'geometricSans',
    roles: ['body'],
    tones: ['friendly', 'calm', 'institutional'],
    note: {
      tr: 'Okuma akıcılığı araştırmalarıyla geliştirildi; eğitim ve kamu hizmetlerinde erişilebilir bir seçim.',
      en: 'Developed alongside reading-fluency research; an accessible choice for education and public services.',
    },
  },
  {
    id: 'rethink-sans',
    family: 'Rethink Sans',
    classification: 'geometricSans',
    roles: ['body'],
    tones: ['modern', 'technical', 'friendly'],
    note: {
      tr: 'Arayüz için çizilmiş açık formlu bir sans; SaaS panelleri ve ürün sayfalarında rahat okunur.',
      en: 'An open sans drawn for interfaces; comfortable on SaaS dashboards and product pages.',
    },
  },

  // Body: grotesk
  {
    id: 'manrope',
    family: 'Manrope',
    classification: 'grotesk',
    roles: ['body'],
    tones: ['technical', 'modern'],
    note: {
      tr: 'Yarı yoğunlaştırılmış, teknik bir grotesk; sayılar ve arayüz metinleri için çok düzenli.',
      en: 'A semi-condensed technical grotesk; very orderly for numbers and interface copy.',
    },
  },
  {
    id: 'red-hat-text',
    family: 'Red Hat Text',
    classification: 'grotesk',
    roles: ['body'],
    tones: ['technical', 'institutional', 'friendly'],
    note: {
      tr: 'Küçük boyut için açıklıkları genişletilmiş bir grotesk; dokümantasyon ve kurumsal içerikte net.',
      en: 'A grotesk with wider apertures for small sizes; crisp in documentation and corporate content.',
    },
  },
  {
    id: 'work-sans',
    family: 'Work Sans',
    classification: 'grotesk',
    roles: ['body'],
    tones: ['modern', 'editorial', 'friendly'],
    note: {
      tr: 'Erken grotesklerden esinlenen, hafif geniş bir sans; ajans ve portfolyo sitelerinde rahat.',
      en: 'A slightly wide sans inspired by early grotesques; relaxed on agency and portfolio sites.',
    },
  },
  {
    id: 'public-sans',
    family: 'Public Sans',
    classification: 'grotesk',
    roles: ['body'],
    tones: ['institutional', 'calm', 'technical'],
    note: {
      tr: 'Kamu dijital hizmetleri için tasarlanmış nötr bir sans; resmi ve güvenilir bir zemin kurar.',
      en: 'A neutral sans designed for government digital services; a formal, trustworthy base.',
    },
  },
  {
    id: 'ibm-plex-sans',
    family: 'IBM Plex Sans',
    classification: 'grotesk',
    roles: ['body'],
    tones: ['technical', 'institutional', 'modern'],
    note: {
      tr: 'Mühendislik karakterli bir grotesk; geniş dil desteğiyle teknik ve kurumsal ürünlerde güçlü.',
      en: 'An engineered grotesk with wide language coverage; strong for technical and corporate products.',
    },
  },
  {
    id: 'libre-franklin',
    family: 'Libre Franklin',
    classification: 'grotesk',
    roles: ['body'],
    tones: ['classic', 'editorial', 'institutional'],
    note: {
      tr: 'Franklin Gothic’in ekran yorumu; gazete geleneğini sade ve okunur bir gövdeye taşır.',
      en: 'A screen interpretation of Franklin Gothic; carries newspaper tradition into a plain, readable body.',
    },
  },
  {
    id: 'hanken-grotesk',
    family: 'Hanken Grotesk',
    classification: 'grotesk',
    roles: ['body'],
    tones: ['modern', 'calm', 'friendly'],
    note: {
      tr: 'Geometriye yakın, yumuşak bir grotesk; minimal markalarda soğuk görünmeden sade kalır.',
      en: 'A soft grotesk close to geometric; stays minimal for clean brands without feeling cold.',
    },
  },
  {
    id: 'instrument-sans',
    family: 'Instrument Sans',
    classification: 'grotesk',
    roles: ['body'],
    tones: ['modern', 'editorial', 'technical'],
    note: {
      tr: 'Hassas oranlı, çağdaş bir grotesk; Instrument Serif ile aynı aileden gelen uyumlu bir eş.',
      en: 'A precise, contemporary grotesk; a natural partner from the same family as Instrument Serif.',
    },
  },
  {
    id: 'onest',
    family: 'Onest',
    classification: 'grotesk',
    roles: ['body'],
    tones: ['modern', 'friendly', 'calm'],
    note: {
      tr: 'Latin ve Kiril’de aynı ritmi koruyan açık bir grotesk; çok dilli ürünler için.',
      en: 'An open grotesk that keeps the same rhythm in Latin and Cyrillic; built for multilingual products.',
    },
  },
  {
    id: 'golos-text',
    family: 'Golos Text',
    classification: 'grotesk',
    roles: ['body'],
    tones: ['institutional', 'calm', 'technical'],
    glyphIssues: ['tr'],
    note: {
      tr: 'Kamu hizmetleri için Kiril odaklı tasarlanmış nötr bir metin yazısı; formlarda çok net.',
      en: 'A neutral text face designed Cyrillic-first for public services; very clear in forms.',
    },
    caveat: {
      tr: 'Türkçe için kırık: Ğ ve ğ kısa işareti olmadan, G ve g gibi çiziliyor.',
      en: 'Broken for Turkish: Ğ and ğ are drawn without the breve, like G and g.',
    },
  },
  {
    id: 'karla',
    family: 'Karla',
    classification: 'grotesk',
    roles: ['body'],
    tones: ['friendly', 'editorial', 'playful'],
    note: {
      tr: 'Hafif tuhaf detaylı, samimi bir grotesk; bağımsız yayınlar ve kişisel bloglara kişilik katar.',
      en: 'A friendly grotesk with slightly quirky details; adds personality to independent publications and blogs.',
    },
  },

  // Body: humanist
  {
    id: 'source-sans-3',
    family: 'Source Sans 3',
    classification: 'humanistSans',
    roles: ['body'],
    tones: ['institutional', 'calm', 'technical'],
    note: {
      tr: 'Arayüz için yapılmış ilk açık kaynak hümanistlerden; kurumsal metinlerde yorulmadan okunur.',
      en: 'One of the first open-source humanists built for interfaces; tireless in corporate copy.',
    },
  },
  {
    id: 'fira-sans',
    family: 'Fira Sans',
    classification: 'humanistSans',
    roles: ['body'],
    tones: ['technical', 'friendly', 'institutional'],
    note: {
      tr: 'Mobil ekranlar için tasarlanmış bir hümanist; küçük boyutta ve çok dilli metinde güvenilir.',
      en: 'A humanist designed for mobile screens; reliable at small sizes and across languages.',
    },
  },
  {
    id: 'alegreya-sans',
    family: 'Alegreya Sans',
    classification: 'humanistSans',
    roles: ['body'],
    tones: ['warm', 'editorial', 'classic'],
    note: {
      tr: 'Kaligrafik ritimli, edebi bir hümanist; kültür, kitap ve müze sitelerinde sıcak durur.',
      en: 'A literary humanist with a calligraphic rhythm; warm for culture, book and museum sites.',
    },
  },
  {
    id: 'atkinson-hyperlegible-next',
    family: 'Atkinson Hyperlegible Next',
    classification: 'humanistSans',
    roles: ['body'],
    tones: ['institutional', 'calm', 'friendly'],
    note: {
      tr: 'Az gören okurlar için harf ayrımını önceleyen bir yazı; erişilebilirlik önemliyse ilk aday.',
      en: 'Prioritises letter distinction for low-vision readers; the first candidate when accessibility leads.',
    },
  },

  // Body: soft / rounded
  {
    id: 'nunito-sans',
    family: 'Nunito Sans',
    classification: 'softSans',
    roles: ['body'],
    tones: ['friendly', 'calm', 'warm'],
    note: {
      tr: 'Yumuşak hatlı ama ciddi kalabilen bir sans; sağlık ve aile hizmetlerinde güven verir.',
      en: 'Soft-edged yet able to stay serious; reassuring for health and family services.',
    },
  },
  {
    id: 'nunito',
    family: 'Nunito',
    classification: 'softSans',
    roles: ['body'],
    tones: ['friendly', 'playful', 'warm'],
    note: {
      tr: 'Yuvarlak uçlu, neşeli bir sans; çocuk, eğitim ve hobi markalarında sıcak ve davetkâr.',
      en: 'A cheerful sans with rounded terminals; warm and inviting for children’s, education and hobby brands.',
    },
  },
  {
    id: 'mulish',
    family: 'Mulish',
    classification: 'softSans',
    roles: ['body'],
    tones: ['calm', 'modern', 'friendly'],
    note: {
      tr: 'Minimal ve hafif bir sans; sade düzenlerde nefes alan, sakin bir gövde metni verir.',
      en: 'A minimal, light sans that gives airy layouts a calm, breathing body text.',
    },
  },
  {
    id: 'rubik',
    family: 'Rubik',
    classification: 'softSans',
    roles: ['body'],
    tones: ['playful', 'friendly', 'bold'],
    note: {
      tr: 'Hafif yuvarlatılmış köşeli bir sans; uygulama ve oyun arayüzlerinde enerjik ama okunur.',
      en: 'A sans with slightly rounded corners; energetic yet readable in app and game interfaces.',
    },
  },

  // Body: serif
  {
    id: 'literata',
    family: 'Literata',
    classification: 'editorialSerif',
    roles: ['body'],
    tones: ['editorial', 'calm', 'classic'],
    note: {
      tr: 'E-kitap okuyucuları için tasarlandı; uzun metinde ekranda yorulmadan okunan bir serif.',
      en: 'Designed for e-book readers; a serif that stays comfortable through long on-screen reading.',
    },
  },
  {
    id: 'source-serif-4',
    family: 'Source Serif 4',
    classification: 'transitional',
    roles: ['body'],
    tones: ['editorial', 'institutional', 'classic'],
    note: {
      tr: 'Optik boyutlu, geçiş dönemi bir serif; rapor, dergi ve kurumsal blog metinlerinde ciddi ve net.',
      en: 'An optical-size transitional serif; serious and clear for reports, magazines and corporate blogs.',
    },
  },
  {
    id: 'merriweather',
    family: 'Merriweather',
    classification: 'transitional',
    roles: ['body'],
    tones: ['classic', 'institutional', 'warm'],
    note: {
      tr: 'Ekran için kalın tutulmuş, sağlam bir serif; küçük boyutta ve düşük çözünürlükte bile okunur.',
      en: 'A sturdy serif kept heavy for screens; legible even at small sizes and low resolutions.',
    },
  },
  {
    id: 'crimson-pro',
    family: 'Crimson Pro',
    classification: 'garalde',
    roles: ['body'],
    tones: ['classic', 'luxurious', 'calm'],
    note: {
      tr: 'Eski üslup bir kitap serifi; lüks ve edebi markalarda gövde metnine zarafet katar.',
      en: 'An old-style book serif that adds grace to body text for luxury and literary brands.',
    },
  },
  {
    id: 'gelasio',
    family: 'Gelasio',
    classification: 'transitional',
    roles: ['body'],
    tones: ['classic', 'warm', 'institutional'],
    note: {
      tr: 'Georgia ile aynı ölçülerde bir serif; sistem fontundan geçişte düzen kaymasını azaltır.',
      en: 'A serif metric-compatible with Georgia, so switching from the system font barely shifts layout.',
    },
  },
  {
    id: 'alegreya',
    family: 'Alegreya',
    classification: 'garalde',
    roles: ['body'],
    tones: ['warm', 'editorial', 'classic'],
    note: {
      tr: 'Dinamik ritimli, edebi bir serif; anlatı ağırlıklı içeriklere canlı bir doku verir.',
      en: 'A literary serif with a dynamic rhythm that gives narrative content a lively texture.',
    },
  },

  // Ubiquitous defaults: listed so a project can mark them as "current".
  {
    id: 'inter',
    family: 'Inter',
    classification: 'grotesk',
    roles: ['body', 'heading'],
    tones: ['technical', 'modern'],
    ubiquitous: true,
    headingWeight: 700,
    note: {
      tr: 'Arayüzler için mükemmel çalışan nötr bir grotesk; o kadar yaygın ki markaya kendi sesini nadiren verir.',
      en: 'A neutral grotesk that excels in interfaces; so widespread that it rarely gives a brand its own voice.',
    },
  },
  {
    id: 'roboto',
    family: 'Roboto',
    classification: 'grotesk',
    roles: ['body'],
    tones: ['technical', 'modern'],
    ubiquitous: true,
    note: {
      tr: 'Android’in sistem yazısı; çok okunur ama sıradan bir varsayılan gibi algılanır.',
      en: 'Android’s system face; very legible but tends to read as a generic default.',
    },
  },
  {
    id: 'open-sans',
    family: 'Open Sans',
    classification: 'humanistSans',
    roles: ['body'],
    tones: ['friendly', 'institutional'],
    ubiquitous: true,
    note: {
      tr: 'Dostça ve geniş dil destekli bir hümanist; on yılı aşkın süredir web’in varsayılanlarından.',
      en: 'A friendly humanist with wide language support; one of the web’s defaults for over a decade.',
    },
  },
  {
    id: 'montserrat',
    family: 'Montserrat',
    classification: 'geometricSans',
    roles: ['heading', 'body'],
    tones: ['modern', 'bold'],
    ubiquitous: true,
    headingWeight: 700,
    note: {
      tr: 'Tabela kökenli geniş bir geometrik; tanıdık ve güçlü ama sayısız şablonda kullanılıyor.',
      en: 'A wide geometric rooted in signage; familiar and strong, but used in countless templates.',
    },
  },
  {
    id: 'poppins',
    family: 'Poppins',
    classification: 'geometricSans',
    roles: ['heading', 'body'],
    tones: ['friendly', 'modern'],
    ubiquitous: true,
    headingWeight: 600,
    note: {
      tr: 'Yuvarlak, dostça bir geometrik; çok popüler olduğundan ayırt edici olmaktan çok güvenli bir seçim.',
      en: 'A round, friendly geometric; so popular that it is a safe choice rather than a distinctive one.',
    },
  },
  {
    id: 'lato',
    family: 'Lato',
    classification: 'humanistSans',
    roles: ['body'],
    tones: ['calm', 'friendly'],
    ubiquitous: true,
    glyphIssues: ['tr'],
    caveat: {
      tr: 'Bu sürüm Türkçe için eksik: İ, Ğ, ğ, Ş ve ş glifleri yok.',
      en: 'This release is incomplete for Turkish: İ, Ğ, ğ, Ş and ş are missing.',
    },
    note: {
      tr: 'Yarı yuvarlak detaylı, sakin bir sans; değişken sürümü olmadığından ağırlıklar ayrı dosyalarla gelir.',
      en: 'A calm sans with semi-rounded details; it has no variable version, so each weight is a separate file.',
    },
  },
  ...moreFonts,
];

const byId = new Map(catalogue.map((font) => [font.id, font]));

export function getCatalogueFont(id: string): CatalogueFont | undefined {
  return byId.get(id);
}
