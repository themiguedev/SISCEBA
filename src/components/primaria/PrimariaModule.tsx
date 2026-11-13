import React, { useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { hasSubTabAccess } from '../../utils/rbac';

// 1. Grupo Indicadores
import { IndicadoresPrimariaView } from './IndicadoresPrimariaView';
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
          id: 'BANCO_INDICADORES',
          label: 'Indicadores',
          shortDesc: 'Gestione los indicadores de las áreas a valorar por año escolar, lapso, grado y sección.',
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
          shortDesc: 'Revisión de la carga de los indicadores evaluados en cada grado y sección.',
          icon: FileSpreadsheet
        },
        {
          id: 'INDICADORES_ACTITUDINALES',
          label: 'Indicadores Actitudinales',
          shortDesc: 'Carga y revisión de los indicadores Actitudinales, hábitos y convivencia escolar.',
          icon: Heart
        },
        {
          id: 'PROCESAL',
          label: 'Seguimiento de Indicadores',
          shortDesc: 'Seguimiento de los indicadores de evaluación continua (Escala L, A, P, I).',
          icon: ClipboardList
        },
        {
          id: 'INDICADORES_LECTOESCRITURA',
          label: 'Indicadores de Lectoescritura',
          shortDesc: 'Carga de indicadores de Lectoescritura: fluidez, velocidad ppm y comprensión.',
          icon: BookOpen
        },
        {
          id: 'PROGRESO_INDICADORES',
          label: 'Progreso de Indicadores',
          shortDesc: 'Progreso de los indicadores, curvas cualitativas y alertas tempranas.',
          icon: TrendingUp
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
      label: 'Diseñador Didactico',
      subtitle: 'Plantilla Oficial de Planificación de Primaria',
      icon: Sparkles,
      badgeColor: 'bg-purple-400 text-slate-900',
      subTabs: [
        {
          id: 'DISENADOR_DIDACTICO',
          label: 'Diseñador Didactico',
          shortDesc: 'Diseñador didáctico con proyectos de aprendizaje (PA) y ejes integradores.',
          icon: Sparkles
        }
      ]
    },
    {
      id: 'COMPETENCIAS_DIDACTICO' as PrimariaGroup,
      label: 'Competencias Didactico',
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

  const filteredGroupsConfig = useMemo(() => {
    return groupsConfig
      .filter(g => hasSubTabAccess(currentRole, 'PRIMARIA', g.id))
      .map(g => ({
        ...g,
        subTabs: g.subTabs.filter(st => hasSubTabAccess(currentRole, 'PRIMARIA', st.id))
      }))
      .filter(g => g.subTabs.length > 0);
  }, [currentRole]);

  const currentGroupConfig = filteredGroupsConfig.find(g => g.id === activeGroupTab) || filteredGroupsConfig[0] || groupsConfig[0];
  const CurrentGroupIcon = currentGroupConfig.icon;

  const handleGroupSelect = (groupId: PrimariaGroup) => {
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
      
      {/* ========================================================================= */}
      {/* HEADER Y BARRA DE SUBMÓDULOS 1:1 CON EL DISEÑO DE REFERENCIA INSTITUCIONAL */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden transition-all">
        {/* Fila Superior: Nivel y Función Activa */}
        <div className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 flex items-center justify-center shrink-0 border-2 border-amber-300 dark:border-amber-600 shadow-2xs font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">
                Educación Primaria
              </h1>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border-2 border-slate-300 dark:border-slate-600">
                1er a 6to Grado
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
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border-2 border-amber-400 dark:border-amber-600 text-xs font-black shadow-xs">
              <CurrentGroupIcon className="w-4 h-4 text-amber-800 dark:text-amber-400" />
              <span>{currentGroupConfig.label}</span>
            </div>
          </div>
        </div>

        {/* Fila Inferior: Opciones del Submódulo activo con flex-wrap para visualización completa sin recortes */}
        <div className="bg-slate-100 dark:bg-slate-950 border-t-2 border-slate-200 dark:border-slate-800 px-3.5 py-2.5 flex flex-wrap items-center gap-2">
          {currentGroupConfig.subTabs.map(subTab => {
            const isSubActive =
              activeSubTab === subTab.id ||
              (subTab.id === 'BANCO_INDICADORES' && activeSubTab === 'INDICADORES') ||
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
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

      {/* Vistas Renderizadas a Ancho Completo */}
      <div>
        {/* FUNCIÓN 1: INDICADORES */}
        {activeGroupTab === 'INDICADORES' && (
          <>
            {(activeSubTab === 'BANCO_INDICADORES' || activeSubTab === 'INDICADORES' || !['CURADURIA_INDICADORES', 'PROCESAL', 'SEGUIMIENTO_INDICADORES', 'REVISION_CARGA', 'INDICADORES_ACTITUDINALES', 'INDICADORES_LECTOESCRITURA', 'PROGRESO_INDICADORES'].includes(activeSubTab)) && (
              <IndicadoresPrimariaView />
            )}
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
          </>
        )}

        {/* FUNCIÓN 2: CALIFICACIONES */}
        {activeGroupTab === 'CALIFICACIONES' && (
          <>
            {(activeSubTab === 'CALIFICACIONES_ESTUDIANTE' || activeSubTab === 'CALIFICACIONES' || activeSubTab !== 'CALIFICACIONES_CURSO') && <CalificacionesEstudiantePrimariaView />}
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
