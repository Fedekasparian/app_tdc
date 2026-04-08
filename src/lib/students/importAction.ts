'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { parseStudentRows } from './import'
import { rowsFromWorksheet } from './excel'

export async function parseExcelFile(formData: FormData) {
  const file = formData.get('file') as File
  if (!file || file.size === 0) return { error: 'Seleccioná un archivo Excel' }

  const ExcelJS = (await import('exceljs')).default
  const workbook = new ExcelJS.Workbook()
  const buffer = await file.arrayBuffer()
  await workbook.xlsx.load(buffer)

  const worksheet = workbook.worksheets[0]
  if (!worksheet) return { error: 'El archivo no tiene hojas de cálculo' }

  const rawRows = rowsFromWorksheet(worksheet)
  const { students, skipped } = parseStudentRows(rawRows)

  return { students, skipped }
}

export async function importStudents(formData: FormData) {
  const raw = formData.get('students') as string
  if (!raw) return { error: 'No hay datos para importar' }

  const students = JSON.parse(raw)
  const supabase = await createClient()

  const { error } = await supabase.from('students').insert(students)
  if (error) return { error: 'Error al importar. Verificá que no haya alumnas duplicadas.' }

  revalidatePath('/students')
  return { imported: students.length }
}
