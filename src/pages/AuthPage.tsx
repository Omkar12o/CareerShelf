import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Mail, ArrowRight } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Button } from '../components/Button'
import { supabase } from '../supabaseClient'
import { useAuth } from '../useAuth'

type Mode = 'signin' | 'signup' | 'forgot-password'

interface BuyIntent {
  productId: string
  tier?: string
  price: number
  returnTo: string
}

// Security: validate that a redirect path is internal and safe
function isSafeRedirect(path: string | null): boolean {
  if (!path || !path.startsWith('/')) return false
  // Reject protocol-relative URLs (//) and absolute URLs
  if (path.startsWith('//')) return false
  if (/^https?:\/\//i.test(path)) return false
  return true
}

function getStoredIntent(): BuyIntent | null {
  try {
    const raw = sessionStorage.getItem('careershelf_buy_intent')
    if (!raw) return null
    const intent = JSON.parse(raw) as BuyIntent
    if (!intent || !intent.productId || !intent.returnTo) return null
    if (!isSafeRedirect(intent.returnTo)) return null
    return intent
  } catch {
    return null
  }
}

function clearStoredIntent() {
  try {
    sessionStorage.removeItem('careershelf_buy_intent')
  } catch {
    // ignore
  }
}

export function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, loading: authLoading, signInWithGoogle } = useAuth()

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSubmitting, setResetSubmitting] = useState(false)

  // While auth state is still loading, show neutral state — never redirect
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  // If already logged in, redirect away from /auth
  if (user) {
    const redirect = searchParams.get('redirect')
    const target = isSafeRedirect(redirect) ? redirect : '/dashboard'
    navigate(target, { replace: true })
    return null
  }

  // Resolve where to send the user after successful auth
  const redirectParam = searchParams.get('redirect')
  const storedIntent = getStoredIntent()
  const defaultRedirect = storedIntent?.returnTo ?? '/'
  const resolvedRedirect = isSafeRedirect(redirectParam) ? redirectParam : defaultRedirect

  // Buy-now banner
  const buyIntent = storedIntent
  const showBuyBanner = buyIntent !== null

  const toggleMode = (next: Mode) => {
    setMode(next)
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (submitting) return
      setError(null)
      setSuccess(null)

      // Validation
      if (!email.includes('@')) {
        setError('Please enter a valid email address.')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
      if (mode === 'signup' && !fullName.trim()) {
        setError('Please enter your full name.')
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
            let msg = signInError.message
            // Map common Supabase errors to friendly messages
            if (msg.includes('Failed to fetch')) {
              msg = 'Cannot connect to the server. Please check your Supabase configuration (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).'
            } else if (msg.includes('Invalid login credentials')) {
              msg = 'Invalid email or password. Please try again.'
            } else if (msg.includes('email not confirmed')) {
              msg = 'Please confirm your email address before signing in. Check your inbox.'
            } else if (msg.includes('Too many requests')) {
              msg = 'Too many attempts. Please wait a moment and try again.'
            }
            setError(msg)
            return
          }

          // Successful sign in — clear intent and redirect
          clearStoredIntent()
          navigate(resolvedRedirect, { replace: true })
          return
        }

        // Sign up
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (signUpError) {
          let msg = signUpError.message
          if (msg.includes('Failed to fetch')) {
            msg = 'Cannot connect to the server. Please check your Supabase configuration (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).'
          } else if (msg.includes('User already registered')) {
            msg = 'An account with this email already exists. Please sign in instead.'
          } else if (msg.includes('Too many requests')) {
            msg = 'Too many sign-up attempts. Please wait a moment and try again.'
          } else if (msg.includes('Password should be at least')) {
            msg = 'Password must be at least 6 characters.'
          }
          setError(msg)
          return
        }

        if (data.session) {
          // Auto-confirmed (email confirmations off)
          clearStoredIntent()
          navigate(resolvedRedirect, { replace: true })
          return
        }

        // Email confirmation required
        setMode('signin')
        setEmail('')
        setPassword('')
        setFullName('')
        setSuccess(
          'Account created! Please check your email to confirm your account, then sign in.',
        )
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong.'
        setError(
          msg.includes('Failed to fetch')
            ? 'Cannot connect to the server. Please check your Supabase configuration (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).'
            : msg,
        )
      } finally {
        setSubmitting(false)
      }
    },
    [email, password, fullName, mode, submitting, resolvedRedirect, navigate],
  )

  const handleGoogleSignIn = async () => {
    setError(null)
    try {
      await signInWithGoogle()
      // OAuth redirects to /auth/callback, which handles the redirect
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Google sign-in failed. Please try again.',
      )
    }
  }

  const handleForgotPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!resetEmail.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setResetSubmitting(true)
    setError(null)
    try {
      await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      setSuccess(
        'If an account exists for this email, you will receive a password reset link.',
      )
      setResetEmail('')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not send reset email. Please try again.',
      )
    } finally {
      setResetSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 disabled:opacity-50 disabled:pointer-events-none'

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#141414] p-12 lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,black,transparent)]"
        />
        <div className="relative z-10">
          <Logo className="" inverted={true} />
        </div>
        <div className="relative z-10 mt-12">
          <blockquote className="max-w-md text-xl font-bold leading-snug tracking-tight text-[#F6F3ED]">
            &ldquo;I sent 40 emails from the HR list and got nine responses.
            Nothing else I tried came close.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm font-semibold text-[#A8A29E]">
            Daniel Kim · Senior Software Engineer
          </p>
        </div>
        <div className="relative z-10 mt-10 flex gap-8 text-sm">
          <div>
            <p className="text-3xl font-extrabold tracking-tight text-[#F6F3ED]">
              8,400+
            </p>
            <p className="mt-1 font-medium text-gray-400">products sold</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold tracking-tight text-[#F6F3ED]">
              4.8/5
            </p>
            <p className="mt-1 font-medium text-gray-400">average rating</p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 bg-[#F6F3ED]">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Logo inverted={true} />
          </div>

          {/* Buy-now banner */}
          {showBuyBanner && buyIntent && (
            <div
              className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              role="status"
            >
              Sign in to continue your purchase of{' '}
              <span className="font-semibold">{buyIntent.productId}</span>
              &mdash; ₹{buyIntent.price.toLocaleString()}
            </div>
          )}

          <h1 className="text-3xl font-extrabold tracking-tight text-[#141414] mb-1">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-2 text-sm text-[#5C5750]">
            {mode === 'signin'
              ? 'Sign in to view your purchases and download updates.'
              : 'Buy once, and your downloads live here forever.'}
          </p>

          <div
            role="tablist"
            aria-label="Sign in or sign up"
            className="mt-6 grid grid-cols-2 gap-1 rounded-lg border border-gray-200 bg-white p-1"
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
                    ? 'bg-[#141414] text-[#F6F3ED] shadow-sm'
                    : 'text-[#5C5750] hover:text-[#141414]'
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
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/reset-password')
                    }}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700"
                  >
                    Forgot password?
                  </button>
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
              <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
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

          {/* Google sign-in divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold text-gray-400">
              <span className="px-2 bg-[#F6F3ED]">Continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className="mt-4 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center text-[10px] font-bold">
                G
              </span>
              Continue with Google
            </span>
          </button>

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
        </div>
      </div>
    </div>
  )
}