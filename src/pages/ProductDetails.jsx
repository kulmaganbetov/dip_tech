import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  Star,
  Truck,
  ShieldCheck,
  Check,
  ShoppingCart,
} from 'lucide-react'
import { getProductById, products } from '../data/products'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { useFormatPrice } from '../hooks/useFormatPrice'
import ProductCard from '../components/ProductCard'

export default function ProductDetails() {
  const { id } = useParams()
  const product = getProductById(id)
  const { t, lang } = useLanguage()
  const { add } = useCart()
  const fmt = useFormatPrice()

  if (!product) {
    return (
      <section className="container-x py-24 text-center">
        <p className="text-ink-500">404 · Product not found</p>
        <Link to="/products" className="btn-primary mt-6">
          {t('common.back')}
        </Link>
      </section>
    )
  }

  // 3 related items from the same category (excluding current).
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  const specsList = Object.entries(product.specifications)

  return (
    <section className="container-x py-10 sm:py-14">
      <Link
        to="/products"
        className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
      >
        <ChevronLeft size={16} />
        {t('common.back')}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="card overflow-hidden"
        >
          <div className="aspect-[4/3] bg-ink-50 dark:bg-ink-900">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <span className="chip">{product.brand}</span>
          <h1 className="mt-3 text-3xl font-bold text-ink-900 sm:text-4xl dark:text-white">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 text-ink-500 dark:text-ink-300">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              {product.rating}
            </span>
            <span className="text-ink-300">·</span>
            <span className="inline-flex items-center gap-1 text-emerald-500">
              <Check size={14} />
              {t('productDetails.inStock')}
            </span>
          </div>

          <p className="mt-5 text-ink-600 dark:text-ink-300">
            {product.description[lang]}
          </p>

          <div className="mt-8 flex items-center justify-between rounded-2xl bg-ink-50 p-5 dark:bg-ink-800">
            <div>
              <div className="text-xs uppercase tracking-wide text-ink-400">
                {t('common.from')}
              </div>
              <div className="text-3xl font-extrabold text-ink-900 dark:text-white">
                {fmt(product.price)}
              </div>
            </div>
            <button onClick={() => add(product.id)} className="btn-accent">
              <ShoppingCart size={18} />
              {t('common.buy')}
            </button>
          </div>

          <ul className="mt-6 grid gap-3 text-sm text-ink-600 sm:grid-cols-2 dark:text-ink-300">
            <li className="inline-flex items-center gap-2">
              <Truck size={16} className="text-brand-500" />
              {t('productDetails.delivery')}
            </li>
            <li className="inline-flex items-center gap-2">
              <ShieldCheck size={16} className="text-brand-500" />
              {t('productDetails.warranty')}
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Specs */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-ink-900 dark:text-white">
          {t('productDetails.specifications')}
        </h2>
        <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-ink-100 dark:ring-ink-700">
          <dl className="divide-y divide-ink-100 dark:divide-ink-700">
            {specsList.map(([key, val]) => (
              <div
                key={key}
                className="grid grid-cols-1 gap-1 bg-white px-5 py-3 sm:grid-cols-3 dark:bg-ink-800"
              >
                <dt className="text-sm uppercase tracking-wide text-ink-400">
                  {key}
                </dt>
                <dd className="text-sm text-ink-900 sm:col-span-2 dark:text-white">
                  {val}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-ink-900 dark:text-white">
            {t('home.featured')}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </section>
  )
}
