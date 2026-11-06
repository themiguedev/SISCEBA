import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Indicator, LEVEL_GRADES_CATALOG } from '../../types';
import {
  Tag,
  Search,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  SpellCheck,
  Filter,
  Save,
  X,
  Sparkles,
  BookOpen,
  Layers,
  ArrowRight,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

// Correcciones ortográficas y acentuales frecuentes en el ámbito educativo venezolano
const COMMON_SPELL_FIXES: Record<string, string> = {
  evaluacion: 'evaluación',
  resolucion: 'resolución',
  matematica: 'matemática',
  matematicas: 'matemáticas',
  comprension: 'comprensión',
  lectoescritura: 'lectoescritura',
  ortografia: 'ortografía',
  redaccion: 'redacción',
  analisis: 'análisis',
  sintesis: 'síntesis',
  grafico: 'gráfico',
  graficos: 'gráficos',
  comunicacion: 'comunicación',
  informacion: 'información',
  participacion: 'participación',
  metodologia: 'metodología',
  practica: 'práctica',
  teoria: 'teoría',
  logico: 'lógico',
  artistica: 'artística',
  ingles: 'inglés',
  interes: 'interés',
  geometrico: 'geométrico',
  geometricos: 'geométricos',
  parrafo: 'párrafo',
  parrafos: 'párrafos',
  silaba: 'sílaba',
  silabas: 'sílabas',
  oracion: 'oración',
  oraciones: 'oraciones',
  operacion: 'operación',
  operaciones: 'operaciones',
  fraccion: 'fracción',
  fracciones: 'fracciones',
  calculo: 'cálculo',
  numeros: 'números',
  digito: 'dígito',
  digitos: 'dígitos'
};

// Verbos de acción formativos y observables recomendados para Primaria (3ra persona singular del presente indicativo)
const RECOMMENDED_ACTION_VERBS = [
  'Reconoce', 'Identifica', 'Describe', 'Explica', 'Interpreta', 'Resume', 'Ejemplifica',
  'Aplica', 'Calcula', 'Resuelve', 'Emplea', 'Construye', 'Demuestra', 'Ejecuta', 'Diseña',
  'Analiza', 'Clasifica', 'Compara', 'Relaciona', 'Sintetiza', 'Organiza', 'Contrasta',
  'Valora', 'Participa', 'Colabora', 'Respeta', 'Manifiesta', 'Propone', 'Practica',
  'Redacta', 'Lee', 'Distingue', 'Elabora', 'Expresa', 'Utiliza', 'Ubica', 'Mide'
];

export const CuraduriaPrimariaView: React.FC = () => {
  const { indicators, areas, updateIndicator, showToast } = useApp();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [filterIssueOnly, setFilterIssueOnly] = useState<boolean>(false);

  // Edit Modal State
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editInstrument, setEditInstrument] = useState('');

  // Áreas oficiales de Educación Primaria
  const primariaAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'PRIMARIA');
  }, [areas]);

  // Indicadores pertenecientes a Educación Primaria
  const primariaIndicators = useMemo(() => {
    return (indicators || []).filter(ind => ind.level === 'PRIMARIA');
  }, [indicators]);

  // Auditoría sintáctica, ortográfica y metodológica en tiempo real
  const auditIndicator = (desc: string) => {
    const trimmed = (desc || '').trim();
    const issues: string[] = [];

    if (!trimmed) {
      issues.push('La descripción del indicador no puede estar vacía.');
      return { status: 'ERROR', issues, hasIssues: true };
    }

    // 1. Mayúscula inicial obligatoria
    if (trimmed[0] !== trimmed[0].toUpperCase()) {
      issues.push('Debe iniciar con letra mayúscula.');
    }

    // 2. Punto final obligatorio
    if (!trimmed.endsWith('.')) {
      issues.push('Falta el punto final al término del criterio.');
    }

    // 3. Verbo inicial de acción en tercera persona
    const firstWord = trimmed.split(' ')[0].replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
    const startsWithActionVerb = RECOMMENDED_ACTION_VERBS.some(
      v => v.toLowerCase() === firstWord.toLowerCase()
    );
    if (!startsWithActionVerb) {
      issues.push(`Se recomienda iniciar con un verbo de acción observable para Primaria (ej. "${RECOMMENDED_ACTION_VERBS.slice(0, 4).join('", "')}").`);
    }

    // 4. Longitud adecuada para Educación Primaria
    if (trimmed.length < 25) {
      issues.push('El indicador es muy breve; especifique el contexto o criterio de logro esperado.');
    } else if (trimmed.length > 250) {
      issues.push('El indicador es excesivamente largo; procure una redacción sintética y puntual.');
    }

    // 5. Espacios dobles
    if (/\s{2,}/.test(trimmed)) {
      issues.push('Contiene espacios dobles consecutivos innecesarios.');
    }

    // 6. Palabras con falta de tilde frecuente
    const words = trimmed.toLowerCase().split(/\W+/);
    const misspelledWords: string[] = [];
    words.forEach(w => {
      if (COMMON_SPELL_FIXES[w]) {
        misspelledWords.push(`"${w}" -> "${COMMON_SPELL_FIXES[w]}"`);
      }
    });
    if (misspelledWords.length > 0) {
      issues.push(`Ortografía sugerida: ${misspelledWords.slice(0, 3).join(', ')}.`);
    }

    const hasIssues = issues.length > 0;
    return {
      status: hasIssues ? (issues.length > 2 ? 'ALERT' : 'WARNING') : 'OPTIMAL',
      issues,
      hasIssues
    };
  };

  // Filtrado de la lista
  const filteredList = useMemo(() => {
    return primariaIndicators.filter(ind => {
      const matchesArea = selectedAreaId === 'ALL' || ind.areaId === selectedAreaId;
      const matchesGrade = selectedGrade === 'ALL' || !ind.grade || ind.grade === selectedGrade;
      const matchesSearch =
        ind.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ind.description.toLowerCase().includes(searchTerm.toLowerCase());

      const audit = auditIndicator(ind.description);
      const matchesIssueFilter = !filterIssueOnly || audit.hasIssues;

      return matchesArea && matchesGrade && matchesSearch && matchesIssueFilter;
    });
  }, [primariaIndicators, selectedAreaId, selectedGrade, searchTerm, filterIssueOnly]);

  // Métricas generales
  const metrics = useMemo(() => {
    let optimalCount = 0;
    let issuesCount = 0;

    primariaIndicators.forEach(ind => {
      const a = auditIndicator(ind.description);
      if (a.hasIssues) issuesCount++;
      else optimalCount++;
    });

    const percent = primariaIndicators.length > 0
      ? Math.round((optimalCount / primariaIndicators.length) * 100)
      : 100;

    return { total: primariaIndicators.length, optimalCount, issuesCount, percent };
  }, [primariaIndicators]);

  // Iniciar edición
  const handleOpenEdit = (ind: Indicator) => {
    setEditingIndicator(ind);
    setEditCode(ind.code);
    setEditDescription(ind.description);
    setEditInstrument(ind.evaluationInstrument || 'Escala de Estimación Cualitativa');
  };

  // Aplicar corrección automática
  const handleAutoFix = () => {
    let text = editDescription.trim().replace(/\s{2,}/g, ' ');

    // 1. Mayúscula inicial
    if (text.length > 0) {
      text = text[0].toUpperCase() + text.slice(1);
    }

    // 2. Punto final
    if (text.length > 0 && !text.endsWith('.')) {
      text = text + '.';
    }

    // 3. Reemplazo de palabras con tilde faltante
    Object.keys(COMMON_SPELL_FIXES).forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      text = text.replace(regex, (match) => {
        // Mantener mayúscula si correspondía
        const replacement = COMMON_SPELL_FIXES[key.toLowerCase()];
        return match[0] === match[0].toUpperCase()
          ? replacement[0].toUpperCase() + replacement.slice(1)
          : replacement;
      });
    });

    setEditDescription(text);
    showToast('Corrección ortográfica y de formato aplicada.', 'info');
  };

  // Guardar cambios
  const handleSaveEdit = async () => {
    if (!editingIndicator) return;

    if (!editDescription.trim()) {
      showToast('La descripción del indicador no puede quedar vacía.', 'error');
      return;
    }

    const updated: Indicator = {
      ...editingIndicator,
      code: editCode.trim(),
      description: editDescription.trim(),
      evaluationInstrument: editInstrument.trim()
    };

    try {
      await updateIndicator(updated);
      showToast('Indicador de Primaria actualizado correctamente.', 'success');
      setEditingIndicator(null);
    } catch {
      showToast('Error al actualizar el indicador.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner de Cabecera y Métricas */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2C2E53] to-[#1E2038] text-[#D4AF37] flex items-center justify-center font-black shadow-md shrink-0 border border-[#D4AF37]/30">
            <SpellCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300">
                Auditoría Curricular Primaria
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                1er a 6to Grado CBA
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#2C2E53] dark:text-white mt-0.5">
              Revisión, Redacción y Ortografía de los Indicadores
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Curaduría editorial continua de los criterios formativos. Verificación de verbos observables en 3ra persona, acentuación gráfica, concordancia y coherencia con la escala cualitativa (L, A, P, I).
            </p>
          </div>
        </div>

        {/* Indicadores de Rendimiento Curador */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Calidad Editorial</div>
            <div className="text-2xl font-black text-[#2C2E53] dark:text-[#D4AF37] font-mono">
              {metrics.percent}%
            </div>
            <div className="text-[10px] text-slate-500">
              {metrics.optimalCount} de {metrics.total} óptimos
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-teal-500 flex items-center justify-center font-black text-xs text-teal-600 dark:text-teal-400 font-mono">
            {metrics.percent}%
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Búsqueda */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por código o redacción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2C2E53] dark:text-white"
            />
          </div>

          {/* Grado */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">Todos los Grados (1° a 6°)</option>
            {LEVEL_GRADES_CATALOG.PRIMARIA.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {/* Área */}
          <select
            value={selectedAreaId}
            onChange={(e) => setSelectedAreaId(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200 max-w-[220px]"
          >
            <option value="ALL">Todas las Áreas</option>
            {primariaAreas.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {/* Switch Solo con observaciones */}
        <button
          onClick={() => setFilterIssueOnly(!filterIssueOnly)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
            filterIssueOnly
              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Solo con observaciones ({metrics.issuesCount})</span>
        </button>
      </div>

      {/* Lista de Indicadores Curados */}
      {filteredList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-800 dark:text-white">
            No se encontraron indicadores con los criterios seleccionados
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Todos los indicadores cumplen con los parámetros de ortografía y redacción o no hay resultados para el filtro actual.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredList.map(ind => {
            const audit = auditIndicator(ind.description);
            const area = primariaAreas.find(a => a.id === ind.areaId);

            return (
              <div
                key={ind.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border transition hover:shadow-sm ${
                  audit.hasIssues
                    ? 'border-amber-300/80 dark:border-amber-700/60 bg-amber-500/[0.02]'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-[#2C2E53] text-[#D4AF37]">
                        {ind.code}
                      </span>
                      {ind.grade && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {ind.grade}
                        </span>
                      )}
                      {area && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300">
                          {area.name}
                        </span>
                      )}
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        audit.hasIssues
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      }`}>
                        {audit.hasIssues ? (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            <span>Observaciones detectadas</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Redacción Óptima</span>
                          </>
                        )}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-medium pt-1">
                      {ind.description}
                    </p>

                    {/* Lista de observaciones detectadas */}
                    {audit.hasIssues && (
                      <div className="mt-2.5 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-1">
                        <div className="text-[11px] font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Recomendaciones editoriales:</span>
                        </div>
                        <ul className="list-disc list-inside text-[11px] text-amber-900/90 dark:text-amber-200/90 space-y-0.5">
                          {audit.issues.map((iss, iIdx) => (
                            <li key={iIdx}>{iss}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-center gap-2 self-end sm:self-start">
                    <button
                      onClick={() => handleOpenEdit(ind)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#2C2E53] hover:text-[#D4AF37] text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar y Corregir</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Edición y Curaduría */}
      {editingIndicator && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-black">
                  <SpellCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Curaduría del Indicador
                  </h3>
                  <p className="text-xs text-slate-400">
                    Primaria CBA • {editingIndicator.grade || 'Todos los grados'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingIndicator(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                  Código Identificador
                </label>
                <input
                  type="text"
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold dark:text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                    Redacción y Criterio de Logro
                  </label>
                  <button
                    onClick={handleAutoFix}
                    className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Corregir Ortografía y Formato</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2C2E53] dark:text-white"
                />
              </div>

              {/* Sugerencias de verbos en 3ra persona */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Verbos de Acción Sugeridos (Haz clic para insertar):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  {RECOMMENDED_ACTION_VERBS.map(verb => (
                    <button
                      key={verb}
                      type="button"
                      onClick={() => {
                        const words = editDescription.trim().split(' ');
                        words[0] = verb;
                        setEditDescription(words.join(' '));
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-[#2C2E53] hover:text-[#D4AF37] font-semibold transition"
                    >
                      {verb}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                  Instrumento de Evaluación Sugerido
                </label>
                <input
                  type="text"
                  value={editInstrument}
                  onChange={(e) => setEditInstrument(e.target.value)}
                  placeholder="Escala de Estimación, Lista de Cotejo, Rúbrica..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingIndicator(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-2 text-xs font-black rounded-xl bg-[#2C2E53] hover:bg-[#1E2038] text-[#D4AF37] shadow-md flex items-center gap-1.5 transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Cambios Curados</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
