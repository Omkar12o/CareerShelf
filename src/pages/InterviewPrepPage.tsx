import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Code,
  FileText,
  Layers,
  MessagesSquare,
  Rocket,
  Target,
  Users,
} from 'lucide-react'
import { FaqAccordion } from '../components/FaqAccordion'
import { usePageMeta } from '../lib/seo'

const tracks = [
  {
    icon: MessagesSquare,
    title: 'Q&A banks',
    description:
      'Structured question sets with answer frameworks, worked examples, and the follow-ups interviewers actually ask.',
    to: '/products?category=interview',
  },
  {
    icon: Code,
    title: 'DSA & coding rounds',
    description:
      'Curated problems with brute-force to optimal solutions, complexity analysis, and patterns grouped by topic.',
    to: '/products?category=interview',
  },
  {
    icon: Layers,
    title: 'Core Java & Spring',
    description:
      'OOP fundamentals, collections, concurrency, and Spring Boot questions that show up in service-based company rounds.',
    to: '/products?category=interview',
  },
  {
    icon: FileText,
    title: 'Python & data',
    description:
      'Python internals, SQL joins and window functions, statistics refreshers, and data case-study walkthroughs.',
    to: '/products?category=interview',
  },
  {
    icon: Rocket,
    title: 'MERN & full stack',
    description:
      'React rendering, hooks, Node event loop, API design, authentication, and database modelling questions.',
    to: '/products?category=interview',
  },
  {
    icon: Target,
    title: 'HR & behavioural',
    description:
      'STAR-format answers, salary negotiation scripts, and the culture-fit questions freshers get caught on.',
    to: '/products?category=interview',
  },
]

const plan = [
  {
    week: 'Week 1',
    title: 'Fix your fundamentals',
    description:
      'Cover the core language and database questions for your track. Write answers out loud, not just in your head.',
  },
  {
    week: 'Week 2',
    title: 'Practise under time',
    description:
      'Solve coding problems against a clock. Review every wrong answer and note the pattern you missed.',
  },
  {
    week: 'Week 3',
    title: 'Build your stories',
    description:
      'Prepare four STAR stories covering conflict, failure, ownership, and impact. Rewrite them until they are 90 seconds each.',
  },
  {
    week: 'Week 4',
    title: 'Mock and refine',
    description:
      'Run two mock interviews, score yourself against the rubric, and fix only the top three weaknesses.',
  },
]

export function InterviewPrepPage() {
  usePageMeta({
    title: 'Interview preparation for freshers',
    description:
      'Question banks, DSA practice, and HR frameworks for campus and off-campus interviews — built for BCA, MCA, BSc CS and BE/BTech freshers.',
  })

  return (
    <>
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_65%_75%_at_50%_0%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-24 size-[26rem] rounded-full bg-indigo-600/25 blur-3xl"
        />
        <div className="container-page relative py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
              Interview preparation
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Prepare for the interview, not just the syllabus
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-navy-200">
              Question banks and frameworks organised by round and role — so you
              walk in knowing what to expect instead of revising everything at
              once.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products?category=interview"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-navy-900 transition-transform hover:-translate-y-0.5"
              >
                Browse question banks
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/careers"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
              >
                <Users className="size-4" />
                Referrals & HR contacts
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Choose your track
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Six preparation tracks
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-500">
              Each track is organised by round, not by chapter, so your revision
              matches the interview flow.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track) => (
              <Link
                key={track.title}
                to={track.to}
                className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
              >
                <span className="inline-grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <track.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-gray-900">
                  {track.title}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-gray-500">
                  {track.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                  Open track
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
              Four-week plan
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How to prepare when the interview is close
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {plan.map((step) => (
              <div
                key={step.week}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm"
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  {step.week}
                </p>
                <h3 className="mt-2 text-base font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-gray-50">
        <FaqAccordion
          title="Interview prep questions"
          subtitle="How the question banks work and how to use them before a placement drive."
        />
      </div>
    </>
  )
}
