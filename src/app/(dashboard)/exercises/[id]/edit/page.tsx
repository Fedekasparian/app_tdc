import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ExerciseForm from '@/components/exercises/ExerciseForm'
import { updateExercise } from '@/lib/exercises/actions'

export default async function EditExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: exercise }, { data: categories }, { data: currentMap }] = await Promise.all([
    supabase.from('exercises').select('*').eq('id', id).single(),
    supabase.from('exercise_categories').select('*').order('type').order('name'),
    supabase.from('exercise_category_map').select('category_id').eq('exercise_id', id),
  ])

  if (!exercise) notFound()

  const selectedCategoryIds = (currentMap ?? []).map(r => r.category_id)
  const action = updateExercise.bind(null, id)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Editar ejercicio</h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <ExerciseForm
          exercise={exercise}
          action={action}
          categories={categories ?? []}
          selectedCategoryIds={selectedCategoryIds}
        />
      </div>
    </div>
  )
}
