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
      subheading="Set your own price for a project or service. The file (PDF or ZIP) is optional — add it later from Edit."
      emptyHint="Click Add project or service, type a title and your price. A file is optional."
    />
  )
}
