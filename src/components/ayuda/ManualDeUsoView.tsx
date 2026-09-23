import React, { useState, useMemo, useEffect } from 'react';
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
  Users,
  BarChart3,
  MessageSquare,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, MainNavigationTab } from '../../types';
import { ROLE_METADATA } from '../../utils/rbac';
import { ROLE_SPECIFIC_MANUALS, RoleQuickMission } from '../../data/userManualRoleGuides';

interface ManualDeUsoViewProps {
  onNavigate?: (tab: any, subTab?: string) => void;
}

type ManualSection = 'MI_ROL' | 'GUIAS_PASO_A_PASO' | 'FAQ' | 'ATAJOS';

interface WorkflowGuide {
  id: string;
  title: string;
  category: 'Planificación' | 'Evaluación' | 'Gestión' | 'Institucional';
  roleRequired: UserRole | 'TODOS';
  summary: string;
  targetTab: MainNavigationTab;
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
  role: UserRole | 'TODOS';
  answer: string;
  highlight?: string;
}

export const ManualDeUsoView: React.FC<ManualDeUsoViewProps> = ({ onNavigate }) => {
  const { currentRole } = useApp();

  // Estados interactivos
  const [activeSection, setActiveSection] = useState<ManualSection>('MI_ROL');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole || 'ADMINISTRADOR');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-role-1');
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>('guia-1');
  const [completedSteps, setCompletedSteps] = useState<Record<string, number[]>>({});

  // Sincronizar el rol seleccionado cuando cambia el currentRole de la sesión
  useEffect(() => {
    if (currentRole) {
      setSelectedRole(currentRole);
    }
  }, [currentRole]);

  // Manejo interactivo de checklist de pasos en guías
  const toggleStepCompletion = (guideId: string, stepNumber: number) => {
    setCompletedSteps((prev) => {
      const currentList = prev[guideId] || [];
      const updated = currentList.includes(stepNumber)
        ? currentList.filter((n) => n !== stepNumber)
        : [...currentList, stepNumber];
      return { ...prev, [guideId]: updated };
    });
  };

  const resetGuideChecklist = (guideId: string) => {
    setCompletedSteps((prev) => ({ ...prev, [guideId]: [] }));
  };

  // --- Catálogo de Guías Paso a Paso ---
  const workflowGuides: WorkflowGuide[] = useMemo(() => [
    {
      id: 'guia-1',
      title: 'Elaboración del Plan Quincenal de Clases',
      category: 'Planificación',
      roleRequired: 'DOCENTE',
      summary: 'Estructure sus unidades didácticas quincenales asociando competencias, indicadores de logro y estrategias pedagógicas.',
      targetTab: 'MEDIA_GENERAL',
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
      roleRequired: 'DOCENTE',
      summary: 'Registro continuo de desempeños por estudiante según la escala oficial: cualitativa, literales A-E o numérica 01-20.',
      targetTab: 'MEDIA_GENERAL',
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
          description: 'Filtre la lista de estudiantes por grado y sección para cargar la matriz de seguimiento.'
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
      roleRequired: 'COORDINACION',
      summary: 'Generación de la boleta de calificaciones con observaciones pedagógicas, membrete oficial y formato imprimible.',
      targetTab: 'CONSULTAS',
      targetSubTab: 'BOLETIN',
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Comité de Evaluación',
      institutionalRule: 'Los boletines requieren el aval de la Coordinación Pedagógica antes de su entrega formal a representantes.',
      steps: [
        {
          number: 1,
          title: 'Ingresar a Comunicación y Boletín',
          description: 'Seleccione la sección "Boletín Informativo" dentro del módulo de Consultas o desde el nivel correspondiente.'
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
          description: 'Añada las notas cualitativas del docente guía sobre el desempeño integral, asistencia y convivencia.'
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
      roleRequired: 'SECRETARIA',
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
          description: 'Cargue nombres completos, fecha de nacimiento, tipo de sangre, alergias o consideraciones médicas especiales.'
        },
        {
          number: 3,
          title: 'Paso 3: Asignación de Nivel y Sección',
          description: 'Seleccione el grado/año a cursar, el turno correspondiente y verifique el cupo disponible en la sección.'
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
      roleRequired: 'ASISTENTE',
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
          description: 'Diríjase a "Gestión Escolar" → "Pases por Retraso". La hora del sistema se fija automáticamente.'
        },
        {
          number: 2,
          title: 'Buscar al Estudiante',
          description: 'Escriba el nombre, apellido o cédula del alumno en el buscador rápido.'
        },
        {
          number: 3,
          title: 'Especificar Motivo del Retraso',
          description: 'Seleccione si es justificado (médico, transporte escolar) o injustificado, e introduzca el motivo.'
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
      title: 'Registro de Incidencias de Conducta y Disciplina',
      category: 'Gestión',
      roleRequired: 'ASISTENTE',
      summary: 'Asentamiento formal de llamados de atención, compromisos de convivencia o reconocimientos positivos.',
      targetTab: 'GESTION',
      targetSubTab: 'CONDUCTAS',
      icon: ShieldAlert,
      color: 'from-red-500 to-rose-600',
      badge: 'Convivencia',
      institutionalRule: 'Las observaciones de conducta deben ser objetivas, formativas y sin juicios subjetivos.',
      steps: [
        {
          number: 1,
          title: 'Abrir Historial de Conductas',
          description: 'Navegue a Gestión Escolar → Registro de Conductas.'
        },
        {
          number: 2,
          title: 'Identificar al Alumno',
          description: 'Busque al estudiante por nombre o cédula escolar.'
        },
        {
          number: 3,
          title: 'Categorizar la Incidencia',
          description: 'Escoja el tipo de registro: Falta Leve, Moderada, Falta Grave o Mérito Positivo.'
        },
        {
          number: 4,
          title: 'Guardar y Notificar',
          description: 'Guarde el reporte. El registro queda anexado a la ficha del estudiante y visible para Coordinación.'
        }
      ]
    },
    {
      id: 'guia-7',
      title: 'Sábana Central de Calificaciones y Estadísticas',
      category: 'Institucional',
      roleRequired: 'COORDINACION',
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
          description: 'Navegue a "Consultas y Reportes" → "Sábana de Calificaciones".'
        },
        {
          number: 2,
          title: 'Seleccionar Lapso y Sección',
          description: 'Elija el lapso académico (1, 2 o 3) y el curso deseado para desplegar la matriz completa.'
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
      roleRequired: 'DIRECTOR',
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
          description: 'Acceda al menú "Configuración" → "Años Escolares y Lapsos".'
        },
        {
          number: 2,
          title: 'Localizar el Lapso en Curso',
          description: 'Revise el estado actual del 1er, 2do o 3er Lapso (Abierto / Cerrado).'
        },
        {
          number: 3,
          title: 'Alternar Interruptor de Carga',
          description: 'Haga clic en "Abrir Ventana de Carga" para permitir a los docentes registrar notas, o "Bloquear" para sellar el lapso.'
        },
        {
          number: 4,
          title: 'Guardar Parámetros de Auditoría',
          description: 'El sistema registra la fecha, hora y usuario que autorizó la apertura o cierre del período evaluativo.'
        }
      ]
    },
    {
      id: 'guia-9',
      title: 'Creación de Personal y Códigos de Auto-Registro',
      category: 'Institucional',
      roleRequired: 'ADMINISTRADOR',
      summary: 'Alta de docentes, asistentes y personal con credenciales seguras o emisión de códigos de verificación.',
      targetTab: 'CONFIGURACION',
      targetSubTab: 'DOCENTES',
      icon: Users,
      color: 'from-purple-600 to-indigo-700',
      badge: 'Seguridad TI',
      institutionalRule: 'Toda cuenta de personal debe asignarse bajo el principio de menor privilegio con su rol exacto.',
      steps: [
        {
          number: 1,
          title: 'Acceder a Personal Institucional',
          description: 'Ve a Configuración → Personal Docente y Administrativo.'
        },
        {
          number: 2,
          title: 'Registrar Nuevo Miembro',
          description: 'Pulsa "+ Nuevo Personal", escribe el correo institucional, contraseña inicial y rol exacto.'
        },
        {
          number: 3,
          title: 'Generar Código de Autorización (Uso Único)',
          description: 'Si el personal se registrará a sí mismo, genera un código institucional. Cada código tiene un solo uso y se elimina de inmediato una vez consumido.'
        },
        {
          number: 4,
          title: 'Verificar Activación',
          description: 'Comprueba que el usuario figure como Activo en la lista central con sus credenciales operativas.'
        }
      ]
    },
    {
      id: 'guia-10',
      title: 'Consulta del Boletín y Asistencias para Familias',
      category: 'Evaluación',
      roleRequired: 'REPRESENTANTE',
      summary: 'Cómo verificar las notas del lapso y el récord de asistencias de su hijo(a) desde casa o el móvil.',
      targetTab: 'CONSULTAS',
      targetSubTab: 'BOLETIN',
      icon: GraduationCap,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Padres y Representantes',
      institutionalRule: 'Las dudas sobre calificaciones deben canalizarse con el docente guía en su horario de atención.',
      steps: [
        {
          number: 1,
          title: 'Abrir Consultas y Reportes',
          description: 'En el menú lateral, pulsa sobre "Consultas y Reportes".'
        },
        {
          number: 2,
          title: 'Ver Boletín Informativo',
          description: 'Haz clic en "Boletín Informativo" para revisar cada materia y las observaciones del profesor.'
        },
        {
          number: 3,
          title: 'Consultar Récord de Asistencias',
          description: 'Pasa a la pestaña "Asistencia" para verificar que los días asistidos y justificados estén en orden.'
        }
      ]
    }
  ], []);

  // --- Catálogo de Preguntas Frecuentes (FAQ) ---
  const faqItems: FaqItem[] = useMemo(() => [
    {
      id: 'faq-role-1',
      question: '¿Qué funciones y pantallas corresponden exactamente a mi rol en el sistema?',
      category: 'Permisos & Perfil',
      role: 'TODOS',
      answer: 'SICE-CBA aplica un control de accesos estricto (RBAC). En la sección "Mi Rol en el Sistema" de este manual encontrarás tu guía de bienvenida personalizada, con las misiones operativas que te corresponden y la lista de módulos que puedes utilizar.',
      highlight: 'Si necesitas realizar una acción que no aparece en tus menús, consulta con la Dirección o Administración TI.'
    },
    {
      id: 'faq-role-2',
      question: '¿Cuáles son las escalas de calificación según el nivel educativo?',
      category: 'Evaluación Oficial',
      role: 'DOCENTE',
      answer: 'SICE-CBA implementa tres escalas pedagógicas oficiales: 1) Educación Inicial: exclusivamente evaluación cualitativa/formativa en escala oficial (Logrado, En Proceso, Iniciado); 2) Educación Primaria: escala literal oficial MPPE (A, B, C, D, E); 3) Educación Media General: escala cuantitativa vigesimal entera (01 a 20 puntos).',
      highlight: 'El sistema valida automáticamente las notas para evitar que se introduzcan números en Inicial o Primaria.'
    },
    {
      id: 'faq-role-3',
      question: '¿Qué responsabilidades tiene el rol de Asistente?',
      category: 'Operatividad',
      role: 'ASISTENTE',
      answer: 'El rol de Asistente está enfocado en la vida operativa y disciplina diaria: emisión de Pases por Retraso en portería, toma y seguimiento de Asistencias de aula y registro en el Historial de Conductas. No posee permisos de carga de calificaciones académicas.',
      highlight: 'Permite agilizar el ingreso a clases por la mañana y resguardar la puntualidad.'
    },
    {
      id: 'faq-role-4',
      question: '¿Qué responsabilidades tiene el rol de Secretaría?',
      category: 'Secretaría & Matrícula',
      role: 'SECRETARIA',
      answer: 'El rol de Secretaría se encarga de las admisiones e inscripciones de estudiantes, custodia del padrón y expedientes de matrícula, solicitud y emisión de constancias de estudio o notas certificadas, y consulta de sábanas y nóminas oficiales.',
      highlight: 'Toda emisión de constancia valida antes que el estudiante no cuente con bloqueo administrativo.'
    },
    {
      id: 'faq-role-5',
      question: '¿Cómo cambio de nivel educativo (Inicial, Primaria, Media General)?',
      category: 'Navegación General',
      role: 'TODOS',
      answer: 'En la parte superior de la cabecera encontrarás los botones con los nombres de cada nivel (Educación Inicial, Educación Primaria y Media General). Al hacer clic en cualquiera de ellos, todo el sistema ajusta dinámicamente sus asignaturas, estudiantes y escalas evaluativas.',
      highlight: 'También puedes pulsar Ctrl + K para abrir el buscador rápido y saltar al nivel deseado.'
    },
    {
      id: 'faq-role-6',
      question: '¿Qué significa el límite de inasistencias del 25% y cómo se calcula?',
      category: 'Control Escolar',
      role: 'DOCENTE',
      answer: 'Según la normativa ministerial y el reglamento del CBA, los estudiantes que superen el 25% de inasistencias no justificadas en una asignatura pierden el derecho a la evaluación ordinaria. El sistema resalta automáticamente las alertas amarillas y rojas preventivas.',
      highlight: 'Notifica a la Coordinación UCE desde Conductas cuando un alumno supere el 20% de inasistencias.'
    },
    {
      id: 'faq-role-7',
      question: '¿Cómo puedo imprimir un boletín o constancia en formato oficial limpio?',
      category: 'Impresión y Documentos',
      role: 'TODOS',
      answer: 'Todas las vistas oficiales cuentan con hojas de estilo para impresión (@media print). Al pulsar el botón "Imprimir" dentro de cualquier módulo (o presionar Ctrl + P), el sistema oculta menús, botones y barras laterales, generando el formato institucional con membrete, firmas y sellos.',
      highlight: 'Asegúrate de marcar "Gráficos de fondo" en la ventana de impresión de tu navegador.'
    },
    {
      id: 'faq-role-8',
      question: '¿Cómo funciona el Bloqueo Administrativo?',
      category: 'Administración',
      role: 'ADMINISTRADOR',
      answer: 'El bloqueo administrativo retiene la entrega de constancias de estudio, notas certificadas y boletines oficiales para estudiantes con compromisos administrativos pendientes. Los docentes pueden seguir cargando sus notas con total normalidad.',
      highlight: 'Se administra desde Gestión Escolar → Bloqueo Administrativo.'
    }
  ], []);

  // Guía específica del rol actualmente seleccionado
  const currentRoleGuide = useMemo(() => {
    return ROLE_SPECIFIC_MANUALS[selectedRole] || ROLE_SPECIFIC_MANUALS.DOCENTE;
  }, [selectedRole]);

  // Filtros combinados de Guías Paso a Paso
  const filteredGuides = useMemo(() => {
    return workflowGuides.filter((guide) => {
      const matchRole =
        selectedRole === 'ADMINISTRADOR' ||
        selectedRole === 'DIRECTOR' ||
        guide.roleRequired === 'TODOS' ||
        guide.roleRequired === selectedRole;

      const matchSearch =
        searchQuery === '' ||
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchRole && matchSearch;
    });
  }, [workflowGuides, selectedRole, searchQuery]);

  // Filtros combinados de FAQs
  const filteredFaqs = useMemo(() => {
    return faqItems.filter((faq) => {
      const matchRole =
        selectedRole === 'ADMINISTRADOR' ||
        selectedRole === 'DIRECTOR' ||
        faq.role === 'TODOS' ||
        faq.role === selectedRole;

      const matchSearch =
        searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchRole && matchSearch;
    });
  }, [faqItems, selectedRole, searchQuery]);

  const currentSelectedGuide = useMemo(() => {
    return workflowGuides.find((g) => g.id === selectedGuideId) || workflowGuides[0];
  }, [workflowGuides, selectedGuideId]);

  const handlePrint = () => {
    window.print();
  };

  const getMissionIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return BookOpen;
      case 'FileSpreadsheet': return FileSpreadsheet;
      case 'CheckCircle2': return CheckCircle2;
      case 'GraduationCap': return GraduationCap;
      case 'UserCheck': return UserCheck;
      case 'Users': return Users;
      case 'FileText': return FileText;
      case 'Clock': return Clock;
      case 'ShieldAlert': return ShieldAlert;
      case 'BarChart3': return BarChart3;
      case 'Sliders': return Sliders;
      case 'MessageSquare': return MessageSquare;
      case 'Sparkles': return Sparkles;
      default: return Layers;
    }
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
                Adaptada al Rol Activo
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-300 bg-amber-400/20 border border-amber-400/30 flex items-center gap-1">
                <span>{currentRoleGuide.badgeEmoji}</span>
                <span>{ROLE_METADATA[currentRole]?.label || currentRole}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Manual Interactivo del Sistema SICE-CBA
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Instrucciones claras y paso a paso diseñadas específicamente para tus tareas institucionales en el Colegio Bellas Artes. Navega directamente a las funciones o explora guías paso a paso.
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
                setSelectedGuideId(filteredGuides[0]?.id || 'guia-1');
              }}
              className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2f] text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ver Guías Paso a Paso</span>
            </button>
          </div>
        </div>

        {/* Barra de Selector de Rol y Búsqueda */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          {/* Selector de Roles Interactivo */}
          <div className="flex items-center gap-1.5 flex-wrap w-full xl:w-auto py-1">
            <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Vista de rol:
            </span>
            {(['DOCENTE', 'SECRETARIA', 'ASISTENTE', 'COORDINACION', 'DIRECTOR', 'ADMINISTRADOR', 'REPRESENTANTE', 'ESTUDIANTE'] as UserRole[]).map((r) => {
              const isSelected = selectedRole === r;
              const isSessionRole = currentRole === r;
              return (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#D4AF37] text-slate-950 shadow-md ring-2 ring-[#D4AF37]/40'
                      : 'bg-white/10 hover:bg-white/15 text-slate-300'
                  }`}
                  title={isSessionRole ? 'Este es el rol de tu sesión activa' : `Ver guía del rol ${r}`}
                >
                  <span>{ROLE_METADATA[r]?.badge || r}</span>
                  {isSessionRole && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" title="Tu rol actual" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Campo de Búsqueda */}
          <div className="relative w-full xl:w-80 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar tema, 'boletín', 'asistencia'..."
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
            onClick={() => setActiveSection('MI_ROL')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'MI_ROL'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Guía de Mi Rol ({ROLE_METADATA[selectedRole]?.badge || selectedRole})</span>
          </button>
          <button
            onClick={() => setActiveSection('GUIAS_PASO_A_PASO')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'GUIAS_PASO_A_PASO'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Guías Paso a Paso ({filteredGuides.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('FAQ')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'FAQ'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Preguntas Frecuentes ({filteredFaqs.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('ATAJOS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'ATAJOS'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Atajos de Teclado</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 pr-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Rol activo: <strong className="text-slate-700 dark:text-slate-300">{ROLE_METADATA[currentRole]?.label || currentRole}</strong>
        </div>
      </div>

      {/* 3. SECCIÓN 1: GUÍA DEDICADA DEL ROL (Fácil de entender e interactiva) */}
      {activeSection === 'MI_ROL' && (
        <div className="space-y-6">
          {/* Tarjeta de Presentación del Rol */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shrink-0 shadow-sm">
                  {currentRoleGuide.badgeEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Perfil Institucional
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${currentRoleGuide.badgeColor}`}>
                      {ROLE_METADATA[selectedRole]?.badge || selectedRole}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {currentRoleGuide.department}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#2C2E53] dark:text-white">
                    {currentRoleGuide.roleGreeting}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
                    {currentRoleGuide.roleOverview}
                  </p>
                </div>
              </div>

              {selectedRole !== currentRole && (
                <div className="shrink-0 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3 rounded-2xl flex items-center gap-3 text-xs">
                  <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div className="text-[11px]">
                    <span className="font-bold text-amber-900 dark:text-amber-200 block">Modo Exploración:</span>
                    <span className="text-amber-800 dark:text-amber-300">Estás viendo la guía de <strong>{ROLE_METADATA[selectedRole]?.label}</strong>.</span>
                  </div>
                  <button
                    onClick={() => setSelectedRole(currentRole)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-[10px] border shadow-sm hover:bg-slate-50 ml-2"
                  >
                    Volver a mi rol
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Misiones Clave del Rol (Interactivas con enlace directo a la función) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  Tus Tareas Principales Paso a Paso
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Haz clic en cualquier misión para ver el procedimiento rápido o pulsa "Ir a la función" para abrir la pantalla correspondiente en el sistema.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {currentRoleGuide.missions.length} Tareas clave
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentRoleGuide.missions.map((mission: RoleQuickMission, index: number) => {
                const MissionIcon = getMissionIcon(mission.iconName);
                return (
                  <div
                    key={mission.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      {/* Cabecera de la Misión */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-[#1B1C33] text-[#D4AF37] flex items-center justify-center font-black text-sm shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            <MissionIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {mission.badge}
                            </span>
                            <h4 className="text-sm font-extrabold text-[#2C2E53] dark:text-white leading-snug mt-0.5">
                              {mission.title}
                            </h4>
                          </div>
                        </div>

                        <span className="text-xs font-black text-slate-300 dark:text-slate-700">
                          #{index + 1}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {mission.summary}
                      </p>

                      {/* Pasos rápidos recomendados */}
                      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800 space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          ¿Cómo realizarlo?:
                        </span>
                        <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                          {mission.recommendedSteps.map((step, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <span className="leading-snug">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Botón de Acción Directa a la Función */}
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">
                        Destino: {mission.targetTab} {mission.targetSubTab ? `→ ${mission.targetSubTab}` : ''}
                      </span>
                      {onNavigate ? (
                        <button
                          onClick={() => onNavigate(mission.targetTab, mission.targetSubTab)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-black text-xs shadow-sm hover:shadow transition flex items-center gap-1.5 focus:outline-none"
                        >
                          <span>Ir a la función</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


        </div>
      )}

      {/* 4. SECCIÓN 2: GUÍAS PASO A PASO INTERACTIVAS (Con Checklist y Simulación) */}
      {activeSection === 'GUIAS_PASO_A_PASO' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Lista Lateral de Guías Disponibles */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="px-2 py-1 flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Guías Disponibles ({filteredGuides.length})
              </span>
              <span className="text-[10px] text-slate-400">Selecciona para ver pasos</span>
            </div>

            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {filteredGuides.map((guide) => {
                const isSelected = guide.id === selectedGuideId;
                const GuideIcon = guide.icon;
                const checkedCount = (completedSteps[guide.id] || []).length;
                const totalSteps = guide.steps.length;

                return (
                  <button
                    key={guide.id}
                    onClick={() => setSelectedGuideId(guide.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#2C2E53] text-white border-[#2C2E53] shadow-lg scale-[1.01]'
                        : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition ${
                        isSelected
                          ? 'bg-[#D4AF37] text-slate-950 font-black'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <GuideIcon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {guide.category}
                        </span>
                        <span
                          className={`text-[9px] font-bold ${
                            isSelected ? 'text-[#D4AF37]' : 'text-slate-400'
                          }`}
                        >
                          {guide.badge}
                        </span>
                      </div>
                      <h4
                        className={`text-xs font-black tracking-tight leading-snug truncate ${
                          isSelected ? 'text-white' : 'text-[#2C2E53] dark:text-white'
                        }`}
                      >
                        {guide.title}
                      </h4>
                      <p
                        className={`text-[11px] line-clamp-2 mt-1 leading-relaxed ${
                          isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {guide.summary}
                      </p>

                      {checkedCount > 0 && (
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                          <Check className="w-3 h-3" />
                          <span>{checkedCount}/{totalSteps} pasos completados</span>
                        </div>
                      )}
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
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
                  <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold">No se encontraron guías</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Prueba cambiando el rol seleccionado o el término de búsqueda.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Detalle Ampliado de la Guía Seleccionada */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-cba-card space-y-6">
            {/* Cabecera de la Guía */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-[#2C2E53] text-[#D4AF37]">
                    {currentSelectedGuide.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Rol: {currentSelectedGuide.roleRequired}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {(completedSteps[currentSelectedGuide.id] || []).length > 0 && (
                    <button
                      onClick={() => resetGuideChecklist(currentSelectedGuide.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
                      title="Reiniciar checklist de pasos"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reiniciar</span>
                    </button>
                  )}

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
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#2C2E53] dark:text-white mt-1">
                {currentSelectedGuide.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
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

            {/* Secuencia de Pasos Numerados (Checklist Interactivo) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Procedimiento Secuencial (Haz clic para marcar como completado):
                </h3>
                <span className="text-[11px] text-slate-400">
                  {(completedSteps[currentSelectedGuide.id] || []).length} de {currentSelectedGuide.steps.length} completados
                </span>
              </div>

              <div className="space-y-3.5">
                {currentSelectedGuide.steps.map((step) => {
                  const isChecked = (completedSteps[currentSelectedGuide.id] || []).includes(step.number);
                  return (
                    <div
                      key={step.number}
                      onClick={() => toggleStepCompletion(currentSelectedGuide.id, step.number)}
                      className={`p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer select-none ${
                        isChecked
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <button
                        type="button"
                        className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 shadow-sm border transition-colors ${
                          isChecked
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : 'bg-[#1B1C33] text-[#D4AF37] border-[#2C2E53]'
                        }`}
                      >
                        {isChecked ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
                      </button>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-black ${isChecked ? 'text-emerald-900 dark:text-emerald-200 line-through' : 'text-[#2C2E53] dark:text-white'}`}>
                            {step.title}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400">
                            {isChecked ? 'Completado' : 'Pendiente'}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed ${isChecked ? 'text-emerald-800/80 dark:text-emerald-300/80' : 'text-slate-600 dark:text-slate-300'}`}>
                          {step.description}
                        </p>

                        {step.tip && (
                          <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>
                              <strong className="text-slate-700 dark:text-slate-200">Consejo CBA:</strong> {step.tip}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pie de Ficha con Atajo */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>¿Deseas probar este procedimiento en el sistema ahora mismo?</span>
              </div>
              {onNavigate && (
                <button
                  onClick={() =>
                    onNavigate(
                      currentSelectedGuide.targetTab,
                      currentSelectedGuide.targetSubTab
                    )
                  }
                  className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1 text-[11px]"
                >
                  Abrir pantalla ahora <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. SECCIÓN 3: PREGUNTAS FRECUENTES (FAQ) */}
      {activeSection === 'FAQ' && (
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-lg text-[#2C2E53] dark:text-white">
                Preguntas Frecuentes y Soporte Técnico
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Respuestas inmediatas a las dudas operativas más comunes según tu perfil de usuario.
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                        ?
                      </span>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {faq.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-extrabold text-[#2C2E53] dark:text-white">
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
                    <div className="px-5 pb-5 pt-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5 animate-in fade-in duration-200">
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
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
                <p className="text-xs font-bold">No se encontraron preguntas para este criterio.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRole('ADMINISTRADOR');
                  }}
                  className="mt-2 text-xs text-[#2C2E53] dark:text-amber-300 underline font-bold"
                >
                  Restablecer filtros
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. SECCIÓN 4: ATAJOS DE TECLADO & PRODUCTIVIDAD */}
      {activeSection === 'ATAJOS' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-cba-card space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#2C2E53] text-[#D4AF37] flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-[#2C2E53] dark:text-white">
                  Atajos de Teclado y Consejos de Rapidez
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Acelera tus tareas diarias en el sistema utilizando las siguientes combinaciones de teclas
                </p>
              </div>
            </div>

            {/* Tabla Principal de Atajos */}
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
                  Los atajos de una sola tecla quedan automáticamente inactivos mientras escribes dentro de campos de búsqueda, formularios o notas pedagógicas, protegiendo tu flujo de trabajo.
                </p>
              </div>
            </div>

            {/* Ficha de Asistencia Técnica */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#2C2E53] to-[#1B1C33] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37]">
                  Mesa de Ayuda CBA
                </span>
                <h4 className="text-sm font-bold">¿Requieres asistencia personalizada o reportar una incidencia?</h4>
                <p className="text-xs text-slate-300">
                  Puedes utilizar el apartado de "Ideas y Sugerencias" en el Escritorio o acudir a la Coordinación de Telemática.
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
