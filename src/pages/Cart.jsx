import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useFormatPrice } from '../hooks/useFormatPrice'

export default function Cart() {
  const { t, lang } = useLanguage()
  const { detailed, count, subtotal, increment, decrement, remove, clear } = useCart()
  const fmt = useFormatPrice()
  const navigate = useNavigate()

  // Empty state ────────────────────────────────────────────────────────────
  if (detailed.length === 0) {
    return (
      <section className="container-x py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-md text-center"
        >
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-ink-100 dark:bg-ink-800">
            <ShoppingBag size={28} className="text-ink-400" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-ink-900 dark:text-white">
            {t('cart.empty')}
          </h1>
          <p className="mt-2 text-ink-500 dark:text-ink-300">{t('cart.emptyHint')}</p>
          <Link to="/products" className="btn-primary mt-6 inline-flex">
            {t('cart.goShop')}
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="container-x py-10 sm:py-14">
      <Link
        to="/products"
        className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
      >
        <ChevronLeft size={16} />
        {t('common.back')}
      </Link>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t('cart.title')}</h1>
          <p className="section-subtitle">
            {count} {t('cart.itemsCount')}
          </p>
        </div>
        <button
          onClick={clear}
          className="btn-ghost text-sm text-ink-500 hover:text-red-500"
        >
          <Trash2 size={14} />
          {t('cart.clear')}
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Items list */}
        <ul className="lg:col-span-2 space-y-4">
          <AnimatePresence initial={false}>
            {detailed.map(({ product, qty }) => (
              <motion.li
                key={product.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="card flex gap-4 p-4 sm:p-5"
              >
                <Link
                  to={`/products/${product.id}`}
                  className="block h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink-50 sm:h-28 sm:w-28 dark:bg-ink-900"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="chip">{product.brand}</span>
                      <Link
                        to={`/products/${product.id}`}
                        className="mt-1 block font-semibold text-ink-900 hover:text-brand-500 dark:text-white"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 hidden text-xs text-ink-500 sm:block dark:text-ink-300">
                        {product.shortSpecs[lang]}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(product.id)}
                      aria-label={t('cart.remove')}
                      className="grid h-9 w-9 place-items-center rounded-full text-ink-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-3">
                    {/* Qty stepper */}
                    <div className="inline-flex items-center rounded-full border border-ink-200 dark:border-ink-700">
                      <button
                        onClick={() => decrement(product.id)}
                        className="grid h-9 w-9 place-items-center rounded-l-full text-ink-600 transition-colors hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
                        aria-label="-"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold tabular-nums">
                        {qty}
                      </span>
                      <button
                        onClick={() => increment(product.id)}
                        className="grid h-9 w-9 place-items-center rounded-r-full text-ink-600 transition-colors hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
                        aria-label="+"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-ink-400">
                        {fmt(product.price)} × {qty}
                      </div>
                      <div className="text-base font-bold text-ink-900 dark:text-white">
                        {fmt(product.price * qty)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-ink-900 dark:text-white">
              {t('cart.summary')}
            </h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-ink-500 dark:text-ink-300">
                <dt>{t('cart.subtotal')}</dt>
                <dd className="font-medium text-ink-900 dark:text-white">
                  {fmt(subtotal)}
                </dd>
              </div>
              <div className="flex justify-between text-ink-500 dark:text-ink-300">
                <dt>{t('cart.delivery')}</dt>
                <dd className="font-medium text-emerald-500">{t('cart.free')}</dd>
              </div>
              <div className="my-2 border-t border-ink-100 dark:border-ink-700" />
              <div className="flex items-end justify-between">
                <dt className="text-base font-semibold text-ink-900 dark:text-white">
                  {t('cart.total')}
                </dt>
                <dd className="text-xl font-extrabold text-ink-900 dark:text-white">
                  {fmt(subtotal)}
                </dd>
              </div>
            </dl>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-accent mt-6 w-full"
            >
              {t('cart.checkout')}
              <ArrowRight size={16} />
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}
