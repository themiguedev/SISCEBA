import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG, Student, QualitativeScore } from '../../types';
import {
  FileSpreadsheet,
  Award,
  Users,
  Search,
  Filter,
  Download,
  Printer,
  Sparkles,
  TrendingUp,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const CalificacionesCursoPrimariaView: React.FC = () => {
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
  const [pensumMode, setPensumMode] = useState<'AMBOS' | 'MPPE' | 'CBA'>('AMBOS');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Estudiantes del aula (defensa ante listas vacías)
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

  // Áreas según el modo de pensum
  const visibleAreas = useMemo(() => {
    const all = (areas || []).filter(a => a.level === 'PRIMARIA');
    if (pensumMode === 'MPPE') {
      return all.filter(a => a.type === 'REGULAR');
    }
    return all;
  }, [areas, pensumMode]);

  // Cálculo de calificaciones y promedios de todo el curso
  const reportData = useMemo(() => {
    const list = salonStudents.map(stu => {
      const calc = calculateStudentPensumAverages(stu.id, selectedLapso);
      return {
        student: stu,
        calc
      };
    });

    // Ordenar rankings
    const sortedCba = [...list].sort((a, b) => b.calc.averageCba - a.calc.averageCba);
    const sortedMppe = [...list].sort((a, b) => b.calc.averageMppe - a.calc.averageMppe);

    return list.map(item => {
      const rankCba = sortedCba.findIndex(s => s.student.id === item.student.id) + 1;
      const rankMppe = sortedMppe.findIndex(s => s.student.id === item.student.id) + 1;
      return {
        ...item,
        rankCba,
        rankMppe
      };
    });
  }, [salonStudents, selectedLapso, calculateStudentPensumAverages]);

  // Estadísticas consolidadas del curso
  const classroomStats = useMemo(() => {
    const total = reportData.length;
    if (total === 0) return { avgMppe: 0, avgCba: 0, topStudents: [] };

    let sumMppe = 0;
    let sumCba = 0;
    reportData.forEach(r => {
      sumMppe += r.calc.averageMppe;
      sumCba += r.calc.averageCba;
    });

    const avgMppe = Number((sumMppe / total).toFixed(2));
    const avgCba = Number((sumCba / total).toFixed(2));
    const topStudents = [...reportData].sort((a, b) => b.calc.averageCba - a.calc.averageCba).slice(0, 3);

    return { avgMppe, avgCba, topStudents };
  }, [reportData]);

  return (
    <div className="space-y-6">
      
      {/* Banner de Cabecera */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2C2E53] to-[#1E2038] text-[#D4AF37] flex items-center justify-center font-black shadow-md shrink-0 border border-[#D4AF37]/30">
            <FileSpreadsheet className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300">
                Sábana de Calificaciones del Curso
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                1er a 6to Grado • Secciones Oficiales A y B
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#2C2E53] dark:text-white mt-0.5">
              Calificaciones por Curso: Pensum MPPE y Pensum CBA
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Consolidado de calificaciones de la sección, promedios comparativos del grupo y cuadro de mérito entre el pensum ministerial y el pensum institucional del Colegio Bellas Artes.
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

      {/* Tarjetas de Estadísticas Globales del Aula */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Matrícula del Aula
          </span>
          <strong className="text-2xl font-black text-[#2C2E53] dark:text-white font-mono mt-0.5 block">
            {salonStudents.length}
          </strong>
          <span className="text-[10px] text-slate-500">
            {selectedGrade} - Sección {selectedSection}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block">
            Promedio Aula MPPE
          </span>
          <strong className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-0.5 block">
            {classroomStats.avgMppe}
          </strong>
          <span className="text-[10px] text-slate-500">
            Asignaturas regulares
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block">
            Promedio Aula CBA
          </span>
          <strong className="text-2xl font-black text-[#D4AF37] font-mono mt-0.5 block">
            {classroomStats.avgCba}
          </strong>
          <span className="text-[10px] text-slate-500">
            Pensum integral completo
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider block">
            Diferencial Aula
          </span>
          <strong className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono mt-0.5 block">
            {(classroomStats.avgCba - classroomStats.avgMppe) >= 0 ? '+' : ''}
            {(classroomStats.avgCba - classroomStats.avgMppe).toFixed(2)}
          </strong>
          <span className="text-[10px] text-slate-500">
            Impacto áreas integradas
          </span>
        </div>
      </div>

      {/* Selectores y Filtro de Pensum */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
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

          {/* Sección Oficial */}
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

          {/* Selector de Pensum */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
              Régimen de Pensum
            </label>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-black">
              <button
                type="button"
                onClick={() => setPensumMode('AMBOS')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  pensumMode === 'AMBOS'
                    ? 'bg-[#2C2E53] text-[#D4AF37] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Comparativo (Ambos)
              </button>
              <button
                type="button"
                onClick={() => setPensumMode('MPPE')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  pensumMode === 'MPPE'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Solo Pensum MPPE
              </button>
              <button
                type="button"
                onClick={() => setPensumMode('CBA')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  pensumMode === 'CBA'
                    ? 'bg-[#D4AF37] text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Pensum Integral CBA
              </button>
            </div>
          </div>

          {/* Búsqueda */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
              Buscar Alumno
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

        {/* Imprimir Sábana */}
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 text-xs font-black rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-[#2C2E53] hover:text-[#D4AF37] transition flex items-center gap-1.5 shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Sábana</span>
        </button>
      </div>

      {/* Sábana de Calificaciones */}
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
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  <th className="p-3.5 font-black sticky left-0 bg-slate-50 dark:bg-slate-800 z-10 min-w-[200px]">
                    Nómina Estudiantil
                  </th>
                  {visibleAreas.map(a => (
                    <th key={a.id} className="p-3 font-bold text-center border-l border-slate-200 dark:border-slate-800 min-w-[110px]">
                      <div className="space-y-0.5">
                        <span className="block truncate font-black text-slate-900 dark:text-white text-[11px]" title={a.name}>
                          {a.name}
                        </span>
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md ${
                          a.type === 'REGULAR'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}>
                          {a.type === 'REGULAR' ? 'MPPE' : 'CBA'}
                        </span>
                      </div>
                    </th>
                  ))}
                  {(pensumMode === 'AMBOS' || pensumMode === 'MPPE') && (
                    <th className="p-3 font-black text-center border-l border-slate-200 dark:border-slate-800 min-w-[95px] bg-blue-50/50 dark:bg-blue-950/20">
                      Prom. MPPE
                    </th>
                  )}
                  {(pensumMode === 'AMBOS' || pensumMode === 'CBA') && (
                    <th className="p-3 font-black text-center border-l border-slate-200 dark:border-slate-800 min-w-[95px] bg-amber-50/50 dark:bg-amber-950/20">
                      Prom. CBA
                    </th>
                  )}
                  <th className="p-3 font-black text-center border-l border-slate-200 dark:border-slate-800 min-w-[80px]">
                    Ranking
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reportData.map((item, idx) => (
                  <tr key={item.student.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5 sticky left-0 bg-white dark:bg-slate-900 z-10">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400 w-5">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs">
                            {item.student.fullName}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {item.student.cedula || 'Sin cédula'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {visibleAreas.map(a => {
                      const ev = (evaluations || []).find(
                        e => e.studentId === item.student.id && e.areaId === a.id && e.lapso === selectedLapso
                      );
                      const score = ev?.scoreQualitative || 'L';

                      return (
                        <td key={a.id} className="p-2.5 text-center border-l border-slate-100 dark:border-slate-800/60">
                          <span className={`font-mono text-xs font-black px-2 py-0.5 rounded-md ${
                            score === 'L'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : score === 'A'
                              ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                              : score === 'P'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}>
                            {score}
                          </span>
                        </td>
                      );
                    })}

                    {(pensumMode === 'AMBOS' || pensumMode === 'MPPE') && (
                      <td className="p-2.5 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-black text-blue-700 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-950/10">
                        {item.calc.averageMppe.toFixed(2)}
                      </td>
                    )}

                    {(pensumMode === 'AMBOS' || pensumMode === 'CBA') && (
                      <td className="p-2.5 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-black text-[#D4AF37] bg-amber-50/20 dark:bg-amber-950/10">
                        {item.calc.averageCba.toFixed(2)}
                      </td>
                    )}

                    <td className="p-2.5 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono text-[11px] font-black text-slate-700 dark:text-slate-300">
                      #{item.rankCba}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cuadro de Honor del Aula */}
      {classroomStats.topStudents.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>Cuadro de Honor y Máximos Rendimientos CBA</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">
              {selectedGrade} - Sección {selectedSection} • Lapso {selectedLapso}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classroomStats.topStudents.map((top, idx) => (
              <div
                key={top.student.id}
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  idx === 0
                    ? 'bg-amber-500/10 border-amber-400/60 text-slate-900 dark:text-white'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                    idx === 0
                      ? 'bg-[#D4AF37] text-slate-950 shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}>
                    {idx + 1}°
                  </div>
                  <div>
                    <h4 className="text-xs font-black truncate max-w-[150px]">
                      {top.student.fullName}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      MPPE: {top.calc.averageMppe.toFixed(2)} pts
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-[#D4AF37] font-mono block">
                    {top.calc.averageCba.toFixed(2)}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">CBA</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
