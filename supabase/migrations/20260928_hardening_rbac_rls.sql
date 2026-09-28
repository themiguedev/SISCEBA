-- ==============================================================================
-- SICE-CBA: Migración de Hardening de Base de Datos y Políticas RLS
-- Colegio Bellas Artes • Control Estricto RBAC (8 Roles Institucionales)
-- Fecha: 28 de Septiembre de 2026
-- ==============================================================================

-- 1. ACTIVACIÓN ESTRICTA DE ROW LEVEL SECURITY EN TODAS LAS TABLAS DEL SISTEMA
ALTER TABLE IF EXISTS app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS registration_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subject_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS didactic_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS plans_quincenales ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS plans_lapso ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS evaluation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pass_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS daily_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS conduct_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS administrative_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS title_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS community_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS school_year_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS system_privileges ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS institutional_school_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS system_catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS system_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS schedule_types ENABLE ROW LEVEL SECURITY;

-- 2. FUNCIONES AUXILIARES DE RESOLUCIÓN DE ROL INSTITUCIONAL
-- Determina el rol del usuario conectado mediante JWT o claims de Supabase
CREATE OR REPLACE FUNCTION auth.current_institutional_role()
RETURNS TEXT AS $$
DECLARE
    user_claim_role TEXT;
    db_user_role TEXT;
    jwt_user_id TEXT;
BEGIN
    jwt_user_id := NULLIF(current_setting('request.jwt.claim.sub', true), '')::TEXT;
    user_claim_role := NULLIF(current_setting('request.jwt.claim.role', true), '')::TEXT;

    IF user_claim_role IS NOT NULL AND user_claim_role NOT IN ('authenticated', 'anon', '') THEN
        RETURN user_claim_role;
    END IF;

    -- Si el token solo provee el ID de usuario, consultar el rol en app_users
    IF jwt_user_id IS NOT NULL THEN
        SELECT role INTO db_user_role FROM app_users WHERE id = jwt_user_id LIMIT 1;
        IF db_user_role IS NOT NULL THEN
            RETURN db_user_role;
        END IF;
    END IF;

    RETURN 'ANON';
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 3. LIMPIEZA DE POLÍTICAS PREVIAS PERMISIVAS (USING true)
DO $$
DECLARE
    tbl RECORD;
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
          AND policyname LIKE 'Permitir%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END
$$;

-- 4. POLÍTICAS PARTICULARES POR MÓDULO OPERATIVO Y ROL INSTITUCIONAL

-- ------------------------------------------------------------------------------
-- A. TABLA: app_users (Usuarios y Cuentas)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS rls_admin_all_users ON app_users;
CREATE POLICY rls_admin_all_users ON app_users
    FOR ALL
    TO authenticated
    USING (
        auth.current_institutional_role() IN ('ADMINISTRADOR', 'DIRECTOR')
    );

DROP POLICY IF EXISTS rls_user_self_read ON app_users;
CREATE POLICY rls_user_self_read ON app_users
    FOR SELECT
    TO authenticated
    USING (
        id = NULLIF(current_setting('request.jwt.claim.sub', true), '')::TEXT
        OR auth.current_institutional_role() IN ('COORDINACION', 'SECRETARIA')
    );

-- ------------------------------------------------------------------------------
-- B. TABLA: students (Padrón Estudiantil)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS rls_staff_students ON students;
CREATE POLICY rls_staff_students ON students
    FOR ALL
    TO authenticated
    USING (
        auth.current_institutional_role() IN ('ADMINISTRADOR', 'DIRECTOR', 'COORDINACION', 'SECRETARIA')
    );

DROP POLICY IF EXISTS rls_assistant_teacher_read_students ON students;
CREATE POLICY rls_assistant_teacher_read_students ON students
    FOR SELECT
    TO authenticated
    USING (
        auth.current_institutional_role() IN ('DOCENTE', 'ASISTENTE')
    );

DROP POLICY IF EXISTS rls_student_self_read ON students;
CREATE POLICY rls_student_self_read ON students
    FOR SELECT
    TO authenticated
    USING (
        auth.current_institutional_role() = 'ESTUDIANTE'
        AND id = NULLIF(current_setting('request.jwt.claim.sub', true), '')::TEXT
    );

DROP POLICY IF EXISTS rls_representative_students_read ON students;
CREATE POLICY rls_representative_students_read ON students
    FOR SELECT
    TO authenticated
    USING (
        auth.current_institutional_role() = 'REPRESENTANTE'
        AND (
            representative_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')::TEXT
            OR representative_id_number = (
                SELECT id_number FROM app_users 
                WHERE id = NULLIF(current_setting('request.jwt.claim.sub', true), '')::TEXT
            )
        )
    );

-- ------------------------------------------------------------------------------
-- C. TABLA: evaluation_records (Calificaciones: Inicial, Primaria, Media General)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS rls_admin_coord_evaluations ON evaluation_records;
CREATE POLICY rls_admin_coord_evaluations ON evaluation_records
    FOR ALL
    TO authenticated
    USING (
        auth.current_institutional_role() IN ('ADMINISTRADOR', 'DIRECTOR', 'COORDINACION')
    );

DROP POLICY IF EXISTS rls_teacher_evaluations ON evaluation_records;
CREATE POLICY rls_teacher_evaluations ON evaluation_records
    FOR ALL
    TO authenticated
    USING (
        auth.current_institutional_role() = 'DOCENTE'
        AND (
            teacher_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')::TEXT
            OR teacher_id IS NULL
        )
    );

DROP POLICY IF EXISTS rls_secretary_read_evaluations ON evaluation_records;
CREATE POLICY rls_secretary_read_evaluations ON evaluation_records
    FOR SELECT
    TO authenticated
    USING (
        auth.current_institutional_role() = 'SECRETARIA'
    );

DROP POLICY IF EXISTS rls_student_self_evaluations ON evaluation_records;
CREATE POLICY rls_student_self_evaluations ON evaluation_records
    FOR SELECT
    TO authenticated
    USING (
        auth.current_institutional_role() = 'ESTUDIANTE'
        AND student_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')::TEXT
    );

DROP POLICY IF EXISTS rls_representative_evaluations ON evaluation_records;
CREATE POLICY rls_representative_evaluations ON evaluation_records
    FOR SELECT
    TO authenticated
    USING (
        auth.current_institutional_role() = 'REPRESENTANTE'
        AND student_id IN (
            SELECT s.id FROM students s
            WHERE s.representative_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')::TEXT
               OR s.representative_id_number = (
                   SELECT u.id_number FROM app_users u 
                   WHERE u.id = NULLIF(current_setting('request.jwt.claim.sub', true), '')::TEXT
               )
        )
    );

-- Nota: El rol ASISTENTE queda explícitamente sin permisos sobre evaluation_records.

-- ------------------------------------------------------------------------------
-- D. TABLA: daily_attendance & pass_records (Asistencias y Pases de Retraso)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS rls_attendance_staff_all ON daily_attendance;
CREATE POLICY rls_attendance_staff_all ON daily_attendance
    FOR ALL
    TO authenticated
    USING (
        auth.current_institutional_role() IN ('ADMINISTRADOR', 'DIRECTOR', 'COORDINACION', 'DOCENTE', 'ASISTENTE')
    );

DROP POLICY IF EXISTS rls_attendance_secretary_read ON daily_attendance;
CREATE POLICY rls_attendance_secretary_read ON daily_attendance
    FOR SELECT
    TO authenticated
    USING (
        auth.current_institutional_role() = 'SECRETARIA'
    );

DROP POLICY IF EXISTS rls_passes_assistant_admin_all ON pass_records;
CREATE POLICY rls_passes_assistant_admin_all ON pass_records
    FOR ALL
    TO authenticated
    USING (
        auth.current_institutional_role() IN ('ADMINISTRADOR', 'DIRECTOR', 'COORDINACION', 'ASISTENTE')
    );

DROP POLICY IF EXISTS rls_passes_docente_sec_read ON pass_records;
CREATE POLICY rls_passes_docente_sec_read ON pass_records
    FOR SELECT
    TO authenticated
    USING (
        auth.current_institutional_role() IN ('DOCENTE', 'SECRETARIA')
    );

-- ------------------------------------------------------------------------------
-- E. TABLA: document_requests (Solicitud y Emisión de Documentos / Constancias)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS rls_docs_secretary_admin_all ON document_requests;
CREATE POLICY rls_docs_secretary_admin_all ON document_requests
    FOR ALL
    TO authenticated
    USING (
        auth.current_institutional_role() IN ('ADMINISTRADOR', 'DIRECTOR', 'SECRETARIA')
    );

DROP POLICY IF EXISTS rls_docs_representative_submit ON document_requests;
CREATE POLICY rls_docs_representative_submit ON document_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.current_institutional_role() IN ('REPRESENTANTE', 'ESTUDIANTE')
    );

DROP POLICY IF EXISTS rls_docs_representative_read ON document_requests;
CREATE POLICY rls_docs_representative_read ON document_requests
    FOR SELECT
    TO authenticated
    USING (
        auth.current_institutional_role() IN ('ADMINISTRADOR', 'DIRECTOR', 'COORDINACION', 'SECRETARIA', 'REPRESENTANTE', 'ESTUDIANTE')
    );

-- ------------------------------------------------------------------------------
-- F. TABLA: system_privileges & system_audit_logs (Seguridad y Auditoría CEO)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS rls_audit_admin_only ON system_audit_logs;
CREATE POLICY rls_audit_admin_only ON system_audit_logs
    FOR ALL
    TO authenticated
    USING (
        auth.current_institutional_role() IN ('ADMINISTRADOR', 'DIRECTOR')
    );

DROP POLICY IF EXISTS rls_audit_system_insert ON system_audit_logs;
CREATE POLICY rls_audit_system_insert ON system_audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS rls_privileges_admin_all ON system_privileges;
CREATE POLICY rls_privileges_admin_all ON system_privileges
    FOR ALL
    TO authenticated
    USING (
        auth.current_institutional_role() IN ('ADMINISTRADOR', 'DIRECTOR')
    );

DROP POLICY IF EXISTS rls_privileges_staff_read ON system_privileges;
CREATE POLICY rls_privileges_staff_read ON system_privileges
    FOR SELECT
    TO authenticated
    USING (
        auth.current_institutional_role() IN ('ADMINISTRADOR', 'DIRECTOR', 'COORDINACION', 'SECRETARIA', 'DOCENTE', 'ASISTENTE')
    );

-- ------------------------------------------------------------------------------
-- G. TABLAS DE CATÁLOGOS, COMUNIDAD Y CONFIGURACIÓN ESCOLAR
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS rls_notices_admin_all ON community_notices;
CREATE POLICY rls_notices_admin_all ON community_notices
    FOR ALL
    TO authenticated
    USING (
        auth.current_institutional_role() IN ('ADMINISTRADOR', 'DIRECTOR', 'COORDINACION')
    );

DROP POLICY IF EXISTS rls_notices_read_all ON community_notices;
CREATE POLICY rls_notices_read_all ON community_notices
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS rls_catalogs_admin_all ON system_catalogs;
CREATE POLICY rls_catalogs_admin_all ON system_catalogs
    FOR ALL
    TO authenticated
    USING (
        auth.current_institutional_role() IN ('ADMINISTRADOR', 'DIRECTOR')
    );

DROP POLICY IF EXISTS rls_catalogs_read_all ON system_catalogs;
CREATE POLICY rls_catalogs_read_all ON system_catalogs
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS rls_school_data_admin_all ON institutional_school_data;
CREATE POLICY rls_school_data_admin_all ON institutional_school_data
    FOR ALL
    TO authenticated
    USING (
        auth.current_institutional_role() IN ('ADMINISTRADOR', 'DIRECTOR')
    );

DROP POLICY IF EXISTS rls_school_data_read_all ON institutional_school_data;
CREATE POLICY rls_school_data_read_all ON institutional_school_data
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS rls_user_schedules_staff_all ON user_schedules;
CREATE POLICY rls_user_schedules_staff_all ON user_schedules
    FOR ALL
    TO authenticated
    USING (
        auth.current_institutional_role() IN ('ADMINISTRADOR', 'DIRECTOR', 'COORDINACION')
        OR user_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')::TEXT
    );

DROP POLICY IF EXISTS rls_user_schedules_read_all ON user_schedules;
CREATE POLICY rls_user_schedules_read_all ON user_schedules
    FOR SELECT
    TO authenticated
    USING (true);
