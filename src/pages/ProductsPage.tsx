import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PackageSearch, Store } from 'lucide-react'
import {
  CATEGORY_LABELS,
  normalizeCategory,
  productFromRow,
  type Product,
  type ProductCategory,
  type ProductRow,
} from '../data/products'
import { supabase } from '../supabaseClient'
import { ProductCard } from '../components/ProductCard'
import { ConsultancyCard } from '../components/ConsultancyCard'
import { SectionHeading } from '../components/SectionHeading'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'

const categories: Array<{ key: ProductCategory | 'all'; label: string }> = [
  { key: 'all', label: 'All products' },
  { key: 'contacts', label: CATEGORY_LABELS.contacts },
  { key: 'interview', label: CATEGORY_LABELS.interview },
  { key: 'ebook', label: CATEGORY_LABELS.ebook },
  { key: 'cheatsheet', label: CATEGORY_LABELS.cheatsheet },
  { key: 'consultancy', label: CATEGORY_LABELS.consultancy },
  { key: 'resume', label: CATEGORY_LABELS.resume },
  { key: 'referral', label: CATEGORY_LABELS.referral },
]

const categoryDescription: Record<string, string> = {
  all: 'Every ebook, contact list, question set, guide, call, and referral in one place.',
  contacts:
    'Verified HR and TA contacts at thousands of companies — with outreach guides included.',
  interview:
    'Structured question banks with frameworks, worked answers, and prep plans.',
  ebook: 'Focused career ebooks with templates and before/after examples.',
  cheatsheet:
    'One-page quick-reference sheets for resumes, interviews, SQL, and stats.',
  consultancy:
    '1-on-1 career calls — strategy sprints, deep resume reviews, and mock interviews.',
  resume:
    'Downloadable resume templates and guides that pass ATS scans and impress hiring managers.',
  referral:
    'Paid referral connections and warm introductions to hiring managers and product leaders.',
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const active = normalizeCategory(searchParams.get('category'))

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<ProductRow[]>()

      if (cancelled) return

      if (queryError) {
        setError(queryError.message)
        setLoading(false)
        return
      }

      setProducts((data ?? []).map(productFromRow))
      setLoading(false)
    }

    void loadProducts()

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const filtered =
    active === 'all' ? products : products.filter((p) => p.category === active)

  return (
    <>
      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-light [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-20 size-[30rem] rounded-full bg-brand-200/50 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Products"
              title="The store"
              subtitle={categoryDescription[active]}
            />
          </Reveal>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => {
              const isActive = active === category.key
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() =>
                    setSearchParams(
                      category.key === 'all'
                        ? {}
                        : { category: category.key },
                    )
                  }
                  aria-pressed={isActive}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-md shadow-gray-900/20'
                      : 'bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {category.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <span
              role="status"
              aria-label="Loading products"
              className="spinner"
            />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-base font-semibold text-gray-900">
              Couldn&apos;t load products
            </p>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <Button
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-6"
            >
              Try again
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Store className="size-7" strokeWidth={1.6} />
            </span>
            <h2 className="mt-5 text-lg font-bold text-gray-900">
              No products yet
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
              New products are added regularly. Check back soon, or browse the
              full store from the tabs above.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <PackageSearch className="size-7" strokeWidth={1.6} />
            </span>
            <h2 className="mt-5 text-lg font-bold text-gray-900">
              Nothing in{' '}
              {active === 'all'
                ? 'this category'
                : CATEGORY_LABELS[active as ProductCategory].toLowerCase()}{' '}
              yet
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
              We&apos;re still filling this section out. Try another category,
              or browse everything we have.
            </p>
            <div className="mt-6">
              <Button to="/products" variant="outline">
                Browse all products
              </Button>
            </div>
          </div>
        ) : (
          <Reveal>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) =>
                product.category === 'consultancy' ? (
                  <ConsultancyCard key={product.id} product={product} />
                ) : (
                  <ProductCard key={product.id} product={product} />
                ),
              )}
            </div>
          </Reveal>
        )}
      </div>
    </>
  )
}
