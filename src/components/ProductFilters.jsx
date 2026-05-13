import { ArrowDownAZ } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { CATEGORIES } from '../data/products'

/**
 * Filter & sort controls for the products page.
 * Controlled component — parent owns the state.
 */
export default function ProductFilters({
  category,
  setCategory,
  sort,
  setSort,
}) {
  const { t, lang } = useLanguage()

  const tabs = [
    { id: 'all', label: t('common.all') },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c[lang] })),
  ]

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategory(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              category === tab.id
                ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                : 'bg-ink-100 text-ink-700 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-200 dark:hover:bg-ink-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sort select */}
      <div className="relative">
        <ArrowDownAZ
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input cursor-pointer appearance-none pl-11 pr-10"
        >
          <option value="rating">{t('common.sortRating')}</option>
          <option value="asc">{t('common.sortAsc')}</option>
          <option value="desc">{t('common.sortDesc')}</option>
        </select>
      </div>
    </div>
  )
}
