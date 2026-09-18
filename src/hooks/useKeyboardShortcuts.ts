import { useEffect } from 'react';
import { MainNavigationTab } from '../types';

interface KeyboardShortcutsOptions {
  onOpenSearch: () => void;
  onOpenShortcuts: () => void;
  onToggleSidebar: () => void;
  onNavigateTab: (tab: MainNavigationTab) => void;
  onNavigateShortcut?: (actionNumber: '1' | '2' | '3' | '4' | '5' | '6') => void;
  onPrint?: () => void;
  onToggleMode: () => void;
  onCycleTheme: () => void;
  onToggleDevHUD: () => void;
  onCycleRole: () => void;
  onCycleLapso: () => void;
  onToggleOffline: () => void;
  onCopyDiagnostics: () => void;
  onToggleDebugGrid: () => void;
  onResetSeedData: () => void;
  onCloseModals: () => void;
}

export const useKeyboardShortcuts = (options: KeyboardShortcutsOptions) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl instanceof HTMLSelectElement ||
        (activeEl as HTMLElement)?.isContentEditable;

      const hasCtrlOrMeta = e.ctrlKey || e.metaKey;
      const hasAlt = e.altKey;
      const hasShift = e.shiftKey;

      // 1. GLOBAL ESCAPE: Always closes any open modal or HUD
      if (e.key === 'Escape') {
        options.onCloseModals();
        return;
      }

      // 2. BUSCADOR GLOBAL: Ctrl+K o ⌘+K
      if (hasCtrlOrMeta && !hasShift && !hasAlt && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        options.onOpenSearch();
        return;
      }

      // 3. IMPRESIÓN / GENERAR PDF: Ctrl+P o ⌘+P
      if (hasCtrlOrMeta && !hasShift && !hasAlt && (e.key === 'p' || e.key === 'P')) {
        if (options.onPrint) {
          e.preventDefault();
          options.onPrint();
          return;
        }
      }

      // ============================================================
      // ATAJOS DE DESARROLLADOR (DEV MODE)
      // ============================================================
      // A. Ctrl + Shift + D: Toggle Consola HUD de Desarrollador
      if (hasCtrlOrMeta && hasShift && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        options.onToggleDevHUD();
        return;
      }

      // B. Ctrl + Shift + R: Rotador rápido de Rol de Usuario
      if (hasCtrlOrMeta && hasShift && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        options.onCycleRole();
        return;
      }

      // C. Ctrl + Shift + L: Rotador rápido de Lapso Académico
      if (hasCtrlOrMeta && hasShift && (e.key === 'L' || e.key === 'l')) {
        e.preventDefault();
        options.onCycleLapso();
        return;
      }

      // D. Ctrl + Shift + S: Simulador de Conectividad (Offline / Online)
      if (hasCtrlOrMeta && hasShift && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        options.onToggleOffline();
        return;
      }

      // E. Ctrl + Shift + C: Copiar Diagnóstico del Sistema al portapapeles
      if (hasCtrlOrMeta && hasShift && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        options.onCopyDiagnostics();
        return;
      }

      // F. Ctrl + Shift + G: Toggle Grid Visual de Depuración
      if (hasCtrlOrMeta && hasShift && (e.key === 'G' || e.key === 'g')) {
        e.preventDefault();
        options.onToggleDebugGrid();
        return;
      }

      // G. Ctrl + Shift + X: Reset de Datos Semilla
      if (hasCtrlOrMeta && hasShift && (e.key === 'X' || e.key === 'x')) {
        e.preventDefault();
        options.onResetSeedData();
        return;
      }

      // ============================================================
      // ATAJOS DE USUARIO GENERAL (Con tecla Alt o teclas simples)
      // ============================================================
      // Si el usuario está escribiendo en un input, evitar que atajos con letras interfieran
      if (isInputFocused) {
        return;
      }

      // A. ?: Abre el centro de atajos de teclado (? o Shift+?)
      if (e.key === '?' || (hasShift && (e.key === '?' || e.key === '/'))) {
        e.preventDefault();
        options.onOpenShortcuts();
        return;
      }

      // B. /: Búsqueda rápida Spotlight (sin teclas de modificación)
      if (!hasCtrlOrMeta && !hasAlt && !hasShift && e.key === '/') {
        e.preventDefault();
        options.onOpenSearch();
        return;
      }

      // C. Alt + B: Colapsar o expandir barra lateral (Sidebar)
      if (hasAlt && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        options.onToggleSidebar();
        return;
      }

      // D. Alt + D: Alternar Modo Claro / Modo Oscuro
      if (hasAlt && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        options.onToggleMode();
        return;
      }

      // E. Alt + T: Rotar paleta de color / tema
      if (hasAlt && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        options.onCycleTheme();
        return;
      }

      // F. Alt + H: Ir al Escritorio / Dashboard
      if (hasAlt && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        if (options.onNavigateShortcut) {
          options.onNavigateShortcut('1');
        } else {
          options.onNavigateTab('ESCRITORIO');
        }
        return;
      }

      // G. Alt + 1..6: Navegación por módulos institucionales
      if (hasAlt && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        if (options.onNavigateShortcut) {
          options.onNavigateShortcut(e.key as '1' | '2' | '3' | '4' | '5' | '6');
        } else {
          const tabMap: Record<string, MainNavigationTab> = {
            '1': 'ESCRITORIO',
            '2': 'GESTION',
            '3': 'INICIAL',
            '4': 'CONSULTAS',
            '5': 'COMUNIDAD',
            '6': 'CONFIGURACION'
          };
          const targetTab = tabMap[e.key];
          if (targetTab) {
            options.onNavigateTab(targetTab);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options]);
};
