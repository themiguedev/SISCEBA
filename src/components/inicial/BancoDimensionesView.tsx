import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectArea, Competency } from '../../types';
import {
  BookOpen,
  ChevronDown,
  RotateCw,
  Printer,
  Settings,
  Heart,
  Globe,
  Palette,
  Music,
  Activity,
  Award,
  Waves,
  Languages,
  Monitor,
  CheckCircle2,
  X,
  Plus,
  Save,
  Tag,
  Search,
  Sparkles,
  ArrowLeft,
  FileEdit,
  Trash2,
  AlertTriangle
} from 'lucide-react';

const AREA_ICON_MAP: Record<string, React.ElementType> = {
  'INI-FP': Heart,
  'INI-CA': Globe,
  'INI-AP': Palette,
  'INI-MUS': Music,
  'INI-EF': Activity,
  'INI-AJE': Award,
  'INI-NAT': Waves,
  'INI-ING': Languages,
  'INI-INF': Monitor,
  'INI-DH': Sparkles
};

const AREA_DIMENSIONS_MAP: Record<string, { dimension: string; domain: string }> = {
  'INI-FP': {
    dimension: 'Dimensión Socioemocional y Formación Personal',
    domain: 'Desarrollo Personal, Identidad, Convivencia y Autoestima'
  },
  'INI-CA': {
    dimension: 'Dimensión Cognitiva y Relación con el Ambiente',
    domain: 'Pensamiento Lógico-Matemático, Exploración y Medio Natural'
  },
  'INI-AP': {
    dimension: 'Dimensión Artística y Sensibilidad Estética',
    domain: 'Expresión Plástica, Modelado, Texturas y Motricidad Fina'
  },
  'INI-MUS': {
    dimension: 'Dimensión Rítmica y Expresión Musical',
    domain: 'Sensibilidad Auditiva, Percepción Rítmica y Ensamble Coral'
  },
  'INI-EF': {
    dimension: 'Dimensión Psicomotora y Esquema Corporal',
    domain: 'Equilibrio, Coordinación Dinámica, Postura y Vida Saludable'
  },
  'INI-AJE': {
    dimension: 'Dimensión Estratégica y Lógica Figurativa',
    domain: 'Orientación Espacial en Tablero, Razonamiento y Toma de Decisiones'
  },
  'INI-NAT': {
    dimension: 'Dimensión de Adaptación Acuática y Confianza',
    domain: 'Familiarización en Piscina, Flotación y Seguridad Acuática'
  },
  'INI-ING': {
    dimension: 'Dimensión Comunicativa e Inmersión Bilingüe',
    domain: 'Adquisición Fonética Temprana, Canciones y Vocabulario Contextual'
  },
  'INI-INF': {
    dimension: 'Dimensión Tecnológica y Pensamiento STEAM',
    domain: 'Alfabetización Digital, Robótica Lúdica y Lógica Desenchufada'
  },
  'INI-DH': {
    dimension: 'Dimensión de Valores Humanos y Empatía',
    domain: 'Acompañamiento Socioafectivo, Virtudes y Resolución Pacífica'
  }
};

export interface LocalIndicatorRecord {
  id: string;
  code: string;
  description: string;
  competency: string;
  instrument: string;
}

// Catálogo Curricular Institucional Oficial del Banco de Dimensiones (Colegio Bellas Artes)
export const OFFICIAL_INICIAL_FP4_COMPS: Competency[] = [
  {
    id: 'comp-ini-fp4-lang',
    code: 'CP-INI-FP4-01',
    title: 'Uso del lenguaje',
    description: 'Desarrollo progresivo del lenguaje oral y escrito, comunicación fluida y respetuosa.',
    areaId: 'ini-fp',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  {
    id: 'comp-ini-fp4-id',
    code: 'CP-INI-FP4-02',
    title: 'Identidad personal',
    description: 'Reconocimiento del esquema corporal, coordinación motriz, hábitos de higiene y cuidado personal.',
    areaId: 'ini-fp',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  {
    id: 'comp-ini-fp4-emoc',
    code: 'CP-INI-FP4-03',
    title: 'Expresión de emociones, sentimientos y opiniones',
    description: 'Manifestación espontánea y respetuosa de emociones, afecto y solidaridad con sus compañeros.',
    areaId: 'ini-fp',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  {
    id: 'comp-ini-fp4-auto',
    code: 'CP-INI-FP4-04',
    title: 'Demostración de autonomía',
    description: 'Iniciativa e independencia al comenzar y culminar tareas, respeto de normas y cuidado de útiles.',
    areaId: 'ini-fp',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  {
    id: 'comp-ini-fp4-esti',
    code: 'CP-INI-FP4-05',
    title: 'Autoestima',
    description: 'Confianza en sus capacidades, aprecio de sus producciones y optimismo ante nuevos desafíos.',
    areaId: 'ini-fp',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
  {
    id: 'comp-ini-fp4-inter',
    code: 'CP-INI-FP4-06',
    title: 'Interacción con niños y adultos',
    description: 'Integración al grupo escolar, juego socializado y resolución pacífica de situaciones en el aula.',
    areaId: 'ini-fp',
    level: 'INICIAL',
    lapso: 1,
    grade: 'Sala de 4 Años'
  },
];

export const OFFICIAL_INICIAL_FP4_ITEMS: LocalIndicatorRecord[] = [
  {
    id: 'ind-ini-fp4-1-01',
    code: 'IND-INI-FP4-1.01',
    description: 'Se expresa con fluidez.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-02',
    code: 'IND-INI-FP4-1.02',
    description: 'Se expresa con coherencia.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-03',
    code: 'IND-INI-FP4-1.03',
    description: 'Interpreta narraciones e instrucciones.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-04',
    code: 'IND-INI-FP4-1.04',
    description: 'Se apropia progresivamente del lenguaje oral y escrito.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-05',
    code: 'IND-INI-FP4-1.05',
    description: 'Practica las normas del buen hablante.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-06',
    code: 'IND-INI-FP4-1.06',
    description: 'Practica las normas del buen oyente.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-07',
    code: 'IND-INI-FP4-1.07',
    description: 'Aplica las normas de cortesía.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-08',
    code: 'IND-INI-FP4-1.08',
    description: 'Utiliza el lenguaje oral para comunicarse.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-09',
    code: 'IND-INI-FP4-1.09',
    description: 'Se expresa con claridad.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-10',
    code: 'IND-INI-FP4-1.10',
    description: 'Usa frases.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-11',
    code: 'IND-INI-FP4-1.11',
    description: 'Usa oraciones.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-12',
    code: 'IND-INI-FP4-1.12',
    description: 'Narra sus experiencias siguiendo una secuencia lógica.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-13',
    code: 'IND-INI-FP4-1.13',
    description: 'Relata cuentos usando conectivos.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-14',
    code: 'IND-INI-FP4-1.14',
    description: 'Expresa su opinión en relación a personajes y hechos sobre una lectura o situación.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-15',
    code: 'IND-INI-FP4-1.15',
    description: 'Anticipa sucesos.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-16',
    code: 'IND-INI-FP4-1.16',
    description: 'Compara personajes y hechos.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-17',
    code: 'IND-INI-FP4-1.17',
    description: 'Sigue instrucciones orales.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-18',
    code: 'IND-INI-FP4-1.18',
    description: 'Diferencia progresivamente el dibujo de la escritura.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-19',
    code: 'IND-INI-FP4-1.19',
    description: 'Combina marcas figurativas cuando escribe espontáneamente líneas, palitos, garabatos, seudoletras.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-20',
    code: 'IND-INI-FP4-1.20',
    description: 'Utiliza un tono de voz adecuado.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-21',
    code: 'IND-INI-FP4-1.21',
    description: 'Espera su turno.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-22',
    code: 'IND-INI-FP4-1.22',
    description: 'Mira al que habla.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-23',
    code: 'IND-INI-FP4-1.23',
    description: 'Escucha con atención.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-24',
    code: 'IND-INI-FP4-1.24',
    description: 'Pide por favor y dá las gracias.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-25',
    code: 'IND-INI-FP4-1.25',
    description: 'Pide permiso.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-26',
    code: 'IND-INI-FP4-1.26',
    description: 'Se expresa espontáneamente.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-27',
    code: 'IND-INI-FP4-1.27',
    description: 'Participa en conversaciones planteadas en el aula.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-28',
    code: 'IND-INI-FP4-1.28',
    description: 'Articula sílabas simples.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-1-29',
    code: 'IND-INI-FP4-1.29',
    description: 'Articula sílabas complejas.',
    competency: 'Uso del lenguaje',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-2-01',
    code: 'IND-INI-FP4-2.01',
    description: 'Reconoce las partes de su cuerpo.',
    competency: 'Identidad personal',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-2-02',
    code: 'IND-INI-FP4-2.02',
    description: 'Coordina sus movimientos.',
    competency: 'Identidad personal',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-2-03',
    code: 'IND-INI-FP4-2.03',
    description: 'Se identifica con su sexo.',
    competency: 'Identidad personal',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-2-04',
    code: 'IND-INI-FP4-2.04',
    description: 'Posee hábitos de higiene.',
    competency: 'Identidad personal',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-2-05',
    code: 'IND-INI-FP4-2.05',
    description: 'Se preocupa por su arreglo personal.',
    competency: 'Identidad personal',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-2-06',
    code: 'IND-INI-FP4-2.06',
    description: 'Posee buenos modales al comer.',
    competency: 'Identidad personal',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-2-07',
    code: 'IND-INI-FP4-2.07',
    description: 'Reconoce las características propias de su sexo.',
    competency: 'Identidad personal',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-2-08',
    code: 'IND-INI-FP4-2.08',
    description: 'Expresa sus intereses.',
    competency: 'Identidad personal',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-3-01',
    code: 'IND-INI-FP4-3.01',
    description: 'Disfruta de las tareas y juegos grupales.',
    competency: 'Expresión de emociones, sentimientos y opiniones',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-3-02',
    code: 'IND-INI-FP4-3.02',
    description: 'Respeta las decisiones de los demás.',
    competency: 'Expresión de emociones, sentimientos y opiniones',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-3-03',
    code: 'IND-INI-FP4-3.03',
    description: 'Manifiesta libremente sus sentimientos y emociones.',
    competency: 'Expresión de emociones, sentimientos y opiniones',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-3-04',
    code: 'IND-INI-FP4-3.04',
    description: 'Se muestra solidario(a) con sus compañeros.',
    competency: 'Expresión de emociones, sentimientos y opiniones',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-3-05',
    code: 'IND-INI-FP4-3.05',
    description: 'Demuestra afecto por sus semejantes.',
    competency: 'Expresión de emociones, sentimientos y opiniones',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-4-01',
    code: 'IND-INI-FP4-4.01',
    description: 'Expresa sus intereses y necesidades.',
    competency: 'Demostración de autonomía',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-4-02',
    code: 'IND-INI-FP4-4.02',
    description: 'Respeta las normas establecidas.',
    competency: 'Demostración de autonomía',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-4-03',
    code: 'IND-INI-FP4-4.03',
    description: 'Culmina sus tareas en el tiempo estipulado.',
    competency: 'Demostración de autonomía',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-4-04',
    code: 'IND-INI-FP4-4.04',
    description: 'Cuida sus útiles y materiales didácticos.',
    competency: 'Demostración de autonomía',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-4-05',
    code: 'IND-INI-FP4-4.05',
    description: 'Inicia las actividades sin ayuda.',
    competency: 'Demostración de autonomía',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-4-06',
    code: 'IND-INI-FP4-4.06',
    description: 'Solicita ayuda cuando la necesita.',
    competency: 'Demostración de autonomía',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-4-07',
    code: 'IND-INI-FP4-4.07',
    description: 'Explora y curiosea espontáneamente.',
    competency: 'Demostración de autonomía',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-4-08',
    code: 'IND-INI-FP4-4.08',
    description: 'Manifiesta iniciativa propia en juegos y dinámicas.',
    competency: 'Demostración de autonomía',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-5-01',
    code: 'IND-INI-FP4-5.01',
    description: 'Inicia actividades por sí mismo(a).',
    competency: 'Autoestima',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-5-02',
    code: 'IND-INI-FP4-5.02',
    description: 'Demuestra confianza en sus capacidades.',
    competency: 'Autoestima',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-5-03',
    code: 'IND-INI-FP4-5.03',
    description: 'Aprecia sus trabajos.',
    competency: 'Autoestima',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-5-04',
    code: 'IND-INI-FP4-5.04',
    description: 'Se muestra optimista de sus posibilidades.',
    competency: 'Autoestima',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-6-01',
    code: 'IND-INI-FP4-6.01',
    description: 'Juega con niños de ambos sexos.',
    competency: 'Interacción con niños y adultos',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-6-02',
    code: 'IND-INI-FP4-6.02',
    description: 'Resuelve conflictos sin agredir.',
    competency: 'Interacción con niños y adultos',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-6-03',
    code: 'IND-INI-FP4-6.03',
    description: 'Se integra al grupo.',
    competency: 'Interacción con niños y adultos',
    instrument: 'Escala de Estimación'
  },
  {
    id: 'ind-ini-fp4-6-04',
    code: 'IND-INI-FP4-6.04',
    description: 'Su juego es socializado.',
    competency: 'Interacción con niños y adultos',
    instrument: 'Escala de Estimación'
  },
];


export const BancoDimensionesView: React.FC = () => {
  const {
    areas,
    competencies,
    indicators,
    activeLapso,
    addIndicator,
    updateIndicator,
    addCompetency
  } = useApp();

  // 1. Controles principales de la referencia
  const [selectedLapso, setSelectedLapso] = useState<number>(activeLapso || 1);
  const [selectedGrade, setSelectedGrade] = useState<'Sala de 4 Años' | 'Sala de 5 Años'>('Sala de 4 Años');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [indicatorSearchTerm, setIndicatorSearchTerm] = useState<string>('');

  // 2. Estado de navegación en "Gestionar" (null = vista de tabla de áreas; SubjectArea = vista de gestión de esa área)
  const [managingArea, setManagingArea] = useState<SubjectArea | null>(null);

  // 3. Indicadores modificados o agregados localmente (caché reactivo por código de área)
  const [customIndicators, setCustomIndicators] = useState<Record<string, LocalIndicatorRecord[]>>({});

  // 4. Modales de Gestión de la Referencia
  const [isNewCompetencyModalOpen, setIsNewCompetencyModalOpen] = useState<boolean>(false);
  const [isNewIndicatorModalOpen, setIsNewIndicatorModalOpen] = useState<boolean>(false);
  const [editingIndicator, setEditingIndicator] = useState<LocalIndicatorRecord | null>(null);
  const [deletingIndicatorId, setDeletingIndicatorId] = useState<string | null>(null);

  // Formulario de Nueva Competencia
  const [newCompetencyCode, setNewCompetencyCode] = useState<string>('');
  const [newCompetencyTitle, setNewCompetencyTitle] = useState<string>('');

  // Formulario de Nuevo / Editar Indicador
  const [indFormCode, setIndFormCode] = useState<string>('');
  const [indFormDesc, setIndFormDesc] = useState<string>('');
  const [indFormCompId, setIndFormCompId] = useState<string>('');
  const [indFormComp, setIndFormComp] = useState<string>('');
  const [indFormInst, setIndFormInst] = useState<string>('Escala de Estimación');
  const [indFormError, setIndFormError] = useState<string | null>(null);

  // Modal de impresión oficial
  const [printingArea, setPrintingArea] = useState<SubjectArea | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  // Áreas oficiales del nivel Inicial
  const inicialAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'INICIAL');
  }, [areas]);

  // Manejador del botón "Cargar áreas" de la referencia
  const handleCargarAreas = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessToast(`Áreas sincronizadas para ${selectedGrade} (Lapso ${selectedLapso}).`);
      setTimeout(() => setShowSuccessToast(null), 2500);
    }, 350);
  };

  // Filtrado de áreas
  const filteredAreas = useMemo(() => {
    return inicialAreas.filter(area => {
      const dimInfo = AREA_DIMENSIONS_MAP[area.code] || { dimension: '', domain: '' };
      const term = searchTerm.toLowerCase();
      return (
        area.name.toLowerCase().includes(term) ||
        area.code.toLowerCase().includes(term) ||
        (area.areaProfile && area.areaProfile.toLowerCase().includes(term)) ||
        dimInfo.dimension.toLowerCase().includes(term) ||
        dimInfo.domain.toLowerCase().includes(term)
      );
    });
  }, [inicialAreas, searchTerm]);

  // Competencias oficiales disponibles para el área que se está gestionando
  const availableCompetencies = useMemo<Competency[]>(() => {
    if (!managingArea) return [];
    const targetAreaId = (managingArea.id || '').toLowerCase();
    const targetCode = (managingArea.code || '').toLowerCase();
    const targetClean = targetCode.replace('ini-', '').replace('-', '');

    const matched = (competencies || []).filter(c => {
      if (c.level && c.level.toUpperCase() !== 'INICIAL') return false;
      const cArea = (c.areaId || '').toLowerCase();
      const matchArea =
        cArea === targetAreaId ||
        cArea === targetCode ||
        cArea.includes(targetClean) ||
        targetAreaId.includes(cArea);
      if (!matchArea) return false;
      if (c.grade && c.grade.trim().toLowerCase() !== selectedGrade.trim().toLowerCase()) return false;
      if (c.lapso && Number(c.lapso) !== Number(selectedLapso)) return false;
      return true;
    });

    if (matched.length > 0) return matched;

    // Fallback institucional oficial para INI-FP
    if (managingArea.code === 'INI-FP') {
      return OFFICIAL_INICIAL_FP4_COMPS;
    }

    return [];
  }, [managingArea, competencies, selectedGrade, selectedLapso]);

  // Función núcleo para consultar y formatear los datos reales de SICE para un área, sala y lapso
  const getSiceCurriculum = (
    area: SubjectArea | null,
    grade: 'Sala de 4 Años' | 'Sala de 5 Años',
    lapso: number
  ) => {
    if (!area) {
      return {
        items: [] as LocalIndicatorRecord[],
        grouped: {} as Record<string, LocalIndicatorRecord[]>
      };
    }

    const targetAreaId = (area.id || '').toLowerCase();
    const targetCode = (area.code || '').toLowerCase();
    const targetClean = targetCode.replace('ini-', '').replace('-', '');

    // 1. Filtrar competencias en el sistema SICE
    const matchedComps = (competencies || []).filter(c => {
      if (c.level && c.level.toUpperCase() !== 'INICIAL') return false;
      const cArea = (c.areaId || '').toLowerCase();
      const matchArea =
        cArea === targetAreaId ||
        cArea === targetCode ||
        cArea.includes(targetClean) ||
        targetAreaId.includes(cArea);
      if (!matchArea) return false;
      if (c.grade && c.grade.trim().toLowerCase() !== grade.trim().toLowerCase()) return false;
      if (c.lapso && Number(c.lapso) !== Number(lapso)) return false;
      return true;
    });

    const compTitleMap = new Map<string, string>();
    matchedComps.forEach(c => compTitleMap.set(c.id, c.title));

    // 2. Filtrar indicadores del sistema SICE
    const matchedInds = (indicators || []).filter(ind => {
      if (ind.level && ind.level.toUpperCase() !== 'INICIAL') return false;
      const indArea = (ind.areaId || '').toLowerCase();
      const matchArea =
        indArea === targetAreaId ||
        indArea === targetCode ||
        indArea.includes(targetClean) ||
        targetAreaId.includes(indArea);
      if (!matchArea) return false;
      if (ind.grade && ind.grade.trim().toLowerCase() !== grade.trim().toLowerCase()) return false;
      if (ind.lapso && Number(ind.lapso) !== Number(lapso)) return false;
      return true;
    });

    // Formatear registros SICE
    const siceItems: LocalIndicatorRecord[] = matchedInds.map(ind => {
      const compTitle =
        (ind.competencyId && compTitleMap.get(ind.competencyId)) ||
        (competencies || []).find(c => c.id === ind.competencyId)?.title ||
        'Competencias Generales del Área';
      return {
        id: ind.id,
        code: ind.code,
        description: ind.description,
        competency: compTitle,
        instrument: ind.evaluationInstrument || 'Escala de Estimación'
      };
    });

    // Respaldo defensivo: si no hay registros cargados aún en SICE para INI-FP Sala de 4 Años, usar el banco oficial institucional
    if (siceItems.length === 0 && area.code === 'INI-FP' && grade === 'Sala de 4 Años' && Number(lapso) === 1) {
      OFFICIAL_INICIAL_FP4_ITEMS.forEach(item => siceItems.push(item));
      if (matchedComps.length === 0) {
        OFFICIAL_INICIAL_FP4_COMPS.forEach(c => matchedComps.push(c));
      }
    }

    // Incorporar agregados/ediciones locales sin duplicar
    const localItems = customIndicators[area.code] || [];
    const localMap = new Map<string, LocalIndicatorRecord>();
    localItems.forEach(loc => localMap.set(loc.id, loc));

    // Si un item de SICE fue editado localmente, aplicar sus cambios
    const mergedItems: LocalIndicatorRecord[] = siceItems.map(item => {
      if (localMap.has(item.id)) {
        return localMap.get(item.id)!;
      }
      return item;
    });

    // Agregar items creados localmente que aún no estén en siceItems
    const siceIds = new Set(siceItems.map(i => i.id));
    localItems.forEach(loc => {
      if (!siceIds.has(loc.id)) {
        mergedItems.unshift(loc); // Al inicio para respuesta visual inmediata
      }
    });

    // Agrupar por competencia respetando el orden oficial
    const grouped: Record<string, LocalIndicatorRecord[]> = {};
    matchedComps.forEach(c => {
      grouped[c.title] = [];
    });

    mergedItems.forEach(item => {
      const key = item.competency || 'Competencias Generales del Área';
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });

    return { items: mergedItems, grouped };
  };

  // Indicadores activos para el área actualmente en gestión
  const { items: activeAreaIndicators } = useMemo(() => {
    return getSiceCurriculum(managingArea, selectedGrade, selectedLapso);
  }, [managingArea, selectedGrade, selectedLapso, competencies, indicators, customIndicators]);

  // Indicadores filtrados por término de búsqueda en la vista de gestión
  const displayedAreaIndicators = useMemo(() => {
    if (!indicatorSearchTerm.trim()) return activeAreaIndicators;
    const term = indicatorSearchTerm.trim().toLowerCase();
    return activeAreaIndicators.filter(ind => {
      return (
        ind.description.toLowerCase().includes(term) ||
        ind.code.toLowerCase().includes(term) ||
        (ind.competency && ind.competency.toLowerCase().includes(term)) ||
        (ind.instrument && ind.instrument.toLowerCase().includes(term))
      );
    });
  }, [activeAreaIndicators, indicatorSearchTerm]);

  // Indicadores y dimensiones agrupadas para el área que se imprimirá
  const { items: printIndicators, grouped: groupedPrintIndicators } = useMemo(() => {
    return getSiceCurriculum(printingArea, selectedGrade, selectedLapso);
  }, [printingArea, selectedGrade, selectedLapso, competencies, indicators, customIndicators]);

  // Partición oficial en Página 1 y Página 2 según el reporte de referencia (41 filas en Pág 1, resto en Pág 2)
  const printPages = useMemo<{
    totalPages: number;
    page1: [string, LocalIndicatorRecord[]][];
    page2: [string, LocalIndicatorRecord[]][];
  }>(() => {
    const entries: [string, LocalIndicatorRecord[]][] = Object.entries(groupedPrintIndicators).filter(
      ([_, items]) => items.length > 0
    );

    if (entries.length === 0) {
      return {
        totalPages: 1,
        page1: [],
        page2: []
      };
    }

    const totalIndicators = entries.reduce((acc, [_, items]) => acc + items.length, 0);

    // Si cabe holgadamente en 1 sola página (máximo 20 filas)
    if (totalIndicators <= 20 && entries.length <= 2) {
      return {
        totalPages: 1,
        page1: entries,
        page2: []
      };
    }

    // Regla de corte exacta de 41 filas para la Página 1 según el PDF de referencia
    const MAX_PAGE1_ROWS = 41;
    let accumulatedRows = 0;
    const page1Entries: [string, LocalIndicatorRecord[]][] = [];
    const page2Entries: [string, LocalIndicatorRecord[]][] = [];

    for (const [compTitle, items] of entries) {
      if (accumulatedRows + items.length <= MAX_PAGE1_ROWS) {
        page1Entries.push([compTitle, items]);
        accumulatedRows += items.length;
      } else if (accumulatedRows < MAX_PAGE1_ROWS) {
        const remainingForPage1 = MAX_PAGE1_ROWS - accumulatedRows;
        page1Entries.push([compTitle, items.slice(0, remainingForPage1)]);
        page2Entries.push([compTitle, items.slice(remainingForPage1)]);
        accumulatedRows = MAX_PAGE1_ROWS;
      } else {
        page2Entries.push([compTitle, items]);
      }
    }

    return {
      totalPages: page2Entries.length > 0 ? 2 : 1,
      page1: page1Entries,
      page2: page2Entries
    };
  }, [groupedPrintIndicators]);

  // Formato oficial de fecha y hora idéntico al reporte de referencia (Ej: 05/11/2026 02:20:59 pm)
  const currentFormattedDateTime = useMemo(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = String(hours).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hoursStr}:${minutes}:${seconds} ${ampm}`;
  }, [printingArea]);

  // Abrir modal para crear un NUEVO indicador general del área
  const handleOpenNewIndicatorModal = () => {
    if (!managingArea) return;
    setEditingIndicator(null);
    setIndFormError(null);
    const cleanAreaCode = managingArea.code.replace('INI-', '');
    const nextNumber = activeAreaIndicators.length + 1;
    setIndFormCode(`IND-${cleanAreaCode}-${nextNumber}`);
    setIndFormDesc('');
    setIndFormInst('Escala de Estimación');

    if (availableCompetencies.length > 0) {
      setIndFormCompId(availableCompetencies[0].id);
      setIndFormComp(availableCompetencies[0].title);
    } else {
      setIndFormCompId('__NEW__');
      setIndFormComp('Competencia General del Área');
    }

    setIsNewIndicatorModalOpen(true);
  };

  // Abrir modal para crear un NUEVO indicador asociado a una competencia específica
  const handleOpenNewIndicatorForCompetency = (compTitle: string) => {
    if (!managingArea) return;
    setEditingIndicator(null);
    setIndFormError(null);
    const cleanAreaCode = managingArea.code.replace('INI-', '');
    const nextNumber = activeAreaIndicators.length + 1;
    setIndFormCode(`IND-${cleanAreaCode}-${nextNumber}`);
    setIndFormDesc('');
    setIndFormInst('Escala de Estimación');

    const matchedComp = availableCompetencies.find(
      c => c.title.trim().toLowerCase() === compTitle.trim().toLowerCase()
    );

    if (matchedComp) {
      setIndFormCompId(matchedComp.id);
      setIndFormComp(matchedComp.title);
    } else {
      setIndFormCompId('__NEW__');
      setIndFormComp(compTitle);
    }

    setIsNewIndicatorModalOpen(true);
  };

  // Abrir modal para MODIFICAR un indicador existente
  const handleOpenEditIndicator = (ind: LocalIndicatorRecord) => {
    setEditingIndicator(ind);
    setIndFormError(null);
    setIndFormCode(ind.code);
    setIndFormDesc(ind.description);
    setIndFormInst(ind.instrument || 'Escala de Estimación');

    const matchedComp = availableCompetencies.find(
      c => c.title.trim().toLowerCase() === (ind.competency || '').trim().toLowerCase()
    );

    if (matchedComp) {
      setIndFormCompId(matchedComp.id);
      setIndFormComp(matchedComp.title);
    } else {
      setIndFormCompId('__NEW__');
      setIndFormComp(ind.competency || 'Competencia General');
    }

    setIsNewIndicatorModalOpen(true);
  };

  // Guardar nuevo indicador en el sistema SICE
  const handleSaveNewIndicator = () => {
    if (!managingArea) return;

    if (!indFormDesc.trim()) {
      setIndFormError('Por favor redacte la descripción del criterio o indicador observable.');
      return;
    }

    const cleanAreaCode = managingArea.code.replace('INI-', '');
    const indCode = indFormCode.trim() || `IND-${cleanAreaCode}-${Date.now().toString().slice(-4)}`;

    let targetCompId = indFormCompId;
    let targetCompTitle = indFormComp.trim();

    // Si se eligió nueva competencia o no hay ID seleccionado, garantizar creación de la competencia
    if (!targetCompId || targetCompId === '__NEW__') {
      const existingComp = (competencies || []).find(
        c =>
          (c.areaId.toLowerCase() === managingArea.id.toLowerCase() ||
            c.areaId.toLowerCase() === managingArea.code.toLowerCase()) &&
          c.title.trim().toLowerCase() === targetCompTitle.toLowerCase()
      );

      if (existingComp) {
        targetCompId = existingComp.id;
        targetCompTitle = existingComp.title;
      } else {
        // Crear automáticamente la competencia en SICE
        const createdComp = addCompetency({
          areaId: managingArea.id,
          code: `CP-${managingArea.code}-0${availableCompetencies.length + 1}`,
          title: targetCompTitle || 'Competencia General del Área',
          description: `Competencia curricular registrada para ${targetCompTitle || 'el área'} en ${selectedGrade}.`,
          level: 'INICIAL',
          lapso: Number(selectedLapso) as 1 | 2 | 3,
          grade: selectedGrade
        });
        targetCompId = createdComp.id;
        targetCompTitle = createdComp.title;
      }
    } else {
      const selectedCompObj = availableCompetencies.find(c => c.id === targetCompId);
      if (selectedCompObj) {
        targetCompTitle = selectedCompObj.title;
      }
    }

    // Registrar indicador en SICE
    const createdInd = addIndicator({
      areaId: managingArea.id,
      competencyId: targetCompId,
      code: indCode,
      description: indFormDesc.trim(),
      level: 'INICIAL',
      lapso: Number(selectedLapso) as 1 | 2 | 3,
      grade: selectedGrade,
      evaluationInstrument: indFormInst
    });

    // Guardar en estado local para reactividad inmediata
    const newRecord: LocalIndicatorRecord = {
      id: createdInd.id,
      code: indCode,
      description: indFormDesc.trim(),
      competency: targetCompTitle || 'Competencia General',
      instrument: indFormInst
    };

    setCustomIndicators(prev => {
      const currentList = prev[managingArea.code] || [];
      return {
        ...prev,
        [managingArea.code]: [newRecord, ...currentList]
      };
    });

    setIsNewIndicatorModalOpen(false);
    setIndFormCode('');
    setIndFormDesc('');
    setIndFormError(null);
    setShowSuccessToast('Nuevo indicador registrado con éxito en SICE.');
    setTimeout(() => setShowSuccessToast(null), 2500);
  };

  // Modificar indicador existente en el sistema SICE
  const handleSaveEditIndicator = () => {
    if (!managingArea || !editingIndicator) return;

    if (!indFormDesc.trim()) {
      setIndFormError('Por favor redacte la descripción del criterio o indicador observable.');
      return;
    }

    let targetCompTitle = indFormComp.trim();
    let targetCompId = indFormCompId;

    if (targetCompId && targetCompId !== '__NEW__') {
      const found = availableCompetencies.find(c => c.id === targetCompId);
      if (found) {
        targetCompTitle = found.title;
      }
    }

    // Actualizar en AppContext si existe en el estado global
    const existingInd = (indicators || []).find(i => i.id === editingIndicator.id);
    if (existingInd) {
      updateIndicator({
        ...existingInd,
        code: indFormCode.trim() || existingInd.code,
        description: indFormDesc.trim(),
        evaluationInstrument: indFormInst,
        competencyId:
          targetCompId && targetCompId !== '__NEW__' ? targetCompId : existingInd.competencyId
      });
    }

    // Actualizar en customIndicators
    setCustomIndicators(prev => {
      const list = prev[managingArea.code] || [];
      const exists = list.some(i => i.id === editingIndicator.id);
      if (exists) {
        return {
          ...prev,
          [managingArea.code]: list.map(i =>
            i.id === editingIndicator.id
              ? {
                  ...i,
                  code: indFormCode.trim() || i.code,
                  description: indFormDesc.trim(),
                  competency: targetCompTitle || i.competency,
                  instrument: indFormInst
                }
              : i
          )
        };
      }
      return {
        ...prev,
        [managingArea.code]: [
          {
            id: editingIndicator.id,
            code: indFormCode.trim() || editingIndicator.code,
            description: indFormDesc.trim(),
            competency: targetCompTitle || editingIndicator.competency,
            instrument: indFormInst
          },
          ...list
        ]
      };
    });

    setEditingIndicator(null);
    setIsNewIndicatorModalOpen(false);
    setIndFormError(null);
    setShowSuccessToast('Indicador modificado satisfactoriamente en SICE.');
    setTimeout(() => setShowSuccessToast(null), 2500);
  };

  // Eliminar indicador
  const handleConfirmDelete = () => {
    if (!managingArea || !deletingIndicatorId) return;
    const code = managingArea.code;

    setCustomIndicators(prev => {
      const list = prev[code] || [];
      return {
        ...prev,
        [code]: list.filter(item => item.id !== deletingIndicatorId)
      };
    });

    setDeletingIndicatorId(null);
    setShowSuccessToast('Indicador eliminado correctamente.');
    setTimeout(() => setShowSuccessToast(null), 2500);
  };

  // Guardar nueva competencia en el sistema SICE
  const handleSaveNewCompetency = () => {
    if (!managingArea || !newCompetencyTitle.trim()) return;
    const code = managingArea.code;
    const compCode = newCompetencyCode.trim() || `CP-${code}-0${activeAreaIndicators.length + 1}`;

    addCompetency({
      areaId: managingArea.id,
      code: compCode,
      title: newCompetencyTitle.trim(),
      description: `Competencia curricular registrada para ${newCompetencyTitle.trim()} en ${selectedGrade}.`,
      level: 'INICIAL',
      lapso: Number(selectedLapso) as 1 | 2 | 3,
      grade: selectedGrade
    });

    setIsNewCompetencyModalOpen(false);
    setNewCompetencyCode('');
    setNewCompetencyTitle('');
    setShowSuccessToast('Nueva competencia registrada en SICE.');
    setTimeout(() => setShowSuccessToast(null), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Toast de confirmación */}
      {showSuccessToast && (
        <div className="no-print fixed top-6 right-6 z-50 bg-[#2C2E53] text-white px-4 py-3 rounded-2xl shadow-xl border-2 border-emerald-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{showSuccessToast}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* VISTA 1: TABLA PRINCIPAL DE ÁREAS (Cuando NO está en Gestionar) */}
      {/* ============================================================== */}
      {!managingArea ? (
        <>
          {/* BARRA DE FILTROS SEGÚN REFERENCIA: [ Lapso ⌄ ] [ Grado ⌄ ] [ Cargar áreas ] */}
          <div className="no-print bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border-2 border-slate-300 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* 1. Selector de Lapso */}
              <div className="relative">
                <label htmlFor="ref-select-lapso" className="sr-only">
                  Lapso
                </label>
                <select
                  id="ref-select-lapso"
                  value={selectedLapso}
                  onChange={(e) => setSelectedLapso(Number(e.target.value))}
                  className="appearance-none bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm rounded-xl pl-3.5 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2E53] dark:focus:ring-amber-400 shadow-2xs cursor-pointer"
                >
                  <option value={1}>Lapso 1</option>
                  <option value={2}>Lapso 2</option>
                  <option value={3}>Lapso 3</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 2. Selector de Grado (Salas oficiales CBA: 4 y 5 Años) */}
              <div className="relative">
                <label htmlFor="ref-select-grado" className="sr-only">
                  Grado
                </label>
                <select
                  id="ref-select-grado"
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value as 'Sala de 4 Años' | 'Sala de 5 Años')}
                  className="appearance-none bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm rounded-xl pl-3.5 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2E53] dark:focus:ring-amber-400 shadow-2xs cursor-pointer"
                >
                  <option value="Sala de 4 Años">Sala de 4 Años</option>
                  <option value="Sala de 5 Años">Sala de 5 Años</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 3. Botón Cargar áreas */}
              <button
                onClick={handleCargarAreas}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm rounded-xl border-2 border-slate-300 dark:border-slate-700 shadow-2xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                title="Cargar áreas pedagógicas asociadas a este grado y lapso"
              >
                <RotateCw className={`w-3.5 h-3.5 text-amber-600 dark:text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Cargando áreas...' : 'Cargar áreas'}</span>
              </button>
            </div>

            {/* Buscador Rápido de Áreas */}
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrar áreas o dimensiones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2E53] dark:focus:ring-amber-400"
                />
              </div>

              <button
                onClick={() => setPrintingArea(filteredAreas[0] || inicialAreas[0])}
                className="p-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
                title="Imprimir Banco de Dimensiones Oficial"
              >
                <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>

          {/* TABLA PRINCIPAL DE ÁREAS: | Áreas | Descripción | Gestionar | Imprimir | */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 border-b-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs uppercase font-extrabold tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6 w-[28%]">Áreas</th>
                    <th className="py-3.5 px-4 sm:px-6 w-[48%]">Descripción</th>
                    <th className="py-3.5 px-4 text-center w-[12%]">Gestionar</th>
                    <th className="py-3.5 px-4 text-center w-[12%]">Imprimir</th>
                  </tr>
                </thead>

                <tbody className="divide-y-2 divide-slate-200 dark:divide-slate-800 text-xs text-slate-800 dark:text-slate-200">
                  {filteredAreas.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400">
                        <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                          No se encontraron áreas curriculares.
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Haga clic en <strong>"Cargar áreas"</strong> o ajuste los términos de búsqueda.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredAreas.map((area) => {
                      const AreaIcon = AREA_ICON_MAP[area.code] || BookOpen;
                      const dimInfo = AREA_DIMENSIONS_MAP[area.code] || {
                        dimension: 'Dimensión Formativa del Nivel Inicial',
                        domain: 'Desarrollo Curricular Integral'
                      };

                      return (
                        <tr
                          key={area.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          {/* Columna 1: Áreas */}
                          <td className="py-4 px-4 sm:px-6 align-top">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-2 border-amber-300 dark:border-amber-700 flex items-center justify-center shrink-0 shadow-2xs font-bold">
                                <AreaIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-950 dark:text-white text-sm leading-snug">
                                  {area.name}
                                </div>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                    {area.code}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                    {area.weeklyHours} hrs/sem
                                  </span>
                                  {area.type === 'INTEGRADA' && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                      Integrada
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300 mt-1">
                                  {dimInfo.dimension}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Columna 2: Descripción */}
                          <td className="py-4 px-4 sm:px-6 align-top">
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                              {area.areaProfile || 'Área curricular de Educación Inicial articulada al desarrollo integral del niño en etapa preescolar.'}
                            </p>
                            <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                              <span>Ámbito: {dimInfo.domain}</span>
                            </div>
                          </td>

                          {/* Columna 3: Gestionar -> Abre la vista de gestión referenciada */}
                          <td className="py-4 px-4 text-center align-middle">
                            <button
                              onClick={() => setManagingArea(area)}
                              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#2C2E53] hover:bg-[#1E2038] text-white font-bold rounded-xl text-xs shadow-xs border border-[#2C2E53] transition-all cursor-pointer active:scale-95"
                              title={`Gestionar indicadores y competencias de ${area.name}`}
                            >
                              <Settings className="w-3.5 h-3.5 text-amber-300" />
                              <span>Gestionar</span>
                            </button>
                          </td>

                          {/* Columna 4: Imprimir */}
                          <td className="py-4 px-4 text-center align-middle">
                            <button
                              onClick={() => setPrintingArea(area)}
                              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold rounded-xl text-xs border-2 border-slate-300 dark:border-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95"
                              title={`Imprimir ficha curricular oficial de ${area.name}`}
                            >
                              <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                              <span>Imprimir</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-100/80 dark:bg-slate-800/60 px-5 py-3 border-t-2 border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 dark:text-slate-300 gap-2 font-semibold">
              <span>
                Mostrando <strong>{filteredAreas.length}</strong> áreas curriculares para <strong>{selectedGrade}</strong> (Lapso {selectedLapso}).
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                U.E.P. Colegio Bellas Artes • Código DEA S3352D2001
              </span>
            </div>
          </div>
        </>
      ) : (
        /* ============================================================== */
        /* VISTA 2: GESTIONAR ÁREA SEGÚN IMAGEN DE REFERENCIA:             */
        /* [ Nueva Competencia ] [ Nuevo Indicador ] [ Imprimir ] [ Atras ]*/
        /* | Registros de Indicadores | Nuevo Indicador | Modificar | Eliminar |*/
        /* ============================================================== */
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Barra Superior de Botones y Búsqueda */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border-2 border-slate-300 dark:border-slate-700 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Botón 1: Nueva Competencia */}
              <button
                onClick={() => {
                  setNewCompetencyCode(`CP-${managingArea.code}-0${activeAreaIndicators.length + 1}`);
                  setNewCompetencyTitle('');
                  setIsNewCompetencyModalOpen(true);
                }}
                className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm rounded-xl border-2 border-slate-300 dark:border-slate-700 shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Nueva Competencia</span>
              </button>

              {/* Botón 2: Nuevo Indicador (Botón Principal Directo) */}
              <button
                onClick={handleOpenNewIndicatorModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-emerald-600"
                title="Registrar un nuevo indicador en esta área"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Nuevo Indicador</span>
              </button>

              {/* Botón 3: Imprimir Banco de Indicadores */}
              <button
                onClick={() => setPrintingArea(managingArea)}
                className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm rounded-xl border-2 border-slate-300 dark:border-slate-700 shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                title="Imprimir el reporte oficial del Banco de Dimensiones para esta área"
              >
                <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span>Imprimir Banco de Indicadores</span>
              </button>

              {/* Botón 4: Atras */}
              <button
                onClick={() => {
                  setManagingArea(null);
                  setIndicatorSearchTerm('');
                }}
                className="px-4 py-2 bg-[#2C2E53] hover:bg-[#1E2038] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-[#2C2E53]"
              >
                <ArrowLeft className="w-4 h-4 text-amber-300" />
                <span>Atras</span>
              </button>
            </div>

            {/* Zona Derecha: Buscador de Indicadores y Contexto */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Buscador Rápido de Indicadores */}
              <div className="relative w-full sm:w-64 md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar indicador o competencia..."
                  value={indicatorSearchTerm}
                  onChange={(e) => setIndicatorSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2E53] dark:focus:ring-amber-400 font-medium placeholder:text-slate-400 shadow-2xs transition-all"
                />
                {indicatorSearchTerm && (
                  <button
                    onClick={() => setIndicatorSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Contexto del Área Gestionada */}
              <div className="flex flex-col items-start sm:items-end shrink-0">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                  {managingArea.name} ({managingArea.code})
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700 mt-1">
                  {selectedGrade} • Lapso {selectedLapso}
                </span>
              </div>
            </div>
          </div>

          {/* TABLA DE INDICADORES: | Registros de Indicadores | Nuevo Indicador | Modificar | Eliminar | */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 border-b-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs uppercase font-extrabold tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6 w-[55%]">Registros de Indicadores</th>
                    <th className="py-3.5 px-4 text-center w-[15%]">
                      <button
                        onClick={handleOpenNewIndicatorModal}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-lg text-xs transition-all shadow-2xs cursor-pointer active:scale-95"
                        title="Registrar nuevo indicador"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Nuevo Indicador</span>
                      </button>
                    </th>
                    <th className="py-3.5 px-4 text-center w-[15%]">Modificar</th>
                    <th className="py-3.5 px-4 text-center w-[15%]">Eliminar</th>
                  </tr>
                </thead>

                <tbody className="divide-y-2 divide-slate-200 dark:divide-slate-800 text-xs text-slate-800 dark:text-slate-200">
                  {activeAreaIndicators.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400">
                        <Tag className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                          No hay indicadores registrados para esta área en {selectedGrade}.
                        </p>
                        <p className="text-xs text-slate-400 mt-1 mb-4">
                          Puede registrar un nuevo indicador o una nueva competencia para comenzar.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => {
                              setNewCompetencyCode(`CP-${managingArea.code}-01`);
                              setNewCompetencyTitle('');
                              setIsNewCompetencyModalOpen(true);
                            }}
                            className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold rounded-xl border-2 border-slate-300 dark:border-slate-700 text-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-100"
                          >
                            <Plus className="w-4 h-4 text-emerald-600" />
                            <span>Nueva Competencia</span>
                          </button>
                          <button
                            onClick={handleOpenNewIndicatorModal}
                            className="px-4 py-2 bg-[#2C2E53] hover:bg-[#1E2038] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Plus className="w-4 h-4 text-amber-300" />
                            <span>Nuevo Indicador</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : displayedAreaIndicators.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400">
                        <Search className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                          No se encontraron indicadores que coincidan con "{indicatorSearchTerm}".
                        </p>
                        <p className="text-xs text-slate-400 mt-1 mb-4">
                          Intente con otra palabra clave, código o título de la competencia.
                        </p>
                        <button
                          onClick={() => setIndicatorSearchTerm('')}
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold rounded-xl text-xs border border-slate-300 dark:border-slate-600 transition cursor-pointer"
                        >
                          Limpiar búsqueda
                        </button>
                      </td>
                    </tr>
                  ) : (
                    displayedAreaIndicators.map((ind, index) => (
                      <tr
                        key={ind.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* Columna 1: Registros de Indicadores */}
                        <td className="py-4 px-4 sm:px-6 align-top">
                          <div>
                            <div className="text-[11px] font-black uppercase text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              <span>{ind.competency}</span>
                            </div>

                            <div className="mt-1 flex items-start gap-2.5">
                              <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white shrink-0 mt-0.5">
                                {ind.code}
                              </span>
                              <p className="font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm leading-relaxed">
                                {ind.description}
                              </p>
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                                Instrumento: {ind.instrument}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Columna 2: Nuevo Indicador (para esta competencia) */}
                        <td className="py-4 px-4 text-center align-middle">
                          <button
                            onClick={() => handleOpenNewIndicatorForCompetency(ind.competency)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold rounded-xl text-xs border-2 border-slate-300 dark:border-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95"
                            title="Agregar otro indicador a esta competencia"
                          >
                            <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Nuevo</span>
                          </button>
                        </td>

                        {/* Columna 3: Modificar */}
                        <td className="py-4 px-4 text-center align-middle">
                          <button
                            onClick={() => handleOpenEditIndicator(ind)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold rounded-xl text-xs border-2 border-slate-300 dark:border-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95"
                            title="Modificar este indicador"
                          >
                            <FileEdit className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Modificar</span>
                          </button>
                        </td>

                        {/* Columna 4: Eliminar */}
                        <td className="py-4 px-4 text-center align-middle">
                          <button
                            onClick={() => setDeletingIndicatorId(ind.id)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-bold rounded-xl text-xs border-2 border-slate-300 dark:border-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95 hover:border-rose-300"
                            title="Eliminar este indicador"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-100/80 dark:bg-slate-800/60 px-5 py-3 border-t-2 border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 dark:text-slate-300 gap-2 font-semibold">
              <span>
                {indicatorSearchTerm.trim() ? (
                  <>
                    Filtrando <strong>{displayedAreaIndicators.length}</strong> de <strong>{activeAreaIndicators.length}</strong> indicadores para <span className="text-amber-800 dark:text-amber-400 font-bold">"{indicatorSearchTerm}"</span>.
                  </>
                ) : (
                  <>
                    Total de <strong>{activeAreaIndicators.length}</strong> indicadores formativos registrados en <strong>{managingArea.name}</strong>.
                  </>
                )}
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                U.E.P. Colegio Bellas Artes • Código DEA S3352D2001
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: NUEVA COMPETENCIA                                      */}
      {/* ============================================================== */}
      {isNewCompetencyModalOpen && managingArea && (
        <div className="no-print fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#2C2E53] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-xs">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base">Registrar Nueva Competencia</h3>
                  <p className="text-xs text-amber-200">{managingArea.name} ({managingArea.code})</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewCompetencyModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Código de la Competencia:
                </label>
                <input
                  type="text"
                  value={newCompetencyCode}
                  onChange={(e) => setNewCompetencyCode(e.target.value)}
                  placeholder={`Ej. CP-${managingArea.code}-0${activeAreaIndicators.length + 1}`}
                  className="w-full p-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-[#2C2E53] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Título y Definición de la Competencia:
                </label>
                <textarea
                  rows={3}
                  value={newCompetencyTitle}
                  onChange={(e) => setNewCompetencyTitle(e.target.value)}
                  placeholder="Ej. Reconocimiento y discriminación sensorial de atributos espaciales..."
                  className="w-full p-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#2C2E53] focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px]">
                Esta competencia se registrará automáticamente en <strong>SICE</strong> para <strong>{selectedGrade}</strong> (Lapso {selectedLapso}).
              </div>
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t-2 border-slate-300 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsNewCompetencyModalOpen(false)}
                className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNewCompetency}
                className="px-5 py-2 bg-[#2C2E53] hover:bg-[#1E2038] text-white font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>Guardar Competencia</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: NUEVO INDICADOR / EDITAR INDICADOR                    */}
      {/* ============================================================== */}
      {(isNewIndicatorModalOpen || editingIndicator) && managingArea && (
        <div className="no-print fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#2C2E53] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-xs">
                  {editingIndicator ? <FileEdit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-black text-base">
                    {editingIndicator ? 'Modificar Indicador' : 'Nuevo Indicador'}
                  </h3>
                  <p className="text-xs text-amber-200">{managingArea.name} ({managingArea.code})</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsNewIndicatorModalOpen(false);
                  setEditingIndicator(null);
                  setIndFormError(null);
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Alerta de error si falta la descripción */}
              {indFormError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{indFormError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Código Indicador:
                  </label>
                  <input
                    type="text"
                    value={indFormCode}
                    onChange={(e) => setIndFormCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-[#2C2E53] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Instrumento:
                  </label>
                  <select
                    value={indFormInst}
                    onChange={(e) => setIndFormInst(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-[#2C2E53] focus:outline-none"
                  >
                    <option value="Escala de Estimación">Escala de Estimación</option>
                    <option value="Lista de Cotejo">Lista de Cotejo</option>
                    <option value="Registro Anecdótico">Registro Anecdótico</option>
                    <option value="Observación Directa">Observación Directa</option>
                  </select>
                </div>
              </div>

              {/* Selector Inteligente de Competencia Vinculada */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Competencia Vinculada:
                </label>
                {availableCompetencies.length > 0 ? (
                  <select
                    value={indFormCompId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setIndFormCompId(val);
                      if (val === '__NEW__') {
                        setIndFormComp('');
                      } else {
                        const compObj = availableCompetencies.find(c => c.id === val);
                        if (compObj) setIndFormComp(compObj.title);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-[#2C2E53] focus:outline-none"
                  >
                    {availableCompetencies.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code ? `${c.code}: ` : ''}{c.title}
                      </option>
                    ))}
                    <option value="__NEW__">+ Otra / Nueva Competencia...</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={indFormComp}
                    onChange={(e) => {
                      setIndFormComp(e.target.value);
                      setIndFormCompId('__NEW__');
                    }}
                    placeholder="Ej. Autonomía y Adaptación a las Rutinas de Aula"
                    className="w-full p-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-[#2C2E53] focus:outline-none"
                  />
                )}

                {/* Campo extra cuando el usuario decide crear o personalizar la competencia */}
                {(indFormCompId === '__NEW__' || availableCompetencies.length === 0) && (
                  <input
                    type="text"
                    value={indFormComp}
                    onChange={(e) => setIndFormComp(e.target.value)}
                    placeholder="Escriba el título de la competencia..."
                    className="w-full mt-2 p-2.5 rounded-xl border-2 border-amber-300 dark:border-amber-600 bg-amber-50/40 dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-[#2C2E53] focus:outline-none"
                  />
                )}
              </div>

              {/* Descripción del Indicador */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Descripción del Criterio / Indicador Observable:
                </label>
                <textarea
                  rows={3}
                  value={indFormDesc}
                  onChange={(e) => {
                    setIndFormDesc(e.target.value);
                    if (indFormError) setIndFormError(null);
                  }}
                  placeholder="Ej. Nombra y señala los colores primarios en ilustraciones y elementos del aula..."
                  className="w-full p-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#2C2E53] focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t-2 border-slate-300 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsNewIndicatorModalOpen(false);
                  setEditingIndicator(null);
                  setIndFormError(null);
                }}
                className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={editingIndicator ? handleSaveEditIndicator : handleSaveNewIndicator}
                className="px-5 py-2 bg-[#2C2E53] hover:bg-[#1E2038] text-white font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>{editingIndicator ? 'Guardar Cambios' : 'Registrar Indicador'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: CONFIRMAR ELIMINACIÓN DE INDICADOR                     */}
      {/* ============================================================== */}
      {deletingIndicatorId && (
        <div className="no-print fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-rose-300 dark:border-rose-700 shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto border-2 border-rose-300">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-base text-slate-900 dark:text-white">¿Eliminar este indicador?</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Esta acción removerá el indicador seleccionado del banco de esta área.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingIndicatorId(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: REPORTE OFICIAL IMPRIMIBLE: BANCO DE DIMENSIONES       */}
      {/* PÁGINA 1/2 Y PÁGINA 2/2 (Fidelidad 100% C.E.O. / SICE-CBA)     */}
      {/* ============================================================== */}
      {printingArea && (
        <div className="banco-dimensiones-modal-overlay fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          {/* Estilos dedicados para impresión pixel-perfect según el reporte de referencia */}
          <style>{`
            @media print {
              @page {
                size: letter portrait;
                margin: 10mm 14mm 10mm 14mm;
              }
              body {
                background: #ffffff !important;
                color: #000000 !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              nav, header, aside, .no-print, button, input, select {
                display: none !important;
              }
              .banco-dimensiones-modal-overlay {
                position: static !important;
                background: none !important;
                padding: 0 !important;
                margin: 0 !important;
                overflow: visible !important;
                display: block !important;
                width: 100% !important;
                height: auto !important;
                inset: auto !important;
              }
              .banco-dimensiones-modal-content {
                background: none !important;
                box-shadow: none !important;
                border: none !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
                max-height: none !important;
              }
              .banco-dimensiones-print-document {
                background: #ffffff !important;
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                min-height: auto !important;
              }
              .banco-dimensiones-sheet-1 {
                page-break-after: always !important;
                break-after: page !important;
                min-height: 250mm !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
              }
              .banco-dimensiones-sheet-2 {
                page-break-before: always !important;
                break-before: page !important;
                page-break-after: avoid !important;
                break-after: avoid !important;
                min-height: 250mm !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
              }
              table {
                page-break-inside: auto !important;
              }
              tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              thead {
                display: table-header-group !important;
              }
            }
          `}</style>

          <div className="banco-dimensiones-modal-content bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Barra de Controles en Pantalla (Oculta en Impresión) */}
            <div className="no-print bg-[#2C2E53] p-4 text-white flex items-center justify-between border-b border-[#414474] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-xs">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base leading-tight">
                    Vista Previa Oficial: Banco de Dimensiones
                  </h3>
                  <p className="text-[11px] text-amber-200">
                    {selectedGrade} • Lapso {selectedLapso} • {printingArea.name} ({printingArea.code}) • {printPages.totalPages} {printPages.totalPages === 1 ? 'Página' : 'Páginas'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  title="Abrir diálogo de impresión o guardar como PDF"
                >
                  <Printer className="w-4 h-4 text-slate-950" />
                  <span>Imprimir Reporte</span>
                </button>

                <button
                  onClick={() => setPrintingArea(null)}
                  className="p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Cerrar vista previa"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenedor de Hojas con soporte para 2 Páginas (Página 1/2 y Página 2/2) */}
            <div className="overflow-y-auto p-4 sm:p-8 bg-slate-300/80 dark:bg-slate-950/80 flex flex-col items-center gap-6">
              
              {/* ======================================================== */}
              {/* HOJA 1: PÁGINA 1 DE 2                                   */}
              {/* ======================================================== */}
              <div className="banco-dimensiones-print-document banco-dimensiones-sheet-1 bg-white text-black p-6 sm:p-10 shadow-2xl rounded-sm w-full max-w-[780px] min-h-[960px] font-sans flex flex-col justify-between">
                <div>
                  {/* Encabezado Oficial del Reporte */}
                  <div className="flex items-start justify-between pb-1">
                    {/* Logo institucional CBA + Membrete */}
                    <div className="flex items-center gap-3">
                      <img
                        src={`${import.meta.env.BASE_URL}logo-cba.png`}
                        alt="Colegio Bellas Artes"
                        className="h-12 sm:h-14 w-auto object-contain shrink-0"
                      />
                      <div className="text-left font-sans text-[11px] sm:text-xs leading-tight font-bold text-slate-900 uppercase">
                        <div>UNIDAD EDUCATIVA BELLAS ARTES</div>
                        <div className="font-semibold text-slate-700">PERIODO ESCOLAR: 2026-2027</div>
                        <div className="font-bold">{selectedGrade.toUpperCase()} INICIAL</div>
                        <div className="font-extrabold text-[#1E3A8A]">
                          {selectedLapso} LAPSO {printingArea.name.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Código de verificación de la referencia */}
                    <div className="text-right">
                      <span className="font-mono text-xs font-black tracking-wider text-slate-900 block">
                        CODZHF32W6QCY
                      </span>
                    </div>
                  </div>

                  {/* Barra divisoria azul institucional de la referencia */}
                  <div className="w-full my-2 border-t-4 border-[#337ab7] border-double"></div>

                  {/* Título Oficial Centrado y Subrayado */}
                  <div className="text-center my-3">
                    <h2 className="text-sm sm:text-base font-bold text-black underline tracking-wide inline-block">
                      Banco de Dimensiones
                    </h2>
                  </div>

                  {/* Tablas Oficiales por Dimensión y Competencia (Página 1) */}
                  <div className="space-y-3.5">
                    {printPages.page1.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-500 border border-slate-300">
                        No hay indicadores registrados en el sistema SICE para esta área y sala.
                      </div>
                    ) : (
                      printPages.page1.map(([compName, items]) => (
                        <div key={compName} className="break-inside-avoid">
                          <table className="w-full border-collapse border border-slate-700 text-[11px]">
                            <thead>
                              <tr className="bg-[#337ab7] text-white">
                                <th
                                  colSpan={2}
                                  className="text-left py-1 px-2.5 font-bold italic text-white tracking-wide border border-slate-700 text-xs bg-[#337ab7]"
                                >
                                  {compName}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((ind, idx) => {
                                const fullList = groupedPrintIndicators[compName] || [];
                                const realIdx = fullList.findIndex(x => x.id === ind.id);
                                const displayNum = realIdx >= 0 ? realIdx + 1 : idx + 1;
                                return (
                                  <tr key={ind.id || idx} className="border-b border-slate-400">
                                    <td className="w-9 text-center py-0.5 px-1 font-semibold border-r border-slate-400 text-slate-900 text-[11px] align-middle">
                                      {displayNum}
                                    </td>
                                    <td className="py-0.5 px-2 text-slate-900 text-[11px] font-normal text-left align-middle leading-snug">
                                      {ind.description}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Pie de Página Oficial (Página 1) */}
                <div className="pt-4 mt-6 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-600 font-sans">
                  <div>
                    Página 1/{printPages.totalPages} - Fecha de Impresión {currentFormattedDateTime}
                  </div>
                  <div className="font-medium text-slate-700">
                    Control Estudiantil Online, C.E.O. • SICE-CBA
                  </div>
                </div>
              </div>

              {/* Separador visual entre páginas en pantalla */}
              {printPages.totalPages > 1 && (
                <div className="no-print w-full max-w-[780px] flex items-center justify-between px-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <div className="h-px bg-slate-400 flex-1 mr-4"></div>
                  <span className="bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full text-[11px] uppercase tracking-wider shadow-xs">
                    Fin de Página 1 • Inicio de Página 2
                  </span>
                  <div className="h-px bg-slate-400 flex-1 ml-4"></div>
                </div>
              )}

              {/* ======================================================== */}
              {/* HOJA 2: PÁGINA 2 DE 2 (Completando el reporte faltante) */}
              {/* ======================================================== */}
              {printPages.totalPages > 1 && (
                <div className="banco-dimensiones-print-document banco-dimensiones-sheet-2 bg-white text-black p-6 sm:p-10 shadow-2xl rounded-sm w-full max-w-[780px] min-h-[960px] font-sans flex flex-col justify-between">
                  <div>
                    {/* Encabezado Oficial del Reporte (Hoja 2) */}
                    <div className="flex items-start justify-between pb-1">
                      {/* Logo institucional CBA + Membrete */}
                      <div className="flex items-center gap-3">
                        <img
                          src={`${import.meta.env.BASE_URL}logo-cba.png`}
                          alt="Colegio Bellas Artes"
                          className="h-12 sm:h-14 w-auto object-contain shrink-0"
                        />
                        <div className="text-left font-sans text-[11px] sm:text-xs leading-tight font-bold text-slate-900 uppercase">
                          <div>UNIDAD EDUCATIVA BELLAS ARTES</div>
                          <div className="font-semibold text-slate-700">PERIODO ESCOLAR: 2026-2027</div>
                          <div className="font-bold">{selectedGrade.toUpperCase()} INICIAL</div>
                          <div className="font-extrabold text-[#1E3A8A]">
                            {selectedLapso} LAPSO {printingArea.name.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {/* Código de verificación de la referencia */}
                      <div className="text-right">
                        <span className="font-mono text-xs font-black tracking-wider text-slate-900 block">
                          CODZHF32W6QCY
                        </span>
                      </div>
                    </div>

                    {/* Barra divisoria azul institucional de la referencia */}
                    <div className="w-full my-2 border-t-4 border-[#337ab7] border-double"></div>

                    {/* Título Oficial Centrado y Subrayado */}
                    <div className="text-center my-3">
                      <h2 className="text-sm sm:text-base font-bold text-black underline tracking-wide inline-block">
                        Banco de Dimensiones
                      </h2>
                    </div>

                    {/* Tablas Oficiales por Dimensión y Competencia (Página 2) */}
                    <div className="space-y-3.5">
                      {printPages.page2.map(([compName, items]) => (
                        <div key={compName} className="break-inside-avoid">
                          <table className="w-full border-collapse border border-slate-700 text-[11px]">
                            <thead>
                              <tr className="bg-[#337ab7] text-white">
                                <th
                                  colSpan={2}
                                  className="text-left py-1 px-2.5 font-bold italic text-white tracking-wide border border-slate-700 text-xs bg-[#337ab7]"
                                >
                                  {compName}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((ind, idx) => {
                                const fullList = groupedPrintIndicators[compName] || [];
                                const realIdx = fullList.findIndex(x => x.id === ind.id);
                                const displayNum = realIdx >= 0 ? realIdx + 1 : idx + 1;
                                return (
                                  <tr key={ind.id || idx} className="border-b border-slate-400">
                                    <td className="w-9 text-center py-0.5 px-1 font-semibold border-r border-slate-400 text-slate-900 text-[11px] align-middle">
                                      {displayNum}
                                    </td>
                                    <td className="py-0.5 px-2 text-slate-900 text-[11px] font-normal text-left align-middle leading-snug">
                                      {ind.description}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pie de Página Oficial (Página 2) */}
                  <div className="pt-4 mt-6 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-600 font-sans">
                    <div>
                      Página 2/{printPages.totalPages} - Fecha de Impresión {currentFormattedDateTime}
                    </div>
                    <div className="font-medium text-slate-700">
                      Control Estudiantil Online, C.E.O. • SICE-CBA
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Barra de Cierre Inferior (No print) */}
            <div className="no-print bg-slate-100 dark:bg-slate-800 px-5 py-3 border-t border-slate-300 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Reporte estructurado en <strong>{printPages.totalPages}</strong> {printPages.totalPages === 1 ? 'página' : 'páginas'} con <strong>{printIndicators.length}</strong> criterios observables del sistema SICE.
              </span>
              <button
                onClick={() => setPrintingArea(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
