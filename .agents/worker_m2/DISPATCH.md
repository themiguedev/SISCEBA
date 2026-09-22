## 2026-09-22T12:47:48Z
You are the Implementation Worker for Milestone 2: AppContext State, Empty-Table Resilience, Dual Auth & RBAC.

Identity & Working Directory:
- Role: Worker M2: State, Empty Tables, Auth & RBAC
- Working Directory: d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/worker_m2
- Project Root: d:/Usuarios/UCE.FCBA/Documents/SIS-CBA

MANDATORY INSTRUCTIONS:
Read the authoritative user request first:
d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/ORIGINAL_REQUEST.md
Also read the project specification:
d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/orchestrator_1/PROJECT.md
Note the official subsystem assignment from User Rectification:
- INICIAL: Escala Literal (A, B, C, D, E) -> scoreLiteral (zero numeric scores, zero averages)
- PRIMARIA: Escala Formativa / Cualitativa (L, P / EP, I) -> scoreQualitative
- MEDIA GENERAL: Escala Cuantitativa Vigesimal (01 a 20) -> scoreNumeric

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File Ownership:
You have exclusive write access to:
- src/context/AppContext.tsx
- src/lib/supabaseClient.ts
- src/utils/rbac.ts
- src/components/planning/PlanQuincenalView.tsx
- src/components/planning/PlanLapsoView.tsx
- src/components/comunidad/ComunidadModule.tsx

Tasks to Implement:
1. `src/context/AppContext.tsx`:
   - Reorder State Hooks (Lifecycle/TDZ): Move all `useState` declarations to the top of `AppProvider` before the definition of `refreshFromSupabase` and before any `useEffect`. This completely eliminates React TDZ / immutability warnings.
   - Empty Table State Sync: In `refreshFromSupabase`, update local state when `remoteX !== null` without checking `remoteX.length > 0`:
     Ensure that if Supabase has 0 rows in any table, the local state receives `[]` and does NOT retain stale seed data.
   - Dual Authentication:
     * In `login`: support both username and institutional email for all 6 roles. Remove the hardcoded password bypass (`password !== '••••••••'`) or make it strictly check user password.
     * In session revalidation (line ~517 in `refreshFromSupabase`):
       Check `(u.id === savedUser.id || u.username.toLowerCase() === savedUser.username?.toLowerCase() || u.email.toLowerCase() === savedUser.email?.toLowerCase()) && u.active`.
   - Pedagogical Grading Logic in `adjustStudentGrade`:
     * For `INICIAL`: store in `scoreLiteral: (['A', 'B', 'C', 'D', 'E'].includes(newScore) ? newScore : undefined) as LiteralScore`.
     * For `PRIMARIA`: store in `scoreQualitative: (['L', 'P', 'EP', 'I'].includes(newScore) ? newScore : undefined) as QualitativeScore`.
     * For `MEDIA_GENERAL`: store in `scoreNumeric: Number(newScore)`.
     * Ensure no numeric scores leak into Inicial or Primaria.
   - Expose `addStudent` and `saveStudent` in `AppContextType` and `AppProvider` using `supabaseSaveStudent`.

2. `src/lib/supabaseClient.ts`:
   - Replace any unsafe `: any` (e.g. `catch (err: any)`) with `catch (err: unknown)` and safe error message extraction.

3. `src/utils/rbac.ts`:
   - Ensure `canApprovePlans(role)` returns true for `ADMINISTRADOR`, `DIRECTOR`, `COORDINACION`, and false for `DOCENTE`, `REPRESENTANTE`, `ESTUDIANTE`.
   - Ensure `canPublishCommunity(role)` returns true for staff (`ADMINISTRADOR`, `DIRECTOR`, `COORDINACION`, `DOCENTE`) and false for `REPRESENTANTE`, `ESTUDIANTE`.

4. `src/components/planning/PlanQuincenalView.tsx` & `PlanLapsoView.tsx`:
   - Import and use `canApprovePlans(currentRole)` for the "Aprobar Definitivo" button. Now Admin, Director, and Coordinador can approve, while Docente cannot self-approve.

5. `src/components/comunidad/ComunidadModule.tsx`:
   - Import and use `canPublishCommunity(currentRole)` to hide the "Publicar Nuevo Anuncio" button and guard the mass SMS/email sending form. For `REPRESENTANTE` and `ESTUDIANTE`, display an informative banner or read-only view.

6. Build Verification:
   - Run `npm run build` (`tsc -b && vite build`) and verify it compiles with exit code 0 and zero errors.

Deliverable:
Write report to `d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/worker_m2/handoff.md` and message parent when finished.
