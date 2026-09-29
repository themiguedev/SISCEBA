import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { normalizeCedulaUsername } from '../../utils/rbac';
import { ParentLegalInfo } from '../../types';
import {
  UserCheck,
  User,
  School,
  CheckCircle2,
  Search,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  HeartHandshake,
  MapPin,
  Phone,
  Mail,
  Users
} from 'lucide-react';

export const InscripcionesWizardView: React.FC = () => {
  const { students, users, addStudent, addUser, sendNotification } = useApp();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [parentTab, setParentTab] = useState<'madre' | 'padre'>('madre');
  const [includeFather, setIncludeFather] = useState<boolean>(true);
  const [primaryLegalRep, setPrimaryLegalRep] = useState<'Madre' | 'Padre' | 'Tutor Legal'>('Madre');

  const [searchCedula, setSearchCedula] = useState('');
  const [isSuccessBanner, setIsSuccessBanner] = useState(false);
  const [lastEnrolledName, setLastEnrolledName] = useState('');
  const [createdAccountsNotice, setCreatedAccountsNotice] = useState<{
    motherUser?: string;
    fatherUser?: string;
    stuUser: string;
  } | null>(null);

  // Step 1: Madre
  const [motherData, setMotherData] = useState<ParentLegalInfo>({
    parentesco: 'Madre',
    cedula: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    nacionalidad: 'V',
    pais: 'Venezuela',
    estado: 'Zulia',
    ciudad: 'Maracaibo',
    sexo: 'FEMENINO',
    fechaNacimiento: '1988-04-15',
    estadoCivil: 'Casado(a)',
    religion: 'Católica',
    telefono: '',
    correo: '',
    profesion: '',
    direccion: '',
    isPrimaryRepresentative: true
  });

  // Step 1: Padre (para familias con ambos padres o separadas con corresponsabilidad)
  const [fatherData, setFatherData] = useState<ParentLegalInfo>({
    parentesco: 'Padre',
    cedula: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    nacionalidad: 'V',
    pais: 'Venezuela',
    estado: 'Zulia',
    ciudad: 'Maracaibo',
    sexo: 'MASCULINO',
    fechaNacimiento: '1985-08-20',
    estadoCivil: 'Casado(a)',
    religion: 'Católica',
    telefono: '',
    correo: '',
    profesion: '',
    direccion: '',
    isPrimaryRepresentative: false
  });

  // Step 2: Estudiante State (Demografía, procedencia, contacto y salud)
  const [studentData, setStudentData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    cedulaEscolar: '',
    nacionalidad: 'V' as 'V' | 'E',
    pais: 'Venezuela',
    estado: 'Zulia',
    ciudad: 'Maracaibo',
    fechaNacimiento: '2015-05-12',
    genero: 'M' as 'M' | 'F',
    estadoCivil: 'Soltero(a)',
    religion: 'Católica',
    telefono: '',
    direccion: '',
    alergiasSalud: 'Ninguna patología o alergia reportada'
  });

  // Step 3: Grado y Sección
  const [academicData, setAcademicData] = useState({
    anoEscolar: '2026-2027',
    grado: '1er Año',
    seccion: 'A',
    fechaInscripcion: '2026-09-29'
  });

  const handleSearchRepresentative = () => {
    if (!searchCedula.trim()) return;
    const cleanSearch = normalizeCedulaUsername(searchCedula);

    // Buscar en estudiantes existentes si ya hay un representante con esta cédula
    const matchedStudent = students.find(
      s =>
        (s.motherInfo && normalizeCedulaUsername(s.motherInfo.cedula) === cleanSearch) ||
        (s.fatherInfo && normalizeCedulaUsername(s.fatherInfo.cedula) === cleanSearch) ||
        normalizeCedulaUsername(s.representativeEmail) === cleanSearch
    );

    if (matchedStudent?.motherInfo && normalizeCedulaUsername(matchedStudent.motherInfo.cedula) === cleanSearch) {
      setMotherData({ ...matchedStudent.motherInfo });
      setParentTab('madre');
      return;
    }

    if (matchedStudent?.fatherInfo && normalizeCedulaUsername(matchedStudent.fatherInfo.cedula) === cleanSearch) {
      setFatherData({ ...matchedStudent.fatherInfo });
      setIncludeFather(true);
      setParentTab('padre');
      return;
    }

    // Buscar en la lista de usuarios
    const matchedUser = users.find(u => normalizeCedulaUsername(u.username) === cleanSearch);
    if (matchedUser) {
      const parts = matchedUser.fullName.split(' ');
      const pNombre = parts[0] || '';
      const pApellido = parts.slice(1).join(' ') || '';
      if (parentTab === 'madre') {
        setMotherData(prev => ({
          ...prev,
          cedula: searchCedula,
          primerNombre: pNombre,
          primerApellido: pApellido,
          correo: matchedUser.email || prev.correo,
          telefono: matchedUser.phone || prev.telefono
        }));
      } else {
        setFatherData(prev => ({
          ...prev,
          cedula: searchCedula,
          primerNombre: pNombre,
          primerApellido: pApellido,
          correo: matchedUser.email || prev.correo,
          telefono: matchedUser.phone || prev.telefono
        }));
      }
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determinar nivel educativo según el grado seleccionado
    const gradeStr = academicData.grado;
    let level: 'INICIAL' | 'PRIMARIA' | 'MEDIA_GENERAL' = 'MEDIA_GENERAL';
    if (gradeStr.includes('Sala') || gradeStr.includes('Inicial')) {
      level = 'INICIAL';
    } else if (gradeStr.includes('Grado') || gradeStr.includes('Primaria')) {
      level = 'PRIMARIA';
    }

    const fullName = `${studentData.primerNombre.trim()} ${studentData.segundoNombre.trim()} ${studentData.primerApellido.trim()} ${studentData.segundoApellido.trim()}`
      .replace(/\s+/g, ' ')
      .trim();

    const studentCedula = studentData.cedulaEscolar.trim() || `ESC-${Date.now().toString().slice(-6)}`;
    const studentUsername = normalizeCedulaUsername(studentCedula);

    // Preparar información de Madre y Padre
    const hasMother = Boolean(motherData.cedula.trim() || motherData.primerNombre.trim());
    const hasFather = includeFather && Boolean(fatherData.cedula.trim() || fatherData.primerNombre.trim());

    const activeMother: ParentLegalInfo | undefined = hasMother
      ? {
          ...motherData,
          cedula: motherData.cedula.trim(),
          primerNombre: motherData.primerNombre.trim(),
          segundoNombre: motherData.segundoNombre?.trim() || '',
          primerApellido: motherData.primerApellido.trim(),
          segundoApellido: motherData.segundoApellido?.trim() || '',
          correo: motherData.correo.trim(),
          telefono: motherData.telefono.trim(),
          direccion: motherData.direccion.trim(),
          isPrimaryRepresentative: primaryLegalRep === 'Madre'
        }
      : undefined;

    const activeFather: ParentLegalInfo | undefined = hasFather
      ? {
          ...fatherData,
          cedula: fatherData.cedula.trim(),
          primerNombre: fatherData.primerNombre.trim(),
          segundoNombre: fatherData.segundoNombre?.trim() || '',
          primerApellido: fatherData.primerApellido.trim(),
          segundoApellido: fatherData.segundoApellido?.trim() || '',
          correo: fatherData.correo.trim(),
          telefono: fatherData.telefono.trim(),
          direccion: fatherData.direccion.trim() || (activeMother ? activeMother.direccion : ''),
          isPrimaryRepresentative: primaryLegalRep === 'Padre'
        }
      : undefined;

    // Determinar representante legal titular
    let repName = '';
    let repEmail = '';
    let repPhone = '';

    if (primaryLegalRep === 'Padre' && activeFather) {
      repName = `${activeFather.primerNombre} ${activeFather.primerApellido}`.trim();
      repEmail = activeFather.correo;
      repPhone = activeFather.telefono;
    } else if (activeMother) {
      repName = `${activeMother.primerNombre} ${activeMother.primerApellido}`.trim();
      repEmail = activeMother.correo;
      repPhone = activeMother.telefono;
    } else if (activeFather) {
      repName = `${activeFather.primerNombre} ${activeFather.primerApellido}`.trim();
      repEmail = activeFather.correo;
      repPhone = activeFather.telefono;
    } else {
      repName = 'Representante Legal';
    }

    // Registrar estudiante en el estado global y Supabase
    addStudent({
      cedula: studentCedula,
      fullName: fullName || 'Estudiante CBA',
      primerNombre: studentData.primerNombre.trim(),
      segundoNombre: studentData.segundoNombre.trim(),
      primerApellido: studentData.primerApellido.trim(),
      segundoApellido: studentData.segundoApellido.trim(),
      gender: studentData.genero,
      birthDate: studentData.fechaNacimiento,
      nacionalidad: studentData.nacionalidad,
      pais: studentData.pais.trim(),
      estado: studentData.estado.trim(),
      ciudad: studentData.ciudad.trim(),
      estadoCivil: studentData.estadoCivil,
      religion: studentData.religion.trim(),
      direccion: studentData.direccion.trim() || (activeMother?.direccion || activeFather?.direccion || ''),
      telefono: studentData.telefono.trim() || repPhone,
      level,
      grade: academicData.grado,
      section: academicData.seccion,
      representativeName: repName,
      representativeEmail: repEmail,
      representativePhone: repPhone,
      status: 'REGULAR',
      motherInfo: activeMother,
      fatherInfo: activeFather,
      alergiasSalud: studentData.alergiasSalud.trim()
    });

    // 1. Crear / Vincular cuenta de usuario institucional para la MADRE
    let createdMotherUser: string | undefined;
    if (activeMother && activeMother.cedula) {
      const motherUsername = normalizeCedulaUsername(activeMother.cedula);
      if (motherUsername) {
        const motherExists = users.some(
          u =>
            normalizeCedulaUsername(u.username) === motherUsername ||
            (activeMother.correo && u.email.toLowerCase() === activeMother.correo.toLowerCase())
        );
        if (!motherExists) {
          const rawDigits = activeMother.cedula.replace(/[^0-9]/g, '');
          const initialPass = rawDigits || 'cba2026';
          addUser({
            username: motherUsername,
            password: initialPass,
            fullName: `${activeMother.primerNombre} ${activeMother.primerApellido}`.trim(),
            email: activeMother.correo || `${motherUsername}@representante.cba`,
            role: 'REPRESENTANTE',
            defaultLevel: level,
            allowedLevels: [level],
            active: true,
            phone: activeMother.telefono,
            gender: 'FEMENINO'
          }).catch(err => console.warn('Error al auto-crear usuario para la Madre:', err));
        }
        createdMotherUser = motherUsername;
      }
    }

    // 2. Crear / Vincular cuenta de usuario institucional para el PADRE (Garantiza acceso mutuo e inclusivo para ambos)
    let createdFatherUser: string | undefined;
    if (activeFather && activeFather.cedula) {
      const fatherUsername = normalizeCedulaUsername(activeFather.cedula);
      if (fatherUsername) {
        const fatherExists = users.some(
          u =>
            normalizeCedulaUsername(u.username) === fatherUsername ||
            (activeFather.correo && u.email.toLowerCase() === activeFather.correo.toLowerCase())
        );
        if (!fatherExists) {
          const rawDigits = activeFather.cedula.replace(/[^0-9]/g, '');
          const initialPass = rawDigits || 'cba2026';
          addUser({
            username: fatherUsername,
            password: initialPass,
            fullName: `${activeFather.primerNombre} ${activeFather.primerApellido}`.trim(),
            email: activeFather.correo || `${fatherUsername}@representante.cba`,
            role: 'REPRESENTANTE',
            defaultLevel: level,
            allowedLevels: [level],
            active: true,
            phone: activeFather.telefono,
            gender: 'MASCULINO'
          }).catch(err => console.warn('Error al auto-crear usuario para el Padre:', err));
        }
        createdFatherUser = fatherUsername;
      }
    }

    // 3. Crear cuenta de usuario institucional para el ESTUDIANTE
    if (studentUsername) {
      const stuExists = users.some(u => normalizeCedulaUsername(u.username) === studentUsername);
      if (!stuExists) {
        const rawDigits = studentCedula.replace(/[^0-9]/g, '');
        const initialPass = rawDigits || 'cba2026';
        addUser({
          username: studentUsername,
          password: initialPass,
          fullName: fullName || 'Estudiante CBA',
          email: `${studentUsername}@estudiante.cba`,
          role: 'ESTUDIANTE',
          defaultLevel: level,
          allowedLevels: [level],
          active: true,
          gender: studentData.genero === 'F' ? 'FEMENINO' : 'MASCULINO'
        }).catch(err => console.warn('Error al auto-crear usuario para el Estudiante:', err));
      }
    }

    setCreatedAccountsNotice({
      motherUser: createdMotherUser,
      fatherUser: createdFatherUser,
      stuUser: studentUsername || studentCedula
    });

    sendNotification({
      title: 'Nueva Inscripción Formalizada con Inclusión Parental',
      message: `El estudiante ${fullName} ha sido inscrito en ${academicData.grado} "${academicData.seccion}" (${level.replace(
        '_',
        ' '
      )}). Cuentas generadas para la Madre, Padre y Estudiante con su cédula de identidad.`,
      category: 'INSTITUCIONAL',
      priority: 'ALTA',
      recipientRole: 'TODOS',
      studentName: fullName,
      actionTab: 'GESTION',
      actionSubTab: 'INSCRIPCIONES',
      deliveryChannels: ['PORTAL', 'EMAIL']
    });

    setLastEnrolledName(fullName);
    setIsSuccessBanner(true);
    setCurrentStep(1);

    // Resetear formulario para siguiente registro
    setStudentData({
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      cedulaEscolar: '',
      nacionalidad: 'V',
      pais: 'Venezuela',
      estado: 'Zulia',
      ciudad: 'Maracaibo',
      fechaNacimiento: '2015-05-12',
      genero: 'M',
      estadoCivil: 'Soltero(a)',
      religion: 'Católica',
      telefono: '',
      direccion: '',
      alergiasSalud: 'Ninguna patología o alergia reportada'
    });

    setTimeout(() => {
      setIsSuccessBanner(false);
      setCreatedAccountsNotice(null);
    }, 15000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            Admisión, Matrícula Escolar y Registro Parental
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-[#2C2E53]">
          Inscripción de Estudiantes con Inclusión de Ambos Padres
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-4xl">
          Formulario oficial con datos demográficos completos (cédula, nombres, apellidos, nacionalidad, país, estado, ciudad, sexo, fecha de nacimiento, estado civil, religión, teléfono y dirección). Garantiza el registro y acceso institucional simultáneo tanto de la madre como del padre, salvaguardando el vínculo y corresponsabilidad familiar en todo momento.
        </p>

        {/* Wizard Stepper Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
              currentStep === 1
                ? 'bg-[#2C2E53] text-white border-[#2C2E53] shadow-md'
                : currentStep > 1
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                currentStep === 1
                  ? 'bg-[#D4AF37] text-slate-950'
                  : currentStep > 1
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </div>
            <div className="truncate">
              <span className="text-[10px] uppercase font-bold block opacity-80">Etapa 1</span>
              <span className="text-xs font-black block truncate">Padres / Representantes</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
              currentStep === 2
                ? 'bg-[#2C2E53] text-white border-[#2C2E53] shadow-md'
                : currentStep > 2
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                currentStep === 2
                  ? 'bg-[#D4AF37] text-slate-950'
                  : currentStep > 2
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </div>
            <div className="truncate">
              <span className="text-[10px] uppercase font-bold block opacity-80">Etapa 2</span>
              <span className="text-xs font-black block truncate">Datos del Estudiante</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
              currentStep === 3
                ? 'bg-[#2C2E53] text-white border-[#2C2E53] shadow-md'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                currentStep === 3 ? 'bg-[#D4AF37] text-slate-950' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </div>
            <div className="truncate">
              <span className="text-[10px] uppercase font-bold block opacity-80">Etapa 3</span>
              <span className="text-xs font-black block truncate">Ubicación Académica</span>
            </div>
          </button>
        </div>
      </div>

      {/* Banner de Éxito y Cuentas Creadas */}
      {isSuccessBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold space-y-3 animate-in fade-in shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                ¡Inscripción formalizada exitosamente! Se ha creado el expediente de <strong>{lastEnrolledName || 'el estudiante'}</strong> y se guardó de inmediato en Supabase con inclusión parental.
              </span>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-md bg-emerald-200/80 text-emerald-900 text-[10px] uppercase font-black tracking-wider shrink-0">
              Sincronizado en la Nube
            </span>
          </div>

          {createdAccountsNotice && (
            <div className="bg-white/90 p-3 rounded-lg border border-emerald-200 text-[11px] text-slate-700 flex flex-wrap items-center gap-3">
              <span className="font-extrabold text-[#2C2E53] flex items-center gap-1.5 w-full sm:w-auto">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                Accesos Institucionales Generados (Cédula como usuario / Clave inicial: cédula):
              </span>
              {createdAccountsNotice.motherUser && (
                <span className="bg-slate-100 px-2.5 py-1 rounded text-slate-800 font-mono border border-slate-200">
                  Madre: <strong>{createdAccountsNotice.motherUser}</strong>
                </span>
              )}
              {createdAccountsNotice.fatherUser && (
                <span className="bg-slate-100 px-2.5 py-1 rounded text-slate-800 font-mono border border-slate-200">
                  Padre: <strong>{createdAccountsNotice.fatherUser}</strong>
                </span>
              )}
              <span className="bg-slate-100 px-2.5 py-1 rounded text-slate-800 font-mono border border-slate-200">
                Estudiante: <strong>{createdAccountsNotice.stuUser}</strong>
              </span>
            </div>
          )}
        </div>
      )}

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-cba-card">
        {/* ========================================================
            ETAPA 1: PADRES Y REPRESENTANTES (INCLUSIÓN DE AMBOS)
        ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <h3 className="font-extrabold text-[#2C2E53] text-sm flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
                  Paso 1: Información Legal de los Padres y Representantes
                </h3>
                <p className="text-[11px] text-slate-500">
                  Registro de Madre y Padre para garantizar el acceso institucional e inclusivo a ambos progenitores.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600">Representante Legal Principal:</span>
                <select
                  value={primaryLegalRep}
                  onChange={(e) => setPrimaryLegalRep(e.target.value as any)}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-extrabold text-[#2C2E53] bg-amber-50"
                >
                  <option value="Madre">Madre</option>
                  <option value="Padre">Padre</option>
                  <option value="Tutor Legal">Tutor Legal</option>
                </select>
              </div>
            </div>

            {/* Quick Search por Cédula */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
                Búsqueda rápida por Cédula:
              </span>
              <div className="flex-1 w-full flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ingrese cédula (ej. V-18452991) para autocompletar..."
                  value={searchCedula}
                  onChange={(e) => setSearchCedula(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                />
                <button
                  type="button"
                  onClick={handleSearchRepresentative}
                  className="px-3 py-1.5 bg-[#2C2E53] text-[#D4AF37] text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#1B1C33]"
                >
                  <Search className="w-3.5 h-3.5" />
                  Buscar
                </button>
              </div>
            </div>

            {/* Sub-tabs: Datos de la Madre / Datos del Padre */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setParentTab('madre')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                    parentTab === 'madre'
                      ? 'bg-[#2C2E53] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Datos de la Madre
                  {primaryLegalRep === 'Madre' && (
                    <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black">
                      Principal
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setParentTab('padre')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                    parentTab === 'padre'
                      ? 'bg-[#2C2E53] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Datos del Padre
                  {primaryLegalRep === 'Padre' && (
                    <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black">
                      Principal
                    </span>
                  )}
                </button>
              </div>

              {/* Toggle para habilitar/deshabilitar registro de padre si aplica */}
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeFather}
                  onChange={(e) => setIncludeFather(e.target.checked)}
                  className="rounded text-[#2C2E53] focus:ring-[#2C2E53] w-4 h-4"
                />
                <span>Incluir datos del Padre</span>
              </label>
            </div>

            {/* TAB CONTENT: MADRE */}
            {parentTab === 'madre' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
                  <span className="font-semibold">
                    Expediente y Cuenta Institucional de la <strong>Madre</strong>. Tendrá acceso pleno a calificaciones, reportes y comunicados.
                  </span>
                  <span className="text-[10px] uppercase font-black bg-amber-200 px-2 py-0.5 rounded text-amber-950">
                    Filiación Materna
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nacionalidad:</label>
                    <select
                      value={motherData.nacionalidad}
                      onChange={(e) => setMotherData({ ...motherData, nacionalidad: e.target.value as 'V' | 'E' })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    >
                      <option value="V">Venezolano (V)</option>
                      <option value="E">Extranjero (E)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Cédula de Identidad:</label>
                    <input
                      type="text"
                      placeholder="ej. V-18.452.991"
                      value={motherData.cedula}
                      onChange={(e) => setMotherData({ ...motherData, cedula: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sexo:</label>
                    <select
                      value={motherData.sexo}
                      onChange={(e) => setMotherData({ ...motherData, sexo: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    >
                      <option value="FEMENINO">Femenino</option>
                      <option value="MASCULINO">Masculino</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Primer Nombre:</label>
                    <input
                      type="text"
                      placeholder="ej. Patricia"
                      value={motherData.primerNombre}
                      onChange={(e) => setMotherData({ ...motherData, primerNombre: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Segundo Nombre:</label>
                    <input
                      type="text"
                      placeholder="ej. Elena"
                      value={motherData.segundoNombre || ''}
                      onChange={(e) => setMotherData({ ...motherData, segundoNombre: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Primer Apellido:</label>
                    <input
                      type="text"
                      placeholder="ej. Portillo"
                      value={motherData.primerApellido}
                      onChange={(e) => setMotherData({ ...motherData, primerApellido: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Segundo Apellido:</label>
                    <input
                      type="text"
                      placeholder="ej. Sánchez"
                      value={motherData.segundoApellido || ''}
                      onChange={(e) => setMotherData({ ...motherData, segundoApellido: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Nacimiento:</label>
                    <input
                      type="date"
                      value={motherData.fechaNacimiento || ''}
                      onChange={(e) => setMotherData({ ...motherData, fechaNacimiento: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Estado Civil:</label>
                    <select
                      value={motherData.estadoCivil}
                      onChange={(e) => setMotherData({ ...motherData, estadoCivil: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    >
                      <option value="Soltero(a)">Soltero(a)</option>
                      <option value="Casado(a)">Casado(a)</option>
                      <option value="Divorciado(a)">Divorciado(a)</option>
                      <option value="Viudo(a)">Viudo(a)</option>
                      <option value="Concubinato(a)">Concubinato(a)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Religión:</label>
                    <input
                      type="text"
                      placeholder="ej. Católica / Cristiana"
                      value={motherData.religion}
                      onChange={(e) => setMotherData({ ...motherData, religion: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono:</label>
                    <input
                      type="text"
                      placeholder="ej. 0414-6129845"
                      value={motherData.telefono}
                      onChange={(e) => setMotherData({ ...motherData, telefono: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico:</label>
                    <input
                      type="email"
                      placeholder="madre@correo.com"
                      value={motherData.correo}
                      onChange={(e) => setMotherData({ ...motherData, correo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Profesión / Ocupación:</label>
                    <input
                      type="text"
                      placeholder="ej. Docente / Administradora"
                      value={motherData.profesion || ''}
                      onChange={(e) => setMotherData({ ...motherData, profesion: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">País:</label>
                    <input
                      type="text"
                      value={motherData.pais}
                      onChange={(e) => setMotherData({ ...motherData, pais: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Estado:</label>
                    <input
                      type="text"
                      value={motherData.estado}
                      onChange={(e) => setMotherData({ ...motherData, estado: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad:</label>
                    <input
                      type="text"
                      value={motherData.ciudad}
                      onChange={(e) => setMotherData({ ...motherData, ciudad: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dirección de Habitación:</label>
                  <textarea
                    rows={2}
                    placeholder="Av., Calle, Edificio/Casa, Nro, Parroquia..."
                    value={motherData.direccion}
                    onChange={(e) => setMotherData({ ...motherData, direccion: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: PADRE */}
            {parentTab === 'padre' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {!includeFather ? (
                  <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-xs text-slate-600 mb-3">
                      El registro del padre se encuentra actualmente inactivo para esta inscripción.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIncludeFather(true)}
                      className="px-4 py-2 rounded-xl bg-[#2C2E53] text-[#D4AF37] text-xs font-bold"
                    >
                      Habilitar e incluir datos del Padre
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200/80 flex items-center justify-between text-xs text-blue-900">
                      <span className="font-semibold">
                        Expediente y Cuenta Institucional del <strong>Padre</strong>. Asegura acceso directo sin desvinculación paterna.
                      </span>
                      <span className="text-[10px] uppercase font-black bg-blue-200 px-2 py-0.5 rounded text-blue-950">
                        Filiación Paterna
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nacionalidad:</label>
                        <select
                          value={fatherData.nacionalidad}
                          onChange={(e) => setFatherData({ ...fatherData, nacionalidad: e.target.value as 'V' | 'E' })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                        >
                          <option value="V">Venezolano (V)</option>
                          <option value="E">Extranjero (E)</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Cédula de Identidad:</label>
                        <input
                          type="text"
                          placeholder="ej. V-17.890.123"
                          value={fatherData.cedula}
                          onChange={(e) => setFatherData({ ...fatherData, cedula: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Sexo:</label>
                        <select
                          value={fatherData.sexo}
                          onChange={(e) => setFatherData({ ...fatherData, sexo: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                        >
                          <option value="MASCULINO">Masculino</option>
                          <option value="FEMENINO">Femenino</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Primer Nombre:</label>
                        <input
                          type="text"
                          placeholder="ej. Carlos"
                          value={fatherData.primerNombre}
                          onChange={(e) => setFatherData({ ...fatherData, primerNombre: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Segundo Nombre:</label>
                        <input
                          type="text"
                          placeholder="ej. Eduardo"
                          value={fatherData.segundoNombre || ''}
                          onChange={(e) => setFatherData({ ...fatherData, segundoNombre: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Primer Apellido:</label>
                        <input
                          type="text"
                          placeholder="ej. Mendoza"
                          value={fatherData.primerApellido}
                          onChange={(e) => setFatherData({ ...fatherData, primerApellido: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Segundo Apellido:</label>
                        <input
                          type="text"
                          placeholder="ej. Romero"
                          value={fatherData.segundoApellido || ''}
                          onChange={(e) => setFatherData({ ...fatherData, segundoApellido: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Nacimiento:</label>
                        <input
                          type="date"
                          value={fatherData.fechaNacimiento || ''}
                          onChange={(e) => setFatherData({ ...fatherData, fechaNacimiento: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Estado Civil:</label>
                        <select
                          value={fatherData.estadoCivil}
                          onChange={(e) => setFatherData({ ...fatherData, estadoCivil: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                        >
                          <option value="Soltero(a)">Soltero(a)</option>
                          <option value="Casado(a)">Casado(a)</option>
                          <option value="Divorciado(a)">Divorciado(a)</option>
                          <option value="Viudo(a)">Viudo(a)</option>
                          <option value="Concubinato(a)">Concubinato(a)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Religión:</label>
                        <input
                          type="text"
                          placeholder="ej. Católica / Cristiana"
                          value={fatherData.religion}
                          onChange={(e) => setFatherData({ ...fatherData, religion: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono:</label>
                        <input
                          type="text"
                          placeholder="ej. 0424-6338821"
                          value={fatherData.telefono}
                          onChange={(e) => setFatherData({ ...fatherData, telefono: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico:</label>
                        <input
                          type="email"
                          placeholder="padre@correo.com"
                          value={fatherData.correo}
                          onChange={(e) => setFatherData({ ...fatherData, correo: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Profesión / Ocupación:</label>
                        <input
                          type="text"
                          placeholder="ej. Ingeniero / Comerciante"
                          value={fatherData.profesion || ''}
                          onChange={(e) => setFatherData({ ...fatherData, profesion: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">País:</label>
                        <input
                          type="text"
                          value={fatherData.pais}
                          onChange={(e) => setFatherData({ ...fatherData, pais: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Estado:</label>
                        <input
                          type="text"
                          value={fatherData.estado}
                          onChange={(e) => setFatherData({ ...fatherData, estado: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad:</label>
                        <input
                          type="text"
                          value={fatherData.ciudad}
                          onChange={(e) => setFatherData({ ...fatherData, ciudad: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">Dirección de Habitación:</label>
                        {motherData.direccion && (
                          <button
                            type="button"
                            onClick={() => setFatherData({ ...fatherData, direccion: motherData.direccion })}
                            className="text-[10px] font-bold text-[#2C2E53] hover:underline"
                          >
                            Copiar dirección de la madre
                          </button>
                        )}
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Av., Calle, Edificio/Casa, Nro, Parroquia..."
                        value={fatherData.direccion}
                        onChange={(e) => setFatherData({ ...fatherData, direccion: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                Siguiente: Datos del Estudiante
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            ETAPA 2: DATOS DEL ESTUDIANTE (DEMOGRÁFICOS COMPLETOS)
        ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-[#2C2E53] text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-[#D4AF37]" />
                  Paso 2: Información Personal, Civil y Demográfica del Alumno
                </h3>
                <p className="text-[11px] text-slate-500">
                  Ficha completa requerida: cédula, nombres, apellidos, nacionalidad, país, estado, ciudad, sexo, nacimiento, estado civil, religión, teléfono y dirección.
                </p>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Expediente Oficial</span>
            </div>

            {/* Nombres y Apellidos */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primer Nombre:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Santiago"
                  value={studentData.primerNombre}
                  onChange={(e) => setStudentData({ ...studentData, primerNombre: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Segundo Nombre:</label>
                <input
                  type="text"
                  placeholder="ej. Alejandro"
                  value={studentData.segundoNombre}
                  onChange={(e) => setStudentData({ ...studentData, primerNombre: studentData.primerNombre, segundoNombre: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primer Apellido:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Mendoza"
                  value={studentData.primerApellido}
                  onChange={(e) => setStudentData({ ...studentData, primerApellido: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Segundo Apellido:</label>
                <input
                  type="text"
                  placeholder="ej. Portillo"
                  value={studentData.segundoApellido}
                  onChange={(e) => setStudentData({ ...studentData, segundoApellido: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            {/* Cédula, Nacionalidad, Sexo, Nacimiento */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nacionalidad:</label>
                <select
                  value={studentData.nacionalidad}
                  onChange={(e) => setStudentData({ ...studentData, nacionalidad: e.target.value as 'V' | 'E' })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                >
                  <option value="V">Venezolano (V)</option>
                  <option value="E">Extranjero (E)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cédula / Cód. Escolar:</label>
                <input
                  type="text"
                  required
                  placeholder="V-33.102.481"
                  value={studentData.cedulaEscolar}
                  onChange={(e) => setStudentData({ ...studentData, cedulaEscolar: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sexo / Género:</label>
                <select
                  value={studentData.genero}
                  onChange={(e) => setStudentData({ ...studentData, genero: e.target.value as 'M' | 'F' })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Nacimiento:</label>
                <input
                  type="date"
                  value={studentData.fechaNacimiento}
                  onChange={(e) => setStudentData({ ...studentData, fechaNacimiento: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            {/* Estado Civil, Religión y Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estado Civil:</label>
                <select
                  value={studentData.estadoCivil}
                  onChange={(e) => setStudentData({ ...studentData, estadoCivil: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                >
                  <option value="Soltero(a)">Soltero(a)</option>
                  <option value="Casado(a)">Casado(a)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Religión:</label>
                <input
                  type="text"
                  placeholder="ej. Católica / Cristiana / Otra"
                  value={studentData.religion}
                  onChange={(e) => setStudentData({ ...studentData, religion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono (o de contacto):</label>
                <input
                  type="text"
                  placeholder="ej. 0414-6129845"
                  value={studentData.telefono}
                  onChange={(e) => setStudentData({ ...studentData, telefono: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            {/* Ubicación Geográfica: País, Estado, Ciudad */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">País:</label>
                <input
                  type="text"
                  value={studentData.pais}
                  onChange={(e) => setStudentData({ ...studentData, pais: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estado:</label>
                <input
                  type="text"
                  value={studentData.estado}
                  onChange={(e) => setStudentData({ ...studentData, estado: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad:</label>
                <input
                  type="text"
                  value={studentData.ciudad}
                  onChange={(e) => setStudentData({ ...studentData, ciudad: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            {/* Dirección de Habitación */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Dirección de Habitación del Alumno:</label>
                {motherData.direccion && (
                  <button
                    type="button"
                    onClick={() => setStudentData({ ...studentData, direccion: motherData.direccion })}
                    className="text-[10px] font-bold text-[#2C2E53] hover:underline"
                  >
                    Usar dirección materna
                  </button>
                )}
              </div>
              <textarea
                rows={2}
                placeholder="Av., Calle, Nro de Casa/Edificio, Punto de referencia..."
                value={studentData.direccion}
                onChange={(e) => setStudentData({ ...studentData, direccion: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
              />
            </div>

            {/* Ficha Médica y Cuidados */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Observaciones Médicas, Alergias o Cuidados Especiales:
              </label>
              <textarea
                rows={2}
                value={studentData.alergiasSalud}
                onChange={(e) => setStudentData({ ...studentData, alergiasSalud: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Regresar a Padres
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                Siguiente: Grado y Sección
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            ETAPA 3: GRADO, SECCIÓN Y FORMALIZACIÓN
        ======================================================== */}
        {currentStep === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-[#2C2E53] text-sm flex items-center gap-2">
                <School className="w-4 h-4 text-[#D4AF37]" />
                Paso 3: Asignación Académica y Formalización de Matrícula
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Ubicación Escolar</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed space-y-1">
              <span className="font-bold block">Resumen del Expediente:</span>
              <p>
                El alumno <strong>{studentData.primerNombre || 'Estudiante'} {studentData.primerApellido}</strong> quedará matriculado para el año escolar <strong>{academicData.anoEscolar}</strong>.
              </p>
              <p className="text-[11px] text-amber-800">
                Representante Legal Titular: <strong>{primaryLegalRep}</strong>{' '}
                {primaryLegalRep === 'Madre' && motherData.primerNombre
                  ? `(${motherData.primerNombre} ${motherData.primerApellido})`
                  : primaryLegalRep === 'Padre' && fatherData.primerNombre
                  ? `(${fatherData.primerNombre} ${fatherData.primerApellido})`
                  : ''}
                {includeFather && fatherData.primerNombre && primaryLegalRep === 'Madre' && (
                  <span> — Acceso y corresponsabilidad habilitados para el Padre ({fatherData.primerNombre} {fatherData.primerApellido}).</span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Año Escolar:</label>
                <input
                  type="text"
                  disabled
                  value={academicData.anoEscolar}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Grado / Año Asignado:</label>
                <select
                  value={academicData.grado}
                  onChange={(e) => setAcademicData({ ...academicData, grado: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                >
                  <option value="Sala de 3 Años">Sala de 3 Años (Inicial)</option>
                  <option value="Sala de 4 Años">Sala de 4 Años (Inicial)</option>
                  <option value="Sala de 5 Años">Sala de 5 Años (Inicial)</option>
                  <option value="1er Grado">1er Grado (Primaria)</option>
                  <option value="2do Grado">2do Grado (Primaria)</option>
                  <option value="3er Grado">3er Grado (Primaria)</option>
                  <option value="4to Grado">4to Grado (Primaria)</option>
                  <option value="5to Grado">5to Grado (Primaria)</option>
                  <option value="6to Grado">6to Grado (Primaria)</option>
                  <option value="1er Año">1er Año (Media General)</option>
                  <option value="2do Año">2do Año (Media General)</option>
                  <option value="3er Año">3er Año (Media General)</option>
                  <option value="4to Año">4to Año (Media General)</option>
                  <option value="5to Año">5to Año (Media General)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sección:</label>
                <select
                  value={academicData.seccion}
                  onChange={(e) => setAcademicData({ ...academicData, seccion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                >
                  <option value="A">Sección A</option>
                  <option value="B">Sección B</option>
                  <option value="C">Sección C</option>
                  <option value="U">Sección Única (U)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Regresar a Estudiante
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Finalizar e Inscribir Estudiante
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
