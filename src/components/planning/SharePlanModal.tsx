import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { PlanQuincenal } from '../../types';
import {
  openClassroomShareWindow,
  generateClassroomTaskDescription,
  generateClassroomBodyParam,
  copyClassroomTaskToClipboard
} from '../../utils/googleClassroom';
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  X,
  FileText,
  School,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface SharePlanModalProps {
  plan: PlanQuincenal;
  areaName: string;
  isOpen: boolean;
  onClose: () => void;
}

// Icono Oficial de Google Classroom (Chalkboard con marco amarillo)
const GoogleClassroomIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <rect width="42" height="34" x="3" y="7" rx="5" fill="#1E8E3E" stroke="#F9AB00" strokeWidth="2.5" />
    <circle cx="24" cy="17" r="3" fill="#FFFFFF" />
    <path d="M24 22c-3 0-6 1.5-6 3v2h12v-2c0-1.5-3-3-6-3z" fill="#FFFFFF" />
    <circle cx="15" cy="18" r="2.3" fill="#E8EAED" opacity="0.9" />
    <path d="M15 22.5c-2.3 0-4.5 1.1-4.5 2.3v2.2h9v-2.2c0-1.2-2.2-2.3-4.5-2.3z" fill="#E8EAED" opacity="0.9" />
    <circle cx="33" cy="18" r="2.3" fill="#E8EAED" opacity="0.9" />
    <path d="M33 22.5c-2.3 0-4.5 1.1-4.5 2.3v2.2h9v-2.2c0-1.2-2.2-2.3-4.5-2.3z" fill="#E8EAED" opacity="0.9" />
    <rect x="8" y="32" width="32" height="2" rx="1" fill="#FFFFFF" opacity="0.6" />
  </svg>
);

export const SharePlanModal: React.FC<SharePlanModalProps> = ({
  plan,
  areaName,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'CLASSROOM' | 'INSTITUCIONAL'>('CLASSROOM');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedClassroomText, setCopiedClassroomText] = useState(false);
  const [showClassroomPreview, setShowClassroomPreview] = useState(false);
  const [justOpenedClassroom, setJustOpenedClassroom] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareableUrl = `${currentUrl.split('?')[0]}?planId=${plan.id}&level=${plan.level}`;
  const planTitle = `[${areaName}] ${plan.title || 'Planificación Didáctica'} - ${plan.gradeSection}`;

  // Resumen oficial para WhatsApp / Correo
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

  // 1. Acciones Google Classroom
  const handleOpenClassroomShare = async () => {
    const classroomBody = generateClassroomBodyParam(plan, areaName, shareableUrl);
    await copyClassroomTaskToClipboard(plan, areaName, shareableUrl);
    setCopiedClassroomText(true);
    setJustOpenedClassroom(true);
    openClassroomShareWindow(shareableUrl, planTitle, classroomBody);
  };

  const handleCopyClassroomTask = async () => {
    const success = await copyClassroomTaskToClipboard(plan, areaName, shareableUrl);
    if (success) {
      setCopiedClassroomText(true);
      setTimeout(() => setCopiedClassroomText(false), 3000);
    }
  };

  // 2. Acciones Institucionales (WhatsApp, Link, JSON)
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

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#2C2E53] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#1B1C33] flex items-center justify-center font-black shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                Conectar y Compartir Planificación
              </h3>
              <p className="text-xs text-slate-300">
                {areaName} • {plan.gradeSection} ({plan.level === 'PRIMARIA' ? 'Primaria' : plan.level === 'INICIAL' ? 'Inicial' : 'Media General'})
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('CLASSROOM')}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all border-b-2 ${
              activeTab === 'CLASSROOM'
                ? 'bg-white dark:bg-slate-900 border-[#1E8E3E] text-slate-900 dark:text-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <GoogleClassroomIcon className="w-4 h-4" />
            <span>Google Classroom</span>
            <span className="px-1.5 py-0.5 text-[10px] font-black rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Conexión
            </span>
          </button>

          <button
            onClick={() => setActiveTab('INSTITUCIONAL')}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all border-b-2 ${
              activeTab === 'INSTITUCIONAL'
                ? 'bg-white dark:bg-slate-900 border-[#D4AF37] text-slate-900 dark:text-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <School className="w-4 h-4 text-[#D4AF37]" />
            <span>Institucional / Enlaces</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {activeTab === 'CLASSROOM' && (
            <div className="space-y-4">
              {/* Classroom Hero Card */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/40 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-emerald-900/30 border border-emerald-300 dark:border-emerald-800/60 rounded-2xl flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-md shrink-0 border border-emerald-200 dark:border-emerald-800">
                  <GoogleClassroomIcon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="font-extrabold text-sm text-emerald-950 dark:text-emerald-200">
                    Sincronización con Google Classroom
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5 leading-relaxed">
                    Publica esta planificación didáctica directamente en tu clase de Google Classroom como <strong>Material Didáctico</strong>, <strong>Anuncio</strong> o crea una <strong>Tarea oficial</strong> con instrucciones y criterios de evaluación.
                  </p>
                </div>
              </div>

              {/* Botón 1: Publicar en Google Classroom vía Share Dialog */}
              <button
                onClick={handleOpenClassroomShare}
                className="w-full flex items-center justify-between p-4 bg-[#1E8E3E] hover:bg-[#187532] text-white rounded-2xl font-black text-xs transition-all shadow-md group hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-extrabold text-white">
                      Publicar Directamente en Google Classroom
                    </span>
                    <span className="text-[11px] font-normal text-emerald-100">
                      Pre-carga el título, enlace e instrucciones con emojis y espaciado en Classroom
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-300 group-hover:translate-x-1 transition-transform">
                  Abrir Classroom →
                </span>
              </button>

              {/* Banner de confirmación cuando se abre Classroom */}
              {justOpenedClassroom && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 dark:border-emerald-500 rounded-2xl flex items-start gap-3.5 animate-in fade-in duration-300 shadow-md">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow">
                    <Check className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed space-y-1.5">
                    <strong className="block text-sm font-extrabold text-emerald-900 dark:text-emerald-200">
                      💡 Para ver los saltos de línea (Enters) perfectos en Classroom:
                    </strong>
                    <p className="text-emerald-800 dark:text-emerald-300">
                      Google Classroom aplana automáticamente los "Enters" en su enlace web. Para ver todos los renglones separados con sus espacios dobles, viñetas y negritas, haz clic en <strong>Instrucciones</strong> y pulsa:
                    </p>
                    <div className="flex items-center gap-2 pt-1 font-bold">
                      <kbd className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg border border-emerald-300 shadow-sm font-mono text-xs text-slate-800 dark:text-slate-200">
                        Ctrl + A
                      </kbd>
                      <span className="text-slate-400 font-normal">luego</span>
                      <kbd className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg border border-emerald-700 shadow-sm font-mono text-xs">
                        Ctrl + V
                      </kbd>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón 2: Copiar Formato Tarea de Classroom */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                      Plantilla Estructurada para Tarea de Classroom
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Actividades (Inicio/Desarrollo/Cierre), criterios y escala adaptada ({plan.level === 'MEDIA_GENERAL' ? '01-20 Vigesimal' : plan.level === 'PRIMARIA' ? 'Cualitativa L-P-I' : 'Literal'})
                    </p>
                  </div>

                  <button
                    onClick={handleCopyClassroomTask}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2C2E53] hover:bg-[#383b69] text-white font-bold rounded-xl text-xs shrink-0 transition-colors shadow-sm"
                  >
                    {copiedClassroomText ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#D4AF37]" />
                        <span>Copiar Instrucciones</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Acordeón para previsualizar */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowClassroomPreview(!showClassroomPreview)}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {showClassroomPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    <span>{showClassroomPreview ? 'Ocultar vista previa de la Tarea' : 'Ver vista previa del texto estructurado'}</span>
                  </button>

                  {showClassroomPreview && (
                    <div className="mt-2.5 p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 max-h-56 overflow-y-auto text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap select-all leading-relaxed shadow-inner">
                      {generateClassroomTaskDescription(plan, areaName, shareableUrl)}
                    </div>
                  )}
                </div>
              </div>

              {/* Tip de formato */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Estructura con emojis y espaciado:</strong> La plantilla organiza los datos con divisores visuales, emojis temáticos (🏛️, 📚, 🎯, 🔹, 1️⃣, 💯) y párrafos dobles para que al presionar <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-amber-300 font-mono text-[10px]">Ctrl + V</kbd> en Google Classroom se conserve una lectura limpia y ordenada.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'INSTITUCIONAL' && (
            <div className="space-y-4">
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

              {/* Additional Actions */}
              <div className="pt-2">
                <button
                  onClick={handleCopyText}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
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
              </div>
            </div>
          )}
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

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
