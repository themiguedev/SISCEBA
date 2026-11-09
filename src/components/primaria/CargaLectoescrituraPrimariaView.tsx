import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Student,
  QualitativeScore,
  LEVEL_GRADES_CATALOG,
  SpecializedSkillRecord
} from '../../types';
import {
  BookOpen,
  Save,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Award,
  Clock,
  Compass,
  FileCheck2
} from 'lucide-react';

// Baremos institucionales de velocidad lectora (Palabras Por Minuto) por grado
const PPM_TARGETS_BY_GRADE: Record<string, { min: number; max: number; label: string }> = {
  '1er Grado': { min: 35, max: 50, label: '35 - 50 ppm' },
  '2do Grado': { min: 60, max: 80, label: '60 - 80 ppm' },
  '3er Grado': { min: 85, max: 100, label: '85 - 100 ppm' },
  '4to Grado': { min: 100, max: 115, label: '100 - 115 ppm' },
  '5to Grado': { min: 115, max: 125, label: '115 - 125 ppm' },
  '6to Grado': { min: 125, max: 140, label: '125 - 140 ppm' }
};

const FLUIDEZ_OPTIONS = [
  'Fluida y con entonación respetando signos de puntuación',
  'Pausada respetando pausas principales de lectura',
  'Silábica o con titubeos y repeticiones frecuentes',
  'Vacilante con omisión o sustitución de fonemas'
];

const COMPRENSION_OPTIONS = [
  'Nivel Inferencial y Crítico destacado',
  'Nivel Literal y Comprensivo satisfactorio',
  'Básico con dificultad para abstraer ideas principales',
  'Incipiente en decodificación de mensajes y textos'
];

const CALIGRAFIA_OPTIONS = [
  'Trazos legibles, ordenados y excelente acentuación',
  'Caligrafía clara con leves fallas ortográficas o acentuales',
  'Trazos irregulares y disortografía en palabras complejas',
  'En consolidación del trazo grafomotor y alineación'
];

export const CargaLectoescrituraPrimariaView: React.FC = () => {
  const { students, activeLapso, showToast, specializedSkills, saveSpecializedSkill } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>(LEVEL_GRADES_CATALOG.PRIMARIA[0]);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(activeLapso as 1 | 2 | 3);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Baremo del grado actual
  const currentPpmTarget = PPM_TARGETS_BY_GRADE[selectedGrade] || { min: 60, max: 80, label: '60-80 ppm' };

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

  // Estado local por estudiante
  interface LectoescrituraState {
    velocidadPpm: number;
    fluidez: string;
    comprension: string;
    caligrafia: string;
    scoreQualitative: QualitativeScore;
    obs: string;
  }

  const [recordsMap, setRecordsMap] = useState<Record<string, LectoescrituraState>>({});
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Sincronizar desde context
  useEffect(() => {
    const map: Record<string, LectoescrituraState> = {};

    salonStudents.forEach(stu => {
      const existing = (specializedSkills || []).find(
        r =>
          r.studentId === stu.id &&
          r.lapso === selectedLapso &&
          r.type === 'LECTOESCRITURA' &&
          r.level === 'PRIMARIA'
      );

      if (existing) {
        map[stu.id] = {
          velocidadPpm: existing.velocidadPpm || currentPpmTarget.min,
          fluidez: existing.fluidezLectora || FLUIDEZ_OPTIONS[0],
          comprension: existing.comprensionLectora || COMPRENSION_OPTIONS[0],
          caligrafia: existing.caligrafiaOrtografia || CALIGRAFIA_OPTIONS[0],
          scoreQualitative: (existing.scoreQualitative as QualitativeScore) || 'L',
          obs: existing.observacionesGenerales || ''
        };
      } else {
        map[stu.id] = {
          velocidadPpm: currentPpmTarget.min,
          fluidez: FLUIDEZ_OPTIONS[0],
          comprension: COMPRENSION_OPTIONS[0],
          caligrafia: CALIGRAFIA_OPTIONS[0],
          scoreQualitative: 'L',
          obs: 'Participación activa en el círculo de lectura y comprensión de textos informativos y narrativos.'
        };
      }
    });

    setRecordsMap(map);
    setHasChanges(false);
  }, [salonStudents, selectedLapso, specializedSkills, currentPpmTarget.min]);

  // Modificar registro
  const handleUpdateRecord = (studentId: string, patch: Partial<LectoescrituraState>) => {
    setRecordsMap(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {
          velocidadPpm: currentPpmTarget.min,
          fluidez: FLUIDEZ_OPTIONS[0],
          comprension: COMPRENSION_OPTIONS[0],
          caligrafia: CALIGRAFIA_OPTIONS[0],
          scoreQualitative: 'L',
          obs: ''
        }),
        ...patch
      }
    }));
    setHasChanges(true);
  };

  // Pre-cargar valores esperados
  const handlePreloadDefaults = () => {
    setRecordsMap(prev => {
      const next: Record<string, LectoescrituraState> = {};
      salonStudents.forEach(stu => {
        next[stu.id] = {
          velocidadPpm: Math.round((currentPpmTarget.min + currentPpmTarget.max) / 2),
          fluidez: FLUIDEZ_OPTIONS[0],
          comprension: COMPRENSION_OPTIONS[1],
          caligrafia: CALIGRAFIA_OPTIONS[0],
          scoreQualitative: 'L',
          obs: prev[stu.id]?.obs || 'Lectura fluida y adecuada comprensión de las ideas principales del texto.'
        };
      });
      return next;
    });
    setHasChanges(true);
    showToast('Plantilla sugerida pre-cargada para el aula.', 'info');
  };

  // Guardar todos los registros de lectoescritura
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      for (const stu of salonStudents) {
        const item = recordsMap[stu.id];
        if (!item) continue;

        const record: SpecializedSkillRecord = {
          id: `lecto-${stu.id}-lapso${selectedLapso}`,
          studentId: stu.id,
          studentName: stu.fullName,
          level: 'PRIMARIA',
          grade: selectedGrade,
          section: selectedSection,
          lapso: selectedLapso,
          type: 'LECTOESCRITURA',
          velocidadPpm: Number(item.velocidadPpm) || currentPpmTarget.min,
          fluidezLectora: item.fluidez,
          comprensionLectora: item.comprension,
          caligrafiaOrtografia: item.caligrafia,
          scoreQualitative: item.scoreQualitative,
          observacionesGenerales: item.obs,
          evaluatedBy: 'Docente Titular / Coordinación Lenguaje',
          evaluatedAt: new Date().toISOString().split('T')[0]
        };

        await saveSpecializedSkill(record);
      }

      setHasChanges(false);
      showToast('Registros de Lectoescritura guardados exitosamente.', 'success');
    } catch {
      showToast('Error al guardar los registros de Lectoescritura.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Estadísticas del aula
  const stats = useMemo(() => {
    const total = salonStudents.length;
    if (total === 0) return { avgPpm: 0, percentInferencial: 0, percentLogrado: 0 };

    let sumPpm = 0;
    let inferencialCount = 0;
    let logradoCount = 0;

    salonStudents.forEach(stu => {
      const r = recordsMap[stu.id];
      if (r) {
        sumPpm += r.velocidadPpm || 0;
        if (r.comprension === COMPRENSION_OPTIONS[0]) inferencialCount++;
        if (r.scoreQualitative === 'L') logradoCount++;
      }
    });

    return {
      avgPpm: Math.round(sumPpm / total),
      percentInferencial: Math.round((inferencialCount / total) * 100),
      percentLogrado: Math.round((logradoCount / total) * 100)
    };
  }, [salonStudents, recordsMap]);

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
            <BookOpen className="w-6 h-6 text-white" />
            Carga de Indicadores de Lectoescritura
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Monitoreo continuo de velocidad lectora (PPM), fluidez, niveles de comprensión (inferencial/literal) y precisión caligráfica-ortográfica en escala oficial (L, A, P, I).
          </p>
        </div>

        {/* Métricas Promedio del Aula */}
        <div className="flex items-center gap-4 bg-white/10 dark:bg-black/30 border border-white/15 px-4 py-2.5 rounded-xl text-slate-100 shrink-0">
          <div>
            <div className="text-[10px] text-amber-300 font-bold uppercase">Promedio Aula</div>
            <div className="text-xl font-black text-white font-mono">
              {stats.avgPpm} <span className="text-xs font-normal text-slate-300">PPM</span>
            </div>
            <div className="text-[10px] text-slate-300">
              Meta: {currentPpmTarget.label}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-indigo-400/40 border-t-indigo-400 flex items-center justify-center font-black text-xs text-indigo-300 font-mono">
            {stats.percentLogrado}%
          </div>
        </div>
      </div>

      {/* Selectores y Filtros */}
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

          {/* Sección Oficial */}
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
              Lapso Activo
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

          {/* Baremo Referencial */}
          <div className="hidden sm:block p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Baremo Oficial:</span>
            <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">
              {currentPpmTarget.label}
            </span>
          </div>

          {/* Búsqueda */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Filtrar
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Nombre de alumno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handlePreloadDefaults}
            className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
          >
            Pre-cargar Metas
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`px-4 py-2 text-xs font-black rounded-xl shadow-sm flex items-center gap-1.5 transition ${
              hasChanges
                ? 'bg-[#2C2E53] hover:bg-[#1E2038] text-[#D4AF37] shadow-md'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Lectoescritura'}</span>
          </button>
        </div>
      </div>

      {/* Lista de Evaluación Individual */}
      {salonStudents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-800 dark:text-white">
            No se encontraron estudiantes en {selectedGrade} - Sección {selectedSection}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Verifique la matrícula en el módulo de Gestión Escolar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {salonStudents.map((stu, sIdx) => {
            const state = recordsMap[stu.id] || {
              velocidadPpm: currentPpmTarget.min,
              fluidez: FLUIDEZ_OPTIONS[0],
              comprension: COMPRENSION_OPTIONS[0],
              caligrafia: CALIGRAFIA_OPTIONS[0],
              scoreQualitative: 'L',
              obs: ''
            };

            const isBelowTarget = state.velocidadPpm < currentPpmTarget.min;
            const isAboveTarget = state.velocidadPpm > currentPpmTarget.max;

            return (
              <div
                key={stu.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5 hover:shadow-sm transition"
              >
                {/* Cabecera del alumno */}
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

                  {/* Calificación Cualitativa General */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Escala Cualitativa:
                    </span>
                    <div className="flex items-center gap-1">
                      {(['L', 'A', 'P', 'I'] as QualitativeScore[]).map(sc => {
                        const isSelected = state.scoreQualitative === sc;
                        const colorClass =
                          sc === 'L'
                            ? isSelected ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:bg-emerald-100'
                            : sc === 'A'
                            ? isSelected ? 'bg-sky-600 text-white shadow-xs' : 'text-sky-700 hover:bg-sky-100'
                            : sc === 'P'
                            ? isSelected ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-700 hover:bg-amber-100'
                            : isSelected ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 hover:bg-rose-100';

                        return (
                          <button
                            key={sc}
                            type="button"
                            onClick={() => handleUpdateRecord(stu.id, { scoreQualitative: sc })}
                            className={`w-7 h-7 rounded-lg font-mono text-xs font-black transition ${colorClass} ${
                              isSelected ? 'scale-105 ring-1 ring-black/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            {sc}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Parámetros de Lectoescritura */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Velocidad PPM */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 block">
                      Velocidad Lectora (PPM)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={10}
                        max={300}
                        value={state.velocidadPpm}
                        onChange={(e) => handleUpdateRecord(stu.id, { velocidadPpm: parseInt(e.target.value) || 0 })}
                        className="w-20 px-2.5 py-1.5 font-mono text-sm font-black rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                        isBelowTarget
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : isAboveTarget
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        {isBelowTarget ? 'Bajo baremo' : isAboveTarget ? 'Avanzado' : 'Esperado'}
                      </span>
                    </div>
                  </div>

                  {/* Fluidez Lectora */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 block">
                      Fluidez y Entonación
                    </label>
                    <select
                      value={state.fluidez}
                      onChange={(e) => handleUpdateRecord(stu.id, { fluidez: e.target.value })}
                      className="w-full px-2 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white"
                    >
                      {FLUIDEZ_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Comprensión Lectora */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 block">
                      Nivel de Comprensión
                    </label>
                    <select
                      value={state.comprension}
                      onChange={(e) => handleUpdateRecord(stu.id, { comprension: e.target.value })}
                      className="w-full px-2 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white"
                    >
                      {COMPRENSION_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Caligrafía y Ortografía */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 block">
                      Caligrafía y Ortografía
                    </label>
                    <select
                      value={state.caligrafia}
                      onChange={(e) => handleUpdateRecord(stu.id, { caligrafia: e.target.value })}
                      className="w-full px-2 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white"
                    >
                      {CALIGRAFIA_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Observación Individual */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                    Observación Pedagógica de Lectura:
                  </label>
                  <input
                    type="text"
                    value={state.obs}
                    onChange={(e) => handleUpdateRecord(stu.id, { obs: e.target.value })}
                    placeholder="Detalles sobre hábitos lectores, tipos de textos preferidos, etc..."
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
