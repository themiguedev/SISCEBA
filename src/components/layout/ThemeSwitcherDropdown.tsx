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
    currentTheme
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
        className="flex items-center gap-1.5 p-2 rounded-xl bg-[#2C2E53]/70 hover:bg-[#2C2E53] text-slate-300 hover:text-white transition border border-[#414474]/50 focus:outline-none"
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

          {/* 2. SECCIÓN: OTROS TEMAS / PALETAS DE COLOR */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Galería de Temas Estilizados:
            </span>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
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
