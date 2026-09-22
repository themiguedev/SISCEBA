# Informe de Auditoría y Diagnóstico R3: Consistencia Estricta de TypeScript y Compilación Limpia

**Fecha**: 2026-09-22  
**Autor**: Explorer Subagent (TypeScript & Build Consistency Explorer)  
**Entorno de Trabajo**: `d:/Usuarios/UCE.FCBA/Documents/SIS-CBA`  
**Directorio del Agente**: `d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/explorer_r3_types`

---

## 1. Observation (Observaciones Directas)

### 1.1. Estado Actual de Compilación y Build

Se ejecutó la verificación de build en la raíz del proyecto:
- **Comando**: `npm run build` (`tsc -b && vite build`)
- **Resultado**: Código de salida `0` (Exitoso).
- **Salida de consola**:
```text
> sisceba-antigravity@1.0.0 build
> tsc -b && vite build

vite v8.3.0 building client environment for production...
transforming...
✓ 2542 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                     1.46 kB │ gzip:   0.68 kB
dist/assets/index-DgKujVyR.css    118.38 kB │ gzip:  18.70 kB
dist/assets/index-B-JJHvT1.js   1,540.55 kB │ gzip: 382.20 kB

[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification.
✓ built in 937ms
```

Al inspeccionar `tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "types": ["vite/client"],
    "allowArbitraryExtensions": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": false,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```
**Observación clave**:
1. `"strict": true` está **ausente** en `tsconfig.app.json` (a diferencia de `tsconfig.node.json` donde se configuró `erasableSyntaxOnly: true`).
2. `"noUnusedLocals": false` y `"noUnusedParameters": false` enmascaran código no utilizado.
3. Al ejecutar `npx tsc -p tsconfig.app.json --noUnusedLocals --noUnusedParameters --noEmit`, falló con **más de 67 errores TS6133** por imports y variables muertas.

---

### 1.2. Análisis de Dependencias Circulares e Integridad de Imports

Se ejecutó la herramienta `madge` sobre todo el código fuente:
- **Comando**: `npx madge --circular --extensions ts,tsx src`
- **Resultado**:
```text
Processed 62 files (5.2s) 
√ No circular dependency found!
```
**Observación**: No existen ciclos de dependencia entre módulos en `src/`.

---

### 1.3. Diagnóstico de Linters / Oxlint

Se ejecutó `npm run lint` (`oxlint`):
- **Resultado**: Código de salida `0`, **258 advertencias**, **0 errores sintácticos directos**.
- **Desglose de advertencias por regla**:
  - `eslint(no-unused-vars)`: **223** advertencias.
  - `react(immutability)`: **13** advertencias críticas.
  - `react(set-state-in-effect)`: **10** advertencias.
  - `react-hooks(exhaustive-deps)`: **7** advertencias.
  - `react(only-export-components)`: **5** advertencias.

**Archivos con mayor concentración de advertencias**:
1. `src/context/AppContext.tsx`: 19 advertencias.
2. `src/components/evaluation/ProcesalGradebookView.tsx`: 13 advertencias.
3. `src/components/consultas/ConsultasModule.tsx`: 12 advertencias.
4. `src/components/ayuda/MapaDelSitioView.tsx`: 12 advertencias.
5. `src/components/communication/BoletinInformativoView.tsx`: 11 advertencias.
6. `src/components/layout/KeyboardShortcutsModal.tsx`: 10 advertencias.
7. `src/components/communication/RemedialInterventionView.tsx`: 10 advertencias.

---

### 1.4. Violaciones de Tipos y Convenciones Críticas Encontradas

#### A. Omisión de la Escala Oficial 'L' (Logrado) en Ajustes y Base de Datos
- **Ubicación 1**: `src/context/AppContext.tsx:953`:
  ```ts
  scoreQualitative: (['C', 'EP', 'I'].includes(newScore) ? newScore : undefined) as QualitativeScore,
  ```
  La lista comprueba `['C', 'EP', 'I']` y **excluye deliberadamente `'L'`**. Si se introduce la nota oficial `'L'`, `includes('L')` evalúa a `false` y asigna `undefined`.
- **Ubicación 2**: `supabase/schema.sql:142`:
  ```sql
  score_qualitative CHAR(2) CHECK (score_qualitative IN ('C', 'EP', 'I')),
  ```
  El constraint en PostgreSQL rechaza el valor `'L'`, provocando un error `23514 check constraint violation` al guardar calificaciones de Educación Inicial con la escala oficial institucional.
- **Ubicación 3**: `supabase/seed.sql:83`:
  ```sql
  ('eval-12', 'stu-ini-1', 'ini-inf', 'DIAGNOSTICA', 1, NULL, 'C', NULL, '...', '2026-09-17', 'prof-ini-1')
  ```
  Utiliza `'C'` en lugar de `'L'`.
- **Ubicación 4**: `src/components/evaluation/FinalLapsoView.tsx:37, 47`:
  ```ts
  : finalRec.scoreQualitative || 'C'
  ```
  Fallback a `'C'` en lugar de `'L'`.

#### B. Confusión de Escala Primaria vs Inicial en Vistas de Evaluación
- **Ubicación 1**: `src/components/evaluation/ProcesalGradebookView.tsx:113-114`:
  ```ts
  scoreNumeric: currentLevel === 'MEDIA_GENERAL' ? Number(val) : undefined,
  scoreQualitative: currentLevel !== 'MEDIA_GENERAL' ? (val as QualitativeScore) : undefined,
  ```
  Para `PRIMARIA`, la aplicación guarda las notas como `scoreQualitative` (escala L, EP, I) en vez de almacenar `scoreLiteral` (escala oficial MPPE: A, B, C, D, E).
- **Ubicación 2**: `src/components/evaluation/ProcesalGradebookView.tsx:361-372`:
  En la cuadrícula de captura, si `currentLevel !== 'MEDIA_GENERAL'`, renderiza un `<select>` con opciones `L`, `EP`, `I`. En Primaria no ofrece la selección de literales `A`, `B`, `C`, `D`, `E`.
- **Ubicación 3**: `src/components/evaluation/DiagnosticView.tsx:96`:
  ```ts
  scoreQualitative: currentLevel !== 'MEDIA_GENERAL' ? (entry.qualitative ?? 'L') : undefined,
  ```
  Nuevamente se omite `scoreLiteral` para Primaria.

#### C. Vulnerabilidad Fatal ante Base de Datos Vacía (Null Pointer / TypeError)
- **Ubicación**: `src/components/communication/BoletinInformativoView.tsx:48, 172-185, 292, 300, 310`:
  ```ts
  const activeStudent = displayStudents.find(s => s.id === selectedStudentId) || displayStudents[0] || levelStudents[0];
  ...
  <strong className="text-[#2C2E53] text-sm block truncate">{activeStudent.fullName}</strong>
  <strong className="text-slate-700 block">{activeStudent.cedula}</strong>
  <strong className="text-slate-700 block">{activeStudent.grade} - "{activeStudent.section}"</strong>
  <strong className="text-slate-700 block truncate">{activeStudent.representativeName}</strong>
  ...
  <span className="text-[10px] text-slate-500 block">Tutoría de Sección {activeStudent.section}</span>
  <strong className="block text-[#2C2E53] truncate">{activeStudent.representativeName}</strong>
  <span className="font-bold text-slate-600">CBA-BOL-2026-L{activeLapso}-{activeStudent.id.toUpperCase()}</span>
  ```
  Si la base de datos no tiene estudiantes (`students.length === 0`), `activeStudent` es `undefined`. La aplicación **colapsa con una excepción no capturada en tiempo de ejecución**:
  `Uncaught TypeError: Cannot read properties of undefined (reading 'fullName')`.
  No existe ninguna verificación de estado vacío (`if (!activeStudent) return <EmptyState />`).
- **Ubicación 2**: `src/components/communication/BoletinInformativoView.tsx:90-91`:
  ```ts
  const studentScores = levelAreas.map(a => getAreaEvaluation(a.id).scoreNumeric || 15);
  const generalAverage = Math.round((studentScores.reduce((a, b) => a + b, 0) / studentScores.length) * 10) / 10;
  ```
  Si `levelAreas` está vacío, divide por 0 y genera `generalAverage = NaN`.

#### D. Conflación de Tabla Vacía con Error de Conexión en `supabaseService.ts`
En 14 funciones de consulta (`supabaseFetchSubjectAreas`, `supabaseFetchCompetencies`, `supabaseFetchIndicators`, `supabaseFetchEvaluations`, `supabaseFetchDidacticPlans`, `supabaseFetchPasses`, `supabaseFetchDailyAttendance`, `supabaseFetchConducts`, `supabaseFetchDocumentRequests`, `supabaseFetchAdminBlocks`, `supabaseFetchTitleRecords`, `supabaseFetchCommunityNotices`, `supabaseFetchNotifications`, `supabaseFetchUsers`):
```ts
// Ejemplo en línea 212:
if (error || !data || data.length === 0) return null;
```
Cuando la tabla en Supabase existe pero está vacía (`data = []`, `data.length === 0`), la función retorna `null` en lugar de `[]`.
En `src/context/AppContext.tsx:495-508`:
```ts
if (remoteStudents !== null) setStudents(remoteStudents); // remoteStudents retorna [] cuando está vacía
if (remoteEvaluations !== null) setEvaluations(remoteEvaluations); // remoteEvaluations retorna null cuando está vacía
```
**Efecto colateral**:
Si en Supabase se vacían los estudiantes y las evaluaciones, `students` se actualiza a `[]`, pero `evaluations` no se actualiza (porque `remoteEvaluations === null`), dejando registros de evaluación huérfanos que apuntan a estudiantes inexistentes.

#### E. Violación de Ciclo de Vida de React / TDZ en `AppContext.tsx`
- En `src/context/AppContext.tsx:442-540`, se declara la función `refreshFromSupabase` que invoca `setCompetencies`, `setIndicators`, `setPasses`, `setDailyAttendance`, `setConducts`, `setDocumentRequests`, `setAdminBlocks`, `setTitles`, `setCommunityNotices`, `setNotifications`.
- En la línea 543 se ejecuta en un `useEffect(() => { refreshFromSupabase(); }, [])`.
- Los hooks `useState` para estas variables están declarados **después** en las líneas 546 a 650.
- Esto dispara 13 advertencias críticas de Oxlint:
  `react(immutability): Cannot access variable while it is being initialized`.

#### F. Tipado Laxo `: any` y Castings Inseguros
Se identificaron 12 ocurrencias de `: any` explícito que vulneran la consistencia estricta de TypeScript:
1. `src/lib/supabaseClient.ts:79`: `catch (err: any)`
2. `src/App.tsx:164`: `handleQuickAction = (tab: any, subTab?: string) =>`
3. `src/components/ayuda/ManualDeUsoView.tsx:33`: `onNavigate?: (tab: any, subTab?: string) => void;`
4. `src/components/ayuda/AyudaModule.tsx:9`: `onNavigate?: (tab: any, subTab?: string) => void;`
5. `src/components/layout/CommandSearchModal.tsx:26`: `onNavigate: (tab: any, subTab?: string) => void;`
6. `src/components/layout/CommandSearchModal.tsx:84`: `icon: any;`
7. `src/components/layout/QuickActionDock.tsx:36`: `icon: any;`
8. `src/components/evaluation/DiagnosticView.tsx:77`: `handleScoreChange = (studentId: string, val: any) =>`
9. `src/components/evaluation/StatisticsChartsView.tsx:176, 214`: `formatter={(val: any) => ...}`
10. `src/components/evaluation/ProcesalGradebookView.tsx:89`: `handleCellChange = (studentId: string, indicatorId: string, value: any) =>`
11. `src/components/planning/PlanLapsoView.tsx:116`: `handleUpdateItem = (id: string, field: keyof LapsoEvaluationItem, val: any) =>`
12. `src/components/planning/DisenadorPlanificacionView.tsx:229`: `handleUpdateRow = (id: string, field: keyof DidacticPlanRow, value: any) =>`

---

## 2. Logic Chain (Cadena Lógica de Inferencia)

```
[1. tsconfig.app.json no define "strict": true ni "noUnusedLocals"]
      │
      ├──> [npm run build exit 0 es un "falso positivo de robustez": oculta 223 variables no utilizadas y tipos implícitos]
      │
[2. AppContext.tsx:953 excluye 'L' de ['C', 'EP', 'I']] + [supabase/schema.sql:142 omite 'L']
      │
      ├──> [Al registrar calificaciones de Inicial con Logrado (L), se pierde el dato o falla la DB con 23514 CHECK error]
      │
[3. ProcesalGradebookView.tsx:114 usa scoreQualitative para Primaria]
      │
      ├──> [Primaria queda contaminada con escala cualitativa L/EP/I en vez de la escala literal MPPE A-E exigida por R1]
      │
[4. BoletinInformativoView.tsx no valida activeStudent antes de leer propiedades]
      │
      ├──> [Con 0 estudiantes registrados en Supabase, el Boletín genera Uncaught TypeError y rompe la aplicación]
      │
[5. supabaseService.ts retorna null cuando data.length === 0]
      │
      ├──> [Tablas vacías se interpretan como "error de red", manteniendo mock data obsoleto y desalineando el estado global]
      │
[6. AppContext.tsx llama a refreshFromSupabase() antes de declarar useState para setters]
      │
      └──> [Provoca TDZ / advertencias de inmutabilidad en React Compiler y Oxlint]
```

---

## 3. Caveats (Advertencias y Supuestos)

1. **Compilación sintáctica vs. Rigor de tipos**: El código TypeScript compila actualmente sin errores con la configuración actual de `tsconfig.app.json`. Sin embargo, esto se debe a que las comprobaciones de variables no utilizadas están desactivadas y `strict: true` no está habilitado explícitamente en `tsconfig.app.json`.
2. **Separación de responsabilidades**: Este reporte diagnostica y audita las inconsistencias encontradas. Las correcciones deben ser implementadas por los agentes implementadores correspondientes (o en la fase de refactorización), asegurando no introducir regresiones en la interfaz visual.
3. **No caveats**: Todos los 64 archivos TS/TSX fueron analizados exhaustivamente.

---

## 4. Conclusion (Diagnóstico Final y Plan de Acción Priorizado)

La arquitectura actual de tipos y compilación se encuentra funcionalmente operativa a nivel básico (código de salida 0 en `npm run build`), pero posee **vulnerabilidades críticas de consistencia y manejo de errores** que comprometen los requerimientos institucionales R1, R2 y R3.

### Plan de Acción Priorizado

#### Prioridad 1 (Crítica — Bloquea Requerimientos R1 y R2)
1. **Unificar escala cualitativa CBA en todo el flujo**:
   - Modificar `supabase/schema.sql`: cambiar constraint a `CHECK (score_qualitative IN ('L', 'C', 'EP', 'I'))`.
   - En `src/context/AppContext.tsx:953`: cambiar `['C', 'EP', 'I']` por `['L', 'C', 'EP', 'I']`.
   - En `FinalLapsoView.tsx` y `BoletinInformativoView.tsx`: cambiar fallbacks `'C'` por `'L'`.
2. **Separar estrictamente la escala de Primaria (A-E) de Inicial (L-EP-I)**:
   - En `ProcesalGradebookView.tsx`: soportar selección y guardado de `scoreLiteral` para Primaria y `scoreQualitative` para Inicial.
   - En `DiagnosticView.tsx`: incorporar soporte para `scoreLiteral` en Primaria.
3. **Blindar BoletinInformativoView y Vistas ante 0 Estudiantes**:
   - En `BoletinInformativoView.tsx`: añadir guarda de estado vacío elegante (`if (!activeStudent || displayStudents.length === 0) return <EmptyStateView />`).
   - Evitar división por cero en `generalAverage` cuando `levelAreas.length === 0`.
4. **Distinguir entre Error de Red y Tabla Vacía en `supabaseService.ts`**:
   - Para las tablas de datos operativos (`evaluation_records`, `pass_records`, `daily_attendance`, `conduct_entries`, `document_requests`, `administrative_blocks`, `title_records`): cuando `!error && data`, retornar `data.map(...)` (que produce `[]` si `data.length === 0`), permitiendo que `AppContext` limpie correctamente el estado local cuando la base de datos está vacía.
5. **Reordenar declaraciones en `AppContext.tsx`**:
   - Mover todas las declaraciones `const [x, setX] = useState(...)` al inicio del hook/componente, antes de la definición de `refreshFromSupabase` y antes del primer `useEffect`.

#### Prioridad 2 (Importante — Limpieza Estricta y Tipado Seguro R3)
6. **Eliminar castings `: any`**:
   - Sustituir `tab: any` por `MainNavigationTab` en `App.tsx`, `ManualDeUsoView.tsx`, `AyudaModule.tsx`, `CommandSearchModal.tsx`.
   - Sustituir `icon: any` por `React.ComponentType<{ className?: string }>` en `CommandSearchModal.tsx` y `QuickActionDock.tsx`.
   - Tipar `val: any` en `DiagnosticView.tsx`, `ProcesalGradebookView.tsx`, `PlanLapsoView.tsx`, `DisenadorPlanificacionView.tsx`.
   - Cambiar `catch (err: any)` por `catch (err: unknown)` con extracción segura de mensaje en `supabaseClient.ts`.
7. **Sincronización de `plans_lapso` y `strategies` en `supabaseService.ts`**:
   - Implementar funciones CRUD para `plans_lapso` y `strategies` alineadas con `supabase/schema.sql`.

#### Prioridad 3 (Optimización y Calidad de Código)
8. **Limpieza de 223 imports y variables no utilizadas**:
   - Limpiar imports sobrantes detectados por Oxlint.
   - Habilitar `"strict": true` en `tsconfig.app.json` una vez limpia la base de código.

---

## 5. Verification Method (Método de Verificación Independiente)

Para verificar independientemente el estado actual y comprobar las correcciones posteriores:

1. **Verificación de Compilación y Build**:
   ```powershell
   npm run build
   ```
   *Criterio de éxito*: Código de salida 0, sin errores de TypeScript.

2. **Verificación de Inexistencia de Dependencias Circulares**:
   ```powershell
   npx madge --circular --extensions ts,tsx src
   ```
   *Criterio de éxito*: `√ No circular dependency found!`.

3. **Verificación de Rigor de TypeScript sin Imports Muertos**:
   ```powershell
   npx tsc -p tsconfig.app.json --strict --noEmit
   ```
   *Criterio de éxito*: Código de salida 0.

4. **Verificación de Linter**:
   ```powershell
   npm run lint
   ```
   *Criterio de éxito*: Cero errores, minimización o eliminación de advertencias.

5. **Prueba de Resistencia con Base de Datos Vacía (Runtime Test)**:
   - Configurar `AppContext` simulando 0 estudiantes (`students: []`, `evaluations: []`).
   - Navegar hacia `Consultas -> Boletín`, `Evaluación -> Diagnóstica`, `Evaluación -> Procesal`.
   - *Criterio de éxito*: Se muestran estados vacíos informativos sin excepciones `TypeError: Cannot read properties of undefined` en la consola del navegador.
