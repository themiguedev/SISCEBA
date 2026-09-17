import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CouncilMeetingMinute } from '../../types';
import {
  FileText,
  Users,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Printer,
  FileEdit,
  PenTool,
  Save,
  Scale
} from 'lucide-react';

export const ActasConsejoView: React.FC = () => {
  const {
    currentLevel,
    currentSection,
    activeLapso,
    levelStudents,
    levelAreas,
    councilMinutes,
    createCouncilMinute,
    signCouncilMinute,
    adjustStudentGrade
  } = useApp();

  const levelMinutes = councilMinutes.filter(m => m.level === currentLevel);
  const activeMinute = levelMinutes[0];

  // State for adding formal grade adjustment
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjStudentId, setAdjStudentId] = useState(levelStudents[0]?.id || '');
  const [adjAreaId, setAdjAreaId] = useState(levelAreas[0]?.id || '');
  const [adjOldScore, setAdjOldScore] = useState('08');
  const [adjNewScore, setAdjNewScore] = useState('12');
  const [adjJustification, setAdjJustification] = useState(
    'Superación demostrada mediante Plan de Acción Personalizado con IA y prueba formativa.'
  );

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjStudentId || !adjAreaId || !adjNewScore || !adjJustification) return;

    adjustStudentGrade(adjStudentId, adjAreaId, adjOldScore, adjNewScore, adjJustification);
    setIsAdjustModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] uppercase tracking-wider">
              Órgano Colegiado de Evaluación
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] mt-1">
            Acta de Consejo de Curso y Ajuste de Calificaciones
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Formalización de decisiones pedagógicas, análisis de rendimiento y libro de actas refrendado.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdjustModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#c29f2e] text-[#1B1C33] font-black rounded-xl text-xs shadow-cba-gold transition-all"
          >
            <Scale className="w-4 h-4" />
            Ajustar Calificación / Indicador
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir Acta
          </button>
        </div>
      </div>

      {activeMinute ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 max-w-4xl mx-auto space-y-6 print:shadow-none print:border-none print:p-2">
          {/* Official Bellas Artes Document Header */}
          <div className="flex items-center justify-between border-b-2 border-[#2C2E53] pb-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-20 flex items-center justify-center">
                <img src="/logo-cba.png" alt="Colegio Bellas Artes" className="h-full w-auto object-contain" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase block">
                  U.E.P. Colegio Bellas Artes • Maracaibo
                </span>
                <h1 className="text-lg font-black text-[#2C2E53]">
                  ACTA OFICIAL DE CONSEJO DE CURSO • LAPSO {activeMinute.lapso}
                </h1>
                <p className="text-xs text-slate-500 font-semibold">
                  Nivel: {currentLevel.replace('_', ' ')} • Sección: {activeMinute.gradeSection} • Fecha: {activeMinute.meetingDate}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                activeMinute.signed
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}>
                {activeMinute.signed ? '✓ Refrendada y Firmada' : '✎ En Redacción'}
              </span>
            </div>
          </div>

          {/* Attendees & Quorum */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#2C2E53] uppercase">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              Quórum Docente y Coordinación Presente
            </div>
            <p className="text-xs text-slate-600 font-semibold">
              <strong>Presidente del Consejo:</strong> {activeMinute.coordinador}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {activeMinute.attendees.map((att, i) => (
                <span key={i} className="text-[11px] font-medium bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
                  {att}
                </span>
              ))}
            </div>
          </div>

          {/* Agenda & Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-[#2C2E53] uppercase tracking-wide">
              1. Deliberación y Síntesis Pedagógica
            </h3>
            <p className="text-xs text-slate-700 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
              {activeMinute.agendaSummary}
            </p>
          </div>

          {/* Adjusted Scores Table (Ajuste de Calificaciones e Indicadores) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-[#2C2E53] uppercase tracking-wide flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#D4AF37]" />
                2. Registro Oficial de Ajustes de Calificaciones / Indicadores ({activeMinute.adjustedScores.length})
              </h3>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#2C2E53] text-white uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Estudiante</th>
                    <th className="py-2.5 px-3">Área / Materia</th>
                    <th className="py-2.5 px-3 text-center">Nota Anterior</th>
                    <th className="py-2.5 px-3 text-center">Nota Ajustada</th>
                    <th className="py-2.5 px-4">Motivación y Fundamento Pedagógico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {activeMinute.adjustedScores.map((adj, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-[#2C2E53]">{adj.studentName}</td>
                      <td className="py-2.5 px-3 text-slate-600">{adj.areaName}</td>
                      <td className="py-2.5 px-3 text-center text-red-600 font-black">{adj.previousScore}</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700 font-black">{adj.newScore}</td>
                      <td className="py-2.5 px-4 text-slate-600 text-[11px]">{adj.justification}</td>
                    </tr>
                  ))}
                  {activeMinute.adjustedScores.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400 italic text-xs">
                        No se registraron ajustes de calificaciones en este consejo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Critical Cases Followup */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-[#2C2E53] uppercase tracking-wide">
              3. Estudiantes a Seguimiento Especial y Planes de Intervención
            </h3>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {activeMinute.criticalCases.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Resolutions */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-[#2C2E53] uppercase tracking-wide">
              4. Resoluciones y Acuerdos Finales
            </h3>
            <div className="space-y-1.5">
              {activeMinute.resolutions.map((res, i) => (
                <div key={i} className="text-xs text-slate-800 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60 font-medium">
                  <strong>Acuerdo {i + 1}:</strong> {res}
                </div>
              ))}
            </div>
          </div>

          {/* Signatures and Refrendation */}
          <div className="pt-6 border-t border-slate-300">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
              <div className="border-t border-slate-400 pt-2">
                <span className="block font-bold text-[#2C2E53]">Lic. Carolina Sánchez</span>
                <span className="text-[10px] text-slate-500">Coordinadora Pedagógica</span>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <span className="block font-bold text-[#2C2E53]">Prof. Alejandro Rivas</span>
                <span className="text-[10px] text-slate-500">Docente de Matemáticas</span>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <span className="block font-bold text-[#2C2E53]">Prof. Marcos Andrade</span>
                <span className="text-[10px] text-slate-500">Docente de Física</span>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <span className="block font-bold text-[#2C2E53]">Lic. Mariana Duque</span>
                <span className="text-[10px] text-slate-500">Psicología Escolar</span>
              </div>
            </div>

            {!activeMinute.signed && (
              <div className="mt-6 text-center no-print">
                <button
                  onClick={() => signCouncilMinute(activeMinute.id)}
                  className="flex items-center gap-2 mx-auto px-6 py-2.5 bg-[#2C2E53] text-[#D4AF37] hover:bg-[#232543] font-black rounded-xl text-xs shadow-md transition-all"
                >
                  <PenTool className="w-4 h-4" />
                  Refrendar y Firmar Acta Oficial
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-600 font-bold">No hay actas registradas para este nivel y sección.</p>
        </div>
      )}

      {/* Modal: Ajuste de Calificación / Indicador */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-lg text-[#2C2E53] flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#D4AF37]" />
                Formalizar Ajuste de Calificación
              </h3>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estudiante a Ajustar *
                </label>
                <select
                  value={adjStudentId}
                  onChange={(e) => setAdjStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-[#2C2E53]"
                  required
                >
                  {levelStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.cedula})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Área de Formación *
                </label>
                <select
                  value={adjAreaId}
                  onChange={(e) => setAdjAreaId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-[#2C2E53]"
                  required
                >
                  {levelAreas.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Calificación Anterior *
                  </label>
                  <input
                    type="text"
                    value={adjOldScore}
                    onChange={(e) => setAdjOldScore(e.target.value)}
                    placeholder="Ej. 08 o EP"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nueva Calificación Aprobada *
                  </label>
                  <input
                    type="text"
                    value={adjNewScore}
                    onChange={(e) => setAdjNewScore(e.target.value)}
                    placeholder="Ej. 12 o C"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-emerald-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fundamento Pedagógico / Razón del Ajuste *
                </label>
                <textarea
                  rows={3}
                  value={adjJustification}
                  onChange={(e) => setAdjJustification(e.target.value)}
                  placeholder="Justificación formal de la decisión del Consejo..."
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2C2E53]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black bg-[#2C2E53] text-[#D4AF37] hover:bg-[#232543] rounded-xl shadow-md"
                >
                  Registrar en Acta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
