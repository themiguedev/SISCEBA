import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CRPTaller, CRPEstudianteInscrito, CRPLiteralScore } from '../../types';
import {
  Palette,
  Users,
  Award,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  Save,
  UserCheck,
  Search,
  Filter,
  Check,
  X
} from 'lucide-react';

const CRP_LITERAL_OPTIONS: CRPLiteralScore[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];

const CRP_LITERAL_DESCRIPTIONS: Record<CRPLiteralScore, string> = {
  A: 'Excelente desempeño y dominio de habilidades',
  B: 'Muy buen desempeño en el taller',
  C: 'Buen desempeño y participación constante',
  D: 'Aceptable, consolidando destrezas',
  E: 'En proceso de integración',
  F: 'Participación básica',
  G: 'Acompañamiento requerido',
  H: 'Desarrollo progresivo',
  I: 'Iniciado en el área',
  J: 'Participación incipiente',
  K: 'Actividades elementales',
  L: 'Logro formativo inicial',
  M: 'Exploración del área',
  N: 'Nivelación requerida'
};

const MEDIA_GENERAL_GRADES = ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'];

export const TalleresCRPView: React.FC = () => {
  const {
    crpTalleres,
    crpInscritos,
    saveCRPTaller,
    deleteCRPTaller,
    saveCRPInscrito,
    deleteCRPInscrito,
    autoAssignCRPWorkshops,
    students,
    users,
    currentUser,
    currentRole,
    sendNotification
  } = useApp();

  // Subpestañas del módulo CRP
  const [activeTab, setActiveTab] = useState<'TALLERES' | 'INSCRIPCIONES' | 'CALIFICACIONES'>('TALLERES');

  // Filtros
  const [selectedTallerId, setSelectedTallerId] = useState<string>('TODOS');
  const [filtroGrado, setFiltroGrado] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal / Form Taller
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaller, setEditingTaller] = useState<CRPTaller | null>(null);
  const [tallerForm, setTallerForm] = useState<Partial<CRPTaller>>({
    code: '',
    nombre: '',
    area: '',
    docenteResponsable: '',
    maxCupos: 22,
    horario: 'Viernes 08:00 - 11:30 AM',
    aulaEspacio: 'Laboratorio de Creatividad',
    descripcion: '',
    nivelEducativo: 'MEDIA_GENERAL',
    gradosPermitidos: ['1er Año', '2do Año', '3er Año'],
    activo: true
  });

  // Modal Asignación Manual
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualStudentId, setManualStudentId] = useState('');
  const [manualTallerId, setManualTallerId] = useState('');

  // Notificación de éxito
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Lista de docentes para el selector de responsable
  const teachers = useMemo(() => {
    return users.filter(u => u.role === 'DOCENTE' || u.role === 'COORDINACION' || u.role === 'ADMINISTRADOR');
  }, [users]);

  // Estudiantes de Media General
  const mediaGeneralStudents = useMemo(() => {
    return students.filter(s => s.level === 'MEDIA_GENERAL');
  }, [students]);

  // Estudiantes no inscritos en ningún taller
  const pendingStudents = useMemo(() => {
    const enrolledIds = new Set(crpInscritos.map(i => i.studentId));
    return mediaGeneralStudents.filter(s => !enrolledIds.has(s.id));
  }, [mediaGeneralStudents, crpInscritos]);

  // Cupos ocupados por taller
  const quotaMap = useMemo(() => {
    const map: Record<string, number> = {};
    crpTalleres.forEach(t => { map[t.id] = 0; });
    crpInscritos.forEach(i => {
      map[i.tallerId] = (map[i.tallerId] || 0) + 1;
    });
    return map;
  }, [crpTalleres, crpInscritos]);

  // Abrir modal de creación/edición de taller
  const handleOpenTallerModal = (taller?: CRPTaller) => {
    if (taller) {
      setEditingTaller(taller);
      setTallerForm({ ...taller });
    } else {
      setEditingTaller(null);
      setTallerForm({
        id: `crp-taller-${Date.now()}`,
        code: `CRP-${crpTalleres.length + 1}`,
        nombre: '',
        area: '',
        docenteResponsable: currentUser?.fullName || '',
        docenteId: currentUser?.id,
        maxCupos: 22,
        horario: 'Viernes 08:00 - 11:30 AM',
        aulaEspacio: 'Aula Taller',
        descripcion: '',
        nivelEducativo: 'MEDIA_GENERAL',
        gradosPermitidos: ['1er Año', '2do Año', '3er Año'],
        activo: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveTaller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tallerForm.nombre || !tallerForm.code) {
      alert('Por favor ingrese código y nombre del taller.');
      return;
    }

    const workshopData: CRPTaller = {
      id: editingTaller ? editingTaller.id : `crp-taller-${Date.now()}`,
      code: tallerForm.code || `CRP-${Date.now()}`,
      nombre: tallerForm.nombre || '',
      area: tallerForm.area || 'Creación y Recreación',
      docenteResponsable: tallerForm.docenteResponsable || 'Docente Asignado',
      docenteId: tallerForm.docenteId,
      maxCupos: Number(tallerForm.maxCupos) || 22,
      horario: tallerForm.horario || 'Horario Flexible',
      aulaEspacio: tallerForm.aulaEspacio || 'Aula Central',
      descripcion: tallerForm.descripcion || '',
      nivelEducativo: 'MEDIA_GENERAL',
      gradosPermitidos: tallerForm.gradosPermitidos && tallerForm.gradosPermitidos.length > 0
        ? tallerForm.gradosPermitidos
        : MEDIA_GENERAL_GRADES,
      activo: tallerForm.activo ?? true
    };

    await saveCRPTaller(workshopData);
    setIsModalOpen(false);
    setSuccessMessage(`Taller "${workshopData.nombre}" guardado exitosamente.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDeleteTaller = async (taller: CRPTaller) => {
    if (confirm(`¿Confirma eliminar el taller "${taller.nombre}"? Se retirarán las inscripciones asociadas.`)) {
      await deleteCRPTaller(taller.id);
      setSuccessMessage(`Taller eliminado correctamente.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Inscripción Manual
  const handleManualEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualStudentId || !manualTallerId) {
      alert('Seleccione un estudiante y un taller destino.');
      return;
    }

    const student = students.find(s => s.id === manualStudentId);
    const taller = crpTalleres.find(t => t.id === manualTallerId);

    if (!student || !taller) return;

    // Verificar cupo
    const currentCount = quotaMap[taller.id] || 0;
    if (currentCount >= taller.maxCupos) {
      if (!confirm(`El taller ${taller.nombre} ha alcanzado su capacidad máxima (${taller.maxCupos} cupos). ¿Desea inscribir de forma excepcional?`)) {
        return;
      }
    }

    const enrollment: CRPEstudianteInscrito = {
      id: `crp-enr-${Date.now()}`,
      tallerId: taller.id,
      studentId: student.id,
      studentCedula: student.cedula || 'S/C',
      studentName: student.fullName,
      grado: student.grade,
      seccion: student.section,
      fechaInscripcion: new Date().toISOString(),
      asignacionMetodo: 'MANUAL'
    };

    await saveCRPInscrito(enrollment);
    setIsManualModalOpen(false);
    setManualStudentId('');
    setManualTallerId('');
    setSuccessMessage(`Estudiante ${student.fullName} inscrito en ${taller.nombre}.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Asignación Automatizada
  const handleAutoAssign = async () => {
    const activeWorkshopIds = crpTalleres.filter(t => t.activo).map(t => t.id);
    if (activeWorkshopIds.length === 0) {
      alert('No existen talleres activos disponibles para asignación.');
      return;
    }

    if (pendingStudents.length === 0) {
      alert('Todos los estudiantes de Educación Media General ya se encuentran asignados a un taller CRP.');
      return;
    }

    const assigned = await autoAssignCRPWorkshops(activeWorkshopIds);
    setSuccessMessage(`Se asignaron automáticamente ${assigned} estudiantes distribuidos con cupos equilibrados (20-25).`);
    setTimeout(() => setSuccessMessage(null), 5000);

    sendNotification({
      title: 'Asignación CRP Completada',
      message: `Se distribuyeron ${assigned} estudiantes en talleres de Creación, Recreación y Producción.`,
      category: 'INSTITUCIONAL',
      priority: 'MEDIA',
      recipientRole: 'COORDINACION',
      actionTab: 'GESTION',
      actionSubTab: 'TALLERES_CRP',
      deliveryChannels: ['PORTAL']
    });
  };

  // Cálculo automático del Literal Prevalente (A..N)
  // Regla CBA: Si Momento 2 está registrado, prevalece la calificación más reciente consolidada (Momento 2),
  // o el nivel más favorable si se evidencia consolidación.
  const computePrevalentGrade = (m1?: CRPLiteralScore, m2?: CRPLiteralScore): CRPLiteralScore | undefined => {
    if (m2) return m2;
    if (m1) return m1;
    return undefined;
  };

  const handleUpdateGrade = async (
    record: CRPEstudianteInscrito,
    field: 'calificacionMomento1' | 'calificacionMomento2' | 'calificacionPrevalente',
    value: string
  ) => {
    const val = (value ? value : undefined) as CRPLiteralScore | undefined;
    const updated: CRPEstudianteInscrito = {
      ...record,
      [field]: val
    };

    // Auto-calcular prevalente si no se editó directamente la prevalente
    if (field !== 'calificacionPrevalente') {
      updated.calificacionPrevalente = computePrevalentGrade(
        field === 'calificacionMomento1' ? val : record.calificacionMomento1,
        field === 'calificacionMomento2' ? val : record.calificacionMomento2
      );
    }

    await saveCRPInscrito(updated);
  };

  // Filtrado de inscripciones para vistas
  const filteredInscripciones = useMemo(() => {
    return crpInscritos.filter(item => {
      const matchTaller = selectedTallerId === 'TODOS' || item.tallerId === selectedTallerId;
      const matchGrado = filtroGrado === 'TODOS' || item.grado === filtroGrado;
      const matchSearch =
        !searchTerm ||
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentCedula.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTaller && matchGrado && matchSearch;
    });
  }, [crpInscritos, selectedTallerId, filtroGrado, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Encabezado del Módulo */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
              <Palette className="w-3.5 h-3.5" />
              <span>Educación Media General • Creación, Recreación y Producción (CRP)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Gestión Integral de Talleres CRP
            </h1>
            <p className="text-xs md:text-sm text-emerald-200/80 mt-1 max-w-2xl leading-relaxed">
              Planificación de cupos (20 a 25 cupos por taller), matriculación manual o automatizada, y asentamiento de calificaciones en <strong>dos momentos pedagógicos</strong> con cálculo de literal prevalente (Escala A - N).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleOpenTallerModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Taller</span>
            </button>
            <button
              onClick={handleAutoAssign}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 backdrop-blur-md transition-all active:scale-95"
              title="Asigna automáticamente los estudiantes pendientes a talleres con cupo disponible"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Auto-Asignar Cupos</span>
            </button>
          </div>
        </div>

        {/* Resumen de Métricas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-500/20">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-emerald-300 font-semibold block">Talleres Activos</span>
            <span className="text-2xl font-black text-white">{crpTalleres.filter(t => t.activo).length}</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-emerald-300 font-semibold block">Estudiantes Inscritos</span>
            <span className="text-2xl font-black text-white">{crpInscritos.length}</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-amber-300 font-semibold block">Por Asignar</span>
            <span className="text-2xl font-black text-amber-300">{pendingStudents.length}</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-teal-300 font-semibold block">Evaluación</span>
            <span className="text-sm font-black text-teal-200 mt-1 block">2 Momentos (A-N)</span>
          </div>
        </div>
      </div>

      {/* Alerta de Éxito */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-sm animate-in fade-in duration-200">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Navegación por Pestañas */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('TALLERES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'TALLERES'
              ? 'bg-[#162721] text-emerald-300 shadow-sm border border-emerald-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Talleres y Capacidad ({crpTalleres.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('INSCRIPCIONES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'INSCRIPCIONES'
              ? 'bg-[#162721] text-emerald-300 shadow-sm border border-emerald-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Matrícula de Estudiantes ({crpInscritos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CALIFICACIONES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'CALIFICACIONES'
              ? 'bg-[#162721] text-emerald-300 shadow-sm border border-emerald-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Calificaciones (2 Momentos • Literales A-N)</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* PESTAÑA 1: TALLERES Y CUPOS (20-25 ALUMNOS) */}
      {/* ============================================================== */}
      {activeTab === 'TALLERES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crpTalleres.map(taller => {
              const enrolledCount = quotaMap[taller.id] || 0;
              const percent = Math.min(100, Math.round((enrolledCount / taller.maxCupos) * 100));
              const isFull = enrolledCount >= taller.maxCupos;

              return (
                <div
                  key={taller.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold tracking-wider">
                          {taller.code}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {taller.nombre}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{taller.area}</p>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => handleOpenTallerModal(taller)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          title="Editar Taller"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTaller(taller)}
                          className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600"
                          title="Eliminar Taller"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                      {taller.descripcion || 'Sin descripción detallada registrada.'}
                    </p>

                    <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl mb-4 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Docente:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{taller.docenteResponsable}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Horario:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{taller.horario}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Espacio / Aula:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{taller.aulaEspacio}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Grados:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{taller.gradosPermitidos.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Barra de Capacidad (Ideal 20-25) */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                      <span className="text-slate-600 dark:text-slate-400">Cupos Ocupados</span>
                      <span className={isFull ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                        {enrolledCount} / {taller.maxCupos} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFull
                            ? 'bg-rose-500'
                            : percent >= 80
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    {isFull && (
                      <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Capacidad completa recomendada
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 2: INSCRIPCIONES Y MATRÍCULA */}
      {/* ============================================================== */}
      {activeTab === 'INSCRIPCIONES' && (
        <div className="space-y-4">
          {/* Barra de Filtros y Acciones */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar estudiante o cédula..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-56"
                />
              </div>

              <select
                value={selectedTallerId}
                onChange={e => setSelectedTallerId(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="TODOS">Todos los Talleres ({crpInscritos.length})</option>
                {crpTalleres.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre} ({quotaMap[t.id] || 0}/{t.maxCupos})</option>
                ))}
              </select>

              <select
                value={filtroGrado}
                onChange={e => setFiltroGrado(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="TODOS">Todos los Años</option>
                {MEDIA_GENERAL_GRADES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsManualModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Inscripción Manual</span>
              </button>
            </div>
          </div>

          {/* Tabla de Inscripciones */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Estudiante</th>
                    <th className="p-3.5">Cédula</th>
                    <th className="p-3.5">Grado / Sección</th>
                    <th className="p-3.5">Taller CRP</th>
                    <th className="p-3.5">Método</th>
                    <th className="p-3.5">Fecha</th>
                    <th className="p-3.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredInscripciones.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No hay estudiantes inscritos con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredInscripciones.map(item => {
                      const taller = crpTalleres.find(t => t.id === item.tallerId);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                            {item.studentName}
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-500">
                            {item.studentCedula}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-[11px]">
                              {item.grado} "{item.seccion}"
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-emerald-600 dark:text-emerald-400">
                            {taller?.nombre || 'Taller Desconocido'}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.asignacionMetodo === 'AUTOMATICA'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              }`}
                            >
                              {item.asignacionMetodo}
                            </span>
                          </td>
                          <td className="p-3.5 text-[11px] text-slate-400">
                            {item.fechaInscripcion ? new Date(item.fechaInscripcion).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`¿Retirar al estudiante ${item.studentName} de este taller?`)) {
                                  deleteCRPInscrito(item.id);
                                }
                              }}
                              className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              title="Retirar de Taller"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 3: EVALUACIÓN Y CALIFICACIONES (2 MOMENTOS • LITERALES A-N) */}
      {/* ============================================================== */}
      {activeTab === 'CALIFICACIONES' && (
        <div className="space-y-4">
          {/* Selector de Taller Específico para Asentar Notas */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-emerald-500" />
                <span>Taller a Evaluar:</span>
              </label>
              <select
                value={selectedTallerId}
                onChange={e => setSelectedTallerId(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="TODOS">Todos los Talleres ({crpInscritos.length} alumnos)</option>
                {crpTalleres.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre} ({quotaMap[t.id] || 0} inscritos)</option>
                ))}
              </select>

              <select
                value={filtroGrado}
                onChange={e => setFiltroGrado(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="TODOS">Todos los Grados</option>
                {MEDIA_GENERAL_GRADES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-medium block">
                Escala Literal Oficial: <strong>A a la N</strong>
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                Estructura de 2 Momentos Pedagógicos
              </span>
            </div>
          </div>

          {/* Cuadro de Calificaciones */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#162721] text-emerald-300 font-bold border-b border-emerald-500/30">
                  <tr>
                    <th className="p-3.5">Estudiante</th>
                    <th className="p-3.5">Año / Sección</th>
                    <th className="p-3.5">Taller</th>
                    <th className="p-3.5 text-center bg-slate-800/40">1er Momento</th>
                    <th className="p-3.5 text-center bg-slate-800/60">2do Momento</th>
                    <th className="p-3.5 text-center bg-emerald-950/80 text-emerald-200 font-black">
                      Literal Prevalente
                    </th>
                    <th className="p-3.5">Observaciones Pedagógicas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredInscripciones.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No hay estudiantes inscritos para evaluar en el taller seleccionado.
                      </td>
                    </tr>
                  ) : (
                    filteredInscripciones.map(item => {
                      const taller = crpTalleres.find(t => t.id === item.tallerId);

                      return (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5">
                            <span className="font-bold text-slate-900 dark:text-white block">{item.studentName}</span>
                            <span className="font-mono text-[10px] text-slate-400">{item.studentCedula}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-[11px]">
                              {item.grado} "{item.seccion}"
                            </span>
                          </td>
                          <td className="p-3.5 font-medium text-slate-600 dark:text-slate-300">
                            {taller?.nombre}
                          </td>

                          {/* 1er Momento */}
                          <td className="p-3.5 text-center bg-slate-50/50 dark:bg-slate-800/20">
                            <select
                              value={item.calificacionMomento1 || ''}
                              onChange={e => handleUpdateGrade(item, 'calificacionMomento1', e.target.value)}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-xs text-center focus:ring-2 focus:ring-emerald-500 shadow-sm"
                            >
                              <option value="">--</option>
                              {CRP_LITERAL_OPTIONS.map(lit => (
                                <option key={lit} value={lit}>
                                  {lit}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* 2do Momento */}
                          <td className="p-3.5 text-center bg-slate-50/70 dark:bg-slate-800/40">
                            <select
                              value={item.calificacionMomento2 || ''}
                              onChange={e => handleUpdateGrade(item, 'calificacionMomento2', e.target.value)}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-xs text-center focus:ring-2 focus:ring-emerald-500 shadow-sm"
                            >
                              <option value="">--</option>
                              {CRP_LITERAL_OPTIONS.map(lit => (
                                <option key={lit} value={lit}>
                                  {lit}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Prevalente (Calculado con opción a ajuste manual) */}
                          <td className="p-3.5 text-center bg-emerald-50/50 dark:bg-emerald-950/20">
                            <select
                              value={item.calificacionPrevalente || ''}
                              onChange={e => handleUpdateGrade(item, 'calificacionPrevalente', e.target.value)}
                              className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900 border border-emerald-400 dark:border-emerald-600 font-black text-xs text-emerald-900 dark:text-emerald-100 text-center shadow-sm"
                            >
                              <option value="">--</option>
                              {CRP_LITERAL_OPTIONS.map(lit => (
                                <option key={lit} value={lit}>
                                  {lit}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Observaciones */}
                          <td className="p-3.5">
                            <input
                              type="text"
                              defaultValue={item.observaciones || ''}
                              onBlur={e => {
                                if (e.target.value !== (item.observaciones || '')) {
                                  saveCRPInscrito({ ...item, observaciones: e.target.value });
                                }
                              }}
                              placeholder="Observación cualitativa..."
                              className="w-full px-2.5 py-1 text-[11px] rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
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
      )}

      {/* ============================================================== */}
      {/* MODAL CREAR / EDITAR TALLER CRP */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-emerald-500" />
                <span>{editingTaller ? 'Editar Taller CRP' : 'Nuevo Taller CRP'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTaller} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Código</label>
                  <input
                    type="text"
                    required
                    value={tallerForm.code || ''}
                    onChange={e => setTallerForm({ ...tallerForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                    placeholder="CRP-01"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Área / Especialidad</label>
                  <input
                    type="text"
                    required
                    value={tallerForm.area || ''}
                    onChange={e => setTallerForm({ ...tallerForm, area: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    placeholder="Tecnología, Arte, Música..."
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nombre del Taller</label>
                <input
                  type="text"
                  required
                  value={tallerForm.nombre || ''}
                  onChange={e => setTallerForm({ ...tallerForm, nombre: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  placeholder="Robótica Maker, Artes Escénicas..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Docente Responsable</label>
                  <select
                    value={tallerForm.docenteResponsable || ''}
                    onChange={e => {
                      const teacher = teachers.find(t => t.fullName === e.target.value);
                      setTallerForm({
                        ...tallerForm,
                        docenteResponsable: e.target.value,
                        docenteId: teacher?.id
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="">Seleccionar Docente...</option>
                    {teachers.map(tc => (
                      <option key={tc.id} value={tc.fullName}>
                        {tc.fullName} ({tc.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Cupos Máximos (20 - 25)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="35"
                    value={tallerForm.maxCupos || 22}
                    onChange={e => setTallerForm({ ...tallerForm, maxCupos: parseInt(e.target.value) || 22 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Horario de Encuentro</label>
                  <input
                    type="text"
                    value={tallerForm.horario || ''}
                    onChange={e => setTallerForm({ ...tallerForm, horario: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    placeholder="Viernes 08:00 - 11:30 AM"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Espacio Físico / Aula</label>
                  <input
                    type="text"
                    value={tallerForm.aulaEspacio || ''}
                    onChange={e => setTallerForm({ ...tallerForm, aulaEspacio: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    placeholder="Laboratorio de Robótica"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Descripción del Taller</label>
                <textarea
                  rows={2}
                  value={tallerForm.descripcion || ''}
                  onChange={e => setTallerForm({ ...tallerForm, descripcion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  placeholder="Propósito formativo del taller..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20"
                >
                  Guardar Taller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL INSCRIPCIÓN MANUAL */}
      {/* ============================================================== */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-500" />
                <span>Inscripción Manual en CRP</span>
              </h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualEnroll} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Estudiante Pendiente ({pendingStudents.length} disponibles)
                </label>
                <select
                  required
                  value={manualStudentId}
                  onChange={e => setManualStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="">Seleccione estudiante...</option>
                  {pendingStudents.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.grade} "{st.section}") - {st.cedula || 'S/C'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Taller Destino
                </label>
                <select
                  required
                  value={manualTallerId}
                  onChange={e => setManualTallerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="">Seleccione taller...</option>
                  {crpTalleres.map(tl => {
                    const currentOccupancy = quotaMap[tl.id] || 0;
                    return (
                      <option key={tl.id} value={tl.id}>
                        {tl.nombre} ({currentOccupancy}/{tl.maxCupos} cupos)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md"
                >
                  Inscribir Alumno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
