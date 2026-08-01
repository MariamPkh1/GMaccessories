import { useStore } from '../store'
import { useAuth } from '../context/AuthContext'
import SearchBox from './SearchBox'
import AccountMenu from './AccountMenu'

// Shared sticky top navigation used by the Catalog, Product, Cart and Favorites pages.
// Favorites/cart/orders are auth-gated routes, so there's no point showing
// them to a logged-out visitor — clicking them would just bounce back with a
// login prompt. They appear once the user is signed in.
const PUBLIC_LINKS = [
  { label: "მთავარი", href: "#/" },
  { label: "კატალოგი", href: "#/catalog" },
]
const AUTH_LINKS = [
  { label: "ფავორიტები", href: "#/favorites" },
  { label: "კალათა", href: "#/cart" },
  { label: "ჩემი შეკვეთები", href: "#/orders" },
]

export default function SiteNav({ active = "კატალოგი" }) {
  const { cartCount } = useStore()
  const { user } = useAuth()
  const navLinks = user ? [...PUBLIC_LINKS, ...AUTH_LINKS] : PUBLIC_LINKS
  return (
    <nav className="sticky top-0 w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant z-50">
      <div className="max-w-[1800px] mx-auto px-6 md:px-container-padding h-20 flex items-center justify-between gap-6">
        <a href="#/" className="flex flex-col flex-shrink-0">
          <h1 className="font-headline-lg text-[24px] text-primary tracking-tight">
            G&M აქსესუარები
          </h1>
        </a>
        <ul className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                className={
                  link.label === active
                    ? "text-primary font-bold border-b-2 border-primary pb-1 font-label-sm text-label-sm uppercase tracking-widest"
                    : "text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-widest"
                }
                href={link.href}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
          <SearchBox />
          <AccountMenu />
          {user && (
            <a
              href="#/cart"
              className="relative text-on-surface hover:text-primary transition-colors"
              aria-label="cart"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}
