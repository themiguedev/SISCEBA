import React from 'react';
import {
  X,
  Eye,
  Sun,
  Moon,
  Laptop,
  Type,
  Contrast,
  Sparkles,
  ZapOff,
  RotateCcw,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { useTheme, FontSizeScale, ThemeMode } from '../../context/ThemeContext';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    mode,
    setMode,
    isDark,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    resetAccessibility
  } = useTheme();

  if (!isOpen) return null;

  const fontOptions: { id: FontSizeScale; label: string; desc: string; sample: string }[] = [
    {
      id: 'normal',
      label: 'Normal (100%)',
      desc: 'Tamaño estándar para visualización general',
      sample: 'Texto estándar CBA'
    },
    {
      id: 'large',
      label: 'Grande (110%)',
      desc: 'Recomendado para lectura cómoda y reducción de fatiga visual',
      sample: 'Texto ampliado +10%'
    },
    {
      id: 'extra-large',
      label: 'Extra Grande (122%)',
      desc: 'Máxima escala para facilitar la lectura a distancia o baja visión',
      sample: 'Texto grande +22%'
    }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white dark:bg-[#1B1C33] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#414474] flex flex-col max-h-[92vh] overflow-hidden z-10 animate-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#2C2E53] bg-slate-50/70 dark:bg-[#141525]/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-[#D4AF37] flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="accessibility-modal-title"
                className="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2"
              >
                <span>Accesibilidad & Ergonomía</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-800 dark:text-amber-300 font-extrabold border border-amber-400/30">
                  WCAG AAA
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ajuste el contraste, tamaño de texto y movimiento para una experiencia óptima.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2C2E53] transition cursor-pointer"
            title="Cerrar (Esc)"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-xs">
          {/* 1. Modo de Pantalla (Claro / Oscuro / Sistema) */}
          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Modo de Visualización</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMode('light')}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col gap-1.5 cursor-pointer ${
                  mode === 'light'
                    ? 'border-[#D4AF37] bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Sun className="w-4 h-4 text-amber-500" />
                  {mode === 'light' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
                </div>
                <span className="font-extrabold text-xs">Modo Claro</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Fondo blanco luminoso</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('dark')}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col gap-1.5 cursor-pointer ${
                  mode === 'dark'
                    ? 'border-[#D4AF37] bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  {mode === 'dark' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
                </div>
                <span className="font-extrabold text-xs">Modo Oscuro</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Reduce fatiga ocular</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('system')}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col gap-1.5 cursor-pointer ${
                  mode === 'system'
                    ? 'border-[#D4AF37] bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Laptop className="w-4 h-4 text-slate-500 dark:text-slate-300" />
                  {mode === 'system' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
                </div>
                <span className="font-extrabold text-xs">Automático</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Según sistema operativo</span>
              </button>
            </div>
          </div>

          {/* 2. Escala Tipográfica (Tamaño de Letra) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Escala Tipográfica Institucional</span>
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                Actual: {fontSize === 'extra-large' ? '+22%' : fontSize === 'large' ? '+10%' : '100%'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {fontOptions.map((opt) => {
                const isSelected = fontSize === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFontSize(opt.id)}
                    className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'border-[#D4AF37] bg-amber-500/10 text-amber-900 dark:text-amber-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs">{opt.label}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {opt.desc}
                    </p>
                    <div
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                      style={{
                        fontSize: opt.id === 'extra-large' ? '14px' : opt.id === 'large' ? '13px' : '12px'
                      }}
                    >
                      {opt.sample}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Conmutadores de Alto Contraste y Reducción de Animación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Alto Contraste */}
            <div
              onClick={() => setHighContrast(!highContrast)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                highContrast
                  ? 'border-[#D4AF37] bg-amber-500/10 text-amber-900 dark:text-amber-300 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Contrast className="w-4 h-4 text-indigo-500" />
                  <span className="font-extrabold text-xs">Alto Contraste</span>
                </div>
                {/* Switch UI */}
                <div
                  className={`w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    highContrast ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      highContrast ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Refuerza los bordes, intensifica textos atenuados y optimiza los contrastes cromáticos de acuerdo con WCAG AAA.
              </p>
            </div>

            {/* Reducción de Movimiento */}
            <div
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                reducedMotion
                  ? 'border-[#D4AF37] bg-amber-500/10 text-amber-900 dark:text-amber-300 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ZapOff className="w-4 h-4 text-rose-500" />
                  <span className="font-extrabold text-xs">Reducir Movimiento</span>
                </div>
                {/* Switch UI */}
                <div
                  className={`w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    reducedMotion ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      reducedMotion ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Deshabilita transiciones y animaciones decorativas para mayor rendimiento y evitar molestias visuales.
              </p>
            </div>
          </div>

          {/* 4. Atajos de Teclado Vinculados */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#141525] border border-slate-200 dark:border-[#2C2E53] space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-[#D4AF37]" />
              <span>Atajos Rápidos de Accesibilidad & Navegación</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px] font-bold">
                  Alt + A
                </kbd>
                <span className="text-slate-600 dark:text-slate-300 text-[10px]">Accesibilidad</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px] font-bold">
                  Alt + D
                </kbd>
                <span className="text-slate-600 dark:text-slate-300 text-[10px]">Modo Oscuro</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px] font-bold">
                  Alt + P
                </kbd>
                <span className="text-slate-600 dark:text-slate-300 text-[10px]">Cambiar Rol</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px] font-bold">
                  Alt + 1..9
                </kbd>
                <span className="text-slate-600 dark:text-slate-300 text-[10px]">Módulos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-[#2C2E53] bg-slate-50/70 dark:bg-[#141525]/60 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={resetAccessibility}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-[#2C2E53] transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Todo</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-black text-xs shadow-md border border-[#D4AF37]/40 transition cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Listo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
