import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { IndianRupee, Package, ReceiptText, Users } from 'lucide-react'
import { supabase } from '../../supabaseClient'
import { formatPrice, type OrderRow } from '../../data/products'
import { Button } from '../Button'
import { StatusBadge } from './StatusBadge'
import { formatDateTime } from './utils'

type Stats = {
  products: number
  orders: number
  revenue: number
  users: number
}

type RecentOrder = OrderRow & { productTitle?: string }

type StatsCardProps = {
  label: string
  value: string
  hint?: string
  icon: LucideIcon
  tint: string
}

function StatsCard({ label, value, hint, icon: Icon, tint }: StatsCardProps) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span
        className={`grid size-12 shrink-0 place-items-center rounded-xl ${tint}`}
      >
        <Icon className="size-6" strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="truncate text-2xl font-bold tracking-tight text-gray-900">
          {value}
        </p>
        {hint ? <p className="text-xs text-gray-400">{hint}</p> : null}
      </div>
    </div>
  )
}

export function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const [productsRes, ordersRes, titlesRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('*').returns<OrderRow[]>(),
        supabase
          .from('products')
          .select('id, title')
          .returns<{ id: string; title: string }[]>(),
      ])

      if (cancelled) return

      const failed = productsRes.error ?? ordersRes.error ?? titlesRes.error
      if (failed) {
        setError(failed.message)
        setLoading(false)
        return
      }

      const orders = ordersRes.data ?? []
      const paidTotal = orders
        .filter((order) => order.status === 'paid')
        .reduce((sum, order) => sum + (Number(order.amount) || 0), 0)
      const uniqueUsers = new Set(orders.map((order) => order.user_id)).size

      const titles: Record<string, string> = {}
      for (const product of titlesRes.data ?? []) {
        titles[String(product.id)] = product.title
      }

      setStats({
        products: productsRes.count ?? productsRes.data?.length ?? 0,
        orders: orders.length,
        revenue: paidTotal,
        users: uniqueUsers,
      })

      setRecent(
        orders
          .slice()
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 5)
          .map((order) => ({
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span role="status" aria-label="Loading overview" className="spinner" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-semibold text-gray-900">
          Couldn&apos;t load the overview
        </p>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <Button
          onClick={() => setReloadKey((key) => key + 1)}
          className="mt-6"
        >
          Try again
        </Button>
      </div>
    )
  }

  const cards: StatsCardProps[] = [
    {
      label: 'Total products',
      value: String(stats.products),
      icon: Package,
      tint: 'bg-brand-50 text-brand-600',
    },
    {
      label: 'Total orders',
      value: String(stats.orders),
      icon: ReceiptText,
      tint: 'bg-sky-50 text-sky-600',
    },
    {
      label: 'Total revenue',
      value: formatPrice(stats.revenue),
      hint: 'Paid orders only',
      icon: IndianRupee,
      tint: 'bg-accent-100 text-accent-700',
    },
    {
      label: 'Total users',
      value: String(stats.users),
      hint: 'Distinct buyers',
      icon: Users,
      tint: 'bg-amber-50 text-amber-600',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Overview
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        A quick look at your store&apos;s health.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatsCard key={card.label} {...card} />
        ))}
      </div>

      <h2 className="mt-8 text-lg font-semibold text-gray-900">
        Recent orders
      </h2>
      <div className="card mt-4 overflow-hidden">
        {recent.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-gray-500">
            No orders yet. Orders will appear here as customers purchase
            products.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recent.map((order) => (
                  <tr key={String(order.id)} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-400">
                      #{String(order.id).slice(0, 8)}
                    </td>
                    <td className="max-w-56 truncate px-5 py-3.5 font-medium text-gray-900">
                      {order.productTitle ?? String(order.product_id)}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">
                      {formatPrice(Number(order.amount))}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {formatDateTime(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
