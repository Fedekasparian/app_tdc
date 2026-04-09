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

  const students = JSON.parse(raw)
  const supabase = await createClient()

  const { error } = await supabase.from('students').insert(
    students.map((s: Record<string, unknown>) => ({
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

  if (error) return { error: 'Error al importar. Verificá que no haya duplicados.' }

  revalidatePath('/students')
  return { imported: students.length }
}
