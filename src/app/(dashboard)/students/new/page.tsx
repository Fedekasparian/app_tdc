import StudentForm from '@/components/students/StudentForm'
import { createStudent } from '@/lib/students/actions'

export default function NewStudentPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Nueva alumna</h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <StudentForm action={createStudent} />
      </div>
    </div>
  )
}
