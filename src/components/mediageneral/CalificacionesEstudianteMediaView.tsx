import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG } from '../../types';
import {
  Award,
  Users,
  Search,
  BookOpen,
  TrendingUp,
  Printer,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

interface CalificacionesEstudianteMediaViewProps {
  initialStudentId?: string;
}

export const CalificacionesEstudianteMediaView: React.FC<CalificacionesEstudianteMediaViewProps> = ({
  initialStudentId
}) => {
  const { students, areas, activeLapso, calculateStudentPensumAverages, evaluations } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>(LEVEL_GRADES_CATALOG.MEDIA_GENERAL[0]);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(activeLapso as 1 | 2 | 3);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(initialStudentId || '');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Estudiantes del salón en Media General
  const salonStudents = useMemo(() => {
    return (students || []).filter(
      s => s.level === 'MEDIA_GENERAL' && s.grade === selectedGrade && s.section === selectedSection
    );
  }, [students, selectedGrade, selectedSection]);

  // Selección automática del primer alumno si no hay seleccionado
  useEffect(() => {
    if (salonStudents.length > 0) {
      if (!selectedStudentId || !salonStudents.some(s => s.id === selectedStudentId)) {
        setSelectedStudentId(salonStudents[0].id);
      }
    } else {
      setSelectedStudentId('');
    }
  }, [salonStudents, selectedStudentId]);

  // Estudiante activo seleccionado
  const activeStudent = useMemo(() => {
    return salonStudents.find(s => s.id === selectedStudentId) || null;
  }, [salonStudents, selectedStudentId]);

  // Áreas oficiales de Media General
  const mediaAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'MEDIA_GENERAL');
  }, [areas]);

  // Cálculos de promedios para todos los estudiantes de la sección para determinar el ranking
  const rankingList = useMemo(() => {
    const list = salonStudents.map(stu => {
      const calc = calculateStudentPensumAverages(stu.id, selectedLapso);
      return {
        studentId: stu.id,
        avgMppe: calc.averageMppe,
        avgCba: calc.averageCba
      };
    });

    const sortedMppe = [...list].sort((a, b) => b.avgMppe - a.avgMppe);
    const sortedCba = [...list].sort((a, b) => b.avgCba - a.avgCba);

    return {
      getRankMppe: (id: string) => sortedMppe.findIndex(item => item.studentId === id) + 1,
      getRankCba: (id: string) => sortedCba.findIndex(item => item.studentId === id) + 1
    };
  }, [salonStudents, calculateStudentPensumAverages, selectedLapso]);

  // Desglose de materias para el estudiante activo
  const studentSubjectsBreakdown = useMemo(() => {
    if (!activeStudent) return [];

    const studentEvals = (evaluations || []).filter(
      e => e.studentId === activeStudent.id && e.lapso === selectedLapso
    );

    return mediaAreas.map(area => {
      const ev = studentEvals.find(e => e.areaId === area.id);
      const score = ev?.scoreNumeric;
      const isGraded = score !== undefined;
      const isPassing = isGraded && score >= 10;

      return {
        area,
        score,
        isGraded,
        isPassing,
        feedback: ev?.observations || 'Sin observaciones registradas'
      };
    });
  }, [activeStudent, mediaAreas, evaluations, selectedLapso]);

  const activeAverages = useMemo(() => {
    if (!activeStudent) return { averageMppe: 0, averageCba: 0 };
    return calculateStudentPensumAverages(activeStudent.id, selectedLapso);
  }, [activeStudent, calculateStudentPensumAverages, selectedLapso]);

  return (
    <div className="space-y-6">
      
      {/* Controles de Selección */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Año */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Año Escolar
            </label>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#2C2E53] dark:text-slate-100 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              {LEVEL_GRADES_CATALOG.MEDIA_GENERAL.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Sección */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Sección Oficial
            </label>
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['A', 'B'] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    selectedSection === sec
                      ? 'bg-[#2C2E53] text-[#D4AF37] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sección {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Lapso */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Momento / Lapso
            </label>
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {([1, 2, 3] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setSelectedLapso(l)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    selectedLapso === l
                      ? 'bg-[#D4AF37] text-slate-950 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {l}° Lapso
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selector del Estudiante en el Aula */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Estudiante ({salonStudents.length})
            </label>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#2C2E53] dark:text-slate-100 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              {salonStudents.length === 0 ? (
                <option value="">No hay estudiantes inscritos</option>
              ) : (
                salonStudents.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.cedula || 'S/C'})
                  </option>
                ))
              )}
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="mt-4 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-[#2C2E53] hover:text-[#D4AF37] rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Imprimir Ficha</span>
          </button>
        </div>
      </div>

      {!activeStudent ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <GraduationCap className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No se ha seleccionado ningún estudiante
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Seleccione un año y sección con estudiantes matriculados para visualizar el reporte individual de calificaciones vigesimales.
          </p>
        </div>
      ) : (
        <>
          {/* Tarjeta de Resumen del Estudiante */}
          <div className="bg-gradient-to-r from-[#2C2E53] to-[#1E2038] text-white rounded-3xl p-6 shadow-md border border-[#D4AF37]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-2xl text-[#D4AF37] shadow-inner">
                {activeStudent.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37] text-slate-950">
                    {selectedGrade} "{selectedSection}"
                  </span>
                  <span className="text-[10px] font-mono text-slate-300">
                    C.I. {activeStudent.cedula || 'Sin cédula asignada'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black mt-1 text-white">
                  {activeStudent.fullName}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Ficha Académica de Calificaciones Oficiales — Lapso {selectedLapso}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 p-3.5 rounded-2xl border border-white/10 shrink-0">
              <div className="text-center px-2">
                <div className="text-[10px] font-bold text-slate-300 uppercase">Promedio MPPE</div>
                <div className="text-2xl font-black text-[#D4AF37] font-mono">
                  {activeAverages.averageMppe > 0 ? activeAverages.averageMppe.toFixed(2) : '--'}
                </div>
                <div className="text-[10px] text-slate-300 font-mono">
                  Puesto #{rankingList.getRankMppe(activeStudent.id)}
                </div>
              </div>

              <div className="h-10 w-px bg-white/20" />

              <div className="text-center px-2">
                <div className="text-[10px] font-bold text-slate-300 uppercase">Promedio CBA</div>
                <div className="text-2xl font-black text-white font-mono">
                  {activeAverages.averageCba > 0 ? activeAverages.averageCba.toFixed(2) : '--'}
                </div>
                <div className="text-[10px] text-slate-300 font-mono">
                  Puesto #{rankingList.getRankCba(activeStudent.id)}
                </div>
              </div>
            </div>
          </div>

          {/* Grilla de Asignaturas con Calificación Vigesimal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentSubjectsBreakdown.map(({ area, score, isGraded, isPassing, feedback }) => (
              <div
                key={area.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border transition hover:shadow-xs flex flex-col justify-between ${
                  !isGraded
                    ? 'border-slate-200 dark:border-slate-800'
                    : isPassing
                    ? 'border-emerald-200 dark:border-emerald-900/60'
                    : 'border-rose-200 dark:border-rose-900/60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      area.type === 'REGULAR'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                    }`}>
                      {area.type === 'REGULAR' ? 'Pensum Regular MPPE' : 'Complementaria CBA'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {area.code}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
                    {area.name}
                  </h3>

                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-xs font-bold text-slate-500">Nota del Lapso:</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-black font-mono ${
                        !isGraded
                          ? 'text-slate-400'
                          : isPassing
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {isGraded ? String(score).padStart(2, '0') : '--'}
                      </span>
                      <span className="text-xs font-bold text-slate-400">/ 20</span>
                    </div>
                  </div>

                  {/* Barra visual de progreso */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        !isGraded
                          ? 'w-0'
                          : isPassing
                          ? 'bg-emerald-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: isGraded ? `${(Number(score) / 20) * 100}%` : '0%' }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className={`font-bold flex items-center gap-1 ${
                    !isGraded
                      ? 'text-slate-400'
                      : isPassing
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {isGraded ? (
                      isPassing ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Aprobada</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Reprobada (Materia en Riesgo)</span>
                        </>
                      )
                    ) : (
                      <span>Pendiente por asentar</span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};
