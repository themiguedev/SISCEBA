import pg from 'pg';

const FEMALE_NAMES = [
  'MARIADELA', 'MAYRA', 'SHELDRY', 'SUSANA', 'ANA', 'DESIREE', 'MAGJAIRY',
  'CECILIA', 'YOKEBETH', 'EUGENIA', 'ELIKA', 'ELLUZ', 'VERUSCHKA', 'GYSSELL',
  'CLAUDIA', 'ALEXANDRA', 'ANGELA', 'ANDREA', 'MARIANELA', 'MARIEL', 'SAMANTA',
  'AURA', 'MONICA', 'BEATRIZ', 'HANADI', 'BEIDI', 'YENISSE', 'MARIA', 'CAROLINA',
  'LIVIA', 'MINERVA', 'YAWHARA', 'SANDRA', 'TATIANA', 'MARTINA', 'JULIETA',
  'ISABELLA', 'VALENTINA', 'LUNA', 'LETICIA', 'PAULA', 'SOFIA', 'MIA'
];

function inferGender(fullName) {
  const parts = fullName.toUpperCase().split(/\s+/);
  for (const part of parts) {
    if (FEMALE_NAMES.includes(part)) {
      return 'FEMENINO';
    }
  }
  return 'MASCULINO';
}

async function syncRepresentatives() {
  const pool = new pg.Pool({ connectionString: 'postgres://postgres@127.0.0.1:5432/sisceba' });

  try {
    const studentsRes = await pool.query(`
      SELECT id, cedula, full_name, section, grade, level, representative_name
      FROM students
      WHERE representative_name IS NOT NULL AND TRIM(representative_name) != ''
      ORDER BY section, full_name
    `);

    console.log(`Encontrados ${studentsRes.rows.length} estudiantes con representante asignado.`);

    // Agrupar por nombre representativo único
    const repMap = new Map();
    for (const s of studentsRes.rows) {
      const repName = s.representative_name.trim();
      if (!repMap.has(repName)) {
        repMap.set(repName, []);
      }
      repMap.get(repName).push(s);
    }

    console.log(`Total de representantes únicos: ${repMap.size}`);

    let createdCount = 0;
    let existingCount = 0;

    for (const [repName, studentsList] of repMap.entries()) {
      // Si ya es José Rivera (o ya existe una cuenta con ese nombre completo o username)
      const existingUser = await pool.query(
        `SELECT id, username, full_name, role FROM app_users WHERE TRIM(UPPER(full_name)) = TRIM(UPPER($1)) AND role = 'REPRESENTANTE'`,
        [repName]
      );

      if (existingUser.rows.length > 0) {
        console.log(`ℹ️ Ya existe cuenta para: ${repName} (@${existingUser.rows[0].username})`);
        existingCount++;
        continue;
      }

      // Tomar cédula del primer estudiante para generar identificador único
      const primaryStudent = studentsList[0];
      const rawDigits = primaryStudent.cedula.replace(/[^0-9]/g, '') || String(Date.now()).slice(-8);
      const username = `rep${rawDigits}`;
      const userId = `usr-rep-${rawDigits}`;
      const email = `rep.${rawDigits}@representante.cba`;
      const gender = inferGender(repName);
      const avatarPreset = gender === 'FEMENINO' ? 'preset:female-circle-teal' : 'preset:male-circle-teal';

      const meta = {
        g: gender,
        p: '',
        c: null,
        b: null,
        re: true,
        rm: true,
        r: 'REPRESENTANTE',
        rs: null,
        al: ['MEDIA_GENERAL'],
        a: avatarPreset
      };
      const avatarUrl = `cba-meta:${JSON.stringify(meta)}`;

      // Contraseña estándar temporal para representantes
      const defaultPassword = `cba2026*`;

      await pool.query(`
        INSERT INTO app_users (
          id, username, password, full_name, email, role, default_level, active, avatar_url, academic_assignments
        )
        VALUES ($1, $2, $3, $4, $5, 'REPRESENTANTE', 'MEDIA_GENERAL', true, $6, '[]'::jsonb)
        ON CONFLICT (username) DO UPDATE SET
          full_name = EXCLUDED.full_name,
          role = 'REPRESENTANTE',
          default_level = 'MEDIA_GENERAL',
          avatar_url = EXCLUDED.avatar_url;
      `, [userId, username, defaultPassword, repName, email, avatarUrl]);

      // Actualizar representative_email en students para correspondencia exacta
      for (const st of studentsList) {
        await pool.query(`
          UPDATE students
          SET representative_email = $1, updated_at = NOW()
          WHERE id = $2
        `, [email, st.id]);
      }

      createdCount++;
      const repStudentsNames = studentsList.map(s => `${s.full_name} (${s.section})`).join(', ');
      console.log(`✅ [${createdCount}] Cuenta creada: @${username} | ${repName} -> [${repStudentsNames}]`);
    }

    console.log(`\n🎉 PROCESO FINALIZADO EXITOSAMENTE`);
    console.log(`- Cuentas nuevas creadas: ${createdCount}`);
    console.log(`- Cuentas preexistentes conservadas: ${existingCount}`);
    console.log(`- Total de representantes activos: ${createdCount + existingCount}`);

    const totalRepsInDb = await pool.query(`SELECT COUNT(*) FROM app_users WHERE role = 'REPRESENTANTE'`);
    console.log(`\nVerificación en app_users (role = 'REPRESENTANTE'): ${totalRepsInDb.rows[0].count}`);

  } catch (err) {
    console.error('❌ Error sincronizando representantes:', err);
  } finally {
    await pool.end();
  }
}

syncRepresentatives();
