# Reporte de Auditoría y Desafío Técnico Adversarial — Milestone 1
**Colegio Bellas Artes (SICE-CBA)**  
**Agente**: Challenger 1 (`challenger_m1_1`)  
**Rol**: critic / specialist (Empirical Challenger)  
**Fecha**: 2026-09-22  
**Veredicto**: **REQUEST_CHANGES**  

---

## 1. Observation

### 1.1 Verificación de Compilación y Análisis Estático
- **Comando**: `npm run build` (`tsc -b && vite build`)
  - **Resultado**: Código de salida `0`
  - **Tiempo**: `962ms`
  - **Módulos**: `2542 modules transformed`
  - **Errores de TypeScript**: `0`
  - **Salida**:
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
    dist/assets/index-DKs3H99e.js   1,545.89 kB │ gzip: 383.06 kB
    ✓ built in 962ms
    ```

- **Comando**: `npx madge --circular --extensions ts,tsx src/`
  - **Resultado**: `Processed 62 files (774ms). No circular dependency found!`

- **Comando**: `npm run lint` (`oxlint`)
  - **Resultado**: `0 errors, 261 warnings` (advertencias correspondientes al compilador de React en `AppContext.tsx`, programadas para Milestone 2).

### 1.2 Verificación de Contratos de Tipos en `src/types/index.ts`
- Línea 152: `export type QualitativeScore = 'L' | 'EP' | 'I';`
- Línea 153: `export type LiteralScore = 'A' | 'B' | 'C' | 'D' | 'E';`
- Líneas 155-161: `LITERAL_DESCRIPTIONS` exporta correctamente los 5 literales (`A`, `B`, `C`, `D`, `E`).
- Líneas 163-167: `RoboticsSpecialEvaluation` exporta `logicSkills`, `constructionSkills`, `teamwork` con tipo `QualitativeScore`.
- Líneas 169-183: `EvaluationRecord` integra `scoreNumeric?: number`, `scoreQualitative?: QualitativeScore`, `scoreLiteral?: LiteralScore`, `roboticsScore?: RoboticsSpecialEvaluation`.

### 1.3 Verificación de las 14 Funciones de Consulta en `src/services/supabaseService.ts`
- Se verificó mediante búsqueda estricta (`grep`) que la cláusula `|| data.length === 0` fue erradicada de las 14 funciones de consulta:
  1. `supabaseFetchStudents` (línea 36)
  2. `supabaseFetchSubjectAreas` (línea 101)
  3. `supabaseFetchCompetencies` (línea 130)
  4. `supabaseFetchIndicators` (línea 172)
  5. `supabaseFetchEvaluations` (línea 221)
  6. `supabaseFetchDidacticPlans` (línea 305)
  7. `supabaseFetchPasses` (línea 401)
  8. `supabaseFetchDailyAttendance` (línea 462)
  9. `supabaseFetchConducts` (línea 509)
  10. `supabaseFetchDocumentRequests` (línea 560)
  11. `supabaseFetchAdminBlocks` (línea 613)
  12. `supabaseFetchTitleRecords` (línea 664)
  13. `supabaseFetchCommunityNotices` (línea 717)
  14. `supabaseFetchNotifications` (línea 767)
  15. `supabaseFetchUsers` (línea 824)
- Todas ellas devuelven `data.map(...)` cuando `!error && data`. Si `data` es `[]` (tabla vacía), retornan `[]` en vez de `null`.
- Todas implementan bloques `try { ... } catch (e) { ... return null; }` retornando `null` únicamente ante errores de red o excepciones.

### 1.4 Verificación de Consumidores de `QualitativeScore`
- `src/components/consultas/ConsultasModule.tsx`: Líneas 106-110 manejan limpiamente `qual === 'L'`, `qual === 'EP'`, `qual === 'I'`. Las referencias obsoletas a `'C'` fueron removidas.
- `src/components/evaluation/DiagnosticView.tsx`: Líneas 323 y 327 eliminaron referencias muertas a `'C'`. Opciones en `<select>` de Inicial y Primaria usan `'L'`, `'EP'`, `'I'`.
- `src/components/evaluation/ProcesalGradebookView.tsx`: Líneas 367-370 presentan opciones `'L'`, `'EP'`, `'I'`.
- `src/data/seedData.ts`: Líneas 1182, 1199 presentan `scoreQualitative: 'L'` y `'EP'`.

### 1.5 Vulnerabilidad Empírica Hallada: BUG-M1-01
- **Archivo**: `supabase/schema.sql` (línea 142)
  ```sql
  score_qualitative CHAR(2) CHECK (score_qualitative IN ('L', 'C', 'EP', 'I')),
  ```
- **Archivo**: `src/services/supabaseService.ts` (línea 234)
  ```typescript
  scoreQualitative: row.score_qualitative === 'C' ? 'L' : row.score_qualitative,
  ```
- **Comportamiento en PostgreSQL y PostgREST**:
  En PostgreSQL, el tipo `CHAR(2)` aplica *blank-padding* (relleno con espacios en blanco) a cualquier valor de 1 carácter. Por ende:
  - `'L'` se almacena y serializa como `"L "` (longitud 2).
  - `'C'` se almacena y serializa como `"C "` (longitud 2).
  - `'I'` se almacena y serializa como `"I "` (longitud 2).
- **Prueba Empírica en Node.js**:
  ```powershell
  node -e "const row1 = { score_qualitative: 'C ' }; console.log(row1.score_qualitative === 'C' ? 'L' : row1.score_qualitative);"
  # Salida: "C " (No convierte 'C' en 'L' porque 'C ' !== 'C')

  node -e "const row2 = { score_qualitative: 'L ' }; console.log(row2.score_qualitative === 'L');"
  # Salida: false (Las comparaciones 'L ' === 'L' fallan en todos los componentes visuales)
  ```
- **Falla derivada de tipado nulo**:
  Si `row.score_qualitative` es `null`, la expresión `row.score_qualitative === 'C' ? 'L' : row.score_qualitative` retorna `null` en lugar de `undefined`, violando la convención de `EvaluationRecord.scoreQualitative?: QualitativeScore` y a diferencia de `scoreNumeric` (que sí realiza `row.score_numeric !== null ? Number(row.score_numeric) : undefined`).

---

## 2. Logic Chain

1. **Premisa**: El Requerimiento R1 y R2 exigen sincronización fiable con Supabase y consistencia estricta en el tratamiento de calificaciones cualitativas (`'L' | 'EP' | 'I'`).
2. **Observación A**: En `supabase/schema.sql:142`, la columna `score_qualitative` está definida como `CHAR(2)`. Todas las demás columnas de texto del esquema utilizan `VARCHAR(...)`.
3. **Observación B**: En el estándar SQL de PostgreSQL, los campos de tipo `CHAR(n)` rellenan siempre los caracteres restantes con espacios (`'L '`, `'I '`, `'C '`).
4. **Observación C**: Cuando Supabase PostgREST entrega filas en formato JSON, respeta el padding del tipo de datos PostgreSQL. Por ende, la propiedad `row.score_qualitative` llega al cliente como `"L "` o `"I "` o `"C "`.
5. **Observación D**: En `src/services/supabaseService.ts:234`, el mapeo actual es:
   `scoreQualitative: row.score_qualitative === 'C' ? 'L' : row.score_qualitative,`
6. **Inferencia 1**: Ante un registro histórico `'C'`, `"C " === 'C'` evalúa a `false`, por lo que el registro se conserva como `"C "` y no se normaliza a `'L'`.
7. **Inferencia 2**: Ante un registro con `'L'`, llega al cliente como `"L "`. En `ConsultasModule.tsx` (`qual === 'L'`), `DiagnosticView.tsx` (`rowData.qualitative === 'L'`) y `ProcesalGradebookView.tsx`, la comparación `"L " === 'L'` evalúa a `false`, provocando que el sistema caiga en fallbacks incorrectos en tiempo de ejecución al conectarse a una instancia real de Supabase.
8. **Conclusión**: El cambio es incompleto a nivel de esquema (`schema.sql`) y servicio (`supabaseService.ts`) hasta eliminar el espacio de padding y normalizar `null` a `undefined`.

---

## 3. Caveats

- **Modo Local / Mocks**: En modo local (sin Supabase conectado), el sistema consume `seedData.ts` donde los valores son directamente `'L'` y `'EP'` sin espacios, por lo que el fallo no se manifiesta en local pero sí en producción/cloud.
- **Alcance de Otros Módulos**:
  - En `AppContext.tsx:953`, la función `adjustStudentGrade` aún contiene `['C', 'EP', 'I'].includes(newScore)`. Esta modificación está explícitamente programada para Milestone 2 (Feature 6).
  - En `FinalLapsoView.tsx:37, 47`, persisten fallbacks residuales `|| 'C'`. Esta normalización está explícitamente programada para Milestone 3 (Feature 13).
  - En `BoletinInformativoView.tsx:82, 230`, persisten casts temporales `'EP' | 'C'`. Su refactorización modular está programada para Milestone 4 (Feature 15).

---

## 4. Conclusion

**Veredicto**: **REQUEST_CHANGES**

El trabajo realizado por Worker M1 es de alta calidad técnica y deja el proyecto con compilación limpia (`npm run build` en 962ms con 0 errores). Sin embargo, se identificó un fallo empírico reproducible (BUG-M1-01) en el manejo de persistencia Supabase que debe ser subsanado antes de cerrar Milestone 1 para garantizar que Milestone 2 y Milestone 3 operen sobre una base de datos 100% fiable:

### Acciones Requeridas para Worker M1:

1. **`supabase/schema.sql` (Línea 142)**:
   Cambiar `CHAR(2)` por `VARCHAR(2)`:
   ```sql
   score_qualitative VARCHAR(2) CHECK (score_qualitative IN ('L', 'C', 'EP', 'I')),
   ```

2. **`src/services/supabaseService.ts` (Línea 234)**:
   Defensivamente recortar espacios en blanco y normalizar `null` a `undefined`:
   ```typescript
   scoreQualitative: (() => {
     const raw = typeof row.score_qualitative === 'string' ? row.score_qualitative.trim() : undefined;
     return raw === 'C' ? 'L' : (raw as QualitativeScore | undefined);
   })(),
   scoreLiteral: typeof row.score_literal === 'string' ? (row.score_literal.trim() as LiteralScore) : undefined,
   ```

3. **Verificación de Compilación**:
   Re-ejecutar `npm run build` para asegurar código de salida 0.

---

## 5. Verification Method

Para verificar independientemente la resolución del defecto:

1. **Prueba Empírica de Normalización**:
   Ejecutar en consola:
   ```powershell
   node -e "
   const test = (val) => {
     const raw = typeof val === 'string' ? val.trim() : undefined;
     return raw === 'C' ? 'L' : raw;
   };
   console.assert(test('C ') === 'L', 'Fallo C con espacio');
   console.assert(test('L ') === 'L', 'Fallo L con espacio');
   console.assert(test('EP') === 'EP', 'Fallo EP');
   console.assert(test(null) === undefined, 'Fallo null');
   console.log('Validación de normalización exitosa.');
   "
   ```

2. **Inspección de Esquema**:
   Revisar `supabase/schema.sql` línea 142 asegurando `VARCHAR(2)`.

3. **Compilación de Producción**:
   ```powershell
   npm run build
   ```
   *Criterio*: Código de salida 0 y 0 errores de TypeScript.
