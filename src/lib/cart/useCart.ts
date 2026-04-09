'use client'

import { createContext, useContext } from 'react'
import type { CartItem } from './cartStore'

export type CartContextValue = {
  items: CartItem[]
  addExercise: (exercise: CartItem) => void
  removeExercise: (id: string) => void
  reorder: (from: number, to: number) => void
  clear: () => void
  count: number
  totalDuration: number
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
