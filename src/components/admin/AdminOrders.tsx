import { useEffect, useMemo, useState } from 'react'
import { ReceiptText, Search } from 'lucide-react'
import { supabase } from '../../supabaseClient'
import { formatPrice, type OrderRow } from '../../data/products'
import { Button } from '../Button'
import { StatusBadge } from './StatusBadge'
import { formatDateTime } from './utils'

type OrderWithDetails = OrderRow & {
  productTitle?: string
  email?: string
}

type StatusFilter = 'all' | 'paid' | 'pending'

export function AdminOrders() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from('orders').select('*').returns<OrderWithDetails[]>(),
        supabase
          .from('products')
          .select('id, title')
          .returns<{ id: string; title: string }[]>(),
      ])

      if (cancelled) return

      const failed = ordersRes.error ?? productsRes.error
      if (failed) {
        setError(failed.message)
        setLoading(false)
        return
      }

      const titles: Record<string, string> = {}
      for (const product of productsRes.data ?? []) {
        titles[String(product.id)] = product.title
      }

      setOrders(
        (ordersRes.data ?? []).map((order) => ({
          ...order,
          productTitle: titles[String(order.product_id)],
        })),
      )
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return orders
      .filter(
        (order) => statusFilter === 'all' || order.status === statusFilter,
      )
      .filter((order) => {
        if (!normalizedQuery) return true
        return (
          String(order.id).toLowerCase().includes(normalizedQuery) ||
          String(order.user_id).toLowerCase().includes(normalizedQuery) ||
          (order.email ?? '').toLowerCase().includes(normalizedQuery) ||
          (order.productTitle ?? '').toLowerCase().includes(normalizedQuery)
        )
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
  }, [orders, statusFilter, query])

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Orders
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Every order placed on the store. Read-only for now.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-3">
          <select
            aria-label="Filter by status"
            className="input w-auto"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
          >
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            aria-label="Search orders"
            placeholder="Search by order ID, product, user ID…"
            className="input pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="card mt-6 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <span
              role="status"
              aria-label="Loading orders"
              className="spinner"
            />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-sm font-semibold text-gray-900">
              Couldn&apos;t load orders
            </p>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <Button
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-6"
            >
              Try again
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <ReceiptText className="size-7" strokeWidth={1.6} />
            </span>
            <p className="mt-5 text-sm font-semibold text-gray-900">
              No orders yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Orders will appear here once customers make a purchase.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-semibold text-gray-900">
              No matching orders
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try a different filter or search term.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((order) => (
                  <tr key={String(order.id)} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-mono text-xs text-gray-400">
                      #{String(order.id).slice(0, 8)}
                    </td>
                    <td className="max-w-40 truncate px-5 py-4" title={order.user_id}>
                      {order.email ? (
                        <span className="font-medium text-gray-900">
                          {order.email}
                        </span>
                      ) : (
                        <span className="font-mono text-xs text-gray-400">
                          {order.user_id.slice(0, 12)}…
                        </span>
                      )}
                    </td>
                    <td className="max-w-56 truncate px-5 py-4 font-medium text-gray-900">
                      {order.productTitle ?? String(order.product_id)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatPrice(Number(order.amount))}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {formatDateTime(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-400">
        The Customer column shows the Supabase user ID because orders don&apos;t
        store email addresses. If you add an <code>email</code> column to the
        orders table, it will appear here automatically.
      </p>
    </div>
  )
}
