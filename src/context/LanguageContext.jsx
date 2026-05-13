import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from '../data/translations'

const LanguageContext = createContext(null)
const STORAGE_KEY = 'techshop:lang'

// Helper to resolve a dotted path like "home.heroTitle" from the dictionary.
function resolve(obj, path) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj)
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'ru'
    return window.localStorage.getItem(STORAGE_KEY) || 'ru'
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  const value = useMemo(() => {
    const dict = translations[lang] || translations.ru
    return {
      lang,
      setLang,
      // t('home.heroTitle') style accessor with fallback to the key itself.
      t: (path) => resolve(dict, path) ?? path,
      dict,
    }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
