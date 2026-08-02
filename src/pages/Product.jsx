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
  const [showVideo, setShowVideo] = useState(false)

  return (
    <div className="space-y-4">
      <div className="aspect-square border border-outline-variant rounded overflow-hidden bg-surface-container-low">
        {showVideo && product.video_url ? (
          <iframe
            className="w-full h-full"
            src={toEmbedUrl(product.video_url)}
            title={product.title_ka}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img className="w-full h-full object-cover" src={mainSrc} alt={product.title_ka} />
        )}
      </div>

      {(images.length > 1 || product.video_url) && (
        <div className="flex gap-3 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setMainSrc(img)
                setShowVideo(false)
              }}
              className={`w-20 h-20 border rounded overflow-hidden bg-surface-container-low shrink-0 transition-colors ${
                !showVideo && mainSrc === img ? "border-primary" : "border-outline-variant"
              }`}
            >
              <img className="w-full h-full object-cover" src={img} alt="" loading="lazy" />
            </button>
          ))}
          {product.video_url && (
            <button
              onClick={() => setShowVideo(true)}
              className={`w-20 h-20 border rounded overflow-hidden bg-surface-container-low flex items-center justify-center shrink-0 transition-colors ${
                showVideo ? "border-primary" : "border-outline-variant"
              }`}
            >
              <div className="w-8 h-8 rounded-full border-2 border-on-surface flex items-center justify-center">
                <div className="w-0 h-0 border-l-[8px] border-l-on-surface border-y-[5px] border-y-transparent ml-1" />
              </div>
            </button>
          )}
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
  const favorited = isFavorite(product.id)

  const handleAddToCart = () => {
    addToCart(product.id, { size, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-secondary mb-2 block">
          {product.category}
        </span>
        <h1 className="text-2xl md:text-3xl font-headline-lg text-on-surface leading-tight">
          {product.title_ka}
        </h1>
        {!product.in_stock && (
          <span className="inline-block mt-3 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-error-container text-on-error-container">
            ამოწურულია
          </span>
        )}
      </div>

      <p className="text-3xl font-bold text-on-surface">{fmt(product.price)}</p>

      {hasSizes && (
        <div>
          <span className="text-sm font-semibold text-on-surface mb-3 block">ზომა:</span>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-4 py-2 text-sm font-medium border rounded transition-colors ${
                  size === s ? "border-primary text-primary bg-primary/5" : "border-outline-variant text-on-surface hover:border-on-surface"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className="w-full bg-primary text-on-primary py-3 text-sm font-semibold rounded flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[18px]">
            {added ? "check" : "shopping_cart"}
          </span>
          {added ? "დამატებულია" : "კალათაში დამატება"}
        </button>
        <button
          onClick={() => toggleFavorite(product.id)}
          className={`w-full border py-3 text-sm font-semibold rounded flex items-center justify-center gap-2 transition-colors ${
            favorited ? "border-error/30 text-error bg-error-container/40" : "border-outline-variant text-on-surface hover:border-primary hover:text-primary"
          }`}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: favorited ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
          {favorited ? "ფავორიტებშია" : "ფავორიტებში დამატება"}
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-on-surface mb-2 uppercase tracking-wider">აღწერა</h3>
        <p className="text-sm text-on-surface/70 leading-relaxed">{product.description_ka}</p>
      </div>

      {hasSpecs && (
        <div className="border-t border-outline-variant pt-6">
          <h3 className="text-sm font-semibold text-on-surface mb-4 uppercase tracking-wider">
            მახასიათებლები
          </h3>
          <div>
            {product.specifications.map((spec) => (
              <div
                key={spec.key}
                className="flex items-center justify-between py-3 border-b border-outline-variant last:border-b-0"
              >
                <span className="text-sm text-secondary">{spec.key}</span>
                <span className="text-sm font-medium text-on-surface">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function RelatedCard({ item }) {
  const { toggleFavorite, isFavorite } = useStore()
  const favorited = isFavorite(item.id)
  return (
    <a href={`#/product/${item.id}`} className="product-card group block border border-outline-variant rounded bg-white overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-low">
        <img
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={item.image_urls?.[0]}
          alt={item.title_ka}
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(item.id)
          }}
          className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded transition-colors hover:bg-white"
        >
          <span
            className={`material-symbols-outlined text-[18px] ${favorited ? "text-error" : "text-on-surface"}`}
            style={{ fontVariationSettings: favorited ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </div>
      <div className="p-4">
        <h4 className="text-sm font-semibold text-on-surface truncate mb-2">{item.title_ka}</h4>
        <p className="text-base font-bold text-on-surface">{fmt(item.price)}</p>
      </div>
    </a>
  )
}

function Footer() {
  const socials = ["Facebook", "Instagram", "TikTok", "YouTube"]
  return (
    <footer className="bg-white border-t border-outline-variant py-8">
      <div className="w-full px-6 md:px-container-padding flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-headline-lg text-base text-on-surface">G&M აქსესუარები</span>
          <p className="text-xs text-on-surface-variant">
            © {new Date().getFullYear()} G&M აქსესუარები. ყველა უფლება დაცულია.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {socials.map((s) => (
            <a
              key={s}
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
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
          className="text-sm font-medium text-on-surface hover:text-primary transition-colors"
        >
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
        <main className="min-h-screen flex items-center justify-center text-secondary">
          იტვირთება...
        </main>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <SiteNav active="კატალოგი" />
        <main className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <p className="text-secondary mb-4">პროდუქტი ვერ მოიძებნა</p>
          <a href="#/catalog" className="text-sm font-medium text-primary underline underline-offset-4">
            კატალოგის ნახვა
          </a>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SiteNav active="კატალოგი" />
      <main className="px-container-padding py-12 md:py-16 w-full">
        <nav className="flex items-center gap-2 text-sm text-secondary mb-8 overflow-x-auto whitespace-nowrap">
          <a className="hover:text-on-surface transition-colors" href="#/catalog">
            კატალოგი
          </a>
          <span>/</span>
          <span className="text-on-surface">{product.category}</span>
          <span>/</span>
          <span className="text-on-surface">{product.title_ka}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <Gallery product={product} />
          <Details product={product} />
        </div>

        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-outline-variant">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-on-surface tracking-tight">
                შეიძლება დაგაინტერესოთ
              </h2>
              <a href="#/catalog" className="text-sm font-medium text-primary hover:underline">
                ყველას ნახვა
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <RelatedCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
