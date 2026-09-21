import React, { useState } from 'react';
import { PlanQuincenal } from '../../types';
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  Download,
  X,
  FileText,
  Sparkles,
  School
} from 'lucide-react';

interface SharePlanModalProps {
  plan: PlanQuincenal;
  areaName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SharePlanModal: React.FC<SharePlanModalProps> = ({
  plan,
  areaName,
  isOpen,
  onClose
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareableUrl = `${currentUrl.split('?')[0]}?planId=${plan.id}&level=${plan.level}`;

  // Formato oficial de texto para compartir por WhatsApp / Correo
  const formatPlanSummary = () => {
    const isPrimaria = plan.level === 'PRIMARIA';
    const nivelLabel = isPrimaria ? 'Educación Primaria' : 'Educación Media General';
    const ejeLabel = isPrimaria ? 'Componente' : 'Tema Generador';
    const ejeValor = isPrimaria ? (plan.componente || plan.projectTheme) : (plan.temaGenerador || plan.projectTheme);

    let summary = `*U.C.E. COLEGIO BELLAS ARTES - PLANIFICACIÓN DIDÁCTICA OFICIAL*\n`;
    summary += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    summary += `📌 *Nivel:* ${nivelLabel}\n`;
    summary += `📚 *Área:* ${areaName}\n`;
    summary += `👨‍🏫 *Docente:* ${plan.docenteName || 'Docente Titular'}\n`;
    summary += `👥 *Curso/Grado:* ${plan.gradeSection}\n`;
    summary += `🗓️ *Lapso:* ${plan.lapso}° Lapso | Año Escolar ${plan.schoolYear || '2026 - 2027'}\n`;
    summary += `⏱️ *Período:* ${plan.periodoQuincenal || `${plan.startDate} al ${plan.endDate}`}\n`;
    summary += `🎯 *${ejeLabel}:* ${ejeValor}\n\n`;

    if (plan.rows && plan.rows.length > 0) {
      summary += `📝 *Matriz Curricular (${plan.rows.length} contenidos):*\n`;
      plan.rows.forEach((r, idx) => {
        summary += `\n*${idx + 1}. ${isPrimaria ? 'Contenido' : 'Referente'}:* ${r.contenidoOReferente}\n`;
        summary += `   • *Aprendizaje:* ${r.aprendizajesEsperados.substring(0, 100)}...\n`;
        if (r.ponderacionPercent) {
          summary += `   • *Ponderación:* ${r.ponderacionPercent}%\n`;
        }
      });
    }

    summary += `\n🔗 *Ver en SICE-CBA:* ${shareableUrl}\n`;
    summary += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    return summary;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(formatPlanSummary());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(formatPlanSummary());
    const waUrl = `https://api.whatsapp.com/send?text=${text}`;
    window.open(waUrl, '_blank');
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    const safeTitle = (plan.title || 'Plan_Didactico').replace(/\s+/g, '_');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${safeTitle}_CBA.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#2C2E53] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#1B1C33] flex items-center justify-center font-black shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                Compartir Planificación Didáctica
              </h3>
              <p className="text-xs text-slate-300">
                {areaName} • {plan.gradeSection} ({plan.level === 'PRIMARIA' ? 'Primaria' : 'Media General'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl flex items-start gap-3">
            <School className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              Puedes compartir esta planificación didáctica directamente con docentes del área, coordinación pedagógica o el departamento de control de estudios mediante las siguientes vías oficiales.
            </p>
          </div>

          {/* WhatsApp Direct Share */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 font-bold text-xs transition-all group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block font-black text-sm text-emerald-900 dark:text-emerald-200">
                  Enviar por WhatsApp
                </span>
                <span className="text-[11px] font-normal text-emerald-700 dark:text-emerald-400">
                  Genera un mensaje estructurado con el resumen oficial y enlace
                </span>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              Enviar →
            </span>
          </button>

          {/* Copy Direct Link */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Enlace directo al documento en SICE-CBA:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2C2E53] hover:bg-[#383b69] text-white font-bold rounded-xl text-xs shrink-0 transition-colors shadow-sm"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Additional Actions Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleCopyText}
              className="flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>¡Resumen Copiado!</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Copiar Resumen</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadJSON}
              className="flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Descargar JSON</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
