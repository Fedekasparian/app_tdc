export type Student = {
  id: string
  full_name: string
  age: number | null
  contact: string | null
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
  category: string | null
  muscle_group: string | null
  estimated_duration: number | null
  difficulty: 'low' | 'medium' | 'high' | null
  created_at: string
}

export type Class = {
  id: string
  name: string
  day_of_week: number | null  // 0=Sun ... 6=Sat
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
export type StudentWithClasses = Student & {
  student_classes: (StudentClass & { classes: Class })[]
}

export type ClassWithStudents = Class & {
  student_classes: (StudentClass & { students: Student })[]
  class_exercises: (ClassExercise & { exercises: Exercise })[]
}

export type SessionWithExercises = Session & {
  session_exercises: (SessionExercise & { exercises: Exercise })[]
  classes: Class
}

export type PaymentWithStudent = Payment & {
  students: Student
}
