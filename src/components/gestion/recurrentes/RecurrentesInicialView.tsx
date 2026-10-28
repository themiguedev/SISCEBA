import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { LEVEL_GRADES_CATALOG } from '../../../types';
import {
  Baby,
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
  Layers,
  Heart
} from 'lucide-react';
import { IndicadoresSpellCheckModal } from './IndicadoresSpellCheckModal';
import { ObservacionesBoletinModal } from './ObservacionesBoletinModal';
import { LectoescrituraManagerModal } from './LectoescrituraManagerModal';

interface RecurrentesInicialViewProps {
  onOpenIndicatorsBank?: () => void;
  onOpenProcesalGradebook?: () => void;
}

export const RecurrentesInicialView: React.FC<RecurrentesInicialViewProps> = ({
  onOpenIndicatorsBank,
  onOpenProcesalGradebook
}) => {
  const { students, areas, indicators, evaluations, activeLapso } = useApp();

  // Modals state
  const [isSpellCheckOpen, setIsSpellCheckOpen] = useState(false);
  const [isObservacionesOpen, setIsObservacionesOpen] = useState(false);
  const [isActitudinalOpen, setIsActitudinalOpen] = useState(false);

  // Inicial metrics
  const inicialStudents = useMemo(() => {
    return (students || []).filter(s => s.level === 'INICIAL');
  }, [students]);

  const inicialAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'INICIAL');
  }, [areas]);

  const inicialIndicators = useMemo(() => {
    return (indicators || []).filter(i => i.level === 'INICIAL');
  }, [indicators]);

  // Carga de notas por sala y sección
  const salasReport = useMemo(() => {
    const salas = LEVEL_GRADES_CATALOG.INICIAL;
    const sections: ('A' | 'B')[] = ['A', 'B'];

    const result: {
      sala: string;
      seccion: 'A' | 'B';
      totalAlumnos: number;
      evaluadosLiteralCount: number;
      porcentajeCarga: number;
      isComplete: boolean;
    }[] = [];

    salas.forEach(sala => {
      sections.forEach(seccion => {
        const salonStudents = inicialStudents.filter(
          s => s.grade === sala && s.section === seccion
        );
        const total = salonStudents.length;

        // Estudiantes que tienen al menos una evaluación literal (A-E) en el lapso
        let evaluados = 0;
        salonStudents.forEach(stu => {
          const hasEval = (evaluations || []).some(
            e => e.studentId === stu.id && e.lapso === activeLapso && e.scoreLiteral !== undefined
          );
          if (hasEval) evaluados++;
        });

        const porcentaje = total > 0 ? Math.round((evaluados / total) * 100) : 0;
        result.push({
          sala,
          seccion,
          totalAlumnos: total,
          evaluadosLiteralCount: evaluados,
          porcentajeCarga: porcentaje,
          isComplete: total > 0 && evaluados === total
        });
      });
    });

    return result;
  }, [inicialStudents, evaluations, activeLapso]);

  const globalCoverage = useMemo(() => {
    const total = inicialStudents.length;
    if (total === 0) return 0;
    const evaluated = inicialStudents.filter(stu =>
      (evaluations || []).some(e => e.studentId === stu.id && e.lapso === activeLapso && e.scoreLiteral !== undefined)
    ).length;
    return Math.round((evaluated / total) * 100);
  }, [inicialStudents, evaluations, activeLapso]);

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-[#2C2E53] via-[#373A6B] to-[#2C2E53] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#D4AF37]/15 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-white/10 rounded-2xl text-[#D4AF37] border border-white/15">
              <Baby className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                  Educación Inicial CBA
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-slate-200 font-mono">
                  Escala Literal (A - E)
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                Supervisión y Tareas Recurrentes de Preescolar
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Control pedagógico de las salas de 3, 4 y 5 años: ortografía de indicadores, cobertura de evaluación formativa y banco de informes descriptivos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 shrink-0">
            <div>
              <div className="text-[10px] text-slate-300 font-bold uppercase">Carga Procesal Global</div>
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
                {inicialIndicators.length} registrados
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Banco de Indicadores
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Catálogo de criterios observables por salas y dimensiones de desarrollo para la primera infancia.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Catálogo al día
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
                Auditoría IA / Sintáctica
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Revisión, Redacción y Ortografía
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Detección de faltas ortográficas, coherencia de verbos de acción infantil y puntuación oficial.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Verbos observables
            </span>
            <button
              onClick={() => setIsSpellCheckOpen(true)}
              className="px-3 py-1.5 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
            >
              Abrir Auditor
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tarea 3: Carga y revisión de indicadores Actitudinales */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black">
                <Heart className="w-5 h-5" />
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-bold">
                Hábitos y Convivencia
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Indicadores Actitudinales
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Carga y supervisión de autonomía, seguimiento de normas, hábitos de trabajo y cuidado personal.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Lapso {activeLapso}
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

        {/* Tarea 4: Lista de observaciones para el boletín */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black">
                <MessageSquare className="w-5 h-5" />
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 font-bold">
                Boletines Informativos
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Observaciones para el Boletín
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Banco de frases predeterminadas para los informes descriptivos de Inicial (Cognitivo, Hábitos y Recomendaciones).
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Categorías oficiales
            </span>
            <button
              onClick={() => setIsObservacionesOpen(true)}
              className="px-3 py-1.5 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
            >
              Abrir Catálogo
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tarea 5: Cuaderno de Carga Procesal */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 flex items-center justify-center font-black">
                <ClipboardList className="w-5 h-5" />
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 font-bold">
                Cuaderno Oficial
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Carga y Asentamiento Procesal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Asentamiento directo de literales (`A`, `B`, `C`, `D`, `E`) por estudiante en el libro oficial.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Calificación directa
            </span>
            <button
              onClick={() => onOpenProcesalGradebook?.()}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-[#2C2E53] hover:text-[#D4AF37] text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1"
            >
              Ir al Cuaderno
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Semáforo de Carga de Indicadores Evaluados por Sala y Sección */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h3 className="text-base font-black text-[#2C2E53] dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Revisión de la Carga de Indicadores Evaluados (Escala Literal A - E)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Estado de llenado del cuaderno procesal en las secciones oficiales A y B de Preescolar.
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
            Lapso Activo: {activeLapso}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {salasReport.map(item => (
            <div
              key={`${item.sala}-${item.seccion}`}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-[#2C2E53] dark:text-slate-200">
                    {item.sala}
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500">
                    Sección {item.seccion}
                  </span>
                </div>

                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                  item.isComplete
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : item.porcentajeCarga > 0
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                }`}>
                  {item.isComplete ? 'Completado' : item.porcentajeCarga > 0 ? 'En Proceso' : 'Pendiente'}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                  <span>Alumnos evaluados:</span>
                  <strong className="font-mono">
                    {item.evaluadosLiteralCount} de {item.totalAlumnos}
                  </strong>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
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
        initialLevel="INICIAL"
      />

      <ObservacionesBoletinModal
        isOpen={isObservacionesOpen}
        onClose={() => setIsObservacionesOpen(false)}
        initialLevel="INICIAL"
      />

      <LectoescrituraManagerModal
        isOpen={isActitudinalOpen}
        onClose={() => setIsActitudinalOpen(false)}
        initialLevel="INICIAL"
        initialType="ACTITUDINAL"
      />

    </div>
  );
};
