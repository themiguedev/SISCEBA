# 🚀 Guía de Conexión de SICE-CBA con Supabase
**Sistema Integral de Control y Evaluación • U.E.P. Colegio Bellas Artes**  
*Documento Técnico de Puesta en Marcha de Base de Datos en la Nube*

---

## 📌 Resumen de Arquitectura
La plataforma **SICE-CBA** cuenta con una arquitectura híbrida de alta resiliencia:
1. **Modo Nube (Supabase)**: Cuando defines `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`, los datos de matrículas, notas, planificaciones, pases de portería y asistencia se consultan y guardan directamente en tu base de datos relacional PostgreSQL alojada en Supabase.
2. **Modo Resiliente / Offline (Local)**: Si la plataforma se ejecuta sin credenciales en `.env` o experimenta una caída de conexión a internet, conmuta de forma transparente al almacenamiento local del navegador (`localStorage`), evitando interrupciones para los docentes y directivos.
3. **Indicador en Vivo**: En la barra superior de la aplicación podrás ver en todo momento la etiqueta:
   - 🟢 `Supabase` (Base de datos en la nube conectada).
   - 🟡 `Local` (Modo local / Respaldo activo).

---

## 🛠️ Pasos para Conectar tu Proyecto de Supabase

### Paso 1: Crear el Proyecto en Supabase
1. Ingresa en [https://supabase.com](https://supabase.com) e inicia sesión o crea una cuenta gratuita.
2. Haz clic en **"New project"**.
3. Ingresa los datos del proyecto:
   - **Name**: `SISCEBA` (o el nombre institucional que prefieras).
   - **Database Password**: Genera o escribe una contraseña segura (guárdala en tu gestor de contraseñas).
   - **Region**: Selecciona la más cercana (por ejemplo, *US East - N. Virginia* o *São Paulo*).
4. Haz clic en **"Create new project"** y espera 1-2 minutos mientras Supabase provisiona el clúster PostgreSQL.

---

### Paso 2: Crear las Tablas (Ejecutar `schema.sql`)
1. En el menú lateral izquierdo de Supabase, haz clic en el ícono del **SQL Editor** (o presiona el botón SQL).
2. Haz clic en **"New query"**.
3. Abre el archivo [`supabase/schema.sql`](file:///d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/supabase/schema.sql) de este repositorio.
4. Copia todo su contenido y pégalo en el editor SQL de Supabase.
5. Presiona el botón verde **"Run"** (o presiona `Ctrl + Enter`).
6. Verás el mensaje de confirmación: `Success. No rows returned`.
   *(Esto creará las 16 tablas institucionales, llaves foráneas, triggers de auditoría y políticas de seguridad RLS).*

---

### Paso 3: Cargar los Datos Iniciales de Bellas Artes (Ejecutar `seed.sql`)
1. En el mismo **SQL Editor** de Supabase, crea una nueva consulta (**"New query"**).
2. Abre el archivo [`supabase/seed.sql`](file:///d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/supabase/seed.sql).
3. Copia todo su contenido y pégalo en el editor SQL de Supabase.
4. Presiona el botón verde **"Run"** (o presiona `Ctrl + Enter`).
5. Verás el mensaje `Success`.
   *(Esto precargará la nómina de estudiantes de Inicial, Primaria y Media General, las 31 materias del pensum CBA, calificaciones procesales iniciales, pases de retraso foliados y avisos institucionales).*

---

### Paso 4: Configurar las Credenciales en SICE-CBA
1. En el panel de control de Supabase, ve a **Project Settings** (el ícono de engranaje en la esquina inferior izquierda) y selecciona **API** (o en Supabase 2024+, ve a **Project Settings > Data API**).
2. En la sección **API Settings**, localiza:
   - **Project URL**: Ejemplo: `https://xyzcompany.supabase.co`
   - **Project API keys**: Copia la clave llamada **`anon` `public`**.
3. En la raíz de este proyecto, abre o crea el archivo `.env`:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto-cba.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Guarda el archivo `.env`.

---

### Paso 5: Probar y Verificar
1. Inicia o reinicia el servidor de desarrollo en la terminal:
   ```bash
   npm run dev
   ```
2. Abre la plataforma en tu navegador (por ejemplo `http://localhost:3000/SISCEBA/`).
3. Observa en la parte superior izquierda (junto al texto `SICE-CBA 2026-2027`):
   - Si las credenciales son válidas, aparecerá el punto verde parpadeante con la etiqueta 🟢 **Supabase**.
4. ¡Listo! Cualquier evaluación asentada, pase de portería generado o planificación didáctica creada se guardará de inmediato en Supabase y persistirá en la nube.

---

## 📋 Mapeo de Tablas en Supabase

| Tabla en Supabase | Propósito Institucional CBA |
|---|---|
| `students` | Matrícula de Inicial, Primaria y Media General |
| `subject_areas` | Malla curricular y pensum oficial de 31 materias |
| `competencies` | Competencias formativas organizadas por lapso y área |
| `indicators` | Indicadores de logro con instrumentos y ponderación |
| `strategies` | Banco de estrategias de enseñanza y evaluación |
| `didactic_plans` | Formatos oficiales de Planificación Didáctica (Primaria y Media) |
| `plans_lapso` | Planes de evaluación trimestrales |
| `evaluation_records`| Cuaderno procesal de calificaciones (numéricas, C/EP/I, A-E) |
| `pass_records` | Pases de retraso y boletos foliados de portería |
| `daily_attendance` | Asistencia diaria por aula con justificaciones |
| `conduct_entries` | Incidentes de convivencia escolar y compromisos |
| `document_requests`| SLA de trámites de secretaría y expedición de constancias |
| `administrative_blocks`| Bloqueos administrativos por mora escolar |
| `title_records` | Calibración y registro de títulos de bachiller MPPE |
| `community_notices` | Cartelera y comunicaciones escolares |
| `system_notifications` | Notificaciones interactivas por rol |

---
*U.E.P. Colegio Bellas Artes • SICE-CBA*
