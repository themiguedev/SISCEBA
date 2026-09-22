import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlanLapso, LapsoEvaluationItem, PlanStatus } from '../../types';
import { canApprovePlans } from '../../utils/rbac';
import {
  CalendarDays,
  Scale,
  CheckCircle2,
  FileEdit,
  Send,
  Plus,
  Trash2,
  FileCheck,
  Printer,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export const PlanLapsoView: React.FC = () => {
  const {
    levelAreas,
    indicators,
    plansLapso,
    currentLevel,
    currentRole,
    activeLapso,
    currentSection,
    savePlanLapso,
    updateLapsoPlanStatus
  } = useApp();

  const levelPlans = plansLapso.filter(p => p.level === currentLevel);
  const [selectedAreaId, setSelectedAreaId] = useState<string>(levelAreas[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);

  // Find plan for selected area and active lapso, or initialize one
  let activePlan = levelPlans.find(
    p => p.areaId === selectedAreaId && p.lapso === activeLapso
  );

  const currentArea = levelAreas.find(a => a.id === selectedAreaId) || levelAreas[0];

  // If none exists, create local draft state
  const [draftItems, setDraftItems] = useState<LapsoEvaluationItem[]>(
    activePlan ? activePlan.items : []
  );
  const [generalObjective, setGeneralObjective] = useState(
    activePlan ? activePlan.generalObjective : 'Desarrollo de competencias curriculares del lapso.'
  );

  React.useEffect(() => {
    if (activePlan) {
      setDraftItems(activePlan.items);
      setGeneralObjective(activePlan.generalObjective);
    } else {
      // Default template
      setDraftItems([
        {
          id: `li-${Date.now()}-1`,
          title: 'Prueba Escrita Teórico-Práctica',
          indicatorId: '',
          weightPercent: 30,
          instrument: 'Prueba Escrita Individual',
          scheduledDate: '2026-10-25',
          status: 'PENDIENTE'
        },
        {
          id: `li-${Date.now()}-2`,
          title: 'Taller / Laboratorio Aplicado',
          indicatorId: '',
          weightPercent: 30,
          instrument: 'Rúbrica de Práctica',
          scheduledDate: '2026-11-15',
          status: 'PENDIENTE'
        },
        {
          id: `li-${Date.now()}-3`,
          title: 'Proyecto Integrador STEAM Bellas Artes',
          indicatorId: '',
          weightPercent: 20,
          instrument: 'Demostración y Exposición',
          scheduledDate: '2026-12-01',
          status: 'PENDIENTE'
        },
        {
          id: `li-${Date.now()}-4`,
          title: 'Evaluación Procesal Continua',
          indicatorId: '',
          weightPercent: 20,
          instrument: 'Registro de Desempeño',
          scheduledDate: '2026-12-10',
          status: 'PENDIENTE'
        }
      ]);
    }
  }, [selectedAreaId, activeLapso, activePlan]);

  const totalWeight = draftItems.reduce((acc, it) => acc + (it.weightPercent || 0), 0);

  const handleAddItem = () => {
    const newItem: LapsoEvaluationItem = {
      id: `li-${Date.now()}`,
      title: 'Nueva Actividad de Evaluación',
      indicatorId: '',
      weightPercent: 20,
      instrument: 'Escala de Estimación',
      scheduledDate: '2026-11-20',
      status: 'PENDIENTE'
    };
    setDraftItems([...draftItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setDraftItems(draftItems.filter(i => i.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof LapsoEvaluationItem, val: any) => {
    setDraftItems(
      draftItems.map(item => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleSavePlan = () => {
    const planToSave: PlanLapso = {
      id: activePlan ? activePlan.id : `pl-${Date.now()}`,
      areaId: selectedAreaId,
      level: currentLevel,
      gradeSection: currentSection,
      lapso: activeLapso,
      status: activePlan ? activePlan.status : 'BORRADOR',
      generalObjective,
      items: draftItems,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    savePlanLapso(planToSave);
    setIsEditing(false);
  };

  const areaIndicators = indicators.filter(i => i.areaId === selectedAreaId && i.level === currentLevel);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] uppercase tracking-wider">
              Programación Integral de Lapso
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] mt-1">
            Plan de Lapso {activeLapso} ({currentLevel.replace('_', ' ')})
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Matriz de actividades evaluativas, ponderaciones porcentuales (100%), instrumentos y fechas de aplicación.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="select-lapso-area" className="sr-only">
            Seleccionar área de formación
          </label>
          <select
            id="select-lapso-area"
            value={selectedAreaId}
            onChange={(e) => {
              setSelectedAreaId(e.target.value);
              setIsEditing(false);
            }}
            aria-label="Seleccionar área de formación"
            className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-[#2C2E53] focus:ring-2 focus:ring-[#2C2E53]"
          >
            {levelAreas.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.code})</option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            title="Imprimir Plan de Lapso"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Plan Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden">
        {/* Top Action Header */}
        <div className="bg-[#2C2E53] px-6 py-4 text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#2C2E53] font-black flex items-center justify-center">
              L{activeLapso}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  Plan de Lapso: {currentArea?.name}
                </h3>
                <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  activePlan?.status === 'DEFINITIVO'
                    ? 'bg-emerald-500 text-white'
                    : activePlan?.status === 'A_REVISION'
                    ? 'bg-[#D4AF37] text-[#2C2E53]'
                    : 'bg-slate-600 text-slate-200'
                }`}>
                  {activePlan?.status === 'DEFINITIVO' ? 'MODELO DEFINITIVO' : activePlan?.status === 'A_REVISION' ? 'EN REVISIÓN' : 'BORRADOR'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Sección: {currentSection} • Ponderación Total: <strong className={totalWeight === 100 ? 'text-emerald-300 font-black' : 'text-amber-300 font-black'}>{totalWeight}% / 100%</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  Editar Plan
                </button>

                {(!activePlan || activePlan.status === 'BORRADOR') && (
                  <button
                    onClick={() => {
                      handleSavePlan();
                      if (activePlan) updateLapsoPlanStatus(activePlan.id, 'A_REVISION');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D4AF37] text-[#2C2E53] font-black rounded-xl text-xs shadow-cba-gold hover:bg-[#c29f2e] transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Enviar a Coordinación
                  </button>
                )}

                {activePlan?.status === 'A_REVISION' && canApprovePlans(currentRole) && (
                  <button
                    onClick={() => updateLapsoPlanStatus(activePlan.id, 'DEFINITIVO')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-xs shadow-md transition-all"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    Aprobar Definitivo
                  </button>
                )}

                {activePlan?.status === 'DEFINITIVO' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" /> Aprobado Oficialmente
                  </span>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSavePlan}
                  className="px-4 py-1.5 bg-[#D4AF37] text-[#2C2E53] font-black rounded-xl text-xs shadow-cba-gold hover:bg-[#c29f2e] transition-all"
                >
                  Guardar Plan de Lapso
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Objective Section */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Propósito General del Lapso Académico
          </label>
          {isEditing ? (
            <textarea
              rows={2}
              value={generalObjective}
              onChange={(e) => setGeneralObjective(e.target.value)}
              className="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#2C2E53]"
            />
          ) : (
            <p className="text-xs text-slate-800 font-semibold leading-relaxed">
              {generalObjective}
            </p>
          )}
        </div>

        {/* Weight Warning if not 100% */}
        {totalWeight !== 100 && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-2 text-xs font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Atención: La sumatoria de ponderaciones es {totalWeight}%. Debe totalizar exactamente 100% según la normativa de Bellas Artes.
          </div>
        )}

        {/* Evaluation Activities Table */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-extrabold text-sm text-[#2C2E53] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#D4AF37]" />
              Cronograma y Matriz de Evaluaciones
            </h4>

            {isEditing && (
              <button
                onClick={handleAddItem}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#2C2E53] font-bold rounded-lg text-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Actividad
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-black tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3 rounded-l-lg">#</th>
                  <th className="py-3 px-3">Estrategia / Actividad de Evaluación</th>
                  <th className="py-3 px-3">Indicador Clave</th>
                  <th className="py-3 px-3 text-center">Instrumento</th>
                  <th className="py-3 px-3 text-center">Fecha Estimada</th>
                  <th className="py-3 px-3 text-center">Peso (%)</th>
                  <th className="py-3 px-3 text-center rounded-r-lg">Estado</th>
                  {isEditing && <th className="py-3 px-2 text-center"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {draftItems.map((item, idx) => {
                  const linkedInd = areaIndicators.find(i => i.id === item.indicatorId);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-bold text-[#2C2E53]">{idx + 1}</td>
                      <td className="py-3 px-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                          />
                        ) : (
                          <span className="font-bold text-slate-800">{item.title}</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {isEditing ? (
                          <select
                            value={item.indicatorId}
                            onChange={(e) => handleUpdateItem(item.id, 'indicatorId', e.target.value)}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                          >
                            <option value="">Seleccionar indicador...</option>
                            {areaIndicators.map(ind => (
                              <option key={ind.id} value={ind.id}>{ind.code} - {ind.description.slice(0, 40)}...</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-[11px] text-slate-500">
                            {linkedInd ? `${linkedInd.code}` : '(Vinculación abierta)'}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {isEditing ? (
                          <input
                            type="text"
                            value={item.instrument}
                            onChange={(e) => handleUpdateItem(item.id, 'instrument', e.target.value)}
                            className="p-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-center"
                          />
                        ) : (
                          <span className="text-[11px] font-semibold bg-slate-100 px-2 py-0.5 rounded">
                            {item.instrument}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {isEditing ? (
                          <input
                            type="date"
                            value={item.scheduledDate}
                            onChange={(e) => handleUpdateItem(item.id, 'scheduledDate', e.target.value)}
                            className="p-1 bg-slate-50 border border-slate-200 rounded text-xs"
                          />
                        ) : (
                          <span className="text-slate-600 font-semibold">{item.scheduledDate}</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center font-extrabold">
                        {isEditing ? (
                          <input
                            type="number"
                            min={5}
                            max={100}
                            value={item.weightPercent}
                            onChange={(e) => handleUpdateItem(item.id, 'weightPercent', Number(e.target.value))}
                            className="w-16 p-1 bg-slate-50 border border-slate-200 rounded text-xs text-center font-black text-[#2C2E53]"
                          />
                        ) : (
                          <span className="text-xs font-black text-[#2C2E53] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {item.weightPercent}%
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'CALIFICADA'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'APLICADA'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>

                      {isEditing && (
                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
