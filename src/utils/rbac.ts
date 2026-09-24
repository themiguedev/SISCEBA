import { UserRole, MainNavigationTab, EducationalLevel } from '../types';

/**
 * Escala jerárquica numérica de roles institucionales SICE-CBA
 * Mayor puntuación implica mayor nivel de privilegio y autoridad.
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  ADMINISTRADOR: 100,
  DIRECTOR: 80,
  COORDINACION: 60,
  COORDINADOR: 60, // Alias de compatibilidad
  SECRETARIA: 50,
  DOCENTE: 40,
  ASISTENTE: 30,
  REPRESENTANTE: 20,
  ESTUDIANTE: 10
};

/**
 * Metadatos descriptivos institucionales de cada rol
 */
export interface RoleMetadata {
  id: UserRole;
  label: string;
  badge: string;
  badgeBg: string;
  description: string;
  department: string;
  scope: string;
}

export const ROLE_METADATA: Record<UserRole, RoleMetadata> = {
  ADMINISTRADOR: {
    id: 'ADMINISTRADOR',
    label: 'Administrador de Sistemas',
    badge: '👑 Administrador',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    description: 'Control y configuración global de base de datos, seguridad, usuarios y auditoría técnica.',
    department: 'Dirección de Tecnología',
    scope: 'Acceso Total al Sistema'
  },
  DIRECTOR: {
    id: 'DIRECTOR',
    label: 'Director General CBA',
    badge: '🏛️ Dirección',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Máxima autoridad académica y directiva. Firma de títulos, aprobación de boletines y circulares.',
    department: 'Dirección General',
    scope: 'Supervisión Institucional y Firma'
  },
  COORDINACION: {
    id: 'COORDINACION',
    label: 'Coordinación Pedagógica / UCE',
    badge: '📋 Coordinación',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    description: 'Control de Estudios y Evaluación. Aprobación de planes didácticos, pases, notas y matrículas.',
    department: 'Unidad de Control de Estudios (UCE)',
    scope: 'Gestión Pedagógica y Operativa'
  },
  COORDINADOR: {
    id: 'COORDINADOR',
    label: 'Coordinador Pedagógico',
    badge: '📋 Coordinación',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    description: 'Control de Estudios y Evaluación.',
    department: 'Unidad de Control de Estudios (UCE)',
    scope: 'Gestión Pedagógica y Operativa'
  },
  DOCENTE: {
    id: 'DOCENTE',
    label: 'Docente de Aula / Especialista',
    badge: '🔬 Docente',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Planificación didáctica oficial, asentamiento de notas procesales y asistencia diaria de clase.',
    department: 'Cuerpo Docente CBA',
    scope: 'Planificación, Evaluación y Asistencia de Aula'
  },
  SECRETARIA: {
    id: 'SECRETARIA',
    label: 'Secretaría Académica / Control de Estudios',
    badge: '📂 Secretaría',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    description: 'Gestión de admisiones, inscripciones, expedientes de matrícula, solicitud y emisión de documentos académicos y constancias.',
    department: 'Secretaría de Control de Estudios (UCE)',
    scope: 'Gestión de Matrícula, Expedientes y Emisión de Documentos'
  },
  ASISTENTE: {
    id: 'ASISTENTE',
    label: 'Asistente de Aula y Disciplina',
    badge: '🤝 Asistente',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Registro operativo de asistencia diaria de estudiantes, control de pases por retraso e historial de conducta y disciplina.',
    department: 'Coordinación de Asistencia y Disciplina',
    scope: 'Registro de Asistencia, Pases y Conducta Estudiantil'
  },
  REPRESENTANTE: {
    id: 'REPRESENTANTE',
    label: 'Padre o Representante Legal',
    badge: '👨‍👩‍👦 Representante',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    description: 'Portal de consulta familiar: boletines de notas, récord de asistencias y avisos de su representado.',
    department: 'Comunidad de Padres y Representantes',
    scope: 'Solo Consultas de su Representado'
  },
  ESTUDIANTE: {
    id: 'ESTUDIANTE',
    label: 'Estudiante CBA',
    badge: '🎒 Alumno',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    description: 'Portal del alumno: consulta de calificaciones personales, boletín por lapso y cartelera escolar.',
    department: 'Cuerpo Estudiantil CBA',
    scope: 'Solo Consulta Personal'
  }
};

/**
 * Matriz de acceso a pestañas principales (MainNavigationTab) por rol
 */
export const ROLE_TAB_PERMISSIONS: Record<UserRole, MainNavigationTab[]> = {
  ADMINISTRADOR: [
    'ESCRITORIO',
    'GESTION',
    'INICIAL',
    'PRIMARIA',
    'MEDIA_GENERAL',
    'CONSULTAS',
    'COMUNIDAD',
    'CONFIGURACION',
    'AYUDA'
  ],
  DIRECTOR: [
    'ESCRITORIO',
    'GESTION',
    'INICIAL',
    'PRIMARIA',
    'MEDIA_GENERAL',
    'CONSULTAS',
    'COMUNIDAD',
    'CONFIGURACION',
    'AYUDA'
  ],
  COORDINACION: [
    'ESCRITORIO',
    'GESTION',
    'INICIAL',
    'PRIMARIA',
    'MEDIA_GENERAL',
    'CONSULTAS',
    'COMUNIDAD',
    'CONFIGURACION',
    'AYUDA'
  ],
  COORDINADOR: [
    'ESCRITORIO',
    'GESTION',
    'INICIAL',
    'PRIMARIA',
    'MEDIA_GENERAL',
    'CONSULTAS',
    'COMUNIDAD',
    'CONFIGURACION',
    'AYUDA'
  ],
  DOCENTE: [
    'ESCRITORIO',
    'GESTION',
    'INICIAL',
    'PRIMARIA',
    'MEDIA_GENERAL',
    'CONSULTAS',
    'COMUNIDAD',
    'CONFIGURACION',
    'AYUDA'
  ],
  SECRETARIA: [
    'ESCRITORIO',
    'GESTION',
    'CONSULTAS',
    'COMUNIDAD',
    'AYUDA'
  ],
  ASISTENTE: [
    'ESCRITORIO',
    'GESTION',
    'CONSULTAS',
    'COMUNIDAD',
    'AYUDA'
  ],
  REPRESENTANTE: [
    'CONSULTAS',
    'COMUNIDAD',
    'AYUDA'
  ],
  ESTUDIANTE: [
    'CONSULTAS',
    'COMUNIDAD',
    'AYUDA'
  ]
};

/**
 * Lista exhaustiva de todas las subpestañas académicas de nivel (Planificación, Evaluación y Comunicación)
 */
export const ALL_LEVEL_SUBTABS: string[] = [
  // Planificación
  'DISENADOR_OFICIAL',
  'AREAS_PERFILES',
  'BANCO_COMPETENCIAS',
  'BANCO_ESTRATEGIAS',
  'PLAN_QUINCENAL',
  'PLAN_LAPSO',
  // Evaluación
  'DIAGNOSTICA',
  'PROCESAL',
  'FINAL_LAPSO',
  'ESTADISTICAS',
  // Comunicación
  'BOLETIN',
  'ACTAS_CONSEJO',
  'IA_ACTION_PLANS',
  'REMEDIALES',
  'REPORTES_INSTITUCIONALES'
];

/**
 * Matriz de acceso granular a subpestañas por módulo
 */
export const ROLE_SUBTAB_PERMISSIONS: Record<UserRole, Partial<Record<MainNavigationTab, string[]>>> = {
  ADMINISTRADOR: {
    ESCRITORIO: ['DASHBOARD', 'PERFIL', 'SUGERENCIAS'],
    GESTION: ['INSCRIPCIONES', 'PASES', 'INASISTENCIAS', 'CONDUCTAS', 'DOCUMENTOS', 'BLOQUEO', 'TITULOS', 'MATRICULA'],
    INICIAL: ALL_LEVEL_SUBTABS,
    PRIMARIA: ALL_LEVEL_SUBTABS,
    MEDIA_GENERAL: ALL_LEVEL_SUBTABS,
    CONSULTAS: ['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA', 'ESTADISTICAS', 'NOMINAS'],
    COMUNIDAD: ['NOTICIAS', 'CUMPLEANOS', 'COMUNICADOS'],
    CONFIGURACION: ['LAPSOS', 'ESTRUCTURA', 'DOCENTES', 'TEMAS'],
    AYUDA: ['MANUAL', 'MAPA_SITIO']
  },
  DIRECTOR: {
    ESCRITORIO: ['DASHBOARD', 'PERFIL', 'SUGERENCIAS'],
    GESTION: ['INSCRIPCIONES', 'PASES', 'INASISTENCIAS', 'CONDUCTAS', 'DOCUMENTOS', 'BLOQUEO', 'TITULOS', 'MATRICULA'],
    INICIAL: ALL_LEVEL_SUBTABS,
    PRIMARIA: ALL_LEVEL_SUBTABS,
    MEDIA_GENERAL: ALL_LEVEL_SUBTABS,
    CONSULTAS: ['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA', 'ESTADISTICAS', 'NOMINAS'],
    COMUNIDAD: ['NOTICIAS', 'CUMPLEANOS', 'COMUNICADOS'],
    CONFIGURACION: ['LAPSOS', 'ESTRUCTURA', 'DOCENTES', 'TEMAS'],
    AYUDA: ['MANUAL', 'MAPA_SITIO']
  },
  COORDINACION: {
    ESCRITORIO: ['DASHBOARD', 'PERFIL', 'SUGERENCIAS'],
    GESTION: ['INSCRIPCIONES', 'PASES', 'INASISTENCIAS', 'CONDUCTAS', 'DOCUMENTOS', 'TITULOS', 'MATRICULA'], // Bloqueo reservado a Director/Admin
    INICIAL: ALL_LEVEL_SUBTABS,
    PRIMARIA: ALL_LEVEL_SUBTABS,
    MEDIA_GENERAL: ALL_LEVEL_SUBTABS,
    CONSULTAS: ['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA', 'ESTADISTICAS', 'NOMINAS'],
    COMUNIDAD: ['NOTICIAS', 'CUMPLEANOS', 'COMUNICADOS'],
    CONFIGURACION: ['LAPSOS', 'ESTRUCTURA', 'DOCENTES', 'TEMAS'],
    AYUDA: ['MANUAL', 'MAPA_SITIO']
  },
  COORDINADOR: {
    ESCRITORIO: ['DASHBOARD', 'PERFIL', 'SUGERENCIAS'],
    GESTION: ['INSCRIPCIONES', 'PASES', 'INASISTENCIAS', 'CONDUCTAS', 'DOCUMENTOS', 'TITULOS', 'MATRICULA'],
    INICIAL: ALL_LEVEL_SUBTABS,
    PRIMARIA: ALL_LEVEL_SUBTABS,
    MEDIA_GENERAL: ALL_LEVEL_SUBTABS,
    CONSULTAS: ['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA', 'ESTADISTICAS', 'NOMINAS'],
    COMUNIDAD: ['NOTICIAS', 'CUMPLEANOS', 'COMUNICADOS'],
    CONFIGURACION: ['LAPSOS', 'ESTRUCTURA', 'DOCENTES', 'TEMAS'],
    AYUDA: ['MANUAL', 'MAPA_SITIO']
  },
  DOCENTE: {
    ESCRITORIO: ['DASHBOARD', 'PERFIL', 'SUGERENCIAS'],
    GESTION: ['PASES', 'INASISTENCIAS', 'CONDUCTAS'], // Asistencia diaria y pases de su aula
    INICIAL: ALL_LEVEL_SUBTABS,
    PRIMARIA: ALL_LEVEL_SUBTABS,
    MEDIA_GENERAL: ALL_LEVEL_SUBTABS,
    CONSULTAS: ['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA', 'NOMINAS'], // Rendimiento de sus materias
    COMUNIDAD: ['NOTICIAS', 'CUMPLEANOS', 'COMUNICADOS'],
    CONFIGURACION: ['TEMAS'], // Solo personalización de tema
    AYUDA: ['MANUAL', 'MAPA_SITIO']
  },
  SECRETARIA: {
    ESCRITORIO: ['DASHBOARD', 'PERFIL', 'SUGERENCIAS'],
    GESTION: ['INSCRIPCIONES', 'DOCUMENTOS', 'MATRICULA'], // Admisiones, expedientes y trámites
    CONSULTAS: ['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA', 'ESTADISTICAS', 'NOMINAS'],
    COMUNIDAD: ['NOTICIAS', 'CUMPLEANOS', 'COMUNICADOS'],
    AYUDA: ['MANUAL', 'MAPA_SITIO']
  },
  ASISTENTE: {
    ESCRITORIO: ['DASHBOARD', 'PERFIL', 'SUGERENCIAS'],
    GESTION: ['PASES', 'INASISTENCIAS', 'CONDUCTAS'], // Enfoque principal: Asistencia, Pases y Registro de Conductas
    CONSULTAS: ['ASISTENCIA', 'NOMINAS'],
    COMUNIDAD: ['NOTICIAS', 'CUMPLEANOS', 'COMUNICADOS'],
    AYUDA: ['MANUAL', 'MAPA_SITIO']
  },
  REPRESENTANTE: {
    CONSULTAS: ['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA'], // Solo calificaciones, boletín y asistencia de su representado
    COMUNIDAD: ['NOTICIAS', 'COMUNICADOS'],
    AYUDA: ['MANUAL', 'MAPA_SITIO']
  },
  ESTUDIANTE: {
    CONSULTAS: ['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA'], // Solo mis notas y mi asistencia
    COMUNIDAD: ['NOTICIAS', 'COMUNICADOS'],
    AYUDA: ['MANUAL', 'MAPA_SITIO']
  }
};

/**
 * Valida si un rol tiene acceso a una pestaña principal
 */
export const hasTabAccess = (role: UserRole, tab: MainNavigationTab): boolean => {
  if (role === 'ADMINISTRADOR') return true;
  const allowed = ROLE_TAB_PERMISSIONS[role] || [];
  return allowed.includes(tab);
};

/**
 * Valida si un rol tiene acceso a una subpestaña específica dentro de un módulo
 */
export const hasSubTabAccess = (
  role: UserRole,
  tab: MainNavigationTab,
  subTabId?: string
): boolean => {
  if (role === 'ADMINISTRADOR') return true;
  if (!hasTabAccess(role, tab)) return false;
  if (!subTabId) return true;

  const roleSubs = ROLE_SUBTAB_PERMISSIONS[role];
  if (!roleSubs) return false;

  const allowedSubs = roleSubs[tab];
  if (!allowedSubs) return false;

  return allowedSubs.includes(subTabId);
};

/**
 * Retorna la pestaña predeterminada a la que debe redirigirse un rol al ingresar
 */
export const getDefaultTabForRole = (role: UserRole): MainNavigationTab => {
  if (role === 'REPRESENTANTE' || role === 'ESTUDIANTE') {
    return 'CONSULTAS';
  }
  return 'ESCRITORIO';
};

/**
 * Verifica si el rol tiene privilegios de aprobación y supervisión de planificaciones didácticas
 */
export const canApprovePlans = (role: UserRole): boolean => {
  return role === 'ADMINISTRADOR' || role === 'DIRECTOR' || role === 'COORDINACION' || role === 'COORDINADOR';
};

/**
 * Verifica si el rol tiene permisos para asentar o modificar calificaciones procesales
 */
export const canEditGrades = (role: UserRole): boolean => {
  return (
    role === 'ADMINISTRADOR' ||
    role === 'COORDINACION' ||
    role === 'COORDINADOR' ||
    role === 'DOCENTE'
  );
};

/**
 * Verifica si el rol puede aplicar o levantar bloqueos administrativos financieros
 */
export const canManageBlocks = (role: UserRole): boolean => {
  return role === 'ADMINISTRADOR' || role === 'DIRECTOR';
};

/**
 * Verifica si el rol puede validar, firmar o emitir Títulos de Bachiller oficiales MPPE
 */
export const canIssueTitles = (role: UserRole): boolean => {
  return role === 'ADMINISTRADOR' || role === 'DIRECTOR' || role === 'COORDINACION' || role === 'COORDINADOR';
};

/**
 * Verifica si el rol puede configurar la estructura institucional y apertura de lapsos
 */
export const canConfigureSchool = (role: UserRole): boolean => {
  return role === 'ADMINISTRADOR' || role === 'DIRECTOR';
};

/**
 * Verifica si el rol puede publicar o difundir comunicados oficiales en la cartelera
 */
export const canPublishCommunity = (role: UserRole): boolean => {
  return (
    role === 'ADMINISTRADOR' ||
    role === 'DIRECTOR' ||
    role === 'COORDINACION' ||
    role === 'COORDINADOR' ||
    role === 'DOCENTE'
  );
};

/**
 * Determina si el rol tiene restricciones de confidencialidad familiar/estudiantil (solo consultas)
 */
export const isConsultasOnlyRole = (role: UserRole): boolean => {
  return role === 'REPRESENTANTE' || role === 'ESTUDIANTE';
};

/**
 * Retorna los niveles educativos autorizados y visibles según el rol y la cuenta de usuario
 */
export const getUserAllowedLevels = (
  role: UserRole,
  user?: { allowedLevels?: EducationalLevel[]; defaultLevel?: EducationalLevel } | null
): EducationalLevel[] => {
  // 1. Roles directivos y de supervisión general tienen acceso a todos los niveles
  if (role === 'ADMINISTRADOR' || role === 'DIRECTOR' || role === 'COORDINACION' || role === 'COORDINADOR') {
    return ['INICIAL', 'PRIMARIA', 'MEDIA_GENERAL'];
  }

  // 2. Roles puramente operativos o de consulta no son docentes de aula
  if (role === 'ASISTENTE' || role === 'SECRETARIA' || role === 'REPRESENTANTE' || role === 'ESTUDIANTE') {
    return [];
  }

  // 3. Usuario con niveles explícitamente configurados
  if (user?.allowedLevels && user.allowedLevels.length > 0) {
    return user.allowedLevels;
  }

  // 4. Docente con defaultLevel asignado
  if (user?.defaultLevel) {
    return [user.defaultLevel];
  }

  // 5. Fallback por defecto si no está especificado
  return ['MEDIA_GENERAL'];
};
