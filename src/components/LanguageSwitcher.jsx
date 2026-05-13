import { Globe } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

const LANGUAGES = [
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'kz', label: 'Қазақша', short: 'KZ' },
]

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close dropdown on outside click.
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [])

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100 dark:text-ink-100 dark:hover:bg-ink-800"
      >
        <Globe size={16} />
        <span>{current.short}</span>
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-100 dark:bg-ink-800 dark:ring-ink-700">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code)
                setOpen(false)
              }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-ink-50 dark:hover:bg-ink-700 ${
                l.code === lang
                  ? 'text-brand-500'
                  : 'text-ink-700 dark:text-ink-100'
              }`}
            >
              {l.label}
              <span className="text-xs text-ink-400">{l.short}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
