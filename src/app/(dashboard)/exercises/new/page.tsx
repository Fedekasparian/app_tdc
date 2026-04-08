import ExerciseForm from '@/components/exercises/ExerciseForm'
import { createExercise } from '@/lib/exercises/actions'

export default function NewExercisePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Nuevo ejercicio</h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <ExerciseForm action={createExercise} />
      </div>
    </div>
  )
}
