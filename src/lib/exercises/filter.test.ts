import { describe, it, expect } from 'vitest'
import { filterExercises } from './filter'

const exercises = [
  { id: '1', name: 'Sentadilla', category: 'fuerza', muscle_group: 'tren inferior', difficulty: 'medium' },
  { id: '2', name: 'Plancha', category: 'core', muscle_group: 'abdominales', difficulty: 'low' },
  { id: '3', name: 'Press hombro', category: 'fuerza', muscle_group: 'hombros', difficulty: 'high' },
  { id: '4', name: 'Elongación cuadriceps', category: 'elongación', muscle_group: 'tren inferior', difficulty: 'low' },
]

describe('filterExercises', () => {
  it('returns all exercises when no filters applied', () => {
    const result = filterExercises(exercises, {})
    expect(result).toHaveLength(4)
  })

  it('filters by category', () => {
    const result = filterExercises(exercises, { category: 'fuerza' })
    expect(result).toHaveLength(2)
    expect(result.map(e => e.name)).toEqual(['Sentadilla', 'Press hombro'])
  })

  it('filters by muscle_group', () => {
    const result = filterExercises(exercises, { muscle_group: 'tren inferior' })
    expect(result).toHaveLength(2)
    expect(result.map(e => e.name)).toEqual(['Sentadilla', 'Elongación cuadriceps'])
  })

  it('filters by difficulty', () => {
    const result = filterExercises(exercises, { difficulty: 'low' })
    expect(result).toHaveLength(2)
    expect(result.map(e => e.name)).toEqual(['Plancha', 'Elongación cuadriceps'])
  })

  it('combines multiple filters', () => {
    const result = filterExercises(exercises, { category: 'fuerza', difficulty: 'high' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Press hombro')
  })

  it('searches by name case-insensitively', () => {
    const result = filterExercises(exercises, { search: 'sentadilla' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Sentadilla')
  })

  it('searches by partial name', () => {
    const result = filterExercises(exercises, { search: 'hombro' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Press hombro')
  })

  it('combines search with filters', () => {
    const result = filterExercises(exercises, { search: 'elongación', muscle_group: 'tren inferior' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Elongación cuadriceps')
  })
})
