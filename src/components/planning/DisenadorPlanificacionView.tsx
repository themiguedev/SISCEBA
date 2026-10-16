import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PlanQuincenal, DidacticPlanRow, EducationalLevel, PlanStatus, LEVEL_GRADES_CATALOG, AcademicAssignment, Competency } from '../../types';
import { INITIAL_DIAGNOSTIC_CRITERIA } from '../../data/seedData';
import {
  TEMPLATE_INICIAL,
  TEMPLATE_INICIAL_5A,
  TEMPLATE_INICIAL_AP_4A,
  TEMPLATE_INICIAL_AP_5A,
  TEMPLATE_INICIAL_EF_4A,
  TEMPLATE_INICIAL_EF_5A,
  TEMPLATE_INICIAL_NAT_4A,
  TEMPLATE_INICIAL_NAT_5A,
  TEMPLATE_INICIAL_AJE_4A,
  TEMPLATE_INICIAL_AJE_5A,
  TEMPLATE_INICIAL_INF_4A,
  TEMPLATE_INICIAL_INF_5A,
  TEMPLATE_INICIAL_ING_4A,
  TEMPLATE_INICIAL_ING_5A,
  TEMPLATE_PRIMARIA,
  TEMPLATE_PRIMARIA_LEN_1G,
  TEMPLATE_PRIMARIA_MAT_1G,
  TEMPLATE_MEDIA_GENERAL,
  BLANK_INICIAL_PLAN,
  BLANK_PRIMARIA_PLAN,
  BLANK_MEDIA_PLAN,
  DidacticTemplateData
} from '../../data/didacticPlanTemplates';
import { SharePlanModal } from './SharePlanModal';
import {
  Save,
  Send,
  Share2,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Info,
  Calendar,
  Layers,
  ChevronDown,
  Boxes,
  Tag,
  X,
  Search,
  Dumbbell
} from 'lucide-react';

interface DisenadorPlanificacionViewProps {
  initialPlanId?: string;
  onBackToList?: () => void;
}

export const DisenadorPlanificacionView: React.FC<DisenadorPlanificacionViewProps> = ({
  initialPlanId,
  onBackToList
}) => {
  const {
    areas,
    plansQuincenal,
    currentLevel,
    currentRole,
    currentUser,
    currentTeacherAssignments,
    savePlanQuincenal,
    updateQuincenalStatus,
    educationalResources,
    competencies,
    indicators
  } = useApp();

  // Nivel seleccionado en el diseñador (Inicial, Primaria o Media General)
  const [selectedLevel, setSelectedLevel] = useState<EducationalLevel>(() => {
    if (initialPlanId) {
      const existing = plansQuincenal.find(p => p.id === initialPlanId);
      if (existing) return existing.level;
    }
    return currentLevel;
  });

  // Estado del Plan Didáctico en edición
  const [planId, setPlanId] = useState<string>(() => initialPlanId || `pq-${Date.now()}`);
  const [status, setStatus] = useState<PlanStatus>('BORRADOR');
  const [title, setTitle] = useState<string>('');
  const [areaId, setAreaId] = useState<string>('');
  const [docenteName, setDocenteName] = useState<string>(() => currentUser?.fullName || '');
  const [gradeSection, setGradeSection] = useState<string>('');
  const [lapso, setLapso] = useState<1 | 2 | 3>(1);
  const [schoolYear, setSchoolYear] = useState<string>('2026 - 2027');
  const [periodoQuincenal, setPeriodoQuincenal] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2026-09-21');
  const [endDate, setEndDate] = useState<string>('2026-10-02');
  const [componente, setComponente] = useState<string>('');
  const [temaGenerador, setTemaGenerador] = useState<string>('');
  const [projectTheme, setProjectTheme] = useState<string>('');
  const [rows, setRows] = useState<DidacticPlanRow[]>([]);
  const [actividadesInicio, setActividadesInicio] = useState<string>('');
  const [actividadesDesarrollo, setActividadesDesarrollo] = useState<string>('');
  const [actividadesCierre, setActividadesCierre] = useState<string>('');
  const [recursos, setRecursos] = useState<string>('');
  const [fuentesConsulta, setFuentesConsulta] = useState<string>('');
  const [reviewFeedback, setReviewFeedback] = useState<string | undefined>();
  const [reviewedBy, setReviewedBy] = useState<string | undefined>();

  // Campos especializados de Formatos Adaptables por Subsistema
  const [espaciosTrabajo, setEspaciosTrabajo] = useState<string>('');
  const [rutinaDiaria, setRutinaDiaria] = useState<string>('');
  const [ejesIntegradores, setEjesIntegradores] = useState<string>('');
  const [tipoProyecto, setTipoProyecto] = useState<string>('');
  const [temaIndispensable, setTemaIndispensable] = useState<string>('');

  // Estados de control de UI y Modal de Banco
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState<boolean>(false);
  const [bankActiveTab, setBankActiveTab] = useState<'RECURSOS' | 'COMPETENCIAS' | 'INDICADORES'>('RECURSOS');
  const [bankSearch, setBankSearch] = useState<string>('');
  const [targetRowIdForBank, setTargetRowIdForBank] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Cátedras oficiales del docente filtradas por el nivel activo
  const teacherLevelAssignments = (currentTeacherAssignments || []).filter(
    (a: AcademicAssignment) => a.level === selectedLevel
  );

  const handleApplyAssignment = (asgId: string) => {
    const asg = (currentTeacherAssignments || []).find((a: AcademicAssignment) => a.id === asgId);
    if (!asg) return;
    setAreaId(asg.areaId);
    setGradeSection(`${asg.grade} ${asg.section}`);
    if (currentUser?.fullName) {
      setDocenteName(currentUser.fullName);
    }
    if (asg.level !== selectedLevel) {
      setSelectedLevel(asg.level);
    }
    setToastMessage({
      text: `Datos de cátedra oficial cargados: ${asg.areaName} (${asg.grade} Sección ${asg.section})`,
      type: 'info'
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Áreas correspondientes al nivel seleccionado
  const levelAreas = areas.filter(a => a.level === selectedLevel);

  // Función para cargar los datos de una plantilla
  const loadTemplateData = (template: DidacticTemplateData, newId?: string) => {
    if (newId) setPlanId(newId);
    setTitle(template.title);
    setAreaId(template.areaId);
    setDocenteName(template.docenteName);
    setGradeSection(template.gradeSection);
    setLapso(template.lapso);
    setSchoolYear(template.schoolYear);
    setPeriodoQuincenal(template.periodoQuincenal);
    setStartDate(template.startDate);
    setEndDate(template.endDate);
    setComponente(template.componente || '');
    setTemaGenerador(template.temaGenerador || '');
    setProjectTheme(template.projectTheme);
    setRows(template.rows.map(r => ({ ...r })));
    setActividadesInicio(template.actividadesInicio);
    setActividadesDesarrollo(template.actividadesDesarrollo);
    setActividadesCierre(template.actividadesCierre);
    setRecursos(template.recursos);
    setFuentesConsulta(template.fuentesConsulta);
    setEspaciosTrabajo(template.espaciosTrabajo || '');
    setRutinaDiaria(template.rutinaDiaria || '');
    setEjesIntegradores(template.ejesIntegradores || '');
    setTipoProyecto(template.tipoProyecto || '');
    setTemaIndispensable(template.temaIndispensable || '');
  };

  // Carga inicial: si viene initialPlanId se busca en el estado; de lo contrario, se precarga el modelo predeterminado del nivel
  useEffect(() => {
    if (initialPlanId) {
      const existing = plansQuincenal.find(p => p.id === initialPlanId);
      if (existing) {
        setPlanId(existing.id);
        setStatus(existing.status);
        setSelectedLevel(existing.level);
        setTitle(existing.title);
        setAreaId(existing.areaId);
        setDocenteName(existing.docenteName || (currentRole === 'DOCENTE' ? 'Docente Titular' : 'Prof. Especialista'));
        setGradeSection(existing.gradeSection);
        setLapso(existing.lapso);
        setSchoolYear(existing.schoolYear || '2026 - 2027');
        setPeriodoQuincenal(existing.periodoQuincenal || `${existing.startDate} al ${existing.endDate}`);
        setStartDate(existing.startDate);
        setEndDate(existing.endDate);
        setComponente(existing.componente || existing.projectTheme || '');
        setTemaGenerador(existing.temaGenerador || existing.projectTheme || '');
        setProjectTheme(existing.projectTheme || '');
        setReviewFeedback(existing.reviewFeedback);
        setReviewedBy(existing.reviewedBy);
        setEspaciosTrabajo(existing.espaciosTrabajo || '');
        setRutinaDiaria(existing.rutinaDiaria || '');
        setEjesIntegradores(existing.ejesIntegradores || '');
        setTipoProyecto(existing.tipoProyecto || '');
        setTemaIndispensable(existing.temaIndispensable || '');

        if (existing.rows && existing.rows.length > 0) {
          setRows(existing.rows);
        } else {
          // Generar una fila inicial a partir del plan existente si no tenía filas
          setRows([
            {
              id: `row-${Date.now()}`,
              contenidoOReferente: existing.projectTheme || existing.title,
              aprendizajesEsperados: existing.title,
              indicadoresCompetencia: 'Indicadores vinculados en el registro pedagógico',
              tecnicasInstrumentos: 'Técnica de observación y resolución de tareas',
              criteriosEvaluacion: '• Participación y coherencia en las actividades.',
              ponderacionPercent: existing.level === 'MEDIA_GENERAL' ? 20 : undefined
            }
          ]);
        }

        setActividadesInicio(existing.actividadesInicio || '(I) Inicio:\nActivación de conocimientos previos y motivación.');
        setActividadesDesarrollo(existing.actividadesDesarrollo || (existing.pedagogicalActivities ? `(D) Desarrollo:\n${existing.pedagogicalActivities}` : '(D) Desarrollo:\nExplicación y práctica guiada.'));
        setActividadesCierre(existing.actividadesCierre || '(C) Cierre:\nSistematización y reflexión metacognitiva.');
        setRecursos(existing.recursos || 'Pizarrón, material impreso, libros de texto CBA.');
        setFuentesConsulta(existing.fuentesConsulta || 'Currículo Básico Nacional, textos escolares CBA.');
        return;
      }
    }

    // Si no hay plan previo, se carga el modelo predeterminado oficial
    if (selectedLevel === 'INICIAL') {
      loadTemplateData(TEMPLATE_INICIAL);
    } else if (selectedLevel === 'PRIMARIA') {
      loadTemplateData(TEMPLATE_PRIMARIA);
    } else {
      loadTemplateData(TEMPLATE_MEDIA_GENERAL);
    }
  }, [initialPlanId]);

  // Al cambiar manualmente de nivel mediante el selector
  const handleLevelChange = (newLevel: EducationalLevel) => {
    if (newLevel === selectedLevel) return;
    setSelectedLevel(newLevel);
    // Cargar automáticamente el modelo predeterminado del nuevo nivel
    if (newLevel === 'INICIAL') {
      loadTemplateData(TEMPLATE_INICIAL);
      showToast('Modelo oficial de Educación Inicial cargado automáticamente.', 'info');
    } else if (newLevel === 'PRIMARIA') {
      loadTemplateData(TEMPLATE_PRIMARIA);
      showToast('Modelo oficial de Educación Primaria cargado automáticamente.', 'info');
    } else {
      loadTemplateData(TEMPLATE_MEDIA_GENERAL);
      showToast('Modelo oficial de Educación Media General cargado automáticamente.', 'info');
    }
  };

  // Cargar modelo predeterminado institucional explícitamente
  const handleLoadPreset = () => {
    if (selectedLevel === 'INICIAL') {
      if (areaId === 'ini-ing') {
        if (gradeSection.includes('5')) {
          loadTemplateData(TEMPLATE_INICIAL_ING_5A);
        } else {
          loadTemplateData(TEMPLATE_INICIAL_ING_4A);
        }
        showToast('Plantilla institucional predeterminada de Inglés cargada con éxito.', 'success');
      } else if (areaId === 'ini-inf') {
        if (gradeSection.includes('5')) {
          loadTemplateData(TEMPLATE_INICIAL_INF_5A);
        } else {
          loadTemplateData(TEMPLATE_INICIAL_INF_4A);
        }
        showToast('Plantilla institucional predeterminada de Informática cargada con éxito.', 'success');
      } else if (areaId === 'ini-aje') {
        if (gradeSection.includes('5')) {
          loadTemplateData(TEMPLATE_INICIAL_AJE_5A);
        } else {
          loadTemplateData(TEMPLATE_INICIAL_AJE_4A);
        }
        showToast('Plantilla institucional predeterminada de Ajedrez cargada con éxito.', 'success');
      } else if (areaId === 'ini-nat') {
        if (gradeSection.includes('5')) {
          loadTemplateData(TEMPLATE_INICIAL_NAT_5A);
        } else {
          loadTemplateData(TEMPLATE_INICIAL_NAT_4A);
        }
        showToast('Plantilla institucional predeterminada de Natación cargada con éxito.', 'success');
      } else if (areaId === 'ini-ef') {
        if (gradeSection.includes('5')) {
          loadTemplateData(TEMPLATE_INICIAL_EF_5A);
        } else {
          loadTemplateData(TEMPLATE_INICIAL_EF_4A);
        }
        showToast('Plantilla institucional predeterminada de Educación Física cargada con éxito.', 'success');
      } else if (areaId === 'ini-ap') {
        if (gradeSection.includes('5')) {
          loadTemplateData(TEMPLATE_INICIAL_AP_5A);
        } else {
          loadTemplateData(TEMPLATE_INICIAL_AP_4A);
        }
        showToast('Plantilla institucional predeterminada de Artes Plásticas cargada con éxito.', 'success');
      } else if (gradeSection.includes('5')) {
        loadTemplateData(TEMPLATE_INICIAL_5A);
        showToast('Plantilla institucional predeterminada de Inicial (Sala 5 Años) cargada con éxito.', 'success');
      } else {
        loadTemplateData(TEMPLATE_INICIAL);
        showToast('Plantilla institucional predeterminada de Inicial (Sala 4 Años) cargada con éxito.', 'success');
      }
    } else if (selectedLevel === 'PRIMARIA') {
      if (gradeSection.includes('1') && areaId === 'pri-mat') {
        loadTemplateData(TEMPLATE_PRIMARIA_MAT_1G);
        showToast('Plantilla institucional predeterminada de Matemática (1er Grado) cargada con éxito.', 'success');
      } else if (gradeSection.includes('1') && areaId === 'pri-len') {
        loadTemplateData(TEMPLATE_PRIMARIA_LEN_1G);
        showToast('Plantilla institucional predeterminada de Lenguaje (1er Grado) cargada con éxito.', 'success');
      } else {
        loadTemplateData(TEMPLATE_PRIMARIA);
        showToast('Plantilla institucional predeterminada de Primaria cargada con éxito.', 'success');
      }
    } else {
      loadTemplateData(TEMPLATE_MEDIA_GENERAL);
      showToast('Plantilla institucional predeterminada de Media General cargada con éxito.', 'success');
    }
  };

  // Limpiar formulario para diseñar desde cero
  const handleResetBlank = () => {
    if (window.confirm('¿Deseas vaciar los campos para redactar la planificación desde cero?')) {
      if (selectedLevel === 'INICIAL') {
        loadTemplateData(BLANK_INICIAL_PLAN);
      } else if (selectedLevel === 'PRIMARIA') {
        loadTemplateData(BLANK_PRIMARIA_PLAN);
      } else {
        loadTemplateData(BLANK_MEDIA_PLAN);
      }
      showToast('Formulario en blanco listo para redacción libre.', 'info');
    }
  };

  // Operaciones sobre filas de la matriz curricular
  const handleAddRow = () => {
    const newRow: DidacticPlanRow = {
      id: `row-${Date.now()}`,
      contenidoOReferente: '',
      aprendizajesEsperados: '',
      indicadoresCompetencia: '',
      tecnicasInstrumentos: '',
      criteriosEvaluacion: '',
      ponderacionPercent: selectedLevel === 'MEDIA_GENERAL' ? 10 : undefined
    };
    setRows(prev => [...prev, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    if (rows.length <= 1) {
      alert('La planificación debe contener al menos una fila en la matriz curricular.');
      return;
    }
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const handleUpdateRow = (id: string, field: keyof DidacticPlanRow, value: any) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Inserción ágil desde el Banco de Recursos
  const handleAddResourceToPlan = (resName: string) => {
    setRecursos(prev => {
      const trimmed = prev.trim();
      if (!trimmed) return resName;
      if (trimmed.toLowerCase().includes(resName.toLowerCase())) return trimmed;
      return `${trimmed}, ${resName}`;
    });
    showToast(`Recurso "${resName}" agregado a la sección de Recursos`, 'success');
  };

  // Inserción ágil desde el Banco de Competencias
  const handleInsertCompetencyToRow = (comp: Competency) => {
    if (targetRowIdForBank) {
      setRows(prev => prev.map(r => {
        if (r.id !== targetRowIdForBank) return r;
        return {
          ...r,
          aprendizajesEsperados: comp.title,
          contenidoOReferente: r.contenidoOReferente || comp.description
        };
      }));
      showToast(`Competencia "${comp.code} - ${comp.title}" cargada en la fila`, 'success');
    } else {
      const newRow: DidacticPlanRow = {
        id: `row-${Date.now()}`,
        contenidoOReferente: comp.description,
        aprendizajesEsperados: comp.title,
        indicadoresCompetencia: 'Demuestra dominio operativo y conceptual en las dinámicas planteadas.',
        tecnicasInstrumentos: 'Observación directa y producciones del estudiante',
        criteriosEvaluacion: '• Participación y coherencia en las actividades.',
        ponderacionPercent: selectedLevel === 'MEDIA_GENERAL' ? 20 : undefined
      };
      setRows(prev => [...prev, newRow]);
      showToast(`Nueva fila curricular creada con la competencia "${comp.code}"`, 'success');
    }
  };

  // Inserción ágil desde el Banco de Indicadores & Criterios
  const handleInsertIndicatorToRow = (indicatorText: string, instrument?: string) => {
    const targetId = targetRowIdForBank || (rows[0] ? rows[0].id : null);
    if (!targetId) {
      handleAddRow();
    }
    setRows(prev => prev.map((r, idx) => {
      if (targetId ? r.id === targetId : idx === 0) {
        const currentInd = r.indicadoresCompetencia.trim();
        const updatedInd = currentInd ? `${currentInd}\n• ${indicatorText}` : `• ${indicatorText}`;
        const updatedInst = instrument && !r.tecnicasInstrumentos.includes(instrument)
          ? (r.tecnicasInstrumentos ? `${r.tecnicasInstrumentos} / ${instrument}` : instrument)
          : r.tecnicasInstrumentos;
        return {
          ...r,
          indicadoresCompetencia: updatedInd,
          tecnicasInstrumentos: updatedInst
        };
      }
      return r;
    }));
    showToast(`Indicador curricular insertado en la fila activa`, 'success');
  };

  // Helpers para notificaciones toast
  const showToast = (text: string, type: 'success' | 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sumatoria de ponderación para Media General
  const totalPonderacion = rows.reduce((acc, curr) => acc + (curr.ponderacionPercent || 0), 0);

  // Armar el objeto PlanQuincenal completo
  const buildPlanObject = (newStatus: PlanStatus = status): PlanQuincenal => {
    const combinedActivities = `${actividadesInicio}\n\n${actividadesDesarrollo}\n\n${actividadesCierre}`;
    return {
      id: planId,
      areaId: areaId || levelAreas[0]?.id || '',
      level: selectedLevel,
      gradeSection: gradeSection || (selectedLevel === 'INICIAL' ? 'Sala de 4 Años A' : selectedLevel === 'PRIMARIA' ? '3er Grado A y B' : '4to Año A y B'),
      lapso,
      startDate,
      endDate,
      title: title || `Planificación Didáctica - ${gradeSection}`,
      projectTheme: selectedLevel === 'MEDIA_GENERAL' ? temaGenerador : componente,
      status: newStatus,
      competencyIds: [],
      indicatorIds: [],
      teachingStrategyIds: [],
      evaluationStrategyIds: [],
      pedagogicalActivities: combinedActivities,
      differentiationNotes: 'Atención personalizada y adaptaciones curriculares institucionales CBA.',
      reviewFeedback,
      reviewedBy,
      updatedAt: new Date().toISOString().split('T')[0],
      // Propiedades del Formato Oficial PPTX
      docenteName,
      schoolYear,
      periodoQuincenal,
      componente: selectedLevel !== 'MEDIA_GENERAL' ? componente : undefined,
      temaGenerador: selectedLevel === 'MEDIA_GENERAL' ? temaGenerador : undefined,
      rows,
      actividadesInicio,
      actividadesDesarrollo,
      actividadesCierre,
      recursos,
      fuentesConsulta,
      espaciosTrabajo: selectedLevel === 'INICIAL' ? espaciosTrabajo : undefined,
      rutinaDiaria: selectedLevel === 'INICIAL' ? rutinaDiaria : undefined,
      ejesIntegradores: selectedLevel === 'PRIMARIA' ? ejesIntegradores : undefined,
      tipoProyecto: selectedLevel === 'PRIMARIA' ? tipoProyecto : undefined,
      temaIndispensable: selectedLevel === 'MEDIA_GENERAL' ? temaIndispensable : undefined
    };
  };

  // 1. ACCIÓN: GUARDAR
  const handleSave = () => {
    const plan = buildPlanObject(status);
    savePlanQuincenal(plan);
    showToast('✓ Planificación didáctica guardada exitosamente en el sistema.', 'success');
  };

  // 2. ACCIÓN: ENVIAR A REVISIÓN
  const handleSend = () => {
    const plan = buildPlanObject('A_REVISION');
    setStatus('A_REVISION');
    savePlanQuincenal(plan);
    showToast('🚀 ¡Planificación enviada a Coordinación Pedagógica para su revisión y visto bueno!', 'success');
  };

  // 3. ACCIÓN: COMPARTIR
  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  // 4. ACCIÓN: IMPRIMIR
  const handlePrint = () => {
    window.print();
  };

  const currentAreaObj = areas.find(a => a.id === areaId);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-black transition-all animate-in slide-in-from-top-2 ${
          toastMessage.type === 'success'
            ? 'bg-emerald-600 text-white shadow-emerald-900/30'
            : 'bg-[#2C2E53] text-[#D4AF37] border border-[#D4AF37]/40 shadow-indigo-950/40'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Control Header & Level Selector Banner */}
      <div className="no-print bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <h2 className="text-2xl font-black text-[#2C2E53] dark:text-white">
              Diseñador de Planificación Didáctica
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Formato institucional homologado (2026 - 2027) según los instructivos oficiales de Primaria y Media General.
            </p>
          </div>

          {/* Level Switcher (Inicial vs Primaria vs Media General) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex flex-wrap items-center gap-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => handleLevelChange('INICIAL')}
                className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  selectedLevel === 'INICIAL'
                    ? 'bg-[#2A1E2B] text-amber-300 border border-amber-400/50 shadow-md ring-2 ring-amber-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Educación Inicial</span>
              </button>

              <button
                onClick={() => handleLevelChange('PRIMARIA')}
                className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  selectedLevel === 'PRIMARIA'
                    ? 'bg-[#142621] text-teal-300 border border-teal-400/50 shadow-md ring-2 ring-teal-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Educación Primaria</span>
              </button>

              <button
                onClick={() => handleLevelChange('MEDIA_GENERAL')}
                className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  selectedLevel === 'MEDIA_GENERAL'
                    ? 'bg-[#1A1D36] text-indigo-300 border border-indigo-400/50 shadow-md ring-2 ring-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Educación Media General</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Toolbar: Presets & Return */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleLoadPreset}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-amber-900 dark:text-amber-300 border border-[#D4AF37]/40 rounded-xl text-xs font-extrabold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Cargar Información Predeterminada ({selectedLevel === 'INICIAL' ? 'Inicial' : selectedLevel === 'PRIMARIA' ? 'Primaria' : 'Media General'})</span>
            </button>

            <button
              onClick={handleResetBlank}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Diseñar en Blanco</span>
            </button>

            <button
              onClick={() => {
                setTargetRowIdForBank(null);
                setBankActiveTab('RECURSOS');
                setIsBankModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors"
            >
              <Boxes className="w-3.5 h-3.5 text-amber-300" />
              <span>Banco Curricular & Recursos</span>
            </button>

            {teacherLevelAssignments.length > 0 && (
              <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 p-1 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <span className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300 px-2 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-indigo-500" />
                  <span>Mi Cátedra:</span>
                </span>
                <select
                  onChange={(e) => handleApplyAssignment(e.target.value)}
                  defaultValue=""
                  className="px-2 py-1 bg-white dark:bg-slate-900 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 outline-none cursor-pointer"
                >
                  <option value="" disabled>Cargar cátedra asignada...</option>
                  {teacherLevelAssignments.map((asg: AcademicAssignment) => (
                    <option key={asg.id} value={asg.id}>
                      {asg.areaName} — {asg.grade} Sec. {asg.section}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {onBackToList && (
              <button
                onClick={onBackToList}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 transition-colors"
              >
                ← Volver a lista de quincenas
              </button>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">Estado del documento:</span>
            <span className={`text-xs font-black px-3 py-1 rounded-full border ${
              status === 'DEFINITIVO'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                : status === 'A_REVISION'
                ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300'
                : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
            }`}>
              {status === 'DEFINITIVO' ? '✓ MODELO DEFINITIVO' : status === 'A_REVISION' ? '⌛ EN REVISIÓN PEDAGÓGICA' : '✎ BORRADOR EN PROCESO'}
            </span>
          </div>
        </div>
      </div>

      {/* THE 4 REQUIRED ACTION BUTTONS (Sticky on top / quick access) */}
      <div className="no-print bg-[#2C2E53] text-white p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 border border-[#D4AF37]/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37] text-[#1B1C33] font-black flex items-center justify-center shadow">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              Acciones Oficiales de la Planificación
            </h4>
            <p className="text-[11px] text-slate-300">
              Guarda, envía a coordinación para aprobación, comparte con colegas o imprime en formato apaisado.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 1. GUARDAR */}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-extrabold rounded-xl text-xs transition-colors border border-white/15 shadow-sm"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>GUARDAR</span>
          </button>

          {/* 2. ENVIAR */}
          <button
            onClick={handleSend}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#c49f2c] text-[#1B1C33] font-black rounded-xl text-xs shadow-cba-gold transition-all"
          >
            <Send className="w-4 h-4" />
            <span>ENVIAR A REVISIÓN</span>
          </button>

          {/* 3. COMPARTIR */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600/60 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs transition-colors border border-indigo-400/30"
          >
            <Share2 className="w-4 h-4 text-indigo-200" />
            <span>COMPARTIR</span>
          </button>

          {/* 4. IMPRIMIR */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-white text-slate-800 font-extrabold rounded-xl text-xs transition-colors shadow"
          >
            <Printer className="w-4 h-4 text-slate-700" />
            <span>IMPRIMIR</span>
          </button>
        </div>
      </div>

      {/* Review Feedback Alert (if available) */}
      {reviewFeedback && (
        <div className="no-print bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-extrabold text-xs text-amber-900 dark:text-amber-200">
              Observaciones de Coordinación Pedagógica:
            </h5>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">{reviewFeedback}</p>
          </div>
        </div>
      )}

      {/* ============================================================
          MAIN OFFICIAL FORMAT WORKSPACE (Canvas matching the PPTX)
          ============================================================ */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-xl overflow-hidden printable-sheet print-landscape">
        {/* Printable Institutional Header (Shown on print and top of sheet) */}
        <div className="bg-[#2C2E53] text-white p-5 border-b-2 border-[#D4AF37]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                República Bolivariana de Venezuela • Ministerio del Poder Popular para la Educación
              </div>
              <h1 className="text-lg md:text-xl font-black uppercase text-white tracking-wide mt-0.5">
                U.C.E. COLEGIO BELLAS ARTES
              </h1>
              <p className="text-xs font-bold text-slate-300">
                PLANIFICACIÓN DIDÁCTICA — EDUCACIÓN {selectedLevel === 'INICIAL' ? 'INICIAL' : selectedLevel === 'PRIMARIA' ? 'PRIMARIA' : 'MEDIA GENERAL'}
              </p>
            </div>
            <div className="text-right sm:text-right flex flex-col items-center sm:items-end">
              <span className="text-[10px] font-black px-2.5 py-1 bg-[#D4AF37] text-[#1B1C33] rounded-lg uppercase tracking-wider">
                AÑO ESCOLAR {schoolYear}
              </span>
              <span className="text-[11px] text-slate-300 font-semibold mt-1">
                {selectedLevel === 'INICIAL' ? 'Formato Cualitativo Inicial' : selectedLevel === 'PRIMARIA' ? 'Formato Cualitativo Primaria' : 'Formato Ponderado Media General'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 1. OFFICIAL HEADER GRID (Área, Docente, Curso, Lapso, Año, Periodo, Componente / Tema Generador) */}
          <div className="border-2 border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/30">
            {/* Top row fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-300 dark:divide-slate-700 border-b-2 border-slate-300 dark:border-slate-700">
              {/* ÁREA DE FORMACIÓN */}
              <div className="p-3 lg:col-span-2">
                <label className="block text-[10px] font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase tracking-wider mb-1">
                  Área de Formación:
                </label>
                <div className="no-print">
                  <select
                    value={areaId}
                    onChange={(e) => setAreaId(e.target.value)}
                    className="w-full text-xs font-extrabold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53]"
                  >
                    {levelAreas.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.code})</option>
                    ))}
                  </select>
                </div>
                <div className="hidden print:block text-xs font-black text-slate-900">
                  {currentAreaObj?.name || 'Área de Formación'}
                </div>
              </div>

              {/* DOCENTE */}
              <div className="p-3 lg:col-span-2">
                <label className="block text-[10px] font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase tracking-wider mb-1">
                  Docente:
                </label>
                <input
                  type="text"
                  value={docenteName}
                  onChange={(e) => setDocenteName(e.target.value)}
                  placeholder="Nombre y Apellido del Docente..."
                  className="w-full text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53] print:border-none print:p-0"
                />
              </div>

              {/* CURSO */}
              <div className="p-3">
                <label className="block text-[10px] font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase tracking-wider mb-1">
                  Curso:
                </label>
                <input
                  type="text"
                  list="grade-section-options"
                  value={gradeSection}
                  onChange={(e) => setGradeSection(e.target.value)}
                  placeholder={selectedLevel === 'INICIAL' ? 'Sala de 4 Años A' : selectedLevel === 'PRIMARIA' ? '3er Grado A y B' : '4to Año A y B'}
                  className="w-full text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53] print:border-none print:p-0"
                />
                <datalist id="grade-section-options">
                  {LEVEL_GRADES_CATALOG[selectedLevel].flatMap(g => [
                    <option key={`${g} A`} value={`${g} A`} />,
                    <option key={`${g} B`} value={`${g} B`} />,
                    <option key={`${g} A y B`} value={`${g} A y B`} />
                  ])}
                </datalist>
              </div>

              {/* LAPSO */}
              <div className="p-3">
                <label className="block text-[10px] font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase tracking-wider mb-1">
                  Lapso:
                </label>
                <div className="no-print">
                  <select
                    value={lapso}
                    onChange={(e) => setLapso(Number(e.target.value) as 1 | 2 | 3)}
                    className="w-full text-xs font-black bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-1.5 rounded-lg border border-slate-300 dark:border-slate-600"
                  >
                    <option value={1}>1° Lapso</option>
                    <option value={2}>2° Lapso</option>
                    <option value={3}>3° Lapso</option>
                  </select>
                </div>
                <div className="hidden print:block text-xs font-black text-slate-900">
                  {lapso}° Lapso
                </div>
              </div>
            </div>

            {/* Second row: Periodo & Campos Especializados por Subsistema */}
            <div className="grid grid-cols-1 lg:grid-cols-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-300 dark:divide-slate-700">
              {/* PERIODO (Quincenal / Lapso) */}
              <div className="p-3 lg:col-span-2 bg-slate-100/60 dark:bg-slate-800/60">
                <label className="block text-[10px] font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase tracking-wider mb-1">
                  {selectedLevel === 'INICIAL' ? 'Período Quincenal / Quincena:' : selectedLevel === 'PRIMARIA' ? 'Período del PA:' : 'Período Quincenal:'}
                </label>
                <input
                  type="text"
                  value={periodoQuincenal}
                  onChange={(e) => setPeriodoQuincenal(e.target.value)}
                  placeholder="ej: 21/09 al 02/10/2026"
                  className="w-full text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 print:border-none print:p-0"
                />
              </div>

              {/* CAMPOS ESPECÍFICOS SEGÚN NIVEL */}
              {selectedLevel === 'INICIAL' && (
                <div className="p-3 lg:col-span-4 bg-amber-50/40 dark:bg-amber-950/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase tracking-wider mb-1">
                        COMPONENTE DE EDUCACIÓN INICIAL:
                      </label>
                      <textarea
                        rows={2}
                        value={componente}
                        onChange={(e) => setComponente(e.target.value)}
                        placeholder="Componente curricular articulador..."
                        className="w-full text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53] print:border-none print:p-0"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase tracking-wider mb-1">
                        CENTRO DE INTERÉS / TEMA DEL PROYECTO:
                      </label>
                      <textarea
                        rows={2}
                        value={projectTheme}
                        onChange={(e) => setProjectTheme(e.target.value)}
                        placeholder="Título lúdico del proyecto infantil..."
                        className="w-full text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53] print:border-none print:p-0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedLevel === 'PRIMARIA' && (
                <div className="p-3 lg:col-span-4 bg-teal-50/40 dark:bg-teal-950/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase tracking-wider mb-1">
                        PROYECTO DE APRENDIZAJE (PA) / TEMA:
                      </label>
                      <textarea
                        rows={2}
                        value={tipoProyecto || projectTheme}
                        onChange={(e) => {
                          setTipoProyecto(e.target.value);
                          setProjectTheme(e.target.value);
                        }}
                        placeholder="Nombre oficial del Proyecto de Aprendizaje..."
                        className="w-full text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53] print:border-none print:p-0"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase tracking-wider mb-1">
                        COMPONENTE INSTITUCIONAL:
                      </label>
                      <textarea
                        rows={2}
                        value={componente}
                        onChange={(e) => setComponente(e.target.value)}
                        placeholder="Componente curricular articulador del PA..."
                        className="w-full text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53] print:border-none print:p-0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedLevel === 'MEDIA_GENERAL' && (
                <div className="p-3 lg:col-span-4 bg-indigo-50/40 dark:bg-indigo-950/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase tracking-wider mb-1">
                        TEMA INDISPENSABLE:
                      </label>
                      <textarea
                        rows={2}
                        value={temaIndispensable}
                        onChange={(e) => setTemaIndispensable(e.target.value)}
                        placeholder="Tema indispensable ministerial..."
                        className="w-full text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53] print:border-none print:p-0"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase tracking-wider mb-1">
                        TEMA GENERADOR:
                      </label>
                      <textarea
                        rows={2}
                        value={temaGenerador}
                        onChange={(e) => setTemaGenerador(e.target.value)}
                        placeholder="Tema generador del área..."
                        className="w-full text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53] print:border-none print:p-0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. OFFICIAL CURRICULAR GRID TABLE (Matriz Curricular) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2C2E53] dark:bg-[#D4AF37]"></span>
                <h3 className="text-xs font-black uppercase text-[#2C2E53] dark:text-white tracking-wider">
                  Matriz Curricular y de Evaluación
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                className="no-print flex items-center gap-1.5 px-3 py-1.5 bg-[#2C2E53] hover:bg-[#383b69] text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>+ Agregar Fila Curricular</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border-2 border-slate-300 dark:border-slate-700">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-[#2C2E53] text-white border-b-2 border-slate-400">
                    {/* Col 1 */}
                    <th className="p-3 font-black text-[11px] uppercase tracking-wider w-1/4 border-r border-slate-400">
                      {selectedLevel === 'INICIAL'
                        ? 'ÁREA DE APRENDIZAJE / COMPONENTE'
                        : selectedLevel === 'PRIMARIA'
                        ? 'CONTENIDOS PROGRAMÁTICOS (PA)'
                        : 'TEJIDO TEMÁTICO / REFERENTES TEÓRICOS-PRÁCTICOS'}
                    </th>
                    {/* Col 2 */}
                    <th className="p-3 font-black text-[11px] uppercase tracking-wider w-1/4 border-r border-slate-400">
                      APRENDIZAJES ESPERADOS
                    </th>
                    {/* Col 3 */}
                    <th className="p-3 font-black text-[11px] uppercase tracking-wider w-1/4 border-r border-slate-400">
                      {selectedLevel === 'INICIAL'
                        ? 'INDICADORES FORMATIVOS (LITERAL A-E)'
                        : selectedLevel === 'PRIMARIA'
                        ? 'INDICADORES DE COMPETENCIA (L / EP / I)'
                        : 'INDICADORES DE COMPETENCIA'}
                    </th>
                    {/* Col 4 */}
                    <th className="p-3 font-black text-[11px] uppercase tracking-wider w-1/4 border-r border-slate-400">
                      <div>TÉCNICAS E INSTRUMENTOS DE EVALUACIÓN</div>
                      <div className="text-[9px] font-semibold text-[#D4AF37] mt-0.5">/ CRITERIOS OBSERVABLES</div>
                    </th>
                    {/* Col 5 (Solo Media General) */}
                    {selectedLevel === 'MEDIA_GENERAL' && (
                      <th className="p-3 font-black text-[11px] uppercase tracking-wider text-center w-20 border-r border-slate-400 bg-[#1B1C33]">
                        POND (%)
                      </th>
                    )}
                    {/* Acciones (Oculto en print) */}
                    <th className="p-3 font-black text-[10px] text-center w-14 no-print">
                      ACC
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-300 dark:divide-slate-700">
                  {rows.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      {/* Col 1: Contenido o Referente */}
                      <td className="p-2.5 border-r border-slate-300 dark:border-slate-700 align-top">
                        <textarea
                          rows={4}
                          value={row.contenidoOReferente}
                          onChange={(e) => handleUpdateRow(row.id, 'contenidoOReferente', e.target.value)}
                          placeholder={selectedLevel !== 'MEDIA_GENERAL' ? 'Temas y subtemas derivados del componente...' : 'Tejido temático y referentes teórico-prácticos...'}
                          className="w-full text-xs bg-transparent border-0 focus:ring-1 focus:ring-[#2C2E53] p-1 rounded resize-y"
                        />
                      </td>

                      {/* Col 2: Aprendizajes Esperados */}
                      <td className="p-2.5 border-r border-slate-300 dark:border-slate-700 align-top">
                        <textarea
                          rows={4}
                          value={row.aprendizajesEsperados}
                          onChange={(e) => handleUpdateRow(row.id, 'aprendizajesEsperados', e.target.value)}
                          placeholder="Logros conceptuales, procedimentales y actitudinales esperados..."
                          className="w-full text-xs bg-transparent border-0 focus:ring-1 focus:ring-[#2C2E53] p-1 rounded resize-y"
                        />
                      </td>

                      {/* Col 3: Indicadores de Competencia */}
                      <td className="p-2.5 border-r border-slate-300 dark:border-slate-700 align-top">
                        <textarea
                          rows={4}
                          value={row.indicadoresCompetencia}
                          onChange={(e) => handleUpdateRow(row.id, 'indicadoresCompetencia', e.target.value)}
                          placeholder="• Indicadores observables y medibles..."
                          className="w-full text-xs bg-transparent border-0 focus:ring-1 focus:ring-[#2C2E53] p-1 rounded resize-y font-mono"
                        />
                      </td>

                      {/* Col 4: Técnicas e Instrumentos / Criterios de Evaluación */}
                      <td className="p-2.5 border-r border-slate-300 dark:border-slate-700 align-top space-y-2">
                        <div>
                          <label className="block text-[9px] font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase">
                            Técnicas e Instrumentos:
                          </label>
                          <textarea
                            rows={2}
                            value={row.tecnicasInstrumentos}
                            onChange={(e) => handleUpdateRow(row.id, 'tecnicasInstrumentos', e.target.value)}
                            placeholder="Técnica: ... / Instrumento: ..."
                            className="w-full text-[11px] bg-transparent border-0 focus:ring-1 focus:ring-[#2C2E53] p-1 rounded resize-y"
                          />
                        </div>
                        <div className="pt-1.5 border-t border-dashed border-slate-300 dark:border-slate-700">
                          <label className="block text-[9px] font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase">
                            Criterios de Evaluación:
                          </label>
                          <textarea
                            rows={2}
                            value={row.criteriosEvaluacion}
                            onChange={(e) => handleUpdateRow(row.id, 'criteriosEvaluacion', e.target.value)}
                            placeholder="• Criterios específicos observables..."
                            className="w-full text-[11px] bg-transparent border-0 focus:ring-1 focus:ring-[#2C2E53] p-1 rounded resize-y"
                          />
                        </div>
                      </td>

                      {/* Col 5: Ponderación % (Solo Media General) */}
                      {selectedLevel === 'MEDIA_GENERAL' && (
                        <td className="p-2.5 border-r border-slate-300 dark:border-slate-700 align-top text-center bg-indigo-50/20 dark:bg-indigo-950/20">
                          <input
                            type="number"
                            min={5}
                            max={30}
                            value={row.ponderacionPercent ?? 0}
                            onChange={(e) => handleUpdateRow(row.id, 'ponderacionPercent', Number(e.target.value))}
                            className="w-16 text-center font-black text-sm bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53]"
                          />
                          <span className="block text-[9px] font-bold text-slate-400 mt-1">
                            (5% a 30%)
                          </span>
                        </td>
                      )}

                      {/* Acciones */}
                      <td className="p-2.5 text-center align-middle no-print">
                        <div className="flex flex-col items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setTargetRowIdForBank(row.id);
                              setBankActiveTab('COMPETENCIAS');
                              setIsBankModalOpen(true);
                            }}
                            title="Insertar desde Banco Curricular"
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
                          >
                            <Boxes className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(row.id)}
                            title="Eliminar fila"
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Footer de Ponderación (Media General) */}
                {selectedLevel === 'MEDIA_GENERAL' && (
                  <tfoot>
                    <tr className="bg-slate-100 dark:bg-slate-800 font-extrabold text-xs border-t-2 border-slate-400">
                      <td colSpan={4} className="p-3 text-right text-slate-700 dark:text-slate-300">
                        TOTAL PONDERACIÓN ASIGNADA:
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-md font-black text-xs ${
                          totalPonderacion >= 5 && totalPonderacion <= 100
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {totalPonderacion}%
                        </span>
                      </td>
                      <td className="no-print"></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* 3. DIDACTIC SEQUENCE (MOMENTOS DE LA CLASE: I, D, C) & RECURSOS / FUENTES */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Wide Box: Momentos de la Clase (Inicio, Desarrollo, Cierre) */}
            <div className="lg:col-span-2 border-2 border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/30">
              <div className="bg-[#2C2E53] text-white px-4 py-2.5 flex items-center justify-between">
                <span className="font-black text-xs uppercase tracking-wider">
                  ACTIVIDADES DIDÁCTICAS (Instrucciones claras y precisas / Momentos de la clase)
                </span>
                <span className="text-[10px] font-bold text-[#D4AF37]">
                  Secuencia I - D - C
                </span>
              </div>

              <div className="p-4 space-y-4">
                {/* Momento: Inicio */}
                <div>
                  <label className="block text-xs font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase mb-1">
                    (I) Inicio:
                  </label>
                  <textarea
                    rows={3}
                    value={actividadesInicio}
                    onChange={(e) => setActividadesInicio(e.target.value)}
                    placeholder="Motivación, activación de saberes previos, formulación del propósito..."
                    className="w-full text-xs bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53] leading-relaxed"
                  />
                </div>

                {/* Momento: Desarrollo */}
                <div>
                  <label className="block text-xs font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase mb-1">
                    (D) Desarrollo:
                  </label>
                  <textarea
                    rows={4}
                    value={actividadesDesarrollo}
                    onChange={(e) => setActividadesDesarrollo(e.target.value)}
                    placeholder="Construcción activa del conocimiento, práctica guiada e independiente, trabajo colaborativo..."
                    className="w-full text-xs bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53] leading-relaxed"
                  />
                </div>

                {/* Momento: Cierre */}
                <div>
                  <label className="block text-xs font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase mb-1">
                    (C) Cierre:
                  </label>
                  <textarea
                    rows={3}
                    value={actividadesCierre}
                    onChange={(e) => setActividadesCierre(e.target.value)}
                    placeholder="Sistematización de ideas clave, metacognición, evaluación formativa y orientaciones..."
                    className="w-full text-xs bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53] leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Right Side: Recursos y Fuentes de Consulta */}
            <div className="space-y-4 flex flex-col">
              {/* RECURSOS */}
              <div className="border-2 border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/30 flex-1">
                <div className="bg-[#2C2E53] text-white px-4 py-2">
                  <span className="font-black text-xs uppercase tracking-wider">
                    RECURSOS
                  </span>
                </div>
                <div className="p-3">
                  <textarea
                    rows={5}
                    value={recursos}
                    onChange={(e) => setRecursos(e.target.value)}
                    placeholder="Pizarrón, rotafolios, video beam, software educativo, instrumentos, textos..."
                    className="w-full text-xs bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53] leading-relaxed"
                  />
                </div>
              </div>

              {/* FUENTES DE CONSULTA */}
              <div className="border-2 border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/30 flex-1">
                <div className="bg-[#2C2E53] text-white px-4 py-2">
                  <span className="font-black text-xs uppercase tracking-wider">
                    FUENTES DE CONSULTA
                  </span>
                </div>
                <div className="p-3">
                  <textarea
                    rows={5}
                    value={fuentesConsulta}
                    onChange={(e) => setFuentesConsulta(e.target.value)}
                    placeholder="Libros de texto, enciclopedias, páginas confiables, videos educativos..."
                    className="w-full text-xs bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53] leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3.1 ADAPTIVE SUBSYSTEM SECTIONS (Inicial: Espacios y Rutina / Primaria: Ejes Integradores) */}
          {selectedLevel === 'INICIAL' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Rincones y Espacios de Trabajo */}
              <div className="border-2 border-amber-300 dark:border-amber-700/60 rounded-xl overflow-hidden bg-amber-50/40 dark:bg-amber-950/20">
                <div className="bg-[#2C2E53] text-[#D4AF37] px-4 py-2.5 flex items-center justify-between">
                  <span className="font-black text-xs uppercase tracking-wider">
                    ESPACIOS Y RINCONES DE APRENDIZAJE
                  </span>
                  <span className="text-[10px] font-bold text-slate-300">
                    Educación Inicial
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Distribución de dinámicas por rincones: Expresión Plástica, Construcción, Juegos Simbólicos, Biblioteca o Experimentación.
                  </p>
                  <textarea
                    rows={4}
                    value={espaciosTrabajo}
                    onChange={(e) => setEspaciosTrabajo(e.target.value)}
                    placeholder="Ej: Espacio de Armar y Construir: Bloques lógicos...\nEspacio de Dramatización: Rincones lúdicos del hogar..."
                    className="w-full text-xs bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53] leading-relaxed"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Rincón de Construcción', 'Expresión Plástica', 'Juegos Simbólicos', 'Biblioteca y Cuentos'].map((rincon) => (
                      <button
                        key={rincon}
                        type="button"
                        onClick={() => setEspaciosTrabajo(prev => prev ? `${prev}\n• ${rincon}: ` : `• ${rincon}: `)}
                        className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 text-[10px] font-bold rounded-md hover:bg-amber-200 transition-colors"
                      >
                        + {rincon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rutina Diaria de la Jornada Infantil */}
              <div className="border-2 border-amber-300 dark:border-amber-700/60 rounded-xl overflow-hidden bg-amber-50/40 dark:bg-amber-950/20">
                <div className="bg-[#2C2E53] text-[#D4AF37] px-4 py-2.5 flex items-center justify-between">
                  <span className="font-black text-xs uppercase tracking-wider">
                    RUTINA DIARIA Y MOMENTOS DE LA JORNADA
                  </span>
                  <span className="text-[10px] font-bold text-slate-300">
                    Rutina Pedagógica
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Secuencia de períodos de la jornada escolar en Educación Inicial (Llegada, Alimentación, Actividades Colectivas, Despedida).
                  </p>
                  <textarea
                    rows={4}
                    value={rutinaDiaria}
                    onChange={(e) => setRutinaDiaria(e.target.value)}
                    placeholder="Ej: Bienvenida afectiva y ronda de canciones...\nAseo y merienda colectiva...\nTrabajo en pequeños grupos en los espacios...\nOrden y despedida..."
                    className="w-full text-xs bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53] leading-relaxed"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Bienvenida y Saludo', 'Alimentación y Merienda', 'Aseo e Higiene', 'Juego Libre', 'Despedida'].map((momento) => (
                      <button
                        key={momento}
                        type="button"
                        onClick={() => setRutinaDiaria(prev => prev ? `${prev}\n• ${momento}: ` : `• ${momento}: `)}
                        className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 text-[10px] font-bold rounded-md hover:bg-amber-200 transition-colors"
                      >
                        + {momento}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedLevel === 'PRIMARIA' && (
            <div className="border-2 border-teal-300 dark:border-teal-700/60 rounded-xl overflow-hidden bg-teal-50/40 dark:bg-teal-950/20 pt-2">
              <div className="bg-[#2C2E53] text-teal-300 px-4 py-2.5 flex items-center justify-between">
                <span className="font-black text-xs uppercase tracking-wider">
                  EJES INTEGRADORES Y ARTICULACIÓN DEL PROYECTO DE APRENDIZAJE (PA)
                </span>
                <span className="text-[10px] font-bold text-[#D4AF37]">
                  Currículo de Primaria
                </span>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Articulación transversal con los ejes oficiales: Ambiente y Salud Integral, Interculturalidad, Tecnologías de la Información y Comunicación (TIC), Derechos Humanos y Cultura de Paz, Trabajo Liberador.
                </p>
                <textarea
                  rows={3}
                  value={ejesIntegradores}
                  onChange={(e) => setEjesIntegradores(e.target.value)}
                  placeholder="Describa cómo el Proyecto de Aprendizaje aborda transversalmente los ejes integradores institucionales..."
                  className="w-full text-xs bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#2C2E53] leading-relaxed"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'Ambiente y Salud Integral',
                    'Interculturalidad y Valores',
                    'Tecnología de la Información (TIC)',
                    'Trabajo Liberador',
                    'Derechos Humanos y Cultura de Paz'
                  ].map((eje) => (
                    <button
                      key={eje}
                      type="button"
                      onClick={() => setEjesIntegradores(prev => prev ? `${prev}\n• ${eje}: ` : `• ${eje}: `)}
                      className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/40 text-teal-900 dark:text-teal-200 text-[10px] font-bold rounded-md hover:bg-teal-200 transition-colors"
                    >
                      + {eje}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. OFFICIAL SIGNATURES & VALIDATION FOOTER (Print & Official Visuals) */}
          <div className="pt-6 border-t-2 border-slate-300 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
            {/* Signature 1: Docente */}
            <div className="flex flex-col items-center">
              <div className="w-64 border-b-2 border-slate-600 dark:border-slate-400 mb-2 h-12 flex items-end justify-center">
                <span className="text-xs font-bold text-slate-400 italic print:hidden">
                  (Firma Digital / Autógrafa)
                </span>
              </div>
              <span className="text-xs font-black text-[#2C2E53] dark:text-white uppercase">
                {docenteName || 'Docente Especialista'}
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                Docente de {currentAreaObj?.name || 'Área'} • U.C.E. Colegio Bellas Artes
              </span>
            </div>

            {/* Signature 2: Coordinación */}
            <div className="flex flex-col items-center">
              <div className="w-64 border-b-2 border-slate-600 dark:border-slate-400 mb-2 h-12 flex items-end justify-center">
                <span className="text-xs font-bold text-slate-400 italic print:hidden">
                  (Sello y Visto Bueno Institucional)
                </span>
              </div>
              <span className="text-xs font-black text-[#2C2E53] dark:text-white uppercase">
                {reviewedBy || (selectedLevel === 'INICIAL' ? 'Coordinación Pedagógica Inicial' : selectedLevel === 'PRIMARIA' ? 'Coordinación Pedagógica Primaria' : 'Coordinación Pedagógica Media General')}
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                Dirección Académica / Control de Estudios
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <SharePlanModal
        plan={buildPlanObject()}
        areaName={currentAreaObj?.name || 'Área General'}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Modal Interactivo: Banco Curricular & Recursos Didácticos */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Cabecera del Modal */}
            <div className="bg-[#2C2E53] text-white p-5 border-b-2 border-[#D4AF37] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37] text-[#1B1C33] flex items-center justify-center font-black shadow-md">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    Banco Curricular & Recursos Didácticos
                    <span className="text-[10px] bg-[#D4AF37] text-[#1B1C33] px-2 py-0.5 rounded-full font-black uppercase">
                      {selectedLevel.replace('_', ' ')}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    {targetRowIdForBank
                      ? `Destino: Fila de la matriz curricular seleccionada`
                      : 'Inserte recursos al plan o añada competencias e indicadores'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBankModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pestañas del Modal y Buscador */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setBankActiveTab('RECURSOS')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                    bankActiveTab === 'RECURSOS'
                      ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Boxes className="w-4 h-4" />
                  <span>Recursos Didácticos ({educationalResources.filter(r => r.level === selectedLevel).length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBankActiveTab('COMPETENCIAS')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                    bankActiveTab === 'COMPETENCIAS'
                      ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Competencias ({competencies.filter(c => c.level === selectedLevel).length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBankActiveTab('INDICADORES')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                    bankActiveTab === 'INDICADORES'
                      ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  <span>Indicadores & Criterios</span>
                </button>
              </div>

              {/* Input de Búsqueda */}
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  placeholder={`Buscar en ${bankActiveTab.toLowerCase()}...`}
                  className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#2C2E53]"
                />
              </div>
            </div>

            {/* Contenido Dinámico con Scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* TAB 1: RECURSOS */}
              {bankActiveTab === 'RECURSOS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {educationalResources
                    .filter(res => res.level === selectedLevel)
                    .filter(res =>
                      !bankSearch ||
                      res.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
                      res.category.toLowerCase().includes(bankSearch.toLowerCase()) ||
                      ((res.specifications || res.description) && (res.specifications || res.description)!.toLowerCase().includes(bankSearch.toLowerCase()))
                    )
                    .map(res => (
                      <div
                        key={res.id}
                        className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#D4AF37] transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="font-black text-xs text-[#2C2E53] dark:text-white">
                              {res.name}
                            </span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              {res.category.replace('_', ' ')}
                            </span>
                          </div>
                          {(res.specifications || res.description) && (
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                              {res.specifications || res.description}
                            </p>
                          )}
                          <div className="text-[10px] text-slate-500 font-bold mb-3">
                            Disponibles: <strong className="text-emerald-600 dark:text-emerald-400">{res.availableQuantity ?? res.quantity ?? 1}</strong> de {res.totalQuantity ?? res.quantity ?? 1} unidades
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddResourceToPlan(res.name)}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-[#2C2E53] hover:bg-[#393b68] text-[#D4AF37] text-xs font-black rounded-xl transition-colors shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Añadir al Plan</span>
                        </button>
                      </div>
                    ))}
                  {educationalResources.filter(res => res.level === selectedLevel).length === 0 && (
                    <div className="col-span-2 text-center py-8 text-slate-400 text-xs font-bold">
                      No hay recursos precargados para {selectedLevel.replace('_', ' ')}.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: COMPETENCIAS */}
              {bankActiveTab === 'COMPETENCIAS' && (
                <div className="space-y-3">
                  {competencies
                    .filter(c => c.level === selectedLevel)
                    .filter(c =>
                      !bankSearch ||
                      c.title.toLowerCase().includes(bankSearch.toLowerCase()) ||
                      c.code.toLowerCase().includes(bankSearch.toLowerCase()) ||
                      c.description.toLowerCase().includes(bankSearch.toLowerCase())
                    )
                    .map(comp => (
                      <div
                        key={comp.id}
                        className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#D4AF37] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#2C2E53] text-[#D4AF37]">
                              {comp.code}
                            </span>
                            <span className="font-extrabold text-xs text-[#2C2E53] dark:text-white">
                              {comp.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {comp.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleInsertCompetencyToRow(comp)}
                          className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 bg-[#D4AF37] hover:bg-[#c49f2c] text-[#1B1C33] text-xs font-black rounded-xl shadow-xs transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{targetRowIdForBank ? 'Cargar en Fila' : '+ Crear Fila'}</span>
                        </button>
                      </div>
                    ))}
                  {competencies.filter(c => c.level === selectedLevel).length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs font-bold">
                      No hay competencias registradas para este nivel en el banco oficial.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: INDICADORES & CRITERIOS */}
              {bankActiveTab === 'INDICADORES' && (
                <div className="space-y-3">
                  {[
                    ...INITIAL_DIAGNOSTIC_CRITERIA
                      .filter(diag => diag.level === selectedLevel)
                      .map(diag => ({
                        id: diag.id,
                        text: diag.criterion || diag.description || diag.name,
                        domain: diag.domain || diag.category || diag.code,
                        instrument: diag.instrument || 'Observación directa'
                      })),
                    ...indicators
                      .filter(ind => ind.level === selectedLevel)
                      .map(ind => ({
                        id: ind.id,
                        text: ind.description,
                        domain: ind.code,
                        instrument: ind.evaluationInstrument || 'Observación directa'
                      }))
                  ]
                    .filter(item =>
                      !bankSearch ||
                      item.text.toLowerCase().includes(bankSearch.toLowerCase()) ||
                      (item.domain && item.domain.toLowerCase().includes(bankSearch.toLowerCase()))
                    )
                    .map((item, idx) => (
                      <div
                        key={`${item.id}-${idx}`}
                        className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#D4AF37] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                              {item.domain || 'Criterio Observador'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              Sugerido: {item.instrument}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            • {item.text}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleInsertIndicatorToRow(item.text, item.instrument)}
                          className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2C2E53] hover:bg-[#393b68] text-white text-xs font-black rounded-xl transition-colors shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Insertar Indicador</span>
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Pie del modal */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-bold">
                Haga clic sobre cualquier recurso o criterio para vincularlo inmediatamente.
              </span>
              <button
                type="button"
                onClick={() => setIsBankModalOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-xs font-black transition-colors"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
