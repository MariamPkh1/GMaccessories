import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store'
import { CATEGORIES, displayPrice, minPrice, maxPrice, productImage } from '../products'
import { categoryMaterialIcon } from '../lib/categoryIcons'
import SiteNav from '../components/SiteNav'
import Footer from '../components/Footer'

// Opaque sentinel, never shown to the user: it stands in for "no category
// filter" and is also compared against the category taken from the URL, so it
// must not collide with a real category name.
const ALL = '__all__'
const TABS = [ALL, ...CATEGORIES]
const PAGE_SIZE = 9

// Categories are stored in the database as their Georgian label, so a category
// is its own display text; only the ALL sentinel needs one supplied.
const categoryLabel = (cat) => (cat === ALL ? 'ყველა' : cat)

const SORT_OPTIONS = [
  { value: 'newest', label: 'უახლესი' },
  { value: 'price-asc', label: 'ფასი: დაბლიდან მაღლა' },
  { value: 'price-desc', label: 'ფასი: მაღლიდან დაბლა' },
]

const TOOLBAR_BTN =
  'flex items-center gap-1.5 border border-outline-variant rounded-[6px] px-2.5 py-1.5 text-[13px] font-medium bg-white transition-colors'

// ---------------------------------------------------------------------------

function FilterDropdown({ priceRange, onApply }) {
  const [open, setOpen] = useState(false)
  const [min, setMin] = useState(priceRange.min)
  const [max, setMax] = useState(priceRange.max)

  useEffect(() => {
    setMin(priceRange.min)
    setMax(priceRange.max)
  }, [priceRange])

  const active = priceRange.min !== '' || priceRange.max !== ''

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${TOOLBAR_BTN} ${
          active ? 'border-primary text-primary' : 'text-secondary hover:text-on-surface'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">tune</span>
        ფილტრი
      </button>
      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white border border-outline-variant rounded-[10px] shadow-lg z-[80] p-4"
          onMouseLeave={() => setOpen(false)}
        >
          <p className="text-[13px] font-bold text-secondary uppercase tracking-wider mb-3">
            ფასი (₾)
          </p>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="number"
              min="0"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              placeholder="დან"
              className="w-full min-w-0 border border-outline-variant rounded-[6px] px-2.5 py-1.5 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <span className="text-secondary shrink-0">—</span>
            <input
              type="number"
              min="0"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder="მდე"
              className="w-full min-w-0 border border-outline-variant rounded-[6px] px-2.5 py-1.5 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => {
                onApply({ min, max })
                setOpen(false)
              }}
              className="flex-grow bg-on-surface text-white py-1.5 rounded-[6px] text-sm font-semibold transition-opacity hover:opacity-90"
            >
              გამოყენება
            </button>
            <button
              type="button"
              onClick={() => {
                onApply({ min: '', max: '' })
                setOpen(false)
              }}
              className="px-3 py-1.5 border border-outline-variant rounded-[6px] text-sm font-medium transition-colors hover:border-on-surface whitespace-nowrap"
            >
              გასუფთავება
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`${TOOLBAR_BTN} text-secondary hover:text-on-surface`}
      >
        <span className="material-symbols-outlined text-[18px]">swap_vert</span>
        სორტირება
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="სორტირება"
          className="absolute top-full right-0 mt-2 min-w-[220px] bg-white border border-outline-variant rounded-[10px] shadow-lg z-[80] py-2 px-1"
          onMouseLeave={() => setOpen(false)}
        >
          {SORT_OPTIONS.map((opt) => {
            const selected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between gap-4 px-3 py-2.5 text-left text-[14px] rounded-[6px] transition-colors hover:bg-surface-container-low ${
                  selected ? 'font-bold text-primary' : 'font-normal text-on-surface'
                }`}
              >
                <span>{opt.label}</span>
                {selected && (
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                    check
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SearchBand({ value, onChange }) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full relative">
      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-[20px] pointer-events-none">
        search
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="მოძებნეთ პროდუქტი..."
        aria-label="ძებნა"
        className="w-full h-12 pl-11 pr-28 bg-[#f0f0f0] rounded-[8px] border border-outline-variant text-[15px] text-on-surface placeholder:text-secondary focus:outline-none focus:border-primary transition-colors"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-on-surface text-white h-9 px-5 rounded-[6px] text-[13px] font-medium transition-opacity hover:opacity-90"
      >
        ძებნა
      </button>
    </form>
  )
}

// Category list. Flat, not nested: products.category is a single flat value, so
// an expandable tree would be inventing a hierarchy the data doesn't have.
function CategorySidebar({ activeCat, onChange }) {
  return (
    <aside className="hidden md:block self-stretch w-full">
      {/* Panel stretches with the product column; categories stay packed at the
          top and the leftover height is empty space at the bottom. */}
      <div className="h-full min-h-[calc((100vh/var(--app-zoom))-160px)] w-full border-r border-outline-card bg-white py-6 pr-2 pb-10 flex flex-col rounded-[12px] shadow-sm">
        <div className="pb-4 border-b border-outline-variant shrink-0">
          <h2 className="text-base font-semibold text-on-surface leading-tight">
            კატეგორიები
          </h2>
          <p className="text-base font-medium text-secondary mt-0.5 whitespace-nowrap">
            აირჩიეთ განყოფილება
          </p>
        </div>

        <nav className="flex flex-col gap-0.5 mt-2 shrink-0">
          {TABS.map((cat) => {
            const on = cat === activeCat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange(cat)}
                aria-current={on ? 'true' : undefined}
                className={`flex items-center justify-between gap-2 pr-1.5 py-2.5 rounded-[6px] text-left text-base transition-all duration-150 ${
                  on
                    ? 'font-semibold text-black bg-surface-container-low border-l-4 border-black pl-1.5'
                    : 'font-medium text-secondary hover:bg-surface-container-high hover:text-black pl-0'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[22px] shrink-0">
                    {cat === ALL ? 'apps' : categoryMaterialIcon(cat)}
                  </span>
                  <span className="truncate">{categoryLabel(cat)}</span>
                </span>
                {on && (
                  <span className="material-symbols-outlined text-[20px] shrink-0">
                    expand_more
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="flex-1 min-h-[120px]" aria-hidden="true" />
      </div>
    </aside>
  )
}

function CatalogToolbar({
  activeCat,
  onCategoryChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceApply,
}) {
  return (
    <div>
      <div className="relative md:hidden mb-4">
        <select
          value={activeCat}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="კატეგორია"
          className="w-full appearance-none border border-outline-variant rounded-[6px] bg-white pl-3 pr-9 py-2 text-[13px] font-medium text-on-surface focus:outline-none focus:border-primary transition-colors"
        >
          {TABS.map((cat) => (
            <option key={cat} value={cat}>
              {categoryLabel(cat)}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary text-[20px] pointer-events-none">
          expand_more
        </span>
      </div>

      <div className="flex justify-end items-center gap-2 flex-wrap border-b border-outline-variant pb-3">
        <FilterDropdown priceRange={priceRange} onApply={onPriceApply} />
        <SortDropdown value={sortBy} onChange={onSortChange} />
      </div>
    </div>
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
    <article className="group flex flex-col">
      <a
        href={`#/product/${product.id}`}
        className="relative bg-[#f5f5f5] overflow-hidden shrink-0 w-full aspect-square mb-3"
      >
        <img
          className="object-cover w-full h-full"
          src={productImage(product, { thumb: true })}
          alt={product.title_ka}
          loading="lazy"
        />
        <button
          onClick={handleToggleFavorite}
          aria-label={favorited ? 'ფავორიტებშია' : 'ფავორიტებში დამატება'}
          className="absolute top-2 left-2 p-1.5 text-secondary hover:text-primary transition-colors"
        >
          <span
            className={`material-symbols-outlined text-[20px] ${favorited ? 'text-error' : ''}`}
            style={{ fontVariationSettings: favorited ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </a>

      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="text-[18px] font-bold text-primary truncate">
          {displayPrice(product).text}
        </span>
        <button
          onClick={handleAddToCart}
          aria-label={added ? 'დამატებულია' : 'კალათაში დამატება'}
          className="shrink-0 text-secondary hover:text-primary transition-colors p-0.5"
        >
          <span className="material-symbols-outlined text-[20px]">
            {added ? 'check' : 'shopping_cart'}
          </span>
        </button>
      </div>

      <h3 className="text-[14px] font-medium text-on-surface leading-snug line-clamp-2">
        <a href={`#/product/${product.id}`} className="hover:text-primary transition-colors">
          {product.title_ka}
        </a>
      </h3>
    </article>
  )
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined text-outline text-5xl mb-4">search_off</span>
      <p className="text-base text-secondary">პროდუქტები ვერ მოიძებნა</p>
    </div>
  )
}

function CatalogSkeleton() {
  return (
    <>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i}>
          <div className="w-full aspect-square skeleton-shimmer mb-3" />
          <div className="h-5 w-16 skeleton-shimmer rounded mb-2" />
          <div className="h-4 w-3/4 skeleton-shimmer rounded" />
        </div>
      ))}
    </>
  )
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const box =
    'w-10 h-10 rounded-[6px] flex items-center justify-center text-[14px] font-medium transition-colors'

  return (
    <div className="flex justify-center gap-2 mt-10">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="წინა გვერდი"
        className={`${box} border border-outline-variant text-secondary hover:bg-surface-container-high disabled:opacity-40`}
      >
        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`${box} ${
            p === page
              ? 'bg-primary text-white'
              : 'border border-outline-variant text-secondary hover:bg-surface-container-high'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="შემდეგი გვერდი"
        className={`${box} border border-outline-variant text-secondary hover:bg-surface-container-high disabled:opacity-40`}
      >
        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
      </button>
    </div>
  )
}

export default function Catalog({ initialCategory = null }) {
  const { products, productsLoading } = useStore()
  const activeCat = initialCategory && TABS.includes(initialCategory) ? initialCategory : ALL

  const setActiveCat = (cat) => {
    window.location.hash = cat === ALL ? '#/catalog' : `#/catalog/${encodeURIComponent(cat)}`
  }
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    let list = products.filter((p) => activeCat === ALL || p.category === activeCat)

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter((p) =>
        `${p.title_ka ?? ''} ${p.short_description_ka ?? ''}`.toLowerCase().includes(q),
      )
    }

    if (priceRange.min !== '') list = list.filter((p) => maxPrice(p) >= Number(priceRange.min))
    if (priceRange.max !== '') list = list.filter((p) => minPrice(p) <= Number(priceRange.max))

    list = [...list]
    if (sortBy === 'price-asc') list.sort((a, b) => minPrice(a) - minPrice(b))
    else if (sortBy === 'price-desc') list.sort((a, b) => minPrice(b) - minPrice(a))
    else list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return list
  }, [products, activeCat, sortBy, priceRange, query])

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [activeCat, sortBy, priceRange, query])

  const shown = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const goToPage = (p) => {
    setPage(Math.min(Math.max(p, 1), totalPages))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <SiteNav active="catalog" />
      <div className="bg-white min-h-screen">
        <main className="w-full px-6 md:px-container-padding py-8 grid grid-cols-1 md:grid-cols-[17.5rem_minmax(0,1fr)] gap-6 md:gap-8 items-start">
          <CategorySidebar activeCat={activeCat} onChange={setActiveCat} />

          <section className="flex flex-col gap-4 min-w-0">
            <SearchBand value={query} onChange={setQuery} />

            <CatalogToolbar
              activeCat={activeCat}
              onCategoryChange={setActiveCat}
              sortBy={sortBy}
              onSortChange={setSortBy}
              priceRange={priceRange}
              onPriceApply={setPriceRange}
            />

            <div className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {productsLoading ? (
                  <CatalogSkeleton />
                ) : shown.length > 0 ? (
                  shown.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <EmptyState />
                )}
              </div>

              {!productsLoading && (
                <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
              )}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  )
}
