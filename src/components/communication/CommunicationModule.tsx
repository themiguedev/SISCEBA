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
              {tab.isNew && (
                <span className="text-[9px] bg-indigo-500 text-white font-black px-1.5 py-0.2 rounded-full">
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
