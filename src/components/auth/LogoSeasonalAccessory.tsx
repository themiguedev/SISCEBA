import React from 'react';

export type FestiveTheme =
  | 'navidad_gorro'
  | 'navidad_calcetin'
  | 'regreso_clases'
  | 'san_valentin'
  | 'halloween'
  | 'ano_nuevo'
  | 'dia_tierra'
  | 'dia_musica';

/**
 * Detecta automáticamente la efeméride o estación festiva según el mes y día del calendario.
 */
export function getAutoThemeByDate(): FestiveTheme {
  const now = new Date();
  const month = now.getMonth(); // 0 = Ene, 11 = Dic
  const day = now.getDate();

  if (month === 11) {
    // Diciembre: Navidad
    return day > 25 ? 'ano_nuevo' : 'navidad_gorro';
  } else if (month === 0) {
    // Enero: Año Nuevo / Reyes
    return 'ano_nuevo';
  } else if (month === 1) {
    // Febrero: San Valentín / Amor y Amistad
    return 'san_valentin';
  } else if (month === 3 || month === 4) {
    // Abril - Mayo: Día de la Tierra
    return 'dia_tierra';
  } else if (month === 8) {
    // Septiembre: Inicio de año escolar CBA
    return 'regreso_clases';
  } else if (month === 9) {
    // Octubre: Halloween / Otoño
    return 'halloween';
  } else if (month === 10) {
    // Noviembre: Música / Zulianidad
    return 'dia_musica';
  }

  return 'regreso_clases';
}

interface SeasonalAccessoryIconProps {
  sizeClass?: string;
  className?: string;
}

/**
 * Icono festivo con animación continua fluida (sin titileo ni desvanecimiento de opacidad).
 */
export const SeasonalAccessoryIcon: React.FC<SeasonalAccessoryIconProps> = ({
  sizeClass = 'w-9 h-9',
  className = '-top-3.5 -right-3.5',
}) => {
  const currentTheme = getAutoThemeByDate();

  return (
    <div className={`absolute ${className} pointer-events-none select-none z-10`}>
      {/* Estilos de animación continua con 100% de opacidad fija (sin parpadeo) */}
      <style>{`
        @keyframes cba-float-cap {
          0%, 100% {
            transform: translateY(0px) rotate(-6deg);
          }
          50% {
            transform: translateY(-3px) rotate(-1deg);
          }
        }
        @keyframes cba-santa-bob {
          0%, 100% {
            transform: translateY(0px) rotate(-14deg);
          }
          50% {
            transform: translateY(-3px) rotate(-7deg);
          }
        }
        @keyframes cba-stocking-sway {
          0%, 100% {
            transform: rotate(8deg) translateY(0px);
          }
          50% {
            transform: rotate(18deg) translateY(-2px);
          }
        }
        @keyframes cba-heart-beat {
          0%, 100% {
            transform: scale(1);
          }
          20% {
            transform: scale(1.14);
          }
          40% {
            transform: scale(1);
          }
          60% {
            transform: scale(1.08);
          }
        }
        @keyframes cba-pumpkin-sway {
          0%, 100% {
            transform: translateY(0px) rotate(-2deg);
          }
          50% {
            transform: translateY(-3px) rotate(4deg);
          }
        }
        @keyframes cba-twinkle-fest {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.1) rotate(180deg);
          }
        }
        @keyframes cba-leaf-breeze {
          0%, 100% {
            transform: rotate(8deg) translateY(0px);
          }
          50% {
            transform: rotate(18deg) translateY(-2.5px);
          }
        }
        @keyframes cba-music-notes {
          0%, 100% {
            transform: translateY(0px) rotate(-3deg);
          }
          50% {
            transform: translateY(-3.5px) rotate(4deg);
          }
        }
      `}</style>

      {/* 1. GORRITO DE NAVIDAD 🎅 */}
      {currentTheme === 'navidad_gorro' && (
        <div
          className={`relative ${sizeClass} drop-shadow-md origin-bottom-left`}
          style={{ animation: 'cba-santa-bob 3s ease-in-out infinite' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <path
              d="M15 70 Q35 15 75 25 Q60 55 85 70 Z"
              fill="#DC2626"
              stroke="#991B1B"
              strokeWidth="2"
            />
            <path
              d="M40 45 Q55 28 75 25 Q65 45 70 65"
              fill="none"
              stroke="#B91C1C"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <rect
              x="10"
              y="66"
              width="78"
              height="16"
              rx="8"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="2"
              filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.15))"
            />
            <circle
              cx="77"
              cy="23"
              r="10"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="2"
            />
            <circle cx="75" cy="20" r="3" fill="#F8FAFC" />
          </svg>
        </div>
      )}

      {/* 2. CALCETÍN NAVIDEÑO 🧦 */}
      {currentTheme === 'navidad_calcetin' && (
        <div
          className={`relative ${sizeClass} drop-shadow-md origin-top-left`}
          style={{ animation: 'cba-stocking-sway 2.5s ease-in-out infinite' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M35 15 L65 15 L65 55 Q65 80 40 85 L25 85 Q12 85 12 70 Q12 55 35 55 Z"
              fill="#DC2626"
              stroke="#991B1B"
              strokeWidth="3"
            />
            <path d="M12 70 Q12 85 25 85 L32 75 Q20 70 12 70 Z" fill="#16A34A" />
            <path d="M65 50 Q65 65 50 65 L55 48 Z" fill="#16A34A" />
            <rect x="30" y="10" width="40" height="14" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="48" cy="17" r="3" fill="#15803D" />
            <circle cx="53" cy="17" r="2.5" fill="#EF4444" />
          </svg>
        </div>
      )}

      {/* 3. BIRRETE ACADÉMICO / REGRESO A CLASES 🎓 (Movimiento continuo sin desvanecer) */}
      {currentTheme === 'regreso_clases' && (
        <div
          className={`relative ${sizeClass} drop-shadow-md origin-bottom-center`}
          style={{ animation: 'cba-float-cap 3.2s ease-in-out infinite' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Tapa romboidal del birrete */}
            <polygon
              points="50,15 92,35 50,55 8,35"
              fill="#1E2038"
              stroke="#D4AF37"
              strokeWidth="3"
            />
            {/* Casquete inferior */}
            <path
              d="M25 43 L25 60 Q50 75 75 60 L75 43 Z"
              fill="#141525"
              stroke="#D4AF37"
              strokeWidth="2"
            />
            {/* Botón superior central */}
            <circle cx="50" cy="35" r="4" fill="#D4AF37" />
            {/* Cinta y borla dorada colgante */}
            <path
              d="M50 35 Q78 40 80 62"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <rect x="76" y="62" width="8" height="12" rx="2" fill="#D4AF37" />
          </svg>
        </div>
      )}

      {/* 4. SAN VALENTÍN / AMOR Y AMISTAD ❤️ */}
      {currentTheme === 'san_valentin' && (
        <div
          className={`relative ${sizeClass} drop-shadow-md origin-center`}
          style={{ animation: 'cba-heart-beat 1.8s ease-in-out infinite' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M50 85 C20 60 5 40 5 25 C5 10 20 5 35 12 C42 16 48 24 50 28 C52 24 58 16 65 12 C80 5 95 10 95 25 C95 40 80 60 50 85 Z"
              fill="#EF4444"
              stroke="#B91C1C"
              strokeWidth="3"
            />
            <circle cx="28" cy="24" r="4" fill="#FFFFFF" opacity="0.8" />
            <circle cx="35" cy="30" r="2" fill="#FFFFFF" opacity="0.8" />
          </svg>
        </div>
      )}

      {/* 5. HALLOWEEN / OTOÑO 🎃 */}
      {currentTheme === 'halloween' && (
        <div
          className={`relative ${sizeClass} drop-shadow-md origin-bottom-center`}
          style={{ animation: 'cba-pumpkin-sway 2.6s ease-in-out infinite' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M48 25 L50 8 Q56 6 54 18 Z" fill="#15803D" stroke="#166534" strokeWidth="2" />
            <ellipse cx="50" cy="55" rx="42" ry="34" fill="#F97316" stroke="#C2410C" strokeWidth="3" />
            <ellipse cx="50" cy="55" rx="25" ry="34" fill="#FB923C" />
            <ellipse cx="50" cy="55" rx="10" ry="34" fill="#FDBA74" />
            <polygon points="34,42 42,50 30,50" fill="#431407" />
            <polygon points="66,42 70,50 58,50" fill="#431407" />
            <path d="M30 65 Q50 80 70 65 Q65 72 50 73 Q35 72 30 65 Z" fill="#431407" />
          </svg>
        </div>
      )}

      {/* 6. AÑO NUEVO / FIESTA 🎆 */}
      {currentTheme === 'ano_nuevo' && (
        <div
          className={`relative ${sizeClass} drop-shadow-md origin-center`}
          style={{ animation: 'cba-twinkle-fest 4s ease-in-out infinite' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,5 56,35 88,38 62,56 70,88 50,68 30,88 38,56 12,38 44,35" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <circle cx="50" cy="50" r="12" fill="#FEF08A" />
            <circle cx="85" cy="15" r="4" fill="#38BDF8" />
            <circle cx="15" cy="75" r="4" fill="#EC4899" />
          </svg>
        </div>
      )}

      {/* 7. DÍA DE LA TIERRA / NATURALEZA 🌿 */}
      {currentTheme === 'dia_tierra' && (
        <div
          className={`relative ${sizeClass} drop-shadow-md origin-bottom-left`}
          style={{ animation: 'cba-leaf-breeze 2.8s ease-in-out infinite' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M40 85 Q45 50 70 30" fill="none" stroke="#15803D" strokeWidth="5" strokeLinecap="round" />
            <path d="M48 60 Q75 40 82 15 Q55 20 48 60 Z" fill="#22C55E" stroke="#16A34A" strokeWidth="2" />
            <path d="M44 70 Q20 55 18 35 Q40 40 44 70 Z" fill="#4ADE80" stroke="#16A34A" strokeWidth="2" />
          </svg>
        </div>
      )}

      {/* 8. DÍA DE LA MÚSICA 🎵 */}
      {currentTheme === 'dia_musica' && (
        <div
          className={`relative ${sizeClass} drop-shadow-md origin-bottom-center`}
          style={{ animation: 'cba-music-notes 2.4s ease-in-out infinite' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="30" cy="70" rx="14" ry="10" fill="#D4AF37" transform="rotate(-20 30 70)" />
            <ellipse cx="70" cy="60" rx="14" ry="10" fill="#D4AF37" transform="rotate(-20 70 60)" />
            <rect x="38" y="22" width="6" height="48" fill="#D4AF37" />
            <rect x="78" y="12" width="6" height="48" fill="#D4AF37" />
            <polygon points="38,22 84,12 84,24 38,34" fill="#D4AF37" />
          </svg>
        </div>
      )}
    </div>
  );
};

/**
 * Componente que envuelve el logo principal de Login con su accesorio estacional.
 */
export const LogoSeasonalAccessory: React.FC = () => {
  return (
    <div className="relative inline-flex items-center justify-center">
      <div className="relative group/logo inline-block">
        <img
          src={`${import.meta.env.BASE_URL}logo-cba.png`}
          alt="Colegio Bellas Artes"
          className="h-14 w-auto object-contain drop-shadow-sm transition-all duration-300 group-hover/logo:scale-105 dark:brightness-0 dark:invert dark:opacity-95 dark:drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)]"
        />
        <SeasonalAccessoryIcon sizeClass="w-9 h-9" className="-top-3.5 -right-3.5" />
      </div>
    </div>
  );
};
