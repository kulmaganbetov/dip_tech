import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  CreditCard,
  Banknote,
  Wallet,
  Loader2,
  Lock,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useFormatPrice } from '../hooks/useFormatPrice'

const PAYMENT_METHODS = [
  { id: 'card', icon: CreditCard, key: 'payCard' },
  { id: 'kaspi', icon: Wallet, key: 'payKaspi' },
  { id: 'cash', icon: Banknote, key: 'payCash' },
]

// Lightweight client-side validators — no external dep.
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
const isPhone = (v) => /^[+]?[0-9()\-\s]{7,}$/.test(v.trim())

export default function Checkout() {
  const { t, lang } = useLanguage()
  const { detailed, subtotal, clear } = useCart()
  const fmt = useFormatPrice()
  const navigate = useNavigate()

  // Bounce back to /cart if user lands here with empty cart.
  useEffect(() => {
    if (detailed.length === 0) navigate('/cart', { replace: true })
  }, [detailed.length, navigate])

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Almaty',
    address: '',
    payment: 'card',
    note: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = t('checkout.required')
    if (!form.phone.trim()) e.phone = t('checkout.required')
    else if (!isPhone(form.phone)) e.phone = t('checkout.invalidPhone')
    if (!form.email.trim()) e.email = t('checkout.required')
    else if (!isEmail(form.email)) e.email = t('checkout.invalidEmail')
    if (!form.city.trim()) e.city = t('checkout.required')
    if (!form.address.trim()) e.address = t('checkout.required')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate() || submitting) return

    setSubmitting(true)

    // Simulate payment processing latency.
    await new Promise((r) => setTimeout(r, 1400))

    // Build a fake order and persist it for the success page.
    const orderId = 'TS-' + Date.now().toString().slice(-8)
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: form,
      items: detailed.map(({ product, qty }) => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        image: product.image,
        price: product.price,
        qty,
      })),
      total: subtotal,
    }
    window.localStorage.setItem(`techshop:order:${orderId}`, JSON.stringify(order))
    window.localStorage.setItem('techshop:lastOrder', orderId)

    clear()
    navigate(`/order/${orderId}`, { replace: true })
  }

  if (detailed.length === 0) return null

  return (
    <section className="container-x py-10 sm:py-14">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
      >
        <ChevronLeft size={16} />
        {t('common.back')}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-4"
      >
        <h1 className="section-title">{t('checkout.title')}</h1>
        <p className="section-subtitle">{t('checkout.subtitle')}</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Form column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact */}
          <fieldset className="card p-6">
            <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-ink-400">
              {t('checkout.contact')}
            </legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field
                label={t('checkout.name')}
                value={form.name}
                onChange={update('name')}
                error={errors.name}
                autoComplete="name"
              />
              <Field
                label={t('checkout.phone')}
                value={form.phone}
                onChange={update('phone')}
                error={errors.phone}
                placeholder="+7 777 000 00 00"
                inputMode="tel"
                autoComplete="tel"
              />
              <Field
                className="sm:col-span-2"
                label={t('checkout.email')}
                value={form.email}
                onChange={update('email')}
                error={errors.email}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </fieldset>

          {/* Address */}
          <fieldset className="card p-6">
            <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-ink-400">
              {t('checkout.address')}
            </legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <Field
                label={t('checkout.city')}
                value={form.city}
                onChange={update('city')}
                error={errors.city}
                autoComplete="address-level2"
              />
              <Field
                className="sm:col-span-2"
                label={t('checkout.addressLine')}
                value={form.address}
                onChange={update('address')}
                error={errors.address}
                autoComplete="street-address"
              />
            </div>
          </fieldset>

          {/* Payment */}
          <fieldset className="card p-6">
            <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-ink-400">
              {t('checkout.payment')}
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {PAYMENT_METHODS.map((m) => {
                const active = form.payment === m.id
                return (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors ${
                      active
                        ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20'
                        : 'border-ink-200 hover:border-ink-300 dark:border-ink-700 dark:hover:border-ink-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={active}
                      onChange={update('payment')}
                      className="sr-only"
                    />
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-xl ${
                        active
                          ? 'bg-brand-500 text-white'
                          : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-200'
                      }`}
                    >
                      <m.icon size={18} />
                    </span>
                    <span className="text-sm font-medium text-ink-900 dark:text-white">
                      {t(`checkout.${m.key}`)}
                    </span>
                  </label>
                )
              })}
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-200">
                {t('checkout.note')}
              </label>
              <textarea
                value={form.note}
                onChange={update('note')}
                rows={3}
                placeholder={t('checkout.notePh')}
                className="mt-2 w-full resize-none rounded-2xl border border-ink-200 bg-white px-4 py-3 text-ink-900 placeholder-ink-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
              />
            </div>
          </fieldset>
        </div>

        {/* Summary column */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card overflow-hidden">
            <div className="border-b border-ink-100 p-5 dark:border-ink-700">
              <h2 className="text-base font-bold text-ink-900 dark:text-white">
                {t('checkout.yourOrder')}
              </h2>
            </div>
            <ul className="max-h-72 divide-y divide-ink-100 overflow-y-auto dark:divide-ink-700">
              {detailed.map(({ product, qty }) => (
                <li key={product.id} className="flex items-center gap-3 p-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-50 dark:bg-ink-900">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-xs text-ink-400">
                      {fmt(product.price)} × {qty}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-ink-900 dark:text-white">
                    {fmt(product.price * qty)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-ink-100 p-5 text-sm dark:border-ink-700">
              <div className="flex justify-between text-ink-500 dark:text-ink-300">
                <span>{t('cart.subtotal')}</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-500 dark:text-ink-300">
                <span>{t('cart.delivery')}</span>
                <span className="text-emerald-500">{t('cart.free')}</span>
              </div>
              <div className="my-2 border-t border-ink-100 dark:border-ink-700" />
              <div className="flex items-end justify-between">
                <span className="font-semibold text-ink-900 dark:text-white">
                  {t('cart.total')}
                </span>
                <span className="text-xl font-extrabold text-ink-900 dark:text-white">
                  {fmt(subtotal)}
                </span>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                type="submit"
                disabled={submitting}
                className="btn-accent w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {t('checkout.processing')}
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    {t('checkout.pay')}
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-[11px] text-ink-400">
                🔒 SSL · Test mode · {lang.toUpperCase()}
              </p>
            </div>
          </div>
        </aside>
      </form>
    </section>
  )
}

// Reusable labeled input.
function Field({ label, error, className = '', ...rest }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-medium text-ink-700 dark:text-ink-200">
        {label}
      </span>
      <input
        {...rest}
        className={`input mt-2 ${
          error
            ? '!border-red-400 !ring-red-400/20'
            : ''
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}
