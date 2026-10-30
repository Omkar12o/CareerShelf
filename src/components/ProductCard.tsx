import { ArrowRight, Clock, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  CATEGORY_LABELS,
  formatPrice,
  type Product,
} from '../data/products'
import { ProductIconBadge } from './ProductIcon'
import { Badge } from './Badge'
import { Rating } from './Rating'
import { Button } from './Button'
import { useRazorpayCheckout } from '../useRazorpay'

type ProductCardProps = {
  product: Product
}

const badgeColor: Record<string, 'emerald' | 'brand' | 'amber' | 'gray'> = {
  Bestseller: 'emerald',
  New: 'brand',
  Trending: 'amber',
}

export function ProductCard({ product }: ProductCardProps) {
  const { status, message, startCheckout } = useRazorpayCheckout()
  const loading = status === 'loading'

  const messageTone =
    status === 'success'
      ? 'text-emerald-600'
      : status === 'error'
        ? 'text-red-600'
        : 'text-amber-600'

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-gray-900/8 [transform-style:preserve-3d] hover:[transform:perspective(1000px)_rotateX(2deg)_rotateY(-2deg)_translateY(-4px)]">
      <div
        aria-hidden="true"
        className="h-1 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500"
      />

      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <ProductIconBadge category={product.category} />
        {product.badge ? (
          <Badge color={badgeColor[product.badge] ?? 'gray'} className="relative">
            {product.badge}
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
          {CATEGORY_LABELS[product.category]}
        </p>
        <h3 className="mt-1.5 text-base font-bold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-brand-700">
          {product.title}
        </h3>
        <p className="mt-1 text-sm font-semibold text-brand-600">
          {product.tagline}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
          {product.shortDescription}
        </p>

        <div className="mt-4">
          <Rating rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        <div className="mt-5 border-t border-gray-100 pt-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice ? (
                <span className="mt-0.5 block text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              ) : null}
            </div>
            <Button
              size="sm"
              onClick={() => void startCheckout(product)}
              disabled={loading}
              className="shrink-0"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Buy now
            </Button>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Link
              to={`/products/${product.slug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              View details
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            {product.duration ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
                <Clock className="size-3.5" />
                {product.duration}
              </span>
            ) : null}
          </div>
          {message ? (
            <p className={`mt-2 text-xs font-medium ${messageTone}`}>
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}
