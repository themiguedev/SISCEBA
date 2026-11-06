import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Indicator } from '../../types';
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
  ArrowRight
} from 'lucide-react';

export const CuraduriaIndicadoresView: React.FC = () => {
  const { indicators, levelAreas, updateIndicator, showToast } = useApp();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [filterStyleIssueOnly, setFilterStyleIssueOnly] = useState<boolean>(false);

  // Edit Modal State
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editInstrument, setEditInstrument] = useState('');

  // Verbos recomendados en 3ra persona singular para Educación Inicial (Modo Indicativo)
  const RECOMMENDED_VERBS = [
    'Reconoce', 'Identifica', 'Expresa', 'Clasifica', 'Utiliza', 'Participa',
    'Demuestra', 'Comunica', 'Manipula', 'Respeta', 'Muestra', 'Explora',
    'Construye', 'Describe', 'Distingue', 'Comparte', 'Ejecuta', 'Relaciona'
  ];

  // Filtrar indicadores pertenecientes a Educación Inicial
  const inicialIndicators = useMemo(() => {
    return indicators.filter(ind => ind.level === 'INICIAL');
  }, [indicators]);

  // Auditoría sintáctica y ortográfica en vivo
  const auditIndicator = (desc: string) => {
    const trimmed = desc.trim();
    const issues: string[] = [];

    if (!trimmed) {
      issues.push('La descripción está vacía.');
      return { status: 'ERROR', issues, hasIssues: true };
    }

    // 1. Mayúscula inicial
    if (trimmed[0] !== trimmed[0].toUpperCase()) {
      issues.push('Debe iniciar con letra mayúscula.');
    }

    // 2. Punto final
    if (!trimmed.endsWith('.')) {
      issues.push('Falta el punto final al término del indicador.');
    }

    // 3. Verbo inicial de acción
    const firstWord = trimmed.split(' ')[0].replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
    const startsWithActionVerb = RECOMMENDED_VERBS.some(
      v => v.toLowerCase() === firstWord.toLowerCase()
    );
    if (!startsWithActionVerb) {
      issues.push(`Se recomienda iniciar con un verbo de acción pedagógica (ej. "Reconoce", "Identifica", "Expresa").`);
    }

    // 4. Longitud adecuada
    if (trimmed.length < 25) {
      issues.push('El indicador es muy breve; especifique el contexto o criterio observable.');
    } else if (trimmed.length > 220) {
      issues.push('El indicador es excesivamente extenso; procure redactarlo de forma sintética.');
    }

    // 5. Espacios dobles
    if (/\s{2,}/.test(trimmed)) {
      issues.push('Contiene espacios dobles consecutivos innecesarios.');
    }

    const hasIssues = issues.length > 0;
    return {
      status: hasIssues ? (issues.length > 2 ? 'ALERT' : 'WARNING') : 'OPTIMAL',
      issues,
      hasIssues
    };
  };

  // Filtrado compuesto
  const filteredList = useMemo(() => {
    return inicialIndicators.filter(ind => {
      const matchesArea = selectedAreaId === 'ALL' || ind.areaId === selectedAreaId;
      const matchesGrade = selectedGrade === 'ALL' || !ind.grade || ind.grade === selectedGrade;
      const matchesSearch =
        ind.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ind.description.toLowerCase().includes(searchTerm.toLowerCase());

      const audit = auditIndicator(ind.description);
      const matchesIssueFilter = !filterStyleIssueOnly || audit.hasIssues;

      return matchesArea && matchesGrade && matchesSearch && matchesIssueFilter;
    });
  }, [inicialIndicators, selectedAreaId, selectedGrade, searchTerm, filterStyleIssueOnly]);

  // Métricas generales
  const metrics = useMemo(() => {
    let optimalCount = 0;
    let issuesCount = 0;

    inicialIndicators.forEach(ind => {
      const a = auditIndicator(ind.description);
      if (a.hasIssues) issuesCount++;
      else optimalCount++;
    });

    const percent = inicialIndicators.length > 0
      ? Math.round((optimalCount / inicialIndicators.length) * 100)
      : 100;

    return { total: inicialIndicators.length, optimalCount, issuesCount, percent };
  }, [inicialIndicators]);

  // Iniciar edición
  const handleOpenEdit = (ind: Indicator) => {
    setEditingIndicator(ind);
    setEditCode(ind.code);
    setEditDescription(ind.description);
    setEditInstrument(ind.evaluationInstrument || 'Escala de Estimación');
  };

  // Aplicar sugerencia de corrección automática
  const handleAutoFix = () => {
    let text = editDescription.trim().replace(/\s{2,}/g, ' ');
    if (text.length > 0) {
      text = text.charAt(0).toUpperCase() + text.slice(1);
      if (!text.endsWith('.')) {
        text += '.';
      }
    }
    setEditDescription(text);
  };

  // Guardar cambios
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIndicator || !editDescription.trim() || !editCode.trim()) return;

    const updated: Indicator = {
      ...editingIndicator,
      code: editCode.trim().toUpperCase(),
      description: editDescription.trim(),
      evaluationInstrument: editInstrument
    };

    updateIndicator(updated);
    showToast(
      'Indicador Actualizado',
      `Se ha guardado la curaduría del indicador ${updated.code} exitosamente.`
    );
    setEditingIndicator(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner Informativo */}
      <div className="bg-gradient-to-r from-[#2C2E53] via-[#1E2038] to-[#141525] rounded-2xl p-6 text-white shadow-md border border-[#3D4066] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-900">
              Curaduría de Criterios
            </span>
            <span className="text-xs text-amber-200/90 font-medium">Educación Inicial</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <SpellCheck className="w-6 h-6 text-[#D4AF37]" />
            Revisión, Redacción y Ortografía de los Indicadores
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Herramienta institucional para auditar la precisión sintáctica, claridad pedagógica, concordancia y calidad ortográfica de los indicadores de evaluación de Inicial.
          </p>
        </div>

        {/* Métricas rápidas */}
        <div className="grid grid-cols-3 gap-2 bg-white/10 p-3 rounded-xl border border-white/10 text-center shrink-0">
          <div>
            <div className="text-lg font-black text-white">{metrics.total}</div>
            <div className="text-[10px] text-slate-300 font-semibold uppercase">Total</div>
          </div>
          <div>
            <div className="text-lg font-black text-emerald-400">{metrics.optimalCount}</div>
            <div className="text-[10px] text-emerald-200 font-semibold uppercase">Óptimos</div>
          </div>
          <div>
            <div className="text-lg font-black text-amber-300">{metrics.percent}%</div>
            <div className="text-[10px] text-amber-200 font-semibold uppercase">Calidad</div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Buscador */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código (ej. IND-01) o palabra clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
          />
        </div>

        {/* Filtro de Sala */}
        <div className="flex items-center gap-2">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
          >
            <option value="ALL">Todas las Salas</option>
            <option value="Sala de 4 Años">Sala de 4 Años</option>
            <option value="Sala de 5 Años">Sala de 5 Años</option>
          </select>

          {/* Filtro de Área */}
          <select
            value={selectedAreaId}
            onChange={(e) => setSelectedAreaId(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
          >
            <option value="ALL">Todas las Áreas</option>
            {levelAreas.map(area => (
              <option key={area.id} value={area.id}>{area.name}</option>
            ))}
          </select>

          {/* Switch: Solo con observaciones */}
          <button
            type="button"
            onClick={() => setFilterStyleIssueOnly(!filterStyleIssueOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shrink-0 ${
              filterStyleIssueOnly
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{filterStyleIssueOnly ? 'Mostrando con Observaciones' : 'Solo con Observaciones'}</span>
          </button>
        </div>
      </div>

      {/* Lista de Indicadores con Tarjetas de Auditoría */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              No se encontraron indicadores con los filtros actuales
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Todos los indicadores seleccionados cumplen con los criterios de redacción y ortografía.
            </p>
          </div>
        ) : (
          filteredList.map((ind) => {
            const audit = auditIndicator(ind.description);
            const area = levelAreas.find(a => a.id === ind.areaId);

            return (
              <div
                key={ind.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Contenido principal */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-[#2C2E53] text-[#D4AF37]">
                      {ind.code}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {area?.name || 'Educación Inicial'}
                    </span>
                    {ind.grade && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                        {ind.grade}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">
                      Lapso {ind.lapso || 1} • {ind.evaluationInstrument || 'Escala de Estimación'}
                    </span>
                  </div>

                  <p className="text-sm text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                    {ind.description}
                  </p>

                  {/* Estado de auditoría */}
                  {audit.hasIssues ? (
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-2.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Sugerencias de Redacción y Ortografía:</span>
                      </div>
                      <ul className="text-xs text-amber-900 dark:text-amber-200 list-disc list-inside space-y-0.5 pl-1">
                        {audit.issues.map((iss, i) => (
                          <li key={i}>{iss}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Redacción y ortografía óptima</span>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleOpenEdit(ind)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#2C2E53] text-[#D4AF37] hover:bg-[#1E2038] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar y Corregir</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Curaduría y Edición */}
      {editingIndicator && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <SpellCheck className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-base sm:text-lg font-black text-[#2C2E53] dark:text-white">
                  Curaduría del Indicador: {editingIndicator.code}
                </h3>
              </div>
              <button
                onClick={() => setEditingIndicator(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Código del Indicador
                </label>
                <input
                  type="text"
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Descripción del Criterio Observable
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoFix}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-corregir estilo (Mayúscula y punto)</span>
                  </button>
                </div>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  placeholder="Ej: Reconoce y nombra los colores primarios (amarillo, azul y rojo) al pintar libremente."
                  required
                />
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                  <span>Caracteres: {editDescription.length} (Recomendado: 40 - 180)</span>
                  <span>Modo: Educación Inicial</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Instrumento de Evaluación
                </label>
                <select
                  value={editInstrument}
                  onChange={(e) => setEditInstrument(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                >
                  <option value="Escala de Estimación">Escala de Estimación</option>
                  <option value="Lista de Cotejo">Lista de Cotejo</option>
                  <option value="Registro Anecdótico">Registro Anecdótico</option>
                  <option value="Guía de Observación de Aula">Guía de Observación de Aula</option>
                </select>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingIndicator(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#2C2E53] text-[#D4AF37] hover:bg-[#1E2038] shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
