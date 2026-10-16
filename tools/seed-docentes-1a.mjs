import pg from 'pg';

const { Pool } = pg;
const PG_CONN_STRING = 'postgres://postgres@127.0.0.1:5432/sisceba';

const pool = new Pool({
  connectionString: PG_CONN_STRING
});

// Asignaturas y Áreas de Formación oficiales para 1er Año Media General
const subjectAreas = [
  {
    id: 'med-cas',
    code: 'MED-CAS',
    name: 'Castellano',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    weekly_hours: 4,
    area_profile: 'Análisis literario universal y latinoamericano, redacción académica y retórica.',
    teacher_profile: 'Licenciado en Letras o Educación mención Lengua y Literatura.',
    icon_name: 'BookOpen'
  },
  {
    id: 'med-ing',
    code: 'MED-ING',
    name: 'Inglés y Otras Lenguas Extranjeras',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    weekly_hours: 4,
    area_profile: 'Dominio del marco comunicativo formal, producción de ensayos y conversación funcional.',
    teacher_profile: 'Licenciado en Idiomas Modernos mención Inglés Técnico y Académico.',
    icon_name: 'Languages'
  },
  {
    id: 'med-mat',
    code: 'MED-MAT',
    name: 'Matemática',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    weekly_hours: 5,
    area_profile: 'Álgebra formal, números racionales e irracionales, geometría analítica y pensamiento lógico.',
    teacher_profile: 'Licenciado en Educación mención Matemáticas o Matemático Puro.',
    icon_name: 'Calculator'
  },
  {
    id: 'med-ef-m',
    code: 'MED-EF-M',
    name: 'Educación Física M',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    weekly_hours: 3,
    area_profile: 'Acondicionamiento físico, destrezas atléticas y fundamentación deportiva masculina.',
    teacher_profile: 'Licenciado en Educación Física y Entrenamiento Deportivo.',
    icon_name: 'Activity'
  },
  {
    id: 'med-ef-f',
    code: 'MED-EF-F',
    name: 'Educación Física F',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    weekly_hours: 3,
    area_profile: 'Acondicionamiento físico, gimnasia formativa y fundamentación deportiva femenina.',
    teacher_profile: 'Licenciada en Educación Física y Deporte Escolar.',
    icon_name: 'Activity'
  },
  {
    id: 'med-ap',
    code: 'MED-AP',
    name: 'Arte y Patrimonio',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    weekly_hours: 4,
    area_profile: 'Historia de las artes plásticas, patrimonio cultural tangible e intangible y expresión visual.',
    teacher_profile: 'Licenciado en Artes Plásticas, Museología o Educación Artística.',
    icon_name: 'Landmark'
  },
  {
    id: 'med-cn',
    code: 'MED-CN',
    name: 'Ciencias Naturales',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    weekly_hours: 4,
    area_profile: 'Bases científicas integradas de la materia, ecosistemas, energía y método científico experimental.',
    teacher_profile: 'Licenciado en Educación mención Ciencias Biológicas o Ciencias Naturales.',
    icon_name: 'Compass'
  },
  {
    id: 'med-ghc',
    code: 'MED-GHC',
    name: 'Geografía, Historia y Ciudadanía',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    weekly_hours: 4,
    area_profile: 'Geopolítica de Venezuela, procesos históricos republicanos y valores de identidad nacional.',
    teacher_profile: 'Licenciado en Educación mención Ciencias Sociales o Historiador.',
    icon_name: 'MapPin'
  },
  {
    id: 'med-ocv',
    code: 'MED-OCV',
    name: 'Orientación y Convivencia',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    weekly_hours: 2,
    area_profile: 'Acompañamiento socioafectivo, resolución pacífica de conflictos y tutoría grupal.',
    teacher_profile: 'Docente Guía con diplomado en tutoría o Psicólogo Escolar.',
    icon_name: 'Users'
  },
  {
    id: 'med-ag',
    code: 'MED-AG',
    name: 'Artes Gráficas (Complementaria)',
    level: 'MEDIA_GENERAL',
    type: 'INTEGRADA',
    weekly_hours: 3,
    area_profile: 'Composición digital, diseño editorial y producción gráfica escolar.',
    teacher_profile: 'Diseñador Gráfico o Licenciado en Artes Audiovisuales.',
    icon_name: 'Palette'
  },
  {
    id: 'med-inf',
    code: 'MED-INF',
    name: 'Informática (Complementaria)',
    level: 'MEDIA_GENERAL',
    type: 'INTEGRADA',
    weekly_hours: 3,
    area_profile: 'Alfabetización digital, suites ofimáticas avanzadas, algoritmos y ciudadanía digital.',
    teacher_profile: 'Ingeniero en Computación, Sistemas o Informática Educativa.',
    icon_name: 'Cpu'
  },
  {
    id: 'med-inno',
    code: 'MED-INNO',
    name: 'Innomat (Complementaria)',
    level: 'MEDIA_GENERAL',
    type: 'INTEGRADA',
    weekly_hours: 2,
    area_profile: 'Innovación matemática, desafíos operacionales, lógica abstracta y resolución de problemas.',
    teacher_profile: 'Especialista en didáctica innovadora de las matemáticas.',
    icon_name: 'Sparkles'
  },
  {
    id: 'med-rob',
    code: 'MED-ROB',
    name: 'Robótica Educativa (Complementaria)',
    level: 'MEDIA_GENERAL',
    type: 'INTEGRADA',
    weekly_hours: 3,
    area_profile: 'Diseño estructural mecatrónico, sensores, motores y programación por bloques/código.',
    teacher_profile: 'Ingeniero Mecatrónico o en Electrónica con formación pedagógica.',
    icon_name: 'Cpu'
  }
];

// Docentes oficiales de 1er Año Sección "A" (Periodo 2026-2027)
const docentesData = [
  {
    id: 'usr-doc-ibarrios',
    username: 'ibarrios',
    cedula: 'V-26861504',
    fullName: 'Idalcira Barrios González',
    email: 'ibarrios@bellasartes.edu.ve',
    gender: 'FEMENINO',
    assignments: [
      { id: 'asig-1a-cas', level: 'MEDIA_GENERAL', grade: '1er Año', section: 'A', areaId: 'med-cas', areaCode: 'MED-CAS', areaName: 'Castellano', subjectName: 'Castellano' }
    ]
  },
  {
    id: 'usr-doc-jrivera',
    username: 'jrivera',
    cedula: 'V-10447027',
    fullName: 'Jenny Rivera',
    email: 'jrivera@bellasartes.edu.ve',
    gender: 'FEMENINO',
    assignments: [
      { id: 'asig-1a-ing', level: 'MEDIA_GENERAL', grade: '1er Año', section: 'A', areaId: 'med-ing', areaCode: 'MED-ING', areaName: 'Inglés y Otras Lenguas Extranjeras', subjectName: 'Inglés y Otras Lenguas Extranjeras' }
    ]
  },
  {
    id: 'usr-doc-rfuenmayor',
    username: 'rfuenmayor',
    cedula: 'V-15939313',
    fullName: 'Román Fuenmayor Chirinos',
    email: 'rfuenmayor@bellasartes.edu.ve',
    gender: 'MASCULINO',
    assignments: [
      { id: 'asig-1a-mat', level: 'MEDIA_GENERAL', grade: '1er Año', section: 'A', areaId: 'med-mat', areaCode: 'MED-MAT', areaName: 'Matemática', subjectName: 'Matemática' }
    ]
  },
  {
    id: 'usr-doc-jurdaneta',
    username: 'jurdaneta',
    cedula: 'V-15937740',
    fullName: 'Jhon Alexander Urdaneta Carrasquero',
    email: 'jurdaneta@bellasartes.edu.ve',
    gender: 'MASCULINO',
    assignments: [
      { id: 'asig-1a-ef-m', level: 'MEDIA_GENERAL', grade: '1er Año', section: 'A', areaId: 'med-ef-m', areaCode: 'MED-EF-M', areaName: 'Educación Física M', subjectName: 'Educación Física M' }
    ]
  },
  {
    id: 'usr-doc-mcordero',
    username: 'mcordero',
    cedula: 'V-15766060',
    fullName: 'Mailyn del Carmen Cordero González',
    email: 'mcordero@bellasartes.edu.ve',
    gender: 'FEMENINO',
    assignments: [
      { id: 'asig-1a-ef-f', level: 'MEDIA_GENERAL', grade: '1er Año', section: 'A', areaId: 'med-ef-f', areaCode: 'MED-EF-F', areaName: 'Educación Física F', subjectName: 'Educación Física F' }
    ]
  },
  {
    id: 'usr-doc-kportillo',
    username: 'kportillo',
    cedula: 'V-19906566',
    fullName: 'Kenyerly Portillo',
    email: 'kportillo@bellasartes.edu.ve',
    gender: 'FEMENINO',
    assignments: [
      { id: 'asig-1a-ap', level: 'MEDIA_GENERAL', grade: '1er Año', section: 'A', areaId: 'med-ap', areaCode: 'MED-AP', areaName: 'Arte y Patrimonio', subjectName: 'Arte y Patrimonio' }
    ]
  },
  {
    id: 'usr-doc-lilia-valecillos',
    username: 'lvalecillos',
    cedula: 'V-9721304',
    fullName: 'Lilia Josefina Valecillos de Rubio',
    email: 'lvalecillos@bellasartes.edu.ve',
    gender: 'FEMENINO',
    assignments: [
      { id: 'asig-1a-cn', level: 'MEDIA_GENERAL', grade: '1er Año', section: 'A', areaId: 'med-cn', areaCode: 'MED-CN', areaName: 'Ciencias Naturales', subjectName: 'Ciencias Naturales' },
      { id: 'asig-1a-ocv', level: 'MEDIA_GENERAL', grade: '1er Año', section: 'A', areaId: 'med-ocv', areaCode: 'MED-OCV', areaName: 'Orientación y Convivencia', subjectName: 'Orientación y Convivencia' }
    ]
  },
  {
    id: 'usr-doc-igarcia',
    username: 'igarcia',
    cedula: 'V-7801989',
    fullName: 'Iris García Granadillo',
    email: 'igarcia@bellasartes.edu.ve',
    gender: 'FEMENINO',
    assignments: [
      { id: 'asig-1a-ghc', level: 'MEDIA_GENERAL', grade: '1er Año', section: 'A', areaId: 'med-ghc', areaCode: 'MED-GHC', areaName: 'Geografía, Historia y Ciudadanía', subjectName: 'Geografía, Historia y Ciudadanía' }
    ]
  },
  {
    id: 'usr-doc-larry-parra',
    username: 'lparra',
    cedula: 'V-9777689',
    fullName: 'Larry José Parra Fuenmayor',
    email: 'lparra@bellasartes.edu.ve',
    gender: 'MASCULINO',
    assignments: [
      { id: 'asig-1a-ag', level: 'MEDIA_GENERAL', grade: '1er Año', section: 'A', areaId: 'med-ag', areaCode: 'MED-AG', areaName: 'Artes Gráficas (Complementaria)', subjectName: 'Artes Gráficas (Complementaria)' },
      { id: 'asig-1b-ocv', level: 'MEDIA_GENERAL', grade: '1er Año', section: 'B', areaId: 'med-ocv', areaCode: 'MED-OCV', areaName: 'Orientación y Convivencia', subjectName: 'Orientación y Convivencia' }
    ]
  },
  {
    id: 'usr-doc-ychaparro',
    username: 'ychaparro',
    cedula: 'V-12308361',
    fullName: 'Yeslany Malaret Chaparro Casilla',
    email: 'ychaparro@bellasartes.edu.ve',
    gender: 'FEMENINO',
    assignments: [
      { id: 'asig-1a-inf', level: 'MEDIA_GENERAL', grade: '1er Año', section: 'A', areaId: 'med-inf', areaCode: 'MED-INF', areaName: 'Informática (Complementaria)', subjectName: 'Informática (Complementaria)' }
    ]
  },
  {
    id: 'usr-doc-evillalobos',
    username: 'evillalobos',
    cedula: 'V-20658928',
    fullName: 'Efraín Antonio Villalobos Montiel',
    email: 'evillalobos@bellasartes.edu.ve',
    gender: 'MASCULINO',
    assignments: [
      { id: 'asig-1a-inno', level: 'MEDIA_GENERAL', grade: '1er Año', section: 'A', areaId: 'med-inno', areaCode: 'MED-INNO', areaName: 'Innomat (Complementaria)', subjectName: 'Innomat (Complementaria)' }
    ]
  },
  {
    id: 'usr-doc-lreyes',
    username: 'lreyes',
    cedula: 'V-19936866',
    fullName: 'Luis Miguel Reyes Sira',
    email: 'lreyes@bellasartes.edu.ve',
    gender: 'MASCULINO',
    assignments: [
      { id: 'asig-1a-rob', level: 'MEDIA_GENERAL', grade: '1er Año', section: 'A', areaId: 'med-rob', areaCode: 'MED-ROB', areaName: 'Robótica Educativa (Complementaria)', subjectName: 'Robótica Educativa (Complementaria)' }
    ]
  }
];

async function main() {
  console.log('📌 Sincronizando Áreas Curriculares y Plantilla Docente de 1er Año Sección "A"...');
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Sincronizar subject_areas
    console.log(`📚 Sincronizando ${subjectAreas.length} asignaturas oficiales en subject_areas...`);
    for (const sa of subjectAreas) {
      await client.query(`
        INSERT INTO subject_areas (id, code, name, level, type, weekly_hours, area_profile, teacher_profile, icon_name)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          code = EXCLUDED.code,
          level = EXCLUDED.level,
          type = EXCLUDED.type,
          weekly_hours = EXCLUDED.weekly_hours,
          area_profile = EXCLUDED.area_profile,
          teacher_profile = EXCLUDED.teacher_profile,
          icon_name = EXCLUDED.icon_name;
      `, [sa.id, sa.code, sa.name, sa.level, sa.type, sa.weekly_hours, sa.area_profile, sa.teacher_profile, sa.icon_name]);
    }

    // 2. Registrar docentes y sus cargas académicas en app_users
    console.log(`👩‍🏫 Registrando ${docentesData.length} docentes y sus cargas académicas en app_users...`);
    for (const doc of docentesData) {
      const meta = {
        g: doc.gender,
        c: doc.cedula,
        r: 'DOCENTE',
        re: true,
        rm: true,
        al: ['MEDIA_GENERAL'],
        a: ''
      };
      const avatarUrl = `cba-meta:${JSON.stringify(meta)}`;

      await client.query(`
        INSERT INTO app_users (id, username, password, full_name, email, role, default_level, active, avatar_url, academic_assignments)
        VALUES ($1, $2, 'cba2026*docente', $3, $4, 'DOCENTE', 'MEDIA_GENERAL', true, $5, $6::jsonb)
        ON CONFLICT (username) DO UPDATE SET
          full_name = EXCLUDED.full_name,
          email = EXCLUDED.email,
          avatar_url = EXCLUDED.avatar_url,
          academic_assignments = EXCLUDED.academic_assignments;
      `, [doc.id, doc.username, doc.fullName, doc.email, avatarUrl, JSON.stringify(doc.assignments)]);
    }

    await client.query('COMMIT');
    console.log('✅ ¡Sincronización completada con éxito!');
    console.log(`   - ${subjectAreas.length} asignaturas registradas/actualizadas`);
    console.log(`   - ${docentesData.length} docentes registrados con sus cátedras asignadas a 1er Año Sección "A"`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error en la sincronización:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
