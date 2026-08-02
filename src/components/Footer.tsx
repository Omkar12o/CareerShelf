import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { Logo } from './Logo'

const productLinks = [
  { label: 'All products', to: '/products' },
  { label: 'Consultancy calls', to: '/products?category=consultancy' },
  { label: 'Resume guides', to: '/products?category=resume' },
  { label: 'Reference / Referrals', to: '/products?category=referral' },
  { label: 'HR contact lists', to: '/products?category=contacts' },
  { label: 'Interview question sets', to: '/products?category=interview' },
  { label: 'Digital ebooks', to: '/products?category=ebook' },
]

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'My purchases', to: '/dashboard' },
]

const socials = [
  {
    label: 'X (Twitter)',
    href: 'https://x.com',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452z',
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gray-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_50%_60%_at_50%_0%,black,transparent)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo inverted />
            <p className="max-w-xs text-sm leading-relaxed text-gray-400">
              Practical digital products that help job seekers research,
              prepare, and get hired faster.
            </p>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-brand-600 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="size-4.5" fill="currentColor" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
              Products
            </h3>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 transition-colors duration-150 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 transition-colors duration-150 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
              Get in touch
            </h3>
            <a
              href="mailto:hello@careershelf.co"
              className="mt-4 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors duration-150 hover:text-white"
            >
              <Mail className="size-4" />
              hello@careershelf.co
            </a>
            <p className="mt-4 text-sm text-gray-500">
              Replies within 24 hours on weekdays.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CareerShelf. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-end">
            <Link
              to="/privacy"
              className="text-sm text-gray-500 transition-colors duration-150 hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-500 transition-colors duration-150 hover:text-white"
            >
              Terms of Service
            </Link>
            <Link
              to="/refunds"
              className="text-sm text-gray-500 transition-colors duration-150 hover:text-white"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
