import { BulletinObservationTemplate, SpecializedSkillRecord } from '../types';

export const INITIAL_OBSERVATION_TEMPLATES: BulletinObservationTemplate[] = [
  // --- EDUCACIÓN INICIAL ---
  {
    id: 'obs-ini-1',
    level: 'INICIAL',
    category: 'RENDIMIENTO',
    code: 'INI-REND-01',
    title: 'Desarrollo Cognitivo y Lenguaje',
    text: 'Expresa sus ideas con claridad, identifica formas y colores primarios y secundarios, y demuestra gran curiosidad en las actividades de exploración.',
    grade: 'Sala de 4 Años',
    active: true
  },
  {
    id: 'obs-ini-2',
    level: 'INICIAL',
    category: 'ACTITUD',
    code: 'INI-ACT-01',
    title: 'Autonomía y Hábitos',
    text: 'Muestra notable independencia al cuidar sus pertenencias personales, guardar los materiales de juego y cumplir su rutina diaria de higiene.',
    grade: 'Sala de 5 Años',
    active: true
  },
  {
    id: 'obs-ini-3',
    level: 'INICIAL',
    category: 'CONVIVENCIA',
    code: 'INI-CONV-01',
    title: 'Socialización e Integración',
    text: 'Se relaciona cordialmente con sus compañeros, comparte juguetes en los espacios de trabajo y practica normas de cortesía espontáneamente.',
    active: true
  },
  {
    id: 'obs-ini-4',
    level: 'INICIAL',
    category: 'RECOMENDACION',
    code: 'INI-REC-01',
    title: 'Apoyo Familiar en el Hogar',
    text: 'Se sugiere continuar fomentando la narración de cuentos en familia y la realización de actividades psicomotrices de recorte y rasgado.',
    active: true
  },

  // --- EDUCACIÓN PRIMARIA ---
  {
    id: 'obs-pri-1',
    level: 'PRIMARIA',
    category: 'RENDIMIENTO',
    code: 'PRI-REND-01',
    title: 'Comprensión Lectora y Expresión Escrita',
    text: 'Demuestra fluidez en la lectura en voz alta, excelente entonación y redacta textos coherentes con caligrafía legible y ortografía adecuada.',
    active: true
  },
  {
    id: 'obs-pri-2',
    level: 'PRIMARIA',
    category: 'RENDIMIENTO',
    code: 'PRI-REND-02',
    title: 'Pensamiento Lógico-Matemático',
    text: 'Domina las operaciones básicas y aplica estrategias heurísticas efectivas para la resolución de problemas cotidianos.',
    active: true
  },
  {
    id: 'obs-pri-3',
    level: 'PRIMARIA',
    category: 'ACTITUD',
    code: 'PRI-ACT-01',
    title: 'Responsabilidad y Orden',
    text: 'Mantiene sus cuadernos al día con pulcritud, entrega sus tareas puntualmente y demuestra dedicación y disciplina escolar.',
    active: true
  },
  {
    id: 'obs-pri-4',
    level: 'PRIMARIA',
    category: 'CONVIVENCIA',
    code: 'PRI-CONV-01',
    title: 'Valores y Solidaridad',
    text: 'Es solidario con sus compañeros, participa activamente en los proyectos de aula y muestra disposición colaborativa para el trabajo en equipo.',
    active: true
  },
  {
    id: 'obs-pri-5',
    level: 'PRIMARIA',
    category: 'RECOMENDACION',
    code: 'PRI-REC-01',
    title: 'Consolidación del Hábito Lector',
    text: 'Se recomienda dedicar al menos 20 minutos diarios a la lectura recreativa guiada en el hogar y afianzar las tablas de multiplicar.',
    active: true
  },

  // --- EDUCACIÓN MEDIA GENERAL ---
  {
    id: 'obs-med-1',
    level: 'MEDIA_GENERAL',
    category: 'RENDIMIENTO',
    code: 'MED-REND-01',
    title: 'Pensamiento Crítico y Capacidad Analítica',
    text: 'Demuestra alto nivel de análisis conceptual, rigor científico en laboratorios e informes, y capacidad de argumentación estructurada.',
    active: true
  },
  {
    id: 'obs-med-2',
    level: 'MEDIA_GENERAL',
    category: 'ACTITUD',
    code: 'MED-ACT-01',
    title: 'Compromiso y Ética Académica',
    text: 'Manifiesta puntualidad, compromiso ético en sus investigaciones y actitud receptiva ante las observaciones y sugerencias docentes.',
    active: true
  },
  {
    id: 'obs-med-3',
    level: 'MEDIA_GENERAL',
    category: 'CONVIVENCIA',
    code: 'MED-CONV-01',
    title: 'Liderazgo y Convivencia Juvenil',
    text: 'Ejerce un liderazgo positivo en las actividades grupales, respeta la diversidad de criterios y promueve el diálogo pacífico.',
    active: true
  },
  {
    id: 'obs-med-4',
    level: 'MEDIA_GENERAL',
    category: 'RECOMENDACION',
    code: 'MED-REC-01',
    title: 'Organización del Estudio Independiente',
    text: 'Se exhorta a mantener una planificación sistemática de estudio semanal y profundizar en técnicas de investigación documental.',
    active: true
  }
];

export const INITIAL_SPECIALIZED_SKILLS: SpecializedSkillRecord[] = [
  // Demo record Inicial
  {
    id: 'spec-ini-01',
    studentId: 'stu-ini-1',
    studentName: 'Sofía Isabella Rincón Morales',
    level: 'INICIAL',
    grade: 'Sala de 5 Años',
    section: 'A',
    lapso: 1,
    type: 'ACTITUDINAL',
    habitosTrabajo: 'Consolidado. Mantiene su puesto de trabajo en orden.',
    convivenciaSocial: 'Excelente integración y compañerismo en el patio y salón.',
    autonomiaPersonal: 'Autonomía óptima en alimentación y vestuario.',
    scoreLiteral: 'A',
    observacionesGenerales: 'Participa activamente en asamblea y respeta turnos para hablar.',
    evaluatedBy: 'Docente Titular Inicial',
    evaluatedAt: '2026-10-15'
  },
  // Demo record Primaria
  {
    id: 'spec-pri-01',
    studentId: 'stu-pri-1',
    studentName: 'Alejandro José Martínez Gómez',
    level: 'PRIMARIA',
    grade: '3er Grado',
    section: 'A',
    lapso: 1,
    type: 'LECTOESCRITURA',
    fluidezLectora: 'Fluida y con entonación respetando pausas de puntuación',
    comprensionLectora: 'Nivel Inferencial y Crítico destacado',
    velocidadPpm: 115,
    caligrafiaOrtografia: 'Trazos uniformes y buena acentuación en palabras agudas y graves',
    scoreQualitative: 'L',
    observacionesGenerales: 'Destacada participación en el círculo de lectura institucional.',
    evaluatedBy: 'Docente Especialista Lenguaje',
    evaluatedAt: '2026-10-18'
  },
  // Demo record Media General
  {
    id: 'spec-med-01',
    studentId: 'stu-med-1',
    studentName: 'Diego Alejandro Silva Mendoza',
    level: 'MEDIA_GENERAL',
    grade: '4to Año',
    section: 'A',
    lapso: 1,
    type: 'PROYECTO_VIDA',
    proyectoVidaMetas: 'Vocación orientada a Ingeniería en Computación y Robótica. Proyecto comunitario en fase de diseño.',
    scoreNumeric: 19,
    observacionesGenerales: 'Muestra alta madurez vocacional y coherencia en sus metas a mediano plazo.',
    evaluatedBy: 'Docente Orientación y Convivencia',
    evaluatedAt: '2026-10-20'
  }
];
