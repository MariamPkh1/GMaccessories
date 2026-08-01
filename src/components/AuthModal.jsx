import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'

function SocialButtons({ onGoogle, onFacebook, disabled }) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onGoogle}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-3 border border-outline-variant py-3 font-button-text text-button-text text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[18px]">travel_explore</span>
        გაგრძელება Google-ით
      </button>
      <button
        type="button"
        onClick={onFacebook}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-3 border border-outline-variant py-3 font-button-text text-button-text text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
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
        className="relative w-full max-w-md bg-surface p-8 md:p-10"
      >
        <button
          onClick={closeLogin}
          aria-label="დახურვა"
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex gap-8 mb-8 border-b border-outline-variant">
          <button
            type="button"
            onClick={() => {
              setTab('login')
              setStep('form')
              setError('')
            }}
            className={`pb-3 font-label-sm text-label-sm uppercase tracking-widest ${
              tab === 'login'
                ? 'text-primary font-bold border-b-2 border-primary'
                : 'text-secondary'
            }`}
          >
            შესვლა
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup')
              setStep('form')
              setError('')
            }}
            className={`pb-3 font-label-sm text-label-sm uppercase tracking-widest ${
              tab === 'signup'
                ? 'text-primary font-bold border-b-2 border-primary'
                : 'text-secondary'
            }`}
          >
            რეგისტრაცია
          </button>
        </div>

        {step === 'form' && (
          <>
            <SocialButtons
              disabled={step === 'verifying'}
              onGoogle={() => handleOAuth('google')}
              onFacebook={() => handleOAuth('facebook')}
            />
            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-outline-variant flex-grow" />
              <span className="text-secondary font-label-sm text-label-sm">ან</span>
              <div className="h-px bg-outline-variant flex-grow" />
            </div>
            <form onSubmit={handleSendCode} className="space-y-4">
              {tab === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="სახელი"
                    className="border border-outline-variant px-4 py-3 font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="გვარი"
                    className="border border-outline-variant px-4 py-3 font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ელ. ფოსტა"
                className="w-full border border-outline-variant px-4 py-3 font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {error && <p className="text-error font-label-sm text-label-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-primary-container text-on-primary-container py-3 font-button-text text-button-text hover:bg-primary transition-colors"
              >
                კოდის გაგზავნა
              </button>
            </form>
          </>
        )}

        {step === 'verifying' && (
          <div className="py-12 text-center text-secondary font-body-md">იტვირთება...</div>
        )}

        {step === 'sent' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-on-surface-variant font-body-md">
              კოდი გამოგზავნილია მისამართზე <span className="font-bold">{email}</span>
            </p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              inputMode="numeric"
              className="w-full border border-outline-variant px-4 py-3 tracking-[0.5em] text-center font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {error && <p className="text-error font-label-sm text-label-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-primary-container text-on-primary-container py-3 font-button-text text-button-text hover:bg-primary transition-colors"
            >
              დადასტურება
            </button>
            <button
              type="button"
              onClick={() => setStep('form')}
              className="w-full text-secondary font-label-sm text-label-sm hover:text-primary transition-colors"
            >
              სხვა ელ. ფოსტით სცადეთ
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
