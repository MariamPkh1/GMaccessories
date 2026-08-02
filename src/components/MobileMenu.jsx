import { useAuth } from '../context/AuthContext'

// Compact dropdown panel that opens directly under the header on small
// screens. Deliberately not a full-screen overlay — it keeps the page behind
// it visible so the menu feels like part of the nav rather than a new screen.
export default function MobileMenu({ links, onNavigate }) {
  const { user, openLogin, signOut } = useAuth()
  return (
    <nav className="lg:hidden border-t border-outline-variant bg-white shadow-sm">
      <div className="px-6 py-3 flex flex-col">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={onNavigate}
            className="text-base font-medium py-2.5 text-on-surface hover:text-primary transition-colors"
          >
            {link.label}
          </a>
        ))}
        <div className="border-t border-outline-variant mt-2 pt-2">
          {user ? (
            <button
              onClick={() => {
                signOut()
                onNavigate()
              }}
              className="w-full text-left text-base font-medium py-2.5 text-error"
            >
              გასვლა
            </button>
          ) : (
            <button
              onClick={() => {
                openLogin()
                onNavigate()
              }}
              className="w-full text-left text-base font-medium py-2.5 text-on-surface"
            >
              შესვლა
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
