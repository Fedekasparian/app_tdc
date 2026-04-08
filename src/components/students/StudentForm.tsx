'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Student } from '@/types'

type Props = {
  student?: Student
  action: (formData: FormData) => Promise<{ errors?: Record<string, string> } | undefined>
}

export default function StudentForm({ student, action }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const result = await action(formData)

    if (result?.errors) {
      setErrors(result.errors)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre completo <span className="text-red-500">*</span>
        </label>
        <input
          name="full_name"
          defaultValue={student?.full_name ?? ''}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: Ana García"
        />
        {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
          <input
            name="age"
            type="number"
            min="1"
            max="120"
            defaultValue={student?.age ?? ''}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 35"
          />
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cuota mensual</label>
          <input
            name="fee_amount"
            type="number"
            min="0"
            step="100"
            defaultValue={student?.fee_amount ?? ''}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 15000"
          />
          {errors.fee_amount && <p className="text-red-500 text-sm mt-1">{errors.fee_amount}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
        <input
          name="contact"
          defaultValue={student?.contact ?? ''}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Teléfono o email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
        <input
          name="start_date"
          type="date"
          defaultValue={student?.start_date ?? ''}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
        <textarea
          name="notes"
          defaultValue={student?.notes ?? ''}
          rows={3}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Notas adicionales..."
        />
      </div>

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
