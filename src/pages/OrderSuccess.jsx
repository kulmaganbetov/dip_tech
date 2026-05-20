import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Package,
  Truck,
  Copy,
  Check,
  Sparkles,
  Loader2,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useFormatPrice } from '../hooks/useFormatPrice'
import { analyzeOrder } from '../utils/openai'

export default function OrderSuccess() {
  const { id } = useParams()
  const { t, lang } = useLanguage()
  const fmt = useFormatPrice()
  const ru = lang === 'ru'

  const [order, setOrder] = useState(null)
  const [copied, setCopied] = useState(false)
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`techshop:order:${id}`)
      if (raw) setOrder(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [id])

  // Trigger AI analysis once order is loaded.
  useEffect(() => {
    if (!order?.items?.length) return
    setAiLoading(true)
    setAiError(false)
    analyzeOrder(order.items, lang)
      .then((text) => {
        setAiText(text)
        setAiLoading(false)
      })
      .catch(() => {
        setAiError(true)
        setAiLoading(false)
      })
  }, [order, lang])

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <section className="container-x py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500/10 text-emerald-500"
        >
          <CheckCircle2 size={42} />
        </motion.div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl dark:text-white">
          {t('order.thanks')}
        </h1>
        <p className="mt-3 text-ink-500 dark:text-ink-300">{t('order.message')}</p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-100 px-4 py-2 text-sm dark:bg-ink-800">
          <span className="text-ink-500 dark:text-ink-300">{t('order.number')}:</span>
          <span className="font-mono font-semibold text-ink-900 dark:text-white">{id}</span>
          <button
            onClick={copyId}
            className="ml-1 grid h-6 w-6 place-items-center rounded-full text-ink-500 transition-colors hover:bg-white hover:text-brand-500 dark:hover:bg-ink-700"
            aria-label="Copy"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>
      </motion.div>

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          {/* Timeline */}
          <div className="card mb-6 grid gap-4 p-6 sm:grid-cols-3">
            {[
              { icon: CheckCircle2, label: t('order.thanks'), active: true },
              { icon: Package, label: t('cart.summary'), active: true },
              {
                icon: Truck,
                label: `${t('order.delivery')} · ${t('order.days')}`,
                active: false,
              },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className={`grid h-10 w-10 place-items-center rounded-xl ${
                    s.active
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-ink-100 text-ink-400 dark:bg-ink-800'
                  }`}
                >
                  <s.icon size={18} />
                </span>
                <span
                  className={`text-sm font-medium ${
                    s.active ? 'text-ink-900 dark:text-white' : 'text-ink-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Order items */}
          <div className="card overflow-hidden">
            <div className="border-b border-ink-100 p-5 dark:border-ink-700">
              <h2 className="text-base font-bold text-ink-900 dark:text-white">
                {t('order.summary')}
              </h2>
            </div>
            <ul className="divide-y divide-ink-100 dark:divide-ink-700">
              {order.items.map((it) => (
                <li key={it.id} className="flex items-center gap-3 p-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-50 dark:bg-ink-900">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900 dark:text-white">
                      {it.name}
                    </p>
                    <p className="text-xs text-ink-400">
                      {fmt(it.price)} × {it.qty}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-ink-900 dark:text-white">
                    {fmt(it.price * it.qty)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex items-end justify-between border-t border-ink-100 p-5 dark:border-ink-700">
              <span className="text-sm font-semibold text-ink-900 dark:text-white">
                {t('order.total')}
              </span>
              <span className="text-xl font-extrabold text-ink-900 dark:text-white">
                {fmt(order.total)}
              </span>
            </div>
          </div>

          {/* ── AI Recommendations ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 card overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-ink-100 p-5 dark:border-ink-700">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/10">
                <Sparkles size={16} className="text-brand-500" />
              </span>
              <h2 className="text-base font-bold text-ink-900 dark:text-white">
                {ru ? 'AI-анализ вашей покупки' : 'Сатып алуыңыздың AI-талдауы'}
              </h2>
            </div>

            <div className="p-5">
              {aiLoading && (
                <div className="flex items-center gap-3 text-ink-400">
                  <Loader2 size={18} className="animate-spin text-brand-500" />
                  <span className="text-sm">
                    {ru ? 'AI анализирует вашу покупку...' : 'AI сатып алуыңызды талдауда...'}
                  </span>
                </div>
              )}

              {aiError && (
                <p className="text-sm text-ink-400">
                  {ru
                    ? 'Не удалось получить рекомендации. Попробуйте позже.'
                    : 'Ұсыныстарды алу мүмкін болмады. Кейінірек қайталаңыз.'}
                </p>
              )}

              {aiText && !aiLoading && (
                <div className="prose prose-sm dark:prose-invert max-w-none text-ink-700 dark:text-ink-200">
                  <AiMarkdown text={aiText} />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link to="/products" className="btn-primary">
          {t('order.keepShopping')}
        </Link>
        <Link to="/" className="btn-outline">
          {t('order.backHome')}
        </Link>
      </div>
    </section>
  )
}

/**
 * Minimal markdown renderer for bold (**text**) and bullet lines.
 * Avoids pulling in a full markdown library.
 */
function AiMarkdown({ text }) {
  return (
    <div className="space-y-3">
      {text.split('\n').map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return null

        // Section heading: **text**
        if (/^\*\*(.+)\*\*:?$/.test(trimmed)) {
          const heading = trimmed.replace(/^\*\*(.+)\*\*:?$/, '$1')
          return (
            <p key={i} className="font-semibold text-ink-900 dark:text-white">
              {heading}
            </p>
          )
        }

        // Bullet point
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          const content = trimmed.replace(/^[•\-]\s*/, '')
          return (
            <div key={i} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              <span className="text-sm leading-relaxed">{renderInline(content)}</span>
            </div>
          )
        }

        return (
          <p key={i} className="text-sm leading-relaxed">
            {renderInline(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

function renderInline(text) {
  // Bold spans: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}
