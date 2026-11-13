# 🔐 Credenciales de Acceso Institucional y Guía de Roles — SICE-CBA
**Sistema Integral de Control y Evaluación • U.E.P. Colegio Bellas Artes**  
*Año Escolar: 2026 - 2027 • Maracaibo, Zulia, Venezuela*  
*Autor: Ing. en Informática Miguelangel Contreras Guillén*

---

## 📌 1. Credenciales de Acceso Principales

A continuación se detallan las cuentas institucionales configuradas para administración y supervisión pedagógica en el entorno local y base de datos PostgreSQL:

| Rol Institucional | Nombre Completo | Usuario / Login | Cédula | Contraseña | Correo Electrónico | Alcance de Niveles |
|---|---|---|---|---|---|---|
| **ADMINISTRADOR** | Administrador General de Sistemas | `admin` | `V-00.000.000` | `cba2026*admin` | `admin@bellasartes.edu.ve` | Todos (Inicial, Primaria, Media General) |
| **COORDINACIÓN GENERAL** *(Temporal)* | Lic. Coordinador General (Temporal) | `coordinador` | `V-20.123.456` | `cba2026*coord` | `coordinador.prueba@bellasartes.edu.ve` | Todos (Inicial, Primaria, Media General) |
| **COORDINACIÓN INICIAL** | Lic. María Gabriela Pacheco | `coord.inicial` | `V-18.452.101` | `cba2026*inicial` | `coord.inicial@bellasartes.edu.ve` | Educación Inicial |
| **COORDINACIÓN PRIMARIA** | Prof. Roberto Antonio Mendoza | `coord.primaria` | `V-16.789.202` | `cba2026*primaria` | `coord.primaria@bellasartes.edu.ve` | Educación Primaria |
| **COORDINACIÓN MEDIA** | Prof. Patricia Coromoto Leal | `coord.media` | `V-14.321.303` | `cba2026*media` | `coord.media@bellasartes.edu.ve` | Media General |
| **ORIENTACIÓN ESCOLAR** *(Prueba)* | Lic. Sofía Valentina Navarro | `orientador` | `V-19.876.543` | `cba2026*orienta` | `orientacion@bellasartes.edu.ve` | Todos (Inicial, Primaria, Media General) |
| **DIRECCIÓN GENERAL** | Prof. Carmen Elena Rodríguez | `directora` | `V-11.234.567` | `cba2026*directora` | `directora@bellasartes.edu.ve` | Todos los niveles |

> [!TIP]
> En el campo de inicio de sesión puedes ingresar tanto con el **nombre de usuario** (`admin`, `coordinador`) como con la **cédula de identidad** normalizada (ej: `20123456` o `V-20.123.456`).

---

## 🛡️ 2. Perfil y Alcance del Rol de Administrador (`ADMINISTRADOR`)

* **Nivel Jerárquico en RBAC:** `100` (Máximo privilegio del sistema).
* **Módulos Habilitados:** Acceso total e irrestricto a todos los módulos:
  * `ESCRITORIO`: Dashboard ejecutivo, telemetría y métricas de servidor.
  * `GESTION`: Control de admisiones, inasistencias, conductas, emisión de documentos, títulos de bachiller, talleres CRP, **Gestión de Usuarios y Roles**, y **Matrícula y Prosecución Escolar (exclusivo)**.
  * `INICIAL`, `PRIMARIA`, `MEDIA_GENERAL`: Planificación, evaluación continua y comunicación de los tres subsistemas.
  * `CONSULTAS`: Sábanas de notas, auditoría de rendimiento y nóminas completas.
  * `CONFIGURACION`: Calendario de lapsos, estructura del plantel, temas visuales y **Configuración Avanzada de Servidor y Base de Datos**.
  * `AYUDA`: Manual de usuario y mapa integral del sistema.

---

## 📋 3. Perfil y Alcance del Rol de Coordinador (`COORDINACION`)

* **Nivel Jerárquico en RBAC:** `60` (Unidad de Control de Estudios - UCE).
* **Propósito:** Supervisión curricular, auditoría pedagógica de los docentes, control de notas procesales y aval de documentos evaluativos.
* **Módulos y Submódulos Habilitados:**
  1. **`ESCRITORIO`**:
     * `DASHBOARD`: Métricas en vivo (matrícula, asistencia promedio, alertas de riesgo, trámites).
     * `PERFIL`: Configuración de cuenta y seguridad 2FA.
     * `HORARIO`: Consulta de mallas y bloques horarios.
     * `SUGERENCIAS`: Buzón de sugerencias e incidencias.
  2. **`GESTION`**:
     * `TAREAS_RECURRENTES`: Seguimiento operativo interno.
     * `PASES`: Control de pases de portería por retraso con comprobante QR.
     * `INASISTENCIAS`: Auditoría de asistencias y alerta automática del 25% de inasistencias (Art. 109 LOE).
     * `CONDUCTAS`: Expedientes disciplinarios, actas de convivencia y compromisos.
     *(Sin acceso a Inscripciones, Documentos, Títulos de Bachiller, Talleres CRP, Bloqueo Administrativo ni Matrícula y Prosecución).*
  3. **Atribuciones Oficiales de Coordinación por Subsistema (Documento Institucional UCE)**:
     * **Coordinación Docente de Educación Inicial**:
       - Reporte de los indicadores evaluados (`INICIAL` → Indicadores / Revisión de Carga).
       - Reporte de los Indicadores Actitudinales evaluados (`INICIAL` → Indicadores Actitudinales).
       - Consulta de evaluación por estudiante (`INICIAL` → Observaciones al Boletín / Preescolar).
       - Consulta de evaluación por curso (`INICIAL` → Final de Lapso / `CONSULTAS` → Rendimiento).
       - Cuadros estadísticos de valoración de los indicadores: por curso y por estudiante (`INICIAL` → Estadísticas / `CONSULTAS` → Estadísticas).
     * **Coordinación Docente de Educación Primaria**:
       - Reporte de registro de indicadores evaluados: por curso y por docente (`PRIMARIA` → Revisión de Carga / Seguimiento).
       - Reporte de registros de asistencia: por curso y por estudiante (`CONSULTAS` → Asistencia / `GESTION` → Inasistencias).
       - Reporte de registros de conducta: por curso y por estudiante (`GESTION` → Conductas).
       - Reporte de Calificaciones por estudiante: Promedio MPPE y Promedio CBA (`PRIMARIA` → Calificaciones por Estudiante / `CONSULTAS` → Rendimiento).
       - Calificaciones por curso: pensum MPPE y Pensum CBA (`PRIMARIA` → Calificaciones por Curso / `CONSULTAS` → Rendimiento).
       - Cuadros estadísticos de calificaciones por curso (`CONSULTAS` → Estadísticas).
       - Cuadros estadísticos de asistencia por curso (`CONSULTAS` → Asistencia / Estadísticas).
       - Cuadros estadísticos de registros de conducta por curso (`GESTION` → Conductas / `CONSULTAS` → Estadísticas).
     * **Coordinación Docente de Educación Media General**:
       - Reporte de registro de estrategias evaluadas: por curso y por docente (`MEDIA_GENERAL` → Estrategias / Progreso).
       - Reporte de registros de asistencia: por curso y por estudiante (`CONSULTAS` → Asistencia / `GESTION` → Inasistencias).
       - Reporte de registros de conducta: por curso y por estudiante (`GESTION` → Conductas).
       - Reporte de Calificaciones por estudiante: Promedio MPPE y Promedio CBA (`CONSULTAS` → Rendimiento / Boletines).
       - Calificaciones por curso: pensum MPPE y Pensum CBA (`CONSULTAS` → Sábana de Rendimiento).
       - Cuadros estadísticos de calificaciones por curso (`CONSULTAS` → Estadísticas / Control de Ponderaciones).
       - Cuadros estadísticos de asistencia por curso (`CONSULTAS` → Asistencia / Estadísticas).
       - Cuadros estadísticos de registros de conducta por curso (`GESTION` → Conductas / `CONSULTAS` → Estadísticas).
       - Reporte de estudiantes de Grupos CRP - Creación, Recreación y Producción (`MEDIA_GENERAL` → Grupos CRP).
       - Reporte de Carga de notas de Grupos CRP (`MEDIA_GENERAL` → Grupos CRP).
  4. **`CONSULTAS`**:
     * Sábanas de Rendimiento académico, Boletines, Asistencias, Estadísticas y Nóminas oficiales.
  5. **`COMUNIDAD`**:
     * Noticias escolares, Cumpleañeros del mes y Comunicados oficiales (con confirmación de lectura).
  6. **`CONFIGURACION`**:
     * Consulta del estado de los 3 Lapsos y personalización de temas visuales.
  7. **`AYUDA`**:
     * Manual interactivo con misiones específicas de Coordinación.

---

## 🧭 4. Perfil y Alcance del Rol de Orientación (`ORIENTACION`)

* **Nivel Jerárquico en RBAC:** `50` (Departamento de Orientación y Bienestar Estudiantil).
* **Propósito Institucional:** Seguimiento y acompañamiento de la convivencia escolar, indicadores evaluados, control de inasistencias y registros disciplinarios en todos los niveles pedagógicos.
* **Módulos y Submódulos Habilitados (Según Requerimiento Oficial de Orientación):**
  1. **`ESCRITORIO`**:
     * `DASHBOARD`: Visión global institucional y métricas de convivencia.
     * `PERFIL`: Configuración de cuenta y credenciales.
     * `HORARIO`: Consulta de cronogramas.
     * `SUGERENCIAS`: Buzón interno.
  2. **`GESTION`**:
     * `PASES`: Control y seguimiento de pases de entrada/retrasos.
     * `INASISTENCIAS`: Auditoría de inasistencias y alertas tempranas de riesgo de deserción o inasistencia reiterada.
     * `CONDUCTAS`: Expedientes disciplinarios, registros de conducta y seguimiento de acuerdos de convivencia.
     *(Sin acceso a Inscripciones, Documentos, Títulos de Bachiller, Talleres CRP, Bloqueo Administrativo, Usuarios ni Matrícula y Prosecución).*
  3. **Atribuciones Oficiales del Departamento de Orientación**:
     * **Reporte de los indicadores evaluados: por nivel, curso y estudiante**:
       - `INICIAL`: Indicadores, Observaciones al Boletín, Revisión de Carga, Indicadores Actitudinales y Diagnóstico/Cierre.
       - `PRIMARIA`: Indicadores, Calificaciones procesales, Revisión de Carga y Progreso de Indicadores.
     * **Reporte de estrategias de evaluación cargadas: por curso y estudiante**:
       - `MEDIA_GENERAL`: Evaluación procesal, Estrategias de Evaluación y Progreso de Evaluaciones.
     * **Reporte de registros de conductas: por nivel, curso y estudiante**:
       - `GESTION`: Registro y seguimiento detallado de Conductas.
     * **Reporte de registros de asistencia: por nivel, curso y estudiante**:
       - `GESTION`: Inasistencias y Pases de portería.
       - `CONSULTAS`: Asistencias acumuladas y porcentajes de asistencia por curso/estudiante.
     * **Cuadros estadísticos de indicadores evaluados por curso: pensum MPPE y pensum CBA**:
       - `CONSULTAS`: Sábanas de Rendimiento, Boletines y Estadísticas comparativas.
     * **Cuadros estadísticos de asistencia por curso**:
       - `CONSULTAS`: Módulo de Estadísticas y Asistencias.
     * **Cuadros estadísticos de registro de conducta por curso**:
       - `GESTION` / `CONSULTAS`: Estadísticas consolidadas de incidentes y convivencia.
  4. **`CONSULTAS`**:
     * Rendimiento, Boletines, Asistencias, Estadísticas y Nóminas oficiales de estudiantes.
  5. **`COMUNIDAD`**:
     * Publicación de comunicados de orientación/convivencia, cartelera escolar y fechas conmemorativas.
  6. **`CONFIGURACION`**:
     * Personalización de temas visuales (`TEMAS`).
  7. **`AYUDA`**:
     * Manual de usuario.

---

## 🚀 5. Inicio Rápido del Sistema

Para ejecutar el sistema con base de datos PostgreSQL local y API Gateway nativa:

```bash
# Iniciar todos los servicios de forma automática:
node tools/server-runner.mjs
# o ejecutar el archivo por lotes en Windows:
INICIAR_SICEBA.bat
```

* **Frontend Web:** `http://localhost:3000/SISCEBA/`
* **API REST Local:** `http://127.0.0.1:54321/health`
* **Base de Datos:** PostgreSQL 16 local en puerto `5432` (DB: `sisceba`).
