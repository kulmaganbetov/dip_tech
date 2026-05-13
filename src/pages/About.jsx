import { motion } from 'framer-motion'
import { BadgePercent, Bot, ShieldCheck, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function About() {
  const { t } = useLanguage()

  const values = [
    { icon: BadgePercent, title: t('about.value1Title'), text: t('about.value1') },
    { icon: Bot, title: t('about.value2Title'), text: t('about.value2') },
    { icon: ShieldCheck, title: t('about.value3Title'), text: t('about.value3') },
  ]

  const team = [
    { name: 'Aiman K.', role: 'CEO', img: 'https://i.pravatar.cc/200?img=47' },
    { name: 'Daniyar B.', role: 'CTO', img: 'https://i.pravatar.cc/200?img=12' },
    { name: 'Saule A.', role: 'Head of Product', img: 'https://i.pravatar.cc/200?img=32' },
    { name: 'Olzhas T.', role: 'AI Lead', img: 'https://i.pravatar.cc/200?img=68' },
  ]

  return (
    <section className="container-x py-12 sm:py-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl"
      >
        <span className="chip">
          <Sparkles size={12} className="text-brand-500" />
          TechShop
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl dark:text-white">
          {t('about.title')}
        </h1>
        <p className="mt-4 text-lg text-ink-500 dark:text-ink-300">
          {t('about.subtitle')}
        </p>
      </motion.div>

      {/* Mission */}
      <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="card overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80"
            alt="Mission"
            className="aspect-video w-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-ink-900 dark:text-white">
            {t('about.missionTitle')}
          </h2>
          <p className="mt-3 text-ink-500 dark:text-ink-300">{t('about.mission')}</p>
        </div>
      </div>

      {/* Values */}
      <div className="mt-20">
        <h2 className="section-title">{t('about.valuesTitle')}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card p-6"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/10 text-brand-500">
                <v.icon size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink-900 dark:text-white">
                {v.title}
              </h3>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mt-20">
        <h2 className="section-title">{t('about.teamTitle')}</h2>
        <p className="section-subtitle">{t('about.teamSub')}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card card-hover overflow-hidden text-center"
            >
              <div className="aspect-square overflow-hidden bg-ink-50 dark:bg-ink-900">
                <img
                  src={m.img}
                  alt={m.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="font-semibold text-ink-900 dark:text-white">
                  {m.name}
                </div>
                <div className="text-sm text-ink-500 dark:text-ink-300">
                  {m.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
