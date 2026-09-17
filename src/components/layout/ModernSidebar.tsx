import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  ClipboardList,
  MessageSquare,
  Sparkles,
  Layers,
  Award,
  BarChart3,
  FileSpreadsheet,
  FileText,
  UserCheck,
  Bot,
  ChevronRight,
  GraduationCap,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

interface ModernSidebarProps {
  isOpen: boolean;
  activeTab: 'PLANIFICACION' | 'EVALUACION' | 'COMUNICACION';
  setActiveTab: (tab: 'PLANIFICACION' | 'EVALUACION' | 'COMUNICACION') => void;
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
  onCloseMobile: () => void;
}

interface SidebarSubTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isAi?: boolean;
}

interface SidebarSection {
  id: 'PLANIFICACION' | 'EVALUACION' | 'COMUNICACION';
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge: string;
  subTabs: SidebarSubTab[];
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  isOpen,
  activeTab,
  setActiveTab,
  activeSubTab,
  setActiveSubTab,
  onCloseMobile
}) => {
  const { currentLevel, currentRole, aiActionPlans } = useApp();

  const navigationSections: SidebarSection[] = [
    {
      id: 'PLANIFICACION' as const,
      label: 'Planificación Pedagógica',
      shortLabel: 'Planificación',
      icon: BookOpen,
      color: 'text-amber-400',
      badge: currentLevel === 'INICIAL' ? 'Áreas y Proyectos' : 'Curricular',
      subTabs: [
        { id: 'AREAS_PERFILES', label: 'Áreas y Perfiles', icon: Layers },
        { id: 'COMPETENCIAS', label: 'Banco de Competencias', icon: Award },
        { id: 'ESTRATEGIAS', label: 'Banco de Estrategias', icon: FileSpreadsheet },
        { id: 'PLAN_QUINCENAL', label: 'Planes Quincenales', icon: ClipboardList },
        { id: 'PLAN_LAPSO', label: 'Planes de Lapso', icon: FileText }
      ]
    },
    {
      id: 'EVALUACION' as const,
      label: 'Evaluación Continua',
      shortLabel: 'Evaluación',
      icon: ClipboardList,
      color: 'text-emerald-400',
      badge: currentLevel === 'MEDIA_GENERAL' ? '01-20' : 'Cualitativa',
      subTabs: [
        { id: 'DIAGNOSTICA', label: 'Evaluación Diagnóstica', icon: UserCheck },
        { id: 'PROCESAL', label: 'Evaluación Procesal', icon: FileSpreadsheet },
        { id: 'FINAL_LAPSO', label: 'Evaluación Final Lapso', icon: Award },
        { id: 'ESTADISTICAS', label: 'Cuadros Estadísticos', icon: BarChart3 }
      ]
    },
    {
      id: 'COMUNICACION' as const,
      label: 'Comunicación y Reportes',
      shortLabel: 'Comunicación',
      icon: MessageSquare,
      color: 'text-sky-400',
      badge: `${aiActionPlans.length} IA Activos`,
      subTabs: [
        { id: 'BOLETIN', label: 'Boletín Informativo', icon: GraduationCap },
        { id: 'ACTAS_CONSEJO', label: 'Actas de Consejo', icon: FileText },
        { id: 'IA_ACTION_PLANS', label: 'Planes de Acción con IA', icon: Bot, isAi: true },
        { id: 'REPORTES_INSTITUCIONALES', label: 'Reportes y Ajustes', icon: ShieldAlert }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-[57px] bottom-0 left-0 z-30 bg-[#1B1C33] border-r border-[#2C2E53] text-slate-300 transition-all duration-300 flex flex-col no-print ${
          isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navigationSections.map((section) => {
            const isSectionActive = activeTab === section.id;
            const SectionIcon = section.icon;

            return (
              <div key={section.id} className="space-y-1.5">
                {/* Section Main Tab Header Button */}
                <button
                  onClick={() => {
                    setActiveTab(section.id);
                    setActiveSubTab(section.subTabs[0].id);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 group ${
                    isSectionActive
                      ? 'bg-gradient-to-r from-[#2C2E53] to-[#252747] text-white shadow-lg border border-[#D4AF37]/40'
                      : 'hover:bg-[#2C2E53]/40 text-slate-400 hover:text-slate-200'
                  }`}
                  title={section.label}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isSectionActive
                          ? 'bg-[#D4AF37] text-slate-950 font-black shadow-md'
                          : 'bg-[#141525] text-slate-400 group-hover:text-white'
                      }`}
                    >
                      <SectionIcon className="w-4 h-4" />
                    </div>
                    {isOpen && (
                      <div className="text-left truncate">
                        <span className="text-xs font-black block tracking-tight truncate">
                          {section.shortLabel}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold block truncate">
                          {section.badge}
                        </span>
                      </div>
                    )}
                  </div>
                  {isOpen && (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isSectionActive ? 'rotate-90 text-[#D4AF37]' : 'text-slate-600'
                      }`}
                    />
                  )}
                </button>

                {/* Sub-items (expanded view) */}
                {isOpen && isSectionActive && (
                  <div className="pl-3 pr-1 pt-1 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {section.subTabs.map((sub) => {
                      const isSubActive = activeSubTab === sub.id;
                      const SubIcon = sub.icon;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setActiveSubTab(sub.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            isSubActive
                              ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-l-2 border-[#D4AF37] font-bold'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-[#2C2E53]/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-[#D4AF37]' : 'text-slate-500'}`} />
                            <span className="truncate">{sub.label}</span>
                          </div>
                          {sub.isAi && (
                            <span className="text-[9px] bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                              IA
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Status Card */}
        {isOpen ? (
          <div className="p-3 border-t border-[#2C2E53] bg-[#141525]/70 space-y-2">
            <div className="p-2.5 rounded-xl bg-[#2C2E53]/40 border border-[#414474]/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#D4AF37] block">
                  Copiloto Pedagógico
                </span>
                <span className="text-[11px] text-slate-300 font-medium block truncate">
                  Motor de IA activo
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>SICE-CBA v2.6</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                En Línea
              </span>
            </div>
          </div>
        ) : (
          <div className="p-2 border-t border-[#2C2E53] flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-[#2C2E53] flex items-center justify-center text-[#D4AF37]" title="Copiloto IA Activo">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
