import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG, Student, QualitativeScore } from '../../types';
import {
  Award,
  Users,
  Search,
  BookOpen,
  TrendingUp,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Printer,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CalificacionesEstudiantePrimariaView: React.FC = () => {
  const {
    students,
    areas,
    activeLapso,
    calculateStudentPensumAverages,
    evaluations
  } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>(LEVEL_GRADES_CATALOG.PRIMARIA[0]);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(activeLapso as 1 | 2 | 3);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Estudiantes del salón seleccionado (defensa ante listas vacías)
  const salonStudents = useMemo(() => {
    return (students || []).filter(
      s => s.level === 'PRIMARIA' && s.grade === selectedGrade && s.section === selectedSection
    );
  }, [students, selectedGrade, selectedSection]);

  // Selección automática del primer alumno del salón
  React.useEffect(() => {
    if (salonStudents.length > 0) {
      if (!salonStudents.some(s => s.id === selectedStudentId)) {
        setSelectedStudentId(salonStudents[0].id);
      }
    } else {
      setSelectedStudentId('');
    }
  }, [salonStudents, selectedStudentId]);

  // Alumno activo seleccionado
  const activeStudent = useMemo(() => {
    return salonStudents.find(s => s.id === selectedStudentId) || null;
  }, [salonStudents, selectedStudentId]);

  // Áreas de Primaria
  const primariaAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'PRIMARIA');
  }, [areas]);

  // Cálculo comparativo de promedios para todos los alumnos del salón (para rankings)
  const classroomRanking = useMemo(() => {
    const list = salonStudents.map(stu => {
      const averages = calculateStudentPensumAverages(stu.id, selectedLapso);
      return {
        student: stu,
        avgMppe: averages.averageMppe,
        avgCba: averages.averageCba
      };
    });

    const sortedMppe = [...list].sort((a, b) => b.avgMppe - a.avgMppe);
    const sortedCba = [...list].sort((a, b) => b.avgCba - a.avgCba);

    const rankMap: Record<string, { rankMppe: number; rankCba: number; avgMppe: number; avgCba: number }> = {};
    list.forEach(item => {
      const rMppe = sortedMppe.findIndex(s => s.student.id === item.student.id) + 1;
      const rCba = sortedCba.findIndex(s => s.student.id === item.student.id) + 1;
      rankMap[item.student.id] = {
        rankMppe: rMppe,
        rankCba: rCba,
        avgMppe: item.avgMppe,
        avgCba: item.avgCba
      };
    });

    return rankMap;
  }, [salonStudents, selectedLapso, calculateStudentPensumAverages]);

  // Datos detallados del alumno seleccionado
  const studentAverages = useMemo(() => {
    if (!activeStudent) return null;
    return calculateStudentPensumAverages(activeStudent.id, selectedLapso);
  }, [activeStudent, selectedLapso, calculateStudentPensumAverages]);

  // Desglose de materias para el alumno seleccionado
  const subjectsBreakdown = useMemo(() => {
    if (!activeStudent) return [];

    return primariaAreas.map(area => {
      const isMppe = area.type === 'REGULAR';
      const ev = (evaluations || []).find(
        e => e.studentId === activeStudent.id && e.areaId === area.id && e.lapso === selectedLapso
      );
      const qualScore = ev?.scoreQualitative || 'L';

      // Ponderación numérica referencial sobre 20 según escala cualitativa CBA
      const numericWeight: Record<QualitativeScore, number> = {
        L: 20,
        A: 16,
        P: 12,
        I: 8
      };
      const numericEquivalent = numericWeight[qualScore] || 16;

      return {
        areaId: area.id,
        areaName: area.name,
        isMppe,
        pensumTag: isMppe ? 'Pensum MPPE' : 'Institucional CBA',
        qualScore,
        numericEquivalent
      };
    });
  }, [activeStudent, primariaAreas, evaluations, selectedLapso]);

  const activeRanks = activeStudent ? classroomRanking[activeStudent.id] : null;

  return (
    <div className="space-y-6">
      
      {/* Header Institucional */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2C2E53] to-[#1E2038] text-[#D4AF37] flex items-center justify-center font-black shadow-md shrink-0 border border-[#D4AF37]/30">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
                Auditoría de Rendimiento Individual
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Comparativa Ministerial vs Institucional
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#2C2E53] dark:text-white mt-0.5">
              Calificaciones por Estudiante: Promedio MPPE y Promedio CBA
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Análisis comparativo de calificaciones por estudiante: asignaturas oficiales del Pensum MPPE vs. Pensum Integral CBA (incluyendo Robótica, Inglés y programas especiales).
            </p>
          </div>
        </div>

        {/* Selector de Lapso */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-bold text-slate-500 px-2">Momento:</span>
          {([1, 2, 3] as const).map(lap => (
            <button
              key={lap}
              type="button"
              onClick={() => setSelectedLapso(lap)}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition ${
                selectedLapso === lap
                  ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/80'
              }`}
            >
              Lapso {lap}
            </button>
          ))}
        </div>
      </div>

      {/* Selectores de Grado, Sección y Estudiante */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Grado */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
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
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
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

          {/* Selector de Estudiante */}
          <div className="flex-1 min-w-[240px]">
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
              Estudiante ({salonStudents.length} en aula)
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white"
            >
              {salonStudents.length === 0 ? (
                <option value="">Sin estudiantes en este salón</option>
              ) : (
                salonStudents.map(stu => (
                  <option key={stu.id} value={stu.id}>
                    {stu.fullName} ({stu.cedula || 'Sin cédula'})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Contenido del Estudiante */}
      {!activeStudent ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-800 dark:text-white">
            No hay estudiantes en {selectedGrade} - Sección {selectedSection}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Seleccione otro grado o sección para consultar las calificaciones y promedios comparativos.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Ficha Ejecutiva del Estudiante y Comparativa de Promedios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Promedio MPPE */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                    Pensum Ministerial
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    Orden #{activeRanks?.rankMppe || '--'}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white">
                  Promedio Pensum MPPE
                </h3>
                <p className="text-xs text-slate-500">
                  Calculado exclusivamente con las asignaturas oficiales regulares del Ministerio de Educación.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-blue-700 dark:text-blue-400 font-mono">
                    {studentAverages?.averageMppe.toFixed(2) || '0.00'}
                  </span>
                  <span className="text-xs font-bold text-slate-400 ml-1">/ 20</span>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-mono">
                  Escala Ministerial
                </span>
              </div>
            </div>

            {/* Promedio CBA */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                    Pensum Colegio Bellas Artes
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    Orden #{activeRanks?.rankCba || '--'}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white">
                  Promedio Pensum CBA
                </h3>
                <p className="text-xs text-slate-500">
                  Pensum integral institucional que adiciona Robótica Educativa, Informática e Inglés Avanzado.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-[#D4AF37] font-mono">
                    {studentAverages?.averageCba.toFixed(2) || '0.00'}
                  </span>
                  <span className="text-xs font-bold text-slate-400 ml-1">/ 20</span>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-mono">
                  Excelencia CBA
                </span>
              </div>
            </div>

            {/* Brecha y Reconocimiento */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                    Diferencial Académico
                  </span>
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white">
                  Balance Comparativo
                </h3>
                <p className="text-xs text-slate-500">
                  Comparación del impacto de las áreas integradas de enriquecimiento curricular sobre el récord académico.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Variación CBA vs MPPE</div>
                  <div className="text-lg font-black text-slate-800 dark:text-white font-mono">
                    {((studentAverages?.averageCba || 0) - (studentAverages?.averageMppe || 0)) >= 0 ? '+' : ''}
                    {((studentAverages?.averageCba || 0) - (studentAverages?.averageMppe || 0)).toFixed(2)} pts
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Lapso {selectedLapso}
                </span>
              </div>
            </div>

          </div>

          {/* Tabla Desglosada por Asignaturas */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-0">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                  <span>Desglose de Calificaciones por Asignatura</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeStudent.fullName} • {selectedGrade} Sección {selectedSection} • Lapso {selectedLapso}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="p-3.5 font-black">Asignatura</th>
                    <th className="p-3.5 font-black">Régimen de Pensum</th>
                    <th className="p-3.5 font-black text-center">Calificación Cualitativa</th>
                    <th className="p-3.5 font-black text-center">Ponderación Numérica Estimada</th>
                    <th className="p-3.5 font-black text-center">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {subjectsBreakdown.map(sub => (
                    <tr key={sub.areaId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {sub.areaName}
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          sub.isMppe
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}>
                          {sub.pensumTag}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`font-mono text-xs font-black px-2.5 py-1 rounded-lg ${
                          sub.qualScore === 'L'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : sub.qualScore === 'A'
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                            : sub.qualScore === 'P'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}>
                          {sub.qualScore === 'L' ? 'Logrado (L)' : sub.qualScore === 'A' ? 'Avanzando (A)' : sub.qualScore === 'P' ? 'En Proceso (P)' : 'Iniciado (I)'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                        {sub.numericEquivalent} / 20
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Aprobado</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
