import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { supabase } from '../supabaseClient'

type Mode = 'signin' | 'signup'

export function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = (() => {
    const redirect = searchParams.get('redirect')
    return redirect && redirect.startsWith('/') ? redirect : '/dashboard'
  })()

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const toggleMode = (next: Mode) => {
    setMode(next)
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setError(null)
    setSuccess(null)
    if (!email.includes('@') || password.length < 6) {
      setError(
        mode === 'signin'
          ? 'Enter a valid email and a password of at least 6 characters.'
          : 'Check your details: a valid email and a password of at least 6 characters are required.',
      )
      return
    }
    setSubmitting(true)

    try {
      if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) {
          setError(signInError.message)
          return
        }
        navigate(redirectTo)
        return
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name.trim() },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data.session) {
        navigate(redirectTo)
        return
      }

      setMode('signin')
      setEmail('')
      setPassword('')
      setName('')
      setSuccess(
        'Account created! Check your email to confirm your sign-up, then sign in.',
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'input'

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gray-950 p-12 lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-16 size-80 rounded-full bg-brand-600/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-16 size-72 rounded-full bg-accent-500/10 blur-3xl"
        />
        <div className="relative">
          <Logo />
        </div>
        <div className="relative">
          <blockquote className="max-w-md text-2xl font-bold leading-snug tracking-tight text-white">
            &ldquo;I sent 40 emails from the HR list and got nine responses.
            Nothing else I tried came close.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm font-semibold text-brand-400">
            Daniel Kim · Senior Software Engineer
          </p>
        </div>
        <div className="relative flex gap-12 text-sm">
          <div>
            <p className="text-3xl font-extrabold tracking-tight text-white">
              8,400+
            </p>
            <p className="mt-1 font-medium text-gray-400">products sold</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold tracking-tight text-white">
              4.8/5
            </p>
            <p className="mt-1 font-medium text-gray-400">average rating</p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6">
        <Reveal className="w-full max-w-sm">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Logo />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {mode === 'signin'
              ? 'Sign in to view your purchases and download updates.'
              : 'Buy once, and your downloads live here forever.'}
          </p>

          <div
            role="tablist"
            aria-label="Sign in or sign up"
            className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1"
          >
            {(['signin', 'signup'] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => toggleMode(m)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-150 ${
                  mode === m
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            {mode === 'signup' ? (
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Cooper"
                  className={inputClass}
                />
              </div>
            ) : null}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                {mode === 'signin' ? (
                  <span className="text-xs font-medium text-brand-600 hover:text-brand-700">
                    Forgot password?
                  </span>
                ) : null}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="size-4.5" />
                  ) : (
                    <Eye className="size-4.5" />
                  )}
                </button>
              </div>
            </div>

            {error ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : mode === 'signin' ? (
                'Sign in'
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {mode === 'signin' ? (
              <>
                New to CareerShelf?{' '}
                <button
                  type="button"
                  onClick={() => toggleMode('signup')}
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => toggleMode('signin')}
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  Sign in
                </button>
              </>
            )}
          </p>

          <p className="mt-8 text-center text-xs text-gray-400">
            Secured by Supabase Auth — your account keeps your purchases and
            downloads in one place.
          </p>
        </Reveal>
      </div>
    </div>
  )
}
