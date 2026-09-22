# Dispatch Log

## 2026-09-22T12:19:33Z

You are the Project Orchestrator for the SICE-CBA institutional academic system audit and refactoring.

Your Identity & Environment:
- Role: Project Orchestrator
- Working Directory: d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/orchestrator_1
- Project Root: d:/Usuarios/UCE.FCBA/Documents/SIS-CBA
- User Request file: d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/ORIGINAL_REQUEST.md
- Integrity Mode: development

Task Overview:
Auditoría y refactorización integral del sistema académico institucional SICE-CBA para garantizar la máxima robustez lógica, separación pedagógica por subsistemas, sincronización fiable con Supabase y consistencia estricta de TypeScript.

Requirements:
1. R1. Lógica de Calificaciones y Separación por Subsistemas:
   - Auditar y blindar el tratamiento de calificaciones en todos los módulos (Consultas, Registro Procesal, Diagnóstica, Matriz Final y Boletines).
   - Garantizar que Educación Inicial opere con evaluación puramente formativa/cualitativa con la escala oficial CBA: Logrado (L), En Proceso (EP), Iniciado (I), sin calificaciones numéricas ni promedios sobre 20.
   - Garantizar que Educación Primaria utilice exclusivamente la escala literal oficial MPPE (A, B, C, D, E).
   - Garantizar que Educación Media General mantenga la escala cuantitativa vigesimal (01 a 20 puntos) y promedios ponderados.
2. R2. Sincronización con Supabase y Estado Global:
   - Verificar y robustecer el flujo de datos en AppContext y supabaseService: manejo seguro de tablas vacías (students, evaluation_records, etc.) sin que el sistema fuerce datos obsoletos ni falle con excepciones en tiempo de ejecución.
   - Mantener la autenticación dual (inicio de sesión indistinto mediante nombre de usuario o correo institucional) con validación en Supabase y caché local reactivo.
   - Proteger el aislamiento de privacidad y control de acceso RBAC para cada uno de los 6 roles institucionales.
3. R3. Consistencia Estricta de TypeScript y Compilación Limpia:
   - Resolver cualquier inconsistencia de tipos, propiedades opcionales no controladas (undefined/null), imports faltantes o castings inseguros.
   - Garantizar una arquitectura de tipos limpia en src/types/index.ts que se refleje fielmente en los servicios y componentes.

Acceptance Criteria:
- npm run build (tsc -b && vite build) ejecuta con código de salida 0 y cero errores de TypeScript.
- No existen dependencias circulares ni imports rotos en toda la estructura de src/.
- En ningún componente o reporte de Educación Inicial se muestran notas numéricas (01-20) ni promedios decimales.
- La terminología cualitativa está unificada en Logrado (L) en todo el código y vistas.
- Al iniciar el sistema con 0 estudiantes registrados en Supabase, la aplicación muestra estados vacíos informativos sin desconfiguración visual ni errores en consola.
- El inicio de sesión opera con éxito tanto ingresando el usuario como el correo de cada uno de los 6 roles.

## 2026-09-22T12:46:58Z

[ALERTA DE RECTIFICACIÓN OFICIAL DEL USUARIO]
El usuario ha emitido una aclaratoria y corrección obligatoria sobre las escalas pedagógicas de los subsistemas:

1. EDUCACIÓN INICIAL:
   - Utiliza exclusivamente la ESCALA LITERAL: (A, B, C, D, E).
   - En ningún caso debe contener calificaciones numéricas (01-20) ni promedios sobre 20.
   - En tipos y esquemas: se almacena en `score_literal` / `scoreLiteral`.

2. EDUCACIÓN PRIMARIA:
   - Utiliza exclusivamente la ESCALA FORMATIVA / CUALITATIVA: L (Logrado), P (Proceso) / EP (En Proceso), I (Inicio/Iniciado).
   - En tipos y esquemas: se almacena en `score_qualitative` / `scoreQualitative`.

3. EDUCACIÓN MEDIA GENERAL:
   - Mantiene la escala cuantitativa vigesimal (01 a 20 puntos) y promedios ponderados.

Se han actualizado los archivos centrales:
- `.agents/ORIGINAL_REQUEST.md`
- `.agents/orchestrator_1/PROJECT.md`
- `src/types/index.ts`
- `supabase/schema.sql`

Asegúrese de que todos los hitos (M2, M3, M4, M5), revisores, desafiantes y auditores apliquen e inspeccionen con rigor esta directriz: Inicial = Literales (A-E) y Primaria = Cualitativa (L, P/EP, I).

