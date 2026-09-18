import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyAttendanceRecord } from '../../types';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  UserX,
  Clock,
  Save,
  Filter,
  Users,
  Layers,
  BookOpen
} from 'lucide-react';

export const InasistenciasGestionView: React.FC = () => {
  const {
    students,
    dailyAttendance,
    markDailyAttendance,
    accumulatedAttendance,
    activeLapso,
    currentSection
  } = useApp();

  const [activeTab, setActiveTab] = useState<'DIARIA' | 'GENERAL'>('DIARIA');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-17');
  const [saveBanner, setSaveBanner] = useState(false);

  // Filter students by section
  const sectionStudents = students.filter(
    (s) => `${s.grade} ${s.section}`.toLowerCase() === currentSection.toLowerCase()
  );

  const handleStatusChange = (studentId: string, status: DailyAttendanceRecord['status']) => {
    markDailyAttendance(studentId, status);
  };

  const handleSaveAll = () => {
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Control Escolar y Asistencia
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C2E53] mt-1">Gestión de Inasistencias</h2>
          <p className="text-xs text-slate-500">
            ADM / DOC: Registro diario de asistencia y control acumulativo de inasistencias por materia (límite del 25%).
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('DIARIA')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'DIARIA'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Inasistencias Diarias
          </button>
          <button
            onClick={() => setActiveTab('GENERAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'GENERAL'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Inasistencias Generales (Lapso)
          </button>
        </div>
      </div>

      {saveBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ¡Registros de asistencia guardados y sincronizados correctamente!
        </div>
      )}

      {/* VIEW 1: INASISTENCIAS DIARIAS */}
      {activeTab === 'DIARIA' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>Fecha:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-none text-slate-800 focus:outline-none"
                />
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                Sección Activa: <strong className="text-[#2C2E53]">{currentSection}</strong>
              </span>
            </div>

            <button
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar Asistencias
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1B1C33] text-white uppercase text-[10px] tracking-wider font-extrabold">
                <tr>
                  <th className="py-3.5 px-4">Estudiante</th>
                  <th className="py-3.5 px-4">Cédula</th>
                  <th className="py-3.5 px-4">Estado del Registro</th>
                  <th className="py-3.5 px-4 text-center">Acción Rápida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {sectionStudents.map((stu) => {
                  const record = dailyAttendance.find(
                    (a) => a.studentId === stu.id && a.date === selectedDate
                  );
                  const currentStatus = record?.status || 'PRESENTE';

                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{stu.fullName}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{stu.cedula}</td>
                      <td className="py-3 px-4">
                        {currentStatus === 'PRESENTE' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Presente
                          </span>
                        )}
                        {currentStatus === 'RETRASO' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                            Retraso Justificado
                          </span>
                        )}
                        {currentStatus === 'INASISTENCIA_JUSTIFICADA' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                            Falta Justificada
                          </span>
                        )}
                        {currentStatus === 'INASISTENCIA_INJUSTIFICADA' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                            Falta Injustificada
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleStatusChange(stu.id, 'PRESENTE')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                              currentStatus === 'PRESENTE'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-slate-100 hover:bg-emerald-100 text-slate-600'
                            }`}
                          >
                            P
                          </button>
                          <button
                            onClick={() => handleStatusChange(stu.id, 'RETRASO')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                              currentStatus === 'RETRASO'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'bg-slate-100 hover:bg-amber-100 text-slate-600'
                            }`}
                          >
                            R
                          </button>
                          <button
                            onClick={() => handleStatusChange(stu.id, 'INASISTENCIA_JUSTIFICADA')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                              currentStatus === 'INASISTENCIA_JUSTIFICADA'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-slate-100 hover:bg-blue-100 text-slate-600'
                            }`}
                          >
                            FJ
                          </button>
                          <button
                            onClick={() => handleStatusChange(stu.id, 'INASISTENCIA_INJUSTIFICADA')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                              currentStatus === 'INASISTENCIA_INJUSTIFICADA'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'bg-slate-100 hover:bg-rose-100 text-slate-600'
                            }`}
                          >
                            FI
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}

      {/* VIEW 2: INASISTENCIAS GENERALES ACUMULADAS POR MATERIA */}
      {activeTab === 'GENERAL' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Reglamento de Evaluación del Colegio Bellas Artes:</span>
              El porcentaje de inasistencias injustificadas acumuladas no debe superar el <strong>25%</strong> del total de clases impartidas en el lapso. Superar dicho límite condiciona la aprobación de la asignatura.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1B1C33] text-white uppercase text-[10px] tracking-wider font-extrabold">
                <tr>
                  <th className="py-3.5 px-4">Estudiante</th>
                  <th className="py-3.5 px-4">Materia</th>
                  <th className="py-3.5 px-4 text-center">Clases Dadas</th>
                  <th className="py-3.5 px-4 text-center">Faltas Injustificadas</th>
                  <th className="py-3.5 px-4 text-center">Faltas Justificadas</th>
                  <th className="py-3.5 px-4 text-center">% Inasistencia</th>
                  <th className="py-3.5 px-4 text-center">Condición</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {accumulatedAttendance.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{acc.studentName}</td>
                    <td className="py-3 px-4 font-semibold text-[#2C2E53]">{acc.areaName}</td>
                    <td className="py-3 px-4 text-center font-mono">{acc.totalClasses}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-rose-600">
                      {acc.unjustifiedAbsences}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-blue-600">
                      {acc.justifiedAbsences}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-full ${
                          acc.exceedsLimit
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {acc.absencePercentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {acc.exceedsLimit ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-sm flex items-center justify-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Excede Límite (25%)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Regular
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
