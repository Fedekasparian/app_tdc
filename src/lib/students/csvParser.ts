type RawRow = Record<string, string | boolean | null>

const COLUMN_MAP: Record<string, string> = {
  'apellido y nombre':                                          'full_name',
  'nombre completo':                                            'full_name',
  'fecha de nacimiento':                                        'birth_date',
  'edad':                                                       'age',
  'direccion':                                                  'address',
  'dirección':                                                  'address',
  'telefono':                                                   'phone',
  'teléfono':                                                   'phone',
  'telefono de urgencias':                                      'emergency_phone',
  'teléfono de urgencias':                                      'emergency_phone',
  'profesion u ocupacion':                                      'profession',
  'profesión u ocupación':                                      'profession',
  'e-mail':                                                     'email',
  'email':                                                      'email',
  '¿autoriza la obtención y publicación de imágenes con el objetivo de difundir y promocionar el espacio?': 'image_authorization',
  '¿autoriza la obtención y publicación de imágenes?':          'image_authorization',
  'autoriza la obtención y publicación de imágenes':            'image_authorization',
  '¿padece alguna enfermedad? (especificar)':                   'health_conditions',
  '¿padece alguna enfermedad?':                                 'health_conditions',
  'cómo accedió a la información del espacio de trabajo corporal?': 'referral_source',
  'cómo accedió a la información':                              'referral_source',
}

function stripBOM(str: string): string {
  return str.charCodeAt(0) === 0xfeff ? str.slice(1) : str
}

function normalizeHeader(raw: string): string {
  return raw.trim().toLowerCase()
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
}

export function rowsFromCSV(buffer: Buffer): RawRow[] {
  const text = stripBOM(buffer.toString('utf-8'))
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '')
  if (lines.length < 2) return []

  const rawHeaders = parseCSVLine(lines[0])
  const headers = rawHeaders.map(h => {
    const normalized = normalizeHeader(h)
    return COLUMN_MAP[normalized] ?? null
  })

  const rows: RawRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const obj: RawRow = {}

    for (let col = 0; col < headers.length; col++) {
      const field = headers[col]
      if (!field) continue
      const raw = (values[col] ?? '').trim()

      if (field === 'image_authorization') {
        obj[field] = raw.toLowerCase() === 'si' || raw.toLowerCase() === 'sí'
      } else {
        obj[field] = raw !== '' ? raw : null
      }
    }

    rows.push(obj)
  }

  return rows
}
