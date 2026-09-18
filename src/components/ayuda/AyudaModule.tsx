import React, { useState } from 'react';
import { ManualDeUsoView } from './ManualDeUsoView';
import { MapaDelSitioView } from './MapaDelSitioView';
import { BookOpen, Compass, HelpCircle } from 'lucide-react';

interface AyudaModuleProps {
  activeSubTab?: 'MANUAL' | 'MAPA_SITIO';
  setActiveSubTab?: (subTab: 'MANUAL' | 'MAPA_SITIO') => void;
  onNavigate?: (tab: any, subTab?: string) => void;
}

export const AyudaModule: React.FC<AyudaModuleProps> = ({
  activeSubTab,
  setActiveSubTab,
  onNavigate
}) => {
  const [internalTab, setInternalTab] = useState<'MANUAL' | 'MAPA_SITIO'>('MANUAL');

  const currentTab = activeSubTab || internalTab;
  const setTab = (tab: 'MANUAL' | 'MAPA_SITIO') => {
    if (setActiveSubTab) {
      setActiveSubTab(tab);
    }
    setInternalTab(tab);
  };

  return (
    <div className="space-y-6">
      {/* Top Level Module Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#1B1C33] text-[#D4AF37] flex items-center justify-center font-black text-lg shadow-sm border border-[#2C2E53]">
            <HelpCircle className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#2C2E53]">
                Centro de Inducción, Ayuda y Directorio
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                Soporte CBA
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Guías operativas paso a paso, normativas institucionales y mapa general del sistema
            </p>
          </div>
        </div>

        {/* Subtabs Pill Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner shrink-0">
          <button
            onClick={() => setTab('MANUAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === 'MANUAL'
                ? 'bg-[#1F1E29] text-amber-300 shadow-sm border border-amber-400/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${currentTab === 'MANUAL' ? 'text-amber-400' : 'text-slate-400'}`} />
            Manual de Uso Interactivo
          </button>
          <button
            onClick={() => setTab('MAPA_SITIO')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === 'MAPA_SITIO'
                ? 'bg-[#1F1E29] text-amber-300 shadow-sm border border-amber-400/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${currentTab === 'MAPA_SITIO' ? 'text-amber-400' : 'text-slate-400'}`} />
            Directorio & Mapa del Sitio
          </button>
        </div>
      </div>

      {/* Render Subview */}
      {currentTab === 'MANUAL' && <ManualDeUsoView onNavigate={onNavigate} />}
      {currentTab === 'MAPA_SITIO' && <MapaDelSitioView onNavigate={onNavigate} />}
    </div>
  );
};
