# PRD — App TDC (Gestión de Clases y Alumnas)

## Resumen

Aplicación web responsive para una instructora de fitness. Permite gestionar alumnas, clases, ejercicios con video, pagos mensuales y generar reportes. Diseñada para uso en celular y computadora, con navegación simple y acceso rápido a las funciones principales.

**Usuario:** Una sola instructora (single-tenant)
**Stack:** Next.js + Supabase (Auth, PostgreSQL, Storage)
**Deadline MVP:** Antes de mayo 2026

---

## Módulos

### 1. Autenticación
- Login con email y contraseña (Supabase Auth)
- Sesión persistente en el navegador
- Sin registro público — cuenta creada manualmente en Supabase

---

### 2. Alumnas

**Datos por alumna:**
- Nombre completo
- Edad
- Contacto (teléfono / email)
- Inscripción activa (sí/no)
- Fecha de inicio
- Observaciones (texto libre)
- Cuota mensual (monto base)

**Funcionalidades:**
- Alta, baja lógica (inactiva), modificación
- Importación desde archivo Excel (.xlsx) — columnas mapeadas a los campos del sistema
- Listado con filtro por nombre y estado (activa/inactiva)
- Vista detalle por alumna con historial de pagos

**Relaciones:**
- Una alumna puede estar inscripta en múltiples clases (many-to-many)
- Una alumna puede asistir a una clase diferente a la suya como recuperación (sin cambiar su inscripción base)

---

### 3. Ejercicios

**Datos por ejercicio:**
- Nombre
- Video: URL de YouTube (embed) o archivo subido (Supabase Storage)
- Categoría (ej: movilidad, fuerza, cardio, elongación, hombros, tren inferior, etc.)
- Grupo muscular
- Duración estimada (minutos)
- Nivel de dificultad (bajo / medio / alto)

**Funcionalidades:**
- Alta, baja, modificación de ejercicios
- Biblioteca con filtros por categoría, grupo muscular y dificultad
- Reproducción de video inline (YouTube embed o video nativo)
- Selección rápida: checkbox o botón "Agregar a clase" desde la biblioteca
- Accesos rápidos: sección "Más usados (últimos 30 días)" en el top de la biblioteca

---

### 4. Clases

**Datos por clase:**
- Nombre (ej: "Lunes 9hs", "Pilates Avanzado")
- Día de la semana
- Horario
- Cupo máximo (default: 8, configurable por clase)
- Alumnas inscriptas
- Rutina base (lista ordenada de ejercicios)

**Funcionalidades:**
- Alta, baja, modificación de clases fijas semanales
- Posibilidad de crear clases especiales (fecha puntual, no recurrente)
- Gestión de alumnas inscriptas por clase
- Rutina base: seleccionar y ordenar ejercicios desde la biblioteca
- Ver lugares disponibles = cupo máximo − alumnas inscriptas activas

---

### 5. Sesiones (instancias de clase)

**Datos por sesión:**
- Clase asociada
- Fecha
- Rutina del día (puede diferir de la rutina base)
- Notas opcionales

**Funcionalidades:**
- Crear sesión desde una clase existente (hereda la rutina base)
- Modificar la rutina del día: agregar, quitar u ordenar ejercicios
- Flujo principal: seleccionar ejercicios de la biblioteca → agregarlos a la sesión → guardar

---

### 6. Pagos

**Datos por pago:**
- Alumna
- Mes / Año
- Estado: pagó / no pagó
- Monto de cuota (heredado de la alumna, editable)
- Recargo por mora (% configurable globalmente)
- Fecha de corte para recargo (día del mes, configurable)
- Fecha en que pagó (si pagó)

**Funcionalidades:**
- Vista mensual: tabla con todas las alumnas activas y su estado de pago
- Marcar pago manualmente
- Cálculo automático: si paga después del día de corte, se aplica el recargo
- Alerta visual: alumnas que no pagaron y el plazo está próximo a vencer
- Historial de pagos por alumna

---

### 7. Recomendaciones *(post-MVP)*

- Sección "Más usados (últimos 30 días)": top 10 ejercicios ordenados por frecuencia de uso
- Sugerencia automática de clase: basada en los ejercicios más usados de las últimas 15 sesiones, genera una rutina de ~1 hora respetando la distribución por categoría observada

---

### 8. Reporte Mensual

**Reporte Financiero:**
- Total de alumnas activas
- Cantidad que pagaron / no pagaron
- Total cobrado en el mes
- Total pendiente (con y sin recargo)
- Desglose por alumna: nombre, monto, estado

**Reporte Operativo:**
- Cantidad de alumnas activas al cierre del mes
- Lugares libres disponibles (por clase y total)

**Formato:** Visualizable en pantalla. Exportable a PDF.

---

## Configuración Global

Parámetros configurables por la instructora:
- Porcentaje de recargo por mora
- Día de corte para aplicar recargo (ej: día 10 de cada mes)
- Cupo máximo default por clase

---

## UI / UX

- Mobile-first, funciona en celular y computadora
- Navegación simple: barra inferior en mobile, sidebar en desktop
- Botones grandes, texto legible sin zoom
- Flujo crítico optimizado: Ejercicios → seleccionar → agregar a sesión en 3 toques
- Dashboard inicial: resumen del día (clases de hoy, alumnas con pago pendiente)

---

## MVP — Alcance 3 semanas

### Semana 1-2
- [ ] Setup Next.js + Supabase
- [ ] Auth (login/logout)
- [ ] Módulo Alumnas (ABM + import Excel)
- [ ] Módulo Ejercicios (ABM + video YouTube/upload + filtros)
- [ ] Módulo Clases (ABM + rutina base + alumnas inscriptas)
- [ ] Módulo Sesiones (crear desde clase + modificar rutina del día)

### Semana 3
- [ ] Módulo Pagos (estado mensual + alertas + recargo)
- [ ] Reporte mensual (financiero + operativo)
- [ ] Export PDF del reporte

### Post-MVP
- [ ] Recomendaciones automáticas
- [ ] Análisis estadístico avanzado
- [ ] Sugerencia de clase automática
