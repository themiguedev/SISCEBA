import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, EducationalLevel } from '../../types';
import { getDefaultAvatarForUser } from '../../utils/avatarCatalog';
import { PasswordStrengthBar } from '../common/PasswordStrengthBar';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Key,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
  BookOpen,
  Layers,
  GraduationCap,
  Check
} from 'lucide-react';

interface SelfRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (registeredUsername: string) => void;
}

export const SelfRegisterModal: React.FC<SelfRegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { addUser, validateAndUseRegistrationCode, users } = useApp();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'DOCENTE' | 'ASISTENTE' | 'SECRETARIA'>('DOCENTE');
  const [gender, setGender] = useState<'MASCULINO' | 'FEMENINO'>('FEMENINO');
  const [selectedLevels, setSelectedLevels] = useState<EducationalLevel[]>(['MEDIA_GENERAL']);
  const [defaultLevel, setDefaultLevel] = useState<EducationalLevel>('MEDIA_GENERAL');
  const [authCode, setAuthCode] = useState('');

  const toggleLevel = (lvl: EducationalLevel) => {
    setSelectedLevels(prev => {
      let next: EducationalLevel[];
      if (prev.includes(lvl)) {
        if (prev.length === 1) return prev; // Mantener al menos uno seleccionado
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanFullName = fullName.trim();
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = authCode.trim().toUpperCase();

    if (!cleanFullName || !cleanUsername || !cleanEmail || !password.trim()) {
      setErrorMessage('Por favor complete todos los campos obligatorios (*).');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!cleanCode) {
      setErrorMessage('Debe ingresar el código de autorización otorgado por el Administrador para validar su registro.');
      return;
    }

    // Verificar si ya existe ese nombre de usuario o correo
    const userExists = users.some(
      u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanEmail
    );
    if (userExists) {
      setErrorMessage('El nombre de usuario o correo electrónico ya se encuentra registrado.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Validar el código de autorización provisto por el administrador
      const codeValidation = await validateAndUseRegistrationCode(cleanCode, role, cleanUsername);
      if (!codeValidation.valid) {
        setIsSubmitting(false);
        setErrorMessage(codeValidation.message || 'Código de registro inválido o ya utilizado.');
        return;
      }

      // 2. Asignar avatar institucional predeterminado según el sexo y rol
      const avatarUrl = getDefaultAvatarForUser({
        gender,
        role,
        fullName: cleanFullName
      });

      // 3. Crear el nuevo usuario en el sistema (AppContext + Supabase si está disponible)
      await addUser({
        fullName: cleanFullName,
        username: cleanUsername,
        email: cleanEmail,
        password: password,
        role: role,
        gender: gender,
        defaultLevel: defaultLevel,
        allowedLevels: selectedLevels,
        active: true,
        avatarUrl: avatarUrl
      });

      setSuccessMessage('¡Cuenta registrada y validada con éxito! Redirigiendo al portal de acceso...');
      setIsSubmitting(false);

      setTimeout(() => {
        onSuccess(cleanUsername);
        onClose();
      }, 1800);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('Ocurrió un error al procesar el registro institucional.');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header con Paleta Institucional CBA (Azul Marino #2C2E53 + Oro #D4AF37) */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#1B1C33] via-[#242646] to-[#2C2E53] text-white flex items-center justify-between border-b border-[#D4AF37]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                Registro de Nuevo Personal CBA
              </h3>
              <p className="text-[11px] text-slate-300">
                Alta institucional para roles: Docente, Asistente o Secretaria
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Mensajes de Alerta */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Banner de Validación Requerida por Código del Administrador */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-start gap-3">
            <Key className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-700 leading-relaxed">
              <span className="font-bold text-[#2C2E53] block">
                Validación Obligatoria mediante Código del Administrador
              </span>
              Para completar su registro institucional requerirá el código oficial emitido por la administración de sistemas.
            </div>
          </div>

          {/* Grid de Campos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre Completo */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Nombre y Apellido Completo *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ej: Profa. Carmen Elena Villalobos"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#2C2E53] outline-none font-medium text-slate-800"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Nombre de Usuario */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nombre de Usuario *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: cvillalobos"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#2C2E53] outline-none font-mono text-slate-800"
              />
            </div>

            {/* Correo Electrónico Institucional */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Correo Institucional *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Ej: cvillalobos@bellasartes.edu.ve"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#2C2E53] outline-none text-slate-800"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Rol Permitido para el Portal */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Rol Institucional *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'DOCENTE' | 'ASISTENTE' | 'SECRETARIA')}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2C2E53] outline-none font-bold text-slate-800"
              >
                <option value="DOCENTE">DOCENTE (Evaluación y Planificación)</option>
                <option value="ASISTENTE">ASISTENTE (Asistencia y Disciplina)</option>
                <option value="SECRETARIA">SECRETARIA (Expedientes y Matrícula)</option>
              </select>
            </div>

            {/* Sexo / Género para Asignación de Avatar */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Sexo (Para Avatar Predeterminado) *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'MASCULINO' | 'FEMENINO')}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2C2E53] outline-none font-bold text-slate-800"
              >
                <option value="FEMENINO">Mujer (Femenino)</option>
                <option value="MASCULINO">Hombre (Masculino)</option>
              </select>
            </div>

            {/* Subsistemas / Niveles Educativos (Permite seleccionar varios) */}
            <div className="sm:col-span-2 space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-800 text-xs sm:text-sm">
                  Subsistemas / Niveles Educativos Asignados *
                </label>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  {selectedLevels.length} {selectedLevels.length === 1 ? 'nivel seleccionado' : 'niveles seleccionados'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Seleccione uno o varios niveles en los que laborará o tendrá responsabilidades:
              </p>

              {/* Botones de selección múltiple (chips interactivos) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'MEDIA_GENERAL' as EducationalLevel,
                    title: 'Media General',
                    scale: '01 a 20 pts',
                    icon: GraduationCap,
                    accent: 'indigo'
                  },
                  {
                    id: 'PRIMARIA' as EducationalLevel,
                    title: 'Primaria',
                    scale: 'Literal A-E',
                    icon: Layers,
                    accent: 'teal'
                  },
                  {
                    id: 'INICIAL' as EducationalLevel,
                    title: 'Inicial',
                    scale: 'Cualitativa L/EP/I',
                    icon: BookOpen,
                    accent: 'amber'
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

              {/* Selector de Nivel Principal (de los seleccionados) */}
              <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Nivel Educativo Principal al Iniciar Sesión:
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Nivel que se cargará por defecto al ingresar al sistema.
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

            {/* Contraseña con Generador y Barra de Seguridad */}
            <div className="sm:col-span-2 space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block font-bold text-slate-700 mb-1">
                Contraseña de Acceso *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Ingrese o genere su contraseña segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2C2E53] outline-none text-slate-800 font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition"
                  title={showPassword ? 'Ocultar' : 'Ver'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Barra de seguridad amigable y generador */}
              <PasswordStrengthBar
                password={password}
                onGeneratePassword={(gen) => setPassword(gen)}
                showGeneratorButton={true}
              />
            </div>

            {/* Código de Autorización del Administrador */}
            <div className="sm:col-span-2 bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl space-y-1.5">
              <label className="block font-bold text-amber-950 mb-0.5">
                Código de Autorización del Administrador *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ej: CBA-DOC-2026 o código emitido por TI"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value.toUpperCase())}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-mono font-bold tracking-wider text-slate-900 uppercase"
                />
                <Key className="w-4 h-4 text-amber-600 absolute left-3 top-2.5" />
              </div>
              <span className="text-[10px] text-amber-800 block">
                Solicite este código al Administrador de Sistemas para validar su inscripción.
              </span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-bold transition rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-[#2C2E53] via-[#242646] to-[#1B1C33] hover:from-[#353866] hover:to-[#242646] text-[#D4AF37] font-black rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
                  <span>Validando Registro...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Completar Registro</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
