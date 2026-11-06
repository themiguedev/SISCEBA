import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG } from '../../types';
import {
  Layers,
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CalificacionesPorLapsoView: React.FC = () => {
  const { students, areas, evaluations } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>(LEVEL_GRADES_CATALOG.MEDIA_GENERAL[0]);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Estudiantes del aula
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

  // Matriz comparativa de Lapsos
  const lapsoMatrix = useMemo(() => {
    const targetAreas = selectedAreaId === 'TODAS'
      ? mediaAreas
      : mediaAreas.filter(a => a.id === selectedAreaId);

    return salonStudents.map(student => {
      const studentEvals = (evaluations || []).filter(e => e.studentId === student.id);

      const subjectsGrades = targetAreas.map(area => {
        const ev1 = studentEvals.find(e => e.areaId === area.id && e.lapso === 1);
        const ev2 = studentEvals.find(e => e.areaId === area.id && e.lapso === 2);
        const ev3 = studentEvals.find(e => e.areaId === area.id && e.lapso === 3);

        const n1 = ev1?.scoreNumeric;
        const n2 = ev2?.scoreNumeric;
        const n3 = ev3?.scoreNumeric;

        // Cálculo de definitiva con notas vigesimales disponibles
        const gradedScores: number[] = [];
        if (n1 !== undefined) gradedScores.push(n1);
        if (n2 !== undefined) gradedScores.push(n2);
        if (n3 !== undefined) gradedScores.push(n3);

        const definitiva = gradedScores.length > 0
          ? Number((gradedScores.reduce((a, b) => a + b, 0) / gradedScores.length).toFixed(2))
          : undefined;

        const isPassing = definitiva !== undefined && definitiva >= 10;
        const isAtRisk = definitiva !== undefined && definitiva < 10;

        return {
          area,
          n1,
          n2,
          n3,
          definitiva,
          isPassing,
          isAtRisk
        };
      });

      // Promedio general de todas las materias evaluadas para este estudiante
      const allDefinitivas = subjectsGrades
        .map(sg => sg.definitiva)
        .filter((d): d is number => d !== undefined);

      const generalAverage = allDefinitivas.length > 0
        ? Number((allDefinitivas.reduce((a, b) => a + b, 0) / allDefinitivas.length).toFixed(2))
        : 0;

      return {
        student,
        subjectsGrades,
        generalAverage
      };
    });
  }, [salonStudents, selectedAreaId, mediaAreas, evaluations]);

  const handleExportCSV = () => {
    if (lapsoMatrix.length === 0) return;
    const headers = ['Cédula', 'Estudiante', 'Año', 'Sección', 'Materia', 'Lapso 1', 'Lapso 2', 'Lapso 3', 'Definitiva'];
    const rows: (string | number)[][] = [];

    lapsoMatrix.forEach(row => {
      row.subjectsGrades.forEach(sg => {
        rows.push([
          row.student.cedula || 'S/C',
          `"${row.student.fullName}"`,
          selectedGrade,
          selectedSection,
          `"${sg.area.name}"`,
          sg.n1 ?? '--',
          sg.n2 ?? '--',
          sg.n3 ?? '--',
          sg.definitiva ?? '--'
        ]);
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Calificaciones_Por_Lapso_${selectedGrade}_${selectedSection}.csv`);
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

          {/* Selector de Asignatura */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Asignatura
            </label>
            <select
              value={selectedAreaId}
              onChange={e => setSelectedAreaId(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#2C2E53] dark:text-slate-100 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="TODAS">Todas las Asignaturas</option>
              {mediaAreas.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
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

      {/* Tabla Comparativa de Lapsos */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D4AF37]" />
              <span>Calificaciones Comparativas por Lapso (1°, 2° y 3° Momento)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedGrade} "{selectedSection}" • Escala Vigesimal 01 a 20 con Promedio Definitivo Anual
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {salonStudents.length} alumno(s)
          </span>
        </div>

        {lapsoMatrix.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No se encontraron registros de estudiantes para los criterios seleccionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Estudiante</th>
                  <th className="py-3 px-4">Asignatura</th>
                  <th className="py-3 px-3 text-center">1° Lapso</th>
                  <th className="py-3 px-3 text-center">2° Lapso</th>
                  <th className="py-3 px-3 text-center">3° Lapso</th>
                  <th className="py-3 px-4 text-center">Definitiva</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {lapsoMatrix.map(row => (
                  <React.Fragment key={row.student.id}>
                    {row.subjectsGrades.map((sg, idx) => (
                      <tr
                        key={`${row.student.id}-${sg.area.id}`}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                      >
                        {idx === 0 && (
                          <td
                            rowSpan={row.subjectsGrades.length}
                            className="py-3 px-4 align-top border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                          >
                            <div className="font-bold text-[#2C2E53] dark:text-slate-100">
                              {row.student.fullName}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              {row.student.cedula || 'S/C'}
                            </div>
                            <div className="mt-2 text-[10px] font-mono font-black text-[#D4AF37]">
                              Promedio: {row.generalAverage > 0 ? row.generalAverage.toFixed(2) : '--'}
                            </div>
                          </td>
                        )}

                        <td className="py-2.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                          {sg.area.name}
                        </td>

                        {/* 1° Lapso */}
                        <td className="py-2.5 px-3 text-center font-mono font-bold">
                          <span className={sg.n1 !== undefined ? (sg.n1 >= 10 ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-400'}>
                            {sg.n1 !== undefined ? String(sg.n1).padStart(2, '0') : '--'}
                          </span>
                        </td>

                        {/* 2° Lapso */}
                        <td className="py-2.5 px-3 text-center font-mono font-bold">
                          <span className={sg.n2 !== undefined ? (sg.n2 >= 10 ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-400'}>
                            {sg.n2 !== undefined ? String(sg.n2).padStart(2, '0') : '--'}
                          </span>
                        </td>

                        {/* 3° Lapso */}
                        <td className="py-2.5 px-3 text-center font-mono font-bold">
                          <span className={sg.n3 !== undefined ? (sg.n3 >= 10 ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-400'}>
                            {sg.n3 !== undefined ? String(sg.n3).padStart(2, '0') : '--'}
                          </span>
                        </td>

                        {/* Definitiva */}
                        <td className="py-2.5 px-4 text-center font-mono font-black text-sm">
                          <span className={`px-2 py-0.5 rounded-md ${
                            sg.definitiva !== undefined
                              ? sg.isPassing
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'text-slate-400'
                          }`}>
                            {sg.definitiva !== undefined ? sg.definitiva.toFixed(2) : '--'}
                          </span>
                        </td>

                        {/* Estado */}
                        <td className="py-2.5 px-4 text-center">
                          {sg.definitiva !== undefined ? (
                            sg.isPassing ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Aprobado</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600">
                                <AlertTriangle className="w-3 h-3" />
                                <span>A Revisión</span>
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] text-slate-400">En curso</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
