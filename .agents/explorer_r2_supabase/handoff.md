# Reporte de Auditoría Técnica — Requisito R2: Sincronización con Supabase y Estado Global

**Subagente Explorador**: Supabase & Auth/RBAC Explorer  
**Directorio de Trabajo**: `d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/explorer_r2_supabase`  
**Fecha de Emisión**: 2026-09-22  
**Referencia de Requerimientos**: `d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/ORIGINAL_REQUEST.md` (R2: Sincronización con Supabase y Estado Global)

---

## Resumen Ejecutivo

Se realizó una auditoría exhaustiva y transversal del código fuente del sistema institucional SICE-CBA, evaluando la capa de persistencia en la nube (`lib/supabaseClient.ts`, `services/supabaseService.ts`), la gestión de estado global y caché reactivo (`context/AppContext.tsx`), la resiliencia operativa frente a bases de datos vacías (0 registros), el sistema de autenticación dual (usuario / correo institucional) y el control de acceso granular por roles (RBAC) para los 6 roles institucionales.

La investigación reveló hallazgos críticos de diseño que comprometen la sincronización y la integridad del sistema:
1. **Conflación de error con tabla vacía (`|| data.length === 0`) en 14 funciones de `supabaseService.ts`**: Cuando una tabla en Supabase tiene 0 registros, los métodos de fetch retornan `null` en lugar de un arreglo vacío `[]`. Esto provoca que `AppContext.refreshFromSupabase()` ignore la sincronización y obligue al sistema a mantener datos de prueba obsoletos (*mock seed data*).
2. **Inconsistencia de estado huérfano**: `supabaseFetchStudents()` sí retorna `[]` cuando la tabla de alumnos está vacía, pero `evaluations`, `plans` y `passes` retienen datos ficticios de `seedData.ts`. Esto crea registros de evaluación que apuntan a IDs de estudiantes que ya no existen en la matrícula.
3. **Peligros inminentes de fallo en tiempo de ejecución (Crash / TypeError)**:
   - En `TitulosBachillerView.tsx` (`titles[0]` sin validar provoca excepción fatal al acceder a propiedades de `undefined` cuando la tabla está vacía).
   - En `ProcesalGradebookView.tsx` (`currentArea.name` sin operador de encadenamiento opcional provoca caída inmediata al publicar calificaciones si `levelAreas` está vacía).
   - En `FinalLapsoView.tsx` y `BoletinInformativoView.tsx` se producen cálculos `0 / 0 = NaN` por división entre longitud de arreglos vacíos.
   - En `InstitutionalReportsView.tsx` se proyecta una cifra negativa de aprobados (`{levelStudents.length - 1} = -1`) cuando la nómina está vacía.
4. **Inversión de privilegios RBAC de alto riesgo pedagógico**:
   - En `PlanQuincenalView.tsx` y `PlanLapsoView.tsx`, la condición `currentRole === 'COORDINACION' || currentRole === 'DOCENTE'` permite a un docente autoaprobarse sus propias planificaciones a estatus `DEFINITIVO`, mientras que priva al `ADMINISTRADOR` y al `DIRECTOR` de ejercer dicha aprobación.
   - En `FinalLapsoView.tsx`, un `DOCENTE` puede ejecutar el cierre formal del lapso escolar, mientras que `DIRECTOR` y `ADMINISTRADOR` quedan excluidos.
   - En `ComunidadModule.tsx`, tanto `REPRESENTANTE` como `ESTUDIANTE` tienen acceso irrestricto a publicar anuncios institucionales en la cartelera comunitaria y emitir comunicados masivos omnicanal (SMS/Correo).
   - En `ConsultasModule.tsx`, `BoletinInformativoView.tsx` y `CommandSearchModal.tsx` se encuentra hardcodeado el apellido `'urdaneta'` como mecanismo de privacidad para padres, lo que constituye una brecha y mock hack.

---

## 1. Observación (Evidencias Directas)

### 1.1 Conflación de tabla vacía con error en `supabaseService.ts`

En `src/services/supabaseService.ts`, 14 de las 15 funciones de consulta a Supabase contienen la condición `data.length === 0` dentro del bloque de fallo:

- **Línea 101 (`supabaseFetchSubjectAreas`)**:
  ```ts
  const { data, error } = await supabase.from('subject_areas').select('*');
  if (error || !data || data.length === 0) return null;
  ```
- **Línea 127 (`supabaseFetchCompetencies`)**:
  ```ts
  const { data, error } = await supabase.from('competencies').select('*');
  if (error || !data || data.length === 0) return null;
  ```
- **Línea 166 (`supabaseFetchIndicators`)**:
  ```ts
  const { data, error } = await supabase.from('indicators').select('*');
  if (error || !data || data.length === 0) return null;
  ```
- **Línea 212 (`supabaseFetchEvaluations`)**:
  ```ts
  const { data, error } = await supabase.from('evaluation_records').select('*');
  if (error || !data || data.length === 0) return null;
  ```
- **Línea 293 (`supabaseFetchDidacticPlans`)**:
  ```ts
  const { data, error } = await supabase.from('didactic_plans').select('*');
  if (error || !data || data.length === 0) return null;
  ```
- **Línea 386 (`supabaseFetchPasses`)**:
  ```ts
  if (error || !data || data.length === 0) return null;
  ```
- **Línea 444 (`supabaseFetchDailyAttendance`)**:
  ```ts
  if (error || !data || data.length === 0) return null;
  ```
- **Línea 488 (`supabaseFetchConducts`)**:
  ```ts
  if (error || !data || data.length === 0) return null;
  ```
- **Línea 535 (`supabaseFetchDocumentRequests`)**:
  ```ts
  if (error || !data || data.length === 0) return null;
  ```
- **Línea 584 (`supabaseFetchAdminBlocks`)**:
  ```ts
  if (error || !data || data.length === 0) return null;
  ```
- **Línea 631 (`supabaseFetchTitleRecords`)**:
  ```ts
  if (error || !data || data.length === 0) return null;
  ```
- **Línea 680 (`supabaseFetchCommunityNotices`)**:
  ```ts
  if (error || !data || data.length === 0) return null;
  ```
- **Línea 726 (`supabaseFetchNotifications`)**:
  ```ts
  if (error || !data || data.length === 0) return null;
  ```
- **Línea 779 (`supabaseFetchUsers`)**:
  ```ts
  if (error || !data || data.length === 0) return null;
  ```

Por el contrario, `supabaseFetchStudents` (líneas 36-41) NO evalúa `data.length === 0`:
```ts
if (error || !data) {
  console.warn('Supabase fetch students aviso:', error?.message);
  return null;
}
return data.map(row => ({ ... }));
```
Si la tabla `students` tiene 0 registros, retorna `[]` (un arreglo vacío).

### 1.2 Retención forzada de datos obsoletos en `AppContext.tsx`

En `src/context/AppContext.tsx` (líneas 494-510):
```ts
if (remoteStudents !== null) setStudents(remoteStudents);
if (remoteAreas && remoteAreas.length > 0) setAreas(remoteAreas);
if (remoteCompetencies && remoteCompetencies.length > 0) setCompetencies(remoteCompetencies);
if (remoteIndicators && remoteIndicators.length > 0) setIndicators(remoteIndicators);
if (remoteEvaluations !== null) setEvaluations(remoteEvaluations);
if (remotePlans && remotePlans.length > 0) setPlansQuincenal(remotePlans);
if (remotePasses !== null) setPasses(remotePasses);
if (remoteAttendance !== null) setDailyAttendance(remoteAttendance);
if (remoteConducts !== null) setConducts(remoteConducts);
if (remoteDocs !== null) setDocumentRequests(remoteDocs);
if (remoteBlocks !== null) setAdminBlocks(remoteBlocks);
if (remoteTitles !== null) setTitles(remoteTitles);
if (remoteNotices && remoteNotices.length > 0) setCommunityNotices(remoteNotices);
if (remoteNotifications && remoteNotifications.length > 0) setNotifications(remoteNotifications);
```
Cuando las tablas remotas de Supabase para `evaluations`, `passes`, `attendance`, `conducts`, `plans`, etc. tienen 0 registros:
- Las funciones fetch retornan `null`.
- Los condicionales `if (remoteX !== null)` o `if (remoteX && remoteX.length > 0)` evalúan a falso.
- Los estados permanecen con los datos iniciales de prueba provenientes de `src/data/seedData.ts` (`INITIAL_EVALUATION_RECORDS`, `INITIAL_PLANS_QUINCENAL`, `INITIAL_PASSES`, etc.).
- Como `remoteStudents` sí retornó `[]`, `students` se vacía, pero `evaluations` sigue cargando notas para estudiantes ficticios inexistentes (`stu-med-1`, `stu-med-2`, `stu-med-3`, etc.).

### 1.3 Excepción fatal no controlada (Crash) en `TitulosBachillerView.tsx`

En `src/components/gestion/TitulosBachillerView.tsx`:
- **Línea 17**:
  ```ts
  const [selectedTitle, setSelectedTitle] = useState<TitleRecord>(titles[0]);
  ```
- **Líneas 75, 101, 110, 119, 128, 140**:
  ```ts
  selectedTitle.id === tit.id
  selectedTitle.schoolYear
  selectedTitle.serialNumber
  selectedTitle.tomo
  selectedTitle.folio
  selectedTitle.registeredCode
  ```
Si la tabla `title_records` está vacía en Supabase o en el estado local (`titles = []`), `titles[0]` es `undefined`. La invocación en render de `selectedTitle.schoolYear` arroja inmediatamente:
`TypeError: Cannot read properties of undefined (reading 'schoolYear')`
provocando el colapso en blanco (*white screen*) del módulo de Gestión Institucional.

### 1.4 Excepción fatal no controlada (Crash) en `ProcesalGradebookView.tsx`

En `src/components/evaluation/ProcesalGradebookView.tsx`:
- **Línea 49**:
  ```ts
  const currentArea = levelAreas.find(a => a.id === selectedAreaId) || levelAreas[0];
  ```
- **Líneas 138 y 150**:
  ```ts
  sendNotification({
    title: `Notas Publicadas • ${currentArea.name}`,
    message: `El docente ha cargado las notas del Lapso ${activeLapso} en ${currentArea.name} (${currentSection})...`,
    ...
  });
  setPublishedAlert(
    `¡Calificaciones de ${currentArea.name} publicadas con éxito!...`
  );
  ```
Si `levelAreas` es un arreglo vacío (`[]`), `currentArea` es `undefined`. Al presionar el botón "Publicar & Notificar a Familias", la lectura de `currentArea.name` lanza `TypeError: Cannot read properties of undefined (reading 'name')`.

### 1.5 Divisiones por cero y proyecciones negativas

- **`FinalLapsoView.tsx` (línea 158)**:
  ```ts
  const avg = Math.round((scoresList.reduce((a, b) => a + (isNaN(b) ? 14 : b), 0) / scoresList.length) * 10) / 10;
  ```
  Si `scoresList.length === 0`, el resultado es `0 / 0 = NaN`.
- **`BoletinInformativoView.tsx` (línea 91)**:
  ```ts
  const generalAverage = Math.round((studentScores.reduce((a, b) => a + b, 0) / studentScores.length) * 10) / 10;
  ```
  Si `studentScores.length === 0`, genera `NaN`.
- **`InstitutionalReportsView.tsx` (línea 460)**:
  ```tsx
  <td className="py-2 px-3 text-center text-emerald-700 font-black">{levelStudents.length - 1}</td>
  ```
  Si `levelStudents.length === 0`, la vista renderiza que hay **-1** estudiantes aprobados.

### 1.6 Fabricación forzada de notas artificiales (Mock Fallbacks)

Cuando un estudiante no tiene evaluaciones registradas en base de datos, múltiples componentes fuerzan notas ficticias automáticas:
- **`ProcesalGradebookView.tsx` (líneas 78-83)**:
  ```ts
  if (currentLevel === 'MEDIA_GENERAL') {
    map[stu.id][ind.id] = stu.id.includes('stu-med-3') ? 8 : 17;
  } else {
    map[stu.id][ind.id] = stu.id.includes('stu-ini-3') ? 'EP' : 'L';
  }
  ```
- **`DiagnosticView.tsx` (líneas 66-72)**:
  ```ts
  existing[stu.id] = {
    numeric: currentLevel === 'MEDIA_GENERAL' ? 14 : undefined,
    qualitative: 'L',
    obs: '',
    robotics: isRoboticsSpecial ? { logic: 'L', construction: 'L', teamwork: 'L' } : undefined
  };
  ```
- **`FinalLapsoView.tsx` (líneas 51-55)**:
  ```ts
  if (currentLevel === 'MEDIA_GENERAL') {
    return studentId.includes('stu-med-3') ? '08' : studentId.includes('stu-med-4') ? '14' : '18';
  } else {
    return studentId.includes('stu-ini-3') ? 'EP' : 'L';
  }
  ```
- **`BoletinInformativoView.tsx` (líneas 78-86)**:
  ```ts
  const isChacin = activeStudent?.id.includes('stu-med-3');
  const isCamila = activeStudent?.id === 'stu-med-2' || activeStudent?.fullName.toLowerCase().includes('camila');
  return {
    scoreNumeric: isChacin ? (areaId.includes('mat') ? 8 : 12) : isCamila ? 19 : 18,
    scoreQualitative: (isChacin ? 'EP' : 'C') as 'EP' | 'C',
    ...
  };
  ```
- **`ConsultasModule.tsx` (líneas 438, 541)**:
  ```ts
  const isLucas = stu.id.includes('stu-ini-3') || stu.fullName.toLowerCase().includes('lucas');
  const isFinol = stu.fullName.toLowerCase().includes('finol');
  ```

### 1.7 Inversión de privilegios RBAC

- **`PlanQuincenalView.tsx` (línea 284)**:
  ```tsx
  {activePlan.status === 'A_REVISION' && (currentRole === 'COORDINACION' || currentRole === 'DOCENTE') && (
    <button onClick={() => updateQuincenalStatus(activePlan.id, 'DEFINITIVO')}>
      Aprobar Definitivo
    </button>
  )}
  ```
- **`PlanLapsoView.tsx` (línea 242)**:
  ```tsx
  {activePlan?.status === 'A_REVISION' && (currentRole === 'COORDINACION' || currentRole === 'DOCENTE') && (
    <button onClick={() => updateLapsoPlanStatus(activePlan.id, 'DEFINITIVO')}>
      Aprobar Definitivo
    </button>
  )}
  ```
- **`FinalLapsoView.tsx` (línea 90)**:
  ```tsx
  {(currentRole === 'COORDINACION' || currentRole === 'DOCENTE') && (
    <button onClick={() => setIsLapsoLocked(!isLapsoLocked)}>
      {isLapsoLocked ? 'Desbloquear Cierre' : 'Cierre Oficial de Lapso'}
    </button>
  )}
  ```
- **`utils/rbac.ts` (líneas 305-359)**:
  Las funciones oficiales de verificación:
  - `canApprovePlans(role)` (reserva la aprobación a ADMIN, DIRECTOR y COORDINACION).
  - `canEditGrades(role)`
  - `canManageBlocks(role)`
  - `canIssueTitles(role)`
  - `canConfigureSchool(role)`
  - `canPublishCommunity(role)`
  - `isConsultasOnlyRole(role)`
  están declaradas y tipadas, pero **ninguna de ellas es utilizada en los componentes de la interfaz de usuario**.

- **`ComunidadModule.tsx` (líneas 141-148, 258-305)**:
  Los formularios de "Publicar Nuevo Anuncio" y "Envío de Comunicados y Mensajes Masivos" carecen de cualquier comprobación de rol. Dado que `REPRESENTANTE` y `ESTUDIANTE` tienen acceso a las subpestañas `NOTICIAS` y `COMUNICADOS`, pueden redactar y enviar comunicados masivos y noticias oficiales a toda la institución.

### 1.8 Brecha de privacidad estudiantil por filtrado estático

En `ConsultasModule.tsx` (líneas 71-73), `BoletinInformativoView.tsx` (líneas 40-41) y `CommandSearchModal.tsx` (líneas 65-67):
```ts
return (
  s.representativeName.toLowerCase().includes(currentUser?.fullName?.toLowerCase() || '') ||
  s.fullName.toLowerCase().includes('urdaneta')
);
```
Se observa que la pertenencia del alumno al representante se evalúa permitiendo siempre el acceso si el apellido contiene `'urdaneta'`. Cualquier representante ajeno verá al estudiante Urdaneta, y un representante legítimo con otro apellido no podrá vincular a su hijo si su nombre de usuario no coincide exactamente con la cadena de texto de `representativeName`.

---

## 2. Cadena Lógica (Logic Chain)

1. **Premisa 1 (Fetch Supabase)**: Supabase retorna `{ data: [], error: null }` cuando una tabla no contiene registros.
2. **Inferencia 1**: Al evaluar `if (error || !data || data.length === 0) return null;`, el servicio convierte un estado válido de base de datos vacía (`[]`) en una respuesta de fallo nula (`null`).
3. **Inferencia 2**: Al recibir `null`, `AppContext` omite la mutación del estado local (`setEvaluations`, `setPasses`, `setPlansQuincenal`, etc.), dejando activos los datos iniciales predeterminados de `seedData.ts`. Esto incumple el requisito R2 de no forzar datos obsoletos ante tablas vacías.
4. **Premisa 2 (Desacoplamiento Estudiantes / Calificaciones)**: `supabaseFetchStudents()` sí retorna `[]` cuando la tabla `students` está vacía, activando `setStudents([])`.
5. **Inferencia 3**: La combinación de las Inferencias 1 y 2 produce un estado asimétrico corrupto: `students` queda con 0 elementos, mientras que `evaluations` contiene decenas de registros huérfanos que apuntan a IDs inexistentes (`stu-med-1`, `stu-med-2`, etc.).
6. **Premisa 3 (Consumo en Componentes UI)**: Múltiples vistas asumen que los arreglos siempre tienen al menos un elemento (`titles[0]`, `levelAreas[0]`, `displayStudents[0]`) o que las calificaciones faltantes deben rellenarse con notas arbitrarias de acuerdo al ID del estudiante.
7. **Inferencia 4**: La desincronización y la ausencia de validación defensiva conducen directamente a excepciones no capturadas de JavaScript (`Cannot read properties of undefined`), rompiendo el renderizado de la aplicación y violando el criterio de aceptación de robustez sin excepciones de consola.
8. **Premisa 4 (Reglas de Control de Acceso RBAC)**: La arquitectura definió una matriz exhaustiva de jerarquías en `src/utils/rbac.ts`, pero los desarrolladores crearon verificaciones *ad-hoc* incompletas en las vistas (`currentRole === 'COORDINACION' || currentRole === 'DOCENTE'`).
9. **Inferencia 5**: La omisión de las funciones centralizadas de `rbac.ts` generó brechas graves: docentes que pueden aprobarse a sí mismos sus recaudos pedagógicos, directivos y administradores bloqueados de aprobar planes en la UI, y estudiantes que pueden emitir comunicados a toda la comunidad educativa.

---

## 3. Auditoría de Autenticación Dual (Username vs Institutional Email)

### 3.1 Flujo Operativo y Verificación

En `src/context/AppContext.tsx` (método `login`, líneas 327-412):
```ts
const trimmedInput = userInput.trim().toLowerCase();
let matched = users.find(
  u => u.username.toLowerCase() === trimmedInput || u.email.toLowerCase() === trimmedInput
);

if (isSupabaseConfigured()) {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .or(`username.ilike.${trimmedInput},email.ilike.${trimmedInput}`)
    .limit(1);
  ...
}
```

**Evaluación técnica:**
1. **Unificación de Entrada**: El formulario de `LoginView.tsx` utiliza un único campo con atributo `autoComplete="username email"`, permitiendo indistintamente el ingreso de `username` o `email`.
2. **Validación Dual en Base de Datos**: Cuando Supabase está conectado, la cláusula SQL `.or('username.ilike...' , 'email.ilike...')` consulta la tabla `app_users` insensible a mayúsculas/minúsculas (`ilike`).
3. **Actualización de Caché Reactivo**: Si el usuario es hallado en Supabase, se actualiza el estado reactivo `setUsers(prev => ...)` y se persiste de inmediato en `localStorage.setItem('sisceba_users_v3')` y `localStorage.setItem('sisceba_current_user')`.
4. **Cuentas Institucionales Auditadas**: En `INITIAL_USERS` (`src/data/seedData.ts:1673-1740`), los 6 roles cuentan con credenciales simétricas:

| Rol Institucional | Nombre de Usuario | Correo Institucional | Contraseña | Nivel Asignado |
|---|---|---|---|---|
| `ADMINISTRADOR` | `admin` | `admin@bellasartes.edu.ve` | `cba2026*admin` | `MEDIA_GENERAL` |
| `DIRECTOR` | `director` | `director@bellasartes.edu.ve` | `cba2026*director` | `MEDIA_GENERAL` |
| `COORDINACION` | `coordinador` | `coordinacion@bellasartes.edu.ve` | `cba2026*coordinador` | `MEDIA_GENERAL` |
| `DOCENTE` | `docente` | `docente@bellasartes.edu.ve` | `cba2026*docente` | `MEDIA_GENERAL` |
| `REPRESENTANTE` | `representante` | `representante@bellasartes.edu.ve` | `cba2026*representante` | `MEDIA_GENERAL` |
| `ESTUDIANTE` | `estudiante` | `estudiante@bellasartes.edu.ve` | `cba2026*estudiante` | `MEDIA_GENERAL` |

### 3.2 Vulnerabilidades Identificadas en Autenticación

1. **Riesgo en revalidación de sesión en `refreshFromSupabase`**:
   Línea 517 de `AppContext.tsx`:
   ```ts
   const verified = remoteUsers.find(
     u => u.username.toLowerCase() === savedUser.username?.toLowerCase() && u.active
   );
   ```
   Si el objeto `savedUser` guardado en `localStorage` tuviera un `username` vacío o desfasado, la sesión se cerraría indebidamente aunque el `email` o `id` fuesen válidos. Debe validarse:
   `u.id === savedUser.id || u.username.toLowerCase() === savedUser.username?.toLowerCase() || u.email.toLowerCase() === savedUser.email?.toLowerCase()`.
2. **Contraseña bypass hardcodeada**:
   Línea 397 de `AppContext.tsx`:
   `password !== '••••••••'` permite el acceso sin comprobar la clave real.
3. **Inyección en sintaxis de PostgREST**:
   Si un usuario introduce una coma `,` en su entrada, la cláusula `.or(...)` de PostgREST puede fragmentar la consulta indebidamente. Debe sanitizarse el parámetro antes de concatenar.

---

## 4. Auditoría de RBAC y los 6 Roles Institucionales

### 4.1 Matriz de Aislamiento y Cumplimiento por Rol

| Rol | Pestañas Permitidas | Pestañas Restringidas | Subpestañas Críticas Bloqueadas | Falla / Brecha Detectada |
|---|---|---|---|---|
| **ADMINISTRADOR** | Todas (9 pestañas) | Ninguna | Ninguna | En `PlanQuincenalView` y `PlanLapsoView` la UI le prohíbe aprobar planes a `DEFINITIVO` debido al filtro estricto de `COORDINACION` / `DOCENTE`. |
| **DIRECTOR** | Todas (9 pestañas) | Ninguna | Ninguna | Mismo bloqueo indebido en aprobación de planes didácticos y cierre de lapso en `FinalLapsoView`. |
| **COORDINACION** | Todas (9 pestañas) | Ninguna | `GESTION` -> `BLOQUEO` (correcto: solo Admin/Director). | Opera correctamente en gestión pedagógica general, pero comparte indebidamente la aprobación con `DOCENTE`. |
| **DOCENTE** | `ESCRITORIO`, `GESTION`, `INICIAL`, `PRIMARIA`, `MEDIA_GENERAL`, `CONSULTAS`, `COMUNIDAD`, `CONFIGURACION`, `AYUDA` | Ninguna a nivel de pestaña principal | `GESTION` -> `INSCRIPCIONES`, `DOCUMENTOS`, `BLOQUEO`, `TITULOS`, `MATRICULA`. `CONFIGURACION` -> `LAPSOS`, `ESTRUCTURA`, `DOCENTES`. | **Grave**: Puede aprobar planes didácticos a estatus `DEFINITIVO`, cerrar el lapso escolar en `FinalLapsoView` y enviar comunicados masivos en `ComunidadModule`. |
| **REPRESENTANTE** | `CONSULTAS`, `COMUNIDAD`, `AYUDA` | `ESCRITORIO`, `GESTION`, `INICIAL`, `PRIMARIA`, `MEDIA_GENERAL`, `CONFIGURACION` | No tiene acceso a módulos de gestión ni niveles pedagógicos. | **Grave**: En `ComunidadModule` puede redactar y difundir comunicados masivos y anuncios oficiales. En `ConsultasModule`, el aislamiento de privacidad tiene `'urdaneta'` hardcodeado. |
| **ESTUDIANTE** | `CONSULTAS`, `COMUNIDAD`, `AYUDA` | `ESCRITORIO`, `GESTION`, `INICIAL`, `PRIMARIA`, `MEDIA_GENERAL`, `CONFIGURACION` | No tiene acceso a módulos de gestión ni niveles pedagógicos. | Mismas brechas que Representante: acceso de escritura en Cartelera y Comunicados Masivos de Comunidad. |

---

## 5. Inventario de Archivos y Recomendaciones Concretas de Refactorización

### 5.1 `src/services/supabaseService.ts`
- **Diagnóstico**: Las 14 funciones de consulta devuelven `null` cuando `data.length === 0`.
- **Corrección requerida**:
  Reemplazar en cada una de las 14 funciones:
  ```ts
  // ANTES (ERRÓNEO):
  if (error || !data || data.length === 0) return null;

  // DESPUÉS (CORRECTO):
  if (error || !data) {
    console.warn('Supabase fetch aviso:', error?.message);
    return null; // Retorna null solo si hubo error real de red o base de datos
  }
  return data.map(...); // Si data es [], retorna [] válidamente
  ```

### 5.2 `src/context/AppContext.tsx`
- **Diagnóstico**:
  - `refreshFromSupabase` descarta arreglos vacíos (`remotePlans && remotePlans.length > 0`, etc.) forzando el retorno al seedData.
  - Ausencia de mutaciones para estudiantes (`addStudent` / `saveStudent`) y borrado.
  - Validación de sesión remota susceptible a fallar si se inició por email.
- **Corrección requerida**:
  - En `refreshFromSupabase`, actualizar el estado si `remoteX !== null`, sin exigir `remoteX.length > 0`:
    ```ts
    if (remoteStudents !== null) setStudents(remoteStudents);
    if (remoteEvaluations !== null) setEvaluations(remoteEvaluations);
    if (remotePlans !== null) setPlansQuincenal(remotePlans);
    if (remotePasses !== null) setPasses(remotePasses);
    if (remoteAttendance !== null) setDailyAttendance(remoteAttendance);
    if (remoteConducts !== null) setConducts(remoteConducts);
    if (remoteDocs !== null) setDocumentRequests(remoteDocs);
    if (remoteBlocks !== null) setAdminBlocks(remoteBlocks);
    if (remoteTitles !== null) setTitles(remoteTitles);
    if (remoteNotices !== null) setCommunityNotices(remoteNotices);
    if (remoteNotifications !== null) setNotifications(remoteNotifications);
    ```
  - Implementar en `AppContextType` y `AppProvider` los métodos `addStudent` y `saveStudent` conectados con `supabaseSaveStudent`.
  - Robustecer la verificación de sesión en línea 517:
    ```ts
    const verified = remoteUsers.find(
      u => (u.id === savedUser.id || u.username.toLowerCase() === savedUser.username?.toLowerCase() || u.email.toLowerCase() === savedUser.email?.toLowerCase()) && u.active
    );
    ```

### 5.3 `src/components/gestion/TitulosBachillerView.tsx`
- **Diagnóstico**: Excepción fatal al renderizar si `titles = []`.
- **Corrección requerida**:
  - Inicializar `const [selectedTitle, setSelectedTitle] = useState<TitleRecord | null>(titles[0] || null);`
  - Sincronizar mediante `useEffect` cuando `titles` cambie.
  - Agregar guarda de renderizado condicional con estado vacío informativo si `titles.length === 0`:
    ```tsx
    if (titles.length === 0) {
      return (
        <div className="p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700">No hay títulos de bachiller registrados</h3>
          <p className="text-xs text-slate-400 mt-1">Los títulos oficiales se generarán cuando los estudiantes de 5to Año culminen el año escolar.</p>
        </div>
      );
    }
    ```

### 5.4 `src/components/evaluation/ProcesalGradebookView.tsx`
- **Diagnóstico**: Fallo de publicación por `currentArea.name`, notas mock forzadas (`stu-med-3`), ausencia de estado vacío cuando `levelStudents.length === 0`.
- **Corrección requerida**:
  - Proteger `currentArea?.name || 'Asignatura'` en líneas 138 y 150.
  - Eliminar la inyección de notas mock (líneas 78-83) sustituyéndola por celdas vacías (`val ?? ''`).
  - Renderizar fila informativa de estado vacío en la tabla si `filteredStudents.length === 0`:
    ```tsx
    {filteredStudents.length === 0 ? (
      <tr>
        <td colSpan={areaIndicators.length + (currentLevel === 'MEDIA_GENERAL' ? 3 : 2)} className="py-12 text-center text-slate-400">
          <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="font-bold text-xs">No hay estudiantes registrados en esta nómina.</p>
        </td>
      </tr>
    ) : ( ... )}
    ```

### 5.5 `src/components/evaluation/DiagnosticView.tsx`, `FinalLapsoView.tsx` y `BoletinInformativoView.tsx`
- **Diagnóstico**: Fabricación de notas artificiales, división por cero (`NaN`), vistas en blanco ante 0 estudiantes.
- **Corrección requerida**:
  - Eliminar fallbacks basados en `stu-med-3`, `stu-med-4`, `stu-ini-3`, `chacin`, `camila`, `lucas`, `finol`.
  - Validar divisores de longitud: `scoresList.length > 0 ? (sum / scoresList.length) : 0`.
  - Incorporar tarjeta informativa de estado vacío en `BoletinInformativoView` cuando `activeStudent == null`:
    ```tsx
    {!activeStudent && (
      <div className="p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center text-slate-400">
        <FileCheck className="w-10 h-10 mx-auto mb-2 opacity-30" />
        <p className="font-bold text-sm">No hay estudiantes matriculados para emitir boletines oficiales.</p>
      </div>
    )}
    ```

### 5.6 `src/components/communication/InstitutionalReportsView.tsx`
- **Diagnóstico**: Cifra negativa `{levelStudents.length - 1}` en línea 460.
- **Corrección requerida**:
  Reemplazar por cálculo real o salvaguarda: `Math.max(0, levelStudents.length - 1)`.

### 5.7 `src/components/planning/PlanQuincenalView.tsx` y `PlanLapsoView.tsx`
- **Diagnóstico**: Inversión de privilegios (Docente puede aprobar; Admin y Director no).
- **Corrección requerida**:
  Importar y usar `canApprovePlans` de `../../utils/rbac`:
  ```tsx
  // Reemplazar:
  // (currentRole === 'COORDINACION' || currentRole === 'DOCENTE')
  // Por:
  canApprovePlans(currentRole)
  ```

### 5.8 `src/components/evaluation/FinalLapsoView.tsx`
- **Diagnóstico**: Docente puede cerrar el lapso institucional (línea 90); Director y Admin bloqueados.
- **Corrección requerida**:
  ```tsx
  // Reemplazar:
  // (currentRole === 'COORDINACION' || currentRole === 'DOCENTE')
  // Por:
  (currentRole === 'ADMINISTRADOR' || currentRole === 'DIRECTOR' || currentRole === 'COORDINACION')
  ```

### 5.9 `src/components/comunidad/ComunidadModule.tsx`
- **Diagnóstico**: Alumnos y Padres pueden publicar noticias y enviar SMS/Correos masivos institucionales.
- **Corrección requerida**:
  Importar y usar `canPublishCommunity(currentRole)`:
  - Condicionar la visibilidad del botón "Publicar Nuevo Anuncio" (línea 141) a `canPublishCommunity(currentRole)`.
  - Si el usuario en la pestaña `COMUNICADOS` no cumple `canPublishCommunity(currentRole)`, mostrar vista de solo lectura informativa o redirigir a `NOTICIAS`.

### 5.10 `src/components/consultas/ConsultasModule.tsx`, `BoletinInformativoView.tsx` y `CommandSearchModal.tsx`
- **Diagnóstico**: Filtrado de privacidad de representantes hardcodeado con `'urdaneta'`.
- **Corrección requerida**:
  Vincular estrictamente por datos institucionales reales:
  ```ts
  if (currentRole === 'REPRESENTANTE') {
    return (
      (s.representativeEmail && s.representativeEmail.toLowerCase() === currentUser?.email?.toLowerCase()) ||
      (s.representativeName && s.representativeName.toLowerCase() === currentUser?.fullName?.toLowerCase())
    );
  }
  ```

---

## 6. Caveats

- **Criptografía de credenciales**: En el estado actual del prototipo, las contraseñas se validan por igualdad directa de cadenas en `AppContext.tsx` o contra la columna `password` de la tabla `app_users`. La infraestructura actual no implementa hash con `bcrypt` ni GoTrue de Supabase Auth, lo cual es tolerable en desarrollo pero debe ser abordado antes de pase a producción.
- **Simulación Offline**: La aplicación cuenta con un interruptor de simulación offline en el encabezado (`isSimulatedOffline`), pero este opera a nivel de interfaz visual; la persistencia real utiliza `localStorage` como fallback transparente cuando `isSupabaseConfigured()` es falso o no hay conectividad.
- **No se realizaron modificaciones de código**: Este reporte es estrictamente un informe de auditoría e investigación read-only; ningún archivo de `src/` ha sido alterado.

---

## 7. Conclusión

La auditoría técnica determinó que:
1. El soporte para **autenticación dual** (usuario o correo institucional) está sólidamente concebido en su interfaz y servicio de consulta, cubriendo los 6 roles con normalización tipográfica, pero requiere eliminar la clave maestra de bypass (`••••••••`) y asegurar la comprobación de sesión reactiva.
2. El manejo de **base de datos vacía** presenta una falla estructural en la capa de servicios (`|| data.length === 0`), que sabotea deliberadamente la sincronización de Supabase y fuerza la permanencia de datos mock obsoletos. Asimismo, existen dos puntos críticos de caída en tiempo de ejecución (`TitulosBachillerView` y `ProcesalGradebookView`) y proliferación de estados `NaN` y registros ficticios automáticos.
3. El sistema **RBAC** posee una matriz de roles rigurosa en `src/utils/rbac.ts`, pero adolece de desconexión en los componentes: las funciones clave de validación no se invocan y existen inversiones graves de privilegios (docentes aprobando sus planes y cerrando lapsos) y filtraciones de privacidad (hardcodeo de `'urdaneta'` y emisión de mensajes masivos por estudiantes).

La resolución de estos puntos es viable y directa siguiendo el inventario de refactorización provisto en la Sección 5 de este reporte.

---

## 8. Método de Verificación Independiente

1. **Verificación Estática y Compilación Limpia**:
   Ejecutar en la raíz del proyecto:
   ```powershell
   npm run build
   ```
   *Criterio de éxito*: Código de salida 0 sin errores de tipado de TypeScript. (Verificado: la compilación actual produce 0 errores).

2. **Verificación de Resiliencia ante Base de Datos Vacía (0 Estudiantes)**:
   - Limpiar almacenamiento local en consola del navegador o con `localStorage.clear()`.
   - Modificar temporalmente `src/data/seedData.ts` o simular Supabase con `students = []` y `evaluation_records = []`.
   - Navegar secuencialmente a:
     - `GESTION` -> `TITULOS` (Comprobar que no arroja `TypeError: Cannot read properties of undefined`).
     - `MEDIA_GENERAL` -> `PROCESAL` (Comprobar que no arroja `TypeError` al presionar Publicar y que no genera notas ficticias de 8 o 17 puntos).
     - `MEDIA_GENERAL` -> `FINAL_LAPSO` (Comprobar que el promedio no renderiza `NaN`).
     - `MEDIA_GENERAL` -> `BOLETIN` (Comprobar que no renderiza un cuadro en blanco sino un estado vacío informativo).

3. **Verificación de Autenticación Dual**:
   En la pantalla de Login (`/`):
   - Probar ingreso con `admin` y clave `cba2026*admin`.
   - Cerrar sesión y probar ingreso con `admin@bellasartes.edu.ve` y clave `cba2026*admin`.
   - Repetir la prueba para los 5 roles restantes (`director`, `coordinador`, `docente`, `representante`, `estudiante`).
   *Criterio de éxito*: Los 6 roles inician sesión de manera transparente con cualquiera de los dos identificadores.

4. **Verificación de Restricciones RBAC**:
   - Iniciar sesión como `DOCENTE`:
     - Acceder a `PLAN_QUINCENAL`. Comprobar que en un plan en estado `A_REVISION` NO aparezca el botón "Aprobar Definitivo".
     - Acceder a `COMUNIDAD`. Comprobar que NO aparezca el botón "Publicar Nuevo Anuncio" ni el formulario de "Mensajería Masiva".
   - Iniciar sesión como `ESTUDIANTE`:
     - Comprobar que las únicas pestañas accesibles sean `CONSULTAS`, `COMUNIDAD` y `AYUDA`.
     - Comprobar que en `CONSULTAS` únicamente se listen los datos personales del estudiante logueado sin exhibir registros de otros compañeros.
