import { useState } from 'react'
import SearchBox from '../components/SearchBox'
import AccountMenu from '../components/AccountMenu'
import MobileMenu from '../components/MobileMenu'
import ABOUT_IMG from '../assets/newlogo.jpg'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../store'
import Footer from '../components/Footer'

// Hero is served from /public. The about image is imported from src/assets so
// Vite fingerprints it for cache-busting.
const HERO_IMG = "/images/hero-automotive.webp"

// Favorites/cart/orders are auth-gated, so they only show up once the user
// is signed in — no point advertising links that just bounce back to login.
const PUBLIC_LINKS = [
  { label: "მთავარი", href: "#/" },
  { label: "კატალოგი", href: "#/catalog" },
]
const AUTH_LINKS = [
  { label: "ფავორიტები", href: "#/favorites" },
  { label: "კალათა", href: "#/cart" },
  { label: "ჩემი შეკვეთები", href: "#/orders" },
]

const FAQ = [
  {
    q: "როგორ ხდება შეკვეთა?",
    a: "შეკვეთის გაფორმება შეგიძლიათ როგორც საიტის, ასევე ჩვენი სოციალური ქსელების ან ტელეფონის საშუალებით. ჩვენი გუნდი დაგეხმარებათ სასურველი ნივთის შერჩევაში.",
  },
  {
    q: "რამდენ ხანში ჩამოვა ნივთი?",
    a: "ადგილობრივი მარაგების შემთხვევაში მიწოდება ხდება 24 საათში. საზღვარგარეთიდან შეკვეთისას ტრანსპორტირების დრო ინდივიდუალურია და შეადგენს საშუალოდ 7-14 სამუშაო დღეს.",
  },
  {
    q: "როგორ დავუკავშირდე მაღაზიას?",
    a: "ჩვენთან დაკავშირება შეგიძლიათ ნომერზე: 557 78 35 49, ან სოციალური ქსელების (FB, IG) მეშვეობით.",
  },
  {
    q: "შემიძლია თუ არა პროდუქტის დათვალიერება ონლაინ ჩატით?",
    a: "დიახ, ჩვენ გთავაზობთ ვიდეო კონსულტაციას, სადაც დეტალურად გაჩვენებთ თქვენთვის სასურველი პროდუქტის ხარისხსა და მახასიათებლებს.",
  },
]

function Navbar() {
  const { user } = useAuth()
  const { cartCount, favoriteItems } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navLinks = user ? [...PUBLIC_LINKS, ...AUTH_LINKS] : PUBLIC_LINKS
  const favCount = favoriteItems.length
  return (
    <header className="fixed top-0 left-0 w-full z-[60] bg-white/95 backdrop-blur-md border-b border-outline-variant transition-all duration-300">
    <nav className="px-container-padding h-16 flex justify-between items-center">
      <div className="flex items-center">
        <a href="#/" className="font-headline-lg text-on-surface tracking-tight text-[24px]">
          G&M აქსესუარები
        </a>
      </div>
      <div className="hidden lg:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.label}
            className={`nav-link text-sm font-medium transition-colors ${
              link.label === "მთავარი" ? "active text-primary" : "text-on-surface hover:text-primary"
            }`}
            href={link.href}
          >
            {link.label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <SearchBox />
        <AccountMenu />
        {user && (
          <>
            <a
              href="#/favorites"
              className="relative p-2 text-on-surface hover:text-primary transition-colors"
              aria-label="ფავორიტები"
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
              aria-label="კალათა"
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
    <section className="relative w-full h-hero flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img className="w-full h-full object-cover" src={HERO_IMG} alt="G&M აქსესუარები" />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      {/* pt-16 offsets the fixed nav that overlays the top of the hero, so the
          text is optically centred in the *visible* area rather than sitting
          slightly low. */}
      <div className="relative z-10 w-full px-container-padding pt-16">
        <div className="max-w-2xl">
          <h2 className="font-display-lg text-display-lg text-white mb-4 leading-none">
            G&M აქსესუარები
          </h2>
          <p className="font-body-md text-body-md text-white/80 mb-8 leading-relaxed">
            ხარისხიანი ავტოაქსესუარები, სანდო მომსახურებით. აღმოაჩინეთ პრემიუმ
            კლასის დეტალები თქვენი ავტომობილისთვის.
          </p>
          <a
            className="inline-block bg-primary text-on-primary font-button-text text-button-text px-8 py-3 rounded transition-opacity hover:opacity-90"
            href="#/catalog"
          >
            კატალოგის ნახვა
          </a>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="py-24 md:py-32 px-container-padding w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
      {/* The logo is square (2024x2024), so the frame is square too — then
          object-cover fills it exactly with no cropping and no dead space.
          Width is capped so it doesn't balloon on wide screens. */}
      {/* Centred within its own grid column on desktop — left-aligned it hugged
          the page edge and left a large void before the text. Mobile keeps the
          base `justify-center`, so it's unaffected. */}
      <div className="order-2 md:order-1 flex justify-center">
        <div className="relative w-full max-w-[420px] aspect-square overflow-hidden rounded border border-outline-variant">
          <img
            className="w-full h-full object-cover"
            src={ABOUT_IMG}
            alt="G&M აქსესუარები"
          />
        </div>
      </div>
      <div className="order-1 md:order-2">
        <span className="font-label-sm text-label-sm text-secondary block mb-3">
          ჩვენს შესახებ
        </span>
        <h3 className="font-headline-lg text-3xl md:text-4xl text-on-surface leading-tight mb-6">
          ავტოინდუსტრიის დახვეწილობა და უმაღლესი ხარისხი
        </h3>
        <div className="space-y-4 text-on-surface/70 max-w-md">
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

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-outline-variant">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-base font-semibold text-on-surface pr-4">{item.q}</span>
        <span
          className={`material-symbols-outlined text-on-surface-variant shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-200"
        style={{ maxHeight: isOpen ? "300px" : "0", opacity: isOpen ? 1 : 0 }}
      >
        <p className="pb-5 text-sm text-on-surface/70 leading-relaxed">{item.a}</p>
      </div>
    </div>
  )
}

function Faq() {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <section className="py-24 md:py-32 px-container-padding bg-surface-container-low w-full">
      <div className="max-w-3xl mx-auto">
        <span className="font-label-sm text-label-sm text-secondary block mb-3">FAQ</span>
        <h3 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-12">
          ხშირად დასმული კითხვები
        </h3>
        <div className="border-t border-outline-variant">
          {FAQ.map((item, i) => (
            <AccordionItem
              key={item.q}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <Hero />
        <About />
        <Faq />
        <Footer />
      </main>
    </>
  )
}
