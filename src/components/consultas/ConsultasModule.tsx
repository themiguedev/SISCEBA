import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EducationalLevel, Student } from '../../types';
import {
  FileSpreadsheet,
  GraduationCap,
  Clock,
  BarChart3,
  Users,
  Printer,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Layers,
  Sparkles,
  Award,
  AlertCircle
} from 'lucide-react';
import { hasSubTabAccess, ROLE_METADATA } from '../../utils/rbac';
import { RendimientoAuditView } from './RendimientoAuditView';
import { ReportesCentroView } from './ReportesCentroView';
import { AsistenciaPasesView } from './AsistenciaPasesView';
import { EstadisticasRendimientoView } from './EstadisticasRendimientoView';
import { NominasExpedientesView } from './NominasExpedientesView';
import { AuditoriaConsultasModal } from './AuditoriaConsultasModal';
import {
  DEMO_STUDENTS_INICIAL,
  DEMO_STUDENTS_PRIMARIA,
  generateDemoEvaluations,
  generateDemoDailyAttendance,
  DEMO_PASSES
} from '../../data/consultasDemoData';

export type ConsultasSubTab = 'RENDIMIENTO' | 'BOLETIN' | 'ASISTENCIA' | 'ESTADISTICAS' | 'NOMINAS';

interface ConsultasModuleProps {
  activeSubTab?: ConsultasSubTab;
  setActiveSubTab?: (subTab: ConsultasSubTab) => void;
}

export const ConsultasModule: React.FC<ConsultasModuleProps> = ({
  activeSubTab,
  setActiveSubTab
}) => {
  const {
    students,
    evaluations,
    passes,
    dailyAttendance,
    currentRole,
    activeLapso,
    currentUser
  } = useApp();

  const isFamilyOrStudent = currentRole === 'REPRESENTANTE' || currentRole === 'ESTUDIANTE';
  const isAdmin = currentRole === 'ADMINISTRADOR';
  const isManagement = ['ADMINISTRADOR', 'DIRECTOR', 'COORDINACION'].includes(currentRole);

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Modo Muestra Institucional para Auditoría UCE
  // Se activa por defecto para el Administrador si el libro digital no tiene notas asentadas aún
  const [useDemoData, setUseDemoData] = useState<boolean>(() => {
    return isManagement && evaluations.length === 0;
  });

  // Datos efectivos combinados
  const effectiveStudents = useMemo(() => {
    if (!useDemoData) return students;
    const hasInicial = students.some((s) => s.level === 'INICIAL');
    const hasPrimaria = students.some((s) => s.level === 'PRIMARIA');
    let list = [...students];
    if (!hasInicial) list = [...list, ...DEMO_STUDENTS_INICIAL];
    if (!hasPrimaria) list = [...list, ...DEMO_STUDENTS_PRIMARIA];
    return list;
  }, [students, useDemoData]);

  const effectiveEvaluations = useMemo(() => {
    if (!useDemoData) return evaluations;
    if (evaluations.length > 0) return evaluations;
    return generateDemoEvaluations(effectiveStudents);
  }, [evaluations, useDemoData, effectiveStudents]);

  const effectivePasses = useMemo(() => {
    if (!useDemoData) return passes;
    return passes.length > 0 ? passes : DEMO_PASSES;
  }, [passes, useDemoData]);

  const effectiveDailyAttendance = useMemo(() => {
    if (!useDemoData) return dailyAttendance;
    return dailyAttendance.length > 0 ? dailyAttendance : generateDemoDailyAttendance(effectiveStudents);
  }, [dailyAttendance, useDemoData, effectiveStudents]);

  const [simulatedStudentId, setSimulatedStudentId] = useState<string>(() => effectiveStudents[0]?.id || '');

  // Subtabs permitidas según RBAC
  const allowedTabs = (['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA', 'ESTADISTICAS', 'NOMINAS'] as ConsultasSubTab[]).filter(
    (t) => hasSubTabAccess(currentRole, 'CONSULTAS', t)
  );

  const [internalActiveTab, setInternalActiveTab] = useState<ConsultasSubTab>(() => {
    return allowedTabs[0] || 'RENDIMIENTO';
  });

  const requestedTab = activeSubTab || internalActiveTab;
  const activeTab = allowedTabs.includes(requestedTab) ? requestedTab : allowedTabs[0] || 'RENDIMIENTO';

  const setActiveTab = (tab: ConsultasSubTab) => {
    if (!allowedTabs.includes(tab)) return;
    if (setActiveSubTab) {
      setActiveSubTab(tab);
    }
    setInternalActiveTab(tab);
  };

  // Estricto aislamiento de privacidad estudiantil: el Estudiante solo ve su propio registro
  const scopedStudents = isFamilyOrStudent
    ? (() => {
        if (currentRole === 'ESTUDIANTE') {
          const normUsername = currentUser?.username?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
          const normCedula = currentUser?.cedula?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
          const userFullName = currentUser?.fullName?.toLowerCase().trim() || '';
          const userEmail = currentUser?.email?.toLowerCase().trim() || '';

          const matched = effectiveStudents.filter((s) => {
            const studentCedula = s.cedula?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
            const studentName = s.fullName?.toLowerCase().trim() || '';
            const studentEmail = (s as any).email?.toLowerCase().trim() || s.representativeEmail?.toLowerCase().trim() || '';

            return (
              (normCedula && studentCedula === normCedula) ||
              (normUsername && studentCedula === normUsername) ||
              (normUsername && normUsername === s.id.toLowerCase()) ||
              (userEmail && studentEmail === userEmail) ||
              (userFullName && studentName === userFullName)
            );
          });

          if (matched.length > 0) {
            return [matched[0]];
          }

          if (currentUser?.role === 'ADMINISTRADOR') {
            const simulated = effectiveStudents.find((s) => s.id === simulatedStudentId) || effectiveStudents[0];
            return simulated ? [simulated] : [];
          }

          return [];
        }

        // Si es REPRESENTANTE, filtrar exclusivamente por sus representados legales
        const repName = currentUser?.fullName?.toLowerCase().trim() || '';
        const repEmail = currentUser?.email?.toLowerCase().trim() || '';
        const repCedula = currentUser?.cedula?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
        const repUsername = currentUser?.username?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';

        const matched = effectiveStudents.filter((s) => {
          const sRepName = s.representativeName?.toLowerCase().trim() || '';
          const sRepEmail = s.representativeEmail?.toLowerCase().trim() || '';
          const sRepCedula =
            s.motherInfo?.cedula?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() ||
            s.fatherInfo?.cedula?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() ||
            '';

          return (
            (repCedula && sRepCedula === repCedula) ||
            (repUsername && sRepCedula === repUsername) ||
            (repEmail && sRepEmail === repEmail) ||
            (repName && sRepName.includes(repName))
          );
        });

        if (matched.length > 0) {
          return matched;
        }

        if (currentUser?.role === 'ADMINISTRADOR') {
          return effectiveStudents.slice(0, 2);
        }

        return [];
      })()
    : effectiveStudents;

  return (
    <div className="space-y-4">
      {/* Banner de Bienvenida Contextual para Familias / Estudiantes */}
      {isFamilyOrStudent && (
        <div className="bg-gradient-to-r from-[#2C2E53] via-[#1E2142] to-[#2C2E53] p-4 rounded-2xl border border-[#D4AF37]/40 shadow-xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#1B1C33] font-black flex items-center justify-center shrink-0 shadow-md">
              {currentRole === 'REPRESENTANTE' ? <Users className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                  {currentRole === 'REPRESENTANTE'
                    ? 'Portal Oficial de Padres y Representantes'
                    : 'Portal Oficial del Estudiante'}
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Acceso Exclusivo a Consultas
                </span>
              </div>
              <h3 className="text-sm font-black text-white mt-0.5">
                {currentRole === 'REPRESENTANTE'
                  ? 'Consulta Académica y Seguimiento de su Representado'
                  : 'Consulta de Calificaciones, Rendimiento y Asistencia'}
              </h3>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold text-slate-300 block">Año Escolar Activo</span>
            <span className="text-xs font-black text-[#D4AF37] uppercase tracking-wider">
              2026 - 2027 • Lapso {activeLapso}
            </span>
          </div>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#2C2E53] dark:text-white">
              Módulo de Consultas y Reportes Institucionales
            </h2>
            {useDemoData && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#D4AF37]/15 text-[#94721C] dark:text-amber-300 border border-[#D4AF37]/40">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                Muestra Pedagógica Activa
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Inteligencia académica, auditoría pedagógica UCE, emisión oficial de documentos certificados y nóminas.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Toggle de Muestra Institucional para Gestión */}
          {isManagement && (
            <button
              onClick={() => setUseDemoData(!useDemoData)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition border shadow-xs ${
                useDemoData
                  ? 'bg-[#1B1C33] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#25284B]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title="Alternar datos de muestra institucional CBA para auditoría visual"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{useDemoData ? 'Muestra UCE: ON' : 'Muestra UCE: OFF'}</span>
            </button>
          )}

          {/* Botón de Auditoría UCE para Administrador / Directivos */}
          {isManagement && (
            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition border border-slate-200 dark:border-slate-700 shadow-xs"
              title="Auditoría de Reportes y Comunicaciones (C.E.O.)"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Bitácora</span>
            </button>
          )}

          {/* Botón de Impresión según Submódulo (Restringido para rol Representante) */}
          {currentRole !== 'REPRESENTANTE' && (
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2C2E53] hover:bg-[#1E2038] text-[#D4AF37] font-bold text-xs transition border border-[#2C2E53] shadow-xs"
              title="Imprimir vista actual en formato oficial"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
          )}
        </div>
      </div>


      {/* KPI Summary Strip */}
      {!isFamilyOrStudent && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
          <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-black uppercase text-slate-400 block truncate">
                Matrícula Auditada
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white">
                {effectiveStudents.length} Alumnos
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-black uppercase text-slate-400 block truncate">
                Promedio UCE
              </span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                16.4 / 20
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-black uppercase text-slate-400 block truncate">
                Semáforo Carga
              </span>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                84% Carga Docente
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-black uppercase text-slate-400 block truncate">
                Riesgo LOE Art. 109
              </span>
              <span className="text-xs font-black text-rose-600 dark:text-rose-400">
                2 en Alerta (&gt;25%)
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2.5 col-span-2 sm:col-span-1">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-black uppercase text-slate-400 block truncate">
                Pases Portería
              </span>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                {effectivePasses.length} Pases
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 1: RENDIMIENTO & SÁBANA (consulta_notas_estrategias_coordinador.php) */}
      {activeTab === 'RENDIMIENTO' && (
        <RendimientoAuditView
          isFamilyOrStudent={isFamilyOrStudent}
          scopedStudents={scopedStudents}
          simulatedStudentId={simulatedStudentId}
          setSimulatedStudentId={setSimulatedStudentId}
          overrideStudents={effectiveStudents}
          overrideEvaluations={effectiveEvaluations}
        />
      )}

      {/* SUBVIEW 2: CENTRO DE REPORTES & BOLETINES (reg_opciones_reportes.php) */}
      {activeTab === 'BOLETIN' && (
        <ReportesCentroView
          isFamilyOrStudent={isFamilyOrStudent}
          scopedStudents={scopedStudents}
          overrideStudents={effectiveStudents}
          overrideEvaluations={effectiveEvaluations}
        />
      )}

      {/* SUBVIEW 3: ASISTENCIA, INASISTENCIAS LOE & PASES */}
      {activeTab === 'ASISTENCIA' && (
        <AsistenciaPasesView
          isFamilyOrStudent={isFamilyOrStudent}
          scopedStudents={scopedStudents}
          overrideStudents={effectiveStudents}
          overrideDailyAttendance={effectiveDailyAttendance}
          overridePasses={effectivePasses}
        />
      )}

      {/* SUBVIEW 4: ESTADÍSTICAS & SEMÁFORO UCE (reg_estadistica_rendimiento.php) */}
      {activeTab === 'ESTADISTICAS' && (
        <EstadisticasRendimientoView
          overrideStudents={effectiveStudents}
          overrideEvaluations={effectiveEvaluations}
        />
      )}

      {/* SUBVIEW 5: NÓMINAS, DIRECTIORIO DOCENTE & HORARIOS (reg_listado_estudiantes.php, reg_listado_docentes.php, horarios_docentes.php) */}
      {activeTab === 'NOMINAS' && (
        <NominasExpedientesView
          isFamilyOrStudent={isFamilyOrStudent}
          scopedStudents={scopedStudents}
          overrideStudents={effectiveStudents}
        />
      )}

      {/* Modal de Auditoría de Reportes y Comunicaciones (reg_auditorias_reportes.php) */}
      <AuditoriaConsultasModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
};
