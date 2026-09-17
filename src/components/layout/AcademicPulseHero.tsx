import React from 'react';
import { useApp } from '../../context/AppContext';
import { EvaluationRecord } from '../../types';
import {
  Sparkles,
  Users,
  BookOpen,
  Award,
  Bot,
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
  const { currentLevel, students, areas, evaluations, aiActionPlans, activeLapso } = useApp();

  const levelStudents = students.filter(s => s.level === currentLevel);
  const levelAreas = areas.filter(a => a.level === currentLevel);
  const levelRecords = evaluations.filter((r: EvaluationRecord) => r.lapso === activeLapso);

  const levelLabels = {
    INICIAL: { name: 'Educación Inicial', cycle: 'Salas de 3, 4 y 5 Años', scale: 'Evaluación Cualitativa Descriptiva' },
    PRIMARIA: { name: 'Educación Primaria', cycle: '1° a 6° Grado', scale: 'Escala Literal (A - E)' },
    MEDIA_GENERAL: { name: 'Educación Media General', cycle: '1° a 5° Año', scale: 'Escala Numérica Vigagesimal (01 - 20)' }
  };

  const currentInfo = levelLabels[currentLevel];

  return (
    <section className="mb-6 space-y-4 no-print">
      {/* Executive Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B1C33] via-[#2C2E53] to-[#1E2038] text-white p-6 sm:p-8 shadow-2xl border border-[#D4AF37]/30">
        {/* Subtle Background Glow Elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Main Title & Institution Slogan */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-black tracking-widest uppercase">
                {currentInfo.name}
              </span>
              <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Lapso {activeLapso} • Año Lectivo 2026-2027
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Ecosistema Integral de Planificación y Evaluación
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              U.E.P. Colegio Bellas Artes • <span className="text-[#D4AF37] italic">"Tradición, Excelencia y Formación Integral"</span> • Maracaibo
            </p>
          </div>

          {/* Quick Direct Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => onQuickAction('PLANIFICACION', 'PLAN_QUINCENAL')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition shadow-sm"
            >
              <CalendarCheck2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Plan Quincenal</span>
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
              <Bot className="w-4 h-4 text-[#D4AF37]" />
              <span>Asistente IA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Students */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition group">
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

        {/* Card 4: Copiloto IA Pedagógico */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Planes IA</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{aiActionPlans.length}</span>
            <span className="text-[11px] text-purple-600 font-bold">Personalizados</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">Apoyo remedial activo</p>
        </div>
      </div>
    </section>
  );
};
