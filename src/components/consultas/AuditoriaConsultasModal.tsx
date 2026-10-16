import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  X,
  FileCheck,
  Mail,
  Search,
  Filter,
  Clock,
  User,
  Globe,
  CheckCircle2,
  Calendar,
  Send
} from 'lucide-react';

interface AuditoriaConsultasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditoriaConsultasModal: React.FC<AuditoriaConsultasModalProps> = ({
  isOpen,
  onClose
}) => {
  const { auditLogs, notifications, broadcastMessages, currentRole } = useApp();
  const [activeTab, setActiveTab] = useState<'DOCUMENTOS' | 'COMUNICACIONES'>('DOCUMENTOS');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Filtrar logs de documentos o general
  const filteredAuditLogs = (auditLogs || []).filter((log) => {
    const term = searchTerm.toLowerCase();
    const matchGeneral =
      log.evento?.toLowerCase().includes(term) ||
      log.usuario?.toLowerCase().includes(term) ||
      log.rol?.toLowerCase().includes(term) ||
      log.detalles?.toLowerCase().includes(term);

    return matchGeneral;
  });

  // Filtrar comunicaciones
  const filteredNotifications = (notifications || []).filter((n) => {
    const term = searchTerm.toLowerCase();
    return (
      n.title?.toLowerCase().includes(term) ||
      n.message?.toLowerCase().includes(term) ||
      n.recipientRole?.toLowerCase().includes(term) ||
      n.recipientName?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-[#2C2E53] text-white flex items-center justify-between border-b border-transparent dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#1B1C33] flex items-center justify-center font-black shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                  Control de Estudios • Seguridad CBA
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Auditoría Activa
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-0.5">
                Bitácora de Auditoría de Reportes y Comunicaciones
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtabs Bar & Search */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('DOCUMENTOS')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'DOCUMENTOS'
                  ? 'bg-[#2C2E53] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <FileCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Emisión de Documentos ({filteredAuditLogs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('COMUNICACIONES')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'COMUNICACIONES'
                  ? 'bg-[#2C2E53] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Mail className="w-4 h-4 text-[#D4AF37]" />
              <span>Avisos & Comunicaciones ({filteredNotifications.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por usuario, evento o IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'DOCUMENTOS' ? (
            filteredAuditLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-medium">
                <FileCheck className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p>No hay eventos registrados en la bitácora de auditoría de documentos.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1B1C33] text-slate-200 uppercase text-[10px] tracking-wider font-extrabold">
                    <tr>
                      <th className="py-2.5 px-3">Fecha & Hora</th>
                      <th className="py-2.5 px-3">Evento Registrado</th>
                      <th className="py-2.5 px-3">Usuario & Rol</th>
                      <th className="py-2.5 px-3">Dirección IP</th>
                      <th className="py-2.5 px-3">Detalles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {log.fecha || log.createdAt || 'N/A'}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-100">
                          {log.evento}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-extrabold text-[#2C2E53] dark:text-indigo-300 block">
                            {log.usuario}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">
                            {log.rol}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                          {log.ip || '127.0.0.1'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 text-[11px]">
                          {log.detalles || 'Emisión regular certificada'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-medium">
                <Mail className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p>No se registran envíos de comunicados o notificaciones en el sistema.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {n.category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          Destinatario: {n.recipientRole} ({n.recipientName || 'General'})
                        </span>
                        {n.priority === 'ALTA' && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Alta Prioridad
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {n.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                        {n.message}
                      </p>
                    </div>
                    <div className="text-right text-[10px] font-mono text-slate-400 shrink-0">
                      <span>{n.timestamp}</span>
                      <div className="flex items-center gap-1 justify-end mt-1 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{n.deliveryChannels?.join(' • ') || 'PORTAL'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Registro de auditoría conforme a las normativas de seguridad institucional de la U.E.P. Colegio Bellas Artes.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-600 transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
