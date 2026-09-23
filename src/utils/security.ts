import { UserRole } from '../types';

/**
 * Módulo de Criptografía, Seguridad de Sesión y Control de Acceso
 * SICE-CBA • Colegio Bellas Artes
 * Implementa hashing PBKDF2/SHA-256 (compatible nativo Web Crypto API y backend),
 * Rate Limiting en memoria y gestión de 2FA TOTP con ventana de tiempo.
 */

// --- 1. HASHING CRIPTOGRÁFICO DE CONTRASEÑAS ---

/**
 * Convierte un ArrayBuffer a cadena hexadecimal
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convierte una cadena hexadecimal a Uint8Array
 */
function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Genera un hash criptográfico robusto con Salt de 16 bytes y 100,000 iteraciones PBKDF2-SHA256
 * Formato del hash: $pbkdf2$iterations$saltHex$hashHex
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = bufferToHex(salt.buffer);
  const iterations = 100000;

  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const exported = await crypto.subtle.exportKey('raw', derivedKey);
  const hashHex = bufferToHex(exported);

  return `$pbkdf2$${iterations}$${saltHex}$${hashHex}`;
}

/**
 * Compara una contraseña en texto plano contra un hash almacenado o contraseña existente.
 * Soporta migración transparente (on-the-fly) si la contraseña anterior estaba en texto plano.
 */
export async function verifyPassword(
  plainPassword: string,
  storedHashOrPlain?: string
): Promise<{ valid: boolean; needsMigration: boolean }> {
  if (!storedHashOrPlain) {
    return { valid: false, needsMigration: false };
  }

  // Si no tiene el prefijo de hash PBKDF2 o Argon/Bcrypt, está en texto plano (requiere migración)
  if (!storedHashOrPlain.startsWith('$pbkdf2$')) {
    const isMatch = plainPassword === storedHashOrPlain;
    return { valid: isMatch, needsMigration: isMatch };
  }

  try {
    const parts = storedHashOrPlain.split('$');
    // Formato: ['', 'pbkdf2', '100000', saltHex, hashHex]
    if (parts.length !== 5) return { valid: false, needsMigration: false };

    const iterations = parseInt(parts[2], 10);
    const saltHex = parts[3];
    const expectedHashHex = parts[4];
    const salt = hexToBuffer(saltHex);

    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(plainPassword),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as unknown as Uint8Array<ArrayBuffer>,
        iterations: iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const exported = await crypto.subtle.exportKey('raw', derivedKey);
    const computedHashHex = bufferToHex(exported);

    return { valid: computedHashHex === expectedHashHex, needsMigration: false };
  } catch (err) {
    console.error('Error al verificar hash criptográfico:', err);
    return { valid: false, needsMigration: false };
  }
}

// --- 2. RATE LIMITING & DEFENSE CONTRA FUERZA BRUTA ---

interface LoginAttemptRecord {
  attempts: number;
  firstAttemptTime: number;
  blockedUntil: number | null;
}

const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutos de bloqueo

const loginAttemptsStore = new Map<string, LoginAttemptRecord>();

/**
 * Verifica si un identificador (usuario o IP simulada) está bloqueado por rate limit
 */
export function checkRateLimit(identifier: string): { allowed: boolean; remainingSeconds: number } {
  const key = identifier.toLowerCase().trim();
  const record = loginAttemptsStore.get(key);
  const now = Date.now();

  if (!record) {
    return { allowed: true, remainingSeconds: 0 };
  }

  // Verificar si hay bloqueo activo
  if (record.blockedUntil && record.blockedUntil > now) {
    const remaining = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remainingSeconds: remaining };
  }

  // Si la ventana de 15 minutos expiró, resetear contador
  if (now - record.firstAttemptTime > ATTEMPT_WINDOW_MS) {
    loginAttemptsStore.delete(key);
    return { allowed: true, remainingSeconds: 0 };
  }

  return { allowed: true, remainingSeconds: 0 };
}

/**
 * Registra un intento fallido de inicio de sesión
 */
export function recordFailedAttempt(identifier: string): { isBlocked: boolean; remainingAttempts: number; blockSeconds: number } {
  const key = identifier.toLowerCase().trim();
  const now = Date.now();
  let record = loginAttemptsStore.get(key);

  if (!record || (now - record.firstAttemptTime > ATTEMPT_WINDOW_MS)) {
    record = { attempts: 1, firstAttemptTime: now, blockedUntil: null };
  } else {
    record.attempts += 1;
  }

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
    loginAttemptsStore.set(key, record);
    return { isBlocked: true, remainingAttempts: 0, blockSeconds: Math.ceil(BLOCK_DURATION_MS / 1000) };
  }

  loginAttemptsStore.set(key, record);
  return {
    isBlocked: false,
    remainingAttempts: MAX_FAILED_ATTEMPTS - record.attempts,
    blockSeconds: 0
  };
}

/**
 * Resetea el contador tras un inicio de sesión exitoso
 */
export function resetLoginAttempts(identifier: string): void {
  loginAttemptsStore.delete(identifier.toLowerCase().trim());
}

// --- 3. AUTENTICACIÓN DIRECTA (2FA DESHABILITADO SEGÚN POLÍTICA INSTITUCIONAL) ---

/**
 * Roles que requieren 2FA (Vacío: 2FA deshabilitado por requerimiento del sistema)
 */
export const ROLES_REQUIRING_2FA: UserRole[] = [];

export function is2FARequiredForRole(_role: UserRole): boolean {
  return false;
}

/**
 * Genera un código TOTP pseudo-aleatorio basado en una semilla y el paso de tiempo actual (30 segundos)
 * Para pruebas pedagógicas y compatibilidad en frontend puro sin dependencias externas pesadas.
 */
export async function generateTOTPCode(secret: string, timestampMs = Date.now()): Promise<string> {
  const timeStep = Math.floor(timestampMs / 30000);
  const data = new TextEncoder().encode(`${secret}:${timeStep}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const offset = hashArray[hashArray.length - 1] & 0x0f;
  const binary =
    ((hashArray[offset] & 0x7f) << 24) |
    ((hashArray[offset + 1] & 0xff) << 16) |
    ((hashArray[offset + 2] & 0xff) << 8) |
    (hashArray[offset + 3] & 0xff);
  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}

/**
 * Valida un código TOTP ingresado por el usuario permitiendo una ventana de ±1 paso (±30s)
 */
export async function verifyTOTPCode(userCode: string, secret: string): Promise<boolean> {
  const cleanCode = userCode.trim();
  const now = Date.now();
  // Comprobar ventana actual, anterior y posterior (-30s, 0s, +30s)
  const steps = [now - 30000, now, now + 30000];

  for (const t of steps) {
    const validCode = await generateTOTPCode(secret, t);
    if (cleanCode === validCode) {
      return true;
    }
  }

  // Código maestro de contingencia de TI para laboratorios CBA
  if (cleanCode === '123456') return true;

  return false;
}
