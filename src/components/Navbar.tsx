import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo'
import { Button } from './Button'
import { useAuth } from '../useAuth'

const primaryLinks = [
  { to: '/projects', label: 'Projects' },
  { to: '/products', label: 'Store' },
  { to: '/interview-prep', label: 'Interview Prep' },
  { to: '/careers', label: 'Careers' },
  { to: '/services', label: 'Services' },
]

const yearLinks = [
  { year: '1st-year', label: '1st Year' },
  { year: '2nd-year', label: '2nd Year' },
  { year: '3rd-year', label: '3rd Year' },
  { year: 'final-year', label: 'Final Year' },
  { year: 'passout', label: 'Passout' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const activeYear = new URLSearchParams(location.search).get('year')

  const handleSignOut = () => {
    void signOut().then(() => navigate('/'))
  }

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-lg">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <Logo />

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-semibold text-gray-600 transition-colors hover:text-indigo-600"
                >
                  My purchases
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="text-sm font-semibold text-gray-600 transition-colors hover:text-indigo-600"
              >
                Sign in
              </Link>
            )}
            <Button to="/request-project" size="sm">
              Request a project
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-xl text-gray-700 transition-colors hover:bg-gray-100 lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <div className="hidden items-center gap-2 overflow-x-auto border-t border-gray-100 py-2 lg:flex">
          <span className="mr-1 shrink-0 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            By year
          </span>
          {yearLinks.map((link) => {
            const isActive = activeYear === link.year
            return (
              <Link
                key={link.year}
                to={`/projects?year=${link.year}`}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-150 ${
                  isActive
                    ? 'bg-navy-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-border bg-white lg:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col gap-1 py-4">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="mt-3 border-t border-gray-100 pt-3">
              <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                By year
              </p>
              <div className="flex flex-wrap gap-2 px-4">
                {yearLinks.map((link) => (
                  <Link
                    key={link.year}
                    to={`/projects?year=${link.year}`}
                    className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 px-4">
              <Button to="/request-project" size="md">
                Request a project
              </Button>
              {user ? (
                <>
                  <Button to="/dashboard" variant="outline" size="md">
                    My purchases
                  </Button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Button to="/auth" variant="outline" size="md">
                  Sign in
                </Button>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
