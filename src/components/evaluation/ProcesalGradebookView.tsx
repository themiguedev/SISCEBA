import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { QualitativeScore, LiteralScore, NotificationDeliveryChannel, LEVEL_GRADES_CATALOG, AcademicAssignment } from '../../types';
import { PublishGradesModal } from './PublishGradesModal';
import {
  Save,
  Send,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Bot,
  BrainCircuit,
  Calculator,
  Search,
  Filter,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  HelpCircle,
  Bell,
  BookOpen,
  Lock,
  Unlock,
  ShieldAlert
} from 'lucide-react';

interface ProcesalGradebookViewProps {
  onNavigateToAI?: () => void;
}

export const ProcesalGradebookView: React.FC<ProcesalGradebookViewProps> = ({ onNavigateToAI }) => {
  const {
    levelStudents,
    levelAreas,
    indicators,
    currentLevel,
    activeLapso,
    currentSection,
    evaluations,
    recordEvaluation,
    bulkRecordEvaluations,
    generateAIActionPlan,
    sendNotification,
    currentRole,
    currentUser,
    currentTeacherAssignments,
    isLapsoOpenForGrading,
    getLapsoGradingStatus
  } = useApp();

  const gradingStatus = getLapsoGradingStatus(activeLapso);
  const isLockedForTeacher = !isLapsoOpenForGrading && currentRole === 'DOCENTE';
  const isSupervisorOverride = !isLapsoOpenForGrading && (currentRole === 'ADMINISTRADOR' || currentRole === 'DIRECTOR' || currentRole === 'COORDINACION');

  // Cátedras oficiales asignadas al docente para el subsistema activo
  const teacherLevelAssignments = (currentTeacherAssignments || []).filter(
    (a: AcademicAssignment) => a.level === currentLevel
  );
  const isTeacherWithAssignments =
    currentRole === 'DOCENTE' && teacherLevelAssignments.length > 0;

  // Estados de Grado, Sección y Cátedra Oficial
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    teacherLevelAssignments[0]?.id || ''
  );
  const [selectedGrade, setSelectedGrade] = useState<string>(
    teacherLevelAssignments[0]?.grade || LEVEL_GRADES_CATALOG[currentLevel][0]
  );
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>(
    teacherLevelAssignments[0]?.section || 'A'
  );
  const [selectedAreaId, setSelectedAreaId] = useState<string>(
    teacherLevelAssignments[0]?.areaId || levelAreas[0]?.id || ''
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [savedAlert, setSavedAlert] = useState(false);
  const [publishedAlert, setPublishedAlert] = useState<string | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [generatedStudentId, setGeneratedStudentId] = useState<string | null>(null);

  // Sincronizar automáticamente cuando cambia el nivel escolar o las asignaciones
  useEffect(() => {
    if (isTeacherWithAssignments) {
      const match = teacherLevelAssignments.find((a: AcademicAssignment) => a.id === selectedAssignmentId) || teacherLevelAssignments[0];
      if (match) {
        setSelectedAssignmentId(match.id);
        setSelectedGrade(match.grade);
        setSelectedSection(match.section);
        setSelectedAreaId(match.areaId);
      }
    } else {
      setSelectedGrade(LEVEL_GRADES_CATALOG[currentLevel][0]);
      setSelectedSection('A');
      setSelectedAreaId(levelAreas[0]?.id || '');
    }
  }, [currentLevel, isTeacherWithAssignments, currentTeacherAssignments?.length]);

  const handleSelectAssignment = (asgId: string) => {
    setSelectedAssignmentId(asgId);
    const asg = teacherLevelAssignments.find((a: AcademicAssignment) => a.id === asgId);
    if (asg) {
      setSelectedGrade(asg.grade);
      setSelectedSection(asg.section);
      setSelectedAreaId(asg.areaId);
    }
  };

  const currentArea = levelAreas.find(a => a.id === selectedAreaId) || levelAreas[0];

  // Estudiantes del salón y sección seleccionada
  const targetStudents = levelStudents.filter(stu => {
    if (selectedGrade && stu.grade !== selectedGrade) return false;
    if (selectedSection && stu.section !== selectedSection) return false;
    return true;
  });

  const areaIndicators = indicators.filter(i => {
    const matchesArea = i.areaId === selectedAreaId && i.level === currentLevel && i.lapso === activeLapso;
    if (!matchesArea) return false;
    if (i.grade) {
      if (selectedGrade && !i.grade.includes(selectedGrade) && !selectedGrade.includes(i.grade)) return false;
    }
    return true;
  });

  // Local state grid: studentId -> { [indicatorId]: number | qualitative }
  const [gridScores, setGridScores] = useState<Record<string, Record<string, any>>>({});

  // Desglose Actitudinal para Educación Media General (MPPE: 70% Procesal + 10% Rasgos + 10% Auto + 10% Coev)
  const [useActitudinalBreakdown, setUseActitudinalBreakdown] = useState<boolean>(true);
  const [actitudinalScores, setActitudinalScores] = useState<
    Record<string, { rasgos?: number; auto?: number; coev?: number }>
  >({});

  // Sync with existing evaluations
  useEffect(() => {
    const map: Record<string, Record<string, any>> = {};
    const actMap: Record<string, { rasgos?: number; auto?: number; coev?: number }> = {};

    targetStudents.forEach(stu => {
      map[stu.id] = {};
      areaIndicators.forEach(ind => {
        const found = evaluations.find(
          e =>
            e.studentId === stu.id &&
            e.areaId === selectedAreaId &&
            e.moment === 'PROCESAL' &&
            e.lapso === activeLapso &&
            e.indicatorId === ind.id
        );
        if (found) {
          map[stu.id][ind.id] =
            currentLevel === 'MEDIA_GENERAL'
              ? found.scoreNumeric
              : currentLevel === 'INICIAL'
              ? found.scoreLiteral || 'A'
              : found.scoreQualitative || 'L';
        } else {
          // Default initial grade based on subsystem
          if (currentLevel === 'MEDIA_GENERAL') {
            map[stu.id][ind.id] = stu.id.includes('stu-med-3') ? 8 : 17;
          } else if (currentLevel === 'INICIAL') {
            map[stu.id][ind.id] = stu.id.includes('stu-ini-3') ? 'B' : 'A';
          } else {
            map[stu.id][ind.id] = stu.id.includes('stu-pri-3') ? 'P' : 'L';
          }
        }
      });

      // Sincronizar componentes actitudinales si existen registros previos
      const existingWithAct = evaluations.find(
        e =>
          e.studentId === stu.id &&
          e.areaId === selectedAreaId &&
          e.lapso === activeLapso &&
          (e.rasgosScore !== undefined || e.autoScore !== undefined || e.coevScore !== undefined)
      );
      if (existingWithAct) {
        actMap[stu.id] = {
          rasgos: existingWithAct.rasgosScore ?? 16,
          auto: existingWithAct.autoScore ?? 16,
          coev: existingWithAct.coevScore ?? 16
        };
      } else {
        actMap[stu.id] = {
          rasgos: stu.id.includes('stu-med-3') ? 10 : 18,
          auto: stu.id.includes('stu-med-3') ? 11 : 18,
          coev: stu.id.includes('stu-med-3') ? 10 : 17
        };
      }
    });

    setGridScores(map);
    setActitudinalScores(actMap);
  }, [selectedAreaId, activeLapso, currentLevel, targetStudents.length, selectedGrade, selectedSection]);

  const handleCellChange = (studentId: string, indicatorId: string, value: any) => {
    setGridScores(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [indicatorId]: value
      }
    }));
  };

  const handleActitudinalChange = (studentId: string, field: 'rasgos' | 'auto' | 'coev', value: number) => {
    const clamped = Math.min(20, Math.max(1, isNaN(value) ? 1 : value));
    setActitudinalScores(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [field]: clamped
      }
    }));
  };

  const handleSaveAll = () => {
    const recordsToSave: Parameters<typeof bulkRecordEvaluations>[0] = [];

    targetStudents.forEach(stu => {
      const studentMap = gridScores[stu.id] || {};
      const act = actitudinalScores[stu.id] || {};

      areaIndicators.forEach(ind => {
        const val = studentMap[ind.id];
        if (val !== undefined) {
          recordsToSave.push({
            studentId: stu.id,
            areaId: selectedAreaId,
            indicatorId: ind.id,
            moment: 'PROCESAL',
            lapso: activeLapso,
            scoreNumeric: currentLevel === 'MEDIA_GENERAL' ? Number(val) : undefined,
            scoreLiteral: currentLevel === 'INICIAL' ? (val as LiteralScore) : undefined,
            scoreQualitative: currentLevel === 'PRIMARIA' ? (val as QualitativeScore) : undefined,
            rasgosScore: currentLevel === 'MEDIA_GENERAL' && useActitudinalBreakdown ? act.rasgos : undefined,
            autoScore: currentLevel === 'MEDIA_GENERAL' && useActitudinalBreakdown ? act.auto : undefined,
            coevScore: currentLevel === 'MEDIA_GENERAL' && useActitudinalBreakdown ? act.coev : undefined,
            observations: `Registro procesal continuo - Lapso ${activeLapso}`,
            teacherId: currentUser?.id || 'docente-titular'
          });
        }
      });
    });

    bulkRecordEvaluations(recordsToSave);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handlePublishConfirm = (channels: NotificationDeliveryChannel[]) => {
    handleSaveAll();

    const channelLabels: Record<NotificationDeliveryChannel, string> = {
      PORTAL: 'Portal CBA',
      EMAIL: 'Correo',
      SMS_WHATSAPP: 'SMS/WhatsApp'
    };
    const channelsText = channels.map((c) => channelLabels[c]).join(', ');

    sendNotification({
      title: `Notas Publicadas • ${currentArea.name}`,
      message: `El docente ha cargado las notas del Lapso ${activeLapso} en ${currentArea.name} (${selectedGrade} Sección ${selectedSection}). Notificación despachada a ${targetStudents.length} representantes y alumnos vía ${channelsText}.`,
      category: 'CALIFICACIONES',
      priority: 'ALTA',
      recipientRole: 'TODOS',
      studentName: `${selectedGrade} ${selectedSection}`,
      actionTab: currentLevel,
      actionSubTab: 'BOLETIN',
      deliveryChannels: channels
    });

    setPublishedAlert(
      `¡Calificaciones de ${currentArea.name} publicadas con éxito! Se notificó a ${targetStudents.length} representantes y alumnos vía ${channelsText}.`
    );
    setTimeout(() => setPublishedAlert(null), 6000);
  };

  // Helper to compute average for Media General (70% procesal)
  const computeStudentAverage = (studentId: string): number => {
    const studentMap = gridScores[studentId] || {};
    const values = areaIndicators.map(ind => Number(studentMap[ind.id])).filter(v => !isNaN(v));
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round((sum / values.length) * 10) / 10;
  };

  // Helper oficial MPPE para Media General: 70% Procesal + 10% Rasgos + 10% Auto + 10% Coev
  const computeStudentDefinitive = (studentId: string): { procesalAvg: number; actitudinalAvg: number; finalScore: number } => {
    const procesalAvg = computeStudentAverage(studentId);
    if (!useActitudinalBreakdown || currentLevel !== 'MEDIA_GENERAL') {
      return { procesalAvg, actitudinalAvg: 0, finalScore: Math.round(procesalAvg) };
    }
    const act = actitudinalScores[studentId] || {};
    const r = act.rasgos !== undefined ? Number(act.rasgos) : procesalAvg;
    const a = act.auto !== undefined ? Number(act.auto) : procesalAvg;
    const c = act.coev !== undefined ? Number(act.coev) : procesalAvg;
    const actitudinalAvg = Math.round(((r + a + c) / 3) * 10) / 10;
    const rawDefinitive = (procesalAvg * 0.70) + (r * 0.10) + (a * 0.10) + (c * 0.10);
    const finalScore = Math.min(20, Math.max(1, Math.round(rawDefinitive)));
    return { procesalAvg, actitudinalAvg, finalScore };
  };

  const filteredStudents = targetStudents.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cedula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#2C2E53] dark:text-white">
            Evaluación Procesal Continua ({currentLevel.replace('_', ' ')})
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Registro sistemático de indicadores en tiempo real con cálculo ponderado y notificación automática a familias.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleSaveAll}
            disabled={isLockedForTeacher}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs transition-all border font-bold ${
              isLockedForTeacher
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-transparent dark:border-slate-700 cursor-pointer'
            }`}
            title={isLockedForTeacher ? "La edición de calificaciones se encuentra cerrada para este lapso" : "Guardar cambios localmente"}
          >
            <Save className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            Guardar Borrador
          </button>

          <button
            onClick={() => setIsPublishModalOpen(true)}
            disabled={isLockedForTeacher}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs shadow-md transition-all font-black border ${
              isLockedForTeacher
                ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
                : 'bg-[#2C2E53] hover:bg-[#1B1C33] dark:bg-[#1A1D36] dark:hover:bg-[#131528] text-[#D4AF37] border-[#D4AF37]/30 cursor-pointer hover:shadow-lg'
            }`}
            title={isLockedForTeacher ? "La carga de calificaciones se encuentra cerrada para este lapso" : "Publicar calificaciones y enviar notificación a padres y alumnos"}
          >
            <Send className="w-4 h-4 text-[#D4AF37]" />
            Publicar & Notificar a Familias
          </button>
        </div>
      </div>

      {/* Banner de Bloqueo Programado para Docentes */}
      {isLockedForTeacher && (
        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 flex items-start gap-3 shadow-xs animate-in fade-in">
          <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-sm text-amber-900 dark:text-amber-200">
              Libro Digital Bloqueado: No existen lapsos habilitados para la carga de registros
            </h4>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
              {gradingStatus.isExpiredByDeadline
                ? `El plazo oficial de carga docente para el Lapso ${activeLapso} finalizó automáticamente (${gradingStatus.deadlineStr}). La edición de calificaciones se encuentra inhabilitada conforme al cronograma de Control de Estudios.`
                : `La carga de calificaciones se encuentra cerrada para el Lapso ${activeLapso} por disposición institucional.`}
            </p>
          </div>
        </div>
      )}

      {/* Banner de Modo Supervisor Directivo */}
      {isSupervisorOverride && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-purple-900 dark:text-purple-200 font-bold shadow-xs">
          <ShieldAlert className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
          <span>Modo Supervisor Institucional: El lapso está cerrado para docentes, pero su rol dispone de permisos para consulta y edición extraordinaria.</span>
        </div>
      )}

      {publishedAlert && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 px-4 py-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Bell className="w-4 h-4" />
            </div>
            <span>{publishedAlert}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-emerald-200/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md text-emerald-900 dark:text-emerald-300 shrink-0 font-extrabold">
            Omnicanal Entregado
          </span>
        </div>
      )}

      {savedAlert && !publishedAlert && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Registros procesales guardados en borrador con éxito.
        </div>
      )}

      {/* Filter and Area Selector */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {isTeacherWithAssignments ? (
          /* Modo Docente con Asignación Oficial */
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Cátedra Asignada:</span>
              </span>
              <select
                value={selectedAssignmentId}
                onChange={(e) => handleSelectAssignment(e.target.value)}
                className="px-3 py-2 bg-indigo-50/80 dark:bg-indigo-950/50 rounded-xl border border-indigo-300 dark:border-indigo-700 text-xs font-black text-indigo-950 dark:text-indigo-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {teacherLevelAssignments.map((asg: AcademicAssignment) => (
                  <option key={asg.id} value={asg.id}>
                    {asg.areaName} — {asg.grade} Sec. {asg.section} ({asg.areaCode})
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              {targetStudents.length} alumno(s) inscritos
            </span>
          </div>
        ) : (
          /* Modo Directivo / Coordinador o Docente General */
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Grado */}
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-bold text-[#2C2E53] dark:text-slate-200">
                Grado:
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#1E2038] rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#2C2E53] outline-none"
              >
                {LEVEL_GRADES_CATALOG[currentLevel].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Sección (Exclusivamente A y B - Regla 4) */}
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-bold text-[#2C2E53] dark:text-slate-200">
                Sección:
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value as 'A' | 'B')}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#1E2038] rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#2C2E53] outline-none"
              >
                <option value="A">Sección A</option>
                <option value="B">Sección B</option>
              </select>
            </div>

            {/* Área */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="select-procesal-area" className="text-xs font-bold text-[#2C2E53] dark:text-slate-200">
                Área:
              </label>
              <select
                id="select-procesal-area"
                value={selectedAreaId}
                onChange={(e) => setSelectedAreaId(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#1E2038] rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black text-[#2C2E53] dark:text-slate-100 focus:ring-2 focus:ring-[#2C2E53] outline-none"
              >
                {levelAreas.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar estudiante..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#1E2038] rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-[#2C2E53] dark:focus:ring-indigo-400 outline-none"
          />
        </div>
      </div>

      {/* Gradebook Grid Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-cba-card overflow-hidden">
        <div className="p-4 bg-[#2C2E53] dark:bg-[#14162B] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-transparent dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-extrabold text-xs tracking-wide">
              {currentArea?.name} • {selectedGrade} Sección {selectedSection} • Lapso {activeLapso}
            </span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {currentLevel === 'MEDIA_GENERAL' && (
              <button
                type="button"
                onClick={() => setUseActitudinalBreakdown(!useActitudinalBreakdown)}
                className={`px-3 py-1 rounded-xl text-[11px] font-black transition flex items-center gap-1.5 border ${
                  useActitudinalBreakdown
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                    : 'bg-white/10 text-slate-300 border-transparent hover:bg-white/20'
                }`}
                title="Conmutar desglose actitudinal oficial MPPE (70% procesal + 10% rasgos + 10% auto + 10% coev)"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{useActitudinalBreakdown ? 'MPPE 70/30 Activo (10% Rasgos / 10% Auto / 10% Coev)' : 'Modo Simple (100% Procesal)'}</span>
              </button>
            )}
            <span className="text-[11px] text-slate-300">
              {areaIndicators.length} Indicadores Activos
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase font-black tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 sticky left-0 bg-slate-50 dark:bg-slate-800 z-10 w-60">Estudiante</th>
                {areaIndicators.map(ind => (
                  <th key={ind.id} className="py-3 px-3 text-center min-w-[130px]" title={ind.description}>
                    <span className="block font-black text-[#2C2E53] dark:text-amber-300">{ind.code}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-400 font-semibold truncate block max-w-[120px]">
                      {ind.description.slice(0, 30)}...
                    </span>
                    {ind.weight && (
                      <span className="text-[9px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1 py-0.2 rounded font-extrabold border border-transparent dark:border-amber-700/50">
                        {ind.weight}%
                      </span>
                    )}
                  </th>
                ))}
                {currentLevel === 'MEDIA_GENERAL' && (
                  useActitudinalBreakdown ? (
                    <>
                      <th className="py-3 px-2 text-center font-black text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/30 min-w-[70px]">
                        70% Proc.
                      </th>
                      <th className="py-3 px-2 text-center font-black text-purple-700 dark:text-purple-300 bg-purple-50/70 dark:bg-purple-950/30 min-w-[65px]" title="10% Rasgos Formativos y Cívicos">
                        Rasgos 10%
                      </th>
                      <th className="py-3 px-2 text-center font-black text-blue-700 dark:text-blue-300 bg-blue-50/70 dark:bg-blue-950/30 min-w-[65px]" title="10% Autoevaluación del Alumno">
                        Auto 10%
                      </th>
                      <th className="py-3 px-2 text-center font-black text-teal-700 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/30 min-w-[65px]" title="10% Coevaluación">
                        Coev 10%
                      </th>
                      <th className="py-3 px-3 text-center font-black text-[#2C2E53] dark:text-white bg-amber-100/70 dark:bg-amber-900/40 min-w-[95px]">
                        Definitiva Lapso
                      </th>
                    </>
                  ) : (
                    <th className="py-3 px-4 text-center font-black text-[#2C2E53] dark:text-white bg-amber-50/70 dark:bg-amber-950/30 min-w-[90px]">
                      Promedio Procesal
                    </th>
                  )
                )}
                <th className="py-3 px-4 text-center min-w-[120px]">Acciones Pedagógicas</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={areaIndicators.length + (currentLevel === 'MEDIA_GENERAL' ? (useActitudinalBreakdown ? 6 : 2) : 2)}
                    className="py-12 text-center text-slate-400"
                  >
                    <div className="max-w-md mx-auto space-y-2">
                      <AlertTriangle className="w-8 h-8 text-amber-500/80 mx-auto" />
                      <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                        No hay estudiantes registrados en {selectedGrade} Sección {selectedSection}
                      </p>
                      <p className="text-xs text-slate-400">
                        {searchTerm
                          ? 'Ningún alumno coincide con el término de búsqueda ingresado.'
                          : 'Verifique la matrícula en Gestión o seleccione otra sección en la barra superior.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  const studentScores = gridScores[stu.id] || {};
                  const definitiveData = computeStudentDefinitive(stu.id);
                  const avg = definitiveData.finalScore;
                  const isUnderperforming = currentLevel === 'MEDIA_GENERAL' && avg < 10;

                  return (
                    <tr
                      key={stu.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                        isUnderperforming ? 'bg-red-50/30 dark:bg-red-950/20' : ''
                      }`}
                    >
                    {/* Student Info Cell */}
                    <td className="py-3 px-4 sticky left-0 bg-white dark:bg-slate-900 z-10 border-r border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#2C2E53] text-[#D4AF37] font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
                          {stu.avatarUrl ? (
                            <img src={stu.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            stu.fullName.charAt(0)
                          )}
                        </div>
                        <div className="truncate">
                          <span className="font-extrabold text-[#2C2E53] dark:text-slate-100 block text-xs truncate">
                            {stu.fullName}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">{stu.cedula}</span>
                        </div>
                      </div>
                    </td>

                    {/* Indicator Cells */}
                    {areaIndicators.map((ind) => {
                      const val = studentScores[ind.id];

                      return (
                        <td key={ind.id} className="py-2 px-3 text-center">
                          {currentLevel === 'MEDIA_GENERAL' ? (
                            <input
                              type="number"
                              min={1}
                              max={20}
                              disabled={isLockedForTeacher}
                              value={val ?? ''}
                              onChange={(e) =>
                                handleCellChange(stu.id, ind.id, Number(e.target.value))
                              }
                              aria-label={`Calificación de ${stu.fullName} en ${ind.code}`}
                              className={`w-14 p-1 text-center font-black rounded-lg border text-xs focus:ring-2 focus:ring-[#2C2E53] ${
                                isLockedForTeacher
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 cursor-not-allowed opacity-75'
                                  : Number(val) >= 16
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : Number(val) >= 10
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : 'bg-red-50 text-red-800 border-red-300 font-black'
                              }`}
                            />
                          ) : currentLevel === 'INICIAL' ? (
                            <select
                              value={val || 'A'}
                              disabled={isLockedForTeacher}
                              onChange={(e) => handleCellChange(stu.id, ind.id, e.target.value)}
                              aria-label={`Valoración literal de ${stu.fullName} en ${ind.code}`}
                              className={`p-1 text-xs font-black rounded-lg border text-[#2C2E53] ${
                                isLockedForTeacher
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 cursor-not-allowed opacity-75'
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <option value="A">A (Excelente)</option>
                              <option value="B">B (Bueno)</option>
                              <option value="C">C (Aceptable)</option>
                              <option value="D">D (Requiere Acompañamiento)</option>
                              <option value="E">E (No Consolidado)</option>
                            </select>
                          ) : (
                            <select
                              value={val || 'L'}
                              disabled={isLockedForTeacher}
                              onChange={(e) => handleCellChange(stu.id, ind.id, e.target.value)}
                              aria-label={`Valoración cualitativa de ${stu.fullName} en ${ind.code}`}
                              className={`p-1 text-xs font-black rounded-lg border text-[#2C2E53] ${
                                isLockedForTeacher
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 cursor-not-allowed opacity-75'
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <option value="L">L (Logrado)</option>
                              <option value="P">P (En Proceso)</option>
                              <option value="EP">EP (En Proceso)</option>
                              <option value="I">I (Iniciado)</option>
                            </select>
                          )}
                        </td>
                      );
                    })}

                    {/* Media General Actitudinal Breakdown Columns */}
                    {currentLevel === 'MEDIA_GENERAL' && useActitudinalBreakdown && (
                      <>
                        <td className="py-2 px-2 text-center bg-amber-50/20 dark:bg-amber-950/20 font-bold text-slate-700 dark:text-slate-300">
                          {definitiveData.procesalAvg}
                        </td>
                        <td className="py-2 px-1 text-center bg-purple-50/20 dark:bg-purple-950/20">
                          <input
                            type="number"
                            min={1}
                            max={20}
                            disabled={isLockedForTeacher}
                            value={actitudinalScores[stu.id]?.rasgos ?? ''}
                            onChange={(e) => handleActitudinalChange(stu.id, 'rasgos', Number(e.target.value))}
                            className="w-12 p-1 text-center font-bold rounded-lg border text-xs bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800"
                            title="Rasgos Formativos (10%)"
                          />
                        </td>
                        <td className="py-2 px-1 text-center bg-blue-50/20 dark:bg-blue-950/20">
                          <input
                            type="number"
                            min={1}
                            max={20}
                            disabled={isLockedForTeacher}
                            value={actitudinalScores[stu.id]?.auto ?? ''}
                            onChange={(e) => handleActitudinalChange(stu.id, 'auto', Number(e.target.value))}
                            className="w-12 p-1 text-center font-bold rounded-lg border text-xs bg-white dark:bg-slate-800 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                            title="Autoevaluación (10%)"
                          />
                        </td>
                        <td className="py-2 px-1 text-center bg-teal-50/20 dark:bg-teal-950/20">
                          <input
                            type="number"
                            min={1}
                            max={20}
                            disabled={isLockedForTeacher}
                            value={actitudinalScores[stu.id]?.coev ?? ''}
                            onChange={(e) => handleActitudinalChange(stu.id, 'coev', Number(e.target.value))}
                            className="w-12 p-1 text-center font-bold rounded-lg border text-xs bg-white dark:bg-slate-800 text-teal-900 dark:text-teal-200 border-teal-200 dark:border-teal-800"
                            title="Coevaluación (10%)"
                          />
                        </td>
                      </>
                    )}

                    {/* Media General Definitive Score */}
                    {currentLevel === 'MEDIA_GENERAL' && (
                      <td className="py-2 px-3 text-center bg-amber-50/40 dark:bg-amber-950/30">
                        <div className="flex flex-col items-center">
                          <span
                            className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                              avg >= 16
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                                : avg >= 10
                                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700'
                                : 'bg-red-100 dark:bg-red-950/60 text-red-900 dark:text-red-200 border-red-300 dark:border-red-700 animate-pulse'
                            }`}
                          >
                            {String(avg).padStart(2, '0')} / 20
                          </span>
                          {useActitudinalBreakdown && (
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5 whitespace-nowrap">
                              {definitiveData.procesalAvg} (70%) + {definitiveData.actitudinalAvg} (30%)
                            </span>
                          )}
                        </div>
                      </td>
                    )}

                    {/* Actions Cell */}
                    <td className="py-2 px-4 text-center">
                      {isUnderperforming ? (
                        <button
                          onClick={() => {
                            generateAIActionPlan(stu.id, selectedAreaId);
                            setGeneratedStudentId(stu.id);
                            if (onNavigateToAI) onNavigateToAI();
                          }}
                          className="flex items-center justify-center gap-1 w-full px-2.5 py-1 text-[11px] font-extrabold bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-lg shadow-sm hover:opacity-95 transition-all"
                          title="Generar plan de refuerzo remedial personalizado"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          Plan Acción
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          En norma
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Publish & Omnichannel Dispatch Modal */}
      <PublishGradesModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={handlePublishConfirm}
        areaName={currentArea?.name || 'Asignatura'}
        lapso={activeLapso}
        studentCount={targetStudents.length}
        gradeSection={`${selectedGrade} ${selectedSection}`}
      />
    </div>
  );
};
