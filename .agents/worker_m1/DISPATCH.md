## 2026-09-22T12:29:39Z

You are the Implementation Worker for Milestone 1: Type Architecture, Schema & Supabase Sync Service.

Identity & Working Directory:
- Role: Worker M1: Types, Schema & Supabase Service
- Working Directory: d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/worker_m1
- Project Root: d:/Usuarios/UCE.FCBA/Documents/SIS-CBA

MANDATORY INSTRUCTIONS:
Read the authoritative user request first:
d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/ORIGINAL_REQUEST.md
Also read the project specification:
d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/orchestrator_1/PROJECT.md
Also read the Explorer findings:
d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/explorer_r1_grading/handoff.md
d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/explorer_r2_supabase/handoff.md
d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/explorer_r3_types/handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File Ownership:
You have exclusive write access to:
- src/types/index.ts
- supabase/schema.sql
- supabase/seed.sql
- src/services/supabaseService.ts
- src/data/seedData.ts

Tasks to Implement:
1. `src/types/index.ts`:
   - Redefine `QualitativeScore = 'L' | 'EP' | 'I';` (Logrado, En Proceso, Iniciado).
   - Ensure `LiteralScore = 'A' | 'B' | 'C' | 'D' | 'E';` is exported.
   - Export `LITERAL_DESCRIPTIONS: Record<LiteralScore, { title: string; desc: string }>` with official descriptions:
     - A: { title: 'Excelente', desc: 'Alcanzó todas las competencias y superó las expectativas del grado.' }
     - B: { title: 'Bueno', desc: 'Alcanzó todas las competencias previstas para el grado.' }
     - C: { title: 'Aceptable', desc: 'Alcanzó la mayoría de las competencias previstas para el grado.' }
     - D: { title: 'Requiere Acompañamiento', desc: 'Alcanzó algunas competencias y requiere refuerzo pedagógico.' }
     - E: { title: 'No Consolidado', desc: 'No logró adquirir las competencias mínimas requeridas.' }
   - Ensure `EvaluationRecord` cleanly reflects:
     - `scoreNumeric?: number;` (Media General)
     - `scoreQualitative?: QualitativeScore;` (Inicial)
     - `scoreLiteral?: LiteralScore;` (Primaria)
     - `roboticsScore?: RoboticsSpecialEvaluation;`

2. `supabase/schema.sql`:
   - Line 142: Update check constraint on `evaluation_records`:
     `score_qualitative CHAR(2) CHECK (score_qualitative IN ('L', 'C', 'EP', 'I')),`
     so that 'L' is valid in PostgreSQL while maintaining backward compatibility with any 'C'.

3. `supabase/seed.sql`:
   - Line 83: Update initial evaluation seed to `'L'`.

4. `src/services/supabaseService.ts`:
   - Fix all 14 fetch functions (`supabaseFetchSubjectAreas`, `supabaseFetchCompetencies`, `supabaseFetchIndicators`, `supabaseFetchEvaluations`, `supabaseFetchDidacticPlans`, `supabaseFetchPasses`, `supabaseFetchDailyAttendance`, `supabaseFetchConducts`, `supabaseFetchDocumentRequests`, `supabaseFetchAdminBlocks`, `supabaseFetchTitleRecords`, `supabaseFetchCommunityNotices`, `supabaseFetchNotifications`, `supabaseFetchUsers`):
     Remove `|| data.length === 0` from error conditions. If `error || !data`, log warning and return `null`. When `!error && data`, return `data.map(...)` so that an empty table returns `[]` instead of `null`!
   - Verify `supabaseSaveEvaluation` and `supabaseBulkSaveEvaluations` map `score_literal` and `score_qualitative` correctly.

5. `src/data/seedData.ts`:
   - In `INITIAL_EVALUATION_RECORDS`: Add test evaluation records for Primaria students (`stu-pri-1`, `stu-pri-2`, `stu-pri-3`) across primary subject areas (`pri-len`, `pri-mat`, `pri-cn`, `pri-cs`) using `scoreLiteral: 'A'` and `'B'`.
   - Cleanse any numeric scores from Inicial records (`eval-ini-1`, `eval-ini-2`).
   - If any `scoreQualitative` has `'C'`, update to `'L'`.

6. Build Verification:
   - Run `npm run build` (`tsc -b && vite build`) and verify it compiles with exit code 0 and zero errors.

Deliverable:
Write a full report to `d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/worker_m1/handoff.md` with:
- Files modified and exact changes
- Build command execution output and exit code
- Verification of empty array behavior in supabaseService
- Verification that types compile cleanly
When finished, send a message to parent with summary and handoff path.
