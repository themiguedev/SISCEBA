-- ==============================================================================
-- SICE-CBA: Capa 4 - Pistas de Auditoría Inmutables (Audit Trails)
-- Colegio Bellas Artes • Registro Criptográfico de Modificaciones
-- ==============================================================================

-- 1. TABLA INMUTABLE DE AUDITORÍA
CREATE TABLE IF NOT EXISTS system_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(20) NOT NULL,          -- 'INSERT', 'UPDATE', 'DELETE', 'LOGIN_FAILED'
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(100),
    changed_by_user_id VARCHAR(100),
    changed_by_role VARCHAR(50),
    ip_address VARCHAR(45),
    user_agent TEXT,
    old_data JSONB,
    new_data JSONB,
    diff JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Índices optimizados para auditoría forense
CREATE INDEX IF NOT EXISTS idx_audit_table_record ON system_audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON system_audit_logs(changed_by_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON system_audit_logs(created_at);

-- INMUTABILIDAD: Prohibir expresamente la modificación o eliminación de logs
REVOKE UPDATE, DELETE, TRUNCATE ON system_audit_logs FROM PUBLIC, cba_app_user;

CREATE OR REPLACE FUNCTION prevent_audit_log_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'VIOLACIÓN DE SEGURIDAD: Los registros de auditoría de SICE-CBA son inmutables y no pueden ser alterados ni eliminados.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_logs_immutable ON system_audit_logs;
CREATE TRIGGER trg_audit_logs_immutable
    BEFORE UPDATE OR DELETE OR TRUNCATE ON system_audit_logs
    FOR EACH STATEMENT
    EXECUTE FUNCTION prevent_audit_log_tampering();


-- 2. FUNCIÓN DE DISPARADOR (TRIGGER) PARA AUDITORÍA DIFERENCIAL
CREATE OR REPLACE FUNCTION fn_audit_record_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id TEXT;
    v_user_role TEXT;
    v_old_data JSONB := NULL;
    v_new_data JSONB := NULL;
    v_rec_id VARCHAR(100);
BEGIN
    v_user_id := NULLIF(current_setting('request.jwt.claim.sub', true), '');
    v_user_role := NULLIF(current_setting('request.jwt.claim.role', true), '');

    IF TG_OP = 'INSERT' THEN
        v_rec_id := NEW.id::TEXT;
        v_new_data := to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        v_rec_id := NEW.id::TEXT;
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
    ELSIF TG_OP = 'DELETE' THEN
        v_rec_id := OLD.id::TEXT;
        v_old_data := to_jsonb(OLD);
    END IF;

    INSERT INTO system_audit_logs (
        action,
        table_name,
        record_id,
        changed_by_user_id,
        changed_by_role,
        old_data,
        new_data
    ) VALUES (
        TG_OP,
        TG_TABLE_NAME,
        v_rec_id,
        v_user_id,
        v_user_role,
        v_old_data,
        v_new_data
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. ACTIVACIÓN DE AUDITORÍA EN TABLAS CLAVE (CALIFICACIONES, LAPSOS, USUARIOS)
DROP TRIGGER IF EXISTS trg_audit_evaluation_records ON evaluation_records;
CREATE TRIGGER trg_audit_evaluation_records
    AFTER INSERT OR UPDATE OR DELETE ON evaluation_records
    FOR EACH ROW EXECUTE FUNCTION fn_audit_record_changes();

DROP TRIGGER IF EXISTS trg_audit_app_users ON app_users;
CREATE TRIGGER trg_audit_app_users
    AFTER INSERT OR UPDATE OR DELETE ON app_users
    FOR EACH ROW EXECUTE FUNCTION fn_audit_record_changes();

DROP TRIGGER IF EXISTS trg_audit_students ON students;
CREATE TRIGGER trg_audit_students
    AFTER INSERT OR UPDATE OR DELETE ON students
    FOR EACH ROW EXECUTE FUNCTION fn_audit_record_changes();
