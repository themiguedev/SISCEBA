import React from 'react';
import { useApp } from '../../context/AppContext';

// 1. Grupo Indicadores
import { CuraduriaPrimariaView } from './CuraduriaPrimariaView';
import { SeguimientoIndicadoresPrimariaView } from './SeguimientoIndicadoresPrimariaView';
import { RevisionCargaPrimariaView } from './RevisionCargaPrimariaView';
import { IndicadoresActitudinalesPrimariaView } from './IndicadoresActitudinalesPrimariaView';
import { CargaLectoescrituraPrimariaView } from './CargaLectoescrituraPrimariaView';
import { ProgresoIndicadoresPrimariaView } from './ProgresoIndicadoresPrimariaView';
import { IndicatorsBank } from '../planning/IndicatorsBank';

// 2. Grupo Calificaciones
import { CalificacionesEstudiantePrimariaView } from './CalificacionesEstudiantePrimariaView';
import { CalificacionesCursoPrimariaView } from './CalificacionesCursoPrimariaView';

// 3. Grupo Boletín
import { BoletinInformativoView } from '../communication/BoletinInformativoView';
import { ObservacionesBoletinPrimariaView } from './ObservacionesBoletinPrimariaView';

// 4. Grupo Áreas de Formación
import { AreasProfilesView } from '../planning/AreasProfilesView';

// 5. Grupo Diseñador Didáctico
import { DisenadorPlanificacionView } from '../planning/DisenadorPlanificacionView';

// 6. Grupo Competencias Didáctico
import { CompetenciesBank } from '../planning/CompetenciesBank';

// Iconos
import {
  Tag,
  SpellCheck,
  ClipboardList,
  Clock,
  Heart,
  BookOpen,
  TrendingUp,
  Award,
  FileSpreadsheet,
  GraduationCap,
  MessageSquare,
  Sparkles,
  Layers,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export type PrimariaGroup =
  | 'INDICADORES'
  | 'CALIFICACIONES'
  | 'BOLETIN'
  | 'AREAS_FORMACION'
  | 'DISENADOR_DIDACTICO'
  | 'COMPETENCIAS_DIDACTICO';

interface PrimariaModuleProps {
  activeGroupTab: PrimariaGroup;
  setActiveGroupTab: (group: PrimariaGroup) => void;
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
  onNavigateToAI?: () => void;
}

export const PrimariaModule: React.FC<PrimariaModuleProps> = ({
  activeGroupTab,
  setActiveGroupTab,
  activeSubTab,
  setActiveSubTab,
  onNavigateToAI
}) => {
  const { currentRole } = useApp();

  // Configuración oficial de las 6 Funciones de Educación Primaria
  const groupsConfig = [
    {
      id: 'INDICADORES' as PrimariaGroup,
      label: 'Indicadores',
      subtitle: 'Curaduría, Seguimiento, Carga, Actitudinales, Lectoescritura y Progreso',
      icon: Tag,
      badgeColor: 'bg-teal-400 text-slate-900',
      subTabs: [
        {
          id: 'CURADURIA_INDICADORES',
          label: 'Revisión y Ortografía',
          shortDesc: 'Revisión, redacción y ortografía de los indicadores de evaluación.',
          icon: SpellCheck
        },
        {
          id: 'PROCESAL',
          label: 'Seguimiento de Indicadores',
          shortDesc: 'Seguimiento de los indicadores de evaluación continua (Escala L, A, P, I).',
          icon: ClipboardList
        },
        {
          id: 'REVISION_CARGA',
          label: 'Revisión de la Carga',
          shortDesc: 'Revisión de la carga de los indicadores evaluados en cada grado y sección.',
          icon: Clock
        },
        {
          id: 'INDICADORES_ACTITUDINALES',
          label: 'Indicadores Actitudinales',
          shortDesc: 'Carga y revisión de los indicadores Actitudinales, hábitos y convivencia escolar.',
          icon: Heart
        },
        {
          id: 'INDICADORES_LECTOESCRITURA',
          label: 'Indicadores de Lectoescritura',
          shortDesc: 'Carga de indicadores de Lectoescritura: fluidez, velocidad ppm y comprensión.',
          icon: BookOpen
        },
        {
          id: 'PROGRESO_INDICADORES',
          label: 'Progreso de los Indicadores',
          shortDesc: 'Progreso de los indicadores, curvas cualitativas y alertas tempranas.',
          icon: TrendingUp
        },
        {
          id: 'BANCO_INDICADORES',
          label: 'Banco de Indicadores',
          shortDesc: 'Catálogo de criterios de logro clasificados por grado y área de Primaria.',
          icon: Tag
        }
      ]
    },
    {
      id: 'CALIFICACIONES' as PrimariaGroup,
      label: 'Calificaciones',
      subtitle: 'Promedios y Sábanas: Pensum MPPE vs Pensum CBA',
      icon: Award,
      badgeColor: 'bg-blue-400 text-slate-900',
      subTabs: [
        {
          id: 'CALIFICACIONES_ESTUDIANTE',
          label: 'Calificaciones por Estudiante',
          shortDesc: 'Calificaciones por estudiante: Promedio MPPE y Promedio CBA.',
          icon: UserCheck
        },
        {
          id: 'CALIFICACIONES_CURSO',
          label: 'Calificaciones por Curso',
          shortDesc: 'Calificaciones por curso: pensum MPPE y pensum CBA.',
          icon: FileSpreadsheet
        }
      ]
    },
    {
      id: 'BOLETIN' as PrimariaGroup,
      label: 'Boletín',
      subtitle: 'Boletines Informativos y Catálogo de Observaciones',
      icon: GraduationCap,
      badgeColor: 'bg-emerald-400 text-slate-900',
      subTabs: [
        {
          id: 'BOLETIN_INFORMATIVO',
          label: 'Boletín Informativo',
          shortDesc: 'Boletín Informativo oficial de rendimiento cualitativo de Primaria.',
          icon: GraduationCap
        },
        {
          id: 'OBSERVACIONES_BOLETIN',
          label: 'Lista de Observaciones',
          shortDesc: 'Lista de observaciones para el boletín y recomendaciones al hogar.',
          icon: MessageSquare
        }
      ]
    },
    {
      id: 'AREAS_FORMACION' as PrimariaGroup,
      label: 'Áreas de Formación',
      subtitle: 'Malla Curricular Oficial de Primaria CBA',
      icon: BookOpen,
      badgeColor: 'bg-amber-400 text-slate-900',
      subTabs: [
        {
          id: 'AREAS_FORMACION',
          label: 'Áreas de Formación',
          shortDesc: 'Malla curricular, asignaturas regulares e integradas y cargas horarias.',
          icon: BookOpen
        }
      ]
    },
    {
      id: 'DISENADOR_DIDACTICO' as PrimariaGroup,
      label: 'Diseñador Didáctico',
      subtitle: 'Plantilla Oficial de Planificación de Primaria',
      icon: Sparkles,
      badgeColor: 'bg-purple-400 text-slate-900',
      subTabs: [
        {
          id: 'DISENADOR_DIDACTICO',
          label: 'Diseñador Didáctico',
          shortDesc: 'Diseñador didáctico con proyectos de aprendizaje (PA) y ejes integradores.',
          icon: Sparkles
        }
      ]
    },
    {
      id: 'COMPETENCIAS_DIDACTICO' as PrimariaGroup,
      label: 'Competencias Didáctico',
      subtitle: 'Banco Curricular de Competencias de 1° a 6° Grado',
      icon: Layers,
      badgeColor: 'bg-teal-400 text-slate-900',
      subTabs: [
        {
          id: 'COMPETENCIAS',
          label: 'Competencias',
          shortDesc: 'Banco de competencias curriculares de Educación Primaria.',
          icon: Layers
        }
      ]
    }
  ];

  const currentGroupConfig = groupsConfig.find(g => g.id === activeGroupTab) || groupsConfig[0];

  const handleGroupSelect = (groupId: PrimariaGroup) => {
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
      
      {/* Header Institucional de Educación Primaria */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2C2E53] to-[#1E2038] text-[#D4AF37] flex items-center justify-center font-black shadow-md shrink-0 border border-[#D4AF37]/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 dark:bg-teal-950/50 dark:text-teal-300">
                Subsistema de Educación Primaria
              </span>
              {currentRole === 'ADMINISTRADOR' && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 dark:bg-purple-950/50 dark:text-purple-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Modo Administrador</span>
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#2C2E53] dark:text-white mt-0.5">
              Educación Primaria (1er a 6to Grado)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              U.E.P. Colegio Bellas Artes • Secciones Oficiales "A" y "B" • Escala Cualitativa Exclusiva (L, A, P, I)
            </p>
          </div>
        </div>

        {/* Conmutador de las 6 Funciones de Primaria */}
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
            (subTab.id === 'PROCESAL' && activeSubTab === 'SEGUIMIENTO_INDICADORES') ||
            (subTab.id === 'AREAS_FORMACION' && activeSubTab === 'AREAS_PERFILES') ||
            (subTab.id === 'DISENADOR_DIDACTICO' && activeSubTab === 'DISENADOR_OFICIAL') ||
            (subTab.id === 'COMPETENCIAS' && activeSubTab === 'BANCO_COMPETENCIAS') ||
            (subTab.id === 'BOLETIN_INFORMATIVO' && activeSubTab === 'BOLETIN');
          const SubIcon = subTab.icon;

          return (
            <button
              key={subTab.id}
              onClick={() => setActiveSubTab(subTab.id)}
              className={`flex-1 min-w-[200px] text-left p-2.5 sm:p-3 rounded-xl transition-all border ${
                isSubActive
                  ? 'bg-teal-500/10 border-teal-500/80 shadow-xs text-[#2C2E53] dark:text-teal-300'
                  : 'border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg shrink-0 ${
                  isSubActive ? 'bg-teal-500 text-slate-950 font-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
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
        {/* FUNCIÓN 1: INDICADORES */}
        {activeGroupTab === 'INDICADORES' && (
          <>
            {activeSubTab === 'CURADURIA_INDICADORES' && <CuraduriaPrimariaView />}
            {(activeSubTab === 'PROCESAL' || activeSubTab === 'SEGUIMIENTO_INDICADORES') && (
              <SeguimientoIndicadoresPrimariaView onNavigateToAI={onNavigateToAI} />
            )}
            {activeSubTab === 'REVISION_CARGA' && (
              <RevisionCargaPrimariaView
                onGoToSeguimiento={() => setActiveSubTab('PROCESAL')}
              />
            )}
            {activeSubTab === 'INDICADORES_ACTITUDINALES' && <IndicadoresActitudinalesPrimariaView />}
            {activeSubTab === 'INDICADORES_LECTOESCRITURA' && <CargaLectoescrituraPrimariaView />}
            {activeSubTab === 'PROGRESO_INDICADORES' && <ProgresoIndicadoresPrimariaView />}
            {activeSubTab === 'BANCO_INDICADORES' && <IndicatorsBank />}
          </>
        )}

        {/* FUNCIÓN 2: CALIFICACIONES */}
        {activeGroupTab === 'CALIFICACIONES' && (
          <>
            {activeSubTab === 'CALIFICACIONES_ESTUDIANTE' && <CalificacionesEstudiantePrimariaView />}
            {activeSubTab === 'CALIFICACIONES_CURSO' && <CalificacionesCursoPrimariaView />}
          </>
        )}

        {/* FUNCIÓN 3: BOLETÍN */}
        {activeGroupTab === 'BOLETIN' && (
          <>
            {(activeSubTab === 'BOLETIN_INFORMATIVO' || activeSubTab === 'BOLETIN') && (
              <BoletinInformativoView />
            )}
            {activeSubTab === 'OBSERVACIONES_BOLETIN' && <ObservacionesBoletinPrimariaView />}
          </>
        )}

        {/* FUNCIÓN 4: ÁREAS DE FORMACIÓN */}
        {activeGroupTab === 'AREAS_FORMACION' && (
          <AreasProfilesView />
        )}

        {/* FUNCIÓN 5: DISEÑADOR DIDÁCTICO */}
        {activeGroupTab === 'DISENADOR_DIDACTICO' && (
          <DisenadorPlanificacionView />
        )}

        {/* FUNCIÓN 6: COMPETENCIAS DIDÁCTICO */}
        {activeGroupTab === 'COMPETENCIAS_DIDACTICO' && (
          <CompetenciesBank />
        )}
      </div>

    </div>
  );
};
