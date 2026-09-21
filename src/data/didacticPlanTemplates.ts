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
