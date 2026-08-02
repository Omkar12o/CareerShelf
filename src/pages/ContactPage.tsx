import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { CheckCircle2, Loader2, Mail, MessageSquareText, Send, X } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FormErrors = Partial<Record<'name' | 'email' | 'message', string>>

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    if (!toastVisible) return
    const timer = window.setTimeout(() => setToastVisible(false), 4500)
    return () => window.clearTimeout(timer)
  }, [toastVisible])

  const update = (field: keyof typeof form) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [field]: event.target.value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const validate = (): boolean => {
    const next: FormErrors = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!form.email.trim()) {
      next.email = 'Please enter your email address.'
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      next.email = 'Please enter a valid email address.'
    }
    if (!form.message.trim()) {
      next.message = 'Please enter a message.'
    } else if (form.message.trim().length < 10) {
      next.message = 'Your message should be at least 10 characters.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate() || status === 'sending') return
    setStatus('sending')
    window.setTimeout(() => {
      setStatus('sent')
      setToastVisible(true)
    }, 900)
  }

  const inputClass = (hasError: boolean) =>
    `${hasError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''} input`

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow="Contact"
            title="Ask us anything"
            subtitle="Questions about a product, a refund, or a resource you wish existed? We read every message."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-brand-600 text-white">
                <Mail className="size-5" strokeWidth={1.8} />
              </span>
              <div>
                <p className="font-bold text-gray-900">Email</p>
                <a
                  href="mailto:hello@careershelf.co"
                  className="text-sm font-medium text-gray-500 hover:text-brand-600"
                >
                  hello@careershelf.co
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent-600 text-white">
                <MessageSquareText className="size-5" strokeWidth={1.8} />
              </span>
              <div>
                <p className="font-bold text-gray-900">Response time</p>
                <p className="text-sm font-medium text-gray-500">
                  Within 24 hours on weekdays.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-900/5 sm:p-10">
          {status === 'sent' ? (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <span className="grid size-14 place-items-center rounded-full bg-accent-100 text-accent-600">
                <Send className="size-6" />
              </span>
              <h2 className="mt-5 text-lg font-bold text-gray-900">
                Message sent!
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
                Thanks {form.name || 'there'} — we&apos;ll get back to you at{' '}
                <span className="font-medium text-gray-700">{form.email}</span>{' '}
                within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setForm({ name: '', email: '', message: '' })
                  setStatus('idle')
                }}
                className="mt-6 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Jane Cooper"
                    aria-invalid={Boolean(errors.name)}
                    className={inputClass(Boolean(errors.name))}
                  />
                  {errors.name ? (
                    <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={update('email')}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    className={inputClass(Boolean(errors.email))}
                  />
                  {errors.email ? (
                    <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Tell us how we can help..."
                  aria-invalid={Boolean(errors.message)}
                  className={`${inputClass(Boolean(errors.message))} resize-none`}
                />
                {errors.message ? (
                  <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
                    {errors.message}
                  </p>
                ) : null}
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                Send message
              </Button>
            </form>
          )}
        </div>
      </Reveal>

      {toastVisible ? (
        <div
          role="status"
          className="fixed bottom-20 right-4 z-[80] flex max-w-sm items-center gap-3 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-lg sm:right-6"
        >
          <CheckCircle2 className="size-5 shrink-0 text-accent-400" />
          <p>
            Message sent! We&apos;ll reply within 24 hours on weekdays.
          </p>
          <button
            type="button"
            onClick={() => setToastVisible(false)}
            aria-label="Dismiss notification"
            className="shrink-0 text-gray-400 transition-colors hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  )
}
