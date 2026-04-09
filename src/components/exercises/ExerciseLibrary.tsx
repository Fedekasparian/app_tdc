'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, Clock, ChevronDown } from 'lucide-react'
import { filterByCategories } from '@/lib/exercises/filter'
import type { Exercise, ExerciseCategory } from '@/types'

const TYPE_LABEL: Record<string, string> = {
  body_part: 'Parte del cuerpo',
  element:   'Elementos',
  group:     'Grupales',
  integral:  'Contenidos integrales',
}
const TYPE_ORDER = ['body_part', 'element', 'group', 'integral']

const DIFFICULTY_LABEL: Record<string, string> = { low: 'Bajo', medium: 'Medio', high: 'Alto' }
const DIFFICULTY_COLOR: Record<string, string> = {
  low: 'bg-green-50 text-green-700',
  medium: 'bg-amber-50 text-amber-700',
  high: 'bg-red-50 text-red-700',
}

type ExerciseWithCategories = Exercise & { categories: ExerciseCategory[] }

type Props = {
  exercises: ExerciseWithCategories[]
  categories: ExerciseCategory[]
}

export default function ExerciseLibrary({ exercises, categories }: Props) {
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const [difficulty, setDifficulty] = useState('')

  const byType = TYPE_ORDER.reduce<Record<string, ExerciseCategory[]>>((acc, type) => {
    acc[type] = categories.filter(c => c.type === type)
    return acc
  }, {})

  function toggleCategory(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSection(type: string) {
    setOpenSections(prev => {
      const next = new Set(prev)
      next.has(type) ? next.delete(type) : next.add(type)
      return next
    })
  }

  const afterCategoryFilter = filterByCategories(exercises, [...selectedIds])

  const filtered = afterCategoryFilter.filter(e => {
    if (search && !e.name.toLowerCase().includes(search.trim().toLowerCase())) return false
    if (difficulty && e.difficulty !== difficulty) return false
    return true
  })

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar ejercicio..."
          className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filtros de taxonomía por tipo */}
      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        {TYPE_ORDER.filter(t => byType[t]?.length > 0).map(type => (
          <div key={type}>
            <button
              type="button"
              onClick={() => toggleSection(type)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                {TYPE_LABEL[type]}
                {byType[type].some(c => selectedIds.has(c.id)) && (
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                )}
              </span>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${openSections.has(type) ? 'rotate-180' : ''}`}
              />
            </button>
            {openSections.has(type) && (
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {byType[type].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedIds.has(cat.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dificultad + limpiar */}
      <div className="flex gap-2 items-center">
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Dificultad: todas</option>
          <option value="low">Bajo</option>
          <option value="medium">Medio</option>
          <option value="high">Alto</option>
        </select>
        {(selectedIds.size > 0 || difficulty) && (
          <button
            type="button"
            onClick={() => { setSelectedIds(new Set()); setDifficulty('') }}
            className="px-3 py-2 rounded-xl text-sm text-gray-500 border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500">{filtered.length} ejercicio{filtered.length !== 1 ? 's' : ''}</p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-8 text-center text-gray-400">
          No se encontraron ejercicios
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(exercise => (
            <Link
              key={exercise.id}
              href={`/exercises/${exercise.id}`}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3 hover:border-blue-300 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{exercise.name}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {exercise.categories.slice(0, 3).map(cat => (
                    <span key={cat.id} className="text-xs text-gray-500">{cat.name}</span>
                  ))}
                  {exercise.categories.length > 3 && (
                    <span className="text-xs text-gray-400">+{exercise.categories.length - 3}</span>
                  )}
                  {exercise.estimated_duration && (
                    <span className="text-xs text-gray-400 flex items-center gap-0.5">
                      · <Clock size={11} /> {exercise.estimated_duration}min
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                {exercise.difficulty && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_COLOR[exercise.difficulty] ?? ''}`}>
                    {DIFFICULTY_LABEL[exercise.difficulty]}
                  </span>
                )}
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
