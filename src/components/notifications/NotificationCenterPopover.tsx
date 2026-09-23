import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MainNavigationTab, NotificationCategory, SystemNotification } from '../../types';
import {
  Bell,
  CheckCheck,
  Award,
  Clock,
  FileText,
  School,
  Trash2,
  Mail,
  Smartphone,
  Globe
} from 'lucide-react';

interface NotificationCenterPopoverProps {
  onNavigate?: (tab: MainNavigationTab, subTab?: string) => void;
}

export const NotificationCenterPopover: React.FC<NotificationCenterPopoverProps> = ({ onNavigate }) => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | NotificationCategory>('ALL');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredNotifications = notifications.filter(n => {
    if (selectedCategory === 'ALL') return true;
    return n.category === selectedCategory;
  });

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'CALIFICACIONES':
        return <Award className="w-4 h-4 text-[#D4AF37]" />;
      case 'ASISTENCIA':
        return <Clock className="w-4 h-4 text-sky-400" />;
      case 'DOCUMENTOS':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'INSTITUCIONAL':
      default:
        return <School className="w-4 h-4 text-violet-400" />;
    }
  };

  const handleNotificationClick = (notif: SystemNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.actionTab && onNavigate) {
      onNavigate(notif.actionTab, notif.actionSubTab);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-[#141525] hover:bg-[#2C2E53] text-slate-300 hover:text-white border border-[#2C2E53] transition shadow-inner shrink-0 group focus:outline-none"
        title="Centro de Notificaciones Institucionales"
        aria-label="Abrir centro de notificaciones"
      >
        <Bell className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-black shadow-md animate-pulse">
            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Backdrop para cerrar en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Popover Dropdown Card */}
      {isOpen && (
        <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-96 max-h-[85vh] overflow-hidden flex flex-col bg-white dark:bg-[#1B1C33] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#414474] z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#1B1C33] to-[#252747] text-white flex items-center justify-between border-b border-[#414474]/50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white tracking-wide">Notificaciones CBA</h3>
                <p className="text-[10px] text-slate-300">
                  {unreadNotificationsCount} sin leer • Tiempo real
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadNotificationsCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsAsRead}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-[#D4AF37] hover:bg-white/10 transition text-[10px] font-bold flex items-center gap-1"
                  title="Marcar todas como leídas"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Leer todas</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearNotifications}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition"
                  title="Limpiar historial"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories Pill Filters */}
          <div className="p-2 bg-slate-100/80 dark:bg-[#121324] border-b border-slate-200 dark:border-[#2C2E53]">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-gradient-to-r from-[#1E2038] to-[#2C2E53] text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/80 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                Todas ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('CALIFICACIONES')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === 'CALIFICACIONES'
                    ? 'bg-gradient-to-r from-[#1E2038] to-[#2C2E53] text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/80 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                Calificaciones
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('ASISTENCIA')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === 'ASISTENCIA'
                    ? 'bg-gradient-to-r from-[#1E2038] to-[#2C2E53] text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/80 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                Pases & Asistencias
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('DOCUMENTOS')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === 'DOCUMENTOS'
                    ? 'bg-gradient-to-r from-[#1E2038] to-[#2C2E53] text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/80 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                Documentos
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#2C2E53]/60 no-scrollbar">
            {filteredNotifications.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  No hay notificaciones en este apartado
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                  Las alertas de notas y pases se reflejarán aquí al emitirse.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 sm:p-3.5 transition cursor-pointer flex items-start gap-3 text-left ${
                    !notif.read
                      ? 'bg-amber-500/[0.06] dark:bg-[#D4AF37]/[0.06] hover:bg-amber-500/[0.1] dark:hover:bg-[#D4AF37]/[0.1]'
                      : 'hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="mt-0.5 w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#141525] border border-slate-200 dark:border-[#2C2E53] flex items-center justify-center shrink-0">
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-[#2C2E53] dark:text-white truncate">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0"></span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                      {notif.message}
                    </p>

                    {/* Metadata & Delivery Badges */}
                    <div className="flex items-center flex-wrap gap-1.5 mt-2 text-[10px]">
                      <span className="text-slate-400 dark:text-slate-500 font-medium">
                        {notif.timestamp}
                      </span>
                      {notif.recipientRole && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#2C2E53] text-slate-600 dark:text-slate-300 font-semibold">
                          Para: {notif.recipientRole.toLowerCase()}
                        </span>
                      )}
                      {/* Delivery channels */}
                      <div className="flex items-center gap-1 text-slate-400 dark:text-slate-400 font-semibold ml-auto">
                        {notif.deliveryChannels.includes('PORTAL') && (
                          <span title="Entregado en Portal" className="flex items-center gap-0.5">
                            <Globe className="w-3 h-3 text-emerald-500" />
                          </span>
                        )}
                        {notif.deliveryChannels.includes('EMAIL') && (
                          <span title="Notificado por Correo" className="flex items-center gap-0.5">
                            <Mail className="w-3 h-3 text-sky-500" />
                          </span>
                        )}
                        {notif.deliveryChannels.includes('SMS_WHATSAPP') && (
                          <span title="Notificado por SMS / WhatsApp" className="flex items-center gap-0.5">
                            <Smartphone className="w-3 h-3 text-teal-500" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Info */}
          <div className="p-2.5 bg-slate-50 dark:bg-[#141525] border-t border-slate-200 dark:border-[#2C2E53] text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              🔔 Ecosistema de Comunicación en Tiempo Real • CBA
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
