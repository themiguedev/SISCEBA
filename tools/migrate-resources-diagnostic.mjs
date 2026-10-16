import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/sisceba'
});

async function runMigration() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS educational_resources (
        id VARCHAR(60) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(60) NOT NULL,
        area_id VARCHAR(60) REFERENCES subject_areas(id) ON DELETE SET NULL,
        level VARCHAR(20) NOT NULL CHECK (level IN ('INICIAL', 'PRIMARIA', 'MEDIA_GENERAL')),
        description TEXT,
        location VARCHAR(120),
        quantity INT DEFAULT 1,
        is_reusable BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✓ Tabla educational_resources verificada con éxito.');

    await pool.query(`
      ALTER TABLE IF EXISTS evaluation_records 
      ADD COLUMN IF NOT EXISTS checklist_scores JSONB DEFAULT '[]'::jsonb;
    `);
    console.log('✓ Columna checklist_scores en evaluation_records verificada con éxito.');

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('✗ Error en migración:', err);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
