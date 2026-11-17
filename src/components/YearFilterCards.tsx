import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, Rocket, Sparkles, Trophy, Users } from 'lucide-react'

type YearOption = {
  year: string
  label: string
  description: string
  icon: typeof Users
}

const years: YearOption[] = [
  {
    year: '1st-year',
    label: '1st year',
    description: 'Mini projects and first portfolio apps',
    icon: Sparkles,
  },
  {
    year: '2nd-year',
    label: '2nd year',
    description: 'Skill-building projects with real APIs',
    icon: Users,
  },
  {
    year: '3rd-year',
    label: '3rd year',
    description: 'Internship-ready full-stack builds',
    icon: Rocket,
  },
  {
    year: 'final-year',
    label: 'Final year',
    description: 'Complete submission kits with docs & PPT',
    icon: GraduationCap,
  },
  {
    year: 'passout',
    label: 'Passout',
    description: 'Portfolio projects and interview prep',
    icon: Trophy,
  },
]

export function YearFilterCards({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {years.map((item) => (
          <Link
            key={item.year}
            to={`/projects?year=${item.year}`}
            className="group flex h-full flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg focus-visible:-translate-y-1"
          >
            <span className="inline-grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <item.icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-bold text-gray-900">
              {item.label}
            </h3>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-gray-500">
              {item.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
              Explore
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
