import { describe, it, expect } from 'vitest'
import { validateTurno, formatTurnoLabel } from './validation'

describe('validateTurno', () => {
  const base = { name: 'Martes 17hs', day_of_week: 2, time: '17:00', max_capacity: 8 }

  it('returns error when name is empty', () => {
    const errors = validateTurno({ ...base, name: '' })
    expect(errors.name).toBeDefined()
  })

  it('returns error when day_of_week is out of range', () => {
    expect(validateTurno({ ...base, day_of_week: -1 }).day_of_week).toBeDefined()
    expect(validateTurno({ ...base, day_of_week: 7 }).day_of_week).toBeDefined()
  })

  it('returns error when time is empty', () => {
    const errors = validateTurno({ ...base, time: '' })
    expect(errors.time).toBeDefined()
  })

  it('returns error when max_capacity is less than 1', () => {
    const errors = validateTurno({ ...base, max_capacity: 0 })
    expect(errors.max_capacity).toBeDefined()
  })

  it('returns no errors with valid data', () => {
    const errors = validateTurno(base)
    expect(Object.keys(errors)).toHaveLength(0)
  })
})

describe('formatTurnoLabel', () => {
  it('formats day name and time correctly', () => {
    expect(formatTurnoLabel({ day_of_week: 2, time: '17:00' })).toBe('Martes 17:00')
    expect(formatTurnoLabel({ day_of_week: 1, time: '09:30' })).toBe('Lunes 09:30')
  })

  it('handles Sunday (day 0) correctly', () => {
    expect(formatTurnoLabel({ day_of_week: 0, time: '10:00' })).toBe('Domingo 10:00')
  })
})
