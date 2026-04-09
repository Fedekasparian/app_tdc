import { createClient } from '@/lib/supabase/server'
import RoutineList from '@/components/routines/RoutineList'

export default async function RoutinesPage() {
  const supabase = await createClient()

  const { data: routines } = await supabase
    .from('routines')
    .select('*, routine_exercises(exercise_id, order_index, exercises(estimated_duration))')
    .order('created_at', { ascending: false })

  const list = (routines ?? []).map(routine => {
    const exCount = routine.routine_exercises?.length ?? 0
    const totalMin = (routine.routine_exercises ?? []).reduce(
      (sum: number, re: { exercises: { estimated_duration: number | null } | null }) =>
        sum + (re.exercises?.estimated_duration ?? 0),
      0
    )
    return { id: routine.id, name: routine.name, exCount, totalMin }
  })

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Clases guardadas</h2>
      <RoutineList routines={list} />
    </div>
  )
}
