# BRIEFING — 2026-09-22T08:48:00-04:00

## Mission
Implement Milestone 2: AppContext State, Empty-Table Resilience, Dual Auth & RBAC for SIS-CBA.

## 🔒 My Identity
- Archetype: worker
- Roles: implementer, qa, specialist
- Working directory: d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/worker_m2
- Original parent: 27c4d109-a063-44ea-9f3e-f19759f0319a
- Milestone: Milestone 2 (State, Empty Tables, Auth & RBAC)

## 🔒 Key Constraints
- Exclusive write access to:
  * src/context/AppContext.tsx
  * src/lib/supabaseClient.ts
  * src/utils/rbac.ts
  * src/components/planning/PlanQuincenalView.tsx
  * src/components/planning/PlanLapsoView.tsx
  * src/components/comunidad/ComunidadModule.tsx
- No hardcoded test bypasses or facades. Genuine logic throughout.
- Subsystem grading:
  * INICIAL: scoreLiteral (A, B, C, D, E)
  * PRIMARIA: scoreQualitative (L, P, EP, I)
  * MEDIA_GENERAL: scoreNumeric (01 a 20)
  * No numeric score leak into Inicial or Primaria.
- Build must pass (`npm run build` exits with code 0).

## Current Parent
- Conversation ID: 27c4d109-a063-44ea-9f3e-f19759f0319a
- Updated: not yet

## Task Summary
- **What to build**: Reorder hooks in AppContext (eliminate TDZ warnings), sync empty tables resiliently (`remoteX !== null`), dual authentication (username or institutional email) without password bypass, pedagogical grading update in `adjustStudentGrade`, expose `addStudent` & `saveStudent`, type-safe error handling in `supabaseClient.ts`, RBAC rules (`canApprovePlans`, `canPublishCommunity`) and apply them in Plan views and ComunidadModule.
- **Success criteria**: Zero compilation errors on `npm run build`, all tasks completely fulfilled, self-contained handoff report.
- **Interface contracts**: d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/orchestrator_1/PROJECT.md
- **Code layout**: d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/src/

## Key Decisions Made
- [TBD - will update as implementation begins]

## Artifact Index
- d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/worker_m2/DISPATCH.md — Assignment from orchestrator
- d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/worker_m2/progress.md — Liveness & step tracking
- d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/worker_m2/handoff.md — Final completion report

## Change Tracker
- **Files modified**: None yet
- **Build status**: Untested
- **Pending issues**: None

## Quality Status
- **Build/test result**: Untested
- **Lint status**: 0
- **Tests added/modified**: None yet

## Loaded Skills
None
