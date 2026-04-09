'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart/useCart'
import { ChevronUp, ChevronDown, X, Clock, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function CartSheet() {
  const { items, removeExercise, reorder, clear, count, totalDuration } = useCart()
  const [expanded, setExpanded] = useState(false)

  if (count === 0) return null

  return (
    <div className="fixed bottom-16 md:bottom-4 left-0 right-0 z-40 px-4 md:left-auto md:right-6 md:w-80">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header — siempre visible */}
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
          <div className="flex items-center gap-3">
            <span className="text-xs text-blue-200">
              {expanded ? 'Cerrar' : 'Ver clase'}
            </span>
            {expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </div>
        </button>

        {/* Lista expandible */}
        {expanded && (
          <div className="max-h-72 overflow-y-auto">
            <ul className="divide-y divide-gray-100">
              {items.map((item, idx) => (
                <li key={item.id} className="flex items-center gap-2 px-4 py-2.5">
                  {/* Reordenar */}
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

                  {/* Nombre + duración */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    {item.estimated_duration && (
                      <p className="text-xs text-gray-400">{item.estimated_duration} min</p>
                    )}
                  </div>

                  {/* Quitar */}
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

            {/* Acciones */}
            <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
              <button
                type="button"
                onClick={clear}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={13} /> Limpiar
              </button>
              <Link
                href="/classes/new"
                className="flex-1 text-center bg-blue-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Guardar como clase
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
