import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'

// Google/Facebook only. There are deliberately no separate "log in" and
// "register" tabs: with OAuth both do exactly the same thing -- the provider
// creates the account on first use and signs the person in on every later use
// -- so two tabs would have been two identical buttons.
export default function AuthModal() {
  const { isLoginOpen, closeLogin, oauthSignIn } = useAuth()
  const t = useT()
  // Stored as an i18n key, not a sentence, so the message re-renders in the new
  // language if the visitor switches locale while the error is on screen.
  const [errorKey, setErrorKey] = useState('')
  // Set once a provider is chosen. The browser is about to navigate away, so
  // this exists to stop a second click firing another redirect mid-flight.
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (isLoginOpen) {
      setErrorKey('')
      setBusy(false)
    }
  }, [isLoginOpen])

  useEffect(() => {
    if (!isLoginOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeLogin()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isLoginOpen, closeLogin])

  if (!isLoginOpen) return null

  const handleOAuth = async (provider) => {
    setErrorKey('')
    setBusy(true)
    const res = await oauthSignIn(provider)
    // On success the page redirects, so only a failure ever gets this far.
    if (!res.ok) {
      setErrorKey(res.errorKey)
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeLogin()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md bg-white border border-outline-variant rounded shadow-lg p-6 pt-14"
        style={{ animation: 'modalIn 200ms cubic-bezier(0.23, 1, 0.32, 1) both' }}
      >
        <button
          onClick={closeLogin}
          aria-label={t('common.close')}
          className="absolute top-3 right-3 z-10 p-1.5 rounded text-error hover:bg-error-container transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        <div className="text-center mb-6">
          <h2 id="auth-modal-title" className="font-headline-lg text-xl text-on-surface">
            {t('auth.title')}
          </h2>
          <p className="text-sm text-secondary mt-2">{t('auth.subtitle')}</p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            disabled={busy}
            className="w-full flex items-center justify-center gap-3 border border-outline-variant rounded py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">travel_explore</span>
            {t('auth.continueGoogle')}
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('facebook')}
            disabled={busy}
            className="w-full flex items-center justify-center gap-3 border border-outline-variant rounded py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">public</span>
            {t('auth.continueFacebook')}
          </button>
        </div>

        {busy && <p className="text-secondary text-xs text-center mt-4">{t('common.loading')}</p>}
        {errorKey && <p className="text-error text-xs text-center mt-4">{t(errorKey)}</p>}

        <p className="text-xs text-secondary text-center mt-6 leading-relaxed">
          {t('auth.consent')}{' '}
          <a
            href="/privacy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            {t('auth.privacyPolicy')}
          </a>
        </p>
      </div>
    </div>
  )
}
