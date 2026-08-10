import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'

// Shared account control used by both the landing navbar and SiteNav.
export default function AccountMenu() {
  const { user, profile, loading, openLogin, signOut } = useAuth()
  const t = useT()
  const [open, setOpen] = useState(false)

  if (loading) return <span className="material-symbols-outlined text-on-surface-variant">person</span>

  if (!user) {
    return (
      <button
        onClick={openLogin}
        className="font-label-sm text-label-sm normal-case tracking-normal text-on-surface border border-outline-variant px-3 py-1.5 rounded transition-colors hover:border-primary hover:text-primary flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">person</span>
        <span className="hidden sm:inline">{t('account.signIn')}</span>
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
            {t('account.myOrders')}
          </a>
          {profile?.is_admin && (
            <a
              href="#/admin/products"
              className="block px-4 py-3 font-label-sm text-label-sm text-on-surface hover:bg-surface-container-low transition-colors"
            >
              {t('account.adminPanel')}
            </a>
          )}
          <button
            onClick={() => {
              signOut()
              setOpen(false)
            }}
            className="w-full text-left px-4 py-3 font-label-sm text-label-sm text-error hover:bg-surface-container-low transition-colors"
          >
            {t('account.signOut')}
          </button>
        </div>
      )}
    </div>
  )
}
