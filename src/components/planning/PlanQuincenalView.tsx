import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlanQuincenal, PlanStatus } from '../../types';
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Send,
  Eye,
  Layers,
  Sparkles,
  Printer,
  Clock,
  Check,
  MessageSquare,
  FileCheck
} from 'lucide-react';

export const PlanQuincenalView: React.FC = () => {
  const {
    levelAreas,
    competencies,
    indicators,
    plansQuincenal,
    currentLevel,
    currentRole,
    activeLapso,
    currentSection,
    savePlanQuincenal,
    updateQuincenalStatus
  } = useApp();

  const levelPlans = plansQuincenal.filter(p => p.level === currentLevel);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(levelPlans[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);

  // Active Plan
  const activePlan = levelPlans.find(p => p.id === selectedPlanId) || levelPlans[0];

  // Form State for Editing/Creating
  const [editTitle, setEditTitle] = useState(activePlan?.title || '');
  const [editProject, setEditProject] = useState(activePlan?.projectTheme || '');
  const [editStartDate, setEditStartDate] = useState(activePlan?.startDate || '2026-10-01');
  const [editEndDate, setEditEndDate] = useState(activePlan?.endDate || '2026-10-15');
  const [editActivities, setEditActivities] = useState(activePlan?.pedagogicalActivities || '');
  const [editDifferentiation, setEditDifferentiation] = useState(activePlan?.differentiationNotes || '');
  const [editAreaId, setEditAreaId] = useState(activePlan?.areaId || levelAreas[0]?.id || '');
  const [selectedCompIds, setSelectedCompIds] = useState<string[]>(activePlan?.competencyIds || []);
  const [selectedIndIds, setSelectedIndIds] = useState<string[]>(activePlan?.indicatorIds || []);

  // Feedback State for Coordinator
  const [coordinationNote, setCoordinationNote] = useState('');

  // Update form when activePlan changes
  React.useEffect(() => {
    if (activePlan) {
      setEditTitle(activePlan.title);
      setEditProject(activePlan.projectTheme || '');
      setEditStartDate(activePlan.startDate);
      setEditEndDate(activePlan.endDate);
      setEditActivities(activePlan.pedagogicalActivities);
      setEditDifferentiation(activePlan.differentiationNotes);
      setEditAreaId(activePlan.areaId);
      setSelectedCompIds(activePlan.competencyIds);
      setSelectedIndIds(activePlan.indicatorIds);
    }
  }, [selectedPlanId]);

  const handleCreateNew = () => {
    const newPlan: PlanQuincenal = {
      id: `pq-${Date.now()}`,
      areaId: levelAreas[0]?.id || '',
      level: currentLevel,
      gradeSection: currentSection,
      lapso: activeLapso,
      startDate: '2026-10-16',
      endDate: '2026-10-31',
      title: `Plan Quincenal - ${levelAreas[0]?.name || ''}`,
      projectTheme: 'Proyecto de Integración y Aprendizaje',
      status: 'BORRADOR',
      competencyIds: [],
      indicatorIds: [],
      teachingStrategyIds: [],
      evaluationStrategyIds: [],
      pedagogicalActivities: 'Secuencia didáctica preliminar...',
      differentiationNotes: 'Atención a la diversidad...',
      updatedAt: new Date().toISOString().split('T')[0]
    };
    savePlanQuincenal(newPlan);
    setSelectedPlanId(newPlan.id);
    setIsEditing(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlan) return;

    const updated: PlanQuincenal = {
      ...activePlan,
      title: editTitle,
      projectTheme: editProject,
      areaId: editAreaId,
      startDate: editStartDate,
      endDate: editEndDate,
      pedagogicalActivities: editActivities,
      differentiationNotes: editDifferentiation,
      competencyIds: selectedCompIds,
      indicatorIds: selectedIndIds
    };

    savePlanQuincenal(updated);
    setIsEditing(false);
  };

  const availableComps = competencies.filter(c => c.areaId === editAreaId && c.level === currentLevel);
  const availableInds = indicators.filter(i => i.areaId === editAreaId && i.level === currentLevel);

  const toggleComp = (id: string) => {
    setSelectedCompIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleInd = (id: string) => {
    setSelectedIndIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const currentArea = levelAreas.find(a => a.id === (isEditing ? editAreaId : activePlan?.areaId));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] uppercase tracking-wider">
              Ciclo Didáctico Quincenal
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] mt-1">
            Gestión de Plan Quincenal ({currentLevel.replace('_', ' ')})
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Flujo de elaboración docente, revisión pedagógica institucional y aprobación a Modelo Definitivo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#c29f2e] text-[#1B1C33] font-black rounded-xl text-xs shadow-cba-gold transition-all"
          >
            <Calendar className="w-4 h-4" />
            Crear Nueva Quincena
          </button>
        </div>
      </div>

      {/* Plan Selector Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {levelPlans.map((plan) => {
          const isSelected = plan.id === activePlan?.id;
          const statusColors: Record<PlanStatus, { bg: string; text: string; border: string }> = {
            BORRADOR: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
            A_REVISION: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' },
            DEFINITIVO: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' }
          };
          const badge = statusColors[plan.status];

          return (
            <button
              key={plan.id}
              onClick={() => {
                setSelectedPlanId(plan.id);
                setIsEditing(false);
              }}
              className={`p-3.5 rounded-2xl border text-left min-w-[260px] transition-all shrink-0 ${
                isSelected
                  ? 'bg-white border-[#2C2E53] shadow-md ring-2 ring-[#2C2E53]/20'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400">
                  {plan.startDate} al {plan.endDate}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                  {plan.status === 'DEFINITIVO' ? '✓ Definitivo' : plan.status === 'A_REVISION' ? '⌛ A Revisión' : '✎ Borrador'}
                </span>
              </div>
              <h4 className="font-extrabold text-xs text-[#2C2E53] truncate">{plan.title}</h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {levelAreas.find(a => a.id === plan.areaId)?.name || 'Área'}
              </p>
            </button>
          );
        })}
      </div>

      {activePlan ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden">
          {/* Status and Action Ribbon */}
          <div className="bg-[#2C2E53] px-6 py-4 text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#2C2E53] font-black flex items-center justify-center">
                15D
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white">{activePlan.title}</h3>
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    activePlan.status === 'DEFINITIVO'
                      ? 'bg-emerald-500 text-white'
                      : activePlan.status === 'A_REVISION'
                      ? 'bg-[#D4AF37] text-[#2C2E53]'
                      : 'bg-slate-600 text-slate-200'
                  }`}>
                    {activePlan.status === 'DEFINITIVO' ? 'MODELO DEFINITIVO' : activePlan.status === 'A_REVISION' ? 'EN REVISIÓN PEDAGÓGICA' : 'BORRADOR EN PROCESO'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Período: {activePlan.startDate} al {activePlan.endDate} • Sección: {activePlan.gradeSection} • Lapso {activePlan.lapso}
                </p>
              </div>
            </div>

            {/* Workflow Transition Buttons */}
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    Editar Plan
                  </button>

                  {/* Send to Revision (Docente action) */}
                  {activePlan.status === 'BORRADOR' && (
                    <button
                      onClick={() => updateQuincenalStatus(activePlan.id, 'A_REVISION')}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D4AF37] text-[#2C2E53] font-black rounded-xl text-xs shadow-cba-gold hover:bg-[#c29f2e] transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Enviar a Revisión
                    </button>
                  )}

                  {/* Coordinator Actions */}
                  {activePlan.status === 'A_REVISION' && (currentRole === 'COORDINACION' || currentRole === 'DOCENTE') && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const note = prompt('Observaciones para el docente:', 'Requiere ajuste en la dosificación...');
                          if (note !== null) updateQuincenalStatus(activePlan.id, 'BORRADOR', note);
                        }}
                        className="px-3 py-1.5 bg-red-500/20 text-red-200 border border-red-400/30 hover:bg-red-500/30 font-bold rounded-xl text-xs transition-colors"
                      >
                        Solicitar Ajustes
                      </button>
                      <button
                        onClick={() => updateQuincenalStatus(activePlan.id, 'DEFINITIVO')}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-xs shadow-md transition-all"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        Aprobar Definitivo
                      </button>
                    </div>
                  )}

                  {activePlan.status === 'DEFINITIVO' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4" /> Aprobado Oficialmente
                    </span>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Cancelar Edición
                </button>
              )}
            </div>
          </div>

          {/* Coordinator Feedback Alert Banner */}
          {activePlan.reviewFeedback && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-900 block">
                  Retroalimentación de la Coordinación Pedagógica:
                </span>
                <p className="text-xs text-amber-800 mt-0.5">{activePlan.reviewFeedback}</p>
              </div>
            </div>
          )}

          {/* Content Body: Read or Edit Mode */}
          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-6">
                {/* General Info Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">Área de Formación</span>
                    <span className="text-sm font-extrabold text-[#2C2E53] mt-0.5 block">
                      {currentArea?.name} ({currentArea?.code})
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">Proyecto de Aprendizaje</span>
                    <span className="text-sm font-semibold text-slate-700 mt-0.5 block">
                      {activePlan.projectTheme || 'Proyecto de Formación Continua'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">Supervisión Oficial</span>
                    <span className="text-xs font-semibold text-slate-600 mt-0.5 block">
                      {activePlan.reviewedBy || 'Pendiente de firma de coordinación'}
                    </span>
                  </div>
                </div>

                {/* Selected Competencies & Indicators */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-[#2C2E53] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    Competencias e Indicadores de la Quincena
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <span className="text-xs font-bold text-slate-500 uppercase block">
                        Competencias Vinculadas ({activePlan.competencyIds.length})
                      </span>
                      {activePlan.competencyIds.map(cid => {
                        const comp = competencies.find(c => c.id === cid);
                        return comp ? (
                          <div key={comp.id} className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="font-bold text-[#2C2E53] mr-1">[{comp.code}]</span>
                            {comp.title}
                          </div>
                        ) : null;
                      })}
                      {activePlan.competencyIds.length === 0 && (
                        <p className="text-xs text-slate-400 italic">No se han asociado competencias aún.</p>
                      )}
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <span className="text-xs font-bold text-slate-500 uppercase block">
                        Indicadores de Logro Evaluables ({activePlan.indicatorIds.length})
                      </span>
                      {activePlan.indicatorIds.map(iid => {
                        const ind = indicators.find(i => i.id === iid);
                        return ind ? (
                          <div key={ind.id} className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="font-bold text-[#2C2E53] mr-1">[{ind.code}]</span>
                            {ind.description}
                          </div>
                        ) : null;
                      })}
                      {activePlan.indicatorIds.length === 0 && (
                        <p className="text-xs text-slate-400 italic">No se han asociado indicadores aún.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pedagogical Sequence */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-[#2C2E53]">
                    Secuencia Didáctica y Actividades Planificadas
                  </h4>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                    {activePlan.pedagogicalActivities}
                  </div>
                </div>

                {/* Differentiation & Inclusion */}
                {activePlan.differentiationNotes && (
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-sm text-[#2C2E53]">
                      Adaptaciones Curriculares y Atención a la Diversidad
                    </h4>
                    <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-200/50 text-xs text-slate-700 leading-relaxed">
                      {activePlan.differentiationNotes}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Edit Form */
              <form onSubmit={handleSaveForm} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Título del Plan Quincenal *</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#2C2E53]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tema del Proyecto de Aprendizaje</label>
                    <input
                      type="text"
                      value={editProject}
                      onChange={(e) => setEditProject(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#2C2E53]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Área de Formación *</label>
                    <select
                      value={editAreaId}
                      onChange={(e) => setEditAreaId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#2C2E53]"
                    >
                      {levelAreas.map(a => (
                        <option key={a.id} value={a.id}>{a.name} ({a.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Inicio *</label>
                    <input
                      type="date"
                      value={editStartDate}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#2C2E53]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Culminación *</label>
                    <input
                      type="date"
                      value={editEndDate}
                      onChange={(e) => setEditEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#2C2E53]"
                      required
                    />
                  </div>
                </div>

                {/* Selection of Competencies and Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 p-3 rounded-xl">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Seleccionar Competencias de la Quincena ({availableComps.length} disponibles)
                    </label>
                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                      {availableComps.map(c => (
                        <label key={c.id} className="flex items-start gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={selectedCompIds.includes(c.id)}
                            onChange={() => toggleComp(c.id)}
                            className="mt-0.5 rounded text-[#2C2E53]"
                          />
                          <span>
                            <strong className="text-[#2C2E53]">{c.code}:</strong> {c.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border border-slate-200 p-3 rounded-xl">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Seleccionar Indicadores de Logro ({availableInds.length} disponibles)
                    </label>
                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                      {availableInds.map(i => (
                        <label key={i.id} className="flex items-start gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={selectedIndIds.includes(i.id)}
                            onChange={() => toggleInd(i.id)}
                            className="mt-0.5 rounded text-[#2C2E53]"
                          />
                          <span>
                            <strong className="text-[#2C2E53]">{i.code}:</strong> {i.description}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Secuencia de Actividades Pedagógicas *
                  </label>
                  <textarea
                    rows={4}
                    value={editActivities}
                    onChange={(e) => setEditActivities(e.target.value)}
                    placeholder="Desglosa las actividades de inicio, desarrollo y cierre..."
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2C2E53]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Atención a la Diversidad y Diferenciación
                  </label>
                  <textarea
                    rows={2}
                    value={editDifferentiation}
                    onChange={(e) => setEditDifferentiation(e.target.value)}
                    placeholder="Estrategias de apoyo para estudiantes con ritmos de aprendizaje particulares..."
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2C2E53]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-xs font-black bg-[#2C2E53] text-[#D4AF37] hover:bg-[#232543] rounded-xl shadow-md"
                  >
                    Guardar Cambios del Plan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-600 font-bold">No hay planes quincenales para este nivel.</p>
          <button
            onClick={handleCreateNew}
            className="mt-3 px-4 py-2 bg-[#D4AF37] text-[#1B1C33] font-black text-xs rounded-xl shadow-cba-gold"
          >
            Crear el primer plan quincenal
          </button>
        </div>
      )}
    </div>
  );
};
