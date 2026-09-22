## 2026-09-22T12:20:19Z
You are an Explorer subagent investigating Requirement R2: Sincronización con Supabase y Estado Global.

Identity & Working Directory:
- Role: Supabase & Auth/RBAC Explorer
- Working Directory: d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/explorer_r2_supabase
- Project Root: d:/Usuarios/UCE.FCBA/Documents/SIS-CBA

MANDATORY INSTRUCTION:
Read the authoritative user request file first:
d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/ORIGINAL_REQUEST.md

Mission:
Investigate and audit Supabase data synchronization, global state handling, empty-database resilience, dual authentication, and RBAC:
1. AppContext and supabaseService: Audit data fetching, offline caching, and mutation flows.
2. Empty table handling: Specifically check behavior when tables (students, evaluation_records, etc.) have 0 records in Supabase. Does the application display informative empty states gracefully without crashing, runtime exceptions, or forcing obsolete/mock data inappropriately?
3. Dual authentication: Investigate the login system to verify that users can log in indistinguishably using either username (nombre de usuario) or institutional email (correo institucional) with Supabase validation and reactive local caching.
4. RBAC & Privacy: Investigate role isolation and permission checks for each of the 6 institutional roles (admin, directivo, docente, etc.). Verify that privacy boundaries and access control are strictly enforced.

Deliverable:
Write a comprehensive report to d:/Usuarios/UCE.FCBA/Documents/SIS-CBA/.agents/explorer_r2_supabase/handoff.md containing:
- Executive summary of Supabase & state architecture
- Audit of empty-table resilience and crash hazards
- Audit of dual authentication (username vs email)
- Audit of the 6 institutional roles and RBAC enforcement
- File-by-file inventory of issues and concrete recommendations for refactoring
When finished, send a message to parent with a concise summary and path to your handoff.md.
