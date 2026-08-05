// Category list shared by the catalog filter, the nav dropdown and the admin
// product form. `products.category` stores the label itself, so renaming an
// entry here means re-filing every product that used the old name.
export const CATEGORIES = [
  "ინტერიერი",
  "ექსტერიერი",
  "ელექტრონიკა",
  "განათებები",
  "ავტოქიმია",
  "სტიკერები",
  "გამათბობელი",
  "G&M Gift Box",
]

export const fmt = (n) => `${Number(n).toFixed(2)} ₾`

// Category labels are Georgian and one contains a space and an ampersand, so
// they must be encoded before going into the hash route.
export const catalogHref = (category) =>
  category ? `#/catalog/${encodeURIComponent(category)}` : '#/catalog'

/**
 * Pick the right image variant for a product.
 *
 * Small surfaces (cards, search results, thumbnail strips, admin table) pass
 * `thumb: true` to get the ~400px version instead of the 1200px one.
 * Products uploaded before thumbnails existed have an empty thumb_urls, so
 * this falls back to the full image rather than requesting a missing file.
 */
export function productImage(product, { thumb = false, index = 0 } = {}) {
  const full = product?.image_urls?.[index]
  const small = product?.thumb_urls?.[index]
  return (thumb && small) || full || ''
}

// --- Sizes & per-size pricing -----------------------------------------------
//
// `products.sizes` holds a list of { size, price } objects so each size can be
// priced separately (a 60x160 microfibre cloth shouldn't cost the same as a
// 40x40 one).
//
// Everything below deliberately also accepts the OLD shape — a plain array of
// strings — because:
//   * the live site may still be serving a build that wrote plain strings, and
//   * a cached client could hold either shape mid-deploy.
// Normalising in one place keeps that compatibility concern out of every
// component.

/**
 * Normalise product.sizes into [{ size, price }].
 * Old string entries inherit the product's base price.
 */
export function sizeEntries(product) {
  const raw = product?.sizes
  if (!Array.isArray(raw)) return []
  const base = Number(product?.price) || 0
  return raw.map((entry) => unwrapSizeEntry(entry, base)).filter(Boolean)
}

/**
 * Turn a single stored size entry into { size, price }.
 *
 * Handles three shapes, because all three exist in the wild:
 *   1. "40x40 სმ"                      — original text[] format
 *   2. { size: "40x40 სმ", price: 30 } — intended format
 *   3. '{"size":"...","price":30}'     — an object that got stringified by
 *      being written into a text[] column, possibly more than once (nested).
 *
 * Case 3 is why this unwraps recursively rather than trusting the first parse:
 * without it, the whole JSON blob renders as the size's name.
 */
function unwrapSizeEntry(entry, base, depth = 0) {
  if (entry == null || depth > 5) return null

  if (typeof entry === 'string') {
    const text = entry.trim()
    if (!text) return null
    // Only attempt a parse if it actually looks like a JSON object, so a
    // legitimate size name is never mangled.
    if (text.startsWith('{') && text.endsWith('}')) {
      try {
        const parsed = JSON.parse(text)
        const nested = unwrapSizeEntry(parsed, base, depth + 1)
        if (nested) return nested
      } catch {
        // Not valid JSON after all — fall through and treat it as a name.
      }
    }
    return { size: text, price: base }
  }

  if (typeof entry === 'object' && entry.size != null) {
    // The name may itself be a stringified entry (double-encoded); if so the
    // inner value is the more accurate one, including its price.
    const inner = unwrapSizeEntry(entry.size, base, depth + 1)
    if (inner && inner.size !== String(entry.size)) return inner

    const price = Number(entry.price)
    return { size: String(entry.size), price: Number.isFinite(price) ? price : base }
  }

  return null
}

/** Does this product offer sizes at all? */
export function hasSizes(product) {
  return sizeEntries(product).length > 0
}

/**
 * Price for a specific size. Falls back to the product's base price so a size
 * that was removed while sitting in someone's cart can't break checkout.
 */
export function priceForSize(product, size) {
  const base = Number(product?.price) || 0
  if (size == null) return base
  const match = sizeEntries(product).find((e) => e.size === size)
  return match ? match.price : base
}

/** Lowest price across sizes — what the catalog shows as the "from" price. */
export function minPrice(product) {
  const entries = sizeEntries(product)
  if (entries.length === 0) return Number(product?.price) || 0
  return Math.min(...entries.map((e) => e.price))
}

/** Highest price across sizes — used so the catalog price filter can match a
 *  product when ANY of its size options falls inside the requested range. */
export function maxPrice(product) {
  const entries = sizeEntries(product)
  if (entries.length === 0) return Number(product?.price) || 0
  return Math.max(...entries.map((e) => e.price))
}

/** True when sizes don't all cost the same, i.e. show "from X" rather than "X". */
export function hasVariablePricing(product) {
  const prices = sizeEntries(product).map((e) => e.price)
  return prices.length > 1 && new Set(prices).size > 1
}

/**
 * What a product card / search result should display.
 * Returns e.g. { text: "დან 30.00 ₾", from: true }
 */
export function displayPrice(product) {
  const from = hasVariablePricing(product)
  const value = from ? minPrice(product) : Number(product?.price) || 0
  return { text: from ? `დან ${fmt(value)}` : fmt(value), from, value }
}
