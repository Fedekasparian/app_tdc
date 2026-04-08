import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import ExerciseLibrary from '@/components/exercises/ExerciseLibrary'

export default async function ExercisesPage() {
  const supabase = await createClient()

  const [{ data: exercises }, { data: topUsedRows }] = await Promise.all([
    supabase.from('exercises').select('*').order('name', { ascending: true }),
    supabase.rpc('get_top_exercises', { days_back: 30, limit_count: 10 }).select('*'),
  ])

  // Fallback si el RPC no existe aún
  const topUsedIds: string[] = (topUsedRows ?? []).map((r: { id: string }) => r.id)
  const topUsed = (exercises ?? []).filter(e => topUsedIds.includes(e.id))

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

      <ExerciseLibrary exercises={exercises ?? []} topUsed={topUsed} />
    </div>
  )
}
