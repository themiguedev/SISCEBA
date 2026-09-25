-- ==============================================================================
-- SISTEMA INTEGRAL DE CONTROL Y EVALUACIÓN (SICE-CBA)
-- U.E.P. COLEGIO BELLAS ARTES - ESQUEMA DE BASE DE DATOS SUPABASE / POSTGRESQL
-- Versión: 1.0.0 (Año Escolar 2026 - 2027)
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE MATRÍCULA Y ESTUDIANTES
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(60) PRIMARY KEY,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    birth_date DATE NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('INICIAL', 'PRIMARIA', 'MEDIA_GENERAL')),
    grade VARCHAR(40) NOT NULL,
    section VARCHAR(10) NOT NULL,
    representative_name VARCHAR(150) NOT NULL,
    representative_email VARCHAR(120),
    representative_phone VARCHAR(30),
    status VARCHAR(25) DEFAULT 'REGULAR' CHECK (status IN ('REGULAR', 'EN_REVISION', 'MATERIA_PENDIENTE')),
    pending_subjects TEXT[] DEFAULT '{}',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA DE ASIGNATURAS Y MALLA CURRICULAR
CREATE TABLE IF NOT EXISTS subject_areas (
    id VARCHAR(60) PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('INICIAL', 'PRIMARIA', 'MEDIA_GENERAL')),
    type VARCHAR(20) DEFAULT 'REGULAR' CHECK (type IN ('REGULAR', 'INTEGRADA', 'ESPECIALIZADA')),
    weekly_hours INT DEFAULT 4,
    area_profile TEXT,
    teacher_profile TEXT,
    icon_name VARCHAR(50) DEFAULT 'BookOpen',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA DE COMPETENCIAS PEDAGÓGICAS
CREATE TABLE IF NOT EXISTS competencies (
    id VARCHAR(60) PRIMARY KEY,
    area_id VARCHAR(60) REFERENCES subject_areas(id) ON DELETE CASCADE,
    code VARCHAR(30) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('INICIAL', 'PRIMARIA', 'MEDIA_GENERAL')),
    lapso INT NOT NULL CHECK (lapso IN (1, 2, 3)),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA DE INDICADORES DE LOGRO
CREATE TABLE IF NOT EXISTS indicators (
    id VARCHAR(60) PRIMARY KEY,
    competency_id VARCHAR(60) REFERENCES competencies(id) ON DELETE CASCADE,
    area_id VARCHAR(60) REFERENCES subject_areas(id) ON DELETE CASCADE,
    code VARCHAR(30) NOT NULL,
    description TEXT NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('INICIAL', 'PRIMARIA', 'MEDIA_GENERAL')),
    lapso INT NOT NULL CHECK (lapso IN (1, 2, 3)),
    weight NUMERIC(5,2),
    evaluation_instrument VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA DE ESTRATEGIAS METODOLÓGICAS
CREATE TABLE IF NOT EXISTS strategies (
    id VARCHAR(60) PRIMARY KEY,
    area_id VARCHAR(60) REFERENCES subject_areas(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('ENSENANZA', 'EVALUACION')),
    category VARCHAR(80),
    description TEXT NOT NULL,
    resources TEXT,
    level VARCHAR(20) NOT NULL CHECK (level IN ('INICIAL', 'PRIMARIA', 'MEDIA_GENERAL')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLA DE PLANIFICACIÓN DIDÁCTICA OFICIAL (PRIMARIA Y MEDIA GENERAL)
CREATE TABLE IF NOT EXISTS didactic_plans (
    id VARCHAR(60) PRIMARY KEY,
    area_id VARCHAR(60) REFERENCES subject_areas(id) ON DELETE SET NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('INICIAL', 'PRIMARIA', 'MEDIA_GENERAL')),
    grade_section VARCHAR(50) NOT NULL,
    lapso INT NOT NULL CHECK (lapso IN (1, 2, 3)),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    project_theme VARCHAR(255),
    status VARCHAR(20) DEFAULT 'BORRADOR' CHECK (status IN ('BORRADOR', 'A_REVISION', 'DEFINITIVO')),
    competency_ids TEXT[] DEFAULT '{}',
    indicator_ids TEXT[] DEFAULT '{}',
    teaching_strategy_ids TEXT[] DEFAULT '{}',
    evaluation_strategy_ids TEXT[] DEFAULT '{}',
    pedagogical_activities TEXT,
    differentiation_notes TEXT,
    review_feedback TEXT,
    reviewed_by VARCHAR(100),
    docente_name VARCHAR(150),
    school_year VARCHAR(30) DEFAULT '2026 - 2027',
    periodo_quincenal VARCHAR(50),
    componente TEXT,
    tema_generador TEXT,
    rows JSONB DEFAULT '[]'::jsonb,
    actividades_inicio TEXT,
    actividades_desarrollo TEXT,
    actividades_cierre TEXT,
    recursos TEXT,
    fuentes_consulta TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLA DE PLANES DE EVALUACIÓN DE LAPSO
CREATE TABLE IF NOT EXISTS plans_lapso (
    id VARCHAR(60) PRIMARY KEY,
    area_id VARCHAR(60) REFERENCES subject_areas(id) ON DELETE SET NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('INICIAL', 'PRIMARIA', 'MEDIA_GENERAL')),
    grade_section VARCHAR(50) NOT NULL,
    lapso INT NOT NULL CHECK (lapso IN (1, 2, 3)),
    status VARCHAR(20) DEFAULT 'BORRADOR' CHECK (status IN ('BORRADOR', 'A_REVISION', 'DEFINITIVO')),
    general_objective TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    review_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABLA DE CALIFICACIONES Y CUADERNO PROCESAL
CREATE TABLE IF NOT EXISTS evaluation_records (
    id VARCHAR(60) PRIMARY KEY,
    student_id VARCHAR(60) REFERENCES students(id) ON DELETE CASCADE,
    area_id VARCHAR(60) REFERENCES subject_areas(id) ON DELETE CASCADE,
    indicator_id VARCHAR(60),
    moment VARCHAR(20) NOT NULL CHECK (moment IN ('DIAGNOSTICA', 'PROCESAL', 'FINAL_LAPSO')),
    lapso INT NOT NULL CHECK (lapso IN (1, 2, 3)),
    score_numeric NUMERIC(4,2),
    score_qualitative VARCHAR(2) CHECK (score_qualitative IN ('L', 'P', 'EP', 'I', 'C')),
    score_literal CHAR(1) CHECK (score_literal IN ('A', 'B', 'C', 'D', 'E')),
    robotics_score JSONB,
    observations TEXT,
    recorded_at DATE DEFAULT CURRENT_DATE,
    teacher_id VARCHAR(60),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABLA DE PASES DE RETRASO / PORTERÍA
CREATE TABLE IF NOT EXISTS pass_records (
    id VARCHAR(60) PRIMARY KEY,
    ticket_number VARCHAR(30) UNIQUE NOT NULL,
    student_id VARCHAR(60) REFERENCES students(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    grade_section VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(20) NOT NULL,
    reason VARCHAR(200),
    authorized_by VARCHAR(100),
    printed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABLA DE ASISTENCIA DIARIA
CREATE TABLE IF NOT EXISTS daily_attendance (
    id VARCHAR(60) PRIMARY KEY,
    student_id VARCHAR(60) REFERENCES students(id) ON DELETE CASCADE,
    student_name VARCHAR(150),
    grade_section VARCHAR(50),
    date DATE NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN ('PRESENTE', 'INASISTENCIA_JUSTIFICADA', 'INASISTENCIA_INJUSTIFICADA', 'RETRASO')),
    justification TEXT,
    lapso INT DEFAULT 1 CHECK (lapso IN (1, 2, 3)),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TABLA DE CONVIVENCIA Y DISCIPLINA
CREATE TABLE IF NOT EXISTS conduct_entries (
    id VARCHAR(60) PRIMARY KEY,
    student_id VARCHAR(60) REFERENCES students(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    grade_section VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    lapso INT NOT NULL CHECK (lapso IN (1, 2, 3)),
    type VARCHAR(20) NOT NULL CHECK (type IN ('POSITIVA', 'LEVE', 'GRAVE', 'MUY_GRAVE')),
    description TEXT NOT NULL,
    agreements TEXT,
    reported_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. TABLA DE SOLICITUDES DE DOCUMENTOS Y TRÁMITES (SLA)
CREATE TABLE IF NOT EXISTS document_requests (
    id VARCHAR(60) PRIMARY KEY,
    tracking_code VARCHAR(30) UNIQUE NOT NULL,
    representative_name VARCHAR(150) NOT NULL,
    student_name VARCHAR(150) NOT NULL,
    grade_section VARCHAR(50),
    document_type VARCHAR(80) NOT NULL,
    department VARCHAR(50) NOT NULL,
    request_date DATE NOT NULL,
    elapsed_days INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'PENDIENTE' CHECK (status IN ('PENDIENTE', 'EN_TRAMITE', 'LISTO_ENTREGA', 'ENTREGADO')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. TABLA DE BLOQUEOS ADMINISTRATIVOS
CREATE TABLE IF NOT EXISTS administrative_blocks (
    id VARCHAR(60) PRIMARY KEY,
    representative_id VARCHAR(60),
    representative_name VARCHAR(150) NOT NULL,
    student_id VARCHAR(60) REFERENCES students(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    grade_section VARCHAR(50),
    reason TEXT NOT NULL,
    block_date DATE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    debt_amount VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. TABLA DE TÍTULOS DE BACHILLER
CREATE TABLE IF NOT EXISTS title_records (
    id VARCHAR(60) PRIMARY KEY,
    student_id VARCHAR(60) REFERENCES students(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    cedula VARCHAR(20) NOT NULL,
    school_year VARCHAR(20) NOT NULL,
    graduation_year VARCHAR(10) NOT NULL,
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    tomo VARCHAR(20) NOT NULL,
    folio VARCHAR(20) NOT NULL,
    registered_code VARCHAR(50) NOT NULL,
    calibrated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. TABLA DE NOTICIAS Y CARTELERA COMUNITARIA
CREATE TABLE IF NOT EXISTS community_notices (
    id VARCHAR(60) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(30) CHECK (type IN ('NOTICIA', 'ANUNCIO_URGENTE', 'EVENTO')),
    target_audience VARCHAR(30) CHECK (target_audience IN ('TODOS', 'DOCENTES', 'REPRESENTANTES', 'ESTUDIANTES')),
    author VARCHAR(100) NOT NULL,
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. TABLA DE NOTIFICACIONES INTERACTIVAS
CREATE TABLE IF NOT EXISTS system_notifications (
    id VARCHAR(60) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    timestamp VARCHAR(60),
    read BOOLEAN DEFAULT FALSE,
    category VARCHAR(30) CHECK (category IN ('CALIFICACIONES', 'ASISTENCIA', 'DOCUMENTOS', 'INSTITUCIONAL', 'SISTEMA')),
    priority VARCHAR(20) CHECK (priority IN ('BAJA', 'MEDIA', 'ALTA')),
    recipient_role VARCHAR(30),
    recipient_name VARCHAR(150),
    student_name VARCHAR(150),
    action_tab VARCHAR(50),
    action_sub_tab VARCHAR(50),
    delivery_channels TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. TABLA DE USUARIOS Y ROLES (MODOS DE OPERACIÓN)
CREATE TABLE IF NOT EXISTS app_users (
    id VARCHAR(60) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('DOCENTE', 'COORDINACION', 'COORDINADOR', 'DIRECTOR', 'ADMINISTRADOR', 'REPRESENTANTE', 'ESTUDIANTE', 'ASISTENTE', 'SECRETARIA')),
    default_level VARCHAR(20) DEFAULT 'MEDIA_GENERAL' CHECK (default_level IN ('INICIAL', 'PRIMARIA', 'MEDIA_GENERAL')),
    active BOOLEAN DEFAULT TRUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. TABLA DE CÓDIGOS DE AUTORIZACIÓN (USO ÚNICO PARA AUTO-REGISTRO)
CREATE TABLE IF NOT EXISTS registration_codes (
    id VARCHAR(60) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    allowed_role VARCHAR(30) CHECK (allowed_role IN ('DOCENTE', 'ASISTENTE', 'SECRETARIA')),
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used BOOLEAN DEFAULT FALSE,
    used_by VARCHAR(100),
    used_at TIMESTAMPTZ
);

-- 20. TABLA DE CONFIGURACIÓN DEL AÑO ESCOLAR Y LAPSOS
CREATE TABLE IF NOT EXISTS school_year_config (
    id VARCHAR(60) PRIMARY KEY DEFAULT 'current_config',
    year VARCHAR(20) NOT NULL,
    is_current BOOLEAN DEFAULT TRUE,
    lapsos JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. TRIGGERS PARA UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_students_updated_at ON students;
CREATE TRIGGER trg_students_updated_at
BEFORE UPDATE ON students
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_didactic_plans_updated_at ON didactic_plans;
CREATE TRIGGER trg_didactic_plans_updated_at
BEFORE UPDATE ON didactic_plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_plans_lapso_updated_at ON plans_lapso;
CREATE TRIGGER trg_plans_lapso_updated_at
BEFORE UPDATE ON plans_lapso
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 19. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE didactic_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans_lapso ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pass_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE conduct_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE administrative_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE title_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_notifications ENABLE ROW LEVEL SECURITY;

-- 20. POLÍTICAS RLS PERMISIVAS (Lectura y Escritura para intranet escolar con clave anon / auth)
DROP POLICY IF EXISTS "Permitir lectura general a estudiantes" ON students;
DROP POLICY IF EXISTS "Permitir escritura general a estudiantes" ON students;
CREATE POLICY "Permitir lectura general a estudiantes" ON students FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a estudiantes" ON students FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general a subject_areas" ON subject_areas;
DROP POLICY IF EXISTS "Permitir escritura general a subject_areas" ON subject_areas;
CREATE POLICY "Permitir lectura general a subject_areas" ON subject_areas FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a subject_areas" ON subject_areas FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general a competencies" ON competencies;
DROP POLICY IF EXISTS "Permitir escritura general a competencies" ON competencies;
CREATE POLICY "Permitir lectura general a competencies" ON competencies FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a competencies" ON competencies FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general a indicators" ON indicators;
DROP POLICY IF EXISTS "Permitir escritura general a indicators" ON indicators;
CREATE POLICY "Permitir lectura general a indicators" ON indicators FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a indicators" ON indicators FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general a strategies" ON strategies;
DROP POLICY IF EXISTS "Permitir escritura general a strategies" ON strategies;
CREATE POLICY "Permitir lectura general a strategies" ON strategies FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a strategies" ON strategies FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general a didactic_plans" ON didactic_plans;
DROP POLICY IF EXISTS "Permitir escritura general a didactic_plans" ON didactic_plans;
CREATE POLICY "Permitir lectura general a didactic_plans" ON didactic_plans FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a didactic_plans" ON didactic_plans FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general a plans_lapso" ON plans_lapso;
DROP POLICY IF EXISTS "Permitir escritura general a plans_lapso" ON plans_lapso;
CREATE POLICY "Permitir lectura general a plans_lapso" ON plans_lapso FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a plans_lapso" ON plans_lapso FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general a evaluation_records" ON evaluation_records;
DROP POLICY IF EXISTS "Permitir escritura general a evaluation_records" ON evaluation_records;
CREATE POLICY "Permitir lectura general a evaluation_records" ON evaluation_records FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a evaluation_records" ON evaluation_records FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general a pass_records" ON pass_records;
DROP POLICY IF EXISTS "Permitir escritura general a pass_records" ON pass_records;
CREATE POLICY "Permitir lectura general a pass_records" ON pass_records FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a pass_records" ON pass_records FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general a daily_attendance" ON daily_attendance;
DROP POLICY IF EXISTS "Permitir escritura general a daily_attendance" ON daily_attendance;
CREATE POLICY "Permitir lectura general a daily_attendance" ON daily_attendance FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a daily_attendance" ON daily_attendance FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general a conduct_entries" ON conduct_entries;
DROP POLICY IF EXISTS "Permitir escritura general a conduct_entries" ON conduct_entries;
CREATE POLICY "Permitir lectura general a conduct_entries" ON conduct_entries FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a conduct_entries" ON conduct_entries FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general a document_requests" ON document_requests;
DROP POLICY IF EXISTS "Permitir escritura general a document_requests" ON document_requests;
CREATE POLICY "Permitir lectura general a document_requests" ON document_requests FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a document_requests" ON document_requests FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general a administrative_blocks" ON administrative_blocks;
DROP POLICY IF EXISTS "Permitir escritura general a administrative_blocks" ON administrative_blocks;
CREATE POLICY "Permitir lectura general a administrative_blocks" ON administrative_blocks FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a administrative_blocks" ON administrative_blocks FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general a title_records" ON title_records;
DROP POLICY IF EXISTS "Permitir escritura general a title_records" ON title_records;
CREATE POLICY "Permitir lectura general a title_records" ON title_records FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a title_records" ON title_records FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general a community_notices" ON community_notices;
DROP POLICY IF EXISTS "Permitir escritura general a community_notices" ON community_notices;
CREATE POLICY "Permitir lectura general a community_notices" ON community_notices FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a community_notices" ON community_notices FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura general a system_notifications" ON system_notifications;
DROP POLICY IF EXISTS "Permitir escritura general a system_notifications" ON system_notifications;
CREATE POLICY "Permitir lectura general a system_notifications" ON system_notifications FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a system_notifications" ON system_notifications FOR ALL USING (true);

ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir lectura general a app_users" ON app_users;
DROP POLICY IF EXISTS "Permitir escritura general a app_users" ON app_users;
CREATE POLICY "Permitir lectura general a app_users" ON app_users FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a app_users" ON app_users FOR ALL USING (true);

ALTER TABLE registration_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir lectura general a registration_codes" ON registration_codes;
DROP POLICY IF EXISTS "Permitir escritura general a registration_codes" ON registration_codes;
CREATE POLICY "Permitir lectura general a registration_codes" ON registration_codes FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a registration_codes" ON registration_codes FOR ALL USING (true);

ALTER TABLE school_year_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir lectura general a school_year_config" ON school_year_config;
DROP POLICY IF EXISTS "Permitir escritura general a school_year_config" ON school_year_config;
CREATE POLICY "Permitir lectura general a school_year_config" ON school_year_config FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a school_year_config" ON school_year_config FOR ALL USING (true);

-- 18. TABLA DE PRIVILEGIOS DEL SISTEMA CEO (system_privileges)
CREATE TABLE IF NOT EXISTS system_privileges (
    id VARCHAR(60) PRIMARY KEY DEFAULT 'ceo_matrix_v1',
    matrix JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE system_privileges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir lectura general a system_privileges" ON system_privileges;
DROP POLICY IF EXISTS "Permitir escritura general a system_privileges" ON system_privileges;
CREATE POLICY "Permitir lectura general a system_privileges" ON system_privileges FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a system_privileges" ON system_privileges FOR ALL USING (true);

-- 19. TABLA DE HORARIOS DE USUARIOS / PERSONAL (user_schedules)
CREATE TABLE IF NOT EXISTS user_schedules (
    user_id VARCHAR(60) PRIMARY KEY,
    user_role VARCHAR(30),
    school_year VARCHAR(20) DEFAULT '2026 - 2027',
    blocks JSONB NOT NULL DEFAULT '[]',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_schedules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir lectura general a user_schedules" ON user_schedules;
DROP POLICY IF EXISTS "Permitir escritura general a user_schedules" ON user_schedules;
CREATE POLICY "Permitir lectura general a user_schedules" ON user_schedules FOR SELECT USING (true);
CREATE POLICY "Permitir escritura general a user_schedules" ON user_schedules FOR ALL USING (true);


