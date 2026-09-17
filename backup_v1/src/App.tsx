import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
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
  Bot
} from 'lucide-react';

const SiscebaMainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PLANIFICACION' | 'EVALUACION' | 'COMUNICACION'>('PLANIFICACION');
  const [planningSubTab, setPlanningSubTab] = useState<string>('AREAS_PERFILES');
  const [evaluationSubTab, setEvaluationSubTab] = useState<string>('PROCESAL');
  const [communicationSubTab, setCommunicationSubTab] = useState<string>('BOLETIN');

  const { currentLevel, currentRole } = useApp();

  const handleNavigateToAI = () => {
    setActiveTab('COMUNICACION');
    setCommunicationSubTab('IA_ACTION_PLANS');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSubTab={
          activeTab === 'PLANIFICACION'
            ? planningSubTab
            : activeTab === 'EVALUACION'
            ? evaluationSubTab
            : communicationSubTab
        }
        setActiveSubTab={(sub) => {
          if (activeTab === 'PLANIFICACION') setPlanningSubTab(sub);
          else if (activeTab === 'EVALUACION') setEvaluationSubTab(sub);
          else setCommunicationSubTab(sub);
        }}
      />

      {/* Role and Level Indicator Banner */}
      <section aria-label="Información de sesión y rol" className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8 no-print">
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
              <span>Modo Operativo: <strong className="text-slate-800">{currentRole}</strong></span>
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
              <img src="/logo-cba.png" alt="Colegio Bellas Artes" className="h-6 w-auto object-contain" />
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
