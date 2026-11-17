import { Sparkles } from 'lucide-react'
import type { Product } from '../data/products'
import { ProductCard } from './ProductCard'
import { ConsultancyCard } from './ConsultancyCard'
import { Button } from './Button'

type FeaturedProjectsGridProps = {
  products: Product[]
  title?: string
  subtitle?: string
  emptyMessage?: string
  showBrowseLink?: boolean
}

export function FeaturedProjectsGrid({
  products,
  title = 'Featured projects',
  subtitle = 'The kits students pick most often — chosen for clean code, complete documentation, and easy viva answers.',
  emptyMessage = 'No products to show right now. Check back shortly.',
  showBrowseLink = true,
}: FeaturedProjectsGridProps) {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            <Sparkles className="size-6 text-emerald-500" aria-hidden="true" />
            {title}
          </h2>
          <p className="mt-2 text-base leading-relaxed text-gray-500">
            {subtitle}
          </p>
        </div>
        {showBrowseLink ? (
          <Button to="/products" variant="outline" size="sm">
            Browse all products
          </Button>
        ) : null}
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <p className="text-sm font-medium text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) =>
            product.category === 'consultancy' ? (
              <ConsultancyCard key={product.id} product={product} />
            ) : (
              <ProductCard key={product.id} product={product} />
            ),
          )}
        </div>
      )}
    </div>
  )
}
