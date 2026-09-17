import React from 'react';
import { useApp } from '../../context/AppContext';
import { BoletinInformativoView } from './BoletinInformativoView';
import { AIActionPlansView } from './AIActionPlansView';
import { ActasConsejoView } from './ActasConsejoView';
import { RemedialInterventionView } from './RemedialInterventionView';
import { InstitutionalReportsView } from './InstitutionalReportsView';
import {
  FileText,
  Bot,
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
      ? [{ id: 'IA_ACTION_PLANS', label: 'Planes Acción IA', icon: Bot, isNew: true }]
      : []),
    { id: 'ACTAS_CONSEJO', label: 'Actas de Consejo & Ajustes', icon: Scale },
    ...(currentLevel === 'MEDIA_GENERAL'
      ? [{ id: 'REMEDIALES', label: 'Intervención & Remediales', icon: BookOpen }]
      : []),
    { id: 'REPORTES_INSTITUCIONALES', label: 'Reportes Familias y Cierre', icon: FileCheck }
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
              {tab.isNew && (
                <span className="text-[9px] bg-[#D4AF37] text-[#2C2E53] font-black px-1.5 py-0.2 rounded-full">
                  IA
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Subtab Contents */}
      {activeSubTab === 'BOLETIN' && <BoletinInformativoView />}
      {activeSubTab === 'IA_ACTION_PLANS' && currentLevel === 'MEDIA_GENERAL' && <AIActionPlansView />}
      {activeSubTab === 'ACTAS_CONSEJO' && <ActasConsejoView />}
      {activeSubTab === 'REMEDIALES' && currentLevel === 'MEDIA_GENERAL' && <RemedialInterventionView />}
      {activeSubTab === 'REPORTES_INSTITUCIONALES' && <InstitutionalReportsView />}
    </div>
  );
};
