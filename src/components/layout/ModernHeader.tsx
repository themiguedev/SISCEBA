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
  Keyboard,
  User,
  Cloud,
  Loader2
} from 'lucide-react';
import { SeasonalAccessoryIcon } from '../auth/LogoSeasonalAccessory';
import { ThemeSwitcherDropdown } from './ThemeSwitcherDropdown';
import { NotificationCenterPopover } from '../notifications/NotificationCenterPopover';
import { MainNavigationTab } from '../../types';
import { getDefaultAvatarForUser } from '../../utils/avatarCatalog';
import { hasTabAccess, getUserAllowedLevels } from '../../utils/rbac';

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
    currentUser,
    isSavingCloud,
    lastCloudSync,
    isSupabaseActive
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

          {/* Title SICE-CBA - Limpio y legible */}
          <div className="flex flex-col justify-center shrink-0 select-none cursor-default">
            <span className="font-extrabold text-sm sm:text-base tracking-wider text-white whitespace-nowrap">
              SICE-CBA
            </span>
          </div>
        </div>

        {/* Center: Interactive Level Switcher (Pills) for Multi-level Staff or Scope Badge */}
        {(() => {
          const userLevels = getUserAllowedLevels(currentRole, currentUser);

          // Si el usuario tiene acceso a múltiples niveles (ej: Administrador, Director, Coordinador o Docente multinivel)
          if (userLevels.length > 1) {
            return (
              <div className="hidden lg:flex items-center bg-[#141525] p-1 rounded-2xl border border-[#2C2E53] shadow-inner shrink-0">
                {userLevels.map((lvl) => {
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
            );
          }

          // Si el usuario/docente tiene exactamente 1 nivel asignado
          if (userLevels.length === 1) {
            const singleLvl = userLevels[0];
            const data = levelDetails[singleLvl];
            const isCurrentModule = activeTab === singleLvl;
            return (
              <button
                type="button"
                onClick={() => {
                  setCurrentLevel(singleLvl);
                  if (onSelectLevel) {
                    onSelectLevel(singleLvl);
                  }
                }}
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141525] border border-[#D4AF37]/50 shadow-inner hover:bg-[#1B1C33] transition cursor-pointer group"
                title={`Nivel asignado: ${data.label}. Clic para ir a su módulo.`}
              >
                <span className="text-base group-hover:scale-110 transition-transform">{data.icon}</span>
                <span className="text-xs font-black text-[#D4AF37] tracking-wider uppercase">
                  {data.label}
                </span>
                <span className="hidden md:inline text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                  {data.badge}
                </span>
              </button>
            );
          }

          // Para roles no pedagógicos (ASISTENTE, SECRETARIA, REPRESENTANTE, ESTUDIANTE)
          return (
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141525] border border-[#D4AF37]/50 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shrink-0"></span>
              <span className="text-xs font-black text-[#D4AF37] tracking-wider uppercase">
                {currentRole === 'ASISTENTE'
                  ? 'Control de Asistencia y Disciplina'
                  : currentRole === 'SECRETARIA'
                  ? 'Secretaría y Control de Estudios'
                  : currentRole === 'REPRESENTANTE'
                  ? 'Portal de Consultas • Representantes'
                  : currentRole === 'ESTUDIANTE'
                  ? 'Portal del Alumno CBA'
                  : 'Panel Operativo Institucional'}
              </span>
            </div>
          );
        })()}

        {/* Center Search Trigger (Expanded for desktop) */}
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

        {/* Cloud Sync Status Indicator */}
        <div
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#141525]/70 border border-[#2C2E53] text-[11px] font-bold shrink-0 select-none cursor-default transition-all"
          title={isSavingCloud ? 'Guardando cambios inmediatamente en la base de datos Supabase...' : lastCloudSync ? `Sincronizado en la nube: ${lastCloudSync}` : 'Conexión a base de datos activa'}
        >
          {isSavingCloud ? (
            <>
              <Loader2 className="w-3.5 h-3.5 text-[#D4AF37] animate-spin shrink-0" />
              <span className="text-[#D4AF37]">Guardando en la nube...</span>
            </>
          ) : isSupabaseActive ? (
            <>
              <Cloud className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-300">
                {lastCloudSync ? `Guardado ${lastCloudSync}` : 'BD Conectada'}
              </span>
            </>
          ) : (
            <>
              <Cloud className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-amber-300">Modo Local</span>
            </>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0">
          {/* Mobile Search Button (<md) */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-xl bg-[#141525] hover:bg-[#2C2E53] text-[#D4AF37] border border-[#2C2E53] transition shadow-inner shrink-0"
            title="Buscar en todo el sistema (Ctrl+K)"
            aria-label="Buscar"
          >
            <Search className="w-4 h-4" />
          </button>

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
              className="flex items-center gap-1 sm:gap-1.5 bg-[#2C2E53] hover:bg-[#353866] text-white px-2 sm:px-2.5 py-1.5 rounded-xl border border-[#414474] text-xs font-bold transition whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="hidden sm:inline">Lapso </span><span className="sm:hidden text-[11px]">L</span><span className="text-[11px] sm:text-xs">{activeLapso}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
            {lapsoMenuOpen && (
              <>
                <div
                  className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 sm:hidden"
                  onClick={() => setLapsoMenuOpen(false)}
                />
                <div className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-full mt-1 w-52 sm:w-48 bg-[#1B1C33] border border-[#414474] rounded-2xl sm:rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 mb-1 border-b border-[#2C2E53] text-[10px] font-black uppercase text-amber-300 tracking-wider">
                    Seleccionar Lapso
                  </div>
                  {[1, 2, 3].map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setActiveLapso(l as 1 | 2 | 3);
                        setLapsoMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl sm:rounded-lg text-xs font-bold transition ${
                        activeLapso === l
                          ? 'bg-[#2C2E53] text-[#D4AF37] border border-[#D4AF37]/30'
                          : 'text-slate-300 hover:bg-[#2C2E53]/50'
                      }`}
                    >
                      <span>{l}° Lapso {l === 1 ? '(En Curso)' : ''}</span>
                      {activeLapso === l && <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User Profile & Role Selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 bg-[#2C2E53] hover:bg-[#353866] text-white px-2 sm:px-2.5 py-1.5 rounded-xl border border-[#414474] text-xs font-bold transition whitespace-nowrap"
              title={`Usuario: ${currentUser?.fullName || currentUser?.username || 'Usuario'} • Rol: ${currentRole}`}
            >
              {(() => {
                const avatarSrc = currentUser?.avatarUrl || (currentUser ? getDefaultAvatarForUser(currentUser) : '');
                return avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={currentUser?.fullName || 'Avatar'}
                    className="w-5 h-5 rounded-full object-contain border border-[#D4AF37]/50 shrink-0 bg-white"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[10px] text-[#D4AF37] font-black shrink-0">
                    {(currentUser?.fullName?.[0] || currentRole[0] || 'U').toUpperCase()}
                  </div>
                );
              })()}
              {(() => {
                const rawName = currentUser?.fullName?.trim() || currentUser?.username || currentRole;
                const firstName = rawName.split(' ')[0] || rawName;
                return (
                  <span className="inline max-w-[120px] sm:max-w-[140px] truncate uppercase font-extrabold tracking-wide">
                    {firstName}
                  </span>
                );
              })()}
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
            {roleMenuOpen && (
              <>
                <div
                  className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 sm:hidden"
                  onClick={() => setRoleMenuOpen(false)}
                />
                <div className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-full mt-1 w-[calc(100vw-24px)] max-w-sm sm:w-64 max-h-[85vh] overflow-y-auto bg-[#1B1C33] border border-[#414474] rounded-2xl sm:rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-[#2C2E53] mb-1.5 flex items-center gap-2.5">
                    {(() => {
                      const avatarSrc = currentUser?.avatarUrl || (currentUser ? getDefaultAvatarForUser(currentUser) : '');
                      return avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt={currentUser?.fullName || 'Avatar'}
                          className="w-8 h-8 rounded-xl object-contain border border-[#D4AF37]/50 shrink-0 bg-white"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-[#2C2E53] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center font-bold text-xs shrink-0">
                          {(currentUser?.fullName?.[0] || currentRole[0] || 'U').toUpperCase()}
                        </div>
                      );
                    })()}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">
                        {currentUser?.fullName || 'Usuario CBA'}
                      </p>
                      <p className="text-[10px] font-mono text-[#D4AF37] truncate">
                        @{currentUser?.username || 'usuario'} • {currentRole}
                      </p>
                    </div>
                  </div>

                  {/* Acceso Directo a Mi Perfil */}
                  <div className="mb-1.5">
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        onNavigate?.('ESCRITORIO', 'PERFIL');
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-bold text-sky-300 hover:bg-sky-500/15 transition border border-transparent hover:border-sky-500/30"
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5" />
                        <span>Mi Perfil y Foto</span>
                      </span>
                      <span className="text-[10px] text-sky-400 font-mono">Editar →</span>
                    </button>
                  </div>

                  {currentUser?.role === 'ADMINISTRADOR' ? (
                    <>
                      <div className="px-3 py-1 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Simular Rol (Modo Admin)
                        </span>
                      </div>
                      {(['ADMINISTRADOR', 'DIRECTOR', 'COORDINACION', 'SECRETARIA', 'DOCENTE', 'ASISTENTE', 'REPRESENTANTE', 'ESTUDIANTE'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            setCurrentRole(r);
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            currentRole === r
                              ? 'bg-[#2C2E53] text-[#D4AF37]'
                              : 'text-slate-300 hover:bg-[#2C2E53]/50'
                          }`}
                        >
                          <span>{r}</span>
                          {currentRole === r && <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />}
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="px-3 py-2 bg-[#2C2E53]/40 rounded-lg text-[11px] text-slate-300 mb-1.5">
                      <span className="text-[#D4AF37] font-semibold block mb-0.5">Acceso Verificado</span>
                      Cuenta institucional CBA con permisos oficiales de <strong className="text-white">{currentRole}</strong>.
                    </div>
                  )}

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

      {/* Mobile Level Selector Bar (only when user has multiple allowed levels to switch between) */}
      {(() => {
        const userLevels = getUserAllowedLevels(currentRole, currentUser);
        if (userLevels.length <= 1) return null;

        return (
          <div className="lg:hidden px-2 py-1.5 border-t border-[#2C2E53] bg-[#141525] flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
            {userLevels.map((lvl) => {
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
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                    isSelected
                      ? 'bg-[#2C2E53] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{data.icon}</span>
                  <span>{lvl === 'MEDIA_GENERAL' ? 'Media Gen.' : lvl.replace('_', ' ')}</span>
                </button>
              );
            })}
          </div>
        );
      })()}
    </header>
  );
};
