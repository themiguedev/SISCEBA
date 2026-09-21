import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AreasProfilesView } from './AreasProfilesView';
import { CompetenciesBank } from './CompetenciesBank';
import { IndicatorsBank } from './IndicatorsBank';
import { StrategiesBank } from './StrategiesBank';
import { PlanQuincenalView } from './PlanQuincenalView';
import { PlanLapsoView } from './PlanLapsoView';
import { DisenadorPlanificacionView } from './DisenadorPlanificacionView';
import {
  BookOpen,
  Layers,
  Tag,
  Lightbulb,
  Calendar,
  CalendarDays,
  FileSpreadsheet
} from 'lucide-react';

interface PlanningModuleProps {
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
}

export const PlanningModule: React.FC<PlanningModuleProps> = ({
  activeSubTab,
  setActiveSubTab
}) => {
  const { currentLevel } = useApp();
  const [designerPlanId, setDesignerPlanId] = useState<string | undefined>();

  const subTabs = [
    { id: 'DISENADOR_OFICIAL', label: 'Diseñador Didáctico Oficial', icon: FileSpreadsheet },
    { id: 'PLAN_QUINCENAL', label: 'Planes Quincenales', icon: Calendar },
    { id: 'AREAS_PERFILES', label: 'Áreas y Perfiles', icon: BookOpen },
    { id: 'BANCO_COMPETENCIAS', label: 'Banco Competencias', icon: Layers },
    { id: 'BANCO_INDICADORES', label: 'Banco Indicadores', icon: Tag },
    { id: 'BANCO_ESTRATEGIAS', label: 'Banco Estrategias', icon: Lightbulb },
    ...(currentLevel === 'MEDIA_GENERAL' || currentLevel === 'INICIAL'
      ? [{ id: 'PLAN_LAPSO', label: 'Plan de Lapso', icon: CalendarDays }]
      : [])
  ];

  return (
    <div className="space-y-6">
      {/* Subtabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 border-b border-slate-200 dark:border-slate-800">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          const activeStyle =
            currentLevel === 'INICIAL'
              ? 'bg-[#241E15] text-amber-300 border border-amber-400/50 shadow-sm'
              : currentLevel === 'PRIMARIA'
              ? 'bg-[#142621] text-teal-300 border border-teal-400/50 shadow-sm'
              : 'bg-[#1A1D36] text-indigo-300 border border-indigo-400/50 shadow-sm';
          const iconColor =
            currentLevel === 'INICIAL'
              ? 'text-amber-400'
              : currentLevel === 'PRIMARIA'
              ? 'text-teal-400'
              : 'text-indigo-400';

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id !== 'DISENADOR_OFICIAL') {
                  setDesignerPlanId(undefined);
                }
                setActiveSubTab(tab.id);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? activeStyle
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? iconColor : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Subtab Contents */}
      {activeSubTab === 'DISENADOR_OFICIAL' && (
        <DisenadorPlanificacionView
          initialPlanId={designerPlanId}
          onBackToList={() => {
            setDesignerPlanId(undefined);
            setActiveSubTab('PLAN_QUINCENAL');
          }}
        />
      )}
      {activeSubTab === 'PLAN_QUINCENAL' && (
        <PlanQuincenalView
          onOpenInDesigner={(planIdToOpen) => {
            setDesignerPlanId(planIdToOpen);
            setActiveSubTab('DISENADOR_OFICIAL');
          }}
        />
      )}
      {activeSubTab === 'AREAS_PERFILES' && <AreasProfilesView />}
      {activeSubTab === 'BANCO_COMPETENCIAS' && <CompetenciesBank />}
      {activeSubTab === 'BANCO_INDICADORES' && <IndicatorsBank />}
      {activeSubTab === 'BANCO_ESTRATEGIAS' && <StrategiesBank />}
      {activeSubTab === 'PLAN_LAPSO' && (currentLevel === 'MEDIA_GENERAL' || currentLevel === 'INICIAL') && <PlanLapsoView />}
    </div>
  );
};
