import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import SearchBar from '../components/SearchBar'
import ProductFilters from '../components/ProductFilters'
import { useLanguage } from '../context/LanguageContext'
import { useFakeLoading } from '../hooks/useFakeLoading'

export default function Products() {
  const { t, lang } = useLanguage()
  const [params, setParams] = useSearchParams()
  const loading = useFakeLoading(500)

  // URL is the source of truth for category, so deep links work.
  const category = params.get('category') || 'all'
  const setCategory = (id) => {
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('category')
    else next.set('category', id)
    setParams(next, { replace: true })
  }

  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('rating')

  // Reset query when route param changes (nice UX).
  useEffect(() => {
    setQuery('')
  }, [category])

  const visible = useMemo(() => {
    let list = products

    if (category !== 'all') {
      list = list.filter((p) => p.category === category)
    }

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortSpecs[lang].toLowerCase().includes(q)
      )
    }

    if (sort === 'asc') list = [...list].sort((a, b) => a.price - b.price)
    else if (sort === 'desc') list = [...list].sort((a, b) => b.price - a.price)
    else list = [...list].sort((a, b) => b.rating - a.rating)

    return list
  }, [category, query, sort, lang])

  return (
    <section className="container-x py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="section-title">{t('productsPage.title')}</h1>
        <p className="section-subtitle">{t('productsPage.subtitle')}</p>
      </motion.div>

      <div className="mt-8 grid gap-4">
        <SearchBar value={query} onChange={setQuery} className="max-w-xl" />
        <ProductFilters
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 p-12 text-center text-ink-500 dark:border-ink-700 dark:text-ink-300">
            {t('common.noResults')}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
