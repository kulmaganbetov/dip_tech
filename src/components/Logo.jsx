import { Link } from 'react-router-dom'

// Brand logo — used in navbar and footer.
export default function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-2 font-bold tracking-tight ${className}`}
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft transition-transform group-hover:rotate-6">
        <span className="text-lg font-extrabold">T</span>
      </span>
      <span className="text-xl">
        Tech<span className="text-brand-500">Shop</span>
      </span>
    </Link>
  )
}
