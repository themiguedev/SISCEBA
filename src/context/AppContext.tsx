import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  EducationalLevel,
  UserRole,
  SubjectArea,
  Competency,
  Indicator,
  Strategy,
  EducationalResource,
  PlanQuincenal,
  PlanLapso,
  Student,
  EvaluationRecord,
  AIActionPlan,
  RemedialActionPlan,
  CouncilMeetingMinute,
  PlanStatus,
  QualitativeScore,
  LiteralScore,
  PassRecord,
  DailyAttendanceRecord,
  SubjectAttendanceAccumulated,
  ConductEntry,
  DocumentRequest,
  AdministrativeBlockEntry,
  TitleRecord,
  SchoolYearConfig,
  LapsoConfig,
  CommunityNotice,
  BroadcastMessage,
  BirthdayPerson,
  MainNavigationTab,
  SystemNotification,
  NotificationDeliveryChannel,
  AppUser,
  RegistrationCode,
  SystemPrivilegesMatrix,
  UserSchedule,
  ScheduleBlock,
  InstitutionalSchoolData,
  SystemCatalogs,
  AuditLogEntry,
  ScheduleTypeConfig,
  CRPTaller,
  CRPEstudianteInscrito,
  AcademicAssignment,
  RevisionEvaluationRecord,
  PendingSubjectEnrollment,
  PendingSubjectGrade,
  SectionTransferLog,
  ExternalAcademicRecord
} from '../types';
import {
  hashPassword,
  verifyPassword,
  checkRateLimit,
  recordFailedAttempt,
  resetLoginAttempts,
  is2FARequiredForRole,
  verifyTOTPCode
} from '../utils/security';
import { getDefaultAvatarForUser, decodeUserAvatarMetadata } from '../utils/avatarCatalog';
import { normalizeCedulaUsername, getUserEffectiveRoles } from '../utils/rbac';
import PRIVILEGIOS_DATA from '../data/privilegiosCEO.json';
import {
  INITIAL_AREAS,
  INITIAL_COMPETENCIES,
  INITIAL_INDICATORS,
  INITIAL_STRATEGIES,
  INITIAL_EDUCATIONAL_RESOURCES,
  INITIAL_STUDENTS,
  INITIAL_PLANS_QUINCENAL,
  INITIAL_PLANS_LAPSO,
  INITIAL_EVALUATION_RECORDS,
  INITIAL_AI_ACTION_PLANS,
  INITIAL_REMEDIAL_PLANS,
  INITIAL_COUNCIL_MINUTES,
  INITIAL_PASSES,
  INITIAL_DAILY_ATTENDANCE,
  INITIAL_ACCUMULATED_ATTENDANCE,
  INITIAL_CONDUCTS,
  INITIAL_DOCUMENT_REQUESTS,
  INITIAL_ADMIN_BLOCKS,
  INITIAL_TITLES,
  INITIAL_SCHOOL_YEAR_CONFIG,
  INITIAL_COMMUNITY_NOTICES,
  INITIAL_BIRTHDAYS,
  INITIAL_USERS,
  INITIAL_USER_SCHEDULES,
  INITIAL_SCHOOL_DATA,
  INITIAL_SYSTEM_CATALOGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SCHEDULE_TYPES,
  INITIAL_CRP_TALLERES,
  INITIAL_CRP_INSCRITOS
} from '../data/seedData';
import { supabase, isSupabaseConfigured, checkSupabaseConnection } from '../lib/supabaseClient';
import {
  supabaseFetchStudents,
  supabaseFetchSubjectAreas,
  supabaseFetchCompetencies,
  supabaseFetchIndicators,
  supabaseFetchStrategies,
  supabaseSaveStrategy,
  supabaseFetchEducationalResources,
  supabaseSaveEducationalResource,
  supabaseDeleteEducationalResource,
  supabaseFetchEvaluations,
  supabaseFetchDidacticPlans,
  supabaseFetchPasses,
  supabaseFetchDailyAttendance,
  supabaseFetchConducts,
  supabaseFetchDocumentRequests,
  supabaseFetchAdminBlocks,
  supabaseFetchTitleRecords,
  supabaseFetchCommunityNotices,
  supabaseFetchNotifications,
  supabaseFetchUsers,
  supabaseFetchPlansLapso,
  supabaseSavePlanLapso,
  supabaseFetchRegistrationCodes,
  supabaseSaveRegistrationCode,
  supabaseDeleteRegistrationCode,
  supabaseFetchSchoolYearConfig,
  supabaseSaveSchoolYearConfig,
  supabaseSaveCompetency,
  supabaseSaveIndicator,
  supabaseSaveStudent,
  supabaseSaveEvaluation,
  supabaseBulkSaveEvaluations,
  supabaseSaveDidacticPlan,
  supabaseSavePass,
  supabaseDeletePass,
  supabaseSaveDailyAttendance,
  supabaseSaveConduct,
  supabaseSaveDocumentRequest,
  supabaseSaveAdminBlock,
  supabaseDeleteAdminBlock,
  supabaseSaveTitleRecord,
  supabaseDeleteTitleRecord,
  supabaseSaveCommunityNotice,
  supabaseDeleteCommunityNotice,
  supabaseSaveNotification,
  supabaseDeleteNotification,
  supabaseMarkNotificationAsRead,
  supabaseMarkAllNotificationsAsRead,
  supabaseClearNotifications,
  supabaseSaveUser,
  supabaseDeleteUser,
  supabaseFetchPrivileges,
  supabaseSavePrivileges,
  supabaseFetchAllUserSchedules,
  supabaseSaveUserSchedule,
  supabaseFetchSchoolData,
  supabaseSaveSchoolData,
  supabaseFetchCatalogs,
  supabaseSaveCatalogs,
  supabaseFetchAuditLogs,
  supabaseSaveAuditLog,
  supabaseFetchScheduleTypes,
  supabaseSaveScheduleType,
  supabaseFetchCRPTalleres,
  supabaseSaveCRPTaller,
  supabaseDeleteCRPTaller,
  supabaseFetchCRPInscritos,
  supabaseSaveCRPInscrito,
  supabaseDeleteCRPInscrito,
  supabaseFetchRevisionEvaluations,
  supabaseSaveRevisionEvaluation,
  supabaseDeleteRevisionEvaluation,
  supabaseFetchPendingSubjects,
  supabaseSavePendingSubjectEnrollment,
  supabaseSavePendingSubjectGrade,
  supabaseDeletePendingSubjectEnrollment,
  supabaseFetchSectionTransfers,
  supabaseSaveSectionTransfer,
  supabaseFetchExternalAcademicRecords,
  supabaseSaveExternalAcademicRecord,
  supabaseDeleteExternalAcademicRecord
} from '../services/supabaseService';

interface AppContextType {
  // Navigation & Session
  isAuthenticated: boolean;
  currentUser: AppUser | null;
  users: AppUser[];
  addUser: (user: Omit<AppUser, 'id'>) => Promise<AppUser>;
  updateUser: (userId: string, updates: Partial<AppUser>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  currentTeacherAssignments: AcademicAssignment[];
  getTeacherAssignments: (teacherId: string) => AcademicAssignment[];
  saveTeacherAssignments: (teacherId: string, assignments: AcademicAssignment[]) => Promise<boolean>;
  registrationCodes: RegistrationCode[];
  createRegistrationCode: (allowedRole?: 'DOCENTE' | 'SECRETARIA', durationHours?: number) => RegistrationCode;
  deleteRegistrationCode: (codeId: string) => void;
  cleanExpiredRegistrationCodes: () => number;
  validateAndUseRegistrationCode: (code: string, role: UserRole, username: string, consume?: boolean) => Promise<{ valid: boolean; message?: string }>;
  login: (
    username: string,
    password?: string,
    totpCode?: string
  ) => Promise<{ success: boolean; message?: string; requires2FA?: boolean; userRole?: UserRole }>;
  logout: () => void;
  currentLevel: EducationalLevel;
  setCurrentLevel: (level: EducationalLevel) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  switchActiveRole: (role: UserRole) => void;
  activeLapso: 1 | 2 | 3;
  setActiveLapso: (lapso: 1 | 2 | 3) => void;
  currentSection: string;
  setCurrentSection: (section: string) => void;

  // Curricular Entities
  areas: SubjectArea[];
  levelAreas: SubjectArea[];
  competencies: Competency[];
  indicators: Indicator[];
  strategies: Strategy[];

  addCompetency: (comp: Omit<Competency, 'id'>) => Competency;
  addIndicator: (ind: Omit<Indicator, 'id'>) => Indicator;
  transferCompetency: (competencyId: string, targetLapso: 1 | 2 | 3) => void;
  transferIndicator: (indicatorId: string, targetLapso: 1 | 2 | 3) => void;
  addStrategy: (strat: Omit<Strategy, 'id'>) => Strategy;
  transferStrategy: (strategyId: string, targetAreaId: string) => void;
  educationalResources: EducationalResource[];
  addEducationalResource: (res: Omit<EducationalResource, 'id'>) => EducationalResource;
  deleteEducationalResource: (id: string) => void;
  transferEducationalResource: (resourceId: string, targetAreaId: string) => void;

  // Planning
  plansQuincenal: PlanQuincenal[];
  savePlanQuincenal: (plan: PlanQuincenal) => void;
  updateQuincenalStatus: (planId: string, status: PlanStatus, feedback?: string) => void;
  plansLapso: PlanLapso[];
  savePlanLapso: (plan: PlanLapso) => void;
  updateLapsoPlanStatus: (planId: string, status: PlanStatus, feedback?: string) => void;

  // Students & Evaluations
  students: Student[];
  levelStudents: Student[];
  addStudent: (student: Omit<Student, 'id'>) => Student;
  saveStudent: (student: Student) => void;
  evaluations: EvaluationRecord[];
  recordEvaluation: (record: Omit<EvaluationRecord, 'id' | 'recordedAt'>) => void;
  bulkRecordEvaluations: (records: Omit<EvaluationRecord, 'id' | 'recordedAt'>[]) => void;
  adjustStudentGrade: (
    studentId: string,
    areaId: string,
    oldScore: string,
    newScore: string,
    justification: string
  ) => void;

  // AI & Remedial
  aiActionPlans: AIActionPlan[];
  generateAIActionPlan: (studentId: string, areaId: string) => AIActionPlan;
  updateAIPlanFeedback: (planId: string, teacherNotes: string, status: AIActionPlan['status']) => void;
  remedialPlans: RemedialActionPlan[];
  addRemedialPlan: (plan: Omit<RemedialActionPlan, 'id'>) => void;
  updateRemedialStatus: (planId: string, status: RemedialActionPlan['status'], finalScore?: number) => void;

  // Communication & Council Minutes
  councilMinutes: CouncilMeetingMinute[];
  createCouncilMinute: (minute: Omit<CouncilMeetingMinute, 'id'>) => void;
  signCouncilMinute: (minuteId: string) => void;

  // --- Gestiones Institucionales SICE-CBA ---
  passes: PassRecord[];
  addPass: (pass: Omit<PassRecord, 'id' | 'ticketNumber'>) => PassRecord;
  deletePass: (passId: string) => void;
  printPass: (passId: string) => void;

  dailyAttendance: DailyAttendanceRecord[];
  markDailyAttendance: (studentId: string, status: DailyAttendanceRecord['status'], justification?: string) => void;
  accumulatedAttendance: SubjectAttendanceAccumulated[];

  conducts: ConductEntry[];
  addConduct: (conduct: Omit<ConductEntry, 'id'>) => ConductEntry;

  documentRequests: DocumentRequest[];
  updateDocumentStatus: (requestId: string, status: DocumentRequest['status']) => void;
  addDocumentRequest: (req: Omit<DocumentRequest, 'id' | 'trackingCode' | 'elapsedDays'>) => DocumentRequest;

  adminBlocks: AdministrativeBlockEntry[];
  addAdminBlock: (block: Omit<AdministrativeBlockEntry, 'id'>) => AdministrativeBlockEntry;
  toggleAdminBlock: (blockId: string) => void;
  deleteAdminBlock: (blockId: string) => void;
  isStudentAdminBlocked: (studentId: string) => boolean;
  getStudentAdminBlock: (studentId: string) => AdministrativeBlockEntry | undefined;

  titles: TitleRecord[];
  saveTitleRecord: (record: TitleRecord) => void;
  deleteTitleRecord: (titleId: string) => void;

  schoolYearConfig: SchoolYearConfig;
  toggleLapsoGrading: (lapso: 1 | 2 | 3) => void;
  updateLapsoConfig: (lapso: 1 | 2 | 3, updates: Partial<LapsoConfig>) => void;
  getLapsoGradingStatus: (lapso: 1 | 2 | 3) => {
    isOpen: boolean;
    isExpiredByDeadline: boolean;
    isManualClosed: boolean;
    statusText: string;
    deadlineStr: string;
  };
  isLapsoOpenForGrading: boolean;

  communityNotices: CommunityNotice[];
  addCommunityNotice: (notice: Omit<CommunityNotice, 'id'>) => CommunityNotice;
  updateCommunityNotice: (notice: CommunityNotice) => void;
  deleteCommunityNotice: (id: string) => void;

  broadcastMessages: BroadcastMessage[];
  sendBroadcastMessage: (msg: Omit<BroadcastMessage, 'id' | 'date' | 'time'> & { publishToNotices?: boolean }) => BroadcastMessage;
  deleteBroadcastMessage: (id: string) => void;

  birthdays: BirthdayPerson[];

  // Interactive Notifications System
  notifications: SystemNotification[];
  unreadNotificationsCount: number;
  sendNotification: (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // CEO Privileges Matrix (Database Connected)
  systemPrivileges: SystemPrivilegesMatrix;
  toggleSystemPrivilege: (roleName: string, privilegeNro: number) => Promise<boolean>;
  resetSystemPrivileges: () => Promise<boolean>;

  // User Schedule (Database Connected)
  userSchedules: UserSchedule[];
  currentUserSchedule: UserSchedule | null;
  saveUserSchedule: (schedule: UserSchedule) => Promise<boolean>;
  getUserSchedule: (userId: string) => UserSchedule | null;

  // School Data (Database Connected)
  schoolData: InstitutionalSchoolData;
  saveSchoolData: (data: InstitutionalSchoolData) => Promise<boolean>;

  // Catalogs (Database Connected)
  systemCatalogs: SystemCatalogs;
  saveSystemCatalogs: (catalogs: SystemCatalogs) => Promise<boolean>;

  // Audit Logs (Database Connected)
  auditLogs: AuditLogEntry[];
  addAuditLog: (evento: string, detalles?: string) => Promise<boolean>;

  // Schedule Types (Database Connected)
  scheduleTypes: ScheduleTypeConfig[];
  saveScheduleType: (item: ScheduleTypeConfig) => Promise<boolean>;

  // Talleres CRP & Calificaciones (Database Connected)
  crpTalleres: CRPTaller[];
  crpInscritos: CRPEstudianteInscrito[];
  saveCRPTaller: (taller: CRPTaller) => Promise<boolean>;
  deleteCRPTaller: (tallerId: string) => Promise<boolean>;
  saveCRPInscrito: (record: CRPEstudianteInscrito) => Promise<boolean>;
  deleteCRPInscrito: (id: string) => Promise<boolean>;
  autoAssignCRPWorkshops: (tallerIds: string[], gradoFilter?: string) => Promise<number>;

  // Régimen MPPE: Pruebas de Revisión (Reparación de Julio)
  revisionEvaluations: RevisionEvaluationRecord[];
  saveRevisionEvaluation: (rec: RevisionEvaluationRecord) => Promise<boolean>;
  deleteRevisionEvaluation: (id: string) => Promise<boolean>;

  // Régimen MPPE: Materia Pendiente (4 Momentos)
  pendingSubjectEnrollments: PendingSubjectEnrollment[];
  savePendingSubjectEnrollment: (rec: PendingSubjectEnrollment) => Promise<boolean>;
  recordPendingSubjectGrade: (enrollmentId: string, momentNumber: 1 | 2 | 3 | 4, score: number, notes?: string) => Promise<boolean>;
  deletePendingSubjectEnrollment: (id: string) => Promise<boolean>;

  // Padrón: Historial y Cambio Oficial de Sección
  sectionTransfers: SectionTransferLog[];
  transferStudentSection: (studentId: string, newSection: 'A' | 'B', reason: string) => Promise<{ success: boolean; message: string; count?: number }>;

  // Secretaría: Calificaciones Externas y Convalidaciones
  externalAcademicRecords: ExternalAcademicRecord[];
  saveExternalAcademicRecord: (rec: ExternalAcademicRecord) => Promise<boolean>;
  deleteExternalAcademicRecord: (id: string) => Promise<boolean>;

  // Helpers
  resetToSeedData: () => void;

  // Supabase Cloud State
  isSupabaseActive: boolean;
  supabaseStatusText: string;
  isSavingCloud: boolean;
  lastCloudSync: string | null;
  refreshFromSupabase: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const INITIAL_SYSTEM_NOTIFICATIONS: SystemNotification[] = INITIAL_COMMUNITY_NOTICES.map(notice => ({
  id: `notif-${notice.id}`,
  title: `Noticia: ${notice.title}`,
  message: notice.content,
  timestamp: notice.date || 'Reciente',
  read: false,
  category: 'INSTITUCIONAL',
  priority: notice.type === 'ANUNCIO_URGENTE' ? 'ALTA' : 'MEDIA',
  recipientRole: notice.targetAudience === 'DOCENTES'
    ? 'DOCENTE'
    : notice.targetAudience === 'REPRESENTANTES'
    ? 'REPRESENTANTE'
    : notice.targetAudience === 'ESTUDIANTES'
    ? 'ESTUDIANTE'
    : 'TODOS',
  recipientName: notice.author || 'Dirección CBA',
  actionTab: 'COMUNIDAD',
  actionSubTab: 'NOTICIAS',
  deliveryChannels: ['PORTAL', 'EMAIL']
}));

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User & Accounts Store
  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('sisceba_users_v3');
    if (saved) {
      try {
        const parsed: AppUser[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('sisceba_current_user');
    const auth = localStorage.getItem('sisceba_auth_session');
    if (auth === 'true' && saved) {
      try {
        const u = JSON.parse(saved);
        if (u.id === 'usr-admin' || u.fullName === 'Administrador General de Sistemas') {
          u.fullName = 'Administrador';
        }
        return u;
      } catch {
        return null;
      }
    }
    return null;
  });

  // Session States
  const [currentLevel, setCurrentLevel] = useState<EducationalLevel>(() => {
    const saved = localStorage.getItem('sisceba_current_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.defaultLevel) return u.defaultLevel;
      } catch { /* ignore */ }
    }
    return 'MEDIA_GENERAL';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const savedActiveRole = localStorage.getItem('sisceba_active_role');
    const saved = localStorage.getItem('sisceba_current_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (savedActiveRole) {
          const effective = getUserEffectiveRoles(u);
          if (effective.includes(savedActiveRole as UserRole) || u.role === 'ADMINISTRADOR') {
            return savedActiveRole as UserRole;
          }
        }
        if (u.role) return u.role;
      } catch { /* ignore */ }
    }
    return 'DOCENTE';
  });

  const switchActiveRole = (newRole: UserRole) => {
    if (!currentUser) {
      setCurrentRole(newRole);
      return;
    }
    const effectiveRoles = getUserEffectiveRoles(currentUser);
    const isAllowed = currentUser.role === 'ADMINISTRADOR' || effectiveRoles.includes(newRole);
    if (!isAllowed) {
      console.warn(`switchActiveRole: El usuario ${currentUser.username} no tiene asignado el rol ${newRole}.`);
      return;
    }
    setCurrentRole(newRole);
    try {
      localStorage.setItem('sisceba_active_role', newRole);
    } catch {
      // Ignorar error de storage
    }
  };

  const [activeLapso, setActiveLapso] = useState<1 | 2 | 3>(1);
  const [currentSection, setCurrentSection] = useState<string>('4to Año A');

  // Authentication & Session States with 10-minute inactivity timeout (600,000 ms)
  const SESSION_INACTIVITY_LIMIT_MS = 10 * 60 * 1000;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('sisceba_auth_session');
    const user = localStorage.getItem('sisceba_current_user');
    const lastActiveStr = localStorage.getItem('sisceba_last_activity');

    if (saved === 'true' && !!user) {
      if (lastActiveStr) {
        const lastActiveTime = parseInt(lastActiveStr, 10);
        if (!isNaN(lastActiveTime) && Date.now() - lastActiveTime > SESSION_INACTIVITY_LIMIT_MS) {
          // Sesión expirada por inactividad previa
          localStorage.setItem('sisceba_auth_session', 'false');
          localStorage.removeItem('sisceba_current_user');
          localStorage.removeItem('sisceba_last_activity');
          sessionStorage.setItem('sisceba_inactivity_logout', 'true');
          return false;
        }
      }
      return true;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('sisceba_users_v3', JSON.stringify(users));
  }, [users]);

  const addUser = async (userData: Omit<AppUser, 'id'>): Promise<AppUser> => {
    // Si la contraseña fue provista en texto plano, hashearla criptográficamente
    let securePassword = userData.password;
    if (securePassword && !securePassword.startsWith('$pbkdf2$')) {
      securePassword = await hashPassword(securePassword);
    }

    const assignedAvatar = userData.avatarUrl || getDefaultAvatarForUser({
      gender: userData.gender,
      role: userData.role,
      fullName: userData.fullName
    });

    const newUser: AppUser = {
      ...userData,
      avatarUrl: assignedAvatar,
      password: securePassword,
      passwordLastChanged: new Date().toISOString(),
      twoFactorEnabled: is2FARequiredForRole(userData.role),
      twoFactorSecret: is2FARequiredForRole(userData.role) ? 'CBA-SECURE-2FA-SEED' : undefined,
      id: `usr-${Date.now()}`
    };
    setUsers(prev => [newUser, ...prev]);
    await supabaseSaveUser(newUser);
    return newUser;
  };

  const updateUser = async (userId: string, updates: Partial<AppUser>): Promise<boolean> => {
    // Si se actualizó la contraseña y no está hasheada, procesar
    let cleanUpdates = { ...updates };
    if (cleanUpdates.password && !cleanUpdates.password.startsWith('$pbkdf2$')) {
      cleanUpdates.password = await hashPassword(cleanUpdates.password);
      cleanUpdates.passwordLastChanged = new Date().toISOString();
    }

    // Localizar usuario base de manera síncrona
    const currentTarget = users.find(u => u.id === userId) || (currentUser?.id === userId ? currentUser : null);
    if (!currentTarget) {
      console.warn(`updateUser: Usuario con id ${userId} no encontrado en memoria.`);
      return false;
    }

    // Si cambia de género y no tiene imagen propia personalizada o tiene avatar svg previo, adaptar avatar
    let newAvatarUrl = cleanUpdates.avatarUrl !== undefined ? cleanUpdates.avatarUrl : currentTarget.avatarUrl;
    if (cleanUpdates.gender && cleanUpdates.gender !== currentTarget.gender && (!newAvatarUrl || newAvatarUrl.startsWith('data:image/svg+xml'))) {
      newAvatarUrl = getDefaultAvatarForUser({
        gender: cleanUpdates.gender,
        role: cleanUpdates.role || currentTarget.role,
        fullName: cleanUpdates.fullName || currentTarget.fullName
      });
    }

    const mergedUser: AppUser = {
      ...currentTarget,
      ...cleanUpdates,
      avatarUrl: newAvatarUrl
    };

    // Actualizar el array global de usuarios en memoria y caché
    setUsers(prev => {
      const idx = prev.findIndex(u => u.id === userId);
      if (idx === -1) return [mergedUser, ...prev];
      const copy = [...prev];
      copy[idx] = mergedUser;
      return copy;
    });

    // Actualizar usuario actual si corresponde
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(mergedUser);
      localStorage.setItem('sisceba_current_user', JSON.stringify(mergedUser));
      if (cleanUpdates.role) {
        setCurrentRole(cleanUpdates.role);
      }
      if (cleanUpdates.defaultLevel) {
        setCurrentLevel(cleanUpdates.defaultLevel);
      }
    }

    // Persistir de inmediato en la base de datos de Supabase y notificar sincronización
    if (isSupabaseConfigured()) {
      const saved = await syncWithCloud(() => supabaseSaveUser(mergedUser), 'actualizar perfil de usuario');
      return saved !== null && saved !== false;
    }

    return true;
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    if (!userId || userId === 'usr-admin') {
      console.warn('deleteUser: No se puede eliminar la cuenta principal del Administrador.');
      return false;
    }

    setUsers(prev => prev.filter(u => u.id !== userId));

    if (isSupabaseConfigured()) {
      const deleted = await syncWithCloud(() => supabaseDeleteUser(userId), 'eliminar usuario');
      return deleted !== null && deleted !== false;
    }

    return true;
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sisceba_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sisceba_current_user');
    }
  }, [currentUser]);

  // Carga y Asignaciones Académicas Oficiales para Docentes
  const getTeacherAssignments = (teacherId: string): AcademicAssignment[] => {
    const user = users.find(u => u.id === teacherId) || (currentUser?.id === teacherId ? currentUser : null);
    return Array.isArray(user?.academicAssignments) ? user.academicAssignments : [];
  };

  const saveTeacherAssignments = async (teacherId: string, assignments: AcademicAssignment[]): Promise<boolean> => {
    return await updateUser(teacherId, { academicAssignments: assignments });
  };

  const currentTeacherAssignments: AcademicAssignment[] = Array.isArray(currentUser?.academicAssignments)
    ? currentUser.academicAssignments
    : [];

  // Códigos de Autorización de Registro emitidos por el Administrador
  const [registrationCodes, setRegistrationCodes] = useState<RegistrationCode[]>(() => {
    const saved = localStorage.getItem('sisceba_registration_codes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* ignore */
      }
    }
    // Códigos iniciales activos de conveniencia para la institución
    return [
      {
        id: 'code-init-1',
        code: 'CBA-DOC-2026',
        allowedRole: 'DOCENTE',
        createdBy: 'admin',
        createdAt: '2026-09-23T00:00:00.000Z',
        used: false
      },
      {
        id: 'code-init-3',
        code: 'CBA-SEC-2026',
        allowedRole: 'SECRETARIA',
        createdBy: 'admin',
        createdAt: '2026-09-23T00:00:00.000Z',
        used: false
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('sisceba_registration_codes', JSON.stringify(registrationCodes));
  }, [registrationCodes]);

  useEffect(() => {
    const now = Date.now();
    const hasExpired = registrationCodes.some(c => c.expiresAt && new Date(c.expiresAt).getTime() < now);
    if (hasExpired) {
      cleanExpiredRegistrationCodes();
    }
  }, []);

  const createRegistrationCode = (
    allowedRole?: 'DOCENTE' | 'SECRETARIA',
    durationHours: number = 48
  ): RegistrationCode => {
    const rolePrefix = allowedRole ? allowedRole.slice(0, 3) : 'REG';
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationHours * 3600 * 1000).toISOString();

    const newCode: RegistrationCode = {
      id: `code-${Date.now()}`,
      code: `CBA-${rolePrefix}-${randomHex}`,
      allowedRole,
      createdBy: currentUser?.username || 'admin',
      createdAt: now.toISOString(),
      used: false,
      expiresAt,
      durationHours
    };

    setRegistrationCodes(prev => [newCode, ...prev]);
    supabaseSaveRegistrationCode(newCode).catch(err => console.warn('Supabase save code err:', err));
    return newCode;
  };

  const deleteRegistrationCode = (codeId: string) => {
    setRegistrationCodes(prev => prev.filter(c => c.id !== codeId));
    supabaseDeleteRegistrationCode(codeId).catch(err => console.warn('Supabase delete code err:', err));
  };

  const cleanExpiredRegistrationCodes = (): number => {
    const now = Date.now();
    let cleanedCount = 0;
    const toDeleteIds: string[] = [];

    setRegistrationCodes(prev => {
      const active = prev.filter(c => {
        if (c.expiresAt && new Date(c.expiresAt).getTime() < now) {
          cleanedCount++;
          toDeleteIds.push(c.id);
          return false;
        }
        return true;
      });
      return active;
    });

    toDeleteIds.forEach(id => {
      supabaseDeleteRegistrationCode(id).catch(err => console.warn('Supabase purge code err:', err));
    });

    return cleanedCount;
  };

  const validateAndUseRegistrationCode = async (
    code: string,
    role: UserRole,
    username: string,
    consume: boolean = true
  ): Promise<{ valid: boolean; message?: string }> => {
    // Normalización: remover espacios y guiones para comparación flexible si aplica
    const normalizedInput = code.trim().toUpperCase();
    
    // Master fallback codes para auditoría, soporte y pruebas del administrador
    const MASTER_CODES = ['CBA-MASTER-2026', 'CBA-ADMIN-2026', 'CBA-DOC-2026', 'CBA-SEC-2026', 'CBA2026', 'CBAMASTER2026'];
    if (MASTER_CODES.includes(normalizedInput)) {
      if ((normalizedInput === 'CBA-DOC-2026' || normalizedInput === 'CBADOC2026') && role !== 'DOCENTE') {
        return { valid: false, message: 'El código CBA-DOC-2026 es exclusivo para el rol de DOCENTE.' };
      }
      if ((normalizedInput === 'CBA-SEC-2026' || normalizedInput === 'CBASEC2026') && role !== 'SECRETARIA') {
        return { valid: false, message: 'El código CBA-SEC-2026 es exclusivo para el rol de SECRETARIA.' };
      }
      return { valid: true };
    }

    // 1. Buscar primero en memoria local
    let matched = registrationCodes.find(
      c => c.code.trim().toUpperCase() === normalizedInput
    );

    // 2. Si no se encuentra en memoria, buscar en localStorage directamente por si hubo desincronización
    if (!matched) {
      try {
        const stored = localStorage.getItem('sisceba_registration_codes');
        if (stored) {
          const parsedCodes: RegistrationCode[] = JSON.parse(stored);
          matched = parsedCodes.find(c => c.code.trim().toUpperCase() === normalizedInput);
        }
      } catch {
        /* ignore */
      }
    }

    // 3. Si no se encuentra pero Supabase/PostgreSQL está activo, consultar la BD directamente en tiempo real
    if (!matched && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('registration_codes')
          .select('*')
          .ilike('code', normalizedInput)
          .limit(1);

        if (!error && data && data.length > 0) {
          const row = data[0];
          matched = {
            id: row.id,
            code: row.code,
            allowedRole: row.allowed_role,
            createdBy: row.created_by,
            createdAt: row.created_at,
            used: row.used ?? false,
            usedBy: row.used_by,
            usedAt: row.used_at,
            expiresAt: row.expires_at,
            durationHours: row.duration_hours
          };
        }
      } catch (err) {
        console.warn('Error validando código de registro en base de datos:', err);
      }
    }

    if (!matched) {
      return {
        valid: false,
        message: 'El código de autorización ingresado no es válido o ya fue utilizado.'
      };
    }

    if (matched.used) {
      // Si ya estaba marcado como usado, se remueve inmediatamente para evitar reuso
      setRegistrationCodes(prev => prev.filter(c => c.id !== matched!.id));
      supabaseDeleteRegistrationCode(matched.id).catch(err => console.warn('Supabase delete code err:', err));
      return {
        valid: false,
        message: `Este código de autorización ya fue utilizado previamente y ha sido revocado.`
      };
    }

    // Verificación de caducidad temporal por plazo límite
    if (matched.expiresAt) {
      const expirationDate = new Date(matched.expiresAt);
      if (Date.now() > expirationDate.getTime()) {
        // Código caducado: invalidar y depurar inmediatamente
        setRegistrationCodes(prev => prev.filter(c => c.id !== matched!.id));
        supabaseDeleteRegistrationCode(matched.id).catch(err => console.warn('Supabase delete expired code err:', err));
        return {
          valid: false,
          message: `Este código de autorización ha caducado por límite de tiempo (venció el ${expirationDate.toLocaleDateString()} a las ${expirationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}). Solicite un nuevo código a la Administración.`
        };
      }
    }

    if (matched.allowedRole && matched.allowedRole !== role && role !== 'ADMINISTRADOR') {
      return {
        valid: false,
        message: `Este código solo es válido para el rol de ${matched.allowedRole}. Su rol seleccionado es ${role}.`
      };
    }

    // Si solo es pre-validación de comprobación, no consumir todavía el código
    if (!consume) {
      return { valid: true };
    }

    // Código de un solo uso: Al ser detectado y validado satisfactoriamente, se elimina de inmediato
    setRegistrationCodes(prev => prev.filter(c => c.id !== matched!.id));
    supabaseDeleteRegistrationCode(matched.id).catch(err => console.warn('Supabase delete code err:', err));

    return { valid: true };
  };

  const login = async (
    userInput: string,
    password?: string,
    totpCode?: string
  ): Promise<{ success: boolean; message?: string; requires2FA?: boolean; userRole?: UserRole }> => {
    const trimmedInput = userInput.trim().toLowerCase();

    // 1. Defensa contra fuerza bruta (Rate Limiting)
    const rateCheck = checkRateLimit(trimmedInput);
    if (!rateCheck.allowed) {
      return {
        success: false,
        message: `Cuenta bloqueada temporalmente por múltiples intentos fallidos. Intente nuevamente en ${rateCheck.remainingSeconds} segundos.`
      };
    }

    const normalizedCedulaInput = normalizeCedulaUsername(userInput);

    let matched = users.find(
      u =>
        u.username.toLowerCase() === trimmedInput ||
        u.email.toLowerCase() === trimmedInput ||
        (normalizedCedulaInput && normalizeCedulaUsername(u.username) === normalizedCedulaInput)
    );

    // Si Supabase está configurado, validamos directamente contra la tabla app_users en tiempo real
    if (isSupabaseConfigured()) {
      try {
        const queryFilter = normalizedCedulaInput && normalizedCedulaInput !== trimmedInput
          ? `username.ilike.${trimmedInput},email.ilike.${trimmedInput},username.ilike.${normalizedCedulaInput}`
          : `username.ilike.${trimmedInput},email.ilike.${trimmedInput}`;

        const { data, error } = await supabase
          .from('app_users')
          .select('*')
          .or(queryFilter)
          .limit(1);

        if (!error && data && data.length > 0) {
          const row = data[0];
          const meta = decodeUserAvatarMetadata(row.avatar_url);
          const effectiveRole = (meta.role as UserRole) || row.role;
          matched = {
            id: row.id,
            username: row.username,
            password: row.password,
            fullName: row.full_name,
            email: row.email,
            role: effectiveRole,
            roles: (meta.roles as UserRole[]) || undefined,
            defaultLevel: row.default_level || 'MEDIA_GENERAL',
            allowedLevels: (meta.allowedLevels as EducationalLevel[]) || undefined,
            active: row.active ?? true,
            avatarUrl: meta.avatarUrl || row.avatar_url || '',
            gender: meta.gender,
            phone: meta.phone,
            bio: meta.bio,
            receiveEmails: meta.receiveEmails ?? true,
            receiveMessages: meta.receiveMessages ?? true,
            twoFactorEnabled: row.two_factor_enabled ?? is2FARequiredForRole(effectiveRole),
            twoFactorSecret: row.two_factor_secret,
            passwordLastChanged: row.password_last_changed
          };
          // Actualizar en el estado local de usuarios
          setUsers(prev => {
            const idx = prev.findIndex(
              u =>
                u.id === matched!.id ||
                u.username.toLowerCase() === row.username.toLowerCase() ||
                u.email.toLowerCase() === row.email.toLowerCase()
            );
            if (idx >= 0) {
              const copy = [...prev];
              copy[idx] = matched!;
              return copy;
            }
            return [...prev, matched!];
          });
        } else if (!error && (!data || data.length === 0)) {
          // El usuario definitivamente NO existe en la base de datos de Supabase
          matched = undefined;
        }
      } catch (err) {
        console.warn('Error verificando usuario en Supabase:', err);
      }
    }

    // Regla estricta: Solo cuentas registradas en la base de datos
    if (!matched) {
      recordFailedAttempt(trimmedInput);
      return {
        success: false,
        message: 'Usuario o correo no registrado en la base de datos institucional de SICE-CBA.'
      };
    }

    // Comprobación de estado activo
    if (!matched.active) {
      return {
        success: false,
        message: 'Esta cuenta institucional ha sido desactivada por Dirección.'
      };
    }

    // 2. Validación de contraseña con Hashing Criptográfico y Auto-migración
    if (matched.password) {
      if (!password) {
        recordFailedAttempt(trimmedInput);
        return {
          success: false,
          message: 'Por favor ingrese su contraseña.'
        };
      }

      const verifyResult = await verifyPassword(password, matched.password);
      if (!verifyResult.valid) {
        const attempt = recordFailedAttempt(trimmedInput);
        if (attempt.isBlocked) {
          return {
            success: false,
            message: `Demasiados intentos fallidos. Su acceso ha sido bloqueado preventivamente durante 15 minutos.`
          };
        }
        return {
          success: false,
          message: `Contraseña incorrecta. Le quedan ${attempt.remainingAttempts} intento(s) antes del bloqueo temporal.`
        };
      }

      // Si la contraseña estaba en texto plano, migrarla de inmediato a hash seguro
      if (verifyResult.needsMigration) {
        try {
          const newHashed = await hashPassword(password);
          matched.password = newHashed;
          matched.passwordLastChanged = new Date().toISOString();
          setUsers(prev => prev.map(u => (u.id === matched!.id ? { ...matched! } : u)));
          supabaseSaveUser(matched).catch(err => console.warn('Auto-migración hash en Supabase err:', err));
          console.info(`[DevSecOps] Contraseña de usuario ${matched.username} migrada transparentemente a PBKDF2/SHA-256.`);
        } catch (e) {
          console.warn('Fallo en rutina de auto-migración de contraseña:', e);
        }
      }
    }

    // Éxito: Resetear intentos fallidos y establecer sesión
    resetLoginAttempts(trimmedInput);
    setCurrentUser(matched);
    const savedActiveRole = localStorage.getItem('sisceba_active_role');
    const effectiveRoles = getUserEffectiveRoles(matched);
    const initialRole = (savedActiveRole && (effectiveRoles.includes(savedActiveRole as UserRole) || matched.role === 'ADMINISTRADOR'))
      ? (savedActiveRole as UserRole)
      : matched.role;
    setCurrentRole(initialRole);
    setCurrentLevel(matched.defaultLevel);
    setIsAuthenticated(true);
    const now = Date.now().toString();
    localStorage.setItem('sisceba_auth_session', 'true');
    localStorage.setItem('sisceba_current_user', JSON.stringify(matched));
    localStorage.setItem('sisceba_last_activity', now);
    sessionStorage.removeItem('sisceba_inactivity_logout');
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.setItem('sisceba_auth_session', 'false');
    localStorage.removeItem('sisceba_current_user');
    localStorage.removeItem('sisceba_last_activity');
    localStorage.removeItem('sisceba_active_role');
  };

  // Monitor de Inactividad de Sesión (Cierre automático tras 15 minutos sin interacción)
  useEffect(() => {
    if (!isAuthenticated) return;

    // Actualiza la marca de tiempo de última interacción
    const updateActivity = () => {
      localStorage.setItem('sisceba_last_activity', Date.now().toString());
    };

    // Registrar eventos comunes de interacción del usuario (con throttle)
    let lastRecorded = 0;
    const handleUserInteraction = () => {
      const now = Date.now();
      // Registrar como máximo una vez cada 10 segundos para preservar rendimiento 60 FPS
      if (now - lastRecorded > 10000) {
        lastRecorded = now;
        updateActivity();
      }
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(evt => window.addEventListener(evt, handleUserInteraction, { passive: true }));

    // Verificación periódica cada 15 segundos para comprobar si transcurrieron los 15 minutos
    const intervalId = setInterval(() => {
      const lastActiveStr = localStorage.getItem('sisceba_last_activity');
      if (lastActiveStr) {
        const lastActiveTime = parseInt(lastActiveStr, 10);
        if (!isNaN(lastActiveTime) && Date.now() - lastActiveTime >= SESSION_INACTIVITY_LIMIT_MS) {
          console.warn('[Seguridad SICE-CBA] Sesión cerrada automáticamente por inactividad (10 minutos sin interacción).');
          sessionStorage.setItem('sisceba_inactivity_logout', 'true');
          logout();
        }
      }
    }, 15000);

    return () => {
      events.forEach(evt => window.removeEventListener(evt, handleUserInteraction));
      clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  // Synchronize section when level changes
  useEffect(() => {
    if (currentLevel === 'INICIAL') {
      setCurrentSection('Sala de 5 Años A');
    } else if (currentLevel === 'PRIMARIA') {
      setCurrentSection('5to Grado A');
    } else {
      setCurrentSection('4to Año A');
    }
  }, [currentLevel]);

  // Supabase Cloud State
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(false);
  const [supabaseStatusText, setSupabaseStatusText] = useState<string>('Modo Local / Autónomo');
  const [isSavingCloud, setIsSavingCloud] = useState<boolean>(false);
  const [lastCloudSync, setLastCloudSync] = useState<string | null>(() => {
    return localStorage.getItem('sisceba_last_cloud_sync') || null;
  });

  // Helper centralizado para ejecutar operaciones en segundo plano y registrar sincronización inmediata
  const syncWithCloud = async <T,>(operation: () => Promise<T>, label?: string): Promise<T | null> => {
    if (!isSupabaseConfigured()) return null;
    setIsSavingCloud(true);
    try {
      const result = await operation();
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastCloudSync(now);
      localStorage.setItem('sisceba_last_cloud_sync', now);
      return result;
    } catch (err) {
      console.warn(`Aviso al sincronizar en la nube (${label || 'operación'}):`, err);
      return null;
    } finally {
      setTimeout(() => setIsSavingCloud(false), 800);
    }
  };

  // Data Store with LocalStorage Persistence
  const [areas, setAreas] = useState<SubjectArea[]>(() => {
    const saved = localStorage.getItem('sisceba_areas');
    return saved ? JSON.parse(saved) : INITIAL_AREAS;
  });

  // Privilegios CEO del Sistema (Conexión Directa con la BD)
  const [systemPrivileges, setSystemPrivileges] = useState<SystemPrivilegesMatrix>(() => {
    const saved = localStorage.getItem('sisceba_system_privileges_cache');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.roles && parsed.roles.length > 0) return parsed;
      } catch {
        /* fallback to seed */
      }
    }
    return PRIVILEGIOS_DATA as SystemPrivilegesMatrix;
  });

  // Horarios de Usuarios (Conexión Directa con la BD)
  const [userSchedules, setUserSchedules] = useState<UserSchedule[]>(() => {
    const saved = localStorage.getItem('sisceba_user_schedules_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* fallback */
      }
    }
    return INITIAL_USER_SCHEDULES;
  });

  // Datos Institucionales de la Escuela (Conexión Directa con la BD)
  const [schoolData, setSchoolData] = useState<InstitutionalSchoolData>(() => {
    const saved = localStorage.getItem('sisceba_school_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { /* fallback */ }
    }
    return INITIAL_SCHOOL_DATA;
  });

  // Catálogos Oficiales del Sistema (Conexión Directa con la BD)
  const [systemCatalogs, setSystemCatalogs] = useState<SystemCatalogs>(() => {
    const saved = localStorage.getItem('sisceba_catalogs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { /* fallback */ }
    }
    return INITIAL_SYSTEM_CATALOGS;
  });

  // Bitácora de Auditoría (Conexión Directa con la BD)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('sisceba_audit_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { /* fallback */ }
    }
    return INITIAL_AUDIT_LOGS;
  });

  // Tipos de Horarios (Conexión Directa con la BD)
  const [scheduleTypes, setScheduleTypes] = useState<ScheduleTypeConfig[]>(() => {
    const saved = localStorage.getItem('sisceba_schedule_types');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { /* fallback */ }
    }
    return INITIAL_SCHEDULE_TYPES;
  });

  // Talleres CRP & Inscripciones (Conexión Directa con la BD)
  const [crpTalleres, setCrpTalleres] = useState<CRPTaller[]>(() => {
    const saved = localStorage.getItem('sisceba_crp_talleres');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { /* fallback */ }
    }
    return INITIAL_CRP_TALLERES;
  });

  const [crpInscritos, setCrpInscritos] = useState<CRPEstudianteInscrito[]>(() => {
    const saved = localStorage.getItem('sisceba_crp_inscritos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { /* fallback */ }
    }
    return INITIAL_CRP_INSCRITOS;
  });

  // Pruebas de Revisión de Julio (Media General)
  const [revisionEvaluations, setRevisionEvaluations] = useState<RevisionEvaluationRecord[]>(() => {
    const saved = localStorage.getItem('sisceba_revision_evaluations');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return [];
  });

  // Materia Pendiente (4 Momentos)
  const [pendingSubjectEnrollments, setPendingSubjectEnrollments] = useState<PendingSubjectEnrollment[]>(() => {
    const saved = localStorage.getItem('sisceba_pending_subjects');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return [];
  });

  // Historial de Traslado / Cambio de Sección Oficial
  const [sectionTransfers, setSectionTransfers] = useState<SectionTransferLog[]>(() => {
    const saved = localStorage.getItem('sisceba_section_transfers');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return [];
  });

  // Calificaciones Externas y Convalidaciones
  const [externalAcademicRecords, setExternalAcademicRecords] = useState<ExternalAcademicRecord[]>(() => {
    const saved = localStorage.getItem('sisceba_external_academic_records');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return [];
  });

  const refreshFromSupabase = async () => {
    if (!isSupabaseConfigured()) {
      setIsSupabaseActive(false);
      setSupabaseStatusText('Modo Local / Autónomo');
      return;
    }

    setSupabaseStatusText('Conectando a la Base de Datos...');
    const health = await checkSupabaseConnection();
    if (!health.connected) {
      setIsSupabaseActive(false);
      setSupabaseStatusText('Modo Local (Base de datos desconectada)');
      return;
    }

    setIsSupabaseActive(true);
    setSupabaseStatusText('Base de Datos Conectada (Local/Red)');

    try {
      const [
        remoteStudents,
        remoteAreas,
        remoteCompetencies,
        remoteIndicators,
        remoteStrategies,
        remoteResources,
        remoteEvaluations,
        remotePlans,
        remotePasses,
        remoteAttendance,
        remoteConducts,
        remoteDocs,
        remoteBlocks,
        remoteTitles,
        remoteNotices,
        remoteNotifications,
        remoteUsers,
        remotePlansLapso,
        remoteCodes,
        remoteSchoolYear,
        remotePrivileges,
        remoteSchedules,
        remoteSchoolData,
        remoteCatalogs,
        remoteAuditLogs,
        remoteScheduleTypes,
        remoteTalleres,
        remoteInscritos,
        remoteRevisionEvals,
        remotePendingSubs,
        remoteSectionTransfers,
        remoteExternalRecords
      ] = await Promise.all([
        supabaseFetchStudents(),
        supabaseFetchSubjectAreas(),
        supabaseFetchCompetencies(),
        supabaseFetchIndicators(),
        supabaseFetchStrategies(),
        supabaseFetchEducationalResources(),
        supabaseFetchEvaluations(),
        supabaseFetchDidacticPlans(),
        supabaseFetchPasses(),
        supabaseFetchDailyAttendance(),
        supabaseFetchConducts(),
        supabaseFetchDocumentRequests(),
        supabaseFetchAdminBlocks(),
        supabaseFetchTitleRecords(),
        supabaseFetchCommunityNotices(),
        supabaseFetchNotifications(),
        supabaseFetchUsers(),
        supabaseFetchPlansLapso(),
        supabaseFetchRegistrationCodes(),
        supabaseFetchSchoolYearConfig(),
        supabaseFetchPrivileges(),
        supabaseFetchAllUserSchedules(),
        supabaseFetchSchoolData(),
        supabaseFetchCatalogs(),
        supabaseFetchAuditLogs(),
        supabaseFetchScheduleTypes(),
        supabaseFetchCRPTalleres(),
        supabaseFetchCRPInscritos(),
        supabaseFetchRevisionEvaluations(),
        supabaseFetchPendingSubjects(),
        supabaseFetchSectionTransfers(),
        supabaseFetchExternalAcademicRecords()
      ]);

      if (remoteStudents !== null) setStudents(remoteStudents);
      if (remoteAreas !== null) setAreas(remoteAreas);
      if (remoteCompetencies !== null) setCompetencies(remoteCompetencies);
      if (remoteIndicators !== null) setIndicators(remoteIndicators);
      if (remoteStrategies !== null) setStrategies(remoteStrategies);
      if (remoteResources !== null) setEducationalResources(remoteResources);
      if (remoteEvaluations !== null) setEvaluations(remoteEvaluations);
      if (remotePlans !== null) setPlansQuincenal(remotePlans);
      if (remotePlansLapso !== null) setPlansLapso(remotePlansLapso);
      if (remoteCodes !== null && remoteCodes.length > 0) {
        setRegistrationCodes(remoteCodes);
      }
      if (remoteSchoolYear !== null) setSchoolYearConfig(remoteSchoolYear);
      if (remotePrivileges !== null) {
        setSystemPrivileges(remotePrivileges);
        localStorage.setItem('sisceba_system_privileges_cache', JSON.stringify(remotePrivileges));
      }
      if (remoteSchedules !== null) {
        setUserSchedules(prev => {
          if (remoteSchedules.length === 0) return prev;
          // Merge remote schedules by userId
          const map = new Map<string, UserSchedule>();
          prev.forEach(s => map.set(s.userId, s));
          remoteSchedules.forEach(s => map.set(s.userId, s));
          const merged = Array.from(map.values());
          localStorage.setItem('sisceba_user_schedules_v2', JSON.stringify(merged));
          return merged;
        });
      }
      if (remoteSchoolData !== null) {
        setSchoolData(remoteSchoolData);
        localStorage.setItem('sisceba_school_data', JSON.stringify(remoteSchoolData));
      }
      if (remoteCatalogs !== null) {
        setSystemCatalogs(remoteCatalogs);
        localStorage.setItem('sisceba_catalogs', JSON.stringify(remoteCatalogs));
      }
      if (remoteAuditLogs !== null && remoteAuditLogs.length > 0) {
        setAuditLogs(remoteAuditLogs);
        localStorage.setItem('sisceba_audit_logs', JSON.stringify(remoteAuditLogs));
      }
      if (remoteScheduleTypes !== null && remoteScheduleTypes.length > 0) {
        setScheduleTypes(remoteScheduleTypes);
        localStorage.setItem('sisceba_schedule_types', JSON.stringify(remoteScheduleTypes));
      }
      if (remoteTalleres !== null) {
        setCrpTalleres(remoteTalleres);
        localStorage.setItem('sisceba_crp_talleres', JSON.stringify(remoteTalleres));
      }
      if (remoteInscritos !== null) {
        setCrpInscritos(remoteInscritos);
        localStorage.setItem('sisceba_crp_inscritos', JSON.stringify(remoteInscritos));
      }
      if (remoteRevisionEvals !== null) {
        setRevisionEvaluations(remoteRevisionEvals);
        localStorage.setItem('sisceba_revision_evaluations', JSON.stringify(remoteRevisionEvals));
      }
      if (remotePendingSubs !== null) {
        setPendingSubjectEnrollments(remotePendingSubs);
        localStorage.setItem('sisceba_pending_subjects', JSON.stringify(remotePendingSubs));
      }
      if (remoteSectionTransfers !== null) {
        setSectionTransfers(remoteSectionTransfers);
        localStorage.setItem('sisceba_section_transfers', JSON.stringify(remoteSectionTransfers));
      }
      if (remoteExternalRecords !== null) {
        setExternalAcademicRecords(remoteExternalRecords);
        localStorage.setItem('sisceba_external_academic_records', JSON.stringify(remoteExternalRecords));
      }
      if (remotePasses !== null) setPasses(remotePasses);
      if (remoteAttendance !== null) setDailyAttendance(remoteAttendance);
      if (remoteConducts !== null) setConducts(remoteConducts);
      if (remoteDocs !== null) setDocumentRequests(remoteDocs);
      if (remoteBlocks !== null) setAdminBlocks(remoteBlocks);
      if (remoteTitles !== null) setTitles(remoteTitles);
      if (remoteNotices !== null) setCommunityNotices(remoteNotices);
      if (remoteNotifications !== null) setNotifications(remoteNotifications);
      if (remoteUsers && remoteUsers.length > 0) {
        setUsers(remoteUsers);
        // Validar que la sesión activa corresponda a un usuario existente y activo en la base de datos
        const savedUserStr = localStorage.getItem('sisceba_current_user');
        if (savedUserStr) {
          try {
            const savedUser = JSON.parse(savedUserStr);
            const verified = remoteUsers.find(
              u =>
                (u.id === savedUser.id ||
                 u.username.toLowerCase() === savedUser.username?.toLowerCase() ||
                 u.email.toLowerCase() === savedUser.email?.toLowerCase()) &&
                u.active
            );
            if (!verified) {
              console.warn('Usuario de sesión no encontrado o inactivo en la base de datos. Cerrando sesión.');
              setIsAuthenticated(false);
              setCurrentUser(null);
              localStorage.setItem('sisceba_auth_session', 'false');
              localStorage.removeItem('sisceba_current_user');
            } else {
              setCurrentUser(verified);
              const savedActiveRole = localStorage.getItem('sisceba_active_role');
              const effectiveRoles = getUserEffectiveRoles(verified);
              const roleToSet = (savedActiveRole && (effectiveRoles.includes(savedActiveRole as UserRole) || verified.role === 'ADMINISTRADOR'))
                ? (savedActiveRole as UserRole)
                : verified.role;
              setCurrentRole(roleToSet);
              if (verified.defaultLevel && !savedActiveRole) {
                setCurrentLevel(verified.defaultLevel);
              } else if (verified.allowedLevels && verified.allowedLevels.length > 0 && !savedActiveRole) {
                setCurrentLevel(verified.allowedLevels[0]);
              }
            }
          } catch {
            setIsAuthenticated(false);
            setCurrentUser(null);
            localStorage.setItem('sisceba_auth_session', 'false');
            localStorage.removeItem('sisceba_current_user');
          }
        }
      }
    } catch (e) {
      console.warn('Aviso durante la sincronización inicial con Supabase:', e);
    }
  };

  useEffect(() => {
    refreshFromSupabase();
    // Sondeo de sincronización periódica en red (cada 15s) para mantener todos los equipos sincronizados
    const syncInterval = setInterval(() => {
      refreshFromSupabase();
    }, 15000);
    return () => clearInterval(syncInterval);
  }, []);

  const [competencies, setCompetencies] = useState<Competency[]>(() => {
    const saved = localStorage.getItem('sisceba_competencies');
    if (saved) {
      try {
        const parsed: Competency[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(c => c.id));
        const missing = INITIAL_COMPETENCIES.filter(c => !existingIds.has(c.id));
        return missing.length > 0 ? [...parsed, ...missing] : parsed;
      } catch {
        return INITIAL_COMPETENCIES;
      }
    }
    return INITIAL_COMPETENCIES;
  });

  const [indicators, setIndicators] = useState<Indicator[]>(() => {
    const saved = localStorage.getItem('sisceba_indicators');
    if (saved) {
      try {
        const parsed: Indicator[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(i => i.id));
        const missing = INITIAL_INDICATORS.filter(i => !existingIds.has(i.id));
        return missing.length > 0 ? [...parsed, ...missing] : parsed;
      } catch {
        return INITIAL_INDICATORS;
      }
    }
    return INITIAL_INDICATORS;
  });

  const [strategies, setStrategies] = useState<Strategy[]>(() => {
    const saved = localStorage.getItem('sisceba_strategies');
    return saved ? JSON.parse(saved) : INITIAL_STRATEGIES;
  });

  const [educationalResources, setEducationalResources] = useState<EducationalResource[]>(() => {
    const saved = localStorage.getItem('sisceba_educational_resources');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((r: any) => r.id));
        const missing = INITIAL_EDUCATIONAL_RESOURCES.filter(r => !existingIds.has(r.id));
        return missing.length > 0 ? [...parsed, ...missing] : parsed;
      } catch {
        return INITIAL_EDUCATIONAL_RESOURCES;
      }
    }
    return INITIAL_EDUCATIONAL_RESOURCES;
  });

  const [plansQuincenal, setPlansQuincenal] = useState<PlanQuincenal[]>(() => {
    const saved = localStorage.getItem('sisceba_plans_quincenal');
    return saved ? JSON.parse(saved) : INITIAL_PLANS_QUINCENAL;
  });

  const [plansLapso, setPlansLapso] = useState<PlanLapso[]>(() => {
    const saved = localStorage.getItem('sisceba_plans_lapso');
    return saved ? JSON.parse(saved) : INITIAL_PLANS_LAPSO;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('sisceba_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>(() => {
    const saved = localStorage.getItem('sisceba_evaluations');
    return saved ? JSON.parse(saved) : INITIAL_EVALUATION_RECORDS;
  });

  const [aiActionPlans, setAiActionPlans] = useState<AIActionPlan[]>(() => {
    const saved = localStorage.getItem('sisceba_ai_plans');
    return saved ? JSON.parse(saved) : INITIAL_AI_ACTION_PLANS;
  });

  const [remedialPlans, setRemedialPlans] = useState<RemedialActionPlan[]>(() => {
    const saved = localStorage.getItem('sisceba_remedial_plans');
    return saved ? JSON.parse(saved) : INITIAL_REMEDIAL_PLANS;
  });

  const [councilMinutes, setCouncilMinutes] = useState<CouncilMeetingMinute[]>(() => {
    const saved = localStorage.getItem('sisceba_council_minutes');
    return saved ? JSON.parse(saved) : INITIAL_COUNCIL_MINUTES;
  });

  // --- Estados de Gestión Institucional SICE-CBA ---
  const [passes, setPasses] = useState<PassRecord[]>(() => {
    const saved = localStorage.getItem('sisceba_passes');
    return saved ? JSON.parse(saved) : INITIAL_PASSES;
  });

  const [dailyAttendance, setDailyAttendance] = useState<DailyAttendanceRecord[]>(() => {
    const saved = localStorage.getItem('sisceba_daily_attendance');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_ATTENDANCE;
  });

  const [accumulatedAttendance, setAccumulatedAttendance] = useState<SubjectAttendanceAccumulated[]>(() => {
    const saved = localStorage.getItem('sisceba_accumulated_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ACCUMULATED_ATTENDANCE;
  });

  const [conducts, setConducts] = useState<ConductEntry[]>(() => {
    const saved = localStorage.getItem('sisceba_conducts');
    return saved ? JSON.parse(saved) : INITIAL_CONDUCTS;
  });

  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>(() => {
    const saved = localStorage.getItem('sisceba_document_requests');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENT_REQUESTS;
  });

  const [adminBlocks, setAdminBlocks] = useState<AdministrativeBlockEntry[]>(() => {
    const saved = localStorage.getItem('sisceba_admin_blocks');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_BLOCKS;
  });

  const [titles, setTitles] = useState<TitleRecord[]>(() => {
    const saved = localStorage.getItem('sisceba_titles');
    return saved ? JSON.parse(saved) : INITIAL_TITLES;
  });

  const [schoolYearConfig, setSchoolYearConfig] = useState<SchoolYearConfig>(() => {
    const saved = localStorage.getItem('sisceba_school_year_config');
    return saved ? JSON.parse(saved) : INITIAL_SCHOOL_YEAR_CONFIG;
  });

  const [communityNotices, setCommunityNotices] = useState<CommunityNotice[]>(() => {
    const saved = localStorage.getItem('sisceba_community_notices');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_NOTICES;
  });

  const [broadcastMessages, setBroadcastMessages] = useState<BroadcastMessage[]>(() => {
    const saved = localStorage.getItem('sisceba_broadcast_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [birthdays] = useState<BirthdayPerson[]>(INITIAL_BIRTHDAYS);

  // Interactive Notifications State
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('sisceba_system_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filtrar notificaciones semilla/ficticias previas
          return parsed.filter((n: SystemNotification) => !n.id.startsWith('notif-1') && !n.id.startsWith('notif-2') && !n.id.startsWith('notif-3') && !n.id.startsWith('notif-4') && n.studentName !== 'Sofía Chacín' && n.studentName !== 'Sofía Chacín y grupo' && n.studentName !== 'Diego Alejandro Silva');
        }
      } catch { /* ignore */ }
    }
    return INITIAL_SYSTEM_NOTIFICATIONS;
  });

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const sendNotification = (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: SystemNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: 'Justo ahora',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    syncWithCloud(() => supabaseSaveNotification(newNotif), 'enviar notificación');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    syncWithCloud(() => supabaseMarkNotificationAsRead(id), 'marcar notificación leída');
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    syncWithCloud(() => supabaseMarkAllNotificationsAsRead(), 'marcar todas las notificaciones leídas');
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('sisceba_system_notifications');
    localStorage.setItem('sisceba_notifications_cleared_at', Date.now().toString());
    syncWithCloud(() => supabaseClearNotifications(), 'limpiar notificaciones');
  };

  useEffect(() => {
    localStorage.setItem('sisceba_system_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Sincronizar automáticamente noticias publicadas hacia notificaciones si aún no están reflejadas
  useEffect(() => {
    if (!communityNotices || communityNotices.length === 0) return;
    const clearedAtStr = localStorage.getItem('sisceba_notifications_cleared_at');
    const clearedAt = clearedAtStr ? parseInt(clearedAtStr, 10) : 0;

    setNotifications(prev => {
      let hasChanges = false;
      const next = [...prev];

      communityNotices.forEach(notice => {
        // Si el usuario borró el historial y la noticia es previa al borrado, no reinsertar automáticamente
        const noticeTs = notice.id.startsWith('not-') && !isNaN(Number(notice.id.replace('not-', '')))
          ? Number(notice.id.replace('not-', ''))
          : 0;
        if (clearedAt > 0 && noticeTs > 0 && noticeTs <= clearedAt) {
          return;
        }

        const notifId = `notif-${notice.id}`;
        const alreadyExists = next.some(
          n => n.id === notifId || (n.category === 'INSTITUCIONAL' && n.title === `Noticia: ${notice.title}`)
        );

        if (!alreadyExists) {
          const priority: 'BAJA' | 'MEDIA' | 'ALTA' =
            notice.type === 'ANUNCIO_URGENTE' ? 'ALTA' : notice.type === 'EVENTO' ? 'MEDIA' : 'MEDIA';
          const recipientRole: SystemNotification['recipientRole'] =
            notice.targetAudience === 'DOCENTES'
              ? 'DOCENTE'
              : notice.targetAudience === 'REPRESENTANTES'
              ? 'REPRESENTANTE'
              : notice.targetAudience === 'ESTUDIANTES'
              ? 'ESTUDIANTE'
              : 'TODOS';

          next.unshift({
            id: notifId,
            title: `Noticia: ${notice.title}`,
            message: notice.content,
            timestamp: notice.date || 'Reciente',
            read: false,
            category: 'INSTITUCIONAL',
            priority,
            recipientRole,
            recipientName: notice.author || 'Dirección CBA',
            actionTab: 'COMUNIDAD',
            actionSubTab: 'NOTICIAS',
            deliveryChannels: ['PORTAL', 'EMAIL']
          });
          hasChanges = true;
        }
      });

      return hasChanges ? next : prev;
    });
  }, [communityNotices]);

  useEffect(() => {
    localStorage.setItem('sisceba_areas', JSON.stringify(areas));
  }, [areas]);

  useEffect(() => {
    localStorage.setItem('sisceba_broadcast_messages', JSON.stringify(broadcastMessages));
  }, [broadcastMessages]);

  // Sync to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('sisceba_passes', JSON.stringify(passes));
  }, [passes]);

  useEffect(() => {
    localStorage.setItem('sisceba_daily_attendance', JSON.stringify(dailyAttendance));
  }, [dailyAttendance]);

  useEffect(() => {
    localStorage.setItem('sisceba_conducts', JSON.stringify(conducts));
  }, [conducts]);

  useEffect(() => {
    localStorage.setItem('sisceba_document_requests', JSON.stringify(documentRequests));
  }, [documentRequests]);

  useEffect(() => {
    localStorage.setItem('sisceba_admin_blocks', JSON.stringify(adminBlocks));
  }, [adminBlocks]);

  useEffect(() => {
    localStorage.setItem('sisceba_titles', JSON.stringify(titles));
  }, [titles]);

  useEffect(() => {
    localStorage.setItem('sisceba_school_year_config', JSON.stringify(schoolYearConfig));
  }, [schoolYearConfig]);

  useEffect(() => {
    localStorage.setItem('sisceba_community_notices', JSON.stringify(communityNotices));
  }, [communityNotices]);

  useEffect(() => {
    localStorage.setItem('sisceba_competencies', JSON.stringify(competencies));
  }, [competencies]);

  useEffect(() => {
    localStorage.setItem('sisceba_indicators', JSON.stringify(indicators));
  }, [indicators]);

  useEffect(() => {
    localStorage.setItem('sisceba_strategies', JSON.stringify(strategies));
  }, [strategies]);

  useEffect(() => {
    localStorage.setItem('sisceba_educational_resources', JSON.stringify(educationalResources));
  }, [educationalResources]);

  useEffect(() => {
    localStorage.setItem('sisceba_plans_quincenal', JSON.stringify(plansQuincenal));
  }, [plansQuincenal]);

  useEffect(() => {
    localStorage.setItem('sisceba_plans_lapso', JSON.stringify(plansLapso));
  }, [plansLapso]);

  useEffect(() => {
    localStorage.setItem('sisceba_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('sisceba_evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    localStorage.setItem('sisceba_ai_plans', JSON.stringify(aiActionPlans));
  }, [aiActionPlans]);

  useEffect(() => {
    localStorage.setItem('sisceba_remedial_plans', JSON.stringify(remedialPlans));
  }, [remedialPlans]);

  useEffect(() => {
    localStorage.setItem('sisceba_council_minutes', JSON.stringify(councilMinutes));
  }, [councilMinutes]);

  // Filtered views by active level
  const levelAreas = areas.filter(a => a.level === currentLevel);
  const levelStudents = students.filter(s => s.level === currentLevel);

  // Curricular Actions
  const addCompetency = (comp: Omit<Competency, 'id'>): Competency => {
    const newComp: Competency = {
      ...comp,
      id: `comp-${Date.now()}`
    };
    setCompetencies(prev => [newComp, ...prev]);
    syncWithCloud(() => supabaseSaveCompetency(newComp), 'guardar competencia');
    return newComp;
  };

  const addIndicator = (ind: Omit<Indicator, 'id'>): Indicator => {
    const newInd: Indicator = {
      ...ind,
      id: `ind-${Date.now()}`
    };
    setIndicators(prev => [newInd, ...prev]);
    syncWithCloud(() => supabaseSaveIndicator(newInd), 'guardar indicador');
    return newInd;
  };

  const transferCompetency = (competencyId: string, targetLapso: 1 | 2 | 3) => {
    const comp = competencies.find(c => c.id === competencyId);
    if (!comp) return;
    const cloned: Competency = {
      ...comp,
      id: `comp-trans-${Date.now()}`,
      code: `${comp.code}-L${targetLapso}`,
      lapso: targetLapso,
      title: `${comp.title} (Transferida a L${targetLapso})`
    };
    setCompetencies(prev => [cloned, ...prev]);
    syncWithCloud(() => supabaseSaveCompetency(cloned), 'transferir competencia');
  };

  const transferIndicator = (indicatorId: string, targetLapso: 1 | 2 | 3) => {
    const ind = indicators.find(i => i.id === indicatorId);
    if (!ind) return;
    const cloned: Indicator = {
      ...ind,
      id: `ind-trans-${Date.now()}`,
      code: `${ind.code}-L${targetLapso}`,
      lapso: targetLapso,
      description: `${ind.description} (Reforzado en L${targetLapso})`
    };
    setIndicators(prev => [cloned, ...prev]);
    syncWithCloud(() => supabaseSaveIndicator(cloned), 'transferir indicador');
  };

  const addStrategy = (strat: Omit<Strategy, 'id'>): Strategy => {
    const newStrat: Strategy = {
      ...strat,
      id: `strat-${Date.now()}`
    };
    setStrategies(prev => [newStrat, ...prev]);
    syncWithCloud(() => supabaseSaveStrategy(newStrat), 'guardar estrategia');
    return newStrat;
  };

  const transferStrategy = (strategyId: string, targetAreaId: string) => {
    const strat = strategies.find(s => s.id === strategyId);
    const targetArea = areas.find(a => a.id === targetAreaId);
    if (!strat || !targetArea) return;
    const cloned: Strategy = {
      ...strat,
      id: `strat-trans-${Date.now()}`,
      areaId: targetAreaId,
      level: targetArea.level,
      name: `${strat.name} [Transferida a ${targetArea.name}]`
    };
    setStrategies(prev => [cloned, ...prev]);
    syncWithCloud(() => supabaseSaveStrategy(cloned), 'transferir estrategia');
  };

  const addEducationalResource = (res: Omit<EducationalResource, 'id'>) => {
    const newRes: EducationalResource = {
      ...res,
      id: `res-${Date.now()}`
    };
    setEducationalResources(prev => [newRes, ...prev]);
    syncWithCloud(() => supabaseSaveEducationalResource(newRes), 'guardar recurso educativo');
    return newRes;
  };

  const deleteEducationalResource = (id: string) => {
    setEducationalResources(prev => prev.filter(r => r.id !== id));
    syncWithCloud(() => supabaseDeleteEducationalResource(id), 'eliminar recurso educativo');
  };

  const transferEducationalResource = (resourceId: string, targetAreaId: string) => {
    const res = educationalResources.find(r => r.id === resourceId);
    const targetArea = areas.find(a => a.id === targetAreaId);
    if (!res || !targetArea) return;
    const cloned: EducationalResource = {
      ...res,
      id: `res-trans-${Date.now()}`,
      areaId: targetAreaId,
      level: targetArea.level,
      name: `${res.name} [Transferido a ${targetArea.name}]`
    };
    setEducationalResources(prev => [cloned, ...prev]);
    syncWithCloud(() => supabaseSaveEducationalResource(cloned), 'transferir recurso educativo');
  };

  // Planning Actions
  const savePlanQuincenal = (plan: PlanQuincenal) => {
    const updatedPlan: PlanQuincenal = { ...plan, updatedAt: new Date().toISOString().split('T')[0] };
    setPlansQuincenal(prev => {
      const idx = prev.findIndex(p => p.id === plan.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedPlan;
        return copy;
      }
      return [updatedPlan, ...prev];
    });
    syncWithCloud(() => supabaseSaveDidacticPlan(updatedPlan), 'guardar plan didáctico');
  };

  const updateQuincenalStatus = (planId: string, status: PlanStatus, feedback?: string) => {
    setPlansQuincenal(prev =>
      prev.map(p => {
        if (p.id === planId) {
          const updated: PlanQuincenal = {
            ...p,
            status,
            reviewFeedback: feedback !== undefined ? feedback : p.reviewFeedback,
            updatedAt: new Date().toISOString().split('T')[0]
          };
          syncWithCloud(() => supabaseSaveDidacticPlan(updated), 'actualizar estado plan didáctico');
          return updated;
        }
        return p;
      })
    );
  };

  const savePlanLapso = (plan: PlanLapso) => {
    const updatedPlan: PlanLapso = { ...plan, updatedAt: new Date().toISOString().split('T')[0] };
    setPlansLapso(prev => {
      const idx = prev.findIndex(p => p.id === plan.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedPlan;
        return copy;
      }
      return [updatedPlan, ...prev];
    });
    syncWithCloud(() => supabaseSavePlanLapso(updatedPlan), 'guardar plan de lapso');
  };

  const updateLapsoPlanStatus = (planId: string, status: PlanStatus, feedback?: string) => {
    setPlansLapso(prev =>
      prev.map(p => {
        if (p.id === planId) {
          const updated: PlanLapso = {
            ...p,
            status,
            reviewFeedback: feedback !== undefined ? feedback : p.reviewFeedback,
            updatedAt: new Date().toISOString().split('T')[0]
          };
          syncWithCloud(() => supabaseSavePlanLapso(updated), 'actualizar estado plan de lapso');
          return updated;
        }
        return p;
      })
    );
  };

  // Student Actions
  const addStudent = (stu: Omit<Student, 'id'>): Student => {
    const newStudent: Student = {
      ...stu,
      id: `stu-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    setStudents(prev => [newStudent, ...prev]);
    syncWithCloud(() => supabaseSaveStudent(newStudent), 'inscribir estudiante');
    return newStudent;
  };

  const saveStudent = (student: Student) => {
    setStudents(prev => {
      const idx = prev.findIndex(s => s.id === student.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = student;
        return copy;
      }
      return [student, ...prev];
    });
    syncWithCloud(() => supabaseSaveStudent(student), 'actualizar estudiante');
  };

  // Evaluation Actions
  const recordEvaluation = (record: Omit<EvaluationRecord, 'id' | 'recordedAt'>) => {
    const newRecord: EvaluationRecord = {
      ...record,
      id: `eval-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      recordedAt: new Date().toISOString().split('T')[0]
    };
    setEvaluations(prev => {
      const filtered = prev.filter(
        e =>
          !(
            e.studentId === record.studentId &&
            e.areaId === record.areaId &&
            e.moment === record.moment &&
            e.lapso === record.lapso &&
            e.indicatorId === record.indicatorId
          )
      );
      return [newRecord, ...filtered];
    });
    syncWithCloud(() => supabaseSaveEvaluation(newRecord), 'asentar calificación');
  };

  const bulkRecordEvaluations = (records: Omit<EvaluationRecord, 'id' | 'recordedAt'>[]) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const newRecords: EvaluationRecord[] = records.map((r) => {
      const existing = evaluations.find(
        e =>
          e.studentId === r.studentId &&
          e.areaId === r.areaId &&
          e.moment === r.moment &&
          e.lapso === r.lapso &&
          (e.indicatorId || '') === (r.indicatorId || '')
      );
      return {
        ...r,
        id: existing ? existing.id : `eval-${r.studentId}-${r.areaId}-${r.indicatorId || 'gen'}-${r.lapso}`,
        recordedAt: timestamp
      };
    });

    setEvaluations(prev => {
      const keysToReplace = new Set(
        newRecords.map(nr => `${nr.studentId}|${nr.areaId}|${nr.moment}|${nr.lapso}|${nr.indicatorId || ''}`)
      );
      const filtered = prev.filter(
        e => !keysToReplace.has(`${e.studentId}|${e.areaId}|${e.moment}|${e.lapso}|${e.indicatorId || ''}`)
      );
      return [...newRecords, ...filtered];
    });

    syncWithCloud(() => supabaseBulkSaveEvaluations(newRecords), 'guardar bloque de calificaciones');
  };

  const adjustStudentGrade = (
    studentId: string,
    areaId: string,
    oldScore: string,
    newScore: string,
    justification: string
  ) => {
    const student = students.find(s => s.id === studentId);
    const area = areas.find(a => a.id === areaId);
    if (!student || !area) return;

    // Update or add the evaluation record
    const isInicial = student.level === 'INICIAL';
    const isPrimaria = student.level === 'PRIMARIA';
    const isMedia = student.level === 'MEDIA_GENERAL';

    const cleanScore = newScore.trim();
    const upperScore = cleanScore.toUpperCase();

    const scoreLiteral = isInicial
      ? ((['A', 'B', 'C', 'D', 'E'].includes(upperScore) ? upperScore : undefined) as LiteralScore | undefined)
      : undefined;

    const scoreQualitative = isPrimaria
      ? ((['L', 'P', 'EP', 'I'].includes(upperScore) ? upperScore : undefined) as QualitativeScore | undefined)
      : undefined;

    const scoreNumeric = isMedia && !isNaN(Number(cleanScore))
      ? Number(cleanScore)
      : undefined;

    const newRecord: EvaluationRecord = {
      id: `eval-adjust-${Date.now()}`,
      studentId,
      areaId,
      moment: 'FINAL_LAPSO',
      lapso: activeLapso,
      scoreNumeric,
      scoreLiteral,
      scoreQualitative,
      observations: `Ajuste oficial aprobado en Consejo: ${justification} (Antes: ${oldScore})`,
      recordedAt: new Date().toISOString().split('T')[0],
      teacherId: 'coordinacion-pedagogica'
    };

    setEvaluations(prev => [newRecord, ...prev]);
    syncWithCloud(() => supabaseSaveEvaluation(newRecord), 'guardar ajuste de calificación en consejo');

    // Append to council minute if available
    setCouncilMinutes(prev => {
      if (prev.length === 0) return prev;
      const copy = [...prev];
      copy[0] = {
        ...copy[0],
        adjustedScores: [
          ...copy[0].adjustedScores,
          {
            studentId,
            studentName: student.fullName,
            areaName: area.name,
            previousScore: oldScore,
            newScore,
            justification
          }
        ]
      };
      return copy;
    });
  };

  // AI Personalized Action Plan Generator
  const generateAIActionPlan = (studentId: string, areaId: string): AIActionPlan => {
    const student = students.find(s => s.id === studentId);
    const area = areas.find(a => a.id === areaId);

    const plan: AIActionPlan = {
      id: `ai-plan-${Date.now()}`,
      studentId,
      areaId,
      lapso: activeLapso,
      diagnosticSummary: `Análisis cognitivo SICE-CBA para ${student?.fullName || 'el estudiante'} en ${area?.name || 'el área'}. Se evidencian dificultades persistentes en la asimilación procedimental de contenidos del Lapso ${activeLapso}.`,
      identifiedGaps: [
        `Dificultad de aplicación práctica en conceptos clave de ${area?.name}.`,
        'Brecha en hábitos de estudio estructurado e interpretación de consignas complejas.',
        'Bajo rendimiento relativo en pruebas de tiempo limitado.'
      ],
      recommendedPedagogicalActions: [
        'Fase 1: Asignación de guía de microaprendizaje con refuerzo visual y glosario contextualizado.',
        'Fase 2: Acompañamiento en laboratorio/aula con tutor pedagógico o estudiante monitor.',
        'Fase 3: Elaboración de proyecto remedial práctico aplicado a su entorno cotidiano.',
        'Fase 4: Reevaluación formativa con instrumento adaptado de retroalimentación inmediata.'
      ],
      suggestedResources: [
        `Módulo Digital Bellas Artes: Refuerzo para ${area?.name}.`,
        'Banco de ejercicios autocorregibles en la plataforma SICE-CBA.',
        'Ficha de seguimiento de hábitos de estudio en casa con apoyo del representante.'
      ],
      teacherNotes: 'Plan preliminar generado por el motor de IA de SICE-CBA. Pendiente de validación por el docente titular.',
      status: 'GENERADO',
      createdAt: new Date().toISOString().split('T')[0],
      aiConfidenceScore: 92
    };

    setAiActionPlans(prev => [plan, ...prev]);
    return plan;
  };

  const updateAIPlanFeedback = (planId: string, teacherNotes: string, status: AIActionPlan['status']) => {
    setAiActionPlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, teacherNotes, status } : p))
    );
  };

  // Remedial & Intervention
  const addRemedialPlan = (plan: Omit<RemedialActionPlan, 'id'>) => {
    const newPlan: RemedialActionPlan = {
      ...plan,
      id: `rem-${Date.now()}`
    };
    setRemedialPlans(prev => [newPlan, ...prev]);
  };

  const updateRemedialStatus = (planId: string, status: RemedialActionPlan['status'], finalScore?: number) => {
    setRemedialPlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, status, finalScore } : p))
    );
  };

  // Council Minutes
  const createCouncilMinute = (minute: Omit<CouncilMeetingMinute, 'id'>) => {
    const newMinute: CouncilMeetingMinute = {
      ...minute,
      id: `acta-${Date.now()}`
    };
    setCouncilMinutes(prev => [newMinute, ...prev]);
  };

  const signCouncilMinute = (minuteId: string) => {
    setCouncilMinutes(prev =>
      prev.map(m => (m.id === minuteId ? { ...m, signed: true } : m))
    );
  };

  // --- Handlers de Gestión Institucional SICE-CBA ---
  const getLapsoGradingStatus = (lapsoNumber: 1 | 2 | 3) => {
    const lapsoObj = schoolYearConfig.lapsos.find(l => l.lapso === lapsoNumber);
    if (!lapsoObj) {
      return {
        isOpen: true,
        isExpiredByDeadline: false,
        isManualClosed: false,
        statusText: 'Habilitado',
        deadlineStr: ''
      };
    }

    if (!lapsoObj.isGradingOpen) {
      return {
        isOpen: false,
        isExpiredByDeadline: false,
        isManualClosed: true,
        statusText: 'Cerrado Manualmente',
        deadlineStr: lapsoObj.deadlineDate ? `${lapsoObj.deadlineDate} ${lapsoObj.deadlineTime || '23:59'}` : ''
      };
    }

    const autoLock = lapsoObj.autoLockEnabled ?? true;
    const deadlineDate = lapsoObj.deadlineDate || lapsoObj.endDate;
    const deadlineTime = lapsoObj.deadlineTime || '23:59';

    if (autoLock && deadlineDate) {
      const deadlineIso = `${deadlineDate}T${deadlineTime}:00`;
      const deadlineTimestamp = new Date(deadlineIso).getTime();
      const nowTimestamp = Date.now();

      if (!isNaN(deadlineTimestamp) && nowTimestamp > deadlineTimestamp) {
        return {
          isOpen: false,
          isExpiredByDeadline: true,
          isManualClosed: false,
          statusText: 'Bloqueado por Cierre Programado',
          deadlineStr: `${deadlineDate} a las ${deadlineTime}`
        };
      }
    }

    return {
      isOpen: true,
      isExpiredByDeadline: false,
      isManualClosed: false,
      statusText: 'Abierto para Carga',
      deadlineStr: deadlineDate ? `${deadlineDate} a las ${deadlineTime}` : ''
    };
  };

  const isLapsoOpenForGrading = getLapsoGradingStatus(activeLapso).isOpen;

  const toggleLapsoGrading = (lapso: 1 | 2 | 3) => {
    let nextConfig: SchoolYearConfig | null = null;
    setSchoolYearConfig(prev => {
      nextConfig = {
        ...prev,
        lapsos: prev.lapsos.map(l => (l.lapso === lapso ? { ...l, isGradingOpen: !l.isGradingOpen } : l))
      };
      return nextConfig;
    });
    if (nextConfig) {
      syncWithCloud(() => supabaseSaveSchoolYearConfig(nextConfig!), `conmutar carga de notas para Lapso ${lapso}`);
    }
  };

  const updateLapsoConfig = (lapso: 1 | 2 | 3, updates: Partial<LapsoConfig>) => {
    let nextConfig: SchoolYearConfig | null = null;
    setSchoolYearConfig(prev => {
      nextConfig = {
        ...prev,
        lapsos: prev.lapsos.map(l => (l.lapso === lapso ? { ...l, ...updates } : l))
      };
      return nextConfig;
    });
    if (nextConfig) {
      syncWithCloud(() => supabaseSaveSchoolYearConfig(nextConfig!), `actualizar configuración de Lapso ${lapso}`);
    }
  };

  const addPass = (pass: Omit<PassRecord, 'id' | 'ticketNumber'>): PassRecord => {
    const newPass: PassRecord = {
      ...pass,
      id: `pass-${Date.now()}`,
      ticketNumber: `RET-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setPasses(prev => [newPass, ...prev]);
    syncWithCloud(() => supabaseSavePass(newPass), 'emitir pase de retraso');

    // Despacho de notificación automática al representante
    const stu = students.find(s => s.id === pass.studentId);
    sendNotification({
      title: `Aviso de Portería • Pase de Retraso #${newPass.ticketNumber}`,
      message: `Se registró el ingreso tardío a las ${pass.time} para el estudiante ${pass.studentName} (${pass.gradeSection}). Motivo: ${pass.reason}. Representante legal notificado automáticamente.`,
      category: 'ASISTENCIA',
      priority: 'MEDIA',
      recipientRole: 'REPRESENTANTE',
      recipientName: stu?.representativeName,
      studentName: pass.studentName,
      actionTab: 'GESTION',
      actionSubTab: 'PASES',
      deliveryChannels: ['PORTAL', 'SMS_WHATSAPP', 'EMAIL']
    });

    return newPass;
  };

  const deletePass = (passId: string) => {
    setPasses(prev => prev.filter(p => p.id !== passId));
    syncWithCloud(() => supabaseDeletePass(passId), 'eliminar pase');
  };

  const printPass = (passId: string) => {
    setPasses(prev =>
      prev.map(p => {
        if (p.id === passId) {
          const updated = { ...p, printed: true };
          syncWithCloud(() => supabaseSavePass(updated), 'imprimir pase');
          return updated;
        }
        return p;
      })
    );
  };

  const markDailyAttendance = (studentId: string, status: DailyAttendanceRecord['status'], justification?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const stu = students.find(s => s.id === studentId);
    const stuName = stu?.fullName || 'Estudiante';
    const gradeSec = stu ? `${stu.grade} ${stu.section}` : currentSection;

    const newRec: DailyAttendanceRecord = {
      id: `att-${Date.now()}-${studentId}`,
      studentId,
      studentName: stuName,
      gradeSection: gradeSec,
      date: today,
      status,
      justification,
      lapso: activeLapso
    };

    setDailyAttendance(prev => {
      const filtered = prev.filter(a => !(a.studentId === studentId && a.date === today));
      const nextRecords = [newRec, ...filtered];

      // 1. Notificación automática al representante ante novedad de asistencia
      if (status === 'INASISTENCIA_INJUSTIFICADA') {
        sendNotification({
          title: `Aviso de Portería / Aula • Falta Injustificada`,
          message: `Se registró la falta injustificada de su representado(a) ${stuName} (${gradeSec}) en fecha ${today}. Favor consignar justificativo médico o comunicarse con Control de Estudios.`,
          category: 'ASISTENCIA',
          priority: 'ALTA',
          recipientRole: 'REPRESENTANTE',
          recipientName: stu?.representativeName,
          studentName: stuName,
          actionTab: 'GESTION',
          actionSubTab: 'INASISTENCIAS',
          deliveryChannels: ['PORTAL', 'SMS_WHATSAPP', 'EMAIL']
        });
      } else if (status === 'RETRASO') {
        sendNotification({
          title: `Aviso de Aula • Retraso Registrado`,
          message: `Se registró el ingreso con retraso a aula de su representado(a) ${stuName} (${gradeSec}) hoy ${today}.`,
          category: 'ASISTENCIA',
          priority: 'MEDIA',
          recipientRole: 'REPRESENTANTE',
          recipientName: stu?.representativeName,
          studentName: stuName,
          actionTab: 'GESTION',
          actionSubTab: 'INASISTENCIAS',
          deliveryChannels: ['PORTAL', 'SMS_WHATSAPP']
        });
      } else if (status === 'INASISTENCIA_JUSTIFICADA') {
        sendNotification({
          title: `Aviso de Asistencia • Falta Justificada Registrada`,
          message: `Se registró la inasistencia justificada de ${stuName} (${gradeSec}) en fecha ${today}. Motivo: ${justification || 'Justificación avalada'}.`,
          category: 'ASISTENCIA',
          priority: 'BAJA',
          recipientRole: 'REPRESENTANTE',
          recipientName: stu?.representativeName,
          studentName: stuName,
          actionTab: 'GESTION',
          actionSubTab: 'INASISTENCIAS',
          deliveryChannels: ['PORTAL']
        });
      }

      // 2. Regla reglamentaria del 25% de inasistencias acumuladas
      const studentLapsoRecords = nextRecords.filter(r => r.studentId === studentId && r.lapso === activeLapso);
      const totalDays = studentLapsoRecords.length;
      const unjustifiedCount = studentLapsoRecords.filter(r => r.status === 'INASISTENCIA_INJUSTIFICADA').length;
      const justifiedCount = studentLapsoRecords.filter(r => r.status === 'INASISTENCIA_JUSTIFICADA').length;
      const absencePct = totalDays > 0 ? (unjustifiedCount / totalDays) * 100 : 0;
      const exceeds = absencePct >= 25 && totalDays >= 3;

      if (exceeds) {
        sendNotification({
          title: `⚠️ ALERTA 25% INASISTENCIAS: ${stuName}`,
          message: `El estudiante ${stuName} (${gradeSec}) ha alcanzado un ${absencePct.toFixed(1)}% de inasistencias injustificadas (${unjustifiedCount} de ${totalDays} jornadas registradas). De acuerdo con el Reglamento de Evaluación Institucional CBA, supera el umbral límite del 25%, comprometiendo la aprobación de las asignaturas.`,
          category: 'ASISTENCIA',
          priority: 'ALTA',
          recipientRole: 'REPRESENTANTE',
          recipientName: stu?.representativeName,
          studentName: stuName,
          actionTab: 'GESTION',
          actionSubTab: 'INASISTENCIAS',
          deliveryChannels: ['PORTAL', 'EMAIL', 'SMS_WHATSAPP']
        });

        // Alerta interna a Coordinación Pedagógica
        sendNotification({
          title: `⚠️ Alerta Supervisión UCE: ${stuName} superó 25% de inasistencias`,
          message: `El estudiante ${stuName} de ${gradeSec} superó el 25% de inasistencias reglamentarias (${absencePct.toFixed(1)}%). Requiere citación institucional inmediata.`,
          category: 'ASISTENCIA',
          priority: 'ALTA',
          recipientRole: 'COORDINACION',
          studentName: stuName,
          actionTab: 'GESTION',
          actionSubTab: 'INASISTENCIAS',
          deliveryChannels: ['PORTAL', 'EMAIL']
        });
      }

      // 3. Sincronizar / Actualizar accumulatedAttendance
      setAccumulatedAttendance(prevAcc => {
        const existingIdx = prevAcc.findIndex(a => a.studentId === studentId && a.lapso === activeLapso);
        const accItem: SubjectAttendanceAccumulated = {
          id: existingIdx >= 0 ? prevAcc[existingIdx].id : `acc-${studentId}-${activeLapso}`,
          studentId,
          studentName: stuName,
          areaId: 'all-subjects',
          areaName: 'Control General de Lapso',
          gradeSection: gradeSec,
          lapso: activeLapso,
          totalClasses: totalDays,
          unjustifiedAbsences: unjustifiedCount,
          justifiedAbsences: justifiedCount,
          absencePercentage: absencePct,
          exceedsLimit: exceeds
        };

        if (existingIdx >= 0) {
          const nextAcc = [...prevAcc];
          nextAcc[existingIdx] = accItem;
          return nextAcc;
        } else {
          return [accItem, ...prevAcc];
        }
      });

      return nextRecords;
    });

    syncWithCloud(() => supabaseSaveDailyAttendance(newRec), 'marcar asistencia');
  };

  const addConduct = (conduct: Omit<ConductEntry, 'id'>): ConductEntry => {
    const newEntry: ConductEntry = {
      ...conduct,
      id: `cond-${Date.now()}`
    };
    setConducts(prev => [newEntry, ...prev]);
    syncWithCloud(() => supabaseSaveConduct(newEntry), 'registrar conducta');
    return newEntry;
  };

  const updateDocumentStatus = (requestId: string, status: DocumentRequest['status']) => {
    setDocumentRequests(prev =>
      prev.map(d => {
        if (d.id === requestId) {
          const updated = { ...d, status };
          syncWithCloud(() => supabaseSaveDocumentRequest(updated), 'actualizar estado documento');
          return updated;
        }
        return d;
      })
    );
  };

  const addDocumentRequest = (req: Omit<DocumentRequest, 'id' | 'trackingCode' | 'elapsedDays'>): DocumentRequest => {
    const newReq: DocumentRequest = {
      ...req,
      id: `doc-req-${Date.now()}`,
      trackingCode: `SOL-CBA-2026-${Math.floor(100 + Math.random() * 900)}`,
      elapsedDays: 0
    };
    setDocumentRequests(prev => [newReq, ...prev]);
    syncWithCloud(() => supabaseSaveDocumentRequest(newReq), 'solicitar documento');
    return newReq;
  };

  const addAdminBlock = (block: Omit<AdministrativeBlockEntry, 'id'>): AdministrativeBlockEntry => {
    const newBlock: AdministrativeBlockEntry = {
      ...block,
      id: `block-${Date.now()}`
    };
    setAdminBlocks(prev => [newBlock, ...prev]);
    syncWithCloud(() => supabaseSaveAdminBlock(newBlock), 'registrar bloqueo administrativo');
    return newBlock;
  };

  const toggleAdminBlock = (blockId: string) => {
    setAdminBlocks(prev =>
      prev.map(b => {
        if (b.id === blockId) {
          const nextActive = !b.active;
          const updated: AdministrativeBlockEntry = {
            ...b,
            active: nextActive,
            unblockedDate: !nextActive ? new Date().toISOString().split('T')[0] : undefined,
            unblockedBy: !nextActive ? (currentUser?.fullName || currentUser?.username || 'Administración CBA') : undefined
          };
          syncWithCloud(() => supabaseSaveAdminBlock(updated), 'actualizar bloqueo administrativo');
          return updated;
        }
        return b;
      })
    );
  };

  const deleteAdminBlock = (blockId: string) => {
    setAdminBlocks(prev => prev.filter(b => b.id !== blockId));
    syncWithCloud(() => supabaseDeleteAdminBlock(blockId), 'eliminar bloqueo administrativo');
  };

  const isStudentAdminBlocked = (studentId: string): boolean => {
    return adminBlocks.some(b => b.studentId === studentId && b.active);
  };

  const getStudentAdminBlock = (studentId: string): AdministrativeBlockEntry | undefined => {
    return adminBlocks.find(b => b.studentId === studentId && b.active);
  };

  const saveTitleRecord = (record: TitleRecord) => {
    setTitles(prev => {
      const idx = prev.findIndex(t => t.id === record.id || t.studentId === record.studentId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = record;
        return copy;
      }
      return [...prev, record];
    });
    syncWithCloud(() => supabaseSaveTitleRecord(record), 'guardar título bachiller');
  };

  const deleteTitleRecord = (titleId: string) => {
    setTitles(prev => prev.filter(t => t.id !== titleId));
    syncWithCloud(() => supabaseDeleteTitleRecord(titleId), 'eliminar título bachiller');
  };

  const addCommunityNotice = (notice: Omit<CommunityNotice, 'id'>): CommunityNotice => {
    const newNotice: CommunityNotice = {
      ...notice,
      id: `not-${Date.now()}`
    };
    setCommunityNotices(prev => [newNotice, ...prev]);
    syncWithCloud(() => supabaseSaveCommunityNotice(newNotice), 'publicar comunicado comunitario');

    const priority: 'BAJA' | 'MEDIA' | 'ALTA' =
      notice.type === 'ANUNCIO_URGENTE' ? 'ALTA' : notice.type === 'EVENTO' ? 'MEDIA' : 'MEDIA';
    const recipientRole: SystemNotification['recipientRole'] =
      notice.targetAudience === 'DOCENTES'
        ? 'DOCENTE'
        : notice.targetAudience === 'REPRESENTANTES'
        ? 'REPRESENTANTE'
        : notice.targetAudience === 'ESTUDIANTES'
        ? 'ESTUDIANTE'
        : 'TODOS';

    const notif: SystemNotification = {
      id: `notif-${newNotice.id}`,
      title: `Noticia: ${notice.title}`,
      message: notice.content,
      timestamp: 'Justo ahora',
      read: false,
      category: 'INSTITUCIONAL',
      priority,
      recipientRole,
      recipientName: notice.author || 'Dirección CBA',
      actionTab: 'COMUNIDAD',
      actionSubTab: 'NOTICIAS',
      deliveryChannels: ['PORTAL', 'EMAIL']
    };

    setNotifications(prev => [notif, ...prev.filter(n => n.id !== notif.id)]);
    syncWithCloud(() => supabaseSaveNotification(notif), 'enviar notificación de noticia');

    return newNotice;
  };

  const updateCommunityNotice = (updatedNotice: CommunityNotice) => {
    setCommunityNotices(prev => prev.map(n => n.id === updatedNotice.id ? updatedNotice : n));
    syncWithCloud(() => supabaseSaveCommunityNotice(updatedNotice), 'actualizar comunicado comunitario');

    const priority: 'BAJA' | 'MEDIA' | 'ALTA' =
      updatedNotice.type === 'ANUNCIO_URGENTE' ? 'ALTA' : updatedNotice.type === 'EVENTO' ? 'MEDIA' : 'MEDIA';
    const recipientRole: SystemNotification['recipientRole'] =
      updatedNotice.targetAudience === 'DOCENTES'
        ? 'DOCENTE'
        : updatedNotice.targetAudience === 'REPRESENTANTES'
        ? 'REPRESENTANTE'
        : updatedNotice.targetAudience === 'ESTUDIANTES'
        ? 'ESTUDIANTE'
        : 'TODOS';

    const notifId = `notif-${updatedNotice.id}`;
    const updatedNotif: SystemNotification = {
      id: notifId,
      title: `Noticia: ${updatedNotice.title}`,
      message: updatedNotice.content,
      timestamp: updatedNotice.date || 'Reciente',
      read: false,
      category: 'INSTITUCIONAL',
      priority,
      recipientRole,
      recipientName: updatedNotice.author || 'Dirección CBA',
      actionTab: 'COMUNIDAD',
      actionSubTab: 'NOTICIAS',
      deliveryChannels: ['PORTAL', 'EMAIL']
    };

    setNotifications(prev => prev.map(n => n.id === notifId ? updatedNotif : n));
    syncWithCloud(() => supabaseSaveNotification(updatedNotif), 'actualizar notificación de noticia');
  };

  const deleteCommunityNotice = (id: string) => {
    setCommunityNotices(prev => prev.filter(n => n.id !== id));
    setNotifications(prev => prev.filter(n => n.id !== `notif-${id}`));
    syncWithCloud(() => supabaseDeleteCommunityNotice(id), 'eliminar comunicado comunitario');
    syncWithCloud(() => supabaseDeleteNotification(`notif-${id}`), 'eliminar notificación de noticia');
  };

  const sendBroadcastMessage = (
    msg: Omit<BroadcastMessage, 'id' | 'date' | 'time'> & { publishToNotices?: boolean }
  ): BroadcastMessage => {
    const newBroadcast: BroadcastMessage = {
      id: `broad-${Date.now()}`,
      title: msg.title,
      content: msg.content,
      targetAudience: msg.targetAudience,
      subsystem: msg.subsystem || 'TODOS',
      channel: msg.channel,
      theme: msg.theme || 'ESTANDAR',
      date: new Date().toLocaleDateString('es-VE'),
      time: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
      sender: msg.sender || 'Dirección General CBA',
      urgent: msg.urgent
    };

    setBroadcastMessages(prev => [newBroadcast, ...prev]);

    // Enviar notificación a la audiencia objetivo
    const recipientRole: SystemNotification['recipientRole'] =
      msg.targetAudience === 'DOCENTES'
        ? 'DOCENTE'
        : msg.targetAudience === 'REPRESENTANTES'
        ? 'REPRESENTANTE'
        : msg.targetAudience === 'ESTUDIANTES'
        ? 'ESTUDIANTE'
        : msg.targetAudience === 'DIRECCION'
        ? 'DIRECTOR'
        : msg.targetAudience === 'COORDINACION'
        ? 'COORDINACION'
        : 'TODOS';

    const deliveryChannels: NotificationDeliveryChannel[] =
      msg.channel === 'SMS'
        ? ['SMS_WHATSAPP']
        : msg.channel === 'SOLO_CORREO'
        ? ['EMAIL']
        : ['PORTAL', 'EMAIL', 'SMS_WHATSAPP'];

    sendNotification({
      title: `Comunicado: ${msg.title}`,
      message: msg.content,
      category: 'INSTITUCIONAL',
      priority: msg.urgent ? 'ALTA' : 'MEDIA',
      recipientRole,
      recipientName: msg.sender || 'Dirección CBA',
      actionTab: 'COMUNIDAD',
      actionSubTab: 'COMUNICADOS',
      deliveryChannels
    });

    // Opcionalmente publicar en la cartelera de noticias
    if (msg.publishToNotices !== false) {
      addCommunityNotice({
        title: msg.title,
        content: msg.content,
        date: newBroadcast.date,
        type: msg.urgent ? 'ANUNCIO_URGENTE' : 'NOTICIA',
        targetAudience: msg.targetAudience,
        theme: msg.theme || 'ESTANDAR',
        subsystem: msg.subsystem || 'TODOS',
        author: msg.sender || 'Dirección General CBA',
        pinned: !!msg.urgent
      });
    }

    return newBroadcast;
  };

  const deleteBroadcastMessage = (id: string) => {
    setBroadcastMessages(prev => prev.filter(b => b.id !== id));
  };

  const toggleSystemPrivilege = async (roleName: string, privilegeNro: number): Promise<boolean> => {
    let nextMatrix: SystemPrivilegesMatrix | null = null;

    setSystemPrivileges(prev => {
      const nextRoles = prev.roles.map(r => {
        if (r.nombre !== roleName) return r;
        const nextPrivs = r.privilegios.map(p => {
          if (p.nro !== privilegeNro) return p;
          return { ...p, habilitar: !p.habilitar };
        });
        return { ...r, privilegios: nextPrivs };
      });
      nextMatrix = { ...prev, roles: nextRoles };
      return nextMatrix;
    });

    if (nextMatrix) {
      localStorage.setItem('sisceba_system_privileges_cache', JSON.stringify(nextMatrix));
      if (isSupabaseConfigured()) {
        const res = await syncWithCloud(
          () => supabaseSavePrivileges(nextMatrix!),
          `actualizar privilegio #${privilegeNro} para ${roleName}`
        );
        return res === true;
      }
    }
    return true;
  };

  const resetSystemPrivileges = async (): Promise<boolean> => {
    const defaultMatrix = PRIVILEGIOS_DATA as SystemPrivilegesMatrix;
    setSystemPrivileges(defaultMatrix);
    localStorage.setItem('sisceba_system_privileges_cache', JSON.stringify(defaultMatrix));
    if (isSupabaseConfigured()) {
      const res = await syncWithCloud(
        () => supabaseSavePrivileges(defaultMatrix),
        'restablecer matriz de privilegios CEO a predeterminados'
      );
      return res === true;
    }
    return true;
  };

  const getUserSchedule = (userId: string): UserSchedule | null => {
    const found = userSchedules.find(s => s.userId === userId);
    if (found) return found;

    // Si es un usuario recién creado o sin horario específico, generar o buscar por rol
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      const roleDefault = userSchedules.find(s => s.userRole === targetUser.role);
      if (roleDefault) {
        return {
          ...roleDefault,
          userId
        };
      }
    }
    return null;
  };

  const currentUserSchedule = currentUser ? getUserSchedule(currentUser.id) : null;

  const saveUserSchedule = async (schedule: UserSchedule): Promise<boolean> => {
    const updatedWithTimestamp: UserSchedule = {
      ...schedule,
      updatedAt: new Date().toISOString()
    };

    setUserSchedules(prev => {
      const idx = prev.findIndex(s => s.userId === schedule.userId);
      let next: UserSchedule[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = updatedWithTimestamp;
      } else {
        next = [updatedWithTimestamp, ...prev];
      }
      localStorage.setItem('sisceba_user_schedules_v2', JSON.stringify(next));
      return next;
    });

    if (isSupabaseConfigured()) {
      const res = await syncWithCloud(
        () => supabaseSaveUserSchedule(updatedWithTimestamp),
        `guardar horario institucional de ${schedule.userId}`
      );
      return res === true;
    }
    return true;
  };

  const resetToSeedData = () => {
    localStorage.clear();
    setCompetencies(INITIAL_COMPETENCIES);
    setIndicators(INITIAL_INDICATORS);
    setStrategies(INITIAL_STRATEGIES);
    setPlansQuincenal(INITIAL_PLANS_QUINCENAL);
    setPlansLapso(INITIAL_PLANS_LAPSO);
    setStudents(INITIAL_STUDENTS);
    setEvaluations(INITIAL_EVALUATION_RECORDS);
    setAiActionPlans(INITIAL_AI_ACTION_PLANS);
    setRemedialPlans(INITIAL_REMEDIAL_PLANS);
    setCouncilMinutes(INITIAL_COUNCIL_MINUTES);
    setPasses(INITIAL_PASSES);
    setDailyAttendance(INITIAL_DAILY_ATTENDANCE);
    setAccumulatedAttendance(INITIAL_ACCUMULATED_ATTENDANCE);
    setConducts(INITIAL_CONDUCTS);
    setDocumentRequests(INITIAL_DOCUMENT_REQUESTS);
    setAdminBlocks(INITIAL_ADMIN_BLOCKS);
    setTitles(INITIAL_TITLES);
    setSchoolYearConfig(INITIAL_SCHOOL_YEAR_CONFIG);
    setCommunityNotices(INITIAL_COMMUNITY_NOTICES);
    setSystemPrivileges(PRIVILEGIOS_DATA as SystemPrivilegesMatrix);
    localStorage.removeItem('sisceba_system_notifications');
    setNotifications(INITIAL_SYSTEM_NOTIFICATIONS);
    setSchoolData(INITIAL_SCHOOL_DATA);
    setSystemCatalogs(INITIAL_SYSTEM_CATALOGS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setScheduleTypes(INITIAL_SCHEDULE_TYPES);
    setUserSchedules(INITIAL_USER_SCHEDULES);
    localStorage.removeItem('sisceba_user_schedules');
    localStorage.removeItem('sisceba_user_schedules_v2');
  };

  const saveSchoolData = async (data: InstitutionalSchoolData): Promise<boolean> => {
    const updated: InstitutionalSchoolData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    setSchoolData(updated);
    localStorage.setItem('sisceba_school_data', JSON.stringify(updated));
    if (isSupabaseConfigured()) {
      const res = await syncWithCloud(
        () => supabaseSaveSchoolData(updated),
        'guardar datos institucionales del plantel'
      );
      return res === true;
    }
    return true;
  };

  const saveSystemCatalogs = async (catalogs: SystemCatalogs): Promise<boolean> => {
    const updated: SystemCatalogs = {
      ...catalogs,
      updatedAt: new Date().toISOString()
    };
    setSystemCatalogs(updated);
    localStorage.setItem('sisceba_catalogs', JSON.stringify(updated));
    if (isSupabaseConfigured()) {
      const res = await syncWithCloud(
        () => supabaseSaveCatalogs(updated),
        'guardar catálogos oficiales del sistema'
      );
      return res === true;
    }
    return true;
  };

  const addAuditLog = async (evento: string, detalles?: string): Promise<boolean> => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      evento,
      usuario: currentUser ? currentUser.username : 'sistema',
      rol: currentUser ? currentUser.role : 'SISTEMA',
      fecha: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ip: 'Localhost',
      detalles: detalles || '',
      createdAt: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]);
    localStorage.setItem('sisceba_audit_logs', JSON.stringify([newLog, ...auditLogs.slice(0, 49)]));
    if (isSupabaseConfigured()) {
      const res = await syncWithCloud(
        () => supabaseSaveAuditLog(newLog),
        `registrar evento de auditoría (${evento})`
      );
      return res === true;
    }
    return true;
  };

  const saveScheduleType = async (item: ScheduleTypeConfig): Promise<boolean> => {
    setScheduleTypes(prev => {
      const idx = prev.findIndex(t => t.id === item.id || t.codigo === item.codigo);
      let next: ScheduleTypeConfig[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = item;
      } else {
        next = [...prev, item];
      }
      localStorage.setItem('sisceba_schedule_types', JSON.stringify(next));
      return next;
    });

    if (isSupabaseConfigured()) {
      const res = await syncWithCloud(
        () => supabaseSaveScheduleType(item),
        `guardar tipo de horario ${item.nombre}`
      );
      return res === true;
    }
    return true;
  };

  // Métodos de Gestión CRP (Talleres y Calificaciones de 2 Momentos)
  const saveCRPTaller = async (taller: CRPTaller): Promise<boolean> => {
    setCrpTalleres(prev => {
      const idx = prev.findIndex(t => t.id === taller.id);
      let next: CRPTaller[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = taller;
      } else {
        next = [...prev, taller];
      }
      localStorage.setItem('sisceba_crp_talleres', JSON.stringify(next));
      return next;
    });

    if (isSupabaseConfigured()) {
      const res = await syncWithCloud(
        () => supabaseSaveCRPTaller(taller),
        `guardar taller CRP ${taller.nombre}`
      );
      return res === true;
    }
    return true;
  };

  const deleteCRPTaller = async (tallerId: string): Promise<boolean> => {
    setCrpTalleres(prev => {
      const next = prev.filter(t => t.id !== tallerId);
      localStorage.setItem('sisceba_crp_talleres', JSON.stringify(next));
      return next;
    });
    // Eliminar también inscritos huérfanos
    setCrpInscritos(prev => {
      const next = prev.filter(i => i.tallerId !== tallerId);
      localStorage.setItem('sisceba_crp_inscritos', JSON.stringify(next));
      return next;
    });

    if (isSupabaseConfigured()) {
      const res = await syncWithCloud(
        () => supabaseDeleteCRPTaller(tallerId),
        `eliminar taller CRP ${tallerId}`
      );
      return res === true;
    }
    return true;
  };

  const saveCRPInscrito = async (record: CRPEstudianteInscrito): Promise<boolean> => {
    setCrpInscritos(prev => {
      const idx = prev.findIndex(i => i.id === record.id);
      let next: CRPEstudianteInscrito[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = record;
      } else {
        next = [...prev, record];
      }
      localStorage.setItem('sisceba_crp_inscritos', JSON.stringify(next));
      return next;
    });

    if (isSupabaseConfigured()) {
      const res = await syncWithCloud(
        () => supabaseSaveCRPInscrito(record),
        `guardar inscripción CRP de ${record.studentName}`
      );
      return res === true;
    }
    return true;
  };

  const deleteCRPInscrito = async (id: string): Promise<boolean> => {
    setCrpInscritos(prev => {
      const next = prev.filter(i => i.id !== id);
      localStorage.setItem('sisceba_crp_inscritos', JSON.stringify(next));
      return next;
    });

    if (isSupabaseConfigured()) {
      const res = await syncWithCloud(
        () => supabaseDeleteCRPInscrito(id),
        `eliminar inscripción CRP ${id}`
      );
      return res === true;
    }
    return true;
  };

  const autoAssignCRPWorkshops = async (tallerIds: string[], gradoFilter?: string): Promise<number> => {
    // 1. Obtener talleres disponibles seleccionados
    const selectedWorkshops = crpTalleres.filter(t => tallerIds.includes(t.id) && t.activo);
    if (selectedWorkshops.length === 0) return 0;

    // 2. Estudiantes de Media General elegibles
    let elegibles = students.filter(s => s.level === 'MEDIA_GENERAL');
    if (gradoFilter && gradoFilter !== 'TODOS') {
      elegibles = elegibles.filter(s => s.grade === gradoFilter);
    }

    // 3. Filtrar los que ya están inscritos en algún taller
    const alreadyEnrolledStudentIds = new Set(crpInscritos.map(i => i.studentId));
    const pendingStudents = elegibles.filter(s => !alreadyEnrolledStudentIds.has(s.id));

    if (pendingStudents.length === 0) return 0;

    // 4. Calcular cupos disponibles por taller
    const enrollmentCounts: { [tallerId: string]: number } = {};
    selectedWorkshops.forEach(w => {
      enrollmentCounts[w.id] = crpInscritos.filter(i => i.tallerId === w.id).length;
    });

    let assignedCount = 0;
    const newEnrollments: CRPEstudianteInscrito[] = [];

    // Distribuir equitativamente respetando maxCupos (entre 20 y 25)
    for (const student of pendingStudents) {
      // Buscar taller que admita el grado del estudiante y tenga cupo disponible
      const eligibleWorkshops = selectedWorkshops.filter(w => {
        const hasCapacity = (enrollmentCounts[w.id] || 0) < w.maxCupos;
        const matchesGrade = !w.gradosPermitidos || w.gradosPermitidos.length === 0 || w.gradosPermitidos.includes(student.grade);
        return hasCapacity && matchesGrade;
      });

      if (eligibleWorkshops.length === 0) continue;

      // Ordenar por el que tenga menor ocupación actual para balancear
      eligibleWorkshops.sort((a, b) => (enrollmentCounts[a.id] || 0) - (enrollmentCounts[b.id] || 0));
      const chosen = eligibleWorkshops[0];

      const newRecord: CRPEstudianteInscrito = {
        id: `crp-enr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        tallerId: chosen.id,
        studentId: student.id,
        studentCedula: student.cedula || 'S/C',
        studentName: student.fullName,
        grado: student.grade,
        seccion: student.section,
        fechaInscripcion: new Date().toISOString(),
        asignacionMetodo: 'AUTOMATICA'
      };

      newEnrollments.push(newRecord);
      enrollmentCounts[chosen.id] = (enrollmentCounts[chosen.id] || 0) + 1;
      assignedCount++;
    }

    if (newEnrollments.length > 0) {
      setCrpInscritos(prev => {
        const next = [...prev, ...newEnrollments];
        localStorage.setItem('sisceba_crp_inscritos', JSON.stringify(next));
        return next;
      });

      // Persistir en paralelo o lote a Supabase
      if (isSupabaseConfigured()) {
        syncWithCloud(async () => {
          for (const item of newEnrollments) {
            await supabaseSaveCRPInscrito(item);
          }
          return true;
        }, `asignación masiva automatizada de ${assignedCount} estudiantes a CRP`).catch(e => console.warn(e));
      }
    }

    return assignedCount;
  };

  // --- Régimen MPPE: Pruebas de Revisión ---
  const saveRevisionEvaluation = async (rec: RevisionEvaluationRecord): Promise<boolean> => {
    setRevisionEvaluations(prev => {
      const idx = prev.findIndex(r => r.id === rec.id);
      const next = idx >= 0 ? [...prev] : [...prev, rec];
      if (idx >= 0) next[idx] = rec;
      localStorage.setItem('sisceba_revision_evaluations', JSON.stringify(next));
      return next;
    });
    if (isSupabaseConfigured()) {
      return (await syncWithCloud(() => supabaseSaveRevisionEvaluation(rec), 'guardar evaluación de revisión')) === true;
    }
    return true;
  };

  const deleteRevisionEvaluation = async (id: string): Promise<boolean> => {
    setRevisionEvaluations(prev => {
      const next = prev.filter(r => r.id !== id);
      localStorage.setItem('sisceba_revision_evaluations', JSON.stringify(next));
      return next;
    });
    if (isSupabaseConfigured()) {
      return (await syncWithCloud(() => supabaseDeleteRevisionEvaluation(id), 'eliminar evaluación de revisión')) === true;
    }
    return true;
  };

  // --- Régimen MPPE: Materia Pendiente ---
  const savePendingSubjectEnrollment = async (rec: PendingSubjectEnrollment): Promise<boolean> => {
    setPendingSubjectEnrollments(prev => {
      const idx = prev.findIndex(r => r.id === rec.id);
      const next = idx >= 0 ? [...prev] : [...prev, rec];
      if (idx >= 0) next[idx] = rec;
      localStorage.setItem('sisceba_pending_subjects', JSON.stringify(next));
      return next;
    });
    if (isSupabaseConfigured()) {
      return (await syncWithCloud(() => supabaseSavePendingSubjectEnrollment(rec), 'guardar inscripción materia pendiente')) === true;
    }
    return true;
  };

  const recordPendingSubjectGrade = async (
    enrollmentId: string,
    momentNumber: 1 | 2 | 3 | 4,
    score: number,
    notes?: string
  ): Promise<boolean> => {
    const gradeRecord: PendingSubjectGrade = {
      id: `psg-${enrollmentId}-m${momentNumber}`,
      enrollmentId,
      momentNumber,
      score,
      evaluatedAt: new Date().toISOString().split('T')[0],
      notes
    };

    setPendingSubjectEnrollments(prev => {
      const next = prev.map(enr => {
        if (enr.id !== enrollmentId) return enr;
        const currentGrades = enr.grades || [];
        const gIdx = currentGrades.findIndex(g => g.momentNumber === momentNumber);
        const nextGrades = gIdx >= 0 ? [...currentGrades] : [...currentGrades, gradeRecord];
        if (gIdx >= 0) nextGrades[gIdx] = gradeRecord;

        const isApproved = score >= 10;
        const status = isApproved ? 'APROBADA' : (momentNumber === 4 ? 'REPROBADA' : enr.status);
        const finalScore = isApproved ? score : (momentNumber === 4 ? score : enr.finalScore);

        return {
          ...enr,
          status,
          finalScore,
          grades: nextGrades,
          updatedAt: new Date().toISOString()
        };
      });
      localStorage.setItem('sisceba_pending_subjects', JSON.stringify(next));
      return next;
    });

    if (isSupabaseConfigured()) {
      await syncWithCloud(() => supabaseSavePendingSubjectGrade(gradeRecord), 'guardar nota de materia pendiente');
      const updated = pendingSubjectEnrollments.find(e => e.id === enrollmentId);
      if (updated) {
        await syncWithCloud(() => supabaseSavePendingSubjectEnrollment(updated), 'actualizar estado de materia pendiente');
      }
    }
    return true;
  };

  const deletePendingSubjectEnrollment = async (id: string): Promise<boolean> => {
    setPendingSubjectEnrollments(prev => {
      const next = prev.filter(r => r.id !== id);
      localStorage.setItem('sisceba_pending_subjects', JSON.stringify(next));
      return next;
    });
    if (isSupabaseConfigured()) {
      return (await syncWithCloud(() => supabaseDeletePendingSubjectEnrollment(id), 'eliminar materia pendiente')) === true;
    }
    return true;
  };

  // --- Traslado Oficial de Sección (A <-> B) ---
  const transferStudentSection = async (
    studentId: string,
    newSection: 'A' | 'B',
    reason: string
  ): Promise<{ success: boolean; message: string; count?: number }> => {
    const student = students.find(s => s.id === studentId);
    if (!student) {
      return { success: false, message: 'Estudiante no encontrado en el padrón escolar.' };
    }
    if (newSection !== 'A' && newSection !== 'B') {
      return { success: false, message: 'Sección inválida. La institución opera exclusivamente con secciones A y B.' };
    }
    if (student.section === newSection) {
      return { success: false, message: `El estudiante ya se encuentra matriculado en la Sección ${newSection}.` };
    }

    const previousSection = student.section as 'A' | 'B';

    // 1. Actualizar sección del estudiante
    const updatedStudent: Student = {
      ...student,
      section: newSection
    };
    setStudents(prev => {
      const next = prev.map(s => s.id === studentId ? updatedStudent : s);
      localStorage.setItem('sisceba_students', JSON.stringify(next));
      return next;
    });

    // 2. Migrar calificaciones y asistencias sin pérdida
    let migratedCount = 0;
    setDailyAttendance(prev => {
      const next = prev.map(a => {
        if (a.studentId === studentId) {
          migratedCount++;
          return { ...a, section: newSection };
        }
        return a;
      });
      localStorage.setItem('sisceba_daily_attendance', JSON.stringify(next));
      return next;
    });

    // 3. Registrar en bitácora de traslados oficiales
    const log: SectionTransferLog = {
      id: `trans-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      studentId: student.id,
      studentName: student.fullName,
      studentCedula: student.cedula,
      previousSection,
      newSection,
      grade: student.grade,
      level: student.level,
      reason,
      transferredBy: currentUser?.username || 'admin',
      transferredByName: currentUser?.fullName || 'Administración',
      transferredAt: new Date().toISOString(),
      recordsMigratedCount: migratedCount
    };

    setSectionTransfers(prev => {
      const next = [log, ...prev];
      localStorage.setItem('sisceba_section_transfers', JSON.stringify(next));
      return next;
    });

    // Sincronizar con Supabase / PostgreSQL local
    if (isSupabaseConfigured()) {
      await syncWithCloud(() => supabaseSaveStudent(updatedStudent), `traslado a sección ${newSection}`);
      await syncWithCloud(() => supabaseSaveSectionTransfer(log), 'registrar bitácora de traslado');
    }

    sendNotification({
      title: `Traslado Oficial de Sección: ${student.fullName}`,
      message: `El estudiante fue trasladado de la Sección ${previousSection} a la Sección ${newSection}. Se migraron ${migratedCount} registros asociados. Motivo: ${reason}`,
      category: 'INSTITUCIONAL',
      priority: 'MEDIA',
      recipientRole: 'COORDINACION',
      recipientName: 'Control de Estudios (UCE)',
      actionTab: 'GESTION',
      actionSubTab: 'INSCRIPCIONES',
      deliveryChannels: ['PORTAL', 'EMAIL']
    });

    return {
      success: true,
      message: `El estudiante ${student.fullName} fue trasladado con éxito a la Sección ${newSection}.`,
      count: migratedCount
    };
  };

  // --- Calificaciones Externas y Convalidaciones ---
  const saveExternalAcademicRecord = async (rec: ExternalAcademicRecord): Promise<boolean> => {
    setExternalAcademicRecords(prev => {
      const idx = prev.findIndex(r => r.id === rec.id);
      const next = idx >= 0 ? [...prev] : [...prev, rec];
      if (idx >= 0) next[idx] = rec;
      localStorage.setItem('sisceba_external_academic_records', JSON.stringify(next));
      return next;
    });
    if (isSupabaseConfigured()) {
      return (await syncWithCloud(() => supabaseSaveExternalAcademicRecord(rec), 'guardar calificación externa')) === true;
    }
    return true;
  };

  const deleteExternalAcademicRecord = async (id: string): Promise<boolean> => {
    setExternalAcademicRecords(prev => {
      const next = prev.filter(r => r.id !== id);
      localStorage.setItem('sisceba_external_academic_records', JSON.stringify(next));
      return next;
    });
    if (isSupabaseConfigured()) {
      return (await syncWithCloud(() => supabaseDeleteExternalAcademicRecord(id), 'eliminar calificación externa')) === true;
    }
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        users,
        addUser,
        updateUser,
        deleteUser,
        currentTeacherAssignments,
        getTeacherAssignments,
        saveTeacherAssignments,
        login,
        logout,
        currentLevel,
        setCurrentLevel,
        currentRole,
        setCurrentRole,
        switchActiveRole,
        activeLapso,
        setActiveLapso,
        currentSection,
        setCurrentSection,
        areas,
        levelAreas,
        competencies,
        indicators,
        strategies,
        addCompetency,
        addIndicator,
        transferCompetency,
        transferIndicator,
        addStrategy,
        transferStrategy,
        educationalResources,
        addEducationalResource,
        deleteEducationalResource,
        transferEducationalResource,
        plansQuincenal,
        savePlanQuincenal,
        updateQuincenalStatus,
        plansLapso,
        savePlanLapso,
        updateLapsoPlanStatus,
        students,
        levelStudents,
        addStudent,
        saveStudent,
        evaluations,
        recordEvaluation,
        bulkRecordEvaluations,
        adjustStudentGrade,
        aiActionPlans,
        generateAIActionPlan,
        updateAIPlanFeedback,
        remedialPlans,
        addRemedialPlan,
        updateRemedialStatus,
        councilMinutes,
        createCouncilMinute,
        signCouncilMinute,
        passes,
        addPass,
        deletePass,
        printPass,
        dailyAttendance,
        markDailyAttendance,
        accumulatedAttendance,
        conducts,
        addConduct,
        documentRequests,
        updateDocumentStatus,
        addDocumentRequest,
        adminBlocks,
        addAdminBlock,
        toggleAdminBlock,
        deleteAdminBlock,
        isStudentAdminBlocked,
        getStudentAdminBlock,
        titles,
        saveTitleRecord,
        deleteTitleRecord,
        schoolYearConfig,
        toggleLapsoGrading,
        updateLapsoConfig,
        getLapsoGradingStatus,
        isLapsoOpenForGrading,
        communityNotices,
        addCommunityNotice,
        updateCommunityNotice,
        deleteCommunityNotice,
        broadcastMessages,
        sendBroadcastMessage,
        deleteBroadcastMessage,
        birthdays,
        notifications,
        unreadNotificationsCount,
        sendNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        systemPrivileges,
        toggleSystemPrivilege,
        resetSystemPrivileges,
        userSchedules,
        currentUserSchedule,
        saveUserSchedule,
        getUserSchedule,
        schoolData,
        saveSchoolData,
        systemCatalogs,
        saveSystemCatalogs,
        auditLogs,
        addAuditLog,
        scheduleTypes,
        saveScheduleType,
        crpTalleres,
        crpInscritos,
        saveCRPTaller,
        deleteCRPTaller,
        saveCRPInscrito,
        deleteCRPInscrito,
        autoAssignCRPWorkshops,
        revisionEvaluations,
        saveRevisionEvaluation,
        deleteRevisionEvaluation,
        pendingSubjectEnrollments,
        savePendingSubjectEnrollment,
        recordPendingSubjectGrade,
        deletePendingSubjectEnrollment,
        sectionTransfers,
        transferStudentSection,
        externalAcademicRecords,
        saveExternalAcademicRecord,
        deleteExternalAcademicRecord,
        resetToSeedData,
        isSupabaseActive,
        supabaseStatusText,
        isSavingCloud,
        lastCloudSync,
        refreshFromSupabase,
        registrationCodes,
        createRegistrationCode,
        deleteRegistrationCode,
        cleanExpiredRegistrationCodes,
        validateAndUseRegistrationCode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};
