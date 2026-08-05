import SiteNav from '../components/SiteNav'
import { useStore } from '../store'
import { fmt, productImage } from '../products'

const STATUS_LABELS = {
  pending: 'მოლოდინში',
  contacted: 'დაკავშირებულია',
  confirmed: 'დადასტურებულია',
  arrived: 'ჩამოსულია',
  completed: 'დასრულებულია',
  cancelled: 'გაუქმებულია',
}

function OrderCard({ order }) {
  const items = order.order_items || []
  const total = items.reduce((sum, i) => sum + i.price_at_order * i.quantity, 0)
  return (
    <div className="border border-outline-variant rounded p-6 bg-white">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-outline-variant">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-secondary">
            შეკვეთა #{order.id.slice(0, 8)}
          </p>
          <p className="text-xs text-secondary mt-1">
            {new Date(order.created_at).toLocaleDateString('ka-GE')}
          </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-primary border border-primary rounded px-2.5 py-1">
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {item.products?.image_urls?.[0] && (
                <img
                  src={productImage(item.products, { thumb: true })}
                  alt=""
                  className="w-12 h-12 object-cover rounded border border-outline-variant bg-surface-container-low flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-sm text-on-surface truncate">
                  {item.products?.title_ka || 'პროდუქტი წაშლილია'}
                </p>
                {item.size && <p className="text-xs text-secondary">ზომა: {item.size}</p>}
              </div>
            </div>
            <p className="text-sm text-secondary flex-shrink-0">
              {item.quantity} x {fmt(item.price_at_order)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-outline-variant flex justify-between font-bold text-on-surface">
        <span>ჯამი</span>
        <span>{fmt(total)}</span>
      </div>
    </div>
  )
}

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined text-outline text-5xl mb-4">receipt_long</span>
      <p className="text-lg text-secondary mb-2">შეკვეთები არ გაქვთ</p>
      <p className="text-sm text-secondary mb-6">
        გაგზავნეთ შეკვეთის მოთხოვნა კალათიდან და აქ ნახავთ მის სტატუსს
      </p>
      <a
        href="#/catalog"
        className="bg-primary text-on-primary px-6 py-2.5 text-sm font-semibold rounded transition-opacity hover:opacity-90"
      >
        კატალოგზე გადასვლა
      </a>
    </div>
  )
}

export default function Orders() {
  const { orders, ordersLoading } = useStore()
  return (
    <>
      <SiteNav active="ჩემი შეკვეთები" />
      <main className="px-container-padding py-12 md:py-16 max-w-[1000px] mx-auto min-h-screen">
        <h1 className="text-3xl md:text-4xl font-headline-lg text-on-surface mb-8">ჩემი შეკვეთები</h1>
        {ordersLoading ? (
          <p className="text-secondary text-center py-24">იტვირთება...</p>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyOrders />
        )}
      </main>
    </>
  )
}
