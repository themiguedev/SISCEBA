import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG } from '../../types';
import {
  Award,
  Users,
  Search,
  Filter,
  Download,
  Printer,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CalificacionesMediaGeneralViewProps {
  onNavigateToStudent?: (studentId: string) => void;
}

export const CalificacionesMediaGeneralView: React.FC<CalificacionesMediaGeneralViewProps> = ({
  onNavigateToStudent
}) => {
  const { students, areas, activeLapso, calculateStudentPensumAverages, evaluations } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>(LEVEL_GRADES_CATALOG.MEDIA_GENERAL[0]);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(activeLapso as 1 | 2 | 3);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRiskOnly, setFilterRiskOnly] = useState<boolean>(false);

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

  // Áreas oficiales de Media General
  const mediaAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'MEDIA_GENERAL');
  }, [areas]);

  // Cálculos consolidados por estudiante (Escala Vigesimal 01 a 20)
  const studentsGradesSummary = useMemo(() => {
    return salonStudents.map(student => {
      const calc = calculateStudentPensumAverages(student.id, selectedLapso);
      const studentEvals = (evaluations || []).filter(
        e => e.studentId === student.id && e.lapso === selectedLapso
      );

      // Conteo de materias aprobadas (nota >= 10) y aplazadas (nota < 10)
      let aprobadas = 0;
      let aplazadas = 0;
      mediaAreas.forEach(a => {
        const ev = studentEvals.find(e => e.areaId === a.id);
        const score = ev?.scoreNumeric;
        if (score !== undefined) {
          if (score >= 10) aprobadas++;
          else aplazadas++;
        }
      });

      return {
        student,
        avgMppe: calc.averageMppe,
        avgCba: calc.averageCba,
        aprobadas,
        aplazadas,
        isAtRisk: calc.averageMppe < 10 || aplazadas > 0
      };
    });
  }, [salonStudents, selectedLapso, calculateStudentPensumAverages, evaluations, mediaAreas]);

  // Filtrado condicional
  const displayList = useMemo(() => {
    if (filterRiskOnly) {
      return studentsGradesSummary.filter(s => s.isAtRisk);
    }
    return studentsGradesSummary;
  }, [studentsGradesSummary, filterRiskOnly]);

  // Estadísticas globales del aula
  const metrics = useMemo(() => {
    const total = studentsGradesSummary.length;
    if (total === 0) return { total: 0, classAvg: '0.0', passRate: 0, atRiskCount: 0 };

    const sumAvg = studentsGradesSummary.reduce((acc, curr) => acc + curr.avgMppe, 0);
    const classAvg = (sumAvg / total).toFixed(2);
    const passingStudents = studentsGradesSummary.filter(s => s.avgMppe >= 10).length;
    const passRate = Math.round((passingStudents / total) * 100);
    const atRiskCount = studentsGradesSummary.filter(s => s.isAtRisk).length;

    return { total, classAvg, passRate, atRiskCount };
  }, [studentsGradesSummary]);

  const handleExportCSV = () => {
    if (studentsGradesSummary.length === 0) return;
    const headers = ['Cédula', 'Estudiante', 'Año', 'Sección', 'Lapso', 'Promedio MPPE', 'Promedio CBA', 'Aprobadas', 'Aplazadas', 'Estado'];
    const rows = studentsGradesSummary.map(s => [
      s.student.cedula,
      `"${s.student.fullName}"`,
      selectedGrade,
      selectedSection,
      selectedLapso,
      s.avgMppe,
      s.avgCba,
      s.aprobadas,
      s.aplazadas,
      s.avgMppe >= 10 ? 'APROBADO' : 'EN RIESGO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Calificaciones_${selectedGrade}_Sec_${selectedSection}_Lapso_${selectedLapso}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Barra de Filtros de Selección Oficial */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Selector de Año */}
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

          {/* Selector de Sección (Regla Institucional: Exclusivamente A y B) */}
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

          {/* Selector de Lapso */}
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

        {/* Búsqueda y Botones de Acción */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar estudiante o cédula..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <button
            onClick={() => setFilterRiskOnly(!filterRiskOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              filterRiskOnly
                ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{filterRiskOnly ? 'Mostrando en Riesgo' : 'Filtrar Riesgo'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            title="Exportar a CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs"
            title="Imprimir Sábana"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas Generales del Salón */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matrícula Salón</div>
            <div className="text-xl font-black text-[#2C2E53] dark:text-white mt-0.5">{metrics.total}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Promedio Aula (Vigesimal)</div>
            <div className="text-xl font-black text-[#D4AF37] mt-0.5 font-mono">{metrics.classAvg} / 20</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">% Aprobación</div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">{metrics.passRate}%</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-black">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estudiantes en Riesgo</div>
            <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">{metrics.atRiskCount}</div>
          </div>
        </div>
      </div>

      {/* Tabla Principal de Calificaciones */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>Consolidado de Calificaciones — {selectedGrade} "{selectedSection}"</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Escala Cuantitativa Vigesimal oficial (01 a 20) • Momento {selectedLapso}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {displayList.length} registro(s)
          </span>
        </div>

        {displayList.length === 0 ? (
          <div className="p-12 text-center">
            <GraduationCap className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No hay calificaciones registradas para esta selección
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Verifique que existan estudiantes inscritos en {selectedGrade} Sección "{selectedSection}" y que se hayan asentado evaluaciones en el Lapso {selectedLapso}.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Estudiante / Cédula</th>
                  <th className="py-3 px-4 text-center">Promedio MPPE</th>
                  <th className="py-3 px-4 text-center">Promedio CBA</th>
                  <th className="py-3 px-4 text-center">Materias Aprobadas</th>
                  <th className="py-3 px-4 text-center">Materias Aplazadas</th>
                  <th className="py-3 px-4 text-center">Estatus</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayList.map((item, idx) => {
                  const isPassing = item.avgMppe >= 10;
                  return (
                    <tr
                      key={item.student.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#2C2E53] dark:text-slate-200">
                          {item.student.fullName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {item.student.cedula || 'Sin cédula'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-black text-sm">
                        <span className={`px-2 py-0.5 rounded-lg ${
                          item.avgMppe >= 10
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}>
                          {item.avgMppe > 0 ? item.avgMppe.toFixed(2) : '--'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-sm text-[#D4AF37]">
                        {item.avgCba > 0 ? item.avgCba.toFixed(2) : '--'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">
                        {item.aprobadas}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-rose-500">
                        {item.aplazadas}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isPassing && item.aplazadas === 0
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : item.isAtRisk
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}>
                          {isPassing && item.aplazadas === 0 ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Aprobado</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3" />
                              <span>En Alerta</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {onNavigateToStudent && (
                          <button
                            onClick={() => onNavigateToStudent(item.student.id)}
                            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-[#2C2E53] dark:hover:text-[#D4AF37] transition"
                            title="Ver detalle por estudiante"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
