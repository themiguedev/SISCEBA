import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PasswordStrengthBar } from '../common/PasswordStrengthBar';
import {
  RotateCcw,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  X,
  Check
} from 'lucide-react';

interface ResetAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (username: string) => void;
}

export const ResetAccountModal: React.FC<ResetAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { users, updateUser } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanIdentifier || !cleanEmail || !newPassword.trim()) {
      setErrorMessage('Por favor complete todos los campos requeridos (*).');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas ingresadas no coinciden.');
      return;
    }

    // 1. Localizar la cuenta institucional previamente creada y autorizada
    const targetUser = users.find(
      u => u.username.toLowerCase() === cleanIdentifier || u.email.toLowerCase() === cleanEmail
    );

    if (!targetUser) {
      setErrorMessage('No se encontró ninguna cuenta registrada con esos datos de usuario o correo.');
      return;
    }

    // 2. Verificar correspondencia estricta del correo registrado de la cuenta
    if (targetUser.email && targetUser.email.toLowerCase() !== cleanEmail) {
      setErrorMessage('El correo institucional no coincide con el registrado en su cuenta institucional.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 3. Actualizar la contraseña directamente (sin requerir segunda verificación/código)
      const updated = await updateUser(targetUser.id, {
        password: newPassword,
        active: true // Reactivar cuenta en caso de bloqueo por intentos
      });

      if (!updated) {
        setIsSubmitting(false);
        setErrorMessage('No se pudo actualizar la contraseña en la base de datos.');
        return;
      }

      setSuccessMessage('¡Contraseña actualizada exitosamente! Redirigiendo al portal de acceso...');
      setIsSubmitting(false);

      setTimeout(() => {
        onSuccess(targetUser.username);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setErrorMessage('Ocurrió un error inesperado al actualizar la contraseña.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header Institucional CBA */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#1B1C33] via-[#242646] to-[#2C2E53] text-white flex items-center justify-between border-b border-[#D4AF37]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                Restablecer Contraseña de Cuenta
              </h3>
              <p className="text-[11px] text-slate-300">
                Acceso directo para cuentas institucionales registradas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario Directo */}
        <form onSubmit={handleReset} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Mensajes de Estado */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Banner Informativo */}
          <div className="p-3.5 rounded-xl bg-[#1B1C33]/5 dark:bg-[#1B1C33]/10 border border-[#2C2E53]/20 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#2C2E53] shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-700 leading-relaxed">
              <span className="font-bold text-[#2C2E53] block">
                Restablecimiento Directo de Cuenta
              </span>
              Como su cuenta ya fue autorizada y dada de alta institucionalmente, solo ingrese su usuario o cédula junto con su correo registrado para definir su nueva clave.
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Usuario / Cédula */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nombre de Usuario o Cédula *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ej: cvillalobos o V-18452991"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#2C2E53] outline-none font-mono text-slate-800"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Correo Electrónico Registrado */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Correo Electrónico Registrado en la Cuenta *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Ej: cvillalobos@bellasartes.edu.ve"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#2C2E53] outline-none text-slate-800"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Nueva Contraseña */}
            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block font-bold text-slate-700 mb-1">
                Nueva Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Ingrese su nueva contraseña segura"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2C2E53] outline-none text-slate-800 font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <PasswordStrengthBar
                password={newPassword}
                onGeneratePassword={(gen) => setNewPassword(gen)}
                showGeneratorButton={true}
              />

              <div className="pt-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Confirmar Nueva Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repita su nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2C2E53] outline-none text-slate-800 font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-bold transition rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-[#2C2E53] via-[#242646] to-[#1B1C33] hover:from-[#353866] hover:to-[#242646] text-[#D4AF37] font-black rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
                  <span>Actualizando Contraseña...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 text-[#D4AF37]" />
                  <span>Restablecer y Acceder</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
