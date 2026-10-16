import { Student, EvaluationRecord, PassRecord, DailyAttendanceRecord } from '../types';

/**
 * Datos Institucionales de Muestra y Auditoría Pedagógica UCE - Colegio Bellas Artes
 * Permite visualizar y auditar de inmediato las 8 capacidades del módulo de Consultas:
 * - Sábana consolidada y promedios por nivel (Inicial, Primaria, Media General)
 * - Semáforo UCE de carga docente en tiempo real con alertas y recordatorios
 * - Cuadro de Honor con medallas
 * - Alertas LOE Art. 109 por inasistencias (>25%)
 * - Pases de portería por retraso
 * - Boletines oficiales y nóminas con exportación a Excel
 */

// 1. Estudiantes de Muestra para Inicial (Salas de 3, 4 y 5 Años, Secciones A y B)
export const DEMO_STUDENTS_INICIAL: Student[] = [
  {
    id: 'demo-ini-3a-01',
    cedula: 'CE-31800101',
    fullName: 'BENITEZ OCHOA SOFIA VALENTINA',
    primerNombre: 'SOFIA',
    primerApellido: 'BENITEZ',
    gender: 'F',
    birthDate: '2023-04-12',
    level: 'INICIAL',
    grade: 'Sala de 3 Años',
    section: 'A',
    representativeName: 'CARLOS BENITEZ',
    representativeEmail: 'carlos.benitez@gmail.com',
    representativePhone: '0414-6123456',
    status: 'REGULAR',
    pendingSubjects: []
  },
  {
    id: 'demo-ini-3a-02',
    cedula: 'CE-31800102',
    fullName: 'DELGADO MORALES MATEO ALEJANDRO',
    primerNombre: 'MATEO',
    primerApellido: 'DELGADO',
    gender: 'M',
    birthDate: '2023-05-18',
    level: 'INICIAL',
    grade: 'Sala de 3 Años',
    section: 'A',
    representativeName: 'ELENA MORALES',
    representativeEmail: 'elena.morales@gmail.com',
    representativePhone: '0424-6789012',
    status: 'REGULAR',
    pendingSubjects: []
  },
  {
    id: 'demo-ini-4b-01',
    cedula: 'CE-31800201',
    fullName: 'GUANIPA BOSCAN ISABELLA MARINA',
    primerNombre: 'ISABELLA',
    primerApellido: 'GUANIPA',
    gender: 'F',
    birthDate: '2022-02-20',
    level: 'INICIAL',
    grade: 'Sala de 4 Años',
    section: 'B',
    representativeName: 'MARIO GUANIPA',
    representativeEmail: 'mario.guanipa@gmail.com',
    representativePhone: '0412-3344556',
    status: 'REGULAR',
    pendingSubjects: []
  },
  {
    id: 'demo-ini-5a-01',
    cedula: 'CE-31800301',
    fullName: 'RODRIGUEZ URDANETA JOAQUIN ANDRES',
    primerNombre: 'JOAQUIN',
    primerApellido: 'RODRIGUEZ',
    gender: 'M',
    birthDate: '2021-08-14',
    level: 'INICIAL',
    grade: 'Sala de 5 Años',
    section: 'A',
    representativeName: 'PATRICIA URDANETA',
    representativeEmail: 'patricia.urdaneta@gmail.com',
    representativePhone: '0414-7890123',
    status: 'REGULAR',
    pendingSubjects: []
  }
];

// 2. Estudiantes de Muestra para Primaria (1ero a 6to Grado, Secciones A y B)
export const DEMO_STUDENTS_PRIMARIA: Student[] = [
  {
    id: 'demo-pri-1a-01',
    cedula: 'CE-32100101',
    fullName: 'ALVAREZ RINCON CAMILA VICTORIA',
    primerNombre: 'CAMILA',
    primerApellido: 'ALVAREZ',
    gender: 'F',
    birthDate: '2020-03-10',
    level: 'PRIMARIA',
    grade: '1er Grado',
    section: 'A',
    representativeName: 'ANDRES ALVAREZ',
    representativeEmail: 'andres.alvarez@gmail.com',
    representativePhone: '0414-1122334',
    status: 'REGULAR',
    pendingSubjects: []
  },
  {
    id: 'demo-pri-1a-02',
    cedula: 'CE-32100102',
    fullName: 'CASTILLO MONTIEL DIEGO SEBASTIAN',
    primerNombre: 'DIEGO',
    primerApellido: 'CASTILLO',
    gender: 'M',
    birthDate: '2020-07-22',
    level: 'PRIMARIA',
    grade: '1er Grado',
    section: 'A',
    representativeName: 'MARIANA MONTIEL',
    representativeEmail: 'mariana.montiel@gmail.com',
    representativePhone: '0424-2233445',
    status: 'REGULAR',
    pendingSubjects: []
  },
  {
    id: 'demo-pri-3b-01',
    cedula: 'CE-32300101',
    fullName: 'FERNANDEZ PARRA SANTIAGO JOSE',
    primerNombre: 'SANTIAGO',
    primerApellido: 'FERNANDEZ',
    gender: 'M',
    birthDate: '2018-11-05',
    level: 'PRIMARIA',
    grade: '3er Grado',
    section: 'B',
    representativeName: 'JOSE FERNANDEZ',
    representativeEmail: 'jose.fernandez@gmail.com',
    representativePhone: '0414-3344556',
    status: 'REGULAR',
    pendingSubjects: []
  },
  {
    id: 'demo-pri-6a-01',
    cedula: 'V-34500101',
    fullName: 'HERRERA VILLALOBOS VALERIA SOFIA',
    primerNombre: 'VALERIA',
    primerApellido: 'HERRERA',
    gender: 'F',
    birthDate: '2015-09-12',
    level: 'PRIMARIA',
    grade: '6to Grado',
    section: 'A',
    representativeName: 'GABRIEL HERRERA',
    representativeEmail: 'gabriel.herrera@gmail.com',
    representativePhone: '0416-4455667',
    status: 'REGULAR',
    pendingSubjects: []
  }
];

// Helper para generar evaluaciones de Media General para los 62 estudiantes existentes
export const generateDemoEvaluations = (mediaStudents: Student[]): EvaluationRecord[] => {
  const evals: EvaluationRecord[] = [];
  const now = new Date().toISOString();

  // Asignaturas clave de 1er Año
  const mediaAreas = [
    { id: 'med-ef', code: 'MED-EF' },
    { id: 'med-qui', code: 'MED-QUI' },
    { id: 'med-fis', code: 'MED-FIS' },
    { id: 'med-bio', code: 'MED-BIO' },
    { id: 'med-fin', code: 'MED-FIN' },
    { id: 'med-cas', code: 'MED-CAS' },
    { id: 'med-ing', code: 'MED-ING' },
    { id: 'med-mat', code: 'MED-MAT' },
    { id: 'med-ap', code: 'MED-AP' },
    { id: 'med-cn', code: 'MED-CN' },
    { id: 'med-ghc', code: 'MED-GHC' },
    { id: 'med-rob', code: 'MED-ROB' }
  ];

  // 1. Evaluaciones Media General (Numérico 01 a 20 con cuadro de honor y materias pendientes)
  mediaStudents.forEach((stu, sIdx) => {
    // Definir perfil de rendimiento
    const isTopStudent = sIdx < 5; // Cuadro de honor (18-20)
    const isStruggling = sIdx === 12 || sIdx === 25; // Materia pendiente (08-09 en matemáticas/física)

    mediaAreas.forEach((area, aIdx) => {
      let score: number;

      if (isTopStudent) {
        score = 18 + ((sIdx + aIdx) % 3); // 18, 19, 20
        if (score > 20) score = 20;
      } else if (isStruggling && (area.id === 'med-mat' || area.id === 'med-fis')) {
        score = 8 + (aIdx % 2); // 08 o 09 (Materia Pendiente para visualización de alerta)
      } else {
        score = 12 + ((sIdx * 3 + aIdx * 2) % 7); // 12 a 18
      }

      evals.push({
        id: `eval-demo-${stu.id}-${area.id}-l1`,
        studentId: stu.id,
        areaId: area.id,
        moment: 'FINAL_LAPSO',
        lapso: 1,
        scoreNumeric: score,
        recordedAt: now,
        teacherId: 'usr-doc-01'
      });
    });
  });

  // 2. Evaluaciones Primaria (Cualitativa: L = Logrado, EP = En Proceso, I = Iniciado según GEMINI.md)
  const primariaAreas = ['pri-len', 'pri-mat', 'pri-soc', 'pri-ap', 'pri-ef', 'pri-rob', 'pri-ing'];
  DEMO_STUDENTS_PRIMARIA.forEach((stu, sIdx) => {
    primariaAreas.forEach((areaId, aIdx) => {
      const qualScore: 'L' | 'EP' | 'I' = (sIdx + aIdx) % 4 === 0 ? 'EP' : 'L';
      evals.push({
        id: `eval-demo-pri-${stu.id}-${areaId}-l1`,
        studentId: stu.id,
        areaId: areaId,
        moment: 'FINAL_LAPSO',
        lapso: 1,
        scoreQualitative: qualScore,
        recordedAt: now,
        teacherId: 'usr-doc-pri'
      });
    });
  });

  // 3. Evaluaciones Inicial (Literal: A, B, C, D, E según GEMINI.md)
  const inicialAreas = ['ini-fp', 'ini-ca', 'ini-ap', 'ini-ef', 'ini-ing', 'ini-inf'];
  DEMO_STUDENTS_INICIAL.forEach((stu, sIdx) => {
    inicialAreas.forEach((areaId, aIdx) => {
      const litScore: 'A' | 'B' | 'C' = (sIdx + aIdx) % 3 === 0 ? 'B' : 'A';
      evals.push({
        id: `eval-demo-ini-${stu.id}-${areaId}-l1`,
        studentId: stu.id,
        areaId: areaId,
        moment: 'FINAL_LAPSO',
        lapso: 1,
        scoreLiteral: litScore,
        recordedAt: now,
        teacherId: 'usr-doc-ini'
      });
    });
  });

  return evals;
};

// 3. Registros de Inasistencias con Alerta Normativa LOE Art. 109 (>25%)
export const generateDemoDailyAttendance = (allStudents: Student[]): DailyAttendanceRecord[] => {
  const records: DailyAttendanceRecord[] = [];
  const baseDate = '2026-10-';

  allStudents.slice(0, 15).forEach((stu, sIdx) => {
    // Alumno en riesgo LOE: stu-med-1a-03 y stu-med-1a-10 superan el 25% de inasistencias injustificadas
    const isAtRisk = sIdx === 2 || sIdx === 9;
    const absencesCount = isAtRisk ? 9 : (sIdx % 3); // 9 de 30 = 30% (>25% LOE Art. 109)

    for (let day = 1; day <= 20; day++) {
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      const isAbsent = day <= absencesCount;

      records.push({
        id: `att-demo-${stu.id}-${day}`,
        studentId: stu.id,
        studentName: stu.fullName,
        gradeSection: `${stu.grade} ${stu.section}`,
        date: `${baseDate}${dayStr}`,
        status: isAbsent
          ? (day % 2 === 0 ? 'INASISTENCIA_INJUSTIFICADA' : 'INASISTENCIA_JUSTIFICADA')
          : 'PRESENTE',
        justification: isAbsent && day % 2 !== 0 ? 'Reposo médico certificado entregado a coordinación' : undefined,
        lapso: 1
      });
    }
  });

  return records;
};

// 4. Pases Oficiales de Portería por Retraso o Salida Autorizada
export const DEMO_PASSES: PassRecord[] = [
  {
    id: 'pass-demo-01',
    ticketNumber: 'TKT-2026-081',
    studentId: 'stu-med-1a-01',
    studentName: 'AL SAFADI ALSAFADI MALAK GABRIELA',
    gradeSection: '1er Año A',
    date: '2026-10-15',
    time: '07:22 AM',
    reason: 'Retraso por congestión vial vehicular en Av. 5 de Julio.',
    authorizedBy: 'Lic. Carolina Sánchez (Coordinación UCE)',
    printed: true
  },
  {
    id: 'pass-demo-02',
    ticketNumber: 'TKT-2026-082',
    studentId: 'stu-med-1a-02',
    studentName: 'ALDANA VELASQUEZ MAXIMILIANO',
    gradeSection: '1er Año A',
    date: '2026-10-14',
    time: '07:18 AM',
    reason: 'Retraso de transporte escolar CBA.',
    authorizedBy: 'Portería Principal / Seguridad',
    printed: true
  },
  {
    id: 'pass-demo-03',
    ticketNumber: 'TKT-2026-083',
    studentId: 'stu-med-1b-05',
    studentName: 'CHIRINOS RINCON SEBASTIAN ANDRES',
    gradeSection: '1er Año B',
    date: '2026-10-12',
    time: '11:45 AM',
    reason: 'Salida anticipada autorizada por cita médica odontológica.',
    authorizedBy: 'Dirección Académica CBA',
    printed: true
  },
  {
    id: 'pass-demo-04',
    ticketNumber: 'TKT-2026-084',
    studentId: 'stu-med-1b-10',
    studentName: 'GARCIA NAVA ISABELLA SOFIA',
    gradeSection: '1er Año B',
    date: '2026-10-10',
    time: '07:25 AM',
    reason: 'Inclemencias climáticas y lluvia torrencial en la zona norte.',
    authorizedBy: 'Lic. Carolina Sánchez (Coordinación UCE)',
    printed: true
  }
];
