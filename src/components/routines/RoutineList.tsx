'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, Clock } from 'lucide-react'
import { filterRoutines } from '@/lib/routines/filter'

type Routine = { id: string; name: string; exCount: number; totalMin: number }

export default function RoutineList({ routines }: { routines: Routine[] }) {
  const [search, setSearch] = useState('')
  const filtered = filterRoutines(routines, search)

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar clase..."
          className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-8 text-center text-gray-400">
          {search ? 'No se encontraron clases' : 'Todavía no guardaste ninguna clase.'}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(routine => (
            <Link
              key={routine.id}
              href={`/routines/${routine.id}`}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3 hover:border-blue-300 transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900">{routine.name}</p>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  {routine.exCount} ejercicio{routine.exCount !== 1 ? 's' : ''}
                  {routine.totalMin > 0 && (
                    <><Clock size={12} className="ml-1" /> {routine.totalMin} min</>
                  )}
                </p>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
