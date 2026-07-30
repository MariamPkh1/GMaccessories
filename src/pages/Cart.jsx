import SiteNav from '../components/SiteNav'
import { useStore } from '../store'
import { fmt } from '../products'

const DELIVERY = 10

function CartItem({ item, onQty, onRemove }) {
  return (
    <div className="group flex flex-col md:flex-row gap-8 py-6 border-b border-outline-variant item-transition">
      <div className="w-full md:w-48 h-48 bg-surface-container overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          src={item.img}
          alt={item.title}
        />
      </div>
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-body-md font-bold text-on-surface">{item.title}</h3>
            <p className="font-label-sm text-label-sm text-secondary">{item.subtitle}</p>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-secondary hover:text-error transition-colors p-2"
            aria-label="remove"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="mt-auto flex justify-between items-end">
          <div className="flex items-center border border-outline-variant">
            <button
              onClick={() => onQty(item.id, -1)}
              className="px-3 py-1 hover:bg-surface-container-low transition-colors"
            >
              -
            </button>
            <span className="px-4 py-1 font-label-sm border-x border-outline-variant">
              {item.qty}
            </span>
            <button
              onClick={() => onQty(item.id, 1)}
              className="px-3 py-1 hover:bg-surface-container-low transition-colors"
            >
              +
            </button>
          </div>
          <p className="font-body-md font-bold">{fmt(item.price * item.qty)}</p>
        </div>
      </div>
    </div>
  )
}

function Summary({ subtotal }) {
  return (
    <aside className="w-full lg:w-[380px] h-fit lg:sticky lg:top-8 bg-surface-container-low p-8 space-y-8">
      <h4 className="font-headline-lg text-[24px] text-primary">ჯამი</h4>
      <div className="space-y-4">
        <div className="flex justify-between font-label-sm text-label-sm text-secondary uppercase tracking-widest">
          <span>ჯამური ღირებულება</span>
          <span>{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between font-label-sm text-label-sm text-secondary uppercase tracking-widest">
          <span>მიწოდება</span>
          <span>{fmt(DELIVERY)}</span>
        </div>
        <div className="h-px bg-outline-variant my-4" />
        <div className="flex justify-between font-body-md font-bold text-on-surface text-lg">
          <span>სულ გადასახდელი</span>
          <span>{fmt(subtotal + DELIVERY)}</span>
        </div>
      </div>
      <div className="space-y-4">
        <button className="w-full py-4 bg-primary-container text-on-primary-container font-button-text text-button-text hover:bg-primary transition-all duration-300">
          შეკვეთის გაფორმება
        </button>
        <p className="text-[10px] text-center text-secondary uppercase tracking-widest leading-relaxed">
          მიწოდება ხორციელდება 2-3 სამუშაო დღეში საქართველოს მასშტაბით.
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
  const { cart, changeQty, removeFromCart } = useStore()
  const subtotal = cart.reduce((sum, it) => sum + it.price * it.qty, 0)
  const count = cart.reduce((sum, it) => sum + it.qty, 0)

  return (
    <>
      <SiteNav active="კალათა" />
      <main className="min-h-screen px-container-padding py-stack-lg max-w-[1800px] mx-auto">
        <header className="mb-12 flex items-end justify-between border-b border-outline-variant pb-6">
          <h2 className="font-display-lg text-display-lg text-primary">კალათა</h2>
          <p className="font-label-sm text-label-sm text-secondary uppercase tracking-tighter">
            {count} ნივთი
          </p>
        </header>

        {cart.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-12">
            <section className="flex-grow space-y-8">
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQty={changeQty}
                  onRemove={removeFromCart}
                />
              ))}
            </section>
            <Summary subtotal={subtotal} />
          </div>
        ) : (
          <EmptyCart />
        )}
      </main>
      <Footer />
    </>
  )
}
