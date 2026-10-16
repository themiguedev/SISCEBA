import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QualitativeScore,
  LiteralScore,
  EducationalLevel,
  ChecklistScoreItem,
  DiagnosticCriterion,
  AcademicAssignment
} from '../../types';
import { INITIAL_DIAGNOSTIC_CRITERIA } from '../../data/seedData';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  ClipboardCheck,
  BarChart3,
  FileText,
  Printer,
  CheckCircle2,
  AlertCircle,
  Save,
  User,
  Sparkles,
  Bot,
  BrainCircuit,
  Filter,
  Check,
  RotateCcw,
  AlertTriangle,
  Info,
  TrendingUp,
  Layers,
  ChevronRight,
  Lock
} from 'lucide-react';

type DiagnosticTab = 'LISTA_COTEJO' | 'ANALITICA_GLOBAL' | 'FICHA_INDIVIDUAL';

export const DiagnosticView: React.FC = () => {
  const {
    levelStudents,
    levelAreas,
    currentLevel,
    activeLapso,
    evaluations,
    currentTeacherAssignments,
    currentUser,
    currentRole,
    isLapsoOpenForGrading,
    getLapsoGradingStatus,
    bulkRecordEvaluations
  } = useApp();

  const gradingStatus = getLapsoGradingStatus(activeLapso);
  const isLockedForTeacher = !isLapsoOpenForGrading && currentRole === 'DOCENTE';
  const isSupervisorOverride = !isLapsoOpenForGrading && (currentRole === 'ADMINISTRADOR' || currentRole === 'DIRECTOR' || currentRole === 'COORDINACION');

  // Pestaña activa
  const [activeTab, setActiveTab] = useState<DiagnosticTab>('LISTA_COTEJO');

  // Filtros de Cátedra, Grado y Sección (REGLA 4: Exclusivamente Secciones 'A' y 'B')
  const [selectedGrade, setSelectedGrade] = useState<string>('TODOS');
  const [selectedSection, setSelectedSection] = useState<'TODAS' | 'A' | 'B'>('TODAS');
  const [selectedAreaId, setSelectedAreaId] = useState<string>(
    currentLevel === 'INICIAL'
      ? levelAreas.find(a => a.name.toLowerCase().includes('robótica') || a.name.toLowerCase().includes('informática'))?.id || levelAreas[0]?.id || ''
      : levelAreas[0]?.id || ''
  );

  // Estudiante seleccionado para la ficha individual
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [isSavedBanner, setIsSavedBanner] = useState<boolean>(false);

  // Área activa seleccionada
  const currentArea = levelAreas.find(a => a.id === selectedAreaId) || levelAreas[0];
  const isRoboticsSpecial =
    currentLevel === 'INICIAL' &&
    (currentArea?.name.toLowerCase().includes('informática') || currentArea?.name.toLowerCase().includes('robótica'));

  // Obtener los grados únicos presentes en los estudiantes del nivel
  const availableGrades = useMemo(() => {
    const gradesSet = new Set<string>();
    levelStudents.forEach(s => {
      if (s.grade) gradesSet.add(s.grade);
    });
    return Array.from(gradesSet);
  }, [levelStudents]);

  // Estudiantes filtrados por grado y sección (defensivo ante nómina vacía)
  const filteredStudents = useMemo(() => {
    return levelStudents.filter(stu => {
      const matchGrade = selectedGrade === 'TODOS' || stu.grade === selectedGrade;
      const matchSection = selectedSection === 'TODAS' || stu.section === selectedSection;
      return matchGrade && matchSection;
    });
  }, [levelStudents, selectedGrade, selectedSection]);

  // Si cambia la lista filtrada y no hay estudiante seleccionado para la ficha, seleccionar el primero
  useEffect(() => {
    if (filteredStudents.length > 0 && (!selectedStudentId || !filteredStudents.find(s => s.id === selectedStudentId))) {
      setSelectedStudentId(filteredStudents[0].id);
    }
  }, [filteredStudents, selectedStudentId]);

  // Criterios observables para el área y nivel actual
  const currentCriteria: DiagnosticCriterion[] = useMemo(() => {
    // 1. Buscar en INITIAL_DIAGNOSTIC_CRITERIA criterios del nivel y área
    const matched = INITIAL_DIAGNOSTIC_CRITERIA.filter(c => {
      if (c.level !== currentLevel) return false;
      const areaName = currentArea?.name?.toLowerCase() || '';
      const domainStr = (c.domain || c.category || c.name || '').toLowerCase();
      if (areaName.includes('física') || areaName.includes('deporte')) return domainStr.includes('física') || domainStr.includes('motriz');
      if (areaName.includes('robótica') || areaName.includes('computación') || areaName.includes('informática')) return domainStr.includes('robótica') || domainStr.includes('tecnología');
      if (areaName.includes('lengua') || areaName.includes('castellano') || areaName.includes('inglés')) return domainStr.includes('lenguaje') || domainStr.includes('comunicación');
      if (areaName.includes('matemática')) return domainStr.includes('lógica') || domainStr.includes('matemática');
      return true;
    });

    if (matched.length >= 3) return matched.slice(0, 5);

    // 2. Si no hay suficientes específicos, retornar criterios diagnósticos estándar robustos
    if (currentLevel === 'INICIAL') {
      return [
        {
          id: 'crit-ini-1',
          code: 'INI-DIAG-01',
          name: 'Expresión y Lenguaje',
          description: 'Expresa ideas y necesidades con fluidez verbal y gestual en las actividades de bienvenida.',
          criterion: 'Expresa ideas y necesidades con fluidez verbal y gestual en las actividades de bienvenida.',
          domain: 'Lenguaje y Comunicación',
          instrument: 'Lista de Cotejo',
          scaleType: 'Cualitativa (L/EP/I)',
          level: 'INICIAL',
          areaId: selectedAreaId
        },
        {
          id: 'crit-ini-2',
          code: 'INI-DIAG-02',
          name: 'Desarrollo Psicomotor',
          description: 'Demuestra control motriz fino en el agarre y manipulación de materiales lúdicos.',
          criterion: 'Demuestra control motriz fino en el agarre y manipulación de materiales lúdicos.',
          domain: 'Desarrollo Psicomotor',
          instrument: 'Lista de Cotejo',
          scaleType: 'Cualitativa (L/EP/I)',
          level: 'INICIAL',
          areaId: selectedAreaId
        },
        {
          id: 'crit-ini-3',
          code: 'INI-DIAG-03',
          name: 'Pensamiento Lógico',
          description: 'Reconoce relaciones espaciales básicas (arriba/abajo, dentro/fuera) y agrupa por atributos.',
          criterion: 'Reconoce relaciones espaciales básicas (arriba/abajo, dentro/fuera) y agrupa por atributos.',
          domain: 'Pensamiento Lógico',
          instrument: 'Lista de Cotejo',
          scaleType: 'Cualitativa (L/EP/I)',
          level: 'INICIAL',
          areaId: selectedAreaId
        },
        {
          id: 'crit-ini-4',
          code: 'INI-DIAG-04',
          name: 'Socioemocional y Hábitos',
          description: 'Se integra positivamente al juego colectivo y sigue acuerdos de convivencia iniciales.',
          criterion: 'Se integra positivamente al juego colectivo y sigue acuerdos de convivencia iniciales.',
          domain: 'Socioemocional y Hábitos',
          instrument: 'Registro Descriptivo',
          scaleType: 'Cualitativa (L/EP/I)',
          level: 'INICIAL',
          areaId: selectedAreaId
        }
      ];
    } else if (currentLevel === 'PRIMARIA') {
      return [
        {
          id: 'crit-pri-1',
          code: 'PRI-DIAG-01',
          name: 'Comprensión Lectora',
          description: 'Comprende textos breves e instrucciones orales con pertinencia y vocabulario adecuado.',
          criterion: 'Comprende textos breves e instrucciones orales con pertinencia y vocabulario adecuado.',
          domain: 'Comprensión Lectora y Expresión',
          instrument: 'Lista de Cotejo',
          scaleType: 'Cualitativa (L/EP/I)',
          level: 'PRIMARIA',
          areaId: selectedAreaId
        },
        {
          id: 'crit-pri-2',
          code: 'PRI-DIAG-02',
          name: 'Lógico-Matemático',
          description: 'Aplica el cálculo mental y el valor posicional en operaciones matemáticas fundamentales.',
          criterion: 'Aplica el cálculo mental y el valor posicional en operaciones matemáticas fundamentales.',
          domain: 'Pensamiento Lógico-Matemático',
          instrument: 'Lista de Cotejo',
          scaleType: 'Cualitativa (L/EP/I)',
          level: 'PRIMARIA',
          areaId: selectedAreaId
        },
        {
          id: 'crit-pri-3',
          code: 'PRI-DIAG-03',
          name: 'Indagación y Ciencias',
          description: 'Muestra curiosidad científica y capacidad de observación guiada en el entorno.',
          criterion: 'Muestra curiosidad científica y capacidad de observación guiada en el entorno.',
          domain: 'Indagación y Ciencias',
          instrument: 'Escala de Estimación',
          scaleType: 'Cualitativa (L/EP/I)',
          level: 'PRIMARIA',
          areaId: selectedAreaId
        },
        {
          id: 'crit-pri-4',
          code: 'PRI-DIAG-04',
          name: 'Hábitos de Trabajo',
          description: 'Mantiene hábitos de orden, atención sostenida y cumplimiento en sus producciones escritas.',
          criterion: 'Mantiene hábitos de orden, atención sostenida y cumplimiento en sus producciones escritas.',
          domain: 'Hábitos de Trabajo',
          instrument: 'Registro Focalizado',
          scaleType: 'Cualitativa (L/EP/I)',
          level: 'PRIMARIA',
          areaId: selectedAreaId
        }
      ];
    } else {
      return [
        {
          id: 'crit-mg-1',
          code: 'MG-DIAG-01',
          name: 'Dominio Conceptual',
          description: 'Interpreta conceptos fundamentales y referentes teórico-prácticos del área.',
          criterion: 'Interpreta conceptos fundamentales y referentes teórico-prácticos del área.',
          domain: 'Dominio Conceptual',
          instrument: 'Lista de Cotejo',
          scaleType: 'Cuantitativa (01-20)',
          level: 'MEDIA_GENERAL',
          areaId: selectedAreaId
        },
        {
          id: 'crit-mg-2',
          code: 'MG-DIAG-02',
          name: 'Habilidad Procedimental',
          description: 'Aplica procedimientos analíticos y resolución metódica de problemas contextualizados.',
          criterion: 'Aplica procedimientos analíticos y resolución metódica de problemas contextualizados.',
          domain: 'Habilidad Procedimental',
          instrument: 'Matriz Diagnóstica',
          scaleType: 'Cuantitativa (01-20)',
          level: 'MEDIA_GENERAL',
          areaId: selectedAreaId
        },
        {
          id: 'crit-mg-3',
          code: 'MG-DIAG-03',
          name: 'Expresión y Argumentación',
          description: 'Comunica argumentos y conclusiones con pensamiento crítico y redacción estructurada.',
          criterion: 'Comunica argumentos y conclusiones con pensamiento crítico y redacción estructurada.',
          domain: 'Expresión y Argumentación',
          instrument: 'Lista de Cotejo',
          scaleType: 'Cuantitativa (01-20)',
          level: 'MEDIA_GENERAL',
          areaId: selectedAreaId
        },
        {
          id: 'crit-mg-4',
          code: 'MG-DIAG-04',
          name: 'Actitud y Convivencia',
          description: 'Evidencia autonomía investigativa, responsabilidad académica y trabajo en equipo.',
          criterion: 'Evidencia autonomía investigativa, responsabilidad académica y trabajo en equipo.',
          domain: 'Actitud y Convivencia',
          instrument: 'Rúbrica Holística',
          scaleType: 'Cuantitativa (01-20)',
          level: 'MEDIA_GENERAL',
          areaId: selectedAreaId
        }
      ];
    }
  }, [currentLevel, currentArea, selectedAreaId]);

  // Estado del formulario: mapa por estudiante con checklistScores, valor global y observaciones
  const [formData, setFormData] = useState<Record<string, {
    checklist: Record<string, 'LOGRADO' | 'EN_PROCESO' | 'INICIADO'>;
    globalNumeric?: number;
    globalLiteral?: LiteralScore;
    globalQualitative?: QualitativeScore;
    obs: string;
    robotics?: { logic: QualitativeScore; construction: QualitativeScore; teamwork: QualitativeScore };
  }>>({});

  // Cargar registros existentes desde evaluations o inicializar
  useEffect(() => {
    const initial: typeof formData = {};

    levelStudents.forEach(stu => {
      const rec = evaluations.find(
        e => e.studentId === stu.id && e.areaId === selectedAreaId && e.moment === 'DIAGNOSTICA' && e.lapso === activeLapso
      );

      const checklistMap: Record<string, 'LOGRADO' | 'EN_PROCESO' | 'INICIADO'> = {};

      if (rec && rec.checklistScores && rec.checklistScores.length > 0) {
        rec.checklistScores.forEach(cs => {
          const st = cs.status;
          checklistMap[cs.criterionId] = (st === 'L' || st === 'LOGRADO') ? 'LOGRADO' : (st === 'EP' || st === 'EN_PROCESO') ? 'EN_PROCESO' : 'INICIADO';
        });
      } else {
        // Inicializar cada criterio como LOGRADO por defecto
        currentCriteria.forEach(c => {
          checklistMap[c.id] = 'LOGRADO';
        });
      }

      initial[stu.id] = {
        checklist: checklistMap,
        globalNumeric: rec?.scoreNumeric ?? (currentLevel === 'MEDIA_GENERAL' ? 16 : undefined),
        globalLiteral: rec?.scoreLiteral ?? 'A',
        globalQualitative: rec?.scoreQualitative ?? 'L',
        obs: rec?.observations || '',
        robotics: rec?.roboticsScore ? {
          logic: rec.roboticsScore.logicSkills,
          construction: rec.roboticsScore.constructionSkills,
          teamwork: rec.roboticsScore.teamwork
        } : (isRoboticsSpecial ? { logic: 'L', construction: 'L', teamwork: 'L' } : undefined)
      };
    });

    setFormData(initial);
  }, [selectedAreaId, currentLevel, activeLapso, levelStudents, currentCriteria]);

  // Actualizar un criterio en la lista de cotejo de un alumno
  const handleChecklistChange = (studentId: string, criterionId: string, status: 'LOGRADO' | 'EN_PROCESO' | 'INICIADO') => {
    setFormData(prev => {
      const stuData = prev[studentId] || {
        checklist: {},
        obs: '',
        globalLiteral: 'A',
        globalQualitative: 'L',
        globalNumeric: 16
      };

      const updatedChecklist = {
        ...stuData.checklist,
        [criterionId]: status
      };

      // Recalcular automáticamente sugerencia global
      const statuses = Object.values(updatedChecklist);
      const logrados = statuses.filter(s => s === 'LOGRADO').length;
      const total = statuses.length || 1;
      const ratio = logrados / total;

      let newQual: QualitativeScore = ratio >= 0.75 ? 'L' : ratio >= 0.4 ? 'EP' : 'I';
      let newLit: LiteralScore = ratio >= 0.85 ? 'A' : ratio >= 0.65 ? 'B' : ratio >= 0.45 ? 'C' : ratio >= 0.25 ? 'D' : 'E';
      let newNum = Math.round(10 + ratio * 9);

      return {
        ...prev,
        [studentId]: {
          ...stuData,
          checklist: updatedChecklist,
          globalQualitative: newQual,
          globalLiteral: newLit,
          globalNumeric: currentLevel === 'MEDIA_GENERAL' ? newNum : undefined
        }
      };
    });
  };

  // Marcar todos los criterios como LOGRADO en lote
  const handleBatchMarkAllLogrado = () => {
    setFormData(prev => {
      const updated = { ...prev };
      filteredStudents.forEach(stu => {
        const checklistMap: Record<string, 'LOGRADO' | 'EN_PROCESO' | 'INICIADO'> = {};
        currentCriteria.forEach(c => {
          checklistMap[c.id] = 'LOGRADO';
        });
        updated[stu.id] = {
          ...updated[stu.id],
          checklist: checklistMap,
          globalLiteral: 'A',
          globalQualitative: 'L',
          globalNumeric: currentLevel === 'MEDIA_GENERAL' ? 18 : undefined
        };
      });
      return updated;
    });
  };

  // Restablecer todos a En Proceso
  const handleBatchResetEnProceso = () => {
    setFormData(prev => {
      const updated = { ...prev };
      filteredStudents.forEach(stu => {
        const checklistMap: Record<string, 'LOGRADO' | 'EN_PROCESO' | 'INICIADO'> = {};
        currentCriteria.forEach(c => {
          checklistMap[c.id] = 'EN_PROCESO';
        });
        updated[stu.id] = {
          ...updated[stu.id],
          checklist: checklistMap,
          globalLiteral: 'C',
          globalQualitative: 'EP',
          globalNumeric: currentLevel === 'MEDIA_GENERAL' ? 12 : undefined
        };
      });
      return updated;
    });
  };

  // Guardar en PostgreSQL
  const handleSaveAll = () => {
    const recordsToSave = filteredStudents.map(stu => {
      const entry = formData[stu.id] || { checklist: {}, obs: '' };

      // Convertir el checklist local al array ChecklistScoreItem[]
      const checklistArray: ChecklistScoreItem[] = currentCriteria.map(c => ({
        criterionId: c.id,
        criterionName: c.name || c.domain || 'Criterio Observable',
        criterionText: c.criterion || c.description || '',
        status: (entry.checklist[c.id] || 'LOGRADO') as 'LOGRADO' | 'EN_PROCESO' | 'INICIADO'
      }));

      return {
        studentId: stu.id,
        areaId: selectedAreaId,
        moment: 'DIAGNOSTICA' as const,
        lapso: activeLapso,
        scoreNumeric: currentLevel === 'MEDIA_GENERAL' ? (entry.globalNumeric ?? 15) : undefined,
        scoreLiteral: currentLevel === 'INICIAL' ? (entry.globalLiteral ?? 'A') : undefined,
        scoreQualitative: currentLevel === 'PRIMARIA' ? (entry.globalQualitative ?? 'L') : undefined,
        roboticsScore: entry.robotics ? {
          logicSkills: entry.robotics.logic,
          constructionSkills: entry.robotics.construction,
          teamwork: entry.robotics.teamwork
        } : undefined,
        checklistScores: checklistArray,
        observations: entry.obs || 'Evaluación diagnóstica inicial de entrada completada.',
        teacherId: currentUser?.id || 'docente-titular'
      };
    });

    bulkRecordEvaluations(recordsToSave);
    setIsSavedBanner(true);
    setTimeout(() => setIsSavedBanner(false), 3500);
  };

  // ==============================================================
  // ANALÍTICA DEL CURSO (Cálculos para gráficos Recharts)
  // ==============================================================
  const analyticsSummary = useMemo(() => {
    let totalItems = 0;
    let totalLogrados = 0;
    let totalEnProceso = 0;
    let totalIniciados = 0;

    const criterionStats: Record<string, { criterion: string; logrados: number; total: number }> = {};
    currentCriteria.forEach(c => {
      criterionStats[c.id] = { criterion: c.criterion || c.description || c.name || 'Criterio', logrados: 0, total: 0 };
    });

    const studentsRequiringNivelacion: { id: string; name: string; grade: string; section: string; iniciados: number }[] = [];

    filteredStudents.forEach(stu => {
      const stuEntry = formData[stu.id];
      if (!stuEntry) return;

      let stuIniciados = 0;
      currentCriteria.forEach(c => {
        const st = stuEntry.checklist[c.id] || 'LOGRADO';
        totalItems++;
        if (st === 'LOGRADO') {
          totalLogrados++;
          if (criterionStats[c.id]) criterionStats[c.id].logrados++;
        } else if (st === 'EN_PROCESO') {
          totalEnProceso++;
        } else {
          totalIniciados++;
          stuIniciados++;
        }
        if (criterionStats[c.id]) criterionStats[c.id].total++;
      });

      if (stuIniciados >= 2) {
        studentsRequiringNivelacion.push({
          id: stu.id,
          name: stu.fullName,
          grade: stu.grade,
          section: stu.section,
          iniciados: stuIniciados
        });
      }
    });

    const donutData = [
      { name: 'Logrado (Consolidado)', value: totalLogrados, color: '#10B981' },
      { name: 'En Proceso (Desarrollo)', value: totalEnProceso, color: '#D4AF37' },
      { name: 'Iniciado (Nivelación)', value: totalIniciados, color: '#EF4444' }
    ].filter(d => d.value > 0);

    const barData = currentCriteria.map((c, i) => {
      const stat = criterionStats[c.id];
      const pct = stat && stat.total > 0 ? Math.round((stat.logrados / stat.total) * 100) : 0;
      return {
        id: `C${i + 1}`,
        criterio: `Criterio ${i + 1}: ${c.domain}`,
        fullText: c.criterion,
        porcentaje: pct
      };
    });

    const consolidacionGlobal = totalItems > 0 ? Math.round((totalLogrados / totalItems) * 100) : 0;

    return {
      donutData,
      barData,
      totalStudents: filteredStudents.length,
      consolidacionGlobal,
      totalIniciados,
      studentsRequiringNivelacion
    };
  }, [filteredStudents, formData, currentCriteria]);

  // Estudiante activo para la ficha individual
  const activeStudent = useMemo(() => {
    return filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
  }, [filteredStudents, selectedStudentId]);

  const activeStudentData = activeStudent ? formData[activeStudent.id] : undefined;

  // Cátedras oficiales del docente autenticado para carga rápida
  const teacherAssignments = (currentTeacherAssignments || []).filter(
    (a: AcademicAssignment) => a.level === currentLevel
  );

  return (
    <div className="space-y-6">
      {/* Banner Principal */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
            Evaluación Diagnóstica Inicial
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#2C2E53] text-[#D4AF37] dark:bg-slate-800">
              {currentLevel.replace('_', ' ')}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Instrumento de listas de cotejo por criterios observables con analítica global y emisión de ficha individual membretada.
          </p>
        </div>

        {/* Pestañas de Navegación del Módulo Diagnóstico */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('LISTA_COTEJO')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'LISTA_COTEJO'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>1. Lista de Cotejo</span>
          </button>

          <button
            onClick={() => setActiveTab('ANALITICA_GLOBAL')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'ANALITICA_GLOBAL'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>2. Analítica del Curso</span>
          </button>

          <button
            onClick={() => setActiveTab('FICHA_INDIVIDUAL')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'FICHA_INDIVIDUAL'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>3. Ficha Individual</span>
          </button>
        </div>
      </div>

      {isSavedBanner && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-md animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>¡Registros diagnósticos y lista de cotejo guardados satisfactoriamente en la base de datos PostgreSQL!</span>
        </div>
      )}

      {/* Alerta de Lapso Bloqueado por Plazo / Cierre */}
      {isLockedForTeacher && (
        <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 flex items-center justify-between text-amber-700 dark:text-amber-300">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="font-bold text-xs">
                Lapso {activeLapso} cerrado para carga diagnóstica ({gradingStatus.statusText || 'Periodo finalizado'})
              </p>
              <p className="text-[11px] opacity-80">
                La fecha y hora límite de carga configurada ha vencido. El registro se encuentra en modo sólo lectura para el personal docente.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-amber-500/20 text-amber-800 dark:text-amber-200 rounded-lg">
            Libro Bloqueado
          </span>
        </div>
      )}

      {isSupervisorOverride && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-3 flex items-center gap-2 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <Info className="w-4 h-4 text-blue-500 shrink-0" />
          <span>
            <strong>Modo Supervisor:</strong> El Lapso {activeLapso} está administrativamente cerrado para docentes ({gradingStatus.statusText}), pero tienes privilegios directivos para edición o ajuste de diagnóstico.
          </span>
        </div>
      )}

      {/* Barra de Filtros: Grado, Sección (exclusiva A/B) y Área */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Selector de Área */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-black text-[#2C2E53] dark:text-[#D4AF37] whitespace-nowrap">
              Área:
            </label>
            <select
              value={selectedAreaId}
              onChange={(e) => setSelectedAreaId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#2C2E53]"
            >
              {levelAreas.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.code})</option>
              ))}
            </select>
          </div>

          {/* Selector de Grado */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-black text-[#2C2E53] dark:text-[#D4AF37] whitespace-nowrap">
              Grado / Año:
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#2C2E53]"
            >
              <option value="TODOS">Todos los grados</option>
              {availableGrades.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Selector de Sección (REGLA 4: Exclusivamente A y B) */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-black text-[#2C2E53] dark:text-[#D4AF37] whitespace-nowrap">
              Sección:
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#2C2E53]"
            >
              <option value="TODAS">Secciones A y B</option>
              <option value="A">Sección A</option>
              <option value="B">Sección B</option>
            </select>
          </div>

          {/* Carga rápida si el docente tiene cátedras asignadas */}
          {teacherAssignments.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400">|</span>
              <select
                onChange={(e) => {
                  const asg = teacherAssignments.find(a => a.id === e.target.value);
                  if (asg) {
                    setSelectedAreaId(asg.areaId);
                    setSelectedGrade(asg.grade);
                    setSelectedSection(asg.section as any);
                  }
                }}
                defaultValue=""
                className="px-2.5 py-1 bg-[#D4AF37]/15 text-amber-900 dark:text-amber-300 border border-[#D4AF37]/40 rounded-xl text-xs font-black cursor-pointer"
              >
                <option value="" disabled>Cargar mi cátedra asignada...</option>
                {teacherAssignments.map(asg => (
                  <option key={asg.id} value={asg.id}>
                    {asg.areaName} — {asg.grade} Sec. {asg.section}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Acciones principales */}
        <div className="flex items-center gap-2">
          {activeTab === 'LISTA_COTEJO' && (
            <button
              onClick={handleSaveAll}
              disabled={isLockedForTeacher}
              className={`flex items-center gap-1.5 px-4 py-2 font-black rounded-xl text-xs shadow-md transition-all border ${
                isLockedForTeacher
                  ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
                  : 'bg-[#2C2E53] hover:bg-[#393b68] text-[#D4AF37] border-[#D4AF37]/30'
              }`}
              title={isLockedForTeacher ? 'Carga bloqueada: fecha límite superada o lapso cerrado' : 'Guardar evaluación diagnóstica'}
            >
              {isLockedForTeacher ? <Lock className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{isLockedForTeacher ? 'Carga Bloqueada' : 'Guardar Evaluación'}</span>
            </button>
          )}

          {activeTab === 'FICHA_INDIVIDUAL' && (
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#c49f2c] text-[#1B1C33] font-black rounded-xl text-xs shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Ficha Oficial</span>
            </button>
          )}
        </div>
      </div>

      {/* ==============================================================
          PESTAÑA 1: LISTA DE COTEJO Y REGISTRO POR ESTUDIANTE
          ============================================================== */}
      {activeTab === 'LISTA_COTEJO' && (
        <div className="space-y-4">
          {/* Panel de Criterios Observables Activos */}
          <div className="bg-gradient-to-r from-[#2C2E53] to-[#1E2038] text-white p-5 rounded-3xl shadow-lg border border-[#D4AF37]/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Criterios Observables de la Lista de Cotejo • {currentArea?.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBatchMarkAllLogrado}
                  disabled={isLockedForTeacher}
                  className={`flex items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-black transition-colors border ${
                    isLockedForTeacher
                      ? 'bg-slate-700/50 text-slate-400 border-slate-600 cursor-not-allowed'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Marcar Todos Logrado (L)</span>
                </button>
                <button
                  type="button"
                  onClick={handleBatchResetEnProceso}
                  disabled={isLockedForTeacher}
                  className={`flex items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-black transition-colors border ${
                    isLockedForTeacher
                      ? 'bg-slate-700/50 text-slate-400 border-slate-600 cursor-not-allowed'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/30'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>En Proceso (EP)</span>
                </button>
              </div>
            </div>

            {/* Listado descriptivo de los criterios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {currentCriteria.map((crit, idx) => (
                <div
                  key={crit.id}
                  className="bg-white/10 p-3 rounded-2xl border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#1B1C33]">
                        Criterio {idx + 1}
                      </span>
                      <span className="text-[9px] font-bold text-slate-300">
                        {crit.domain}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-200 leading-snug">
                      {crit.criterion}
                    </p>
                  </div>
                  <div className="text-[9px] text-[#D4AF37] font-semibold mt-2">
                    Instr: {crit.instrument}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla de Estudiantes con Lista de Cotejo */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="p-4 bg-[#2C2E53] text-white flex items-center justify-between">
              <span className="font-black text-xs uppercase tracking-wider">
                Matriz Diagnóstica del Salón ({filteredStudents.length} Estudiantes)
              </span>
              <span className="text-[11px] text-slate-300 font-bold">
                Lapso 1 • Ciclo Inicial
              </span>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Info className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-bold">No se encontraron estudiantes para los filtros seleccionados.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Verifique que la sección (A o B) tenga alumnos matriculados o seleccione "Todos los grados".
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-black uppercase border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4 w-64">Estudiante</th>
                      {currentCriteria.map((crit, idx) => (
                        <th key={crit.id} className="py-3 px-2 text-center">
                          <div>Criterio {idx + 1}</div>
                          <div className="text-[9px] font-normal text-slate-400">{crit.domain}</div>
                        </th>
                      ))}
                      <th className="py-3 px-3 text-center">
                        {currentLevel === 'INICIAL' ? 'Valoración Literal' : currentLevel === 'PRIMARIA' ? 'Valoración Cualitativa' : 'Calificación 01-20'}
                      </th>
                      <th className="py-3 px-4 min-w-[200px]">Observaciones Diagnósticas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredStudents.map(stu => {
                      const entry = formData[stu.id] || { checklist: {}, obs: '' };

                      return (
                        <tr key={stu.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          {/* Datos del Estudiante */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#2C2E53] text-[#D4AF37] font-black flex items-center justify-center text-xs shrink-0">
                                {stu.fullName.charAt(0)}
                              </div>
                              <div>
                                <span className="font-black text-slate-800 dark:text-slate-100 block text-xs">
                                  {stu.fullName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold">
                                  {stu.cedula} • {stu.grade} Sec. {stu.section}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Criterios de la Lista de Cotejo */}
                          {currentCriteria.map(crit => {
                            const val = entry.checklist[crit.id] || 'LOGRADO';

                            return (
                              <td key={crit.id} className="py-3 px-2 text-center align-middle">
                                <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                  <button
                                    type="button"
                                    onClick={() => handleChecklistChange(stu.id, crit.id, 'LOGRADO')}
                                    title="Logrado"
                                    className={`px-2 py-1 rounded text-[10px] font-black transition-colors ${
                                      val === 'LOGRADO'
                                        ? 'bg-emerald-500 text-white shadow-xs'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                                    }`}
                                  >
                                    L
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleChecklistChange(stu.id, crit.id, 'EN_PROCESO')}
                                    title="En Proceso"
                                    className={`px-2 py-1 rounded text-[10px] font-black transition-colors ${
                                      val === 'EN_PROCESO'
                                        ? 'bg-amber-500 text-white shadow-xs'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
                                    }`}
                                  >
                                    EP
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleChecklistChange(stu.id, crit.id, 'INICIADO')}
                                    title="Iniciado"
                                    className={`px-2 py-1 rounded text-[10px] font-black transition-colors ${
                                      val === 'INICIADO'
                                        ? 'bg-red-500 text-white shadow-xs'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-red-600'
                                    }`}
                                  >
                                    I
                                  </button>
                                </div>
                              </td>
                            );
                          })}

                          {/* Valoración Global del Diagnóstico */}
                          <td className="py-3 px-3 text-center align-middle">
                            {currentLevel === 'INICIAL' && (
                              <select
                                value={entry.globalLiteral || 'A'}
                                onChange={(e) =>
                                  setFormData(prev => ({
                                    ...prev,
                                    [stu.id]: { ...prev[stu.id], globalLiteral: e.target.value as LiteralScore }
                                  }))
                                }
                                className="p-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs font-black text-center"
                              >
                                <option value="A">A (Consolidado)</option>
                                <option value="B">B (Bueno)</option>
                                <option value="C">C (Aceptable)</option>
                                <option value="D">D (Acompañamiento)</option>
                                <option value="E">E (Inicial)</option>
                              </select>
                            )}

                            {currentLevel === 'PRIMARIA' && (
                              <select
                                value={entry.globalQualitative || 'L'}
                                onChange={(e) =>
                                  setFormData(prev => ({
                                    ...prev,
                                    [stu.id]: { ...prev[stu.id], globalQualitative: e.target.value as QualitativeScore }
                                  }))
                                }
                                className="p-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs font-black text-center"
                              >
                                <option value="L">L (Logrado)</option>
                                <option value="EP">EP (En Proceso)</option>
                                <option value="I">I (Iniciado)</option>
                              </select>
                            )}

                            {currentLevel === 'MEDIA_GENERAL' && (
                              <input
                                type="number"
                                min={1}
                                max={20}
                                value={entry.globalNumeric ?? 15}
                                onChange={(e) =>
                                  setFormData(prev => ({
                                    ...prev,
                                    [stu.id]: { ...prev[stu.id], globalNumeric: Number(e.target.value) }
                                  }))
                                }
                                className="w-14 p-1 text-center font-black rounded border border-slate-300 dark:border-slate-600 text-xs bg-white dark:bg-slate-800"
                              />
                            )}
                          </td>

                          {/* Observaciones Cualitativas */}
                          <td className="py-3 px-4 align-middle">
                            <input
                              type="text"
                              value={entry.obs}
                              onChange={(e) =>
                                setFormData(prev => ({
                                  ...prev,
                                  [stu.id]: { ...prev[stu.id], obs: e.target.value }
                                }))
                              }
                              placeholder="Observación cualitativa de entrada..."
                              className="w-full p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100"
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

      {/* ==============================================================
          PESTAÑA 2: ANALÍTICA Y GRÁFICOS DEL CURSO (RECHARTS)
          ============================================================== */}
      {activeTab === 'ANALITICA_GLOBAL' && (
        <div className="space-y-6">
          {/* KPI Cards de Consolidación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase">Tasa de Logro</span>
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-[#2C2E53] dark:text-white mt-2">
                {analyticsSummary.consolidacionGlobal}%
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Criterios alcanzados plenamente</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase">Total Estudiantes</span>
                <span className="p-2 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <User className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-[#2C2E53] dark:text-white mt-2">
                {analyticsSummary.totalStudents}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Muestra evaluada en la sección</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase">Criterios Iniciados</span>
                <span className="p-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">
                {analyticsSummary.totalIniciados}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Aspectos en fase inicial de destreza</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase">Plan de Nivelación</span>
                <span className="p-2 rounded-xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                  <AlertCircle className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-red-600 dark:text-red-400 mt-2">
                {analyticsSummary.studentsRequiringNivelacion.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Estudiantes con atención prioritaria</p>
            </div>
          </div>

          {/* Gráficos con Recharts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico 1: Distribución Global (Donut Chart) */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
                <h4 className="text-sm font-black text-[#2C2E53] dark:text-white uppercase tracking-wider">
                  Distribución Global del Salón (Donut)
                </h4>
              </div>

              {analyticsSummary.donutData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400 text-xs font-bold">
                  Sin datos diagnósticos para graficar.
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsSummary.donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analyticsSummary.donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#2C2E53',
                          borderRadius: '12px',
                          color: '#fff',
                          border: 'none',
                          fontSize: '12px'
                        }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Gráfico 2: Dominio por Criterio Diagnóstico (Bar Chart) */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2C2E53]"></span>
                <h4 className="text-sm font-black text-[#2C2E53] dark:text-white uppercase tracking-wider">
                  Tasa de Consolidación por Criterio (%)
                </h4>
              </div>

              {analyticsSummary.barData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400 text-xs font-bold">
                  Sin criterios evaluados para graficar.
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsSummary.barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <XAxis dataKey="id" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip
                        formatter={(val: any) => [`${val}% de logro`, 'Consolidación']}
                        contentStyle={{
                          backgroundColor: '#2C2E53',
                          borderRadius: '12px',
                          color: '#fff',
                          border: 'none',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="porcentaje" fill="#2C2E53" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Panel de Alertas Tempranas y Plan de Nivelación */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h4 className="text-sm font-black text-[#2C2E53] dark:text-white uppercase tracking-wider">
                Estudiantes Identificados para Plan de Nivelación Temprana
              </h4>
            </div>

            {analyticsSummary.studentsRequiringNivelacion.length === 0 ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Excelente: Ningún estudiante presenta rezago crítico en los criterios diagnósticos evaluados.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {analyticsSummary.studentsRequiringNivelacion.map(stu => (
                  <div
                    key={stu.id}
                    className="p-3.5 bg-red-50/60 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-800/50 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-black text-xs text-red-950 dark:text-red-200 block">
                        {stu.name}
                      </span>
                      <span className="text-[10px] text-red-700 dark:text-red-400 font-semibold">
                        {stu.grade} Sec. {stu.section} • {stu.iniciados} criterios en "Iniciado"
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStudentId(stu.id);
                        setActiveTab('FICHA_INDIVIDUAL');
                      }}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-black transition-colors"
                    >
                      Ver Ficha
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==============================================================
          PESTAÑA 3: FICHA INDIVIDUAL Y REPORTE OFICIAL MEMBRETADO
          ============================================================== */}
      {activeTab === 'FICHA_INDIVIDUAL' && (
        <div className="space-y-6">
          {/* Selector de Estudiante */}
          <div className="no-print bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-black text-[#2C2E53] dark:text-[#D4AF37] whitespace-nowrap">
                Seleccionar Estudiante:
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-72 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#2C2E53]"
              >
                {filteredStudents.map(stu => (
                  <option key={stu.id} value={stu.id}>
                    {stu.fullName} ({stu.grade} Sec. {stu.section})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-500 font-bold">
              Vista oficial lista para exportar o imprimir en formato PDF institucional.
            </div>
          </div>

          {/* FICHA OFICIAL IMPRIMIBLE MEMBRETADA */}
          {activeStudent ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-2xl p-8 printable-sheet max-w-4xl mx-auto space-y-6">
              {/* Membrete Oficial Institucional */}
              <div className="border-b-2 border-[#D4AF37] pb-4 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#2C2E53] dark:text-[#D4AF37]">
                    República Bolivariana de Venezuela • Ministerio del Poder Popular para la Educación
                  </div>
                  <h1 className="text-xl font-black text-[#2C2E53] dark:text-white uppercase tracking-wide mt-0.5">
                    U.C.E. COLEGIO BELLAS ARTES
                  </h1>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    INFORME INDIVIDUAL DE EVALUACIÓN DIAGNÓSTICA DE ENTRADA
                  </p>
                </div>
                <div className="text-center sm:text-right">
                  <span className="text-[10px] font-black px-3 py-1 bg-[#2C2E53] text-[#D4AF37] rounded-lg uppercase tracking-wider">
                    AÑO ESCOLAR 2026 - 2027
                  </span>
                  <div className="text-[11px] font-black text-slate-600 dark:text-slate-400 mt-1">
                    Lapso 1 • {currentLevel.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Ficha de Datos del Estudiante */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="block text-[10px] font-black text-slate-400 uppercase">Estudiante:</span>
                  <strong className="text-slate-800 dark:text-slate-100">{activeStudent.fullName}</strong>
                </div>
                <div>
                  <span className="block text-[10px] font-black text-slate-400 uppercase">Cédula / ID:</span>
                  <strong className="text-slate-800 dark:text-slate-100">{activeStudent.cedula}</strong>
                </div>
                <div>
                  <span className="block text-[10px] font-black text-slate-400 uppercase">Grado y Sección:</span>
                  <strong className="text-slate-800 dark:text-slate-100">{activeStudent.grade} - Sección {activeStudent.section}</strong>
                </div>
                <div>
                  <span className="block text-[10px] font-black text-slate-400 uppercase">Área Evaluada:</span>
                  <strong className="text-slate-800 dark:text-slate-100">{currentArea?.name}</strong>
                </div>
              </div>

              {/* Matriz Detallada de Criterios Observables */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#2C2E53] dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                  Desempeño Observado en los Criterios de la Lista de Cotejo
                </h4>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#2C2E53] text-white text-[10px] uppercase font-black">
                      <tr>
                        <th className="py-2.5 px-3">Criterio Observable</th>
                        <th className="py-2.5 px-3">Dominio Pedagógico</th>
                        <th className="py-2.5 px-3">Instrumento</th>
                        <th className="py-2.5 px-3 text-center">Valoración Obtenida</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {currentCriteria.map((crit, idx) => {
                        const status = activeStudentData?.checklist[crit.id] || 'LOGRADO';

                        return (
                          <tr key={crit.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                              {idx + 1}. {crit.criterion}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-bold">
                              {crit.domain}
                            </td>
                            <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                              {crit.instrument}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`inline-block px-2.5 py-1 rounded-full font-black text-[10px] ${
                                status === 'LOGRADO'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : status === 'EN_PROCESO'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-red-100 text-red-800 border border-red-300'
                              }`}>
                                {status === 'LOGRADO' ? '✓ LOGRADO' : status === 'EN_PROCESO' ? '⌛ EN PROCESO' : '✗ INICIADO'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dictamen Global del Diagnóstico */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black text-[#2C2E53] dark:text-[#D4AF37] uppercase tracking-wider block">
                    VALORACIÓN DIAGNÓSTICA CONSOLIDADA:
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {currentLevel === 'INICIAL'
                      ? 'Nivel expresado en escala literal según directrices del subsistema de Educación Inicial.'
                      : currentLevel === 'PRIMARIA'
                      ? 'Nivel cualitativo formativo de consolidación de competencias básicas.'
                      : 'Calificación vigesimal diagnóstica referencial del subsistema de Educación Media General.'}
                  </p>
                </div>
                <div className="text-center sm:text-right shrink-0">
                  <div className="text-2xl font-black text-[#2C2E53] dark:text-[#D4AF37]">
                    {currentLevel === 'INICIAL'
                      ? `LITERAL "${activeStudentData?.globalLiteral || 'A'}"`
                      : currentLevel === 'PRIMARIA'
                      ? `CUALITATIVO "${activeStudentData?.globalQualitative || 'L'}"`
                      : `${activeStudentData?.globalNumeric || 15} / 20`}
                  </div>
                </div>
              </div>

              {/* Observaciones y Sugerencias Pedagógicas */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Observaciones Cualitativas y Recomendaciones de Acompañamiento:
                </span>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {activeStudentData?.obs ||
                    'El estudiante demuestra un nivel acorde a los objetivos pedagógicos previstos para el inicio del año escolar. Se sugiere mantener el acompañamiento activo y el hábito de lectura diaria en el hogar.'}
                </div>
              </div>

              {/* Firmas Oficiales y Validación */}
              <div className="pt-8 border-t-2 border-slate-300 dark:border-slate-700 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="w-48 mx-auto border-b-2 border-slate-500 mb-2 h-10 flex items-end justify-center">
                    <span className="text-[10px] text-slate-400 italic print:hidden">(Firma del Docente)</span>
                  </div>
                  <strong className="block text-slate-800 dark:text-slate-200">{currentUser?.fullName || 'Docente Evaluador'}</strong>
                  <span className="text-[10px] text-slate-400">Docente de {currentArea?.name}</span>
                </div>

                <div>
                  <div className="w-48 mx-auto border-b-2 border-slate-500 mb-2 h-10 flex items-end justify-center">
                    <span className="text-[10px] text-slate-400 italic print:hidden">(Sello de Coordinación)</span>
                  </div>
                  <strong className="block text-slate-800 dark:text-slate-200">
                    {currentLevel === 'INICIAL' ? 'Coordinación de Inicial' : currentLevel === 'PRIMARIA' ? 'Coordinación de Primaria' : 'Coordinación de Media General'}
                  </strong>
                  <span className="text-[10px] text-slate-400">Control de Estudios CBA</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <User className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm font-bold">No hay estudiante seleccionado para generar el reporte.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
