import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Printer,
  FileSpreadsheet,
  Download,
  Filter
} from 'lucide-react';

export const FinalLapsoView: React.FC = () => {
  const {
    levelStudents,
    levelAreas,
    currentLevel,
    activeLapso,
    currentSection,
    evaluations,
    currentRole
  } = useApp();

  const [isLapsoLocked, setIsLapsoLocked] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('ALL');

  // Compute mock or real final scores for each student and area
  const getStudentAreaScore = (studentId: string, areaId: string) => {
    const finalRec = evaluations.find(
      e => e.studentId === studentId && e.areaId === areaId && e.moment === 'FINAL_LAPSO' && e.lapso === activeLapso
    );
    if (finalRec) {
      return currentLevel === 'MEDIA_GENERAL'
        ? finalRec.scoreNumeric?.toString() || '15'
        : finalRec.scoreQualitative || 'C';
    }

    // Procesal fallback
    const procesalRec = evaluations.find(
      e => e.studentId === studentId && e.areaId === areaId && e.moment === 'PROCESAL' && e.lapso === activeLapso
    );
    if (procesalRec) {
      return currentLevel === 'MEDIA_GENERAL'
        ? procesalRec.scoreNumeric?.toString() || '14'
        : procesalRec.scoreQualitative || 'C';
    }

    // Default mock
    if (currentLevel === 'MEDIA_GENERAL') {
      return studentId.includes('stu-med-3') ? '08' : studentId.includes('stu-med-4') ? '14' : '18';
    } else {
      return studentId.includes('stu-ini-3') ? 'EP' : 'L';
    }
  };

  const areasToShow = selectedAreaId === 'ALL'
    ? levelAreas.slice(0, 6) // show first 6 for compact matrix
    : levelAreas.filter(a => a.id === selectedAreaId);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] uppercase tracking-wider">
              Cierre y Certificación de Calificaciones
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] mt-1">
            Matriz Final de Lapso {activeLapso} ({currentLevel.replace('_', ' ')})
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Consolidado oficial de valoraciones de fin de lapso para emisión de boletines e informes pedagógicos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir Matriz
          </button>

          {(currentRole === 'COORDINACION' || currentRole === 'DOCENTE') && (
            <button
              onClick={() => setIsLapsoLocked(!isLapsoLocked)}
              className={`flex items-center gap-2 px-4 py-2 font-black rounded-xl text-xs transition-all ${
                isLapsoLocked
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-[#2C2E53] text-[#D4AF37] hover:bg-[#232543] shadow-md'
              }`}
            >
              {isLapsoLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {isLapsoLocked ? 'Desbloquear Cierre' : 'Cierre Oficial de Lapso'}
            </button>
          )}
        </div>
      </div>

      {isLapsoLocked && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-bold shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Lapso {activeLapso} cerrado y refrendado por Coordinación Pedagógica. Las notas están listas para emisión de Boletines.
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-emerald-200 px-2 py-0.5 rounded text-emerald-900">
            Auditado SICE-CBA
          </span>
        </div>
      )}

      {/* Roster & Consolidated Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden">
        <div className="p-4 bg-[#2C2E53] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-extrabold text-xs">
              Consolidado de Sección: {currentSection} • Lapso {activeLapso}
            </span>
          </div>
          <span className="text-[11px] text-slate-300 font-semibold">
            {levelStudents.length} Estudiantes Registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-black tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Estudiante</th>
                <th className="py-3 px-3">Cédula</th>
                {areasToShow.map(a => (
                  <th key={a.id} className="py-3 px-3 text-center" title={a.name}>
                    {a.code}
                  </th>
                ))}
                {currentLevel === 'MEDIA_GENERAL' && (
                  <th className="py-3 px-4 text-center bg-amber-50/70 font-black text-[#2C2E53]">
                    Promedio General
                  </th>
                )}
                <th className="py-3 px-4 text-center">Estado Académico</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {levelStudents.map((stu) => {
                // Calculate average across shown areas if Media General
                const scoresList = areasToShow.map(a => parseFloat(getStudentAreaScore(stu.id, a.id)));
                const avg = Math.round((scoresList.reduce((a, b) => a + (isNaN(b) ? 14 : b), 0) / scoresList.length) * 10) / 10;
                const isUnderperforming = currentLevel === 'MEDIA_GENERAL' && avg < 10;

                return (
                  <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#2C2E53] text-[#D4AF37] font-bold flex items-center justify-center text-xs overflow-hidden">
                        {stu.avatarUrl ? (
                          <img src={stu.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          stu.fullName.charAt(0)
                        )}
                      </div>
                      <div>
                        <span className="font-extrabold text-[#2C2E53] block text-xs">
                          {stu.fullName}
                        </span>
                        <span className="text-[10px] text-slate-400">{stu.grade} - {stu.section}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-500">{stu.cedula}</td>

                    {/* Area Scores */}
                    {areasToShow.map(a => {
                      const sc = getStudentAreaScore(stu.id, a.id);
                      const num = parseFloat(sc);

                      return (
                        <td key={a.id} className="py-3 px-3 text-center">
                          {currentLevel === 'MEDIA_GENERAL' ? (
                            <span className={`px-2 py-0.5 rounded font-black text-xs ${
                              num >= 16
                                ? 'bg-emerald-50 text-emerald-800'
                                : num >= 10
                                ? 'bg-blue-50 text-blue-800'
                                : 'bg-red-50 text-red-800 font-extrabold'
                            }`}>
                              {sc.padStart(2, '0')}
                            </span>
                          ) : (
                            <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                              sc === 'L' || sc === 'C' || sc === 'A'
                                ? 'bg-emerald-50 text-emerald-800'
                                : sc === 'EP' || sc === 'B'
                                ? 'bg-blue-50 text-blue-800'
                                : 'bg-amber-50 text-amber-800'
                            }`}>
                              {sc === 'L' || sc === 'C' ? 'Logrado' : sc === 'EP' ? 'En Proceso' : sc === 'I' ? 'Iniciado' : sc}
                            </span>
                          )}
                        </td>
                      );
                    })}

                    {/* Promedio General */}
                    {currentLevel === 'MEDIA_GENERAL' && (
                      <td className="py-3 px-4 text-center bg-amber-50/30">
                        <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                          avg >= 16
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : avg >= 10
                            ? 'bg-blue-100 text-blue-900 border-blue-300'
                            : 'bg-red-100 text-red-900 border-red-300 font-black'
                        }`}>
                          {avg}
                        </span>
                      </td>
                    )}

                    {/* Status badge */}
                    <td className="py-3 px-4 text-center">
                      {isUnderperforming || stu.status === 'EN_REVISION' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                          A Consejo de Curso
                        </span>
                      ) : stu.status === 'MATERIA_PENDIENTE' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-300">
                          Materia Pendiente
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Promovido / Regular
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
