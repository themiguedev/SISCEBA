import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode, ThemePalette } from '../../context/ThemeContext';
import {
  Sun,
  Moon,
  Laptop,
  Palette,
  CheckCircle2,
  Sliders,
  ChevronDown
} from 'lucide-react';

interface ThemeSwitcherDropdownProps {
  onOpenSettings?: () => void;
}

export const ThemeSwitcherDropdown: React.FC<ThemeSwitcherDropdownProps> = ({
  onOpenSettings
}) => {
  const {
    mode,
    setMode,
    palette,
    setPalette,
    isDark,
    themesCatalog,
    currentTheme,
    currentMonthConfig,
    activeMonthOverride,
    setMonthOverride,
    allMonthConfigs
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Botón Disparador en la Cabecera */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[32px] sm:min-h-[42px] px-2 sm:px-2.5 py-1 sm:py-2 rounded-xl bg-[#2C2E53]/70 hover:bg-[#2C2E53] active:scale-95 text-slate-300 hover:text-white transition-all border border-[#414474]/50 focus:outline-none flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shrink-0"
        title="Cambiar Tema y Apariencia (Modo Claro / Oscuro / Otros Temas)"
        aria-label="Selector de Tema"
      >
        <div className="relative">
          {isDark ? (
            <Moon className="w-4 h-4 text-[#D4AF37]" />
          ) : (
            <Sun className="w-4 h-4 text-[#D4AF37]" />
          )}
          {/* Indicador de paleta activa */}
          <span
            className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-[#1B1C33]"
            style={{ backgroundColor: currentTheme.accentColor }}
          />
        </div>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#D4AF37]' : ''
          }`}
        />
      </button>

      {/* Backdrop para cerrar en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Popover Desplegable */}
      {isOpen && (
        <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-96 max-h-[85vh] overflow-y-auto bg-[#1B1C33] border border-[#2C2E53] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 text-white space-y-4">
          {/* Cabecera del Popover */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#D4AF37]" />
              <h4 className="text-xs font-black tracking-wider uppercase">
                Apariencia del Sistema
              </h4>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
              {currentTheme.badge}
            </span>
          </div>

          {/* 1. SECCIÓN PRINCIPAL: MODO CLARO / OSCURO / SISTEMA */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Modo Principal:
            </span>
            <div className="grid grid-cols-3 gap-1.5 bg-[#141525] p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setMode('light')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                  mode === 'light'
                    ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Claro</span>
              </button>

              <button
                onClick={() => setMode('dark')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                  mode === 'dark'
                    ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Oscuro</span>
              </button>

              <button
                onClick={() => setMode('system')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                  mode === 'system'
                    ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Auto</span>
              </button>
            </div>
          </div>

          {/* 2. SECCIÓN: TEMÁTICA ESTACIONAL POR MES */}
          <div className="space-y-1.5 pt-1 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest block">
                Temática del Mes:
              </span>
              <span className="text-[10px] font-bold text-slate-300">
                {activeMonthOverride === null ? 'Modo Automático' : 'Manual'}
              </span>
            </div>

            {/* Current Active Seasonal Card */}
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl shrink-0">{currentMonthConfig.emoji}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white truncate">{currentMonthConfig.name}</span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${currentMonthConfig.badgeBg} ${currentMonthConfig.badgeText} ${currentMonthConfig.badgeBorder}`}>
                      {currentMonthConfig.seasonTitle}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{currentMonthConfig.ephemeris}</p>
                </div>
              </div>
              {activeMonthOverride !== null && (
                <button
                  type="button"
                  onClick={() => setMonthOverride(null)}
                  className="px-2 py-0.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-[10px] font-bold shrink-0 transition"
                  title="Volver a detección automática del mes actual"
                >
                  Auto
                </button>
              )}
            </div>

            {/* Quick Month Chips Carousel/Grid */}
            <div className="grid grid-cols-4 gap-1 pt-1">
              {allMonthConfigs.map((m) => {
                const isSelected = (activeMonthOverride === null && currentMonthConfig.month === m.month) || activeMonthOverride === m.month;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMonthOverride(m.month)}
                    className={`p-1.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#2C2E53] border-[#D4AF37] text-white shadow-xs ring-1 ring-[#D4AF37]'
                        : 'bg-[#141525]/60 hover:bg-[#141525] border-white/5 text-slate-400 hover:text-white'
                    }`}
                    title={`${m.name}: ${m.seasonTitle}`}
                  >
                    <span className="text-xs">{m.emoji}</span>
                    <span className="text-[9px] font-bold truncate max-w-full">{m.name.slice(0, 3)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. SECCIÓN: OTROS TEMAS / PALETAS DE COLOR */}
          <div className="space-y-1.5 pt-1 border-t border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Galería de Temas Estilizados:
            </span>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {themesCatalog.map((t) => {
                const isSelected = palette === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setPalette(t.id)}
                    className={`text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#2C2E53] border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]'
                        : 'bg-[#141525]/80 hover:bg-[#141525] border-white/10 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-sm">{t.emoji}</span>
                        <span className="text-xs font-bold truncate text-white">
                          {t.name}
                        </span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      )}
                    </div>

                    {/* Muestras de color (Chips) */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: t.primaryColor }}
                        title={`Color Primario: ${t.primaryColor}`}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: t.accentColor }}
                        title={`Color Acento: ${t.accentColor}`}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: isDark ? t.bgDark : t.bgLight }}
                        title="Fondo"
                      />
                      <span className="text-[9px] text-slate-400 ml-auto font-semibold">
                        {t.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pie del Popover */}
          {onOpenSettings && (
            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[11px]">
              <span className="text-slate-400">¿Desea explorar más?</span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenSettings();
                }}
                className="text-[#D4AF37] hover:underline font-bold flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                <span>Configurar en detalle</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
