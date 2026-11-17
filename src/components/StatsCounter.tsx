import { Award, GraduationCap, Layers, Users } from 'lucide-react'

type Stat = {
  icon: typeof Users
  value: string
  label: string
  tone: string
}

const stats: Stat[] = [
  {
    icon: Users,
    value: '15,000+',
    label: 'Students helped',
    tone: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: Layers,
    value: '500+',
    label: 'Projects available',
    tone: 'bg-navy-100 text-navy-700',
  },
  {
    icon: GraduationCap,
    value: '40+',
    label: 'Colleges covered',
    tone: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Award,
    value: '4.8/5',
    label: 'Average rating',
    tone: 'bg-amber-50 text-amber-600',
  },
]

export function StatsCounter({ className = '' }: { className?: string }) {
  return (
    <div
      className={`grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 ${className}`}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6"
        >
          <span
            className={`inline-grid size-10 place-items-center rounded-xl ${stat.tone}`}
          >
            <stat.icon className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {stat.value}
          </p>
          <p className="mt-1 text-sm font-medium text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
