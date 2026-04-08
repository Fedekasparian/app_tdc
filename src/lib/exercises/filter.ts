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

export function filterExercises<T extends ExerciseFilterable>(exercises: T[], filters: Filters): T[] {
  return exercises.filter(e => {
    if (filters.category && e.category !== filters.category) return false
    if (filters.muscle_group && e.muscle_group !== filters.muscle_group) return false
    if (filters.difficulty && e.difficulty !== filters.difficulty) return false
    if (filters.search && !e.name.toLowerCase().includes(filters.search.trim().toLowerCase())) return false
    return true
  })
}
