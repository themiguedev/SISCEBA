import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EducationalLevel, Student, LEVEL_GRADES_CATALOG, SubjectArea, EvaluationRecord } from '../../types';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Printer,
  Award,
  Layers,
  GraduationCap,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface RendimientoAuditViewProps {
  isFamilyOrStudent: boolean;
  scopedStudents: Student[];
  simulatedStudentId?: string;
  setSimulatedStudentId?: (id: string) => void;
  overrideStudents?: Student[];
  overrideEvaluations?: EvaluationRecord[];
}

export const RendimientoAuditView: React.FC<RendimientoAuditViewProps> = ({
  isFamilyOrStudent,
  scopedStudents,
  simulatedStudentId,
  setSimulatedStudentId,
  overrideStudents,
  overrideEvaluations
}) => {
  const { students: ctxStudents, evaluations: ctxEvaluations, areas, activeLapso, currentRole, currentUser } = useApp();
  const students = overrideStudents || ctxStudents;
  const evaluations = overrideEvaluations || ctxEvaluations;

  // Filtros de Auditoría UCE
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | EducationalLevel>(() => {
    if (isFamilyOrStudent && scopedStudents[0]?.level) {
      return scopedStudents[0].level;
    }
    return 'MEDIA_GENERAL';
  });

  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedSection, setSelectedSection] = useState<'ALL' | 'A' | 'B'>('ALL');
  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(activeLapso);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Estudiantes a mostrar según filtros y privacidad
  const filteredStudents = useMemo(() => {
    let list = isFamilyOrStudent ? scopedStudents : students;

    if (selectedLevel !== 'ALL') {
      list = list.filter((s) => s.level === selectedLevel);
    }
    if (selectedGrade !== 'ALL') {
      list = list.filter((s) => s.grade === selectedGrade);
    }
    if (selectedSection !== 'ALL') {
      list = list.filter((s) => s.section === selectedSection);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (s) =>
          s.fullName.toLowerCase().includes(term) ||
          s.cedula.toLowerCase().includes(term) ||
          s.representativeName.toLowerCase().includes(term)
      );
    }
    return list;
  }, [students, scopedStudents, isFamilyOrStudent, selectedLevel, selectedGrade, selectedSection, searchTerm]);

  // Áreas aplicables según el nivel seleccionado
  const relevantAreas = useMemo(() => {
    if (selectedLevel === 'ALL') return areas;
    return areas.filter((a) => a.level === selectedLevel);
  }, [areas, selectedLevel]);

  // Helper para Inicial (Escala Literal: A, B, C, D, E según GEMINI.md)
  const getInicialLiteralScore = (studentId: string, areaId: string): string => {
    const recs = evaluations.filter(
      (e) => e.studentId === studentId && e.areaId === areaId && e.lapso === selectedLapso
    );
    if (recs.length === 0) return '-';
    return recs[0].scoreLiteral || '-';
  };

  // Helper para Primaria (Escala Cualitativa: L = Logrado, EP/P = En Proceso, I = Iniciado según GEMINI.md)
  const getPrimariaQualitativeScore = (studentId: string, areaId: string): { code: string; label: string } => {
    const recs = evaluations.filter(
      (e) => e.studentId === studentId && e.areaId === areaId && e.lapso === selectedLapso
    );
    if (recs.length === 0) return { code: '-', label: 'Sin evaluar' };
    const qual = recs[0].scoreQualitative;
    if (qual === 'L') return { code: 'L', label: 'Logrado' };
    if (qual === 'EP' || qual === 'P') return { code: 'EP', label: 'En Proceso' };
    if (qual === 'I') return { code: 'I', label: 'Iniciado' };
    return { code: '-', label: 'Sin evaluar' };
  };

  // Helper para Media General (Numérico vigesimal: 01 a 20)
  const getMediaNumericScore = (studentId: string, areaId: string): number | null => {
    const recs = evaluations.filter(
      (e) => e.studentId === studentId && e.areaId === areaId && e.lapso === selectedLapso
    );
    if (recs.length === 0) return null;

    const finalRec = recs.find((e) => e.moment === 'FINAL_LAPSO');
    if (finalRec && finalRec.scoreNumeric !== undefined) return finalRec.scoreNumeric;

    const numericScores = recs.filter((e) => e.scoreNumeric !== undefined).map((e) => e.scoreNumeric as number);
    if (numericScores.length > 0) {
      const avgScore = numericScores.reduce((a, b) => a + b, 0) / numericScores.length;
      return Math.round(avgScore * 10) / 10;
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-cba-card overflow-hidden print:border-none print:shadow-none print-landscape">
      {/* Official Printable Institutional Header */}
      <div className="hidden print:block mb-4 border-b-2 border-[#2C2E53] pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}logo-cba.png`}
              alt="Colegio Bellas Artes"
              className="h-10 w-auto object-contain"
            />
            <div>
              <span className="text-[9px] font-black uppercase text-slate-500 block">
                República Bolivariana de Venezuela • MPPE • Código DEA S0432D2305
              </span>
              <h1 className="text-sm font-black text-[#2C2E53] tracking-tight">
                U.E.P. COLEGIO BELLAS ARTES • CONSOLA OFICIAL DE RENDIMIENTO ESTUDIANTIL
              </h1>
            </div>
          </div>
          <div className="text-right text-[10px]">
            <span className="font-extrabold text-[#2C2E53] block">
              LAPSO {selectedLapso} • AÑO ESCOLAR 2026-2027
            </span>
            <span className="text-slate-500">Maracaibo, Estado Zulia</span>
          </div>
        </div>
      </div>

      {/* Top Controls & Filters */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-3.5 no-print">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
              {currentRole === 'ESTUDIANTE' ? 'Mis Calificaciones Oficiales' : `Sábana de Rendimiento: Lapso ${selectedLapso}`}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#D4AF37]/15 text-[#94721C] dark:text-amber-300 border border-[#D4AF37]/30">
              Año Escolar 2026 - 2027
            </span>
            {currentRole === 'ESTUDIANTE' && scopedStudents[0] && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                {scopedStudents[0].fullName} • {scopedStudents[0].grade} {scopedStudents[0].section}
              </span>
            )}
          </div>

          {/* Student Simulator Selector (Admin Only) */}
          {currentUser?.role === 'ADMINISTRADOR' && currentRole === 'ESTUDIANTE' && setSimulatedStudentId && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl text-xs">
              <span className="font-bold text-amber-700 dark:text-amber-300 text-[11px] whitespace-nowrap">
                Auditar Alumno:
              </span>
              <select
                value={simulatedStudentId || scopedStudents[0]?.id || ''}
                onChange={(e) => setSimulatedStudentId(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 font-bold text-xs text-slate-800 dark:text-slate-200"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.grade} {s.section} - {s.level})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Search Input for Staff */}
          {!isFamilyOrStudent && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por estudiante, cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
              />
            </div>
          )}
        </div>

        {/* Filters Matrix (Only for non-students) */}
        {!isFamilyOrStudent && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* Level Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-black uppercase text-slate-400 px-2">Nivel:</span>
              {[
                { id: 'MEDIA_GENERAL', label: 'Media G. (01-20)' },
                { id: 'PRIMARIA', label: 'Primaria (L, EP, I)' },
                { id: 'INICIAL', label: 'Inicial (A-E)' },
                { id: 'ALL', label: 'Todos' }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => {
                    setSelectedLevel(lvl.id as any);
                    setSelectedGrade('ALL');
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    selectedLevel === lvl.id
                      ? 'bg-[#1B1C33] text-[#D4AF37] shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>

            {/* Lapso Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-black uppercase text-slate-400 px-2">Lapso:</span>
              {([1, 2, 3] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setSelectedLapso(l)}
                  className={`px-2.5 py-1 text-xs font-black rounded-lg transition ${
                    selectedLapso === l
                      ? 'bg-[#2C2E53] text-[#D4AF37] shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  L{l}
                </button>
              ))}
            </div>

            {/* Grade Selector */}
            {selectedLevel !== 'ALL' && (
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">Todos los Cursos</option>
                {(LEVEL_GRADES_CATALOG[selectedLevel] || []).map((grd) => (
                  <option key={grd} value={grd}>
                    {grd}
                  </option>
                ))}
              </select>
            )}

            {/* Section Selector: EXCLUSIVAMENTE 'A' y 'B' */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-black uppercase text-slate-400 px-2">Sección:</span>
              {(['ALL', 'A', 'B'] as const).map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    selectedSection === sec
                      ? 'bg-[#2C2E53] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {sec === 'ALL' ? 'Todas' : `Sec. ${sec}`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alerta de Estado Inicial de Matrícula (Admin / Directivos) */}
      {!isFamilyOrStudent && students.length === 0 && (
        <div className="m-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-sm">Base de datos en estado inicial de ciclo escolar (Sin alumnos inscritos aún)</p>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Para poblar la sábana de notas oficial, puede inscribir estudiantes desde <strong>Gestión &gt; Inscripciones</strong> o cargar la nómina de alumnos. Todos los selectores de nivel, lapso y secciones A/B están activos para auditar las evaluaciones en cuanto se asienten en el libro digital.
            </p>
          </div>
        </div>
      )}

      {/* Tables by Subsystem */}
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {/* ============================================================== */}
        {/* 1. EDUCACIÓN INICIAL: ESCALA LITERAL (A, B, C, D, E)            */}
        {/* ============================================================== */}
        {(selectedLevel === 'INICIAL' || selectedLevel === 'ALL') && (
          <div>
            <div className="bg-[#2C2E53]/10 dark:bg-[#1A1D36]/60 px-4 py-2.5 border-b border-[#2C2E53]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-xs font-black text-[#2C2E53] dark:text-amber-300 uppercase tracking-wider">
                  Educación Inicial (Salas de 3, 4 y 5 Años) • Evaluación Literal Oficial MPPE
                </span>
              </div>
              <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                Escala Normativa: A • B • C • D • E
              </span>
            </div>
            <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1B1C33] text-[#D4AF37] uppercase text-[10px] tracking-wider font-extrabold sticky top-0 z-10 shadow-xs">
                  <tr>
                    <th className="py-3 px-4">Cédula Escolar</th>
                    <th className="py-3 px-4">Estudiante</th>
                    <th className="py-3 px-4">Sala / Sección</th>
                    {relevantAreas
                      .filter((a) => a.level === 'INICIAL')
                      .slice(0, 5)
                      .map((area) => (
                        <th key={area.id} className="py-3 px-4 text-center">
                          {area.name} ({area.code})
                        </th>
                      ))}
                    <th className="py-3 px-4 text-center">Apreciación del Lapso</th>
                    <th className="py-3 px-4 text-center">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredStudents.filter((s) => s.level === 'INICIAL').length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                        No hay registros de Educación Inicial para los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents
                      .filter((s) => s.level === 'INICIAL')
                      .map((stu) => {
                        const inicialAreas = relevantAreas.filter((a) => a.level === 'INICIAL').slice(0, 5);
                        const scores = inicialAreas.map((a) => getInicialLiteralScore(stu.id, a.id));
                        const validScores = scores.filter((s) => s !== '-');
                        const predominantLiteral = validScores.length > 0 ? validScores[0] : '-';

                        return (
                          <tr key={stu.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-3 px-4 font-mono font-bold text-[#2C2E53] dark:text-amber-300">
                              {stu.cedula}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                              {stu.fullName}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">
                              {stu.grade} Sec. {stu.section}
                            </td>
                            {inicialAreas.map((a) => {
                              const lit = getInicialLiteralScore(stu.id, a.id);
                              return (
                                <td key={a.id} className="py-3 px-4 text-center">
                                  {lit === '-' ? (
                                    <span className="text-slate-400 font-mono">-</span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-xs font-black bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                                      {lit}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                            <td className="py-3 px-4 text-center">
                              {predominantLiteral === '-' ? (
                                <span className="text-[10px] text-slate-400 font-semibold italic">En proceso</span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#D4AF37]/15 text-[#94721C] dark:text-amber-300 border border-[#D4AF37]/40">
                                  Literal {predominantLiteral}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                                Promovido
                              </span>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. EDUCACIÓN PRIMARIA: ESCALA CUALITATIVA (L, P/EP, I)           */}
        {/* ============================================================== */}
        {(selectedLevel === 'PRIMARIA' || selectedLevel === 'ALL') && (
          <div>
            <div className="bg-emerald-900/10 dark:bg-emerald-950/40 px-4 py-2.5 border-b border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                  Educación Primaria (1ero a 6to Grado) • Evaluación Cualitativa Formativa MPPE
                </span>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                Escala Normativa: Logrado (L) • En Proceso (EP) • Iniciado (I)
              </span>
            </div>
            <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1B1C33] text-emerald-300 uppercase text-[10px] tracking-wider font-extrabold sticky top-0 z-10 shadow-xs">
                  <tr>
                    <th className="py-3 px-4">Cédula Escolar</th>
                    <th className="py-3 px-4">Estudiante</th>
                    <th className="py-3 px-4">Grado / Sección</th>
                    {relevantAreas
                      .filter((a) => a.level === 'PRIMARIA')
                      .slice(0, 5)
                      .map((area) => (
                        <th key={area.id} className="py-3 px-4 text-center">
                          {area.name} ({area.code})
                        </th>
                      ))}
                    <th className="py-3 px-4 text-center">Apreciación Global</th>
                    <th className="py-3 px-4 text-center">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredStudents.filter((s) => s.level === 'PRIMARIA').length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                        No hay registros de Educación Primaria para los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents
                      .filter((s) => s.level === 'PRIMARIA')
                      .map((stu) => {
                        const primariaAreas = relevantAreas.filter((a) => a.level === 'PRIMARIA').slice(0, 5);
                        const qualScores = primariaAreas.map((a) => getPrimariaQualitativeScore(stu.id, a.id));
                        const hasEP = qualScores.some((q) => q.code === 'EP');

                        return (
                          <tr key={stu.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-3 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                              {stu.cedula}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                              {stu.fullName}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">
                              {stu.grade} Sec. {stu.section}
                            </td>
                            {primariaAreas.map((a) => {
                              const qual = getPrimariaQualitativeScore(stu.id, a.id);
                              return (
                                <td key={a.id} className="py-3 px-4 text-center">
                                  {qual.code === '-' ? (
                                    <span className="text-slate-400 font-mono">-</span>
                                  ) : (
                                    <span
                                      className={`px-2 py-0.5 rounded text-xs font-black border ${
                                        qual.code === 'L'
                                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                          : qual.code === 'EP'
                                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                                          : 'bg-blue-50 text-blue-800 border-blue-300'
                                      }`}
                                    >
                                      {qual.code}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                                  hasEP
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                }`}
                              >
                                {hasEP ? 'En Proceso (EP)' : 'Logrado (L)'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                Regular
                              </span>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. MEDIA GENERAL: ESCALA CUANTITATIVA VIGESIMAL (01 - 20)        */}
        {/* ============================================================== */}
        {(selectedLevel === 'MEDIA_GENERAL' || selectedLevel === 'ALL') && (
          <div>
            <div className="bg-[#1A1D36]/40 px-4 py-2.5 border-b border-indigo-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span className="text-xs font-black text-indigo-300 uppercase tracking-wider">
                  Educación Media General (1ero a 5to Año) • Escala Cuantitativa Vigesimal
                </span>
              </div>
              <span className="text-[10px] font-extrabold text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-800/40">
                Escala Normativa: 01 a 20 Puntos (Mínimo Aprobatorio: 10)
              </span>
            </div>
            <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1B1C33] text-white uppercase text-[10px] tracking-wider font-extrabold sticky top-0 z-10 shadow-xs">
                  <tr>
                    <th className="py-3 px-4">Cédula</th>
                    <th className="py-3 px-4">Estudiante</th>
                    <th className="py-3 px-4">Año & Sección</th>
                    {relevantAreas
                      .filter((a) => a.level === 'MEDIA_GENERAL')
                      .slice(0, 9)
                      .map((area) => (
                        <th key={area.id} className="py-3 px-3 text-center whitespace-nowrap">
                          {area.name}
                        </th>
                      ))}
                    <th className="py-3 px-4 text-center bg-indigo-950/40">Promedio Lapso</th>
                    <th className="py-3 px-4 text-center">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredStudents.filter((s) => s.level === 'MEDIA_GENERAL').length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-8 text-center text-slate-400 italic">
                        No hay registros de Educación Media General para los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents
                      .filter((s) => s.level === 'MEDIA_GENERAL')
                      .map((stu) => {
                        const mediaAreas = relevantAreas.filter((a) => a.level === 'MEDIA_GENERAL').slice(0, 9);
                        const numericScores = mediaAreas
                          .map((a) => getMediaNumericScore(stu.id, a.id))
                          .filter((val): val is number => val !== null);

                        const avg =
                          numericScores.length > 0
                            ? (numericScores.reduce((a, b) => a + b, 0) / numericScores.length).toFixed(2)
                            : '-';
                        const isPassing = avg !== '-' && Number(avg) >= 10;

                        return (
                          <tr key={stu.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-3 px-4 font-mono font-bold text-[#2C2E53] dark:text-indigo-300">
                              {stu.cedula}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                              {stu.fullName}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">
                              {stu.grade} Sec. {stu.section}
                            </td>
                            {mediaAreas.map((a) => {
                              const score = getMediaNumericScore(stu.id, a.id);
                              return (
                                <td key={a.id} className="py-3 px-4 text-center font-mono font-bold">
                                  {score !== null ? (
                                    <span
                                      className={`px-1.5 py-0.5 rounded ${
                                        score >= 10
                                          ? 'text-slate-800 dark:text-slate-200'
                                          : 'text-rose-600 bg-rose-50 dark:bg-rose-950/40'
                                      }`}
                                    >
                                      {score < 10 ? `0${score}` : score}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                              );
                            })}
                            <td className="py-3 px-4 text-center font-mono font-black bg-indigo-50/50 dark:bg-indigo-950/20">
                              {avg !== '-' ? (
                                <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                                  {avg}
                                </span>
                              ) : (
                                <span className="text-slate-400 font-normal">Sin notas</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {avg === '-' ? (
                                <span className="text-[10px] text-slate-400 font-semibold italic">En curso</span>
                              ) : (
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                                    isPassing
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                      : 'bg-rose-50 text-rose-700 border-rose-300'
                                  }`}
                                >
                                  {isPassing ? 'Aprobado' : 'Materia Pendiente'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Printable Official Signatures & Footer */}
      <div className="hidden print:block pt-8 print-signatures">
        <div className="grid grid-cols-3 gap-6 text-center text-[10px]">
          <div className="border-t border-slate-400 pt-2">
            <strong className="block text-[#2C2E53]">Prof. Docente Guía</strong>
            <span className="text-slate-500">Docente de Asignatura / Curso</span>
          </div>
          <div className="border-t border-slate-400 pt-2">
            <strong className="block text-[#2C2E53]">Lic. Carolina Sánchez</strong>
            <span className="text-slate-500">Coordinación de Evaluación y Control de Estudios</span>
          </div>
          <div className="border-t border-slate-400 pt-2">
            <strong className="block text-[#2C2E53]">Dirección General CBA</strong>
            <span className="text-slate-500">Sello Oficial de Certificación</span>
          </div>
        </div>
        <div className="mt-4 text-[8px] text-slate-400 font-mono text-center">
          Documento Oficial del Sistema Integral de Control y Evaluación (SICE-CBA) • U.E.P. Colegio Bellas Artes • Emisión: {new Date().toLocaleDateString('es-VE')}
        </div>
      </div>
    </div>
  );
};
