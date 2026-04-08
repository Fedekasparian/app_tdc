'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Exercise } from '@/types'

const CATEGORIES = ['movilidad', 'fuerza', 'cardio', 'elongación', 'core', 'equilibrio', 'otro']
const MUSCLE_GROUPS = ['hombros', 'tren inferior', 'tren superior', 'abdominales', 'espalda', 'glúteos', 'full body', 'otro']
const DIFFICULTIES = [
  { value: 'low', label: 'Bajo' },
  { value: 'medium', label: 'Medio' },
  { value: 'high', label: 'Alto' },
]

type Props = {
  exercise?: Exercise
  action: (formData: FormData) => Promise<{ error?: string } | undefined>
}

export default function ExerciseForm({ exercise, action }: Props) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [videoType, setVideoType] = useState<string>(exercise?.video_type ?? 'youtube')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await action(formData)
    if (result?.error) {
      setError(result.error)
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
          defaultValue={exercise?.name ?? ''}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: Sentadilla"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            name="category"
            defaultValue={exercise?.category ?? ''}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">— Elegir —</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grupo muscular</label>
          <select
            name="muscle_group"
            defaultValue={exercise?.muscle_group ?? ''}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">— Elegir —</option>
            {MUSCLE_GROUPS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duración (min)</label>
          <input
            name="estimated_duration"
            type="number"
            min="1"
            max="120"
            defaultValue={exercise?.estimated_duration ?? ''}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
          <select
            name="difficulty"
            defaultValue={exercise?.difficulty ?? ''}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">— Elegir —</option>
            {DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
      </div>

      {/* Video */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Video</label>
        <div className="flex gap-2 mb-2">
          {(['youtube', 'upload'] as const).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setVideoType(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                videoType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {type === 'youtube' ? 'YouTube' : 'Subir archivo'}
            </button>
          ))}
        </div>
        <input type="hidden" name="video_type" value={videoType} />
        {videoType === 'youtube' ? (
          <input
            name="video_url"
            defaultValue={exercise?.video_type === 'youtube' ? (exercise.video_url ?? '') : ''}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://youtube.com/watch?v=..."
          />
        ) : (
          <input
            name="video_url"
            type="file"
            accept="video/*"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

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
