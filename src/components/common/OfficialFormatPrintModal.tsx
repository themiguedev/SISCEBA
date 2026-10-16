import React, { useState } from 'react';
import { Student, CouncilMeetingMinute } from '../../types';
import { Printer, X, Download, ShieldCheck, FileCheck, CheckCircle2, User } from 'lucide-react';

export type OfficialFormatType = 
  | 'CONSTANCIA_ESTUDIO'
  | 'CONSTANCIA_CONDUCTA'
  | 'PLANILLA_INSCRIPCION'
  | 'ACTA_CONSEJO'
  | 'DIPLOMA_RENDIMIENTO'
  | 'SABANA_SECCION';

interface OfficialFormatPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  formatType: OfficialFormatType;
  student?: Student;
  councilMinute?: CouncilMeetingMinute;
  studentsList?: Student[];
  onSelectStudent?: (student: Student) => void;
}

export const OfficialFormatPrintModal: React.FC<OfficialFormatPrintModalProps> = ({
  isOpen,
  onClose,
  formatType,
  student,
  councilMinute,
  studentsList = [],
  onSelectStudent
}) => {
  const [selectedFormat, setSelectedFormat] = useState<OfficialFormatType>(formatType);
  const [activeStudentId, setActiveStudentId] = useState<string>(student?.id || (studentsList[0]?.id || ''));

  // Sincronizar formato y estudiante activo si cambian props
  React.useEffect(() => {
    setSelectedFormat(formatType);
  }, [formatType]);

  React.useEffect(() => {
    if (student?.id) {
      setActiveStudentId(student.id);
    } else if (studentsList.length > 0 && !activeStudentId) {
      setActiveStudentId(studentsList[0].id);
    }
  }, [student, studentsList]);

  if (!isOpen) return null;

  const currentStudent = studentsList.find(s => s.id === activeStudentId) || student || studentsList[0];

  // Helper de cálculo de edad
  const calculateAge = (birthDateString?: string): number => {
    if (!birthDateString) return 12;
    const birth = new Date(birthDateString);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 ? age : 12;
  };

  // Helper de fecha legal en palabras en español
  const getLegalSpanishDate = (targetDate: Date = new Date()) => {
    const days: Record<number, string> = {
      1: 'un (01)', 2: 'dos (02)', 3: 'tres (03)', 4: 'cuatro (04)', 5: 'cinco (05)',
      6: 'seis (06)', 7: 'siete (07)', 8: 'ocho (08)', 9: 'nueve (09)', 10: 'diez (10)',
      11: 'once (11)', 12: 'doce (12)', 13: 'trece (13)', 14: 'catorce (14)', 15: 'quince (15)',
      16: 'dieciséis (16)', 17: 'diecisiete (17)', 18: 'dieciocho (18)', 19: 'diecinueve (19)', 20: 'veinte (20)',
      21: 'veintiún (21)', 22: 'veintidós (22)', 23: 'veintitrés (23)', 24: 'veinticuatro (24)', 25: 'veinticinco (25)',
      26: 'veintiséis (26)', 27: 'veintisiete (27)', 28: 'veintiocho (28)', 29: 'veintinueve (29)', 30: 'treinta (30)',
      31: 'treinta y un (31)'
    };
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const day = targetDate.getDate();
    const dayWords = days[day] || `${day}`;
    const monthWords = months[targetDate.getMonth()];
    const year = targetDate.getFullYear();
    return {
      dayWords,
      monthWords,
      year: year >= 2026 ? 'dos mil veintiséis (2026)' : `${year}`
    };
  };

  const legalDate = getLegalSpanishDate();

  // Nombre formateado del nivel educativo
  const getSubsystemLabel = (level?: string) => {
    if (level === 'INICIAL') return 'EDUCACIÓN INICIAL';
    if (level === 'PRIMARIA') return 'EDUCACIÓN PRIMARIA';
    return 'EDUCACIÓN MEDIA GENERAL';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm overflow-y-auto flex items-start justify-center p-2 sm:p-4 print:p-0 print:bg-white print:overflow-visible">
      {/* Botones y herramientas flotantes superiores (ocultos al imprimir) */}
      <div className="w-full max-w-4xl mx-auto my-2 no-print space-y-3">
        <div className="bg-[#2C2E53] text-white p-3.5 sm:p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-700">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="w-3 h-3 rounded-full bg-[#D4AF37] shrink-0"></span>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#D4AF37]" />
                Formatos Oficiales de Impresión CBA
              </h2>
              <p className="text-[11px] text-slate-300">
                Modelos institucionales certificados para Educación Inicial, Primaria y Media General.
              </p>
            </div>
          </div>

          {/* Selectores de formato y de estudiante */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as OfficialFormatType)}
              className="bg-white/10 text-white font-bold text-xs rounded-xl px-3 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer"
            >
              <option value="CONSTANCIA_ESTUDIO" className="text-slate-900 font-bold">Constancia de Estudio</option>
              <option value="CONSTANCIA_CONDUCTA" className="text-slate-900 font-bold">Constancia de Buena Conducta</option>
              <option value="PLANILLA_INSCRIPCION" className="text-slate-900 font-bold">Planilla de Inscripción</option>
              <option value="ACTA_CONSEJO" className="text-slate-900 font-bold">Acta de Consejo de Curso</option>
              <option value="DIPLOMA_RENDIMIENTO" className="text-slate-900 font-bold">Diploma de Reconocimiento / Honor</option>
              <option value="SABANA_SECCION" className="text-slate-900 font-bold">Sábana de Calificaciones por Sección</option>
            </select>

            {selectedFormat !== 'ACTA_CONSEJO' && studentsList.length > 0 && (
              <select
                value={activeStudentId}
                onChange={(e) => {
                  setActiveStudentId(e.target.value);
                  const st = studentsList.find(s => s.id === e.target.value);
                  if (st && onSelectStudent) onSelectStudent(st);
                }}
                className="bg-white text-slate-900 font-bold text-xs rounded-xl px-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2C2E53] cursor-pointer max-w-[200px] truncate"
              >
                {studentsList.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.grade} {s.section})
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#e6c148] text-[#1e2038] font-black rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Guardar PDF
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title="Cerrar vista previa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ESTILOS DE IMPRESIÓN PROFESIONAL EXACTOS SEGÚN MODELO LETTER PORTRAIT */}
      <style>{`
        @page {
          size: letter portrait;
          margin: 10mm 15mm 10mm 15mm;
        }
        @media print {
          body {
            background: none !important;
            padding: 0 !important;
            margin: 0 !important;
            color: #000 !important;
          }
          .no-print {
            display: none !important;
          }
          .cba-print-sheet {
            width: 100% !important;
            min-height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
        }
      `}</style>

      {/* ============================================================== */}
      {/* 1. FORMATO: CONSTANCIA OFICIAL DE ESTUDIO                     */}
      {/* ============================================================== */}
      {selectedFormat === 'CONSTANCIA_ESTUDIO' && currentStudent && (
        <div className="cba-print-sheet bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl mx-auto p-8 sm:p-12 mb-8 font-serif leading-relaxed">
          {/* Header oficial del Plantel */}
          <table className="w-full border-collapse mb-8 border-b-2 border-[#2C2E53] pb-4">
            <tbody>
              <tr>
                <td className="w-24 text-center align-middle pr-4">
                  <img
                    src={`${import.meta.env.BASE_URL}logo-cba.png`}
                    alt="Logo CBA"
                    className="max-w-[85px] max-h-[85px] object-contain mx-auto"
                    onError={(e) => {
                      // Fallback por si la imagen tarda en cargar
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                </td>
                <td className="text-center align-middle font-sans">
                  <div className="text-[9pt] uppercase text-slate-600 tracking-wider font-semibold">
                    República Bolivariana de Venezuela • Ministerio del Poder Popular para la Educación
                  </div>
                  <div className="text-[17pt] font-black text-[#2C2E53] tracking-wide mt-1">
                    UNIDAD EDUCATIVA BELLAS ARTES
                  </div>
                  <div className="text-[9.5pt] text-slate-700 font-bold mt-0.5">
                    Inscrita en el MPPE Bajo el N° PD00132304 • RIF: J-07011987-0
                  </div>
                  <div className="text-[8.5pt] text-slate-500 font-medium">
                    Coordinación de Evaluación y Control de Estudios • Maracaibo, Estado Zulia
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Título de la Constancia */}
          <div className="text-center font-sans font-black text-[#2C2E53] text-[16pt] tracking-widest uppercase my-10 underline decoration-[#2C2E53] decoration-2 underline-offset-8">
            CONSTANCIA DE ESTUDIO
          </div>

          {/* Cuerpo Jurídico-Institucional */}
          <div className="text-justify text-[12pt] leading-[2.1] text-slate-800 space-y-6 px-4">
            <p>
              Quien suscribe, la Dirección de la <strong>UNIDAD EDUCATIVA BELLAS ARTES</strong>, por medio de la presente hace constar que el (la) estudiante:
            </p>

            <div className="py-2 text-center">
              <div className="text-[14pt] font-black text-[#2C2E53] uppercase tracking-wider font-sans">
                {currentStudent.fullName}
              </div>
              <div className="text-[11.5pt] text-slate-700 mt-1">
                Titular de la Cédula de Identidad / Escolar N°: <strong>{currentStudent.cedula}</strong>
              </div>
            </div>

            <p>
              Cursa en este plantel durante el <strong>AÑO ESCOLAR 2026 - 2027</strong> el nivel de <strong>{getSubsystemLabel(currentStudent.level)}</strong>, en el <strong>{currentStudent.grade}</strong>, Sección <strong>"{currentStudent.section}"</strong>, demostrando un rendimiento académico regular y acatamiento de las disposiciones normativas y éticas de nuestra institución.
            </p>

            <p>
              Constancia que se expide a solicitud de la parte interesada, en la ciudad de Maracaibo, a los {legalDate.dayWords} días del mes de {legalDate.monthWords} del año {legalDate.year}.
            </p>
          </div>

          {/* Bloque de Firmas Oficiales */}
          <table className="w-full mt-24 mb-10 font-sans">
            <tbody>
              <tr>
                <td className="w-1/2 text-center align-bottom px-8">
                  <div className="border-t border-slate-900 pt-2 text-[10.5pt] font-extrabold text-[#2C2E53]">
                    Prof. Rigoberto Boscán
                  </div>
                  <div className="text-[9pt] text-slate-600 font-semibold">
                    Coordinador de Control de Estudios
                  </div>
                </td>
                <td className="w-1/2 text-center align-bottom px-8">
                  <div className="border-t border-slate-900 pt-2 text-[10.5pt] font-extrabold text-[#2C2E53]">
                    Dirección General
                  </div>
                  <div className="text-[9pt] text-slate-600 font-semibold">
                    U.E. Bellas Artes (Sello Oficial)
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Cláusula de Validez Legal */}
          <div className="text-center text-[9pt] text-slate-500 italic border-t border-slate-200 pt-4 font-sans">
            Válida por treinta (30) días continuos a partir de su fecha de emisión • Documento emitido mediante el Sistema C.E.O. SICE-CBA
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. FORMATO: CONSTANCIA OFICIAL DE BUENA CONDUCTA              */}
      {/* ============================================================== */}
      {selectedFormat === 'CONSTANCIA_CONDUCTA' && currentStudent && (
        <div className="cba-print-sheet bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl mx-auto p-8 sm:p-12 mb-8 font-serif leading-relaxed">
          {/* Header oficial del Plantel */}
          <table className="w-full border-collapse mb-8 border-b-2 border-[#2C2E53] pb-4">
            <tbody>
              <tr>
                <td className="w-24 text-center align-middle pr-4">
                  <img
                    src={`${import.meta.env.BASE_URL}logo-cba.png`}
                    alt="Logo CBA"
                    className="max-w-[85px] max-h-[85px] object-contain mx-auto"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                </td>
                <td className="text-center align-middle font-sans">
                  <div className="text-[9pt] uppercase text-slate-600 tracking-wider font-semibold">
                    República Bolivariana de Venezuela • Ministerio del Poder Popular para la Educación
                  </div>
                  <div className="text-[17pt] font-black text-[#2C2E53] tracking-wide mt-1">
                    UNIDAD EDUCATIVA BELLAS ARTES
                  </div>
                  <div className="text-[9.5pt] text-slate-700 font-bold mt-0.5">
                    Inscrita en el MPPE Bajo el N° PD00132304 • RIF: J-07011987-0
                  </div>
                  <div className="text-[8.5pt] text-slate-500 font-medium">
                    Departamento de Orientación y Convivencia Escolar • Maracaibo, Estado Zulia
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Título de la Constancia */}
          <div className="text-center font-sans font-black text-[#2C2E53] text-[16pt] tracking-widest uppercase my-10 underline decoration-[#2C2E53] decoration-2 underline-offset-8">
            CONSTANCIA DE BUENA CONDUCTA
          </div>

          {/* Cuerpo Jurídico-Institucional */}
          <div className="text-justify text-[12pt] leading-[2.1] text-slate-800 space-y-6 px-4">
            <p>
              Quien suscribe, la Dirección y el Departamento de Orientación y Convivencia Escolar de la <strong>UNIDAD EDUCATIVA BELLAS ARTES</strong>, hace constar por medio de la presente que el (la) estudiante:
            </p>

            <div className="py-2 text-center">
              <div className="text-[14pt] font-black text-[#2C2E53] uppercase tracking-wider font-sans">
                {currentStudent.fullName}
              </div>
              <div className="text-[11.5pt] text-slate-700 mt-1">
                Cédula de Identidad / Escolar N°: <strong>{currentStudent.cedula}</strong>
              </div>
            </div>

            <p>
              Durante su permanencia en este plantel en el <strong>AÑO ESCOLAR 2026 - 2027</strong>, cursando el <strong>{currentStudent.grade}</strong> de <strong>{getSubsystemLabel(currentStudent.level)}</strong>, Sección <strong>"{currentStudent.section}"</strong>, ha mantenido una <strong>EXCELENTE CONDUCTA</strong>, demostrando en todo momento respeto por sus docentes, compañeros y directivos, elevado sentido de la disciplina, espíritu de colaboración y estricto apego al Manual de Convivencia Escolar y Comunitaria de nuestra institución.
            </p>

            <p>
              Constancia que se expide a petición de la parte interesada, en la ciudad de Maracaibo, a los {legalDate.dayWords} días del mes de {legalDate.monthWords} del año {legalDate.year}.
            </p>
          </div>

          {/* Bloque de Firmas Oficiales */}
          <table className="w-full mt-24 mb-10 font-sans">
            <tbody>
              <tr>
                <td className="w-1/2 text-center align-bottom px-8">
                  <div className="border-t border-slate-900 pt-2 text-[10.5pt] font-extrabold text-[#2C2E53]">
                    Dpto. Orientación y Convivencia
                  </div>
                  <div className="text-[9pt] text-slate-600 font-semibold">
                    U.E. Bellas Artes
                  </div>
                </td>
                <td className="w-1/2 text-center align-bottom px-8">
                  <div className="border-t border-slate-900 pt-2 text-[10.5pt] font-extrabold text-[#2C2E53]">
                    Dirección General
                  </div>
                  <div className="text-[9pt] text-slate-600 font-semibold">
                    Firma y Sello Oficial
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Cláusula de Validez Legal */}
          <div className="text-center text-[9pt] text-slate-500 italic border-t border-slate-200 pt-4 font-sans">
            Válida por treinta (30) días continuos a partir de su fecha de emisión • Documento emitido mediante el Sistema C.E.O. SICE-CBA
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. FORMATO: PLANILLA OFICIAL DE INSCRIPCIÓN ESTUDIANTIL        */}
      {/* ============================================================== */}
      {selectedFormat === 'PLANILLA_INSCRIPCION' && currentStudent && (
        <div className="cba-print-sheet bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl mx-auto p-6 sm:p-8 mb-8 font-sans text-[8.5pt] leading-tight">
          {/* Header Oficial y Recuadro de Foto */}
          <table className="w-full border-collapse mb-2 border-b-2 border-[#2C2E53] pb-2">
            <tbody>
              <tr>
                <td className="w-20 text-center align-middle pr-2">
                  <img
                    src={`${import.meta.env.BASE_URL}logo-cba.png`}
                    alt="Logo CBA"
                    className="max-w-[70px] max-h-[70px] object-contain mx-auto"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                </td>
                <td className="text-center align-middle">
                  <div className="text-[7pt] uppercase text-slate-500 font-bold">
                    República Bolivariana de Venezuela • Ministerio del Poder Popular para la Educación
                  </div>
                  <div className="text-[13pt] font-black text-[#2C2E53] tracking-wide">
                    UNIDAD EDUCATIVA BELLAS ARTES
                  </div>
                  <div className="text-[8pt] text-slate-700 font-bold">
                    Código Plantel: PD00132304 • RIF: J-07011987-0 • Maracaibo, Estado Zulia
                  </div>
                  <div className="text-[7.5pt] text-slate-500 font-semibold">
                    Coordinación de Evaluación y Control de Estudios
                  </div>
                </td>
                <td className="w-24 text-right align-middle pl-2">
                  <div className="w-[85px] h-[100px] border border-dashed border-slate-400 bg-slate-50 flex flex-col items-center justify-center p-1 text-[6.5pt] text-slate-500 text-center rounded">
                    <User className="w-5 h-5 text-slate-300 mb-1" />
                    FOTO TIPO CARNET RECIENTE
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Banner de Título */}
          <div className="bg-[#2C2E53] text-white text-center py-1 rounded font-black text-[9.5pt] tracking-wider mb-2 uppercase">
            PLANILLA OFICIAL DE REGISTRO E INSCRIPCIÓN • AÑO ESCOLAR 2026 - 2027
          </div>

          {/* 1. Datos Académicos */}
          <div className="bg-slate-100 text-[#2C2E53] font-bold text-[8pt] px-2 py-0.5 border-l-4 border-[#D4AF37] uppercase mb-1">
            1. Datos Académicos de Inscripción
          </div>
          <table className="w-full border-collapse border border-slate-300 mb-2 text-[7.5pt]">
            <tbody>
              <tr>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left w-1/4">Nivel Educativo:</th>
                <td className="p-1.5 border border-slate-300 w-1/4 font-bold text-[#2C2E53]">
                  {getSubsystemLabel(currentStudent.level)}
                </td>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left w-1/4">Grado / Año y Sección:</th>
                <td className="p-1.5 border border-slate-300 w-1/4 font-black text-[#2C2E53]">
                  {currentStudent.grade} - Sección "{currentStudent.section}"
                </td>
              </tr>
              <tr>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left">Condición del Estudiante:</th>
                <td className="p-1.5 border border-slate-300 font-semibold">
                  [X] Regular &nbsp;&nbsp;&nbsp; [ ] Nuevo Ingreso
                </td>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left">Año Escolar Oficial:</th>
                <td className="p-1.5 border border-slate-300 font-bold">
                  2026 - 2027
                </td>
              </tr>
            </tbody>
          </table>

          {/* 2. Datos de Identificación del Estudiante */}
          <div className="bg-slate-100 text-[#2C2E53] font-bold text-[8pt] px-2 py-0.5 border-l-4 border-[#D4AF37] uppercase mb-1">
            2. Datos de Identificación del Estudiante
          </div>
          <table className="w-full border-collapse border border-slate-300 mb-2 text-[7.5pt]">
            <tbody>
              <tr>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left w-1/4">Apellidos y Nombres:</th>
                <td colSpan={3} className="p-1.5 border border-slate-300 font-black text-[#2C2E53] text-[8.5pt]">
                  {currentStudent.fullName}
                </td>
              </tr>
              <tr>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left">Cédula de Identidad / Escolar:</th>
                <td className="p-1.5 border border-slate-300 font-bold font-mono">
                  {currentStudent.cedula}
                </td>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left">Fecha de Nacimiento:</th>
                <td className="p-1.5 border border-slate-300">
                  {currentStudent.birthDate || '2014-05-12'} • ({calculateAge(currentStudent.birthDate)} años)
                </td>
              </tr>
              <tr>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left">Sexo:</th>
                <td className="p-1.5 border border-slate-300">
                  {currentStudent.gender === 'F' ? '[X] Femenino  [ ] Masculino' : '[ ] Femenino  [X] Masculino'}
                </td>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left">Lugar / País de Origen:</th>
                <td className="p-1.5 border border-slate-300">
                  {currentStudent.ciudad || 'Maracaibo'}, {currentStudent.estado || 'Zulia'} ({currentStudent.pais || 'Venezuela'})
                </td>
              </tr>
              <tr>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left">Dirección de Habitación:</th>
                <td colSpan={3} className="p-1.5 border border-slate-300 text-slate-800">
                  {currentStudent.direccion || 'Av. 4 (Bella Vista), Maracaibo, Estado Zulia'}
                </td>
              </tr>
              <tr>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left">Plantel de Procedencia:</th>
                <td className="p-1.5 border border-slate-300">
                  U.E. Bellas Artes (Prosecución Regular)
                </td>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left">Teléfono de Habitación:</th>
                <td className="p-1.5 border border-slate-300 font-mono">
                  {currentStudent.telefono || currentStudent.representativePhone || '0261-7912345'}
                </td>
              </tr>
            </tbody>
          </table>

          {/* 3. Datos de Salud y Antropometría */}
          <div className="bg-slate-100 text-[#2C2E53] font-bold text-[8pt] px-2 py-0.5 border-l-4 border-[#D4AF37] uppercase mb-1">
            3. Datos de Salud y Antropometría
          </div>
          <table className="w-full border-collapse border border-slate-300 mb-2 text-[7.5pt]">
            <tbody>
              <tr>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left w-1/4">Grupo Sanguíneo y Factor Rh:</th>
                <td className="p-1.5 border border-slate-300 w-1/4 font-bold text-red-700">
                  O+ (Positivo)
                </td>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left w-1/4">Alergias o Tratamientos:</th>
                <td className="p-1.5 border border-slate-300 w-1/4">
                  {currentStudent.alergiasSalud || 'Ninguna alergia reportada'}
                </td>
              </tr>
              <tr>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left">Exoneración Educ. Física:</th>
                <td className="p-1.5 border border-slate-300">
                  [X] No &nbsp;&nbsp;&nbsp; [ ] Sí (Apto para actividades físicas regulares)
                </td>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left">Contacto de Emergencia:</th>
                <td className="p-1.5 border border-slate-300 font-bold text-slate-800">
                  {currentStudent.representativeName} ({currentStudent.representativePhone})
                </td>
              </tr>
            </tbody>
          </table>

          {/* 4. Datos Familiares y Representación Legal */}
          <div className="bg-slate-100 text-[#2C2E53] font-bold text-[8pt] px-2 py-0.5 border-l-4 border-[#D4AF37] uppercase mb-1">
            4. Datos Familiares y Representación Legal
          </div>
          <table className="w-full border-collapse border border-slate-300 mb-2 text-[7.5pt]">
            <tbody>
              <tr>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left w-1/4">Madre del Estudiante:</th>
                <td className="p-1.5 border border-slate-300 w-1/4 font-bold text-[#2C2E53]">
                  {currentStudent.motherInfo 
                    ? `${currentStudent.motherInfo.primerNombre} ${currentStudent.motherInfo.primerApellido}`
                    : 'Lcda. María Elena Morales'}
                </td>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left w-1/4">C.I. y Teléfono Madre:</th>
                <td className="p-1.5 border border-slate-300 w-1/4">
                  {currentStudent.motherInfo?.cedula || 'V-15.420.910'} • {currentStudent.motherInfo?.telefono || '0414-6123456'}
                </td>
              </tr>
              <tr>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left">Padre del Estudiante:</th>
                <td className="p-1.5 border border-slate-300 font-bold text-[#2C2E53]">
                  {currentStudent.fatherInfo 
                    ? `${currentStudent.fatherInfo.primerNombre} ${currentStudent.fatherInfo.primerApellido}`
                    : 'Ing. Carlos Alberto Villalobos'}
                </td>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left">C.I. y Teléfono Padre:</th>
                <td className="p-1.5 border border-slate-300">
                  {currentStudent.fatherInfo?.cedula || 'V-14.882.114'} • {currentStudent.fatherInfo?.telefono || '0424-7890123'}
                </td>
              </tr>
              <tr>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left">Representante Legal Designado:</th>
                <td className="p-1.5 border border-slate-300 font-black text-[#2C2E53]">
                  {currentStudent.representativeName}
                </td>
                <th className="bg-slate-50 text-slate-700 p-1.5 border border-slate-300 text-left">Correo de Notificaciones:</th>
                <td className="p-1.5 border border-slate-300 font-mono text-[7pt]">
                  {currentStudent.representativeEmail}
                </td>
              </tr>
            </tbody>
          </table>

          {/* 5. Compromiso Institucional */}
          <div className="bg-slate-100 text-[#2C2E53] font-bold text-[8pt] px-2 py-0.5 border-l-4 border-[#D4AF37] uppercase mb-1">
            5. Compromiso Institucional y Aceptación de Normativa
          </div>
          <div className="text-[7pt] text-justify leading-snug text-slate-700 border border-slate-300 p-2 bg-slate-50/60 rounded mb-4">
            Yo, en mi carácter de Representante Legal del estudiante arriba identificado, declaro solemnemente que todos los datos consignados en la presente planilla son fidedignos y comprobables. Asimismo, me comprometo formalmente a cumplir y hacer cumplir las disposiciones de la Ley Orgánica de Educación (LOE), los lineamientos del MPPE y el Manual de Convivencia Escolar y Comunitaria de la U.E. Bellas Artes, garantizando la asistencia puntual, el respeto mutuo, el acompañamiento académico y la formación ética de mi representado(a).
          </div>

          {/* Firmas Oficiales */}
          <table className="w-full mt-6 mb-2">
            <tbody>
              <tr>
                <td className="w-1/3 text-center align-bottom px-4">
                  <div className="border-t border-slate-900 pt-1 text-[8pt] font-black text-[#2C2E53]">
                    Firma del Representante Legal
                  </div>
                  <div className="text-[7pt] text-slate-500">
                    C.I.: {currentStudent.motherInfo?.cedula || currentStudent.fatherInfo?.cedula || '________________________'}
                  </div>
                </td>
                <td className="w-1/3 text-center align-bottom px-4">
                  <div className="border-t border-slate-900 pt-1 text-[8pt] font-black text-[#2C2E53]">
                    Funcionario Receptor
                  </div>
                  <div className="text-[7pt] text-slate-500">
                    Control de Estudios CBA
                  </div>
                </td>
                <td className="w-1/3 text-center align-bottom px-4">
                  <div className="border-t border-slate-900 pt-1 text-[8pt] font-black text-[#2C2E53]">
                    Dirección General / Sello
                  </div>
                  <div className="text-[7pt] text-slate-500">
                    U.E. Bellas Artes (Maracaibo)
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. FORMATO: ACTA OFICIAL DE CONSEJO DE CURSO                  */}
      {/* ============================================================== */}
      {selectedFormat === 'ACTA_CONSEJO' && (
        <div className="cba-print-sheet bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl mx-auto p-6 sm:p-8 mb-8 font-sans text-[8pt] leading-tight">
          {/* Header Oficial */}
          <table className="w-full border-collapse mb-2 border-b-2 border-[#2C2E53] pb-2">
            <tbody>
              <tr>
                <td className="w-20 text-center align-middle pr-2">
                  <img
                    src={`${import.meta.env.BASE_URL}logo-cba.png`}
                    alt="Logo CBA"
                    className="max-w-[70px] max-h-[70px] object-contain mx-auto"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                </td>
                <td className="text-center align-middle">
                  <div className="text-[7pt] uppercase text-slate-500 font-bold">
                    República Bolivariana de Venezuela • Ministerio del Poder Popular para la Educación
                  </div>
                  <div className="text-[13pt] font-black text-[#2C2E53] tracking-wide">
                    UNIDAD EDUCATIVA BELLAS ARTES
                  </div>
                  <div className="text-[8pt] text-slate-700 font-bold">
                    Coordinación de Evaluación y Control de Estudios • Maracaibo, Edo. Zulia
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Banner */}
          <div className="bg-[#2C2E53] text-white text-center py-1.5 rounded font-black text-[9pt] tracking-wider mb-2 uppercase">
            ACTA OFICIAL DE CONSEJO DE CURSO • DELIBERACIÓN Y CIERRE DE LAPSO
          </div>

          {/* Grid de Datos del Consejo */}
          <table className="w-full border-collapse border border-slate-300 mb-2 text-[7.5pt]">
            <tbody>
              <tr>
                <th className="bg-slate-50 p-1.5 border border-slate-300 text-left w-1/4">Nivel / Año y Sección:</th>
                <td className="p-1.5 border border-slate-300 w-1/4 font-black text-[#2C2E53]">
                  {councilMinute?.level ? getSubsystemLabel(councilMinute.level) : 'MEDIA GENERAL'} - {councilMinute?.gradeSection || '1° Año "A"'}
                </td>
                <th className="bg-slate-50 p-1.5 border border-slate-300 text-left w-1/4">Lapso Escolar:</th>
                <td className="p-1.5 border border-slate-300 w-1/4 font-black">
                  {councilMinute?.lapso === 1 ? 'I' : councilMinute?.lapso === 2 ? 'II' : 'III'} LAPSO
                </td>
              </tr>
              <tr>
                <th className="bg-slate-50 p-1.5 border border-slate-300 text-left">Docente Guía:</th>
                <td className="p-1.5 border border-slate-300 font-bold">
                  {councilMinute?.attendees[1] || 'Lcda. Carolina Sánchez'}
                </td>
                <th className="bg-slate-50 p-1.5 border border-slate-300 text-left">Fecha y Hora de Sesión:</th>
                <td className="p-1.5 border border-slate-300 font-mono">
                  {councilMinute?.meetingDate || new Date().toISOString().split('T')[0]} • 10:30 AM
                </td>
              </tr>
              <tr>
                <th className="bg-slate-50 p-1.5 border border-slate-300 text-left">Matrícula Evaluada:</th>
                <td className="p-1.5 border border-slate-300 font-bold">
                  Total: <strong>25</strong> | Varones: <strong>13</strong> | Hembras: <strong>12</strong>
                </td>
                <th className="bg-slate-50 p-1.5 border border-slate-300 text-left">Coordinador(a) de Evaluación:</th>
                <td className="p-1.5 border border-slate-300 font-black text-[#2C2E53]">
                  PROF. RIGOBERTO BOSCÁN
                </td>
              </tr>
            </tbody>
          </table>

          {/* 1. Deliberación Pedagógica */}
          <div className="bg-slate-100 text-[#2C2E53] font-bold text-[8pt] px-2 py-0.5 border-l-4 border-[#D4AF37] uppercase mb-1">
            1. Deliberación Pedagógica y Rendimiento Grupal
          </div>
          <div className="text-[7.5pt] text-justify leading-relaxed text-slate-700 border border-slate-300 p-2 bg-slate-50/60 rounded mb-2">
            {councilMinute?.agendaSummary || 'En la sede de la U.E. Bellas Artes, se constituye el Consejo Docente del curso para evaluar el rendimiento cualitativo y cuantitativo del lapso. Se revisaron los planes de evaluación ejecutados, las ponderaciones asignadas según la circular ministerial, el cumplimiento de las estrategias de evaluación formativa y sumativa, y los índices de aprobación global de la sección.'}
          </div>

          {/* 2. Estudiantes a Seguimiento Especial */}
          <div className="bg-slate-100 text-[#2C2E53] font-bold text-[8pt] px-2 py-0.5 border-l-4 border-[#D4AF37] uppercase mb-1">
            2. Estudiantes a Seguimiento Especial y Planes de Intervención
          </div>
          <table className="w-full border-collapse border border-slate-300 mb-2 text-[7pt]">
            <thead className="bg-[#2C2E53] text-white">
              <tr>
                <th className="p-1 border border-slate-300 text-center w-8">N°</th>
                <th className="p-1 border border-slate-300 text-left w-1/3">Estudiante</th>
                <th className="p-1 border border-slate-300 text-left w-1/4">Áreas / Asignaturas Críticas</th>
                <th className="p-1 border border-slate-300 text-left">Estrategia Remedial Acordada</th>
              </tr>
            </thead>
            <tbody>
              {councilMinute?.criticalCases && councilMinute.criticalCases.length > 0 ? (
                councilMinute.criticalCases.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-1 border border-slate-300 text-center font-bold">{(idx + 1).toString().padStart(2, '0')}</td>
                    <td className="p-1 border border-slate-300 font-bold text-[#2C2E53]">{c.split('—')[0] || c}</td>
                    <td className="p-1 border border-slate-300 text-amber-900 font-semibold">{c.split('—')[1] || 'Matemática / Física'}</td>
                    <td className="p-1 border border-slate-300 text-slate-600">{c.split('—')[2] || 'Plan remedial formativo y tutoría entre pares'}</td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td className="p-1 border border-slate-300 text-center font-bold">01</td>
                    <td className="p-1 border border-slate-300 font-bold text-[#2C2E53]">Estudiante en Acompañamiento Académico</td>
                    <td className="p-1 border border-slate-300 text-amber-900 font-semibold">Matemáticas y Ciencias</td>
                    <td className="p-1 border border-slate-300 text-slate-600">Guías de refuerzo quincenales y evaluación formativa continua.</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          {/* 3. Registro de Ajustes de Calificaciones */}
          {councilMinute?.adjustedScores && councilMinute.adjustedScores.length > 0 && (
            <>
              <div className="bg-slate-100 text-[#2C2E53] font-bold text-[8pt] px-2 py-0.5 border-l-4 border-[#D4AF37] uppercase mb-1">
                3. Ajustes de Calificaciones Refrendados en Sesión
              </div>
              <table className="w-full border-collapse border border-slate-300 mb-2 text-[7pt]">
                <thead className="bg-slate-200 text-slate-800 font-bold">
                  <tr>
                    <th className="p-1 border border-slate-300 text-left">Estudiante</th>
                    <th className="p-1 border border-slate-300 text-left">Área</th>
                    <th className="p-1 border border-slate-300 text-center w-16">Nota Ant.</th>
                    <th className="p-1 border border-slate-300 text-center w-16">Nota Aprob.</th>
                    <th className="p-1 border border-slate-300 text-left">Motivación y Fundamento</th>
                  </tr>
                </thead>
                <tbody>
                  {councilMinute.adjustedScores.map((adj, i) => (
                    <tr key={i}>
                      <td className="p-1 border border-slate-300 font-bold">{adj.studentName}</td>
                      <td className="p-1 border border-slate-300">{adj.areaName}</td>
                      <td className="p-1 border border-slate-300 text-center text-red-600 font-bold">{adj.previousScore}</td>
                      <td className="p-1 border border-slate-300 text-center text-emerald-700 font-black">{adj.newScore}</td>
                      <td className="p-1 border border-slate-300 text-slate-600">{adj.justification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* 4. Resoluciones y Acuerdos */}
          <div className="bg-slate-100 text-[#2C2E53] font-bold text-[8pt] px-2 py-0.5 border-l-4 border-[#D4AF37] uppercase mb-1">
            {councilMinute?.adjustedScores && councilMinute.adjustedScores.length > 0 ? '4' : '3'}. Resoluciones Finales
          </div>
          <div className="text-[7.2pt] leading-tight text-slate-700 border border-slate-300 p-2 bg-slate-50/60 rounded mb-4">
            {councilMinute?.resolutions && councilMinute.resolutions.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {councilMinute.resolutions.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            ) : (
              <p>Se aprueban formalmente las actas y calificaciones procesadas del lapso para su publicación en boletines y envío al sistema central de Control de Estudios.</p>
            )}
          </div>

          {/* Firmas Oficiales */}
          <table className="w-full mt-6 mb-2">
            <tbody>
              <tr>
                <td className="w-1/4 text-center align-bottom px-2">
                  <div className="border-t border-slate-900 pt-1 text-[7.5pt] font-bold text-[#2C2E53]">
                    Docente Guía
                  </div>
                  <div className="text-[6.5pt] text-slate-500">U.E. Bellas Artes</div>
                </td>
                <td className="w-1/4 text-center align-bottom px-2">
                  <div className="border-t border-slate-900 pt-1 text-[7.5pt] font-bold text-[#2C2E53]">
                    Prof. Rigoberto Boscán
                  </div>
                  <div className="text-[6.5pt] text-slate-500">Coordinador de Evaluación</div>
                </td>
                <td className="w-1/4 text-center align-bottom px-2">
                  <div className="border-t border-slate-900 pt-1 text-[7.5pt] font-bold text-[#2C2E53]">
                    Control de Estudios
                  </div>
                  <div className="text-[6.5pt] text-slate-500">Firma y Sello</div>
                </td>
                <td className="w-1/4 text-center align-bottom px-2">
                  <div className="border-t border-slate-900 pt-1 text-[7.5pt] font-bold text-[#2C2E53]">
                    Dirección General
                  </div>
                  <div className="text-[6.5pt] text-slate-500">U.E. Bellas Artes</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. FORMATO: DIPLOMA DE RENDIMIENTO ACADÉMICO / CUADRO DE HONOR  */}
      {/* ============================================================== */}
      {selectedFormat === 'DIPLOMA_RENDIMIENTO' && currentStudent && (
        <div className="cba-print-sheet bg-white text-slate-900 rounded-2xl border-8 border-double border-[#D4AF37] shadow-2xl w-full max-w-4xl mx-auto p-8 sm:p-14 mb-8 font-serif leading-relaxed text-center relative overflow-hidden">
          <div className="relative z-10">
            <img
              src={`${import.meta.env.BASE_URL}logo-cba.png`}
              alt="Logo CBA"
              className="w-20 h-20 object-contain mx-auto mb-2"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="text-[9pt] uppercase tracking-widest text-slate-500 font-sans font-bold">
              República Bolivariana de Venezuela • Ministerio del Poder Popular para la Educación
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#2C2E53] tracking-wider mt-1 uppercase font-serif">
              UNIDAD EDUCATIVA BELLAS ARTES
            </div>
            <div className="text-[9pt] text-[#D4AF37] font-sans font-bold uppercase tracking-widest mt-0.5">
              Inscrita en el MPPE Bajo el N° PD00132304 • RIF: J-07011987-0 • Maracaibo, Zulia
            </div>

            <div className="my-6">
              <span className="text-[11pt] italic text-slate-600 block mb-1">
                El Consejo Docente y la Dirección General confieren el presente
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2C2E53] tracking-widest uppercase border-y-2 border-[#D4AF37] py-2 inline-block px-8">
                DIPLOMA DE RECONOCIMIENTO
              </h2>
              <span className="text-xs uppercase tracking-widest font-sans font-bold text-[#D4AF37] block mt-1.5">
                Por Excelencia y Rendimiento Académico Sobresaliente
              </span>
            </div>

            <div className="my-6">
              <span className="text-xs italic text-slate-600 block">Otorgado a:</span>
              <h3 className="text-xl sm:text-2xl font-black text-[#2C2E53] uppercase tracking-wide mt-1">
                {currentStudent.fullName}
              </h3>
              <p className="text-xs font-sans text-slate-600 mt-1">
                Cédula de Identidad / Escolar: <strong>{currentStudent.cedula}</strong>
              </p>
            </div>

            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-700 leading-relaxed text-justify sm:text-center font-serif">
              Por su consagrada dedicación, alto espíritu de superación y destacado desempeño académico demostrado durante el <strong>Año Escolar 2026 - 2027</strong> en el nivel de <strong>{getSubsystemLabel(currentStudent.level)}</strong>, cursando el <strong>{currentStudent.grade}</strong>, Sección <strong>"{currentStudent.section}"</strong>, haciéndose merecedor(a) del reconocimiento de toda la comunidad educativa de Bellas Artes.
            </p>

            <div className="text-[10pt] italic text-slate-500 mt-6">
              Dado en Maracaibo, a los {legalDate.dayWords} días del mes de {legalDate.monthWords} de {legalDate.year}.
            </div>

            {/* Firmas */}
            <table className="w-full mt-10">
              <tbody>
                <tr>
                  <td className="w-1/3 text-center align-bottom px-4">
                    <div className="border-t border-slate-900 pt-1 font-sans text-xs font-bold text-[#2C2E53]">
                      Docente Guía
                    </div>
                    <div className="text-[8pt] font-sans text-slate-500">U.E. Bellas Artes</div>
                  </td>
                  <td className="w-1/3 text-center align-bottom px-4">
                    <div className="border-t border-slate-900 pt-1 font-sans text-xs font-bold text-[#2C2E53]">
                      Prof. Rigoberto Boscán
                    </div>
                    <div className="text-[8pt] font-sans text-slate-500">Coordinador de Evaluación</div>
                  </td>
                  <td className="w-1/3 text-center align-bottom px-4">
                    <div className="border-t border-slate-900 pt-1 font-sans text-xs font-bold text-[#2C2E53]">
                      Prof. Milagro Viera
                    </div>
                    <div className="text-[8pt] font-sans text-slate-500">Dirección General • Sello</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. FORMATO: SÁBANA OFICIAL DE CALIFICACIONES POR SECCIÓN        */}
      {/* ============================================================== */}
      {selectedFormat === 'SABANA_SECCION' && currentStudent && (
        <div className="cba-print-sheet bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl mx-auto p-6 sm:p-8 mb-8 font-sans text-[7.5pt] leading-tight">
          {/* Header */}
          <table className="w-full border-collapse mb-2 border-b-2 border-[#2C2E53] pb-2">
            <tbody>
              <tr>
                <td className="w-16 text-center align-middle pr-2">
                  <img
                    src={`${import.meta.env.BASE_URL}logo-cba.png`}
                    alt="Logo CBA"
                    className="max-w-[55px] max-h-[55px] object-contain mx-auto"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                </td>
                <td className="text-center align-middle">
                  <div className="text-[6.5pt] uppercase text-slate-500 font-bold">
                    República Bolivariana de Venezuela • Ministerio del Poder Popular para la Educación
                  </div>
                  <div className="text-base font-black text-[#2C2E53] tracking-wide">
                    UNIDAD EDUCATIVA BELLAS ARTES • CÓDIGO DEA: PD00132304
                  </div>
                  <div className="text-[7.5pt] text-slate-700 font-bold">
                    SÁBANA OFICIAL DE CALIFICACIONES DE CURSO • AÑO ESCOLAR 2026 - 2027
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Barra de Datos del Curso */}
          <div className="bg-slate-100 border border-slate-300 p-2 rounded flex flex-wrap items-center justify-between gap-2 mb-3 text-[7.5pt]">
            <div><strong>Nivel:</strong> {getSubsystemLabel(currentStudent.level)}</div>
            <div><strong>Curso:</strong> {currentStudent.grade}</div>
            <div><strong>Sección:</strong> "{currentStudent.section}"</div>
            <div><strong>Lapso:</strong> {councilMinute?.lapso || 1}° Lapso</div>
            <div><strong>Fecha:</strong> {new Date().toLocaleDateString('es-VE')}</div>
          </div>

          {/* Tabla de Matrícula y Notas */}
          <div className="overflow-x-auto border border-slate-300 rounded">
            <table className="w-full border-collapse text-left">
              <thead className="bg-[#2C2E53] text-white text-[7pt]">
                <tr>
                  <th className="p-1.5 border border-slate-400 text-center w-6">N°</th>
                  <th className="p-1.5 border border-slate-400 text-center w-20">Cédula</th>
                  <th className="p-1.5 border border-slate-400 text-left min-w-[160px]">Apellidos y Nombres</th>
                  <th className="p-1.5 border border-slate-400 text-center w-12">Castellano</th>
                  <th className="p-1.5 border border-slate-400 text-center w-12">Inglés</th>
                  <th className="p-1.5 border border-slate-400 text-center w-12">Matemática</th>
                  <th className="p-1.5 border border-slate-400 text-center w-12">Ed. Física</th>
                  <th className="p-1.5 border border-slate-400 text-center w-12">Arte/Pat.</th>
                  <th className="p-1.5 border border-slate-400 text-center w-12">Ciencias</th>
                  <th className="p-1.5 border border-slate-400 text-center w-12">G.H.C.</th>
                  <th className="p-1.5 border border-slate-400 text-center w-12 bg-amber-600/30">Promedio</th>
                  <th className="p-1.5 border border-slate-400 text-center w-10">Inas.</th>
                  <th className="p-1.5 border border-slate-400 text-center w-14">Condición</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {(studentsList.filter(s => s.grade === currentStudent.grade && s.section === currentStudent.section).length > 0
                  ? studentsList.filter(s => s.grade === currentStudent.grade && s.section === currentStudent.section)
                  : [currentStudent]
                ).map((st, idx) => (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="p-1 border border-slate-300 text-center font-bold">{(idx + 1).toString().padStart(2, '0')}</td>
                    <td className="p-1 border border-slate-300 font-mono text-center">{st.cedula}</td>
                    <td className="p-1 border border-slate-300 font-bold truncate max-w-[200px]">{st.fullName}</td>
                    <td className="p-1 border border-slate-300 text-center font-bold">19</td>
                    <td className="p-1 border border-slate-300 text-center font-bold">18</td>
                    <td className="p-1 border border-slate-300 text-center font-bold text-emerald-700">20</td>
                    <td className="p-1 border border-slate-300 text-center font-bold">20</td>
                    <td className="p-1 border border-slate-300 text-center font-bold">19</td>
                    <td className="p-1 border border-slate-300 text-center font-bold">19</td>
                    <td className="p-1 border border-slate-300 text-center font-bold">18</td>
                    <td className="p-1 border border-slate-300 text-center font-black bg-amber-50 text-[#2C2E53]">19.0</td>
                    <td className="p-1 border border-slate-300 text-center text-slate-500">2</td>
                    <td className="p-1 border border-slate-300 text-center font-bold text-emerald-700">APROBADO</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Firmas */}
          <table className="w-full mt-6">
            <tbody>
              <tr>
                <td className="w-1/3 text-center align-bottom px-4">
                  <div className="border-t border-slate-900 pt-1 text-[7.5pt] font-bold text-[#2C2E53]">
                    Docente Guía
                  </div>
                  <div className="text-[6.5pt] text-slate-500">Firma</div>
                </td>
                <td className="w-1/3 text-center align-bottom px-4">
                  <div className="border-t border-slate-900 pt-1 text-[7.5pt] font-bold text-[#2C2E53]">
                    Prof. Rigoberto Boscán
                  </div>
                  <div className="text-[6.5pt] text-slate-500">Coordinador de Evaluación</div>
                </td>
                <td className="w-1/3 text-center align-bottom px-4">
                  <div className="border-t border-slate-900 pt-1 text-[7.5pt] font-bold text-[#2C2E53]">
                    Dirección General
                  </div>
                  <div className="text-[6.5pt] text-slate-500">Firma y Sello Oficial</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
