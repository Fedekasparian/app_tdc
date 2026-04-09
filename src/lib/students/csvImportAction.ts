'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { rowsFromCSV } from './csvParser'

export async function parseCSVFile(formData: FormData) {
  const file = formData.get('file') as File
  if (!file || file.size === 0) return { error: 'Seleccioná un archivo CSV' }

  const buffer = Buffer.from(await file.arrayBuffer())
  const rows = rowsFromCSV(buffer)

  const students = rows.filter(r => r.full_name && String(r.full_name).trim() !== '')
  const skipped = rows.length - students.length

  return { students, skipped }
}

export async function importCSVStudents(formData: FormData) {
  const raw = formData.get('students') as string
  if (!raw) return { error: 'No hay datos para importar' }

  const incoming: Record<string, unknown>[] = JSON.parse(raw)
  const supabase = await createClient()

  // Fetch existing student names to detect duplicates
  const { data: existing, error: fetchError } = await supabase
    .from('students')
    .select('full_name')

  if (fetchError) return { error: `Error al conectar con la base de datos: ${fetchError.message}` }

  const existingNames = new Set(
    (existing ?? []).map(s => String(s.full_name).trim().toLowerCase())
  )

  const newStudents = incoming.filter(
    s => !existingNames.has(String(s.full_name ?? '').trim().toLowerCase())
  )
  const duplicates = incoming
    .filter(s => existingNames.has(String(s.full_name ?? '').trim().toLowerCase()))
    .map(s => String(s.full_name))

  if (newStudents.length === 0) {
    return { imported: 0, duplicates, skipped_duplicates: duplicates.length }
  }

  const { error } = await supabase.from('students').insert(
    newStudents.map(s => ({
      full_name: s.full_name,
      birth_date: s.birth_date ?? null,
      age: s.age ? Number(s.age) : null,
      address: s.address ?? null,
      phone: s.phone ?? null,
      emergency_phone: s.emergency_phone ?? null,
      profession: s.profession ?? null,
      email: s.email ?? null,
      image_authorization: s.image_authorization ?? false,
      health_conditions: s.health_conditions ?? null,
      referral_source: s.referral_source ?? null,
      active: true,
    }))
  )

  if (error) return { error: `Error al importar: ${error.message}` }

  revalidatePath('/students')
  return { imported: newStudents.length, duplicates, skipped_duplicates: duplicates.length }
}
