export type EducationalLevel = 'INICIAL' | 'PRIMARIA' | 'MEDIA_GENERAL';

export type UserRole = 'DOCENTE' | 'COORDINACION' | 'COORDINADOR' | 'DIRECTOR' | 'ADMINISTRADOR' | 'REPRESENTANTE' | 'ESTUDIANTE' | 'SECRETARIA';

export interface AppUser {
  id: string;
  username: string;
  cedula?: string;
  password?: string;
  fullName: string;
  email: string;
  role: UserRole;
  roles?: UserRole[];
  defaultLevel: EducationalLevel;
  allowedLevels?: EducationalLevel[];
  active: boolean;
  avatarUrl?: string;
  gender?: 'MASCULINO' | 'FEMENINO';
  phone?: string;
  bio?: string;
  receiveEmails?: boolean;
  receiveMessages?: boolean;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  passwordLastChanged?: string;
  academicAssignments?: AcademicAssignment[];
  grade?: string;
  section?: 'A' | 'B';
}

export interface AcademicAssignment {
  id: string;
  level: EducationalLevel;
  grade: string;
  section: 'A' | 'B';
  areaId: string;
  areaCode?: string;
  areaName?: string;
  subjectName?: string;
}

export const LEVEL_GRADES_CATALOG: Record<EducationalLevel, string[]> = {
  INICIAL: ['Sala de 3 Años', 'Sala de 4 Años', 'Sala de 5 Años'],
  PRIMARIA: ['1er Grado', '2do Grado', '3er Grado', '4to Grado', '5to Grado', '6to Grado'],
  MEDIA_GENERAL: ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año']
};

export interface RegistrationCode {
  id: string;
  code: string;
  allowedRole?: 'DOCENTE' | 'SECRETARIA';
  createdBy: string;
  createdAt: string;
  used: boolean;
  usedBy?: string;
  usedAt?: string;
  expiresAt?: string;
  durationHours?: number;
}

export type SubjectType = 'REGULAR' | 'INTEGRADA' | 'ESPECIALIZADA';

export interface SubjectArea {
  id: string;
  code: string;
  name: string;
  level: EducationalLevel;
  type: SubjectType;
  areaProfile: string;
  teacherProfile: string;
  weeklyHours: number;
  iconName: string;
}

export interface Competency {
  id: string;
  areaId: string;
  code: string;
  title: string;
  description: string;
  level: EducationalLevel;
  lapso: 1 | 2 | 3;
  grade?: string; // ej: 'Sala de 4 Años', 'Sala de 5 Años'
}

export interface Indicator {
  id: string;
  competencyId: string;
  areaId: string;
  code: string;
  description: string;
  level: EducationalLevel;
  lapso: 1 | 2 | 3;
  weight?: number; // Para Media General (ej. 20%)
  evaluationInstrument?: string;
  grade?: string; // ej: 'Sala de 4 Años', 'Sala de 5 Años'
}

export interface Strategy {
  id: string;
  areaId: string;
  name: string;
  type: 'ENSENANZA' | 'EVALUACION';
  category: string; // 'Inicio', 'Desarrollo', 'Cierre', 'Investigación', 'Digital / Robótica'
  description: string;
  resources: string;
  level: EducationalLevel;
}

export type ResourceCategory =
  | 'DEPORTIVO_PSICOMOTOR'
  | 'MANIPULATIVO_CONCRETO'
  | 'ARTISTICO_PLASTICO'
  | 'LABORATORIO_CIENTIFICO'
  | 'DIGITAL_TECNOLOGICO'
  | 'BIBLIOGRAFICO_IMPRESO'
  | 'AUDIOVISUAL_MULTIMEDIA';

export interface EducationalResource {
  id: string;
  name: string;
  category: ResourceCategory;
  areaId: string;
  level: EducationalLevel;
  description?: string;
  location?: string;
  quantity?: number;
  totalQuantity?: number;
  availableQuantity?: number;
  specifications?: string;
  isReusable?: boolean;
}

export interface DiagnosticCriterion {
  id: string;
  code: string;
  name: string;
  description: string;
  areaId: string;
  level: EducationalLevel;
  grade?: string;
  category?: string;
  criterion?: string;
  domain?: string;
  instrument?: string;
  scaleType?: string;
}

export interface ChecklistScoreItem {
  criterionId: string;
  criterionName?: string;
  criterionText?: string;
  status: 'L' | 'EP' | 'I' | 'C' | 'ED' | 'RN' | 'LOGRADO' | 'EN_PROCESO' | 'INICIADO';
  score?: number;
  notes?: string;
}

export type PlanStatus = 'BORRADOR' | 'A_REVISION' | 'DEFINITIVO';

export interface DidacticPlanRow {
  id: string;
  contenidoOReferente: string;
  aprendizajesEsperados: string;
  indicadoresCompetencia: string;
  tecnicasInstrumentos: string;
  criteriosEvaluacion: string;
  ponderacionPercent?: number; // Media General: 5% a 30%
}

export interface PlanQuincenal {
  id: string;
  areaId: string;
  level: EducationalLevel;
  gradeSection: string;
  lapso: 1 | 2 | 3;
  startDate: string;
  endDate: string;
  title: string;
  projectTheme?: string;
  status: PlanStatus;
  competencyIds: string[];
  indicatorIds: string[];
  teachingStrategyIds: string[];
  evaluationStrategyIds: string[];
  pedagogicalActivities: string;
  differentiationNotes: string;
  reviewFeedback?: string;
  reviewedBy?: string;
  updatedAt: string;
  // Campos del Formato Oficial Bellas Artes (PPTX e Instructivos)
  docenteName?: string;
  schoolYear?: string; // ej: "2026 - 2027"
  periodoQuincenal?: string; // ej: "21/09 al 02/10/2026"
  componente?: string; // Primaria e Inicial: Componente institucional
  temaGenerador?: string; // Media General: Tema Generador
  rows?: DidacticPlanRow[];
  actividadesInicio?: string;
  actividadesDesarrollo?: string;
  actividadesCierre?: string;
  recursos?: string;
  fuentesConsulta?: string;
  // Campos especializados de Formato Adaptable por Subsistema
  espaciosTrabajo?: string; // Inicial: Rincones (Construir, Representar, Expresar, Experimentar)
  rutinaDiaria?: string; // Inicial: Rutina (Llegada, Trabajo en Espacios, Orden, Aseo, Recuento)
  ejesIntegradores?: string; // Primaria: Ejes del Proyecto de Aprendizaje (PA)
  tipoProyecto?: string; // Primaria: Título o modalidad del PA
  temaIndispensable?: string; // Media General: Tema Indispensable
}

export interface LapsoEvaluationItem {
  id: string;
  title: string;
  indicatorId: string;
  weightPercent: number;
  instrument: string;
  scheduledDate: string;
  status: 'PENDIENTE' | 'APLICADA' | 'CALIFICADA';
}

export interface PlanLapso {
  id: string;
  areaId: string;
  level: EducationalLevel;
  gradeSection: string;
  lapso: 1 | 2 | 3;
  status: PlanStatus;
  generalObjective: string;
  items: LapsoEvaluationItem[];
  reviewFeedback?: string;
  updatedAt: string;
}

export type StudentStatus = 'REGULAR' | 'EN_REVISION' | 'MATERIA_PENDIENTE';

export interface ParentLegalInfo {
  parentesco: 'Madre' | 'Padre' | 'Tutor Legal' | 'Abuelo(a)';
  cedula: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  nacionalidad: 'V' | 'E';
  pais: string;
  estado: string;
  ciudad: string;
  sexo: 'MASCULINO' | 'FEMENINO';
  fechaNacimiento?: string;
  estadoCivil: 'Soltero(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viudo(a)' | 'Concubinato(a)';
  religion: string;
  telefono: string;
  correo: string;
  profesion?: string;
  direccion: string;
  isPrimaryRepresentative?: boolean;
}

export interface Student {
  id: string;
  cedula: string;
  fullName: string;
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  gender: 'M' | 'F';
  birthDate: string;
  nacionalidad?: 'V' | 'E';
  pais?: string;
  estado?: string;
  ciudad?: string;
  estadoCivil?: string;
  religion?: string;
  direccion?: string;
  telefono?: string;
  level: EducationalLevel;
  grade: string;
  section: string;
  representativeName: string;
  representativeEmail: string;
  representativePhone: string;
  status: StudentStatus;
  pendingSubjects?: string[];
  avatarUrl?: string;
  motherInfo?: ParentLegalInfo;
  fatherInfo?: ParentLegalInfo;
  alergiasSalud?: string;
}

export type QualitativeScore = 'L' | 'P' | 'EP' | 'I'; // Primaria: Logrado (L), Proceso (P / EP), Inicio (I)
export type LiteralScore = 'A' | 'B' | 'C' | 'D' | 'E'; // Inicial: Literales (A, B, C, D, E)

export const LITERAL_DESCRIPTIONS: Record<LiteralScore, { title: string; desc: string }> = {
  A: { title: 'Excelente', desc: 'Alcanzó todas las competencias y superó las expectativas del nivel.' },
  B: { title: 'Bueno', desc: 'Alcanzó todas las competencias previstas para el nivel.' },
  C: { title: 'Aceptable', desc: 'Alcanzó la mayoría de las competencias previstas para el nivel.' },
  D: { title: 'Requiere Acompañamiento', desc: 'Alcanzó algunas competencias y requiere refuerzo pedagógico.' },
  E: { title: 'No Consolidado', desc: 'No logró adquirir las competencias mínimas requeridas.' }
};

export const QUALITATIVE_DESCRIPTIONS: Record<QualitativeScore, { title: string; desc: string }> = {
  L: { title: 'Logrado', desc: 'El estudiante evidencia la adquisición y dominio autónomo de la competencia.' },
  P: { title: 'En Proceso', desc: 'El estudiante muestra avances significativos pero aún requiere consolidar la competencia.' },
  EP: { title: 'En Proceso', desc: 'El estudiante muestra avances significativos pero aún requiere consolidar la competencia.' },
  I: { title: 'Iniciado', desc: 'El estudiante se encuentra en fase inicial de exploración o requiere acompañamiento continuo.' }
};

export interface RoboticsSpecialEvaluation {
  logicSkills: QualitativeScore;
  constructionSkills: QualitativeScore;
  teamwork: QualitativeScore;
}

export interface EvaluationRecord {
  id: string;
  studentId: string;
  areaId: string;
  indicatorId?: string;
  moment: 'DIAGNOSTICA' | 'PROCESAL' | 'FINAL_LAPSO';
  lapso: 1 | 2 | 3;
  scoreNumeric?: number; // Exclusively for MEDIA_GENERAL (1..20)
  scoreLiteral?: LiteralScore; // Exclusively for INICIAL (A, B, C, D, E)
  scoreQualitative?: QualitativeScore; // Exclusively for PRIMARIA (L, P/EP, I)
  roboticsScore?: RoboticsSpecialEvaluation;
  checklistScores?: ChecklistScoreItem[];
  rasgosScore?: number; // Media General (0..20, 10% rasgos del docente)
  autoScore?: number; // Media General (0..20, 10% autoevaluación)
  coevScore?: number; // Media General (0..20, 10% coevaluación)
  observations?: string;
  recordedAt: string;
  teacherId: string;
}

export interface AIActionPlan {
  id: string;
  studentId: string;
  areaId: string;
  lapso: 1 | 2 | 3;
  diagnosticSummary: string;
  identifiedGaps: string[];
  recommendedPedagogicalActions: string[];
  suggestedResources: string[];
  teacherNotes: string;
  status: 'GENERADO' | 'EN_APLICACION' | 'SUPERADO' | 'REQUERIDO_INTERVENCION';
  createdAt: string;
  aiConfidenceScore: number;
}

export interface InterventionPlan {
  id: string;
  studentId: string;
  areaId: string;
  lapso: 1 | 2 | 3;
  teacherId: string;
  targetObjective: string;
  diagnosticDiagnosis: string;
  commitments: {
    student: string;
    representative: string;
    institution: string;
  };
  reviewDate: string;
  status: 'ACTIVO' | 'CUMPLIDO' | 'CONSEJO_CURSO';
}

export interface RemedialActionPlan {
  id: string;
  studentId: string;
  subjectName: string;
  schoolYear: string;
  teacherTutor: string;
  topicsToOvercome: string[];
  diagnosticScore: number;
  expectedActivities: string[];
  evaluationSchedule: string;
  remedialExamDate: string;
  status: 'PENDIENTE' | 'APROBADO' | 'REPROBADO';
  finalScore?: number;
}

export interface CouncilMeetingMinute {
  id: string;
  level: EducationalLevel;
  gradeSection: string;
  lapso: 1 | 2 | 3;
  meetingDate: string;
  coordinador: string;
  attendees: string[];
  agendaSummary: string;
  adjustedScores: {
    studentId: string;
    studentName: string;
    areaName: string;
    previousScore: string;
    newScore: string;
    justification: string;
  }[];
  criticalCases: string[];
  resolutions: string[];
  signed: boolean;
}

// ==========================================
// --- GESTIÓN INSTITUCIONAL SICE-CBA ---
// ==========================================

export interface PassRecord {
  id: string;
  ticketNumber: string;
  studentId: string;
  studentName: string;
  gradeSection: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm AM/PM
  reason: string;
  authorizedBy: string;
  printed: boolean;
}

export interface DailyAttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  gradeSection: string;
  date: string;
  status: 'PRESENTE' | 'INASISTENCIA_JUSTIFICADA' | 'INASISTENCIA_INJUSTIFICADA' | 'RETRASO';
  justification?: string;
  lapso: 1 | 2 | 3;
}

export interface SubjectAttendanceAccumulated {
  id: string;
  studentId: string;
  studentName: string;
  areaId: string;
  areaName: string;
  gradeSection: string;
  lapso: 1 | 2 | 3;
  totalClasses: number;
  unjustifiedAbsences: number;
  justifiedAbsences: number;
  absencePercentage: number;
  exceedsLimit: boolean; // > 25% según reglamento
}

export interface ConductEntry {
  id: string;
  studentId: string;
  studentName: string;
  gradeSection: string;
  date: string;
  lapso: 1 | 2 | 3;
  type: 'POSITIVA' | 'LEVE' | 'GRAVE' | 'MUY_GRAVE';
  description: string;
  agreements: string;
  reportedBy: string;
}

export interface DocumentRequest {
  id: string;
  trackingCode: string;
  representativeName: string;
  studentName: string;
  gradeSection: string;
  documentType: 'Constancia de Estudio' | 'Notas Certificadas' | 'Carta de Buena Conducta' | 'Solvencia Administrativa' | 'Certificación de Título';
  department: 'Control de Estudios' | 'Administración' | 'Dirección';
  requestDate: string;
  elapsedDays: number;
  status: 'PENDIENTE' | 'EN_TRAMITE' | 'LISTO_ENTREGA' | 'ENTREGADO';
  notes?: string;
}

export interface AdministrativeBlockEntry {
  id: string;
  representativeId: string;
  representativeName: string;
  studentId: string;
  studentName: string;
  gradeSection: string;
  reason: string;
  blockDate: string;
  active: boolean;
  debtAmount?: number;
  concept?: 'MATRICULA' | 'MENSUALIDAD' | 'MATERIALES' | 'RECAUDOS' | 'OTRO';
  unblockedDate?: string;
  unblockedBy?: string;
  notes?: string;
}

export interface TitleBlockLayout {
  id: string;
  label: string;
  enabled: boolean;
  xMm: number; // Distancia desde el borde izquierdo en mm
  yMm: number; // Distancia desde el borde superior en mm
  fontSizePt: number; // Tamaño de fuente en pt
  fontWeight: 'normal' | 'bold' | '900';
  letterSpacingMm: number; // Espaciado entre letras
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right';
  fontFamily: 'serif' | 'sans-serif' | 'mono';
  color: string;
  sampleTemplate: string; // Plantilla con tokens
}

export interface TitlePrintSettings {
  pageWidthMm: number; // Carta: 215.9 o Legal/Oficio: 215.9 x 355.6 o Personalizado
  pageHeightMm: number;
  orientation: 'landscape' | 'portrait';
  marginTopMm: number;
  marginLeftMm: number;
  marginRightMm: number;
  marginBottomMm: number;
  globalFontScale: number; // % escala global
  showGuidelines: boolean; // Mostrar guías de calibración milimétrica
  showBackgroundTemplate: boolean; // Mostrar u ocultar fondo de papel de seguridad escaneado para calibrar
}

export interface TitleRecord {
  id: string;
  studentId: string;
  studentName: string;
  cedula: string;
  schoolYear: string;
  graduationYear: string;
  serialNumber: string; // e.g. AB 0307994
  tomo: string;
  folio: string;
  registeredCode: string;
  calibrated: boolean;
  // Campos del formato oficial venezolano (Gaceta Oficial / MPPE)
  plantel?: string;
  codigoPlantel?: string;
  tituloMencion?: string;
  planEstudio?: string;
  planCodigo?: string;
  lugarNacimiento?: string;
  fechaNacimiento?: string;
  lugarExpedicion?: string;
  fechaExpedicion?: string;
  directorNombre?: string;
  directorCedula?: string;
  coordinadorControlEstudio?: string;
  coordinadorCedula?: string;
  funcionarioMppeNombre?: string;
  funcionarioMppeCedula?: string;
  customBlocks?: Record<string, Partial<TitleBlockLayout>>;
  printSettings?: Partial<TitlePrintSettings>;
}

export interface LapsoConfig {
  lapso: 1 | 2 | 3;
  name: string;
  startDate: string;
  endDate: string;
  isGradingOpen: boolean; // Regla de negocio oficial de bloqueo manual
  deadlineDate?: string; // Fecha límite programada (YYYY-MM-DD)
  deadlineTime?: string; // Hora límite programada (HH:mm)
  autoLockEnabled?: boolean; // Bloqueo automático programado activo
}

export interface SchoolYearConfig {
  year: string;
  isCurrent: boolean;
  lapsos: LapsoConfig[];
}

export type NoticeTheme = 
  | 'ESTANDAR'
  | 'HALLOWEEN'
  | 'NAVIDAD'
  | 'ZULIANIDAD'
  | 'CARNAVAL'
  | 'DIA_DEL_MAESTRO'
  | 'ANIVERSARIO_CBA'
  | 'PATRIO_VENEZUELA'
  | 'GLOBAL_MUNDIAL';

export type TargetAudienceRole = 
  | 'TODOS'
  | 'DIRECCION'
  | 'COORDINACION'
  | 'DOCENTES'
  | 'REPRESENTANTES'
  | 'ESTUDIANTES';

export interface CommunityNotice {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'NOTICIA' | 'ANUNCIO_URGENTE' | 'EVENTO';
  targetAudience: TargetAudienceRole;
  theme?: NoticeTheme;
  subsystem?: 'TODOS' | EducationalLevel;
  author: string;
  pinned?: boolean;
}

export interface BroadcastMessage {
  id: string;
  title: string;
  content: string;
  targetAudience: TargetAudienceRole;
  subsystem?: 'TODOS' | EducationalLevel;
  theme?: NoticeTheme;
  channel: 'SMS_Y_CORREO' | 'SOLO_CORREO' | 'SMS' | 'PORTAL';
  date: string;
  time: string;
  sender: string;
  urgent?: boolean;
}

export interface BirthdayPerson {
  id: string;
  fullName: string;
  role: 'Docente' | 'Estudiante' | 'Personal';
  gradeOrArea: string;
  birthDate: string;
  isToday: boolean;
}

export type MainNavigationTab = 
  | 'ESCRITORIO'
  | 'GESTION'
  | 'INICIAL'
  | 'PRIMARIA'
  | 'MEDIA_GENERAL'
  | 'CONSULTAS'
  | 'COMUNIDAD'
  | 'CONFIGURACION'
  | 'AYUDA';

export type NotificationCategory = 'CALIFICACIONES' | 'ASISTENCIA' | 'DOCUMENTOS' | 'INSTITUCIONAL' | 'SISTEMA';
export type NotificationDeliveryChannel = 'PORTAL' | 'EMAIL' | 'SMS_WHATSAPP';

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: NotificationCategory;
  priority: 'BAJA' | 'MEDIA' | 'ALTA';
  recipientRole: 'TODOS' | 'REPRESENTANTE' | 'ESTUDIANTE' | 'DOCENTE' | 'COORDINACION' | 'DIRECTOR' | 'ADMINISTRADOR' | 'ADMIN_DIRECCION';
  recipientRoles?: UserRole[];
  recipientName?: string;
  studentName?: string;
  actionTab?: MainNavigationTab;
  actionSubTab?: string;
  deliveryChannels: NotificationDeliveryChannel[];
}

export interface PrivilegeItem {
  nro: number;
  categoria: string;
  opcion: string;
  descripcion: string;
  habilitar: boolean;
}

export interface RolePrivilegeGroup {
  nombre: string;
  total: number;
  privilegios: PrivilegeItem[];
}

export interface SystemPrivilegesMatrix {
  roles: RolePrivilegeGroup[];
}

export type ScheduleDay = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES';

export interface ScheduleBlock {
  id: string;
  day: ScheduleDay;
  startTime: string; // ej. "07:00"
  endTime: string;   // ej. "07:45"
  periodIndex: number; // 1..8
  subjectAreaId?: string;
  subjectName: string;
  level: EducationalLevel;
  gradeSection: string; // ej. "4to Año A", "5to Grado B"
  classroom?: string;   // ej. "Aula 14", "Lab de Computación", "Cancha"
  color?: string;       // Color temático para la grilla
}

export interface UserSchedule {
  userId: string;
  userRole?: UserRole;
  schoolYear: string;   // ej. "2026 - 2027"
  blocks: ScheduleBlock[];
  updatedAt?: string;
}

export interface InstitutionalSchoolData {
  id?: string;
  nombre: string;
  dea: string;
  rif: string;
  circuito: string;
  distrito: string;
  direccion: string;
  telefono: string;
  correo: string;
  director: string;
  subdirector: string;
  supervisorCircuito?: string;
  directorFirmaUrl?: string;
  selloInstitucionalUrl?: string;
  updatedAt?: string;
}

export interface SystemCatalogs {
  id?: string;
  parentescos: string[];
  profesiones: string[];
  vacunas: string[];
  serviciosMedicos: string[];
  titulosAcademicos: string[];
  updatedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  evento: string;
  usuario: string;
  rol: string;
  fecha: string;
  ip: string;
  detalles?: string;
  createdAt?: string;
}

export interface ScheduleTypeConfig {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  horaInicio: string;
  horaFin: string;
  duracionBloqueMinutos: number;
  totalBloques: number;
  nivelesAplicables: EducationalLevel[];
  activo: boolean;
}

// ==========================================
// TALLERES CRP (CREACIÓN, RECREACIÓN Y PRODUCCIÓN)
// ==========================================
export type CRPLiteralScore = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N';

export interface CRPTaller {
  id: string;
  code: string;
  nombre: string;
  area: string; // ej. Robótica & Maker, Artes Escénicas, Música Instrumental, Huerto Escolar, etc.
  docenteResponsable: string;
  docenteId?: string;
  maxCupos: number; // Típicamente entre 20 y 25 cupos
  horario: string;
  aulaEspacio: string;
  descripcion: string;
  nivelEducativo: EducationalLevel;
  gradosPermitidos: string[]; // ej. ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año']
  activo: boolean;
}

export interface CRPEstudianteInscrito {
  id: string;
  tallerId: string;
  studentId: string;
  studentCedula: string;
  studentName: string;
  grado: string;
  seccion: string;
  fechaInscripcion: string;
  asignacionMetodo: 'MANUAL' | 'AUTOMATICA';
  calificacionMomento1?: CRPLiteralScore;
  calificacionMomento2?: CRPLiteralScore;
  calificacionPrevalente?: CRPLiteralScore;
  observaciones?: string;
}

// ==========================================
// RÉGIMEN MPPE: PRUEBAS DE REVISIÓN (JULIO)
// ==========================================
export interface RevisionEvaluationRecord {
  id: string;
  studentId: string;
  studentName?: string;
  studentCedula?: string;
  areaId: string;
  areaName?: string;
  schoolYear: string;
  grade: string;
  section: 'A' | 'B';
  revisionScore: number; // 0..20 (Mínimo aprobatorio: 10)
  passed: boolean;
  evaluatedBy: string;
  evaluatedByName?: string;
  evaluationDate: string;
  actaNumber?: string;
  observations?: string;
  createdAt?: string;
}

// ==========================================
// RÉGIMEN MPPE: MATERIA PENDIENTE (4 MOMENTOS)
// ==========================================
export interface PendingSubjectGrade {
  id: string;
  enrollmentId: string;
  momentNumber: 1 | 2 | 3 | 4;
  score?: number; // 0..20
  evaluatedAt?: string;
  notes?: string;
}

export interface PendingSubjectEnrollment {
  id: string;
  studentId: string;
  studentName?: string;
  studentCedula?: string;
  areaId: string;
  areaName?: string;
  schoolYear: string;
  originGrade: string; // Grado donde reprobó
  currentGrade: string; // Grado actual que cursa
  assignedTeacherId?: string;
  assignedTeacherName?: string;
  status: 'CURSANDO' | 'APROBADA' | 'REPROBADA';
  finalScore?: number;
  grades?: PendingSubjectGrade[];
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// TRASLADO / CAMBIO DE SECCIÓN OFICIAL (A <-> B)
// ==========================================
export interface SectionTransferLog {
  id: string;
  studentId: string;
  studentName?: string;
  studentCedula?: string;
  previousSection: 'A' | 'B';
  newSection: 'A' | 'B';
  grade: string;
  level: EducationalLevel;
  reason: string;
  transferredBy: string;
  transferredByName?: string;
  transferredAt: string;
  recordsMigratedCount?: number;
}

// ==========================================
// CALIFICACIONES EXTERNAS Y CONVALIDACIONES
// ==========================================
export interface ExternalAcademicRecord {
  id: string;
  studentId: string;
  studentName?: string;
  studentCedula?: string;
  originSchool: string;
  schoolYear: string;
  grade: string;
  subjectName: string;
  finalScore: number; // 0..20
  certifiedDocumentRef?: string;
  createdAt?: string;
}

// ==========================================
// TAREAS RECURRENTES - ADMINISTRACIÓN Y SUPERVISIÓN
// ==========================================

export type ObservationCategory = 'RENDIMIENTO' | 'ACTITUD' | 'CONVIVENCIA' | 'RECOMENDACION';

export interface BulletinObservationTemplate {
  id: string;
  level: EducationalLevel;
  category: ObservationCategory;
  code: string;
  title: string;
  text: string;
  grade?: string;
  active: boolean;
}

export type SpecializedSkillType = 'LECTOESCRITURA' | 'PROYECTO_VIDA' | 'ORIENTACION_CONVIVENCIA' | 'ACTITUDINAL';

export interface SpecializedSkillRecord {
  id: string;
  studentId: string;
  studentName?: string;
  level: EducationalLevel;
  grade: string;
  section: 'A' | 'B';
  lapso: 1 | 2 | 3;
  type: SpecializedSkillType;
  fluidezLectora?: string;
  comprensionLectora?: string;
  velocidadPpm?: number;
  caligrafiaOrtografia?: string;
  habitosTrabajo?: string;
  convivenciaSocial?: string;
  autonomiaPersonal?: string;
  proyectoVidaMetas?: string;
  orientacionConvivenciaObs?: string;
  scoreLiteral?: LiteralScore;       // Para Inicial (A, B, C, D, E)
  scoreQualitative?: QualitativeScore; // Para Primaria (L, P/EP, I)
  scoreNumeric?: number;             // Para Media General (01..20)
  observacionesGenerales?: string;
  evaluatedBy?: string;
  evaluatedAt: string;
}

export interface StrategyWeightAudit {
  areaId: string;
  areaName: string;
  grade: string;
  section: 'A' | 'B';
  lapso: 1 | 2 | 3;
  teacherName?: string;
  strategiesCount: number;
  totalWeightPercent: number; // Suma declarada de porcentajes (ej. 70% procesal o 100%)
  maxSingleWeightPercent: number; // Mayor ponderación individual asignada
  exceedsMaxLimit: boolean; // True si alguna estrategia supera el 20% normativo
  isCompliant: boolean;
  notes?: string;
}

export interface PensumComparativeReport {
  studentId: string;
  studentName: string;
  studentCedula?: string;
  grade: string;
  section: 'A' | 'B';
  lapso: 1 | 2 | 3;
  averageMppe: number; // Promedio solo asignaturas oficiales MPPE
  averageCba: number;  // Promedio pensum completo institucional CBA
  rankMppe: number;
  rankCba: number;
  passedMppeCount: number;
  failedMppeCount: number;
  passedCbaCount: number;
  failedCbaCount: number;
}



