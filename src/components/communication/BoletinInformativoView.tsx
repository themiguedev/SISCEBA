import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  User,
  Award,
  BookOpen,
  CheckCircle2,
  FileText,
  AlertCircle,
  Lock,
  ShieldAlert,
  CreditCard,
  AlertTriangle
} from 'lucide-react';

export const BoletinInformativoView: React.FC = () => {
  const {
    levelStudents,
    levelAreas,
    indicators,
    currentLevel,
    activeLapso,
    currentSection,
    evaluations,
    currentRole,
    currentUser,
    adminBlocks,
    toggleAdminBlock
  } = useApp();

  const isFamilyOrStudent = currentRole === 'REPRESENTANTE' || currentRole === 'ESTUDIANTE';
  const isAdmin = currentRole === 'ADMINISTRADOR';
  const displayStudents = isFamilyOrStudent
    ? (() => {
        if (currentRole === 'ESTUDIANTE') {
          const normCedula = currentUser?.cedula?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
          const normUsername = currentUser?.username?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
          const userEmail = currentUser?.email?.toLowerCase().trim() || '';
          const userFullName = currentUser?.fullName?.toLowerCase().trim() || '';

          const matched = levelStudents.filter((s) => {
            const studentCedula = s.cedula?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
            const studentEmail = s.representativeEmail?.toLowerCase().trim() || '';
            const studentName = s.fullName?.toLowerCase().trim() || '';

            return (
              (normCedula && studentCedula === normCedula) ||
              (normUsername && studentCedula === normUsername) ||
              (normUsername && normUsername === s.id.toLowerCase()) ||
              (userEmail && studentEmail === userEmail) ||
              (userFullName && studentName === userFullName)
            );
          });

          if (matched.length > 0) {
            return [matched[0]];
          }

          // Si es el Administrador simulando el rol de Estudiante
          if (currentUser?.role === 'ADMINISTRADOR') {
            return levelStudents.length > 0 ? [levelStudents[0]] : [];
          }

          return [];
        }

        // Si es REPRESENTANTE
        const repName = currentUser?.fullName?.toLowerCase().trim() || '';
        const repEmail = currentUser?.email?.toLowerCase().trim() || '';
        const repCedula = currentUser?.cedula?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
        const repUsername = currentUser?.username?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';

        const matched = levelStudents.filter((s) => {
          const sRepName = s.representativeName?.toLowerCase().trim() || '';
          const sRepEmail = s.representativeEmail?.toLowerCase().trim() || '';
          const sRepCedula = s.motherInfo?.cedula?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || s.fatherInfo?.cedula?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';

          return (
            (repCedula && sRepCedula === repCedula) ||
            (repUsername && sRepCedula === repUsername) ||
            (repEmail && sRepEmail === repEmail) ||
            (repName && sRepName.includes(repName))
          );
        });

        if (matched.length > 0) {
          return matched;
        }

        if (currentUser?.role === 'ADMINISTRADOR') {
          return levelStudents.slice(0, 2);
        }

        return [];
      })()
    : levelStudents;

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    displayStudents[0]?.id || levelStudents[0]?.id || ''
  );
  const activeStudent = displayStudents.find(s => s.id === selectedStudentId) || displayStudents[0] || levelStudents[0];

  // Verificar si el estudiante actual posee un bloqueo administrativo activo
  const activeBlock = adminBlocks.find(b =>
    b.active &&
    (b.studentId === activeStudent?.id ||
     (activeStudent?.cedula && b.studentId === activeStudent.cedula) ||
     (activeStudent?.fullName && b.studentName?.toLowerCase().trim() === activeStudent.fullName?.toLowerCase().trim()))
  );
  const isBlocked = !!activeBlock;

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
          ${!isAdmin ? `
          .bulletin-print-wrapper, .bulletin-page {
            display: none !important;
          }
          body::after {
            content: "AVISO INSTITUCIONAL: La emisión e impresión oficial de boletines de calificaciones está reservada exclusivamente para el Administrador del sistema.";
            display: block;
            margin: 80px auto;
            text-align: center;
            font-family: sans-serif;
            font-size: 15pt;
            font-weight: bold;
            color: #b91c1c;
            max-width: 650px;
            border: 2px solid #b91c1c;
            padding: 30px;
            border-radius: 12px;
          }
          ` : `
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
          `}
        }
      `}</style>

      {/* Interactive Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-black text-[#2C2E53] dark:text-white">
            Boletín de Calificaciones ({currentLevel.replace('_', ' ')})
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Formato oficial con membrete, tabla de calificaciones / competencias, promedios y firmas institucionales.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {currentRole !== 'ESTUDIANTE' ? (
            <>
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
            </>
          ) : activeStudent ? (
            <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{activeStudent.fullName} ({activeStudent.cedula})</span>
            </div>
          ) : null}

          {isFamilyOrStudent && isBlocked ? (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 font-black rounded-xl text-xs whitespace-nowrap">
              <Lock className="w-4 h-4 text-red-600 dark:text-red-400" />
              Impresión Bloqueada por Mora
            </div>
          ) : isFamilyOrStudent ? null : !isAdmin ? (
            <div
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold rounded-xl text-xs whitespace-nowrap shadow-sm select-none"
              title="La emisión e impresión oficial de boletines está reservada exclusivamente para el rol Administrador"
            >
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Impresión Exclusiva (Admin)</span>
            </div>
          ) : (
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#2C2E53] text-[#D4AF37] hover:bg-[#232543] font-black rounded-xl text-xs shadow-md transition-all whitespace-nowrap active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Imprimir Boletín
            </button>
          )}
        </div>
      </div>

      {/* CASO: BLOQUEO ADMINISTRATIVO PARA REPRESENTANTES Y ESTUDIANTES */}
      {activeStudent && isFamilyOrStudent && isBlocked ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-900/50 shadow-2xl max-w-3xl mx-auto overflow-hidden p-8 sm:p-12 text-center animate-fade-in space-y-6">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 shadow-inner">
              <Lock className="w-10 h-10" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-black uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" /> Control Administrativo Activo
            </div>
            <h2 className="text-2xl font-black text-[#2C2E53] dark:text-white max-w-lg">
              Acceso a Boletín Temporalmente Restringido
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
              Estimado representante, la visualización y descarga de las calificaciones oficiales de <strong className="text-[#2C2E53] dark:text-white">{activeStudent.fullName}</strong> ({activeStudent.grade} "{activeStudent.section}") se encuentra pausada preventivamente debido a un compromiso administrativo pendiente con la institución.
            </p>
          </div>

          {/* Tarjeta de Detalle del Compromiso */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Concepto en Mora:</span>
              <span className="font-black text-red-600 dark:text-red-400 text-sm">{activeBlock.concept}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Compromiso Financiero Referencial:</span>
              <span className="font-black text-slate-800 dark:text-white text-sm">
                {activeBlock.debtAmount ? `$${Number(activeBlock.debtAmount).toFixed(2)} USD` : 'Por verificar en Cobranzas'}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Observación Registrada por Cobranzas:</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">{activeBlock.reason}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Fecha de Emisión del Bloqueo:</span>
              <span className="text-slate-600 dark:text-slate-400 font-medium">{activeBlock.blockDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Representante Registrado:</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">{activeBlock.representativeName || activeStudent.representativeName}</span>
            </div>
          </div>

          {/* Pasos para regularizar */}
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-5 border border-amber-200 dark:border-amber-800 text-left space-y-2">
            <h4 className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ¿Cómo solventar esta situación y consultar las calificaciones?
            </h4>
            <ol className="text-xs text-amber-950 dark:text-amber-300/90 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>Acérquese a la <strong>Coordinación de Administración y Cobranzas</strong> de la U.E. Bellas Artes (Horario: Lun - Vie, 7:30 AM a 1:00 PM).</li>
              <li>Consigne su comprobante de pago o reporte su cancelación por punto de venta, transferencia o efectivo.</li>
              <li>Una vez emitido el recibo de solvencia, el sistema habilitará automáticamente el acceso inmediato al boletín en su portal digital.</li>
            </ol>
          </div>

          <div className="text-[11px] text-slate-400">
            Para dudas sobre estados de cuenta, comuníquese con administración institucional al correo oficial de cobranzas.
          </div>
        </div>
      ) : activeStudent ? (
        <>
          {/* Banner de Control Administrativo para Personal Institucional */}
          {isBlocked && (
            <div className="p-4 rounded-2xl border bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-amber-800 dark:text-amber-300">
                      Bloqueo Administrativo Activo para este Estudiante
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
                      {activeBlock.concept}
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/80 dark:text-amber-300/80 mt-1">
                    <strong>Motivo:</strong> {activeBlock.reason} • <strong>Monto:</strong> {activeBlock.debtAmount ? `$${Number(activeBlock.debtAmount).toFixed(2)} USD` : 'Sin monto fijado'} • <strong>Fecha:</strong> {activeBlock.blockDate}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {(currentRole === 'ADMINISTRADOR' || currentRole === 'SECRETARIA')
                      ? 'Los representantes tienen restringida la vista y descarga del boletín. Puede solventar el estado aquí tras verificar el pago.'
                      : 'Aviso pedagógico: Favor no entregar boletas oficiales en físico a representantes sin constancia de solvencia.'}
                  </p>
                </div>
              </div>

              {(currentRole === 'ADMINISTRADOR' || currentRole === 'SECRETARIA') && (
                <button
                  onClick={() => toggleAdminBlock(activeBlock.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95 whitespace-nowrap flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Desbloquear por Pago Recibido (Solvente)
                </button>
              )}
            </div>
          )}

          {/* Render Subsystem-Specific Layout */}
          <div className="bulletin-print-wrapper bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-xl max-w-4xl mx-auto overflow-hidden">
            {isBlocked && (
              <div className="hidden print:block bg-red-100 text-red-900 border-b-2 border-red-500 px-4 py-1.5 text-center text-xs font-black uppercase tracking-wider">
                *** COPIA INTERNA INSTITUCIONAL — ESTUDIANTE CON COMPROMISO ADMINISTRATIVO ({activeBlock.concept}) ***
              </div>
            )}
          
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
                      <strong>AÑO ESCOLAR:</strong> 2026 - 2027 &nbsp;|&nbsp; <strong>NIVEL:</strong> MEDIA GENERAL
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
                        <strong>AÑO ESCOLAR:</strong> 2026 - 2027 &nbsp;|&nbsp; <strong>NIVEL:</strong> PRIMARIA
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
                        <th className="py-2 px-2 text-center w-20 bg-amber-800">EN PROCESO<br />(P / EP)</th>
                        <th className="py-2 px-2 text-center w-20 bg-rose-800">INICIADO<br />(I)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {levelAreas.map((area, idx) => {
                        const areaInds = indicators.filter(i => {
                          const matchesArea = i.areaId === area.id && i.level === 'PRIMARIA' && i.lapso === activeLapso;
                          if (!matchesArea) return false;
                          if (i.grade && activeStudent.grade) {
                            if (!i.grade.includes(activeStudent.grade) && !activeStudent.grade.includes(i.grade)) return false;
                          }
                          return true;
                        });

                        const studentEvals = evaluations.filter(
                          e => e.studentId === activeStudent.id &&
                               e.areaId === area.id &&
                               e.lapso === activeLapso &&
                               e.moment === 'PROCESAL'
                        );

                        const countL = studentEvals.filter(e => e.scoreQualitative === 'L').length;
                        const countP = studentEvals.filter(e => e.scoreQualitative === 'P' || e.scoreQualitative === 'EP').length;
                        const countI = studentEvals.filter(e => e.scoreQualitative === 'I').length;
                        const totalEvaluated = studentEvals.length || (areaInds.length > 0 ? areaInds.length : 0);
                        const displayedL = studentEvals.length > 0 ? countL : Math.max(0, areaInds.length - 1);
                        const displayedP = studentEvals.length > 0 ? countP : (areaInds.length > 0 ? 1 : 0);
                        const displayedI = studentEvals.length > 0 ? countI : 0;

                        return (
                          <tr key={area.id} className="hover:bg-slate-50">
                            <td className="py-1 px-2 text-center text-slate-400 font-mono text-[10px]">{idx + 1}</td>
                            <td className="py-1 px-3 font-bold text-[#2C2E53]">{area.name}</td>
                            <td className="py-1 px-2 text-center font-bold">{totalEvaluated}</td>
                            <td className="py-1 px-2 text-center font-black text-emerald-700 bg-emerald-50/50">{displayedL}</td>
                            <td className="py-1 px-2 text-center font-bold text-amber-700 bg-amber-50/50">{displayedP}</td>
                            <td className="py-1 px-2 text-center text-rose-700 bg-rose-50/50">{displayedI}</td>
                          </tr>
                        );
                      })}
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
                  {levelAreas.filter(a => ['pri-len', 'pri-mat', 'pri-cn', 'pri-cs'].includes(a.id)).map(area => {
                    const areaInds = indicators.filter(i => {
                      if (i.areaId !== area.id || i.level !== 'PRIMARIA' || i.lapso !== activeLapso) return false;
                      if (i.grade && activeStudent.grade) {
                        return i.grade.includes(activeStudent.grade) || activeStudent.grade.includes(i.grade);
                      }
                      return true;
                    });
                    if (areaInds.length === 0) return null;

                    return (
                      <div key={area.id} className="border border-slate-300 rounded-lg overflow-hidden">
                        <div className="bg-[#2C2E53] text-white px-3 py-1 font-bold flex justify-between">
                          <span className="uppercase">{area.name}</span>
                          <span className="text-[10px] opacity-80">{areaInds.length} Indicadores Evaluados</span>
                        </div>
                        <div className="p-3 space-y-1.5 bg-white divide-y divide-slate-100">
                          {areaInds.map(ind => {
                            const evalRec = evaluations.find(
                              e => e.studentId === activeStudent.id && e.indicatorId === ind.id && e.lapso === activeLapso && e.moment === 'PROCESAL'
                            );
                            const score = evalRec?.scoreQualitative || 'L';
                            const badgeColor = score === 'L' ? 'bg-emerald-100 text-emerald-800' : (score === 'I' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800');

                            return (
                              <div key={ind.id} className="pt-1.5 first:pt-0 flex justify-between items-start gap-2">
                                <span className="text-slate-700 leading-snug">
                                  <strong className="text-slate-400 font-mono text-[9px] mr-1">{ind.code}</strong>
                                  {ind.description}
                                </span>
                                <span className={`px-2 py-0.5 font-bold rounded text-[10px] shrink-0 ${badgeColor}`}>
                                  {score}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
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
                        <strong>AÑO ESCOLAR:</strong> 2026 - 2027 &nbsp;|&nbsp; <strong>NIVEL:</strong> PREESCOLAR
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
                      {levelAreas.map((area, idx) => {
                        const areaInds = indicators.filter(i => {
                          if (i.areaId !== area.id || i.level !== 'INICIAL') return false;
                          if (i.grade) {
                            if (activeStudent.grade?.includes('4') && i.grade.includes('4')) return true;
                            if (activeStudent.grade?.includes('5') && i.grade.includes('5')) return true;
                            if (activeStudent.grade?.includes('3') && i.grade.includes('3')) return true;
                            return false;
                          }
                          return true;
                        });
                        const totalInds = areaInds.length || (area.id === 'ini-ca' ? (activeStudent.grade?.includes('5') ? 12 : 13) : (area.id === 'ini-ap' ? (activeStudent.grade?.includes('5') ? 16 : 14) : (area.id === 'ini-ef' ? 4 : (area.id === 'ini-nat' ? 4 : (area.id === 'ini-aje' ? 4 : (area.id === 'ini-inf' ? 6 : (area.id === 'ini-ing' ? 5 : 8)))))));

                        const studentEvals = evaluations.filter(
                          e => e.studentId === activeStudent.id && e.areaId === area.id && e.lapso === activeLapso && e.moment === 'PROCESAL'
                        );

                        const countA = studentEvals.filter(e => e.scoreLiteral === 'A' || e.scoreLiteral === 'B').length;
                        const countP = studentEvals.filter(e => e.scoreLiteral === 'C' || e.scoreLiteral === 'D').length;
                        const countPA = studentEvals.filter(e => e.scoreLiteral === 'E').length;

                        const displayTotal = totalInds;
                        const displayA = studentEvals.length > 0 ? countA : Math.max(1, displayTotal - 1);
                        const displayP = studentEvals.length > 0 ? countP : 1;
                        const displayPA = studentEvals.length > 0 ? countPA : 0;

                        return (
                          <tr key={area.id} className="hover:bg-slate-50">
                            <td className="py-1 px-2 text-center text-slate-400 font-mono text-[10px]">{idx + 1}</td>
                            <td className="py-1 px-3 font-bold text-[#2C2E53]">{area.name}</td>
                            <td className="py-1 px-2 text-center font-bold">{displayTotal}</td>
                            <td className="py-1 px-2 text-center font-black text-emerald-700 bg-emerald-50/50">{displayA}</td>
                            <td className="py-1 px-2 text-center text-amber-700 bg-amber-50/50">{displayP}</td>
                            <td className="py-1 px-2 text-center text-slate-400">{displayPA}</td>
                          </tr>
                        );
                      })}
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
        </>
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
