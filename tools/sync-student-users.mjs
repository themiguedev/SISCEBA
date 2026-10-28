import pg from 'pg';

async function syncStudentUsers() {
  const pool = new pg.Pool({ connectionString: 'postgres://postgres:postgres@localhost:5432/sisceba' });
  try {
    const stuRes = await pool.query('SELECT * FROM students');
    console.log(`Found ${stuRes.rows.length} students in PostgreSQL.`);

    let inserted = 0;
    for (const s of stuRes.rows) {
      const rawCed = s.cedula || '';
      const normUser = rawCed.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!normUser) continue;
      const rawDigits = rawCed.replace(/[^0-9]/g, '') || 'cba2026';
      const userId = 'usr-' + s.id;
      const email = `${normUser}@estudiante.cba`;
      const meta = {
        g: s.gender === 'F' ? 'FEMENINO' : 'MASCULINO',
        c: s.cedula,
        r: 'ESTUDIANTE',
        al: [s.level || 'MEDIA_GENERAL'],
        gr: s.grade,
        sec: s.section,
        rep: s.representative_name,
        a: ''
      };
      const avatarUrl = 'cba-meta:' + JSON.stringify(meta);

      await pool.query(`
        INSERT INTO app_users (id, username, password, full_name, email, role, default_level, active, avatar_url, academic_assignments)
        VALUES ($1, $2, $3, $4, $5, 'ESTUDIANTE', $6, true, $7, '[]'::jsonb)
        ON CONFLICT (username) DO UPDATE SET
          full_name = EXCLUDED.full_name,
          role = 'ESTUDIANTE',
          default_level = EXCLUDED.default_level,
          avatar_url = EXCLUDED.avatar_url;
      `, [userId, normUser, rawDigits, s.full_name, email, s.level || 'MEDIA_GENERAL', avatarUrl]);
      inserted++;
    }

    console.log(`✅ Successfully synced/inserted ${inserted} student users into app_users.`);

    const check = await pool.query('SELECT role, count(id) as total FROM app_users GROUP BY role');
    console.log('Updated app_users counts:', check.rows);
  } finally {
    await pool.end();
  }
}

syncStudentUsers().catch(console.error);
