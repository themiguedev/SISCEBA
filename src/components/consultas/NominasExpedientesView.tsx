import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EducationalLevel, LEVEL_GRADES_CATALOG, Student, AppUser, ScheduleDay } from '../../types';
import {
  Users,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  Clock,
  BookOpen,
  Mail,
  Phone,
  GraduationCap,
  Layers,
  CheckSquare,
  FileSpreadsheet
} from 'lucide-react';

interface NominasExpedientesViewProps {
  isFamilyOrStudent: boolean;
  scopedStudents: Student[];
  overrideStudents?: Student[];
}

export const NominasExpedientesView: React.FC<NominasExpedientesViewProps> = ({
  isFamilyOrStudent,
  scopedStudents,
  overrideStudents
}) => {
  const {
    students: ctxStudents,
    users,
    areas,
    userSchedules,
    currentUserSchedule,
    currentRole,
    currentUser
  } = useApp();

  const students = overrideStudents || ctxStudents;

  const [activeSegment, setActiveSegment] = useState<'ESTUDIANTES' | 'DOCENTES' | 'HORARIOS'>('ESTUDIANTES');

  // Filtros de Estudiantes
  const [studentLevel, setStudentLevel] = useState<'ALL' | EducationalLevel>('ALL');
  const [studentGrade, setStudentGrade] = useState<string>('ALL');
  const [studentSection, setStudentSection] = useState<'ALL' | 'A' | 'B'>('ALL');
  const [studentGender, setStudentGender] = useState<'ALL' | 'M' | 'F'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceSheetMode, setAttendanceSheetMode] = useState(false);

  // Filtros de Docentes y Horarios
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(() => {
    const firstTeacher = (users || []).find((u) => u.role === 'DOCENTE');
    return firstTeacher?.id || '';
  });

  // Lista de Estudiantes Filtrada
  const filteredStudents = useMemo(() => {
    let list = isFamilyOrStudent ? scopedStudents : students;

    if (studentLevel !== 'ALL') {
      list = list.filter((s) => s.level === studentLevel);
    }
    if (studentGrade !== 'ALL') {
      list = list.filter((s) => s.grade === studentGrade);
    }
    if (studentSection !== 'ALL') {
      list = list.filter((s) => s.section === studentSection);
    }
    if (studentGender !== 'ALL') {
      list = list.filter((s) => s.gender === studentGender);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (s) =>
          s.fullName.toLowerCase().includes(term) ||
          s.cedula.toLowerCase().includes(term) ||
          s.representativeName.toLowerCase().includes(term) ||
          s.representativeEmail?.toLowerCase().includes(term)
      );
    }
    return list;
  }, [students, scopedStudents, isFamilyOrStudent, studentLevel, studentGrade, studentSection, studentGender, searchTerm]);

  // Lista de Docentes (con fallback institucional para directivos si la BD está limpia)
  const fallbackTeacher: AppUser = {
    id: 'demo-doc-ciencias',
    username: 'prof_ciencias',
    fullName: 'Prof. Carlos Mendoza (Docente Titular)',
    email: 'carlos.mendoza@bellasartes.edu.ve',
    role: 'DOCENTE',
    defaultLevel: 'MEDIA_GENERAL',
    phone: '0414-6543210',
    cedula: 'V-15.892.411',
    active: true,
    academicAssignments: [
      { id: 'asg-1', level: 'MEDIA_GENERAL', grade: '4to Año', section: 'A', areaId: 'mg-mat', areaName: 'Matemáticas' },
      { id: 'asg-2', level: 'MEDIA_GENERAL', grade: '5to Año', section: 'B', areaId: 'mg-fis', areaName: 'Física' },
      { id: 'asg-3', level: 'MEDIA_GENERAL', grade: '3er Año', section: 'A', areaId: 'mg-qui', areaName: 'Química' }
    ]
  };

  const registeredTeachers = useMemo(() => {
    return (users || []).filter((u) => u.role === 'DOCENTE');
  }, [users]);

  const teacherUsers = registeredTeachers.length > 0 ? registeredTeachers : [fallbackTeacher];

  // Exportar a CSV
  const handleExportCSV = () => {
    const headers = [
      'Nivel',
      'Grado/Año',
      'Sección',
      'Cédula',
      'Apellidos y Nombres',
      'Sexo',
      'Representante',
      'Teléfono',
      'Correo'
    ];
    const rows = filteredStudents.map((s) => [
      `"${s.level}"`,
      `"${s.grade}"`,
      `"${s.section}"`,
      `"${s.cedula}"`,
      `"${s.fullName}"`,
      `"${s.gender}"`,
      `"${s.representativeName}"`,
      `"${s.representativePhone || ''}"`,
      `"${s.representativeEmail || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nomina_Estudiantes_CBA_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fallbackSchedule = {
    userId: fallbackTeacher.id,
    schoolYear: '2026 - 2027',
    blocks: [
      { id: 'b-1', day: 'LUNES' as ScheduleDay, periodIndex: 1, startTime: '07:00', endTime: '07:45', subjectName: 'Matemáticas', level: 'MEDIA_GENERAL' as EducationalLevel, gradeSection: '4to Año Sec. A', classroom: 'Aula 12' },
      { id: 'b-2', day: 'LUNES' as ScheduleDay, periodIndex: 2, startTime: '07:45', endTime: '08:30', subjectName: 'Matemáticas', level: 'MEDIA_GENERAL' as EducationalLevel, gradeSection: '4to Año Sec. A', classroom: 'Aula 12' },
      { id: 'b-3', day: 'MARTES' as ScheduleDay, periodIndex: 3, startTime: '08:45', endTime: '09:30', subjectName: 'Física', level: 'MEDIA_GENERAL' as EducationalLevel, gradeSection: '5to Año Sec. B', classroom: 'Lab de Ciencias' },
      { id: 'b-4', day: 'MIERCOLES' as ScheduleDay, periodIndex: 2, startTime: '07:45', endTime: '08:30', subjectName: 'Química', level: 'MEDIA_GENERAL' as EducationalLevel, gradeSection: '3er Año Sec. A', classroom: 'Lab de Química' },
      { id: 'b-5', day: 'JUEVES' as ScheduleDay, periodIndex: 4, startTime: '09:30', endTime: '10:15', subjectName: 'Atención a Padres', level: 'MEDIA_GENERAL' as EducationalLevel, gradeSection: 'Atención Representantes', classroom: 'Cubículo 3' }
    ]
  };

  // Horario del docente seleccionado
  const activeTeacher = teacherUsers.find((t) => t.id === selectedTeacherId) || teacherUsers[0];
  const teacherSchedule = useMemo(() => {
    if (!activeTeacher) return fallbackSchedule;
    const found = (userSchedules || []).find((s) => s.userId === activeTeacher.id);
    return found || fallbackSchedule;
  }, [userSchedules, activeTeacher]);

  const days: ScheduleDay[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="space-y-6">
      {/* Top Segment Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm no-print">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveSegment('ESTUDIANTES')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSegment === 'ESTUDIANTES'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Nómina de Estudiantes</span>
          </button>

          {!isFamilyOrStudent && (
            <>
              <button
                onClick={() => setActiveSegment('DOCENTES')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  activeSegment === 'DOCENTES'
                    ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Nómina del Profesorado CBA</span>
              </button>

              <button
                onClick={() => setActiveSegment('HORARIOS')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  activeSegment === 'HORARIOS'
                    ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Matriz Horaria Semanal</span>
              </button>
            </>
          )}
        </div>

        {/* Quick action buttons for Students */}
        {activeSegment === 'ESTUDIANTES' && !isFamilyOrStudent && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAttendanceSheetMode(!attendanceSheetMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                attendanceSheetMode
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{attendanceSheetMode ? 'Vista Regular' : 'Lista de Asistencia'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
              title="Exportar nómina filtrada a CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Excel</span>
            </button>
          </div>
        )}
      </div>

      {/* SEGMENT 1: NÓMINA DE ESTUDIANTES (reg_listado_estudiantes.php) */}
      {activeSegment === 'ESTUDIANTES' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-cba-card overflow-hidden">
          {/* Header & Filters */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3 no-print">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-sm text-[#2C2E53] dark:text-white">
                  Listado Oficial de Estudiantes y Filiación de Representantes
                </h3>
                <p className="text-xs text-slate-500">
                  {filteredStudents.length} estudiantes registrados bajo los filtros actuales.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar estudiante, cédula, correo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                />
              </div>
            </div>

            {/* Filter pills */}
            {!isFamilyOrStudent && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* Level */}
                <select
                  value={studentLevel}
                  onChange={(e) => {
                    setStudentLevel(e.target.value as any);
                    setStudentGrade('ALL');
                  }}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200"
                >
                  <option value="ALL">Todos los Niveles</option>
                  <option value="INICIAL">Educación Inicial</option>
                  <option value="PRIMARIA">Educación Primaria</option>
                  <option value="MEDIA_GENERAL">Media General</option>
                </select>

                {/* Grade */}
                {studentLevel !== 'ALL' && (
                  <select
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200"
                  >
                    <option value="ALL">Todos los Cursos</option>
                    {(LEVEL_GRADES_CATALOG[studentLevel] || []).map((grd) => (
                      <option key={grd} value={grd}>
                        {grd}
                      </option>
                    ))}
                  </select>
                )}

                {/* Section: EXCLUSIVAMENTE 'A' y 'B' */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-black uppercase text-slate-400 px-2">Sección:</span>
                  {(['ALL', 'A', 'B'] as const).map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setStudentSection(sec)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                        studentSection === sec
                          ? 'bg-[#2C2E53] text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {sec === 'ALL' ? 'Todas' : `Sec. ${sec}`}
                    </button>
                  ))}
                </div>

                {/* Gender */}
                <select
                  value={studentGender}
                  onChange={(e) => setStudentGender(e.target.value as any)}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200"
                >
                  <option value="ALL">Ambos Sexos</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            )}
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1B1C33] text-slate-200 uppercase text-[10px] tracking-wider font-extrabold">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Cédula</th>
                  <th className="py-3 px-4">Estudiante</th>
                  <th className="py-3 px-4">Grado & Sección</th>
                  {attendanceSheetMode ? (
                    <>
                      <th className="py-3 px-4 text-center">Firma / Marca Asistencia</th>
                      <th className="py-3 px-4 text-center">Observaciones</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3 px-4">Representante Legal</th>
                      <th className="py-3 px-4">Contacto Telefónico</th>
                      <th className="py-3 px-4">Correo Electrónico</th>
                      <th className="py-3 px-4 text-center">Condición</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={attendanceSheetMode ? 6 : 8} className="py-8 text-center text-slate-400 italic">
                      No hay estudiantes registrados con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((stu, idx) => (
                    <tr key={stu.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#2C2E53] dark:text-amber-300">
                        {stu.cedula}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {stu.fullName}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">
                        {stu.grade} Sec. {stu.section}
                      </td>

                      {attendanceSheetMode ? (
                        <>
                          <td className="py-3 px-4 text-center">
                            <div className="w-24 h-6 border-b border-dashed border-slate-400 mx-auto"></div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="w-32 h-6 border-b border-dashed border-slate-300 mx-auto"></div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                            {stu.representativeName}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                            {stu.representativePhone || 'No registrado'}
                          </td>
                          <td className="py-3 px-4 text-[11px] text-slate-500">
                            {stu.representativeEmail || 'No registrado'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              {stu.status || 'Regular'}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEGMENT 2: NÓMINA DEL PROFESORADO (reg_listado_docentes.php) */}
      {activeSegment === 'DOCENTES' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-cba-card overflow-hidden">
          <div className="p-5 bg-[#2C2E53] text-white flex items-center justify-between">
            <div>
              <h3 className="font-black text-base">Directorio Oficial del Profesorado CBA</h3>
              <p className="text-xs text-slate-300 mt-1">
                Nómina docente activa, áreas curriculares asignadas y carga académica semanal.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#D4AF37] text-[#1B1C33]">
              {teacherUsers.length} Docentes Titulares
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1B1C33] text-slate-200 uppercase text-[10px] tracking-wider font-extrabold">
                <tr>
                  <th className="py-3 px-4">Docente Titular</th>
                  <th className="py-3 px-4">Cédula / Usuario</th>
                  <th className="py-3 px-4">Cátedras & Secciones Asignadas</th>
                  <th className="py-3 px-4 text-center">Carga Horaria Semanal</th>
                  <th className="py-3 px-4">Contacto Institucional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {teacherUsers.map((teacher) => {
                  const assignments = teacher.academicAssignments || [];
                  const weeklyHours = assignments.length * 4; // Promedio estimado de horas por materia

                  return (
                    <tr key={teacher.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#2C2E53] text-[#D4AF37] flex items-center justify-center font-black text-xs">
                            {teacher.fullName.charAt(0)}
                          </div>
                          <span>{teacher.fullName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-600 dark:text-slate-400">
                        {teacher.cedula || teacher.username}
                      </td>
                      <td className="py-3 px-4">
                        {assignments.length === 0 ? (
                          <span className="text-slate-400 italic">Sin asignaciones registradas</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {assignments.map((asg, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                              >
                                {asg.areaName || asg.areaCode || 'Materia'} ({asg.grade} Sec. {asg.section})
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-[#2C2E53] dark:text-amber-300">
                        {weeklyHours} hrs / sem
                      </td>
                      <td className="py-3 px-4 text-[11px]">
                        <p className="text-slate-600 dark:text-slate-300 font-medium">{teacher.email}</p>
                        <p className="text-slate-400 font-mono">{teacher.phone || 'S/N'}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEGMENT 3: MATRIZ HORARIA SEMANAL (horarios_docentes.php) */}
      {activeSegment === 'HORARIOS' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-cba-card overflow-hidden">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-[#2C2E53] dark:text-white">
                Matriz Horaria Semanal de Carga Docente
              </h3>
              <p className="text-xs text-slate-500">
                Visualización gráfica de horas lectivas, bloques libres y guardias pedagógicas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500">Docente:</span>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                {teacherUsers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr className="bg-[#1B1C33] text-white font-extrabold uppercase text-[10px]">
                  <th className="p-2.5 border border-slate-700 w-24">Bloque</th>
                  {days.map((day) => (
                    <th key={day} className="p-2.5 border border-slate-700">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((period) => (
                  <tr key={period} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-2 font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                      Bloque {period}
                    </td>
                    {days.map((day) => {
                      const block = teacherSchedule?.blocks?.find(
                        (b) => b.day === day && b.periodIndex === period
                      );

                      return (
                        <td
                          key={day}
                          className="p-2 border border-slate-200 dark:border-slate-700 min-h-[48px] align-middle"
                        >
                          {block ? (
                            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-left">
                              <span className="font-extrabold text-[11px] text-indigo-900 dark:text-indigo-200 block">
                                {block.subjectName}
                              </span>
                              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block">
                                {block.gradeSection}
                              </span>
                              {block.classroom && (
                                <span className="text-[9px] text-slate-400 block font-mono">
                                  {block.classroom}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-300 dark:text-slate-600 font-medium">
                              Hora Libre / Atención
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
