import { useNavigate } from 'react-router-dom'
import { useYoupiCheckout } from '../../useYoupi'
import { useAuth } from '../../useAuth'
import { QrCode, Smartphone, CheckCircle2, Clock, AlertCircle, Loader2, ShieldCheck } from 'lucide-react'
import type { Product } from '../../data/products'

export interface CheckoutFlowProps {
  product: Product
  amount: number
  onPaid?: (txnId: string) => void
}

export function CheckoutFlow({ product, amount, onPaid }: CheckoutFlowProps) {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { status, message, startCheckout, reset } = useYoupiCheckout()

  const productPrice = amount > 0 ? amount : product.price
  const busy = status === 'loading' || status === 'waiting'

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin mb-3" />
        <p className="text-sm text-[#736E66]">Loading your session…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white border border-[#E3DDD4] rounded-xl p-8 shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-[#F4EFE6] flex items-center justify-center mx-auto mb-4">
          <QrCode className="w-6 h-6 text-[#141414]" />
        </div>
        <h3 className="text-lg font-bold text-[#141414] mb-2">Sign in to complete your purchase</h3>
        <p className="text-sm text-[#736E66] mb-6">You need to be logged in to pay for this product.</p>
        <button
          onClick={() => navigate(`/auth?redirect=/services/${product.slug}&intent=buy`)}
          className="w-full rounded-lg bg-[#141414] text-[#F6F3ED] py-3 px-4 text-sm font-bold hover:bg-[#2C2B29] transition-colors"
        >
          Sign in &amp; Continue
        </button>
      </div>
    )
  }

  return (
    <section className="space-y-6">
      {/* Order summary */}
      <div className="bg-white border border-[#E3DDD4] rounded-xl p-6 shadow-sm">
        <div className="text-[10px] uppercase font-semibold tracking-wider text-[#736E68] mb-2">
          Order summary
        </div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-bold text-[#141414]">{product.title}</h3>
          <span className="text-sm font-bold text-[#141414] whitespace-nowrap">
            ₹{productPrice.toLocaleString()}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-[#736E66]">{product.serviceType || product.category}</p>

        <div className="pt-4 mt-4 border-t border-[#F0EAE1] flex items-baseline justify-between">
          <span className="text-xs font-bold tracking-wider text-[#141414] uppercase">Total</span>
          <span className="text-2xl font-bold text-[#141414]">₹{productPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Pay with UPI via Youpi */}
      <div className="bg-white border border-[#E3DDD4] rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#141414] mb-1">Pay with UPI</h3>
        <p className="text-[11px] text-[#736E66] mb-4">
          GPay · PhonePe · Paytm · any UPI app
        </p>

        <div className="rounded-lg bg-[#F4EFE6] border border-[#E3DDD4] p-3 mb-4">
          <p className="text-[11px] text-[#736E66]">
            A secure single-use UPI QR and UPI ID are shown in the Youpi checkout window.
            Pay from any UPI app and keep this page open while we confirm with the bank.
          </p>
        </div>

        <button
          onClick={() => {
            void startCheckout(product)
          }}
          disabled={busy}
          className={`w-full rounded-lg py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            busy
              ? 'bg-[#F4EFE6] text-[#736E66] border border-[#DDD5C7] cursor-not-allowed'
              : 'bg-[#141414] text-[#F6F3ED] hover:bg-[#2C2B29]'
          }`}
        >
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {status === 'waiting' ? 'Verifying payment…' : 'Opening checkout…'}
            </>
          ) : (
            <>
              <Smartphone className="w-4 h-4" />
              Pay ₹{productPrice.toLocaleString()} securely
            </>
          )}
        </button>

        <p className="mt-4 flex items-start gap-1.5 text-[10px] text-[#736E66]">
          <ShieldCheck className="w-3 h-3 mt-0.5 shrink-0" />
          <span>
            Verified against your bank&apos;s UPI confirmation. Your purchase unlocks automatically
            once the payment is confirmed.
          </span>
        </p>
      </div>

      {/* Status */}
      {status === 'waiting' && (
        <div className="bg-white border border-[#E3DDD4] rounded-xl p-5 shadow-sm flex items-start gap-3">
          <Clock className="w-4 h-4 mt-0.5 text-[#736E66]" />
          <div>
            <p className="text-sm font-semibold text-[#141414]">Waiting for bank confirmation</p>
            <p className="text-[11px] text-[#736E66] mt-1">
              {message || 'This usually takes a few seconds. Keep this page open.'}
            </p>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="bg-white border border-[#E3DDD4] rounded-xl p-6 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6 text-[#15803d]" />
          </div>
          <h3 className="text-lg font-bold text-[#141414] mb-2">Payment verified!</h3>
          <p className="text-sm text-[#736E66] mb-4">{message}</p>
          <button
            onClick={() => {
              onPaid?.('')
              navigate('/dashboard')
            }}
            className="w-full rounded-lg bg-[#141414] text-[#F6F3ED] py-3 px-4 text-sm font-bold hover:bg-[#2C2B29] transition-colors"
          >
            Go to My purchases
          </button>
        </div>
      )}

      {(status === 'error' || status === 'cancelled') && (
        <div className="bg-white border border-[#E3DDD4] rounded-xl p-6 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-[#942B2B]" />
          </div>
          <h3 className="text-lg font-bold text-[#141414] mb-2">
            {status === 'cancelled' ? 'Payment cancelled' : 'Payment failed'}
          </h3>
          <p className="text-sm text-[#736E66] mb-4">{message || 'Please try again.'}</p>
          <button
            onClick={reset}
            className="w-full rounded-lg bg-[#141414] text-[#F6F3ED] py-3 px-4 text-sm font-bold hover:bg-[#2C2B29] transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-2 w-full rounded-lg border border-[#DDD5C7] bg-white py-2.5 px-4 text-xs font-semibold text-[#4A4742] hover:bg-[#F9F7F2] transition-colors"
          >
            Check My purchases
          </button>
        </div>
      )}
    </section>
  )
}
