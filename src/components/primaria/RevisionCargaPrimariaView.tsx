import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG, Student } from '../../types';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Search,
  Filter,
  Users,
  Layers,
  X,
  ExternalLink,
  BookOpen,
  ShieldCheck
} from 'lucide-react';

interface RevisionCargaPrimariaViewProps {
  onGoToSeguimiento?: (grade: string, section: 'A' | 'B') => void;
}

export const RevisionCargaPrimariaView: React.FC<RevisionCargaPrimariaViewProps> = ({
  onGoToSeguimiento
}) => {
  const { students, areas, indicators, evaluations, activeLapso } = useApp();

  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(activeLapso as 1 | 2 | 3);
  const [inspectClassroom, setInspectClassroom] = useState<{
    grado: string;
    seccion: 'A' | 'B';
  } | null>(null);

  // Estudiantes de Primaria
  const primariaStudents = useMemo(() => {
    return (students || []).filter(s => s.level === 'PRIMARIA');
  }, [students]);

  // Áreas de Primaria
  const primariaAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'PRIMARIA');
  }, [areas]);

  // Indicadores de Primaria
  const primariaIndicators = useMemo(() => {
    return (indicators || []).filter(i => i.level === 'PRIMARIA');
  }, [indicators]);

  // Cálculo detallado por cada grado y sección oficial (estrictamente A y B)
  const auditReport = useMemo(() => {
    const grados = LEVEL_GRADES_CATALOG.PRIMARIA;
    const sections: ('A' | 'B')[] = ['A', 'B'];

    const list: {
      grado: string;
      seccion: 'A' | 'B';
      totalAlumnos: number;
      evaluadosQualCount: number;
      porcentajeCarga: number;
      isComplete: boolean;
      areasBreakdown: {
        areaId: string;
        areaName: string;
        evaluadosArea: number;
        porcentajeArea: number;
      }[];
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
            e => e.studentId === stu.id && e.lapso === selectedLapso && e.scoreQualitative !== undefined
          );
          if (hasEval) evaluados++;
        });

        // Cobertura por asignaturas del grado
        const areasBreakdown = primariaAreas.map(a => {
          let countArea = 0;
          salonStudents.forEach(stu => {
            const hasAreaEval = (evaluations || []).some(
              e => e.studentId === stu.id && e.lapso === selectedLapso && e.areaId === a.id && e.scoreQualitative !== undefined
            );
            if (hasAreaEval) countArea++;
          });
          const pct = total > 0 ? Math.round((countArea / total) * 100) : 0;
          return {
            areaId: a.id,
            areaName: a.name,
            evaluadosArea: countArea,
            porcentajeArea: pct
          };
        });

        const porcentaje = total > 0 ? Math.round((evaluados / total) * 100) : 0;
        list.push({
          grado,
          seccion,
          totalAlumnos: total,
          evaluadosQualCount: evaluados,
          porcentajeCarga: porcentaje,
          isComplete: total > 0 && evaluados === total,
          areasBreakdown
        });
      });
    });

    return list;
  }, [primariaStudents, primariaAreas, evaluations, selectedLapso]);

  // Métricas consolidadas de Primaria
  const globalMetrics = useMemo(() => {
    const total = primariaStudents.length;
    let evaluated = 0;
    primariaStudents.forEach(stu => {
      const hasEval = (evaluations || []).some(
        e => e.studentId === stu.id && e.lapso === selectedLapso && e.scoreQualitative !== undefined
      );
      if (hasEval) evaluated++;
    });

    const percent = total > 0 ? Math.round((evaluated / total) * 100) : 0;
    const completedClassrooms = auditReport.filter(c => c.isComplete).length;
    const inProgressClassrooms = auditReport.filter(c => !c.isComplete && c.porcentajeCarga > 0).length;
    const pendingClassrooms = auditReport.filter(c => c.porcentajeCarga === 0).length;

    return {
      total,
      evaluated,
      percent,
      completedClassrooms,
      inProgressClassrooms,
      pendingClassrooms
    };
  }, [primariaStudents, evaluations, selectedLapso, auditReport]);

  // Alumnos del aula inspeccionada en modal
  const inspectedStudents = useMemo(() => {
    if (!inspectClassroom) return [];
    return primariaStudents.filter(
      s => s.grade === inspectClassroom.grado && s.section === inspectClassroom.seccion
    );
  }, [inspectClassroom, primariaStudents]);

  return (
    <div className="space-y-6">
      
      {/* Banner Principal Informativo CBA (Diseño de Referencia Oficial) */}
      <div className="bg-gradient-to-r from-[#2C2E53] via-[#1E2038] to-[#141525] rounded-2xl p-5 sm:p-6 text-white shadow-md border border-[#3D4066] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#0F1122]/90 text-amber-300 border border-[#D4AF37] shadow-xs">
              Control Curricular Oficial
            </span>
            <span className="text-xs text-amber-200/90 font-medium">
              Educación Primaria • C.E.O. SISCEBA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-white" />
            Revisión de la Carga de los Indicadores Evaluados
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Monitoreo del cumplimiento docente en la carga procesal de los criterios formativos (L, A, P, I). Detección oportuna de aulas y áreas con rezago evaluativo.
          </p>
        </div>

        {/* Selector de Lapso */}
        <div className="flex items-center gap-2 bg-white/10 dark:bg-black/30 p-2 rounded-2xl border border-white/15">
          <span className="text-xs font-bold text-amber-200 px-2">Lapso:</span>
          {([1, 2, 3] as const).map(lap => (
            <button
              key={lap}
              onClick={() => setSelectedLapso(lap)}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition cursor-pointer ${
                selectedLapso === lap
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              Lapso {lap}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas KPI de Estado de Carga */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Cobertura Primaria
          </span>
          <strong className="text-2xl font-black text-[#2C2E53] dark:text-[#D4AF37] font-mono mt-0.5 block">
            {globalMetrics.percent}%
          </strong>
          <span className="text-[10px] text-slate-500">
            {globalMetrics.evaluated} de {globalMetrics.total} evaluados
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">
            Aulas Completas (100%)
          </span>
          <strong className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
            {globalMetrics.completedClassrooms} / 12
          </strong>
          <span className="text-[10px] text-slate-500">Carga al día</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block">
            Aulas En Proceso
          </span>
          <strong className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5 block">
            {globalMetrics.inProgressClassrooms}
          </strong>
          <span className="text-[10px] text-slate-500">Carga parcial</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider block">
            Aulas Sin Carga
          </span>
          <strong className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-0.5 block">
            {globalMetrics.pendingClassrooms}
          </strong>
          <span className="text-[10px] text-slate-500">Pendientes de inicio</span>
        </div>
      </div>

      {/* Cuadrícula de Semáforo de las 12 Aulas Oficiales de Primaria */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            <span>Matriz de Secciones Oficiales (Sección A y Sección B)</span>
          </h3>
          <span className="text-[11px] font-bold text-slate-400">
            12 Aulas Oficiales Institucionales
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {auditReport.map(room => (
            <div
              key={`${room.grado}-${room.seccion}`}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3.5 hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {room.grado}
                    </h4>
                    <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400">
                      Sección {room.seccion}
                    </span>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    room.isComplete
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : room.porcentajeCarga > 0
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}>
                    {room.isComplete ? 'Listo (100%)' : room.porcentajeCarga > 0 ? `${room.porcentajeCarga}%` : 'Sin Carga'}
                  </span>
                </div>

                {/* Barra de progreso */}
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-1">
                    <span>Estudiantes evaluados:</span>
                    <span>{room.evaluadosQualCount} de {room.totalAlumnos}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        room.isComplete
                          ? 'bg-emerald-500'
                          : room.porcentajeCarga > 0
                          ? 'bg-amber-500'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${room.porcentajeCarga}%` }}
                    />
                  </div>
                </div>

                {/* Resumen de Áreas */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">
                    Avance por Asignaturas:
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    {room.areasBreakdown.slice(0, 4).map(ab => (
                      <div key={ab.areaId} className="truncate text-slate-600 dark:text-slate-300 flex items-center justify-between">
                        <span className="truncate pr-1">{ab.areaName}:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-white shrink-0">
                          {ab.porcentajeArea}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setInspectClassroom({ grado: room.grado, seccion: room.seccion })}
                  className="px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  Detalle Alumnos
                </button>

                <button
                  type="button"
                  onClick={() => onGoToSeguimiento?.(room.grado, room.seccion)}
                  className="px-2.5 py-1 text-[11px] font-black bg-[#2C2E53] hover:bg-[#1E2038] text-[#D4AF37] rounded-lg transition flex items-center gap-1 shadow-xs"
                >
                  Supervisar
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Detalle de Alumnos del Aula */}
      {inspectClassroom && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Auditoría Individual: {inspectClassroom.grado} - Sección {inspectClassroom.seccion}
                </h3>
                <p className="text-xs text-slate-400">
                  Lapso {selectedLapso} • Total Estudiantes: {inspectedStudents.length}
                </p>
              </div>
              <button
                onClick={() => setInspectClassroom(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {inspectedStudents.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No hay estudiantes registrados en esta aula.
                </div>
              ) : (
                inspectedStudents.map((stu, idx) => {
                  const studentEvals = (evaluations || []).filter(
                    e => e.studentId === stu.id && e.lapso === selectedLapso && e.scoreQualitative !== undefined
                  );
                  const isEvaluated = studentEvals.length > 0;

                  return (
                    <div
                      key={stu.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-slate-400 text-[10px] w-5">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {stu.fullName}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {stu.cedula || 'Sin cédula'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isEvaluated
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}>
                          {isEvaluated ? `${studentEvals.length} criterios evaluados` : 'Sin evaluación'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">
                Escala oficial: L (Logrado), A (Avanzando), P (Proceso), I (Iniciado)
              </span>
              <button
                type="button"
                onClick={() => {
                  const g = inspectClassroom.grado;
                  const s = inspectClassroom.seccion;
                  setInspectClassroom(null);
                  onGoToSeguimiento?.(g, s);
                }}
                className="px-4 py-2 text-xs font-black bg-[#2C2E53] hover:bg-[#1E2038] text-[#D4AF37] rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <span>Abrir en Seguimiento</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
