import { createClient } from '@/lib/supabase/server'
import ExerciseForm from '@/components/exercises/ExerciseForm'
import { createExercise } from '@/lib/exercises/actions'

export default async function NewExercisePage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('exercise_categories')
    .select('*')
    .order('type')
    .order('name')

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Nuevo ejercicio</h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <ExerciseForm action={createExercise} categories={categories ?? []} />
      </div>
    </div>
  )
}
