export type EducationalLevel = 'INICIAL' | 'PRIMARIA' | 'MEDIA_GENERAL';

export type UserRole = 'DOCENTE' | 'COORDINACION' | 'REPRESENTANTE' | 'ESTUDIANTE';

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

export type QualitativeScore = 'C' | 'EP' | 'I'; // Consolidado, En Proceso, Iniciado (Inicial / Primaria)
export type LiteralScore = 'A' | 'B' | 'C' | 'D' | 'E'; // Literales Primaria

export interface EvaluationRecord {
  id: string;
  studentId: string;
  areaId: string;
  indicatorId?: string;
  moment: 'DIAGNOSTICA' | 'PROCESAL' | 'FINAL_LAPSO';
  lapso: 1 | 2 | 3;
  scoreNumeric?: number; // 01 - 20 (Media General)
  scoreQualitative?: QualitativeScore; // C, EP, I
  scoreLiteral?: LiteralScore;
  roboticsScore?: {
    logicSkills: QualitativeScore;
    constructionSkills: QualitativeScore;
    teamwork: QualitativeScore;
  };
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
