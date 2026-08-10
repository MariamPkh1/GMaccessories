import { useState } from 'react'
import { useStore } from '../store'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'
import SearchBox from './SearchBox'
import AccountMenu from './AccountMenu'
import MobileMenu from './MobileMenu'

// Shared sticky top navigation used by the Catalog, Product, Cart and Favorites pages.
// Favorites/cart/orders are auth-gated routes, so there's no point showing
// them to a logged-out visitor — clicking them would just bounce back with a
// login prompt. They appear once the user is signed in.
//
// Each link carries a stable `id` alongside its translation key. The active link
// used to be found by comparing display text, which broke the moment the label
// could be Georgian *or* English -- nothing would highlight in the other
// language. Pages now pass an id instead.
const PUBLIC_LINKS = [
  { id: 'home', labelKey: 'nav.home', href: '#/' },
  { id: 'catalog', labelKey: 'nav.catalog', href: '#/catalog' },
]
const AUTH_LINKS = [
  { id: 'favorites', labelKey: 'nav.favorites', href: '#/favorites' },
  { id: 'cart', labelKey: 'nav.cart', href: '#/cart' },
  { id: 'orders', labelKey: 'nav.orders', href: '#/orders' },
]

export default function SiteNav({ active = 'catalog' }) {
  const { cartCount, favoriteItems } = useStore()
  const { user } = useAuth()
  const t = useT()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navLinks = user ? [...PUBLIC_LINKS, ...AUTH_LINKS] : PUBLIC_LINKS
  const favCount = favoriteItems.length
  return (
    <header className="sticky top-0 w-full bg-white/95 backdrop-blur-md border-b border-outline-variant z-50">
      <nav className="w-full px-6 md:px-container-padding h-16 flex items-center justify-between gap-6">
        <a href="#/" className="flex flex-col flex-shrink-0">
          {/* Matches Home's navbar: at 24px the name wrapped to two lines on a
              375px screen and overflowed the 64px-tall header. */}
          <h1 className="font-headline-lg text-[17px] sm:text-[24px] text-on-surface tracking-tight whitespace-nowrap">
            {t('brand.name')}
          </h1>
        </a>
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                className={`nav-link text-sm font-medium transition-colors ${
                  link.id === active ? 'active text-primary' : 'text-on-surface hover:text-primary'
                }`}
                href={link.href}
              >
                {t(link.labelKey)}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <SearchBox />
          <AccountMenu />
          {user && (
            <>
              <a
                href="#/favorites"
                className="relative p-2 text-on-surface hover:text-primary transition-colors"
                aria-label={t('nav.favorites')}
              >
                <span className="material-symbols-outlined">favorite</span>
                {favCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-primary text-on-primary text-[10px] w-4 h-4 rounded flex items-center justify-center font-bold">
                    {favCount}
                  </span>
                )}
              </a>
              <a
                href="#/cart"
                className="relative p-2 text-on-surface hover:text-primary transition-colors"
                aria-label={t('nav.cart')}
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-primary text-on-primary text-[10px] w-4 h-4 rounded flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </a>
            </>
          )}
          {/* Icon lives in a child span: putting `material-symbols-outlined`
              on the button itself would override `lg:hidden`'s display:none. */}
          <button
            className="lg:hidden p-2 text-on-surface"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={t('common.menu')}
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
