import fs from 'fs';
import path from 'path';

const seedFile = path.resolve('supabase', 'seed.sql');
let seedContent = fs.readFileSync(seedFile, 'utf-8');

const seccionA = [
  { nro: 1, apellidos: 'AL SAFADI ALSAFADI', pApellido: 'AL SAFADI', sApellido: 'ALSAFADI', nombres: 'MALAK GABRIELA', pNombre: 'MALAK', sNombre: 'GABRIELA', cedula: 'V-36020640', gender: 'F' },
  { nro: 2, apellidos: 'ALDANA VELASQUEZ', pApellido: 'ALDANA', sApellido: 'VELASQUEZ', nombres: 'MAXIMILIANO', pNombre: 'MAXIMILIANO', sNombre: '', cedula: 'V-36070966', gender: 'M' },
  { nro: 3, apellidos: 'ALVAREZ MELEAN', pApellido: 'ALVAREZ', sApellido: 'MELEAN', nombres: 'LUCAS FRANCISCO', pNombre: 'LUCAS', sNombre: 'FRANCISCO', cedula: 'V-35168535', gender: 'M' },
  { nro: 4, apellidos: 'AMAYA DOMINGUEZ', pApellido: 'AMAYA', sApellido: 'DOMINGUEZ', nombres: 'LUCAS DAVID', pNombre: 'LUCAS', sNombre: 'DAVID', cedula: 'V-36076744', gender: 'M' },
  { nro: 5, apellidos: 'ARIAS CASAS', pApellido: 'ARIAS', sApellido: 'CASAS', nombres: 'SALVADOR JESUS', pNombre: 'SALVADOR', sNombre: 'JESUS', cedula: 'V-36348980', gender: 'M' },
  { nro: 6, apellidos: 'BRICEÑO RINCON', pApellido: 'BRICEÑO', sApellido: 'RINCON', nombres: 'ISABELLA ALEJANDRA', pNombre: 'ISABELLA', sNombre: 'ALEJANDRA', cedula: 'V-36743513', gender: 'F' },
  { nro: 7, apellidos: 'CELIN COLLAUTO', pApellido: 'CELIN', sApellido: 'COLLAUTO', nombres: 'PAULA SOFIA', pNombre: 'PAULA', sNombre: 'SOFIA', cedula: 'V-36151949', gender: 'F' },
  { nro: 8, apellidos: 'FARRUGGIO ALVARADO', pApellido: 'FARRUGGIO', sApellido: 'ALVARADO', nombres: 'SERGIO ANDRES', pNombre: 'SERGIO', sNombre: 'ANDRES', cedula: 'V-36658613', gender: 'M' },
  { nro: 9, apellidos: 'FERRER EL KHATIB', pApellido: 'FERRER', sApellido: 'EL KHATIB', nombres: 'OWEN DEREK', pNombre: 'OWEN', sNombre: 'DEREK', cedula: 'V-36152788', gender: 'M' },
  { nro: 10, apellidos: 'FINOL ACOSTA', pApellido: 'FINOL', sApellido: 'ACOSTA', nombres: 'ANTONIO ANDRES', pNombre: 'ANTONIO', sNombre: 'ANDRES', cedula: 'V-36067455', gender: 'M' },
  { nro: 11, apellidos: 'GARCIA SOTO', pApellido: 'GARCIA', sApellido: 'SOTO', nombres: 'ALEJANDRO MANUEL', pNombre: 'ALEJANDRO', sNombre: 'MANUEL', cedula: 'V-36095757', gender: 'M' },
  { nro: 12, apellidos: 'GONZALEZ CAMACHO', pApellido: 'GONZALEZ', sApellido: 'CAMACHO', nombres: 'SHAYNA SOFIA', pNombre: 'SHAYNA', sNombre: 'SOFIA', cedula: 'V-36922961', gender: 'F' },
  { nro: 13, apellidos: 'LINAREZ YANCE', pApellido: 'LINAREZ', sApellido: 'YANCE', nombres: 'LUNA EVA', pNombre: 'LUNA', sNombre: 'EVA', cedula: 'V-36730224', gender: 'F' },
  { nro: 14, apellidos: 'MANGIALARDO RUVOLO', pApellido: 'MANGIALARDO', sApellido: 'RUVOLO', nombres: 'ROCCO', pNombre: 'ROCCO', sNombre: '', cedula: 'V-36235269', gender: 'M' },
  { nro: 15, apellidos: 'MENDT FRANCO', pApellido: 'MENDT', sApellido: 'FRANCO', nombres: 'VERA CATALINA', pNombre: 'VERA', sNombre: 'CATALINA', cedula: 'V-36643915', gender: 'F' },
  { nro: 16, apellidos: 'NAVA PEÑA', pApellido: 'NAVA', sApellido: 'PEÑA', nombres: 'DEIMARY CHIQUINQUIRA', pNombre: 'DEIMARY', sNombre: 'CHIQUINQUIRA', cedula: 'V-36753599', gender: 'F' },
  { nro: 17, apellidos: 'ONTIVEROS VERA', pApellido: 'ONTIVEROS', sApellido: 'VERA', nombres: 'MARIANO', pNombre: 'MARIANO', sNombre: '', cedula: 'V-36191394', gender: 'M' },
  { nro: 18, apellidos: 'ORTEGA ARROYO', pApellido: 'ORTEGA', sApellido: 'ARROYO', nombres: 'JUAN SIMON', pNombre: 'JUAN', sNombre: 'SIMON', cedula: 'V-36732322', gender: 'M' },
  { nro: 19, apellidos: 'PARRA FERNANDEZ', pApellido: 'PARRA', sApellido: 'FERNANDEZ', nombres: 'MARTIN ENRIQUE', pNombre: 'MARTIN', sNombre: 'ENRIQUE', cedula: 'V-36392811', gender: 'M' },
  { nro: 20, apellidos: 'PARRA RINCON', pApellido: 'PARRA', sApellido: 'RINCON', nombres: 'ISABELLA', pNombre: 'ISABELLA', sNombre: '', cedula: 'V-36193195', gender: 'F' },
  { nro: 21, apellidos: 'PARRAGA LOPEZ', pApellido: 'PARRAGA', sApellido: 'LOPEZ', nombres: 'AMANDA FABIOLA', pNombre: 'AMANDA', sNombre: 'FABIOLA', cedula: 'V-36048760', gender: 'F' },
  { nro: 22, apellidos: 'PEREIRA FERREIRA', pApellido: 'PEREIRA', sApellido: 'FERREIRA', nombres: 'MARCELO LEANDRO', pNombre: 'MARCELO', sNombre: 'LEANDRO', cedula: 'V-36063405', gender: 'M' },
  { nro: 23, apellidos: 'QUINTANA GONZALEZ', pApellido: 'QUINTANA', sApellido: 'GONZALEZ', nombres: 'JAVIER JESUS', pNombre: 'JAVIER', sNombre: 'JESUS', cedula: 'V-36060723', gender: 'M' },
  { nro: 24, apellidos: 'QUINTERO VILLALOBOS', pApellido: 'QUINTERO', sApellido: 'VILLALOBOS', nombres: 'LINA ROSA', pNombre: 'LINA', sNombre: 'ROSA', cedula: 'V-36468400', gender: 'F' },
  { nro: 25, apellidos: 'SALAS BEAUJON', pApellido: 'SALAS', sApellido: 'BEAUJON', nombres: 'SAMUEL', pNombre: 'SAMUEL', sNombre: '', cedula: 'V-11418202586', gender: 'M' },
  { nro: 26, apellidos: 'SALOKHAN MARTINEZ', pApellido: 'SALOKHAN', sApellido: 'MARTINEZ', nombres: 'EMILIANA ISABEL', pNombre: 'EMILIANA', sNombre: 'ISABEL', cedula: 'V-36385771', gender: 'F' },
  { nro: 27, apellidos: 'SIMANCAS DE FREITAS', pApellido: 'SIMANCAS', sApellido: 'DE FREITAS', nombres: 'LETICIA VICTORIA', pNombre: 'LETICIA', sNombre: 'VICTORIA', cedula: 'V-36291464', gender: 'F' },
  { nro: 28, apellidos: 'URDANETA ERDODY', pApellido: 'URDANETA', sApellido: 'ERDODY', nombres: 'SANTIAGO ANDRES', pNombre: 'SANTIAGO', sNombre: 'ANDRES', cedula: 'V-36391205', gender: 'M' },
  { nro: 29, apellidos: 'VARGAS SARMIENTO', pApellido: 'VARGAS', sApellido: 'SARMIENTO', nombres: 'MIA MARIA', pNombre: 'MIA', sNombre: 'MARIA', cedula: 'V-36033301', gender: 'F' },
  { nro: 30, apellidos: 'VIVEIROS MESTRE', pApellido: 'VIVEIROS', sApellido: 'MESTRE', nombres: 'JUAN DAVID', pNombre: 'JUAN', sNombre: 'DAVID', cedula: 'V-36129319', gender: 'M' },
  { nro: 31, apellidos: 'YEPEZ GODOY', pApellido: 'YEPEZ', sApellido: 'GODOY', nombres: 'JUAN ANDRES', pNombre: 'JUAN', sNombre: 'ANDRES', cedula: 'V-36353211', gender: 'M' }
];

const seccionB = [
  { nro: 1, apellidos: 'ABOUL MOUNA GHAZAL', pApellido: 'ABOUL MOUNA', sApellido: 'GHAZAL', nombres: 'SANDRA', pNombre: 'SANDRA', sNombre: '', cedula: 'V-36429673', gender: 'F' },
  { nro: 2, apellidos: 'BANFI LUGO', pApellido: 'BANFI', sApellido: 'LUGO', nombres: 'LUCIANO', pNombre: 'LUCIANO', sNombre: '', cedula: 'V-36405717', gender: 'M' },
  { nro: 3, apellidos: 'BLANCO ARCARDI', pApellido: 'BLANCO', sApellido: 'ARCARDI', nombres: 'RODRIGO DANIEL', pNombre: 'RODRIGO', sNombre: 'DANIEL', cedula: 'V-36312209', gender: 'M' },
  { nro: 4, apellidos: 'BRAVO REDONDO', pApellido: 'BRAVO', sApellido: 'REDONDO', nombres: 'OSWALDO ANDRES', pNombre: 'OSWALDO', sNombre: 'ANDRES', cedula: 'V-36193220', gender: 'M' },
  { nro: 5, apellidos: 'DORFMAN LUQUE', pApellido: 'DORFMAN', sApellido: 'LUQUE', nombres: 'MATTHEW', pNombre: 'MATTHEW', sNombre: '', cedula: 'V-36312624', gender: 'M' },
  { nro: 6, apellidos: 'FUENMAYOR CELEDON', pApellido: 'FUENMAYOR', sApellido: 'CELEDON', nombres: 'MARCOS JESUS', pNombre: 'MARCOS', sNombre: 'JESUS', cedula: 'V-36217532', gender: 'M' },
  { nro: 7, apellidos: 'FUENMAYOR COLINA', pApellido: 'FUENMAYOR', sApellido: 'COLINA', nombres: 'IGNACIO ALEJANDRO', pNombre: 'IGNACIO', sNombre: 'ALEJANDRO', cedula: 'V-36432337', gender: 'M' },
  { nro: 8, apellidos: 'FUENMAYOR PARRA', pApellido: 'FUENMAYOR', sApellido: 'PARRA', nombres: 'SAMANTHA ELENA', pNombre: 'SAMANTHA', sNombre: 'ELENA', cedula: 'V-36284384', gender: 'F' },
  { nro: 9, apellidos: 'GARCIA SOTO', pApellido: 'GARCIA', sApellido: 'SOTO', nombres: 'VICTOR MANUEL', pNombre: 'VICTOR', sNombre: 'MANUEL', cedula: 'V-36095819', gender: 'M' },
  { nro: 10, apellidos: 'GIURDANELLA MIRANDA', pApellido: 'GIURDANELLA', sApellido: 'MIRANDA', nombres: 'TIZIANO', pNombre: 'TIZIANO', sNombre: '', cedula: 'V-36144239', gender: 'M' },
  { nro: 11, apellidos: 'HERNANDEZ LARRAZABAL', pApellido: 'HERNANDEZ', sApellido: 'LARRAZABAL', nombres: 'MARTINA', pNombre: 'MARTINA', sNombre: '', cedula: 'V-36193731', gender: 'F' },
  { nro: 12, apellidos: 'HERNANDEZ MONTIEL', pApellido: 'HERNANDEZ', sApellido: 'MONTIEL', nombres: 'TATIANA VICTORIA', pNombre: 'TATIANA', sNombre: 'VICTORIA', cedula: 'V-36072852', gender: 'F' },
  { nro: 13, apellidos: 'HERNANDEZ NIETO', pApellido: 'HERNANDEZ', sApellido: 'NIETO', nombres: 'RODRIGO GABRIEL', pNombre: 'RODRIGO', sNombre: 'GABRIEL', cedula: 'V-36214242', gender: 'M' },
  { nro: 14, apellidos: 'ISSA MANAH', pApellido: 'ISSA', sApellido: 'MANAH', nombres: 'LAYLA', pNombre: 'LAYLA', sNombre: '', cedula: 'V-36080514', gender: 'F' },
  { nro: 15, apellidos: 'LEAL VALECILLOS', pApellido: 'LEAL', sApellido: 'VALECILLOS', nombres: 'CARLOS ARTURO', pNombre: 'CARLOS', sNombre: 'ARTURO', cedula: 'V-34613240', gender: 'M' },
  { nro: 16, apellidos: 'LEON PARDI', pApellido: 'LEON', sApellido: 'PARDI', nombres: 'CARLOS ALFREDO', pNombre: 'CARLOS', sNombre: 'ALFREDO', cedula: 'V-36183087', gender: 'M' },
  { nro: 17, apellidos: 'MARTINEZ CALE', pApellido: 'MARTINEZ', sApellido: 'CALE', nombres: 'ISABELLA PAOLA', pNombre: 'ISABELLA', sNombre: 'PAOLA', cedula: 'V-36086325', gender: 'F' },
  { nro: 18, apellidos: 'MATA NICOLAAS', pApellido: 'MATA', sApellido: 'NICOLAAS', nombres: 'MATEO', pNombre: 'MATEO', sNombre: '', cedula: 'V-36153003', gender: 'M' },
  { nro: 19, apellidos: 'MEDINA VILLARREAL', pApellido: 'MEDINA', sApellido: 'VILLARREAL', nombres: 'RAQUEL ALICIA', pNombre: 'RAQUEL', sNombre: 'ALICIA', cedula: 'V-11419179603', gender: 'F' },
  { nro: 20, apellidos: 'MONTIEL GALUPPO', pApellido: 'MONTIEL', sApellido: 'GALUPPO', nombres: 'VALENTINA LUCIA', pNombre: 'VALENTINA', sNombre: 'LUCIA', cedula: 'V-35105964', gender: 'F' },
  { nro: 21, apellidos: 'ORDUZ ARAGON', pApellido: 'ORDUZ', sApellido: 'ARAGON', nombres: 'BRITTANY NICOLE', pNombre: 'BRITTANY', sNombre: 'NICOLE', cedula: 'V-36984093', gender: 'F' },
  { nro: 22, apellidos: 'PAPPAGALLO RODRIGUEZ', pApellido: 'PAPPAGALLO', sApellido: 'RODRIGUEZ', nombres: 'VITO CARLO', pNombre: 'VITO', sNombre: 'CARLO', cedula: 'V-36510521', gender: 'M' },
  { nro: 23, apellidos: 'PEÑA LEAL', pApellido: 'PEÑA', sApellido: 'LEAL', nombres: 'JULIETA', pNombre: 'JULIETA', sNombre: '', cedula: 'V-37126101', gender: 'F' },
  { nro: 24, apellidos: 'RAMIREZ URDANETA', pApellido: 'RAMIREZ', sApellido: 'URDANETA', nombres: 'DANIEL ENRIQUE', pNombre: 'DANIEL', sNombre: 'ENRIQUE', cedula: 'V-36321572', gender: 'M' },
  { nro: 25, apellidos: 'ROMERO PARRA', pApellido: 'ROMERO', sApellido: 'PARRA', nombres: 'MARCELLA CRISTINA', pNombre: 'MARCELLA', sNombre: 'CRISTINA', cedula: 'V-36309211', gender: 'F' },
  { nro: 26, apellidos: 'SEMAILI ABDUL HAMID', pApellido: 'SEMAILI', sApellido: 'ABDUL HAMID', nombres: 'YALILA', pNombre: 'YALILA', sNombre: '', cedula: 'V-36159531', gender: 'F' },
  { nro: 27, apellidos: 'SEYFI CARRILLO', pApellido: 'SEYFI', sApellido: 'CARRILLO', nombres: 'NAMDAR DAVID', pNombre: 'NAMDAR', sNombre: 'DAVID', cedula: 'V-36341933', gender: 'M' },
  { nro: 28, apellidos: 'VALBUENA JIMENEZ', pApellido: 'VALBUENA', sApellido: 'JIMENEZ', nombres: 'RENE ALEJANDRO', pNombre: 'RENE', sNombre: 'ALEJANDRO', cedula: 'V-36196292', gender: 'M' },
  { nro: 29, apellidos: 'VERA RODRIGUEZ', pApellido: 'VERA', sApellido: 'RODRIGUEZ', nombres: 'RODRIGO ANDRES', pNombre: 'RODRIGO', sNombre: 'ANDRES', cedula: 'V-36055503', gender: 'M' },
  { nro: 30, apellidos: 'VILCHEZ DE ALMEIDA', pApellido: 'VILCHEZ', sApellido: 'DE ALMEIDA', nombres: 'SAMUEL', pNombre: 'SAMUEL', sNombre: '', cedula: 'V-36511553', gender: 'M' },
  { nro: 31, apellidos: 'ZHENG LIANG', pApellido: 'ZHENG', sApellido: 'LIANG', nombres: 'VICTORIA HUIEN', pNombre: 'VICTORIA', sNombre: 'HUIEN', cedula: 'V-36415128', gender: 'F' }
];

function generateStudentRows(list, sec) {
  return list.map(s => {
    const id = `stu-med-1${sec.toLowerCase()}-${String(s.nro).padStart(2, '0')}`;
    const fullName = `${s.apellidos} ${s.nombres}`.trim();
    const meta = JSON.stringify({
      primerNombre: s.pNombre,
      segundoNombre: s.sNombre,
      primerApellido: s.pApellido,
      segundoApellido: s.sApellido,
      nacionalidad: 'V',
      pais: 'Venezuela',
      estado: 'Zulia',
      ciudad: 'Maracaibo',
      estadoCivil: 'Soltero(a)',
      religion: 'Católica',
      direccion: '',
      telefono: '',
      alergiasSalud: ''
    });
    const avatarUrl = `stu-meta:${meta}`;
    return `('${id}', '${s.cedula}', '${fullName}', '${s.gender}', '2014-01-15', 'MEDIA_GENERAL', '1er Año', '${sec}', 'Representante Legal', '', '', 'REGULAR', '{}', '${avatarUrl}')`;
  }).join(',\n');
}

function generateStudentUserRows(list, sec) {
  return list.map(s => {
    const userId = `usr-stu-med-1${sec.toLowerCase()}-${String(s.nro).padStart(2, '0')}`;
    const normUser = s.cedula.toLowerCase().replace(/[^a-z0-9]/g, '');
    const rawDigits = s.cedula.replace(/[^0-9]/g, '') || 'cba2026';
    const fullName = `${s.apellidos} ${s.nombres}`.trim();
    const email = `${normUser}@estudiante.cba`;
    const gender = s.gender === 'F' ? 'FEMENINO' : 'MASCULINO';
    const metaObj = {
      g: gender,
      c: s.cedula,
      r: 'ESTUDIANTE',
      al: ['MEDIA_GENERAL'],
      gr: '1er Año',
      sec: sec,
      a: ''
    };
    const avatarMeta = `cba-meta:${JSON.stringify(metaObj)}`;
    return `('${userId}', '${normUser}', '${rawDigits}', '${fullName}', '${email}', 'ESTUDIANTE', 'MEDIA_GENERAL', true, '${avatarMeta}', '[]'::jsonb)`;
  }).join(',\n');
}

const studentsA_SQL = generateStudentRows(seccionA, 'A');
const studentsB_SQL = generateStudentRows(seccionB, 'B');

const studentUsersA_SQL = generateStudentUserRows(seccionA, 'A');
const studentUsersB_SQL = generateStudentUserRows(seccionB, 'B');

const newStudentsSection = `-- 1. ESTUDIANTES INSTITUCIONALES (1er Año Media General Secciones A y B)
INSERT INTO students (id, cedula, full_name, gender, birth_date, level, grade, section, representative_name, representative_email, representative_phone, status, pending_subjects, avatar_url)
VALUES
-- Sección 1 A Media General (Docente Guía: Valecillos de Rubio Lilia Josefina)
${studentsA_SQL},
-- Sección 1 B Media General (Docente Guía: Parra Fuenmayor Larry Jose)
${studentsB_SQL}
ON CONFLICT (cedula) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  gender = EXCLUDED.gender,
  grade = EXCLUDED.grade,
  section = EXCLUDED.section,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = NOW();`;

// Reemplazar la sección 1 en seed.sql
seedContent = seedContent.replace(
  /-- 1\. ESTUDIANTES INICIALES[\s\S]*?DELETE FROM students;/,
  newStudentsSection
);

// Reemplazar la sección app_users para incluir docentes + los 62 estudiantes
const studentUsersBlock = `,\n-- CUENTAS DE USUARIO PARA ESTUDIANTES (1er Año Sección A y B)\n${studentUsersA_SQL},\n${studentUsersB_SQL}`;

if (!seedContent.includes('usr-stu-med-1a-01')) {
  seedContent = seedContent.replace(
    /\('usr-doc-lreyes'[\s\S]*?'\[\{"id":"asig-1a-rob"[\s\S]*?\}\]'::jsonb\)/,
    match => `${match}${studentUsersBlock}`
  );
}

fs.writeFileSync(seedFile, seedContent, 'utf-8');
console.log('✅ supabase/seed.sql actualizado exitosamente con los 62 estudiantes oficiales y sus cuentas de app_users.');
