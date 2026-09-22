# Orchestrator Execution Plan: SICE-CBA System Audit & Refactoring

## Objectives
Execute an end-to-end audit and refactoring of the SICE-CBA institutional academic system covering:
1. R1: Lógica de Calificaciones y Separación por Subsistemas (Inicial: L/EP/I, Primaria: A-E, Media General: 01-20).
2. R2: Sincronización con Supabase y Estado Global (empty table resilience, dual authentication user/email, RBAC for 6 roles).
3. R3: Consistencia Estricta de TypeScript y Compilación Limpia (zero errors on npm run build, zero circular dependencies, pristine types in src/types/index.ts).

## Phases

### Phase 0: Survey & Codebase Exploration
- Spawn 3 parallel Explorers:
  - Explorer 1: R1 Grading logic, subsystem separation, terminology unification (L/EP/I vs A-E vs 01-20), report components (Consultas, Registro Procesal, Diagnóstica, Matriz Final, Boletines).
  - Explorer 2: R2 Supabase sync, AppContext, empty-table handling, dual login (username/email), RBAC for 6 roles.
  - Explorer 3: R3 TypeScript type definitions (src/types/index.ts), build status, circular dependencies, broken imports, type safety.

### Phase 1: PROJECT.md Finalization & Feature Inventory
- Merge explorer findings into `PROJECT.md` at `.agents/orchestrator_1/PROJECT.md`.
- Ensure every inventoried feature is mapped to a discrete milestone.

### Phase 2: Implementation & Verification Milestones
- Execute milestones with Worker -> Reviewer(s) -> Challenger(s) -> Auditor loop.
- Enforce strict gate passing (clean audit, approval from reviewers and challengers, zero build errors).

### Phase 3: Adversarial Hardening & Acceptance Criteria Validation
- Verify empty table startup (0 students).
- Verify dual authentication for all 6 roles.
- Verify zero numeric grades in Inicial.
- Run full build and test suites.

### Phase 4: Synthesis & Final Victory Report
- Synthesize all findings and gate verifications.
- Deliver comprehensive victory report to sentinel/user.
