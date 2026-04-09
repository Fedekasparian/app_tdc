import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Pencil, UserPlus, UserMinus, Users } from 'lucide-react'
import { formatTurnoLabel } from '@/lib/turnos/validation'
import { deactivateTurno, enrollStudent, unenrollStudent } from '@/lib/turnos/actions'

export default async function TurnoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: turno }, { data: allStudents }] = await Promise.all([
    supabase
      .from('turnos')
      .select('*, turno_students(student_id, active, students(id, full_name))')
      .eq('id', id)
      .single(),
    supabase.from('students').select('id, full_name').eq('active', true).order('full_name'),
  ])

  if (!turno) notFound()

  const enrolled = (turno.turno_students ?? [])
    .filter((ts: { active: boolean }) => ts.active)
    .map((ts: { student_id: string; students: { id: string; full_name: string } | null }) => ts.students)
    .filter(Boolean) as { id: string; full_name: string }[]

  const enrolledIds = new Set(enrolled.map(s => s.id))
  const notEnrolled = (allStudents ?? []).filter(s => !enrolledIds.has(s.id))
  const free = turno.max_capacity - enrolled.length

  const deactivateAction = deactivateTurno.bind(null, id)

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{turno.name}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{formatTurnoLabel(turno)}</p>
        </div>
        <Link
          href={`/turnos/${id}/edit`}
          className="flex items-center gap-1.5 border border-gray-300 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex-shrink-0"
        >
          <Pencil size={15} /> Editar
        </Link>
      </div>

      {/* Cupo */}
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${free === 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
        <Users size={16} />
        <span className="text-sm font-medium">
          {enrolled.length}/{turno.max_capacity} · {free > 0 ? `${free} lugar${free !== 1 ? 'es' : ''} libre${free !== 1 ? 's' : ''}` : 'Turno completo'}
        </span>
      </div>

      {/* Alumnas inscriptas */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Inscriptas</h3>
        {enrolled.length === 0 ? (
          <p className="text-sm text-gray-400 px-1">Sin alumnas inscriptas</p>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
            {enrolled.map(student => (
              <div key={student.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-gray-900">{student.full_name}</span>
                <form action={unenrollStudent.bind(null, id, student.id)}>
                  <button type="submit" className="text-gray-400 hover:text-red-500 transition-colors">
                    <UserMinus size={16} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Agregar alumna */}
      {notEnrolled.length > 0 && free > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Agregar alumna</h3>
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 max-h-60 overflow-y-auto">
            {notEnrolled.map(student => (
              <form key={student.id} action={enrollStudent.bind(null, id, student.id)}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                >
                  <span className="text-sm text-gray-700">{student.full_name}</span>
                  <UserPlus size={16} className="text-blue-500 flex-shrink-0" />
                </button>
              </form>
            ))}
          </div>
        </section>
      )}

      {/* Dar de baja */}
      <form action={deactivateAction}>
        <button
          type="submit"
          className="w-full rounded-xl border border-red-200 text-red-600 py-3 text-sm font-semibold hover:bg-red-50 transition-colors"
        >
          Dar de baja el turno
        </button>
      </form>
    </div>
  )
}
