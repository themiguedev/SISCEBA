import React, { useState, useEffect, useRef } from 'react';
import {
  SlidersHorizontal,
  FolderKanban,
  MenuSquare,
  AlertOctagon,
  FileSearch,
  Users2,
  ShieldAlert,
  FileBarChart2,
  Share2,
  GraduationCap,
  Clock,
  Award,
  Users,
  Briefcase,
  Syringe,
  Stethoscope,
  School,
  FileSpreadsheet,
  Plus,
  Search,
  Check,
  Edit2,
  Trash2,
  Download,
  Info,
  Building2,
  Phone,
  Mail,
  MapPin,
  Save,
  CheckCircle2,
  Lock,
  CheckSquare,
  Filter,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InstitutionalSchoolData } from '../../types';
import PRIVILEGIOS_DATA from '../../data/privilegiosCEO.json';

// 17 CEO Catalog Options
export type AvanzadaSection =
  | 'MODULOS'
  | 'CATEGORIAS_MENU'
  | 'EXCEPCIONES'
  | 'AUDITORIA'
  | 'ROLES_USUARIO'
  | 'PRIVILEGIOS'
  | 'REPORTES'
  | 'ASIGNAR_REPORTES'
  | 'LITERALES'
  | 'TIPOS_HORARIOS'
  | 'TITULOS_ACADEMICOS'
  | 'PARENTESCOS'
  | 'PROFESIONES'
  | 'VACUNAS'
  | 'SERVICIOS_MEDICOS'
  | 'DATOS_ESCUELA'
  | 'EXPORTAR_CALIFICACIONES';

interface SectionMenuItem {
  id: AvanzadaSection;
  label: string;
  icon: React.ElementType;
  count?: number | string;
  badge?: string;
}

const getMenuItems = (
  privCount: string,
  titulosCount: number,
  parentescosCount: number,
  profesionesCount: number,
  vacunasCount: number,
  serviciosCount: number,
  horariosCount: number,
  auditCount: number
): SectionMenuItem[] => [
  { id: 'MODULOS', label: 'MÓDULOS', icon: FolderKanban, count: 9 },
  { id: 'CATEGORIAS_MENU', label: 'CATEGORÍAS DEL MENÚ', icon: MenuSquare, count: 3 },
  { id: 'EXCEPCIONES', label: 'EXCEPCIONES', icon: AlertOctagon, count: 0 },
  { id: 'AUDITORIA', label: 'AUDITORÍA', icon: FileSearch, count: `${auditCount} eventos`, badge: 'BD' },
  { id: 'ROLES_USUARIO', label: 'ROLES DE USUARIO', icon: Users2, count: 8 },
  { id: 'PRIVILEGIOS', label: 'PRIVILEGIOS', icon: ShieldAlert, count: privCount, badge: 'BD' },
  { id: 'REPORTES', label: 'REPORTES', icon: FileBarChart2, count: 14 },
  { id: 'ASIGNAR_REPORTES', label: 'ASIGNAR REPORTES', icon: Share2, count: 12 },
  { id: 'LITERALES', label: 'LITERALES', icon: GraduationCap, count: '3 Escalas' },
  { id: 'TIPOS_HORARIOS', label: 'TIPOS DE HORARIOS', icon: Clock, count: `${horariosCount} Tipos`, badge: 'BD' },
  { id: 'TITULOS_ACADEMICOS', label: 'TÍTULOS ACADÉMICOS', icon: Award, count: `${titulosCount}`, badge: 'BD' },
  { id: 'PARENTESCOS', label: 'PARENTESCOS', icon: Users, count: `${parentescosCount}`, badge: 'BD' },
  { id: 'PROFESIONES', label: 'PROFESIONES', icon: Briefcase, count: `${profesionesCount}`, badge: 'BD' },
  { id: 'VACUNAS', label: 'VACUNAS', icon: Syringe, count: `${vacunasCount}`, badge: 'BD' },
  { id: 'SERVICIOS_MEDICOS', label: 'SERVICIOS MÉDICOS', icon: Stethoscope, count: `${serviciosCount}`, badge: 'BD' },
  { id: 'DATOS_ESCUELA', label: 'DATOS DE LA ESCUELA', icon: School, badge: 'BD' },
  { id: 'EXPORTAR_CALIFICACIONES', label: 'EXPORTAR CALIFICACIONES', icon: FileSpreadsheet, badge: 'Oficial' }
];

export const ConfiguracionAvanzadaView: React.FC = () => {
  const {
    currentRole,
    schoolYearConfig,
    students,
    users,
    systemPrivileges,
    toggleSystemPrivilege,
    resetSystemPrivileges,
    schoolData,
    saveSchoolData,
    systemCatalogs,
    saveSystemCatalogs,
    auditLogs,
    addAuditLog,
    scheduleTypes,
    saveScheduleType,
    isSavingCloud,
    isSupabaseActive
  } = useApp();
  const [activeSection, setActiveSection] = useState<AvanzadaSection>('MODULOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  // Estados para la Matriz de Privilegios CEO (13 roles x 142 privilegios)
  const [selectedRolePrivilegios, setSelectedRolePrivilegios] = useState<string>('Administrador del Sistema');
  const [privSearchTerm, setPrivSearchTerm] = useState<string>('');
  const [privCategoryFilter, setPrivCategoryFilter] = useState<string>('TODAS');
  const [privStatusFilter, setPrivStatusFilter] = useState<'TODOS' | 'ACTIVOS' | 'INACTIVOS'>('TODOS');
  const [isResettingPrivs, setIsResettingPrivs] = useState(false);

  // Inputs para nuevos registros de catálogos
  const [newParentesco, setNewParentesco] = useState('');
  const [newProfesion, setNewProfesion] = useState('');
  const [newVacuna, setNewVacuna] = useState('');
  const [newServicio, setNewServicio] = useState('');
  const [newTitulo, setNewTitulo] = useState('');

  // Formulario local editable de datos de la escuela (sincronizado con BD)
  const [editSchoolData, setEditSchoolData] = useState<InstitutionalSchoolData>(schoolData);

  useEffect(() => {
    setEditSchoolData(schoolData);
  }, [schoolData]);

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleSaveSchoolData = async () => {
    await saveSchoolData(editSchoolData);
    await addAuditLog('Actualización Datos Institucionales', `Modificados datos legales del plantel`);
    triggerToast();
  };

  const handleAddParentesco = async () => {
    if (!newParentesco.trim()) return;
    const clean = newParentesco.trim().toUpperCase();
    if (systemCatalogs.parentescos.includes(clean)) return;
    const next = [...systemCatalogs.parentescos, clean];
    await saveSystemCatalogs({ ...systemCatalogs, parentescos: next });
    await addAuditLog('Nuevo Parentesco Agregado', `Agregado: ${clean}`);
    setNewParentesco('');
    triggerToast();
  };

  const handleRemoveParentesco = async (item: string) => {
    const next = systemCatalogs.parentescos.filter(p => p !== item);
    await saveSystemCatalogs({ ...systemCatalogs, parentescos: next });
    await addAuditLog('Parentesco Eliminado', `Removido: ${item}`);
    triggerToast();
  };

  const handleAddProfesion = async () => {
    if (!newProfesion.trim()) return;
    const clean = newProfesion.trim().toUpperCase();
    if (systemCatalogs.profesiones.includes(clean)) return;
    const next = [...systemCatalogs.profesiones, clean];
    await saveSystemCatalogs({ ...systemCatalogs, profesiones: next });
    await addAuditLog('Nueva Profesión Agregada', `Agregada: ${clean}`);
    setNewProfesion('');
    triggerToast();
  };

  const handleRemoveProfesion = async (item: string) => {
    const next = systemCatalogs.profesiones.filter(p => p !== item);
    await saveSystemCatalogs({ ...systemCatalogs, profesiones: next });
    await addAuditLog('Profesión Eliminada', `Removida: ${item}`);
    triggerToast();
  };

  const handleAddVacuna = async () => {
    if (!newVacuna.trim()) return;
    const clean = newVacuna.trim();
    if (systemCatalogs.vacunas.includes(clean)) return;
    const next = [...systemCatalogs.vacunas, clean];
    await saveSystemCatalogs({ ...systemCatalogs, vacunas: next });
    await addAuditLog('Nueva Vacuna Registrada', `Agregada: ${clean}`);
    setNewVacuna('');
    triggerToast();
  };

  const handleRemoveVacuna = async (item: string) => {
    const next = systemCatalogs.vacunas.filter(v => v !== item);
    await saveSystemCatalogs({ ...systemCatalogs, vacunas: next });
    await addAuditLog('Vacuna Eliminada', `Removida: ${item}`);
    triggerToast();
  };

  const handleAddServicio = async () => {
    if (!newServicio.trim()) return;
    const clean = newServicio.trim();
    if (systemCatalogs.serviciosMedicos.includes(clean)) return;
    const next = [...systemCatalogs.serviciosMedicos, clean];
    await saveSystemCatalogs({ ...systemCatalogs, serviciosMedicos: next });
    await addAuditLog('Nuevo Servicio Médico', `Agregado: ${clean}`);
    setNewServicio('');
    triggerToast();
  };

  const handleRemoveServicio = async (item: string) => {
    const next = systemCatalogs.serviciosMedicos.filter(s => s !== item);
    await saveSystemCatalogs({ ...systemCatalogs, serviciosMedicos: next });
    await addAuditLog('Servicio Médico Eliminado', `Removido: ${item}`);
    triggerToast();
  };

  const handleAddTitulo = async () => {
    if (!newTitulo.trim()) return;
    const clean = newTitulo.trim();
    if (systemCatalogs.titulosAcademicos.includes(clean)) return;
    const next = [...systemCatalogs.titulosAcademicos, clean];
    await saveSystemCatalogs({ ...systemCatalogs, titulosAcademicos: next });
    await addAuditLog('Nuevo Título Académico', `Agregado: ${clean}`);
    setNewTitulo('');
    triggerToast();
  };

  const handleRemoveTitulo = async (item: string) => {
    const next = systemCatalogs.titulosAcademicos.filter(t => t !== item);
    await saveSystemCatalogs({ ...systemCatalogs, titulosAcademicos: next });
    await addAuditLog('Título Académico Eliminado', `Removido: ${item}`);
    triggerToast();
  };

  const menuItems = getMenuItems(
    '142 x 13 Roles',
    systemCatalogs.titulosAcademicos.length,
    systemCatalogs.parentescos.length,
    systemCatalogs.profesiones.length,
    systemCatalogs.vacunas.length,
    systemCatalogs.serviciosMedicos.length,
    scheduleTypes.length,
    auditLogs.length
  );

  // Solo Administrador
  if (currentRole !== 'ADMINISTRADOR') {
    return (
      <div className="bg-white rounded-2xl p-8 border border-rose-200 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-rose-950">Acceso Restringido - Configuración Avanzada</h3>
        <p className="text-xs text-rose-700 max-w-md mx-auto">
          Este apartado contiene parámetros estructurales del sistema CEO y está reservado exclusivamente para el Administrador de Sistemas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-xs font-bold">Parámetro actualizado en catálogo institucional correctamente.</p>
        </div>
      )}

      {/* Main Container: Master Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: CEO Menu Catalog */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-cba-card overflow-hidden">
          <div className="p-4 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-wider uppercase text-white">Configuración Avanzada</h3>
                <p className="text-[10px] text-violet-300 font-semibold">Parámetros del Sistema (CEO)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-violet-500/30 text-violet-200 text-[10px] font-black tracking-wide border border-violet-400/30">
              17 CATÁLOGOS
            </span>
          </div>

          {/* Quick Filter */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/70">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrar catálogo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500 bg-white"
              />
            </div>
          </div>

          {/* Menu Items List */}
          <div className="divide-y divide-slate-100 max-h-[680px] overflow-y-auto no-scrollbar">
            {menuItems.filter((item) =>
              item.label.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const isPrivilegios = item.id === 'PRIVILEGIOS';

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-xs transition-colors group ${
                    isActive
                      ? 'bg-violet-600 text-white font-black shadow-inner'
                      : 'hover:bg-slate-50 text-slate-700 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-transform ${
                        isActive ? 'bg-white scale-125' : 'bg-slate-300 group-hover:bg-violet-400'
                      }`}
                    />
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-violet-600'
                      }`}
                    />
                    <span className="tracking-wide text-[11px]">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                          isPrivilegios
                            ? isActive
                              ? 'bg-amber-400 text-slate-900'
                              : 'bg-amber-100 text-amber-800'
                            : isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                          isActive
                            ? 'bg-white/20 text-white font-bold'
                            : 'bg-slate-100 text-slate-500 font-medium'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detail Panel */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-cba-card p-6 min-h-[640px]">
          {/* Header of Active Section */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-600"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Configuración Avanzada CBA
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                {menuItems.find((i) => i.id === activeSection)?.label}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs font-bold border border-violet-200">
              Admin Exclusive
            </span>
          </div>

          {/* DETAIL 1: MÓDULOS */}
          {activeSection === 'MODULOS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Lista de módulos funcionales registrados en el sistema institucional SICE-CBA:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'ESCRITORIO', name: 'Escritorio & Tablero Central', status: 'Activo', icon: '📊' },
                  { id: 'GESTION', name: 'Gestión Escolar & Secretaría', status: 'Activo', icon: '📁' },
                  { id: 'INICIAL', name: 'Educación Inicial (Cualitativo)', status: 'Activo', icon: '🎨' },
                  { id: 'PRIMARIA', name: 'Educación Primaria (Formativo L-P-I)', status: 'Activo', icon: '📘' },
                  { id: 'MEDIA_GENERAL', name: 'Educación Media General (01-20)', status: 'Activo', icon: '🎓' },
                  { id: 'CONSULTAS', name: 'Consultas & Sábana de Notas', status: 'Activo', icon: '📈' },
                  { id: 'COMUNIDAD', name: 'Comunidad CBA & Cartelera', status: 'Activo', icon: '💬' },
                  { id: 'CONFIGURACION', name: 'Configuración Institucional', status: 'Activo', icon: '⚙️' },
                  { id: 'AYUDA', name: 'Ayuda, Manual & Mapa del Sitio', status: 'Activo', icon: '❓' }
                ].map((mod) => (
                  <div key={mod.id} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{mod.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{mod.name}</h4>
                        <p className="text-[10px] font-mono text-slate-400">{mod.id}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {mod.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL 2: CATEGORÍAS DEL MENÚ */}
          {activeSection === 'CATEGORIAS_MENU' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Agrupaciones de primer nivel en el menú lateral institucional:</p>
              <div className="space-y-3">
                {[
                  { name: 'SISTEMA & GESTIÓN', desc: 'Escritorio Central y Gestión Escolar (Secretaría / Matrícula / Pases)', count: '2 Módulos' },
                  { name: 'NIVELES PEDAGÓGICOS', desc: 'Educación Inicial, Educación Primaria y Educación Media General con sus 3 pilares', count: '3 Subsistemas' },
                  { name: 'INSTITUCIONAL & COMUNIDAD', desc: 'Consultas, Comunidad, Configuración Institucional y Ayuda', count: '4 Módulos' }
                ].map((cat, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{cat.name}</h4>
                      <p className="text-[11px] text-slate-500">{cat.desc}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-violet-100 text-violet-800 text-xs font-bold">
                      {cat.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL 3: EXCEPCIONES */}
          {activeSection === 'EXCEPCIONES' && (
            <div className="p-8 rounded-xl border border-slate-200 text-center space-y-3 bg-slate-50/50">
              <AlertOctagon className="w-10 h-10 mx-auto text-slate-300" />
              <h4 className="text-sm font-bold text-slate-700">Sin Excepciones del Sistema Registradas</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No existen excepciones operativas ni bloqueos extraordinarios vigentes en el ciclo actual.
              </p>
            </div>
          )}

          {/* DETAIL 4: AUDITORÍA (CONEXIÓN DIRECTA CON SUPABASE) */}
          {activeSection === 'AUDITORIA' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Bitácora Oficial de Seguridad y Eventos del Sistema:</p>
                  <p className="text-[11px] text-slate-500">Sincronizado en tiempo real con la tabla <code className="font-mono text-violet-600 dark:text-violet-400">system_audit_logs</code></p>
                </div>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 max-h-[480px] overflow-y-auto custom-comfortable-scrollbar">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                    <div>
                      <p className="font-black text-slate-800 dark:text-slate-200">{log.evento}</p>
                      <p className="text-[10px] text-slate-400">
                        Usuario: <span className="font-mono font-bold text-violet-700 dark:text-violet-300">{log.usuario}</span> ({log.rol})
                        {log.detalles && <span className="ml-1 text-slate-500">• {log.detalles}</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{log.fecha}</span>
                      <p className="text-[9px] font-mono text-slate-400">IP: {log.ip}</p>
                    </div>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No se registran eventos en la bitácora actualmente.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DETAIL 5: ROLES DE USUARIO */}
          {activeSection === 'ROLES_USUARIO' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Roles jerárquicos configurados con RBAC estricto en SICE-CBA:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { rol: 'ADMINISTRADOR', peso: 100, desc: 'Control total del sistema, bases de datos y seguridad.' },
                  { rol: 'DIRECTOR', peso: 80, desc: 'Máxima autoridad académica, firma de actas y boletines.' },
                  { rol: 'COORDINACION', peso: 60, desc: 'Control de Estudios y Evaluación institucional.' },
                  { rol: 'SECRETARIA', peso: 50, desc: 'Inscripciones, matrícula, constancias y títulos.' },
                  { rol: 'DOCENTE', peso: 40, desc: 'Planificación, evaluaciones y registro de notas.' },
                  { rol: 'ASISTENTE', peso: 30, desc: 'Asistencia, pases de retraso y conducta escolar.' },
                  { rol: 'REPRESENTANTE', peso: 20, desc: 'Consulta de boletines y comunicados de sus representados.' },
                  { rol: 'ESTUDIANTE', peso: 10, desc: 'Consulta de asignaturas, notas y horarios de clase.' }
                ].map((r) => (
                  <div key={r.rol} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">{r.rol}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        Nivel {r.peso}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL 6: PRIVILEGIOS (MATRIZ CEO - 13 ROLES x 142 PRIVILEGIOS EXACTOS - CONEXIÓN CON BD) */}
          {activeSection === 'PRIVILEGIOS' && (() => {
            const currentRoleObj = systemPrivileges.roles.find(
              (r) => r.nombre === selectedRolePrivilegios
            ) || systemPrivileges.roles[0];

            const categories = [
              'TODAS',
              'COMUNIDAD CEO',
              'CONF. AVANZADA',
              'CONFIGURACIÓN',
              'CONSULTAS',
              'GESTIÓN',
              'INICIAL',
              'MEDIA GENERAL',
              'PRIMARIA'
            ];

            const filteredPrivs = currentRoleObj.privilegios.filter((p) => {
              const matchesCat = privCategoryFilter === 'TODAS' || p.categoria === privCategoryFilter;
              const matchesStatus =
                privStatusFilter === 'TODOS' ? true :
                privStatusFilter === 'ACTIVOS' ? p.habilitar :
                !p.habilitar;
              const matchesSearch =
                !privSearchTerm ||
                p.opcion.toLowerCase().includes(privSearchTerm.toLowerCase()) ||
                p.descripcion.toLowerCase().includes(privSearchTerm.toLowerCase()) ||
                p.nro.toString() === privSearchTerm.trim();
              return matchesCat && matchesStatus && matchesSearch;
            });

            const enabledCount = currentRoleObj.privilegios.filter((p) => p.habilitar).length;

            const handleToggle = async (nro: number) => {
              await toggleSystemPrivilege(selectedRolePrivilegios, nro);
              triggerToast();
            };

            const handleReset = async () => {
              if (window.confirm('¿Está seguro de restablecer todos los privilegios de los 13 roles a los valores predeterminados del CEO y sincronizar con la Base de Datos?')) {
                setIsResettingPrivs(true);
                await resetSystemPrivileges();
                setIsResettingPrivs(false);
                triggerToast();
              }
            };

            return (
              <div className="space-y-4">
                {/* Role description and summary bar */}
                <div className="p-4 rounded-2xl border border-violet-200 dark:border-violet-900/60 bg-gradient-to-r from-violet-50/80 via-white to-purple-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-violet-950/40 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-violet-100 dark:bg-violet-950/80 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                        Matriz Oficial CEO
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                        142 Registros Consecutivos
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="px-1.5 py-0.2 rounded bg-violet-600 text-white font-mono text-[10px]">ADM</span>
                        Gestión Integral de Privilegios por Perfil de Usuario
                      </p>
                      <p className="text-[12px] text-slate-600 dark:text-slate-400">
                        Configurando perfil activo:{' '}
                        <span className="font-extrabold text-violet-700 dark:text-violet-300">
                          {currentRoleObj.nombre}
                        </span>
                      </p>
                    </div>

                    {/* Progress Bar of enabled privileges */}
                    <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 max-w-md h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.round((enabledCount / 142) * 100)}%` }}
                        />
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {enabledCount} Activos
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 font-bold text-slate-500 dark:text-slate-400">
                          <Lock className="w-3 h-3" /> {142 - enabledCount} Inactivos
                        </span>
                        <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 font-bold">
                          ({Math.round((enabledCount / 142) * 100)}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Role Picker */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full lg:w-auto">
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={isResettingPrivs}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center gap-1.5 transition shadow-sm shrink-0"
                      title="Restablecer privilegios de los 13 roles a los valores originales del CEO"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 text-violet-600 dark:text-violet-400 ${isResettingPrivs ? 'animate-spin' : ''}`} />
                      <span>Restablecer CEO</span>
                    </button>
                    <div className="relative">
                      <select
                        value={selectedRolePrivilegios}
                        onChange={(e) => setSelectedRolePrivilegios(e.target.value)}
                        className="w-full sm:w-auto pl-3 pr-8 py-2 text-xs rounded-xl border border-violet-300 dark:border-violet-700 bg-white dark:bg-slate-800 font-extrabold text-violet-950 dark:text-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm appearance-none cursor-pointer"
                      >
                        {systemPrivileges.roles.map((r) => {
                          const activeInRole = r.privilegios.filter(p => p.habilitar).length;
                          return (
                            <option key={r.nombre} value={r.nombre} className="dark:bg-slate-800 dark:text-slate-200 font-medium">
                              Rol: {r.nombre} ({activeInRole}/142 ☑)
                            </option>
                          );
                        })}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-violet-500">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters toolbar */}
                <div className="space-y-3 bg-slate-50/90 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Search in Options / Descriptions */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar por opción, descripción o Nro (ej. 1, Mensajería, ADM, Boleta)..."
                        value={privSearchTerm}
                        onChange={(e) => setPrivSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs font-medium placeholder:text-slate-400"
                      />
                      {privSearchTerm && (
                        <button
                          type="button"
                          onClick={() => setPrivSearchTerm('')}
                          className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold px-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Status Filter Buttons (Todos / Activos / Inactivos) */}
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPrivStatusFilter('TODOS')}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                          privStatusFilter === 'TODOS'
                            ? 'bg-violet-600 text-white shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        Todos ({142})
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrivStatusFilter('ACTIVOS')}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition flex items-center gap-1 ${
                          privStatusFilter === 'ACTIVOS'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        Activos ({enabledCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrivStatusFilter('INACTIVOS')}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition flex items-center gap-1 ${
                          privStatusFilter === 'INACTIVOS'
                            ? 'bg-slate-700 text-white shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <Lock className="w-3 h-3" />
                        Inactivos ({142 - enabledCount})
                      </button>
                    </div>

                    {/* Quick status counter badge */}
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium shrink-0 flex items-center gap-2">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Visibles:</span>
                      <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-black text-violet-700 dark:text-violet-300 shadow-2xs">
                        {filteredPrivs.length}
                      </span>
                    </div>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-600 dark:text-slate-400 mr-1 shrink-0">
                      <Filter className="w-3.5 h-3.5 text-violet-500" />
                      <span>Categoría:</span>
                    </div>
                    {categories.map((cat) => {
                      const isSelected = privCategoryFilter === cat;
                      const countInCat = cat === 'TODAS'
                        ? currentRoleObj.privilegios.length
                        : currentRoleObj.privilegios.filter(p => p.categoria === cat).length;
                      const activeInCat = cat === 'TODAS'
                        ? enabledCount
                        : currentRoleObj.privilegios.filter(p => p.categoria === cat && p.habilitar).length;

                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setPrivCategoryFilter(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-violet-700 text-white shadow-xs scale-102 ring-2 ring-violet-700/50'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-2xs'
                          }`}
                        >
                          <span>{cat}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                              isSelected
                                ? 'bg-violet-900/80 text-violet-100'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                            title={`${activeInCat} habilitados de ${countInCat}`}
                          >
                            {activeInCat}/{countInCat}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* The 142 Privileges Table with enhanced styling and comfortable scrollbar */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                  <div className="max-h-[600px] overflow-y-auto custom-comfortable-scrollbar pr-1">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/90 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider backdrop-blur-sm">
                        <tr>
                          <th className="py-3 px-3 w-16 text-center">Nro</th>
                          <th className="py-3 px-3 w-36">Categoría</th>
                          <th className="py-3 px-3 w-52">Opción / Menú</th>
                          <th className="py-3 px-4">Descripción del Privilegio</th>
                          <th className="py-3 px-3 w-28 text-center">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                        {filteredPrivs.map((priv) => {
                          const isHabilitado = priv.habilitar;

                          // Color de categoría específico y limpio
                          const catBadgeClass =
                            priv.categoria === 'COMUNIDAD CEO' ? 'bg-pink-100 dark:bg-pink-950/60 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-900' :
                            priv.categoria === 'CONF. AVANZADA' ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-900' :
                            priv.categoria === 'CONFIGURACIÓN' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900' :
                            priv.categoria === 'CONSULTAS' ? 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900' :
                            priv.categoria === 'GESTIÓN' ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900' :
                            priv.categoria === 'INICIAL' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900' :
                            priv.categoria === 'MEDIA GENERAL' ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900' :
                            'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';

                          return (
                            <tr
                              key={priv.nro}
                              className={`transition-colors duration-150 ${
                                isHabilitado
                                  ? 'bg-white dark:bg-slate-900 hover:bg-violet-50/50 dark:hover:bg-slate-800/70'
                                  : 'bg-slate-50/40 dark:bg-slate-950/30 text-slate-400 dark:text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                              }`}
                            >
                              {/* Nro Consecutivo */}
                              <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-500 dark:text-slate-400 text-xs">
                                #{priv.nro}
                              </td>

                              {/* Categoría */}
                              <td className="py-2.5 px-3">
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${catBadgeClass}`}>
                                  {priv.categoria}
                                </span>
                              </td>

                              {/* Opción */}
                              <td className="py-2.5 px-3">
                                <span className={`text-xs font-bold ${
                                  isHabilitado ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                                }`}>
                                  {priv.opcion}
                                </span>
                              </td>

                              {/* Descripción con prefijos destacados */}
                              <td className="py-2.5 px-4 text-xs leading-relaxed">
                                {priv.descripcion ? (
                                  <span className={isHabilitado ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}>
                                    {priv.descripcion.startsWith('ADM:') ? (
                                      <strong className="text-purple-600 dark:text-purple-400 font-black mr-1">ADM:</strong>
                                    ) : priv.descripcion.startsWith('DOC:') ? (
                                      <strong className="text-blue-600 dark:text-blue-400 font-black mr-1">DOC:</strong>
                                    ) : priv.descripcion.startsWith('EST:') ? (
                                      <strong className="text-emerald-600 dark:text-emerald-400 font-black mr-1">EST:</strong>
                                    ) : priv.descripcion.startsWith('REP:') ? (
                                      <strong className="text-amber-600 dark:text-amber-400 font-black mr-1">REP:</strong>
                                    ) : priv.descripcion.startsWith('UCE:') ? (
                                      <strong className="text-cyan-600 dark:text-cyan-400 font-black mr-1">UCE:</strong>
                                    ) : null}
                                    {priv.descripcion.replace(/^(ADM:|DOC:|EST:|REP:|UCE:)\s*/, '')}
                                  </span>
                                ) : (
                                  <span className="text-slate-300 dark:text-slate-600 italic text-[11px]">—</span>
                                )}
                              </td>

                              {/* Habilitar / Deshabilitar Toggle */}
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggle(priv.nro)}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black transition-all shadow-2xs cursor-pointer ${
                                    isHabilitado
                                      ? 'bg-violet-600 hover:bg-violet-700 text-white'
                                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                                  }`}
                                  title={isHabilitado ? 'Habilitado (Click para desactivar en BD)' : 'Inactivo (Click para activar en BD)'}
                                >
                                  {isHabilitado ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Activo</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-[10px]">✕</span>
                                      <span>Inactivo</span>
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {filteredPrivs.length === 0 && (
                    <div className="p-12 text-center text-xs text-slate-400 dark:text-slate-500 space-y-2">
                      <Search className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-600" />
                      <p className="font-bold text-slate-600 dark:text-slate-400">No se encontraron privilegios que coincidan con la búsqueda o filtro.</p>
                      <button
                        type="button"
                        onClick={() => { setPrivSearchTerm(''); setPrivCategoryFilter('TODAS'); }}
                        className="text-violet-600 dark:text-violet-400 underline font-bold"
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  )}

                  {/* Table footer with stats */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-bold">
                    <span>
                      Mostrando {filteredPrivs.length} de 142 registros para:{' '}
                      <span className="text-violet-700 dark:text-violet-300 font-black">{currentRoleObj.nombre}</span>
                    </span>
                    <span className="text-slate-500 dark:text-slate-500 font-mono text-[10px]">
                      Base de Datos: 13 Roles • 1.846 Casillas Totales Sincronizadas
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* DETAIL 7: REPORTES */}
          {activeSection === 'REPORTES' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Formatos y reportes oficiales disponibles para emisión:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {[
                  'Boletín Informativo de Calificaciones (Inicial / Primaria / Media)',
                  'Sábana Oficial de Calificaciones por Lapso',
                  'Constancia de Estudio Oficial MPPE',
                  'Constancia de Buena Conducta',
                  'Constancia de Inscripción y Matrícula',
                  'Padrón Electoral Estudiantil CBA',
                  'Nómina de Matrícula Inicial por Grado y Sección',
                  'Acta de Consejo de Docentes y Curso',
                  'Registro Procesal de Indicadores',
                  'Reporte de Asistencia Diaria y Mensual',
                  'Control de Pases de Retraso e Inasistencias',
                  'Planilla de Solicitud de Título de Bachiller',
                  'Resumen Estadístico de Rendimiento Estudiantil',
                  'Certificado de Promoción de Grado'
                ].map((rep, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center gap-2 text-xs text-slate-700 font-semibold">
                    <FileBarChart2 className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>{rep}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL 8: ASIGNAR REPORTES */}
          {activeSection === 'ASIGNAR_REPORTES' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Asignación de acceso a reportes según rol institucional:</p>
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-2 border-b">
                  <span>Módulo / Rol</span>
                  <div className="flex gap-4 text-[10px] text-slate-500">
                    <span>Admin</span>
                    <span>Director</span>
                    <span>Coord</span>
                    <span>Secretaría</span>
                    <span>Docente</span>
                  </div>
                </div>
                {[
                  'Boletines Informativos',
                  'Sábana de Calificaciones',
                  'Constancias de Estudio / Conducta',
                  'Padrón y Matrícula Estudiantil',
                  'Actas de Consejo de Sección',
                  'Pases de Retraso e Inasistencia'
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50">
                    <span className="font-medium text-slate-800">{item}</span>
                    <div className="flex gap-6 pr-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL 9: LITERALES */}
          {activeSection === 'LITERALES' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Escalas evaluativas y literales oficiales por subsistema en SICE-CBA:</p>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-pink-200 bg-pink-50/40">
                  <h4 className="text-xs font-black text-pink-900 mb-1">1. EDUCACIÓN INICIAL (Escala Literal Cualitativa)</h4>
                  <p className="text-[11px] text-pink-700 mb-2">Escala exclusiva de observación por indicadores sin notas numéricas:</p>
                  <div className="flex flex-wrap gap-2 text-xs font-bold">
                    <span className="px-2.5 py-1 rounded bg-white border border-pink-200 text-pink-800">A - Excelente desempeño y autonomía</span>
                    <span className="px-2.5 py-1 rounded bg-white border border-pink-200 text-pink-800">B - Buen desempeño</span>
                    <span className="px-2.5 py-1 rounded bg-white border border-pink-200 text-pink-800">C - Aceptable</span>
                    <span className="px-2.5 py-1 rounded bg-white border border-pink-200 text-pink-800">D - En desarrollo</span>
                    <span className="px-2.5 py-1 rounded bg-white border border-pink-200 text-pink-800">E - Requiere afianzamiento</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/40">
                  <h4 className="text-xs font-black text-sky-900 mb-1">2. EDUCACIÓN PRIMARIA (Escala Cualitativa / Formativa)</h4>
                  <p className="text-[11px] text-sky-700 mb-2">Seguimiento de competencias pedagógicas:</p>
                  <div className="flex flex-wrap gap-2 text-xs font-bold">
                    <span className="px-2.5 py-1 rounded bg-white border border-sky-200 text-sky-800">L - Logrado</span>
                    <span className="px-2.5 py-1 rounded bg-white border border-sky-200 text-sky-800">EP / P - En Proceso</span>
                    <span className="px-2.5 py-1 rounded bg-white border border-sky-200 text-sky-800">I - Iniciado</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40">
                  <h4 className="text-xs font-black text-indigo-900 mb-1">3. EDUCACIÓN MEDIA GENERAL (Escala Vigesimal 01 - 20)</h4>
                  <p className="text-[11px] text-indigo-700 mb-2">Evaluación cuantitativa oficial venezolana:</p>
                  <div className="flex flex-wrap gap-2 text-xs font-bold">
                    <span className="px-2.5 py-1 rounded bg-white border border-indigo-200 text-emerald-800">10 a 20 pts: Aprobatorio</span>
                    <span className="px-2.5 py-1 rounded bg-white border border-indigo-200 text-rose-800">01 a 09 pts: No Aprobatorio</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DETAIL 10: TIPOS DE HORARIOS (CONEXIÓN DIRECTA CON SUPABASE) */}
          {activeSection === 'TIPOS_HORARIOS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Modalidades y turnos escolares administrados:</p>
                  <p className="text-[11px] text-slate-500">Sincronizado con tabla <code className="font-mono text-violet-600 dark:text-violet-400">schedule_types</code></p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {scheduleTypes.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">{item.nombre}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.activo ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.descripcion}</p>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-slate-400">
                      <span>Jornada: {item.horaInicio} - {item.horaFin}</span>
                      <span>{item.totalBloques} bloques ({item.duracionBloqueMinutos}m)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL 11: TÍTULOS ACADÉMICOS (CONEXIÓN DIRECTA CON SUPABASE) */}
          {activeSection === 'TITULOS_ACADEMICOS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Catálogo de títulos académicos para docentes y personal:</p>
                  <p className="text-[11px] text-slate-500">Sincronizado con tabla <code className="font-mono text-violet-600 dark:text-violet-400">system_catalogs</code></p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                  {systemCatalogs.titulosAcademicos.length} Títulos
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nuevo título académico..."
                  value={newTitulo}
                  onChange={(e) => setNewTitulo(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  type="button"
                  onClick={handleAddTitulo}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 max-h-[380px] overflow-y-auto custom-comfortable-scrollbar">
                {systemCatalogs.titulosAcademicos.map((titulo, idx) => (
                  <div key={idx} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-violet-500 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{titulo}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTitulo(titulo)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition"
                      title="Eliminar del catálogo oficial en BD"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL 12: PARENTESCOS (CONEXIÓN DIRECTA CON SUPABASE) */}
          {activeSection === 'PARENTESCOS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Relación de parentesco entre representante y alumno:</p>
                  <p className="text-[11px] text-slate-500">Sincronizado con tabla <code className="font-mono text-violet-600 dark:text-violet-400">system_catalogs</code></p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                  {systemCatalogs.parentescos.length} Registros
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nuevo parentesco (ej: TÍO / TÍA)..."
                  value={newParentesco}
                  onChange={(e) => setNewParentesco(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  type="button"
                  onClick={handleAddParentesco}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[380px] overflow-y-auto custom-comfortable-scrollbar">
                {systemCatalogs.parentescos.map((par, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{par}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveParentesco(par)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition"
                      title="Eliminar del catálogo oficial en BD"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL 13: PROFESIONES (CONEXIÓN DIRECTA CON SUPABASE) */}
          {activeSection === 'PROFESIONES' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Catálogo de profesiones y oficios para fichas de representantes:</p>
                  <p className="text-[11px] text-slate-500">Sincronizado con tabla <code className="font-mono text-violet-600 dark:text-violet-400">system_catalogs</code></p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                  {systemCatalogs.profesiones.length} Profesiones
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nueva profesión u oficio..."
                  value={newProfesion}
                  onChange={(e) => setNewProfesion(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  type="button"
                  onClick={handleAddProfesion}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[380px] overflow-y-auto custom-comfortable-scrollbar">
                {systemCatalogs.profesiones.map((prof, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{prof}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProfesion(prof)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition"
                      title="Eliminar del catálogo oficial en BD"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL 14: VACUNAS (CONEXIÓN DIRECTA CON SUPABASE) */}
          {activeSection === 'VACUNAS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Esquema nacional de vacunación para expedientes médicos de alumnos:</p>
                  <p className="text-[11px] text-slate-500">Sincronizado con tabla <code className="font-mono text-violet-600 dark:text-violet-400">system_catalogs</code></p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                  {systemCatalogs.vacunas.length} Vacunas
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nueva vacuna o dosis..."
                  value={newVacuna}
                  onChange={(e) => setNewVacuna(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  type="button"
                  onClick={handleAddVacuna}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              <div className="space-y-2 max-h-[380px] overflow-y-auto custom-comfortable-scrollbar">
                {systemCatalogs.vacunas.map((vac, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Syringe className="w-4 h-4 text-violet-500 shrink-0" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{vac}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVacuna(vac)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition"
                      title="Eliminar del catálogo oficial en BD"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL 15: SERVICIOS MÉDICOS (CONEXIÓN DIRECTA CON SUPABASE) */}
          {activeSection === 'SERVICIOS_MEDICOS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Centros asistenciales y seguros médicos vinculados:</p>
                  <p className="text-[11px] text-slate-500">Sincronizado con tabla <code className="font-mono text-violet-600 dark:text-violet-400">system_catalogs</code></p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                  {systemCatalogs.serviciosMedicos.length} Servicios
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nuevo servicio o seguro médico..."
                  value={newServicio}
                  onChange={(e) => setNewServicio(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  type="button"
                  onClick={handleAddServicio}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              <div className="space-y-2 max-h-[380px] overflow-y-auto custom-comfortable-scrollbar">
                {systemCatalogs.serviciosMedicos.map((serv, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{serv}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveServicio(serv)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition"
                      title="Eliminar del catálogo oficial en BD"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL 16: DATOS DE LA ESCUELA (CONEXIÓN DIRECTA CON SUPABASE) */}
          {activeSection === 'DATOS_ESCUELA' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Información legal e institucional utilizada en boletines, actas y constancias oficiales:
                  </p>
                  <p className="text-[11px] text-slate-500">Sincronizado con tabla <code className="font-mono text-violet-600 dark:text-violet-400">institutional_school_data</code></p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Oficial del Plantel</label>
                  <input
                    type="text"
                    value={editSchoolData.nombre}
                    onChange={(e) => setEditSchoolData({ ...editSchoolData, nombre: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Código DEA MPPE</label>
                  <input
                    type="text"
                    value={editSchoolData.dea}
                    onChange={(e) => setEditSchoolData({ ...editSchoolData, dea: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">R.I.F. Institucional</label>
                  <input
                    type="text"
                    value={editSchoolData.rif}
                    onChange={(e) => setEditSchoolData({ ...editSchoolData, rif: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Circuito Escolar</label>
                  <input
                    type="text"
                    value={editSchoolData.circuito}
                    onChange={(e) => setEditSchoolData({ ...editSchoolData, circuito: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Dirección de Sede</label>
                  <input
                    type="text"
                    value={editSchoolData.direccion}
                    onChange={(e) => setEditSchoolData({ ...editSchoolData, direccion: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Teléfonos de Contacto</label>
                  <input
                    type="text"
                    value={editSchoolData.telefono}
                    onChange={(e) => setEditSchoolData({ ...editSchoolData, telefono: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Correo Institucional</label>
                  <input
                    type="email"
                    value={editSchoolData.correo}
                    onChange={(e) => setEditSchoolData({ ...editSchoolData, correo: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Director(a) General</label>
                  <input
                    type="text"
                    value={editSchoolData.director}
                    onChange={(e) => setEditSchoolData({ ...editSchoolData, director: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Subdirector(a) / Coordinador(a)</label>
                  <input
                    type="text"
                    value={editSchoolData.subdirector}
                    onChange={(e) => setEditSchoolData({ ...editSchoolData, subdirector: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSchoolData}
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition"
                >
                  <Save className="w-4 h-4" /> Guardar en Base de Datos
                </button>
              </div>
            </div>
          )}

          {/* DETAIL 17: EXPORTAR CALIFICACIONES */}
          {activeSection === 'EXPORTAR_CALIFICACIONES' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Herramienta oficial de exportación de sábanas y matrices de notas para control interno y formatos MPPE:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-pink-600 font-bold text-xs">
                    <FileSpreadsheet className="w-4 h-4" /> Inicial
                  </div>
                  <p className="text-[11px] text-slate-500">Matriz de apreciación formativa y descriptiva.</p>
                  <button
                    onClick={triggerToast}
                    className="w-full py-1.5 px-3 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center gap-1 border border-pink-200"
                  >
                    <Download className="w-3.5 h-3.5" /> Exportar CSV
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-sky-600 font-bold text-xs">
                    <FileSpreadsheet className="w-4 h-4" /> Primaria
                  </div>
                  <p className="text-[11px] text-slate-500">Sábana de literales formativos (Logrado, En Proceso, Iniciado).</p>
                  <button
                    onClick={triggerToast}
                    className="w-full py-1.5 px-3 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center gap-1 border border-sky-200"
                  >
                    <Download className="w-3.5 h-3.5" /> Exportar CSV
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                    <FileSpreadsheet className="w-4 h-4" /> Media General
                  </div>
                  <p className="text-[11px] text-slate-500">Matriz numérica vigesimal (01-20) y ponderaciones oficiales.</p>
                  <button
                    onClick={triggerToast}
                    className="w-full py-1.5 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1 border border-indigo-200"
                  >
                    <Download className="w-3.5 h-3.5" /> Exportar CSV
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
