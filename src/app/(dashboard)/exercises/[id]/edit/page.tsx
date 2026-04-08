import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ExerciseForm from '@/components/exercises/ExerciseForm'
import { updateExercise } from '@/lib/exercises/actions'

export default async function EditExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: exercise } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .single()

  if (!exercise) notFound()

  const action = updateExercise.bind(null, id)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Editar ejercicio</h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <ExerciseForm exercise={exercise} action={action} />
      </div>
    </div>
  )
}
