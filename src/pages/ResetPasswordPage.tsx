import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Mail, ArrowLeft } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { Button } from '../components/Button'

// Security: validate internal redirect paths
function isSafeRedirect(path: string | null): boolean {
  if (!path || !path.startsWith('/')) return false
  if (path.startsWith('//')) return false
  if (/^https?:\/\//i.test(path)) return false
  return true
}

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect')
  const safeRedirect = isSafeRedirect(redirect) ? redirect : '/dashboard'

  // If we have a code, we're in the reset step
  useEffect(() => {
    if (code) {
      setStep('reset')
    }
  }, [code])

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      setSuccess(
        'If an account exists for this email, you will receive a password reset link.',
      )
      setEmail('')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not send reset email. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) {
      setError('Invalid or expired reset link.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })
      if (updateError) throw updateError
      setStep('success')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not reset password. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 disabled:opacity-50 disabled:pointer-events-none'

  if (step === 'success') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm max-w-md">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Password reset</h2>
          <p className="mt-2 text-sm text-gray-500">
            Your password has been reset. You can now sign in with your new password.
          </p>
          <Button
            to="/auth"
            variant="primary"
            size="sm"
            className="mt-6 w-full"
            onClick={() => navigate(safeRedirect, { replace: true })}
          >
            Go to {safeRedirect === '/dashboard' ? 'My purchases' : 'Home'}
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'request') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Forgot password?</h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter your email and we'll send you a reset link.
          </p>
          <form onSubmit={handleRequestReset} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="reset-email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
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
              {submitting ? <Loader2 className="size-4 animate-spin" /> : 'Send reset link'}
            </Button>
          </form>
          <p className="mt-6 text-sm text-gray-500">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => navigate('/auth', { replace: true })}
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    )
  }

  // step === 'reset'
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm max-w-md">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/auth', { replace: true })}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="size-4" /> Back to sign in
          </button>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Reset your password</h2>
        <p className="mt-2 text-sm text-gray-500">
          Enter your new password below.
        </p>
        <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="new-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
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
          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>
          {error ? (
            <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
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
            ) : (
              'Reset password'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}