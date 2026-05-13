import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { getFeatured } from '../data/products'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import { useFakeLoading } from '../hooks/useFakeLoading'

export default function FeaturedProducts() {
  const { t } = useLanguage()
  const featured = getFeatured()
  const loading = useFakeLoading(400)

  return (
    <section className="container-x py-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title">{t('home.featured')}</h2>
          <p className="section-subtitle">{t('home.featuredSub')}</p>
        </div>
        <Link
          to="/products"
          className="hidden items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 sm:inline-flex"
        >
          {t('common.viewAll')} <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  )
}
