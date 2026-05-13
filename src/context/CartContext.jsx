import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getProductById } from '../data/products'

const CartContext = createContext(null)
const STORAGE_KEY = 'techshop:cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // Resolve cart entries to full product objects + quantity, dropping any
  // stale ids that no longer exist in the catalog.
  const detailed = useMemo(
    () =>
      items
        .map((entry) => {
          const product = getProductById(entry.id)
          return product ? { product, qty: entry.qty } : null
        })
        .filter(Boolean),
    [items]
  )

  const subtotal = useMemo(
    () => detailed.reduce((sum, { product, qty }) => sum + product.price * qty, 0),
    [detailed]
  )

  const count = useMemo(
    () => items.reduce((sum, p) => sum + p.qty, 0),
    [items]
  )

  const value = useMemo(
    () => ({
      items,
      detailed,
      count,
      subtotal,

      add: (id, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((p) => p.id === id)
          if (existing) {
            return prev.map((p) =>
              p.id === id ? { ...p, qty: p.qty + qty } : p
            )
          }
          return [...prev, { id, qty }]
        }),

      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),

      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((p) => p.id !== id)
            : prev.map((p) => (p.id === id ? { ...p, qty } : p))
        ),

      increment: (id) =>
        setItems((prev) =>
          prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
        ),

      decrement: (id) =>
        setItems((prev) =>
          prev
            .map((p) => (p.id === id ? { ...p, qty: p.qty - 1 } : p))
            .filter((p) => p.qty > 0)
        ),

      clear: () => setItems([]),
    }),
    [items, detailed, count, subtotal]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
