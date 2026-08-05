import { supabase } from './supabase'

const BUCKET = 'product-images'

// Full-size image shown on the product detail page. Rendered up to ~440 CSS px
// there, so 1400px keeps it sharp on 2x/3x displays.
const FULL_MAX_PX = 1400
const FULL_QUALITY = 0.85

// Small variant for catalog cards, search results and thumbnail strips.
// Cards render at ~300-440 CSS px, which is up to ~880 device px on a retina
// screen — a 400px thumbnail looked visibly soft, so this is deliberately
// larger than the CSS size.
const THUMB_MAX_PX = 800
const THUMB_QUALITY = 0.8

// Generous ceilings, used only as a safety net for pathological images. These
// are NOT the target: dimensions and quality come first, because letting a byte
// budget drive the resize is what produced 446px "full-size" images.
const FULL_MAX_BYTES = 400 * 1024
const THUMB_MAX_BYTES = 120 * 1024

// Browsers cache for a year. Safe because object names are UUIDs: replacing an
// image produces a new URL, so a stale file can never be served. Without this
// Supabase's 1-hour default made every returning visitor re-download the lot.
const CACHE_CONTROL = '31536000'

/**
 * Draw a bitmap onto a canvas scaled to fit `maxPx` on its long edge, then
 * encode it as WebP.
 *
 * Encoding is done here rather than delegated to a library so that the output
 * format is a guarantee: files were previously landing in storage still
 * PNG-encoded despite asking for conversion.
 *
 * Only ever scales down — a 500px source stays 500px rather than being
 * upscaled into blur.
 */
async function encodeWebp(source, maxPx, quality) {
  // `imageOrientation: 'from-image'` honours EXIF rotation, so portrait photos
  // taken on a phone don't come out sideways.
  const bitmap =
    source instanceof ImageBitmap
      ? source
      : await createImageBitmap(source, { imageOrientation: 'from-image' })

  const scale = Math.min(1, maxPx / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)

  const ctx = canvas.getContext('2d')
  // Default smoothing point-samples on large reductions, which makes fine
  // detail (text on packaging, fabric texture) look gritty.
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

  const out = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/webp', quality),
  )
  if (!out) throw new Error('WebP encoding failed')
  return out
}

/**
 * Resize to `maxPx` on the long edge and encode as WebP at a fixed quality.
 *
 * Done entirely on canvas rather than via browser-image-compression. That
 * library's `maxSizeMB` reduces *dimensions* as well as quality to hit a byte
 * target, which silently overrode maxWidthOrHeight and produced 446px
 * "full-size" images — visibly soft. Here dimensions are guaranteed and quality
 * is the only thing that ever moves.
 *
 * `maxBytes` is a safety net for pathological images (huge, noisy), not a
 * target: quality only steps down if the file is genuinely oversized, and never
 * below a floor that would look bad.
 */
async function toWebp(bitmap, { maxPx, quality, maxBytes }) {
  let q = quality
  let out = await encodeWebp(bitmap, maxPx, q)
  while (out.size > maxBytes && q > 0.6) {
    q = Math.max(0.6, q - 0.1)
    // eslint-disable-next-line no-await-in-loop
    out = await encodeWebp(bitmap, maxPx, q)
  }
  return out
}

async function uploadWebp(blob) {
  const path = `${crypto.randomUUID()}.webp`
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: 'image/webp',
    cacheControl: CACHE_CONTROL,
    upsert: false,
  })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

/**
 * Produce and upload both variants of a product image.
 *
 * `sourcePx` is the long edge of the *original* file. Because we never upscale,
 * a source smaller than FULL_MAX_PX caps how sharp the result can be — the
 * admin form uses this to warn instead of silently publishing a soft photo.
 *
 * @returns {{ url: string, thumbUrl: string, sourcePx: number }}
 */
export async function compressAndUploadImage(file) {
  // Decode once and reuse for both variants: decoding is the expensive step,
  // and it also lets us report the true source resolution.
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const sourcePx = Math.max(bitmap.width, bitmap.height)

  let full
  let thumb
  try {
    // Sequential rather than Promise.all — canvas encoding is single-threaded,
    // so running both at once only doubles peak memory.
    full = await toWebp(bitmap, {
      maxPx: FULL_MAX_PX,
      quality: FULL_QUALITY,
      maxBytes: FULL_MAX_BYTES,
    })
    thumb = await toWebp(bitmap, {
      maxPx: THUMB_MAX_PX,
      quality: THUMB_QUALITY,
      maxBytes: THUMB_MAX_BYTES,
    })
  } finally {
    bitmap.close?.()
  }

  const [url, thumbUrl] = await Promise.all([uploadWebp(full), uploadWebp(thumb)])
  return { url, thumbUrl, sourcePx }
}

/** Below this, a source photo can't render sharply on the product page. */
export const MIN_RECOMMENDED_PX = 1000

// The products table stores public URLs, so to delete a file later we recover
// its storage path from the URL shape Supabase always generates:
// .../object/public/<bucket>/<path>.
function pathFromPublicUrl(url) {
  const marker = `/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return decodeURIComponent(url.slice(idx + marker.length))
}

/** Accepts full and/or thumbnail URLs; ignores anything not in our bucket. */
export async function deleteProductImages(urls) {
  const paths = (urls || []).filter(Boolean).map(pathFromPublicUrl).filter(Boolean)
  if (paths.length === 0) return
  await supabase.storage.from(BUCKET).remove(paths)
}
