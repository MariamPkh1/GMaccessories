import { useState, useEffect } from 'react'
import { StoreProvider } from './store'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Favorites from './pages/Favorites'

function getRoute() {
  return window.location.hash.replace(/^#/, '') || '/'
}

function Router() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (route.startsWith('/cart')) return <Cart />
  if (route.startsWith('/favorites')) return <Favorites />
  if (route.startsWith('/product')) return <Product />
  if (route.startsWith('/catalog')) return <Catalog />
  return <Home />
}

export default function App() {
  return (
    <StoreProvider>
      <Router />
    </StoreProvider>
  )
}
