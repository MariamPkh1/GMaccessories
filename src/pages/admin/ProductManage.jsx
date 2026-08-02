import { useMemo, useState } from 'react'
import AdminLayout from './AdminLayout'
import { useStore } from '../../store'
import { fmt } from '../../products'
import { deleteProductImages } from '../../lib/productImages'

function DeleteConfirm({ product, deleting, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white border border-outline-variant rounded shadow-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-bold text-on-surface mb-3">პროდუქტის წაშლა</h3>
        <p className="text-sm text-secondary mb-6">
          დარწმუნებული ხართ, რომ გსურთ წაშალოთ „{product.title_ka}“? ეს მოქმედება შეუქცევადია.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-grow bg-error text-white py-2.5 rounded text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {deleting ? 'იშლება...' : 'წაშლა'}
          </button>
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-grow border border-outline-variant py-2.5 rounded text-sm font-medium hover:bg-surface-container-low transition-colors disabled:opacity-50"
          >
            გაუქმება
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductManage() {
  const { products, deleteProduct } = useStore()
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () => products.filter((p) => p.title_ka.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  )

  return (
    <AdminLayout active="პროდუქტების მართვა">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">პროდუქტების მართვა</h1>
        <a
          href="#/admin/products/new"
          className="bg-primary text-on-primary px-5 py-2.5 rounded text-sm font-semibold transition-opacity hover:opacity-90"
        >
          + პროდუქტის დამატება
        </a>
      </div>

      <div className="relative max-w-md mb-6">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">
          search
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ძიება..."
          className="w-full border border-outline-variant rounded pl-9 pr-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="border border-outline-variant rounded overflow-hidden bg-white">
        {filtered.length === 0 ? (
          <p className="text-secondary p-6">პროდუქტები ვერ მოიძებნა.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">
                    პროდუქტი
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">
                    კატეგორია
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">
                    ფასი
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">
                    სტატუსი
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">
                    მოქმედება
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-outline-variant last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-outline-variant rounded overflow-hidden shrink-0 bg-surface-container-low">
                          {p.image_urls?.[0] && (
                            <img src={p.image_urls[0]} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-on-surface">{p.title_ka}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface">{p.category}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-on-surface">{fmt(p.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                          p.in_stock ? 'bg-green-50 text-green-700' : 'bg-error-container text-on-error-container'
                        }`}
                      >
                        {p.in_stock ? 'მარაგში' : 'არ არის მარაგში'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <a
                          href={`#/admin/products/${p.id}/edit`}
                          className="p-1.5 text-secondary hover:text-primary transition-colors"
                          aria-label="რედაქტირება"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </a>
                        <button
                          onClick={() => setPendingDelete(p)}
                          className="p-1.5 text-secondary hover:text-error transition-colors"
                          aria-label="წაშლა"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {error && <p className="text-error text-sm mt-4">{error}</p>}

      {pendingDelete && (
        <DeleteConfirm
          product={pendingDelete}
          deleting={deleting}
          onCancel={() => setPendingDelete(null)}
          onConfirm={async () => {
            setDeleting(true)
            setError('')
            try {
              // Remove storage files first — orphaned files silently consume
              // the storage quota if the row is deleted without cleaning them up.
              await deleteProductImages(pendingDelete.image_urls)
              await deleteProduct(pendingDelete.id)
              setPendingDelete(null)
            } catch {
              setError('წაშლა ვერ მოხერხდა — შეამოწმეთ, რომ ადმინის უფლება გაქვთ.')
            } finally {
              setDeleting(false)
            }
          }}
        />
      )}
    </AdminLayout>
  )
}
