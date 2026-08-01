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
        className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors"
      >
        სორტირება
        <span
          className={`material-symbols-outlined text-[18px] transition-transform ${open ? "rotate-180" : ""}`}
        >
          expand_more
        </span>
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
              className={`w-full flex items-center justify-between text-left px-4 py-3 font-label-sm text-label-sm hover:bg-surface-container-low transition-colors ${
                opt.value === sortBy ? "text-primary font-bold" : "text-on-surface"
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
        className={`flex items-center gap-2 font-label-sm text-label-sm px-4 py-2 rounded-lg border transition-colors ${
          active
            ? "border-primary text-primary"
            : "border-outline-variant text-on-surface hover:bg-surface-container-low"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">tune</span>
        ფილტრი
      </button>
      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-72 bg-white border border-outline-variant shadow-lg z-[80] p-6"
          onMouseLeave={() => setOpen(false)}
        >
          <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-4">
            ფასი (₾)
          </p>
          <div className="flex items-center gap-3 mb-6">
            <input
              type="number"
              min="0"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              placeholder="დან"
              className="w-full border border-outline-variant px-3 py-2 font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-secondary">—</span>
            <input
              type="number"
              min="0"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder="მდე"
              className="w-full border border-outline-variant px-3 py-2 font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={apply}
              className="flex-grow bg-primary-container text-on-primary-container py-2 font-button-text text-button-text hover:bg-primary transition-colors"
            >
              გამოყენება
            </button>
            <button
              onClick={clear}
              className="px-4 py-2 border border-outline-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors"
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
    <header className="mb-16">
      <h2 className="font-headline-lg text-headline-lg text-primary mb-4">კატალოგი</h2>
      <div className="w-full h-[1px] bg-outline-variant mb-8" />
      <nav className="mb-8 overflow-x-auto scrollbar-hide">
        <ul className="flex items-center gap-8 whitespace-nowrap">
          {TABS.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onChange(cat)}
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
      <div className="flex justify-end gap-4">
        <FilterDropdown priceRange={priceRange} onApply={onPriceApply} />
        <SortDropdown sortBy={sortBy} onChange={onSortChange} />
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
    <article className="group flex flex-col bg-white border border-black/5 p-4 rounded-lg transition-colors">
      <div
        onClick={() => {
          window.location.hash = `#/product/${product.id}`
        }}
        className="relative aspect-[4/5] overflow-hidden mb-6 bg-surface-container-low rounded-lg cursor-pointer"
      >
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={product.image_urls?.[0]}
          alt={product.title_ka}
          loading="lazy"
        />
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${
            favorited ? "bg-primary text-white" : "bg-white/90 text-primary hover:bg-primary hover:text-white"
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
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 p-6">
          <button
            onClick={handleAddToCart}
            className={`w-full py-4 text-on-primary font-bold text-button-text rounded shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform ${
              added ? "bg-primary" : "bg-primary hover:bg-primary/90"
            }`}
          >
            {added ? "დამატებულია" : "კალათაში დამატება"}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
          {product.category}
        </p>
        <a
          href={`#/product/${product.id}`}
          className="font-headline-lg text-lg text-primary leading-tight hover:opacity-70 transition-opacity"
        >
          {product.title_ka}
        </a>
        <span className="font-body-md font-bold text-primary text-xl mt-2">{product.price} ₾</span>
      </div>
    </article>
  )
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined text-outline text-6xl mb-4">search_off</span>
      <p className="text-secondary font-body-md">პროდუქტები ვერ მოიძებნა</p>
    </div>
  )
}

function CatalogSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white border border-black/5 p-4 rounded-lg animate-pulse">
          <div className="aspect-[4/5] bg-surface-container-low rounded-lg mb-6" />
          <div className="flex flex-col gap-3">
            <div className="h-3 bg-surface-container-low w-1/3" />
            <div className="h-4 bg-surface-container-low w-3/4" />
            <div className="h-4 bg-surface-container-low w-1/4 mt-2" />
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
    <div className="mt-24 flex justify-center items-center gap-4">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="წინა გვერდი"
        className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <div className="flex gap-2">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-10 h-10 flex items-center justify-center rounded-full font-label-sm text-label-sm transition-colors ${
              p === page
                ? "bg-primary text-white font-bold"
                : "text-on-surface-variant hover:bg-surface-container-low"
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
        className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
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
              target="_blank"
              rel="noopener noreferrer"
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
      <main className="min-h-screen px-container-padding py-stack-lg max-w-[1800px] mx-auto">
        <CatalogHeader
          activeCat={activeCat}
          onChange={setActiveCat}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceRange={priceRange}
          onPriceApply={setPriceRange}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-12 gap-y-20">
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
