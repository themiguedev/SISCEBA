import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, LiteralScore, SpecializedSkillRecord } from '../../types';
import {
  Heart,
  Save,
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  RotateCw,
  Printer,
  FileSpreadsheet,
  Search,
  Sparkles,
  Award,
  Filter,
  X
} from 'lucide-react';
import { exportReportToExcel } from '../../utils/excelExport';

// Criterios Actitudinales Institucionales de Educación Inicial (CBA)
interface AttitudinalCriterion {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
}

const INICIAL_ATTITUDINAL_CRITERIA: AttitudinalCriterion[] = [
  {
    id: 'act-convivencia',
    code: 'ACT-CONV',
    title: 'Convivencia y Cortesía',
    description: 'Comparte espontáneamente con sus compañeros, practica normas de cortesía (saludo, gracias, por favor) y respeta turnos en dinámicas colectivas.',
    icon: '🤝'
  },
  {
    id: 'act-habitos',
    code: 'ACT-HAB',
    title: 'Autonomía y Hábitos de Aseo',
    description: 'Ordena los materiales y rincones tras su uso, se lava las manos oportunamente, cuida su lonchera y sus pertenencias personales.',
    icon: '🧼'
  },
  {
    id: 'act-emocional',
    code: 'ACT-EMO',
    title: 'Expresión y Regulación Emocional',
    description: 'Comunica verbalmente sus emociones y necesidades, muestra seguridad ante la separación del hogar y resuelve desacuerdos con diálogo guiado.',
    icon: '❤️'
  },
  {
    id: 'act-rutina',
    code: 'ACT-RUT',
    title: 'Seguimiento de la Rutina Diaria',
    description: 'Participa con entusiasmo en la asamblea matutina, atiende a las señales de transición y colabora activamente en el momento de recuento.',
    icon: '⏰'
  }
];

export const IndicadoresActitudinalesView: React.FC = () => {
  const { students, activeLapso, showToast, currentRole, specializedSkills, saveSpecializedSkill } = useApp();

  // Estados de la Barra de Filtros 1:1 con C.E.O.
  // Inician con valores estándar pero con opción de placeholder idéntica a la captura de pantalla
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>('2025 - 2026');
  const [selectedLapso, setSelectedLapso] = useState<number | ''>(activeLapso || 1);
  const [selectedGrade, setSelectedGrade] = useState<string>('Sala de 4 Años');
  const [selectedSection, setSelectedSection] = useState<'A' | 'B' | ''>('A');

  // Control de carga y spinner
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Matriz de calificaciones actitudinales: { [studentId]: { [criterionId]: LiteralScore } }
  const [scores, setScores] = useState<Record<string, Record<string, LiteralScore>>>({});
  // Observaciones actitudinales por estudiante: { [studentId]: string }
  const [observations, setObservations] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Sala y sección efectivas para consultas
  const effectiveGrade = selectedGrade || 'Sala de 4 Años';
  const effectiveSection = (selectedSection || 'A') as 'A' | 'B';
  const effectiveLapso = (selectedLapso || 1) as 1 | 2 | 3;
  const effectiveYear = selectedSchoolYear || '2025 - 2026';

  // Cargar registros desde almacenamiento local y AppContext al cambiar filtros efectivos
  useEffect(() => {
    const storageKey = `sisceba_actitudinal_ini_${effectiveGrade}_${effectiveSection}_L${effectiveLapso}_${effectiveYear}`;
    const saved = localStorage.getItem(storageKey);
    let loadedScores: Record<string, Record<string, LiteralScore>> = {};
    let loadedObservations: Record<string, string> = {};

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.scores) loadedScores = parsed.scores;
        if (parsed.observations) loadedObservations = parsed.observations;
      } catch (err) {
        console.error('Error al cargar datos actitudinales:', err);
      }
    }

    // Filtrar infantes de la sala y sección
    const targetStudents = (students || []).filter(
      s => s.level === 'INICIAL' && s.grade === effectiveGrade && s.section === effectiveSection
    );

    // Complementar con AppContext (specializedSkills) si existen registros sincronizados
    targetStudents.forEach(stu => {
      const existingSkill = (specializedSkills || []).find(
        sk =>
          sk.studentId === stu.id &&
          sk.lapso === effectiveLapso &&
          sk.type === 'ACTITUDINAL' &&
          sk.level === 'INICIAL'
      );

      if (!loadedScores[stu.id]) {
        if (existingSkill && existingSkill.scoreLiteral) {
          loadedScores[stu.id] = {
            'act-convivencia': existingSkill.scoreLiteral,
            'act-habitos': existingSkill.scoreLiteral,
            'act-emocional': existingSkill.scoreLiteral,
            'act-rutina': existingSkill.scoreLiteral
          };
        } else {
          // Valores iniciales por defecto en escala literal CBA
          loadedScores[stu.id] = {
            'act-convivencia': 'A',
            'act-habitos': 'A',
            'act-emocional': 'B',
            'act-rutina': 'A'
          };
        }
      }

      if (!loadedObservations[stu.id] && existingSkill?.orientacionConvivenciaObs) {
        loadedObservations[stu.id] = existingSkill.orientacionConvivenciaObs;
      }
    });

    setScores(loadedScores);
    setObservations(loadedObservations);
    setHasUnsavedChanges(false);
  }, [effectiveGrade, effectiveSection, effectiveLapso, effectiveYear, students, specializedSkills]);

  // Manejador del botón "Cargar Materias" (idéntico a la acción en la captura CEO)
  const handleCargarMaterias = () => {
    // Si algún selector está en blanco, autocompletar con los valores predeterminados
    if (!selectedSchoolYear) setSelectedSchoolYear('2025 - 2026');
    if (!selectedLapso) setSelectedLapso((activeLapso as 1 | 2 | 3) || 1);
    if (!selectedGrade) setSelectedGrade('Sala de 4 Años');
    if (!selectedSection) setSelectedSection('A');

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasLoadedOnce(true);
      showToast(
        'Materias e Indicadores Cargados',
        `Se han cargado las materias e indicadores actitudinales para ${effectiveGrade} - Sección ${effectiveSection} (${effectiveYear}, Lapso ${effectiveLapso}).`
      );
    }, 350);
  };

  // Estudiantes de la sala y sección seleccionada (con filtro de búsqueda rápida)
  const targetStudents = useMemo(() => {
    return (students || [])
      .filter(s => s.level === 'INICIAL' && s.grade === effectiveGrade && s.section === effectiveSection)
      .filter(s => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase().trim();
        return (
          (s.fullName || '').toLowerCase().includes(term) ||
          (s.studentIdNumber || s.id || '').toLowerCase().includes(term) ||
          (s.cedula || '').toLowerCase().includes(term)
        );
      });
  }, [students, effectiveGrade, effectiveSection, searchTerm]);

  // Actualizar calificación de un criterio
  const handleScoreChange = (studentId: string, criterionId: string, val: LiteralScore) => {
    setScores(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [criterionId]: val
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Actualizar observación pedagógica
  const handleObservationChange = (studentId: string, text: string) => {
    setObservations(prev => ({
      ...prev,
      [studentId]: text
    }));
    setHasUnsavedChanges(true);
  };

  // Asignación masiva rápida
  const handleBulkSet = (literal: LiteralScore) => {
    const updated: Record<string, Record<string, LiteralScore>> = { ...scores };
    targetStudents.forEach(stu => {
      updated[stu.id] = {
        'act-convivencia': literal,
        'act-habitos': literal,
        'act-emocional': literal,
        'act-rutina': literal
      };
    });
    setScores(updated);
    setHasUnsavedChanges(true);
    showToast(
      'Asignación Masiva',
      `Se asignó la valoración '${literal}' a todos los estudiantes de ${effectiveGrade} Sección ${effectiveSection}.`
    );
  };

  // Guardar en almacenamiento local y sincronizar con AppContext / PostgreSQL
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const storageKey = `sisceba_actitudinal_ini_${effectiveGrade}_${effectiveSection}_L${effectiveLapso}_${effectiveYear}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({ scores, observations, updatedAt: new Date().toISOString() })
      );

      // Si existe función de guardado en AppContext, sincronizar registro por cada infante
      if (saveSpecializedSkill) {
        for (const stu of targetStudents) {
          const studentScores = scores[stu.id] || {};
          const firstScore = (studentScores['act-convivencia'] || 'A') as LiteralScore;
          const obs = observations[stu.id] || '';

          const record: SpecializedSkillRecord = {
            id: `skill_act_ini_${stu.id}_L${effectiveLapso}_${effectiveYear}`,
            studentId: stu.id,
            studentName: stu.fullName,
            level: 'INICIAL',
            grade: effectiveGrade,
            section: effectiveSection,
            lapso: effectiveLapso,
            type: 'ACTITUDINAL',
            scoreLiteral: firstScore,
            habitosTrabajo: studentScores['act-habitos'] || 'A',
            convivenciaSocial: studentScores['act-convivencia'] || 'A',
            autonomiaPersonal: studentScores['act-emocional'] || 'A',
            orientacionConvivenciaObs: obs,
            observacionesGenerales: obs,
            evaluatedAt: new Date().toISOString()
          };

          await saveSpecializedSkill(record);
        }
      }

      setHasUnsavedChanges(false);
      showToast(
        'Registro Actitudinal Guardado',
        `Se han guardado con éxito las valoraciones actitudinales de ${effectiveGrade} - Sección ${effectiveSection} (Lapso ${effectiveLapso}).`
      );
    } catch (error) {
      console.error('Error al guardar registro actitudinal:', error);
      showToast('Error de Guardado', 'No se pudo guardar la información actitudinal.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Exportar e Imprimir en Formato Oficial Excel
  const handleExportExcel = () => {
    const columns = [
      { header: 'N°', width: 45, align: 'center' as const },
      { header: 'Nombres y Apellidos del Infante', width: 260, align: 'left' as const },
      { header: 'Cédula / Identificador Escolar', width: 150, align: 'center' as const },
      { header: 'ACT-CONV (Convivencia)', width: 110, align: 'center' as const },
      { header: 'ACT-HAB (Hábitos)', width: 110, align: 'center' as const },
      { header: 'ACT-EMO (Emocional)', width: 110, align: 'center' as const },
      { header: 'ACT-RUT (Rutina)', width: 110, align: 'center' as const },
      { header: 'Observaciones Pedagógicas', width: 280, align: 'left' as const }
    ];

    const data = targetStudents.map((stu, i) => {
      const stScores = scores[stu.id] || {};
      const obs = observations[stu.id] || 'Desempeño acorde a la rutina pedagógica.';
      return [
        i + 1,
        (stu.fullName || '').toUpperCase(),
        stu.studentIdNumber || stu.cedula || stu.id,
        stScores['act-convivencia'] || 'A',
        stScores['act-habitos'] || 'A',
        stScores['act-emocional'] || 'A',
        stScores['act-rutina'] || 'A',
        obs
      ];
    });

    exportReportToExcel({
      title: 'REGISTRO OFICIAL DE INDICADORES ACTITUDINALES Y CONVIVENCIA ESCOLAR',
      subtitle: 'NIVEL DE EDUCACIÓN INICIAL • U.E.P. COLEGIO BELLAS ARTES',
      schoolYear: effectiveYear,
      lapso: effectiveLapso,
      grade: effectiveGrade,
      section: effectiveSection,
      level: 'EDUCACIÓN INICIAL',
      orientation: 'landscape',
      columns,
      data,
      extraNotes: [
        'Escala Oficial Literal CBA: A (Consolidado), B (Avanzado), C (En Proceso), D (Iniciado), E (Acompañamiento Prioritario).',
        'Criterios Evaluados: ACT-CONV (Convivencia y Cortesía), ACT-HAB (Autonomía y Hábitos de Aseo), ACT-EMO (Expresión y Regulación Emocional), ACT-RUT (Seguimiento de la Rutina Diaria).'
      ],
      signatures: [
        { title: 'Docente Guía de Preescolar', subtitle: 'Firma y Cédula de Identidad' },
        { title: 'Coordinación de Educación Inicial', subtitle: 'Revisión y Conformidad' },
        { title: 'Dirección Pedagógica', subtitle: 'Sello Institucional CBA' }
      ],
      filename: `Indicadores_Actitudinales_Inicial_${effectiveGrade.replace(/\s+/g, '_')}_Sec_${effectiveSection}_L${effectiveLapso}`,
      sheetName: `Actitudinal ${effectiveSection} L${effectiveLapso}`
    });

    showToast(
      'Impresión en Excel Generada',
      'El archivo en formato oficial Excel ha sido descargado listo para imprimir.'
    );
  };

  // Colores por literal en Educación Inicial
  const getLiteralBadge = (literal: LiteralScore) => {
    switch (literal) {
      case 'A':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700 font-black';
      case 'B':
        return 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700 font-bold';
      case 'C':
        return 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700 font-bold';
      case 'D':
        return 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-700 font-bold';
      case 'E':
        return 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700 font-black';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* ========================================================================= */}
      {/* ENCABEZADO 1:1 CON LA CAPTURA DE PANTALLA C.E.O.                         */}
      {/* ========================================================================= */}
      <div className="no-print">
        <h1 className="text-xl sm:text-2xl font-black text-[#2C2E53] dark:text-blue-400 tracking-tight uppercase leading-snug">
          INDICADORES ACTITUDINALES
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
          <strong className="text-[#2C2E53] dark:text-amber-400 font-bold mr-1">ADM:</strong>
          Ingrese los indicadores actitudinales de los estudiantes (Educación Inicial).
        </p>
      </div>

      {/* ========================================================================= */}
      {/* BARRA DE FILTROS 1:1 CON LA CAPTURA DE PANTALLA                           */}
      {/* [ Año Escolar ⌄ ] [ Lapso ⌄ ] [ Grado ⌄ ] [ Sección ⌄ ] [ Cargar Materias ] */}
      {/* ========================================================================= */}
      <div className="no-print bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2.5 sm:p-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* 1. Selector de Año Escolar */}
          <div className="relative">
            <select
              value={selectedSchoolYear}
              onChange={(e) => setSelectedSchoolYear(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-3 pr-8 py-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-normal focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs min-w-[130px]"
            >
              <option value="">Año Escolar</option>
              <option value="2025 - 2026">2025 - 2026</option>
              <option value="2026 - 2027">2026 - 2027</option>
              <option value="2024 - 2025">2024 - 2025</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 2. Selector de Lapso */}
          <div className="relative">
            <select
              value={selectedLapso}
              onChange={(e) => setSelectedLapso(e.target.value ? (Number(e.target.value) as 1 | 2 | 3) : '')}
              className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-3 pr-8 py-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-normal focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs min-w-[110px]"
            >
              <option value="">Lapso</option>
              <option value={1}>Lapso 1</option>
              <option value={2}>Lapso 2</option>
              <option value={3}>Lapso 3</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 3. Selector de Grado (Salas Oficiales CBA: Sala de 4 Años y Sala de 5 Años) */}
          <div className="relative">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-3 pr-8 py-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-normal focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs min-w-[140px]"
            >
              <option value="">Grado</option>
              <option value="Sala de 4 Años">Sala de 4 Años</option>
              <option value="Sala de 5 Años">Sala de 5 Años</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 4. Selector de Sección (Exclusivamente Sección A y B per directriz institucional) */}
          <div className="relative">
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value as 'A' | 'B' | '')}
              className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-3 pr-8 py-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-normal focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs min-w-[110px]"
            >
              <option value="">Sección</option>
              <option value="A">Sección A</option>
              <option value="B">Sección B</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 5. Botón Cargar Materias */}
          <button
            onClick={handleCargarMaterias}
            disabled={isLoading}
            className="px-4 py-1.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 text-slate-800 dark:text-slate-100 text-xs sm:text-sm rounded transition cursor-pointer shadow-2xs flex items-center gap-1.5 font-normal disabled:opacity-50"
            title="Cargar y sincronizar la matriz de indicadores actitudinales para esta selección"
          >
            {isLoading && <RotateCw className="w-3.5 h-3.5 animate-spin text-[#2C2E53] dark:text-amber-400" />}
            <span>{isLoading ? 'Cargando...' : 'Cargar Materias'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CUERPO PRINCIPAL: MATRIZ Y CRITERIOS ACTITUDINALES                        */}
      {/* ========================================================================= */}
      {!hasLoadedOnce ? (
        <div className="no-print bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-[#2C2E53] dark:text-blue-300 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Heart className="w-6 h-6 text-rose-500" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Carga y Revisión de Indicadores Actitudinales
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Haga clic en <strong className="text-slate-700 dark:text-slate-200">"Cargar Materias"</strong> para visualizar el registro y matriz de valoración actitudinal para Educación Inicial.
          </p>
          <button
            type="button"
            onClick={handleCargarMaterias}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#2C2E53] text-[#D4AF37] hover:bg-[#1E2038] shadow-xs transition-all cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Cargar Datos de Preescolar</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Barra de Acciones Secundarias y Relleno Rápido */}
          <div className="no-print bg-white dark:bg-slate-900 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            {/* Lado Izquierdo: Buscador y Contador */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar infante por nombre o C.E..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#2C2E53]"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <Users className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold">{targetStudents.length}</span>
                <span>alumnos en {effectiveGrade} "{effectiveSection}"</span>
              </div>
            </div>

            {/* Lado Derecho: Relleno rápido, Imprimir y Guardar */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              {/* Llenado rápido de literales */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <span className="text-[10px] font-bold text-slate-500 px-1 hidden sm:inline">Rápido:</span>
                {(['A', 'B', 'C'] as LiteralScore[]).map((lit) => (
                  <button
                    key={lit}
                    type="button"
                    onClick={() => handleBulkSet(lit)}
                    className="px-2 py-0.5 rounded text-[11px] font-black bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 shadow-2xs transition active:scale-95"
                    title={`Asignar literal '${lit}' a todos los infantes`}
                  >
                    Fijar '{lit}'
                  </button>
                ))}
              </div>

              {/* Botón Imprimir Planilla Oficial */}
              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 shadow-2xs transition cursor-pointer"
                title="Vista previa e impresión de indicadores actitudinales"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                <span className="hidden sm:inline">Vista Previa</span>
              </button>

              {/* Botón Imprimir en Formato Excel */}
              <button
                type="button"
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 shadow-2xs transition cursor-pointer"
                title="Generar formato oficial en Excel para impresión"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Imprimir Excel</span>
              </button>

              {/* Botón Guardar Cambios */}
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-black shadow-xs transition-all cursor-pointer ${
                  hasUnsavedChanges
                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-500 animate-pulse'
                    : 'bg-[#2C2E53] text-[#D4AF37] hover:bg-[#1E2038]'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Guardando...' : hasUnsavedChanges ? 'Guardar Cambios *' : 'Guardar Registro'}</span>
              </button>
            </div>
          </div>

          {/* Tarjetas Informativas de los 4 Criterios Actitudinales CBA */}
          <div className="no-print grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {INICIAL_ATTITUDINAL_CRITERIA.map((crit) => (
              <div
                key={crit.id}
                className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{crit.icon}</span>
                  <div>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {crit.code}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                      {crit.title}
                    </h4>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {crit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Tabla de Registro y Matriz de Calificaciones Actitudinales */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-xs sm:text-sm font-bold text-[#2C2E53] dark:text-white">
                  Matriz de Calificaciones Actitudinales • {effectiveGrade} "{effectiveSection}" • Lapso {effectiveLapso} ({effectiveYear})
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Escala Oficial CBA: <strong className="text-emerald-700 dark:text-emerald-400">A</strong> (Consolidado) • <strong className="text-blue-700 dark:text-blue-400">B</strong> (Avanzado) • <strong className="text-amber-700 dark:text-amber-400">C</strong> (En Proceso) • <strong className="text-orange-700 dark:text-orange-400">D</strong> (Iniciado) • <strong className="text-rose-700 dark:text-rose-400">E</strong> (En Acompañamiento)
              </span>
            </div>

            {targetStudents.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-bold">No se encontraron infantes en {effectiveGrade} - Sección {effectiveSection}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Verifique que la sección posea matrícula activa o matricule a los alumnos desde el módulo de Matrícula y Prosecución.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#2C2E53] text-[#D4AF37] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">N°</th>
                      <th className="py-2.5 px-4 min-w-[220px]">Estudiante / C.E.</th>
                      {INICIAL_ATTITUDINAL_CRITERIA.map((crit) => (
                        <th
                          key={crit.id}
                          className="py-2.5 px-2 text-center min-w-[125px]"
                          title={crit.description}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span>{crit.icon}</span>
                            <span>{crit.code}</span>
                          </div>
                          <div className="text-[9px] text-slate-300 font-normal lowercase truncate max-w-[120px] mx-auto">
                            {crit.title}
                          </div>
                        </th>
                      ))}
                      <th className="py-2.5 px-4 min-w-[250px]">Observación Pedagógica Actitudinal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {targetStudents.map((stu, idx) => {
                      const studentScores = scores[stu.id] || {};
                      const obs = observations[stu.id] || '';

                      return (
                        <tr
                          key={stu.id}
                          className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                            idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/20'
                          }`}
                        >
                          {/* Número */}
                          <td className="py-2 px-3 text-center text-slate-500 font-bold text-[11px]">
                            {idx + 1}
                          </td>

                          {/* Estudiante */}
                          <td className="py-2 px-4 font-bold text-slate-800 dark:text-slate-100">
                            <div>{stu.fullName}</div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              C.E.: {stu.studentIdNumber || stu.cedula || stu.id}
                            </div>
                          </td>

                          {/* Columnas de los 4 Criterios con selectores estilizados */}
                          {INICIAL_ATTITUDINAL_CRITERIA.map((crit) => {
                            const currentVal = studentScores[crit.id] || 'A';
                            return (
                              <td key={crit.id} className="py-1.5 px-2 text-center">
                                <select
                                  value={currentVal}
                                  onChange={(e) =>
                                    handleScoreChange(stu.id, crit.id, e.target.value as LiteralScore)
                                  }
                                  className={`px-2.5 py-1 rounded-lg border text-xs font-black shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#2C2E53] cursor-pointer ${getLiteralBadge(
                                    currentVal
                                  )}`}
                                >
                                  <option value="A">A - Consolidado</option>
                                  <option value="B">B - Avanzado</option>
                                  <option value="C">C - En Proceso</option>
                                  <option value="D">D - Iniciado</option>
                                  <option value="E">E - Acompañamiento</option>
                                </select>
                              </td>
                            );
                          })}

                          {/* Observación Pedagógica Actitudinal */}
                          <td className="py-1.5 px-4">
                            <input
                              type="text"
                              value={obs}
                              onChange={(e) => handleObservationChange(stu.id, e.target.value)}
                              placeholder="Observación sobre adaptación, convivencia o hábitos..."
                              className="w-full px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2C2E53]"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE IMPRESIÓN OFICIAL DEL REPORTE ACTITUDINAL DE INICIAL (CBA)       */}
      {/* ========================================================================= */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-300 dark:border-slate-700 overflow-hidden my-6">
            {/* Cabecera del modal */}
            <div className="no-print p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#2C2E53] dark:text-[#D4AF37]" />
                <h3 className="text-sm font-black text-[#2C2E53] dark:text-white">
                  Vista Previa de Impresión • Indicadores Actitudinales (Educación Inicial)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                  title="Descargar e imprimir desde Microsoft Excel"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Imprimir en Excel</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-[#2C2E53] text-[#D4AF37] hover:bg-[#1E2038] text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hoja imprimible con membrete oficial CBA */}
            <div className="p-8 bg-white text-slate-900 text-xs">
              {/* Membrete Oficial */}
              <div className="text-center border-b-2 border-slate-800 pb-3 mb-4">
                <p className="text-[10px] uppercase font-bold text-slate-600 leading-tight">
                  REPÚBLICA BOLIVARIANA DE VENEZUELA • MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN
                </p>
                <h2 className="text-base font-black uppercase tracking-wider text-slate-900 mt-1">
                  U.E.P. COLEGIO BELLAS ARTES • MARACAIBO, ESTADO ZULIA
                </h2>
                <h3 className="text-xs font-black uppercase text-[#2C2E53] mt-0.5">
                  REGISTRO OFICIAL DE INDICADORES ACTITUDINALES Y CONVIVENCIA ESCOLAR (EDUCACIÓN INICIAL)
                </h3>
                <div className="flex items-center justify-center gap-4 mt-2 text-[11px] font-bold text-slate-700">
                  <span>AÑO ESCOLAR: {effectiveYear}</span>
                  <span>•</span>
                  <span>MOMENTO / LAPSO: {effectiveLapso}</span>
                  <span>•</span>
                  <span>SALA: {effectiveGrade.toUpperCase()}</span>
                  <span>•</span>
                  <span>SECCIÓN: "{effectiveSection}"</span>
                </div>
              </div>

              {/* Leyenda de Criterios */}
              <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 bg-slate-50 border border-slate-300 rounded text-[10px]">
                {INICIAL_ATTITUDINAL_CRITERIA.map((c) => (
                  <div key={c.id}>
                    <strong>{c.code} ({c.title}):</strong> {c.description}
                  </div>
                ))}
              </div>

              {/* Tabla Imprimible */}
              <table className="w-full border-collapse border border-slate-400 text-[10px] mb-6">
                <thead>
                  <tr className="bg-slate-200 text-slate-900 border-b border-slate-400 font-bold uppercase">
                    <th className="border border-slate-400 py-1 px-1.5 w-7 text-center">N°</th>
                    <th className="border border-slate-400 py-1 px-2 text-left">Nombres y Apellidos</th>
                    <th className="border border-slate-400 py-1 px-2 w-24 text-left">Cédula Escolar</th>
                    <th className="border border-slate-400 py-1 px-1 w-16 text-center">ACT-CONV</th>
                    <th className="border border-slate-400 py-1 px-1 w-16 text-center">ACT-HAB</th>
                    <th className="border border-slate-400 py-1 px-1 w-16 text-center">ACT-EMO</th>
                    <th className="border border-slate-400 py-1 px-1 w-16 text-center">ACT-RUT</th>
                    <th className="border border-slate-400 py-1 px-2 text-left">Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {targetStudents.map((stu, i) => {
                    const stScores = scores[stu.id] || {};
                    const obs = observations[stu.id] || '';
                    return (
                      <tr key={stu.id} className="border-b border-slate-300">
                        <td className="border border-slate-400 py-1 px-1 text-center font-bold">{i + 1}</td>
                        <td className="border border-slate-400 py-1 px-2 font-bold uppercase">{stu.fullName}</td>
                        <td className="border border-slate-400 py-1 px-2 font-mono text-[9px]">
                          {stu.studentIdNumber || stu.cedula || stu.id}
                        </td>
                        <td className="border border-slate-400 py-1 px-1 text-center font-black">{stScores['act-convivencia'] || 'A'}</td>
                        <td className="border border-slate-400 py-1 px-1 text-center font-black">{stScores['act-habitos'] || 'A'}</td>
                        <td className="border border-slate-400 py-1 px-1 text-center font-black">{stScores['act-emocional'] || 'A'}</td>
                        <td className="border border-slate-400 py-1 px-1 text-center font-black">{stScores['act-rutina'] || 'A'}</td>
                        <td className="border border-slate-400 py-1 px-2 text-[9px]">{obs || 'Desempeño acorde a la rutina.'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Escala Oficial y Firmas */}
              <div className="flex items-center justify-between text-[9px] text-slate-600 mb-8 border-t border-slate-300 pt-2">
                <span>Escala Oficial Literal: A (Consolidado), B (Avanzado), C (En Proceso), D (Iniciado), E (Acompañamiento)</span>
                <span>Total Evaluados: {targetStudents.length} infantes</span>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6 text-center text-[10px]">
                <div className="border-t border-slate-600 pt-1">
                  <p className="font-bold">Docente Guía de Preescolar</p>
                  <p className="text-slate-500">Firma y Cédula</p>
                </div>
                <div className="border-t border-slate-600 pt-1">
                  <p className="font-bold">Coordinación de Educación Inicial</p>
                  <p className="text-slate-500">Revisión y Aprobación</p>
                </div>
                <div className="border-t border-slate-600 pt-1">
                  <p className="font-bold">Dirección Pedagógica</p>
                  <p className="text-slate-500">Sello Institucional CBA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
