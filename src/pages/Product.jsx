import { useMemo, useState } from 'react'
import SiteNav from '../components/SiteNav'
import { useStore } from '../store'
import { fmt } from '../products'

function toEmbedUrl(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`
    }
    if (u.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed${u.pathname}`
    }
    return url
  } catch {
    return url
  }
}

function Gallery({ product }) {
  const images = product.image_urls?.length ? product.image_urls : ['']
  const [mainSrc, setMainSrc] = useState(images[0])
  return (
    <div className="lg:col-span-7 grid grid-cols-6 gap-4">
      {images.length > 1 && (
        <div className="col-span-1 space-y-4">
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setMainSrc(img)}
              className={`aspect-square bg-surface-container border border-outline-variant cursor-pointer overflow-hidden transition-opacity ${
                mainSrc === img ? "opacity-100" : "opacity-60 hover:opacity-100"
              }`}
            >
              <img className="w-full h-full object-cover" src={img} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      )}
      <div className={images.length > 1 ? "col-span-5 relative group" : "col-span-6 relative group"}>
        <div className="aspect-[4/5] bg-surface-container overflow-hidden">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src={mainSrc}
            alt={product.title_ka}
          />
        </div>
      </div>
      {product.video_url && (
        <div className="col-span-6 aspect-video bg-black">
          <iframe
            className="w-full h-full"
            src={toEmbedUrl(product.video_url)}
            title={product.title_ka}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}

function Details({ product }) {
  const { addToCart, toggleFavorite, isFavorite } = useStore()
  const hasSizes = product.sizes?.length > 0
  const hasSpecs = product.specifications?.length > 0
  const [size, setSize] = useState(hasSizes ? product.sizes[0] : null)
  const [added, setAdded] = useState(false)
  const [specsOpen, setSpecsOpen] = useState(false)
  const favorited = isFavorite(product.id)

  const handleAddToCart = () => {
    addToCart(product.id, { size, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="lg:col-span-5 lg:sticky lg:top-28">
      <div className="border-b border-outline-variant pb-8 mb-8">
        {!product.in_stock && (
          <span className="font-label-sm text-label-sm text-error uppercase tracking-[0.2em] block mb-4">
            ამოწურულია
          </span>
        )}
        <h2 className="font-display-lg text-3xl md:text-headline-lg text-on-surface mb-2 leading-tight tracking-tight">
          {product.title_ka}
        </h2>
        <p className="font-body-md font-bold text-primary text-xl tracking-tight">{fmt(product.price)}</p>
      </div>

      {hasSizes && (
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-4">
            <span className="font-label-sm text-label-sm text-on-surface w-24">ზომა:</span>
            <div className="flex gap-3">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`font-label-sm text-label-sm px-4 py-1 border transition-colors ${
                    size === s ? "border-primary text-primary" : "border-outline text-secondary hover:border-primary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 mb-12">
        <button
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className={`w-full text-on-primary font-button-text text-button-text flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] py-4 disabled:opacity-40 ${
            added ? "bg-primary" : "bg-primary-container hover:bg-primary"
          }`}
        >
          <span className={`material-symbols-outlined ${added ? "animate-spin" : ""}`}>
            {added ? "refresh" : "shopping_cart"}
          </span>
          {added ? "დამატებულია" : "კალათაში დამატება"}
        </button>
        <button
          onClick={() => toggleFavorite(product.id)}
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
          <h3 className="font-label-sm text-label-sm text-on-surface uppercase tracking-widest mb-4">აღწერა</h3>
          <p className="text-on-surface-variant leading-relaxed">{product.description_ka}</p>
        </div>
        {hasSpecs && (
          <div className="border-t border-outline-variant pt-6">
            <button
              onClick={() => setSpecsOpen((o) => !o)}
              className="w-full list-none flex justify-between items-center font-label-sm text-label-sm text-on-surface uppercase tracking-widest"
            >
              მახასიათებლები
              <span
                className={`material-symbols-outlined transition-transform ${specsOpen ? "rotate-180" : ""}`}
              >
                expand_more
              </span>
            </button>
            {specsOpen && (
              <ul className="mt-4 space-y-2 text-on-surface-variant font-body-md">
                {product.specifications.map((spec) => (
                  <li key={spec.key} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full" />
                    <span className="font-bold">{spec.key}:</span> {spec.value}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function RelatedCard({ item }) {
  const { toggleFavorite, isFavorite } = useStore()
  const favorited = isFavorite(item.id)
  return (
    <a href={`#/product/${item.id}`} className="group block">
      <div className="relative aspect-[3/4] bg-surface-container overflow-hidden mb-4">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={item.image_urls?.[0]}
          alt={item.title_ka}
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(item.id)
          }}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: favorited ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </div>
      <h4 className="font-label-sm text-label-sm text-on-surface mb-1">{item.title_ka}</h4>
      <p className="font-body-md text-primary">{fmt(item.price)}</p>
    </a>
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
              target="_blank"
              rel="noopener noreferrer"
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

export default function Product({ id }) {
  const { getProduct, products, productsLoading } = useStore()
  const product = getProduct(id)

  const related = useMemo(() => {
    if (!product) return []
    return products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)
  }, [products, product])

  if (productsLoading) {
    return (
      <>
        <SiteNav active="კატალოგი" />
        <main className="min-h-screen flex items-center justify-center text-secondary font-body-md">
          იტვირთება...
        </main>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <SiteNav active="კატალოგი" />
        <main className="min-h-screen px-6 md:px-container-padding py-stack-lg max-w-[1800px] mx-auto flex flex-col items-center justify-center text-center">
          <p className="text-secondary font-body-md mb-8">პროდუქტი ვერ მოიძებნა</p>
          <a
            href="#/catalog"
            className="bg-primary-container text-on-primary-container px-10 py-4 font-button-text text-button-text hover:bg-primary transition-colors"
          >
            კატალოგზე დაბრუნება
          </a>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SiteNav active="კატალოგი" />
      <main className="min-h-screen px-6 md:px-container-padding py-stack-lg max-w-[1800px] mx-auto">
        <nav className="mb-12 flex items-center gap-4 text-secondary font-label-sm text-label-sm overflow-x-auto whitespace-nowrap">
          <a className="hover:text-primary transition-colors" href="#/catalog">
            კატალოგი
          </a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface">{product.category}</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface">{product.title_ka}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-12 mb-20">
          <Gallery product={product} />
          <Details product={product} />
        </div>

        {related.length > 0 && (
          <>
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
                {related.map((item) => (
                  <RelatedCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
