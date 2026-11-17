import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, GraduationCap, Users } from 'lucide-react'

const audiences = [
  {
    icon: Users,
    title: 'For students',
    description:
      'First year to final year: mini projects, final-year submission kits, and portfolio apps with code, docs, and PPT included.',
    to: '/projects',
    cta: 'Find your project',
    tone: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: GraduationCap,
    title: 'For freshers',
    description:
      'Question banks, resume guides, and mock interviews built around what actually gets asked in campus and off-campus rounds.',
    to: '/interview-prep',
    cta: 'Start interview prep',
    tone: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Briefcase,
    title: 'For career changers',
    description:
      'Referrals, verified HR contacts, and internship leads for final-year students and recent passouts.',
    to: '/careers',
    cta: 'Explore careers',
    tone: 'bg-amber-50 text-amber-600',
  },
]

export function CareerSectionTeaser({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid gap-5 md:grid-cols-3">
        {audiences.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
          >
            <span
              className={`inline-grid size-11 place-items-center rounded-xl ${item.tone}`}
            >
              <item.icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-gray-900">
              {item.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
              {item.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
              {item.cta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
