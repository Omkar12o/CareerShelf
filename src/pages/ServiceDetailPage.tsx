import { useCallback, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductBySlug, formatPrice } from '../data/products'
import { RequirementForm } from '../components/RequirementForm'
import { CheckoutFlow } from '../components/checkout'
import { useAuth } from '../useAuth'
import { useRazorpayCheckout } from '../useRazorpay'
import { Button } from '../components/Button'

export function ServiceDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const product = slug ? getProductBySlug(slug) : undefined
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { user, loading: authLoading } = useAuth()
  const { status, message, startCheckout } = useRazorpayCheckout()
  const checkoutLoading = status === 'loading'

  const [buyIntent, setBuyIntent] = useState<{
    productId: string
    tier?: string
    price: number
  } | null>(null)

  const handleBuyNow = useCallback(
    async (p: { id: string; slug: string; title: string; price: number }) => {
      if (authLoading) return

      const intent = {
        productId: p.id,
        tier: undefined,
        price: p.price,
        returnTo: `/services/${p.slug}`,
      }
      sessionStorage.setItem('careershelf_buy_intent', JSON.stringify(intent))
      setBuyIntent(intent)

      if (user) {
        setBuyIntent(null)
        await startCheckout(p as any)
      } else {
        navigate(`/auth?redirect=/services/${p.slug}&intent=buy`)
      }
    },
    [user, authLoading, navigate, startCheckout],
  )

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F6F3ED] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-[#141414]">Service not found.</h1>
        </div>
      </div>
    )
  }

  const docs = product.documentation ?? ['SRS', 'ER diagram', 'API docs', 'Setup guide', 'User manual', 'PPT']

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3ED] text-[#141414] antialiased selection:bg-[#141414] selection:text-[#F6F3ED]">
      <header className="w-full bg-[#F6F3ED] border-b border-[#E3DDD4] sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a className="flex items-center gap-2.5 group" href="/">
            <div className="w-7 h-7 bg-[#141414] text-[#F6F3ED] flex items-center justify-center rounded-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                <line x1="8" x2="16" y1="6" y2="6"></line>
                <line x1="8" x2="14" y1="10" y2="10"></line>
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-[#141414]">CareerShelf</span>
          </a>
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2 text-sm font-medium text-[#4A4742]">
            <a className="px-3.5 py-1.5 hover:text-black transition-colors rounded-sm" href="/products">Products</a>
            <a className="px-3.5 py-1.5 bg-[#141414] text-[#F6F3ED] rounded-sm font-semibold transition-colors" href="/services">Services</a>
            <a className="px-3.5 py-1.5 hover:text-black transition-colors rounded-sm" href="/about">About</a>
            <a className="px-3.5 py-1.5 hover:text-black transition-colors rounded-sm" href="/contact">Contact</a>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <a className="text-[#4A4742] hover:text-[#141414] font-medium px-2 py-1" href="/auth">Sign in</a>
            <a className="bg-[#141414] text-[#F6F3ED] hover:bg-[#2C2B29] font-medium px-3.5 py-1.5 rounded-sm transition-colors text-xs tracking-tight" href="/dashboard">My purchases</a>
          </div>
        </div>
      </header>

      <div className="border-b border-[#E3DDD4] bg-[#F6F3ED]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider bg-[#EDE8E0] text-[#403D37] border border-[#DDD5C7] rounded">{product.serviceType || product.category}</span>
              {product.deliveryTime && <span className="inline-flex items-center text-xs text-[#6E6B65]">Delivery: {product.deliveryTime}</span>}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#141414] font-medium tracking-tight">{product.title}</h1>
            <p className="text-sm text-[#504C46] mt-1 font-serif">{product.tagline}</p>
          </div>
          <div className="flex items-baseline gap-3 shrink-0 bg-white border border-[#E3DDD4] px-4 py-2.5 rounded shadow-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#736E66] block">Fixed Base Price</span>
              <span className="text-2xl font-bold tracking-tight text-[#141414]">{product.price === 0 ? 'Quote' : formatPrice(product.price)}</span>
            </div>
            <span className="text-xs text-[#736E66] font-medium border-l border-[#E3DDD4] pl-3">{product.pricingNote || (product.price === 0 ? 'Contact for quote' : `Starting from ${formatPrice(product.price)}`)}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <section className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[#E3DDD4] rounded-sm p-6 shadow-xs space-y-6">
              <div className="border-b border-[#F0EAE1] pb-4 flex items-center justify-between">
                <h2 className="font-serif text-xl text-[#141414] flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#736E66]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  Project Specifications
                </h2>
                <span className="inline-block px-2.5 py-0.5 bg-[#F4EFE6] border border-[#E3DDD4] text-[#423E37] text-[11px] font-medium rounded-sm">
                  Documentation included
                </span>
              </div>

              {product.features && (
                <div>
                  <h3 className="font-serif text-base text-[#141414] mb-3 font-semibold">Features</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#3E3A34]">
                    {product.features.map((f) => (
                      <li key={f} className="p-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded flex items-center gap-2 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#141414] shrink-0"></span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.techStack && (
                <div>
                  <h3 className="font-serif text-base text-[#141414] mb-2.5 font-semibold">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {product.techStack.map((t) => (
                      <span key={t} className="px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD5C7] rounded text-[#2E2C28] font-mono font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.deliverables && (
                <div>
                  <h3 className="font-serif text-base text-[#141414] mb-3 font-semibold">Deliverables</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {product.deliverables.map((d) => (
                      <div key={d} className="p-3 rounded border border-[#E3DDD4] bg-[#FAF8F5] flex flex-col items-start justify-center gap-1">
                        <svg className="w-4 h-4 text-[#141414] stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span className="text-xs font-semibold text-[#141414]">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900">Sample Documentation</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {docs.map((d) => (
                    <li key={d} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {product.faq && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-900">FAQ</h2>
                  <div className="mt-3 divide-y divide-gray-200">
                    {product.faq.map((item, i) => (
                      <div key={i} className="py-3">
                        <button
                          className="flex w-full items-center justify-between text-left font-semibold text-gray-900"
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        >
                          {item.q}
                          <span>{openFaq === i ? '−' : '+'}</span>
                        </button>
                        {openFaq === i && <p className="mt-2 text-sm text-gray-600">{item.a}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Right column: Checkout flow */}
          <div className="lg:col-span-5">
            <CheckoutFlow
              product={product}
              amount={product.price}
              upiId="9146601241@axl"
              onPaid={(txnId) => {
                console.log('Payment completed:', txnId)
              }}
            />
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E3DDD4] bg-white p-3 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-[#141414]">
            {product.price === 0 ? 'Quote' : formatPrice(product.price)}
          </span>
          <div className="flex gap-2">
            <button
              disabled={authLoading || !user}
              onClick={() => {
                if (authLoading) return
                const intent = {
                  productId: product.id,
                  tier: undefined,
                  price: product.price,
                  returnTo: `/services/${product.slug}`,
                }
                sessionStorage.setItem('careershelf_buy_intent', JSON.stringify(intent))
                if (user) {
                  void startCheckout(product as any)
                } else {
                  navigate(`/auth?redirect=/services/${product.slug}&intent=buy`)
                }
              }}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-150 ${
                user && !authLoading
                  ? 'bg-[#141414] text-white hover:bg-[#2C2B29] shadow-sm'
                  : 'bg-[#F4EFE6] text-[#736E66] border border-[#DDD5C7] cursor-not-allowed'
              }`}
            >
              {authLoading ? 'Loading…' : user ? 'Buy Now' : 'Sign in to buy'}
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="rounded-xl border border-[#D8D1C5] px-4 py-2.5 text-sm font-semibold text-[#141414] hover:bg-[#F6F3ED] transition-colors"
            >
              Enquire
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}