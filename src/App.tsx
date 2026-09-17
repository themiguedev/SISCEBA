import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { ModernHeader } from './components/layout/ModernHeader';
import { ModernSidebar } from './components/layout/ModernSidebar';
import { AcademicPulseHero } from './components/layout/AcademicPulseHero';
import { CommandSearchModal } from './components/layout/CommandSearchModal';
import { PlanningModule } from './components/planning/PlanningModule';
import { EvaluationModule } from './components/evaluation/EvaluationModule';
import { CommunicationModule } from './components/communication/CommunicationModule';
import {
  Sparkles,
  ShieldCheck,
  Building,
  GraduationCap,
  Layers,
  ClipboardList,
  MessageSquare,
  Bot,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

const SiscebaMainApp: React.FC = () => {
  const [designMode, setDesignMode] = useState<'VANGUARDISTA' | 'CLASICO'>(() => {
    return (localStorage.getItem('sice_cba_design_mode') as 'VANGUARDISTA' | 'CLASICO') || 'VANGUARDISTA';
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'PLANIFICACION' | 'EVALUACION' | 'COMUNICACION'>('PLANIFICACION');
  const [planningSubTab, setPlanningSubTab] = useState<string>('AREAS_PERFILES');
  const [evaluationSubTab, setEvaluationSubTab] = useState<string>('PROCESAL');
  const [communicationSubTab, setCommunicationSubTab] = useState<string>('BOLETIN');

  const { currentLevel, currentRole } = useApp();

  const handleSetDesignMode = (mode: 'VANGUARDISTA' | 'CLASICO') => {
    setDesignMode(mode);
    localStorage.setItem('sice_cba_design_mode', mode);
  };

  const handleNavigateToAI = () => {
    setActiveTab('COMUNICACION');
    setCommunicationSubTab('IA_ACTION_PLANS');
  };

  const handleQuickAction = (tab: 'PLANIFICACION' | 'EVALUACION' | 'COMUNICACION', subTab: string) => {
    setActiveTab(tab);
    if (tab === 'PLANIFICACION') setPlanningSubTab(subTab);
    else if (tab === 'EVALUACION') setEvaluationSubTab(subTab);
    else setCommunicationSubTab(subTab);
  };

  const currentSubTab =
    activeTab === 'PLANIFICACION'
      ? planningSubTab
      : activeTab === 'EVALUACION'
      ? evaluationSubTab
      : communicationSubTab;

  const handleSetSubTab = (sub: string) => {
    if (activeTab === 'PLANIFICACION') setPlanningSubTab(sub);
    else if (activeTab === 'EVALUACION') setEvaluationSubTab(sub);
    else setCommunicationSubTab(sub);
  };

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ----------------------------------------------------
  // VANGUARDISTA 2026 DESIGN MODE
  // ----------------------------------------------------
  if (designMode === 'VANGUARDISTA') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 selection:bg-[#D4AF37] selection:text-slate-950">
        {/* Top Executive Command Bar */}
        <ModernHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          designMode={designMode}
          setDesignMode={handleSetDesignMode}
          onOpenSearch={() => setSearchModalOpen(true)}
        />

        {/* Global Spotlight Search Modal */}
        <CommandSearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          onNavigate={handleQuickAction}
        />

        <div className="flex flex-1 relative">
          {/* Executive Navigation Sidebar */}
          <ModernSidebar
            isOpen={sidebarOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeSubTab={currentSubTab}
            setActiveSubTab={handleSetSubTab}
            onCloseMobile={() => setSidebarOpen(false)}
          />

          {/* Main Content Workspace */}
          <div
            className={`flex-1 flex flex-col transition-all duration-300 w-full ${
              sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
            }`}
          >
            <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Academic Pulse Hero Banner */}
              <AcademicPulseHero onQuickAction={handleQuickAction} />

              {/* Module Content */}
              <div className="animate-in fade-in duration-300">
                {activeTab === 'PLANIFICACION' && (
                  <PlanningModule
                    activeSubTab={planningSubTab}
                    setActiveSubTab={setPlanningSubTab}
                  />
                )}

                {activeTab === 'EVALUACION' && (
                  <EvaluationModule
                    activeSubTab={evaluationSubTab}
                    setActiveSubTab={setEvaluationSubTab}
                    onNavigateToAI={handleNavigateToAI}
                  />
                )}

                {activeTab === 'COMUNICACION' && (
                  <CommunicationModule
                    activeSubTab={communicationSubTab}
                    setActiveSubTab={setCommunicationSubTab}
                  />
                )}
              </div>
            </main>

            {/* Modern Executive Footer */}
            <footer className="w-full bg-[#1B1C33] text-white border-t border-[#2C2E53] py-6 px-4 sm:px-6 lg:px-8 mt-auto no-print">
              <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 text-center md:text-left">
                  <div className="h-9 px-2 rounded-xl bg-white flex items-center justify-center border border-[#D4AF37]/60 shadow-md">
                    <img
                      src="/logo-cba.png"
                      alt="Colegio Bellas Artes"
                      className="h-6 w-auto object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-white text-sm">
                        SICE-CBA
                      </p>
                      <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                        Vanguardista 2026
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      U.E.P. Colegio Bellas Artes • Maracaibo, Venezuela • Septiembre 2026
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-300 font-medium">
                  <button
                    onClick={() => handleSetDesignMode('CLASICO')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2C2E53] hover:bg-[#353866] text-[#D4AF37] border border-[#D4AF37]/30 transition text-xs font-bold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Cambiar a Diseño Clásico (Backup)</span>
                  </button>
                  <span className="text-slate-600 hidden sm:inline">|</span>
                  <span className="text-slate-400 text-xs hidden sm:inline">v2.6.0-PROD</span>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // CLASICO ORIGINAL DESIGN MODE (BACKUP COMPATIBLE)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Design Switcher Top Bar for Classic Mode */}
      <div className="bg-[#1B1C33] text-white px-4 py-2 flex items-center justify-between border-b border-[#2C2E53] text-xs font-semibold no-print">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
          <span className="text-slate-300">Estás visualizando el:</span>
          <strong className="text-white">Diseño Clásico Original</strong>
        </div>
        <button
          onClick={() => handleSetDesignMode('VANGUARDISTA')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#b89327] text-slate-950 font-black shadow-md hover:opacity-95 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Activar Diseño Vanguardista 2026</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSubTab={currentSubTab}
        setActiveSubTab={handleSetSubTab}
      />

      {/* Role and Level Indicator Banner */}
      <section
        aria-label="Información de sesión y rol"
        className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8 no-print"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#2C2E53] flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
              Nivel Curricular:
            </span>
            <span className="bg-[#2C2E53]/10 text-[#2C2E53] px-2.5 py-0.5 rounded-full font-black">
              {currentLevel.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                Modo Operativo: <strong className="text-slate-800">{currentRole}</strong>
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Sustituto Oficial SEO 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'PLANIFICACION' && (
          <PlanningModule
            activeSubTab={planningSubTab}
            setActiveSubTab={setPlanningSubTab}
          />
        )}

        {activeTab === 'EVALUACION' && (
          <EvaluationModule
            activeSubTab={evaluationSubTab}
            setActiveSubTab={setEvaluationSubTab}
            onNavigateToAI={handleNavigateToAI}
          />
        )}

        {activeTab === 'COMUNICACION' && (
          <CommunicationModule
            activeSubTab={communicationSubTab}
            setActiveSubTab={setCommunicationSubTab}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="w-full bg-[#2C2E53] text-white border-t border-[#414474] py-6 px-4 sm:px-6 lg:px-8 mt-auto no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="h-9 px-2 rounded-lg bg-white flex items-center justify-center border border-[#D4AF37]/50 shadow-sm">
              <img
                src="/logo-cba.png"
                alt="Colegio Bellas Artes"
                className="h-6 w-auto object-contain"
              />
            </div>
            <div>
              <p className="font-extrabold text-white">
                SICE-CBA • Colegio Bellas Artes
              </p>
              <p className="text-slate-400">
                U.E.P. Colegio Bellas Artes • Maracaibo, Venezuela • Septiembre 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Arquitectura Educativa Inteligente
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Versión 2.6.0-PROD</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <SiscebaMainApp />
    </AppProvider>
  );
}

export default App;
