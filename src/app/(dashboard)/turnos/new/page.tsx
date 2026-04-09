import TurnoForm from '@/components/turnos/TurnoForm'
import { createTurno } from '@/lib/turnos/actions'

export default function NewTurnoPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Nuevo turno</h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <TurnoForm action={createTurno} />
      </div>
    </div>
  )
}
