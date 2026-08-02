import { useEffect, useState } from 'react'
import {
  Download,
  FolderOpen,
  RefreshCcw,
  ShoppingBag,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  productFromRow,
  type OrderRow,
  type Product,
  type ProductRow,
} from '../data/products'
import { supabase } from '../supabaseClient'
import { useAuth } from '../useAuth'
import { Button } from '../components/Button'
import { ProductIconBadge } from '../components/ProductIcon'
import { ProfileSection } from '../components/ProfileSection'

function formatPurchaseDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Recently'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [productsById, setProductsById] = useState<Record<string, Product>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true })
    }
  }, [authLoading, user, navigate])

  useEffect(() => {
    if (!user) return
    const userId = user.id
    let cancelled = false

    async function loadLibrary() {
      setLoading(true)
      setError(null)

      const [ordersResult, productsResult] = await Promise.all([
        supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'paid')
          .returns<OrderRow[]>(),
        supabase.from('products').select('*').returns<ProductRow[]>(),
      ])

      if (cancelled) return

      if (ordersResult.error || productsResult.error) {
        setError(
          (ordersResult.error ?? productsResult.error)?.message ??
            'Could not load your purchases.',
        )
        setLoading(false)
        return
      }

      setOrders(ordersResult.data ?? [])
      const map: Record<string, Product> = {}
      for (const row of productsResult.data ?? []) {
        map[String(row.id)] = productFromRow(row)
      }
      setProductsById(map)
      setLoading(false)
    }

    void loadLibrary()

    return () => {
      cancelled = true
    }
  }, [user, reloadKey])

  if (authLoading || !user) {
    return null
  }

  const purchases = orders
    .flatMap((order) => {
      const product = productsById[String(order.product_id)]
      return product ? [{ order, product }] : []
    })
    .sort(
      (a, b) =>
        new Date(b.order.created_at).getTime() -
        new Date(a.order.created_at).getTime(),
    )

  const fullName = String(user.user_metadata?.full_name ?? '').trim()
  const avatarUrl = String(user.user_metadata?.avatar_url ?? '')
  const displayName = fullName || user.email || 'My Account'
  const initials = (
    fullName
      ? fullName
          .split(' ')
          .map((part) => part[0])
          .join('')
      : (user.email ?? 'My Account').slice(0, 2)
  )
    .toUpperCase()
    .slice(0, 2)
  const memberSince = new Date(user.created_at).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            My purchases
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Your library of products. Downloads never expire.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <ProfileSection />
      </div>

      {loading ? (
        <div className="mt-10 flex items-center justify-center py-24">
          <span
            role="status"
            aria-label="Loading purchases"
            className="spinner"
          />
        </div>
      ) : error ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
          <p className="text-base font-semibold text-gray-900">
            Couldn&apos;t load your purchases
          </p>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <Button
            onClick={() => setReloadKey((key) => key + 1)}
            className="mt-6"
          >
            Try again
          </Button>
        </div>
      ) : purchases.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <FolderOpen className="size-7" strokeWidth={1.6} />
          </span>
          <h2 className="mt-5 text-lg font-bold text-gray-900">
            You don&apos;t have any purchases yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
            Once you buy a product, it will show up here with instant download
            access and free lifetime updates.
          </p>
          <div className="mt-6">
            <Button to="/products" size="lg">
              <ShoppingBag className="size-4" />
              Browse the store
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.8fr_1fr]">
          <div className="space-y-4">
            {purchases.map(({ order, product }) => (
              <div
                key={String(order.id)}
                className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md hover:shadow-gray-900/5 sm:flex-row sm:items-center"
              >
                <ProductIconBadge category={product.category} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900">
                    {product.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Purchased {formatPurchaseDate(order.created_at)} · Order{' '}
                    #{String(order.id)}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                    <RefreshCcw className="size-3.5" />
                    Free updates included
                  </p>
                </div>
                {product['pdf-url'] ? (
                  <a
                    href={product['pdf-url']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition-all duration-150 hover:bg-brand-100 active:scale-[0.98]"
                  >
                    <Download className="size-4" />
                    Download PDF
                  </a>
                ) : (
                  <Button
                    to={`/products/${product.slug}`}
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                  >
                    View product
                  </Button>
                )}
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-900/5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              Account
            </h2>
            <div className="mt-4 flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className="size-10 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <span className="grid size-10 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                  {initials}
                </span>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {displayName}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <dl className="mt-6 space-y-3 border-t border-gray-100 pt-5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Total purchases</dt>
                <dd className="font-semibold text-gray-900">
                  {purchases.length}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Member since</dt>
                <dd className="font-semibold text-gray-900">{memberSince}</dd>
              </div>
            </dl>
            <p className="mt-6 rounded-xl bg-accent-50 px-4 py-3 text-xs leading-relaxed text-accent-700">
              All purchases include free lifetime updates. Check this page for
              the latest version of each product.
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}
