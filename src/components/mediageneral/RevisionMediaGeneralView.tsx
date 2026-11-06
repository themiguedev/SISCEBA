import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG, RevisionEvaluationRecord } from '../../types';
import {
  Award,
  Users,
  Search,
  Filter,
  Save,
  Trash2,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Scale,
  FileSpreadsheet,
  BookOpen,
  Calendar
} from 'lucide-react';

export const RevisionMediaGeneralView: React.FC = () => {
  const {
    students,
    areas,
    revisionEvaluations,
    saveRevisionEvaluation,
    deleteRevisionEvaluation,
    currentUser,
    currentRole
  } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>(LEVEL_GRADES_CATALOG.MEDIA_GENERAL[0]);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');
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

  // Áreas regulares de Media General
  const mediaAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'MEDIA_GENERAL');
  }, [areas]);

  // Seleccionar automáticamente la primera materia si no hay seleccionada
  React.useEffect(() => {
    if (mediaAreas.length > 0 && !selectedAreaId) {
      setSelectedAreaId(mediaAreas[0].id);
    }
  }, [mediaAreas, selectedAreaId]);

  const activeArea = useMemo(() => {
    return mediaAreas.find(a => a.id === selectedAreaId) || mediaAreas[0];
  }, [mediaAreas, selectedAreaId]);

  // Evaluaciones de revisión para este grado, sección y materia
  const areaRevisions = useMemo(() => {
    return (revisionEvaluations || []).filter(
      r => r.grade === selectedGrade && r.section === selectedSection && r.areaId === selectedAreaId
    );
  }, [revisionEvaluations, selectedGrade, selectedSection, selectedAreaId]);

  // Estado local para edición de notas de revisión
  const [scoresMap, setScoresMap] = useState<Record<string, { score: number; acta: string }>>({});

  React.useEffect(() => {
    const map: typeof scoresMap = {};
    salonStudents.forEach(stu => {
      const rev = areaRevisions.find(r => r.studentId === stu.id);
      map[stu.id] = {
        score: rev?.revisionScore ?? 0,
        acta: rev?.actaNumber ?? 'ACT-REV-2026-001'
      };
    });
    setScoresMap(map);
  }, [salonStudents, areaRevisions]);

  const handleScoreChange = (studentId: string, val: number) => {
    setScoresMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score: Math.min(20, Math.max(0, val))
      }
    }));
  };

  const handleActaChange = (studentId: string, val: string) => {
    setScoresMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        acta: val
      }
    }));
  };

  const handleSaveRevision = async (studentId: string) => {
    const student = salonStudents.find(s => s.id === studentId);
    if (!student || !activeArea) return;

    const data = scoresMap[studentId];
    if (!data) return;

    const existing = areaRevisions.find(r => r.studentId === studentId);
    const passed = data.score >= 10;

    const record: RevisionEvaluationRecord = {
      id: existing?.id || `rev-${studentId}-${activeArea.id}-${Date.now()}`,
      studentId,
      studentName: student.fullName,
      studentCedula: student.cedula || 'S/C',
      areaId: activeArea.id,
      areaName: activeArea.name,
      schoolYear: '2025-2026',
      grade: selectedGrade,
      section: selectedSection,
      revisionScore: data.score,
      passed,
      evaluatedBy: currentUser?.id || 'admin',
      evaluatedByName: currentUser?.fullName || currentRole,
      evaluationDate: new Date().toISOString().split('T')[0],
      actaNumber: data.acta
    };

    await saveRevisionEvaluation(record);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Desea anular este registro de prueba de revisión?')) {
      await deleteRevisionEvaluation(id);
    }
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

          {/* Asignatura */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Asignatura en Revisión
            </label>
            <select
              value={selectedAreaId}
              onChange={e => setSelectedAreaId(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#2C2E53] dark:text-slate-100 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              {mediaAreas.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Búsqueda y Botón Imprimir */}
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
            onClick={() => window.print()}
            className="px-3 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Acta</span>
          </button>
        </div>
      </div>

      {/* Banner Explicativo de Revisión MPPE */}
      <div className="bg-gradient-to-r from-rose-900/10 via-slate-50 to-amber-900/10 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-4 border border-rose-200/50 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#2C2E53] dark:text-white uppercase tracking-wider">
              Régimen de Pruebas de Revisión de Julio (MPPE)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Evaluación extraordinaria de fin de año escolar. Escala vigesimal (01 a 20). Calificación mínima aprobatoria: 10 puntos. Sustituye la definitiva del año si es aprobada.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-slate-400">
          {areaRevisions.length} asentada(s)
        </span>
      </div>

      {/* Tabla de Estudiantes para la Prueba de Revisión */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>Acta de Revisión — {activeArea?.name} ({selectedGrade} "{selectedSection}")</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Carga y validación formal de calificaciones de reparación
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {salonStudents.length} alumno(s)
          </span>
        </div>

        {salonStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No hay estudiantes inscritos en esta sección.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Estudiante / Cédula</th>
                  <th className="py-3 px-4 text-center">Nota de Revisión (01-20)</th>
                  <th className="py-3 px-4 text-center">N° de Acta</th>
                  <th className="py-3 px-4 text-center">Resultado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {salonStudents.map((student, idx) => {
                  const data = scoresMap[student.id] || { score: 0, acta: 'ACT-REV-2026-001' };
                  const isPassed = data.score >= 10;
                  const existingRev = areaRevisions.find(r => r.studentId === student.id);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#2C2E53] dark:text-slate-100">
                          {student.fullName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {student.cedula || 'S/C'}
                        </div>
                      </td>

                      {/* Nota de Revisión */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={data.score || ''}
                          placeholder="--"
                          onChange={e => handleScoreChange(student.id, Number(e.target.value))}
                          className={`w-16 px-2 py-1 font-mono font-black text-sm text-center rounded-lg border outline-none focus:ring-1 focus:ring-[#D4AF37] ${
                            data.score >= 10
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        />
                      </td>

                      {/* N° Acta */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="text"
                          value={data.acta}
                          onChange={e => handleActaChange(student.id, e.target.value)}
                          className="w-36 px-2 py-1 font-mono text-xs text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        />
                      </td>

                      {/* Resultado */}
                      <td className="py-3 px-4 text-center">
                        {data.score > 0 ? (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isPassed
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}>
                            {isPassed ? 'Aprobado' : 'Reprobado'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">No evaluado</span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleSaveRevision(student.id)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-[#2C2E53] hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                          title="Guardar acta de revisión"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        {existingRev && (
                          <button
                            onClick={() => handleDelete(existingRev.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                            title="Anular revisión"
                          >
                            <Trash2 className="w-4 h-4" />
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
