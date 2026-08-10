import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'

// Wraps auth-gated and admin-gated routes. Admin gating checks
// profile.is_admin (never a client-set flag) and both cases wait out
// `loading` before redirecting so we don't flash a redirect mid-resolve.
export default function RouteGuard({ requireAuth = false, requireAdmin = false, children }) {
  const { user, profile, loading, openLogin } = useAuth()
  const t = useT()
  const deniedAuth = requireAuth && !user
  const deniedAdmin = requireAdmin && !profile?.is_admin

  useEffect(() => {
    if (loading) return
    if (deniedAuth) {
      window.location.hash = '#/'
      openLogin()
    } else if (deniedAdmin) {
      window.location.hash = '#/'
    }
  }, [loading, deniedAuth, deniedAdmin, openLogin])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-secondary font-body-md">
        {t('common.loading')}
      </div>
    )
  }

  if (deniedAuth || deniedAdmin) return null

  return children
}
