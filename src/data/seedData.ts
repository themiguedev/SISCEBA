import {
  SubjectArea,
  Competency,
  Indicator,
  Strategy,
  EducationalResource,
  DiagnosticCriterion,
  PlanQuincenal,
  PlanLapso,
  Student,
  EvaluationRecord,
  AIActionPlan,
  CouncilMeetingMinute,
  RemedialActionPlan,
  PassRecord,
  DailyAttendanceRecord,
  SubjectAttendanceAccumulated,
  ConductEntry,
  DocumentRequest,
  AdministrativeBlockEntry,
  TitleRecord,
  SchoolYearConfig,
  CommunityNotice,
  BirthdayPerson,
  AppUser,
  UserSchedule,
  InstitutionalSchoolData,
  SystemCatalogs,
  AuditLogEntry,
  ScheduleTypeConfig,
  CRPTaller,
  CRPEstudianteInscrito
} from '../types';
import {
  SVG_MALE_CYAN,
  SVG_MALE_ORANGE,
  SVG_FEMALE_CIRCLE_TEAL,
  SVG_FEMALE_ORANGE
} from '../utils/avatarCatalog';

export const INITIAL_AREAS: SubjectArea[] = [
  // --- INICIAL ---
  {
    id: 'ini-fp',
    code: 'INI-FP',
    name: 'Formación personal',
    level: 'INICIAL',
    type: 'REGULAR',
    areaProfile: 'Fomenta el autoconcepto positivo, la autonomía personal, la convivencia armónica, la inteligencia emocional y los valores ciudadanos de respeto y empatía en la primera infancia.',
    teacherProfile: 'Licenciado/a en Educación Inicial con sólida formación en psicología evolutiva, pedagogía activa y destrezas para la contención socioafectiva.',
    weeklyHours: 8,
    iconName: 'Heart'
  },
  {
    id: 'ini-ca',
    code: 'INI-CA',
    name: 'Relación entre los componentes del ambiente',
    level: 'INICIAL',
    type: 'REGULAR',
    areaProfile: 'Desarrolla la curiosidad científica natural, exploración sensory-motora, nociones lógicas primarias y la valoración ecológica y del entorno comunitario.',
    teacherProfile: 'Docente de Educación Inicial con competencias en el método inductivo, experimentación infantil y educación ambiental vivencial.',
    weeklyHours: 6,
    iconName: 'Globe'
  },
  {
    id: 'ini-ap',
    code: 'INI-AP',
    name: 'Artes Plásticas',
    level: 'INICIAL',
    type: 'REGULAR',
    areaProfile: 'Estimula la motricidad fina, expresión gráfica, teoría del color intuitiva y libertad creativa mediante modelado, pintura y collage infantil.',
    teacherProfile: 'Especialista en artes visuales infantiles y pedagogía de la plástica expresiva.',
    weeklyHours: 4,
    iconName: 'Palette'
  },
  {
    id: 'ini-mus',
    code: 'INI-MUS',
    name: 'Música (Integrada)',
    level: 'INICIAL',
    type: 'INTEGRADA',
    areaProfile: 'Sensibilización rítmica, discriminación auditiva, desarrollo del oído melódico y ensamble coral inicial adaptado al Colegio Bellas Artes.',
    teacherProfile: 'Profesor/a de Educación Musical con experiencia en métodos Orff, Kodály y estimulación rítmica temprana.',
    weeklyHours: 3,
    iconName: 'Music'
  },
  {
    id: 'ini-ef',
    code: 'INI-EF',
    name: 'Educación Física (Integrada)',
    level: 'INICIAL',
    type: 'INTEGRADA',
    areaProfile: 'Psicomotricidad global, equilibrio, coordinación óculo-manual y óculo-podal, esquema corporal y hábitos de vida saludable.',
    teacherProfile: 'Licenciado/a en Educación Física especializado en psicomotricidad de la primera infancia.',
    weeklyHours: 3,
    iconName: 'Activity'
  },
  {
    id: 'ini-aje',
    code: 'INI-AJE',
    name: 'Ajedrez (Integrada)',
    level: 'INICIAL',
    type: 'INTEGRADA',
    areaProfile: 'Iniciación lúdica al pensamiento táctico, orientación espacial en tablero y toma de decisiones a través del juego de reyes.',
    teacherProfile: 'Instructor/a de Ajedrez Escolar con metodología gamificada para nivel preescolar.',
    weeklyHours: 2,
    iconName: 'Award'
  },
  {
    id: 'ini-nat',
    code: 'INI-NAT',
    name: 'Natación (Integrada)',
    level: 'INICIAL',
    type: 'INTEGRADA',
    areaProfile: 'Familiarización acuática, flotación asistida e independiente, propulsión inicial y seguridad en el medio acuático.',
    teacherProfile: 'Entrenador/a de natación infantil certificado con aval en primeros auxilios acuáticos y salvamento.',
    weeklyHours: 2,
    iconName: 'Waves'
  },
  {
    id: 'ini-ing',
    code: 'INI-ING',
    name: 'Inglés (Integrada)',
    level: 'INICIAL',
    type: 'INTEGRADA',
    areaProfile: 'Inmersión fonética bilingüe temprana, adquisición de vocabulario contextual mediante canciones, cuentos y comandos cotidianos.',
    teacherProfile: 'Docente bilingüe con certificación C1/C2 y especialización en enseñanza de lenguas extranjeras en preescolar (Early Childhood).',
    weeklyHours: 4,
    iconName: 'Languages'
  },
  {
    id: 'ini-inf',
    code: 'INI-INF',
    name: 'Informática (Integrada)',
    level: 'INICIAL',
    type: 'INTEGRADA',
    areaProfile: 'Alfabetización digital adaptada, interacción táctil y con periféricos, lógica algorítmica desenchufada y ciudadanía digital inicial.',
    teacherProfile: 'Educador/a en tecnología educativa enfocado en la interfaz infantil y pensamiento computacional temprano.',
    weeklyHours: 2,
    iconName: 'Monitor'
  },
  {
    id: 'ini-dh',
    code: 'INI-DH',
    name: 'Desarrollo Humano',
    level: 'INICIAL',
    type: 'REGULAR',
    areaProfile: 'Acompañamiento personal, formación en virtudes, resolución pacífica de conflictos y autoconciencia corporal y afectiva.',
    teacherProfile: 'Psicopedagogo/a o Docente de Aula con acreditación en formación humana y orientación familiar.',
    weeklyHours: 2,
    iconName: 'Smile'
  },

  // --- PRIMARIA ---
  {
    id: 'pri-len',
    code: 'PRI-LEN',
    name: 'Lenguaje',
    level: 'PRIMARIA',
    type: 'REGULAR',
    areaProfile: 'Desarrollo de la competencia comunicativa integral: comprensión lectora crítica, producción escrita coherente, oratoria y gusto por la literatura.',
    teacherProfile: 'Licenciado/a en Educación Integral con dominio de estrategias avanzadas de lectoescritura, gramática y animación lectora.',
    weeklyHours: 7,
    iconName: 'BookOpen'
  },
  {
    id: 'pri-mat',
    code: 'PRI-MAT',
    name: 'Matemáticas',
    level: 'PRIMARIA',
    type: 'REGULAR',
    areaProfile: 'Pensamiento numérico, algebraico elemental, geométrico, estadístico y resolución de problemas del mundo real mediante enfoque heurístico.',
    teacherProfile: 'Especialista en didáctica de las matemáticas y metodología concreta-pictórica-abstracta (CPA).',
    weeklyHours: 7,
    iconName: 'Calculator'
  },
  {
    id: 'pri-cn',
    code: 'PRI-CN',
    name: 'Ciencias Naturales',
    level: 'PRIMARIA',
    type: 'REGULAR',
    areaProfile: 'Investigación científica experimental, conocimiento del cuerpo humano, biodiversidad de la región zuliana y conciencia ecológica.',
    teacherProfile: 'Educador/a integral con dominio del laboratorio escolar y metodología STEAM.',
    weeklyHours: 4,
    iconName: 'Compass'
  },
  {
    id: 'pri-cs',
    code: 'PRI-CS',
    name: 'Ciencias Sociales',
    level: 'PRIMARIA',
    type: 'REGULAR',
    areaProfile: 'Identidad histórica regional y nacional, geografía de Venezuela y América, valores republicanos y participación ciudadana responsable.',
    teacherProfile: 'Docente con formación en historia crítica, geografía aplicada y educación cívica.',
    weeklyHours: 4,
    iconName: 'Landmark'
  },
  {
    id: 'pri-est-ap',
    code: 'PRI-EST-AP',
    name: 'Educación Estética: Artes Plásticas',
    level: 'PRIMARIA',
    type: 'REGULAR',
    areaProfile: 'Desarrollo de la sensibilidad visual, técnicas grafoplásticas, dibujo analítico, teoría del color y apreciación estética del patrimonio artístico.',
    teacherProfile: 'Especialista en Artes Plásticas y educación estética infantil.',
    weeklyHours: 2,
    iconName: 'Palette'
  },
  {
    id: 'pri-est-mus',
    code: 'PRI-EST-MUS',
    name: 'Educación Estética: Música',
    level: 'PRIMARIA',
    type: 'REGULAR',
    areaProfile: 'Expresión rítmico-melódica, iniciación instrumental, lenguaje musical básico, práctica coral y apreciación del repertorio universal y venezolano.',
    teacherProfile: 'Profesor/a de Educación Musical con dominio coral e instrumental pedagógico.',
    weeklyHours: 2,
    iconName: 'Music'
  },
  {
    id: 'pri-ef',
    code: 'PRI-EF',
    name: 'Educación Física',
    level: 'PRIMARIA',
    type: 'REGULAR',
    areaProfile: 'Aptitud física, disciplinas deportivas colectivas (baloncesto, voleibol, fútbol sala), atletismo y juego limpio.',
    teacherProfile: 'Licenciado/a en Educación Física, Deporte y Recreación con experiencia en ligas intercolegiales.',
    weeklyHours: 3,
    iconName: 'Activity'
  },
  {
    id: 'pri-aje',
    code: 'PRI-AJE',
    name: 'Ajedrez (Integrada)',
    level: 'PRIMARIA',
    type: 'INTEGRADA',
    areaProfile: 'Tácticas de apertura, medio juego, finales, cálculo de variantes y autocontrol bajo presión competitiva.',
    teacherProfile: 'Maestro/a o entrenador federado con enfoque pedagógico escolar.',
    weeklyHours: 2,
    iconName: 'Award'
  },
  {
    id: 'pri-nat',
    code: 'PRI-NAT',
    name: 'Natación (Integrada)',
    level: 'PRIMARIA',
    type: 'INTEGRADA',
    areaProfile: 'Perfeccionamiento de los 4 estilos (crol, espalda, pecho y mariposa), resistencia aeróbica y técnicas de viraje.',
    teacherProfile: 'Entrenador de natación formativa y competitiva.',
    weeklyHours: 2,
    iconName: 'Waves'
  },
  {
    id: 'pri-ing',
    code: 'PRI-ING',
    name: 'Inglés (Integrada)',
    level: 'PRIMARIA',
    type: 'INTEGRADA',
    areaProfile: 'Estructuración gramatical comunicativa, expresión oral fluida, redacción de párrafos y preparación para estándares internacionales A1-A2.',
    teacherProfile: 'Licenciado/a en Idiomas Modernos o Educación mención Inglés.',
    weeklyHours: 5,
    iconName: 'Languages'
  },
  {
    id: 'pri-fra',
    code: 'PRI-FRA',
    name: 'Francés (Integrada)',
    level: 'PRIMARIA',
    type: 'INTEGRADA',
    areaProfile: 'Iniciación al idioma francés: pronunciación, expresiones de cortesía, cultura francófona y vocabulario cotidiano.',
    teacherProfile: 'Profesor de lengua y civilización francesa nivel DELF B2/C1.',
    weeklyHours: 2,
    iconName: 'Flag'
  },
  {
    id: 'pri-inf',
    code: 'PRI-INF',
    name: 'Informática (Integrada)',
    level: 'PRIMARIA',
    type: 'INTEGRADA',
    areaProfile: 'Herramientas ofimáticas en la nube, mecanografía digital, investigación web segura y lógica de algoritmos estructurados.',
    teacherProfile: 'Ingeniero en Computación o Lic. en Educación Informática.',
    weeklyHours: 2,
    iconName: 'Monitor'
  },
  {
    id: 'pri-rob',
    code: 'PRI-ROB',
    name: 'Robótica',
    level: 'PRIMARIA',
    type: 'REGULAR',
    areaProfile: 'Construcción con sets modulares (Lego Education / Arduino), programación en bloques (Scratch / mBlock), sensórica y resolución de retos de automatización.',
    teacherProfile: 'Especialista en Robótica Educativa y metodologías STEAM con experiencia en ferias científicas.',
    weeklyHours: 2,
    iconName: 'Cpu'
  },
  {
    id: 'pri-fin',
    code: 'PRI-FIN',
    name: 'Finanzas',
    level: 'PRIMARIA',
    type: 'REGULAR',
    areaProfile: 'Conceptos de ahorro inteligente, presupuesto personal, distinción entre necesidades y deseos, emprendimiento escolar y valor del trabajo.',
    teacherProfile: 'Economista o Educador con especialización en finanzas personales infantiles.',
    weeklyHours: 2,
    iconName: 'DollarSign'
  },
  {
    id: 'pri-dc',
    code: 'PRI-DC',
    name: 'Diseño Creativo (Integrada)',
    level: 'PRIMARIA',
    type: 'INTEGRADA',
    areaProfile: 'Design Thinking adaptado a niños, prototipado rápido, modelado tridimensional analógico y digital, e innovación visual.',
    teacherProfile: 'Diseñador/a Gráfico o Industrial con vocación docente pedagógica.',
    weeklyHours: 2,
    iconName: 'Sparkles'
  },

  // --- MEDIA GENERAL ---
  {
    id: 'med-cas',
    code: 'MED-CAS',
    name: 'Castellano',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    areaProfile: 'Análisis textual y literario profundo, producción de ensayos argumentativos, semiótica, retórica y dominio lingüístico superior.',
    teacherProfile: 'Licenciado/a en Letras o Educación mención Castellano y Literatura.',
    weeklyHours: 5,
    iconName: 'BookOpen'
  },
  {
    id: 'med-ing',
    code: 'MED-ING',
    name: 'Inglés',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    areaProfile: 'Competencia lingüística nivel B1-B2 del Marco Común Europeo: debate formal, comprensión auditiva de conferencias y redacción académica.',
    teacherProfile: 'Licenciado en Idiomas Modernos con acreditación internacional TOEFL/IELTS/CPE.',
    weeklyHours: 4,
    iconName: 'Languages'
  },
  {
    id: 'med-mat',
    code: 'MED-MAT',
    name: 'Matemáticas',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    areaProfile: 'Álgebra abstracta, trigonometría, geometría analítica, cálculo diferencial preparatorio, matrices y estadística inferencial.',
    teacherProfile: 'Licenciado en Matemáticas o Educación mención Matemática Pura y Aplicada.',
    weeklyHours: 5,
    iconName: 'Calculator'
  },
  {
    id: 'med-ef',
    code: 'MED-EF',
    name: 'Educación Física',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    areaProfile: 'Condicionamiento físico específico, táctica y reglamentación deportiva avanzada, hábitos de nutrición deportiva y liderazgo de equipos.',
    teacherProfile: 'Profesor de Educación Física de Secundaria y entrenador deportivo.',
    weeklyHours: 3,
    iconName: 'Activity'
  },
  {
    id: 'med-ap',
    code: 'MED-AP',
    name: 'Arte y Patrimonio',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    areaProfile: 'Historia universal y venezolana de las artes, corrientes vanguardistas, conservación del patrimonio cultural y museografía.',
    teacherProfile: 'Historiador/a del Arte o Licenciado en Artes Visuales con enfoque pedagógico.',
    weeklyHours: 3,
    iconName: 'Landmark'
  },
  {
    id: 'med-cn',
    code: 'MED-CN',
    name: 'Ciencias Naturales',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    areaProfile: 'Bases científicas integradas de la materia, energía, ecosistemas y procesos biofísicos para primeros años de educación media.',
    teacherProfile: 'Licenciado en Ciencias con experiencia en docencia media básica.',
    weeklyHours: 4,
    iconName: 'Compass'
  },
  {
    id: 'med-bio',
    code: 'MED-BIO',
    name: 'Ciencias Biológicas',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    areaProfile: 'Genética molecular, citología, fisiología humana, biotecnología moderna y bioética en la investigación científica.',
    teacherProfile: 'Biólogo o Lic. en Educación mención Biología con dominio de laboratorio microbiológico.',
    weeklyHours: 4,
    iconName: 'Dna'
  },
  {
    id: 'med-fis',
    code: 'MED-FIS',
    name: 'Física',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    areaProfile: 'Mecánica clásica newtoniana, cinemática, termodinámica, electromagnetismo y óptica con demostraciones empíricas y modelado matemático.',
    teacherProfile: 'Físico o Lic. en Educación mención Física con habilidades de experimentación cuantitativa.',
    weeklyHours: 4,
    iconName: 'Zap'
  },
  {
    id: 'med-qui',
    code: 'MED-QUI',
    name: 'Química',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    areaProfile: 'Estequiometría, enlace químico, cinética, equilibrio químico, química orgánica e instrumental en laboratorio seguro.',
    teacherProfile: 'Químico o Lic. en Educación mención Química con certificación de seguridad en laboratorio químico.',
    weeklyHours: 4,
    iconName: 'FlaskConical'
  },
  {
    id: 'med-ct',
    code: 'MED-CT',
    name: 'Ciencias de la Tierra',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    areaProfile: 'Geología, dinámica litosférica, climatología, recursos hidrológicos y energéticos de Venezuela y cambio climático global.',
    teacherProfile: 'Geólogo o Educador con especialización en ciencias de la tierra y geomorfología.',
    weeklyHours: 3,
    iconName: 'Globe'
  },
  {
    id: 'med-ghc',
    code: 'MED-GHC',
    name: 'Geografía, Historia y Ciudadanía',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    areaProfile: 'Procesos geopolíticos contemporáneos, evolución constitucional, pensamiento bolivariano e historia republicana de Venezuela.',
    teacherProfile: 'Licenciado en Historia o Geografía con alta capacidad crítica y pedagógica.',
    weeklyHours: 4,
    iconName: 'MapPin'
  },
  {
    id: 'med-fsn',
    code: 'MED-FSN',
    name: 'Formación para la Soberanía Nacional',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    areaProfile: 'Seguridad de la nación, fronteras, defensa civil, ordenamiento jurídico institucional y soberanía territorial integral.',
    teacherProfile: 'Especialista en derecho constitucional, soberanía y seguridad integral con perfil docente.',
    weeklyHours: 2,
    iconName: 'Shield'
  },
  {
    id: 'med-oc',
    code: 'MED-OC',
    name: 'Orientación y Convivencia',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    areaProfile: 'Desarrollo socioafectivo del adolescente, proyecto vocacional, prevención integral y clima de convivencia pacífica.',
    teacherProfile: 'Orientador Educativo, Psicólogo o Docente Guía con formación en tutoría integral.',
    weeklyHours: 2,
    iconName: 'Users'
  },
  {
    id: 'med-crp',
    code: 'MED-CRP',
    name: 'Grupos de Creación, Recreación y Producción',
    level: 'MEDIA_GENERAL',
    type: 'REGULAR',
    areaProfile: 'Talleres prácticos vocacionales en áreas técnicas, artísticas y de servicio comunitario para el desarrollo de talentos singulares.',
    teacherProfile: 'Facilitador con experticia práctica en el taller o proyecto productivo seleccionado.',
    weeklyHours: 2,
    iconName: 'Layers'
  },
  // Media General Integradas y Especializadas:
  {
    id: 'med-ag',
    code: 'MED-AG',
    name: 'Artes Gráficas (Integrada)',
    level: 'MEDIA_GENERAL',
    type: 'INTEGRADA',
    areaProfile: 'Identidad visual, tipografía, composición digital, software vectorial y rasterizado (Illustrator/Photoshop) y diseño editorial.',
    teacherProfile: 'Licenciado en Artes Gráficas o Diseño de Comunicación Visual con experiencia en producción gráfica.',
    weeklyHours: 3,
    iconName: 'Image'
  },
  {
    id: 'med-inf',
    code: 'MED-INF',
    name: 'Informática (Integrada)',
    level: 'MEDIA_GENERAL',
    type: 'INTEGRADA',
    areaProfile: 'Fundamentos de desarrollo web (HTML/CSS/JS), bases de datos relacionales, estructuras de datos y ciberseguridad práctica.',
    teacherProfile: 'Ingeniero de Sistemas o Desarrollador de Software con vocación docente.',
    weeklyHours: 3,
    iconName: 'Code'
  },
  {
    id: 'med-apl',
    code: 'MED-APL',
    name: 'Artes Plásticas (Integrada)',
    level: 'MEDIA_GENERAL',
    type: 'INTEGRADA',
    areaProfile: 'Técnicas al óleo, acuarela contemporánea, escultura tridimensional, crítica plástica y curaduría de obras escolares.',
    teacherProfile: 'Artista Plástico consagrado o Lic. en Artes con portafolio de exhibición internacional.',
    weeklyHours: 3,
    iconName: 'Palette'
  },
  {
    id: 'med-rob',
    code: 'MED-ROB',
    name: 'Robótica (Integrada)',
    level: 'MEDIA_GENERAL',
    type: 'INTEGRADA',
    areaProfile: 'Microcontroladores (ESP32/Arduino), sistemas ciberfísicos, internet de las cosas (IoT), cinemática de brazos robóticos y C++ embebido.',
    teacherProfile: 'Ingeniero Mecatrónico o Electrónico con experiencia en torneos de robótica First Lego / VEX.',
    weeklyHours: 3,
    iconName: 'Cpu'
  },
  {
    id: 'med-fin',
    code: 'MED-FIN',
    name: 'Finanzas (Integrada)',
    level: 'MEDIA_GENERAL',
    type: 'INTEGRADA',
    areaProfile: 'Modelos de negocio Canvas, análisis financiero, inversiones, criptoeconomía responsable, planes de mercadeo y pitch comercial.',
    teacherProfile: 'Especialista en Finanzas, MBA o Emprendedor con metodologías ágiles de incubación escolar.',
    weeklyHours: 3,
    iconName: 'TrendingUp'
  },
  {
    id: 'med-pv',
    code: 'MED-PV',
    name: 'Proyecto de Vida (Integrada)',
    level: 'MEDIA_GENERAL',
    type: 'INTEGRADA',
    areaProfile: 'Diseño estratégico personal, plan de carrera universitaria, inteligencia interpersonal, resiliencia y liderazgo con propósito ético.',
    teacherProfile: 'Coach vocacional certificado o Psicólogo especializado en juventud y toma de decisiones.',
    weeklyHours: 2,
    iconName: 'Navigation'
  },
  {
    id: 'med-ac',
    code: 'MED-AC',
    name: 'Arte y Ciudad (Integrada)',
    level: 'MEDIA_GENERAL',
    type: 'INTEGRADA',
    areaProfile: 'Intervención urbana artística, arquitectura de Maracaibo, sociología del espacio público y muralismo comunitario del Colegio Bellas Artes.',
    teacherProfile: 'Arquitecto o Urbanista con enfoque en patrimonio artístico y diseño de espacios colectivos.',
    weeklyHours: 2,
    iconName: 'Building'
  },
  {
    id: 'med-cl',
    code: 'MED-CL',
    name: 'Creación Literaria (Integrada)',
    level: 'MEDIA_GENERAL',
    type: 'INTEGRADA',
    areaProfile: 'Taller de narrativa, poesía, dramaturgia, técnicas de guión audiovisual y publicación de antologías literarias institucionales.',
    teacherProfile: 'Escritor o Filólogo con obra publicada y experiencia en talleres de escritura creativa.',
    weeklyHours: 2,
    iconName: 'Feather'
  },
  {
    id: 'med-lec',
    code: 'MED-LEC',
    name: 'Lectoescritura (Integrada)',
    level: 'MEDIA_GENERAL',
    type: 'INTEGRADA',
    areaProfile: 'Detección de falacias lógicas, lectura de fuentes científicas primarias, síntesis conceptual y redacción de monografías.',
    teacherProfile: 'Profesor de Filosofía o Lingüística Aplicada con énfasis en pensamiento crítico.',
    weeklyHours: 2,
    iconName: 'CheckCircle'
  },
  {
    id: 'med-iga',
    code: 'MED-IGA',
    name: 'Inglés Avanzado (Integrada)',
    level: 'MEDIA_GENERAL',
    type: 'INTEGRADA',
    areaProfile: 'Nivel C1 operativo: oratoria pública en inglés (Model UN debate), literatura anglófona y preparación de certificaciones universitarias.',
    teacherProfile: 'Profesor de origen angloparlante o acreditado Cambridge DELTA/CELTA.',
    weeklyHours: 3,
    iconName: 'Sparkles'
  }
];

export const INITIAL_COMPETENCIES: Competency[] = [
  // Inicial
  {
    id: 'comp-ini-1',
    areaId: 'ini-fp',
    code: 'CP-INI-01',
    title: 'Autonomía y Convivencia',
    description: 'Expresa sus emociones básicas de manera asertiva, interactúa con sus pares respetando turnos y manifiesta seguridad en sus rutinas cotidianas.',
    level: 'INICIAL',
    lapso: 1
  },
  {
    id: 'comp-ini-2',
    areaId: 'ini-ap',
    code: 'CP-INI-02',
    title: 'Expresión Plástica y Creativa',
    description: 'Experimenta con diversas técnicas grafoplásticas utilizando materiales variados para comunicar su percepción del entorno.',
    level: 'INICIAL',
    lapso: 1
  },
  {
    id: 'comp-ini-ca-1',
    areaId: 'ini-ca',
    code: 'CP-INI-CA-01',
    title: 'Identificación y Clasificación de Colores',
    description: 'Identifica colores primarios y secundarios, y agrupa objetos del entorno según su propiedad cromática.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  {
    id: 'comp-ini-ca-2',
    areaId: 'ini-ca',
    code: 'CP-INI-CA-02',
    title: 'Identificación y Discriminación de Formas',
    description: 'Agrupa objetos por su forma, completa figuras sencillas y discrimina y nombra triángulo, círculo y cuadrado.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  {
    id: 'comp-ini-ca-3',
    areaId: 'ini-ca',
    code: 'CP-INI-CA-03',
    title: 'Identificación y Relaciones de Tamaño',
    description: 'Compara y clasifica objetos según su tamaño, realiza correspondencias y reconoce relaciones de magnitud (más grande que, más pequeño que).',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  {
    id: 'comp-ini-ca-4',
    areaId: 'ini-ca',
    code: 'CP-INI-CA-04',
    title: 'Reconocimiento de Nociones Temporo-Espaciales',
    description: 'Vincula la noción de tiempo con las experiencias, rutinas y actividades que realiza diariamente (antes - después).',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  // Relación entre los Componentes del Ambiente - 5 Años
  {
    id: 'comp-ini-ca5-1',
    areaId: 'ini-ca',
    code: 'CP-INI-CA5-01',
    title: 'Identificación y Relaciones Geométricas',
    description: 'Agrupa por formas, asocia la forma de los objetos con las figuras geométricas y establece semejanzas y diferencias.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  {
    id: 'comp-ini-ca5-2',
    areaId: 'ini-ca',
    code: 'CP-INI-CA5-02',
    title: 'Magnitudes, Dimensiones y Tamaños',
    description: 'Agrupa objetos por tamaño, realiza correspondencias, nombra el tamaño y discrimina dimensiones complejas (grande, mediano, pequeño, alto - bajo, largo - corto).',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  {
    id: 'comp-ini-ca5-3',
    areaId: 'ini-ca',
    code: 'CP-INI-CA5-03',
    title: 'Discriminación y Correspondencia Cromática',
    description: 'Agrupa objetos por color, realiza correspondencia por color y discrimina colores primarios y secundarios.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  {
    id: 'comp-ini-ca5-4',
    areaId: 'ini-ca',
    code: 'CP-INI-CA5-04',
    title: 'Esquema Corporal y Ubicación Espacial',
    description: 'Ubica objetos según su posición en el espacio y establece relación entre su cuerpo y los objetos.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  // Artes Plásticas - Sala de 4 Años (4 Competencias)
  {
    id: 'comp-ini-ap4-1',
    areaId: 'ini-ap',
    code: 'CP-INI-AP4-01',
    title: 'Técnicas de Modelado y Rasgado Grafoplástico',
    description: 'Modela y transforma materiales maleables y experimenta el rasgado de papel libre y en línea recta para afianzar el tono muscular y la fuerza digital.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  {
    id: 'comp-ini-ap4-2',
    areaId: 'ini-ap',
    code: 'CP-INI-AP4-02',
    title: 'Coordinación Visomotriz, Ensartado y Encastre',
    description: 'Desarrolla coordinación visomotriz mediante el ensartado, encastre de formas grandes y armado de estructuras y figuras con piezas grandes.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  {
    id: 'comp-ini-ap4-3',
    areaId: 'ini-ap',
    code: 'CP-INI-AP4-03',
    title: 'Expresión Gráfica, Coloreado y Control del Útil',
    description: 'Utiliza instrumentos gráficos con adecuado control muscular respetando contornos en figuras grandes y traza monigotes y formas pre-esquemáticas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  {
    id: 'comp-ini-ap4-4',
    areaId: 'ini-ap',
    code: 'CP-INI-AP4-04',
    title: 'Autonomía Funcional y Presión Manual',
    description: 'Demuestra destreza manual y autonomía en la apertura, cierre y destapado de objetos de uso cotidiano en el aula.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  // Artes Plásticas - Sala de 5 Años (4 Competencias)
  {
    id: 'comp-ini-ap5-1',
    areaId: 'ini-ap',
    code: 'CP-INI-AP5-01',
    title: 'Modelado y Construcción Tridimensional',
    description: 'Modela, aplana y compone figuras tridimensionales sencillas utilizando masas y elementos maleables con mayor destreza y creatividad.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  {
    id: 'comp-ini-ap5-2',
    areaId: 'ini-ap',
    code: 'CP-INI-AP5-02',
    title: 'Técnicas de Rasgado y Recorte Instrumental',
    description: 'Aplica técnicas de rasgado y corte con tijeras de forma libre y orientada en líneas rectas, afianzando la disociación digital y el control óculo-manual.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  {
    id: 'comp-ini-ap5-3',
    areaId: 'ini-ap',
    code: 'CP-INI-AP5-03',
    title: 'Coordinación Visomotriz, Ensartado Fino y Encastre',
    description: 'Demuestra precisión visomotriz en el ensartado fino, encastre de piezas reducidas y ensamblaje de estructuras multinivel.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  {
    id: 'comp-ini-ap5-4',
    areaId: 'ini-ap',
    code: 'CP-INI-AP5-04',
    title: 'Expresión Gráfica, Coloreado de Precisión y Dibujo Figurativo',
    description: 'Domina el control del límite espacial en figuras grandes y pequeñas y traza composiciones gráficas figurativas cada vez más definidas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  // Educación Física - Sala de 4 Años (2 Competencias)
  {
    id: 'comp-ini-ef4-1',
    areaId: 'ini-ef',
    code: 'CP-INI-EF4-01',
    title: 'Esquema Corporal y Equilibrio Dinámico',
    description: 'Reconoce los segmentos de su cuerpo a la voz de mando y mantiene el equilibrio postural sobre líneas rectas con variaciones de ritmo.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  {
    id: 'comp-ini-ef4-2',
    areaId: 'ini-ef',
    code: 'CP-INI-EF4-02',
    title: 'Velocidad de Reacción y Saltabilidad en Circuitos',
    description: 'Ejecuta desplazamientos ágiles en zigzag y circuitos de saltos superando obstáculos con apoyo bipodal y unipodal.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  // Educación Física - Sala de 5 Años (2 Competencias)
  {
    id: 'comp-ini-ef5-1',
    areaId: 'ini-ef',
    code: 'CP-INI-EF5-01',
    title: 'Resistencia Aeróbica y Lateralidad Espacial',
    description: 'Dosifica su esfuerzo físico en intervalos continuos y ejecuta desplazamientos orientando su cuerpo hacia la izquierda y derecha.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  {
    id: 'comp-ini-ef5-2',
    areaId: 'ini-ef',
    code: 'CP-INI-EF5-02',
    title: 'Circuitos Motrices Integrados y Coordinación Óculo-Manual',
    description: 'Supera circuitos de estaciones combinadas y manipula pelotas de diferentes tamaños en reposo y desplazamiento.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  // Natación - Sala de 4 Años (2 Competencias)
  {
    id: 'comp-ini-nat4-1',
    areaId: 'ini-nat',
    code: 'CP-INI-NAT4-01',
    title: 'Familiarización y Respiración Acuática Elemental',
    description: 'Adquiere seguridad y confianza en el medio acuático, ejecutando patadas desde el borde e inmersión buconasal con expulsión de burbujas bajo el agua.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  {
    id: 'comp-ini-nat4-2',
    areaId: 'ini-nat',
    code: 'CP-INI-NAT4-02',
    title: 'Propulsión Asistida y Flotación Dorsal Inicial',
    description: 'Se desplaza en el agua mediante patada de estilo libre sujetando la tabla con apoyo docente y experimenta la flotación dorsal relajada.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  // Natación - Sala de 5 Años (2 Competencias)
  {
    id: 'comp-ini-nat5-1',
    areaId: 'ini-nat',
    code: 'CP-INI-NAT5-01',
    title: 'Propulsión Hidrodinámica y Nado de Flecha',
    description: 'Coordina la respiración continua con la patada propulsiva y adopta la posición hidrodinámica de flecha con cabeza sumergida hacia un objetivo.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  {
    id: 'comp-ini-nat5-2',
    areaId: 'ini-nat',
    code: 'CP-INI-NAT5-02',
    title: 'Flotación Dorsal Autónoma y Brazada de Estilo Libre',
    description: 'Domina la flotación en decúbito dorsal sin implementos y ejecuta la tracción de brazos en estilo libre con tabla conservando la horizontalidad.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  // Ajedrez - Sala de 4 Años (2 Competencias)
  {
    id: 'comp-ini-aje4-1',
    areaId: 'ini-aje',
    code: 'CP-INI-AJE4-01',
    title: 'Identificación de Piezas y Geometría del Tablero',
    description: 'Reconoce y nombra las piezas fundamentales del ajedrez al ser presentadas e identifica los elementos estructurales y geométricos básicos del tablero (filas, columnas y diagonales).',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  {
    id: 'comp-ini-aje4-2',
    areaId: 'ini-aje',
    code: 'CP-INI-AJE4-02',
    title: 'Movimiento y Desplazamiento Geométrico de Torre y Alfil',
    description: 'Comprende y reproduce los desplazamientos ortogonales rectos de la torre y las trayectorias diagonales continuas del alfil respetando las normas del tablero.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  // Ajedrez - Sala de 5 Años (2 Competencias)
  {
    id: 'comp-ini-aje5-1',
    areaId: 'ini-aje',
    code: 'CP-INI-AJE5-01',
    title: 'Valor Absoluto de Piezas y Coordenadas del Tablero',
    description: 'Asigna el valor cuantitativo de cada pieza tomando como patrón de medida al peón y localiza casillas específicas utilizando el sistema alfanumérico de coordenadas (letras y números).',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  {
    id: 'comp-ini-aje5-2',
    areaId: 'ini-aje',
    code: 'CP-INI-AJE5-02',
    title: 'Táctica Elemental: Piezas Defendidas, Indefensas y Capturas',
    description: 'Analiza posiciones simples en el tablero para determinar si una pieza cuenta con protección o está vulnerable y ejecuta decisiones tácticas de captura o defensa.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  // Informática - Sala de 4 Años (2 Competencias)
  {
    id: 'comp-ini-inf4-1',
    areaId: 'ini-inf',
    code: 'CP-INI-INF4-01',
    title: 'Exploración de Hardware y Manejo de Periféricos',
    description: 'Reconoce los componentes físicos del computador (monitor, teclado, mouse, CPU) e interactúa con periféricos y pantallas táctiles ejecutando clics simples y arrastre con autonomía inicial.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  {
    id: 'comp-ini-inf4-2',
    areaId: 'ini-inf',
    code: 'CP-INI-INF4-02',
    title: 'Navegación Lúdica, Creación Gráfica y Actitud Digital',
    description: 'Navega menús sencillos en juegos educativos con orientación docente, experimenta con herramientas de trazo gráfico digital y manifiesta curiosidad y atención en actividades tecnológicas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  // Informática - Sala de 5 Años (2 Competencias)
  {
    id: 'comp-ini-inf5-1',
    areaId: 'ini-inf',
    code: 'CP-INI-INF5-01',
    title: 'Funcionalidad de Hardware, Coordinación Motriz y Navegación Autónoma',
    description: 'Explica la utilidad y función de los componentes del computador y pantallas táctiles, ejecuta clics dobles y arrastre con precisión visomotora y navega de forma independiente en entornos digitales.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  {
    id: 'comp-ini-inf5-2',
    areaId: 'ini-inf',
    code: 'CP-INI-INF5-02',
    title: 'Diseño Digital en Paint, Reconocimiento de Íconos e Iniciativa Creativa',
    description: 'Reconoce y aplica las herramientas e íconos del programa Paint para crear ilustraciones digitales y representaciones creativas demostrando curiosidad e iniciativa propia.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  // Inglés - Sala de 4 Años (2 Competencias)
  {
    id: 'comp-ini-ing4-1',
    areaId: 'ini-ing',
    code: 'CP-INI-ING4-01',
    title: 'Comprensión y Pronunciación de Colores en Lengua Extranjera',
    description: 'Desarrolla la comprensión auditiva y la expresión oral en inglés reconociendo, señalando y pronunciando correctamente los colores básicos en objetos de su entorno escolar.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  {
    id: 'comp-ini-ing4-2',
    areaId: 'ini-ing',
    code: 'CP-INI-ING4-02',
    title: 'Reconocimiento y Expresión del Núcleo Familiar en Inglés',
    description: 'Identifica y nombra en inglés a los miembros del núcleo familiar básico (mother, father, sister, baby) a través de canciones, láminas y dinámicas interactivas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  // Inglés - Sala de 5 Años (2 Competencias)
  {
    id: 'comp-ini-ing5-1',
    areaId: 'ini-ing',
    code: 'CP-INI-ING5-01',
    title: 'Comprensión Auditiva y Fonética de la Familia Extendida',
    description: 'Reconoce, pronuncia con adecuada fonética y señala con rapidez a los miembros de la familia extendida (mother, father, grandfather, uncle, aunt) al ser nombrados por la docente.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  {
    id: 'comp-ini-ing5-2',
    areaId: 'ini-ing',
    code: 'CP-INI-ING5-02',
    title: 'Identificación y Denominación de las Partes del Rostro en Inglés',
    description: 'Discrimina auditivamente y nombra con precisión las partes de su rostro en inglés asociando la señalización física inmediata (TPR) con la pronunciación fonética clara.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años'
  },
  // Primaria - 1er Grado (13 Competencias Oficiales)
  // Lenguaje - 1er Grado (3 Competencias)
  {
    id: 'comp-pri-len1-1',
    areaId: 'pri-len',
    code: 'CP-PRI-LEN1-01',
    title: 'Intercambios Orales y Escucha Activa',
    description: 'Participa en intercambios orales con sus compañeros y adultos, respetando turnos y escuchando activamente.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado'
  },
  {
    id: 'comp-pri-len1-2',
    areaId: 'pri-len',
    code: 'CP-PRI-LEN1-02',
    title: 'Convenciones y Normas de la Lengua Escrita y Uso del Cuaderno',
    description: 'Se inicia en el reconocimiento y uso de algunos elementos normativos y convencionales básicos de la lengua oral y escrita.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado'
  },
  {
    id: 'comp-pri-len1-3',
    areaId: 'pri-len',
    code: 'CP-PRI-LEN1-03',
    title: 'Expresión Creativa e Imaginativa del Lenguaje',
    description: 'Manifiesta sus potencialidades creativas a través de la formación imaginativa del lenguaje.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado'
  },
  // Matemática - 1er Grado (4 Competencias)
  {
    id: 'comp-pri-mat1-1',
    areaId: 'pri-mat',
    code: 'CP-PRI-MAT1-01',
    title: 'Pensamiento Lógico, Clasificación, Seriación y Relaciones Numéricas',
    description: 'Desarrolla el pensamiento lógico matemático a través de la adquisición de los procesos de clasificación, seriación y las nociones de conservación de cantidad y número.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado'
  },
  {
    id: 'comp-pri-mat1-2',
    areaId: 'pri-mat',
    code: 'CP-PRI-MAT1-02',
    title: 'Numeración Natural, Conteo y Valor Posicional',
    description: 'Cuenta, lee y escribe números naturales hasta de tres cifras e interpreta valor absoluto y posicional de cada cifra.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado'
  },
  {
    id: 'comp-pri-mat1-3',
    areaId: 'pri-mat',
    code: 'CP-PRI-MAT1-03',
    title: 'Reconocimiento y Trazado de Figuras Geométricas Planas',
    description: 'Reconoce y nombra las figuras geométricas planas básicas.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado'
  },
  {
    id: 'comp-pri-mat1-4',
    areaId: 'pri-mat',
    code: 'CP-PRI-MAT1-04',
    title: 'Orientación y Relaciones Espaciales',
    description: 'Indica las posiciones espaciales de los objetos.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado'
  },
  // Ciencias Naturales - 1er Grado (2 Competencias)
  {
    id: 'comp-pri-cn1-1',
    areaId: 'pri-cn',
    code: 'CP-PRI-CN1-01',
    title: 'Diversidad de Seres Vivos, Hábitats y Cuidado Ambiental',
    description: 'Conoce la diversidad de seres vivos, su ambiente y la importancia que tiene en la vida cotidiana.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado'
  },
  {
    id: 'comp-pri-cn1-2',
    areaId: 'pri-cn',
    code: 'CP-PRI-CN1-02',
    title: 'Nutrición, Clasificación de Alimentos y Hábitos Higiénicos',
    description: 'Determina la variedad y calidad de los alimentos que contribuyen al mejoramiento y conservación de la salud familiar.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado'
  },
  // Ciencias Sociales - 1er Grado (4 Competencias)
  {
    id: 'comp-pri-cs1-1',
    areaId: 'pri-cs',
    code: 'CP-PRI-CS1-01',
    title: 'Convivencia Escolar y Organización Comunitaria',
    description: 'Aplica normas de convivencia social y organización en la escuela y el hogar.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado'
  },
  {
    id: 'comp-pri-cs1-2',
    areaId: 'pri-cs',
    code: 'CP-PRI-CS1-02',
    title: 'Nociones de Tiempo y Continuidad Histórica Personal',
    description: 'Se inicia en las nociones de tiempo y continuidad.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado'
  },
  {
    id: 'comp-pri-cs1-3',
    areaId: 'pri-cs',
    code: 'CP-PRI-CS1-03',
    title: 'Valores Ciudadanos, Normas de Aula y Autoestima',
    description: 'Demuestra actitudes de respeto, solidaridad y responsabilidad en su entorno escolar.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado'
  },
  {
    id: 'comp-pri-cs1-4',
    areaId: 'pri-cs',
    code: 'CP-PRI-CS1-04',
    title: 'Familia, Convivencia y Formación en Valores',
    description: 'Conoce la familia como espacio principal de vínculo social donde se nace y crece en valores.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado'
  },
  // Primaria (Otras Competencias Generales / Grados Superiores)
  {
    id: 'comp-pri-1',
    areaId: 'pri-len',
    code: 'CP-PRI-01',
    title: 'Producción de Textos Narrativos e Informativos',
    description: 'Redacta composiciones escritas coherentes aplicando normas ortográficas, signos de puntuación y vocabulario enriquecido.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '3er Grado'
  },
  {
    id: 'comp-pri-2',
    areaId: 'pri-mat',
    code: 'CP-PRI-02',
    title: 'Resolución de Problemas con Números Naturales y Fracciones',
    description: 'Aplica algoritmos de cálculo mental y escrito en situaciones problemáticas contextualizadas con fracciones y números decimales.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '3er Grado'
  },
  {
    id: 'comp-pri-3',
    areaId: 'pri-rob',
    code: 'CP-PRI-03',
    title: 'Mecanismos y Programación por Bloques',
    description: 'Diseña y programa prototipos móviles utilizando engranajes simples, sensores de proximidad y bucles de control en Scratch.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '3er Grado'
  },
  {
    id: 'comp-pri-4',
    areaId: 'pri-cn',
    code: 'CP-PRI-04',
    title: 'Indagación Científica y Biodiversidad Regional',
    description: 'Explora procesos biológicos y ecológicos de la región zuliana mediante el método científico experimental.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '3er Grado'
  },
  {
    id: 'comp-pri-5',
    areaId: 'pri-cs',
    code: 'CP-PRI-05',
    title: 'Identidad Histórica y Participación Ciudadana',
    description: 'Analiza hechos históricos de Venezuela, valores cívicos republicanos y la evolución social y cultural de la comunidad.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '3er Grado'
  },
  // Media General
  {
    id: 'comp-med-1',
    areaId: 'med-mat',
    code: 'CP-MED-01',
    title: 'Modelado Cuadrático y Funciones Reales',
    description: 'Modela analítica y gráficamente fenómenos físicos y económicos mediante ecuaciones de segundo grado, funciones reales y sistemas lineales.',
    level: 'MEDIA_GENERAL',
    lapso: 1
  },
  {
    id: 'comp-med-2',
    areaId: 'med-qui',
    code: 'CP-MED-02',
    title: 'Estequiometría y Reacciones Químicas',
    description: 'Calcula relaciones cuantitativas de masa, moles y volumen en reacciones químicas considerando rendimiento y reactivo limitante.',
    level: 'MEDIA_GENERAL',
    lapso: 1
  },
  {
    id: 'comp-med-3',
    areaId: 'med-rob',
    code: 'CP-MED-03',
    title: 'Sistemas Autónomos Embebidos e IoT',
    description: 'Desarrolla sistemas automatizados interactivos integrando sensores analógicos/digitales, controladores ESP32 y protocolos de telemetría.',
    level: 'MEDIA_GENERAL',
    lapso: 1
  },
  {
    id: 'comp-med-4',
    areaId: 'med-fin',
    code: 'CP-MED-04',
    title: 'Evaluación de Factibilidad Financiera de Proyectos',
    description: 'Estructura presupuestos de capital, flujos de caja proyectados y ratios de rentabilidad para emprendimientos sustentables.',
    level: 'MEDIA_GENERAL',
    lapso: 1
  }
];

export const INITIAL_INDICATORS: Indicator[] = [
  // Inicial
  {
    id: 'ind-ini-101',
    competencyId: 'comp-ini-1',
    areaId: 'ini-fp',
    code: 'IND-INI-1.1',
    description: 'Comparte voluntariamente materiales y espacios de trabajo con sus compañeros de sala sin requerir intervención del docente.',
    level: 'INICIAL',
    lapso: 1,
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-102',
    competencyId: 'comp-ini-1',
    areaId: 'ini-fp',
    code: 'IND-INI-1.2',
    description: 'Reconoce y nombra emociones como alegría, tristeza, enojo o sorpresa en sí mismo y en los demás.',
    level: 'INICIAL',
    lapso: 1,
    evaluationInstrument: 'Registro Anecdótico'
  },
  {
    id: 'ind-ini-201',
    competencyId: 'comp-ini-2',
    areaId: 'ini-ap',
    code: 'IND-INI-2.1',
    description: 'Utiliza adecuadamente el pincel y herramientas de modelado demostrando control de pinza trípode.',
    level: 'INICIAL',
    lapso: 1,
    evaluationInstrument: 'Observación Directa'
  },
  // Relación entre los Componentes del Ambiente - 4 Años A
  {
    id: 'ind-ini-ca-101',
    competencyId: 'comp-ini-ca-1',
    areaId: 'ini-ca',
    code: 'IND-INI-CA-1.1',
    description: 'Identifica los colores primarios.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ca-102',
    competencyId: 'comp-ini-ca-1',
    areaId: 'ini-ca',
    code: 'IND-INI-CA-1.2',
    description: 'Identifica ciertos colores secundarios.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ca-103',
    competencyId: 'comp-ini-ca-1',
    areaId: 'ini-ca',
    code: 'IND-INI-CA-1.3',
    description: 'Agrupa objetos por color.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ca-201',
    competencyId: 'comp-ini-ca-2',
    areaId: 'ini-ca',
    code: 'IND-INI-CA-2.1',
    description: 'Agrupa por formas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ca-202',
    competencyId: 'comp-ini-ca-2',
    areaId: 'ini-ca',
    code: 'IND-INI-CA-2.2',
    description: 'Completa formas sencillas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ca-203',
    competencyId: 'comp-ini-ca-2',
    areaId: 'ini-ca',
    code: 'IND-INI-CA-2.3',
    description: 'Discrimina y nombra triángulo, círculo, cuadrado.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ca-301',
    competencyId: 'comp-ini-ca-3',
    areaId: 'ini-ca',
    code: 'IND-INI-CA-3.1',
    description: 'Agrupa objetos por tamaño.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ca-302',
    competencyId: 'comp-ini-ca-3',
    areaId: 'ini-ca',
    code: 'IND-INI-CA-3.2',
    description: 'Discrimina el tamaño de los objetos (grande, mediano, pequeño).',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ca-303',
    competencyId: 'comp-ini-ca-3',
    areaId: 'ini-ca',
    code: 'IND-INI-CA-3.3',
    description: 'Realiza correspondencias por el tamaño de los objetos.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ca-304',
    competencyId: 'comp-ini-ca-3',
    areaId: 'ini-ca',
    code: 'IND-INI-CA-3.4',
    description: 'Nombra el tamaño de los objetos.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ca-305',
    competencyId: 'comp-ini-ca-3',
    areaId: 'ini-ca',
    code: 'IND-INI-CA-3.5',
    description: 'Reconoce la relación "más grande que".',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ca-306',
    competencyId: 'comp-ini-ca-3',
    areaId: 'ini-ca',
    code: 'IND-INI-CA-3.6',
    description: 'Reconoce la relación "más pequeño que".',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ca-401',
    competencyId: 'comp-ini-ca-4',
    areaId: 'ini-ca',
    code: 'IND-INI-CA-4.1',
    description: 'Vincula la noción de tiempo con las experiencias y actividades que realiza diariamente (antes - después).',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Registro Anecdótico / Observación Directa'
  },
  // Relación entre los Componentes del Ambiente - 5 Años (12 Indicadores)
  {
    id: 'ind-ini-ca5-101',
    competencyId: 'comp-ini-ca5-1',
    areaId: 'ini-ca',
    code: 'IND-INI-CA5-1.1',
    description: 'Agrupa por formas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ca5-102',
    competencyId: 'comp-ini-ca5-1',
    areaId: 'ini-ca',
    code: 'IND-INI-CA5-1.2',
    description: 'Asocia la forma de los objetos con las figuras geométricas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ca5-103',
    competencyId: 'comp-ini-ca5-1',
    areaId: 'ini-ca',
    code: 'IND-INI-CA5-1.3',
    description: 'Establece semejanzas y diferencias.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ca5-201',
    competencyId: 'comp-ini-ca5-2',
    areaId: 'ini-ca',
    code: 'IND-INI-CA5-2.1',
    description: 'Agrupa objetos por tamaño.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ca5-202',
    competencyId: 'comp-ini-ca5-2',
    areaId: 'ini-ca',
    code: 'IND-INI-CA5-2.2',
    description: 'Realiza correspondencias.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ca5-203',
    competencyId: 'comp-ini-ca5-2',
    areaId: 'ini-ca',
    code: 'IND-INI-CA5-2.3',
    description: 'Discrimina el tamaño de los objetos (grande, mediano, pequeño, alto - bajo, largo - corto).',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ca5-204',
    competencyId: 'comp-ini-ca5-2',
    areaId: 'ini-ca',
    code: 'IND-INI-CA5-2.4',
    description: 'Nombra el tamaño de los objetos.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ca5-301',
    competencyId: 'comp-ini-ca5-3',
    areaId: 'ini-ca',
    code: 'IND-INI-CA5-3.1',
    description: 'Agrupa objetos por color.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ca5-302',
    competencyId: 'comp-ini-ca5-3',
    areaId: 'ini-ca',
    code: 'IND-INI-CA5-3.2',
    description: 'Realiza correspondencia por color.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ca5-303',
    competencyId: 'comp-ini-ca5-3',
    areaId: 'ini-ca',
    code: 'IND-INI-CA5-3.3',
    description: 'Discrimina colores primarios y secundarios.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ca5-401',
    competencyId: 'comp-ini-ca5-4',
    areaId: 'ini-ca',
    code: 'IND-INI-CA5-4.1',
    description: 'Ubica objetos según su posición.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ca5-402',
    competencyId: 'comp-ini-ca5-4',
    areaId: 'ini-ca',
    code: 'IND-INI-CA5-4.2',
    description: 'Establece relación entre su cuerpo y los objetos.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Registro Anecdótico / Observación Directa'
  },
  // Artes Plásticas - Sala de 4 Años (14 Indicadores)
  {
    id: 'ind-ini-ap4-101',
    competencyId: 'comp-ini-ap4-1',
    areaId: 'ini-ap',
    code: 'IND-INI-AP4-1.1',
    description: 'Amasa plastilina para modelar figuras.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ap4-102',
    competencyId: 'comp-ini-ap4-1',
    areaId: 'ini-ap',
    code: 'IND-INI-AP4-1.2',
    description: 'Aplana plastilina para modelar figuras.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ap4-103',
    competencyId: 'comp-ini-ap4-1',
    areaId: 'ini-ap',
    code: 'IND-INI-AP4-1.3',
    description: 'Rasga libremente.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ap4-104',
    competencyId: 'comp-ini-ap4-1',
    areaId: 'ini-ap',
    code: 'IND-INI-AP4-1.4',
    description: 'Rasga en línea recta.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ap4-201',
    competencyId: 'comp-ini-ap4-2',
    areaId: 'ini-ap',
    code: 'IND-INI-AP4-2.1',
    description: 'Ensarta objetos con orificio grande.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ap4-202',
    competencyId: 'comp-ini-ap4-2',
    areaId: 'ini-ap',
    code: 'IND-INI-AP4-2.2',
    description: 'Construye torres de dos piezas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ap4-203',
    competencyId: 'comp-ini-ap4-2',
    areaId: 'ini-ap',
    code: 'IND-INI-AP4-2.3',
    description: 'Encaja formas grandes.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ap4-204',
    competencyId: 'comp-ini-ap4-2',
    areaId: 'ini-ap',
    code: 'IND-INI-AP4-2.4',
    description: 'Arma figuras con juegos de piezas grandes.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ap4-301',
    competencyId: 'comp-ini-ap4-3',
    areaId: 'ini-ap',
    code: 'IND-INI-AP4-3.1',
    description: 'Colorea figuras grandes respetando el contorno.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ap4-302',
    competencyId: 'comp-ini-ap4-3',
    areaId: 'ini-ap',
    code: 'IND-INI-AP4-3.2',
    description: 'Traza formas sencillas (monigotes, renacuajos, bolitas).',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Registro Gráfico / Escala de Estimación'
  },
  {
    id: 'ind-ini-ap4-303',
    competencyId: 'comp-ini-ap4-3',
    areaId: 'ini-ap',
    code: 'IND-INI-AP4-3.3',
    description: 'Traza figuras más definidas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Registro Gráfico / Escala de Estimación'
  },
  {
    id: 'ind-ini-ap4-304',
    competencyId: 'comp-ini-ap4-3',
    areaId: 'ini-ap',
    code: 'IND-INI-AP4-3.4',
    description: 'Manipula el lápiz, el creyón y el pincel con facilidad.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ap4-401',
    competencyId: 'comp-ini-ap4-4',
    areaId: 'ini-ap',
    code: 'IND-INI-AP4-4.1',
    description: 'Destapa envases sin rosca.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ap4-402',
    competencyId: 'comp-ini-ap4-4',
    areaId: 'ini-ap',
    code: 'IND-INI-AP4-4.2',
    description: 'Abre y cierra la lonchera.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa'
  },
  // Artes Plásticas - Sala de 5 Años (16 Indicadores)
  {
    id: 'ind-ini-ap5-101',
    competencyId: 'comp-ini-ap5-1',
    areaId: 'ini-ap',
    code: 'IND-INI-AP5-1.1',
    description: 'Amasa para formar modelos.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ap5-102',
    competencyId: 'comp-ini-ap5-1',
    areaId: 'ini-ap',
    code: 'IND-INI-AP5-1.2',
    description: 'Aplana para formar modelos.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ap5-103',
    competencyId: 'comp-ini-ap5-1',
    areaId: 'ini-ap',
    code: 'IND-INI-AP5-1.3',
    description: 'Construye figuras sencillas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ap5-201',
    competencyId: 'comp-ini-ap5-2',
    areaId: 'ini-ap',
    code: 'IND-INI-AP5-2.1',
    description: 'Rasga libremente.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ap5-202',
    competencyId: 'comp-ini-ap5-2',
    areaId: 'ini-ap',
    code: 'IND-INI-AP5-2.2',
    description: 'Rasga líneas rectas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ap5-203',
    competencyId: 'comp-ini-ap5-2',
    areaId: 'ini-ap',
    code: 'IND-INI-AP5-2.3',
    description: 'Recorta libremente.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Observación Directa / Escala de Estimación'
  },
  {
    id: 'ind-ini-ap5-204',
    competencyId: 'comp-ini-ap5-2',
    areaId: 'ini-ap',
    code: 'IND-INI-AP5-2.4',
    description: 'Recorta líneas rectas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ap5-301',
    competencyId: 'comp-ini-ap5-3',
    areaId: 'ini-ap',
    code: 'IND-INI-AP5-3.1',
    description: 'Ensarta objetos con orificio grande.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ap5-302',
    competencyId: 'comp-ini-ap5-3',
    areaId: 'ini-ap',
    code: 'IND-INI-AP5-3.2',
    description: 'Ensarta objetos con orificio pequeño.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ap5-303',
    competencyId: 'comp-ini-ap5-3',
    areaId: 'ini-ap',
    code: 'IND-INI-AP5-3.3',
    description: 'Construye torres de varias piezas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ap5-304',
    competencyId: 'comp-ini-ap5-3',
    areaId: 'ini-ap',
    code: 'IND-INI-AP5-3.4',
    description: 'Encaja figuras pequeñas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ap5-305',
    competencyId: 'comp-ini-ap5-3',
    areaId: 'ini-ap',
    code: 'IND-INI-AP5-3.5',
    description: 'Arma figuras con juegos de piezas grandes.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ap5-401',
    competencyId: 'comp-ini-ap5-4',
    areaId: 'ini-ap',
    code: 'IND-INI-AP5-4.1',
    description: 'Colorea figuras grandes respetando el contorno.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ap5-402',
    competencyId: 'comp-ini-ap5-4',
    areaId: 'ini-ap',
    code: 'IND-INI-AP5-4.2',
    description: 'Colorea figuras pequeñas respetando el contorno.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ap5-403',
    competencyId: 'comp-ini-ap5-4',
    areaId: 'ini-ap',
    code: 'IND-INI-AP5-4.3',
    description: 'Traza formas sencillas (monigotes, renacuajos, bolitas).',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Registro Gráfico / Escala de Estimación'
  },
  {
    id: 'ind-ini-ap5-404',
    competencyId: 'comp-ini-ap5-4',
    areaId: 'ini-ap',
    code: 'IND-INI-AP5-4.4',
    description: 'Traza figuras más definidas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Registro Gráfico / Escala de Estimación'
  },
  // Educación Física - Sala de 4 Años (4 Indicadores)
  {
    id: 'ind-ini-ef4-101',
    competencyId: 'comp-ini-ef4-1',
    areaId: 'ini-ef',
    code: 'IND-INI-EF4-1.1',
    description: 'Realiza equilibrio a través de una línea recta, con diferentes cambios de ritmo (caminando, trotando, corriendo).',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ef4-102',
    competencyId: 'comp-ini-ef4-1',
    areaId: 'ini-ef',
    code: 'IND-INI-EF4-1.2',
    description: 'Reconoce todas sus partes del cuerpo a través de diferentes ejercicios a la voz del mando del profesor.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa'
  },
  {
    id: 'ind-ini-ef4-201',
    competencyId: 'comp-ini-ef4-2',
    areaId: 'ini-ef',
    code: 'IND-INI-EF4-2.1',
    description: 'Realiza de manera correcta la prueba de velocidad - reacción, desplazándose en zigzag por medio de unos conos.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ef4-202',
    competencyId: 'comp-ini-ef4-2',
    areaId: 'ini-ef',
    code: 'IND-INI-EF4-2.2',
    description: 'Ejecuta circuito de salto bipodal - unipodal, superando obstáculos en el camino de aros y mini vallas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  // Educación Física - Sala de 5 Años (4 Indicadores)
  {
    id: 'ind-ini-ef5-101',
    competencyId: 'comp-ini-ef5-1',
    areaId: 'ini-ef',
    code: 'IND-INI-EF5-1.1',
    description: 'Realiza prueba de intervalo caminando - trotando por un tiempo estimado de 5 minutos.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ef5-102',
    competencyId: 'comp-ini-ef5-1',
    areaId: 'ini-ef',
    code: 'IND-INI-EF5-1.2',
    description: 'Ejecuta prueba de izquierda - derecha entre conos para proceder a saltar las mini vallas, aros y culminar con velocidad.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ef5-201',
    competencyId: 'comp-ini-ef5-2',
    areaId: 'ini-ef',
    code: 'IND-INI-EF5-2.1',
    description: 'Realiza de manera correcta el circuito motriz, en sus diferentes estaciones de: velocidad, reacción, salto bipodal – unipodal y zigzag.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ef5-202',
    competencyId: 'comp-ini-ef5-2',
    areaId: 'ini-ef',
    code: 'IND-INI-EF5-2.2',
    description: 'Trabaja la visión óculo manual correctamente con pelota pequeña / grande de forma estática y con movimiento.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  // Natación - Sala de 4 Años (4 Indicadores)
  {
    id: 'ind-ini-nat4-101',
    competencyId: 'comp-ini-nat4-1',
    areaId: 'ini-nat',
    code: 'IND-INI-NAT4-1.1',
    description: 'Se familiariza con el medio acuático, sintiéndose seguro(a) en el borde sentado(a), colocando los pies en punta para realizar patadas.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa Acuática'
  },
  {
    id: 'ind-ini-nat4-102',
    competencyId: 'comp-ini-nat4-1',
    areaId: 'ini-nat',
    code: 'IND-INI-NAT4-1.2',
    description: 'Realiza burbujitas de manera progresiva, tomando aire por la boca y expulsándolo por la nariz debajo del agua.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-nat4-201',
    competencyId: 'comp-ini-nat4-2',
    areaId: 'ini-nat',
    code: 'IND-INI-NAT4-2.1',
    description: 'Se siente en confianza en tomar la tabla con las dos manos y con la ayuda del profesor realizar patada de libre con desplazamiento.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa Acuática'
  },
  {
    id: 'ind-ini-nat4-202',
    competencyId: 'comp-ini-nat4-2',
    areaId: 'ini-nat',
    code: 'IND-INI-NAT4-2.2',
    description: 'Se mantiene tranquilo(a) en flotación dorsal por unos segundos con la ayuda del profesor.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  // Natación - Sala de 5 Años (4 Indicadores)
  {
    id: 'ind-ini-nat5-101',
    competencyId: 'comp-ini-nat5-1',
    areaId: 'ini-nat',
    code: 'IND-INI-NAT5-1.1',
    description: 'Realiza burbujitas al mismo tiempo tomando la tabla para avanzar con la patada de libre con el acompañamiento del profesor.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-nat5-102',
    competencyId: 'comp-ini-nat5-1',
    areaId: 'ini-nat',
    code: 'IND-INI-NAT5-1.2',
    description: 'Ejecuta el nado de flecha de manera eficiente, tomando en cuenta una mano encima de la otra, cabeza sumergida y patada constante, nadando hacia dirección del profesor.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Observación Directa Acuática'
  },
  {
    id: 'ind-ini-nat5-201',
    competencyId: 'comp-ini-nat5-2',
    areaId: 'ini-nat',
    code: 'IND-INI-NAT5-2.1',
    description: 'Se siente seguro(a) y relajado(a) en hacer flotación dorsal abrazando la tabla, para luego hacerlo sin implemento.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-nat5-202',
    competencyId: 'comp-ini-nat5-2',
    areaId: 'ini-nat',
    code: 'IND-INI-NAT5-2.2',
    description: 'Realiza la brazada del estilo libre con tabla, manteniendo la flotación horizontal y patada en movimiento alterna.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  // Ajedrez - Sala de 4 Años (4 Indicadores)
  {
    id: 'ind-ini-aje4-101',
    competencyId: 'comp-ini-aje4-1',
    areaId: 'ini-aje',
    code: 'IND-INI-AJE4-1.1',
    description: 'Nombra cada pieza del juego de ajedrez al ser mostrada por el docente.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa en Tablero'
  },
  {
    id: 'ind-ini-aje4-102',
    competencyId: 'comp-ini-aje4-1',
    areaId: 'ini-aje',
    code: 'IND-INI-AJE4-1.2',
    description: 'Reconoce filas, columnas o diagonales al ser mostradas por el docente.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-aje4-201',
    competencyId: 'comp-ini-aje4-2',
    areaId: 'ini-aje',
    code: 'IND-INI-AJE4-2.1',
    description: 'Ejecuta correctamente el movimiento de la torre.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Registro de Ejecución Práctica'
  },
  {
    id: 'ind-ini-aje4-202',
    competencyId: 'comp-ini-aje4-2',
    areaId: 'ini-aje',
    code: 'IND-INI-AJE4-2.2',
    description: 'Ejecuta correctamente el movimiento del alfil.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Registro de Ejecución Práctica'
  },
  // Ajedrez - Sala de 5 Años (4 Indicadores)
  {
    id: 'ind-ini-aje5-101',
    competencyId: 'comp-ini-aje5-1',
    areaId: 'ini-aje',
    code: 'IND-INI-AJE5-1.1',
    description: 'Nombra el valor de cada pieza del ajedrez tomando como base el peón.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-aje5-102',
    competencyId: 'comp-ini-aje5-1',
    areaId: 'ini-aje',
    code: 'IND-INI-AJE5-1.2',
    description: 'Nombra las casillas del tablero de ajedrez utilizando las coordenadas de letras y números.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Prueba Práctica de Coordenadas'
  },
  {
    id: 'ind-ini-aje5-201',
    competencyId: 'comp-ini-aje5-2',
    areaId: 'ini-aje',
    code: 'IND-INI-AJE5-2.1',
    description: 'Indica la pieza defendida o indefensa en ejercicios propuestos por el docente.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-aje5-202',
    competencyId: 'comp-ini-aje5-2',
    areaId: 'ini-aje',
    code: 'IND-INI-AJE5-2.2',
    description: 'Ejecuta jugadas de captura o defensa de piezas en ejercicios propuestos por el docente.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Rúbrica de Resolución Táctica'
  },
  // Informática - Sala de 4 Años (6 Indicadores)
  {
    id: 'ind-ini-inf4-101',
    competencyId: 'comp-ini-inf4-1',
    areaId: 'ini-inf',
    code: 'IND-INI-INF4-1.1',
    description: 'Identifica correctamente el monitor, teclado, mouse y CPU mediante señalamientos o juegos interactivos.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa en Aula de Computación'
  },
  {
    id: 'ind-ini-inf4-102',
    competencyId: 'comp-ini-inf4-1',
    areaId: 'ini-inf',
    code: 'IND-INI-INF4-1.2',
    description: 'Realiza clics simples y arrastra objetos en actividades digitales con apoyo mínimo.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Registro de Destreza Digital'
  },
  {
    id: 'ind-ini-inf4-103',
    competencyId: 'comp-ini-inf4-1',
    areaId: 'ini-inf',
    code: 'IND-INI-INF4-1.3',
    description: 'Interactúa con la pantalla táctil de forma autónoma.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Lista de Cotejo Tecnológica'
  },
  {
    id: 'ind-ini-inf4-201',
    competencyId: 'comp-ini-inf4-2',
    areaId: 'ini-inf',
    code: 'IND-INI-INF4-2.1',
    description: 'Navega por menús sencillos y selecciona juegos apropiados con ayuda guiada.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-inf4-202',
    competencyId: 'comp-ini-inf4-2',
    areaId: 'ini-inf',
    code: 'IND-INI-INF4-2.2',
    description: 'Usa herramientas básicas como lápiz, pincel y colores para crear formas o trazos reconocibles.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Portafolio Digital / Dibujo'
  },
  {
    id: 'ind-ini-inf4-203',
    competencyId: 'comp-ini-inf4-2',
    areaId: 'ini-inf',
    code: 'IND-INI-INF4-2.3',
    description: 'Participa activamente en actividades digitales, mostrando entusiasmo y atención sostenida.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Registro Anecdótico Formativo'
  },
  // Informática - Sala de 5 Años (6 Indicadores)
  {
    id: 'ind-ini-inf5-101',
    competencyId: 'comp-ini-inf5-1',
    areaId: 'ini-inf',
    code: 'IND-INI-INF5-1.1',
    description: 'Identifica el monitor, teclado, mouse, CPU y pantalla táctil, explicando para qué sirve cada uno.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Diálogo Guiado y Observación'
  },
  {
    id: 'ind-ini-inf5-102',
    competencyId: 'comp-ini-inf5-1',
    areaId: 'ini-inf',
    code: 'IND-INI-INF5-1.2',
    description: 'Realiza clics dobles, arrastra objetos y selecciona elementos con control y coordinación.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Prueba Práctica de Coordinación Digital'
  },
  {
    id: 'ind-ini-inf5-103',
    competencyId: 'comp-ini-inf5-1',
    areaId: 'ini-inf',
    code: 'IND-INI-INF5-1.3',
    description: 'Explora y navega de forma autónoma en juegos educativos digitales.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-inf5-201',
    competencyId: 'comp-ini-inf5-2',
    areaId: 'ini-inf',
    code: 'IND-INI-INF5-2.1',
    description: 'Crea diseños y figuras utilizando herramientas de dibujo digital en Paint.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Portafolio de Creaciones Digitales'
  },
  {
    id: 'ind-ini-inf5-202',
    competencyId: 'comp-ini-inf5-2',
    areaId: 'ini-inf',
    code: 'IND-INI-INF5-2.2',
    description: 'Reconoce íconos y herramientas básicas del programa Paint.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Prueba Práctica de Interfaz'
  },
  {
    id: 'ind-ini-inf5-203',
    competencyId: 'comp-ini-inf5-2',
    areaId: 'ini-inf',
    code: 'IND-INI-INF5-2.3',
    description: 'Muestra iniciativa y creatividad al interactuar con recursos digitales.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Rúbrica de Actitud y Creatividad Tecnológica'
  },
  // Inglés - Sala de 4 Años (5 Indicadores)
  {
    id: 'ind-ini-ing4-101',
    competencyId: 'comp-ini-ing4-1',
    areaId: 'ini-ing',
    code: 'IND-INI-ING4-1.1',
    description: 'Señala objetos según el color indicado en inglés.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Observación Directa Lúdica'
  },
  {
    id: 'ind-ini-ing4-102',
    competencyId: 'comp-ini-ing4-1',
    areaId: 'ini-ing',
    code: 'IND-INI-ING4-1.2',
    description: 'Menciona los colores básicos vistos en clase (red, orange, yellow, etc.).',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ing4-103',
    competencyId: 'comp-ini-ing4-1',
    areaId: 'ini-ing',
    code: 'IND-INI-ING4-1.3',
    description: 'Pronuncia correctamente el vocabulario de los colores en inglés.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Registro Fonético Formativo'
  },
  {
    id: 'ind-ini-ing4-201',
    competencyId: 'comp-ini-ing4-2',
    areaId: 'ini-ing',
    code: 'IND-INI-ING4-2.1',
    description: 'Identifica los miembros de la familia vistos en clase (mother, father, sister, baby) etc.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Lista de Cotejo Bilingüe'
  },
  {
    id: 'ind-ini-ing4-202',
    competencyId: 'comp-ini-ing4-2',
    areaId: 'ini-ing',
    code: 'IND-INI-ING4-2.2',
    description: 'Menciona el vocabulario de la familia visto en clase.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  // Inglés - Sala de 5 Años (5 Indicadores)
  {
    id: 'ind-ini-ing5-101',
    competencyId: 'comp-ini-ing5-1',
    areaId: 'ini-ing',
    code: 'IND-INI-ING5-1.1',
    description: 'Reconoce el vocabulario de la familia visto en clase (mother, father, uncle, aunt, etc.).',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Escala de Estimación Cualitativa'
  },
  {
    id: 'ind-ini-ing5-102',
    competencyId: 'comp-ini-ing5-1',
    areaId: 'ini-ing',
    code: 'IND-INI-ING5-1.2',
    description: 'Pronuncia correctamente el vocabulario de la familia en inglés (mother, father, grandfather, uncle, etc.).',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Registro Fonético Formativo'
  },
  {
    id: 'ind-ini-ing5-103',
    competencyId: 'comp-ini-ing5-1',
    areaId: 'ini-ing',
    code: 'IND-INI-ING5-1.3',
    description: 'Señala correctamente a los miembros de la familia cuando la docente los nombra.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Prueba Práctica de Respuesta Auditiva'
  },
  {
    id: 'ind-ini-ing5-201',
    competencyId: 'comp-ini-ing5-2',
    areaId: 'ini-ing',
    code: 'IND-INI-ING5-2.1',
    description: 'Señala correctamente la parte del rostro cuando se le menciona.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Observación Psicomotriz TPR'
  },
  {
    id: 'ind-ini-ing5-202',
    competencyId: 'comp-ini-ing5-2',
    areaId: 'ini-ing',
    code: 'IND-INI-ING5-2.2',
    description: 'Nombra correctamente las partes de su rostro en inglés.',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 5 Años',
    evaluationInstrument: 'Rúbrica de Producción Oral en Lengua Extranjera'
  },
  // Primaria - 1er Grado (44 Indicadores Oficiales)
  // Lenguaje - 1er Grado (14 Indicadores)
  {
    id: 'ind-pri-len1-101',
    competencyId: 'comp-pri-len1-1',
    areaId: 'pri-len',
    code: 'IND-PRI-LEN1-1.1',
    description: 'Participa en conversaciones como oyente: escucha con atención e interés.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Registro de Observación Directa'
  },
  {
    id: 'ind-pri-len1-102',
    competencyId: 'comp-pri-len1-1',
    areaId: 'pri-len',
    code: 'IND-PRI-LEN1-1.2',
    description: 'Participa en conversaciones como hablante: se expresa en forma cordial, respetuosa y espontánea.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Escala de Estimación de Intercambio Oral'
  },
  {
    id: 'ind-pri-len1-103',
    competencyId: 'comp-pri-len1-1',
    areaId: 'pri-len',
    code: 'IND-PRI-LEN1-1.3',
    description: 'Usa diversas fórmulas sociales para interactuar con los demás en situaciones de la vida cotidiana.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Registro de Interacción Social'
  },
  {
    id: 'ind-pri-len1-201',
    competencyId: 'comp-pri-len1-2',
    areaId: 'pri-len',
    code: 'IND-PRI-LEN1-2.1',
    description: 'Presenta hábitos de orden y limpieza.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Revisión Sistemática de Cuaderno'
  },
  {
    id: 'ind-pri-len1-202',
    competencyId: 'comp-pri-len1-2',
    areaId: 'pri-len',
    code: 'IND-PRI-LEN1-2.2',
    description: 'Conoce y diferencia las vocales y las consonantes.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Prueba Práctica / Registro Gráfico'
  },
  {
    id: 'ind-pri-len1-203',
    competencyId: 'comp-pri-len1-2',
    areaId: 'pri-len',
    code: 'IND-PRI-LEN1-2.3',
    description: 'Diferencia mayúsculas y minúsculas.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Actividad de Aplicación Escrita'
  },
  {
    id: 'ind-pri-len1-204',
    competencyId: 'comp-pri-len1-2',
    areaId: 'pri-len',
    code: 'IND-PRI-LEN1-2.4',
    description: 'Realiza encabezado al inicio de cada área.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Revisión Sistemática de Cuaderno'
  },
  {
    id: 'ind-pri-len1-205',
    competencyId: 'comp-pri-len1-2',
    areaId: 'pri-len',
    code: 'IND-PRI-LEN1-2.5',
    description: 'Respeta margen y sangría al escribir un texto.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Revisión de Caligrafía y Cuaderno'
  },
  {
    id: 'ind-pri-len1-206',
    competencyId: 'comp-pri-len1-2',
    areaId: 'pri-len',
    code: 'IND-PRI-LEN1-2.6',
    description: 'Escribe el título en el lugar correspondiente.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Revisión Sistemática de Cuaderno'
  },
  {
    id: 'ind-pri-len1-207',
    competencyId: 'comp-pri-len1-2',
    areaId: 'pri-len',
    code: 'IND-PRI-LEN1-2.7',
    description: 'Atiende direccionalidad, forma y tamaño de letra.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Pauta de Trazado Caligráfico'
  },
  {
    id: 'ind-pri-len1-208',
    competencyId: 'comp-pri-len1-2',
    areaId: 'pri-len',
    code: 'IND-PRI-LEN1-2.8',
    description: 'Copia textos cortos del pizarrón al cuaderno.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Registro de Producción Escrita'
  },
  {
    id: 'ind-pri-len1-209',
    competencyId: 'comp-pri-len1-2',
    areaId: 'pri-len',
    code: 'IND-PRI-LEN1-2.9',
    description: 'Culmina las actividades en el tiempo establecido.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Observación Directa del Trabajo en Aula'
  },
  {
    id: 'ind-pri-len1-301',
    competencyId: 'comp-pri-len1-3',
    areaId: 'pri-len',
    code: 'IND-PRI-LEN1-3.1',
    description: 'Expresa ideas, emociones o situaciones mediante elaboración de tarjeta, frases o cuentos.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Rúbrica de Producción Creativa'
  },
  {
    id: 'ind-pri-len1-302',
    competencyId: 'comp-pri-len1-3',
    areaId: 'pri-len',
    code: 'IND-PRI-LEN1-3.2',
    description: 'Realiza la copia de un texto al cuaderno.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Revisión de Cuaderno y Fidelidad de Copia'
  },
  // Matemática - 1er Grado (13 Indicadores)
  {
    id: 'ind-pri-mat1-101',
    competencyId: 'comp-pri-mat1-1',
    areaId: 'pri-mat',
    code: 'IND-PRI-MAT1-1.1',
    description: 'Expresa criterios de clasificación.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Actividad Práctica con Material Concreto'
  },
  {
    id: 'ind-pri-mat1-102',
    competencyId: 'comp-pri-mat1-1',
    areaId: 'pri-mat',
    code: 'IND-PRI-MAT1-1.2',
    description: 'Realiza seriaciones expresando la regla que lo rige.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Guía Práctica de Seriación'
  },
  {
    id: 'ind-pri-mat1-103',
    competencyId: 'comp-pri-mat1-1',
    areaId: 'pri-mat',
    code: 'IND-PRI-MAT1-1.3',
    description: 'Utiliza adecuadamente los símbolos mayor que >, menor que <, igual a =.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Hoja de Ejercitación de Relaciones'
  },
  {
    id: 'ind-pri-mat1-104',
    competencyId: 'comp-pri-mat1-1',
    areaId: 'pri-mat',
    code: 'IND-PRI-MAT1-1.4',
    description: 'Escribe el número anterior y posterior de una cifra dada.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Prueba Escrita de Cálculo y Orden'
  },
  {
    id: 'ind-pri-mat1-105',
    competencyId: 'comp-pri-mat1-1',
    areaId: 'pri-mat',
    code: 'IND-PRI-MAT1-1.5',
    description: 'Mantiene su atención y concentración al realizar sus actividades.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Registro de Observación Directa'
  },
  {
    id: 'ind-pri-mat1-106',
    competencyId: 'comp-pri-mat1-1',
    areaId: 'pri-mat',
    code: 'IND-PRI-MAT1-1.6',
    description: 'Utiliza la recta numérica como herramienta gráfica para contar, ordenar y representar números.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Guía de Recta Numérica y Conteo'
  },
  {
    id: 'ind-pri-mat1-201',
    competencyId: 'comp-pri-mat1-2',
    areaId: 'pri-mat',
    code: 'IND-PRI-MAT1-2.1',
    description: 'Relaciona el número con su nombre (del 1 al 50).',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Actividad de Escritura Numérica'
  },
  {
    id: 'ind-pri-mat1-202',
    competencyId: 'comp-pri-mat1-2',
    areaId: 'pri-mat',
    code: 'IND-PRI-MAT1-2.2',
    description: 'Realiza series regresivas de números de hasta tres cifras.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Prueba Práctica de Conteo Regresivo'
  },
  {
    id: 'ind-pri-mat1-203',
    competencyId: 'comp-pri-mat1-2',
    areaId: 'pri-mat',
    code: 'IND-PRI-MAT1-2.3',
    description: 'Identifica los números en situaciones cotidianas.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Resolución de Situaciones Cotidianas'
  },
  {
    id: 'ind-pri-mat1-204',
    competencyId: 'comp-pri-mat1-2',
    areaId: 'pri-mat',
    code: 'IND-PRI-MAT1-2.4',
    description: 'Realiza series progresivas de números de hasta tres cifras.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Prueba Práctica de Conteo Progresivo'
  },
  {
    id: 'ind-pri-mat1-301',
    competencyId: 'comp-pri-mat1-3',
    areaId: 'pri-mat',
    code: 'IND-PRI-MAT1-3.1',
    description: 'Nombra las figuras geométricas planas en su entorno.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Reconocimiento Visual y Oral'
  },
  {
    id: 'ind-pri-mat1-302',
    competencyId: 'comp-pri-mat1-3',
    areaId: 'pri-mat',
    code: 'IND-PRI-MAT1-3.2',
    description: 'Dibuja las figuras geométricas planas básicas.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Trazado Geométrico en Cuaderno'
  },
  {
    id: 'ind-pri-mat1-401',
    competencyId: 'comp-pri-mat1-4',
    areaId: 'pri-mat',
    code: 'IND-PRI-MAT1-4.1',
    description: 'Utiliza correctamente las nociones espaciales de ubicación (arriba, abajo, izquierda, derecha).',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Circuito Psicomotor y Ficha Espacial'
  },
  // Ciencias Naturales - 1er Grado (7 Indicadores)
  {
    id: 'ind-pri-cn1-101',
    competencyId: 'comp-pri-cn1-1',
    areaId: 'pri-cn',
    code: 'IND-PRI-CN1-1.1',
    description: 'Identifica los nombres de los elementos de la naturaleza.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Registro Gráfico e Identificación Visual'
  },
  {
    id: 'ind-pri-cn1-102',
    competencyId: 'comp-pri-cn1-1',
    areaId: 'pri-cn',
    code: 'IND-PRI-CN1-1.2',
    description: 'Describe en forma oral y gráfica el ambiente seleccionado y sus condiciones.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Exposición Oral y Dibujo de Ambiente'
  },
  {
    id: 'ind-pri-cn1-103',
    competencyId: 'comp-pri-cn1-1',
    areaId: 'pri-cn',
    code: 'IND-PRI-CN1-1.3',
    description: 'Identifica y nombra diferentes hábitats del planeta tierra.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Ficha Descriptiva de Hábitats'
  },
  {
    id: 'ind-pri-cn1-104',
    competencyId: 'comp-pri-cn1-1',
    areaId: 'pri-cn',
    code: 'IND-PRI-CN1-1.4',
    description: 'Recoge y organiza sus materiales de trabajo con el fin de mantener el ambiente sano en el salón de clases.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Observación Directa de Convivencia y Orden'
  },
  {
    id: 'ind-pri-cn1-201',
    competencyId: 'comp-pri-cn1-2',
    areaId: 'pri-cn',
    code: 'IND-PRI-CN1-2.1',
    description: 'Identifica los alimentos saludables y no saludables para el sano crecimiento.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Clasificación de Alimentos y Lonchera Nutritiva'
  },
  {
    id: 'ind-pri-cn1-202',
    competencyId: 'comp-pri-cn1-2',
    areaId: 'pri-cn',
    code: 'IND-PRI-CN1-2.2',
    description: 'Clasifica los diferentes alimentos según su origen: vegetal, animal y mineral.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Cuadro Comparativo de Origen Alimenticio'
  },
  {
    id: 'ind-pri-cn1-203',
    competencyId: 'comp-pri-cn1-2',
    areaId: 'pri-cn',
    code: 'IND-PRI-CN1-2.3',
    description: 'Practica hábitos higiénicos.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Registro Anecdótico de Hábitos y Cuidado Personal'
  },
  // Ciencias Sociales - 1er Grado (10 Indicadores)
  {
    id: 'ind-pri-cs1-101',
    competencyId: 'comp-pri-cs1-1',
    areaId: 'pri-cs',
    code: 'IND-PRI-CS1-1.1',
    description: 'Reconoce las dependencias del colegio.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Recorrido Guiado y Croquis Escolar'
  },
  {
    id: 'ind-pri-cs1-102',
    competencyId: 'comp-pri-cs1-1',
    areaId: 'pri-cs',
    code: 'IND-PRI-CS1-1.2',
    description: 'Identifica miembros de la comunidad escolar.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Ficha de Actores Educativos CBA'
  },
  {
    id: 'ind-pri-cs1-201',
    competencyId: 'comp-pri-cs1-2',
    areaId: 'pri-cs',
    code: 'IND-PRI-CS1-2.1',
    description: 'Establece relaciones entre antes, ahora y después.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Línea de Tiempo Personal y Gráfica'
  },
  {
    id: 'ind-pri-cs1-202',
    competencyId: 'comp-pri-cs1-2',
    areaId: 'pri-cs',
    code: 'IND-PRI-CS1-2.2',
    description: 'Compara aspectos de su vida actual con momentos pasados.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Relato Oral y Álbum de Recuerdos'
  },
  {
    id: 'ind-pri-cs1-301',
    competencyId: 'comp-pri-cs1-3',
    areaId: 'pri-cs',
    code: 'IND-PRI-CS1-3.1',
    description: 'Identifica y aplica las normas de convivencia en el aula.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Observación Sistemática de Normas de Convivencia'
  },
  {
    id: 'ind-pri-cs1-302',
    competencyId: 'comp-pri-cs1-3',
    areaId: 'pri-cs',
    code: 'IND-PRI-CS1-3.2',
    description: 'Reconoce y practica valores como el respeto, la honestidad y la solidaridad.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Registro de Valores y Trabajo Colaborativo'
  },
  {
    id: 'ind-pri-cs1-303',
    competencyId: 'comp-pri-cs1-3',
    areaId: 'pri-cs',
    code: 'IND-PRI-CS1-3.3',
    description: 'Muestra confianza y seguridad en sí mismo(a).',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Escala de Estimación de Autoestima y Participación'
  },
  {
    id: 'ind-pri-cs1-401',
    competencyId: 'comp-pri-cs1-4',
    areaId: 'pri-cs',
    code: 'IND-PRI-CS1-4.1',
    description: 'Identifica los miembros de la familia.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Árbol Genealógico y Dibujo Familiar'
  },
  {
    id: 'ind-pri-cs1-402',
    competencyId: 'comp-pri-cs1-4',
    areaId: 'pri-cs',
    code: 'IND-PRI-CS1-4.2',
    description: 'Valora la convivencia de los miembros de la familia.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Conversatorio y Ficha de Reflexión Familiar'
  },
  {
    id: 'ind-pri-cs1-403',
    competencyId: 'comp-pri-cs1-4',
    areaId: 'pri-cs',
    code: 'IND-PRI-CS1-4.3',
    description: 'Describe con sus propias palabras qué es el amor, la solidaridad o el respeto.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '1er Grado',
    evaluationInstrument: 'Expresión Oral y Conceptualización Infantil de Valores'
  },
  // Primaria (Otros Grados Superiores / Modelos Generales)
  {
    id: 'ind-pri-101',
    competencyId: 'comp-pri-1',
    areaId: 'pri-len',
    code: 'IND-PRI-1.1',
    description: 'Escribe cuentos cortos respetando la estructura inicio-nudo-desenlace con adecuada concordancia de género y número.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '3er Grado',
    evaluationInstrument: 'Rúbrica de Producción Escrita'
  },
  {
    id: 'ind-pri-201',
    competencyId: 'comp-pri-2',
    areaId: 'pri-mat',
    code: 'IND-PRI-2.1',
    description: 'Resuelve operaciones combinadas de suma y resta con fracciones heterogéneas simplificando al término irreductible.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '3er Grado',
    evaluationInstrument: 'Prueba Práctica Escrita'
  },
  {
    id: 'ind-pri-301',
    competencyId: 'comp-pri-3',
    areaId: 'pri-rob',
    code: 'IND-PRI-3.1',
    description: 'Arma una estructura con engranajes multiplicadores de velocidad y documenta el funcionamiento con diagrama de bloques.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '3er Grado',
    evaluationInstrument: 'Demostración de Proyecto'
  },
  {
    id: 'ind-pri-401',
    competencyId: 'comp-pri-4',
    areaId: 'pri-cn',
    code: 'IND-PRI-4.1',
    description: 'Identifica y clasifica especies de flora y fauna de la región zuliana documentando sus adaptaciones al medio ambiente.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '3er Grado',
    evaluationInstrument: 'Informe de Laboratorio Escolar'
  },
  {
    id: 'ind-pri-501',
    competencyId: 'comp-pri-5',
    areaId: 'pri-cs',
    code: 'IND-PRI-5.1',
    description: 'Explica los acontecimientos históricos relevantes y la importancia de la convivencia ciudadana y el respeto a las instituciones.',
    level: 'PRIMARIA',
    lapso: 1,
    grade: '3er Grado',
    evaluationInstrument: 'Exposición y Línea de Tiempo'
  },
  // Media General
  {
    id: 'ind-med-101',
    competencyId: 'comp-med-1',
    areaId: 'med-mat',
    code: 'IND-MED-1.1',
    description: 'Determina el vértice, raíces y concavidad de parábolas cuadráticas a partir de su forma canónica y general.',
    level: 'MEDIA_GENERAL',
    lapso: 1,
    weight: 20,
    evaluationInstrument: 'Prueba Escrita Individual'
  },
  {
    id: 'ind-med-102',
    competencyId: 'comp-med-1',
    areaId: 'med-mat',
    code: 'IND-MED-1.2',
    description: 'Resuelve problemas de optimización de área y costo aplicando el vértice de una función cuadrática.',
    level: 'MEDIA_GENERAL',
    lapso: 1,
    weight: 20,
    evaluationInstrument: 'Taller de Resolución Aplicada'
  },
  {
    id: 'ind-med-201',
    competencyId: 'comp-med-2',
    areaId: 'med-qui',
    code: 'IND-MED-2.1',
    description: 'Balancea ecuaciones químicas redox por método ión-electrón en medio ácido y básico sin errores aritméticos.',
    level: 'MEDIA_GENERAL',
    lapso: 1,
    weight: 25,
    evaluationInstrument: 'Informe de Laboratorio Experimental'
  },
  {
    id: 'ind-med-301',
    competencyId: 'comp-med-3',
    areaId: 'med-rob',
    code: 'IND-MED-3.1',
    description: 'Codifica un script en C++ para lectura de sensor ultrasónico con visualización en display OLED y alerta piezoeléctrica.',
    level: 'MEDIA_GENERAL',
    lapso: 1,
    weight: 25,
    evaluationInstrument: 'Defensa de Prototipo Funcional'
  }
];

export const INITIAL_STRATEGIES: Strategy[] = [
  {
    id: 'strat-ens-1',
    areaId: 'ini-fp',
    name: 'Círculo de Diálogo Emocional y Rincones Lúdicos',
    type: 'ENSENANZA',
    category: 'Inicio',
    description: 'Sesión matutina en asamblea donde cada estudiante selecciona un emoji de su estado anímico y comparte con el grupo.',
    resources: 'Monigotes de tela, espejo de emociones, tarjetas ilustradas.',
    level: 'INICIAL'
  },
  {
    id: 'strat-eval-1',
    areaId: 'ini-fp',
    name: 'Registro Gráfico Anecdótico',
    type: 'EVALUACION',
    category: 'Cierre',
    description: 'Matriz de observación sistematizada en tablet para capturar hitos socioemocionales durante el juego libre.',
    resources: 'Tablet con App SICE-CBA móvil, pauta de observación.',
    level: 'INICIAL'
  },
  {
    id: 'strat-ens-2',
    areaId: 'pri-mat',
    name: 'Laboratorio de Fracciones Manipulativas (Método Singapur)',
    type: 'ENSENANZA',
    category: 'Desarrollo',
    description: 'Modelado con tiras fraccionarias magnéticas y discos plásticos antes de la abstracción numérica.',
    resources: 'Regletas de Cuisenaire, pizarra magnética, fichas fraccionarias.',
    level: 'PRIMARIA'
  },
  {
    id: 'strat-eval-2',
    areaId: 'pri-mat',
    name: 'Rúbrica Analítica de Resolución de Problemas',
    type: 'EVALUACION',
    category: 'Cierre',
    description: 'Valoración en 4 dimensiones: comprensión del enunciado, planteamiento matemático, exactitud del cálculo y justificación de la respuesta.',
    resources: 'Hoja de cotejo digital SICE-CBA.',
    level: 'PRIMARIA'
  },
  {
    id: 'strat-ens-3',
    areaId: 'med-mat',
    name: 'Aula Invertida y Simulación con GeoGebra Interactivo',
    type: 'ENSENANZA',
    category: 'Investigación',
    description: 'Visualización dinámica de la variación paramétrica de funciones en tiempo real conectada a proyectores interactivos.',
    resources: 'Laptops del laboratorio, simulador GeoGebra, guías digitales.',
    level: 'MEDIA_GENERAL'
  },
  {
    id: 'strat-eval-3',
    areaId: 'med-mat',
    name: 'Defensa Oral de Estudio de Caso Matemático',
    type: 'EVALUACION',
    category: 'Cierre',
    description: 'Exposición breve en parejas justificando el modelo algebraico seleccionado frente a un tribunal pedagógico.',
    resources: 'Rúbrica institucional SICE-CBA con ponderación del 20%.',
    level: 'MEDIA_GENERAL'
  }
];

// ==========================================
// --- BANCO OFICIAL DE RECURSOS DIDÁCTICOS CBA ---
// ==========================================

export const INITIAL_EDUCATIONAL_RESOURCES: EducationalResource[] = [
  // --- EDUCACIÓN FÍSICA Y PSICOMOTRICIDAD ---
  {
    id: 'res-ef-01',
    name: 'Balones de Baloncesto Reglamentarios Molten / Spalding (N° 6 y N° 7)',
    category: 'DEPORTIVO_PSICOMOTOR',
    areaId: 'pri-efi',
    level: 'PRIMARIA',
    description: 'Balones de cuero compuesto de agarre profundo para fundamentos técnicos, tiro, drible y pases.',
    location: 'Cancha Techada CBA / Depósito Deportivo',
    quantity: 24,
    isReusable: true
  },
  {
    id: 'res-ef-02',
    name: 'Balones de Fútbol Sala Mikasa Oficiales de Bajo Rebote',
    category: 'DEPORTIVO_PSICOMOTOR',
    areaId: 'med-efi',
    level: 'MEDIA_GENERAL',
    description: 'Balones reglamentarios cosidos a mano de 62-64cm para entrenamiento técnico y partidos intercursos.',
    location: 'Cancha de Futsal CBA / Depósito Deportivo',
    quantity: 18,
    isReusable: true
  },
  {
    id: 'res-ef-03',
    name: 'Balones de Voleibol Mikasa V200W Cuero Suave',
    category: 'DEPORTIVO_PSICOMOTOR',
    areaId: 'med-efi',
    level: 'MEDIA_GENERAL',
    description: 'Balones de voleibol de 18 paneles con tecnología aerodinámica de microfibra para toque de dedos y antebrazo.',
    location: 'Cancha Principal CBA / Depósito Deportivo',
    quantity: 16,
    isReusable: true
  },
  {
    id: 'res-ef-04',
    name: 'Aros de Psicomotricidad (Hula-Hoops) de 60cm y 80cm de Polietileno',
    category: 'DEPORTIVO_PSICOMOTOR',
    areaId: 'ini-ef',
    level: 'INICIAL',
    description: 'Aros plásticos rígidos de alta flexibilidad para delimitación espacial, saltos, equilibrio dinámico y coordinación.',
    location: 'Patio Infantil CBA / Armario Psicomotor',
    quantity: 40,
    isReusable: true
  },
  {
    id: 'res-ef-05',
    name: 'Conos de Entrenamiento y Señalización Ranurados de 30cm',
    category: 'DEPORTIVO_PSICOMOTOR',
    areaId: 'pri-efi',
    level: 'PRIMARIA',
    description: 'Conos de PVC flexible color naranja y amarillo brillante para circuitos motrices, slalom y estaciones de trabajo.',
    location: 'Depósito Deportivo CBA',
    quantity: 50,
    isReusable: true
  },
  {
    id: 'res-ef-06',
    name: 'Cuerdas de Salto Individuales de Velocidad con Rodamiento',
    category: 'DEPORTIVO_PSICOMOTOR',
    areaId: 'pri-efi',
    level: 'PRIMARIA',
    description: 'Cuerdas ajustables de 2.8m con mangos anatómicos para resistencia cardiovascular y coordinación rítmica.',
    location: 'Depósito Deportivo CBA',
    quantity: 35,
    isReusable: true
  },
  {
    id: 'res-ef-07',
    name: 'Colchonetas Gimnásticas de Alta Densidad con Forro Antideslizante',
    category: 'DEPORTIVO_PSICOMOTOR',
    areaId: 'med-efi',
    level: 'MEDIA_GENERAL',
    description: 'Colchonetas de espuma D-30 de 180x60x5cm para ejercicios de suelo, roladas, elongación y seguridad.',
    location: 'Gimnasio Techado CBA',
    quantity: 20,
    isReusable: true
  },
  {
    id: 'res-ef-08',
    name: 'Cronómetros Digitales Profesionales con Memoria de Tiempos y Lap',
    category: 'DEPORTIVO_PSICOMOTOR',
    areaId: 'med-efi',
    level: 'MEDIA_GENERAL',
    description: 'Cronómetros de precisión centesimal para test de velocidad de 50m, test de Cooper y circuitos por tiempo.',
    location: 'Mesa Técnica de Educación Física',
    quantity: 8,
    isReusable: true
  },
  {
    id: 'res-ef-09',
    name: 'Escaleras Pliométricas de Agilidad de 6 Metros (12 Peldaños)',
    category: 'DEPORTIVO_PSICOMOTOR',
    areaId: 'med-efi',
    level: 'MEDIA_GENERAL',
    description: 'Escaleras de suelo de cinta de nylon para trabajo de frecuencia de zancada, coordinación y potencia neuromuscular.',
    location: 'Depósito Deportivo CBA',
    quantity: 6,
    isReusable: true
  },

  // --- EDUCACIÓN INICIAL (MATERIAL CONCRETO Y LÚDICO) ---
  {
    id: 'res-ini-01',
    name: 'Bloques Lógicos de Dienes de Madera Pulida (48 Piezas)',
    category: 'MANIPULATIVO_CONCRETO',
    areaId: 'ini-ca',
    level: 'INICIAL',
    description: 'Set de figuras con 4 atributos: forma (círculo, cuadrado, triángulo, rectángulo), color, tamaño y grosor.',
    location: 'Salas de Inicial CBA / Rincón de Construcción',
    quantity: 12,
    isReusable: true
  },
  {
    id: 'res-ini-02',
    name: 'Figuras Geométricas de Ensartado y Enhebrado con Cordones',
    category: 'MANIPULATIVO_CONCRETO',
    areaId: 'ini-ca',
    level: 'INICIAL',
    description: 'Piezas plásticas perforadas de colores primarios para desarrollo de motricidad fina y pinza digital.',
    location: 'Salas de Inicial CBA',
    quantity: 15,
    isReusable: true
  },
  {
    id: 'res-ini-03',
    name: 'Témperas Ecológicas Lavables No Tóxicas (Gama Primaria y Secundaria)',
    category: 'ARTISTICO_PLASTICO',
    areaId: 'ini-ap',
    level: 'INICIAL',
    description: 'Pintura dactilar al agua en frascos de 250ml con esponjas y rodillos de espuma para expresión plástica libre.',
    location: 'Taller de Expresión Artística Inicial',
    quantity: 30,
    isReusable: false
  },
  {
    id: 'res-ini-04',
    name: 'Pinceles de Mango Ergonómico Grueso para Primera Infancia',
    category: 'ARTISTICO_PLASTICO',
    areaId: 'ini-ap',
    level: 'INICIAL',
    description: 'Pinceles con cerdas suaves de pelo de cerda natural diseñados para agarre palmar infantil.',
    location: 'Armario de Artes Plásticas Inicial',
    quantity: 45,
    isReusable: true
  },
  {
    id: 'res-ini-05',
    name: 'Títeres de Mano y Dedo de Fieltro con Personajes Culturales',
    category: 'MANIPULATIVO_CONCRETO',
    areaId: 'ini-fp',
    level: 'INICIAL',
    description: 'Conjunto de títeres expresivos para asambleas de diálogo emocional, dramatización y resolución de conflictos.',
    location: 'Rincón de Representar e Imitar CBA',
    quantity: 10,
    isReusable: true
  },
  {
    id: 'res-ini-06',
    name: 'Tapetes Sensoriales de Goma EVA con Texturas y Formas Desmontables',
    category: 'MANIPULATIVO_CONCRETO',
    areaId: 'ini-ca',
    level: 'INICIAL',
    description: 'Tapetes modulares de 30x30cm con números y animales encajables para suelo interactivo.',
    location: 'Salas de 4 y 5 Años CBA',
    quantity: 8,
    isReusable: true
  },

  // --- EDUCACIÓN PRIMARIA (LABORATORIO MATEMÁTICO Y CIENTÍFICO) ---
  {
    id: 'res-pri-01',
    name: 'Regletas de Cuisenaire de Madera (Estuche de 308 Piezas)',
    category: 'MANIPULATIVO_CONCRETO',
    areaId: 'pri-mat',
    level: 'PRIMARIA',
    description: 'Varillas graduadas de 1 a 10cm codificadas por color para descomposición aditiva, múltiplos y fracciones.',
    location: 'Laboratorio de Matemáticas Primaria',
    quantity: 16,
    isReusable: true
  },
  {
    id: 'res-pri-02',
    name: 'Ábacos Verticales Abiertos de Base Diez (5 Columnas)',
    category: 'MANIPULATIVO_CONCRETO',
    areaId: 'pri-mat',
    level: 'PRIMARIA',
    description: 'Ábacos de madera con cuentas plásticas para consolidar unidades, decenas, centenas y unidades de mil.',
    location: 'Aulas de 1ero a 3er Grado CBA',
    quantity: 20,
    isReusable: true
  },
  {
    id: 'res-pri-03',
    name: 'Discos Fraccionarios Magnéticos y Tiras Fraccionarias Singapur',
    category: 'MANIPULATIVO_CONCRETO',
    areaId: 'pri-mat',
    level: 'PRIMARIA',
    description: 'Círculos magnéticos para pizarra interactiva divididos en medios, tercios, cuartos, sextos, octavos y décimos.',
    location: 'Aulas de 4to a 6to Grado CBA',
    quantity: 12,
    isReusable: true
  },
  {
    id: 'res-pri-04',
    name: 'Microscopios Ópticos Escolares Monoculares (Aumento 40x a 400x)',
    category: 'LABORATORIO_CIENTIFICO',
    areaId: 'pri-cna',
    level: 'PRIMARIA',
    description: 'Equipos ópticos con luz LED para observación guiada de células vegetales, epidermis de cebolla y polen.',
    location: 'Laboratorio de Ciencias Naturales CBA',
    quantity: 10,
    isReusable: true
  },
  {
    id: 'res-pri-05',
    name: 'Mapas Murales Físico-Políticos de Venezuela y del Estado Zulia (Escala 1:1.000.000)',
    category: 'BIBLIOGRAFICO_IMPRESO',
    areaId: 'pri-cso',
    level: 'PRIMARIA',
    description: 'Cartografía plastificada de alta resistencia con relieve hidrográfico, cuenca del Lago de Maracaibo y límites.',
    location: 'Aulas de Primaria CBA',
    quantity: 14,
    isReusable: true
  },

  // --- EDUCACIÓN MEDIA GENERAL (CIENCIAS Y EXPERIMENTACIÓN) ---
  {
    id: 'res-med-01',
    name: 'Laptops del Laboratorio con Simuladores GeoGebra y PhET Interactive',
    category: 'DIGITAL_TECNOLOGICO',
    areaId: 'med-mat',
    level: 'MEDIA_GENERAL',
    description: 'Estaciones portátiles con suite completa de cálculo simbólico, geometría analítica y física computacional.',
    location: 'Laboratorio de Computación e Informática CBA',
    quantity: 25,
    isReusable: true
  },
  {
    id: 'res-med-02',
    name: 'Microscopios Biológicos Compuestos Binoculares de 1000x con Luz Halógena',
    category: 'LABORATORIO_CIENTIFICO',
    areaId: 'med-bio',
    level: 'MEDIA_GENERAL',
    description: 'Microscopios con revólver cuádruple (4x, 10x, 40x, 100x de inmersión en aceite) y platina móvil con escala Vernier.',
    location: 'Laboratorio de Biología CBA',
    quantity: 12,
    isReusable: true
  },
  {
    id: 'res-med-03',
    name: 'Material Volumétrico de Vidrio Borosilicato 3.3 (Matraces, Probetas, Vasos y Pipetas)',
    category: 'LABORATORIO_CIENTIFICO',
    areaId: 'med-qui',
    level: 'MEDIA_GENERAL',
    description: 'Set reglamentario para titulación ácido-base, preparación de soluciones molares y destilación fraccionada.',
    location: 'Laboratorio de Química CBA',
    quantity: 30,
    isReusable: true
  },
  {
    id: 'res-med-04',
    name: 'Planos Inclinados de Precisión con Dinamómetros y Pesas Calibradas',
    category: 'LABORATORIO_CIENTIFICO',
    areaId: 'med-fis',
    level: 'MEDIA_GENERAL',
    description: 'Equipos de mecánica clásica para verificación experimental de las Leyes de Newton y coeficiente de roce.',
    location: 'Laboratorio de Física CBA',
    quantity: 8,
    isReusable: true
  },
  {
    id: 'res-med-05',
    name: 'Ejemplares de la Constitución de la República Bolivariana de Venezuela (Edición Oficial)',
    category: 'BIBLIOGRAFICO_IMPRESO',
    areaId: 'med-ghc',
    level: 'MEDIA_GENERAL',
    description: 'Textos de consulta obligatoria para el análisis de derechos ciudadanos, soberanía, geografía y poder público.',
    location: 'Biblioteca General CBA / Aulas de GHC',
    quantity: 35,
    isReusable: true
  }
];

// ==========================================
// --- BANCO OFICIAL DE CRITERIOS DIAGNÓSTICOS CBA ---
// ==========================================

export const INITIAL_DIAGNOSTIC_CRITERIA: DiagnosticCriterion[] = [
  // --- EDUCACIÓN FÍSICA ---
  {
    id: 'crit-ef-01',
    code: 'EF-DIAG-01',
    name: 'Coordinación Dinámica General',
    description: 'Ejecuta carreras con cambios de ritmo y desplazamientos multidireccionales manteniendo el equilibrio corporal.',
    areaId: 'pri-efi',
    level: 'PRIMARIA',
    category: 'Motricidad Gruesa'
  },
  {
    id: 'crit-ef-02',
    code: 'EF-DIAG-02',
    name: 'Coordinación Óculo-Manual y Óculo-Podal',
    description: 'Controla recepciones, botes y lanzamientos de balones hacia objetivos fijos y en movimiento.',
    areaId: 'pri-efi',
    level: 'PRIMARIA',
    category: 'Habilidades Manipulativas'
  },
  {
    id: 'crit-ef-03',
    code: 'EF-DIAG-03',
    name: 'Equilibrio Estático y Dinámico',
    description: 'Mantiene posturas estables sobre superficies reducidas y tras aterrizajes de saltos.',
    areaId: 'pri-efi',
    level: 'PRIMARIA',
    category: 'Capacidades Coordinativas'
  },
  {
    id: 'crit-ef-04',
    code: 'EF-DIAG-04',
    name: 'Resistencia Aeróbica Inicial',
    description: 'Mantiene una cadencia constante en trote continuo durante el test inicial de tiempo sin fatiga extrema.',
    areaId: 'med-efi',
    level: 'MEDIA_GENERAL',
    category: 'Aptitud Física'
  },
  {
    id: 'crit-ef-05',
    code: 'EF-DIAG-05',
    name: 'Seguimiento de Normas y Juego Limpio',
    description: 'Respeta reglas arbitrales, acata orientaciones docentes y demuestra solidaridad con compañeros de equipo.',
    areaId: 'pri-efi',
    level: 'PRIMARIA',
    category: 'Actitudinal y Convivencia'
  },

  // --- EDUCACIÓN INICIAL ---
  {
    id: 'crit-ini-01',
    code: 'INI-DIAG-01',
    name: 'Motricidad Fina y Coordinación Visomotriz',
    description: 'Realiza agarre en pinza trípode, rasgado de papel y ensartado de figuras con precisión progresiva.',
    areaId: 'ini-ap',
    level: 'INICIAL',
    category: 'Desarrollo Psicomotor'
  },
  {
    id: 'crit-ini-02',
    code: 'INI-DIAG-02',
    name: 'Orientación Espacio-Temporal Básica',
    description: 'Identifica nociones espaciales (arriba/abajo, dentro/fuera, cerca/lejos) y secuencias temporales (antes/después).',
    areaId: 'ini-ca',
    level: 'INICIAL',
    category: 'Cognición y Percepción'
  },
  {
    id: 'crit-ini-03',
    code: 'INI-DIAG-03',
    name: 'Comunicación Oral y Expresión de Vivencias',
    description: 'Comunica deseos, ideas y emociones en oraciones comprensibles participando espontáneamente en asamblea.',
    areaId: 'ini-fp',
    level: 'INICIAL',
    category: 'Lenguaje y Comunicación'
  },
  {
    id: 'crit-ini-04',
    code: 'INI-DIAG-04',
    name: 'Adaptación Socioafectiva y Rutinas',
    description: 'Se integra con agrado al aula escolar, interactúa con sus pares y respeta normas de convivencia.',
    areaId: 'ini-fp',
    level: 'INICIAL',
    category: 'Socioemocional'
  },
  {
    id: 'crit-ini-05',
    code: 'INI-DIAG-05',
    name: 'Discriminación de Colores y Formas Primarias',
    description: 'Nombra y clasifica objetos agrupándolos por color (amarillo, azul, rojo) y forma básica (círculo, cuadrado).',
    areaId: 'ini-ca',
    level: 'INICIAL',
    category: 'Procesos Matemáticos'
  },

  // --- PRIMARIA (LENGUA Y MATEMÁTICA) ---
  {
    id: 'crit-pri-len-01',
    code: 'PRI-LEN-01',
    name: 'Fluidez y Decodificación Lectora',
    description: 'Lee textos breves con entonación adecuada, pausas según signos de puntuación y sin vacilaciones fonéticas.',
    areaId: 'pri-len',
    level: 'PRIMARIA',
    category: 'Lectura Comprensiva'
  },
  {
    id: 'crit-pri-len-02',
    code: 'PRI-LEN-02',
    name: 'Comprensión Lectora Literal e Inferencial',
    description: 'Identifica personajes principales, hechos cronológicos y responde preguntas sobre el propósito de la lectura.',
    areaId: 'pri-len',
    level: 'PRIMARIA',
    category: 'Comprensión'
  },
  {
    id: 'crit-pri-len-03',
    code: 'PRI-LEN-03',
    name: 'Caligrafía, Ortografía y Separación de Palabras',
    description: 'Escribe de forma legible con separación de palabras, empleo correcto de mayúsculas y punto final.',
    areaId: 'pri-len',
    level: 'PRIMARIA',
    category: 'Producción Escrita'
  },
  {
    id: 'crit-pri-mat-01',
    code: 'PRI-MAT-01',
    name: 'Lectura y Valor Posicional de Números',
    description: 'Reconoce, escribe y ordena cantidades numéricas identificando unidades, decenas, centenas y miles.',
    areaId: 'pri-mat',
    level: 'PRIMARIA',
    category: 'Aritmética'
  },
  {
    id: 'crit-pri-mat-02',
    code: 'PRI-MAT-02',
    name: 'Operaciones de Adición y Sustracción',
    description: 'Aplica algoritmos de suma y resta con y sin dificultad de reagrupación demostrando agilidad mental.',
    areaId: 'pri-mat',
    level: 'PRIMARIA',
    category: 'Operaciones Básicas'
  },
  {
    id: 'crit-pri-mat-03',
    code: 'PRI-MAT-03',
    name: 'Resolución de Problemas Matemáticos Cotidianos',
    description: 'Extrae datos clave de un enunciado contextualizado, selecciona la operación correcta e interpreta la respuesta.',
    areaId: 'pri-mat',
    level: 'PRIMARIA',
    category: 'Pensamiento Lógico'
  },

  // --- MEDIA GENERAL ---
  {
    id: 'crit-med-mat-01',
    code: 'MED-MAT-01',
    name: 'Jerarquía de Operaciones y Aritmética Numérica',
    description: 'Resuelve expresiones algebraicas combinadas respetando signos de agrupación y propiedades de potencias.',
    areaId: 'med-mat',
    level: 'MEDIA_GENERAL',
    category: 'Cálculo Algebraico'
  },
  {
    id: 'crit-med-mat-02',
    code: 'MED-MAT-02',
    name: 'Despeje y Resolución de Ecuaciones Lineales',
    description: 'Aplica trasposición de términos para despejar incógnitas y verificar soluciones en problemas aplicados.',
    areaId: 'med-mat',
    level: 'MEDIA_GENERAL',
    category: 'Álgebra'
  },
  {
    id: 'crit-med-cie-01',
    code: 'MED-CIE-01',
    name: 'Comprensión de Fenómenos Físico-Químicos',
    description: 'Distingue conceptos fundamentales de materia, energía, movimiento y método científico experimental.',
    areaId: 'med-fis',
    level: 'MEDIA_GENERAL',
    category: 'Ciencias Naturales'
  },
  {
    id: 'crit-med-cie-02',
    code: 'MED-CIE-02',
    name: 'Manejo del Sistema Métrico y Conversión de Unidades',
    description: 'Convierte magnitudes físicas fundamentales (longitud, masa, tiempo) usando factores de conversión correctos.',
    areaId: 'med-fis',
    level: 'MEDIA_GENERAL',
    category: 'Física / Química'
  }
];

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_PLANS_QUINCENAL: PlanQuincenal[] = [];

export const INITIAL_PLANS_LAPSO: PlanLapso[] = [];

export const INITIAL_EVALUATION_RECORDS: EvaluationRecord[] = [];

export const INITIAL_AI_ACTION_PLANS: AIActionPlan[] = [];

export const INITIAL_REMEDIAL_PLANS: RemedialActionPlan[] = [];

export const INITIAL_COUNCIL_MINUTES: CouncilMeetingMinute[] = [];

// ==========================================
// --- GESTIÓN INSTITUCIONAL SICE-CBA ---
// ==========================================

export const INITIAL_PASSES: PassRecord[] = [];

export const INITIAL_DAILY_ATTENDANCE: DailyAttendanceRecord[] = [];

export const INITIAL_ACCUMULATED_ATTENDANCE: SubjectAttendanceAccumulated[] = [];

export const INITIAL_CONDUCTS: ConductEntry[] = [];

export const INITIAL_DOCUMENT_REQUESTS: DocumentRequest[] = [];

export const INITIAL_ADMIN_BLOCKS: AdministrativeBlockEntry[] = [];

export const INITIAL_TITLES: TitleRecord[] = [];

export const INITIAL_SCHOOL_YEAR_CONFIG: SchoolYearConfig = {
  year: '2026-2027',
  isCurrent: true,
  lapsos: [
    {
      lapso: 1,
      name: '1er Lapso (Septiembre - Diciembre 2026)',
      startDate: '2026-09-15',
      endDate: '2026-12-18',
      deadlineDate: '2026-12-18',
      deadlineTime: '23:59',
      autoLockEnabled: true,
      isGradingOpen: true // Regla de negocio: Activo para carga
    },
    {
      lapso: 2,
      name: '2do Lapso (Enero - Marzo 2027)',
      startDate: '2027-01-11',
      endDate: '2027-03-26',
      deadlineDate: '2027-03-26',
      deadlineTime: '23:59',
      autoLockEnabled: true,
      isGradingOpen: false
    },
    {
      lapso: 3,
      name: '3er Lapso (Abril - Julio 2027)',
      startDate: '2027-04-12',
      endDate: '2027-07-09',
      deadlineDate: '2027-07-09',
      deadlineTime: '23:59',
      autoLockEnabled: true,
      isGradingOpen: false
    }
  ]
};

export const INITIAL_COMMUNITY_NOTICES: CommunityNotice[] = [
  {
    id: 'not-01',
    title: '☀️ Conmemoración del Natalicio del General Rafael Urdaneta y Orgullo Marabino',
    content: 'La Comunidad Educativa Bellas Artes rinde tributo de admiración al General en Jefe Rafael Urdaneta ("El Brillante"), prócer insigne de Maracaibo, ejemplo perenne de lealtad, honradez y patriotismo. Invitamos a las muestras cívicas y declamaciones en el auditorio.',
    date: '24-10-2026',
    type: 'EVENTO',
    targetAudience: 'TODOS',
    theme: 'ZULIANIDAD',
    author: 'Comisión de Cultura y Zulianidad CBA',
    pinned: true
  },
  {
    id: 'not-02',
    title: 'Apertura Formal del Año Escolar 2026-2027 y Nuevos Laboratorios STEAM',
    content: 'La Junta Directiva y la Dirección General del Colegio Bellas Artes dan la más cordial bienvenida a toda la comunidad estudiantil. Anunciamos la inauguración de las nuevas estaciones de robótica educativa y diseño creativo.',
    date: '16-09-2026',
    type: 'NOTICIA',
    targetAudience: 'TODOS',
    theme: 'ANIVERSARIO_CBA',
    author: 'Dirección General CBA',
    pinned: false
  },
  {
    id: 'not-03',
    title: '🇻🇪 Jornada Cívica Escolar: Conmemoración de las Efemérides Patrias de Venezuela',
    content: 'Con motivo de las fechas magnas de nuestra historia republicana, los estudiantes de Primaria y Media General presentarán periódicos murales y biografías sobre el Ideario de Simón Bolívar y Simón Rodríguez.',
    date: '18-09-2026',
    type: 'EVENTO',
    targetAudience: 'TODOS',
    theme: 'PATRIO_VENEZUELA',
    author: 'Coordinación de Ciencias Sociales CBA',
    pinned: false
  },
  {
    id: 'not-04',
    title: '🌍 Jornada Mundial de la Educación y la Ciencia para el Desarrollo Sostenible (UNESCO)',
    content: 'Nos sumamos al llamado global de la UNESCO para promover una educación de calidad, inclusiva y con enfoque científico transformador en nuestras aulas, laboratorios y proyectos robóticos.',
    date: '20-09-2026',
    type: 'NOTICIA',
    targetAudience: 'TODOS',
    theme: 'GLOBAL_MUNDIAL',
    author: 'Unidad de Control y Evaluación (UCE)',
    pinned: false
  },
  {
    id: 'not-05',
    title: 'Cronograma Oficial de Entrega de Planificaciones Quincenales a Coordinación',
    content: 'Se recuerda al personal docente de Inicial, Primaria y Media General que la fecha límite para consignar el modelo de planificación a revisión del primer corte es este viernes 25 de septiembre.',
    date: '17-09-2026',
    type: 'ANUNCIO_URGENTE',
    targetAudience: 'DOCENTES',
    theme: 'ESTANDAR',
    author: 'Unidad de Control y Evaluación (UCE)',
    pinned: false
  },
  {
    id: 'not-06',
    title: 'Reunión General de Padres y Representantes: Inducción a la Plataforma CBA',
    content: 'Invitamos a todas las familias este jueves 24 a las 5:00 PM en el Auditorio del plantel para la presentación de los módulos interactivos de consulta y seguimiento.',
    date: '15-09-2026',
    type: 'EVENTO',
    targetAudience: 'REPRESENTANTES',
    theme: 'ESTANDAR',
    author: 'Comité de Padres y Familias',
    pinned: false
  }
];

export const INITIAL_BIRTHDAYS: BirthdayPerson[] = [];

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr-admin',
    username: 'admin',
    password: 'cba2026*admin',
    fullName: 'Administrador General de Sistemas',
    email: 'admin@bellasartes.edu.ve',
    role: 'ADMINISTRADOR',
    defaultLevel: 'MEDIA_GENERAL',
    gender: 'MASCULINO',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  }
];

export const INITIAL_USER_SCHEDULES: UserSchedule[] = [
  {
    userId: 'usr-admin',
    userRole: 'ADMINISTRADOR',
    schoolYear: '2026 - 2027',
    blocks: []
  },
  {
    userId: 'usr-doc-ciencias',
    userRole: 'DOCENTE',
    schoolYear: '2026 - 2027',
    blocks: []
  }
];

export const INITIAL_SCHOOL_DATA: InstitutionalSchoolData = {
  id: 'cba_school_data_v1',
  nombre: 'U.E. Colegio Belén San Juan (SISCEBA)',
  dea: 'OD-05241503',
  rif: 'J-31456789-0',
  circuito: 'Circuito Escolar 05 - Parroquia El Carmen',
  distrito: 'Distrito Escolar Nº 02',
  direccion: 'Av. Las Delicias, Sector Sabana Grande, Barinas, Edo. Barinas',
  telefono: '+58 (0273) 552-1489 / +58 (0414) 555-0199',
  correo: 'administracion@colegiobelensanjuan.edu.ve',
  director: 'Prof. Carlos R. Méndez P.',
  subdirector: 'Lic. Mayuli G. Silva M.'
};

export const INITIAL_SYSTEM_CATALOGS: SystemCatalogs = {
  id: 'cba_catalogs_v1',
  parentescos: [
    'MADRE',
    'PADRE',
    'TUTOR LEGAL',
    'ABUELO / ABUELA',
    'TÍO / TÍA',
    'HERMANO / HERMANA MAYOR',
    'PADRASTRO / MADRASTRA',
    'OTRO FAMILIAR'
  ],
  profesiones: [
    'DOCENTE / PROFESOR(A)',
    'INGENIERO(A)',
    'MÉDICO(A) / CIRUJANO(A)',
    'ENFERMERO(A)',
    'LICENCIADO(A) EN ADMINISTRACIÓN',
    'CONTADOR(A) PÚBLICO(A)',
    'ABOGADO(A)',
    'COMERCIANTE / EMPRESARIO(A)',
    'TÉCNICO(A) EN COMPUTACIÓN / SISTEMAS',
    'ELECTRICISTA',
    'MECÁNICO(A)',
    'CHEF / GASTRONOMÍA',
    'MILITAR / POLICÍA',
    'OFICIOS DEL HOGAR',
    'OTRA PROFESIÓN U OFICIO'
  ],
  vacunas: [
    'BCG (Tuberculosis)',
    'Hepatitis B Pediátrica',
    'Polio (IPV / OPV)',
    'Pentavalente (DTP + Hib + Hep B)',
    'Antirrotavirus',
    'Trivalente Viral (SRP: Sarampión, Rubéola, Parotiditis)',
    'Fiebre Amarilla'
  ],
  serviciosMedicos: [
    'SEGURO ESCOLAR INSTITUCIONAL',
    'IVSS (Instituto Venezolano de los Seguros Sociales)',
    'IPASME (Personal Docente y Administrativo)',
    'CENTRO DE SALUD / CDI LOCAL',
    'SEGURO PRIVADO FAMILIAR'
  ],
  titulosAcademicos: [
    'Bachiller en Ciencias',
    'Licenciado(a) en Educación',
    'Profesor(a) de Educación Media',
    'Técnico Superior Universitario (TSU)',
    'Magíster Scientiarum / Postgrado',
    'Doctor(a) en Educación / Ciencias'
  ]
};

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'log-1', evento: 'Inicio de Sesión Exitoso', usuario: 'admin', rol: 'ADMINISTRADOR', fecha: 'Hoy, Hace un momento', ip: '192.168.1.102' },
  { id: 'log-2', evento: 'Sincronización Cloud Supabase', usuario: 'sistema', rol: 'SISTEMA', fecha: 'Hoy, 10:45 AM', ip: 'Localhost' },
  { id: 'log-3', evento: 'Actualización Perfil Docente', usuario: 'contma', rol: 'DOCENTE', fecha: 'Hoy, 09:30 AM', ip: '192.168.1.115' },
  { id: 'log-4', evento: 'Apertura de Ventana Evaluativa Lapso 1', usuario: 'admin', rol: 'ADMINISTRADOR', fecha: 'Ayer, 04:15 PM', ip: '192.168.1.102' }
];

export const INITIAL_SCHEDULE_TYPES: ScheduleTypeConfig[] = [
  {
    id: 'hor-diurno-reg',
    codigo: 'HOR-DIURNO',
    nombre: 'Horario Diurno Regular (Media General)',
    descripcion: 'Jornada escolar de 8 bloques académicos de 45 minutos con receso de 30 minutos.',
    horaInicio: '07:00',
    horaFin: '13:30',
    duracionBloqueMinutos: 45,
    totalBloques: 8,
    nivelesAplicables: ['MEDIA_GENERAL'],
    activo: true
  },
  {
    id: 'hor-manana-pri',
    codigo: 'HOR-PRIM-INI',
    nombre: 'Horario Integral (Inicial y Primaria)',
    descripcion: 'Jornada continua matutina con actividades pedagógicas guiadas y recreo estructurado.',
    horaInicio: '07:00',
    horaFin: '12:15',
    duracionBloqueMinutos: 45,
    totalBloques: 6,
    nivelesAplicables: ['INICIAL', 'PRIMARIA'],
    activo: true
  }
];

export const INITIAL_CRP_TALLERES: CRPTaller[] = [
  {
    id: 'crp-robotica-maker',
    code: 'CRP-01',
    nombre: 'Robótica Aplicada & Cultura Maker',
    area: 'Ciencia y Tecnología',
    docenteResponsable: 'Prof. Carlos Mendoza',
    docenteId: 'usr-carlos',
    maxCupos: 22,
    horario: 'Jueves 10:15 - 11:45',
    aulaEspacio: 'Laboratorio STEAM / Maker Space',
    descripcion: 'Diseño, prototipado de circuitos electrónicos, programación con microcontroladores e impresión 3D.',
    nivelEducativo: 'MEDIA_GENERAL',
    gradosPermitidos: ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'],
    activo: true
  },
  {
    id: 'crp-artes-escenicas',
    code: 'CRP-02',
    nombre: 'Teatro, Expresión Corporal y Oratoria',
    area: 'Artes Escénicas',
    docenteResponsable: 'Lic. Mariana Gómez',
    docenteId: 'usr-mariana',
    maxCupos: 25,
    horario: 'Viernes 08:30 - 10:00',
    aulaEspacio: 'Auditorio Institucional Bellas Artes',
    descripcion: 'Dramaturgia, improvisación, técnicas de proyección vocal, manejo escénico y montaje de piezas teatrales.',
    nivelEducativo: 'MEDIA_GENERAL',
    gradosPermitidos: ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'],
    activo: true
  },
  {
    id: 'crp-ensamble-musical',
    code: 'CRP-03',
    nombre: 'Ensamble de Música Experimental y Tradicional',
    area: 'Música y Folclore',
    docenteResponsable: 'Prof. Pedro Ramírez',
    docenteId: 'usr-pedro',
    maxCupos: 20,
    horario: 'Miércoles 11:00 - 12:30',
    aulaEspacio: 'Sala de Música & Acústica',
    descripcion: 'Ejecución de cuatro venezolano, percusión afrocaribeña, teclado, guitarra y arreglos polifónicos colectivos.',
    nivelEducativo: 'MEDIA_GENERAL',
    gradosPermitidos: ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'],
    activo: true
  },
  {
    id: 'crp-produccion-audiovisual',
    code: 'CRP-04',
    nombre: 'Creación de Medios Digitales y Producción Audiovisual',
    area: 'Comunicación Digital',
    docenteResponsable: 'Lic. Mayuli Silva',
    docenteId: 'usr-mayuli',
    maxCupos: 24,
    horario: 'Martes 09:15 - 10:45',
    aulaEspacio: 'Estudio de Medios & Edición Digital',
    descripcion: 'Producción de podcasts escolares, fotografía narrativa, edición digital de video y periodismo estudiantil.',
    nivelEducativo: 'MEDIA_GENERAL',
    gradosPermitidos: ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'],
    activo: true
  },
  {
    id: 'crp-huerto-agroecologia',
    code: 'CRP-05',
    nombre: 'Agroecología Escolar y Botánica Sustentable',
    area: 'Sustentabilidad y Producción',
    docenteResponsable: 'Ing. Elena Rivas',
    docenteId: 'usr-elena',
    maxCupos: 25,
    horario: 'Lunes 10:15 - 11:45',
    aulaEspacio: 'Huerto Hidropónico y Vivero Bellas Artes',
    descripcion: 'Siembra agroecológica, compostaje orgánico, sistemas de riego tecnificado y preservación ambiental.',
    nivelEducativo: 'MEDIA_GENERAL',
    gradosPermitidos: ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'],
    activo: true
  }
];

export const INITIAL_CRP_INSCRITOS: CRPEstudianteInscrito[] = [];


