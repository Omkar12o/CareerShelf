import { ArrowRight, Star } from 'lucide-react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from './Button'
import { ProductIconBadge } from './ProductIcon'
import { formatPrice, PRODUCTS } from '../data/products'
import { Reveal } from './Reveal'

const heroStats = [
  { value: '8,000+', label: 'Job seekers served' },
  { value: '4.8/5', label: 'Average rating' },
  { value: '30 days', label: 'Money-back guarantee' },
]

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.to('.hero-blob', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 3)

  return (
    <section ref={ref} className="relative overflow-hidden bg-gray-50">
      {/* Background: grid + gradient mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-light [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-20 size-[38rem] rounded-full bg-brand-300/40 blur-3xl hero-blob"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-32 size-[32rem] rounded-full bg-accent-300/30 blur-3xl hero-blob"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-28 lg:pt-32">
        <Reveal>
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-white px-3.5 py-1.5 text-xs font-bold text-brand-700 shadow-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent-500" />
              </span>
              Trusted by 8,000+ job seekers
            </span>

            <h1 className="mt-7 text-4xl font-extrabold leading-[1.04] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Get hired faster with{' '}
              <span className="relative whitespace-nowrap">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-1.5 -z-10 h-5 skew-y-1 rounded-sm bg-brand-200/70 sm:bottom-2 sm:h-6"
                />
                practical
              </span>{' '}
              <span className="text-brand-600">tools</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-600 sm:text-xl">
              Verified HR contact lists, interview question sets, and career
              ebooks — researched, written, and updated by people who have sat
              on both sides of the interview table.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/products" size="lg">
                Browse products
                <ArrowRight className="size-5" />
              </Button>
              <Button to="/about" variant="outline" size="lg">
                Meet the founder
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-gray-200 pt-6">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold tracking-tight text-gray-900">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="relative hidden lg:block">
            <div
              aria-hidden="true"
              className="absolute -inset-10 -z-10 rounded-full bg-gradient-to-br from-brand-200/50 via-transparent to-accent-200/50 blur-2xl"
            />
            <div className="space-y-5">
              {featured.map((product, i) => (
                <div
                  key={product.id}
                  className={`flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-lg shadow-gray-900/5 ${
                    i % 2 === 1 ? 'lg:ml-12' : ''
                  }`}
                >
                  <ProductIconBadge category={product.category} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-gray-900">
                      {product.title}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {product.tagline}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold tracking-tight text-gray-900">
                      {formatPrice(product.price)}
                    </p>
                    {product.originalPrice ? (
                      <p className="text-sm text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </p>
                    ) : null}
                  </div>
                  <span className="hidden shrink-0 items-center gap-1 rounded-full bg-accent-50 px-2.5 py-1 text-xs font-bold text-accent-700 xl:inline-flex">
                    <Star className="size-3" fill="currentColor" />
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
