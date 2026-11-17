import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GsapReveal } from '../components/GsapReveal'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import {
  PRODUCTS,
  formatPrice,
  parseCategories,
  productFromRow,
  type Product,
  type ProductRow,
} from '../data/products'
import { supabase } from '../supabaseClient'

export function ServicesPage() {
  const [fromAdmin, setFromAdmin] = useState<Product[]>([])

  // Services added in Admin → Services are real Supabase products, so the
  // price the admin typed is the price the checkout charges.
  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<ProductRow[]>()
      if (cancelled || error) return
      setFromAdmin(
        (data ?? [])
          .filter((row) => parseCategories(row.categories)[0] === 'service')
          .map(productFromRow),
      )
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const staticServices = PRODUCTS.filter((p) => p.category === 'service')
  // Once the admin adds services, that catalogue is authoritative: it is what
  // the server can price and sell. The built-in list is only the fallback.
  const services = fromAdmin.length > 0 ? fromAdmin : staticServices

  return (
    <section className="section-padding bg-navy-50">
      <div className="max-w-7xl mx-auto">
        <GsapReveal>
          <h1 className="text-4xl font-bold text-navy-600 mb-4">Projects & Services</h1>
          <p className="text-navy-400 text-lg mb-6">
            Software projects and services, each delivered with full documentation.
          </p>
        </GsapReveal>

        <GsapReveal delay={0.1} stagger={0.06}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const managed = fromAdmin.some((p) => p.id === s.id)
              const detailsTo = managed ? `/products/${s.id}` : `/services/${s.slug}`
              return (
                <div
                  key={`${managed ? 'db' : 'static'}-${s.id}`}
                  className="bg-white rounded-2xl p-6 shadow-lg border-border hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-navy-600">{s.title}</h3>
                  <p className="mt-2 text-sm text-navy-500">{s.shortDescription}</p>
                  <p className="mt-4 text-xl font-extrabold text-emerald-600">
                    {s.price === 0 ? 'Contact for quote' : formatPrice(s.price)}
                  </p>
                  {managed ? (
                    <Badge color="emerald" className="mt-3">
                      Documentation included
                    </Badge>
                  ) : null}
                  <div className="mt-4 flex gap-2">
                    <Button to={detailsTo} size="sm">
                      View details
                    </Button>
                    <Button to="/contact" variant="outline" size="sm">
                      Enquire
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </GsapReveal>

        {services.length === 0 && (
          <p className="mt-10 text-navy-400">
            No services yet. Add one from Admin → Services.
          </p>
        )}

        <div className="mt-12">
          <Link
            to="/products?category=service"
            className="text-emerald-600 font-semibold hover:text-navy-600 transition-colors underline"
          >
            View all in products →
          </Link>
        </div>
      </div>
    </section>
  )
}
