import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QualitativeScore,
  LEVEL_GRADES_CATALOG,
  EvaluationRecord,
  Indicator,
  Student
} from '../../types';
import {
  ClipboardList,
  Save,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Check,
  RotateCcw,
  HelpCircle
} from 'lucide-react';

interface SeguimientoIndicadoresPrimariaViewProps {
  initialGrade?: string;
  initialSection?: 'A' | 'B';
  onNavigateToAI?: () => void;
}

export const SeguimientoIndicadoresPrimariaView: React.FC<SeguimientoIndicadoresPrimariaViewProps> = ({
  initialGrade,
  initialSection = 'A',
  onNavigateToAI
}) => {
  const {
    students,
    areas,
    indicators,
    evaluations,
    activeLapso,
    bulkRecordEvaluations,
    showToast,
    isLapsoOpenForGrading,
    currentRole
  } = useApp();

  const isSupervisor = ['ADMINISTRADOR', 'DIRECTOR', 'COORDINACION', 'COORDINADOR'].includes(currentRole);

  // Filtros de navegación pedagógica
  const [selectedGrade, setSelectedGrade] = useState<string>(
    initialGrade || LEVEL_GRADES_CATALOG.PRIMARIA[0]
  );
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>(initialSection);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeIndicatorHover, setActiveIndicatorHover] = useState<Indicator | null>(null);

  // Áreas oficiales de Primaria
  const primariaAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'PRIMARIA');
  }, [areas]);

  // Selección automática de la primera área si no hay una activa
  React.useEffect(() => {
    if ((!selectedAreaId || !primariaAreas.some(a => a.id === selectedAreaId)) && primariaAreas.length > 0) {
      setSelectedAreaId(primariaAreas[0].id);
    }
  }, [primariaAreas, selectedAreaId]);

  // Estudiantes del aula seleccionada (defensa ante listas vacías)
  const salonStudents = useMemo(() => {
    return (students || [])
      .filter(s => s.level === 'PRIMARIA' && s.grade === selectedGrade && s.section === selectedSection)
      .filter(s => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          (s.fullName || '').toLowerCase().includes(term) ||
          (s.cedula || '').toLowerCase().includes(term)
        );
      });
  }, [students, selectedGrade, selectedSection, searchTerm]);

  // Indicadores correspondientes al área y grado
  const areaIndicators = useMemo(() => {
    return (indicators || []).filter(ind => {
      if (ind.level !== 'PRIMARIA') return false;
      if (ind.areaId !== selectedAreaId) return false;
      if (ind.grade && ind.grade !== selectedGrade) return false;
      return true;
    });
  }, [indicators, selectedAreaId, selectedGrade]);

  // Estado local de notas procesales: `${studentId}_${indicatorId}` -> QualitativeScore
  const [localScores, setLocalScores] = useState<Record<string, QualitativeScore>>({});
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Sincronizar desde context al cambiar filtros
  React.useEffect(() => {
    const scoresMap: Record<string, QualitativeScore> = {};
    (evaluations || []).forEach(e => {
      if (e.lapso === activeLapso && e.scoreQualitative) {
        scoresMap[`${e.studentId}_${e.indicatorId}`] = e.scoreQualitative;
      }
    });
    setLocalScores(scoresMap);
    setHasChanges(false);
  }, [evaluations, activeLapso, selectedGrade, selectedSection, selectedAreaId]);

  // Asignar nota a un estudiante
  const handleSetScore = (studentId: string, indicatorId: string, score: QualitativeScore) => {
    const key = `${studentId}_${indicatorId}`;
    setLocalScores(prev => {
      const next = { ...prev };
      if (next[key] === score) {
        delete next[key]; // Toggle off si hace clic sobre la misma
      } else {
        next[key] = score;
      }
      return next;
    });
    setHasChanges(true);
  };

  // Asignar masivamente nota 'L' o 'A' a celdas vacías del indicador
  const handleBulkAssignIndicator = (indicatorId: string, score: QualitativeScore) => {
    setLocalScores(prev => {
      const next = { ...prev };
      salonStudents.forEach(stu => {
        const key = `${stu.id}_${indicatorId}`;
        if (!next[key]) {
          next[key] = score;
        }
      });
      return next;
    });
    setHasChanges(true);
    showToast(`Asignada nota "${score}" a los estudiantes pendientes del indicador.`, 'info');
  };

  // Guardar calificaciones en AppContext
  const handleSaveEvaluations = async () => {
    const evalsToSave: Omit<EvaluationRecord, 'id' | 'recordedAt'>[] = [];

    salonStudents.forEach(stu => {
      areaIndicators.forEach(ind => {
        const key = `${stu.id}_${ind.id}`;
        const score = localScores[key];
        if (score) {
          evalsToSave.push({
            studentId: stu.id,
            areaId: selectedAreaId,
            indicatorId: ind.id,
            moment: 'PROCESAL',
            lapso: activeLapso,
            scoreQualitative: score,
            teacherId: 'admin'
          });
        }
      });
    });

    try {
      await bulkRecordEvaluations(evalsToSave);
      setHasChanges(false);
      showToast('Evaluaciones procesales de Primaria guardadas exitosamente.', 'success');
    } catch {
      showToast('Ocurrió un error al guardar las calificaciones.', 'error');
    }
  };

  // Métricas del aula actual
  const classroomMetrics = useMemo(() => {
    let totalCells = salonStudents.length * areaIndicators.length;
    let filledCells = 0;
    let counts: Record<QualitativeScore, number> = { L: 0, A: 0, P: 0, I: 0 };

    salonStudents.forEach(stu => {
      areaIndicators.forEach(ind => {
        const score = localScores[`${stu.id}_${ind.id}`];
        if (score) {
          filledCells++;
          counts[score] = (counts[score] || 0) + 1;
        }
      });
    });

    const percent = totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0;
    return { totalCells, filledCells, counts, percent };
  }, [salonStudents, areaIndicators, localScores]);

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
            <ClipboardList className="w-6 h-6 text-white" />
            Seguimiento de los Indicadores de Evaluación
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Registro y acompañamiento procesal continuo del logro de los estudiantes por cada indicador en escala cualitativa exclusiva (L, A, P, I).
          </p>
        </div>

        {/* Cobertura del Aula Activa */}
        <div className="flex items-center gap-4 bg-white/10 dark:bg-black/30 border border-white/15 px-4 py-2.5 rounded-xl text-slate-100 shrink-0">
          <div>
            <div className="text-[10px] text-amber-300 font-bold uppercase">Avance del Salón</div>
            <div className="text-xl font-black text-white font-mono">
              {classroomMetrics.percent}%
            </div>
            <div className="text-[10px] text-slate-300">
              {classroomMetrics.filledCells} de {classroomMetrics.totalCells} criterios
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-emerald-400/40 border-t-emerald-400 flex items-center justify-center font-black text-xs text-emerald-300 font-mono">
            {classroomMetrics.percent}%
          </div>
        </div>
      </div>

      {/* Selectores de Grado, Sección, Lapso y Asignatura */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Grado */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Grado
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white"
            >
              {LEVEL_GRADES_CATALOG.PRIMARIA.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Sección (Exclusivamente A y B) */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Sección Oficial
            </label>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['A', 'B'] as const).map(sec => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedSection(sec)}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition ${
                    selectedSection === sec
                      ? 'bg-[#2C2E53] text-[#D4AF37] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Sección {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Área de Aprendizaje */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Área de Formación
            </label>
            <select
              value={selectedAreaId}
              onChange={(e) => setSelectedAreaId(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white min-w-[200px]"
            >
              {primariaAreas.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Búsqueda de alumnos */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Buscar Estudiante
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Nombre o cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Botón Guardar Cambios */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {hasChanges && (
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 animate-pulse flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Cambios sin guardar</span>
            </span>
          )}
          <button
            onClick={handleSaveEvaluations}
            disabled={!hasChanges}
            className={`px-4 py-2 text-xs font-black rounded-xl shadow-sm flex items-center gap-1.5 transition ${
              hasChanges
                ? 'bg-[#2C2E53] hover:bg-[#1E2038] text-[#D4AF37] cursor-pointer shadow-md'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Guardar Evaluaciones</span>
          </button>
        </div>
      </div>

      {/* Convención Cualitativa CBA */}
      <div className="bg-slate-100 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold">
          <Award className="w-4 h-4 text-[#D4AF37]" />
          <span>Convención Cualitativa Oficial de Primaria:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-black">
            L: Logrado ({classroomMetrics.counts.L})
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-black">
            A: Avanzando ({classroomMetrics.counts.A})
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-black">
            P: Proceso ({classroomMetrics.counts.P})
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-black">
            I: Iniciado ({classroomMetrics.counts.I})
          </span>
        </div>
      </div>

      {/* Matriz de Calificación Cualitativa */}
      {salonStudents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-800 dark:text-white">
            No hay estudiantes en {selectedGrade} - Sección {selectedSection}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Verifique la matrícula en el módulo de Gestión Escolar o seleccione otra aula.
          </p>
        </div>
      ) : areaIndicators.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-800 dark:text-white">
            No hay indicadores registrados para esta asignatura en {selectedGrade}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Registre nuevos indicadores en el Banco de Indicadores o en la opción de Curaduría y Redacción.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3.5 font-black text-slate-700 dark:text-slate-200 sticky left-0 bg-slate-50 dark:bg-slate-800 z-10 min-w-[220px]">
                    Estudiante ({salonStudents.length})
                  </th>
                  {areaIndicators.map((ind, idx) => (
                    <th
                      key={ind.id}
                      className="p-3 font-bold text-center border-l border-slate-200 dark:border-slate-800 min-w-[150px] max-w-[200px]"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-mono font-black text-[10px] px-1.5 py-0.5 rounded bg-[#2C2E53] text-[#D4AF37]">
                            {ind.code || `IND-${idx + 1}`}
                          </span>
                        </div>
                        <p
                          className="text-[10px] text-slate-600 dark:text-slate-300 line-clamp-2 cursor-help"
                          title={ind.description}
                        >
                          {ind.description}
                        </p>
                        {/* Botón rápido para asignar 'L' a pendientes */}
                        <button
                          type="button"
                          onClick={() => handleBulkAssignIndicator(ind.id, 'L')}
                          className="text-[9px] font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 underline"
                        >
                          Llenar L vacíos
                        </button>
                      </div>
                    </th>
                  ))}
                  <th className="p-3 font-black text-center border-l border-slate-200 dark:border-slate-800 min-w-[130px]">
                    Balance Cualitativo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {salonStudents.map((stu, sIdx) => {
                  let stuCounts: Record<QualitativeScore, number> = { L: 0, A: 0, P: 0, I: 0 };
                  areaIndicators.forEach(ind => {
                    const sc = localScores[`${stu.id}_${ind.id}`];
                    if (sc) stuCounts[sc] = (stuCounts[sc] || 0) + 1;
                  });

                  return (
                    <tr
                      key={stu.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="p-3.5 sticky left-0 bg-white dark:bg-slate-900 z-10">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] font-mono font-bold text-slate-400 w-5">
                            {sIdx + 1}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-xs">
                              {stu.fullName}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              {stu.cedula || 'Sin cédula'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {areaIndicators.map(ind => {
                        const currentScore = localScores[`${stu.id}_${ind.id}`];
                        const options: QualitativeScore[] = ['L', 'A', 'P', 'I'];

                        return (
                          <td
                            key={ind.id}
                            className="p-2 text-center border-l border-slate-100 dark:border-slate-800/60"
                          >
                            <div className="flex items-center justify-center gap-1">
                              {options.map(opt => {
                                const isSelected = currentScore === opt;
                                const colorClass =
                                  opt === 'L'
                                    ? isSelected
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300'
                                    : opt === 'A'
                                    ? isSelected
                                      ? 'bg-sky-600 text-white shadow-xs'
                                      : 'hover:bg-sky-100 text-sky-800 dark:text-sky-300'
                                    : opt === 'P'
                                    ? isSelected
                                      ? 'bg-amber-500 text-white shadow-xs'
                                      : 'hover:bg-amber-100 text-amber-800 dark:text-amber-300'
                                    : isSelected
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'hover:bg-rose-100 text-rose-800 dark:text-rose-300';

                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => handleSetScore(stu.id, ind.id, opt)}
                                    className={`w-6 h-6 rounded-md font-mono text-[10px] font-black transition-all ${colorClass} ${
                                      isSelected ? 'scale-105 ring-1 ring-black/20' : 'bg-slate-100 dark:bg-slate-800/80'
                                    }`}
                                    title={`${opt} para ${stu.fullName}`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        );
                      })}

                      <td className="p-2.5 text-center border-l border-slate-100 dark:border-slate-800/60">
                        <div className="flex items-center justify-center gap-1 font-mono text-[10px]">
                          <span className="text-emerald-600 font-bold" title="Logrado">
                            {stuCounts.L}L
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-sky-600 font-bold" title="Avanzando">
                            {stuCounts.A}A
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-amber-600 font-bold" title="Proceso">
                            {stuCounts.P}P
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-rose-600 font-bold" title="Iniciado">
                            {stuCounts.I}I
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
