import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PAYMENT_CONFIG, API_BASE_URL } from './config/payment'
import type { Product } from './data/products'
import { supabase } from './supabaseClient'
import { useAuth } from './useAuth'

// ---------------------------------------------------------------------------
// Youpi (self-hosted UPI gateway) checkout hook.
//
// Youpi requires the payment session to be created SERVER-SIDE with the secret
// merchant key. This hook therefore:
//   1. asks our backend (server/index.js) to create the payment,
//   2. opens the returned checkout URL in the Youpi modal,
//   3. polls Supabase until the signed webhook flips the order to 'paid'.
//
// It never marks an order as paid from the browser.
// ---------------------------------------------------------------------------

type YoupiPayOptions = {
  checkoutUrl?: string
  paymentId?: string
  portalUrl?: string
  handler?: (result: unknown) => void
  onClose?: () => void
  onCancelled?: () => void
  onExpired?: () => void
  onFailed?: () => void
}

type YoupiApi = {
  pay: (options: YoupiPayOptions) => void
}

declare global {
  interface Window {
    Youpi?: YoupiApi
  }
}

const POLL_INTERVAL_MS = 3000
const POLL_TIMEOUT_MS = 90000
/** After the customer closes the modal we keep a low-key watch for the webhook. */
const SILENT_POLL_TIMEOUT_MS = 180000

function loadYoupiScript(): Promise<YoupiApi> {
  return new Promise((resolve, reject) => {
    if (window.Youpi) {
      resolve(window.Youpi)
      return
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-careershelf-youpi]')
    const script = existing ?? document.createElement('script')

    script.src = `${PAYMENT_CONFIG.gatewayUrl}/youpi.js`
    script.async = true
    script.dataset.careershelfYoupi = 'true'
    script.dataset.merchantId = PAYMENT_CONFIG.publicKey
    script.dataset.apiUrl = PAYMENT_CONFIG.apiUrl
    script.dataset.portalUrl = PAYMENT_CONFIG.gatewayUrl
    script.dataset.currency = PAYMENT_CONFIG.currency
    script.dataset.name = PAYMENT_CONFIG.appName
    script.dataset.themeColor = '#141414'

    script.onload = () => {
      if (window.Youpi) resolve(window.Youpi)
      else reject(new Error('Youpi script loaded but window.Youpi is missing.'))
    }
    script.onerror = () =>
      reject(new Error(`Could not reach the Youpi gateway at ${PAYMENT_CONFIG.gatewayUrl}.`))

    if (!existing) document.head.appendChild(script)
  })
}

async function createPaymentRequest(args: {
  productId: string
  amount: number
  description: string
  customer?: { name?: string; email?: string; phoneNumber?: string }
}) {
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token

  const response = await fetch(`${API_BASE_URL}/api/payments/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(args),
  })

  const payload = (await response.json().catch(() => ({}))) as {
    orderId?: string
    checkoutUrl?: string
    paymentId?: string
    error?: string
  }

  if (!response.ok || !payload.checkoutUrl) {
    throw new Error(payload.error || 'Could not create the payment session.')
  }

  return payload as { orderId: string; checkoutUrl: string; paymentId: string }
}

export type YoupiStatus = 'idle' | 'loading' | 'waiting' | 'success' | 'error' | 'cancelled'

export function useYoupiCheckout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState<YoupiStatus>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const settled = useRef(false)
  const waiting = useRef(false)

  const reset = () => {
    settled.current = false
    waiting.current = false
    setStatus('idle')
    setMessage(null)
  }

  /**
   * Read-only polling: only the signed webhook may write 'paid'.
   * `silent` keeps watching after the customer closed the modal without
   * overwriting the visible status unless the payment actually lands.
   */
  const waitForWebhook = async (orderId: string, options: { silent?: boolean } = {}) => {
    const deadline = Date.now() + (options.silent ? SILENT_POLL_TIMEOUT_MS : POLL_TIMEOUT_MS)

    while (Date.now() < deadline) {
      const { data } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .maybeSingle()

      if (data?.status === 'paid') {
        settled.current = true
        waiting.current = false
        setStatus('success')
        setMessage('Payment verified. Your purchase is now in your library.')
        return
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
    }

    if (options.silent) return

    waiting.current = false
    setStatus('error')
    setMessage(
      'Payment is still awaiting bank confirmation. If money left your account it will unlock automatically — check "My purchases" again in a few minutes.',
    )
  }

  const startCheckout = async (product: Product) => {
    settled.current = false
    waiting.current = false
    setMessage(null)

    if (!user) {
      navigate(`/auth?redirect=${encodeURIComponent(`/products/${product.slug}`)}`)
      return
    }

    setStatus('loading')

    try {
      const payment = await createPaymentRequest({
        productId: String(product.id),
        amount: product.price,
        description: product.title,
        customer: {
          name: String(user.user_metadata?.full_name ?? ''),
          email: user.email ?? '',
          phoneNumber: String(user.user_metadata?.phone ?? ''),
        },
      })

      const Youpi = await loadYoupiScript()

      Youpi.pay({
        checkoutUrl: payment.checkoutUrl,
        handler: () => {
          waiting.current = true
          setStatus('waiting')
          setMessage('Payment submitted — verifying with the bank…')
          void waitForWebhook(payment.orderId)
        },
        onCancelled: () => {
          if (settled.current || waiting.current) return
          setStatus('cancelled')
          setMessage(
            'Checkout closed. If money already left your account it will unlock automatically — check "My purchases" in a few minutes.',
          )
          void waitForWebhook(payment.orderId, { silent: true })
        },
        onExpired: () => {
          if (settled.current) return
          setStatus('cancelled')
          setMessage('The payment window expired. Please try again.')
          void waitForWebhook(payment.orderId, { silent: true })
        },
        onFailed: () => {
          setStatus('error')
          setMessage('Payment failed. Please try again.')
        },
        onClose: () => {
          if (settled.current || waiting.current) return
          setStatus((current) => (current === 'loading' || current === 'idle' ? 'cancelled' : current))
          void waitForWebhook(payment.orderId, { silent: true })
        },
      })
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not start the Youpi checkout. Please try again.',
      )
    }
  }

  return { status, message, startCheckout, reset }
}
