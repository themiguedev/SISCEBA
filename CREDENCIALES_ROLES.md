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
     * `INSCRIPCIONES`: Asignación académica y consulta del padrón escolar.
     * `PASES`: Control de pases de portería por retraso con comprobante QR.
     * `INASISTENCIAS`: Auditoría de asistencias y alerta automática del 25% de inasistencias (Art. 109 LOE).
     * `CONDUCTAS`: Expedientes disciplinarios, actas de convivencia y compromisos.
     * `DOCUMENTOS`: Emisión de constancias de estudio, conducta y notas certificadas.
     * `TITULOS`: Auditoría de expedientes de 5to año, serial de papel moneda y nómina para Zona Educativa.
     * `TALLERES_CRP`: Gestión de talleres de Creación, Recreación y Participación.
     *(Sin acceso a Matrícula y Prosecución ni Bloqueo Administrativo).*
  3. **Académicos (`INICIAL`, `PRIMARIA`, `MEDIA_GENERAL`)**:
     * **Planificación Didáctica:** Diseñador Oficial CBA, aprobación y revisión de Planes Quincenales y de Lapso, Áreas/Perfiles, Banco de Competencias, Indicadores y Estrategias.
     * **Evaluación del Aprendizaje:** Valoración Diagnóstica, Cuaderno Procesal (edición y auditoría de calificaciones continuas), Definitivas de Lapso y Estadísticas.
     * **Comunicación Académica:** Verificación de Boletines Informativos, Actas de Consejo de Docentes, Asistente de Planes Remediales con IA e Informes Institucionales.
  4. **`CONSULTAS`**:
     * Sábanas de Rendimiento académico, Boletines, Asistencias, Estadísticas y Nóminas oficiales.
  5. **`COMUNIDAD`**:
     * Noticias escolares, Cumpleañeros del mes y Comunicados oficiales (con confirmación de lectura).
  6. **`CONFIGURACION`**:
     * Consulta del estado de los 3 Lapsos y personalización de temas visuales.
  7. **`AYUDA`**:
     * Manual interactivo con misiones específicas de Coordinación.

---

## 🚀 4. Inicio Rápido del Sistema

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
