// Demo product catalog for TechShop.
// Images are placeholder URLs from Unsplash — the user will swap them later.
// Prices are in KZT (Kazakhstani Tenge).

export const CATEGORIES = [
  { id: 'smartphones', ru: 'Смартфоны', kz: 'Смартфондар' },
  { id: 'laptops', ru: 'Ноутбуки', kz: 'Ноутбуктар' },
]

export const products = [
  // ───────────── SMARTPHONES ─────────────
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'smartphones',
    price: 749000,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    description: {
      ru: 'Флагман Apple с титановым корпусом, чипом A17 Pro и революционной камерой 48 МП.',
      kz: 'Титан корпусы, A17 Pro чипі және революциялық 48 МП камерасы бар Apple флагманы.',
    },
    shortSpecs: {
      ru: '6.1" OLED · A17 Pro · 256 ГБ',
      kz: '6.1" OLED · A17 Pro · 256 ГБ',
    },
    specifications: {
      display: '6.1" Super Retina XDR OLED, 120 Hz',
      processor: 'Apple A17 Pro',
      ram: '8 GB',
      storage: '256 GB',
      camera: '48 + 12 + 12 MP',
      battery: '3274 mAh',
      os: 'iOS 17',
    },
  },
  {
    id: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    price: 829000,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    description: {
      ru: 'Galaxy AI, S Pen, дисплей 6.8" QHD+ и камера 200 МП с космическим зумом.',
      kz: 'Galaxy AI, S Pen, 6.8" QHD+ дисплейі және ғарыштық масштабтауы бар 200 МП камера.',
    },
    shortSpecs: {
      ru: '6.8" AMOLED · Snapdragon 8 Gen 3 · 512 ГБ',
      kz: '6.8" AMOLED · Snapdragon 8 Gen 3 · 512 ГБ',
    },
    specifications: {
      display: '6.8" Dynamic AMOLED 2X, 120 Hz',
      processor: 'Snapdragon 8 Gen 3 for Galaxy',
      ram: '12 GB',
      storage: '512 GB',
      camera: '200 + 50 + 12 + 10 MP',
      battery: '5000 mAh',
      os: 'Android 14, One UI 6.1',
    },
  },
  {
    id: 'xiaomi-14',
    name: 'Xiaomi 14',
    brand: 'Xiaomi',
    category: 'smartphones',
    price: 459000,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    description: {
      ru: 'Компактный флагман с оптикой Leica и Snapdragon 8 Gen 3.',
      kz: 'Leica оптикасы және Snapdragon 8 Gen 3 чипі бар ықшам флагман.',
    },
    shortSpecs: {
      ru: '6.36" LTPO · Leica · 512 ГБ',
      kz: '6.36" LTPO · Leica · 512 ГБ',
    },
    specifications: {
      display: '6.36" LTPO OLED, 120 Hz',
      processor: 'Snapdragon 8 Gen 3',
      ram: '12 GB',
      storage: '512 GB',
      camera: '50 + 50 + 50 MP Leica',
      battery: '4610 mAh',
      os: 'HyperOS (Android 14)',
    },
  },
  {
    id: 'google-pixel-8-pro',
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    category: 'smartphones',
    price: 549000,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1598327105854-4b0e7c0eba83?auto=format&fit=crop&w=800&q=80',
    description: {
      ru: 'Чистый Android и лучшие в классе AI-функции на чипе Tensor G3.',
      kz: 'Таза Android және Tensor G3 чипіндегі үздік AI функциялары.',
    },
    shortSpecs: {
      ru: '6.7" LTPO · Tensor G3 · 256 ГБ',
      kz: '6.7" LTPO · Tensor G3 · 256 ГБ',
    },
    specifications: {
      display: '6.7" LTPO OLED, 120 Hz',
      processor: 'Google Tensor G3',
      ram: '12 GB',
      storage: '256 GB',
      camera: '50 + 48 + 48 MP',
      battery: '5050 mAh',
      os: 'Android 14',
    },
  },
  {
    id: 'oneplus-12',
    name: 'OnePlus 12',
    brand: 'OnePlus',
    category: 'smartphones',
    price: 419000,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    description: {
      ru: 'Сверхбыстрая зарядка 100 Вт, камера Hasselblad и яркий 4500-нит дисплей.',
      kz: '100 Вт жылдам зарядтау, Hasselblad камерасы және 4500-нит жарық дисплей.',
    },
    shortSpecs: {
      ru: '6.82" AMOLED · 100W · 256 ГБ',
      kz: '6.82" AMOLED · 100W · 256 ГБ',
    },
    specifications: {
      display: '6.82" LTPO AMOLED, 120 Hz',
      processor: 'Snapdragon 8 Gen 3',
      ram: '12 GB',
      storage: '256 GB',
      camera: '50 + 64 + 48 MP Hasselblad',
      battery: '5400 mAh',
      os: 'OxygenOS 14 (Android 14)',
    },
  },
  {
    id: 'samsung-galaxy-s24',
    name: 'Samsung Galaxy S24',
    brand: 'Samsung',
    category: 'smartphones',
    price: 489000,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80',
    description: {
      ru: 'Компактный Galaxy с Exynos 2400 и полным набором функций Galaxy AI.',
      kz: 'Exynos 2400 чипі және толық Galaxy AI функциялары бар ықшам Galaxy.',
    },
    shortSpecs: {
      ru: '6.2" AMOLED · Exynos 2400 · 256 ГБ',
      kz: '6.2" AMOLED · Exynos 2400 · 256 ГБ',
    },
    specifications: {
      display: '6.2" Dynamic AMOLED 2X, 120 Hz',
      processor: 'Exynos 2400',
      ram: '8 GB',
      storage: '256 GB',
      camera: '50 + 10 + 12 MP',
      battery: '4000 mAh',
      os: 'Android 14, One UI 6.1',
    },
  },

  // ───────────── LAPTOPS ─────────────
  {
    id: 'macbook-pro-m3',
    name: 'MacBook Pro 14" M3 Pro',
    brand: 'Apple',
    category: 'laptops',
    price: 1290000,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    description: {
      ru: 'Профессиональный ноутбук с чипом M3 Pro, дисплеем Liquid Retina XDR и до 22 часов работы.',
      kz: 'M3 Pro чипі, Liquid Retina XDR дисплейі және 22 сағатқа дейін жұмыс істейтін кәсіби ноутбук.',
    },
    shortSpecs: {
      ru: '14.2" XDR · M3 Pro · 18 ГБ · 512 ГБ',
      kz: '14.2" XDR · M3 Pro · 18 ГБ · 512 ГБ',
    },
    specifications: {
      display: '14.2" Liquid Retina XDR, 120 Hz',
      processor: 'Apple M3 Pro (12-core CPU)',
      ram: '18 GB unified',
      storage: '512 GB SSD',
      graphics: '18-core GPU',
      battery: 'до 18 часов',
      os: 'macOS Sonoma',
    },
  },
  {
    id: 'asus-rog-strix-g16',
    name: 'ASUS ROG Strix G16',
    brand: 'ASUS',
    category: 'laptops',
    price: 1090000,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=800&q=80',
    description: {
      ru: 'Игровой ноутбук с Intel Core i9 и GeForce RTX 4070 для максимального FPS.',
      kz: 'Барынша FPS үшін Intel Core i9 және GeForce RTX 4070 бар ойын ноутбугі.',
    },
    shortSpecs: {
      ru: '16" QHD+ 240Hz · i9 · RTX 4070',
      kz: '16" QHD+ 240Hz · i9 · RTX 4070',
    },
    specifications: {
      display: '16" QHD+ IPS, 240 Hz',
      processor: 'Intel Core i9-14900HX',
      ram: '32 GB DDR5',
      storage: '1 TB NVMe SSD',
      graphics: 'NVIDIA GeForce RTX 4070 8 GB',
      battery: '90 Wh',
      os: 'Windows 11 Home',
    },
  },
  {
    id: 'lenovo-legion-pro-7',
    name: 'Lenovo Legion Pro 7',
    brand: 'Lenovo',
    category: 'laptops',
    price: 1190000,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    description: {
      ru: 'Топовый Legion с RTX 4080, продвинутым охлаждением Coldfront и клавиатурой TrueStrike.',
      kz: 'RTX 4080, жетілдірілген Coldfront салқындатуы және TrueStrike пернетақтасы бар үздік Legion.',
    },
    shortSpecs: {
      ru: '16" WQXGA 240Hz · i9 · RTX 4080',
      kz: '16" WQXGA 240Hz · i9 · RTX 4080',
    },
    specifications: {
      display: '16" WQXGA IPS, 240 Hz',
      processor: 'Intel Core i9-14900HX',
      ram: '32 GB DDR5',
      storage: '1 TB NVMe SSD',
      graphics: 'NVIDIA GeForce RTX 4080 12 GB',
      battery: '99.99 Wh',
      os: 'Windows 11 Home',
    },
  },
  {
    id: 'dell-xps-15',
    name: 'Dell XPS 15 (9530)',
    brand: 'Dell',
    category: 'laptops',
    price: 990000,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    description: {
      ru: 'Премиум-ультрабук с OLED-дисплеем 3.5K и видеокартой RTX 4060 в тонком корпусе.',
      kz: 'Жұқа корпустағы 3.5K OLED дисплейі және RTX 4060 видеокартасы бар премиум-ультрабук.',
    },
    shortSpecs: {
      ru: '15.6" OLED 3.5K · i7 · RTX 4060',
      kz: '15.6" OLED 3.5K · i7 · RTX 4060',
    },
    specifications: {
      display: '15.6" OLED 3.5K Touch',
      processor: 'Intel Core i7-13700H',
      ram: '32 GB DDR5',
      storage: '1 TB NVMe SSD',
      graphics: 'NVIDIA GeForce RTX 4060 8 GB',
      battery: '86 Wh',
      os: 'Windows 11 Pro',
    },
  },
  {
    id: 'macbook-air-m3',
    name: 'MacBook Air 15" M3',
    brand: 'Apple',
    category: 'laptops',
    price: 829000,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    description: {
      ru: 'Лёгкий и тихий ноутбук с большим 15-дюймовым экраном и невероятной автономностью.',
      kz: '15 дюймдік үлкен экраны және ұзақ батареясы бар жеңіл және үнсіз ноутбук.',
    },
    shortSpecs: {
      ru: '15.3" Liquid Retina · M3 · 16 ГБ',
      kz: '15.3" Liquid Retina · M3 · 16 ГБ',
    },
    specifications: {
      display: '15.3" Liquid Retina',
      processor: 'Apple M3 (8-core CPU)',
      ram: '16 GB unified',
      storage: '512 GB SSD',
      graphics: '10-core GPU',
      battery: 'до 18 часов',
      os: 'macOS Sonoma',
    },
  },
  {
    id: 'hp-spectre-x360',
    name: 'HP Spectre x360 14',
    brand: 'HP',
    category: 'laptops',
    price: 749000,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80',
    description: {
      ru: 'Конвертируемый ультрабук 2-в-1 с OLED-дисплеем и процессором Intel Core Ultra 7.',
      kz: 'OLED дисплейі және Intel Core Ultra 7 процессоры бар 2-в-1 ультрабук.',
    },
    shortSpecs: {
      ru: '14" OLED Touch · Core Ultra 7 · 16 ГБ',
      kz: '14" OLED Touch · Core Ultra 7 · 16 ГБ',
    },
    specifications: {
      display: '14" 2.8K OLED Touch',
      processor: 'Intel Core Ultra 7 155H',
      ram: '16 GB LPDDR5x',
      storage: '1 TB NVMe SSD',
      graphics: 'Intel Arc Graphics',
      battery: '68 Wh',
      os: 'Windows 11 Home',
    },
  },
]

export const getProductById = (id) => products.find((p) => p.id === id)

export const getFeatured = () =>
  // 4 highest-rated items, mixing both categories
  [...products].sort((a, b) => b.rating - a.rating).slice(0, 4)
