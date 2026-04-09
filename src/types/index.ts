export type Student = {
  id: string
  full_name: string
  age: number | null
  birth_date: string | null
  address: string | null
  phone: string | null
  emergency_phone: string | null
  email: string | null
  profession: string | null
  image_authorization: boolean | null
  health_conditions: string | null
  referral_source: string | null
  contact: string | null   // legacy — usar phone/email en su lugar
  active: boolean
  start_date: string | null
  notes: string | null
  fee_amount: number | null
  created_at: string
}

export type Exercise = {
  id: string
  name: string
  video_type: 'youtube' | 'upload' | null
  video_url: string | null
  category: string | null       // legacy — usar exercise_category_map
  muscle_group: string | null   // legacy — usar exercise_category_map
  estimated_duration: number | null
  difficulty: 'low' | 'medium' | 'high' | null
  created_at: string
}

export type ExerciseCategory = {
  id: string
  name: string
  type: 'body_part' | 'element' | 'group' | 'integral'
  created_at: string
}

export type ExerciseCategoryMap = {
  exercise_id: string
  category_id: string
}

export type Routine = {
  id: string
  name: string
  created_at: string
}

export type RoutineExercise = {
  id: string
  routine_id: string
  exercise_id: string
  order_index: number
}

export type Turno = {
  id: string
  name: string
  day_of_week: number   // 0=Dom ... 6=Sáb
  time: string
  max_capacity: number
  active: boolean
  created_at: string
}

export type TurnoStudent = {
  id: string
  turno_id: string
  student_id: string
  enrolled_at: string
  active: boolean
}

export type TurnoSession = {
  id: string
  turno_id: string
  routine_id: string | null
  date: string
  notes: string | null
  created_at: string
}

export type Class = {
  id: string
  name: string
  day_of_week: number | null
  time: string
  max_capacity: number
  is_special: boolean
  special_date: string | null
  active: boolean
  created_at: string
}

export type StudentClass = {
  id: string
  student_id: string
  class_id: string
  enrolled_at: string
  active: boolean
}

export type ClassExercise = {
  id: string
  class_id: string
  exercise_id: string
  order_index: number
}

export type Session = {
  id: string
  class_id: string
  date: string
  notes: string | null
  created_at: string
}

export type SessionExercise = {
  id: string
  session_id: string
  exercise_id: string
  order_index: number
}

export type Payment = {
  id: string
  student_id: string
  month: number
  year: number
  paid: boolean
  amount: number
  late_surcharge: number
  paid_at: string | null
  created_at: string
}

export type Setting = {
  key: string
  value: string
  description: string | null
}

// Joined types
export type ExerciseWithCategories = Exercise & {
  exercise_category_map: (ExerciseCategoryMap & { exercise_categories: ExerciseCategory })[]
}

export type RoutineWithExercises = Routine & {
  routine_exercises: (RoutineExercise & { exercises: Exercise })[]
}

export type TurnoWithStudents = Turno & {
  turno_students: (TurnoStudent & { students: Student })[]
}

export type TurnoSessionWithRoutine = TurnoSession & {
  routines: RoutineWithExercises | null
  turnos: Turno
}

export type StudentWithClasses = Student & {
  student_classes: (StudentClass & { classes: Class })[]
}

export type ClassWithStudents = Class & {
  student_classes: (StudentClass & { students: Student })[]
  class_exercises: (ClassExercise & { exercises: Exercise })[]
}

export type PaymentWithStudent = Payment & {
  students: Student
}
