import { describe, it, expect } from 'vitest'
import { validateRoutine } from './validation'

const ejercicio = { id: '1', name: 'Sentadilla', estimated_duration: 10 }

describe('validateRoutine', () => {
  it('returns error when name is empty', () => {
    const errors = validateRoutine('', [ejercicio])
    expect(errors.name).toBeDefined()
  })

  it('returns error when name is only whitespace', () => {
    const errors = validateRoutine('   ', [ejercicio])
    expect(errors.name).toBeDefined()
  })

  it('returns error when items list is empty', () => {
    const errors = validateRoutine('Clase de lunes', [])
    expect(errors.items).toBeDefined()
  })

  it('returns no errors with valid name and exercises', () => {
    const errors = validateRoutine('Clase de lunes', [ejercicio])
    expect(Object.keys(errors)).toHaveLength(0)
  })
})
