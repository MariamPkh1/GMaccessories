import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES, catalogHref } from '../products'

// Compact dropdown panel that opens directly under the header on small
// screens. Deliberately not a full-screen overlay — it keeps the page behind
// it visible so the menu feels like part of the nav rather than a new screen.
export default function MobileMenu({ links, onNavigate }) {
  const { user, openLogin, signOut } = useAuth()
  const [catsOpen, setCatsOpen] = useState(false)
  return (
    <nav className="lg:hidden border-t border-outline-variant bg-white shadow-sm">
      <div className="px-6 py-3 flex flex-col">
        {links.map((link) =>
          // Categories are collapsed behind the catalog row so the menu doesn't
          // become a wall of links on a small screen.
          link.label === 'კატალოგი' ? (
            <div key={link.label}>
              <div className="flex items-center">
                <a
                  href={link.href}
                  onClick={onNavigate}
                  className="flex-1 text-base font-medium py-2.5 text-on-surface hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
                <button
                  onClick={() => setCatsOpen((o) => !o)}
                  aria-label="კატეგორიები"
                  aria-expanded={catsOpen}
                  className="p-2 text-secondary"
                >
                  <span
                    className={`material-symbols-outlined transition-transform ${catsOpen ? 'rotate-180' : ''}`}
                  >
                    expand_more
                  </span>
                </button>
              </div>
              {catsOpen && (
                <div className="pl-4 border-l border-outline-variant ml-1 mb-1">
                  {CATEGORIES.map((cat) => (
                    <a
                      key={cat}
                      href={catalogHref(cat)}
                      onClick={onNavigate}
                      className="block text-sm py-2 text-secondary hover:text-primary transition-colors"
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <a
              key={link.label}
              href={link.href}
              onClick={onNavigate}
              className="text-base font-medium py-2.5 text-on-surface hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ),
        )}
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
