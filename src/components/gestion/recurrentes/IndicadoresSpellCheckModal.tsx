import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { EducationalLevel, Indicator } from '../../../types';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Search,
  Filter,
  Save,
  Wand2,
  X,
  FileCheck2,
  HelpCircle
} from 'lucide-react';

interface IndicadoresSpellCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLevel?: EducationalLevel;
}

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
  interes: 'interés'
};

const SUGGESTED_ACTION_VERBS = [
  'Reconoce', 'Identifica', 'Describe', 'Compara', 'Clasifica',
  'Aplica', 'Calcula', 'Resuelve', 'Analiza', 'Explica',
  'Formula', 'Construye', 'Demuestra', 'Propone', 'Valora',
  'Expresa', 'Distingue', 'Ejecuta', 'Elabora', 'Participa'
];

export const IndicadoresSpellCheckModal: React.FC<IndicadoresSpellCheckModalProps> = ({
  isOpen,
  onClose,
  initialLevel = 'INICIAL'
}) => {
  const { indicators, areas, updateIndicator } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<EducationalLevel>(initialLevel);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('TODAS');
  const [filterIssueOnly, setFilterIssueOnly] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editedDescriptions, setEditedDescriptions] = useState<Record<string, string>>({});
  const [savedAlertId, setSavedAlertId] = useState<string | null>(null);

  const levelAreas = useMemo(() => {
    return areas.filter(a => a.level === selectedLevel);
  }, [areas, selectedLevel]);

  const levelIndicators = useMemo(() => {
    return indicators.filter(i => i.level === selectedLevel);
  }, [indicators, selectedLevel]);

  // Auditoría automática de cada indicador
  const auditAnalysis = useMemo(() => {
    return levelIndicators.map(ind => {
      const desc = (editedDescriptions[ind.id] !== undefined ? editedDescriptions[ind.id] : ind.description) || '';
      const issues: string[] = [];
      const fixes: { word: string; suggestion: string }[] = [];

      // 1. Verificación de mayúscula inicial
      if (desc.length > 0 && desc[0] !== desc[0].toUpperCase()) {
        issues.push('Debe iniciar con letra mayúscula.');
      }

      // 2. Verificación de punto final
      if (desc.length > 0 && !desc.trim().endsWith('.')) {
        issues.push('Debe finalizar con punto (.)');
      }

      // 3. Verbo inicial de acción
      const firstWord = desc.trim().split(/\s+/)[0] || '';
      const cleanFirstWord = firstWord.replace(/[,;.:]/g, '');
      const hasActionVerb = SUGGESTED_ACTION_VERBS.some(
        v => v.toLowerCase() === cleanFirstWord.toLowerCase()
      );
      if (!hasActionVerb && cleanFirstWord.length > 0) {
        issues.push(`Verbo inicial inusual (${cleanFirstWord}). Se recomienda usar verbos pedagógicos observables (ej: Identifica, Aplica, Demuestra).`);
      }

      // 4. Verificación ortográfica por diccionario
      const words = desc.split(/\s+/);
      words.forEach(w => {
        const clean = w.toLowerCase().replace(/[^a-záéíóúüñ]/g, '');
        if (COMMON_SPELL_FIXES[clean]) {
          fixes.push({ word: clean, suggestion: COMMON_SPELL_FIXES[clean] });
          issues.push(`Falta tilde ortográfica en "${clean}" (sugerido: "${COMMON_SPELL_FIXES[clean]}").`);
        }
      });

      // 5. Longitud
      if (desc.trim().length < 15) {
        issues.push('La redacción es muy breve para un indicador observable.');
      }

      return {
        indicator: ind,
        issues,
        fixes,
        hasIssues: issues.length > 0
      };
    });
  }, [levelIndicators, editedDescriptions]);

  const filteredItems = useMemo(() => {
    return auditAnalysis.filter(item => {
      if (selectedAreaId !== 'TODAS' && item.indicator.areaId !== selectedAreaId) return false;
      if (filterIssueOnly && !item.hasIssues) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const code = (item.indicator.code || '').toLowerCase();
        const desc = (item.indicator.description || '').toLowerCase();
        if (!code.includes(term) && !desc.includes(term)) return false;
      }
      return true;
    });
  }, [auditAnalysis, selectedAreaId, filterIssueOnly, searchTerm]);

  const handleApplyAutoFix = (indId: string, currentDesc: string, fixes: { word: string; suggestion: string }[]) => {
    let fixed = currentDesc.trim();
    // Corregir mayúscula
    if (fixed.length > 0) {
      fixed = fixed.charAt(0).toUpperCase() + fixed.slice(1);
    }
    // Corregir palabras sin tilde
    fixes.forEach(f => {
      const reg = new RegExp(`\\b${f.word}\\b`, 'gi');
      fixed = fixed.replace(reg, f.suggestion);
    });
    // Agregar punto final
    if (!fixed.endsWith('.')) {
      fixed += '.';
    }
    setEditedDescriptions(prev => ({ ...prev, [indId]: fixed }));
  };

  const handleSaveIndicator = (indicator: Indicator) => {
    const newDesc = editedDescriptions[indicator.id] !== undefined ? editedDescriptions[indicator.id] : indicator.description;
    updateIndicator({
      ...indicator,
      description: newDesc.trim()
    });
    setSavedAlertId(indicator.id);
    setTimeout(() => setSavedAlertId(null), 2500);
  };

  if (!isOpen) return null;

  const totalWithIssues = auditAnalysis.filter(a => a.hasIssues).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#2C2E53] p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl text-[#D4AF37] border border-white/10">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Auditor de Redacción y Ortografía de Indicadores
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#1B1C33] font-bold">
                  {selectedLevel.replace('_', ' ')}
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Revisión pedagógica, coherencia de verbos observables y corrección sintáctica/ortográfica.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Level Selector */}
            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['INICIAL', 'PRIMARIA', 'MEDIA_GENERAL'] as EducationalLevel[]).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedLevel(lvl);
                    setSelectedAreaId('TODAS');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedLevel === lvl
                      ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {lvl === 'MEDIA_GENERAL' ? 'Media General' : lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Area Filter */}
            <select
              value={selectedAreaId}
              onChange={e => setSelectedAreaId(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
            >
              <option value="TODAS">Todas las Asignaturas ({levelAreas.length})</option>
              {levelAreas.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>

            {/* Filter Issues Only */}
            <button
              onClick={() => setFilterIssueOnly(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                filterIssueOnly
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Solo con Observaciones ({totalWithIssues})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar indicador o código..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
            />
          </div>
        </div>

        {/* Indicators List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-75" />
              <p className="font-bold text-sm text-slate-600 dark:text-slate-300">
                No se encontraron indicadores con los filtros seleccionados
              </p>
              <p className="text-xs">
                Todos los indicadores del nivel cumplen con los criterios o no coinciden con la búsqueda.
              </p>
            </div>
          ) : (
            filteredItems.map(({ indicator, issues, fixes, hasIssues }) => {
              const currentDesc = editedDescriptions[indicator.id] !== undefined
                ? editedDescriptions[indicator.id]
                : indicator.description;
              const area = areas.find(a => a.id === indicator.areaId);

              return (
                <div
                  key={indicator.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    hasIssues
                      ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 shadow-sm'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-[#2C2E53] text-[#D4AF37]">
                        {indicator.code}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {area?.name || 'Área no asignada'}
                      </span>
                      {indicator.grade && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {indicator.grade}
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-bold">
                        Lapso {indicator.lapso}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasIssues && fixes.length > 0 && (
                        <button
                          onClick={() => handleApplyAutoFix(indicator.id, currentDesc, fixes)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Auto-Corregir
                        </button>
                      )}
                      <button
                        onClick={() => handleSaveIndicator(indicator)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] transition shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Guardar
                      </button>
                    </div>
                  </div>

                  {/* Textarea for Direct Editing */}
                  <textarea
                    rows={2}
                    value={currentDesc}
                    onChange={e => setEditedDescriptions(prev => ({ ...prev, [indicator.id]: e.target.value }))}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  />

                  {/* Feedback / Issues Alerts */}
                  {hasIssues ? (
                    <div className="mt-2.5 space-y-1">
                      {issues.map((issue, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-400">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Redacción y ortografía conformes a estándares pedagógicos.
                    </div>
                  )}

                  {savedAlertId === indicator.id && (
                    <div className="mt-2 text-xs font-bold text-emerald-600 animate-in fade-in flex items-center gap-1">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      ¡Indicador guardado correctamente!
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div>
            Total auditados: <strong>{levelIndicators.length}</strong> | Con observaciones: <strong>{totalWithIssues}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition"
          >
            Cerrar Auditor
          </button>
        </div>

      </div>
    </div>
  );
};
