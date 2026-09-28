import React from 'react';
import { useApp } from '../../context/AppContext';
import { EvaluationRecord, MainNavigationTab } from '../../types';
import {
  Sparkles,
  Users,
  BookOpen,
  Award,
  ClipboardList,
  ShieldCheck,
  TrendingUp,
  Clock,
  FileText
} from 'lucide-react';
import { canEditGrades, hasTabAccess } from '../../utils/rbac';
import { useTheme } from '../../context/ThemeContext';

interface AcademicPulseHeroProps {
  onQuickAction: (tab: MainNavigationTab | 'PLANIFICACION' | 'EVALUACION' | 'COMUNICACION', subTab?: string) => void;
}

export const AcademicPulseHero: React.FC<AcademicPulseHeroProps> = ({ onQuickAction }) => {
  const { currentLevel, students, areas, evaluations, activeLapso, currentRole, passes, documentRequests } = useApp();
  const { currentMonthConfig } = useTheme();

  const levelStudents = students.filter(s => s.level === currentLevel);
  const levelAreas = areas.filter(a => a.level === currentLevel);
  const levelRecords = evaluations.filter((r: EvaluationRecord) => r.lapso === activeLapso);

  const levelLabels = {
    INICIAL: { name: 'Educación Inicial', cycle: 'Salas de 3, 4 y 5 Años', scale: 'Evaluación Cualitativa Descriptiva' },
    PRIMARIA: { name: 'Educación Primaria', cycle: '1° a 6° Grado', scale: 'Escala Literal (A - E)' },
    MEDIA_GENERAL: { name: 'Educación Media General', cycle: '1° a 5° Año', scale: 'Escala Numérica Oficial (01 - 20)' }
  };

  const currentInfo = levelLabels[currentLevel];

  // Identificar si tiene acceso a módulos pedagógicos o es de gestión operativa
  const hasAcademicModules = hasTabAccess(currentRole, 'MEDIA_GENERAL');

  return (
    <section aria-label="Resumen ejecutivo institucional" className="space-y-4 mb-6">
      {/* Top Banner with Actions */}
      <div className="bg-gradient-to-r from-[#2C2E53] via-[#242646] to-[#1B1C33] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 text-white shadow-xl border border-[#414474]/50 relative overflow-hidden">
        {/* Subtle Background Pattern & Seasonal Ambient Glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />
        <div
          className={`absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-gradient-to-tr ${currentMonthConfig.bannerGradient} opacity-20 blur-3xl pointer-events-none`}
        />

        {/* Floating Seasonal Decorations (Subtle) */}
        <div className="absolute top-2 right-12 sm:right-28 text-white/10 text-2xl sm:text-3xl select-none pointer-events-none animate-pulse">
          {currentMonthConfig.floatingDecorations[0]?.icon || currentMonthConfig.emoji}
        </div>
        <div className="hidden sm:block absolute bottom-2 right-48 text-white/10 text-xl select-none pointer-events-none">
          {currentMonthConfig.floatingDecorations[1]?.icon || ''}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 text-amber-200 border border-amber-400/30 text-[11px] font-extrabold tracking-widest uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Año Escolar 2026 - 2027
              </span>
              <span className="text-slate-300 text-xs font-semibold">• Lapso {activeLapso}</span>

              {/* Seasonal Pill Tag */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border shadow-xs ${currentMonthConfig.badgeBg} ${currentMonthConfig.badgeText} ${currentMonthConfig.badgeBorder}`}
                title={`${currentMonthConfig.ephemeris} - ${currentMonthConfig.greetingMessage}`}
              >
                <span>{currentMonthConfig.emoji}</span>
                <span>{currentMonthConfig.seasonTitle}</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              {currentRole === 'ASISTENTE'
                ? 'Panel Operativo de Asistencia y Disciplina'
                : currentRole === 'SECRETARIA'
                ? 'Panel de Control de Estudios y Trámites'
                : 'Panel Académico'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/90 mt-1 max-w-xl font-medium">
              {currentMonthConfig.greetingMessage}
            </p>
          </div>

          {/* Quick Shortcuts Flotantes con Glassmorphism y Micro-Resplandor (60 FPS) */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
            {currentRole === 'ASISTENTE' ? (
              <>
                <button
                  onClick={() => onQuickAction('GESTION', 'PASES')}
                  className="min-h-[46px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-[#D4AF37] to-amber-500 hover:brightness-110 text-slate-950 text-xs font-black transition-all duration-200 shadow-md shadow-[#D4AF37]/25 hover:shadow-lg hover:shadow-[#D4AF37]/40 hover:-translate-y-0.5 active:scale-95 cursor-pointer ring-1 ring-white/20"
                >
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Emitir Pase</span>
                </button>
                <button
                  onClick={() => onQuickAction('GESTION', 'INASISTENCIAS')}
                  className="min-h-[46px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all duration-200 border border-white/15 backdrop-blur-md hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-xs"
                >
                  <Users className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Pase de Lista</span>
                </button>
                <button
                  onClick={() => onQuickAction('GESTION', 'CONDUCTAS')}
                  className="col-span-2 sm:col-span-1 min-h-[46px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-black transition-all duration-200 shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer border border-amber-400/30"
                >
                  <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                  <span>Registrar Conducta</span>
                </button>
              </>
            ) : currentRole === 'SECRETARIA' ? (
              <>
                <button
                  onClick={() => onQuickAction('GESTION', 'INSCRIPCIONES')}
                  className="min-h-[46px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-[#D4AF37] to-amber-500 hover:brightness-110 text-slate-950 text-xs font-black transition-all duration-200 shadow-md shadow-[#D4AF37]/25 hover:shadow-lg hover:shadow-[#D4AF37]/40 hover:-translate-y-0.5 active:scale-95 cursor-pointer ring-1 ring-white/20"
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Inscripción</span>
                </button>
                <button
                  onClick={() => onQuickAction('GESTION', 'DOCUMENTOS')}
                  className="min-h-[46px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all duration-200 border border-white/15 backdrop-blur-md hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-xs"
                >
                  <FileText className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Trámites</span>
                </button>
                <button
                  onClick={() => onQuickAction('GESTION', 'MATRICULA')}
                  className="col-span-2 sm:col-span-1 min-h-[46px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black transition-all duration-200 shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer border border-indigo-400/30"
                >
                  <ClipboardList className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Padrón Estudiantil</span>
                </button>
              </>
            ) : hasAcademicModules ? (
              <>
                <button
                  onClick={() => onQuickAction('PLANIFICACION', 'AREAS_PERFILES')}
                  className="min-h-[46px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all duration-200 border border-white/15 backdrop-blur-md hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Pensum</span>
                </button>

                {canEditGrades(currentRole) && (
                  <button
                    onClick={() => onQuickAction('EVALUACION', 'PROCESAL')}
                    className="min-h-[46px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-[#D4AF37] to-amber-500 hover:brightness-110 text-slate-950 text-xs font-black transition-all duration-200 shadow-md shadow-[#D4AF37]/25 hover:shadow-lg hover:shadow-[#D4AF37]/40 hover:-translate-y-0.5 active:scale-95 cursor-pointer ring-1 ring-white/20"
                  >
                    <TrendingUp className="w-4 h-4 shrink-0" />
                    <span>Calificar</span>
                  </button>
                )}

                <button
                  onClick={() => onQuickAction('COMUNICACION', 'IA_ACTION_PLANS')}
                  className={`${canEditGrades(currentRole) ? 'col-span-2 sm:col-span-1' : ''} min-h-[46px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black transition-all duration-200 shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer border border-indigo-400/30`}
                >
                  <ClipboardList className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Planes de Acción</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onQuickAction('CONSULTAS', 'RENDIMIENTO')}
                className="col-span-2 min-h-[46px] flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-[#D4AF37] to-amber-500 hover:brightness-110 text-slate-950 text-xs font-black transition-all duration-200 shadow-md shadow-[#D4AF37]/25 hover:shadow-lg hover:shadow-[#D4AF37]/40 hover:-translate-y-0.5 active:scale-95 cursor-pointer ring-1 ring-white/20"
              >
                <ClipboardList className="w-4 h-4 shrink-0" />
                <span>Consultar Rendimiento</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bento Grid Telemetry Cards con Glassmorphism Acelerado por GPU (60 FPS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5">
        {/* Card 1: Contextual por Rol (Estudiantes / Matrícula o Pases) */}
        <div className="relative overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ring-1 ring-slate-900/5">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              {currentRole === 'ASISTENTE' ? 'Pases Emitidos' : 'Estudiantes Registrados'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2C2E53] flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-xs">
              {currentRole === 'ASISTENTE' ? <Clock className="w-4 h-4 text-[#D4AF37]" /> : <Users className="w-4 h-4" />}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {currentRole === 'ASISTENTE' ? passes.length : levelStudents.length}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              (currentRole === 'ASISTENTE' ? passes.length > 0 : levelStudents.length > 0)
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : 'bg-slate-100 text-slate-500'
            }`}>
              {currentRole === 'ASISTENTE'
                ? (passes.length > 0 ? 'Registros activos' : 'Al día')
                : (levelStudents.length > 0 ? 'Matrícula activa' : 'Sin matrícula')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate font-medium">
            {currentRole === 'ASISTENTE' ? 'Pases de retraso y salida institucional' : currentInfo.cycle}
          </p>
        </div>

        {/* Card 2: Áreas / Trámites / Padrón según Rol */}
        <div className="relative overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ring-1 ring-slate-900/5">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-amber-400 to-[#D4AF37] opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              {currentRole === 'SECRETARIA' ? 'Trámites y Constancias' : 'Malla Curricular'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#D4AF37] flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-xs">
              {currentRole === 'SECRETARIA' ? <FileText className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {currentRole === 'SECRETARIA' ? documentRequests.length : levelAreas.length}
            </span>
            <span className="text-[11px] font-bold text-[#2C2E53] bg-amber-50/80 px-2 py-0.5 rounded-full border border-amber-200/50">
              {currentRole === 'SECRETARIA' ? 'Solicitudes' : 'Asignaturas'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate font-medium">
            {currentRole === 'SECRETARIA' ? 'Gestión y emisión de documentos' : 'Incluye Robótica y Bellas Artes'}
          </p>
        </div>

        {/* Card 3: Calificaciones / Disciplina / Seguimiento */}
        <div className="relative overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ring-1 ring-slate-900/5">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-600 opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              {currentRole === 'ASISTENTE' ? 'Disciplina y Asistencia' : 'Evaluación Pedagógica'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-xs">
              {currentRole === 'ASISTENTE' ? <ShieldCheck className="w-4 h-4" /> : <Award className="w-4 h-4" />}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {currentRole === 'ASISTENTE'
                ? '100%'
                : levelRecords.length > 0
                ? (currentLevel === 'MEDIA_GENERAL' ? '18.4' : 'L')
                : '—'}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              {currentRole === 'ASISTENTE'
                ? 'Control Activo'
                : levelRecords.length > 0
                ? (currentLevel === 'MEDIA_GENERAL' ? '/ 20 Promedio' : 'Logrado (L)')
                : 'Sin registros'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate font-medium">
            {currentRole === 'ASISTENTE' ? 'Seguimiento formativo y de conducta' : currentInfo.scale}
          </p>
        </div>
      </div>
    </section>
  );
};
