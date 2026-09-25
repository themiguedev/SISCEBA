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
  Phone,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Plus,
  Edit2,
  Download,
  Printer,
  MapPin,
  CalendarCheck,
  ChevronRight,
  Filter
} from 'lucide-react';
import { EducationalLevel, UserSchedule, ScheduleBlock, ScheduleDay } from '../../types';
import { OFFICIAL_AVATARS, getDefaultAvatarForUser } from '../../utils/avatarCatalog';
import { PasswordStrengthBar } from '../common/PasswordStrengthBar';
import { ROLE_METADATA } from '../../utils/rbac';

export type EscritorioTab = 'DASHBOARD' | 'PERFIL' | 'HORARIO' | 'SUGERENCIAS';

interface EscritorioViewProps {
  activeSubTab?: EscritorioTab;
  setActiveSubTab?: (tab: EscritorioTab) => void;
}

export const EscritorioView: React.FC<EscritorioViewProps> = ({
  activeSubTab,
  setActiveSubTab
}) => {
  const {
    currentRole,
    birthdays,
    currentUser,
    updateUser,
    userSchedules,
    currentUserSchedule,
    saveUserSchedule,
    isSupabaseActive,
    isSavingCloud
  } = useApp();
  const [internalActiveTab, setInternalActiveTab] = useState<EscritorioTab>('DASHBOARD');

  // Estados para el Horario Institucional del Usuario
  const [scheduleDayFilter, setScheduleDayFilter] = useState<'TODOS' | ScheduleDay>('TODOS');
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [scheduleSavedToast, setScheduleSavedToast] = useState(false);

  // Formulario de nuevo bloque de clase / labor
  const [blockDay, setBlockDay] = useState<ScheduleDay>('LUNES');
  const [blockStartTime, setBlockStartTime] = useState('07:00');
  const [blockEndTime, setBlockEndTime] = useState('07:45');
  const [blockPeriod, setBlockPeriod] = useState(1);
  const [blockSubject, setBlockSubject] = useState('');
  const [blockGradeSection, setBlockGradeSection] = useState('4to Año A');
  const [blockLevel, setBlockLevel] = useState<EducationalLevel>('MEDIA_GENERAL');
  const [blockClassroom, setBlockClassroom] = useState('Aula 1');
  const [blockColor, setBlockColor] = useState('blue');

  const activeTab = activeSubTab || internalActiveTab;
  const setActiveTab = (tab: EscritorioTab) => {
    if (setActiveSubTab) {
      setActiveSubTab(tab);
    }
    setInternalActiveTab(tab);
  };

  // Avatar Presets Catalog oficiales según la imagen de referencia (Trajes y círculos)
  const AVATAR_PRESETS = OFFICIAL_AVATARS;

  // Profile Form State synced with currentUser
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [gender, setGender] = useState<'MASCULINO' | 'FEMENINO'>(
    currentUser?.gender || (currentUser ? (getDefaultAvatarForUser(currentUser).includes('female') ? 'FEMENINO' : 'MASCULINO') : 'MASCULINO')
  );
  const [profileComment, setProfileComment] = useState(
    currentUser?.bio || 'Coordinación de Evaluación y Docencia - Colegio Bellas Artes'
  );
  const [receiveEmails, setReceiveEmails] = useState(currentUser?.receiveEmails !== false ? 'SI' : 'NO');
  const [receiveMessages, setReceiveMessages] = useState(currentUser?.receiveMessages !== false ? 'SI' : 'NO');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(
    currentUser?.avatarUrl || (currentUser ? getDefaultAvatarForUser(currentUser) : '')
  );
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [avatarGenderFilter, setAvatarGenderFilter] = useState<'ALL' | 'FEMENINO' | 'MASCULINO'>(
    currentUser?.gender || 'ALL'
  );
  const [profileSaved, setProfileSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Suggestions Form State
  const [suggestionMessage, setSuggestionMessage] = useState('');
  const [suggestionCheck, setSuggestionCheck] = useState(false);
  const [suggestionSent, setSuggestionSent] = useState(false);

  // Subsistemas / Niveles asignados
  const [selectedLevels, setSelectedLevels] = useState<EducationalLevel[]>(() => {
    if (currentUser?.allowedLevels && currentUser.allowedLevels.length > 0) {
      return currentUser.allowedLevels;
    }
    if (currentUser?.defaultLevel) {
      return [currentUser.defaultLevel];
    }
    return ['MEDIA_GENERAL'];
  });
  const [defaultLevel, setDefaultLevel] = useState<EducationalLevel>(currentUser?.defaultLevel || 'MEDIA_GENERAL');

  const toggleLevel = (lvl: EducationalLevel) => {
    setSelectedLevels(prev => {
      let next: EducationalLevel[];
      if (prev.includes(lvl)) {
        if (prev.length === 1) return prev; // Mantener al menos un nivel asignado
        next = prev.filter(l => l !== lvl);
      } else {
        next = [...prev, lvl];
      }
      if (!next.includes(defaultLevel)) {
        setDefaultLevel(next[0]);
      }
      return next;
    });
  };

  // Sincronizar si cambia de usuario en sesión
  React.useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      const userGender = currentUser.gender || (getDefaultAvatarForUser(currentUser).includes('female') ? 'FEMENINO' : 'MASCULINO');
      setGender(userGender);
      setProfileComment(currentUser.bio || 'Coordinación de Evaluación y Docencia - Colegio Bellas Artes');
      setReceiveEmails(currentUser.receiveEmails !== false ? 'SI' : 'NO');
      setReceiveMessages(currentUser.receiveMessages !== false ? 'SI' : 'NO');
      setSelectedAvatarUrl(currentUser.avatarUrl || getDefaultAvatarForUser(currentUser));
      setAvatarGenderFilter(userGender);
      if (currentUser.allowedLevels && currentUser.allowedLevels.length > 0) {
        setSelectedLevels(currentUser.allowedLevels);
      } else if (currentUser.defaultLevel) {
        setSelectedLevels([currentUser.defaultLevel]);
      }
      if (currentUser.defaultLevel) {
        setDefaultLevel(currentUser.defaultLevel);
      }
    }
  }, [currentUser]);

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Manejador de carga de archivo local con compresión y redimensionamiento inteligente
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccione un archivo de imagen válido (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5 MB.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const rawDataUrl = reader.result;
        // Redimensionar la imagen a un avatar óptimo (máx 280x280) para guardar ágilmente en Supabase
        const img = new Image();
        img.onload = () => {
          const maxDim = 280;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setSelectedAvatarUrl(optimizedDataUrl);
          } else {
            setSelectedAvatarUrl(rawDataUrl);
          }
          setIsUploading(false);
        };
        img.onerror = () => {
          setSelectedAvatarUrl(rawDataUrl);
          setIsUploading(false);
        };
        img.src = rawDataUrl;
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
    if (!currentUser || isSavingProfile) return;

    setIsSavingProfile(true);
    try {
      await updateUser(currentUser.id, {
        fullName: fullName.trim() || currentUser.fullName,
        email: email.trim() || currentUser.email,
        phone: phone.trim(),
        gender: gender,
        bio: profileComment.trim(),
        avatarUrl: selectedAvatarUrl,
        receiveEmails: receiveEmails === 'SI',
        receiveMessages: receiveMessages === 'SI',
        allowedLevels: selectedLevels,
        defaultLevel: defaultLevel
      });

      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3500);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      alert('No se pudo guardar el perfil en la base de datos.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentUser) return;
    if (!newPassword.trim()) {
      setPasswordError('Por favor ingrese la nueva contraseña.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe contener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden. Por favor verifique.');
      return;
    }

    try {
      await updateUser(currentUser.id, {
        password: newPassword
      });
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 4500);
    } catch {
      setPasswordError('Error al actualizar la contraseña en el sistema.');
    }
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

        {/* Subtabs Pill Switcher - Con scroll horizontal en móviles */}
        <div className="w-full sm:w-auto overflow-x-auto no-scrollbar flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-inner shrink-0">
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
            onClick={() => setActiveTab('HORARIO')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'HORARIO'
                ? 'bg-[#1B1C33] text-amber-300 shadow-sm border border-amber-400/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${activeTab === 'HORARIO' ? 'text-amber-400' : 'text-slate-500'}`} />
            Mi Horario
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Última Visita</span>
                  <p className="text-xs font-extrabold text-slate-800 mt-1">Hoy</p>
                  <p className="text-[10px] text-slate-500">{new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Sesión Actual</span>
                  <p className="text-sm font-black text-emerald-600 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Activa
                  </p>
                  <p className="text-[10px] text-slate-500">En línea</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Año Escolar</span>
                  <p className="text-xs font-black text-[#2C2E53] mt-1">2026 - 2027</p>
                  <p className="text-[10px] text-slate-400 font-medium">Ciclo Oficial</p>
                </div>
              </div>

              {/* Roles Asignados */}
              <div>
                <span className="text-xs font-bold text-slate-600 block mb-2">Rol y Perfil Asignado en esta Cuenta:</span>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm flex items-center gap-1.5 ${ROLE_METADATA[currentRole]?.badgeBg || 'bg-[#1B1C33] text-[#D4AF37] border-[#2C2E53]'}`}>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{ROLE_METADATA[currentRole]?.label || currentRole}</span>
                    <span className="opacity-75 text-[10px]">({currentRole})</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Sitios Más Visitados según el rol */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-bold text-[#2C2E53] text-sm">Sitios y Secciones Más Visitadas</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Frecuencia de Uso</span>
              </div>

              {currentRole === 'ASISTENTE' ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">1. Pases por Retraso (Gestión)</span>
                      <span className="text-[#D4AF37] font-extrabold">42.5 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-[#D4AF37] rounded-full" style={{ width: '42.5%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">2. Inasistencias y Pase de Lista</span>
                      <span className="text-emerald-600 font-extrabold">34.8 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '34.8%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">3. Registro de Conductas y Faltas</span>
                      <span className="text-amber-600 font-extrabold">22.7 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '22.7%' }}></div>
                    </div>
                  </div>
                </div>
              ) : currentRole === 'SECRETARIA' ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">1. Solicitudes y Documentos Académicos</span>
                      <span className="text-[#D4AF37] font-extrabold">45.0 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-[#D4AF37] rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">2. Padrón Estudiantil y Matrícula</span>
                      <span className="text-indigo-600 font-extrabold">31.2 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '31.2%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">3. Registro de Inscripciones</span>
                      <span className="text-emerald-600 font-extrabold">23.8 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '23.8%' }}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">1. Calificaciones y Notas</span>
                      <span className="text-[#D4AF37] font-extrabold">36.3 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-[#D4AF37] rounded-full" style={{ width: '36.3%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">2. Planificación Didáctica</span>
                      <span className="text-blue-600 font-extrabold">26.6 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '26.6%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">3. Asistencias y Matrícula</span>
                      <span className="text-emerald-600 font-extrabold">21.2 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '21.2%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">4. Boletines y Reportes</span>
                      <span className="text-purple-600 font-extrabold">15.9 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '15.9%' }}></div>
                    </div>
                  </div>
                </div>
              )}
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
                {birthdays.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4 italic">
                    No hay cumpleaños registrados para esta fecha.
                  </p>
                ) : (
                  birthdays.map((b) => (
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
                  ))
                )}
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
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain bg-white border-2 border-[#D4AF37] shadow-md p-0.5"
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
                    const isSelected = selectedAvatarUrl === avatar.svgDataUri;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => {
                          setSelectedAvatarUrl(avatar.svgDataUri);
                          setGender(avatar.gender);
                        }}
                        className={`relative group p-2 rounded-xl border transition-all text-left flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-[#2C2E53]/5 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={avatar.svgDataUri}
                            alt={avatar.label}
                            className="w-10 h-10 rounded-xl object-contain border border-slate-200 group-hover:scale-105 transition bg-white"
                          />
                          {isSelected && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    Identificador oficial de auditoría.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sexo / Género Institucional:
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => {
                      const newGender = e.target.value as 'MASCULINO' | 'FEMENINO';
                      setGender(newGender);
                      setAvatarGenderFilter(newGender);
                      // Si no ha subido una foto personalizada externa, ajustar avatar por defecto al sexo
                      if (!selectedAvatarUrl || selectedAvatarUrl.startsWith('data:image/svg+xml')) {
                        setSelectedAvatarUrl(
                          getDefaultAvatarForUser({
                            gender: newGender,
                            role: currentUser?.role,
                            fullName: fullName
                          })
                        );
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  >
                    <option value="MASCULINO">Hombre (Masculino)</option>
                    <option value="FEMENINO">Mujer (Femenino)</option>
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Define la correspondencia del avatar institucional.
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
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Para avisos internos o emergencias.
                  </span>
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

              {/* SUBSISTEMAS / NIVELES EDUCATIVOS ASIGNADOS */}
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800">
                      Subsistemas / Niveles Educativos Asignados:
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Seleccione los niveles a los que tiene acceso en el colegio. Se habilitarán de inmediato en su barra de navegación.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 shrink-0">
                    {selectedLevels.length} {selectedLevels.length === 1 ? 'nivel activo' : 'niveles activos'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    {
                      id: 'INICIAL' as EducationalLevel,
                      title: 'Educación Inicial',
                      scale: 'Cualitativa (L / EP / I)',
                      icon: BookOpen,
                      color: 'text-amber-500',
                      badgeBg: 'bg-amber-500/15 text-amber-700 border-amber-300'
                    },
                    {
                      id: 'PRIMARIA' as EducationalLevel,
                      title: 'Educación Primaria',
                      scale: 'Formativa / Cualitativa',
                      icon: Layers,
                      color: 'text-emerald-500',
                      badgeBg: 'bg-emerald-500/15 text-emerald-700 border-emerald-300'
                    },
                    {
                      id: 'MEDIA_GENERAL' as EducationalLevel,
                      title: 'Media General',
                      scale: 'Cuantitativa (01 - 20 pts)',
                      icon: GraduationCap,
                      color: 'text-indigo-500',
                      badgeBg: 'bg-indigo-500/15 text-indigo-700 border-indigo-300'
                    }
                  ].map((item) => {
                    const isChecked = selectedLevels.includes(item.id);
                    const Icon = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => toggleLevel(item.id)}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                          isChecked
                            ? 'bg-[#1B1C33] text-white border-[#D4AF37] shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isChecked
                                ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs font-bold truncate ${isChecked ? 'text-white' : 'text-slate-800'}`}>
                              {item.title}
                            </p>
                            <p className={`text-[10px] truncate ${isChecked ? 'text-[#D4AF37]' : 'text-slate-400'}`}>
                              {item.scale}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? 'bg-[#D4AF37] border-[#D4AF37] text-slate-950'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Nivel Predeterminado al ingresar */}
                <div className="pt-2 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Nivel Principal Predeterminado:
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Nivel que se mostrará al iniciar sesión institucional.
                    </span>
                  </div>
                  <select
                    value={defaultLevel}
                    onChange={(e) => setDefaultLevel(e.target.value as EducationalLevel)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2C2E53] outline-none font-bold text-xs text-slate-800 shrink-0"
                  >
                    {selectedLevels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl === 'MEDIA_GENERAL'
                          ? 'Educación Media General'
                          : lvl === 'PRIMARIA'
                          ? 'Educación Primaria'
                          : 'Educación Inicial'}
                      </option>
                    ))}
                  </select>
                </div>
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
                  Los cambios se reflejarán y guardarán inmediatamente en la base de datos de SICE-CBA.
                </span>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className={`px-6 py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1E2A4A] text-[#D4AF37] font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                    isSavingProfile ? 'opacity-70 cursor-wait' : ''
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 text-[#D4AF37] ${isSavingProfile ? 'animate-spin' : ''}`} />
                  {isSavingProfile ? 'Guardando en Base de Datos...' : 'Guardar Perfil e Imagen'}
                </button>
              </div>
            </form>

            {/* SECCIÓN 3: CAMBIO DE CONTRASEÑA CON GENERADOR ROBUSTO */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#2C2E53] text-[#D4AF37] flex items-center justify-center font-bold">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#2C2E53]">
                    Seguridad y Cambio de Contraseña
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Actualice su clave de acceso institucional o genere una contraseña robusta de alta seguridad.
                  </p>
                </div>
              </div>

              {passwordSuccess && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡Su contraseña institucional ha sido actualizada y protegida criptográficamente con éxito!</span>
                </div>
              )}

              {passwordError && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nueva Contraseña:
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nueva clave segura"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53] bg-white font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 transition"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <PasswordStrengthBar
                      password={newPassword}
                      onGeneratePassword={(gen) => setNewPassword(gen)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirmar Nueva Contraseña:
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita la nueva clave"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53] bg-white font-medium"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Asegúrese de que ambas contraseñas coincidan exactamente.
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!newPassword.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2C2E53] to-[#1B1C33] hover:from-[#1B1C33] hover:to-slate-900 text-[#D4AF37] font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Actualizar Contraseña</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MI HORARIO DE CLASES / LABORES (CONEXIÓN DIRECTA CON BASE DE DATOS) */}
      {activeTab === 'HORARIO' && (() => {
        const schedule = currentUserSchedule || {
          userId: currentUser?.id || 'usr-default',
          userRole: currentRole,
          schoolYear: '2026 - 2027',
          blocks: []
        };

        const days: ScheduleDay[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];

        const filteredBlocks = scheduleDayFilter === 'TODOS'
          ? schedule.blocks
          : schedule.blocks.filter(b => b.day === scheduleDayFilter);

        // Agrupar bloques por día para la vista de cronograma
        const blocksByDay = days.reduce((acc, day) => {
          acc[day] = schedule.blocks
            .filter(b => b.day === day)
            .sort((a, b) => a.periodIndex - b.periodIndex || a.startTime.localeCompare(b.startTime));
          return acc;
        }, {} as Record<ScheduleDay, ScheduleBlock[]>);

        const handleAddBlockSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!blockSubject.trim() || !currentUser) return;

          const newBlock: ScheduleBlock = {
            id: `blk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            day: blockDay,
            startTime: blockStartTime,
            endTime: blockEndTime,
            periodIndex: Number(blockPeriod) || 1,
            subjectName: blockSubject.trim(),
            level: blockLevel,
            gradeSection: blockGradeSection.trim(),
            classroom: blockClassroom.trim() || 'Aula General',
            color: blockColor
          };

          const updatedSchedule: UserSchedule = {
            ...schedule,
            userId: currentUser.id,
            userRole: currentRole,
            blocks: [...schedule.blocks, newBlock]
          };

          const saved = await saveUserSchedule(updatedSchedule);
          if (saved) {
            setScheduleSavedToast(true);
            setTimeout(() => setScheduleSavedToast(false), 3000);
            setShowAddBlockModal(false);
            setBlockSubject('');
          }
        };

        const handleDeleteBlock = async (blockId: string) => {
          if (!currentUser) return;
          if (window.confirm('¿Desea eliminar esta sesión / hora de su horario?')) {
            const updatedSchedule: UserSchedule = {
              ...schedule,
              userId: currentUser.id,
              userRole: currentRole,
              blocks: schedule.blocks.filter(b => b.id !== blockId)
            };
            await saveUserSchedule(updatedSchedule);
            setScheduleSavedToast(true);
            setTimeout(() => setScheduleSavedToast(false), 3000);
          }
        };

        const totalHours = schedule.blocks.length;

        return (
          <div className="space-y-6">
            {/* Header de Mi Horario */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Cronograma Personal & Académico
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Año: {schedule.schoolYear}
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#2C2E53] mt-1 flex items-center gap-2">
                  <span>Horario de: {currentUser?.fullName || 'Personal CBA'}</span>
                  <span className="text-xs font-bold text-slate-500 font-normal">
                    (@{currentUser?.username || 'usuario'} • {currentRole})
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualice y gestione sus bloques de clase, horas de atención o labores asignadas con sincronización en tiempo real.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowAddBlockModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Bloque</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
                  title="Imprimir copia de mi horario"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">Imprimir</span>
                </button>
              </div>
            </div>

            {scheduleSavedToast && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>¡Horario guardado y sincronizado exitosamente!</span>
              </div>
            )}

            {/* Toolbar de Filtro por Día y Resumen */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-xs font-bold text-slate-600 mr-1">Filtrar Día:</span>
                <button
                  type="button"
                  onClick={() => setScheduleDayFilter('TODOS')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    scheduleDayFilter === 'TODOS'
                      ? 'bg-[#2C2E53] text-[#D4AF37]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semana Completa ({totalHours} Horas)
                </button>
                {days.map(d => {
                  const dayCount = schedule.blocks.filter(b => b.day === d).length;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setScheduleDayFilter(d)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        scheduleDayFilter === d
                          ? 'bg-[#2C2E53] text-[#D4AF37]'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {d} ({dayCount})
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Total de sesiones registradas: <strong className="text-slate-800 font-black">{totalHours}</strong>
              </div>
            </div>

            {/* Grilla Semanal Visual Oficial (Lunes a Viernes) */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {days.map(day => {
                const dayBlocks = blocksByDay[day] || [];
                const isFilteredOut = scheduleDayFilter !== 'TODOS' && scheduleDayFilter !== day;
                if (isFilteredOut) return null;

                return (
                  <div
                    key={day}
                    className={`bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden transition-all ${
                      scheduleDayFilter === day ? 'md:col-span-5' : ''
                    }`}
                  >
                    {/* Encabezado del Día */}
                    <div className="p-3 bg-gradient-to-r from-slate-50 to-slate-100/60 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="w-4 h-4 text-[#D4AF37]" />
                        <h4 className="font-extrabold text-xs text-slate-800 tracking-wide">
                          {day}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {dayBlocks.length} {dayBlocks.length === 1 ? 'bloque' : 'bloques'}
                      </span>
                    </div>

                    {/* Bloques de Clase / Labor en el Día */}
                    <div className="p-3 space-y-2.5 flex-1 min-h-[140px] bg-slate-50/30">
                      {dayBlocks.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                          <Clock className="w-6 h-6 text-slate-300 mb-1 stroke-1" />
                          <p className="text-[11px] italic">Sin actividades asignadas</p>
                        </div>
                      ) : (
                        dayBlocks.map(block => {
                          const colorClasses =
                            block.color === 'emerald'
                              ? 'border-emerald-300 bg-emerald-50/60 text-emerald-950'
                              : block.color === 'indigo'
                              ? 'border-indigo-300 bg-indigo-50/60 text-indigo-950'
                              : block.color === 'violet'
                              ? 'border-violet-300 bg-violet-50/60 text-violet-950'
                              : block.color === 'amber'
                              ? 'border-amber-300 bg-amber-50/60 text-amber-950'
                              : block.color === 'rose'
                              ? 'border-rose-300 bg-rose-50/60 text-rose-950'
                              : block.color === 'teal'
                              ? 'border-teal-300 bg-teal-50/60 text-teal-950'
                              : 'border-blue-300 bg-blue-50/60 text-blue-950';

                          return (
                            <div
                              key={block.id}
                              className={`p-3 rounded-xl border ${colorClasses} shadow-xs relative group transition hover:shadow-md`}
                            >
                              <div className="flex items-start justify-between gap-1 mb-1">
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/80 shadow-2xs">
                                  {block.startTime} - {block.endTime}
                                </span>
                                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/70">
                                  Hora {block.periodIndex}
                                </span>
                              </div>

                              <h5 className="font-extrabold text-xs leading-tight mb-1 text-slate-900">
                                {block.subjectName}
                              </h5>

                              <div className="space-y-0.5 text-[11px] text-slate-600 font-medium">
                                <div className="flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{block.gradeSection} ({block.level.replace('_', ' ')})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{block.classroom || 'Aula General'}</span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteBlock(block.id)}
                                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 rounded bg-white/80 hover:bg-white transition opacity-0 group-hover:opacity-100 shadow-2xs"
                                title="Eliminar este bloque"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* MODAL: AÑADIR NUEVO BLOQUE AL HORARIO */}
            {showAddBlockModal && (
              <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#2C2E53] text-[#D4AF37] flex items-center justify-center font-bold">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#2C2E53]">Añadir Sesión al Horario</h4>
                        <p className="text-[10px] text-slate-400">Complete los datos de la clase o bloque</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddBlockModal(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddBlockSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Día de la Semana:</label>
                        <select
                          value={blockDay}
                          onChange={(e) => setBlockDay(e.target.value as ScheduleDay)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                        >
                          {days.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Número de Bloque / Hora:</label>
                        <select
                          value={blockPeriod}
                          onChange={(e) => setBlockPeriod(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                            <option key={p} value={p}>Hora {p}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Hora Inicio:</label>
                        <input
                          type="time"
                          required
                          value={blockStartTime}
                          onChange={(e) => setBlockStartTime(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Hora Fin:</label>
                        <input
                          type="time"
                          required
                          value={blockEndTime}
                          onChange={(e) => setBlockEndTime(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Materia / Asignatura / Labor:</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Física, Matemáticas, Atención UCE, Portería..."
                        value={blockSubject}
                        onChange={(e) => setBlockSubject(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Subsistema / Nivel:</label>
                        <select
                          value={blockLevel}
                          onChange={(e) => setBlockLevel(e.target.value as EducationalLevel)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                        >
                          <option value="MEDIA_GENERAL">Media General</option>
                          <option value="PRIMARIA">Primaria</option>
                          <option value="INICIAL">Inicial</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Grado / Sección / Área:</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. 4to Año A, Sala 5 Años B..."
                          value={blockGradeSection}
                          onChange={(e) => setBlockGradeSection(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Aula / Espacio Físico:</label>
                        <input
                          type="text"
                          placeholder="Ej. Aula 14, Lab de Informática, Cancha..."
                          value={blockClassroom}
                          onChange={(e) => setBlockClassroom(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Color de Identificación:</label>
                        <select
                          value={blockColor}
                          onChange={(e) => setBlockColor(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                        >
                          <option value="blue">Azul (Ciencias / Regular)</option>
                          <option value="emerald">Verde (Prácticas / Recreo)</option>
                          <option value="indigo">Índigo (Teoría)</option>
                          <option value="violet">Violeta (Especialidad)</option>
                          <option value="amber">Ámbar (Atención / Reunión)</option>
                          <option value="rose">Rosa / Rojo (Control / Guardia)</option>
                          <option value="teal">Turquesa (Tutoría)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddBlockModal(false)}
                        className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingCloud}
                        className="px-5 py-2 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4 text-[#D4AF37]" />
                        <span>{isSavingCloud ? 'Guardando...' : 'Guardar Bloque'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      })()}

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
