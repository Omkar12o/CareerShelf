import { useCallback, useEffect, useState } from 'react'
import type { ReactNode, Session, User } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { AuthContext, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    // 1. Restore existing session first (critical: prevents redirecting logged-in users)
    const restoreSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (!active) return
        setSession(data.session ?? null)
        setUser(data.session?.user ?? null)
      } catch (err) {
        console.error('Failed to restore session:', err)
      } finally {
        if (active) setLoading(false)
      }
    }

    restoreSession()

    // 2. Listen for auth state changes
    const { data: authData } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return
        setSession(session ?? null)
        setUser(session?.user ?? null)
        // Only stop loading after we've received a state change
        if (loading) setLoading(false)
      },
    )

    return () => {
      active = false
      authData.subscription.unsubscribe()
    }
  }, [loading])

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    },
    [],
  )

  const signUp = useCallback(
    async (email: string, password: string, fullName?: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName ?? '' },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    },
    [],
  )

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }, [])

  const resetPassword = useCallback(
    async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
    },
    [],
  )

  const value: AuthContextValue = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}