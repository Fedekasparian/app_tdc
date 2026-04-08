'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, UserCheck, UserX } from 'lucide-react'
import type { Student } from '@/types'

type Filter = 'all' | 'active' | 'inactive'

type Props = {
  students: Student[]
}

export default function StudentList({ students }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('active')

  const filtered = students.filter(s => {
    const matchesSearch = s.full_name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && s.active) ||
      (filter === 'inactive' && !s.active)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar alumna..."
          className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['active', 'inactive', 'all'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'active' ? 'Activas' : f === 'inactive' ? 'Inactivas' : 'Todas'}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500">
        {filtered.length} alumna{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-8 text-center text-gray-400">
          No se encontraron alumnas
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(student => (
            <Link
              key={student.id}
              href={`/students/${student.id}`}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                  student.active ? 'bg-blue-50' : 'bg-gray-100'
                }`}>
                  {student.active
                    ? <UserCheck size={18} className="text-blue-600" />
                    : <UserX size={18} className="text-gray-400" />
                  }
                </div>
                <div className="min-w-0">
                  <p className={`font-medium truncate ${student.active ? 'text-gray-900' : 'text-gray-400'}`}>
                    {student.full_name}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {student.contact ?? 'Sin contacto'}
                    {student.fee_amount ? ` · $${student.fee_amount.toLocaleString('es-AR')}` : ''}
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 flex-shrink-0 ml-2" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
