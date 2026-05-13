import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial" />
      <div
        className="pointer-events-none absolute inset-0 bg-hero-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{ backgroundSize: '40px 40px' }}
      />

      <div className="container-x relative grid gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="chip mb-5 bg-white/70 backdrop-blur dark:bg-ink-800/70"
          >
            <Sparkles size={12} className="text-brand-500" />
            AI Powered · 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-balance text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl lg:text-6xl dark:text-white"
          >
            {t('home.heroTitle')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500 dark:text-ink-300"
          >
            {t('home.heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/products" className="btn-primary">
              {t('home.ctaShop')}
              <ArrowRight size={16} />
            </Link>
            <Link to="/ai" className="btn-outline">
              <Sparkles size={16} className="text-brand-500" />
              {t('home.ctaAI')}
            </Link>
          </motion.div>

          {/* Stats strip */}
          <div className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {[
              { v: '10k+', l: '★ ' + t('common.rating') },
              { v: '500+', l: 'SKU' },
              { v: '24/7', l: 'AI' },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold text-ink-900 dark:text-white">
                  {s.v}
                </div>
                <div className="text-xs uppercase tracking-wide text-ink-400">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-brand-500/20 via-brand-300/10 to-transparent blur-2xl" />
            <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-white shadow-card ring-1 ring-ink-100 dark:bg-ink-800 dark:ring-ink-700">
              <img
                src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=900&q=80"
                alt="Hero device"
                className="h-full w-full object-cover"
              />
            </div>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink-100 sm:block dark:bg-ink-800 dark:ring-ink-700"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-900 dark:text-white">
                    TechShop AI
                  </div>
                  <div className="text-xs text-ink-500 dark:text-ink-300">
                    {t('home.ctaAI')}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
