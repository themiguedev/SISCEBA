/**
 * Utilidades para evaluación de seguridad de contraseñas y generación de claves robustas.
 * SICE-CBA • Colegio Bellas Artes
 */

export interface PasswordEvaluation {
  score: number; // 0 a 4
  label: 'Muy Débil' | 'Débil' | 'Aceptable' | 'Segura' | 'Muy Segura';
  color: string;
  barWidth: number; // Porcentaje 0 a 100
  feedback: string;
}

/**
 * Evalúa la fortaleza de una contraseña y retorna métricas visuales amigables.
 */
export function evaluatePasswordStrength(password: string): PasswordEvaluation {
  if (!password) {
    return {
      score: 0,
      label: 'Muy Débil',
      color: 'bg-slate-300',
      barWidth: 0,
      feedback: 'Ingrese una contraseña'
    };
  }

  let score = 0;

  // Criterios de evaluación
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length < 6) {
    return {
      score: 1,
      label: 'Muy Débil',
      color: 'bg-rose-500',
      barWidth: 20,
      feedback: 'Demasiado corta (mínimo 6 caracteres)'
    };
  }

  switch (score) {
    case 1:
      return {
        score: 1,
        label: 'Muy Débil',
        color: 'bg-rose-500',
        barWidth: 25,
        feedback: 'Agregue mayúsculas, números o caracteres especiales'
      };
    case 2:
      return {
        score: 2,
        label: 'Débil',
        color: 'bg-amber-500',
        barWidth: 45,
        feedback: 'Se sugiere combinar letras, números y signos'
      };
    case 3:
      return {
        score: 3,
        label: 'Aceptable',
        color: 'bg-yellow-500',
        barWidth: 70,
        feedback: 'Buena contraseña. Puede añadir más longitud o símbolos'
      };
    case 4:
      return {
        score: 4,
        label: 'Segura',
        color: 'bg-emerald-500',
        barWidth: 85,
        feedback: '¡Contraseña robusta y segura!'
      };
    case 5:
    default:
      return {
        score: 5,
        label: 'Muy Segura',
        color: 'bg-teal-500',
        barWidth: 100,
        feedback: '¡Excelente nivel de seguridad institucional!'
      };
  }
}

/**
 * Genera una contraseña aleatoria de alta entropía y segura.
 */
export function generateStrongPassword(length = 14): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%^&*()_+~|}{[]:?><';
  const allChars = upper + lower + numbers + symbols;

  // Garantizar al menos un carácter de cada tipo
  const randomChars = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)]
  ];

  for (let i = randomChars.length; i < length; i++) {
    randomChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // Mezclar array (Fisher-Yates)
  for (let i = randomChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomChars[i], randomChars[j]] = [randomChars[j], randomChars[i]];
  }

  return randomChars.join('');
}
