import { Search, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function SearchBar({ value, onChange, className = '' }) {
  const { t } = useLanguage()
  return (
    <div className={`relative ${className}`}>
      <Search
        size={16}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('common.search')}
        className="input pl-11 pr-10"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700"
          aria-label="Clear"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
