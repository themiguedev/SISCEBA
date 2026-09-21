import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck,
  X
} from 'lucide-react';
import { LogoSeasonalAccessory } from './LogoSeasonalAccessory';

interface LoginViewProps {
  onLoginSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { login, users } = useApp();

  const [username, setUsername] = useState(() => {
    return localStorage.getItem('sisceba_remembered_user') || 'admin';
  });
  const [password, setPassword] = useState('cba2026*admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [loginState, setLoginState] = useState<'IDLE' | 'LOADING' | 'SUCCESS'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [userFocused, setUserFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Por favor ingrese su usuario institucional.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Por favor ingrese su contraseña.');
      return;
    }

    setLoginState('LOADING');
    setErrorMsg('');

    if (rememberMe) {
      localStorage.setItem('sisceba_remembered_user', username);
    } else {
      localStorage.removeItem('sisceba_remembered_user');
    }

    setTimeout(() => {
      const ok = login(username, password);
      if (!ok) {
        setLoginState('IDLE');
        setErrorMsg('Contraseña incorrecta para el usuario indicado.');
        return;
      }

      setLoginState('SUCCESS');
      setTimeout(() => {
        onLoginSuccess?.();
      }, 350);
    }, 450);
  };

  const handlePasswordKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState('CapsLock'));
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden select-none font-sans bg-[#141525]">
      {/* SICE-CBA Institutional Ambient Lighting (Navy #1B1C33 & Gold #D4AF37) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Institutional Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#141525] via-[#1B1C33] to-[#2C2E53]" />

        {/* Ambient Gold & Sapphire Glows */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-[#D4AF37]/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#2C2E53]/60 blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#D4AF37]/5 blur-[160px] pointer-events-none" />

        {/* Silky diagonal lighting ribbons with institutional palette */}
        <div className="absolute -top-[30%] -left-[20%] w-[160%] h-[160%] opacity-25 pointer-events-none">
          <div
            className="absolute top-[10%] left-[-10%] w-[120%] h-[280px] bg-gradient-to-b from-white/30 via-[#D4AF37]/20 to-transparent rotate-[-28deg] blur-2xl transform-gpu animate-pulse"
            style={{ animationDuration: '8s' }}
          />
          <div className="absolute top-[35%] left-[-15%] w-[130%] h-[180px] bg-gradient-to-b from-white/20 via-indigo-300/15 to-transparent rotate-[-30deg] blur-xl transform-gpu" />
          <div
            className="absolute top-[55%] left-[-10%] w-[120%] h-[220px] bg-gradient-to-b from-[#D4AF37]/20 via-white/10 to-transparent rotate-[-26deg] blur-2xl transform-gpu animate-pulse"
            style={{ animationDuration: '10s' }}
          />
          <div className="absolute top-[75%] left-[-20%] w-[140%] h-[260px] bg-gradient-to-b from-white/25 via-[#2C2E53]/30 to-transparent rotate-[-32deg] blur-2xl transform-gpu" />
        </div>
      </div>

      {/* Main Central Card - Clean, perfectly centered */}
      <div className="relative z-10 w-full max-w-[430px] bg-white rounded-none sm:rounded-[3px] shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-[#D4AF37]/30 px-8 sm:px-10 pt-8 pb-10 transition-all duration-300 animate-in fade-in zoom-in-95">
        {/* Title: UNIDAD EDUCATIVA - BELLAS ARTES with Golden Accent Line */}
        <div className="text-center pb-4 mb-5 border-b border-slate-200 relative">
          <h1 className="text-base sm:text-[17px] font-extrabold text-[#2C2E53] tracking-wide uppercase font-sans">
            UNIDAD EDUCATIVA - BELLAS ARTES
          </h1>
          {/* Subtle Institutional Gold Accent Line */}
          <div className="absolute -bottom-[1px] left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        </div>

        {/* Institutional Crest Logo with Seasonal Festive Accessory */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 -m-3 rounded-full bg-white/5 dark:bg-white/10 blur-xl pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300" />
            <LogoSeasonalAccessory />
          </div>
          <p className="text-[11px] text-slate-500 font-semibold mt-3 text-center tracking-tight">
            Sistema Integral de Control y Evaluación • <span className="text-[#D4AF37] font-bold">SICE-CBA</span>
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {errorMsg && (
            <div className="p-2.5 rounded-[2px] bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium flex items-center justify-center gap-1.5 animate-in fade-in duration-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Campo: Usuario */}
          <div
            className={`flex rounded-[2px] border transition-all duration-200 bg-white h-10 overflow-hidden ${
              userFocused
                ? 'border-[#2C2E53] ring-1 ring-[#D4AF37]/50 shadow-xs'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <div
              className={`w-10 flex items-center justify-center border-r transition-colors duration-200 shrink-0 ${
                userFocused
                  ? 'bg-[#2C2E53] border-[#2C2E53] text-[#D4AF37]'
                  : 'bg-slate-100 border-slate-300 text-slate-600'
              }`}
            >
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setUserFocused(true)}
              onBlur={() => setUserFocused(false)}
              placeholder="Usuario"
              className="w-full px-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              autoComplete="username"
            />
          </div>

          {/* Campo: Contraseña */}
          <div className="space-y-1">
            <div
              className={`flex rounded-[2px] border transition-all duration-200 bg-white h-10 overflow-hidden ${
                passFocused
                  ? 'border-[#2C2E53] ring-1 ring-[#D4AF37]/50 shadow-xs'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <div
                className={`w-10 flex items-center justify-center border-r transition-colors duration-200 shrink-0 ${
                  passFocused
                    ? 'bg-[#2C2E53] border-[#2C2E53] text-[#D4AF37]'
                    : 'bg-slate-100 border-slate-300 text-slate-600'
                }`}
              >
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handlePasswordKey}
                onKeyDown={handlePasswordKey}
                onFocus={() => setPassFocused(true)}
                onBlur={() => {
                  setPassFocused(false);
                  setCapsLockActive(false);
                }}
                placeholder="Contraseña"
                className="w-full px-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-2.5 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
                tabIndex={-1}
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* CapsLock Warning Indicator */}
            {capsLockActive && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold text-amber-800 bg-amber-50 rounded border border-amber-200 animate-in fade-in duration-150">
                <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                <span>Bloq Mayús está activado</span>
              </div>
            )}
          </div>

          {/* Opciones prácticas: Recordar y Ayuda */}
          <div className="flex items-center justify-between pt-0.5 text-[11px] text-slate-500">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#2C2E53] transition select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded-[2px] border-slate-300 text-[#2C2E53] focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
              <span>Recordar usuario</span>
            </label>

            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="text-slate-500 hover:text-[#2C2E53] hover:underline transition-colors cursor-pointer"
            >
              ¿Ayuda para acceder?
            </button>
          </div>

          {/* Botón: INGRESAR (Paleta SICE-CBA: Azul Marino #2C2E53 + Texto Dorado #D4AF37) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loginState !== 'IDLE'}
              className={`w-full h-10 rounded-[2px] font-black text-xs tracking-widest uppercase transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer border ${
                loginState === 'SUCCESS'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-gradient-to-r from-[#2C2E53] via-[#242646] to-[#1B1C33] hover:from-[#353866] hover:to-[#242646] text-[#D4AF37] border-[#D4AF37]/50 hover:border-[#D4AF37] shadow-[#2C2E53]/40 hover:shadow-lg hover:shadow-[#D4AF37]/15 active:translate-y-[0.5px]'
              }`}
            >
              {loginState === 'LOADING' && (
                <span className="inline-flex items-center gap-2 text-[#D4AF37]">
                  <span className="w-3.5 h-3.5 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
                  <span>Autenticando...</span>
                </span>
              )}
              {loginState === 'SUCCESS' && (
                <span className="inline-flex items-center gap-1.5 animate-in zoom-in-95">
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>¡Bienvenido/a!</span>
                </span>
              )}
              {loginState === 'IDLE' && <span>INGRESAR</span>}
            </button>
          </div>

          {/* Cuentas de Prueba por Modo de Operación */}
          <div className="pt-3 mt-3 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
              Cuentas de Prueba por Modo de Operación
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {users.map((u) => {
                const isSelected = username.toLowerCase() === u.username.toLowerCase();
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setUsername(u.username);
                      setPassword(u.password || '');
                      setErrorMsg('');
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition border cursor-pointer ${
                      isSelected
                        ? 'bg-[#2C2E53] text-[#D4AF37] border-[#D4AF37] shadow-sm scale-105'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                    title={`Usuario: ${u.username} • Rol: ${u.role}`}
                  >
                    {u.role === 'ADMINISTRADOR' && '👑 Admin'}
                    {u.role === 'DIRECTOR' && '🏛️ Director'}
                    {u.role === 'COORDINACION' && '📋 Coord.'}
                    {u.role === 'DOCENTE' && (u.defaultLevel === 'PRIMARIA' ? '🎨 Doc. Primaria' : '🔬 Doc. Media')}
                    {u.role === 'REPRESENTANTE' && '👨‍👩‍👦 Representante'}
                    {u.role === 'ESTUDIANTE' && '🎒 Estudiante'}
                  </button>
                );
              })}
            </div>
            <p className="text-[9px] text-slate-400 text-center mt-2 italic">
              Haz clic en cualquiera para autocompletar sus credenciales oficiales.
            </p>
          </div>
        </form>
      </div>

      {/* Modal de Asistencia Rápida Institucional */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#2C2E53]">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-bold text-sm">Soporte y Restablecimiento</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Si ha extraviado sus credenciales institucionales o su cuenta requiere desbloqueo, comuníquese con el departamento encargado:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#2C2E53] shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Control de Estudios (UCE)</span>
                  <span className="text-[11px] text-slate-500">Extensión interna CBA: 104</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#2C2E53] shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Coordinación de Evaluación</span>
                  <span className="text-[11px] text-slate-500">soporte@colegiobellasartes.edu.ve</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold rounded-lg transition shadow-md"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
