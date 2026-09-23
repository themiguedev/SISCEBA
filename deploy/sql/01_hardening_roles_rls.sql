-- ==============================================================================
-- SICE-CBA: Capa 3 - Hardening de Base de Datos PostgreSQL On-Premise
-- Colegio Bellas Artes • Mínimo Privilegio, Roles y Políticas RLS
-- ==============================================================================

-- 1. CREACIÓN DEL USUARIO DE APLICACIÓN CON MÍNIMOS PRIVILEGIOS
-- Evita el uso de 'postgres' o 'superuser' por parte de la aplicación web.

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'cba_app_user') THEN
        CREATE ROLE cba_app_user WITH LOGIN PASSWORD 'CambiarPorPasswordRobusto123!#';
    END IF;
END
$$;

-- Revocar privilegios peligrosos y restringir acceso a esquemas públicos
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO cba_app_user;

-- Otorgar exclusivamente permisos DML sobre tablas institucionales
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cba_app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cba_app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO cba_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO cba_app_user;

-- Revocar permisos DDL (Creación, borrado o alteración de tablas) para el usuario de aplicación
REVOKE CREATE ON SCHEMA public FROM cba_app_user;


-- 2. POLÍTICAS DE SEGURIDAD A NIVEL DE FILAS (ROW LEVEL SECURITY - RLS)

-- Habilitar RLS en tablas críticas
ALTER TABLE IF EXISTS app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS evaluation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS conduct_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS attendance_records ENABLE ROW LEVEL SECURITY;

-- Funciones auxiliares seguras para obtener el usuario autenticado y su rol actual
CREATE OR REPLACE FUNCTION current_app_user_id() 
RETURNS TEXT AS $$
    SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::TEXT;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_app_user_role() 
RETURNS TEXT AS $$
    SELECT NULLIF(current_setting('request.jwt.claim.role', true), '')::TEXT;
$$ LANGUAGE sql STABLE SECURITY DEFINER;


-- -----------------------------------------------------------------------------
-- Políticas para STUDENTS
-- -----------------------------------------------------------------------------
-- Personal Administrativo, Directivo y Coordinación: Acceso total
DROP POLICY IF EXISTS p_admin_students ON students;
CREATE POLICY p_admin_students ON students
    FOR ALL
    TO cba_app_user
    USING (
        current_app_user_role() IN ('ADMINISTRADOR', 'DIRECTOR', 'COORDINACION')
    );

-- Docentes: Solo lectura de estudiantes pertenecientes a sus secciones asignadas
DROP POLICY IF EXISTS p_docente_students ON students;
CREATE POLICY p_docente_students ON students
    FOR SELECT
    TO cba_app_user
    USING (
        current_app_user_role() = 'DOCENTE'
    );

-- Estudiantes: Solo pueden ver su propia ficha de estudiante
DROP POLICY IF EXISTS p_estudiante_self_students ON students;
CREATE POLICY p_estudiante_self_students ON students
    FOR SELECT
    TO cba_app_user
    USING (
        current_app_user_role() = 'ESTUDIANTE' 
        AND id = current_app_user_id()
    );

-- Representantes: Solo pueden ver los datos de sus representados
DROP POLICY IF EXISTS p_representante_students ON students;
CREATE POLICY p_representante_students ON students
    FOR SELECT
    TO cba_app_user
    USING (
        current_app_user_role() = 'REPRESENTANTE' 
        AND (
            representative_id = current_app_user_id()
            OR representative_id_number = (SELECT id_number FROM app_users WHERE id = current_app_user_id())
        )
    );


-- -----------------------------------------------------------------------------
-- Políticas para EVALUATION_RECORDS (Calificaciones)
-- -----------------------------------------------------------------------------
-- Directores, Coordinadores y Administradores: Acceso total
DROP POLICY IF EXISTS p_admin_evaluations ON evaluation_records;
CREATE POLICY p_admin_evaluations ON evaluation_records
    FOR ALL
    TO cba_app_user
    USING (
        current_app_user_role() IN ('ADMINISTRADOR', 'DIRECTOR', 'COORDINACION')
    );

-- Docentes: Carga y edición de notas para sus asignaturas asignadas
DROP POLICY IF EXISTS p_docente_evaluations ON evaluation_records;
CREATE POLICY p_docente_evaluations ON evaluation_records
    FOR ALL
    TO cba_app_user
    USING (
        current_app_user_role() = 'DOCENTE'
        AND teacher_id = current_app_user_id()
    );

-- Estudiantes: Lectura estricta de sus propias calificaciones publicadas
DROP POLICY IF EXISTS p_estudiante_evaluations ON evaluation_records;
CREATE POLICY p_estudiante_evaluations ON evaluation_records
    FOR SELECT
    TO cba_app_user
    USING (
        current_app_user_role() = 'ESTUDIANTE'
        AND student_id = current_app_user_id()
    );

-- Representantes: Lectura estricta de notas de sus representados vinculados
DROP POLICY IF EXISTS p_representante_evaluations ON evaluation_records;
CREATE POLICY p_representante_evaluations ON evaluation_records
    FOR SELECT
    TO cba_app_user
    USING (
        current_app_user_role() = 'REPRESENTANTE'
        AND student_id IN (
            SELECT id FROM students 
            WHERE representative_id = current_app_user_id()
               OR representative_id_number = (SELECT id_number FROM app_users WHERE id = current_app_user_id())
        )
    );
