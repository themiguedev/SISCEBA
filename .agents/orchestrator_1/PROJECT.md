# Project: SICE-CBA Institutional Academic System Audit & Refactoring

## Architecture
- **Framework & Runtime**: React 19 + TypeScript (Vite bundler) + Tailwind CSS + Lucide React.
- **Backend & Cloud Persistence**: Supabase (PostgreSQL with Row Level Security, tables: `app_users`, `students`, `subject_areas`, `competencies`, `indicators`, `evaluation_records`, `didactic_plans`, `pass_records`, `daily_attendance`, `conduct_entries`, `document_requests`, `administrative_blocks`, `title_records`, `community_notices`, `notifications`).
- **Global State**: Single-context React state (`AppContext.tsx`) with reactive local cache (`localStorage`), synchronized with Supabase on startup and mutations.
- **Pedagogical Subsystems**:
  - `INICIAL`: Official Literal Scale (`A`, `B`, `C`, `D`, `E`). Zero numeric grades (01-20), zero decimal averages.
  - `PRIMARIA`: Formative / Qualitative Scale (Logrado `L`, Proceso / En Proceso `P`/`EP`, Iniciado `I`).
  - `MEDIA_GENERAL`: Quantitative Vigesimal Scale (01 to 20 points, two digits, weighted averages by evaluation weight).
- **Institutional Roles (RBAC)**: 6 roles (`ADMINISTRADOR`, `DIRECTOR`, `COORDINACION`, `DOCENTE`, `REPRESENTANTE`, `ESTUDIANTE`).

---

## Feature Inventory
Every feature identified during the Survey phase mapped to its assigned milestone:

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Qualitative & Literal Type Unification | Define `QualitativeScore = 'L' \| 'P' \| 'EP' \| 'I'` for Primaria, `LiteralScore = 'A' \| 'B' \| 'C' \| 'D' \| 'E'` for Inicial | M1 | survey r1/r3 |
| 2 | Supabase Database Constraints | Update PostgreSQL `score_qualitative` check constraint to include `'L'`, update seed SQL | M1 | survey r3 |
| 3 | Supabase Empty-Table Handling | Fix 14 fetch methods in `supabaseService.ts` to return `[]` when `data.length === 0` instead of `null` | M1 | survey r2/r3 |
| 4 | Seed Data Quality & Inicial/Primaria Evals | Add test evaluation records for Inicial with `scoreLiteral` (A-E) and Primaria with `scoreQualitative` (L, P, I) | M1 | survey r1 |
| 5 | AppContext TDZ & Lifecycle Cleanup | Reorder state declarations before `refreshFromSupabase` to eliminate 13 React TDZ / immutability warnings | M2 | survey r3 |
| 6 | AppContext Qualitative & Literal Grading | Fix `adjustStudentGrade` to set `scoreLiteral` for Inicial and `scoreQualitative` (L, P, I) for Primaria | M2 | survey r1/r3 |
| 7 | AppContext Empty Table State Synchronization | Ensure `remoteX !== null` updates state without requiring `remoteX.length > 0`, avoiding stale mock retention | M2 | survey r2 |
| 8 | Dual Authentication & Session Resilience | Verify username/email login for all 6 roles, remove `'••••••••'` bypass, robustify session revalidation | M2 | survey r2 |
| 9 | RBAC Privilege Correction (Planning & Lapso) | Restrict plan approval (`canApprovePlans`) to Admin/Director/Coordination; restrict lapso close in `FinalLapsoView` | M2 | survey r2 |
| 10 | RBAC Community & Announcements Isolation | Restrict announcements and mass communications to authorized roles using `canPublishCommunity` | M2 | survey r2 |
| 11 | Procesal Gradebook 3-Way Subsystem Switch | Implement tri-state evaluation input (Media: 01-20, Primaria: L/P/I, Inicial: A-E), weighted averages, remove mock injection | M3 | survey r1 |
| 12 | Diagnostic View Subsystem Separation | Separate Inicial literal scale (A-E) from Primaria qualitative (L/P/I) and robotics, remove artificial hybrid scales | M3 | survey r1 |
| 13 | Final Lapso Matrix Normalization | Eliminate `parseFloat` and default 14 injection in Inicial/Primaria, isolate vigesimal `avg` to Media General, guard `0/0=NaN` | M3 | survey r1/r2 |
| 14 | Statistics & Telemetry Subsystem Alignment | Update `StatisticsChartsView` for Inicial literal distribution (A-E) and Primaria qualitative (L/P/I), replace "Consolidación" with "Logrado (L)" in `AcademicPulseHero` | M3 | survey r1 |
| 15 | Modular Boletines Architecture | Modularize into `BoletinInicial` (literal A-E), `BoletinPrimaria` (qualitative L/P/I), `BoletinMediaGeneral` (01-20 vigesimal) | M4 | survey r1 |
| 16 | Boletin Router & Empty State Guard | `BoletinInformativoView` as intelligent dispatcher with informative empty state on 0 students | M4 | survey r1/r2 |
| 17 | TitulosBachillerView Empty State Guard | Protect against `titles[0]` undefined crash when 0 titles exist | M4 | survey r2 |
| 18 | Institutional Reports & Consultas Hardening | Fix `{levelStudents.length - 1}` negative projection, remove `'urdaneta'` hardcode in Consultas & CommandSearchModal | M4 | survey r2 |
| 19 | TypeScript Strictness & Any Elimination | Eliminate 12 unsafe `: any` types, clean up dead imports, ensure pristine type contracts in `src/types/index.ts` | M5 | survey r3 |
| 20 | E2E Acceptance Verification & Clean Build | Validate `npm run build` exit code 0, madge 0 circular deps, empty db startup, dual login on 6 roles, zero numeric leaks in Inicial | M5 | survey all |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Type Architecture, Schema & Supabase Sync Service | `src/types/index.ts`, `supabase/schema.sql`, `supabase/seed.sql`, `src/services/supabaseService.ts`, `src/data/seedData.ts` | none | DONE |
| M2 | AppContext State, Empty-Table Resilience, Dual Auth & RBAC | `src/context/AppContext.tsx`, `src/lib/supabaseClient.ts`, `src/utils/rbac.ts`, `src/components/comunidad/ComunidadModule.tsx`, `src/components/planning/PlanQuincenalView.tsx`, `src/components/planning/PlanLapsoView.tsx` | M1 | IN_PROGRESS |
| M3 | Subsystem Pedagogical Grading (Procesal, Diagnóstica, Matriz Final) | `src/components/evaluation/ProcesalGradebookView.tsx`, `src/components/evaluation/DiagnosticView.tsx`, `src/components/evaluation/FinalLapsoView.tsx`, `src/components/evaluation/StatisticsChartsView.tsx`, `src/components/layout/AcademicPulseHero.tsx` | M1, M2 | PLANNED |
| M4 | Modular Boletines, Consultas, Gestión & Empty-State Robustness | `src/components/communication/boletines/` (`BoletinInicial.tsx`, `BoletinPrimaria.tsx`, `BoletinMediaGeneral.tsx`), `src/components/communication/BoletinInformativoView.tsx`, `src/components/gestion/TitulosBachillerView.tsx`, `src/components/communication/InstitutionalReportsView.tsx`, `src/components/consultas/ConsultasModule.tsx`, `src/components/layout/CommandSearchModal.tsx` | M2, M3 | PLANNED |
| M5 | Strict Types, Build Zero Errors & E2E Validation | Full codebase type checks, `: any` replacements, `npm run build` verification, madge circular check, 0-student startup test, dual login test | M1, M2, M3, M4 | PLANNED |

---

## Interface Contracts

### `EvaluationRecord` Contract (`src/types/index.ts`)
```typescript
export type QualitativeScore = 'L' | 'P' | 'EP' | 'I'; // Primaria: Logrado (L), Proceso (P / EP), Inicio (I)
export type LiteralScore = 'A' | 'B' | 'C' | 'D' | 'E'; // Inicial: Literales (A, B, C, D, E)

export interface EvaluationRecord {
  id: string;
  studentId: string;
  areaId: string;
  lapso: 1 | 2 | 3;
  type: EvaluationType;
  indicatorId?: string;
  scoreNumeric?: number;       // Exclusively for MEDIA_GENERAL (1..20)
  scoreQualitative?: QualitativeScore; // Exclusively for PRIMARIA (L, P/EP, I)
  scoreLiteral?: LiteralScore;         // Exclusively for INICIAL (A, B, C, D, E)
  roboticsScore?: RoboticsSpecialEvaluation;
  observations?: string;
  evaluationDate: string;
  evaluatorId: string;
  published?: boolean;
}
```

### `supabaseService.ts` Contract
```typescript
// Query functions must return [] when table exists and is empty, and null ONLY when network/query error occurs
export const supabaseFetchEvaluations = async (): Promise<EvaluationRecord[] | null> => { ... };
export const supabaseFetchStudents = async (): Promise<Student[] | null> => { ... };
export const supabaseFetchTitleRecords = async (): Promise<TitleRecord[] | null> => { ... };
```

### Boletin Dispatcher Contract
```typescript
// BoletinInformativoView mounts subsystem-specific components:
<BoletinInicial student={activeStudent} evaluations={studentEvaluations} areas={levelAreas} lapso={activeLapso} />
<BoletinPrimaria student={activeStudent} evaluations={studentEvaluations} areas={levelAreas} lapso={activeLapso} />
<BoletinMediaGeneral student={activeStudent} evaluations={studentEvaluations} areas={levelAreas} lapso={activeLapso} />
```

---

## Code Layout
- `src/types/index.ts`: Core data contracts and subsystem score definitions.
- `src/services/supabaseService.ts`: Cloud synchronization and query mappings.
- `src/context/AppContext.tsx`: Central application state and actions.
- `src/utils/rbac.ts`: Centralized authorization and role guards.
- `src/components/evaluation/`: Pedagogical grading modules (Procesal, Diagnóstica, Matriz Final, Estadísticas).
- `src/components/communication/boletines/`: Modular report cards per subsystem.
- `src/components/communication/`: Institutional reports and communication modules.
- `src/components/gestion/`: Administrative and academic management modules.
- `src/components/consultas/`: Student, parent, and performance portals.
