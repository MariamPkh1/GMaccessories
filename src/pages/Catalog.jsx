import { useState } from 'react'
import { PRODUCTS } from '../products'
import { useStore } from '../store'
import SiteNav from '../components/SiteNav'

const CATEGORIES = ["ყველა", "ინტერიერი", "ექსტერიერი", "ელექტრონიკა", "მოვლა"]

function CatalogHeader() {
  const [activeCat, setActiveCat] = useState("ყველა")
  return (
    <header className="mb-16">
      <h2 className="font-display-lg text-display-lg text-primary mb-4">კატალოგი</h2>
      <div className="w-full h-[1px] bg-outline-variant mb-8" />
      <nav className="mb-8 overflow-x-auto scrollbar-hide">
        <ul className="flex items-center gap-8 whitespace-nowrap">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setActiveCat(cat)}
                className={
                  activeCat === cat
                    ? "font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold border-b-2 border-primary pb-1 transition-all"
                    : "font-label-sm text-label-sm uppercase tracking-widest text-secondary hover:text-primary transition-colors"
                }
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <p className="max-w-xl text-secondary font-body-md text-body-md leading-relaxed">
          პრემიუმ კლასის ავტო-აქსესუარები თქვენი ავტომობილისთვის. ხარისხი და
          დახვეწილი დიზაინი ერთ სივრცეში.
        </p>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface px-4 py-2 hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[18px]">tune</span>
            ფილტრი
          </button>
          <button className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface px-4 py-2 hover:bg-surface-container-low transition-colors">
            სორტირება
            <span className="material-symbols-outlined text-[18px]">expand_more</span>
          </button>
        </div>
      </div>
    </header>
  )
}

function ProductCard({ product }) {
  const { addToCart, toggleFavorite, isFavorite } = useStore()
  const [added, setAdded] = useState(false)
  const favorited = isFavorite(product.id)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleToggleFavorite = (e) => {
    e.stopPropagation()
    toggleFavorite(product)
  }

  const openProduct = () => {
    window.location.hash = "#/product"
  }

  return (
    <article className="group relative">
      <div
        onClick={openProduct}
        className="aspect-[4/5] overflow-hidden bg-surface-container relative mb-4 cursor-pointer"
      >
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={product.img}
          alt={product.title}
        />
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-4 right-4 transition-colors ${
            favorited ? "text-error" : "text-on-surface-variant hover:text-error"
          }`}
          aria-label="favorite"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: favorited ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
        <div className="absolute bottom-0 left-0 w-full p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            className={`w-full text-on-primary-container py-3 font-button-text text-button-text transition-colors ${
              added ? "bg-primary" : "bg-primary-container hover:bg-primary"
            }`}
          >
            {added ? "დამატებულია" : "კალათაში დამატება"}
          </button>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <a
            href="#/product"
            className="font-body-md text-body-md font-bold text-on-surface hover:text-primary transition-colors"
          >
            {product.title}
          </a>
          <p className="font-label-sm text-label-sm text-secondary mt-1 tracking-normal">
            {product.subtitle}
          </p>
        </div>
        <span className="font-body-md text-body-md text-primary">
          {product.price} ₾
        </span>
      </div>
    </article>
  )
}

function Footer() {
  const socials = ["Facebook", "Instagram", "TikTok", "YouTube"]
  return (
    <footer className="border-t border-outline-variant bg-surface mt-stack-lg">
      <div className="flex flex-col md:flex-row justify-between items-center px-container-padding py-stack-md max-w-[1800px] mx-auto w-full">
        <div className="flex flex-col gap-1 items-center md:items-start mb-6 md:mb-0">
          <h4 className="font-headline-lg text-headline-lg text-primary">
            G&M აქსესუარები
          </h4>
          <p className="font-label-sm text-label-sm text-secondary">
            © G&M აქსესუარები. ყველა უფლება დაცულია.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {socials.map((s) => (
            <a
              key={s}
              className="font-label-sm text-label-sm text-secondary hover:text-primary opacity-70 hover:opacity-100 transition-all"
              href="#"
            >
              {s}
            </a>
          ))}
          <a
            className="font-label-sm text-label-sm text-secondary hover:text-primary opacity-70 hover:opacity-100 transition-all"
            href="tel:557783549"
          >
            557 78 35 49
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function Catalog() {
  return (
    <>
      <SiteNav active="კატალოგი" />
      <main className="min-h-screen px-container-padding py-stack-lg max-w-[1800px] mx-auto">
        <CatalogHeader />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
