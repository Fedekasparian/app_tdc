import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import StudentForm from '@/components/students/StudentForm'
import { updateStudent } from '@/lib/students/actions'

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single()

  if (!student) notFound()

  const action = updateStudent.bind(null, id)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Editar alumna</h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <StudentForm student={student} action={action} />
      </div>
    </div>
  )
}
