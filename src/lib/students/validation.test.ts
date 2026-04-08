import { describe, it, expect } from 'vitest'
import { validateStudentForm } from './validation'

describe('validateStudentForm', () => {
  it('returns error when full_name is empty', () => {
    const result = validateStudentForm({ full_name: '' })
    expect(result.full_name).toBe('El nombre es obligatorio')
  })

  it('returns no errors when full_name is provided', () => {
    const result = validateStudentForm({ full_name: 'Ana García' })
    expect(result.full_name).toBeUndefined()
  })

  it('returns error when age is negative', () => {
    const result = validateStudentForm({ full_name: 'Ana García', age: -1 })
    expect(result.age).toBe('La edad debe ser mayor a 0')
  })

  it('returns no error when age is valid', () => {
    const result = validateStudentForm({ full_name: 'Ana García', age: 30 })
    expect(result.age).toBeUndefined()
  })

  it('returns error when fee_amount is negative', () => {
    const result = validateStudentForm({ full_name: 'Ana García', fee_amount: -500 })
    expect(result.fee_amount).toBe('La cuota debe ser mayor a 0')
  })

  it('returns no errors for a fully valid student', () => {
    const result = validateStudentForm({
      full_name: 'Ana García',
      age: 30,
      contact: '1155551234',
      fee_amount: 15000,
    })
    expect(Object.keys(result)).toHaveLength(0)
  })
})
