'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react'
import { parseCSVFile, importCSVStudents } from '@/lib/students/csvImportAction'
import { parseExcelFile, importStudents } from '@/lib/students/importAction'

type PreviewStudent = Record<string, unknown>

export default function ImportStudentsPage() {
  const [mode, setMode] = useState<'csv' | 'excel'>('csv')
  const [step, setStep] = useState<'upload' | 'preview' | 'done'>('upload')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<PreviewStudent[]>([])
  const [skipped, setSkipped] = useState(0)
  const [imported, setImported] = useState(0)
  const router = useRouter()

  async function handleFile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = mode === 'csv'
      ? await parseCSVFile(formData)
      : await parseExcelFile(formData)

    if ('error' in result && result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setPreview((result.students as PreviewStudent[]) ?? [])
    setSkipped(result.skipped ?? 0)
    setStep('preview')
    setLoading(false)
  }

  async function handleImport() {
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.set('students', JSON.stringify(preview))

    const result = mode === 'csv'
      ? await importCSVStudents(formData)
      : await importStudents(formData)

    if ('error' in result && result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setImported((result as { imported: number }).imported)
    setStep('done')
    setLoading(false)
  }

  if (step === 'done') {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Importar alumnas</h2>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center space-y-3">
          <CheckCircle2 size={40} className="text-green-500 mx-auto" />
          <p className="text-lg font-semibold text-gray-900">{imported} alumnas importadas</p>
          <button
            onClick={() => router.push('/students')}
            className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 transition-colors"
          >
            Ver alumnas
          </button>
        </div>
      </div>
    )
  }

  if (step === 'preview') {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Importar alumnas</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
          Se van a importar <strong>{preview.length} alumnas</strong>
          {skipped > 0 && ` · ${skipped} fila${skipped !== 1 ? 's' : ''} ignorada${skipped !== 1 ? 's' : ''} (sin nombre)`}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 max-h-80 overflow-y-auto">
          {preview.map((s, i) => (
            <div key={i} className="px-4 py-3">
              <p className="font-medium text-gray-900">{String(s.full_name ?? '')}</p>
              <p className="text-sm text-gray-500">
                {[s.email, s.phone, s.profession]
                  .filter(Boolean).map(String).join(' · ') || 'Sin datos adicionales'}
              </p>
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setStep('upload')}
            className="flex-1 rounded-xl border border-gray-300 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Volver
          </button>
          <button
            onClick={handleImport}
            disabled={loading || preview.length === 0}
            className="flex-1 rounded-xl bg-blue-600 text-white py-3 text-base font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Importando...' : `Importar ${preview.length} alumnas`}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Importar alumnas</h2>

      {/* Toggle CSV / Excel */}
      <div className="flex gap-2">
        {(['csv', 'excel'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              mode === m ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {m === 'csv' ? 'Formulario Google (CSV)' : 'Excel genérico'}
          </button>
        ))}
      </div>

      {mode === 'csv' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
          Exportá el formulario de inscripción desde Google Sheets como CSV y subilo acá.
        </div>
      )}

      <form onSubmit={handleFile} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
          <Upload size={32} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-4">
            {mode === 'csv' ? 'Seleccioná el archivo CSV del formulario' : 'Seleccioná tu archivo Excel'}
          </p>
          <input
            name="file"
            type="file"
            accept={mode === 'csv' ? '.csv' : '.xlsx,.xls'}
            required
            className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 text-white py-3 text-base font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Leyendo archivo...' : 'Vista previa'}
        </button>
      </form>
    </div>
  )
}
