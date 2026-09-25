import React from 'react';
import { useApp } from '../../context/AppContext';
import { EvaluationRecord } from '../../types';
import {
  Sparkles,
  Users,
  BookOpen,
  Award,
  ClipboardList,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  CalendarCheck2,
  Clock,
  FileText
} from 'lucide-react';
import { canEditGrades, hasTabAccess } from '../../utils/rbac';

interface AcademicPulseHeroProps {
  onQuickAction: (tab: any, subTab: string) => void;
}

export const AcademicPulseHero: React.FC<AcademicPulseHeroProps> = ({ onQuickAction }) => {
  const { currentLevel, students, areas, evaluations, activeLapso, currentRole, passes, documentRequests } = useApp();

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
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 text-amber-200 border border-amber-400/30 text-[11px] font-extrabold tracking-widest uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Año Escolar 2026 - 2027
              </span>
              <span className="text-slate-300 text-xs font-semibold">• Lapso {activeLapso}</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              {currentRole === 'ASISTENTE'
                ? 'Panel Operativo de Asistencia y Disciplina'
                : currentRole === 'SECRETARIA'
                ? 'Panel de Control de Estudios y Trámites'
                : 'Panel Académico'}
            </h1>
          </div>

          {/* Quick Shortcuts Adaptados por Rol */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full md:w-auto">
            {currentRole === 'ASISTENTE' ? (
              <>
                <button
                  onClick={() => onQuickAction('GESTION', 'PASES')}
                  className="min-h-[48px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#b89327] text-slate-950 text-xs font-black transition shadow-lg shadow-[#D4AF37]/20 active:scale-95 cursor-pointer"
                >
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Emitir Pase</span>
                </button>
                <button
                  onClick={() => onQuickAction('GESTION', 'INASISTENCIAS')}
                  className="min-h-[48px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition border border-white/10 active:scale-95 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Pase de Lista</span>
                </button>
                <button
                  onClick={() => onQuickAction('GESTION', 'CONDUCTAS')}
                  className="col-span-2 sm:col-span-1 min-h-[48px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-black transition shadow-md active:scale-95 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                  <span>Registrar Conducta</span>
                </button>
              </>
            ) : currentRole === 'SECRETARIA' ? (
              <>
                <button
                  onClick={() => onQuickAction('GESTION', 'INSCRIPCIONES')}
                  className="min-h-[48px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#b89327] text-slate-950 text-xs font-black transition shadow-lg shadow-[#D4AF37]/20 active:scale-95 cursor-pointer"
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Inscripción</span>
                </button>
                <button
                  onClick={() => onQuickAction('GESTION', 'DOCUMENTOS')}
                  className="min-h-[48px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition border border-white/10 active:scale-95 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Trámites</span>
                </button>
                <button
                  onClick={() => onQuickAction('GESTION', 'MATRICULA')}
                  className="col-span-2 sm:col-span-1 min-h-[48px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black transition shadow-md active:scale-95 cursor-pointer"
                >
                  <ClipboardList className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Padrón Estudiantil</span>
                </button>
              </>
            ) : hasAcademicModules ? (
              <>
                <button
                  onClick={() => onQuickAction('PLANIFICACION', 'AREAS_PERFILES')}
                  className="min-h-[48px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition border border-white/10 active:scale-95 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Pensum</span>
                </button>

                {canEditGrades(currentRole) && (
                  <button
                    onClick={() => onQuickAction('EVALUACION', 'PROCESAL')}
                    className="min-h-[48px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#b89327] text-slate-950 text-xs font-black transition shadow-lg shadow-[#D4AF37]/20 active:scale-95 cursor-pointer"
                  >
                    <TrendingUp className="w-4 h-4 shrink-0" />
                    <span>Calificar</span>
                  </button>
                )}

                <button
                  onClick={() => onQuickAction('COMUNICACION', 'IA_ACTION_PLANS')}
                  className={`${canEditGrades(currentRole) ? 'col-span-2 sm:col-span-1' : ''} min-h-[48px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black transition shadow-md active:scale-95 cursor-pointer`}
                >
                  <ClipboardList className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Planes de Acción</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onQuickAction('CONSULTAS', 'RENDIMIENTO')}
                className="col-span-2 min-h-[48px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#b89327] text-slate-950 text-xs font-black transition shadow-lg shadow-[#D4AF37]/20 active:scale-95 cursor-pointer"
              >
                <ClipboardList className="w-4 h-4 shrink-0" />
                <span>Consultar Rendimiento</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bento Grid Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Card 1: Students */}
        <div className="bg-white dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estudiantes</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2C2E53] dark:text-sky-300 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{levelStudents.length}</span>
            <span className={`text-[11px] font-bold flex items-center ${levelStudents.length > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
              {levelStudents.length > 0 ? '100% activos' : 'Sin matrícula'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">{currentInfo.cycle}</p>
        </div>

        {/* Card 2: Áreas de Formación */}
        <div className="bg-white dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Áreas / Pensum</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#D4AF37] flex items-center justify-center group-hover:scale-110 transition">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{levelAreas.length}</span>
            <span className="text-[11px] text-[#2C2E53] dark:text-[#F5C842] font-bold">Asignaturas</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">Incluye Robótica y Bellas Artes</p>
        </div>

        {/* Card 3: Evaluaciones Registradas */}
        <div className="bg-white dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Evaluación</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {levelRecords.length > 0 ? (currentLevel === 'MEDIA_GENERAL' ? '18.4' : currentLevel === 'INICIAL' ? 'L' : 'L') : '—'}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              {levelRecords.length > 0
                ? (currentLevel === 'MEDIA_GENERAL' ? '/ 20 Promedio' : currentLevel === 'INICIAL' ? 'Logrado (L)' : 'Logrado (L)')
                : 'Sin registros'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">{currentInfo.scale}</p>
        </div>
      </div>
    </section>
  );
};
