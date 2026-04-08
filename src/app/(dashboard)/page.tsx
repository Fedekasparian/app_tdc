import { createClient } from '@/lib/supabase/server'
import { Users, Dumbbell, CalendarDays, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const today = new Date()
  const dayOfWeek = today.getDay()
  const month = today.getMonth() + 1
  const year = today.getFullYear()

  const [
    { count: activeStudents },
    { count: totalExercises },
    { data: todayClasses },
    { data: unpaidStudents },
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('exercises').select('*', { count: 'exact', head: true }),
    supabase.from('classes').select('name, time').eq('day_of_week', dayOfWeek).eq('active', true),
    supabase
      .from('payments')
      .select('students(full_name)')
      .eq('month', month)
      .eq('year', year)
      .eq('paid', false),
  ])

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">{dayNames[dayOfWeek]}, {today.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</p>
        <h2 className="text-2xl font-bold text-gray-900 mt-0.5">Buen día 👋</h2>
      </div>

      {/* Clases de hoy */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Clases de hoy</h3>
        {todayClasses && todayClasses.length > 0 ? (
          <div className="space-y-2">
            {todayClasses.map((c, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CalendarDays size={18} className="text-blue-500" />
                  <span className="font-medium text-gray-900">{c.name}</span>
                </div>
                <span className="text-sm text-gray-500">{c.time?.slice(0, 5)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-500">
            No hay clases programadas para hoy.
          </div>
        )}
      </section>

      {/* Alertas de pago */}
      {unpaidStudents && unpaidStudents.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Pagos pendientes</h3>
          <Link href="/payments" className="block bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertCircle size={18} />
              <span className="font-medium">{unpaidStudents.length} alumna{unpaidStudents.length !== 1 ? 's' : ''} sin pagar este mes</span>
            </div>
            <p className="text-sm text-amber-600 mt-1 ml-6">Ver detalle →</p>
          </Link>
        </section>
      )}

      {/* Stats rápidos */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Resumen</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/students" className="bg-white rounded-xl border border-gray-200 px-4 py-4 flex items-center gap-3 hover:border-blue-300 transition-colors">
            <div className="bg-blue-50 rounded-lg p-2">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeStudents ?? 0}</p>
              <p className="text-xs text-gray-500">Alumnas activas</p>
            </div>
          </Link>

          <Link href="/exercises" className="bg-white rounded-xl border border-gray-200 px-4 py-4 flex items-center gap-3 hover:border-blue-300 transition-colors">
            <div className="bg-green-50 rounded-lg p-2">
              <Dumbbell size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalExercises ?? 0}</p>
              <p className="text-xs text-gray-500">Ejercicios</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
