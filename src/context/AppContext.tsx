import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  EducationalLevel,
  UserRole,
  SubjectArea,
  Competency,
  Indicator,
  Strategy,
  PlanQuincenal,
  PlanLapso,
  Student,
  EvaluationRecord,
  AIActionPlan,
  RemedialActionPlan,
  CouncilMeetingMinute,
  PlanStatus,
  QualitativeScore
} from '../types';
import {
  INITIAL_AREAS,
  INITIAL_COMPETENCIES,
  INITIAL_INDICATORS,
  INITIAL_STRATEGIES,
  INITIAL_STUDENTS,
  INITIAL_PLANS_QUINCENAL,
  INITIAL_PLANS_LAPSO,
  INITIAL_EVALUATION_RECORDS,
  INITIAL_AI_ACTION_PLANS,
  INITIAL_REMEDIAL_PLANS,
  INITIAL_COUNCIL_MINUTES
} from '../data/seedData';

interface AppContextType {
  // Navigation & Session
  currentLevel: EducationalLevel;
  setCurrentLevel: (level: EducationalLevel) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeLapso: 1 | 2 | 3;
  setActiveLapso: (lapso: 1 | 2 | 3) => void;
  currentSection: string;
  setCurrentSection: (section: string) => void;

  // Curricular Entities
  areas: SubjectArea[];
  levelAreas: SubjectArea[];
  competencies: Competency[];
  indicators: Indicator[];
  strategies: Strategy[];

  addCompetency: (comp: Omit<Competency, 'id'>) => Competency;
  addIndicator: (ind: Omit<Indicator, 'id'>) => Indicator;
  transferCompetency: (competencyId: string, targetLapso: 1 | 2 | 3) => void;
  transferIndicator: (indicatorId: string, targetLapso: 1 | 2 | 3) => void;
  addStrategy: (strat: Omit<Strategy, 'id'>) => Strategy;
  transferStrategy: (strategyId: string, targetAreaId: string) => void;

  // Planning
  plansQuincenal: PlanQuincenal[];
  savePlanQuincenal: (plan: PlanQuincenal) => void;
  updateQuincenalStatus: (planId: string, status: PlanStatus, feedback?: string) => void;
  plansLapso: PlanLapso[];
  savePlanLapso: (plan: PlanLapso) => void;
  updateLapsoPlanStatus: (planId: string, status: PlanStatus, feedback?: string) => void;

  // Students & Evaluations
  students: Student[];
  levelStudents: Student[];
  evaluations: EvaluationRecord[];
  recordEvaluation: (record: Omit<EvaluationRecord, 'id' | 'recordedAt'>) => void;
  bulkRecordEvaluations: (records: Omit<EvaluationRecord, 'id' | 'recordedAt'>[]) => void;
  adjustStudentGrade: (
    studentId: string,
    areaId: string,
    oldScore: string,
    newScore: string,
    justification: string
  ) => void;

  // AI & Remedial
  aiActionPlans: AIActionPlan[];
  generateAIActionPlan: (studentId: string, areaId: string) => AIActionPlan;
  updateAIPlanFeedback: (planId: string, teacherNotes: string, status: AIActionPlan['status']) => void;
  remedialPlans: RemedialActionPlan[];
  addRemedialPlan: (plan: Omit<RemedialActionPlan, 'id'>) => void;
  updateRemedialStatus: (planId: string, status: RemedialActionPlan['status'], finalScore?: number) => void;

  // Communication & Council Minutes
  councilMinutes: CouncilMeetingMinute[];
  createCouncilMinute: (minute: Omit<CouncilMeetingMinute, 'id'>) => void;
  signCouncilMinute: (minuteId: string) => void;

  // Helpers
  resetToSeedData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session States
  const [currentLevel, setCurrentLevel] = useState<EducationalLevel>('MEDIA_GENERAL');
  const [currentRole, setCurrentRole] = useState<UserRole>('DOCENTE');
  const [activeLapso, setActiveLapso] = useState<1 | 2 | 3>(1);
  const [currentSection, setCurrentSection] = useState<string>('4to Año A');

  // Synchronize section when level changes
  useEffect(() => {
    if (currentLevel === 'INICIAL') {
      setCurrentSection('Sala de 5 Años A');
    } else if (currentLevel === 'PRIMARIA') {
      setCurrentSection('5to Grado A');
    } else {
      setCurrentSection('4to Año A');
    }
  }, [currentLevel]);

  // Data Store with LocalStorage Persistence
  const [areas] = useState<SubjectArea[]>(() => {
    const saved = localStorage.getItem('sisceba_areas');
    return saved ? JSON.parse(saved) : INITIAL_AREAS;
  });

  const [competencies, setCompetencies] = useState<Competency[]>(() => {
    const saved = localStorage.getItem('sisceba_competencies');
    return saved ? JSON.parse(saved) : INITIAL_COMPETENCIES;
  });

  const [indicators, setIndicators] = useState<Indicator[]>(() => {
    const saved = localStorage.getItem('sisceba_indicators');
    return saved ? JSON.parse(saved) : INITIAL_INDICATORS;
  });

  const [strategies, setStrategies] = useState<Strategy[]>(() => {
    const saved = localStorage.getItem('sisceba_strategies');
    return saved ? JSON.parse(saved) : INITIAL_STRATEGIES;
  });

  const [plansQuincenal, setPlansQuincenal] = useState<PlanQuincenal[]>(() => {
    const saved = localStorage.getItem('sisceba_plans_quincenal');
    return saved ? JSON.parse(saved) : INITIAL_PLANS_QUINCENAL;
  });

  const [plansLapso, setPlansLapso] = useState<PlanLapso[]>(() => {
    const saved = localStorage.getItem('sisceba_plans_lapso');
    return saved ? JSON.parse(saved) : INITIAL_PLANS_LAPSO;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('sisceba_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>(() => {
    const saved = localStorage.getItem('sisceba_evaluations');
    return saved ? JSON.parse(saved) : INITIAL_EVALUATION_RECORDS;
  });

  const [aiActionPlans, setAiActionPlans] = useState<AIActionPlan[]>(() => {
    const saved = localStorage.getItem('sisceba_ai_plans');
    return saved ? JSON.parse(saved) : INITIAL_AI_ACTION_PLANS;
  });

  const [remedialPlans, setRemedialPlans] = useState<RemedialActionPlan[]>(() => {
    const saved = localStorage.getItem('sisceba_remedial_plans');
    return saved ? JSON.parse(saved) : INITIAL_REMEDIAL_PLANS;
  });

  const [councilMinutes, setCouncilMinutes] = useState<CouncilMeetingMinute[]>(() => {
    const saved = localStorage.getItem('sisceba_council_minutes');
    return saved ? JSON.parse(saved) : INITIAL_COUNCIL_MINUTES;
  });

  // Sync to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('sisceba_competencies', JSON.stringify(competencies));
  }, [competencies]);

  useEffect(() => {
    localStorage.setItem('sisceba_indicators', JSON.stringify(indicators));
  }, [indicators]);

  useEffect(() => {
    localStorage.setItem('sisceba_strategies', JSON.stringify(strategies));
  }, [strategies]);

  useEffect(() => {
    localStorage.setItem('sisceba_plans_quincenal', JSON.stringify(plansQuincenal));
  }, [plansQuincenal]);

  useEffect(() => {
    localStorage.setItem('sisceba_plans_lapso', JSON.stringify(plansLapso));
  }, [plansLapso]);

  useEffect(() => {
    localStorage.setItem('sisceba_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('sisceba_evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    localStorage.setItem('sisceba_ai_plans', JSON.stringify(aiActionPlans));
  }, [aiActionPlans]);

  useEffect(() => {
    localStorage.setItem('sisceba_remedial_plans', JSON.stringify(remedialPlans));
  }, [remedialPlans]);

  useEffect(() => {
    localStorage.setItem('sisceba_council_minutes', JSON.stringify(councilMinutes));
  }, [councilMinutes]);

  // Filtered views by active level
  const levelAreas = areas.filter(a => a.level === currentLevel);
  const levelStudents = students.filter(s => s.level === currentLevel);

  // Curricular Actions
  const addCompetency = (comp: Omit<Competency, 'id'>): Competency => {
    const newComp: Competency = {
      ...comp,
      id: `comp-${Date.now()}`
    };
    setCompetencies(prev => [newComp, ...prev]);
    return newComp;
  };

  const addIndicator = (ind: Omit<Indicator, 'id'>): Indicator => {
    const newInd: Indicator = {
      ...ind,
      id: `ind-${Date.now()}`
    };
    setIndicators(prev => [newInd, ...prev]);
    return newInd;
  };

  const transferCompetency = (competencyId: string, targetLapso: 1 | 2 | 3) => {
    const comp = competencies.find(c => c.id === competencyId);
    if (!comp) return;
    const cloned: Competency = {
      ...comp,
      id: `comp-trans-${Date.now()}`,
      code: `${comp.code}-L${targetLapso}`,
      lapso: targetLapso,
      title: `${comp.title} (Transferida a L${targetLapso})`
    };
    setCompetencies(prev => [cloned, ...prev]);
  };

  const transferIndicator = (indicatorId: string, targetLapso: 1 | 2 | 3) => {
    const ind = indicators.find(i => i.id === indicatorId);
    if (!ind) return;
    const cloned: Indicator = {
      ...ind,
      id: `ind-trans-${Date.now()}`,
      code: `${ind.code}-L${targetLapso}`,
      lapso: targetLapso,
      description: `${ind.description} (Reforzado en L${targetLapso})`
    };
    setIndicators(prev => [cloned, ...prev]);
  };

  const addStrategy = (strat: Omit<Strategy, 'id'>): Strategy => {
    const newStrat: Strategy = {
      ...strat,
      id: `strat-${Date.now()}`
    };
    setStrategies(prev => [newStrat, ...prev]);
    return newStrat;
  };

  const transferStrategy = (strategyId: string, targetAreaId: string) => {
    const strat = strategies.find(s => s.id === strategyId);
    const targetArea = areas.find(a => a.id === targetAreaId);
    if (!strat || !targetArea) return;
    const cloned: Strategy = {
      ...strat,
      id: `strat-trans-${Date.now()}`,
      areaId: targetAreaId,
      level: targetArea.level,
      name: `${strat.name} [Transferida a ${targetArea.name}]`
    };
    setStrategies(prev => [cloned, ...prev]);
  };

  // Planning Actions
  const savePlanQuincenal = (plan: PlanQuincenal) => {
    setPlansQuincenal(prev => {
      const idx = prev.findIndex(p => p.id === plan.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...plan, updatedAt: new Date().toISOString().split('T')[0] };
        return copy;
      }
      return [plan, ...prev];
    });
  };

  const updateQuincenalStatus = (planId: string, status: PlanStatus, feedback?: string) => {
    setPlansQuincenal(prev =>
      prev.map(p => {
        if (p.id === planId) {
          return {
            ...p,
            status,
            reviewFeedback: feedback !== undefined ? feedback : p.reviewFeedback,
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      })
    );
  };

  const savePlanLapso = (plan: PlanLapso) => {
    setPlansLapso(prev => {
      const idx = prev.findIndex(p => p.id === plan.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...plan, updatedAt: new Date().toISOString().split('T')[0] };
        return copy;
      }
      return [plan, ...prev];
    });
  };

  const updateLapsoPlanStatus = (planId: string, status: PlanStatus, feedback?: string) => {
    setPlansLapso(prev =>
      prev.map(p => (p.id === planId ? { ...p, status, reviewFeedback: feedback ?? p.reviewFeedback } : p))
    );
  };

  // Evaluation Actions
  const recordEvaluation = (record: Omit<EvaluationRecord, 'id' | 'recordedAt'>) => {
    const newRecord: EvaluationRecord = {
      ...record,
      id: `eval-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      recordedAt: new Date().toISOString().split('T')[0]
    };
    setEvaluations(prev => {
      const filtered = prev.filter(
        e =>
          !(
            e.studentId === record.studentId &&
            e.areaId === record.areaId &&
            e.moment === record.moment &&
            e.lapso === record.lapso &&
            e.indicatorId === record.indicatorId
          )
      );
      return [newRecord, ...filtered];
    });
  };

  const bulkRecordEvaluations = (records: Omit<EvaluationRecord, 'id' | 'recordedAt'>[]) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const newRecords: EvaluationRecord[] = records.map((r, i) => ({
      ...r,
      id: `eval-${Date.now()}-${i}`,
      recordedAt: timestamp
    }));
    setEvaluations(prev => [...newRecords, ...prev]);
  };

  const adjustStudentGrade = (
    studentId: string,
    areaId: string,
    oldScore: string,
    newScore: string,
    justification: string
  ) => {
    const student = students.find(s => s.id === studentId);
    const area = areas.find(a => a.id === areaId);
    if (!student || !area) return;

    // Update or add the evaluation record
    const numericScore = parseFloat(newScore);
    const newRecord: EvaluationRecord = {
      id: `eval-adjust-${Date.now()}`,
      studentId,
      areaId,
      moment: 'FINAL_LAPSO',
      lapso: activeLapso,
      scoreNumeric: isNaN(numericScore) ? undefined : numericScore,
      scoreQualitative: (['C', 'EP', 'I'].includes(newScore) ? newScore : undefined) as QualitativeScore,
      observations: `Ajuste oficial aprobado en Consejo: ${justification} (Antes: ${oldScore})`,
      recordedAt: new Date().toISOString().split('T')[0],
      teacherId: 'coordinacion-pedagogica'
    };

    setEvaluations(prev => [newRecord, ...prev]);

    // Append to council minute if available
    setCouncilMinutes(prev => {
      if (prev.length === 0) return prev;
      const copy = [...prev];
      copy[0] = {
        ...copy[0],
        adjustedScores: [
          ...copy[0].adjustedScores,
          {
            studentId,
            studentName: student.fullName,
            areaName: area.name,
            previousScore: oldScore,
            newScore,
            justification
          }
        ]
      };
      return copy;
    });
  };

  // AI Personalized Action Plan Generator
  const generateAIActionPlan = (studentId: string, areaId: string): AIActionPlan => {
    const student = students.find(s => s.id === studentId);
    const area = areas.find(a => a.id === areaId);

    const plan: AIActionPlan = {
      id: `ai-plan-${Date.now()}`,
      studentId,
      areaId,
      lapso: activeLapso,
      diagnosticSummary: `Análisis cognitivo SICE-CBA para ${student?.fullName || 'el estudiante'} en ${area?.name || 'el área'}. Se evidencian dificultades persistentes en la asimilación procedimental de contenidos del Lapso ${activeLapso}.`,
      identifiedGaps: [
        `Dificultad de aplicación práctica en conceptos clave de ${area?.name}.`,
        'Brecha en hábitos de estudio estructurado e interpretación de consignas complejas.',
        'Bajo rendimiento relativo en pruebas de tiempo limitado.'
      ],
      recommendedPedagogicalActions: [
        'Fase 1: Asignación de guía de microaprendizaje con refuerzo visual y glosario contextualizado.',
        'Fase 2: Acompañamiento en laboratorio/aula con tutor pedagógico o estudiante monitor.',
        'Fase 3: Elaboración de proyecto remedial práctico aplicado a su entorno cotidiano.',
        'Fase 4: Reevaluación formativa con instrumento adaptado de retroalimentación inmediata.'
      ],
      suggestedResources: [
        `Módulo Digital Bellas Artes: Refuerzo para ${area?.name}.`,
        'Banco de ejercicios autocorregibles en la plataforma SICE-CBA.',
        'Ficha de seguimiento de hábitos de estudio en casa con apoyo del representante.'
      ],
      teacherNotes: 'Plan preliminar generado por el motor de IA de SICE-CBA. Pendiente de validación por el docente titular.',
      status: 'GENERADO',
      createdAt: new Date().toISOString().split('T')[0],
      aiConfidenceScore: 92
    };

    setAiActionPlans(prev => [plan, ...prev]);
    return plan;
  };

  const updateAIPlanFeedback = (planId: string, teacherNotes: string, status: AIActionPlan['status']) => {
    setAiActionPlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, teacherNotes, status } : p))
    );
  };

  // Remedial & Intervention
  const addRemedialPlan = (plan: Omit<RemedialActionPlan, 'id'>) => {
    const newPlan: RemedialActionPlan = {
      ...plan,
      id: `rem-${Date.now()}`
    };
    setRemedialPlans(prev => [newPlan, ...prev]);
  };

  const updateRemedialStatus = (planId: string, status: RemedialActionPlan['status'], finalScore?: number) => {
    setRemedialPlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, status, finalScore } : p))
    );
  };

  // Council Minutes
  const createCouncilMinute = (minute: Omit<CouncilMeetingMinute, 'id'>) => {
    const newMinute: CouncilMeetingMinute = {
      ...minute,
      id: `acta-${Date.now()}`
    };
    setCouncilMinutes(prev => [newMinute, ...prev]);
  };

  const signCouncilMinute = (minuteId: string) => {
    setCouncilMinutes(prev =>
      prev.map(m => (m.id === minuteId ? { ...m, signed: true } : m))
    );
  };

  const resetToSeedData = () => {
    localStorage.clear();
    setCompetencies(INITIAL_COMPETENCIES);
    setIndicators(INITIAL_INDICATORS);
    setStrategies(INITIAL_STRATEGIES);
    setPlansQuincenal(INITIAL_PLANS_QUINCENAL);
    setPlansLapso(INITIAL_PLANS_LAPSO);
    setStudents(INITIAL_STUDENTS);
    setEvaluations(INITIAL_EVALUATION_RECORDS);
    setAiActionPlans(INITIAL_AI_ACTION_PLANS);
    setRemedialPlans(INITIAL_REMEDIAL_PLANS);
    setCouncilMinutes(INITIAL_COUNCIL_MINUTES);
  };

  return (
    <AppContext.Provider
      value={{
        currentLevel,
        setCurrentLevel,
        currentRole,
        setCurrentRole,
        activeLapso,
        setActiveLapso,
        currentSection,
        setCurrentSection,
        areas,
        levelAreas,
        competencies,
        indicators,
        strategies,
        addCompetency,
        addIndicator,
        transferCompetency,
        transferIndicator,
        addStrategy,
        transferStrategy,
        plansQuincenal,
        savePlanQuincenal,
        updateQuincenalStatus,
        plansLapso,
        savePlanLapso,
        updateLapsoPlanStatus,
        students,
        levelStudents,
        evaluations,
        recordEvaluation,
        bulkRecordEvaluations,
        adjustStudentGrade,
        aiActionPlans,
        generateAIActionPlan,
        updateAIPlanFeedback,
        remedialPlans,
        addRemedialPlan,
        updateRemedialStatus,
        councilMinutes,
        createCouncilMinute,
        signCouncilMinute,
        resetToSeedData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};
