import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RemedialActionPlan, Student } from '../../types';
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  Printer,
  Sparkles,
  UserCheck,
  Zap
} from 'lucide-react';

export const RemedialInterventionView: React.FC = () => {
  const {
    levelStudents,
    levelAreas,
    currentLevel,
    remedialPlans,
    addRemedialPlan,
    updateRemedialStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState<'REVISION' | 'MATERIA_PENDIENTE'>('MATERIA_PENDIENTE');
  const [selectedRemedialId, setSelectedRemedialId] = useState<string>(remedialPlans[0]?.id || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Remedial Plan Form
  const [newStudentId, setNewStudentId] = useState(levelStudents[0]?.id || '');
  const [newSubject, setNewSubject] = useState('Física (3er Año)');
  const [newTeacherTutor, setNewTeacherTutor] = useState('Prof. Marcos Andrade');
  const [newTopics, setNewTopics] = useState('Cinemática, Dinámica de Newton, Trabajo y Energía');
  const [newActivities, setNewActivities] = useState('Portafolio de ejercicios, 2 laboratorios presenciales y defensa oral');
  const [newExamDate, setNewExamDate] = useState('2026-12-15');

  const activePlan = remedialPlans.find(p => p.id === selectedRemedialId) || remedialPlans[0];
  const activeStudent = levelStudents.find(s => s.id === activePlan?.studentId);

  // Filter students
  const studentsInRevision = levelStudents.filter(s => s.status === 'EN_REVISION');
  const studentsWithPending = levelStudents.filter(s => s.status === 'MATERIA_PENDIENTE' || s.pendingSubjects?.length);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentId || !newSubject) return;

    addRemedialPlan({
      studentId: newStudentId,
      subjectName: newSubject,
      schoolYear: '2026-2027',
      teacherTutor: newTeacherTutor,
      topicsToOvercome: newTopics.split(',').map(t => t.trim()),
      diagnosticScore: 8,
      expectedActivities: newActivities.split(',').map(a => a.trim()),
      evaluationSchedule: 'Octubre a Diciembre 2026',
      remedialExamDate: newExamDate,
      status: 'PENDIENTE'
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] uppercase tracking-wider">
              Recuperación Académica y Nivelación
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] mt-1">
            Planes de Intervención y Acción Remedial Personalizada
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Protocolos de nivelación para estudiantes en revisión y alumnos promovidos con materias pendientes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#c29f2e] text-[#1B1C33] font-black rounded-xl text-xs shadow-cba-gold transition-all"
          >
            <Plus className="w-4 h-4" />
            Nuevo Plan Remedial
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Switcher: Revisión vs Materias Pendientes */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 max-w-md no-print">
        <button
          onClick={() => setActiveTab('MATERIA_PENDIENTE')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'MATERIA_PENDIENTE'
              ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Materias Pendientes ({studentsWithPending.length})
        </button>

        <button
          onClick={() => setActiveTab('REVISION')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'REVISION'
              ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          Estudiantes a Revisión ({studentsInRevision.length})
        </button>
      </div>

      {/* Content depending on Tab */}
      {activeTab === 'MATERIA_PENDIENTE' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: List of Pending Subject Students */}
          <div className="space-y-3 no-print">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block px-1">
              Planes Remediales Registrados ({remedialPlans.length})
            </span>

            {remedialPlans.map((plan) => {
              const pStudent = levelStudents.find(s => s.id === plan.studentId);
              const isSelected = plan.id === activePlan?.id;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedRemedialId(plan.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#2C2E53] shadow-md ring-2 ring-[#2C2E53]/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400">Examen: {plan.remedialExamDate}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      plan.status === 'APROBADO'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {plan.status}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-[#2C2E53] truncate">{pStudent?.fullName}</h4>
                  <p className="text-[11px] text-slate-600 font-bold truncate mt-0.5">
                    {plan.subjectName}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Tutor: {plan.teacherTutor}</p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Remedial Dossier */}
          {activePlan && (
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-black block">
                      Plan de Acción Remedial Personalizado
                    </span>
                    <h3 className="text-lg font-black text-[#2C2E53] mt-0.5">
                      {activePlan.subjectName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Estudiante: <strong>{activeStudent?.fullName}</strong> ({activeStudent?.cedula})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-black px-3 py-1 rounded-full ${
                      activePlan.status === 'APROBADO'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {activePlan.status === 'APROBADO' ? `✓ Aprobado con ${activePlan.finalScore} ptos` : '⌛ En Cumplimiento'}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Año Escolar</span>
                    <strong className="text-slate-700">{activePlan.schoolYear}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Docente Tutor</span>
                    <strong className="text-slate-700">{activePlan.teacherTutor}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Fecha Examen Remedial</span>
                    <strong className="text-slate-700">{activePlan.remedialExamDate}</strong>
                  </div>
                </div>

                {/* Topics to Overcome */}
                <div>
                  <h4 className="text-xs font-extrabold text-[#2C2E53] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                    Contenidos y Competencias a Superar
                  </h4>
                  <div className="space-y-1.5">
                    {activePlan.topicsToOvercome.map((topic, i) => (
                      <div key={i} className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#2C2E53] text-[#D4AF37] font-bold flex items-center justify-center text-[10px] shrink-0">
                          {i + 1}
                        </span>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expected Activities */}
                <div>
                  <h4 className="text-xs font-extrabold text-[#2C2E53] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Actividades Obligatorias de Nivelación
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-200/50">
                    {activePlan.expectedActivities.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>

                {/* Action Bar: Approve or Update Score */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
                  <span className="text-xs text-slate-500 font-medium">
                    Evaluación final supervisada por Coordinación
                  </span>

                  <div className="flex items-center gap-2">
                    {activePlan.status !== 'APROBADO' ? (
                      <button
                        onClick={() => {
                          const score = prompt('Ingrese calificación final de la materia pendiente (01-20):', '14');
                          if (score) {
                            updateRemedialStatus(activePlan.id, 'APROBADO', Number(score));
                          }
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Certificar Materia Aprobada
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        ✓ Calificación final asentada en libro de actas
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Reporte de Estudiantes a Revisión & Plan de Intervención */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-[#2C2E53]">
                Nómina Oficial de Estudiantes a Revisión Pedagógica
              </h3>
              <p className="text-xs text-slate-400">
                Alumnos que requieren Plan de Intervención antes del cierre de lapso
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
              {studentsInRevision.length} casos en seguimiento
            </span>
          </div>

          <div className="space-y-4">
            {studentsInRevision.map(stu => (
              <div key={stu.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2C2E53] text-[#D4AF37] font-bold flex items-center justify-center">
                      {stu.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#2C2E53]">{stu.fullName}</h4>
                      <span className="text-xs text-slate-500">{stu.cedula} • {stu.grade} - {stu.section}</span>
                    </div>
                  </div>

                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    Plan de Intervención Activo
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
                  <div>
                    <strong className="text-slate-500 block text-[10px] uppercase">Compromiso del Estudiante</strong>
                    <p className="text-slate-700 mt-0.5">Asistir a 2 tutorías semanales y entregar portafolio corregido.</p>
                  </div>
                  <div>
                    <strong className="text-slate-500 block text-[10px] uppercase">Compromiso de la Familia</strong>
                    <p className="text-slate-700 mt-0.5">Supervisión diaria del horario de estudio y firma semanal.</p>
                  </div>
                  <div>
                    <strong className="text-slate-500 block text-[10px] uppercase">Acompañamiento del Colegio</strong>
                    <p className="text-slate-700 mt-0.5">Docente tutor asignado y seguimiento por Psicopedagogía.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Remedial Plan */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-lg text-[#2C2E53]">Crear Plan de Acción Remedial</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estudiante *
                </label>
                <select
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-[#2C2E53]"
                  required
                >
                  {levelStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.cedula})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Materia Pendiente *
                  </label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Ej. Física (3er Año)"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Docente Tutor Asignado *
                  </label>
                  <input
                    type="text"
                    value={newTeacherTutor}
                    onChange={(e) => setNewTeacherTutor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Temas y Competencias a Nivelar (separados por coma) *
                </label>
                <input
                  type="text"
                  value={newTopics}
                  onChange={(e) => setNewTopics(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Actividades Remediales Obligatorias *
                </label>
                <textarea
                  rows={2}
                  value={newActivities}
                  onChange={(e) => setNewActivities(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fecha Fijada para Evaluación Remedial *
                </label>
                <input
                  type="date"
                  value={newExamDate}
                  onChange={(e) => setNewExamDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black bg-[#2C2E53] text-[#D4AF37] hover:bg-[#232543] rounded-xl shadow-md"
                >
                  Registrar Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
