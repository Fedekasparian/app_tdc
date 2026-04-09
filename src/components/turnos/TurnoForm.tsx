'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Turno } from '@/types'

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

type Props = {
  turno?: Turno
  action: (formData: FormData) => Promise<{ errors?: Record<string, string> } | undefined>
}

export default function TurnoForm({ turno, action }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    const result = await action(new FormData(e.currentTarget))
    if (result?.errors) {
      setErrors(result.errors)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          defaultValue={turno?.name ?? ''}
          placeholder="Ej: Martes 17hs"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Día <span className="text-red-500">*</span></label>
          <select
            name="day_of_week"
            defaultValue={turno?.day_of_week ?? 1}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </select>
          {errors.day_of_week && <p className="text-red-500 text-sm mt-1">{errors.day_of_week}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Horario <span className="text-red-500">*</span></label>
          <input
            name="time"
            type="time"
            defaultValue={turno?.time ?? ''}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cupo máximo</label>
        <input
          name="max_capacity"
          type="number"
          min="1"
          max="50"
          defaultValue={turno?.max_capacity ?? 8}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.max_capacity && <p className="text-red-500 text-sm mt-1">{errors.max_capacity}</p>}
      </div>

      {errors._ && <p className="text-red-500 text-sm">{errors._}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-xl border border-gray-300 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl bg-blue-600 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
