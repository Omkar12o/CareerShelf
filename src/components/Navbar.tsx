import { useEffect, useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { NavLink, useLocation, Link } from 'react-router-dom'
import { Logo } from './Logo'
import { Button } from './Button'
import { useAuth } from '../useAuth'

const navLinks = [
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const { user, signOut, session } = useAuth()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const displayName =
    String(user?.user_metadata?.full_name ?? '').trim() ||
    user?.email?.split('@')[0] ||
    'My Account'

  return (
    <header
      className={`sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md transition-shadow duration-150 ${
        scrolled ? 'shadow-sm shadow-gray-900/5' : ''
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo inverted={scrolled} />

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors duration-150 ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-600"
                aria-label="User menu"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <span className="truncate max-w-[140px]">{displayName}</span>
                <ChevronDown className="size-3.5" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-1 shadow-lg shadow-gray-900/10 z-50">
                  <NavLink
                    to="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My purchases
                  </NavLink>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      void signOut()
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button to="/auth" variant="ghost" size="sm">
                Sign in
              </Button>
              <Button to="/dashboard" size="sm">
                My purchases
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-gray-200 bg-white px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </NavLink>
              ))}
          </div>
          <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
            {user ? (
              <>
                <p className="px-1 text-sm font-medium text-gray-700">{displayName}</p>
                <NavLink
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  My purchases
                </NavLink>
                <button
                  onClick={() => {
                    setOpen(false)
                    void signOut()
                  }}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Button
                  to="/auth"
                  variant="outline"
                  size="md"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Button>
                <Button
                  to="/dashboard"
                  variant="primary"
                  size="md"
                  onClick={() => setOpen(false)}
                >
                  My purchases
                </Button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}