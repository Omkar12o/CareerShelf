// ---------------------------------------------------------------------------
// Payment configuration — PUBLIC values only.
//
// This file is bundled into the browser and this repository is public.
// NEVER put bank account numbers, IFSC codes, UPI IDs, webhook secrets or
// merchant API secrets here. Settlement details (receiving VPA / payee name)
// live only in the Youpi Merchant Admin panel and in Youpi's own .env.
// ---------------------------------------------------------------------------

export const PAYMENT_CONFIG = {
  currency: 'INR',

  // Youpi self-hosted gateway.
  // gatewayUrl  → checkout portal that serves youpi.js (port 7000 locally)
  // apiUrl      → payment core REST API (port 6100 locally)
  // publicKey   → publishable merchant id (NOT the secret merchant key)
  gatewayUrl: (import.meta.env.VITE_YOUPI_GATEWAY_URL as string | undefined) ?? 'http://localhost:7000',
  apiUrl: (import.meta.env.VITE_YOUPI_API_URL as string | undefined) ?? 'http://localhost:6100',
  publicKey:
    (import.meta.env.VITE_YOUPI_MERCHANT_ID as string | undefined) ??
    '00000000-0000-0000-0000-000000000001',

  appName: 'CareerShelf',
  supportEmail: 'support@careershelf.com',
  whatsappNumber: '+919146601241',
} as const

/** Base URL of our own backend (order creation + webhook receiver). */
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:3001'
