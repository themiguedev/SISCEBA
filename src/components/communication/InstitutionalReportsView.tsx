import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  User,
  Users,
  Award,
  Printer,
  CheckCircle2,
  Calendar,
  Sparkles,
  School,
  FileCheck,
  BrainCircuit,
  ClipboardList,
  BarChart3,
  Layers,
  CheckCircle
} from 'lucide-react';

type InstitutionalReportType =
  | 'DIAGNOSTICA'
  | 'PROCESAL'
  | 'CONSEJO_CURSO'
  | 'ESTUDIANTES'
  | 'REPRESENTANTES'
  | 'FINAL_ANO'
  | 'CUADROS_ESTADISTICOS';

export const InstitutionalReportsView: React.FC = () => {
  const {
    currentLevel,
    activeLapso,
    levelStudents,
    levelAreas,
    currentSection
  } = useApp();

  const [activeReportType, setActiveReportType] = useState<InstitutionalReportType>('DIAGNOSTICA');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(levelStudents[0]?.id || '');

  const activeStudent = levelStudents.find(s => s.id === selectedStudentId) || levelStudents[0];

  const reportButtons: { id: InstitutionalReportType; label: string; icon: React.ElementType }[] = [
    { id: 'DIAGNOSTICA', label: 'Reporte Diagnóstico', icon: BrainCircuit },
    { id: 'PROCESAL', label: 'Reporte Procesal', icon: ClipboardList },
    { id: 'CONSEJO_CURSO', label: 'Reporte Consejo de Curso', icon: Layers },
    { id: 'ESTUDIANTES', label: 'Reporte a Estudiantes', icon: User },
    { id: 'REPRESENTANTES', label: 'Reporte a Representantes', icon: Users },
    { id: 'FINAL_ANO', label: 'Reporte Final de Año', icon: Award },
    { id: 'CUADROS_ESTADISTICOS', label: 'Cuadros Estadísticos', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] uppercase tracking-wider">
              Documentación y Comunicación Oficial SICE-CBA
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] mt-1">
            Reportes Institucionales ({currentLevel.replace('_', ' ')})
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Emisión y certificación de documentos oficiales para la comunidad educativa del Colegio Bellas Artes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ESTUDIANTES', 'REPRESENTANTES', 'FINAL_ANO'].includes(activeReportType) && (
            <>
              <label htmlFor="select-report-student" className="sr-only">
                Seleccionar estudiante
              </label>
              <select
                id="select-report-student"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                aria-label="Seleccionar estudiante para reporte"
                className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-black text-[#2C2E53]"
              >
                {levelStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.fullName}</option>
                ))}
              </select>
            </>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-[#2C2E53] text-[#D4AF37] font-black rounded-xl text-xs shadow-md"
          >
            <Printer className="w-4 h-4" />
            Imprimir Reporte
          </button>
        </div>
      </div>

      {/* Switcher Buttons Grid */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 no-print">
        {reportButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = activeReportType === btn.id;

          return (
            <button
              key={btn.id}
              onClick={() => setActiveReportType(btn.id)}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Document Canvas Layout for Printing & Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 max-w-4xl mx-auto space-y-6 print:shadow-none print:border-none print:p-2">
        {/* Institutional Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2C2E53] pb-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-24 flex items-center justify-center">
              <img src={`${import.meta.env.BASE_URL}logo-cba.png`} alt="Colegio Bellas Artes" className="h-full w-auto object-contain" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                U.E.P. Colegio Bellas Artes • Maracaibo, Zulia
              </span>
              <h2 className="text-base font-black text-[#2C2E53] leading-tight">
                {activeReportType === 'DIAGNOSTICA' && 'REPORTE DE EVALUACIÓN DIAGNÓSTICA'}
                {activeReportType === 'PROCESAL' && `REPORTE DE EVALUACIÓN PROCESAL • LAPSO ${activeLapso}`}
                {activeReportType === 'CONSEJO_CURSO' && `REPORTE EJECUTIVO DE CONSEJO DE CURSO • LAPSO ${activeLapso}`}
                {activeReportType === 'ESTUDIANTES' && 'REPORTE PEDAGÓGICO A LOS ESTUDIANTES'}
                {activeReportType === 'REPRESENTANTES' && 'COMUNICACIÓN PEDAGÓGICA A LOS REPRESENTANTES'}
                {activeReportType === 'FINAL_ANO' && 'REPORTE FINAL DE AÑO ESCOLAR: CERTIFICACIÓN DE LOGROS'}
                {activeReportType === 'CUADROS_ESTADISTICOS' && `CUADROS ESTADÍSTICOS DE RENDIMIENTO • LAPSO ${activeLapso}`}
              </h2>
              <span className="text-[11px] text-slate-500 font-semibold">
                Nivel: {currentLevel.replace('_', ' ')} • Sección: {currentSection} • Año Escolar 2026-2027
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block text-xs font-black px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#94721C] border border-[#D4AF37]/30">
              SICE-CBA OFICIAL
            </span>
          </div>
        </div>

        {/* 1. REPORTE DE EVALUACIÓN DIAGNÓSTICA */}
        {activeReportType === 'DIAGNOSTICA' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="font-extrabold text-sm text-[#2C2E53] mb-1">
                Objetivo del Diagnóstico Pedagógico
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Determinar el punto de partida cognitivo, las destrezas socioemocionales, motrices y procedimentales de los estudiantes matriculados en la sección al inicio del ciclo escolar 2026-2027, con especial énfasis en el módulo formativo de robótica, lógica y lectoescritura.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#2C2E53] text-white uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Dimensión Evaluada</th>
                    <th className="py-2.5 px-3 text-center">Nivel de Logro Observado</th>
                    <th className="py-2.5 px-4">Hallazgos y Acciones Recomendadas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#2C2E53]">Razonamiento y Lógica Espacial</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">88% Logrado</span>
                    </td>
                    <td className="py-2.5 px-4">Alta receptividad en dinámicas de robótica lúdica y resolución de problemas.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#2C2E53]">Comprensión y Expresión Lingüística</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">92% Logrado</span>
                    </td>
                    <td className="py-2.5 px-4">Fluidez comunicativa acorde con el perfil de ingreso Bellas Artes.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#2C2E53]">Adaptación Socioafectiva y Convivencia</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">95% Favorable</span>
                    </td>
                    <td className="py-2.5 px-4">Clima de aula armónico, integración grupal rápida y respeto de acuerdos.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60 text-amber-900 text-xs">
              <strong>Conclusión Diagnóstica:</strong> El grupo presenta un perfil homogéneo adecuado para el desarrollo de la programación quincenal regular, programándose atención diferenciada para los casos que requieran nivelación.
            </div>
          </div>
        )}

        {/* 2. REPORTE DE EVALUACIÓN PROCESAL */}
        {activeReportType === 'PROCESAL' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="font-extrabold text-sm text-[#2C2E53] mb-1">
                Balance del Seguimiento Continuo • Lapso {activeLapso}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Consolidado del avance procesal en las asignaturas regulares e integradas, evidenciando el progreso en indicadores de logro y actividades formativas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <span className="font-extrabold text-[#2C2E53] block text-xs uppercase">
                  Métricas de Cumplimiento Procesal
                </span>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-500">Actividades aplicadas:</span>
                  <strong className="text-slate-800">100% de la planificación</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-500">Tasa de entrega puntual:</span>
                  <strong className="text-emerald-700">94.5%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Casos en seguimiento remedial:</span>
                  <strong className="text-amber-700">1 caso activo</strong>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <span className="font-extrabold text-[#2C2E53] block text-xs uppercase">
                  Acciones Didácticas en Curso
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Refuerzo continuo mediante talleres en laboratorio STEAM, retroalimentación formativa inmediata y uso de applets interactivos antes de evaluaciones sumativas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. REPORTE DE CONSEJO DE CURSO */}
        {activeReportType === 'CONSEJO_CURSO' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-extrabold text-sm text-[#2C2E53]">
                Resumen Ejecutivo de Consejo Docente • Lapso {activeLapso}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Sesión técnica celebrada con el equipo pedagógico para evaluar el rendimiento global, ratificar planes de intervención y fijar acuerdos colegiados.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#2C2E53] text-white uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Variable de Análisis</th>
                    <th className="py-2.5 px-3 text-center">Indicador</th>
                    <th className="py-2.5 px-4">Dictamen del Consejo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#2C2E53]">Aprobación General de Sección</td>
                    <td className="py-2.5 px-3 text-center font-black text-emerald-700">92.8%</td>
                    <td className="py-2.5 px-4">Cumple y supera la meta institucional proyectada para el lapso.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#2C2E53]">Planes de Acción Personalizados Aplicados</td>
                    <td className="py-2.5 px-3 text-center font-black text-[#D4AF37]">1 Activo</td>
                    <td className="py-2.5 px-4">Estudiante en evolución favorable con superación de brechas.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#2C2E53]">Ajustes Formales Refrendados</td>
                    <td className="py-2.5 px-3 text-center font-black text-blue-700">1 Aprobado</td>
                    <td className="py-2.5 px-4">Ajuste asentado conforme a la normativa de evaluación Bellas Artes.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. REPORTE A LOS ESTUDIANTES */}
        {activeReportType === 'ESTUDIANTES' && (
          <div className="space-y-4 text-xs">
            {activeStudent && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Estudiante</span>
                  <strong className="text-[#2C2E53]">{activeStudent.fullName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Cédula</span>
                  <strong className="text-slate-700">{activeStudent.cedula}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Grado / Sección</span>
                  <strong className="text-slate-700">{activeStudent.grade} "{activeStudent.section}"</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Lapso</span>
                  <strong className="text-[#D4AF37]">Lapso {activeLapso}</strong>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/70 space-y-2">
              <h4 className="font-extrabold text-[#2C2E53] text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                Tus Talentos y Logros Destacados en Bellas Artes
              </h4>
              <p className="text-slate-700 leading-relaxed">
                Has demostrado constancia e iniciativa creativa en tus proyectos. Tu curiosidad científica y habilidades de expresión plástica reflejan el espíritu formativo de nuestra institución.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="font-extrabold text-emerald-800 block mb-1">
                  ✓ Fortalezas Demostradas
                </strong>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Capacidad de trabajo colaborativo y liderazgo empático.</li>
                  <li>Excelente cumplimiento en actividades prácticas y de laboratorio.</li>
                  <li>Interés sobresaliente en el área de Robótica y Expresión Artística.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="font-extrabold text-amber-800 block mb-1">
                  ⚡ Retos para el Próximo Período
                </strong>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Reforzar la gestión autónoma del tiempo en evaluaciones analíticas.</li>
                  <li>Sistematizar hábitos diarios de lectura comprensiva e investigación.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 5. REPORTE A LOS REPRESENTANTES */}
        {activeReportType === 'REPRESENTANTES' && (
          <div className="space-y-4 text-xs">
            {activeStudent && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Estudiante</span>
                  <strong className="text-[#2C2E53]">{activeStudent.fullName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Representante</span>
                  <strong className="text-slate-700">{activeStudent.representativeName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Contacto</span>
                  <strong className="text-slate-700">{activeStudent.representativePhone}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Lapso Evaluado</span>
                  <strong className="text-[#D4AF37]">Lapso {activeLapso}</strong>
                </div>
              </div>
            )}

            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-2">
              <h4 className="font-extrabold text-[#2C2E53] text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                Alianza Familia - Colegio y Corresponsabilidad Pedagógica
              </h4>
              <p className="text-slate-700 leading-relaxed">
                Estimado(a) representante: el seguimiento en el hogar potencia significativamente las habilidades del estudiante. Ponemos a su disposición las orientaciones pedagógicas del equipo docente:
              </p>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <strong className="font-bold text-[#2C2E53] block">Orientaciones de Acompañamiento en Casa:</strong>
              <ol className="list-decimal list-inside text-slate-700 space-y-1.5 leading-relaxed">
                <li>Establecer un horario fijo de estudio y lectura diaria en un entorno silencioso e iluminado.</li>
                <li>Monitorear periódicamente los planes quincenales a través de la plataforma SICE-CBA.</li>
                <li>Mantener contacto fluido con el docente tutor ante cualquier cambio de ánimo o inquietud académica.</li>
              </ol>
            </div>
          </div>
        )}

        {/* 6. REPORTE FINAL DE AÑO ESCOLAR */}
        {activeReportType === 'FINAL_ANO' && (
          <div className="space-y-4 text-xs">
            <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
              <Award className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-black text-emerald-900 text-base">
                CERTIFICACIÓN DE PROMOCIÓN ACADÉMICA • AÑO 2026 - 2027
              </h3>
              <p className="text-emerald-800 font-medium max-w-xl mx-auto">
                La Dirección de la U.E.P. Colegio Bellas Artes certifica que el estudiante ha cumplido satisfactoriamente con el plan de estudios y el perfil curricular correspondiente.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-[#2C2E53] block mb-2 uppercase text-[11px]">
                Resumen de Áreas de Formación Cursadas ({levelAreas.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {levelAreas.map(a => (
                  <div key={a.id} className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-700 truncate">{a.name}</span>
                    <span className="text-emerald-600 font-black text-xs">✓ Aprobado</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. CUADROS ESTADÍSTICOS CONSOLIDADOS */}
        {activeReportType === 'CUADROS_ESTADISTICOS' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="font-extrabold text-sm text-[#2C2E53] mb-1">
                Cuadros Estadísticos Oficiales de Rendimiento y Aprobación
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Consolidado estadístico del nivel {currentLevel.replace('_', ' ')} para archivo pedagógico institucional y auditoría del MPPE.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#2C2E53] text-white uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Área de Formación</th>
                    <th className="py-2.5 px-3 text-center">Matrícula</th>
                    <th className="py-2.5 px-3 text-center">Aprobados</th>
                    <th className="py-2.5 px-3 text-center">% Aprobación</th>
                    <th className="py-2.5 px-3 text-center">En Revisión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {levelAreas.slice(0, 8).map(area => {
                    const totalCount = levelStudents.length;
                    const revisionCount = levelStudents.filter(s => s.status === 'EN_REVISION').length;
                    const approvedCount = Math.max(0, totalCount - revisionCount);
                    const rate = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

                    return (
                      <tr key={area.id}>
                        <td className="py-2 px-3 font-bold text-[#2C2E53]">{area.name}</td>
                        <td className="py-2 px-3 text-center">{totalCount}</td>
                        <td className="py-2 px-3 text-center text-emerald-700 font-black">{approvedCount}</td>
                        <td className="py-2 px-3 text-center font-bold text-emerald-700">{rate}%</td>
                        <td className="py-2 px-3 text-center text-amber-700 font-bold">{revisionCount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Official Signatures Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 text-center text-xs border-t border-slate-300">
          <div className="border-t border-slate-400 pt-2">
            <strong className="block text-[#2C2E53]">Lic. Carolina Sánchez</strong>
            <span className="text-[10px] text-slate-500">Coordinación Pedagógica</span>
          </div>
          <div className="border-t border-slate-400 pt-2">
            <strong className="block text-[#2C2E53]">Prof. Docente Guía</strong>
            <span className="text-[10px] text-slate-500">Tutor de Sección</span>
          </div>
          <div className="border-t border-slate-400 pt-2 hidden sm:block">
            <strong className="block text-[#2C2E53]">Dirección General CBA</strong>
            <span className="text-[10px] text-slate-500">Colegio Bellas Artes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
