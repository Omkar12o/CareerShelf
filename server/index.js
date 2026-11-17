// ---------------------------------------------------------------------------
// CareerShelf payment backend
//
// Two jobs:
//   1. POST /api/payments/create  — creates a Youpi payment session server-side
//      (the secret merchant key must never reach the browser) and records a
//      pending order in Supabase.
//   2. POST /api/youpi-webhook    — verifies the HMAC-SHA256 signature and only
//      then flips the order to 'paid'. This is the authoritative step.
//
// Supabase `orders` schema in this project:
//   id (uuid, pk), user_id, product_id, amount, status, created_at
// There is no order_id/utr/payment_id column, so the row's own `id` is what we
// hand to Youpi as the merchant order reference.
//
// Run with:  npm run server
// ---------------------------------------------------------------------------

import crypto from 'node:crypto'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { resolveProductPrice } from './catalog.js'

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local', override: true })

const PORT = Number(process.env.SERVER_PORT || 3001)

const YOUPI_API_URL = process.env.YOUPI_API_URL || 'http://localhost:6100'
const YOUPI_PORTAL_URL = process.env.YOUPI_PORTAL_URL || 'http://localhost:7000'
const YOUPI_MERCHANT_KEY = process.env.YOUPI_MERCHANT_KEY || ''
const YOUPI_WEBHOOK_SECRET = process.env.YOUPI_WEBHOOK_SECRET || ''
const YOUPI_MERCHANT_ID =
  process.env.YOUPI_MERCHANT_ID || '00000000-0000-0000-0000-000000000001'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[fatal] Supabase URL / anon key missing. Check .env')
  process.exit(1)
}

if (!YOUPI_MERCHANT_KEY) {
  console.warn('[warn] YOUPI_MERCHANT_KEY is missing — payment creation will fail.')
}

if (!YOUPI_WEBHOOK_SECRET) {
  console.warn('[warn] YOUPI_WEBHOOK_SECRET is missing — every webhook will be rejected.')
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '[warn] SUPABASE_SERVICE_ROLE_KEY is missing. Orders cannot be created and the webhook ' +
      'cannot mark them paid. Add it to .env.local (Supabase → Project Settings → API → service_role).',
  )
}

// Server-side client: the service role bypasses RLS, which is required because
// the anon key is not allowed to insert orders or update them from a webhook.
const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const app = express()

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true)
      return callback(new Error(`Origin ${origin} is not allowed`))
    },
    credentials: true,
  }),
)

app.get('/health', (_req, res) => {
  res.json({
    status: 'UP',
    service: 'careershelf-payments',
    supabase: Boolean(SUPABASE_URL),
    serviceRoleConfigured: Boolean(SUPABASE_SERVICE_ROLE_KEY),
    youpiApi: YOUPI_API_URL,
  })
})

// ---------------------------------------------------------------------------
// 1. Create a payment session
// ---------------------------------------------------------------------------
app.post('/api/payments/create', express.json(), async (req, res) => {
  try {
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(503).json({
        error:
          'Payments are not configured yet: SUPABASE_SERVICE_ROLE_KEY is missing on the server.',
      })
    }

    const authorization = req.headers.authorization || ''
    const accessToken = authorization.toLowerCase().startsWith('bearer ')
      ? authorization.slice(7).trim()
      : ''

    if (!accessToken) {
      return res.status(401).json({ error: 'Missing session token. Please sign in again.' })
    }

    // Verify the Supabase session against the auth server.
    const { data: userData, error: userError } = await admin.auth.getUser(accessToken)
    if (userError || !userData?.user) {
      return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' })
    }
    const user = userData.user

    const { productId, amount, description, customer } = req.body || {}
    const requestedAmount = Number(amount)

    if (!productId || !Number.isFinite(requestedAmount) || requestedAmount <= 0) {
      return res.status(400).json({ error: 'A valid productId and amount are required.' })
    }

    // The price is decided here, never by the browser.
    const price = await resolveProductPrice(admin, productId)
    if (price === null) {
      return res.status(400).json({ error: 'Unknown product. Refresh the page and try again.' })
    }

    if (Math.round(requestedAmount * 100) !== Math.round(price * 100)) {
      console.error(
        `[create] price mismatch for product ${productId}: expected ₹${price}, got ₹${requestedAmount}`,
      )
      return res.status(409).json({
        error: `The price of this product is ₹${price}. Refresh the page and try again.`,
        expectedAmount: price,
      })
    }

    const numericAmount = price

    // Record the pending order first; its uuid becomes the gateway order id.
    const { data: order, error: insertError } = await admin
      .from('orders')
      .insert({
        user_id: user.id,
        product_id: String(productId),
        amount: numericAmount,
        status: 'pending',
      })
      .select('id')
      .single()

    if (insertError || !order) {
      console.error('[orders] insert failed:', insertError?.message)
      return res.status(500).json({
        error: `Could not create the order record (${insertError?.message || 'unknown error'}).`,
      })
    }

    const orderId = order.id

    // Create the session with the gateway (secret key stays on the server).
    const gatewayResponse = await fetch(`${YOUPI_API_URL}/api/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Merchant-Key': YOUPI_MERCHANT_KEY,
        'X-Merchant-Id': YOUPI_MERCHANT_ID,
        'Idempotency-Key': orderId,
      },
      body: JSON.stringify({
        orderId,
        amount: numericAmount.toFixed(2),
        currency: 'INR',
        description: description || 'CareerShelf purchase',
        customer: {
          name: customer?.name || '',
          email: customer?.email || user.email || '',
          phoneNumber: customer?.phoneNumber || '',
        },
        metadata: {
          product_id: String(productId),
          user_id: user.id,
        },
        returnUrl: `${ALLOWED_ORIGINS[0]}/dashboard`,
      }),
    })

    const gatewayPayload = await gatewayResponse.json().catch(() => ({}))

    if (!gatewayResponse.ok || !gatewayPayload.checkoutUrl) {
      console.error('[youpi] create payment failed:', gatewayResponse.status, gatewayPayload)

      // Do not leave an unusable pending row behind.
      await admin
        .from('orders')
        .delete()
        .eq('id', orderId)
        .then(
          () => undefined,
          () => undefined,
        )

      return res.status(502).json({
        error:
          gatewayPayload.error ||
          gatewayPayload.message ||
          `The payment gateway rejected the request (${gatewayResponse.status}).`,
      })
    }

    return res.status(201).json({
      orderId,
      paymentId: gatewayPayload.paymentId,
      checkoutUrl: gatewayPayload.checkoutUrl,
      portalUrl: YOUPI_PORTAL_URL,
    })
  } catch (error) {
    console.error('[create] unexpected error:', error)
    return res.status(500).json({ error: 'Unexpected server error while creating the payment.' })
  }
})

// ---------------------------------------------------------------------------
// 2. Signed webhook — the ONLY place an order becomes 'paid'
// ---------------------------------------------------------------------------
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const processedDeliveries = new Set()

app.post(
  '/api/youpi-webhook',
  express.json({
    verify: (req, _res, buffer) => {
      // HMAC must be computed over the exact bytes the gateway signed.
      req.rawBody = buffer
    },
  }),
  async (req, res) => {
    try {
      const signature = String(req.headers['x-gateway-signature'] || '')
      const deliveryId = String(req.headers['x-gateway-delivery-id'] || '')
      const eventHeader = String(req.headers['x-gateway-event'] || '')

      if (!YOUPI_WEBHOOK_SECRET) {
        console.error('[webhook] rejected: no webhook secret configured')
        return res.status(500).json({ error: 'Webhook secret not configured' })
      }

      const expected =
        'sha256=' +
        crypto.createHmac('sha256', YOUPI_WEBHOOK_SECRET).update(req.rawBody).digest('hex')

      const signatureBuffer = Buffer.from(signature)
      const expectedBuffer = Buffer.from(expected)

      if (
        signatureBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
      ) {
        console.error('[webhook] invalid signature from', req.ip)
        return res.status(401).json({ error: 'Invalid signature' })
      }

      if (deliveryId && processedDeliveries.has(deliveryId)) {
        return res.status(200).json({ received: true, duplicate: true })
      }

      const payload = req.body || {}
      const event = payload.event || eventHeader
      const method = payload.method
      const orderId = String(payload.orderId || '')

      console.log('[webhook]', {
        event,
        method,
        settlementState: payload.settlementState,
        orderId,
        amountPaise: payload.amountPaise,
        utr: payload.utr,
      })

      // Cash-on-delivery and counter payments are NOT money received via UPI.
      if (method !== 'UPI') {
        return res.status(200).json({ received: true, ignored: `method:${method || 'unknown'}` })
      }

      // Youpi event names:
      //   OBSERVED_SUCCESS → bank SMS/Gmail alert matched (UTR + amount verified)
      //   SUCCESS / RECONCILED → stricter bank-statement settlement
      // EXPIRED / FAILED / CANCELLED are not payments.
      const PAID_EVENTS = ['OBSERVED_SUCCESS', 'SUCCESS', 'RECONCILED']
      if (!PAID_EVENTS.includes(event)) {
        return res.status(200).json({ received: true, ignored: `event:${event || 'unknown'}` })
      }

      // An observer-verified payment must carry a UTR and the exact amount.
      if (!payload.utr) {
        console.error('[webhook] missing UTR for', orderId)
        return res.status(400).json({ error: 'Missing UTR' })
      }

      if (!UUID_RE.test(orderId)) {
        console.error('[webhook] invalid order id:', orderId)
        return res.status(400).json({ error: 'Invalid orderId' })
      }

      const { data: order, error: orderError } = await admin
        .from('orders')
        .select('id, status, amount')
        .eq('id', orderId)
        .maybeSingle()

      if (orderError) {
        console.error('[webhook] order lookup failed:', orderError.message)
        return res.status(500).json({ error: 'Order lookup failed' })
      }

      if (!order) {
        // Acknowledge so Youpi does not retry forever; alert in the log instead.
        console.error('[webhook] unknown order:', orderId)
        return res.status(200).json({ received: true, ignored: 'unknown-order' })
      }

      if (order.status === 'paid') {
        if (deliveryId) processedDeliveries.add(deliveryId)
        return res.status(200).json({ received: true, duplicate: true })
      }

      // The amount is mandatory: a payload without amountPaise must never unlock
      // an order, otherwise the check below could be skipped.
      const expectedPaise = Math.round(Number(order.amount) * 100)
      const receivedPaise = Number(payload.amountPaise)

      if (!Number.isFinite(receivedPaise)) {
        console.error(`[webhook] missing amountPaise for ${orderId}`)
        return res.status(400).json({ error: 'Missing amountPaise' })
      }

      if (receivedPaise !== expectedPaise) {
        console.error(
          `[webhook] amount mismatch for ${orderId}: expected ${expectedPaise}, got ${payload.amountPaise}`,
        )
        return res.status(400).json({ error: 'Amount mismatch' })
      }

      const { error: updateError } = await admin
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', order.id)

      if (updateError) {
        console.error('[webhook] failed to mark paid:', updateError.message)
        return res.status(500).json({ error: 'Could not update the order' })
      }

      if (deliveryId) processedDeliveries.add(deliveryId)

      console.log(`[webhook] order ${orderId} marked PAID (utr: ${payload.utr || 'n/a'})`)
      return res.status(200).json({ received: true, status: 'paid' })
    } catch (error) {
      console.error('[webhook] unexpected error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  },
)

app.listen(PORT, () => {
  console.log(`CareerShelf payment backend on http://localhost:${PORT}`)
  console.log(`  POST /api/payments/create   → ${YOUPI_API_URL}`)
  console.log(`  POST /api/youpi-webhook     → merchant ${YOUPI_MERCHANT_ID.slice(0, 8)}…`)
  console.log(`  Supabase service role: ${SUPABASE_SERVICE_ROLE_KEY ? 'configured' : 'MISSING'}`)
  console.log(`  Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`)
})
