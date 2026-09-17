import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MainNavigationTab, EducationalLevel } from './types';
import { ModernHeader } from './components/layout/ModernHeader';
import { ModernSidebar } from './components/layout/ModernSidebar';
import { AcademicPulseHero } from './components/layout/AcademicPulseHero';
import { CompactWorkspaceHeader } from './components/layout/CompactWorkspaceHeader';
import { QuickActionDock } from './components/layout/QuickActionDock';
import { CommandSearchModal } from './components/layout/CommandSearchModal';
import { LoginView } from './components/auth/LoginView';

// Modules
import { EscritorioView } from './components/dashboard/EscritorioView';
import { GestionModule } from './components/gestion/GestionModule';
import { PlanningModule } from './components/planning/PlanningModule';
import { EvaluationModule } from './components/evaluation/EvaluationModule';
import { CommunicationModule } from './components/communication/CommunicationModule';
import { ConsultasModule } from './components/consultas/ConsultasModule';
import { ComunidadModule } from './components/comunidad/ComunidadModule';
import { ConfiguracionModule } from './components/configuracion/ConfiguracionModule';
import { MapaDelSitioView } from './components/ayuda/MapaDelSitioView';

import { BookOpen, ClipboardList, MessageSquare } from 'lucide-react';

const SiscebaMainApp: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Top-Level Active Module Tab
  const [activeTab, setActiveTab] = useState<MainNavigationTab>('ESCRITORIO');

  // Subtab States for each domain
  const [gestionSubTab, setGestionSubTab] = useState<string>('INSCRIPCIONES');
  const [planningSubTab, setPlanningSubTab] = useState<string>('AREAS_PERFILES');
  const [evaluationSubTab, setEvaluationSubTab] = useState<string>('PROCESAL');
  const [communicationSubTab, setCommunicationSubTab] = useState<string>('BOLETIN');
  const [levelPillarTab, setLevelPillarTab] = useState<'PLANIFICACION' | 'EVALUACION' | 'COMUNICACION'>('PLANIFICACION');

  const { currentLevel, setCurrentLevel, activeLapso, isAuthenticated } = useApp();

  // Keep activeTab in sync when user clicks the level buttons in the top header
  useEffect(() => {
    if (activeTab === 'INICIAL' || activeTab === 'PRIMARIA' || activeTab === 'MEDIA_GENERAL') {
      if (activeTab !== currentLevel) {
        setActiveTab(currentLevel);
      }
    }
  }, [currentLevel]);

  const handleTabChange = (tab: MainNavigationTab) => {
    setActiveTab(tab);
    if (tab === 'INICIAL' || tab === 'PRIMARIA' || tab === 'MEDIA_GENERAL') {
      setCurrentLevel(tab);
    }
  };

  const handleSubTabChange = (sub: string) => {
    if (activeTab === 'GESTION') {
      setGestionSubTab(sub);
    } else if (activeTab === 'INICIAL' || activeTab === 'PRIMARIA' || activeTab === 'MEDIA_GENERAL') {
      // Categorize which pedagogical pillar this subtab belongs to
      if (['DIAGNOSTICA', 'PROCESAL', 'FINAL_LAPSO', 'ESTADISTICAS'].includes(sub)) {
        setLevelPillarTab('EVALUACION');
        setEvaluationSubTab(sub);
      } else if (['BOLETIN', 'ACTAS_CONSEJO', 'IA_ACTION_PLANS', 'REMEDIALES', 'REPORTES_INSTITUCIONALES'].includes(sub)) {
        setLevelPillarTab('COMUNICACION');
        setCommunicationSubTab(sub);
      } else {
        setLevelPillarTab('PLANIFICACION');
        setPlanningSubTab(sub);
      }
    }
  };

  const currentSubTab =
    activeTab === 'GESTION'
      ? gestionSubTab
      : activeTab === 'INICIAL' || activeTab === 'PRIMARIA' || activeTab === 'MEDIA_GENERAL'
      ? levelPillarTab === 'PLANIFICACION'
        ? planningSubTab
        : levelPillarTab === 'EVALUACION'
        ? evaluationSubTab
        : communicationSubTab
      : '';

  const handleNavigateToAI = () => {
    handleTabChange('MEDIA_GENERAL');
    setLevelPillarTab('COMUNICACION');
    setCommunicationSubTab('IA_ACTION_PLANS');
  };

  const handleQuickAction = (tab: any, subTab?: string) => {
    if (tab === 'PLANIFICACION') {
      handleTabChange(currentLevel);
      setLevelPillarTab('PLANIFICACION');
      if (subTab) setPlanningSubTab(subTab);
    } else if (tab === 'EVALUACION') {
      handleTabChange(currentLevel);
      setLevelPillarTab('EVALUACION');
      if (subTab) setEvaluationSubTab(subTab);
    } else if (tab === 'COMUNICACION') {
      handleTabChange(currentLevel);
      setLevelPillarTab('COMUNICACION');
      if (subTab) setCommunicationSubTab(subTab);
    } else {
      handleTabChange(tab);
      if (subTab) handleSubTabChange(subTab);
    }
  };

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    localStorage.removeItem('sice_cba_design_mode');
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleGoHome = () => {
    setActiveTab('ESCRITORIO');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is not logged in, render the reference-inspired LoginView
  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 selection:bg-[#D4AF37] selection:text-slate-950">
      {/* Top Executive Command Bar */}
      <ModernHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onOpenSearch={() => setSearchModalOpen(true)}
        onGoHome={handleGoHome}
        onSelectLevel={(lvl) => handleTabChange(lvl)}
        activeTab={activeTab}
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
          setActiveTab={handleTabChange}
          activeSubTab={currentSubTab}
          setActiveSubTab={handleSubTabChange}
          onCloseMobile={() => setSidebarOpen(false)}
          onGoHome={handleGoHome}
        />

        {/* Main Content Workspace */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 w-full ${
            sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
          }`}
        >
          <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
            {/* Show Academic Pulse Hero ONLY on the Executive Desktop */}
            {activeTab === 'ESCRITORIO' && (
              <AcademicPulseHero onQuickAction={handleQuickAction} />
            )}

            {/* Compact Context Bar & Breadcrumbs for operational modules */}
            {activeTab !== 'ESCRITORIO' && (
              <CompactWorkspaceHeader
                activeTab={activeTab}
                activeSubTab={currentSubTab}
                onNavigate={handleQuickAction}
                onOpenSearch={() => setSearchModalOpen(true)}
                currentLevel={currentLevel}
                activeLapso={activeLapso}
              />
            )}

            {/* Module Content */}
            <div className="animate-in fade-in duration-300">
              {/* 1. ESCRITORIO */}
              {activeTab === 'ESCRITORIO' && <EscritorioView />}

              {/* 2. GESTIÓN ESCOLAR */}
              {activeTab === 'GESTION' && (
                <GestionModule
                  activeSubTab={gestionSubTab}
                  setActiveSubTab={setGestionSubTab}
                />
              )}

              {/* 3, 4, 5. NIVELES PEDAGÓGICOS (INICIAL, PRIMARIA, MEDIA GENERAL) */}
              {(activeTab === 'INICIAL' || activeTab === 'PRIMARIA' || activeTab === 'MEDIA_GENERAL') && (
                <div className="space-y-6">
                  {/* Pedagogical Pillar Switcher */}
                  <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto">
                    <button
                      onClick={() => setLevelPillarTab('PLANIFICACION')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        levelPillarTab === 'PLANIFICACION'
                          ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      Planificación Pedagógica
                    </button>
                    <button
                      onClick={() => setLevelPillarTab('EVALUACION')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        levelPillarTab === 'EVALUACION'
                          ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <ClipboardList className="w-4 h-4" />
                      Evaluación Continua
                    </button>
                    <button
                      onClick={() => setLevelPillarTab('COMUNICACION')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        levelPillarTab === 'COMUNICACION'
                          ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Comunicación y Reportes
                    </button>
                  </div>

                  {levelPillarTab === 'PLANIFICACION' && (
                    <PlanningModule
                      activeSubTab={planningSubTab}
                      setActiveSubTab={setPlanningSubTab}
                    />
                  )}

                  {levelPillarTab === 'EVALUACION' && (
                    <EvaluationModule
                      activeSubTab={evaluationSubTab}
                      setActiveSubTab={setEvaluationSubTab}
                      onNavigateToAI={handleNavigateToAI}
                    />
                  )}

                  {levelPillarTab === 'COMUNICACION' && (
                    <CommunicationModule
                      activeSubTab={communicationSubTab}
                      setActiveSubTab={setCommunicationSubTab}
                    />
                  )}
                </div>
              )}

              {/* 6. CONSULTAS */}
              {activeTab === 'CONSULTAS' && <ConsultasModule />}

              {/* 7. COMUNIDAD */}
              {activeTab === 'COMUNIDAD' && <ComunidadModule />}

              {/* 8. CONFIGURACIÓN */}
              {activeTab === 'CONFIGURACION' && <ConfiguracionModule />}

              {/* 9. AYUDA / MAPA DEL SITIO */}
              {activeTab === 'AYUDA' && (
                <MapaDelSitioView
                  onNavigate={(tab, sub) => handleQuickAction(tab, sub)}
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
                    src={`${import.meta.env.BASE_URL}logo-cba.png`}
                    alt="Colegio Bellas Artes"
                    className="h-6 w-auto object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <p className="font-extrabold text-white text-sm">
                      SICE-CBA • Colegio Bellas Artes
                    </p>
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                      2026-2027
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    U.E.P. Colegio Bellas Artes • Maracaibo, Venezuela • Septiembre 2026
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-slate-300 font-medium">
                <div className="text-center sm:text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    Autor y Desarrollador:
                  </span>
                  <span className="text-xs font-extrabold text-[#D4AF37]">
                    Ing. en Informática Miguelangel Contreras Guillén
                  </span>
                </div>
                <span className="text-slate-400 text-xs font-mono px-2 py-0.5 rounded bg-slate-800/80 border border-white/5">
                  v1.0.0-DEV
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Floating Speed Dial / Quick Actions Dock */}
      <QuickActionDock
        onNavigate={handleQuickAction}
        onOpenSearch={() => setSearchModalOpen(true)}
      />
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
