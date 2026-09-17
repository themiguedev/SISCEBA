import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIActionPlan } from '../../types';
import {
  ClipboardList,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BrainCircuit,
  FileEdit,
  Save,
  Printer,
  ChevronRight,
  Send,
  HelpCircle,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

export const AIActionPlansView: React.FC = () => {
  const {
    levelStudents,
    levelAreas,
    aiActionPlans,
    activeLapso,
    generateAIActionPlan,
    updateAIPlanFeedback
  } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<string>(aiActionPlans[0]?.id || '');
  const [selectedStudentForNew, setSelectedStudentForNew] = useState<string>(levelStudents[0]?.id || '');
  const [selectedAreaForNew, setSelectedAreaForNew] = useState<string>(levelAreas[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Plan
  const activePlan = aiActionPlans.find(p => p.id === selectedPlanId) || aiActionPlans[0];

  // Feedback form state
  const [feedbackNotes, setFeedbackNotes] = useState(activePlan?.teacherNotes || '');
  const [feedbackStatus, setFeedbackStatus] = useState<AIActionPlan['status']>(activePlan?.status || 'GENERADO');
  const [feedbackSavedToast, setFeedbackSavedToast] = useState(false);

  React.useEffect(() => {
    if (activePlan) {
      setFeedbackNotes(activePlan.teacherNotes);
      setFeedbackStatus(activePlan.status);
    }
  }, [selectedPlanId, activePlan]);

  const handleGenerateNew = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const created = generateAIActionPlan(selectedStudentForNew, selectedAreaForNew);
      setSelectedPlanId(created.id);
      setIsGenerating(false);
    }, 800);
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlan) return;
    updateAIPlanFeedback(activePlan.id, feedbackNotes, feedbackStatus);
    setFeedbackSavedToast(true);
    setTimeout(() => setFeedbackSavedToast(false), 3000);
  };

  const student = levelStudents.find(s => s.id === activePlan?.studentId);
  const area = levelAreas.find(a => a.id === activePlan?.areaId);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5 text-[#D4AF37]" />
              Acompañamiento Pedagógico Bellas Artes
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] mt-1">
            Planes de Acción Personalizados
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Generación automatizada de rutas de aprendizaje adaptativas y bucle de retroalimentación docente para superar dificultades académicas.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors no-print"
        >
          <Printer className="w-4 h-4" />
          Imprimir Plan
        </button>
      </div>

      {/* Generator Tool Bar */}
      <div className="bg-gradient-to-r from-[#2C2E53] to-[#1E203E] rounded-2xl p-5 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 no-print border border-[#414474]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#2C2E53] font-black flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm">Generador de Planes de Acción</h3>
            <p className="text-xs text-slate-300">
              Selecciona un estudiante y asignatura para diagnosticar brechas y generar recomendaciones didácticas individualizadas.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedStudentForNew}
            onChange={(e) => setSelectedStudentForNew(e.target.value)}
            aria-label="Seleccionar estudiante para generar plan"
            className="px-3 py-2 bg-[#1B1C33] rounded-xl border border-[#414474] text-xs font-bold text-white focus:outline-none"
          >
            {levelStudents.map(s => (
              <option key={s.id} value={s.id}>{s.fullName}</option>
            ))}
          </select>

          <select
            value={selectedAreaForNew}
            onChange={(e) => setSelectedAreaForNew(e.target.value)}
            aria-label="Seleccionar área de formación para generar plan"
            className="px-3 py-2 bg-[#1B1C33] rounded-xl border border-[#414474] text-xs font-bold text-white focus:outline-none"
          >
            {levelAreas.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          <button
            onClick={handleGenerateNew}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#c29f2e] text-[#1B1C33] font-black rounded-xl text-xs shadow-cba-gold transition-all"
          >
            {isGenerating ? (
              <span className="flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 animate-spin" /> Analizando brechas...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Generar Plan
              </span>
            )}
          </button>
        </div>
      </div>

      {feedbackSavedToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Retroalimentación del docente y estado del plan actualizados en el expediente del estudiante.
        </div>
      )}

      {/* Main Grid: Left Plan List, Right Plan Detail & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Generated Plans */}
        <div className="space-y-3 no-print">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block px-1">
            Expedientes de Planes ({aiActionPlans.length})
          </span>

          {aiActionPlans.map(plan => {
            const pStudent = levelStudents.find(s => s.id === plan.studentId);
            const pArea = levelAreas.find(a => a.id === plan.areaId);
            const isSelected = plan.id === activePlan?.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-[#2C2E53] shadow-md ring-2 ring-[#2C2E53]/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400">{plan.createdAt}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    plan.status === 'SUPERADO'
                      ? 'bg-emerald-100 text-emerald-800'
                      : plan.status === 'EN_APLICACION'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {plan.status}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-[#2C2E53] truncate">{pStudent?.fullName}</h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                  {pArea?.name} • Lapso {plan.lapso}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Detail Card */}
        {activePlan && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden">
              {/* Header */}
              <div className="bg-[#2C2E53] px-6 py-4 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-extrabold block">
                    Plan Pedagógico Individualizado
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-0.5">
                    {student?.fullName}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Área: {area?.name} • Lapso {activePlan.lapso} • Cédula: {student?.cedula}
                  </p>
                </div>
              </div>

              {/* Diagnosis Body */}
              <div className="p-6 space-y-5">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Diagnóstico Cognitivo Detectado por SICE-CBA
                  </h4>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed font-medium">
                    {activePlan.diagnosticSummary}
                  </p>
                </div>

                {/* Gaps identified */}
                <div>
                  <h4 className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Brechas Específicas Detectadas
                  </h4>
                  <div className="space-y-1.5">
                    {activePlan.identifiedGaps.map((gap, i) => (
                      <div key={i} className="text-xs text-slate-700 bg-red-50/40 p-2.5 rounded-lg border border-red-200/50 flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{gap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4-Phase Remedial Actions */}
                <div>
                  <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Ruta de Acción y Estrategias Recomendadas
                  </h4>
                  <div className="space-y-2">
                    {activePlan.recommendedPedagogicalActions.map((act, i) => (
                      <div key={i} className="text-xs text-slate-800 bg-emerald-50/40 p-3 rounded-xl border border-emerald-200/60 leading-relaxed font-medium">
                        {act}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Resources */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Recursos de Apoyo y Materiales Sugeridos
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    {activePlan.suggestedResources.map((res, i) => (
                      <li key={i}>{res}</li>
                    ))}
                  </ul>
                </div>

                {/* Teacher Feedback Loop Form */}
                <form onSubmit={handleSaveFeedback} className="pt-4 border-t border-slate-200 space-y-3 no-print">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-[#2C2E53] uppercase tracking-wide flex items-center gap-1.5">
                      <FileEdit className="w-4 h-4 text-[#D4AF37]" />
                      Retroalimentación y Seguimiento del Docente
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">Bucle de Supervisión Pedagógica</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Anotaciones y Acuerdos con el Estudiante / Representante *
                    </label>
                    <textarea
                      rows={3}
                      value={feedbackNotes}
                      onChange={(e) => setFeedbackNotes(e.target.value)}
                      placeholder="Registra avances, compromisos en entrevistas y adecuaciones del plan..."
                      className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#2C2E53]"
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <label className="text-xs font-bold text-slate-700">Estado del Plan:</label>
                      <select
                        value={feedbackStatus}
                        onChange={(e) => setFeedbackStatus(e.target.value as AIActionPlan['status'])}
                        className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-[#2C2E53]"
                      >
                        <option value="GENERADO">Generado</option>
                        <option value="EN_APLICACION">En Aplicación</option>
                        <option value="SUPERADO">Superado con Éxito</option>
                        <option value="REQUERIDO_INTERVENCION">Requiere Intervención Mayor</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2 bg-[#2C2E53] text-[#D4AF37] hover:bg-[#232543] font-black rounded-xl text-xs shadow-md transition-all w-full sm:w-auto justify-center"
                    >
                      <Save className="w-4 h-4" />
                      Guardar Retroalimentación
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
