import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  BookOpen,
  Users,
  Compass,
  FileSpreadsheet,
  Clock,
  UserCheck,
  Award,
  ShieldCheck,
  FileText,
  Search,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Lock,
  Building,
  GraduationCap,
  Sparkles,
  MapPin,
  ClipboardList,
  Target,
  UserCog,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type ConfigAcademicaSection =
  | 'ANOS_ESCOLARES'
  | 'LAPSOS'
  | 'GRADOS'
  | 'SECCIONES'
  | 'MATERIAS'
  | 'ENFOQUES'
  | 'RESPONSABLES_CRP'
  | 'GRADOS_TRANSFERENCIAS'
  | 'ASIGNACION_MATERIAS'
  | 'ASIGNACION_MATERIAS_P'
  | 'CARGA_HORARIA'
  | 'COORDINADORES_DOCENTES'
  | 'DOCENTES_GUIAS'
  | 'DIRECTORES'
  | 'SUPERVISORES'
  | 'TIPOS_ESTRATEGIAS'
  | 'FALTAS'
  | 'AULAS_CLASES'
  | 'ESCUELAS_EXTERNAS'
  | 'LOCALIDADES'
  | 'EVALUACIONES'
  | 'DOCUMENTOS'
  | 'CALIBRAR_TITULOS';

interface SectionItem {
  id: ConfigAcademicaSection;
  label: string;
  icon: React.ElementType;
  badge?: string;
  count?: number | string;
}

const ACADEMIC_CONFIG_ITEMS: SectionItem[] = [
  { id: 'ANOS_ESCOLARES', label: 'AÑOS ESCOLARES', icon: Calendar, badge: '2024-2025' },
  { id: 'LAPSOS', label: 'LAPSOS', icon: Clock, count: 3 },
  { id: 'GRADOS', label: 'GRADOS', icon: Layers, count: 14 },
  { id: 'SECCIONES', label: 'SECCIONES', icon: Users, count: 28 },
  { id: 'MATERIAS', label: 'MATERIAS', icon: BookOpen, count: 32 },
  { id: 'ENFOQUES', label: 'ENFOQUES', icon: Target, count: 4 },
  { id: 'RESPONSABLES_CRP', label: 'RESPONSABLES GRUPOS CRP', icon: UserCog, count: 6 },
  { id: 'GRADOS_TRANSFERENCIAS', label: 'GRADOS TRANSFERENCIAS', icon: Compass, count: 5 },
  { id: 'ASIGNACION_MATERIAS', label: 'ASIGNACIÓN DE MATERIAS', icon: ClipboardList, badge: 'Media' },
  { id: 'ASIGNACION_MATERIAS_P', label: 'ASIGNACIÓN DE MATERIAS P.', icon: ClipboardList, badge: 'Primaria' },
  { id: 'CARGA_HORARIA', label: 'CARGA HORARIA', icon: FileSpreadsheet, badge: 'Horas' },
  { id: 'COORDINADORES_DOCENTES', label: 'COORDINADORES DOCENTES', icon: ShieldCheck, count: 3 },
  { id: 'DOCENTES_GUIAS', label: 'DOCENTES GUÍAS', icon: UserCheck, count: 18 },
  { id: 'DIRECTORES', label: 'DIRECTORES', icon: Award, count: 2 },
  { id: 'SUPERVISORES', label: 'SUPERVISORES', icon: ShieldCheck, count: 2 },
  { id: 'TIPOS_ESTRATEGIAS', label: 'TIPOS DE ESTRATEGIAS', icon: Sparkles, count: 12 },
  { id: 'FALTAS', label: 'FALTAS', icon: AlertIcon, count: 8 },
  { id: 'AULAS_CLASES', label: 'AULAS DE CLASES', icon: Building, count: 24 },
  { id: 'ESCUELAS_EXTERNAS', label: 'ESCUELAS EXTERNAS', icon: GraduationCap, count: 10 },
  { id: 'LOCALIDADES', label: 'LOCALIDADES', icon: MapPin, count: 7 },
  { id: 'EVALUACIONES', label: 'EVALUACIONES', icon: FileText, badge: 'Escalas' },
  { id: 'DOCUMENTOS', label: 'DOCUMENTOS', icon: FileText, count: 9 },
  { id: 'CALIBRAR_TITULOS', label: 'CALIBRAR TÍTULOS', icon: Award, badge: 'Firma MPPE' }
];

function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export const ConfiguracionGeneralCEOView: React.FC = () => {
  const { currentRole, schoolYearConfig, users } = useApp();
  const [activeSection, setActiveSection] = useState<ConfigAcademicaSection>('ANOS_ESCOLARES');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // State catalogs for dynamic items
  const [enfoques, setEnfoques] = useState<string[]>([
    'Enfoque Sociocrítico & Constructivista',
    'Pedagogía del Amor, el Ejemplo y la Curiosidad',
    'Aprendizaje Basado en Proyectos (ABP)',
    'Educación Ambiental y Productiva'
  ]);
  const [newEnfoque, setNewEnfoque] = useState('');

  const [gruposCRP, setGruposCRP] = useState<{ nombre: string; responsable: string; nivel: string }[]>([
    { nombre: 'Música y Coral Institucional', responsable: 'Prof. Pedro Ramírez', nivel: 'Media General' },
    { nombre: 'Robótica y Computación', responsable: 'Ing. Carlos Mendoza', nivel: 'Media General' },
    { nombre: 'Teatro y Artes Escénicas', responsable: 'Lic. Mariana Gómez', nivel: 'Primaria / Media' },
    { nombre: 'Huerto Escolar Sustentable', responsable: 'Prof. Luis Hernández', nivel: 'Primaria' },
    { nombre: 'Ajedrez Formativo y Lógica', responsable: 'Lic. Alberto Silva', nivel: 'Media General' },
    { nombre: 'Danza Tradicional Venezolana', responsable: 'Prof. Elena Morales', nivel: 'Inicial / Primaria' }
  ]);
  const [newCRPName, setNewCRPName] = useState('');
  const [newCRPTeacher, setNewCRPTeacher] = useState('');

  const [aulas, setAulas] = useState<{ codigo: string; nombre: string; capacidad: number; ubicacion: string }[]>([
    { codigo: 'A-101', nombre: 'Aula 1er Año A', capacidad: 32, ubicacion: 'Edificio Central - PB' },
    { codigo: 'A-102', nombre: 'Aula 1er Año B', capacidad: 32, ubicacion: 'Edificio Central - PB' },
    { codigo: 'A-201', nombre: 'Aula 2do Año A', capacidad: 30, ubicacion: 'Edificio Central - Piso 1' },
    { codigo: 'A-202', nombre: 'Aula 2do Año B', capacidad: 30, ubicacion: 'Edificio Central - Piso 1' },
    { codigo: 'LAB-01', nombre: 'Laboratorio de Ciencias (Química/Biología)', capacidad: 28, ubicacion: 'Módulo Ciencias' },
    { codigo: 'LAB-INF', nombre: 'Laboratorio de Computación e Internet', capacidad: 35, ubicacion: 'Edificio Tecnológico' },
    { codigo: 'AUD-01', nombre: 'Auditorio Belén San Juan', capacidad: 150, ubicacion: 'Planta Principal' }
  ]);
  const [newAulaCod, setNewAulaCod] = useState('');
  const [newAulaNom, setNewAulaNom] = useState('');
  const [newAulaCap, setNewAulaCap] = useState(30);

  const [tiposEstrategias, setTiposEstrategias] = useState<string[]>([
    'Taller Práctico Grupal',
    'Exposición Oral Didáctica',
    'Prueba Escrita de Desarrollo',
    'Mapa Mental / Conceptual',
    'Informe de Laboratorio',
    'Proyecto Pedagógico de Aula (PPA)',
    'Estudio de Casos y Debate',
    'Dramatización y Simulación',
    'Cuadro Comparativo / Matriz de Análisis',
    'Ensayo Crítico Reflexivo',
    'Portafolio de Evidencias Digital',
    'Defensa de Trabajo de Investigación'
  ]);
  const [newEstrategia, setNewEstrategia] = useState('');

  const [faltasCatalogo, setFaltasCatalogo] = useState<{ tipo: 'LEVE' | 'GRAVE' | 'GRAVISIMA'; descripcion: string; sancion: string }[]>([
    { tipo: 'LEVE', descripcion: 'Llegada tarde reiterada a la hora de entrada', sancion: 'Pase de retraso y amonestación verbal' },
    { tipo: 'LEVE', descripcion: 'Uso indebido de dispositivos electrónicos en clase', sancion: 'Llamado de atención y retención preventiva temporal' },
    { tipo: 'GRAVE', descripcion: 'Inasistencia injustificada reiterada o evasión de clase', sancion: 'Citación obligatoria al representante y acta' },
    { tipo: 'GRAVE', descripcion: 'Falta de respeto a compañeros o personal escolar', sancion: 'Acta de compromiso y remisión a orientación' },
    { tipo: 'GRAVISIMA', descripcion: 'Deterioro intencional de mobiliario e infraestructura', sancion: 'Reparación del daño y suspensión temporal' },
    { tipo: 'GRAVISIMA', descripcion: 'Conductas de acoso escolar, violencia física o intimidación', sancion: 'Medida disciplinaria máxima según LOPNNA y UCE' }
  ]);

  const [escuelasExternas, setEscuelasExternas] = useState<{ nombre: string; dea: string; localidad: string }[]>([
    { nombre: 'L.B. Alberto Arvelo Torrealba', dea: 'OD-01234567', localidad: 'Barinas Centro' },
    { nombre: 'U.E. Colegio San Vicente de Paúl', dea: 'OD-07654321', localidad: 'Alto Barinas' },
    { nombre: 'E.B. Ciudad de Nutrias', dea: 'OD-09876543', localidad: 'Sector El Carmen' },
    { nombre: 'L.N. Daniel Florencio O\'Leary', dea: 'OD-03456789', localidad: 'Barinas Centro' }
  ]);
  const [newEscExtNom, setNewEscExtNom] = useState('');
  const [newEscExtDea, setNewEscExtDea] = useState('');
  const [newEscExtLoc, setNewEscExtLoc] = useState('');

  const [localidades, setLocalidades] = useState<string[]>([
    'Parroquia El Carmen - Barinas',
    'Parroquia Rómulo Betancourt - Barinas',
    'Parroquia Corazón de Jesús - Barinas',
    'Parroquia Alto Barinas - Barinas',
    'Parroquia Barinas - Casco Histórico',
    'Municipio Obispos',
    'Municipio Barinas'
  ]);
  const [newLoc, setNewLoc] = useState('');

  // Calibration state for MPPE Titles
  const [calibracionTitulos, setCalibracionTitulos] = useState({
    margenSuperior: 45,
    margenIzquierdo: 30,
    espaciadoLineas: 1.5,
    fuenteImpresion: 'Times New Roman 12pt',
    tamanoHoja: 'Oficio (216 x 330 mm)',
    posicionSelloFirma: 'Inferior Derecha (70mm del borde inferior)',
    plantelEpigrafe: 'REPÚBLICA BOLIVARIANA DE VENEZUELA - MPPE'
  });

  if (currentRole !== 'ADMINISTRADOR') {
    return (
      <div className="bg-white rounded-2xl p-8 border border-rose-200 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-rose-950">Acceso Restringido - Configuración CEO</h3>
        <p className="text-xs text-rose-700 max-w-md mx-auto">
          Esta vista administrativa del sistema CEO está reservada exclusivamente para el Administrador de Sistemas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-amber-600 text-white shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-xs font-bold">{toastMsg}</p>
        </div>
      )}

      {/* Main Container: Master Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Menu Column */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-cba-card overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-amber-700 to-amber-900 text-white border-b border-amber-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center text-white border border-amber-400/40">
                <Sliders className="w-4 h-4 text-amber-200" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-wider uppercase text-white">Configuración del Plantel</h3>
                <p className="text-[10px] text-amber-200 font-semibold">Estructura Académica (CEO)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-100 text-[10px] font-black tracking-wide border border-amber-400/30">
              23 OPCIONES
            </span>
          </div>

          {/* Quick Filter */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/70">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar opción académica..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
              />
            </div>
          </div>

          {/* Menu Items List */}
          <div className="divide-y divide-slate-100 max-h-[720px] overflow-y-auto no-scrollbar">
            {ACADEMIC_CONFIG_ITEMS.filter((item) =>
              item.label.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-xs transition-colors group ${
                    isActive
                      ? 'bg-amber-600 text-white font-black shadow-inner'
                      : 'hover:bg-amber-50/60 text-slate-700 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-transform ${
                        isActive ? 'bg-white scale-125' : 'bg-amber-400 group-hover:bg-amber-600'
                      }`}
                    />
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-amber-600 group-hover:text-amber-700'
                      }`}
                    />
                    <span className="tracking-wide text-[11px]">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                          isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
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

        {/* Right Detail Column */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-cba-card p-6 min-h-[640px]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Configuración Académica CBA
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                {ACADEMIC_CONFIG_ITEMS.find((i) => i.id === activeSection)?.label}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              Admin Exclusive
            </span>
          </div>

          {/* SECTION 1: AÑOS ESCOLARES */}
          {activeSection === 'ANOS_ESCOLARES' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Histórico y ciclo escolar activo en SICE-CBA:</p>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                      Año Escolar Activo
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800 mt-1">
                      {schoolYearConfig.year}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Fecha de inicio: 16 de Septiembre 2024 • Culminación: 25 de Julio 2025
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                    Vigente
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-700">Año Escolar 2023 - 2024</h4>
                    <p className="text-[11px] text-slate-400">Cerrado administrativamente • 100% Calificaciones Consolidadas</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-semibold text-[10px]">
                    Archivado
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: LAPSOS */}
          {activeSection === 'LAPSOS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Control de apertura de lapsos pedagógicos:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: '1', nombre: '1er Lapso (Sep - Dic)', estado: 'Abierto para Carga', desc: 'Calificaciones y planes procesales' },
                  { id: '2', nombre: '2do Lapso (Ene - Abr)', estado: 'Próxima Apertura', desc: 'Planificaciones en diseño' },
                  { id: '3', nombre: '3er Lapso (May - Jul)', estado: 'Cerrado', desc: 'Cierre de ciclo' }
                ].map((l) => (
                  <div key={l.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      Lapso {l.id}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800">{l.nombre}</h4>
                    <p className="text-[11px] text-slate-500">{l.desc}</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      l.id === '1' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {l.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: GRADOS */}
          {activeSection === 'GRADOS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Catálogo oficial de grados por subsistema educativo:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-pink-200 bg-pink-50/30 space-y-2">
                  <h4 className="text-xs font-black text-pink-900">EDUCACIÓN INICIAL</h4>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>• Maternal (1 a 2 años)</li>
                    <li>• Sala de 3 Años (Nivel 1)</li>
                    <li>• Sala de 4 Años (Nivel 2)</li>
                    <li>• Sala de 5 Años (Nivel 3 / Preescolar)</li>
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/30 space-y-2">
                  <h4 className="text-xs font-black text-sky-900">EDUCACIÓN PRIMARIA</h4>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>• 1er Grado</li>
                    <li>• 2do Grado</li>
                    <li>• 3er Grado</li>
                    <li>• 4to Grado</li>
                    <li>• 5to Grado</li>
                    <li>• 6to Grado</li>
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-2">
                  <h4 className="text-xs font-black text-indigo-900">MEDIA GENERAL</h4>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>• 1er Año</li>
                    <li>• 2do Año</li>
                    <li>• 3er Año</li>
                    <li>• 4to Año (Mención Ciencias)</li>
                    <li>• 5to Año (Mención Ciencias)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: SECCIONES */}
          {activeSection === 'SECCIONES' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Secciones activas matriculadas:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['Sección "A"', 'Sección "B"', 'Sección "C"', 'Sección Única'].map((sec, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-200 bg-white text-center">
                    <span className="text-xs font-black text-slate-800">{sec}</span>
                    <p className="text-[10px] text-slate-400 mt-1">Capacidad estándar: 32</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: MATERIAS */}
          {activeSection === 'MATERIAS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Malla curricular institucional de Media General y áreas pedagógicas:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {[
                  'Castellano y Literatura',
                  'Inglés y Otras Lenguas Extranjeras',
                  'Matemática',
                  'Educación Física',
                  'Ciencias Naturales (Biología)',
                  'Física',
                  'Química',
                  'Geografía, Historia y Ciudadanía (GHC)',
                  'Formación para la Soberanía Nacional (FSN)',
                  'Orientación y Convivencia',
                  'Grupos de Creación, Recreación y Producción (CRP)'
                ].map((mat, i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{mat}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">MPPE</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: ENFOQUES */}
          {activeSection === 'ENFOQUES' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Enfoques metodológicos de planificación institucional:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nuevo enfoque pedagógico..."
                  value={newEnfoque}
                  onChange={(e) => setNewEnfoque(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  onClick={() => {
                    if (newEnfoque.trim()) {
                      setEnfoques([...enfoques, newEnfoque.trim()]);
                      setNewEnfoque('');
                      showToast('Enfoque agregado correctamente.');
                    }
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              <div className="space-y-2">
                {enfoques.map((enf, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">• {enf}</span>
                    <button
                      onClick={() => setEnfoques(enfoques.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: RESPONSABLES GRUPOS CRP */}
          {activeSection === 'RESPONSABLES_CRP' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Asignación de docentes a Grupos de Creación, Recreación y Producción (CRP):</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gruposCRP.map((crp, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800">{crp.nombre}</h4>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        {crp.nivel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Responsable: <span className="font-semibold text-slate-700">{crp.responsable}</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8: GRADOS TRANSFERENCIAS */}
          {activeSection === 'GRADOS_TRANSFERENCIAS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Mapeo y compatibilidad de grados para alumnos transferidos:</p>
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                <div className="flex justify-between font-bold text-slate-700 border-b pb-1.5">
                  <span>Grado / Año de Origen</span>
                  <span>Equivalencia en SICE-CBA</span>
                </div>
                {[
                  { origen: '1er Año Ciclo Básico', destino: '1er Año de Educación Media General' },
                  { origen: '2do Año Ciclo Básico', destino: '2do Año de Educación Media General' },
                  { origen: '3er Año Ciclo Básico', destino: '3er Año de Educación Media General' },
                  { origen: '4to Año Diversificado', destino: '4to Año Educación Media General (Ciencias)' },
                  { origen: '5to Año Diversificado', destino: '5to Año Educación Media General (Ciencias)' }
                ].map((tr, i) => (
                  <div key={i} className="flex justify-between py-1.5 border-b border-slate-50 text-slate-600">
                    <span>{tr.origen}</span>
                    <span className="font-semibold text-amber-700">{tr.destino}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 9: ASIGNACIÓN DE MATERIAS */}
          {activeSection === 'ASIGNACION_MATERIAS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Asignación curricular para Educación Media General:</p>
              <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="font-bold text-slate-700">Materia / Asignatura</span>
                  <span className="font-bold text-slate-700">Docente Titular Asignado</span>
                </div>
                {[
                  { mat: 'Matemática (1er a 5to Año)', doc: 'Prof. Carlos Mendoza' },
                  { mat: 'Física y Química', doc: 'Lic. Mariana Gómez' },
                  { mat: 'Castellano y Literatura', doc: 'Prof. Pedro Ramírez' },
                  { mat: 'Inglés Extranjero', doc: 'Lic. Mayuli Silva' }
                ].map((row, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-slate-50">
                    <span className="font-semibold text-slate-800">{row.mat}</span>
                    <span className="text-slate-600">{row.doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 10: ASIGNACIÓN DE MATERIAS P. (PRIMARIA) */}
          {activeSection === 'ASIGNACION_MATERIAS_P' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Asignación de docentes de aula para Educación Primaria:</p>
              <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs space-y-2">
                {[
                  { grado: '1er Grado A y B', doc: 'Docente Integral de Aula 1' },
                  { grado: '2do Grado A y B', doc: 'Docente Integral de Aula 2' },
                  { grado: '3er Grado A y B', doc: 'Docente Integral de Aula 3' },
                  { grado: '4to Grado A y B', doc: 'Docente Integral de Aula 4' },
                  { grado: '5to Grado A y B', doc: 'Docente Integral de Aula 5' },
                  { grado: '6to Grado A y B', doc: 'Docente Integral de Aula 6' }
                ].map((r, i) => (
                  <div key={i} className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="font-bold text-slate-700">{r.grado}</span>
                    <span className="text-slate-600">{r.doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 11: CARGA HORARIA */}
          {activeSection === 'CARGA_HORARIA' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Resumen y distribución semanal de horas pedagógicas:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-center">
                  <span className="text-2xl font-black text-amber-600">36</span>
                  <p className="text-xs font-bold text-slate-800 mt-1">Horas Semanales Docente</p>
                  <p className="text-[10px] text-slate-400">Tiempo Completo</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-center">
                  <span className="text-2xl font-black text-amber-600">18</span>
                  <p className="text-xs font-bold text-slate-800 mt-1">Horas Semanales Docente</p>
                  <p className="text-[10px] text-slate-400">Medio Tiempo</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-center">
                  <span className="text-2xl font-black text-amber-600">45 min</span>
                  <p className="text-xs font-bold text-slate-800 mt-1">Bloque Pedagógico</p>
                  <p className="text-[10px] text-slate-400">Duración Oficial</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 12: COORDINADORES DOCENTES */}
          {activeSection === 'COORDINADORES_DOCENTES' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Coordinaciones pedagógicas por nivel educativo:</p>
              <div className="space-y-2">
                {[
                  { nivel: 'Educación Inicial', coord: 'Coordinación Pedagógica de Nivel Inicial' },
                  { nivel: 'Educación Primaria', coord: 'Coordinación Pedagógica de Primaria' },
                  { nivel: 'Educación Media General', coord: 'Unidad de Control de Estudios y Evaluación (UCE)' }
                ].map((c, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-200 bg-white flex justify-between text-xs">
                    <span className="font-bold text-slate-800">{c.nivel}</span>
                    <span className="text-slate-600 font-medium">{c.coord}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 13: DOCENTES GUÍAS */}
          {activeSection === 'DOCENTES_GUIAS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Docentes guías designados por sección para acompañamiento:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {[
                  { sec: '1er Año A', doc: 'Prof. Pedro Ramírez' },
                  { sec: '1er Año B', doc: 'Lic. Mariana Gómez' },
                  { sec: '2do Año A', doc: 'Prof. Carlos Mendoza' },
                  { sec: '2do Año B', doc: 'Lic. Alberto Silva' },
                  { sec: '3er Año A', doc: 'Prof. Elena Morales' },
                  { sec: '4to Año A', doc: 'Lic. Mayuli Silva' },
                  { sec: '5to Año A', doc: 'Prof. Luis Hernández' }
                ].map((dg, i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-slate-200 bg-white flex justify-between">
                    <span className="font-bold text-slate-700">{dg.sec}</span>
                    <span className="text-slate-600">{dg.doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 14: DIRECTORES */}
          {activeSection === 'DIRECTORES' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Registro de firmas autorizadas y directivos del plantel:</p>
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <h4 className="font-extrabold text-slate-800">Prof. Carlos R. Méndez P.</h4>
                    <p className="text-[11px] text-slate-500">Director General CBA • C.I. V-12.345.678</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                    Firma Principal
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-extrabold text-slate-800">Lic. Mayuli G. Silva M.</h4>
                    <p className="text-[11px] text-slate-500">Subdirectora Académica • C.I. V-18.765.432</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                    Firma Delegada
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 15: SUPERVISORES */}
          {activeSection === 'SUPERVISORES' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Supervisores del Circuito Escolar MPPE:</p>
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="font-bold text-slate-800">Supervisor(a) Circuital</span>
                  <span className="text-slate-600">Lic. Rosa Elena Torres (Circuito Escolar 05)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="font-bold text-slate-800">Enlace UCE Zonal</span>
                  <span className="text-slate-600">Prof. Gerardo Peña (Zona Educativa Barinas)</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 16: TIPOS DE ESTRATEGIAS */}
          {activeSection === 'TIPOS_ESTRATEGIAS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Estrategias e instrumentos de evaluación registrados:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nueva estrategia evaluativa..."
                  value={newEstrategia}
                  onChange={(e) => setNewEstrategia(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  onClick={() => {
                    if (newEstrategia.trim()) {
                      setTiposEstrategias([...tiposEstrategias, newEstrategia.trim()]);
                      setNewEstrategia('');
                      showToast('Estrategia agregada.');
                    }
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto no-scrollbar text-xs">
                {tiposEstrategias.map((est, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                    <span className="font-medium text-slate-800">{est}</span>
                    <button
                      onClick={() => setTiposEstrategias(tiposEstrategias.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 17: FALTAS */}
          {activeSection === 'FALTAS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Tipificación de faltas y medidas disciplinarias escolares:</p>
              <div className="space-y-2 text-xs">
                {faltasCatalogo.map((f, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{f.descripcion}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                        f.tipo === 'LEVE' ? 'bg-amber-100 text-amber-800' :
                        f.tipo === 'GRAVE' ? 'bg-orange-100 text-orange-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        FALTA {f.tipo}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Medida: <span className="font-medium text-slate-700">{f.sancion}</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 18: AULAS DE CLASES */}
          {activeSection === 'AULAS_CLASES' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Inventario y capacidad física de aulas:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Código (ej: A-301)"
                  value={newAulaCod}
                  onChange={(e) => setNewAulaCod(e.target.value)}
                  className="w-28 px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
                <input
                  type="text"
                  placeholder="Nombre de aula / ubicación"
                  value={newAulaNom}
                  onChange={(e) => setNewAulaNom(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
                <button
                  onClick={() => {
                    if (newAulaCod.trim() && newAulaNom.trim()) {
                      setAulas([...aulas, { codigo: newAulaCod.trim(), nombre: newAulaNom.trim(), capacidad: 32, ubicacion: 'Edificio Central' }]);
                      setNewAulaCod('');
                      setNewAulaNom('');
                      showToast('Aula registrada.');
                    }
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {aulas.map((aula, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-amber-700">{aula.codigo}</span>
                      <p className="font-semibold text-slate-800">{aula.nombre}</p>
                    </div>
                    <span className="text-[10px] text-slate-500">{aula.capacidad} puestos</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 19: ESCUELAS EXTERNAS */}
          {activeSection === 'ESCUELAS_EXTERNAS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Planteles de procedencia para trámites de ingreso y equivalencias:</p>
              <div className="space-y-2 text-xs">
                {escuelasExternas.map((esc, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800">{esc.nombre}</h4>
                      <p className="text-[10px] text-slate-400">DEA: <span className="font-mono">{esc.dea}</span> • {esc.localidad}</p>
                    </div>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">Registrada</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 20: LOCALIDADES */}
          {activeSection === 'LOCALIDADES' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Parroquias y sectores de procedencia estudiantil:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nueva localidad / parroquia..."
                  value={newLoc}
                  onChange={(e) => setNewLoc(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  onClick={() => {
                    if (newLoc.trim()) {
                      setLocalidades([...localidades, newLoc.trim()]);
                      setNewLoc('');
                      showToast('Localidad agregada.');
                    }
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {localidades.map((loc, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white flex justify-between items-center">
                    <span className="font-medium text-slate-700">• {loc}</span>
                    <button
                      onClick={() => setLocalidades(localidades.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 21: EVALUACIONES */}
          {activeSection === 'EVALUACIONES' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Parámetros oficiales de ponderación evaluativa por lapso:</p>
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b">
                  <span className="font-bold text-slate-800">Porcentaje máximo por actividad evaluativa</span>
                  <span className="font-mono font-bold text-amber-700">20% a 25%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b">
                  <span className="font-bold text-slate-800">Número mínimo de evaluaciones por lapso (Media General)</span>
                  <span className="font-mono font-bold text-amber-700">4 evaluaciones</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b">
                  <span className="font-bold text-slate-800">Evaluación Remedial / Revisión</span>
                  <span className="font-mono font-bold text-emerald-700">Habilitada al cierre de lapso</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 22: DOCUMENTOS */}
          {activeSection === 'DOCUMENTOS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Documentos reglamentarios requeridos en expediente de matrícula:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {[
                  'Partida de Nacimiento Original y Copia',
                  'Cédula de Identidad del Alumno (si aplica)',
                  'Cédula de Identidad del Representante Legal',
                  'Fotos Tipo Carnet del Alumno (4)',
                  'Fotos Tipo Carnet del Representante (2)',
                  'Certificado de Vacunación Actualizado',
                  'Informe Descriptivo del Plantel de Procedencia',
                  'Boletín de Notas del Grado Anterior',
                  'Constancia de Buena Conducta del Plantel de Origen'
                ].map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-semibold text-slate-700">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 23: CALIBRAR TÍTULOS */}
          {activeSection === 'CALIBRAR_TITULOS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Calibración milimétrica para la impresión de Títulos Oficiales de Bachiller en formato papel de seguridad MPPE:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Margen Superior (mm)</label>
                  <input
                    type="number"
                    value={calibracionTitulos.margenSuperior}
                    onChange={(e) => setCalibracionTitulos({ ...calibracionTitulos, margenSuperior: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Margen Izquierdo (mm)</label>
                  <input
                    type="number"
                    value={calibracionTitulos.margenIzquierdo}
                    onChange={(e) => setCalibracionTitulos({ ...calibracionTitulos, margenIzquierdo: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Formato de Hoja</label>
                  <input
                    type="text"
                    value={calibracionTitulos.tamanoHoja}
                    readOnly
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Posición de Sello y Firma</label>
                  <input
                    type="text"
                    value={calibracionTitulos.posicionSelloFirma}
                    onChange={(e) => setCalibracionTitulos({ ...calibracionTitulos, posicionSelloFirma: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => showToast('Calibración de títulos guardada correctamente.')}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition"
                >
                  <Save className="w-4 h-4" /> Guardar Calibración de Títulos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
