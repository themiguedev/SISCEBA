/**
 * Catálogo e Ilustraciones SVG de Avatares Oficiales de SICE-CBA
 * Colegio Bellas Artes • Basados en el diseño vectorial de referencia
 * (Trajes profesionales, camisas con cuello, corbata, saco y fondo circular turquesa/neutro)
 */

export interface PresetAvatar {
  id: string;
  label: string;
  gender: 'MASCULINO' | 'FEMENINO';
  suitColor: string; // ej. Celeste, Naranja, Azul Marino
  svgDataUri: string;
}

// 1. Hombre - Traje Celeste / Azul Claro (#38bdf8 / #0284c7)
const SVG_MALE_CYAN = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Fondo suave circular -->
  <circle cx="100" cy="100" r="96" fill="#f1f5f9"/>
  
  <!-- Cuello y hombros -->
  <path d="M40 196 C40 145 65 135 100 135 C135 135 160 145 160 196 Z" fill="#38bdf8"/>
  
  <!-- Solapas del traje -->
  <path d="M70 140 L100 185 L60 196 Z" fill="#0284c7"/>
  <path d="M130 140 L100 185 L140 196 Z" fill="#0284c7"/>
  
  <!-- Camisa Blanca -->
  <polygon points="82,130 118,130 100,180" fill="#ffffff"/>
  
  <!-- Corbata Oscura -->
  <polygon points="96,142 104,142 106,178 100,188 94,178" fill="#1e293b"/>
  <polygon points="95,138 105,138 103,145 97,145" fill="#0f172a"/>

  <!-- Cuello de la camisa -->
  <polygon points="80,126 95,142 98,126" fill="#f8fafc"/>
  <polygon points="120,126 105,142 102,126" fill="#f8fafc"/>

  <!-- Cuello anatómico -->
  <path d="M85 105 L85 132 L115 132 L115 105 Z" fill="#fbcfe8" opacity="0"/>
  <rect x="86" y="102" width="28" height="30" fill="#fed7aa"/>

  <!-- Cabeza / Rostro -->
  <ellipse cx="100" cy="85" rx="32" ry="38" fill="#fed7aa"/>
  
  <!-- Orejas -->
  <circle cx="68" cy="88" r="8" fill="#fcd34d" opacity="0"/>
  <circle cx="68" cy="88" r="7" fill="#fed7aa"/>
  <circle cx="132" cy="88" r="7" fill="#fed7aa"/>

  <!-- Cabello Hombre Moderno Castaño -->
  <path d="M68 80 C68 45 80 40 100 40 C125 40 134 50 134 76 C126 70 120 70 108 72 C96 74 88 84 68 80 Z" fill="#451a03"/>
</svg>
`)}`;

// 2. Hombre - Con Círculo Turquesa y Traje Oscuro
const SVG_MALE_TEAL_CIRCLE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Círculo de fondo Turquesa distintivo -->
  <circle cx="100" cy="100" r="96" fill="#2dd4bf"/>
  
  <!-- Traje Oscuro Azul Marino / Carbón -->
  <path d="M40 196 C40 145 65 135 100 135 C135 135 160 145 160 196 Z" fill="#1e293b"/>
  
  <!-- Solapas -->
  <path d="M70 140 L100 185 L58 196 Z" fill="#0f172a"/>
  <path d="M130 140 L100 185 L142 196 Z" fill="#0f172a"/>

  <!-- Camisa Blanca -->
  <polygon points="80,130 120,130 100,185" fill="#ffffff"/>

  <!-- Cuello anatómico -->
  <rect x="86" y="102" width="28" height="30" fill="#fed7aa"/>

  <!-- Cabeza / Rostro -->
  <ellipse cx="100" cy="85" rx="32" ry="38" fill="#fed7aa"/>
  
  <!-- Orejas -->
  <circle cx="68" cy="88" r="7" fill="#fed7aa"/>
  <circle cx="132" cy="88" r="7" fill="#fed7aa"/>

  <!-- Cabello Corto Profesional -->
  <path d="M68 80 C68 46 80 40 100 40 C125 40 133 50 133 76 C124 72 118 70 106 72 C94 74 86 84 68 80 Z" fill="#292524"/>
</svg>
`)}`;

// 3. Hombre - Traje Naranja / Ocre (#ea580c / #c2410c)
const SVG_MALE_ORANGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Fondo suave circular -->
  <circle cx="100" cy="100" r="96" fill="#f8fafc"/>
  
  <!-- Traje Naranja Ocre institucional -->
  <path d="M40 196 C40 145 65 135 100 135 C135 135 160 145 160 196 Z" fill="#ea580c"/>
  
  <!-- Solapas -->
  <path d="M70 140 L100 185 L58 196 Z" fill="#c2410c"/>
  <path d="M130 140 L100 185 L142 196 Z" fill="#c2410c"/>

  <!-- Camisa Blanca -->
  <polygon points="82,130 118,130 100,180" fill="#ffffff"/>
  
  <!-- Corbata Azul Marino -->
  <polygon points="96,142 104,142 106,178 100,188 94,178" fill="#1e293b"/>
  <polygon points="95,138 105,138 103,145 97,145" fill="#0f172a"/>

  <!-- Cuello de la camisa -->
  <polygon points="80,126 95,142 98,126" fill="#ffffff"/>
  <polygon points="120,126 105,142 102,126" fill="#ffffff"/>

  <!-- Cuello anatómico -->
  <rect x="86" y="102" width="28" height="30" fill="#fed7aa"/>

  <!-- Cabeza / Rostro -->
  <ellipse cx="100" cy="85" rx="32" ry="38" fill="#fed7aa"/>
  
  <!-- Orejas -->
  <circle cx="68" cy="88" r="7" fill="#fed7aa"/>
  <circle cx="132" cy="88" r="7" fill="#fed7aa"/>

  <!-- Cabello Castaño Oscuro -->
  <path d="M68 80 C68 45 80 40 100 40 C125 40 134 50 134 76 C126 70 120 70 108 72 C96 74 88 84 68 80 Z" fill="#54301a"/>
</svg>
`)}`;

// 4. Mujer - Traje Naranja / Terracota (#ea580c) y Cabello Castaño Largo a los hombros
const SVG_FEMALE_ORANGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Fondo suave -->
  <circle cx="100" cy="100" r="96" fill="#f8fafc"/>

  <!-- Cabello posterior largo cayendo sobre hombros -->
  <path d="M64 85 C64 125 60 160 62 175 C68 180 78 180 82 165 C84 135 84 100 84 85 Z" fill="#54301a"/>
  <path d="M136 85 C136 125 140 160 138 175 C132 180 122 180 118 165 C116 135 116 100 116 85 Z" fill="#54301a"/>
  
  <!-- Traje Femenino Naranja / Terracota -->
  <path d="M42 196 C42 148 65 138 100 138 C135 138 158 148 158 196 Z" fill="#ea580c"/>
  
  <!-- Solapas chaqueta -->
  <path d="M72 142 L100 188 L60 196 Z" fill="#c2410c"/>
  <path d="M128 142 L100 188 L140 196 Z" fill="#c2410c"/>

  <!-- Blusa / Camisa Blanca con corbatín formal -->
  <polygon points="84,132 116,132 100,180" fill="#ffffff"/>
  <polygon points="96,145 104,145 105,175 100,182 95,175" fill="#1e293b"/>
  <polygon points="95,140 105,140 103,146 97,146" fill="#0f172a"/>

  <!-- Cuello blusa -->
  <polygon points="82,128 95,142 98,128" fill="#ffffff"/>
  <polygon points="118,128 105,142 102,128" fill="#ffffff"/>

  <!-- Cuello femenino estilizado -->
  <rect x="88" y="105" width="24" height="28" fill="#fed7aa"/>

  <!-- Rostro femenino ovalado -->
  <ellipse cx="100" cy="87" rx="30" ry="36" fill="#fed7aa"/>

  <!-- Cabello Femenino frontal con partidura central y caída suave -->
  <path d="M68 85 C66 45 80 38 100 38 C120 38 134 45 132 85 C124 74 114 70 100 75 C86 70 76 74 68 85 Z" fill="#54301a"/>
</svg>
`)}`;

// 5. Mujer - Con Círculo Turquesa y Traje Ejecutivo Oscuro
const SVG_FEMALE_TEAL_CIRCLE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Círculo de fondo Turquesa distintivo -->
  <circle cx="100" cy="100" r="96" fill="#2dd4bf"/>

  <!-- Cabello posterior largo -->
  <path d="M64 85 C64 125 60 160 62 175 C68 180 78 180 82 165 C84 135 84 100 84 85 Z" fill="#3f2314"/>
  <path d="M136 85 C136 125 140 160 138 175 C132 180 122 180 118 165 C116 135 116 100 116 85 Z" fill="#3f2314"/>
  
  <!-- Traje Femenino Oscuro -->
  <path d="M42 196 C42 148 65 138 100 138 C135 138 158 148 158 196 Z" fill="#1e293b"/>
  
  <!-- Solapas chaqueta -->
  <path d="M72 142 L100 188 L60 196 Z" fill="#0f172a"/>
  <path d="M128 142 L100 188 L140 196 Z" fill="#0f172a"/>

  <!-- Blusa Blanca ejecutiva -->
  <polygon points="82,132 118,132 100,185" fill="#ffffff"/>

  <!-- Cuello estilizado -->
  <rect x="88" y="105" width="24" height="28" fill="#fed7aa"/>

  <!-- Rostro femenino -->
  <ellipse cx="100" cy="87" rx="30" ry="36" fill="#fed7aa"/>

  <!-- Cabello Femenino frontal peinado ejecutivo -->
  <path d="M68 85 C66 45 80 38 100 38 C120 38 134 45 132 85 C124 74 114 70 100 75 C86 70 76 74 68 85 Z" fill="#3f2314"/>
</svg>
`)}`;

// 6. Mujer - Traje Celeste / Turquesa (#38bdf8 / #0284c7)
const SVG_FEMALE_CYAN = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Fondo suave -->
  <circle cx="100" cy="100" r="96" fill="#f8fafc"/>

  <!-- Cabello posterior largo oscuro -->
  <path d="M64 85 C64 125 58 160 62 175 C68 180 78 180 82 165 C84 135 84 100 84 85 Z" fill="#1f1d1d"/>
  <path d="M136 85 C136 125 142 160 138 175 C132 180 122 180 118 165 C116 135 116 100 116 85 Z" fill="#1f1d1d"/>
  
  <!-- Traje Femenino Celeste -->
  <path d="M42 196 C42 148 65 138 100 138 C135 138 158 148 158 196 Z" fill="#38bdf8"/>
  
  <!-- Solapas -->
  <path d="M72 142 L100 188 L60 196 Z" fill="#0284c7"/>
  <path d="M128 142 L100 188 L140 196 Z" fill="#0284c7"/>

  <!-- Blusa Blanca con corbata delgada -->
  <polygon points="84,132 116,132 100,180" fill="#ffffff"/>
  <polygon points="96,145 104,145 105,175 100,182 95,175" fill="#1e293b"/>
  <polygon points="95,140 105,140 103,146 97,146" fill="#0f172a"/>

  <!-- Cuello blusa -->
  <polygon points="82,128 95,142 98,128" fill="#ffffff"/>
  <polygon points="118,128 105,142 102,128" fill="#ffffff"/>

  <!-- Cuello estilizado -->
  <rect x="88" y="105" width="24" height="28" fill="#fed7aa"/>

  <!-- Rostro femenino -->
  <ellipse cx="100" cy="87" rx="30" ry="36" fill="#fed7aa"/>

  <!-- Cabello Frontal Lacio Negro / Azabache -->
  <path d="M68 85 C66 45 80 38 100 38 C120 38 134 45 132 85 C124 74 114 70 100 75 C86 70 76 74 68 85 Z" fill="#1f1d1d"/>
</svg>
`)}`;

/**
 * Catálogo completo de avatares oficiales que coinciden exactamente con la referencia
 */
export const OFFICIAL_AVATARS: PresetAvatar[] = [
  // Fila Superior (Hombres)
  {
    id: 'male-cyan',
    label: 'Hombre • Traje Celeste y Corbata',
    gender: 'MASCULINO',
    suitColor: 'Celeste',
    svgDataUri: SVG_MALE_CYAN
  },
  {
    id: 'male-circle-teal',
    label: 'Hombre • Traje Ejecutivo Círculo Turquesa',
    gender: 'MASCULINO',
    suitColor: 'Azul Marino',
    svgDataUri: SVG_MALE_TEAL_CIRCLE
  },
  {
    id: 'male-orange',
    label: 'Hombre • Traje Ocre y Corbata',
    gender: 'MASCULINO',
    suitColor: 'Naranja Ocre',
    svgDataUri: SVG_MALE_ORANGE
  },

  // Fila Inferior (Mujeres)
  {
    id: 'female-orange',
    label: 'Mujer • Traje Ocre / Terracota',
    gender: 'FEMENINO',
    suitColor: 'Naranja Ocre',
    svgDataUri: SVG_FEMALE_ORANGE
  },
  {
    id: 'female-circle-teal',
    label: 'Mujer • Traje Ejecutivo Círculo Turquesa',
    gender: 'FEMENINO',
    suitColor: 'Azul Marino',
    svgDataUri: SVG_FEMALE_TEAL_CIRCLE
  },
  {
    id: 'female-cyan',
    label: 'Mujer • Traje Celeste y Corbata',
    gender: 'FEMENINO',
    suitColor: 'Celeste',
    svgDataUri: SVG_FEMALE_CYAN
  }
];

/**
 * Función predictiva inteligente para obtener el avatar predeterminado de un usuario
 * según su género explícito o infiriéndolo a partir de su rol / nombre institucional.
 */
export function getDefaultAvatarForUser(user: {
  gender?: 'MASCULINO' | 'FEMENINO';
  role?: string;
  fullName?: string;
  username?: string;
}): string {
  // 1. Si el usuario ya tiene definido explícitamente su género
  if (user.gender === 'FEMENINO') {
    return SVG_FEMALE_TEAL_CIRCLE;
  }
  if (user.gender === 'MASCULINO') {
    return SVG_MALE_TEAL_CIRCLE;
  }

  // 2. Si no tiene género explícito, inferir a partir del nombre o rol
  const name = (user.fullName || user.username || '').toLowerCase();
  const role = (user.role || '').toUpperCase();

  // Nombres y roles típicamente femeninos en la institución
  const isFemaleName =
    name.includes('coordinacion') ||
    name.includes('coordinadora') ||
    name.includes('asistente') ||
    name.includes('profesora') ||
    name.includes('lic.') ||
    name.includes('maria') ||
    name.includes('ana') ||
    name.includes('elena') ||
    name.includes('patricia') ||
    name.includes('carmen') ||
    name.includes('sofia');

  if (isFemaleName) {
    return SVG_FEMALE_TEAL_CIRCLE;
  }

  // Por defecto institucional hombre para cuentas tipo admin / director general
  if (role === 'ADMINISTRADOR') {
    return SVG_MALE_CYAN;
  }
  if (role === 'DIRECTOR') {
    return SVG_MALE_ORANGE;
  }

  return SVG_MALE_TEAL_CIRCLE;
}

export {
  SVG_MALE_CYAN,
  SVG_MALE_TEAL_CIRCLE,
  SVG_MALE_ORANGE,
  SVG_FEMALE_ORANGE,
  SVG_FEMALE_TEAL_CIRCLE,
  SVG_FEMALE_TEAL_CIRCLE as SVG_FEMALE_CIRCLE_TEAL,
  SVG_FEMALE_CYAN
};
