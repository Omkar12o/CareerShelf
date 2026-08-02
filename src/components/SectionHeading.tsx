import type { ReactNode } from 'react'

type SectionHeadingProps = {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'center' | 'left'
  dark?: boolean
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  dark = false,
  className = '',
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-2xl ${
        align === 'center' ? 'mx-auto text-center' : 'text-left'
      } ${className}`}
    >
      {eyebrow ? (
        <p
          className={`mb-4 text-xs font-bold uppercase tracking-[0.18em] ${
            dark ? 'text-brand-400' : 'text-brand-600'
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl ${
          dark ? 'text-white' : 'text-gray-900'
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            dark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
