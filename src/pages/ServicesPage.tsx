import { GsapReveal } from '../components/GsapReveal'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { PRODUCTS } from '../data/products'

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
    <section className="section-padding bg-navy-50">
      <div className="max-w-7xl mx-auto">
        <GsapReveal>
          <h1 className="text-4xl font-bold text-navy-600 mb-4">Projects & Services</h1>
          <p className="text-navy-400 text-lg mb-6">
            Software projects and services, each delivered with full documentation.
          </p>
        </GsapReveal>

        <GsapReveal delay={0.1} stagger={0.08}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className="bg-white rounded-2xl p-6 shadow-lg border-border hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-navy-600">{pkg.name}</h3>
                <p className="mt-2 text-xl font-bold text-emerald-600">{pkg.price}</p>
                <Badge color="emerald" className="mt-3">{pkg.note}</Badge>
              </div>
            ))}
          </div>
        </GsapReveal>

        <GsapReveal delay={0.2} stagger={0.06}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl p-6 shadow-lg border-border hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-navy-600">{s.title}</h3>
                <p className="mt-2 text-sm text-navy-500">{s.shortDescription}</p>
                <p className="mt-4 text-xl font-extrabold text-emerald-600">
                  {s.price === 0 ? 'Contact for quote' : '₹' + s.price}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button to={`/services/${s.slug}`} size="sm">
                    View details
                  </Button>
                  <Button to="/contact" variant="outline" size="sm">
                    Enquire
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </GsapReveal>

        {services.length === 0 && (
          <p className="mt-10 text-navy-400">No services available yet.</p>
        )}

        <div className="mt-12">
          <a
            href="/products?category=service"
            className="text-emerald-600 font-semibold hover:text-navy-600 transition-colors underline"
          >
            View all in products →
          </a>
        </div>
      </div>
    </section>
  )
}