import SiteNav from '../components/SiteNav'
import { useStore } from '../store'
import { fmt } from '../products'

function FavoriteCard({ item, onAddToCart, onRemove }) {
  return (
    <div className="product-card border border-outline-variant rounded bg-white overflow-hidden">
      <a href={`#/product/${item.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-low">
          <img
            className="w-full h-full object-cover"
            src={item.image_urls?.[0]}
            alt={item.title_ka}
            loading="lazy"
          />
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onRemove(item.id)
            }}
            className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded transition-colors hover:bg-white"
            aria-label="წაშლა ფავორიტებიდან"
          >
            <span className="material-symbols-outlined text-[18px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
          </button>
        </div>
        <div className="p-4">
          <span className="text-[11px] font-medium uppercase tracking-wider text-secondary mb-1 block">
            {item.category}
          </span>
          <h3 className="text-sm font-semibold text-on-surface truncate mb-2">{item.title_ka}</h3>
          <p className="text-base font-bold text-on-surface">{fmt(item.price)}</p>
        </div>
      </a>
      <div className="px-4 pb-4">
        <button
          onClick={() => onAddToCart(item.id)}
          className="w-full border border-outline-variant text-on-surface py-2 text-xs font-semibold rounded transition-colors hover:border-primary hover:text-primary"
        >
          კალათაში დამატება
        </button>
      </div>
    </div>
  )
}

function EmptyFavorites() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined text-outline text-5xl mb-4">favorite</span>
      <p className="text-lg text-secondary mb-6">თქვენი ფავორიტების სია ცარიელია</p>
      <a
        className="bg-primary text-on-primary px-6 py-2.5 text-sm font-semibold rounded transition-opacity hover:opacity-90"
        href="#/catalog"
      >
        კატალოგზე გადასვლა
      </a>
    </div>
  )
}

function Footer() {
  const socials = ["Facebook", "Instagram", "TikTok", "YouTube"]
  return (
    <footer className="bg-white border-t border-outline-variant">
      <div className="w-full py-8 px-container-padding flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-headline-lg text-base text-on-surface">G&M აქსესუარები</span>
          <p className="text-xs text-on-surface-variant">
            © {new Date().getFullYear()} G&M აქსესუარები. ყველა უფლება დაცულია.
          </p>
        </div>
        <div className="flex gap-6">
          {socials.map((s) => (
            <a key={s} className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">
              {s}
            </a>
          ))}
        </div>
        <a href="tel:557783549" className="text-sm font-medium text-on-surface hover:text-primary transition-colors">
          557 78 35 49
        </a>
      </div>
    </footer>
  )
}

export default function Favorites() {
  const { favoriteItems, toggleFavorite, addToCart, productsLoading } = useStore()
  return (
    <>
      <SiteNav active="ფავორიტები" />
      <main className="px-container-padding py-12 md:py-16 w-full min-h-screen">
        <h1 className="text-3xl md:text-4xl font-headline-lg text-on-surface mb-8">ფავორიტები</h1>

        {productsLoading ? (
          <p className="text-secondary text-center py-24">იტვირთება...</p>
        ) : favoriteItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteItems.map((item) => (
              <FavoriteCard
                key={item.id}
                item={item}
                onAddToCart={addToCart}
                onRemove={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <EmptyFavorites />
        )}
      </main>
      <Footer />
    </>
  )
}
