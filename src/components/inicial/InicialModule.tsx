import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

// Views
import { IndicadoresInicialView } from './IndicadoresInicialView';
import { IndicatorsBank } from '../planning/IndicatorsBank';
import { CuraduriaIndicadoresView } from './CuraduriaIndicadoresView';
import { IndicadoresActitudinalesView } from './IndicadoresActitudinalesView';
import { ObservacionesPreescolarView } from './ObservacionesPreescolarView';
import { ProcesalGradebookView } from '../evaluation/ProcesalGradebookView';
import { PlanLapsoView } from '../planning/PlanLapsoView';
import { PlanQuincenalView } from '../planning/PlanQuincenalView';
import { DisenadorPlanificacionView } from '../planning/DisenadorPlanificacionView';
import { BoletinInformativoView } from '../communication/BoletinInformativoView';
import { DiagnosticView } from '../evaluation/DiagnosticView';
import { FinalLapsoView } from '../evaluation/FinalLapsoView';
import { StatisticsChartsView } from '../evaluation/StatisticsChartsView';
import { ActasConsejoView } from '../communication/ActasConsejoView';
import { InstitutionalReportsView } from '../communication/InstitutionalReportsView';
import { AreasProfilesView } from '../planning/AreasProfilesView';
import { CompetenciesBank } from '../planning/CompetenciesBank';
import { StrategiesBank } from '../planning/StrategiesBank';
import { EducationalResourcesBank } from '../planning/EducationalResourcesBank';
import { BancoDimensionesView } from './BancoDimensionesView';

// Icons
import {
  Tag,
  SpellCheck,
  FileSpreadsheet,
  Heart,
  FileText,
  ClipboardList,
  GraduationCap,
  Award,
  Sparkles,
  Layers,
  ShieldCheck,
  BookOpen,
  BrainCircuit,
  BarChart3,
  Scale,
  FileCheck,
  Lightbulb,
  Boxes,
  Compass,
  LayoutGrid
} from 'lucide-react';

export type InicialGroup =
  | 'DIMENSIONES'
  | 'INDICADORES'
  | 'PLANES'
  | 'OBSERVACIONES'
  | 'DIAGNOSTICO_CIERRE'
  | 'MALLA_RECURSOS';

interface InicialModuleProps {
  activeGroupTab: InicialGroup;
  setActiveGroupTab: (group: InicialGroup) => void;
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
  onNavigateToAI?: () => void;
}

export const InicialModule: React.FC<InicialModuleProps> = ({
  activeGroupTab,
  setActiveGroupTab,
  activeSubTab,
  setActiveSubTab,
  onNavigateToAI
}) => {
  const { currentRole } = useApp();
  const [designerPlanId, setDesignerPlanId] = useState<string | undefined>();

  // Definición completa de las agrupaciones del Módulo Inicial
  const groupsConfig = [
    {
      id: 'DIMENSIONES' as InicialGroup,
      label: 'Dimensiones',
      subtitle: 'Banco de Dimensiones y Áreas Curriculares',
      icon: Compass,
      badgeColor: 'bg-amber-400 text-slate-900',
      subTabs: [
        {
          id: 'BANCO_DIMENSIONES',
          label: 'Banco de dimensiones',
          shortDesc: 'Catálogo de dimensiones del desarrollo bio-psicosocial y áreas curriculares por lapso y grado.',
          icon: LayoutGrid
        }
      ]
    },
    {
      id: 'INDICADORES' as InicialGroup,
      label: 'Indicadores',
      subtitle: 'Banco, Curaduría, Carga y Rasgos Actitudinales',
      icon: Tag,
      badgeColor: 'bg-amber-400 text-slate-900',
      subTabs: [
        {
          id: 'BANCO_INDICADORES',
          label: 'Indicadores',
          shortDesc: 'Gestione los indicadores de las áreas a valorar por año escolar, lapso, sala y sección.',
          icon: Tag
        },
        {
          id: 'CURADURIA_INDICADORES',
          label: 'Curaduría de Criterios',
          shortDesc: 'Revisión, redacción y ortografía de los indicadores de evaluación.',
          icon: SpellCheck
        },
        {
          id: 'REVISION_CARGA',
          label: 'Revisión de Carga',
          shortDesc: 'Revisión de la carga de los indicadores evaluados en cada sala y sección.',
          icon: FileSpreadsheet
        },
        {
          id: 'INDICADORES_ACTITUDINALES',
          label: 'Indicadores Actitudinales',
          shortDesc: 'Carga y revisión de los indicadores actitudinales, hábitos y convivencia.',
          icon: Heart
        }
      ]
    },
    {
      id: 'PLANES' as InicialGroup,
      label: 'Planes',
      subtitle: 'Planes de Lapso, Quincenales y Diseñador',
      icon: ClipboardList,
      badgeColor: 'bg-sky-400 text-slate-900',
      subTabs: [
        {
          id: 'PLAN_LAPSO',
          label: 'Planes de Lapso',
          shortDesc: 'Estructuración macro, objetivos y cronograma maestro por momento pedagógico.',
          icon: FileText
        },
        {
          id: 'PLAN_QUINCENAL',
          label: 'Planes Quincenales',
          shortDesc: 'Planificación didáctica quincenal de aula articulada con la rutina diaria y rincones de trabajo.',
          icon: ClipboardList
        },
        {
          id: 'DISENADOR_OFICIAL',
          label: 'Diseñador Didáctico Oficial',
          shortDesc: 'Plantilla oficial de planificación con rutina diaria y rincones (Construir, Representar, Expresar, Experimentar).',
          icon: Sparkles
        }
      ]
    },
    {
      id: 'OBSERVACIONES' as InicialGroup,
      label: 'Observaciones',
      subtitle: 'Observaciones al Boletín y Preescolar',
      icon: GraduationCap,
      badgeColor: 'bg-emerald-400 text-slate-900',
      subTabs: [
        {
          id: 'BOLETIN',
          label: 'Observaciones al Boletín',
          shortDesc: 'Redacción, revisión y validación de las apreciaciones cualitativas finales que se imprimen en el boletín oficial.',
          icon: GraduationCap
        },
        {
          id: 'OBS_PREESCOLAR',
          label: 'Observaciones de Preescolar',
          shortDesc: 'Registro y seguimiento continuo del perfil biopsicosocial, adaptación, motricidad y ritmo de aprendizaje del infante.',
          icon: Award
        }
      ]
    },
    {
      id: 'DIAGNOSTICO_CIERRE' as InicialGroup,
      label: 'Diagnóstico y Cierre',
      subtitle: 'Diagnóstica, Final de Lapso, Estadísticas y Actas',
      icon: BrainCircuit,
      badgeColor: 'bg-purple-400 text-slate-900',
      subTabs: [
        {
          id: 'DIAGNOSTICA',
          label: 'Evaluación Diagnóstica',
          shortDesc: 'Valoración inicial biopsicosocial, psicomotricidad, lenguaje y adaptación al aula en las primeras semanas.',
          icon: BrainCircuit
        },
        {
          id: 'FINAL_LAPSO',
          label: 'Final de Lapso',
          shortDesc: 'Consolidación cualitativa de aprendizajes del lapso y verificación de estatus.',
          icon: Award
        },
        {
          id: 'ESTADISTICAS',
          label: 'Cuadros Estadísticos',
          shortDesc: 'Métricas cualitativas de logro, distribución por literales (A, B, C, D, E) y cuadros de avance.',
          icon: BarChart3
        },
        {
          id: 'ACTAS_CONSEJO',
          label: 'Actas de Consejo & Ajustes',
          shortDesc: 'Registro deliberativo de acuerdos docentes, casos de acompañamiento psicopedagógico y firmas.',
          icon: Scale
        },
        {
          id: 'REPORTES_INSTITUCIONALES',
          label: 'Reportes de Cierre',
          shortDesc: 'Fichas acumulativas integrales y certificados de culminación de Educación Inicial.',
          icon: FileCheck
        }
      ]
    },
    {
      id: 'MALLA_RECURSOS' as InicialGroup,
      label: 'Malla y Recursos',
      subtitle: 'Áreas de Formación, Competencias, Estrategias y Materiales',
      icon: Layers,
      badgeColor: 'bg-teal-400 text-slate-900',
      subTabs: [
        {
          id: 'AREAS_PERFILES',
          label: 'Áreas y Perfiles Docentes',
          shortDesc: 'Malla curricular oficial de Inicial, carga horaria semanal y perfil docente idóneo.',
          icon: BookOpen
        },
        {
          id: 'BANCO_COMPETENCIAS',
          label: 'Banco de Competencias',
          shortDesc: 'Dimensiones y competencias curriculares por sala de 4 y 5 años.',
          icon: Layers
        },
        {
          id: 'BANCO_ESTRATEGIAS',
          label: 'Banco de Estrategias',
          shortDesc: 'Catálogo de estrategias didácticas para asamblea, rincones lúdicos y recuento.',
          icon: Lightbulb
        },
        {
          id: 'BANCO_RECURSOS',
          label: 'Banco de Recursos Didácticos',
          shortDesc: 'Inventario de material concreto, sensorial, bloques de madera, títeres y robótica inicial.',
          icon: Boxes
        }
      ]
    }
  ];

  const currentGroupConfig = groupsConfig.find(g => g.id === activeGroupTab) || groupsConfig[0];
  const CurrentGroupIcon = currentGroupConfig.icon;

  const handleGroupSelect = (groupId: InicialGroup) => {
    setActiveGroupTab(groupId);
    const targetGroup = groupsConfig.find(g => g.id === groupId);
    if (targetGroup && targetGroup.subTabs.length > 0) {
      if (!targetGroup.subTabs.some(st => st.id === activeSubTab)) {
        setActiveSubTab(targetGroup.subTabs[0].id);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header y Barra de Submódulos Unificada (Contraste Permanente en Modo Claro y Oscuro) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden transition-all">
        {/* Fila Superior: Nivel y Función Activa */}
        <div className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 flex items-center justify-center shrink-0 border-2 border-amber-300 dark:border-amber-600 shadow-2xs font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">
                Educación Inicial
              </h1>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border-2 border-slate-300 dark:border-slate-600">
                Salas de 4 y 5 Años
              </span>
              {currentRole === 'ADMINISTRADOR' && (
                <span className="text-[10px] font-black text-purple-950 dark:text-purple-200 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-md border-2 border-purple-300 dark:border-purple-700">
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Insignia de Contraste Permanente de Función Activa */}
          <div className="flex items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border-2 border-amber-400 dark:border-amber-600 text-xs font-black shadow-xs">
              <CurrentGroupIcon className="w-4 h-4 text-amber-800 dark:text-amber-400" />
              <span>{currentGroupConfig.label}</span>
            </div>
          </div>
        </div>

        {/* Fila Inferior: Submódulos con track contrastado y píldoras de alto impacto permanente */}
        <div className="bg-slate-100 dark:bg-slate-950 border-t-2 border-slate-200 dark:border-slate-800 px-3.5 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {currentGroupConfig.subTabs.map(subTab => {
            const isSubActive = activeSubTab === subTab.id;
            const SubIcon = subTab.icon;

            return (
              <button
                key={subTab.id}
                onClick={() => setActiveSubTab(subTab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSubActive
                    ? 'bg-[#2C2E53] text-white shadow-md border-2 border-[#2C2E53] dark:bg-amber-400 dark:text-slate-950 dark:border-amber-400'
                    : 'bg-white/90 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-2xs'
                }`}
                title={subTab.shortDesc}
              >
                <SubIcon className={`w-3.5 h-3.5 transition-colors ${isSubActive ? 'text-amber-300 dark:text-slate-950' : 'text-slate-600 dark:text-slate-400'}`} />
                <span>{subTab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vistas Renderizadas a Ancho Completo */}
      <div>
        {/* GRUPO 0: DIMENSIONES (Primero) */}
        {activeGroupTab === 'DIMENSIONES' && (
          <>
            {activeSubTab === 'BANCO_DIMENSIONES' && <BancoDimensionesView />}
          </>
        )}

        {/* GRUPO 1: INDICADORES */}
        {activeGroupTab === 'INDICADORES' && (
          <>
            {activeSubTab === 'BANCO_INDICADORES' && <IndicadoresInicialView />}
            {activeSubTab === 'CURADURIA_INDICADORES' && <CuraduriaIndicadoresView />}
            {activeSubTab === 'REVISION_CARGA' && (
              <ProcesalGradebookView onNavigateToAI={onNavigateToAI} />
            )}
            {activeSubTab === 'INDICADORES_ACTITUDINALES' && <IndicadoresActitudinalesView />}
          </>
        )}

        {/* GRUPO 2: PLANES */}
        {activeGroupTab === 'PLANES' && (
          <>
            {activeSubTab === 'PLAN_LAPSO' && <PlanLapsoView />}
            {activeSubTab === 'PLAN_QUINCENAL' && (
              <PlanQuincenalView
                onOpenInDesigner={(planIdToOpen) => {
                  setDesignerPlanId(planIdToOpen);
                  setActiveSubTab('DISENADOR_OFICIAL');
                }}
              />
            )}
            {activeSubTab === 'DISENADOR_OFICIAL' && (
              <DisenadorPlanificacionView
                initialPlanId={designerPlanId}
                onBackToList={() => {
                  setDesignerPlanId(undefined);
                  setActiveSubTab('PLAN_QUINCENAL');
                }}
              />
            )}
          </>
        )}

        {/* GRUPO 3: OBSERVACIONES */}
        {activeGroupTab === 'OBSERVACIONES' && (
          <>
            {activeSubTab === 'BOLETIN' && <BoletinInformativoView />}
            {activeSubTab === 'OBS_PREESCOLAR' && <ObservacionesPreescolarView />}
          </>
        )}

        {/* GRUPO 4: DIAGNÓSTICO Y CIERRE */}
        {activeGroupTab === 'DIAGNOSTICO_CIERRE' && (
          <>
            {activeSubTab === 'DIAGNOSTICA' && <DiagnosticView />}
            {activeSubTab === 'FINAL_LAPSO' && <FinalLapsoView />}
            {activeSubTab === 'ESTADISTICAS' && <StatisticsChartsView />}
            {activeSubTab === 'ACTAS_CONSEJO' && <ActasConsejoView />}
            {activeSubTab === 'REPORTES_INSTITUCIONALES' && <InstitutionalReportsView />}
          </>
        )}

        {/* GRUPO 5: MALLA Y RECURSOS */}
        {activeGroupTab === 'MALLA_RECURSOS' && (
          <>
            {activeSubTab === 'AREAS_PERFILES' && <AreasProfilesView />}
            {activeSubTab === 'BANCO_COMPETENCIAS' && <CompetenciesBank />}
            {activeSubTab === 'BANCO_ESTRATEGIAS' && <StrategiesBank />}
            {activeSubTab === 'BANCO_RECURSOS' && <EducationalResourcesBank />}
          </>
        )}
      </div>
    </div>
  );
};
