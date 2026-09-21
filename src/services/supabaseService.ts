import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  Student,
  SubjectArea,
  Competency,
  Indicator,
  EvaluationRecord,
  PlanQuincenal,
  PassRecord,
  DailyAttendanceRecord,
  ConductEntry,
  DocumentRequest,
  AdministrativeBlockEntry,
  TitleRecord,
  CommunityNotice,
  SystemNotification,
  AppUser
} from '../types';

/**
 * SERVICIO DE DATOS EN LA NUBE CON SUPABASE (SICE-CBA)
 * Realiza operaciones CRUD con tipado fuerte y conversión de convenciones (camelCase <-> snake_case).
 */

// ==========================================
// 1. ESTUDIANTES (students)
// ==========================================
export const supabaseFetchStudents = async (): Promise<Student[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('full_name', { ascending: true });

    if (error || !data) {
      console.warn('Supabase fetch students aviso:', error?.message);
      return null;
    }

    return data.map(row => ({
      id: row.id,
      cedula: row.cedula,
      fullName: row.full_name,
      gender: row.gender,
      birthDate: row.birth_date,
      level: row.level,
      grade: row.grade,
      section: row.section,
      representativeName: row.representative_name,
      representativeEmail: row.representative_email || '',
      representativePhone: row.representative_phone || '',
      status: row.status,
      pendingSubjects: row.pending_subjects || [],
      avatarUrl: row.avatar_url
    }));
  } catch (e) {
    console.error('Error al consultar estudiantes en Supabase:', e);
    return null;
  }
};

export const supabaseSaveStudent = async (student: Student): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const row = {
      id: student.id,
      cedula: student.cedula,
      full_name: student.fullName,
      gender: student.gender,
      birth_date: student.birthDate,
      level: student.level,
      grade: student.grade,
      section: student.section,
      representative_name: student.representativeName,
      representative_email: student.representativeEmail,
      representative_phone: student.representativePhone,
      status: student.status,
      pending_subjects: student.pendingSubjects || [],
      avatar_url: student.avatarUrl
    };
    const { error } = await supabase.from('students').upsert(row);
    if (error) {
      console.warn('Error al guardar estudiante en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Error en supabaseSaveStudent:', e);
    return false;
  }
};

// ==========================================
// 2. MATERIAS / ASIGNATURAS (subject_areas)
// ==========================================
export const supabaseFetchSubjectAreas = async (): Promise<SubjectArea[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('subject_areas').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      code: row.code,
      name: row.name,
      level: row.level,
      type: row.type,
      areaProfile: row.area_profile || '',
      teacherProfile: row.teacher_profile || '',
      weeklyHours: row.weekly_hours || 4,
      iconName: row.icon_name || 'BookOpen'
    }));
  } catch (e) {
    console.error('Error en supabaseFetchSubjectAreas:', e);
    return null;
  }
};

// ==========================================
// 3. COMPETENCIAS E INDICADORES
// ==========================================
export const supabaseFetchCompetencies = async (): Promise<Competency[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('competencies').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      areaId: row.area_id,
      code: row.code,
      title: row.title,
      description: row.description,
      level: row.level,
      lapso: row.lapso
    }));
  } catch (e) {
    console.error('Error en supabaseFetchCompetencies:', e);
    return null;
  }
};

export const supabaseSaveCompetency = async (comp: Competency): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('competencies').upsert({
      id: comp.id,
      area_id: comp.areaId,
      code: comp.code,
      title: comp.title,
      description: comp.description,
      level: comp.level,
      lapso: comp.lapso
    });
    return !error;
  } catch {
    return false;
  }
};

export const supabaseFetchIndicators = async (): Promise<Indicator[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('indicators').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      competencyId: row.competency_id,
      areaId: row.area_id,
      code: row.code,
      description: row.description,
      level: row.level,
      lapso: row.lapso,
      weight: row.weight ? Number(row.weight) : undefined,
      evaluationInstrument: row.evaluation_instrument
    }));
  } catch (e) {
    console.error('Error en supabaseFetchIndicators:', e);
    return null;
  }
};

export const supabaseSaveIndicator = async (ind: Indicator): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('indicators').upsert({
      id: ind.id,
      competency_id: ind.competencyId,
      area_id: ind.areaId,
      code: ind.code,
      description: ind.description,
      level: ind.level,
      lapso: ind.lapso,
      weight: ind.weight,
      evaluation_instrument: ind.evaluationInstrument
    });
    return !error;
  } catch {
    return false;
  }
};

// ==========================================
// 4. CALIFICACIONES Y EVALUACIONES (evaluation_records)
// ==========================================
export const supabaseFetchEvaluations = async (): Promise<EvaluationRecord[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('evaluation_records').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      studentId: row.student_id,
      areaId: row.area_id,
      indicatorId: row.indicator_id,
      moment: row.moment,
      lapso: row.lapso,
      scoreNumeric: row.score_numeric !== null ? Number(row.score_numeric) : undefined,
      scoreQualitative: row.score_qualitative,
      scoreLiteral: row.score_literal,
      roboticsScore: row.robotics_score,
      observations: row.observations,
      recordedAt: row.recorded_at,
      teacherId: row.teacher_id || 'docente'
    }));
  } catch (e) {
    console.error('Error en supabaseFetchEvaluations:', e);
    return null;
  }
};

export const supabaseSaveEvaluation = async (rec: EvaluationRecord): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('evaluation_records').upsert({
      id: rec.id,
      student_id: rec.studentId,
      area_id: rec.areaId,
      indicator_id: rec.indicatorId || null,
      moment: rec.moment,
      lapso: rec.lapso,
      score_numeric: rec.scoreNumeric ?? null,
      score_qualitative: rec.scoreQualitative ?? null,
      score_literal: rec.scoreLiteral ?? null,
      robotics_score: rec.roboticsScore ? rec.roboticsScore : null,
      observations: rec.observations || null,
      recorded_at: rec.recordedAt,
      teacher_id: rec.teacherId
    });
    return !error;
  } catch (e) {
    console.error('Error en supabaseSaveEvaluation:', e);
    return false;
  }
};

export const supabaseBulkSaveEvaluations = async (records: EvaluationRecord[]): Promise<boolean> => {
  if (!isSupabaseConfigured() || records.length === 0) return false;
  try {
    const rows = records.map(rec => ({
      id: rec.id,
      student_id: rec.studentId,
      area_id: rec.areaId,
      indicator_id: rec.indicatorId || null,
      moment: rec.moment,
      lapso: rec.lapso,
      score_numeric: rec.scoreNumeric ?? null,
      score_qualitative: rec.scoreQualitative ?? null,
      score_literal: rec.scoreLiteral ?? null,
      robotics_score: rec.roboticsScore ? rec.roboticsScore : null,
      observations: rec.observations || null,
      recorded_at: rec.recordedAt,
      teacher_id: rec.teacherId
    }));
    const { error } = await supabase.from('evaluation_records').upsert(rows);
    return !error;
  } catch (e) {
    console.error('Error en supabaseBulkSaveEvaluations:', e);
    return false;
  }
};

// ==========================================
// 5. PLANIFICACIONES DIDÁCTICAS (didactic_plans)
// ==========================================
export const supabaseFetchDidacticPlans = async (): Promise<PlanQuincenal[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('didactic_plans').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      areaId: row.area_id,
      level: row.level,
      gradeSection: row.grade_section,
      lapso: row.lapso,
      startDate: row.start_date,
      endDate: row.end_date,
      title: row.title,
      projectTheme: row.project_theme,
      status: row.status,
      competencyIds: row.competency_ids || [],
      indicatorIds: row.indicator_ids || [],
      teachingStrategyIds: row.teaching_strategy_ids || [],
      evaluationStrategyIds: row.evaluation_strategy_ids || [],
      pedagogicalActivities: row.pedagogical_activities || '',
      differentiationNotes: row.differentiation_notes || '',
      reviewFeedback: row.review_feedback,
      reviewedBy: row.reviewed_by,
      updatedAt: row.updated_at ? row.updated_at.split('T')[0] : '',
      docenteName: row.docente_name,
      schoolYear: row.school_year,
      periodoQuincenal: row.periodo_quincenal,
      componente: row.componente,
      temaGenerador: row.tema_generador,
      rows: row.rows || [],
      actividadesInicio: row.actividades_inicio,
      actividadesDesarrollo: row.actividades_desarrollo,
      actividadesCierre: row.actividades_cierre,
      recursos: row.recursos,
      fuentesConsulta: row.fuentes_consulta
    }));
  } catch (e) {
    console.error('Error en supabaseFetchDidacticPlans:', e);
    return null;
  }
};

export const supabaseSaveDidacticPlan = async (plan: PlanQuincenal): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const row = {
      id: plan.id,
      area_id: plan.areaId,
      level: plan.level,
      grade_section: plan.gradeSection,
      lapso: plan.lapso,
      start_date: plan.startDate,
      end_date: plan.endDate,
      title: plan.title,
      project_theme: plan.projectTheme || null,
      status: plan.status,
      competency_ids: plan.competencyIds || [],
      indicator_ids: plan.indicatorIds || [],
      teaching_strategy_ids: plan.teachingStrategyIds || [],
      evaluation_strategy_ids: plan.evaluationStrategyIds || [],
      pedagogical_activities: plan.pedagogicalActivities || '',
      differentiation_notes: plan.differentiationNotes || '',
      review_feedback: plan.reviewFeedback || null,
      reviewed_by: plan.reviewedBy || null,
      docente_name: plan.docenteName || null,
      school_year: plan.schoolYear || '2026 - 2027',
      periodo_quincenal: plan.periodoQuincenal || null,
      componente: plan.componente || null,
      tema_generador: plan.temaGenerador || null,
      rows: plan.rows || [],
      actividades_inicio: plan.actividadesInicio || null,
      actividades_desarrollo: plan.actividadesDesarrollo || null,
      actividades_cierre: plan.actividadesCierre || null,
      recursos: plan.recursos || null,
      fuentes_consulta: plan.fuentesConsulta || null,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('didactic_plans').upsert(row);
    return !error;
  } catch (e) {
    console.error('Error en supabaseSaveDidacticPlan:', e);
    return false;
  }
};

// ==========================================
// 6. PASES DE RETRASO / PORTERÍA (pass_records)
// ==========================================
export const supabaseFetchPasses = async (): Promise<PassRecord[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('pass_records')
      .select('*')
      .order('date', { ascending: false });
    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      ticketNumber: row.ticket_number,
      studentId: row.student_id,
      studentName: row.student_name,
      gradeSection: row.grade_section,
      date: row.date,
      time: row.time,
      reason: row.reason || '',
      authorizedBy: row.authorized_by || '',
      printed: row.printed ?? false
    }));
  } catch (e) {
    console.error('Error en supabaseFetchPasses:', e);
    return null;
  }
};

export const supabaseSavePass = async (pass: PassRecord): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('pass_records').upsert({
      id: pass.id,
      ticket_number: pass.ticketNumber,
      student_id: pass.studentId,
      student_name: pass.studentName,
      grade_section: pass.gradeSection,
      date: pass.date,
      time: pass.time,
      reason: pass.reason,
      authorized_by: pass.authorizedBy,
      printed: pass.printed
    });
    return !error;
  } catch {
    return false;
  }
};

export const supabaseDeletePass = async (passId: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('pass_records').delete().eq('id', passId);
    return !error;
  } catch {
    return false;
  }
};

// ==========================================
// 7. ASISTENCIA DIARIA (daily_attendance)
// ==========================================
export const supabaseFetchDailyAttendance = async (): Promise<DailyAttendanceRecord[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('daily_attendance').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      studentId: row.student_id,
      studentName: row.student_name || '',
      gradeSection: row.grade_section || '',
      date: row.date,
      status: row.status,
      justification: row.justification || undefined,
      lapso: row.lapso || 1
    }));
  } catch (e) {
    console.error('Error en supabaseFetchDailyAttendance:', e);
    return null;
  }
};

export const supabaseSaveDailyAttendance = async (att: DailyAttendanceRecord): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('daily_attendance').upsert({
      id: att.id,
      student_id: att.studentId,
      student_name: att.studentName,
      grade_section: att.gradeSection,
      date: att.date,
      status: att.status,
      justification: att.justification || null,
      lapso: att.lapso
    });
    return !error;
  } catch {
    return false;
  }
};

// ==========================================
// 8. CONDUCTA Y CONVIVENCIA (conduct_entries)
// ==========================================
export const supabaseFetchConducts = async (): Promise<ConductEntry[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('conduct_entries').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      studentId: row.student_id,
      studentName: row.student_name,
      gradeSection: row.grade_section,
      date: row.date,
      lapso: row.lapso,
      type: row.type,
      description: row.description,
      agreements: row.agreements || '',
      reportedBy: row.reported_by
    }));
  } catch {
    return null;
  }
};

export const supabaseSaveConduct = async (entry: ConductEntry): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('conduct_entries').upsert({
      id: entry.id,
      student_id: entry.studentId,
      student_name: entry.studentName,
      grade_section: entry.gradeSection,
      date: entry.date,
      lapso: entry.lapso,
      type: entry.type,
      description: entry.description,
      agreements: entry.agreements,
      reported_by: entry.reportedBy
    });
    return !error;
  } catch {
    return false;
  }
};

// ==========================================
// 9. TRÁMITES Y CONSTANCIAS (document_requests)
// ==========================================
export const supabaseFetchDocumentRequests = async (): Promise<DocumentRequest[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('document_requests').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      trackingCode: row.tracking_code,
      representativeName: row.representative_name,
      studentName: row.student_name,
      gradeSection: row.grade_section || '',
      documentType: row.document_type,
      department: row.department,
      requestDate: row.request_date,
      elapsedDays: row.elapsed_days || 0,
      status: row.status,
      notes: row.notes || undefined
    }));
  } catch {
    return null;
  }
};

export const supabaseSaveDocumentRequest = async (doc: DocumentRequest): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('document_requests').upsert({
      id: doc.id,
      tracking_code: doc.trackingCode,
      representative_name: doc.representativeName,
      student_name: doc.studentName,
      grade_section: doc.gradeSection,
      document_type: doc.documentType,
      department: doc.department,
      request_date: doc.requestDate,
      elapsed_days: doc.elapsedDays,
      status: doc.status,
      notes: doc.notes || null
    });
    return !error;
  } catch {
    return false;
  }
};

// ==========================================
// 10. BLOQUEOS ADMINISTRATIVOS (administrative_blocks)
// ==========================================
export const supabaseFetchAdminBlocks = async (): Promise<AdministrativeBlockEntry[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('administrative_blocks').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      representativeId: row.representative_id || 'rep',
      representativeName: row.representative_name,
      studentId: row.student_id,
      studentName: row.student_name,
      gradeSection: row.grade_section || '',
      reason: row.reason,
      blockDate: row.block_date,
      active: row.active ?? true,
      debtAmount: row.debt_amount
    }));
  } catch {
    return null;
  }
};

export const supabaseSaveAdminBlock = async (block: AdministrativeBlockEntry): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('administrative_blocks').upsert({
      id: block.id,
      representative_id: block.representativeId,
      representative_name: block.representativeName,
      student_id: block.studentId,
      student_name: block.studentName,
      grade_section: block.gradeSection,
      reason: block.reason,
      block_date: block.blockDate,
      active: block.active,
      debt_amount: block.debtAmount || null
    });
    return !error;
  } catch {
    return false;
  }
};

// ==========================================
// 11. TÍTULOS DE BACHILLER (title_records)
// ==========================================
export const supabaseFetchTitleRecords = async (): Promise<TitleRecord[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('title_records').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      studentId: row.student_id,
      studentName: row.student_name,
      cedula: row.cedula,
      schoolYear: row.school_year,
      graduationYear: row.graduation_year,
      serialNumber: row.serial_number,
      tomo: row.tomo,
      folio: row.folio,
      registeredCode: row.registered_code,
      calibrated: row.calibrated ?? true
    }));
  } catch {
    return null;
  }
};

export const supabaseSaveTitleRecord = async (title: TitleRecord): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('title_records').upsert({
      id: title.id,
      student_id: title.studentId,
      student_name: title.studentName,
      cedula: title.cedula,
      school_year: title.schoolYear,
      graduation_year: title.graduationYear,
      serial_number: title.serialNumber,
      tomo: title.tomo,
      folio: title.folio,
      registered_code: title.registeredCode,
      calibrated: title.calibrated
    });
    return !error;
  } catch {
    return false;
  }
};

// ==========================================
// 12. CARTELERA Y NOTICIAS (community_notices)
// ==========================================
export const supabaseFetchCommunityNotices = async (): Promise<CommunityNotice[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('community_notices').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      date: row.date,
      type: row.type,
      targetAudience: row.target_audience,
      author: row.author,
      pinned: row.pinned ?? false
    }));
  } catch {
    return null;
  }
};

export const supabaseSaveCommunityNotice = async (notice: CommunityNotice): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('community_notices').upsert({
      id: notice.id,
      title: notice.title,
      content: notice.content,
      date: notice.date,
      type: notice.type,
      target_audience: notice.targetAudience,
      author: notice.author,
      pinned: notice.pinned ?? false
    });
    return !error;
  } catch {
    return false;
  }
};

// ==========================================
// 13. NOTIFICACIONES DEL SISTEMA (system_notifications)
// ==========================================
export const supabaseFetchNotifications = async (): Promise<SystemNotification[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('system_notifications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      title: row.title,
      message: row.message,
      timestamp: row.timestamp || 'Reciente',
      read: row.read ?? false,
      category: row.category,
      priority: row.priority,
      recipientRole: row.recipient_role,
      recipientName: row.recipient_name,
      studentName: row.student_name,
      actionTab: row.action_tab,
      actionSubTab: row.action_sub_tab,
      deliveryChannels: row.delivery_channels || ['PORTAL']
    }));
  } catch {
    return null;
  }
};

export const supabaseSaveNotification = async (notif: SystemNotification): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('system_notifications').upsert({
      id: notif.id,
      title: notif.title,
      message: notif.message,
      timestamp: notif.timestamp,
      read: notif.read,
      category: notif.category,
      priority: notif.priority,
      recipient_role: notif.recipientRole,
      recipient_name: notif.recipientName || null,
      student_name: notif.studentName || null,
      action_tab: notif.actionTab || null,
      action_sub_tab: notif.actionSubTab || null,
      delivery_channels: notif.deliveryChannels || ['PORTAL']
    });
    return !error;
  } catch {
    return false;
  }
};

// ==========================================
// 14. USUARIOS DEL SISTEMA (app_users)
// ==========================================
export const supabaseFetchUsers = async (): Promise<AppUser[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('app_users').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      username: row.username,
      password: row.password,
      fullName: row.full_name,
      email: row.email,
      role: row.role,
      defaultLevel: row.default_level || 'MEDIA_GENERAL',
      active: row.active ?? true,
      avatarUrl: row.avatar_url
    }));
  } catch {
    return null;
  }
};

export const supabaseSaveUser = async (user: AppUser): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('app_users').upsert({
      id: user.id,
      username: user.username,
      password: user.password,
      full_name: user.fullName,
      email: user.email,
      role: user.role,
      default_level: user.defaultLevel,
      active: user.active,
      avatar_url: user.avatarUrl
    });
    return !error;
  } catch {
    return false;
  }
};
