import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Keyboard,
  Search,
  Terminal,
  Compass,
  Monitor,
  Moon,
  Printer,
  Sparkles,
  Users,
  WifiOff,
  Grid,
  FileCode,
  RotateCcw,
  Layers
} from 'lucide-react';

interface ShortcutItem {
  keys: string[];
  title: string;
  description: string;
  category: string;
  isDev?: boolean;
}

const SHORTCUTS_DATA: ShortcutItem[] = [
  // Accesibilidad y Apariencia
  {
    keys: ['Alt', 'A'],
    title: 'Accesibilidad & Ergonomía',
    description: 'Abre el panel visual para ajustar escala tipográfica (100%-122%), alto contraste WCAG AAA y reducción de movimiento.',
    category: 'Accesibilidad'
  },
  {
    keys: ['Alt', 'D'],
    title: 'Modo Oscuro / Claro',
    description: 'Alterna el tema visual al instante entre modo diurno y nocturno.',
    category: 'Accesibilidad'
  },
  {
    keys: ['Alt', 'T'],
    title: 'Rotar Paleta Institucional',
    description: 'Cicla entre las paletas oficiales (CBA Institucional, Esmeralda, Borgoña, Caribe, Sepia, Medianoche).',
    category: 'Accesibilidad'
  },

  // Perfiles de Usuario
  {
    keys: ['Alt', 'P'],
    title: 'Conmutador de Perfil / Rol Activo',
    description: 'Alterna rápidamente el rol de operación en cuentas con roles múltiples (ej. Docente ↔ Representante, o Director ↔ Docente).',
    category: 'Perfiles'
  },

  // Navegación de Módulos (1 al 9)
  {
    keys: ['Alt', '1'],
    title: 'Escritorio / Dashboard',
    description: 'Regresa a la vista principal y panel de control general.',
    category: 'Navegación'
  },
  {
    keys: ['Alt', '2'],
    title: 'Gestión Escolar',
    description: 'Pases, inasistencias, conductas, matrículas y usuarios.',
    category: 'Navegación'
  },
  {
    keys: ['Alt', '3'],
    title: 'Educación Inicial',
    description: 'Planificación quincenal y evaluación cualitativa de salas 3, 4 y 5 años.',
    category: 'Navegación'
  },
  {
    keys: ['Alt', '4'],
    title: 'Educación Primaria',
    description: 'Proyectos de aprendizaje y evaluación cualitativa/formativa (1° a 6° Grado).',
    category: 'Navegación'
  },
  {
    keys: ['Alt', '5'],
    title: 'Media General',
    description: 'Planes de lapso y evaluación vigesimal (01-20) de bachillerato (1° a 5° Año).',
    category: 'Navegación'
  },
  {
    keys: ['Alt', '6'],
    title: 'Consultas y Reportes',
    description: 'Sábanas de calificaciones, estadísticas académicas y nóminas.',
    category: 'Navegación'
  },
  {
    keys: ['Alt', '7'],
    title: 'Comunidad CBA',
    description: 'Noticias con temáticas de efemérides, comunicados y cartelera.',
    category: 'Navegación'
  },
  {
    keys: ['Alt', '8'],
    title: 'Configuración',
    description: 'Apertura de lapsos, parámetros institucionales y temas.',
    category: 'Navegación'
  },
  {
    keys: ['Alt', '9'],
    title: 'Manual & Mapa del Sitio',
    description: 'Guía interactiva de uso del sistema y directorio completo.',
    category: 'Navegación'
  },

  // Utilidades y Acciones Rápidas
  {
    keys: ['?', 'Shift + ?'],
    title: 'Centro de Atajos',
    description: 'Despliega este modal interactivo con buscador y la guía completa de teclas.',
    category: 'Ayuda'
  },
  {
    keys: ['Ctrl', 'K'],
    title: 'Buscador Global (Spotlight)',
    description: 'Enfoca la barra de búsqueda universal para localizar estudiantes, materias o secciones.',
    category: 'Acciones'
  },
  {
    keys: ['/'],
    title: 'Búsqueda Rápida',
    description: 'Enfoca inmediatamente la búsqueda cuando no estás en un campo de texto.',
    category: 'Acciones'
  },
  {
    keys: ['Alt', 'B'],
    title: 'Colapsar Barra Lateral',
    description: 'Oculta o expande el menú lateral para mayor amplitud en pantalla.',
    category: 'Navegación'
  },
  {
    keys: ['Ctrl', 'P'],
    title: 'Imprimir / Generar PDF',
    description: 'Prepara actas, boletines o la vista actual para impresión y exportación.',
    category: 'Acciones'
  },
  {
    keys: ['Escape'],
    title: 'Cerrar Diálogos',
    description: 'Cierra cualquier modal o panel flotante abierto inmediatamente.',
    category: 'Acciones'
  }
];

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredShortcuts = SHORTCUTS_DATA.filter((s) => {
    if (currentRole === 'REPRESENTANTE' && s.keys.includes('P') && s.keys.includes('Ctrl')) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.keys.join(' ').toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-[#151A23] w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-[#2C2E53] px-6 py-5 text-white flex items-center justify-between border-b border-[#414474]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-bold shadow-sm">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-wide text-white flex items-center gap-2">
                Atajos de Teclado del Sistema
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold border border-[#D4AF37]/30 uppercase tracking-widest">
                  SICE-CBA
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Guía rápida de combinaciones de teclas para agilizar su trabajo en la plataforma.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title="Cerrar (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar atajo por acción, tecla o módulo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 shadow-inner"
            />
          </div>
        </div>

        {/* Shortcuts List Content */}
        <div className="p-5 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 space-y-3">
          {filteredShortcuts.length === 0 ? (
            <div className="py-10 text-center text-slate-400 dark:text-slate-500">
              <Compass className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">No se encontraron atajos para "{searchQuery}"</p>
            </div>
          ) : (
            filteredShortcuts.map((shortcut, idx) => (
              <div
                key={idx}
                className="pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#2C2E53] dark:group-hover:text-[#D4AF37] transition-colors">
                      {shortcut.title}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {shortcut.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {shortcut.description}
                  </p>
                </div>

                {/* Key Combination Badges */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  {shortcut.keys.map((key, kIdx) => (
                    <React.Fragment key={kIdx}>
                      <kbd className="px-2 py-1 rounded-lg text-[11px] font-mono font-black bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-xs min-w-[24px] text-center">
                        {key}
                      </kbd>
                      {kIdx < shortcut.keys.length - 1 && (
                        <span className="text-xs text-slate-400 font-bold">+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Tips */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Tip: Los atajos de una sola tecla quedan inactivos mientras escribe en cuadros de texto o notas.
          </span>
          <kbd className="hidden sm:inline-block px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
            Esc para salir
          </kbd>
        </div>
      </div>
    </div>
  );
};
