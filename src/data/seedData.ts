import {
  SubjectArea,
  Competency,
  Indicator,
  Strategy,
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
  ScheduleTypeConfig
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
    name: 'Componentes del ambiente',
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
    id: 'comp-ini-3',
    areaId: 'ini-inf',
    code: 'CP-INI-03',
    title: 'Lógica Computacional y Robótica Inicial',
    description: 'Identifica secuencias algorítmicas mediante comandos espaciales básicos y reconoce los componentes de los kits de construcción lúdica.',
    level: 'INICIAL',
    lapso: 1
  },
  // Primaria
  {
    id: 'comp-pri-1',
    areaId: 'pri-len',
    code: 'CP-PRI-01',
    title: 'Producción de Textos Narrativos e Informativos',
    description: 'Redacta composiciones escritas coherentes aplicando normas ortográficas, signos de puntuación y vocabulario enriquecido.',
    level: 'PRIMARIA',
    lapso: 1
  },
  {
    id: 'comp-pri-2',
    areaId: 'pri-mat',
    code: 'CP-PRI-02',
    title: 'Resolución de Problemas con Números Naturales y Fracciones',
    description: 'Aplica algoritmos de cálculo mental y escrito en situaciones problemáticas contextualizadas con fracciones y números decimales.',
    level: 'PRIMARIA',
    lapso: 1
  },
  {
    id: 'comp-pri-3',
    areaId: 'pri-rob',
    code: 'CP-PRI-03',
    title: 'Mecanismos y Programación por Bloques',
    description: 'Diseña y programa prototipos móviles utilizando engranajes simples, sensores de proximidad y bucles de control en Scratch.',
    level: 'PRIMARIA',
    lapso: 1
  },
  {
    id: 'comp-pri-4',
    areaId: 'pri-cn',
    code: 'CP-PRI-04',
    title: 'Indagación Científica y Biodiversidad Regional',
    description: 'Explora procesos biológicos y ecológicos de la región zuliana mediante el método científico experimental.',
    level: 'PRIMARIA',
    lapso: 1
  },
  {
    id: 'comp-pri-5',
    areaId: 'pri-cs',
    code: 'CP-PRI-05',
    title: 'Identidad Histórica y Participación Ciudadana',
    description: 'Analiza hechos históricos de Venezuela, valores cívicos republicanos y la evolución social y cultural de la comunidad.',
    level: 'PRIMARIA',
    lapso: 1
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
  {
    id: 'ind-ini-301',
    competencyId: 'comp-ini-3',
    areaId: 'ini-inf',
    code: 'IND-INI-3.1',
    description: 'Guía un robot de suelo (Bee-Bot) mediante comandos de dirección cardinal para completar un circuito simple.',
    level: 'INICIAL',
    lapso: 1,
    evaluationInstrument: 'Rúbrica Lúdica de Robótica'
  },
  // Primaria
  {
    id: 'ind-pri-101',
    competencyId: 'comp-pri-1',
    areaId: 'pri-len',
    code: 'IND-PRI-1.1',
    description: 'Escribe cuentos cortos respetando la estructura inicio-nudo-desenlace con adecuada concordancia de género y número.',
    level: 'PRIMARIA',
    lapso: 1,
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
      isGradingOpen: true // Regla de negocio: Activo para carga
    },
    {
      lapso: 2,
      name: '2do Lapso (Enero - Marzo 2027)',
      startDate: '2027-01-11',
      endDate: '2027-03-26',
      isGradingOpen: false
    },
    {
      lapso: 3,
      name: '3er Lapso (Abril - Julio 2027)',
      startDate: '2027-04-12',
      endDate: '2027-07-09',
      isGradingOpen: false
    }
  ]
};

export const INITIAL_COMMUNITY_NOTICES: CommunityNotice[] = [
  {
    id: 'not-01',
    title: 'Apertura Formal del Año Escolar 2026-2027 y Nuevos Laboratorios STEAM',
    content: 'La Junta Directiva y la Dirección General del Colegio Bellas Artes dan la más cordial bienvenida a toda la comunidad estudiantil. Anunciamos la inauguración de las nuevas estaciones de robótica educativa y diseño creativo.',
    date: '16-09-2026',
    type: 'NOTICIA',
    targetAudience: 'TODOS',
    author: 'Dirección General CBA',
    pinned: true
  },
  {
    id: 'not-02',
    title: 'Cronograma Oficial de Entrega de Planificaciones Quincenales a Coordinación',
    content: 'Se recuerda al personal docente de Inicial, Primaria y Media General que la fecha límite para consignar el modelo de planificación a revisión del primer corte es este viernes 25 de septiembre.',
    date: '17-09-2026',
    type: 'ANUNCIO_URGENTE',
    targetAudience: 'DOCENTES',
    author: 'Unidad de Control y Evaluación (UCE)'
  },
  {
    id: 'not-03',
    title: 'Reunión General de Padres y Representantes: Inducción a la Plataforma CBA',
    content: 'Invitamos a todas las familias este jueves 24 a las 5:00 PM en el Auditorio del plantel para la presentación de los módulos interactivos de consulta y seguimiento.',
    date: '15-09-2026',
    type: 'EVENTO',
    targetAudience: 'REPRESENTANTES',
    author: 'Comité de Padres y Familias'
  }
];

export const INITIAL_BIRTHDAYS: BirthdayPerson[] = [];

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr-admin',
    username: 'admin',
    password: 'cba2026*admin',
    fullName: 'Administrador',
    email: 'admin@bellasartes.edu.ve',
    role: 'ADMINISTRADOR',
    defaultLevel: 'MEDIA_GENERAL',
    gender: 'MASCULINO',
    active: true,
    avatarUrl: SVG_MALE_CYAN
  },
  {
    id: 'usr-director',
    username: 'director',
    password: 'cba2026*director',
    fullName: 'Prof. Director General CBA',
    email: 'director@bellasartes.edu.ve',
    role: 'DIRECTOR',
    defaultLevel: 'MEDIA_GENERAL',
    gender: 'MASCULINO',
    active: true,
    avatarUrl: SVG_MALE_ORANGE
  },
  {
    id: 'usr-coordinador',
    username: 'coordinador',
    password: 'cba2026*coordinador',
    fullName: 'Lic. Coordinación Control de Estudios (UCE)',
    email: 'coordinacion@bellasartes.edu.ve',
    role: 'COORDINACION',
    defaultLevel: 'MEDIA_GENERAL',
    gender: 'FEMENINO',
    active: true,
    avatarUrl: SVG_FEMALE_CIRCLE_TEAL
  },
  {
    id: 'usr-asistente',
    username: 'asistente',
    password: 'cba2026*asistente',
    fullName: 'Lic. Asistente de Asistencia y Disciplina',
    email: 'asistente@bellasartes.edu.ve',
    role: 'ASISTENTE',
    defaultLevel: 'MEDIA_GENERAL',
    gender: 'FEMENINO',
    active: true,
    avatarUrl: SVG_FEMALE_ORANGE
  },
  {
    id: 'usr-secretaria',
    username: 'secretaria',
    password: 'cba2026*secretaria',
    fullName: 'Secretaría de Control de Estudios (UCE)',
    email: 'secretaria@bellasartes.edu.ve',
    role: 'SECRETARIA',
    defaultLevel: 'MEDIA_GENERAL',
    gender: 'FEMENINO',
    active: true,
    avatarUrl: SVG_FEMALE_CIRCLE_TEAL
  }
];

export const INITIAL_USER_SCHEDULES: UserSchedule[] = [
  {
    userId: 'usr-admin',
    userRole: 'ADMINISTRADOR',
    schoolYear: '2026 - 2027',
    blocks: [
      { id: 'sch-adm-1', day: 'LUNES', periodIndex: 1, startTime: '07:00', endTime: '07:45', subjectName: 'Auditoría & Seguridad de Sistemas', level: 'MEDIA_GENERAL', gradeSection: 'Sede Central', classroom: 'Sala de Servidores', color: 'sky' },
      { id: 'sch-adm-2', day: 'LUNES', periodIndex: 2, startTime: '07:45', endTime: '08:30', subjectName: 'Monitoreo de Infraestructura y BD', level: 'MEDIA_GENERAL', gradeSection: 'Sede Central', classroom: 'Sala de Servidores', color: 'sky' },
      { id: 'sch-adm-3', day: 'MARTES', periodIndex: 3, startTime: '08:45', endTime: '09:30', subjectName: 'Respaldo y Mantenimiento Cloud', level: 'MEDIA_GENERAL', gradeSection: 'Plantel CBA', classroom: 'Dirección de TI', color: 'indigo' },
      { id: 'sch-adm-4', day: 'MIERCOLES', periodIndex: 2, startTime: '07:45', endTime: '08:30', subjectName: 'Configuración y Asignación de Roles', level: 'MEDIA_GENERAL', gradeSection: 'Plantel CBA', classroom: 'Dirección de TI', color: 'violet' },
      { id: 'sch-adm-5', day: 'JUEVES', periodIndex: 4, startTime: '09:30', endTime: '10:15', subjectName: 'Soporte Técnico Docente', level: 'MEDIA_GENERAL', gradeSection: 'Plantel CBA', classroom: 'Salas de Computación', color: 'emerald' },
      { id: 'sch-adm-6', day: 'VIERNES', periodIndex: 5, startTime: '10:30', endTime: '11:15', subjectName: 'Cierre de Auditoría Semanal', level: 'MEDIA_GENERAL', gradeSection: 'Sede Central', classroom: 'Dirección de TI', color: 'amber' }
    ]
  },
  {
    userId: 'usr-doc-ciencias',
    userRole: 'DOCENTE',
    schoolYear: '2026 - 2027',
    blocks: [
      { id: 'sch-doc-1', day: 'LUNES', periodIndex: 1, startTime: '07:00', endTime: '07:45', subjectName: 'Física', level: 'MEDIA_GENERAL', gradeSection: '4to Año A', classroom: 'Laboratorio de Ciencias 1', color: 'blue' },
      { id: 'sch-doc-2', day: 'LUNES', periodIndex: 2, startTime: '07:45', endTime: '08:30', subjectName: 'Física', level: 'MEDIA_GENERAL', gradeSection: '4to Año A', classroom: 'Laboratorio de Ciencias 1', color: 'blue' },
      { id: 'sch-doc-3', day: 'LUNES', periodIndex: 4, startTime: '09:30', endTime: '10:15', subjectName: 'Química', level: 'MEDIA_GENERAL', gradeSection: '3er Año B', classroom: 'Aula 12', color: 'emerald' },
      { id: 'sch-doc-4', day: 'MARTES', periodIndex: 2, startTime: '07:45', endTime: '08:30', subjectName: 'Física Teórica', level: 'MEDIA_GENERAL', gradeSection: '5to Año A', classroom: 'Aula 15', color: 'indigo' },
      { id: 'sch-doc-5', day: 'MARTES', periodIndex: 3, startTime: '08:45', endTime: '09:30', subjectName: 'Física Práctica', level: 'MEDIA_GENERAL', gradeSection: '5to Año A', classroom: 'Laboratorio de Física', color: 'indigo' },
      { id: 'sch-doc-6', day: 'MIERCOLES', periodIndex: 1, startTime: '07:00', endTime: '07:45', subjectName: 'Ciencias Naturales', level: 'PRIMARIA', gradeSection: '6to Grado A', classroom: 'Aula 8', color: 'amber' },
      { id: 'sch-doc-7', day: 'MIERCOLES', periodIndex: 2, startTime: '07:45', endTime: '08:30', subjectName: 'Ciencias Naturales', level: 'PRIMARIA', gradeSection: '6to Grado A', classroom: 'Aula 8', color: 'amber' },
      { id: 'sch-doc-8', day: 'JUEVES', periodIndex: 3, startTime: '08:45', endTime: '09:30', subjectName: 'Química Orgánica', level: 'MEDIA_GENERAL', gradeSection: '5to Año B', classroom: 'Laboratorio de Química', color: 'purple' },
      { id: 'sch-doc-9', day: 'JUEVES', periodIndex: 4, startTime: '09:30', endTime: '10:15', subjectName: 'Química Orgánica', level: 'MEDIA_GENERAL', gradeSection: '5to Año B', classroom: 'Laboratorio de Química', color: 'purple' },
      { id: 'sch-doc-10', day: 'VIERNES', periodIndex: 2, startTime: '07:45', endTime: '08:30', subjectName: 'Tutoría Académica y Planificación', level: 'MEDIA_GENERAL', gradeSection: '4to Año A', classroom: 'Sala de Profesores', color: 'teal' }
    ]
  },
  {
    userId: 'usr-director',
    userRole: 'DIRECTOR',
    schoolYear: '2026 - 2027',
    blocks: [
      { id: 'sch-dir-1', day: 'LUNES', periodIndex: 1, startTime: '07:00', endTime: '07:45', subjectName: 'Reunión Directiva y Acto Cívico', level: 'MEDIA_GENERAL', gradeSection: 'Plantel CBA', classroom: 'Patio Central', color: 'amber' },
      { id: 'sch-dir-2', day: 'MARTES', periodIndex: 3, startTime: '08:45', endTime: '09:30', subjectName: 'Atención a Padres y Representantes', level: 'MEDIA_GENERAL', gradeSection: 'Comunidad CBA', classroom: 'Dirección General', color: 'blue' },
      { id: 'sch-dir-3', day: 'MIERCOLES', periodIndex: 4, startTime: '09:30', endTime: '10:15', subjectName: 'Supervisión Pedagógica', level: 'PRIMARIA', gradeSection: 'Pabellón Primaria', classroom: 'Aulas 1-6', color: 'emerald' },
      { id: 'sch-dir-4', day: 'JUEVES', periodIndex: 3, startTime: '08:45', endTime: '09:30', subjectName: 'Supervisión de Evaluación y Control', level: 'MEDIA_GENERAL', gradeSection: 'Control de Estudios', classroom: 'Oficina UCE', color: 'indigo' },
      { id: 'sch-dir-5', day: 'VIERNES', periodIndex: 5, startTime: '10:30', endTime: '11:15', subjectName: 'Consejo Técnico Docente', level: 'MEDIA_GENERAL', gradeSection: 'Cuerpo Docente', classroom: 'Auditorio CBA', color: 'violet' }
    ]
  },
  {
    userId: 'usr-asistente',
    userRole: 'ASISTENTE',
    schoolYear: '2026 - 2027',
    blocks: [
      { id: 'sch-ast-1', day: 'LUNES', periodIndex: 1, startTime: '07:00', endTime: '07:45', subjectName: 'Control de Acceso y Pases por Retraso', level: 'MEDIA_GENERAL', gradeSection: 'Todos los niveles', classroom: 'Portería / Entrada Principal', color: 'rose' },
      { id: 'sch-ast-2', day: 'LUNES', periodIndex: 2, startTime: '07:45', endTime: '08:30', subjectName: 'Toma de Inasistencias en Aulas', level: 'MEDIA_GENERAL', gradeSection: 'Media General', classroom: 'Pasillos 1er y 2do Piso', color: 'amber' },
      { id: 'sch-ast-3', day: 'MARTES', periodIndex: 1, startTime: '07:00', endTime: '07:45', subjectName: 'Control de Acceso y Pases por Retraso', level: 'MEDIA_GENERAL', gradeSection: 'Todos los niveles', classroom: 'Portería / Entrada Principal', color: 'rose' },
      { id: 'sch-ast-4', day: 'MARTES', periodIndex: 4, startTime: '09:30', endTime: '10:15', subjectName: 'Ronda de Convivencia y Disciplina', level: 'MEDIA_GENERAL', gradeSection: 'Canchas y Recreo', classroom: 'Áreas Comunes', color: 'emerald' },
      { id: 'sch-ast-5', day: 'MIERCOLES', periodIndex: 1, startTime: '07:00', endTime: '07:45', subjectName: 'Control de Acceso y Pases por Retraso', level: 'MEDIA_GENERAL', gradeSection: 'Todos los niveles', classroom: 'Portería / Entrada Principal', color: 'rose' },
      { id: 'sch-ast-6', day: 'JUEVES', periodIndex: 1, startTime: '07:00', endTime: '07:45', subjectName: 'Control de Acceso y Pases por Retraso', level: 'MEDIA_GENERAL', gradeSection: 'Todos los niveles', classroom: 'Portería / Entrada Principal', color: 'rose' },
      { id: 'sch-ast-7', day: 'VIERNES', periodIndex: 1, startTime: '07:00', endTime: '07:45', subjectName: 'Control de Acceso y Pases por Retraso', level: 'MEDIA_GENERAL', gradeSection: 'Todos los niveles', classroom: 'Portería / Entrada Principal', color: 'rose' }
    ]
  },
  {
    userId: 'usr-secretaria',
    userRole: 'SECRETARIA',
    schoolYear: '2026 - 2027',
    blocks: [
      { id: 'sch-sec-1', day: 'LUNES', periodIndex: 1, startTime: '07:00', endTime: '07:45', subjectName: 'Recepción y Trámites de Constancias', level: 'MEDIA_GENERAL', gradeSection: 'Secretaría UCE', classroom: 'Ventanilla 1', color: 'indigo' },
      { id: 'sch-sec-2', day: 'MARTES', periodIndex: 2, startTime: '07:45', endTime: '08:30', subjectName: 'Actualización de Padrón y Expedientes', level: 'MEDIA_GENERAL', gradeSection: 'Secretaría UCE', classroom: 'Archivo Central', color: 'blue' },
      { id: 'sch-sec-3', day: 'MIERCOLES', periodIndex: 3, startTime: '08:45', endTime: '09:30', subjectName: 'Emisión de Notas Certificadas y Títulos', level: 'MEDIA_GENERAL', gradeSection: 'Secretaría UCE', classroom: 'Ventanilla 2', color: 'teal' },
      { id: 'sch-sec-4', day: 'JUEVES', periodIndex: 2, startTime: '07:45', endTime: '08:30', subjectName: 'Gestión de Inscripciones y Prosecución', level: 'MEDIA_GENERAL', gradeSection: 'Secretaría UCE', classroom: 'Ventanilla 1', color: 'sky' },
      { id: 'sch-sec-5', day: 'VIERNES', periodIndex: 4, startTime: '09:30', endTime: '10:15', subjectName: 'Auditoría de Documentos Pendientes', level: 'MEDIA_GENERAL', gradeSection: 'Secretaría UCE', classroom: 'Archivo Central', color: 'violet' }
    ]
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


