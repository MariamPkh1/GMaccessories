import { createContext, useContext, useEffect, useState } from 'react'

const StoreContext = createContext(null)

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('gm_cart', []))
  const [favorites, setFavorites] = useState(() => load('gm_favorites', []))

  useEffect(() => {
    localStorage.setItem('gm_cart', JSON.stringify(cart))
  }, [cart])
  useEffect(() => {
    localStorage.setItem('gm_favorites', JSON.stringify(favorites))
  }, [favorites])

  const addToCart = (product, qty = 1) =>
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i,
        )
      }
      return [...prev, { ...product, qty }]
    })

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id))

  const changeQty = (id, delta) =>
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i,
      ),
    )

  const toggleFavorite = (product) =>
    setFavorites((prev) =>
      prev.find((f) => f.id === product.id)
        ? prev.filter((f) => f.id !== product.id)
        : [...prev, product],
    )

  const removeFavorite = (id) =>
    setFavorites((prev) => prev.filter((f) => f.id !== id))

  const isFavorite = (id) => favorites.some((f) => f.id === id)

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  const value = {
    cart,
    favorites,
    addToCart,
    removeFromCart,
    changeQty,
    toggleFavorite,
    removeFavorite,
    isFavorite,
    cartCount,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
