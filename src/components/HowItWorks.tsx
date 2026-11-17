import { FolderGit2, LifeBuoy, Search, Wallet } from 'lucide-react'

type Step = {
  number: string
  title: string
  description: string
  icon: typeof Search
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Choose your project',
    description:
      'Filter by year, technology, or domain. Read exactly what is included before you decide.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Pay securely',
    description:
      'Check out with UPI. Every payment is verified by the gateway webhook — no manual screenshots needed.',
    icon: Wallet,
  },
  {
    number: '03',
    title: 'Download instantly',
    description:
      'Your dashboard unlocks the files the moment the order is confirmed paid.',
    icon: FolderGit2,
  },
  {
    number: '04',
    title: 'Get help if stuck',
    description:
      'Setup issues and viva doubts are covered. Ask directly and get an answer from the person who built it.',
    icon: LifeBuoy,
  },
]

export function HowItWorks({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="relative rounded-2xl border border-border bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="inline-grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <step.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="font-mono text-sm font-bold text-gray-300">
                {step.number}
              </span>
            </div>
            <h3 className="mt-4 text-base font-bold text-gray-900">
              {step.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
