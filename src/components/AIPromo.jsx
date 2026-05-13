import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, MessageSquare, Cpu, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function AIPromo() {
  const { t } = useLanguage()

  const features = [
    { icon: MessageSquare, label: 'Smart Chat' },
    { icon: Cpu, label: 'GPT Powered' },
    { icon: ShieldCheck, label: 'Honest Advice' },
  ]

  return (
    <section className="container-x py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-800 to-brand-700 p-8 sm:p-14"
      >
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="chip bg-white/10 text-white backdrop-blur">
              <Sparkles size={12} className="text-brand-300" />
              AI Assistant
            </span>
            <h2 className="mt-5 text-balance text-3xl font-bold text-white sm:text-4xl">
              {t('home.aiPromoTitle')}
            </h2>
            <p className="mt-4 max-w-lg text-white/75">{t('home.aiPromoSub')}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/ai" className="btn-accent">
                <Sparkles size={16} />
                {t('home.aiPromoCta')}
              </Link>
              <Link
                to="/products"
                className="btn border border-white/20 px-5 py-2.5 text-white hover:bg-white/10"
              >
                {t('common.viewAll')}
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="inline-flex items-center gap-2 text-sm text-white/70"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10">
                    <f.icon size={14} />
                  </span>
                  {f.label}
                </div>
              ))}
            </div>
          </div>

          {/* Faux chat preview */}
          <div className="relative">
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur">
              <div className="space-y-3">
                <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2.5 text-sm text-white/90">
                  {t('ai.example1')}
                </div>
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-brand-500 px-4 py-2.5 text-sm text-white shadow-soft">
                  MacBook Pro M3 — 1 290 000 ₸. Идеально для разработки: M3 Pro, 18 GB RAM, 18ч автономности.
                </div>
                <div className="max-w-[60%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2.5 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-white/70" />
                    <span
                      className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-white/70"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-white/70"
                      style={{ animationDelay: '300ms' }}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
