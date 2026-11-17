// ─────────────────────────────────────────────────────────────────────────────
// CareerShelf cloud bootstrap — runs ONCE inside the payment-api container.
//
// Why this exists: the gateway seeds a placeholder merchant (`merchant@upi`,
// webhook pointing at localhost) and a random API key on a fresh database.
// Rather than shipping a database file (whose encrypted values only decrypt on
// the machine that created them), this script writes the real values through
// the gateway's own repositories, so encryption keys stay on the server.
//
// It is idempotent: run it after every deploy/restart and it converges.
// It does NOT touch payment logic, state machines, observers or verification.
// ─────────────────────────────────────────────────────────────────────────────
import { Database } from '/app/packages/db/src/database.js'
import { runMigrations } from '/app/packages/db/src/migrate.js'
import { MerchantRepository, hashApiKey } from '/app/packages/db/src/repositories/merchant.repository.js'
import { ReceivingAccountRepository } from '/app/packages/db/src/repositories/receiving-account.repository.js'

const required = (name) => {
  const value = (process.env[name] || '').trim()
  if (!value) {
    console.error(`[bootstrap] missing required env: ${name}`)
    process.exit(1)
  }
  return value
}

const PUBLIC_ORIGIN = required('PUBLIC_ORIGIN').replace(/\/+$/, '')
const MERCHANT_KEY = required('YOUPI_MERCHANT_KEY')
const WEBHOOK_SECRET = required('YOUPI_WEBHOOK_SECRET')
const PAYEE_VPA = required('DEFAULT_PAYEE_VPA')

const MERCHANT_ID = (process.env.YOUPI_MERCHANT_ID || '00000000-0000-0000-0000-000000000001').trim()
const MERCHANT_NAME = (process.env.DEFAULT_MERCHANT_NAME || 'CareerShelf').trim()
const PAYEE_NAME = (process.env.PAYEE_NAME || MERCHANT_NAME).trim()
const DB_PATH = process.env.SQLITE_DB_PATH || '/app/data/youpi_pg.sqlite'

/** Never print a full VPA or secret — `example@bank` becomes `ex***@bank`. */
const maskVpa = (vpa) => {
  const [handle, bank] = String(vpa).split('@')
  if (!bank) return '***'
  const visible = handle.slice(0, 2)
  return `${visible}${'*'.repeat(Math.max(3, handle.length - 2))}@${bank}`
}

const db = new Database({ dbPath: DB_PATH })
runMigrations(db)

const merchants = new MerchantRepository(db)
const accounts = new ReceivingAccountRepository(db)

let merchant = merchants.findById(MERCHANT_ID) || merchants.getDefault()
if (!merchant) {
  console.error('[bootstrap] no merchant found and none could be created by migrations')
  process.exit(1)
}

const webhookUrl = `${PUBLIC_ORIGIN}/api/payments/webhook`

merchant = merchants.update(merchant.id, {
  businessName: MERCHANT_NAME,
  webhookUrl,
  webhookSecret: WEBHOOK_SECRET,
  apiKey: MERCHANT_KEY,
  // Keep the publishable merchant key visible to the merchant admin panel.
  branding: { ...(merchant.branding || {}), merchantApiKey: MERCHANT_KEY, appName: MERCHANT_NAME },
})

// Exactly one active receiving VPA per merchant (repo enforces the invariant).
// upsertActiveForMerchant reuses the active row instead of piling up duplicates.
accounts.upsertActiveForMerchant(merchant.id, PAYEE_VPA, PAYEE_NAME, true)

const verified = merchants.findById(merchant.id)
const apiKeyOk = verified.apiKeyHash === hashApiKey(MERCHANT_KEY)
const live = accounts.findActiveForMerchant(merchant.id)

console.log('[bootstrap] merchant    :', verified.businessName, verified.id)
console.log('[bootstrap] webhook url :', verified.webhookUrl)
console.log('[bootstrap] api key     :', apiKeyOk ? 'verified' : 'MISMATCH')
console.log('[bootstrap] receiving   :', live ? `${maskVpa(live.upiId)} / ${live.payeeName}` : 'MISSING')
console.log('[bootstrap] done')
db.close()
