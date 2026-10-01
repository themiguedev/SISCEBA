# Equipo de Agentes de Desarrollo Continuo SICE-CBA

Este directorio formaliza los roles, especificaciones y directrices del equipo de subagentes autónomos diseñados para el desarrollo, auditoría y evolución de la plataforma **SICE-CBA**.

---

## 1. Agentes Definidos y Operativos

| Agente | Nombre de Invocación | Especialidad Principal | Archivo de Referencia |
|---|---|---|---|
| **Orquestador / Tech Lead** | `lead-architect` (o agente principal) | Planificación transversal, desglose de tareas complejas, revisión de diffs y despliegue Git (`SISCEBA`). | `GEMINI.md` |
| **Especialista Pedagógico y RBAC** | `pedagogical-rbac-specialist` | Lógica de evaluación curricular por subsistemas (Inicial, Primaria, Media General) y jerarquía de permisos institucionales. | [AGENT_PEDAGOGICAL_RBAC.md](./AGENT_PEDAGOGICAL_RBAC.md) |
| **Ingeniero de Datos y Supabase** | `supabase-data-engineer` | Esquemas PostgreSQL, RLS, sincronización `supabaseService.ts`, reactividad en `AppContext.tsx` y resiliencia ante datos vacíos. | [AGENT_SUPABASE_ENGINEER.md](./AGENT_SUPABASE_ENGINEER.md) |
| **Diseñador UI/UX e Impresión** | `print-ui-designer` | Ergonomía de interfaz en Tailwind CSS, calibración milimétrica para formatos físicos (Títulos de Bachiller, Boletines, Constancias). | [AGENT_PRINT_UI_DESIGNER.md](./AGENT_PRINT_UI_DESIGNER.md) |
| **Auditor de Calidad y Build** | `qa-build-auditor` | Análisis estático, tipado TypeScript estricto, compilación limpia (`npm run build`), optimización de tokens. | [AGENT_QA_BUILD_AUDITOR.md](./AGENT_QA_BUILD_AUDITOR.md) |

---

## 2. Protocolo de Invocación y Despacho

Cada agente puede ser invocado de forma aislada o en paralelo mediante el tool `invoke_subagent`.

### Ejemplo de Despacho
```typescript
invoke_subagent({
  Subagents: [
    {
      TypeName: "pedagogical-rbac-specialist",
      Role: "Auditor Pedagógico de Boletines",
      Prompt: "Verificar que la vista de Boletines para Educación Inicial no contenga campos numéricos ni promedios sobre 20."
    }
  ]
})
```

---

## 3. Matriz de Cobertura y Reglas Críticas Institucionales

1. **Educación Inicial**: Escala Literal (`A`, `B`, `C`, `D`, `E`). Jamás usar notas 01–20 ni promedios.
2. **Educación Primaria**: Escala Cualitativa (`L` [Logrado], `P`/`EP` [En Proceso], `I` [Iniciado]).
3. **Educación Media General**: Escala Vigesimal cuantitativa (`01` a `20`) con promedios y ponderaciones oficiales.
4. **Secciones Institucionales**: Únicamente secciones **`A`** y **`B`** en todos los niveles.
5. **Matrícula y Prosecución**: Acceso y ejecución exclusiva para el rol **`ADMINISTRADOR`**.
6. **Manejo Defensivo**: Todo componente que consulte estudiantes o registros debe renderizar estados vacíos informativos si la base de datos no contiene registros.
