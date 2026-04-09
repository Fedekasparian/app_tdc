import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Clock, Trash2 } from 'lucide-react'
import { deleteRoutine } from '@/lib/routines/actions'
import VideoPlayer from '@/components/exercises/VideoPlayer'

type RoutineExerciseRow = {
  id: string
  order_index: number
  exercises: {
    id: string
    name: string
    estimated_duration: number | null
    difficulty: string | null
    video_type: string | null
    video_url: string | null
  } | null
}

export default async function RoutineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: routine } = await supabase
    .from('routines')
    .select(`
      *,
      routine_exercises (
        id,
        order_index,
        exercises ( id, name, estimated_duration, difficulty, video_type, video_url )
      )
    `)
    .eq('id', id)
    .single()

  if (!routine) notFound()

  const exercises: RoutineExerciseRow[] = [...(routine.routine_exercises ?? [])].sort(
    (a, b) => a.order_index - b.order_index
  )

  const totalMin = exercises.reduce(
    (sum, re) => sum + (re.exercises?.estimated_duration ?? 0),
    0
  )

  const deleteAction = deleteRoutine.bind(null, id)

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{routine.name}</h2>
          <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
            {exercises.length} ejercicio{exercises.length !== 1 ? 's' : ''}
            {totalMin > 0 && <><Clock size={12} className="ml-1" /> {totalMin} min</>}
          </p>
        </div>
        <form action={deleteAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-sm text-red-500 border border-red-200 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
          >
            <Trash2 size={15} /> Eliminar
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {exercises.map((re, idx) => {
          const ex = re.exercises
          if (!ex) return null
          return (
            <div key={re.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Header del ejercicio */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-sm text-gray-400 w-5 text-right flex-shrink-0 font-medium">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{ex.name}</p>
                  {ex.estimated_duration && (
                    <p className="text-xs text-gray-400">{ex.estimated_duration} min</p>
                  )}
                </div>
              </div>

              {/* Video del ejercicio */}
              {ex.video_url && ex.video_type && (
                <div className="px-4 pb-4">
                  <VideoPlayer videoType={ex.video_type} videoUrl={ex.video_url} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
