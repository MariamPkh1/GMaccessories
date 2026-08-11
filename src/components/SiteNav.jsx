import { useState } from 'react'
import { useStore } from '../store'
import { useAuth } from '../context/AuthContext'
import AccountMenu from './AccountMenu'
import MobileMenu from './MobileMenu'

// Shared sticky top navigation used by the Catalog, Product, Cart and Favorites pages.
// Favorites/cart/orders are auth-gated routes, so there's no point showing
// them to a logged-out visitor — clicking them would just bounce back with a
// login prompt. They appear once the user is signed in.
//
// Each link carries a stable `id` alongside its label. The active link is
// matched on that id, never on the display text -- pages pass an id in, so
// rewording a label can't silently stop the highlight from appearing.
const PUBLIC_LINKS = [
  { id: 'home', label: 'მთავარი', href: '#/' },
  { id: 'catalog', label: 'კატალოგი', href: '#/catalog' },
]
const AUTH_LINKS = [
  { id: 'favorites', label: 'ფავორიტები', href: '#/favorites' },
  { id: 'cart', label: 'კალათა', href: '#/cart' },
  { id: 'orders', label: 'ჩემი შეკვეთები', href: '#/orders' },
]

export default function SiteNav({ active = 'catalog' }) {
  const { cartCount, favoriteItems } = useStore()
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navLinks = user ? [...PUBLIC_LINKS, ...AUTH_LINKS] : PUBLIC_LINKS
  const favCount = favoriteItems.length
  return (
    <header className="site-nav-dark sticky top-0 w-full bg-[#0f1a2a] z-50 shadow-[0_4px_14px_-6px_rgba(0,0,0,0.18)]">
      <nav className="w-full px-6 md:px-container-padding h-[72px] flex items-center justify-between gap-6">
        <a href="#/" className="flex flex-col flex-shrink-0">
          {/* Matches Home's navbar: at 24px the name wrapped to two lines on a
              375px screen and overflowed the 64px-tall header. */}
          <h1 className="font-headline-lg text-[17px] sm:text-[24px] text-white tracking-tight whitespace-nowrap">
            G&M აქსესუარები
          </h1>
        </a>
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                className={`nav-link text-sm font-medium transition-colors ${
                  link.id === active ? 'active text-white' : 'text-white/80 hover:text-white'
                }`}
                href={link.href}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 text-white">
          <AccountMenu variant="dark" />
          {user && (
            <>
              <a
                href="#/favorites"
                className="relative p-2 text-white/90 hover:text-white transition-colors"
                aria-label="ფავორიტები"
              >
                <span className="material-symbols-outlined">favorite</span>
                {favCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-white text-[#0f1a2a] text-[10px] w-4 h-4 rounded flex items-center justify-center font-bold">
                    {favCount}
                  </span>
                )}
              </a>
              <a
                href="#/cart"
                className="relative p-2 text-white/90 hover:text-white transition-colors"
                aria-label="კალათა"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-white text-[#0f1a2a] text-[10px] w-4 h-4 rounded flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </a>
            </>
          )}
          {/* Icon lives in a child span: putting `material-symbols-outlined`
              on the button itself would override `lg:hidden`'s display:none. */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="მენიუ"
            aria-expanded={mobileOpen}
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <MobileMenu links={navLinks} onNavigate={() => setMobileOpen(false)} />
      )}
    </header>
  )
}
