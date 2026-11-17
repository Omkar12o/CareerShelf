import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CircleHelp,
  Clock,
  MessagesSquare,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '../components/Button'
import {
  YEAR_LABELS,
  getProjectBySlug,
  type StudentProject,
} from '../data/projects'
import { usePageMeta } from '../lib/seo'

const WHATSAPP_URL =
  'https://wa.me/919209315645?text=' +
  encodeURIComponent('Hi, I have a question about a CareerShelf project')

function NotFound() {
  return (
    <section className="section-padding">
      <div className="container-page max-w-xl text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Project not found
        </h1>
        <p className="mt-3 text-base text-gray-500">
          That project may have been renamed or is no longer listed.
        </p>
        <div className="mt-8 flex justify-center">
          <Button to="/projects">Back to all projects</Button>
        </div>
      </div>
    </section>
  )
}

function MetaRow({ project }: { project: StudentProject }) {
  return (
    <dl className="grid grid-cols-2 gap-4">
      <div className="rounded-xl border border-border bg-white p-4">
        <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Year
        </dt>
        <dd className="mt-1 text-sm font-bold text-gray-900">
          {YEAR_LABELS[project.year]}
        </dd>
      </div>
      <div className="rounded-xl border border-border bg-white p-4">
        <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Level
        </dt>
        <dd className="mt-1 text-sm font-bold text-gray-900">{project.level}</dd>
      </div>
      <div className="rounded-xl border border-border bg-white p-4">
        <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Domain
        </dt>
        <dd className="mt-1 text-sm font-bold text-gray-900">
          {project.domain}
        </dd>
      </div>
      <div className="rounded-xl border border-border bg-white p-4">
        <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Delivery
        </dt>
        <dd className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-gray-900">
          <Clock className="size-3.5 text-gray-400" />
          {project.duration}
        </dd>
      </div>
    </dl>
  )
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  usePageMeta({
    title: project
      ? `${project.title} — ${YEAR_LABELS[project.year]} project`
      : 'Project not found',
    description: project?.summary,
  })

  if (!project) return <NotFound />

  return (
    <>
      <section className="border-b border-border bg-white">
        <div className="container-page py-6">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-indigo-600"
          >
            <ArrowLeft className="size-4" />
            All projects
          </Link>
        </div>
      </section>

      <section className="section-padding-small bg-gray-50">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            {/* Main content */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-navy-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  {YEAR_LABELS[project.year]}
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/15">
                  {project.level}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-gray-600 ring-1 ring-inset ring-gray-200">
                  {project.domain}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {project.title}
              </h1>
              <p className="mt-2 text-lg font-semibold text-indigo-600">
                {project.tagline}
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                {project.summary}
              </p>

              <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">
                  The problem it solves
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {project.problem}
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">
                  Features you can demonstrate
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm leading-relaxed text-gray-600"
                    >
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-emerald-600"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">
                  What is included
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {project.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-relaxed text-gray-600"
                    >
                      <BadgeCheck
                        className="mt-0.5 size-4 shrink-0 text-indigo-600"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">Tech stack</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <MetaRow project={project} />
              </div>
            </div>

            {/* Sticky action card */}
            <aside className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-lg">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Project kit
                </p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-gray-900">
                    ₹{project.price.toLocaleString('en-IN')}
                  </span>
                  {project.originalPrice ? (
                    <span className="pb-1 text-sm text-gray-400 line-through">
                      ₹{project.originalPrice.toLocaleString('en-IN')}
                    </span>
                  ) : null}
                </div>

                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" />
                    Source code + documentation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" />
                    PPT and viva questions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" />
                    Delivered in {project.duration}
                  </li>
                </ul>

                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    to={`/request-project?project=${encodeURIComponent(project.slug)}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
                  >
                    Get this project
                    <ArrowRight className="size-4" />
                  </Link>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <MessagesSquare className="size-4" />
                    Ask a question
                  </a>
                </div>

                <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
                  <p className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-emerald-600" />
                    Payment verified before delivery
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CircleHelp className="size-3.5 text-indigo-600" />
                    Customisation available on request
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-white p-5 text-sm text-gray-600">
                <p className="font-semibold text-gray-900">
                  Not exactly your topic?
                </p>
                <p className="mt-1 leading-relaxed">
                  Custom projects start from ₹3,000 and are scoped around your
                  college requirements.
                </p>
                <Link
                  to="/request-project"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Request a custom build
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
