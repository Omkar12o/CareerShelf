import { Quote, Star } from 'lucide-react'

export type Testimonial = {
  name: string
  role: string
  initials: string
  quote: string
  rating: number
}

type TestimonialCardProps = {
  testimonial: Testimonial
  className?: string
}

export function TestimonialCard({
  testimonial,
  className = '',
}: TestimonialCardProps) {
  const { name, role, initials, quote, rating } = testimonial
  return (
    <figure
      className={`flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${className}`}
    >
      <Quote className="size-5 text-brand-200" fill="currentColor" />
      <blockquote className="mt-4 flex-1 text-base leading-relaxed text-gray-700">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white">
            {initials}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
        <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: rating }).map((_, i) => (
            <Star
              key={i}
              className="size-4 text-amber-400"
              fill="currentColor"
            />
          ))}
        </div>
      </figcaption>
    </figure>
  )
}
