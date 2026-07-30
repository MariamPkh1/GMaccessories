import { useState } from 'react'
import SiteNav from '../components/SiteNav'
import { useStore } from '../store'
import { CARBON_NIGHT } from '../products'

const MAIN_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAsiiksJIKFoiQU_qcjEaf3P92Nhwk1f0ndlNFu5rkFwuVKp4-vImHmubcdgZqiFPiwoVStGBjQd_bFLSdqhF57WyvIJTX4rwfcn2l6i94UfXhKjtNTt2hPvugoKuFZP5V0O5OlvCtu6Se1xoy5caPj6NYq4B-buow6fWmX91BRTxcT3G-OX0qUyhiqfobWnG3OmSYZHejTLIUwTlmpn00ODbWdhRt_XitsNUAaitl-IartaPe4GuIlpg"

const THUMBS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDqGtehGsI-e6USNnA55CS3JR48F32X3Tl1OVuHYa7DE26YZtMpywCDGLuFI_LMfg5-dd8mPM_uq7qRjoCPKW6GDd0Wj45JWfKvmWYYvG5vSI9iJ_TkadV_WmFA_A554V3x4eobMDV-4mDRrb_rS6UtDfSbo56hnF7UuYRHTI9hYERSbSRmBKwbVRZ8MqYwmfQeSJJyffkGygSMwo3SfNOdTxsHLf5V8TPGrPwh9FF6MK0jzLfzg-K5Tg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBZLcQBukQOdYMLEX37hNvwuBUe7cF51iE6g1rKpSqzge0stOD1WKGm_HRmzwmeJj5OHHa07SVMaOzIC6qwxJGy75P_zDJdEYWJh2zH4oxZwcj_PzX6m9EIncKCoECMK0OQBvBiuyDJlnPzE1eXxp0j80r8usTTJtVZi-AnYuLyZHPi920335P_bzdYDYxkCbgp4PVeCjlYsWWoPBpg9c1zI9lztNuFq4zFgOcGuCcCx0QbtlC1rhI-MQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAl56B8DCo2Qyftf4tuopOnSvFs0UzS2LiqdEcpoczAmHqq3B-zVq8SsGGoWl3W9MWGKi1GibyozMWrLjL0EkRt4728OsxMadxGblSJR8BrCliKtl2IavzQYLXkDznn_82pXuzhjugqmtO533H2pb0T94Fx8RbN7bEAxc02IltZNb26Cwoa4gtdJReeNIN8fMW9VoTuly-p3RtVb4KJ5iOMEGp71lxvhx2zQ8KzgrZ9bqTQLVnnQEbxlQ",
]

const COLORS = ["#1A1A1A", "#2D4739", "#4A3728"]
const SIZES = ["M (38cm)", "L (40cm)"]
const SPECS = [
  "100% ნატურალური ტყავი",
  "ანტი-სლიპ ტექსტურა",
  "მარტივი ინსტალაცია",
  "UV დაცვა",
]

const RELATED = [
  {
    title: "სალონის მოვლის ნაკრები",
    price: "85.00 ₾",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPo7jRHmKVtXQJy6rW6HKYe0ha5W17-KmoHa8L7cZATsx3v5FNeM3FPZjIfWSYbayIYOMZ8ZeoWYoi6VcweKuweEKwR24slySgYo5R3lrfi2GCSfV7X4GXlvNTA3Vjvn-iLaXNTrngNCQhXFWGCtSuQLVg2G8JCRKDWcpKeMBjzrsph3QMpRuEOGsUmhLMQwA5BYUgJ7GCWLmlDqZagLw6SUSScJSGBuZx8-o1SYvwyBktVUxUWm836Q",
  },
  {
    title: 'არომატიზატორი "Elite"',
    price: "120.00 ₾",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_4lpIJiV6bKUn_KkO6_tg7r9MqQbGo7Cr5c1njtZtn6djC8Gdjwc9-nWGfwckWyv640y1A2pSFwGL63No5uHY50y_o7f4WRFt2tJuDps2hsfc6kAS4dxPFAbPZ7p-ysQxzp0Rop0nsTCYIZT4_uE06hjlGY_V-3d_zBq2jkTGM7qbjHJSaSfexft-AX8arsO5TJhC6UlaNyf8Xp2yjUu8eBSf2mPmiDCiuTMWELMfspMzlsvkx1XifQ",
  },
  {
    title: "ტყავის ნოხების კომპლექტი",
    price: "450.00 ₾",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0_CvkwghDlJBNlU2Krb-jwcTXajpsnnK6Dj2aIp4HKnKCbrseprsHlsn-SCHXASlEvuJCDXJO8vyoZiNmdaQXhJMIZC0_sMszKx84DytFqI0YLhfT8lBaS538kkRbL4NW1jVRAWGfHkDkSXcfl37IaCBWY50Eqkxf3uZHm6RPG3Gw2vcQTyCk0U9RpnRB-_Lhx2i-XnF876Je0VWD-y7V5ovtkkrT1x3YqTV-BNlhDeH87YYSy7jYQQ",
  },
  {
    title: "უსადენო დამტენი",
    price: "165.00 ₾",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCV8Hpi_TETht5UG-d7qh1QhKceLEnZly2ubuNCCRWU3w3f9T66DwgNo_vtpktyOXcFGGvtwEVU-ho3_w1d-NIbpry2rhXka4TppMIqW_Hu8QhRZgCiOf7saZefCOJm-6g-2Xrp_9Cia0nSETazLTEDTzz45YZznWlAEpcFDsLLcPbf8Kz2skhgZh8s-4M_EqkDjXFwUoDEx2CwlBQLiTEBLzIzfpelqdYDX6HQ50D7y6VTDU006JtQVA",
  },
]

function Gallery() {
  const [mainSrc, setMainSrc] = useState(MAIN_IMG)
  return (
    <div className="lg:col-span-7 grid grid-cols-6 gap-4">
      <div className="col-span-1 space-y-4">
        {THUMBS.map((thumb) => (
          <div
            key={thumb}
            onClick={() => setMainSrc(thumb)}
            className={`aspect-square bg-surface-container border border-outline-variant cursor-pointer overflow-hidden transition-opacity ${
              mainSrc === thumb
                ? "opacity-100"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <img className="w-full h-full object-cover" src={thumb} alt="" />
          </div>
        ))}
      </div>
      <div className="col-span-5 relative group">
        <div className="aspect-[4/5] bg-surface-container overflow-hidden">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src={mainSrc}
            alt='პრემიუმ ტყავის საჭის ჩიხოლი "Carbon Night"'
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-4xl">
              zoom_in
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Details() {
  const { addToCart, toggleFavorite, isFavorite } = useStore()
  const [color, setColor] = useState(0)
  const [size, setSize] = useState(0)
  const [added, setAdded] = useState(false)
  const [specsOpen, setSpecsOpen] = useState(false)
  const favorited = isFavorite(CARBON_NIGHT.id)

  const handleAddToCart = () => {
    addToCart(CARBON_NIGHT)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="lg:col-span-5 lg:sticky lg:top-28">
      <div className="border-b border-outline-variant pb-8 mb-8">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] block mb-4">
          Limited Edition
        </span>
        <h2 className="font-display-lg text-3xl md:text-headline-lg text-on-surface mb-2 leading-tight tracking-tight">
          პრემიუმ ტყავის საჭის ჩიხოლი "Carbon Night"
        </h2>
        <p className="font-body-md font-bold text-primary text-xl tracking-tight">
          245.00 ₾
        </p>
      </div>

      <div className="space-y-6 mb-12">
        <div className="flex items-center gap-4">
          <span className="font-label-sm text-label-sm text-on-surface w-24">
            ფერი:
          </span>
          <div className="flex gap-2">
            {COLORS.map((c, i) => (
              <button
                key={c}
                onClick={() => setColor(i)}
                style={{ backgroundColor: c }}
                className={`w-6 h-6 rounded-full ${
                  color === i
                    ? "ring-2 ring-primary ring-offset-2"
                    : "ring-1 ring-outline-variant"
                }`}
                aria-label={`color ${c}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-label-sm text-label-sm text-on-surface w-24">
            ზომა:
          </span>
          <div className="flex gap-3">
            {SIZES.map((s, i) => (
              <button
                key={s}
                onClick={() => setSize(i)}
                className={`font-label-sm text-label-sm px-4 py-1 border transition-colors ${
                  size === i
                    ? "border-primary text-primary"
                    : "border-outline text-secondary hover:border-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-12">
        <button
          onClick={handleAddToCart}
          className={`w-full text-on-primary font-button-text text-button-text flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] py-4 ${
            added ? "bg-primary" : "bg-primary-container hover:bg-primary"
          }`}
        >
          <span
            className={`material-symbols-outlined ${added ? "animate-spin" : ""}`}
          >
            {added ? "refresh" : "shopping_cart"}
          </span>
          {added ? "დამატებულია" : "კალათაში დამატება"}
        </button>
        <button
          onClick={() => toggleFavorite(CARBON_NIGHT)}
          className="w-full border border-outline text-on-surface font-button-text text-button-text flex items-center justify-center gap-3 hover:bg-surface-container-low transition-all duration-300 py-4"
        >
          <span
            className={`material-symbols-outlined ${favorited ? "text-error" : ""}`}
            style={{ fontVariationSettings: favorited ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
          {favorited ? "ფავორიტებშია" : "ფავორიტებში დამატება"}
        </button>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="font-label-sm text-label-sm text-on-surface uppercase tracking-widest mb-4">
            აღწერა
          </h3>
          <p className="text-on-surface-variant leading-relaxed">
            დამზადებულია უმაღლესი ხარისხის ნატურალური ტყავისგან, რომელიც
            უზრუნველყოფს მაქსიმალურ კომფორტს და გამძლეობას. "Carbon Night" სერია
            გამოირჩევა თავისი დახვეწილი დიზაინითა და ერგონომიული ფორმით. ხელნაკეთი
            ნაკერები ხაზს უსვამს თქვენი ავტომობილის ინტერიერის ექსკლუზიურობას.
          </p>
        </div>
        <div className="border-t border-outline-variant pt-6">
          <button
            onClick={() => setSpecsOpen((o) => !o)}
            className="w-full list-none flex justify-between items-center font-label-sm text-label-sm text-on-surface uppercase tracking-widest"
          >
            მახასიათებლები
            <span
              className={`material-symbols-outlined transition-transform ${
                specsOpen ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </button>
          {specsOpen && (
            <ul className="mt-4 space-y-2 text-on-surface-variant font-body-md">
              {SPECS.map((spec) => (
                <li key={spec} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full" />
                  {spec}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function RelatedCard({ item }) {
  return (
    <div className="group">
      <div className="relative aspect-[3/4] bg-surface-container overflow-hidden mb-4">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={item.img}
          alt={item.title}
        />
        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-[20px]">favorite</span>
        </button>
      </div>
      <h4 className="font-label-sm text-label-sm text-on-surface mb-1">
        {item.title}
      </h4>
      <p className="font-body-md text-primary">{item.price}</p>
    </div>
  )
}

function Footer() {
  const socials = ["Facebook", "Instagram", "TikTok", "YouTube"]
  return (
    <footer className="bg-surface border-t border-outline-variant py-12">
      <div className="max-w-[1800px] mx-auto px-6 md:px-container-padding flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-headline-lg text-3xl text-primary mb-2">G&M</span>
          <p className="font-label-sm text-label-sm text-secondary">
            © G&M აქსესუარები. ყველა უფლება დაცულია.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {socials.map((s) => (
            <a
              key={s}
              className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors uppercase tracking-widest"
              href="#"
            >
              {s}
            </a>
          ))}
        </div>
        <a
          href="tel:557783549"
          className="flex items-center gap-2 font-label-sm text-label-sm text-secondary border border-outline-variant px-6 py-3 rounded-full hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">phone</span>
          557 78 35 49
        </a>
      </div>
    </footer>
  )
}

export default function Product() {
  return (
    <>
      <SiteNav active="კატალოგი" />
      <main className="min-h-screen px-6 md:px-container-padding py-stack-lg max-w-[1800px] mx-auto">
        <nav className="mb-12 flex items-center gap-4 text-secondary font-label-sm text-label-sm overflow-x-auto whitespace-nowrap">
          <a className="hover:text-primary transition-colors" href="#/catalog">
            კატალოგი
          </a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <a className="hover:text-primary transition-colors" href="#/catalog">
            სალონის აქსესუარები
          </a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface">პრემიუმ ტყავის საჭის ჩიხოლი</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-12 mb-20">
          <Gallery />
          <Details />
        </div>

        <div className="h-px bg-outline-variant/30 w-full mb-20" />

        <section className="mb-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-3xl mb-1 tracking-tight">
                შეიძლება დაგაინტერესოთ
              </h2>
              <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
                მსგავსი პროდუქტები
              </p>
            </div>
            <a
              className="font-button-text text-button-text text-primary flex items-center gap-2 group border-b border-transparent hover:border-primary transition-all pb-1"
              href="#/catalog"
            >
              ყველას ნახვა
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {RELATED.map((item) => (
              <RelatedCard key={item.title} item={item} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
