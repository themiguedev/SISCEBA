import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG } from '../../types';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export const CalificacionesGeneralesMediaView: React.FC = () => {
  const { students, areas, activeLapso, calculateStudentPensumAverages, evaluations } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>(LEVEL_GRADES_CATALOG.MEDIA_GENERAL[0]);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(activeLapso as 1 | 2 | 3);
  const [pensumMode, setPensumMode] = useState<'AMBOS' | 'MPPE' | 'CBA'>('AMBOS');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Estudiantes del salón en Media General
  const salonStudents = useMemo(() => {
    return (students || [])
      .filter(s => s.level === 'MEDIA_GENERAL' && s.grade === selectedGrade && s.section === selectedSection)
      .filter(s => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          (s.fullName || '').toLowerCase().includes(term) ||
          (s.cedula || '').toLowerCase().includes(term)
        );
      });
  }, [students, selectedGrade, selectedSection, searchTerm]);

  // Áreas visibles según el modo seleccionado
  const visibleAreas = useMemo(() => {
    const all = (areas || []).filter(a => a.level === 'MEDIA_GENERAL');
    if (pensumMode === 'MPPE') {
      return all.filter(a => a.type === 'REGULAR');
    }
    return all;
  }, [areas, pensumMode]);

  // Cálculo de notas y sábanas
  const matrixData = useMemo(() => {
    const list = salonStudents.map(student => {
      const calc = calculateStudentPensumAverages(student.id, selectedLapso);
      const studentEvals = (evaluations || []).filter(
        e => e.studentId === student.id && e.lapso === selectedLapso
      );

      const areaScores: Record<string, number | undefined> = {};
      visibleAreas.forEach(a => {
        const ev = studentEvals.find(e => e.areaId === a.id);
        areaScores[a.id] = ev?.scoreNumeric;
      });

      return {
        student,
        areaScores,
        avgMppe: calc.averageMppe,
        avgCba: calc.averageCba
      };
    });

    // Calcular rankings
    const sortedMppe = [...list].sort((a, b) => b.avgMppe - a.avgMppe);
    const sortedCba = [...list].sort((a, b) => b.avgCba - a.avgCba);

    return list.map(item => ({
      ...item,
      rankMppe: sortedMppe.findIndex(s => s.student.id === item.student.id) + 1,
      rankCba: sortedCba.findIndex(s => s.student.id === item.student.id) + 1
    }));
  }, [salonStudents, selectedLapso, calculateStudentPensumAverages, evaluations, visibleAreas]);

  const handleExportCSV = () => {
    if (matrixData.length === 0) return;
    const headers = [
      '#',
      'Cédula',
      'Estudiante',
      ...visibleAreas.map(a => `"${a.name}"`),
      'Promedio MPPE',
      'Promedio CBA',
      'Puesto MPPE'
    ];

    const rows = matrixData.map((item, idx) => [
      idx + 1,
      item.student.cedula || 'S/C',
      `"${item.student.fullName}"`,
      ...visibleAreas.map(a => item.areaScores[a.id] ?? '--'),
      item.avgMppe,
      item.avgCba,
      item.rankMppe
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sabana_Calificaciones_Generales_${selectedGrade}_${selectedSection}_Lapso_${selectedLapso}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Barra de Filtros */}
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

          {/* Sección Oficial */}
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

          {/* Modo de Pensum */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Enfoque de Pensum
            </label>
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setPensumMode('AMBOS')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                  pensumMode === 'AMBOS' ? 'bg-[#2C2E53] text-[#D4AF37]' : 'text-slate-500'
                }`}
              >
                Completo
              </button>
              <button
                onClick={() => setPensumMode('MPPE')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                  pensumMode === 'MPPE' ? 'bg-blue-600 text-white' : 'text-slate-500'
                }`}
              >
                Solo MPPE
              </button>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Sábana General */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#D4AF37]" />
              <span>Sábana General de Calificaciones Vigesimales — {selectedGrade} "{selectedSection}"</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Escala Cuantitativa 01 a 20 • Momento {selectedLapso} • {visibleAreas.length} asignaturas evaluadas
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {matrixData.length} alumno(s)
          </span>
        </div>

        {matrixData.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No hay estudiantes registrados en este curso.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-4 sticky left-0 bg-slate-50 dark:bg-slate-900 z-10 shadow-xs">
                    Estudiante / Cédula
                  </th>
                  {visibleAreas.map(area => (
                    <th key={area.id} className="py-3 px-2 text-center min-w-[70px]">
                      <div className="truncate max-w-[90px]" title={area.name}>
                        {area.code || area.name.slice(0, 4)}
                      </div>
                    </th>
                  ))}
                  <th className="py-3 px-3 text-center bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300">
                    Prom. MPPE
                  </th>
                  <th className="py-3 px-3 text-center bg-amber-50/50 dark:bg-amber-950/20 text-[#D4AF37]">
                    Prom. CBA
                  </th>
                  <th className="py-3 px-3 text-center">
                    Puesto
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {matrixData.map((row, idx) => (
                  <tr
                    key={row.student.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-400">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-4 sticky left-0 bg-white dark:bg-slate-900 z-10 shadow-xs">
                      <div className="font-bold text-[#2C2E53] dark:text-slate-100">
                        {row.student.fullName}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {row.student.cedula || 'S/C'}
                      </div>
                    </td>

                    {/* Calificaciones por Materia */}
                    {visibleAreas.map(area => {
                      const score = row.areaScores[area.id];
                      const isGraded = score !== undefined;
                      const isPassing = isGraded && score >= 10;

                      return (
                        <td key={area.id} className="py-2.5 px-2 text-center font-mono font-bold">
                          {isGraded ? (
                            <span className={isPassing ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                              {String(score).padStart(2, '0')}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700">--</span>
                          )}
                        </td>
                      );
                    })}

                    {/* Promedio MPPE */}
                    <td className="py-2.5 px-3 text-center font-mono font-black text-sm bg-blue-50/30 dark:bg-blue-950/10">
                      <span className={row.avgMppe >= 10 ? 'text-blue-700 dark:text-blue-300' : 'text-rose-600 dark:text-rose-400'}>
                        {row.avgMppe > 0 ? row.avgMppe.toFixed(2) : '--'}
                      </span>
                    </td>

                    {/* Promedio CBA */}
                    <td className="py-2.5 px-3 text-center font-mono font-black text-sm bg-amber-50/30 dark:bg-amber-950/10 text-[#D4AF37]">
                      {row.avgCba > 0 ? row.avgCba.toFixed(2) : '--'}
                    </td>

                    {/* Ranking */}
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-500">
                      #{row.rankMppe}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
