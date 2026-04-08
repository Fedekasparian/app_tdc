type StudentFormData = {
  full_name?: string
  age?: number | null
  contact?: string
  start_date?: string
  fee_amount?: number | null
  notes?: string
}

type ValidationErrors = Partial<Record<keyof StudentFormData, string>>

export function validateStudentForm(data: StudentFormData): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!data.full_name || data.full_name.trim() === '') {
    errors.full_name = 'El nombre es obligatorio'
  }

  if (data.age !== undefined && data.age !== null && data.age < 1) {
    errors.age = 'La edad debe ser mayor a 0'
  }

  if (data.fee_amount !== undefined && data.fee_amount !== null && data.fee_amount < 0) {
    errors.fee_amount = 'La cuota debe ser mayor a 0'
  }

  return errors
}
