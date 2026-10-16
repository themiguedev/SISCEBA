import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { MainNavigationTab } from '../../types';
import { hasTabAccess, hasSubTabAccess } from '../../utils/rbac';
import {
  Zap,
  Clock,
  CalendarCheck,
  FileText,
  FileSpreadsheet,
  Search,
  X
} from 'lucide-react';

interface QuickActionDockProps {
  onNavigate: (tab: MainNavigationTab, subTab?: string) => void;
  onOpenSearch: () => void;
}

export const QuickActionDock: React.FC<QuickActionDockProps> = ({
  onNavigate,
  onOpenSearch
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentRole } = useApp();
  const { isDark } = useTheme();

  // Cerrar al pulsar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Hide quick action dock completely for students and parents
  if (currentRole === 'REPRESENTANTE' || currentRole === 'ESTUDIANTE') {
    return null;
  }

  const allActions: Array<{
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    tag: string;
    tagColor: string;
    borderColor: string;
    tab?: MainNavigationTab;
    subTab?: string;
    onClick: () => void;
  }> = [
    {
      label: 'Nuevo Pase de Retraso',
      description: 'Portería y justificación de ingreso',
      icon: Clock,
      tag: 'Portería',
      tagColor: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40',
      color: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/25',
      borderColor: 'hover:border-amber-500 dark:hover:border-amber-400',
      tab: 'GESTION',
      subTab: 'PASES',
      onClick: () => {
        onNavigate('GESTION', 'PASES');
        setIsOpen(false);
      }
    },
    {
      label: 'Asistencia Diaria',
      description: 'Control de faltas e inasistencias',
      icon: CalendarCheck,
      tag: 'Asistencia',
      tagColor: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40',
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25',
      borderColor: 'hover:border-emerald-500 dark:hover:border-emerald-400',
      tab: 'GESTION',
      subTab: 'INASISTENCIAS',
      onClick: () => {
        onNavigate('GESTION', 'INASISTENCIAS');
        setIsOpen(false);
      }
    },
    {
      label: 'Documentos Solicitados',
      description: 'Constancias, notas y tiempos SLA',
      icon: FileText,
      tag: 'Trámites',
      tagColor: 'bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/40',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25',
      borderColor: 'hover:border-blue-500 dark:hover:border-blue-400',
      tab: 'GESTION',
      subTab: 'DOCUMENTOS',
      onClick: () => {
        onNavigate('GESTION', 'DOCUMENTOS');
        setIsOpen(false);
      }
    },
    {
      label: 'Sábana de Notas',
      description: 'Rendimiento y actas de evaluación',
      icon: FileSpreadsheet,
      tag: 'Notas',
      tagColor: 'bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-500/40',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25',
      borderColor: 'hover:border-indigo-500 dark:hover:border-indigo-400',
      tab: 'CONSULTAS',
      subTab: 'RENDIMIENTO',
      onClick: () => {
        onNavigate('CONSULTAS', 'RENDIMIENTO');
        setIsOpen(false);
      }
    },
    {
      label: 'Búsqueda Global',
      description: 'Comandos y expedientes rápidos',
      icon: Search,
      tag: 'Ctrl + K',
      tagColor: 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-[#F5C842] border border-slate-300 dark:border-slate-700 font-mono font-bold',
      color: 'bg-gradient-to-br from-[#2C2E53] to-[#1B1C33] text-[#D4AF37] border border-[#D4AF37]/60 shadow-md shadow-[#2C2E53]/40',
      borderColor: 'hover:border-[#D4AF37] dark:hover:border-[#D4AF37]',
      onClick: () => {
        onOpenSearch();
        setIsOpen(false);
      }
    }
  ];

  const actions = allActions.filter((act) => {
    if (act.tab && act.subTab) {
      return hasTabAccess(currentRole, act.tab) && hasSubTabAccess(currentRole, act.tab, act.subTab);
    }
    return true;
  });

  return (
    <>
      {/* Telón de fondo suave para enfocar las acciones y permitir cerrar con un clic afuera */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Acciones rápidas flotantes"
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-2.5 no-print"
      >
        {/* Expanded Quick Action Items */}
        {isOpen && (
          <div className="flex flex-col items-end gap-2 mb-1 animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Header chip indicativo */}
            <div className="px-3.5 py-1.5 rounded-full bg-[#1B1C33] border border-[#D4AF37]/50 text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-between gap-3 shadow-2xl mb-0.5">
              <span className="flex items-center gap-1.5 text-[#D4AF37]">
                <Zap className="w-3.5 h-3.5 fill-[#D4AF37]" />
                Acciones Rápidas
              </span>
              <span className="text-[10px] text-slate-300 font-normal normal-case">
                ESC para cerrar
              </span>
            </div>

            {actions.map((act, idx) => {
              const Icon = act.icon;
              return (
                <button
                  key={idx}
                  onClick={act.onClick}
                  style={{
                    backgroundColor: isDark ? '#16192B' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#0F172A'
                  }}
                  className={`w-72 sm:w-80 flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl shadow-2xl border-2 border-slate-300 dark:border-[#383C66] ${act.borderColor} hover:shadow-2xl hover:-translate-x-1.5 active:scale-[0.98] transition-all duration-150 group cursor-pointer text-left`}
                >
                  <div className="flex flex-col min-w-0 pr-1">
                    <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-[#2C2E53] dark:group-hover:text-[#F5C842] transition-colors truncate leading-tight">
                      {act.label}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 truncate mt-0.5">
                      {act.description}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${act.tagColor}`}>
                      {act.tag}
                    </span>
                    <div className={`w-9 h-9 rounded-xl ${act.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`min-h-[48px] flex items-center justify-center gap-2.5 px-4.5 py-3 rounded-2xl font-black text-xs shadow-2xl transition-all duration-200 border-2 cursor-pointer active:scale-95 ${
            isOpen
              ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-400 scale-105 shadow-rose-600/40 ring-4 ring-rose-500/20'
              : 'bg-[#2C2E53] hover:bg-[#242646] text-[#D4AF37] border-[#D4AF37] hover:border-[#F5C842] shadow-[#2C2E53]/60 ring-4 ring-[#D4AF37]/20'
          }`}
          title="Atajos de acción rápida institucional"
          aria-label="Acciones rápidas"
        >
          {isOpen ? (
            <>
              <X className="w-4 h-4 stroke-[2.5]" />
              <span className="tracking-wide">Cerrar</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="hidden sm:inline tracking-wide font-extrabold">Acciones Rápidas</span>
            </>
          )}
        </button>
      </aside>
    </>
  );
};
