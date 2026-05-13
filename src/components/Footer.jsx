import { Link } from 'react-router-dom'
import { Instagram, Twitter, Github, Mail } from 'lucide-react'
import Logo from './Logo'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-ink-100 bg-ink-50/60 dark:border-ink-800 dark:bg-ink-900">
      <div className="container-x grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-ink-500 dark:text-ink-300">
            {t('footer.tagline')}
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Twitter, Github, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-ink-600 ring-1 ring-ink-100 transition-colors hover:text-brand-500 dark:bg-ink-800 dark:text-ink-200 dark:ring-ink-700"
                aria-label="social"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900 dark:text-white">
            {t('footer.catalog')}
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                to="/products"
                className="text-ink-500 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
              >
                {t('home.smartphones')}
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-ink-500 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
              >
                {t('home.laptops')}
              </Link>
            </li>
            <li>
              <Link
                to="/ai"
                className="text-ink-500 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
              >
                {t('nav.ai')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900 dark:text-white">
            {t('footer.company')}
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                to="/about"
                className="text-ink-500 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
              >
                {t('nav.about')}
              </Link>
            </li>
            <li>
              <a
                href="mailto:hello@techshop.kz"
                className="text-ink-500 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
              >
                hello@techshop.kz
              </a>
            </li>
            <li>
              <span className="text-ink-500 dark:text-ink-300">+7 (777) 000-00-00</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-100 dark:border-ink-800">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-500 dark:text-ink-400 md:flex-row">
          <p>© {year} TechShop. {t('footer.rights')}.</p>
          <p>Almaty · Kazakhstan</p>
        </div>
      </div>
    </footer>
  )
}
