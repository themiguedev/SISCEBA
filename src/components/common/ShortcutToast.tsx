import React from 'react';
import { Keyboard, Terminal, CheckCircle2 } from 'lucide-react';

export interface ShortcutToastMessage {
  id: string;
  title: string;
  description?: string;
  isDev?: boolean;
}

interface ShortcutToastProps {
  toast: ShortcutToastMessage | null;
  onClose: () => void;
}

export const ShortcutToast: React.FC<ShortcutToastProps> = ({ toast }) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-2xl border text-xs font-semibold backdrop-blur-md transition-all ${
          toast.isDev
            ? 'bg-[#141525]/95 text-amber-300 border-amber-500/40 ring-2 ring-amber-500/20'
            : 'bg-[#2C2E53]/95 text-white border-[#D4AF37]/50 ring-2 ring-[#D4AF37]/20'
        }`}
      >
        <div
          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
            toast.isDev
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-[#D4AF37]/25 text-[#D4AF37]'
          }`}
        >
          {toast.isDev ? (
            <Terminal className="w-3.5 h-3.5" />
          ) : (
            <Keyboard className="w-3.5 h-3.5" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wide">{toast.title}</span>
            {toast.isDev && (
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 font-mono font-black border border-amber-400/30">
                DEV
              </span>
            )}
          </div>
          {toast.description && (
            <p className="text-[11px] opacity-80 font-normal mt-0.5">
              {toast.description}
            </p>
          )}
        </div>

        <CheckCircle2 className="w-4 h-4 opacity-70 ml-1 shrink-0" />
      </div>
    </div>
  );
};
