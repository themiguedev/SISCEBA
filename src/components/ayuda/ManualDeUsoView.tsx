import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Printer,
  Sparkles,
  UserCheck,
  GraduationCap,
  ClipboardList,
  Clock,
  ShieldAlert,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  Compass,
  ArrowRight,
  Sliders,
  Layers,
  BookMarked,
  Info,
  Laptop,
  Filter,
  Keyboard
} from 'lucide-react';

interface ManualDeUsoViewProps {
  onNavigate?: (tab: any, subTab?: string) => void;
}

type ManualSection = 'INICIO_RAPIDO' | 'GUIAS_PASO_A_PASO' | 'FAQ' | 'ATAJOS';
type RoleFilter = 'TODOS' | 'DOC' | 'UCE' | 'ADM';

interface WorkflowGuide {
  id: string;
  title: string;
  category: 'Planificación' | 'Evaluación' | 'Gestión' | 'Institucional';
  roleRequired: 'DOC' | 'UCE' | 'ADM' | 'TODOS';
  summary: string;
  targetTab: string;
  targetSubTab?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge: string;
  steps: {
    number: number;
    title: string;
    description: string;
    tip?: string;
  }[];
  institutionalRule?: string;
}

interface FaqItem {
  id: string;
  question: string;
  category: string;
  role: 'DOC' | 'UCE' | 'ADM' | 'TODOS';
  answer: string;
  highlight?: string;
}

export const ManualDeUsoView: React.FC<ManualDeUsoViewProps> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState<ManualSection>('INICIO_RAPIDO');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>('guia-1');

  // --- Catálogo de Guías Paso a Paso ---
  const workflowGuides: WorkflowGuide[] = [
    {
      id: 'guia-1',
      title: 'Elaboración del Plan Quincenal de Clases',
      category: 'Planificación',
      roleRequired: 'DOC',
      summary: 'Estructure sus unidades didácticas quincenales asociando competencias, indicadores de logro y estrategias pedagógicas.',
      targetTab: 'PLANIFICACION',
      targetSubTab: 'PLAN_QUINCENAL',
      icon: BookOpen,
      color: 'from-amber-500 to-amber-600',
      badge: 'Docentes',
      institutionalRule: 'Los planes quincenales deben ser cargados los días viernes previos al inicio del bloque de dos semanas.',
      steps: [
        {
          number: 1,
          title: 'Seleccionar Nivel y Asignatura',
          description: 'En la barra superior, escoja su nivel (Inicial, Primaria o Media General) y navegue a la pestaña "Plan Quincenal".',
          tip: 'Verifique que el lapso escolar activo corresponda al período actual.'
        },
        {
          number: 2,
          title: 'Definir Datos y Tema del Proyecto',
          description: 'Indique el grado, sección, fecha de inicio, fecha de culminación y el título de la unidad o proyecto integrador de aprendizaje.',
          tip: 'Utilice títulos contextualizados acordes con las efemérides o proyectos transversales del CBA.'
        },
        {
          number: 3,
          title: 'Vincular Competencias e Indicadores',
          description: 'Haga clic en el banco oficial para seleccionar las competencias e indicadores que evaluará durante la quincena.',
          tip: 'En Media General, asigne el porcentaje de ponderación acumulada hasta completar el 100% del lapso.'
        },
        {
          number: 4,
          title: 'Registrar Estrategias y Guardar',
          description: 'Seleccione las actividades de inicio, desarrollo y cierre, y pulse "Guardar Plan". Podrá exportarlo o imprimirlo de inmediato.'
        }
      ]
    },
    {
      id: 'guia-2',
      title: 'Carga de Calificaciones y Seguimiento Procesal',
      category: 'Evaluación',
      roleRequired: 'DOC',
      summary: 'Registro continuo de desempeños por estudiante según la escala oficial: cualitativa, literales A-E o numérica 01-20.',
      targetTab: 'EVALUACION',
      targetSubTab: 'PROCESAL',
      icon: FileSpreadsheet,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Evaluación Continua',
      institutionalRule: 'La carga es procesal y acumulativa. Evite acumular registros al final del lapso.',
      steps: [
        {
          number: 1,
          title: 'Acceder a Evaluación Procesal',
          description: 'Desde el menú lateral o el conmutador de pilares, ingrese a "Evaluación Continua y Procesal".',
          tip: 'El sistema adapta automáticamente la tabla al tipo de escala del nivel educativo seleccionado.'
        },
        {
          number: 2,
          title: 'Elegir Sección y Asignatura',
          description: 'Filtre la lista de estudiantes por grado y sección para cargar la matriz de seguimiento.',
        },
        {
          number: 3,
          title: 'Ingresar Valoraciones por Indicador',
          description: 'Ingrese los valores para cada indicador evaluado. En Primaria use la escala literal (A, B, C, D, E) y en Media notas numéricas enteras (01-20).',
          tip: 'El sistema calcula promedios y literales proyectados de manera inmediata en pantalla.'
        },
        {
          number: 4,
          title: 'Confirmar y Guardar Cambios',
          description: 'Pulse "Guardar Calificaciones". Los datos se sincronizan con las sábanas de notas y boletines informativos.'
        }
      ]
    },
    {
      id: 'guia-3',
      title: 'Emisión y Consulta de Boletines Informativos',
      category: 'Evaluación',
      roleRequired: 'UCE',
      summary: 'Generación de la boleta de calificaciones con observaciones pedagógicas, membrete oficial y formato imprimible.',
      targetTab: 'COMUNICACION',
      targetSubTab: 'BOLETIN',
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Comité de Evaluación',
      institutionalRule: 'Los boletines requieren el aval de la Coordinación Pedagógica antes de su entrega formal a representantes.',
      steps: [
        {
          number: 1,
          title: 'Ingresar a Comunicación y Boletín',
          description: 'Seleccione la sección "Boletín Informativo" dentro del módulo pedagógico de su nivel.',
        },
        {
          number: 2,
          title: 'Seleccionar Estudiante o Sección Completa',
          description: 'Puede generar el boletín individual de un alumno en específico o emitir la tanda completa de la sección.',
          tip: 'Revise que todas las asignaturas posean calificaciones registradas para evitar casillas vacías.'
        },
        {
          number: 3,
          title: 'Redactar Observaciones de Conducta y Rendimiento',
          description: 'Añada las notas cualitativas del docente guía sobre el desempeño integral, asistencia y convivencia.',
        },
        {
          number: 4,
          title: 'Vista Previa e Impresión',
          description: 'Pulse "Imprimir Boletín Oficial". Se generará el formato institucional con firmas y sellos en hoja tamaño carta.'
        }
      ]
    },
    {
      id: 'guia-4',
      title: 'Asistente de Inscripciones en 3 Pasos',
      category: 'Gestión',
      roleRequired: 'ADM',
      summary: 'Registro formal de alumnos regulares y nuevos ingresos vinculando datos familiares, académicos y de salud.',
      targetTab: 'GESTION',
      targetSubTab: 'INSCRIPCIONES',
      icon: UserCheck,
      color: 'from-purple-500 to-pink-600',
      badge: 'Admisiones',
      institutionalRule: 'Debe adjuntarse copia de cédula, partida de nacimiento y solvencia administrativa para validar la admisión.',
      steps: [
        {
          number: 1,
          title: 'Paso 1: Datos del Representante Legal',
          description: 'Complete cédula, nombres, correo electrónico verificado, teléfono principal y parentesco con el alumno.',
          tip: 'El correo será utilizado por el portal de autogestión de representantes.'
        },
        {
          number: 2,
          title: 'Paso 2: Expediente del Alumno',
          description: 'Cargue nombres completos, fecha de nacimiento, tipo de sangre, alergias o consideraciones médicas especiales.',
        },
        {
          number: 3,
          title: 'Paso 3: Asignación de Nivel y Sección',
          description: 'Seleccione el grado/año a cursar, el turno correspondiente y verifique el cupo disponible en la sección.',
        },
        {
          number: 4,
          title: 'Emisión de Constancia de Inscripción',
          description: 'Al pulsar "Finalizar Inscripción", el sistema genera automáticamente el código de matrícula y la planilla oficial.'
        }
      ]
    },
    {
      id: 'guia-5',
      title: 'Pases por Retraso y Control de Portería',
      category: 'Gestión',
      roleRequired: 'ADM',
      summary: 'Emisión de boletas de retraso con ticket térmico o PDF para el control de puntualidad a primera hora.',
      targetTab: 'GESTION',
      targetSubTab: 'PASES',
      icon: Clock,
      color: 'from-amber-600 to-orange-600',
      badge: 'Control Diario',
      institutionalRule: 'Al acumular 3 retrasos injustificados, el sistema emite una notificación de amonestación preventiva.',
      steps: [
        {
          number: 1,
          title: 'Ingresar a Portería y Pases',
          description: 'Diríjase a "Gestión Escolar" → "Pases por Retraso". La hora del sistema se fija automáticamente.',
        },
        {
          number: 2,
          title: 'Buscar al Estudiante',
          description: 'Escriba el nombre, apellido o cédula del alumno en el buscador rápido.',
        },
        {
          number: 3,
          title: 'Especificar Motivo del Retraso',
          description: 'Seleccione si es justificado (médico, transporte escolar) o injustificado, e introduzca el motivo.',
        },
        {
          number: 4,
          title: 'Imprimir Ticket de Entrada',
          description: 'Pulse "Emitir e Imprimir Pase". Entregue la colilla al estudiante para permitir su ingreso al aula de clases.'
        }
      ]
    },
    {
      id: 'guia-6',
      title: 'Planes de Acción Personalizados con IA',
      category: 'Institucional',
      roleRequired: 'DOC',
      summary: 'Generación asistida de actividades de nivelación, refuerzo cognitivo y adaptaciones curriculares para alumnos en riesgo.',
      targetTab: 'MEDIA_GENERAL',
      targetSubTab: 'IA_ACTION_PLANS',
      icon: Sparkles,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Inteligencia Artificial CBA',
      institutionalRule: 'Los planes de acción deben ser validados por el docente de área y archivados en el expediente del estudiante.',
      steps: [
        {
          number: 1,
          title: 'Identificar al Alumno en Seguimiento',
          description: 'Acceda a "Planes de Acción con IA" dentro del bloque de comunicación o desde la alerta de notas inferiores a 12 puntos.',
        },
        {
          number: 2,
          title: 'Seleccionar Necesidades de Aprendizaje',
          description: 'Indique el área de mejora: comprensión lectora, lógica matemática, hábitos de estudio o atención sostenida.',
        },
        {
          number: 3,
          title: 'Generar Propuesta Pedagógica con IA',
          description: 'El modelo pedagógico de SICE-CBA analiza las calificaciones históricas y redacta una secuencia de ejercicios remediales.',
          tip: 'Puede editar y personalizar cualquier recomendación generada por el asistente antes de guardarla.'
        },
        {
          number: 4,
          title: 'Asignar Cronograma de Entrega',
          description: 'Establezca la fecha de entrega del trabajo remedial y comparta el documento con el representante y el estudiante.'
        }
      ]
    },
    {
      id: 'guia-7',
      title: 'Sábana Central de Calificaciones y Estadísticas',
      category: 'Institucional',
      roleRequired: 'UCE',
      summary: 'Auditoría integral de notas por sección con índices de aprobación, promedios grupales y exportación a Excel.',
      targetTab: 'CONSULTAS',
      targetSubTab: 'RENDIMIENTO',
      icon: FileText,
      color: 'from-emerald-600 to-green-700',
      badge: 'Dirección & UCE',
      institutionalRule: 'Documento confidencial para uso exclusivo del Consejo de Docentes y la Dirección Académica.',
      steps: [
        {
          number: 1,
          title: 'Abrir Módulo de Consultas',
          description: 'Navegue a "Consultas y Reportes" → "Sábana de Calificaciones".',
        },
        {
          number: 2,
          title: 'Seleccionar Lapso y Sección',
          description: 'Elija el lapso académico (1, 2 o 3) y el curso deseado para desplegar la matriz completa.',
        },
        {
          number: 3,
          title: 'Analizar Indicadores de Rendimiento',
          description: 'Observe las casillas en rojo para notas reprobadas y el gráfico de barras con el promedio de la sección.',
          tip: 'Haga clic en la cabecera de cualquier materia para ordenar a los alumnos de mayor a menor calificación.'
        },
        {
          number: 4,
          title: 'Exportar o Imprimir Sábana',
          description: 'Descargue la matriz en formato Excel / CSV o envíela a la impresora en formato apaisado (Landscape).'
        }
      ]
    },
    {
      id: 'guia-8',
      title: 'Apertura y Cierre de Ventanas de Evaluación',
      category: 'Gestión',
      roleRequired: 'ADM',
      summary: 'Regulación del calendario académico para permitir o bloquear la carga de notas a los docentes de cada lapso.',
      targetTab: 'CONFIGURACION',
      targetSubTab: 'LAPSOS',
      icon: Sliders,
      color: 'from-slate-600 to-slate-800',
      badge: 'Control Institucional',
      institutionalRule: 'Una vez cerrado el lapso, ninguna nota puede ser modificada sin autorización expresa de la Dirección.',
      steps: [
        {
          number: 1,
          title: 'Ingresar a Configuración del Plantel',
          description: 'Acceda con credenciales de Administrador (ADM) al menú "Configuración" → "Años Escolares y Lapsos".',
        },
        {
          number: 2,
          title: 'Localizar el Lapso en Curso',
          description: 'Revise el estado actual del 1er, 2do o 3er Lapso (Abierto / Cerrado).',
        },
        {
          number: 3,
          title: 'Alternar Interruptor de Carga',
          description: 'Haga clic en "Abrir Ventana de Carga" para permitir a los docentes registrar notas, o "Bloquear" para sellar el lapso.',
        },
        {
          number: 4,
          title: 'Guardar Parámetros de Auditoría',
          description: 'El sistema registra la fecha, hora y usuario que autorizó la apertura o cierre del período evaluativo.'
        }
      ]
    }
  ];

  // --- Catálogo de Preguntas Frecuentes (FAQ) ---
  const faqItems: FaqItem[] = [
    {
      id: 'faq-1',
      question: '¿Cómo cambio de nivel educativo (Inicial, Primaria, Media General)?',
      category: 'Navegación General',
      role: 'TODOS',
      answer: 'En la parte superior de la cabecera encontrará tres botones con los nombres de cada nivel (Educación Inicial, Educación Primaria y Media General). Al hacer clic en cualquiera de ellos, todo el sistema ajusta dinámicamente sus asignaturas, estudiantes y escalas evaluativas.',
      highlight: 'También puede usar el atajo de teclado Ctrl + K y escribir el nombre del nivel para saltar de inmediato.'
    },
    {
      id: 'faq-2',
      question: '¿Qué significa el límite de inasistencias del 25% y cómo se calcula?',
      category: 'Control Escolar',
      role: 'DOC',
      answer: 'Según la normativa ministerial y el reglamento del CBA, los estudiantes que superen el 25% de inasistencias no justificadas en una asignatura pierden el derecho a la evaluación procesal ordinaria. El sistema marca automáticamente la fila del alumno con una alerta amarilla o roja cuando se aproxima a dicho porcentaje.',
      highlight: 'Envíe un reporte a la Coordinación UCE desde la pestaña de Conductas cuando un alumno alcance el 20% de faltas.'
    },
    {
      id: 'faq-3',
      question: '¿Cómo puedo imprimir un boletín o reporte en tamaño limpio sin menús?',
      category: 'Impresión y Documentos',
      role: 'TODOS',
      answer: 'Todas las vistas del sistema están adaptadas con hojas de estilo para impresión (@media print). Al pulsar el botón "Imprimir" dentro de cualquier módulo (o presionar Ctrl + P), el sistema oculta automáticamente la barra lateral, cabeceras y botones, mostrando únicamente el documento oficial con membrete y casillas de firma.',
      highlight: 'Asegúrese de seleccionar la opción "Gráficos de fondo" en la ventana de impresión de su navegador para mantener los colores oficiales.'
    },
    {
      id: 'faq-4',
      question: '¿Qué función cumple el Buscador Rápido (Spotlight Search)?',
      category: 'Productividad',
      role: 'TODOS',
      answer: 'El buscador Spotlight se activa presionando las teclas Ctrl + K (o Cmd + K en Mac) o haciendo clic en el icono de lupa en la barra superior. Le permite localizar en milisegundos a cualquier alumno, asignatura, trámite pendiente o pantalla del sistema sin necesidad de navegar manualmente por los menús.',
      highlight: 'Escriba las primeras letras del nombre de un alumno para ver su nivel y abrir su ficha directamente.'
    },
    {
      id: 'faq-5',
      question: '¿Cómo funciona el Bloqueo Administrativo y qué efectos produce?',
      category: 'Administración',
      role: 'ADM',
      answer: 'El bloqueo administrativo restringe la emisión de constancias de estudio, notas certificadas y boletines oficiales para estudiantes con compromisos financieros o documentales pendientes. Los docentes pueden seguir cargando sus calificaciones con normalidad, pero el portal retiene la entrega del documento formal hasta que Administración desactive la restricción.',
      highlight: 'El bloqueo se gestiona desde el menú "Gestión Escolar" → "Bloqueo Administrativo".'
    },
    {
      id: 'faq-6',
      question: '¿Por qué aparece el accesorio festivo en el logo del colegio?',
      category: 'Identidad Visual',
      role: 'TODOS',
      answer: 'El sistema incorpora un motor inteligente de efemérides automáticas que adorna el logotipo del Colegio Bellas Artes según la fecha del calendario (birrete académico en septiembre, gorro navideño en diciembre, corazones en febrero, elementos culturales en el día de la zulianidad, etc.). Es puramente decorativo y celebra la vida institucional del colegio.',
      highlight: 'No requiere ninguna configuración manual: se actualiza por sí mismo el primer día de cada mes festivo.'
    }
  ];

  // --- Filtros combinados ---
  const filteredGuides = useMemo(() => {
    return workflowGuides.filter((guide) => {
      const matchRole = roleFilter === 'TODOS' || guide.roleRequired === roleFilter || guide.roleRequired === 'TODOS';
      const matchSearch =
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [workflowGuides, roleFilter, searchQuery]);

  const filteredFaqs = useMemo(() => {
    return faqItems.filter((faq) => {
      const matchRole = roleFilter === 'TODOS' || faq.role === roleFilter || faq.role === 'TODOS';
      const matchSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [faqItems, roleFilter, searchQuery]);

  const currentSelectedGuide = useMemo(() => {
    return workflowGuides.find((g) => g.id === selectedGuideId) || workflowGuides[0];
  }, [workflowGuides, selectedGuideId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Principal del Manual */}
      <div className="bg-gradient-to-r from-[#1B1C33] via-[#242646] to-[#1B1C33] rounded-3xl p-6 sm:p-8 border border-[#2C2E53] shadow-xl text-white relative overflow-hidden">
        {/* Adorno visual de fondo */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center gap-1.5">
                <BookMarked className="w-3.5 h-3.5" />
                Guía Oficial del Usuario
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-300 bg-white/10">
                Versión 2026 - 2027
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Manual Interactivo del Sistema SICE-CBA
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consulte procedimientos paso a paso, normativas institucionales de evaluación y atajos de productividad para docentes, coordinadores y personal administrativo del Colegio Bellas Artes.
            </p>
          </div>

          {/* Botones de acción rápida del encabezado */}
          <div className="flex items-center gap-3 shrink-0 no-print">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 shadow-md transition flex items-center gap-2 focus:outline-none"
              title="Imprimir Guía de Inducción"
            >
              <Printer className="w-4 h-4 text-[#D4AF37]" />
              <span>Imprimir Manual</span>
            </button>
            <button
              onClick={() => {
                setActiveSection('GUIAS_PASO_A_PASO');
                setSelectedGuideId('guia-1');
              }}
              className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2f] text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ver Guías Rápidas</span>
            </button>
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda Interactiva */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Selector de Roles */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto py-1">
            <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filtrar por rol:
            </span>
            {(['TODOS', 'DOC', 'UCE', 'ADM'] as RoleFilter[]).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  roleFilter === role
                    ? 'bg-[#D4AF37] text-slate-950 shadow-md ring-2 ring-[#D4AF37]/40'
                    : 'bg-white/10 hover:bg-white/15 text-slate-300'
                }`}
              >
                {role === 'TODOS' && 'Todos los Roles'}
                {role === 'DOC' && '👨‍🏫 Docentes'}
                {role === 'UCE' && '🏛️ Control de Estudios (UCE)'}
                {role === 'ADM' && '📋 Administración'}
              </button>
            ))}
          </div>

          {/* Campo de Búsqueda */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar tema, proceso, 'boletín'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white/15 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-white font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Conmutador de Vistas del Manual */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-2 overflow-x-auto no-scrollbar no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('INICIO_RAPIDO')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'INICIO_RAPIDO'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4" />
            Inicio Rápido & Conceptos
          </button>
          <button
            onClick={() => setActiveSection('GUIAS_PASO_A_PASO')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'GUIAS_PASO_A_PASO'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            Guías Paso a Paso ({filteredGuides.length})
          </button>
          <button
            onClick={() => setActiveSection('FAQ')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'FAQ'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Preguntas Frecuentes ({filteredFaqs.length})
          </button>
          <button
            onClick={() => setActiveSection('ATAJOS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'ATAJOS'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Laptop className="w-4 h-4" />
            Atajos de Teclado & Productividad
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 pr-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Sistema SICE-CBA Online
        </div>
      </div>

      {/* 3. CONTENIDO: SECCIÓN 1 - INICIO RÁPIDO */}
      {activeSection === 'INICIO_RAPIDO' && (
        <div className="space-y-6">
          {/* 3 Pilares del Sistema */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pilar 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-cba-card hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-[#2C2E53] text-base mb-1.5">
                1. Planificación Pedagógica
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Diseño curricular quincenal y por lapso. Permite estructurar competencias, dimensiones formativas, estrategias didácticas y recursos pedagógicos en armonía con el proyecto escolar.
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Responsables:</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Docentes / UCE</span>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-cba-card hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-[#2C2E53] text-base mb-1.5">
                2. Evaluación Procesal Continua
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Carga periódica de indicadores según la escala de cada nivel: cualitativa en Inicial, literales (A a E) en Primaria y escala vigesimal (01 a 20) con ponderaciones porcentuales en Media.
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Cierre de Notas:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Fin de Lapso</span>
              </div>
            </div>

            {/* Pilar 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-cba-card hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-[#2C2E53] text-base mb-1.5">
                3. Comunicación y Acreditación
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Emisión automatizada de boletines informativos, actas de consejo de curso, planes de acción asistidos por IA para alumnos con bajo rendimiento y sábanas estadísticas para dirección.
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Destinatarios:</span>
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">Familias / Plantel</span>
              </div>
            </div>
          </div>

          {/* Guía de Anatomía de la Interfaz */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-cba-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#2C2E53] text-[#D4AF37] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-[#2C2E53]">
                  Anatomía de la Interfaz y Controles Principales
                </h3>
                <p className="text-xs text-slate-500">
                  Conozca los 4 bloques principales que componen el entorno de trabajo del SICE-CBA
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-black text-[#2C2E53] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                  1. Selector de Nivel
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Ubicado en la barra superior. Conmuta al instante entre <strong>Inicial</strong>, <strong>Primaria</strong> y <strong>Media General</strong> adaptando toda la plataforma al régimen seleccionado.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-black text-[#2C2E53] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  2. Menú Lateral (Sidebar)
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Agrupa las opciones en <strong>Control y Gestión</strong>, <strong>Niveles Pedagógicos</strong> e <strong>Institucional</strong>. Al hacer clic en cualquier sub-opción, navega de inmediato a esa sección.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-black text-[#2C2E53] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  3. Barra de Navegación Compacta
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Muestra la ruta actual (Breadcrumb) y el botón de inicio con el monograma institucional. Permite situarse rápidamente en la jerarquía del sistema.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-black text-[#2C2E53] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  4. Buscador Spotlight (Ctrl+K)
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Presione <kbd className="px-1.5 py-0.5 rounded bg-slate-200 font-mono font-bold text-slate-700">Ctrl+K</kbd> desde cualquier pantalla para buscar estudiantes, materias o saltar a trámites en un segundo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONTENIDO: SECCIÓN 2 - GUÍAS PASO A PASO */}
      {activeSection === 'GUIAS_PASO_A_PASO' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Lista Lateral de Guías Disponibles */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="px-2 py-1 flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Guías Disponibles ({filteredGuides.length})
              </span>
              <span className="text-[10px] text-slate-400">Seleccione para ver pasos</span>
            </div>

            <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
              {filteredGuides.map((guide) => {
                const isSelected = guide.id === selectedGuideId;
                const GuideIcon = guide.icon;
                return (
                  <button
                    key={guide.id}
                    onClick={() => setSelectedGuideId(guide.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#2C2E53] text-white border-[#2C2E53] shadow-lg scale-[1.01]'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition ${
                        isSelected
                          ? 'bg-[#D4AF37] text-slate-950 font-black'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <GuideIcon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {guide.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            isSelected ? 'text-[#D4AF37]' : 'text-slate-400'
                          }`}
                        >
                          {guide.badge}
                        </span>
                      </div>
                      <h4
                        className={`text-xs font-black tracking-tight leading-snug truncate ${
                          isSelected ? 'text-white' : 'text-[#2C2E53]'
                        }`}
                      >
                        {guide.title}
                      </h4>
                      <p
                        className={`text-[11px] line-clamp-2 mt-1 leading-relaxed ${
                          isSelected ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {guide.summary}
                      </p>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 mt-2 transition ${
                        isSelected ? 'text-[#D4AF37] translate-x-0.5' : 'text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}

              {filteredGuides.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                  <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold">No se encontraron guías</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Pruebe cambiando el filtro de rol o el término de búsqueda.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Detalle Ampliado de la Guía Seleccionada */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-cba-card space-y-6">
            {/* Cabecera de la Guía */}
            <div className="border-b border-slate-100 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-[#2C2E53] text-[#D4AF37]">
                    {currentSelectedGuide.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                    Rol: {currentSelectedGuide.roleRequired}
                  </span>
                </div>

                {onNavigate && (
                  <button
                    onClick={() =>
                      onNavigate(
                        currentSelectedGuide.targetTab,
                        currentSelectedGuide.targetSubTab
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2C2E53] to-[#1B1C33] text-[#D4AF37] hover:scale-105 font-bold text-xs shadow-md transition flex items-center gap-1.5 focus:outline-none"
                    title="Ir a esta pantalla en el sistema"
                  >
                    <span>Ir a la función</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#2C2E53] mt-1">
                {currentSelectedGuide.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {currentSelectedGuide.summary}
              </p>

              {/* Regla Institucional Destacada */}
              {currentSelectedGuide.institutionalRule && (
                <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-100 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block text-amber-900 dark:text-amber-300 mb-0.5">
                      Normativa Institucional CBA:
                    </span>
                    <p className="leading-relaxed text-[11px] text-amber-800 dark:text-amber-100/90">
                      {currentSelectedGuide.institutionalRule}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Secuencia de Pasos Numerados */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Procedimiento Secuencial:
              </h3>

              <div className="space-y-3.5">
                {currentSelectedGuide.steps.map((step) => (
                  <div
                    key={step.number}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#1B1C33] text-[#D4AF37] font-black text-sm flex items-center justify-center shrink-0 shadow-sm border border-[#2C2E53]">
                      {step.number}
                    </div>

                    <div className="space-y-1 flex-1">
                      <h4 className="text-xs font-black text-[#2C2E53]">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.description}
                      </p>

                      {step.tip && (
                        <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>
                            <strong className="text-slate-700">Consejo CBA:</strong> {step.tip}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie de Ficha con Atajo */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>¿Completó este procedimiento con éxito en el sistema?</span>
              </div>
              {onNavigate && (
                <button
                  onClick={() =>
                    onNavigate(
                      currentSelectedGuide.targetTab,
                      currentSelectedGuide.targetSubTab
                    )
                  }
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition flex items-center gap-1 text-[11px]"
                >
                  Abrir pantalla ahora <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. CONTENIDO: SECCIÓN 3 - PREGUNTAS FRECUENTES (FAQ) */}
      {activeSection === 'FAQ' && (
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-lg text-[#2C2E53]">
                Preguntas Frecuentes y Soporte Técnico
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Respuestas inmediatas a las dudas operativas más comunes del personal docente y administrativo.
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-[var(--theme-card-dark)] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-white/5 transition focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                        ?
                      </span>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                          {faq.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-extrabold text-[#2C2E53] dark:text-[#F8FAFC]">
                          {faq.question}
                        </h4>
                      </div>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#D4AF37]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 space-y-2.5 animate-in fade-in duration-200">
                      <p className="leading-relaxed">{faq.answer}</p>
                      {faq.highlight && (
                        <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200 text-[11px] font-medium flex items-center gap-2">
                          <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span>{faq.highlight}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                <p className="text-xs font-bold">No se encontraron preguntas para este criterio.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setRoleFilter('TODOS');
                  }}
                  className="mt-2 text-xs text-[#2C2E53] underline font-bold"
                >
                  Restablecer filtros
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. CONTENIDO: SECCIÓN 4 - ATAJOS & PRODUCTIVIDAD */}
      {activeSection === 'ATAJOS' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-cba-card space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#2C2E53] text-[#D4AF37] flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-[#2C2E53]">
                  Atajos de Teclado y Consejos de Rapidez
                </h3>
                <p className="text-xs text-slate-500">
                  Acelere sus tareas diarias en el sistema utilizando las siguientes combinaciones de teclas
                </p>
              </div>
            </div>

            {/* Tabla Principal y Oficial de Atajos Solicitados */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700/80 text-[11px] font-black tracking-wider text-slate-600 dark:text-slate-300 uppercase">
                      <th className="py-3 px-4 w-44">Tecla / Combinación</th>
                      <th className="py-3 px-4 w-52">Acción</th>
                      <th className="py-3 px-4">Utilidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-xs">
                          <kbd className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-amber-300 shadow-sm">?</kbd>
                          <span className="text-slate-400 text-[11px]">o</span>
                          <kbd className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-amber-300 shadow-sm">Shift+?</kbd>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2C2E53] dark:text-[#F8FAFC]">
                        Centro de Atajos
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        Despliega un modal interactivo con buscador y la guía de teclas. También accesible con el botón de teclado en la cabecera.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <kbd className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-amber-300 font-mono font-bold shadow-sm">/</kbd>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2C2E53] dark:text-[#F8FAFC]">
                        Búsqueda Rápida
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        Enfoca inmediatamente la barra de búsqueda global del sistema.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <kbd className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm">Alt</kbd>
                          <span className="text-slate-400">+</span>
                          <kbd className="px-2 py-1 rounded-md bg-[#2C2E53] text-[#D4AF37] dark:text-amber-300 shadow-sm">1</kbd>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2C2E53] dark:text-[#F8FAFC]">
                        Escritorio / Dashboard
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        Regresa a la vista principal.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <kbd className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm">Alt</kbd>
                          <span className="text-slate-400">+</span>
                          <kbd className="px-2 py-1 rounded-md bg-[#2C2E53] text-[#D4AF37] dark:text-amber-300 shadow-sm">2</kbd>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2C2E53] dark:text-[#F8FAFC]">
                        Estudiantes y Matrícula
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        Acceso al padrón estudiantil.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <kbd className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm">Alt</kbd>
                          <span className="text-slate-400">+</span>
                          <kbd className="px-2 py-1 rounded-md bg-[#2C2E53] text-[#D4AF37] dark:text-amber-300 shadow-sm">3</kbd>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2C2E53] dark:text-[#F8FAFC]">
                        Calificaciones y Notas
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        Acceso a carga de notas y evaluaciones.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <kbd className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm">Alt</kbd>
                          <span className="text-slate-400">+</span>
                          <kbd className="px-2 py-1 rounded-md bg-[#2C2E53] text-[#D4AF37] dark:text-amber-300 shadow-sm">4</kbd>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2C2E53] dark:text-[#F8FAFC]">
                        Asistencias
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        Acceso al pase de lista diario.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <kbd className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm">Alt</kbd>
                          <span className="text-slate-400">+</span>
                          <kbd className="px-2 py-1 rounded-md bg-[#2C2E53] text-[#D4AF37] dark:text-amber-300 shadow-sm">5</kbd>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2C2E53] dark:text-[#F8FAFC]">
                        Comunidad y Avisos
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        Cartelera, circulares y noticias.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <kbd className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm">Alt</kbd>
                          <span className="text-slate-400">+</span>
                          <kbd className="px-2 py-1 rounded-md bg-[#2C2E53] text-[#D4AF37] dark:text-amber-300 shadow-sm">6</kbd>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2C2E53] dark:text-[#F8FAFC]">
                        Configuración
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        Acceso a parámetros (según rol).
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <kbd className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm">Alt</kbd>
                          <span className="text-slate-400">+</span>
                          <kbd className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-amber-300 shadow-sm">D</kbd>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2C2E53] dark:text-[#F8FAFC]">
                        Modo Oscuro / Claro
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        Alterna el tema visual al instante.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <kbd className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm">Alt</kbd>
                          <span className="text-slate-400">+</span>
                          <kbd className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-amber-300 shadow-sm">B</kbd>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2C2E53] dark:text-[#F8FAFC]">
                        Colapsar Barra Lateral
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        Oculta/muestra el menú lateral para mayor amplitud en pantalla.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <kbd className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm">Ctrl</kbd>
                          <span className="text-slate-400">+</span>
                          <kbd className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-amber-300 shadow-sm">P</kbd>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2C2E53] dark:text-[#F8FAFC]">
                        Imprimir / Generar PDF
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        Prepara actas, boletines o la vista actual para impresión.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <kbd className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-amber-300 font-mono font-bold shadow-sm">Escape</kbd>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2C2E53] dark:text-[#F8FAFC]">
                        Cerrar Diálogos
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        Cierra cualquier modal o panel flotante abierto.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ficha de Asistencia Técnica y Productividad */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-500/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-200">
                <p className="font-bold">Protección inteligente durante la escritura</p>
                <p className="mt-0.5 text-amber-800/90 dark:text-amber-300/80 text-[11px]">
                  Los atajos de una sola tecla (como <kbd className="font-mono bg-white/70 dark:bg-slate-900/60 px-1 py-0.5 rounded border border-amber-300 dark:border-amber-700">?</kbd> o <kbd className="font-mono bg-white/70 dark:bg-slate-900/60 px-1 py-0.5 rounded border border-amber-300 dark:border-amber-700">/</kbd>) quedan automáticamente inactivos mientras escribe dentro de campos de búsqueda, formularios o notas pedagógicas, protegiendo su flujo de trabajo.
                </p>
              </div>
            </div>

            {/* Ficha de Asistencia Técnica */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#2C2E53] to-[#1B1C33] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37]">
                  Mesa de Ayuda CBA
                </span>
                <h4 className="text-sm font-bold">¿Requiere asistencia personalizada o reportar una incidencia?</h4>
                <p className="text-xs text-slate-300">
                  Puede utilizar el apartado de "Ideas y Sugerencias" en el Escritorio o acudir a la Coordinación de Telemática.
                </p>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('ESCRITORIO', 'SUGERENCIAS')}
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs hover:bg-[#c49f2f] transition shadow-md shrink-0"
                >
                  Enviar Sugerencia
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
