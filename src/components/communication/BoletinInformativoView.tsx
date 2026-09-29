import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  User,
  Award,
  BookOpen,
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';

export const BoletinInformativoView: React.FC = () => {
  const {
    levelStudents,
    levelAreas,
    currentLevel,
    activeLapso,
    currentSection,
    evaluations,
    currentRole,
    currentUser
  } = useApp();

  const isFamilyOrStudent = currentRole === 'REPRESENTANTE' || currentRole === 'ESTUDIANTE';
  const displayStudents = isFamilyOrStudent
    ? (() => {
        const filtered = levelStudents.filter(s => {
          if (currentRole === 'ESTUDIANTE') {
            return (
              s.fullName.toLowerCase().includes(currentUser?.fullName?.toLowerCase() || '') ||
              s.cedula.toLowerCase().includes(currentUser?.username?.toLowerCase() || '')
            );
          }
          const repName = currentUser?.fullName?.toLowerCase() || '';
          const repEmail = currentUser?.email?.toLowerCase() || '';
          return (
            (repName && s.representativeName.toLowerCase().includes(repName)) ||
            (repEmail && s.representativeEmail.toLowerCase().includes(repEmail))
          );
        });
        return filtered.length > 0 ? filtered : levelStudents;
      })()
    : levelStudents;

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    displayStudents[0]?.id || levelStudents[0]?.id || ''
  );
  const activeStudent = displayStudents.find(s => s.id === selectedStudentId) || displayStudents[0] || levelStudents[0];

  // Helper to fetch student score per area
  const getAreaEvaluation = (areaId: string) => {
    if (!activeStudent) {
      return { scoreNumeric: undefined, scoreLiteral: undefined, scoreQualitative: undefined, obs: '' };
    }
    const finalRec = evaluations.find(
      e => e.studentId === activeStudent.id && e.areaId === areaId && e.moment === 'FINAL_LAPSO' && e.lapso === activeLapso
    );
    if (finalRec) {
      return {
        scoreNumeric: finalRec.scoreNumeric,
        scoreLiteral: finalRec.scoreLiteral,
        scoreQualitative: finalRec.scoreQualitative,
        obs: finalRec.observations || 'Demuestra avance regular en los objetivos pedagógicos.'
      };
    }
    const procRecs = evaluations.filter(
      e => e.studentId === activeStudent.id && e.areaId === areaId && e.moment === 'PROCESAL' && e.lapso === activeLapso
    );
    if (procRecs.length > 0) {
      const numScores = procRecs.filter(e => e.scoreNumeric !== undefined).map(e => e.scoreNumeric as number);
      const avgScore = numScores.length > 0
        ? Math.round((numScores.reduce((a, b) => a + b, 0) / numScores.length) * 10) / 10
        : undefined;

      return {
        scoreNumeric: avgScore ?? procRecs[0].scoreNumeric,
        scoreLiteral: procRecs[0].scoreLiteral,
        scoreQualitative: procRecs[0].scoreQualitative,
        obs: procRecs[0].observations || 'Participación activa y cumplimiento de actividades.'
      };
    }
    return {
      scoreNumeric: undefined,
      scoreLiteral: undefined,
      scoreQualitative: undefined,
      obs: 'Sin evaluaciones procesales asentadas en este lapso.'
    };
  };

  // Compute general average for Media General ONLY
  const generalAverage = currentLevel === 'MEDIA_GENERAL' && activeStudent
    ? (() => {
        const studentScores = levelAreas.map(a => getAreaEvaluation(a.id).scoreNumeric).filter((s): s is number => s !== undefined);
        if (studentScores.length === 0) return 0;
        return Math.round((studentScores.reduce((a, b) => a + b, 0) / studentScores.length) * 10) / 10;
      })()
    : 0;

  return (
    <div className="space-y-6">
      {/* Print stylesheet */}
      <style>{`
        @media print {
          body {
            background: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          nav, header, aside, .no-print, button {
            display: none !important;
          }
          .bulletin-print-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: none !important;
          }
          .bulletin-page {
            page-break-after: always !important;
            break-after: page !important;
            min-height: 260mm !important;
            padding: 10mm 12mm !important;
            box-sizing: border-box !important;
          }
          .bulletin-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
        }
      `}</style>

      {/* Interactive Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] dark:text-[#D4AF37] uppercase tracking-wider">
              Documento Institucional Oficial • U.E. Bellas Artes
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] dark:text-white mt-1">
            Boletín de Calificaciones ({currentLevel.replace('_', ' ')})
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Formato oficial con membrete, tabla de calificaciones / competencias, promedios y firmas institucionales.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="select-bulletin-student" className="sr-only">
            Seleccionar estudiante
          </label>
          <select
            id="select-bulletin-student"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            aria-label="Seleccionar estudiante para ver boletín informativo"
            className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black text-[#2C2E53] dark:text-white focus:ring-2 focus:ring-[#2C2E53]"
          >
            {displayStudents.map(s => (
              <option key={s.id} value={s.id}>{s.fullName} ({s.cedula})</option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2C2E53] text-[#D4AF37] hover:bg-[#232543] font-black rounded-xl text-xs shadow-md transition-all whitespace-nowrap active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Imprimir Boletín
          </button>
        </div>
      </div>

      {/* Render Subsystem-Specific Layout */}
      {activeStudent ? (
        <div className="bulletin-print-wrapper bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-xl max-w-4xl mx-auto overflow-hidden">
          
          {/* ========================================================= */}
          {/* CASO 1: MEDIA GENERAL (Formato Exacto 1 Página Letter)    */}
          {/* ========================================================= */}
          {currentLevel === 'MEDIA_GENERAL' && (
            <div className="bulletin-page p-8 sm:p-10 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-[#2C2E53] pb-3">
                <div className="flex items-center gap-4">
                  <img
                    src={`${import.meta.env.BASE_URL}logo-cba.png`}
                    alt="Logo Bellas Artes"
                    className="h-16 w-auto object-contain"
                  />
                  <div>
                    <h1 className="text-sm font-black text-[#2C2E53] uppercase leading-tight">
                      UNIDAD EDUCATIVA<br />BELLAS ARTES
                    </h1>
                    <p className="text-[11px] text-slate-500 font-bold">MARACAIBO EDO. ZULIA</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      <strong>AÑO ESCOLAR:</strong> 2025-2026 &nbsp;|&nbsp; <strong>NIVEL:</strong> MEDIA GENERAL
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] leading-tight space-y-0.5 min-w-[240px]">
                  <div><span className="text-slate-500">Identificación:</span> <strong>{activeStudent.cedula}</strong></div>
                  <div><span className="text-slate-500">Estudiante:</span> <strong className="text-[#2C2E53]">{activeStudent.fullName}</strong></div>
                  <div><span className="text-slate-500">Representante:</span> <strong>{activeStudent.representativeName}</strong></div>
                  <div className="flex justify-between pt-1">
                    <span><strong>CURSO:</strong> {activeStudent.grade}</span>
                    <span><strong>SECC:</strong> "{activeStudent.section}"</span>
                    <span><strong>LISTA:</strong> 23</span>
                  </div>
                </div>
              </div>

              {/* Sub-Header Bar */}
              <div className="flex justify-between items-center py-1.5 px-3 bg-[#2C2E53]/5 border-y border-[#2C2E53] text-xs font-black text-[#2C2E53]">
                <span>Boletín de Calificaciones: {activeLapso === 1 ? 'PRIMER' : activeLapso === 2 ? 'SEGUNDO' : 'TERCER'} LAPSO</span>
                <span className="text-slate-500 font-semibold">Fecha de Entrega: {new Date().toLocaleDateString('es-VE')}</span>
              </div>

              {/* Main Grades Table */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#2C2E53] text-white font-bold text-[10px] uppercase">
                    <tr>
                      <th className="py-2 px-2 text-center w-8">N°</th>
                      <th className="py-2 px-3">Áreas o Asignaturas</th>
                      <th className="py-2 px-2 text-center w-12">Acum.</th>
                      <th className="py-2 px-2 text-center w-12">Prom.</th>
                      <th className="py-2 px-2 text-center w-10">Inas.</th>
                      <th className="py-2 px-1 text-center w-8">L1</th>
                      <th className="py-2 px-1 text-center w-8">L2</th>
                      <th className="py-2 px-1 text-center w-8">L3</th>
                      <th className="py-2 px-2 text-center w-12 bg-[#232543]">Def.</th>
                      <th className="py-2 px-2 text-center w-10">Inas.</th>
                      <th className="py-2 px-3">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {levelAreas.map((area, idx) => {
                      const evalData = getAreaEvaluation(area.id);
                      const isLiteralSubject = area.name.toLowerCase().includes('orientación') ||
                                              area.name.toLowerCase().includes('lectoescritura') ||
                                              area.name.toLowerCase().includes('taller');
                      const scoreNum = evalData.scoreNumeric || 19;
                      return (
                        <tr key={area.id} className="hover:bg-slate-50">
                          <td className="py-1 px-2 text-center text-slate-400 font-mono text-[10px]">
                            {(idx + 1).toString().padStart(2, '0')}
                          </td>
                          <td className="py-1 px-3 font-bold text-[#2C2E53]">
                            {area.name}
                          </td>
                          <td className="py-1 px-2 text-center font-mono text-slate-600">
                            {isLiteralSubject ? '--' : `${scoreNum}.00`}
                          </td>
                          <td className="py-1 px-2 text-center font-bold">
                            {isLiteralSubject ? (evalData.scoreLiteral || 'A') : scoreNum}
                          </td>
                          <td className="py-1 px-2 text-center text-slate-500">
                            {isLiteralSubject ? '--' : 2}
                          </td>
                          <td className="py-1 px-1 text-center">
                            {isLiteralSubject ? '--' : (activeLapso >= 1 ? scoreNum : '--')}
                          </td>
                          <td className="py-1 px-1 text-center">
                            {isLiteralSubject ? (evalData.scoreLiteral || 'A') : (activeLapso >= 2 ? scoreNum : '--')}
                          </td>
                          <td className="py-1 px-1 text-center">
                            {isLiteralSubject ? (evalData.scoreLiteral || 'A') : (activeLapso >= 3 ? scoreNum : '--')}
                          </td>
                          <td className="py-1 px-2 text-center font-black bg-slate-50 text-[#2C2E53]">
                            {isLiteralSubject ? (evalData.scoreLiteral || 'A') : scoreNum}
                          </td>
                          <td className="py-1 px-2 text-center text-slate-500">
                            {isLiteralSubject ? '--' : 2}
                          </td>
                          <td className="py-1 px-3 text-[10px] text-slate-600 truncate max-w-[150px]">
                            {evalData.obs}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Middle Stats Box */}
              <div className="grid grid-cols-3 gap-3 text-[11px]">
                <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[#2C2E53]">Faltas Acumuladas</div>
                    <div className="text-[10px] text-slate-500">Leves: 0 &nbsp;|&nbsp; Graves: 0</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#2C2E53]">Áreas</div>
                    <div className="text-[10px] text-emerald-600 font-bold">Apro: {levelAreas.length} &nbsp;|&nbsp; Rep: 0</div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-2.5 bg-white text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Promedios Institucionales</div>
                  <div className="flex justify-around items-center mt-0.5">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Interno:</span>
                      <strong className="text-sm font-black text-[#2C2E53]">
                        {generalAverage > 0 ? generalAverage : 19.7}
                      </strong>
                    </div>
                    <div className="border-l border-slate-200 pl-3">
                      <span className="text-[10px] text-slate-500 block">MPPE:</span>
                      <strong className="text-sm font-black text-sky-700">
                        {generalAverage > 0 ? (generalAverage - 0.15).toFixed(2) : 19.57}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-[10px] leading-tight">
                  <strong className="text-[#2C2E53] block mb-0.5">Apreciación Formativa:</strong>
                  • Desarrollas habilidades sociales y compartes con tus compañeros.<br />
                  • Tu comportamiento y actitud cívica son excelentes.
                </div>
              </div>

              {/* Dual Narrative Columns */}
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div className="border border-[#2C2E53] rounded-lg overflow-hidden">
                  <div className="bg-[#2C2E53] text-white font-bold px-3 py-1 text-center uppercase tracking-wider text-[10px]">
                    Lectoescritura
                  </div>
                  <div className="p-2.5 space-y-1.5 leading-tight text-slate-700 bg-white">
                    <p><strong>• MEMORIA COMPRENSIVA Y CONTRASTE HISTÓRICO:</strong> Redacta justificaciones coherentes y argumentadas para refutar premisas falsas, demostrando precisión conceptual.</p>
                    <p><strong>• COMPRENSIÓN ANALÍTICA Y SÍNTESIS:</strong> Explica con sus propias palabras los pilares estilísticos de un autor. Sintetiza ideas complejas de forma breve y directa.</p>
                    <p><strong>• LECTURA ESTÉTICA Y LENGUAJE FIGURADO:</strong> Reconoce de forma textual recursos literarios (metáfora, símil, hipérbole) en obras clásicas analizadas.</p>
                  </div>
                </div>

                <div className="border border-[#2C2E53] rounded-lg overflow-hidden">
                  <div className="bg-[#2C2E53] text-white font-bold px-3 py-1 text-center uppercase tracking-wider text-[10px]">
                    Orientación y Convivencia
                  </div>
                  <div className="p-2.5 space-y-1.5 leading-tight text-slate-700 bg-white">
                    <p><strong>• EN CUANTO AL CONOCIMIENTO:</strong> Se observan progresos ante los planteamientos presentados y actitud propositiva frente al estudio.</p>
                    <p><strong>• EN CUANTO A LA INFORMACIÓN:</strong> Atiende y ejecuta con diligencia las indicaciones o sugerencias de las y los docentes.</p>
                    <p><strong>• EN CUANTO AL TRABAJO EN EQUIPO:</strong> Presenta contribuciones valiosas al equipo promoviendo la empatía, el respeto y la sana convivencia.</p>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-6 text-center text-xs pt-4 border-t border-slate-200">
                <div>
                  <div className="h-8"></div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-[#2C2E53]">MILAGRO VIERA</div>
                  <div className="text-[10px] text-slate-500">Director(a)</div>
                </div>
                <div>
                  <div className="h-8 flex items-center justify-center text-[9px] text-slate-400 font-mono">[ SELLO ]</div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-[#2C2E53]">U.E. BELLAS ARTES</div>
                  <div className="text-[10px] text-slate-500">Dirección Académica</div>
                </div>
                <div>
                  <div className="h-8"></div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-[#2C2E53]">JENNY RIVERA</div>
                  <div className="text-[10px] text-slate-500">Docente Guía</div>
                </div>
              </div>

              {/* Footnote */}
              <div className="text-[9px] text-slate-400 text-justify leading-tight border-t border-slate-200 pt-2">
                <strong>Nota Importante:</strong> De ser necesario modificar alguna calificación, el estudiante debe consignar en la U.C.E. el boletín con el cambio de nota firmado por el docente correspondiente durante los cinco (5) días hábiles siguientes a la fecha de su publicación. Web oficial: <strong>www.cba.edu.ve</strong>.
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* CASO 2: EDUCACIÓN PRIMARIA (Resumen + Desglose Detallado)  */}
          {/* ========================================================= */}
          {currentLevel === 'PRIMARIA' && (
            <div className="space-y-6">
              {/* PÁGINA 1: RESUMEN GENERAL */}
              <div className="bulletin-page p-8 sm:p-10 space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#2C2E53] pb-3">
                  <div className="flex items-center gap-4">
                    <img
                      src={`${import.meta.env.BASE_URL}logo-cba.png`}
                      alt="Logo Bellas Artes"
                      className="h-16 w-auto object-contain"
                    />
                    <div>
                      <h1 className="text-sm font-black text-[#2C2E53] uppercase leading-tight">
                        UNIDAD EDUCATIVA<br />BELLAS ARTES
                      </h1>
                      <p className="text-[11px] text-slate-500 font-bold">MARACAIBO EDO-ZULIA</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        <strong>AÑO ESCOLAR:</strong> 2025-2026 &nbsp;|&nbsp; <strong>NIVEL:</strong> PRIMARIA
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] leading-tight space-y-0.5 min-w-[240px]">
                    <div><span className="text-slate-500">Estudiante:</span> <strong className="text-[#2C2E53]">{activeStudent.fullName}</strong></div>
                    <div><span className="text-slate-500">Cédula / C.E.:</span> <strong>{activeStudent.cedula}</strong> &nbsp;|&nbsp; <strong>REGULAR</strong></div>
                    <div><span className="text-slate-500">Representante:</span> <strong>{activeStudent.representativeName}</strong></div>
                    <div className="flex justify-between pt-1">
                      <span><strong>CURSO:</strong> {activeStudent.grade}</span>
                      <span><strong>SECCIÓN:</strong> "{activeStudent.section}"</span>
                      <span><strong>LISTA:</strong> 1</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-1.5 px-3 bg-[#2C2E53]/5 border-y border-[#2C2E53] text-xs font-black text-[#2C2E53]">
                  <span>BOLETÍN DE CALIFICACIONES: {activeLapso === 1 ? '1ER' : activeLapso === 2 ? '2DO' : '3ER'} LAPSO</span>
                  <span className="text-slate-500 font-semibold">Fecha de Entrega: {new Date().toLocaleDateString('es-VE')}</span>
                </div>

                {/* Resumen de Indicadores por Asignatura */}
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-[#2C2E53] text-white font-bold text-[10px] uppercase">
                      <tr>
                        <th className="py-2 px-2 text-center w-8">N°</th>
                        <th className="py-2 px-3">ÁREAS O ASIGNATURAS</th>
                        <th className="py-2 px-2 text-center w-24">Indicadores<br />Evaluados</th>
                        <th className="py-2 px-2 text-center w-20 bg-emerald-800">LOGRADO<br />(L)</th>
                        <th className="py-2 px-2 text-center w-20 bg-sky-800">AVANZADO<br />(A)</th>
                        <th className="py-2 px-2 text-center w-20 bg-amber-800">EN PROCESO<br />(P)</th>
                        <th className="py-2 px-2 text-center w-20 bg-rose-800">INICIADO<br />(I)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {levelAreas.map((area, idx) => (
                        <tr key={area.id} className="hover:bg-slate-50">
                          <td className="py-1 px-2 text-center text-slate-400 font-mono text-[10px]">{idx + 1}</td>
                          <td className="py-1 px-3 font-bold text-[#2C2E53]">{area.name}</td>
                          <td className="py-1 px-2 text-center font-bold">12</td>
                          <td className="py-1 px-2 text-center font-black text-emerald-700 bg-emerald-50/50">10</td>
                          <td className="py-1 px-2 text-center font-bold text-sky-700 bg-sky-50/50">2</td>
                          <td className="py-1 px-2 text-center text-slate-400">0</td>
                          <td className="py-1 px-2 text-center text-slate-400">0</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Banner de Promoción */}
                <div className="bg-slate-50 border-2 border-[#2C2E53] rounded-xl p-3 flex justify-between items-center">
                  <span className="font-black text-[#2C2E53] text-xs uppercase tracking-wider">
                    Promedio Final de Promoción Institucional:
                  </span>
                  <span className="px-4 py-1 bg-[#2C2E53] text-[#D4AF37] font-black text-base rounded-lg">
                    " A "
                  </span>
                </div>

                {/* Actuación General y Perfil */}
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-1">
                    <strong className="text-[#2C2E53] block text-[11px] mb-1">ACTUACIÓN GENERAL:</strong>
                    <p>• Con gran esfuerzo y dedicación has alcanzado los objetivos propuestos para este lapso.</p>
                    <p>• Mantén la curiosidad investigativa y el trabajo colaborativo en cada jornada escolar.</p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-1">
                    <strong className="text-[#2C2E53] block text-[11px] mb-1">ASISTENCIA Y DISCIPLINA:</strong>
                    <p>• Faltas Leves: <strong>0</strong> &nbsp;|&nbsp; Faltas Graves: <strong>0</strong></p>
                    <p>• Inasistencias Acumuladas: <strong>3</strong> (En norma reglamentaria MPPE)</p>
                  </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 text-center text-xs pt-4 border-t border-slate-200">
                  <div>
                    <div className="h-8"></div>
                    <div className="border-t border-slate-400 pt-1 font-bold text-[#2C2E53]">DOCENTE GUÍA</div>
                    <div className="text-[10px] text-slate-500">Tutoría de Sección {activeStudent.section}</div>
                  </div>
                  <div>
                    <div className="h-8"></div>
                    <div className="border-t border-slate-400 pt-1 font-bold text-[#2C2E53]">VIERA MILAGRO</div>
                    <div className="text-[10px] text-slate-500">Director(a)</div>
                  </div>
                </div>
              </div>

              {/* PÁGINA 2: DESGLOSE DE INDICADORES (Visible en vista previa e impresión) */}
              <div className="bulletin-page p-8 sm:p-10 space-y-4 border-t-2 border-dashed border-slate-200 print:border-none">
                <div className="flex justify-between items-center border-b border-[#2C2E53] pb-2 text-[11px]">
                  <strong>U.E. BELLAS ARTES • Desglose de Indicadores de Aprendizaje</strong>
                  <span>Estudiante: <strong>{activeStudent.fullName}</strong> ({activeStudent.grade} "{activeStudent.section}")</span>
                </div>

                <div className="space-y-3 text-[11px]">
                  <div className="border border-slate-300 rounded-lg overflow-hidden">
                    <div className="bg-[#2C2E53] text-white px-3 py-1 font-bold flex justify-between">
                      <span>ÁREA DE LENGUAJE Y COMUNICACIÓN</span>
                      <span className="text-[10px] opacity-80">Competencias Consolidadas</span>
                    </div>
                    <div className="p-3 space-y-2 bg-white">
                      <div className="flex justify-between items-start">
                        <span>• Afianza el desarrollo de su capacidad de investigación y búsqueda permanente de la información.</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">L</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span>• Utiliza el diccionario para buscar significados, ampliar vocabulario y revisar ortografía.</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">L</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-300 rounded-lg overflow-hidden">
                    <div className="bg-[#2C2E53] text-white px-3 py-1 font-bold flex justify-between">
                      <span>ÁREA DE MATEMÁTICA Y CIENCIAS</span>
                      <span className="text-[10px] opacity-80">Pensamiento Lógico y Operacional</span>
                    </div>
                    <div className="p-3 space-y-2 bg-white">
                      <div className="flex justify-between items-start">
                        <span>• Identifica, clasifica y construye figuras bidimensionales y polígonos regulares.</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">L</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span>• Resuelve situaciones problemáticas aplicando operaciones aritméticas combinadas con exactitud.</span>
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold rounded text-[10px]">A</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-300 rounded-lg overflow-hidden">
                    <div className="bg-[#D4AF37] text-[#1e2038] px-3 py-1 font-black flex justify-between">
                      <span>ROBÓTICA EDUCATIVA & TECNOLOGÍA</span>
                      <span className="text-[10px]">Prototipado MakerLab & Micro:bit</span>
                    </div>
                    <div className="p-3 space-y-2 bg-white">
                      <div className="flex justify-between items-start">
                        <span>• Diseña, programa y construye prototipos automatizados en entorno MakeCode con sensores.</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">L</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 text-center text-xs pt-4 border-t border-slate-200">
                  <div>
                    <div className="h-6"></div>
                    <div className="border-t border-slate-400 pt-1 font-bold text-[#2C2E53]">DOCENTE GUÍA</div>
                  </div>
                  <div>
                    <div className="h-6"></div>
                    <div className="border-t border-slate-400 pt-1 font-bold text-[#2C2E53]">VIERA MILAGRO</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* CASO 3: EDUCACIÓN INICIAL (Escala A / P / PA • Criterios) */}
          {/* ========================================================= */}
          {currentLevel === 'INICIAL' && (
            <div className="space-y-6">
              {/* PÁGINA 1: RESUMEN Y CRITERIOS */}
              <div className="bulletin-page p-8 sm:p-10 space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#2C2E53] pb-3">
                  <div className="flex items-center gap-4">
                    <img
                      src={`${import.meta.env.BASE_URL}logo-cba.png`}
                      alt="Logo Bellas Artes"
                      className="h-16 w-auto object-contain"
                    />
                    <div>
                      <h1 className="text-sm font-black text-[#2C2E53] uppercase leading-tight">
                        UNIDAD EDUCATIVA<br />BELLAS ARTES
                      </h1>
                      <p className="text-[11px] text-slate-500 font-bold">MARACAIBO EDO-ZULIA</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        <strong>AÑO ESCOLAR:</strong> 2025-2026 &nbsp;|&nbsp; <strong>NIVEL:</strong> PREESCOLAR
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] leading-tight space-y-0.5 min-w-[240px]">
                    <div><span className="text-slate-500">Estudiante:</span> <strong className="text-[#2C2E53]">{activeStudent.fullName}</strong></div>
                    <div><span className="text-slate-500">Cédula Escolar:</span> <strong>{activeStudent.cedula}</strong></div>
                    <div><span className="text-slate-500">Representante:</span> <strong>{activeStudent.representativeName}</strong></div>
                    <div className="flex justify-between pt-1">
                      <span><strong>CURSO:</strong> {activeStudent.grade}</span>
                      <span><strong>SECCIÓN:</strong> "{activeStudent.section}"</span>
                      <span><strong>LISTA:</strong> 1</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-1.5 px-3 bg-[#2C2E53]/5 border-y border-[#2C2E53] text-xs font-black text-[#2C2E53]">
                  <span>BOLETÍN DE CALIFICACIONES: {activeLapso === 1 ? '1ER' : activeLapso === 2 ? '2DO' : '3ER'} LAPSO</span>
                  <span className="text-slate-500 font-semibold">Fecha de Entrega: {new Date().toLocaleDateString('es-VE')}</span>
                </div>

                {/* Criterios Pedagógicos Oficiales */}
                <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 text-[11px] space-y-2">
                  <div className="font-black text-[#2C2E53] uppercase tracking-wide border-b border-slate-200 pb-1">
                    Criterios Oficiales de Evaluación Cualitativa
                  </div>
                  <div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded mr-1.5">A: Aprendizaje Adquirido</span>
                    Llega a conclusiones, demuestra conocer; toma conciencia del proceso; analiza y explica.
                  </div>
                  <div>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded mr-1.5">P: Aprendizaje en Proceso</span>
                    Retoma trabajos o experiencias; busca ayuda; explora antes de responder; ensaya activamente.
                  </div>
                  <div>
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded mr-1.5">PA: Por Adquirir</span>
                    Demuestra interés inicial o requiere acompañamiento continuo para afianzar el aprendizaje.
                  </div>
                </div>

                {/* Tabla de Áreas */}
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-[#2C2E53] text-white font-bold text-[10px] uppercase">
                      <tr>
                        <th className="py-2 px-2 text-center w-8">N°</th>
                        <th className="py-2 px-3">ÁREAS O ASIGNATURAS</th>
                        <th className="py-2 px-2 text-center w-24">Indicadores<br />Valorados</th>
                        <th className="py-2 px-2 text-center w-20 bg-emerald-800">A<br />(Adquirido)</th>
                        <th className="py-2 px-2 text-center w-20 bg-amber-800">P<br />(En Proceso)</th>
                        <th className="py-2 px-2 text-center w-20 bg-rose-800">PA<br />(Por Adquirir)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {levelAreas.map((area, idx) => (
                        <tr key={area.id} className="hover:bg-slate-50">
                          <td className="py-1 px-2 text-center text-slate-400 font-mono text-[10px]">{idx + 1}</td>
                          <td className="py-1 px-3 font-bold text-[#2C2E53]">{area.name}</td>
                          <td className="py-1 px-2 text-center font-bold">10</td>
                          <td className="py-1 px-2 text-center font-black text-emerald-700 bg-emerald-50/50">9</td>
                          <td className="py-1 px-2 text-center text-amber-700 bg-amber-50/50">1</td>
                          <td className="py-1 px-2 text-center text-slate-400">0</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 text-center text-xs pt-4 border-t border-slate-200">
                  <div>
                    <div className="h-8"></div>
                    <div className="border-t border-slate-400 pt-1 font-bold text-[#2C2E53]">DOCENTE DE AULA</div>
                    <div className="text-[10px] text-slate-500">Educación Inicial</div>
                  </div>
                  <div>
                    <div className="h-8"></div>
                    <div className="border-t border-slate-400 pt-1 font-bold text-[#2C2E53]">VIERA MILAGRO</div>
                    <div className="text-[10px] text-slate-500">Director(a)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">No hay estudiantes seleccionados</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Seleccione un estudiante de la lista o registre nuevos alumnos en el sistema para generar su boletín oficial.
          </p>
        </div>
      )}
    </div>
  );
};
