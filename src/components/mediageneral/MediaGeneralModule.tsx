import React, { useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { hasSubTabAccess } from '../../utils/rbac';

// 1. Grupo Evaluación
import { EstrategiasEvaluacionMediaView } from './EstrategiasEvaluacionMediaView';
import { ProgresoEvaluacionesMediaView } from './ProgresoEvaluacionesMediaView';
import { ResultadoAutoevaluacionMediaView } from './ResultadoAutoevaluacionMediaView';

// 2. Grupo Rasgos
import { RasgosPersonalidadMediaView } from './RasgosPersonalidadMediaView';
import { ResultadoRasgosMediaView } from './ResultadoRasgosMediaView';

// 3. Grupo Planes
import { AIActionPlansView } from '../communication/AIActionPlansView';
import { PlanLapsoView } from '../planning/PlanLapsoView';
import { PlanQuincenalView } from '../planning/PlanQuincenalView';

// 4. Grupo Extra
import { StrategiesBank } from '../planning/StrategiesBank';
import { ObservacionesBoletinMediaView } from './ObservacionesBoletinMediaView';
import { RevisionMediaGeneralView } from './RevisionMediaGeneralView';
import { ActasConsejoView } from '../communication/ActasConsejoView';
import { DisenadorPlanificacionView } from '../planning/DisenadorPlanificacionView';
import { BoletinInformativoView } from '../communication/BoletinInformativoView';
import { ControlPonderacionesMediaView } from './ControlPonderacionesMediaView';
import { ActasOficialesMediaView } from './ActasOficialesMediaView';
import { CalificacionesCRPMediaView } from './CalificacionesCRPMediaView';

// Iconos
import {
  ClipboardList,
  Heart,
  BookOpen,
  Sparkles,
  Layers,
  Calendar,
  Sliders,
  MessageSquare,
  Scale,
  FileText,
  Percent,
  TrendingUp,
  ShieldCheck,
  GraduationCap,
  Palette
} from 'lucide-react';

export type MediaGroup =
  | 'EVALUACION'
  | 'RASGOS'
  | 'PLANES'
  | 'EXTRA';

interface MediaGeneralModuleProps {
  activeGroupTab: MediaGroup;
  setActiveGroupTab: (group: MediaGroup) => void;
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
  onNavigateToAI?: () => void;
}

export const MediaGeneralModule: React.FC<MediaGeneralModuleProps> = ({
  activeGroupTab,
  setActiveGroupTab,
  activeSubTab,
  setActiveSubTab,
  onNavigateToAI
}) => {
  const { currentRole } = useApp();

  // Configuración de los 4 Submódulos Oficiales de Media General (Admin)
  const groupsConfig = [
    {
      id: 'EVALUACION' as MediaGroup,
      label: 'Evaluación',
      subtitle: 'Estrategias, Semáforo de Progreso y Cronograma de Autoevaluación',
      icon: ClipboardList,
      badgeColor: 'bg-emerald-400 text-slate-900',
      subTabs: [
        {
          id: 'ESTRATEGIAS_EVALUACION',
          label: 'Estrategias de Evaluación',
          shortDesc: 'Supervisión y catálogo de estrategias e instrumentos evaluativos.',
          icon: ClipboardList
        },
        {
          id: 'PROGRESO_EVALUACIONES',
          label: 'Progreso de Evaluaciones',
          shortDesc: 'Semáforo y porcentaje de carga de notas procesales por salón.',
          icon: TrendingUp
        },
        {
          id: 'RESULTADO_AUTOEVALUACION',
          label: 'Resultado de Autoevaluación cronograma',
          shortDesc: 'Cronograma, ponderación y resultados reflexivos de autoevaluación.',
          icon: Calendar
        }
      ]
    },
    {
      id: 'RASGOS' as MediaGroup,
      label: 'Rasgos',
      subtitle: 'Rasgos de Personalidad y Matriz de Resultados Actitudinales',
      icon: Heart,
      badgeColor: 'bg-purple-400 text-slate-900',
      subTabs: [
        {
          id: 'RASGOS_PERSONALIDAD',
          label: 'Rasgos de Personalidad',
          shortDesc: 'Evaluación de puntualidad, responsabilidad, uniforme y convivencia.',
          icon: Sliders
        },
        {
          id: 'RESULTADO_RASGOS',
          label: 'Resultado de Rasgos',
          shortDesc: 'Matriz estadística consolidada de rasgos actitudinales por salón.',
          icon: Heart
        }
      ]
    },
    {
      id: 'PLANES' as MediaGroup,
      label: 'Planes',
      subtitle: 'Planes de Acción Personalizados, Planes de Lapso y Quincenales',
      icon: BookOpen,
      badgeColor: 'bg-sky-400 text-slate-900',
      subTabs: [
        {
          id: 'PLANES_ACCION_PERSONALIZADOS',
          label: 'Planes de accion personalizado',
          shortDesc: 'Intervenciones remediales y planes de nivelación pedagógica con IA.',
          icon: Sparkles
        },
        {
          id: 'PLANES_LAPSO',
          label: 'Planes de Lapso',
          shortDesc: 'Planificación de lapso oficial con competencias, contenidos y fechas.',
          icon: Calendar
        },
        {
          id: 'PLANES_QUINCENALES',
          label: 'Planes Quincenales',
          shortDesc: 'Planificación didáctica quincenal de aula por asignatura.',
          icon: BookOpen
        }
      ]
    },
    {
      id: 'EXTRA' as MediaGroup,
      label: 'Extra',
      subtitle: 'Banco de Estrategias, Observaciones, Revisión, Consejo, Diseñador, Boletín, Ponderaciones y Actas',
      icon: Sparkles,
      badgeColor: 'bg-amber-400 text-slate-900',
      subTabs: [
        {
          id: 'BANCO_ESTRATEGIAS',
          label: 'Banco de estrategias',
          shortDesc: 'Catálogo institucional de técnicas e instrumentos de evaluación.',
          icon: Layers
        },
        {
          id: 'OBSERVACIONES_BOLETIN',
          label: 'Observaciones al boletín',
          shortDesc: 'Catálogo de apreciaciones cualitativas para el boletín informativo.',
          icon: MessageSquare
        },
        {
          id: 'REVISION',
          label: 'Revisión',
          shortDesc: 'Pruebas de Revisión de Julio del régimen MPPE (reparaciones 01-20).',
          icon: Scale
        },
        {
          id: 'CONSEJO_CURSO',
          label: 'Consejo de Curso',
          shortDesc: 'Deliberación formal, acuerdos y actas de consejo de fin de lapso.',
          icon: Scale
        },
        {
          id: 'DISENADOR_DIDACTICO',
          label: 'Diseñador didáctico',
          shortDesc: 'Diseñador didáctico oficial para Media General.',
          icon: Sparkles
        },
        {
          id: 'BOLETIN_INFORMATIVO',
          label: 'Boletín informativo',
          shortDesc: 'Emisión, vista previa e impresión de boletines de Media General.',
          icon: GraduationCap
        },
        {
          id: 'ESTRATEGIAS_PONDERACIONES',
          label: 'Estrategias y ponderaciones',
          shortDesc: 'Auditoría de cumplimiento normativo: tope del 20% por evaluación.',
          icon: Percent
        },
        {
          id: 'ACTAS',
          label: 'Actas',
          shortDesc: 'Emisión de actas oficiales institucionales y de calificaciones.',
          icon: FileText
        },
        {
          id: 'CALIFICACIONES_CRP',
          label: 'Grupos CRP',
          shortDesc: 'Reporte de estudiantes de Grupos CRP (Creación, Recreación y Producción) y carga de notas.',
          icon: Palette
        }
      ]
    }
  ];

  const filteredGroupsConfig = useMemo(() => {
    return groupsConfig
      .filter(g => hasSubTabAccess(currentRole, 'MEDIA_GENERAL', g.id))
      .map(g => ({
        ...g,
        subTabs: g.subTabs.filter(st => hasSubTabAccess(currentRole, 'MEDIA_GENERAL', st.id))
      }))
      .filter(g => g.subTabs.length > 0);
  }, [currentRole]);

  const currentGroupConfig = filteredGroupsConfig.find(g => g.id === activeGroupTab) || filteredGroupsConfig[0] || groupsConfig[0];
  const CurrentGroupIcon = currentGroupConfig.icon;

  const handleGroupSelect = (groupId: MediaGroup) => {
    setActiveGroupTab(groupId);
    const targetGroup = filteredGroupsConfig.find(g => g.id === groupId);
    if (targetGroup && targetGroup.subTabs.length > 0) {
      if (!targetGroup.subTabs.some(st => st.id === activeSubTab)) {
        setActiveSubTab(targetGroup.subTabs[0].id);
      }
    }
  };

  useEffect(() => {
    if (filteredGroupsConfig.length > 0 && !filteredGroupsConfig.some(g => g.id === activeGroupTab)) {
      setActiveGroupTab(filteredGroupsConfig[0].id);
      if (filteredGroupsConfig[0].subTabs.length > 0) {
        setActiveSubTab(filteredGroupsConfig[0].subTabs[0].id);
      }
    } else if (currentGroupConfig && !currentGroupConfig.subTabs.some(st => st.id === activeSubTab)) {
      if (currentGroupConfig.subTabs.length > 0) {
        setActiveSubTab(currentGroupConfig.subTabs[0].id);
      }
    }
  }, [activeGroupTab, activeSubTab, filteredGroupsConfig, currentGroupConfig, setActiveGroupTab, setActiveSubTab]);

  return (
    <div className="space-y-4">
      
      {/* Header y Barra de Submódulos Unificada (Diseño Institucional Idéntico a Inicial y Primaria) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden transition-all">
        {/* Fila Superior: Nivel y Función Activa */}
        <div className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 flex items-center justify-center shrink-0 border-2 border-amber-300 dark:border-amber-600 shadow-2xs font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">
                Educación Media General
              </h1>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border-2 border-slate-300 dark:border-slate-600">
                1° a 5° Año
              </span>
              {currentRole === 'ADMINISTRADOR' && (
                <span className="text-[10px] font-black text-purple-950 dark:text-purple-200 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-md border-2 border-purple-300 dark:border-purple-700">
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Insignia de Contraste Permanente de Función Activa */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border-2 border-amber-400 dark:border-amber-600 text-xs font-black shadow-xs">
              <CurrentGroupIcon className="w-4 h-4 text-amber-800 dark:text-amber-400" />
              <span>{currentGroupConfig.label}</span>
            </div>
          </div>
        </div>

        {/* Fila Inferior: Submódulos con track contrastado y píldoras de alto impacto permanente */}
        <div className="bg-slate-100 dark:bg-slate-950 border-t-2 border-slate-200 dark:border-slate-800 px-3.5 py-2.5 flex flex-wrap items-center gap-2">
          {currentGroupConfig.subTabs.map(subTab => {
            const isSubActive =
              activeSubTab === subTab.id ||
              (subTab.id === 'PLANES_ACCION_PERSONALIZADOS' && activeSubTab === 'IA_ACTION_PLANS') ||
              (subTab.id === 'PLANES_LAPSO' && activeSubTab === 'PLAN_LAPSO') ||
              (subTab.id === 'PLANES_QUINCENALES' && activeSubTab === 'PLAN_QUINCENAL') ||
              (subTab.id === 'CONSEJO_CURSO' && activeSubTab === 'ACTAS_CONSEJO') ||
              (subTab.id === 'DISENADOR_DIDACTICO' && activeSubTab === 'DISENADOR_OFICIAL') ||
              (subTab.id === 'BOLETIN_INFORMATIVO' && activeSubTab === 'BOLETIN');
            const SubIcon = subTab.icon;

            return (
              <button
                key={subTab.id}
                onClick={() => setActiveSubTab(subTab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSubActive
                    ? 'bg-[#2C2E53] dark:!bg-[#1B1C33] text-white dark:!text-white shadow-md border-2 border-[#2C2E53] dark:!border-[#D4AF37]'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-2xs'
                }`}
                title={subTab.shortDesc}
              >
                <SubIcon className={`w-3.5 h-3.5 shrink-0 transition-colors ${isSubActive ? 'text-amber-300 dark:!text-amber-400' : 'text-slate-600 dark:text-slate-400'}`} />
                <span>{subTab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Renderizado de Vistas según el Submódulo y Subpestaña Activa */}
      <div>
        {/* SUBMÓDULO 1: EVALUACIÓN */}
        {activeGroupTab === 'EVALUACION' && (
          <>
            {activeSubTab === 'ESTRATEGIAS_EVALUACION' && (
              <EstrategiasEvaluacionMediaView />
            )}
            {activeSubTab === 'PROGRESO_EVALUACIONES' && (
              <ProgresoEvaluacionesMediaView />
            )}
            {activeSubTab === 'RESULTADO_AUTOEVALUACION' && (
              <ResultadoAutoevaluacionMediaView />
            )}
          </>
        )}

        {/* SUBMÓDULO 2: RASGOS */}
        {activeGroupTab === 'RASGOS' && (
          <>
            {activeSubTab === 'RASGOS_PERSONALIDAD' && (
              <RasgosPersonalidadMediaView />
            )}
            {activeSubTab === 'RESULTADO_RASGOS' && (
              <ResultadoRasgosMediaView />
            )}
          </>
        )}

        {/* SUBMÓDULO 3: PLANES */}
        {activeGroupTab === 'PLANES' && (
          <>
            {(activeSubTab === 'PLANES_ACCION_PERSONALIZADOS' || activeSubTab === 'IA_ACTION_PLANS') && (
              <AIActionPlansView />
            )}
            {(activeSubTab === 'PLANES_LAPSO' || activeSubTab === 'PLAN_LAPSO') && (
              <PlanLapsoView />
            )}
            {(activeSubTab === 'PLANES_QUINCENALES' || activeSubTab === 'PLAN_QUINCENAL') && (
              <PlanQuincenalView />
            )}
          </>
        )}

        {/* SUBMÓDULO 4: EXTRA */}
        {activeGroupTab === 'EXTRA' && (
          <>
            {activeSubTab === 'BANCO_ESTRATEGIAS' && (
              <StrategiesBank />
            )}
            {activeSubTab === 'OBSERVACIONES_BOLETIN' && (
              <ObservacionesBoletinMediaView />
            )}
            {activeSubTab === 'REVISION' && (
              <RevisionMediaGeneralView />
            )}
            {(activeSubTab === 'CONSEJO_CURSO' || activeSubTab === 'ACTAS_CONSEJO') && (
              <ActasConsejoView />
            )}
            {(activeSubTab === 'DISENADOR_DIDACTICO' || activeSubTab === 'DISENADOR_OFICIAL') && (
              <DisenadorPlanificacionView />
            )}
            {(activeSubTab === 'BOLETIN_INFORMATIVO' || activeSubTab === 'BOLETIN') && (
              <BoletinInformativoView />
            )}
            {activeSubTab === 'ESTRATEGIAS_PONDERACIONES' && (
              <ControlPonderacionesMediaView />
            )}
            {activeSubTab === 'ACTAS' && (
              <ActasOficialesMediaView />
            )}
            {activeSubTab === 'CALIFICACIONES_CRP' && (
              <CalificacionesCRPMediaView />
            )}
          </>
        )}
      </div>

    </div>
  );
};
