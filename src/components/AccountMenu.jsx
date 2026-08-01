import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

// Shared account control used by both the landing navbar and SiteNav.
export default function AccountMenu() {
  const { user, profile, loading, openLogin, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  if (loading) return <span className="material-symbols-outlined text-on-surface-variant">person</span>

  if (!user) {
    return (
      <button
        onClick={openLogin}
        className="font-button-text text-button-text text-primary hover:opacity-70 transition-opacity flex items-center gap-2"
      >
        <span className="material-symbols-outlined">person</span>
        <span className="hidden sm:inline">შესვლა</span>
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors"
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
              ადმინის პანელი
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
