import { useRef, useState } from 'react'
import AdminLayout from './AdminLayout'
import { useStore } from '../../store'
import { CATEGORIES } from '../../products'
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

export default function ProductForm({ mode, id }) {
  const { getProduct, addProduct, updateProduct } = useStore()
  const existing = mode === 'edit' ? getProduct(id) : null
  const [form, setForm] = useState(() => (existing ? { ...emptyForm, ...existing } : emptyForm))
  const [sizeInput, setSizeInput] = useState('')
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
        <p className="text-secondary font-body-md">პროდუქტი ვერ მოიძებნა.</p>
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
    const v = sizeInput.trim()
    if (!v || form.sizes.includes(v)) return
    setField('sizes', [...form.sizes, v])
    setSizeInput('')
  }

  const removeSize = (v) =>
    setField(
      'sizes',
      form.sizes.filter((s) => s !== v),
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
    const payload = { ...form, price: Number(form.price) }
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
      <h2 className="font-headline-lg text-headline-lg text-primary mb-8">
        {mode === 'edit' ? 'პროდუქტის რედაქტირება' : 'ახალი პროდუქტის დამატება'}
      </h2>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        <div className="space-y-4">
          <label className="block">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">სათაური</span>
            <input
              value={form.title_ka}
              onChange={(e) => setField('title_ka', e.target.value)}
              className="mt-2 w-full border border-outline-variant px-4 py-3 font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
          <label className="block">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
              მოკლე აღწერა
            </span>
            <input
              value={form.short_description_ka}
              onChange={(e) => setField('short_description_ka', e.target.value)}
              className="mt-2 w-full border border-outline-variant px-4 py-3 font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
          <label className="block">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
              სრული აღწერა
            </span>
            <textarea
              value={form.description_ka}
              onChange={(e) => setField('description_ka', e.target.value)}
              rows={4}
              className="mt-2 w-full border border-outline-variant px-4 py-3 font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">ფასი (₾)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setField('price', e.target.value)}
                className="mt-2 w-full border border-outline-variant px-4 py-3 font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </label>
            <label className="block">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">კატეგორია</span>
              <select
                value={form.category}
                onChange={(e) => setField('category', e.target.value)}
                className="mt-2 w-full border border-outline-variant px-4 py-3 font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
              ვიდეოს ბმული (YouTube/TikTok/Instagram)
            </span>
            <input
              value={form.video_url}
              onChange={(e) => setField('video_url', e.target.value)}
              placeholder="https://..."
              className="mt-2 w-full border border-outline-variant px-4 py-3 font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.in_stock}
              onChange={(e) => setField('in_stock', e.target.checked)}
              className="w-5 h-5"
            />
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
              მარაგშია
            </span>
          </label>
        </div>

        <div>
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block mb-3">
            სურათები ({form.image_urls.length}/{MAX_IMAGES})
          </span>
          <div className="flex flex-wrap gap-4 mb-4">
            {form.image_urls.map((url, i) => (
              <div key={i} className="relative w-24 h-24 bg-surface-container overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {uploading && (
            <p className="font-label-sm text-label-sm text-secondary mb-2">იტვირთება...</p>
          )}
          {form.image_urls.length < MAX_IMAGES && (
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={handleImageSelect}
            />
          )}
        </div>

        <div>
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block mb-3">
            ზომები (არასავალდებულო)
          </span>
          <div className="flex flex-wrap gap-2 mb-3">
            {form.sizes.map((s) => (
              <span
                key={s}
                className="flex items-center gap-2 border border-outline px-3 py-1 font-label-sm text-label-sm"
              >
                {s}
                <button type="button" onClick={() => removeSize(s)} aria-label={`წაშალე ${s}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addSize(e)
              }}
              placeholder="მაგ. M (38cm)"
              className="flex-grow border border-outline-variant px-4 py-2 font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={addSize}
              className="border border-outline-variant px-4 py-2 font-label-sm text-label-sm hover:bg-surface-container-low transition-colors"
            >
              დამატება
            </button>
          </div>
        </div>

        <div>
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block mb-3">
            მახასიათებლები (არასავალდებულო)
          </span>
          <div className="space-y-2 mb-3">
            {form.specifications.map((s, i) => (
              <div key={i} className="flex items-center justify-between border-b border-outline-variant pb-2">
                <span className="font-body-md">
                  <span className="font-bold">{s.key}:</span> {s.value}
                </span>
                <button type="button" onClick={() => removeSpec(i)} aria-label="წაშალე მახასიათებელი">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={specKey}
              onChange={(e) => setSpecKey(e.target.value)}
              placeholder="მახასიათებელი"
              className="flex-grow border border-outline-variant px-4 py-2 font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              value={specValue}
              onChange={(e) => setSpecValue(e.target.value)}
              placeholder="მნიშვნელობა"
              className="flex-grow border border-outline-variant px-4 py-2 font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={addSpec}
              className="border border-outline-variant px-4 py-2 font-label-sm text-label-sm hover:bg-surface-container-low transition-colors"
            >
              დამატება
            </button>
          </div>
        </div>

        {error && <p className="text-error font-label-sm text-label-sm">{error}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-primary-container text-on-primary-container px-10 py-3 font-button-text text-button-text hover:bg-primary transition-colors disabled:opacity-50"
          >
            {saving ? 'ინახება...' : mode === 'edit' ? 'შენახვა' : 'დამატება'}
          </button>
          <a
            href="#/admin/products"
            className="border border-outline-variant px-10 py-3 font-button-text text-button-text hover:bg-surface-container-low transition-colors"
          >
            გაუქმება
          </a>
        </div>
      </form>
    </AdminLayout>
  )
}
