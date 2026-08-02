import { useState } from 'react'
import SearchBox from '../components/SearchBox'
import AccountMenu from '../components/AccountMenu'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../store'

// Served from /public — bundled with the site so there's no dependency on an
// external host (the originals were expiring signed CloudFront URLs).
const HERO_IMG = "/images/hero-automotive.webp"
const ABOUT_IMG = "/images/about-section.webp"

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

function Navbar({ onOpenMobile }) {
  const { user } = useAuth()
  const { cartCount, favoriteItems } = useStore()
  const navLinks = user ? [...PUBLIC_LINKS, ...AUTH_LINKS] : PUBLIC_LINKS
  const favCount = favoriteItems.length
  return (
    <nav className="fixed top-0 left-0 w-full z-[60] bg-white/95 backdrop-blur-md border-b border-outline-variant px-container-padding h-16 flex justify-between items-center transition-all duration-300">
      <div className="flex items-center">
        <a href="#/" className="font-headline-lg text-on-surface tracking-tight text-[24px]">
          G&M აქსესუარები
        </a>
      </div>
      <div className="hidden md:flex items-center gap-8">
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
        <button
          className="md:hidden p-2 material-symbols-outlined text-on-surface"
          onClick={onOpenMobile}
        >
          menu
        </button>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative w-full h-[85vh] min-h-[500px] flex items-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img className="w-full h-full object-cover" src={HERO_IMG} alt="G&M აქსესუარები" />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 w-full px-container-padding pb-24 md:pb-32">
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
      <div className="relative overflow-hidden rounded order-2 md:order-1">
        <img
          className="w-full h-[350px] md:h-[450px] object-cover"
          src={ABOUT_IMG}
          alt="G&M showroom"
        />
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

function Footer() {
  const socials = ["Facebook", "Instagram", "TikTok", "YouTube"]
  return (
    <footer className="mt-auto w-full py-8 bg-white border-t border-outline-variant">
      <div className="flex flex-col md:flex-row justify-between items-center px-container-padding w-full gap-8">
        <div className="flex flex-col items-center md:items-start gap-1">
          <h4 className="font-headline-lg text-base text-on-surface">
            G&M აქსესუარები
          </h4>
          <p className="font-label-sm text-label-sm normal-case tracking-normal text-on-surface-variant">
            © {new Date().getFullYear()} G&M აქსესუარები. ყველა უფლება დაცულია.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {socials.map((s) => (
            <a
              key={s}
              className="font-label-sm text-label-sm normal-case tracking-normal text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              {s}
            </a>
          ))}
        </div>
        <a
          className="font-label-sm text-label-sm normal-case tracking-normal text-on-surface hover:text-primary transition-colors"
          href="tel:557783549"
        >
          557 78 35 49
        </a>
      </div>
    </footer>
  )
}

function MobileNav({ open, onClose }) {
  const { user, openLogin, signOut } = useAuth()
  const items = user ? [...PUBLIC_LINKS, ...AUTH_LINKS] : PUBLIC_LINKS
  return (
    <div
      className={`fixed inset-0 bg-white z-[70] flex flex-col p-10 transition-transform duration-300 md:hidden ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-end mb-12">
        <button className="material-symbols-outlined" onClick={onClose}>
          close
        </button>
      </div>
      <nav className="space-y-8 flex flex-col items-center">
        {items.map((item, i) => (
          <a
            key={item.label}
            className={`font-headline-lg text-2xl ${i === 0 ? "text-primary" : "text-on-surface"}`}
            href={item.href}
            onClick={onClose}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="mt-auto text-center">
        {user ? (
          <button
            onClick={() => {
              signOut()
              onClose()
            }}
            className="bg-primary text-on-primary w-full py-3 rounded font-button-text"
          >
            გასვლა
          </button>
        ) : (
          <button
            onClick={() => {
              openLogin()
              onClose()
            }}
            className="bg-primary text-on-primary w-full py-3 rounded font-button-text"
          >
            შესვლა
          </button>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <>
      <main className="min-h-screen flex flex-col">
        <Navbar onOpenMobile={() => setMobileOpen(true)} />
        <Hero />
        <About />
        <Faq />
        <Footer />
      </main>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
