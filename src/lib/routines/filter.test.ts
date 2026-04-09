import { describe, it, expect } from 'vitest'
import { filterRoutines } from './filter'

const routines = [
  { id: '1', name: 'Clase lunes mañana' },
  { id: '2', name: 'Rutina de fuerza' },
  { id: '3', name: 'Lunes tarde' },
]

describe('filterRoutines', () => {
  it('returns all routines when search is empty', () => {
    expect(filterRoutines(routines, '')).toHaveLength(3)
  })

  it('filters by partial name match', () => {
    const result = filterRoutines(routines, 'fuerza')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Rutina de fuerza')
  })

  it('is case-insensitive', () => {
    const result = filterRoutines(routines, 'LUNES')
    expect(result).toHaveLength(2)
    expect(result.map(r => r.name)).toEqual(
      expect.arrayContaining(['Clase lunes mañana', 'Lunes tarde'])
    )
  })
})
