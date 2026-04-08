import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Pencil, Clock, Dumbbell } from 'lucide-react'
import { deleteExercise } from '@/lib/exercises/actions'
import VideoPlayer from '@/components/exercises/VideoPlayer'

const DIFFICULTY_LABEL: Record<string, string> = { low: 'Bajo', medium: 'Medio', high: 'Alto' }

export default async function ExerciseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: exercise } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .single()

  if (!exercise) notFound()

  const deleteAction = deleteExercise.bind(null, id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 truncate">{exercise.name}</h2>
        <Link
          href={`/exercises/${id}/edit`}
          className="flex items-center gap-1.5 border border-gray-300 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Pencil size={16} />
          Editar
        </Link>
      </div>

      {/* Video */}
      {exercise.video_url && (
        <VideoPlayer videoType={exercise.video_type} videoUrl={exercise.video_url} />
      )}

      {/* Info */}
      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        {exercise.category && <Row label="Categoría" value={exercise.category} />}
        {exercise.muscle_group && (
          <Row label="Grupo muscular" value={
            <span className="flex items-center gap-1"><Dumbbell size={14} />{exercise.muscle_group}</span>
          } />
        )}
        {exercise.estimated_duration && (
          <Row label="Duración" value={
            <span className="flex items-center gap-1"><Clock size={14} />{exercise.estimated_duration} min</span>
          } />
        )}
        {exercise.difficulty && (
          <Row label="Dificultad" value={DIFFICULTY_LABEL[exercise.difficulty] ?? exercise.difficulty} />
        )}
      </div>

      <form action={deleteAction}>
        <button
          type="submit"
          className="w-full rounded-xl py-3 text-base font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
          onClick={e => {
            if (!confirm('¿Eliminar este ejercicio?')) e.preventDefault()
          }}
        >
          Eliminar ejercicio
        </button>
      </form>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center px-4 py-3 gap-4">
      <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-900 text-right">{value}</span>
    </div>
  )
}
