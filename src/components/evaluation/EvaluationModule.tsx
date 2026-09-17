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
      {activeSubTab === 'DIAGNOSTICA' && <DiagnosticView />}
      {activeSubTab === 'PROCESAL' && <ProcesalGradebookView onNavigateToAI={onNavigateToAI} />}
      {activeSubTab === 'FINAL_LAPSO' && <FinalLapsoView />}
      {activeSubTab === 'ESTADISTICAS' && <StatisticsChartsView />}
    </div>
  );
};
