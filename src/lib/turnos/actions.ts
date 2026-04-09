'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { validateTurno } from './validation'

function parseTurnoForm(formData: FormData) {
  return {
    name: (formData.get('name') as string)?.trim() ?? '',
    day_of_week: Number(formData.get('day_of_week') ?? -1),
    time: (formData.get('time') as string)?.trim() ?? '',
    max_capacity: Number(formData.get('max_capacity') ?? 0),
  }
}

export async function createTurno(formData: FormData) {
  const data = parseTurnoForm(formData)
  const errors = validateTurno(data)
  if (Object.keys(errors).length > 0) return { errors }

  const supabase = await createClient()
  const { error } = await supabase.from('turnos').insert({ ...data, active: true })
  if (error) return { errors: { _: 'Error al guardar el turno' } }

  revalidatePath('/turnos')
  redirect('/turnos')
}

export async function updateTurno(id: string, formData: FormData) {
  const data = parseTurnoForm(formData)
  const errors = validateTurno(data)
  if (Object.keys(errors).length > 0) return { errors }

  const supabase = await createClient()
  const { error } = await supabase.from('turnos').update(data).eq('id', id)
  if (error) return { errors: { _: 'Error al guardar el turno' } }

  revalidatePath('/turnos')
  redirect(`/turnos/${id}`)
}

export async function deactivateTurno(id: string) {
  const supabase = await createClient()
  await supabase.from('turnos').update({ active: false }).eq('id', id)
  revalidatePath('/turnos')
  redirect('/turnos')
}

export async function enrollStudent(turnoId: string, studentId: string) {
  const supabase = await createClient()
  await supabase.from('turno_students').upsert(
    { turno_id: turnoId, student_id: studentId, active: true },
    { onConflict: 'turno_id,student_id' }
  )
  revalidatePath(`/turnos/${turnoId}`)
}

export async function unenrollStudent(turnoId: string, studentId: string) {
  const supabase = await createClient()
  await supabase.from('turno_students')
    .update({ active: false })
    .eq('turno_id', turnoId)
    .eq('student_id', studentId)
  revalidatePath(`/turnos/${turnoId}`)
}
