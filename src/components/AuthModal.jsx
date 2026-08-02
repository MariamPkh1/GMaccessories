import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'

function SocialButtons({ onGoogle, onFacebook, disabled }) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onGoogle}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-3 border border-outline-variant rounded py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[18px]">travel_explore</span>
        გაგრძელება Google-ით
      </button>
      <button
        type="button"
        onClick={onFacebook}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-3 border border-outline-variant rounded py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[18px]">public</span>
        გაგრძელება Facebook-ით
      </button>
    </div>
  )
}

export default function AuthModal() {
  const { isLoginOpen, closeLogin, sendCode, verifyCode, oauthSignIn } = useAuth()
  const [tab, setTab] = useState('login') // 'login' | 'signup'
  const [step, setStep] = useState('form') // 'form' | 'sent' | 'verifying'
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const dialogRef = useRef(null)

  const reset = () => {
    setTab('login')
    setStep('form')
    setFirstName('')
    setLastName('')
    setEmail('')
    setCode('')
    setError('')
  }

  useEffect(() => {
    if (isLoginOpen) reset()
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

  const handleSendCode = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('შეიყვანეთ ელ. ფოსტა.')
      return
    }
    setError('')
    setStep('verifying')
    const res = await sendCode({ email: email.trim(), fullName: [firstName, lastName].filter(Boolean).join(' ') })
    if (!res.ok) {
      setError(res.error)
      setStep('form')
      return
    }
    setStep('sent')
  }

  const handleOAuth = async (provider) => {
    setError('')
    const res = await oauthSignIn(provider)
    if (!res.ok) setError(res.error)
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (code.trim().length !== 6) {
      setError('შეიყვანეთ 6-ნიშნა კოდი.')
      return
    }
    setError('')
    setStep('verifying')
    const res = await verifyCode({ code: code.trim() })
    if (!res.ok) {
      setError(res.error)
      setStep('sent')
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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md bg-white border border-outline-variant rounded shadow-lg p-6 pt-14"
        style={{ animation: 'modalIn 200ms cubic-bezier(0.23, 1, 0.32, 1) both' }}
      >
        {/* Sits in its own space above the tab row — the tabs are flex-1 and
            would otherwise run underneath this button and steal its clicks. */}
        <button
          onClick={closeLogin}
          aria-label="დახურვა"
          className="absolute top-3 right-3 z-10 p-1.5 rounded text-error hover:bg-error-container transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        <div className="flex border-b border-outline-variant mb-6">
          <button
            type="button"
            onClick={() => {
              setTab('login')
              setStep('form')
              setError('')
            }}
            className={`relative flex-1 pb-3 text-sm font-semibold transition-colors ${
              tab === 'login' ? 'text-on-surface' : 'text-secondary'
            }`}
          >
            შესვლა
            {tab === 'login' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup')
              setStep('form')
              setError('')
            }}
            className={`relative flex-1 pb-3 text-sm font-semibold transition-colors ${
              tab === 'signup' ? 'text-on-surface' : 'text-secondary'
            }`}
          >
            რეგისტრაცია
            {tab === 'signup' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        </div>

        {step === 'form' && (
          <>
            <SocialButtons
              disabled={step === 'verifying'}
              onGoogle={() => handleOAuth('google')}
              onFacebook={() => handleOAuth('facebook')}
            />
            <div className="flex items-center gap-3 my-4">
              <div className="h-px bg-outline-variant flex-grow" />
              <span className="text-secondary text-xs">ან</span>
              <div className="h-px bg-outline-variant flex-grow" />
            </div>
            <form onSubmit={handleSendCode} className="space-y-4">
              {tab === 'signup' && (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="სახელი"
                    className="border border-outline-variant rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="გვარი"
                    className="border border-outline-variant rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ელ. ფოსტა"
                className="w-full border border-outline-variant rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              {error && <p className="text-error text-xs">{error}</p>}
              <button
                type="submit"
                className="w-full bg-primary text-on-primary rounded px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              >
                კოდის გაგზავნა
              </button>
            </form>
          </>
        )}

        {step === 'verifying' && (
          <div className="py-12 text-center text-secondary text-sm">იტვირთება...</div>
        )}

        {step === 'sent' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-sm text-secondary text-center">
              კოდი გამოგზავნილია მისამართზე <span className="font-semibold text-on-surface">{email}</span>
            </p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="• • • • • •"
              inputMode="numeric"
              className="w-full border border-outline-variant rounded px-3 py-3 text-center text-lg tracking-[0.5em] font-mono focus:outline-none focus:border-primary transition-colors"
            />
            {error && <p className="text-error text-xs">{error}</p>}
            <button
              type="submit"
              className="w-full bg-primary text-on-primary rounded px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              დადასტურება
            </button>
            <button
              type="button"
              onClick={() => setStep('form')}
              className="w-full text-secondary text-sm hover:text-primary transition-colors"
            >
              სხვა ელ. ფოსტით სცადეთ
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
