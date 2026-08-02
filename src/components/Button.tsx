import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type BaseProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    to?: undefined
    href?: undefined
  }

type ButtonAsLink = BaseProps & {
  to: string
  href?: undefined
  onClick?: () => void
}

type ButtonAsAnchor = BaseProps & {
  href: string
  to?: undefined
  onClick?: () => void
}

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-xl font-bold tracking-tight transition-all duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50'

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white shadow-sm shadow-brand-600/25 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md hover:shadow-brand-600/30 active:translate-y-0 active:bg-brand-800',
  secondary:
    'bg-brand-50 text-brand-700 hover:-translate-y-0.5 hover:bg-brand-100 active:translate-y-0 active:bg-brand-200',
  outline:
    'border border-gray-300 bg-white text-gray-700 shadow-sm hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 active:translate-y-0',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  danger:
    'bg-red-600 text-white shadow-sm shadow-red-600/25 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md active:translate-y-0 active:bg-red-800',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  if ('to' in rest && rest.to !== undefined) {
    const { to, onClick } = rest
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
      </Link>
    )
  }

  if ('href' in rest && rest.href !== undefined) {
    const { href, onClick } = rest
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
