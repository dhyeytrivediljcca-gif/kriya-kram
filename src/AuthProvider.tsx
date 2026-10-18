import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { authConfigured, sharedAccountEmail, supabase } from './supabase'

type AuthFailure = 'configuration' | 'invalidCredentials' | 'network'
type AuthResult = { success: true } | { success: false; reason: AuthFailure }

interface AuthContextValue {
  session: Session | null
  initializing: boolean
  sessionExpired: boolean
  startupIssue: 'network' | 'sessionExpired' | null
  configured: boolean
  signIn: (password: string) => Promise<AuthResult>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function isNetworkFailure(error: unknown) {
  if (!navigator.onLine) return true
  if (!(error instanceof Error)) return false
  return error.name === 'AuthRetryableFetchError' || /fetch|network|timeout|connection/i.test(error.message)
}

function isSharedAccount(session: Session | null) {
  return Boolean(session?.user.email && session.user.email.toLowerCase() === sharedAccountEmail.toLowerCase())
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [initializing, setInitializing] = useState(true)
  const [sessionExpired, setSessionExpired] = useState(false)
  const [startupIssue, setStartupIssue] = useState<AuthContextValue['startupIssue']>(null)
  const sessionRef = useRef<Session | null>(null)
  const signingOutRef = useRef(false)

  const updateSession = useCallback((nextSession: Session | null) => {
    sessionRef.current = nextSession
    setSession(nextSession)
  }, [])

  useEffect(() => {
    const client = supabase
    if (!authConfigured || !client) {
      setInitializing(false)
      return
    }

    let active = true
    let authEventReceived = false
    const initializationFallback = window.setTimeout(() => {
      if (!active || authEventReceived) return
      updateSession(null)
      setStartupIssue(navigator.onLine ? 'sessionExpired' : 'network')
      setInitializing(false)
    }, 8000)
    const { data: { subscription } } = client.auth.onAuthStateChange((event, nextSession) => {
      authEventReceived = true
      window.clearTimeout(initializationFallback)
      const previousSession = sessionRef.current

      if (event === 'SIGNED_OUT' && previousSession && !signingOutRef.current) {
        setSessionExpired(true)
      }

      if (nextSession && !isSharedAccount(nextSession)) {
        updateSession(null)
        setSessionExpired(false)
        setStartupIssue('sessionExpired')
        setInitializing(false)
        void Promise.resolve().then(async () => {
          const { error } = await client.auth.signOut({ scope: 'local' })
          if (active && error) setStartupIssue('sessionExpired')
        }).catch(() => {
          if (active) setStartupIssue('sessionExpired')
        })
        return
      }

      updateSession(nextSession)
      setInitializing(false)
      setStartupIssue(null)
      if (nextSession) setSessionExpired(false)
    })

    void client.auth.getSession().then(({ data, error }) => {
      window.clearTimeout(initializationFallback)
      if (!active || authEventReceived) return
      if (error) {
        const networkFailure = isNetworkFailure(error)
        updateSession(null)
        setSessionExpired(!networkFailure)
        setStartupIssue(networkFailure ? 'network' : 'sessionExpired')
      } else if (data.session && !isSharedAccount(data.session)) {
        updateSession(null)
        setSessionExpired(false)
        setStartupIssue('sessionExpired')
        void client.auth.signOut({ scope: 'local' }).then(({ error: signOutError }) => {
          if (active && signOutError) setStartupIssue('sessionExpired')
        }).catch(() => {
          if (active) setStartupIssue('sessionExpired')
        })
      } else {
        updateSession(data.session)
        setStartupIssue(null)
        setSessionExpired(false)
      }
      setInitializing(false)
    }).catch(error => {
      window.clearTimeout(initializationFallback)
      if (!active || authEventReceived) return
      const networkFailure = isNetworkFailure(error)
      updateSession(null)
      setSessionExpired(!networkFailure)
      setStartupIssue(networkFailure ? 'network' : 'sessionExpired')
      setInitializing(false)
    })

    return () => {
      active = false
      window.clearTimeout(initializationFallback)
      subscription.unsubscribe()
    }
  }, [updateSession])

  const signIn = useCallback(async (password: string): Promise<AuthResult> => {
    if (!authConfigured || !supabase) return { success: false, reason: 'configuration' }
    if (!navigator.onLine) return { success: false, reason: 'network' }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sharedAccountEmail,
        password
      })
      if (error) {
        return { success: false, reason: isNetworkFailure(error) ? 'network' : 'invalidCredentials' }
      }
      if (!isSharedAccount(data.session)) {
        await supabase.auth.signOut({ scope: 'local' })
        return { success: false, reason: 'invalidCredentials' }
      }

      updateSession(data.session)
      setSessionExpired(false)
      setStartupIssue(null)
      return { success: true }
    } catch (error) {
      return { success: false, reason: isNetworkFailure(error) ? 'network' : 'invalidCredentials' }
    }
  }, [updateSession])

  const signOut = useCallback(async () => {
    if (!supabase) throw new Error('Supabase authentication is not configured')
    signingOutRef.current = true
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) throw error
      updateSession(null)
      setSessionExpired(false)
      setStartupIssue(null)
    } finally {
      signingOutRef.current = false
    }
  }, [updateSession])

  const value = useMemo(() => ({
    session,
    initializing,
    sessionExpired,
    startupIssue,
    configured: authConfigured,
    signIn,
    signOut
  }), [session, initializing, sessionExpired, startupIssue, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}
