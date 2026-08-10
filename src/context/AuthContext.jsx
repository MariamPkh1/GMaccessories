import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// Sign-in is Google/Facebook only. Email one-time codes were removed
// deliberately: Supabase's built-in mailer allows only a couple of messages per
// hour project-wide, so email login failed silently for real traffic, and
// lifting that ceiling would have required paying for a domain to send from.
// OAuth has no such limit and no outbound mail at all.
//
// Maps Supabase error codes to i18n keys rather than to finished sentences: this
// context has no business knowing which language the user reads, so the caller
// translates.
const AUTH_ERROR_KEYS = {
  over_request_rate_limit: 'auth.error.rateLimit',
  provider_disabled: 'auth.error.providerDisabled',
}

function errorKey(error) {
  return AUTH_ERROR_KEYS[error?.code] || 'auth.error.generic'
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoginOpen, setLoginOpen] = useState(false)

  const loadProfile = async (userId) => {
    if (!userId) {
      setProfile(null)
      return
    }
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (error) {
      setProfile(null)
      return
    }
    setProfile(data)
  }

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session)
      await loadProfile(data.session?.user?.id)
      setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      await loadProfile(newSession?.user?.id)
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const openLogin = () => setLoginOpen(true)
  const closeLogin = () => setLoginOpen(false)

  const oauthSignIn = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    })
    if (error) return { ok: false, errorKey: errorKey(error) }
    return { ok: true }
  }

  const signOut = () => supabase.auth.signOut()

  const value = {
    user: session?.user || null,
    profile,
    loading,
    isLoginOpen,
    openLogin,
    closeLogin,
    oauthSignIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
