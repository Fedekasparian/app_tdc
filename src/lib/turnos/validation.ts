type TurnoFormData = {
  name: string
  day_of_week: number
  time: string
  max_capacity: number
}

type ValidationErrors = Record<string, string>

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export function validateTurno(data: TurnoFormData): ValidationErrors {
  const errors: ValidationErrors = {}
  if (!data.name || data.name.trim() === '') errors.name = 'El nombre es obligatorio'
  if (data.day_of_week < 0 || data.day_of_week > 6) errors.day_of_week = 'Día inválido'
  if (!data.time || data.time.trim() === '') errors.time = 'El horario es obligatorio'
  if (data.max_capacity < 1) errors.max_capacity = 'El cupo debe ser al menos 1'
  return errors
}

export function formatTurnoLabel(turno: { day_of_week: number; time: string }): string {
  return `${DAYS[turno.day_of_week] ?? '?'} ${turno.time}`
}
