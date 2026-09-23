import { UserRole, MainNavigationTab } from '../types';

export interface RoleQuickMission {
  id: string;
  title: string;
  badge: string;
  summary: string;
  iconName: string;
  targetTab: MainNavigationTab;
  targetSubTab?: string;
  recommendedSteps: string[];
}

export interface DetailedRoleGuide {
  roleId: UserRole;
  roleTitle: string;
  badgeEmoji: string;
  department: string;
  roleGreeting: string;
  roleOverview: string;
  badgeColor: string;
  missions: RoleQuickMission[];
  dosAndDonts: {
    dos: string[];
    donts: string[];
  };
}

export const ROLE_SPECIFIC_MANUALS: Record<UserRole, DetailedRoleGuide> = {
  DOCENTE: {
    roleId: 'DOCENTE',
    roleTitle: 'Docente de Aula / Especialista',
    badgeEmoji: '👨‍🏫',
    department: 'Cuerpo Docente CBA',
    roleGreeting: '¡Bienvenido(a), Docente CBA!',
    roleOverview: 'Tu misión principal en SICE-CBA es planificar tus clases quincenales, asentar las notas continuas y registrar la asistencia de tus estudiantes según las normativas y escalas evaluativas oficiales de cada subsistema.',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    missions: [
      {
        id: 'doc-m1',
        title: 'Cargar el Plan Quincenal de Clases',
        badge: 'Planificación',
        summary: 'Estructura tus proyectos didácticos quincenales seleccionando competencias e indicadores oficiales.',
        iconName: 'BookOpen',
        targetTab: 'MEDIA_GENERAL',
        targetSubTab: 'PLAN_QUINCENAL',
        recommendedSteps: [
          'Selecciona el nivel en la barra superior (Inicial, Primaria o Media General).',
          'Ve a Planificación Pedagógica → Plan Quincenal.',
          'Define las fechas de la quincena y el tema o título del proyecto pedagógico.',
          'Selecciona las competencias e indicadores del banco oficial y presiona "Guardar Plan".'
        ]
      },
      {
        id: 'doc-m2',
        title: 'Registrar Calificaciones Procesales',
        badge: 'Evaluación',
        summary: 'Asienta periódicamente las valoraciones y notas de tus alumnos según la escala correspondiente al subsistema.',
        iconName: 'FileSpreadsheet',
        targetTab: 'MEDIA_GENERAL',
        targetSubTab: 'PROCESAL',
        recommendedSteps: [
          'Selecciona en la barra superior el nivel educativo correspondiente.',
          'Entra en Evaluación → Registro Procesal.',
          'Elige el grado, sección y materia para desplegar la lista de tus estudiantes.',
          'Ingresa la nota (Cualitativa en Inicial, Literal A-E en Primaria, o Numérica 01-20 en Media General) y pulsa "Guardar Calificaciones".'
        ]
      },
      {
        id: 'doc-m3',
        title: 'Tomar la Asistencia Diaria en Clase',
        badge: 'Asistencia',
        summary: 'Lleva el control de puntualidad y ausencias en tu aula para prevenir el límite del 25% de inasistencias.',
        iconName: 'CheckCircle2',
        targetTab: 'GESTION',
        targetSubTab: 'INASISTENCIAS',
        recommendedSteps: [
          'Dirígete a Gestión Escolar → Registro de Asistencia.',
          'Selecciona la sección y la fecha de la jornada escolar.',
          'Marca el estatus de cada estudiante (Presente, Retraso, Falta Justificada o Injustificada).',
          'Guarda el registro de la clase para sincronizar los totales acumulados.'
        ]
      },
      {
        id: 'doc-m4',
        title: 'Emitir y Revisar Boletines de Calificaciones',
        badge: 'Boletín',
        summary: 'Consulta la consolidación periódica de valoraciones de tus estudiantes antes de las reuniones de evaluación.',
        iconName: 'GraduationCap',
        targetTab: 'CONSULTAS',
        targetSubTab: 'BOLETIN',
        recommendedSteps: [
          'Ingresa a Consultas y Reportes → Boletín Informativo.',
          'Escoge la sección y el estudiante a inspeccionar.',
          'Verifica las notas de cada asignatura y agrega observaciones pedagógicas cualitativas.',
          'Usa el botón de Vista Previa o Imprimir Boletín si requieres la versión física en tamaño carta.'
        ]
      }
    ],
    dosAndDonts: {
      dos: [
        'Cargar las notas de manera continua semana a semana y no dejarlas para el último día del lapso.',
        'Respetar estrictamente la escala: Literal (A, B, C, D, E) en Primaria y Numérica (01 a 20) en Media General.',
        'Notificar a la Coordinación Pedagógica si un estudiante supera el 20% de faltas a tus clases.'
      ],
      donts: [
        'No coloques notas numéricas a niños de Educación Inicial o Primaria.',
        'No modifiques calificaciones una vez que la ventana de carga del lapso haya sido cerrada por Dirección.',
        'No compartas tus credenciales de acceso personales con otros docentes o alumnos.'
      ]
    }
  },

  SECRETARIA: {
    roleId: 'SECRETARIA',
    roleTitle: 'Secretaría Académica / Control de Estudios',
    badgeEmoji: '📂',
    department: 'Secretaría de Control de Estudios (UCE)',
    roleGreeting: '¡Bienvenida, Secretaría Académica!',
    roleOverview: 'Tu labor es el corazón administrativo del colegio: te encargas de las admisiones e inscripciones de estudiantes, el padrón de matrícula, la emisión formal de constancias y la custodia del archivo institucional.',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    missions: [
      {
        id: 'sec-m1',
        title: 'Inscribir Nuevos Alumnos y Regulares',
        badge: 'Admisiones',
        summary: 'Registra los expedientes completos vinculando datos del representante legal, ficha médica y grado/sección.',
        iconName: 'UserCheck',
        targetTab: 'GESTION',
        targetSubTab: 'INSCRIPCIONES',
        recommendedSteps: [
          'Accede a Gestión Escolar → Asistente de Inscripciones.',
          'Paso 1: Completa los datos y correo del Representante Legal.',
          'Paso 2: Llena el expediente del Alumno (nombres, cédula escolar, tipo de sangre).',
          'Paso 3: Asigna el subsistema (Inicial, Primaria, Media) y sección, y genera la planilla de matrícula.'
        ]
      },
      {
        id: 'sec-m2',
        title: 'Padrón Estudiantil y Ficha del Alumno',
        badge: 'Matrícula',
        summary: 'Consulta la lista general de estudiantes activos por nivel, edad, género y estatus administrativo.',
        iconName: 'Users',
        targetTab: 'GESTION',
        targetSubTab: 'MATRICULA',
        recommendedSteps: [
          'Dirígete a Gestión Escolar → Matrícula y Padrón.',
          'Utiliza los filtros rápidos por grado o escribe el nombre del estudiante en el buscador.',
          'Visualiza el expediente del alumno, sus datos familiares y la información de contacto de emergencia.',
          'Exporta la nómina del curso a formato Excel o PDF cuando la Dirección lo solicite.'
        ]
      },
      {
        id: 'sec-m3',
        title: 'Tramitar Constancias y Documentos Oficiales',
        badge: 'Trámites',
        summary: 'Atiende y gestiona las solicitudes de constancias de estudio, cartas de buena conducta y notas certificadas.',
        iconName: 'FileText',
        targetTab: 'GESTION',
        targetSubTab: 'DOCUMENTOS',
        recommendedSteps: [
          'Ve a Gestión Escolar → Documentos Solicitados.',
          'Revisa las peticiones entrantes de los representantes o genera una nueva solicitud en ventanilla.',
          'Verifica que el alumno no posea bloqueo administrativo pendiente.',
          'Cambia el estado a "Listo para Retirar" y presiona "Imprimir Constancia" con el membrete institucional.'
        ]
      },
      {
        id: 'sec-m4',
        title: 'Consultar Sábanas de Rendimiento y Listados',
        badge: 'Consultas',
        summary: 'Accede a las sábanas integrales de calificaciones por sección y nóminas oficiales para auditorías ministeriales.',
        iconName: 'FileSpreadsheet',
        targetTab: 'CONSULTAS',
        targetSubTab: 'NOMINAS',
        recommendedSteps: [
          'Navega a Consultas y Reportes → Nóminas de Alumnos.',
          'Selecciona el nivel y la sección deseada.',
          'Descarga el listado oficial con cédulas de identidad, fechas de nacimiento y nombres completos.'
        ]
      }
    ],
    dosAndDonts: {
      dos: [
        'Verificar cuidadosamente que la cédula y fecha de nacimiento coincidan con la partida de nacimiento física.',
        'Atender y resolver las solicitudes de constancias en el módulo de Documentos en un plazo no mayor a 48 horas.',
        'Verificar el estatus de solvencia antes de imprimir constancias o notas certificadas.'
      ],
      donts: [
        'No asentar o modificar calificaciones académicas (función exclusiva de docentes y coordinación).',
        'No inscribir alumnos en grados o secciones con cupo cerrado sin previa autorización escrita de Dirección.'
      ]
    }
  },

  ASISTENTE: {
    roleId: 'ASISTENTE',
    roleTitle: 'Asistente de Aula y Disciplina',
    badgeEmoji: '🤝',
    department: 'Coordinación de Asistencia y Disciplina',
    roleGreeting: '¡Bienvenido(a), Asistente de Aula!',
    roleOverview: 'Tu función en SICE-CBA está enfocada operativamente en el día a día escolar: controlar la puntualidad mediante Pases por Retraso, asentar la Asistencia Diaria y llevar el historial de Conducta y Disciplina.',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    missions: [
      {
        id: 'asi-m1',
        title: 'Emitir Pases por Retraso a Primera Hora',
        badge: 'Portería & Pases',
        summary: 'Genera boletas térmicas o tickets rápidos para estudiantes que llegan después del timbre de entrada.',
        iconName: 'Clock',
        targetTab: 'GESTION',
        targetSubTab: 'PASES',
        recommendedSteps: [
          'Ingresa a Gestión Escolar → Pases por Retraso.',
          'Busca al alumno por nombre o número de cédula.',
          'Indica si el retraso es Justificado o Injustificado y escribe el motivo brevemente.',
          'Haz clic en "Emitir e Imprimir Pase" y entrega el comprobante para su ingreso al salón.'
        ]
      },
      {
        id: 'asi-m2',
        title: 'Registro de Asistencias Diarias',
        badge: 'Asistencia',
        summary: 'Apoya a los salones en la toma y verificación del pase de lista durante la jornada escolar.',
        iconName: 'CheckCircle2',
        targetTab: 'GESTION',
        targetSubTab: 'INASISTENCIAS',
        recommendedSteps: [
          'Ve a Gestión Escolar → Registro de Asistencia.',
          'Selecciona la sección y confirma los presentes y ausentes reportados.',
          'Registra las justificaciones médicas recibidas en portería para actualizar las inasistencias.',
          'Guarda el registro diario para alimentar los reportes estadísticos semanales.'
        ]
      },
      {
        id: 'asi-m3',
        title: 'Registrar Incidencias de Conducta',
        badge: 'Disciplina',
        summary: 'Asienta faltas de uniforme, llamados de atención o reconocimientos de convivencia escolar.',
        iconName: 'ShieldAlert',
        targetTab: 'GESTION',
        targetSubTab: 'CONDUCTAS',
        recommendedSteps: [
          'Entra en Gestión Escolar → Historial de Conductas.',
          'Busca al estudiante involucrado en la incidencia.',
          'Selecciona el tipo de evento: Leve, Moderada, Grave o Mérito Positivo.',
          'Escribe una descripción objetiva de los hechos y pulsa "Registrar Conducta".'
        ]
      }
    ],
    dosAndDonts: {
      dos: [
        'Emitir el pase de retraso inmediatamente al llegar el alumno para que no pierda tiempo de clase.',
        'Registrar con precisión las justificaciones médicas presentadas por los representantes.',
        'Mantener un tono pedagógico, cordial y objetivo en los reportes de convivencia.'
      ],
      donts: [
        'No tienes permisos para registrar ni modificar calificaciones o notas académicas.',
        'No omitas registrar un pase de retraso aunque el estudiante ingrese con su representante.'
      ]
    }
  },

  COORDINACION: {
    roleId: 'COORDINACION',
    roleTitle: 'Coordinación Pedagógica / UCE',
    badgeEmoji: '📋',
    department: 'Unidad de Control de Estudios (UCE)',
    roleGreeting: '¡Bienvenido(a), Coordinación Pedagógica!',
    roleOverview: 'Supervisas la calidad educativa integral del plantel: revisas y apruebas los planes quincenales, auditas las notas procesales de los docentes, supervisas los boletines y avalas las actas de consejo de curso.',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    missions: [
      {
        id: 'coor-m1',
        title: 'Auditar Planes Didácticos de Docentes',
        badge: 'Planificación',
        summary: 'Revisa las planificaciones quincenales y de lapso presentadas por los profesores para dar el visto bueno.',
        iconName: 'BookOpen',
        targetTab: 'MEDIA_GENERAL',
        targetSubTab: 'PLAN_QUINCENAL',
        recommendedSteps: [
          'Selecciona el nivel escolar en la cabecera (Inicial, Primaria, Media General).',
          'Ve a Planificación Pedagógica → Plan Quincenal o Plan de Lapso.',
          'Examina que los indicadores y estrategias cumplan con los lineamientos ministeriales y el proyecto CBA.',
          'Aprueba la planificación o deja observaciones pedagógicas constructivas al docente.'
        ]
      },
      {
        id: 'coor-m2',
        title: 'Auditar Sábanas de Calificaciones y Rendimiento',
        badge: 'Auditoría UCE',
        summary: 'Inspecciona la matriz de notas de todas las materias y detecta cursos con altos índices de aplazados.',
        iconName: 'FileSpreadsheet',
        targetTab: 'CONSULTAS',
        targetSubTab: 'RENDIMIENTO',
        recommendedSteps: [
          'Entra a Consultas y Reportes → Sábana de Calificaciones.',
          'Filtra por sección y lapso en curso.',
          'Verifica que ningún profesor tenga casillas de notas pendientes antes del cierre.',
          'Identifica a los alumnos con promedios inferiores a 12 pts para activar Planes Remediales.'
        ]
      },
      {
        id: 'coor-m3',
        title: 'Aprobación y Emisión de Boletines Oficiales',
        badge: 'Boletines',
        summary: 'Genera las boletas formales por sección completa para entrega en las asambleas de representantes.',
        iconName: 'GraduationCap',
        targetTab: 'CONSULTAS',
        targetSubTab: 'BOLETIN',
        recommendedSteps: [
          'Ve a Consultas y Reportes → Boletín Informativo.',
          'Selecciona el grado o año escolar.',
          'Verifica las observaciones redactadas por el docente guía.',
          'Presiona "Imprimir Boletín Oficial" para generar las copias con membrete y casillas de firma.'
        ]
      },
      {
        id: 'coor-m4',
        title: 'Actas de Consejo de Curso y Planes de Acción',
        badge: 'Consejo Docente',
        summary: 'Genera las actas formales de deliberación de fin de lapso y activa planes de nivelación con IA.',
        iconName: 'Sparkles',
        targetTab: 'MEDIA_GENERAL',
        targetSubTab: 'ACTAS_CONSEJO',
        recommendedSteps: [
          'Ve al pilar de Comunicación del nivel → Actas de Consejo.',
          'Consolida los promedios y acuerdos del equipo docente de la sección.',
          'Genera propuestas remediales y planes de acción para estudiantes en riesgo pedagógico.'
        ]
      }
    ],
    dosAndDonts: {
      dos: [
        'Supervisar que cada nivel respete su escala oficial (Literal en Inicial/Primaria y Vigesimal en Media).',
        'Validar las notas procesales antes de emitir los boletines oficiales a la comunidad escolar.',
        'Acompañar a los docentes que presenten rezago en la carga de sus planes de estudio.'
      ],
      donts: [
        'No autorizar entrega de boletines sin previa revisión de la Coordinación Pedagógica.',
        'No permitir ponderaciones que sumen más o menos del 100% en las asignaturas de Media General.'
      ]
    }
  },

  COORDINADOR: {
    roleId: 'COORDINADOR',
    roleTitle: 'Coordinador Pedagógico',
    badgeEmoji: '📋',
    department: 'Unidad de Control de Estudios (UCE)',
    roleGreeting: '¡Bienvenido(a), Coordinador Pedagógico!',
    roleOverview: 'Cuentas con las mismas facultades y responsabilidades que la Coordinación Pedagógica: supervisar la planificación didáctica, auditar notas y velar por el rendimiento integral de los alumnos.',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    missions: [
      {
        id: 'coor-m1-alias',
        title: 'Supervisión Curricular y Calificaciones',
        badge: 'UCE',
        summary: 'Audita sábanas de notas, aprueba boletines y atiende casos de nivelación académica.',
        iconName: 'FileSpreadsheet',
        targetTab: 'CONSULTAS',
        targetSubTab: 'RENDIMIENTO',
        recommendedSteps: [
          'Ingresa a Consultas y Reportes para auditar las sábanas de notas del lapso.',
          'Revisa los planes quincenales en el pilar de Planificación Pedagógica.',
          'Emite los boletines oficiales y consolida las actas del consejo docente.'
        ]
      }
    ],
    dosAndDonts: {
      dos: [
        'Acompañar pedagógicamente al cuerpo docente en el uso de las escalas oficiales CBA.'
      ],
      donts: [
        'No avalar boletines con materias pendientes de calificación.'
      ]
    }
  },

  DIRECTOR: {
    roleId: 'DIRECTOR',
    roleTitle: 'Director General CBA',
    badgeEmoji: '🏛️',
    department: 'Dirección General',
    roleGreeting: '¡Bienvenido(a), Director General!',
    roleOverview: 'Como máxima autoridad directiva y académica, tienes acceso integral para supervisar indicadores globales de rendimiento, autorizar la apertura de lapsos, visar títulos de graduación y publicar comunicados oficiales.',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    missions: [
      {
        id: 'dir-m1',
        title: 'Supervisión Ejecutiva del Rendimiento Escolar',
        badge: 'Indicadores',
        summary: 'Monitorea las tasas de aprobación general, promedios por nivel y asignaturas con alertas.',
        iconName: 'BarChart3',
        targetTab: 'CONSULTAS',
        targetSubTab: 'ESTADISTICAS',
        recommendedSteps: [
          'Entra a Consultas y Reportes → Estadísticas Institucionales.',
          'Observa los gráficos de rendimiento y distribución de notas por sección.',
          'Identifica materias críticas para acordar estrategias con las coordinaciones pedagógicas.'
        ]
      },
      {
        id: 'dir-m2',
        title: 'Apertura y Cierre de Ventanas de Evaluación',
        badge: 'Lapsos Escolares',
        summary: 'Regula las fechas hábiles de carga de notas para los 3 lapsos académicos del año escolar.',
        iconName: 'Sliders',
        targetTab: 'CONFIGURACION',
        targetSubTab: 'LAPSOS',
        recommendedSteps: [
          'Ingresa a Configuración → Lapsos Escolares.',
          'Verifica el estado del lapso activo (1er, 2do o 3er Lapso).',
          'Abre la ventana de carga para los docentes o ciérrala formalmente al finalizar el ciclo.'
        ]
      },
      {
        id: 'dir-m3',
        title: 'Auditoría y Emisión de Títulos de Bachiller',
        badge: 'Graduación',
        summary: 'Supervisa el registro de egresados, seriales de títulos y actas de grado de Media General.',
        iconName: 'GraduationCap',
        targetTab: 'GESTION',
        targetSubTab: 'TITULOS',
        recommendedSteps: [
          'Ve a Gestión Escolar → Títulos y Actas de Grado.',
          'Verifica la culminación exitosa de los requisitos de los estudiantes de 5to año.',
          'Revisa el código asignado a cada diploma y autoriza la impresión final.'
        ]
      },
      {
        id: 'dir-m4',
        title: 'Publicar Comunicados y Circulares Institucionales',
        badge: 'Comunidad',
        summary: 'Difunde mensajes oficiales para toda la comunidad de padres, docentes y alumnos.',
        iconName: 'MessageSquare',
        targetTab: 'COMUNIDAD',
        targetSubTab: 'COMUNICADOS',
        recommendedSteps: [
          'Dirígete a Comunidad → Comunicados Institucionales.',
          'Redacta el título, circular informativa y nivel de prioridad (Informativo, Urgente o Festivo).',
          'Publica el comunicado para que sea visible de inmediato en la cartelera del sistema.'
        ]
      }
    ],
    dosAndDonts: {
      dos: [
        'Supervisar que los cierres de lapsos se ejecuten en las fechas aprobadas por el calendario institucional.',
        'Monitorear la correcta aplicación de las normativas de evaluación en Inicial, Primaria y Media General.'
      ],
      donts: [
        'No mantener ventanas de notas abiertas indefinidamente tras la emisión de los boletines formales.'
      ]
    }
  },

  ADMINISTRADOR: {
    roleId: 'ADMINISTRADOR',
    roleTitle: 'Administrador de Sistemas',
    badgeEmoji: '👑',
    department: 'Dirección de Tecnología / TI',
    roleGreeting: '¡Bienvenido(a), Administrador TI!',
    roleOverview: 'Tienes control total del sistema SICE-CBA: gestión de cuentas de usuarios, generación de códigos de autorización, seguridad, parametrización curricular y supervisión técnica de la base de datos en Supabase.',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    missions: [
      {
        id: 'adm-m1',
        title: 'Gestión de Personal y Cuentas de Acceso',
        badge: 'Usuarios & Seguridad',
        summary: 'Crea nuevas cuentas para docentes, asistentes o secretarias y genera códigos de auto-registro.',
        iconName: 'Users',
        targetTab: 'CONFIGURACION',
        targetSubTab: 'DOCENTES',
        recommendedSteps: [
          'Ingresa a Configuración → Personal Docente y Administrativo.',
          'Registra un nuevo usuario con su correo institucional, contraseña inicial y rol asignado.',
          'Alternativamente, genera un "Código de Autorización" para que el docente se auto-registre desde la pantalla de bienvenida.'
        ]
      },
      {
        id: 'adm-m2',
        title: 'Parametrización de Años Escolares y Lapsos',
        badge: 'Calendario',
        summary: 'Configura las fechas oficiales del año académico y los límites de cada lapso evaluativo.',
        iconName: 'Sliders',
        targetTab: 'CONFIGURACION',
        targetSubTab: 'LAPSOS',
        recommendedSteps: [
          'Accede a Configuración → Lapsos Escolares.',
          'Define el año escolar activo (ej. 2026-2027) y el lapso en curso.',
          'Gestiona el interruptor de bloqueo y apertura de notas para los docentes.'
        ]
      },
      {
        id: 'adm-m3',
        title: 'Estructura Curricular y Asignaturas',
        badge: 'Plan de Estudios',
        summary: 'Administra las asignaturas, áreas de aprendizaje y carga horaria de cada nivel educativo.',
        iconName: 'BookOpen',
        targetTab: 'CONFIGURACION',
        targetSubTab: 'ESTRUCTURA',
        recommendedSteps: [
          'Ve a Configuración → Estructura Curricular.',
          'Verifica las áreas por subsistema (Inicial, Primaria, Media General).',
          'Añade o edita asignaturas según las actualizaciones del plan de estudios oficial.'
        ]
      },
      {
        id: 'adm-m4',
        title: 'Simulación y Auditoría de Roles (RBAC)',
        badge: 'Control RBAC',
        summary: 'Verifica la experiencia de usuario simulando la vista desde cualquier otro rol institucional.',
        iconName: 'ShieldAlert',
        targetTab: 'ESCRITORIO',
        targetSubTab: 'DASHBOARD',
        recommendedSteps: [
          'Usa el conmutador de simulación de rol en la barra superior o en la Consola HUD.',
          'Prueba la visibilidad de menús y restricciones operativas de cada perfil.',
          'Restablece en un clic tu perfil original de Administrador.'
        ]
      }
    ],
    dosAndDonts: {
      dos: [
        'Resguardar la integridad de los datos en producción manteniendo tablas limpias de registros falsos.',
        'Asignar siempre el rol exacto según las responsabilidades del trabajador (ej. Asistente para portería, Secretaria para admisiones).'
      ],
      donts: [
        'No conceder rol de Administrador a personal que no pertenezca al equipo de sistemas o dirección.',
        'No borrar datos directamente sin verificar las relaciones de llaves foráneas.'
      ]
    }
  },

  REPRESENTANTE: {
    roleId: 'REPRESENTANTE',
    roleTitle: 'Padre o Representante Legal',
    badgeEmoji: '👨‍👩‍👦',
    department: 'Comunidad de Padres y Representantes',
    roleGreeting: '¡Bienvenido(a), Representante CBA!',
    roleOverview: 'Este portal familiar te permite acompañar el crecimiento académico de tu hijo(a): consultar las notas actualizadas, revisar los boletines por lapso, verificar la asistencia diaria y estar al día con los comunicados oficiales del colegio.',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    missions: [
      {
        id: 'rep-m1',
        title: 'Consultar el Boletín de Calificaciones',
        badge: 'Boletín Familiar',
        summary: 'Visualiza el informe académico oficial de tu representado con las observaciones del maestro o docente guía.',
        iconName: 'GraduationCap',
        targetTab: 'CONSULTAS',
        targetSubTab: 'BOLETIN',
        recommendedSteps: [
          'Haz clic en Consultas → Boletín Informativo.',
          'Observa las valoraciones en cada asignatura correspondientes al lapso en curso.',
          'Lee atentamente las observaciones de desempeño redactadas por los profesores.',
          'Puedes guardar una copia o imprimir el boletín oficial si lo deseas.'
        ]
      },
      {
        id: 'rep-m2',
        title: 'Verificar el Récord de Asistencia y Puntualidad',
        badge: 'Asistencia',
        summary: 'Revisa las asistencias, inasistencias y pases de retraso registrados a primera hora.',
        iconName: 'Clock',
        targetTab: 'CONSULTAS',
        targetSubTab: 'ASISTENCIA',
        recommendedSteps: [
          'Entra en Consultas → Récord de Asistencias.',
          'Observa el porcentaje acumulado de asistencia del estudiante.',
          'Verifica que las faltas justificadas (médicas) hayan sido registradas por la secretaría o portería.'
        ]
      },
      {
        id: 'rep-m3',
        title: 'Leer Noticias y Cartelera Escolar',
        badge: 'Comunidad',
        summary: 'Mantente informado sobre actos culturales, efemérides, reuniones de padres y calendarios festivos.',
        iconName: 'MessageSquare',
        targetTab: 'COMUNIDAD',
        targetSubTab: 'NOTICIAS',
        recommendedSteps: [
          'Ve a Comunidad → Cartelera de Noticias.',
          'Consulta los avisos institucionales más recientes emitidos por la Dirección del plantel.'
        ]
      }
    ],
    dosAndDonts: {
      dos: [
        'Revisar periódicamente el boletín y conversar con el docente de aula ante cualquier duda formativa.',
        'Presentar las justificaciones de inasistencia en Secretaría en un plazo no mayor a 48 horas tras la ausencia.'
      ],
      donts: [
        'No compartas tus claves con terceras personas.'
      ]
    }
  },

  ESTUDIANTE: {
    roleId: 'ESTUDIANTE',
    roleTitle: 'Estudiante CBA',
    badgeEmoji: '🎒',
    department: 'Cuerpo Estudiantil CBA',
    roleGreeting: '¡Hola, Estudiante CBA!',
    roleOverview: 'En tu portal estudiantil puedes hacer seguimiento de tu propio progreso escolar: conocer tus notas, ver tu boletín informativo, revisar tu asistencia y leer las noticias y actividades del Colegio Bellas Artes.',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    missions: [
      {
        id: 'est-m1',
        title: 'Ver Mis Calificaciones y Boletín',
        badge: 'Mis Notas',
        summary: 'Revisa tus valoraciones por asignatura y las sugerencias de tus profesores para seguir mejorando.',
        iconName: 'GraduationCap',
        targetTab: 'CONSULTAS',
        targetSubTab: 'BOLETIN',
        recommendedSteps: [
          'Haz clic en Consultas → Boletín Informativo.',
          'Comprueba tus calificaciones del lapso en cada materia.',
          'Consulta las recomendaciones pedagógicas de tus profesores para tus próximas evaluaciones.'
        ]
      },
      {
        id: 'est-m2',
        title: 'Verificar Mis Asistencias y Puntualidad',
        badge: 'Asistencias',
        summary: 'Consulta tu asistencia diaria a clases y evita acumular retrasos injustificados.',
        iconName: 'CheckCircle2',
        targetTab: 'CONSULTAS',
        targetSubTab: 'ASISTENCIA',
        recommendedSteps: [
          'Ingresa a Consultas → Asistencia.',
          'Asegúrate de mantener tu récord por encima del 75% reglamentario.'
        ]
      },
      {
        id: 'est-m3',
        title: 'Cartelera Escolar y Cumpleaños',
        badge: 'Comunidad',
        summary: 'Entérate de las actividades deportivas, culturales y celebraciones institucionales de tu colegio.',
        iconName: 'MessageSquare',
        targetTab: 'COMUNIDAD',
        targetSubTab: 'NOTICIAS',
        recommendedSteps: [
          'Revisa la pestaña Comunidad para enterarte de eventos y efemérides del Colegio Bellas Artes.'
        ]
      }
    ],
    dosAndDonts: {
      dos: [
        'Revisar tus notas con regularidad para consultar dudas a tiempo con tus maestros.',
        'Llegar puntual al colegio para evitar emisión de pases por retraso a primera hora.'
      ],
      donts: [
        'No intentes acceder a pantallas administrativas ajenas a tu rol estudiantil.'
      ]
    }
  }
};
