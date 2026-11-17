import { Link } from 'react-router-dom'
import { Mail, MessageCircle, ShieldCheck } from 'lucide-react'
import { Logo } from './Logo'

const WHATSAPP_URL =
  'https://wa.me/919209315645?text=' +
  encodeURIComponent("Hi, I'd like to know more about CareerShelf")

const columns: Array<{
  title: string
  links: Array<{ to: string; label: string }>
}> = [
  {
    title: 'Projects',
    links: [
      { to: '/projects', label: 'Browse projects' },
      { to: '/products', label: 'Ready-made store' },
      { to: '/request-project', label: 'Request a project' },
      { to: '/services', label: 'Development services' },
    ],
  },
  {
    title: 'Students',
    links: [
      { to: '/interview-prep', label: 'Interview prep' },
      { to: '/careers', label: 'Careers & referrals' },
      { to: '/projects?year=final-year', label: 'Final-year projects' },
      { to: '/projects?year=passout', label: 'For passouts' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
      { to: '/refunds', label: 'Refund policy' },
      { to: '/privacy', label: 'Privacy policy' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950 text-navy-200">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo inverted />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-300">
              Ready-made project kits, interview preparation, and career support
              for BCA, MCA, BSc CS, and BE/BTech students — from first year to
              first job.
            </p>

            <div className="mt-6 flex flex-col gap-2 text-sm">
              <a
                href="mailto:hello@careershelf.co"
                className="inline-flex items-center gap-2 text-navy-300 transition-colors hover:text-white"
              >
                <Mail className="size-4" />
                hello@careershelf.co
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-navy-300 transition-colors hover:text-white"
              >
                <MessageCircle className="size-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.to + link.label}>
                    <Link
                      to={link.to}
                      className="text-navy-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CareerShelf. All rights reserved.</p>
          <p className="inline-flex items-center gap-2">
            <ShieldCheck className="size-4" />
            Secure UPI checkout · Payments verified by webhook
          </p>
        </div>
      </div>
    </footer>
  )
}
