import React, { useState } from 'react';
import { NotificationDeliveryChannel } from '../../types';
import {
  Send,
  CheckCircle2,
  Users,
  Globe,
  Mail,
  Smartphone,
  Sparkles,
  ShieldCheck,
  X,
  School,
  AlertCircle
} from 'lucide-react';

interface PublishGradesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (channels: NotificationDeliveryChannel[]) => void;
  areaName: string;
  lapso: number;
  studentCount: number;
  gradeSection: string;
}

export const PublishGradesModal: React.FC<PublishGradesModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  areaName,
  lapso,
  studentCount,
  gradeSection
}) => {
  const [channels, setChannels] = useState<NotificationDeliveryChannel[]>([
    'PORTAL',
    'EMAIL',
    'SMS_WHATSAPP'
  ]);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchProgress, setDispatchProgress] = useState(0);
  const [dispatchStatusText, setDispatchStatusText] = useState('');

  if (!isOpen) return null;

  const toggleChannel = (channel: NotificationDeliveryChannel) => {
    if (channels.includes(channel)) {
      if (channels.length === 1) return; // Keep at least one
      setChannels(channels.filter((c) => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  const handleStartDispatch = () => {
    setIsDispatching(true);
    setDispatchProgress(15);
    setDispatchStatusText('1/3 • Validando consistencia de actas e indicadores...');

    setTimeout(() => {
      setDispatchProgress(55);
      setDispatchStatusText(`2/3 • Generando notificaciones digitales para ${studentCount} estudiantes y representantes...`);
    }, 600);

    setTimeout(() => {
      setDispatchProgress(90);
      setDispatchStatusText('3/3 • Despachando avisos omnicanal por Portal, Correo y SMS/WhatsApp...');
    }, 1200);

    setTimeout(() => {
      setDispatchProgress(100);
      setDispatchStatusText('¡Completado! Calificaciones publicadas y notificaciones entregadas.');
      setTimeout(() => {
        onConfirm(channels);
        setIsDispatching(false);
        setDispatchProgress(0);
        onClose();
      }, 500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1B1C33] rounded-3xl max-w-lg w-full border border-slate-200 dark:border-[#414474] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#1B1C33] to-[#252747] text-white flex items-center justify-between border-b border-[#414474]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-slate-950 flex items-center justify-center font-black shadow-md">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide">
                Publicar Calificaciones & Notificar
              </h3>
              <p className="text-xs text-slate-300">
                {areaName} • {gradeSection}
              </p>
            </div>
          </div>
          {!isDispatching && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              title="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Summary Box */}
          <div className="bg-slate-50 dark:bg-[#141525] p-4 rounded-2xl border border-slate-200 dark:border-[#2C2E53] grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-500 font-bold block text-[10px] uppercase">
                Destinatarios Totales
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 text-slate-800 dark:text-slate-200 font-black">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                <span>{studentCount} Estudiantes + {studentCount} Padres</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 font-bold block text-[10px] uppercase">
                Lapso Académico
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 text-slate-800 dark:text-slate-200 font-black">
                <School className="w-4 h-4 text-sky-400" />
                <span>Lapso {lapso} (En Curso)</span>
              </div>
            </div>
          </div>

          {/* Delivery Channels Selector */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
              Canales de Entrega Inmediata:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Channel 1: Portal */}
              <button
                type="button"
                disabled={isDispatching}
                onClick={() => toggleChannel('PORTAL')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  channels.includes('PORTAL')
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <input
                    type="checkbox"
                    checked={channels.includes('PORTAL')}
                    readOnly
                    className="accent-emerald-600 rounded"
                  />
                </div>
                <span className="text-xs font-bold block">Portal CBA</span>
                <span className="text-[10px] opacity-75">Bandeja oficial</span>
              </button>

              {/* Channel 2: Email */}
              <button
                type="button"
                disabled={isDispatching}
                onClick={() => toggleChannel('EMAIL')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  channels.includes('EMAIL')
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 text-sky-900 dark:text-sky-200'
                    : 'border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Mail className="w-4 h-4 text-sky-500" />
                  <input
                    type="checkbox"
                    checked={channels.includes('EMAIL')}
                    readOnly
                    className="accent-sky-600 rounded"
                  />
                </div>
                <span className="text-xs font-bold block">Correo Digital</span>
                <span className="text-[10px] opacity-75">Boletín adjunto</span>
              </button>

              {/* Channel 3: SMS/WhatsApp */}
              <button
                type="button"
                disabled={isDispatching}
                onClick={() => toggleChannel('SMS_WHATSAPP')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  channels.includes('SMS_WHATSAPP')
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 text-teal-900 dark:text-teal-200'
                    : 'border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Smartphone className="w-4 h-4 text-teal-500" />
                  <input
                    type="checkbox"
                    checked={channels.includes('SMS_WHATSAPP')}
                    readOnly
                    className="accent-teal-600 rounded"
                  />
                </div>
                <span className="text-xs font-bold block">SMS / WhatsApp</span>
                <span className="text-[10px] opacity-75">Aviso móvil</span>
              </button>
            </div>
          </div>

          {/* Message Live Preview */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
              Previsualización del Mensaje al Representante:
            </label>
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-[#141525] border border-slate-200 dark:border-[#2C2E53] text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
              <span className="text-[#D4AF37] font-bold block mb-1">
                🔔 U.E.P. Colegio Bellas Artes • SICE-CBA
              </span>
              Estimado(a) Representante de Sofía Chacín: Le informamos que el docente titular ha publicado las calificaciones del <strong className="text-slate-900 dark:text-white">Lapso {lapso}</strong> en el área de <strong className="text-slate-900 dark:text-white">{areaName}</strong>. Ya puede consultar el boletín e indicadores de desempeño en el portal institucional.
            </div>
          </div>

          {/* Dispatch Progress Animation */}
          {isDispatching && (
            <div className="space-y-2 p-3.5 rounded-2xl bg-amber-500/10 border border-[#D4AF37]/40 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-[#D4AF37]">
                <span>{dispatchStatusText}</span>
                <span>{dispatchProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-amber-400 transition-all duration-300"
                  style={{ width: `${dispatchProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-[#141525] border-t border-slate-200 dark:border-[#2C2E53] flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={isDispatching}
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            Cancelar / Solo Guardar
          </button>

          <button
            type="button"
            disabled={isDispatching}
            onClick={handleStartDispatch}
            className="px-5 py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-extrabold text-xs shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isDispatching ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                <span>Despachando...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Confirmar y Despachar Notificaciones</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
