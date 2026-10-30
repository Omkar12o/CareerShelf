import { Link } from 'react-router-dom'
import { PRODUCTS, formatPrice } from '../data/products'
import { GsapReveal } from '../components/GsapReveal'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'

const packages = [
  { name: 'Normal Project', price: 'Starting from ₹3,000', note: 'Documentation included' },
  { name: 'Frontend + Backend Project', price: 'Starting from ₹8,000', note: 'Documentation included' },
  { name: 'Big / Custom Project', price: 'Contact for quote', note: 'Price set from Admin' },
  { name: 'UI/UX Design for Application', price: '₹2,000', note: 'Documentation included' },
  { name: 'Flutter Mobile App', price: 'Starting from ₹6,000', note: 'Documentation included' },
]

export function ServicesPage() {
  const services = PRODUCTS.filter((p) => p.category === 'service')

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <GsapReveal>
        <h1 className="text-4xl font-bold text-gray-900">Projects & Services</h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Software projects and services, each delivered with full documentation.
        </p>
      </GsapReveal>

      <GsapReveal delay={0.1} stagger={0.08}>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div key={pkg.name} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
              <p className="mt-2 text-xl font-extrabold text-brand-600">{pkg.price}</p>
              <Badge color="brand" className="mt-3">{pkg.note}</Badge>
            </div>
          ))}
        </div>
      </GsapReveal>

      <GsapReveal delay={0.2} stagger={0.06}>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{s.shortDescription}</p>
              <p className="mt-4 text-xl font-extrabold text-gray-900">
                {s.price === 0 ? 'Contact for quote' : formatPrice(s.price)}
              </p>
              <div className="mt-4 flex gap-2">
                <Button to={`/services/${s.slug}`} size="sm">View details</Button>
                <Button to="/contact" variant="outline" size="sm">Enquire</Button>
              </div>
            </div>
          ))}
        </div>
      </GsapReveal>

      {services.length === 0 && (
        <p className="mt-10 text-gray-500">No services available yet.</p>
      )}

      <div className="mt-12">
        <Link to="/products?category=service" className="text-brand-600 font-semibold hover:underline">
          View all in products →
        </Link>
      </div>
    </div>
  )
}
