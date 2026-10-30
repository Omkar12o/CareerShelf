import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { WhatsAppButton } from './WhatsAppButton'

export function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[calc(16.666%)] top-0 hidden h-full w-px bg-accent-500/60 lg:block"
      />
      <div className="bg-brand-900 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-gray-50">
        Free shipping on orders over $50
      </div>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
