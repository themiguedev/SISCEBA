import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { EducationalLevel, LEVEL_GRADES_CATALOG } from '../../../types';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  Filter,
  X,
  Award,
  Layers,
  GraduationCap,
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface SabanaNotasPensumModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLevel?: EducationalLevel;
}

export const SabanaNotasPensumModal: React.FC<SabanaNotasPensumModalProps> = ({
  isOpen,
  onClose,
  initialLevel = 'MEDIA_GENERAL'
}) => {
  const {
    students,
    areas,
    activeLapso,
    calculateStudentPensumAverages
  } = useApp();

  const [selectedLevel, setSelectedLevel] = useState<EducationalLevel>(
    initialLevel === 'INICIAL' ? 'PRIMARIA' : initialLevel
  );
  const [selectedGrade, setSelectedGrade] = useState<string>(
    LEVEL_GRADES_CATALOG[selectedLevel][0]
  );
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(activeLapso);
  const [pensumMode, setPensumMode] = useState<'MPPE' | 'CBA'>('CBA');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sincronizar grado al cambiar nivel
  const handleLevelChange = (lvl: EducationalLevel) => {
    setSelectedLevel(lvl);
    setSelectedGrade(LEVEL_GRADES_CATALOG[lvl][0]);
  };

  // Filtrar áreas según nivel y modo de pensum
  const levelAreas = useMemo(() => {
    const all = (areas || []).filter(a => a.level === selectedLevel);
    if (pensumMode === 'MPPE') {
      return all.filter(a => a.type === 'REGULAR');
    }
    return all;
  }, [areas, selectedLevel, pensumMode]);

  // Estudiantes del salón (Defensive)
  const targetStudents = useMemo(() => {
    return (students || []).filter(s => {
      if (s.level !== selectedLevel) return false;
      if (s.grade !== selectedGrade) return false;
      if (s.section !== selectedSection) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const name = (s.fullName || '').toLowerCase();
        const ced = (s.cedula || '').toLowerCase();
        if (!name.includes(term) && !ced.includes(term)) return false;
      }
      return true;
    });
  }, [students, selectedLevel, selectedGrade, selectedSection, searchTerm]);

  // Generar reporte comparativo con rankings para cada estudiante
  const reportData = useMemo(() => {
    const list = targetStudents.map(stu => {
      const calc = calculateStudentPensumAverages(stu.id, selectedLapso);
      return {
        student: stu,
        calc
      };
    });

    // Ordenar para ranking CBA y ranking MPPE
    const sortedByCba = [...list].sort((a, b) => b.calc.averageCba - a.calc.averageCba);
    const sortedByMppe = [...list].sort((a, b) => b.calc.averageMppe - a.calc.averageMppe);

    return list.map(item => {
      const rankCba = sortedByCba.findIndex(s => s.student.id === item.student.id) + 1;
      const rankMppe = sortedByMppe.findIndex(s => s.student.id === item.student.id) + 1;
      return {
        ...item,
        rankCba,
        rankMppe
      };
    });
  }, [targetStudents, selectedLapso, calculateStudentPensumAverages]);

  // Estadísticas del curso
  const courseStats = useMemo(() => {
    if (reportData.length === 0) return { avgMppe: 0, avgCba: 0, countAprobados: 0, countReprobados: 0 };
    const sumM = reportData.reduce((acc, curr) => acc + curr.calc.averageMppe, 0);
    const sumC = reportData.reduce((acc, curr) => acc + curr.calc.averageCba, 0);
    const passingThreshold = selectedLevel === 'MEDIA_GENERAL' ? 10 : 12;
    const aprobados = reportData.filter(r => r.calc.averageCba >= passingThreshold).length;
    return {
      avgMppe: Number((sumM / reportData.length).toFixed(2)),
      avgCba: Number((sumC / reportData.length).toFixed(2)),
      countAprobados: aprobados,
      countReprobados: reportData.length - aprobados
    };
  }, [reportData, selectedLevel]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Nro', 'Cédula', 'Estudiante', ...levelAreas.map(a => a.name), 'Promedio MPPE', 'Rank MPPE', 'Promedio CBA', 'Rank CBA'];
    const rows = reportData.map((item, idx) => {
      const scores = levelAreas.map(a => {
        const found = item.calc.cbaDetails.find(d => d.areaId === a.id);
        return found ? found.score : '--';
      });
      return [
        idx + 1,
        item.student.cedula,
        `"${item.student.fullName}"`,
        ...scores,
        item.calc.averageMppe,
        item.rankMppe,
        item.calc.averageCba,
        item.rankCba
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sabana_Notas_${selectedGrade}_Sec_${selectedSection}_Lapso_${selectedLapso}_${pensumMode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-7xl max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#2C2E53] p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl text-[#D4AF37] border border-white/10">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Sábana de Calificaciones y Clasificaciones por Curso
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#1B1C33] font-bold">
                  {pensumMode === 'MPPE' ? 'Pensum Oficial MPPE' : 'Pensum Integral CBA'}
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Comparativa de promedios oficiales ministeriales vs. cuadro de honor integral institucional.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
              title="Imprimir Sábana"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="p-2 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#1B1C33] rounded-xl transition flex items-center gap-1.5 text-xs font-black shadow-md"
              title="Descargar en Excel/CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters & Control Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Level Switcher (Primaria / Media General) */}
            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['PRIMARIA', 'MEDIA_GENERAL'] as EducationalLevel[]).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => handleLevelChange(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedLevel === lvl
                      ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {lvl === 'MEDIA_GENERAL' ? 'Media General' : 'Primaria'}
                </button>
              ))}
            </div>

            {/* Pensum Mode Switcher */}
            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setPensumMode('MPPE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                  pensumMode === 'MPPE'
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                Pensum MPPE
              </button>
              <button
                onClick={() => setPensumMode('CBA')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                  pensumMode === 'CBA'
                    ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                Pensum CBA (Integral)
              </button>
            </div>

            {/* Grade Selector */}
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
            >
              {(LEVEL_GRADES_CATALOG[selectedLevel] || []).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            {/* Section: STRICTLY A and B */}
            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['A', 'B'] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                    selectedSection === sec
                      ? 'bg-[#2C2E53] text-[#D4AF37]'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  Sec. {sec}
                </button>
              ))}
            </div>

            {/* Lapso */}
            <select
              value={selectedLapso}
              onChange={e => setSelectedLapso(Number(e.target.value) as 1 | 2 | 3)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              <option value={1}>1er Lapso</option>
              <option value={2}>2do Lapso</option>
              <option value={3}>3er Lapso</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar estudiante o cédula..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 text-xs shrink-0">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-500 font-medium">Matrícula Activa:</span>{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-bold">{targetStudents.length} estudiantes</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Promedio MPPE:</span>{' '}
              <strong className="text-sky-700 dark:text-sky-400 font-black font-mono">{courseStats.avgMppe}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Promedio CBA:</span>{' '}
              <strong className="text-[#2C2E53] dark:text-[#D4AF37] font-black font-mono">{courseStats.avgCba}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-[11px]">
              Aprobados: {courseStats.countAprobados}
            </span>
            {courseStats.countReprobados > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 font-bold text-[11px]">
                En Revisión: {courseStats.countReprobados}
              </span>
            )}
          </div>
        </div>

        {/* Main Matrix Table */}
        <div className="p-6 overflow-auto flex-1">
          {reportData.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <FileSpreadsheet className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-bold text-sm text-slate-600 dark:text-slate-300">
                No hay estudiantes matriculados en {selectedGrade} Sección {selectedSection}
              </p>
              <p className="text-xs">
                Asegúrese de contar con alumnos registrados para generar la sábana de calificaciones.
              </p>
            </div>
          ) : (
            <div className="min-w-full inline-block align-middle">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <thead className="bg-[#2C2E53] text-white">
                  <tr>
                    <th className="py-2.5 px-2 text-center font-mono w-10">#</th>
                    <th className="py-2.5 px-3 text-left min-w-[200px]">Estudiante / Cédula</th>
                    
                    {/* Columns for each subject in current pensum mode */}
                    {levelAreas.map(area => (
                      <th
                        key={area.id}
                        className="py-2.5 px-2 text-center font-bold tracking-tight text-[11px] max-w-[90px] truncate"
                        title={area.name}
                      >
                        {area.code}
                      </th>
                    ))}

                    <th className="py-2.5 px-2 text-center bg-sky-950 text-sky-200 font-bold">
                      Prom. MPPE
                    </th>
                    <th className="py-2.5 px-2 text-center bg-sky-950 text-sky-300 font-bold">
                      Lugar MPPE
                    </th>
                    <th className="py-2.5 px-2 text-center bg-[#1B1C33] text-[#D4AF37] font-black">
                      Prom. CBA
                    </th>
                    <th className="py-2.5 px-2 text-center bg-[#1B1C33] text-[#D4AF37] font-black">
                      Cuadro Honor
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {reportData.map((item, idx) => (
                    <tr
                      key={item.student.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                    >
                      <td className="py-2 px-2 text-center font-mono text-slate-400">
                        {(idx + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-bold text-slate-800 dark:text-slate-100">
                          {item.student.fullName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.student.cedula}
                        </div>
                      </td>

                      {/* Grades for each subject */}
                      {levelAreas.map(area => {
                        const found = item.calc.cbaDetails.find(d => d.areaId === area.id);
                        const val = found?.score ?? '--';
                        const numVal = typeof val === 'number' ? val : parseFloat(String(val));
                        const isReprobado = !isNaN(numVal) && numVal < (selectedLevel === 'MEDIA_GENERAL' ? 10 : 12);

                        return (
                          <td
                            key={area.id}
                            className={`py-2 px-2 text-center font-mono font-bold ${
                              isReprobado
                                ? 'text-rose-600 bg-rose-50/50 dark:bg-rose-950/20'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {val}
                          </td>
                        );
                      })}

                      {/* Promedio MPPE */}
                      <td className="py-2 px-2 text-center font-mono font-black text-sky-700 dark:text-sky-400 bg-sky-50/40 dark:bg-sky-950/20">
                        {item.calc.averageMppe < 10 ? `0${item.calc.averageMppe.toFixed(2)}` : item.calc.averageMppe.toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-center font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
                        #{item.rankMppe}
                      </td>

                      {/* Promedio CBA */}
                      <td className="py-2 px-2 text-center font-mono font-black text-[#2C2E53] dark:text-[#D4AF37] bg-amber-50/40 dark:bg-amber-950/20">
                        {item.calc.averageCba < 10 ? `0${item.calc.averageCba.toFixed(2)}` : item.calc.averageCba.toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-center font-mono font-black text-[#2C2E53] dark:text-[#D4AF37]">
                        <span className="inline-flex items-center gap-0.5">
                          {item.rankCba <= 3 && <Award className="w-3.5 h-3.5 text-amber-500 inline" />}
                          #{item.rankCba}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div>
            Mostrando <strong>{levelAreas.length}</strong> asignaturas en modo <strong>{pensumMode === 'MPPE' ? 'Oficial MPPE' : 'Integral CBA'}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition"
          >
            Cerrar Sábana
          </button>
        </div>

      </div>
    </div>
  );
};
