import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BoletinInformativoView } from '../communication/BoletinInformativoView';
import { OfficialFormatPrintModal, OfficialFormatType } from '../common/OfficialFormatPrintModal';
import {
  GraduationCap,
  FileSpreadsheet,
  FileCheck,
  ShieldCheck,
  Printer,
  Download,
  Search,
  Lock,
  Layers,
  Award,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { EvaluationRecord, Student } from '../../types';

interface ReportesCentroViewProps {
  isFamilyOrStudent: boolean;
  scopedStudents: Student[];
  overrideStudents?: Student[];
  overrideEvaluations?: EvaluationRecord[];
}

export const ReportesCentroView: React.FC<ReportesCentroViewProps> = ({
  isFamilyOrStudent,
  scopedStudents,
  overrideStudents,
  overrideEvaluations
}) => {
  const { students: ctxStudents, currentRole, currentUser, addAuditLog, activeLapso } = useApp();
  const students = overrideStudents || ctxStudents;
  const isAdmin = currentRole === 'ADMINISTRADOR';

  const [activeSubOption, setActiveSubOption] = useState<'BOLETIN' | 'FORMATOS' | 'SABANA'>('BOLETIN');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    return (isFamilyOrStudent ? scopedStudents[0]?.id : students[0]?.id) || '';
  });

  const [isOfficialModalOpen, setIsOfficialModalOpen] = useState(false);
  const [modalFormatType, setModalFormatType] = useState<OfficialFormatType>('CONSTANCIA_ESTUDIO');

  const fallbackSampleStudent: Student = {
    id: 'demo-sample-student',
    cedula: 'V-32.845.192',
    fullName: 'Estudiante Muestra CBA',
    primerNombre: 'Estudiante',
    primerApellido: 'Muestra',
    level: 'MEDIA_GENERAL',
    grade: '4to Año',
    section: 'A',
    representativeName: 'Representante CBA',
    representativePhone: '0414-7654321',
    representativeEmail: 'representante@bellasartes.edu.ve',
    status: 'REGULAR',
    gender: 'M',
    birthDate: '2010-06-15'
  };

  const activeStudent =
    (isFamilyOrStudent ? scopedStudents : students).find((s) => s.id === selectedStudentId) ||
    (isFamilyOrStudent ? scopedStudents[0] : students[0]) ||
    fallbackSampleStudent;

  // Auditoría automática al solicitar emisión de instrumentos
  const handleOpenFormat = (type: OfficialFormatType) => {
    setModalFormatType(type);
    setIsOfficialModalOpen(true);

    if (addAuditLog) {
      addAuditLog(
        `EMISION_FORMATO_${type}`,
        `Generación de ${type} para estudiante: ${activeStudent?.fullName || 'N/A'} (${activeStudent?.cedula || 'N/A'})`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Herramientas de Reporte */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm no-print">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveSubOption('BOLETIN')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubOption === 'BOLETIN'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Boletín Informativo de Calificaciones</span>
          </button>

          {!isFamilyOrStudent && (
            <button
              onClick={() => setActiveSubOption('FORMATOS')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeSubOption === 'FORMATOS'
                  ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Constancias e Instrumentos Oficiales MPPE</span>
            </button>
          )}
        </div>

        {/* Student Selector for Document issuance */}
        {!isFamilyOrStudent && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500">Estudiante:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              {students.length === 0 ? (
                <option value={fallbackSampleStudent.id}>
                  {fallbackSampleStudent.fullName} ({fallbackSampleStudent.grade} Sec. {fallbackSampleStudent.section} - Muestra)
                </option>
              ) : (
                students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.grade} {s.section})
                  </option>
                ))
              )}
            </select>
          </div>
        )}
      </div>

      {/* VIEW: BOLETÍN INFORMATIVO OFICIAL */}
      {activeSubOption === 'BOLETIN' && (
        <div className="space-y-4">
          <BoletinInformativoView />
        </div>
      )}

      {/* VIEW: CONSTANCIAS E INSTRUMENTOS OFICIALES (reg_opciones_reportes.php) */}
      {activeSubOption === 'FORMATOS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Constancia de Estudio */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card flex flex-col justify-between hover:border-[#D4AF37]/50 transition">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-[#2C2E53] dark:text-white">
                  Constancia de Estudio Oficial
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Documento membretado con código DEA S0432D2305, redacción legal en palabras y cláusula de vigencia oficial de treinta (30) días.
                </p>
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-[11px] space-y-1">
                  <p className="font-bold text-slate-700 dark:text-slate-300">
                    Estudiante Activo: <span className="text-[#2C2E53] dark:text-white">{activeStudent?.fullName || 'N/A'}</span>
                  </p>
                  <p className="text-slate-500">
                    C.I.: {activeStudent?.cedula || 'N/A'} • {activeStudent?.grade || ''} Sec. {activeStudent?.section || ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleOpenFormat('CONSTANCIA_ESTUDIO')}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1E2038] text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Printer className="w-4 h-4" />
                <span>Generar Constancia de Estudio</span>
              </button>
            </div>

            {/* Carta de Buena Conducta */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card flex flex-col justify-between hover:border-[#D4AF37]/50 transition">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-[#2C2E53] dark:text-white">
                  Certificado de Buena Conducta
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Certificación formal emitida por el Departamento de Orientación y Dirección General validando el comportamiento cívico del estudiante.
                </p>
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-[11px] space-y-1">
                  <p className="font-bold text-slate-700 dark:text-slate-300">
                    Estudiante: <span className="text-[#2C2E53] dark:text-white">{activeStudent?.fullName || 'N/A'}</span>
                  </p>
                  <p className="text-slate-500">
                    Conducta: Récord sin faltas graves registradas
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleOpenFormat('CONSTANCIA_CONDUCTA')}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1E2038] text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Printer className="w-4 h-4" />
                <span>Generar Certificado de Conducta</span>
              </button>
            </div>

            {/* Planilla de Inscripción Oficial */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card flex flex-col justify-between hover:border-[#D4AF37]/50 transition">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-[#2C2E53] dark:text-white">
                  Planilla Oficial de Inscripción
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Ficha integral de matrícula con datos biopsicosociales, filiación de representantes, vacunas y consentimiento legal.
                </p>
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-[11px] space-y-1">
                  <p className="font-bold text-slate-700 dark:text-slate-300">
                    Matrícula: {activeStudent?.grade || ''} Sec. {activeStudent?.section || ''}
                  </p>
                  <p className="text-slate-500">
                    Representante: {activeStudent?.representativeName || 'N/A'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleOpenFormat('PLANILLA_INSCRIPCION')}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1E2038] text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Printer className="w-4 h-4" />
                <span>Emitir Planilla de Matrícula</span>
              </button>
            </div>

            {/* Acta de Consejo de Curso */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card flex flex-col justify-between hover:border-[#D4AF37]/50 transition">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold mb-4">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-[#2C2E53] dark:text-white">
                  Acta Oficial de Consejo de Curso
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Instrumento de deliberación pedagógica, acuerdos remediales para estudiantes en seguimiento y cierre oficial de lapso.
                </p>
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-[11px] space-y-1">
                  <p className="font-bold text-slate-700 dark:text-slate-300">
                    Sección: {activeStudent?.grade || 'Media General'} "{activeStudent?.section || 'A'}"
                  </p>
                  <p className="text-slate-500">
                    Coordinación: Prof. Rigoberto Boscán (U.C.E.)
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleOpenFormat('ACTA_CONSEJO')}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1E2038] text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Printer className="w-4 h-4" />
                <span>Generar Acta de Consejo</span>
              </button>
            </div>

            {/* Diploma de Rendimiento Académico / Cuadro de Honor */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card flex flex-col justify-between hover:border-[#D4AF37]/50 transition">
              <div>
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center font-bold mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-[#2C2E53] dark:text-white">
                  Diploma de Rendimiento Académico
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Diploma oficial de reconocimiento al mérito escolar y cuadro de honor emitido por la Dirección General y el Consejo Docente.
                </p>
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-[11px] space-y-1">
                  <p className="font-bold text-slate-700 dark:text-slate-300">
                    Reconocimiento: <span className="text-[#2C2E53] dark:text-white">{activeStudent?.fullName || 'N/A'}</span>
                  </p>
                  <p className="text-slate-500">
                    Promedio Destacado • {activeStudent?.grade || ''} Sec. {activeStudent?.section || ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleOpenFormat('DIPLOMA_RENDIMIENTO')}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1E2038] text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Printer className="w-4 h-4" />
                <span>Emitir Diploma de Honor</span>
              </button>
            </div>

            {/* Sábana Consolidada de Calificaciones por Sección */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card flex flex-col justify-between hover:border-[#D4AF37]/50 transition">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-4">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-[#2C2E53] dark:text-white">
                  Sábana de Calificaciones por Sección
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Matriz consolidada en formato horizontal con todas las materias, alumnos, notas de lapso y estadísticas del curso.
                </p>
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-[11px] space-y-1">
                  <p className="font-bold text-slate-700 dark:text-slate-300">
                    Curso Activo: {activeStudent?.grade || 'Media General'} "{activeStudent?.section || 'A'}"
                  </p>
                  <p className="text-slate-500">
                    Matrícula: {students.filter(s => s.grade === activeStudent?.grade && s.section === activeStudent?.section).length || 25} Estudiantes
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleOpenFormat('SABANA_SECCION')}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1E2038] text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Printer className="w-4 h-4" />
                <span>Generar Sábana de Notas</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Format Print Modal */}
      {isOfficialModalOpen && activeStudent && (
        <OfficialFormatPrintModal
          isOpen={isOfficialModalOpen}
          onClose={() => setIsOfficialModalOpen(false)}
          formatType={modalFormatType}
          student={activeStudent}
          studentsList={students}
        />
      )}
    </div>
  );
};
