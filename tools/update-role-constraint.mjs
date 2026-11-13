import pg from 'pg';

const { Pool } = pg;
const PG_CONN_STRING = 'postgres://postgres@127.0.0.1:5432/sisceba';

const pool = new Pool({
  connectionString: PG_CONN_STRING
});

async function main() {
  const client = await pool.connect();
  try {
    console.log('🔗 Conectado a PostgreSQL...');

    // 1. Ver restricciones actuales en app_users
    const constrRes = await client.query(`
      SELECT conname, pg_get_constraintdef(c.oid) as def
      FROM pg_constraint c
      JOIN pg_namespace n ON n.oid = c.connamespace
      WHERE conrelid = 'app_users'::regclass;
    `);
    console.log('Restricciones en app_users:', constrRes.rows);

    // 2. Modificar constraint de rol en app_users
    await client.query(`
      ALTER TABLE app_users DROP CONSTRAINT IF EXISTS app_users_role_check;
    `);
    await client.query(`
      ALTER TABLE app_users ADD CONSTRAINT app_users_role_check 
        CHECK (role IN ('ADMINISTRADOR', 'DIRECTOR', 'COORDINACION', 'COORDINADOR', 'ORIENTACION', 'DOCENTE', 'SECRETARIA', 'REPRESENTANTE', 'ESTUDIANTE', 'ASISTENTE'));
    `);
    console.log('✅ Constraint app_users_role_check actualizada para incluir ORIENTACION.');

    // 3. Revisar si hay constraints de rol en user_schedules
    const schedConstr = await client.query(`
      SELECT conname, pg_get_constraintdef(c.oid) as def
      FROM pg_constraint c
      JOIN pg_namespace n ON n.oid = c.connamespace
      WHERE conrelid = 'user_schedules'::regclass;
    `);
    console.log('Restricciones en user_schedules:', schedConstr.rows);

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
