'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Exercise, ExerciseCategory } from '@/types'

const TYPE_LABEL: Record<string, string> = {
  body_part: 'Parte del cuerpo',
  element:   'Elementos',
  group:     'Grupales',
  integral:  'Contenidos integrales',
}

const TYPE_ORDER = ['body_part', 'element', 'group', 'integral']

const DIFFICULTIES = [
  { value: 'low', label: 'Bajo' },
  { value: 'medium', label: 'Medio' },
  { value: 'high', label: 'Alto' },
]

type Props = {
  exercise?: Exercise
  action: (formData: FormData) => Promise<{ error?: string } | undefined>
  categories?: ExerciseCategory[]
  selectedCategoryIds?: string[]
}

export default function ExerciseForm({ exercise, action, categories = [], selectedCategoryIds = [] }: Props) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [videoType, setVideoType] = useState<string>(exercise?.video_type ?? 'youtube')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(selectedCategoryIds))
  const router = useRouter()

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.set('category_ids', JSON.stringify([...selectedIds]))

    if (videoType === 'upload') {
      const file = (e.currentTarget.querySelector('input[name="video_file"]') as HTMLInputElement)?.files?.[0]
      if (file) {
        setUploadProgress('Subiendo video...')
        const supabase = createClient()
        const ext = file.name.split('.').pop()
        const path = `exercises/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(path, file, { upsert: true })

        if (uploadError) {
          setError('Error al subir el video. Intentá de nuevo.')
          setLoading(false)
          setUploadProgress('')
          return
        }

        const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(path)
        formData.set('video_url', publicUrl)
        setUploadProgress('')
      }
    }

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

      {/* Categorías multi-selección */}
      {categories.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Categorías</label>
          {TYPE_ORDER.filter(t => byType[t]?.length > 0).map(type => (
            <div key={type}>
              <p className="text-xs text-gray-500 font-medium mb-1.5">{TYPE_LABEL[type]}</p>
              <div className="flex flex-wrap gap-2">
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
            </div>
          ))}
        </div>
      )}

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
            name="video_file"
            type="file"
            accept="video/*"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {uploadProgress && <p className="text-blue-600 text-sm">{uploadProgress}</p>}
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
          {uploadProgress || (loading ? 'Guardando...' : 'Guardar')}
        </button>
      </div>
    </form>
  )
}
