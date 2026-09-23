import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme, THEMES_CATALOG, ThemePalette } from '../../context/ThemeContext';
import { UserRole, EducationalLevel } from '../../types';
import {
  Settings,
  Calendar,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  School,
  Clock,
  UserCheck,
  UserPlus,
  User,
  Mail,
  ShieldCheck,
  Layers,
  Save,
  Palette,
  Sun,
  Moon,
  Laptop,
  Sparkles,
  GraduationCap,
  BookOpen,
  Check,
  RotateCcw,
  ShieldX,
  Key,
  Copy,
  Trash2
} from 'lucide-react';
import { hasSubTabAccess, canConfigureSchool, ROLE_METADATA } from '../../utils/rbac';
import { getDefaultAvatarForUser } from '../../utils/avatarCatalog';
import { PasswordStrengthBar } from '../common/PasswordStrengthBar';

interface ConfiguracionModuleProps {
  activeSubTab?: 'LAPSOS' | 'ESTRUCTURA' | 'DOCENTES' | 'TEMAS';
  setActiveSubTab?: (subTab: 'LAPSOS' | 'ESTRUCTURA' | 'DOCENTES' | 'TEMAS') => void;
}

export const ConfiguracionModule: React.FC<ConfiguracionModuleProps> = ({
  activeSubTab,
  setActiveSubTab
}) => {
  const {
    schoolYearConfig,
    toggleLapsoGrading,
    isLapsoOpenForGrading,
    activeLapso,
    currentRole,
    users,
    addUser,
    registrationCodes,
    createRegistrationCode,
    deleteRegistrationCode
  } = useApp();
  const { mode, setMode, palette, setPalette, isDark, themesCatalog } = useTheme();

  // Estados para códigos de registro generados por admin
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [selectedRoleForCode, setSelectedRoleForCode] = useState<'DOCENTE' | 'ASISTENTE' | 'SECRETARIA'>('DOCENTE');

  // Estados para el formulario de nuevo usuario / docente
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('DOCENTE');
  const [newGender, setNewGender] = useState<'MASCULINO' | 'FEMENINO'>('FEMENINO');
  const [newSelectedLevels, setNewSelectedLevels] = useState<EducationalLevel[]>(['MEDIA_GENERAL']);
  const [newDefaultLevel, setNewDefaultLevel] = useState<EducationalLevel>('MEDIA_GENERAL');

  const toggleNewUserLevel = (lvl: EducationalLevel) => {
    setNewSelectedLevels(prev => {
      let next: EducationalLevel[];
      if (prev.includes(lvl)) {
        if (prev.length === 1) return prev;
        next = prev.filter(l => l !== lvl);
      } else {
        next = [...prev, lvl];
      }
      if (!next.includes(newDefaultLevel)) {
        setNewDefaultLevel(next[0]);
      }
      return next;
    });
  };

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newUsername.trim() || !newEmail.trim() || !newPassword.trim()) {
      return;
    }

    const defaultAvatar = getDefaultAvatarForUser({
      gender: newGender,
      role: newRole,
      fullName: newFullName.trim()
    });

    await addUser({
      fullName: newFullName.trim(),
      username: newUsername.trim().toLowerCase(),
      email: newEmail.trim().toLowerCase(),
      password: newPassword,
      role: newRole,
      gender: newGender,
      defaultLevel: newDefaultLevel,
      allowedLevels: newSelectedLevels,
      active: true,
      avatarUrl: defaultAvatar
    });

    setNewFullName('');
    setNewUsername('');
    setNewEmail('');
    setNewPassword('');
    setNewGender('FEMENINO');
    setNewSelectedLevels(['MEDIA_GENERAL']);
    setNewDefaultLevel('MEDIA_GENERAL');
    setShowRegisterForm(false);
    handleSaveSettings();
  };
  
  const allowedTabs = (['LAPSOS', 'ESTRUCTURA', 'DOCENTES', 'TEMAS'] as const).filter(
    (t) => hasSubTabAccess(currentRole, 'CONFIGURACION', t)
  );

  const [internalActiveTab, setInternalActiveTab] = useState<'LAPSOS' | 'ESTRUCTURA' | 'DOCENTES' | 'TEMAS'>(() => {
    return allowedTabs[0] || 'TEMAS';
  });

  const requestedTab = activeSubTab || internalActiveTab;
  const activeTab = allowedTabs.includes(requestedTab) ? requestedTab : (allowedTabs[0] || 'TEMAS');

  const setActiveTab = (tab: 'LAPSOS' | 'ESTRUCTURA' | 'DOCENTES' | 'TEMAS') => {
    if (!allowedTabs.includes(tab)) return;
    if (setActiveSubTab) {
      setActiveSubTab(tab);
    }
    setInternalActiveTab(tab);
  };
  const [saveBanner, setSaveBanner] = useState(false);

  const handleSaveSettings = () => {
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Parámetros y Control del Sistema
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C2E53] mt-1">Configuración Institucional</h2>
          <p className="text-xs text-slate-500">
            ADM: Administración de años escolares, apertura y bloqueo de ventanas evaluativas de lapso y catálogo escolar.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
          {allowedTabs.includes('LAPSOS') && (
            <button
              onClick={() => setActiveTab('LAPSOS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === 'LAPSOS'
                  ? 'bg-[#20162B] text-violet-300 shadow-sm border border-violet-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'LAPSOS' ? 'text-violet-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Años Escolares y Lapsos</span>
              <span className="sm:hidden">Lapsos</span>
            </button>
          )}
          {allowedTabs.includes('ESTRUCTURA') && (
            <button
              onClick={() => setActiveTab('ESTRUCTURA')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === 'ESTRUCTURA'
                  ? 'bg-[#20162B] text-violet-300 shadow-sm border border-violet-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'ESTRUCTURA' ? 'text-violet-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Grados y Secciones</span>
              <span className="sm:hidden">Estructura</span>
            </button>
          )}
          {allowedTabs.includes('DOCENTES') && (
            <button
              onClick={() => setActiveTab('DOCENTES')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === 'DOCENTES'
                  ? 'bg-[#20162B] text-violet-300 shadow-sm border border-violet-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserCheck className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'DOCENTES' ? 'text-violet-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Carga Horaria y Docentes</span>
              <span className="sm:hidden">Docentes</span>
            </button>
          )}
          {allowedTabs.includes('TEMAS') && (
            <button
              onClick={() => setActiveTab('TEMAS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === 'TEMAS'
                  ? 'bg-[#20162B] text-violet-300 shadow-sm border border-violet-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Palette className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'TEMAS' ? 'text-violet-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Apariencia y Temas</span>
              <span className="sm:hidden">Temas</span>
            </button>
          )}
        </div>
      </div>

      {saveBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ¡Configuración guardada y sincronizada para toda la institución!
        </div>
      )}

      {/* VIEW 1: LAPSOS Y REGLA DE BLOQUEO TEMPORAL */}
      {activeTab === 'LAPSOS' && (
        <div className="space-y-6">
          {/* Regla de negocio banner */}
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 transition-colors ${
              isLapsoOpenForGrading
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            {isLapsoOpenForGrading ? (
              <Unlock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Lock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-extrabold block text-sm mb-0.5">
                Estado del Lapso {activeLapso}:{' '}
                {isLapsoOpenForGrading ? 'HABILITADO PARA CARGA DOCENTE' : 'BLOQUEADO PARA CARGA'}
              </span>
              {isLapsoOpenForGrading ? (
                <span>
                  Los docentes pueden asentar calificaciones, literales e indicadores de logro normalmente en sus planillas.
                </span>
              ) : (
                <span className="font-bold text-rose-700">
                  Regla de negocio activa: Los docentes verán el banner de restricción reglamentario: <br />
                  <code className="bg-rose-100 px-1.5 py-0.5 rounded font-mono font-black text-rose-900 text-[11px] mt-1 inline-block">
                    ⛔ "No existen lapsos habilitados para la carga de registros."
                  </code>
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-extrabold text-sm text-[#2C2E53]">
                  Periodo Lectivo Activo: {schoolYearConfig.year}
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">3 Lapsos Pedagógicos</span>
            </div>

            <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1B1C33] text-white uppercase text-[10px] tracking-wider font-extrabold">
                <tr>
                  <th className="py-3.5 px-4">Lapso Académico</th>
                  <th className="py-3.5 px-4">Fecha de Inicio</th>
                  <th className="py-3.5 px-4">Fecha de Cierre</th>
                  <th className="py-3.5 px-4 text-center">Ventana de Carga de Notas</th>
                  <th className="py-3.5 px-4 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {schoolYearConfig.lapsos.map((l) => (
                  <tr key={l.lapso} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{l.name}</p>
                      {activeLapso === l.lapso && (
                        <span className="text-[10px] text-[#D4AF37] font-extrabold block">
                          ● Lapso en curso en interfaz
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono">{l.startDate}</td>
                    <td className="py-3.5 px-4 font-mono">{l.endDate}</td>
                    <td className="py-3.5 px-4 text-center">
                      {l.isGradingOpen ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                          <Unlock className="w-3 h-3" />
                          Habilitado / Abierto
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 inline-flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Cerrado / Bloqueado
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {canConfigureSchool(currentRole) ? (
                        <button
                          onClick={() => toggleLapsoGrading(l.lapso)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition shadow-sm ${
                            l.isGradingOpen
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {l.isGradingOpen ? 'Cerrar Lapso' : 'Abrir para Carga'}
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Solo Dirección
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ESTRUCTURA DE CURSOS */}
      {activeTab === 'ESTRUCTURA' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-[#2C2E53] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D4AF37]" />
              Estructura de Niveles, Grados y Secciones
            </h3>
            <span className="text-xs text-slate-400">Colegio Bellas Artes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-xs font-black uppercase text-amber-700">Educación Inicial</span>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Sala de 3 Años (Secciones A y B)</li>
                <li>• Sala de 4 Años (Secciones A y B)</li>
                <li>• Sala de 5 Años (Secciones A y B)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-xs font-black uppercase text-emerald-700">Educación Primaria</span>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• 1er Grado a 3er Grado (A, B, C)</li>
                <li>• 4to Grado a 6to Grado (A, B, C)</li>
                <li>• Enfoque de Literales A a E</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-xs font-black uppercase text-blue-700">Media General</span>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• 1er Año a 3er Año (A, B)</li>
                <li>• 4to Año y 5to Año (A, B)</li>
                <li>• Escala Numérica 01 a 20</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: DOCENTES Y REGISTRO DE PERSONAL */}
      {activeTab === 'DOCENTES' && (
        <div className="space-y-6">
          {/* Header y Formulario de Registro de Nuevos Docentes / Usuarios */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <h3 className="font-extrabold text-base text-[#2C2E53] flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#D4AF37]" />
                  Registro Institucional de Nuevos Docentes y Personal
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Módulo administrativo para dar de alta cuentas docentes, asignación de rol, correo institucional y credenciales de acceso.
                </p>
              </div>

              {canConfigureSchool(currentRole) && (
                <button
                  onClick={() => setShowRegisterForm(!showRegisterForm)}
                  className="px-4 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  {showRegisterForm ? 'Ocultar Formulario' : '+ Registrar Nuevo Usuario / Docente'}
                </button>
              )}
            </div>

            {/* Formulario Desplegable de Registro */}
            {showRegisterForm && canConfigureSchool(currentRole) && (
              <form onSubmit={handleRegisterUser} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Datos de la Nueva Cuenta Institucional
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Prof. Roberto Carlos Mendoza"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2C2E53] focus:border-transparent outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nombre de Usuario *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: rmendoza"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2C2E53] focus:border-transparent outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Correo Institucional *</label>
                    <input
                      type="email"
                      required
                      placeholder="Ej: rmendoza@bellasartes.edu.ve"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2C2E53] focus:border-transparent outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contraseña Inicial *</label>
                    <input
                      type="password"
                      required
                      placeholder="Contraseña segura"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2C2E53] focus:border-transparent outline-none font-medium"
                    />
                    <PasswordStrengthBar
                      password={newPassword}
                      onGeneratePassword={(gen) => setNewPassword(gen)}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Rol Asignado *</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2C2E53] focus:border-transparent outline-none font-bold"
                    >
                      <option value="DOCENTE">DOCENTE (Profesor Titular / Guía)</option>
                      <option value="ASISTENTE">ASISTENTE (Asistencia y Disciplina)</option>
                      <option value="SECRETARIA">SECRETARIA (Control de Estudios / Matrícula)</option>
                      <option value="COORDINACION">COORDINACION (Control de Estudios)</option>
                      <option value="DIRECTOR">DIRECTOR (Dirección General)</option>
                      <option value="ADMINISTRADOR">ADMINISTRADOR (Admin TI)</option>
                    </select>
                  </div>

                  {/* Subsistemas / Niveles Educativos Asignados */}
                  <div className="md:col-span-2 space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-slate-800 text-xs sm:text-sm">
                        Subsistemas / Niveles Educativos Asignados *
                      </label>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                        {newSelectedLevels.length} {newSelectedLevels.length === 1 ? 'nivel seleccionado' : 'niveles seleccionados'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        {
                          id: 'MEDIA_GENERAL' as EducationalLevel,
                          title: 'Media General',
                          scale: '01 a 20 pts',
                          icon: GraduationCap
                        },
                        {
                          id: 'PRIMARIA' as EducationalLevel,
                          title: 'Primaria',
                          scale: 'Literal A-E',
                          icon: Layers
                        },
                        {
                          id: 'INICIAL' as EducationalLevel,
                          title: 'Inicial',
                          scale: 'Cualitativa L/EP/I',
                          icon: BookOpen
                        }
                      ].map((item) => {
                        const isChecked = newSelectedLevels.includes(item.id);
                        const Icon = item.icon;
                        return (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => toggleNewUserLevel(item.id)}
                            className={`p-2 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
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

                    <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Nivel Educativo Principal al Iniciar Sesión:
                      </label>
                      <select
                        value={newDefaultLevel}
                        onChange={(e) => setNewDefaultLevel(e.target.value as EducationalLevel)}
                        className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2C2E53] outline-none font-bold text-xs text-slate-800 shrink-0"
                      >
                        {newSelectedLevels.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl === 'MEDIA_GENERAL'
                              ? 'Media General (01-20 pts)'
                              : lvl === 'PRIMARIA'
                              ? 'Educación Primaria'
                              : 'Educación Inicial'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sexo / Género (Avatar Predeterminado) *</label>
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value as 'MASCULINO' | 'FEMENINO')}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2C2E53] focus:border-transparent outline-none font-bold"
                    >
                      <option value="FEMENINO">Mujer (Femenino)</option>
                      <option value="MASCULINO">Hombre (Masculino)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterForm(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-black rounded-xl shadow-md transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Registrar Cuenta en Sistema
                  </button>
                </div>
              </form>
            )}

            {/* Listado de Cuentas Registradas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                <span className="font-extrabold text-slate-700 uppercase tracking-wider">
                  Cuentas Institucionales Activas en la Base de Datos ({users.length})
                </span>
                <span className="text-slate-400">Año Escolar 2026-2027</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {users.map((u) => {
                  const roleMeta = ROLE_METADATA[u.role];
                  return (
                    <div key={u.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-colors flex items-start justify-between gap-3 shadow-xs">
                      <div className="flex items-start gap-3">
                        <img
                          src={u.avatarUrl || getDefaultAvatarForUser(u)}
                          alt={u.fullName}
                          className="w-10 h-10 rounded-full object-contain border border-slate-300 shrink-0 bg-white"
                        />
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 leading-tight">{u.fullName}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                            <span className="flex items-center gap-1"><User className="w-3 h-3 text-slate-400" />{u.username}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" />{u.email}</span>
                          </div>
                          {/* Niveles Asignados */}
                          {u.allowedLevels && u.allowedLevels.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap pt-0.5">
                              {u.allowedLevels.map(lvl => (
                                <span
                                  key={lvl}
                                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${
                                    lvl === u.defaultLevel
                                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                                      : 'bg-slate-100 text-slate-700 border-slate-200'
                                  }`}
                                  title={lvl === u.defaultLevel ? 'Nivel Principal' : 'Nivel Habilitado'}
                                >
                                  {lvl === 'MEDIA_GENERAL' ? 'Media' : lvl === 'PRIMARIA' ? 'Primaria' : 'Inicial'}
                                  {lvl === u.defaultLevel && ' ★'}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 border ${roleMeta?.badgeBg || 'bg-slate-200 text-slate-800'}`}>
                        {roleMeta?.badge || u.role}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panel de Códigos de Autorización para Auto-Registro de Docentes / Asistentes / Secretarias */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-500/10 border border-amber-400/40 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2C2E53] text-[#D4AF37] flex items-center justify-center font-bold shrink-0 shadow-sm">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#2C2E53]">
                      Códigos de Autorización para Auto-Registro (Uso Único)
                    </h4>
                    <p className="text-xs text-slate-600">
                      Entregue un código a un nuevo docente, asistente o secretaria. Cada código tiene un solo uso y se eliminará de inmediato una vez registrado el usuario.
                    </p>
                  </div>
                </div>

                {canConfigureSchool(currentRole) && (
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <select
                      value={selectedRoleForCode}
                      onChange={(e) => setSelectedRoleForCode(e.target.value as 'DOCENTE' | 'ASISTENTE' | 'SECRETARIA')}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#2C2E53]"
                    >
                      <option value="DOCENTE">Rol: DOCENTE</option>
                      <option value="ASISTENTE">Rol: ASISTENTE</option>
                      <option value="SECRETARIA">Rol: SECRETARIA</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const newC = createRegistrationCode(selectedRoleForCode);
                        setCopiedCodeId(newC.id);
                        navigator.clipboard.writeText(newC.code).catch(() => {});
                        setTimeout(() => setCopiedCodeId(null), 3000);
                      }}
                      className="px-3.5 py-1.5 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generar Código</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Lista de códigos generados */}
              {registrationCodes.length === 0 ? (
                <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    No hay códigos de autorización activos pendientes por uso. Genere un nuevo código cuando requiera autorizar a un nuevo docente o miembro del personal.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {registrationCodes.map((code) => {
                    const isCopied = copiedCodeId === code.id;
                    return (
                      <div
                        key={code.id}
                        className="p-3 rounded-xl border bg-white border-amber-200/80 shadow-xs hover:border-[#D4AF37] transition-all flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <code className="font-mono font-black text-xs text-[#2C2E53] tracking-wider">
                              {code.code}
                            </code>
                            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                              code.allowedRole === 'SECRETARIA'
                                ? 'bg-indigo-100 text-indigo-800'
                                : code.allowedRole === 'ASISTENTE'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {code.allowedRole || 'TODOS'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                            <span>Uso único disponible</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(code.code).catch(() => {});
                              setCopiedCodeId(code.id);
                              setTimeout(() => setCopiedCodeId(null), 2500);
                            }}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition shrink-0 cursor-pointer ${
                              isCopied
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                            title="Copiar código al portapapeles"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          {canConfigureSchool(currentRole) && (
                            <button
                              type="button"
                              onClick={() => deleteRegistrationCode(code.id)}
                              className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition shrink-0 cursor-pointer"
                              title="Revocar / Eliminar código de autorización"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: APARIENCIA Y TEMAS */}
      {activeTab === 'TEMAS' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Section 1: Modos Principales (Claro / Oscuro / Sistema) */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-cba-card space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-extrabold text-base text-[#2C2E53]">
                    Modos de Visualización Principales
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Selecciona la iluminación base del sistema. Esta preferencia se conserva en tu navegador.
                </p>
              </div>

              <button
                onClick={() => {
                  setMode('light');
                  setPalette('cba-classic');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition self-start sm:self-center"
                title="Restablecer tema original"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                Restablecer Predeterminado
              </button>
            </div>

            {/* 3 Main Mode Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Modo Claro */}
              <div
                onClick={() => setMode('light')}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  mode === 'light'
                    ? 'border-[#D4AF37] bg-amber-500/10 shadow-md ring-2 ring-[#D4AF37]/25'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500 shadow-sm">
                      <Sun className="w-5 h-5" />
                    </div>
                    {mode === 'light' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D4AF37] text-slate-950 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" /> Activo
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Modo Claro</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    Fondo luminoso de alta nitidez, optimizado para jornadas de trabajo diurnas en oficinas y aulas.
                  </p>
                </div>

                {/* Preview Mini Mockup - Modo Claro (Siempre luminoso, estructurado y nítido) */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  {/* Mini Barra de Navegación */}
                  <div className="h-6 rounded-lg bg-[#2C2E53] px-2.5 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                      <div className="h-1.5 w-10 bg-white/70 rounded-full"></div>
                    </div>
                    <div className="h-1.5 w-5 bg-white/40 rounded-full"></div>
                  </div>

                  {/* Mini Tarjeta de Contenido Claro */}
                  <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs flex items-center justify-between force-light">
                    <div className="space-y-1.5 w-3/5">
                      <div className="h-2 w-14 bg-slate-700/80 rounded-full"></div>
                      <div className="h-1.5 w-full bg-slate-300 rounded-full"></div>
                      <div className="h-1.5 w-4/5 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-[#2C2E53] text-white text-[8px] font-black shadow-xs">
                      Claro
                    </div>
                  </div>
                </div>
              </div>

              {/* Modo Oscuro */}
              <div
                onClick={() => setMode('dark')}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  mode === 'dark'
                    ? 'border-[#D4AF37] bg-slate-900 shadow-md ring-2 ring-[#D4AF37]/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shadow-sm">
                      <Moon className="w-5 h-5" />
                    </div>
                    {mode === 'dark' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D4AF37] text-slate-950 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" /> Activo
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Modo Oscuro
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    Tonos oscuros de bajo contraste para reducir el cansancio ocular en sesiones prolongadas.
                  </p>
                </div>

                {/* Preview Mini Mockup - Modo Oscuro (Siempre modo oscuro elegante) */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  {/* Mini Barra de Navegación Oscura */}
                  <div className="h-6 rounded-lg bg-[#141525] border border-slate-800 px-2.5 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                      <div className="h-1.5 w-10 bg-slate-300/70 rounded-full"></div>
                    </div>
                    <div className="h-1.5 w-5 bg-slate-600 rounded-full"></div>
                  </div>

                  {/* Mini Tarjeta de Contenido Oscuro */}
                  <div className="p-2 bg-[#1A2230] rounded-lg border border-slate-800 shadow-xs flex items-center justify-between">
                    <div className="space-y-1.5 w-3/5">
                      <div className="h-2 w-14 bg-slate-200 rounded-full"></div>
                      <div className="h-1.5 w-full bg-slate-700 rounded-full"></div>
                      <div className="h-1.5 w-4/5 bg-slate-800 rounded-full"></div>
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-[#D4AF37] text-slate-950 text-[8px] font-black shadow-xs">
                      Oscuro
                    </div>
                  </div>
                </div>
              </div>

              {/* Modo Sistema */}
              <div
                onClick={() => setMode('system')}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  mode === 'system'
                    ? 'border-[#D4AF37] bg-amber-500/10 shadow-md ring-2 ring-[#D4AF37]/25'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-400 shadow-sm">
                      <Laptop className="w-5 h-5" />
                    </div>
                    {mode === 'system' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D4AF37] text-slate-950 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" /> Activo ({isDark ? 'Oscuro' : 'Claro'})
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Modo Sistema</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    Sincroniza dinámicamente con la configuración de tu sistema operativo (Windows, macOS o Linux).
                  </p>
                </div>

                {/* Preview Mini Mockup - Modo Sistema (Simulación dual Día / Noche perfectamente equilibrada) */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  {/* Mini Barra Superior Informativa */}
                  <div className="h-6 rounded-lg bg-gradient-to-r from-[#2C2E53] to-[#141525] px-2.5 flex items-center justify-between shadow-xs text-white">
                    <span className="text-[8px] font-extrabold tracking-wider uppercase opacity-80">Sincronización OS</span>
                    <span className="text-[8px] font-bold text-[#D4AF37]">Auto</span>
                  </div>

                  {/* Cápsulas gemelas Día y Noche */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs flex items-center justify-center gap-1.5 force-light">
                      <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-[10px] font-black force-light-text text-slate-900">Día</span>
                    </div>
                    <div className="p-2 bg-[#141525] rounded-lg border border-slate-800 shadow-xs flex items-center justify-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="text-[10px] font-black text-white">Noche</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Otros Temas y Paletas de Color */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-cba-card space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-extrabold text-base text-[#2C2E53]">
                  Otros Temas de Personalización
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Colección de esquemas cromáticos cuidadosamente diseñados para enriquecer la experiencia visual del colegio.
              </p>
            </div>

            {/* Grid of Theme Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {themesCatalog.map((t) => {
                const isActive = palette === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setPalette(t.id)}
                    className={`rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between hover:shadow-lg ${
                      isActive
                        ? 'border-[#D4AF37] bg-white ring-2 ring-[#D4AF37]/25 shadow-md scale-[1.01]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      {/* Top Bar with Name & Active Badge */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {t.category}
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-900 mt-1.5 flex items-center gap-1.5">
                            <span>{t.emoji}</span>
                            <span>{t.name}</span>
                          </h4>
                        </div>
                        {isActive && (
                          <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D4AF37] text-slate-950 shadow-sm">
                            <Check className="w-3 h-3 stroke-[3]" /> Activo
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">
                        {t.description}
                      </p>

                      {/* Swatch chips */}
                      <div className="space-y-1.5 mb-4">
                        <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                          <span>Muestra de Colores:</span>
                          <span className="font-mono text-[10px] text-slate-400">{t.primaryColor}</span>
                        </div>
                        <div className="flex items-center gap-2 h-7">
                          <div
                            className="flex-1 h-full rounded-lg shadow-inner flex items-center justify-center text-[9px] font-bold text-white uppercase"
                            style={{ backgroundColor: t.primaryColor }}
                            title={`Color Primario: ${t.primaryColor}`}
                          >
                            Primario
                          </div>
                          <div
                            className="flex-1 h-full rounded-lg shadow-inner flex items-center justify-center text-[9px] font-bold text-white uppercase"
                            style={{ backgroundColor: t.secondaryColor }}
                            title={`Color Secundario: ${t.secondaryColor}`}
                          >
                            Secundario
                          </div>
                          <div
                            className="w-12 h-full rounded-lg shadow-inner flex items-center justify-center text-[9px] font-bold text-slate-950 uppercase"
                            style={{ backgroundColor: t.accentColor }}
                            title={`Acento: ${t.accentColor}`}
                          >
                            Acento
                          </div>
                        </div>
                      </div>

                      {/* Miniature Interface Simulation */}
                      <div
                        className="p-3 rounded-xl border border-slate-200/80 shadow-inner space-y-2"
                        style={{ backgroundColor: isDark ? t.bgDark : t.bgLight }}
                      >
                        {/* Mini Header */}
                        <div
                          className="h-6 rounded-lg flex items-center px-2.5 justify-between"
                          style={{ backgroundColor: t.primaryColor }}
                        >
                          <div className="w-10 h-1.5 rounded-full bg-white/70"></div>
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: t.accentColor }}
                          ></div>
                        </div>

                        {/* Mini Content Card */}
                        <div className="p-2 bg-white rounded-lg border border-slate-200/60 shadow-xs flex items-center justify-between">
                          <div className="space-y-1 w-2/3">
                            <div className="h-1.5 w-12 bg-slate-300 rounded"></div>
                            <div className="h-1.5 w-20 bg-slate-200 rounded"></div>
                          </div>
                          <button
                            type="button"
                            className="px-2 py-0.5 rounded text-[9px] font-bold text-white"
                            style={{ backgroundColor: t.secondaryColor }}
                          >
                            Botón
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPalette(t.id);
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isActive
                            ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm cursor-default'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Tema Actual en Uso
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            Aplicar este Tema
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Muestrario Interactivo en Vivo */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-cba-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-[#2C2E53] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Demostración en Vivo de Componentes
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Previsualización de botones, insignias y estados con el tema seleccionado en tiempo real.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold">
                  Modo: {isDark ? 'Oscuro' : 'Claro'}
                </span>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#2C2E53] text-[#D4AF37] font-bold">
                  Paleta: {themesCatalog.find((x) => x.id === palette)?.name}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Acciones */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-2.5">
                <p className="text-[11px] font-bold uppercase text-slate-400">Botones de Acción</p>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1.5 rounded-xl bg-[#2C2E53] text-white text-xs font-bold hover:opacity-90 transition shadow-sm">
                    Primario
                  </button>
                  <button className="px-3 py-1.5 rounded-xl bg-[#D4AF37] text-slate-950 text-xs font-bold hover:opacity-90 transition shadow-sm">
                    Acento
                  </button>
                  <button className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition">
                    Secundario
                  </button>
                </div>
              </div>

              {/* Insignias de Estado */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-2.5">
                <p className="text-[11px] font-bold uppercase text-slate-400">Insignias y Etiquetas</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Aprobado (19 pts)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold">
                    Lapso 1 Activo
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-bold">
                    4to Año A
                  </span>
                </div>
              </div>

              {/* Cuadros de entrada */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-2.5">
                <p className="text-[11px] font-bold uppercase text-slate-400">Campo de Formulario</p>
                <input
                  type="text"
                  readOnly
                  value="Colegio Belén San Juan - SISCEBA"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
