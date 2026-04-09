'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { validateRoutine } from './validation'

type CartItem = { id: string; name: string; estimated_duration: number | null }

export async function saveRoutine(formData: FormData) {
  const name = (formData.get('name') as string)?.trim() ?? ''
  const raw = formData.get('items') as string
  const items: CartItem[] = raw ? JSON.parse(raw) : []

  const errors = validateRoutine(name, items)
  if (Object.keys(errors).length > 0) return { errors }

  const supabase = await createClient()

  const { data: routine, error: routineError } = await supabase
    .from('routines')
    .insert({ name })
    .select('id')
    .single()

  if (routineError || !routine) return { errors: { _: 'Error al guardar la rutina' } }

  const { error: exError } = await supabase.from('routine_exercises').insert(
    items.map((item, idx) => ({
      routine_id: routine.id,
      exercise_id: item.id,
      order_index: idx,
    }))
  )

  if (exError) return { errors: { _: 'Error al guardar los ejercicios' } }

  revalidatePath('/routines')
  // No redirect — el client se encarga de navegar para poder actualizar el estado del modal
  return { success: true as const }
}

export async function deleteRoutine(id: string) {
  const supabase = await createClient()
  await supabase.from('routines').delete().eq('id', id)
  revalidatePath('/routines')
  redirect('/routines')
}
