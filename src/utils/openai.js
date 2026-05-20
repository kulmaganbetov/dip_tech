// Thin wrapper around the OpenAI Chat Completions API.
// The API key is read from VITE_OPENAI_API_KEY. NOTE: shipping a key in the
// browser is only acceptable for demo/local dev — in production you should
// proxy via your own backend.

import { products } from '../data/products'

const SYSTEM_PROMPT = `You are TechShop AI — a professional, friendly sales consultant
for an online electronics store in Kazakhstan. You sell smartphones and laptops.

Style:
- Concise, expert, polite.
- Reply in the same language as the user (Russian or Kazakh by default).
- Recommend specific products from the TechShop catalog when relevant and
  explain WHY they fit the user's need (specs, price, use case).
- Always mention the price in KZT (₸) when recommending.
- When the user is unsure, ask one short clarifying question (budget,
  use case, preferred brand).

Catalog (JSON):
${JSON.stringify(
  products.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price_kzt: p.price,
    specs: p.specifications,
  })),
  null,
  2
)}`

export function hasOpenAIKey() {
  return Boolean(import.meta.env.VITE_OPENAI_API_KEY)
}

/**
 * Generate a financial/sales report for the admin dashboard.
 * Falls back to a rich demo report when no API key is configured.
 * @param {{ totalRevenue:number, totalOrders:number, avgCheck:number, topProduct:string, growth:string, period:string }} stats
 * @param {'ru'|'kz'} lang
 */
export async function generateAdminReport(stats, lang = 'ru') {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) return demoAdminReport(stats, lang)

  const ru = lang === 'ru'
  const fmt = (n) => new Intl.NumberFormat(ru ? 'ru-RU' : 'kk-KZ').format(n) + ' ₸'

  const prompt = ru
    ? `Ты финансовый аналитик интернет-магазина электроники TechShop (Казахстан).
Данные за ${stats.period}:
- Выручка: ${fmt(stats.totalRevenue)}
- Заказов: ${stats.totalOrders}
- Средний чек: ${fmt(stats.avgCheck)}
- Лучший товар: ${stats.topProduct}
- Рост выручки: ${stats.growth}

Напиши структурированный финансовый отчёт с разделами:
1. Общие итоги
2. Ключевые тренды и выводы
3. Риски и точки роста
4. Рекомендации на следующий период

Кратко, по делу, как настоящий аналитик. Используй маркированные списки.`
    : `Сен TechShop (Қазақстан) электроника интернет-дүкенінің қаржы талдаушысысың.
${stats.period} деректері:
- Түсім: ${fmt(stats.totalRevenue)}
- Тапсырыстар: ${stats.totalOrders}
- Орташа чек: ${fmt(stats.avgCheck)}
- Үздік тауар: ${stats.topProduct}
- Түсім өсімі: ${stats.growth}

Бөлімдері бар құрылымдалған қаржылық есеп жаз:
1. Жалпы қорытындылар
2. Негізгі үрдістер мен тұжырымдар
3. Тәуекелдер мен өсу нүктелері
4. Келесі кезеңге ұсыныстар

Қысқаша, нақты, шынайы талдаушы сияқты. Таңбалы тізімдерді пайдалан.`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.55,
      messages: [
        { role: 'system', content: 'You are a financial analyst. Reply in the same language as the user prompt. Be concise and structured.' },
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenAI error ${res.status}: ${text}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}

function demoAdminReport(stats, lang = 'ru') {
  const ru = lang === 'ru'
  const fmt = (n) => new Intl.NumberFormat(ru ? 'ru-RU' : 'kk-KZ').format(n) + ' ₸'

  if (ru) {
    return `**Общие итоги**
• Выручка за период составила ${fmt(stats.totalRevenue)} — рост ${stats.growth} к предыдущему месяцу.
• Обработано ${stats.totalOrders} заказов, средний чек ${fmt(stats.avgCheck)}.
• Лидер продаж: ${stats.topProduct}.

**Ключевые тренды**
• Пиковые продажи приходятся на выходные дни (+25–30% к будням).
• Смартфоны формируют ~58% выручки, ноутбуки — ~42%.
• Органический трафик стабильно растёт третью неделю подряд.

**Риски и точки роста**
• Зависимость от топ-3 SKU составляет ~48% выручки — риск при дефиците.
• Сегмент ноутбуков показывает более высокий средний чек — потенциал для роста.
• Конверсия корзины в заказ: ~3.8% — ниже отраслевого ориентира в 4.5%.

**Рекомендации**
• Запустить email-рассылку с персональными скидками для повторных покупателей.
• Расширить ассортимент ноутбуков в среднем ценовом сегменте (200–400 тыс. ₸).
• Добавить программу лояльности для увеличения LTV клиента.`
  }

  return `**Жалпы қорытындылар**
• Кезеңдегі түсім ${fmt(stats.totalRevenue)} — өткен айға қарағанда ${stats.growth} өсім.
• ${stats.totalOrders} тапсырыс өңделді, орташа чек ${fmt(stats.avgCheck)}.
• Сату көшбасшысы: ${stats.topProduct}.

**Негізгі үрдістер**
• Сатылым шыңдары демалыс күндерінде байқалады (жұмыс күндерінен +25–30%).
• Смартфондар түсімнің ~58%-ын, ноутбуктар ~42%-ын құрайды.
• Органикалық трафик үшінші апта қатарынан тұрақты өсуде.

**Тәуекелдер мен өсу нүктелері**
• Үздік 3 SKU-ға тәуелділік түсімнің ~48%-ын құрайды — тапшылық кезінде тәуекел.
• Ноутбук сегменті жоғарырақ орташа чек көрсетеді — өсу потенциалы бар.
• Себеттен тапсырысқа конверсия: ~3.8% — салалық 4.5% деңгейінен төмен.

**Ұсыныстар**
• Қайталама сатып алушылар үшін жеке жеңілдіктер бойынша email-жіберілім іске қосу.
• Орта баға сегментіндегі (200–400 мың ₸) ноутбук ассортиментін кеңейту.
• Клиент LTV-сін арттыру үшін адалдық бағдарламасын қосу.`
}

/**
 * Send a chat message to OpenAI and return the assistant reply text.
 * @param {{role:'user'|'assistant', content:string}[]} history
 * @param {string} userMessage
 */
export async function chatWithAI(history, userMessage) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('Missing VITE_OPENAI_API_KEY')
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.6,
      messages,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenAI error ${res.status}: ${text}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}

/**
 * Analyse a completed order and return usage tips + complementary product
 * recommendations. Falls back to demoAnalysis when no API key is set.
 * @param {{ id: string, name: string, brand: string, category: string }[]} items
 * @param {'ru'|'kz'} lang
 */
export async function analyzeOrder(items, lang = 'ru') {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) return demoAnalysis(items, lang)

  const ru = lang === 'ru'
  const itemsList = items.map((i) => `${i.name} (${i.brand})`).join(', ')

  const prompt = ru
    ? `Покупатель только что купил в TechShop: ${itemsList}.
Дай структурированный ответ в двух частях:
1. "Советы по использованию" — 2–3 практических совета как максимально использовать эти устройства.
2. "Рекомендуем докупить" — 2–3 конкретных товара или аксессуара из каталога TechShop, которые хорошо дополнят покупку (с ценой в ₸ и кратким обоснованием).
Отвечай кратко и по делу.`
    : `Сатып алушы TechShop-тан жаңа ғана сатып алды: ${itemsList}.
Екі бөліктен тұратын құрылымдалған жауап беріңіз:
1. "Пайдалану кеңестері" — бұл құрылғыларды барынша тиімді пайдалану бойынша 2–3 практикалық кеңес.
2. "Қосымша ұсыныстар" — TechShop каталогынан сатып алуды жақсы толықтыратын 2–3 нақты тауар немесе аксессуар (₸ бағасымен және қысқаша негіздемемен).
Қысқаша және нақты жауап беріңіз.`

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ]

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.65,
      messages,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenAI error ${res.status}: ${text}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}

/**
 * Offline fallback for analyzeOrder. Produces realistic demo text based on
 * the purchased product categories.
 */
export function demoAnalysis(items, lang = 'ru') {
  const ru = lang === 'ru'
  const hasPhone = items.some((i) => i.category === 'smartphones')
  const hasLaptop = items.some((i) => i.category === 'laptops')
  const firstName = items[0]?.name ?? 'устройство'

  if (ru) {
    const tips = []
    const recs = []

    if (hasPhone) {
      tips.push('Активируйте Face ID / отпечаток пальца сразу после включения — это ускорит повседневное разблокирование.')
      tips.push('Установите автояркость и режим «Сон» для экономии заряда аккумулятора.')
      recs.push('Защитное стекло с олеофобным покрытием — от 3 900 ₸')
      recs.push('Силиконовый чехол MagSafe или с подставкой-кольцом — от 5 500 ₸')
    }
    if (hasLaptop) {
      tips.push('Первый раз зарядите ноутбук полностью, прежде чем начинать работу — это калибрует аккумулятор.')
      tips.push('Включите FileVault (macOS) или BitLocker (Windows) для защиты данных на диске.')
      recs.push('USB-C хаб с HDMI и USB-A портами — от 12 900 ₸')
      recs.push('Механическая клавиатура или беспроводная мышь для комфортной работы — от 8 500 ₸')
    }
    if (!hasPhone && !hasLaptop) {
      tips.push(`Зарегистрируйте ${firstName} на сайте производителя, чтобы активировать гарантию.`)
      tips.push('Сохраните оригинальную упаковку и чек — пригодится при гарантийном обслуживании.')
      recs.push('Качественный чехол или сумка для переноски — от 4 500 ₸')
    }

    return (
      `**Советы по использованию:**\n` +
      tips.map((t) => `• ${t}`).join('\n') +
      `\n\n**Рекомендуем докупить:**\n` +
      recs.map((r) => `• ${r}`).join('\n')
    )
  } else {
    const tips = []
    const recs = []

    if (hasPhone) {
      tips.push('Іске қосқаннан кейін бірден Face ID / саусақ ізін белсендіріңіз — күнделікті бекітуді жылдамдатады.')
      tips.push('Аккумулятор зарядын үнемдеу үшін авто жарықтық пен «Ұйқы» режимін орнатыңыз.')
      recs.push('Олеофобты жабынды қорғаныш шыны — 3 900 ₸ бастап')
      recs.push('MagSafe немесе сақиналы тұғыры бар силикон қапшық — 5 500 ₸ бастап')
    }
    if (hasLaptop) {
      tips.push('Жұмысты бастамас бұрын ноутбукты толық зарядтаңыз — бұл аккумуляторды калибрлейді.')
      tips.push('Дискідегі деректерді қорғау үшін FileVault (macOS) немесе BitLocker (Windows) іске қосыңыз.')
      recs.push('HDMI және USB-A порттары бар USB-C хаб — 12 900 ₸ бастап')
      recs.push('Ыңғайлы жұмыс үшін механикалық пернетақта немесе сымсыз тышқан — 8 500 ₸ бастап')
    }
    if (!hasPhone && !hasLaptop) {
      tips.push(`Кепілдікті белсендіру үшін ${firstName} өндіруші сайтына тіркеңіз.`)
      tips.push('Кепілдік қызметіне жүгіну кезінде пайдалы болу үшін түпнұсқа қорапты сақтаңыз.')
      recs.push('Сапалы қапшық немесе тасымалдауға арналған сөмке — 4 500 ₸ бастап')
    }

    return (
      `**Пайдалану кеңестері:**\n` +
      tips.map((t) => `• ${t}`).join('\n') +
      `\n\n**Қосымша ұсыныстар:**\n` +
      recs.map((r) => `• ${r}`).join('\n')
    )
  }
}

/**
 * Demo fallback used when no API key is provided. Returns a templated
 * recommendation so the UI is still showcasable.
 */
export function demoReply(userMessage, lang = 'ru') {
  const q = userMessage.toLowerCase()
  const ru = lang === 'ru'

  const pick = (id) => products.find((p) => p.id === id)
  const fmt = (p) =>
    `${p.name} — ${new Intl.NumberFormat(ru ? 'ru-RU' : 'kk-KZ').format(p.price)} ₸`

  if (q.includes('program') || q.includes('програм') || q.includes('бағдар')) {
    const p = pick('macbook-pro-m3')
    return ru
      ? `Для программирования отлично подойдёт ${fmt(p)}. Чип M3 Pro, 18 ГБ оперативной памяти и долгая автономность — идеально для IDE, Docker и виртуальных машин.`
      : `Бағдарламалау үшін ${fmt(p)} өте қолайлы. M3 Pro чипі, 18 ГБ жады мен ұзақ батарея IDE мен Docker үшін тамаша.`
  }
  if (q.includes('gam') || q.includes('игр') || q.includes('ойын')) {
    const p = pick('lenovo-legion-pro-7')
    return ru
      ? `Для игр рекомендую ${fmt(p)} — RTX 4080, 240 Гц дисплей и продвинутое охлаждение Coldfront тянут любые AAA-проекты.`
      : `Ойынға ${fmt(p)} ұсынамын — RTX 4080, 240 Гц дисплей және Coldfront салқындатуы кез келген AAA жобасына сай.`
  }
  if (
    q.includes('1000') ||
    q.includes('бюджет') ||
    q.includes('дешев') ||
    q.includes('арзан')
  ) {
    const p = pick('samsung-galaxy-s24')
    return ru
      ? `В пределах $1000 лучший выбор — ${fmt(p)}. Топовый AMOLED-дисплей, Galaxy AI и отличная камера за разумные деньги.`
      : `$1000 шамасында ең үздік таңдау — ${fmt(p)}. Үздік AMOLED дисплей, Galaxy AI және тамаша камера.`
  }

  return ru
    ? 'Расскажите подробнее: какой у вас бюджет и для каких задач нужен девайс? Я подберу 2–3 варианта из каталога TechShop.'
    : 'Толығырақ айтыңызшы: бюджетіңіз қандай және құрылғы қандай тапсырмаларға қажет? TechShop каталогынан 2–3 нұсқа таңдаймын.'
}
