import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  GraduationCap,
  MessagesSquare,
  Send,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { Button } from '../components/Button'
import { FaqAccordion } from '../components/FaqAccordion'
import { usePageMeta } from '../lib/seo'

const offers = [
  {
    icon: Send,
    title: 'Referral connections',
    description:
      'A warm, personalised introduction to a hiring manager or employee at a company that is actively hiring for your role.',
    points: [
      'Profile matched to open roles',
      'Introduction written and sent on your behalf',
      'Company and role brief included',
    ],
  },
  {
    icon: Building2,
    title: 'Verified HR contacts',
    description:
      'A curated spreadsheet of HR and talent acquisition contacts, validated before every export so you reach real inboxes.',
    points: [
      'Verified email and LinkedIn columns',
      'Company, industry, and hiring status',
      'Outreach templates that get replies',
    ],
  },
  {
    icon: Briefcase,
    title: 'Internship leads',
    description:
      'Internship openings from startups and product companies, filtered for students and recent passouts.',
    points: [
      'Roles that accept freshers',
      'Application deadlines tracked',
      'Referral path where available',
    ],
  },
]

const steps = [
  {
    title: 'Tell us your target',
    description:
      'Share your course, graduation year, preferred role, and location. Two minutes, no resume upload needed.',
  },
  {
    title: 'We match you',
    description:
      'We shortlist companies where your profile fits the open role and where a real contact exists.',
  },
  {
    title: 'We make the introduction',
    description:
      'You get the intro, the company brief, and the exact message sent — so your follow-up has context.',
  },
]

export function CareersPage() {
  usePageMeta({
    title: 'Careers, referrals & HR contacts for freshers',
    description:
      'Referral introductions, verified HR contacts, and internship leads for final-year students and recent passouts in tech.',
  })

  return (
    <>
      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Careers
              </p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                Get in front of a human, not a portal
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-600">
                Referrals, verified HR contacts, and internship leads for
                final-year students and recent passouts. Built for people who are
                applying seriously — not collecting job links.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button to="/contact" size="lg">
                  Talk to us
                  <ArrowRight className="size-4" />
                </Button>
                <Button to="/products?category=referral" variant="outline" size="lg">
                  Browse referral services
                </Button>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-gray-600">
                <li className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="size-4 text-emerald-600" />
                  Verified contacts only
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-indigo-600" />
                  No fake job guarantees
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <GraduationCap className="size-4 text-indigo-600" />
                  Fresher-friendly roles
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-gray-50 p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">
                Who this is for
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Users className="mt-0.5 size-4 shrink-0 text-indigo-600" />
                  Final-year BCA, MCA, BSc CS, and BE/BTech students
                </li>
                <li className="flex items-start gap-2">
                  <Users className="mt-0.5 size-4 shrink-0 text-indigo-600" />
                  Passouts within 24 months of graduation
                </li>
                <li className="flex items-start gap-2">
                  <Users className="mt-0.5 size-4 shrink-0 text-indigo-600" />
                  Career changers moving into tech roles
                </li>
              </ul>
              <p className="mt-5 border-t border-gray-200 pt-4 text-xs leading-relaxed text-gray-500">
                We do not sell job offers. We sell access, preparation, and a
                better introduction. Outcomes depend on your interview
                performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              What we offer
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Three ways to get unstuck
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {offers.map((offer) => (
              <div
                key={offer.title}
                className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-sm"
              >
                <span className="inline-grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <offer.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  {offer.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {offer.description}
                </p>
                <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                  {offer.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How a referral works
            </h2>
          </div>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm"
              >
                <span className="inline-grid size-9 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-base font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl bg-navy-900 p-8 text-white sm:flex-row sm:p-10">
            <div className="max-w-xl">
              <h2 className="text-2xl font-extrabold tracking-tight">
                Ready to apply properly?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-navy-200">
                Start with your project and resume, then use our referral network
                when your profile is ready.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Link
                to="/interview-prep"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/20"
              >
                <MessagesSquare className="size-4" />
                Interview prep
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-navy-900 hover:bg-gray-100"
              >
                Contact us
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-gray-50">
        <FaqAccordion
          title="Careers questions"
          subtitle="How referrals, contacts, and internship leads work at CareerShelf."
        />
      </div>
    </>
  )
}
