type CartItem = { id: string; name: string; estimated_duration: number | null }
type ValidationErrors = Record<string, string>

export function validateRoutine(name: string, items: CartItem[]): ValidationErrors {
  const errors: ValidationErrors = {}
  if (!name || name.trim() === '') errors.name = 'El nombre es obligatorio'
  if (items.length === 0) errors.items = 'La rutina debe tener al menos un ejercicio'
  return errors
}
