import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Wallet,
  RefreshCw,
  Sparkles,
  Loader2,
  ArrowUpRight,
  Package,
  Truck,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { products } from '../data/products'
import { generateAdminReport } from '../utils/openai'
import { useFormatPrice } from '../hooks/useFormatPrice'
import { useLanguage } from '../context/LanguageContext'

// ── Mock data helpers ─────────────────────────────────────────────────────────

function buildSalesData() {
  const days = 30
  const now = Date.now()
  const seed = [0.9, 1.1, 0.85, 1.2, 1.05, 0.95, 1.3, 0.88, 1.15, 1.0,
    0.92, 1.18, 1.06, 0.87, 1.25, 1.1, 0.95, 1.3, 1.08, 0.9,
    1.2, 1.05, 1.35, 0.93, 1.22, 1.1, 0.98, 1.28, 1.15, 1.4]

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(now - (days - 1 - i) * 86400000)
    const wd = date.getDay()
    const weekend = wd === 0 || wd === 6 ? 1.25 : 1
    const revenue = Math.round(750000 * seed[i] * weekend * (1 + i * 0.004))
    const orders = Math.max(2, Math.round(revenue / 185000 + (Math.random() - 0.5)))
    return {
      label: date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      revenue,
      orders,
      i,
    }
  })
}

const TOP_PRODUCTS = [
  { id: 'iphone-15-pro', sold: 23 },
  { id: 'samsung-galaxy-s24-ultra', sold: 18 },
  { id: 'macbook-pro-m3', sold: 15 },
  { id: 'macbook-air-m3', sold: 12 },
  { id: 'xiaomi-14', sold: 11 },
]

const CRM_DATA = [
  {
    name: 'Нұрлан Қасымов',
    email: 'nurlan.kassymov@gmail.com',
    phone: '+7 701 234 56 78',
    city: 'Алматы',
    address: 'пр. Достык, д. 14, кв. 32',
    payment: 'Kaspi Pay',
    productId: 'iphone-15-pro',
    qty: 1,
    status: 'delivered',
    daysAgo: 1,
  },
  {
    name: 'Айгерім Бекова',
    email: 'aigeriim.bekova@mail.ru',
    phone: '+7 777 098 43 21',
    city: 'Астана',
    address: 'ул. Кабанбай батыра, д. 3, кв. 7',
    payment: 'Картой',
    productId: 'macbook-pro-m3',
    qty: 1,
    status: 'shipping',
    daysAgo: 1,
  },
  {
    name: 'Бауыржан Сейтқали',
    email: 'b.seitkali@yandex.kz',
    phone: '+7 747 312 00 55',
    city: 'Шымкент',
    address: 'пр. Тауке хана, д. 88, кв. 112',
    payment: 'Kaspi Pay',
    productId: 'samsung-galaxy-s24-ultra',
    qty: 1,
    status: 'processing',
    daysAgo: 2,
  },
  {
    name: 'Дана Жақсыбекова',
    email: 'dana.zhaksybekova@gmail.com',
    phone: '+7 702 555 77 88',
    city: 'Алматы',
    address: 'мкр. Алмагуль, д. 5, кв. 21',
    payment: 'Картой',
    productId: 'asus-rog-strix',
    qty: 1,
    status: 'confirmed',
    daysAgo: 2,
  },
  {
    name: 'Ерлан Ахметов',
    email: 'yerlan.akhmetov@inbox.ru',
    phone: '+7 705 811 22 33',
    city: 'Атырау',
    address: 'ул. Азаттык, д. 27, кв. 4',
    payment: 'Наличными',
    productId: 'lenovo-legion-pro-7',
    qty: 1,
    status: 'delivered',
    daysAgo: 3,
  },
  {
    name: 'Зарина Нұрмаханова',
    email: 'zarina.nurmakhanova@gmail.com',
    phone: '+7 771 490 00 12',
    city: 'Астана',
    address: 'пр. Туран, д. 55, кв. 301',
    payment: 'Kaspi Pay',
    productId: 'iphone-15-pro',
    qty: 2,
    status: 'shipping',
    daysAgo: 3,
  },
  {
    name: 'Алмас Байжанов',
    email: 'almas.bayzhanov@mail.ru',
    phone: '+7 707 633 45 90',
    city: 'Қарағанды',
    address: 'бул. Мира, д. 19, кв. 60',
    payment: 'Картой',
    productId: 'google-pixel-8-pro',
    qty: 1,
    status: 'delivered',
    daysAgo: 4,
  },
  {
    name: 'Меруерт Сариева',
    email: 'meruert.sarieva@yandex.kz',
    phone: '+7 778 201 34 56',
    city: 'Алматы',
    address: 'ул. Тимирязева, д. 42, кв. 8',
    payment: 'Kaspi Pay',
    productId: 'macbook-air-m3',
    qty: 1,
    status: 'confirmed',
    daysAgo: 4,
  },
  {
    name: 'Жандос Тоқтаров',
    email: 'zhandos.toktarov@gmail.com',
    phone: '+7 700 987 65 43',
    city: 'Өскемен',
    address: 'ул. Ушанова, д. 6, кв. 15',
    payment: 'Наличными',
    productId: 'xiaomi-14',
    qty: 1,
    status: 'shipping',
    daysAgo: 5,
  },
  {
    name: 'Камила Рахымбекова',
    email: 'kamila.rakhymbekova@inbox.ru',
    phone: '+7 776 123 78 90',
    city: 'Астана',
    address: 'ул. Иманова, д. 11, кв. 44',
    payment: 'Картой',
    productId: 'dell-xps-15',
    qty: 1,
    status: 'delivered',
    daysAgo: 5,
  },
  {
    name: 'Асқар Дүйсенов',
    email: 'askar.duisenov@gmail.com',
    phone: '+7 701 456 89 01',
    city: 'Тараз',
    address: 'ул. Байзакова, д. 33, кв. 9',
    payment: 'Kaspi Pay',
    productId: 'oneplus-12',
    qty: 1,
    status: 'processing',
    daysAgo: 6,
  },
  {
    name: 'Гүлнара Исмаилова',
    email: 'gulnara.ismailova@mail.ru',
    phone: '+7 747 888 11 22',
    city: 'Алматы',
    address: 'пр. Аль-Фараби, д. 77, кв. 205',
    payment: 'Картой',
    productId: 'samsung-galaxy-s24-ultra',
    qty: 1,
    status: 'delivered',
    daysAgo: 7,
  },
  {
    name: 'Серік Алиев',
    email: 'serik.aliyev@yandex.kz',
    phone: '+7 702 741 30 18',
    city: 'Ақтөбе',
    address: 'пр. 312-й стрелковой дивизии, д. 4, кв. 28',
    payment: 'Наличными',
    productId: 'hp-spectre-x360',
    qty: 1,
    status: 'confirmed',
    daysAgo: 8,
  },
  {
    name: 'Назгүл Әбдіқалықова',
    email: 'nazgul.abdykalykova@gmail.com',
    phone: '+7 705 320 99 77',
    city: 'Шымкент',
    address: 'ул. Байтурсынова, д. 18, кв. 3',
    payment: 'Kaspi Pay',
    productId: 'macbook-pro-m3',
    qty: 1,
    status: 'shipping',
    daysAgo: 9,
  },
  {
    name: 'Тимур Жұмабаев',
    email: 'timur.zhumabaev@inbox.ru',
    phone: '+7 771 665 44 33',
    city: 'Павлодар',
    address: 'ул. Академика Сатпаева, д. 50, кв. 71',
    payment: 'Картой',
    productId: 'iphone-15-pro',
    qty: 1,
    status: 'delivered',
    daysAgo: 10,
  },
  {
    name: 'Аида Мұхамеджанова',
    email: 'aida.mukhamedzhanova@gmail.com',
    phone: '+7 778 502 13 64',
    city: 'Алматы',
    address: 'мкр. Самал-2, д. 22, кв. 107',
    payment: 'Kaspi Pay',
    productId: 'samsung-galaxy-s24',
    qty: 2,
    status: 'delivered',
    daysAgo: 11,
  },
  {
    name: 'Арман Сейітов',
    email: 'arman.seitov@mail.ru',
    phone: '+7 707 219 87 56',
    city: 'Семей',
    address: 'ул. Шәкәрім, д. 7, кв. 12',
    payment: 'Наличными',
    productId: 'lenovo-legion-pro-7',
    qty: 1,
    status: 'confirmed',
    daysAgo: 12,
  },
  {
    name: 'Жанар Оспанова',
    email: 'zhanar.ospanova@yandex.kz',
    phone: '+7 700 374 56 12',
    city: 'Астана',
    address: 'ул. Сейфуллина, д. 36, кв. 58',
    payment: 'Картой',
    productId: 'asus-rog-strix',
    qty: 1,
    status: 'processing',
    daysAgo: 13,
  },
  {
    name: 'Санем Хасенова',
    email: 'sanem.khassenova@gmail.com',
    phone: '+7 776 800 22 91',
    city: 'Қостанай',
    address: 'пр. Аль-Фараби, д. 9, кв. 34',
    payment: 'Kaspi Pay',
    productId: 'google-pixel-8-pro',
    qty: 1,
    status: 'delivered',
    daysAgo: 14,
  },
  {
    name: 'Марат Қонысбаев',
    email: 'marat.konysbaev@inbox.ru',
    phone: '+7 701 943 67 85',
    city: 'Алматы',
    address: 'ул. Абая, д. 150, кв. 19',
    payment: 'Картой',
    productId: 'macbook-air-m3',
    qty: 1,
    status: 'shipping',
    daysAgo: 15,
  },
]

function buildCrmRows() {
  return CRM_DATA.map((m, i) => {
    const p = products.find((x) => x.id === m.productId) ?? products[i % products.length]
    const amount = p.price * m.qty
    const ts = Date.now() - m.daysAgo * 86400000 - i * 1800000
    return {
      id: `TS-${ts.toString().slice(-8)}`,
      name: m.name,
      email: m.email,
      phone: m.phone,
      city: m.city,
      address: m.address,
      payment: m.payment,
      product: p.name,
      qty: m.qty,
      amount,
      status: m.status,
      date: new Date(ts).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' }),
    }
  })
}

// ── SVG Charts ────────────────────────────────────────────────────────────────

function LineAreaChart({ data, valueKey }) {
  const W = 520
  const H = 160
  const PAD = { t: 8, r: 8, b: 28, l: 52 }
  const cw = W - PAD.l - PAD.r
  const ch = H - PAD.t - PAD.b

  const vals = data.map((d) => d[valueKey])
  const lo = Math.min(...vals) * 0.9
  const hi = Math.max(...vals) * 1.05

  const x = (i) => (i / (data.length - 1)) * cw
  const y = (v) => ch - ((v - lo) / (hi - lo)) * ch

  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d[valueKey])}`).join(' ')
  const area = `${line} L ${x(data.length - 1)} ${ch} L 0 ${ch} Z`

  const yTicks = [lo, lo + (hi - lo) * 0.5, hi]
  const xStep = Math.floor(data.length / 5)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g transform={`translate(${PAD.l},${PAD.t})`}>
        {yTicks.map((v, i) => (
          <g key={i}>
            <line x1={0} y1={y(v)} x2={cw} y2={y(v)} stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
            <text x={-6} y={y(v) + 4} textAnchor="end" fontSize="9" fill="currentColor" fillOpacity="0.45">
              {valueKey === 'revenue' ? `${(v / 1000000).toFixed(1)}M` : Math.round(v)}
            </text>
          </g>
        ))}
        <path d={area} fill={`url(#grad-${valueKey})`} />
        <path d={line} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.filter((_, i) => i % xStep === 0 || i === data.length - 1).map((d, ii, arr) => (
          <g key={ii}>
            <circle cx={x(d.i)} cy={y(d[valueKey])} r="3" fill="#6366f1" stroke="white" strokeWidth="1.5" />
            <text x={x(d.i)} y={ch + 18} textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.4">
              {d.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

function BarChart({ data }) {
  const W = 260
  const H = 160
  const PAD = { t: 8, r: 8, b: 28, l: 56 }
  const cw = W - PAD.l - PAD.r
  const ch = H - PAD.t - PAD.b

  const maxVal = Math.max(...data.map((d) => d.value))
  const barW = (cw / data.length) * 0.55
  const gap = cw / data.length

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <g transform={`translate(${PAD.l},${PAD.t})`}>
        {data.map((d, i) => {
          const bh = (d.value / maxVal) * ch
          const bx = i * gap + (gap - barW) / 2
          const by = ch - bh
          return (
            <g key={i}>
              <rect x={bx} y={by} width={barW} height={bh} rx="4" fill={d.color} fillOpacity="0.85" />
              <text x={bx + barW / 2} y={ch + 16} textAnchor="middle" fontSize="9.5" fill="currentColor" fillOpacity="0.55">
                {d.name}
              </text>
              <text x={bx + barW / 2} y={by - 5} textAnchor="middle" fontSize="9" fill={d.color} fontWeight="600">
                {Math.round(d.value / 1000000)}M
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5"
    >
      <div className="flex items-start justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${accent}`}>
          <Icon size={18} />
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
          <ArrowUpRight size={12} /> {sub}
        </span>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-ink-900 dark:text-white">{value}</p>
      <p className="mt-0.5 text-xs text-ink-400">{label}</p>
    </motion.div>
  )
}

const STATUS_META = {
  delivered: { label: 'Доставлен', icon: CheckCircle2, cls: 'bg-emerald-500/10 text-emerald-600' },
  shipping: { label: 'В пути', icon: Truck, cls: 'bg-blue-500/10 text-blue-600' },
  processing: { label: 'Обработка', icon: Loader2, cls: 'bg-amber-500/10 text-amber-600' },
  confirmed: { label: 'Подтверждён', icon: Clock, cls: 'bg-violet-500/10 text-violet-600' },
}

// ── AI report markdown renderer (reused from OrderSuccess logic) ──────────────

function AiMarkdown({ text }) {
  return (
    <div className="space-y-2.5">
      {text.split('\n').map((line, i) => {
        const t = line.trim()
        if (!t) return null
        if (/^\*\*(.+)\*\*:?$/.test(t)) {
          return (
            <p key={i} className="pt-1 font-semibold text-ink-900 dark:text-white">
              {t.replace(/^\*\*(.+)\*\*:?$/, '$1')}
            </p>
          )
        }
        if (t.startsWith('•') || t.startsWith('-') || /^\d+\./.test(t)) {
          const content = t.replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '')
          return (
            <div key={i} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              <span className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                {inline(content)}
              </span>
            </div>
          )
        }
        return (
          <p key={i} className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            {inline(t)}
          </p>
        )
      })}
    </div>
  )
}

function inline(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} className="font-semibold text-ink-900 dark:text-white">{p.slice(2, -2)}</strong>
      : p
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Admin() {
  const fmt = useFormatPrice()
  const { lang } = useLanguage()
  const ru = lang === 'ru'

  const salesData = useMemo(() => buildSalesData(), [])
  const topProducts = useMemo(
    () =>
      TOP_PRODUCTS.map(({ id, sold }) => {
        const p = products.find((x) => x.id === id)
        return { ...p, sold, revenue: p.price * sold }
      }),
    []
  )
  const crmRows = useMemo(() => buildCrmRows(), [])
  const categoryData = useMemo(() => {
    const total = salesData.reduce((s, d) => s + d.revenue, 0)
    return [
      { name: ru ? 'Смартфоны' : 'Смартфондар', value: Math.round(total * 0.58), color: '#6366f1' },
      { name: ru ? 'Ноутбуки' : 'Ноутбуктар', value: Math.round(total * 0.42), color: '#8b5cf6' },
    ]
  }, [salesData, ru])

  const totalRevenue = salesData.reduce((s, d) => s + d.revenue, 0)
  const totalOrders = salesData.reduce((s, d) => s + d.orders, 0)
  const avgCheck = Math.round(totalRevenue / totalOrders)

  // AI report
  const [report, setReport] = useState('')
  const [reportLoading, setReportLoading] = useState(false)

  const fetchReport = () => {
    setReportLoading(true)
    setReport('')
    const stats = {
      totalRevenue,
      totalOrders,
      avgCheck,
      topProduct: topProducts[0]?.name,
      growth: '+14%',
      period: ru ? 'последние 30 дней' : 'соңғы 30 күн',
    }
    generateAdminReport(stats, lang)
      .then((text) => { setReport(text); setReportLoading(false) })
      .catch(() => { setReport(ru ? 'Не удалось получить отчёт.' : 'Есеп алу мүмкін болмады.'); setReportLoading(false) })
  }

  useEffect(() => { fetchReport() }, [lang])

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/80 backdrop-blur dark:border-ink-800 dark:bg-ink-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">TechShop</span>
            <h1 className="text-lg font-extrabold text-ink-900 dark:text-white">
              {ru ? 'Панель управления' : 'Басқару тақтасы'}
            </h1>
          </div>
          <a href="/" className="text-sm text-ink-400 hover:text-ink-700 dark:hover:text-white">
            ← {ru ? 'В магазин' : 'Дүкенге'}
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8">

        {/* ── KPI row ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={Wallet}
            label={ru ? 'Выручка за 30 дней' : '30 күндегі түсім'}
            value={fmt(totalRevenue)}
            sub="+14%"
            accent="bg-brand-500/10 text-brand-500"
          />
          <KpiCard
            icon={ShoppingBag}
            label={ru ? 'Заказов за 30 дней' : '30 күндегі тапсырыстар'}
            value={totalOrders}
            sub="+8%"
            accent="bg-violet-500/10 text-violet-500"
          />
          <KpiCard
            icon={TrendingUp}
            label={ru ? 'Средний чек' : 'Орташа чек'}
            value={fmt(avgCheck)}
            sub="+6%"
            accent="bg-emerald-500/10 text-emerald-500"
          />
          <KpiCard
            icon={Users}
            label={ru ? 'Активных клиентов' : 'Белсенді клиенттер'}
            value="142"
            sub="+21%"
            accent="bg-amber-500/10 text-amber-500"
          />
        </div>

        {/* ── Charts row ── */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Line: Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-5 lg:col-span-2"
          >
            <p className="mb-4 text-sm font-semibold text-ink-900 dark:text-white">
              {ru ? 'Динамика выручки (30 дней)' : 'Түсім динамикасы (30 күн)'}
            </p>
            <LineAreaChart data={salesData} valueKey="revenue" />
          </motion.div>

          {/* Bar: Category */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card p-5"
          >
            <p className="mb-4 text-sm font-semibold text-ink-900 dark:text-white">
              {ru ? 'Продажи по категориям' : 'Санаттар бойынша сатылым'}
            </p>
            <BarChart data={categoryData} />
            <div className="mt-3 space-y-1.5">
              {categoryData.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                    <span className="text-ink-500 dark:text-ink-300">{c.name}</span>
                  </div>
                  <span className="font-semibold text-ink-900 dark:text-white">{fmt(c.value)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Orders chart ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5"
        >
          <p className="mb-4 text-sm font-semibold text-ink-900 dark:text-white">
            {ru ? 'Количество заказов (30 дней)' : 'Тапсырыстар саны (30 күн)'}
          </p>
          <LineAreaChart data={salesData} valueKey="orders" />
        </motion.div>

        {/* ── Bottom grid: AI report + Top products + CRM ── */}
        <div className="grid gap-4 lg:grid-cols-2">

          {/* AI Financial Report */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-ink-100 p-5 dark:border-ink-700">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/10">
                  <Sparkles size={15} className="text-brand-500" />
                </span>
                <span className="text-sm font-bold text-ink-900 dark:text-white">
                  {ru ? 'AI-финансовый отчёт' : 'AI-қаржылық есеп'}
                </span>
              </div>
              <button
                onClick={fetchReport}
                disabled={reportLoading}
                className="grid h-8 w-8 place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-brand-500 disabled:opacity-50 dark:hover:bg-ink-800"
                title={ru ? 'Обновить' : 'Жаңарту'}
              >
                <RefreshCw size={14} className={reportLoading ? 'animate-spin' : ''} />
              </button>
            </div>
            <div className="p-5">
              {reportLoading ? (
                <div className="flex items-center gap-3 text-ink-400">
                  <Loader2 size={16} className="animate-spin text-brand-500" />
                  <span className="text-sm">
                    {ru ? 'AI анализирует данные продаж...' : 'AI сатылым деректерін талдауда...'}
                  </span>
                </div>
              ) : (
                <AiMarkdown text={report} />
              )}
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="card overflow-hidden"
          >
            <div className="border-b border-ink-100 p-5 dark:border-ink-700">
              <span className="text-sm font-bold text-ink-900 dark:text-white">
                {ru ? 'Топ товаров' : 'Топ тауарлар'}
              </span>
            </div>
            <ul className="divide-y divide-ink-100 dark:divide-ink-700">
              {topProducts.map((p, i) => (
                <li key={p.id} className="flex items-center gap-3 p-4">
                  <span className="w-5 shrink-0 text-center text-xs font-bold text-ink-300 dark:text-ink-600">
                    {i + 1}
                  </span>
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-ink-50 dark:bg-ink-900">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-ink-400">
                      {p.sold} {ru ? 'шт' : 'дана'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink-900 dark:text-white">{fmt(p.revenue)}</p>
                    <div className="flex items-center justify-end gap-0.5 text-xs text-emerald-500">
                      <ArrowUpRight size={10} />
                      <span>top</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ── Mini CRM ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-ink-100 p-5 dark:border-ink-700">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-brand-500" />
              <span className="text-sm font-bold text-ink-900 dark:text-white">
                {ru ? 'Заказы клиентов (мини-CRM)' : 'Клиент тапсырыстары (мини-CRM)'}
              </span>
            </div>
            <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-500">
              {crmRows.length} {ru ? 'записей' : 'жазба'}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50 dark:border-ink-700 dark:bg-ink-900/50">
                  {[
                    ru ? 'Заказ' : 'Тапсырыс',
                    ru ? 'ФИО' : 'Аты-жөні',
                    ru ? 'Email' : 'Email',
                    ru ? 'Телефон' : 'Телефон',
                    ru ? 'Адрес' : 'Мекенжай',
                    ru ? 'Товар' : 'Тауар',
                    ru ? 'Кол-во' : 'Саны',
                    ru ? 'Сумма' : 'Сома',
                    ru ? 'Оплата' : 'Төлем',
                    ru ? 'Дата' : 'Күні',
                    ru ? 'Статус' : 'Күй',
                  ].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-700">
                {crmRows.map((row) => {
                  const s = STATUS_META[row.status]
                  const SIcon = s.icon
                  return (
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-ink-50 dark:hover:bg-ink-800/40"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink-400">
                        {row.id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-ink-900 dark:text-white">
                        {row.name}
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-500 dark:text-ink-300">
                        <a
                          href={`mailto:${row.email}`}
                          className="hover:text-brand-500 hover:underline"
                        >
                          {row.email}
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-ink-500 dark:text-ink-300">
                        {row.phone}
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-500 dark:text-ink-300">
                        <div className="max-w-[160px]">
                          <span className="font-medium text-ink-700 dark:text-ink-200">{row.city}</span>
                          <br />
                          <span className="text-ink-400">{row.address}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-500 dark:text-ink-300">
                        <span className="block max-w-[130px] truncate">{row.product}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-ink-500 dark:text-ink-300">
                        {row.qty}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-ink-900 dark:text-white">
                        {fmt(row.amount)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="rounded-md bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                          {row.payment}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-ink-400">
                        {row.date}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.cls}`}
                        >
                          <SIcon size={11} />
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
