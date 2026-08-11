import { useMemo, useState } from 'react'
import SiteNav from '../components/SiteNav'
import { useStore } from '../store'
import { fmt, sizeEntries, priceForSize, hasVariablePricing, displayPrice, productImage } from '../products'
import Footer from '../components/Footer'

// Videos open on the platform they're hosted on rather than being embedded:
// Instagram and Facebook refuse to be iframed, so an embed would silently show
// an empty box for anything that isn't YouTube.
function VideoLink({ url }) {
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 w-full border border-outline-variant rounded px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:border-primary hover:text-primary"
    >
      <span className="material-symbols-outlined text-[20px]">play_circle</span>
      დააწკაპე ვიდეოს სანახავად
      <span className="material-symbols-outlined text-[16px] ml-auto text-secondary">open_in_new</span>
    </a>
  )
}

function Gallery({ product }) {
  const images = product.image_urls?.length ? product.image_urls : ['']
  const [index, setIndex] = useState(0)

  // Track the selected image by index so the 80x80 strip can show the small
  // variant while the main frame loads the full-size one.
  return (
    <div className="space-y-4">
      <div className="aspect-square border border-outline-variant rounded overflow-hidden bg-surface-container-low">
        <img
          className="w-full h-full object-cover"
          src={productImage(product, { index })}
          alt={product.title_ka}
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-20 h-20 border rounded overflow-hidden bg-surface-container-low shrink-0 transition-colors ${
                index === i ? "border-primary" : "border-outline-variant"
              }`}
            >
              <img
                className="w-full h-full object-cover"
                src={productImage(product, { index: i, thumb: true })}
                alt=""
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Details({ product }) {
  const { addToCart, toggleFavorite, isFavorite } = useStore()
  const sizeOptions = sizeEntries(product)
  const hasSizeOptions = sizeOptions.length > 0
  const hasSpecs = product.specifications?.length > 0
  const [size, setSize] = useState(hasSizeOptions ? sizeOptions[0].size : null)
  const [added, setAdded] = useState(false)
  const favorited = isFavorite(product.id)

  // Shown price tracks the selected size.
  const shownPrice = hasSizeOptions ? priceForSize(product, size) : Number(product.price) || 0
  const variablePricing = hasVariablePricing(product)

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
      </div>

      <p className="text-3xl font-bold text-on-surface">{fmt(shownPrice)}</p>

      {hasSizeOptions && (
        <div>
          <span className="text-sm font-semibold text-on-surface mb-3 block">ზომა:</span>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((opt) => (
              <button
                key={opt.size}
                onClick={() => setSize(opt.size)}
                className={`px-4 py-2 text-sm font-medium border rounded transition-colors text-left ${
                  size === opt.size
                    ? "border-primary text-primary bg-primary/5"
                    : "border-outline-variant text-on-surface hover:border-on-surface"
                }`}
              >
                {opt.size}
                {/* Only surface per-size prices when they actually differ,
                    otherwise it's noise on every button. */}
                {variablePricing && (
                  <span className="block text-xs text-secondary mt-0.5">{fmt(opt.price)}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary text-on-primary py-3 text-sm font-semibold rounded flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
        >
          <span className="material-symbols-outlined text-[18px]">
            {added ? "check" : "shopping_cart"}
          </span>
          {added ? 'დამატებულია' : 'კალათაში დამატება'}
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
          {favorited ? 'ფავორიტებშია' : 'ფავორიტებში დამატება'}
        </button>

        <VideoLink url={product.video_url} />
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
          src={productImage(item, { thumb: true })}
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
        <p className="text-base font-bold text-on-surface">{displayPrice(item).text}</p>
      </div>
    </a>
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
        <SiteNav active="catalog" />
        <main className="min-h-screen flex items-center justify-center text-secondary">
          იტვირთება...
        </main>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <SiteNav active="catalog" />
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
      <SiteNav active="catalog" />
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
