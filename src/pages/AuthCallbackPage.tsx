import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../useAuth'

// Security: validate internal redirect paths
function isSafeRedirect(path: string | null): boolean {
  if (!path || !path.startsWith('/')) return false
  if (path.startsWith('//')) return false
  if (/^https?:\/\//i.test(path)) return false
  return true
}

function getStoredIntent(): { productId: string; tier?: string; price: number; returnTo: string } | null {
  try {
    const raw = sessionStorage.getItem('careershelf_buy_intent')
    if (!raw) return null
    const intent = JSON.parse(raw)
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

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true

    async function handleCallback() {
      try {
        // Supabase sends us to /auth/callback with ?code=... for OAuth and email confirmation
        const { error } = await supabase.auth.exchangeCodeForSession(
          searchParams.get('code') ?? '',
        )

        if (!active) return

        if (error) {
          setStatus('error')
          setMessage(error.message || 'Authentication failed.')
          return
        }

        // Clear any stored buy intent
        clearStoredIntent()

        // Determine where to redirect
        const redirectParam = searchParams.get('redirect')
        const storedIntent = getStoredIntent()
        const defaultRedirect = storedIntent?.returnTo ?? '/'
        const target = isSafeRedirect(redirectParam)
          ? redirectParam
          : defaultRedirect

        setStatus('success')
        setMessage('Welcome back! Redirecting…')

        // Small delay so user sees the success message
        setTimeout(() => {
          if (active) {
            navigate(target, { replace: true })
          }
        }, 800)
      } catch (err) {
        if (!active) return
        setStatus('error')
        setMessage(err instanceof Error ? err.message : 'Authentication failed.')
      }
    }

    void handleCallback()

    return () => {
      active = false
    }
  }, [searchParams, navigate])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="size-6 animate-spin mb-3" />
        <p className="text-sm text-gray-500">Signing you in…</p>
      </div>
    )
  }

  const isSuccess = status === 'success'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm max-w-md">
        {isSuccess ? (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Signed in</h2>
            <p className="mt-2 text-sm text-gray-500">{message}</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Sign-in failed</h2>
            <p className="mt-2 text-sm text-gray-500">{message}</p>
            <button
              onClick={() => navigate('/auth', { replace: true })}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 transition-colors"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  )
}