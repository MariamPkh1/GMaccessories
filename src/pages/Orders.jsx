import SiteNav from '../components/SiteNav'
import { useStore } from '../store'
import { fmt } from '../products'

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
    <div className="border border-outline-variant p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-outline-variant">
        <div>
          <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
            შეკვეთა #{order.id.slice(0, 8)}
          </p>
          <p className="font-label-sm text-label-sm text-secondary mt-1">
            {new Date(order.created_at).toLocaleDateString('ka-GE')}
          </p>
        </div>
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary border border-primary px-3 py-1">
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {item.products?.image_urls?.[0] && (
                <img
                  src={item.products.image_urls[0]}
                  alt=""
                  className="w-12 h-12 object-cover bg-surface-container flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="font-body-md text-body-md text-on-surface truncate">
                  {item.products?.title_ka || 'პროდუქტი წაშლილია'}
                </p>
                {item.size && (
                  <p className="font-label-sm text-label-sm text-secondary">ზომა: {item.size}</p>
                )}
              </div>
            </div>
            <p className="font-label-sm text-label-sm text-secondary flex-shrink-0">
              {item.quantity} x {fmt(item.price_at_order)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-outline-variant flex justify-between font-body-md font-bold">
        <span>ჯამი</span>
        <span>{fmt(total)}</span>
      </div>
    </div>
  )
}

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined text-outline text-6xl mb-4">receipt_long</span>
      <h2 className="font-headline-lg text-headline-lg text-primary">შეკვეთები არ გაქვთ</h2>
      <p className="text-secondary mt-2 mb-8">
        გაგზავნეთ შეკვეთის მოთხოვნა კალათიდან და აქ ნახავთ მის სტატუსს
      </p>
      <a
        href="#/catalog"
        className="bg-primary-container text-on-primary-container px-10 py-4 font-button-text text-button-text hover:bg-primary transition-colors"
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
      <main className="min-h-screen px-container-padding py-stack-lg max-w-[1000px] mx-auto">
        <header className="mb-12 border-b border-outline-variant pb-6">
          <h1 className="font-display-lg text-display-lg text-primary">ჩემი შეკვეთები</h1>
        </header>
        {ordersLoading ? (
          <p className="text-secondary font-body-md text-center py-24">იტვირთება...</p>
        ) : orders.length > 0 ? (
          <div className="space-y-8">
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
