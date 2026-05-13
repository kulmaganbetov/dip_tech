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
