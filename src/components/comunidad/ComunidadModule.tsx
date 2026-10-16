import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CommunityNotice,
  NotificationDeliveryChannel,
  BroadcastMessage,
  NoticeTheme,
  TargetAudienceRole,
  EducationalLevel
} from '../../types';
import { canPublishCommunity, canManageCommunityNotices } from '../../utils/rbac';
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
  Pencil,
  Trash2,
  Globe,
  Mail,
  Smartphone,
  AlertCircle,
  X,
  Filter,
  FileText,
  Tag,
  Palette
} from 'lucide-react';

interface ComunidadModuleProps {
  activeSubTab?: 'NOTICIAS' | 'CUMPLEANOS' | 'COMUNICADOS';
  setActiveSubTab?: (subTab: 'NOTICIAS' | 'CUMPLEANOS' | 'COMUNICADOS') => void;
}

const THEME_METADATA: Record<NoticeTheme, { label: string; icon: string; border: string; bg: string; badge: string }> = {
  ESTANDAR: {
    label: 'Estándar Institucional',
    icon: '🏛️',
    border: 'border-slate-200 dark:border-slate-700',
    bg: 'bg-white dark:bg-slate-900',
    badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
  },
  HALLOWEEN: {
    label: 'Halloween Festivo',
    icon: '🎃',
    border: 'border-orange-400 dark:border-orange-600',
    bg: 'bg-gradient-to-br from-orange-50/90 via-white to-purple-50/70 dark:from-orange-950/25 dark:via-slate-900 dark:to-purple-950/25',
    badge: 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700'
  },
  NAVIDAD: {
    label: 'Navidad & Gaitas CBA',
    icon: '🎄',
    border: 'border-red-400 dark:border-red-600',
    bg: 'bg-gradient-to-br from-red-50/90 via-white to-emerald-50/70 dark:from-red-950/25 dark:via-slate-900 dark:to-emerald-950/25',
    badge: 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700'
  },
  ZULIANIDAD: {
    label: 'Semana de la Zulianidad',
    icon: '☀️',
    border: 'border-blue-400 dark:border-blue-600',
    bg: 'bg-gradient-to-br from-blue-50/90 via-white to-amber-50/70 dark:from-blue-950/25 dark:via-slate-900 dark:to-amber-950/25',
    badge: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700'
  },
  CARNAVAL: {
    label: 'Carnaval & Comparsas',
    icon: '🎭',
    border: 'border-pink-400 dark:border-pink-600',
    bg: 'bg-gradient-to-br from-pink-50/90 via-white to-yellow-50/70 dark:from-pink-950/25 dark:via-slate-900 dark:to-yellow-950/25',
    badge: 'bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-300 border-pink-300 dark:border-pink-700'
  },
  DIA_DEL_MAESTRO: {
    label: 'Día del Maestro',
    icon: '🍎',
    border: 'border-amber-400 dark:border-amber-600',
    bg: 'bg-gradient-to-br from-amber-50/90 via-white to-yellow-50/70 dark:from-amber-950/25 dark:via-slate-900 dark:to-yellow-950/25',
    badge: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
  },
  ANIVERSARIO_CBA: {
    label: 'Aniversario Bellas Artes',
    icon: '🎖️',
    border: 'border-[#D4AF37]',
    bg: 'bg-gradient-to-br from-[#2C2E53]/10 via-white to-[#D4AF37]/15 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/30',
    badge: 'bg-[#2C2E53] text-[#D4AF37] border-[#D4AF37]/60'
  },
  PATRIO_VENEZUELA: {
    label: 'Efeméride Patria',
    icon: '🇻🇪',
    border: 'border-yellow-400 dark:border-yellow-600',
    bg: 'bg-gradient-to-br from-yellow-50/80 via-blue-50/50 to-red-50/50 dark:from-yellow-950/20 dark:via-slate-900 dark:to-red-950/20',
    badge: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
  }
};

export const ComunidadModule: React.FC<ComunidadModuleProps> = ({
  activeSubTab,
  setActiveSubTab
}) => {
  const {
    communityNotices,
    addCommunityNotice,
    updateCommunityNotice,
    deleteCommunityNotice,
    broadcastMessages,
    sendBroadcastMessage,
    deleteBroadcastMessage,
    birthdays,
    currentRole
  } = useApp();

  const canPublish = canPublishCommunity(currentRole);
  const canManage = canManageCommunityNotices(currentRole);
  const [internalActiveTab, setInternalActiveTab] = useState<'NOTICIAS' | 'CUMPLEANOS' | 'COMUNICADOS'>('NOTICIAS');

  const activeTab = activeSubTab || internalActiveTab;
  const setActiveTab = (tab: 'NOTICIAS' | 'CUMPLEANOS' | 'COMUNICADOS') => {
    if (setActiveSubTab) {
      setActiveSubTab(tab);
    }
    setInternalActiveTab(tab);
  };

  // Theme filter for notices
  const [themeFilter, setThemeFilter] = useState<'TODOS' | NoticeTheme>('TODOS');

  // Notice Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<CommunityNotice | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noticeType, setNoticeType] = useState<CommunityNotice['type']>('NOTICIA');
  const [targetAudience, setTargetAudience] = useState<CommunityNotice['targetAudience']>('TODOS');
  const [theme, setTheme] = useState<NoticeTheme>('ESTANDAR');
  const [subsystem, setSubsystem] = useState<'TODOS' | EducationalLevel>('TODOS');
  const [author, setAuthor] = useState('Dirección General CBA');
  const [pinned, setPinned] = useState(false);

  // Broadcast Message State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<BroadcastMessage['targetAudience']>('REPRESENTANTES');
  const [broadcastSubsystem, setBroadcastSubsystem] = useState<'TODOS' | EducationalLevel>('TODOS');
  const [broadcastChannel, setBroadcastChannel] = useState<BroadcastMessage['channel']>('SMS_Y_CORREO');
  const [broadcastTheme, setBroadcastTheme] = useState<NoticeTheme>('ESTANDAR');
  const [broadcastSender, setBroadcastSender] = useState('Dirección General CBA');
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastUrgent, setBroadcastUrgent] = useState(false);
  const [broadcastPublishToNotices, setBroadcastPublishToNotices] = useState(true);
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleOpenCreateModal = () => {
    setEditingNotice(null);
    setTitle('');
    setContent('');
    setNoticeType('NOTICIA');
    setTargetAudience('TODOS');
    setTheme('ESTANDAR');
    setSubsystem('TODOS');
    setAuthor('Dirección General CBA');
    setPinned(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (notice: CommunityNotice) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setContent(notice.content);
    setNoticeType(notice.type);
    setTargetAudience(notice.targetAudience);
    setTheme(notice.theme || 'ESTANDAR');
    setSubsystem(notice.subsystem || 'TODOS');
    setAuthor(notice.author || 'Dirección General CBA');
    setPinned(!!notice.pinned);
    setIsModalOpen(true);
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    if (editingNotice) {
      updateCommunityNotice({
        ...editingNotice,
        title,
        content,
        type: noticeType,
        targetAudience,
        theme,
        subsystem,
        author,
        pinned
      });
    } else {
      addCommunityNotice({
        title,
        content,
        date: new Date().toLocaleDateString('es-VE'),
        type: noticeType,
        targetAudience,
        theme,
        subsystem,
        author,
        pinned
      });
    }

    setIsModalOpen(false);
    setEditingNotice(null);
    setTitle('');
    setContent('');
    setPinned(false);
  };

  const handleDeleteNotice = (notice: CommunityNotice) => {
    if (window.confirm(`¿Está seguro de que desea eliminar la publicación "${notice.title}"?\nEsta acción la removerá de la cartelera y del centro de notificaciones.`)) {
      deleteCommunityNotice(notice.id);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastText) return;

    sendBroadcastMessage({
      title: broadcastTitle,
      content: broadcastText,
      targetAudience: broadcastTarget,
      subsystem: broadcastSubsystem,
      channel: broadcastChannel,
      theme: broadcastTheme,
      sender: broadcastSender || 'Dirección General CBA',
      urgent: broadcastUrgent,
      publishToNotices: broadcastPublishToNotices
    });

    setBroadcastSent(true);
    setBroadcastTitle('');
    setBroadcastText('');
    setBroadcastUrgent(false);
    setTimeout(() => setBroadcastSent(false), 5000);
  };

  const handleDeleteBroadcast = (msg: BroadcastMessage) => {
    if (window.confirm(`¿Está seguro de que desea eliminar el comunicado "${msg.title}" del historial?`)) {
      deleteBroadcastMessage(msg.id);
    }
  };

  // Quick Templates for Broadcast Messages
  const applyBroadcastTemplate = (templateType: 'BOLETINES' | 'SOLVENCIA' | 'EFEMERIDE') => {
    if (templateType === 'BOLETINES') {
      setBroadcastTitle('Convocatoria a Entrega Formal de Boletines Informativos');
      setBroadcastTarget('REPRESENTANTES');
      setBroadcastChannel('SMS_Y_CORREO');
      setBroadcastTheme('ESTANDAR');
      setBroadcastText(
        'Estimada comunidad de padres y representantes CBA:\n\nPor medio de la presente se les convoca cordialmente a la jornada institucional de socialización y entrega formal de boletines de calificaciones correspondiente al lapso escolar en curso.\n\nFavor acudir en el horario respectivo asignado a cada docente titular de grado y aula. Se recuerda que para la entrega física es indispensable encontrarse al día con los compromisos administrativos escolares.\n\nAgradecemos su puntual asistencia y constante acompañamiento pedagógico en el desarrollo integral de nuestros estudiantes.\n\nAtentamente,\nDirección General y Consejo Técnico Pedagógico'
      );
    } else if (templateType === 'SOLVENCIA') {
      setBroadcastTitle('Aviso Preventivo: Regularización y Solvencia Administrativa');
      setBroadcastTarget('REPRESENTANTES');
      setBroadcastChannel('SMS_Y_CORREO');
      setBroadcastTheme('ESTANDAR');
      setBroadcastText(
        'Estimados padres y representantes:\n\nCon el propósito de garantizar un óptimo cierre administrativo de lapso y asegurar la visualización inmediata de notas y descarga de constancias en el portal digital SICE-CBA, les recordamos la importancia de regularizar cualquier saldo pendiente por concepto de matrícula o mensualidades en mora.\n\nNuestra oficina de Cobranzas y Caja atiende cordialmente de lunes a viernes en horario de 7:30 AM a 1:00 PM. Agradecemos su valiosa cooperación con el sostenimiento operativo y excelencia de nuestra casa de estudios.\n\nAtentamente,\nCoordinación de Administración y Cobranzas CBA'
      );
    } else if (templateType === 'EFEMERIDE') {
      setBroadcastTitle('Invitación a la Celebración Escolar y Conmemoración de Efeméride Institucional');
      setBroadcastTarget('TODOS');
      setBroadcastChannel('SMS_Y_CORREO');
      setBroadcastTheme('ZULIANIDAD');
      setBroadcastText(
        '¡Orgullo y Tradición en la U.E. Bellas Artes!\n\nInvitamos con gran alegría a todo el personal docente, estudiantes, directivos y familias a unirse a los actos centrales y comparsas culturales con motivo de la semana de efemérides institucional. Nuestros estudiantes presentarán proyectos, danzas y exposiciones que enaltecen nuestros valores.\n\n¡Los esperamos con los brazos abiertos para celebrar juntos en comunidad!\n\nAtentamente,\nComisión de Cultura y Efemérides CBA'
      );
    }
  };

  const filteredNotices = communityNotices.filter((n) => {
    if (themeFilter === 'TODOS') return true;
    return (n.theme || 'ESTANDAR') === themeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#2C2E53] dark:text-white">
            Comunidad Bellas Artes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cartelera de noticias con efemérides temáticas, anuncios oficiales, calendario de cumpleañeros y mensajería masiva segmentada.
          </p>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex flex-wrap items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 gap-1">
          <button
            onClick={() => setActiveTab('NOTICIAS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeTab === 'NOTICIAS'
                ? 'bg-[#261523] text-pink-300 shadow-sm border border-pink-500/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Megaphone className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'NOTICIAS' ? 'text-pink-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Noticias y Efemérides</span>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#D4AF37]" /> Efeméride:
              </span>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 text-xs font-bold flex-wrap gap-1">
                <button
                  onClick={() => setThemeFilter('TODOS')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    themeFilter === 'TODOS'
                      ? 'bg-white dark:bg-slate-700 text-[#2C2E53] dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Todas ({communityNotices.length})
                </button>
                {(Object.keys(THEME_METADATA) as NoticeTheme[]).map((thm) => {
                  const count = communityNotices.filter((n) => (n.theme || 'ESTANDAR') === thm).length;
                  if (count === 0 && themeFilter !== thm) return null;
                  return (
                    <button
                      key={thm}
                      onClick={() => setThemeFilter(thm)}
                      className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                        themeFilter === thm
                          ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <span>{THEME_METADATA[thm].icon}</span>
                      <span>{THEME_METADATA[thm].label}</span>
                      <span className="text-[10px] opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {canPublish && (
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Plus className="w-4 h-4" />
                Publicar Noticia / Efeméride
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotices.length === 0 ? (
              <div className="md:col-span-2 p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
                <Megaphone className="w-8 h-8 mx-auto mb-2 text-[#D4AF37]" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No hay publicaciones con la temática seleccionada</p>
                <p className="text-xs text-slate-400 mt-1">Seleccione "Todas" o publique una nueva noticia decorada.</p>
              </div>
            ) : (
              filteredNotices.map((notice) => {
                const currentTheme = notice.theme || 'ESTANDAR';
                const themeInfo = THEME_METADATA[currentTheme] || THEME_METADATA.ESTANDAR;

                return (
                  <div
                    key={notice.id}
                    className={`rounded-2xl p-6 border shadow-cba-card space-y-3 relative transition-all hover:shadow-lg ${
                      themeInfo.bg
                    } ${themeInfo.border} ${
                      notice.type === 'ANUNCIO_URGENTE' ? 'ring-2 ring-rose-400' : ''
                    }`}
                  >
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      {notice.pinned && (
                        <span className="text-amber-500 flex items-center gap-1 text-[11px] font-bold mr-1">
                          <Pin className="w-3.5 h-3.5 fill-amber-500" />
                          Fijado
                        </span>
                      )}
                      {canManage && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(notice)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition cursor-pointer"
                            title="Editar Publicación"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNotice(notice)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                            title="Eliminar Publicación"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
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

                      {/* Theme Badge */}
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${themeInfo.badge}`}>
                        <span>{themeInfo.icon}</span>
                        <span>{themeInfo.label}</span>
                      </span>

                      <span className="text-[10px] text-slate-400 font-medium">
                        Para: {notice.targetAudience}
                      </span>

                      {notice.subsystem && notice.subsystem !== 'TODOS' && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {notice.subsystem.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">
                      {notice.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {notice.content}
                    </p>

                    <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{notice.author}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#D4AF37]" />
                        {notice.date}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: CUMPLEAÑEROS */}
      {activeTab === 'CUMPLEANOS' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-[#2C2E53] dark:text-white flex items-center gap-2">
              <Cake className="w-4 h-4 text-[#D4AF37]" />
              Calendario de Cumpleaños de la Comunidad Escolar
            </h3>
            <span className="text-xs text-slate-400">Personal Docente, Administrativo y Estudiantes</span>
          </div>

          {birthdays.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/10 text-slate-400">
              <Cake className="w-8 h-8 mx-auto mb-2 text-[#D4AF37]/60" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">No hay cumpleaños registrados actualmente</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Las fechas especiales de la comunidad escolar aparecerán en este calendario.</p>
            </div>
          ) : (
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
          )}
        </div>
      )}

      {/* VIEW 3: MENSAJERÍA MASIVA */}
      {activeTab === 'COMUNICADOS' && (
        <div className="space-y-6">
          {!canPublish ? (
            /* BANDEJA DE CONSULTA PARA REPRESENTANTES Y ESTUDIANTES */
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#2C2E53] text-[#D4AF37] flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#2C2E53] dark:text-white">
                      Circulares y Comunicados Oficiales
                    </h3>
                    <p className="text-xs text-slate-400">
                      Boletines y despachos masivos emitidos por la dirección del plantel para su perfil.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {broadcastMessages.filter(
                    b =>
                      b.targetAudience === 'TODOS' ||
                      (currentRole === 'REPRESENTANTE' && b.targetAudience === 'REPRESENTANTES') ||
                      (currentRole === 'ESTUDIANTE' && b.targetAudience === 'ESTUDIANTES')
                  ).length} recibidos
                </span>
              </div>

              {broadcastMessages.filter(
                b =>
                  b.targetAudience === 'TODOS' ||
                  (currentRole === 'REPRESENTANTE' && b.targetAudience === 'REPRESENTANTES') ||
                  (currentRole === 'ESTUDIANTE' && b.targetAudience === 'ESTUDIANTES')
              ).length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400">
                  <Megaphone className="w-8 h-8 mx-auto mb-2 text-[#D4AF37]/60" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">No hay comunicados oficiales emitidos recientemente</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Las circulares dirigidas a {currentRole === 'REPRESENTANTE' ? 'representantes' : 'estudiantes'} aparecerán listadas aquí.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {broadcastMessages
                    .filter(
                      b =>
                        b.targetAudience === 'TODOS' ||
                        (currentRole === 'REPRESENTANTE' && b.targetAudience === 'REPRESENTANTES') ||
                        (currentRole === 'ESTUDIANTE' && b.targetAudience === 'ESTUDIANTES')
                    )
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-5 rounded-2xl border transition space-y-2 ${
                          msg.urgent
                            ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 ring-1 ring-amber-200'
                            : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            {msg.urgent && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500 text-white shadow-xs">
                                Urgente
                              </span>
                            )}
                            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                              {msg.date} • {msg.time}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            Emisor: {msg.sender}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">
                          {msg.title}
                        </h4>

                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                          {msg.content}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ) : (
            /* PANEL DE EMISIÓN E HISTORIAL PARA PERSONAL CON PERMISO */
            <div className="space-y-6">
              {/* Formulario de Despacho */}
              <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-cba-card space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-[#2C2E53] dark:text-white flex items-center gap-2">
                      <Send className="w-4 h-4 text-[#D4AF37]" />
                      Despacho de Comunicados y Mensajería Masiva
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Difusión segmentada hacia Direcciones, Coordinaciones, Docentes, Representantes y Estudiantes.
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    Multicanal CBA
                  </span>
                </div>

                {/* Plantillas Preconfiguradas en 1 Clic */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Plantillas Rápidas (1 Clic):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyBroadcastTemplate('BOLETINES')}
                      className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-[#2C2E53] hover:text-[#D4AF37] dark:hover:bg-[#2C2E53] rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition shadow-xs flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Entrega de Boletines
                    </button>
                    <button
                      type="button"
                      onClick={() => applyBroadcastTemplate('SOLVENCIA')}
                      className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition shadow-xs flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      Aviso de Solvencia
                    </button>
                    <button
                      type="button"
                      onClick={() => applyBroadcastTemplate('EFEMERIDE')}
                      className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition shadow-xs flex items-center gap-1.5"
                    >
                      <span>☀️</span>
                      Celebración de Efeméride
                    </button>
                  </div>
                </div>

                {broadcastSent && (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ¡Comunicado transmitido exitosamente! Se ha registrado en el historial y generado las notificaciones correspondientes.
                  </div>
                )}

                <form onSubmit={handleSendBroadcast} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Asunto o Título del Comunicado: <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      placeholder="ej. Circular N° 04 - Convocatoria a Entrega de Boletines..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Audiencia Destino:</label>
                      <select
                        value={broadcastTarget}
                        onChange={(e) => setBroadcastTarget(e.target.value as BroadcastMessage['targetAudience'])}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white"
                      >
                        <option value="REPRESENTANTES">Padres / Representantes</option>
                        <option value="DOCENTES">Cuerpo Docente</option>
                        <option value="ESTUDIANTES">Estudiantes</option>
                        <option value="DIRECCION">Dirección / Rectoría</option>
                        <option value="COORDINACION">Coordinaciones</option>
                        <option value="TODOS">Toda la Comunidad</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subsistema Escolar:</label>
                      <select
                        value={broadcastSubsystem}
                        onChange={(e) => setBroadcastSubsystem(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white"
                      >
                        <option value="TODOS">Todos los Niveles</option>
                        <option value="INICIAL">Educación Inicial</option>
                        <option value="PRIMARIA">Educación Primaria</option>
                        <option value="MEDIA_GENERAL">Media General</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Temática / Efeméride:</label>
                      <select
                        value={broadcastTheme}
                        onChange={(e) => setBroadcastTheme(e.target.value as NoticeTheme)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white"
                      >
                        {(Object.keys(THEME_METADATA) as NoticeTheme[]).map((thm) => (
                          <option key={thm} value={thm}>
                            {THEME_METADATA[thm].icon} {THEME_METADATA[thm].label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Canal de Difusión:</label>
                      <select
                        value={broadcastChannel}
                        onChange={(e) => setBroadcastChannel(e.target.value as BroadcastMessage['channel'])}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white"
                      >
                        <option value="SMS_Y_CORREO">Portal Web + Correo</option>
                        <option value="SOLO_CORREO">Correo Electrónico Únicamente</option>
                        <option value="SMS">SMS Urgente / Notificación</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cuerpo del Comunicado: <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={broadcastText}
                      onChange={(e) => setBroadcastText(e.target.value)}
                      placeholder="Redacte aquí el comunicado oficial que será emitido..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                    />
                  </div>

                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={broadcastUrgent}
                          onChange={(e) => setBroadcastUrgent(e.target.checked)}
                          className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                        <span>⚡ Marcar como prioritario / urgente</span>
                      </label>

                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={broadcastPublishToNotices}
                          onChange={(e) => setBroadcastPublishToNotices(e.target.checked)}
                          className="rounded border-slate-300 text-[#2C2E53] focus:ring-[#2C2E53] cursor-pointer"
                        />
                        <span>📢 Publicar automáticamente en Cartelera</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Despachar Comunicado
                    </button>
                  </div>
                </form>
              </div>

              {/* Historial de Comunicados Emitidos */}
              <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-cba-card space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#2C2E53] dark:text-white flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-[#D4AF37]" />
                      Historial de Comunicados Despachados ({broadcastMessages.length})
                    </h3>
                    <p className="text-xs text-slate-400">
                      Registro auditable de difusiones emitidas con segmentación y trazabilidad.
                    </p>
                  </div>
                </div>

                {broadcastMessages.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400">
                    <Send className="w-8 h-8 mx-auto mb-2 text-[#D4AF37]/60" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Aún no se han emitido comunicados masivos</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Los comunicados enviados aparecerán registrados en este historial con su fecha y audiencia.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {broadcastMessages.map((msg) => {
                      const msgTheme = msg.theme || 'ESTANDAR';
                      const themeInfo = THEME_METADATA[msgTheme] || THEME_METADATA.ESTANDAR;

                      return (
                        <div
                          key={msg.id}
                          className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 relative transition ${
                            themeInfo.bg
                          } ${themeInfo.border} ${
                            msg.urgent ? 'ring-2 ring-amber-300' : 'shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                Para: {msg.targetAudience}
                              </span>
                              {msg.subsystem && msg.subsystem !== 'TODOS' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                                  {msg.subsystem.replace('_', ' ')}
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${themeInfo.badge}`}>
                                <span>{themeInfo.icon}</span>
                                <span>{themeInfo.label}</span>
                              </span>
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                                {msg.channel === 'SMS' ? <Smartphone className="w-3 h-3" /> : msg.channel === 'SOLO_CORREO' ? <Mail className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                                {msg.channel.replace(/_/g, ' ')}
                              </span>
                              {msg.urgent && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500 text-white shadow-xs">
                                  Urgente
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                              <span>{msg.date} • {msg.time}</span>
                              {canManage && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBroadcast(msg)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                                  title="Eliminar del Historial"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">
                            {msg.title}
                          </h4>

                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {msg.content}
                          </p>

                          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">Emitido por: {msg.sender}</span>
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Transmitido
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL NUEVA O EDITAR NOTICIA */}
      {isModalOpen && canPublish && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-[#2C2E53] dark:text-white text-base flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#D4AF37]" />
                {editingNotice ? 'Editar Noticia / Efeméride' : 'Publicar Noticia o Efeméride'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingNotice(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Título de la Publicación: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej. Celebración de la Zulianidad & Muestra Gaitera..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Anuncio:</label>
                  <select
                    value={noticeType}
                    onChange={(e) => setNoticeType(e.target.value as CommunityNotice['type'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white"
                  >
                    <option value="NOTICIA">Noticia General</option>
                    <option value="ANUNCIO_URGENTE">Anuncio Urgente</option>
                    <option value="EVENTO">Evento Escolar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Público Destino:</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as CommunityNotice['targetAudience'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white"
                  >
                    <option value="TODOS">Toda la Comunidad</option>
                    <option value="DOCENTES">Docentes</option>
                    <option value="REPRESENTANTES">Representantes</option>
                    <option value="ESTUDIANTES">Estudiantes</option>
                    <option value="DIRECCION">Dirección</option>
                    <option value="COORDINACION">Coordinación</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Temática / Efeméride Festiva:
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as NoticeTheme)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white"
                  >
                    {(Object.keys(THEME_METADATA) as NoticeTheme[]).map((thm) => (
                      <option key={thm} value={thm}>
                        {THEME_METADATA[thm].icon} {THEME_METADATA[thm].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subsistema Aplicable:
                  </label>
                  <select
                    value={subsystem}
                    onChange={(e) => setSubsystem(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white"
                  >
                    <option value="TODOS">Todos los Niveles</option>
                    <option value="INICIAL">Educación Inicial</option>
                    <option value="PRIMARIA">Educación Primaria</option>
                    <option value="MEDIA_GENERAL">Media General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Autor o Emisor:</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="ej. Dirección General CBA"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contenido de la Noticia: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Redacte los detalles de la publicación..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="notice-pinned"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="rounded border-slate-300 text-[#2C2E53] focus:ring-[#2C2E53] cursor-pointer"
                />
                <label htmlFor="notice-pinned" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1.5 select-none">
                  <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Fijar esta publicación en la cabecera de la cartelera
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingNotice(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md cursor-pointer transition-all active:scale-95"
                >
                  {editingNotice ? 'Guardar Cambios' : 'Publicar en Cartelera'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
