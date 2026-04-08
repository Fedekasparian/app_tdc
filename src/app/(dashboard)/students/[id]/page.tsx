import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { deactivateStudent, activateStudent } from '@/lib/students/actions'

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single()

  if (!student) notFound()

  const toggleActive = student.active
    ? deactivateStudent.bind(null, id)
    : activateStudent.bind(null, id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 truncate">{student.full_name}</h2>
        <Link
          href={`/students/${id}/edit`}
          className="flex items-center gap-1.5 border border-gray-300 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Pencil size={16} />
          Editar
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        <Row label="Estado" value={student.active ? '✓ Activa' : '✗ Inactiva'} />
        <Row label="Edad" value={student.age ? `${student.age} años` : '—'} />
        <Row label="Contacto" value={student.contact ?? '—'} />
        <Row label="Cuota" value={student.fee_amount ? `$${Number(student.fee_amount).toLocaleString('es-AR')}` : '—'} />
        <Row label="Inicio" value={student.start_date ? new Date(student.start_date).toLocaleDateString('es-AR') : '—'} />
        {student.notes && <Row label="Observaciones" value={student.notes} />}
      </div>

      <form action={toggleActive}>
        <button
          type="submit"
          className={`w-full rounded-xl py-3 text-base font-semibold transition-colors ${
            student.active
              ? 'border border-red-200 text-red-600 hover:bg-red-50'
              : 'border border-green-200 text-green-600 hover:bg-green-50'
          }`}
        >
          {student.active ? 'Dar de baja' : 'Reactivar alumna'}
        </button>
      </form>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start px-4 py-3 gap-4">
      <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-900 text-right">{value}</span>
    </div>
  )
}
