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
  CalendarCheck2
} from 'lucide-react';

interface AcademicPulseHeroProps {
  onQuickAction: (tab: 'PLANIFICACION' | 'EVALUACION' | 'COMUNICACION', subTab: string) => void;
}

export const AcademicPulseHero: React.FC<AcademicPulseHeroProps> = ({ onQuickAction }) => {
  const { currentLevel, students, areas, evaluations, activeLapso } = useApp();

  const levelStudents = students.filter(s => s.level === currentLevel);
  const levelAreas = areas.filter(a => a.level === currentLevel);
  const levelRecords = evaluations.filter((r: EvaluationRecord) => r.lapso === activeLapso);

  const levelLabels = {
    INICIAL: { name: 'Educación Inicial', cycle: 'Salas de 3, 4 y 5 Años', scale: 'Evaluación Cualitativa Descriptiva' },
    PRIMARIA: { name: 'Educación Primaria', cycle: '1° a 6° Grado', scale: 'Escala Literal (A - E)' },
    MEDIA_GENERAL: { name: 'Educación Media General', cycle: '1° a 5° Año', scale: 'Escala Numérica Oficial (01 - 20)' }
  };

  const currentInfo = levelLabels[currentLevel];

  return (
    <section aria-label="Resumen ejecutivo institucional" className="space-y-4 mb-6">
      {/* Top Banner with Actions */}
      <div className="bg-gradient-to-r from-[#2C2E53] via-[#242646] to-[#1B1C33] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 text-white shadow-xl border border-[#414474]/50 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-black tracking-widest uppercase">
                <Sparkles className="w-3 h-3" />
                Año Escolar 2026 - 2027
              </span>
              <span className="text-slate-400 text-xs font-semibold">• Lapso {activeLapso}</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Panel Académico Ejecutivo
            </h1>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onQuickAction('PLANIFICACION', 'AREAS_PERFILES')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition border border-white/10"
            >
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>Pensum</span>
            </button>

            <button
              onClick={() => onQuickAction('EVALUACION', 'PROCESAL')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#b89327] text-slate-950 text-xs font-black transition shadow-lg shadow-[#D4AF37]/20"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Calificar</span>
            </button>

            <button
              onClick={() => onQuickAction('COMUNICACION', 'IA_ACTION_PLANS')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black transition shadow-md"
            >
              <ClipboardList className="w-4 h-4 text-[#D4AF37]" />
              <span>Planes de Acción</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Card 1: Students */}
        <div className="bg-white dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estudiantes</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2C2E53] flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{levelStudents.length}</span>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center">
              100% activos
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">{currentInfo.cycle}</p>
        </div>

        {/* Card 2: Áreas de Formación */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Áreas / Pensum</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#D4AF37] flex items-center justify-center group-hover:scale-110 transition">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{levelAreas.length}</span>
            <span className="text-[11px] text-[#2C2E53] font-bold">Asignaturas</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">Incluye Robótica y Bellas Artes</p>
        </div>

        {/* Card 3: Evaluaciones Registradas */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluación</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {currentLevel === 'MEDIA_GENERAL' ? '18.4' : '96%'}
            </span>
            <span className="text-[11px] text-emerald-600 font-bold">
              {currentLevel === 'MEDIA_GENERAL' ? '/ 20 Promedio' : 'Consolidación'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">{currentInfo.scale}</p>
        </div>
      </div>
    </section>
  );
};
