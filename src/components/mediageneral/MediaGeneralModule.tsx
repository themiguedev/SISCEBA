import React from 'react';
import { useApp } from '../../context/AppContext';

// 1. Grupo Calificaciones
import { CalificacionesMediaGeneralView } from './CalificacionesMediaGeneralView';
import { CalificacionesEstudianteMediaView } from './CalificacionesEstudianteMediaView';
import { CalificacionesCRPMediaView } from './CalificacionesCRPMediaView';
import { CalificacionesOrientacionConvivenciaView } from './CalificacionesOrientacionConvivenciaView';
import { CalificacionesMateriasPendientesView } from './CalificacionesMateriasPendientesView';
import { CalificacionesPorLapsoView } from './CalificacionesPorLapsoView';
import { CalificacionesGeneralesMediaView } from './CalificacionesGeneralesMediaView';
import { CalificacionesNumericasMediaView } from './CalificacionesNumericasMediaView';

// 2. Grupo Evaluación
import { EstrategiasEvaluacionMediaView } from './EstrategiasEvaluacionMediaView';
import { ProgresoEvaluacionesMediaView } from './ProgresoEvaluacionesMediaView';
import { ResultadoAutoevaluacionMediaView } from './ResultadoAutoevaluacionMediaView';

// 3. Grupo Rasgos
import { RasgosPersonalidadMediaView } from './RasgosPersonalidadMediaView';
import { ResultadoRasgosMediaView } from './ResultadoRasgosMediaView';

// 4. Grupo Planes
import { AIActionPlansView } from '../communication/AIActionPlansView';
import { PlanLapsoView } from '../planning/PlanLapsoView';
import { PlanQuincenalView } from '../planning/PlanQuincenalView';

// 5. Grupo Extra
import { StrategiesBank } from '../planning/StrategiesBank';
import { ObservacionesBoletinMediaView } from './ObservacionesBoletinMediaView';
import { RevisionMediaGeneralView } from './RevisionMediaGeneralView';
import { ActasConsejoView } from '../communication/ActasConsejoView';
import { DisenadorPlanificacionView } from '../planning/DisenadorPlanificacionView';
import { BoletinInformativoView } from '../communication/BoletinInformativoView';
import { ControlPonderacionesMediaView } from './ControlPonderacionesMediaView';
import { ActasOficialesMediaView } from './ActasOficialesMediaView';

// Iconos
import {
  Award,
  ClipboardList,
  Heart,
  BookOpen,
  Sparkles,
  UserCheck,
  Palette,
  HeartHandshake,
  Clock,
  Layers,
  FileSpreadsheet,
  Calendar,
  Sliders,
  MessageSquare,
  Scale,
  FileText,
  Percent,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export type MediaGroup =
  | 'CALIFICACIONES'
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

  // Configuración de las 5 Funciones Oficiales de Media General
  const groupsConfig = [
    {
      id: 'CALIFICACIONES' as MediaGroup,
      label: 'Calificaciones',
      subtitle: 'Sábanas, Notas por Estudiante, CRP, Orientación, Materias Pendientes y Vigesimal',
      icon: Award,
      badgeColor: 'bg-blue-400 text-slate-900',
      subTabs: [
        {
          id: 'CALIFICACIONES',
          label: 'Calificaciones',
          shortDesc: 'Consolidado general de calificaciones vigesimales por año y sección.',
          icon: Award
        },
        {
          id: 'CALIFICACIONES_ESTUDIANTE',
          label: 'Calificaciones por estudiantes',
          shortDesc: 'Ficha individual por alumno: desglose de notas, ranking y promedio.',
          icon: UserCheck
        },
        {
          id: 'CALIFICACIONES_CRP',
          label: 'Calificaciones Grupos CRP',
          shortDesc: 'Gestión y calificaciones literales de Grupos de Creación y Producción.',
          icon: Palette
        },
        {
          id: 'CALIFICACIONES_ORIENTACION_CONVIVENCIA',
          label: 'Calificaciones de Orientación y Convivencia',
          shortDesc: 'Carga cuantitativa y apreciación formativa de Orientación y Convivencia.',
          icon: HeartHandshake
        },
        {
          id: 'CALIFICACIONES_MATERIAS_PENDIENTES',
          label: 'Calificaciones Materias Pendientes',
          shortDesc: 'Régimen de 4 momentos evaluativos oficiales MPPE para materias pendientes.',
          icon: Clock
        },
        {
          id: 'CALIFICACIONES_POR_LAPSO',
          label: 'Calificaciones por Lapso',
          shortDesc: 'Matriz comparativa de 1°, 2° y 3° lapso con promedio definitivo.',
          icon: Layers
        },
        {
          id: 'CALIFICACIONES_GENERALES',
          label: 'Calificaciones Generales',
          shortDesc: 'Sábana completa de calificaciones del salón con pensum MPPE y CBA.',
          icon: FileSpreadsheet
        },
        {
          id: 'CALIFICACIONES_NUMERICAS',
          label: 'Calificaciones Numéricas',
          shortDesc: 'Registro procesal continuo de notas cuantitativas de 01 a 20.',
          icon: FileSpreadsheet
        }
      ]
    },
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
        }
      ]
    }
  ];

  const currentGroupConfig = groupsConfig.find(g => g.id === activeGroupTab) || groupsConfig[0];

  const handleGroupSelect = (groupId: MediaGroup) => {
    setActiveGroupTab(groupId);
    const targetGroup = groupsConfig.find(g => g.id === groupId);
    if (targetGroup && targetGroup.subTabs.length > 0) {
      if (!targetGroup.subTabs.some(st => st.id === activeSubTab)) {
        setActiveSubTab(targetGroup.subTabs[0].id);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Institucional de Educación Media General */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2C2E53] to-[#1E2038] text-[#D4AF37] flex items-center justify-center font-black shadow-md shrink-0 border border-[#D4AF37]/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300">
                Subsistema de Educación Media General
              </span>
              {currentRole === 'ADMINISTRADOR' && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 dark:bg-purple-950/50 dark:text-purple-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Modo Administrador</span>
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#2C2E53] dark:text-white mt-0.5">
              Educación Media General (1er a 5to Año)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              U.E.P. Colegio Bellas Artes • Secciones Oficiales "A" y "B" • Escala Cuantitativa Vigesimal (01 a 20)
            </p>
          </div>
        </div>

        {/* Conmutador de las 5 Funciones de Media General */}
        <div className="bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl flex flex-wrap items-center gap-1.5 self-stretch xl:self-auto border border-slate-200 dark:border-slate-700">
          {groupsConfig.map(group => {
            const isGroupActive = activeGroupTab === group.id;
            const GroupIcon = group.icon;

            return (
              <button
                key={group.id}
                onClick={() => handleGroupSelect(group.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                  isGroupActive
                    ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm ring-1 ring-[#D4AF37]/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <GroupIcon className={`w-3.5 h-3.5 ${isGroupActive ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
                <span>{group.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subbarra Interactiva de Opciones de la Función Activa */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 sm:p-2.5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-2">
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
              className={`flex-1 min-w-[200px] text-left p-2.5 sm:p-3 rounded-xl transition-all border ${
                isSubActive
                  ? 'bg-indigo-500/10 border-indigo-500/80 shadow-xs text-[#2C2E53] dark:text-indigo-300'
                  : 'border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg shrink-0 ${
                  isSubActive ? 'bg-indigo-600 text-white font-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  <SubIcon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-black truncate">{subTab.label}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{subTab.shortDesc}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Renderizado de Vistas según la Función y Subpestaña Activa */}
      <div>
        {/* FUNCIÓN 1: CALIFICACIONES */}
        {activeGroupTab === 'CALIFICACIONES' && (
          <>
            {activeSubTab === 'CALIFICACIONES' && (
              <CalificacionesMediaGeneralView
                onNavigateToStudent={studentId => {
                  setActiveSubTab('CALIFICACIONES_ESTUDIANTE');
                }}
              />
            )}
            {activeSubTab === 'CALIFICACIONES_ESTUDIANTE' && (
              <CalificacionesEstudianteMediaView />
            )}
            {activeSubTab === 'CALIFICACIONES_CRP' && (
              <CalificacionesCRPMediaView />
            )}
            {activeSubTab === 'CALIFICACIONES_ORIENTACION_CONVIVENCIA' && (
              <CalificacionesOrientacionConvivenciaView />
            )}
            {activeSubTab === 'CALIFICACIONES_MATERIAS_PENDIENTES' && (
              <CalificacionesMateriasPendientesView />
            )}
            {activeSubTab === 'CALIFICACIONES_POR_LAPSO' && (
              <CalificacionesPorLapsoView />
            )}
            {activeSubTab === 'CALIFICACIONES_GENERALES' && (
              <CalificacionesGeneralesMediaView />
            )}
            {activeSubTab === 'CALIFICACIONES_NUMERICAS' && (
              <CalificacionesNumericasMediaView onNavigateToAI={onNavigateToAI} />
            )}
          </>
        )}

        {/* FUNCIÓN 2: EVALUACIÓN */}
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

        {/* FUNCIÓN 3: RASGOS */}
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

        {/* FUNCIÓN 4: PLANES */}
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

        {/* FUNCIÓN 5: EXTRA */}
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
          </>
        )}
      </div>

    </div>
  );
};
