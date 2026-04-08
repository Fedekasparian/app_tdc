import ExcelImport from '@/components/students/ExcelImport'

export default function ImportStudentsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Importar alumnas desde Excel</h2>
      <ExcelImport />
    </div>
  )
}
