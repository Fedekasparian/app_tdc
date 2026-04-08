'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { validateStudentForm } from './validation'

type StudentFormData = {
  full_name: string
  age: string
  contact: string
  start_date: string
  fee_amount: string
  notes: string
}

export async function createStudent(formData: FormData) {
  const data = {
    full_name: (formData.get('full_name') as string) ?? '',
    age: formData.get('age') as string,
    contact: formData.get('contact') as string,
    start_date: formData.get('start_date') as string,
    fee_amount: formData.get('fee_amount') as string,
    notes: formData.get('notes') as string,
  }

  const errors = validateStudentForm({
    full_name: data.full_name,
    age: data.age ? Number(data.age) : null,
    fee_amount: data.fee_amount ? Number(data.fee_amount) : null,
  })

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('students').insert({
    full_name: data.full_name.trim(),
    age: data.age ? Number(data.age) : null,
    contact: data.contact || null,
    start_date: data.start_date || null,
    fee_amount: data.fee_amount ? Number(data.fee_amount) : null,
    notes: data.notes || null,
    active: true,
  })

  if (error) return { errors: { full_name: 'Error al guardar. Intentá de nuevo.' } }

  revalidatePath('/students')
  redirect('/students')
}

export async function updateStudent(id: string, formData: FormData) {
  const data = {
    full_name: (formData.get('full_name') as string) ?? '',
    age: formData.get('age') as string,
    contact: formData.get('contact') as string,
    start_date: formData.get('start_date') as string,
    fee_amount: formData.get('fee_amount') as string,
    notes: formData.get('notes') as string,
  }

  const errors = validateStudentForm({
    full_name: data.full_name,
    age: data.age ? Number(data.age) : null,
    fee_amount: data.fee_amount ? Number(data.fee_amount) : null,
  })

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('students').update({
    full_name: data.full_name.trim(),
    age: data.age ? Number(data.age) : null,
    contact: data.contact || null,
    start_date: data.start_date || null,
    fee_amount: data.fee_amount ? Number(data.fee_amount) : null,
    notes: data.notes || null,
  }).eq('id', id)

  if (error) return { errors: { full_name: 'Error al guardar. Intentá de nuevo.' } }

  revalidatePath('/students')
  redirect('/students')
}

export async function deactivateStudent(id: string) {
  const supabase = await createClient()
  await supabase.from('students').update({ active: false }).eq('id', id)
  revalidatePath('/students')
  redirect('/students')
}

export async function activateStudent(id: string) {
  const supabase = await createClient()
  await supabase.from('students').update({ active: true }).eq('id', id)
  revalidatePath('/students')
  redirect('/students')
}
