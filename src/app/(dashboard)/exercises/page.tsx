import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import ExerciseLibrary from '@/components/exercises/ExerciseLibrary'
import type { ExerciseCategory } from '@/types'

export default async function ExercisesPage() {
  const supabase = await createClient()

  const [{ data: rawExercises }, { data: categories }] = await Promise.all([
    supabase
      .from('exercises')
      .select('*, exercise_category_map(exercise_categories(id, name, type))')
      .order('name', { ascending: true }),
    supabase.from('exercise_categories').select('*').order('type').order('name'),
  ])

  // Flatten nested join into a simple categories array per exercise
  const exercises = (rawExercises ?? []).map(e => {
    const cats = (e.exercise_category_map ?? [])
      .map((m: { exercise_categories: ExerciseCategory | null }) => m.exercise_categories)
      .filter(Boolean) as ExerciseCategory[]
    return { ...e, categories: cats }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Ejercicios</h2>
        <Link
          href="/exercises/new"
          className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Nuevo
        </Link>
      </div>

      <ExerciseLibrary exercises={exercises} categories={categories ?? []} />
    </div>
  )
}
