import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QualitativeScore } from '../../types';
import {
  Cpu,
  CheckCircle2,
  AlertCircle,
  Save,
  HelpCircle,
  User,
  Sparkles,
  Bot,
  BrainCircuit,
  Filter
} from 'lucide-react';

export const DiagnosticView: React.FC = () => {
  const {
    levelStudents,
    levelAreas,
    currentLevel,
    activeLapso,
    evaluations,
    recordEvaluation,
    bulkRecordEvaluations
  } = useApp();

  const [selectedAreaId, setSelectedAreaId] = useState<string>(
    currentLevel === 'INICIAL'
      ? levelAreas.find(a => a.name.toLowerCase().includes('robótica') || a.name.toLowerCase().includes('informática'))?.id || levelAreas[0]?.id || ''
      : levelAreas[0]?.id || ''
  );

  const currentArea = levelAreas.find(a => a.id === selectedAreaId) || levelAreas[0];
  const isRoboticsSpecial = currentLevel === 'INICIAL' && (currentArea?.name.toLowerCase().includes('informática') || currentArea?.name.toLowerCase().includes('robótica'));

  // Local form state for inline entry
  const [scores, setScores] = useState<Record<string, {
    numeric?: number;
    qualitative?: QualitativeScore;
    obs?: string;
    robotics?: { logic: QualitativeScore; construction: QualitativeScore; teamwork: QualitativeScore };
  }>>({});

  const [isSavedBanner, setIsSavedBanner] = useState(false);

  // Initialize or load existing diagnostic evaluations
  React.useEffect(() => {
    const existing: typeof scores = {};
    levelStudents.forEach(stu => {
      const rec = evaluations.find(
        e => e.studentId === stu.id && e.areaId === selectedAreaId && e.moment === 'DIAGNOSTICA' && e.lapso === activeLapso
      );
      if (rec) {
        existing[stu.id] = {
          numeric: rec.scoreNumeric,
          qualitative: rec.scoreQualitative || 'L',
          obs: rec.observations || '',
          robotics: rec.roboticsScore ? {
            logic: rec.roboticsScore.logicSkills,
            construction: rec.roboticsScore.constructionSkills,
            teamwork: rec.roboticsScore.teamwork
          } : undefined
        };
      } else {
        existing[stu.id] = {
          numeric: currentLevel === 'MEDIA_GENERAL' ? 14 : undefined,
          qualitative: 'L',
          obs: '',
          robotics: isRoboticsSpecial ? { logic: 'L', construction: 'L', teamwork: 'L' } : undefined
        };
      }
    });
    setScores(existing);
  }, [selectedAreaId, currentLevel, activeLapso, levelStudents]);

  const handleScoreChange = (studentId: string, val: any) => {
    setScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        ...val
      }
    }));
  };

  const handleSaveAll = () => {
    const recordsToSave = levelStudents.map(stu => {
      const entry = scores[stu.id] || {};
      return {
        studentId: stu.id,
        areaId: selectedAreaId,
        moment: 'DIAGNOSTICA' as const,
        lapso: activeLapso,
        scoreNumeric: currentLevel === 'MEDIA_GENERAL' ? (entry.numeric ?? 12) : undefined,
        scoreQualitative: currentLevel !== 'MEDIA_GENERAL' ? (entry.qualitative ?? 'L') : undefined,
        roboticsScore: entry.robotics ? {
          logicSkills: entry.robotics.logic,
          constructionSkills: entry.robotics.construction,
          teamwork: entry.robotics.teamwork
        } : undefined,
        observations: entry.obs || 'Registro diagnóstico inicial completado',
        teacherId: 'docente-titular'
      };
    });

    bulkRecordEvaluations(recordsToSave);
    setIsSavedBanner(true);
    setTimeout(() => setIsSavedBanner(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] uppercase tracking-wider">
              Diagnóstico Pedagógico de Entrada
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] mt-1">
            Evaluación Diagnóstica ({currentLevel.replace('_', ' ')})
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Identificación temprana de estilos de aprendizaje, habilidades previas y destrezas prácticas al inicio del año escolar.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2C2E53] text-[#D4AF37] hover:bg-[#232543] font-black rounded-xl text-xs shadow-md transition-all"
        >
          <Save className="w-4 h-4" />
          Guardar Registros Diagnósticos
        </button>
      </div>

      {isSavedBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Registros diagnósticos guardados satisfactoriamente en SICE-CBA.
        </div>
      )}

      {/* Area Selector and Special Robótica Banner for Inicial */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="select-diag-area" className="text-xs font-bold text-[#2C2E53] whitespace-nowrap">
            Área de Formación:
          </label>
          <select
            id="select-diag-area"
            value={selectedAreaId}
            onChange={(e) => setSelectedAreaId(e.target.value)}
            aria-label="Seleccionar área de formación para evaluación diagnóstica"
            className="w-full sm:w-80 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-extrabold text-[#2C2E53] focus:ring-2 focus:ring-[#2C2E53]"
          >
            {levelAreas.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.code})</option>
            ))}
          </select>
        </div>

        {currentLevel === 'INICIAL' && (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200/70 px-3 py-1.5 rounded-xl text-xs font-bold">
            <Bot className="w-4 h-4 text-[#D4AF37]" />
            <span>Módulo Especial Robótica Inicial Activo</span>
          </div>
        )}
      </div>

      {currentLevel === 'INICIAL' && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#2C2E53] text-[#D4AF37] flex items-center justify-center font-bold shrink-0 mt-0.5">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-xs text-[#2C2E53] uppercase tracking-wide">
                Evaluación Diagnóstica: Módulo de Robótica Inicial • Perfil del Área
              </h4>
              <span className="text-[10px] bg-[#D4AF37] text-[#2C2E53] font-black px-2 py-0.5 rounded-full">
                SICE-CBA
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              <strong>Perfil del Área de Robótica:</strong> Estimulación del pensamiento computacional temprano, lógica espacial algorítmica, resolución de retos lúdicos con comandos direccionales, motricidad fina de ensamblaje con sets modulares infantiles y trabajo cooperativo en la sala de clases.
            </p>
          </div>
        </div>
      )}

      {/* Table of Students for Diagnostic Entry */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden">
        <div className="p-4 bg-[#2C2E53] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-extrabold text-xs tracking-wide">
              Matriz de Registro: {currentArea?.name} • Lapso {activeLapso}
            </span>
          </div>
          <span className="text-[11px] text-slate-300">
            Total estudiantes en nómina: {levelStudents.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-black tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Estudiante</th>
                <th className="py-3 px-3">Cédula / ID</th>
                {currentLevel === 'INICIAL' && (
                  <>
                    <th className="py-3 px-3 text-center">Lógica Espacial</th>
                    <th className="py-3 px-3 text-center">Construcción</th>
                    <th className="py-3 px-3 text-center">Trabajo Equipo</th>
                    <th className="py-3 px-3 text-center">Nivel Global</th>
                  </>
                )}
                {currentLevel === 'PRIMARIA' && (
                  <th className="py-3 px-3 text-center">Valoración Cualitativa</th>
                )}
                {currentLevel === 'MEDIA_GENERAL' && (
                  <th className="py-3 px-3 text-center">Calificación (01-20)</th>
                )}
                <th className="py-3 px-4">Observación Diagnóstica Cualitativa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {levelStudents.map((stu) => {
                const rowData = scores[stu.id] || {};

                return (
                  <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#2C2E53] text-[#D4AF37] font-extrabold flex items-center justify-center text-xs overflow-hidden">
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

                    <td className="py-3 px-3 font-semibold text-slate-500">
                      {stu.cedula}
                    </td>

                    {/* Nivel Inicial: Multi-dimensional Robotics / Psychomotor Diagnostic */}
                    {currentLevel === 'INICIAL' && (
                      <>
                        <td className="py-3 px-3 text-center">
                          <select
                            value={rowData.robotics?.logic || 'L'}
                            onChange={(e) =>
                              handleScoreChange(stu.id, {
                                robotics: {
                                  ...(rowData.robotics || { logic: 'L', construction: 'L', teamwork: 'L' }),
                                  logic: e.target.value as QualitativeScore
                                }
                              })
                            }
                            aria-label={`Lógica espacial para ${stu.fullName}`}
                            className="p-1.5 bg-slate-50 rounded border border-slate-200 text-xs font-black text-[#2C2E53]"
                          >
                            <option value="L">Logrado (L)</option>
                            <option value="EP">En Proceso (EP)</option>
                            <option value="I">Iniciado (I)</option>
                          </select>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <select
                            value={rowData.robotics?.construction || 'L'}
                            onChange={(e) =>
                              handleScoreChange(stu.id, {
                                robotics: {
                                  ...(rowData.robotics || { logic: 'L', construction: 'L', teamwork: 'L' }),
                                  construction: e.target.value as QualitativeScore
                                }
                              })
                            }
                            aria-label={`Habilidad de construcción para ${stu.fullName}`}
                            className="p-1.5 bg-slate-50 rounded border border-slate-200 text-xs font-black text-[#2C2E53]"
                          >
                            <option value="L">Logrado (L)</option>
                            <option value="EP">En Proceso (EP)</option>
                            <option value="I">Iniciado (I)</option>
                          </select>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <select
                            value={rowData.robotics?.teamwork || 'L'}
                            onChange={(e) =>
                              handleScoreChange(stu.id, {
                                robotics: {
                                  ...(rowData.robotics || { logic: 'L', construction: 'L', teamwork: 'L' }),
                                  teamwork: e.target.value as QualitativeScore
                                }
                              })
                            }
                            aria-label={`Trabajo en equipo para ${stu.fullName}`}
                            className="p-1.5 bg-slate-50 rounded border border-slate-200 text-xs font-black text-[#2C2E53]"
                          >
                            <option value="L">Logrado (L)</option>
                            <option value="EP">En Proceso (EP)</option>
                            <option value="I">Iniciado (I)</option>
                          </select>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                            rowData.qualitative === 'L' || rowData.qualitative === 'C' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            rowData.qualitative === 'EP' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {rowData.qualitative === 'L' || rowData.qualitative === 'C' ? 'Logrado' : rowData.qualitative === 'EP' ? 'En Proceso' : rowData.qualitative === 'I' ? 'Iniciado' : (rowData.qualitative || 'Logrado')}
                          </span>
                        </td>
                      </>
                    )}

                    {/* Primaria: Qualitative */}
                    {currentLevel === 'PRIMARIA' && (
                      <td className="py-3 px-3 text-center">
                        <select
                          value={rowData.qualitative || 'L'}
                          onChange={(e) =>
                            handleScoreChange(stu.id, { qualitative: e.target.value as QualitativeScore })
                          }
                          aria-label={`Valoración cualitativa para ${stu.fullName}`}
                          className="p-1.5 bg-slate-50 rounded border border-slate-200 text-xs font-black text-[#2C2E53]"
                        >
                          <option value="L">Logrado (L / A)</option>
                          <option value="EP">En Proceso (EP / B)</option>
                          <option value="I">Iniciado (I / C-D)</option>
                        </select>
                      </td>
                    )}

                    {/* Media General: Quantitative 01 - 20 */}
                    {currentLevel === 'MEDIA_GENERAL' && (
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={rowData.numeric ?? ''}
                          onChange={(e) =>
                            handleScoreChange(stu.id, { numeric: Number(e.target.value) })
                          }
                          aria-label={`Calificación numérica de 01 a 20 para ${stu.fullName}`}
                          className={`w-16 p-1.5 text-center font-black rounded border text-xs ${
                            (rowData.numeric || 0) >= 16
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : (rowData.numeric || 0) >= 10
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : 'bg-red-50 text-red-800 border-red-300'
                          }`}
                        />
                      </td>
                    )}

                    {/* Qualitative Notes */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={rowData.obs || ''}
                        onChange={(e) => handleScoreChange(stu.id, { obs: e.target.value })}
                        placeholder="Observación del ritmo y destrezas..."
                        className="w-full p-1.5 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700"
                      />
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
