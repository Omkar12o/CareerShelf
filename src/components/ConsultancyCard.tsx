import { ArrowRight, CalendarClock, Clock } from 'lucide-react'
import { formatPrice, type Product } from '../data/products'
import { ProductIconBadge } from './ProductIcon'
import { Badge } from './Badge'
import { Rating } from './Rating'
import { Button } from './Button'

type ConsultancyCardProps = {
  product: Product
}

export function ConsultancyCard({ product }: ConsultancyCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-gray-900/8">
      <div
        aria-hidden="true"
        className="h-1.5 bg-gradient-to-r from-brand-600 via-violet-500 to-accent-500"
      />
      <div className="flex items-start justify-between gap-3 px-6 pt-5">
        <ProductIconBadge category={product.category} />
        {product.badge ? (
          <Badge color={product.badge === 'Bestseller' ? 'emerald' : 'brand'}>
            {product.badge}
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6 pt-4">
        <h3 className="text-lg font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-brand-700">
          {product.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-brand-600">
          {product.tagline}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-inset ring-violet-600/15">
            <Clock className="size-3.5" />
            {product.duration ?? '1-on-1 video call'}
          </span>
          {product.slotsLeft !== undefined ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent-500" />
              </span>
              {product.slotsLeft} slots left this week
            </span>
          ) : null}
        </div>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-500">
          {product.shortDescription}
        </p>

        <div className="mt-4">
          <Rating rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
          <div>
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice ? (
              <span className="ml-2 text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            ) : null}
          </div>
          <Button
            to={`/products/${product.slug}`}
            size="sm"
            className="shrink-0"
          >
            <CalendarClock className="size-4" />
            Book a Call
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </article>
  )
}
