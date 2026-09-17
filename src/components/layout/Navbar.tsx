import React from 'react';
import { useApp } from '../../context/AppContext';
import { EducationalLevel, UserRole } from '../../types';
import {
  GraduationCap,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  BookOpen,
  ClipboardList,
  MessageSquare
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'PLANIFICACION' | 'EVALUACION' | 'COMUNICACION';
  setActiveTab: (tab: 'PLANIFICACION' | 'EVALUACION' | 'COMUNICACION') => void;
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeSubTab,
  setActiveSubTab
}) => {
  const {
    currentLevel,
    setCurrentLevel,
    currentRole,
    setCurrentRole,
    activeLapso,
    setActiveLapso,
    currentSection,
    resetToSeedData
  } = useApp();

  const handleLevelChange = (level: EducationalLevel) => {
    setCurrentLevel(level);
    // Reset subtab to default
    if (activeTab === 'PLANIFICACION') setActiveSubTab('AREAS_PERFILES');
    if (activeTab === 'EVALUACION') setActiveSubTab('PROCESAL');
    if (activeTab === 'COMUNICACION') setActiveSubTab('BOLETIN');
  };

  return (
    <header className="w-full bg-[#2C2E53] text-white shadow-xl sticky top-0 z-50">
      {/* Top Bar: Institution Branding & Session Settings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4 border-b border-[#414474]">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-10 px-2 rounded-xl bg-white flex items-center justify-center shadow-md border border-[#D4AF37]/50">
            <img src={`${import.meta.env.BASE_URL}logo-cba.png`} alt="Colegio Bellas Artes" className="h-7 w-auto object-contain" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-wider text-white">SICE-CBA</span>
              <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                2026-2027
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">Colegio Bellas Artes • Maracaibo</p>
          </div>
        </div>

        {/* Level Selector Pills */}
        <div className="flex items-center bg-[#1B1C33] p-1 rounded-xl border border-[#414474]/50">
          <span className="text-xs font-bold text-slate-400 px-2 flex items-center gap-1 hidden sm:flex">
            <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" /> Nivel:
          </span>
          {(['INICIAL', 'PRIMARIA', 'MEDIA_GENERAL'] as EducationalLevel[]).map((level) => {
            const isActive = currentLevel === level;
            const labels: Record<EducationalLevel, string> = {
              INICIAL: 'Inicial',
              PRIMARIA: 'Primaria',
              MEDIA_GENERAL: 'Media General'
            };
            return (
              <button
                key={level}
                onClick={() => handleLevelChange(level)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#1B1C33] shadow-cba-gold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {labels[level]}
              </button>
            );
          })}
        </div>

        {/* Lapso & Role Switcher */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Lapso Pill */}
          <div className="flex items-center bg-[#1B1C33] px-2.5 py-1 rounded-lg border border-[#414474]">
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37] mr-1.5" />
            <span className="text-slate-400 mr-1.5 font-medium">Lapso:</span>
            <div className="flex space-x-1 font-bold">
              {[1, 2, 3].map((l) => (
                <button
                  key={l}
                  onClick={() => setActiveLapso(l as 1 | 2 | 3)}
                  className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                    activeLapso === l
                      ? 'bg-[#D4AF37] text-[#2C2E53]'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Role Pill */}
          <div className="flex items-center bg-[#1B1C33] px-2.5 py-1 rounded-lg border border-[#414474]">
            <span className="text-slate-400 mr-1.5 font-medium">Rol:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              aria-label="Seleccionar rol de usuario"
              className="bg-transparent text-[#D4AF37] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="DOCENTE" className="bg-[#2C2E53] text-white">Docente</option>
              <option value="COORDINACION" className="bg-[#2C2E53] text-white">Coordinación Pedagógica</option>
              <option value="REPRESENTANTE" className="bg-[#2C2E53] text-white">Representante / Familia</option>
              <option value="ESTUDIANTE" className="bg-[#2C2E53] text-white">Estudiante</option>
            </select>
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('¿Deseas reiniciar los datos de demostración a su estado inicial?')) {
                resetToSeedData();
              }
            }}
            title="Reiniciar datos de prueba"
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#D4AF37] hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3 Pillars Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <nav className="flex space-x-1 sm:space-x-4">
          <button
            onClick={() => {
              setActiveTab('PLANIFICACION');
              setActiveSubTab('AREAS_PERFILES');
            }}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'PLANIFICACION'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            1. Planificación
          </button>

          <button
            onClick={() => {
              setActiveTab('EVALUACION');
              setActiveSubTab('PROCESAL');
            }}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'EVALUACION'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            2. Evaluación
          </button>

          <button
            onClick={() => {
              setActiveTab('COMUNICACION');
              setActiveSubTab(currentLevel === 'MEDIA_GENERAL' ? 'IA_ACTION_PLANS' : 'BOLETIN');
            }}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'COMUNICACION'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            3. Comunicación & IA
            {currentLevel === 'MEDIA_GENERAL' && (
              <span className="flex items-center text-[10px] bg-[#D4AF37] text-[#2C2E53] px-1.5 py-0.2 font-extrabold rounded-full animate-pulse">
                IA
              </span>
            )}
          </button>
        </nav>

        {/* Current Active Section Badge */}
        <div className="hidden md:flex items-center text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
          <span className="text-slate-400 mr-1">Sección activa:</span>
          <span className="font-bold text-white">{currentSection}</span>
        </div>
      </div>
    </header>
  );
};
