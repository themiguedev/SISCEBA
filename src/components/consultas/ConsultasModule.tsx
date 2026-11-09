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
  Award,
  AlertCircle,
  BookOpen
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

  const subtabsConfig: Record<
    ConsultasSubTab,
    {
      id: ConsultasSubTab;
      label: string;
      badgeLabel: string;
      icon: React.ElementType;
      description: string;
      bannerTitle: string;
      bannerDescription: string;
      bannerScope: string;
    }
  > = useMemo(
    () => ({
      RENDIMIENTO: {
        id: 'RENDIMIENTO',
        label: 'Sábana de Rendimiento',
        badgeLabel: 'Rendimiento',
        icon: FileSpreadsheet,
        description: 'Auditoría de notas, promedios vigesimales, escalas cualitativas y literales.',
        bannerTitle: 'Sábana Oficial de Rendimiento Estudiantil',
        bannerDescription:
          'Auditoría global de calificaciones oficiales, promedios vigesimales, escalas cualitativas y literales por año escolar, lapso y sección.',
        bannerScope: `Todos los Niveles • Sec. A / B • L${activeLapso} • 2026-2027`
      },
      BOLETIN: {
        id: 'BOLETIN',
        label: 'Boletines y Reportes',
        badgeLabel: 'Boletines',
        icon: GraduationCap,
        description: 'Emisión de boletines informativos, constancias y catálogo oficial C.E.O.',
        bannerTitle: 'Centro de Emisión de Reportes y Boletines',
        bannerDescription:
          'Generación e impresión oficial de boletines informativos, constancias de estudio certificadas y formatos del Control de Estudios (C.E.O.).',
        bannerScope: `Documentos Oficiales • L${activeLapso} • 2026-2027`
      },
      ASISTENCIA: {
        id: 'ASISTENCIA',
        label: 'Asistencia y Pases',
        badgeLabel: 'Asistencia',
        icon: Clock,
        description: 'Control de inasistencias acumuladas (LOE Art. 109) y pases por retraso.',
        bannerTitle: 'Control de Asistencia, Inasistencias y Pases',
        bannerDescription:
          'Supervisión y control normativo de inasistencias acumuladas bajo LOE Art. 109, seguimiento diario de puntualidad y registro de pases por retraso.',
        bannerScope: `Asistencia Diaria • Portería • 2026-2027`
      },
      ESTADISTICAS: {
        id: 'ESTADISTICAS',
        label: 'Estadísticas UCE',
        badgeLabel: 'Estadísticas',
        icon: BarChart3,
        description: 'Métricas institucionales, gráficos de rendimiento y semáforo de carga.',
        bannerTitle: 'Inteligencia Académica y Estadísticas UCE',
        bannerDescription:
          'Consulte métricas e indicadores de rendimiento escolar, distribución de notas, semáforo de carga docente y análisis pedagógico institucional.',
        bannerScope: `Métricas UCE • L${activeLapso} • 2026-2027`
      },
      NOMINAS: {
        id: 'NOMINAS',
        label: 'Nóminas y Expedientes',
        badgeLabel: 'Nóminas',
        icon: Users,
        description: 'Nóminas estudiantiles en Excel, directorio docente y asignación de horarios.',
        bannerTitle: 'Nóminas Oficiales, Expedientes y Horarios',
        bannerDescription:
          'Emisión de nóminas estudiantiles oficiales en formato Excel, directorio del cuerpo docente institucional y consulta de asignaciones horarias.',
        bannerScope: 'Estudiantes y Docentes • 2026-2027'
      }
    }),
    [activeLapso]
  );

  const currentTabConfig = subtabsConfig[activeTab] || subtabsConfig.RENDIMIENTO;
  const CurrentSubTabIcon = currentTabConfig.icon;

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

      {/* ========================================================================= */}
      {/* HEADER Y BARRA DE SUBMÓDULOS 1:1 CON EL DISEÑO DE REFERENCIA INSTITUCIONAL */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden transition-all">
        {/* Fila Superior: Módulo, Alcance y Función Activa */}
        <div className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 flex items-center justify-center shrink-0 border-2 border-amber-300 dark:border-amber-600 shadow-2xs font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">
                Consultas y Reportes
              </h1>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border-2 border-slate-300 dark:border-slate-600">
                Inicial • Primaria • Media General
              </span>
              {currentRole === 'ADMINISTRADOR' ? (
                <span className="text-[10px] font-black text-purple-950 dark:text-purple-200 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-md border-2 border-purple-300 dark:border-purple-700">
                  Admin
                </span>
              ) : (
                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-300 dark:border-slate-700">
                  {ROLE_METADATA[currentRole]?.label || currentRole}
                </span>
              )}
            </div>
          </div>

          {/* Insignia de Contraste Permanente de Función Activa y Acciones */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border-2 border-amber-400 dark:border-amber-600 text-xs font-black shadow-xs">
              <CurrentSubTabIcon className="w-4 h-4 text-amber-800 dark:text-amber-400" />
              <span>{currentTabConfig.badgeLabel}</span>
            </div>

            {/* Toggle de Muestra Institucional para Gestión */}
            {isManagement && (
              <button
                onClick={() => setUseDemoData(!useDemoData)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition border shadow-xs cursor-pointer ${
                  useDemoData
                    ? 'bg-[#1B1C33] text-white border-amber-400/50 hover:bg-[#25284B]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
                title="Alternar datos de muestra institucional CBA para auditoría visual"
              >
                <Layers className={`w-3.5 h-3.5 ${useDemoData ? 'text-amber-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="hidden sm:inline">{useDemoData ? 'Muestra UCE: ON' : 'Muestra UCE: OFF'}</span>
                <span className="sm:hidden">{useDemoData ? 'UCE: ON' : 'UCE: OFF'}</span>
              </button>
            )}

            {/* Botón de Auditoría UCE para Administrador / Directivos */}
            {isManagement && (
              <button
                onClick={() => setIsAuditModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
                title="Auditoría de Reportes y Comunicaciones (C.E.O.)"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Bitácora</span>
              </button>
            )}

            {/* Botón de Impresión */}
            {currentRole !== 'REPRESENTANTE' && (
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2C2E53] hover:bg-[#1E2038] text-white font-bold text-xs transition border border-[#3D4066] shadow-xs cursor-pointer"
                title="Imprimir vista actual en formato oficial"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Imprimir</span>
              </button>
            )}
          </div>
        </div>

        {/* Fila Inferior: Submódulos con track contrastado y píldoras de alto impacto permanente */}
        <div className="bg-slate-100 dark:bg-slate-950 border-t-2 border-slate-200 dark:border-slate-800 px-3.5 py-2.5 flex flex-wrap items-center gap-2">
          {allowedTabs.map((tabKey) => {
            const config = subtabsConfig[tabKey];
            if (!config) return null;
            const isSubActive = activeTab === tabKey;
            const SubIcon = config.icon;

            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSubActive
                    ? 'bg-[#2C2E53] text-white shadow-md border-2 border-[#2C2E53] dark:bg-amber-400 dark:text-slate-950 dark:border-amber-400'
                    : 'bg-white/90 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-2xs'
                }`}
                title={config.description}
              >
                <SubIcon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isSubActive ? 'text-amber-300 dark:text-slate-950' : 'text-slate-600 dark:text-slate-400'
                  }`}
                />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BANNER PRINCIPAL INFORMATIVO CBA (Diseño Oficial C.E.O.)                   */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#2C2E53] via-[#1E2038] to-[#141525] rounded-2xl p-5 sm:p-6 text-white shadow-md border border-[#3D4066] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#0F1122]/90 text-amber-300 border border-[#D4AF37] shadow-xs">
              Control Curricular Oficial
            </span>
            <span className="text-xs text-amber-200/90 font-medium">
              Consultas y Reportes • C.E.O. SISCEBA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <CurrentSubTabIcon className="w-6 h-6 text-white" />
            {currentTabConfig.bannerTitle}
          </h2>
        </div>

        {/* Resumen de alcance activo en cápsula dark */}
        <div className="flex items-center gap-2 bg-white/10 dark:bg-black/30 border border-white/15 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-100 shrink-0">
          <Layers className="w-4 h-4 text-amber-300" />
          <span>
            {currentTabConfig.bannerScope}
          </span>
        </div>
      </div>


      {/* KPI Summary Strip */}
      {!isFamilyOrStudent && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
          <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-cyan-400 dark:border-cyan-600/60 shadow-xs flex items-center gap-2.5">
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

          <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-emerald-400 dark:border-emerald-600/60 shadow-xs flex items-center gap-2.5">
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

          <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-indigo-400 dark:border-indigo-600/60 shadow-xs flex items-center gap-2.5">
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

          <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-rose-400 dark:border-rose-600/60 shadow-xs flex items-center gap-2.5">
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

          <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-amber-400 dark:border-amber-600/60 shadow-xs flex items-center gap-2.5 col-span-2 sm:col-span-1">
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
