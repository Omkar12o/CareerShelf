import { Award, Briefcase, Heart, Target } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { Reveal } from '../components/Reveal'

const stats = [
  { value: '8,400+', label: 'Products sold' },
  { value: '6 years', label: 'Interviewing candidates' },
  { value: '4.8 / 5', label: 'Average product rating' },
  { value: '30 days', label: 'Money-back guarantee' },
]

const values = [
  {
    icon: Target,
    title: 'Practical over theoretical',
    description:
      'Every product answers one question: will this help someone get hired this week? If it won\u2019t, it doesn\u2019t ship.',
  },
  {
    icon: Heart,
    title: 'Built from the candidate side',
    description:
      'I spent years on the other side of the table as an interviewer — and even more years watching great candidates fail for fixable reasons.',
  },
  {
    icon: Award,
    title: 'Kept up to date',
    description:
      'Company contacts and interview trends change fast. Updates ship quarterly, and every buyer gets them free for life.',
  },
  {
    icon: Briefcase,
    title: 'A fair guarantee',
    description:
      'If a product isn\u2019t useful to you, email within 30 days and get a full refund. No forms, no friction.',
  },
]

export function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gray-950">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full bg-brand-600/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 bottom-0 size-[24rem] rounded-full bg-accent-500/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <Badge color="brand">About</Badge>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Six years watching great candidates fail on{' '}
                <span className="text-brand-400">fixable</span> things.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-gray-400">
                CareerShelf started as a folder of resources I shared with
                friends who were job hunting. It became a store when people
                kept asking for the spreadsheets and question lists they
                couldn&apos;t find anywhere else.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-16 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur transition-colors duration-200 hover:border-brand-400/40 hover:bg-white/10"
                >
                  <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <SectionHeading
                align="left"
                eyebrow="The story"
                title="How CareerShelf came to be"
              />
              <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-600">
                <p>
                  In my first job as a hiring manager, I read hundreds of
                  resumes and ran hundreds of interviews. The pattern was
                  always the same: qualified people failing on process, not on
                  talent. They used resumes that ATS filters ate, applied
                  through portals nobody read, and walked into interviews
                  without a framework.
                </p>
                <p>
                  So I started writing down what worked. The contact lists I
                  built for my own team. The question banks my interviewers
                  actually used. The resume structure that got candidates
                  through the scanner. Friends asked for copies, then their
                  friends asked, and CareerShelf was born.
                </p>
                <p>
                  Today every product still starts the same way: I ask real
                  hiring managers and recruiters what they look for, build the
                  resource, and ship it with a money-back guarantee. If it
                  doesn&apos;t help you, it isn&apos;t worth keeping your
                  money.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid gap-6 sm:grid-cols-2">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md hover:shadow-gray-900/5"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white">
                    <value.icon className="size-5.5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 font-bold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-violet-800">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_60%_100%_at_50%_100%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-brand-400/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              Ready to see the resources that get people hired?
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                to="/products"
                size="lg"
                className="bg-white text-brand-700 shadow-xl shadow-brand-900/30 hover:bg-gray-100"
              >
                Browse the store
              </Button>
              <Button
                to="/contact"
                variant="outline"
                size="lg"
                className="border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/20"
              >
                Ask me anything
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
