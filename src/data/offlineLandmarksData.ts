/**
 * Local Offline Landmarks Dataset
 * Bundles detailed coordinates, historical metadata, and Qibla calculations
 * for major Pakistani cities, historical mosques, and global Islamic holy sites.
 * Works 100% offline without external network calls.
 */

export interface OfflineLandmark {
  id: string;
  nameEn: string;
  nameUrdu: string;
  category: 'holy_site' | 'historical_mosque' | 'major_city' | 'regional_center';
  country: string;
  provinceOrState?: string;
  lat: number;
  lng: number;
  elevationMeters?: number;
  descriptionEn: string;
  descriptionUrdu: string;
}

export const OFFLINE_LANDMARKS: OfflineLandmark[] = [
  // --- GLOBAL HOLY SITES ---
  {
    id: 'makkah_kaaba',
    nameEn: 'Holy Kaaba (Masjid al-Haram)',
    nameUrdu: 'مسجد الحرام و خانہ کعبہ (مکہ مکرمہ)',
    category: 'holy_site',
    country: 'Saudi Arabia',
    lat: 21.4225,
    lng: 39.8262,
    elevationMeters: 277,
    descriptionEn: 'The most sacred site in Islam, toward which all Muslims face during prayer (Qibla).',
    descriptionUrdu: 'اسلام کا سب سے مقدس ترین مقام، تمام مسلمان نماز میں اسی سمت کا رخ کرتے ہیں (قبلہ)۔'
  },
  {
    id: 'madinah_nabawi',
    nameEn: 'Al-Masjid an-Nabawi',
    nameUrdu: 'مسجدِ نبوی (مدینہ منورہ)',
    category: 'holy_site',
    country: 'Saudi Arabia',
    lat: 24.4672,
    lng: 39.6112,
    elevationMeters: 608,
    descriptionEn: 'The Prophet\'s Mosque in Madinah, built by Prophet Muhammad (PBUH) and housing the Rawdah Mubarak.',
    descriptionUrdu: 'مدینہ منورہ میں نبی کریم صلی اللہ علیہ و سلم کی قائم کردہ مسجدِ مبارک اور روضہ اطہر۔'
  },
  {
    id: 'jerusalem_aqsa',
    nameEn: 'Al-Masjid Al-Aqsa',
    nameUrdu: 'مسجدِ اقصی (بیت المقدس)',
    category: 'holy_site',
    country: 'Palestine',
    lat: 31.7761,
    lng: 35.2358,
    elevationMeters: 740,
    descriptionEn: 'The First Qibla of Islam and the third holiest sanctuary, site of Isra and Mi\'raj.',
    descriptionUrdu: 'اسلام کا پہلا قبلہ اور تیسرا مقدس ترین حرم، واقعہ اسراء و معراج کا مرکز۔'
  },

  // --- HISTORICAL MOSQUES IN PAKISTAN ---
  {
    id: 'faisal_mosque',
    nameEn: 'Faisal Mosque (Islamabad)',
    nameUrdu: 'فیصل مسجد (اسلام آباد)',
    category: 'historical_mosque',
    country: 'Pakistan',
    provinceOrState: 'Islamabad Capital Territory',
    lat: 33.7297,
    lng: 73.0372,
    elevationMeters: 600,
    descriptionEn: 'Iconic national mosque of Pakistan designed by Vedat Dalokay at the foot of Margalla Hills.',
    descriptionUrdu: 'مارگلہ کی پہاڑیوں کے دامن میں واقع پاکستان کی شاندار اور قومی علامت فیصل مسجد۔'
  },
  {
    id: 'badshahi_mosque',
    nameEn: 'Badshahi Mosque (Lahore)',
    nameUrdu: 'بادشاہی مسجد (لاہور)',
    category: 'historical_mosque',
    country: 'Pakistan',
    provinceOrState: 'Punjab',
    lat: 31.5882,
    lng: 74.3096,
    elevationMeters: 217,
    descriptionEn: 'Historic Mughal-era grand mosque commissioned by Emperor Aurangzeb in 1671.',
    descriptionUrdu: 'مغل شہنشاہ اورنگزیب عالمگیر کی ۱۶۷۱ء میں تعمیر کردہ شاندار تاریخی سرخ پتھر کی مسجد۔'
  },
  {
    id: 'shah_jahan_mosque',
    nameEn: 'Shah Jahan Mosque (Thatta)',
    nameUrdu: 'شاہجہانی مسجد (ٹھٹہ)',
    category: 'historical_mosque',
    country: 'Pakistan',
    provinceOrState: 'Sindh',
    lat: 24.7471,
    lng: 67.9254,
    elevationMeters: 18,
    descriptionEn: 'Built in 1647 by Mughal Emperor Shah Jahan, famous for intricate red brickwork and 93 domes.',
    descriptionUrdu: 'مغل شہنشاہ شاہجہان کی ٹھٹہ میں بنائی گئی شاندار نیلی کاشی کاری اور ۹۳ گنبدوں والی مسجد۔'
  },
  {
    id: 'masjid_e_tooba',
    nameEn: 'Masjid-e-Tooba (Karachi)',
    nameUrdu: 'مسجدِ طوبیٰ (کراچی)',
    category: 'historical_mosque',
    country: 'Pakistan',
    provinceOrState: 'Sindh',
    lat: 24.8322,
    lng: 67.0573,
    elevationMeters: 15,
    descriptionEn: 'Famous single-dome mosque in Defence, Karachi, renowned for being the world\'s largest single-dome pillarless mosque.',
    descriptionUrdu: 'کراچی ڈی ایچ اے میں واقع دنیا کا سب سے بڑا بغیر ستون والا ایک گنبد کا تعمیراتی شاہکار۔'
  },
  {
    id: 'bhong_mosque',
    nameEn: 'Bhong Mosque (Rahim Yar Khan)',
    nameUrdu: 'بھونگ مسجد (رحیم یار خان)',
    category: 'historical_mosque',
    country: 'Pakistan',
    provinceOrState: 'Punjab',
    lat: 28.4093,
    lng: 69.9142,
    elevationMeters: 80,
    descriptionEn: 'Masterpiece of Islamic calligraphy and traditional craftsmanship, winner of Aga Khan Award for Architecture.',
    descriptionUrdu: 'آغا خان فنِ تعمیر ایوارڈ یافتہ روایتی و خوبصورت اسلامی خطاطی و نقاشی کی شاہکار مسجد۔'
  },
  {
    id: 'wazir_khan_mosque',
    nameEn: 'Wazir Khan Mosque (Lahore)',
    nameUrdu: 'مسجد وزیر خان (لاہور)',
    category: 'historical_mosque',
    country: 'Pakistan',
    provinceOrState: 'Punjab',
    lat: 31.5830,
    lng: 74.3168,
    elevationMeters: 215,
    descriptionEn: '17th century Mughal mosque famous for its exquisite Fresco paintings and Kashi-kari tilework.',
    descriptionUrdu: 'اندرونِ لاہور کی ۱۷ویں صدی کی مشہور مغل مسجد جو اپنے نایاب فرسکو ڈیزائن اور کاشی کاری کے لیے معروف ہے۔'
  },
  {
    id: 'mohabbat_khan_mosque',
    nameEn: 'Mahabat Khan Mosque (Peshawar)',
    nameUrdu: 'مسجد مہابت خان (پشاور)',
    category: 'historical_mosque',
    country: 'Pakistan',
    provinceOrState: 'Khyber Pakhtunkhwa',
    lat: 34.0116,
    lng: 71.5694,
    elevationMeters: 350,
    descriptionEn: '17th-century Mughal-era mosque located in the heart of old Peshawar city.',
    descriptionUrdu: 'اندرونِ پشاور کی ۱۷ویں صدی کی تاریخی مغل طرز کی مسحور کن سفید مسجد۔'
  },
  {
    id: 'grand_jamia_karachi',
    nameEn: 'Grand Jamia Mosque (Karachi)',
    nameUrdu: 'گرینڈ جامع مسجد (کراچی)',
    category: 'historical_mosque',
    country: 'Pakistan',
    provinceOrState: 'Sindh',
    lat: 24.9754,
    lng: 67.2341,
    elevationMeters: 45,
    descriptionEn: 'One of the largest mosques in South Asia featuring Mughal-Turkish Islamic architecture.',
    descriptionUrdu: 'جنوبی ایشیا کی بڑی مساجد میں سے ایک، مغل اور ترکی تعمیراتی امتزاج کی حامل عظیم الشان مسجد۔'
  },

  // --- PAKISTANI CITIES & DISTRICT HEADQUARTERS ---
  {
    id: 'karachi_city',
    nameEn: 'Karachi Central',
    nameUrdu: 'کراچی (مرکز)',
    category: 'major_city',
    country: 'Pakistan',
    provinceOrState: 'Sindh',
    lat: 24.8607,
    lng: 67.0011,
    elevationMeters: 10,
    descriptionEn: 'Largest city and economic capital of Pakistan, coastal hub on the Arabian Sea.',
    descriptionUrdu: 'پاکستان کا سب سے بڑا معاشی و بحری مرکز، عروس البلاد کراچی۔'
  },
  {
    id: 'lahore_city',
    nameEn: 'Lahore Central',
    nameUrdu: 'لاہور (مرکز)',
    category: 'major_city',
    country: 'Pakistan',
    provinceOrState: 'Punjab',
    lat: 31.5204,
    lng: 74.3587,
    elevationMeters: 217,
    descriptionEn: 'Cultural capital of Pakistan, famous for historic gardens and Mughal heritage.',
    descriptionUrdu: 'پاکستان کا ثقافتی و علمی دل، داتا کی نگری لاہور۔'
  },
  {
    id: 'islamabad_city',
    nameEn: 'Islamabad Capital',
    nameUrdu: 'اسلام آباد (دارالحکومت)',
    category: 'major_city',
    country: 'Pakistan',
    provinceOrState: 'ICT',
    lat: 33.6844,
    lng: 73.0479,
    elevationMeters: 540,
    descriptionEn: 'Federal capital city of Pakistan, situated under Margalla Hills.',
    descriptionUrdu: 'اسلامی جمہوریہ پاکستان کا خوبصورت وفاقی دارالحکومت۔'
  },
  {
    id: 'rawalpindi_city',
    nameEn: 'Rawalpindi',
    nameUrdu: 'راولپنڈی',
    category: 'major_city',
    country: 'Pakistan',
    provinceOrState: 'Punjab',
    lat: 33.5651,
    lng: 73.0169,
    elevationMeters: 500,
    descriptionEn: 'Twin city to Islamabad, historic garrison and commercial metropolis.',
    descriptionUrdu: 'اسلام آباد کا جڑواں شہر، تاریخ ساز اور مصروف ترین تجارتی مرکز۔'
  },
  {
    id: 'faisalabad_city',
    nameEn: 'Faisalabad',
    nameUrdu: 'فیصل آباد',
    category: 'major_city',
    country: 'Pakistan',
    provinceOrState: 'Punjab',
    lat: 31.4504,
    lng: 73.1350,
    elevationMeters: 184,
    descriptionEn: 'Industrial textiling hub of Pakistan, formerly known as Lyallpur.',
    descriptionUrdu: 'پاکستان کا صنعتی و ٹیکسٹائل کا گڑھ (سابقہ لائل پور)۔'
  },
  {
    id: 'peshawar_city',
    nameEn: 'Peshawar',
    nameUrdu: 'پشاور',
    category: 'major_city',
    country: 'Pakistan',
    provinceOrState: 'Khyber Pakhtunkhwa',
    lat: 34.0151,
    lng: 71.5249,
    elevationMeters: 359,
    descriptionEn: 'Capital of KPK, historic city of flowers and ancient trade route crossroads.',
    descriptionUrdu: 'خیبر پختونخوا کا تاریخی دارالحکومت، شاہراہِ ریشم کی درخشندہ وادی۔'
  },
  {
    id: 'multan_city',
    nameEn: 'Multan',
    nameUrdu: 'ملتان (مدینة الاولیاء)',
    category: 'major_city',
    country: 'Pakistan',
    provinceOrState: 'Punjab',
    lat: 30.1575,
    lng: 71.5249,
    elevationMeters: 122,
    descriptionEn: 'City of Saints and Mystics, famous for Sufi shrines and pottery.',
    descriptionUrdu: 'مدینۃ الاولیاء، حضرت بہاؤ الدین زکریا و شاہ رکنِ عالم کا دیس۔'
  },
  {
    id: 'quetta_city',
    nameEn: 'Quetta',
    nameUrdu: 'کوئٹہ',
    category: 'major_city',
    country: 'Pakistan',
    provinceOrState: 'Balochistan',
    lat: 30.1798,
    lng: 66.9750,
    elevationMeters: 1680,
    descriptionEn: 'Provincial capital of Balochistan, mountain fruit basket surrounded by Murdar hills.',
    descriptionUrdu: 'بلوچستان کا صوبائی دارالحکومت اور خوبصورت پہاڑی وادی۔'
  },
  {
    id: 'hyderabad_city',
    nameEn: 'Hyderabad',
    nameUrdu: 'حیدرآباد',
    category: 'major_city',
    country: 'Pakistan',
    provinceOrState: 'Sindh',
    lat: 25.3960,
    lng: 68.3578,
    elevationMeters: 13,
    descriptionEn: 'Historic capital of Kalhoros and Talpurs on the Indus River.',
    descriptionUrdu: 'سندھ کا تاریخی علمی و ثقافتی شہر، ٹھنڈی سڑک و دلکش ہواؤں کا مسکن۔'
  },
  {
    id: 'gujranwala_city',
    nameEn: 'Gujranwala',
    nameUrdu: 'گوجرانوالہ',
    category: 'major_city',
    country: 'Pakistan',
    provinceOrState: 'Punjab',
    lat: 32.1877,
    lng: 74.1945,
    elevationMeters: 226,
    descriptionEn: 'City of wrestlers and industrial manufacturing center of Punjab.',
    descriptionUrdu: 'پہلوانوں کا شہر اور صنعتی و تجارتی میدان کا سرِ فہرست مرکز۔'
  },
  {
    id: 'sialkot_city',
    nameEn: 'Sialkot',
    nameUrdu: 'سیالکوٹ',
    category: 'major_city',
    country: 'Pakistan',
    provinceOrState: 'Punjab',
    lat: 32.4945,
    lng: 74.5229,
    elevationMeters: 256,
    descriptionEn: 'Birthplace of Allama Iqbal and world leader in sports goods & surgical tools.',
    descriptionUrdu: 'شاعرِ مشرق ڈاکٹر علامہ محمد اقبالؒ کی جائے پیدائش۔'
  },
  {
    id: 'sukkur_city',
    nameEn: 'Sukkur',
    nameUrdu: 'سکھر',
    category: 'major_city',
    country: 'Pakistan',
    provinceOrState: 'Sindh',
    lat: 27.7131,
    lng: 68.8492,
    elevationMeters: 67,
    descriptionEn: 'Historic city on the Indus River famous for Sukkur Barrage and Lansdowne Bridge.',
    descriptionUrdu: 'دریائے سندھ کے کنارے آباد سکھر بیراج کا تاریخی شہر۔'
  },
  {
    id: 'abbottabad_city',
    nameEn: 'Abbottabad',
    nameUrdu: 'ایبٹ آباد',
    category: 'regional_center',
    country: 'Pakistan',
    provinceOrState: 'Khyber Pakhtunkhwa',
    lat: 34.1688,
    lng: 73.2215,
    elevationMeters: 1256,
    descriptionEn: 'Scenic pine mountain city near Galyat and PMA Kakul.',
    descriptionUrdu: 'صنوبر کے خوبصورت درختوں اور دلکش موسم والا پہاڑی شہر۔'
  },
  {
    id: 'gilgit_city',
    nameEn: 'Gilgit',
    nameUrdu: 'گلگت',
    category: 'regional_center',
    country: 'Pakistan',
    provinceOrState: 'Gilgit-Baltistan',
    lat: 35.9208,
    lng: 74.3144,
    elevationMeters: 1500,
    descriptionEn: 'Capital of Gilgit-Baltistan along the Karakoram Highway.',
    descriptionUrdu: 'شاہراہِ قراقرم کے سنگم پر واقع گلگت بلتستان کا مرکز۔'
  },
  {
    id: 'skardu_city',
    nameEn: 'Skardu',
    nameUrdu: 'سکردو',
    category: 'regional_center',
    country: 'Pakistan',
    provinceOrState: 'Gilgit-Baltistan',
    lat: 35.2989,
    lng: 75.6337,
    elevationMeters: 2228,
    descriptionEn: 'Gateway to K2 and high Karakoram peaks, surrounded by Shangrila and Deosai.',
    descriptionUrdu: 'کے-ٹو (K2) اور دیوسائی کے بلند و بالا سحر انگیز سرسبز میدانوں کا باب۔'
  },
  {
    id: 'gwadar_city',
    nameEn: 'Gwadar',
    nameUrdu: 'گوادر',
    category: 'regional_center',
    country: 'Pakistan',
    provinceOrState: 'Balochistan',
    lat: 25.1264,
    lng: 62.3225,
    elevationMeters: 8,
    descriptionEn: 'Deep-sea port city on the Arabian Sea, cornerstone of CPEC.',
    descriptionUrdu: 'بحیرہ عرب پر واقع گہرے پانیوں کی عالمی اہمیت کی حامل بندرگاہ۔'
  },
  {
    id: 'muzaffarabad_city',
    nameEn: 'Muzaffarabad',
    nameUrdu: 'مظفر آباد',
    category: 'regional_center',
    country: 'Pakistan',
    provinceOrState: 'Azad Jammu & Kashmir',
    lat: 34.3700,
    lng: 73.4711,
    elevationMeters: 737,
    descriptionEn: 'Capital of Azad Kashmir located at the confluence of Neelum and Jhelum rivers.',
    descriptionUrdu: 'آزاد کشمیر کا خوبصورت دارالحکومت، وادی نیلم کا حسین دراز۔'
  },
  {
    id: 'bahawalpur_city',
    nameEn: 'Bahawalpur',
    nameUrdu: 'بہاولپور',
    category: 'regional_center',
    country: 'Pakistan',
    provinceOrState: 'Punjab',
    lat: 29.3957,
    lng: 71.6833,
    elevationMeters: 116,
    descriptionEn: 'Princely state heritage city, home to Noor Mahal and Derawar Fort.',
    descriptionUrdu: 'نوابین کی نگری، نور محل اور قلعہ دراوڑ کا تاریخی مسکن۔'
  },
  {
    id: 'sargodha_city',
    nameEn: 'Sargodha',
    nameUrdu: 'سرگودھا',
    category: 'regional_center',
    country: 'Pakistan',
    provinceOrState: 'Punjab',
    lat: 32.0836,
    lng: 72.6711,
    elevationMeters: 190,
    descriptionEn: 'City of Eagles, citrus orchards and PAF Airbase hub.',
    descriptionUrdu: 'شاہینوں کا شہر اور باغات کا شاندار مرکز۔'
  },

  // --- OTHER NOTABLE GLOBAL ISLAMIC LANDMARKS ---
  {
    id: 'blue_mosque_istanbul',
    nameEn: 'Sultan Ahmed Mosque (Blue Mosque)',
    nameUrdu: 'سلطان احمد مسجد (بلیو ماسکو - استنبول)',
    category: 'historical_mosque',
    country: 'Turkey',
    lat: 41.0054,
    lng: 28.9768,
    elevationMeters: 35,
    descriptionEn: 'Iconic Ottoman-era mosque in Istanbul renowned for hand-painted Iznik blue tiles.',
    descriptionUrdu: 'عثمانی دورِ حکومت کا عظیم الشان تعمیراتی شاہکار استنبول۔'
  },
  {
    id: 'sheikh_zayed_abudhabi',
    nameEn: 'Sheikh Zayed Grand Mosque',
    nameUrdu: 'شیخ زاید گرینڈ مسجد (ابوظہبی)',
    category: 'historical_mosque',
    country: 'United Arab Emirates',
    lat: 24.4128,
    lng: 54.4750,
    elevationMeters: 12,
    descriptionEn: 'Modern architectural marvel featuring 82 white marble domes and 24-carat gold chandeliers.',
    descriptionUrdu: 'ابوظہبی میں سفید سنگِ مرمر کی ۸۲ گنبدوں پر مشتمل دنیا کی حسین ترین مسجد۔'
  },
  {
    id: 'al_azhar_cairo',
    nameEn: 'Al-Azhar Mosque & University',
    nameUrdu: 'جامعہ الازہر و جامع مسجد (قاہرہ)',
    category: 'historical_mosque',
    country: 'Egypt',
    lat: 30.0457,
    lng: 31.2627,
    elevationMeters: 38,
    descriptionEn: 'Founded in 970 CE, one of the oldest centers of Islamic learning and Fatimid architecture.',
    descriptionUrdu: '۹۷۰ء میں قائم کردہ علومِ اسلامیہ کا قدیم ترین اور معتبر ترین عالمی ادارہ۔'
  }
];

/**
 * Filter offline landmarks by query text or category
 */
export function searchOfflineLandmarks(
  query: string,
  category: string = 'all'
): OfflineLandmark[] {
  const cleanQ = query.trim().toLowerCase();
  return OFFLINE_LANDMARKS.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    const matchesText =
      !cleanQ ||
      item.nameEn.toLowerCase().includes(cleanQ) ||
      item.nameUrdu.toLowerCase().includes(cleanQ) ||
      item.country.toLowerCase().includes(cleanQ) ||
      (item.provinceOrState && item.provinceOrState.toLowerCase().includes(cleanQ));
    return matchesCategory && matchesText;
  });
}
