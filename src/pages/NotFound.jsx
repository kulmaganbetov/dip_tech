import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="text-6xl font-extrabold text-brand-500">404</p>
        <p className="mt-3 text-ink-500 dark:text-ink-300">
          Page not found · Страница не найдена · Бет табылмады
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Home
        </Link>
      </div>
    </section>
  )
}
