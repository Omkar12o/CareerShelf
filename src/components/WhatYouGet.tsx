import { BookOpen, ClipboardCheck, FileText, LifeBuoy, Presentation } from 'lucide-react'

type Deliverable = {
  icon: typeof BookOpen
  title: string
  description: string
}

const deliverables: Deliverable[] = [
  {
    icon: BookOpen,
    title: 'Full source code',
    description:
      'A complete, runnable repository with clean structure and comments you can actually explain in a viva.',
  },
  {
    icon: FileText,
    title: 'Project documentation',
    description:
      'Abstract, SRS, ER and sequence diagrams, test cases, and a user manual formatted for submission.',
  },
  {
    icon: Presentation,
    title: 'Presentation (PPT)',
    description:
      'A ready review deck covering problem statement, architecture, screenshots, and results.',
  },
  {
    icon: ClipboardCheck,
    title: 'Viva Q&A',
    description:
      'The questions examiners actually ask, with clear answers and the follow-ups to expect.',
  },
  {
    icon: LifeBuoy,
    title: 'Setup guide & support',
    description:
      'Step-by-step local setup instructions, plus direct support if something will not run.',
  },
]

export function WhatYouGet({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {deliverables.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="inline-grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <item.icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-bold text-gray-900">
              {item.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              {item.description}
            </p>
          </div>
        ))}

        <div className="flex flex-col justify-center rounded-2xl bg-navy-900 p-6 text-white">
          <h3 className="text-lg font-bold">Everything, in one zip.</h3>
          <p className="mt-2 text-sm leading-relaxed text-navy-200">
            No upsells, no missing files. You get code, docs, PPT, and viva
            support together — ready before your submission deadline.
          </p>
        </div>
      </div>
    </div>
  )
}
