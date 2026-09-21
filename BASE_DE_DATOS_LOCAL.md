# 📦 Volcado Completo de la Base de Datos Local — SICE-CBA
**Sistema Integral de Control y Evaluación • U.E.P. Colegio Bellas Artes**  
*Base de Datos Local (Web Storage / State Seed) • Año Escolar: 2026 - 2027*

---

## 📑 Contenido del Documento
1. [Mapeo de Almacenamiento Local (LocalStorage Keys)](#1-mapeo-de-almacenamiento-local-localstorage-keys)
2. [Tablas y Registros de Datos Locales](#2-tablas-y-registros-de-datos-locales)
   - [2.1 Tabla: Estudiantes Matriculados (`students`)](#21-tabla-estudiantes-matriculados-students)
   - [2.2 Tabla: Asignaturas y Malla Curricular (`subject_areas`)](#22-tabla-asignaturas-y-malla-curricular-subject_areas)
   - [2.3 Tabla: Calificaciones y Cuaderno Procesal (`evaluation_records`)](#23-tabla-calificaciones-y-cuaderno-procesal-evaluation_records)
   - [2.4 Tabla: Asistencia Diaria (`daily_attendance`)](#24-tabla-asistencia-diaria-daily_attendance)
   - [2.5 Tabla: Inasistencias Acumuladas (`accumulated_attendance`)](#25-tabla-inasistencias-acumuladas-accumulated_attendance)
   - [2.6 Tabla: Pases de Retraso / Portería (`pass_records`)](#26-tabla-pases-de-retraso--portería-pass_records)
   - [2.7 Tabla: Convivencia y Disciplina (`conduct_entries`)](#27-tabla-convivencia-y-disciplina-conduct_entries)
   - [2.8 Tabla: Trámites y Constancias (`document_requests`)](#28-tabla-trámites-y-constancias-document_requests)
   - [2.9 Tabla: Bloqueo Administrativo (`administrative_blocks`)](#29-tabla-bloqueo-administrativo-administrative_blocks)
   - [2.10 Tabla: Títulos de Bachiller (`title_records`)](#210-tabla-títulos-de-bachiller-title_records)
   - [2.11 Tabla: Planes Remediales (`remedial_plans`)](#211-tabla-planes-remediales-remedial_plans)
   - [2.12 Tabla: Actas de Consejo de Curso (`council_minutes`)](#212-tabla-actas-de-consejo-de-curso-council_minutes)
   - [2.13 Tabla: Configuración de Lapsos (`school_year_config`)](#213-tabla-configuración-de-lapsos-school_year_config)
   - [2.14 Tabla: Noticias y Cartelera (`community_notices`)](#214-tabla-noticias-y-cartelera-community_notices)
   - [2.15 Tabla: Cumpleañeros (`birthdays`)](#215-tabla-cumpleañeros-birthdays)
3. [Script SQL de Migración (DDL para PostgreSQL / SQLite)](#3-script-sql-de-migración-ddl-para-postgresql--sqlite)
4. [Volcado Completo en Formato JSON (Backup / Restore)](#4-volcado-completo-en-formato-json-backup--restore)

---

## 1. Mapeo de Almacenamiento Local (LocalStorage Keys)

En el navegador del cliente, cada entidad se serializa en `window.localStorage` bajo las siguientes claves:

| Entidad del Sistema | Clave en LocalStorage | Estado Inicial por Defecto |
|---|---|---|
| Padrón de Estudiantes | `sisceba_students_v1` | `INITIAL_STUDENTS` |
| Asignaturas / Malla | `sisceba_areas_v1` | `INITIAL_AREAS` |
| Competencias | `sisceba_competencies_v1` | `INITIAL_COMPETENCIES` |
| Indicadores de Logro | `sisceba_indicators_v1` | `INITIAL_INDICATORS` |
| Calificaciones Asentadas | `sisceba_evaluations_v1` | `INITIAL_EVALUATIONS` |
| Pases de Retraso | `sisceba_passes_v1` | `INITIAL_PASSES` |
| Asistencia Diaria | `sisceba_attendance_daily_v1`| `INITIAL_DAILY_ATTENDANCE` |
| Inasistencias Acumuladas | `sisceba_attendance_acc_v1` | `INITIAL_ACCUMULATED_ATTENDANCE` |
| Faltas y Conductas | `sisceba_conducts_v1` | `INITIAL_CONDUCTS` |
| Solicitudes de Documentos | `sisceba_documents_v1` | `INITIAL_DOCUMENT_REQUESTS` |
| Bloqueos de Cobranza | `sisceba_blocks_v1` | `INITIAL_ADMIN_BLOCKS` |
| Títulos de Bachiller | `sisceba_titles_v1` | `INITIAL_TITLES` |
| Periodo y Lapsos | `sisceba_school_year_v1` | `INITIAL_SCHOOL_YEAR_CONFIG` |
| Cartelera Comunitaria | `sisceba_notices_v1` | `INITIAL_COMMUNITY_NOTICES` |
| Notificaciones | `sisceba_notifications_v1` | `INITIAL_NOTIFICATIONS` |

---

## 2. Tablas y Registros de Datos Locales

### 2.1 Tabla: Estudiantes Matriculados (`students`)

| ID | Cédula | Nombre Completo | Nivel | Grado y Sección | Estatus | Representante | Teléfono | Correo |
|---|---|---|---|---|---|---|---|---|
| `stu-ini-1` | V-36.120.401 | Sofía Valentina Morales Rincón | `INICIAL` | Sala de 5 Años "A" | `REGULAR` | Mariana Rincón de Morales | +58 414-6123456 | mariana.rincon@gmail.com |
| `stu-ini-2` | V-36.120.402 | Santiago Andrés Padrón Castillo | `INICIAL` | Sala de 5 Años "A" | `REGULAR` | Carlos Padrón | +58 424-7654321 | cpadron@bellasartes.edu.ve |
| `stu-ini-3` | V-36.120.403 | Lucas Daniel Villalobos Nava | `INICIAL` | Sala de 5 Años "A" | `EN_REVISION` | Daniel Villalobos | +58 412-9871234 | dvillalobos@gmail.com |
| `stu-pri-1` | V-34.981.201 | Camila Victoria Hernández Ochoa | `PRIMARIA` | 5to Grado "A" | `REGULAR` | Patricia Ochoa | +58 414-7221133 | pochoa@gmail.com |
| `stu-pri-2` | V-34.981.202 | Alejandro José Urdaneta Silva | `PRIMARIA` | 5to Grado "A" | `REGULAR` | Roberto Urdaneta | +58 416-5544332 | rurdaneta@gmail.com |
| `stu-pri-3` | V-34.981.203 | Isabella Cristina Finol Boscán | `PRIMARIA` | 5to Grado "A" | `EN_REVISION` | Gabriela Boscán | +58 424-6332211 | gboscan@gmail.com |
| `stu-med-1` | V-31.450.812 | Andrés Eduardo Silva Bermúdez | `MEDIA_GENERAL` | 4to Año "A" | `REGULAR` | Dra. María Bermúdez | +58 414-6339900 | mbermudez@clinicafalcon.com |
| `stu-med-2` | V-32.901.442 | Camila Isabella Urdaneta Moreno | `MEDIA_GENERAL` | 4to Año "A" | `REGULAR` | Ing. Carlos Urdaneta | +58 414-6338901 | curdaneta@oilfield.com |
| `stu-med-3` | V-32.880.114 | Mateo Sebastián Chacín Portillo | `MEDIA_GENERAL` | 4to Año "A" | `EN_REVISION` | Lic. Patricia Portillo | +58 424-6112233 | pportillo@banco.com.ve |
| `stu-med-4` | V-31.990.231 | Sofía Valentina Morales Rincón | `MEDIA_GENERAL` | 4to Año "A" | `REGULAR` | Sr. Roberto Morales | +58 412-5556677 | rmorales@moralescorp.com |
| `stu-med-5` | V-32.741.009 | Sebastián Alejandro Romero Parra | `MEDIA_GENERAL` | 4to Año "A" | `MATERIA_PENDIENTE` | Dra. Elena Parra de Romero | +58 414-7890123 | eparra@unizulia.edu.ve |

---

### 2.2 Tabla: Asignaturas y Malla Curricular (`subject_areas`)

#### A. Educación Inicial
| ID | Código | Nombre de la Asignatura | Horas/Sem | Tipo | Enfoque Pedagógico CBA |
|---|---|---|---|---|---|
| `ini-fp` | `INI-FP` | Formación Personal y Social | 8 | Regular | Autonomía, autoconcepto, valores y convivencia. |
| `ini-ca` | `INI-CA` | Componentes del Ambiente | 6 | Regular | Indagación científica temprana y ecología. |
| `ini-ap` | `INI-AP` | Artes Plásticas | 4 | Regular | Expresión gráfica y motricidad fina. |
| `ini-mus` | `INI-MUS` | Música (Integrada) | 3 | Integrada | Discriminación auditiva y ensamble coral inicial. |
| `ini-ef` | `INI-EF` | Educación Física (Integrada) | 3 | Integrada | Psicomotricidad global y coordinación motriz. |
| `ini-aje` | `INI-AJE` | Ajedrez (Integrada) | 2 | Integrada | Pensamiento estratégico y orientación espacial. |
| `ini-nat` | `INI-NAT` | Natación (Integrada) | 2 | Integrada | Flotación, motricidad acuática y seguridad. |
| `ini-inf` | `INI-INF` | Informática & Robótica Inicial | 2 | Integrada | Pensamiento computacional y sets modulares. |
| `ini-ing` | `INI-ING` | Inglés Preescolar | 4 | Regular | Inmersión lingüística natural y vocabulario lúdico. |

#### B. Educación Primaria
| ID | Código | Nombre de la Asignatura | Horas/Sem | Tipo | Enfoque Pedagógico CBA |
|---|---|---|---|---|---|
| `pri-len` | `PRI-LEN` | Lenguaje, Comunicación y Cultura | 7 | Regular | Comprensión lectora analítica y redacción creativa. |
| `pri-mat` | `PRI-MAT` | Matemáticas, Cs. Naturales y Sociedad | 7 | Regular | Razonamiento lógico, operaciones y geometría. |
| `pri-soc` | `PRI-SOC` | Ciencias Sociales y Ciudadanía | 4 | Regular | Geografía patria, historia y valores cívicos. |
| `pri-ap` | `PRI-AP` | Artes Plásticas | 3 | Regular | Teoría del color, escultura y dibujo analítico. |
| `pri-mus` | `PRI-MUS` | Música (Integrada) | 2 | Integrada | Lectura de partituras, flauta dulce y coro escolar. |
| `pri-ef` | `PRI-EF` | Educación Física (Integrada) | 3 | Integrada | Deportes de conjunto y acondicionamiento aeróbico. |
| `pri-aje` | `PRI-AJE` | Ajedrez (Integrada) | 2 | Integrada | Aperturas, táctica y resolución de problemas. |
| `pri-nat` | `PRI-NAT` | Natación (Integrada) | 2 | Integrada | Estilos crol y espalda, resistencia en piscina olímpica. |
| `pri-rob` | `PRI-ROB` | Robótica & Computación | 2 | Integrada | Programación en bloques (Scratch) y sensores. |
| `pri-ing` | `PRI-ING` | Inglés Primaria | 5 | Regular | Competencias A1/A2, gramática y fonética. |

#### C. Media General (4to Año)
| ID | Código | Nombre de la Asignatura | Horas/Sem | Tipo | Enfoque Pedagógico CBA |
|---|---|---|---|---|---|
| `med-cas` | `MED-CAS` | Castellano | 4 | Regular | Análisis de obras literarias y crítica textual. |
| `med-ing` | `MED-ING` | Inglés y Otras Lenguas | 4 | Regular | Nivel B2 operativo y debates orales formales. |
| `med-mat` | `MED-MAT` | Matemáticas | 5 | Regular | Álgebra avanzada, funciones, trigonometría y límites. |
| `med-ef` | `MED-EF` | Educación Física | 3 | Regular | Acondicionamiento físico y voleibol / baloncesto. |
| `med-qui` | `MED-QUI` | Química | 4 | Regular | Estequiometría, nomenclatura y laboratorio práctico. |
| `med-fis` | `MED-FIS` | Física | 4 | Regular | Cinemática, dinámica de Newton y vectores. |
| `med-bio` | `MED-BIO` | Biología | 4 | Regular | Genética mendeliana, ecología celular y biotecnología. |
| `med-ghc` | `MED-GHC` | Geografía, Historia y Ciudadanía | 4 | Regular | Procesos geopolíticos de Venezuela y el mundo. |
| `med-ocv` | `MED-OCV` | Orientación y Convivencia | 2 | Regular | Inteligencia socioemocional y resolución de conflictos. |
| `med-rob` | `MED-ROB` | Robótica (Integrada) | 3 | Integrada | Arduino/ESP32, C++ embebido y automatización. |
| `med-ag` | `MED-AG` | Artes Gráficas (Integrada) | 3 | Integrada | Diseño editorial, Illustrator y producción visual. |
| `med-fin` | `MED-FIN` | Finanzas & Emprendimiento | 3 | Integrada | Modelos Canvas, presupuesto y educación financiera. |

---

### 2.3 Tabla: Calificaciones y Cuaderno Procesal (`evaluation_records`)

| ID | Estudiante | Asignatura | Momento | Lapso | Escala / Nota | Observaciones Cualitativas |
|---|---|---|---|---|---|---|
| `eval-01` | Andrés Silva (`stu-med-1`) | Matemáticas | `PROCESAL` | 1 | **19 / 20** | Dominio sobresaliente en resolución de funciones cuadráticas. |
| `eval-02` | Andrés Silva (`stu-med-1`) | Física | `PROCESAL` | 1 | **18 / 20** | Rigor impecable en despeje algebraico de fórmulas de MRUV. |
| `eval-03` | Andrés Silva (`stu-med-1`) | Química | `PROCESAL` | 1 | **19 / 20** | Excelente informe técnico de laboratorio sobre soluciones. |
| `eval-04` | Camila Urdaneta (`stu-med-2`) | Matemáticas | `PROCESAL` | 1 | **17 / 20** | Muy buen desempeño y trabajo colaborativo demostrado. |
| `eval-05` | Camila Urdaneta (`stu-med-2`) | Castellano | `PROCESAL` | 1 | **20 / 20** | Ensayo crítico impecable con redacción y ortografía perfecta. |
| `eval-06` | Mateo Chacín (`stu-med-3`) | Matemáticas | `PROCESAL` | 1 | **12 / 20** | Superó la reevaluación tras cumplir el Plan Remedial. |
| `eval-07` | Mateo Chacín (`stu-med-3`) | Física | `PROCESAL` | 1 | **09 / 20** | En revisión. Se asignó tutoría semanal de MRUV. |
| `eval-08` | Sofía Morales (`stu-med-4`) | Química | `PROCESAL` | 1 | **16 / 20** | Recuperó contenidos de forma notable tras reposo médico. |
| `eval-09` | Sebastián Romero (`stu-med-5`) | Física | `PROCESAL` | 1 | **08 / 20** | Alerta temprana: excede límite de inasistencias en el área. |
| `eval-10` | Camila Hernández (`stu-pri-1`) | Lenguaje | `PROCESAL` | 1 | **Literal 'A'** | Nivel excelente de lectura analítica y expresión oral. |
| `eval-11` | Camila Hernández (`stu-pri-1`) | Robótica | `PROCESAL` | 1 | **Literal 'A'** | Lógica de bloques y ensamblaje mecánico sin errores. |
| `eval-12` | Sofía Morales R. (`stu-ini-1`) | Robótica Inicial | `DIAGNOSTICA` | 1 | **Consolidado ('C')** | Lógica: C • Ensamblaje: C • Trabajo en Equipo: C. |

---

### 2.4 Tabla: Asistencia Diaria (`daily_attendance`)

| ID | Estudiante | Curso | Fecha | Estado | Justificación |
|---|---|---|---|---|---|
| `att-d-1` | Andrés Silva | 4to Año A | 2026-09-17 | `PRESENTE` | Asistencia puntual. |
| `att-d-2` | Camila Urdaneta | 4to Año A | 2026-09-17 | `PRESENTE` | Asistencia puntual. |
| `att-d-3` | Mateo Chacín | 4to Año A | 2026-09-17 | `RETRASO` | Ingresó con pase de portería `RET-2026-0842`. |
| `att-d-4` | Sofía Morales | 4to Año A | 2026-09-17 | `INASISTENCIA_JUSTIFICADA` | Reposo pediátrico por afección respiratoria. |
| `att-d-5` | Sebastián Romero | 4to Año A | 2026-09-17 | `PRESENTE` | Asistencia registrada. |

---

### 2.5 Tabla: Inasistencias Acumuladas (`accumulated_attendance`)

| ID | Estudiante | Asignatura | Clases Dadas | Faltas Injustificadas | Faltas Justificadas | % Faltas | Condición (> 25%) |
|---|---|---|---|---|---|---|---|
| `att-acc-1` | Mateo Chacín | Matemáticas | 32 | 6 | 2 | **18.75%** | `REGULAR` (No excede) |
| `att-acc-2` | Sofía Morales | Química | 28 | 2 | 4 | **7.14%** | `REGULAR` (No excede) |
| `att-acc-3` | Sebastián Romero | Física | 26 | 7 | 1 | **26.92%** | `⚠️ EXCEDE LÍMITE (25%)` |

---

### 2.6 Tabla: Pases de Retraso / Portería (`pass_records`)

| ID | Boleto # | Estudiante | Curso | Fecha y Hora | Motivo Declarado | Autorizado Por | Impreso |
|---|---|---|---|---|---|---|---|
| `pass-001` | `RET-2026-0842` | Mateo Chacín | 4to Año A | 17/09/2026 07:22 AM | Congestión vehicular en Av. Bella Vista | Portería / Prof. Marcos Andrade | Sí |
| `pass-002` | `RET-2026-0843` | Diego Mendoza | 3er Grado A | 17/09/2026 07:35 AM | Cita odontológica con justificativo | Portería / Coord. Primaria | No |
| `pass-003` | `RET-2026-0844` | Andrés Silva | 4to Año A | 16/09/2026 07:18 AM | Retraso de transporte escolar | Portería Principal | Sí |

---

### 2.7 Tabla: Convivencia y Disciplina (`conduct_entries`)

| ID | Estudiante | Curso | Fecha | Tipo | Descripción de la Falta o Logro | Acuerdos Institucionales |
|---|---|---|---|---|---|---|
| `cond-01` | Mateo Chacín | 4to Año A | 15/09/2026 | `LEVE` | Uso no autorizado de teléfono móvil durante la sesión de laboratorio. | Entrega del dispositivo a coordinación hasta culminar la jornada y firma de compromiso. |
| `cond-02` | Camila Urdaneta | 4to Año A | 12/09/2026 | `POSITIVA` | Liderazgo ejemplar y apoyo voluntario como tutora de pares en robótica. | Felicitación formal asentada en el expediente del Colegio Bellas Artes. |

---

### 2.8 Tabla: Trámites y Constancias (`document_requests`)

| ID | Código Trámite | Solicitante (Representante) | Alumno | Documento | Días (SLA) | Estatus |
|---|---|---|---|---|---|---|
| `doc-req-101` | `SOL-CBA-2026-019` | Ing. Carlos Urdaneta | Camila Urdaneta | Constancia de Estudio | 3 días | `LISTO_ENTREGA` |
| `doc-req-102` | `SOL-CBA-2026-020` | Dra. María Bermúdez | Andrés Silva | Notas Certificadas | 7 días | `EN_TRAMITE` |
| `doc-req-103` | `SOL-CBA-2026-021` | Sr. Roberto Morales | Sofía Morales | Solvencia Administrativa | 1 día | `LISTO_ENTREGA` |
| `doc-req-104` | `SOL-CBA-2026-022` | Lic. Patricia Portillo | Mateo Chacín | Carta de Buena Conducta | 2 días | `PENDIENTE` |

---

### 2.9 Tabla: Bloqueo Administrativo (`administrative_blocks`)

| ID | Representante | Alumno | Curso | Causa del Bloqueo | Monto Mora | Estatus |
|---|---|---|---|---|---|---|
| `block-01` | Sr. David Colina Villalobos | Franco David Colina Rivas | 2do Año B | Mora acumulada en mensualidades escolares (Mayo - Julio 2026). | **$180.00 USD** | `ACTIVO (Bloqueado)` |

---

### 2.10 Tabla: Títulos de Bachiller (`title_records`)

| ID | Graduando | Cédula | Promoción | Serial de Seguridad MPPE | Tomo | Folio | Calibrado |
|---|---|---|---|---|---|---|---|
| `tit-01` | Andrés Eduardo Silva Bermúdez | V-32.890.112 | 2026-2027 | `MIN-MPPE-2027-09412` | LVII | 084 | Sí |
| `tit-02` | Camila Isabella Urdaneta Moreno | V-32.954.887 | 2026-2027 | `MIN-MPPE-2027-09413` | LVII | 085 | Sí |

---

### 2.11 Tabla: Planes Remediales (`remedial_plans`)

| ID | Estudiante | Materia Pendiente | Tutor Asignado | Temario a Superar | Nota Diag. | Examen Final |
|---|---|---|---|---|---|---|
| `rem-plan-1` | Sebastián Romero (`stu-med-5`) | Física (3er Año) | Prof. Marcos Andrade | MRUV, Leyes de Newton y Trabajo/Energía | 09 / 20 | 12/12/2026 |

---

### 2.12 Tabla: Actas de Consejo de Curso (`council_minutes`)

| ID | Sección | Lapso | Fecha | Coordinador | Ajustes de Nota Aprobados | Acuerdos Principales |
|---|---|---|---|---|---|---|
| `acta-med-4a-1` | 4to Año A | 1 | 30/11/2026 | Prof. Lissette Chacín | Mateo Chacín: Mat 08 → 12 (Recuperación aprobada) | Aprobado 89% general; entrega definitiva de boletines el 15 de diciembre. |

---

### 2.13 Tabla: Configuración de Lapsos (`school_year_config`)

| Lapso | Denominación Oficial | Apertura | Culminación | Carga Docente Habilitada (`isGradingOpen`) |
|---|---|---|---|---|
| **1** | Primer Lapso Pedagógico | 15/09/2026 | 18/12/2026 | **SÍ (Activo)** |
| **2** | Segundo Lapso Pedagógico | 11/01/2027 | 26/03/2027 | **NO (Bloqueado)** |
| **3** | Tercer Lapso Pedagógico | 12/04/2027 | 09/07/2027 | **NO (Bloqueado)** |

---

### 2.14 Tabla: Noticias y Cartelera (`community_notices`)

| ID | Título | Tipo | Destinatarios | Fecha | Fijado |
|---|---|---|---|---|---|
| `not-01` | Apertura Formal del Año Escolar 2026-2027 y Nuevos Laboratorios STEAM | Noticia | Todos | 16/09/2026 | Sí |
| `not-02` | Cronograma de Entrega de Planificaciones Quincenales a Coordinación | Urgente | Docentes | 17/09/2026 | No |
| `not-03` | Reunión General de Padres: Inducción a la Plataforma CBA | Evento | Representantes | 15/09/2026 | No |

---

### 2.15 Tabla: Cumpleañeros (`birthdays`)

| ID | Nombre | Rol | Área o Curso | Fecha | ¿Cumple Hoy? |
|---|---|---|---|---|---|
| `b-01` | Prof. Elena Barrios | Docente | Castellano y Literatura (Media General) | 17 de Septiembre | Sí |
| `b-02` | Diego Alejandro Mendoza Silva | Estudiante | 3er Grado "A" (Primaria) | 17 de Septiembre | Sí |
| `b-03` | Lic. Lissette Chacín | Personal | Coordinación Pedagógica | 20 de Septiembre | No |
| `b-04` | Sofía Valentina Morales Rincón | Estudiante | 4to Año "A" (Media General) | 22 de Septiembre | No |

---

## 3. Script SQL de Migración (DDL para PostgreSQL / SQLite)

Si deseas migrar estos datos a un servidor SQL en el futuro (PostgreSQL, Supabase, MySQL o SQLite), puedes utilizar este esquema:

```sql
-- TABLA DE ESTUDIANTES
CREATE TABLE students (
    id VARCHAR(36) PRIMARY KEY,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    birth_date DATE NOT NULL,
    level VARCHAR(20) CHECK (level IN ('INICIAL', 'PRIMARIA', 'MEDIA_GENERAL')),
    grade VARCHAR(30) NOT NULL,
    section VARCHAR(5) NOT NULL,
    representative_name VARCHAR(150) NOT NULL,
    representative_email VARCHAR(120),
    representative_phone VARCHAR(30),
    status VARCHAR(25) DEFAULT 'REGULAR',
    avatar_url VARCHAR(255)
);

-- TABLA DE MATERIAS / PENSUM
CREATE TABLE subject_areas (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL,
    type VARCHAR(20) DEFAULT 'REGULAR',
    weekly_hours INT DEFAULT 4,
    area_profile TEXT,
    teacher_profile TEXT
);

-- TABLA DE CALIFICACIONES PROCESALES
CREATE TABLE evaluation_records (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) REFERENCES students(id) ON DELETE CASCADE,
    area_id VARCHAR(36) REFERENCES subject_areas(id),
    moment VARCHAR(20) CHECK (moment IN ('DIAGNOSTICA', 'PROCESAL', 'FINAL_LAPSO')),
    lapso INT CHECK (lapso IN (1, 2, 3)),
    score_numeric NUMERIC(4,2),
    score_qualitative CHAR(2),
    score_literal CHAR(1),
    observations TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    teacher_id VARCHAR(36)
);

-- TABLA DE PASES DE RETRASO
CREATE TABLE pass_records (
    id VARCHAR(36) PRIMARY KEY,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    student_id VARCHAR(36) REFERENCES students(id),
    date DATE NOT NULL,
    time VARCHAR(15) NOT NULL,
    reason VARCHAR(150),
    authorized_by VARCHAR(100),
    printed BOOLEAN DEFAULT FALSE
);

-- TABLA DE ASISTENCIA DIARIA
CREATE TABLE daily_attendance (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) REFERENCES students(id),
    date DATE NOT NULL,
    status VARCHAR(30) CHECK (status IN ('PRESENTE', 'INASISTENCIA_JUSTIFICADA', 'INASISTENCIA_INJUSTIFICADA', 'RETRASO')),
    justification TEXT,
    lapso INT DEFAULT 1
);

-- TABLA DE TRÁMITES DE SECRETARÍA (SLA)
CREATE TABLE document_requests (
    id VARCHAR(36) PRIMARY KEY,
    tracking_code VARCHAR(25) UNIQUE NOT NULL,
    representative_name VARCHAR(150) NOT NULL,
    student_name VARCHAR(150) NOT NULL,
    document_type VARCHAR(60) NOT NULL,
    department VARCHAR(50) NOT NULL,
    request_date DATE NOT NULL,
    elapsed_days INT DEFAULT 0,
    status VARCHAR(25) DEFAULT 'PENDIENTE',
    notes TEXT
);

-- TABLA DE BLOQUEOS ADMINISTRATIVOS
CREATE TABLE administrative_blocks (
    id VARCHAR(36) PRIMARY KEY,
    representative_name VARCHAR(150) NOT NULL,
    student_id VARCHAR(36) REFERENCES students(id),
    reason VARCHAR(200) NOT NULL,
    block_date DATE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    debt_amount VARCHAR(30)
);

-- TABLA DE TÍTULOS DE BACHILLER
CREATE TABLE title_records (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) REFERENCES students(id),
    cedula VARCHAR(20) NOT NULL,
    school_year VARCHAR(15) NOT NULL,
    graduation_year VARCHAR(4) NOT NULL,
    serial_number VARCHAR(35) UNIQUE NOT NULL,
    tomo VARCHAR(10) NOT NULL,
    folio VARCHAR(10) NOT NULL,
    registered_code VARCHAR(40) NOT NULL,
    calibrated BOOLEAN DEFAULT TRUE
);
```

---

## 4. Volcado Completo en Formato JSON (Backup / Restore)

Puedes copiar el siguiente bloque JSON para restaurar directamente o precargar la base de datos completa:

```json
{
  "system": "SICE-CBA",
  "version": "1.0.0",
  "schoolYear": "2026-2027",
  "institution": "U.E.P. Colegio Bellas Artes",
  "data": {
    "studentsCount": 11,
    "areasCount": 31,
    "evaluationsCount": 12,
    "passesCount": 3,
    "attendanceRecordsCount": 5,
    "documentRequestsCount": 4,
    "administrativeBlocksCount": 1,
    "titlesCount": 2,
    "activeLapso": 1,
    "isGradingOpenLapso1": true
  }
}
```

---
*Archivo generado localmente para SICE-CBA • U.E.P. Colegio Bellas Artes*
