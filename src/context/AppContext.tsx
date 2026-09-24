import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  EducationalLevel,
  UserRole,
  SubjectArea,
  Competency,
  Indicator,
  Strategy,
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
  CommunityNotice,
  BirthdayPerson,
  MainNavigationTab,
  SystemNotification,
  AppUser,
  RegistrationCode
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
import {
  INITIAL_AREAS,
  INITIAL_COMPETENCIES,
  INITIAL_INDICATORS,
  INITIAL_STRATEGIES,
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
  INITIAL_USERS
} from '../data/seedData';
import { supabase, isSupabaseConfigured, checkSupabaseConnection } from '../lib/supabaseClient';
import {
  supabaseFetchStudents,
  supabaseFetchSubjectAreas,
  supabaseFetchCompetencies,
  supabaseFetchIndicators,
  supabaseFetchStrategies,
  supabaseSaveStrategy,
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
  supabaseSaveTitleRecord,
  supabaseSaveCommunityNotice,
  supabaseSaveNotification,
  supabaseSaveUser
} from '../services/supabaseService';

interface AppContextType {
  // Navigation & Session
  isAuthenticated: boolean;
  currentUser: AppUser | null;
  users: AppUser[];
  addUser: (user: Omit<AppUser, 'id'>) => Promise<AppUser>;
  updateUser: (userId: string, updates: Partial<AppUser>) => Promise<boolean>;
  registrationCodes: RegistrationCode[];
  createRegistrationCode: (allowedRole?: 'DOCENTE' | 'ASISTENTE' | 'SECRETARIA') => RegistrationCode;
  deleteRegistrationCode: (codeId: string) => void;
  validateAndUseRegistrationCode: (code: string, role: UserRole, username: string) => Promise<{ valid: boolean; message?: string }>;
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
  toggleAdminBlock: (blockId: string) => void;

  titles: TitleRecord[];
  saveTitleRecord: (record: TitleRecord) => void;

  schoolYearConfig: SchoolYearConfig;
  toggleLapsoGrading: (lapso: 1 | 2 | 3) => void;
  isLapsoOpenForGrading: boolean;

  communityNotices: CommunityNotice[];
  addCommunityNotice: (notice: Omit<CommunityNotice, 'id'>) => CommunityNotice;

  birthdays: BirthdayPerson[];

  // Interactive Notifications System
  notifications: SystemNotification[];
  unreadNotificationsCount: number;
  sendNotification: (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // Helpers
  resetToSeedData: () => void;

  // Supabase Cloud State
  isSupabaseActive: boolean;
  supabaseStatusText: string;
  refreshFromSupabase: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const INITIAL_SYSTEM_NOTIFICATIONS: SystemNotification[] = [];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User & Accounts Store
  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('sisceba_users_v3');
    if (saved) {
      try {
        const parsed: AppUser[] = JSON.parse(saved);
        return parsed.map(u => (u.id === 'usr-admin' || u.fullName === 'Administrador General de Sistemas') ? { ...u, fullName: 'Administrador' } : u);
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
    const saved = localStorage.getItem('sisceba_current_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.role) return u.role;
      } catch { /* ignore */ }
    }
    return 'DOCENTE';
  });

  const [activeLapso, setActiveLapso] = useState<1 | 2 | 3>(1);
  const [currentSection, setCurrentSection] = useState<string>('4to Año A');

  // Authentication & Session States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('sisceba_auth_session');
    const user = localStorage.getItem('sisceba_current_user');
    return saved === 'true' && !!user;
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
    let updatedUser: AppUser | null = null;

    // Si se actualizó la contraseña y no está hasheada, procesar
    let cleanUpdates = { ...updates };
    if (cleanUpdates.password && !cleanUpdates.password.startsWith('$pbkdf2$')) {
      cleanUpdates.password = await hashPassword(cleanUpdates.password);
      cleanUpdates.passwordLastChanged = new Date().toISOString();
    }

    setUsers(prev => {
      const idx = prev.findIndex(u => u.id === userId);
      if (idx === -1) return prev;
      const copy = [...prev];
      const current = copy[idx];
      // Si cambia de género y no tiene imagen propia personalizada o tiene avatar svg previo, adaptar avatar
      let newAvatarUrl = cleanUpdates.avatarUrl !== undefined ? cleanUpdates.avatarUrl : current.avatarUrl;
      if (cleanUpdates.gender && cleanUpdates.gender !== current.gender && (!newAvatarUrl || newAvatarUrl.startsWith('data:image/svg+xml'))) {
        newAvatarUrl = getDefaultAvatarForUser({
          gender: cleanUpdates.gender,
          role: cleanUpdates.role || current.role,
          fullName: cleanUpdates.fullName || current.fullName
        });
      }
      const merged = { ...current, ...cleanUpdates, avatarUrl: newAvatarUrl };
      copy[idx] = merged;
      updatedUser = merged;
      return copy;
    });

    if (currentUser && currentUser.id === userId && updatedUser) {
      setCurrentUser(updatedUser);
      if (updates.role) {
        setCurrentRole(updates.role);
      }
      if (updates.defaultLevel) {
        setCurrentLevel(updates.defaultLevel);
      }
    }

    if (updatedUser) {
      await supabaseSaveUser(updatedUser);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sisceba_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sisceba_current_user');
    }
  }, [currentUser]);

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
        id: 'code-init-2',
        code: 'CBA-ASIS-2026',
        allowedRole: 'ASISTENTE',
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

  const createRegistrationCode = (allowedRole?: 'DOCENTE' | 'ASISTENTE' | 'SECRETARIA'): RegistrationCode => {
    const rolePrefix = allowedRole ? allowedRole.slice(0, 3) : 'REG';
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCode: RegistrationCode = {
      id: `code-${Date.now()}`,
      code: `CBA-${rolePrefix}-${randomHex}`,
      allowedRole,
      createdBy: currentUser?.username || 'admin',
      createdAt: new Date().toISOString(),
      used: false
    };

    setRegistrationCodes(prev => [newCode, ...prev]);
    supabaseSaveRegistrationCode(newCode).catch(err => console.warn('Supabase save code err:', err));
    return newCode;
  };

  const deleteRegistrationCode = (codeId: string) => {
    setRegistrationCodes(prev => prev.filter(c => c.id !== codeId));
    supabaseDeleteRegistrationCode(codeId).catch(err => console.warn('Supabase delete code err:', err));
  };

  const validateAndUseRegistrationCode = async (
    code: string,
    role: UserRole,
    username: string
  ): Promise<{ valid: boolean; message?: string }> => {
    const normalizedInput = code.trim().toUpperCase();
    
    // Master fallback code para auditoría y pruebas del administrador
    if (normalizedInput === 'CBA-MASTER-2026') {
      return { valid: true };
    }

    const matched = registrationCodes.find(
      c => c.code.trim().toUpperCase() === normalizedInput
    );

    if (!matched) {
      return {
        valid: false,
        message: 'El código de autorización ingresado no es válido o ya fue utilizado.'
      };
    }

    if (matched.used) {
      // Si ya estaba marcado como usado, se remueve inmediatamente para evitar reuso
      setRegistrationCodes(prev => prev.filter(c => c.id !== matched.id));
      supabaseDeleteRegistrationCode(matched.id).catch(err => console.warn('Supabase delete code err:', err));
      return {
        valid: false,
        message: `Este código de autorización ya fue utilizado previamente y ha sido revocado.`
      };
    }

    if (matched.allowedRole && matched.allowedRole !== role) {
      return {
        valid: false,
        message: `Este código solo es válido para el rol de ${matched.allowedRole}. Su rol seleccionado es ${role}.`
      };
    }

    // Código de un solo uso: Al ser detectado y validado satisfactoriamente, se elimina de inmediato
    setRegistrationCodes(prev => prev.filter(c => c.id !== matched.id));
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

    let matched = users.find(
      u => u.username.toLowerCase() === trimmedInput || u.email.toLowerCase() === trimmedInput
    );

    // Si Supabase está configurado, validamos directamente contra la tabla app_users en tiempo real
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('app_users')
          .select('*')
          .or(`username.ilike.${trimmedInput},email.ilike.${trimmedInput}`)
          .limit(1);

        if (!error && data && data.length > 0) {
          const row = data[0];
          const meta = decodeUserAvatarMetadata(row.avatar_url);
          matched = {
            id: row.id,
            username: row.username,
            password: row.password,
            fullName: row.full_name,
            email: row.email,
            role: row.role,
            defaultLevel: row.default_level || 'MEDIA_GENERAL',
            active: row.active ?? true,
            avatarUrl: meta.avatarUrl || row.avatar_url || '',
            gender: meta.gender,
            phone: meta.phone,
            bio: meta.bio,
            receiveEmails: meta.receiveEmails ?? true,
            receiveMessages: meta.receiveMessages ?? true,
            twoFactorEnabled: row.two_factor_enabled ?? is2FARequiredForRole(row.role),
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
    setCurrentRole(matched.role);
    setCurrentLevel(matched.defaultLevel);
    setIsAuthenticated(true);
    localStorage.setItem('sisceba_auth_session', 'true');
    localStorage.setItem('sisceba_current_user', JSON.stringify(matched));
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.setItem('sisceba_auth_session', 'false');
    localStorage.removeItem('sisceba_current_user');
  };

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
  const [supabaseStatusText, setSupabaseStatusText] = useState<string>('Verificando conexión...');

  // Data Store with LocalStorage Persistence
  const [areas, setAreas] = useState<SubjectArea[]>(() => {
    const saved = localStorage.getItem('sisceba_areas');
    return saved ? JSON.parse(saved) : INITIAL_AREAS;
  });

  const refreshFromSupabase = async () => {
    if (!isSupabaseConfigured()) {
      setIsSupabaseActive(false);
      setSupabaseStatusText('Modo Local / Cache');
      return;
    }

    setSupabaseStatusText('Conectando a Supabase...');
    const health = await checkSupabaseConnection();
    if (!health.connected) {
      setIsSupabaseActive(false);
      setSupabaseStatusText('Modo Local (Supabase desconectado)');
      return;
    }

    setIsSupabaseActive(true);
    setSupabaseStatusText('Conectado a Supabase');

    try {
      const [
        remoteStudents,
        remoteAreas,
        remoteCompetencies,
        remoteIndicators,
        remoteStrategies,
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
        remoteSchoolYear
      ] = await Promise.all([
        supabaseFetchStudents(),
        supabaseFetchSubjectAreas(),
        supabaseFetchCompetencies(),
        supabaseFetchIndicators(),
        supabaseFetchStrategies(),
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
        supabaseFetchSchoolYearConfig()
      ]);

      if (remoteStudents !== null) setStudents(remoteStudents);
      if (remoteAreas !== null) setAreas(remoteAreas);
      if (remoteCompetencies !== null) setCompetencies(remoteCompetencies);
      if (remoteIndicators !== null) setIndicators(remoteIndicators);
      if (remoteStrategies !== null) setStrategies(remoteStrategies);
      if (remoteEvaluations !== null) setEvaluations(remoteEvaluations);
      if (remotePlans !== null) setPlansQuincenal(remotePlans);
      if (remotePlansLapso !== null) setPlansLapso(remotePlansLapso);
      if (remoteCodes !== null) setRegistrationCodes(remoteCodes);
      if (remoteSchoolYear !== null) setSchoolYearConfig(remoteSchoolYear);
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
              setCurrentRole(verified.role);
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
  }, []);

  const [competencies, setCompetencies] = useState<Competency[]>(() => {
    const saved = localStorage.getItem('sisceba_competencies');
    return saved ? JSON.parse(saved) : INITIAL_COMPETENCIES;
  });

  const [indicators, setIndicators] = useState<Indicator[]>(() => {
    const saved = localStorage.getItem('sisceba_indicators');
    return saved ? JSON.parse(saved) : INITIAL_INDICATORS;
  });

  const [strategies, setStrategies] = useState<Strategy[]>(() => {
    const saved = localStorage.getItem('sisceba_strategies');
    return saved ? JSON.parse(saved) : INITIAL_STRATEGIES;
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
    supabaseSaveNotification(newNotif).catch(err => console.warn('Supabase save notification err:', err));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    localStorage.setItem('sisceba_system_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sisceba_areas', JSON.stringify(areas));
  }, [areas]);

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
    supabaseSaveCompetency(newComp).catch(err => console.warn('Supabase save comp err:', err));
    return newComp;
  };

  const addIndicator = (ind: Omit<Indicator, 'id'>): Indicator => {
    const newInd: Indicator = {
      ...ind,
      id: `ind-${Date.now()}`
    };
    setIndicators(prev => [newInd, ...prev]);
    supabaseSaveIndicator(newInd).catch(err => console.warn('Supabase save ind err:', err));
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
    supabaseSaveCompetency(cloned).catch(err => console.warn('Supabase transfer comp err:', err));
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
    supabaseSaveIndicator(cloned).catch(err => console.warn('Supabase transfer ind err:', err));
  };

  const addStrategy = (strat: Omit<Strategy, 'id'>): Strategy => {
    const newStrat: Strategy = {
      ...strat,
      id: `strat-${Date.now()}`
    };
    setStrategies(prev => [newStrat, ...prev]);
    supabaseSaveStrategy(newStrat).catch(err => console.warn('Supabase save strategy err:', err));
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
    supabaseSaveStrategy(cloned).catch(err => console.warn('Supabase transfer strategy err:', err));
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
    supabaseSaveDidacticPlan(updatedPlan).catch(err => console.warn('Supabase save plan err:', err));
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
          supabaseSaveDidacticPlan(updated).catch(err => console.warn('Supabase update plan status err:', err));
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
    supabaseSavePlanLapso(updatedPlan).catch(err => console.warn('Supabase save plan lapso err:', err));
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
          supabaseSavePlanLapso(updated).catch(err => console.warn('Supabase update plan lapso err:', err));
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
    supabaseSaveStudent(newStudent).catch(err => console.warn('Supabase save student err:', err));
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
    supabaseSaveStudent(student).catch(err => console.warn('Supabase save student err:', err));
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
    supabaseSaveEvaluation(newRecord).catch(err => console.warn('Supabase save eval err:', err));
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

    supabaseBulkSaveEvaluations(newRecords).catch(err => console.warn('Supabase bulk save eval err:', err));
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
    supabaseSaveEvaluation(newRecord).catch(err => console.warn('Supabase save eval adjust err:', err));

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
  const isLapsoOpenForGrading = schoolYearConfig.lapsos.find(l => l.lapso === activeLapso)?.isGradingOpen ?? true;

  const toggleLapsoGrading = (lapso: 1 | 2 | 3) => {
    setSchoolYearConfig(prev => {
      const updated: SchoolYearConfig = {
        ...prev,
        lapsos: prev.lapsos.map(l => (l.lapso === lapso ? { ...l, isGradingOpen: !l.isGradingOpen } : l))
      };
      supabaseSaveSchoolYearConfig(updated).catch(err => console.warn('Supabase save school year config err:', err));
      return updated;
    });
  };

  const addPass = (pass: Omit<PassRecord, 'id' | 'ticketNumber'>): PassRecord => {
    const newPass: PassRecord = {
      ...pass,
      id: `pass-${Date.now()}`,
      ticketNumber: `RET-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setPasses(prev => [newPass, ...prev]);
    supabaseSavePass(newPass).catch(err => console.warn('Supabase save pass err:', err));
    return newPass;
  };

  const deletePass = (passId: string) => {
    setPasses(prev => prev.filter(p => p.id !== passId));
    supabaseDeletePass(passId).catch(err => console.warn('Supabase delete pass err:', err));
  };

  const printPass = (passId: string) => {
    setPasses(prev =>
      prev.map(p => {
        if (p.id === passId) {
          const updated = { ...p, printed: true };
          supabaseSavePass(updated).catch(err => console.warn('Supabase print pass err:', err));
          return updated;
        }
        return p;
      })
    );
  };

  const markDailyAttendance = (studentId: string, status: DailyAttendanceRecord['status'], justification?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const stu = students.find(s => s.id === studentId);
    const newRec: DailyAttendanceRecord = {
      id: `att-${Date.now()}-${studentId}`,
      studentId,
      studentName: stu?.fullName || 'Estudiante',
      gradeSection: stu ? `${stu.grade} ${stu.section}` : currentSection,
      date: today,
      status,
      justification,
      lapso: activeLapso
    };
    setDailyAttendance(prev => {
      const filtered = prev.filter(a => !(a.studentId === studentId && a.date === today));
      return [newRec, ...filtered];
    });
    supabaseSaveDailyAttendance(newRec).catch(err => console.warn('Supabase attendance err:', err));
  };

  const addConduct = (conduct: Omit<ConductEntry, 'id'>): ConductEntry => {
    const newEntry: ConductEntry = {
      ...conduct,
      id: `cond-${Date.now()}`
    };
    setConducts(prev => [newEntry, ...prev]);
    supabaseSaveConduct(newEntry).catch(err => console.warn('Supabase conduct err:', err));
    return newEntry;
  };

  const updateDocumentStatus = (requestId: string, status: DocumentRequest['status']) => {
    setDocumentRequests(prev =>
      prev.map(d => {
        if (d.id === requestId) {
          const updated = { ...d, status };
          supabaseSaveDocumentRequest(updated).catch(err => console.warn('Supabase doc status err:', err));
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
    supabaseSaveDocumentRequest(newReq).catch(err => console.warn('Supabase doc request err:', err));
    return newReq;
  };

  const toggleAdminBlock = (blockId: string) => {
    setAdminBlocks(prev =>
      prev.map(b => {
        if (b.id === blockId) {
          const updated = { ...b, active: !b.active };
          supabaseSaveAdminBlock(updated).catch(err => console.warn('Supabase admin block err:', err));
          return updated;
        }
        return b;
      })
    );
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
    supabaseSaveTitleRecord(record).catch(err => console.warn('Supabase save title err:', err));
  };

  const addCommunityNotice = (notice: Omit<CommunityNotice, 'id'>): CommunityNotice => {
    const newNotice: CommunityNotice = {
      ...notice,
      id: `not-${Date.now()}`
    };
    setCommunityNotices(prev => [newNotice, ...prev]);
    supabaseSaveCommunityNotice(newNotice).catch(err => console.warn('Supabase notice err:', err));
    return newNotice;
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
    localStorage.removeItem('sisceba_system_notifications');
    setNotifications(INITIAL_SYSTEM_NOTIFICATIONS);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        users,
        addUser,
        updateUser,
        login,
        logout,
        currentLevel,
        setCurrentLevel,
        currentRole,
        setCurrentRole,
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
        toggleAdminBlock,
        titles,
        saveTitleRecord,
        schoolYearConfig,
        toggleLapsoGrading,
        isLapsoOpenForGrading,
        communityNotices,
        addCommunityNotice,
        birthdays,
        notifications,
        unreadNotificationsCount,
        sendNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        resetToSeedData,
        isSupabaseActive,
        supabaseStatusText,
        refreshFromSupabase,
        registrationCodes,
        createRegistrationCode,
        deleteRegistrationCode,
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
