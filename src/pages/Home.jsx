import { useState } from 'react'
import SearchBox from '../components/SearchBox'

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDkpD-CjFQnvcnDkAOUaMjl7Ic_eZpOx21MMjMsHkP8WFggk0Hf9CuOqL1UM6wDRDrHc6nQ6H0YrPq1hMnyKHMOcwdX5NqXkKpYaXQq4fMx925FQu6gWJmyK7HiyC9exhNMeyGYhoiEO_flOsiBnrilEjBfHj8l8IDgrE_ov4a053R2J1CVVwfXMKIbV9h2T5nGo22Y7pPkZ7iVUf5oLmKTTe0s9X-nYlG95vO6hSo7Ei_30hlIsP8GwA"

const ABOUT_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAJDtBSxsHl8A-q7TaPcBJmonDkfbBxI4_Vn6Y9qywh5rNKIxy9Mu6pVeQL3FiD7zEs-BxD8HguXga05xbFWFJC5CAByOdVHQH5CODHLHtKpkOQJesstphdW6CoRBINJwvmaKErXQZYNVdgptD_Z3Ar4Fid3huRynaXFNWJsT8JOMWcZ4is-9VJEcZbgIHT8kh2B5LwnoN29Stv6PDJuvtMOZrMWd9xGhvP_psvN10MeMX7eUT5zCaE6Q"

const NAV_LINKS = [
  { label: "მთავარი", href: "#/" },
  { label: "კატალოგი", href: "#/catalog" },
  { label: "ფავორიტები", href: "#/favorites" },
  { label: "კალათა", href: "#/cart" },
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
  return (
    <nav className="fixed top-0 left-0 w-full z-[60] bg-surface/80 backdrop-blur-md border-b border-outline-variant px-container-padding py-4 flex justify-between items-center transition-all duration-300">
      <div className="flex items-center">
        <a href="#/" className="font-headline-lg text-primary tracking-tight text-[24px]">
          G&M აქსესუარები
        </a>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.label}
            className={
              i === 0
                ? "font-label-sm text-label-sm text-primary font-bold"
                : "font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
            }
            href={link.href}
          >
            {link.label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <SearchBox />
        <button className="font-button-text text-button-text text-primary hover:opacity-70 transition-opacity flex items-center gap-2">
          <span className="material-symbols-outlined">person</span>
          <span className="hidden sm:inline">შესვლა</span>
        </button>
        <button
          className="md:hidden material-symbols-outlined text-primary"
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
    <section className="relative w-full h-[870px] flex items-center justify-center px-container-padding overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center opacity-90 scale-105"
          style={{ backgroundImage: `url('${HERO_IMG}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent" />
      </div>
      <div className="relative z-10 max-w-[1800px] w-full text-left mt-16 md:mt-0">
        <h2 className="font-display-lg text-display-lg text-primary mb-4 max-w-2xl leading-none">
          G&M აქსესუარები
        </h2>
        <p className="font-body-md text-body-md text-secondary mb-10 max-w-lg">
          ხარისხიანი ავტოაქსესუარები, სანდო მომსახურებით. აღმოაჩინეთ პრემიუმ
          კლასის დეტალები თქვენი ავტომობილისთვის.
        </p>
        <a
          className="inline-block bg-primary-container text-on-primary font-button-text text-button-text px-10 py-5 hover:bg-primary transition-all duration-300"
          href="#/catalog"
        >
          კატალოგის ნახვა
        </a>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="py-stack-lg px-container-padding max-w-[1800px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
      <div className="space-y-8">
        <span className="font-label-sm text-label-sm text-outline tracking-widest block">
          ჩვენს შესახებ
        </span>
        <h3 className="font-headline-lg text-headline-lg text-primary leading-tight">
          ავტოინდუსტრიის დახვეწილობა და <br /> უმაღლესი ხარისხი.
        </h3>
        <div className="space-y-6 text-on-surface-variant max-w-md">
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
      <div className="relative h-[500px] bg-surface-container overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={ABOUT_IMG}
          alt="G&M showroom"
        />
      </div>
    </section>
  )
}

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div
      className={`accordion-item border-b border-outline-variant bg-surface p-6 cursor-pointer group transition-all${
        isOpen ? " active" : ""
      }`}
      onClick={onToggle}
    >
      <div className="flex justify-between items-center">
        <span className="font-body-md font-bold text-on-surface">{item.q}</span>
        <span className="material-symbols-outlined chevron transition-transform duration-300">
          expand_more
        </span>
      </div>
      <div className="accordion-content pt-4 text-on-surface-variant">
        {item.a}
      </div>
    </div>
  )
}

function Faq() {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <section className="py-stack-lg px-container-padding bg-surface-container-low w-full">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-16">
          <h3 className="font-headline-lg text-headline-lg text-primary">
            ხშირად დასმული კითხვები
          </h3>
          <div className="w-12 h-0.5 bg-primary mx-auto mt-4" />
        </div>
        <div className="space-y-4">
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
    <footer className="mt-auto w-full py-stack-md bg-surface border-t border-outline-variant">
      <div className="flex flex-col md:flex-row justify-between items-center px-container-padding max-w-[1800px] mx-auto gap-8">
        <div>
          <h4 className="font-headline-lg text-headline-lg text-primary">
            G&M აქსესუარები
          </h4>
          <p className="font-label-sm text-label-sm text-secondary mt-2">
            © G&M აქსესუარები. ყველა უფლება დაცულია.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {socials.map((s) => (
            <a
              key={s}
              className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors opacity-70 hover:opacity-100"
              href="#"
            >
              {s}
            </a>
          ))}
          <a
            className="font-label-sm text-label-sm text-primary font-bold transition-colors"
            href="tel:557783549"
          >
            557 78 35 49
          </a>
        </div>
      </div>
    </footer>
  )
}

function MobileNav({ open, onClose }) {
  const items = [
    { label: "მთავარი", href: "#/" },
    { label: "კატალოგი", href: "#/catalog" },
    { label: "ფავორიტები", href: "#/favorites" },
    { label: "კალათა", href: "#/cart" },
    { label: "პროფილი", href: "#/" },
  ]
  return (
    <div
      className={`fixed inset-0 bg-surface z-[70] flex flex-col p-10 transition-transform duration-500 md:hidden ${
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
            className={`font-headline-lg text-headline-lg ${
              i === 0 ? "text-primary" : "text-secondary"
            }`}
            href={item.href}
            onClick={onClose}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="mt-auto text-center">
        <button className="bg-primary-container text-on-primary w-full py-4 font-button-text">
          შესვლა
        </button>
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
