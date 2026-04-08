import { describe, it, expect } from 'vitest'
import { rowsFromWorksheet } from './excel'

describe('rowsFromWorksheet', () => {
  it('maps header row to field names and returns data rows', () => {
    // Simula una hoja con encabezados en fila 1 y datos en fila 2
    const worksheet = {
      getRow: (n: number) => ({
        values: n === 1
          ? [null, 'nombre completo', 'edad', 'contacto', 'fecha inicio', 'cuota', 'observaciones']
          : [null, 'Ana García', 30, '1155551234', '2024-01-15', 15000, 'Sin obs'],
        cellCount: 7,
      }),
      rowCount: 2,
    }
    const rows = rowsFromWorksheet(worksheet as any)
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      full_name: 'Ana García',
      age: 30,
      contact: '1155551234',
      fee_amount: 15000,
    })
  })

  it('maps alias column names (nombre → full_name, cuota mensual → fee_amount)', () => {
    const worksheet = {
      getRow: (n: number) => ({
        values: n === 1
          ? [null, 'nombre', 'cuota mensual']
          : [null, 'María López', 12000],
        cellCount: 3,
      }),
      rowCount: 2,
    }
    const rows = rowsFromWorksheet(worksheet as any)
    expect(rows[0].full_name).toBe('María López')
    expect(rows[0].fee_amount).toBe(12000)
  })

  it('returns empty array when only header row exists', () => {
    const worksheet = {
      getRow: (n: number) => ({
        values: n === 1 ? [null, 'nombre completo'] : [],
        cellCount: 2,
      }),
      rowCount: 1,
    }
    const rows = rowsFromWorksheet(worksheet as any)
    expect(rows).toHaveLength(0)
  })
})
