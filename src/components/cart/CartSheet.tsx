'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart/useCart'
import { saveRoutine } from '@/lib/routines/actions'
import { ChevronUp, ChevronDown, X, Clock, Trash2 } from 'lucide-react'

export default function CartSheet() {
  const { items, removeExercise, reorder, clear, count, totalDuration } = useCart()
  const [expanded, setExpanded] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [routineName, setRoutineName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  if (count === 0) return null

  async function handleSave() {
    setSaving(true)
    setError('')
    const formData = new FormData()
    formData.set('name', routineName)
    formData.set('items', JSON.stringify(items))
    const result = await saveRoutine(formData)
    setSaving(false)
    if ('errors' in result && result.errors) {
      const e = result.errors
      setError(e.name ?? e.items ?? e._ ?? 'Error al guardar')
      return
    }
    // Éxito: limpiar estado y navegar
    clear()
    setShowModal(false)
    setRoutineName('')
    router.push('/routines')
  }

  return (
    <>
      {/* Bottom sheet */}
      <div className="fixed bottom-16 md:bottom-4 left-0 right-0 z-40 px-4 md:left-auto md:right-6 md:w-80">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <button
            type="button"
            onClick={() => setExpanded(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-blue-600 text-white"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                {count} ejercicio{count !== 1 ? 's' : ''}
              </span>
              {totalDuration > 0 && (
                <span className="flex items-center gap-1 text-blue-200 text-xs">
                  <Clock size={12} /> {totalDuration} min
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-200">{expanded ? 'Cerrar' : 'Ver clase'}</span>
              {expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </div>
          </button>

          {expanded && (
            <div className="max-h-72 overflow-y-auto">
              <ul className="divide-y divide-gray-100">
                {items.map((item, idx) => (
                  <li key={item.id} className="flex items-center gap-2 px-4 py-2.5">
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => reorder(idx, idx - 1)}
                        className="text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === items.length - 1}
                        onClick={() => reorder(idx, idx + 1)}
                        className="text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      {item.estimated_duration && (
                        <p className="text-xs text-gray-400">{item.estimated_duration} min</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExercise(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
                <button
                  type="button"
                  onClick={clear}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={13} /> Limpiar
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(true); setExpanded(false) }}
                  className="flex-1 text-center bg-blue-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Guardar como clase
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Guardar clase</h3>
            <p className="text-sm text-gray-500">
              {count} ejercicio{count !== 1 ? 's' : ''}{totalDuration > 0 ? ` · ${totalDuration} min` : ''}
            </p>
            <input
              autoFocus
              value={routineName}
              onChange={e => setRoutineName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="Nombre de la clase (ej: Lunes mañana)"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl border border-gray-300 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-xl bg-blue-600 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
