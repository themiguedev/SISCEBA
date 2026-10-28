import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { LEVEL_GRADES_CATALOG } from '../../../types';
import {
  BookOpen,
  Scale,
  Percent,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Heart,
  UserCheck,
  Compass,
  FileSpreadsheet,
  Award,
  Layers,
  Palette,
  FileEdit,
  Sliders
} from 'lucide-react';
import { ControlPonderacionesModal } from './ControlPonderacionesModal';
import { ObservacionesBoletinModal } from './ObservacionesBoletinModal';
import { LectoescrituraManagerModal } from './LectoescrituraManagerModal';
import { SabanaNotasPensumModal } from './SabanaNotasPensumModal';

interface RecurrentesMediaViewProps {
  onOpenStrategiesBank?: () => void;
  onOpenProcesalGradebook?: () => void;
  onOpenCouncilMinutes?: () => void;
  onOpenCRPWorkshops?: () => void;
}

export const RecurrentesMediaView: React.FC<RecurrentesMediaViewProps> = ({
  onOpenStrategiesBank,
  onOpenProcesalGradebook,
  onOpenCouncilMinutes,
  onOpenCRPWorkshops
}) => {
  const {
    students,
    areas,
    indicators,
    strategies,
    evaluations,
    activeLapso,
    auditMediaGeneralStrategyWeights
  } = useApp();

  // Modals state
  const [isPonderacionesOpen, setIsPonderacionesOpen] = useState(false);
  const [isObservacionesOpen, setIsObservacionesOpen] = useState(false);
  const [isLectoProyectoOpen, setIsLectoProyectoOpen] = useState(false);
  const [isActitudinalOpen, setIsActitudinalOpen] = useState(false);
  const [isSabanaOpen, setIsSabanaOpen] = useState(false);

  // Media General metrics
  const mediaStudents = useMemo(() => {
    return (students || []).filter(s => s.level === 'MEDIA_GENERAL');
  }, [students]);

  const mediaAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'MEDIA_GENERAL');
  }, [areas]);

  const mediaStrategies = useMemo(() => {
    return (strategies || []).filter(st => st.level === 'MEDIA_GENERAL');
  }, [strategies]);

  // Auditoría general de ponderaciones
  const weightAuditsAll = useMemo(() => {
    const list = auditMediaGeneralStrategyWeights('1er Año', 'A', activeLapso);
    const nonCompliant = list.filter(a => !a.isCompliant).length;
    return {
      total: list.length,
      compliantCount: list.length - nonCompliant,
      nonCompliantCount: nonCompliant
    };
  }, [auditMediaGeneralStrategyWeights, activeLapso]);

  // Semáforo de carga vigesimal (01 - 20) por año y sección
  const anosReport = useMemo(() => {
    const anos = LEVEL_GRADES_CATALOG.MEDIA_GENERAL;
    const sections: ('A' | 'B')[] = ['A', 'B'];

    const result: {
      ano: string;
      seccion: 'A' | 'B';
      totalAlumnos: number;
      evaluadosNumericCount: number;
      porcentajeCarga: number;
      isComplete: boolean;
    }[] = [];

    anos.forEach(ano => {
      sections.forEach(seccion => {
        const salonStudents = mediaStudents.filter(
          s => s.grade === ano && s.section === seccion
        );
        const total = salonStudents.length;

        // Estudiantes con notas vigesimales cargadas en el lapso
        let evaluados = 0;
        salonStudents.forEach(stu => {
          const hasEval = (evaluations || []).some(
            e => e.studentId === stu.id && e.lapso === activeLapso && e.scoreNumeric !== undefined
          );
          if (hasEval) evaluados++;
        });

        const porcentaje = total > 0 ? Math.round((evaluados / total) * 100) : 0;
        result.push({
          ano,
          seccion,
          totalAlumnos: total,
          evaluadosNumericCount: evaluados,
          porcentajeCarga: porcentaje,
          isComplete: total > 0 && evaluados === total
        });
      });
    });

    return result;
  }, [mediaStudents, evaluations, activeLapso]);

  const globalCoverage = useMemo(() => {
    const total = mediaStudents.length;
    if (total === 0) return 0;
    const evaluated = mediaStudents.filter(stu =>
      (evaluations || []).some(e => e.studentId === stu.id && e.lapso === activeLapso && e.scoreNumeric !== undefined)
    ).length;
    return Math.round((evaluated / total) * 100);
  }, [mediaStudents, evaluations, activeLapso]);

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-[#2C2E53] via-[#1B1C33] to-[#2C2E53] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#D4AF37]/15 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-white/10 rounded-2xl text-[#D4AF37] border border-white/15">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                  Educación Media General CBA
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-slate-200 font-mono">
                  Escala Vigesimal (01 - 20)
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                Supervisión y Tareas Recurrentes de Bachillerato
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Control estricto de porcentajes de evaluación (máx. 20%), rasgos actitudinales, autoevaluación, talleres CRP, actas de consejo y comparativa Pensum MPPE vs CBA.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 shrink-0">
            <div>
              <div className="text-[10px] text-slate-300 font-bold uppercase">Carga Procesal Bachillerato</div>
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
        
        {/* Tarea 1: Banco y Selección de Estrategias de Evaluación */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-400">
                {mediaStrategies.length} estrategias
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Banco y Selección de Estrategias
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Catálogo de técnicas e instrumentos formativos y sumativos. Supervisión de variedad didáctica docente.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Diversidad Evaluativa
            </span>
            <button
              onClick={() => onOpenStrategiesBank?.()}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-[#2C2E53] hover:text-[#D4AF37] text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1"
            >
              Consultar
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tarea 2: Control de Porcentajes y Seguimiento de Notas */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black">
                <Percent className="w-5 h-5" />
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 font-bold">
                Tope 20% / Suma 70%
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Control de Porcentajes y Seguimiento
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Auditoría de ponderaciones declaradas por actividad y avance de notas asentadas por cada estrategia.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Normativa MPPE
            </span>
            <button
              onClick={() => setIsPonderacionesOpen(true)}
              className="px-3 py-1.5 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
            >
              Auditor Porcentajes
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tarea 3: Rasgos de la Personalidad y Autoevaluación */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black">
                <Sliders className="w-5 h-5" />
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-bold">
                10% Rasgos + 10% Auto
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Rasgos y Autoevaluación
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Supervisión de los componentes actitudinales (10% docente) y de la autoevaluación reflexiva del estudiante (10%).
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Vigesimal (01 - 20)
            </span>
            <button
              onClick={() => onOpenProcesalGradebook?.()}
              className="px-3 py-1.5 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
            >
              Ver en Cuaderno
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tarea 4: Lectoescritura y Proyecto de Vida */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-black">
                <Compass className="w-5 h-5" />
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-bold">
                Vocación y Ensayos
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Lectoescritura y Proyecto de Vida
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Registro del avance vocacional, metas de vida, comprensión crítica y producción ensayística argumentativa.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Transversales
            </span>
            <button
              onClick={() => setIsLectoProyectoOpen(true)}
              className="px-3 py-1.5 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
            >
              Carga Proyecto
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tarea 5: Ajustes de Calificaciones en Consejos de Cursos */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 flex items-center justify-center font-black">
                <FileEdit className="w-5 h-5" />
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 font-bold">
                Actas Oficiales
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Ajustes en Consejos de Cursos
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Formalización digital de reconsideraciones, nivelaciones y rectificaciones con acta y firma institucional.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Auditoría UCE
            </span>
            <button
              onClick={() => onOpenCouncilMinutes?.()}
              className="px-3 py-1.5 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
            >
              Libro de Actas
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tarea 6: Grupos CRP: Inscripción y Carga de Notas */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center font-black">
                <Palette className="w-5 h-5" />
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 font-bold">
                Escala Literal A - N
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Grupos CRP (Inscripción & Notas)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Talleres de Creación, Recreación y Producción: matriculación de alumnos y asentamiento de notas literales.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Talleres Activos
            </span>
            <button
              onClick={() => onOpenCRPWorkshops?.()}
              className="px-3 py-1.5 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
            >
              Módulo CRP
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tarea 7: Calificaciones y Sábana: MPPE vs CBA */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-bold">
                Pensum MPPE vs CBA
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Calificaciones y Promedios por Curso
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Sábana vigesimal con cálculo de promedios para títulos MPPE y cuadro de honor integral institucional.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              1° a 5° Año
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

        {/* Tarea 8: Lista de observaciones para el boletín */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-9 h-9 rounded-2xl bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 flex items-center justify-center font-black">
                <MessageSquare className="w-5 h-5" />
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 font-bold">
                Apreciaciones Finales
              </span>
            </div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
              Observaciones para el Boletín
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Banco colegiado de recomendaciones, reconocimientos al mérito y observaciones de fin de lapso.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Boletín Media
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

      </div>

      {/* Semáforo de Carga Vigesimal por Año y Sección */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h3 className="text-base font-black text-[#2C2E53] dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Seguimiento de Carga Procesal Vigesimal (01 - 20)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Estado de notas cargadas por año y sección en el lapso activo.
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
            Lapso Activo: {activeLapso}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {anosReport.map(item => (
            <div
              key={`${item.ano}-${item.seccion}`}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-[#2C2E53] dark:text-slate-200">
                    {item.ano}
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
                  <span>Con notas:</span>
                  <strong className="font-mono">
                    {item.evaluadosNumericCount} de {item.totalAlumnos}
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
      <ControlPonderacionesModal
        isOpen={isPonderacionesOpen}
        onClose={() => setIsPonderacionesOpen(false)}
      />

      <ObservacionesBoletinModal
        isOpen={isObservacionesOpen}
        onClose={() => setIsObservacionesOpen(false)}
        initialLevel="MEDIA_GENERAL"
      />

      <LectoescrituraManagerModal
        isOpen={isLectoProyectoOpen}
        onClose={() => setIsLectoProyectoOpen(false)}
        initialLevel="MEDIA_GENERAL"
        initialType="PROYECTO_VIDA"
      />

      <SabanaNotasPensumModal
        isOpen={isSabanaOpen}
        onClose={() => setIsSabanaOpen(false)}
        initialLevel="MEDIA_GENERAL"
      />

    </div>
  );
};
