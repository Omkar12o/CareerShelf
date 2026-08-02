import { Compass } from 'lucide-react'
import { Button } from '../components/Button'

export function NotFoundPage() {
  return (
    <section className="relative overflow-hidden bg-gray-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/3 size-96 rounded-full bg-brand-600/30 blur-3xl"
      />
      <div className="relative mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
          <Compass className="size-8" strokeWidth={1.6} />
        </span>
        <h1 className="mt-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent sm:text-8xl">
          404
        </h1>
        <p className="mt-4 text-lg font-medium text-gray-300">
          This page wandered off the shelf.
        </p>
        <div className="mt-8">
          <Button to="/" size="lg">
            Back to home
          </Button>
        </div>
      </div>
    </section>
  )
}
