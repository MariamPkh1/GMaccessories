import { useEffect, useState } from 'react'
import { StoreProvider } from './store'
import { AuthProvider } from './context/AuthContext'
import AuthModal from './components/AuthModal'
import RouteGuard from './components/RouteGuard'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Favorites from './pages/Favorites'
import Orders from './pages/Orders'
import AdminProductManage from './pages/admin/ProductManage'
import AdminProductForm from './pages/admin/ProductForm'

function getPath() {
  return window.location.hash.replace(/^#/, '') || '/'
}

function matchRoute(path) {
  const segments = path.split('/').filter(Boolean)
  if (segments.length === 0) return { name: 'home', params: {} }
  if (segments[0] === 'catalog') return { name: 'catalog', params: {} }
  if (segments[0] === 'product' && segments[1]) return { name: 'product', params: { id: segments[1] } }
  if (segments[0] === 'favorites') return { name: 'favorites', params: {} }
  if (segments[0] === 'cart') return { name: 'cart', params: {} }
  if (segments[0] === 'orders') return { name: 'orders', params: {} }
  if (segments[0] === 'admin') {
    if (segments[1] === 'products' && segments[2] === 'new') {
      return { name: 'admin-product-new', params: {} }
    }
    if (segments[1] === 'products' && segments[2] && segments[3] === 'edit') {
      return { name: 'admin-product-edit', params: { id: segments[2] } }
    }
    return { name: 'admin-products', params: {} }
  }
  return { name: 'home', params: {} }
}

function Router() {
  const [route, setRoute] = useState(() => matchRoute(getPath()))

  useEffect(() => {
    const onHashChange = () => {
      setRoute(matchRoute(getPath()))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  switch (route.name) {
    case 'catalog':
      return <Catalog />
    case 'product':
      return <Product id={route.params.id} />
    case 'favorites':
      return (
        <RouteGuard requireAuth>
          <Favorites />
        </RouteGuard>
      )
    case 'cart':
      return (
        <RouteGuard requireAuth>
          <Cart />
        </RouteGuard>
      )
    case 'orders':
      return (
        <RouteGuard requireAuth>
          <Orders />
        </RouteGuard>
      )
    case 'admin-products':
      return (
        <RouteGuard requireAuth requireAdmin>
          <AdminProductManage />
        </RouteGuard>
      )
    case 'admin-product-new':
      return (
        <RouteGuard requireAuth requireAdmin>
          <AdminProductForm mode="new" />
        </RouteGuard>
      )
    case 'admin-product-edit':
      return (
        <RouteGuard requireAuth requireAdmin>
          <AdminProductForm mode="edit" id={route.params.id} />
        </RouteGuard>
      )
    default:
      return <Home />
  }
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Router />
        <AuthModal />
      </StoreProvider>
    </AuthProvider>
  )
}
