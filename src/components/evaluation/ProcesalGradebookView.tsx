import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QualitativeScore, LiteralScore, NotificationDeliveryChannel } from '../../types';
import { PublishGradesModal } from './PublishGradesModal';
import {
  Save,
  Send,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Bot,
  BrainCircuit,
  Calculator,
  Search,
  Filter,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  HelpCircle,
  Bell
} from 'lucide-react';

interface ProcesalGradebookViewProps {
  onNavigateToAI?: () => void;
}

export const ProcesalGradebookView: React.FC<ProcesalGradebookViewProps> = ({ onNavigateToAI }) => {
  const {
    levelStudents,
    levelAreas,
    indicators,
    currentLevel,
    activeLapso,
    currentSection,
    evaluations,
    recordEvaluation,
    bulkRecordEvaluations,
    generateAIActionPlan,
    sendNotification
  } = useApp();

  const [selectedAreaId, setSelectedAreaId] = useState<string>(levelAreas[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedAlert, setSavedAlert] = useState(false);
  const [publishedAlert, setPublishedAlert] = useState<string | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [generatedStudentId, setGeneratedStudentId] = useState<string | null>(null);

  const currentArea = levelAreas.find(a => a.id === selectedAreaId) || levelAreas[0];
  const areaIndicators = indicators.filter(
    i => i.areaId === selectedAreaId && i.level === currentLevel && i.lapso === activeLapso
  );

  // Local state grid: studentId -> { [indicatorId]: number | qualitative }
  const [gridScores, setGridScores] = useState<Record<string, Record<string, any>>>({});

  // Sync with existing evaluations
  React.useEffect(() => {
    const map: Record<string, Record<string, any>> = {};
    levelStudents.forEach(stu => {
      map[stu.id] = {};
      areaIndicators.forEach(ind => {
        const found = evaluations.find(
          e =>
            e.studentId === stu.id &&
            e.areaId === selectedAreaId &&
            e.moment === 'PROCESAL' &&
            e.lapso === activeLapso &&
            e.indicatorId === ind.id
        );
        if (found) {
          map[stu.id][ind.id] =
            currentLevel === 'MEDIA_GENERAL'
              ? found.scoreNumeric
              : found.scoreQualitative || 'L';
        } else {
          // Default mock grade based on student id
          if (currentLevel === 'MEDIA_GENERAL') {
            map[stu.id][ind.id] = stu.id.includes('stu-med-3') ? 8 : 17;
          } else {
            map[stu.id][ind.id] = stu.id.includes('stu-ini-3') ? 'EP' : 'L';
          }
        }
      });
    });
    setGridScores(map);
  }, [selectedAreaId, activeLapso, currentLevel, levelStudents]);

  const handleCellChange = (studentId: string, indicatorId: string, value: any) => {
    setGridScores(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [indicatorId]: value
      }
    }));
  };

  const handleSaveAll = () => {
    const recordsToSave: Parameters<typeof bulkRecordEvaluations>[0] = [];

    levelStudents.forEach(stu => {
      const studentMap = gridScores[stu.id] || {};
      areaIndicators.forEach(ind => {
        const val = studentMap[ind.id];
        if (val !== undefined) {
          recordsToSave.push({
            studentId: stu.id,
            areaId: selectedAreaId,
            indicatorId: ind.id,
            moment: 'PROCESAL',
            lapso: activeLapso,
            scoreNumeric: currentLevel === 'MEDIA_GENERAL' ? Number(val) : undefined,
            scoreQualitative: currentLevel !== 'MEDIA_GENERAL' ? (val as QualitativeScore) : undefined,
            observations: `Registro procesal continuo - Lapso ${activeLapso}`,
            teacherId: 'docente-titular'
          });
        }
      });
    });

    bulkRecordEvaluations(recordsToSave);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handlePublishConfirm = (channels: NotificationDeliveryChannel[]) => {
    handleSaveAll();

    const channelLabels: Record<NotificationDeliveryChannel, string> = {
      PORTAL: 'Portal CBA',
      EMAIL: 'Correo',
      SMS_WHATSAPP: 'SMS/WhatsApp'
    };
    const channelsText = channels.map((c) => channelLabels[c]).join(', ');

    sendNotification({
      title: `Notas Publicadas • ${currentArea.name}`,
      message: `El docente ha cargado las notas del Lapso ${activeLapso} en ${currentArea.name} (${currentSection}). Notificación despachada a ${levelStudents.length} representantes y alumnos vía ${channelsText}.`,
      category: 'CALIFICACIONES',
      priority: 'ALTA',
      recipientRole: 'TODOS',
      studentName: currentSection,
      actionTab: currentLevel,
      actionSubTab: 'BOLETIN',
      deliveryChannels: channels
    });

    setPublishedAlert(
      `¡Calificaciones de ${currentArea.name} publicadas con éxito! Se notificó a ${levelStudents.length} representantes y alumnos vía ${channelsText}.`
    );
    setTimeout(() => setPublishedAlert(null), 6000);
  };

  // Helper to compute average for Media General
  const computeStudentAverage = (studentId: string): number => {
    const studentMap = gridScores[studentId] || {};
    const values = areaIndicators.map(ind => Number(studentMap[ind.id])).filter(v => !isNaN(v));
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round((sum / values.length) * 10) / 10;
  };

  const filteredStudents = levelStudents.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cedula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] dark:text-[#D4AF37] uppercase tracking-wider">
              Cuaderno Digital de Seguimiento
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] dark:text-white mt-1">
            Evaluación Procesal Continua ({currentLevel.replace('_', ' ')})
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Registro sistemático de indicadores en tiempo real con cálculo ponderado y notificación automática a familias.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-all border border-transparent dark:border-slate-700"
            title="Guardar cambios localmente"
          >
            <Save className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            Guardar Borrador
          </button>

          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2C2E53] hover:bg-[#1B1C33] dark:bg-[#1A1D36] dark:hover:bg-[#131528] text-[#D4AF37] font-black rounded-xl text-xs shadow-md hover:shadow-lg transition-all border border-[#D4AF37]/30 cursor-pointer"
            title="Publicar calificaciones y enviar notificación a padres y alumnos"
          >
            <Send className="w-4 h-4 text-[#D4AF37]" />
            Publicar & Notificar a Familias
          </button>
        </div>
      </div>

      {publishedAlert && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 px-4 py-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Bell className="w-4 h-4" />
            </div>
            <span>{publishedAlert}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-emerald-200/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md text-emerald-900 dark:text-emerald-300 shrink-0 font-extrabold">
            Omnicanal Entregado
          </span>
        </div>
      )}

      {savedAlert && !publishedAlert && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Registros procesales guardados en borrador con éxito.
        </div>
      )}

      {/* Filter and Area Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="select-procesal-area" className="text-xs font-bold text-[#2C2E53] dark:text-slate-200">
            Área:
          </label>
          <select
            id="select-procesal-area"
            value={selectedAreaId}
            onChange={(e) => setSelectedAreaId(e.target.value)}
            aria-label="Seleccionar área de formación para evaluación procesal"
            className="w-full sm:w-72 px-3 py-2 bg-slate-50 dark:bg-[#1E2038] rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black text-[#2C2E53] dark:text-slate-100 focus:ring-2 focus:ring-[#2C2E53] dark:focus:ring-indigo-400"
          >
            {levelAreas.map(a => (
              <option key={a.id} value={a.id} className="bg-white dark:bg-[#1A1D36] text-slate-900 dark:text-slate-100">
                {a.name} ({a.code})
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar estudiante..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#1E2038] rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-[#2C2E53] dark:focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Gradebook Grid Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-cba-card overflow-hidden">
        <div className="p-4 bg-[#2C2E53] dark:bg-[#14162B] text-white flex items-center justify-between border-b border-transparent dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-extrabold text-xs tracking-wide">
              {currentArea?.name} • Sección {currentSection} • Lapso {activeLapso}
            </span>
          </div>
          <span className="text-[11px] text-slate-300">
            {areaIndicators.length} Indicadores Activos en el Lapso
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase font-black tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 sticky left-0 bg-slate-50 dark:bg-slate-800 z-10 w-60">Estudiante</th>
                {areaIndicators.map(ind => (
                  <th key={ind.id} className="py-3 px-3 text-center min-w-[130px]" title={ind.description}>
                    <span className="block font-black text-[#2C2E53] dark:text-amber-300">{ind.code}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-400 font-semibold truncate block max-w-[120px]">
                      {ind.description.slice(0, 30)}...
                    </span>
                    {ind.weight && (
                      <span className="text-[9px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1 py-0.2 rounded font-extrabold border border-transparent dark:border-amber-700/50">
                        {ind.weight}%
                      </span>
                    )}
                  </th>
                ))}
                {currentLevel === 'MEDIA_GENERAL' && (
                  <th className="py-3 px-4 text-center font-black text-[#2C2E53] dark:text-white bg-amber-50/70 dark:bg-amber-950/30 min-w-[90px]">
                    Promedio Procesal
                  </th>
                )}
                <th className="py-3 px-4 text-center min-w-[120px]">Acciones Pedagógicas</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {filteredStudents.map((stu) => {
                const studentScores = gridScores[stu.id] || {};
                const avg = computeStudentAverage(stu.id);
                const isUnderperforming = currentLevel === 'MEDIA_GENERAL' && avg < 10;

                return (
                  <tr
                    key={stu.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                      isUnderperforming ? 'bg-red-50/30 dark:bg-red-950/20' : ''
                    }`}
                  >
                    {/* Student Info Cell */}
                    <td className="py-3 px-4 sticky left-0 bg-white dark:bg-slate-900 z-10 border-r border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#2C2E53] text-[#D4AF37] font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
                          {stu.avatarUrl ? (
                            <img src={stu.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            stu.fullName.charAt(0)
                          )}
                        </div>
                        <div className="truncate">
                          <span className="font-extrabold text-[#2C2E53] dark:text-slate-100 block text-xs truncate">
                            {stu.fullName}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">{stu.cedula}</span>
                        </div>
                      </div>
                    </td>

                    {/* Indicator Cells */}
                    {areaIndicators.map((ind) => {
                      const val = studentScores[ind.id];

                      return (
                        <td key={ind.id} className="py-2 px-3 text-center">
                          {currentLevel === 'MEDIA_GENERAL' ? (
                            <input
                              type="number"
                              min={1}
                              max={20}
                              value={val ?? ''}
                              onChange={(e) =>
                                handleCellChange(stu.id, ind.id, Number(e.target.value))
                              }
                              aria-label={`Calificación de ${stu.fullName} en ${ind.code}`}
                              className={`w-14 p-1 text-center font-black rounded-lg border text-xs focus:ring-2 focus:ring-[#2C2E53] ${
                                Number(val) >= 16
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : Number(val) >= 10
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : 'bg-red-50 text-red-800 border-red-300 font-black'
                              }`}
                            />
                          ) : (
                            <select
                              value={val || 'L'}
                              onChange={(e) => handleCellChange(stu.id, ind.id, e.target.value)}
                              aria-label={`Valoración cualitativa de ${stu.fullName} en ${ind.code}`}
                              className="p-1 text-xs font-black rounded-lg bg-slate-50 border border-slate-200 text-[#2C2E53]"
                            >
                              <option value="L">L (Logrado)</option>
                              <option value="EP">EP (En Proceso)</option>
                              <option value="I">I (Iniciado)</option>
                            </select>
                          )}
                        </td>
                      );
                    })}

                    {/* Media General Weighted Average */}
                    {currentLevel === 'MEDIA_GENERAL' && (
                      <td className="py-2 px-4 text-center bg-amber-50/40">
                        <span
                          className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                            avg >= 16
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : avg >= 10
                              ? 'bg-blue-100 text-blue-900 border-blue-300'
                              : 'bg-red-100 text-red-900 border-red-300 animate-pulse'
                          }`}
                        >
                          {avg} / 20
                        </span>
                      </td>
                    )}

                    {/* Actions Cell */}
                    <td className="py-2 px-4 text-center">
                      {isUnderperforming ? (
                        <button
                          onClick={() => {
                            generateAIActionPlan(stu.id, selectedAreaId);
                            setGeneratedStudentId(stu.id);
                            if (onNavigateToAI) onNavigateToAI();
                          }}
                          className="flex items-center justify-center gap-1 w-full px-2.5 py-1 text-[11px] font-extrabold bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-lg shadow-sm hover:opacity-95 transition-all"
                          title="Generar plan de refuerzo remedial con Inteligencia Artificial"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          Plan IA
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          En norma
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

      {/* Publish & Omnichannel Dispatch Modal */}
      <PublishGradesModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={handlePublishConfirm}
        areaName={currentArea?.name || 'Asignatura'}
        lapso={activeLapso}
        studentCount={levelStudents.length}
        gradeSection={currentSection}
      />
    </div>
  );
};
