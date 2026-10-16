import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/sisceba'
});

async function runMigration() {
  try {
    // 1. Añadir columna theme a community_notices si no existe
    await pool.query(`
      ALTER TABLE IF EXISTS community_notices 
      ADD COLUMN IF NOT EXISTS theme VARCHAR(40) DEFAULT 'ESTANDAR';
    `);
    console.log('✓ Columna theme en community_notices verificada con éxito.');

    // 2. Relajar check constraint de target_audience en community_notices para permitir DIRECCION y COORDINACION
    await pool.query(`
      ALTER TABLE IF EXISTS community_notices 
      DROP CONSTRAINT IF EXISTS community_notices_target_audience_check;
    `);
    console.log('✓ Constraint de target_audience en community_notices flexibilizado.');

    // 3. Verificar columnas student_name y grade_section en administrative_blocks
    await pool.query(`
      ALTER TABLE IF EXISTS administrative_blocks 
      ADD COLUMN IF NOT EXISTS student_name VARCHAR(150),
      ADD COLUMN IF NOT EXISTS grade_section VARCHAR(50);
    `);
    console.log('✓ Columnas en administrative_blocks verificadas con éxito.');

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('✗ Error en migración:', err);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
