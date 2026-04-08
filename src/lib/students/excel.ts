import type { Worksheet } from 'exceljs'

// Mapeo de nombres de columna del Excel → campos del sistema
const COLUMN_MAP: Record<string, string> = {
  'nombre completo': 'full_name',
  'nombre':          'full_name',
  'edad':            'age',
  'contacto':        'contact',
  'telefono':        'contact',
  'teléfono':        'contact',
  'email':           'contact',
  'fecha inicio':    'start_date',
  'inicio':          'start_date',
  'cuota':           'fee_amount',
  'cuota mensual':   'fee_amount',
  'monto':           'fee_amount',
  'observaciones':   'notes',
  'notas':           'notes',
  'obs':             'notes',
}

type RawRow = Record<string, unknown>

export function rowsFromWorksheet(worksheet: Worksheet): RawRow[] {
  const headerRow = worksheet.getRow(1)
  const headers: string[] = []

  for (let col = 1; col <= headerRow.cellCount; col++) {
    const raw = String((headerRow.values as unknown[])[col] ?? '').toLowerCase().trim()
    headers[col] = COLUMN_MAP[raw] ?? raw
  }

  const rows: RawRow[] = []

  for (let r = 2; r <= worksheet.rowCount; r++) {
    const row = worksheet.getRow(r)
    const obj: RawRow = {}
    for (let col = 1; col <= headerRow.cellCount; col++) {
      const field = headers[col]
      if (field) obj[field] = (row.values as unknown[])[col] ?? null
    }
    rows.push(obj)
  }

  return rows
}
