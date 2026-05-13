import { useLanguage } from '../context/LanguageContext'

// Formats a number into "1 290 000 ₸" style. Locale tweaks per language.
export function useFormatPrice() {
  const { lang, dict } = useLanguage()
  const locale = lang === 'kz' ? 'kk-KZ' : 'ru-RU'
  return (value) =>
    `${new Intl.NumberFormat(locale).format(value)} ${dict.currency}`
}
