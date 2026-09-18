import React from 'react';
import { MainNavigationTab, EducationalLevel } from '../../types';
import {
  ChevronRight,
  Home,
  Search,
  Calendar,
  Layers,
  Sparkles,
  Clock,
  ClipboardList,
  BookOpen,
  FileText,
  BarChart3,
  MessageSquare,
  Settings,
  Compass
} from 'lucide-react';

interface CompactWorkspaceHeaderProps {
  activeTab: MainNavigationTab;
  activeSubTab: string;
  onNavigate: (tab: MainNavigationTab, subTab?: string) => void;
  onOpenSearch: () => void;
  currentLevel: EducationalLevel;
  activeLapso: number;
}

export const CompactWorkspaceHeader: React.FC<CompactWorkspaceHeaderProps> = ({
  activeTab,
  activeSubTab,
  onNavigate,
  onOpenSearch,
  currentLevel,
  activeLapso
}) => {
  // Label mappings
  const moduleLabels: Record<MainNavigationTab, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
    ESCRITORIO: { label: 'Escritorio de Control', icon: Home },
    GESTION: { label: 'Gestión Escolar', icon: ClipboardList },
    INICIAL: { label: 'Educación Inicial', icon: BookOpen },
    PRIMARIA: { label: 'Educación Primaria', icon: Layers },
    MEDIA_GENERAL: { label: 'Media General', icon: Layers },
    CONSULTAS: { label: 'Consultas y Reportes', icon: BarChart3 },
    COMUNIDAD: { label: 'Comunidad CBA', icon: MessageSquare },
    CONFIGURACION: { label: 'Configuración del Plantel', icon: Settings },
    AYUDA: { label: 'Mapa del Sitio', icon: Compass }
  };

  const subTabLabels: Record<string, string> = {
    // Gestión
    INSCRIPCIONES: 'Inscripciones (Wizard)',
    PASES: 'Pases por Retraso',
    INASISTENCIAS: 'Inasistencias (Diarias / Lapso)',
    CONDUCTAS: 'Conductas y Faltas',
    DOCUMENTOS: 'Documentos Solicitados (SLA)',
    BLOQUEO: 'Bloqueo Administrativo',
    TITULOS: 'Títulos de Bachiller',
    MATRICULA: 'Matrícula y Prosecución',
    // Planificación
    AREAS_PERFILES: 'Áreas de Aprendizaje / Perfiles',
    BANCO_COMPETENCIAS: 'Banco de Competencias',
    BANCO_ESTRATEGIAS: 'Estrategias y Ponderaciones',
    PLAN_QUINCENAL: 'Planes Quincenales',
    PLAN_LAPSO: 'Planes de Lapso',
    // Evaluación
    DIAGNOSTICA: 'Evaluación Diagnóstica',
    PROCESAL: 'Evaluación Continua y Procesal',
    FINAL_LAPSO: 'Literales Finales de Lapso',
    ACTAS_CONSEJO: 'Actas de Consejo de Curso',
    // Comunicación
    BOLETIN: 'Boletín Informativo',
    IA_ACTION_PLANS: 'Planes de Acción Personalizados',
    REMEDIALES: 'Intervención y Remediales',
    REPORTES_INSTITUCIONALES: 'Reportes Institucionales',
    // Consultas
    RENDIMIENTO: 'Sábana de Calificaciones',
    ESTADISTICAS: 'Estadísticas Académicas',
    NOMINAS: 'Nómina y Expedientes',
    // Otros
    CARTELERA: 'Cartelera Digital',
    CIRCULARES: 'Circulares y Comunicados',
    CUMPLEANOS: 'Cumpleaños y Efemérides',
    PERIODOS: 'Períodos y Lapsos',
    ESTRUCTURA: 'Estructura de Secciones',
    DOCENTES: 'Asignación Docente',
    MANUAL: 'Manual de Uso Interactivo',
    MAPA_SITIO: 'Directorio General'
  };

  const currentModule = moduleLabels[activeTab] || { label: activeTab, icon: Home };
  const CurrentIcon = currentModule.icon;
  const currentSubLabel = subTabLabels[activeSubTab] || activeSubTab;

  return (
    <div className="bg-white/90 dark:bg-[var(--theme-card-dark)]/95 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-slate-200/90 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-3 mb-5 transition-all">
      {/* Left: Breadcrumbs navigation */}
      <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
        <button
          onClick={() => onNavigate('ESCRITORIO')}
          className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300 hover:text-[#2C2E53] dark:hover:text-[#F8FAFC] hover:underline transition"
          title="Ir al inicio"
        >
          <Home className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Inicio</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />

        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
          <CurrentIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
          <span>{currentModule.label}</span>
        </div>

        {currentSubLabel && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="font-extrabold text-[#2C2E53] dark:text-[#F8FAFC] bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-white/10">
              {currentSubLabel}
            </span>
          </>
        )}
      </nav>

      {/* Right: Operational Status & Shortcuts */}
      <div className="flex items-center gap-2">
        {/* Lapso Badge */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800/60">
          <Calendar className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          Lapso {activeLapso} • Activo
        </span>

        {/* Quick Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-bold transition border border-slate-200 dark:border-white/10"
          title="Búsqueda rápida en todo el sistema (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span className="hidden sm:inline">Buscar</span>
          <kbd className="hidden md:inline px-1 py-0.2 text-[9px] bg-white dark:bg-black/40 rounded border border-slate-300 dark:border-white/15 text-slate-500 dark:text-slate-300 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>
    </div>
  );
};
