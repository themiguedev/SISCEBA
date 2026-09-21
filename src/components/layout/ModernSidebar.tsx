import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MainNavigationTab } from '../../types';
import {
  Monitor,
  ClipboardList,
  BookOpen,
  Layers,
  GraduationCap,
  BarChart3,
  MessageSquare,
  Settings,
  Compass,
  Clock,
  Lock,
  ShieldAlert,
  Users,
  Award,
  FileSpreadsheet,
  FileText,
  UserCheck,
  ChevronRight,
  HelpCircle,
  X,
  Cake,
  Megaphone,
  Sliders,
  Sparkles,
  Palette
} from 'lucide-react';
import { SeasonalAccessoryIcon } from '../auth/LogoSeasonalAccessory';

interface ModernSidebarProps {
  isOpen: boolean;
  activeTab: MainNavigationTab;
  setActiveTab: (tab: MainNavigationTab) => void;
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
  onCloseMobile: () => void;
  onGoHome?: () => void;
}

interface SidebarSubTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarSection {
  id: MainNavigationTab;
  categoryGroup: 'PRINCIPAL' | 'NIVELES' | 'INSTITUCIONAL';
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge: string;
  activeBadgeBg?: string;
  activeSubTabStyle?: string;
  subTabActiveIcon?: string;
  subTabs: SidebarSubTab[];
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  isOpen,
  activeTab,
  setActiveTab,
  activeSubTab,
  setActiveSubTab,
  onCloseMobile,
  onGoHome
}) => {
  const { currentLevel, passes, documentRequests } = useApp();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    [activeTab]: true
  });

  // Keep active section expanded when activeTab changes externally
  useEffect(() => {
    setExpandedSections((prev) => ({
      ...prev,
      [activeTab]: true
    }));
  }, [activeTab]);

  const toggleSection = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleSectionClick = (section: SidebarSection) => {
    setActiveTab(section.id);
    if (!expandedSections[section.id]) {
      setExpandedSections((prev) => ({
        ...prev,
        [section.id]: true
      }));
    }
    if (section.id === 'ESCRITORIO' && typeof window !== 'undefined' && window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

  const pendingDocsCount = documentRequests.filter((d) => d.status === 'PENDIENTE').length;

  const navigationSections: SidebarSection[] = [
    // --- GRUPO PRINCIPAL ---
    {
      id: 'ESCRITORIO',
      categoryGroup: 'PRINCIPAL',
      label: 'Escritorio de Control',
      shortLabel: 'Escritorio',
      icon: Monitor,
      color: 'text-sky-400',
      badge: 'Dashboard',
      activeBadgeBg: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
      activeSubTabStyle: 'bg-sky-500/15 text-sky-200 border-l-2 border-sky-400 font-bold shadow-sm',
      subTabActiveIcon: 'text-sky-300',
      subTabs: [
        { id: 'DASHBOARD', label: 'Tablero Principal', icon: Monitor },
        { id: 'PERFIL', label: 'Mi Perfil de Usuario', icon: UserCheck },
        { id: 'SUGERENCIAS', label: 'Ideas y Sugerencias', icon: Sparkles }
      ]
    },
    {
      id: 'GESTION',
      categoryGroup: 'PRINCIPAL',
      label: 'Gestión Escolar',
      shortLabel: 'Gestión',
      icon: ClipboardList,
      color: 'text-emerald-400',
      badge: `${passes.length} Pases`,
      activeBadgeBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      activeSubTabStyle: 'bg-emerald-500/15 text-emerald-200 border-l-2 border-emerald-400 font-bold shadow-sm',
      subTabActiveIcon: 'text-emerald-300',
      subTabs: [
        { id: 'INSCRIPCIONES', label: 'Inscripciones', icon: UserCheck },
        { id: 'PASES', label: 'Pases por Retraso', icon: Clock },
        { id: 'INASISTENCIAS', label: 'Inasistencias (Diarias / Lapso)', icon: Users },
        { id: 'CONDUCTAS', label: 'Conductas y Faltas', icon: ShieldAlert },
        { id: 'DOCUMENTOS', label: `Documentos Solicitados (${pendingDocsCount})`, icon: FileText },
        { id: 'BLOQUEO', label: 'Bloqueo Administrativo', icon: Lock },
        { id: 'TITULOS', label: 'Títulos de Bachiller', icon: GraduationCap },
        { id: 'MATRICULA', label: 'Matrícula y Prosecución', icon: Layers }
      ]
    },

    // --- GRUPO NIVELES PEDAGÓGICOS ---
    {
      id: 'INICIAL',
      categoryGroup: 'NIVELES',
      label: 'Educación Inicial',
      shortLabel: 'Inicial',
      icon: BookOpen,
      color: 'text-amber-300',
      badge: 'Cualitativa',
      activeBadgeBg: 'bg-amber-500/20 text-amber-200 border border-amber-500/30',
      activeSubTabStyle: 'bg-amber-500/15 text-amber-100 border-l-2 border-amber-400 font-bold shadow-sm',
      subTabActiveIcon: 'text-amber-300',
      subTabs: [
        { id: 'AREAS_PERFILES', label: 'Áreas de Desarrollo', icon: Layers },
        { id: 'BANCO_COMPETENCIAS', label: 'Banco de Dimensiones', icon: Award },
        { id: 'PLAN_QUINCENAL', label: 'Planes Quincenales', icon: ClipboardList },
        { id: 'PLAN_LAPSO', label: 'Planes de Lapso', icon: FileText },
        { id: 'DIAGNOSTICA', label: 'Evaluación Diagnóstica (Robótica)', icon: UserCheck },
        { id: 'PROCESAL', label: 'Valoración Cualitativa', icon: FileSpreadsheet },
        { id: 'BOLETIN', label: 'Observaciones al Boletín', icon: GraduationCap }
      ]
    },
    {
      id: 'PRIMARIA',
      categoryGroup: 'NIVELES',
      label: 'Educación Primaria',
      shortLabel: 'Primaria',
      icon: Layers,
      color: 'text-teal-400',
      badge: 'Literal A-E',
      activeBadgeBg: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
      activeSubTabStyle: 'bg-teal-500/15 text-teal-200 border-l-2 border-teal-400 font-bold shadow-sm',
      subTabActiveIcon: 'text-teal-300',
      subTabs: [
        { id: 'AREAS_PERFILES', label: 'Áreas de Formación', icon: Layers },
        { id: 'DISENADOR_OFICIAL', label: 'Diseñador Didáctico Oficial', icon: Sparkles },
        { id: 'BANCO_COMPETENCIAS', label: 'Competencias e Indicadores', icon: Award },
        { id: 'BANCO_ESTRATEGIAS', label: 'Banco de Estrategias', icon: FileSpreadsheet },
        { id: 'PLAN_QUINCENAL', label: 'Plan Quincenal', icon: ClipboardList },
        { id: 'PROCESAL', label: 'Seguimiento de Indicadores', icon: FileSpreadsheet },
        { id: 'FINAL_LAPSO', label: 'Literales Finales Lapso', icon: Award },
        { id: 'BOLETIN', label: 'Boletín Informativo', icon: GraduationCap }
      ]
    },
    {
      id: 'MEDIA_GENERAL',
      categoryGroup: 'NIVELES',
      label: 'Media General',
      shortLabel: 'Media General',
      icon: GraduationCap,
      color: 'text-indigo-400',
      badge: '01 - 20',
      activeBadgeBg: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
      activeSubTabStyle: 'bg-indigo-500/15 text-indigo-200 border-l-2 border-indigo-400 font-bold shadow-sm',
      subTabActiveIcon: 'text-indigo-300',
      subTabs: [
        { id: 'AREAS_PERFILES', label: 'Asignaturas (24 Materias)', icon: Layers },
        { id: 'DISENADOR_OFICIAL', label: 'Diseñador Didáctico Oficial', icon: Sparkles },
        { id: 'BANCO_ESTRATEGIAS', label: 'Estrategias y Ponderaciones', icon: FileSpreadsheet },
        { id: 'PLAN_QUINCENAL', label: 'Planes Quincenales', icon: ClipboardList },
        { id: 'PLAN_LAPSO', label: 'Planes de Lapso', icon: FileText },
        { id: 'PROCESAL', label: 'Calificaciones Numéricas', icon: FileSpreadsheet },
        { id: 'ACTAS_CONSEJO', label: 'Consejo de Curso y Actas', icon: Award },
        { id: 'IA_ACTION_PLANS', label: 'Planes de Acción Personalizados', icon: ClipboardList },
        { id: 'REMEDIALES', label: 'Intervención & Remediales', icon: BookOpen },
        { id: 'BOLETIN', label: 'Boletín Informativo', icon: GraduationCap }
      ]
    },

    // --- GRUPO INSTITUCIONAL & COMUNIDAD ---
    {
      id: 'CONSULTAS',
      categoryGroup: 'INSTITUCIONAL',
      label: 'Consultas y Reportes',
      shortLabel: 'Consultas',
      icon: BarChart3,
      color: 'text-cyan-400',
      badge: 'Sábana',
      activeBadgeBg: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
      activeSubTabStyle: 'bg-cyan-500/15 text-cyan-200 border-l-2 border-cyan-400 font-bold shadow-sm',
      subTabActiveIcon: 'text-cyan-300',
      subTabs: [
        { id: 'RENDIMIENTO', label: 'Sábana de Calificaciones', icon: FileSpreadsheet },
        { id: 'ESTADISTICAS', label: 'Estadísticas de Rendimiento', icon: BarChart3 },
        { id: 'NOMINAS', label: 'Nómina y Expedientes', icon: Users }
      ]
    },
    {
      id: 'COMUNIDAD',
      categoryGroup: 'INSTITUCIONAL',
      label: 'Comunidad CBA',
      shortLabel: 'Comunidad',
      icon: MessageSquare,
      color: 'text-pink-400',
      badge: 'Noticias',
      activeBadgeBg: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
      activeSubTabStyle: 'bg-pink-500/15 text-pink-200 border-l-2 border-pink-400 font-bold shadow-sm',
      subTabActiveIcon: 'text-pink-300',
      subTabs: [
        { id: 'NOTICIAS', label: 'Noticias y Cartelera', icon: Megaphone },
        { id: 'CUMPLEANOS', label: 'Cumpleañeros de la Semana', icon: Cake },
        { id: 'COMUNICADOS', label: 'Mensajería y Comunicados', icon: MessageSquare }
      ]
    },
    {
      id: 'CONFIGURACION',
      categoryGroup: 'INSTITUCIONAL',
      label: 'Configuración del Plantel',
      shortLabel: 'Configuración',
      icon: Settings,
      color: 'text-violet-400',
      badge: 'Control',
      activeBadgeBg: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
      activeSubTabStyle: 'bg-violet-500/15 text-violet-200 border-l-2 border-violet-400 font-bold shadow-sm',
      subTabActiveIcon: 'text-violet-300',
      subTabs: [
        { id: 'LAPSOS', label: 'Años Escolares y Apertura Lapsos', icon: Clock },
        { id: 'ESTRUCTURA', label: 'Estructura de Cursos y Aulas', icon: Layers },
        { id: 'DOCENTES', label: 'Carga Horaria y Docentes Guías', icon: UserCheck },
        { id: 'TEMAS', label: 'Apariencia y Temas', icon: Palette }
      ]
    },
    {
      id: 'AYUDA',
      categoryGroup: 'INSTITUCIONAL',
      label: 'Ayuda y Manual de Uso',
      shortLabel: 'Ayuda & Manual',
      icon: HelpCircle,
      color: 'text-amber-300',
      badge: 'Guía',
      activeBadgeBg: 'bg-amber-500/20 text-amber-200 border border-amber-500/30',
      activeSubTabStyle: 'bg-amber-500/15 text-amber-100 border-l-2 border-amber-400 font-bold shadow-sm',
      subTabActiveIcon: 'text-amber-300',
      subTabs: [
        { id: 'MANUAL', label: 'Manual de Uso Interactivo', icon: BookOpen },
        { id: 'MAPA_SITIO', label: 'Mapa General del Sistema', icon: Compass }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 bottom-0 bg-[#1B1C33] border-r border-[#2C2E53] text-slate-300 transition-all duration-300 flex flex-col no-print ${
          isOpen
            ? 'top-0 z-50 w-72 translate-x-0 shadow-2xl lg:top-16 lg:z-30 lg:w-64 lg:shadow-none'
            : 'top-0 z-50 w-72 -translate-x-full lg:translate-x-0 lg:top-16 lg:z-30 lg:w-20'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="lg:hidden p-4 border-b border-[#2C2E53] flex items-center justify-between bg-[#141525] shrink-0">
          <div className="flex items-center gap-3">
            {/* Logo Button - Only logo is clickable */}
            <button
              type="button"
              onClick={() => {
                onCloseMobile();
                onGoHome?.();
              }}
              className="relative flex items-center justify-center shrink-0 group focus:outline-none transition p-1 -ml-1 rounded-lg hover:bg-white/5 cursor-pointer"
              title="Ir al inicio"
            >
              <img
                src={`${import.meta.env.BASE_URL}logo-cba.png`}
                alt="Colegio Bellas Artes"
                className="h-7 w-auto object-contain brightness-0 invert drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform"
              />
              <SeasonalAccessoryIcon sizeClass="w-4 h-4" className="-top-1 -right-1" />
            </button>
            <div className="select-none cursor-default">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-wider text-white">
                  SICE-CBA
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  2026-2027
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2C2E53] transition"
            title="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-4">
          {navigationSections.map((section, index) => {
            const isSectionActive = activeTab === section.id;
            const isSectionExpanded = !!expandedSections[section.id];
            const SectionIcon = section.icon;

            const isFirstOfGroup =
              index === 0 ||
              navigationSections[index - 1].categoryGroup !== section.categoryGroup;

            return (
              <div key={section.id} className="space-y-1">
                {/* Group Separator Label */}
                {isOpen && isFirstOfGroup && (
                  <div className="pt-3 pb-1.5 px-2 flex items-center">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0"></span>
                      {section.categoryGroup === 'PRINCIPAL' && 'CONTROL & GESTIÓN'}
                      {section.categoryGroup === 'NIVELES' && 'NIVELES PEDAGÓGICOS'}
                      {section.categoryGroup === 'INSTITUCIONAL' && 'INSTITUCIONAL & SOPORTE'}
                    </span>
                  </div>
                )}

                {/* Section Main Tab Header Row */}
                <div
                  onClick={() => handleSectionClick(section)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 group cursor-pointer select-none ${
                    isSectionActive
                      ? 'bg-gradient-to-r from-[#2C2E53] to-[#252747] text-white shadow-lg border border-[#D4AF37]/40'
                      : 'hover:bg-white/[0.06] text-slate-400 hover:text-slate-200'
                  }`}
                  title={section.label}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSectionClick(section);
                    }
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 ${
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
                    <button
                      type="button"
                      onClick={(e) => toggleSection(section.id, e)}
                      className="p-1 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
                      title={
                        isSectionExpanded
                          ? `Colapsar ${section.shortLabel}`
                          : `Expandir ${section.shortLabel}`
                      }
                    >
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isSectionExpanded
                            ? 'rotate-90 text-[#D4AF37]'
                            : isSectionActive
                            ? 'text-[#D4AF37]'
                            : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Sub-items (expanded view) */}
                {isOpen && isSectionExpanded && (
                  <div className="pl-3 pr-1 pt-1 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {section.subTabs.map((sub) => {
                      const isSubActive =
                        activeTab === section.id && activeSubTab === sub.id;
                      const SubIcon = sub.icon;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            if (activeTab !== section.id) {
                              setActiveTab(section.id);
                            }
                            setActiveSubTab(sub.id);
                            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                              onCloseMobile();
                            }
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                            isSubActive
                              ? (section.activeSubTabStyle || 'bg-white/10 text-white font-bold shadow-sm')
                              : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <SubIcon
                              className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                                isSubActive
                                  ? (section.subTabActiveIcon || 'text-white')
                                  : 'text-slate-400 group-hover:text-slate-200'
                              }`}
                            />
                            <span className="truncate">{sub.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Institutional Bottom Badge */}
        <div className="p-3 border-t border-[#2C2E53] bg-[#141525] shrink-0 text-center">
          {isOpen ? (
            <div className="text-[10px] text-slate-400 font-medium">
              <span className="text-amber-300 font-extrabold block text-[11px]">SICE-CBA</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-white/5 mx-auto flex items-center justify-center text-[10px] font-black text-amber-300">
              CB
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
