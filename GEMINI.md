# Directrices de Desarrollo SICE-CBA

## 1. Escalas Evaluativas por Subsistema
- **Educación Inicial**: Exclusivamente escala **Literal** (`A`, `B`, `C`, `D`, `E`). No calcular ni mostrar promedios numéricos ni escalas sobre 20.
- **Educación Primaria**: Exclusivamente escala **Cualitativa / Formativa** (`L` [Logrado], `P` / `EP` [En Proceso], `I` [Iniciado]).
- **Educación Media General**: Escala **Cuantitativa Vigesimal** (`01` a `20`) con promedios y notas ponderadas por lapso.

## 2. Roles Institucionales y Rol Secretaría
- El sistema cuenta con roles: `ADMINISTRADOR`, `DIRECTOR`, `COORDINACION`, `SECRETARIA`, `DOCENTE`, `REPRESENTANTE`, `ESTUDIANTE` (el rol `ASISTENTE` ha sido eliminado).
- El rol **`SECRETARIA`** en el módulo de Gestión tiene acceso exclusivo a **Inasistencias** (`INASISTENCIAS`) y **Registro de Conducta / Disciplina** (`CONDUCTAS`), además de consultas institucionales y nóminas, sin permisos de carga de calificaciones ni acceso a inscripciones, documentos o talleres en Gestión.
- Mantener siempre sincronizados los roles en:
  - `src/types/index.ts` (`UserRole`)
  - `src/utils/rbac.ts` (`ROLE_HIERARCHY`, `ROLE_METADATA`, `ROLE_TAB_PERMISSIONS`, `ROLE_SUBTAB_PERMISSIONS`)
  - `ModernHeader.tsx` (menú de simulación de rol para Administrador)
  - `DeveloperConsoleHUD.tsx` (consola de desarrollo)
  - Esquema de base de datos PostgreSQL (`app_users`).

## 3. Integridad de Datos y Estados Vacíos
- Mantener la base de datos limpia de registros ficticios en producción: los arrays de estudiantes (`students`), evaluaciones y representantes inician vacíos.
- Conservar únicamente la cuenta institucional base del Administrador (`admin`). Los demás roles y cuentas institucionales (`DIRECTOR`, `COORDINACION`, `SECRETARIA`, `DOCENTE`) se crean y gestionan dinámicamente desde el submódulo de Gestión de Usuarios o auto-registro institucional con Códigos de Autorización.
- El Administrador cuenta con un submódulo en Gestión (`GESTION` → `USUARIOS`) para administrar y registrar nuevas cuentas de docentes y personal con correo y contraseña, así como emisión de Códigos de Autorización para auto-registro.
- Todo componente que consuma estudiantes o registros debe implementar guardas defensivas ante listas vacías para evitar excepciones en tiempo de ejecución.

## 4. Secciones Oficiales Institucionales
- Por cada grado y año escolar en todos los subsistemas (Educación Inicial, Primaria y Media General), **exclusivamente existen dos secciones: `A` y `B`**.
- Ningún formulario, selector de matrícula, filtro de prosecución o módulo de asignación debe permitir o mostrar secciones adicionales (`C`, `D`, `U` u otras).

## 5. Módulo de Matrícula y Prosecución
- La subpestaña y función de **Matrícula y Prosecución** (`MATRICULA`) dentro del módulo de Gestión es de **acceso y ejecución exclusiva para el rol `ADMINISTRADOR`**. Ningún otro rol (`DIRECTOR`, `COORDINACION`, `SECRETARIA`, `DOCENTE`) tiene permisos de acceso a este submódulo.

## 6. Arquitectura de Base de Datos Nativa Local y de Red
- **Prohibido el uso de Supabase**: El sistema opera 100% de manera autónoma con el motor PostgreSQL 16 local y una API REST nativa en Node.js (puerto 54321).
- **Base de datos compartida unificada**: Todos los accesos locales (`localhost:3000`) y de red local/LAN (`http://172.16.7.81:3000/SISCEBA/`) se comunican con la misma instancia de base de datos PostgreSQL en tiempo real.
- Cero dependencias externas o conexión a la nube obligatoria.

## 7. Habilidades Obligatorias Permanentes (Skills)
- **Clean Code y Debugging (`skills/Clean Code y Debugging`)**:
  - Aplicar siempre principios de Clean Code (SOLID, DRY, alta cohesión, nombres descriptivos y autodocumentados).
  - Programación defensiva y manejo riguroso de casos borde / estados nulos o vacíos.
  - Depuración sistemática identificando la causa raíz antes de realizar cualquier cambio.
- **Token Optimizer (`skills/token-optimizer/skills`)**:
  - Gestión eficiente y concisa del contexto y tokens en cada interacción.
  - Respuestas estructuradas, precisas y ediciones de código atómicas y quirúrgicas.
- **caveman-agent (`skills/caveman/skills`)**:




