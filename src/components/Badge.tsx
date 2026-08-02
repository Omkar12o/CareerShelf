import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  color?: 'brand' | 'emerald' | 'amber' | 'gray'
  className?: string
}

const colorClasses: Record<NonNullable<BadgeProps['color']>, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-600/10',
  emerald: 'bg-accent-50 text-accent-700 ring-accent-600/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  gray: 'bg-gray-100 text-gray-700 ring-gray-500/10',
}

export function Badge({
  children,
  color = 'brand',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  )
}
