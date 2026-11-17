import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { RequestForm } from '../components/RequestForm'
import { YEAR_LABELS, getProjectBySlug } from '../data/projects'
import type { ProjectRequestInput } from '../data/projectRequests'
import { usePageMeta } from '../lib/seo'

const WHATSAPP_URL =
  'https://wa.me/919209315645?text=' +
  encodeURIComponent('Hi, I need help choosing a project on CareerShelf.')

function budgetForPrice(price: number): string {
  if (price < 3000) return 'Under ₹3,000'
  if (price < 6000) return '₹3,000 – ₹6,000'
  if (price < 10000) return '₹6,000 – ₹10,000'
  if (price < 20000) return '₹10,000 – ₹20,000'
  return '₹20,000+'
}

const nextSteps = [
  {
    title: 'We reply within one working day',
    description:
      'Usually much faster on WhatsApp. You get a clear scope and a fixed price — not a vague "it depends".',
  },
  {
    title: 'You approve the plan first',
    description:
      'Nothing starts until you agree on features, timeline, and price. No surprise add-ons later.',
  },
  {
    title: 'Delivery with everything included',
    description:
      'Source code, documentation, PPT, setup guide, and viva answers arrive together before your deadline.',
  },
]

export function RequestProjectPage() {
  usePageMeta({
    title: 'Request a project — custom college projects',
    description:
      'Tell us your topic, tech stack, and deadline. Get a fixed-price custom mini or final-year project with source code, documentation, PPT, and viva preparation.',
  })

  const [searchParams] = useSearchParams()
  const projectSlug = searchParams.get('project')
  const project = projectSlug ? getProjectBySlug(projectSlug) : undefined

  const initialValues = useMemo<Partial<ProjectRequestInput>>(() => {
    if (!project) return {}

    const description = [
      `I'd like the "${project.title}" project kit (${YEAR_LABELS[project.year]} · ${project.domain}).`,
      '',
      `Preferred tech stack: ${project.tech.join(', ')}.`,
      '',
      'Please confirm what is included, the final price, and the delivery date.',
    ].join('\n')

    return {
      description,
      project_type:
        project.year === 'final-year' ? 'Final-year project' : 'Mini project',
      tech_stack: project.tech.join(', '),
      budget: budgetForPrice(project.price),
      needs: ['Ready-made project kit'],
      source_project: project.slug,
    }
  }, [project])

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-navy-950 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-24 size-[26rem] rounded-full bg-indigo-600/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-0 size-80 rounded-full bg-emerald-500/15 blur-3xl"
        />
        <div className="container-page relative py-14 lg:py-18">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-navy-100">
              <Sparkles className="size-3.5 text-emerald-400" />
              Custom projects from ₹3,000
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Tell us what you need built
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-200 sm:text-lg">
              Share your topic, tech stack, and deadline. We reply with a fixed
              price and a delivery date — and you only pay once the scope is
              agreed.
            </p>

            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-navy-200">
              <li className="inline-flex items-center gap-1.5">
                <BadgeCheck className="size-4 shrink-0 text-emerald-400" />
                Fixed price, agreed up front
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Clock className="size-4 shrink-0 text-emerald-400" />
                Reply within 1 working day
              </li>
              <li className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 shrink-0 text-emerald-400" />
                Documentation and viva included
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding-small bg-gray-50">
        <div className="container-page">
          {project ? (
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Prefilled from project
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {project.title}{' '}
                  <span className="font-normal text-gray-500">
                    · ₹{project.price.toLocaleString('en-IN')}
                  </span>
                </p>
              </div>
              <Link
                to={`/projects/${project.slug}`}
                className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-indigo-700 hover:text-indigo-800"
              >
                View project
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : null}

          <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:items-start">
            <RequestForm
              key={project?.slug ?? 'blank'}
              initialValues={initialValues}
            />

            <aside className="space-y-5 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900">
                  What happens next
                </h2>
                <ol className="mt-4 space-y-4">
                  {nextSteps.map((step, index) => (
                    <li key={step.title} className="flex items-start gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-navy-900 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {step.title}
                        </p>
                        <p className="mt-0.5 text-sm leading-relaxed text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <span className="inline-grid size-10 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <MessageCircle className="size-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-base font-bold text-gray-900">
                  Need an answer right now?
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-emerald-900/80">
                  Message on WhatsApp with your topic and deadline. We will tell
                  you honestly whether we can deliver in time.
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                >
                  <MessageCircle className="size-4" />
                  Chat on WhatsApp
                </a>
              </div>

              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900">
                  Prefer a ready-made kit?
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                  Browse projects that are already built, documented, and ready
                  to download today.
                </p>
                <Link
                  to="/projects"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Browse the project library
                  <ArrowRight className="size-4" />
                </Link>
                <p className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
                  <Mail className="size-3.5 text-gray-400" />
                  Prefer email? Write to hello@careershelf.co
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
