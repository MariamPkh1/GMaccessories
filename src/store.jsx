import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { useAuth } from './context/AuthContext'
import { priceForSize } from './products'

const StoreContext = createContext(null)

// .eq('size', null) does not match NULL rows over PostgREST — .is() is
// required for null comparisons. This helper keeps every cart_items query
// correct for both sized and size-less products.
function matchSize(query, size) {
  return size === null || size === undefined ? query.is('size', null) : query.eq('size', size)
}

export function StoreProvider({ children }) {
  const { user, openLogin } = useAuth()

  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)

  const [favoriteIds, setFavoriteIds] = useState([])
  const [cartRows, setCartRows] = useState([])
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  // Products: public read, independent of auth state.
  useEffect(() => {
    let active = true
    setProductsLoading(true)
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return
        if (!error) setProducts(data || [])
        setProductsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  // Hearts, cart, orders: scoped to the current user. Reset to empty on
  // logout; (re)fetch whenever the signed-in user changes.
  useEffect(() => {
    let active = true
    if (!user) {
      setFavoriteIds([])
      setCartRows([])
      setOrders([])
      setOrdersLoading(false)
      return
    }
    supabase
      .from('hearts')
      .select('product_id')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!active) return
        if (!error) setFavoriteIds((data || []).map((h) => h.product_id))
      })
    supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!active) return
        if (!error) setCartRows(data || [])
      })
    fetchOrders(user.id, active)
    return () => {
      active = false
    }
  }, [user])

  const fetchOrders = async (userId, active = true) => {
    setOrdersLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(title_ka, image_urls))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (!active) return
    if (!error) setOrders(data || [])
    setOrdersLoading(false)
  }

  const getProduct = (id) => products.find((p) => p.id === id)

  // --- Admin product CRUD ------------------------------------------------
  // RLS restricts these to admins; callers (admin pages) should catch and
  // show a Georgian error rather than letting a raw Postgres error surface.
  const addProduct = async (data) => {
    const { data: row, error } = await supabase.from('products').insert(data).select().single()
    if (error) throw error
    setProducts((prev) => [row, ...prev])
    return row
  }

  const updateProduct = async (id, data) => {
    const { data: row, error } = await supabase
      .from('products')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setProducts((prev) => prev.map((p) => (p.id === id ? row : p)))
    return row
  }

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setCartRows((prev) => prev.filter((r) => r.product_id !== id))
    setFavoriteIds((prev) => prev.filter((pid) => pid !== id))
  }

  // --- Favorites (hearts) --------------------------------------------------
  const isFavorite = (productId) => favoriteIds.includes(productId)

  const toggleFavorite = async (productId) => {
    if (!user) {
      openLogin()
      return
    }
    if (favoriteIds.includes(productId)) {
      setFavoriteIds((prev) => prev.filter((id) => id !== productId))
      const { error } = await supabase
        .from('hearts')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
      if (error) setFavoriteIds((prev) => [...prev, productId]) // revert on failure
    } else {
      setFavoriteIds((prev) => [...prev, productId])
      const { error } = await supabase
        .from('hearts')
        .insert({ user_id: user.id, product_id: productId })
      // 23505 = unique_violation -> already hearted (e.g. duplicate click); not a real failure.
      if (error && error.code !== '23505') {
        setFavoriteIds((prev) => prev.filter((id) => id !== productId))
      }
    }
  }

  // --- Cart ----------------------------------------------------------------
  const addToCart = async (productId, { size = null, quantity = 1 } = {}) => {
    if (!user) {
      openLogin()
      return
    }
    const existing = cartRows.find((r) => r.product_id === productId && r.size === size)
    const newQuantity = (existing?.quantity || 0) + quantity
    const { data, error } = await supabase
      .from('cart_items')
      .upsert(
        { user_id: user.id, product_id: productId, size, quantity: newQuantity },
        { onConflict: 'user_id,product_id,size' },
      )
      .select()
      .single()
    if (!error && data) {
      setCartRows((prev) => [...prev.filter((r) => !(r.product_id === productId && r.size === size)), data])
    }
  }

  const removeFromCart = async (productId, size = null) => {
    if (!user) return
    setCartRows((prev) => prev.filter((r) => !(r.product_id === productId && r.size === size)))
    let query = supabase.from('cart_items').delete().eq('user_id', user.id).eq('product_id', productId)
    await matchSize(query, size)
  }

  const changeQty = async (productId, size, delta) => {
    if (!user) return
    const existing = cartRows.find((r) => r.product_id === productId && r.size === size)
    if (!existing) return
    const newQuantity = Math.max(1, existing.quantity + delta)
    setCartRows((prev) => prev.map((r) => (r === existing ? { ...r, quantity: newQuantity } : r)))
    let query = supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('user_id', user.id)
      .eq('product_id', productId)
    await matchSize(query, size)
  }

  // `unitPrice` is resolved from the chosen size rather than the product's base
  // price, so per-size pricing flows through the cart, the totals and the order
  // snapshot from a single place.
  const cartItems = cartRows
    .map((r) => {
      const product = getProduct(r.product_id)
      return {
        productId: r.product_id,
        size: r.size,
        quantity: r.quantity,
        product,
        unitPrice: product ? priceForSize(product, r.size) : 0,
      }
    })
    .filter((i) => i.product)

  const favoriteItems = favoriteIds.map((id) => getProduct(id)).filter(Boolean)

  const cartCount = cartRows.reduce((sum, r) => sum + r.quantity, 0)
  const cartSubtotal = cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  // --- Orders ---------------------------------------------------------------
  const submitOrder = async ({ contactName = '', contactPhone = '', notes = '' } = {}) => {
    if (!user || cartItems.length === 0) return null

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        contact_name: contactName,
        contact_phone: contactPhone,
        notes,
      })
      .select()
      .single()
    if (orderError) throw orderError

    // Snapshot the price of the *chosen size* — the owner may reprice a size
    // during the ~month sourcing window, and a past order must not change.
    const itemRows = cartItems.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      size: i.size,
      quantity: i.quantity,
      price_at_order: i.unitPrice,
    }))
    const { error: itemsError } = await supabase.from('order_items').insert(itemRows)
    if (itemsError) throw itemsError

    await supabase.from('cart_items').delete().eq('user_id', user.id)
    setCartRows([])
    await fetchOrders(user.id)
    return order
  }

  const value = {
    products,
    productsLoading,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    cartItems,
    cartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    changeQty,
    favoriteItems,
    toggleFavorite,
    isFavorite,
    orders,
    ordersLoading,
    submitOrder,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
