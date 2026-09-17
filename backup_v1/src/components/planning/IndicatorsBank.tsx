import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Indicator } from '../../types';
import {
  Plus,
  ArrowRightLeft,
  Search,
  Tag,
  CheckCircle2,
  X,
  Layers,
  Scale
} from 'lucide-react';

export const IndicatorsBank: React.FC = () => {
  const {
    levelAreas,
    competencies,
    indicators,
    currentLevel,
    activeLapso,
    addIndicator,
    transferIndicator
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [transferTargetInd, setTransferTargetInd] = useState<Indicator | null>(null);
  const [transferLapso, setTransferLapso] = useState<1 | 2 | 3>(activeLapso === 1 ? 2 : 3);

  // Form State
  const [newAreaId, setNewAreaId] = useState(levelAreas[0]?.id || '');
  const [newCompetencyId, setNewCompetencyId] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newWeight, setNewWeight] = useState<number>(20);
  const [newInstrument, setNewInstrument] = useState('Escala de Estimación');
  const [newLapso, setNewLapso] = useState<1 | 2 | 3>(activeLapso);

  // Filter available competencies based on selected area in form
  const availableCompetenciesForForm = competencies.filter(
    c => c.areaId === newAreaId && c.level === currentLevel
  );

  const levelIndicators = indicators.filter(i => i.level === currentLevel);
  const filteredIndicators = levelIndicators.filter(ind => {
    const matchesArea = selectedAreaId === 'ALL' || ind.areaId === selectedAreaId;
    const matchesSearch =
      ind.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ind.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ind.evaluationInstrument && ind.evaluationInstrument.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesArea && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newDescription || !newAreaId) return;

    addIndicator({
      areaId: newAreaId,
      competencyId: newCompetencyId || availableCompetenciesForForm[0]?.id || '',
      code: newCode.trim(),
      description: newDescription.trim(),
      level: currentLevel,
      lapso: newLapso,
      weight: currentLevel === 'MEDIA_GENERAL' ? newWeight : undefined,
      evaluationInstrument: newInstrument
    });

    setNewCode('');
    setNewDescription('');
    setIsCreateModalOpen(false);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTargetInd) return;
    transferIndicator(transferTargetInd.id, transferLapso);
    setTransferTargetInd(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] uppercase tracking-wider">
              Evaluación y Seguimiento
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] mt-1">
            Banco de Indicadores de Logro ({currentLevel.replace('_', ' ')})
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Criterios observables de evaluación formativa y sumativa, ponderación y vinculación curricular.
          </p>
        </div>

        <button
          onClick={() => {
            setNewCompetencyId(availableCompetenciesForForm[0]?.id || '');
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#c29f2e] text-[#1B1C33] font-extrabold rounded-xl shadow-cba-gold transition-all"
        >
          <Plus className="w-4 h-4" />
          Nuevo Indicador
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código, criterio o instrumento..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="select-ind-area-filter" className="text-xs font-bold text-slate-500 hidden sm:inline">
            Área:
          </label>
          <select
            id="select-ind-area-filter"
            value={selectedAreaId}
            onChange={(e) => setSelectedAreaId(e.target.value)}
            aria-label="Filtrar indicadores por área de formación"
            className="w-full sm:w-64 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
          >
            <option value="ALL">Todas las áreas ({levelAreas.length})</option>
            {levelAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name} ({area.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List of Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIndicators.map((ind) => {
          const area = levelAreas.find(a => a.id === ind.areaId);
          const comp = competencies.find(c => c.id === ind.competencyId);

          return (
            <div
              key={ind.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-[#2C2E53] text-[#D4AF37]">
                      {ind.code}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      Lapso {ind.lapso}
                    </span>
                    {ind.weight && (
                      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Scale className="w-3 h-3 text-[#D4AF37]" />
                        {ind.weight}%
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[140px]">
                    {area?.name}
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-800 mt-2 leading-relaxed">
                  {ind.description}
                </p>

                {comp && (
                  <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-[#D4AF37] shrink-0" />
                    <span className="truncate">Comp: {comp.code} - {comp.title}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 bg-blue-50/50 px-2 py-0.5 rounded text-blue-900">
                  {ind.evaluationInstrument || 'Observación Sistemática'}
                </span>

                <button
                  onClick={() => setTransferTargetInd(ind)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#2C2E53] bg-slate-100 hover:bg-[#2C2E53] hover:text-[#D4AF37] rounded-lg transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  Transferir
                </button>
              </div>
            </div>
          );
        })}

        {filteredIndicators.length === 0 && (
          <div className="col-span-2 p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-medium">No se encontraron indicadores registrados.</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-3 text-xs font-bold text-[#2C2E53] underline"
            >
              Registrar el primer indicador
            </button>
          </div>
        )}
      </div>

      {/* Modal: Create Indicator */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-lg text-[#2C2E53]">Registrar Nuevo Indicador</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Área de Formación *
                </label>
                <select
                  value={newAreaId}
                  onChange={(e) => {
                    setNewAreaId(e.target.value);
                    const matching = competencies.filter(c => c.areaId === e.target.value);
                    setNewCompetencyId(matching[0]?.id || '');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  required
                >
                  {levelAreas.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Competencia Vinculada
                </label>
                <select
                  value={newCompetencyId}
                  onChange={(e) => setNewCompetencyId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                >
                  {availableCompetenciesForForm.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                  ))}
                  {availableCompetenciesForForm.length === 0 && (
                    <option value="">(Sin competencia asociada aún)</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Código de Indicador *
                  </label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="Ej. IND-MED-1.3"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lapso *
                  </label>
                  <select
                    value={newLapso}
                    onChange={(e) => setNewLapso(Number(e.target.value) as 1 | 2 | 3)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  >
                    <option value={1}>1er Lapso</option>
                    <option value={2}>2do Lapso</option>
                    <option value={3}>3er Lapso</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción del Indicador Observable *
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe la conducta observable y el criterio pedagógico..."
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Instrumento de Evaluación
                  </label>
                  <select
                    value={newInstrument}
                    onChange={(e) => setNewInstrument(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  >
                    <option value="Escala de Estimación">Escala de Estimación</option>
                    <option value="Rúbrica Analítica">Rúbrica Analítica</option>
                    <option value="Prueba Escrita Individual">Prueba Escrita Individual</option>
                    <option value="Registro Anecdótico">Registro Anecdótico</option>
                    <option value="Defensa de Proyecto STEAM">Defensa de Proyecto STEAM</option>
                    <option value="Lista de Cotejo">Lista de Cotejo</option>
                  </select>
                </div>

                {currentLevel === 'MEDIA_GENERAL' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ponderación (% Lapso)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={newWeight}
                      onChange={(e) => setNewWeight(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black bg-[#2C2E53] text-[#D4AF37] hover:bg-[#232543] rounded-xl shadow-md"
                >
                  Guardar Indicador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Transfer Indicator */}
      {transferTargetInd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-lg text-[#2C2E53] flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#D4AF37]" />
                Transferir Indicador
              </h3>
              <button
                onClick={() => setTransferTargetInd(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-[#2C2E53] bg-[#D4AF37]/20 px-2 py-0.5 rounded">
                  {transferTargetInd.code}
                </span>
                <p className="font-bold text-xs text-slate-800 mt-1">
                  {transferTargetInd.description}
                </p>
                <span className="text-[11px] text-slate-500">Lapso Origen: Lapso {transferTargetInd.lapso}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Transferir o Reforzar en Lapso *
                </label>
                <select
                  value={transferLapso}
                  onChange={(e) => setTransferLapso(Number(e.target.value) as 1 | 2 | 3)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                >
                  <option value={1} disabled={transferTargetInd.lapso === 1}>1er Lapso</option>
                  <option value={2} disabled={transferTargetInd.lapso === 2}>2do Lapso</option>
                  <option value={3} disabled={transferTargetInd.lapso === 3}>3er Lapso</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  El indicador se transferirá manteniendo las especificaciones técnicas adaptadas para el lapso de destino.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTransferTargetInd(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black bg-[#D4AF37] text-[#1B1C33] hover:bg-[#c29f2e] rounded-xl shadow-cba-gold"
                >
                  Confirmar Transferencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
