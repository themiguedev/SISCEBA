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
  HelpCircle,
  Camera,
  Upload,
  Trash2,
  Check,
  Image as ImageIcon,
  Phone
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
  const { currentRole, birthdays, currentUser, updateUser } = useApp();
  const [internalActiveTab, setInternalActiveTab] = useState<EscritorioTab>('DASHBOARD');

  const activeTab = activeSubTab || internalActiveTab;
  const setActiveTab = (tab: EscritorioTab) => {
    if (setActiveSubTab) {
      setActiveSubTab(tab);
    }
    setInternalActiveTab(tab);
  };

  // Avatar Presets Catalog (Avatares masculinos y femeninos profesionales y estilizados)
  const AVATAR_PRESETS = [
    {
      id: 'female-1',
      label: 'Docente / Directiva (Mujer)',
      gender: 'FEMENINO',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'female-2',
      label: 'Profesora / Coordinadora',
      gender: 'FEMENINO',
      url: 'https://images.unsplash.com/photo-1580894732470-349830501a35?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'female-3',
      label: 'Especialista / Asistente',
      gender: 'FEMENINO',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'female-4',
      label: 'Orientadora / Docente',
      gender: 'FEMENINO',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'male-1',
      label: 'Administrador / Directivo (Hombre)',
      gender: 'MASCULINO',
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'male-2',
      label: 'Profesor / Coordinador',
      gender: 'MASCULINO',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'male-3',
      label: 'Docente de Ciencias / Tecnología',
      gender: 'MASCULINO',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'male-4',
      label: 'Coordinador / Asistente Académico',
      gender: 'MASCULINO',
      url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80'
    }
  ];

  // Profile Form State synced with currentUser
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [profileComment, setProfileComment] = useState(
    currentUser?.bio || 'Coordinación de Evaluación y Docencia - Colegio Bellas Artes'
  );
  const [receiveEmails, setReceiveEmails] = useState(currentUser?.receiveEmails !== false ? 'SI' : 'NO');
  const [receiveMessages, setReceiveMessages] = useState(currentUser?.receiveMessages !== false ? 'SI' : 'NO');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [avatarGenderFilter, setAvatarGenderFilter] = useState<'ALL' | 'FEMENINO' | 'MASCULINO'>('ALL');
  const [profileSaved, setProfileSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Suggestions Form State
  const [suggestionMessage, setSuggestionMessage] = useState('');
  const [suggestionCheck, setSuggestionCheck] = useState(false);
  const [suggestionSent, setSuggestionSent] = useState(false);

  // Sincronizar si cambia de usuario en sesión
  React.useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setProfileComment(currentUser.bio || 'Coordinación de Evaluación y Docencia - Colegio Bellas Artes');
      setReceiveEmails(currentUser.receiveEmails !== false ? 'SI' : 'NO');
      setReceiveMessages(currentUser.receiveMessages !== false ? 'SI' : 'NO');
      setSelectedAvatarUrl(currentUser.avatarUrl || '');
    }
  }, [currentUser]);

  // Manejador de carga de archivo local (convierte a base64 Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccione un archivo de imagen válido (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert('La imagen no debe superar los 3 MB para garantizar un rendimiento óptimo.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedAvatarUrl(reader.result);
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('Error al leer el archivo de imagen.');
    };
    reader.readAsDataURL(file);
  };

  // Manejador de URL externa personalizada
  const handleApplyCustomUrl = () => {
    if (!customImageUrl.trim()) return;
    setSelectedAvatarUrl(customImageUrl.trim());
    setCustomImageUrl('');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    await updateUser(currentUser.id, {
      fullName: fullName.trim() || currentUser.fullName,
      email: email.trim() || currentUser.email,
      phone: phone.trim(),
      bio: profileComment.trim(),
      avatarUrl: selectedAvatarUrl,
      receiveEmails: receiveEmails === 'SI',
      receiveMessages: receiveMessages === 'SI'
    });

    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3500);
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Tarjeta Principal de Perfil */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-cba-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
              <div className="flex items-center gap-4">
                {/* Avatar Preview Grande */}
                <div className="relative group shrink-0">
                  {selectedAvatarUrl ? (
                    <img
                      src={selectedAvatarUrl}
                      alt={currentUser?.fullName || 'Usuario'}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#2C2E53] to-[#1B1C33] text-[#D4AF37] border-2 border-[#D4AF37]/50 flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md">
                      {(currentUser?.fullName?.[0] || currentRole[0] || 'U').toUpperCase()}
                    </div>
                  )}
                  <label
                    htmlFor="avatar-file-input"
                    className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] border border-[#D4AF37]/60 rounded-xl shadow-lg cursor-pointer transition transform hover:scale-110"
                    title="Subir foto desde su equipo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </label>
                  <input
                    id="avatar-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-lg sm:text-xl text-[#2C2E53]">
                      {currentUser?.fullName || 'Perfil de Usuario'}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#2C2E53]/10 text-[#2C2E53] border border-[#2C2E53]/20">
                      {currentRole}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    @{currentUser?.username || 'usuario'} • {currentUser?.email || 'Sin correo asignado'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Personalice su foto institucional, elija un avatar oficial (hombre o mujer) o suba una imagen de su equipo.
                  </p>
                </div>
              </div>

              {selectedAvatarUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedAvatarUrl('')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition border border-rose-200 self-start sm:self-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Quitar Imagen
                </button>
              )}
            </div>

            {profileSaved && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>¡Perfil e imagen de usuario actualizados satisfactoriamente en SICE-CBA!</span>
              </div>
            )}

            {/* SECCIÓN 1: SELECCIÓN Y MODIFICACIÓN DE IMAGEN / AVATAR */}
            <div className="mb-8 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                  <h4 className="font-extrabold text-xs sm:text-sm text-[#2C2E53] uppercase tracking-wider">
                    Foto o Avatar de Usuario
                  </h4>
                </div>

                {/* Filtro de Género de Avatares (Hombre / Mujer / Todos) */}
                <div className="flex items-center bg-white p-0.5 rounded-xl border border-slate-200 text-xs font-bold shadow-xs">
                  <button
                    type="button"
                    onClick={() => setAvatarGenderFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      avatarGenderFilter === 'ALL'
                        ? 'bg-[#2C2E53] text-[#D4AF37]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarGenderFilter('FEMENINO')}
                    className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                      avatarGenderFilter === 'FEMENINO'
                        ? 'bg-[#2C2E53] text-[#D4AF37]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Mujer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarGenderFilter('MASCULINO')}
                    className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                      avatarGenderFilter === 'MASCULINO'
                        ? 'bg-[#2C2E53] text-[#D4AF37]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Hombre</span>
                  </button>
                </div>
              </div>

              {/* Galería de Avatares Predefinidos */}
              <div>
                <span className="block text-[11px] font-bold text-slate-500 mb-2">
                  Seleccione un avatar institucional oficial:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AVATAR_PRESETS.filter(
                    a => avatarGenderFilter === 'ALL' || a.gender === avatarGenderFilter
                  ).map(avatar => {
                    const isSelected = selectedAvatarUrl === avatar.url;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setSelectedAvatarUrl(avatar.url)}
                        className={`relative group p-2 rounded-xl border transition-all text-left flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-[#2C2E53]/5 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={avatar.url}
                            alt={avatar.label}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition"
                          />
                          {isSelected && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-slate-800 truncate">
                            {avatar.label}
                          </p>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            {avatar.gender === 'FEMENINO' ? 'Femenino' : 'Masculino'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Alternativa: Subir archivo o ingresar URL */}
              <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Opción A: Subir imagen desde la computadora */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Subir imagen desde el equipo:
                  </span>
                  <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#2C2E53] bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-[#2C2E53] cursor-pointer text-xs font-semibold transition">
                    <Upload className="w-4 h-4 text-[#D4AF37]" />
                    <span>{isUploading ? 'Procesando imagen...' : 'Examinar foto local (PNG, JPG)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Formatos: PNG, JPG, JPEG o WEBP (Máximo 3 MB).
                  </span>
                </div>

                {/* Opción B: Enlace web directo a una foto */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    O pegar enlace / URL de imagen:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="https://ejemplo.com/mifoto.jpg"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      disabled={!customImageUrl.trim()}
                      className="px-3 py-1.5 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs disabled:opacity-50 transition shrink-0"
                    >
                      Aplicar
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Cargue una fotografía institucional alojada en la web.
                  </span>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: FORMULARIO DE DATOS PERSONALES Y PREFERENCIAS */}
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre Completo:
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico Institucional:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre de Usuario (Inmutable):
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.username || 'usuario'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-xs font-mono font-semibold cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Identificador oficial en el sistema de auditoría forense.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teléfono de Contacto (Opcional):
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+58 412 1234567"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Biografía / Estado Institucional:
                </label>
                <textarea
                  rows={2}
                  value={profileComment}
                  onChange={(e) => setProfileComment(e.target.value)}
                  placeholder="Descripción de cargo o departamento..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Notificaciones por Correo Electrónico:
                  </label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mensajería Interna SICE-CBA:
                  </label>
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

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Los cambios se reflejarán inmediatamente en su sesión institucional.
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1E2A4A] text-[#D4AF37] font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  Guardar Perfil e Imagen
                </button>
              </div>
            </form>
          </div>
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
