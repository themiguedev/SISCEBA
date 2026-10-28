import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AreasProfilesView } from './AreasProfilesView';
import { CompetenciesBank } from './CompetenciesBank';
import { IndicatorsBank } from './IndicatorsBank';
import { StrategiesBank } from './StrategiesBank';
import { EducationalResourcesBank } from './EducationalResourcesBank';
import { PlanQuincenalView } from './PlanQuincenalView';
import { PlanLapsoView } from './PlanLapsoView';
import { DisenadorPlanificacionView } from './DisenadorPlanificacionView';
import {
  BookOpen,
  Layers,
  Tag,
  Lightbulb,
  Boxes,
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
    { id: 'BANCO_RECURSOS', label: 'Banco de Recursos Didácticos', icon: Boxes },
    { id: 'BANCO_COMPETENCIAS', label: 'Banco Competencias', icon: Layers },
    { id: 'BANCO_INDICADORES', label: 'Banco Indicadores', icon: Tag },
    { id: 'BANCO_ESTRATEGIAS', label: 'Banco Estrategias', icon: Lightbulb },
    ...(currentLevel === 'MEDIA_GENERAL' || currentLevel === 'INICIAL'
      ? [{ id: 'PLAN_LAPSO', label: 'Plan de Lapso', icon: CalendarDays }]
      : [])
  ];

  return (
    <div className="space-y-6">

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
      {activeSubTab === 'BANCO_RECURSOS' && <EducationalResourcesBank />}
      {activeSubTab === 'BANCO_COMPETENCIAS' && <CompetenciesBank />}
      {activeSubTab === 'BANCO_INDICADORES' && <IndicatorsBank />}
      {activeSubTab === 'BANCO_ESTRATEGIAS' && <StrategiesBank />}
      {activeSubTab === 'PLAN_LAPSO' && (currentLevel === 'MEDIA_GENERAL' || currentLevel === 'INICIAL') && <PlanLapsoView />}
    </div>
  );
};
