import { useCallback, useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  CalendarClock,
  Clock,
  FileDown,
  FileText,
  Loader2,
  RefreshCcw,
  ShieldCheck,
  Star,
  Download,
} from 'lucide-react'
import {
  CATEGORY_LABELS,
  formatPrice,
  isBookable,
  productFromRow,
  type Product,
  type ProductRow,
} from '../data/products'
import { supabase } from '../supabaseClient'
import { useAuth } from '../useAuth'
import { useRazorpayCheckout } from '../useRazorpay'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { ProductCard } from '../components/ProductCard'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { ProductIcon, ProductIconBadge } from '../components/ProductIcon'

function ctaLabel(product: Product): string {
  if (product.category === 'consultancy') return 'Book a Call'
  if (product.category === 'referral') return 'Request referral'
  return 'Buy now'
}

function DocumentPreview({ product }: { product: Product }) {
  const bookable = isBookable(product)
  const fileLabel = bookable ? 'LIVE' : 'PDF'

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 bg-gradient-to-r from-brand-600 to-accent-600 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/15 text-white">
              <FileDown className="size-6" strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
                {CATEGORY_LABELS[product.category]}
              </p>
              <p className="truncate text-base font-bold text-white">
                {product.title}
              </p>
            </div>
          </div>
          <span className="rounded-md bg-white px-2.5 py-1 text-[10px] font-bold tracking-widest text-brand-700">
            {fileLabel}
          </span>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
              <FileText className="size-4.5" strokeWidth={1.8} />
            </span>
            <p className="text-xs font-semibold text-gray-900">
              {bookable ? 'Live session preview' : product.downloadType}
            </p>
          </div>
          <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-gray-600">
            {product.description[0]}
          </p>
          <div className="mt-5 flex items-center justify-between rounded-xl bg-accent-50 px-3.5 py-2.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-700">
              <ShieldCheck className="size-4" />
              {bookable
                ? 'Secure booking · Confirmation within 24h'
                : 'Secure · Instant delivery'}
            </span>
            <Check className="size-4 text-accent-600" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product>()
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { status, message, startCheckout } = useRazorpayCheckout()
  const checkoutLoading = status === 'loading'
  const { user, loading: authLoading } = useAuth()
  const [owned, setOwned] = useState(false)
  const [ownershipLoading, setOwnershipLoading] = useState(false)

  const [buyIntent, setBuyIntent] = useState<{
    productId: string
    tier?: string
    price: number
  } | null>(null)

  const handleBuyNow = useCallback(
    async (p: Product) => {
      // While auth is loading, do nothing (button shows spinner via checkoutLoading or authLoading)
      if (authLoading) return

      // Save intent in case we need to redirect to auth
      const intent = {
        productId: p.id,
        tier: undefined,
        price: p.price,
        returnTo: `/products/${p.slug}`,
      }
      sessionStorage.setItem('careershelf_buy_intent', JSON.stringify(intent))
      setBuyIntent(intent)

      if (user) {
        // Logged in: go straight to checkout/payment
        setBuyIntent(null)
        await startCheckout(p)
      } else {
        // Not logged in: save intent and redirect to auth
        navigate(`/auth?redirect=/products/${p.slug}&intent=buy`)
      }
    },
    [user, authLoading, navigate, startCheckout],
  )

  useEffect(() => {
    let cancelled = false

    async function loadProduct() {
      if (!slug) {
        setError(true)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(false)

      const { data, error: queryError } = await supabase
        .from('products')
        .select('*')
        .eq('id', slug)
        .returns<ProductRow>()
        .maybeSingle()

      if (cancelled) return

      if (queryError || !data) {
        setError(true)
        setLoading(false)
        return
      }

      const mapped = productFromRow(data)
      setProduct(mapped)
      setLoading(false)

      const { data: allData } = await supabase
        .from('products')
        .select('*')
        .returns<ProductRow[]>()
        .order('created_at', { ascending: false })

      if (cancelled) return

      setRelated(
        (allData ?? [])
          .map(productFromRow)
          .filter((p) => p.category === mapped.category && p.id !== mapped.id)
          .slice(0, 3),
      )
    }

    void loadProduct()

    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    let cancelled = false

    async function checkOwnership() {
      if (!user || !product) {
        setOwned(false)
        return
      }

      setOwnershipLoading(true)

      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .eq('status', 'paid')
        .maybeSingle()

      if (cancelled) return

      setOwned(Boolean(data))
      setOwnershipLoading(false)
    }

    void checkOwnership()

    return () => {
      cancelled = true
    }
  }, [user, product])

  if (loading) {
    return (
      <div className="mx-auto flex min-h-96 items-center justify-center px-4">
        <span role="status" aria-label="Loading product" className="spinner" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <p className="mt-3 text-gray-500">
          We couldn&apos;t find that product. It may have been renamed or
          removed.
        </p>
        <div className="mt-6">
          <Button to="/products">Back to the store</Button>
        </div>
      </div>
    )
  }

  const pdfUrl = product['pdf-url']

  return (
    <>
      <section className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-white">
              Products
            </Link>
            <span>/</span>
            <span className="truncate text-gray-200">{product.title}</span>
          </nav>
        </div>
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:items-start lg:px-8 lg:pb-24">
          <div className="flex min-h-80 flex-col justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 p-8 shadow-2xl lg:sticky lg:top-24">
            <DocumentPreview product={product} />
            <p className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-white/60">
              <FileDown className="size-4" />
              {product.downloadType} · Updated {product.updatedAt}
            </p>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge color="brand">{CATEGORY_LABELS[product.category]}</Badge>
              {product.badge ? (
                <Badge color={product.badge === 'Bestseller' ? 'emerald' : 'brand'}>
                  {product.badge}
                </Badge>
              ) : null}
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {product.title}
            </h1>
            <p className="mt-2 text-lg font-medium text-brand-200">
              {product.tagline}
            </p>

            <div className="mt-4 flex items-center gap-1.5">
              <Star className="size-4 text-amber-400" fill="currentColor" />
              <span className="font-semibold text-white">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-gray-400">({product.reviewCount} reviews)</span>
              {product.duration ? (
                <>
                  <span className="text-gray-600">·</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-200">
                    <Clock className="size-4" />
                    {product.duration}
                  </span>
                </>
              ) : null}
            </div>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-4xl font-extrabold text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice ? (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="mb-1 rounded-full bg-accent-500/20 px-2.5 py-1 text-xs font-semibold text-accent-100">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              ) : null}
            </div>

            <p className="mt-4 text-base leading-relaxed text-gray-300">
              {product.description[0]}
            </p>

            {owned ? (
              <div className="mt-8">
                <div className="flex flex-col gap-3 sm:flex-row">
                  {pdfUrl ? (
                    <Button
                      href={pdfUrl}
                      size="lg"
                      className="flex-1 sm:flex-none"
                    >
                      <Download className="size-4" />
                      Download now
                    </Button>
                  ) : null}
                  <Button
                    to="/dashboard"
                    variant="outline"
                    size="lg"
                    className="border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10"
                  >
                    Go to My purchases
                  </Button>
                </div>
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent-300">
                  <Check className="size-4" />
                  {pdfUrl
                    ? 'You own this product — download it anytime.'
                    : 'You own this product — manage it from My purchases.'}
                </p>
              </div>
            ) : ownershipLoading ? (
              <div className="mt-8 inline-flex items-center gap-2 text-sm text-gray-400">
                <Loader2 className="size-4 animate-spin" />
                Checking your purchase…
              </div>
            ) : (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="flex-1 sm:flex-none"
                  disabled={checkoutLoading || authLoading}
                  onClick={() => void handleBuyNow(product)}
                >
                  {checkoutLoading || authLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : isBookable(product) ? (
                    <CalendarClock className="size-4" />
                  ) : null}
                  {ctaLabel(product)} — {formatPrice(product.price)}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10"
                  disabled={checkoutLoading || authLoading}
                  onClick={() => void handleBuyNow(product)}
                >
                  {isBookable(product) ? (
                    <Clock className="size-4" />
                  ) : (
                    <Download className="size-4" />
                  )}
                  {isBookable(product) ? 'Check availability' : 'Instant download'}
                </Button>
              </div>
            )}

            {message ? (
              status === 'success' ? (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <p className="inline-flex items-center gap-2 rounded-xl bg-accent-500/15 px-4 py-3 text-sm font-medium text-accent-100">
                    <Check className="size-4" />
                    {message}
                  </p>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm transition-colors hover:bg-gray-100"
                  >
                    Go to My purchases
                  </Link>
                </div>
              ) : (
                <p
                  className={`mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
                    status === 'cancelled'
                      ? 'bg-white/10 text-gray-300'
                      : 'bg-red-500/15 text-red-200'
                  }`}
                >
                  {message}
                </p>
              )
            ) : null}

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-accent-500" />
                30-day money-back guarantee
              </span>
              <span className="inline-flex items-center gap-1.5">
                <RefreshCcw className="size-4 text-accent-500" />
                Free lifetime updates
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <h2 className="text-xl font-bold text-gray-900">What&apos;s inside</h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-600">
                {product.description.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </div>

            <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-900/5 lg:sticky lg:top-24">
              <div className="flex items-center gap-3">
                <ProductIconBadge category={product.category} />
                <div>
                  <p className="font-semibold text-gray-900">{product.title}</p>
                  <p className="text-sm text-gray-500">{product.downloadType}</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {product.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-600">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice ? (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  ) : null}
                </div>
                {owned && pdfUrl ? (
                  <Button className="mt-4 w-full" size="lg" href={pdfUrl}>
                    <Download className="size-4" />
                    Download now
                  </Button>
                ) : owned ? (
                  <Button className="mt-4 w-full" size="lg" to="/dashboard">
                    Go to My purchases
                  </Button>
                ) : (
                  <Button
                    className="mt-4 w-full"
                    size="lg"
                    disabled={checkoutLoading || authLoading}
                    onClick={() => void handleBuyNow(product)}
                  >
                    {checkoutLoading || authLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : null}
                    {ctaLabel(product)} — {formatPrice(product.price)}
                  </Button>
                )}
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <ProductIcon category={product.category} size={14} />
                  {owned
                    ? isBookable(product)
                      ? 'Booked · Manage in My purchases'
                      : 'Owned · Download anytime'
                    : isBookable(product)
                      ? 'Secure booking · Confirmation within 24h'
                      : 'Secure checkout · Instant delivery'}
                </p>
              </div>
            </aside>
          </div>
        </Reveal>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              align="left"
              eyebrow="You might also like"
              title={`More ${CATEGORY_LABELS[product.category].toLowerCase()}`}
            />
            <Reveal delay={120}>
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </Reveal>
            <div className="mt-10">
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                <ArrowLeft className="size-4" />
                Back to all products
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}