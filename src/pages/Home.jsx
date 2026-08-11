import { useState } from 'react'
import AccountMenu from '../components/AccountMenu'
import MobileMenu from '../components/MobileMenu'
import CategoryStrip from '../components/CategoryStrip'
import ABOUT_IMG from '../assets/newlogo.jpg'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../store'
import Footer from '../components/Footer'

// Hero is served from /public. The about image is imported from src/assets so
// Vite fingerprints it for cache-busting.
const HERO_IMG = '/images/hero-automotive.webp'

const BRAND = 'G&M აქსესუარები'

// Favorites/cart/orders are auth-gated, so they only show up once the user
// is signed in — no point advertising links that just bounce back to login.
//
// Shape matches SiteNav's: a stable `id` plus a label. MobileMenu is shared
// between the two navs and keys off `id`, so both must agree.
const PUBLIC_LINKS = [
  { id: 'home', label: 'მთავარი', href: '#/' },
  { id: 'catalog', label: 'კატალოგი', href: '#/catalog' },
]
const AUTH_LINKS = [
  { id: 'favorites', label: 'ფავორიტები', href: '#/favorites' },
  { id: 'cart', label: 'კალათა', href: '#/cart' },
  { id: 'orders', label: 'ჩემი შეკვეთები', href: '#/orders' },
]

const HOW_STEPS = [
  {
    n: '01',
    title: 'შეკვეთა',
    body: 'აირჩიეთ პროდუქტი კატალოგიდან ან მოგვწერეთ WhatsApp-ზე / სოციალურ ქსელებში. დაგეხმარებით შერჩევაში.',
  },
  {
    n: '02',
    title: 'მოძიება',
    body: 'ადგილობრივი მარაგი — ხშირად 24 საათში. საზღვარგარეთიდან — საშუალოდ 7–14 სამუშაო დღე.',
  },
  {
    n: '03',
    title: 'მიწოდება',
    body: 'ქუთაისი და მთელი საქართველო. დეტალებისთვის დაგვიკავშირდით — ტელეფონი ან ვიდეო კონსულტაცია.',
  },
]

function Navbar() {
  const { user } = useAuth()
  const { cartCount, favoriteItems } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navLinks = user ? [...PUBLIC_LINKS, ...AUTH_LINKS] : PUBLIC_LINKS
  const favCount = favoriteItems.length
  return (
    <header className="site-nav-dark sticky top-0 w-full z-[60] bg-[#0f1a2a] shadow-[0_4px_14px_-6px_rgba(0,0,0,0.18)]">
      <nav className="w-full px-6 md:px-container-padding h-[72px] flex items-center justify-between gap-6">
        <a
          href="#/"
          className="font-headline-lg text-white tracking-tight text-[17px] sm:text-[24px] whitespace-nowrap shrink-0"
        >
          {BRAND}
        </a>
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                className={`nav-link text-sm font-medium transition-colors ${
                  link.id === 'home' ? 'active text-white' : 'text-white/80 hover:text-white'
                }`}
                href={link.href}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1 md:gap-2 shrink-0 text-white">
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

function Hero() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-[calc(1400px/var(--app-zoom))] mx-auto px-5 md:px-10 lg:px-14 pt-10 md:pt-14 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 lg:items-stretch">
          <div className="lg:col-span-5 flex flex-col">
            <p className="text-[11px] tracking-[0.18em] uppercase text-secondary mb-8">
              G&M · ავტოაქსესუარები
            </p>

            <h1 className="text-[42px] sm:text-[56px] md:text-[64px] font-extrabold tracking-[-0.04em] leading-[0.95] uppercase text-on-surface mb-8">
              G&M
              <br />
              აქსესუარები
            </h1>

            <p className="text-secondary text-sm md:text-base leading-relaxed max-w-sm mb-8">
              ხარისხიანი ავტოაქსესუარები, სანდო მომსახურებით. აღმოაჩინეთ პრემიუმ
              კლასის დეტალები თქვენი ავტომობილისთვის.
            </p>

            <a
              href="#/catalog"
              className="inline-flex w-fit bg-[#0f1a2a] text-white text-sm font-semibold px-7 py-3.5 hover:bg-primary transition-colors mt-auto"
            >
              კატალოგის ნახვა
            </a>
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <figure className="relative flex flex-col flex-1 h-full">
              <div className="relative flex-1 min-h-[260px] overflow-hidden bg-surface-container-low lg:min-h-0">
                <img
                  className="absolute inset-0 w-full h-full object-cover"
                  src={HERO_IMG}
                  alt={BRAND}
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-4 text-[11px] tracking-wide uppercase text-secondary shrink-0">
                <span>Premium auto · Kutaisi / Georgia</span>
                <a
                  href="#/catalog"
                  className="text-on-surface font-semibold hover:text-primary tracking-[0.12em]"
                >
                  View more →
                </a>
              </figcaption>
            </figure>
          </div>
        </div>

        <CategoryStrip />
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-container-padding w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center max-w-[calc(1400px/var(--app-zoom))] mx-auto">
      <div className="order-2 md:order-1 flex justify-center">
        <div className="relative w-full max-w-[420px] aspect-square overflow-hidden rounded border border-outline-variant">
          <img className="w-full h-full object-cover" src={ABOUT_IMG} alt={BRAND} />
        </div>
      </div>
      <div className="order-1 md:order-2">
        <span className="text-xs font-semibold tracking-wider text-secondary uppercase block mb-3">
          ჩვენს შესახებ
        </span>
        <h3 className="font-headline-lg text-3xl md:text-4xl text-on-surface tracking-tight leading-tight mb-6">
          ავტოინდუსტრიის დახვეწილობა და უმაღლესი ხარისხი
        </h3>
        <div className="space-y-4 text-secondary max-w-md text-base leading-relaxed">
          <p>
            ჩვენ გთავაზობთ მხოლოდ საუკეთესო ხარისხის ავტონაწილებსა და
            აქსესუარებს, რომლებიც შერჩეულია განსაკუთრებული ყურადღებით.
          </p>
          <p>
            ჩვენი სერვისი მოიცავს სწრაფ მოძიებასა და მიწოდებას ქუთაისსა და მთელი
            საქართველოს მასშტაბით, რაც გიზოგავთ დროსა და ენერგიას.
          </p>
          <p>
            სწრაფი და დეტალური პასუხისთვის კონკრეტული პროდუქტის შესახებ მომწერეთ
            ვაცაპზე{' '}
            <a
              href="https://wa.me/995557783549"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline whitespace-nowrap"
            >
              +995 557 78 35 49
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-surface-container-low w-full">
      <div className="max-w-[calc(1280px/var(--app-zoom))] mx-auto px-6 md:px-container-padding">
        <div className="max-w-2xl mb-12 md:mb-16">
          <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface tracking-tight">
            როგორ მუშაობს
          </h2>
          <p className="mt-3 text-secondary text-base leading-relaxed">
            შეკვეთა არის მოთხოვნა — ჩვენ ვპოულობთ და გაწვდით. სამი ნაბიჯი,
            უმეტესი კითხვა აქ იხსნება.
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 list-none p-0 m-0">
          {HOW_STEPS.map((step, i) => (
            <li
              key={step.n}
              className={i > 0 ? 'md:border-l md:border-outline-variant md:pl-12' : ''}
            >
              <span className="block text-5xl font-extrabold text-primary/15 tracking-tight mb-4 tabular-nums">
                {step.n}
              </span>
              <h3 className="text-xl font-bold text-on-surface mb-2">{step.title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <About />
      <Footer />
    </main>
  )
}
