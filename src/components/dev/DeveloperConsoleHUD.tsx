import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole, EducationalLevel } from '../../types';
import {
  Terminal,
  X,
  Copy,
  Check,
  RotateCcw,
  Wifi,
  WifiOff,
  Grid,
  Shield,
  Layers,
  Calendar,
  Sparkles,
  Database,
  Eye,
  AlertTriangle,
  Monitor
} from 'lucide-react';

interface DeveloperConsoleHUDProps {
  isOpen: boolean;
  onClose: () => void;
  isSimulatedOffline: boolean;
  setIsSimulatedOffline: React.Dispatch<React.SetStateAction<boolean>>;
  isDebugGridActive: boolean;
  setIsDebugGridActive: React.Dispatch<React.SetStateAction<boolean>>;
  onShowToast: (title: string, description?: string, isDev?: boolean) => void;
}

const AVAILABLE_ROLES: { id: UserRole; label: string; desc: string }[] = [
  { id: 'ADMINISTRADOR', label: 'Admin / Rector', desc: 'Acceso total y configuración' },
  { id: 'COORDINADOR', label: 'Coordinador', desc: 'Validación de planes y actas' },
  { id: 'DOCENTE', label: 'Docente', desc: 'Evaluación y planificación de aula' },
  { id: 'REPRESENTANTE', label: 'Representante', desc: 'Portal de familia y notas' },
  { id: 'ESTUDIANTE', label: 'Estudiante', desc: 'Consulta de boletines y avisos' }
];

export const DeveloperConsoleHUD: React.FC<DeveloperConsoleHUDProps> = ({
  isOpen,
  onClose,
  isSimulatedOffline,
  setIsSimulatedOffline,
  isDebugGridActive,
  setIsDebugGridActive,
  onShowToast
}) => {
  const {
    currentRole,
    setCurrentRole,
    currentLevel,
    setCurrentLevel,
    activeLapso,
    setActiveLapso,
    students,
    areas,
    plansQuincenal,
    evaluations
  } = useApp();

  const { mode, palette, isDark, toggleMode, currentTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Calculate approximate localStorage size
  const calculateStorageMetrics = () => {
    let totalBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key) || '';
        totalBytes += (key.length + val.length) * 2;
      }
    }
    return {
      keysCount: localStorage.length,
      kiloBytes: (totalBytes / 1024).toFixed(1)
    };
  };

  const storageMetrics = calculateStorageMetrics();

  // Copy full system diagnostic snapshot to clipboard
  const handleCopyDiagnostics = () => {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      session: {
        currentRole,
        currentLevel,
        activeLapso
      },
      theme: {
        mode,
        isDark,
        palette,
        themeName: currentTheme.name
      },
      entities: {
        studentsCount: students.length,
        areasCount: areas.length,
        plansCount: plansQuincenal.length,
        evaluationsCount: evaluations.length
      },
      environment: {
        userAgent: navigator.userAgent,
        screen: `${window.innerWidth}x${window.innerHeight}`,
        devicePixelRatio: window.devicePixelRatio,
        simulatedOffline: isSimulatedOffline,
        debugGrid: isDebugGridActive,
        storageKeysCount: storageMetrics.keysCount,
        storageSizeKB: storageMetrics.kiloBytes
      }
    };

    navigator.clipboard.writeText(JSON.stringify(diagnostics, null, 2));
    setCopied(true);
    onShowToast('Diagnóstico copiado al portapapeles', 'JSON técnico listo para compartir o inspeccionar', true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset demo storage and reload safely
  const handleResetData = () => {
    if (window.confirm('¿Deseas restablecer todos los datos de prueba a los valores originales de fábrica?')) {
      // Clear specific sisceba data keys
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('sisceba_')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      onShowToast('Datos restablecidos', 'Reiniciando valores semilla...', true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <aside
      aria-label="Consola de Desarrollador SICE-CBA"
      className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-[#141525]/95 text-slate-100 backdrop-blur-xl rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col max-h-[88vh] animate-in slide-in-from-bottom-5 duration-200"
    >
      {/* HUD Header */}
      <div className="px-5 py-3.5 bg-[#1B1C33] border-b border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black tracking-wide text-white flex items-center gap-1.5 font-mono">
              DEV CONSOLE HUD
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                LIVE
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">SICE-CBA • In-Browser Devtools</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400">Ctrl+Shift+D</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title="Cerrar consola"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* HUD Scrollable Body */}
      <div className="p-4 overflow-y-auto space-y-4 text-xs">
        {/* 1. Quick Telemetry Badge Grid */}
        <div className="grid grid-cols-2 gap-2 font-mono">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Rol Activo</span>
            <span className="font-black text-amber-300 truncate block text-[11px]">{currentRole}</span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Nivel / Lapso</span>
            <span className="font-black text-sky-300 block text-[11px] truncate">
              {currentLevel.replace('_', ' ')} • L{activeLapso}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tema Activo</span>
            <span className="font-black text-emerald-300 block text-[11px] truncate">
              {currentTheme.name} ({mode})
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Almacenamiento</span>
            <span className="font-black text-purple-300 block text-[11px]">
              {storageMetrics.kiloBytes} KB ({storageMetrics.keysCount} claves)
            </span>
          </div>
        </div>

        {/* 2. Role Simulator Switcher */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Simulador de Rol
            </span>
            <span className="text-[10px] font-mono text-slate-400">Ctrl+Shift+R</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {AVAILABLE_ROLES.map((role) => {
              const isSelected = currentRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    setCurrentRole(role.id);
                    onShowToast(`Rol simulado: ${role.label}`, role.desc, true);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-left font-semibold transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                  }`}
                >
                  <span className="text-xs">{role.label}</span>
                  <span className={`text-[10px] font-mono opacity-80 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                    {role.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Academic Level & Lapso Switcher */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Nivel Educativo & Lapso
          </span>

          <div className="grid grid-cols-3 gap-1.5 font-bold">
            {(['INICIAL', 'PRIMARIA', 'MEDIA_GENERAL'] as EducationalLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setCurrentLevel(lvl);
                  onShowToast(`Nivel cambiado: ${lvl}`, undefined, true);
                }}
                className={`py-1.5 px-2 rounded-xl text-[10px] text-center uppercase tracking-wider transition ${
                  currentLevel === lvl
                    ? 'bg-sky-500 text-slate-950 font-black'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                {lvl === 'MEDIA_GENERAL' ? 'Media Gen.' : lvl}
              </button>
            ))}
          </div>

          {/* Lapso Selector */}
          <div className="flex items-center gap-1.5 font-bold pt-1">
            <span className="text-[11px] text-slate-400 font-mono mr-1">Lapso:</span>
            {([1, 2, 3] as const).map((l) => (
              <button
                key={l}
                onClick={() => {
                  setActiveLapso(l);
                  onShowToast(`Lapso activo: ${l}° Lapso`, undefined, true);
                }}
                className={`flex-1 py-1 rounded-xl text-xs font-mono font-bold transition ${
                  activeLapso === l
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                {l}° Lapso
              </button>
            ))}
          </div>
        </div>

        {/* 4. Engineering Toggles (Offline / Debug Grid) */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Entorno y Simulación
          </span>

          <div className="grid grid-cols-2 gap-2">
            {/* Offline Simulator Toggle */}
            <button
              onClick={() => {
                const next = !isSimulatedOffline;
                setIsSimulatedOffline(next);
                onShowToast(
                  next ? 'Modo Offline Simulado: ACTIVADO' : 'Modo Offline: DESACTIVADO',
                  next ? 'Probando funcionamiento y guardado sin internet' : 'Conectividad normal restaurada',
                  true
                );
              }}
              className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 transition ${
                isSimulatedOffline
                  ? 'bg-rose-950/70 border-rose-500/60 text-rose-200'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {isSimulatedOffline ? <WifiOff className="w-4 h-4 text-rose-400" /> : <Wifi className="w-4 h-4 text-slate-400" />}
                Offline Test
              </div>
              <span className="text-[10px] opacity-70">
                {isSimulatedOffline ? 'Sin conexión (ON)' : 'Online normal'}
              </span>
            </button>

            {/* Layout Grid Debug Toggle */}
            <button
              onClick={() => {
                const next = !isDebugGridActive;
                setIsDebugGridActive(next);
                onShowToast(
                  next ? 'Debug Grid: ACTIVADO' : 'Debug Grid: DESACTIVADO',
                  next ? 'Resaltando contenedores con bordes guía' : 'Vista normal',
                  true
                );
              }}
              className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 transition ${
                isDebugGridActive
                  ? 'bg-amber-950/70 border-amber-500/60 text-amber-200'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Grid className="w-4 h-4 text-amber-400" />
                Debug Grid
              </div>
              <span className="text-[10px] opacity-70">
                {isDebugGridActive ? 'Líneas guía (ON)' : 'Oculto'}
              </span>
            </button>
          </div>
        </div>

        {/* 5. Diagnostics and Actions */}
        <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
          <button
            onClick={handleCopyDiagnostics}
            className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs transition flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? '¡Diagnóstico Copiado!' : 'Copiar Diagnóstico del Sistema (JSON)'}
          </button>

          <button
            onClick={handleResetData}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Restablecer Datos Semilla Originales
          </button>
        </div>
      </div>
    </aside>
  );
};
