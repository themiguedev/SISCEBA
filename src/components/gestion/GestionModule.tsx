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
import { TalleresCRPView } from './TalleresCRPView';
import { UsuariosGestionView } from './UsuariosGestionView';
import { TareasRecurrentesAdminView } from './TareasRecurrentesAdminView';
import {
  UserCheck,
  Clock,
  Calendar,
  ShieldAlert,
  FileText,
  Lock,
  GraduationCap,
  Users,
  ShieldX,
  Palette,
  ShieldCheck,
  ListChecks
} from 'lucide-react';
import { hasSubTabAccess, ROLE_METADATA } from '../../utils/rbac';
import { recordSectionAccess, sortSubTabsByFrequency } from '../../utils/accessTracker';
import { EducationalLevel } from '../../types';

interface GestionModuleProps {
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
  onNavigateToLevel?: (level: EducationalLevel, pillar: 'PLANIFICACION' | 'EVALUACION' | 'COMUNICACION', subTab?: string) => void;
}

export const GestionModule: React.FC<GestionModuleProps> = ({
  activeSubTab,
  setActiveSubTab,
  onNavigateToLevel
}) => {
  const { passes, documentRequests, adminBlocks, conducts, currentRole, users, currentUser } = useApp();
  const userId = currentUser?.id || currentUser?.username || currentRole;

  const pendingDocsCount = documentRequests.filter((d) => d.status === 'PENDIENTE').length;
  const blockedStudentsCount = adminBlocks.filter((b) => b.active).length;

  const subTabs = [
    {
      id: 'TAREAS_RECURRENTES',
      label: 'Tareas Recurrentes',
      sublabel: 'Supervisión UCE',
      icon: ListChecks,
      badge: 'Admin',
      badgeColor: 'bg-[#D4AF37]/20 text-[#D4AF37] font-black border border-[#D4AF37]/30'
    },
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
    },
    {
      id: 'TALLERES_CRP',
      label: 'Talleres CRP',
      sublabel: '2 Momentos',
      icon: Palette
    },
    {
      id: 'USUARIOS',
      label: 'Usuarios y Roles',
      sublabel: 'Clasificación',
      icon: ShieldCheck,
      badge: `${users.length}`,
      badgeColor: 'bg-[#D4AF37]/20 text-[#D4AF37] font-black border border-[#D4AF37]/40'
    }
  ];

  const allowedSubTabs = sortSubTabsByFrequency(
    userId,
    'GESTION',
    subTabs.filter((tab) => hasSubTabAccess(currentRole, 'GESTION', tab.id))
  );
  const isCurrentSubTabAllowed = hasSubTabAccess(currentRole, 'GESTION', activeSubTab);

  return (
    <div className="space-y-4">

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
            {activeSubTab === 'TAREAS_RECURRENTES' && (
              <TareasRecurrentesAdminView
                onNavigateToGestionSubtab={(sub) => setActiveSubTab(sub)}
                onNavigateToLevel={onNavigateToLevel}
              />
            )}
            {activeSubTab === 'INSCRIPCIONES' && <InscripcionesWizardView />}
            {activeSubTab === 'PASES' && <PasesRetrasoView />}
            {activeSubTab === 'INASISTENCIAS' && <InasistenciasGestionView />}
            {activeSubTab === 'CONDUCTAS' && <ConductasView />}
            {activeSubTab === 'DOCUMENTOS' && <DocumentosSolicitadosView />}
            {activeSubTab === 'BLOQUEO' && <BloqueoAdministrativoView />}
            {activeSubTab === 'TITULOS' && <TitulosBachillerView />}
            {activeSubTab === 'MATRICULA' && <MatriculaProsecucionView />}
            {activeSubTab === 'TALLERES_CRP' && <TalleresCRPView />}
            {activeSubTab === 'USUARIOS' && <UsuariosGestionView />}
          </>
        )}
      </div>
    </div>
  );
};
