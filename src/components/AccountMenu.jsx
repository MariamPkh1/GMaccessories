import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

// Shared account control used by both the landing navbar and SiteNav.
// `variant="dark"` is for the navy home header — light text on the dark bar.
export default function AccountMenu({ variant = 'light' }) {
  const { user, profile, loading, openLogin, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const dark = variant === 'dark'

  if (loading) {
    return (
      <span className={`material-symbols-outlined ${dark ? 'text-white/70' : 'text-on-surface-variant'}`}>
        person
      </span>
    )
  }

  if (!user) {
    return (
      <button
        onClick={openLogin}
        className={`font-label-sm text-label-sm normal-case tracking-normal px-3 py-1.5 rounded transition-colors flex items-center gap-2 ${
          dark
            ? 'text-white border border-white/30 hover:border-white hover:bg-white/10'
            : 'text-on-surface border border-outline-variant hover:border-primary hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">person</span>
        <span className="hidden sm:inline">შესვლა</span>
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 transition-colors ${
          dark ? 'text-white hover:text-white/90' : 'text-on-surface hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          account_circle
        </span>
        <span className="hidden sm:inline font-label-sm text-label-sm">{profile?.full_name}</span>
      </button>
      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-52 bg-white border border-outline-variant shadow-lg z-[80]"
          onMouseLeave={() => setOpen(false)}
        >
          <a
            href="#/orders"
            className="block px-4 py-3 font-label-sm text-label-sm text-on-surface hover:bg-surface-container-low transition-colors"
          >
            ჩემი შეკვეთები
          </a>
          {profile?.is_admin && (
            <a
              href="#/admin/products"
              className="block px-4 py-3 font-label-sm text-label-sm text-on-surface hover:bg-surface-container-low transition-colors"
            >
              ადმინ პანელი
            </a>
          )}
          <button
            onClick={() => {
              signOut()
              setOpen(false)
            }}
            className="w-full text-left px-4 py-3 font-label-sm text-label-sm text-error hover:bg-surface-container-low transition-colors"
          >
            გასვლა
          </button>
        </div>
      )}
    </div>
  )
}
