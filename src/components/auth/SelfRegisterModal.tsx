import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  Check,
  Users,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Info
} from 'lucide-react';

interface SelfRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (registeredUsername: string) => void;
}

type RegistrationStep = 'FORM' | 'CHILD_QUESTION' | 'SUCCESS';

export const SelfRegisterModal: React.FC<SelfRegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { addUser, validateAndUseRegistrationCode, users } = useApp();

  const [step, setStep] = useState<RegistrationStep>('FORM');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'DOCENTE' | 'SECRETARIA'>('DOCENTE');
  const [gender, setGender] = useState<'MASCULINO' | 'FEMENINO'>('FEMENINO');
  const [selectedLevels, setSelectedLevels] = useState<EducationalLevel[]>(['MEDIA_GENERAL']);
  const [defaultLevel, setDefaultLevel] = useState<EducationalLevel>('MEDIA_GENERAL');
  const [authCode, setAuthCode] = useState('');

  // Pregunta institucional: ¿Tiene un hijo o hija estudiando en la institución?
  const [hasChildInInstitution, setHasChildInInstitution] = useState<boolean | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const resetForm = () => {
    setStep('FORM');
    setFullName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setRole('DOCENTE');
    setGender('FEMENINO');
    setSelectedLevels(['MEDIA_GENERAL']);
    setDefaultLevel('MEDIA_GENERAL');
    setAuthCode('');
    setHasChildInInstitution(null);
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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

  if (!isOpen) return null;

  // Paso 1: Validar datos y comprobar código de autorización (sin consumirlo aún)
  const handleValidateFormAndCode = async (e: React.FormEvent) => {
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
      setErrorMessage('El nombre de usuario o correo electrónico ya se encuentra registrado en el sistema.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Validar el código de autorización sin quemarlo todavía (consume = false)
      const codeValidation = await validateAndUseRegistrationCode(cleanCode, role, cleanUsername, false);
      setIsSubmitting(false);

      if (!codeValidation.valid) {
        setErrorMessage(codeValidation.message || 'Código de registro inválido o ya utilizado.');
        return;
      }

      // Código válido: pasar al siguiente paso para preguntarle si tiene hijos estudiando
      setErrorMessage('');
      setStep('CHILD_QUESTION');
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('Ocurrió un error al verificar el código de autorización.');
      console.error(err);
    }
  };

  // Paso 2: Finalizar registro según respuesta de parentesco (consume el código y crea el usuario)
  const handleFinalizeRegistration = async () => {
    if (hasChildInInstitution === null) {
      setErrorMessage('Por favor seleccione una respuesta: Sí o No para configurar sus accesos.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const cleanFullName = fullName.trim();
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = authCode.trim().toUpperCase();

    try {
      // 1. Consumir definitivamente el código de autorización (uso único)
      const codeValidation = await validateAndUseRegistrationCode(cleanCode, role, cleanUsername, true);
      if (!codeValidation.valid) {
        setIsSubmitting(false);
        setErrorMessage(codeValidation.message || 'Código de registro inválido o ya utilizado.');
        setStep('FORM');
        return;
      }

      // 2. Si tiene un hijo/hija estudiando en la institución, otorgar también acceso al rol de REPRESENTANTE
      const additionalRoles: UserRole[] = hasChildInInstitution ? ['REPRESENTANTE'] : [];

      // 3. Asignar avatar institucional predeterminado según el sexo y rol
      const avatarUrl = getDefaultAvatarForUser({
        gender,
        role,
        fullName: cleanFullName
      });

      // 4. Crear el nuevo usuario en el sistema con sus roles respectivos
      await addUser({
        fullName: cleanFullName,
        username: cleanUsername,
        email: cleanEmail,
        password: password,
        role: role,
        roles: additionalRoles.length > 0 ? additionalRoles : undefined,
        gender: gender,
        defaultLevel: defaultLevel,
        allowedLevels: selectedLevels,
        active: true,
        avatarUrl: avatarUrl
      });

      setIsSubmitting(false);
      setStep('SUCCESS');
      setSuccessMessage(
        hasChildInInstitution
          ? `¡Cuenta registrada y validada con éxito! Se le ha asignado su rol de ${role} y acceso complementario como REPRESENTANTE.`
          : `¡Cuenta registrada y validada con éxito con el rol de ${role}!`
      );

      // Redirección al login tras completar
      setTimeout(() => {
        onSuccess(cleanUsername);
        handleClose();
      }, 2400);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('Ocurrió un error al procesar el registro institucional.');
      console.error(err);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header Institucional CBA (Azul Marino #2C2E53 + Oro #D4AF37) */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#1B1C33] via-[#242646] to-[#2C2E53] text-white flex items-center justify-between border-b border-[#D4AF37]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold">
              {step === 'FORM' ? (
                <UserPlus className="w-5 h-5" />
              ) : step === 'CHILD_QUESTION' ? (
                <Users className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                {step === 'FORM' && 'Registro de Nuevo Personal CBA'}
                {step === 'CHILD_QUESTION' && 'Configuración de Accesos Institucionales'}
                {step === 'SUCCESS' && '¡Registro Institucional Exitoso!'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {step === 'FORM' && 'Paso 1 de 2: Datos laborales y código de autorización'}
                {step === 'CHILD_QUESTION' && 'Paso 2 de 2: Vinculación familiar y rol de representante'}
                {step === 'SUCCESS' && 'Cuenta validada y habilitada en la base de datos'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* PASO 1: FORMULARIO DE DATOS Y CÓDIGO DE AUTORIZACIÓN    */}
        {/* ======================================================== */}
        {step === 'FORM' && (
          <form onSubmit={handleValidateFormAndCode} className="p-6 overflow-y-auto space-y-4 text-xs">
            {/* Mensajes de Alerta */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
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
                  onChange={(e) => setRole(e.target.value as 'DOCENTE' | 'SECRETARIA')}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2C2E53] outline-none font-bold text-slate-800"
                >
                  <option value="DOCENTE">DOCENTE (Evaluación y Planificación)</option>
                  <option value="SECRETARIA">SECRETARIA (Asistencia y Conducta)</option>
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

              {/* Subsistemas / Niveles Educativos */}
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

                {/* Selector de Nivel Principal */}
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

            {/* Botones de Acción Paso 1 */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
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
                    <span>Validando Código...</span>
                  </>
                ) : (
                  <>
                    <span>Validar Código y Continuar</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* PASO 2: PREGUNTA SOBRE HIJOS Y ROL DE REPRESENTANTE      */}
        {/* ======================================================== */}
        {step === 'CHILD_QUESTION' && (
          <div className="p-6 overflow-y-auto space-y-5 text-xs animate-in fade-in duration-200">
            {/* Mensajes de Alerta */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Banner de Validación Exitosa del Código */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-emerald-900 text-xs truncate">
                    Código de Autorización Verificado con Éxito
                  </p>
                  <p className="text-[11px] text-emerald-700 truncate">
                    Personal: <strong className="font-semibold text-emerald-950">{fullName}</strong> (@{username}) • Rol: <strong>{role}</strong>
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-emerald-200/60 text-emerald-900 border border-emerald-300 shrink-0">
                {authCode.trim().toUpperCase()}
              </span>
            </div>

            {/* Pregunta Institucional Destacada */}
            <div className="text-center py-2 space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#D4AF37]/15 text-[#8F7418] border border-[#D4AF37]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                Vinculación de Perfiles Institucionales CBA
              </span>
              <h4 className="text-base sm:text-lg font-black text-[#1B1C33] tracking-tight">
                ¿Tiene un hijo o hija estudiando en la institución?
              </h4>
              <p className="text-slate-600 text-xs max-w-md mx-auto leading-relaxed">
                Indique si cuenta con hijos o representados matriculados actualmente en el Colegio Bellas Artes para habilitar los roles y accesos correspondientes.
              </p>
            </div>

            {/* Tarjetas de Selección Interactiva (SÍ / NO) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* OPCIÓN SÍ: Concede acceso también al rol de REPRESENTANTE */}
              <button
                type="button"
                onClick={() => {
                  setHasChildInInstitution(true);
                  setErrorMessage('');
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between gap-3 cursor-pointer ${
                  hasChildInInstitution === true
                    ? 'border-[#D4AF37] bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-white shadow-md ring-2 ring-[#D4AF37]/40'
                    : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        hasChildInInstitution === true
                          ? 'bg-[#2C2E53] text-[#D4AF37]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#1B1C33] block">
                        SÍ, tengo un hijo(a)
                      </span>
                      <span className="text-[10px] font-bold text-amber-700">
                        Habilitar Rol de Representante
                      </span>
                    </div>
                  </div>

                  {/* Radio checkmark */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      hasChildInInstitution === true
                        ? 'border-[#D4AF37] bg-[#D4AF37] text-slate-950 shadow-xs'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {hasChildInInstitution === true && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Se le otorgará acceso simultáneo a su rol laboral de <strong>{role}</strong> y también al rol de <strong>REPRESENTANTE</strong>.
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-900 border border-amber-400/40">
                      ✓ Consulta de notas y boletines
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                      ✓ Cambio rápido de rol en cabecera
                    </span>
                  </div>
                </div>
              </button>

              {/* OPCIÓN NO: Exclusivo rol institucional */}
              <button
                type="button"
                onClick={() => {
                  setHasChildInInstitution(false);
                  setErrorMessage('');
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between gap-3 cursor-pointer ${
                  hasChildInInstitution === false
                    ? 'border-[#2C2E53] bg-gradient-to-br from-slate-100 via-slate-50 to-white shadow-md ring-2 ring-[#2C2E53]/25'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        hasChildInInstitution === false
                          ? 'bg-[#2C2E53] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#1B1C33] block">
                        NO, no tengo hijos aquí
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        Únicamente Labor Institucional
                      </span>
                    </div>
                  </div>

                  {/* Radio checkmark */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      hasChildInInstitution === false
                        ? 'border-[#2C2E53] bg-[#2C2E53] text-white shadow-xs'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {hasChildInInstitution === false && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Su cuenta se configurará exclusivamente con su rol de <strong>{role}</strong> para sus funciones oficiales en el plantel.
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      ✓ Perfil exclusivo de {role}
                    </span>
                  </div>
                </div>
              </button>

            </div>

            {/* Nota de Ayuda Institucional */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-start gap-2.5 text-[11px]">
              <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                Si selecciona <strong>SÍ</strong>, podrá alternar entre su rol de <strong>{role}</strong> y el rol de <strong>REPRESENTANTE</strong> directamente desde su avatar en la barra superior al iniciar sesión.
              </div>
            </div>

            {/* Botones de Acción Paso 2 */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setStep('FORM');
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-bold transition rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Modificar Datos</span>
              </button>

              <button
                type="button"
                onClick={handleFinalizeRegistration}
                disabled={hasChildInInstitution === null || isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-[#2C2E53] via-[#242646] to-[#1B1C33] hover:from-[#353866] hover:to-[#242646] text-[#D4AF37] font-black rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
                    <span>Creando Cuenta...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Completar Registro</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PASO 3: CONFIRMACIÓN Y ÉXITO                             */}
        {/* ======================================================== */}
        {step === 'SUCCESS' && (
          <div className="p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-[#1B1C33]">
                ¡Registro Completado con Éxito!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {successMessage}
              </p>
            </div>

            {/* Resumen de Accesos */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left max-w-sm mx-auto space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Usuario de acceso:</span>
                <span className="font-mono font-bold text-[#1B1C33]">@{username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Rol Principal:</span>
                <span className="font-bold text-[#2C2E53] px-2 py-0.5 rounded bg-[#2C2E53]/10">
                  {role}
                </span>
              </div>
              {hasChildInInstitution && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  <span className="text-amber-800 font-semibold">Rol Adicional:</span>
                  <span className="font-bold text-amber-900 px-2 py-0.5 rounded bg-amber-400/20 border border-amber-400/40">
                    + REPRESENTANTE
                  </span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Redirigiendo automáticamente a la pantalla de inicio de sesión...
            </p>

            <button
              type="button"
              onClick={() => {
                onSuccess(username.trim().toLowerCase());
                handleClose();
              }}
              className="px-6 py-2 bg-[#2C2E53] text-[#D4AF37] hover:bg-[#1B1C33] font-black rounded-xl text-xs transition cursor-pointer shadow-sm"
            >
              Iniciar Sesión Ahora
            </button>
          </div>
        )}

      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
