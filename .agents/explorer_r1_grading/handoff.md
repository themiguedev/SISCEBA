# Auditoría de Calificaciones y Separación por Subsistemas (Requisito R1)
**Colegio Bellas Artes (SICE-CBA)**  
**Investigador**: Grading Logic & Subsystems Explorer (`explorer_r1_grading`)  
**Fecha**: 2026-09-22  
**Estado**: Hard Handoff (Auditoría completa)

---

## Executive Summary

Se ha realizado una auditoría exhaustiva de extremo a extremo sobre la lógica de calificaciones, la separación pedagógica por subsistemas (`INICIAL`, `PRIMARIA`, `MEDIA_GENERAL`) y la emisión de reportes y boletines en todo el repositorio institucional SICE-CBA.

### Hallazgos Principales:
1. **Educación Inicial (Formativa/Cualitativa)**:
   - Presenta múltiples **fugas numéricas y promedios decimales ocultos**: en `BoletinInformativoView.tsx`, el cálculo de promedio vigesimal se ejecuta incondicionalmente para todos los niveles (`generalAverage` sobre 20 ptos); además, el mock de notas retorna `scoreNumeric: 18` o `19` indistintamente. Si el selector de nivel no coincide con el alumno, se imprimen notas sobre 20 para preescolar.
   - En `FinalLapsoView.tsx`, la función de consolidación ejecuta `parseFloat()` sobre las notas de Inicial ('L', 'EP', 'I'), convirtiéndolas en `NaN` y sustituyéndolas por un valor numérico por defecto de `14` para promediar.
   - En `StatisticsChartsView.tsx`, las tarjetas KPI muestran `"Nivel Alto (A/B)"` en Inicial, filtrando terminología de Primaria.
   - En `AcademicPulseHero.tsx`, la tarjeta de telemetría muestra `"96% Consolidación"`, empleando terminología obsoleta.
2. **Educación Primaria (Escala Literal MPPE A, B, C, D, E)**:
   - **Grave omisión pedagógica**: Primaria fue agrupada arbitrariamente bajo `currentLevel !== 'MEDIA_GENERAL'`, forzándola a registrarse en `ProcesalGradebookView.tsx` y `DiagnosticView.tsx` como escala cualitativa `'L' | 'EP' | 'I'`, guardando en el campo `scoreQualitative`.
   - El campo oficial `scoreLiteral` (`A`, `B`, `C`, `D`, `E`) **nunca es poblado ni persistido** en los registros procesales ni diagnósticos.
   - En `BoletinInformativoView.tsx`, Primaria carece de soporte para literales: renderiza como si fuese Inicial ("Logrado (L)", "En Proceso (EP)").
   - En `seedData.ts`, **no existe un solo registro de evaluación de prueba para Primaria**, lo que obligó a `ConsultasModule.tsx` a hardcodear mocks estáticos.
3. **Inconsistencias y Bugs en el Estado Global (`AppContext.tsx`)**:
   - En `adjustStudentGrade` (`AppContext.tsx:953`), la validación cualitativa comprueba `['C', 'EP', 'I'].includes(newScore)`. Si un ajuste de Consejo introduce `'L'` (Logrado), la comprobación falla y la nota se guarda como `undefined`.
   - `adjustStudentGrade` no soporta la escala literal de Primaria (`scoreLiteral` ni siquiera se asigna).
4. **Arquitectura de Boletines**:
   - Actualmente existe una única vista monolítica `BoletinInformativoView.tsx`. Carece de componentes especializados por subsistema (`BoletinInicial`, `BoletinPrimaria`, `BoletinMediaGeneral`), lo que propicia el cruce indebido de métricas y layouts.

---

## 1. Observation

A continuación se detallan las observaciones directas, rutas de archivo exactas, números de línea y citas textuales recopiladas durante la inspección del código fuente.

### 1.1 Inventario de Archivos y Componentes Auditados

| Módulo / Archivo | Ruta Relativa | Propósito Funcional |
|---|---|---|
| **Definiciones de Tipos** | `src/types/index.ts` | Modelos de datos (`EvaluationRecord`, `QualitativeScore`, `LiteralScore`, `EducationalLevel`). |
| **Contexto y Acciones** | `src/context/AppContext.tsx` | Acciones `recordEvaluation`, `bulkRecordEvaluations`, `adjustStudentGrade`, `generateAIActionPlan`. |
| **Persistencia Supabase** | `src/services/supabaseService.ts` | Mapeo y serialización de tablas `evaluation_records`. |
| **Datos Iniciales / Semilla** | `src/data/seedData.ts` | Registros `INITIAL_EVALUATION_RECORDS`, `INITIAL_STUDENTS`, `INITIAL_AREAS`. |
| **Registro Procesal** | `src/components/evaluation/ProcesalGradebookView.tsx` | Cuaderno digital de seguimiento continuo e indicadores de logro. |
| **Diagnóstica** | `src/components/evaluation/DiagnosticView.tsx` | Diagnóstico de entrada y módulo de robótica inicial. |
| **Matriz Final** | `src/components/evaluation/FinalLapsoView.tsx` | Sábana de consolidación de fin de lapso y cierre pedagógico. |
| **Estadísticas** | `src/components/evaluation/StatisticsChartsView.tsx` | Cuadros estadísticos consolidados y distribución de notas. |
| **Módulo de Consultas** | `src/components/consultas/ConsultasModule.tsx` | Sábana de notas consolidada por alumno, portal de representantes y estudiantes. |
| **Boletín Informativo** | `src/components/communication/BoletinInformativoView.tsx` | Emisión y previsualización impresa del boletín de notas institucional. |
| **Actas de Consejo** | `src/components/communication/ActasConsejoView.tsx` | Deliberación colegiada y ajuste oficial de calificaciones e indicadores. |
| **Reportes Institucionales** | `src/components/communication/InstitutionalReportsView.tsx` | Emisión de reportes diagnósticos, procesales, de fin de año y cuadros oficiales. |
| **Hero y Telemetría** | `src/components/layout/AcademicPulseHero.tsx` | Tarjetas de resumen institucional y escalas por subsistema. |

---

### 1.2 Auditoría: Educación Inicial (Preescolar - Salas de 3, 4 y 5 Años)

#### Observación 1.2.1: Infiltración de Promedios Vigesimales en el Boletín
En `src/components/communication/BoletinInformativoView.tsx`, líneas 89-91:
```typescript
89: // Compute general average for Media General
90: const studentScores = levelAreas.map(a => getAreaEvaluation(a.id).scoreNumeric || 15);
91: const generalAverage = Math.round((studentScores.reduce((a, b) => a + b, 0) / studentScores.length) * 10) / 10;
```
**Impacto**: `generalAverage` se calcula de forma incondicional aunque el estudiante activo pertenezca a Educación Inicial. En líneas 80-82, el mock de notas asigna números (18 o 19) a cualquier estudiante:
```typescript
80: return {
81:   scoreNumeric: isChacin ? (areaId.includes('mat') ? 8 : 12) : isCamila ? 19 : 18,
82:   scoreQualitative: (isChacin ? 'EP' : 'C') as 'EP' | 'C',
```
Si el estado global `currentLevel` se encuentra en `MEDIA_GENERAL` (por ejemplo, si el usuario navega entre pestañas), la tabla del boletín evalúa `currentLevel === 'MEDIA_GENERAL'` (línea 196 y 220) y muestra la nota cuantitativa `18 / 20` para un infante de 4 años, violando el criterio de aceptación.

#### Observación 1.2.2: Infiltración Numérica en Matriz Final de Lapso
En `src/components/evaluation/FinalLapsoView.tsx`, líneas 157-158:
```typescript
157: const scoresList = areasToShow.map(a => parseFloat(getStudentAreaScore(stu.id, a.id)));
158: const avg = Math.round((scoresList.reduce((a, b) => a + (isNaN(b) ? 14 : b), 0) / scoresList.length) * 10) / 10;
159: const isUnderperforming = currentLevel === 'MEDIA_GENERAL' && avg < 10;
```
**Impacto**: Al procesar estudiantes de Inicial, `getStudentAreaScore` retorna `'L'` o `'EP'`. `parseFloat('L')` resulta en `NaN`. El operador ternario `isNaN(b) ? 14 : b` inyecta artificialmente la nota numérica `14`, calculando un promedio decimal sobre 20 puntos en memoria.

#### Observación 1.2.3: Términos Cualitativos No Unificados y Obsoletos
- En `src/types/index.ts`, línea 152:
  ```typescript
  export type QualitativeScore = 'L' | 'C' | 'EP' | 'I'; // Logrado (L), Consolidado (C - compatibilidad), En Proceso (EP), Iniciado (I)
  ```
- En `src/components/evaluation/FinalLapsoView.tsx`, líneas 37 y 47:
  ```typescript
  37: : finalRec.scoreQualitative || 'C';
  47: : procesalRec.scoreQualitative || 'C';
  ```
  Se utiliza `'C'` (Consolidado) como fallback por defecto en lugar de `'L'` (Logrado).
- En `src/components/communication/BoletinInformativoView.tsx`, línea 82:
  ```typescript
  scoreQualitative: (isChacin ? 'EP' : 'C') as 'EP' | 'C',
  ```
- En `src/components/layout/AcademicPulseHero.tsx`, línea 134:
  ```typescript
  134: {currentLevel === 'MEDIA_GENERAL' ? '/ 20 Promedio' : 'Consolidación'}
  ```
  El término utilizado es `"Consolidación"` en lugar del término oficial CBA `"Logrado (L)"`.
- En `src/context/AppContext.tsx`, línea 953:
  ```typescript
  953: scoreQualitative: (['C', 'EP', 'I'].includes(newScore) ? newScore : undefined) as QualitativeScore,
  ```
  **Error crítico de TypeScript/Lógica**: La lista de inclusión contiene `['C', 'EP', 'I']` pero omite `'L'`. Si un usuario o directivo intenta asentar `'L'` en el Consejo de Curso, se almacena como `undefined`.

---

### 1.3 Auditoría: Educación Primaria (1° a 6° Grado - Escala Literal MPPE A, B, C, D, E)

#### Observación 1.3.1: Ausencia de Escala Literal en el Cuaderno Procesal
En `src/components/evaluation/ProcesalGradebookView.tsx`, líneas 113-114 y 360-371:
```typescript
113: scoreNumeric: currentLevel === 'MEDIA_GENERAL' ? Number(val) : undefined,
114: scoreQualitative: currentLevel !== 'MEDIA_GENERAL' ? (val as QualitativeScore) : undefined,
```
Y en la interfaz de usuario:
```tsx
360: ) : (
361:   <select
362:     value={val || 'L'}
363:     onChange={(e) => handleCellChange(stu.id, ind.id, e.target.value)}
364:     aria-label={`Valoración cualitativa de ${stu.fullName} en ${ind.code}`}
365:     className="p-1 text-xs font-black rounded-lg bg-slate-50 border border-slate-200 text-[#2C2E53]"
366:   >
367:     <option value="L">L (Logrado)</option>
368:     <option value="EP">EP (En Proceso)</option>
369:     <option value="I">I (Iniciado)</option>
370:   </select>
371: )}
```
**Impacto**: Primaria es tratada de forma idéntica a Inicial. Un docente de 5to Grado no puede calificar con la escala ministerial MPPE (A, B, C, D, E). El campo `scoreLiteral` de `EvaluationRecord` nunca se graba.

#### Observación 1.3.2: Fusión Artificial de Escalas en Evaluación Diagnóstica
En `src/components/evaluation/DiagnosticView.tsx`, líneas 333-350:
```tsx
333: {/* Primaria: Qualitative */}
334: {currentLevel === 'PRIMARIA' && (
335:   <td className="py-3 px-3 text-center">
336:     <select
337:       value={rowData.qualitative || 'L'}
338:       onChange={(e) =>
339:         handleScoreChange(stu.id, { qualitative: e.target.value as QualitativeScore })
340:       }
341:       aria-label={`Valoración cualitativa para ${stu.fullName}`}
342:       className="p-1.5 bg-slate-50 rounded border border-slate-200 text-xs font-black text-[#2C2E53]"
343:     >
344:       <option value="L">Logrado (L / A)</option>
345:       <option value="EP">En Proceso (EP / B)</option>
346:       <option value="I">Iniciado (I / C-D)</option>
347:     </select>
348:   </td>
349: )}
```
**Impacto**: Se inventó una escala híbrida inexistente en la normativa venezolana (`"Logrado (L / A)"`, `"En Proceso (EP / B)"`, `"Iniciado (I / C-D)"`), agrupando literales y guardando en `qualitative`, omitiendo las opciones normativas `A`, `B`, `C`, `D`, `E`.

#### Observación 1.3.3: Inexistencia de Datos Semilla para Primaria
En `src/data/seedData.ts`, líneas 1135-1221 (`INITIAL_EVALUATION_RECORDS`):
- Se encontraron registros para Inicial (`eval-ini-1`, `eval-ini-2`).
- Se encontraron registros para Media General (`eval-med-1` a `eval-med-4`).
- **Cero registros** para los alumnos de Primaria (`stu-pri-1`, `stu-pri-2`, `stu-pri-3`).

---

### 1.4 Auditoría: Educación Media General (1° a 5° Año - Escala Vigesimal 01 a 20)

#### Observación 1.4.1: Tratamiento de Calificaciones y Promedios
- En `ProcesalGradebookView.tsx`, la escala cuantitativa opera con `min={1}` y `max={20}`. La función `computeStudentAverage` calcula el promedio aritmético por indicador.
- En `ConsultasModule.tsx` (Sábana de Rendimiento), la sección Media General formatea correctamente las calificaciones numéricas y calcula el promedio del lapso con dos decimales (`avg`).
- En `ActasConsejoView.tsx`, los ajustes numéricos (ej. anterior `08`, ajustada `12`) se reflejan apropiadamente.
- **Oportunidad de Mejora Observada**: En `ProcesalGradebookView.tsx`, cada indicador posee un atributo opcional `weight?: number` (ej. 20%), pero `computeStudentAverage` realiza un promedio aritmético simple en vez de una suma producto ponderada cuando los indicadores tienen pesos configurados.

---

### 1.5 Auditoría de Mapeo y Persistencia en Supabase

En `src/services/supabaseService.ts`:
- Las tablas en Supabase ya contemplan los campos correctos:
  - `score_numeric` (para Media General)
  - `score_qualitative` (para Inicial)
  - `score_literal` (para Primaria)
  - `robotics_score` (para Robótica Inicial)
- Líneas 221-224 (`supabaseFetchEvaluations`):
  ```typescript
  221: scoreNumeric: row.score_numeric !== null ? Number(row.score_numeric) : undefined,
  222: scoreQualitative: row.score_qualitative,
  223: scoreLiteral: row.score_literal,
  224: roboticsScore: row.robotics_score,
  ```
- Líneas 245-248 y 270-273 (`supabaseSaveEvaluation` y `supabaseBulkSaveEvaluations`):
  ```typescript
  score_numeric: rec.scoreNumeric ?? null,
  score_qualitative: rec.scoreQualitative ?? null,
  score_literal: rec.scoreLiteral ?? null,
  robotics_score: rec.roboticsScore ? rec.roboticsScore : null,
  ```
**Conclusión de Persistencia**: La infraestructura de Supabase está perfectamente lista para almacenar `score_literal` y `score_qualitative`. La falla reside enteramente en que los formularios de captura del frontend no enviaban `scoreLiteral`.

---

## 2. Logic Chain

A partir de las observaciones directas, se deduce el siguiente encadenamiento lógico de causas y efectos:

```
[Observación 1.3.1 y 1.3.2]
Los componentes de captura (Procesal y Diagnóstica) condicionan la UI con:
  currentLevel === 'MEDIA_GENERAL' ? InputNumérico : SelectCualitativo
           │
           ▼
[Deducción 1]
Educación Primaria fue erróneamente colapsada en la rama "no Media General".
Como resultado, los docentes de Primaria solo pueden seleccionar L, EP, I.
El campo `scoreLiteral` queda huérfano y jamás se almacena en el estado ni en Supabase.
           │
           ▼
[Observación 1.3.3 y 1.1]
En seedData.ts no se crearon registros de prueba con `scoreLiteral`.
El boletín monolítico (BoletinInformativoView.tsx) replica la misma bifurcación binaria.
           │
           ▼
[Deducción 2]
El Boletín Informativo no sabe renderizar las calificaciones de Primaria en escala A-E.
En su lugar, muestra "Logrado (L)" o notas simuladas de 18 ptos.
           │
           ▼
[Observación 1.2.1 y 1.2.2]
BoletinInformativoView y FinalLapsoView ejecutan reducciones numéricas
(studentScores.reduce(...) y parseFloat(score)) de manera incondicional.
           │
           ▼
[Deducción 3]
Ocurren "fugas numéricas" en Inicial: se computan notas sobre 20 en la memoria
del navegador para alumnos de preescolar, arrojando promedios falsos de 14 o 18 ptos.
           │
           ▼
[Observación 1.2.3]
AppContext.tsx:953 excluye 'L' en su array de validación:
  (['C', 'EP', 'I'].includes(newScore))
           │
           ▼
[Deducción 4]
Cualquier intento legítimo de asentar 'Logrado (L)' en un Consejo de Curso o ajuste
convierte la nota cualitativa en `undefined`, corrompiendo el registro de evaluación.
```

---

## 3. Caveats

1. **Persistencia en Supabase Local / Remota**: Si en la base de datos Supabase ya existen registros históricos que utilizaron la letra `'C'` por compatibilidad antigua, la capa de lectura debe transformar automáticamente cualquier `'C'` existente en `'L'` ("Logrado") al cargar para garantizar la consistencia sin provocar excepciones en tiempo de ejecución.
2. **Impresión Directa**: El sistema no utiliza bibliotecas binarias como `jspdf` o `pdfmake`. La generación de reportes y boletines depende al 100% de los estilos CSS de impresión (`@media print` y utilidades `print:` de Tailwind) a través de `window.print()`. Los nuevos componentes de boletín deben conservar rigurosamente este comportamiento sin añadir dependencias pesadas.
3. **No se investigaron módulos ajenos a evaluación**: Módulos de facturación administrativa o biblioteca no fueron parte del alcance del Requisito R1.

---

## 4. Conclusion & Concrete Refactoring Roadmap

### Conclusión General
El sistema SICE-CBA cuenta con una estructura de base de datos y tipado en Supabase bien diseñada, pero adolece de una **bifurcación binaria defectuosa en el frontend** (`MEDIA_GENERAL` vs. `TODOS LOS DEMÁS`) que marginó a Educación Primaria (privándola de la escala oficial A-E) y propició fugas de cálculos numéricos en Educación Inicial. Asimismo, la unificación terminológica a **Logrado (L)** no se completó en las funciones auxiliares de `AppContext.tsx`, `FinalLapsoView.tsx` y `BoletinInformativoView.tsx`.

### Hoja de Ruta Concreta para el Agente Implementador

#### Fase 1: Blindaje de Tipos y Estado Global (`src/types/index.ts` y `src/context/AppContext.tsx`)
1. En `src/types/index.ts`:
   - Redefinir `QualitativeScore`:
     ```typescript
     export type QualitativeScore = 'L' | 'EP' | 'I'; // Logrado (L), En Proceso (EP), Iniciado (I)
     ```
   - Definir descripciones oficiales para la escala MPPE de Primaria:
     ```typescript
     export type LiteralScore = 'A' | 'B' | 'C' | 'D' | 'E';
     export const LITERAL_DESCRIPTIONS: Record<LiteralScore, { title: string; desc: string }> = {
       A: { title: 'Excelente', desc: 'Alcanzó todas las competencias y superó las expectativas del grado.' },
       B: { title: 'Bueno', desc: 'Alcanzó todas las competencias previstas para el grado.' },
       C: { title: 'Aceptable', desc: 'Alcanzó la mayoría de las competencias previstas para el grado.' },
       D: { title: 'Requiere Acompañamiento', desc: 'Alcanzó algunas competencias y requiere refuerzo pedagógico.' },
       E: { title: 'No Consolidado', desc: 'No logró adquirir las competencias mínimas requeridas.' }
     };
     ```
2. En `src/context/AppContext.tsx`:
   - Corregir `adjustStudentGrade`:
     - Incorporar `'L'` en el filtro cualitativo: `['L', 'EP', 'I'].includes(newScore)`.
     - Detectar y almacenar `scoreLiteral` si el nivel del estudiante es `PRIMARIA` y `newScore` es `A`, `B`, `C`, `D` o `E`.
     - Impedir de forma estricta que se asigne `scoreNumeric` cuando el estudiante pertenezca a `INICIAL` o `PRIMARIA`.

#### Fase 2: Refactorización de Captura Procesal y Diagnóstica
1. En `src/components/evaluation/ProcesalGradebookView.tsx`:
   - Implementar un switch tripartito por subsistema en las celdas de la tabla:
     - Si `currentLevel === 'MEDIA_GENERAL'`: `input` tipo número (01 a 20).
     - Si `currentLevel === 'PRIMARIA'`: `select` con opciones normativas: `A`, `B`, `C`, `D`, `E`.
     - Si `currentLevel === 'INICIAL'`: `select` con opciones unificadas: `Logrado (L)`, `En Proceso (EP)`, `Iniciado (I)`.
   - En `handleSaveAll`:
     - Guardar `scoreLiteral` si es Primaria.
     - Guardar `scoreQualitative` si es Inicial.
     - Guardar `scoreNumeric` exclusivamente si es Media General.
   - En `computeStudentAverage`:
     - Implementar ponderación real si los indicadores poseen `weight` porcentual.
2. En `src/components/evaluation/DiagnosticView.tsx`:
   - Separar limpiamente la columna de Primaria: reemplazar el selector híbrido `L / A` por un selector exclusivo con literales `A`, `B`, `C`, `D`, `E` que guarde en `scoreLiteral`.
   - Inicial: mantener el módulo de robótica y asegurar que solo guarde en `scoreQualitative` y `roboticsScore`.

#### Fase 3: Separación Modular de Boletines Informativos
Crear una estructura modular bajo `src/components/communication/boletines/`:
1. `BoletinInicial.tsx`:
   - Enfoque 100% formativo y descriptivo.
   - Escala oficial CBA: Logrado (L), En Proceso (EP), Iniciado (I).
   - Dimensiones del desarrollo infantil: Formación Personal y Social, Relación con los Componentes del Ambiente, Comunicación y Representación, y Habilidades de Robótica Lúdica.
   - **Cero notas numéricas**, cero promedios sobre 20.
2. `BoletinPrimaria.tsx`:
   - Escala literal ministerial MPPE: A, B, C, D, E.
   - Indicación del literal obtenido por cada área de formación con su apreciación descriptiva.
   - Síntesis cualitativa del lapso con el significado pedagógico del literal MPPE.
   - **Cero notas vigesimales**.
3. `BoletinMediaGeneral.tsx`:
   - Escala vigesimal cuantitativa de 01 a 20 puntos con padding de dos dígitos ("08", "15", "20").
   - Ponderación porcentual por evaluaciones/indicadores y cálculo exacto del promedio de lapso.
   - Estatus de aprobación (Aprobado >= 10 ptos / Riesgo / Materia Pendiente < 10 ptos).
4. `BoletinInformativoView.tsx` (Router Central):
   - Actúa como despachador inteligente inspeccionando `activeStudent.level` (o `currentLevel` como fallback), montando el componente correspondiente (`BoletinInicial`, `BoletinPrimaria` o `BoletinMediaGeneral`).

#### Fase 4: Limpieza de Matriz Final, Consultas y Estadísticas
1. En `src/components/evaluation/FinalLapsoView.tsx`:
   - Aislar el cálculo de `avg` únicamente dentro de la condición `currentLevel === 'MEDIA_GENERAL'`.
   - Eliminar el fallback `|| 'C'` y reemplazarlo por `|| 'L'`.
   - Leer `scoreLiteral` cuando `currentLevel === 'PRIMARIA'`.
2. En `src/components/consultas/ConsultasModule.tsx`:
   - Corregir el texto de la tarjeta KPI de Estadísticas (línea 789): cambiar `"Media General y Primaria"` por `"Educación Media General"`.
   - Enriquecer la sección de Primaria para leer dinámicamente los registros de `scoreLiteral`.
3. En `src/components/evaluation/StatisticsChartsView.tsx`:
   - Añadir soporte para Primaria en el gráfico de torta (`Distribución Proporcional de Calificaciones`) con las categorías:
     - `Literal A (Sobresaliente)`
     - `Literal B (Muy Bueno)`
     - `Literal C (Bueno)`
     - `Literal D / E (Acompañamiento Requerido)`
   - En la tarjeta KPI (línea 124), diferenciar según el nivel:
     - Media General: `16.4 / 20`
     - Primaria: `Literal A / B`
     - Inicial: `Logrado (L)`

#### Fase 5: Actualización de Semillas (`src/data/seedData.ts`)
- Agregar registros en `INITIAL_EVALUATION_RECORDS` para los tres estudiantes de Primaria (`stu-pri-1`, `stu-pri-2`, `stu-pri-3`) en las áreas `pri-len`, `pri-mat`, `pri-cn`, `pri-cs` con `scoreLiteral: 'A'` y `scoreLiteral: 'B'`.
- Garantizar que los registros de Inicial contengan únicamente `scoreQualitative: 'L'` o `'EP'`, sin campos numéricos residuales.

---

## 5. Verification Method

Para verificar de manera independiente las conclusiones de esta auditoría y comprobar las futuras correcciones del implementador:

### 1. Verificación Estática y de Compilación
Ejecutar en la raíz del proyecto:
```powershell
npm run build
```
- **Condición de éxito**: Salida de código 0 (`tsc -b && vite build`) con cero errores de TypeScript.

### 2. Verificación de Aislamiento de Inicial (Cero Fugas Numéricas)
1. Abrir la aplicación y seleccionar el subsistema **Educación Inicial** (`INICIAL`).
2. Navegar a **Evaluación Continua > Final de Lapso**.
   - Inspeccionar el DOM: Verificar que no exista ninguna celda, encabezado ni badge con formato `/ 20` ni promedios decimales.
3. Navegar a **Comunicación y Reportes > Boletín Informativo**.
   - Seleccionar un alumno de Inicial (ej. Sofía Morales o Lucas Villalobos).
   - Verificar que no se visualice ninguna calificación numérica ni caja de "Promedio Ponderado / 20".
   - Pulsar "Imprimir Boletín" y comprobar que la vista de impresión presente exclusivamente valoraciones formativas: `Logrado (L)`, `En Proceso (EP)` o `Iniciado (I)`.

### 3. Verificación de Educación Primaria (Escala Literal MPPE)
1. Seleccionar el subsistema **Educación Primaria** (`PRIMARIA`).
2. Navegar a **Evaluación Continua > Evaluación Procesal (Cuaderno)**.
   - Verificar que los selectores de calificación ofrezcan exclusivamente las opciones `A`, `B`, `C`, `D`, `E`.
   - Modificar una nota, guardar borrador e inspeccionar en la consola o estado que el objeto guardado posea `scoreLiteral: "A"|"B"|"C"|"D"|"E"` y `scoreNumeric === undefined`.
3. Navegar a **Comunicación y Reportes > Boletín Informativo**.
   - Comprobar que la tabla muestre la columna de Literales MPPE y su apreciación cualitativa oficial.

### 4. Verificación de Educación Media General (Escala Vigesimal 01-20)
1. Seleccionar el subsistema **Educación Media General** (`MEDIA_GENERAL`).
2. Comprobar que las notas se muestren en escala vigesimal (01 a 20) con cálculo correcto de promedios ponderados.
3. Comprobar que estudiantes con nota inferior a 10 activen la alerta de Consejo de Curso y generador de Plan de Acción IA.

### Condiciones de Invalidación del Reporte
- Si se descubre que el Ministerio del Poder Popular para la Educación (MPPE) emitió una resolución que autorice notas numéricas en preescolar (lo cual no existe en la legislación venezolana vigente).
- Si la dirección institucional CBA exigiese notas vigesimales en Primaria (contradiciendo el mandato expreso del requerimiento R1 y el manual de uso del plantel).
