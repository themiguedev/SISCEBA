import React from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, Sparkles } from 'lucide-react';
import { evaluatePasswordStrength, generateStrongPassword } from '../../utils/passwordUtils';

interface PasswordStrengthBarProps {
  password: string;
  onGeneratePassword?: (suggested: string) => void;
  showGeneratorButton?: boolean;
}

export const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({
  password,
  onGeneratePassword,
  showGeneratorButton = true
}) => {
  const { score, label, color, barWidth, feedback } = evaluatePasswordStrength(password);

  const handleGenerate = () => {
    const generated = generateStrongPassword(16);
    if (onGeneratePassword) {
      onGeneratePassword(generated);
    }
  };

  return (
    <div className="space-y-1.5 pt-1">
      {/* Barra de progreso visual amigable */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${color}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>

        {password ? (
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
            {label}
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 shrink-0">
            Seguridad
          </span>
        )}
      </div>

      {/* Retroalimentación o botón generador */}
      <div className="flex items-center justify-between gap-2 text-[11px]">
        {feedback ? (
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            {score <= 2 ? (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            )}
            <span>{feedback}</span>
          </span>
        ) : (
          <span className="text-slate-400 italic">Mínimo 8 caracteres (mayúsculas, números y símbolos)</span>
        )}

        {showGeneratorButton && onGeneratePassword && (
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2C2E53] hover:text-[#1B1C33] dark:text-[#D4AF37] hover:underline cursor-pointer ml-auto shrink-0 transition"
            title="Generar una contraseña aleatoria de alta seguridad"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Generar clave segura</span>
          </button>
        )}
      </div>
    </div>
  );
};
