import { UserRole, MainNavigationTab, EducationalLevel, AppUser, SystemNotification } from '../types';

/**
 * Obtiene todos los roles efectivos acumulados de un usuario o rol.
 * Si el usuario posee `roles` definidos, agrupa su rol primario y los roles adicionales sin duplicados.
 */
export const getUserEffectiveRoles = (
  roleOrUser: UserRole | (Partial<AppUser> & { role?: UserRole }) | null | undefined
): UserRole[] => {
  if (!roleOrUser) return ['DOCENTE'];
  if (typeof roleOrUser === 'string') return [roleOrUser];
  
  const primaryRole = roleOrUser.role || 'DOCENTE';
  const additional = Array.isArray(roleOrUser.roles) ? roleOrUser.roles : [];
  const set = new Set<UserRole>([primaryRole, ...additional]);
  return Array.from(set);
};

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
    label: 'Secretaría / Asistencia y Conducta',
    badge: '📂 Secretaría',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    description: 'Gestión y control de inasistencias diarias de estudiantes y registro de conducta y disciplina.',
    department: 'Secretaría Escolar / Control de Asistencia y Disciplina',
    scope: 'Inasistencias Diarias y Registro de Conducta'
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
    ESCRITORIO: ['DASHBOARD', 'PERFIL', 'HORARIO', 'SUGERENCIAS'],
    GESTION: ['TAREAS_RECURRENTES', 'INSCRIPCIONES', 'PASES', 'INASISTENCIAS', 'CONDUCTAS', 'DOCUMENTOS', 'BLOQUEO', 'TITULOS', 'MATRICULA', 'TALLERES_CRP', 'USUARIOS'],
    INICIAL: ALL_LEVEL_SUBTABS,
    PRIMARIA: ALL_LEVEL_SUBTABS,
    MEDIA_GENERAL: ALL_LEVEL_SUBTABS,
    CONSULTAS: ['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA', 'ESTADISTICAS', 'NOMINAS'],
    COMUNIDAD: ['NOTICIAS', 'CUMPLEANOS', 'COMUNICADOS'],
    CONFIGURACION: ['LAPSOS', 'ESTRUCTURA', 'TEMAS', 'CONFIG_CEO', 'AVANZADA'],
    AYUDA: ['MANUAL', 'MAPA_SITIO']
  },
  DIRECTOR: {
    ESCRITORIO: ['DASHBOARD', 'PERFIL', 'HORARIO', 'SUGERENCIAS'],
    GESTION: ['TAREAS_RECURRENTES', 'INSCRIPCIONES', 'PASES', 'INASISTENCIAS', 'CONDUCTAS', 'DOCUMENTOS', 'BLOQUEO', 'TITULOS', 'TALLERES_CRP'], // Matrícula y Prosecución exclusiva de Administrador
    INICIAL: ALL_LEVEL_SUBTABS,
    PRIMARIA: ALL_LEVEL_SUBTABS,
    MEDIA_GENERAL: ALL_LEVEL_SUBTABS,
    CONSULTAS: ['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA', 'ESTADISTICAS', 'NOMINAS'],
    COMUNIDAD: ['NOTICIAS', 'CUMPLEANOS', 'COMUNICADOS'],
    CONFIGURACION: ['LAPSOS', 'ESTRUCTURA', 'TEMAS'],
    AYUDA: ['MANUAL', 'MAPA_SITIO']
  },
  COORDINACION: {
    ESCRITORIO: ['DASHBOARD', 'PERFIL', 'HORARIO', 'SUGERENCIAS'],
    GESTION: ['TAREAS_RECURRENTES', 'INSCRIPCIONES', 'PASES', 'INASISTENCIAS', 'CONDUCTAS', 'DOCUMENTOS', 'TITULOS', 'TALLERES_CRP'], // Bloqueo reservado a Director/Admin, Matrícula reservada a Admin
    INICIAL: ALL_LEVEL_SUBTABS,
    PRIMARIA: ALL_LEVEL_SUBTABS,
    MEDIA_GENERAL: ALL_LEVEL_SUBTABS,
    CONSULTAS: ['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA', 'ESTADISTICAS', 'NOMINAS'],
    COMUNIDAD: ['NOTICIAS', 'CUMPLEANOS', 'COMUNICADOS'],
    CONFIGURACION: ['LAPSOS', 'ESTRUCTURA', 'TEMAS'],
    AYUDA: ['MANUAL']
  },
  COORDINADOR: {
    ESCRITORIO: ['DASHBOARD', 'PERFIL', 'HORARIO', 'SUGERENCIAS'],
    GESTION: ['TAREAS_RECURRENTES', 'INSCRIPCIONES', 'PASES', 'INASISTENCIAS', 'CONDUCTAS', 'DOCUMENTOS', 'TITULOS', 'TALLERES_CRP'],
    INICIAL: ALL_LEVEL_SUBTABS,
    PRIMARIA: ALL_LEVEL_SUBTABS,
    MEDIA_GENERAL: ALL_LEVEL_SUBTABS,
    CONSULTAS: ['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA', 'ESTADISTICAS', 'NOMINAS'],
    COMUNIDAD: ['NOTICIAS', 'CUMPLEANOS', 'COMUNICADOS'],
    CONFIGURACION: ['LAPSOS', 'ESTRUCTURA', 'TEMAS'],
    AYUDA: ['MANUAL']
  },
  DOCENTE: {
    ESCRITORIO: ['DASHBOARD', 'PERFIL', 'HORARIO', 'SUGERENCIAS'],
    GESTION: ['PASES', 'INASISTENCIAS', 'CONDUCTAS', 'TALLERES_CRP'], // Asistencia diaria, pases y talleres CRP
    INICIAL: ALL_LEVEL_SUBTABS,
    PRIMARIA: ALL_LEVEL_SUBTABS,
    MEDIA_GENERAL: ALL_LEVEL_SUBTABS,
    CONSULTAS: ['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA', 'NOMINAS'], // Rendimiento de sus materias
    COMUNIDAD: ['NOTICIAS', 'CUMPLEANOS', 'COMUNICADOS'],
    CONFIGURACION: ['TEMAS'], // Solo personalización de tema
    AYUDA: ['MANUAL']
  },
  SECRETARIA: {
    ESCRITORIO: ['DASHBOARD', 'PERFIL', 'HORARIO', 'SUGERENCIAS'],
    GESTION: ['INASISTENCIAS', 'CONDUCTAS'], // Inasistencias y Registro de Conductas
    CONSULTAS: ['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA', 'ESTADISTICAS', 'NOMINAS'],
    COMUNIDAD: ['NOTICIAS', 'CUMPLEANOS', 'COMUNICADOS'],
    AYUDA: ['MANUAL']
  },
  REPRESENTANTE: {
    CONSULTAS: ['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA'], // Solo calificaciones, boletín y asistencia de su representado
    COMUNIDAD: ['NOTICIAS', 'COMUNICADOS'],
    AYUDA: ['MANUAL']
  },
  ESTUDIANTE: {
    CONSULTAS: ['RENDIMIENTO', 'BOLETIN', 'ASISTENCIA'], // Solo mis notas y mi asistencia
    COMUNIDAD: ['NOTICIAS', 'COMUNICADOS'],
    AYUDA: ['MANUAL']
  }
};

/**
 * Valida si un rol o usuario con roles múltiples tiene acceso a una pestaña principal
 */
export const hasTabAccess = (
  roleOrUser: UserRole | (Partial<AppUser> & { role?: UserRole }) | UserRole[],
  tab: MainNavigationTab
): boolean => {
  const roles = Array.isArray(roleOrUser)
    ? roleOrUser
    : getUserEffectiveRoles(roleOrUser);

  if (roles.includes('ADMINISTRADOR')) return true;

  return roles.some(r => {
    const allowed = ROLE_TAB_PERMISSIONS[r] || [];
    return allowed.includes(tab);
  });
};

/**
 * Valida si un rol o usuario con roles múltiples tiene acceso a una subpestaña específica dentro de un módulo
 */
export const hasSubTabAccess = (
  roleOrUser: UserRole | (Partial<AppUser> & { role?: UserRole }) | UserRole[],
  tab: MainNavigationTab,
  subTabId?: string
): boolean => {
  const roles = Array.isArray(roleOrUser)
    ? roleOrUser
    : getUserEffectiveRoles(roleOrUser);

  if (roles.includes('ADMINISTRADOR')) return true;
  if (!hasTabAccess(roles, tab)) return false;
  if (!subTabId) return true;

  return roles.some(r => {
    const roleSubs = ROLE_SUBTAB_PERMISSIONS[r];
    if (!roleSubs) return false;
    const allowedSubs = roleSubs[tab];
    return allowedSubs ? allowedSubs.includes(subTabId) : false;
  });
};

/**
 * Retorna la pestaña predeterminada a la que debe redirigirse un rol al ingresar
 */
export const getDefaultTabForRole = (
  roleOrUser: UserRole | (Partial<AppUser> & { role?: UserRole }) | UserRole[]
): MainNavigationTab => {
  const roles = Array.isArray(roleOrUser)
    ? roleOrUser
    : getUserEffectiveRoles(roleOrUser);

  if (roles.includes('ADMINISTRADOR')) return 'ESCRITORIO';
  if (roles.some(r => r !== 'REPRESENTANTE' && r !== 'ESTUDIANTE')) {
    return 'ESCRITORIO';
  }
  return 'CONSULTAS';
};

/**
 * Verifica si el rol tiene privilegios de aprobación y supervisión de planificaciones didácticas
 */
export const canApprovePlans = (
  roleOrUser: UserRole | (Partial<AppUser> & { role?: UserRole }) | UserRole[]
): boolean => {
  const roles = Array.isArray(roleOrUser)
    ? roleOrUser
    : getUserEffectiveRoles(roleOrUser);
  return roles.some(r => r === 'ADMINISTRADOR' || r === 'DIRECTOR' || r === 'COORDINACION' || r === 'COORDINADOR');
};

/**
 * Verifica si el rol tiene permisos para asentar o modificar calificaciones procesales
 */
export const canEditGrades = (
  roleOrUser: UserRole | (Partial<AppUser> & { role?: UserRole }) | UserRole[]
): boolean => {
  const roles = Array.isArray(roleOrUser)
    ? roleOrUser
    : getUserEffectiveRoles(roleOrUser);
  return roles.some(r => r === 'ADMINISTRADOR' || r === 'COORDINACION' || r === 'COORDINADOR' || r === 'DOCENTE');
};

/**
 * Verifica si el rol puede aplicar o levantar bloqueos administrativos financieros
 */
export const canManageBlocks = (
  roleOrUser: UserRole | (Partial<AppUser> & { role?: UserRole }) | UserRole[]
): boolean => {
  const roles = Array.isArray(roleOrUser)
    ? roleOrUser
    : getUserEffectiveRoles(roleOrUser);
  return roles.some(r => r === 'ADMINISTRADOR' || r === 'DIRECTOR');
};

/**
 * Verifica si el rol puede validar, firmar o emitir Títulos de Bachiller oficiales MPPE
 */
export const canIssueTitles = (
  roleOrUser: UserRole | (Partial<AppUser> & { role?: UserRole }) | UserRole[]
): boolean => {
  const roles = Array.isArray(roleOrUser)
    ? roleOrUser
    : getUserEffectiveRoles(roleOrUser);
  return roles.some(r => r === 'ADMINISTRADOR' || r === 'DIRECTOR' || r === 'COORDINACION' || r === 'COORDINADOR');
};

/**
 * Verifica si el rol puede configurar la estructura institucional y apertura de lapsos
 */
export const canConfigureSchool = (
  roleOrUser: UserRole | (Partial<AppUser> & { role?: UserRole }) | UserRole[]
): boolean => {
  const roles = Array.isArray(roleOrUser)
    ? roleOrUser
    : getUserEffectiveRoles(roleOrUser);
  return roles.some(r => r === 'ADMINISTRADOR' || r === 'DIRECTOR');
};

/**
 * Verifica si el rol puede publicar o difundir comunicados oficiales en la cartelera
 */
export const canPublishCommunity = (
  roleOrUser: UserRole | (Partial<AppUser> & { role?: UserRole }) | UserRole[]
): boolean => {
  const roles = Array.isArray(roleOrUser)
    ? roleOrUser
    : getUserEffectiveRoles(roleOrUser);
  return roles.some(r => r === 'ADMINISTRADOR' || r === 'DIRECTOR' || r === 'COORDINACION' || r === 'COORDINADOR' || r === 'DOCENTE');
};

/**
 * Verifica si el rol tiene privilegios de administración (edición y eliminación) sobre publicaciones de cartelera
 */
export const canManageCommunityNotices = (
  roleOrUser: UserRole | (Partial<AppUser> & { role?: UserRole }) | UserRole[]
): boolean => {
  const roles = Array.isArray(roleOrUser)
    ? roleOrUser
    : getUserEffectiveRoles(roleOrUser);
  return roles.some(r => r === 'ADMINISTRADOR' || r === 'DIRECTOR');
};

/**
 * Determina si el rol tiene restricciones de confidencialidad familiar/estudiantil (solo consultas)
 */
export const isConsultasOnlyRole = (
  roleOrUser: UserRole | (Partial<AppUser> & { role?: UserRole }) | UserRole[]
): boolean => {
  const roles = Array.isArray(roleOrUser)
    ? roleOrUser
    : getUserEffectiveRoles(roleOrUser);
  return roles.every(r => r === 'REPRESENTANTE' || r === 'ESTUDIANTE');
};

/**
 * Retorna los niveles educativos autorizados y visibles según el rol y la cuenta de usuario
 */
export const getUserAllowedLevels = (
  roleOrUser: UserRole | (Partial<AppUser> & { role?: UserRole }) | UserRole[],
  user?: { allowedLevels?: EducationalLevel[]; defaultLevel?: EducationalLevel; roles?: UserRole[] } | null
): EducationalLevel[] => {
  const roles = Array.isArray(roleOrUser)
    ? roleOrUser
    : getUserEffectiveRoles(typeof roleOrUser === 'string' && user ? { ...user, role: roleOrUser } : roleOrUser);

  // 1. Roles directivos y de supervisión general tienen acceso a todos los niveles
  if (roles.some(r => r === 'ADMINISTRADOR' || r === 'DIRECTOR' || r === 'COORDINACION' || r === 'COORDINADOR')) {
    return ['INICIAL', 'PRIMARIA', 'MEDIA_GENERAL'];
  }

  // 2. Si el usuario tiene niveles pedagógicos explícitamente configurados (ej: docente)
  if (user?.allowedLevels && user.allowedLevels.length > 0) {
    return user.allowedLevels;
  }

  // 3. Si alguno de los roles es docente pero no tiene allowedLevels especificado
  if (roles.includes('DOCENTE')) {
    // Si un administrador simula rol docente, permitir explorar todos los subsistemas educativos
    if (user && 'role' in user && (user as any).role === 'ADMINISTRADOR') {
      return ['INICIAL', 'PRIMARIA', 'MEDIA_GENERAL'];
    }
    if (user?.defaultLevel) {
      return [user.defaultLevel];
    }
    return ['MEDIA_GENERAL'];
  }

  // 4. Roles puramente operativos o de consulta no son docentes de aula
  if (roles.every(r => r === 'SECRETARIA' || r === 'REPRESENTANTE' || r === 'ESTUDIANTE')) {
    return [];
  }

  // 5. Fallback si tiene defaultLevel
  if (user?.defaultLevel) {
    return [user.defaultLevel];
  }

  return ['MEDIA_GENERAL'];
};

/**
 * Normaliza una cédula de identidad venezolana o código escolar para su uso estandarizado como username.
 * Remueve puntos, espacios, guiones y caracteres no alfanuméricos.
 * Retorna en minúsculas (ej: "V-18.452.991" -> "v18452991", "28.123.456" -> "28123456").
 */
export const normalizeCedulaUsername = (rawCedula: string): string => {
  if (!rawCedula) return '';
  return rawCedula.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
};

/**
 * Determina si una cuenta pertenece al personal institucional y posee simultáneamente
 * el rol extra de REPRESENTANTE (caso exclusivo de doble rol Personal + Representante).
 * Nota: Aplica exclusivamente a estos casos, excluyendo cuentas que no sean de personal o al administrador.
 */
export const isStaffWithRepresentativeRole = (user: AppUser | null | undefined): boolean => {
  if (!user) return false;
  if (user.role === 'ADMINISTRADOR') return false; // Administrador cuenta con simulador propio de sistema

  const staffRoles: UserRole[] = ['DOCENTE', 'SECRETARIA', 'COORDINACION', 'COORDINADOR', 'DIRECTOR'];

  // Caso 1: Su rol primario es personal institucional y tiene 'REPRESENTANTE' en sus roles adicionales
  if (staffRoles.includes(user.role) && Array.isArray(user.roles) && user.roles.includes('REPRESENTANTE')) {
    return true;
  }

  // Caso 2: Su rol primario es REPRESENTANTE y tiene un rol institucional de personal en roles adicionales
  if (user.role === 'REPRESENTANTE' && Array.isArray(user.roles) && user.roles.some(r => staffRoles.includes(r))) {
    return true;
  }

  return false;
};

/**
 * Retorna el rol laboral/institucional de personal para un usuario con doble rol (ej: DOCENTE, SECRETARIA).
 */
export const getStaffRoleForUser = (user: AppUser | null | undefined): UserRole => {
  if (!user) return 'DOCENTE';
  const staffRoles: UserRole[] = ['DOCENTE', 'SECRETARIA', 'COORDINACION', 'COORDINADOR', 'DIRECTOR'];
  if (staffRoles.includes(user.role)) return user.role;
  const match = user.roles?.find(r => staffRoles.includes(r));
  return match || 'DOCENTE';
};

/**
 * Determina si una notificación corresponde a un evento de inscripción o matriculación escolar.
 */
export const isEnrollmentNotification = (notif: Partial<SystemNotification> | null | undefined): boolean => {
  if (!notif) return false;
  if (notif.recipientRole === 'ADMIN_DIRECCION') return true;

  const title = (notif.title || '').toLowerCase();
  const msg = (notif.message || '').toLowerCase();

  // Excluir traslados de sección que no son inscripciones de nuevo ingreso
  if (title.includes('traslado') || msg.includes('trasladado')) {
    return false;
  }

  // Identificar inscripción formal o matrícula
  if (notif.actionSubTab === 'INSCRIPCIONES') {
    return true;
  }

  return title.includes('inscripci') || msg.includes('ha sido inscrito');
};

/**
 * Valida si una notificación es visible para un rol o usuario específico.
 * 
 * Regla Mandatoria Institucional:
 * Las notificaciones de inscripción escolar SOLO deben llegar a los roles de Administrador (ADMINISTRADOR) y Dirección (DIRECTOR).
 */
export const isNotificationVisibleForRole = (
  notif: SystemNotification | null | undefined,
  roleOrUser: UserRole | (Partial<AppUser> & { role?: UserRole }) | null | undefined,
  userOverride?: (Partial<AppUser> & { role?: UserRole }) | null | undefined
): boolean => {
  if (!notif || (!roleOrUser && !userOverride)) return false;

  const target = userOverride || roleOrUser;
  const effectiveRoles = getUserEffectiveRoles(target);

  // 1. Regla Mandatoria: Notificaciones de inscripción escolar son exclusivas para ADMINISTRADOR y DIRECTOR
  if (isEnrollmentNotification(notif)) {
    return effectiveRoles.some(r => r === 'ADMINISTRADOR' || r === 'DIRECTOR');
  }

  // 2. Destinatarios explícitos múltiples (array)
  if (Array.isArray(notif.recipientRoles) && notif.recipientRoles.length > 0) {
    return notif.recipientRoles.some(targetRole => effectiveRoles.includes(targetRole));
  }

  // 3. Destinatario ADMIN_DIRECCION
  if (notif.recipientRole === 'ADMIN_DIRECCION') {
    return effectiveRoles.some(r => r === 'ADMINISTRADOR' || r === 'DIRECTOR');
  }

  // 4. Destinatario global (TODOS)
  if (!notif.recipientRole || notif.recipientRole === 'TODOS') {
    return true;
  }

  // 5. Destinatario por rol específico
  return effectiveRoles.some(r => {
    if (notif.recipientRole === r) return true;
    if (notif.recipientRole === 'COORDINACION' && (r === 'COORDINACION' || r === 'COORDINADOR')) return true;
    return false;
  });
};

