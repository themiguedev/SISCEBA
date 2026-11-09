import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Student,
  QualitativeScore,
  LEVEL_GRADES_CATALOG,
  SpecializedSkillRecord
} from '../../types';
import {
  Heart,
  Save,
  Users,
  CheckCircle2,
  Sparkles,
  Smile,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Filter,
  Search,
  Award,
  BookOpen,
  Layers
} from 'lucide-react';

// Criterios Actitudinales Institucionales para Educación Primaria (CBA)
interface PrimariaAttitudinalCriterion {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
}

const PRIMARIA_ATTITUDINAL_CRITERIA: PrimariaAttitudinalCriterion[] = [
  {
    id: 'act-resp',
    code: 'ACT-RESP',
    title: 'Responsabilidad y Puntualidad',
    description: 'Entrega oportuna de tareas y proyectos, puntualidad en la jornada, cuidado de sus útiles y porte adecuado del uniforme institucional CBA.',
    icon: '⏰'
  },
  {
    id: 'act-hab',
    code: 'ACT-HAB',
    title: 'Hábitos de Estudio y Orden',
    description: 'Mantiene sus cuadernos al día con pulcritud, sigue instrucciones con atención sostenida y organiza eficientemente su puesto de trabajo.',
    icon: '📝'
  },
  {
    id: 'act-conv',
    code: 'ACT-CONV',
    title: 'Convivencia Escolar y Respeto',
    description: 'Practica normas de cortesía, trata con respeto y empatía a sus pares y docentes, y resuelve diferencias mediante el diálogo asertivo.',
    icon: '🤝'
  },
  {
    id: 'act-val',
    code: 'ACT-VAL',
    title: 'Valores y Solidaridad',
    description: 'Demuestra honestidad, compañerismo sincero, disposición a colaborar con sus semejantes y participación cívica respetuosa.',
    icon: '⭐'
  },
  {
    id: 'act-auto',
    code: 'ACT-AUTO',
    title: 'Autonomía y Superación',
    description: 'Muestra iniciativa propia en actividades académicas, resiliencia ante las dificultades y actitud positiva de superación continua.',
    icon: '🚀'
  }
];

export const IndicadoresActitudinalesPrimariaView: React.FC = () => {
  const { students, activeLapso, showToast, specializedSkills, saveSpecializedSkill } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>(LEVEL_GRADES_CATALOG.PRIMARIA[0]);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(activeLapso as 1 | 2 | 3);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Estudiantes del salón seleccionado (defensa ante listas vacías)
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

  // Estado local de valoraciones: studentId -> { criteria: Record<string, QualitativeScore>, generalScore: QualitativeScore, obs: string }
  interface StudentAttitudinalState {
    criteria: Record<string, QualitativeScore>;
    generalScore: QualitativeScore;
    obs: string;
  }

  const [ratingsMap, setRatingsMap] = useState<Record<string, StudentAttitudinalState>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Sincronizar desde specializedSkills
  useEffect(() => {
    const map: Record<string, StudentAttitudinalState> = {};

    salonStudents.forEach(stu => {
      const existing = (specializedSkills || []).find(
        r =>
          r.studentId === stu.id &&
          r.lapso === selectedLapso &&
          r.type === 'ACTITUDINAL' &&
          r.level === 'PRIMARIA'
      );

      if (existing) {
        // Parsear notas de criterios guardadas en habitosTrabajo / convivenciaSocial o defaults
        const parsedCrit: Record<string, QualitativeScore> = {};
        PRIMARIA_ATTITUDINAL_CRITERIA.forEach(c => {
          parsedCrit[c.id] = (existing.scoreQualitative as QualitativeScore) || 'L';
        });

        map[stu.id] = {
          criteria: parsedCrit,
          generalScore: (existing.scoreQualitative as QualitativeScore) || 'L',
          obs: existing.observacionesGenerales || ''
        };
      } else {
        const defaultCrit: Record<string, QualitativeScore> = {};
        PRIMARIA_ATTITUDINAL_CRITERIA.forEach(c => {
          defaultCrit[c.id] = 'L';
        });
        map[stu.id] = {
          criteria: defaultCrit,
          generalScore: 'L',
          obs: 'Demuestra excelente disposición para el trabajo escolar, respeto hacia sus compañeros y cumplimiento regular de sus tareas.'
        };
      }
    });

    setRatingsMap(map);
    setHasUnsavedChanges(false);
  }, [salonStudents, selectedLapso, specializedSkills]);

  // Asignar nota a un criterio de un estudiante
  const handleSetCriterionScore = (studentId: string, criterionId: string, score: QualitativeScore) => {
    setRatingsMap(prev => {
      const current = prev[studentId] || {
        criteria: {},
        generalScore: 'L',
        obs: ''
      };

      const updatedCriteria = {
        ...current.criteria,
        [criterionId]: score
      };

      // Recalcular calificación general sugerida: si hay más de 2 en P o I, baja a P/A
      const scoresList = Object.values(updatedCriteria);
      const lCount = scoresList.filter(s => s === 'L').length;
      const iCount = scoresList.filter(s => s === 'I').length;
      const pCount = scoresList.filter(s => s === 'P').length;

      let calculatedGeneral: QualitativeScore = 'L';
      if (iCount >= 2) calculatedGeneral = 'I';
      else if (pCount >= 2 || (pCount + iCount >= 2)) calculatedGeneral = 'P';
      else if (lCount < scoresList.length) calculatedGeneral = 'A';

      return {
        ...prev,
        [studentId]: {
          ...current,
          criteria: updatedCriteria,
          generalScore: calculatedGeneral
        }
      };
    });
    setHasUnsavedChanges(true);
  };

  // Modificar observación
  const handleSetObs = (studentId: string, obs: string) => {
    setRatingsMap(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { criteria: {}, generalScore: 'L', obs: '' }),
        obs
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Asignar 'L' masivamente a todos los estudiantes de la sección
  const handleBulkSetAll = (score: QualitativeScore) => {
    setRatingsMap(prev => {
      const next: Record<string, StudentAttitudinalState> = {};
      salonStudents.forEach(stu => {
        const crit: Record<string, QualitativeScore> = {};
        PRIMARIA_ATTITUDINAL_CRITERIA.forEach(c => {
          crit[c.id] = score;
        });
        next[stu.id] = {
          criteria: crit,
          generalScore: score,
          obs: prev[stu.id]?.obs || 'Cumplimiento adecuado de las normas institucionales y hábitos de convivencia escolar.'
        };
      });
      return next;
    });
    setHasUnsavedChanges(true);
    showToast(`Asignada nota "${score}" en todos los rasgos actitudinales del aula.`, 'info');
  };

  // Guardar todos los registros
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      for (const stu of salonStudents) {
        const state = ratingsMap[stu.id];
        if (!state) continue;

        const record: SpecializedSkillRecord = {
          id: `act-${stu.id}-lapso${selectedLapso}`,
          studentId: stu.id,
          studentName: stu.fullName,
          level: 'PRIMARIA',
          grade: selectedGrade,
          section: selectedSection,
          lapso: selectedLapso,
          type: 'ACTITUDINAL',
          habitosTrabajo: `Responsabilidad: ${state.criteria['act-resp'] || 'L'}, Hábitos: ${state.criteria['act-hab'] || 'L'}`,
          convivenciaSocial: `Convivencia: ${state.criteria['act-conv'] || 'L'}, Valores: ${state.criteria['act-val'] || 'L'}`,
          autonomiaPersonal: `Autonomía: ${state.criteria['act-auto'] || 'L'}`,
          scoreQualitative: state.generalScore,
          observacionesGenerales: state.obs,
          evaluatedBy: 'Coordinación Pedagógica / Docente Guía',
          evaluatedAt: new Date().toISOString().split('T')[0]
        };

        await saveSpecializedSkill(record);
      }

      setHasUnsavedChanges(false);
      showToast('Indicadores actitudinales de Primaria guardados exitosamente.', 'success');
    } catch {
      showToast('Error al persistir los indicadores actitudinales.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Métricas del aula
  const summaryMetrics = useMemo(() => {
    let lTotal = 0;
    let aTotal = 0;
    let pTotal = 0;
    let iTotal = 0;

    salonStudents.forEach(stu => {
      const g = ratingsMap[stu.id]?.generalScore;
      if (g === 'L') lTotal++;
      else if (g === 'A') aTotal++;
      else if (g === 'P') pTotal++;
      else if (g === 'I') iTotal++;
    });

    return { lTotal, aTotal, pTotal, iTotal };
  }, [salonStudents, ratingsMap]);

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
            <Heart className="w-6 h-6 text-white" />
            Carga y Revisión de los Indicadores Actitudinales
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Valoración formativa de los hábitos de estudio, puntualidad, convivencia escolar, presentación personal y autonomía de los estudiantes en escala cualitativa oficial (L, A, P, I).
          </p>
        </div>

        {/* Resumen del Aula */}
        <div className="flex items-center gap-3 bg-white/10 dark:bg-black/30 border border-white/15 px-4 py-2.5 rounded-xl text-slate-100 shrink-0">
          <div className="text-right">
            <div className="text-[10px] text-amber-300 font-bold uppercase">Balance Aula</div>
            <div className="text-sm font-black text-white font-mono mt-0.5">
              {summaryMetrics.lTotal}L • {summaryMetrics.aTotal}A • {summaryMetrics.pTotal}P • {summaryMetrics.iTotal}I
            </div>
            <div className="text-[10px] text-slate-300">
              {salonStudents.length} estudiantes registrados
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-black">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Selectores de Aula y Filtros */}
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

          {/* Sección Oficial A y B */}
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

          {/* Lapso */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Momento Pedagógico
            </label>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {([1, 2, 3] as const).map(lap => (
                <button
                  key={lap}
                  type="button"
                  onClick={() => setSelectedLapso(lap)}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition ${
                    selectedLapso === lap
                      ? 'bg-[#2C2E53] text-[#D4AF37] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Lapso {lap}
                </button>
              ))}
            </div>
          </div>

          {/* Búsqueda */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrar estudiante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => handleBulkSetAll('L')}
            className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
          >
            Llenar con 'L'
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`px-4 py-2 text-xs font-black rounded-xl shadow-sm flex items-center gap-1.5 transition ${
              hasUnsavedChanges
                ? 'bg-[#2C2E53] hover:bg-[#1E2038] text-[#D4AF37] shadow-md'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Actitudinales'}</span>
          </button>
        </div>
      </div>

      {/* Convención de Rasgos Evaluados */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {PRIMARIA_ATTITUDINAL_CRITERIA.map(crit => (
          <div
            key={crit.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{crit.icon}</span>
              <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                {crit.code}
              </span>
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
              {crit.title}
            </h4>
            <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
              {crit.description}
            </p>
          </div>
        ))}
      </div>

      {/* Lista de Estudiantes con sus Rasgos */}
      {salonStudents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-800 dark:text-white">
            No se encontraron alumnos en {selectedGrade} - Sección {selectedSection}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Compruebe la matrícula en el módulo de Gestión Escolar.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {salonStudents.map((stu, sIdx) => {
            const state = ratingsMap[stu.id] || {
              criteria: {},
              generalScore: 'L',
              obs: ''
            };

            return (
              <div
                key={stu.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:shadow-sm transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono font-bold text-xs text-slate-500 flex items-center justify-center shrink-0">
                      {sIdx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {stu.fullName}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {stu.cedula || 'Sin cédula escolar'} • {selectedGrade} - Sección {selectedSection}
                      </span>
                    </div>
                  </div>

                  {/* Valoración General Cualitativa */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Juicio Global:
                    </span>
                    <span className={`px-2.5 py-1 rounded-xl font-mono text-xs font-black ${
                      state.generalScore === 'L'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : state.generalScore === 'A'
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                        : state.generalScore === 'P'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}>
                      {state.generalScore === 'L' ? 'Logrado (L)' : state.generalScore === 'A' ? 'Avanzando (A)' : state.generalScore === 'P' ? 'En Proceso (P)' : 'Iniciado (I)'}
                    </span>
                  </div>
                </div>

                {/* Grid de los 5 Criterios Actitudinales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {PRIMARIA_ATTITUDINAL_CRITERIA.map(crit => {
                    const currentVal = state.criteria[crit.id] || 'L';
                    const scores: QualitativeScore[] = ['L', 'A', 'P', 'I'];

                    return (
                      <div
                        key={crit.id}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate" title={crit.title}>
                            {crit.icon} {crit.title.split(' ')[0]}
                          </span>
                          <span className="font-mono text-[10px] font-black text-slate-500">
                            {currentVal}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-1 pt-1">
                          {scores.map(sc => {
                            const isSelected = currentVal === sc;
                            const colorClass =
                              sc === 'L'
                                ? isSelected
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                                : sc === 'A'
                                ? isSelected
                                  ? 'bg-sky-600 text-white shadow-xs'
                                  : 'text-sky-700 dark:text-sky-300 hover:bg-sky-100'
                                : sc === 'P'
                                ? isSelected
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'text-amber-700 dark:text-amber-300 hover:bg-amber-100'
                                : isSelected
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-rose-700 dark:text-rose-300 hover:bg-rose-100';

                            return (
                              <button
                                key={sc}
                                type="button"
                                onClick={() => handleSetCriterionScore(stu.id, crit.id, sc)}
                                className={`flex-1 py-1 text-[10px] font-mono font-black rounded-md transition ${colorClass} ${
                                  isSelected ? 'scale-105 ring-1 ring-black/20' : 'bg-white dark:bg-slate-800'
                                }`}
                              >
                                {sc}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Observación Cualitativa del Estudiante */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                    Apreciación Cualitativa Formativa / Recomendación al Hogar:
                  </label>
                  <input
                    type="text"
                    value={state.obs}
                    onChange={(e) => handleSetObs(stu.id, e.target.value)}
                    placeholder="Escriba la apreciación conductual o formativa..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
