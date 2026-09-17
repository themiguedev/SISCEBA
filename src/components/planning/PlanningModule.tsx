import React from 'react';
import { useApp } from '../../context/AppContext';
import { AreasProfilesView } from './AreasProfilesView';
import { CompetenciesBank } from './CompetenciesBank';
import { IndicatorsBank } from './IndicatorsBank';
import { StrategiesBank } from './StrategiesBank';
import { PlanQuincenalView } from './PlanQuincenalView';
import { PlanLapsoView } from './PlanLapsoView';
import {
  BookOpen,
  Layers,
  Tag,
  Lightbulb,
  Calendar,
  CalendarDays
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

  const subTabs = [
    { id: 'AREAS_PERFILES', label: 'Áreas y Perfiles', icon: BookOpen },
    { id: 'BANCO_COMPETENCIAS', label: 'Banco Competencias', icon: Layers },
    { id: 'BANCO_INDICADORES', label: 'Banco Indicadores', icon: Tag },
    { id: 'BANCO_ESTRATEGIAS', label: 'Banco Estrategias', icon: Lightbulb },
    { id: 'PLAN_QUINCENAL', label: 'Plan Quincenal', icon: Calendar },
    ...(currentLevel === 'MEDIA_GENERAL' || currentLevel === 'INICIAL'
      ? [{ id: 'PLAN_LAPSO', label: 'Plan de Lapso', icon: CalendarDays }]
      : [])
  ];

  return (
    <div className="space-y-6">
      {/* Subtabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Subtab Contents */}
      {activeSubTab === 'AREAS_PERFILES' && <AreasProfilesView />}
      {activeSubTab === 'BANCO_COMPETENCIAS' && <CompetenciesBank />}
      {activeSubTab === 'BANCO_INDICADORES' && <IndicatorsBank />}
      {activeSubTab === 'BANCO_ESTRATEGIAS' && <StrategiesBank />}
      {activeSubTab === 'PLAN_QUINCENAL' && <PlanQuincenalView />}
      {activeSubTab === 'PLAN_LAPSO' && (currentLevel === 'MEDIA_GENERAL' || currentLevel === 'INICIAL') && <PlanLapsoView />}
    </div>
  );
};
