import { useState } from 'react'
import SiteNav from '../components/SiteNav'
import { useStore } from '../store'
import { fmt, productImage } from '../products'
import { useT } from '../i18n'
import Footer from '../components/Footer'

const DELIVERY = 10

function CartItem({ item, onQty, onRemove }) {
  const t = useT()
  // unitPrice comes from the store already resolved for the chosen size.
  const { product, size, quantity, unitPrice } = item
  return (
    <div className="flex gap-4 border border-outline-variant rounded p-4 bg-white">
      <div className="w-24 h-24 shrink-0 border border-outline-variant rounded overflow-hidden bg-surface-container-low">
        <img
          className="w-full h-full object-cover"
          src={productImage(product, { thumb: true })}
          alt={product.title_ka}
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-on-surface truncate">{product.title_ka}</h3>
            {size && <span className="text-xs text-secondary mt-0.5 block">{t('product.size')} {size}</span>}
          </div>
          <button
            onClick={() => onRemove(product.id, size)}
            className="p-1.5 text-secondary hover:text-error transition-colors shrink-0"
            aria-label="remove"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-outline-variant rounded">
            <button
              onClick={() => onQty(product.id, size, -1)}
              className="p-1.5 hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">remove</span>
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => onQty(product.id, size, 1)}
              className="p-1.5 hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">add</span>
            </button>
          </div>
          <p className="text-base font-bold text-on-surface">{fmt(unitPrice * quantity)}</p>
        </div>
      </div>
    </div>
  )
}

function Summary({ subtotal, onSubmit, submitted, submitError }) {
  const t = useT()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [fieldError, setFieldError] = useState('')

  const handleClick = async () => {
    if (!name.trim() || !phone.trim()) {
      setFieldError(t('cart.error.missingContact'))
      return
    }
    setFieldError('')
    setSubmitting(true)
    await onSubmit({ contactName: name.trim(), contactPhone: phone.trim(), notes })
    setSubmitting(false)
  }

  return (
    <aside className="border border-outline-variant rounded p-6 bg-white h-fit lg:sticky lg:top-24">
      <h2 className="text-lg font-bold text-on-surface mb-6">{t('cart.summary')}</h2>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-secondary">{t('cart.itemsTotal')}</span>
          <span className="text-sm font-medium">{fmt(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-secondary">{t('cart.delivery')}</span>
          <span className="text-sm font-medium">{fmt(DELIVERY)}</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-outline-variant">
          <span className="text-base font-semibold text-on-surface">{t('cart.estimatedTotal')}</span>
          <span className="text-xl font-bold text-on-surface">{fmt(subtotal + DELIVERY)}</span>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="text-xs font-medium text-secondary mb-1.5 block">{t('cart.fullName')}</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('cart.fullNamePlaceholder')}
            className="w-full border border-outline-variant rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-secondary mb-1.5 block">{t('cart.phone')}</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="5XX XX XX XX"
            inputMode="tel"
            className="w-full border border-outline-variant rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('cart.notesPlaceholder')}
          rows={2}
          className="w-full border border-outline-variant rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
        />
      </div>

      <button
        onClick={handleClick}
        disabled={submitted || submitting}
        className="w-full bg-primary text-on-primary py-3 text-sm font-semibold rounded transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitted ? t('cart.submitted') : submitting ? t('cart.submitting') : t('cart.submit')}
      </button>
      {fieldError && <p className="text-error text-xs text-center mt-3">{fieldError}</p>}
      {submitError && <p className="text-error text-xs text-center mt-3">{submitError}</p>}
      <p className="text-xs text-secondary mt-3 text-center leading-relaxed">
        {t('cart.noOnlinePayment')}
      </p>
    </aside>
  )
}

function EmptyCart() {
  const t = useT()
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center w-full">
      <span className="material-symbols-outlined text-outline text-5xl mb-4">shopping_bag</span>
      <p className="text-lg text-secondary mb-6">{t('cart.empty')}</p>
      <a
        href="#/catalog"
        className="bg-primary text-on-primary px-6 py-2.5 text-sm font-semibold rounded transition-opacity hover:opacity-90"
      >
        {t('catalog.goToCatalog')}
      </a>
    </div>
  )
}

function OrderSubmitted() {
  const t = useT()
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center w-full">
      <span className="material-symbols-outlined text-primary text-5xl mb-4">check_circle</span>
      <h2 className="text-xl font-bold text-on-surface mb-2">{t('cart.success.title')}</h2>
      <p className="text-secondary mb-6">{t('cart.success.body')}</p>
      <a
        href="#/orders"
        className="bg-primary text-on-primary px-6 py-2.5 text-sm font-semibold rounded transition-opacity hover:opacity-90"
      >
        {t('cart.success.viewOrders')}
      </a>
    </div>
  )
}

export default function Cart() {
  const { cartItems, changeQty, removeFromCart, cartSubtotal, submitOrder } = useStore()
  const t = useT()
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const count = cartItems.reduce((sum, it) => sum + it.quantity, 0)

  const handleSubmit = async (contactInfo) => {
    setSubmitError('')
    try {
      await submitOrder(contactInfo)
      setSubmitted(true)
    } catch {
      setSubmitError(t('cart.error.submitFailed'))
    }
  }

  return (
    <>
      <SiteNav active="cart" />
      <main className="px-container-padding py-12 md:py-16 w-full min-h-screen">
        <div className="flex items-end justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-headline-lg text-on-surface">{t('cart.title')}</h1>
          {!submitted && cartItems.length > 0 && (
            <p className="text-sm text-secondary">{t('cart.itemCount', { count })}</p>
          )}
        </div>

        {submitted ? (
          <OrderSubmitted />
        ) : cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={`${item.productId}-${item.size ?? ''}`}
                  item={item}
                  onQty={changeQty}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
            <div className="lg:col-span-1">
              <Summary
                subtotal={cartSubtotal}
                onSubmit={handleSubmit}
                submitted={submitted}
                submitError={submitError}
              />
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </main>
      <Footer />
    </>
  )
}
