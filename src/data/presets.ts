import type { ProjectInput } from '../lib/project.ts';
import type { LocalizedText } from './types.ts';

export interface Preset {
  id: string;
  summary: LocalizedText;
  project: Omit<ProjectInput, 'candidates' | 'notes' | 'selection' | 'excludedFonts'>;
}

/** Fictional brands with original sample copy. Any resemblance to a real business is unintended. */
export const presets: readonly Preset[] = [
  {
    id: 'bakery',
    summary: {
      tr: 'Türkçe, sıcak ve samimi bir mahalle fırını.',
      en: 'A warm, friendly neighbourhood bakery in Turkish.',
    },
    project: {
      name: 'Ekşimaya Fırın',
      languages: ['tr'],
      tones: ['warm', 'friendly', 'classic'],
      theme: {
        colors: {
          background: '#fbf6ee',
          surface: '#ffffff',
          text: '#2b211a',
          muted: '#6b5c4f',
          accent: '#a54b25',
          accentText: '#ffffff',
          contrastBackground: '#2b211a',
          contrastText: '#fbf6ee',
          border: '#e8dccb',
        },
        radius: { control: 999, card: 16 },
        headingTransform: 'none',
      },
      currentFonts: { heading: 'playfair-display', body: 'open-sans' },
      content: {
        headline: 'Her sabah, uzun mayalanmış ekşi maya ekmeği.',
        intro:
          'Unumuzu Trakya’daki küçük değirmenlerden alıyor, hamurumuzu 36 saat dinlendiriyoruz. Fırından çıkan her somun gün içinde mahalleye dağılıyor.',
        primaryAction: 'Bugünün ekmekleri',
        secondaryAction: 'Sipariş ver',
        facts: [
          { value: '36 sa', label: 'mayalanma süresi' },
          { value: '07:00', label: 'ilk fırın' },
          { value: '14', label: 'çeşit ekmek' },
        ],
        services: [
          { title: 'Köy ekmeği', description: 'Tam buğday ve çavdar karışımı, kalın kabuklu, bir hafta taze kalır.' },
          { title: 'Simit ve poğaça', description: 'Sabah yediden itibaren sıcak; susamını kendimiz kavuruyoruz.' },
          { title: 'Toptan tedarik', description: 'Kafe ve restoranlara her gün saat dokuzdan önce teslimat.' },
        ],
        contrastHeading: 'Hangi ekmek size göre?',
        contrastQuestion: 'Kıtır kabuk mu seversiniz, yumuşak içi mi?',
        chips: ['Çavdarlı', 'Tam buğday', 'Kepekli', 'Zeytinli'],
        textHeading: 'Ekmeğin yavaş hali',
        textBody:
          'Ekşi maya, ekmeğe hem lezzet hem dayanıklılık veren canlı bir kültür. Bizim mayamız 2014’ten beri her gün besleniyor. Uzun mayalanma hamurun daha kolay sindirilmesine yardımcı oluyor ve katkı maddesine gerek bırakmıyor. Ekmeği kesmeden önce en az bir saat soğumaya bırakmanızı öneririz.',
        labelLine: 'Taş fırın · Katkısız · Günlük üretim',
        tableTitle: 'Çalışma saatleri',
        table: [
          { label: 'Hafta içi', value: '07:00–19:00' },
          { label: 'Cumartesi', value: '07:30–18:00' },
          { label: 'Pazar', value: '08:00–14:00' },
          { label: 'Resmî tatiller', value: '09:00–13:00' },
        ],
      },
    },
  },
  {
    id: 'law-firm',
    summary: {
      tr: 'Türkçe ve İngilizce, kurumsal ve sakin bir hukuk bürosu.',
      en: 'An institutional, calm law firm in Turkish and English.',
    },
    project: {
      name: 'Meridyen Hukuk',
      languages: ['tr', 'en'],
      tones: ['institutional', 'classic', 'calm'],
      theme: {
        colors: {
          background: '#f7f7f5',
          surface: '#ffffff',
          text: '#1c2230',
          muted: '#555d6d',
          accent: '#1f3a5f',
          accentText: '#ffffff',
          contrastBackground: '#1c2230',
          contrastText: '#f2f0ea',
          border: '#dddfe3',
        },
        radius: { control: 4, card: 6 },
        headingTransform: 'none',
      },
      currentFonts: { heading: 'eb-garamond', body: 'lato' },
      content: {
        headline: 'Şirketiniz büyürken hukuki zemini sağlam tutuyoruz.',
        intro:
          'Ticaret, iş ve veri koruma hukukunda danışmanlık veren bir ekibiz. Davadan önce sözleşmeyi, krizden önce süreci konuşmayı tercih ediyoruz.',
        primaryAction: 'Ön görüşme planla',
        secondaryAction: 'Uzmanlık alanları',
        facts: [
          { value: '18 yıl', label: 'deneyim' },
          { value: '240+', label: 'yıllık sözleşme incelemesi' },
          { value: '3', label: 'çalışma dili' },
        ],
        services: [
          { title: 'Ticaret hukuku', description: 'Şirket kuruluşu, pay devri ve ortaklık sözleşmeleri.' },
          { title: 'İş hukuku', description: 'İşe alım, fesih süreçleri ve iç yönetmelikler.' },
          { title: 'Kişisel verilerin korunması', description: 'KVKK ve GDPR uyum programları, aydınlatma metinleri.' },
        ],
        contrastHeading: 'Sorunuzu kısaca anlatın',
        contrastQuestion: 'Hangi konuda destek arıyorsunuz?',
        chips: ['Sözleşme', 'İşe alım', 'Veri ihlali', 'Tahsilat'],
        textHeading: 'Çalışma biçimimiz',
        textBody:
          'Her dosyaya bir sorumlu avukat atıyor ve ilk hafta içinde yazılı bir yol haritası paylaşıyoruz. Ücretlendirmeyi işe başlamadan önce netleştiriyoruz. Görüşmeleri yüz yüze ya da çevrim içi yapabiliyoruz. Bu sayfadaki bilgiler genel niteliktedir ve hukuki görüş yerine geçmez.',
        labelLine: 'İstanbul · Ankara · Çevrim içi',
        tableTitle: 'Ofis saatleri',
        table: [
          { label: 'Pazartesi–Cuma', value: '09:00–18:00' },
          { label: 'Cumartesi', value: 'Randevu ile' },
          { label: 'Acil hat', value: '7/24' },
          { label: 'Ön görüşme', value: '30 dk' },
        ],
      },
    },
  },
  {
    id: 'architecture',
    summary: {
      tr: 'Almanca, editoryal ve sade bir mimarlık stüdyosu.',
      en: 'A pared-back, editorial architecture studio in German.',
    },
    project: {
      name: 'Nordlicht Studio',
      languages: ['de', 'en'],
      tones: ['modern', 'editorial', 'calm'],
      theme: {
        colors: {
          background: '#ffffff',
          surface: '#f3f2ef',
          text: '#111111',
          muted: '#5c5c5c',
          accent: '#111111',
          accentText: '#ffffff',
          contrastBackground: '#1e2a26',
          contrastText: '#edebe6',
          border: '#e2e0db',
        },
        radius: { control: 0, card: 0 },
        headingTransform: 'none',
      },
      currentFonts: { heading: 'inter', body: 'inter' },
      content: {
        headline: 'Räume, die mit dem Licht arbeiten.',
        intro:
          'Wir planen Wohnhäuser und kleine öffentliche Bauten im Norden Deutschlands – mit regionalen Materialien und viel Tageslicht.',
        primaryAction: 'Projekte ansehen',
        secondaryAction: 'Kontakt',
        facts: [
          { value: '42', label: 'realisierte Bauten' },
          { value: '2009', label: 'gegründet' },
          { value: '11', label: 'Menschen im Team' },
        ],
        services: [
          { title: 'Wohnbau', description: 'Einfamilienhäuser und kleine Mehrfamilienhäuser aus Holz und Ziegel.' },
          { title: 'Umbau', description: 'Bestandsgebäude energetisch sanieren, ohne ihren Charakter zu verlieren.' },
          { title: 'Öffentliche Bauten', description: 'Kitas, Bibliotheken und Gemeindehäuser mit kurzen Wegen.' },
        ],
        contrastHeading: 'Woran arbeiten Sie gerade?',
        contrastQuestion: 'Erzählen Sie uns von Ihrem Grundstück.',
        chips: ['Neubau', 'Sanierung', 'Wettbewerb', 'Beratung'],
        textHeading: 'Über unsere Arbeitsweise',
        textBody:
          'Jedes Projekt beginnt mit einem Spaziergang über das Grundstück. Wir beobachten, wie das Licht im Laufe des Tages wandert, und richten die Räume danach aus. Modelle aus Pappe und Holz begleiten uns bis zur Ausführungsplanung. Am Ende soll ein Haus entstehen, das sich auch nach zwanzig Jahren noch selbstverständlich anfühlt.',
        labelLine: 'Hamburg · Kiel · Lübeck',
        tableTitle: 'Bürozeiten',
        table: [
          { label: 'Montag–Donnerstag', value: '9–18 Uhr' },
          { label: 'Freitag', value: '9–15 Uhr' },
          { label: 'Baustellentermine', value: 'nach Absprache' },
          { label: 'Erstberatung', value: '45 Min.' },
        ],
      },
    },
  },
  {
    id: 'saas',
    summary: {
      tr: 'İngilizce, teknik ve modern bir veri ürünü.',
      en: 'A technical, modern data product in English.',
    },
    project: {
      name: 'Tidepool Analytics',
      languages: ['en'],
      tones: ['technical', 'modern', 'friendly'],
      theme: {
        colors: {
          background: '#f8fafc',
          surface: '#ffffff',
          text: '#0f172a',
          muted: '#475569',
          accent: '#1d4ed8',
          accentText: '#ffffff',
          contrastBackground: '#0f172a',
          contrastText: '#e2e8f0',
          border: '#e2e8f0',
        },
        radius: { control: 10, card: 14 },
        headingTransform: 'none',
      },
      currentFonts: { heading: 'inter', body: 'inter' },
      content: {
        headline: 'See where your product data actually flows.',
        intro:
          'Tidepool maps every event from your app to the dashboards that use it, so broken tracking shows up before the quarterly review does.',
        primaryAction: 'Start a free trial',
        secondaryAction: 'Read the docs',
        facts: [
          { value: '12 ms', label: 'median query time' },
          { value: '99.95%', label: 'uptime last year' },
          { value: '40+', label: 'native integrations' },
        ],
        services: [
          { title: 'Event lineage', description: 'Trace any metric back to the line of code that emits it.' },
          { title: 'Schema alerts', description: 'Get notified when a release renames or drops a property.' },
          { title: 'Warehouse sync', description: 'Mirror cleaned events to your own warehouse every five minutes.' },
        ],
        contrastHeading: 'Ask your data a question',
        contrastQuestion: 'Which events stopped firing after Tuesday’s release?',
        chips: ['Funnels', 'Retention', 'Revenue', 'Errors'],
        textHeading: 'Built for teams who ship every week',
        textBody:
          'Tracking plans drift the moment a product starts moving fast. Tidepool reads your source code and your warehouse at the same time and highlights where they disagree. Engineers see the exact commit, analysts see which charts are affected, and nobody has to maintain a spreadsheet. Setup takes about an afternoon.',
        labelLine: 'EU data residency · Single sign-on · Audit log',
        tableTitle: 'Plans at a glance',
        table: [
          { label: 'Starter', value: '$0 / month' },
          { label: 'Team', value: '$49 / seat' },
          { label: 'Events included', value: '10 M / month' },
          { label: 'Data retention', value: '13 months' },
        ],
      },
    },
  },
  {
    id: 'jewellery',
    summary: {
      tr: 'Fransızca, lüks ve klasik bir kuyumcu atölyesi.',
      en: 'A luxurious, classic jewellery workshop in French.',
    },
    project: {
      name: 'Maison Ondine',
      languages: ['fr'],
      tones: ['luxurious', 'classic', 'calm'],
      theme: {
        colors: {
          background: '#faf7f2',
          surface: '#ffffff',
          text: '#1f1b16',
          muted: '#6a6156',
          accent: '#6f5428',
          accentText: '#ffffff',
          contrastBackground: '#1f1b16',
          contrastText: '#f3ede3',
          border: '#e9e1d3',
        },
        radius: { control: 0, card: 2 },
        headingTransform: 'none',
      },
      currentFonts: { heading: 'cormorant', body: 'montserrat' },
      content: {
        headline: 'Des bijoux façonnés à la main, pièce par pièce.',
        intro:
          'Notre atelier lyonnais travaille l’or recyclé et des pierres dont l’origine est tracée. Chaque création est signée et numérotée.',
        primaryAction: 'Découvrir la collection',
        secondaryAction: 'Prendre rendez-vous',
        facts: [
          { value: '18 ct', label: 'or recyclé' },
          { value: '1962', label: 'fondation de l’atelier' },
          { value: '4', label: 'artisans joailliers' },
        ],
        services: [
          {
            title: 'Bagues de fiançailles',
            description: 'Dessinées avec vous, livrées avec un certificat d’origine des pierres.',
          },
          {
            title: 'Créations sur mesure',
            description: 'Transformez un bijou de famille en une pièce que vous porterez chaque jour.',
          },
          {
            title: 'Entretien et réparation',
            description: 'Nettoyage, polissage et mise à taille offerts la première année.',
          },
        ],
        contrastHeading: 'Une pièce pour quelle occasion ?',
        contrastQuestion: 'Racontez-nous l’histoire derrière votre projet.',
        chips: ['Fiançailles', 'Mariage', 'Naissance', 'Anniversaire'],
        textHeading: 'Le temps de l’atelier',
        textBody:
          'Une bague demande entre trois et six semaines de travail. Nous commençons par un dessin à la main, puis une maquette en cire que vous pouvez essayer. Le métal est ensuite coulé, ajusté et poli à l’atelier. Nous préférons prendre ce temps plutôt que promettre des délais que nous ne pourrions pas tenir.',
        labelLine: 'Lyon · Sur rendez-vous · Depuis 1962',
        tableTitle: 'Horaires de la boutique',
        table: [
          { label: 'Mardi – vendredi', value: '10 h – 19 h' },
          { label: 'Samedi', value: '10 h – 18 h' },
          { label: 'Dimanche et lundi', value: 'Fermé' },
          { label: 'Rendez-vous privé', value: 'Sur demande' },
        ],
      },
    },
  },
  {
    id: 'kids-workshop',
    summary: {
      tr: 'Türkçe, oyunbaz ve enerjik bir çocuk bilim atölyesi.',
      en: 'A playful, energetic science workshop for children in Turkish.',
    },
    project: {
      name: 'Bilmece Atölyesi',
      languages: ['tr'],
      tones: ['playful', 'friendly', 'bold'],
      theme: {
        colors: {
          background: '#fff8e7',
          surface: '#ffffff',
          text: '#1d1a3a',
          muted: '#55527a',
          accent: '#c2410c',
          accentText: '#ffffff',
          contrastBackground: '#2d2a6e',
          contrastText: '#fff8e7',
          border: '#f1e3c2',
        },
        radius: { control: 999, card: 24 },
        headingTransform: 'none',
      },
      currentFonts: { heading: 'poppins', body: 'poppins' },
      content: {
        headline: 'Merak eden çocuklar için hafta sonu bilim atölyeleri.',
        intro:
          '7–12 yaş arası çocuklar küçük gruplar halinde deney yapıyor, robot kuruyor ve gökyüzünü gözlemliyor. Ebeveynler de son yarım saatte bize katılabiliyor.',
        primaryAction: 'Atölyeleri gör',
        secondaryAction: 'Deneme dersi',
        facts: [
          { value: '8', label: 'çocuk / grup' },
          { value: '6', label: 'farklı atölye' },
          { value: '2 saat', label: 'her oturum' },
        ],
        services: [
          { title: 'Mutfak kimyası', description: 'Evdeki malzemelerle köpüren, renk değiştiren deneyler.' },
          { title: 'Robotik', description: 'Basit devrelerle hareket eden küçük robotlar tasarlıyoruz.' },
          { title: 'Gökyüzü gözlemi', description: 'Teleskopla Ay’ın kraterlerini ve Satürn’ün halkalarını izliyoruz.' },
        ],
        contrastHeading: 'Çocuğunuz neyi merak ediyor?',
        contrastQuestion: 'En son hangi soruyu sordu?',
        chips: ['Uzay', 'Hayvanlar', 'Makineler', 'Doğa'],
        textHeading: 'Neden küçük gruplar?',
        textBody:
          'Her çocuğun deneyi kendi eliyle yapmasını istiyoruz. Bu yüzden bir grupta en fazla sekiz çocuk ve iki eğitmen oluyor. Atölye sonunda her çocuk yaptığı deneyin kısa bir notunu eve götürüyor. Güvenlik gözlüğü, önlük ve tüm malzemeler bizden.',
        labelLine: '7–12 yaş · Küçük gruplar · Hafta sonu',
        tableTitle: 'Program',
        table: [
          { label: 'Cumartesi sabah', value: '10:00–12:00' },
          { label: 'Cumartesi öğleden sonra', value: '13:30–15:30' },
          { label: 'Pazar sabah', value: '10:00–12:00' },
          { label: 'Yaz okulu', value: 'Temmuz–Ağustos' },
        ],
      },
    },
  },
];

export function getPreset(id: string): Preset | undefined {
  return presets.find((preset) => preset.id === id);
}
