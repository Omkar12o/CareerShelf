import { useState, useEffect, useCallback } from 'react'
import { useRazorpayCheckout } from '../../useRazorpay'
import { useAuth } from '../../useAuth'
import { supabase } from '../../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Copy, QrCode, Smartphone, CheckCircle2, Clock, AlertCircle, Loader2, Upload } from 'lucide-react'
import type { Product } from '../../data/products'

export interface CheckoutFlowProps {
  product: Product
  amount: number
  upiId?: string
  qrImageUrl?: string
  onPaid?: (txnId: string) => void
}

export function CheckoutFlow({ product, amount, upiId = '9146601241@axl', qrImageUrl, onPaid }: CheckoutFlowProps) {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { status: razorpayStatus, message: razorpayMessage, startCheckout, reset: resetRazorpay } = useRazorpayCheckout()

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'razorpay' | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error' | 'cancelled'>('idle')
  const [orderId, setOrderId] = useState<string | null>(null)

  const productPrice = product.price

  // Generate unique order ID when component mounts
  useEffect(() => {
    const generatedId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setOrderId(generatedId)
    saveOrderAsPending(generatedId, productPrice)
  }, [])

  // Save order as pending in Supabase
  const saveOrderAsPending = useCallback(async (oid: string, amt: number) => {
    if (!user) return
    try {
      await supabase.from('orders').insert({
        user_id: user.id,
        product_id: String(product.id),
        amount: amt,
        status: 'pending',
        order_id: oid,
      })
    } catch (err) {
      console.error('Failed to save pending order:', err)
    }
  }, [user, product.id, productPrice])

  // Handle UPI payment
  const handleUpiPay = useCallback(() => {
    if (!orderId) return
    setPaymentStatus('processing')
    // Simulate UPI payment - user scans QR and pays, then submits proof
    setPaymentStatus('success')
    const utr = `UPI-${Date.now()}`
    if (onPaid) onPaid(orderId)
  }, [orderId, onPaid])

  // Handle Razorpay payment
  const handleRazorpayPay = useCallback(async () => {
    if (!user) {
      navigate(`/auth?redirect=/services/${product.slug}&intent=buy`)
      return
    }
    if (!orderId) return
    setPaymentStatus('processing')

    try {
      await startCheckout(product as Product)
      // Razorpay handles its own success/failure via callbacks
    } catch (err) {
      setPaymentStatus('error')
    }
  }, [user, orderId, product, navigate, startCheckout])

  const handleRetry = useCallback(() => {
    setPaymentStatus('idle')
  }, [])

  const handleGoToPurchases = () => {
    navigate('/dashboard')
  }

  // If not authenticated yet, show login prompt
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
          <Copy className="w-6 h-6 text-[#141414]" />
        </div>
        <h3 className="text-lg font-bold text-[#141414] mb-2">Sign in to complete your purchase</h3>
        <p className="text-sm text-[#736E66] mb-6">You need to be logged in to pay for this product.</p>
        <button
          onClick={() => navigate(`/auth?redirect=/services/${product.slug}&intent=buy`)}
          className="w-full rounded-lg bg-[#141414] text-[#F6F3ED] py-3 px-4 text-sm font-bold hover:bg-[#2C2B29] transition-colors"
        >
          Sign in & Continue
        </button>
        <p className="mt-4 text-[10px] text-[#736E66]">
          Don't have an account? <a href="/auth" className="text-[#141414] font-semibold hover:underline">Create one</a>
        </p>
      </div>
    )
  }

  // Show payment options
  return (
    <section className="space-y-6">
      {/* Order Summary Card */}
      <div className="bg-white border border-[#E3DDD4] rounded-xl p-6 shadow-sm">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#F4EFE6] border border-[#E3DDD4] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[#242320]" fill="none" stroke="currentColor" viewbox="0 0 24 24">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#141414]">{product.title}</h3>
            <p className="text-[10px] uppercase font-semibold text-[#736E68] tracking-wider mt-0.5">{product.serviceType || product.category}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#736E66]">Project price</span>
            <span className="text-[#141414] font-semibold">₹{productPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[#15803d] font-medium">
            <span>Documentation included</span>
            <span>₹0</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#F0EAE1]">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-bold tracking-wider text-[#141414] uppercase">Order total</span>
            <span className="text-2xl font-bold text-[#141414]">₹{productPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="bg-white border border-[#E3DDD4] rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#141414] mb-4">Choose payment method</h3>

        {/* Option 1: UPI / QR Code */}
        <button
          onClick={() => setPaymentMethod('upi')}
          className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-150 ${
            paymentMethod === 'upi'
              ? 'border-[#141414] bg-[#F4EFE6] shadow-sm'
              : 'border-[#DDD5C7] bg-white hover:border-[#C9C1B5]'
          }`}
        >
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-[#F4EFE6] border border-[#E3DDD4] flex items-center justify-center">
              <QrCode className="w-5 h-5 text-[#141414]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#141414] flex items-center gap-1.5">
                UPI / QR Code
                <span className="text-[10px] font-medium bg-[#15803d] text-white px-1.5 py-0.5 rounded">Recommended</span>
              </div>
              <div className="text-[10px] text-[#736E66]">Scan with GPay, PhonePe, Paytm</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-[#141414]">₹{productPrice.toLocaleString()}</div>
              <div className="text-[10px] text-[#736E66]">Instant verification</div>
            </div>
          </div>
          <span className="text-[#141414] font-bold text-xs">
            {paymentMethod === 'upi' ? '✓ Selected' : 'Select'}
          </span>
        </button>

        {/* Option 2: Razorpay (Card / Netbanking) */}
        <button
          onClick={() => setPaymentMethod('razorpay')}
          className={`mt-3 w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-150 ${
            paymentMethod === 'razorpay'
              ? 'border-[#141414] bg-[#F4EFE6] shadow-sm'
              : 'border-[#DDD5C7] bg-white hover:border-[#C9C1B5]'
          }`}
        >
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-[#F4EFE6] border border-[#E3DDD4] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#141414]" fill="none" stroke="currentColor" viewbox="0 0 24 24">
                <rect x="1" y="4" width="18" height="18" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></line>
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-[#141414]">Card / Netbanking / Wallet</div>
              <div className="text-[10px] text-[#736E66]">Secure payment via Razorpay</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-[#141414]">₹{productPrice.toLocaleString()}</div>
              <div className="text-[10px] text-[#736E66]">All major cards</div>
            </div>
          </div>
          <span className="text-[#141414] font-bold text-xs">
            {paymentMethod === 'razorpay' ? '✓ Selected' : 'Select'}
          </span>
        </button>
      </div>

      {/* UPI Payment Details (shown when UPI selected) */}
      {paymentMethod === 'upi' && (
        <div className="bg-white border border-[#E3DDD4] rounded-xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F4EFE6] border border-[#E3DDD4] rounded-lg p-3 flex flex-col items-center justify-center min-h-[200px]">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#736E66] mb-1">Scan this QR</span>
              <div className="relative w-24 h-24 flex items-center justify-center">
                {qrImageUrl ? (
                  <img src={qrImageUrl} alt="UPI QR" className="w-full h-full object-cover rounded-md" />
                ) : (
                  <div className="w-full h-full bg-white border border-[#DDD5C7] rounded-md flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-[#141414]" />
                  </div>
                )}
              </div>
              <p className="mt-2 text-[10px] text-[#736E66] leading-tight text-center">
                Scan with GPay, PhonePe, Paytm or any UPI app
              </p>
            </div>

            <div className="flex flex-col justify-center space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-medium text-[#141414]">UPI ID</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(upiId)}
                    className="text-xs font-medium text-[#4A4742] hover:text-[#141414] underline decoration-transparent hover:decoration-[#141414]"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-base font-mono font-bold text-[#141414] truncate">{upiId}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-medium text-[#141414]">Amount</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(productPrice.toString())}
                    className="text-xs font-medium text-[#4A4742] hover:text-[#141414] underline decoration-transparent hover:decoration-[#141414]"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-base font-bold text-[#141414]">₹{productPrice.toLocaleString()}</p>
              </div>

              <button
                onClick={handleUpiPay}
                className="w-full py-2.5 rounded-lg bg-[#141414] text-[#F6F3ED] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#2C2B29] transition-colors"
              >
                <Smartphone className="w-3 h-3" />
                <span>I have paid via UPI</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#504C46] mt-1">
            <span className="w-1 h-1 rounded-full bg-[#141414]"></span>
            After paying, upload your payment screenshot below
          </div>
        </div>
      )}

      {/* Razorpay Payment Button (shown when Razorpay selected) */}
      {paymentMethod === 'razorpay' && (
        <div className="bg-white border border-[#E3DDD4] rounded-xl p-6 shadow-sm">
          <div className="text-center">
            <button
              onClick={handleRazorpayPay}
              disabled={razorpayStatus === 'processing'}
              className={`w-full rounded-lg py-4 text-sm font-bold transition-all duration-150 ${
                razorpayStatus === 'processing'
                  ? 'bg-[#F4EFE6] text-[#736E66] border border-[#DDD5C7] cursor-not-allowed'
                  : 'bg-[#141414] text-[#F6F3ED] hover:bg-[#2C2B29] shadow-sm'
              }`}
            >
              {razorpayStatus === 'processing' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing payment…
                </>
              ) : (
                <>
                  <span className="mr-2">Pay securely ₹{productPrice.toLocaleString()}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewbox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                </>
              )}
            </button>
            <p className="mt-3 text-[10px] text-[#736E66]">
              You'll be redirected to Razorpay to complete your payment securely.
            </p>
          </div>
        </div>
      )}

      {/* Payment Proof Upload (shown after payment initiated) */}
      {(paymentMethod === 'upi' && paymentStatus === 'success') || (razorpayStatus === 'success') && (
        <div className="bg-white border border-[#E3DDD4] rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-[#141414] mb-3">Upload payment proof</h3>
          <p className="text-xs text-[#736E66] mb-4">
            Please upload a screenshot of your payment or enter the transaction ID (UTR) for verification.
          </p>
          <form className="space-y-3" onSubmit={(e) => {
            e.preventDefault()
          }}>
            <div
              className="rounded-lg border-2 border-dashed border-[#DDD5C7] bg-white p-6 text-center hover:border-[#141414] transition-colors"
            >
              <Upload className="w-6 h-6 mb-2 text-[#736E66]" />
              <p className="text-sm font-medium text-[#141414]">Upload payment screenshot</p>
              <p className="text-xs text-[#736E66]">JPEG / PNG / PDF, max 5MB</p>
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                aria-label="Upload payment proof"
              />
              <button
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'image/*,.pdf'
                  input.onchange = (e: any) => {
                    const f = e.target.files?.[0]
                    if (f) {
                      // Simulate upload success
                      setPaymentStatus('success')
                      const utr = `TXN-${Date.now()}`
                      if (onPaid) onPaid(orderId || '')
                    }
                  }
                  input.click()
                }}
                className="w-full py-2 rounded-lg border border-[#DDD5C7] bg-[#F4EFE6] text-[#736E66] text-xs font-medium hover:bg-[#EDEAE0] transition-colors"
              >
                Choose file
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#141414] uppercase tracking-wider mb-1">
                Transaction ID (UTR)
              </label>
              <input
                type="text"
                placeholder="Enter UTR / transaction ID"
                className="w-full rounded-lg border border-[#DDD5C7] bg-white px-3 py-2.5 text-sm text-[#141414] focus:outline-none focus:border-[#141414] focus:ring-1 focus:ring-[#141414]"
              />
            </div>

            <button
              onClick={() => {
                setPaymentStatus('success')
                if (onPaid) onPaid(orderId || '')
              }}
              className="w-full rounded-lg bg-[#141414] text-[#F6F3ED] py-3 px-4 text-sm font-bold hover:bg-[#2C2B29] transition-colors"
            >
              Submit for verification
            </button>
          </form>
        </div>
      )}

      {/* Payment Status */}
      {paymentStatus === 'success' && (
        <div className="bg-white border border-[#E3DDD4] rounded-xl p-6 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6 text-[#15803d]" />
          </div>
          <h3 className="text-lg font-bold text-[#141414] mb-2">Payment received!</h3>
          <p className="text-sm text-[#736E66] mb-4">Your payment is being verified. Order ID: {orderId}</p>
          <button
            onClick={handleGoToPurchases}
            className="w-full rounded-lg bg-[#141414] text-[#F6F3ED] py-3 px-4 text-sm font-bold hover:bg-[#2C2B29] transition-colors"
          >
            Go to My purchases
          </button>
        </div>
      )}

      {paymentStatus === 'error' && (
        <div className="bg-white border border-[#E3DDD4] rounded-xl p-6 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-[#942B2B]" />
          </div>
          <h3 className="text-lg font-bold text-[#141414] mb-2">Payment failed</h3>
          <p className="text-sm text-[#736E66] mb-4">{razorpayMessage || 'Please try again.'}</p>
          <button
            onClick={handleRetry}
            className="w-full rounded-lg bg-[#141414] text-[#F6F3ED] py-3 px-4 text-sm font-bold hover:bg-[#2C2B29] transition-colors"
          >
            Try again
          </button>
        </div>
      )}
    </section>
  )
}