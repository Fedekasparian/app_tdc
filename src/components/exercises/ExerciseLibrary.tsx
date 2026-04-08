'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, Clock, Flame } from 'lucide-react'
import { filterExercises } from '@/lib/exercises/filter'
import type { Exercise } from '@/types'

const CATEGORIES = ['movilidad', 'fuerza', 'cardio', 'elongación', 'core', 'equilibrio', 'otro']
const MUSCLE_GROUPS = ['hombros', 'tren inferior', 'tren superior', 'abdominales', 'espalda', 'glúteos', 'full body', 'otro']

const DIFFICULTY_LABEL: Record<string, string> = { low: 'Bajo', medium: 'Medio', high: 'Alto' }
const DIFFICULTY_COLOR: Record<string, string> = {
  low: 'bg-green-50 text-green-700',
  medium: 'bg-amber-50 text-amber-700',
  high: 'bg-red-50 text-red-700',
}

type Props = {
  exercises: Exercise[]
  topUsed?: Exercise[]
}

export default function ExerciseLibrary({ exercises, topUsed = [] }: Props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [muscleGroup, setMuscleGroup] = useState('')
  const [difficulty, setDifficulty] = useState('')

  const filtered = filterExercises(exercises, {
    search,
    category: category || undefined,
    muscle_group: muscleGroup || undefined,
    difficulty: difficulty || undefined,
  })

  return (
    <div className="space-y-4">
      {/* Más usados */}
      {topUsed.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <Flame size={14} className="text-orange-500" /> Más usados (30 días)
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {topUsed.map(e => (
              <Link
                key={e.id}
                href={`/exercises/${e.id}`}
                className="flex-shrink-0 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 text-sm font-medium text-orange-800 hover:bg-orange-100 transition-colors"
              >
                {e.name}
              </Link>
            ))}
          </div>
        </section>
      )}

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

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCategory('')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Todas
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(category === c ? '' : c)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${category === c ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <select
            value={muscleGroup}
            onChange={e => setMuscleGroup(e.target.value)}
            className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Músculo: todos</option>
            {MUSCLE_GROUPS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Dificultad: todas</option>
            <option value="low">Bajo</option>
            <option value="medium">Medio</option>
            <option value="high">Alto</option>
          </select>
        </div>
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
                  {exercise.category && (
                    <span className="text-xs text-gray-500">{exercise.category}</span>
                  )}
                  {exercise.muscle_group && (
                    <span className="text-xs text-gray-400">· {exercise.muscle_group}</span>
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
