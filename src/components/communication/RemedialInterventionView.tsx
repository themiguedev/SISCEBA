import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  RevisionEvaluationRecord,
  PendingSubjectEnrollment
} from '../../types';
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
  Zap,
  Award,
  Trash2,
  Search,
  School,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';

export const RemedialInterventionView: React.FC = () => {
  const {
    students,
    levelStudents,
    levelAreas,
    areas,
    currentLevel,
    remedialPlans,
    addRemedialPlan,
    updateRemedialStatus,
    sendNotification,
    users,
    currentUser,
    revisionEvaluations,
    saveRevisionEvaluation,
    deleteRevisionEvaluation,
    pendingSubjectEnrollments,
    savePendingSubjectEnrollment,
    recordPendingSubjectGrade,
    deletePendingSubjectEnrollment
  } = useApp();

  const [activeTab, setActiveTab] = useState<'MATERIA_PENDIENTE' | 'REVISION' | 'PLANES_REMEDIALES'>('MATERIA_PENDIENTE');

  // Modals state
  const [isCreateRevisionModalOpen, setIsCreateRevisionModalOpen] = useState(false);
  const [isCreatePendingModalOpen, setIsCreatePendingModalOpen] = useState(false);
  const [isCreateRemedialModalOpen, setIsCreateRemedialModalOpen] = useState(false);

  // Print Acta State
  const [printActaRevision, setPrintActaRevision] = useState<RevisionEvaluationRecord | null>(null);

  // New Revision Form State
  const [revStudentId, setRevStudentId] = useState(students[0]?.id || '');
  const [revAreaId, setRevAreaId] = useState(areas[0]?.id || '');
  const [revGrade, setRevGrade] = useState('3er Año');
  const [revSection, setRevSection] = useState<'A' | 'B'>('A');
  const [revScore, setRevScore] = useState<number>(12);
  const [revActaNumber, setRevActaNumber] = useState(`ACTA-REV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [revDate, setRevDate] = useState(new Date().toISOString().split('T')[0]);
  const [revObs, setRevObs] = useState('');

  // New Pending Subject Form State
  const [pendStudentId, setPendStudentId] = useState(students[0]?.id || '');
  const [pendAreaId, setPendAreaId] = useState(areas[0]?.id || '');
  const [pendOriginGrade, setPendOriginGrade] = useState('2do Año');
  const [pendCurrentGrade, setPendCurrentGrade] = useState('3er Año');
  const [pendTeacherId, setPendTeacherId] = useState(users.find(u => u.role === 'DOCENTE')?.id || '');

  // New Remedial Plan Form State
  const [newStudentId, setNewStudentId] = useState(levelStudents[0]?.id || '');
  const [newSubject, setNewSubject] = useState('Física (3er Año)');
  const [newTeacherTutor, setNewTeacherTutor] = useState('Prof. Marcos Andrade');
  const [newTopics, setNewTopics] = useState('Cinemática, Dinámica de Newton, Trabajo y Energía');
  const [newActivities, setNewActivities] = useState('Portafolio de ejercicios, 2 laboratorios presenciales y defensa oral');
  const [newExamDate, setNewExamDate] = useState('2026-12-15');

  // Submit Revision Evaluation
  const handleCreateRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === revStudentId);
    const area = areas.find(a => a.id === revAreaId);
    if (!student || !area) return;

    const passed = Number(revScore) >= 10;
    const newRecord: RevisionEvaluationRecord = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      studentId: student.id,
      studentName: student.fullName,
      studentCedula: student.cedula,
      areaId: area.id,
      areaName: area.name,
      schoolYear: '2026 - 2027',
      grade: revGrade,
      section: revSection,
      revisionScore: Number(revScore),
      passed,
      evaluatedBy: currentUser?.username || 'coordinacion',
      evaluatedByName: currentUser?.fullName || 'Control de Estudios (UCE)',
      evaluationDate: revDate,
      actaNumber: revActaNumber,
      observations: revObs
    };

    await saveRevisionEvaluation(newRecord);

    sendNotification({
      title: `Prueba de Revisión (Julio) Asentada • ${area.name}`,
      message: `El estudiante ${student.fullName} obtuvo una calificación de ${revScore} pts (${passed ? 'APROBADA' : 'REPROBADA'}) en la prueba extraordinaria de revisión. Acta Nro: ${revActaNumber}.`,
      category: 'CALIFICACIONES',
      priority: passed ? 'MEDIA' : 'ALTA',
      recipientRole: 'COORDINACION',
      recipientName: 'Control de Estudios (UCE)',
      studentName: student.fullName,
      actionTab: 'MEDIA_GENERAL',
      actionSubTab: 'REMEDIALES',
      deliveryChannels: ['PORTAL', 'EMAIL']
    });

    setIsCreateRevisionModalOpen(false);
  };

  // Submit Pending Subject Enrollment
  const handleCreatePendingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === pendStudentId);
    const area = areas.find(a => a.id === pendAreaId);
    const teacher = users.find(u => u.id === pendTeacherId);
    if (!student || !area) return;

    const newRecord: PendingSubjectEnrollment = {
      id: `pend-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      studentId: student.id,
      studentName: student.fullName,
      studentCedula: student.cedula,
      areaId: area.id,
      areaName: area.name,
      schoolYear: '2026 - 2027',
      originGrade: pendOriginGrade,
      currentGrade: pendCurrentGrade,
      assignedTeacherId: teacher?.id,
      assignedTeacherName: teacher?.fullName || 'Docente Examinador',
      status: 'CURSANDO',
      grades: []
    };

    await savePendingSubjectEnrollment(newRecord);

    sendNotification({
      title: `Inscripción de Materia Pendiente • ${area.name}`,
      message: `El estudiante ${student.fullName} ha sido inscrito en régimen de arrastre para ${area.name} (pendiente de ${pendOriginGrade}). Docente examinador asignado: ${teacher?.fullName || 'Por designar'}.`,
      category: 'CALIFICACIONES',
      priority: 'MEDIA',
      recipientRole: 'COORDINACION',
      recipientName: 'Control de Estudios',
      actionTab: 'MEDIA_GENERAL',
      actionSubTab: 'REMEDIALES',
      deliveryChannels: ['PORTAL', 'EMAIL']
    });

    setIsCreatePendingModalOpen(false);
  };

  // Submit Remedial Plan
  const handleCreateRemedialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentId || !newSubject) return;
    const targetStudent = levelStudents.find(s => s.id === newStudentId);

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

    setIsCreateRemedialModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Printable Sheet for Acta de Revisión */}
      {printActaRevision && (
        <div className="fixed inset-0 bg-white z-[9999] p-12 overflow-y-auto print:block flex flex-col justify-between">
          <div className="space-y-6 max-w-4xl mx-auto border-2 border-slate-900 p-8 rounded-xl">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div className="text-left">
                <span className="text-xs uppercase font-extrabold tracking-widest block text-slate-600">
                  República Bolivariana de Venezuela
                </span>
                <span className="text-xs uppercase font-extrabold tracking-widest block text-slate-600">
                  Ministerio del Poder Popular para la Educación
                </span>
                <h2 className="text-lg font-black text-slate-900 uppercase mt-1">
                  U.E.P. Colegio Bellas Artes • Maracaibo, Zulia
                </h2>
                <span className="text-[11px] font-bold text-slate-500">
                  Código DEA: S0432D2305 • Unidad de Control de Estudios (UCE)
                </span>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-slate-900 text-[#D4AF37] font-mono font-black text-xs rounded-lg inline-block">
                  {printActaRevision.actaNumber}
                </span>
                <span className="block text-[11px] font-bold text-slate-500 mt-1">
                  Año Escolar: {printActaRevision.schoolYear}
                </span>
              </div>
            </div>

            <div className="text-center py-2">
              <h1 className="text-xl font-black uppercase tracking-wider text-slate-900 underline decoration-slate-400 decoration-2">
                Acta Oficial de Prueba Extraordinaria de Revisión
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Reglamentada por el Régimen de Evaluación del MPPE para Educación Media General (Julio)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-300 text-xs">
              <div>
                <span className="text-slate-500 uppercase font-bold text-[10px] block">Estudiante</span>
                <strong className="text-base text-slate-900 block">{printActaRevision.studentName}</strong>
                <span className="text-slate-600 font-mono">Cédula: {printActaRevision.studentCedula}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-bold text-[10px] block">Asignatura Evaluada</span>
                <strong className="text-base text-slate-900 block">{printActaRevision.areaName}</strong>
                <span className="text-slate-600">
                  Nivel: {printActaRevision.grade} — Sección {printActaRevision.section}
                </span>
              </div>
            </div>

            <div className="border border-slate-900 p-6 rounded-xl text-center space-y-2 bg-slate-50">
              <span className="text-xs font-black uppercase text-slate-500 tracking-widest block">
                Calificación Definitiva Obtenida en Revisión
              </span>
              <div className="text-5xl font-black font-mono text-slate-950">
                {String(printActaRevision.revisionScore).padStart(2, '0')} / 20
              </div>
              <div className="inline-block mt-2">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  printActaRevision.passed ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}>
                  {printActaRevision.passed ? '✓ Aprobado Oficialmente en Revisión' : '✕ Reprobado (Sujeto a Materia Pendiente)'}
                </span>
              </div>
            </div>

            {printActaRevision.observations && (
              <div className="text-xs p-3 bg-slate-100 rounded-lg">
                <strong>Observaciones de la Junta Evaluadora:</strong> {printActaRevision.observations}
              </div>
            )}

            <div className="pt-16 grid grid-cols-3 gap-8 text-center text-xs">
              <div className="border-t border-slate-900 pt-2">
                <strong>{printActaRevision.evaluatedByName}</strong>
                <span className="block text-[10px] text-slate-500">Docente Examinador(a)</span>
              </div>
              <div className="border-t border-slate-900 pt-2">
                <strong>Lic. Rigoberto Boscán</strong>
                <span className="block text-[10px] text-slate-500">Coordinador de Evaluación (UCE)</span>
              </div>
              <div className="border-t border-slate-900 pt-2">
                <strong>Prof. Carlos R. Méndez P.</strong>
                <span className="block text-[10px] text-slate-500">Director General</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4 no-print">
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 bg-[#2C2E53] text-[#D4AF37] font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimir Acta Oficial
            </button>
            <button
              onClick={() => setPrintActaRevision(null)}
              className="px-6 py-2.5 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-300 cursor-pointer"
            >
              Cerrar Vista Previa
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-black text-[#2C2E53] flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-[#D4AF37]" />
            Pruebas de Revisión y Materia Pendiente
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gestión de pruebas extraordinarias de julio (reparación) y los 4 momentos reglamentarios de examen para materias de arrastre.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'REVISION' && (
            <button
              onClick={() => setIsCreateRevisionModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-black rounded-xl text-xs shadow-md transition-all cursor-pointer border border-[#D4AF37]/40"
            >
              <Plus className="w-4 h-4" />
              Asentar Nota de Revisión (Julio)
            </button>
          )}

          {activeTab === 'MATERIA_PENDIENTE' && (
            <button
              onClick={() => setIsCreatePendingModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Inscribir Materia Pendiente (4 Momentos)
            </button>
          )}

          {activeTab === 'PLANES_REMEDIALES' && (
            <button
              onClick={() => setIsCreateRemedialModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#c29f2e] text-[#1B1C33] font-black rounded-xl text-xs shadow-cba-gold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Nuevo Plan Remedial
            </button>
          )}
        </div>
      </div>

      {/* Switcher Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 max-w-xl no-print gap-1">
        <button
          onClick={() => setActiveTab('MATERIA_PENDIENTE')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'MATERIA_PENDIENTE'
              ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Materia Pendiente ({pendingSubjectEnrollments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('REVISION')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'REVISION'
              ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5 text-amber-500" />
          <span>Pruebas de Revisión ({revisionEvaluations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PLANES_REMEDIALES')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'PLANES_REMEDIALES'
              ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-indigo-500" />
          <span>Planes de Apoyo ({remedialPlans.length})</span>
        </button>
      </div>

      {/* TAB 1: MATERIA PENDIENTE (4 MOMENTOS) */}
      {activeTab === 'MATERIA_PENDIENTE' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-[#2C2E53]">
                  Padrón de Estudiantes en Régimen de Materia Pendiente (Arrastre)
                </h3>
                <p className="text-xs text-slate-500">
                  Conforme a la normativa venezolana, cada alumno cuenta con hasta 4 momentos reglamentarios de examen para aprobar la materia arrastrada.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-800 rounded-full border border-indigo-200">
                {pendingSubjectEnrollments.filter(p => p.status === 'CURSANDO').length} activos en curso
              </span>
            </div>

            {pendingSubjectEnrollments.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-sm font-bold">No hay estudiantes registrados con materia pendiente en este periodo.</p>
                <button
                  onClick={() => setIsCreatePendingModalOpen(true)}
                  className="px-4 py-2 bg-[#2C2E53] text-[#D4AF37] rounded-xl text-xs font-bold cursor-pointer"
                >
                  Registrar Primera Materia Pendiente
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSubjectEnrollments.map((enr) => {
                  const grades = enr.grades || [];

                  return (
                    <div
                      key={enr.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-[#2C2E53]">{enr.studentName}</h4>
                            <span className="text-xs text-slate-400 font-mono">({enr.studentCedula})</span>
                          </div>
                          <p className="text-xs font-bold text-slate-700 mt-0.5">
                            Asignatura: <span className="text-indigo-700">{enr.areaName}</span> • Pendiente de: <span className="text-amber-800 font-extrabold">{enr.originGrade}</span> (Actualmente en {enr.currentGrade})
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Docente Examinador(a): <strong>{enr.assignedTeacherName}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-black ${
                            enr.status === 'APROBADA'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : enr.status === 'REPROBADA'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {enr.status === 'APROBADA' ? `✓ APROBADA (${enr.finalScore} pts)` : enr.status}
                          </span>

                          <button
                            onClick={() => {
                              if (confirm('¿Desea eliminar este registro de materia pendiente?')) {
                                deletePendingSubjectEnrollment(enr.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* The 4 Moments Stepper */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                          Registro de Calificaciones por Momento Evaluativo (Escala 01 a 20)
                        </span>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[1, 2, 3, 4].map((m) => {
                            const gradeObj = grades.find(g => g.momentNumber === m);
                            const hasGrade = gradeObj?.score !== undefined && gradeObj.score !== null;

                            return (
                              <div
                                key={m}
                                className={`p-3 rounded-xl border flex flex-col justify-between ${
                                  hasGrade
                                    ? gradeObj.score! >= 10
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                      : 'bg-rose-50 border-rose-200 text-rose-900'
                                    : 'bg-slate-50 border-slate-200 text-slate-500'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-black uppercase">Momento {m}</span>
                                  {hasGrade && (
                                    <span className="text-[9px] font-bold text-slate-400">
                                      {gradeObj.evaluatedAt}
                                    </span>
                                  )}
                                </div>

                                <div className="my-1 text-center">
                                  {hasGrade ? (
                                    <span className="text-xl font-black font-mono">
                                      {String(gradeObj.score).padStart(2, '0')} pts
                                    </span>
                                  ) : (
                                    <span className="text-xs font-bold text-slate-400 italic">Sin presentar</span>
                                  )}
                                </div>

                                {enr.status === 'CURSANDO' && (
                                  <button
                                    onClick={() => {
                                      const input = prompt(`Ingrese calificación de Momento ${m} (01 a 20 puntos):`, hasGrade ? String(gradeObj.score) : '12');
                                      if (input !== null) {
                                        const num = Number(input);
                                        if (!isNaN(num) && num >= 0 && num <= 20) {
                                          recordPendingSubjectGrade(enr.id, m as 1 | 2 | 3 | 4, num);
                                        } else {
                                          alert('La calificación debe estar entre 01 y 20 puntos.');
                                        }
                                      }
                                    }}
                                    className="mt-2 w-full py-1 text-[10px] font-black bg-white rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 shadow-2xs transition cursor-pointer"
                                  >
                                    {hasGrade ? 'Modificar' : 'Calificar'}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRUEBAS DE REVISIÓN (JULIO) */}
      {activeTab === 'REVISION' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-[#2C2E53]">
                  Libro Oficial de Actas de Pruebas de Revisión (Reparación de Julio)
                </h3>
                <p className="text-xs text-slate-500">
                  Asentamiento de calificaciones de las evaluaciones extraordinarias de final de curso en Educación Media General.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                {revisionEvaluations.length} actas emitidas
              </span>
            </div>

            {revisionEvaluations.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <FileCheck2 className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-sm font-bold">No hay actas de pruebas de revisión registradas en el sistema.</p>
                <button
                  onClick={() => setIsCreateRevisionModalOpen(true)}
                  className="px-4 py-2 bg-[#2C2E53] text-[#D4AF37] rounded-xl text-xs font-bold cursor-pointer"
                >
                  Registrar Primera Evaluación de Revisión
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-extrabold text-[10px] uppercase">
                      <th className="py-2.5 px-3">Nro. Acta</th>
                      <th className="py-2.5 px-3">Estudiante</th>
                      <th className="py-2.5 px-3">Materia</th>
                      <th className="py-2.5 px-3">Grado / Secc</th>
                      <th className="py-2.5 px-3">Fecha</th>
                      <th className="py-2.5 px-3 text-center">Calificación</th>
                      <th className="py-2.5 px-3">Estatus</th>
                      <th className="py-2.5 px-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {revisionEvaluations.map((rev) => (
                      <tr key={rev.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-indigo-700">{rev.actaNumber}</td>
                        <td className="py-3 px-3">
                          <strong className="text-slate-800 block">{rev.studentName}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">{rev.studentCedula}</span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-700">{rev.areaName}</td>
                        <td className="py-3 px-3 text-slate-600">
                          {rev.grade} — <span className="font-extrabold text-[#2C2E53]">Sección {rev.section}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-500">{rev.evaluationDate}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="text-base font-black font-mono">
                            {String(rev.revisionScore).padStart(2, '0')} / 20
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            rev.passed
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}>
                            {rev.passed ? 'APROBADA' : 'REPROBADA'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1">
                          <button
                            onClick={() => setPrintActaRevision(rev)}
                            title="Imprimir Acta Oficial MPPE"
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('¿Desea eliminar esta acta de revisión?')) {
                                deleteRevisionEvaluation(rev.id);
                              }
                            }}
                            title="Eliminar Acta"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PLANES DE APOYO REMEDIAL */}
      {activeTab === 'PLANES_REMEDIALES' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-[#2C2E53]">
                Planes Individuales de Acompañamiento Pedagógico
              </h3>
              <p className="text-xs text-slate-400">
                Estrategias formativas para nivelación y refuerzo antes del cierre de lapso
              </p>
            </div>
            <button
              onClick={() => setIsCreateRemedialModalOpen(true)}
              className="px-3 py-1.5 bg-[#D4AF37] text-slate-900 rounded-xl font-bold text-xs cursor-pointer shadow-sm"
            >
              + Nuevo Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {remedialPlans.map(plan => {
              const stu = students.find(s => s.id === plan.studentId);
              return (
                <div key={plan.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-extrabold text-[#2C2E53]">{stu?.fullName || 'Estudiante'}</strong>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900">
                      {plan.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-bold">{plan.subjectName} • Tutor: {plan.teacherTutor}</p>
                  <p className="text-[11px] text-slate-500">Examen programado: {plan.remedialExamDate}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR NOTA DE REVISIÓN (JULIO) */}
      {isCreateRevisionModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-[#2C2E53] flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-500" />
                Asentar Acta de Prueba de Revisión (Julio)
              </h3>
              <button onClick={() => setIsCreateRevisionModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateRevisionSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Estudiante *</label>
                <select
                  value={revStudentId}
                  onChange={(e) => setRevStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold"
                  required
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.cedula}) — {s.grade} [Sección {s.section}]</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Asignatura *</label>
                <select
                  value={revAreaId}
                  onChange={(e) => setRevAreaId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold"
                  required
                >
                  {areas.filter(a => a.level === 'MEDIA_GENERAL').map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grado *</label>
                  <select
                    value={revGrade}
                    onChange={(e) => setRevGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    {['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sección Oficial (A o B) *</label>
                  <select
                    value={revSection}
                    onChange={(e) => setRevSection(e.target.value as 'A' | 'B')}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold"
                  >
                    <option value="A">Sección A</option>
                    <option value="B">Sección B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Calificación Vigesimal (01-20) *</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={revScore}
                    onChange={(e) => setRevScore(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-black text-center text-sm font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nro. de Acta Oficial *</label>
                  <input
                    type="text"
                    value={revActaNumber}
                    onChange={(e) => setRevActaNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fecha de Aplicación *</label>
                <input
                  type="date"
                  value={revDate}
                  onChange={(e) => setRevDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  value={revObs}
                  onChange={(e) => setRevObs(e.target.value)}
                  placeholder="Detalles de la deliberación del jurado examinador..."
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateRevisionModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C2E53] text-[#D4AF37] font-black rounded-xl shadow-md cursor-pointer"
                >
                  Asentar y Generar Acta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INSCRIBIR MATERIA PENDIENTE */}
      {isCreatePendingModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-[#2C2E53] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Inscripción de Materia Pendiente (Arrastre)
              </h3>
              <button onClick={() => setIsCreatePendingModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreatePendingSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Estudiante en Promoción Condicional *</label>
                <select
                  value={pendStudentId}
                  onChange={(e) => setPendStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold"
                  required
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.cedula}) — {s.grade}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Materia Pendiente Adeudada *</label>
                <select
                  value={pendAreaId}
                  onChange={(e) => setPendAreaId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold"
                  required
                >
                  {areas.filter(a => a.level === 'MEDIA_GENERAL').map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grado de Origen (Donde reprobó) *</label>
                  <select
                    value={pendOriginGrade}
                    onChange={(e) => setPendOriginGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    {['1er Año', '2do Año', '3er Año', '4to Año'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grado que Cursa Actualmente *</label>
                  <select
                    value={pendCurrentGrade}
                    onChange={(e) => setPendCurrentGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold"
                  >
                    {['2do Año', '3er Año', '4to Año', '5to Año'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Docente Examinador(a) Designado(a) *</label>
                <select
                  value={pendTeacherId}
                  onChange={(e) => setPendTeacherId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold"
                  required
                >
                  {users.filter(u => u.role === 'DOCENTE' || u.role === 'COORDINACION').map(u => (
                    <option key={u.id} value={u.id}>{u.fullName} ({u.role})</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatePendingModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-black rounded-xl shadow-md cursor-pointer"
                >
                  Formalizar Materia Pendiente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PLAN REMEDIAL */}
      {isCreateRemedialModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-base text-[#2C2E53]">Crear Plan Remedial</h3>
              <button onClick={() => setIsCreateRemedialModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={handleCreateRemedialSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Estudiante *</label>
                <select
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold text-[#2C2E53]"
                  required
                >
                  {levelStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.cedula})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Asignatura *</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Docente Tutor *</label>
                  <input
                    type="text"
                    value={newTeacherTutor}
                    onChange={(e) => setNewTeacherTutor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateRemedialModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-black bg-[#2C2E53] text-[#D4AF37] rounded-xl shadow-md"
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
