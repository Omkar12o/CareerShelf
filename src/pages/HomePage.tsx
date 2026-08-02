import {
  BookOpen,
  Users,
  MessagesSquare,
  PhoneCall,
  FileText,
  Link2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { Hero } from '../components/Hero'
import { SectionHeading } from '../components/SectionHeading'
import { TestimonialCard, type Testimonial } from '../components/Testimonial'
import { ProductCard } from '../components/ProductCard'
import { ConsultancyCard } from '../components/ConsultancyCard'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { PRODUCTS } from '../data/products'

const features = [
  {
    icon: BookOpen,
    title: 'Digital ebooks',
    description:
      'Straightforward career guides with templates and before/after examples — no fluff, no filler chapters.',
  },
  {
    icon: Users,
    title: 'HR contact lists',
    description:
      'Verified email and LinkedIn contacts at thousands of companies, refreshed quarterly so you reach real humans.',
  },
  {
    icon: MessagesSquare,
    title: 'Interview question sets',
    description:
      'Structured question banks with frameworks and worked answers across engineering, PM, and data roles.',
  },
  {
    icon: PhoneCall,
    title: 'Consultancy calls',
    description:
      '1-on-1 calls for strategy sprints, deep resume reviews, and mock interviews — with written notes after every call.',
  },
  {
    icon: FileText,
    title: 'Resume guides',
    description:
      'Downloadable templates and guides built to pass ATS scans and still read beautifully to hiring managers.',
  },
  {
    icon: Link2,
    title: 'Reference & referrals',
    description:
      'Warm, personalized introductions to hiring managers and product leaders at companies actively hiring.',
  },
]

const testimonials: Testimonial[] = [
  {
    name: 'Priya Sharma',
    role: 'Product Manager @ fintech startup',
    initials: 'PS',
    quote:
      'The PM question set paid for itself. I used the frameworks in every single round and had an offer within three weeks.',
    rating: 5,
  },
  {
    name: 'Daniel Kim',
    role: 'Senior Software Engineer',
    initials: 'DK',
    quote:
      'I sent out 40 emails from the HR list and got 9 responses. Nine. Nothing else I tried even came close to that reply rate.',
    rating: 5,
  },
  {
    name: 'Amara Osei',
    role: 'Career changer · data analyst',
    initials: 'AO',
    quote:
      'The resume blueprint helped me rewrite my resume in an evening. Two weeks later I had my first data interview scheduled.',
    rating: 4,
  },
]

export function HomePage() {
  const featured = PRODUCTS.filter((p) => p.featured)
  const consultancy = PRODUCTS.filter((p) => p.category === 'consultancy')
  const newArrivals = PRODUCTS.filter(
    (p) => p.badge === 'New' && p.category !== 'consultancy',
  )

  return (
    <>
      <Hero />

      {/* What you get — dark contrast band */}
      <section className="relative overflow-hidden bg-gray-950">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_70%_70%_at_50%_0%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-0 size-[32rem] rounded-full bg-brand-600/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 bottom-0 size-[28rem] rounded-full bg-accent-500/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal>
            <SectionHeading
              eyebrow="What you get"
              title={
                <>
                  Everything you need to go from{' '}
                  <span className="text-brand-400">applied</span> to{' '}
                  <span className="text-accent-400">hired</span>
                </>
              }
              subtitle="One store with the tools that actually move the needle in a job search — researched, tested, and kept up to date."
              dark
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-white/10"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300 transition-colors duration-200 group-hover:bg-brand-500/25 group-hover:text-brand-200">
                    <feature.icon className="size-5.5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                align="left"
                eyebrow="Bestsellers"
                title="Start with what works"
                subtitle="The most popular products in the store, picked by fellow job seekers."
                className="max-w-xl"
              />
              <Button to="/products" variant="outline">
                Browse all products
              </Button>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) =>
                product.category === 'consultancy' ? (
                  <ConsultancyCard key={product.id} product={product} />
                ) : (
                  <ProductCard key={product.id} product={product} />
                ),
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Consultancy — light band with soft mesh */}
      <section className="relative overflow-hidden bg-gray-50">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-10 size-96 rounded-full bg-accent-200/40 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                align="left"
                eyebrow="Consultancy"
                title="Talk it through 1-on-1"
                subtitle="Get a real person on a call — targeted feedback, a concrete plan, and written notes you keep afterward."
                className="max-w-xl"
              />
              <Button to="/products?category=consultancy" variant="outline">
                See all calls
              </Button>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {consultancy.map((product) => (
                <ConsultancyCard key={product.id} product={product} />
              ))}
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="relative mt-12 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-brand-700 to-violet-700 px-8 py-10 text-white shadow-xl shadow-brand-700/20 sm:flex sm:items-center sm:justify-between lg:px-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_60%_120%_at_0%_50%,black,transparent)]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-white/15 blur-3xl"
              />
              <div className="relative">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-200">
                  <Sparkles className="size-4" />
                  Still deciding?
                </p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-tight">
                  Not sure which call you need?
                </h3>
                <p className="mt-2 max-w-lg text-sm text-brand-100">
                  Tell us where you&apos;re stuck and we&apos;ll point you to
                  the right session — no booking pressure.
                </p>
              </div>
              <Button
                to="/contact"
                className="relative mt-6 shrink-0 bg-white text-brand-700 hover:bg-gray-100 sm:mt-0 sm:ml-6"
              >
                Ask us first
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* New arrivals */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                align="left"
                eyebrow="New arrivals"
                title="Fresh on the shelf"
                subtitle="The newest guides and referral connections — recently added and already getting people noticed."
                className="max-w-xl"
              />
              <Button to="/products?category=resume" variant="outline">
                Browse new guides
              </Button>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden bg-gray-50">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-20 size-96 rounded-full bg-brand-200/40 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal>
            <SectionHeading
              eyebrow="Testimonials"
              title="Job seekers trust the shelf"
              subtitle="Real stories from people who used these products in real searches."
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.name} testimonial={t} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA — indigo gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-violet-800">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_60%_100%_at_50%_100%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-brand-400/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full bg-accent-400/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Stop guessing. Start sending interviews your way.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-brand-100">
              Every product comes with instant access, lifetime updates, and a
              30-day money-back guarantee.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                to="/products"
                size="lg"
                className="bg-white text-brand-700 shadow-xl shadow-brand-900/30 hover:bg-gray-100"
              >
                Shop the store
                <ArrowRight className="size-5" />
              </Button>
              <Button
                to="/about"
                size="lg"
                className="border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/20"
              >
                Meet the founder
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-brand-100">
              {['Instant download', 'Lifetime updates', '30-day refund'].map(
                (item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="size-4 text-accent-400" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
