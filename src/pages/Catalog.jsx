import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store'
import { CATEGORIES } from '../products'
import SiteNav from '../components/SiteNav'

const ALL = "ყველა"
const TABS = [ALL, ...CATEGORIES]
const PAGE_SIZE = 6

const SORT_OPTIONS = [
  { value: "newest", label: "უახლესი" },
  { value: "price-asc", label: "ფასი: დაბლიდან მაღლა" },
  { value: "price-desc", label: "ფასი: მაღლიდან დაბლა" },
]

function SortDropdown({ sortBy, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs font-medium text-secondary border border-outline-variant px-3 py-1.5 rounded transition-colors hover:border-on-surface"
      >
        <span className="material-symbols-outlined text-[16px]">swap_vert</span>
        სორტირება
      </button>
      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-64 bg-white border border-outline-variant shadow-lg z-[80]"
          onMouseLeave={() => setOpen(false)}
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={`w-full flex items-center justify-between text-left px-4 py-3 text-sm hover:bg-surface-container-low transition-colors ${
                opt.value === sortBy ? "text-primary font-semibold" : "text-on-surface"
              }`}
            >
              {opt.label}
              {opt.value === sortBy && (
                <span className="material-symbols-outlined text-[18px]">check</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterDropdown({ priceRange, onApply }) {
  const [open, setOpen] = useState(false)
  const [min, setMin] = useState(priceRange.min)
  const [max, setMax] = useState(priceRange.max)

  useEffect(() => {
    setMin(priceRange.min)
    setMax(priceRange.max)
  }, [priceRange])

  const active = priceRange.min !== "" || priceRange.max !== ""

  const apply = () => {
    onApply({ min, max })
    setOpen(false)
  }

  const clear = () => {
    onApply({ min: "", max: "" })
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 text-xs font-medium border px-3 py-1.5 rounded transition-colors ${
          active ? "border-primary text-primary" : "border-outline-variant text-secondary hover:border-on-surface"
        }`}
      >
        <span className="material-symbols-outlined text-[16px]">tune</span>
        ფილტრი
      </button>
      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-72 bg-white border border-outline-variant shadow-lg z-[80] p-6"
          onMouseLeave={() => setOpen(false)}
        >
          <p className="text-xs font-medium text-secondary uppercase tracking-wider mb-4">
            ფასი (₾)
          </p>
          <div className="flex items-center gap-3 mb-6">
            <input
              type="number"
              min="0"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              placeholder="დან"
              className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <span className="text-secondary">—</span>
            <input
              type="number"
              min="0"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder="მდე"
              className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={apply}
              className="flex-grow bg-primary text-on-primary py-2 rounded text-sm font-semibold transition-opacity hover:opacity-90"
            >
              გამოყენება
            </button>
            <button
              onClick={clear}
              className="px-4 py-2 border border-outline-variant rounded text-sm font-medium transition-colors hover:border-on-surface"
            >
              გასუფთავება
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function CatalogHeader({ activeCat, onChange, sortBy, onSortChange, priceRange, onPriceApply }) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl md:text-4xl font-headline-lg text-on-surface mb-8">კატალოგი</h1>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {TABS.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={`relative px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeCat === cat ? "text-primary" : "text-secondary hover:text-on-surface"
              }`}
            >
              {cat}
              {activeCat === cat && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <FilterDropdown priceRange={priceRange} onApply={onPriceApply} />
          <SortDropdown sortBy={sortBy} onChange={onSortChange} />
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
    e.preventDefault()
    addToCart(product.id)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleToggleFavorite = (e) => {
    e.stopPropagation()
    e.preventDefault()
    toggleFavorite(product.id)
  }

  return (
    <article className="product-card group border border-outline-variant rounded bg-white overflow-hidden">
      <div
        onClick={() => {
          window.location.hash = `#/product/${product.id}`
        }}
        className="relative aspect-[4/3] overflow-hidden bg-surface-container-low cursor-pointer"
      >
        <img
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={product.image_urls?.[0]}
          alt={product.title_ka}
          loading="lazy"
        />
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded transition-colors hover:bg-white"
          aria-label="favorite"
        >
          <span
            className={`material-symbols-outlined text-[18px] ${favorited ? "text-error" : "text-on-surface"}`}
            style={{ fontVariationSettings: favorited ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-4">
          <button
            onClick={handleAddToCart}
            className="bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
            {added ? "დამატებულია" : "კალათაში დამატება"}
          </button>
        </div>
      </div>
      <div className="p-4">
        <span className="text-[11px] font-medium uppercase tracking-wider text-secondary mb-1 block">
          {product.category}
        </span>
        <h3 className="text-sm font-semibold text-on-surface truncate mb-2">{product.title_ka}</h3>
        <p className="text-base font-bold text-on-surface">{product.price} ₾</p>
      </div>
    </article>
  )
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined text-outline text-5xl mb-4">search_off</span>
      <p className="text-secondary">პროდუქტები ვერ მოიძებნა</p>
    </div>
  )
}

function CatalogSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border border-outline-variant rounded bg-white overflow-hidden">
          <div className="aspect-[4/3] skeleton-shimmer" />
          <div className="p-4 space-y-3">
            <div className="h-3 w-16 skeleton-shimmer rounded" />
            <div className="h-4 w-3/4 skeleton-shimmer rounded" />
            <div className="h-5 w-20 skeleton-shimmer rounded" />
          </div>
        </div>
      ))}
    </>
  )
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="mt-16 flex justify-center items-center gap-3">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="წინა გვერდი"
        className="w-9 h-9 flex items-center justify-center rounded border border-outline-variant text-secondary hover:border-on-surface transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
      </button>
      <div className="flex gap-2">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-9 h-9 flex items-center justify-center rounded text-sm font-medium transition-colors ${
              p === page ? "bg-primary text-on-primary" : "text-secondary hover:bg-surface-container-low"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="შემდეგი გვერდი"
        className="w-9 h-9 flex items-center justify-center rounded border border-outline-variant text-secondary hover:border-on-surface transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
    </div>
  )
}

function Footer() {
  const socials = ["Facebook", "Instagram", "TikTok", "YouTube"]
  return (
    <footer className="border-t border-outline-variant bg-white mt-stack-lg">
      <div className="flex flex-col md:flex-row justify-between items-center px-container-padding py-8 w-full gap-6">
        <div className="flex flex-col gap-1 items-center md:items-start">
          <h4 className="font-headline-lg text-base text-on-surface">G&M აქსესუარები</h4>
          <p className="text-xs text-on-surface-variant">
            © {new Date().getFullYear()} G&M აქსესუარები. ყველა უფლება დაცულია.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
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
          className="text-sm font-medium text-on-surface hover:text-primary transition-colors"
          href="tel:557783549"
        >
          557 78 35 49
        </a>
      </div>
    </footer>
  )
}

export default function Catalog() {
  const { products, productsLoading } = useStore()
  const [activeCat, setActiveCat] = useState(ALL)
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [page, setPage] = useState(1)

  const visible = useMemo(() => {
    let list = products.filter(
      (p) => p.in_stock !== false && (activeCat === ALL || p.category === activeCat),
    )
    if (priceRange.min !== "") list = list.filter((p) => p.price >= Number(priceRange.min))
    if (priceRange.max !== "") list = list.filter((p) => p.price <= Number(priceRange.max))

    list = [...list]
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price)
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price)
    else list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return list
  }, [products, activeCat, sortBy, priceRange])

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))

  // Reset to page 1 whenever the category/sort/price filters change so a
  // previously-selected page doesn't carry over to a new result set.
  useEffect(() => {
    setPage(1)
  }, [activeCat, sortBy, priceRange])

  const shown = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const goToPage = (p) => {
    setPage(Math.min(Math.max(p, 1), totalPages))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <SiteNav active="კატალოგი" />
      <main className="min-h-screen px-container-padding py-12 md:py-16 w-full">
        <CatalogHeader
          activeCat={activeCat}
          onChange={setActiveCat}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceRange={priceRange}
          onPriceApply={setPriceRange}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {productsLoading ? (
            <CatalogSkeleton />
          ) : shown.length > 0 ? (
            shown.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <EmptyState />
          )}
        </div>
        {!productsLoading && (
          <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
        )}
      </main>
      <Footer />
    </>
  )
}
