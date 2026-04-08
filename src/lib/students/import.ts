type RawRow = {
  full_name?: string
  age?: number | string | null
  contact?: string | null
  start_date?: string | null
  fee_amount?: number | string | null
  notes?: string | null
}

type ParsedStudent = {
  full_name: string
  age: number | null
  contact: string | null
  start_date: string | null
  fee_amount: number | null
  notes: string | null
  active: boolean
}

type ParseResult = {
  students: ParsedStudent[]
  skipped: number
}

export function parseStudentRows(rows: RawRow[]): ParseResult {
  const students: ParsedStudent[] = []
  let skipped = 0

  for (const row of rows) {
    if (!row.full_name || String(row.full_name).trim() === '') {
      skipped++
      continue
    }

    students.push({
      full_name: String(row.full_name).trim(),
      age: row.age !== undefined && row.age !== null ? Number(row.age) : null,
      contact: row.contact ? String(row.contact).trim() : null,
      start_date: row.start_date ? String(row.start_date).trim() : null,
      fee_amount: row.fee_amount !== undefined && row.fee_amount !== null ? Number(row.fee_amount) : null,
      notes: row.notes ? String(row.notes).trim() : null,
      active: true,
    })
  }

  return { students, skipped }
}
