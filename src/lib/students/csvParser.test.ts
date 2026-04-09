import { describe, it, expect } from 'vitest'
import { rowsFromCSV } from './csvParser'

// Simula un CSV de Google Forms con las columnas reales
const csvBase = `Marca temporal,APELLIDO Y NOMBRE,FECHA DE NACIMIENTO ,EDAD,DIRECCION,TELEFONO ,TELEFONO DE URGENCIAS,PROFESION U OCUPACION ,E-MAIL,¿Autoriza la obtención y publicación de imágenes?,¿Padece alguna enfermedad?,Cómo accedió a la información
2022/05/05,Bianchi Adrian,1973-12-15,48,101 n 609,2324501588,2324501588,Docente,adrian@mail.com,SI,No,Redes sociales`

describe('rowsFromCSV', () => {
  it('maps APELLIDO Y NOMBRE to full_name', () => {
    const buffer = Buffer.from(csvBase, 'utf-8')
    const rows = rowsFromCSV(buffer)
    expect(rows).toHaveLength(1)
    expect(rows[0].full_name).toBe('Bianchi Adrian')
  })

  it('maps all expected columns correctly', () => {
    const buffer = Buffer.from(csvBase, 'utf-8')
    const rows = rowsFromCSV(buffer)
    expect(rows[0]).toMatchObject({
      full_name: 'Bianchi Adrian',
      birth_date: '1973-12-15',
      age: '48',
      address: '101 n 609',
      phone: '2324501588',
      emergency_phone: '2324501588',
      profession: 'Docente',
      email: 'adrian@mail.com',
      health_conditions: 'No',
      referral_source: 'Redes sociales',
    })
  })

  it('converts SI to true for image_authorization', () => {
    const buffer = Buffer.from(csvBase, 'utf-8')
    const rows = rowsFromCSV(buffer)
    expect(rows[0].image_authorization).toBe(true)
  })

  it('converts NO to false for image_authorization', () => {
    const csv = `Marca temporal,APELLIDO Y NOMBRE,¿Autoriza la obtención y publicación de imágenes?
2022/05/05,López María,NO`
    const buffer = Buffer.from(csv, 'utf-8')
    const rows = rowsFromCSV(buffer)
    expect(rows[0].image_authorization).toBe(false)
  })

  it('strips UTF-8 BOM from start of file', () => {
    const bom = '\uFEFF'
    const buffer = Buffer.from(bom + csvBase, 'utf-8')
    const rows = rowsFromCSV(buffer)
    expect(rows).toHaveLength(1)
    expect(rows[0].full_name).toBe('Bianchi Adrian')
  })

  it('trims whitespace from column headers (TELEFONO has trailing space)', () => {
    const csv = `APELLIDO Y NOMBRE,TELEFONO
Bianchi Adrian,2324501588`
    const buffer = Buffer.from(csv, 'utf-8')
    const rows = rowsFromCSV(buffer)
    expect(rows[0].phone).toBe('2324501588')
  })

  it('ignores Marca temporal column', () => {
    const buffer = Buffer.from(csvBase, 'utf-8')
    const rows = rowsFromCSV(buffer)
    expect(rows[0]).not.toHaveProperty('marca temporal')
  })

  it('returns empty array for header-only CSV', () => {
    const csv = `APELLIDO Y NOMBRE,EDAD`
    const buffer = Buffer.from(csv, 'utf-8')
    const rows = rowsFromCSV(buffer)
    expect(rows).toHaveLength(0)
  })
})
