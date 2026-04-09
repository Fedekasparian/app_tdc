import { describe, it, expect } from 'vitest'
import { filterExercises, filterByCategories } from './filter'

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

// ─── filterByCategories ───────────────────────────────────────────────────────

const cat = (id: string, type: 'body_part' | 'element' | 'group' | 'integral') =>
  ({ id, name: id, type, created_at: '' })

const exWithCats = [
  { id: '1', name: 'Sentadilla', categories: [cat('piernas', 'body_part'), cat('mancuernas', 'element')] },
  { id: '2', name: 'Press hombro', categories: [cat('hombros', 'body_part'), cat('mancuernas', 'element')] },
  { id: '3', name: 'Plancha', categories: [cat('core', 'body_part')] },
  { id: '4', name: 'Sin categoría', categories: [] },
]

describe('filterByCategories', () => {
  it('returns all exercises when no categories selected', () => {
    const result = filterByCategories(exWithCats, [])
    expect(result).toHaveLength(4)
  })

  it('returns only exercises that have the selected category', () => {
    const result = filterByCategories(exWithCats, ['piernas'])
    expect(result.map(e => e.name)).toEqual(['Sentadilla'])
  })

  it('excludes exercises with no categories when a filter is active', () => {
    const result = filterByCategories(exWithCats, ['core'])
    expect(result.map(e => e.name)).not.toContain('Sin categoría')
  })

  it('OR within type: shows exercises matching any selected category of same type', () => {
    // piernas and hombros are both body_part
    const result = filterByCategories(exWithCats, ['piernas', 'hombros'])
    expect(result.map(e => e.name)).toEqual(expect.arrayContaining(['Sentadilla', 'Press hombro']))
    expect(result.map(e => e.name)).not.toContain('Sin categoría')
  })

  it('AND between types: exercise must match selections from every type', () => {
    // piernas (body_part) AND mancuernas (element) → only Sentadilla qualifies
    // Press hombro has mancuernas but also hombros not piernas — wait, it matches piernas? No.
    // Sentadilla: piernas ✓, mancuernas ✓
    // Press hombro: hombros ✗ piernas, mancuernas ✓ → excluded (no piernas)
    const result = filterByCategories(exWithCats, ['piernas', 'mancuernas'])
    expect(result.map(e => e.name)).toEqual(['Sentadilla'])
  })
})
