import { Fragment, useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'
import { fmt } from '../../products'

const STATUS_OPTIONS = [
  { id: 'pending', label: 'მოლოდინში' },
  { id: 'contacted', label: 'დაკავშირებულია' },
  { id: 'confirmed', label: 'დადასტურებულია' },
  { id: 'arrived', label: 'ჩამოსულია' },
  { id: 'completed', label: 'დასრულებულია' },
  { id: 'cancelled', label: 'გაუქმებულია' },
]

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      // order_items -> products has a real FK PostgREST can embed directly.
      // orders -> profiles doesn't (both reference auth.users separately, not
      // each other), so customer names are joined client-side below.
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*, order_items(*, products(title_ka, image_urls))')
        .order('created_at', { ascending: false })

      if (!active) return
      if (ordersError) {
        setError('შეკვეთების ჩატვირთვა ვერ მოხერხდა.')
        setLoading(false)
        return
      }

      const userIds = [...new Set((ordersData || []).map((o) => o.user_id))]
      let profileMap = {}
      if (userIds.length) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds)
        profileMap = Object.fromEntries((profilesData || []).map((p) => [p.id, p]))
      }

      if (!active) return
      setOrders((ordersData || []).map((o) => ({ ...o, customer: profileMap[o.user_id] })))
      setLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const handleStatusChange = async (orderId, status) => {
    const previous = orders
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
    const { error: updateError } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (updateError) {
      setOrders(previous)
      setError('სტატუსის განახლება ვერ მოხერხდა.')
    }
  }

  return (
    <AdminLayout active="შეკვეთები">
      <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-8">შეკვეთები</h1>

      {error && <p className="text-error text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-secondary">იტვირთება...</p>
      ) : orders.length === 0 ? (
        <p className="text-secondary">შეკვეთები ჯერ არ არის.</p>
      ) : (
        <div className="border border-outline-variant rounded overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">თარიღი</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">მომხმარებელი</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">ნივთები</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">ჯამი</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">სტატუსი</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const items = order.order_items || []
                  const total = items.reduce((s, i) => s + i.price_at_order * i.quantity, 0)
                  return (
                    <Fragment key={order.id}>
                      <tr
                        className="border-b border-outline-variant last:border-b-0 cursor-pointer hover:bg-surface-container-low transition-colors"
                        onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-primary">#{order.id.slice(0, 8)}</td>
                        <td className="px-4 py-3 text-sm text-on-surface">
                          {new Date(order.created_at).toLocaleDateString('ka-GE')}
                        </td>
                        <td className="px-4 py-3 text-sm text-on-surface">
                          {order.contact_name || order.customer?.full_name || 'უცნობი'}
                        </td>
                        <td className="px-4 py-3 text-sm text-on-surface">{items.length} ნივთი</td>
                        <td className="px-4 py-3 text-sm font-semibold text-on-surface">{fmt(total)}</td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-medium border border-outline-variant rounded px-2 py-1 bg-white focus:outline-none focus:border-primary"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                      {expanded === order.id && (
                        <tr>
                          <td colSpan={6} className="border-b border-outline-variant bg-surface-container-low p-6">
                            <div className="space-y-4">
                              <h3 className="text-sm font-semibold text-on-surface">
                                შეკვეთის დეტალები — #{order.id.slice(0, 8)}
                              </h3>
                              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-secondary text-xs mb-1">სახელი</p>
                                  <p className="font-medium text-on-surface">
                                    {order.contact_name || order.customer?.full_name || 'უცნობი'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-secondary text-xs mb-1">ტელეფონი</p>
                                  <p className="font-medium text-on-surface">{order.contact_phone || '—'}</p>
                                </div>
                              </div>
                              {order.notes && (
                                <div>
                                  <p className="text-secondary text-xs mb-1">შენიშვნა</p>
                                  <p className="text-sm text-on-surface">{order.notes}</p>
                                </div>
                              )}
                              <div className="border border-outline-variant rounded bg-white p-4">
                                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
                                  ნივთები
                                </p>
                                <div className="space-y-2">
                                  {items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between text-sm gap-4">
                                      <span className="text-on-surface min-w-0 truncate">
                                        {item.products?.title_ka || 'პროდუქტი წაშლილია'}
                                        {item.size && <span className="text-secondary ml-2">({item.size})</span>}
                                      </span>
                                      <span className="text-secondary shrink-0">x{item.quantity}</span>
                                      <span className="font-medium text-on-surface shrink-0">
                                        {fmt(item.price_at_order * item.quantity)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex justify-between pt-3 mt-3 border-t border-outline-variant">
                                  <span className="text-sm font-semibold text-on-surface">ჯამი</span>
                                  <span className="text-base font-bold text-on-surface">{fmt(total)}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
