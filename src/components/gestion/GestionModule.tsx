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
  Users,
  ShieldX
} from 'lucide-react';
import { hasSubTabAccess, ROLE_METADATA } from '../../utils/rbac';

interface GestionModuleProps {
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
}

export const GestionModule: React.FC<GestionModuleProps> = ({
  activeSubTab,
  setActiveSubTab
}) => {
  const { passes, documentRequests, adminBlocks, conducts, currentRole } = useApp();

  const pendingDocsCount = documentRequests.filter((d) => d.status === 'PENDIENTE').length;
  const blockedStudentsCount = adminBlocks.filter((b) => b.active).length;

  const subTabs = [
    {
      id: 'INSCRIPCIONES',
      label: 'Inscripciones',
      sublabel: 'En 3 Pasos',
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

  const allowedSubTabs = subTabs.filter((tab) => hasSubTabAccess(currentRole, 'GESTION', tab.id));
  const isCurrentSubTabAllowed = hasSubTabAccess(currentRole, 'GESTION', activeSubTab);

  return (
    <div className="space-y-4">
      {/* Ergonomic Subtabs Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {allowedSubTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 select-none ${
                isActive
                  ? 'bg-[#162721] text-emerald-300 shadow-md border border-emerald-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
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

      {/* Subtab Content Area with RBAC Guard */}
      <div className="animate-in fade-in duration-200">
        {!isCurrentSubTabAllowed ? (
          <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center max-w-lg mx-auto shadow-sm my-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <ShieldX className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Sección Restringida para su Rol
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Su rol actual de <strong>{ROLE_METADATA[currentRole]?.label || currentRole}</strong> no posee atribuciones para gestionar esta sub-área. Las funciones de control de matrícula, inscripciones y títulos están reservadas a Dirección y Control de Estudios (UCE).
              </p>
            </div>
            {allowedSubTabs.length > 0 && (
              <button
                onClick={() => setActiveSubTab(allowedSubTabs[0].id)}
                className="px-4 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs rounded-xl shadow-md transition"
              >
                Ir a {allowedSubTabs[0].label}
              </button>
            )}
          </div>
        ) : (
          <>
            {activeSubTab === 'INSCRIPCIONES' && <InscripcionesWizardView />}
            {activeSubTab === 'PASES' && <PasesRetrasoView />}
            {activeSubTab === 'INASISTENCIAS' && <InasistenciasGestionView />}
            {activeSubTab === 'CONDUCTAS' && <ConductasView />}
            {activeSubTab === 'DOCUMENTOS' && <DocumentosSolicitadosView />}
            {activeSubTab === 'BLOQUEO' && <BloqueoAdministrativoView />}
            {activeSubTab === 'TITULOS' && <TitulosBachillerView />}
            {activeSubTab === 'MATRICULA' && <MatriculaProsecucionView />}
          </>
        )}
      </div>
    </div>
  );
};
