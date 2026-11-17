// ---------------------------------------------------------------------------
// Server-side price authority.
//
// The browser must never decide how much an order costs: otherwise anyone can
// call /api/payments/create with amount=1 and unlock a ₹499 product after a
// genuine ₹1 UPI transfer.
//
// Two catalogues exist in this project:
//   1. the Supabase `products` table (ids 2, 3) — authoritative when present
//   2. the static catalogue in src/data/products.ts (ids 1-8) used by the
//      service pages
//
// Keep STATIC_PRICES in sync with src/data/products.ts. If a product is added
// to that file and is also sold by id, add its price here.
// ---------------------------------------------------------------------------

export const STATIC_PRICES = {
  1: 49,
  2: 29,
  3: 19,
  4: 39,
  5: 29,
  6: 24,
  7: 79,
  8: 99,
}

/**
 * Resolve the real price (in rupees) for a product id.
 * Returns `null` when the product is unknown, so callers can refuse the order.
 */
export async function resolveProductPrice(admin, productId) {
  const id = String(productId).trim()

  if (/^\d+$/.test(id)) {
    const { data, error } = await admin
      .from('products')
      .select('id, price')
      .eq('id', Number(id))
      .maybeSingle()

    if (!error && data && Number(data.price) > 0) {
      return Number(data.price)
    }
  }

  const fallback = STATIC_PRICES[id]
  return typeof fallback === 'number' && fallback > 0 ? fallback : null
}
