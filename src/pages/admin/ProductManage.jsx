import { useState } from 'react'
import AdminLayout from './AdminLayout'
import { useStore } from '../../store'
import { fmt } from '../../products'
import { deleteProductImages } from '../../lib/productImages'

function DeleteConfirm({ product, deleting, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-surface p-8 max-w-sm w-full">
        <h3 className="font-headline-lg text-headline-lg text-primary mb-4">პროდუქტის წაშლა</h3>
        <p className="text-on-surface-variant font-body-md mb-8">
          დარწმუნებული ხართ, რომ გსურთ წაშალოთ „{product.title_ka}“? ეს მოქმედება შეუქცევადია.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-grow bg-error text-white py-3 font-button-text text-button-text hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {deleting ? 'იშლება...' : 'წაშლა'}
          </button>
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-grow border border-outline-variant py-3 font-button-text text-button-text hover:bg-surface-container-low transition-colors disabled:opacity-50"
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

  return (
    <AdminLayout active="პროდუქტების მართვა">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-headline-lg text-headline-lg text-primary">პროდუქტების მართვა</h2>
        <a
          href="#/admin/products/new"
          className="bg-primary-container text-on-primary-container px-6 py-3 font-button-text text-button-text hover:bg-primary transition-colors"
        >
          + პროდუქტის დამატება
        </a>
      </div>

      {products.length === 0 ? (
        <p className="text-secondary font-body-md">პროდუქტები ვერ მოიძებნა.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="py-3 font-label-sm text-label-sm text-secondary uppercase tracking-widest">სურათი</th>
                <th className="py-3 font-label-sm text-label-sm text-secondary uppercase tracking-widest">სათაური</th>
                <th className="py-3 font-label-sm text-label-sm text-secondary uppercase tracking-widest">კატეგორია</th>
                <th className="py-3 font-label-sm text-label-sm text-secondary uppercase tracking-widest">ფასი</th>
                <th className="py-3 font-label-sm text-label-sm text-secondary uppercase tracking-widest">მარაგი</th>
                <th className="py-3 font-label-sm text-label-sm text-secondary uppercase tracking-widest">მოქმედება</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-outline-variant">
                  <td className="py-3 pr-4">
                    <div className="w-14 h-14 bg-surface-container overflow-hidden">
                      {p.image_urls?.[0] && (
                        <img src={p.image_urls[0]} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-body-md text-on-surface">{p.title_ka}</td>
                  <td className="py-3 pr-4 font-label-sm text-label-sm text-secondary">{p.category}</td>
                  <td className="py-3 pr-4 font-body-md">{fmt(p.price)}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`font-label-sm text-label-sm px-2 py-1 border ${
                        p.in_stock ? 'border-primary text-primary' : 'border-error text-error'
                      }`}
                    >
                      {p.in_stock ? 'მარაგშია' : 'ამოწურულია'}
                    </span>
                  </td>
                  <td className="py-3 flex items-center gap-4">
                    <a
                      href={`#/admin/products/${p.id}/edit`}
                      className="text-secondary hover:text-primary transition-colors"
                      aria-label="რედაქტირება"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </a>
                    <button
                      onClick={() => setPendingDelete(p)}
                      className="text-secondary hover:text-error transition-colors"
                      aria-label="წაშლა"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && <p className="text-error font-label-sm text-label-sm mt-4">{error}</p>}

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
