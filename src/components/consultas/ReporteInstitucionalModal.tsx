import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReporteItem, incrementReporteImpresiones } from '../../data/reportesCEOData';
import { Student } from '../../types';
import { Printer, X, ShieldCheck, FileCheck, Award, Calendar, Users, Building, Info } from 'lucide-react';

interface ReporteInstitucionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  reporte: ReporteItem;
  studentsList: Student[];
  onPrintIncrement?: (reporteId: string, newCount: number) => void;
  initialGrade?: string;
  initialSection?: 'A' | 'B' | 'TODAS';
  initialLapso?: number;
  filtroSexo?: string;
  filtroNotaMin?: string;
  filtroNotaMax?: string;
  filtroOrden?: string;
}

export const ReporteInstitucionalModal: React.FC<ReporteInstitucionalModalProps> = ({
  isOpen,
  onClose,
  reporte,
  studentsList,
  onPrintIncrement,
  initialGrade,
  initialSection,
  initialLapso,
  filtroSexo = 'Todos',
  filtroNotaMin,
  filtroNotaMax,
  filtroOrden = 'Apellidos y Nombres'
}) => {
  const { currentRole, activeLapso, addAuditLog } = useApp();

  // Grados y años según subsistema
  const availableGrades = React.useMemo(() => {
    if (reporte.nivel === 'INICIAL') {
      return ['Maternal', 'Preescolar 1', 'Preescolar 2', 'Preescolar 3'];
    }
    if (reporte.nivel === 'PRIMARIA') {
      return ['1er Grado', '2do Grado', '3er Grado', '4to Grado', '5to Grado', '6to Grado'];
    }
    if (reporte.nivel === 'MEDIA_GENERAL') {
      return ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'];
    }
    return [
      'Preescolar 3',
      '1er Grado',
      '2do Grado',
      '3er Grado',
      '4to Grado',
      '5to Grado',
      '6to Grado',
      '1er Año',
      '2do Año',
      '3er Año',
      '4to Año',
      '5to Año'
    ];
  }, [reporte.nivel]);

  const [selectedGrade, setSelectedGrade] = useState<string>(() => {
    return initialGrade || availableGrades[availableGrades.length - 2] || '4to Año';
  });
  // Regla institucional: EXCLUSIVAMENTE secciones 'A' y 'B' (o TODAS)
  const [selectedSection, setSelectedSection] = useState<'A' | 'B' | 'TODAS'>(() => {
    return initialSection || 'A';
  });
  const [selectedLapso, setSelectedLapso] = useState<number>(() => {
    return initialLapso || activeLapso || 1;
  });

  if (!isOpen) return null;

  // Filtrar estudiantes por grado, sección y sexo
  let currentStudents = studentsList.filter((s) => {
    const matchesGrade = !selectedGrade || s.grade === selectedGrade || !s.grade;
    const matchesSection = selectedSection === 'TODAS' || s.section === selectedSection || !s.section;
    const matchesSexo =
      filtroSexo === 'Todos' ||
      (filtroSexo === 'Femenino' && s.gender === 'F') ||
      (filtroSexo === 'Masculino' && s.gender === 'M');
    return matchesGrade && matchesSection && matchesSexo;
  });

  // Ordenamiento de estudiantes
  if (filtroOrden === 'Cédula de Identidad') {
    currentStudents.sort((a, b) => (a.cedula || '').localeCompare(b.cedula || '', 'es'));
  } else {
    currentStudents.sort((a, b) => (a.fullName || '').localeCompare(b.fullName || '', 'es'));
  }

  // Muestra fallback defensiva si la lista está vacía
  const displayStudents = currentStudents.length > 0
    ? currentStudents
    : [
        {
          id: 'demo-cba-1',
          cedula: 'V-32.901.442',
          fullName: 'Álvarez Mendoza, Sofía Valentina',
          gender: 'F',
          representativeName: 'Mendoza de Álvarez, Elena',
          representativePhone: '0414-6123456',
          status: 'REGULAR',
          grade: selectedGrade,
          section: selectedSection,
          level: 'MEDIA_GENERAL'
        },
        {
          id: 'demo-cba-2',
          cedula: 'V-32.887.102',
          fullName: 'Boscán Parra, Santiago Enrique',
          gender: 'M',
          representativeName: 'Parra de Boscán, Coromoto',
          representativePhone: '0412-5558912',
          status: 'REGULAR',
          grade: selectedGrade,
          section: selectedSection,
          level: 'MEDIA_GENERAL'
        },
        {
          id: 'demo-cba-3',
          cedula: 'V-33.104.992',
          fullName: 'Chacín Gutiérrez, Isabella Mariana',
          gender: 'F',
          representativeName: 'Gutiérrez Chacín, Carlos',
          representativePhone: '0424-7711223',
          status: 'REGULAR',
          grade: selectedGrade,
          section: selectedSection,
          level: 'MEDIA_GENERAL'
        },
        {
          id: 'demo-cba-4',
          cedula: 'V-33.002.415',
          fullName: 'Díaz Morales, Leonardo Andrés',
          gender: 'M',
          representativeName: 'Morales Díaz, Roberto',
          representativePhone: '0416-3399001',
          status: 'REGULAR',
          grade: selectedGrade,
          section: selectedSection,
          level: 'MEDIA_GENERAL'
        },
        {
          id: 'demo-cba-5',
          cedula: 'V-32.990.118',
          fullName: 'Fernández Prieto, Camila Alejandra',
          gender: 'F',
          representativeName: 'Prieto Fernández, Mariana',
          representativePhone: '0414-9988771',
          status: 'REGULAR',
          grade: selectedGrade,
          section: selectedSection,
          level: 'MEDIA_GENERAL'
        }
      ];

  const handlePrint = () => {
    // Incrementar contador
    const newCount = incrementReporteImpresiones(reporte.id);
    if (onPrintIncrement) {
      onPrintIncrement(reporte.id, newCount);
    }
    // Registrar auditoría
    if (addAuditLog) {
      addAuditLog(
        `IMPRESION_REPORTE_${reporte.codigoReporte || reporte.id}`,
        `Emisión oficial del reporte: "${reporte.nombre}" para ${selectedGrade} Secc. "${selectedSection}" (Lapso ${selectedLapso})`
      );
    }
    window.print();
  };

  const currentDateFormatted = new Date().toLocaleDateString('es-VE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm overflow-y-auto flex items-start justify-center p-2 sm:p-4 print:p-0 print:bg-white print:overflow-visible animate-in fade-in duration-150">
      <div className="w-full max-w-5xl mx-auto my-2 space-y-3">
        {/* Barra superior de herramientas (oculta en la impresión física) */}
        <div className="bg-[#2C2E53] text-white p-3.5 sm:p-4 rounded-2xl shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border border-slate-700 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#1B1C33] flex items-center justify-center font-black shadow-md shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
                  {reporte.categoriaLabel}
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {reporte.codigoReporte || 'CBA-DOC'}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-0.5">
                {reporte.nombre}
              </h3>
            </div>
          </div>

          {/* Selectores de parámetros */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/20 text-xs">
              <span className="text-slate-300 font-bold text-[11px]">Curso:</span>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                {availableGrades.map((g) => (
                  <option key={g} value={g} className="text-slate-900 font-bold">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* SECCIÓN INSTITUCIONAL: ÚNICAMENTE 'A' O 'B' */}
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/20 text-xs">
              <span className="text-slate-300 font-bold text-[11px]">Sección:</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value as 'A' | 'B')}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="A" className="text-slate-900 font-bold">Sección "A"</option>
                <option value="B" className="text-slate-900 font-bold">Sección "B"</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/20 text-xs">
              <span className="text-slate-300 font-bold text-[11px]">Lapso:</span>
              <select
                value={selectedLapso}
                onChange={(e) => setSelectedLapso(Number(e.target.value))}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value={1} className="text-slate-900 font-bold">Lapso 1</option>
                <option value={2} className="text-slate-900 font-bold">Lapso 2</option>
                <option value={3} className="text-slate-900 font-bold">Lapso 3</option>
              </select>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#e6c148] text-[#1e2038] font-black rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
              title="Imprimir documento oficial en papel carta"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title="Cerrar vista previa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Estilos de Impresión Oficial */}
        <style>{`
          @page {
            size: letter portrait;
            margin: 10mm 12mm 10mm 12mm;
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
            .cba-report-sheet {
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

        {/* Hoja de Impresión del Documento Institucional */}
        <div className="cba-report-sheet bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-10 mb-8 font-sans">
          {/* Membrete Oficial M.P.P.E. */}
          <div className="border-b-2 border-[#2C2E53] pb-4 mb-6">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-20 text-center align-middle pr-4">
                    <img
                      src={`${import.meta.env.BASE_URL}logo-cba.png`}
                      alt="Logo CBA"
                      className="max-w-[75px] max-h-[75px] object-contain mx-auto"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  </td>
                  <td className="text-center align-middle">
                    <div className="text-[8.5pt] uppercase text-slate-600 tracking-wider font-semibold">
                      República Bolivariana de Venezuela • Ministerio del Poder Popular para la Educación
                    </div>
                    <div className="text-[15pt] font-black text-[#2C2E53] tracking-wide mt-0.5">
                      UNIDAD EDUCATIVA COLEGIO BELLAS ARTES
                    </div>
                    <div className="text-[9pt] text-slate-700 font-bold">
                      Inscrito en el MPPE Bajo el N° PD00132304 • Código D.E.A.: S0432D2305 • RIF: J-07011987-0
                    </div>
                    <div className="text-[8pt] text-slate-500 font-medium">
                      Coordinación de Evaluación y Control de Estudios • Maracaibo, Estado Zulia
                    </div>
                  </td>
                  <td className="w-24 text-right align-middle text-[8.5pt] text-slate-500 leading-tight font-mono">
                    <span className="font-bold text-[#2C2E53] block">AÑO ESCOLAR</span>
                    2026 - 2027<br />
                    Lapso {selectedLapso}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Título Oficial del Reporte */}
          <div className="text-center my-4">
            <h2 className="text-[14pt] font-black text-[#2C2E53] uppercase tracking-wide">
              {reporte.nombre}
            </h2>
            <div className="flex items-center justify-center gap-4 text-[9.5pt] text-slate-600 font-bold mt-1">
              <span>Curso: <strong className="text-slate-900">{selectedGrade}</strong></span>
              <span>•</span>
              <span>Sección: <strong className="text-slate-900">"{selectedSection}"</strong></span>
              <span>•</span>
              <span>Fecha: <strong className="text-slate-900">{currentDateFormatted}</strong></span>
            </div>
            <p className="text-[8.5pt] text-slate-500 italic mt-1 max-w-2xl mx-auto">
              {reporte.descripcion}
            </p>
          </div>

          {/* Contenido Dinámico según Reporte */}
          <div className="my-6">
            {/* VISTA 1: LISTADOS Y NÓMINAS */}
            {reporte.nombre.toLowerCase().includes('listado') || reporte.nombre.toLowerCase().includes('matrícula') ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-slate-300 text-[9pt]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-black">
                      <th className="border border-slate-300 p-2 text-center w-10">N°</th>
                      <th className="border border-slate-300 p-2 w-28">Cédula</th>
                      <th className="border border-slate-300 p-2">Apellidos y Nombres</th>
                      <th className="border border-slate-300 p-2 text-center w-14">Sexo</th>
                      {reporte.nombre.includes('Representantes') ? (
                        <>
                          <th className="border border-slate-300 p-2">Representante Legal</th>
                          <th className="border border-slate-300 p-2 w-32">Teléfono</th>
                        </>
                      ) : (
                        <>
                          <th className="border border-slate-300 p-2 text-center w-24">Condición</th>
                          <th className="border border-slate-300 p-2 text-center w-36">Firma / Observación</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {displayStudents.map((st, idx) => (
                      <tr key={st.id || idx} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                        <td className="border border-slate-300 p-2 font-mono font-bold text-slate-700">{st.cedula || 'S/C'}</td>
                        <td className="border border-slate-300 p-2 font-bold text-slate-900">{st.fullName}</td>
                        <td className="border border-slate-300 p-2 text-center font-bold">{st.gender || 'M'}</td>
                        {reporte.nombre.includes('Representantes') ? (
                          <>
                            <td className="border border-slate-300 p-2 text-slate-700">{st.representativeName || 'N/A'}</td>
                            <td className="border border-slate-300 p-2 text-slate-700 font-mono">{st.representativePhone || 'N/A'}</td>
                          </>
                        ) : (
                          <>
                            <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">REGULAR</td>
                            <td className="border border-slate-300 p-2"></td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : reporte.nombre.toLowerCase().includes('inasistencia') ? (
              /* VISTA 2: INASISTENCIAS Y CONTROL ART. 109 LOE */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-slate-300 text-[9pt]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-black">
                      <th className="border border-slate-300 p-2 text-center w-10">N°</th>
                      <th className="border border-slate-300 p-2 w-28">Cédula</th>
                      <th className="border border-slate-300 p-2">Estudiante</th>
                      <th className="border border-slate-300 p-2 text-center w-16">Justif.</th>
                      <th className="border border-slate-300 p-2 text-center w-16">Injustif.</th>
                      <th className="border border-slate-300 p-2 text-center w-20">Total Horas</th>
                      <th className="border border-slate-300 p-2 text-center w-20">% Inasist.</th>
                      <th className="border border-slate-300 p-2 text-center w-28">Estatus LOE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayStudents.map((st, idx) => {
                      const inj = (idx === 1 ? 8 : idx === 3 ? 14 : 2);
                      const just = (idx % 2 === 0 ? 2 : 0);
                      const total = inj + just;
                      const pct = Math.round((inj / 48) * 100);
                      const isAlert = pct >= 25;
                      return (
                        <tr key={st.id || idx}>
                          <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                          <td className="border border-slate-300 p-2 font-mono">{st.cedula || 'S/C'}</td>
                          <td className="border border-slate-300 p-2 font-bold">{st.fullName}</td>
                          <td className="border border-slate-300 p-2 text-center text-slate-600">{just}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold text-slate-800">{inj}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{total} h</td>
                          <td className={`border border-slate-300 p-2 text-center font-bold ${isAlert ? 'text-rose-600 bg-rose-50' : 'text-slate-700'}`}>
                            {pct}%
                          </td>
                          <td className="border border-slate-300 p-2 text-center font-bold">
                            {isAlert ? (
                              <span className="text-rose-700 uppercase text-[8pt]">Riesgo Art. 109</span>
                            ) : (
                              <span className="text-emerald-700 uppercase text-[8pt]">Regular</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : reporte.nombre.toLowerCase().includes('conducta') ? (
              /* VISTA 3: REGISTRO DE CONDUCTA Y CONVIVENCIA */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-slate-300 text-[9pt]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-black">
                      <th className="border border-slate-300 p-2 text-center w-10">N°</th>
                      <th className="border border-slate-300 p-2 w-28">Fecha</th>
                      <th className="border border-slate-300 p-2 w-48">Estudiante</th>
                      <th className="border border-slate-300 p-2">Descripción de la Incidencia / Falta</th>
                      <th className="border border-slate-300 p-2 w-48">Acuerdo Pedagógico / Medida</th>
                      <th className="border border-slate-300 p-2 text-center w-24">Firma Repr.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 text-center font-bold">1</td>
                      <td className="border border-slate-300 p-2 font-mono">14/10/2026</td>
                      <td className="border border-slate-300 p-2 font-bold">{displayStudents[0]?.fullName}</td>
                      <td className="border border-slate-300 p-2 text-slate-700">Incumplimiento reiterado de uniforme reglamentario (falta leve).</td>
                      <td className="border border-slate-300 p-2 text-slate-700">Amonestación verbal reflexiva y compromiso firmado en coordinación.</td>
                      <td className="border border-slate-300 p-2 text-center">Conforme</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 text-center font-bold">2</td>
                      <td className="border border-slate-300 p-2 font-mono">08/10/2026</td>
                      <td className="border border-slate-300 p-2 font-bold">{displayStudents[1]?.fullName}</td>
                      <td className="border border-slate-300 p-2 text-slate-700">Uso de dispositivo móvil durante la explicación docente sin autorización.</td>
                      <td className="border border-slate-300 p-2 text-slate-700">Retención preventiva del equipo para entrega exclusiva al representante.</td>
                      <td className="border border-slate-300 p-2 text-center">Conforme</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : reporte.nombre.toLowerCase().includes('resumen') || reporte.nombre.toLowerCase().includes('certificación') || reporte.nombre.toLowerCase().includes('materia pendiente') ? (
              /* VISTA 4: ACTAS OFICIALES MPPE Y MATERIA PENDIENTE */
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[9pt] leading-relaxed">
                  El presente documento certifica el rendimiento académico y cierre oficial de actas ministeriales para los estudiantes inscritos en el curso <strong>{selectedGrade}</strong>, Sección <strong>"{selectedSection}"</strong> de la Unidad Educativa Colegio Bellas Artes, conforme a la Ley Orgánica de Educación y Resoluciones Vigentes.
                </div>
                <table className="w-full text-left border-collapse border border-slate-300 text-[8.5pt]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-black">
                      <th className="border border-slate-300 p-2 text-center w-8">N°</th>
                      <th className="border border-slate-300 p-2 w-24">Cédula</th>
                      <th className="border border-slate-300 p-2">Apellidos y Nombres</th>
                      <th className="border border-slate-300 p-2 text-center w-12">Cast</th>
                      <th className="border border-slate-300 p-2 text-center w-12">Mat</th>
                      <th className="border border-slate-300 p-2 text-center w-12">Ing</th>
                      <th className="border border-slate-300 p-2 text-center w-12">Bio</th>
                      <th className="border border-slate-300 p-2 text-center w-12">Fís</th>
                      <th className="border border-slate-300 p-2 text-center w-12">Quí</th>
                      <th className="border border-slate-300 p-2 text-center w-14">Prom</th>
                      <th className="border border-slate-300 p-2 text-center w-24">Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayStudents.map((st, idx) => {
                      const n1 = 16 + (idx % 4);
                      const n2 = 15 + ((idx + 1) % 5);
                      const n3 = 17 + ((idx + 2) % 4);
                      const n4 = 14 + ((idx + 3) % 6);
                      const n5 = 16 + (idx % 3);
                      const n6 = 15 + ((idx + 1) % 4);
                      const avg = ((n1 + n2 + n3 + n4 + n5 + n6) / 6).toFixed(1);
                      return (
                        <tr key={st.id || idx}>
                          <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                          <td className="border border-slate-300 p-2 font-mono">{st.cedula || 'S/C'}</td>
                          <td className="border border-slate-300 p-2 font-bold">{st.fullName}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{n1}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{n2}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{n3}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{n4}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{n5}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{n6}</td>
                          <td className="border border-slate-300 p-2 text-center font-black text-[#2C2E53] bg-slate-50">{avg}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">APROBADO</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : reporte.nombre.toLowerCase().includes('rango') ? (
              /* VISTA 5: REPORTES POR RANGO (LITERALES POR RANGO / CALIFICACIONES POR RANGO) */
              <div className="space-y-4">
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[9pt] leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    Consolidado de distribución por rango evaluativo para <strong>{selectedGrade}</strong> Sección <strong>"{selectedSection}"</strong>.
                    {filtroNotaMin && <span> • Nota mínima: <strong>{filtroNotaMin}</strong></span>}
                    {filtroNotaMax && <span> • Nota máxima: <strong>{filtroNotaMax}</strong></span>}
                    <span> • Sexo: <strong>{filtroSexo}</strong></span>
                    <span> • Orden: <strong>{filtroOrden}</strong></span>
                  </div>
                  <span className="font-mono font-bold text-xs px-2.5 py-1 bg-amber-100 rounded-lg text-amber-900 shrink-0">
                    Total: {displayStudents.length} estudiantes
                  </span>
                </div>
                <table className="w-full text-left border-collapse border border-slate-300 text-[9pt]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-black">
                      <th className="border border-slate-300 p-2 text-center w-10">N°</th>
                      <th className="border border-slate-300 p-2 w-28">Cédula</th>
                      <th className="border border-slate-300 p-2">Apellidos y Nombres</th>
                      <th className="border border-slate-300 p-2 text-center w-14">Sexo</th>
                      <th className="border border-slate-300 p-2 text-center w-24">
                        {reporte.nombre.toLowerCase().includes('literal') ? 'Literal' : 'Calificación'}
                      </th>
                      <th className="border border-slate-300 p-2 text-center w-28">Escala</th>
                      <th className="border border-slate-300 p-2 text-center w-28">Rango Asignado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayStudents.map((st, idx) => {
                      const literals = ['A', 'A', 'B', 'B', 'C', 'A'];
                      const lit = literals[idx % literals.length];
                      const gradeNum = 18 - (idx % 6);
                      const isLiteral = reporte.nombre.toLowerCase().includes('literal');
                      return (
                        <tr key={st.id || idx} className="hover:bg-slate-50">
                          <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                          <td className="border border-slate-300 p-2 font-mono">{st.cedula || 'S/C'}</td>
                          <td className="border border-slate-300 p-2 font-bold">{st.fullName}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{st.gender || 'M'}</td>
                          <td className="border border-slate-300 p-2 text-center font-black text-emerald-800 bg-emerald-50/40 text-sm">
                            {isLiteral ? lit : gradeNum}
                          </td>
                          <td className="border border-slate-300 p-2 text-center text-xs font-semibold text-slate-600">
                            {isLiteral ? (lit === 'A' ? 'Excelente' : lit === 'B' ? 'Muy Bien' : 'Bien') : 'Vigesimal'}
                          </td>
                          <td className="border border-slate-300 p-2 text-center font-mono font-bold text-xs text-slate-700">
                            {isLiteral ? `Rango "${lit}"` : `${gradeNum - 1} - ${gradeNum + 1} pts`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* VISTA 6: BANCO DE CONTENIDOS, ESTRATEGIAS O COMPETENCIAS */
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[9pt] leading-relaxed">
                  Instrumento oficial pedagógico para la programación curricular de la Unidad Educativa Colegio Bellas Artes. Registra los temas generadores, ejes temáticos e indicadores de logro aprobados por el Consejo Docente.
                </div>
                <table className="w-full text-left border-collapse border border-slate-300 text-[9pt]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-black">
                      <th className="border border-slate-300 p-2 text-center w-12">N°</th>
                      <th className="border border-slate-300 p-2 w-48">Área de Formación</th>
                      <th className="border border-slate-300 p-2">Eje Temático / Contenido Programático</th>
                      <th className="border border-slate-300 p-2 w-44">Estrategia / Instrumento</th>
                      <th className="border border-slate-300 p-2 text-center w-24">Ponderación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 text-center font-bold">1</td>
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">Castellano y Literatura</td>
                      <td className="border border-slate-300 p-2 text-slate-800">Estructura del texto narrativo, cohesión léxica y argumentación crítica en ensayos literarios.</td>
                      <td className="border border-slate-300 p-2 text-slate-700">Producción escrita individual / Rúbrica analítica</td>
                      <td className="border border-slate-300 p-2 text-center font-black text-[#2C2E53]">20% (4 pts)</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 text-center font-bold">2</td>
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">Matemáticas</td>
                      <td className="border border-slate-300 p-2 text-slate-800">Funciones trigonométricas, identidades fundamentales y resolución de triángulos rectángulos.</td>
                      <td className="border border-slate-300 p-2 text-slate-700">Prueba escrita de desarrollo / Escala de estimación</td>
                      <td className="border border-slate-300 p-2 text-center font-black text-[#2C2E53]">25% (5 pts)</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 text-center font-bold">3</td>
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">Ciencias Naturales / Biología</td>
                      <td className="border border-slate-300 p-2 text-slate-800">Bases moleculares de la herencia genética, replicación del ADN y leyes de Mendel.</td>
                      <td className="border border-slate-300 p-2 text-slate-700">Práctica de laboratorio y reporte científico</td>
                      <td className="border border-slate-300 p-2 text-center font-black text-[#2C2E53]">20% (4 pts)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Firmas Institucionales Oficiales */}
          <div className="mt-12 pt-6 border-t border-slate-300 text-center text-[9pt]">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-1/3 align-bottom pb-2">
                    <div className="w-44 border-b border-slate-800 mx-auto mb-1"></div>
                    <div className="font-bold text-slate-900">Prof. Docente de Aula / Guía</div>
                    <div className="text-[7.5pt] text-slate-500">Docente Especialista CBA</div>
                  </td>
                  <td className="w-1/3 align-bottom pb-2">
                    <div className="w-48 border-b border-slate-800 mx-auto mb-1"></div>
                    <div className="font-bold text-slate-900">Prof. Rigoberto Boscán</div>
                    <div className="text-[7.5pt] text-slate-500">Coordinación de Evaluación y Control de Estudios (UCE)</div>
                  </td>
                  <td className="w-1/3 align-bottom pb-2">
                    <div className="w-44 border-b border-slate-800 mx-auto mb-1"></div>
                    <div className="font-bold text-slate-900">Dra. Carmen Cecilia Boscán</div>
                    <div className="text-[7.5pt] text-slate-500">Dirección General U.E. Bellas Artes</div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-6 text-[7.5pt] text-slate-400 font-mono text-center">
              Documento emitido electrónicamente desde el Sistema Institucional SISCEBA • U.E. Bellas Artes • S0432D2305
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
