import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store'
import { CATEGORIES, displayPrice, minPrice, maxPrice, productImage } from '../products'
import { useLocale, useT } from '../i18n'
import SiteNav from '../components/SiteNav'
import Footer from '../components/Footer'

// Opaque sentinel, never shown to the user: the label is translated at render
// time. It must not be a display string, because ALL is also compared against
// the category taken from the URL.
const ALL = '__all__'
const TABS = [ALL, ...CATEGORIES]
const PAGE_SIZE = 6

const SORT_OPTIONS = [
  { value: 'newest', labelKey: 'catalog.sort.newest' },
  { value: 'price-asc', labelKey: 'catalog.sort.priceAsc' },
  { value: 'price-desc', labelKey: 'catalog.sort.priceDesc' },
]

function SortDropdown({ sortBy, onChange }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs font-medium text-secondary border border-outline-variant px-3 py-1.5 rounded transition-colors hover:border-on-surface"
      >
        <span className="material-symbols-outlined text-[16px]">swap_vert</span>
        {t('catalog.sort')}
      </button>
      {/* Panel is anchored left on mobile: these controls sit at the left edge
          there, so a right-anchored panel hangs off-screen and gets clipped.
          Right-anchored from lg up, where the controls are right-aligned. */}
      {open && (
        <div
          className="absolute top-full left-0 lg:left-auto lg:right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white border border-outline-variant shadow-lg z-[80]"
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
              {t(opt.labelKey)}
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
  const t = useT()
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
        {t('catalog.filter')}
      </button>
      {open && (
        <div
          className="absolute top-full left-0 lg:left-auto lg:right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white border border-outline-variant shadow-lg z-[80] p-4 sm:p-6"
          onMouseLeave={() => setOpen(false)}
        >
          <p className="text-xs font-medium text-secondary uppercase tracking-wider mb-4">
            {t('catalog.filter.price')}
          </p>
          <div className="flex items-center gap-2 mb-5">
            <input
              type="number"
              min="0"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              placeholder={t('catalog.filter.min')}
              className="w-full min-w-0 border border-outline-variant rounded px-2.5 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <span className="text-secondary shrink-0">—</span>
            <input
              type="number"
              min="0"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder={t('catalog.filter.max')}
              className="w-full min-w-0 border border-outline-variant rounded px-2.5 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          {/* Stacked on narrow panels — the two Georgian labels don't fit side
              by side once the panel is clamped to the viewport width. */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={apply}
              className="flex-grow bg-primary text-on-primary py-2 rounded text-sm font-semibold transition-opacity hover:opacity-90"
            >
              {t('catalog.filter.apply')}
            </button>
            <button
              onClick={clear}
              className="px-4 py-2 border border-outline-variant rounded text-sm font-medium transition-colors hover:border-on-surface whitespace-nowrap"
            >
              {t('catalog.filter.clear')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function CatalogHeader({ activeCat, onChange, sortBy, onSortChange, priceRange, onPriceApply }) {
  const { t, tCategory } = useLocale()
  // ALL is a sentinel rather than a real category, so it gets its own label.
  const tabLabel = (cat) => (cat === ALL ? t('catalog.all') : tCategory(cat))
  return (
    <header className="mb-8">
      <h1 className="text-3xl md:text-4xl font-headline-lg text-on-surface mb-8">{t('catalog.title')}</h1>
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-6 border-b border-outline-variant">
        {/* Mobile/tablet: a single select. With 9 categories the tab row
            overflowed the screen and scrolled sideways, hiding most of them. */}
        <div className="relative lg:hidden">
          <select
            value={activeCat}
            onChange={(e) => onChange(e.target.value)}
            aria-label={t('catalog.category')}
            className="w-full appearance-none border border-outline-variant rounded pl-4 pr-10 py-2.5 text-sm font-medium text-on-surface bg-white focus:outline-none focus:border-primary transition-colors"
          >
            {TABS.map((cat) => (
              <option key={cat} value={cat}>
                {tabLabel(cat)}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary text-[20px] pointer-events-none">
            expand_more
          </span>
        </div>

        {/* Desktop: keep the underlined tab row — there's room for it. */}
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto pb-1">
          {TABS.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={`relative px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeCat === cat ? "text-primary" : "text-secondary hover:text-on-surface"
              }`}
            >
              {tabLabel(cat)}
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
  const { t, tCategory } = useLocale()
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
          src={productImage(product, { thumb: true })}
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
        {/* `invisible` (not just opacity-0) so the hidden overlay is dropped
            from hit-testing — an opacity-0 element still receives clicks, and
            this one covers the whole image, which was stealing every click
            meant for the heart button above it. The overlay stays
            click-through; only the button inside it is interactive. */}
        <div className="absolute inset-0 bg-black/20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-4 pointer-events-none">
          <button
            onClick={handleAddToCart}
            className="bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 pointer-events-auto"
          >
            <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
            {added ? t('product.added') : t('product.addToCart')}
          </button>
        </div>
      </div>
      <div className="p-4">
        <span className="text-[11px] font-medium uppercase tracking-wider text-secondary mb-1 block">
          {tCategory(product.category)}
        </span>
        <h3 className="text-sm font-semibold text-on-surface truncate mb-1">{product.title_ka}</h3>
        {/* The admin form collects a short description but nothing displayed it,
            so the field looked broken. Clamped to two lines and rendered only
            when present, so cards without one keep their original height. */}
        {product.short_description_ka && (
          <p className="text-xs text-secondary leading-snug mb-2 line-clamp-2">
            {product.short_description_ka}
          </p>
        )}
        <p className="text-base font-bold text-on-surface">{displayPrice(product, t).text}</p>
      </div>
    </article>
  )
}

function EmptyState() {
  const t = useT()
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined text-outline text-5xl mb-4">search_off</span>
      <p className="text-secondary">{t('catalog.empty')}</p>
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
  // Declared before the early return: hooks must run in the same order on every
  // render, and this component bails out when there's only one page.
  const t = useT()
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="mt-16 flex justify-center items-center gap-3">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label={t('catalog.prevPage')}
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
        aria-label={t('catalog.nextPage')}
        className="w-9 h-9 flex items-center justify-center rounded border border-outline-variant text-secondary hover:border-on-surface transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
    </div>
  )
}

export default function Catalog({ initialCategory = null }) {
  const { products, productsLoading } = useStore()
  // The URL is the single source of truth for the selected category, so the
  // nav dropdown, the tab row and a pasted link can't disagree. An unknown
  // category (e.g. a renamed one in an old bookmark) falls back to "all"
  // rather than rendering an empty page.
  const activeCat = initialCategory && TABS.includes(initialCategory) ? initialCategory : ALL

  const setActiveCat = (cat) => {
    window.location.hash = cat === ALL ? '#/catalog' : `#/catalog/${encodeURIComponent(cat)}`
  }
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [page, setPage] = useState(1)

  const visible = useMemo(() => {
    // No stock filtering: every order is a sourcing *request* rather than a sale
    // from held inventory, so "out of stock" never applied to this shop.
    let list = products.filter((p) => activeCat === ALL || p.category === activeCat)
    // With per-size pricing a product spans a range, so it matches the filter
    // when ANY of its size options falls inside the requested bounds.
    if (priceRange.min !== "") list = list.filter((p) => maxPrice(p) >= Number(priceRange.min))
    if (priceRange.max !== "") list = list.filter((p) => minPrice(p) <= Number(priceRange.max))

    // Sort on the "from" price, matching what the card actually shows.
    list = [...list]
    if (sortBy === "price-asc") list.sort((a, b) => minPrice(a) - minPrice(b))
    else if (sortBy === "price-desc") list.sort((a, b) => minPrice(b) - minPrice(a))
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
      <SiteNav active="catalog" />
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
