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

      {/* Subtab Contents */}
      {activeSubTab === 'DIAGNOSTICA' && <DiagnosticView />}
      {activeSubTab === 'PROCESAL' && <ProcesalGradebookView onNavigateToAI={onNavigateToAI} />}
      {activeSubTab === 'FINAL_LAPSO' && <FinalLapsoView />}
      {activeSubTab === 'ESTADISTICAS' && <StatisticsChartsView />}
    </div>
  );
};
