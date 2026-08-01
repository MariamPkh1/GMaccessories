import { useState } from 'react'
import SiteNav from '../components/SiteNav'
import { useStore } from '../store'
import { fmt } from '../products'

const DELIVERY = 10

function CartItem({ item, onQty, onRemove }) {
  const { product, size, quantity } = item
  return (
    <div className="group flex flex-col md:flex-row gap-8 py-6 border-b border-outline-variant item-transition">
      <div className="w-full md:w-48 h-48 bg-surface-container overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          src={product.image_urls?.[0]}
          alt={product.title_ka}
          loading="lazy"
        />
      </div>
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-body-md font-bold text-on-surface">{product.title_ka}</h3>
            {size && <p className="font-label-sm text-label-sm text-secondary">ზომა: {size}</p>}
          </div>
          <button
            onClick={() => onRemove(product.id, size)}
            className="text-secondary hover:text-error transition-colors p-2"
            aria-label="remove"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="mt-auto flex justify-between items-end">
          <div className="flex items-center border border-outline-variant">
            <button
              onClick={() => onQty(product.id, size, -1)}
              className="px-3 py-1 hover:bg-surface-container-low transition-colors"
            >
              -
            </button>
            <span className="px-4 py-1 font-label-sm border-x border-outline-variant">{quantity}</span>
            <button
              onClick={() => onQty(product.id, size, 1)}
              className="px-3 py-1 hover:bg-surface-container-low transition-colors"
            >
              +
            </button>
          </div>
          <p className="font-body-md font-bold">{fmt(product.price * quantity)}</p>
        </div>
      </div>
    </div>
  )
}

function Summary({ subtotal, onSubmit, submitted, submitError }) {
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleClick = async () => {
    setSubmitting(true)
    await onSubmit({ contactPhone: phone, notes })
    setSubmitting(false)
  }

  return (
    <aside className="w-full lg:w-[380px] h-fit lg:sticky lg:top-8 bg-surface-container-low p-8 space-y-8">
      <h4 className="font-headline-lg text-[24px] text-primary">ჯამი</h4>
      <div className="space-y-4">
        <div className="flex justify-between font-label-sm text-label-sm text-secondary uppercase tracking-widest">
          <span>ნივთების ღირებულება</span>
          <span>{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between font-label-sm text-label-sm text-secondary uppercase tracking-widest">
          <span>მიწოდება</span>
          <span>{fmt(DELIVERY)}</span>
        </div>
        <div className="h-px bg-outline-variant my-4" />
        <div className="flex justify-between font-body-md font-bold text-on-surface text-lg">
          <span>სავარაუდო ჯამი</span>
          <span>{fmt(subtotal + DELIVERY)}</span>
        </div>
      </div>
      <div className="space-y-3">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="საკონტაქტო ნომერი"
          className="w-full border border-outline-variant px-4 py-3 font-body-md bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="შენიშვნა (არასავალდებულო)"
          rows={2}
          className="w-full border border-outline-variant px-4 py-3 font-body-md bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="space-y-4">
        <button
          onClick={handleClick}
          disabled={submitted || submitting}
          className="w-full py-4 bg-primary-container text-on-primary-container font-button-text text-button-text hover:bg-primary transition-all duration-300 disabled:opacity-60"
        >
          {submitted ? "გაგზავნილია" : submitting ? "იგზავნება..." : "შეკვეთის გაგზავნა"}
        </button>
        {submitError && (
          <p className="text-error font-label-sm text-label-sm text-center">{submitError}</p>
        )}
        <p className="text-[10px] text-center text-secondary uppercase tracking-widest leading-relaxed">
          ეს არის მოთხოვნა შესყიდვაზე — გადახდა არ ხდება ონლაინ. ჩვენი გუნდი
          დაგიკავშირდებათ დეტალების დასაზუსტებლად.
        </p>
      </div>
    </aside>
  )
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center w-full">
      <span className="material-symbols-outlined text-outline text-6xl mb-4">
        shopping_bag
      </span>
      <h2 className="font-headline-lg text-headline-lg text-primary">
        თქვენი კალათა ცარიელია
      </h2>
      <p className="text-secondary mt-2 mb-8">
        დაათვალიერეთ ჩვენი კატალოგი და დაამატეთ სასურველი ნივთები
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

function OrderSubmitted() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center w-full">
      <span className="material-symbols-outlined text-primary text-6xl mb-4">check_circle</span>
      <h2 className="font-headline-lg text-headline-lg text-primary">შეკვეთის მოთხოვნა გაგზავნილია</h2>
      <p className="text-secondary mt-2 mb-8">
        ჩვენი გუნდი მალე დაგიკავშირდებათ. სტატუსის ნახვა შეგიძლიათ „ჩემი შეკვეთების“ გვერდზე.
      </p>
      <a
        href="#/orders"
        className="bg-primary-container text-on-primary-container px-10 py-4 font-button-text text-button-text hover:bg-primary transition-colors"
      >
        ჩემი შეკვეთების ნახვა
      </a>
    </div>
  )
}

function Footer() {
  const links = ["Facebook", "Instagram", "TikTok", "YouTube"]
  return (
    <footer className="bg-surface border-t border-outline-variant mt-20">
      <div className="max-w-[1800px] mx-auto px-container-padding py-stack-md flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-headline-lg text-headline-lg text-primary leading-none">
            G&M
          </span>
          <p className="font-label-sm text-label-sm text-secondary mt-1">
            © G&M აქსესუარები. ყველა უფლება დაცულია.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors opacity-70 hover:opacity-100"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              {l}
            </a>
          ))}
          <a
            className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors opacity-70 hover:opacity-100"
            href="tel:557783549"
          >
            557 78 35 49
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function Cart() {
  const { cartItems, changeQty, removeFromCart, cartSubtotal, submitOrder } = useStore()
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const count = cartItems.reduce((sum, it) => sum + it.quantity, 0)

  const handleSubmit = async (contactInfo) => {
    setSubmitError('')
    try {
      await submitOrder(contactInfo)
      setSubmitted(true)
    } catch {
      setSubmitError('შეკვეთის გაგზავნა ვერ მოხერხდა. სცადეთ თავიდან.')
    }
  }

  return (
    <>
      <SiteNav active="კალათა" />
      <main className="min-h-screen px-container-padding py-stack-lg max-w-[1800px] mx-auto">
        <header className="mb-12 flex items-end justify-between border-b border-outline-variant pb-6">
          <h2 className="font-display-lg text-display-lg text-primary">კალათა</h2>
          {!submitted && (
            <p className="font-label-sm text-label-sm text-secondary uppercase tracking-tighter">
              {count} ნივთი
            </p>
          )}
        </header>

        {submitted ? (
          <OrderSubmitted />
        ) : cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-12">
            <section className="flex-grow space-y-8">
              {cartItems.map((item) => (
                <CartItem
                  key={`${item.productId}-${item.size ?? ''}`}
                  item={item}
                  onQty={changeQty}
                  onRemove={removeFromCart}
                />
              ))}
            </section>
            <Summary
              subtotal={cartSubtotal}
              onSubmit={handleSubmit}
              submitted={submitted}
              submitError={submitError}
            />
          </div>
        ) : (
          <EmptyCart />
        )}
      </main>
      <Footer />
    </>
  )
}
