import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;
const PG_CONN_STRING = 'postgres://postgres@127.0.0.1:5432/sisceba';

const pool = new Pool({
  connectionString: PG_CONN_STRING
});

const accounts = [
  {
    id: 'usr-directora',
    username: 'directora',
    password: 'cba2026*directora',
    full_name: 'Prof. Carmen Elena Rodríguez',
    email: 'directora@bellasartes.edu.ve',
    role: 'DIRECTOR',
    default_level: 'MEDIA_GENERAL',
    active: true,
    avatar_url: 'cba-meta:{"g":"FEMENINO","c":"V-11.234.567","r":"DIRECTOR","al":["INICIAL","PRIMARIA","MEDIA_GENERAL"],"a":"preset:female-teal-circle"}',
    academic_assignments: []
  },
  {
    id: 'usr-coord-inicial',
    username: 'coord.inicial',
    password: 'cba2026*inicial',
    full_name: 'Lic. María Gabriela Pacheco',
    email: 'coord.inicial@bellasartes.edu.ve',
    role: 'COORDINACION',
    default_level: 'INICIAL',
    active: true,
    avatar_url: 'cba-meta:{"g":"FEMENINO","c":"V-18.452.101","r":"COORDINACION","al":["INICIAL"],"a":"preset:female-cyan"}',
    academic_assignments: []
  },
  {
    id: 'usr-coord-primaria',
    username: 'coord.primaria',
    password: 'cba2026*primaria',
    full_name: 'Prof. Roberto Antonio Mendoza',
    email: 'coord.primaria@bellasartes.edu.ve',
    role: 'COORDINACION',
    default_level: 'PRIMARIA',
    active: true,
    avatar_url: 'cba-meta:{"g":"MASCULINO","c":"V-16.789.202","r":"COORDINACION","al":["PRIMARIA"],"a":"preset:male-cyan"}',
    academic_assignments: []
  },
  {
    id: 'usr-coord-media',
    username: 'coord.media',
    password: 'cba2026*media',
    full_name: 'Prof. Patricia Coromoto Leal',
    email: 'coord.media@bellasartes.edu.ve',
    role: 'COORDINACION',
    default_level: 'MEDIA_GENERAL',
    active: true,
    avatar_url: 'cba-meta:{"g":"FEMENINO","c":"V-14.321.303","r":"COORDINACION","al":["MEDIA_GENERAL"],"a":"preset:female-teal-circle"}',
    academic_assignments: []
  },
  {
    id: 'usr-coord-temp',
    username: 'coordinador',
    password: 'cba2026*coord',
    full_name: 'Lic. Coordinador General (Temporal)',
    email: 'coordinador.prueba@bellasartes.edu.ve',
    role: 'COORDINACION',
    default_level: 'MEDIA_GENERAL',
    active: true,
    avatar_url: 'cba-meta:{"g":"MASCULINO","c":"V-20.123.456","r":"COORDINACION","al":["INICIAL","PRIMARIA","MEDIA_GENERAL"],"a":"preset:male-cyan"}',
    academic_assignments: []
  },
  {
    id: 'usr-orientacion',
    username: 'orientador',
    password: 'cba2026*orienta',
    full_name: 'Lic. Sofía Valentina Navarro',
    email: 'orientacion@bellasartes.edu.ve',
    role: 'ORIENTACION',
    default_level: 'MEDIA_GENERAL',
    active: true,
    avatar_url: 'cba-meta:{"g":"FEMENINO","c":"V-19.876.543","r":"ORIENTACION","al":["INICIAL","PRIMARIA","MEDIA_GENERAL"],"a":"preset:female-teal-circle"}',
    academic_assignments: []
  }
];

async function main() {
  const client = await pool.connect();
  try {
    console.log('🔗 Conectado a PostgreSQL local (sisceba)...');

    for (const acc of accounts) {
      const query = `
        INSERT INTO app_users (id, username, password, full_name, email, role, default_level, active, avatar_url, academic_assignments)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          username = EXCLUDED.username,
          password = EXCLUDED.password,
          full_name = EXCLUDED.full_name,
          email = EXCLUDED.email,
          role = EXCLUDED.role,
          default_level = EXCLUDED.default_level,
          active = EXCLUDED.active,
          avatar_url = EXCLUDED.avatar_url;
      `;
      await client.query(query, [
        acc.id,
        acc.username,
        acc.password,
        acc.full_name,
        acc.email,
        acc.role,
        acc.default_level,
        acc.active,
        acc.avatar_url,
        JSON.stringify(acc.academic_assignments)
      ]);

      const schedQuery = `
        INSERT INTO user_schedules (user_id, user_role, school_year, blocks)
        VALUES ($1, $2, '2026 - 2027', '[]'::jsonb)
        ON CONFLICT (user_id) DO NOTHING;
      `;
      await client.query(schedQuery, [acc.id, acc.role]);

      console.log(`✅ Cuenta registrada con éxito: ${acc.full_name} (${acc.username}) - Rol: ${acc.role}`);
    }

    // Verificar consulta
    const res = await client.query(`
      SELECT id, username, full_name, role, default_level, email 
      FROM app_users 
      WHERE id IN ('usr-directora', 'usr-coord-inicial', 'usr-coord-primaria', 'usr-coord-media', 'usr-coord-temp', 'usr-orientacion');
    `);
    console.log('\n📊 Registros actuales en PostgreSQL:');
    console.table(res.rows);

  } catch (err) {
    console.error('❌ Error registrando cuentas:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
