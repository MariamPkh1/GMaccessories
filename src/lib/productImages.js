import imageCompression from 'browser-image-compression'
import { supabase } from './supabase'

const BUCKET = 'product-images'

// Compress client-side before upload to stay within the free-tier storage/
// egress budget: ~200KB target, capped at 1200px on the long edge, output WebP.
export async function compressAndUploadImage(file) {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 1200,
    fileType: 'image/webp',
    useWebWorker: true,
  })
  const path = `${crypto.randomUUID()}.webp`
  const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
    contentType: 'image/webp',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// The products table only stores public URLs (per the fixed schema), so to
// delete a file later we recover its storage path from the URL shape
// Supabase always generates: .../object/public/<bucket>/<path>.
function pathFromPublicUrl(url) {
  const marker = `/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return decodeURIComponent(url.slice(idx + marker.length))
}

export async function deleteProductImages(urls) {
  const paths = (urls || []).map(pathFromPublicUrl).filter(Boolean)
  if (paths.length === 0) return
  await supabase.storage.from(BUCKET).remove(paths)
}
