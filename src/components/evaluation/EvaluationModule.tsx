import React from 'react';
import { useApp } from '../../context/AppContext';
import { DiagnosticView } from './DiagnosticView';
import { ProcesalGradebookView } from './ProcesalGradebookView';
import { FinalLapsoView } from './FinalLapsoView';
import { StatisticsChartsView } from './StatisticsChartsView';
import {
  BrainCircuit,
  ClipboardList,
  Award,
  BarChart3
} from 'lucide-react';

interface EvaluationModuleProps {
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
  onNavigateToAI?: () => void;
}

export const EvaluationModule: React.FC<EvaluationModuleProps> = ({
  activeSubTab,
  setActiveSubTab,
  onNavigateToAI
}) => {
  const { currentLevel } = useApp();

  const subTabs = [
    { id: 'DIAGNOSTICA', label: 'Evaluación Diagnóstica', icon: BrainCircuit },
    { id: 'PROCESAL', label: 'Evaluación Procesal (Cuaderno)', icon: ClipboardList },
    { id: 'FINAL_LAPSO', label: 'Final de Lapso', icon: Award },
    { id: 'ESTADISTICAS', label: 'Cuadros Estadísticos', icon: BarChart3 }
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
              onClick={() => setActiveSubTab(tab.id)}
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
      {activeSubTab === 'DIAGNOSTICA' && <DiagnosticView />}
      {activeSubTab === 'PROCESAL' && <ProcesalGradebookView onNavigateToAI={onNavigateToAI} />}
      {activeSubTab === 'FINAL_LAPSO' && <FinalLapsoView />}
      {activeSubTab === 'ESTADISTICAS' && <StatisticsChartsView />}
    </div>
  );
};
