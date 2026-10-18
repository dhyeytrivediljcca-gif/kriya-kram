import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { authConfigured, supabase } from './supabase'

type AuthFailure = 'configuration' | 'invalidCredentials' | 'network' | 'serviceUnavailable'
type AuthResult = { success: true } | { success: false; reason: AuthFailure }

interface AuthContextValue {
  session: Session | null
  initializing: boolean
  sessionExpired: boolean
  startupIssue: 'network' | 'sessionExpired' | null
  configured: boolean
  signIn: (username: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function isNetworkFailure(error: unknown) {
  if (!navigator.onLine) return true
  if (!(error instanceof Error)) return false
  if ('context' in error && error.context instanceof Response && error.context.status >= 500) return true
  return error.name.toLowerCase().includes('fetch') || /fetch|network|timeout|connection/i.test(error.message)
}

function getSignInFailure(error: unknown): AuthFailure {
  if (error && typeof error === 'object' && 'context' in error && error.context instanceof Response) {
    if (error.context.status === 404 || error.context.status >= 500) return 'serviceUnavailable'
  }
  return isNetworkFailure(error) ? 'network' : 'invalidCredentials'
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

  const signIn = useCallback(async (username: string, password: string): Promise<AuthResult> => {
    if (!authConfigured || !supabase) return { success: false, reason: 'configuration' }
    if (!navigator.onLine) return { success: false, reason: 'network' }

    try {
      const { data, error } = await supabase.functions.invoke<{
        access_token: string
        refresh_token: string
      }>('username-login', {
        body: { username, password }
      })
      if (error || !data?.access_token || !data.refresh_token) {
        return { success: false, reason: error ? getSignInFailure(error) : 'invalidCredentials' }
      }
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token
      })
      if (sessionError || !sessionData.session) {
        return { success: false, reason: sessionError && isNetworkFailure(sessionError) ? 'network' : 'invalidCredentials' }
      }

      updateSession(sessionData.session)
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
