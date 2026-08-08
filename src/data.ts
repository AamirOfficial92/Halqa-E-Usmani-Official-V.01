/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Post, PostSplashScreenItem, Category, PDFBook, VideoItem, AudioItem, GalleryAlbum, GalleryImage, FeedbackItem, AppNotification, SliderItem, ContactInfo, SocialLinks, DonationInitiative, DonationRecord, InfoPage, IslamicEvent, DuaItem, Branch, DayDatasetRecord, AppUser, SpiritualSlip, ModSettings, AuditLog, MakhzanCategory, MakhzanPost, SpiritualPersonality, HadeesItem } from './types';

export const initialCategories: Category[] = [
  { id: 'quran', name: 'Quran Kareem', nameUrdu: 'قرآن کریم', icon: 'BookOpen', description: 'Holy Quran and translations / تفسیر و تراجم' },
  { id: 'hadith', name: 'Hadith', nameUrdu: 'احادیث مبارکہ', icon: 'FileText', description: 'Sayings of Holy Prophet (S.A.W) / ارشاداتِ نبوی ﷺ' },
  { id: 'events', name: 'Islamic Events', nameUrdu: 'اسلامی واقعات', icon: 'Milestone', description: 'Historic Islamic occurrences / تاریخ ساز اسلامی واقعات' },
  { id: 'biographies', name: 'Biographies', nameUrdu: 'سوانح حیات', icon: 'UserCheck', description: 'Biographies of pious figures / سوانح حیات' },
  { id: 'awliya', name: 'Sufi Saints (Awliya)', nameUrdu: 'اولیائے کرام', icon: 'HeartHandshake', description: 'Life of Sufi Saints / اولیائے کرام کی تعلیمات' },
  { id: 'shrines', name: 'Sacred Shrines', nameUrdu: 'مزارات شریف', icon: 'Home', description: 'Information about shrines / مزاراتِ اولیاء' },
  { id: 'caliphs', name: 'Khulafa-e-Rashideen', nameUrdu: 'خلفائے راشدین', icon: 'Users', description: 'The Rightly Guided Caliphs / خلفائے راشدین کی سیرت' },
  { id: 'sahaba', name: 'Sahaba-e-Karam', nameUrdu: 'صحابہ کرام', icon: 'Award', description: 'Companions of Prophet (S.A.W) / صحابہ کرام کی قربانیاں' },
  { id: 'ahl-e-bait', name: 'Ahl-e-Bait Athar', nameUrdu: 'اہل بیت اطہار', icon: 'Sparkles', description: 'Noble family of the Prophet (S.A.W) / اہل بیتِ اطہار کا مقام' },
  { id: 'tabieen', name: 'Tabieen', nameUrdu: 'تابعین عظام', icon: 'Bookmark', description: 'The followers of Sahaba / تابعین عظام' },
  { id: 'taba-tabieen', name: 'Taba-Tabieen', nameUrdu: 'تبع تابعین', icon: 'FolderHeart', description: 'Followers of the Tabieen / تبع تابعین' },
  { id: 'articles', name: 'Islamic Articles', nameUrdu: 'اسلامی مضامین', icon: 'Notebook', description: 'Scholarly articles and essays / اسلامی علمی مضامین' },
  { id: 'wazaif', name: 'Wazaif', nameUrdu: 'وظائف و عملیات', icon: 'Flame', description: 'Authentic wazaif and spiritual cures / وظائف و روحانی علاج' },
  { id: 'duas', name: 'Duas', nameUrdu: 'مسنون دعائیں', icon: 'Sun', description: 'Daily supplications and prayers / مسنون دعائیں' },
  { id: 'naats', name: 'Naats', nameUrdu: 'نعتیں و منقبت', icon: 'Music', description: 'Praise of Prophet (S.A.W) & Awliya / مدحتِ رسول ﷺ' },
  { id: 'programs', name: 'Programs', nameUrdu: 'روحانی پروگرام', icon: 'CalendarDays', description: 'Upcoming spiritual events / محافل و اجتماعات' },
  { id: 'announcements', name: 'Announcements', nameUrdu: 'اہم اعلانات', icon: 'BellRing', description: 'Official announcements / حلقہ عثمانیہ کے اعلانات' },
  { id: 'qa', name: 'Questions & Answers', nameUrdu: 'سوال و جواب', icon: 'HelpCircle', description: 'Shariah Q&A and fatwas / شرعی سوال و جواب' }
];

export const initialPosts: Post[] = [
  {
    id: 'post-1',
    title: 'Biography of Hazrat Usman-e-Ghani (R.A)',
    titleUrdu: 'سوانح حیات حضرت عثمان غنی رضی اللہ عنہ',
    category: 'caliphs',
    shortDescription: 'The Third Caliph of Islam, famous for his outstanding generosity, modesty, and compiling the Quran.',
    shortDescriptionUrdu: 'خلیفہ سوم، پیکرِ شرم و حیا، جامع القرآن حضرت سیدنا عثمان غنی رضی اللہ عنہ کے فضائل و مناقب اور سوانح حیات۔',
    completeArticle: 'Hazrat Usman ibn Affan (R.A) was the third Caliph of Islam. He belonged to the noble family of Banu Umayya. He was known as "Zun-Noorayn" because he was married to two daughters of Prophet Muhammad (S.A.W) consecutively. He spent his immense wealth generously in the path of Allah, buying wells for Muslims, financing military expeditions, and expanding mosques. Under his leadership, the Islamic state expanded to North Africa, Central Asia, and Cyprus. He was martyred while reading the Holy Quran in his house.',
    completeArticleUrdu: 'حضرت عثمان غنی رضی اللہ عنہ اسلام کے تیسرے خلیفہ راشد ہیں۔ آپ کا تعلق قریش کے معزز قبیلے بنو امیہ سے تھا۔ رسول اللہ ﷺ نے یکے بعد دیگرے اپنی دو بیٹیاں آپ کے نکاح میں دیں، اسی وجہ سے آپ کا لقب "ذوالنورین" (دو نوروں والے) ہے۔ آپ انتہائی غنی اور شرم و حیا کے پیکر تھے۔ غزوہ تبوک کے موقع پر آپ نے اسلامی لشکر کے لیے خطیر مالی امداد فراہم کی۔ آپ ہی کے دورِ خلافت میں اسلامی سلطنت کا دائرہ کار افریقہ، وسطی ایشیا اور بحیرہ روم کے جزائر تک پھیل گیا۔ آپ کو اپنے گھر میں قرآن پاک تلاوت کرتے ہوئے انتہائی بے دردی سے شہید کیا گیا۔',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600'
    ],
    pdfUrl: 'https://www.orimi.com/pdf-test.pdf',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: ['Usman Ghani', 'Caliphs', 'History', 'Zun Noorayn'],
    city: 'Medina',
    country: 'Saudi Arabia',
    scholarName: 'Allama Muhammad Asif Usmani',
    publishDate: '2026-07-15',
    isDraft: false,
    views: 1240,
    bookmarksCount: 45
  },
  {
    id: 'post-2',
    title: 'Teachings of Hazrat Data Ganj Bakhsh Ali Hujwiri (R.A)',
    titleUrdu: 'حضرت داتا گنج بخش علی ہجویریؒ کی تعلیمات',
    category: 'awliya',
    shortDescription: 'The foundational principles of spiritual purification from the masterclass book "Kashf-ul-Mahjub".',
    shortDescriptionUrdu: 'کتاب "کشف المحجوب" کے مستند تصوف کے اصول اور لاہور کے مشہور ولی کامل حضرت داتا گنج بخش علی ہجویری رحمۃ اللہ علیہ کا تعارف۔',
    completeArticle: 'Hazrat Ali ibn Usman al-Hujwiri, widely known as Data Ganj Bakhsh, was an 11th-century Persian Sufi saint and scholar. He migrated to Lahore (Pakistan) and contributed immensely to the spread of Islam in South Asia. His masterpiece "Kashf al-Mahjub" (Unveiling of the Veiled) is the oldest Persian treatise on Sufism. His teachings emphasize strict adherence to the Shariah, humility, self-purification, and divine love. His shrine in Lahore remains a hub of spiritual solace for millions of seekers.',
    completeArticleUrdu: 'حضرت سید علی ہجویری المعروف داتا گنج بخش رحمۃ اللہ علیہ برصغیر کے عظیم صوفی بزرگ، عالم دین اور مصنف ہیں۔ آپ غزنی سے ہجرت فرما کر لاہور تشریف لائے اور یہاں ہزاروں نفوس کو دائرہ اسلام میں داخل کیا۔ آپ کی تصنیف لطیف "کشف المحجوب" تصوف کی دنیا میں کلیدی حیثیت رکھتی ہے جس میں معرفتِ الٰہی، تصفیہ قلب، اور شریعت پر سختی سے عمل پیرا ہونے کا درس دیا گیا ہے۔ آپ کا مزار اقدس مرکزِ فیضانِ مدینہ و لاہور ہے جہاں شب و روز فیوض و برکات کا نزول ہوتا ہے۔',
    coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600'
    ],
    pdfUrl: 'https://www.orimi.com/pdf-test.pdf',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    videoUrl: 'https://www.youtube.com/watch?v=g833MdfyS74',
    tags: ['Data Sahib', 'Sufism', 'Kashf ul Mahjub', 'Lahore'],
    city: 'Lahore',
    country: 'Pakistan',
    shrineName: 'Darbar Hazrat Data Ganj Bakhsh Ali Hujwiri',
    scholarName: 'Mufti Faiz-ul-Hassan Usmani',
    publishDate: '2026-07-18',
    isDraft: false,
    views: 2310,
    bookmarksCount: 98
  },
  {
    id: 'post-3',
    title: 'The Great Victory of the Battle of Badr',
    titleUrdu: 'غزوہ بدر کا معرکہ اور عظیم اسلامی فتح',
    category: 'events',
    shortDescription: 'How 313 ill-equipped companions defeated a fully armed force of 1000 pagan Quraysh with Divine help.',
    shortDescriptionUrdu: 'رمضان المبارک کے مقدس مہینے میں لڑا جانے والا پہلا فیصلہ کن معرکہ، جس میں الٰہی نصرت کے ذریعے حق سرخرو ہوا۔',
    completeArticle: 'The Battle of Badr, fought on the 17th of Ramadan, 2 A.H., was the most significant battle in Islamic history. The Holy Prophet Muhammad (S.A.W) led a tiny army of 313 companions against a well-equipped Quraysh force numbering over 1000. Despite being physically outnumbered, the Muslims were spiritually elevated and aided by angels sent by Allah. The victory proved to the world that Islam is a formidable power and established the sovereignty of the Medina state.',
    completeArticleUrdu: 'غزوہ بدر حق و باطل کا پہلا اور سب سے اہم معرکہ تھا جو 17 رمضان المبارک 2 ہجری کو میدانِ بدر میں پیش آیا۔ مسلمانوں کی کل تعداد صرف 313 تھی جن کے پاس جنگی ساز و سامان نہ ہونے کے برابر تھا جبکہ مشرکینِ مکہ کا لشکر ایک ہزار جنگجوؤں اور مکمل ہتھیاروں سے لیس تھا۔ اللہ کے پیارے رسول ﷺ نے رات بھر رو رو کر رب العزت کی بارگاہ میں نصرتِ الٰہی کی دعا مانگی۔ نتیجے کے طور پر، فرشتوں کے ذریعے تائید حاصل ہوئی، مشرکین کے سردار مارے گئے اور مسلمانوں کو تاریخی فتح حاصل ہوئی۔',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    images: [],
    tags: ['Badr', 'Ghazwa Badr', 'Islamic History', 'Ramadan'],
    city: 'Badr',
    country: 'Saudi Arabia',
    publishDate: '2026-07-20',
    isDraft: false,
    views: 840,
    bookmarksCount: 30
  }
];

export const initialPDFs: PDFBook[] = [
  {
    id: 'pdf-1',
    title: 'Tazkirat-ul-Awliya (Hazrat Fariddudin Attar)',
    titleUrdu: 'تذکرۃ الاولیاء (مترجم اردو)',
    author: 'Hazrat Fariduddin Attar (R.A)',
    authorUrdu: 'حضرت فرید الدین عطار رحمۃ اللہ علیہ',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    pdfUrl: 'https://pdfobject.com/pdf/sample.pdf',
    size: '14.2 MB',
    pages: 420,
    description: 'A masterpiece compiling the biographical sketches and spiritual aphorisms of early Sufi saints and mystics.',
    descriptionUrdu: 'صوفیائے کرام، زاہدین اور سلفِ صالحین کے ایمان افروز حالاتِ زندگی، نصیحت آموز فرمودات اور علمی و روحانی تذکرہ پر مبنی بے مثال تصنیف۔',
    views: 450,
    downloadsCount: 125
  },
  {
    id: 'pdf-2',
    title: 'Kashf-ul-Mahjub (The Unveiling)',
    titleUrdu: 'کشف المحجوب (اردو ترجمہ)',
    author: 'Hazrat Data Ganj Bakhsh Ali Hujwiri (R.A)',
    authorUrdu: 'حضرت داتا گنج بخش علی ہجویری رحمۃ اللہ علیہ',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    pdfUrl: 'https://www.orimi.com/pdf-test.pdf',
    size: '8.5 MB',
    pages: 310,
    description: 'The ancient Persian treatise translated to Urdu, detailing the path of genuine Tasawwuf and Shariah integration.',
    descriptionUrdu: 'تصوف کا قدیم ترین اور مستند ترین دستور العمل، جس میں طریقت و شریعت کے باہمی تعلق، اور سالک کے مقامات و احوال کا تذکرہ ہے۔',
    views: 920,
    downloadsCount: 320
  },
  {
    id: 'pdf-3',
    title: 'Fatwa-e-Usmania Volume 1',
    titleUrdu: 'فتویٰ عثمانیہ - جلد اول',
    author: 'Mufti Muhammad Shafi Usmani',
    authorUrdu: 'مفتی اعظم محمد شفیع عثمانی',
    coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600',
    pdfUrl: 'https://pdfobject.com/pdf/sample.pdf',
    size: '22.1 MB',
    pages: 650,
    description: 'Detailed Shariah answers, rulings, and guidelines regarding daily life, worship, and contracts.',
    descriptionUrdu: 'روزمرہ عبادات، معاملات، عقائد اور سماجی مسائل سے متعلق شرعی احکام، تحقیقی مقالات اور مستند فتاویٰ کا مجموعہ۔',
    views: 180,
    downloadsCount: 54
  }
];

export const initialVideos: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'The Greatness of Peer-e-Kamil (Sufism)',
    titleUrdu: 'عظمتِ پیرِ کامل اور بیعت کی ضرورت',
    youtubeId: 'W8v7Ie9NbeE', // Example YouTube ID
    category: 'bayan',
    duration: '45:12',
    speaker: 'Allama Muhammad Asif Usmani',
    publishDate: '2026-07-10'
  },
  {
    id: 'vid-2',
    title: 'Beautiful Naat Sharif - Madine Ka Safar',
    titleUrdu: 'پیاری نعت شریف - مدینے کا سفر',
    youtubeId: '3u-e7mB6mms',
    category: 'naat',
    duration: '06:30',
    speaker: 'Al-Haaj Qari Shaukat Usmani',
    publishDate: '2026-07-16'
  },
  {
    id: 'vid-3',
    title: 'Shariah ruling on Digital Transactions',
    titleUrdu: 'ڈیجیٹل خرید و فروخت پر شرعی احکامات',
    youtubeId: '6_pXz8D32yM',
    category: 'bayan',
    duration: '22:15',
    speaker: 'Mufti Faiz-ul-Hassan Usmani',
    publishDate: '2026-07-19'
  }
];

export const initialAudios: AudioItem[] = [
  {
    id: 'aud-1',
    title: 'Zikr-e-Illahi Ki Barkaat',
    titleUrdu: 'ذکرِ الٰہی کی برکات و کیفیات',
    artist: 'Hazrat Allama Muhammad Asif Usmani',
    artistUrdu: 'حضرت علامہ محمد عاصم عثمانی',
    category: 'dhikr',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '24:18',
    size: '11.5 MB',
    publishDate: '2026-07-12'
  },
  {
    id: 'aud-2',
    title: 'Heartfelt Naat - Huzoor Meri To Sari Bahar',
    titleUrdu: 'حضورؐ میری تو ساری بہار آپ سے ہے',
    artist: 'Hafiz Amir Usmani Qadri',
    artistUrdu: 'حافظ عامر عثمانی قادری',
    category: 'naat',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: '07:45',
    size: '3.6 MB',
    publishDate: '2026-07-15'
  },
  {
    id: 'aud-3',
    title: 'The Status of Companions of the Prophet (S.A.W)',
    titleUrdu: 'صحابہ کرام رضی اللہ عنہم کا بلند مقام',
    artist: 'Mufti Faiz-ul-Hassan Usmani',
    artistUrdu: 'مفتی فیض الحسن عثمانی',
    category: 'bayan',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    duration: '52:40',
    size: '24.1 MB',
    publishDate: '2026-07-18'
  }
];

export const initialAlbums: GalleryAlbum[] = [
  { id: 'alb-1', name: 'Annual Urs Mubarak 2026', nameUrdu: 'سالانہ عرس مبارک ۲۰۲۶', coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600', type: 'events' },
  { id: 'alb-2', name: 'Islamic Calligraphy Art', nameUrdu: 'اسلامی خطاطی فن پارے', coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600', type: 'posters' },
  { id: 'alb-3', name: 'Halqa Weekly Dhikr Assembly', nameUrdu: 'ہفتہ وار محفلِ ذکر', coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600', type: 'photos' }
];

export const initialGalleryImages: GalleryImage[] = [
  { id: 'img-1', albumId: 'alb-1', title: 'Decorated Darbar Sharif', titleUrdu: 'سجا ہوا دربار عالیہ', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800', description: 'Illumination of the shrine during the annual Urs Mubarak / عرس مبارک کی روشنی' },
  { id: 'img-2', albumId: 'alb-1', title: 'Spiritual Lecture Crowd', titleUrdu: 'روحانی اجتماع کے شرکاء', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800', description: 'Devotees listing with sheer focus / عقیدت مند خطبہ سنتے ہوئے' },
  { id: 'img-3', albumId: 'alb-2', title: 'Thuluth Script Calligraphy', titleUrdu: 'خطِ ثلث میں قرآنی آیت', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800', description: 'Handmade traditional Islamic Thuluth calligraphy / ہاتھ سے لکھی خطاطی' },
  { id: 'img-4', albumId: 'alb-3', title: 'Zikr Circle Assembly', titleUrdu: 'حلقہ ذکر شریف', imageUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=800', description: 'Devotees reciting Darood-o-Salam in harmony / اجتماعی ذکرِ الٰہی و درود و سلام' }
];

export const initialSliderItems: SliderItem[] = [
  { id: 'slide-1', title: 'Annual Urs Mubarak Celebration', titleUrdu: 'سالانہ عرس مبارک کی تیاریاں', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1200', linkToType: 'post', targetId: 'post-2' },
  { id: 'slide-2', title: 'Download Tazkirat-ul-Awliya PDF Book', titleUrdu: 'مستند کتاب تذکرۃ الاولیاء ڈاؤنلوڈ کریں', imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200', linkToType: 'pdf', targetId: 'pdf-1' },
  { id: 'slide-3', title: 'Rightly Guided Caliph Hazrat Usman (R.A)', titleUrdu: 'امیر المؤمنین عثمان غنیؓ کا ایمان افروز تذکرہ', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200', linkToType: 'post', targetId: 'post-1' }
];

export const initialContactInfo: ContactInfo = {
  mobile: '+92 300 1234567',
  whatsApp: '+92 300 1234567',
  email: 'info@halqa-e-usmania.org',
  website: 'https://halqa-e-usmania.org',
  officeAddress: 'Main Halqa-e-Usmania Islamic Center, Block C, Gulshan-e-Iqbal, Karachi, Pakistan',
  officeAddressUrdu: 'مرکزی حلقہ عثمانیہ اسلامک سینٹر، بلاک سی، گلشنِ اقبال، کراچی، پاکستان',
  googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.1367850552784!2d67.0681216!3d24.9274291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f67a2d4dbfb%3A0x1171059f3cc986db!2sGulshan-e-Iqbal%2C%20Karachi!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk'
};

export const initialSocialLinks: SocialLinks = {
  facebook: 'https://facebook.com/halqaeusmania',
  youtube: 'https://youtube.com/halqaeusmania',
  instagram: 'https://instagram.com/halqaeusmania',
  tiktok: 'https://tiktok.com/@halqaeusmania',
  telegram: 'https://t.me/halqaeusmania',
  whatsAppChannel: 'https://whatsapp.com/channel/halqaeusmania',
  website: 'https://halqa-e-usmania.org'
};

export const initialFeedback: FeedbackItem[] = [
  {
    id: 'feed-1',
    name: 'Muhammad Farhan',
    email: 'farhan@example.com',
    contactNumber: '+92 312 9876543',
    subject: 'Request for New PDF Upload',
    message: 'Can you please upload the PDF book "Kimiya-e-Saadat" by Imam Ghazali? It would be highly beneficial.',
    date: '2026-07-14',
    replied: true,
    replyMessage: 'Assalam-o-Alaikum, thank you for your recommendation. We are digitizing and proofreading "Kimiya-e-Saadat" and will upload it to the PDF Library soon. Stay tuned!',
    replyDate: '2026-07-16'
  },
  {
    id: 'feed-2',
    name: 'Hafiz Bilal Ahmed',
    email: 'bilal@example.com',
    contactNumber: '+92 345 1122334',
    subject: 'Audio Dhikr section',
    message: 'The audio recitation of Dhikr has extremely spiritual rhythm and calming vocals. Outstanding sound quality.',
    date: '2026-07-19',
    replied: false
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Urs Mubarak Hazrat Usman Ghani (R.A)',
    titleUrdu: 'عرس مبارک سیدنا عثمان غنی رضی اللہ عنہ',
    body: 'Join our special live assembly today at 8:00 PM PST for the spiritual sermon of Halqa-e-Usmania.',
    bodyUrdu: 'آج رات ۸ بجے سیدنا عثمان غنیؓ کی یاد میں خصوصی روحانی اجتماع منعقد ہوگا، شرکت فرما کر فیوض و برکات حاصل کریں۔',
    type: 'event',
    date: '2026-07-20'
  },
  {
    id: 'notif-2',
    title: 'New PDF Book Uploaded!',
    titleUrdu: 'جدید پی ڈی ایف کتاب اپلوڈ کر دی گئی',
    body: '"Tazkirat-ul-Awliya" is now available for free offline reading and download.',
    bodyUrdu: 'عظیم صوفیانہ تصنیف "تذکرۃ الاولیاء" اب پی ڈی ایف لائبریری میں مفت پڑھنے اور ڈاؤنلوڈ کے لیے دستیاب ہے۔',
    type: 'pdf',
    targetId: 'pdf-1',
    date: '2026-07-18'
  }
];

export const ayatOfTheDay = {
  reference: 'Al-Quran 2:152',
  text: 'Therefore remember Me, I will remember you, and be thankful to Me, and do not be ungrateful.',
  textUrdu: 'پس تم مجھے یاد کرو، میں تمہیں یاد کروں گا، اور میرا شکر ادا کرو اور میری ناشکری مت کرو۔'
};

export const hadithOfTheDay = {
  reference: 'Sahih Al-Bukhari #5027',
  text: 'The best among you are those who learn the Quran and teach it to others.',
  textUrdu: 'تم میں سے بہترین شخص وہ ہے جو قرآن سیکھے اور اسے دوسروں کو سکھائے۔'
};

export const dailyHadeesCollection: HadeesItem[] = [
  {
    id: 'hd-1',
    reference: 'Sahih Al-Bukhari #5027',
    book: 'Sahih Al-Bukhari',
    narrator: 'Hazrat Uthman ibn Affan (R.A)',
    narratorUrdu: 'حضرت عثمان بن عفان رضی اللہ عنہ',
    arabicText: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    text: 'The best among you are those who learn the Quran and teach it to others.',
    textUrdu: 'تم میں سے بہترین شخص وہ ہے جو قرآن سیکھے اور اسے دوسروں کو سکھائے۔',
    category: 'Knowledge & Quran',
    categoryUrdu: 'تعلیم و تعلمِ قرآن'
  },
  {
    id: 'hd-2',
    reference: 'Sahih Al-Bukhari #1, Sahih Muslim #1907',
    book: 'Sahih Al-Bukhari',
    narrator: 'Hazrat Umar ibn Al-Khattab (R.A)',
    narratorUrdu: 'حضرت عمر بن الخطاب رضی اللہ عنہ',
    arabicText: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    text: 'Actions are judged by intentions, and every person will get what he intended.',
    textUrdu: 'تمام اعمال کا انحصار نیتوں پر ہے اور ہر شخص کو وہی ملے گا جس کی اس نے نیت کی۔',
    category: 'Purity of Intention',
    categoryUrdu: 'اخلاص و نیت'
  },
  {
    id: 'hd-3',
    reference: 'Sahih Al-Bukhari #10',
    book: 'Sahih Al-Bukhari',
    narrator: 'Hazrat Abdullah ibn Amr (R.A)',
    narratorUrdu: 'حضرت عبداللہ بن عمرو رضی اللہ عنہ',
    arabicText: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    text: 'A true Muslim is the one from whose tongue and hand other Muslims are safe.',
    textUrdu: 'مسلمان وہ ہے جس کی زبان اور ہاتھ کے شر سے دوسرے مسلمان محفوظ رہیں۔',
    category: 'Good Character',
    categoryUrdu: 'حسنِ اخلاق و سلامتی'
  },
  {
    id: 'hd-4',
    reference: 'Sahih Al-Bukhari #69',
    book: 'Sahih Al-Bukhari',
    narrator: 'Hazrat Anas ibn Malik (R.A)',
    narratorUrdu: 'حضرت انس بن مالک رضی اللہ عنہ',
    arabicText: 'يَسِّرُوا وَلاَ تُعَسِّرُوا وَبَشِّرُوا وَلاَ تُنَفِّرُوا',
    text: 'Make things easy for people and do not make them difficult; give glad tidings and do not repel them.',
    textUrdu: 'لوگوں کے لیے آسانی پیدا کرو اور دشواری پیدا نہ کرو، انہیں خوشخبری دو اور نفرت نہ دلاؤ۔',
    category: 'Kindness & Facilitation',
    categoryUrdu: 'تہذیب و آسانی'
  },
  {
    id: 'hd-5',
    reference: 'Sahih Muslim #223',
    book: 'Sahih Muslim',
    narrator: 'Hazrat Abu Malik Al-Ashari (R.A)',
    narratorUrdu: 'حضرت ابو مالک اشعری رضی اللہ عنہ',
    arabicText: 'الطَّهُورُ شَطْرُ الإِيمَانِ',
    text: 'Cleanliness and purity are half of faith.',
    textUrdu: 'پاکیزگی اور طہارت نصف ایمان ہے۔',
    category: 'Purity & Faith',
    categoryUrdu: 'طہارت و ایمان'
  },
  {
    id: 'hd-6',
    reference: 'Sahih Al-Bukhari #6114',
    book: 'Sahih Al-Bukhari',
    narrator: 'Hazrat Abu Hurairah (R.A)',
    narratorUrdu: 'حضرت ابو ہریرہ رضی اللہ عنہ',
    arabicText: 'لَيْسَ الشَّدِيدُ بِالصُُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ',
    text: 'The strong person is not the one who can wrestle someone down, but the one who controls himself when angry.',
    textUrdu: 'پہلوان وہ نہیں جو دوسروں کو پچھاڑ دے، بلکہ حقیقی پہلوان وہ ہے جو غصے کے وقت اپنے آپ پر قابو رکھے۔',
    category: 'Self Control & Anger',
    categoryUrdu: 'ضبطِ نفس و برداشت'
  },
  {
    id: 'hd-7',
    reference: 'Sahih Al-Bukhari #13',
    book: 'Sahih Al-Bukhari',
    narrator: 'Hazrat Anas ibn Malik (R.A)',
    narratorUrdu: 'حضرت انس بن مالک رضی اللہ عنہ',
    arabicText: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    text: 'None of you truly believes until he loves for his brother what he loves for himself.',
    textUrdu: 'تم میں سے کوئی شخص اس وقت تک کامل مومن نہیں ہو سکتا جب تک وہ اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے کرتا ہے۔',
    category: 'Brotherhood & Compassion',
    categoryUrdu: 'اخوت و ہمدردی'
  },
  {
    id: 'hd-8',
    reference: 'Sahih Al-Bukhari #6018',
    book: 'Sahih Al-Bukhari',
    narrator: 'Hazrat Abu Hurairah (R.A)',
    narratorUrdu: 'حضرت ابو ہریرہ رضی اللہ عنہ',
    arabicText: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    text: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
    textUrdu: 'جو شخص اللہ اور قیامت کے دن پر ایمان رکھتا ہے اسے چاہیے کہ اچھی بات کہے یا خاموش رہے۔',
    category: 'Guardianship of Tongue',
    categoryUrdu: 'حفاظتِ زبان'
  },
  {
    id: 'hd-9',
    reference: 'Sahih Muslim #1893',
    book: 'Sahih Muslim',
    narrator: 'Hazrat Abu Masud Al-Ansari (R.A)',
    narratorUrdu: 'حضرت ابو مسعود انصاری رضی اللہ عنہ',
    arabicText: 'مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ',
    text: 'Whoever guides someone to a good deed will have a reward similar to the one who performs it.',
    textUrdu: 'جس نے کسی نیکی کی رہنمائی کی، اسے اس نیکی کرنے والے کے برابر ثواب ملے گا۔',
    category: 'Guidance & Good Deeds',
    categoryUrdu: 'ترغیبِ نیکی'
  },
  {
    id: 'hd-10',
    reference: 'Sahih Al-Bukhari #6465',
    book: 'Sahih Al-Bukhari',
    narrator: 'Hazrat Aisha (R.A)',
    narratorUrdu: 'ام المؤمنین حضرت عائشہ صدیقہ رضی اللہ عنہا',
    arabicText: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
    text: 'The most beloved deeds to Allah are those performed consistently, even if they are small.',
    textUrdu: 'اللہ کے نزدیک سب سے پسندیدہ عمل وہ ہے جو ہمیشگی اور مداومت سے کیا جائے خواہ وہ مقدار میں کم ہی ہو۔',
    category: 'Consistency in Worship',
    categoryUrdu: 'مداومتِ عمل'
  },
  {
    id: 'hd-11',
    reference: 'Sahih Al-Bukhari #6446',
    book: 'Sahih Al-Bukhari',
    narrator: 'Hazrat Abu Hurairah (R.A)',
    narratorUrdu: 'حضرت ابو ہریرہ رضی اللہ عنہ',
    arabicText: 'لَيْسَ الْغِنَى عَنْ كَثْرَةِ الْعَرَضِ وَلَكِنَّ الْغِنَى غِنَى النَّفْسِ',
    text: 'True richness is not having many worldly possessions, but the true wealth is the satisfaction of the soul.',
    textUrdu: 'حقیقی مالداری سامانِ دنیا کی کثرت سے نہیں، بلکہ سچی مالداری دل کی بے نیازی اور قناعت ہے۔',
    category: 'Contentment & Gratitude',
    categoryUrdu: 'قناعت و غنائے قلب'
  },
  {
    id: 'hd-12',
    reference: 'Al-Adab Al-Mufrad #594',
    book: 'Al-Adab Al-Mufrad',
    narrator: 'Hazrat Abu Hurairah (R.A)',
    narratorUrdu: 'حضرت ابو ہریرہ رضی اللہ عنہ',
    arabicText: 'تَهَادَوْا تَحَابُّوا',
    text: 'Exchange gifts with one another, for it fosters mutual love and affection.',
    textUrdu: 'آپس میں تحائف کا تبادلہ کرو، اس سے باہمی محبت میں اضافہ ہوتا ہے۔',
    category: 'Love & Gifts',
    categoryUrdu: 'تحائف و محبت'
  }
];

export const quoteOfTheDay = {
  reference: 'Hazrat Data Ganj Bakhsh (R.A)',
  text: 'Spiritual knowledge is a light that shines in the heart of a believer and detaches them from worldliness.',
  textUrdu: 'روحانی علم ایک ایسا نور ہے جو مومن کے دل میں چمکتا ہے اور اسے دنیا کی بے ثباتی سے بے نیاز کر دیتا ہے۔'
};

export const upcomingPrograms = [
  {
    title: 'Weekly Spiritual Halqa-e-Dhikr',
    titleUrdu: 'ہفتہ وار روحانی حلقہ ذکر و درود',
    date: 'Every Thursday, after Namaz-e-Isha',
    time: '8:30 PM PST',
    venue: 'Halqa-e-Usmania Central Mosque, Karachi',
    venueUrdu: 'جامع مسجد حلقہ عثمانیہ، کراچی'
  },
  {
    title: 'Conference: Biography of Awliya',
    titleUrdu: 'سیرتِ اولیاء کانفرنس',
    date: 'Sunday, August 2nd, 2026',
    time: '5:00 PM PST',
    venue: 'Al-Usmania Hall, Lahore',
    venueUrdu: 'العثمانیہ ہال، لاہور'
  }
];

export const latestAnnouncement = {
  title: 'Launching of Official App V1.0',
  titleUrdu: 'آفیشل موبائل ایپ کا کامیاب آغاز',
  description: 'Halqa-e-Usmania is pleased to announce its premium official application with complete Islamic libraries.',
  descriptionUrdu: 'حلقہ عثمانیہ کو اپنی آفیشل موبائل ایپلیکیشن کا کامیاب آغاز کرتے ہوئے بے حد خوشی ہے جس میں تمام کتب و بیانات موجود ہیں۔',
  date: '2026-07-20'
};

export const featuredPersonality = {
  name: 'Hazrat Khwaja Moinuddin Chishti Ajmeri (R.A)',
  nameUrdu: 'حضرت خواجہ معین الدین چشتی اجمیری رحمۃ اللہ علیہ',
  title: 'Sultan-ul-Hind / غریب نواز',
  image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
  description: 'The pioneer of the Chishtia spiritual order in South Asia, who guided millions of hearts to Islamic light with unmatched kindness, mercy, and profound spiritual energy.',
  descriptionUrdu: 'برصغیر میں سلسلہ چشتیہ کے بانی، جنہوں نے اپنی بے مثال شفقت، علمی مرتبے اور اعلیٰ اخلاق کے ذریعے لاکھوں دلوں کو نورِ اسلام سے منور کیا۔'
};

export const initialDonationInitiatives: DonationInitiative[] = [
  {
    id: 'init-1',
    title: 'Free Quran Academy Construction',
    titleUrdu: 'مفت قرآن اکیڈمی کی تعمیر',
    description: 'Support the construction of our modern Quran & spiritual academy where under-privileged children receive free Islamic education and accommodation.',
    descriptionUrdu: 'جدید قرآن اور روحانی اکیڈمی کی تعمیر میں حصہ لیں جہاں مستحق بچوں کو مفت اسلامی تعلیم اور رہائش فراہم کی جائے گی۔',
    goalAmount: 1500000,
    raisedAmount: 850000,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=400',
    active: true
  },
  {
    id: 'init-2',
    title: 'Monthly Welfare & Ration Food Support',
    titleUrdu: 'ماہانہ مستحقین راشن اسکیم',
    description: 'Providing monthly food supplies and ration boxes containing essential items to widow-led and poor families in Karachi and nearby areas.',
    descriptionUrdu: 'کراچی اور قریبی علاقوں میں بیوہ خواتین اور غریب خاندانوں کو ضروری اشیاء پر مشتمل ماہانہ راشن بیگز کی فراہمی۔',
    goalAmount: 500000,
    raisedAmount: 320000,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
    active: true
  },
  {
    id: 'init-3',
    title: 'Islamic Digital Library Extension',
    titleUrdu: 'اسلامی ڈیجیٹل لائبریری کا فروغ',
    description: 'Funding the scanning, digitization, and translation of rare classic spiritual manuscripts and Islamic literature into English and Urdu.',
    descriptionUrdu: 'نادر کتب، روحانی نسخہ جات اور قدیم اسلامی لٹریچر کی اسکیننگ، ڈیجیٹائزیشن اور اردو و انگریزی تراجم کے لیے فنڈنگ۔',
    goalAmount: 300000,
    raisedAmount: 120000,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400',
    active: true
  }
];

export const initialDonationRecords: DonationRecord[] = [
  {
    id: 'don-1',
    initiativeId: 'init-1',
    initiativeTitle: 'Free Quran Academy Construction',
    donorName: 'Muhammad Rizwan',
    donorEmail: 'rizwan@example.com',
    donorMobile: '+92 321 4455889',
    amount: 50000,
    currency: 'PKR',
    paymentMethod: 'bank_transfer',
    referenceNumber: 'REF-BK-992384',
    date: '2026-07-15',
    status: 'verified',
    notes: 'JazakAllah for the noble cause.'
  },
  {
    id: 'don-2',
    initiativeId: 'init-2',
    initiativeTitle: 'Monthly Welfare & Ration Food Support',
    donorName: 'Ayesha Siddiqua',
    donorEmail: 'ayesha.s@example.com',
    donorMobile: '+92 331 1122334',
    amount: 15000,
    currency: 'PKR',
    paymentMethod: 'easy_paisa',
    referenceNumber: 'EP-5592812',
    date: '2026-07-18',
    status: 'verified'
  },
  {
    id: 'don-3',
    initiativeId: 'init-1',
    initiativeTitle: 'Free Quran Academy Construction',
    donorName: 'Zainab Bibi',
    donorEmail: 'zainab@example.com',
    donorMobile: '+92 300 9876543',
    amount: 10000,
    currency: 'PKR',
    paymentMethod: 'jazz_cash',
    referenceNumber: 'JC-1002931',
    date: '2026-07-19',
    status: 'pending'
  }
];

export const initialInfoPages: InfoPage[] = [
  {
    id: 'page-about-us',
    title: 'About Us',
    titleUrdu: 'ہمارے بارے میں',
    slug: 'about-us',
    shortDescription: 'Learn about Halqa-e-Usmania Islamic Digital Initiative, our mission, spiritual lineage, and educational activities.',
    shortDescriptionUrdu: 'حلقہ عثمانیہ اسلامک ڈیجیٹل انیشی ایٹو کا تعارف، ہمارے مقاصد اور تعلیمی و روحانی خدمات۔',
    content: `
      <h3>Welcome to Halqa-e-Usmania</h3>
      <p>Halqa-e-Usmania is an international non-profit Islamic educational, spiritual, and research organization dedicated to propagating authentic Islamic knowledge, classical Sufi literature, and moral values under the guidance of qualified scholars.</p>
      <h4>Our Core Mission</h4>
      <ul>
        <li>Preserving and digitizing classical Islamic literature and manuscripts.</li>
        <li>Providing easy digital access to authentic Quranic tafseer, Hadith collections, and biographies of Awliya.</li>
        <li>Conducting weekly spiritual gatherings (Halqa-e-Dhikr) and youth guidance seminars.</li>
        <li>Promoting unity, peace, and mutual love across the Muslim Ummah.</li>
      </ul>
      <h4>Spiritual Lineage & Guidance</h4>
      <p>Our scholarly council is led by esteemed scholars and Sufi masters who trace their spiritual lineage through the noble Naqshbandi, Qadri, and Chishtia spiritual orders, emphasizing strict adherence to the Holy Quran and Sunnah.</p>
    `,
    contentUrdu: `
      <h3>حلقہ عثمانیہ کے تعارف میں خوش آمدید</h3>
      <p>حلقہ عثمانیہ ایک بین الاقوامی غیر منافع بخش اسلامی، تعلیمی، روحانی اور تحقیقی ادارہ ہے جو مستند علمِ دین، کلاسیکی صوفیانہ لٹریچر اور اخلاقی اقدار کو علماءِ کرام کی زیرِ نگرانی عام کرنے کے لیے کوشاں ہے۔</p>
      <h4>ہمارے بنیادی مقاصد</h4>
      <ul>
        <li>کلاسیکی اسلامی کتب اور قلمی نسخہ جات کی تحفظ اور ڈیجیٹل ڈائریکٹری کی تیاری۔</li>
        <li>قرآن و حدیث، فقہ اور اولیائے کرام کے تذکرہ پر مبنی کتب تک مفت رسائی۔</li>
        <li>ہفتہ وار روحانی محافلِ ذکر و درود اور نوجوانوں کی اصلاحی تربیت۔</li>
        <li>امتِ مسلمہ میں اتحاد، امن، محبت اور اخوت کے فروغ کا عزم۔</li>
      </ul>
      <h4>علمی و روحانی سرپرستی</h4>
      <p>ہمارا علمی بورڈ جید علماءِ کرام اور مشائخِ عظام پر مشتمل ہے جو شریعتِ مطہرہ اور سنتِ نبوی ﷺ پر سختی سے کاربند رہتے ہوئے تزکیہ نفس کی دعوت دیتے ہیں۔</p>
    `,
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
    featuredImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600',
    status: 'published',
    displayOrder: 1,
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-07-23T12:00:00.000Z',
    youtubeUrl: 'https://www.youtube.com/watch?v=W8v7Ie9NbeE',
    externalLinks: [
      { label: 'Official Website', url: 'https://halqa-e-usmania.org' }
    ]
  },
  {
    id: 'page-privacy-policy',
    title: 'Privacy Policy',
    titleUrdu: 'پرائیویسی پالیسی',
    slug: 'privacy-policy',
    shortDescription: 'Our commitment to protecting your personal data, privacy, and device permissions.',
    shortDescriptionUrdu: 'آپ کی ذات، ڈیٹا کی حفاظت اور صارف کے بنیادی حقوق کی ضمانت۔',
    content: `
      <h3>Privacy Policy & User Data Protection</h3>
      <p>Your privacy is paramount to us at Halqa-e-Usmania. This policy details how we collect, store, and protect your information when using our Android application.</p>
      <h4>1. Data Collection</h4>
      <p>We do not collect personal browsing data without your consent. Name, email, or mobile numbers submitted via feedback or donation receipts are kept strictly confidential.</p>
      <h4>2. App Permissions</h4>
      <p>Our app requires minimal permissions (Storage for PDF/Audio downloads and Notifications for announcements). We never access your contacts or private personal media.</p>
      <h4>3. Third-Party Services</h4>
      <p>Firebase Firestore and Authentication are used for secure cloud syncing. We do not sell, trade, or share user data with advertising partners.</p>
    `,
    contentUrdu: `
      <h3>پرائیویسی پالیسی اور ڈیٹا کی حفاظت</h3>
      <p>حلقہ عثمانیہ آپ کی پرائیویسی کو مقدم رکھتا ہے۔ یہ پالیسی اس بات کی وضاحت کرتی ہے کہ اینڈرائیڈ ایپ کے استعمال کے دوران آپ کے ڈیٹا کی حفاظت کیسے کی جاتی ہے۔</p>
      <h4>۱۔ معلومات کا جمع کیا جانا</h4>
      <p>ہم صارف کی اجازت کے بغیر کوئی ذاتئ معلومات جمع نہیں کرتے۔ رائے یا عطیات کی رسید کے لیے فراہم کردہ معلومات کو مکمل طور پر راز میں رکھا جاتا ہے۔</p>
      <h4>۲۔ موبائل پرمیشنز</h4>
      <p>ہماری ایپ صرف کتب ڈاؤنلوڈ کرنے کی اجازت اور نوٹیفیکیشنز کی اجازت مانگتی ہے۔ آپ کی نجی تصاویر یا فون کنٹیکٹس تک ہماری کوئی رسائی نہیں ہوتی۔</p>
      <h4>۳۔ تھرڈ پارٹی سروسز</h4>
      <p>ڈیٹا کی بحالی کے لیے گوگل فائر بیس کا محفوظ نظام استعمال کیا جاتا ہے۔ ہم کسی بھی اشتہاری کمپنی کے ساتھ صارف کا ڈیٹا شیئر نہیں کرتے۔</p>
    `,
    bannerImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1200',
    featuredImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600',
    status: 'published',
    displayOrder: 2,
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-07-23T12:00:00.000Z'
  },
  {
    id: 'page-disclaimer',
    title: 'Disclaimer',
    titleUrdu: 'ڈسکلیمر (اظہارِ لا تعلقی)',
    slug: 'disclaimer',
    shortDescription: 'Official Islamic rulings disclaimer, non-profit status, and copyright notices for media items.',
    shortDescriptionUrdu: 'شرعی و قانونی معلومات اور ڈیجیٹل مواد کے استعمال کی شرائط۔',
    content: `
      <h3>Official Legal & Shariah Disclaimer</h3>
      <p>The contents, articles, fatwas, and audio-video recordings available in this application are provided strictly for educational and spiritual enlightenment.</p>
      <h4>1. Islamic Rulings & Fatwas</h4>
      <p>While all Q&A and articles are vetted by qualified Islamic scholars, individual legal cases or complex marital/inheritance matters should be discussed directly with an authorized Dar-ul-Ifta.</p>
      <h4>2. Copyrights & Intellectual Property</h4>
      <p>All books, articles, and media belong to Halqa-e-Usmania or their respective author scholars. Users are permitted to download and share for non-commercial educational purposes.</p>
    `,
    contentUrdu: `
      <h3>شرعی و قانونی اظہارِ لا تعلقی</h3>
      <p>اس ایپلیکیشن میں موجود مضامین، فتاویٰ، کتب اور آڈیو ویڈیو ریکارڈنگز محض اسلامی تعلیم و تربیت اور اصلاحِ احوال کے مقصد کے لیے فراہم کی گئی ہیں۔</p>
      <h4>۱۔ شرعی مسائل اور فتاویٰ</h4>
      <p>اگرچہ تمام مضامین جید علماء کی زیرِ نگرانی تیار کیے گئے ہیں، تاہم پیچیدہ خاندانی یا وراثتی مسائل کی صورت میں قریبی دارالافتاء سے بالمشافہ رجوع فرمائیں۔</p>
      <h4>۲۔ حقِ اشاعت (کاپی رائٹ)</h4>
      <p>ایپ میں موجود تمام مواد غیر تجارتی مقاصد اور تبلیغِ دین کے لیے عام شیئر کیا جا سکتا ہے۔</p>
    `,
    bannerImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    featuredImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    status: 'published',
    displayOrder: 3,
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-07-23T12:00:00.000Z'
  },
  {
    id: 'page-terms-and-conditions',
    title: 'Terms & Conditions',
    titleUrdu: 'قواعد و ضوابط',
    slug: 'terms-and-conditions',
    shortDescription: 'Terms of use for accessing Halqa-e-Usmania mobile app, audio lectures, PDF library, and digital services.',
    shortDescriptionUrdu: 'ایپلی کیشن کے استعمال اور علمی خدمات تک رسائی کے لیے ضوابط۔',
    content: `
      <h3>Terms & Conditions of Service</h3>
      <p>By installing and using the Halqa-e-Usmania mobile app, you agree to comply with the following terms and community standards.</p>
      <h4>1. Respectful Usage</h4>
      <p>Users must refrain from uploading offensive material or engaging in disrespectful conduct in feedback or comment forms.</p>
      <h4>2. Non-Commercial Redistribution</h4>
      <p>You may not sell, modify, or commercialize any PDF books, audio recordings, or app content.</p>
      <h4>3. Service Modifications</h4>
      <p>Halqa-e-Usmania reserves the right to update app features, add new pages, or refine content as needed.</p>
    `,
    contentUrdu: `
      <h3>خدمات کے استعمال کے قواعد و ضوابط</h3>
      <p>حلقہ عثمانیہ موبائل ایپ کے استعمال کے ساتھ آپ درج ذیل ضوابط کی پابندی کے پابند ہوں گے۔</p>
      <h4>۱۔ باوقار استعمال</h4>
      <p>ایپ کے فیڈ بیک فارم میں باوقار اور شرعی حدود کا پاس رکھنا ضروری ہے۔</p>
      <h4>۲۔ غیر تجارتی استعمال</h4>
      <p>ایپ کی کسی بھی پی ڈی ایف کتاب یا بیانات کو تجارتی مقاصد کے لیے فروخت کرنا ممنوع ہے۔</p>
      <h4>۳۔ ترمیم و اضافہ</h4>
      <p>ادارہ وقت کے ساتھ ساتھ ایپ میں بہتری اور ترامیم کا حق محفوظ رکھتا ہے۔</p>
    `,
    bannerImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200',
    featuredImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    status: 'published',
    displayOrder: 4,
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-07-23T12:00:00.000Z'
  },
  {
    id: 'page-contact-us',
    title: 'Contact Us',
    titleUrdu: 'رابطہ کریں',
    slug: 'contact-us',
    shortDescription: 'Get in touch with our scholars, administration, welfare department, and technical support team.',
    shortDescriptionUrdu: 'علماء کرام، انتظامیہ اور تکنیکی ٹیم سے رابطے کی معلومات۔',
    content: `
      <h3>Get in Touch with Halqa-e-Usmania</h3>
      <p>We welcome your questions, suggestions, research inquiries, and feedback. Feel free to contact our administration or visit our head office.</p>
      <h4>Central Head Office</h4>
      <p>Main Halqa-e-Usmania Islamic Center, Block C, Gulshan-e-Iqbal, Karachi, Pakistan</p>
      <h4>Communication Channels</h4>
      <ul>
        <li>Phone & WhatsApp: +92 300 1234567</li>
        <li>Email Support: info@halqa-e-usmania.org</li>
        <li>Office Timings: Monday to Saturday, 10:00 AM to 8:00 PM PST</li>
      </ul>
    `,
    contentUrdu: `
      <h3>حلقہ عثمانیہ کے مرکزی دفتر سے رابطہ کریں</h3>
      <p>ہمیں آپ کی تجاویز، سوالات اور آراء کا انتظار رہتا ہے۔ آپ ہمارے مرکزی دفتر تشریف لا سکتے ہیں یا فون پر رابطہ کر سکتے ہیں۔</p>
      <h4>مرکزی دفتر</h4>
      <p>مرکزی حلقہ عثمانیہ اسلامک سینٹر، بلاک سی، گلشنِ اقبال، کراچی، پاکستان</p>
      <h4>رابطے کے ذرائع</h4>
      <ul>
        <li>فون و واٹس ایپ: 1234567 300 92+</li>
        <li>ای میل: info@halqa-e-usmania.org</li>
        <li>اوقاتِ کار: پیر تا ہفتہ، صبح ۱۰ بجے تا شام ۸ بجے</li>
      </ul>
    `,
    bannerImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1200',
    featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
    status: 'published',
    displayOrder: 5,
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-07-23T12:00:00.000Z',
    externalLinks: [
      { label: 'WhatsApp Community Channel', url: 'https://whatsapp.com/channel/halqaeusmania' },
      { label: 'Google Maps Directions', url: 'https://maps.google.com' }
    ]
  }
];

export const initialIslamicEvents: IslamicEvent[] = [
  {
    id: 'evt-1',
    title: '1st Muharram - Islamic New Year',
    titleUrdu: 'یکم محرم - اسلامی نیا سال',
    hijriMonth: 1,
    hijriDay: 1,
    description: 'Beginning of the Islamic Hijri Year and martyrdom anniversary of Hazrat Umar Farooq (R.A).',
    descriptionUrdu: 'اسلامی نئے سال کا آغاز اور شہادتِ امیر المؤمنین حضرت عمر فاروق رضی اللہ عنہ۔',
    category: 'historical'
  },
  {
    id: 'evt-2',
    title: '10th Muharram - Youm-e-Ashura',
    titleUrdu: '۱۰ محرم - یومِ عاشورہ',
    hijriMonth: 1,
    hijriDay: 10,
    description: 'Martyrdom of Hazrat Imam Hussain (R.A) and his blessed companions at Karbala.',
    descriptionUrdu: 'شہادتِ نواسہ رسول حضرت امام حسین رضی اللہ عنہ اور شہدائے کربلا۔',
    category: 'historical'
  },
  {
    id: 'evt-3',
    title: '12th Rabi al-Awwal - Mawlid an-Nabi ﷺ',
    titleUrdu: '۱۲ ربیع الاول - عید میلاد النبی ﷺ',
    hijriMonth: 3,
    hijriDay: 12,
    description: 'Blessed birth of the Holy Prophet Muhammad ﷺ, Mercy to the Worlds.',
    descriptionUrdu: 'رحمت للعالمین حضرت محمد مصطفیٰ صلی اللہ علیہ وآلہ وسلم کی ولادتِ با سعادت۔',
    category: 'eid'
  },
  {
    id: 'evt-4',
    title: '27th Rajab - Shab-e-Miraj',
    titleUrdu: '۲۷ رجب - شبِ معراج',
    hijriMonth: 7,
    hijriDay: 27,
    description: 'Night Journey and Ascension of the Holy Prophet Muhammad ﷺ.',
    descriptionUrdu: 'حضور اکرم ﷺ کے سفرِ معراج اور پنجگانہ نماز کے تحفے کا مبارک موقع۔',
    category: 'holy_night'
  },
  {
    id: 'evt-5',
    title: '15th Sha\'ban - Shab-e-Barat',
    titleUrdu: '۱۵ شعبان - شبِ برات',
    hijriMonth: 8,
    hijriDay: 15,
    description: 'Night of Salvation, forgiveness, and divine decrees.',
    descriptionUrdu: 'مغفرت و رحمت کی رات اور تقدیرِ الٰہی کی مبارک لائلۃ البراءۃ۔',
    category: 'holy_night'
  },
  {
    id: 'evt-6',
    title: '1st Ramadan - Start of Holy Ramadan',
    titleUrdu: 'یکم رمضان - آغازِ رمضان المبارک',
    hijriMonth: 9,
    hijriDay: 1,
    description: 'First day of prescribed fasting in the sacred month of Quran.',
    descriptionUrdu: 'نزولِ قرآن اور نزولِ رحمت کے مبارک مہینے کا پہلا روزہ۔',
    category: 'fasting'
  },
  {
    id: 'evt-7',
    title: '27th Ramadan - Laylat al-Qadr',
    titleUrdu: '۲۷ رمضان - لیلۃ القدر',
    hijriMonth: 9,
    hijriDay: 27,
    description: 'Night of Power, better than a thousand months.',
    descriptionUrdu: 'ہزار مہینوں سے افضل مبارک رات، نزولِ قرآنِ مجید۔',
    category: 'holy_night'
  },
  {
    id: 'evt-8',
    title: '1st Shawwal - Eid-ul-Fitr',
    titleUrdu: 'یکم شوال - عید الفطر',
    hijriMonth: 10,
    hijriDay: 1,
    description: 'Blessed Islamic festival marking the end of holy Ramadan.',
    descriptionUrdu: 'رمضان المبارک کے روزوں کی تکمیل پر اللہ تعالیٰ کا عطیہ و خوشی کا دن۔',
    category: 'eid'
  },
  {
    id: 'evt-9',
    title: '9th Dhul Hijjah - Day of Arafah',
    titleUrdu: '۹ ذو الحجہ - یومِ عرفہ',
    hijriMonth: 12,
    hijriDay: 9,
    description: 'Peak day of Hajj and pilgrimage at Arafat Plains.',
    descriptionUrdu: 'میدانِ عرفات میں حجِ اکبر کا عظیم ترین دن اور مسنون روزہ۔',
    category: 'fasting'
  },
  {
    id: 'evt-10',
    title: '10th Dhul Hijjah - Eid-ul-Adha',
    titleUrdu: '۱۰ ذو الحجہ - عید الاضحیٰ',
    hijriMonth: 12,
    hijriDay: 10,
    description: 'Festival of Sacrifice in remembrance of Hazrat Ibrahim (A.S) & Ismail (A.S).',
    descriptionUrdu: 'سنتِ ابراہیمی کی یاد میں قربانی کا جلیل القدر اسلامی تہوار۔',
    category: 'eid'
  }
];

export const initialDuas: DuaItem[] = [
  {
    id: 'dua-1',
    title: 'Morning Azkar - Divine Protection',
    titleUrdu: 'صبح کے اذکار - حفاظت الٰہی',
    arabicText: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillahil-ladhi la yadurru ma\'as-mihi shay\'un fil-ardi wa la fis-sama\'i wa Huwas-Sami\'ul-\'Alim.',
    translation: 'In the Name of Allah, with Whose Name nothing can cause harm in the earth nor in the heaven, and He is the All-Hearing, All-Knowing.',
    translationUrdu: 'اللہ کے نام کے ساتھ، جس کے نام کی برکت سے زمین اور آسمان کی کوئی چیز نقصان نہیں پہنچا سکتی، اور وہی سب کچھ سننے والا اور جاننے والا ہے۔',
    reference: 'Sunan Abi Dawud 5088',
    category: 'morning_evening',
    virtues: 'Recite 3 times morning & evening for complete protection.',
    virtuesUrdu: 'صبح اور شام تین بار پڑھنے سے ہر ناگہانی آفت و شر سے کامل تحفظ ملتا ہے۔'
  },
  {
    id: 'dua-2',
    title: 'Dua Before Sleeping',
    titleUrdu: 'سوتے وقت کی دعا',
    arabicText: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya.',
    translation: 'In Your Name, O Allah, I die and I live.',
    translationUrdu: 'اے اللہ! تیرے ہی نام کے ساتھ میں مرتا ہوں (سوتا ہوں) اور جیتا (جاگتا) ہوں۔',
    reference: 'Sahih al-Bukhari 6312',
    category: 'daily_life'
  },
  {
    id: 'dua-3',
    title: 'Dua Upon Waking Up',
    titleUrdu: 'بیدار ہونے کی دعا',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilaihin-nushur.',
    translation: 'Praise be to Allah Who gave us life after causing us to die, and unto Him is the resurrection.',
    translationUrdu: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے (سلانے) کے بعد زندہ (بیدار) کیا اور اسی کی طرف لوٹ کر جانا ہے۔',
    reference: 'Sahih al-Bukhari 6312',
    category: 'daily_life'
  },
  {
    id: 'dua-4',
    title: 'Dua for Forgiveness (Sayyidul Istighfar)',
    titleUrdu: 'سید الاستغفار - بخشش کی عظیم دعا',
    arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
    transliteration: 'Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana \'abduka, wa ana \'ala \'ahdika wa wa\'dika mas-tata\'tu...',
    translation: 'O Allah, You are my Lord. There is no god but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can.',
    translationUrdu: 'اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے ہی مجھے پیدا کیا اور میں تیرا بندہ ہوں اور تیرے عہد پر قائم ہوں۔',
    reference: 'Sahih al-Bukhari 6306',
    category: 'forgiveness',
    virtues: 'Whoever recites it during the day with conviction and dies that day will enter Paradise.',
    virtuesUrdu: 'جو شخص دن میں سچے دل سے یہ استغفار پڑھے اور اسی دن انتقال کر جائے، وہ جنتی ہے۔'
  },
  {
    id: 'dua-5',
    title: 'Dua for Iftar (Breaking Fast)',
    titleUrdu: 'افطار کے وقت کی دعا',
    arabicText: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    transliteration: 'Dhahaba adh-dhama\'u wabtallatil-\'uruqu wa thabatal-ajru in sha\'Allah.',
    translation: 'The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills.',
    translationUrdu: 'پیاس بجھ گئی، رگیں تر ہو گئیں اور اللہ کے فضل سے اجر ثابت ہو گیا۔',
    reference: 'Sunan Abi Dawud 2357',
    category: 'ramadan'
  }
];

// INITIAL BRANCH MASTER DATA
export const initialBranches: Branch[] = [
  {
    id: 'br-1',
    name: 'Malir Markazi Aastana',
    code: 'MALIR01',
    city: 'Karachi',
    country: 'Pakistan',
    status: 'active',
    address: 'Halqa-e-Usmania Markaz, Model Colony, Malir, Karachi',
    phone: '+92 300 1234567',
    createdAt: '2026-01-01'
  },
  {
    id: 'br-2',
    name: 'Gulshan Branch',
    code: 'GULSHAN01',
    city: 'Karachi',
    country: 'Pakistan',
    status: 'active',
    address: 'Block 6, Gulshan-e-Iqbal, Karachi',
    phone: '+92 301 9876543',
    createdAt: '2026-02-01'
  },
  {
    id: 'br-3',
    name: 'Landhi Branch',
    code: 'LANDHI01',
    city: 'Karachi',
    country: 'Pakistan',
    status: 'active',
    address: 'Bab-e-Usmania, Landhi Industrial Area, Karachi',
    phone: '+92 321 4567890',
    createdAt: '2026-03-01'
  },
  {
    id: 'br-4',
    name: 'Hyderabad Branch',
    code: 'HYDERABAD',
    city: 'Hyderabad',
    country: 'Pakistan',
    status: 'active',
    address: 'Saddar Bazaar, Hyderabad, Sindh',
    phone: '+92 333 5551212',
    createdAt: '2026-03-15'
  },
  {
    id: 'br-5',
    name: 'Dubai International Markaz',
    code: 'DUBAI',
    city: 'Dubai',
    country: 'UAE',
    status: 'active',
    address: 'Al Qusais Industrial Area, Dubai',
    phone: '+971 50 1234567',
    createdAt: '2026-04-01'
  },
  {
    id: 'br-6',
    name: 'Lahore Aastana',
    code: 'LAHORE01',
    city: 'Lahore',
    country: 'Pakistan',
    status: 'active',
    address: 'Near Data Darbar, Lahore',
    phone: '+92 345 6789012',
    createdAt: '2026-05-01'
  }
];

// INITIAL DAY-WISE SPIRITUAL DATASETS (Monday - Sunday)
export const initialDayDatasets: DayDatasetRecord[] = [
  // Monday Records
  {
    id: 'ds-mon-1',
    adad: 1,
    day: 'monday',
    mizaj: 'Aatashi (آتشین)',
    tashkhees: ['نظربد اور سستی کا اثر', 'کاروبار میں بے برکتی کی شکایت'],
    sadqa: ['1/2 کلو زرد دال یا 100 روپے روزانہ', 'کالے کپڑے کا ٹکڑا پرانے شخص کو دیں'],
    wazifa: 'یا حی یا قیوم برحمتک استغیث (101 بار صبح و شام)',
    duration: '7 Days (7 ایام)',
    notes: 'پیر کے دن سورج نکلنے کے بعد اول و آخر 11 بار درود شریف پڑھیں۔',
    references: 'حلقہ عثمانیہ روحاتی بیاض - جلد 1، صفحہ 12'
  },
  {
    id: 'ds-mon-2',
    adad: 2,
    day: 'monday',
    mizaj: 'Aabi (آبی)',
    tashkhees: ['دل کی گھبراہٹ اور بے خوابی', 'گھریلو ناچاقی اور ذہنی تناؤ'],
    sadqa: ['سفید چیز مثلاً دودھ یا چینی یا چاول کا صدقہ', 'کسی ضرورت مند کو پانی پلائیں'],
    wazifa: 'یا سلام یا مومن یا اللہ (313 بار بعد نمازِ عشاء)',
    duration: '11 Days (11 ایام)',
    notes: 'باوضو ہو کر رات کو سونے سے پہلے سورہ الفلق اور سورہ الناس 3, 3 بار پڑھ کر دم کریں۔'
  },
  {
    id: 'ds-mon-3',
    adad: 3,
    day: 'monday',
    mizaj: 'Baadi (بادی)',
    tashkhees: ['رزق کی تنگی اور حاسدین کا شر', 'کام بنتے بنتے رک جانا'],
    sadqa: ['پرندوں کو باجرہ یا دانہ ڈالیں', 'تین غریبوں کو کھانا کھلائیں'],
    wazifa: 'یا رزاق یا فتاح یا باسط (100 بار صبح بعد نمازِ فجر)',
    duration: '14 Days (14 ایام)',
    notes: 'ہر نماز کے بعد آیت الکرسی باقاعدگی سے پڑھیں۔'
  },
  {
    id: 'ds-mon-4',
    adad: 4,
    day: 'monday',
    mizaj: 'Khaaki (خاکی)',
    tashkhees: ['جسمانی درد اور بوجھل پن', 'سایہ یا تعویذات کا خدشہ'],
    sadqa: ['کالے تل یا کالی دال کا صدقہ', 'پرانے جوتے یا کپڑے صدقہ کریں'],
    wazifa: 'لا حول ولا قوة إلا بالله العلي العظيم (111 بار)',
    duration: '21 Days (21 ایام)',
    notes: 'صبح شام منزل کا ایک بار ورد کریں۔'
  },
  {
    id: 'ds-mon-5',
    adad: 5,
    day: 'monday',
    mizaj: 'Aatashi (آتشین)',
    tashkhees: ['غصہ اور جذباتی بے چینی', 'بچوں کی ضدد یا پڑھائی سے بے رغبتی'],
    sadqa: ['سرخ رنگ کی نمکین چیز یا سرخ دال کا صدقہ'],
    wazifa: 'یا لطیف یا ودود (500 بار درمیانی رات یا فجر)',
    duration: '7 Days (7 ایام)'
  },
  {
    id: 'ds-mon-6',
    adad: 6,
    day: 'monday',
    mizaj: 'Aabi (آبی)',
    tashkhees: ['سفر میں رکاوٹ یا قانونی پیچیدگی'],
    sadqa: ['پرندوں کے لیے پانی اور دانہ رکھیں'],
    wazifa: 'یا وکیل یا کفیل یا نصر (313 بار)',
    duration: '11 Days (11 ایام)'
  },
  {
    id: 'ds-mon-7',
    adad: 7,
    day: 'monday',
    mizaj: 'Khaaki (خاکی)',
    tashkhees: ['حاسدین کی نظر اور پراسرار خوف'],
    sadqa: ['گوشت کے ٹکڑے کا صدقہ یا پرندوں کو چرندوں کو خوراک'],
    wazifa: 'حسبنا الله ونعم الوکيل (450 بار)',
    duration: '21 Days (21 ایام)'
  },

  // Tuesday Records
  {
    id: 'ds-tue-1',
    adad: 1,
    day: 'tuesday',
    mizaj: 'Aatashi (آتشین)',
    tashkhees: ['شدید غصہ اور دشمنی کی رکاوٹ', 'خون کی کمی یا جلد کا مرض'],
    sadqa: ['سرخ کپڑا یا سرخ دال کلو کا صدقہ', 'کسی مستحق کو دوائی خرید کر دیں'],
    wazifa: 'یا قہار یا جبار یا منتقم (100 بار بعد نماز عصر)',
    duration: '7 Days (7 ایام)'
  },
  {
    id: 'ds-tue-2',
    adad: 2,
    day: 'tuesday',
    mizaj: 'Baadi (بادی)',
    tashkhees: ['کاروباری حاسدین اور دشمنوں کا دباؤ'],
    sadqa: ['گوشت کی بوٹی پرندوں یا کتوں کو ڈالیں'],
    wazifa: 'یا عزیز یا قدوس (313 بار)',
    duration: '11 Days (11 ایام)'
  },
  {
    id: 'ds-tue-3',
    adad: 3,
    day: 'tuesday',
    mizaj: 'Aabi (آبی)',
    tashkhees: ['خوابوں میں ڈرنا اور سانپ یا پانی دیکھنا'],
    sadqa: ['کسی غریب کو میٹھا پانی یا شربت پلائیں'],
    wazifa: 'سلام قولا من رب رحيم (147 بار بعد الفجر)',
    duration: '21 Days (21 ایام)'
  },
  {
    id: 'ds-tue-4',
    adad: 4,
    day: 'tuesday',
    mizaj: 'Khaaki (خاکی)',
    tashkhees: ['پرانی بیماری اور لاعلاج درد'],
    sadqa: ['لوہے کی اشیاء یا کالی دال صدقہ دیں'],
    wazifa: 'یا شافی یا کافی یا معافی (1000 بار)',
    duration: '40 Days (40 ایام)'
  },

  // Wednesday Records
  {
    id: 'ds-wed-1',
    adad: 1,
    day: 'wednesday',
    mizaj: 'Baadi (بادی)',
    tashkhees: ['حافظہ اور تعلیمی رکاوٹ', 'ذہن میں الجھن اور یکسوئی کا فقدان'],
    sadqa: ['سبز رنگ کی دال یا سبز کپڑے کا صدقہ', 'طالب علم کو کتاب یا قلم تحفہ دیں'],
    wazifa: 'رب اشرح لي صدري ويسر لي أمري (108 بار)',
    duration: '11 Days (11 ایام)'
  },
  {
    id: 'ds-wed-2',
    adad: 2,
    day: 'wednesday',
    mizaj: 'Aabi (آبی)',
    tashkhees: ['تجارت میں خسارہ اور ملازمت میں عدمِ ثبات'],
    sadqa: ['مچھلیوں کو آٹے کی گولیاں بنا کر ڈالیں'],
    wazifa: 'یا علیم یا خبیر یا رشید (313 بار)',
    duration: '14 Days (14 ایام)'
  },

  // Thursday Records
  {
    id: 'ds-thu-1',
    adad: 1,
    day: 'thursday',
    mizaj: 'Aatashi (آتشین)',
    tashkhees: ['برکتِ رزق اور دینی و روحانی ترقی'],
    sadqa: ['زرد یا سونا رنگ مٹھائی، زردہ یا حلوہ غریبوں میں تقسیم کریں'],
    wazifa: 'یا غني يا مغني يا رزاق (500 بار بعد نماز مغرب)',
    duration: '7 Days (7 ایام)'
  },
  {
    id: 'ds-thu-2',
    adad: 2,
    day: 'thursday',
    mizaj: 'Aabi (آبی)',
    tashkhees: ['شادی میں بندش یا رشتوں کی رکاوٹ'],
    sadqa: ['کسی یتیم کی مدد یا بچی کی شادی میں تعاون'],
    wazifa: 'یا جامع یا ودود یا مجیب (41 بار سورہ یاسین شریف کی آیت)',
    duration: '21 Days (21 ایام)'
  },

  // Friday Records
  {
    id: 'ds-fri-1',
    adad: 1,
    day: 'friday',
    mizaj: 'Aabi (آبی)',
    tashkhees: ['روحانی سکون اور قلبی نور کا حصول'],
    sadqa: ['جمعہ کی نماز کے بعد مساکین کو کھانا یا درہم صدقہ دیں'],
    wazifa: 'اللهم صل على سيدنا محمد وعلى آل سيدنا محمد (1000 بار درود شریف)',
    duration: 'ہفتہ وار (Every Friday)'
  },
  {
    id: 'ds-fri-2',
    adad: 2,
    day: 'friday',
    mizaj: 'Khaaki (خاکی)',
    tashkhees: ['خاندانی الفت اور باہمی محبت کی بحالی'],
    sadqa: ['عطر یا خوشبو مسجد میں پیش کریں'],
    wazifa: 'یا نور یا ہادی یا بصیر (313 بار)',
    duration: '11 Days (11 ایام)'
  },

  // Saturday Records
  {
    id: 'ds-sat-1',
    adad: 1,
    day: 'saturday',
    mizaj: 'Khaaki (خاکی)',
    tashkhees: ['سخت قسم کا نحس اثر اور جادوئی بوجھ'],
    sadqa: ['سیاہ کپڑا، سرسوں کا تیل اور لوہے کا چمچ پرانے فقیر کو دیں'],
    wazifa: 'یا حی یا قیوم یا ذا الجلال والإکرام (1100 بار)',
    duration: '40 Days (40 ایام)'
  },

  // Sunday Records
  {
    id: 'ds-sun-1',
    adad: 1,
    day: 'sunday',
    mizaj: 'Aatashi (آتشین)',
    tashkhees: ['عزت و مرتبے میں کمی اور اعلیٰ حکام سے تلخی'],
    sadqa: ['سنہری یا زرد مٹھائی، یا گیہوں (گندم) کا صدقہ'],
    wazifa: 'یا ملک یا قدوس یا سلام (313 بار)',
    duration: '7 Days (7 ایام)'
  }
];

// INITIAL APP USERS WITH ALL 5 ROLES (OPERATES FROM FIRESTORE ONLY)
export const initialAppUsers: AppUser[] = [];

// INITIAL SPIRITUAL SLIPS HISTORY
export const initialSlips: SpiritualSlip[] = [
  {
    id: 'HU-MALIR01-2026-07-0001-000561',
    userId: 'HU-MALIR01-U000245',
    userName: 'محمد بلال عثمانی',
    motherName: 'خدیجہ بی بی',
    dob: '1995-04-12',
    gender: 'Male',
    branchId: 'br-1',
    branchCode: 'MALIR01',
    branchName: 'Malir Markazi Aastana',
    year: 2026,
    month: 7,
    monthlySlipNo: 1,
    overallSlipNo: 561,
    nameAdad: 138,
    motherAdad: 620,
    totalAdad: 758,
    finalAdad: 2,
    modFormulaApplied: 'Direct Abjad Match',
    day: 'monday',
    mizaj: 'Aabi (آبی)',
    tashkhees: ['دل کی گھبراہٹ اور بے خوابی', 'گھریلو ناچاقی اور ذہنی تناؤ'],
    sadqa: ['سفید چیز مثلاً دودھ یا چینی یا چاول کا صدقہ', 'کسی ضرورت مند کو پانی پلائیں'],
    wazifa: 'یا سلام یا مومن یا اللہ (313 بار بعد نمازِ عشاء)',
    duration: '11 Days (11 ایام)',
    notes: 'پیر شریف کا مستند وظیفہ برائے تصفیہ باطن۔',
    operatorName: 'حافظ عامر خان',
    operatorRole: 'محقق / محرر',
    createdAt: '2026-07-20 14:30',
    status: 'active',
    mobileNumber: '+92 333 1112233'
  },
  {
    id: 'HU-MALIR01-2026-07-0002-000562',
    userName: 'فاطمہ بی بی',
    motherName: 'زینب خاتون',
    gender: 'Female',
    branchId: 'br-1',
    branchCode: 'MALIR01',
    branchName: 'Malir Markazi Aastana',
    year: 2026,
    month: 7,
    monthlySlipNo: 2,
    overallSlipNo: 562,
    nameAdad: 135,
    motherAdad: 69,
    totalAdad: 204,
    finalAdad: 1,
    modFormulaApplied: 'Direct Abjad Match',
    day: 'monday',
    mizaj: 'Aatashi (آتشین)',
    tashkhees: ['نظربد اور سستی کا اثر', 'کاروبار میں بے برکتی کی شکایت'],
    sadqa: ['1/2 کلو زرد دال یا 100 روپے روزانہ'],
    wazifa: 'یا حی یا قیوم برحمتک استغیث (101 بار)',
    duration: '7 Days (7 ایام)',
    operatorName: 'حافظ عامر خان',
    operatorRole: 'محقق / محرر',
    createdAt: '2026-07-22 10:15',
    status: 'active',
    mobileNumber: '+92 300 1234567'
  }
];

// INITIAL MOD SETTINGS
export const initialModSettings: ModSettings = {
  enabled: false,
  divisor: 7,
  mode: 'exact_or_mod'
};

// INITIAL AUDIT LOGS
export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-07-25T08:15:00.000Z',
    action: 'LOGIN',
    performedBy: 'Hafiz Muhammad Amir Khan',
    role: 'super_admin',
    branchCode: 'MALIR01',
    details: 'Super Admin logged into Master Hub',
    deviceInfo: 'Chrome 126 on Windows 11 (Desktop)'
  },
  {
    id: 'log-102',
    timestamp: '2026-07-24T14:22:10.000Z',
    action: 'USER_APPROVED',
    performedBy: 'Central Admin',
    role: 'central_admin',
    branchCode: 'MALIR01',
    details: 'Approved registration request for Muhammad Tariq Usmani. Issued ID: HU-MALIR01-U000245',
    deviceInfo: 'Android 14 App Client'
  },
  {
    id: 'log-103',
    timestamp: '2026-07-23T11:05:45.000Z',
    action: 'SLIP_CREATED',
    performedBy: 'حافظ عامر خان',
    role: 'muhaqqiq_operator',
    branchCode: 'MALIR01',
    details: 'Generated spiritual diagnosis slip HU-MALIR01-2026-07-0002-000562 for فاطمہ بی بی',
    deviceInfo: 'Web Client / Tablet'
  },
  {
    id: 'log-104',
    timestamp: '2026-07-22T09:30:12.000Z',
    action: 'LOGIN_BLOCKED',
    performedBy: 'SYSTEM_SECURITY',
    role: 'security',
    branchCode: 'HYD02',
    details: 'Failed login attempt for blocked account @blocked_user_test (Reason: Suspicious login activity from unregistered IP)',
    deviceInfo: 'Unknown Safari Client'
  }
];

// INITIAL MAKHZAN-E-KHAS CATEGORIES
export const initialMakhzanCategories: MakhzanCategory[] = [
  {
    id: 'sadqa-guidance',
    name: 'Sadqa Guidance',
    nameUrdu: 'صدقہ و ہدایات',
    icon: 'HeartHandshake',
    description: 'Spiritual guidelines and rules for Sadqa according to Mizaj & Days',
    descriptionUrdu: 'مزاج اور ایام کے مطابق شرعی و روحانی صدقات کی تفصیلی ہدایات',
    order: 1,
    status: 'published'
  },
  {
    id: 'baby-names',
    name: 'Bachon ke Naam',
    nameUrdu: 'بچوں کے خوبصورت نام',
    icon: 'Users',
    description: 'Blessed Islamic baby names with Abjad values and meanings',
    descriptionUrdu: 'مبارک اسلامی نام مع اعداد ابجد اور خوبصورت معانی',
    order: 2,
    status: 'published'
  },
  {
    id: 'naqsh-taweezat',
    name: 'Naqsh',
    nameUrdu: 'نقوش و تعویذات',
    icon: 'Sparkles',
    description: 'Authentic spiritual diagrams and Naqsh diagrams for certified muhaqqiqs',
    descriptionUrdu: 'مستند شرعی نقوش و تعویذات مع قواعد و شرائط',
    order: 3,
    status: 'published'
  },
  {
    id: 'wazaif-adhkar',
    name: 'Wazaif',
    nameUrdu: 'وظائف و اذکار',
    icon: 'BookOpen',
    description: 'Daily Azkar and spiritual recitations for peace, health, and barakah',
    descriptionUrdu: 'حفاظت، رزق اور دفعِ مصائب کے لیے مجرب قرآنی وظائف',
    order: 4,
    status: 'published'
  },
  {
    id: 'khas-material',
    name: 'Khas Material',
    nameUrdu: 'خاص روحانی مواد',
    icon: 'FolderHeart',
    description: 'Exclusive archives, manuscript references, and central circulars',
    descriptionUrdu: 'خانقاہ عثمانیہ کے خصوصی اسناد، تحریری ہدایات اور روحانی نوٹس',
    order: 5,
    status: 'published'
  }
];

// INITIAL MAKHZAN-E-KHAS POSTS
export const initialMakhzanPosts: MakhzanPost[] = [
  {
    id: 'mk-post-101',
    title: 'Mizaj ke Mutabiq Sadqa Dene ka Tariqa',
    titleUrdu: 'مزاج کے مطابق صدقہ دینے کا مسنون طریقہ',
    categoryId: 'sadqa-guidance',
    contentType: 'text_image',
    bodyText: `بسم اللہ الرحمن الرحیم\n\nروحانی علاج میں مزاج کی رعایت رکھنا نہایت ضروری ہے۔ جب کسی شخص پر اثرات، بیماری یا بندش کا گمان ہو تو اس کے عنصر و مزاج (آتش، باد، آب، خاک) کے مطابق صدقہ دینا جلدی شفا اور بفضلِ خدا رفعِ مصیبت کا باعث بنتا ہے۔\n\n1۔ آتشی مزاج (Fire Element):\nگوشت، لال کپڑا، لال دال یا لال مرچ کا صدقہ صبح سورج نکلنے کے وقت دیں۔\n\n2۔ بادی مزاج (Air Element):\nپرندوں کو باجرہ ڈالنا، میٹھی اشیاء یا روٹی کا صدقہ عصر اور مغرب کے درمیان دیں۔\n\n3۔ آبی مزاج (Water Element):\nبہتے پانی میں مچھلیوں کو خوراک ڈالنا، یا سفید اشیاء (چاول، دودھ) کا صدقہ دیں۔\n\n4۔ خاکی مزاج (Earth Element):\nکالی دال، نمک یا پرانے کپڑوں کا صدقہ زوال کے بعد غریبوں میں دیں۔`,
    images: [
      'https://images.unsplash.com/photo-1590076175571-4b5459efb08c?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['Sadqa', 'Mizaj', 'Diagnosis', 'Spiritual Rules'],
    status: 'published',
    accessLevel: 'all_registered',
    enableSharing: true,
    createdBy: 'Hafiz Muhammad Amir Khan',
    updatedOn: '2026-07-20',
    order: 1,
    viewsCount: 142,
    bookmarksCount: 28
  },
  {
    id: 'mk-post-102',
    title: 'Abjad Chart & Islamic Names for Newborns',
    titleUrdu: 'نومولود بچوں کے لیے منتخب با برکت نام مع اعداد ابجد',
    categoryId: 'baby-names',
    contentType: 'text',
    bodyText: `بچوں کا نام رکھتے وقت اچھے معانی اور مبارک نسبت کا خیال رکھنا سنتِ نبوی صلی اللہ علیہ وسلم ہے۔ یہاں حلقہ عثمانیہ کے تحت منتخب نام مع ان کے اعداد ابجد پیش کیے جا رہے ہیں:\n\nلڑکوں کے لیے (Boys Names):\n1۔ محمد طہٰ (Muhammad Taha) - اعداد: 103\n2۔ عبداللہ (Abdullah) - اعداد: 142\n3۔ محمد عثمان (Muhammad Usman) - اعداد: 753\n4۔ ابراہیم (Ibrahim) - اعداد: 259\n\nلڑکیوں کے لیے (Girls Names):\n1۔ فاطمہ الزہراء (Fatima Az-Zahra) - اعداد: 374\n2۔ مریم (Maryam) - اعداد: 290\n3۔ عائشہ (Ayesha) - اعداد: 386\n4۔ خدیجہ (Khadija) - اعداد: 629\n\nنوٹ: بچے کی پیدائش کے دن اور تاریخ کے مطابق عددِ غالب نکال کر نام تجویز کرنا مستحسن ہے۔`,
    images: [],
    tags: ['Baby Names', 'Abjad', 'Islamic Names', 'Newborn'],
    status: 'published',
    accessLevel: 'all_registered',
    enableSharing: true,
    createdBy: 'Central Usmania Admin',
    updatedOn: '2026-07-22',
    order: 2,
    viewsCount: 215,
    bookmarksCount: 45
  },
  {
    id: 'mk-post-103',
    title: 'Naqsh-e-Ayat-ul-Kursi for Protection & Home Security',
    titleUrdu: 'نقش آیہ الکرسی برائے حفاظتِ مکان و دفعِ شیاطین',
    categoryId: 'naqsh-taweezat',
    contentType: 'text_image',
    bodyText: `خاص تنبیہ: یہ تحریر صرف خانقاہ عثمانیہ کے مجاز معالجین اور رجسٹرڈ ارکان کے لیے مقفل ہے۔\n\nآیہ الکرسی کا یہ مربع نقش 4x4 خانوں پر مشتمل ہے جس کا مجموعہ عدد 3298 سے برآمد ہوتا ہے۔ اسے لکھتے وقت طہارت، قبلہ رخ بیٹھنا اور باوضو ہونا شرط ہے۔\n\nکتابت کی شرائط:\n1۔ جمعرات یا جمعہ کی صبح ساعتِ شمس یا زہرہ میں لکھیں۔\n2. زعفران اور عرقِ گلاب سے تیار کردہ روشنائی استعمال کریں۔\n3. نقش مکمل کرنے کے بعد 11 بار درود شریف پڑھ کر دم کریں۔\n\nحفاظتِ مکان کے لیے اسے گھر کے تعویذی فریم میں سرِ دالان پر آویزاں کریں۔`,
    images: [
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['Naqsh', 'Ayat-ul-Kursi', 'Protection', 'Taweez'],
    status: 'published',
    accessLevel: 'specific_role',
    targetRole: 'muhaqqiq',
    enableSharing: false,
    createdBy: 'Hafiz Muhammad Amir Khan',
    updatedOn: '2026-07-24',
    order: 3,
    viewsCount: 88,
    bookmarksCount: 19
  },
  {
    id: 'mk-post-104',
    title: 'Manzil & Surah Yaseen Daily Wazifa Routine',
    titleUrdu: 'منزل و سورہ یس کا روزانہ مسنون وظیفہ برائے وسعتِ رزق',
    categoryId: 'wazaif-adhkar',
    contentType: 'text',
    bodyText: `رزق میں برکت اور تمام دینی و دنیوی مشکلات کے حل کے لیے روزانہ کا معمول:\n\n1۔ نمازِ فجر کے بعد:\nسورہ یٰس کی تلاوت فرمائیں اور "سلام قولا من رب رحیم" کو 59 بار دہرائیں۔\n\n2۔ نمازِ مغرب کے بعد:\nمکمل منزل مبارک کی ایک بار تلاوت فرمائیں۔\n\n3۔ سونے سے قبل:\nسورہ الملک اور آیت الکرسی پڑھ کر اپنے وجود اور بچوں پر دم کریں۔\n\nاللہ کے فضل سے تمام حاسدین کے شر اور رکاوٹوں سے حفاظت رہے گی۔`,
    images: [],
    tags: ['Wazifa', 'Manzil', 'Surah Yaseen', 'Barakah'],
    status: 'published',
    accessLevel: 'all_registered',
    enableSharing: true,
    createdBy: 'Central Usmania Admin',
    updatedOn: '2026-07-18',
    order: 4,
    viewsCount: 310,
    bookmarksCount: 62
  },
  {
    id: 'mk-post-105',
    title: 'Central Circular: Branch Rules for Spiritual Diagnosis Slips',
    titleUrdu: 'خصوصی ہدایت نامہ: برانچز کے لیے پرچہِ تشخیص کے قواعد و ضوابط',
    categoryId: 'khas-material',
    contentType: 'text_image',
    bodyText: `تمام ملیر اور حیدرآباد برانچز کے ذمہ داران و محققین کے لیے ہدایت نامہ:\n\n1۔ کسی بھی طالب کے لیے پرچہِ تشخیص بناتے وقت نام اور والدہ کے نام کا درست تلفظ اور ہجے (Spelling) لازمی چیک کریں۔\n2۔ اعداد نکالتے وقت ابجدِ قمری کی معیاری ترتیب استعمال کریں۔\n3۔ اگر باقی عدد 0 آئے تو ابجد موڈ فارمولا (Mod 7 / Mod 12) کی ترتیب کا لازمی اندراج کریں۔\n4۔ ہر پرچہ پر برانچ کوڈ اور جاری کنندہ اپریٹر کے دستخط و آئی ڈی ہونی چاہئے۔`,
    images: [
      'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['Circular', 'Branch Rules', 'Khanqah Rules', 'Internal'],
    status: 'published',
    accessLevel: 'specific_branch',
    targetBranchCode: 'MALIR01',
    enableSharing: false,
    createdBy: 'Hafiz Muhammad Amir Khan',
    updatedOn: '2026-07-25',
    order: 5,
    viewsCount: 54,
    bookmarksCount: 12
  }
];

// INITIAL SPIRITUAL PERSONALITIES (سلسلے کے بزرگوں کی معلومات)
export const initialSpiritualPersonalities: SpiritualPersonality[] = [
  {
    id: 'sp-1',
    name: 'پیر سید حسام الدین عثمانی قدس سرہُ',
    title: 'سرپرستِ اعلیٰ و پیرِ طریقہ',
    bio: `سلسلہ عالیہ عثمانیہ کے بانی و سرپرستِ اعلیٰ حضرت پیر سید حسام الدین عثمانی رحمہ اللہ علیہ انیسویں صدی کے جلیل القدر عارف باللہ اور تزکیہ و احسان کے عظیم داعی تھے۔\n\nآپ نے تمام عمر خدمتِ خلق، اشاعتِ سنت اور اصلاحِ احوال کے لیے وقف فرمائی۔ آپ کی خانقاہِ عالیہ طریقت، ذکرِ الٰہی اور معرفت کا عظیم مرکز رہی جہاں ہزاروں سالکین نے توبہ کی اور راہِ ہدایت پر گامزن ہوئے۔\n\nآپ کے ملفوظات شریف اور احادیثِ مبارکہ کی روشنی میں مرتب کردہ نصاب آج بھی خانقاہی نظام کا سنگِ بنیاد ہے۔`,
    images: [
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&q=80&w=800'
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
    status: 'published',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-07-30T00:00:00.000Z'
  },
  {
    id: 'sp-2',
    name: 'حضرت خواجہ محمد عثمان رحمہ اللہ',
    title: 'شیخِ طریقہ و صاحبِ سلوک',
    bio: `حضرت خواجہ محمد عثمان رحمہ اللہ علیہ سلسلہ کے جلیل القدر مشائخ میں سے ہیں۔ آپ نے علومِ ظاہری و باطنی کو یکجا فرمایا اور سالکین کی تربیتِ روحانی میں بے مثال مقام حاصل کیا۔\n\nآپ کے ارشادات و نصائح میں اخلاص، توکل، اتباعِ سنت اور کثرتِ ذکرِ الٰہی کا خاص درس ملتا ہے۔`,
    images: [
      'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800'
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    status: 'published',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-07-30T00:00:00.000Z'
  },
  {
    id: 'sp-3',
    name: 'حضرت مولانا مفتی شاہاب الدین عثمانی',
    title: 'محدثِ کبیر و استادِ حدیث',
    bio: `فقہ و حدیث کے عظیم عالم اور سلسلہ عالیہ کے ممتاز محقق، جنہوں نے علم اور عمل کے میدان میں گراں قدر خدمات سرانجام دیں۔ آپ کے تحریر کردہ رسائل روحانی اصلاح میں کلیدی حیثیت رکھتے ہیں۔`,
    images: [
      'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=800'
    ],
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
    status: 'published',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-07-30T00:00:00.000Z'
  }
];



export const initialPostSplashScreens: PostSplashScreenItem[] = [
  {
    id: 'post-splash-default',
    title: 'درودِ پاک و دعاۓ برکت',
    titleEnglish: 'Salawat & Blessing Prayer',
    bismillahText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    mainArabicText: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ عَدَدَ كُلِّ شَيْءٍ مَعْلُومٍ لَكَ، رَبِّ أَرِنِي بِجَمَالِكَ وَجَمَالَهَا يَا رَسُولَ اللَّهِ، يَا حَبِيبَ اللَّهِ، يَا خَيْرَ خَلْقِ اللَّهِ، يَا نُورَ عَرْشِ اللَّهِ، يَا نُوراً مِنْ نُورِ اللَّهِ، مُحَمَّدْ رَسُولُ اللَّهِ، صَلَّى اللَّهُ تَعَالَى عَلَيْهِ وَسَلَّمَ، يَا زَيْنَا، يَا زَيْنَا۔',
    urduTranslation: 'اللہ تعالیٰ ہمیں حضور نبی کریم ﷺ کی سچی محبت، ادب، اتباع اور شفاعت نصیب فرمائے، اور دنیا و آخرت میں آپ ﷺ کی رضا و قرب عطا فرمائے۔ آمین یا رب العالمین۔',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
    durationSeconds: 15,
    isEnabled: true,
    order: 1,
    createdAt: new Date().toISOString()
  }
];
