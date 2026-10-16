import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EducationalLevel, LEVEL_GRADES_CATALOG } from '../../types';
import {
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  Bell,
  Search,
  Filter,
  Award,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Student, EvaluationRecord } from '../../types';

interface EstadisticasRendimientoViewProps {
  overrideStudents?: Student[];
  overrideEvaluations?: EvaluationRecord[];
}

export const EstadisticasRendimientoView: React.FC<EstadisticasRendimientoViewProps> = ({
  overrideStudents,
  overrideEvaluations
}) => {
  const {
    students: ctxStudents,
    evaluations: ctxEvaluations,
    areas,
    activeLapso,
    users,
    sendNotification,
    passes
  } = useApp();

  const students = overrideStudents || ctxStudents;
  const evaluations = overrideEvaluations || ctxEvaluations;

  const [semaphoreLevel, setSemaphoreLevel] = useState<'ALL' | EducationalLevel>('ALL');
  const [semaphoreLapso, setSemaphoreLapso] = useState<1 | 2 | 3>(activeLapso);
  const [semaphoreStatusFilter, setSemaphoreStatusFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS' | 'EMPTY'>('ALL');
  const [semaphoreSearch, setSemaphoreSearch] = useState('');
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  // Generar cursos monitoreados respetando exclusivamente Secciones A y B
  const monitoredCourses = useMemo(() => {
    const levelsToScan: EducationalLevel[] =
      semaphoreLevel === 'ALL'
        ? ['INICIAL', 'PRIMARIA', 'MEDIA_GENERAL']
        : [semaphoreLevel];

    const courses: Array<{
      id: string;
      level: EducationalLevel;
      grade: string;
      section: 'A' | 'B';
      area: (typeof areas)[0];
      totalStudents: number;
      evaluatedStudents: number;
      percentage: number;
      status: 'COMPLETED' | 'IN_PROGRESS' | 'EMPTY';
      teacherName: string;
    }> = [];

    levelsToScan.forEach((lvl) => {
      const grades = LEVEL_GRADES_CATALOG[lvl] || [];
      const sections: ('A' | 'B')[] = ['A', 'B']; // Exclusivamente secciones oficiales
      const lvlAreas = areas.filter((a) => a.level === lvl);

      grades.forEach((grd) => {
        sections.forEach((sec) => {
          const sectionStudents = students.filter(
            (s) => s.level === lvl && s.grade === grd && s.section === sec
          );
          const totalCount = sectionStudents.length;

          lvlAreas.forEach((ar) => {
            const evaluatedCount = totalCount > 0
              ? sectionStudents.filter((stu) =>
                  evaluations.some(
                    (e) => e.studentId === stu.id && e.areaId === ar.id && e.lapso === semaphoreLapso
                  )
                ).length
              : 0;
            const pct = totalCount > 0 ? Math.round((evaluatedCount / totalCount) * 100) : 0;
            const status: 'COMPLETED' | 'IN_PROGRESS' | 'EMPTY' =
              totalCount > 0 && pct === 100 ? 'COMPLETED' : pct > 0 ? 'IN_PROGRESS' : 'EMPTY';

            const assignedTeacher = (users || []).find(
              (u) =>
                u.role === 'DOCENTE' &&
                Array.isArray(u.academicAssignments) &&
                u.academicAssignments.some(
                  (asg) =>
                    asg.level === lvl &&
                    asg.grade === grd &&
                    asg.section === sec &&
                    asg.areaId === ar.id
                )
            );

            courses.push({
              id: `${lvl}-${grd}-${sec}-${ar.id}`,
              level: lvl,
              grade: grd,
              section: sec,
              area: ar,
              totalStudents: sectionStudents.length,
              evaluatedStudents: evaluatedCount,
              percentage: pct,
              status,
              teacherName: assignedTeacher?.fullName || 'Docente Titular por Asignar'
            });
          });
        });
      });
    });

    return courses;
  }, [students, evaluations, areas, users, semaphoreLevel, semaphoreLapso]);

  // Filtrado reactivo de cátedras
  const filteredCourses = useMemo(() => {
    return monitoredCourses.filter((c) => {
      if (semaphoreStatusFilter !== 'ALL' && c.status !== semaphoreStatusFilter) return false;
      if (semaphoreSearch.trim()) {
        const q = semaphoreSearch.toLowerCase();
        const matchGrade = c.grade.toLowerCase().includes(q);
        const matchArea = c.area.name.toLowerCase().includes(q) || c.area.code.toLowerCase().includes(q);
        const matchTeacher = c.teacherName.toLowerCase().includes(q);
        if (!matchGrade && !matchArea && !matchTeacher) return false;
      }
      return true;
    });
  }, [monitoredCourses, semaphoreStatusFilter, semaphoreSearch]);

  const totalCourses = monitoredCourses.length;
  const completedCourses = monitoredCourses.filter((c) => c.status === 'COMPLETED').length;
  const inProgressCourses = monitoredCourses.filter((c) => c.status === 'IN_PROGRESS').length;
  const emptyCourses = monitoredCourses.filter((c) => c.status === 'EMPTY').length;
  const globalRate = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

  // Despacho de recordatorio individual
  const handleSendReminder = (course: (typeof monitoredCourses)[0]) => {
    if (sendNotification) {
      sendNotification({
        title: `Aviso UCE • Recordatorio de Carga de Notas`,
        message: `Control de Estudios (UCE) solicita la carga oportuna de calificaciones para ${course.grade} Sección ${course.section} en ${course.area.name} (Lapso ${semaphoreLapso}). Avance actual: ${course.percentage}%.`,
        category: 'CALIFICACIONES',
        priority: 'ALTA',
        recipientRole: 'DOCENTE',
        recipientName: course.teacherName,
        studentName: `${course.grade} ${course.section}`,
        actionTab: course.level,
        actionSubTab: 'CALIFICACIONES',
        deliveryChannels: ['PORTAL', 'EMAIL']
      });
    }

    setReminderToast(`Recordatorio oficial despachado a ${course.teacherName} para ${course.area.name} (${course.grade} Sec. ${course.section}).`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  // Despacho de recordatorios masivo
  const handleSendAllPendingReminders = () => {
    const pending = monitoredCourses.filter((c) => c.status !== 'COMPLETED');
    pending.forEach((c) => {
      if (sendNotification) {
        sendNotification({
          title: `Aviso UCE • Cierre de Lapso Próximo`,
          message: `Control de Estudios (UCE) notifica que la carga de calificaciones para ${c.grade} Sección ${c.section} en ${c.area.name} (Lapso ${semaphoreLapso}) presenta estatus pendiente (${c.percentage}%). Favor completar en el libro digital.`,
          category: 'CALIFICACIONES',
          priority: 'ALTA',
          recipientRole: 'DOCENTE',
          recipientName: c.teacherName,
          studentName: `${c.grade} ${c.section}`,
          actionTab: c.level,
          actionSubTab: 'CALIFICACIONES',
          deliveryChannels: ['PORTAL', 'EMAIL']
        });
      }
    });

    setReminderToast(`Se despacharon ${pending.length} recordatorios oficiales a docentes con cátedras pendientes.`);
    setTimeout(() => setReminderToast(null), 5000);
  };

  // Cuadro de Honor Institucional (Media General)
  const honorRoll = useMemo(() => {
    const mediaStudents = students.filter((s) => s.level === 'MEDIA_GENERAL');
    return mediaStudents
      .map((stu) => {
        const stuEvals = evaluations.filter(
          (e) => e.studentId === stu.id && e.lapso === semaphoreLapso && e.scoreNumeric !== undefined
        );
        if (stuEvals.length === 0) return { student: stu, avg: 0, count: 0 };
        const sum = stuEvals.reduce((acc, curr) => acc + (curr.scoreNumeric || 0), 0);
        const avg = Math.round((sum / stuEvals.length) * 10) / 10;
        return { student: stu, avg, count: stuEvals.length };
      })
      .filter((item) => item.avg >= 15)
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);
  }, [students, evaluations, semaphoreLapso]);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {reminderToast && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-md animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-cba-card space-y-1">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Matrícula Activa
          </span>
          <p className="text-3xl font-black text-[#2C2E53] dark:text-white">{students.length}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Estudiantes inscritos CBA</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-cba-card space-y-1">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Evaluaciones Procesales
          </span>
          <p className="text-3xl font-black text-[#D4AF37]">{evaluations.length}</p>
          <p className="text-[11px] text-slate-500 font-semibold">Registros en Lapso {semaphoreLapso}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-cba-card space-y-1">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Cumplimiento UCE Lapso {semaphoreLapso}
          </span>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{globalRate}%</p>
            <span className="text-xs text-slate-400 font-bold">
              ({completedCourses}/{totalCourses} cátedras)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${globalRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-cba-card space-y-1">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Puntualidad & Asistencia
          </span>
          <p className="text-3xl font-black text-amber-600">{passes.length}</p>
          <p className="text-[11px] text-slate-500 font-semibold">Pases de retraso emitidos</p>
        </div>
      </div>

      {/* Semáforo de Carga Docente UCE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-cba-card overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#2C2E53] dark:bg-[#14162B] text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-transparent dark:border-slate-800">
          <div>
            <h3 className="font-black text-base tracking-wide">
              Semáforo UCE • Control de Carga de Calificaciones
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Auditoría institucional en tiempo real del progreso de asimilación de notas por docente y sección.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {emptyCourses + inProgressCourses > 0 && (
              <button
                onClick={handleSendAllPendingReminders}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#c29f2f] text-[#2C2E53] flex items-center gap-1.5 shadow-sm transition"
                title="Enviar recordatorio automático a todos los docentes con carga pendiente"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Notificar Pendientes ({emptyCourses + inProgressCourses})</span>
              </button>
            )}
          </div>
        </div>

        {/* Filtros de Auditoría */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Lapso */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-500 px-2">Lapso:</span>
              {([1, 2, 3] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setSemaphoreLapso(l)}
                  className={`px-2.5 py-1 text-xs font-black rounded-lg transition ${
                    semaphoreLapso === l
                      ? 'bg-[#2C2E53] text-[#D4AF37] shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  L{l}
                </button>
              ))}
            </div>

            {/* Nivel */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-500 px-2">Nivel:</span>
              {[
                { id: 'ALL', label: 'Todos' },
                { id: 'INICIAL', label: 'Inicial' },
                { id: 'PRIMARIA', label: 'Primaria' },
                { id: 'MEDIA_GENERAL', label: 'Media G.' }
              ].map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSemaphoreLevel(n.id as any)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    semaphoreLevel === n.id
                      ? 'bg-[#2C2E53] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </div>

            {/* Estatus */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-500 px-2">Estatus:</span>
              {[
                { id: 'ALL', label: 'Todos' },
                { id: 'COMPLETED', label: `🟢 ${completedCourses}` },
                { id: 'IN_PROGRESS', label: `🟡 ${inProgressCourses}` },
                { id: 'EMPTY', label: `🔴 ${emptyCourses}` }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSemaphoreStatusFilter(s.id as any)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    semaphoreStatusFilter === s.id
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-black'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Búsqueda */}
          <div className="relative w-full lg:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={semaphoreSearch}
              onChange={(e) => setSemaphoreSearch(e.target.value)}
              placeholder="Filtrar por año, materia o docente..."
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
            />
          </div>
        </div>

        {/* Tabla del Semáforo */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase font-black tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Grado & Sección</th>
                <th className="py-3 px-4">Asignatura / Cátedra</th>
                <th className="py-3 px-4">Docente Titular Asignado</th>
                <th className="py-3 px-4 text-center">Avance Alumnos</th>
                <th className="py-3 px-4 text-center min-w-[140px]">Porcentaje</th>
                <th className="py-3 px-4 text-center">Semáforo</th>
                <th className="py-3 px-4 text-center">Acción UCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <AlertTriangle className="w-8 h-8 text-amber-500/80 mx-auto mb-2" />
                    <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                      No se encontraron cátedras con los filtros seleccionados
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Ajuste el nivel, lapso o verifique la asignación académica de docentes.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      course.status === 'EMPTY' ? 'bg-rose-50/20 dark:bg-rose-950/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-[#2C2E53] dark:text-white block">
                        {course.grade}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 inline-block mt-0.5">
                        Sección {course.section}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {course.area.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Cód: {course.area.code} • {course.level.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {course.teacherName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {course.teacherName.includes('por Asignar') ? 'Pendiente en Gestión' : 'Plantilla Docente CBA'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-black text-xs text-slate-800 dark:text-slate-200">
                        {course.evaluatedStudents} / {course.totalStudents}
                      </span>
                      <span className="text-[10px] text-slate-400 block">calificados</span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-20 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              course.percentage === 100
                                ? 'bg-emerald-500'
                                : course.percentage > 0
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${course.percentage}%` }}
                          />
                        </div>
                        <span className="font-mono font-black text-xs w-9 text-right">
                          {course.percentage}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {course.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                          <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          Completo
                        </span>
                      ) : course.status === 'IN_PROGRESS' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                          <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          En Proceso
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-700 animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                          Sin Cargar
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {course.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => handleSendReminder(course)}
                          className="px-2.5 py-1 text-[11px] font-extrabold rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center gap-1 mx-auto transition shadow-xs"
                          title="Enviar recordatorio automático al docente"
                        >
                          <Send className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                          Recordar
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold italic">
                          Al día
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cuadro de Honor Institucional CBA */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h3 className="font-extrabold text-sm text-[#2C2E53] dark:text-white">
                Cuadro de Honor Institucional • Mejores Promedios
              </h3>
              <p className="text-xs text-slate-500">
                Reconocimiento al mérito académico estudiantil de la U.E.P. Colegio Bellas Artes.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[#D4AF37]/15 text-[#94721C] dark:text-amber-300 border border-[#D4AF37]/40">
            Lapso {semaphoreLapso}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {honorRoll.length === 0 ? (
            <div className="col-span-full py-8 text-center text-slate-400 italic">
              No hay estudiantes con notas suficientes registradas para conformar el cuadro de honor en este lapso.
            </div>
          ) : (
            honorRoll.map((item, idx) => (
              <div
                key={item.student.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      idx === 0
                        ? 'bg-amber-400 text-amber-950 shadow-sm'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-900'
                        : idx === 2
                        ? 'bg-amber-700 text-amber-100'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {item.student.fullName}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {item.student.grade} Sec. {item.student.section}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-[#2C2E53] dark:text-amber-300 font-mono px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                    {item.avg} pts
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {item.count} materias
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
