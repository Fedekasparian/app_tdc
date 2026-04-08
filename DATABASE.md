# Esquema de Base de Datos — App TDC

Base de datos PostgreSQL en Supabase. Todas las tablas tienen `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` y `created_at TIMESTAMPTZ DEFAULT now()`.

---

## Tablas

### `students` — Alumnas
```sql
CREATE TABLE students (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   TEXT NOT NULL,
  age         INTEGER,
  contact     TEXT,                        -- teléfono o email
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  start_date  DATE,
  notes       TEXT,
  fee_amount  NUMERIC(10,2),               -- cuota mensual base
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

### `exercises` — Ejercicios
```sql
CREATE TABLE exercises (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  video_type        TEXT CHECK (video_type IN ('youtube', 'upload')),
  video_url         TEXT,                  -- URL de YouTube o path en Supabase Storage
  category          TEXT,                  -- movilidad, fuerza, cardio, elongación, etc.
  muscle_group      TEXT,                  -- hombros, tren inferior, core, etc.
  estimated_duration INTEGER,             -- duración en minutos
  difficulty        TEXT CHECK (difficulty IN ('low', 'medium', 'high')),
  created_at        TIMESTAMPTZ DEFAULT now()
);
```

---

### `classes` — Clases fijas semanales
```sql
CREATE TABLE classes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  day_of_week  INTEGER CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Dom, 1=Lun, ..., 6=Sáb
  time         TIME NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 8,
  is_special   BOOLEAN NOT NULL DEFAULT FALSE,               -- TRUE = clase especial (no recurrente)
  special_date DATE,                                          -- solo si is_special = TRUE
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

---

### `student_classes` — Inscripciones (alumna ↔ clase)
```sql
CREATE TABLE student_classes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id     UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  enrolled_at  DATE NOT NULL DEFAULT CURRENT_DATE,
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (student_id, class_id)
);
```

---

### `class_exercises` — Rutina base de una clase
```sql
CREATE TABLE class_exercises (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id     UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  exercise_id  UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index  INTEGER NOT NULL DEFAULT 0,   -- posición en la rutina
  UNIQUE (class_id, exercise_id)
);
```

---

### `sessions` — Sesiones (instancia de clase en una fecha)
```sql
CREATE TABLE sessions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id   UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  date       DATE NOT NULL,
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (class_id, date)
);
```

---

### `session_exercises` — Rutina del día (puede diferir de la rutina base)
```sql
CREATE TABLE session_exercises (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  exercise_id  UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index  INTEGER NOT NULL DEFAULT 0,
  UNIQUE (session_id, exercise_id)
);
```

---

### `payments` — Pagos mensuales
```sql
CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  month           INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year            INTEGER NOT NULL,
  paid            BOOLEAN NOT NULL DEFAULT FALSE,
  amount          NUMERIC(10,2) NOT NULL,       -- monto de cuota (puede diferir del base)
  late_surcharge  NUMERIC(5,2) DEFAULT 0,       -- % de recargo aplicado (0 si pagó a tiempo)
  paid_at         DATE,                          -- fecha en que efectivamente pagó
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, month, year)
);
```

---

### `settings` — Configuración global
```sql
CREATE TABLE settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  description TEXT
);

-- Valores iniciales
INSERT INTO settings VALUES
  ('late_fee_percentage', '20', 'Porcentaje de recargo por mora (%)'),
  ('payment_cutoff_day',  '10', 'Día del mes límite para pagar sin recargo'),
  ('default_max_capacity','8',  'Cupo máximo default por clase');
```

---

## Relaciones — Diagrama simplificado

```
students ──────────────────── student_classes ─── classes
    │                                                  │
    │                                         class_exercises
    │                                                  │
  payments                               sessions ─────┘
                                              │
                                    session_exercises
                                              │
                                          exercises
```

---

## Índices recomendados

```sql
-- Búsqueda frecuente por alumna activa
CREATE INDEX idx_students_active ON students(active);

-- Pagos por mes/año
CREATE INDEX idx_payments_month_year ON payments(month, year);

-- Sesiones por fecha
CREATE INDEX idx_sessions_date ON sessions(date);

-- Ejercicios más usados (últimos 30 días) — join session_exercises + sessions
CREATE INDEX idx_sessions_date_class ON sessions(date, class_id);
CREATE INDEX idx_session_exercises_exercise ON session_exercises(exercise_id);
```

---

## Query: ejercicios más usados (últimos 30 días)

```sql
SELECT 
  e.id,
  e.name,
  e.category,
  e.muscle_group,
  COUNT(*) AS usage_count
FROM session_exercises se
JOIN sessions s ON s.id = se.session_id
JOIN exercises e ON e.id = se.exercise_id
WHERE s.date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY e.id, e.name, e.category, e.muscle_group
ORDER BY usage_count DESC
LIMIT 10;
```

---

## Query: reporte mensual financiero

```sql
SELECT
  st.full_name,
  p.amount,
  p.late_surcharge,
  p.paid,
  p.paid_at,
  ROUND(p.amount * (1 + p.late_surcharge / 100), 2) AS total_with_surcharge
FROM payments p
JOIN students st ON st.id = p.student_id
WHERE p.month = :month AND p.year = :year
ORDER BY p.paid ASC, st.full_name ASC;
```
