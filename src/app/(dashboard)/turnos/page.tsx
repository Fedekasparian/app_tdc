import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, ChevronRight, Users } from 'lucide-react'
import { formatTurnoLabel } from '@/lib/turnos/validation'

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default async function TurnosPage() {
  const supabase = await createClient()

  const { data: turnos } = await supabase
    .from('turnos')
    .select('*, turno_students(count)')
    .eq('active', true)
    .order('day_of_week')
    .order('time')

  // Group by day_of_week
  const byDay = new Map<number, typeof turnos>()
  for (const turno of turnos ?? []) {
    if (!byDay.has(turno.day_of_week)) byDay.set(turno.day_of_week, [])
    byDay.get(turno.day_of_week)!.push(turno)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Turnos</h2>
        <Link
          href="/turnos/new"
          className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> Nuevo
        </Link>
      </div>

      {byDay.size === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-8 text-center text-gray-400">
          No hay turnos activos. Creá el primero.
        </div>
      ) : (
        <div className="space-y-5">
          {[...byDay.entries()].map(([day, turnos]) => (
            <section key={day}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {DAYS[day]}
              </h3>
              <div className="space-y-2">
                {turnos!.map(turno => {
                  const enrolled = (turno.turno_students as { count: number }[])?.[0]?.count ?? 0
                  const free = turno.max_capacity - enrolled
                  return (
                    <Link
                      key={turno.id}
                      href={`/turnos/${turno.id}`}
                      className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3 hover:border-blue-300 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{turno.name}</p>
                        <p className="text-sm text-gray-400">{formatTurnoLabel(turno)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1 text-sm ${free === 0 ? 'text-red-500' : 'text-gray-400'}`}>
                          <Users size={14} /> {enrolled}/{turno.max_capacity}
                        </span>
                        <ChevronRight size={18} className="text-gray-400" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
