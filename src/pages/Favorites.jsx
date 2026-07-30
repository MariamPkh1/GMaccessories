import { useState } from 'react'
import SiteNav from '../components/SiteNav'
import { useStore } from '../store'

function FavoriteRow({ item, onAddToCart, onRemove }) {
  const [added, setAdded] = useState(false)
  const handleAdd = () => {
    onAddToCart(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }
  return (
    <>
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center group">
        <div className="w-full md:w-64 aspect-square overflow-hidden bg-surface-container rounded-lg flex-shrink-0">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src={item.img}
            alt={item.title}
          />
        </div>
        <div className="flex-grow w-full">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-headline-lg text-headline-lg text-primary">
                {item.title}
              </h3>
              <p className="text-secondary font-label-sm uppercase tracking-widest mt-1">
                {item.subtitle}
              </p>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="text-secondary hover:text-error transition-colors p-2"
              aria-label="remove from favorites"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
          <div className="mt-4 text-primary font-body-md font-bold text-xl">
            {item.price} ₾
          </div>
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleAdd}
              className={`text-white px-8 py-3 font-button-text text-button-text rounded-full transition-all active:scale-[0.98] ${
                added ? "bg-surface-tint" : "bg-primary hover:bg-primary-container"
              }`}
            >
              {added ? "დამატებულია" : "კალათაში დამატება"}
            </button>
            <a
              href="#/product"
              className="border border-outline px-6 py-3 font-button-text text-button-text rounded-full hover:bg-surface-container-high transition-all"
            >
              დეტალურად
            </a>
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-outline-variant w-full" />
    </>
  )
}

function EmptyFavorites() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined text-outline text-6xl mb-4">
        favorite_border
      </span>
      <h2 className="font-headline-lg text-headline-lg text-primary">
        თქვენი ფავორიტების სია ცარიელია
      </h2>
      <p className="text-secondary mt-2 mb-8">
        დაათვალიერეთ ჩვენი კატალოგი და შეინახეთ სასურველი ნივთები
      </p>
      <a
        className="bg-primary text-white px-10 py-4 font-button-text text-button-text rounded-full hover:bg-primary-container transition-colors"
        href="#/catalog"
      >
        კატალოგზე გადასვლა
      </a>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-surface-container-highest border-t border-outline-variant">
      <div className="w-full py-stack-lg px-container-padding flex flex-col md:flex-row justify-between items-center max-w-[1800px] mx-auto gap-8">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-headline-lg text-headline-lg text-primary">G&M</span>
          <p className="font-label-sm text-label-sm text-secondary mt-1">
            Mechanical Elegance
          </p>
        </div>
        <div className="flex gap-8">
          <a className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors" href="#">
            კონტაქტი
          </a>
          <a className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors" href="#">
            წესები და პირობები
          </a>
          <a className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors" href="#">
            მიწოდება
          </a>
        </div>
        <div className="text-secondary font-label-sm text-label-sm">
          © 2024 G&M აქსესუარები. ყველა უფლება დაცულია.
        </div>
      </div>
    </footer>
  )
}

export default function Favorites() {
  const { favorites, removeFavorite, addToCart } = useStore()
  return (
    <>
      <SiteNav active="ფავორიტები" />
      <main className="pt-8 pb-stack-lg px-container-padding max-w-[1800px] mx-auto min-h-screen">
        <header className="mb-stack-lg border-b border-outline-variant pb-8">
          <h1 className="font-display-lg text-display-lg text-primary">ფავორიტები</h1>
          <p className="text-secondary mt-2 font-body-md">
            თქვენი შერჩეული ნივთების კოლექცია
          </p>
        </header>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-12">
            {favorites.map((item) => (
              <FavoriteRow
                key={item.id}
                item={item}
                onAddToCart={addToCart}
                onRemove={removeFavorite}
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
