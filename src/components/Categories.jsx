import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Smartphone, Laptop, Headphones, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Categories() {
  const { t } = useLanguage()

  const cats = [
    {
      title: t('home.smartphones'),
      desc: 'iPhone · Galaxy · Pixel · Xiaomi',
      to: '/products?category=smartphones',
      icon: Smartphone,
      image:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: t('home.laptops'),
      desc: 'MacBook · ROG · Legion · XPS',
      to: '/products?category=laptops',
      icon: Laptop,
      image:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: t('home.accessories'),
      desc: 'AirPods · Mice · Hubs',
      to: '/products',
      icon: Headphones,
      image:
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80',
    },
  ]

  return (
    <section className="bg-ink-50/60 py-20 dark:bg-ink-900">
      <div className="container-x">
        <div className="max-w-2xl">
          <h2 className="section-title">{t('home.categories')}</h2>
          <p className="section-subtitle">{t('home.categoriesSub')}</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cats.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to={c.to}
                className="card card-hover group relative block h-64 overflow-hidden"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/30 to-transparent" />
                <div className="relative flex h-full flex-col justify-between p-6 text-white">
                  <div className="inline-flex h-10 w-10 items-center justify-center self-start rounded-xl bg-white/15 backdrop-blur">
                    <c.icon size={18} />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{c.title}</h3>
                      <p className="text-sm text-white/75">{c.desc}</p>
                    </div>
                    <ArrowUpRight
                      size={20}
                      className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
