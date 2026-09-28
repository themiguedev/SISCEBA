export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface MonthSeasonalConfig {
  month: MonthIndex;
  key: string;
  name: string;
  seasonTitle: string;
  ephemeris: string;
  emoji: string;
  bannerGradient: string;
  bannerGradientDark: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentColor: string;
  accentGlow: string;
  greetingMessage: string;
  subtlePatternCss?: string;
  floatingDecorations: {
    icon: string;
    label: string;
    opacity: number;
  }[];
}

export const MONTH_SEASONAL_CONFIGS: Record<MonthIndex, MonthSeasonalConfig> = {
  0: {
    month: 0,
    key: 'enero_reyes',
    name: 'Enero',
    seasonTitle: 'Año Nuevo & Reyes',
    ephemeris: 'Día de Reyes & Inicio del 2do Lapso',
    emoji: '✨',
    bannerGradient: 'from-amber-500/15 via-sky-500/10 to-indigo-500/15',
    bannerGradientDark: 'from-amber-500/25 via-sky-500/15 to-indigo-900/30',
    badgeBg: 'bg-amber-400/15 dark:bg-amber-400/25',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-400/30 dark:border-amber-400/40',
    accentColor: '#F59E0B',
    accentGlow: 'rgba(245, 158, 11, 0.25)',
    greetingMessage: '¡Bienvenido al nuevo año 2027! Éxitos y energía renovada en este segundo lapso.',
    floatingDecorations: [
      { icon: '⭐', label: 'Estrella de Reyes', opacity: 0.8 },
      { icon: '✨', label: 'Brillo festivo', opacity: 0.7 },
      { icon: '👑', label: 'Reyes Magos', opacity: 0.85 }
    ]
  },
  1: {
    month: 1,
    key: 'febrero_amistad',
    name: 'Febrero',
    seasonTitle: 'Juventud, Amistad & Carnaval',
    ephemeris: 'Día de la Juventud, San Valentín & Fiestas de Carnaval',
    emoji: '🎭',
    bannerGradient: 'from-pink-500/15 via-rose-500/10 to-amber-500/15',
    bannerGradientDark: 'from-pink-500/25 via-rose-500/15 to-purple-900/30',
    badgeBg: 'bg-pink-400/15 dark:bg-pink-400/25',
    badgeText: 'text-pink-700 dark:text-pink-300',
    badgeBorder: 'border-pink-400/30 dark:border-pink-400/40',
    accentColor: '#EC4899',
    accentGlow: 'rgba(236, 72, 153, 0.25)',
    greetingMessage: 'Mes del amor, la amistad sincera, la juventud y la alegría del Carnaval.',
    floatingDecorations: [
      { icon: '🎭', label: 'Máscara de Carnaval', opacity: 0.85 },
      { icon: '💖', label: 'Amistad y compañerismo', opacity: 0.8 },
      { icon: '🎉', label: 'Celebración escolar', opacity: 0.75 }
    ]
  },
  2: {
    month: 2,
    key: 'marzo_mujeres',
    name: 'Marzo',
    seasonTitle: 'Día de la Mujer & Agua',
    ephemeris: 'Día Internacional de la Mujer & Día Mundial del Agua',
    emoji: '🌷',
    bannerGradient: 'from-purple-500/15 via-fuchsia-500/10 to-teal-500/15',
    bannerGradientDark: 'from-purple-500/25 via-fuchsia-500/15 to-teal-900/30',
    badgeBg: 'bg-purple-400/15 dark:bg-purple-400/25',
    badgeText: 'text-purple-700 dark:text-purple-300',
    badgeBorder: 'border-purple-400/30 dark:border-purple-400/40',
    accentColor: '#A855F7',
    accentGlow: 'rgba(168, 85, 247, 0.25)',
    greetingMessage: 'Reconocimiento a nuestras docentes, madres, estudiantes y el valor del agua para la vida.',
    floatingDecorations: [
      { icon: '🌷', label: 'Flor primaveral', opacity: 0.85 },
      { icon: '💧', label: 'Cuidado del agua', opacity: 0.8 },
      { icon: '💜', label: 'Equidad y respeto', opacity: 0.75 }
    ]
  },
  3: {
    month: 3,
    key: 'abril_libro_tierra',
    name: 'Abril',
    seasonTitle: 'Mes del Libro & de la Tierra',
    ephemeris: 'Día Mundial de la Tierra & Día Internacional del Libro',
    emoji: '🌍',
    bannerGradient: 'from-emerald-500/15 via-teal-500/10 to-sky-500/15',
    bannerGradientDark: 'from-emerald-500/25 via-teal-500/15 to-emerald-900/30',
    badgeBg: 'bg-emerald-400/15 dark:bg-emerald-400/25',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-400/30 dark:border-emerald-400/40',
    accentColor: '#10B981',
    accentGlow: 'rgba(16, 185, 129, 0.25)',
    greetingMessage: 'Fomentamos la pasión por la lectura y el compromiso ecológico con nuestro planeta.',
    floatingDecorations: [
      { icon: '🌱', label: 'Brote verde', opacity: 0.85 },
      { icon: '📚', label: 'Pasión por la lectura', opacity: 0.8 },
      { icon: '🌍', label: 'Cuidado de la Tierra', opacity: 0.75 }
    ]
  },
  4: {
    month: 4,
    key: 'mayo_madres_trabajador',
    name: 'Mayo',
    seasonTitle: 'Día del Trabajador & Madres',
    ephemeris: 'Homenaje a las Madres CBA & Día del Trabajador',
    emoji: '🌸',
    bannerGradient: 'from-rose-500/15 via-amber-500/10 to-pink-500/15',
    bannerGradientDark: 'from-rose-500/25 via-amber-500/15 to-pink-900/30',
    badgeBg: 'bg-rose-400/15 dark:bg-rose-400/25',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-400/30 dark:border-rose-400/40',
    accentColor: '#F43F5E',
    accentGlow: 'rgba(244, 63, 94, 0.25)',
    greetingMessage: 'Gratitud a nuestras madres formadoras y al esfuerzo diario de todo nuestro personal.',
    floatingDecorations: [
      { icon: '🌸', label: 'Flor de mayo', opacity: 0.85 },
      { icon: '💐', label: 'Homenaje a madres', opacity: 0.8 },
      { icon: '🌟', label: 'Reconocimiento al trabajo', opacity: 0.75 }
    ]
  },
  5: {
    month: 5,
    key: 'junio_padres_ambiente',
    name: 'Junio',
    seasonTitle: 'Medio Ambiente & Día del Padre',
    ephemeris: 'Día Mundial del Medio Ambiente & Homenaje a los Padres',
    emoji: '🌿',
    bannerGradient: 'from-teal-500/15 via-emerald-500/10 to-amber-500/15',
    bannerGradientDark: 'from-teal-500/25 via-emerald-500/15 to-teal-900/30',
    badgeBg: 'bg-teal-400/15 dark:bg-teal-400/25',
    badgeText: 'text-teal-700 dark:text-teal-300',
    badgeBorder: 'border-teal-400/30 dark:border-teal-400/40',
    accentColor: '#14B8A6',
    accentGlow: 'rgba(20, 184, 166, 0.25)',
    greetingMessage: 'Consolidando proyectos de cierre pedagógico y honrando la figura paterna en el hogar.',
    floatingDecorations: [
      { icon: '🌿', label: 'Naturaleza viva', opacity: 0.85 },
      { icon: '👔', label: 'Homenaje a los padres', opacity: 0.8 },
      { icon: '🍃', label: 'Ecosistema escolar', opacity: 0.75 }
    ]
  },
  6: {
    month: 6,
    key: 'julio_graduacion',
    name: 'Julio',
    seasonTitle: 'Grados, Logros & Independencia',
    ephemeris: '5 de Julio, Cierre Escolar y Actos de Grado CBA',
    emoji: '🎓',
    bannerGradient: 'from-amber-500/15 via-yellow-500/10 to-blue-500/15',
    bannerGradientDark: 'from-amber-500/25 via-yellow-500/15 to-blue-900/30',
    badgeBg: 'bg-amber-400/15 dark:bg-amber-400/25',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-400/30 dark:border-amber-400/40',
    accentColor: '#D4AF37',
    accentGlow: 'rgba(212, 175, 55, 0.28)',
    greetingMessage: '¡Mes de graduaciones, títulos y celebración del éxito académico de nuestros estudiantes!',
    floatingDecorations: [
      { icon: '🎓', label: 'Birrete de grado', opacity: 0.9 },
      { icon: '📜', label: 'Título y diploma', opacity: 0.85 },
      { icon: '🏆', label: 'Excelencia académica', opacity: 0.8 }
    ]
  },
  7: {
    month: 7,
    key: 'agosto_vacaciones',
    name: 'Agosto',
    seasonTitle: 'Vacaciones & Planificación',
    ephemeris: 'Receso Escolar, Mantenimiento y Planificación Pedagógica',
    emoji: '☀️',
    bannerGradient: 'from-orange-500/15 via-amber-500/10 to-sky-500/15',
    bannerGradientDark: 'from-orange-500/25 via-amber-500/15 to-orange-900/30',
    badgeBg: 'bg-orange-400/15 dark:bg-orange-400/25',
    badgeText: 'text-orange-700 dark:text-orange-300',
    badgeBorder: 'border-orange-400/30 dark:border-orange-400/40',
    accentColor: '#F97316',
    accentGlow: 'rgba(249, 115, 22, 0.25)',
    greetingMessage: 'Tiempo de descanso familiar, adecuación del plantel y preparación del nuevo año académico.',
    floatingDecorations: [
      { icon: '☀️', label: 'Sol de verano', opacity: 0.85 },
      { icon: '🏖️', label: 'Descanso familiar', opacity: 0.8 },
      { icon: '🧭', label: 'Proyección y metas', opacity: 0.75 }
    ]
  },
  8: {
    month: 8,
    key: 'septiembre_regreso',
    name: 'Septiembre',
    seasonTitle: 'Inicio de Clases CBA',
    ephemeris: 'Apertura Oficial del Año Escolar 2026 - 2027',
    emoji: '🎒',
    bannerGradient: 'from-sky-500/15 via-indigo-500/10 to-amber-500/15',
    bannerGradientDark: 'from-sky-500/25 via-indigo-500/15 to-blue-900/30',
    badgeBg: 'bg-sky-400/15 dark:bg-sky-400/25',
    badgeText: 'text-sky-700 dark:text-sky-300',
    badgeBorder: 'border-sky-400/30 dark:border-sky-400/40',
    accentColor: '#0EA5E9',
    accentGlow: 'rgba(14, 165, 233, 0.25)',
    greetingMessage: '¡Bienvenidos al Año Escolar 2026-2027! Aulas llenas de entusiasmo, saberes y arte.',
    floatingDecorations: [
      { icon: '🎒', label: 'Mochila escolar', opacity: 0.85 },
      { icon: '✏️', label: 'Lápiz y cuaderno', opacity: 0.8 },
      { icon: '🔔', label: 'Campana escolar', opacity: 0.75 }
    ]
  },
  9: {
    month: 9,
    key: 'octubre_resistencia_otono',
    name: 'Octubre',
    seasonTitle: 'Resistencia Indígena & Otoño',
    ephemeris: 'Día de la Resistencia Indígena & Tradición de Octubre',
    emoji: '🍂',
    bannerGradient: 'from-amber-600/15 via-orange-500/10 to-stone-500/15',
    bannerGradientDark: 'from-amber-600/25 via-orange-500/15 to-amber-950/30',
    badgeBg: 'bg-amber-500/15 dark:bg-amber-500/25',
    badgeText: 'text-amber-800 dark:text-amber-300',
    badgeBorder: 'border-amber-500/30 dark:border-amber-500/40',
    accentColor: '#D97706',
    accentGlow: 'rgba(217, 119, 6, 0.25)',
    greetingMessage: 'Mes de valoración a nuestras raíces originarias, diversidad cultural y proyectos de aula.',
    floatingDecorations: [
      { icon: '🍂', label: 'Hojas de otoño', opacity: 0.85 },
      { icon: '🎃', label: 'Detalle festivo', opacity: 0.75 },
      { icon: '🏹', label: 'Identidad cultural', opacity: 0.8 }
    ]
  },
  10: {
    month: 10,
    key: 'noviembre_musica_zulianidad',
    name: 'Noviembre',
    seasonTitle: 'Música, Chinita & Zulianidad',
    ephemeris: 'Feria de la Chinita, Día del Músico y de la Alimentación',
    emoji: '🪕',
    bannerGradient: 'from-indigo-500/15 via-purple-500/10 to-amber-500/15',
    bannerGradientDark: 'from-indigo-500/25 via-purple-500/15 to-violet-950/30',
    badgeBg: 'bg-indigo-400/15 dark:bg-indigo-400/25',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    badgeBorder: 'border-indigo-400/30 dark:border-indigo-400/40',
    accentColor: '#6366F1',
    accentGlow: 'rgba(99, 102, 241, 0.25)',
    greetingMessage: 'Gaitas, arte, armonía musical y el fervor tradicional que nos identifica.',
    floatingDecorations: [
      { icon: '🎵', label: 'Notas musicales', opacity: 0.85 },
      { icon: '⭐', label: 'Fervor y tradición', opacity: 0.8 },
      { icon: '🎺', label: 'Música instrumental', opacity: 0.75 }
    ]
  },
  11: {
    month: 11,
    key: 'diciembre_navidad',
    name: 'Diciembre',
    seasonTitle: 'Navidad & Paz CBA',
    ephemeris: 'Fiestas Decembrinas, Gaitas y Cierre de Lapso',
    emoji: '🎄',
    bannerGradient: 'from-red-500/15 via-emerald-500/10 to-amber-500/15',
    bannerGradientDark: 'from-red-500/25 via-emerald-500/15 to-green-950/30',
    badgeBg: 'bg-red-400/15 dark:bg-red-400/25',
    badgeText: 'text-red-700 dark:text-red-300',
    badgeBorder: 'border-red-400/30 dark:border-red-400/40',
    accentColor: '#EF4444',
    accentGlow: 'rgba(239, 68, 68, 0.25)',
    greetingMessage: '¡Feliz Navidad y Próspero Año Nuevo! Unión, paz y bendiciones en cada hogar CBA.',
    floatingDecorations: [
      { icon: '🎄', label: 'Árbol navideño', opacity: 0.9 },
      { icon: '🎅', label: 'Espíritu navideño', opacity: 0.85 },
      { icon: '🔔', label: 'Campanas de paz', opacity: 0.8 }
    ]
  }
};

export const ALL_MONTH_SEASONAL_CONFIGS: MonthSeasonalConfig[] = (
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as MonthIndex[]
).map((m) => MONTH_SEASONAL_CONFIGS[m]);

/**
 * Obtiene la configuración estacional correspondiente al mes actual (o a uno especificado).
 */
export function getCurrentMonthConfig(overrideMonth?: MonthIndex): MonthSeasonalConfig {
  if (overrideMonth !== undefined && overrideMonth >= 0 && overrideMonth <= 11) {
    return MONTH_SEASONAL_CONFIGS[overrideMonth];
  }
  const now = new Date();
  const currentMonth = now.getMonth() as MonthIndex;
  return MONTH_SEASONAL_CONFIGS[currentMonth] || MONTH_SEASONAL_CONFIGS[8];
}
