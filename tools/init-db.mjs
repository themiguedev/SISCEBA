import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const pgsqlBin = path.join(rootDir, '.local_db', 'pgsql', 'bin');
const pgData = path.join(rootDir, '.local_db', 'data');
const postgresExe = path.join(pgsqlBin, 'postgres.exe');
const psqlExe = path.join(pgsqlBin, 'psql.exe');
const pgCtlExe = path.join(pgsqlBin, 'pg_ctl.exe');
const createdbExe = path.join(pgsqlBin, 'createdb.exe');
const schemaSql = path.join(rootDir, 'supabase', 'schema.sql');
const seedSql = path.join(rootDir, 'supabase', 'seed.sql');

console.log('🚀 Iniciando configuración inicial de base de datos PostgreSQL local...');

// Iniciar postgres temporalmente
const pgProcess = spawn(postgresExe, ['-D', pgData], {
  stdio: ['ignore', 'pipe', 'pipe']
});

pgProcess.stdout.on('data', data => {
  // console.log(`[postgres] ${data}`);
});
pgProcess.stderr.on('data', data => {
  // console.error(`[postgres] ${data}`);
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForPostgres() {
  console.log('⏳ Esperando que PostgreSQL responda en puerto 5432...');
  for (let i = 0; i < 30; i++) {
    try {
      execSync(`"${psqlExe}" -U postgres -h 127.0.0.1 -p 5432 -c "SELECT 1;"`, {
        stdio: 'ignore'
      });
      console.log('✅ PostgreSQL está listo para aceptar conexiones.');
      return true;
    } catch {
      await sleep(1000);
    }
  }
  throw new Error('PostgreSQL no respondió a tiempo.');
}

async function main() {
  try {
    await waitForPostgres();

    // 1. Crear base de datos sisceba si no existe
    console.log('📦 Verificando base de datos "sisceba"...');
    try {
      execSync(`"${createdbExe}" -U postgres -h 127.0.0.1 -p 5432 sisceba`, {
        stdio: 'inherit'
      });
      console.log('✅ Base de datos "sisceba" creada con éxito.');
    } catch {
      console.log('ℹ️ La base de datos "sisceba" ya existía o fue verificada.');
    }

    // 2. Crear rol 'anon' y 'authenticated' si no existen (necesarios para PostgREST)
    console.log('🔑 Creando roles para PostgREST (anon, authenticator)...');
    const rolesSql = `
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'anon') THEN
          CREATE ROLE anon NOLOGIN;
        END IF;
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticated') THEN
          CREATE ROLE authenticated NOLOGIN;
        END IF;
      END
      $$;
      GRANT USAGE ON SCHEMA public TO anon;
      GRANT USAGE ON SCHEMA public TO authenticated;
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;
      GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
      GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
    `;
    fs.writeFileSync(path.join(rootDir, '.local_db', 'setup_roles.sql'), rolesSql, 'utf-8');
    execSync(`"${psqlExe}" -U postgres -h 127.0.0.1 -p 5432 -d sisceba -f "${path.join(rootDir, '.local_db', 'setup_roles.sql')}"`, {
      stdio: 'inherit'
    });

    // 3. Cargar schema.sql y asegurar columnas
    console.log('📜 Ejecutando supabase/schema.sql...');
    execSync(`"${psqlExe}" -U postgres -h 127.0.0.1 -p 5432 -d sisceba -f "${schemaSql}"`, {
      stdio: 'inherit'
    });
    execSync(`"${psqlExe}" -U postgres -h 127.0.0.1 -p 5432 -d sisceba -c "ALTER TABLE IF EXISTS app_users ADD COLUMN IF NOT EXISTS email VARCHAR(100); ALTER TABLE IF EXISTS app_users ADD COLUMN IF NOT EXISTS academic_assignments JSONB DEFAULT '[]'::jsonb; ALTER TABLE IF EXISTS evaluation_records ADD COLUMN IF NOT EXISTS checklist_scores JSONB DEFAULT '[]'::jsonb; ALTER TABLE IF EXISTS evaluation_records ADD COLUMN IF NOT EXISTS rasgos_score NUMERIC(4,2); ALTER TABLE IF EXISTS evaluation_records ADD COLUMN IF NOT EXISTS auto_score NUMERIC(4,2); ALTER TABLE IF EXISTS evaluation_records ADD COLUMN IF NOT EXISTS coev_score NUMERIC(4,2); ALTER TABLE IF EXISTS institutional_school_data ADD COLUMN IF NOT EXISTS supervisor_circuito VARCHAR(150); ALTER TABLE IF EXISTS institutional_school_data ADD COLUMN IF NOT EXISTS director_firma_url TEXT; ALTER TABLE IF EXISTS institutional_school_data ADD COLUMN IF NOT EXISTS sello_institucional_url TEXT; ALTER TABLE IF EXISTS registration_codes ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ; ALTER TABLE IF EXISTS registration_codes ADD COLUMN IF NOT EXISTS duration_hours INT DEFAULT 48;"`, {
      stdio: 'inherit'
    });
    console.log('✅ Esquema oficial institucional aplicado con éxito.');

    // 4. Limpiar datos de prueba y cargar seed.sql
    console.log('🧹 Purgando registros temporales de pruebas...');
    const purgeSql = `
      TRUNCATE TABLE evaluation_records, pass_records, daily_attendance, conduct_entries, document_requests, administrative_blocks, title_records, didactic_plans, plans_lapso, system_notifications, system_audit_logs, registration_codes, students, crp_enrollments CASCADE;
    `;
    try {
      execSync(`"${psqlExe}" -U postgres -h 127.0.0.1 -p 5432 -d sisceba -c "${purgeSql}"`, { stdio: 'ignore' });
    } catch {}

    console.log('🌱 Ejecutando supabase/seed.sql...');
    execSync(`"${psqlExe}" -U postgres -h 127.0.0.1 -p 5432 -d sisceba -f "${seedSql}"`, {
      stdio: 'inherit'
    });
    console.log('✅ Semilla inicial cargada con éxito.');

    // Reotorgar permisos a anon y authenticated sobre todas las tablas recién creadas
    execSync(`"${psqlExe}" -U postgres -h 127.0.0.1 -p 5432 -d sisceba -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated; GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;"`, {
      stdio: 'inherit'
    });

    console.log('🎉 ¡Inicialización de PostgreSQL local completada con éxito!');
  } finally {
    console.log('🛑 Deteniendo proceso temporal de PostgreSQL...');
    try {
      execSync(`"${pgCtlExe}" -D "${pgData}" -m fast stop`, { stdio: 'ignore' });
    } catch {
      pgProcess.kill('SIGINT');
    }
  }
}

main().catch(err => {
  console.error('❌ Error en inicialización:', err);
  process.exit(1);
});
