import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemePalette =
  | 'cba-classic'
  | 'emerald'
  | 'burgundy'
  | 'caribbean'
  | 'warm-sepia'
  | 'midnight';

export interface ThemeDefinition {
  id: ThemePalette;
  name: string;
  category: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgLight: string;
  bgDark: string;
  badge: string;
  emoji: string;
  accentTextLight: string;
  accentTextDark: string;
}

export const THEMES_CATALOG: ThemeDefinition[] = [
  {
    id: 'cba-classic',
    name: 'CBA Institucional',
    category: 'Oficial',
    description: 'Paleta oficial del Colegio Bellas Artes con Azul Marino Imperial y Oro Ateniense calibrado.',
    primaryColor: '#2C2E53',
    secondaryColor: '#1B1C33',
    accentColor: '#D4AF37',
    bgLight: '#F8FAFC',
    bgDark: '#0D0F18',
    badge: 'Institucional',
    emoji: '🏛️',
    accentTextLight: '#9A6F00',
    accentTextDark: '#F5C842'
  },
  {
    id: 'emerald',
    name: 'Esmeralda Pedagógico',
    category: 'Naturaleza & Crecimiento',
    description: 'Tonos bosque y menta energizante, orientados a la serenidad y la concentración docente.',
    primaryColor: '#064E3B',
    secondaryColor: '#022C22',
    accentColor: '#10B981',
    bgLight: '#F0FDF4',
    bgDark: '#051A14',
    badge: 'Naturaleza',
    emoji: '🌲',
    accentTextLight: '#047857',
    accentTextDark: '#34D399'
  },
  {
    id: 'burgundy',
    name: 'Borgoña Solemne',
    category: 'Académico & Tradición',
    description: 'Vino tinto clásico y acentos de ámbar dorado para una estética solemne y humanista.',
    primaryColor: '#581C28',
    secondaryColor: '#370F18',
    accentColor: '#F59E0B',
    bgLight: '#FFF1F2',
    bgDark: '#1C080D',
    badge: 'Solemne',
    emoji: '🍷',
    accentTextLight: '#B45309',
    accentTextDark: '#FBBF24'
  },
  {
    id: 'caribbean',
    name: 'Zulianidad & Océano',
    category: 'Regional & Fresco',
    description: 'Inspirado en el Lago de Maracaibo, el sol zuliano y la frescura del Caribe.',
    primaryColor: '#0C4A6E',
    secondaryColor: '#082F49',
    accentColor: '#38BDF8',
    bgLight: '#F0F9FF',
    bgDark: '#071622',
    badge: 'Regional',
    emoji: '🌊',
    accentTextLight: '#0284C7',
    accentTextDark: '#38BDF8'
  },
  {
    id: 'warm-sepia',
    name: 'Sepia & Manuscrito',
    category: 'Lectura & Ergonomía',
    description: 'Tonos papiro suave y marrón ateneo, diseñado para reducir la fatiga visual prolongada.',
    primaryColor: '#4A3B32',
    secondaryColor: '#332720',
    accentColor: '#C28B56',
    bgLight: '#FAF7F2',
    bgDark: '#181411',
    badge: 'Lectura',
    emoji: '☕',
    accentTextLight: '#92400E',
    accentTextDark: '#FBBF24'
  },
  {
    id: 'midnight',
    name: 'Medianoche & Neón',
    category: 'Alta Tecnología',
    description: 'Grafito profundo, índigo galáctico y detalles en lavanda neón de alto contraste.',
    primaryColor: '#1E1B4B',
    secondaryColor: '#0F0E2A',
    accentColor: '#818CF8',
    bgLight: '#EEF2FF',
    bgDark: '#090818',
    badge: 'Cyber',
    emoji: '🌌',
    accentTextLight: '#4338CA',
    accentTextDark: '#A5B4FC'
  }
];

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  palette: ThemePalette;
  setPalette: (palette: ThemePalette) => void;
  isDark: boolean;
  toggleMode: () => void;
  themesCatalog: ThemeDefinition[];
  currentTheme: ThemeDefinition;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_MODE_KEY = 'sisceba_theme_mode';
const STORAGE_PALETTE_KEY = 'sisceba_theme_palette';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Estado inicial del Modo (Claro / Oscuro / Sistema)
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MODE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch (e) {
      // Ignorar error de storage
    }
    return 'light';
  });

  // 2. Estado inicial de la Paleta de Color
  const [palette, setPaletteState] = useState<ThemePalette>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PALETTE_KEY);
      if (
        saved === 'cba-classic' ||
        saved === 'emerald' ||
        saved === 'burgundy' ||
        saved === 'caribbean' ||
        saved === 'warm-sepia' ||
        saved === 'midnight'
      ) {
        return saved;
      }
    } catch (e) {
      // Ignorar error de storage
    }
    return 'cba-classic';
  });

  // 3. Detección de tema del sistema
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const isDark = useMemo(() => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return systemIsDark;
  }, [mode, systemIsDark]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_MODE_KEY, newMode);
    } catch (e) {
      // Ignorar
    }
  };

  const setPalette = (newPalette: ThemePalette) => {
    setPaletteState(newPalette);
    try {
      localStorage.setItem(STORAGE_PALETTE_KEY, newPalette);
    } catch (e) {
      // Ignorar
    }
  };

  const toggleMode = () => {
    if (isDark) {
      setMode('light');
    } else {
      setMode('dark');
    }
  };

  // 4. Sincronización con el DOM (clase dark y atributos data-theme y variables CSS)
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.setAttribute('data-theme', palette);
    root.setAttribute('data-mode', isDark ? 'dark' : 'light');

    const themeDef = THEMES_CATALOG.find((t) => t.id === palette) || THEMES_CATALOG[0];
    root.style.setProperty('--theme-primary', themeDef.primaryColor);
    root.style.setProperty('--theme-secondary', themeDef.secondaryColor);
    root.style.setProperty('--theme-accent', themeDef.accentColor);
    root.style.setProperty('--theme-accent-text-light', themeDef.accentTextLight);
    root.style.setProperty('--theme-accent-text-dark', themeDef.accentTextDark);
    root.style.setProperty('--theme-bg-light', themeDef.bgLight);
    root.style.setProperty('--theme-bg-dark', themeDef.bgDark);
  }, [isDark, palette]);

  const currentTheme = useMemo(() => {
    return THEMES_CATALOG.find((t) => t.id === palette) || THEMES_CATALOG[0];
  }, [palette]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        palette,
        setPalette,
        isDark,
        toggleMode,
        themesCatalog: THEMES_CATALOG,
        currentTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};
