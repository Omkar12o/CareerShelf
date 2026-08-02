import type { ReactNode } from 'react'

type LegalSection = {
  title: string
  children: ReactNode
}

type LegalLayoutProps = {
  title: string
  updatedAt: string
  intro?: ReactNode
  sections: LegalSection[]
}

export function LegalLayout({
  title,
  updatedAt,
  intro,
  sections,
}: LegalLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {updatedAt}</p>
        {intro ? (
          <p className="mt-6 text-base leading-relaxed text-gray-600">{intro}</p>
        ) : null}
        <div className="mt-8 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-gray-900">
                {section.title}
              </h2>
              <div className="mt-3 space-y-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                {section.children}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
