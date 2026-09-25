export type EducationalLevel = 'INICIAL' | 'PRIMARIA' | 'MEDIA_GENERAL';

export type UserRole = 'DOCENTE' | 'COORDINACION' | 'COORDINADOR' | 'DIRECTOR' | 'ADMINISTRADOR' | 'REPRESENTANTE' | 'ESTUDIANTE' | 'ASISTENTE' | 'SECRETARIA';

export interface AppUser {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  email: string;
  role: UserRole;
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
}

export interface RegistrationCode {
  id: string;
  code: string;
  allowedRole?: 'DOCENTE' | 'ASISTENTE' | 'SECRETARIA';
  createdBy: string;
  createdAt: string;
  used: boolean;
  usedBy?: string;
  usedAt?: string;
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
  componente?: string; // Primaria: Componente institucional
  temaGenerador?: string; // Media General: Tema Generador
  rows?: DidacticPlanRow[];
  actividadesInicio?: string;
  actividadesDesarrollo?: string;
  actividadesCierre?: string;
  recursos?: string;
  fuentesConsulta?: string;
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

export interface Student {
  id: string;
  cedula: string;
  fullName: string;
  gender: 'M' | 'F';
  birthDate: string;
  level: EducationalLevel;
  grade: string;
  section: string;
  representativeName: string;
  representativeEmail: string;
  representativePhone: string;
  status: StudentStatus;
  pendingSubjects?: string[];
  avatarUrl?: string;
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
  debtAmount?: string;
}

export interface TitleRecord {
  id: string;
  studentId: string;
  studentName: string;
  cedula: string;
  schoolYear: string;
  graduationYear: string;
  serialNumber: string;
  tomo: string;
  folio: string;
  registeredCode: string;
  calibrated: boolean;
}

export interface SchoolYearConfig {
  year: string;
  isCurrent: boolean;
  lapsos: {
    lapso: 1 | 2 | 3;
    name: string;
    startDate: string;
    endDate: string;
    isGradingOpen: boolean; // Regla de negocio oficial de bloqueo: "No existen lapsos habilitados para la carga de registros"
  }[];
}

export interface CommunityNotice {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'NOTICIA' | 'ANUNCIO_URGENTE' | 'EVENTO';
  targetAudience: 'TODOS' | 'DOCENTES' | 'REPRESENTANTES' | 'ESTUDIANTES';
  author: string;
  pinned?: boolean;
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
  recipientRole: 'TODOS' | 'REPRESENTANTE' | 'ESTUDIANTE' | 'DOCENTE' | 'COORDINACION';
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

