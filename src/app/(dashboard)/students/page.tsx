import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import StudentList from '@/components/students/StudentList'

export default async function StudentsPage() {
  const supabase = await createClient()
  const { data: students } = await supabase
    .from('students')
    .select('*')
    .order('full_name', { ascending: true })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Alumnas</h2>
        <Link
          href="/students/new"
          className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Nueva
        </Link>
      </div>

      <StudentList students={students ?? []} />
    </div>
  )
}
