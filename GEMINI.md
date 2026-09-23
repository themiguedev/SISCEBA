# Directrices de Desarrollo SICE-CBA

## 1. Escalas Evaluativas por Subsistema
- **Educación Inicial**: Exclusivamente escala **Literal** (`A`, `B`, `C`, `D`, `E`). No calcular ni mostrar promedios numéricos ni escalas sobre 20.
- **Educación Primaria**: Exclusivamente escala **Cualitativa / Formativa** (`L` [Logrado], `P` / `EP` [En Proceso], `I` [Iniciado]).
- **Educación Media General**: Escala **Cuantitativa Vigesimal** (`01` a `20`) con promedios y notas ponderadas por lapso.

## 2. Roles Institucionales, Rol Asistente y Rol Secretaria
- El sistema cuenta con roles: `ADMINISTRADOR`, `DIRECTOR`, `COORDINACION`, `SECRETARIA`, `DOCENTE`, `ASISTENTE`, `REPRESENTANTE`, `ESTUDIANTE`.
- El rol **`ASISTENTE`** se enfoca exclusivamente en **Asistencia**, **Pases de Retraso** y **Registro de Conducta / Disciplina**, sin permisos de carga de calificaciones.
- El rol **`SECRETARIA`** se enfoca en **Inscripciones**, **Matrícula / Padrón Estudiantil**, **Gestión y Solicitud de Documentos / Constancias** y consultas académicas.
- Mantener siempre sincronizados los roles en:
  - `src/types/index.ts` (`UserRole`)
  - `src/utils/rbac.ts` (`ROLE_HIERARCHY`, `ROLE_METADATA`, `ROLE_TAB_PERMISSIONS`, `ROLE_SUBTAB_PERMISSIONS`)
  - `ModernHeader.tsx` (menú de simulación de rol para Administrador)
  - `DeveloperConsoleHUD.tsx` (consola de desarrollo)
  - Esquema de base de datos Supabase (`app_users`).

## 3. Integridad de Datos y Estados Vacíos
- Mantener la base de datos limpia de registros ficticios en producción: los arrays de estudiantes (`students`), evaluaciones y representantes inician vacíos.
- Conservar únicamente las cuentas institucionales base (`admin`, `director`, `coordinador`, `asistente`, `secretaria`).
- El Administrador cuenta con un módulo en Configuración para registrar nuevos docentes y personal con correo y contraseña, así como emisión de Códigos de Autorización para auto-registro.
- Todo componente que consuma estudiantes o registros debe implementar guardas defensivas ante listas vacías para evitar excepciones en tiempo de ejecución.
