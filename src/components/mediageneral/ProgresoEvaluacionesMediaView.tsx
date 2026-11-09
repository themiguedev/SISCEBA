import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG } from '../../types';
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Users,
  Filter,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const ProgresoEvaluacionesMediaView: React.FC = () => {
  const { students, evaluations, activeLapso, areas } = useApp();

  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(activeLapso as 1 | 2 | 3);

  // Estudiantes de Media General
  const mediaStudents = useMemo(() => {
    return (students || []).filter(s => s.level === 'MEDIA_GENERAL');
  }, [students]);

  // Áreas de Media General
  const mediaAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'MEDIA_GENERAL');
  }, [areas]);

  // Semáforo de avance por Año y Sección (Exclusivamente Secciones A y B)
  const sectionsProgress = useMemo(() => {
    const anos = LEVEL_GRADES_CATALOG.MEDIA_GENERAL;
    const sections: ('A' | 'B')[] = ['A', 'B'];

    const result: {
      ano: string;
      seccion: 'A' | 'B';
      totalStudents: number;
      evaluatedCount: number;
      percentage: number;
      status: 'COMPLETO' | 'EN_PROGRESO' | 'SIN_INICIAR';
    }[] = [];

    anos.forEach(ano => {
      sections.forEach(seccion => {
        const salonStudents = mediaStudents.filter(
          s => s.grade === ano && s.section === seccion
        );
        const total = salonStudents.length;

        let evaluated = 0;
        salonStudents.forEach(stu => {
          const hasEval = (evaluations || []).some(
            e => e.studentId === stu.id && e.lapso === selectedLapso && e.scoreNumeric !== undefined
          );
          if (hasEval) evaluated++;
        });

        const percentage = total > 0 ? Math.round((evaluated / total) * 100) : 0;
        const status =
          percentage === 100
            ? 'COMPLETO'
            : percentage > 0
            ? 'EN_PROGRESO'
            : 'SIN_INICIAR';

        result.push({
          ano,
          seccion,
          totalStudents: total,
          evaluatedCount: evaluated,
          percentage,
          status
        });
      });
    });

    return result;
  }, [mediaStudents, evaluations, selectedLapso]);

  // Métrica global
  const globalProgress = useMemo(() => {
    const total = mediaStudents.length;
    if (total === 0) return 0;
    const evaluated = mediaStudents.filter(stu =>
      (evaluations || []).some(
        e => e.studentId === stu.id && e.lapso === selectedLapso && e.scoreNumeric !== undefined
      )
    ).length;
    return Math.round((evaluated / total) * 100);
  }, [mediaStudents, evaluations, selectedLapso]);

  return (
    <div className="space-y-6">
      
      {/* Banner Principal Informativo CBA (Diseño Oficial de Referencia) */}
      <div className="bg-gradient-to-r from-[#2C2E53] via-[#1E2038] to-[#141525] rounded-2xl p-5 sm:p-6 text-white shadow-md border border-[#3D4066] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#0F1122]/90 text-amber-300 border border-[#D4AF37] shadow-xs">
              Control Curricular Oficial
            </span>
            <span className="text-xs text-amber-200/90 font-medium">
              Educación Media General • C.E.O. SISCEBA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-white" />
            Progreso de Evaluaciones
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Monitoreo en tiempo real del cumplimiento de asentamiento de calificaciones vigesimales por año escolar y sección oficial ("A" y "B").
          </p>
        </div>

        {/* Resumen de aula activa y lapso */}
        <div className="flex items-center gap-4 bg-white/10 dark:bg-black/30 border border-white/15 p-3 rounded-2xl shrink-0">
          <div>
            <div className="text-[10px] font-bold text-slate-300 uppercase">Avance General</div>
            <div className="text-2xl font-black text-[#D4AF37] font-mono">{globalProgress}%</div>
          </div>
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
            {([1, 2, 3] as const).map(l => (
              <button
                key={l}
                onClick={() => setSelectedLapso(l)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                  selectedLapso === l
                    ? 'bg-[#D4AF37] text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {l}° Lapso
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid del Semáforo por Sección */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {sectionsProgress.map(sec => (
          <div
            key={`${sec.ano}-${sec.seccion}`}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-xs font-black text-[#2C2E53] dark:text-white">
                  {sec.ano} "{sec.seccion}"
                </span>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  sec.status === 'COMPLETO'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : sec.status === 'EN_PROGRESO'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                }`}>
                  {sec.status === 'COMPLETO' ? 'Completo' : sec.status === 'EN_PROGRESO' ? 'En Carga' : 'Sin Carga'}
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-[#2C2E53] dark:text-slate-100">
                  {sec.percentage}%
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {sec.evaluatedCount}/{sec.totalStudents} evaluados
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    sec.status === 'COMPLETO'
                      ? 'bg-emerald-500'
                      : sec.status === 'EN_PROGRESO'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${sec.percentage}%` }}
                />
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-bold">
                <Users className="w-3 h-3" />
                {sec.totalStudents} Alumnos
              </span>
              <span className="font-mono text-[#D4AF37]">
                Lapso {selectedLapso}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
