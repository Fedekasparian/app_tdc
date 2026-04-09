'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { CartContext } from '@/lib/cart/useCart'
import { createCart } from '@/lib/cart/cartStore'
import type { CartItem } from '@/lib/cart/cartStore'

const STORAGE_KEY = 'tdc_cart'

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => createCart())
  const [items, setItems] = useState<CartItem[]>([])

  // Load from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved: CartItem[] = JSON.parse(raw)
        saved.forEach(item => store.addExercise(item))
        setItems(store.getItems())
      }
    } catch {}
  }, [store])

  function sync() {
    const current = store.getItems()
    setItems(current)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(current)) } catch {}
  }

  const addExercise = useCallback((exercise: CartItem) => {
    store.addExercise(exercise)
    sync()
  }, [store])

  const removeExercise = useCallback((id: string) => {
    store.removeExercise(id)
    sync()
  }, [store])

  const reorder = useCallback((from: number, to: number) => {
    store.reorder(from, to)
    sync()
  }, [store])

  const clear = useCallback(() => {
    store.clear()
    sync()
  }, [store])

  const value = useMemo(() => ({
    items,
    addExercise,
    removeExercise,
    reorder,
    clear,
    count: items.length,
    totalDuration: items.reduce((sum, i) => sum + (i.estimated_duration ?? 0), 0),
  }), [items, addExercise, removeExercise, reorder, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
