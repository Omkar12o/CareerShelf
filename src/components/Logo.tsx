import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

type LogoProps = {
  className?: string
  inverted?: boolean
}

export function Logo({ className = '', inverted = false }: LogoProps) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="CareerShelf home"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-brand-600 shadow-sm transition-transform group-hover:scale-105">
        <BookOpen className="size-5 text-white" strokeWidth={2.2} />
      </span>
      <span
        className={`text-lg font-bold tracking-tight ${
          inverted ? 'text-white' : 'text-gray-900'
        }`}
      >
        Career<span className="text-brand-600">Shelf</span>
      </span>
    </Link>
  )
}
