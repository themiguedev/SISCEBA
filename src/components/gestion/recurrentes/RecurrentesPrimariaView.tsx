import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { LEVEL_GRADES_CATALOG } from '../../../types';
import {
  GraduationCap,
  Tag,
  Wand2,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  BookOpen,
  Heart,
  FileSpreadsheet,
  Award,
  Layers
} from 'lucide-react';
import { IndicadoresSpellCheckModal } from './IndicadoresSpellCheckModal';
import { ObservacionesBoletinModal } from './ObservacionesBoletinModal';
import { LectoescrituraManagerModal } from './LectoescrituraManagerModal';
import { SabanaNotasPensumModal } from './SabanaNotasPensumModal';

interface RecurrentesPrimariaViewProps {
  onOpenIndicatorsBank?: () => void;
  onOpenProcesalGradebook?: () => void;
}

export const RecurrentesPrimariaView: React.FC<RecurrentesPrimariaViewProps> = ({
  onOpenIndicatorsBank,
  onOpenProcesalGradebook
}) => {
  const { students, areas, indicators, evaluations, activeLapso } = useApp();

  // Modals state
  const [isSpellCheckOpen, setIsSpellCheckOpen] = useState(false);
  const [isObservacionesOpen, setIsObservacionesOpen] = useState(false);
  const [isLectoescrituraOpen, setIsLectoescrituraOpen] = useState(false);
  const [isActitudinalOpen, setIsActitudinalOpen] = useState(false);
  const [isSabanaOpen, setIsSabanaOpen] = useState(false);

  // Primaria metrics
  const primariaStudents = useMemo(() => {
    return (students || []).filter(s => s.level === 'PRIMARIA');
  }, [students]);

  const primariaAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'PRIMARIA');
  }, [areas]);

  const primariaIndicators = useMemo(() => {
    return (indicators || []).filter(i => i.level === 'PRIMARIA');
  }, [indicators]);

  // Semáforo de carga cualitativa (L, EP, I) por grado y sección
  const gradosReport = useMemo(() => {
    const grados = LEVEL_GRADES_CATALOG.PRIMARIA;
    const sections: ('A' | 'B')[] = ['A', 'B'];

    const result: {
      grado: string;
      seccion: 'A' | 'B';
      totalAlumnos: number;
      evaluadosQualCount: number;
      porcentajeCarga: number;
      isComplete: boolean;
    }[] = [];

    grados.forEach(grado => {
      sections.forEach(seccion => {
        const salonStudents = primariaStudents.filter(
          s => s.grade === grado && s.section === seccion
        );
        const total = salonStudents.length;

        // Estudiantes con al menos una evaluación cualitativa en el lapso
        let evaluados = 0;
        salonStudents.forEach(stu => {
          const hasEval = (evaluations || []).some(
            e => e.studentId === stu.id && e.lapso === activeLapso && e.scoreQualitative !== undefined
          );
          if (hasEval) evaluados++;
        });

        const porcentaje = total > 0 ? Math.round((evaluados / total) * 100) : 0;
        result.push({
          grado,
          seccion,
          totalAlumnos: total,
          evaluadosQualCount: evaluados,
          porcentajeCarga: porcentaje,
          isComplete: total > 0 && evaluados === total
        });
      });
    });

    return result;
  }, [primariaStudents, evaluations, activeLapso]);

  const globalCoverage = useMemo(() => {
    const total = primariaStudents.length;
    if (total === 0) return 0;
    const evaluated = primariaStudents.filter(stu =>
      (evaluations || []).some(e => e.studentId === stu.id && e.lapso === activeLapso && e.scoreQualitative !== undefined)
    ).length;
    return Math.round((evaluated / total) * 100);
  }, [primariaStudents, evaluations, activeLapso]);

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-[#1B365D] via-[#2C2E53] to-[#1B365D] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#D4AF37]/15 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-white/10 rounded-2xl text-[#D4AF37] border border-white/15">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                  Educación Primaria CBA
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-slate-200 font-mono">
                  Escala Cualitativa (L - EP - I)
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                Supervisión y Tareas Recurrentes de Primaria
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Monitoreo del 1er al 6to grado: seguimiento de cobertura curricular, lectoescritura, promedios MPPE vs CBA y sábanas de notas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 shrink-0">
            <div>
              <div className="text-[10px] text-slate-300 font-bold uppercase">Carga Procesal Primaria</div>
              <div className="text-2xl font-black text-[#D4AF37] font-mono">{globalCoverage}%</div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#D4AF37] flex items-center justify-center font-black text-xs">
              {globalCoverage}%
            </div>
          </div>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Tarea 1: Banco de indicadores */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black">
                <Tag className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-400">
                {primariaIndicators.length} registrados
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Banco de Indicadores
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Criterios de logro organizados de 1er a 6to grado por áreas oficiales e integradas (Robótica, Inglés, etc.).
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Actualizado
            </span>
            <button
              onClick={() => onOpenIndicatorsBank?.()}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-[#2C2E53] hover:text-[#D4AF37] text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1"
            >
              Consultar
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tarea 2: Revisión, redacción y ortografía */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black">
                <Wand2 className="w-5 h-5" />
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-bold">
                Auditoría Ortográfica
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Revisión y Ortografía de Indicadores
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Corrección de sintaxis, acentuación y coherencia con la taxonomía formativa de Educación Primaria.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Taxonomía MPPE
            </span>
            <button
              onClick={() => setIsSpellCheckOpen(true)}
              className="px-3 py-1.5 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
            >
              Auditor Primaria
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tarea 3: Carga de indicadores de Lectoescritura */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-black">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-bold">
                Pilar Estratégico
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Indicadores de Lectoescritura
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Carga y seguimiento de fluidez, velocidad (ppm), niveles de comprensión y caligrafía/ortografía.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              1° a 6° Grado
            </span>
            <button
              onClick={() => setIsLectoescrituraOpen(true)}
              className="px-3 py-1.5 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
            >
              Carga Lectoescritura
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tarea 4: Carga y revisión de indicadores Actitudinales */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black">
                <Heart className="w-5 h-5" />
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-bold">
                Valores y Hábitos
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Indicadores Actitudinales
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Registro de hábitos de trabajo, responsabilidad con tareas, presentación y convivencia escolar.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Cualitativo
            </span>
            <button
              onClick={() => setIsActitudinalOpen(true)}
              className="px-3 py-1.5 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
            >
              Carga Actitudinal
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tarea 5: Lista de observaciones para el boletín */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black">
                <MessageSquare className="w-5 h-5" />
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 font-bold">
                Informes de Lapso
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Observaciones para el Boletín
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Catálogo de frases pedagógicas formativas para el boletín y recomendaciones al hogar.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Predeterminadas
            </span>
            <button
              onClick={() => setIsObservacionesOpen(true)}
              className="px-3 py-1.5 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
            >
              Ver Catálogo
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tarea 6: Clasificaciones y Calificaciones por Curso: MPPE vs CBA */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-bold">
                MPPE vs Pensum CBA
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Calificaciones y Rankings por Curso
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Sábana oficial de notas, promedios desagregados y orden de mérito entre pensum ministerial e institucional.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Sábana y Ranking
            </span>
            <button
              onClick={() => setIsSabanaOpen(true)}
              className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#1B1C33] text-xs font-black rounded-xl transition flex items-center gap-1 shadow-md"
            >
              Abrir Sábana
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Semáforo de Carga de Indicadores Evaluados por Grado y Sección */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h3 className="text-base font-black text-[#2C2E53] dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Revisión de la Carga de Indicadores Evaluados (Escala Cualitativa L, EP, I)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cumplimiento de carga docente en las secciones oficiales A y B de 1er a 6to Grado.
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
            Lapso Activo: {activeLapso}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {gradosReport.map(item => (
            <div
              key={`${item.grado}-${item.seccion}`}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-[#2C2E53] dark:text-slate-200">
                    {item.grado}
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500">
                    Sección {item.seccion}
                  </span>
                </div>

                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  item.isComplete
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : item.porcentajeCarga > 0
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                }`}>
                  {item.isComplete ? 'Listo' : item.porcentajeCarga > 0 ? `${item.porcentajeCarga}%` : 'Pendiente'}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 mb-1">
                  <span>Evaluados:</span>
                  <strong className="font-mono">
                    {item.evaluadosQualCount} de {item.totalAlumnos}
                  </strong>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      item.isComplete
                        ? 'bg-emerald-500'
                        : item.porcentajeCarga > 0
                        ? 'bg-amber-500'
                        : 'bg-rose-400'
                    }`}
                    style={{ width: `${item.porcentajeCarga}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <IndicadoresSpellCheckModal
        isOpen={isSpellCheckOpen}
        onClose={() => setIsSpellCheckOpen(false)}
        initialLevel="PRIMARIA"
      />

      <ObservacionesBoletinModal
        isOpen={isObservacionesOpen}
        onClose={() => setIsObservacionesOpen(false)}
        initialLevel="PRIMARIA"
      />

      <LectoescrituraManagerModal
        isOpen={isLectoescrituraOpen}
        onClose={() => setIsLectoescrituraOpen(false)}
        initialLevel="PRIMARIA"
        initialType="LECTOESCRITURA"
      />

      <LectoescrituraManagerModal
        isOpen={isActitudinalOpen}
        onClose={() => setIsActitudinalOpen(false)}
        initialLevel="PRIMARIA"
        initialType="ACTITUDINAL"
      />

      <SabanaNotasPensumModal
        isOpen={isSabanaOpen}
        onClose={() => setIsSabanaOpen(false)}
        initialLevel="PRIMARIA"
      />

    </div>
  );
};
