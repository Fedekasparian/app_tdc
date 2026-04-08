'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createExercise(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  if (!name) return { error: 'El nombre es obligatorio' }

  const supabase = await createClient()
  const { error } = await supabase.from('exercises').insert({
    name,
    video_type: (formData.get('video_type') as string) || null,
    video_url: (formData.get('video_url') as string) || null,
    category: (formData.get('category') as string) || null,
    muscle_group: (formData.get('muscle_group') as string) || null,
    estimated_duration: formData.get('estimated_duration') ? Number(formData.get('estimated_duration')) : null,
    difficulty: (formData.get('difficulty') as string) || null,
  })

  if (error) return { error: 'Error al guardar. Intentá de nuevo.' }

  revalidatePath('/exercises')
  redirect('/exercises')
}

export async function updateExercise(id: string, formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  if (!name) return { error: 'El nombre es obligatorio' }

  const supabase = await createClient()
  const { error } = await supabase.from('exercises').update({
    name,
    video_type: (formData.get('video_type') as string) || null,
    video_url: (formData.get('video_url') as string) || null,
    category: (formData.get('category') as string) || null,
    muscle_group: (formData.get('muscle_group') as string) || null,
    estimated_duration: formData.get('estimated_duration') ? Number(formData.get('estimated_duration')) : null,
    difficulty: (formData.get('difficulty') as string) || null,
  }).eq('id', id)

  if (error) return { error: 'Error al guardar. Intentá de nuevo.' }

  revalidatePath('/exercises')
  redirect(`/exercises/${id}`)
}

export async function deleteExercise(id: string) {
  const supabase = await createClient()
  await supabase.from('exercises').delete().eq('id', id)
  revalidatePath('/exercises')
  redirect('/exercises')
}
