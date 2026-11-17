import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import {
  YEAR_LABELS,
  type StudentProject,
} from '../data/projects'

const levelTone: Record<StudentProject['level'], string> = {
  Beginner: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  Intermediate: 'bg-indigo-50 text-indigo-700 ring-indigo-600/15',
  Advanced: 'bg-navy-100 text-navy-700 ring-navy-600/15',
}

export function ProjectCard({ project }: { project: StudentProject }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg">
      <div className="h-1.5 bg-gradient-to-r from-navy-800 via-indigo-500 to-emerald-500" />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-navy-900 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            {YEAR_LABELS[project.year]}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${levelTone[project.level]}`}
          >
            {project.level}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-gray-400">
            <Clock className="size-3.5" />
            {project.duration}
          </span>
        </div>

        <h3 className="mt-3 text-base font-bold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-indigo-700">
          {project.title}
        </h3>
        <p className="mt-1 text-sm font-semibold text-indigo-600">
          {project.tagline}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
          {project.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-600"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 4 ? (
            <span className="rounded-md bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-500">
              +{project.tech.length - 4}
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              ₹{project.price.toLocaleString('en-IN')}
            </span>
            {project.originalPrice ? (
              <span className="ml-2 text-xs text-gray-400 line-through">
                ₹{project.originalPrice.toLocaleString('en-IN')}
              </span>
            ) : null}
          </div>
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-navy-800"
          >
            View project
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
