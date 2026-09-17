import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EducationalLevel, UserRole } from '../../types';
import {
  Menu,
  Search,
  Sparkles,
  Calendar,
  ChevronDown,
  ShieldCheck,
  GraduationCap,
  Layers,
  CheckCircle2,
  Clock,
  RotateCcw
} from 'lucide-react';

interface ModernHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  designMode: 'VANGUARDISTA' | 'CLASICO';
  setDesignMode: (mode: 'VANGUARDISTA' | 'CLASICO') => void;
  onOpenSearch: () => void;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  designMode,
  setDesignMode,
  onOpenSearch
}) => {
  const {
    currentLevel,
    setCurrentLevel,
    currentRole,
    setCurrentRole,
    activeLapso,
    setActiveLapso
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [lapsoMenuOpen, setLapsoMenuOpen] = useState(false);

  const levelDetails: Record<
    EducationalLevel,
    { label: string; sub: string; icon: string; badge: string; color: string }
  > = {
    INICIAL: {
      label: 'Educación Inicial',
      sub: 'Salas 3, 4 y 5 Años',
      icon: '🧸',
      badge: 'Cualitativa',
      color: 'from-amber-500 to-orange-500'
    },
    PRIMARIA: {
      label: 'Educación Primaria',
      sub: '1° a 6° Grado',
      icon: '🎒',
      badge: 'Literal (A-E)',
      color: 'from-blue-600 to-indigo-600'
    },
    MEDIA_GENERAL: {
      label: 'Media General',
      sub: '1° a 5° Año',
      icon: '🎓',
      badge: 'Numérica (01-20)',
      color: 'from-[#2C2E53] to-[#414474]'
    }
  };

  return (
    <header className="w-full bg-[#1B1C33] border-b border-[#2C2E53] sticky top-0 z-40 text-white shadow-xl backdrop-blur-md">
      {/* Top Main Command Bar */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Sidebar Toggle & Brand Crest */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-2 rounded-xl bg-[#2C2E53]/70 hover:bg-[#2C2E53] text-slate-300 hover:text-white transition border border-[#414474]/50 focus:outline-none"
            title="Alternar Menú Lateral"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Institutional Badge */}
          <div className="flex items-center gap-3">
            <div className="h-10 px-2.5 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-black/20 border border-[#D4AF37]/60 group relative">
              <img
                src="/logo-cba.png"
                alt="Colegio Bellas Artes"
                className="h-7 w-auto object-contain"
              />
              <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]"></span>
              </span>
            </div>

            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-white">
                  SICE-CBA
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm">
                  2026-2027
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Colegio Bellas Artes • Maracaibo
              </p>
            </div>
          </div>
        </div>

        {/* Center: Interactive Level Switcher (Pills) */}
        <div className="hidden lg:flex items-center bg-[#141525] p-1 rounded-2xl border border-[#2C2E53] shadow-inner">
          {(['INICIAL', 'PRIMARIA', 'MEDIA_GENERAL'] as EducationalLevel[]).map((lvl) => {
            const isSelected = currentLevel === lvl;
            const data = levelDetails[lvl];
            return (
              <button
                key={lvl}
                onClick={() => setCurrentLevel(lvl)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#2C2E53] text-white shadow-md border border-[#D4AF37]/40 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1B1C33]'
                }`}
              >
                <span className="text-sm">{data.icon}</span>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span>{lvl.replace('_', ' ')}</span>
                    {isSelected && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-extrabold">
                        {data.badge}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Center Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-3 bg-[#141525]/80 hover:bg-[#141525] text-slate-400 hover:text-slate-200 px-3.5 py-2 rounded-xl border border-[#2C2E53] text-xs font-medium transition shadow-inner max-w-xs flex-1"
        >
          <Search className="w-4 h-4 text-[#D4AF37]" />
          <span className="truncate">Buscar estudiantes, áreas...</span>
          <kbd className="ml-auto px-1.5 py-0.5 text-[10px] bg-[#2C2E53] text-slate-300 rounded border border-[#414474]">
            Ctrl K
          </kbd>
        </button>

        {/* Right: Controls & Design Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Design Mode Toggle Switcher (Vanguardista vs Clásico) */}
          <div className="flex items-center bg-[#141525] p-1 rounded-xl border border-[#2C2E53]">
            <button
              onClick={() => setDesignMode('VANGUARDISTA')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                designMode === 'VANGUARDISTA'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89327] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Activar Diseño Vanguardista 2026"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vanguardista</span>
            </button>
            <button
              onClick={() => setDesignMode('CLASICO')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                designMode === 'CLASICO'
                  ? 'bg-[#2C2E53] text-[#D4AF37] shadow-md border border-[#D4AF37]/50'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Volver al Diseño Clásico Original"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clásico</span>
            </button>
          </div>

          {/* Lapso Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLapsoMenuOpen(!lapsoMenuOpen)}
              className="flex items-center gap-2 bg-[#2C2E53] hover:bg-[#353866] text-white px-3 py-1.5 rounded-xl border border-[#414474] text-xs font-bold transition"
            >
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Lapso {activeLapso}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {lapsoMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#1B1C33] border border-[#414474] rounded-xl shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95">
                {[1, 2, 3].map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setActiveLapso(l as 1 | 2 | 3);
                      setLapsoMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition ${
                      activeLapso === l
                        ? 'bg-[#2C2E53] text-[#D4AF37]'
                        : 'text-slate-300 hover:bg-[#2C2E53]/50'
                    }`}
                  >
                    <span>Lapso {l} {l === 1 ? '(En Curso)' : ''}</span>
                    {activeLapso === l && <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Selector */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 bg-[#2C2E53] hover:bg-[#353866] text-white px-3 py-1.5 rounded-xl border border-[#414474] text-xs font-bold transition"
            >
              <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[10px] text-[#D4AF37] font-black">
                {currentRole[0]}
              </div>
              <span className="hidden xl:inline">{currentRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1B1C33] border border-[#414474] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-[#2C2E53] mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Modo de Operación
                  </span>
                </div>
                {(['DOCENTE', 'COORDINADOR', 'DIRECTOR'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentRole(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition ${
                      currentRole === r
                        ? 'bg-[#2C2E53] text-[#D4AF37]'
                        : 'text-slate-300 hover:bg-[#2C2E53]/50'
                    }`}
                  >
                    <span>{r}</span>
                    {currentRole === r && <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Level Selector Bar (when screen is < 1024px) */}
      <div className="lg:hidden px-4 py-2 border-t border-[#2C2E53] bg-[#141525] flex items-center justify-between gap-1 overflow-x-auto">
        {(['INICIAL', 'PRIMARIA', 'MEDIA_GENERAL'] as EducationalLevel[]).map((lvl) => {
          const isSelected = currentLevel === lvl;
          const data = levelDetails[lvl];
          return (
            <button
              key={lvl}
              onClick={() => setCurrentLevel(lvl)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-[#2C2E53] text-[#D4AF37] border border-[#D4AF37]/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{data.icon}</span>
              <span>{lvl.replace('_', ' ')}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
