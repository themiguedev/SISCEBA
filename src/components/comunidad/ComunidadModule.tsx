import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CommunityNotice } from '../../types';
import { canPublishCommunity } from '../../utils/rbac';
import {
  MessageSquare,
  Megaphone,
  Cake,
  Send,
  Plus,
  Calendar,
  User,
  Users,
  CheckCircle2,
  Pin,
  Sparkles,
  X
} from 'lucide-react';

interface ComunidadModuleProps {
  activeSubTab?: 'NOTICIAS' | 'CUMPLEANOS' | 'COMUNICADOS';
  setActiveSubTab?: (subTab: 'NOTICIAS' | 'CUMPLEANOS' | 'COMUNICADOS') => void;
}

export const ComunidadModule: React.FC<ComunidadModuleProps> = ({
  activeSubTab,
  setActiveSubTab
}) => {
  const { communityNotices, addCommunityNotice, birthdays, currentRole } = useApp();
  const canPublish = canPublishCommunity(currentRole);
  const [internalActiveTab, setInternalActiveTab] = useState<'NOTICIAS' | 'CUMPLEANOS' | 'COMUNICADOS'>('NOTICIAS');

  const activeTab = activeSubTab || internalActiveTab;
  const setActiveTab = (tab: 'NOTICIAS' | 'CUMPLEANOS' | 'COMUNICADOS') => {
    if (setActiveSubTab) {
      setActiveSubTab(tab);
    }
    setInternalActiveTab(tab);
  };
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Notice State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noticeType, setNoticeType] = useState<CommunityNotice['type']>('NOTICIA');
  const [targetAudience, setTargetAudience] = useState<CommunityNotice['targetAudience']>('TODOS');
  const [author, setAuthor] = useState('Dirección General CBA');

  // Broadcast Message State
  const [broadcastTarget, setBroadcastTarget] = useState('REPRESENTANTES');
  const [broadcastChannel, setBroadcastChannel] = useState('SMS_Y_CORREO');
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    addCommunityNotice({
      title,
      content,
      date: new Date().toLocaleDateString('es-VE'),
      type: noticeType,
      targetAudience: targetAudience,
      author: author,
      pinned: false
    });

    setIsNewModalOpen(false);
    setTitle('');
    setContent('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText) return;
    setBroadcastSent(true);
    setBroadcastText('');
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Interacción y Comunidad Escolar
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C2E53] mt-1">Comunidad Bellas Artes</h2>
          <p className="text-xs text-slate-500">
            Cartelera de noticias, anuncios oficiales, calendario de cumpleañeros y comunicados masivos a la comunidad.
          </p>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('NOTICIAS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeTab === 'NOTICIAS'
                ? 'bg-[#261523] text-pink-300 shadow-sm border border-pink-500/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Megaphone className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'NOTICIAS' ? 'text-pink-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Noticias y Avisos</span>
            <span className="sm:hidden">Noticias</span>
          </button>
          <button
            onClick={() => setActiveTab('CUMPLEANOS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeTab === 'CUMPLEANOS'
                ? 'bg-[#261523] text-pink-300 shadow-sm border border-pink-500/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cake className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'CUMPLEANOS' ? 'text-pink-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Cumpleañeros</span>
            <span className="sm:hidden">Cumpleaños</span>
          </button>
          <button
            onClick={() => setActiveTab('COMUNICADOS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeTab === 'COMUNICADOS'
                ? 'bg-[#261523] text-pink-300 shadow-sm border border-pink-500/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Send className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'COMUNICADOS' ? 'text-pink-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Mensajería Masiva</span>
            <span className="sm:hidden">Mensajería</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: NOTICIAS Y ANUNCIOS */}
      {activeTab === 'NOTICIAS' && (
        <div className="space-y-4">
          {canPublish && (
            <div className="flex justify-end">
              <button
                onClick={() => setIsNewModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Publicar Nuevo Anuncio
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityNotices.map((notice) => (
              <div
                key={notice.id}
                className={`bg-white rounded-2xl p-6 border shadow-cba-card space-y-3 relative ${
                  notice.type === 'ANUNCIO_URGENTE'
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : 'border-slate-200'
                }`}
              >
                {notice.pinned && (
                  <span className="absolute top-4 right-4 text-amber-500 flex items-center gap-1 text-[11px] font-bold">
                    <Pin className="w-3.5 h-3.5 fill-amber-500" />
                    Fijado
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      notice.type === 'ANUNCIO_URGENTE'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : notice.type === 'EVENTO'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {notice.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Para: {notice.targetAudience}</span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base leading-snug">{notice.title}</h3>

                <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="font-bold text-slate-700">{notice.author}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#D4AF37]" />
                    {notice.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: CUMPLEAÑEROS */}
      {activeTab === 'CUMPLEANOS' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-[#2C2E53] flex items-center gap-2">
              <Cake className="w-4 h-4 text-[#D4AF37]" />
              Calendario de Cumpleaños de la Comunidad Escolar
            </h3>
            <span className="text-xs text-slate-400">Personal Docente, Administrativo y Estudiantes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {birthdays.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-xl border text-center space-y-1.5 transition ${
                  b.isToday
                    ? 'bg-gradient-to-b from-amber-50 to-amber-100/40 dark:from-amber-950/40 dark:to-amber-900/20 border-amber-300 dark:border-amber-500/40 ring-2 ring-amber-300/50 dark:ring-amber-500/20 shadow-md'
                    : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10'
                }`}
              >
                <div className="w-12 h-12 rounded-full mx-auto bg-[#2C2E53] dark:bg-amber-950/60 dark:border dark:border-amber-500/30 text-[#D4AF37] flex items-center justify-center font-black text-lg shadow-sm">
                  {b.fullName.charAt(0)}
                </div>
                {b.isToday && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white dark:bg-amber-500/20 dark:text-amber-300 dark:border dark:border-amber-500/40 inline-block shadow-xs">
                    ¡Cumpleaños Hoy!
                  </span>
                )}
                <h4 className="font-bold text-xs text-slate-900 dark:text-[#F8FAFC] leading-snug">{b.fullName}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-300">{b.gradeOrArea}</p>
                <p className="text-[11px] font-extrabold text-[#2C2E53] dark:text-amber-300 pt-1">{b.birthDate}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: MENSAJERÍA MASIVA */}
      {activeTab === 'COMUNICADOS' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-cba-card space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-[#2C2E53] flex items-center gap-2">
              <Send className="w-4 h-4 text-[#D4AF37]" />
              Envío de Comunicados y Mensajes Masivos
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              ADM: Difusión de circulares oficiales a través de la app, correo y mensajería de texto.
            </p>
          </div>

          {!canPublish ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto">
                <Megaphone className="w-6 h-6" />
              </div>
              <h4 className="font-black text-sm text-[#2C2E53]">
                Módulo Informativo de Comunicados Institucionales
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                El despacho y configuración de mensajería masiva está reservado exclusivamente al personal docente, coordinadores y dirección del plantel. Como {currentRole === 'REPRESENTANTE' ? 'representante' : 'estudiante'}, usted puede consultar los anuncios y circulares publicados en la cartelera informativa de Noticias y Avisos.
              </p>
            </div>
          ) : (
            <>
              {broadcastSent && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ¡Comunicado transmitido exitosamente a todos los destinatarios seleccionados!
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Audiencia Destinataria:</label>
                    <select
                      value={broadcastTarget}
                      onChange={(e) => setBroadcastTarget(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    >
                      <option value="REPRESENTANTES">Todos los Representantes</option>
                      <option value="DOCENTES">Cuerpo Docente</option>
                      <option value="ESTUDIANTES">Estudiantes de Media General</option>
                      <option value="TODOS">Toda la Comunidad Educativa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Canal de Difusión:</label>
                    <select
                      value={broadcastChannel}
                      onChange={(e) => setBroadcastChannel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    >
                      <option value="SMS_Y_CORREO">Plataforma Web + Correo Institucional</option>
                      <option value="SOLO_CORREO">Correo Electrónico Únicamente</option>
                      <option value="SMS">SMS Urgente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Texto del Mensaje:</label>
                  <textarea
                    rows={4}
                    required
                    value={broadcastText}
                    onChange={(e) => setBroadcastText(e.target.value)}
                    placeholder="Escriba aquí el comunicado oficial que recibirán los representantes..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Despachar Comunicado
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* MODAL NUEVA NOTICIA */}
      {isNewModalOpen && canPublish && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-[#2C2E53] text-base">Publicar Anuncio o Noticia</h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título de la Noticia:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej. Inicio de Actividades Extracurriculares..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo:</label>
                  <select
                    value={noticeType}
                    onChange={(e) => setNoticeType(e.target.value as CommunityNotice['type'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                  >
                    <option value="NOTICIA">Noticia General</option>
                    <option value="ANUNCIO_URGENTE">Anuncio Urgente</option>
                    <option value="EVENTO">Evento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Público Destino:</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as CommunityNotice['targetAudience'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                  >
                    <option value="TODOS">Toda la Comunidad</option>
                    <option value="DOCENTES">Docentes</option>
                    <option value="REPRESENTANTES">Representantes</option>
                    <option value="ESTUDIANTES">Estudiantes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contenido:</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md"
                >
                  Publicar en Cartelera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
