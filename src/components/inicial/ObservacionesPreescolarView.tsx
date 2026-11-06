import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  FileText,
  Save,
  Printer,
  Users,
  Smile,
  AlertCircle,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  Search,
  MessageSquare,
  Copy,
  Check,
  X,
  ClipboardList,
  Eye,
  LayoutGrid
} from 'lucide-react';

export interface PreschoolObservation {
  adaptationStatus: 'ADAPTACION_PLENA' | 'EN_PROCESO' | 'ACOMPANAMIENTO_PRIORITARIO';
  bulletinObservation: string;
  strengthsSummary: string;
  motorDevelopmentObs: string;
  languageCognitiveObs: string;
  socioemotionalObs: string;
  recommendationsHome: string;
  updatedAt: string;
}

// Banco Institucional de Frases Sugeridas para el Boletín de Educación Inicial CBA
interface ObservationPhrase {
  id: string;
  category: 'ADAPTACION' | 'COGNICION' | 'PSICOMOTRIZ' | 'SOCIOEMOCIONAL' | 'HOGAR';
  categoryLabel: string;
  text: string;
}

const PREESCOLAR_PHRASES_BANK: ObservationPhrase[] = [
  {
    id: 'ph-ad-1',
    category: 'ADAPTACION',
    categoryLabel: 'Adaptación y Rutina',
    text: 'Evidencia una adaptación plena y autónoma a la rutina escolar diaria, integrándose con entusiasmo y alegría.'
  },
  {
    id: 'ph-ad-2',
    category: 'ADAPTACION',
    categoryLabel: 'Adaptación y Rutina',
    text: 'Participa activamente en la asamblea de bienvenida, atiende con respeto las indicaciones de transición y colabora en el momento de recuento.'
  },
  {
    id: 'ph-ad-3',
    category: 'ADAPTACION',
    categoryLabel: 'Adaptación y Rutina',
    text: 'Se encuentra en un proceso favorable de adaptación al aula, mostrando creciente seguridad en sus elecciones de trabajo en los rincones.'
  },
  {
    id: 'ph-cog-1',
    category: 'COGNICION',
    categoryLabel: 'Desarrollo Cognitivo y Lenguaje',
    text: 'Identifica y relaciona nociones lógico-matemáticas (formas geométricas, colores, tamaños y cuantificadores) mediante actividades lúdicas.'
  },
  {
    id: 'ph-cog-2',
    category: 'COGNICION',
    categoryLabel: 'Desarrollo Cognitivo y Lenguaje',
    text: 'Construye oraciones completas y formula preguntas con marcada curiosidad científica durante las experiencias de aprendizaje guiado.'
  },
  {
    id: 'ph-cog-3',
    category: 'COGNICION',
    categoryLabel: 'Desarrollo Cognitivo y Lenguaje',
    text: 'Muestra interés permanente por los textos y cuentos ilustrados, anticipando secuencias y expresando verbalmente sus vivencias.'
  },
  {
    id: 'ph-psi-1',
    category: 'PSICOMOTRIZ',
    categoryLabel: 'Desarrollo Psicomotor',
    text: 'Desarrolla adecuado agarre en pinza digital y precisión en el rasgado, ensartado, modelado de plastilina y coloreado delimitado.'
  },
  {
    id: 'ph-psi-2',
    category: 'PSICOMOTRIZ',
    categoryLabel: 'Desarrollo Psicomotor',
    text: 'Demuestra notable coordinación, equilibrio dinámico y control corporal en actividades de saltos, giros y circuitos psicomotores.'
  },
  {
    id: 'ph-soc-1',
    category: 'SOCIOEMOCIONAL',
    categoryLabel: 'Convivencia y Afectividad',
    text: 'Comparte espontáneamente materiales didácticos con sus compañeros, practica normas de cortesía y respeta turnos en juegos colectivos.'
  },
  {
    id: 'ph-soc-2',
    category: 'SOCIOEMOCIONAL',
    categoryLabel: 'Convivencia y Afectividad',
    text: 'Comunica asertivamente sus emociones y necesidades, manifestando empatía y solidaridad en situaciones cotidianas de aula.'
  },
  {
    id: 'ph-hog-1',
    category: 'HOGAR',
    categoryLabel: 'Orientaciones para el Hogar',
    text: 'Se sugiere continuar fortaleciendo la lectura de cuentos antes de dormir y propiciar momentos de diálogo familiar sobre su jornada escolar.'
  },
  {
    id: 'ph-hog-2',
    category: 'HOGAR',
    categoryLabel: 'Orientaciones para el Hogar',
    text: 'Recomendamos seguir estimulando la autonomía en hábitos de vestido, aseo personal y orden de sus juguetes y pertenencias.'
  }
];

export const ObservacionesPreescolarView: React.FC = () => {
  const { students, activeLapso, showToast } = useApp();

  // Estados de la Barra Oficial de Filtros según requerimiento C.E.O.
  // Inician vacíos para mostrar el placeholder exactamente como en la captura
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>('');
  const [selectedLapso, setSelectedLapso] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<'A' | 'B' | ''>('');

  // Estado de carga y confirmación de nómina activa
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Parámetros confirmados tras pulsar "Cargar Estudiantes"
  const [loadedFilters, setLoadedFilters] = useState<{
    year: string;
    lapso: 1 | 2 | 3;
    grade: string;
    section: 'A' | 'B';
  }>({
    year: '2026 - 2027',
    lapso: (activeLapso as 1 | 2 | 3) || 1,
    grade: 'Sala de 4 Años',
    section: 'A'
  });

  // Modalidad de vista: 'TABLA' (masiva) o 'FICHA' (individual detallada)
  const [viewMode, setViewMode] = useState<'TABLA' | 'FICHA'>('TABLA');

  // Búsqueda rápida de infante en nómina
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Estudiante activo para ficha individual o inserción de frases
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // Modal del Banco de Frases Institucionales
  const [isPhraseBankOpen, setIsPhraseBankOpen] = useState<boolean>(false);
  const [phraseCategoryFilter, setPhraseCategoryFilter] = useState<string>('TODAS');
  const [targetStudentForPhrase, setTargetStudentForPhrase] = useState<string | null>(null);
  const [copiedPhraseId, setCopiedPhraseId] = useState<string | null>(null);

  // Registro de observaciones por estudiante: { [studentId]: PreschoolObservation }
  const [observations, setObservations] = useState<Record<string, PreschoolObservation>>({});

  // Cargar datos persistidos en localStorage según los filtros activos confirmados
  useEffect(() => {
    if (!isLoaded) return;
    const storageKey = `sisceba_obs_preescolar_${loadedFilters.grade}_${loadedFilters.section}_L${loadedFilters.lapso}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setObservations(parsed);
      } catch (err) {
        console.error('Error al cargar observaciones preescolar:', err);
      }
    }
  }, [isLoaded, loadedFilters]);

  // Filtrar estudiantes pertenecientes al grado, sección y nivel Inicial confirmados
  const targetStudents = useMemo(() => {
    if (!isLoaded) return [];
    return students.filter(
      s => s.level === 'INICIAL' && s.grade === loadedFilters.grade && s.section === loadedFilters.section
    );
  }, [students, isLoaded, loadedFilters]);

  // Filtrado por buscador rápido
  const displayedStudents = useMemo(() => {
    if (!searchTerm.trim()) return targetStudents;
    const term = searchTerm.toLowerCase().trim();
    return targetStudents.filter(
      s =>
        s.fullName.toLowerCase().includes(term) ||
        s.cedula.toLowerCase().includes(term) ||
        (s.studentIdNumber && s.studentIdNumber.toLowerCase().includes(term))
    );
  }, [targetStudents, searchTerm]);

  // Asegurar selección de estudiante activo
  useEffect(() => {
    if (targetStudents.length > 0 && !targetStudents.some(s => s.id === selectedStudentId)) {
      setSelectedStudentId(targetStudents[0].id);
    }
  }, [targetStudents, selectedStudentId]);

  const activeStudent = targetStudents.find(s => s.id === selectedStudentId);

  // Obtener la observación de un estudiante con valores por defecto institucional
  const getStudentObs = (studentId: string): PreschoolObservation => {
    if (observations[studentId]) {
      return observations[studentId];
    }
    return {
      adaptationStatus: 'ADAPTACION_PLENA',
      bulletinObservation: 'Demuestra notable adaptación a la rutina diaria, participando con curiosidad, entusiasmo y respeto en las actividades de aula.',
      strengthsSummary: 'Participa activamente en dinámicas lúdicas y asamblea.',
      motorDevelopmentObs: 'Desarrolla pinza digital adecuada, agarre de creyón y destreza en ensartado.',
      languageCognitiveObs: 'Construye oraciones completas y formula preguntas con curiosidad.',
      socioemotionalObs: 'Muestra empatía, comparte materiales en los rincones y sigue instrucciones.',
      recommendationsHome: 'Continuar estimulando la lectura de cuentos antes de dormir y autonomía en el vestido.',
      updatedAt: new Date().toISOString()
    };
  };

  // Manejador del botón oficial "Cargar Estudiantes"
  const handleCargarEstudiantes = () => {
    // Si algún selector no fue escogido, se asigna el valor predeterminado institucional
    const year = selectedSchoolYear || '2026 - 2027';
    const lapso = (Number(selectedLapso || String(activeLapso || 1)) as 1 | 2 | 3);
    const grade = selectedGrade || 'Sala de 4 Años';
    const section = (selectedSection || 'A') as 'A' | 'B';

    setSelectedSchoolYear(year);
    setSelectedLapso(String(lapso));
    setSelectedGrade(grade);
    setSelectedSection(section);

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLoaded(true);
      setLoadedFilters({
        year,
        lapso,
        grade,
        section
      });
      showToast(
        'Estudiantes Cargados',
        `Nómina lista para ${grade} - Sección "${section}" (Lapso ${lapso} • Año ${year}).`
      );
    }, 250);
  };

  // Actualizar un campo específico de la observación de un estudiante
  const handleStudentFieldChange = (studentId: string, field: keyof PreschoolObservation, value: any) => {
    const current = getStudentObs(studentId);
    const updated: PreschoolObservation = {
      ...current,
      [field]: value,
      updatedAt: new Date().toISOString()
    };
    setObservations(prev => {
      const next = { ...prev, [studentId]: updated };
      // Persistir automáticamente
      const storageKey = `sisceba_obs_preescolar_${loadedFilters.grade}_${loadedFilters.section}_L${loadedFilters.lapso}`;
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  // Guardar todas las observaciones explícitamente
  const handleSaveAll = () => {
    const storageKey = `sisceba_obs_preescolar_${loadedFilters.grade}_${loadedFilters.section}_L${loadedFilters.lapso}`;
    localStorage.setItem(storageKey, JSON.stringify(observations));
    showToast(
      'Observaciones Guardadas',
      `Se han guardado con éxito las observaciones de ${loadedFilters.grade} Sección "${loadedFilters.section}" para el boletín.`
    );
  };

  // Insertar frase desde el banco institucional al estudiante
  const handleInsertPhrase = (phraseText: string) => {
    const targetId = targetStudentForPhrase || selectedStudentId;
    if (!targetId) return;

    const current = getStudentObs(targetId);
    const existingText = current.bulletinObservation || '';
    const separator = existingText.trim() ? (existingText.trim().endsWith('.') ? ' ' : '. ') : '';
    const newText = `${existingText.trim()}${separator}${phraseText}`.trim();

    handleStudentFieldChange(targetId, 'bulletinObservation', newText);
    showToast('Frase Insertada', 'Se ha añadido la apreciación pedagógica al boletín del estudiante.');
    setIsPhraseBankOpen(false);
    setTargetStudentForPhrase(null);
  };

  // Copiar frase al portapapeles
  const handleCopyPhrase = (phrase: ObservationPhrase) => {
    navigator.clipboard.writeText(phrase.text);
    setCopiedPhraseId(phrase.id);
    setTimeout(() => setCopiedPhraseId(null), 2000);
    showToast('Copiado', 'Frase copiada al portapapeles.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* ============================================================== */}
      {/* 1. ENCABEZADO OFICIAL EXACTO AL REQUERIMIENTO C.E.O.            */}
      {/* ============================================================== */}
      <div className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4E70] dark:text-sky-300 tracking-tight">
          Observaciones Preescolar
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
          ADM: Registra las observaciones del boletín de los estudiantes de preescolar.
        </p>
      </div>

      <hr className="border-t border-slate-200 dark:border-slate-700 my-3" />

      {/* ============================================================== */}
      {/* 2. BARRA DE FILTROS SEGÚN CAPTURA C.E.O.                       */}
      {/* [ Año Escolar ⌄ ] [ Lapso ⌄ ] [ Grado ⌄ ] [ Sección ⌄ ] [ Cargar Estudiantes ] */}
      {/* ============================================================== */}
      <div className="no-print border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded p-3 sm:p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* 1. Selector de Año Escolar */}
          <select
            value={selectedSchoolYear}
            onChange={(e) => setSelectedSchoolYear(e.target.value)}
            className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#2C4E70] cursor-pointer min-w-[130px]"
          >
            <option value="">Año Escolar</option>
            <option value="2026 - 2027">2026 - 2027</option>
            <option value="2025 - 2026">2025 - 2026</option>
            <option value="2024 - 2025">2024 - 2025</option>
          </select>

          {/* 2. Selector de Lapso */}
          <select
            value={selectedLapso}
            onChange={(e) => setSelectedLapso(e.target.value)}
            className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#2C4E70] cursor-pointer min-w-[100px]"
          >
            <option value="">Lapso</option>
            <option value="1">Lapso 1</option>
            <option value="2">Lapso 2</option>
            <option value="3">Lapso 3</option>
          </select>

          {/* 3. Selector de Grado (Salas oficiales CBA: 4 y 5 Años) */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#2C4E70] cursor-pointer min-w-[140px]"
          >
            <option value="">Grado</option>
            <option value="Sala de 4 Años">Sala de 4 Años</option>
            <option value="Sala de 5 Años">Sala de 5 Años</option>
          </select>

          {/* 4. Selector de Sección (Secciones oficiales CBA: A y B) */}
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value as 'A' | 'B' | '')}
            className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#2C4E70] cursor-pointer min-w-[105px]"
          >
            <option value="">Sección</option>
            <option value="A">Sección A</option>
            <option value="B">Sección B</option>
          </select>

          {/* 5. Botón Cargar Estudiantes */}
          <button
            type="button"
            onClick={handleCargarEstudiantes}
            disabled={isLoading}
            className="px-4 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium shadow-2xs transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Cargando...' : 'Cargar Estudiantes'}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. ESTADO INICIAL SIN CARGAR                                    */}
      {/* ============================================================== */}
      {!isLoaded ? (
        <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-10 text-center text-slate-500 shadow-2xs">
          <ClipboardList className="w-10 h-10 mx-auto mb-3 text-slate-400" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            Filtro de Observaciones de Preescolar
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
            Seleccione el <strong>Año Escolar</strong>, <strong>Lapso</strong>, <strong>Grado</strong> y <strong>Sección</strong> en los selectores superiores y haga clic en <strong>"Cargar Estudiantes"</strong> para visualizar y redactar las observaciones del boletín.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setSelectedSchoolYear('2026 - 2027');
                setSelectedLapso('1');
                setSelectedGrade('Sala de 4 Años');
                setSelectedSection('A');
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  setIsLoaded(true);
                  setLoadedFilters({
                    year: '2026 - 2027',
                    lapso: 1,
                    grade: 'Sala de 4 Años',
                    section: 'A'
                  });
                }, 250);
              }}
              className="px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              Cargar Sala de 4 Años "A" (Lapso 1)
            </button>
          </div>
        </div>
      ) : targetStudents.length === 0 ? (
        /* Caso: Nómina Vacía para esa Sala y Sección */
        <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 shadow-2xs">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No se encontraron estudiantes inscritos en {loadedFilters.grade} - Sección "{loadedFilters.section}".
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Puede verificar los filtros superiores o inscribir alumnos en el submódulo de Matrícula e Inscripciones.
          </p>
        </div>
      ) : (
        /* ============================================================== */
        /* 4. CONTENIDO CON ESTUDIANTES CARGADOS                          */
        /* ============================================================== */
        <div className="space-y-4">
          {/* Barra de Acciones y Resumen de la Nómina */}
          <div className="no-print bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="px-2.5 py-1 rounded bg-[#2C4E70]/10 text-[#2C4E70] dark:bg-sky-950 dark:text-sky-300 text-xs font-bold border border-[#2C4E70]/20">
                {loadedFilters.grade} • Sección "{loadedFilters.section}"
              </span>
              <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold border border-amber-300">
                Lapso {loadedFilters.lapso}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Nómina: <strong>{targetStudents.length}</strong> infantes
              </span>

              {/* Selector de Modalidad de Vista */}
              <div className="flex items-center rounded border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 p-0.5 ml-1">
                <button
                  type="button"
                  onClick={() => setViewMode('TABLA')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                    viewMode === 'TABLA'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title="Vista de carga rápida tabular"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Tabla Rápida</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('FICHA')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                    viewMode === 'FICHA'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title="Ficha cualitativa individual"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ficha Detallada</span>
                </button>
              </div>
            </div>

            {/* Acciones Globales */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Buscador Rápido */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar infante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2C4E70] w-36 sm:w-44"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setTargetStudentForPhrase(selectedStudentId || targetStudents[0]?.id || null);
                  setIsPhraseBankOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition cursor-pointer"
                title="Abrir banco de apreciaciones pedagógicas institucionales"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Banco de Frases</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition cursor-pointer"
                title="Imprimir informe oficial de observaciones de preescolar"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Imprimir</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAll}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded border border-[#2C4E70] bg-[#2C4E70] hover:bg-[#1E3A5F] text-white text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
                title="Guardar todas las observaciones del boletín"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Todo</span>
              </button>
            </div>
          </div>

          {/* ========================================================== */}
          {/* MODALIDAD A: VISTA TABULAR DE OBSERVACIONES AL BOLETÍN       */}
          {/* ========================================================== */}
          {viewMode === 'TABLA' && (
            <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold">
                      <th className="py-2.5 px-3 w-10 text-center">N°</th>
                      <th className="py-2.5 px-3 w-28">C.E. / Cédula</th>
                      <th className="py-2.5 px-3 w-48">Estudiante</th>
                      <th className="py-2.5 px-3 w-44">Adaptación</th>
                      <th className="py-2.5 px-4 min-w-[320px]">Observaciones del Boletín</th>
                      <th className="py-2.5 px-3 w-24 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {displayedStudents.map((stu, idx) => {
                      const obs = getStudentObs(stu.id);
                      return (
                        <tr
                          key={stu.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          {/* N° */}
                          <td className="py-3 px-3 text-center font-bold text-slate-500">
                            {idx + 1}
                          </td>

                          {/* Cédula Escolar */}
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                            {stu.studentIdNumber || stu.cedula || 'S/C'}
                          </td>

                          {/* Estudiante */}
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900 dark:text-white leading-tight">
                              {stu.fullName}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {stu.gender === 'F' ? 'Niña' : 'Niño'} • {loadedFilters.grade}
                            </div>
                          </td>

                          {/* Estatus de Adaptación */}
                          <td className="py-3 px-3 align-top">
                            <select
                              value={obs.adaptationStatus}
                              onChange={(e) =>
                                handleStudentFieldChange(stu.id, 'adaptationStatus', e.target.value)
                              }
                              className="w-full px-2 py-1 text-[11px] font-semibold rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2C4E70] cursor-pointer"
                            >
                              <option value="ADAPTACION_PLENA">🟢 Adaptación Plena</option>
                              <option value="EN_PROCESO">🟡 En Proceso</option>
                              <option value="ACOMPANAMIENTO_PRIORITARIO">🔴 Acompañamiento</option>
                            </select>
                          </td>

                          {/* Observación para el Boletín Oficial */}
                          <td className="py-2.5 px-4 align-top">
                            <div className="space-y-1.5">
                              <textarea
                                rows={3}
                                value={obs.bulletinObservation}
                                onChange={(e) =>
                                  handleStudentFieldChange(stu.id, 'bulletinObservation', e.target.value)
                                }
                                placeholder="Redacte las observaciones del boletín para este estudiante..."
                                className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2C4E70] resize-y"
                              />
                              <div className="flex items-center justify-between text-[10px] text-slate-500">
                                <span className="font-mono">
                                  {obs.bulletinObservation?.length || 0} caracteres
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTargetStudentForPhrase(stu.id);
                                    setSelectedStudentId(stu.id);
                                    setIsPhraseBankOpen(true);
                                  }}
                                  className="text-[#2C4E70] dark:text-sky-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <Sparkles className="w-3 h-3 text-amber-500" />
                                  <span>Insertar frase del banco</span>
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Acciones */}
                          <td className="py-3 px-3 align-top text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStudentId(stu.id);
                                setViewMode('FICHA');
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold rounded border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs transition cursor-pointer flex items-center gap-1 mx-auto"
                              title="Ver ficha cualitativa integral del infante"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Ficha</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pie de tabla con botón de guardado */}
              <div className="no-print bg-slate-50 dark:bg-slate-800/40 p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Total de infantes en nómina: <strong>{displayedStudents.length}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-4 py-1.5 rounded border border-[#2C4E70] bg-[#2C4E70] hover:bg-[#1E3A5F] text-white text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Observaciones</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* MODALIDAD B: FICHA DETALLADA POR INFANTE                    */}
          {/* ========================================================== */}
          {viewMode === 'FICHA' && activeStudent && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Columna Izquierda: Selector de Infantes */}
              <div className="no-print lg:col-span-4 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-2xs p-3 space-y-2 max-h-[650px] overflow-y-auto">
                <div className="flex items-center justify-between px-1 pb-1 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Nómina ({targetStudents.length})
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {loadedFilters.grade} "{loadedFilters.section}"
                  </span>
                </div>

                {displayedStudents.map((stu, i) => {
                  const obs = getStudentObs(stu.id);
                  const isSelected = stu.id === selectedStudentId;

                  return (
                    <button
                      key={stu.id}
                      onClick={() => setSelectedStudentId(stu.id)}
                      className={`w-full text-left p-2.5 rounded transition flex items-center justify-between group cursor-pointer ${
                        isSelected
                          ? 'bg-[#2C4E70] text-white font-bold shadow-2xs'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                            isSelected
                              ? 'bg-amber-400 text-slate-900'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                          }`}
                        >
                          {i + 1}
                        </span>
                        <div className="truncate">
                          <div className="text-xs truncate">{stu.fullName}</div>
                          <div
                            className={`text-[10px] font-mono ${
                              isSelected ? 'text-sky-200' : 'text-slate-400'
                            }`}
                          >
                            {stu.studentIdNumber || stu.cedula || 'S/C'}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          obs.adaptationStatus === 'ADAPTACION_PLENA'
                            ? 'bg-emerald-400'
                            : obs.adaptationStatus === 'EN_PROCESO'
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                        title={obs.adaptationStatus}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Columna Derecha: Formulario Integral de Observación */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-4">
                {/* Encabezado del Estudiante */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C4E70] dark:text-sky-400">
                      Ficha Cualitativa de Observación
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {activeStudent.fullName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {loadedFilters.grade} • Sección "{loadedFilters.section}" • Lapso {loadedFilters.lapso} • Año Escolar {loadedFilters.year}
                    </p>
                  </div>

                  {/* Nivel de Adaptación */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Nivel de Adaptación
                    </label>
                    <select
                      value={getStudentObs(activeStudent.id).adaptationStatus}
                      onChange={(e) =>
                        handleStudentFieldChange(activeStudent.id, 'adaptationStatus', e.target.value)
                      }
                      className="px-2.5 py-1 rounded text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2C4E70] cursor-pointer"
                    >
                      <option value="ADAPTACION_PLENA">🟢 Adaptación Plena y Autónoma</option>
                      <option value="EN_PROCESO">🟡 En Proceso de Adaptación</option>
                      <option value="ACOMPANAMIENTO_PRIORITARIO">🔴 Acompañamiento Prioritario</option>
                    </select>
                  </div>
                </div>

                {/* 1. Observación Oficial del Boletín */}
                <div className="bg-[#2C4E70]/5 dark:bg-sky-950/20 border border-[#2C4E70]/20 rounded p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#2C4E70] dark:text-sky-300 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#2C4E70]" />
                      <span>Observaciones del Boletín Informativo (Texto Oficial Impreso)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetStudentForPhrase(activeStudent.id);
                        setIsPhraseBankOpen(true);
                      }}
                      className="text-xs text-[#2C4E70] dark:text-sky-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Banco de Frases</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={getStudentObs(activeStudent.id).bulletinObservation}
                    onChange={(e) =>
                      handleStudentFieldChange(activeStudent.id, 'bulletinObservation', e.target.value)
                    }
                    placeholder="Redacte aquí las observaciones que se imprimirán en el boletín del estudiante..."
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2C4E70]"
                  />
                  <div className="text-[10px] text-slate-500 font-mono text-right">
                    {getStudentObs(activeStudent.id).bulletinObservation?.length || 0} caracteres
                  </div>
                </div>

                {/* 2. Fortalezas Destacadas */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Fortalezas Destacadas y Participación en Aula</span>
                  </label>
                  <textarea
                    rows={2}
                    value={getStudentObs(activeStudent.id).strengthsSummary}
                    onChange={(e) =>
                      handleStudentFieldChange(activeStudent.id, 'strengthsSummary', e.target.value)
                    }
                    placeholder="Habilidades destacadas del infante en el rincón de trabajo y asamblea..."
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2C4E70]"
                  />
                </div>

                {/* 3. Desarrollo Psicomotor */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <span>🏃</span>
                    <span>Desarrollo Psicomotor (Motricidad Fina, Gruesa y Coordinación)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={getStudentObs(activeStudent.id).motorDevelopmentObs}
                    onChange={(e) =>
                      handleStudentFieldChange(activeStudent.id, 'motorDevelopmentObs', e.target.value)
                    }
                    placeholder="Agarre en pinza, trazos, ensartado, saltos, equilibrio dinámico..."
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2C4E70]"
                  />
                </div>

                {/* 4. Lenguaje y Comunicación */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <span>🗣️</span>
                    <span>Lenguaje, Comunicación y Nociones Lógicas Primarias</span>
                  </label>
                  <textarea
                    rows={2}
                    value={getStudentObs(activeStudent.id).languageCognitiveObs}
                    onChange={(e) =>
                      handleStudentFieldChange(activeStudent.id, 'languageCognitiveObs', e.target.value)
                    }
                    placeholder="Fluidez verbal, expresión de necesidades, reconocimiento de formas, colores..."
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2C4E70]"
                  />
                </div>

                {/* 5. Convivencia Socioafectiva */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <span>🤝</span>
                    <span>Convivencia Socioafectiva y Hábitos de Autonomía</span>
                  </label>
                  <textarea
                    rows={2}
                    value={getStudentObs(activeStudent.id).socioemotionalObs}
                    onChange={(e) =>
                      handleStudentFieldChange(activeStudent.id, 'socioemotionalObs', e.target.value)
                    }
                    placeholder="Relación con sus pares y maestras, manejo de emociones, hábitos de orden..."
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2C4E70]"
                  />
                </div>

                {/* 6. Recomendaciones para el Hogar */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <span>🏡</span>
                    <span>Orientaciones Pedagógicas para el Hogar</span>
                  </label>
                  <textarea
                    rows={2}
                    value={getStudentObs(activeStudent.id).recommendationsHome}
                    onChange={(e) =>
                      handleStudentFieldChange(activeStudent.id, 'recommendationsHome', e.target.value)
                    }
                    placeholder="Actividades conjuntas sugeridas para la familia en casa..."
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2C4E70]"
                  />
                </div>

                {/* Barra de Guardado del Estudiante */}
                <div className="no-print flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setViewMode('TABLA')}
                    className="px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    ← Volver a Tabla
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSaveAll();
                      showToast(
                        'Ficha Guardada',
                        `Ficha cualitativa de ${activeStudent.fullName} actualizada exitosamente.`
                      );
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded border border-[#2C4E70] bg-[#2C4E70] hover:bg-[#1E3A5F] text-white text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar Ficha del Estudiante</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MODAL DEL BANCO DE FRASES PEDAGÓGICAS INSTITUCIONALES        */}
      {/* ============================================================== */}
      {isPhraseBankOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-2xl w-full border border-slate-300 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header del Modal */}
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#2C4E70] dark:text-sky-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Banco Institucional de Frases para el Boletín
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Apreciaciones cualitativas recomendadas para Educación Inicial CBA
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPhraseBankOpen(false);
                  setTargetStudentForPhrase(null);
                }}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categorías */}
            <div className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'TODAS', label: 'Todas' },
                { id: 'ADAPTACION', label: 'Adaptación' },
                { id: 'COGNICION', label: 'Cognitivo' },
                { id: 'PSICOMOTRIZ', label: 'Psicomotriz' },
                { id: 'SOCIOEMOCIONAL', label: 'Socioemocional' },
                { id: 'HOGAR', label: 'Hogar' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setPhraseCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    phraseCategoryFilter === cat.id
                      ? 'bg-[#2C4E70] text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Lista de Frases */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {PREESCOLAR_PHRASES_BANK.filter(
                p => phraseCategoryFilter === 'TODAS' || p.category === phraseCategoryFilter
              ).map(phrase => (
                <div
                  key={phrase.id}
                  className="p-3 rounded border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                      {phrase.categoryLabel}
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                      "{phrase.text}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleCopyPhrase(phrase)}
                      className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                      title="Copiar texto"
                    >
                      {copiedPhraseId === phrase.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInsertPhrase(phrase.text)}
                      className="px-3 py-1 rounded bg-[#2C4E70] hover:bg-[#1E3A5F] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Insertar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer del Modal */}
            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsPhraseBankOpen(false);
                  setTargetStudentForPhrase(null);
                }}
                className="px-4 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
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
