import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider, useTheme, THEMES_CATALOG } from './context/ThemeContext';
import { MainNavigationTab, EducationalLevel, UserRole } from './types';
import { ModernHeader } from './components/layout/ModernHeader';
import { ModernSidebar } from './components/layout/ModernSidebar';
import { AcademicPulseHero } from './components/layout/AcademicPulseHero';
import { CompactWorkspaceHeader } from './components/layout/CompactWorkspaceHeader';
import { QuickActionDock } from './components/layout/QuickActionDock';
import { CommandSearchModal } from './components/layout/CommandSearchModal';
import { KeyboardShortcutsModal } from './components/layout/KeyboardShortcutsModal';
import { DeveloperConsoleHUD } from './components/dev/DeveloperConsoleHUD';
import { ShortcutToast, ShortcutToastMessage } from './components/common/ShortcutToast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { LoginView } from './components/auth/LoginView';
import { SeasonalAccessoryIcon } from './components/auth/LogoSeasonalAccessory';

// Modules
import { EscritorioView } from './components/dashboard/EscritorioView';
import { GestionModule } from './components/gestion/GestionModule';
import { PlanningModule } from './components/planning/PlanningModule';
import { EvaluationModule } from './components/evaluation/EvaluationModule';
import { CommunicationModule } from './components/communication/CommunicationModule';
import { ConsultasModule } from './components/consultas/ConsultasModule';
import { ComunidadModule } from './components/comunidad/ComunidadModule';
import { ConfiguracionModule } from './components/configuracion/ConfiguracionModule';
import { AyudaModule } from './components/ayuda/AyudaModule';

import { BookOpen, ClipboardList, MessageSquare, WifiOff } from 'lucide-react';

const SiscebaMainApp: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [devHUDOpen, setDevHUDOpen] = useState(false);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [isDebugGridActive, setIsDebugGridActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<ShortcutToastMessage | null>(null);

  // Top-Level Active Module Tab
  const [activeTab, setActiveTab] = useState<MainNavigationTab>('ESCRITORIO');

  // Subtab States for each domain
  const [escritorioSubTab, setEscritorioSubTab] = useState<'DASHBOARD' | 'PERFIL' | 'SUGERENCIAS'>('DASHBOARD');
  const [gestionSubTab, setGestionSubTab] = useState<string>('INSCRIPCIONES');
  const [consultasSubTab, setConsultasSubTab] = useState<'RENDIMIENTO' | 'ESTADISTICAS' | 'NOMINAS'>('RENDIMIENTO');
  const [comunidadSubTab, setComunidadSubTab] = useState<'NOTICIAS' | 'CUMPLEANOS' | 'COMUNICADOS'>('NOTICIAS');
  const [configuracionSubTab, setConfiguracionSubTab] = useState<'LAPSOS' | 'ESTRUCTURA' | 'DOCENTES' | 'TEMAS'>('LAPSOS');
  const [ayudaSubTab, setAyudaSubTab] = useState<'MANUAL' | 'MAPA_SITIO'>('MANUAL');
  const [planningSubTab, setPlanningSubTab] = useState<string>('AREAS_PERFILES');
  const [evaluationSubTab, setEvaluationSubTab] = useState<string>('PROCESAL');
  const [communicationSubTab, setCommunicationSubTab] = useState<string>('BOLETIN');
  const [levelPillarTab, setLevelPillarTab] = useState<'PLANIFICACION' | 'EVALUACION' | 'COMUNICACION'>('PLANIFICACION');

  const {
    currentLevel,
    setCurrentLevel,
    activeLapso,
    setActiveLapso,
    currentRole,
    setCurrentRole,
    isAuthenticated,
    students,
    areas,
    plansQuincenal,
    evaluations
  } = useApp();

  const { mode, palette, isDark, toggleMode, setPalette } = useTheme();

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
    if (sub === 'DASHBOARD' || sub === 'PERFIL' || sub === 'SUGERENCIAS') {
      setEscritorioSubTab(sub as 'DASHBOARD' | 'PERFIL' | 'SUGERENCIAS');
    } else if (['INSCRIPCIONES', 'PASES', 'INASISTENCIAS', 'CONDUCTAS', 'DOCUMENTOS', 'BLOQUEO', 'TITULOS', 'MATRICULA'].includes(sub)) {
      setGestionSubTab(sub);
    } else if (['RENDIMIENTO', 'ESTADISTICAS', 'NOMINAS'].includes(sub)) {
      setConsultasSubTab(sub as 'RENDIMIENTO' | 'ESTADISTICAS' | 'NOMINAS');
    } else if (['NOTICIAS', 'CUMPLEANOS', 'COMUNICADOS'].includes(sub)) {
      setComunidadSubTab(sub as 'NOTICIAS' | 'CUMPLEANOS' | 'COMUNICADOS');
    } else if (['LAPSOS', 'ESTRUCTURA', 'DOCENTES', 'TEMAS'].includes(sub)) {
      setConfiguracionSubTab(sub as 'LAPSOS' | 'ESTRUCTURA' | 'DOCENTES' | 'TEMAS');
    } else if (['MANUAL', 'MAPA_SITIO'].includes(sub)) {
      setAyudaSubTab(sub as 'MANUAL' | 'MAPA_SITIO');
    } else if (['DIAGNOSTICA', 'PROCESAL', 'FINAL_LAPSO'].includes(sub)) {
      setLevelPillarTab('EVALUACION');
      setEvaluationSubTab(sub);
    } else if (['BOLETIN', 'ACTAS_CONSEJO', 'IA_ACTION_PLANS', 'REMEDIALES', 'REPORTES_INSTITUCIONALES'].includes(sub)) {
      setLevelPillarTab('COMUNICACION');
      setCommunicationSubTab(sub);
    } else if (['AREAS_PERFILES', 'BANCO_COMPETENCIAS', 'BANCO_ESTRATEGIAS', 'PLAN_QUINCENAL', 'PLAN_LAPSO'].includes(sub)) {
      setLevelPillarTab('PLANIFICACION');
      setPlanningSubTab(sub);
    } else {
      if (activeTab === 'ESCRITORIO') setEscritorioSubTab(sub as any);
      else if (activeTab === 'GESTION') setGestionSubTab(sub);
      else if (activeTab === 'CONSULTAS') setConsultasSubTab(sub as any);
      else if (activeTab === 'COMUNIDAD') setComunidadSubTab(sub as any);
      else if (activeTab === 'CONFIGURACION') setConfiguracionSubTab(sub as any);
      else if (activeTab === 'AYUDA') setAyudaSubTab(sub as any);
    }
  };

  const currentSubTab =
    activeTab === 'ESCRITORIO'
      ? escritorioSubTab
      : activeTab === 'GESTION'
      ? gestionSubTab
      : activeTab === 'CONSULTAS'
      ? consultasSubTab
      : activeTab === 'COMUNIDAD'
      ? comunidadSubTab
      : activeTab === 'CONFIGURACION'
      ? configuracionSubTab
      : activeTab === 'AYUDA'
      ? ayudaSubTab
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
    if (tab === 'ESCRITORIO') {
      handleTabChange('ESCRITORIO');
      if (subTab) setEscritorioSubTab(subTab as 'DASHBOARD' | 'PERFIL' | 'SUGERENCIAS');
    } else if (tab === 'GESTION') {
      handleTabChange('GESTION');
      if (subTab) setGestionSubTab(subTab);
    } else if (tab === 'CONSULTAS') {
      handleTabChange('CONSULTAS');
      if (subTab) setConsultasSubTab(subTab as 'RENDIMIENTO' | 'ESTADISTICAS' | 'NOMINAS');
    } else if (tab === 'COMUNIDAD') {
      handleTabChange('COMUNIDAD');
      if (subTab) setComunidadSubTab(subTab as 'NOTICIAS' | 'CUMPLEANOS' | 'COMUNICADOS');
    } else if (tab === 'CONFIGURACION') {
      handleTabChange('CONFIGURACION');
      if (subTab) setConfiguracionSubTab(subTab as 'LAPSOS' | 'ESTRUCTURA' | 'DOCENTES');
    } else if (tab === 'AYUDA') {
      handleTabChange('AYUDA');
      if (subTab) setAyudaSubTab(subTab as 'MANUAL' | 'MAPA_SITIO');
    } else if (tab === 'PLANIFICACION') {
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

  // Helper to trigger floating toast notifications
  const showToast = (title: string, description?: string, isDev?: boolean) => {
    const id = Date.now().toString();
    setToastMessage({ id, title, description, isDev });
    setTimeout(() => {
      setToastMessage((curr) => (curr?.id === id ? null : curr));
    }, 2200);
  };

  // Dev Action: Cycle through user roles
  const handleCycleRole = () => {
    const roles: UserRole[] = ['ADMINISTRADOR', 'COORDINADOR', 'DOCENTE', 'REPRESENTANTE', 'ESTUDIANTE'];
    const nextIdx = (roles.indexOf(currentRole) + 1) % roles.length;
    const nextRole = roles[nextIdx];
    setCurrentRole(nextRole);
    showToast(`Rol simulado: ${nextRole}`, 'Permisos de interfaz actualizados', true);
  };

  // Dev Action: Cycle through academic lapsos
  const handleCycleLapso = () => {
    const nextLapso = ((activeLapso % 3) + 1) as 1 | 2 | 3;
    setActiveLapso(nextLapso);
    showToast(`Lapso activo: ${nextLapso}° Lapso`, undefined, true);
  };

  // Dev Action: Toggle simulated offline mode
  const handleToggleOffline = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      showToast(
        next ? 'Modo Offline: ACTIVADO' : 'Modo Offline: DESACTIVADO',
        next ? 'Simulando trabajo local sin internet' : 'Conectividad normal restablecida',
        true
      );
      return next;
    });
  };

  // Dev Action: Toggle layout debug grid
  const handleToggleDebugGrid = () => {
    setIsDebugGridActive((prev) => {
      const next = !prev;
      showToast(
        next ? 'Debug Grid: ACTIVADO' : 'Debug Grid: DESACTIVADO',
        next ? 'Líneas guía de alineación visibles' : 'Vista normal',
        true
      );
      return next;
    });
  };

  // Dev Action: Copy system diagnostics JSON to clipboard
  const handleCopyDiagnostics = () => {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      role: currentRole,
      level: currentLevel,
      lapso: activeLapso,
      theme: { mode, palette, isDark },
      counts: {
        students: students.length,
        areas: areas.length,
        plans: plansQuincenal.length,
        evaluations: evaluations.length
      },
      offline: isSimulatedOffline,
      debugGrid: isDebugGridActive
    };
    navigator.clipboard.writeText(JSON.stringify(diagnostics, null, 2));
    showToast('Diagnóstico copiado al portapapeles', 'JSON técnico listo para inspeccionar', true);
  };

  // Dev Action: Reset demo seed data
  const handleResetSeedData = () => {
    if (window.confirm('¿Deseas restablecer todos los datos de prueba a los valores de fábrica?')) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('sisceba_')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      showToast('Datos restablecidos', 'Recargando aplicación...', true);
      setTimeout(() => window.location.reload(), 500);
    }
  };

  // User Action: Cycle theme palette
  const handleCycleTheme = () => {
    const catalog = THEMES_CATALOG;
    const currentIdx = catalog.findIndex((t) => t.id === palette);
    const nextIdx = (currentIdx + 1) % catalog.length;
    const nextTheme = catalog[nextIdx];
    setPalette(nextTheme.id);
    showToast(`Tema: ${nextTheme.name}`, nextTheme.description, false);
  };

  // User Action: Toggle dark/light mode
  const handleToggleMode = () => {
    toggleMode();
    showToast(isDark ? 'Modo Claro activado' : 'Modo Oscuro activado', undefined, false);
  };

  // Close all modal dialogs
  const handleCloseAllModals = () => {
    setSearchModalOpen(false);
    setShortcutsModalOpen(false);
    setDevHUDOpen(false);
  };

  // Central Keyboard Shortcuts Listener Hook
  useKeyboardShortcuts({
    onOpenSearch: () => {
      setSearchModalOpen(true);
    },
    onOpenShortcuts: () => setShortcutsModalOpen(true),
    onToggleSidebar: () => setSidebarOpen((prev) => !prev),
    onNavigateTab: (tab) => {
      handleTabChange(tab === 'INICIAL' ? currentLevel : tab);
      showToast(`Navegando a: ${tab}`, undefined, false);
    },
    onNavigateShortcut: (key) => {
      switch (key) {
        case '1':
          handleQuickAction('ESCRITORIO', 'DASHBOARD');
          showToast('Escritorio / Dashboard', 'Regreso a la vista principal');
          break;
        case '2':
          handleQuickAction('GESTION', 'MATRICULA');
          showToast('Estudiantes y Matrícula', 'Acceso al padrón estudiantil');
          break;
        case '3':
          handleTabChange(currentLevel);
          setLevelPillarTab('EVALUACION');
          showToast('Calificaciones y Notas', 'Acceso a carga de notas y evaluaciones');
          break;
        case '4':
          handleQuickAction('GESTION', 'INASISTENCIAS');
          showToast('Asistencias', 'Acceso al pase de lista diario');
          break;
        case '5':
          handleQuickAction('COMUNIDAD', 'NOTICIAS');
          showToast('Comunidad y Avisos', 'Cartelera, circulares y noticias');
          break;
        case '6':
          handleQuickAction('CONFIGURACION', 'LAPSOS');
          showToast('Configuración', 'Acceso a parámetros del sistema');
          break;
      }
    },
    onPrint: () => {
      showToast('Imprimir / Generar PDF', 'Preparando vista para impresión o PDF');
      window.print();
    },
    onToggleMode: handleToggleMode,
    onCycleTheme: handleCycleTheme,
    onToggleDevHUD: () => {
      setDevHUDOpen((prev) => {
        const next = !prev;
        showToast(next ? 'Consola HUD Dev: ABIERTA' : 'Consola HUD Dev: CERRADA', undefined, true);
        return next;
      });
    },
    onCycleRole: handleCycleRole,
    onCycleLapso: handleCycleLapso,
    onToggleOffline: handleToggleOffline,
    onCopyDiagnostics: handleCopyDiagnostics,
    onToggleDebugGrid: handleToggleDebugGrid,
    onResetSeedData: handleResetSeedData,
    onCloseModals: handleCloseAllModals
  });

  const handleGoHome = () => {
    setActiveTab('ESCRITORIO');
    setEscritorioSubTab('DASHBOARD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is not logged in, render the reference-inspired LoginView
  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 selection:bg-[#D4AF37] selection:text-slate-950 relative">
      {/* Visual Debug Grid Overlay */}
      {isDebugGridActive && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[9990] bg-[linear-gradient(to_right,#f59e0b12_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b12_1px,transparent_1px)] bg-[size:32px_32px] border-4 border-amber-500/40"
        />
      )}

      {/* Top Executive Command Bar */}
      <ModernHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
        onGoHome={handleGoHome}
        onSelectLevel={(lvl) => handleTabChange(lvl)}
        onOpenThemeSettings={() => handleQuickAction('CONFIGURACION', 'TEMAS')}
        onNavigate={handleQuickAction}
        activeTab={activeTab}
      />

      {/* Simulated Offline Mode Banner */}
      {isSimulatedOffline && (
        <div className="bg-rose-900/90 text-rose-100 border-b border-rose-700/60 px-4 py-1.5 text-xs font-bold flex items-center justify-between z-40 sticky top-16 backdrop-blur-md animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between max-w-[1700px] mx-auto w-full gap-3">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
              <span>⚠️ Modo Offline Simulado Activo: La aplicación está operando con persistencia local en caché.</span>
            </div>
            <button
              onClick={() => setIsSimulatedOffline(false)}
              className="px-2.5 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[11px] text-white font-mono shrink-0 transition"
            >
              Restablecer Conexión
            </button>
          </div>
        </div>
      )}

      {/* Global Spotlight Search Modal */}
      <CommandSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={handleQuickAction}
      />

      {/* Global Keyboard Shortcuts Cheatsheet Modal */}
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      {/* Developer Engineering Console HUD */}
      <DeveloperConsoleHUD
        isOpen={devHUDOpen}
        onClose={() => setDevHUDOpen(false)}
        isSimulatedOffline={isSimulatedOffline}
        setIsSimulatedOffline={setIsSimulatedOffline}
        isDebugGridActive={isDebugGridActive}
        setIsDebugGridActive={setIsDebugGridActive}
        onShowToast={showToast}
      />

      {/* Discreet Feedback Toast */}
      <ShortcutToast toast={toastMessage} onClose={() => setToastMessage(null)} />

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
          <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              {activeTab === 'ESCRITORIO' && (
                <EscritorioView
                  activeSubTab={escritorioSubTab}
                  setActiveSubTab={setEscritorioSubTab}
                />
              )}

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
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => setLevelPillarTab('PLANIFICACION')}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        levelPillarTab === 'PLANIFICACION'
                          ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">Planificación Pedagógica</span>
                      <span className="sm:hidden">Planificación</span>
                    </button>
                    <button
                      onClick={() => setLevelPillarTab('EVALUACION')}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        levelPillarTab === 'EVALUACION'
                          ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <ClipboardList className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">Evaluación Continua</span>
                      <span className="sm:hidden">Evaluación</span>
                    </button>
                    <button
                      onClick={() => setLevelPillarTab('COMUNICACION')}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        levelPillarTab === 'COMUNICACION'
                          ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">Comunicación y Reportes</span>
                      <span className="sm:hidden">Comunicación</span>
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
              {activeTab === 'CONSULTAS' && (
                <ConsultasModule
                  activeSubTab={consultasSubTab}
                  setActiveSubTab={setConsultasSubTab}
                />
              )}

              {/* 7. COMUNIDAD */}
              {activeTab === 'COMUNIDAD' && (
                <ComunidadModule
                  activeSubTab={comunidadSubTab}
                  setActiveSubTab={setComunidadSubTab}
                />
              )}

              {/* 8. CONFIGURACIÓN */}
              {activeTab === 'CONFIGURACION' && (
                <ConfiguracionModule
                  activeSubTab={configuracionSubTab}
                  setActiveSubTab={setConfiguracionSubTab}
                />
              )}

              {/* 9. AYUDA / MANUAL Y MAPA DEL SITIO */}
              {activeTab === 'AYUDA' && (
                <AyudaModule
                  activeSubTab={ayudaSubTab}
                  setActiveSubTab={setAyudaSubTab}
                  onNavigate={handleQuickAction}
                />
              )}
            </div>
          </main>

          {/* Modern Executive Footer */}
          <footer className="w-full bg-[#1B1C33] text-white border-t border-[#2C2E53] py-6 px-4 sm:px-6 lg:px-8 mt-auto no-print">
            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3 text-center md:text-left">
                <div className="relative flex items-center justify-center shrink-0 select-none cursor-default">
                  <img
                    src={`${import.meta.env.BASE_URL}logo-cba.png`}
                    alt="Colegio Bellas Artes"
                    className="h-8 w-auto object-contain brightness-0 invert drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
                  />
                  <SeasonalAccessoryIcon sizeClass="w-4 h-4" className="-top-1 -right-1" />
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

              <div className="flex items-center gap-4 text-slate-300 font-medium">
                <span className="text-slate-400 text-xs font-mono px-2.5 py-1 rounded bg-slate-800/80 border border-white/5">
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
    <ThemeProvider>
      <AppProvider>
        <SiscebaMainApp />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
