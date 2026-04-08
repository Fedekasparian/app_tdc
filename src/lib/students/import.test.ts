import { describe, it, expect } from 'vitest'
import { parseStudentRows } from './import'

describe('parseStudentRows', () => {
  it('ignores rows with empty full_name', () => {
    const rows = [{ full_name: '', age: 30, contact: '1155551234' }]
    const { students, skipped } = parseStudentRows(rows)
    expect(students).toHaveLength(0)
    expect(skipped).toBe(1)
  })

  it('trims whitespace from full_name', () => {
    const rows = [{ full_name: '  Ana García  ' }]
    const { students } = parseStudentRows(rows)
    expect(students[0].full_name).toBe('Ana García')
  })

  it('maps a valid row to a student correctly', () => {
    const rows = [{
      full_name: 'Ana García',
      age: 30,
      contact: '1155551234',
      start_date: '2024-01-15',
      fee_amount: 15000,
      notes: 'Observación',
    }]
    const { students, skipped } = parseStudentRows(rows)
    expect(students).toHaveLength(1)
    expect(skipped).toBe(0)
    expect(students[0]).toMatchObject({
      full_name: 'Ana García',
      age: 30,
      contact: '1155551234',
      start_date: '2024-01-15',
      fee_amount: 15000,
      notes: 'Observación',
      active: true,
    })
  })

  it('processes mixed rows: valid and invalid together', () => {
    const rows = [
      { full_name: 'Ana García', age: 30 },
      { full_name: '' },
      { full_name: 'María López', fee_amount: 12000 },
      { full_name: '   ' },
    ]
    const { students, skipped } = parseStudentRows(rows)
    expect(students).toHaveLength(2)
    expect(skipped).toBe(2)
    expect(students[0].full_name).toBe('Ana García')
    expect(students[1].full_name).toBe('María López')
  })
})
