import { PlanQuincenal, EducationalLevel } from '../types';

export interface DidacticTemplateData {
  level: EducationalLevel;
  title: string;
  areaId: string;
  docenteName: string;
  gradeSection: string;
  lapso: 1 | 2 | 3;
  schoolYear: string;
  periodoQuincenal: string;
  startDate: string;
  endDate: string;
  componente?: string;
  temaGenerador?: string;
  projectTheme: string;
  // Campos adaptables por subsistema
  espaciosTrabajo?: string; // Inicial
  rutinaDiaria?: string; // Inicial
  ejesIntegradores?: string; // Primaria
  tipoProyecto?: string; // Primaria
  temaIndispensable?: string; // Media General
  rows: {
    id: string;
    contenidoOReferente: string;
    aprendizajesEsperados: string;
    indicadoresCompetencia: string;
    tecnicasInstrumentos: string;
    criteriosEvaluacion: string;
    ponderacionPercent?: number;
  }[];
  actividadesInicio: string;
  actividadesDesarrollo: string;
  actividadesCierre: string;
  recursos: string;
  fuentesConsulta: string;
}

export const TEMPLATE_INICIAL: DidacticTemplateData = {
  level: 'INICIAL',
  title: 'Planificación Didáctica: Descubriendo Colores, Formas y Tamaños en Nuestro Entorno',
  areaId: 'ini-ca',
  docenteName: 'Lcda. María Carolina Morales',
  gradeSection: 'Sala de 4 Años A',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'Relación entre los componentes del ambiente: procesos matemáticos, relaciones espacio-temporales y atributos de los objetos.',
  projectTheme: 'Pequeños Científicos CBA: Explorando y Creando con Formas, Colores y Tamaños',
  espaciosTrabajo: '• Espacio para Armar y Construir: Bloques lógicos, encajes geométricos y seriación de figuras.\n• Espacio para Expresar y Crear: Caballetes de pintura con esponjas y témperas de colores primarios.\n• Espacio para Representar e Imitar: Juego de roles cotidianos y dramatización con títeres.\n• Espacio para Experimentar y Descubrir: Balanzas sensoriales, canastas clasificadoras de texturas y tamaños.',
  rutinaDiaria: '• Bienvenida y Asamblea: Saludo socioafectivo, calendario y ronda de emociones.\n• Planificación del Niño: Selección autónoma del espacio lúdico de trabajo.\n• Trabajo Libre en Espacios: Exploración activa y mediación docente.\n• Orden y Limpieza: Canción "A guardar" y clasificación de juguetes.\n• Alimentación y Aseo: Lavado de manos y merienda saludable.\n• Actividades Colectivas: Juegos al aire libre con aros y balones en el patio infantil.\n• Recuento y Despedida: Ronda de intercambio sobre los aprendizajes del día.',
  rows: [
    {
      id: 'row-ini-1',
      contenidoOReferente: 'Propiedades y atributos de los objetos: Colores primarios (amarillo, azul, rojo) y mezclas secundarias (verde, naranja, morado).',
      aprendizajesEsperados: 'Identifica y nombra los colores primarios y secundarios en elementos de la naturaleza y del aula, agrupando colecciones por color.',
      indicadoresCompetencia: '• Identifica los colores primarios.\n• Identifica ciertos colores secundarios.\n• Agrupa objetos por color.',
      tecnicasInstrumentos: 'Técnica: Observación directa y vivencial.\nInstrumento: Escala de estimación cualitativa y registro descriptivo.',
      criteriosEvaluacion: '• Reconocimiento visual y verbal de los colores primarios.\n• Clasificación espontánea y guiada de objetos por tonalidad.\n• Curiosidad activa ante la mezcla cromática.'
    },
    {
      id: 'row-ini-2',
      contenidoOReferente: 'Formas geométricas básicas: triángulo, círculo y cuadrado en figuras bidimensionales y objetos tridimensionales.',
      aprendizajesEsperados: 'Discrimina, nombra y completa formas sencillas, asociando contornos con siluetas del entorno cotidiano.',
      indicadoresCompetencia: '• Agrupa por formas.\n• Completa formas sencillas.\n• Discrimina y nombra triángulo, círculo, cuadrado.',
      tecnicasInstrumentos: 'Técnica: Exploración senso-perceptiva y manipulación de material concreto.\nInstrumento: Escala de estimación y lista de cotejo gráfica.',
      criteriosEvaluacion: '• Diferenciación visual de las 3 figuras básicas.\n• Ensamblaje y completación de siluetas geométricas sencillas.\n• Precisión en la manipulación de bloques lógicos.'
    },
    {
      id: 'row-ini-3',
      contenidoOReferente: 'Relaciones de tamaño (grande, mediano, pequeño) y relaciones de orden comparativo ("más grande que", "más pequeño que"). Nociones temporales (antes - después).',
      aprendizajesEsperados: 'Compara y ordena objetos por tamaño, establece correspondencias biunívocas y relata secuencias temporales vivenciales de sus rutinas escolares.',
      indicadoresCompetencia: '• Agrupa objetos por tamaño.\n• Discrimina el tamaño de los objetos (grande, mediano, pequeño).\n• Realiza correspondencias por el tamaño de los objetos.\n• Nombra el tamaño de los objetos.\n• Reconoce la relación "más grande que".\n• Reconoce la relación "más pequeño que".\n• Vincula la noción de tiempo con las experiencias y actividades que realiza diariamente (antes - después).',
      tecnicasInstrumentos: 'Técnica: Juegos de seriación, correspondencia y diálogo en asamblea.\nInstrumento: Escala de estimación formativa y registro anedótico.',
      criteriosEvaluacion: '• Ordenamiento serial por gradación de tamaño.\n• Utilización adecuada del vocabulario comparativo.\n• Comprensión de secuencias temporales en la rutina diaria.'
    }
  ],
  actividadesInicio: '(I) Inicio:\n• Canción de bienvenida y ronda lúdica: "La ronda de los colores y las figuras saltarinas".\n• Lectura de cuento animado infantil: "¿Dónde se escondió el círculo rojo?", mostrando láminas ilustradas.\n• Diálogo de exploración previa en la alfombra mágica: ¿Qué cosas amarillas tenemos hoy en la sala? ¿Qué hacemos primero en el colegio: merendar o trabajar?',
  actividadesDesarrollo: '(D) Desarrollo:\n• Estación 1 (Arte sensorial): Experimento mágico de mezcla de colores primarios con témperas y esponjas en caballetes infantiles.\n• Estación 2 (Bloques lógicos): Búsqueda del tesoro geométrico: clasificar fichas en canastitas según sean círculos, cuadrados o triángulos.\n• Estación 3 (Mundo de tamaños): Comparar muñecos y pelotas ordenándolos del más grande al más pequeño en tapetes numerados.\n• Estación 4 (Secuencia temporal): Juego con tarjetas visuales ordenando la secuencia: "lavarse las manos antes de comer" y "guardar los juguetes después de jugar".',
  actividadesCierre: '(C) Cierre:\n• Asamblea de la palabra: Cada niño comparte con su grupo la creación o figura que más le gustó construir.\n• Rincón del orden y los juguetes: Cantamos "A guardar, a guardar" aplicando la clasificación aprendida.\n• Ronda de preguntas afectivas: ¿Qué aprendimos hoy con los colores? ¿Cómo nos sentimos jugando juntos?',
  recursos: 'Bloques lógicos de plástico, témperas no tóxicas, pinceles de mango grueso, papel bond continuo, títeres de tela, tarjetas visuales de rutinas, canastas clasificadoras de colores y tapetes sensoriales.',
  fuentesConsulta: 'Currículo de Educación Inicial (MPPE), Guía Pedagógica para la Atención de Niños de 3 a 6 Años, Proyecto Institucional de Infancia Feliz U.E. Bellas Artes.'
};

export const TEMPLATE_INICIAL_5A: DidacticTemplateData = {
  level: 'INICIAL',
  title: 'Planificación Didáctica: Geometría, Dimensiones y Orientación Espacial en el CBA',
  areaId: 'ini-ca',
  docenteName: 'Lcda. María Carolina Morales',
  gradeSection: 'Sala de 5 Años A',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'Relación entre los componentes del ambiente: procesos matemáticos, atributos geométricos, dimensiones complejas y ubicación espacial en relación con el cuerpo.',
  projectTheme: 'Exploradores STEAM CBA: Construyendo con Formas, Dimensiones y Posiciones',
  rows: [
    {
      id: 'row-ini5-1',
      contenidoOReferente: 'Formas geométricas en el entorno: Asociación de figuras bidimensionales con objetos reales. Semejanzas y diferencias.',
      aprendizajesEsperados: 'Asocia formas de objetos cotidianos con figuras geométricas y argumenta semejanzas y diferencias entre ellas.',
      indicadoresCompetencia: '• Agrupa por formas.\n• Asocia la forma de los objetos con las figuras geométricas.\n• Establece semejanzas y diferencias.',
      tecnicasInstrumentos: 'Técnica: Observación directa y cotejo vivencial.\nInstrumento: Escala de estimación cualitativa y registro descriptivo.',
      criteriosEvaluacion: '• Asociación precisa entre figura geométrica y objeto tridimensional.\n• Argumentación verbal de similitudes y discrepancias visuales.\n• Participación activa en las dinámicas de clasificación grupal.'
    },
    {
      id: 'row-ini5-2',
      contenidoOReferente: 'Dimensiones y relaciones de tamaño: grande, mediano, pequeño, alto - bajo y largo - corto. Correspondencias biunívocas.',
      aprendizajesEsperados: 'Compara y clasifica elementos del aula aplicando criterios dimensionales de altura y longitud, realizando correspondencias exactas.',
      indicadoresCompetencia: '• Agrupa objetos por tamaño.\n• Realiza correspondencias.\n• Discrimina el tamaño de los objetos (grande, mediano, pequeño, alto - bajo, largo - corto).\n• Nombra el tamaño de los objetos.',
      tecnicasInstrumentos: 'Técnica: Práctica guiada con material estructurado y regletas de Cuisenaire.\nInstrumento: Escala de estimación formativa y matriz de desempeño.',
      criteriosEvaluacion: '• Uso exacto del léxico comparativo (alto/bajo, largo/corto).\n• Precisión en el emparejamiento por correspondencia directa.\n• Ordenamiento serial progresivo sin vacilación.'
    },
    {
      id: 'row-ini5-3',
      contenidoOReferente: 'Correspondencia cromática y discriminación de colores primarios y secundarios. Nociones espaciales relacionales y esquema corporal.',
      aprendizajesEsperados: 'Realiza correspondencias por color discriminando gamas primarias y secundarias, y ubica su cuerpo y los objetos en el espacio tridimensional.',
      indicadoresCompetencia: '• Agrupa objetos por color.\n• Realiza correspondencia por color.\n• Discrimina colores primarios y secundarios.\n• Ubica objetos según su posición.\n• Establece relación entre su cuerpo y los objetos.',
      tecnicasInstrumentos: 'Técnica: Circuitos psicomotores y experimentación en mesa de luz.\nInstrumento: Registro anecdótico y escala cualitativa.',
      criteriosEvaluacion: '• Discriminación categórica entre primarios y secundarios.\n• Orientación espacial autónoma respecto a puntos de referencia.\n• Conciencia de su esquema corporal en desplazamientos.'
    }
  ],
  actividadesInicio: '(I) Inicio:\n• Canción motriz: "El baile del astronauta en el espacio geométrico".\n• Preguntas retadoras en asamblea matutina: ¿Qué objetos de nuestro salón se parecen a un cilindro o a un triángulo? ¿Quién es más alto: la maestra o la puerta?\n• Presentación del desafío quincenal: construir la maqueta del campus CBA utilizando cuerpos geométricos y regletas.',
  actividadesDesarrollo: '(D) Desarrollo:\n• Estación 1 (Geometría aplicada): Safari fotográfico en el patio escolar buscando formas geométricas y registrándolas en fichas ilustradas.\n• Estación 2 (Taller de dimensiones): Comparación de torres con bloques Lego y regletas, clasificándolas en "altas/bajas" y "largas/cortas".\n• Estación 3 (Laboratorio de color): Emparejamiento cromático avanzado usando paletas de mezclas primarias y secundarias.\n• Estación 4 (Circuito motor espacial): Laberinto de psicomotricidad donde cada niño sigue instrucciones espaciales: "pasa por debajo del arco", "colócate a la derecha del cono", "salta sobre la línea larga".',
  actividadesCierre: '(C) Cierre:\n• Exposición colectiva: "Nuestra Ciudad Geométrica", donde cada equipo describe los elementos construidos y sus dimensiones.\n• Metacognición guiada: ¿Cómo supimos si un objeto era más largo o más alto? ¿Qué color secundario descubrimos hoy?\n• Cierre afectivo: Felicitación grupal y aplauso institucional CBA.',
  recursos: 'Regletas Cuisenaire, bloques de madera y Lego, conos de psicomotricidad, aros plásticos, témperas, paletas cromáticas, cartulinas y tarjetas de nociones espaciales.',
  fuentesConsulta: 'Currículo de Educación Inicial (MPPE), Guía Pedagógica Sala de 5 Años CBA, Enfoque STEAM para la Primera Infancia.'
};

export const TEMPLATE_PRIMARIA: DidacticTemplateData = {
  level: 'PRIMARIA',
  title: 'Planificación Didáctica: Cuentos y Tradiciones Zulianas',
  areaId: 'pri-len',
  docenteName: 'Lcda. Carmen Elena Pérez',
  gradeSection: '3er Grado A y B',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'El lenguaje y la comunicación como eje de la identidad sociocultural, la creatividad y el pensamiento crítico.',
  projectTheme: 'Maracaibo en Nuestras Letras y Colores: Crónicas Infantiles',
  tipoProyecto: 'Proyecto de Aprendizaje (PA): "Guardianes de la Ciencia, las Letras y la Cultura CBA"',
  ejesIntegradores: '• Ambiente y Salud Integral: Preservación ecológica del entorno zuliano y vida activa.\n• Tecnologías de la Información y Comunicación (TIC): Uso formativo de medios y biblioteca digital.\n• Trabajo Liberador y Ciudadanía: Trabajo en equipo constructivo y valores de convivencia.',
  rows: [
    {
      id: 'row-pri-1',
      contenidoOReferente: 'Estructura de la narración: inicio, desarrollo (nudo) y desenlace en cuentos folklóricos y leyendas regionales.',
      aprendizajesEsperados: 'Produce y comprende textos narrativos breves respetando la coherencia, cohesión y estructura secuencial lógica de los relatos orales y escritos.',
      indicadoresCompetencia: '• Identifica los tres momentos principales de la narración en lecturas dirigidas.\n• Redacta párrafos coherentes empleando mayúsculas y signos de puntuación básicos.\n• Demuestra valoración por el acervo cultural y la tradición oral zuliana.',
      tecnicasInstrumentos: 'Técnica: Observación directa y análisis de producciones escritas.\nInstrumento: Escala de estimación cualitativa y registro descriptivo.',
      criteriosEvaluacion: '• Coherencia en la secuencia temporal (inicio, nudo, desenlace).\n• Legibilidad caligráfica y uso correcto del punto y la mayúscula.\n• Participación activa y respetuosa en el trabajo cooperativo.'
    },
    {
      id: 'row-pri-2',
      contenidoOReferente: 'Uso de la descripción y adjetivación para caracterizar personajes y paisajes del entorno escolar y comunitario.',
      aprendizajesEsperados: 'Enriquece sus textos mediante adjetivos calificativos pertinentes que den vivacidad y claridad a las descripciones orales y escritas.',
      indicadoresCompetencia: '• Selecciona adjetivos concordantes en género y número con el sustantivo.\n• Describe con detalle visual lugares emblemáticos del Colegio Bellas Artes.\n• Escucha con atención y respeto las descripciones elaboradas por sus pares.',
      tecnicasInstrumentos: 'Técnica: Intercambio oral y producción gráfica-escrita.\nInstrumento: Lista de cotejo descriptiva y rúbrica formativa.',
      criteriosEvaluacion: '• Concordancia de género y número.\n• Riqueza de vocabulario y precisión léxica.\n• Creatividad en la integración del texto con ilustraciones.'
    }
  ],
  actividadesInicio: '(I) Inicio:\n• Dinámica motivacional "La caja mágica de las leyendas zulianas": los niños extraen objetos alusivos al Lago y al sol marabino.\n• Activación de saberes previos mediante preguntas generadoras: ¿Quién conoce el relato del relámpago del Catatumbo? ¿Cómo comienzan los cuentos que les narran en casa?\n• Presentación del propósito de la quincena: convertirnos en jóvenes cronistas e ilustradores.',
  actividadesDesarrollo: '(D) Desarrollo:\n• Lectura guiada y coral del cuento "El cocuyo y la mora", identificando con colores en el texto proyectado el inicio (verde), el nudo (amarillo) y el desenlace (rojo).\n• Taller de redacción en parejas: creación de un final alternativo para el cuento incorporando personajes del Colegio Bellas Artes.\n• Ejercicios de adjetivación en pizarra mágica: calificar paisajes del Lago con adjetivos luminosos y coloridos.\n• Dibujo ilustrativo del personaje favorito con su descripción escrita al pie.',
  actividadesCierre: '(C) Cierre:\n• Puesta en común "El micrófono del autor": lectura voluntaria de los finales alternativos creados por cada equipo.\n• Reflexión metacognitiva guiada: ¿Qué fue lo más fácil de ordenar en la historia? ¿Cómo nos ayudaron los adjetivos?\n• Autoevaluación formativa utilizando el semáforo del aprendizaje (verde = comprendido, amarillo = dudas, rojo = necesito apoyo).',
  recursos: 'Antología de Cuentos Bellas Artes, rotafolios ilustrados, cartulinas de colores, marcadores borrables, títeres de personajes, pizarra digital y cuadernos de producción.',
  fuentesConsulta: 'Currículo de Educación Primaria (MPPE), Colección Bicentenario (Lengua y Literatura 3er Grado), Guías Didácticas Institucionales U.C.E. Colegio Bellas Artes.'
};

export const TEMPLATE_MEDIA_GENERAL: DidacticTemplateData = {
  level: 'MEDIA_GENERAL',
  title: 'Planificación Didáctica: Modelado Matemático y Arquitectura',
  areaId: 'med-mat',
  docenteName: 'Prof. Alejandro Rivas',
  gradeSection: '4to Año A y B',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  temaIndispensable: 'Ciencia, tecnología e innovación para el desarrollo productivo y soberano de la nación.',
  temaGenerador: 'Modelado geométrico, análisis de funciones parabólicas y su aplicación en la arquitectura y el diseño contemporáneo.',
  projectTheme: 'La Matemática en la Arquitectura y las Artes Plásticas del CBA',
  rows: [
    {
      id: 'row-med-1',
      contenidoOReferente: 'Funciones cuadráticas: forma canónica, vértice, eje de simetría, raíces reales y discriminante. Análisis gráfico de la concavidad.',
      aprendizajesEsperados: 'Resuelve y analiza de manera analítica y gráfica funciones de segundo grado, deduciendo sus elementos característicos y justificando su comportamiento gráfico.',
      indicadoresCompetencia: '• Determina algebraicamente las coordenadas del vértice y puntos de intersección con los ejes cartesianos.\n• Traza la curva parabólica con exactitud métrica y confirma su concordancia con el discriminante.\n• Argumenta con rigor matemático el sentido de la concavidad en relación con el coeficiente cuadrático.',
      tecnicasInstrumentos: 'Técnica: Prueba escrita individual de resolución de problemas.\nInstrumento: Rúbrica analítica por niveles de desempeño.',
      criteriosEvaluacion: '• Rigor algorítmico y justificación de cada paso de despeje.\n• Precisión geométrica en la gráfica milimetrada.\n• Coherencia en la conclusión analítica del discriminante.',
      ponderacionPercent: 15
    },
    {
      id: 'row-med-2',
      contenidoOReferente: 'Aplicaciones del modelo parabólico: trayectorias de tiro oblicuo y diseño estructural de arcos arquitectónicos en Bellas Artes.',
      aprendizajesEsperados: 'Modela matemáticamente situaciones reales de física y arquitectura calculando altura máxima, alcance y ecuaciones de ajuste parabólico.',
      indicadoresCompetencia: '• Modela la altura máxima y el tiempo de vuelo empleando el vértice de la función horaria.\n• Diseña a escala un arco parabólico para una maqueta estructural del campus escolar.\n• Expone y defiende oralmente el informe técnico ante el colectivo de aula.',
      tecnicasInstrumentos: 'Técnica: Proyecto experimental grupal y sustentación oral.\nInstrumento: Escala de valoración de proyecto y lista de cotejo de oratoria.',
      criteriosEvaluacion: '• Dominio conceptual y sustento del modelo matemático aplicado.\n• Calidad técnica del prototipo o maqueta digital en GeoGebra.\n• Trabajo colaborativo, distribución equitativa y puntualidad.',
      ponderacionPercent: 15
    }
  ],
  actividadesInicio: '(I) Inicio:\n• Proyección de clip documental (3 min): "La parábola en las grandes obras arquitectónicas del mundo (Calatrava y Gaudí)".\n• Discusión socrática orientada: ¿Por qué las antenas receptoras y los arcos de puentes tienen forma parabólica y no circular o triangular?\n• Planteamiento del reto quincenal: modelar analítica y digitalmente una estructura real del campus usando GeoGebra.',
  actividadesDesarrollo: '(D) Desarrollo:\n• Deducción algebraica y demostración guiada de las fórmulas del vértice y la forma estándar f(x) = a(x-h)² + k.\n• Práctica guiada con software GeoGebra en laptops del laboratorio escolar para visualizar el impacto del coeficiente "a" en la apertura.\n• Resolución colaborativa en equipos de trabajo del taller de aplicación: cálculo de trayectorias y dimensionamiento de arcos parabólicos.\n• Asesoría pedagógica diferenciada en mesas de trabajo para despejes algebraicos de alta complejidad.',
  actividadesCierre: '(C) Cierre:\n• Plenaria de verificación rápida con preguntas conceptuales usando pizarras individuales ("Flash Questions").\n• Síntesis colectiva de las propiedades fundamentales de la parábola consolidada en mapa mental sinóptico.\n• Indicaciones metodológicas para la entrega del informe del proyecto experimental y asignación de lecturas complementarias.',
  recursos: 'Pizarra digital interactiva, video beam, laptops con software GeoGebra 6.0, calculadoras científicas, papel milimetrado y guías de ejercicios CBA.',
  fuentesConsulta: 'Stewart, J. "Precálculo: Matemáticas para el cálculo" (7ma Edición), Colección Bicentenario (Matemática 4to Año), Repositorio Digital U.C.E. Colegio Bellas Artes.'
};

export const BLANK_PRIMARIA_PLAN: DidacticTemplateData = {
  level: 'PRIMARIA',
  title: 'Nueva Planificación Didáctica - Primaria',
  areaId: 'pri-len',
  docenteName: '',
  gradeSection: '',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '',
  startDate: '2026-10-01',
  endDate: '2026-10-15',
  componente: '',
  projectTheme: '',
  rows: [
    {
      id: `row-pri-${Date.now()}`,
      contenidoOReferente: '',
      aprendizajesEsperados: '',
      indicadoresCompetencia: '',
      tecnicasInstrumentos: '',
      criteriosEvaluacion: ''
    }
  ],
  actividadesInicio: '(I) Inicio:\n',
  actividadesDesarrollo: '(D) Desarrollo:\n',
  actividadesCierre: '(C) Cierre:\n',
  recursos: '',
  fuentesConsulta: ''
};

export const BLANK_MEDIA_PLAN: DidacticTemplateData = {
  level: 'MEDIA_GENERAL',
  title: 'Nueva Planificación Didáctica - Media General',
  areaId: 'med-mat',
  docenteName: '',
  gradeSection: '',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '',
  startDate: '2026-10-01',
  endDate: '2026-10-15',
  temaGenerador: '',
  projectTheme: '',
  rows: [
    {
      id: `row-med-${Date.now()}`,
      contenidoOReferente: '',
      aprendizajesEsperados: '',
      indicadoresCompetencia: '',
      tecnicasInstrumentos: '',
      criteriosEvaluacion: '',
      ponderacionPercent: 10
    }
  ],
  actividadesInicio: '(I) Inicio:\n',
  actividadesDesarrollo: '(D) Desarrollo:\n',
  actividadesCierre: '(C) Cierre:\n',
  recursos: '',
  fuentesConsulta: ''
};

export const BLANK_INICIAL_PLAN: DidacticTemplateData = {
  level: 'INICIAL',
  title: 'Nueva Planificación Didáctica - Educación Inicial',
  areaId: 'ini-ca',
  docenteName: '',
  gradeSection: 'Sala de 4 Años A',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '',
  startDate: '2026-10-01',
  endDate: '2026-10-15',
  componente: '',
  projectTheme: '',
  rows: [
    {
      id: `row-ini-${Date.now()}`,
      contenidoOReferente: '',
      aprendizajesEsperados: '',
      indicadoresCompetencia: '',
      tecnicasInstrumentos: '',
      criteriosEvaluacion: ''
    }
  ],
  actividadesInicio: '(I) Inicio:\n',
  actividadesDesarrollo: '(D) Desarrollo:\n',
  actividadesCierre: '(C) Cierre:\n',
  recursos: '',
  fuentesConsulta: ''
};

export const TEMPLATE_INICIAL_AP_4A: DidacticTemplateData = {
  level: 'INICIAL',
  title: 'Planificación Didáctica: Taller de Expresión Plástica y Sensomotricidad CBA',
  areaId: 'ini-ap',
  docenteName: 'Lcda. María Carolina Morales',
  gradeSection: 'Sala de 4 Años A',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'Expresión plástica, coordinación visomotriz y autonomía funcional en la manipulación de objetos.',
  projectTheme: 'Pequeños Artistas CBA: Manos Creativas en Acción',
  rows: [
    {
      id: 'row-ini-ap4-1',
      contenidoOReferente: 'Modelado y técnicas de transformación de materiales maleables (plastilina). Rasgado de papel libre y en línea recta.',
      aprendizajesEsperados: 'Amasa y aplana plastilina para modelar figuras y ejercita la fuerza digital mediante rasgado libre y en línea recta.',
      indicadoresCompetencia: '• Amasa plastilina para modelar figuras.\n• Aplana plastilina para modelar figuras.\n• Rasga libremente.\n• Rasga en línea recta.',
      tecnicasInstrumentos: 'Técnica: Observación directa y vivencial.\nInstrumento: Escala de estimación cualitativa y registro descriptivo.',
      criteriosEvaluacion: '• Control del tono muscular palmar y digital.\n• Precisión en el rasgado continuo siguiendo una línea guía.\n• Disfrute sensorial en el modelado.'
    },
    {
      id: 'row-ini-ap4-2',
      contenidoOReferente: 'Coordinación visomotriz: Ensartado con orificio grande, construcción de torres de 2 piezas, encastre de formas grandes y armado de figuras con piezas grandes.',
      aprendizajesEsperados: 'Desarrolla coordinación ojo-mano mediante el ensartado, encastre y armado de piezas y estructuras lúdicas.',
      indicadoresCompetencia: '• Ensarta objetos con orificio grande.\n• Construye torres de dos piezas.\n• Encaja formas grandes.\n• Arma figuras con juegos de piezas grandes.',
      tecnicasInstrumentos: 'Técnica: Juegos de encastre y construcción guiada.\nInstrumento: Escala de estimación cualitativa y observación directa.',
      criteriosEvaluacion: '• Coordinación bimanual y equilibrio en torres.\n• Discriminación de siluetas al encajar figuras grandes.\n• Perseverancia y destreza óculo-manual.'
    },
    {
      id: 'row-ini-ap4-3',
      contenidoOReferente: 'Expresión gráfica y prensión de útiles escolares: Coloreado respetando contornos en figuras grandes, trazado de monigotes y figuras definidas, y manipulación de lápiz, creyón y pincel. Autonomía funcional (destapar envases y abrir lonchera).',
      aprendizajesEsperados: 'Colorea figuras grandes respetando límites, representa figuras humanas iniciales (monigotes) y manipula útiles e instrumentos con destreza motriz y autonomía.',
      indicadoresCompetencia: '• Colorea figuras grandes respetando el contorno.\n• Traza formas sencillas (monigotes, renacuajos, bolitas).\n• Traza figuras más definidas.\n• Manipula el lápiz, el creyón y el pincel con facilidad.\n• Destapa envases sin rosca.\n• Abre y cierra la lonchera.',
      tecnicasInstrumentos: 'Técnica: Registro gráfico y observación de rutinas.\nInstrumento: Portafolio de arte infantil y escala de estimación.',
      criteriosEvaluacion: '• Presa tridigital funcional del lápiz y pincel.\n• Respeto gradual de contornos en superficies amplias.\n• Autonomía en el manejo de su lonchera y útiles escolares.'
    }
  ],
  actividadesInicio: '(I) Inicio:\n• Canción sensorial: "Mis manitas trabajadoras".\n• Presentación del rincón de arte y las mesas de experimentación con masas de colores, papeles brillantes y bloques.\n• Diálogo motivador: ¿Qué figuras podemos crear con nuestras manos? ¿Cómo abrimos nuestros envases sin ayuda?',
  actividadesDesarrollo: '(D) Desarrollo:\n• Estación 1 (Mundo de plastilina): Amasar y aplanar masas con rodillos infantiles para crear figuras y animales fantásticos.\n• Estación 2 (Taller de rasgado): Rasgar tiras de papel crepé y lustre, primero de forma libre y luego siguiendo caminos rectos dibujados en papel bond.\n• Estación 3 (Encastre y torres): Juegos con ensartables de cuentas gigantes, ensamble de torres de dos piezas y cajas de formas grandes.\n• Estación 4 (Grafismo y dibujo): Caballetes de pintura con pinceles gruesos y creyones de cera: coloreado de figuras grandes y trazado libre de "monigotes" y caras sonrientes.\n• Momento de merienda y autonomía: Práctica guiada de destapar envases plásticos y abrir/cerrar loncheras de forma independiente.',
  actividadesCierre: '(C) Cierre:\n• Ronda de creadores: Cada niño muestra su producción plástica y comparte qué parte de su monigote dibujó primero.\n• Galería de sala: Colocar las obras en el mural expositor "Artistas Bellas Artes".\n• Canto de orden y despedida: "A guardar los pinceles y las plastilinas".',
  recursos: 'Plastilinas hipoalergénicas, rodillos plásticos, papel bond, papel crepé y lustre, cuentas grandes de ensartar con cordones gruesos, bloques de construcción gigantes, creyones triangulares gruesos, témperas no tóxicas, pinceles de cerda suave, envases y loncheras de práctica.',
  fuentesConsulta: 'Currículo de Educación Inicial (MPPE), Desarrollo Psicomotor en la Primera Infancia, Proyecto Institucional de Arte CBA.'
};

export const TEMPLATE_INICIAL_AP_5A: DidacticTemplateData = {
  level: 'INICIAL',
  title: 'Planificación Didáctica: Taller de Creación Plástica, Recorte y Modelado Tridimensional CBA',
  areaId: 'ini-ap',
  docenteName: 'Lcda. María Carolina Morales',
  gradeSection: 'Sala de 5 Años A',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'Expresión plástica: modelado tridimensional, técnicas con tijeras, coordinación visomotriz fina y dibujo figurativo estructurado.',
  projectTheme: 'Atelier de Creadores STEAM CBA: Escultura, Tijeras y Color',
  rows: [
    {
      id: 'row-ini-ap5-1',
      contenidoOReferente: 'Modelado y escultura tridimensional: Amasado, aplanado y construcción de figuras y modelos volumétricos sencillos.',
      aprendizajesEsperados: 'Modela, aplana y compone figuras tridimensionales complejas demostrando destreza y control manual.',
      indicadoresCompetencia: '• Amasa para formar modelos.\n• Aplana para formar modelos.\n• Construye figuras sencillas.',
      tecnicasInstrumentos: 'Técnica: Escultura y modelado con masa de sal y arcilla blanca.\nInstrumento: Escala de estimación cualitativa y registro descriptivo.',
      criteriosEvaluacion: '• Transformación intencional de la masa en figuras con identidad.\n• Ensamblaje de partes para crear una figura tridimensional.\n• Creatividad y perseverancia en la tarea.'
    },
    {
      id: 'row-ini-ap5-2',
      contenidoOReferente: 'Técnicas de rasgado y uso instrumental de tijeras: Rasgado libre y en líneas rectas; corte libre y sobre líneas rectas continuas.',
      aprendizajesEsperados: 'Domina la tijera escolar de seguridad cortando libremente y siguiendo líneas rectas, complementado con rasgado de precisión.',
      indicadoresCompetencia: '• Rasga libremente.\n• Rasga líneas rectas.\n• Recorta libremente.\n• Recorta líneas rectas.',
      tecnicasInstrumentos: 'Técnica: Práctica de tijeras y collage geométrico.\nInstrumento: Escala de estimación cualitativa y portafolio de cortes.',
      criteriosEvaluacion: '• Correcta postura de la mano y presa digital de la tijera.\n• Coordinación óculo-manual al guiar la tijera sobre la línea recta.\n• Seguridad y control motriz en el corte de papel.'
    },
    {
      id: 'row-ini-ap5-3',
      contenidoOReferente: 'Coordinación visomotriz fina y estructuras espaciales: Ensartado con orificio grande y pequeño, torres de varias piezas, encastre de figuras pequeñas y armado de figuras con juegos de piezas grandes.',
      aprendizajesEsperados: 'Demuestra alta precisión en ensartado con cuentas pequeñas, encastre fino y equilibrio en torres de múltiples niveles.',
      indicadoresCompetencia: '• Ensarta objetos con orificio grande.\n• Ensarta objetos con orificio pequeño.\n• Construye torres de varias piezas.\n• Encaja figuras pequeñas.\n• Arma figuras con juegos de piezas grandes.',
      tecnicasInstrumentos: 'Técnica: Retos de precisión visomotriz y ensamble espacial.\nInstrumento: Escala de estimación formativa y cotejo gráfico.',
      criteriosEvaluacion: '• Precisión de pinza fina en cuentas de orificio pequeño.\n• Equilibrio arquitectónico y paciencia en torres multinivel.\n• Orientación espacial en encastres reducidos.'
    },
    {
      id: 'row-ini-ap5-4',
      contenidoOReferente: 'Expresión gráfica y dibujo figurativo: Coloreado respetando contornos en figuras grandes y pequeñas, trazado de formas sencillas y figuras más definidas con detalles corporales.',
      aprendizajesEsperados: 'Colorea con control del frenado motor respetando límites en áreas grandes y pequeñas y dibuja figuras humanas y objetos con detalles definidos.',
      indicadoresCompetencia: '• Colorea figuras grandes respetando el contorno.\n• Colorea figuras pequeñas respetando el contorno.\n• Traza formas sencillas (monigotes, renacuajos, bolitas).\n• Traza figuras más definidas.',
      tecnicasInstrumentos: 'Técnica: Dibujo libre y dirigido en atril.\nInstrumento: Portafolio artístico y rúbrica cualitativa de expresión gráfica.',
      criteriosEvaluacion: '• Respeto del límite en contornos pequeños sin desbordes.\n• Representación gráfica rica en detalles (ojos, boca, dedos, ropa).\n• Uso intencional y variado de colores.'
    }
  ],
  actividadesInicio: '(I) Inicio:\n• Rutina de gimnasia cerebral para manos: "Dedos ágiles, tijeras mágicas".\n• Presentación del atelier de escultura: arcillas, cartulinas, tijeras de punta roma y cuentas de precisión.\n• Pregunta detonante: ¿Cómo podemos hacer que una masa plana se convierta en una estatua de pie? ¿Quién sabe usar la tijera como un peluquero experto?',
  actividadesDesarrollo: '(D) Desarrollo:\n• Estación 1 (Escultores CBA): Modelado tridimensional de figuras de animales y personajes combinando bolas, cilindros y detalles finos.\n• Estación 2 (Taller de recorte): Circuito de corte de papel: "cortar las hojas del árbol", siguiendo líneas rectas con tijeras escolares.\n• Estación 3 (Encastre y ensartado de alta precisión): Ensartado de mostacillones y cuentas pequeñas en hilos rígidos para collares matemáticos, encastre de mosaicos pequeños y torres de equilibrio con más de 8 bloques.\n• Estación 4 (Atelier gráfico): Composición con creyones finos y témperas: coloreado de mosaicos con figuras grandes y pequeñas respetando rigurosamente los bordes, seguido de autorretrato figurativo con cuerpo completo y fondo.',
  actividadesCierre: '(C) Cierre:\n• Exposición "Vernissage CBA": Los niños montan su museo de aula con las esculturas y recortes creados.\n• Asamblea de reflexión metacognitiva: ¿Qué fue más retador: recortar derecho o ensartar las cuentas pequeñas? ¿Cómo logramos no salirnos del contorno?\n• Ritual de cuidado de los materiales y agradecimiento en equipo.',
  recursos: 'Tijeras escolares de seguridad (punta roma), arcilla moldeable / masas de modelado, cartulinas de colores con líneas guía impresas, cuentas y mostacillones de orificio pequeño y grande con cordeles, mosaicos de encastre pequeño, bloques de madera apilables, creyones de madera y ceras, témperas y pinceles.',
  fuentesConsulta: 'Currículo de Educación Inicial (MPPE), Desarrollo de la Grafomotricidad y la Prensión, Manual Pedagógico Sala de 5 Años CBA.'
};

export const TEMPLATE_INICIAL_EF_4A: DidacticTemplateData = {
  level: 'INICIAL',
  title: 'Planificación Didáctica: Expresión Corporal, Equilibrio y Saltabilidad CBA',
  areaId: 'ini-ef',
  docenteName: 'Prof. Nelson Martínez',
  gradeSection: 'Sala de 4 Años A',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'Expresión corporal, esquema somatognósico, equilibrio dinámico y habilidades motrices básicas.',
  projectTheme: 'Cuerpo en Movimiento CBA: Pequeños Atletas en Acción',
  rows: [
    {
      id: 'row-ini-ef4-1',
      contenidoOReferente: 'Equilibrio dinámico en desplazamientos lineales con variaciones de velocidad (caminar, trotar, correr). Reconocimiento somatognósico del cuerpo.',
      aprendizajesEsperados: 'Mantiene el equilibrio corporal sobre trayectorias rectas regulando cambios de ritmo y reconoce los segmentos de su cuerpo a la voz de mando.',
      indicadoresCompetencia: '• Realiza equilibrio a través de una línea recta, con diferentes cambios de ritmo (caminando, trotando, corriendo).\n• Reconoce todas sus partes del cuerpo a través de diferentes ejercicios a la voz del mando del profesor.',
      tecnicasInstrumentos: 'Técnica: Observación directa y cotejo psicomotor.\nInstrumento: Escala de estimación cualitativa y registro anecdotario motriz.',
      criteriosEvaluacion: '• Estabilidad postural y control en cambios de velocidad.\n• Identificación corporal inmediata ante la consigna verbal.\n• Disfrute y confianza en el movimiento lúdico.'
    },
    {
      id: 'row-ini-ef4-2',
      contenidoOReferente: 'Velocidad de reacción, desplazamientos en zigzag entre conos y saltabilidad bipodal y unipodal superando aros y mini vallas.',
      aprendizajesEsperados: 'Desarrolla agilidad y rapidez de reacción al desplazarse esquivando obstáculos y coordina saltos con ambos pies y en un solo pie.',
      indicadoresCompetencia: '• Realiza de manera correcta la prueba de velocidad - reacción, desplazándose en zigzag por medio de unos conos.\n• Ejecuta circuito de salto bipodal - unipodal, superando obstáculos en el camino de aros y mini vallas.',
      tecnicasInstrumentos: 'Técnica: Circuito lúdico de agilidad.\nInstrumento: Escala de estimación cualitativa y lista de cotejo.',
      criteriosEvaluacion: '• Coordinación en cambios bruscos de dirección sin derribar conos.\n• Despegue y recepción armónica en saltos bipodales y unipodales.\n• Respeto del turno y seguimiento de normas de seguridad.'
    }
  ],
  actividadesInicio: '(I) Inicio:\n• Canción motriz de bienvenida: "La marcha del cuerpo sano".\n• Activación articular y calentamiento dinámico: círculos de brazos, balanceo de piernas y respiración profunda en el patio techado CBA.\n• Juego de calentamiento somatognósico: "El profesor manda a tocar la cabeza, rodillas, codos y tobillos".',
  actividadesDesarrollo: '(D) Desarrollo:\n• Estación 1 (Líneas mágicas de equilibrio): Desplazamiento sobre líneas marcadas en la cancha: primero paso lento de gigante, luego trote suave de ardilla y carrera controlada de guepardo sin salirse de la línea.\n• Estación 2 (El tren del cuerpo): Juego en parejas señalando y moviendo segmentos corporales a distintas alturas (arriba, al medio, abajo).\n• Estación 3 (Pista de velocidad y zigzag): Carrera de velocidad y reacción sorteando 5 conos en zigzag con campana de llegada.\n• Estación 4 (Circuito de saltadores): Despegue a dos pies dentro de aros de colores y salto unipodal sobre mini vallas de espuma de baja altura.',
  actividadesCierre: '(C) Cierre:\n• Vuelta a la calma y relajación: "El globo que se desinfla", ejercicios de inhalación y exhalación sobre colchonetas.\n• Ronda reflexiva: ¿Qué parte del cuerpo saltó más hoy? ¿Cómo sentimos nuestro corazón al correr?\n• Hidratación guiada y felicitación colectiva.',
  recursos: 'Conos deportivos, aros de psicomotricidad de colores, mini vallas de espuma acolchadas, líneas de tiza/cinta en cancha, colchonetas infantiles y silbato pedagógico.',
  fuentesConsulta: 'Currículo de Educación Inicial (MPPE), Guía de Psicomotricidad Infantil y Desarrollo Motor de 3 a 6 Años, Proyecto de Bienestar Físico CBA.'
};

export const TEMPLATE_INICIAL_EF_5A: DidacticTemplateData = {
  level: 'INICIAL',
  title: 'Planificación Didáctica: Resistencia Aeróbica, Lateralidad y Circuitos Motrices CBA',
  areaId: 'ini-ef',
  docenteName: 'Prof. Nelson Martínez',
  gradeSection: 'Sala de 5 Años A',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'Expresión corporal, ejercicios de lateralidad, resistencia cardiovascular por intervalos, circuitos motrices combinados y coordinación óculo-manual.',
  projectTheme: 'Atletas CBA en Acción: Fuerza, Coordinación y Lateralidad',
  rows: [
    {
      id: 'row-ini-ef5-1',
      contenidoOReferente: 'Resistencia aeróbica por intervalos (caminar - trotar por 5 minutos) y lateralidad espacial orientada (izquierda - derecha) con obstáculos.',
      aprendizajesEsperados: 'Regula su respiración y esfuerzo físico en intervalos continuos y discrimina con precisión su lado izquierdo y derecho al esquivar conos y saltar obstáculos con velocidad.',
      indicadoresCompetencia: '• Realiza prueba de intervalo caminando - trotando por un tiempo estimado de 5 minutos.\n• Ejecuta prueba de izquierda - derecha entre conos para proceder a saltar las mini vallas, aros y culminar con velocidad.',
      tecnicasInstrumentos: 'Técnica: Test motriz continuo adaptado y observación cronometrada.\nInstrumento: Escala de estimación cualitativa y registro de resistencia aeróbica.',
      criteriosEvaluacion: '• Dosificación energética y tolerancia al esfuerzo continuo.\n• Orientación espacial inmediata distinguiendo izquierda y derecha.\n• Conexión fluida del salto con el sprint final.'
    },
    {
      id: 'row-ini-ef5-2',
      contenidoOReferente: 'Circuito motriz integrado (velocidad, reacción, saltos bipodal-unipodal y zigzag) y coordinación visomotora óculo-manual con pelotas estáticas y en movimiento.',
      aprendizajesEsperados: 'Ejecuta circuitos motrices complejos de forma autónoma y demuestra precisión óculo-manual en el lanzamiento, recepción y bote de pelotas de diverso tamaño.',
      indicadoresCompetencia: '• Realiza de manera correcta el circuito motriz, en sus diferentes estaciones de: velocidad, reacción, salto bipodal – unipodal y zigzag.\n• Trabaja la visión óculo manual correctamente con pelota pequeña / grande de forma estática y con movimiento.',
      tecnicasInstrumentos: 'Técnica: Circuito de destrezas polideportivas y retos visomotores.\nInstrumento: Rúbrica cualitativa de coordinación motriz y escala de estimación.',
      criteriosEvaluacion: '• Fluidez en la transición entre estaciones del circuito.\n• Precisión en la trayectoria y control de la pelota en carrera y quietud.\n• Dominio segmentario y actitud positiva ante retos motrices.'
    }
  ],
  actividadesInicio: '(I) Inicio:\n• Saludo deportivo y gimnasia de activación cardiovascular: "El semáforo motriz del CBA".\n• Ejercicios dinámicos de calentamiento y movilidad articular: trote suave perimetral, skipping bajo y estiramientos activos.\n• Activación de lateralidad: marcar muñequera roja en mano derecha y azul en mano izquierda para afianzar el reconocimiento direccional.',
  actividadesDesarrollo: '(D) Desarrollo:\n• Estación 1 (Reto de resistencia aeróbica): Prueba de intervalo guiada alrededor de la pista durante 5 minutos alternando un minuto caminando de recuperación y un minuto trotando a ritmo constante.\n• Estación 2 (Desafío de lateralidad izquierda-derecha): Circuito donde a la señal del profesor el estudiante quiebra a la izquierda o derecha entre conos, salta inmediatamente dos mini vallas y remata a máxima velocidad.\n• Estación 3 (Gran Circuito Motriz Integral): Estación 1: salida explosiva de reacción; Estación 2: zigzag cerrado; Estación 3: salto bipodal en aros; Estación 4: salto unipodal sobre valla baja.\n• Estación 4 (Taller óculo-manual con pelotas): Lanzamiento y recepción de pelota grande y pequeña estática contra pared, y luego en desplazamiento con botes controlados y pase al compañero.',
  actividadesCierre: '(C) Cierre:\n• Fase de recuperación cardíaca y estiramiento muscular pasivo: "Respiración de la montaña".\n• Puesta en común: ¿Cómo logramos no confundir la izquierda con la derecha? ¿Qué pelota fue más fácil atrapar al correr?\n• Felicitación por el espíritu deportivo y rehidratación.',
  recursos: 'Pelotas de goma grandes y pequeñas, conos de señalización, mini vallas graduables, aros de psicomotricidad, cronómetro, colchonetas, cintas de lateralidad rojas y azules.',
  fuentesConsulta: 'Currículo de Educación Inicial (MPPE), Desarrollo de la Lateralidad y la Resistencia Infantil, Guía Metodológica de Educación Física CBA.'
};

export const TEMPLATE_INICIAL_NAT_4A: DidacticTemplateData = {
  level: 'INICIAL',
  title: 'Planificación Didáctica: Familiarización y Seguridad en el Medio Acuático CBA',
  areaId: 'ini-nat',
  docenteName: 'Prof. Nelson Martínez',
  gradeSection: 'Sala de 4 Años A',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'Adaptación al medio acuático, respiración buconasal básica, propulsión asistida y flotabilidad dorsal elemental.',
  projectTheme: 'Gotitas Felices CBA: Descubriendo el Agua con Confianza y Alegría',
  rows: [
    {
      id: 'row-ini-nat4-1',
      contenidoOReferente: 'Familiarización desde el borde de piscina con pies en punta y respiración buconasal mediante burbujitas progresivas debajo del agua.',
      aprendizajesEsperados: 'Adquiere seguridad y confianza en la piscina ejecutando patada continua desde el borde y controla la respiración buconasal mediante burbujas sumergidas.',
      indicadoresCompetencia: '• Se familiariza con el medio acuático, sintiéndose seguro(a) en el borde sentado(a), colocando los pies en punta para realizar patadas.\n• Realiza burbujitas de manera progresiva, tomando aire por la boca y expulsándolo por la nariz debajo del agua.',
      tecnicasInstrumentos: 'Técnica: Observación directa en piscina y vivencia lúdica acuática.\nInstrumento: Escala de estimación cualitativa y registro anecdótico de inmersión.',
      criteriosEvaluacion: '• Seguridad afectiva y disfrute sin temor en el borde de la piscina.\n• Correcta postura de pies en punta al patear la superficie del agua.\n• Exhalación nasal bajo el agua sin tragar agua.'
    },
    {
      id: 'row-ini-nat4-2',
      contenidoOReferente: 'Propulsión asistida con tabla mediante patada de estilo libre en desplazamiento y flotación dorsal asistida con relajación corporal.',
      aprendizajesEsperados: 'Se desplaza en el agua sujetando la tabla con apoyo del profesor mediante patada de crol y experimenta la posición dorsal relajada con soporte.',
      indicadoresCompetencia: '• Se siente en confianza en tomar la tabla con las dos manos y con la ayuda del profesor realizar patada de libre con desplazamiento.\n• Se mantiene tranquilo(a) en flotación dorsal por unos segundos con la ayuda del profesor.',
      tecnicasInstrumentos: 'Técnica: Práctica guiada con material de apoyo y acompañamiento docente.\nInstrumento: Escala de estimación cualitativa.',
      criteriosEvaluacion: '• Sujeción firme de la tabla con ambas manos y patada activa.\n• Relajación muscular del cuello y tronco en decúbito dorsal asistido.\n• Respeta las normas de seguridad e higiene de la piscina CBA.'
    }
  ],
  actividadesInicio: '(I) Inicio:\n• Ducha pedagógica y repaso cantado de las normas de la piscina CBA: "Al agua con cuidado, escuchando al profesor".\n• Sentada en el borde perimetral: chapoteo y lluvia de pies en punta con canciones lúdicas ("Burbujitas de colores").\n• Ejercicio respiratorio de introducción: soplar barquitos de plástico sobre la superficie del agua.',
  actividadesDesarrollo: '(D) Desarrollo:\n• Estación 1 (Pies en punta y batido acuático): Sentados en el borde con piernas extendidas, batido alternado de pies en punta levantando espuma blanca.\n• Estación 2 (El volcán de burbujitas): Inmersión buconasal progresiva; primero la barbilla, luego boca y nariz sumergidas soplando burbujas continuas para apagar la "vela submarina".\n• Estación 3 (Paseo en lancha con tabla): Tomando la tabla con ambas manos por los extremos y asistidos por el docente que guía el avance, patada continua de libre a lo largo del carril infantil.\n• Estación 4 (Estrellitas de mar en el cielo): En decúbito dorsal sostenidos por la espalda y nuca por el profesor, mirada fija al cielo y cuerpo relajado durante 5 a 10 segundos.',
  actividadesCierre: '(C) Cierre:\n• Ronda acuática de despedida: "Pez payaso CBA que nada a descansar".\n• Salida ordenada de la piscina por escaleras de seguridad con apoyo docente.\n• Secado corporal, calzado de sandalias y refuerzo verbal de los logros del día.',
  recursos: 'Piscina pedagógica templada CBA, tablas de flotación ergonómicas infantiles, barquitos flotantes de goma, aros sumergibles y material visual de apoyo.',
  fuentesConsulta: 'Currículo de Educación Inicial (MPPE), Guía Pedagógica de Natación Formativa Infantil CBA, Protocolos de Seguridad Acuática Escolar.'
};

export const TEMPLATE_INICIAL_NAT_5A: DidacticTemplateData = {
  level: 'INICIAL',
  title: 'Planificación Didáctica: Nado de Flecha, Flotación Dorsal y Brazada de Crol CBA',
  areaId: 'ini-nat',
  docenteName: 'Prof. Nelson Martínez',
  gradeSection: 'Sala de 5 Años A',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'Propulsión acuática hidrodinámica, respiración coordinada con patada, posición de flecha, flotación dorsal autónoma e iniciación a la brazada de libre.',
  projectTheme: 'Tiburoncitos y Sirenas CBA: Hidrodinámica, Velocidad y Seguridad Acuática',
  rows: [
    {
      id: 'row-ini-nat5-1',
      contenidoOReferente: 'Desplazamiento propulsivo coordinando burbujas continuas con tabla y ejecución de la posición hidrodinámica de flecha con cabeza sumergida.',
      aprendizajesEsperados: 'Sincroniza la exhalación continua bajo el agua mientras propulsa con patada y tabla, y adopta la posición de flecha perfecta nadando hacia el profesor.',
      indicadoresCompetencia: '• Realiza burbujitas al mismo tiempo tomando la tabla para avanzar con la patada de libre con el acompañamiento del profesor.\n• Ejecuta el nado de flecha de manera eficiente, tomando en cuenta una mano encima de la otra, cabeza sumergida y patada constante, nadando hacia dirección del profesor.',
      tecnicasInstrumentos: 'Técnica: Prueba técnica acuática y observación directa.\nInstrumento: Escala de estimación cualitativa y registro de destreza motriz en agua.',
      criteriosEvaluacion: '• Continuidad de la patada al exhalar burbujitas sin detener el avance.\n• Postura de flecha: manos superpuestas, brazos estirados, cabeza entre hombros y patada activa.\n• Orientación espacial rectilínea hacia el objetivo.'
    },
    {
      id: 'row-ini-nat5-2',
      contenidoOReferente: 'Flotación en decúbito dorsal (con tabla abrazada y progresión autónoma sin implemento) e iniciación a la brazada de estilo libre con tabla.',
      aprendizajesEsperados: 'Domina la flotación dorsal autónoma sin implementos y coordina la tracción alterna de brazos de estilo libre manteniendo horizontalidad.',
      indicadoresCompetencia: '• Se siente seguro(a) y relajado(a) en hacer flotación dorsal abrazando la tabla, para luego hacerlo sin implemento.\n• Realiza la brazada del estilo libre con tabla, manteniendo la flotación horizontal y patada en movimiento alterna.',
      tecnicasInstrumentos: 'Técnica: Demostración técnica y circuito acuático por estaciones.\nInstrumento: Escala de estimación cualitativa y rúbrica formativa.',
      criteriosEvaluacion: '• Autonomía y relajación en flotación dorsal sin apoyo por más de 5 segundos.\n• Alternancia y amplitud en la tracción de brazos de estilo libre.\n• Alineación horizontal de la cadera evitando el hundimiento de piernas.'
    }
  ],
  actividadesInicio: '(I) Inicio:\n• Ducha previa y calentamiento neuromuscular en la orilla: flexiones plantares, círculos articulares de brazos y estiramiento de dorsales.\n• Activación de la posición de flecha en seco: postura de pie con manos superpuestas y brazos pegados a las orejas.\n• Repaso de los objetivos de la sesión: "Hoy seremos flechas submarinas y nadaremos como delfines".',
  actividadesDesarrollo: '(D) Desarrollo:\n• Estación 1 (Propulsión y burbujas coordinadas): Desplazamiento de 10 metros sujetando la tabla al frente, sumergiendo rostro para soplar burbujas continuas mientras se mantiene patada potente de estilo libre.\n• Estación 2 (El torpedo / Nado de flecha CBA): Impulso desde la pared o asistencia del docente en flecha: manos una encima de la otra, cabeza totalmente sumergida entre los brazos, pateo propulsivo recto hacia el docente ubicado a 5 metros.\n• Estación 3 (De la tabla a la estrella flotante): Fase A: flotación dorsal abrazando la tabla al pecho; Fase B: soltar suavemente la tabla abriendo brazos en cruz para flotar boca arriba de manera 100% autónoma durante 5 a 8 segundos.\n• Estación 4 (Iniciación a la brazada de crol): Con tabla sostenida por una mano, realizar tracción subacuática y recobro aéreo con el brazo libre, alternando con patada continua.',
  actividadesCierre: '(C) Cierre:\n• Juego recreativo de relajación acuática: "Los delfines que buscan su perla" (inmersión suave controlada).\n• Vuelta a la calma con flotación relajada y respiración profunda en el carril poco profundo.\n• Salida ordenada, secado y asamblea breve: ¿Cómo se sintió flotar boca arriba sin tabla? ¿Quién logró la flecha más veloz?',
  recursos: 'Piscina pedagógica CBA, tablas de natación, flotadores auxiliares (pull-buoys/churros para apoyo transitorio), silbato y cronómetro.',
  fuentesConsulta: 'Currículo de Educación Inicial (MPPE), Manual de Enseñanza de la Natación Infantil (Fina/Feveda), Guía de Iniciación al Nado CBA.'
};

export const TEMPLATE_INICIAL_AJE_4A: DidacticTemplateData = {
  level: 'INICIAL',
  title: 'Planificación Didáctica: Identificación de Piezas, Geometría del Tablero y Movimiento de Torre y Alfil CBA',
  areaId: 'ini-aje',
  docenteName: 'Prof. Alberto Silva',
  gradeSection: 'Sala de 4 Años A',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'Iniciación al juego ciencia, orientación espacial en tablero (filas, columnas, diagonales) y desplazamientos geométricos básicos.',
  projectTheme: 'Pequeños Reyes y Reinas CBA: El Mágico Mundo del Ajedrez',
  rows: [
    {
      id: 'row-ini-aje4-1',
      contenidoOReferente: 'Identificación visual y nominal de las piezas de ajedrez (Rey, Dama, Torre, Alfil, Caballo, Peón) y elementos estructurales del tablero (filas, columnas y diagonales).',
      aprendizajesEsperados: 'Reconoce y nombra cada pieza del ajedrez al ser mostrada por el profesor y diferencia las trayectorias espaciales básicas del tablero (filas, columnas y diagonales).',
      indicadoresCompetencia: '• Nombra cada pieza del juego de ajedrez al ser mostrada por el docente.\n• Reconoce filas, columnas o diagonales al ser mostradas por el docente.',
      tecnicasInstrumentos: 'Técnica: Observación directa en tablero gigante y juego de emparejamiento.\nInstrumento: Escala de estimación cualitativa y registro anecdótico.',
      criteriosEvaluacion: '• Precisión en la denominación de las piezas sin confusión entre Rey y Dama.\n• Discriminación visual inmediata de filas (acostadas), columnas (de pie) y diagonales (inclinadas).\n• Participación alegre y respeto de turnos en el aula de ajedrez.'
    },
    {
      id: 'row-ini-aje4-2',
      contenidoOReferente: 'Movimientos lineales de piezas mayores y menores: desplazamiento recto ortogonal de la Torre y desplazamiento diagonal del Alfil.',
      aprendizajesEsperados: 'Ejecuta correctamente los movimientos reglamentarios de la torre en líneas rectas (filas y columnas) y del alfil sobre diagonales del mismo color.',
      indicadoresCompetencia: '• Ejecuta correctamente el movimiento de la torre.\n• Ejecuta correctamente el movimiento del alfil.',
      tecnicasInstrumentos: 'Técnica: Desafíos lúdicos en mini-tableros ("El cohete Torre" y "El esquiador Alfil").\nInstrumento: Registro de ejecución práctica.',
      criteriosEvaluacion: '• Desplazamiento limpio de la torre sin saltar piezas ni desviarse en diagonal.\n• Mantenimiento del alfil sobre su color de casilla de origen a lo largo de las diagonales.\n• Coordinación visomotora y motricidad fina al asir y mover las piezas.'
    }
  ],
  actividadesInicio: '(I) Inicio:\n• Canción lúdica de bienvenida al reino del ajedrez: "Las piezas del tablero van a marchar".\n• Cuento motivador: "La gran fiesta en el palacio blanco y negro del Colegio Bellas Artes".\n• Pregunta detonante: ¿Quién puede encontrar al rey con su corona de cruz y al peón valiente?',
  actividadesDesarrollo: '(D) Desarrollo:\n• Estación 1 (El desfile de las piezas): En el tablero gigante mural, el docente muestra cada pieza y los niños en coro e individualmente dicen su nombre, función y corona.\n• Estación 2 (Caminos del tablero): Trazado con cintas de colores en el suelo: caminar como soldados por las columnas (de frente), por las filas (de lado) y en patines por las diagonales (inclinadas).\n• Estación 3 (La torre cohete): En tableros de mesa, los niños mueven la torre hacia adelante, atrás y a los lados para "visitar" castillos sin salirse de la línea.\n• Estación 4 (El alfil esquiador): Desafío de deslizar el alfil por su pista de esquí diagonal, recordando la regla de oro: "el alfil nunca cambia el color de su casilla".',
  actividadesCierre: '(C) Cierre:\n• Ronda de preguntas relámpago con títeres de torre y alfil.\n• Metacognición lúdica: ¿Por dónde viaja la torre? ¿Por dónde esquía el alfil?\n• Guardado organizado de piezas en sus cofres ("Las piezas van a dormir") y despedida.',
  recursos: 'Tablero gigante mural CBA, tableros de madera escolares, piezas de ajedrez de iniciación grandes (Staunton), cintas de colores para suelo, títeres didácticos y láminas ilustrativas.',
  fuentesConsulta: 'Currículo de Educación Inicial (MPPE), Guía Pedagógica de Ajedrez Escolar Infantil CBA, Programa Nacional de Ajedrez Escolar.'
};

export const TEMPLATE_INICIAL_AJE_5A: DidacticTemplateData = {
  level: 'INICIAL',
  title: 'Planificación Didáctica: Valor de Piezas, Coordenadas Alfanuméricas y Táctica Elemental CBA',
  areaId: 'ini-aje',
  docenteName: 'Prof. Alberto Silva',
  gradeSection: 'Sala de 5 Años A',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'Razonamiento lógico-matemático, valor numérico de piezas, plano cartesiano del tablero (coordenadas) y resolución táctica básica (defensa y captura).',
  projectTheme: 'Estrategas del Futuro CBA: Pensamiento Lógico, Coordenadas y Jugadas Maestras',
  rows: [
    {
      id: 'row-ini-aje5-1',
      contenidoOReferente: 'Valor cuantitativo absoluto de las piezas de ajedrez (peón=1, caballo/alfil=3, torre=5, dama=9) y nomenclatura de casillas por coordenadas alfanuméricas.',
      aprendizajesEsperados: 'Determina el valor numérico relativo de cada pieza tomando como unidad de medida al peón y localiza casillas combinando letras y números en el tablero.',
      indicadoresCompetencia: '• Nombra el valor de cada pieza del ajedrez tomando como base el peón.\n• Nombra las casillas del tablero de ajedrez utilizando las coordenadas de letras y números.',
      tecnicasInstrumentos: 'Técnica: Balanza matemática de piezas y juego de "La batalla naval de coordenadas".\nInstrumento: Escala de estimación cualitativa y prueba práctica en tablero.',
      criteriosEvaluacion: '• Asociación precisa del valor numérico con cada pieza (Dama=9, Torre=5, Alfil/Caballo=3, Peón=1).\n• Localización exacta del cruce de fila y columna (ejemplo: e4, c6, d5).\n• Expresión verbal clara al comunicar la coordenada seleccionada.'
    },
    {
      id: 'row-ini-aje5-2',
      contenidoOReferente: 'Análisis posicional elemental: piezas defendidas e indefensas y ejecución de jugadas tácticas de captura o defensa en posiciones propuestas.',
      aprendizajesEsperados: 'Identifica visualmente si una pieza en peligro cuenta con la protección de un compañero o está indefensa y resuelve la mejor jugada de captura o defensa.',
      indicadoresCompetencia: '• Indica la pieza defendida o indefensa en ejercicios propuestos por el docente.\n• Ejecuta jugadas de captura o defensa de piezas en ejercicios propuestos por el docente.',
      tecnicasInstrumentos: 'Técnica: Resolución de diagramas y posiciones guiadas en parejas.\nInstrumento: Rúbrica formativa de resolución táctica.',
      criteriosEvaluacion: '• Discrimina con seguridad piezas desprotegidas antes de mover.\n• Ejecuta la captura retirando limpiamente la pieza adversaria y ocupando su casilla.\n• Protege o rescata piezas amenazadas aplicando el principio de defensa mutua.'
    }
  ],
  actividadesInicio: '(I) Inicio:\n• Saludo de bienvenida con adivinanzas de ajedrez: "Tengo corona y valgo nueve peones, ¿quién soy?".\n• Presentación del reto quincenal: "El mapa del tesoro de las casillas secretas y el rescate de las piezas en peligro".\n• Activación de memoria: repaso del abecedario de la A a la H y los números del 1 al 8.',
  actividadesDesarrollo: '(D) Desarrollo:\n• Estación 1 (La balanza del peón): Ejercicios manipulativos colocando monedas o peones en platos de balanza para equilibrar una torre (5 peones), un alfil (3 peones) o una dama (9 peones).\n• Estación 2 (Cazadores de coordenadas): El docente dice una coordenada en voz alta (ej. "e4", "f7") y los niños colocan su banderín en la casilla correspondiente verificando letra y número.\n• Estación 3 (¿Amigo o desprotegido?): Diagramas en tablero mural donde los niños señalan con fichas verdes piezas defendidas por un compañero y con fichas rojas piezas indefensas.\n• Estación 4 (Taller de jugadas maestras): En tableros individuales, resolución de problemas prácticos de captura ventajosa y defensa por retirada o protección.',
  actividadesCierre: '(C) Cierre:\n• Mini-torneo amistoso de mini-juegos de captura ("Guerra de peones y torres").\n• Asamblea de conclusiones: ¿Por qué es importante saber si una pieza tiene guardián? ¿Cuál casilla fue la más fácil de encontrar?\n• Felicitación por el pensamiento analítico y ritual de despedida CBA.',
  recursos: 'Tableros de ajedrez reglamentarios, piezas plásticas de competición, tablero mural magnético con coordenadas rotuladas, tarjetas de retos tácticos y balanza didáctica.',
  fuentesConsulta: 'Currículo de Educación Inicial (MPPE), Manual de Ajedrez y Razonamiento Lógico Infantil CBA, Metodología de la FIDE para Escuelas de Primera Infancia.'
};

export const TEMPLATE_INICIAL_INF_4A: DidacticTemplateData = {
  level: 'INICIAL',
  title: 'Planificación Didáctica: Hardware Básico, Manejo de Periféricos e Iniciación al Trazo Digital CBA',
  areaId: 'ini-inf',
  docenteName: 'Ing. Carlos Mendoza',
  gradeSection: 'Sala de 4 Años A',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'Alfabetización digital infantil, identificación de componentes físicos, interacción con periféricos (mouse, pantalla táctil) y trazo gráfico lúdico.',
  projectTheme: 'Pequeños Exploradores Digitales CBA: Conociendo el Computador y sus Amigos',
  rows: [
    {
      id: 'row-ini-inf4-1',
      contenidoOReferente: 'Componentes físicos del computador (monitor, teclado, mouse, CPU) y manejo motriz de periféricos (clic simple, arrastre con apoyo y pantalla táctil).',
      aprendizajesEsperados: 'Identifica visualmente las partes principales del computador e interactúa con el mouse y la pantalla táctil mediante clics simples y arrastre guiado.',
      indicadoresCompetencia: '• Identifica correctamente el monitor, teclado, mouse y CPU mediante señalamientos o juegos interactivos.\n• Realiza clics simples y arrastra objetos en actividades digitales con apoyo mínimo.\n• Interactúa con la pantalla táctil de forma autónoma.',
      tecnicasInstrumentos: 'Técnica: Observación directa en laboratorio de computación y retos interactivos.\nInstrumento: Lista de cotejo tecnológica y registro de destreza motriz digital.',
      criteriosEvaluacion: '• Denominación correcta de los 4 componentes físicos básicos.\n• Coordinación visomotora al presionar el botón izquierdo del mouse sin mover el cursor bruscamente.\n• Uso delicado y autónomo de la pantalla táctil con el dedo índice.'
    },
    {
      id: 'row-ini-inf4-2',
      contenidoOReferente: 'Navegación guiada en entornos digitales infantiles, uso de herramientas básicas de dibujo (lápiz, pincel, colores) y participación entusiasta sostenida.',
      aprendizajesEsperados: 'Accede a juegos educativos con apoyo docente, experimenta con trazos digitales utilizando colores y manifiesta interés prolongado en las actividades.',
      indicadoresCompetencia: '• Navega por menús sencillos y selecciona juegos apropiados con ayuda guiada.\n• Usa herramientas básicas como lápiz, pincel y colores para crear formas o trazos reconocibles.\n• Participa activamente en actividades digitales, mostrando entusiasmo y atención sostenida.',
      tecnicasInstrumentos: 'Técnica: Taller de arte digital y observación formativa.\nInstrumento: Portafolio digital de trazos y escala de estimación cualitativa.',
      criteriosEvaluacion: '• Seguimiento de instrucciones para abrir y cerrar juegos educativos.\n• Selección variada de colores y cambio de grosor de pincel.\n• Cuidado responsable de los equipos y respeto de turnos en el aula digital CBA.'
    }
  ],
  actividadesInicio: '(I) Inicio:\n• Canción lúdica de bienvenida tecnológica: "El ratón travieso y la pantalla brillante".\n• Presentación de la mascota del aula digital ("Byte el robot CBA") y recordatorio de las reglas de oro: manos limpias, trato suave a los equipos y cables sin tocar.\n• Pregunta detonante: ¿Quién sabe cómo se llama la cajita mágica donde vive el cerebro de la computadora?',
  actividadesDesarrollo: '(D) Desarrollo:\n• Estación 1 (Detectives del Hardware): Juego de señalamiento en las estaciones de trabajo: los niños colocan stickers magnéticos sobre el monitor, teclado, mouse y CPU al escuchar el sonido característico de cada uno.\n• Estación 2 (El baile del cursor): En software educativo interactivo (GCompris / Tux Paint), ejercicios de clic simple para "reventar burbujas" y arrastre de piezas de rompecabezas digitales de 4 partes.\n• Estación 3 (Rincón táctil): En tablets escolares CBA, los niños deslizan el dedo para clasificar frutas por color de manera 100% autónoma.\n• Estación 4 (Primeros trazos mágicos): Con software de dibujo infantil, selección libre de lápiz y pincel para trazar líneas curvas, soles y caritas felices con colores vivos.',
  actividadesCierre: '(C) Cierre:\n• Exposición colectiva en proyector de las creaciones de los niños ("Galería de Arte Digital CBA").\n• Rutina de cierre: guardar el mouse en su alfombrilla, apagar pantalla con botón guiado y agradecimiento.\n• Ronda reflexiva: ¿Qué herramienta de dibujo les gustó más: el lápiz o el pincel?',
  recursos: 'Computadoras del laboratorio infantil CBA con audífonos ergonómicos, tablets táctiles educativas, software Tux Paint y GCompris, video beam y stickers de componentes.',
  fuentesConsulta: 'Currículo de Educación Inicial (MPPE), Guía Pedagógica de Informática y Robótica Educativa CBA, Estándares ISTE para la Primera Infancia.'
};

export const TEMPLATE_INICIAL_INF_5A: DidacticTemplateData = {
  level: 'INICIAL',
  title: 'Planificación Didáctica: Funcionalidad de Componentes, Diseño Digital en Paint y Navegación Autónoma CBA',
  areaId: 'ini-inf',
  docenteName: 'Ing. Carlos Mendoza',
  gradeSection: 'Sala de 5 Años A',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'Comprensión funcional del hardware, destreza visomotora avanzada (doble clic, selección), dibujo vectorial básico en Paint y autonomía creativa.',
  projectTheme: 'Creadores del Futuro Digital CBA: Diseñando con Paint y Navegando con Seguridad',
  rows: [
    {
      id: 'row-ini-inf5-1',
      contenidoOReferente: 'Funcionalidad de los componentes del computador (monitor, teclado, mouse, CPU, pantalla táctil), coordinación de doble clic, arrastre preciso y navegación autónoma en juegos.',
      aprendizajesEsperados: 'Explica verbalmente la función de cada periférico y dispositivo, ejecuta el doble clic y selección con control motriz y explora juegos educativos sin requerir ayuda constante.',
      indicadoresCompetencia: '• Identifica el monitor, teclado, mouse, CPU y pantalla táctil, explicando para qué sirve cada uno.\n• Realiza clics dobles, arrastra objetos y selecciona elementos con control y coordinación.\n• Explora y navega de forma autónoma en juegos educativos digitales.',
      tecnicasInstrumentos: 'Técnica: Prueba práctica guiada y observación en laboratorio.\nInstrumento: Rúbrica formativa de destreza motriz digital y diálogo conceptual.',
      criteriosEvaluacion: '• Explicación fluida y pertinente de para qué sirve cada parte (ej. el monitor muestra las imágenes, el mouse apunta y selecciona).\n• Ritmo y cadencia motriz adecuada al hacer doble clic sin desplazar el puntero.\n• Iniciativa para avanzar de nivel o cambiar de actividad de forma independiente.'
    },
    {
      id: 'row-ini-inf5-2',
      contenidoOReferente: 'Entorno de trabajo de Microsoft Paint: reconocimiento de íconos (formas geométricas, bote de pintura, borrador, paleta de colores), creación de diseños y expresión creativa autónoma.',
      aprendizajesEsperados: 'Identifica la barra de herramientas de Paint, dibuja figuras geométricas combinadas con trazo libre aplicando color de relleno y demuestra originalidad en sus proyectos.',
      indicadoresCompetencia: '• Crea diseños y figuras utilizando herramientas de dibujo digital en Paint.\n• Reconoce íconos y herramientas básicas del programa Paint.\n• Muestra iniciativa y creatividad al interactuar con recursos digitales.',
      tecnicasInstrumentos: 'Técnica: Proyecto de creación artística digital y resolución de desafíos gráficos.\nInstrumento: Portafolio digital de creaciones en Paint y escala de estimación cualitativa.',
      criteriosEvaluacion: '• Ubicación y clic certero en íconos específicos (círculo, rectángulo, bote de pintura, pincel).\n• Creación de composiciones reconocibles (casas, paisajes, animales) combinando figuras y colores.\n• Curiosidad e iniciativa para explorar nuevas opciones creativas sin temor a equivocarse.'
    }
  ],
  actividadesInicio: '(I) Inicio:\n• Rutina de gimnasia cerebral para dedos: "El doble clic rápido del guepardo".\n• Presentación del reto quincenal: "Diseñando nuestra ciudad inteligente CBA en el lienzo de Paint".\n• Repaso interactivo: juego de preguntas y respuestas sobre para qué sirve la pantalla táctil y en qué se diferencia del monitor tradicional.',
  actividadesDesarrollo: '(D) Desarrollo:\n• Estación 1 (Maestros del Doble Clic): Retos de velocidad en software educativo abriendo carpetas y cofres secretos con doble clic sincronizado.\n• Estación 2 (Taller de Paint - Conociendo los Íconos): Exploración guiada de la barra superior: identificar la herramienta "Lápiz", "Borrador", "Bote de pintura" y las formas geométricas.\n• Estación 3 (Compositores Digitales CBA): Dibujo guiado paso a paso: trazar un cuadrado para la casa, un triángulo para el techo, un círculo para el sol y rellenar con la paleta de colores sin desbordar los contornos cerrados.\n• Estación 4 (Laboratorio Libre de Creación): Proyecto libre donde cada estudiante diseña un vehículo o personaje de su imaginación combinando pinceles artísticos y sellos.',
  actividadesCierre: '(C) Cierre:\n• Guardado asistido del archivo en la carpeta personal de cada niño ("Mi Primera Obra Digital").\n• Asamblea de valoración: proyección de 3 dibujos seleccionados por los propios estudiantes comentando qué herramientas utilizaron.\n• Ritual de salida ordenada y apagado correcto del equipo.',
  recursos: 'Laboratorio de informática CBA, software Microsoft Paint / Tux Paint, proyector interactivo, carpetas de red configuradas por sección y guías visuales con íconos ampliados.',
  fuentesConsulta: 'Currículo de Educación Inicial (MPPE), Manual de Computación Infantil CBA, Enfoque STEAM en la Primera Infancia.'
};

export const TEMPLATE_INICIAL_ING_4A: DidacticTemplateData = {
  level: 'INICIAL',
  title: 'Planificación Didáctica: Colors, Family Members & Early English Immersion CBA',
  areaId: 'ini-ing',
  docenteName: 'Lic. Valentina Rivas',
  gradeSection: 'Sala de 4 Años A',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'Inmersión fonética bilingüe, comprensión auditiva receptiva (pointing), vocabulario de colores y núcleo familiar básico.',
  projectTheme: 'My Colorful Family CBA: Discovering English Through Songs and Rhymes',
  rows: [
    {
      id: 'row-ini-ing4-1',
      contenidoOReferente: 'Basic colors vocabulary (red, orange, yellow, blue, green): receptive listening (pointing at objects) and oral naming with clear pronunciation.',
      aprendizajesEsperados: 'Discrimina y señala objetos en el salón al escuchar su color en inglés, nombra los colores básicos y reproduce su pronunciación fonética modelada.',
      indicadoresCompetencia: '• Señala objetos según el color indicado en inglés.\n• Menciona los colores básicos vistos en clase (red, orange, yellow, etc.).\n• Pronuncia correctamente el vocabulario de los colores en inglés.',
      tecnicasInstrumentos: 'Técnica: Juego de discriminación auditiva y canciones interactivas ("The Rainbow Song").\nInstrumento: Escala de estimación cualitativa y registro fonético formativo.',
      criteriosEvaluacion: '• Asociación inmediata del estímulo auditivo en inglés con el color del objeto.\n• Pronunciación clara sin distorsión fonética de los sonidos /r/ y /w/ en inglés.\n• Entusiasmo y participación en dinámicas bilingües.'
    },
    {
      id: 'row-ini-ing4-2',
      contenidoOReferente: 'Immediate family members (mother, father, sister, baby): flashcards recognition, pointing and oral reproduction through finger plays.',
      aprendizajesEsperados: 'Identifica visualmente y nombra a los integrantes del núcleo familiar inmediato en inglés mediante canciones tradicionales ("Finger Family") y títeres.',
      indicadoresCompetencia: '• Identifica los miembros de la familia vistos en clase (mother, father, sister, baby) etc.\n• Menciona el vocabulario de la familia visto en clase.',
      tecnicasInstrumentos: 'Técnica: Rima con títeres de dedos y narración con flashcards.\nInstrumento: Lista de cotejo bilingüe.',
      criteriosEvaluacion: '• Reconocimiento de los personajes de la familia al ser nombrados en inglés.\n• Denominación verbal espontánea o guiada con entonación natural.\n• Respeto y valoración del núcleo familiar.'
    }
  ],
  actividadesInicio: '(I) Routine & Warm-up:\n• "Hello Song CBA" (Circle time): Saludo cantado con palmadas y bienvenida en inglés.\n• Mystery Box: La docente extrae objetos coloridos de la caja mágica cantando "What color is it?".\n• Activación fonética con el títere bilingüe "Teddy Bear CBA".',
  actividadesDesarrollo: '(D) Learning Stations & Guided Practice:\n• Station 1 (Color Hunters): A la orden verbal de la docente ("Point to something red! / Find yellow!"), los niños corren suavemente a tocar bloques u objetos de ese color en el salón.\n• Station 2 (Echo Chamber): Repetición rítmica y modelado fonético de los colores con rimas y tarjetas visuales.\n• Station 3 (Finger Family Puppets): Con títeres de dedos de papel, dramatización de la canción "Daddy Finger, Mommy Finger" señalando e identificando a mother, father, sister y baby.\n• Station 4 (Family Tree CBA): En una lámina ilustrada de un árbol familiar, los estudiantes pegan la foto de cada miembro diciendo su nombre en inglés.',
  actividadesCierre: '(C) Review & Goodbye:\n• "Goodbye Friends Song CBA": Despedida en círculo repasando las palabras clave aprendidas hoy.\n• Quick Flashcard Round: Mostrar tarjeta rápida de color o miembro familiar y responder en coro.\n• Refuerzo positivo: "Great job! High five!".',
  recursos: 'Flashcards de colores y familia en alta definición, títeres de dedos, marioneta "Teddy Bear", reproductor de audio, canciones bilingües CBA y láminas de árbol genealógico.',
  fuentesConsulta: 'Currículo de Educación Inicial (MPPE), Guía Pedagógica de Inglés para la Primera Infancia CBA, Marco Común Europeo de Referencia (Nivel Pre-A1 Early Years).'
};

export const TEMPLATE_INICIAL_ING_5A: DidacticTemplateData = {
  level: 'INICIAL',
  title: 'Planificación Didáctica: Extended Family, Facial Features & TPR Interactive English CBA',
  areaId: 'ini-ing',
  docenteName: 'Lic. Valentina Rivas',
  gradeSection: 'Sala de 5 Años A',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'Desarrollo de la lengua extranjera, comprensión auditiva reactiva (TPR), ampliación léxica de familia extendida y esquema somatognósico facial.',
  projectTheme: 'My Big Family & My Happy Face: Interactive English CBA',
  rows: [
    {
      id: 'row-ini-ing5-1',
      contenidoOReferente: 'Extended family vocabulary (mother, father, grandfather, grandmother, uncle, aunt): auditory discrimination, pointing reaction and phonemic articulation.',
      aprendizajesEsperados: 'Reconoce y pronuncia con fluidez el vocabulario de la familia extendida y reacciona de forma inmediata señalando la imagen del miembro nombrado por la docente.',
      indicadoresCompetencia: '• Reconoce el vocabulario de la familia visto en clase (mother, father, uncle, aunt, etc.).\n• Pronuncia correctamente el vocabulario de la familia en inglés (mother, father, grandfather, uncle, etc.).\n• Señala correctamente a los miembros de la familia cuando la docente los nombra.',
      tecnicasInstrumentos: 'Técnica: Juego de velocidad auditiva ("Slap the Card") y diálogos en parejas con títeres.\nInstrumento: Escala de estimación cualitativa y prueba práctica de respuesta auditiva.',
      criteriosEvaluacion: '• Velocidad de discriminación auditiva sin vacilación entre uncle y aunt.\n• Articulación fonética precisa de consonantes interdentales y compuestas (/th/ en father, mother).\n• Autonomía comunicativa en interacciones bilingües guiadas.'
    },
    {
      id: 'row-ini-ing5-2',
      contenidoOReferente: 'Facial features somatognosia (eyes, nose, mouth, ears): Total Physical Response (TPR) command execution and oral naming in first person.',
      aprendizajesEsperados: 'Ejecuta respuestas corporales inmediatas tocando sus rasgos faciales al escuchar las órdenes en inglés y nombra correctamente las partes de su rostro.',
      indicadoresCompetencia: '• Señala correctamente la parte del rostro cuando se le menciona.\n• Nombra correctamente las partes de su rostro en inglés.',
      tecnicasInstrumentos: 'Técnica: Total Physical Response (TPR) con la canción "Head, Shoulders, Knees and Toes / Face Song" y juego frente al espejo.\nInstrumento: Observación psicomotriz TPR y rúbrica de producción oral.',
      criteriosEvaluacion: '• Coordinación motriz inmediata tocando la parte facial correcta (eyes, nose, mouth, ears).\n• Denominación verbal con buena inteligibilidad y seguridad.\n• Expresión corporal alegre y desinhibida durante las rutinas en inglés.'
    }
  ],
  actividadesInicio: '(I) Routine & Morning Meeting:\n• "Welcome to English Class Song CBA": Saludo dinámico con rutinas de movimiento.\n• "Mirror Game": Los niños se miran en un espejo portátil y la docente modela: "Look at your eyes, point to your nose!".\n• Repaso auditivo rápido con la canción interactiva "Family & Friends CBA".',
  actividadesDesarrollo: '(D) Active Stations & TPR Challenges:\n• Station 1 (Family Tree Detective): La docente narra una historia corta ("Meet my family!") y a medida que nombra a grandfather, uncle o aunt, los estudiantes tocan con un matamoscas de juguete la tarjeta correspondiente en la pizarra.\n• Station 2 (Pronunciation Studio): Práctica fonética individual y en pequeños grupos frente al espejo modelando la colocación de la lengua para pronunciar "mother", "father" y "teeth/mouth".\n• Station 3 (Simon Says - Face Edition): Juego de respuesta física refleja: "Simon says touch your ears!", "Simon says point to your mouth!" verificando comprensión auditiva.\n• Station 4 (Build a Face): En pizarras magnéticas, los niños arman caras divertidas agregando piezas magnéticas y diciendo en voz alta: "Two blue eyes, one red mouth, two ears!".',
  actividadesCierre: '(C) Production & Goodbye:\n• "Face & Family Show & Tell": Cada niño señala en su propia cara dos partes y en una foto familiar a un miembro diciendo su nombre en inglés.\n• "See You Later Alligator Song": Ritual de despedida bilingüe.\n• Felicitación con stickers de felicitación ("Star Speaker CBA!").',
  recursos: 'Pizarras magnéticas con piezas faciales desmontables, espejos irrompibles para fonética, tarjetas visuales de familia extendida, sistema de audio y música TPR en inglés.',
  fuentesConsulta: 'Currículo de Educación Inicial (MPPE), Total Physical Response (TPR) Methodology in ESL Pre-K, Guía de Inmersión Bilingüe Colegio Bellas Artes.'
};

export const TEMPLATE_PRIMARIA_LEN_1G: DidacticTemplateData = {
  level: 'PRIMARIA',
  title: 'Planificación Didáctica: Inicio a la Lectoescritura, Hábitos del Cuaderno y Comunicación Oral CBA',
  areaId: 'pri-len',
  docenteName: 'Lcda. Carmen Elena Pérez',
  gradeSection: '1er Grado A y B',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'La lengua oral y escrita como medio de comunicación, estructuración gráfica del cuaderno escolar y desarrollo de la imaginación.',
  projectTheme: 'Mis Primeras Palabras y Cuaderno Bonito: El Mágico Inicio de 1er Grado CBA',
  ejesIntegradores: 'Lenguaje, Comunicación y Cultura • Valores Ciudadanos y Hábitos de Convivencia',
  tipoProyecto: 'Proyecto de Aprendizaje de Aula (PA)',
  rows: [
    {
      id: 'row-pri-len1-1',
      contenidoOReferente: 'Intercambios orales, conversación en el aula como oyente y hablante, fórmulas sociales de saludo y cortesía.',
      aprendizajesEsperados: 'Participa activamente en conversaciones colectivas escuchando con respeto y expresando sus ideas con claridad y fórmulas sociales.',
      indicadoresCompetencia: '• Participa en conversaciones como oyente: escucha con atención e interés.\n• Participa en conversaciones como hablante: se expresa en forma cordial, respetuosa y espontánea.\n• Usa diversas fórmulas sociales para interactuar con los demás en situaciones de la vida cotidiana.',
      tecnicasInstrumentos: 'Técnica: Círculo de diálogo matutino y dramatizaciones breves.\nInstrumento: Escala de estimación cualitativa y registro de observación directa.',
      criteriosEvaluacion: '• Respeto de turnos al hablar y contacto visual con el interlocutor.\n• Utilización espontánea de "por favor", "gracias" y "buenos días".\n• Claridad y entonación en las expresiones orales.'
    },
    {
      id: 'row-pri-len1-2',
      contenidoOReferente: 'Normas y convenciones de la lengua escrita: vocales y consonantes, mayúsculas y minúsculas, encabezado institucional, margen, sangría y direccionalidad.',
      aprendizajesEsperados: 'Aplica hábitos de orden y limpieza en el cuaderno escolar, diferencia vocales de consonantes y copia textos cortos atendiendo la linealidad y forma de las letras.',
      indicadoresCompetencia: '• Presenta hábitos de orden y limpieza.\n• Conoce y diferencia las vocales y las consonantes.\n• Diferencia mayúsculas y minúsculas.\n• Realiza encabezado al inicio de cada área.\n• Respeta margen y sangría al escribir un texto.\n• Escribe el título en el lugar correspondiente.\n• Atiende direccionalidad, forma y tamaño de letra.\n• Copia textos cortos del pizarrón al cuaderno.\n• Culmina las actividades en el tiempo establecido.',
      tecnicasInstrumentos: 'Técnica: Ejercitación guiada en cuaderno de doble línea y modelado en pizarra.\nInstrumento: Rúbrica de revisión de cuaderno y seguimiento caligráfico.',
      criteriosEvaluacion: '• Pulcritud, ausencia de tachaduras y respeto del margen izquierdo y derecho.\n• Trazado correcto de grafías respetando la línea guía.\n• Reconocimiento de mayúsculas al inicio de textos y nombres propios.'
    },
    {
      id: 'row-pri-len1-3',
      contenidoOReferente: 'Expresión creativa e imaginativa: tarjetas de felicitación, frases afectivas y cuentos ilustrados infantiles.',
      aprendizajesEsperados: 'Manifiesta su creatividad redactando e ilustrando tarjetas, frases y relatos cortos con apoyo de dibujos y palabras conocidas.',
      indicadoresCompetencia: '• Expresa ideas, emociones o situaciones mediante elaboración de tarjeta, frases o cuentos.\n• Realiza la copia de un texto al cuaderno.',
      tecnicasInstrumentos: 'Técnica: Taller de creación de tarjetas y minicuentos ilustrados.\nInstrumento: Registro descriptivo de producción creativa.',
      criteriosEvaluacion: '• Originalidad y coherencia entre el dibujo y el mensaje escrito.\n• Entusiasmo y cuidado en la presentación de sus creaciones.'
    }
  ],
  actividadesInicio: '(I) Inicio:\n• Asamblea de bienvenida y lectura compartida del cuento "El Cuaderno Saltarín".\n• Conversatorio motivador sobre la importancia de cuidar los cuadernos y escuchar a los compañeros.\n• Dinámica de gimnasia cerebral: ejercicios de dedos y manos para calentar la motricidad fina.',
  actividadesDesarrollo: '(D) Desarrollo:\n• Estación 1 (El Árbol de las Letras): Clasificación lúdica de tarjetas de vocales y consonantes en la pizarra interactiva.\n• Estación 2 (El Mapa del Cuaderno): Trazado guiado paso a paso del encabezado oficial CBA (Maracaibo, fecha, área), margen rojo y sangría con regla.\n• Estación 3 (Laboratorio Caligráfico): Copia de 2 líneas modelo desde la pizarra al cuaderno, cuidando no salirse de la línea.\n• Estación 4 (Taller de Mensajes): Elaboración de una tarjeta sorpresa para un compañero utilizando frases cortas ilustradas.',
  actividadesCierre: '(C) Cierre:\n• "La Galería de Cuadernos": Ronda de observación mutua donde cada estudiante muestra una página limpia de su trabajo.\n• Autoevaluación guiada: ¿Dejé mi margen? ¿Coloqué el título en el centro?\n• Felicitación grupal y sellado motivacional CBA.',
  recursos: 'Cuadernos de doble línea, lápices grafito, colores, regla escolar, pizarra acrílica, tarjetas de abecedario y láminas de cuentos.',
  fuentesConsulta: 'Currículo Nacional de Educación Primaria (MPPE), Guía Pedagógica de Lectoescritura Inicial CBA, Colección Bicentenario 1er Grado.'
};

export const TEMPLATE_PRIMARIA_MAT_1G: DidacticTemplateData = {
  level: 'PRIMARIA',
  title: 'Planificación Didáctica: Pensamiento Lógico, Numeración Decimal y Formas Geométricas CBA',
  areaId: 'pri-mat',
  docenteName: 'Lcda. Carmen Elena Pérez',
  gradeSection: '1er Grado A y B',
  lapso: 1,
  schoolYear: '2026 - 2027',
  periodoQuincenal: '21/09 al 02/10/2026',
  startDate: '2026-09-21',
  endDate: '2026-10-02',
  componente: 'Desarrollo del pensamiento lógico matemático, números naturales, orientación espacial y figuras geométricas planas.',
  projectTheme: 'Los Números en Mi Mundo: Explorando Figuras, Relaciones y Conteo en 1er Grado CBA',
  ejesIntegradores: 'Pensamiento Lógico-Matemático • Ciencia, Tecnología y Sociedad',
  tipoProyecto: 'Proyecto de Aprendizaje de Aula (PA)',
  rows: [
    {
      id: 'row-pri-mat1-1',
      contenidoOReferente: 'Clasificación por criterios, seriaciones lógicas, símbolos de comparación (>, <, =), número anterior y posterior, uso de la recta numérica.',
      aprendizajesEsperados: 'Clasifica y seria conjuntos con material concreto, compara números con símbolos matemáticos y ubica posiciones en la recta numérica.',
      indicadoresCompetencia: '• Expresa criterios de clasificación.\n• Realiza seriaciones expresando la regla que lo rige.\n• Utiliza adecuadamente los símbolos mayor que >, menor que <, igual a =.\n• Escribe el número anterior y posterior de una cifra dada.\n• Mantiene su atención y concentración al realizar sus actividades.\n• Utiliza la recta numérica como herramienta gráfica para contar, ordenar y representar números.',
      tecnicasInstrumentos: 'Técnica: Trabajo en mesa con bloques lógicos, regletas y recta numérica en el suelo.\nInstrumento: Escala de estimación y pruebas prácticas de relaciones numéricas.',
      criteriosEvaluacion: '• Argumentación oral del criterio de orden elegido (color, tamaño, forma).\n• Empleo correcto de los signos > y < según la cantidad.\n• Precisión al determinar el antecesor y sucesor de una cifra.'
    },
    {
      id: 'row-pri-mat1-2',
      contenidoOReferente: 'Lectura, escritura y valor de posición de números naturales hasta tres cifras (del 1 al 50 y series hasta 100), series progresivas y regresivas.',
      aprendizajesEsperados: 'Reconoce, nombra y escribe números naturales asociándolos con su cantidad, y ejecuta conteos progresivos y regresivos con seguridad.',
      indicadoresCompetencia: '• Relaciona el número con su nombre (del 1 al 50).\n• Realiza series regresivas de números de hasta tres cifras.\n• Identifica los números en situaciones cotidianas.\n• Realiza series progresivas de números de hasta tres cifras.',
      tecnicasInstrumentos: 'Técnica: Juegos de conteo en la alfombra numérica y tarjetas de números y nombres.\nInstrumento: Guía de ejercitación práctica y registro de desempeño.',
      criteriosEvaluacion: '• Fluidez en el conteo ascendente y descendente.\n• Escritura correcta en letras y números del 1 al 50.\n• Aplicación de los números a problemas de la vida cotidiana escolar.'
    },
    {
      id: 'row-pri-mat1-3',
      contenidoOReferente: 'Geometría plana (círculo, cuadrado, triángulo, rectángulo) y relaciones de ubicación espacial (arriba, abajo, izquierda, derecha).',
      aprendizajesEsperados: 'Identifica y dibuja figuras geométricas en su entorno y aplica nociones espaciales para describir la posición de personas y objetos.',
      indicadoresCompetencia: '• Nombra las figuras geométricas planas en su entorno.\n• Dibuja las figuras geométricas planas básicas.\n• Utiliza correctamente las nociones espaciales de ubicación (arriba, abajo, izquierda, derecha).',
      tecnicasInstrumentos: 'Técnica: Búsqueda geométrica en el patio y circuito psicomotor de orientación espacial.\nInstrumento: Ficha de trazado geométrico y observación directa.',
      criteriosEvaluacion: '• Discriminación entre figuras planas y cuerpos tridimensionales.\n• Ubicación lateral y vertical sin dudar respecto a su propio cuerpo.'
    }
  ],
  actividadesInicio: '(I) Inicio:\n• Canción del conteo interactivo: "Saltando en la recta numérica CBA".\n• Desafío mental rápido: "Adivina qué número está antes del 15 y después del 19".\n• Activación de nociones espaciales con la canción "A la izquierda, a la derecha".',
  actividadesDesarrollo: '(D) Desarrollo:\n• Estación 1 (El Supermercado Matemático): Clasificación de productos según forma y precio, comparando valores con los signos > y <.\n• Estación 2 (La Recta Gigante): Los niños saltan sobre una recta numérica dibujada en el suelo para avanzar y retroceder.\n• Estación 3 (Taller de Geometría): Trazado con regla y compás escolar o plantillas de círculos, cuadrados y triángulos en el cuaderno.\n• Estación 4 (Desafío de la Cifra Secreta): Tarjetas de números del 1 al 50 donde deben escribir el nombre en letras y ubicar el anterior y posterior.',
  actividadesCierre: '(C) Cierre:\n• Ronda de preguntas relámpago con la ruleta numérica interactiva.\n• Metacognición: ¿Cómo me ayuda la recta numérica a contar hacia atrás?\n• Felicitación con la insignia de "Pequeño Matemático CBA".',
  recursos: 'Bloques lógicos Dienes, regletas Cuisenaire, recta numérica de piso, tarjetas numéricas del 1 al 100, reglas y plantillas geométricas.',
  fuentesConsulta: 'Currículo de Educación Primaria (MPPE), Metodología Singapur CPA aplicada a 1er Grado, Guía Pedagógica de Matemáticas CBA.'
};





