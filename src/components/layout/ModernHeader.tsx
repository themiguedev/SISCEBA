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
  LogOut,
  Keyboard
} from 'lucide-react';
import { SeasonalAccessoryIcon } from '../auth/LogoSeasonalAccessory';
import { ThemeSwitcherDropdown } from './ThemeSwitcherDropdown';
import { NotificationCenterPopover } from '../notifications/NotificationCenterPopover';
import { MainNavigationTab } from '../../types';

interface ModernHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  onOpenSearch: () => void;
  onOpenShortcuts?: () => void;
  onGoHome: () => void;
  onSelectLevel?: (level: EducationalLevel) => void;
  onOpenThemeSettings?: () => void;
  onNavigate?: (tab: MainNavigationTab, subTab?: string) => void;
  activeTab?: string;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  onOpenSearch,
  onOpenShortcuts,
  onGoHome,
  onSelectLevel,
  onOpenThemeSettings,
  onNavigate,
  activeTab
}) => {
  const {
    currentLevel,
    setCurrentLevel,
    currentRole,
    setCurrentRole,
    activeLapso,
    setActiveLapso,
    logout,
    isSupabaseActive,
    supabaseStatusText
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
      color: 'from-emerald-500 to-teal-500'
    },
    MEDIA_GENERAL: {
      label: 'Media General',
      sub: '1° a 5° Año',
      icon: '🎓',
      badge: 'Numérica (01-20)',
      color: 'from-blue-500 to-indigo-500'
    }
  };

  return (
    <header className="w-full bg-[#1B1C33] border-b border-[#2C2E53] sticky top-0 z-40 text-white shadow-xl backdrop-blur-md">
      {/* Top Main Command Bar */}
      <div className="max-w-[1700px] mx-auto px-2.5 sm:px-4 lg:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 lg:gap-3">
        {/* Left: Sidebar Toggle & Brand Crest */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-2 rounded-xl bg-[#2C2E53]/70 hover:bg-[#2C2E53] text-slate-300 hover:text-white transition border border-[#414474]/50 focus:outline-none shrink-0"
            title="Alternar Menú Lateral"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Institutional Logo Button - Click to return to Home */}
          <button
            type="button"
            onClick={onGoHome}
            className="relative flex items-center justify-center shrink-0 group focus:outline-none transition-all duration-200 cursor-pointer p-1 -ml-1 rounded-xl hover:bg-white/5"
            title="Ir a la página principal (Inicio)"
          >
            <div className="relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-200">
              <img
                src={`${import.meta.env.BASE_URL}logo-cba.png`}
                alt="Colegio Bellas Artes"
                className="h-8 sm:h-9 w-auto object-contain brightness-0 invert drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
              />
              <SeasonalAccessoryIcon sizeClass="w-4 sm:w-5 h-4 sm:h-5" className="-top-1.5 -right-1" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
              </span>
            </div>
          </button>

          {/* Title SICE-CBA & Period Badge - Static Informative */}
          <div className="hidden sm:flex flex-col justify-center shrink-0 select-none cursor-default">
            <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
              <span className="font-extrabold text-sm sm:text-base tracking-wider text-white whitespace-nowrap">
                SICE-CBA
              </span>
              <span className="text-[10px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 shadow-sm whitespace-nowrap shrink-0">
                2026-2027
              </span>
              {/* Supabase Status Indicator */}
              <div
                className={`hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border transition ${
                  isSupabaseActive
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}
                title={supabaseStatusText}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSupabaseActive
                      ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] animate-pulse'
                      : 'bg-amber-400'
                  }`}
                />
                <span>{isSupabaseActive ? 'Supabase' : 'Local'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Interactive Level Switcher (Pills) or Portal de Consultas for Representante / Estudiante */}
        {(currentRole === 'REPRESENTANTE' || currentRole === 'ESTUDIANTE') ? (
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141525] border border-[#D4AF37]/50 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shrink-0"></span>
            <span className="text-xs font-black text-[#D4AF37] tracking-wider uppercase">
              Portal de Consultas • {currentRole === 'REPRESENTANTE' ? 'Padres y Representantes' : 'Estudiantes CBA'}
            </span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center bg-[#141525] p-1 rounded-2xl border border-[#2C2E53] shadow-inner shrink-0">
            {(['INICIAL', 'PRIMARIA', 'MEDIA_GENERAL'] as EducationalLevel[]).map((lvl) => {
              const isCurrentModule = activeTab === lvl;
              const isContextLevel = currentLevel === lvl;
              const isSelected = isCurrentModule || (isContextLevel && (activeTab === 'ESCRITORIO' || !['INICIAL', 'PRIMARIA', 'MEDIA_GENERAL'].includes(activeTab || '')));
              const data = levelDetails[lvl];
              return (
                <button
                  key={lvl}
                  onClick={() => {
                    setCurrentLevel(lvl);
                    if (onSelectLevel) {
                      onSelectLevel(lvl);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2 xl:px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#2C2E53] text-[#D4AF37] shadow-md border border-[#D4AF37]/50 scale-[1.01]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#1B1C33]'
                  }`}
                  title={`Acceder a ${data.label}`}
                >
                  <span className="text-sm">{data.icon}</span>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className={isSelected ? 'text-white font-black' : ''}>{lvl.replace('_', ' ')}</span>
                      {isSelected && (
                        <span className="hidden 2xl:inline text-[9px] px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-extrabold">
                          {data.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Center Search Trigger (Expanded) */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2 bg-[#141525]/80 hover:bg-[#141525] text-slate-400 hover:text-slate-200 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-xl border border-[#2C2E53] text-xs font-medium transition shadow-inner max-w-[120px] lg:max-w-[150px] xl:max-w-xs flex-1 min-w-[90px]"
        >
          <Search className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-[#D4AF37] shrink-0" />
          <span className="truncate">Buscar...</span>
          <kbd className="hidden xl:inline-flex ml-auto px-1.5 py-0.5 text-[10px] bg-[#2C2E53] text-slate-300 rounded border border-[#414474] shrink-0">
            Ctrl K
          </kbd>
        </button>

        {/* Right: Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0">
          {/* Keyboard Shortcuts Trigger Button */}
          {onOpenShortcuts && (
            <button
              type="button"
              onClick={onOpenShortcuts}
              className="hidden sm:flex p-1.5 sm:p-2 rounded-xl bg-[#141525] hover:bg-[#2C2E53] text-[#D4AF37] border border-[#2C2E53] transition shadow-inner shrink-0"
              title="Atajos de Teclado del Sistema (Presiona ?)"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          )}

          {/* Theme Switcher Popover */}
          <ThemeSwitcherDropdown onOpenSettings={onOpenThemeSettings} />

          {/* Interactive Notifications Center */}
          <NotificationCenterPopover onNavigate={onNavigate} />

          {/* Lapso Selector Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setLapsoMenuOpen(!lapsoMenuOpen)}
              className="flex items-center gap-1.5 bg-[#2C2E53] hover:bg-[#353866] text-white px-2 sm:px-2.5 py-1.5 rounded-xl border border-[#414474] text-xs font-bold transition whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="hidden sm:inline">Lapso </span><span className="sm:hidden">L.</span><span>{activeLapso}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
            {lapsoMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 sm:hidden"
                  onClick={() => setLapsoMenuOpen(false)}
                />
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
              </>
            )}
          </div>

          {/* Role Selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 bg-[#2C2E53] hover:bg-[#353866] text-white px-2 sm:px-2.5 py-1.5 rounded-xl border border-[#414474] text-xs font-bold transition whitespace-nowrap"
              title={`Rol activo: ${currentRole}`}
            >
              <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[10px] text-[#D4AF37] font-black shrink-0">
                {currentRole[0]}
              </div>
              <span className="hidden xl:inline">{currentRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
            {roleMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 sm:hidden"
                  onClick={() => setRoleMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-[#1B1C33] border border-[#414474] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 border-b border-[#2C2E53] mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Modo de Operación
                    </span>
                  </div>
                  {(['ADMINISTRADOR', 'DIRECTOR', 'COORDINADOR', 'DOCENTE', 'REPRESENTANTE', 'ESTUDIANTE'] as UserRole[]).map((r) => (
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

                  <div className="pt-1.5 mt-1.5 border-t border-[#2C2E53]">
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition"
                    >
                      <span>Cerrar Sesión</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Direct Logout Action Button */}
          <button
            onClick={logout}
            className="p-1.5 sm:p-2 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white transition border border-rose-500/30 focus:outline-none shrink-0"
            title="Cerrar Sesión (Ir a pantalla de Login)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Level Selector Bar (when screen is < 1024px) */}
      <div className="lg:hidden px-2 py-1.5 border-t border-[#2C2E53] bg-[#141525] flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        {(['INICIAL', 'PRIMARIA', 'MEDIA_GENERAL'] as EducationalLevel[]).map((lvl) => {
          const isCurrentModule = activeTab === lvl;
          const isContextLevel = currentLevel === lvl;
          const isSelected = isCurrentModule || (isContextLevel && (activeTab === 'ESCRITORIO' || !['INICIAL', 'PRIMARIA', 'MEDIA_GENERAL'].includes(activeTab || '')));
          const data = levelDetails[lvl];
          return (
            <button
              key={lvl}
              onClick={() => {
                setCurrentLevel(lvl);
                if (onSelectLevel) {
                  onSelectLevel(lvl);
                }
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-[#2C2E53] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{data.icon}</span>
              <span>{lvl === 'MEDIA_GENERAL' ? 'Media General' : lvl.replace('_', ' ')}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
