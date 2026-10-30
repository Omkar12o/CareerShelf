import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../useAuth'

export function ProtectedRoute({
  children,
  redirectTo = '/auth',
}: {
  children: React.ReactNode
  redirectTo?: string
}) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // While loading, show a neutral state — never redirect
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  // Not authenticated: redirect to /auth with current path as redirect param
  if (!user) {
    const searchParams = new URLSearchParams()
    searchParams.set('redirect', location.pathname + location.search)
    return <Navigate to={`${redirectTo}?${searchParams.toString()}`} replace />
  }

  return <>{children}</>
}