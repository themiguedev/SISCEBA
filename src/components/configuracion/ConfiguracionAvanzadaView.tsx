import React, { useState } from 'react';
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
  Square,
  Filter,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
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

const MENU_ITEMS: SectionMenuItem[] = [
  { id: 'MODULOS', label: 'MÓDULOS', icon: FolderKanban, count: 9 },
  { id: 'CATEGORIAS_MENU', label: 'CATEGORÍAS DEL MENÚ', icon: MenuSquare, count: 3 },
  { id: 'EXCEPCIONES', label: 'EXCEPCIONES', icon: AlertOctagon, count: 0 },
  { id: 'AUDITORIA', label: 'AUDITORÍA', icon: FileSearch, count: 'Live' },
  { id: 'ROLES_USUARIO', label: 'ROLES DE USUARIO', icon: Users2, count: 8 },
  { id: 'PRIVILEGIOS', label: 'PRIVILEGIOS', icon: ShieldAlert, count: '142 x 13 Roles', badge: 'Matriz CEO' },
  { id: 'REPORTES', label: 'REPORTES', icon: FileBarChart2, count: 14 },
  { id: 'ASIGNAR_REPORTES', label: 'ASIGNAR REPORTES', icon: Share2, count: 12 },
  { id: 'LITERALES', label: 'LITERALES', icon: GraduationCap, count: '3 Escalas' },
  { id: 'TIPOS_HORARIOS', label: 'TIPOS DE HORARIOS', icon: Clock, count: 2 },
  { id: 'TITULOS_ACADEMICOS', label: 'TÍTULOS ACADÉMICOS', icon: Award, count: 6 },
  { id: 'PARENTESCOS', label: 'PARENTESCOS', icon: Users, count: 8 },
  { id: 'PROFESIONES', label: 'PROFESIONES', icon: Briefcase, count: 15 },
  { id: 'VACUNAS', label: 'VACUNAS', icon: Syringe, count: 7 },
  { id: 'SERVICIOS_MEDICOS', label: 'SERVICIOS MÉDICOS', icon: Stethoscope, count: 5 },
  { id: 'DATOS_ESCUELA', label: 'DATOS DE LA ESCUELA', icon: School, badge: 'CBA' },
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
  const [isResettingPrivs, setIsResettingPrivs] = useState(false);

  // Initial catalogs state (persisted locally / editable)
  const [parentescos, setParentescos] = useState<string[]>([
    'MADRE',
    'PADRE',
    'TUTOR LEGAL',
    'ABUELO / ABUELA',
    'TÍO / TÍA',
    'HERMANO / HERMANA MAYOR',
    'PADRASTRO / MADRASTRA',
    'OTRO FAMILIAR'
  ]);
  const [newParentesco, setNewParentesco] = useState('');

  const [profesiones, setProfesiones] = useState<string[]>([
    'DOCENTE / PROFESOR(A)',
    'INGENIERO(A)',
    'MÉDICO(A) / CIRUJANO(A)',
    'ENFERMERO(A)',
    'LICENCIADO(A) EN ADMINISTRACIÓN',
    'CONTADOR(A) PÚBLICO(A)',
    'ABOGADO(A)',
    'COMERCIANTE / EMPRESARIO(A)',
    'TÉCNICO(A) EN COMPUTACIÓN / SISTEMAS',
    'ELECTRICISTA',
    'MECÁNICO(A)',
    'CHEF / GASTRONOMÍA',
    'MILITAR / POLICÍA',
    'OFICIOS DEL HOGAR',
    'OTRA PROFESIÓN U OFICIO'
  ]);
  const [newProfesion, setNewProfesion] = useState('');

  const [vacunas, setVacunas] = useState<string[]>([
    'BCG (Tuberculosis)',
    'Hepatitis B Pediátrica',
    'Polio (IPV / OPV)',
    'Pentavalente (DTP + Hib + Hep B)',
    'Antirrotavirus',
    'Trivalente Viral (SRP: Sarampión, Rubéola, Parotiditis)',
    'Fiebre Amarilla'
  ]);
  const [newVacuna, setNewVacuna] = useState('');

  const [serviciosMedicos, setServiciosMedicos] = useState<string[]>([
    'SEGURO ESCOLAR INSTITUCIONAL',
    'IVSS (Instituto Venezolano de los Seguros Sociales)',
    'IPASME (Personal Docente y Administrativo)',
    'CENTRO DE SALUD / CDI LOCAL',
    'SEGURO PRIVADO FAMILIAR'
  ]);
  const [newServicio, setNewServicio] = useState('');

  const [titulosAcademicos, setTitulosAcademicos] = useState<string[]>([
    'Bachiller en Ciencias',
    'Licenciado(a) en Educación',
    'Profesor(a) de Educación Media',
    'Técnico Superior Universitario (TSU)',
    'Magíster Scientiarum / Postgrado',
    'Doctor(a) en Educación / Ciencias'
  ]);
  const [newTitulo, setNewTitulo] = useState('');

  // School institutional metadata form
  const [schoolData, setSchoolData] = useState({
    nombre: 'U.E. Colegio Belén San Juan (SISCEBA)',
    dea: 'OD-05241503',
    rif: 'J-31456789-0',
    circuito: 'Circuito Escolar 05 - Parroquia El Carmen',
    distrito: 'Distrito Escolar Nº 02',
    direccion: 'Av. Las Delicias, Sector Sabana Grande, Barinas, Edo. Barinas',
    telefono: '+58 (0273) 552-1489 / +58 (0414) 555-0199',
    correo: 'administracion@colegiobelensanjuan.edu.ve',
    director: 'Prof. Carlos R. Méndez P.',
    subdirector: 'Lic. Mayuli G. Silva M.'
  });

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

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
            {MENU_ITEMS.filter((item) =>
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
                {MENU_ITEMS.find((i) => i.id === activeSection)?.label}
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

          {/* DETAIL 4: AUDITORÍA */}
          {activeSection === 'AUDITORIA' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">Registro de eventos clave y accesos de seguridad:</p>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  ● Sistema Monitoreado
                </span>
              </div>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {[
                  { evento: 'Inicio de Sesión Exitoso', usuario: 'admin', rol: 'ADMINISTRADOR', fecha: 'Hoy, Hace un momento', ip: '192.168.1.102' },
                  { evento: 'Sincronización Cloud Supabase', usuario: 'sistema', rol: 'SISTEMA', fecha: 'Hoy, 10:45 AM', ip: 'Localhost' },
                  { evento: 'Actualización Perfil Docente', usuario: 'contma', rol: 'DOCENTE', fecha: 'Hoy, 09:30 AM', ip: '192.168.1.115' },
                  { evento: 'Apertura de Ventana Evaluativa Lapso 1', usuario: 'admin', rol: 'ADMINISTRADOR', fecha: 'Ayer, 04:15 PM', ip: '192.168.1.102' }
                ].map((log, i) => (
                  <div key={i} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <p className="font-bold text-slate-800">{log.evento}</p>
                      <p className="text-[10px] text-slate-400">Usuario: <span className="font-mono text-slate-600">{log.usuario}</span> ({log.rol})</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500">{log.fecha}</span>
                      <p className="text-[9px] font-mono text-slate-400">IP: {log.ip}</p>
                    </div>
                  </div>
                ))}
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
              const matchesSearch =
                !privSearchTerm ||
                p.opcion.toLowerCase().includes(privSearchTerm.toLowerCase()) ||
                p.descripcion.toLowerCase().includes(privSearchTerm.toLowerCase()) ||
                p.nro.toString() === privSearchTerm.trim();
              return matchesCat && matchesSearch;
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
                <div className="p-4 rounded-xl border border-violet-200 bg-violet-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-violet-700">
                        Descripción Oficial
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-200/80 text-violet-900 font-bold">
                        142 Registros Consecutivos
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        isSupabaseActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {isSavingCloud ? 'Sincronizando con BD...' : (isSupabaseActive ? '● Conectado a BD' : '● Caché Local')}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1">
                      ADM: Gestione los accesos a cada rol de usuario.
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Rol actual:{' '}
                      <span className="font-extrabold text-violet-900">
                        {currentRoleObj.nombre}
                      </span>{' '}
                      • {enabledCount} habilitados / {142 - enabledCount} deshabilitados
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={isResettingPrivs}
                      className="px-2.5 py-2 text-xs rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 font-bold flex items-center gap-1.5 transition shadow-sm shrink-0"
                      title="Restablecer privilegios de los 13 roles a los valores originales"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${isResettingPrivs ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">Restablecer</span>
                    </button>
                    <select
                      value={selectedRolePrivilegios}
                      onChange={(e) => setSelectedRolePrivilegios(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl border border-violet-300 bg-white font-black text-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-500 w-full sm:w-auto shadow-sm"
                    >
                      {systemPrivileges.roles.map((r) => (
                        <option key={r.nombre} value={r.nombre}>
                          Rol: {r.nombre} ({r.privilegios.filter(p => p.habilitar).length}/142 ☑)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filters toolbar */}
                <div className="space-y-2.5 bg-slate-50/80 p-3 rounded-xl border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    {/* Search in Options / Descriptions */}
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar por opción, descripción o número (ej. 1, Mensajeria, ADM)..."
                        value={privSearchTerm}
                        onChange={(e) => setPrivSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-slate-800 shadow-2xs font-medium"
                      />
                      {privSearchTerm && (
                        <button
                          type="button"
                          onClick={() => setPrivSearchTerm('')}
                          className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1.5">
                      <span className="font-bold text-slate-700">Coincidencias:</span>
                      <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-mono font-bold text-violet-700">
                        {filteredPrivs.length} de 142
                      </span>
                    </div>
                  </div>

                  {/* Category Filter Pills (Wrap multilinea limpio para ver todas las categorías sin cortes) */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-200/60">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mr-1 shrink-0">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      <span>Categorías:</span>
                    </div>
                    {categories.map((cat) => {
                      const isSelected = privCategoryFilter === cat;
                      const countInCat = cat === 'TODAS'
                        ? currentRoleObj.privilegios.length
                        : currentRoleObj.privilegios.filter(p => p.categoria === cat).length;

                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setPrivCategoryFilter(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-violet-700 text-white shadow-xs scale-102 ring-1 ring-violet-700'
                              : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
                          }`}
                        >
                          <span>{cat}</span>
                          <span
                            className={`text-[9px] px-1 py-0.2 rounded-full font-mono font-bold ${
                              isSelected
                                ? 'bg-violet-900/60 text-violet-100'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {countInCat}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* The 142 Privileges Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="max-h-[580px] overflow-y-auto no-scrollbar">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-[11px] font-bold text-slate-600">
                        <tr>
                          <th className="py-2.5 px-3 w-14 text-center">Nro</th>
                          <th className="py-2.5 px-3 w-36">Categoría</th>
                          <th className="py-2.5 px-3 w-48">Opción</th>
                          <th className="py-2.5 px-4">Descripción</th>
                          <th className="py-2.5 px-3 w-24 text-center">Habilitar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredPrivs.map((priv) => {
                          return (
                            <tr
                              key={priv.nro}
                              className={`hover:bg-violet-50/40 transition-colors ${
                                priv.habilitar ? 'bg-white' : 'bg-slate-50/30'
                              }`}
                            >
                              <td className="py-2 px-3 text-center font-mono font-bold text-slate-500 text-[11px]">
                                {priv.nro}
                              </td>
                              <td className="py-2 px-3">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  priv.categoria === 'COMUNIDAD CEO' ? 'bg-pink-100 text-pink-800' :
                                  priv.categoria === 'CONF. AVANZADA' ? 'bg-purple-100 text-purple-800' :
                                  priv.categoria === 'CONFIGURACIÓN' ? 'bg-amber-100 text-amber-800' :
                                  priv.categoria === 'CONSULTAS' ? 'bg-cyan-100 text-cyan-800' :
                                  priv.categoria === 'GESTIÓN' ? 'bg-blue-100 text-blue-800' :
                                  priv.categoria === 'INICIAL' ? 'bg-rose-100 text-rose-800' :
                                  priv.categoria === 'MEDIA GENERAL' ? 'bg-indigo-100 text-indigo-800' :
                                  'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {priv.categoria}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-bold text-slate-900 text-xs">
                                {priv.opcion}
                              </td>
                              <td className="py-2 px-4 text-slate-600 text-xs leading-relaxed">
                                {priv.descripcion ? (
                                  <span>
                                    {priv.descripcion.startsWith('ADM:') ? (
                                      <strong className="text-purple-700 font-black">ADM: </strong>
                                    ) : priv.descripcion.startsWith('DOC:') ? (
                                      <strong className="text-blue-700 font-black">DOC: </strong>
                                    ) : priv.descripcion.startsWith('EST:') ? (
                                      <strong className="text-emerald-700 font-black">EST: </strong>
                                    ) : priv.descripcion.startsWith('REP:') ? (
                                      <strong className="text-amber-700 font-black">REP: </strong>
                                    ) : priv.descripcion.startsWith('UCE:') ? (
                                      <strong className="text-cyan-700 font-black">UCE: </strong>
                                    ) : null}
                                    {priv.descripcion.replace(/^(ADM:|DOC:|EST:|REP:|UCE:)\s*/, '')}
                                  </span>
                                ) : (
                                  <span className="text-slate-300 italic text-[11px]">—</span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggle(priv.nro)}
                                  className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-100 transition"
                                  title={priv.habilitar ? 'Habilitado (Click para alternar y guardar en BD)' : 'Deshabilitado (Click para alternar y guardar en BD)'}
                                >
                                  {priv.habilitar ? (
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-violet-600 text-white shadow-sm font-bold text-xs">
                                      ✓
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-slate-300 bg-white"></span>
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
                    <div className="p-8 text-center text-xs text-slate-400">
                      No se encontraron privilegios que coincidan con la búsqueda o filtro.
                    </div>
                  )}

                  {/* Table footer with stats */}
                  <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                    <span>
                      Mostrando {filteredPrivs.length} de 142 privilegios para el rol:{' '}
                      <span className="text-slate-800">{currentRoleObj.nombre}</span>
                    </span>
                    <span>Total Matriz: 13 Roles • 1.846 Casillas Verificadas</span>
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

          {/* DETAIL 10: TIPOS DE HORARIOS */}
          {activeSection === 'TIPOS_HORARIOS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Modalidades y turnos escolares administrados:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-800">TURNO MAÑANA</h4>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Activo</span>
                  </div>
                  <p className="text-[11px] text-slate-500">7:00 AM - 12:30 PM (Bloques pedagógicos de 45 min)</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-800">TURNO COMPLETO / INTEGRAL</h4>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Activo</span>
                  </div>
                  <p className="text-[11px] text-slate-500">7:00 AM - 2:30 PM (Incluye Comedor Escolar y Talleres)</p>
                </div>
              </div>
            </div>
          )}

          {/* DETAIL 11: TÍTULOS ACADÉMICOS */}
          {activeSection === 'TITULOS_ACADEMICOS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Catálogo de títulos académicos para docentes y personal:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nuevo título académico..."
                  value={newTitulo}
                  onChange={(e) => setNewTitulo(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  onClick={() => {
                    if (newTitulo.trim()) {
                      setTitulosAcademicos([...titulosAcademicos, newTitulo.trim()]);
                      setNewTitulo('');
                      triggerToast();
                    }
                  }}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {titulosAcademicos.map((titulo, idx) => (
                  <div key={idx} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-violet-500" />
                      <span className="font-semibold text-slate-800">{titulo}</span>
                    </div>
                    <button
                      onClick={() => setTitulosAcademicos(titulosAcademicos.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL 12: PARENTESCOS */}
          {activeSection === 'PARENTESCOS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Relación de parentesco entre representante y alumno:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nuevo parentesco (ej: TÍO / TÍA)..."
                  value={newParentesco}
                  onChange={(e) => setNewParentesco(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  onClick={() => {
                    if (newParentesco.trim()) {
                      setParentescos([...parentescos, newParentesco.trim().toUpperCase()]);
                      setNewParentesco('');
                      triggerToast();
                    }
                  }}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {parentescos.map((par, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{par}</span>
                    <button
                      onClick={() => setParentescos(parentescos.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL 13: PROFESIONES */}
          {activeSection === 'PROFESIONES' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Catálogo de profesiones y oficios para fichas de representantes:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nueva profesión u oficio..."
                  value={newProfesion}
                  onChange={(e) => setNewProfesion(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  onClick={() => {
                    if (newProfesion.trim()) {
                      setProfesiones([...profesiones, newProfesion.trim().toUpperCase()]);
                      setNewProfesion('');
                      triggerToast();
                    }
                  }}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[380px] overflow-y-auto no-scrollbar">
                {profesiones.map((prof, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{prof}</span>
                    <button
                      onClick={() => setProfesiones(profesiones.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL 14: VACUNAS */}
          {activeSection === 'VACUNAS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Esquema nacional de vacunación para expedientes médicos de alumnos:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nueva vacuna o dosis..."
                  value={newVacuna}
                  onChange={(e) => setNewVacuna(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  onClick={() => {
                    if (newVacuna.trim()) {
                      setVacunas([...vacunas, newVacuna.trim()]);
                      setNewVacuna('');
                      triggerToast();
                    }
                  }}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              <div className="space-y-2">
                {vacunas.map((vac, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Syringe className="w-4 h-4 text-violet-500" />
                      <span className="font-bold text-slate-800">{vac}</span>
                    </div>
                    <button
                      onClick={() => setVacunas(vacunas.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL 15: SERVICIOS MÉDICOS */}
          {activeSection === 'SERVICIOS_MEDICOS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Centros asistenciales y seguros médicos vinculados:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nuevo servicio o seguro médico..."
                  value={newServicio}
                  onChange={(e) => setNewServicio(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  onClick={() => {
                    if (newServicio.trim()) {
                      setServiciosMedicos([...serviciosMedicos, newServicio.trim()]);
                      setNewServicio('');
                      triggerToast();
                    }
                  }}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              <div className="space-y-2">
                {serviciosMedicos.map((serv, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-800">{serv}</span>
                    </div>
                    <button
                      onClick={() => setServiciosMedicos(serviciosMedicos.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL 16: DATOS DE LA ESCUELA */}
          {activeSection === 'DATOS_ESCUELA' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Información legal e institucional utilizada en boletines, actas y constancias oficiales:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre Oficial del Plantel</label>
                  <input
                    type="text"
                    value={schoolData.nombre}
                    onChange={(e) => setSchoolData({ ...schoolData, nombre: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Código DEA MPPE</label>
                  <input
                    type="text"
                    value={schoolData.dea}
                    onChange={(e) => setSchoolData({ ...schoolData, dea: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">R.I.F. Institucional</label>
                  <input
                    type="text"
                    value={schoolData.rif}
                    onChange={(e) => setSchoolData({ ...schoolData, rif: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Circuito Escolar</label>
                  <input
                    type="text"
                    value={schoolData.circuito}
                    onChange={(e) => setSchoolData({ ...schoolData, circuito: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Dirección de Sede</label>
                  <input
                    type="text"
                    value={schoolData.direccion}
                    onChange={(e) => setSchoolData({ ...schoolData, direccion: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Teléfonos de Contacto</label>
                  <input
                    type="text"
                    value={schoolData.telefono}
                    onChange={(e) => setSchoolData({ ...schoolData, telefono: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Correo Institucional</label>
                  <input
                    type="email"
                    value={schoolData.correo}
                    onChange={(e) => setSchoolData({ ...schoolData, correo: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Director(a) General</label>
                  <input
                    type="text"
                    value={schoolData.director}
                    onChange={(e) => setSchoolData({ ...schoolData, director: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Subdirector(a) / Coordinador(a)</label>
                  <input
                    type="text"
                    value={schoolData.subdirector}
                    onChange={(e) => setSchoolData({ ...schoolData, subdirector: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={triggerToast}
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition"
                >
                  <Save className="w-4 h-4" /> Guardar Datos Institucionales
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
