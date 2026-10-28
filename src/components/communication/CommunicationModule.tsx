import React from 'react';
import { useApp } from '../../context/AppContext';
import { BoletinInformativoView } from './BoletinInformativoView';
import { AIActionPlansView } from './AIActionPlansView';
import { ActasConsejoView } from './ActasConsejoView';
import { RemedialInterventionView } from './RemedialInterventionView';
import { InstitutionalReportsView } from './InstitutionalReportsView';
import {
  FileText,
  ClipboardList,
  Scale,
  BookOpen,
  FileCheck,
  Sparkles
} from 'lucide-react';

interface CommunicationModuleProps {
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
}

export const CommunicationModule: React.FC<CommunicationModuleProps> = ({
  activeSubTab,
  setActiveSubTab
}) => {
  const { currentLevel } = useApp();

  const subTabs = [
    { id: 'BOLETIN', label: 'Boletín Informativo', icon: FileText },
    ...(currentLevel === 'MEDIA_GENERAL'
      ? [{ id: 'IA_ACTION_PLANS', label: 'Planes de Acción Personalizados', icon: ClipboardList, isNew: false }]
      : []),
    { id: 'ACTAS_CONSEJO', label: 'Actas de Consejo & Ajustes', icon: Scale },
    ...(currentLevel === 'MEDIA_GENERAL'
      ? [{ id: 'REMEDIALES', label: 'Intervención & Remediales', icon: BookOpen }]
      : []),
    { id: 'REPORTES_INSTITUCIONALES', label: 'Reportes Familias y Cierre', icon: FileCheck }
  ];

  return (
    <div className="space-y-6">

      {/* Subtab Contents */}
      {activeSubTab === 'BOLETIN' && <BoletinInformativoView />}
      {activeSubTab === 'IA_ACTION_PLANS' && currentLevel === 'MEDIA_GENERAL' && <AIActionPlansView />}
      {activeSubTab === 'ACTAS_CONSEJO' && <ActasConsejoView />}
      {activeSubTab === 'REMEDIALES' && currentLevel === 'MEDIA_GENERAL' && <RemedialInterventionView />}
      {activeSubTab === 'REPORTES_INSTITUCIONALES' && <InstitutionalReportsView />}
    </div>
  );
};
