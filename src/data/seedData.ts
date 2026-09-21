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
  AppUser
} from '../types';

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

export const INITIAL_STUDENTS: Student[] = [
  // Inicial - Sala de 5 Años "A"
  {
    id: 'stu-ini-1',
    cedula: 'V-36.120.401',
    fullName: 'Sofía Valentina Morales Rincón',
    gender: 'F',
    birthDate: '2021-04-12',
    level: 'INICIAL',
    grade: 'Sala de 5 Años',
    section: 'A',
    representativeName: 'Mariana Rincón de Morales',
    representativeEmail: 'mariana.rincon@gmail.com',
    representativePhone: '+58 414-6123456',
    status: 'REGULAR',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'stu-ini-2',
    cedula: 'V-36.120.402',
    fullName: 'Santiago Andrés Padrón Castillo',
    gender: 'M',
    birthDate: '2021-07-25',
    level: 'INICIAL',
    grade: 'Sala de 5 Años',
    section: 'A',
    representativeName: 'Carlos Padrón',
    representativeEmail: 'cpadron@bellasartes.edu.ve',
    representativePhone: '+58 424-7654321',
    status: 'REGULAR',
    avatarUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'stu-ini-3',
    cedula: 'V-36.120.403',
    fullName: 'Lucas Daniel Villalobos Nava',
    gender: 'M',
    birthDate: '2021-09-03',
    level: 'INICIAL',
    grade: 'Sala de 5 Años',
    section: 'A',
    representativeName: 'Daniel Villalobos',
    representativeEmail: 'dvillalobos@gmail.com',
    representativePhone: '+58 412-9871234',
    status: 'EN_REVISION',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },

  // Primaria - 5to Grado "A"
  {
    id: 'stu-pri-1',
    cedula: 'V-34.981.201',
    fullName: 'Camila Victoria Hernández Ochoa',
    gender: 'F',
    birthDate: '2016-02-18',
    level: 'PRIMARIA',
    grade: '5to Grado',
    section: 'A',
    representativeName: 'Patricia Ochoa',
    representativeEmail: 'pochoa@gmail.com',
    representativePhone: '+58 414-7221133',
    status: 'REGULAR',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'stu-pri-2',
    cedula: 'V-34.981.202',
    fullName: 'Alejandro José Urdaneta Silva',
    gender: 'M',
    birthDate: '2015-11-30',
    level: 'PRIMARIA',
    grade: '5to Grado',
    section: 'A',
    representativeName: 'Roberto Urdaneta',
    representativeEmail: 'rurdaneta@gmail.com',
    representativePhone: '+58 416-5544332',
    status: 'REGULAR',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'stu-pri-3',
    cedula: 'V-34.981.203',
    fullName: 'Isabella Cristina Finol Boscán',
    gender: 'F',
    birthDate: '2016-06-14',
    level: 'PRIMARIA',
    grade: '5to Grado',
    section: 'A',
    representativeName: 'Gabriela Boscán',
    representativeEmail: 'gboscan@gmail.com',
    representativePhone: '+58 424-6332211',
    status: 'EN_REVISION',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },

  // Media General - 4to Año "A"
  {
    id: 'stu-med-1',
    cedula: 'V-31.450.812',
    fullName: 'Gabriel Eduardo Montiel Pirela',
    gender: 'M',
    birthDate: '2010-03-09',
    level: 'MEDIA_GENERAL',
    grade: '4to Año',
    section: 'A',
    representativeName: 'Eduardo Montiel',
    representativeEmail: 'emontiel@bellasartes.edu.ve',
    representativePhone: '+58 414-6819200',
    status: 'REGULAR',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'stu-med-2',
    cedula: 'V-31.450.813',
    fullName: 'Valeria Nicole Barboza Ferrer',
    gender: 'F',
    birthDate: '2010-08-22',
    level: 'MEDIA_GENERAL',
    grade: '4to Año',
    section: 'A',
    representativeName: 'Elena Ferrer',
    representativeEmail: 'eferrer@hotmail.com',
    representativePhone: '+58 424-6102938',
    status: 'REGULAR',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'stu-med-3',
    cedula: 'V-31.450.814',
    fullName: 'Mateo Sebastián Chacín Portillo',
    gender: 'M',
    birthDate: '2009-12-05',
    level: 'MEDIA_GENERAL',
    grade: '4to Año',
    section: 'A',
    representativeName: 'Carmen Portillo',
    representativeEmail: 'cportillo@gmail.com',
    representativePhone: '+58 412-5551234',
    status: 'EN_REVISION', // Estudiante con materias bajas para probar flujo remedial IA
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'stu-med-4',
    cedula: 'V-30.882.119',
    fullName: 'Sebastián Alejandro Romero Leal',
    gender: 'M',
    birthDate: '2009-05-19',
    level: 'MEDIA_GENERAL',
    grade: '4to Año',
    section: 'A',
    representativeName: 'Ana Leal de Romero',
    representativeEmail: 'analeal@gmail.com',
    representativePhone: '+58 416-8901234',
    status: 'MATERIA_PENDIENTE', // Materia pendiente de 3er año para probar Plan de Acción Remedial
    pendingSubjects: ['Física (3er Año)', 'Matemáticas (3er Año)'],
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PLANS_QUINCENAL: PlanQuincenal[] = [
  {
    id: 'pq-ini-1',
    areaId: 'ini-fp',
    level: 'INICIAL',
    gradeSection: 'Sala de 5 Años A',
    lapso: 1,
    startDate: '2026-10-01',
    endDate: '2026-10-15',
    title: 'Mis Emociones y la Convivencia en el Colegio',
    projectTheme: 'Conociendo mis talentos y a mis nuevos amigos',
    status: 'DEFINITIVO',
    competencyIds: ['comp-ini-1'],
    indicatorIds: ['ind-ini-101', 'ind-ini-102'],
    teachingStrategyIds: ['strat-ens-1'],
    evaluationStrategyIds: ['strat-eval-1'],
    pedagogicalActivities: '1. Rueda de bienvenida con espejo de emociones.\n2. Cuentacuentos: "El monstruo de colores".\n3. Juegos de roles para compartir juguetes cooperativos.\n4. Registro de huellas dactilares y autorretrato.',
    differentiationNotes: 'Acompañamiento individualizado a Lucas Villalobos en momentos de transición de sala a patio.',
    reviewedBy: 'Coordinación Inicial - Prof. Carolina Sánchez',
    updatedAt: '2026-09-28'
  },
  {
    id: 'pq-pri-1',
    areaId: 'pri-len',
    level: 'PRIMARIA',
    gradeSection: '5to Grado A',
    lapso: 1,
    startDate: '2026-10-01',
    endDate: '2026-10-15',
    title: 'Taller de Crónica Literaria de Nuestra Ciudad',
    projectTheme: 'Maracaibo en Nuestras Letras y Colores',
    status: 'A_REVISION',
    competencyIds: ['comp-pri-1'],
    indicatorIds: ['ind-pri-101'],
    teachingStrategyIds: ['strat-ens-2'],
    evaluationStrategyIds: ['strat-eval-2'],
    pedagogicalActivities: 'Lectura de cronistas zulianos, lluvia de ideas en pizarras digitales, borrador colaborativo y corrección entre pares.',
    differentiationNotes: 'Guía de andamiaje gramatical para estudiantes que requieren refuerzo sintáctico.',
    reviewFeedback: 'Por favor especificar las fechas exactas de la entrega del borrador y la rúbrica.',
    updatedAt: '2026-09-30'
  },
  {
    id: 'pq-med-1',
    areaId: 'med-mat',
    level: 'MEDIA_GENERAL',
    gradeSection: '4to Año A',
    lapso: 1,
    startDate: '2026-10-01',
    endDate: '2026-10-15',
    title: 'Modelado Parabólico y Aplicaciones Físicas',
    projectTheme: 'La Matemática en la Arquitectura Moderna de Bellas Artes',
    status: 'DEFINITIVO',
    competencyIds: ['comp-med-1'],
    indicatorIds: ['ind-med-101', 'ind-med-102'],
    teachingStrategyIds: ['strat-ens-3'],
    evaluationStrategyIds: ['strat-eval-3'],
    pedagogicalActivities: 'Resolución analítica de funciones cuadráticas, gráficas comparativas con GeoGebra, resolución de trayectorias de proyectiles y taller grupal.',
    differentiationNotes: 'Sesión de consulta remedial en horario de apoyo académico para Mateo Chacín.',
    reviewedBy: 'Coordinación de Ciencias Exactas - Prof. Alejandro Rivas',
    updatedAt: '2026-09-29'
  }
];

export const INITIAL_PLANS_LAPSO: PlanLapso[] = [
  {
    id: 'pl-med-1',
    areaId: 'med-mat',
    level: 'MEDIA_GENERAL',
    gradeSection: '4to Año A',
    lapso: 1,
    status: 'DEFINITIVO',
    generalObjective: 'Dominar la resolución analítica, gráfica y aplicada de funciones cuadráticas y sistemas de ecuaciones en situaciones reales.',
    items: [
      {
        id: 'li-1',
        title: 'Prueba Escrita: Funciones Cuadráticas y Vértices',
        indicatorId: 'ind-med-101',
        weightPercent: 20,
        instrument: 'Prueba Escrita Individual',
        scheduledDate: '2026-10-20',
        status: 'CALIFICADA'
      },
      {
        id: 'li-2',
        title: 'Taller Práctico de Optimización y Modelado',
        indicatorId: 'ind-med-102',
        weightPercent: 20,
        instrument: 'Taller de Resolución Aplicada',
        scheduledDate: '2026-11-10',
        status: 'CALIFICADA'
      },
      {
        id: 'li-3',
        title: 'Proyecto Integrador GeoGebra + Bellas Artes',
        indicatorId: 'ind-med-101',
        weightPercent: 30,
        instrument: 'Rúbrica de Proyecto STEAM',
        scheduledDate: '2026-11-28',
        status: 'APLICADA'
      },
      {
        id: 'li-4',
        title: 'Evaluación Procesal Continua y Cuaderno de Trabajo',
        indicatorId: 'ind-med-102',
        weightPercent: 20,
        instrument: 'Escala de Estimación Procesal',
        scheduledDate: '2026-12-05',
        status: 'PENDIENTE'
      },
      {
        id: 'li-5',
        title: 'Autoevaluación y Coevaluación Ética',
        indicatorId: 'ind-med-101',
        weightPercent: 10,
        instrument: 'Cuestionario Reflexivo SICE-CBA',
        scheduledDate: '2026-12-08',
        status: 'PENDIENTE'
      }
    ],
    updatedAt: '2026-09-25'
  }
];

export const INITIAL_EVALUATION_RECORDS: EvaluationRecord[] = [
  // Inicial
  {
    id: 'eval-ini-1',
    studentId: 'stu-ini-1',
    areaId: 'ini-fp',
    indicatorId: 'ind-ini-101',
    moment: 'DIAGNOSTICA',
    lapso: 1,
    scoreQualitative: 'C',
    roboticsScore: {
      logicSkills: 'C',
      constructionSkills: 'C',
      teamwork: 'C'
    },
    observations: 'Excelente adaptación a la sala. Muestra liderazgo positivo y empatía.',
    recordedAt: '2026-10-05',
    teacherId: 'doc-inicial-1'
  },
  {
    id: 'eval-ini-2',
    studentId: 'stu-ini-3',
    areaId: 'ini-fp',
    indicatorId: 'ind-ini-101',
    moment: 'DIAGNOSTICA',
    lapso: 1,
    scoreQualitative: 'EP',
    roboticsScore: {
      logicSkills: 'EP',
      constructionSkills: 'C',
      teamwork: 'I'
    },
    observations: 'Presenta dificultad para compartir materiales de construcción. Se recomienda estimulación de turnos.',
    recordedAt: '2026-10-05',
    teacherId: 'doc-inicial-1'
  },

  // Media General - Matemáticas
  {
    id: 'eval-med-1',
    studentId: 'stu-med-1',
    areaId: 'med-mat',
    indicatorId: 'ind-med-101',
    moment: 'PROCESAL',
    lapso: 1,
    scoreNumeric: 19,
    observations: 'Procedimientos analíticos impecables. Resuelve con solvencia.',
    recordedAt: '2026-10-21',
    teacherId: 'doc-mat-1'
  },
  {
    id: 'eval-med-2',
    studentId: 'stu-med-2',
    areaId: 'med-mat',
    indicatorId: 'ind-med-101',
    moment: 'PROCESAL',
    lapso: 1,
    scoreNumeric: 18,
    observations: 'Buen razonamiento gráfico y exactitud en el cálculo.',
    recordedAt: '2026-10-21',
    teacherId: 'doc-mat-1'
  },
  {
    id: 'eval-med-3',
    studentId: 'stu-med-3', // Caso crítico para IA
    areaId: 'med-mat',
    indicatorId: 'ind-med-101',
    moment: 'PROCESAL',
    lapso: 1,
    scoreNumeric: 8,
    observations: 'Confusión en los signos de la fórmula resolvente. Dificultad para graficar la parábola.',
    recordedAt: '2026-10-21',
    teacherId: 'doc-mat-1'
  },
  {
    id: 'eval-med-4',
    studentId: 'stu-med-4',
    areaId: 'med-mat',
    indicatorId: 'ind-med-101',
    moment: 'PROCESAL',
    lapso: 1,
    scoreNumeric: 14,
    observations: 'Comprende el concepto básico; requiere mayor agilidad algebraica.',
    recordedAt: '2026-10-21',
    teacherId: 'doc-mat-1'
  }
];

export const INITIAL_AI_ACTION_PLANS: AIActionPlan[] = [
  {
    id: 'ai-plan-1',
    studentId: 'stu-med-3',
    areaId: 'med-mat',
    lapso: 1,
    diagnosticSummary: 'Riesgo académico detectado en la competencia CP-MED-01. El estudiante presenta un rendimiento de 08/20 en el primer corte procesal de funciones cuadráticas.',
    identifiedGaps: [
      'Inversión recurrente de signos al aplicar la fórmula cuadrática general.',
      'Dificultad de abstracción para determinar las coordenadas del vértice (h, k).',
      'Ansiedad ante evaluaciones cronometradas con cálculo algebraico complejo.'
    ],
    recommendedPedagogicalActions: [
      'Fase 1 (Nivelación básica): 3 sesiones de refuerzo con hojas de trabajo estructuradas paso a paso con código de color (a=rojo, b=azul, c=verde).',
      'Fase 2 (Visualización): Utilizar la herramienta digital interactiva GeoGebra para enlazar el valor algebraico con la apertura y desplazamiento de la curva.',
      'Fase 3 (Andamiaje): Prueba formativa corta sin valor sumativo antes de la reevaluación procesal.',
      'Fase 4 (Acompañamiento): Tutoría con estudiante monitor de excelencia (Gabriel Montiel).'
    ],
    suggestedResources: [
      'Cuadernillo de Álgebra Asistida SICE-CBA Bellas Artes.',
      'Applet de GeoGebra: "Parábola y sus coeficientes".',
      'Video-cápsulas explicativas del Prof. Alejandro Rivas.'
    ],
    teacherNotes: 'El representante fue notificado en entrevista virtual. El estudiante manifiesta motivación por mejorar.',
    status: 'EN_APLICACION',
    createdAt: '2026-10-23',
    aiConfidenceScore: 94
  }
];

export const INITIAL_REMEDIAL_PLANS: RemedialActionPlan[] = [
  {
    id: 'rem-plan-1',
    studentId: 'stu-med-4',
    subjectName: 'Física (3er Año - Pendiente)',
    schoolYear: '2026-2027',
    teacherTutor: 'Prof. Marcos Andrade',
    topicsToOvercome: [
      'Movimiento Rectilíneo Uniformemente Variado (MRUV)',
      'Leyes de Newton y Diagramas de Cuerpo Libre',
      'Trabajo mecánico y conservación de la energía'
    ],
    diagnosticScore: 9,
    expectedActivities: [
      'Elaboración de portafolio de 25 problemas resueltos con justificación física.',
      '2 prácticas presenciales en el laboratorio de física del colegio.',
      'Tutoría semanal obligatoria los días jueves de 2:00 pm a 3:30 pm.'
    ],
    evaluationSchedule: 'Octubre a Diciembre de 2026',
    remedialExamDate: '2026-12-12',
    status: 'PENDIENTE'
  }
];

export const INITIAL_COUNCIL_MINUTES: CouncilMeetingMinute[] = [
  {
    id: 'acta-med-4a-1',
    level: 'MEDIA_GENERAL',
    gradeSection: '4to Año A',
    lapso: 1,
    meetingDate: '2026-11-30',
    coordinador: 'Prof. Lissette Chacín (Coordinadora Pedagógica Media General)',
    attendees: [
      'Prof. Alejandro Rivas (Matemáticas)',
      'Prof. Elena Barrios (Castellano)',
      'Prof. Marcos Andrade (Física)',
      'Lic. Mariana Duque (Psicología Escolar)'
    ],
    agendaSummary: 'Análisis de rendimiento académico del 1er Lapso, seguimiento de planes de acción personalizados y aprobación de reevaluaciones remediales.',
    adjustedScores: [
      {
        studentId: 'stu-med-3',
        studentName: 'Mateo Sebastián Chacín Portillo',
        areaName: 'Matemáticas',
        previousScore: '08',
        newScore: '12',
        justification: 'Superación satisfactoria del Plan de Acción Personalizado y reevaluación demostrada en taller de recuperación.'
      }
    ],
    criticalCases: [
      'Mateo Chacín: En proceso de consolidación, se mantiene seguimiento en Física.',
      'Sebastián Romero: Cumpliendo cronograma de materia pendiente de 3er año satisfactoriamente.'
    ],
    resolutions: [
      'Se aprueba por unanimidad el ajuste de calificación procesal para Mateo Chacín a 12 puntos.',
      'Se fija la fecha definitiva de boletines del 1er Lapso para el 15 de diciembre de 2026.',
      'Se felicita al equipo docente por el 89% de aprobación general en Media General.'
    ],
    signed: true
  }
];

// ==========================================
// --- GESTIÓN INSTITUCIONAL SICE-CBA ---
// ==========================================

export const INITIAL_PASSES: PassRecord[] = [
  {
    id: 'pass-001',
    ticketNumber: 'RET-2026-0842',
    studentId: 'stu-med-3',
    studentName: 'Mateo Sebastián Chacín Portillo',
    gradeSection: '4to Año A',
    date: '2026-09-17',
    time: '07:22 AM',
    reason: 'Inconveniente de transporte vehicular en Av. Bella Vista',
    authorizedBy: 'Portería Principal / Prof. Marcos Andrade',
    printed: true
  },
  {
    id: 'pass-002',
    ticketNumber: 'RET-2026-0843',
    studentId: 'stu-pri-2',
    studentName: 'Diego Alejandro Mendoza Silva',
    gradeSection: '3er Grado A',
    date: '2026-09-17',
    time: '07:35 AM',
    reason: 'Cita médica odontológica matutina con justificativo anexo',
    authorizedBy: 'Portería Principal / Coordinación Primaria',
    printed: false
  },
  {
    id: 'pass-003',
    ticketNumber: 'RET-2026-0844',
    studentId: 'stu-med-1',
    studentName: 'Andrés Eduardo Silva Bermúdez',
    gradeSection: '4to Año A',
    date: '2026-09-16',
    time: '07:18 AM',
    reason: 'Retraso de transporte escolar colectivo',
    authorizedBy: 'Portería Principal',
    printed: true
  }
];

export const INITIAL_DAILY_ATTENDANCE: DailyAttendanceRecord[] = [
  {
    id: 'att-d-1',
    studentId: 'stu-med-1',
    studentName: 'Andrés Eduardo Silva Bermúdez',
    gradeSection: '4to Año A',
    date: '2026-09-17',
    status: 'PRESENTE',
    lapso: 1
  },
  {
    id: 'att-d-2',
    studentId: 'stu-med-2',
    studentName: 'Camila Isabella Urdaneta Moreno',
    gradeSection: '4to Año A',
    date: '2026-09-17',
    status: 'PRESENTE',
    lapso: 1
  },
  {
    id: 'att-d-3',
    studentId: 'stu-med-3',
    studentName: 'Mateo Sebastián Chacín Portillo',
    gradeSection: '4to Año A',
    date: '2026-09-17',
    status: 'RETRASO',
    justification: 'Pase por retraso RET-2026-0842',
    lapso: 1
  },
  {
    id: 'att-d-4',
    studentId: 'stu-med-4',
    studentName: 'Sofía Valentina Morales Rincón',
    gradeSection: '4to Año A',
    date: '2026-09-17',
    status: 'INASISTENCIA_JUSTIFICADA',
    justification: 'Reposo médico pediátrico por afección respiratoria',
    lapso: 1
  },
  {
    id: 'att-d-5',
    studentId: 'stu-med-5',
    studentName: 'Sebastián Alejandro Romero Parra',
    gradeSection: '4to Año A',
    date: '2026-09-17',
    status: 'PRESENTE',
    lapso: 1
  }
];

export const INITIAL_ACCUMULATED_ATTENDANCE: SubjectAttendanceAccumulated[] = [
  {
    id: 'att-acc-1',
    studentId: 'stu-med-3',
    studentName: 'Mateo Sebastián Chacín Portillo',
    areaId: 'med-mat',
    areaName: 'Matemáticas',
    gradeSection: '4to Año A',
    lapso: 1,
    totalClasses: 32,
    unjustifiedAbsences: 6,
    justifiedAbsences: 2,
    absencePercentage: 18.75,
    exceedsLimit: false
  },
  {
    id: 'att-acc-2',
    studentId: 'stu-med-4',
    studentName: 'Sofía Valentina Morales Rincón',
    areaId: 'med-qui',
    areaName: 'Química',
    gradeSection: '4to Año A',
    lapso: 1,
    totalClasses: 28,
    unjustifiedAbsences: 2,
    justifiedAbsences: 4,
    absencePercentage: 7.14,
    exceedsLimit: false
  },
  {
    id: 'att-acc-3',
    studentId: 'stu-med-5',
    studentName: 'Sebastián Alejandro Romero Parra',
    areaId: 'med-fis',
    areaName: 'Física',
    gradeSection: '4to Año A',
    lapso: 1,
    totalClasses: 26,
    unjustifiedAbsences: 7,
    justifiedAbsences: 1,
    absencePercentage: 26.92,
    exceedsLimit: true
  }
];

export const INITIAL_CONDUCTS: ConductEntry[] = [
  {
    id: 'cond-01',
    studentId: 'stu-med-3',
    studentName: 'Mateo Sebastián Chacín Portillo',
    gradeSection: '4to Año A',
    date: '2026-09-15',
    lapso: 1,
    type: 'LEVE',
    description: 'Uso de teléfono celular en horario no autorizado durante clase de Química.',
    agreements: 'Entrega del dispositivo a coordinación hasta culminar la jornada y compromiso escrito.',
    reportedBy: 'Prof. Químico / Coordinación de Convivencia'
  },
  {
    id: 'cond-02',
    studentId: 'stu-med-2',
    studentName: 'Camila Isabella Urdaneta Moreno',
    gradeSection: '4to Año A',
    date: '2026-09-12',
    lapso: 1,
    type: 'POSITIVA',
    description: 'Liderazgo exemplar y apoyo voluntario en tutoría de pares para compañeros de 1er año.',
    agreements: 'Felicitación asentada en el expediente académico del Colegio Bellas Artes.',
    reportedBy: 'Prof. Elena Barrios'
  }
];

export const INITIAL_DOCUMENT_REQUESTS: DocumentRequest[] = [
  {
    id: 'doc-req-101',
    trackingCode: 'SOL-CBA-2026-019',
    representativeName: 'Ing. Carlos Urdaneta',
    studentName: 'Camila Isabella Urdaneta Moreno',
    gradeSection: '4to Año A',
    documentType: 'Constancia de Estudio',
    department: 'Control de Estudios',
    requestDate: '2026-09-14',
    elapsedDays: 3,
    status: 'LISTO_ENTREGA',
    notes: 'Requiere sello húmedo y firma del director para trámite de visa.'
  },
  {
    id: 'doc-req-102',
    trackingCode: 'SOL-CBA-2026-020',
    representativeName: 'Dra. María Bermúdez',
    studentName: 'Andrés Eduardo Silva Bermúdez',
    gradeSection: '4to Año A',
    documentType: 'Notas Certificadas',
    department: 'Control de Estudios',
    requestDate: '2026-09-10',
    elapsedDays: 7,
    status: 'EN_TRAMITE',
    notes: 'Certificación de 1° a 3° año en formato oficial ministerial.'
  },
  {
    id: 'doc-req-103',
    trackingCode: 'SOL-CBA-2026-021',
    representativeName: 'Sr. Roberto Morales',
    studentName: 'Sofía Valentina Morales Rincón',
    gradeSection: '4to Año A',
    documentType: 'Solvencia Administrativa',
    department: 'Administración',
    requestDate: '2026-09-16',
    elapsedDays: 1,
    status: 'LISTO_ENTREGA',
    notes: 'Solvencia de matrícula para seguro escolar.'
  },
  {
    id: 'doc-req-104',
    trackingCode: 'SOL-CBA-2026-022',
    representativeName: 'Lic. Patricia Portillo',
    studentName: 'Mateo Sebastián Chacín Portillo',
    gradeSection: '4to Año A',
    documentType: 'Carta de Buena Conducta',
    department: 'Dirección',
    requestDate: '2026-09-15',
    elapsedDays: 2,
    status: 'PENDIENTE',
    notes: 'Para postulación deportiva en club de natación intercolegial.'
  }
];

export const INITIAL_ADMIN_BLOCKS: AdministrativeBlockEntry[] = [
  {
    id: 'block-01',
    representativeId: 'rep-mor-01',
    representativeName: 'Sr. David Colina Villalobos',
    studentId: 'stu-block-99',
    studentName: 'Franco David Colina Rivas',
    gradeSection: '2do Año B',
    reason: 'Mora administrativa en mensualidades escolares acumuladas (Mayo - Julio 2026).',
    blockDate: '2026-09-01',
    active: true,
    debtAmount: '$180.00'
  }
];

export const INITIAL_TITLES: TitleRecord[] = [
  {
    id: 'tit-01',
    studentId: 'stu-med-1',
    studentName: 'Andrés Eduardo Silva Bermúdez',
    cedula: 'V-32.890.112',
    schoolYear: '2026-2027',
    graduationYear: '2027',
    serialNumber: 'MIN-MPPE-2027-09412',
    tomo: 'LVII',
    folio: '084',
    registeredCode: 'CBA-TIT-482',
    calibrated: true
  },
  {
    id: 'tit-02',
    studentId: 'stu-med-2',
    studentName: 'Camila Isabella Urdaneta Moreno',
    cedula: 'V-32.954.887',
    schoolYear: '2026-2027',
    graduationYear: '2027',
    serialNumber: 'MIN-MPPE-2027-09413',
    tomo: 'LVII',
    folio: '085',
    registeredCode: 'CBA-TIT-483',
    calibrated: true
  }
];

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

export const INITIAL_BIRTHDAYS: BirthdayPerson[] = [
  {
    id: 'b-01',
    fullName: 'Prof. Elena Barrios',
    role: 'Docente',
    gradeOrArea: 'Castellano y Literatura (Media General)',
    birthDate: '17 de Septiembre',
    isToday: true
  },
  {
    id: 'b-02',
    fullName: 'Diego Alejandro Mendoza Silva',
    role: 'Estudiante',
    gradeOrArea: '3er Grado A (Primaria)',
    birthDate: '17 de Septiembre',
    isToday: true
  },
  {
    id: 'b-03',
    fullName: 'Lic. Lissette Chacín',
    role: 'Personal',
    gradeOrArea: 'Coordinación Pedagógica',
    birthDate: '20 de Septiembre',
    isToday: false
  },
  {
    id: 'b-04',
    fullName: 'Sofía Valentina Morales Rincón',
    role: 'Estudiante',
    gradeOrArea: '4to Año A',
    birthDate: '22 de Septiembre',
    isToday: false
  }
];

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr-admin-1',
    username: 'admin',
    password: 'cba2026*admin',
    fullName: 'Ing. Administrador General',
    email: 'admin@bellasartes.edu.ve',
    role: 'ADMINISTRADOR',
    defaultLevel: 'MEDIA_GENERAL',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    id: 'usr-director-1',
    username: 'director',
    password: 'cba2026*director',
    fullName: 'Prof. Director General CBA',
    email: 'direccion@bellasartes.edu.ve',
    role: 'DIRECTOR',
    defaultLevel: 'MEDIA_GENERAL',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 'usr-coord-1',
    username: 'coordinacion',
    password: 'cba2026*coord',
    fullName: 'Lic. Lissette Chacín',
    email: 'coordinacion@bellasartes.edu.ve',
    role: 'COORDINACION',
    defaultLevel: 'MEDIA_GENERAL',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  },
  {
    id: 'usr-docente-1',
    username: 'docente',
    password: 'cba2026*docente',
    fullName: 'Prof. Marcos Andrade',
    email: 'mandrade@bellasartes.edu.ve',
    role: 'DOCENTE',
    defaultLevel: 'MEDIA_GENERAL',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  {
    id: 'usr-docente-pri',
    username: 'docente_primaria',
    password: 'cba2026*primaria',
    fullName: 'Prof. Elena Barrios',
    email: 'ebarrios@bellasartes.edu.ve',
    role: 'DOCENTE',
    defaultLevel: 'PRIMARIA',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  },
  {
    id: 'usr-rep-1',
    username: 'representante',
    password: 'cba2026*padre',
    fullName: 'Ing. Carlos Urdaneta',
    email: 'curdaneta@oilfield.com',
    role: 'REPRESENTANTE',
    defaultLevel: 'MEDIA_GENERAL',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
  },
  {
    id: 'usr-est-1',
    username: 'estudiante',
    password: 'cba2026*alumno',
    fullName: 'Camila Isabella Urdaneta Moreno',
    email: 'camila.urdaneta@bellasartes.edu.ve',
    role: 'ESTUDIANTE',
    defaultLevel: 'MEDIA_GENERAL',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  }
];


