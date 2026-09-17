import React from 'react';
import { useApp } from '../../context/AppContext';
import { InscripcionesWizardView } from './InscripcionesWizardView';
import { PasesRetrasoView } from './PasesRetrasoView';
import { InasistenciasGestionView } from './InasistenciasGestionView';
import { ConductasView } from './ConductasView';
import { DocumentosSolicitadosView } from './DocumentosSolicitadosView';
import { BloqueoAdministrativoView } from './BloqueoAdministrativoView';
import { TitulosBachillerView } from './TitulosBachillerView';
import { MatriculaProsecucionView } from './MatriculaProsecucionView';
import {
  UserCheck,
  Clock,
  Calendar,
  ShieldAlert,
  FileText,
  Lock,
  GraduationCap,
  Users
} from 'lucide-react';

interface GestionModuleProps {
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
}

export const GestionModule: React.FC<GestionModuleProps> = ({
  activeSubTab,
  setActiveSubTab
}) => {
  const { passes, documentRequests, adminBlocks, conducts } = useApp();

  const pendingDocsCount = documentRequests.filter((d) => d.status === 'PENDIENTE').length;
  const blockedStudentsCount = adminBlocks.filter((b) => b.active).length;

  const subTabs = [
    {
      id: 'INSCRIPCIONES',
      label: 'Inscripciones',
      sublabel: 'Wizard 3 Pasos',
      icon: UserCheck
    },
    {
      id: 'PASES',
      label: 'Pases por Retraso',
      sublabel: 'Portería',
      icon: Clock,
      badge: `${passes.length}`,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'INASISTENCIAS',
      label: 'Inasistencias',
      sublabel: 'Diarias / 25%',
      icon: Calendar
    },
    {
      id: 'CONDUCTAS',
      label: 'Conductas',
      sublabel: 'Incidencias',
      icon: ShieldAlert,
      badge: `${conducts.length}`,
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'DOCUMENTOS',
      label: 'Documentos',
      sublabel: 'SLA y Trámites',
      icon: FileText,
      badge: pendingDocsCount > 0 ? `${pendingDocsCount} pendientes` : 'Al día',
      badgeColor: pendingDocsCount > 0 ? 'bg-rose-100 text-rose-700 font-black animate-pulse' : 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'BLOQUEO',
      label: 'Bloqueo Admin',
      sublabel: 'Solvencias',
      icon: Lock,
      badge: blockedStudentsCount > 0 ? `${blockedStudentsCount}` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 font-bold'
    },
    {
      id: 'TITULOS',
      label: 'Títulos Bachiller',
      sublabel: '5to Año',
      icon: GraduationCap
    },
    {
      id: 'MATRICULA',
      label: 'Matrícula',
      sublabel: 'Prosecución',
      icon: Users
    }
  ];

  return (
    <div className="space-y-4">
      {/* Ergonomic Subtabs Bar */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200/90 shadow-sm flex items-center gap-1.5 overflow-x-auto">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 select-none ${
                isActive
                  ? 'bg-[#2C2E53] text-[#D4AF37] shadow-md border border-[#D4AF37]/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className={isActive ? 'text-white' : ''}>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${tab.badgeColor}`}>
                      {tab.badge}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Subtab Content Area with Smooth Entry */}
      <div className="animate-in fade-in duration-200">
        {activeSubTab === 'INSCRIPCIONES' && <InscripcionesWizardView />}
        {activeSubTab === 'PASES' && <PasesRetrasoView />}
        {activeSubTab === 'INASISTENCIAS' && <InasistenciasGestionView />}
        {activeSubTab === 'CONDUCTAS' && <ConductasView />}
        {activeSubTab === 'DOCUMENTOS' && <DocumentosSolicitadosView />}
        {activeSubTab === 'BLOQUEO' && <BloqueoAdministrativoView />}
        {activeSubTab === 'TITULOS' && <TitulosBachillerView />}
        {activeSubTab === 'MATRICULA' && <MatriculaProsecucionView />}
      </div>
    </div>
  );
};
