import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG, PendingSubjectEnrollment } from '../../types';
import {
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Award,
  Users,
  Search,
  Filter,
  Save,
  X,
  FileCheck2,
  HelpCircle
} from 'lucide-react';

export const CalificacionesMateriasPendientesView: React.FC = () => {
  const {
    students,
    areas,
    pendingSubjectEnrollments,
    savePendingSubjectEnrollment,
    recordPendingSubjectGrade,
    deletePendingSubjectEnrollment,
    currentRole,
    currentUser
  } = useApp();

  const [selectedCurrentGrade, setSelectedCurrentGrade] = useState<string>('2do Año');
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  // Formulario de Inscripción de Materia Pendiente
  const [enrollStudentId, setEnrollStudentId] = useState('');
  const [enrollAreaId, setEnrollAreaId] = useState('');
  const [enrollOriginGrade, setEnrollOriginGrade] = useState('1er Año');
  const [enrollTeacherName, setEnrollTeacherName] = useState('');

  // Estudiantes del salón en curso (2do a 5to año pueden tener materias pendientes de años previos)
  const currentStudents = useMemo(() => {
    return (students || []).filter(
      s => s.level === 'MEDIA_GENERAL' && s.grade === selectedCurrentGrade && s.section === selectedSection
    );
  }, [students, selectedCurrentGrade, selectedSection]);

  // Áreas regulares de Media General
  const mediaAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'MEDIA_GENERAL');
  }, [areas]);

  // Registros de Materia Pendiente filtrados
  const filteredEnrollments = useMemo(() => {
    return (pendingSubjectEnrollments || [])
      .filter(p => p.currentGrade === selectedCurrentGrade)
      .filter(p => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          (p.studentName || '').toLowerCase().includes(term) ||
          (p.studentCedula || '').toLowerCase().includes(term) ||
          (p.areaName || '').toLowerCase().includes(term)
        );
      });
  }, [pendingSubjectEnrollments, selectedCurrentGrade, searchTerm]);

  // Grados aplicables para tener materias pendientes (desde 2do hasta 5to año)
  const eligibleGrades = ['2do Año', '3er Año', '4to Año', '5to Año'];

  const handleOpenEnrollModal = () => {
    if (currentStudents.length > 0) {
      setEnrollStudentId(currentStudents[0].id);
    }
    if (mediaAreas.length > 0) {
      setEnrollAreaId(mediaAreas[0].id);
    }
    setEnrollTeacherName(currentUser?.fullName || '');
    setIsEnrollModalOpen(true);
  };

  const handleCreateEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    const stu = students.find(s => s.id === enrollStudentId);
    const ar = areas.find(a => a.id === enrollAreaId);
    if (!stu || !ar) return;

    const newId = `pending-${stu.id}-${ar.id}-${Date.now()}`;
    const newRecord: PendingSubjectEnrollment = {
      id: newId,
      studentId: stu.id,
      studentName: stu.fullName,
      studentCedula: stu.cedula || 'S/C',
      areaId: ar.id,
      areaName: ar.name,
      schoolYear: '2025-2026',
      originGrade: enrollOriginGrade,
      currentGrade: selectedCurrentGrade,
      assignedTeacherName: enrollTeacherName || 'Docente Asignado',
      status: 'CURSANDO',
      grades: [
        { id: `grade-1-${Date.now()}`, enrollmentId: newId, momentNumber: 1, score: 0 },
        { id: `grade-2-${Date.now()}`, enrollmentId: newId, momentNumber: 2, score: 0 },
        { id: `grade-3-${Date.now()}`, enrollmentId: newId, momentNumber: 3, score: 0 },
        { id: `grade-4-${Date.now()}`, enrollmentId: newId, momentNumber: 4, score: 0 }
      ],
      createdAt: new Date().toISOString()
    };

    await savePendingSubjectEnrollment(newRecord);
    setIsEnrollModalOpen(false);
  };

  const handleScoreChange = async (
    enrollmentId: string,
    moment: 1 | 2 | 3 | 4,
    score: number
  ) => {
    await recordPendingSubjectGrade(enrollmentId, moment, score);
  };

  const handleDeleteEnrollment = async (id: string, name?: string) => {
    if (window.confirm(`¿Seguro que desea eliminar el registro de materia pendiente de ${name || 'este estudiante'}?`)) {
      await deletePendingSubjectEnrollment(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Barra de Filtros */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Grado Cursante Actual */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Año que Cursa
            </label>
            <select
              value={selectedCurrentGrade}
              onChange={e => setSelectedCurrentGrade(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#2C2E53] dark:text-slate-100 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              {eligibleGrades.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Sección */}
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
        </div>

        {/* Búsqueda y Botón Nueva Inscripción */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar estudiante o materia..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <button
            onClick={handleOpenEnrollModal}
            className="px-4 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Materia Pendiente</span>
          </button>
        </div>
      </div>

      {/* Banner Informativo del Régimen de Materia Pendiente MPPE */}
      <div className="bg-gradient-to-r from-blue-900/10 via-slate-50 to-indigo-900/10 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-4 border border-blue-200/50 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#2C2E53] dark:text-white uppercase tracking-wider">
              Régimen de Evaluación de Materia Pendiente (4 Momentos MPPE)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              El estudiante cuenta con cuatro (4) momentos evaluativos durante el año escolar. Escala vigesimal (01 a 20); calificación mínima aprobatoria: 10 puntos. Al aprobar un momento, se consolida la materia.
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-mono font-bold text-slate-500">
            {filteredEnrollments.length} pendiente(s) activa(s)
          </span>
        </div>
      </div>

      {/* Tabla de Materias Pendientes */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {filteredEnrollments.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No hay materias pendientes registradas en {selectedCurrentGrade}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Todos los estudiantes de este curso se encuentran al día con sus áreas de formación previas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Estudiante / Cédula</th>
                  <th className="py-3 px-4">Materia Pendiente</th>
                  <th className="py-3 px-4">Año de Origen</th>
                  <th className="py-3 px-3 text-center">1° Momento</th>
                  <th className="py-3 px-3 text-center">2° Momento</th>
                  <th className="py-3 px-3 text-center">3° Momento</th>
                  <th className="py-3 px-3 text-center">4° Momento</th>
                  <th className="py-3 px-4 text-center">Definitiva</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEnrollments.map(rec => {
                  const m1 = rec.grades?.find(g => g.momentNumber === 1)?.score;
                  const m2 = rec.grades?.find(g => g.momentNumber === 2)?.score;
                  const m3 = rec.grades?.find(g => g.momentNumber === 3)?.score;
                  const m4 = rec.grades?.find(g => g.momentNumber === 4)?.score;

                  const isPassed = rec.status === 'APROBADA' || (rec.finalScore && rec.finalScore >= 10);

                  return (
                    <tr
                      key={rec.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#2C2E53] dark:text-slate-100">
                          {rec.studentName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {rec.studentCedula}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {rec.areaName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Prof: {rec.assignedTeacherName || 'Sin asignar'}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-600 dark:text-slate-400">
                        {rec.originGrade}
                      </td>

                      {/* Momento 1 */}
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={m1 || ''}
                          placeholder="--"
                          onChange={e =>
                            handleScoreChange(rec.id, 1, Math.min(20, Math.max(0, Number(e.target.value) || 0)))
                          }
                          className="w-14 px-2 py-1 text-center font-mono font-bold text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        />
                      </td>

                      {/* Momento 2 */}
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={m2 || ''}
                          placeholder="--"
                          onChange={e =>
                            handleScoreChange(rec.id, 2, Math.min(20, Math.max(0, Number(e.target.value) || 0)))
                          }
                          className="w-14 px-2 py-1 text-center font-mono font-bold text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        />
                      </td>

                      {/* Momento 3 */}
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={m3 || ''}
                          placeholder="--"
                          onChange={e =>
                            handleScoreChange(rec.id, 3, Math.min(20, Math.max(0, Number(e.target.value) || 0)))
                          }
                          className="w-14 px-2 py-1 text-center font-mono font-bold text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        />
                      </td>

                      {/* Momento 4 */}
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={m4 || ''}
                          placeholder="--"
                          onChange={e =>
                            handleScoreChange(rec.id, 4, Math.min(20, Math.max(0, Number(e.target.value) || 0)))
                          }
                          className="w-14 px-2 py-1 text-center font-mono font-bold text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        />
                      </td>

                      {/* Nota Definitiva */}
                      <td className="py-3 px-4 text-center font-mono font-black text-sm">
                        <span className={isPassed ? 'text-emerald-600' : 'text-slate-400'}>
                          {rec.finalScore !== undefined ? String(rec.finalScore).padStart(2, '0') : '--'}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isPassed
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : rec.status === 'REPROBADA'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}>
                          {rec.status}
                        </span>
                      </td>

                      {/* Acción Eliminar */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteEnrollment(rec.id, rec.studentName)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para Inscribir Materia Pendiente */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                <span>Inscribir Materia Pendiente</span>
              </h3>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEnrollment} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Estudiante
                </label>
                <select
                  value={enrollStudentId}
                  onChange={e => setEnrollStudentId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  {currentStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.cedula || 'S/C'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Asignatura Pendiente
                </label>
                <select
                  value={enrollAreaId}
                  onChange={e => setEnrollAreaId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  {mediaAreas.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Año Escolar de Origen (donde reprobó)
                </label>
                <select
                  value={enrollOriginGrade}
                  onChange={e => setEnrollOriginGrade(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  {LEVEL_GRADES_CATALOG.MEDIA_GENERAL.filter(g => g !== selectedCurrentGrade).map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Profesor Evaluador Asignado
                </label>
                <input
                  type="text"
                  value={enrollTeacherName}
                  onChange={e => setEnrollTeacherName(e.target.value)}
                  placeholder="Nombre del docente responsable..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] rounded-xl font-black transition shadow-xs"
                >
                  Inscribir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
