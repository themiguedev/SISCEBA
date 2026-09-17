import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  Printer,
  FileCheck,
  User,
  Award,
  Calendar,
  Sparkles,
  School,
  Download,
  Share2,
  CheckCircle2
} from 'lucide-react';

export const BoletinInformativoView: React.FC = () => {
  const {
    levelStudents,
    levelAreas,
    currentLevel,
    activeLapso,
    currentSection,
    evaluations
  } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(levelStudents[0]?.id || '');
  const activeStudent = levelStudents.find(s => s.id === selectedStudentId) || levelStudents[0];

  // Helper to fetch student score per area
  const getAreaEvaluation = (areaId: string) => {
    const finalRec = evaluations.find(
      e => e.studentId === activeStudent?.id && e.areaId === areaId && e.moment === 'FINAL_LAPSO' && e.lapso === activeLapso
    );
    if (finalRec) {
      return {
        scoreNumeric: finalRec.scoreNumeric,
        scoreQualitative: finalRec.scoreQualitative,
        obs: finalRec.observations || 'Demuestra avance regular en los objetivos pedagógicos.'
      };
    }
    const procRec = evaluations.find(
      e => e.studentId === activeStudent?.id && e.areaId === areaId && e.moment === 'PROCESAL' && e.lapso === activeLapso
    );
    if (procRec) {
      return {
        scoreNumeric: procRec.scoreNumeric,
        scoreQualitative: procRec.scoreQualitative,
        obs: procRec.observations || 'Participación activa y cumplimiento de actividades.'
      };
    }
    // Mock score
    const isChacin = activeStudent?.id.includes('stu-med-3');
    return {
      scoreNumeric: isChacin ? (areaId.includes('mat') ? 8 : 12) : 18,
      scoreQualitative: (isChacin ? 'EP' : 'C') as 'EP' | 'C',
      obs: isChacin
        ? 'En proceso de afianzamiento conceptual. Cuenta con Plan de Acción Pedagógico.'
        : 'Excelente comprensión conceptual y aplicación práctica en los proyectos del aula.'
    };
  };

  // Compute general average for Media General
  const studentScores = levelAreas.map(a => getAreaEvaluation(a.id).scoreNumeric || 15);
  const generalAverage = Math.round((studentScores.reduce((a, b) => a + b, 0) / studentScores.length) * 10) / 10;

  return (
    <div className="space-y-6">
      {/* Header Info & Student Switcher */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] uppercase tracking-wider">
              Documento Institucional Oficial
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] mt-1">
            Boletín Informativo de Evaluación ({currentLevel.replace('_', ' ')})
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Informe pedagógico oficial de rendimiento para padres, representantes y estudiantes.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="select-bulletin-student" className="sr-only">
            Seleccionar estudiante
          </label>
          <select
            id="select-bulletin-student"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            aria-label="Seleccionar estudiante para ver boletín informativo"
            className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-black text-[#2C2E53] focus:ring-2 focus:ring-[#2C2E53]"
          >
            {levelStudents.map(s => (
              <option key={s.id} value={s.id}>{s.fullName} ({s.cedula})</option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-[#2C2E53] text-[#D4AF37] hover:bg-[#232543] font-black rounded-xl text-xs shadow-md transition-all whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            Imprimir Boletín
          </button>
        </div>
      </div>

      {/* Official Bellas Artes Document Layout */}
      {activeStudent && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 max-w-4xl mx-auto space-y-6 print:shadow-none print:border-none print:p-2">
          {/* Institutional Header with Logo and Titles */}
          <div className="flex items-center justify-between border-b-2 border-[#2C2E53] pb-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-24 flex items-center justify-center">
                <img src="/logo-cba.png" alt="Colegio Bellas Artes" className="h-full w-auto object-contain" />
              </div>
              <div>
                <span className="text-xs font-black tracking-widest text-slate-500 uppercase block">
                  República Bolivariana de Venezuela • MPPE
                </span>
                <h1 className="text-xl font-black text-[#2C2E53] tracking-tight">
                  U.E.P. COLEGIO BELLAS ARTES
                </h1>
                <p className="text-xs text-slate-600 font-semibold">
                  Maracaibo, Estado Zulia • Año Escolar 2026 - 2027
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-[#D4AF37]/15 text-[#94721C] border border-[#D4AF37]/30 text-xs font-black rounded-full uppercase tracking-wider">
                Boletín Lapso {activeLapso}
              </span>
              <p className="text-[11px] text-slate-400 mt-1 font-semibold">Código DEA: S0432D2305</p>
            </div>
          </div>

          {/* Student & Academic Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Estudiante</span>
              <strong className="text-[#2C2E53] text-sm block truncate">{activeStudent.fullName}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Cédula / Identidad</span>
              <strong className="text-slate-700 block">{activeStudent.cedula}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Nivel y Grado</span>
              <strong className="text-slate-700 block">{activeStudent.grade} - "{activeStudent.section}"</strong>
            </div>
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Representante</span>
              <strong className="text-slate-700 block truncate">{activeStudent.representativeName}</strong>
            </div>
          </div>

          {/* Table of Areas and Grades */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2C2E53] text-white uppercase font-black tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Área de Formación / Asignatura</th>
                  <th className="py-3 px-3">Tipo</th>
                  <th className="py-3 px-3 text-center">
                    {currentLevel === 'MEDIA_GENERAL' ? 'Definitiva (01-20)' : 'Apreciación Cualitativa'}
                  </th>
                  <th className="py-3 px-4">Apreciación Descriptiva del Desempeño</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {levelAreas.map(area => {
                  const evalData = getAreaEvaluation(area.id);
                  const isNumPassing = (evalData.scoreNumeric || 0) >= 10;

                  return (
                    <tr key={area.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 font-bold text-[#2C2E53]">
                        {area.name}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">({area.code})</span>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {area.type}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        {currentLevel === 'MEDIA_GENERAL' ? (
                          <span className={`px-2.5 py-1 rounded-lg font-black text-xs ${
                            isNumPassing
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-red-50 text-red-800 border border-red-200 font-black'
                          }`}>
                            {(evalData.scoreNumeric || 15).toString().padStart(2, '0')}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg font-black text-xs bg-slate-100 text-[#2C2E53]">
                            {evalData.scoreQualitative === 'C' ? 'Consolidado (C)' : evalData.scoreQualitative === 'EP' ? 'En Proceso (EP)' : 'Iniciado (I)'}
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-4 text-slate-600 text-[11px] leading-relaxed">
                        {evalData.obs}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Average / Final Qualitative Synthesis */}
          <div className="bg-[#2C2E53]/5 p-4 rounded-xl border border-[#2C2E53]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#2C2E53] uppercase block">
                {currentLevel === 'MEDIA_GENERAL' ? 'Promedio Ponderado del Lapso' : 'Síntesis Pedagógica General'}
              </span>
              <p className="text-xs text-slate-600 mt-0.5">
                {currentLevel === 'MEDIA_GENERAL'
                  ? `Rendimiento global del estudiante en el Lapso ${activeLapso}.`
                  : 'Desarrollo armónico de las dimensiones afectivas, cognitivas y creativas.'}
              </p>
            </div>

            {currentLevel === 'MEDIA_GENERAL' && (
              <div className="text-center bg-white px-5 py-2 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-2xl font-black text-[#2C2E53]">{generalAverage}</span>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Puntos / 20</span>
              </div>
            )}
          </div>

          {/* Signatures Row */}
          <div className="grid grid-cols-3 gap-6 pt-8 text-center text-xs">
            <div className="border-t border-slate-400 pt-2">
              <strong className="block text-[#2C2E53]">Lic. Carolina Sánchez</strong>
              <span className="text-[11px] text-slate-500">Coordinación Pedagógica</span>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <strong className="block text-[#2C2E53]">Prof. Docente Guía</strong>
              <span className="text-[11px] text-slate-500">Tutor de Sección</span>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <strong className="block text-[#2C2E53]">{activeStudent.representativeName}</strong>
              <span className="text-[11px] text-slate-500">Firma del Representante</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
