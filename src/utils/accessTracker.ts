/**
 * Sistema de Rastreo de Frecuencia y Accesos Frecuentes por Usuario
 * Registra y pondera el uso de cada módulo (Tab) y sección (SubTab) para
 * ordenar dinámicamente la navegación según las preferencias y hábitos del usuario.
 */

export interface AccessFrequencyMap {
  [key: string]: number; // Clave compuesta `${userId}:${tabId}` o `${userId}:${tabId}:${subTabId}`
}

const ACCESS_STORAGE_KEY = 'sisceba_user_access_frequency_v1';

export function recordSectionAccess(userId: string | undefined, tabId: string, subTabId?: string): void {
  if (!userId || !tabId) return;
  try {
    const raw = localStorage.getItem(ACCESS_STORAGE_KEY);
    const map: AccessFrequencyMap = raw ? JSON.parse(raw) : {};

    // Incrementar frecuencia del tab principal
    const tabKey = `${userId}:${tabId}`;
    map[tabKey] = (map[tabKey] || 0) + 1;

    // Incrementar frecuencia de la subsección si existe
    if (subTabId) {
      const subKey = `${userId}:${tabId}:${subTabId}`;
      map[subKey] = (map[subKey] || 0) + 1;
    }

    localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn('Error registrando acceso frecuente:', err);
  }
}

export function getSectionFrequency(userId: string | undefined, tabId: string, subTabId?: string): number {
  if (!userId || !tabId) return 0;
  try {
    const raw = localStorage.getItem(ACCESS_STORAGE_KEY);
    if (!raw) return 0;
    const map: AccessFrequencyMap = JSON.parse(raw);
    const key = subTabId ? `${userId}:${tabId}:${subTabId}` : `${userId}:${tabId}`;
    return map[key] || 0;
  } catch {
    return 0;
  }
}

/**
 * Ordena una lista de subsecciones según la frecuencia de uso del usuario
 * preservando el orden original para elementos con la misma frecuencia.
 */
export function sortSubTabsByFrequency<T extends { id: string }>(
  userId: string | undefined,
  tabId: string,
  subTabs: T[]
): T[] {
  if (!userId || !subTabs || subTabs.length <= 1) return subTabs;

  return [...subTabs].sort((a, b) => {
    const freqA = getSectionFrequency(userId, tabId, a.id);
    const freqB = getSectionFrequency(userId, tabId, b.id);
    if (freqB !== freqA) {
      return freqB - freqA; // Mayor frecuencia primero
    }
    return 0;
  });
}
