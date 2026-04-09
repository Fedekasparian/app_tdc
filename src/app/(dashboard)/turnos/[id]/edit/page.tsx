import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import TurnoForm from '@/components/turnos/TurnoForm'
import { updateTurno } from '@/lib/turnos/actions'

export default async function EditTurnoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: turno } = await supabase.from('turnos').select('*').eq('id', id).single()
  if (!turno) notFound()

  const action = updateTurno.bind(null, id)
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Editar turno</h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <TurnoForm turno={turno} action={action} />
      </div>
    </div>
  )
}
