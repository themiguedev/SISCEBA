import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  ArrowRight,
  CheckCircle2,
  Filter,
  Layers,
  School,
  Sparkles,
  AlertCircle,
  Search,
  CheckSquare,
  Square
} from 'lucide-react';

const ACADEMIC_GRADES_SEQUENCE = [
  'Sala de 3 Años',
  'Sala de 4 Años',
  'Sala de 5 Años',
  '1er Grado',
  '2do Grado',
  '3er Grado',
  '4to Grado',
  '5to Grado',
  '6to Grado',
  '1er Año',
  '2do Año',
  '3er Año',
  '4to Año',
  '5to Año'
];

export const MatriculaProsecucionView: React.FC = () => {
  const { students, saveStudent, sendNotification } = useApp();

  // Filtros de Grado / Sección de Origen (Exclusivamente Secciones A y B)
  const [selectedOriginGrade, setSelectedOriginGrade] = useState('1er Año');
  const [selectedOriginSection, setSelectedOriginSection] = useState<'TODAS' | 'A' | 'B'>('TODAS');
  const [searchFilter, setSearchFilter] = useState('');

  // Parámetros de Destino para prosecución masiva o individual
  const [targetGrade, setTargetGrade] = useState('2do Año');
  const [targetSection, setTargetSection] = useState<'A' | 'B'>('A');

  // Selección de estudiantes promovidos
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [prosecutionSuccess, setProsecutionSuccess] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  // Determinar automáticamente el siguiente grado al cambiar grado origen
  const handleOriginGradeChange = (origin: string) => {
    setSelectedOriginGrade(origin);
    const currentIndex = ACADEMIC_GRADES_SEQUENCE.indexOf(origin);
    if (currentIndex >= 0 && currentIndex < ACADEMIC_GRADES_SEQUENCE.length - 1) {
      setTargetGrade(ACADEMIC_GRADES_SEQUENCE[currentIndex + 1]);
    }
  };

  // Filtrado de estudiantes por Grado Origen, Sección y Texto
  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      const matchGrade = stu.grade === selectedOriginGrade;
      const matchSection = selectedOriginSection === 'TODAS' || stu.section === selectedOriginSection;
      const matchText =
        !searchFilter.trim() ||
        stu.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        stu.cedula.toLowerCase().includes(searchFilter.toLowerCase());
      return matchGrade && matchSection && matchText;
    });
  }, [students, selectedOriginGrade, selectedOriginSection, searchFilter]);

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredStudents.map((s) => s.id);
    const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedStudentIds.includes(id));

    if (allSelected) {
      setSelectedStudentIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleExecuteProsecution = () => {
    if (selectedStudentIds.length === 0) return;

    // Determinar nivel según targetGrade
    let level: 'INICIAL' | 'PRIMARIA' | 'MEDIA_GENERAL' = 'MEDIA_GENERAL';
    if (targetGrade.includes('Sala') || targetGrade.includes('Inicial')) {
      level = 'INICIAL';
    } else if (targetGrade.includes('Grado') || targetGrade.includes('Primaria')) {
      level = 'PRIMARIA';
    }

    let count = 0;
    selectedStudentIds.forEach((id) => {
      const student = students.find((s) => s.id === id);
      if (student) {
        saveStudent({
          ...student,
          grade: targetGrade,
          section: targetSection,
          level
        });
        count++;
      }
    });

    sendNotification({
      title: 'Prosecución Escolar y Matriculación Formalizada',
      message: `Se trasladaron y promovieron ${count} estudiante(s) desde ${selectedOriginGrade} hacia ${targetGrade} "${targetSection}". Expedientes sincronizados en Supabase.`,
      category: 'INSTITUCIONAL',
      priority: 'ALTA',
      recipientRole: 'TODOS',
      actionTab: 'GESTION',
      actionSubTab: 'MATRICULA',
      deliveryChannels: ['PORTAL']
    });

    setSuccessCount(count);
    setProsecutionSuccess(true);
    setSelectedStudentIds([]);
    setTimeout(() => setProsecutionSuccess(false), 6000);
  };

  // Promoción individual de un solo alumno
  const handlePromoteIndividual = (studentId: string) => {
    let level: 'INICIAL' | 'PRIMARIA' | 'MEDIA_GENERAL' = 'MEDIA_GENERAL';
    if (targetGrade.includes('Sala') || targetGrade.includes('Inicial')) {
      level = 'INICIAL';
    } else if (targetGrade.includes('Grado') || targetGrade.includes('Primaria')) {
      level = 'PRIMARIA';
    }

    const student = students.find((s) => s.id === studentId);
    if (student) {
      saveStudent({
        ...student,
        grade: targetGrade,
        section: targetSection,
        level
      });

      sendNotification({
        title: 'Prosecución Individual Realizada',
        message: `El alumno ${student.fullName} ha sido promovido exitosamente a ${targetGrade} "${targetSection}".`,
        category: 'INSTITUCIONAL',
        priority: 'MEDIA',
        recipientRole: 'COORDINACION',
        actionTab: 'GESTION',
        actionSubTab: 'MATRICULA',
        deliveryChannels: ['PORTAL']
      });

      setSuccessCount(1);
      setProsecutionSuccess(true);
      setTimeout(() => setProsecutionSuccess(false), 5000);
    }
  };

  const totalBoys = students.filter((s) => s.gender === 'M').length;
  const totalGirls = students.filter((s) => s.gender === 'F').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Gestión Administrativa y Promoción Académica
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C2E53] mt-1">
            Prosecución y Matriculación de Estudiantes
          </h2>
          <p className="text-xs text-slate-500 max-w-3xl">
            Traslade o promueva a los estudiantes de un año escolar al siguiente grado (ej. de primer a segundo año), permitiendo la selección general en bloque o la matriculación individual de los alumnos promovidos.
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Varones</span>
            <span className="text-sm font-black text-[#2C2E53]">{totalBoys}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Hembras</span>
            <span className="text-sm font-black text-[#2C2E53]">{totalGirls}</span>
          </div>
          <div className="px-4 py-1.5 rounded-xl bg-[#2C2E53] text-[#D4AF37] text-center border border-[#D4AF37]/30 shadow-sm">
            <span className="text-[10px] font-bold block uppercase opacity-80">Total Plantel</span>
            <span className="text-sm font-black">{students.length}</span>
          </div>
        </div>
      </div>

      {prosecutionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              ¡Prosecución y matriculación ejecutada con éxito! Se promovieron <strong>{successCount} estudiante(s)</strong> hacia <strong>{targetGrade} "{targetSection}"</strong> y se actualizaron sus expedientes en la nube.
            </span>
          </div>
          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-200 text-emerald-950">
            Actualizado en Supabase
          </span>
        </div>
      )}

      {/* Parámetros de Prosecución: Grado Origen -> Grado Destino */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-cba-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <h3 className="font-extrabold text-sm text-[#2C2E53] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            Parámetros de Prosecución: Origen y Grado Promovido Destino
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            Año Escolar SICE-CBA 2026-2027
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
          {/* Origen Grado */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="text-slate-600 block mb-1 font-bold">1. Grado / Año Actual (Origen):</label>
            <select
              value={selectedOriginGrade}
              onChange={(e) => handleOriginGradeChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold focus:ring-2 focus:ring-[#2C2E53]"
            >
              {ACADEMIC_GRADES_SEQUENCE.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Origen Sección */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="text-slate-600 block mb-1 font-bold">Sección de Origen:</label>
            <select
              value={selectedOriginSection}
              onChange={(e) => setSelectedOriginSection(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold focus:ring-2 focus:ring-[#2C2E53]"
            >
              <option value="TODAS">Todas las secciones (A y B)</option>
              <option value="A">Sección A</option>
              <option value="B">Sección B</option>
            </select>
          </div>

          {/* Destino Grado */}
          <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
            <label className="text-amber-900 block mb-1 font-bold">2. Grado / Año Destino (Promovido):</label>
            <select
              value={targetGrade}
              onChange={(e) => setTargetGrade(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-slate-800 font-bold focus:ring-2 focus:ring-[#2C2E53]"
            >
              {ACADEMIC_GRADES_SEQUENCE.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Destino Sección */}
          <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
            <label className="text-amber-900 block mb-1 font-bold">Sección Asignada:</label>
            <select
              value={targetSection}
              onChange={(e) => setTargetSection(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-slate-800 font-bold focus:ring-2 focus:ring-[#2C2E53]"
            >
              <option value="A">Sección A</option>
              <option value="B">Sección B</option>
            </select>
          </div>
        </div>

        {/* Resumen del movimiento */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-[#D4AF37]" />
            <span>
              Flujo de Traslado Configurado: <strong>{selectedOriginGrade}</strong> (Sección: {selectedOriginSection}){' '}
              <ArrowRight className="inline w-3 h-3 text-slate-400 mx-1" /> Promoción a <strong>{targetGrade} "{targetSection}"</strong>
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            {filteredStudents.length} estudiantes en lista de origen
          </span>
        </div>
      </div>

      {/* Nómina de Alumnos para Selección General o Individual */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSelectAllFiltered}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition flex items-center gap-1.5 shadow-xs"
            >
              {filteredStudents.length > 0 && filteredStudents.every((s) => selectedStudentIds.includes(s.id)) ? (
                <>
                  <Square className="w-3.5 h-3.5 text-slate-500" />
                  Desmarcar Todos
                </>
              ) : (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  Seleccionar Todos en Vista
                </>
              )}
            </button>
            <span className="text-xs text-slate-500 font-semibold">
              <strong>{selectedStudentIds.filter((id) => filteredStudents.some((s) => s.id === id)).length}</strong> de{' '}
              {filteredStudents.length} seleccionados
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Buscar por nombre o cédula..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <button
              type="button"
              onClick={handleExecuteProsecution}
              disabled={selectedStudentIds.length === 0}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
              title="Promover a todos los estudiantes seleccionados al grado y sección destino"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              Promover Seleccionados ({selectedStudentIds.length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1B1C33] text-white uppercase text-[10px] tracking-wider font-extrabold">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Sel.</th>
                <th className="py-3 px-4">Cédula</th>
                <th className="py-3 px-4">Apellidos y Nombres</th>
                <th className="py-3 px-4">Ubicación Actual</th>
                <th className="py-3 px-4">Representante Legal</th>
                <th className="py-3 px-4 text-center">Estatus</th>
                <th className="py-3 px-4 text-center">Acción Individual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 font-medium italic">
                    No se encontraron estudiantes matriculados en <strong>{selectedOriginGrade}</strong> (Sección: {selectedOriginSection}).
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  const isSelected = selectedStudentIds.includes(stu.id);
                  return (
                    <tr
                      key={stu.id}
                      onClick={() => toggleSelectStudent(stu.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-amber-50/50 hover:bg-amber-100/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectStudent(stu.id)}
                          className="rounded text-[#2C2E53] focus:ring-[#D4AF37] w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#2C2E53]">{stu.cedula}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{stu.fullName}</td>
                      <td className="py-3 px-4 font-semibold text-slate-600">
                        {stu.grade} • Sec. {stu.section}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{stu.representativeName}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            stu.status === 'REGULAR'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : stu.status === 'MATERIA_PENDIENTE'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {stu.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handlePromoteIndividual(stu.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-[11px] transition shadow-xs inline-flex items-center gap-1"
                          title={`Promover solo a ${stu.fullName} a ${targetGrade} "${targetSection}"`}
                        >
                          <span>Promover</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
