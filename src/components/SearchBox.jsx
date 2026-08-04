import { useState } from 'react'
import { useStore } from '../store'
import { displayPrice } from '../products'

// Live product search. Included in every nav so search works everywhere.
export default function SearchBox() {
  const { products } = useStore()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const q = query.trim().toLowerCase()
  const results = q
    ? products.filter((p) =>
        `${p.title_ka} ${p.short_description_ka}`.toLowerCase().includes(q),
      )
    : []
  const open = focused && q.length > 0

  const goTo = (id) => {
    window.location.hash = `#/product/${id}`
    setQuery('')
    setFocused(false)
  }

  return (
    <div className="relative hidden lg:block">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">
        search
      </span>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-body-md w-64 focus:ring-1 focus:ring-primary focus:outline-none"
        placeholder="ძიება..."
        type="text"
      />
      {open && (
        <div className="absolute top-full mt-2 right-0 w-72 bg-white border border-outline-variant rounded-lg shadow-lg overflow-hidden z-[80]">
          {results.length > 0 ? (
            results.map((p) => (
              // onMouseDown fires before input blur, so navigation isn't cancelled.
              <button
                key={p.id}
                onMouseDown={() => goTo(p.id)}
                className="w-full flex items-center gap-3 p-3 hover:bg-surface-container-low transition-colors text-left"
              >
                <img
                  src={p.image_urls?.[0]}
                  alt=""
                  loading="lazy"
                  className="w-10 h-10 object-cover bg-surface-container flex-shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <p className="font-body-md text-body-md text-on-surface truncate">
                    {p.title_ka}
                  </p>
                  <p className="font-label-sm text-[10px] text-secondary truncate">
                    {p.short_description_ka}
                  </p>
                </div>
                <span className="font-body-md text-body-md text-primary flex-shrink-0">
                  {displayPrice(p).text}
                </span>
              </button>
            ))
          ) : (
            <p className="p-4 text-center font-label-sm text-label-sm text-secondary">
              ვერ მოიძებნა
            </p>
          )}
        </div>
      )}
    </div>
  )
}
