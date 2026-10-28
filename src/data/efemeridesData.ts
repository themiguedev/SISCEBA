import { NoticeTheme } from '../types';

export type EfemerideScope = 'MARACAIBO_ZULIA' | 'VENEZUELA' | 'GLOBAL';

export interface EfemerideItem {
  id: string;
  day: number;
  month: number; // 1 = Enero ... 12 = Diciembre
  monthName: string;
  title: string;
  scope: EfemerideScope;
  scopeLabel: string;
  category: 'Historia y Soberanía' | 'Cultura y Tradición' | 'Educación y Pedagogía' | 'Ciencia y Ambiente' | 'Derechos y Sociedad';
  description: string;
  pedagogicalHighlight: string;
  isMaracaiboSpecial?: boolean;
  theme: NoticeTheme;
  suggestedTag: string;
  icon: string;
  location?: string;
}

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const EFEMERIDES_LIST: EfemerideItem[] = [
  // =========================================================================
  // ENERO
  // =========================================================================
  {
    id: 'efem-glo-01-01',
    day: 1,
    month: 1,
    monthName: 'Enero',
    title: 'Año Nuevo y Jornada Mundial de la Paz',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Derechos y Sociedad',
    description: 'Celebración internacional de inicio de año y fomento global del entendimiento fraternal entre naciones y pueblos.',
    pedagogicalHighlight: 'Elaboración de proyectos de vida estudiantiles y compromisos colectivos de convivencia escolar armónica.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Paz Mundial',
    icon: '🕊️'
  },
  {
    id: 'efem-ven-01-06',
    day: 6,
    month: 1,
    monthName: 'Enero',
    title: 'Día Nacional del Deporte',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Cultura y Tradición',
    description: 'Homenaje a los atletas, entrenadores y glorias deportivas de Venezuela, originado en la tradicional Misa del Deporte de 1945.',
    pedagogicalHighlight: 'Promoción de la actividad física, juegos intercursos y hábitos saludables en los tres subsistemas.',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: 'Deporte Escolar',
    icon: '🏅'
  },
  {
    id: 'efem-ven-01-15',
    day: 15,
    month: 1,
    monthName: 'Enero',
    title: 'Día del Maestro en Venezuela',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Educación y Pedagogía',
    description: 'Conmemoración de la fundación de la Sociedad Venezolana de Maestros de Instrucción Primaria en 1932 por el insigne maestro Luis Beltrán Prieto Figueroa.',
    pedagogicalHighlight: 'Actos de reconocimiento docente, cartas de gratitud de estudiantes y valoración de la vocación pedagógica.',
    theme: 'DIA_DEL_MAESTRO',
    suggestedTag: 'Magisterio CBA',
    icon: '🍎'
  },
  {
    id: 'efem-zul-01-16',
    day: 16,
    month: 1,
    monthName: 'Enero',
    title: 'Día de la Laguna de Las Peonías y Humedales de Maracaibo',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Ciencia y Ambiente',
    description: 'Protección ecológica de la albufera de Las Peonías y manglares del norte de Maracaibo, hábitat primordial de avifauna y flamencos rosados.',
    pedagogicalHighlight: 'Campañas de conservación ambiental, estudio de ecosistemas lacustres y siembra de especies autóctonas.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'Ambiente Marabino',
    icon: '🦩',
    location: 'Maracaibo / Mara, Zulia'
  },
  {
    id: 'efem-glo-01-24',
    day: 24,
    month: 1,
    monthName: 'Enero',
    title: 'Día Internacional de la Educación (UNESCO / ONU)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Educación y Pedagogía',
    description: 'Proclamado por la Asamblea General de las Naciones Unidas para resaltar el papel transformador de la educación en la paz y el desarrollo sostenible.',
    pedagogicalHighlight: 'Exposiciones sobre el derecho universal a aprender y socialización de proyectos de robótica STEAM y artes.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'UNESCO Educación',
    icon: '🎓'
  },
  {
    id: 'efem-zul-01-28',
    day: 28,
    month: 1,
    monthName: 'Enero',
    title: 'Día de la Zulianidad (Independencia de Maracaibo en 1821)',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Historia y Soberanía',
    description: 'Fecha magna del Zulia: en 1821 el Ayuntamiento de Maracaibo rompe definitivamente con el yugo español y se une a la gesta de la Gran Colombia de Bolívar. Instituido oficialmente para exaltar la identidad, el gentilicio y las tradiciones marabinas.',
    pedagogicalHighlight: 'Semana de la Zulianidad en Bellas Artes: muestras gastronómicas (mandocas, patacones), décimas, gaitas, vestidos wayúu y banderas del Zulia.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: '¡Viva la Zulianidad!',
    icon: '☀️',
    location: 'Maracaibo, Estado Zulia'
  },

  // =========================================================================
  // FEBRERO
  // =========================================================================
  {
    id: 'efem-zul-02-01',
    day: 1,
    month: 2,
    monthName: 'Febrero',
    title: 'Natalicio del Dr. Rafael Belloso Chacín (1897)',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Educación y Pedagogía',
    description: 'Nacimiento en Maracaibo del insigne jurista, médico, docente universitario y humanista zuliano cuya impronta transformó la educación superior y cívica en el occidente.',
    pedagogicalHighlight: 'Lectura biográfica sobre los hombres y mujeres que cimentaron la educación y la salud en Maracaibo.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'Educadores Zulianos',
    icon: '📜',
    location: 'Maracaibo, Zulia'
  },
  {
    id: 'efem-ven-02-03',
    day: 3,
    month: 2,
    monthName: 'Febrero',
    title: 'Natalicio del Gran Mariscal de Ayacucho Antonio José de Sucre (1795)',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Historia y Soberanía',
    description: 'Nacimiento en Cumaná del estratega más virtuoso de la independencia suramericana, vencedor de Pichincha y Ayacucho, y ejemplo de dignidad moral.',
    pedagogicalHighlight: 'Líneas de tiempo sobre las campañas de Sucre y redacción de ensayos sobre la lealtad cívica.',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: 'Próceres Patrios',
    icon: '⚔️'
  },
  {
    id: 'efem-glo-02-11',
    day: 11,
    month: 2,
    monthName: 'Febrero',
    title: 'Día Internacional de la Mujer y la Niña en la Ciencia',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Ciencia y Ambiente',
    description: 'Conmemoración instituida por la ONU para promover el acceso equitativo y pleno de las mujeres y jóvenes investigadoras en las áreas STEM.',
    pedagogicalHighlight: 'Muestras científicas dirigidas por estudiantes de Inicial, Primaria y Media General en laboratorios de ciencias.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Ciencia Femenina',
    icon: '🔬'
  },
  {
    id: 'efem-ven-02-12',
    day: 12,
    month: 2,
    monthName: 'Febrero',
    title: 'Día de la Juventud en Venezuela (Batalla de La Victoria 1814)',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Historia y Soberanía',
    description: 'Homenaje a los jóvenes seminaristas y estudiantes de Caracas que al mando de José Félix Ribas detuvieron las tropas realistas al grito de: "¡No podemos optar entre vencer o morir, necesario es vencer!".',
    pedagogicalHighlight: 'Actividades de liderazgo juvenil, oratoria cívica y foros sobre el rol de la juventud en la Venezuela actual.',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: 'Juventud Victoriosa',
    icon: '⚡'
  },
  {
    id: 'efem-zul-02-17',
    day: 17,
    month: 2,
    monthName: 'Febrero',
    title: 'Día del Lago de Maracaibo (Coquivacoa)',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Ciencia y Ambiente',
    description: 'Día regional consagrado a la conservación, saneamiento y reverdecimiento del Lago de Maracaibo, corazón lacustre más grande de Sudamérica e ícono identitario marabino.',
    pedagogicalHighlight: 'Jornadas de concientización sobre el reciclaje, no arrojar plásticos al estuario y proyectos escolares de química del agua.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'Salvemos el Lago',
    icon: '🌊',
    location: 'Cuenca del Lago de Maracaibo'
  },
  {
    id: 'efem-glo-02-21',
    day: 21,
    month: 2,
    monthName: 'Febrero',
    title: 'Día Internacional de la Lengua Materna (UNESCO)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Educación y Pedagogía',
    description: 'Reconocimiento de la diversidad lingüística y cultural del planeta, con especial mención a las lenguas ancestrales indígenas.',
    pedagogicalHighlight: 'Talleres de iniciación a las expresiones y vocabulario Wayuunaiki y valoración del español de Maracaibo.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Diversidad Lingüística',
    icon: '🗣️'
  },
  {
    id: 'efem-zul-02-21',
    day: 21,
    month: 2,
    monthName: 'Febrero',
    title: 'Día de la Autonomía de La Universidad del Zulia (LUZ)',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Educación y Pedagogía',
    description: 'Conmemoración del rescate y reapertura de la máxima casa de estudios universitarios del Zulia, alma máter de profesionales de excelencia marabinos.',
    pedagogicalHighlight: 'Conversatorios de orientación vocacional sobre carreras universitarias con docentes egresados de LUZ.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'Alma Máter LUZ',
    icon: '🏛️',
    location: 'Maracaibo, Zulia'
  },
  {
    id: 'efem-zul-02-25',
    day: 25,
    month: 2,
    monthName: 'Febrero',
    title: 'Natalicio de Rafael María Baralt (1810)',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Cultura y Tradición',
    description: 'Nacimiento en Maracaibo del coloso de las letras, historiador, filólogo y poeta. Autor del primer "Diccionario de Galicismos" y primer hispanoamericano electo como individuo de número de la Real Academia Española (RAE).',
    pedagogicalHighlight: 'Lectura de odas poéticas de Baralt ("Adiós a la Patria") y visita pedagógica virtual al Teatro Baralt.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'Letras Marabinas',
    icon: '✒️',
    location: 'Maracaibo, Zulia'
  },

  // =========================================================================
  // MARZO
  // =========================================================================
  {
    id: 'efem-glo-03-08',
    day: 8,
    month: 3,
    monthName: 'Marzo',
    title: 'Día Internacional de la Mujer (ONU)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Derechos y Sociedad',
    description: 'Conmemoración ecuménica de la lucha por la igualdad de derechos, liderazgo, dignidad y emancipación femenina en todas las esferas humanas.',
    pedagogicalHighlight: 'Homenaje a las maestras, madres de familia y lideresas estudiantiles del Colegio Bellas Artes.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Mujer y Liderazgo',
    icon: '🌸'
  },
  {
    id: 'efem-ven-03-10',
    day: 10,
    month: 3,
    monthName: 'Marzo',
    title: 'Día del Médico en Venezuela (Natalicio de José María Vargas)',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Ciencia y Ambiente',
    description: 'En honor al sabio médico guaireño, catedrático y presidente de la República civilista, modelo de ética deontológica.',
    pedagogicalHighlight: 'Charlas de primeros auxilios y orientación sobre profesiones biomédicas en el laboratorio STEAM.',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: 'Vocación Médica',
    icon: '🩺'
  },
  {
    id: 'efem-glo-03-21',
    day: 21,
    month: 3,
    monthName: 'Marzo',
    title: 'Día Mundial de la Poesía y Contra la Discriminación Racial',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Cultura y Tradición',
    description: 'Celebración de la belleza de la palabra poética universal y rechazo incondicional a cualquier forma de discriminación o xenofobia.',
    pedagogicalHighlight: 'Recital escolar de poesías y declamaciones con versos de autores venezolanos y latinoamericanos.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Poesía y Convivencia',
    icon: '📖'
  },
  {
    id: 'efem-glo-03-22',
    day: 22,
    month: 3,
    monthName: 'Marzo',
    title: 'Día Mundial del Agua (ONU)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Ciencia y Ambiente',
    description: 'Sensibilización global sobre el valor insustituible del agua dulce potable y la gestión equitativa de las cuencas fluviales y lacustres.',
    pedagogicalHighlight: 'Campaña CBA: "Cada gota cuenta", inspección de llaves de agua escolares y medición del consumo responsable.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Cuidado del Agua',
    icon: '💧'
  },
  {
    id: 'efem-ven-03-28',
    day: 28,
    month: 3,
    monthName: 'Marzo',
    title: 'Natalicio del Generalísimo Francisco de Miranda (1750)',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Historia y Soberanía',
    description: 'Nacimiento del "Más Universal de los Venezolanos", precursor de la independencia y creador de la bandera tricolor nacional.',
    pedagogicalHighlight: 'Estudio de la biblioteca móvil de Miranda y su participación en la Revolución Francesa y la Independencia Americana.',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: 'El Precursor',
    icon: '🧭'
  },
  {
    id: 'efem-zul-03-31',
    day: 31,
    month: 3,
    monthName: 'Marzo',
    title: 'Conmemoración del Acervo Cultural y Religioso del Zulia',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Cultura y Tradición',
    description: 'Homenaje a los templos coloniales de Maracaibo (Santa Bárbara, Catedral de Maracaibo, Santa Ana y San Juan de Dios) como custodios de la fe y la memoria.',
    pedagogicalHighlight: 'Reseña de la arquitectura vernácula de las iglesias zulianas y su preservación como patrimonio urbano.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'Patrimonio de Maracaibo',
    icon: '⛪',
    location: 'Centro Histórico de Maracaibo'
  },

  // =========================================================================
  // ABRIL
  // =========================================================================
  {
    id: 'efem-glo-04-07',
    day: 7,
    month: 4,
    monthName: 'Abril',
    title: 'Día Mundial de la Salud (OMS)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Ciencia y Ambiente',
    description: 'Aniversario de la creación de la Organización Mundial de la Salud en 1948, promoviendo el acceso a la atención médica de calidad para todos.',
    pedagogicalHighlight: 'Jornadas de loncheras nutritivas, higiene bucal y salud mental escolar para niños y adolescentes.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Salud Integral',
    icon: '❤️‍🩹'
  },
  {
    id: 'efem-ven-04-19',
    day: 19,
    month: 4,
    monthName: 'Abril',
    title: 'Proclamación de la Independencia de Venezuela (19 de Abril de 1810)',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Historia y Soberanía',
    description: 'Día en que el Cabildo de Caracas desconoce al Capitán General Vicente Emparan y constituye la Junta Suprema Defensora de los Derechos del Pueblo, primer grito de libertad republicana.',
    pedagogicalHighlight: 'Dramatización del Cabildo Abierto en el patio central del colegio e himno nacional cantado por todos los grados.',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: '19 de Abril Heroico',
    icon: '🔔'
  },
  {
    id: 'efem-glo-04-22',
    day: 22,
    month: 4,
    monthName: 'Abril',
    title: 'Día Internacional de la Madre Tierra (ONU)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Ciencia y Ambiente',
    description: 'Llamamiento mundial para mitigar el cambio climático, preservar la biosfera y promover una relación armónica con el planeta.',
    pedagogicalHighlight: 'Siembra comunitaria en las áreas verdes del colegio y concurso de afiches ecologistas.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Madre Tierra',
    icon: '🌍'
  },
  {
    id: 'efem-glo-04-23',
    day: 23,
    month: 4,
    monthName: 'Abril',
    title: 'Día Mundial del Libro, Derecho de Autor y del Idioma Español',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Educación y Pedagogía',
    description: 'Homenaje a Miguel de Cervantes, William Shakespeare y el Inca Garcilaso de la Vega, pilares de la literatura universal y de la lengua castellana.',
    pedagogicalHighlight: 'Feria del Libro CBA: intercambio de cuentos, clubes de lectura y fomento del amor por las páginas impresas.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Lectura CBA',
    icon: '📚'
  },

  // =========================================================================
  // MAYO
  // =========================================================================
  {
    id: 'efem-glo-05-01',
    day: 1,
    month: 5,
    monthName: 'Mayo',
    title: 'Día Internacional del Trabajador',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Derechos y Sociedad',
    description: 'Homenaje mundial a las reivindicaciones laborales y sociales de los trabajadores, en recuerdo de los Mártires de Chicago de 1886.',
    pedagogicalHighlight: 'Reconocimiento al personal obrero, administrativo, mantenimiento y de cocina del colegio Bellas Artes.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Trabajo Digno',
    icon: '🛠️'
  },
  {
    id: 'efem-ven-05-10',
    day: 10,
    month: 5,
    monthName: 'Mayo',
    title: 'Día Nacional de la Afrovenezolanidad (Gesta de José Leonardo Chirino)',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Historia y Soberanía',
    description: 'Conmemoración del alzamiento de José Leonardo Chirino en Coro (1795) reclamando la abolición de la esclavitud y el establecimiento de la República.',
    pedagogicalHighlight: 'Estudio de los aportes culturales afrodescendientes en la música, gastronomía e historia patria.',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: 'Afrovenezolanidad',
    icon: '🥁'
  },
  {
    id: 'efem-glo-05-15',
    day: 15,
    month: 5,
    monthName: 'Mayo',
    title: 'Día Internacional de las Familias (ONU)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Derechos y Sociedad',
    description: 'Reconocimiento del núcleo familiar como espacio fundamental para el afecto, la crianza respetuosa y el crecimiento ético de los niños.',
    pedagogicalHighlight: 'Jornada escolar de integración familiar: "Mi Familia y Yo en el Colegio Bellas Artes".',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Familia CBA',
    icon: '🏡'
  },
  {
    id: 'efem-glo-05-17',
    day: 17,
    month: 5,
    monthName: 'Mayo',
    title: 'Día Mundial de las Telecomunicaciones y la Sociedad de la Información',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Ciencia y Ambiente',
    description: 'Celebración de la conectividad digital, internet responsable y reducción de la brecha digital en el mundo moderno.',
    pedagogicalHighlight: 'Talleres de ciberseguridad para estudiantes, uso ético de la inteligencia artificial y código seguro.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Tecnología Ética',
    icon: '💻'
  },
  {
    id: 'efem-ven-05-25',
    day: 25,
    month: 5,
    monthName: 'Mayo',
    title: 'Día del Himno Nacional de Venezuela (Gloria al Bravo Pueblo)',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Historia y Soberanía',
    description: 'Decreto de 1881 que consagró oficialmente la marcha patriótica con letra de Vicente Salias y música de Juan José Landaeta como Himno Nacional.',
    pedagogicalHighlight: 'Análisis estrófico y significado patriótico de las estrofas del himno en clase de música y castellano.',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: 'Himno Nacional',
    icon: '🎺'
  },
  {
    id: 'efem-zul-05-28',
    day: 28,
    month: 5,
    monthName: 'Mayo',
    title: 'Día del Himno del Estado Zulia ("Sobre palmas y lauros de oro")',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Cultura y Tradición',
    description: 'Conmemoración del decreto oficial del Himno del Zulia en 1909. Letra del gran vate marabino Udón Pérez y música del maestro José Antonio Chaves.',
    pedagogicalHighlight: 'Canto solemne del himno zuliano en formación matutina y análisis de su lírica ("La luz con que el relámpago ilumina el Catatumbo").',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'Himno Zuliano',
    icon: '🎶',
    location: 'Maracaibo, Zulia'
  },
  {
    id: 'efem-ven-05-29',
    day: 29,
    month: 5,
    monthName: 'Mayo',
    title: 'Día del Árbol Nacional (El Araguaney)',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Ciencia y Ambiente',
    description: 'Declarado árbol nacional en 1948, símbolo de la primavera venezolana con su imponente floración amarilla brillante.',
    pedagogicalHighlight: 'Adopción de un árbol por salón y jornadas de riego y embellecimiento botánico escolar.',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: 'Araguaney Patrio',
    icon: '🌳'
  },

  // =========================================================================
  // JUNIO
  // =========================================================================
  {
    id: 'efem-glo-06-05',
    day: 5,
    month: 6,
    monthName: 'Junio',
    title: 'Día Mundial del Medio Ambiente (PNUMA / ONU)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Ciencia y Ambiente',
    description: 'Mayor jornada de concienciación ambiental a escala planetaria, orientada a restaurar ecosistemas degradados y proteger la biodiversidad.',
    pedagogicalHighlight: 'Exposición de proyectos ecológicos de reciclaje, composta escolar y paneles solares didácticos.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Planeta Verde',
    icon: '🌱'
  },
  {
    id: 'efem-ven-06-24',
    day: 24,
    month: 6,
    monthName: 'Junio',
    title: 'Batalla de Carabobo (1821) y Día del Ejército Bolivariano',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Historia y Soberanía',
    description: 'Victoria militar decisiva del ejército patriota al mando de Simón Bolívar, José Antonio Páez y Pedro Camejo ("Negro Primero") que selló la independencia política venezolana.',
    pedagogicalHighlight: 'Maquetas tácticas del Campo de Carabobo y homenajes al valor de los próceres de la patria.',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: 'Carabobo Inmortal',
    icon: '⚔️'
  },
  {
    id: 'efem-ven-06-27',
    day: 27,
    month: 6,
    monthName: 'Junio',
    title: 'Día del Periodista en Venezuela (Correo del Orinoco)',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Educación y Pedagogía',
    description: 'Aniversario de la primera edición del Correo del Orinoco en 1818, fundado por el Libertador con el lema: "Somos libres, escribimos en un país libre".',
    pedagogicalHighlight: 'Taller de redacción del periódico mural escolar y entrevistas dirigidas por los propios estudiantes.',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: 'Prensa Escolar',
    icon: '📰'
  },

  // =========================================================================
  // JULIO
  // =========================================================================
  {
    id: 'efem-ven-07-05',
    day: 5,
    month: 7,
    monthName: 'Julio',
    title: 'Firma del Acta de la Declaración de Independencia de Venezuela (1811)',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Historia y Soberanía',
    description: 'Día fundacional de la República: los diputados de siete provincias reunidos en el Congreso General de Venezuela firman el acta solemne proclamando la soberanía absoluta de la nación.',
    pedagogicalHighlight: 'Lectura facsimilar de fragmentos del Acta de Independencia y debate sobre el significado de la soberanía.',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: '5 de Julio Glorioso',
    icon: '📜'
  },
  {
    id: 'efem-ven-07-24',
    day: 24,
    month: 7,
    monthName: 'Julio',
    title: 'Natalicio del Libertador Simón Bolívar (1783)',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Historia y Soberanía',
    description: 'Nacimiento en Caracas del Padre de la Patria, insigne pensador, estadista y Libertador de Venezuela, Colombia, Ecuador, Perú y fundador de Bolivia.',
    pedagogicalHighlight: 'Ensayos biográficos sobre el Ideario Bolivariano y la educación como motor de la libertad ("Moral y Luces").',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: 'El Libertador',
    icon: '⭐'
  },
  {
    id: 'efem-zul-07-24',
    day: 24,
    month: 7,
    monthName: 'Julio',
    title: 'Batalla Naval del Lago de Maracaibo (1823) - Día de la Armada',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Historia y Soberanía',
    description: 'Acontecimiento militar trascendental en las aguas de nuestro Lago: la escuadra patriota republicana al mando del Almirante José Prudencio Padilla destruye a la flota realista del Capitán Laborde, obligando a Morales a la capitulación y expulsando definitivamente al imperio español de tierras venezolanas.',
    pedagogicalHighlight: 'Estudio de la geografía del Lago de Maracaibo, los bergantines patriotas y la trascendencia de Maracaibo en la libertad continental.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'Batalla Naval del Lago',
    icon: '⛵',
    location: 'Estrecho del Lago de Maracaibo'
  },

  // =========================================================================
  // AGOSTO
  // =========================================================================
  {
    id: 'efem-ven-08-03',
    day: 3,
    month: 8,
    monthName: 'Agosto',
    title: 'Día de la Bandera Nacional de Venezuela',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Historia y Soberanía',
    description: 'Conmemoración del primer izamiento del tricolor patrio con amarillo, azul y rojo por el Generalísimo Francisco de Miranda en La Vela de Coro en 1806.',
    pedagogicalHighlight: 'Exposición sobre la evolución histórica de las banderas patrias y respeto cívico a los símbolos nacionales.',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: 'Tricolor Nacional',
    icon: '🇻🇪'
  },
  {
    id: 'efem-glo-08-12',
    day: 12,
    month: 8,
    monthName: 'Agosto',
    title: 'Día Internacional de la Juventud (ONU)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Derechos y Sociedad',
    description: 'Promoción del papel activo de los jóvenes como agentes de cambio social, transformación digital y líderes comunitarios.',
    pedagogicalHighlight: 'Mesas redondas estudiantiles de propuestas para la mejora continua del ambiente escolar y deportivo.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Liderazgo Juvenil',
    icon: '🚀'
  },
  {
    id: 'efem-zul-08-22',
    day: 22,
    month: 8,
    monthName: 'Agosto',
    title: 'Día Mundial del Folclore y de las Danzas Tradicionales Zulianas',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Cultura y Tradición',
    description: 'Celebración de los chimbangueles de San Benito, la contradanza marabina, las décimas de Santa Rosa de Agua y la gaita de furro como patrimonio vivo.',
    pedagogicalHighlight: 'Muestra de baile folclórico zuliano y taller de ejecución de furro, cuatro, tambora y charrasca.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'Folclore Zuliano',
    icon: '🪘',
    location: 'Maracaibo / Costa Oriental'
  },
  {
    id: 'efem-zul-08-24',
    day: 24,
    month: 8,
    monthName: 'Agosto',
    title: 'Inauguración del Puente General Rafael Urdaneta sobre el Lago (1962)',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Historia y Soberanía',
    description: 'Inauguración del coloso de hormigón pretensado que unió a Maracaibo con el resto del país a través de 8.678 metros de longitud sobre el Lago. Obra maestra de la ingeniería mundial que enorgullece el corazón de todos los marabinos.',
    pedagogicalHighlight: 'Proyectos de física y arquitectura STEAM sobre estructuras tensadas, maquetas del puente y poesías dedicadas a la estructura.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'Puente sobre el Lago',
    icon: '🌉',
    location: 'Lago de Maracaibo (Punta de Piedras - Punta Iguana)'
  },

  // =========================================================================
  // SEPTIEMBRE
  // =========================================================================
  {
    id: 'efem-glo-09-08',
    day: 8,
    month: 9,
    monthName: 'Septiembre',
    title: 'Día Internacional de la Alfabetización (UNESCO)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Educación y Pedagogía',
    description: 'Recordatorio global de que la alfabetización es un derecho humano fundamental que abre las puertas al conocimiento, la autonomía y la justicia.',
    pedagogicalHighlight: 'Apadrinamiento lector: alumnos mayores de Media General leen cuentos ilustrados a los niños de Educación Inicial.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Alfabetización UNESCO',
    icon: '📖'
  },
  {
    id: 'efem-zul-09-08',
    day: 8,
    month: 9,
    monthName: 'Septiembre',
    title: 'Día de la Fundación de Maracaibo (1529)',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Historia y Soberanía',
    description: 'Conmemoración del asentamiento inicial fundado por el capitán alemán Ambrosio Alfinger bajo el nombre de "Villa de Maracaibo", cuna de nuestra identidad lacustre, su gente hospitalaria y su historia gloriosa.',
    pedagogicalHighlight: 'Exposición cronológica de la fundación de Maracaibo, sus tres momentos históricos y sus barrios fundacionales (El Saladillo, Santa Lucía).',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'Cumpleaños de Maracaibo',
    icon: '☀️',
    location: 'Maracaibo, Zulia'
  },
  {
    id: 'efem-glo-09-16',
    day: 16,
    month: 9,
    monthName: 'Septiembre',
    title: 'Día Internacional de la Preservación de la Capa de Ozono (ONU)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Ciencia y Ambiente',
    description: 'En conmemoración de la firma del Protocolo de Montreal (1987) para proteger el escudo protector de radiación ultravioleta de la Tierra.',
    pedagogicalHighlight: 'Exposición de ciencias sobre el ozono estratosférico y mención especial del Relámpago del Catatumbo como regenerador natural de ozono.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Capa de Ozono',
    icon: '🛡️'
  },
  {
    id: 'efem-glo-09-21',
    day: 21,
    month: 9,
    monthName: 'Septiembre',
    title: 'Día Internacional de la Paz (ONU)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Derechos y Sociedad',
    description: 'Jornada mundial consagrada al cese del fuego, la resolución pacífica de controversias y el desarme.',
    pedagogicalHighlight: 'Cadena humana por la paz en el patio escolar y suelta simbólica de mensajes de amistad y empatía.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Paz Escolar',
    icon: '🕊️'
  },
  {
    id: 'efem-zul-09-29',
    day: 29,
    month: 9,
    monthName: 'Septiembre',
    title: 'Aniversario del Teatro Baralt de Maracaibo (1883)',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Cultura y Tradición',
    description: 'Inauguración del templo de las artes escénicas de Maracaibo. Escenario histórico donde en 1897 se proyectaron las dos primeras películas del cine nacional por Manuel Trujillo Durán.',
    pedagogicalHighlight: 'Talleres de expresión corporal, cortometrajes estudiantiles y visitas pedagógicas guiadas.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'Teatro Baralt',
    icon: '🎭',
    location: 'Calle Urdaneta con Av. 5, Maracaibo'
  },

  // =========================================================================
  // OCTUBRE
  // =========================================================================
  {
    id: 'efem-glo-10-05',
    day: 5,
    month: 10,
    monthName: 'Octubre',
    title: 'Día Mundial de los Docentes (UNESCO / OIT)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Educación y Pedagogía',
    description: 'Celebración internacional de los educadores y su papel esencial en la formación de mentes críticas, éticas y creativas.',
    pedagogicalHighlight: 'Panel de discusión estudiantil sobre el futuro de la educación y agradecimiento a la comunidad profesoral CBA.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Docentes del Mundo',
    icon: '👩‍🏫'
  },
  {
    id: 'efem-zul-10-05',
    day: 5,
    month: 10,
    monthName: 'Octubre',
    title: 'Homenaje al Relámpago del Catatumbo (Récord Guinness Zuliano)',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Ciencia y Ambiente',
    description: 'Fenómeno meteorológico singular del suroeste del Lago de Maracaibo, distinguido con el Récord Mundial Guinness por la mayor densidad de descargas eléctricas y faro perpetuo de los navegantes.',
    pedagogicalHighlight: 'Experimentos de electromagnetismo y meteorología en clase de ciencias físicas.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'Relámpago Catatumbo',
    icon: '⚡',
    location: 'Cuenca del Catatumbo, Lago de Maracaibo'
  },
  {
    id: 'efem-ven-10-12',
    day: 12,
    month: 10,
    monthName: 'Octubre',
    title: 'Día de la Resistencia Indígena y Etnias del Zulia',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela & Zulia',
    category: 'Historia y Soberanía',
    description: 'Reivindicación de la memoria histórica, dignidad y cultura de los pueblos originarios de Venezuela, con especial énfasis en los pueblos Wayúu, Añú, Yukpa, Barí y Japreria del Zulia.',
    pedagogicalHighlight: 'Muestra etnográfica escolar de artesanía, tejidos Wayúu, gastronomía ancestral y palafitos de Santa Rosa.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'Pueblos Originarios',
    icon: '🏹',
    location: 'Sierra de Perijá / La Guajira / Maracaibo'
  },
  {
    id: 'efem-glo-10-16',
    day: 16,
    month: 10,
    monthName: 'Octubre',
    title: 'Día Mundial de la Alimentación (FAO / ONU)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Ciencia y Ambiente',
    description: 'Sensibilización para erradicar el hambre en el mundo y fomentar dietas sostenibles, inocuas y ricas en nutrientes.',
    pedagogicalHighlight: 'Taller de soberanía alimentaria, nutrición balanceada y meriendas sanas en Educación Inicial y Primaria.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Alimentación Sana',
    icon: '🍎'
  },
  {
    id: 'efem-glo-10-24',
    day: 24,
    month: 10,
    monthName: 'Octubre',
    title: 'Día de las Naciones Unidas (ONU)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Derechos y Sociedad',
    description: 'Aniversario de la entrada en vigor de la Carta de San Francisco de 1945, fundación de la ONU para preservar la paz mundial y la cooperación.',
    pedagogicalHighlight: 'Simulacro del Modelo de Naciones Unidas (MUN) con delegaciones estudiantiles en Media General.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Naciones Unidas',
    icon: '🌐'
  },
  {
    id: 'efem-zul-10-24',
    day: 24,
    month: 10,
    monthName: 'Octubre',
    title: 'Natalicio del General en Jefe Rafael Urdaneta (1788) - "El Brillante"',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Historia y Soberanía',
    description: 'Nacimiento en Maracaibo del prócer más leal, virtuoso y recto de la independencia. Amigo inquebrantable de Bolívar, último presidente de la Gran Colombia y máxima figura militar e histórica del heroísmo zuliano.',
    pedagogicalHighlight: 'Semblanza patriótica sobre la honestidad incorruptible de Urdaneta en todos los salones de clase y ofrenda cívica escolar.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'El Brillante de Maracaibo',
    icon: '⭐',
    location: 'Maracaibo, Estado Zulia'
  },
  {
    id: 'efem-ven-10-28',
    day: 28,
    month: 10,
    monthName: 'Octubre',
    title: 'Natalicio del Maestro Don Simón Rodríguez (1769)',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Educación y Pedagogía',
    description: 'Nacimiento del filósofo, visionario y maestro del Libertador Simón Bolívar, creador de la educación popular republicana con la máxima: "O inventamos o erramos".',
    pedagogicalHighlight: 'Debate pedagógico sobre el pensamiento robinsoniano y la educación para el trabajo creador.',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: 'Simón Rodríguez',
    icon: '💡'
  },

  // =========================================================================
  // NOVIEMBRE
  // =========================================================================
  {
    id: 'efem-zul-11-08',
    day: 8,
    month: 11,
    monthName: 'Noviembre',
    title: 'Día del Gaitero Zuliano (Homenaje a Ricardo Aguirre)',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Cultura y Tradición',
    description: 'Conmemoración de la siembra en 1969 de Ricardo Aguirre González ("El Monumental de la Gaita"), compositor de "La Grey Zuliana", y día oficial de los músicos e intérpretes del ritmo pascuero del Zulia.',
    pedagogicalHighlight: 'Ensamble gaitero del Colegio Bellas Artes: demostración de furro, tambora y charrasca por alumnos y profesores.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'El Monumental Aguirre',
    icon: '🪗',
    location: 'Maracaibo, Zulia'
  },
  {
    id: 'efem-zul-11-18',
    day: 18,
    month: 11,
    monthName: 'Noviembre',
    title: 'Día de Nuestra Señora de Chiquinquirá (La Chinita)',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Cultura y Tradición',
    description: 'Fiesta patronal magna del Zulia y veneración Mariana más multitudinaria del occidente venezolano: milagro de la tablita en 1709 en las aguas del Lago de Maracaibo ante una humilde lavandera en El Saladillo.',
    pedagogicalHighlight: 'Cintas, altares marianos escolares, gaitas de veneración y homenaje a la Virgen de Chiquinquirá como símbolo de hermandad marabina.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: '¡Gloria a Ti, Chinita!',
    icon: '👑',
    location: 'Basílica de Nuestra Señora de Chiquinquirá, Maracaibo'
  },
  {
    id: 'efem-glo-11-20',
    day: 20,
    month: 11,
    monthName: 'Noviembre',
    title: 'Día Universal del Niño y de los Derechos de la Infancia (UNICEF)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Derechos y Sociedad',
    description: 'Aniversario de la aprobación de la Declaración (1959) y de la Convención sobre los Derechos del Niño (1989), consagrando el interés superior del menor.',
    pedagogicalHighlight: 'Foro escolar: "Mis deberes y derechos en la escuela y el hogar", con juegos y pancartas coloridas.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Derechos del Niño',
    icon: '🧸'
  },
  {
    id: 'efem-glo-11-25',
    day: 25,
    month: 11,
    monthName: 'Noviembre',
    title: 'Día Internacional de la Eliminación de la Violencia contra la Mujer',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Derechos y Sociedad',
    description: 'Conmemoración en memoria de las hermanas Mirabal para erradicar cualquier manifestación de agresión o violencia de género.',
    pedagogicalHighlight: 'Charlas de convivencia escolar, resolución asertiva de conflictos y respeto integral mutuo.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'No a la Violencia',
    icon: '🧡'
  },
  {
    id: 'efem-ven-11-29',
    day: 29,
    month: 11,
    monthName: 'Noviembre',
    title: 'Natalicio de Don Andrés Bello (1781) y Día del Escritor',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Educación y Pedagogía',
    description: 'Nacimiento en Caracas del humanista universal, gramático de la lengua castellana, educador, poeta y legislador civilista.',
    pedagogicalHighlight: 'Concurso de redacción literaria y cuentos cortos en todos los grados de Educación Primaria y Media General.',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: 'Andrés Bello',
    icon: '🖋️'
  },

  // =========================================================================
  // DICIEMBRE
  // =========================================================================
  {
    id: 'efem-glo-12-03',
    day: 3,
    month: 12,
    monthName: 'Diciembre',
    title: 'Día Internacional de las Personas con Discapacidad (ONU)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Derechos y Sociedad',
    description: 'Fomento de la inclusión plena, accesibilidad física y cognitiva, y equidad de oportunidades para todas las personas con capacidades diversas.',
    pedagogicalHighlight: 'Dinámicas de empatía e inclusión pedagógica en las aulas con apoyo de la coordinación de bienestar.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Inclusión Plena',
    icon: '🤝'
  },
  {
    id: 'efem-glo-12-10',
    day: 10,
    month: 12,
    monthName: 'Diciembre',
    title: 'Día de los Derechos Humanos (Declaración Universal de 1948)',
    scope: 'GLOBAL',
    scopeLabel: 'Global / Internacional',
    category: 'Derechos y Sociedad',
    description: 'Aprobación por la ONU de la Declaración Universal de los Derechos Humanos, carta magna de la libertad, igualdad y dignidad inherente de todo ser humano.',
    pedagogicalHighlight: 'Exposición interactiva sobre los 30 artículos de la Declaración Universal con dibujos de los estudiantes.',
    theme: 'GLOBAL_MUNDIAL',
    suggestedTag: 'Derechos Humanos',
    icon: '⚖️'
  },
  {
    id: 'efem-zul-12-13',
    day: 13,
    month: 12,
    monthName: 'Diciembre',
    title: 'Conmemoración del Casco Histórico y Calle Carabobo de Maracaibo',
    scope: 'MARACAIBO_ZULIA',
    scopeLabel: 'Maracaibo & Edo. Zulia',
    category: 'Cultura y Tradición',
    description: 'Homenaje a la arquitectura civil tradicional de Maracaibo, sus casas con zaguanes, ventanas de hierro forjado, colores vivos y faroles del Saladillo y Santa Lucía.',
    pedagogicalHighlight: 'Taller de pintura y artes plásticas: plasmando las fachadas coloniales marabinas en acuarela.',
    isMaracaiboSpecial: true,
    theme: 'ZULIANIDAD',
    suggestedTag: 'Calle Carabobo CBA',
    icon: '🏘️',
    location: 'Sector Santa Lucía / Saladillo, Maracaibo'
  },
  {
    id: 'efem-ven-12-17',
    day: 17,
    month: 12,
    monthName: 'Diciembre',
    title: 'Paso a la Inmortalidad del Libertador Simón Bolívar (1830)',
    scope: 'VENEZUELA',
    scopeLabel: 'Venezuela',
    category: 'Historia y Soberanía',
    description: 'Conmemoración de la muerte en Santa Marta del Padre de la Patria. Lectura de su Última Proclama: "Mis últimos votos son por la felicidad de la patria".',
    pedagogicalHighlight: 'Minuto de silencio cívico a la 1:07 PM y lectura solemne de la última proclama del Libertador.',
    theme: 'PATRIO_VENEZUELA',
    suggestedTag: 'Bolívar Inmortal',
    icon: '🕊️'
  }
];

// Helper functions for filtering and querying efemérides
export function getAllEfemerides(): EfemerideItem[] {
  return EFEMERIDES_LIST;
}

export function getEfemeridesByScope(scope: EfemerideScope): EfemerideItem[] {
  return EFEMERIDES_LIST.filter(e => e.scope === scope);
}

export function getMaracaiboZuliaEfemerides(): EfemerideItem[] {
  return EFEMERIDES_LIST.filter(e => e.scope === 'MARACAIBO_ZULIA' || e.isMaracaiboSpecial);
}

export function getVenezuelaEfemerides(): EfemerideItem[] {
  return EFEMERIDES_LIST.filter(e => e.scope === 'VENEZUELA');
}

export function getGlobalEfemerides(): EfemerideItem[] {
  return EFEMERIDES_LIST.filter(e => e.scope === 'GLOBAL');
}

export function getEfemeridesByMonth(monthNumber: number): EfemerideItem[] {
  return EFEMERIDES_LIST.filter(e => e.month === monthNumber);
}

export function getCurrentMonthEfemerides(): EfemerideItem[] {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  return EFEMERIDES_LIST.filter(e => e.month === currentMonth);
}

export function searchEfemerides(
  query: string,
  scope?: 'TODOS' | EfemerideScope,
  month?: number
): EfemerideItem[] {
  const term = query.toLowerCase().trim();
  return EFEMERIDES_LIST.filter(e => {
    if (scope && scope !== 'TODOS' && e.scope !== scope) {
      return false;
    }
    if (month && month > 0 && e.month !== month) {
      return false;
    }
    if (!term) return true;
    return (
      e.title.toLowerCase().includes(term) ||
      e.description.toLowerCase().includes(term) ||
      e.pedagogicalHighlight.toLowerCase().includes(term) ||
      e.suggestedTag.toLowerCase().includes(term) ||
      (e.location && e.location.toLowerCase().includes(term))
    );
  });
}
