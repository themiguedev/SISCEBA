import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Indicator, SubjectArea, LEVEL_GRADES_CATALOG } from '../../types';
import { exportReportToExcel } from '../../utils/excelExport';
import {
  Tag,
  ChevronDown,
  RotateCw,
  Search,
  Plus,
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
  Layers,
  Filter,
  FileSpreadsheet,
  Copy
} from 'lucide-react';

const PRIMARIA_AREA_ICON_MAP: Record<string, React.ElementType> = {
  'PRI-LEN': BookOpen,
  'PRI-MAT': Sparkles,
  'PRI-NAT': Globe,
  'PRI-SOC': Globe,
  'PRI-ART': Palette,
  'PRI-MUS': Music,
  'PRI-EF': Activity,
  'PRI-AJE': Award,
  'PRI-NAT-ACU': Waves,
  'PRI-ING': Languages,
  'PRI-INF': Monitor,
  'PRI-VAL': Heart
};

// Semilla oficial institucional para áreas de Educación Primaria CBA
const INSTITUTIONAL_PRIMARIA_ITEMS: Record<string, { code: string; description: string; competency: string; instrument: string }[]> = {
  'PRI-LEN': [
    {
      code: 'IND-PRI-LEN-1.01',
      description: 'Lee textos narrativos breves con fluidez, entonación adecuada y comprensión literal del argumento.',
      competency: 'Comprensión Lectora y Fluidez Verbal',
      instrument: 'Escala de Estimación Cualitativa'
    },
    {
      code: 'IND-PRI-LEN-1.02',
      description: 'Aplica reglas ortográficas básicas, signos de puntuación y uso correcto de mayúsculas en producciones escritas.',
      competency: 'Producción Escrita y Gramática',
      instrument: 'Registro Descriptivo'
    },
    {
      code: 'IND-PRI-LEN-1.03',
      description: 'Expresa opiniones fundamentadas en asambleas de aula respetando turnos de palabra y el punto de vista ajeno.',
      competency: 'Intercambio Oral y Escucha Activa',
      instrument: 'Guía de Observación'
    }
  ],
  'PRI-MAT': [
    {
      code: 'IND-PRI-MAT-1.01',
      description: 'Resuelve problemas aditivos y multiplicativos contextualizados en situaciones cotidianas con cálculo mental y escrito.',
      competency: 'Pensamiento Lógico-Matemático y Operaciones',
      instrument: 'Escala de Estimación Cualitativa'
    },
    {
      code: 'IND-PRI-MAT-1.02',
      description: 'Reconoce y clasifica figuras bidimensionales y cuerpos geométricos según número de lados, vértices y propiedades.',
      competency: 'Geometría y Medición Espacial',
      instrument: 'Lista de Cotejo'
    },
    {
      code: 'IND-PRI-MAT-1.03',
      description: 'Interpreta y elabora tablas de datos y gráficos de barras sencillos con datos de su entorno escolar.',
      competency: 'Estadística y Manejo de Información',
      instrument: 'Registro Descriptivo'
    }
  ],
  'PRI-NAT': [
    {
      code: 'IND-PRI-NAT-1.01',
      description: 'Identifica la estructura y funciones de los sistemas del cuerpo humano y promueve hábitos de vida saludable.',
      competency: 'Ciencias de la Vida y Salud Integral',
      instrument: 'Escala de Estimación Cualitativa'
    },
    {
      code: 'IND-PRI-NAT-1.02',
      description: 'Aplica el método científico experimental formulando hipótesis sencillas y registrando observaciones sistemáticas.',
      competency: 'Indagación Científica y Experimentación',
      instrument: 'Rúbrica Cualitativa'
    }
  ],
  'PRI-SOC': [
    {
      code: 'IND-PRI-SOC-1.01',
      description: 'Reconoce efemérides patrias, próceres y hechos trascendentales de la historia de Venezuela y de la región zuliana.',
      competency: 'Identidad Histórica y Ciudadanía',
      instrument: 'Escala de Estimación Cualitativa'
    },
    {
      code: 'IND-PRI-SOC-1.02',
      description: 'Ubica en mapas físicos y políticos los estados de Venezuela, sus límites cardinales y recursos geográficos.',
      competency: 'Geografía y Conciencia Territorial',
      instrument: 'Registro Descriptivo'
    }
  ],
  'PRI-ING': [
    {
      code: 'IND-PRI-ING-1.01',
      description: 'Comprende y produce vocabulario temático en inglés sobre rutinas escolares, familia y emociones con pronunciación clara.',
      competency: 'Comunicación Bilingüe CBA',
      instrument: 'Escala de Estimación Cualitativa'
    }
  ],
  'PRI-INF': [
    {
      code: 'IND-PRI-INF-1.01',
      description: 'Diseña algoritmos secuenciales mediante programación en bloques y ensambla prototipos robóticos básicos.',
      competency: 'Pensamiento Computacional y Robótica STEAM',
      instrument: 'Rúbrica Cualitativa'
    }
  ]
};

export const IndicadoresPrimariaView: React.FC = () => {
  const {
    levelAreas,
    competencies,
    indicators,
    activeLapso,
    currentRole,
    addIndicator,
    updateIndicator,
    deleteIndicator,
    showToast
  } = useApp();

  // Estados de filtros C.E.O.
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>('2025-2026');
  const [selectedLapso, setSelectedLapso] = useState<number>(activeLapso || 1);
  const [selectedGrade, setSelectedGrade] = useState<string>('1er Grado');
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Estados de modales
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null);
  const [selectedAreaForNew, setSelectedAreaForNew] = useState<string>('');

  // Formulario
  const [formCode, setFormCode] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formCompetencyTitle, setFormCompetencyTitle] = useState<string>('');
  const [formInstrument, setFormInstrument] = useState<string>('Escala de Estimación Cualitativa');

  // Áreas pertenecientes a Educación Primaria
  const primariaAreas = useMemo(() => {
    const fromContext = levelAreas.filter(a => a.level === 'PRIMARIA');
    if (fromContext.length > 0) return fromContext;

    // Fallback defensivo institucional
    return [
      { id: 'pri-len', code: 'PRI-LEN', name: 'Lenguaje y Comunicación', level: 'PRIMARIA', type: 'REGULAR', weeklyHours: 8 },
      { id: 'pri-mat', code: 'PRI-MAT', name: 'Matemática para la Vida', level: 'PRIMARIA', type: 'REGULAR', weeklyHours: 7 },
      { id: 'pri-nat', code: 'PRI-NAT', name: 'Ciencias Naturales y Sociedad', level: 'PRIMARIA', type: 'REGULAR', weeklyHours: 4 },
      { id: 'pri-soc', code: 'PRI-SOC', name: 'Ciencias Sociales e Identidad', level: 'PRIMARIA', type: 'REGULAR', weeklyHours: 4 },
      { id: 'pri-art', code: 'PRI-ART', name: 'Educación Estética: Artes Plásticas', level: 'PRIMARIA', type: 'REGULAR', weeklyHours: 2 },
      { id: 'pri-mus', code: 'PRI-MUS', name: 'Educación Estética: Música', level: 'PRIMARIA', type: 'REGULAR', weeklyHours: 2 },
      { id: 'pri-ef', code: 'PRI-EF', name: 'Educación Física y Deporte', level: 'PRIMARIA', type: 'REGULAR', weeklyHours: 3 },
      { id: 'pri-aje', code: 'PRI-AJE', name: 'Ajedrez Escolar (Integrada)', level: 'PRIMARIA', type: 'INTEGRADA', weeklyHours: 2 },
      { id: 'pri-ing', code: 'PRI-ING', name: 'Inglés CBA (Integrada)', level: 'PRIMARIA', type: 'INTEGRADA', weeklyHours: 4 },
      { id: 'pri-inf', code: 'PRI-INF', name: 'Computación y Robótica STEAM', level: 'PRIMARIA', type: 'INTEGRADA', weeklyHours: 2 },
      { id: 'pri-val', code: 'PRI-VAL', name: 'Desarrollo Humano y Valores CBA', level: 'PRIMARIA', type: 'INTEGRADA', weeklyHours: 1 }
    ] as SubjectArea[];
  }, [levelAreas]);

  // Consolidar indicadores de primaria del contexto con la base institucional
  const allPrimariaIndicators = useMemo(() => {
    const list: { id: string; areaId: string; code: string; description: string; competency: string; instrument: string; grade?: string }[] = [];

    // Indicadores existentes en contexto
    indicators.filter(i => i.level === 'PRIMARIA').forEach(ind => {
      const comp = competencies.find(c => c.id === ind.competencyId);
      list.push({
        id: ind.id,
        areaId: ind.areaId,
        code: ind.code,
        description: ind.description,
        competency: comp?.title || 'Competencia Curricular Oficial',
        instrument: ind.evaluationInstrument || 'Escala de Estimación Cualitativa',
        grade: ind.grade
      });
    });

    // Semillas institucionales por área si el contexto no tiene registros
    primariaAreas.forEach(area => {
      const existingInArea = list.filter(i => i.areaId === area.id);
      if (existingInArea.length === 0) {
        const seedItems = INSTITUTIONAL_PRIMARIA_ITEMS[area.code] || [];
        seedItems.forEach((seed, idx) => {
          list.push({
            id: `seed-${area.code.toLowerCase()}-${idx + 1}`,
            areaId: area.id,
            code: seed.code,
            description: seed.description,
            competency: seed.competency,
            instrument: seed.instrument,
            grade: selectedGrade
          });
        });
      }
    });

    return list;
  }, [indicators, competencies, primariaAreas, selectedGrade]);

  // Abrir modal de nuevo indicador
  const handleOpenNew = (areaId?: string) => {
    const targetArea = areaId || primariaAreas[0]?.id || '';
    setSelectedAreaForNew(targetArea);
    const area = primariaAreas.find(a => a.id === targetArea);
    const areaCode = area?.code || 'PRI-GEN';
    const nextNum = allPrimariaIndicators.filter(i => i.areaId === targetArea).length + 1;
    setFormCode(`IND-${areaCode}-${selectedGrade.replace(/\D/g, '') || '1'}.${nextNum < 10 ? '0' : ''}${nextNum}`);
    setFormDescription('');
    setFormCompetencyTitle('Comprensión y Aplicación Curricular');
    setFormInstrument('Escala de Estimación Cualitativa');
    setIsNewModalOpen(true);
  };

  // Guardar nuevo indicador
  const handleSaveNew = async () => {
    if (!formDescription.trim()) {
      showToast('Error', 'Ingrese la descripción del indicador.', 'error');
      return;
    }

    const newInd: Indicator = {
      id: `ind-pri-${Date.now()}`,
      competencyId: `comp-pri-${selectedAreaForNew}`,
      areaId: selectedAreaForNew,
      code: formCode.trim() || `IND-${Date.now()}`,
      description: formDescription.trim(),
      weight: 25,
      level: 'PRIMARIA',
      grade: selectedGrade,
      lapso: (selectedLapso as 1 | 2 | 3) || 1,
      evaluationInstrument: formInstrument
    };

    try {
      await addIndicator(newInd);
      showToast('Indicador Creado', `Se registró el criterio ${newInd.code} para ${selectedGrade}.`);
      setIsNewModalOpen(false);
    } catch {
      showToast('Error', 'No se pudo guardar el indicador.', 'error');
    }
  };

  // Abrir modal de edición
  const handleOpenEdit = (ind: any) => {
    setEditingIndicator(ind);
    setFormCode(ind.code);
    setFormDescription(ind.description);
    setFormCompetencyTitle(ind.competency);
    setFormInstrument(ind.instrument);
  };

  // Guardar edición
  const handleSaveEdit = async () => {
    if (!editingIndicator) return;

    const updated: Indicator = {
      id: editingIndicator.id,
      competencyId: editingIndicator.competencyId || 'comp-default',
      areaId: editingIndicator.areaId,
      code: formCode.trim(),
      description: formDescription.trim(),
      weight: 25,
      level: 'PRIMARIA',
      grade: selectedGrade,
      lapso: (selectedLapso as 1 | 2 | 3) || 1,
      evaluationInstrument: formInstrument
    };

    try {
      await updateIndicator(updated);
      showToast('Indicador Actualizado', `Se guardaron los cambios de ${updated.code}.`);
      setEditingIndicator(null);
    } catch {
      showToast('Error', 'No se pudo actualizar el indicador.', 'error');
    }
  };

  // Eliminar indicador
  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`¿Desea eliminar el indicador ${code}?`)) {
      try {
        await deleteIndicator(id);
        showToast('Indicador Eliminado', `Se eliminó ${code} correctamente.`);
      } catch {
        showToast('Error', 'No se pudo eliminar el indicador.', 'error');
      }
    }
  };

  // Exportar sábana oficial en Excel según Rule 8 de GEMINI.md
  const handleExportExcel = () => {
    const data: (string | number)[][] = [];

    primariaAreas.forEach(area => {
      const areaIndicators = allPrimariaIndicators.filter(i => i.areaId === area.id);
      areaIndicators.forEach((ind, idx) => {
        data.push([
          idx + 1,
          area.name,
          ind.code,
          ind.competency,
          ind.description,
          ind.instrument,
          'L, A, P, I'
        ]);
      });
    });

    exportReportToExcel({
      title: 'SÁBANA INSTITUCIONAL DE INDICADORES DE EVALUACIÓN',
      subtitle: 'MATRIZ OFICIAL DE CRITERIOS CURRICULARES DE EDUCACIÓN PRIMARIA',
      schoolYear: selectedSchoolYear,
      lapso: selectedLapso,
      grade: selectedGrade,
      section: selectedSection,
      level: 'EDUCACIÓN PRIMARIA',
      filename: `SABANA_INDICADORES_PRIMARIA_${selectedGrade.replace(/\s+/g, '_')}_SEC_${selectedSection}_L${selectedLapso}.xls`,
      columns: [
        { header: 'N°', width: 6, align: 'center' },
        { header: 'Área de Formación', width: 25, align: 'left' },
        { header: 'Código', width: 18, align: 'center' },
        { header: 'Competencia Curricular', width: 30, align: 'left' },
        { header: 'Criterio Observable (Indicador)', width: 45, align: 'left' },
        { header: 'Instrumento Evaluativo', width: 25, align: 'left' },
        { header: 'Escala Cualitativa', width: 18, align: 'center' }
      ],
      data,
      signatures: [
        { title: 'Docente Titular de Aula' },
        { title: 'Coordinación de Primaria' },
        { title: 'Dirección General' }
      ]
    });

    showToast('Sábana Excel Generada', 'Libro oficial de indicadores descargado en formato Excel.', 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* BANNER PRINCIPAL EXACTO SEGÚN IMAGEN DE REFERENCIA INSTITUCIONAL CBA      */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#2C2E53] via-[#1E2038] to-[#141525] rounded-2xl p-5 sm:p-6 text-white shadow-md border border-[#3D4066] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#0F1122]/90 text-amber-300 border border-[#D4AF37] shadow-xs">
              Control Curricular Oficial
            </span>
            <span className="text-xs text-amber-200/90 font-medium">
              Educación Primaria • C.E.O. SISCEBA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-white" />
            Indicadores de las Áreas a Valorar
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Gestione y supervise los indicadores de logro, criterios observables y competencias pedagógicas de cada materia por año escolar, lapso, grado y sección.
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

      {/* ========================================================================= */}
      {/* BARRA DE FILTROS C.E.O. EXACTA SEGÚN IMAGEN DE REFERENCIA:               */}
      {/* [ Año Escolar ⌄ ] [ Lapso ⌄ ] [ Grado ⌄ ] [ Sección ⌄ ] [ + Nuevo ]      */}
      {/* ========================================================================= */}
      <div className="no-print bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border-2 border-slate-300 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* 1. Selector de Año Escolar */}
          <div className="relative">
            <select
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
            <select
              value={selectedLapso}
              onChange={(e) => setSelectedLapso(Number(e.target.value))}
              className="appearance-none bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm rounded-xl pl-3.5 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2E53] dark:focus:ring-amber-400 shadow-2xs cursor-pointer"
            >
              <option value={1}>1er Lapso</option>
              <option value={2}>2do Lapso</option>
              <option value={3}>3er Lapso</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 3. Selector de Grado (Exclusivamente Primaria de 1er a 6to Grado) */}
          <div className="relative">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm rounded-xl pl-3.5 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2E53] dark:focus:ring-amber-400 shadow-2xs cursor-pointer"
            >
              {LEVEL_GRADES_CATALOG.PRIMARIA.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 4. Selector de Sección (Exclusivamente Secciones A y B según GEMINI.md) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700">
            {(['A', 'B'] as const).map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedSection(sec)}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition cursor-pointer ${
                  selectedSection === sec
                    ? 'bg-[#2C2E53] text-[#D4AF37] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sección {sec}
              </button>
            ))}
          </div>

          {/* Buscador Rápido */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar indicador o criterio..."
              className="pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-medium text-slate-800 dark:text-white w-48 sm:w-60 focus:outline-none focus:border-[#2C2E53]"
            />
          </div>
        </div>

        {/* Botones de Acción Oficial */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border-2 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700 transition cursor-pointer"
            title="Exportar en formato oficial Excel con membrete institucional"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Sábana Excel</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenNew()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-[#2C2E53] text-[#D4AF37] hover:bg-[#1E2038] shadow-sm transition cursor-pointer border border-[#D4AF37]/30"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Indicador</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CATÁLOGO DE ÁREAS DE FORMACIÓN Y CRITERIOS OBSERVABLES DE PRIMARIA         */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {primariaAreas.map((area) => {
          const AreaIcon = PRIMARIA_AREA_ICON_MAP[area.code] || BookOpen;
          const areaIndicators = allPrimariaIndicators.filter(i => {
            const matchesArea = i.areaId === area.id;
            const matchesSearch = !searchTerm ||
              i.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
              i.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              i.competency.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesArea && matchesSearch;
          });

          return (
            <div
              key={area.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden"
            >
              {/* Encabezado del Área de Formación */}
              <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 flex items-center justify-center font-bold border-2 border-amber-300 dark:border-amber-600 shrink-0">
                    <AreaIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                        {area.code}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {area.type === 'INTEGRADA' ? 'Materia Integrada CBA' : 'Pensum Regular'}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {area.weeklyHours}h / sem
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#2C2E53] dark:text-white mt-0.5">
                      {area.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs font-bold text-slate-500">
                    {areaIndicators.length} {areaIndicators.length === 1 ? 'criterio' : 'criterios'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenNew(area.id)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                    title={`Agregar indicador a ${area.name}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lista de Indicadores del Área */}
              <div className="p-4 sm:p-5">
                {areaIndicators.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs italic">
                    No se han registrado criterios formativos para esta área en {selectedGrade}.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {areaIndicators.map((ind) => (
                      <div
                        key={ind.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between gap-3 shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[11px] font-mono font-black text-[#2C2E53] dark:text-[#D4AF37] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                              {ind.code}
                            </span>
                            <span className="text-[10px] font-black text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                              Escala: L • A • P • I
                            </span>
                          </div>

                          <div className="text-[11px] font-bold text-slate-500 mb-1">
                            {ind.competency}
                          </div>

                          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                            {ind.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-slate-400 font-medium">
                            {ind.instrument}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(ind)}
                              className="p-1 rounded text-slate-400 hover:text-[#2C2E53] dark:hover:text-white transition cursor-pointer"
                              title="Editar criterio"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(ind.id, ind.code)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 transition cursor-pointer"
                              title="Eliminar criterio"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODAL DE CREACIÓN / EDICIÓN DE INDICADORES DE PRIMARIA                     */}
      {/* ========================================================================= */}
      {(isNewModalOpen || editingIndicator) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border-2 border-slate-300 dark:border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-base font-black text-[#2C2E53] dark:text-white">
                  {editingIndicator ? 'Editar Criterio de Primaria' : 'Nuevo Indicador Curricular'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsNewModalOpen(false);
                  setEditingIndicator(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Código */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Código Oficial del Indicador
                </label>
                <input
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold"
                />
              </div>

              {/* Competencia */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Competencia Curricular
                </label>
                <input
                  type="text"
                  value={formCompetencyTitle}
                  onChange={(e) => setFormCompetencyTitle(e.target.value)}
                  placeholder="Ej: Comprensión Lectora y Expresión Escrita"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Descripción Observable (Verbo en 3ra persona)
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Redacte el criterio observable con mayúscula inicial y punto final..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                />
              </div>

              {/* Instrumento y Escala */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Instrumento Evaluativo
                  </label>
                  <select
                    value={formInstrument}
                    onChange={(e) => setFormInstrument(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  >
                    <option value="Escala de Estimación Cualitativa">Escala de Estimación Cualitativa</option>
                    <option value="Registro Descriptivo">Registro Descriptivo</option>
                    <option value="Rúbrica Cualitativa">Rúbrica Cualitativa</option>
                    <option value="Guía de Observación">Guía de Observación</option>
                    <option value="Lista de Cotejo">Lista de Cotejo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Escala Oficial Primaria
                  </label>
                  <div className="w-full px-3 py-2 text-xs rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 font-bold text-teal-900 dark:text-teal-200">
                    L • A • P • I (Cualitativa)
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsNewModalOpen(false);
                  setEditingIndicator(null);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={editingIndicator ? handleSaveEdit : handleSaveNew}
                className="px-4 py-2 text-xs font-black bg-[#2C2E53] text-[#D4AF37] hover:bg-[#1E2038] rounded-xl shadow-xs cursor-pointer border border-[#D4AF37]/30"
              >
                Guardar Criterio
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
