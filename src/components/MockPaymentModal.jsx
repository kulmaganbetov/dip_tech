import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, CheckCircle2, Loader2, CreditCard } from 'lucide-react'
import { useFormatPrice } from '../hooks/useFormatPrice'
import { useLanguage } from '../context/LanguageContext'

const maskCardNumber = (v) =>
  v
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()

const maskExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d
}

const cardType = (num) => {
  const n = num.replace(/\s/g, '')
  if (n.startsWith('4')) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard'
  return 'generic'
}

const CARD_GRADIENTS = {
  visa: 'from-blue-600 to-blue-900',
  mastercard: 'from-rose-500 to-orange-600',
  generic: 'from-brand-600 to-violet-900',
}

export default function MockPaymentModal({ total, onSuccess, onClose }) {
  const { lang } = useLanguage()
  const fmt = useFormatPrice()
  const ru = lang === 'ru'

  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [flipped, setFlipped] = useState(false)
  const [errors, setErrors] = useState({})
  const [phase, setPhase] = useState('form') // 'form' | 'processing' | 'success'

  const update = (key) => (e) => {
    let v = e.target.value
    if (key === 'number') v = maskCardNumber(v)
    if (key === 'expiry') v = maskExpiry(v)
    if (key === 'cvv') v = v.replace(/\D/g, '').slice(0, 3)
    setCard((c) => ({ ...c, [key]: v }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (card.number.replace(/\s/g, '').length < 16)
      e.number = ru ? 'Введите 16-значный номер карты' : '16 санды карта нөмірін енгізіңіз'
    if (!card.name.trim())
      e.name = ru ? 'Введите имя держателя карты' : 'Карта ұстаушының атын енгізіңіз'
    if (card.expiry.length < 5)
      e.expiry = ru ? 'Введите срок действия' : 'Жарамдылық мерзімін енгізіңіз'
    if (card.cvv.length < 3)
      e.cvv = ru ? 'Введите CVV' : 'CVV кодын енгізіңіз'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePay = async () => {
    if (!validate()) return
    setPhase('processing')
    await new Promise((r) => setTimeout(r, 2200))
    setPhase('success')
    await new Promise((r) => setTimeout(r, 1100))
    onSuccess()
  }

  const type = cardType(card.number)
  const gradient = CARD_GRADIENTS[type]
  const displayNumber = card.number || '•••• •••• •••• ••••'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={phase === 'form' ? onClose : undefined}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="relative w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {phase === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-ink-100 p-5 dark:border-ink-700">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-brand-500" />
                  <span className="font-bold text-ink-900 dark:text-white">
                    {ru ? 'Оплата картой' : 'Картамен төлеу'}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="grid h-8 w-8 place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-800 dark:hover:text-white"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-5 p-5">
                {/* ── Animated credit card ── */}
                <div style={{ perspective: '1000px' }}>
                  <motion.div
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.45 }}
                    style={{ transformStyle: 'preserve-3d', position: 'relative', height: 160 }}
                  >
                    {/* Front face */}
                    <div
                      style={{ backfaceVisibility: 'hidden' }}
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-lg`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="h-7 w-11 rounded bg-yellow-300/80" />
                        <span className="text-xs font-extrabold uppercase tracking-widest opacity-80">
                          {type === 'visa' ? 'VISA' : type === 'mastercard' ? 'MC' : 'CARD'}
                        </span>
                      </div>
                      <div className="mt-4 font-mono text-lg tracking-widest drop-shadow">
                        {displayNumber}
                      </div>
                      <div className="mt-3 flex justify-between text-[11px] opacity-80">
                        <div>
                          <div className="uppercase">Card Holder</div>
                          <div className="mt-0.5 font-semibold uppercase">
                            {card.name || 'YOUR NAME'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="uppercase">Expires</div>
                          <div className="mt-0.5 font-semibold">
                            {card.expiry || 'MM/YY'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Back face */}
                    <div
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      className={`absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
                    >
                      <div className="mt-8 h-10 bg-black/40" />
                      <div className="mx-5 mt-4 flex items-center gap-3">
                        <div className="h-8 flex-1 rounded bg-white/20" />
                        <div className="min-w-[48px] rounded bg-white px-3 py-2 text-center font-mono text-sm font-bold text-ink-900">
                          {card.cvv || '•••'}
                        </div>
                      </div>
                      <p className="mx-5 mt-1 text-[10px] opacity-60">CVV</p>
                    </div>
                  </motion.div>
                </div>

                {/* ── Fields ── */}
                <div className="space-y-3">
                  <InputField
                    label={ru ? 'Номер карты' : 'Карта нөмірі'}
                    value={card.number}
                    onChange={update('number')}
                    placeholder="1234 5678 9012 3456"
                    className="font-mono"
                    error={errors.number}
                  />
                  <InputField
                    label={ru ? 'Имя на карте' : 'Картадағы ат'}
                    value={card.name}
                    onChange={update('name')}
                    placeholder="IVAN IVANOV"
                    className="uppercase"
                    error={errors.name}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      label={ru ? 'Срок действия' : 'Жарамдылық мерзімі'}
                      value={card.expiry}
                      onChange={update('expiry')}
                      placeholder="MM/YY"
                      className="font-mono"
                      error={errors.expiry}
                    />
                    <InputField
                      label="CVV"
                      value={card.cvv}
                      onChange={update('cvv')}
                      onFocus={() => setFlipped(true)}
                      onBlur={() => setFlipped(false)}
                      placeholder="•••"
                      className="font-mono"
                      error={errors.cvv}
                    />
                  </div>
                </div>

                {/* ── Amount row ── */}
                <div className="flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3 dark:bg-ink-800">
                  <span className="text-sm text-ink-500 dark:text-ink-300">
                    {ru ? 'К оплате' : 'Төлем сомасы'}
                  </span>
                  <span className="text-lg font-extrabold text-ink-900 dark:text-white">
                    {fmt(total)}
                  </span>
                </div>

                <button onClick={handlePay} className="btn-accent w-full">
                  <Lock size={14} />
                  {ru ? 'Оплатить' : 'Төлеу'}
                </button>

                <p className="text-center text-[11px] text-ink-400">
                  🔒{' '}
                  {ru
                    ? 'Тестовый режим — реальное списание не происходит'
                    : 'Тест режимі — нақты есептен шығару болмайды'}
                </p>
              </div>
            </motion.div>
          )}

          {phase === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="card p-12 text-center"
            >
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-500/10">
                <Loader2 size={32} className="animate-spin text-brand-500" />
              </div>
              <p className="mt-5 text-lg font-semibold text-ink-900 dark:text-white">
                {ru ? 'Обрабатываем платёж...' : 'Төлемді өңдеуде...'}
              </p>
              <p className="mt-1 text-sm text-ink-400">
                {ru ? 'Не закрывайте страницу' : 'Бетті жаппаңыз'}
              </p>
            </motion.div>
          )}

          {phase === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10"
              >
                <CheckCircle2 size={36} className="text-emerald-500" />
              </motion.div>
              <p className="mt-5 text-lg font-semibold text-ink-900 dark:text-white">
                {ru ? 'Платёж прошёл успешно!' : 'Төлем сәтті өтті!'}
              </p>
              <p className="mt-1 text-sm text-ink-400">
                {ru ? 'Оформляем ваш заказ...' : 'Тапсырысыңызды рәсімдеуде...'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function InputField({ label, error, className = '', ...rest }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink-700 dark:text-ink-200">{label}</span>
      <input
        {...rest}
        className={`input mt-1 ${className} ${error ? '!border-red-400 !ring-red-400/20' : ''}`}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}
