import { AdminProducts } from './AdminProducts'

/**
 * Projects & Services is the same catalogue as Products, scoped to the
 * `service` category. Each item is a real product row in Supabase, so the
 * price entered here is the price the server enforces at checkout.
 */
export function AdminServices() {
  return (
    <AdminProducts
      lockedCategory="service"
      heading="Projects & Services"
      subheading="Upload the project file (PDF or ZIP), set your own price, and it appears in the store immediately."
      emptyHint="Add your first project or service with its file and price."
    />
  )
}
