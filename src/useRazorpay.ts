import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product } from './data/products'
import { supabase } from './supabaseClient'
import { useAuth } from './useAuth'

const RAZORPAY_KEY_ID = 'rzp_test_TKqxoSMXCbNHIY'
const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'
const STORE_NAME = 'CareerShelf'

type RazorpayPaymentResponse = {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

type RazorpayOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description?: string
  prefill?: { name?: string; email?: string; contact?: string }
  theme?: { color?: string }
  handler: (response: RazorpayPaymentResponse) => void
  modal?: { ondismiss?: () => void }
}

type RazorpayInstance = {
  open: () => void
  on: (event: string, handler: (response: unknown) => void) => void
}

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor
  }
}

function loadRazorpay(): Promise<RazorpayConstructor> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay)
      return
    }

    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT_SRC
    script.async = true
    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay)
      } else {
        reject(new Error('Razorpay failed to initialise.'))
      }
    }
    script.onerror = () =>
      reject(
        new Error('Could not load Razorpay Checkout. Check your connection and try again.'),
      )
    document.body.appendChild(script)
  })
}

export type CheckoutStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'
  | 'cancelled'

export function useRazorpayCheckout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState<CheckoutStatus>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const paymentSucceeded = useRef(false)
  const paymentFailed = useRef(false)

  const reset = () => {
    paymentSucceeded.current = false
    paymentFailed.current = false
    setStatus('idle')
    setMessage(null)
  }

  const startCheckout = async (product: Product) => {
    paymentSucceeded.current = false
    paymentFailed.current = false
    setMessage(null)

    if (!user) {
      navigate(
        `/auth?redirect=${encodeURIComponent(`/products/${product.slug}`)}`,
      )
      return
    }

    setStatus('loading')

    try {
      const Razorpay = await loadRazorpay()
      const amountInPaise = Math.round(product.price * 100)

      // ---------------------------------------------------------------------
      // SECURITY WARNING — DO NOT SHIP THIS AS-IS TO PRODUCTION.
      // This success handler runs entirely on the client and can be called by
      // anyone without actually paying. A real implementation MUST verify
      // Razorpay's payment signature on a server via a webhook/endpoint
      // BEFORE marking an order as "paid" and granting download access.
      // ---------------------------------------------------------------------
      const handlePaymentSuccess = async (
        response: RazorpayPaymentResponse,
      ) => {
        paymentSucceeded.current = true
        setStatus('loading')

        const { error: insertError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            product_id: String(product.id),
            amount: product.price,
            status: 'paid',
          })

        if (insertError) {
          setStatus('error')
          setMessage(
            `Payment succeeded, but we couldn't save your order (${insertError.message}). Please contact support and keep your payment ID: ${response.razorpay_payment_id}.`,
          )
          return
        }

        setStatus('success')
        setMessage('Payment successful! Your purchase is now in your library.')
      }

      const checkout = new Razorpay({
        key: RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency: 'INR',
        name: STORE_NAME,
        description: product.title,
        prefill: {
          email: user.email ?? '',
          name: String(user.user_metadata?.full_name ?? ''),
        },
        theme: { color: '#4f46e5' },
        handler: handlePaymentSuccess,
        modal: {
          ondismiss: () => {
            if (paymentSucceeded.current || paymentFailed.current) return
            setStatus('cancelled')
            setMessage('Payment cancelled. You can try again whenever you are ready.')
          },
        },
      })

      checkout.on('payment.failed', () => {
        paymentFailed.current = true
        setStatus('error')
        setMessage('Payment failed. Please check your details and try again.')
      })

      checkout.open()
      setStatus('idle')
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong while starting checkout. Please try again.',
      )
    }
  }

  return { status, message, startCheckout, reset }
}
