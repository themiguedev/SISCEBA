# Original User Request

## 2026-09-22T12:19:08Z

Auditoría y refactorización integral del sistema académico institucional SICE-CBA para garantizar la máxima robustez lógica, separación pedagógica por subsistemas, sincronización fiable con Supabase y consistencia estricta de TypeScript.

Working directory: d:/Usuarios/UCE.FCBA/Documents/SIS-CBA
Integrity mode: development

## Requirements

### R1. Lógica de Calificaciones y Separación por Subsistemas
- Auditar y blindar el tratamiento de calificaciones en todos los módulos (Consultas, Registro Procesal, Diagnóstica, Matriz Final y Boletines).
- Garantizar que **Educación Inicial** utilice exclusivamente la **escala literal** (A, B, C, D, E), sin calificaciones numéricas (01-20) ni promedios decimales sobre 20.
- Garantizar que **Educación Primaria** utilice la **escala formativa / cualitativa**: L (Logrado), P / EP (En Proceso), I (Inicio/Iniciado).
- Garantizar que **Educación Media General** mantenga la escala cuantitativa vigesimal (01 a 20 puntos) y promedios ponderados.

### R2. Sincronización con Supabase y Estado Global
- Verificar y robustecer el flujo de datos en AppContext y supabaseService: manejo seguro de tablas vacías (students, evaluation_records, etc.) sin que el sistema fuerce datos obsoletos ni falle con excepciones en tiempo de ejecución.
- Mantener la autenticación dual (inicio de sesión indistinto mediante nombre de usuario o correo institucional) con validación en Supabase y caché local reactivo.
- Proteger el aislamiento de privacidad y control de acceso RBAC para cada uno de los 6 roles institucionales.

### R3. Consistencia Estricta de TypeScript y Compilación Limpia
- Resolver cualquier inconsistencia de tipos, propiedades opcionales no controladas (undefined/null), imports faltantes o castings inseguros.
- Garantizar una arquitectura de tipos limpia en src/types/index.ts que se refleje fielmente en los servicios y componentes.

## Acceptance Criteria

### Compilación y Verificación Estática
- [ ] npm run build (tsc -b && vite build) ejecuta con código de salida 0 y cero errores de TypeScript.
- [ ] No existen dependencias circulares ni imports rotos en toda la estructura de src/.

### Rigor Pedagógico
- [ ] En ningún componente o reporte de Educación Inicial se muestran notas numéricas (01-20) ni promedios decimales; se evalúa con literales (A-E).
- [ ] Educación Primaria evalúa cualitativamente con Logrado (L), En Proceso (P/EP) e Iniciado (I).
- [ ] En Educación Media General se evalúa cuantitativamente (01-20).

### Robustez en Base de Datos Vacía y Sincronización
- [ ] Al iniciar el sistema con 0 estudiantes registrados en Supabase, la aplicación muestra estados vacíos informativos sin desconfiguración visual ni errores en consola.
- [ ] El inicio de sesión opera con éxito tanto ingresando el usuario como el correo de cada uno de los 6 roles.

## User Clarification Update (2026-09-22T12:44:00Z)
"Ojo, hubo una confusión en las instrucciones. La escala literal (A, B, C, D, E) pertenece a la Educación Inicial, y la escala cualitativa (L (Logrado), P (Proceso), I(Inicio)) pertenece a Educación Primaria. Por favor, asegúrense de dejarlo configurado de esa manera en la lógica del sistema."
