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
  ArrowLeftRight,
  Briefcase,
  Users,
  Eye
} from 'lucide-react';
import { SeasonalAccessoryIcon } from '../auth/LogoSeasonalAccessory';
import { ThemeSwitcherDropdown } from './ThemeSwitcherDropdown';
import { NotificationCenterPopover } from '../notifications/NotificationCenterPopover';
import { MainNavigationTab } from '../../types';
import { getDefaultAvatarForUser } from '../../utils/avatarCatalog';
import {
  hasTabAccess,
  getUserAllowedLevels,
  getUserEffectiveRoles,
  getDefaultTabForRole,
  isStaffWithRepresentativeRole,
  getStaffRoleForUser,
  ROLE_METADATA
} from '../../utils/rbac';
import { useTheme } from '../../context/ThemeContext';

interface ModernHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  onOpenSearch: () => void;
  onOpenShortcuts?: () => void;
  onOpenAccessibility?: () => void;
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
  onOpenAccessibility,
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
    switchActiveRole,
    activeLapso,
    setActiveLapso,
    logout,
    currentUser
  } = useApp();

  const { currentMonthConfig } = useTheme();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [lapsoMenuOpen, setLapsoMenuOpen] = useState(false);

  // Soporte generalizado para cuentas con perfiles múltiples (Multi-Role)
  const userEffectiveRoles = getUserEffectiveRoles(currentUser);
  const hasMultipleRoles = userEffectiveRoles.length > 1;

  const handleSwitchRole = (newRole: UserRole) => {
    switchActiveRole(newRole);
    setRoleMenuOpen(false);
    if (!hasTabAccess(newRole, activeTab as MainNavigationTab)) {
      if (newRole === 'REPRESENTANTE' || newRole === 'ESTUDIANTE') {
        onNavigate?.('CONSULTAS', 'RENDIMIENTO');
      } else {
        const defaultTab = getDefaultTabForRole(newRole);
        onNavigate?.(defaultTab);
      }
    }
  };

  const levelDetails: Record<
    EducationalLevel,
    { label: string; sub: string; icon: string; badge: string; color: string }
  > = {
    INICIAL: {
      label: 'Educación Inicial',
      sub: 'Salas 3, 4 y 5 Años',
      icon: '🧸',
      badge: '',
      color: 'from-amber-500 to-orange-500'
    },
    PRIMARIA: {
      label: 'Educación Primaria',
      sub: '1° a 6° Grado',
      icon: '🎒',
      badge: '',
      color: 'from-emerald-500 to-teal-500'
    },
    MEDIA_GENERAL: {
      label: 'Media General',
      sub: '1° a 5° Año',
      icon: '🎓',
      badge: '',
      color: 'from-blue-500 to-indigo-500'
    }
  };

  return (
    <header className="w-full bg-[#1B1C33] border-b border-[#2C2E53] sticky top-0 z-50 text-white shadow-xl backdrop-blur-md isolate">
      {/* Top Main Command Bar */}
      <div className="max-w-[1700px] mx-auto px-2.5 sm:px-4 lg:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 lg:gap-3">
        {/* Left: Sidebar Toggle & Brand Crest */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="min-h-[34px] min-w-[34px] sm:min-h-[42px] sm:min-w-[42px] p-1.5 sm:p-2.5 rounded-xl bg-[#2C2E53]/70 hover:bg-[#2C2E53] active:scale-95 text-slate-300 hover:text-white transition-all border border-[#414474]/50 focus:outline-none flex items-center justify-center shrink-0 cursor-pointer"
            title="Alternar Menú Lateral"
            aria-label="Abrir menú de navegación"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Institutional Logo Button - Click to return to Home */}
          <button
            type="button"
            onClick={onGoHome}
            className="min-h-[36px] sm:min-h-[42px] relative flex items-center justify-center shrink-0 group focus:outline-none transition-all duration-200 cursor-pointer p-0.5 sm:p-1.5 rounded-xl hover:bg-white/5 active:scale-95"
            title="Ir a la página principal (Inicio)"
            aria-label="Ir al inicio"
          >
            <div className="relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-200">
              <img
                src={`${import.meta.env.BASE_URL}logo-cba.png`}
                alt="Colegio Bellas Artes"
                width="32"
                height="32"
                decoding="async"
                className="h-6 sm:h-9 w-auto object-contain brightness-0 invert drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
              />
              {/* Accesorio Estacional / Temático del Mes sincronizado sobre el logo */}
              <SeasonalAccessoryIcon
                sizeClass="w-4 h-4 sm:w-5 sm:h-5"
                className="-top-1.5 -right-2 sm:-top-2 sm:-right-2.5 z-10"
                monthIndex={currentMonthConfig.month}
              />
            </div>
          </button>

          {/* Title SICE-CBA & Seasonal Month Badge */}
          <div className="hidden sm:flex flex-col justify-center shrink-0 select-none cursor-default">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs sm:text-base tracking-wider text-white whitespace-nowrap">
                SICE-CBA
              </span>
              <span
                className={`hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-wider ${currentMonthConfig.badgeBg} ${currentMonthConfig.badgeText} ${currentMonthConfig.badgeBorder}`}
                title={`Temática del Mes: ${currentMonthConfig.name} - ${currentMonthConfig.seasonTitle}`}
              >
                <span>{currentMonthConfig.emoji}</span>
                <span>{currentMonthConfig.name}</span>
              </span>
            </div>
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
              </button>
            );
          }

          // Para roles no pedagógicos (SECRETARIA, REPRESENTANTE, ESTUDIANTE)
          return (
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141525] border border-[#D4AF37]/50 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shrink-0"></span>
              <span className="text-xs font-black text-[#D4AF37] tracking-wider uppercase">
                {currentRole === 'SECRETARIA'
                  ? 'Secretaría • Asistencia y Conducta'
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

        {/* Right: Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0">
          {/* Mobile Search Button (<md) */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="md:hidden min-h-[32px] min-w-[32px] p-1.5 rounded-xl bg-[#141525] hover:bg-[#2C2E53] active:scale-95 text-[#D4AF37] border border-[#2C2E53] transition-all shadow-inner flex items-center justify-center shrink-0 cursor-pointer"
            title="Buscar en todo el sistema (Ctrl+K)"
            aria-label="Buscar"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Keyboard Shortcuts Trigger Button */}
          {onOpenShortcuts && (
            <button
              type="button"
              onClick={onOpenShortcuts}
              className="hidden sm:flex min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] p-2 sm:p-2.5 rounded-xl bg-[#141525] hover:bg-[#2C2E53] active:scale-95 text-[#D4AF37] border border-[#2C2E53] transition-all shadow-inner items-center justify-center shrink-0 cursor-pointer"
              title="Atajos de Teclado del Sistema (Presiona ?)"
              aria-label="Atajos de Teclado"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          )}

          {/* Accessibility Settings Trigger Button */}
          {onOpenAccessibility && (
            <button
              type="button"
              onClick={onOpenAccessibility}
              className="hidden sm:flex min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] p-2 sm:p-2.5 rounded-xl bg-[#141525] hover:bg-[#2C2E53] active:scale-95 text-[#D4AF37] border border-[#2C2E53] transition-all shadow-inner items-center justify-center shrink-0 cursor-pointer"
              title="Accesibilidad & Ergonomía Visual (Alt+A)"
              aria-label="Accesibilidad"
            >
              <Eye className="w-4 h-4" />
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
              className="min-h-[32px] sm:min-h-[40px] flex items-center gap-1 sm:gap-1.5 bg-[#2C2E53] hover:bg-[#353866] active:scale-95 text-white px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border border-[#414474] text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
              aria-label="Selector de Lapso"
            >
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] shrink-0" />
              <span className="hidden sm:inline">Lapso </span><span className="sm:hidden text-[11px] font-extrabold text-amber-300">L</span><span className="text-[11px] sm:text-xs">{activeLapso}</span>
              <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
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
                      className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2.5 rounded-xl sm:rounded-lg text-xs font-bold transition ${
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

          {/* Quick Active Role / Profile Switcher Pill */}
          {hasMultipleRoles && (
            <button
              type="button"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="hidden md:flex min-h-[32px] sm:min-h-[40px] items-center gap-1.5 px-2.5 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-indigo-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 border border-[#D4AF37]/50 text-white text-xs font-black transition-all shadow-xs cursor-pointer group shrink-0"
              title={`Rol Activo: ${ROLE_METADATA[currentRole]?.label || currentRole}. Clic o Alt+P para alternar perfil.`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:rotate-180 transition-transform duration-300 shrink-0" />
              <span className="text-[10px] uppercase tracking-wider text-slate-300 font-extrabold hidden lg:inline">Perfil:</span>
              <span className="text-amber-300 font-black">{currentRole}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400/30 text-amber-200 border border-amber-400/40 font-mono">
                {userEffectiveRoles.length}
              </span>
            </button>
          )}

          {/* User Profile & Role Selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="min-h-[32px] sm:min-h-[40px] flex items-center gap-1 sm:gap-1.5 bg-[#2C2E53] hover:bg-[#353866] active:scale-95 text-white px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border border-[#414474] text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
              title={`Usuario: ${currentUser?.fullName || currentUser?.username || 'Usuario'} • Rol: ${currentRole}`}
              aria-label="Menú de Usuario y Rol"
            >
              {(() => {
                const avatarSrc = currentUser?.avatarUrl || (currentUser ? getDefaultAvatarForUser(currentUser) : '');
                return avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={currentUser?.fullName || 'Avatar'}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-contain border border-[#D4AF37]/50 shrink-0 bg-white"
                  />
                ) : (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[10px] text-[#D4AF37] font-black shrink-0">
                    {(currentUser?.fullName?.[0] || currentRole[0] || 'U').toUpperCase()}
                  </div>
                );
              })()}
              {(() => {
                const rawName = currentUser?.fullName?.trim() || currentUser?.username || currentRole;
                const firstName = rawName.split(' ')[0] || rawName;
                return (
                  <span className="hidden md:inline max-w-[100px] lg:max-w-[130px] truncate uppercase font-extrabold tracking-wide">
                    {firstName}
                  </span>
                );
              })()}
              <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
            </button>
            {roleMenuOpen && (
              <>
                <div
                  className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 sm:hidden"
                  onClick={() => setRoleMenuOpen(false)}
                />
                <div className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-full mt-1 w-[calc(100vw-24px)] max-w-sm sm:w-72 max-h-[85vh] overflow-y-auto bg-[#1B1C33] border border-[#414474] rounded-2xl sm:rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
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
                      {currentUser?.roles && currentUser.roles.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30 whitespace-nowrap">
                            Rol Principal: {currentUser.role}
                          </span>
                          {currentUser.roles.map(r => (
                            <span key={r} className="text-[9px] px-1.5 py-0.5 rounded bg-sky-400/20 text-sky-300 font-bold border border-sky-400/30 whitespace-nowrap">
                              + {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acceso Directo a Mi Perfil y Mi Horario */}
                  <div className="space-y-1 mb-1.5">
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        onNavigate?.('ESCRITORIO', 'PERFIL');
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-bold text-sky-300 hover:bg-sky-500/15 transition border border-transparent hover:border-sky-500/30"
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5" />
                        <span>Mi Perfil</span>
                      </span>
                      <span className="text-[10px] text-sky-400 font-mono">Editar →</span>
                    </button>
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        onNavigate?.('ESCRITORIO', 'HORARIO');
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-bold text-amber-300 hover:bg-amber-500/15 transition border border-transparent hover:border-amber-500/30"
                    >
                      <span className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Mi Horario de Clases</span>
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono">Ver →</span>
                    </button>
                  </div>

                  {currentUser?.role === 'ADMINISTRADOR' ? (
                    <div className="space-y-1.5 pt-1">
                      {currentRole !== 'ADMINISTRADOR' && (
                        <div className="p-2.5 mb-2 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between gap-2 shadow-inner">
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-300 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                              Simulando Rol
                            </span>
                            <span className="text-[11px] font-bold text-white truncate block">
                              {ROLE_METADATA[currentRole]?.label || currentRole}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSwitchRole('ADMINISTRADOR')}
                            className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black shrink-0 transition cursor-pointer shadow-sm active:scale-95"
                          >
                            Restablecer
                          </button>
                        </div>
                      )}

                      <div className="px-2 py-1 mb-0.5 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5 truncate">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">Simular Rol (Modo Admin)</span>
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30 whitespace-nowrap shrink-0">
                          7 Roles
                        </span>
                      </div>

                      {(['ADMINISTRADOR', 'DIRECTOR', 'COORDINACION', 'SECRETARIA', 'DOCENTE', 'REPRESENTANTE', 'ESTUDIANTE'] as UserRole[]).map((r) => {
                        const meta = ROLE_METADATA[r];
                        const isSelected = currentRole === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => handleSwitchRole(r)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#2C2E53] text-[#D4AF37] border border-[#D4AF37]/50 shadow-sm'
                                : 'text-slate-300 hover:bg-[#2C2E53]/50 hover:text-white border border-transparent'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold truncate">{meta?.label || r}</span>
                                {r === 'ADMINISTRADOR' && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-400/20 text-purple-300 font-bold whitespace-nowrap">
                                    Nativo
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 block truncate font-mono">
                                {r}
                              </span>
                            </div>
                            {isSelected && <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  ) : hasMultipleRoles ? (
                    <div className="space-y-2 mb-2 p-2.5 rounded-xl bg-gradient-to-br from-[#141525] to-[#242646] border border-[#D4AF37]/40 shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-wider flex items-center gap-1.5">
                          <ArrowLeftRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                          Conmutador de Perfiles ({userEffectiveRoles.length})
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                          Multi-Rol
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-300 leading-tight">
                        Seleccione el rol operativo de trabajo para alternar permisos en tiempo real:
                      </p>

                      <div className="space-y-1 pt-1">
                        {userEffectiveRoles.map((role) => {
                          const meta = ROLE_METADATA[role];
                          const isActive = currentRole === role;
                          return (
                            <button
                              key={role}
                              type="button"
                              onClick={() => handleSwitchRole(role)}
                              className={`w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                                isActive
                                  ? 'bg-[#2C2E53] border-[#D4AF37] text-white shadow-md ring-1 ring-[#D4AF37]/50'
                                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold truncate">
                                    {meta?.label || role}
                                  </span>
                                  {isActive && (
                                    <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded bg-[#D4AF37] text-slate-950">
                                      Activo
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] text-slate-400 truncate block">
                                  {meta?.scope || meta?.description}
                                </span>
                              </div>
                              {isActive ? (
                                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                              ) : (
                                <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
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
        </div>
      </div>

      {/* Mobile Level Selector Bar (only when user has multiple allowed levels to switch between) */}
      {(() => {
        const userLevels = getUserAllowedLevels(currentRole, currentUser);
        if (userLevels.length <= 1) return null;

        return (
          <div className="lg:hidden px-3 py-1.5 border-t border-[#2C2E53] bg-[#141525]/95 backdrop-blur-md flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar shadow-inner">
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
                  className={`flex-1 min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-[#2C2E53] text-[#F5C842] border border-[#D4AF37]/50 shadow-md ring-1 ring-[#D4AF37]/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="text-sm">{data.icon}</span>
                  <span className="tracking-wide">{lvl === 'MEDIA_GENERAL' ? 'Media Gen.' : lvl.replace('_', ' ')}</span>
                </button>
              );
            })}
          </div>
        );
      })()}
    </header>
  );
};
