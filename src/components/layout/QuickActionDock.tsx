import React, { useState } from 'react';
import { MainNavigationTab } from '../../types';
import {
  Zap,
  Clock,
  CalendarCheck,
  FileText,
  FileSpreadsheet,
  Search,
  Home,
  X,
  Plus
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

  const actions = [
    {
      label: 'Nuevo Pase de Retraso',
      icon: Clock,
      color: 'bg-amber-500 hover:bg-amber-600 text-white',
      onClick: () => {
        onNavigate('GESTION', 'PASES');
        setIsOpen(false);
      }
    },
    {
      label: 'Asistencia Diaria',
      icon: CalendarCheck,
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      onClick: () => {
        onNavigate('GESTION', 'INASISTENCIAS');
        setIsOpen(false);
      }
    },
    {
      label: 'Documentos Solicitados',
      icon: FileText,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      onClick: () => {
        onNavigate('GESTION', 'DOCUMENTOS');
        setIsOpen(false);
      }
    },
    {
      label: 'Sábana de Notas',
      icon: FileSpreadsheet,
      color: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      onClick: () => {
        onNavigate('CONSULTAS', 'RENDIMIENTO');
        setIsOpen(false);
      }
    },
    {
      label: 'Búsqueda Global (Ctrl+K)',
      icon: Search,
      color: 'bg-slate-800 hover:bg-slate-900 text-[#D4AF37]',
      onClick: () => {
        onOpenSearch();
        setIsOpen(false);
      }
    }
  ];

  return (
    <aside aria-label="Acciones rápidas flotantes" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 no-print">
      {/* Expanded Quick Action Items */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={act.onClick}
                className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white shadow-xl border border-slate-200 text-slate-800 hover:bg-slate-50 transition group"
              >
                <span className="text-xs font-bold text-slate-700 group-hover:text-[#2C2E53]">
                  {act.label}
                </span>
                <div className={`w-8 h-8 rounded-xl ${act.color} flex items-center justify-center shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-xs shadow-2xl transition-all duration-200 border ${
          isOpen
            ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500 scale-105'
            : 'bg-[#2C2E53] hover:bg-[#242646] text-[#D4AF37] border-[#D4AF37]/50 hover:border-[#D4AF37] shadow-[#2C2E53]/30'
        }`}
        title="Atajos de acción rápida institucional"
      >
        {isOpen ? (
          <>
            <X className="w-4 h-4" />
            <span>Cerrar</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 fill-[#D4AF37]" />
            <span className="hidden sm:inline">Acciones Rápidas</span>
          </>
        )}
      </button>
    </aside>
  );
};
