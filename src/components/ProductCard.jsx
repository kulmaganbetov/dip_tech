import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ShoppingCart } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { useFormatPrice } from '../hooks/useFormatPrice'

/**
 * Reusable product tile. Used on home (featured) and the products grid.
 */
export default function ProductCard({ product, index = 0 }) {
  const { t, lang } = useLanguage()
  const { add } = useCart()
  const fmt = useFormatPrice()

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    add(product.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Link to={`/products/${product.id}`} className="block">
        <article className="card card-hover group flex h-full flex-col overflow-hidden">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-ink-50 dark:bg-ink-900">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute left-3 top-3 chip backdrop-blur-sm bg-white/80 dark:bg-ink-900/80">
              {product.brand}
            </span>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-ink-900 dark:text-white">
                {product.name}
              </h3>
              <div className="flex shrink-0 items-center gap-1 text-xs text-ink-500 dark:text-ink-300">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                {product.rating}
              </div>
            </div>

            <p className="mt-1 line-clamp-2 text-sm text-ink-500 dark:text-ink-300">
              {product.shortSpecs[lang]}
            </p>

            <div className="mt-auto flex items-end justify-between pt-5">
              <div>
                <div className="text-xs text-ink-400 dark:text-ink-400">
                  {t('common.from')}
                </div>
                <div className="text-lg font-bold text-ink-900 dark:text-white">
                  {fmt(product.price)}
                </div>
              </div>
              <button
                onClick={handleAdd}
                className="btn-accent !px-4 !py-2 text-sm"
                aria-label={t('common.addToCart')}
              >
                <ShoppingCart size={16} />
                <span className="hidden sm:inline">{t('common.buy')}</span>
              </button>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
