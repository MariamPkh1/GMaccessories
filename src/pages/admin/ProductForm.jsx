import { useRef, useState } from 'react'
import AdminLayout from './AdminLayout'
import { useStore } from '../../store'
import { CATEGORIES, sizeEntries } from '../../products'
import { compressAndUploadImage, deleteProductImages } from '../../lib/productImages'

const MAX_IMAGES = 5

const emptyForm = {
  title_ka: '',
  short_description_ka: '',
  description_ka: '',
  price: '',
  category: CATEGORIES[0],
  image_urls: [],
  video_url: '',
  sizes: [],
  specifications: [],
  in_stock: true,
}

const inputClass =
  'w-full border border-outline-variant rounded px-3 py-2.5 text-sm bg-white placeholder:text-secondary focus:outline-none focus:border-primary transition-colors'
const labelClass = 'text-sm font-medium text-on-surface mb-1.5 block'

export default function ProductForm({ mode, id }) {
  const { getProduct, addProduct, updateProduct } = useStore()
  const existing = mode === 'edit' ? getProduct(id) : null
  // sizeEntries normalises legacy plain-string sizes into { size, price } so
  // editing an older product doesn't silently drop its sizes.
  const [form, setForm] = useState(() =>
    existing ? { ...emptyForm, ...existing, sizes: sizeEntries(existing) } : emptyForm,
  )
  const [sizeInput, setSizeInput] = useState('')
  const [sizePriceInput, setSizePriceInput] = useState('')
  const [specKey, setSpecKey] = useState('')
  const [specValue, setSpecValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  // Snapshot of the product's saved images, used to diff on submit so we only
  // delete files from storage that were actually removed and saved — never
  // images the admin is still mid-edit on.
  const originalImageUrlsRef = useRef(existing?.image_urls || [])

  if (mode === 'edit' && !existing) {
    return (
      <AdminLayout active="პროდუქტების მართვა">
        <p className="text-secondary">პროდუქტი ვერ მოიძებნა.</p>
      </AdminLayout>
    )
  }

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    const room = MAX_IMAGES - form.image_urls.length
    const toUpload = files.slice(0, room)
    setError('')
    setUploading(true)
    try {
      const urls = []
      for (const file of toUpload) {
        // eslint-disable-next-line no-await-in-loop
        urls.push(await compressAndUploadImage(file))
      }
      setField('image_urls', [...form.image_urls, ...urls])
    } catch {
      setError('სურათის ატვირთვა ვერ მოხერხდა. სცადეთ თავიდან.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeImage = (idx) => {
    const url = form.image_urls[idx]
    setField(
      'image_urls',
      form.image_urls.filter((_, i) => i !== idx),
    )
    // If this file was uploaded fresh in this editing session (not part of
    // the product's last-saved state), delete it immediately so it doesn't
    // sit orphaned in storage if the admin never saves.
    if (url && !originalImageUrlsRef.current.includes(url)) {
      deleteProductImages([url]).catch(() => {})
    }
  }

  const addSize = (e) => {
    e.preventDefault()
    const name = sizeInput.trim()
    if (!name || form.sizes.some((s) => s.size === name)) return
    // Blank price falls back to the base price, so an owner who doesn't need
    // per-size pricing can still just type names and move on.
    const price = sizePriceInput.trim() === '' ? Number(form.price) || 0 : Number(sizePriceInput)
    setField('sizes', [...form.sizes, { size: name, price }])
    setSizeInput('')
    setSizePriceInput('')
  }

  const removeSize = (name) =>
    setField(
      'sizes',
      form.sizes.filter((s) => s.size !== name),
    )

  const updateSizePrice = (idx, value) =>
    setField(
      'sizes',
      form.sizes.map((s, i) => (i === idx ? { ...s, price: value } : s)),
    )

  const addSpec = (e) => {
    e.preventDefault()
    if (!specKey.trim() || !specValue.trim()) return
    setField('specifications', [...form.specifications, { key: specKey.trim(), value: specValue.trim() }])
    setSpecKey('')
    setSpecValue('')
  }

  const removeSpec = (idx) =>
    setField(
      'specifications',
      form.specifications.filter((_, i) => i !== idx),
    )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title_ka.trim()) {
      setError('სათაური სავალდებულოა.')
      return
    }
    if (!form.price || Number(form.price) <= 0) {
      setError('შეიყვანეთ სწორი ფასი.')
      return
    }
    setError('')
    setSaving(true)

    // Coerce size prices to numbers, defaulting a blank/invalid one to the base
    // price rather than saving NaN.
    const basePrice = Number(form.price)
    const normalisedSizes = form.sizes.map((s) => {
      const p = Number(s.price)
      return { size: s.size, price: Number.isFinite(p) && p > 0 ? p : basePrice }
    })

    // `price` doubles as the catalog's "from" value, so keep it equal to the
    // cheapest size. That way sorting and price filtering keep working off a
    // single column and can't drift out of sync with the sizes.
    const effectivePrice = normalisedSizes.length
      ? Math.min(...normalisedSizes.map((s) => s.price))
      : basePrice

    const payload = { ...form, price: effectivePrice, sizes: normalisedSizes }
    try {
      if (mode === 'edit') {
        await updateProduct(id, payload)
        const removed = originalImageUrlsRef.current.filter((u) => !payload.image_urls.includes(u))
        if (removed.length) await deleteProductImages(removed)
      } else {
        await addProduct(payload)
      }
      window.location.hash = '#/admin/products'
    } catch {
      setError('შენახვა ვერ მოხერხდა — შეამოწმეთ, რომ ადმინის უფლება გაქვთ.')
      setSaving(false)
    }
  }

  return (
    <AdminLayout active={mode === 'edit' ? 'პროდუქტების მართვა' : 'პროდუქტის დამატება'}>
      <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-8">
        {mode === 'edit' ? 'პროდუქტის რედაქტირება' : 'პროდუქტის დამატება'}
      </h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className={labelClass}>დასახელება</label>
          <input
            value={form.title_ka}
            onChange={(e) => setField('title_ka', e.target.value)}
            placeholder="პროდუქტის სახელი"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>მოკლე აღწერა</label>
          <input
            value={form.short_description_ka}
            onChange={(e) => setField('short_description_ka', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>სრული აღწერა</label>
          <textarea
            value={form.description_ka}
            onChange={(e) => setField('description_ka', e.target.value)}
            placeholder="პროდუქტის აღწერა..."
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>ფასი ₾</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setField('price', e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>კატეგორია</label>
            <select
              value={form.category}
              onChange={(e) => setField('category', e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Images */}
        <div>
          <label className={labelClass}>სურათები ({form.image_urls.length}/{MAX_IMAGES})</label>
          {form.image_urls.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {form.image_urls.map((url, i) => (
                <div key={i} className="relative w-20 h-20 border border-outline-variant rounded overflow-hidden bg-surface-container-low">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          {uploading && <p className="text-sm text-secondary mb-2">იტვირთება...</p>}
          {form.image_urls.length < MAX_IMAGES && (
            <label className="border border-dashed border-outline-variant rounded p-6 text-center transition-colors hover:border-primary cursor-pointer flex flex-col items-center gap-2 block">
              <span className="material-symbols-outlined text-secondary text-2xl">upload</span>
              <span className="text-sm text-secondary">ატვირთეთ სურათი</span>
              <span className="text-xs text-secondary">მაქს. {MAX_IMAGES} სურათი</span>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div>
          <label className={labelClass}>
            ვიდეოს ბმული <span className="text-secondary font-normal">(არასავალდებულო)</span>
          </label>
          <input
            value={form.video_url}
            onChange={(e) => setField('video_url', e.target.value)}
            placeholder="https://youtube.com/..."
            className={inputClass}
          />
        </div>

        {/* Sizes + per-size price */}
        <div>
          <label className={labelClass}>ზომები და ფასები</label>
          <p className="text-xs text-secondary mb-3">
            თუ პროდუქტს ზომა არ სჭირდება, გამოტოვეთ. ყოველ ზომას შეიძლება ჰქონდეს
            განსხვავებული ფასი — ცარიელი ფასი აიღებს ძირითად ფასს.
          </p>

          {form.sizes.length > 0 && (
            <div className="space-y-2 mb-3">
              {form.sizes.map((s, i) => (
                <div key={s.size} className="flex items-center gap-2">
                  <span className="flex-1 px-3 py-2 text-sm border border-outline-variant rounded bg-surface-container-low">
                    {s.size}
                  </span>
                  <div className="relative w-32">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={s.price}
                      onChange={(e) => updateSizePrice(i, e.target.value)}
                      className={`${inputClass} pr-7`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-secondary">₾</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSize(s.size)}
                    className="p-2 text-secondary hover:text-error transition-colors"
                    aria-label={`წაშალე ${s.size}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addSize(e)
              }}
              placeholder="ზომა (მაგ. 40x60 სმ)"
              className={`flex-1 ${inputClass}`}
            />
            <div className="relative w-32">
              <input
                type="number"
                min="0"
                step="0.01"
                value={sizePriceInput}
                onChange={(e) => setSizePriceInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addSize(e)
                }}
                placeholder="ფასი"
                className={`${inputClass} pr-7`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-secondary">₾</span>
            </div>
            <button
              type="button"
              onClick={addSize}
              className="px-3 py-2.5 border border-outline-variant rounded text-sm font-medium transition-colors hover:border-primary hover:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>

          {form.sizes.length > 0 && (
            <p className="text-xs text-secondary mt-2">
              კატალოგში გამოჩნდება როგორც „დან{' '}
              {Math.min(...form.sizes.map((s) => Number(s.price) || Number(form.price) || 0)).toFixed(2)} ₾“
            </p>
          )}
        </div>

        {/* Specs */}
        <div>
          <label className={labelClass}>მახასიათებლები</label>
          <p className="text-xs text-secondary mb-3">დაამატეთ იმდენი მახასიათებელი რამდენიც საჭიროა — ან საერთოდ არცერთი</p>
          <div className="space-y-2">
            {form.specifications.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={s.key}
                  onChange={(e) =>
                    setField(
                      'specifications',
                      form.specifications.map((sp, idx) => (idx === i ? { ...sp, key: e.target.value } : sp)),
                    )
                  }
                  placeholder="სახელი"
                  className={`flex-1 ${inputClass}`}
                />
                <input
                  value={s.value}
                  onChange={(e) =>
                    setField(
                      'specifications',
                      form.specifications.map((sp, idx) => (idx === i ? { ...sp, value: e.target.value } : sp)),
                    )
                  }
                  placeholder="მნიშვნელობა"
                  className={`flex-1 ${inputClass}`}
                />
                <button
                  type="button"
                  onClick={() => removeSpec(i)}
                  className="p-2 text-secondary hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              value={specKey}
              onChange={(e) => setSpecKey(e.target.value)}
              placeholder="მახასიათებელი"
              className={`flex-1 ${inputClass}`}
            />
            <input
              value={specValue}
              onChange={(e) => setSpecValue(e.target.value)}
              placeholder="მნიშვნელობა"
              className={`flex-1 ${inputClass}`}
            />
            <button
              type="button"
              onClick={addSpec}
              className="px-3 py-2.5 border border-outline-variant rounded text-sm font-medium transition-colors hover:border-primary hover:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
        </div>

        {/* In stock toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setField('in_stock', !form.in_stock)}
            className={`relative w-10 h-5 rounded-full transition-colors ${form.in_stock ? 'bg-primary' : 'bg-surface-container-highest'}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                form.in_stock ? 'left-5' : 'left-0.5'
              }`}
            />
          </button>
          <span className="text-sm font-medium text-on-surface">მარაგშია</span>
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-primary text-on-primary px-8 py-2.5 rounded text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'ინახება...' : mode === 'edit' ? 'შენახვა' : 'დამატება'}
          </button>
          <a
            href="#/admin/products"
            className="border border-outline-variant px-8 py-2.5 rounded text-sm font-medium transition-colors hover:bg-surface-container-low"
          >
            გაუქმება
          </a>
        </div>
      </form>
    </AdminLayout>
  )
}
