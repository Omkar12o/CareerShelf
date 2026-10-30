import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  LogOut,
  Package,
  ReceiptText,
  ShieldCheck,
  Wrench,
} from 'lucide-react'
import { useAuth } from '../../useAuth'
import { isAdminEmail } from '../../admin'
import { Logo } from '../Logo'
import { Button } from '../Button'
import { ToastProvider } from './toast'
import { ScrollToTop } from '../ScrollToTop'

type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  end: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package, end: false },
  { to: '/admin/services', label: 'Services', icon: Wrench, end: false },
  { to: '/admin/orders', label: 'Orders', icon: ReceiptText, end: false },
]

function navClasses(isActive: boolean, mobile: boolean): string {
  const base = mobile
    ? 'inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors duration-150'
    : 'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors duration-150'
  return `${base} ${
    isActive
      ? 'bg-brand-600 text-white shadow-sm'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`
}

export function AdminLayout() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (!user || !isAdminEmail(user.email)) {
      navigate('/', { replace: true })
    }
  }, [loading, user, navigate])

  if (loading || !user || !isAdminEmail(user.email)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <span role="status" aria-label="Checking access" className="spinner" />
      </div>
    )
  }

  const handleSignOut = () => {
    void signOut().then(() => navigate('/'))
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-gray-50 lg:flex-row">
        {/* Mobile header */}
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <Logo />
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-gray-100 px-3 py-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => navClasses(isActive, true)}
              >
                <item.icon className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
          <div className="flex h-16 items-center border-b border-gray-100 px-6">
            <Logo />
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => navClasses(isActive, false)}
              >
                <item.icon className="size-4.5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center gap-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <ShieldCheck className="size-4.5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-gray-900">
                  {user.email}
                </p>
                <p className="text-xs text-gray-400">Owner · Admin</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <ScrollToTop />
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </ToastProvider>
  )
}
