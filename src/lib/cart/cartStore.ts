type CartItem = {
  id: string
  name: string
  estimated_duration: number | null
  [key: string]: unknown
}

type Cart = {
  addExercise: (exercise: CartItem) => void
  removeExercise: (id: string) => void
  reorder: (fromIndex: number, toIndex: number) => void
  clear: () => void
  getItems: () => CartItem[]
  getTotalDuration: () => number
  getCount: () => number
}

export function createCart(): Cart {
  let items: CartItem[] = []

  return {
    addExercise(exercise) {
      if (items.find(i => i.id === exercise.id)) return
      items = [...items, exercise]
    },
    removeExercise(id) {
      items = items.filter(i => i.id !== id)
    },
    reorder(fromIndex, toIndex) {
      if (fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) return
      const next = [...items]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      items = next
    },
    clear() {
      items = []
    },
    getItems() {
      return [...items]
    },
    getTotalDuration() {
      return items.reduce((sum, i) => sum + (i.estimated_duration ?? 0), 0)
    },
    getCount() {
      return items.length
    },
  }
}
