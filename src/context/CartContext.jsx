import { createContext, useContext, useEffect, useMemo, useState } from 'react'

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

  const value = useMemo(
    () => ({
      items,
      // Each cart entry is { id, qty }.
      add: (id) =>
        setItems((prev) => {
          const existing = prev.find((p) => p.id === id)
          if (existing) {
            return prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
          }
          return [...prev, { id, qty: 1 }]
        }),
      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      clear: () => setItems([]),
      count: items.reduce((sum, p) => sum + p.qty, 0),
    }),
    [items]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
