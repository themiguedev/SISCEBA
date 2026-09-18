import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Monitor,
  User,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  Send,
  Lock,
  Mail,
  CheckCircle2,
  TrendingUp,
  Cake,
  Lightbulb,
  FileText,
  ExternalLink,
  Layers,
  HelpCircle
} from 'lucide-react';

export type EscritorioTab = 'DASHBOARD' | 'PERFIL' | 'SUGERENCIAS';

interface EscritorioViewProps {
  activeSubTab?: EscritorioTab;
  setActiveSubTab?: (tab: EscritorioTab) => void;
}

export const EscritorioView: React.FC<EscritorioViewProps> = ({
  activeSubTab,
  setActiveSubTab
}) => {
  const { currentRole, birthdays } = useApp();
  const [internalActiveTab, setInternalActiveTab] = useState<EscritorioTab>('DASHBOARD');

  const activeTab = activeSubTab || internalActiveTab;
  const setActiveTab = (tab: EscritorioTab) => {
    if (setActiveSubTab) {
      setActiveSubTab(tab);
    }
    setInternalActiveTab(tab);
  };

  // Profile Form State
  const [profileComment, setProfileComment] = useState('Coordinación de Evaluación y Docencia - Colegio Bellas Artes');
  const [receiveEmails, setReceiveEmails] = useState('SI');
  const [receiveMessages, setReceiveMessages] = useState('SI');
  const [profileSaved, setProfileSaved] = useState(false);

  // Suggestions Form State
  const [suggestionMessage, setSuggestionMessage] = useState('');
  const [suggestionCheck, setSuggestionCheck] = useState(false);
  const [suggestionSent, setSuggestionSent] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionMessage || !suggestionCheck) return;
    setSuggestionSent(true);
    setSuggestionMessage('');
    setSuggestionCheck(false);
    setTimeout(() => setSuggestionSent(false), 4000);
  };

  const todayBirthdays = birthdays.filter(b => b.isToday);

  return (
    <div className="space-y-6">
      {/* Top Unified Navigation & View Switcher */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#1B1C33] text-[#D4AF37] flex items-center justify-center font-black text-lg shadow-sm border border-[#2C2E53] shrink-0">
            CB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#2C2E53] dark:text-white">Escritorio de Operaciones y Control</h2>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/30">
                Auditoría Institucional
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Panel institucional de telemetría, auditoría de accesos y servicios al personal docente y administrativo
            </p>
          </div>
        </div>

        {/* Subtabs Pill Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-inner shrink-0">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'DASHBOARD'
                ? 'bg-[#1B1C33] text-sky-300 shadow-sm border border-sky-400/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <Monitor className={`w-3.5 h-3.5 ${activeTab === 'DASHBOARD' ? 'text-sky-400' : 'text-slate-500'}`} />
            Tablero Principal
          </button>
          <button
            onClick={() => setActiveTab('PERFIL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'PERFIL'
                ? 'bg-[#1B1C33] text-sky-300 shadow-sm border border-sky-400/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <User className={`w-3.5 h-3.5 ${activeTab === 'PERFIL' ? 'text-sky-400' : 'text-slate-500'}`} />
            Mi Perfil
          </button>
          <button
            onClick={() => setActiveTab('SUGERENCIAS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'SUGERENCIAS'
                ? 'bg-[#1B1C33] text-sky-300 shadow-sm border border-sky-400/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <Lightbulb className={`w-3.5 h-3.5 ${activeTab === 'SUGERENCIAS' ? 'text-sky-400' : 'text-slate-500'}`} />
            Ideas y Sugerencias
          </button>
        </div>
      </div>

      {/* VIEW: DASHBOARD TABLERO */}
      {activeTab === 'DASHBOARD' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Session Audit & System Health */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audit Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-bold text-[#2C2E53] text-sm">Información de Auditoría y Sesión Activa</h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Conectado
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Última Visita</span>
                  <p className="text-xs font-extrabold text-slate-800 mt-1">16-09-2026</p>
                  <p className="text-[10px] text-slate-500">10:42 AM</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Visitas Hoy</span>
                  <p className="text-xl font-black text-[#2C2E53] mt-0.5">14</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Sesión activa</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Visitas Totales</span>
                  <p className="text-xl font-black text-[#2C2E53] mt-0.5">1,289</p>
                  <p className="text-[10px] text-slate-400 font-medium">Histórico anual</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Dirección IP</span>
                  <p className="text-xs font-mono font-extrabold text-slate-800 mt-1">172.16.7.76</p>
                  <p className="text-[10px] text-slate-400">Red Interna CBA</p>
                </div>
              </div>

              {/* Roles Asignados */}
              <div>
                <span className="text-xs font-bold text-slate-600 block mb-2">Roles y Perfiles Asignados en esta Cuenta:</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#1B1C33] text-[#D4AF37] border border-[#2C2E53] shadow-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Administrador del Sistema (ADM)
                  </span>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    Docente de Aula (DOC)
                  </span>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    Control y Evaluación (UCE)
                  </span>
                </div>
              </div>
            </div>

            {/* Sitios Más Visitados */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-bold text-[#2C2E53] text-sm">Sitios y Secciones Más Visitadas</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Frecuencia de Uso</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700">1. Indicadores (Primaria)</span>
                    <span className="text-[#D4AF37] font-extrabold">16.3 %</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-[#D4AF37] rounded-full" style={{ width: '16.3%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700">2. Literales Finales (ES) (Primaria)</span>
                    <span className="text-blue-600 font-extrabold">11.6 %</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '11.6%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700">3. Usuarios y Matrícula (Gestión)</span>
                    <span className="text-emerald-600 font-extrabold">8.2 %</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '8.2%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700">4. Consejo de Curso y Actas (Media General)</span>
                    <span className="text-purple-600 font-extrabold">3.9 %</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '3.9%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Widgets Cumpleañeros & Soporte */}
          <div className="space-y-6">
            {/* Cumpleañeros del Día */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Cake className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-extrabold text-[#2C2E53] text-sm">Cumpleañeros</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {todayBirthdays.length} Hoy
                </span>
              </div>

              <div className="space-y-3">
                {birthdays.map((b) => (
                  <div
                    key={b.id}
                    className={`p-3 rounded-xl border transition-all ${
                      b.isToday
                        ? 'bg-gradient-to-r from-amber-500/10 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/20 border-amber-300 dark:border-amber-500/40'
                        : 'bg-slate-50 dark:bg-white/[0.03] border-slate-100 dark:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-slate-800 dark:text-[#F8FAFC]">{b.fullName}</p>
                      {b.isToday && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500 text-white dark:bg-amber-500/20 dark:text-amber-300 dark:border dark:border-amber-500/40 animate-pulse">
                          ¡HOY!
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5">{b.gradeOrArea}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3 text-[#D4AF37]" />
                      {b.birthDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Canal Institucional CBA / Lidsoftware */}
            <div className="bg-gradient-to-br from-[#1B1C33] to-[#252747] text-white rounded-2xl p-6 border border-[#2C2E53] shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1 border border-[#D4AF37]/50 shadow-md">
                  <span className="text-[#2C2E53] font-black text-sm">CBA</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white">Canal Institucional • SICE-CBA</h4>
                  <p className="text-[10px] text-slate-300">Colegio Bellas Artes</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                Plataforma oficial sincronizada para el control escolar, notas oficiales, gestión docente y comunicación con las familias para el periodo escolar 2026-2027.
              </p>
              <div className="p-3 rounded-xl bg-[#141525]/80 border border-white/10 mb-3">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                  Autor y Desarrollador del Sistema:
                </span>
                <p className="text-xs font-black text-[#D4AF37] mt-0.5">
                  Ing. en Informática Miguelangel Contreras Guillén
                </p>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  Desarrollo de Software & Arquitectura SICE-CBA
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono">v1.0.0-DEV</span>
                <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Soporte Activo
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MI PERFIL */}
      {activeTab === 'PERFIL' && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-cba-card">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#2C2E53] text-[#D4AF37] flex items-center justify-center font-black text-xl">
              U
            </div>
            <div>
              <h3 className="font-black text-lg text-[#2C2E53]">Perfil de Usuario</h3>
              <p className="text-xs text-slate-400">Gestione su perfil, preferencias y credenciales de acceso</p>
            </div>
          </div>

          {profileSaved && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ¡Perfil actualizado satisfactoriamente en el sistema!
            </div>
          )}

          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
            <span className="font-bold block mb-0.5">Normas para comentarios:</span>
            Por favor, abstenerse de dejar comentarios ofensivos de cualquier tipo en las fichas del sistema. Gracias.
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de Usuario (Identificador):</label>
              <input
                type="text"
                disabled
                value="administrador.cba"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-xs font-mono font-semibold cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">El nombre de usuario es inmutable por seguridad de auditoría.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Comentario o Estado Institucional:</label>
              <textarea
                rows={3}
                value={profileComment}
                onChange={(e) => setProfileComment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recibir Correo Electrónico:</label>
                <select
                  value={receiveEmails}
                  onChange={(e) => setReceiveEmails(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                >
                  <option value="SI">Sí, recibir notificaciones</option>
                  <option value="NO">No, desactivar correos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recibir Mensajes Internos:</label>
                <select
                  value={receiveMessages}
                  onChange={(e) => setReceiveMessages(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                >
                  <option value="SI">Sí, habilitar mensajería</option>
                  <option value="NO">No recibir mensajes</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1E2A4A] text-[#D4AF37] font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Actualizar Perfil
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW: IDEAS Y SUGERENCIAS */}
      {activeTab === 'SUGERENCIAS' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-cba-card">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#2C2E53]">¡Sus Comentarios son Bienvenidos!</h3>
              <p className="text-xs text-slate-400">Canal directo con el equipo de soporte y desarrollo</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            Nuestro grupo de desarrollo quiere conocer su opinión. Ayúdenos a mejorar y háganos llegar sus sugerencias, comentarios e inquietudes técnicas mediante un simple mensaje.
          </p>

          {suggestionSent && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ¡Mensaje enviado con éxito al equipo de desarrollo de Lidsoftware / CBA!
            </div>
          )}

          <form onSubmit={handleSuggestionSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ingrese cualquier idea, sugerencia o inquietud:
              </label>
              <textarea
                rows={4}
                required
                value={suggestionMessage}
                onChange={(e) => setSuggestionMessage(e.target.value)}
                placeholder="Escriba aquí sus observaciones sobre el sistema o peticiones de mejora..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
              />
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <input
                type="checkbox"
                id="checkVal"
                required
                checked={suggestionCheck}
                onChange={(e) => setSuggestionCheck(e.target.checked)}
                className="mt-0.5 rounded text-[#2C2E53] focus:ring-[#D4AF37]"
              />
              <label htmlFor="checkVal" className="text-xs text-slate-600 font-medium cursor-pointer select-none">
                Confirmo que deseo remitir esta sugerencia al departamento de soporte técnico del Colegio Bellas Artes.
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2C2E53] to-[#1B1C33] hover:from-[#1B1C33] hover:to-slate-900 text-[#D4AF37] font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Enviar Mensaje
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
