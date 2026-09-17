import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  User,
  School,
  CheckCircle2,
  Search,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const InscripcionesWizardView: React.FC = () => {
  const { students } = useApp();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [searchCedula, setSearchCedula] = useState('');
  const [isSuccessBanner, setIsSuccessBanner] = useState(false);

  // Step 1: Representante State
  const [repData, setRepData] = useState({
    parentesco: 'Madre',
    cedula: 'V-18.452.991',
    primerNombre: 'Patricia',
    segundoNombre: 'Elena',
    primerApellido: 'Portillo',
    segundoApellido: 'Sánchez',
    nacionalidad: 'V',
    telefono: '0414-6129845',
    correo: 'patricia.portillo@email.com',
    profesion: 'Abogado',
    direccion: 'Av. 3F con Calle 72, Edif. Bellas Artes, Apto 4-B, Maracaibo'
  });

  // Step 2: Estudiante State
  const [studentData, setStudentData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    cedulaEscolar: '',
    fechaNacimiento: '2015-05-12',
    genero: 'M',
    alergiasSalud: 'Ninguna alergia reportada'
  });

  // Step 3: Grado y Sección
  const [academicData, setAcademicData] = useState({
    anoEscolar: '2026-2027',
    grado: '4to Año',
    seccion: 'A',
    fechaInscripcion: '2026-09-17'
  });

  const handleSearchRepresentative = () => {
    if (searchCedula) {
      setRepData({
        ...repData,
        cedula: searchCedula,
        primerNombre: 'Ana María',
        primerApellido: 'Villalobos',
        correo: 'ana.villalobos@email.com',
        telefono: '0424-6338821'
      });
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccessBanner(true);
    setCurrentStep(1);
    setTimeout(() => setIsSuccessBanner(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            Admisión y Matrícula Escolar
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-[#2C2E53]">Inscripción de Estudiantes (Asistente en 3 Pasos)</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          ADM: Gestione la admisión formal vinculando acudiente, ficha médica del alumno y asignación académica.
        </p>

        {/* Wizard Stepper Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-3">
          <div
            className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
              currentStep === 1
                ? 'bg-[#2C2E53] text-white border-[#2C2E53] shadow-md'
                : currentStep > 1
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
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
              <span className="text-xs font-black block truncate">Representante</span>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
              currentStep === 2
                ? 'bg-[#2C2E53] text-white border-[#2C2E53] shadow-md'
                : currentStep > 2
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
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
              <span className="text-xs font-black block truncate">Estudiante</span>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
              currentStep === 3
                ? 'bg-[#2C2E53] text-white border-[#2C2E53] shadow-md'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                currentStep === 3 ? 'bg-[#D4AF37] text-slate-950' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </div>
            <div className="truncate">
              <span className="text-[10px] uppercase font-bold block opacity-80">Etapa 3</span>
              <span className="text-xs font-black block truncate">Grado y Sección</span>
            </div>
          </div>
        </div>
      </div>

      {isSuccessBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ¡Inscripción formalizada exitosamente! Se ha creado el expediente del estudiante y vinculado al representante.
        </div>
      )}

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-cba-card">
        {/* STEP 1: REPRESENTANTE */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-[#2C2E53] text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                Paso 1: Información Legal y Filiación del Representante
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Búsqueda o Registro Nuevo</span>
            </div>

            {/* Quick Search */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
                Verificar si ya existe en sistema:
              </span>
              <div className="flex-1 w-full flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ingrese cédula (ej. V-18452991)..."
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parentesco:</label>
                <select
                  value={repData.parentesco}
                  onChange={(e) => setRepData({ ...repData, parentesco: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                >
                  <option value="Madre">Madre</option>
                  <option value="Padre">Padre</option>
                  <option value="Tutor Legal">Tutor Legal</option>
                  <option value="Abuelo(a)">Abuelo(a)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cédula de Identidad:</label>
                <input
                  type="text"
                  required
                  value={repData.cedula}
                  onChange={(e) => setRepData({ ...repData, cedula: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Profesión u Ocupación:</label>
                <input
                  type="text"
                  value={repData.profesion}
                  onChange={(e) => setRepData({ ...repData, profesion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombres:</label>
                <input
                  type="text"
                  required
                  value={`${repData.primerNombre} ${repData.segundoNombre}`}
                  onChange={(e) => setRepData({ ...repData, primerNombre: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Apellidos:</label>
                <input
                  type="text"
                  required
                  value={`${repData.primerApellido} ${repData.segundoApellido}`}
                  onChange={(e) => setRepData({ ...repData, primerApellido: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono Principal:</label>
                <input
                  type="text"
                  required
                  value={repData.telefono}
                  onChange={(e) => setRepData({ ...repData, telefono: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico:</label>
                <input
                  type="email"
                  required
                  value={repData.correo}
                  onChange={(e) => setRepData({ ...repData, correo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dirección de Habitación:</label>
              <textarea
                rows={2}
                value={repData.direccion}
                onChange={(e) => setRepData({ ...repData, direccion: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                Siguiente: Estudiante
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ESTUDIANTE */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-[#2C2E53] text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-[#D4AF37]" />
                Paso 2: Información Personal y Médica del Estudiante
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Expediente del Alumno</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombres del Alumno:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Santiago Alejandro"
                  value={studentData.primerNombre}
                  onChange={(e) => setStudentData({ ...studentData, primerNombre: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Apellidos del Alumno:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Mendoza Portillo"
                  value={studentData.primerApellido}
                  onChange={(e) => setStudentData({ ...studentData, primerApellido: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cédula / Código Escolar:</label>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Nacimiento:</label>
                <input
                  type="date"
                  value={studentData.fechaNacimiento}
                  onChange={(e) => setStudentData({ ...studentData, fechaNacimiento: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sexo / Género:</label>
                <select
                  value={studentData.genero}
                  onChange={(e) => setStudentData({ ...studentData, genero: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Observaciones Médicas, Alergias o Cuidados Especiales:
              </label>
              <textarea
                rows={3}
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
                Regresar
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

        {/* STEP 3: GRADO Y SECCIÓN */}
        {currentStep === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-[#2C2E53] text-sm flex items-center gap-2">
                <School className="w-4 h-4 text-[#D4AF37]" />
                Paso 3: Asignación Académica y Formalización de Matrícula
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Ubicación Escolar</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold block mb-1">Resumen del Proceso:</span>
              El estudiante quedará matriculado formalmente para el año escolar <strong>{academicData.anoEscolar}</strong> bajo la tutela de <strong>{repData.primerNombre} {repData.primerApellido}</strong> ({repData.parentesco}).
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
                  <option value="Sala de 5 Años">Sala de 5 Años (Inicial)</option>
                  <option value="1er Grado">1er Grado (Primaria)</option>
                  <option value="5to Grado">5to Grado (Primaria)</option>
                  <option value="1er Año">1er Año (Media General)</option>
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
                Regresar
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
