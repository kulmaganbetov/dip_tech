import { NavLink, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, ShoppingBag, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { t } = useLanguage()
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Subtle blur effect once the user scrolls a bit.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/products', label: t('nav.products') },
    { to: '/ai', label: t('nav.ai'), icon: Sparkles },
    { to: '/about', label: t('nav.about') },
  ]

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md ring-1 ring-ink-100 dark:bg-ink-900/80 dark:ring-ink-800'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-ink-100 text-ink-900 dark:bg-ink-800 dark:text-white'
                      : 'text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white'
                  }`
                }
              >
                {l.icon && <l.icon size={14} />}
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link
            to="/products"
            aria-label={t('nav.cart')}
            className="relative grid h-10 w-10 place-items-center rounded-full text-ink-700 transition-colors hover:bg-ink-100 dark:text-ink-100 dark:hover:bg-ink-800"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="ml-1 grid h-10 w-10 place-items-center rounded-full text-ink-700 transition-colors hover:bg-ink-100 md:hidden dark:text-ink-100 dark:hover:bg-ink-800"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-ink-100 bg-white md:hidden dark:border-ink-800 dark:bg-ink-900"
          >
            <ul className="container-x flex flex-col gap-1 py-3">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
                        isActive
                          ? 'bg-ink-100 text-ink-900 dark:bg-ink-800 dark:text-white'
                          : 'text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800'
                      }`
                    }
                  >
                    {l.icon && <l.icon size={16} />}
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
