type ExerciseFilterable = {
  id: string
  name: string
  category: string | null
  muscle_group: string | null
  difficulty: string | null
}

type Filters = {
  category?: string
  muscle_group?: string
  difficulty?: string
  search?: string
}

type ExerciseCategoryLike = { id: string; type: string }
type ExerciseWithCategories = { id: string; name: string; categories: ExerciseCategoryLike[] }

export function filterByCategories<T extends ExerciseWithCategories>(
  exercises: T[],
  selectedIds: string[]
): T[] {
  if (selectedIds.length === 0) return exercises

  // Group selected ids by category type
  // (we need to know which ids belong to which type — infer from the exercise data)
  // Build a map: id → type from all exercise categories in the dataset
  const idToType = new Map<string, string>()
  for (const ex of exercises) {
    for (const c of ex.categories) idToType.set(c.id, c.type)
  }

  // Group selectedIds by type
  const byType = new Map<string, string[]>()
  for (const id of selectedIds) {
    const type = idToType.get(id)
    if (!type) continue
    if (!byType.has(type)) byType.set(type, [])
    byType.get(type)!.push(id)
  }

  return exercises.filter(ex => {
    const exCatIds = new Set(ex.categories.map(c => c.id))
    // AND between types: every type-group must have at least one match (OR within type)
    for (const [, ids] of byType) {
      if (!ids.some(id => exCatIds.has(id))) return false
    }
    return true
  })
}

export function filterExercises<T extends ExerciseFilterable>(exercises: T[], filters: Filters): T[] {
  return exercises.filter(e => {
    if (filters.category && e.category !== filters.category) return false
    if (filters.muscle_group && e.muscle_group !== filters.muscle_group) return false
    if (filters.difficulty && e.difficulty !== filters.difficulty) return false
    if (filters.search && !e.name.toLowerCase().includes(filters.search.trim().toLowerCase())) return false
    return true
  })
}
