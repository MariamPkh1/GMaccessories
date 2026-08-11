import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// Sign-in is Google/Facebook only. Email one-time codes were removed
// deliberately: Supabase's built-in mailer allows only a couple of messages per
// hour project-wide, so email login failed silently for real traffic, and
// lifting that ceiling would have required paying for a domain to send from.
// OAuth has no such limit and no outbound mail at all.
//
// Supabase surfaces a machine code; these are the two worth explaining to a
// customer. Anything else collapses to the generic message rather than leaking
// an English SDK string into a Georgian UI.
const AUTH_ERROR_MESSAGES = {
  over_request_rate_limit: 'ბევრი მცდელობა მოხდა მოკლე დროში. სცადეთ მოგვიანებით.',
  provider_disabled: 'ავტორიზაციის ეს მეთოდი დროებით მიუწვდომელია.',
}

const GENERIC_AUTH_ERROR = 'დაფიქსირდა შეცდომა. სცადეთ მოგვიანებით.'

function errorMessage(error) {
  return AUTH_ERROR_MESSAGES[error?.code] || GENERIC_AUTH_ERROR
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
    if (error) return { ok: false, error: errorMessage(error) }
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
