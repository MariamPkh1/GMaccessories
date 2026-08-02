import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

const AUTH_ERRORS = {
  'Token has expired or is invalid': 'კოდი არასწორია ან ვადა გაუვიდა. სცადეთ თავიდან.',
  'Signups not allowed for otp': 'რეგისტრაცია დროებით გამორთულია.',
}

const AUTH_ERROR_CODES = {
  // Supabase's built-in (no custom SMTP) mailer allows only a handful of
  // emails per hour, project-wide — easy to hit while testing. A custom SMTP
  // provider removes this ceiling.
  over_email_send_rate_limit:
    'ბევრი მცდელობა მოხდა მოკლე დროში — ელ. ფოსტის გაგზავნის ლიმიტი ამოიწურა. სცადეთ რამდენიმე წუთში.',
  over_request_rate_limit: 'ბევრი მცდელობა მოხდა მოკლე დროში. სცადეთ მოგვიანებით.',
}

function translateError(error) {
  return (
    AUTH_ERROR_CODES[error?.code] ||
    AUTH_ERRORS[error?.message] ||
    'დაფიქსირდა შეცდომა. სცადეთ მოგვიანებით.'
  )
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoginOpen, setLoginOpen] = useState(false)
  const [pendingEmail, setPendingEmail] = useState(null)

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
  const closeLogin = () => {
    setLoginOpen(false)
    setPendingEmail(null)
  }

  const sendCode = async ({ email, fullName }) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { data: { full_name: fullName || null } },
    })
    if (error) return { ok: false, error: translateError(error) }
    setPendingEmail(email)
    return { ok: true }
  }

  const verifyCode = async ({ code }) => {
    if (!pendingEmail) return { ok: false, error: 'ჯერ გამოგზავნეთ კოდი.' }

    // Supabase issues a different token *type* depending on whether the
    // account has been confirmed yet:
    //   - brand new / unconfirmed account -> "signup" token
    //   - existing confirmed account      -> "email" token
    // The client has to name the type up front, and the wrong one fails with
    // a generic "Token has expired or is invalid". Since the same 6-digit
    // code is entered in both cases, try the common one first and fall back
    // to the other rather than making the user guess why login broke.
    let error = null
    for (const type of ['email', 'signup']) {
      const res = await supabase.auth.verifyOtp({ email: pendingEmail, token: code, type })
      if (!res.error) {
        setPendingEmail(null)
        setLoginOpen(false)
        return { ok: true }
      }
      error = res.error
    }
    return { ok: false, error: translateError(error) }
  }

  const oauthSignIn = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    })
    if (error) return { ok: false, error: translateError(error) }
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
    sendCode,
    verifyCode,
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
