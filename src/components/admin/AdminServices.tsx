import { PRODUCTS } from '../../data/products'

export function AdminServices() {
  const services = PRODUCTS.filter((p) => p.category === 'service')
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Services</h1>
      <p className="mt-2 text-sm text-gray-500">Manage projects & services. Prices editable from Supabase products table.</p>
      <div className="mt-6 space-y-2">
        {services.map((s) => (
          <div key={s.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">{s.title}</span>
              <span className="text-sm text-gray-500">{s.price === 0 ? 'Quote' : `₹${s.price}`}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
