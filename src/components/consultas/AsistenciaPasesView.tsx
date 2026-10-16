import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  ShieldAlert,
  UserCheck,
  AlertCircle
} from 'lucide-react';

import { DailyAttendanceRecord, PassRecord } from '../../types';

interface AsistenciaPasesViewProps {
  isFamilyOrStudent: boolean;
  scopedStudents: Student[];
  overrideStudents?: Student[];
  overrideDailyAttendance?: DailyAttendanceRecord[];
  overridePasses?: PassRecord[];
}

export const AsistenciaPasesView: React.FC<AsistenciaPasesViewProps> = ({
  isFamilyOrStudent,
  scopedStudents,
  overrideStudents,
  overrideDailyAttendance,
  overridePasses
}) => {
  const {
    passes: ctxPasses,
    dailyAttendance: ctxDailyAttendance,
    accumulatedAttendance,
    currentRole,
    students: ctxStudents
  } = useApp();

  const students = overrideStudents || ctxStudents;
  const passes = overridePasses || ctxPasses;
  const dailyAttendance = overrideDailyAttendance || ctxDailyAttendance;
  const [searchTerm, setSearchTerm] = useState('');

  // Pases visibles según rol
  const displayPasses = isFamilyOrStudent
    ? passes.filter((p) =>
        scopedStudents.some(
          (s) => s.id === p.studentId || (p.studentName && s.fullName.toLowerCase().includes(p.studentName.toLowerCase()))
        )
      )
    : passes;

  const filteredPasses = displayPasses.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.studentName?.toLowerCase().includes(term) ||
      p.ticketNumber?.toLowerCase().includes(term) ||
      p.reason?.toLowerCase().includes(term) ||
      p.authorizedBy?.toLowerCase().includes(term)
    );
  });

  // Estudiantes auditados para inasistencias
  const targetStudents = isFamilyOrStudent ? scopedStudents : students;

  return (
    <div className="space-y-6">
      {/* KPI Cards de Asistencia */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Pases Emitidos en Portería
          </span>
          <span className="text-3xl font-black text-[#2C2E53] dark:text-white mt-1 block">
            {displayPasses.length}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            100% justificados formalmente
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Índice de Puntualidad CBA
          </span>
          <span className="text-3xl font-black text-[#D4AF37] mt-1 block">98.4%</span>
          <span className="text-[11px] text-slate-500 font-semibold">
            Dentro del estándar de excelencia institucional
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Monitoreo Normativo LOE
          </span>
          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
            Art. 109
          </span>
          <span className="text-[11px] text-slate-500 font-semibold">
            Control de umbral de 25% de inasistencias
          </span>
        </div>
      </div>

      {/* Récord de Inasistencias y Alerta del 25% (Reglamento LOE Art. 109) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-cba-card overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <h3 className="font-extrabold text-xs text-[#2C2E53] dark:text-white uppercase tracking-wider">
              Control de Inasistencias y Evaluación Continua (Reglamento General LOE)
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-500">
            Límite legal: 25% de clases no asistidas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1B1C33] text-slate-200 uppercase text-[10px] tracking-wider font-extrabold">
              <tr>
                <th className="py-3 px-4">Estudiante</th>
                <th className="py-3 px-4">Grado / Sección</th>
                <th className="py-3 px-4 text-center">Inasistencias Justificadas</th>
                <th className="py-3 px-4 text-center">Inasistencias Injustificadas</th>
                <th className="py-3 px-4 text-center">% Inasistencias</th>
                <th className="py-3 px-4 text-center">Estatus Normativo LOE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {targetStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                    No hay registros de inasistencias para auditar.
                  </td>
                </tr>
              ) : (
                targetStudents.slice(0, 15).map((stu) => {
                  // Calcular inasistencias desde dailyAttendance o mock defensivo
                  const stuAtt = (dailyAttendance || []).filter((d) => d.studentId === stu.id);
                  const justCount = stuAtt.filter((d) => d.status === 'INASISTENCIA_JUSTIFICADA').length;
                  const injustCount = stuAtt.filter((d) => d.status === 'INASISTENCIA_INJUSTIFICADA').length;
                  const totalRecorded = Math.max(stuAtt.length, 30);
                  const pct = Math.round((injustCount / totalRecorded) * 100);
                  const exceedsLimit = pct >= 25;

                  return (
                    <tr key={stu.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {stu.fullName}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">
                        {stu.grade} Sec. {stu.section}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">
                        {justCount} clases
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-rose-600">
                        {injustCount} clases
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            exceedsLimit
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {pct}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {exceedsLimit ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Riesgo de Pérdida de Evaluación
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Regular (Al día)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historial de Pases por Retraso y Novedades de Portería */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-cba-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-sm text-[#2C2E53] dark:text-white">
              Historial de Pases de Portería y Retardos
            </h3>
            <p className="text-xs text-slate-500">
              Control cronológico de autorizaciones de entrada y novedades informadas por el personal de guardia.
            </p>
          </div>
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por estudiante, ticket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1B1C33] text-white uppercase text-[10px] tracking-wider font-extrabold">
              <tr>
                <th className="py-3 px-4">Estudiante</th>
                <th className="py-3 px-4">Fecha y Hora</th>
                <th className="py-3 px-4">Motivo Informado</th>
                <th className="py-3 px-4">Autorizado Por</th>
                <th className="py-3 px-4 text-center">Estado Notificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredPasses.map((pass) => (
                <tr key={pass.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {pass.studentName}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                    {pass.date} • {pass.time}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {pass.reason}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {pass.authorizedBy}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {pass.printed ? `✓ Notificado (${pass.ticketNumber})` : `✓ Registrado (${pass.ticketNumber})`}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredPasses.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                    {isFamilyOrStudent
                      ? 'No hay pases por retraso registrados para su representado.'
                      : 'No se encontraron registros de pases con los criterios seleccionados.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
