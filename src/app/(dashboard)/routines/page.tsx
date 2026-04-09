import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronRight, Clock } from 'lucide-react'

export default async function RoutinesPage() {
  const supabase = await createClient()

  const { data: routines } = await supabase
    .from('routines')
    .select('*, routine_exercises(exercise_id, order_index, exercises(estimated_duration))')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Clases guardadas</h2>

      {!routines?.length ? (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-8 text-center text-gray-400">
          Todavía no guardaste ninguna clase.<br />
          <span className="text-sm">Armá una desde la biblioteca de ejercicios.</span>
        </div>
      ) : (
        <div className="space-y-2">
          {routines.map(routine => {
            const exCount = routine.routine_exercises?.length ?? 0
            const totalMin = (routine.routine_exercises ?? []).reduce(
              (sum: number, re: { exercises: { estimated_duration: number | null } | null }) =>
                sum + (re.exercises?.estimated_duration ?? 0),
              0
            )
            return (
              <Link
                key={routine.id}
                href={`/routines/${routine.id}`}
                className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3 hover:border-blue-300 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{routine.name}</p>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    {exCount} ejercicio{exCount !== 1 ? 's' : ''}
                    {totalMin > 0 && <><Clock size={12} className="ml-1" /> {totalMin} min</>}
                  </p>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
