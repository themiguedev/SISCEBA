import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectArea, Competency, Indicator } from '../../types';
import {
  Tag,
  ChevronDown,
  RotateCw,
  Search,
  Plus,
  ArrowLeft,
  Printer,
  Settings,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  BookOpen,
  Heart,
  Globe,
  Palette,
  Music,
  Activity,
  Award,
  Waves,
  Languages,
  Monitor,
  Sparkles,
  Save,
  HelpCircle,
  FileText,
  Layers,
  Filter
} from 'lucide-react';
import {
  LocalIndicatorRecord,
  OFFICIAL_INICIAL_FP4_COMPS,
  OFFICIAL_INICIAL_FP4_ITEMS
} from './BancoDimensionesView';

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

// Semilla oficial institucional para otras áreas de Educación Inicial CBA
const INSTITUTIONAL_INICIAL_OTHER_ITEMS: Record<string, LocalIndicatorRecord[]> = {
  'INI-CA': [
    {
      id: 'ind-ini-ca-1',
      code: 'IND-INI-CA-1.01',
      description: 'Clasifica objetos por color primario y forma geométrica básica.',
      competency: 'Procesos Matemáticos y Nociones Lógicas',
      instrument: 'Escala de Estimación'
    },
    {
      id: 'ind-ini-ca-2',
      code: 'IND-INI-CA-1.02',
      description: 'Identifica relaciones espaciales: arriba/abajo, dentro/fuera, cerca/lejos.',
      competency: 'Orientación Espacio-Temporal',
      instrument: 'Guía de Observación'
    },
    {
      id: 'ind-ini-ca-3',
      code: 'IND-INI-CA-1.03',
      description: 'Explora y describe elementos del entorno natural respetando seres vivos.',
      competency: 'Exploración de la Naturaleza',
      instrument: 'Registro Anecdótico'
    }
  ],
  'INI-AP': [
    {
      id: 'ind-ini-ap-1',
      code: 'IND-INI-AP-1.01',
      description: 'Realiza agarre de pinza digital y modela figuras con plastilina con autonomía.',
      competency: 'Expresión Plástica y Motricidad Fina',
      instrument: 'Escala de Estimación'
    },
    {
      id: 'ind-ini-ap-2',
      code: 'IND-INI-AP-1.02',
      description: 'Aplica colores libremente reconociendo los límites de la superficie gráfica.',
      competency: 'Sensibilidad Estética y Creatividad',
      instrument: 'Lista de Cotejo'
    }
  ],
  'INI-MUS': [
    {
      id: 'ind-ini-mus-1',
      code: 'IND-INI-MUS-1.01',
      description: 'Sigue esquemas rítmicos sencillos con palmas e instrumentos de percusión menor.',
      competency: 'Percepción Auditiva y Rítmica',
      instrument: 'Escala de Estimación'
    },
    {
      id: 'ind-ini-mus-2',
      code: 'IND-INI-MUS-1.02',
      description: 'Entona canciones infantiles coordinando canto con movimientos corporales.',
      competency: 'Ensamble Coral Temprano',
      instrument: 'Guía de Observación'
    }
  ],
  'INI-EF': [
    {
      id: 'ind-ini-ef-1',
      code: 'IND-INI-EF-1.01',
      description: 'Mantiene el equilibrio dinámico al caminar sobre líneas y circuitos motrices.',
      competency: 'Equilibrio y Coordinación Dinámica',
      instrument: 'Escala de Estimación'
    },
    {
      id: 'ind-ini-ef-2',
      code: 'IND-INI-EF-1.02',
      description: 'Identifica y nombra partes principales de su esquema corporal en movimiento.',
      competency: 'Esquema Corporal',
      instrument: 'Lista de Cotejo'
    }
  ],
  'INI-ING': [
    {
      id: 'ind-ini-ing-1',
      code: 'IND-INI-ING-1.01',
      description: 'Responde con saludos y fórmulas de cortesía en inglés (hello, good morning, bye).',
      competency: 'Inmersión Bilingüe y Vocabulario Básico',
      instrument: 'Escala de Estimación'
    },
    {
      id: 'ind-ini-ing-2',
      code: 'IND-INI-ING-1.02',
      description: 'Reconoce vocabulario contextual de colores y números del 1 al 10 en inglés.',
      competency: 'Comprensión Auditiva en Lengua Extranjera',
      instrument: 'Guía de Observación'
    }
  ],
  'INI-INF': [
    {
      id: 'ind-ini-inf-1',
      code: 'IND-INI-INF-1.01',
      description: 'Sigue secuencias de instrucciones lógicas sencillas con comandos direccionales.',
      competency: 'Pensamiento Computacional y Lógica Desenchufada',
      instrument: 'Escala de Estimación'
    }
  ],
  'INI-DH': [
    {
      id: 'ind-ini-dh-1',
      code: 'IND-INI-DH-1.01',
      description: 'Practica la escucha atenta, la empatía y la resolución pacífica de desacuerdos.',
      competency: 'Valores Humanos y Convivencia Afectiva',
      instrument: 'Registro Anecdótico'
    }
  ]
};

export const IndicadoresInicialView: React.FC = () => {
  const {
    areas,
    competencies,
    indicators,
    activeLapso,
    schoolYearConfig,
    addIndicator,
    updateIndicator,
    deleteIndicator,
    addCompetency,
    showToast
  } = useApp();

  // ============================================================================
  // ESTADOS PRINCIPALES DE LA BARRA OFICIAL SEGÚN REFERENCIA:
  // [ Año Escolar ⌄ ] [ Lapso ⌄ ] [ Grado ⌄ ] [ Sección ⌄ ] [ Cargar Materias ]
  // ============================================================================
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>(
    schoolYearConfig?.year || '2025-2026'
  );
  const [selectedLapso, setSelectedLapso] = useState<number>(activeLapso || 1);
  const [selectedGrade, setSelectedGrade] = useState<'Sala de 4 Años' | 'Sala de 5 Años'>('Sala de 4 Años');
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSyncSuccessToast, setShowSyncSuccessToast] = useState<string | null>(null);

  // Filtros de búsqueda
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [indicatorSearchTerm, setIndicatorSearchTerm] = useState<string>('');

  // Navegación en gestión de materias: null = tabla principal de materias, SubjectArea = gestión de esa materia
  const [managingArea, setManagingArea] = useState<SubjectArea | null>(null);

  // Almacenamiento local de indicadores por clave de aula: `${year}_${grade}_${section}_L${lapso}_${areaCode}`
  const [customIndicators, setCustomIndicators] = useState<Record<string, LocalIndicatorRecord[]>>({});

  // Cargar indicadores de localStorage para esta configuración
  useEffect(() => {
    const key = `sisceba_indicadores_ini_${selectedSchoolYear}_${selectedGrade}_${selectedSection}_L${selectedLapso}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setCustomIndicators(JSON.parse(saved));
      } catch (e) {
        console.error('Error cargando indicadores locales:', e);
      }
    }
  }, [selectedSchoolYear, selectedGrade, selectedSection, selectedLapso]);

  // Persistir indicadores locales cuando cambian
  const saveCustomIndicatorsToStorage = (updated: Record<string, LocalIndicatorRecord[]>) => {
    setCustomIndicators(updated);
    const key = `sisceba_indicadores_ini_${selectedSchoolYear}_${selectedGrade}_${selectedSection}_L${selectedLapso}`;
    localStorage.setItem(key, JSON.stringify(updated));
  };

  // Modales
  const [isNewIndicatorModalOpen, setIsNewIndicatorModalOpen] = useState<boolean>(false);
  const [editingIndicator, setEditingIndicator] = useState<LocalIndicatorRecord | null>(null);
  const [deletingIndicatorId, setDeletingIndicatorId] = useState<string | null>(null);
  const [isNewCompetencyModalOpen, setIsNewCompetencyModalOpen] = useState<boolean>(false);
  const [printingArea, setPrintingArea] = useState<SubjectArea | null>(null);

  // Estados de formularios
  const [indFormCode, setIndFormCode] = useState<string>('');
  const [indFormDesc, setIndFormDesc] = useState<string>('');
  const [indFormComp, setIndFormComp] = useState<string>('');
  const [indFormInst, setIndFormInst] = useState<string>('Escala de Estimación');
  const [indFormError, setIndFormError] = useState<string | null>(null);

  const [newCompetencyCode, setNewCompetencyCode] = useState<string>('');
  const [newCompetencyTitle, setNewCompetencyTitle] = useState<string>('');

  // Áreas oficiales del subsistema Inicial
  const inicialAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'INICIAL');
  }, [areas]);

  // Competencias disponibles para el área que se está gestionando
  const availableCompetencies = useMemo<Competency[]>(() => {
    if (!managingArea) return [];
    return (competencies || []).filter(c => {
      const cArea = (c.areaId || '').toLowerCase();
      const mArea = (managingArea.id || '').toLowerCase();
      const mCode = (managingArea.code || '').toLowerCase();
      return (cArea === mArea || cArea === mCode) && c.level === 'INICIAL';
    });
  }, [managingArea, competencies]);

  // Manejador del botón oficial "Cargar Materias"
  const handleCargarMaterias = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const msg = `Materias cargadas para ${selectedGrade} • Sección ${selectedSection} (Lapso ${selectedLapso}, ${selectedSchoolYear}).`;
      setShowSyncSuccessToast(msg);
      showToast('Materias Cargadas', msg);
      setTimeout(() => setShowSyncSuccessToast(null), 3000);
    }, 400);
  };

  // Filtrado de materias en la tabla
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

  // Obtener indicadores unificados para una materia específica en este salón
  const getAreaCurriculum = (area: SubjectArea | null) => {
    if (!area) return [] as LocalIndicatorRecord[];

    const targetAreaId = (area.id || '').toLowerCase();
    const targetCode = (area.code || '').toLowerCase();
    const targetClean = targetCode.replace('ini-', '').replace('-', '');

    // 1. Indicadores persistidos en SICE
    const matchedInds = (indicators || []).filter(ind => {
      if (ind.level && ind.level.toUpperCase() !== 'INICIAL') return false;
      const indArea = (ind.areaId || '').toLowerCase();
      const matchArea =
        indArea === targetAreaId ||
        indArea === targetCode ||
        indArea.includes(targetClean) ||
        targetAreaId.includes(indArea);
      if (!matchArea) return false;
      if (ind.grade && ind.grade.trim().toLowerCase() !== selectedGrade.trim().toLowerCase()) return false;
      if (ind.lapso && Number(ind.lapso) !== Number(selectedLapso)) return false;
      return true;
    });

    const siceItems: LocalIndicatorRecord[] = matchedInds.map(ind => {
      const comp = (competencies || []).find(c => c.id === ind.competencyId);
      return {
        id: ind.id,
        code: ind.code,
        description: ind.description,
        competency: comp?.title || 'Competencias del Área Pedagógica',
        instrument: ind.evaluationInstrument || 'Escala de Estimación'
      };
    });

    // Fallbacks institucionales oficiales
    if (siceItems.length === 0 && area.code === 'INI-FP' && selectedGrade === 'Sala de 4 Años' && Number(selectedLapso) === 1) {
      OFFICIAL_INICIAL_FP4_ITEMS.forEach(it => siceItems.push(it));
    } else if (siceItems.length === 0 && INSTITUTIONAL_INICIAL_OTHER_ITEMS[area.code]) {
      INSTITUTIONAL_INICIAL_OTHER_ITEMS[area.code].forEach(it => siceItems.push(it));
    }

    // Integrar con personalizaciones locales del aula
    const localItems = customIndicators[area.code] || [];
    const localMap = new Map<string, LocalIndicatorRecord>();
    localItems.forEach(loc => localMap.set(loc.id, loc));

    const mergedItems: LocalIndicatorRecord[] = siceItems.map(item => {
      if (localMap.has(item.id)) return localMap.get(item.id)!;
      return item;
    });

    const siceIds = new Set(siceItems.map(i => i.id));
    localItems.forEach(loc => {
      if (!siceIds.has(loc.id)) {
        mergedItems.unshift(loc);
      }
    });

    return mergedItems;
  };

  // Indicadores activos para el área actualmente en gestión
  const activeAreaIndicators = useMemo(() => {
    return getAreaCurriculum(managingArea);
  }, [managingArea, selectedGrade, selectedLapso, selectedSection, indicators, customIndicators]);

  // Indicadores filtrados en el buscador de la materia
  const displayedAreaIndicators = useMemo(() => {
    if (!indicatorSearchTerm.trim()) return activeAreaIndicators;
    const term = indicatorSearchTerm.trim().toLowerCase();
    return activeAreaIndicators.filter(ind => {
      return (
        ind.description.toLowerCase().includes(term) ||
        ind.code.toLowerCase().includes(term) ||
        ind.competency.toLowerCase().includes(term) ||
        ind.instrument.toLowerCase().includes(term)
      );
    });
  }, [activeAreaIndicators, indicatorSearchTerm]);

  // Apertura del modal de nuevo indicador
  const handleOpenNewIndicatorModal = () => {
    if (!managingArea) return;
    const nextSeq = activeAreaIndicators.length + 1;
    setIndFormCode(`IND-${managingArea.code}-${selectedLapso}.${nextSeq < 10 ? '0' + nextSeq : nextSeq}`);
    setIndFormDesc('');
    setIndFormComp(activeAreaIndicators[0]?.competency || 'Competencia Curricular del Área');
    setIndFormInst('Escala de Estimación');
    setIndFormError(null);
    setIsNewIndicatorModalOpen(true);
  };

  // Guardar nuevo indicador
  const handleSaveNewIndicator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingArea) return;

    if (!indFormCode.trim()) {
      setIndFormError('El código del indicador es obligatorio.');
      return;
    }
    if (!indFormDesc.trim()) {
      setIndFormError('La descripción o criterio observable es obligatoria.');
      return;
    }

    const newRec: LocalIndicatorRecord = {
      id: `ind-ini-loc-${Date.now()}`,
      code: indFormCode.trim().toUpperCase(),
      description: indFormDesc.trim(),
      competency: indFormComp.trim() || 'Competencia Curricular',
      instrument: indFormInst
    };

    // Actualizar en AppContext
    addIndicator({
      code: newRec.code,
      competencyId: 'comp-general',
      description: newRec.description,
      areaId: managingArea.id,
      grade: selectedGrade,
      level: 'INICIAL',
      lapso: selectedLapso as 1 | 2 | 3,
      evaluationInstrument: newRec.instrument
    });

    // Guardar en customIndicators
    const currentList = customIndicators[managingArea.code] || activeAreaIndicators;
    const updated = {
      ...customIndicators,
      [managingArea.code]: [newRec, ...currentList]
    };
    saveCustomIndicatorsToStorage(updated);

    showToast(
      'Indicador Registrado',
      `Se agregó el indicador ${newRec.code} a la materia ${managingArea.name} (${selectedGrade} Sec. ${selectedSection}).`
    );
    setIsNewIndicatorModalOpen(false);
  };

  // Guardar edición de indicador
  const handleSaveEditIndicator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingArea || !editingIndicator) return;

    if (!indFormCode.trim()) {
      setIndFormError('El código del indicador es obligatorio.');
      return;
    }
    if (!indFormDesc.trim()) {
      setIndFormError('La descripción es obligatoria.');
      return;
    }

    const updatedRec: LocalIndicatorRecord = {
      ...editingIndicator,
      code: indFormCode.trim().toUpperCase(),
      description: indFormDesc.trim(),
      competency: indFormComp.trim(),
      instrument: indFormInst
    };

    // Actualizar en AppContext si coincide id
    updateIndicator({
      id: updatedRec.id,
      competencyId: 'comp-general',
      code: updatedRec.code,
      description: updatedRec.description,
      areaId: managingArea.id,
      grade: selectedGrade,
      level: 'INICIAL',
      lapso: selectedLapso as 1 | 2 | 3,
      evaluationInstrument: updatedRec.instrument
    });

    const currentList = customIndicators[managingArea.code] || activeAreaIndicators;
    const updatedList = currentList.map(item => (item.id === updatedRec.id ? updatedRec : item));
    const updated = {
      ...customIndicators,
      [managingArea.code]: updatedList
    };
    saveCustomIndicatorsToStorage(updated);

    showToast('Indicador Actualizado', `Se guardaron los cambios del indicador ${updatedRec.code}.`);
    setEditingIndicator(null);
  };

  // Eliminar indicador
  const handleConfirmDelete = () => {
    if (!managingArea || !deletingIndicatorId) return;

    deleteIndicator(deletingIndicatorId);

    const currentList = customIndicators[managingArea.code] || activeAreaIndicators;
    const updatedList = currentList.filter(item => item.id !== deletingIndicatorId);
    const updated = {
      ...customIndicators,
      [managingArea.code]: updatedList
    };
    saveCustomIndicatorsToStorage(updated);

    showToast('Indicador Eliminado', 'El indicador ha sido removido de la planificación de la materia.');
    setDeletingIndicatorId(null);
  };

  // Guardar nueva competencia
  const handleSaveNewCompetency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingArea) return;
    if (!newCompetencyTitle.trim()) return;

    addCompetency({
      code: newCompetencyCode.trim() || `CP-${managingArea.code}-${Date.now().toString().slice(-3)}`,
      title: newCompetencyTitle.trim(),
      description: `Competencia desarrollada para el área de ${managingArea.name}.`,
      areaId: managingArea.id,
      level: 'INICIAL',
      lapso: selectedLapso as 1 | 2 | 3,
      grade: selectedGrade
    });

    setIndFormComp(newCompetencyTitle.trim());
    setIsNewCompetencyModalOpen(false);
    showToast('Competencia Creada', `Se registró la competencia "${newCompetencyTitle.trim()}".`);
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal Informativo CBA */}
      <div className="bg-gradient-to-r from-[#2C2E53] via-[#1E2038] to-[#141525] rounded-2xl p-5 sm:p-6 text-white shadow-md border border-[#3D4066] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#0F1122]/90 text-amber-300 border border-[#D4AF37] shadow-xs">
              Control Curricular Oficial
            </span>
            <span className="text-xs text-amber-200/90 font-medium">
              Educación Inicial • C.E.O. SISCEBA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-white" />
            Indicadores de las Áreas a Valorar
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Gestione y supervise los indicadores de logro, criterios observables y competencias pedagógicas de cada materia por año escolar, lapso, sala y sección.
          </p>
        </div>

        {/* Resumen de aula activa */}
        <div className="flex items-center gap-2 bg-white/10 dark:bg-black/30 border border-white/15 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-100 shrink-0">
          <Layers className="w-4 h-4 text-amber-300" />
          <span>
            {selectedGrade} • Sec. {selectedSection} • L{selectedLapso} • {selectedSchoolYear}
          </span>
        </div>
      </div>

      {/* Toast de confirmación de sincronización */}
      {showSyncSuccessToast && (
        <div className="bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-400 text-emerald-900 dark:text-emerald-200 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-bold shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{showSyncSuccessToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BARRA DE FILTROS C.E.O. EXACTA SEGÚN IMAGEN DE REFERENCIA:               */}
      {/* [ Año Escolar ⌄ ] [ Lapso ⌄ ] [ Grado ⌄ ] [ Sección ⌄ ] [ Cargar Materias ]*/}
      {/* ========================================================================= */}
      <div className="no-print bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border-2 border-slate-300 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* 1. Selector de Año Escolar */}
          <div className="relative">
            <label htmlFor="ref-select-ano-escolar" className="sr-only">
              Año Escolar
            </label>
            <select
              id="ref-select-ano-escolar"
              value={selectedSchoolYear}
              onChange={(e) => setSelectedSchoolYear(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm rounded-xl pl-3.5 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2E53] dark:focus:ring-amber-400 shadow-2xs cursor-pointer"
            >
              <option value="2025-2026">Año Escolar 2025-2026</option>
              <option value="2024-2025">Año Escolar 2024-2025</option>
              <option value="2026-2027">Año Escolar 2026-2027</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 2. Selector de Lapso */}
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

          {/* 3. Selector de Grado (Salas oficiales CBA: 4 y 5 Años - Regla 1) */}
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

          {/* 4. Selector de Sección (Exclusivamente A y B - Regla 4) */}
          <div className="relative">
            <label htmlFor="ref-select-seccion" className="sr-only">
              Sección
            </label>
            <select
              id="ref-select-seccion"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value as 'A' | 'B')}
              className="appearance-none bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm rounded-xl pl-3.5 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2E53] dark:focus:ring-amber-400 shadow-2xs cursor-pointer"
            >
              <option value="A">Sección A</option>
              <option value="B">Sección B</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 5. Botón Cargar Materias */}
          <button
            onClick={handleCargarMaterias}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm rounded-xl border-2 border-slate-300 dark:border-slate-700 shadow-2xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="Cargar materias pedagógicas asociadas a este año escolar, lapso, grado y sección"
          >
            <RotateCw className={`w-3.5 h-3.5 text-amber-600 dark:text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Cargando Materias...' : 'Cargar Materias'}</span>
          </button>
        </div>

        {/* Buscador Rápido de Materias */}
        {!managingArea && (
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filtrar materias o áreas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2E53] dark:focus:ring-amber-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* VISTA 1: TABLA PRINCIPAL DE MATERIAS (Cuando NO está en gestión)*/}
      {/* ============================================================== */}
      {!managingArea ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black text-xs uppercase tracking-wider border-b-2 border-slate-300 dark:border-slate-700">
                  <th className="py-3.5 px-4 sm:px-6 w-[36%]">Materia / Área de Formación</th>
                  <th className="py-3.5 px-4 sm:px-6 w-[34%]">Dimensión y Ámbito Pedagógico</th>
                  <th className="py-3.5 px-4 text-center w-[15%]">Indicadores</th>
                  <th className="py-3.5 px-4 text-center w-[15%]">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-slate-200 dark:divide-slate-800 text-xs text-slate-800 dark:text-slate-200">
                {filteredAreas.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                        No se encontraron materias curriculares.
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Haga clic en <strong>"Cargar Materias"</strong> o ajuste los términos de búsqueda.
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
                    const areaInds = getAreaCurriculum(area);
                    const indCount = areaInds.length;

                    return (
                      <tr
                        key={area.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* Columna 1: Materia */}
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
                            </div>
                          </div>
                        </td>

                        {/* Columna 2: Dimensión */}
                        <td className="py-4 px-4 sm:px-6 align-top">
                          <div className="font-bold text-amber-800 dark:text-amber-300 text-xs">
                            {dimInfo.dimension}
                          </div>
                          <div className="mt-1 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                            {dimInfo.domain}
                          </div>
                        </td>

                        {/* Columna 3: Indicadores Asignados */}
                        <td className="py-4 px-4 text-center align-middle">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
                              indCount > 0
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            <Tag className="w-3 h-3" />
                            <span>{indCount} {indCount === 1 ? 'Indicador' : 'Indicadores'}</span>
                          </span>
                        </td>

                        {/* Columna 4: Acciones */}
                        <td className="py-4 px-4 text-center align-middle">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setManagingArea(area)}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2C2E53] hover:bg-[#1E2038] text-white font-bold rounded-xl text-xs shadow-xs border border-[#2C2E53] transition-all cursor-pointer active:scale-95"
                              title={`Gestionar indicadores de ${area.name}`}
                            >
                              <Settings className="w-3.5 h-3.5 text-amber-300" />
                              <span>Gestionar</span>
                            </button>
                            <button
                              onClick={() => setPrintingArea(area)}
                              className="inline-flex items-center justify-center p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs border-2 border-slate-300 dark:border-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95"
                              title={`Imprimir reporte de indicadores de ${area.name}`}
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
              Mostrando <strong>{filteredAreas.length}</strong> materias curriculares para <strong>{selectedGrade} - Sección {selectedSection}</strong> (Lapso {selectedLapso}, {selectedSchoolYear}).
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              U.E.P. Colegio Bellas Artes • Código DEA S0432D2305
            </span>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* VISTA 2: GESTIÓN DE INDICADORES DE LA MATERIA SELECCIONADA      */
        /* ============================================================== */
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Barra de Acciones de la Materia */}
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

              {/* Botón 2: Nuevo Indicador */}
              <button
                onClick={handleOpenNewIndicatorModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-emerald-600"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Nuevo Indicador</span>
              </button>

              {/* Botón 3: Imprimir */}
              <button
                onClick={() => setPrintingArea(managingArea)}
                className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm rounded-xl border-2 border-slate-300 dark:border-slate-700 shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span>Imprimir Indicadores</span>
              </button>

              {/* Botón 4: Atrás */}
              <button
                onClick={() => {
                  setManagingArea(null);
                  setIndicatorSearchTerm('');
                }}
                className="px-4 py-2 bg-[#2C2E53] hover:bg-[#1E2038] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-[#2C2E53]"
              >
                <ArrowLeft className="w-4 h-4 text-amber-300" />
                <span>Atrás</span>
              </button>
            </div>

            {/* Contexto y Buscador de Indicadores */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative w-full sm:w-64 md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar indicador o criterio..."
                  value={indicatorSearchTerm}
                  onChange={(e) => setIndicatorSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2E53] dark:focus:ring-amber-400 font-medium placeholder:text-slate-400 shadow-2xs transition-all"
                />
                {indicatorSearchTerm && (
                  <button
                    onClick={() => setIndicatorSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-col items-start sm:items-end shrink-0">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                  {managingArea.name} ({managingArea.code})
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700 mt-1">
                  {selectedGrade} • Sec. {selectedSection} • Lapso {selectedLapso} • {selectedSchoolYear}
                </span>
              </div>
            </div>
          </div>

          {/* Tabla de Indicadores de la Materia */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black text-xs uppercase tracking-wider border-b-2 border-slate-300 dark:border-slate-700">
                    <th className="py-3 px-3 sm:px-4 text-center w-12">N°</th>
                    <th className="py-3 px-4 w-36">Código</th>
                    <th className="py-3 px-4 w-[42%]">Indicador de Logro / Criterio Observable</th>
                    <th className="py-3 px-4 w-[24%]">Competencia Asociada</th>
                    <th className="py-3 px-4 w-36">Instrumento</th>
                    <th className="py-3 px-4 text-center w-28">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y-2 divide-slate-200 dark:divide-slate-800 text-xs text-slate-800 dark:text-slate-200">
                  {displayedAreaIndicators.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Tag className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                          No hay indicadores registrados para esta materia en esta sala y sección.
                        </p>
                        <button
                          onClick={handleOpenNewIndicatorModal}
                          className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar Primer Indicador</span>
                        </button>
                      </td>
                    </tr>
                  ) : (
                    displayedAreaIndicators.map((ind, idx) => (
                      <tr
                        key={ind.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-3 px-3 sm:px-4 text-center font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-mono font-black text-slate-900 dark:text-white">
                          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700">
                            {ind.code}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                          {ind.description}
                        </td>
                        <td className="py-3 px-4 font-bold text-amber-800 dark:text-amber-300">
                          {ind.competency}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                          <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 text-[11px] font-bold">
                            {ind.instrument}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setEditingIndicator(ind);
                                setIndFormCode(ind.code);
                                setIndFormDesc(ind.description);
                                setIndFormComp(ind.competency);
                                setIndFormInst(ind.instrument);
                                setIndFormError(null);
                              }}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 transition"
                              title="Modificar indicador"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingIndicatorId(ind.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition"
                              title="Eliminar indicador"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-100/80 dark:bg-slate-800/60 px-5 py-3 border-t-2 border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 dark:text-slate-300 gap-2 font-semibold">
              <span>
                Total: <strong>{displayedAreaIndicators.length}</strong> indicadores en <strong>{managingArea.name}</strong> para <strong>{selectedGrade} Sec. {selectedSection}</strong>.
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                Escala Literal Oficial CBA (A, B, C, D, E)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: NUEVO INDICADOR                                         */}
      {/* ============================================================== */}
      {isNewIndicatorModalOpen && managingArea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Nuevo Indicador de Logro
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {managingArea.name} • {selectedGrade} Sec. {selectedSection} (Lapso {selectedLapso})
                </p>
              </div>
              <button
                onClick={() => setIsNewIndicatorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {indFormError && (
              <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{indFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveNewIndicator} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Código Oficial
                </label>
                <input
                  type="text"
                  value={indFormCode}
                  onChange={(e) => setIndFormCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  placeholder="Ej. IND-INI-FP-1.01"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Competencia Curricular
                </label>
                <input
                  type="text"
                  value={indFormComp}
                  onChange={(e) => setIndFormComp(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  placeholder="Nombre de la competencia pedagógica..."
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Criterio Observable / Descripción del Indicador
                </label>
                <textarea
                  rows={3}
                  value={indFormDesc}
                  onChange={(e) => setIndFormDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53] leading-relaxed"
                  placeholder="Redacte el criterio observable en 3ra persona (ej. 'Reconoce y nombra los colores primarios en objetos del entorno.')."
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Instrumento de Evaluación
                </label>
                <select
                  value={indFormInst}
                  onChange={(e) => setIndFormInst(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                >
                  <option value="Escala de Estimación">Escala de Estimación</option>
                  <option value="Guía de Observación">Guía de Observación</option>
                  <option value="Registro Anecdótico">Registro Anecdótico</option>
                  <option value="Lista de Cotejo">Lista de Cotejo</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t-2 border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewIndicatorModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Indicador</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: MODIFICAR INDICADOR                                     */}
      {/* ============================================================== */}
      {editingIndicator && managingArea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Modificar Indicador de Logro
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {managingArea.name} • {selectedGrade} Sec. {selectedSection}
                </p>
              </div>
              <button
                onClick={() => setEditingIndicator(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {indFormError && (
              <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{indFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditIndicator} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Código
                </label>
                <input
                  type="text"
                  value={indFormCode}
                  onChange={(e) => setIndFormCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Competencia Asociada
                </label>
                <input
                  type="text"
                  value={indFormComp}
                  onChange={(e) => setIndFormComp(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Criterio Observable / Descripción
                </label>
                <textarea
                  rows={3}
                  value={indFormDesc}
                  onChange={(e) => setIndFormDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Instrumento de Evaluación
                </label>
                <select
                  value={indFormInst}
                  onChange={(e) => setIndFormInst(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                >
                  <option value="Escala de Estimación">Escala de Estimación</option>
                  <option value="Guía de Observación">Guía de Observación</option>
                  <option value="Registro Anecdótico">Registro Anecdótico</option>
                  <option value="Lista de Cotejo">Lista de Cotejo</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t-2 border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingIndicator(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C2E53] hover:bg-[#1E2038] text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CONFIRMAR ELIMINACIÓN                                   */}
      {/* ============================================================== */}
      {deletingIndicatorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-300">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Confirmar Eliminación
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ¿Está seguro de remover este indicador de la materia?
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              Esta acción eliminará el criterio de evaluación de la planificación de {selectedGrade} Sección {selectedSection} para el Lapso {selectedLapso}.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingIndicatorId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm"
              >
                Eliminar Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: NUEVA COMPETENCIA                                       */}
      {/* ============================================================== */}
      {isNewCompetencyModalOpen && managingArea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Nueva Competencia Pedagógica
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {managingArea.name} ({managingArea.code})
                </p>
              </div>
              <button
                onClick={() => setIsNewCompetencyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewCompetency} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Código de la Competencia
                </label>
                <input
                  type="text"
                  value={newCompetencyCode}
                  onChange={(e) => setNewCompetencyCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  placeholder="Ej. CP-INI-FP-01"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Título de la Competencia
                </label>
                <input
                  type="text"
                  value={newCompetencyTitle}
                  onChange={(e) => setNewCompetencyTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  placeholder="Ej. Reconocimiento y cuidado personal..."
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t-2 border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewCompetencyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Competencia</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: IMPRIMIR FICHA OFICIAL DE INDICADORES                   */}
      {/* ============================================================== */}
      {printingArea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-4xl w-full p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between no-print border-b pb-4">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#2C2E53]" />
                <h3 className="text-base font-black text-[#2C2E53]">
                  Vista Previa de Impresión Oficial CBA
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#2C2E53] text-[#D4AF37] hover:bg-[#1E2038] font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Documento</span>
                </button>
                <button
                  onClick={() => setPrintingArea(null)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cerrar
                </button>
              </div>
            </div>

            {/* Documento Imprimible */}
            <div className="space-y-4 text-xs font-sans">
              <div className="text-center border-b pb-3 space-y-0.5">
                <div className="text-[11px] font-bold tracking-wider uppercase text-slate-700">
                  República Bolivariana de Venezuela • Ministerio del Poder Popular para la Educación
                </div>
                <div className="text-base font-black text-[#2C2E53] tracking-wide">
                  UNIDAD EDUCATIVA PRIVADA COLEGIO BELLAS ARTES
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  Inscrito en el M.P.P.E. • Código DEA: S0432D2305 • Maracaibo, Estado Zulia
                </div>
                <div className="mt-2 inline-block px-3 py-1 rounded bg-slate-100 font-black text-slate-800 text-[11px]">
                  MATRIZ OFICIAL DE INDICADORES DE EVALUACIÓN • EDUCACIÓN INICIAL
                </div>
              </div>

              {/* Ficha técnica */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border text-[11px]">
                <div>
                  <span className="font-bold text-slate-500">Materia / Área:</span>{' '}
                  <span className="font-extrabold text-slate-900">{printingArea.name}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500">Código:</span>{' '}
                  <span className="font-mono font-bold text-slate-900">{printingArea.code}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500">Sala y Sección:</span>{' '}
                  <span className="font-extrabold text-slate-900">{selectedGrade} - Sec. "{selectedSection}"</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500">Lapso y Año:</span>{' '}
                  <span className="font-bold text-slate-900">Lapso {selectedLapso} • {selectedSchoolYear}</span>
                </div>
              </div>

              {/* Tabla de criterios */}
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                    <th className="p-2 border-r border-slate-300 text-center w-10">N°</th>
                    <th className="p-2 border-r border-slate-300 w-28">Código</th>
                    <th className="p-2 border-r border-slate-300">Criterio Observable / Indicador de Logro</th>
                    <th className="p-2 border-r border-slate-300 w-44">Competencia Asociada</th>
                    <th className="p-2 text-center w-28">Instrumento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {getAreaCurriculum(printingArea).map((item, i) => (
                    <tr key={item.id}>
                      <td className="p-2 border-r border-slate-300 text-center font-bold text-slate-600">{i + 1}</td>
                      <td className="p-2 border-r border-slate-300 font-mono font-bold text-slate-800">{item.code}</td>
                      <td className="p-2 border-r border-slate-300 font-medium text-slate-900">{item.description}</td>
                      <td className="p-2 border-r border-slate-300 text-slate-700">{item.competency}</td>
                      <td className="p-2 text-center text-slate-600">{item.instrument}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Firmas institucionales */}
              <div className="pt-10 grid grid-cols-3 gap-6 text-center text-[10px]">
                <div>
                  <div className="border-b border-slate-800 w-36 mx-auto mb-1"></div>
                  <div className="font-bold">Profesor/a de Aula</div>
                  <div className="text-slate-500">Docente Titular Inicial</div>
                </div>
                <div>
                  <div className="border-b border-slate-800 w-36 mx-auto mb-1"></div>
                  <div className="font-bold">Prof. Rigoberto Boscán</div>
                  <div className="text-slate-500">Coordinación de Control de Estudios (UCE)</div>
                </div>
                <div>
                  <div className="border-b border-slate-800 w-36 mx-auto mb-1"></div>
                  <div className="font-bold">Dra. Carmen Cecilia Boscán</div>
                  <div className="text-slate-500">Dirección General U.E.P. Bellas Artes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
