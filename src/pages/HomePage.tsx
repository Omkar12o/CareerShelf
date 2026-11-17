import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ClipboardCheck,
  FileText,
  MessagesSquare,
  Presentation,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import { StatsCounter } from '../components/StatsCounter'
import { YearFilterCards } from '../components/YearFilterCards'
import { WhatYouGet } from '../components/WhatYouGet'
import { FeaturedProjectsGrid } from '../components/FeaturedProjectsGrid'
import { CareerSectionTeaser } from '../components/CareerSectionTeaser'
import { HowItWorks } from '../components/HowItWorks'
import { FaqAccordion } from '../components/FaqAccordion'
import { TestimonialCard, type Testimonial } from '../components/Testimonial'
import { PRODUCTS } from '../data/products'
import { usePageMeta } from '../lib/seo'

const trustPoints = [
  'Source code + PPT + documentation',
  'Submission-ready viva Q&A',
  'Delivered in 1–3 days',
]

const kitItems = [
  { icon: BookOpen, label: 'Full source code' },
  { icon: FileText, label: 'Report, SRS & diagrams' },
  { icon: Presentation, label: 'Review presentation' },
  { icon: ClipboardCheck, label: 'Viva questions & answers' },
  { icon: ShieldCheck, label: 'Setup guide + support' },
]

const testimonials: Testimonial[] = [
  {
    name: 'Aditi Rane',
    role: 'BCA · Final year, Pune',
    initials: 'AR',
    quote:
      'The documentation alone saved me a week. My guide asked for SRS, ER diagrams, and test cases — everything was already there and correctly formatted.',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'BE CSE · 3rd year',
    initials: 'RV',
    quote:
      'I bought a MERN project for my internship portfolio. The code was clean enough that I could actually explain every part in the interview.',
    rating: 5,
  },
  {
    name: 'Sneha Kulkarni',
    role: 'MCA · Passout',
    initials: 'SK',
    quote:
      'The interview question sets were exactly what campus placements asked. I used the STAR frameworks in three rounds and cleared two of them.',
    rating: 4,
  },
]

export function HomePage() {
  usePageMeta({
    title: 'Projects, interview prep & careers for tech students',
    description:
      'Ready-made college projects with source code, documentation, PPT and viva Q&A — plus interview preparation and career support for BCA, MCA, BSc CS and BE/BTech students.',
  })

  const featured = PRODUCTS.filter((product) => product.featured).slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_65%_75%_at_50%_0%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-24 size-[32rem] rounded-full bg-indigo-600/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-24 size-[28rem] rounded-full bg-emerald-500/20 blur-3xl"
        />

        <div className="container-page relative grid items-center gap-14 py-16 lg:grid-cols-[1.15fr_1fr] lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-navy-100">
              <Sparkles className="size-3.5 text-emerald-400" />
              Trusted by 15,000+ students across 40+ colleges
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Submit a project your guide
              <span className="text-indigo-300"> actually approves.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-200">
              Ready-made mini and final-year projects for 1st year through
              passout — with source code, documentation, PPT, and viva answers
              included. Interview prep and career support when you are ready for
              placements.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-navy-900 shadow-lg shadow-navy-950/40 transition-transform hover:-translate-y-0.5"
              >
                Browse projects
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/request-project"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:border-white/40 hover:bg-white/20"
              >
                Request a custom project
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-navy-200">
              {trustPoints.map((point) => (
                <li key={point} className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="size-4 shrink-0 text-emerald-400" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-indigo-500/25 via-transparent to-emerald-500/20 blur-2xl"
            />
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-navy-300">
                    Final-year kit
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">
                    Everything in one zip
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-300">
                  <Star className="size-3" fill="currentColor" />
                  4.8
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {kitItems.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-indigo-200">
                      <item.icon className="size-4" />
                    </span>
                    <span className="text-sm font-medium text-navy-100">
                      {item.label}
                    </span>
                    <BadgeCheck className="ml-auto size-4 shrink-0 text-emerald-400" />
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-between rounded-xl bg-navy-900/60 px-4 py-3">
                <span className="text-sm text-navy-200">Starting from</span>
                <span className="text-xl font-extrabold text-white">₹599</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust stats */}
      <section className="border-b border-border bg-white py-10 sm:py-12">
        <div className="container-page">
          <StatsCounter />
        </div>
      </section>

      {/* Choose your year */}
      <section className="section-padding bg-gray-50">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Find your level
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Choose your year
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-500">
              Every kit is scoped to the effort your college expects — from a
              first-year mini project to a full final-year submission.
            </p>
          </div>
          <div className="mt-10">
            <YearFilterCards />
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
              Included by default
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What you get with every kit
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-500">
              Not just a code dump. Each project is packaged the way a college
              submission actually needs it.
            </p>
          </div>
          <div className="mt-10">
            <WhatYouGet />
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="section-padding bg-gray-50">
        <div className="container-page">
          <FeaturedProjectsGrid
            products={featured}
            title="Featured this month"
            subtitle="The most purchased products across every category — projects, interview sets, and career guides."
          />
        </div>
      </section>

      {/* Career teaser */}
      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Beyond the project
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Built for two kinds of students
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-500">
              Whether you still have submissions to clear or you are already
              applying, the shelf has a track for you.
            </p>
          </div>
          <div className="mt-10">
            <CareerSectionTeaser />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-navy-50">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Simple process
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How it works
            </h2>
          </div>
          <div className="mt-10">
            <HowItWorks />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
              Student stories
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Students who stopped guessing
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-500">
              Real feedback from students who used these kits for submissions
              and placements.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <div className="bg-gray-50">
        <FaqAccordion subtitle="Everything students ask before buying their first kit." />
      </div>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-navy-950">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_60%_100%_at_50%_100%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-indigo-600/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-emerald-500/20 blur-3xl"
        />
        <div className="container-page relative py-20 text-center lg:py-24">
          <h2 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Finish the project. Then get the offer.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-navy-200 sm:text-lg">
            Start with a ready-made kit today, or tell us your topic and we will
            scope it, price it, and build it around your deadline.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/projects"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-navy-900 shadow-lg shadow-navy-950/40 transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              Browse projects
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/request-project"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:border-white/40 hover:bg-white/20 sm:w-auto"
            >
              <MessagesSquare className="size-4" />
              Talk to us about your project
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
