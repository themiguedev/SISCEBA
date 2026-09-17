import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Strategy } from '../../types';
import {
  Plus,
  ArrowRightLeft,
  Search,
  BookOpen,
  CheckCircle,
  X,
  Lightbulb,
  ClipboardCheck,
  Layers,
  Sparkles
} from 'lucide-react';

export const StrategiesBank: React.FC = () => {
  const {
    levelAreas,
    strategies,
    currentLevel,
    addStrategy,
    transferStrategy
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeStrategyType, setActiveStrategyType] = useState<'ALL' | 'ENSENANZA' | 'EVALUACION'>('ALL');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('ALL');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [transferTargetStrat, setTransferTargetStrat] = useState<Strategy | null>(null);
  const [transferTargetAreaId, setTransferTargetAreaId] = useState<string>(levelAreas[1]?.id || levelAreas[0]?.id || '');

  // Form State
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'ENSENANZA' | 'EVALUACION'>('ENSENANZA');
  const [newCategory, setNewCategory] = useState('Desarrollo');
  const [newAreaId, setNewAreaId] = useState(levelAreas[0]?.id || '');
  const [newDescription, setNewDescription] = useState('');
  const [newResources, setNewResources] = useState('');

  const levelStrategies = strategies.filter(s => s.level === currentLevel);
  const filteredStrategies = levelStrategies.filter(strat => {
    const matchesType = activeStrategyType === 'ALL' || strat.type === activeStrategyType;
    const matchesArea = selectedAreaId === 'ALL' || strat.areaId === selectedAreaId;
    const matchesSearch =
      strat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strat.resources.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesArea && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDescription || !newAreaId) return;

    addStrategy({
      name: newName.trim(),
      type: newType,
      category: newCategory,
      areaId: newAreaId,
      description: newDescription.trim(),
      resources: newResources.trim() || 'Recursos convencionales de aula',
      level: currentLevel
    });

    setNewName('');
    setNewDescription('');
    setNewResources('');
    setIsCreateModalOpen(false);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTargetStrat || !transferTargetAreaId) return;
    transferStrategy(transferTargetStrat.id, transferTargetAreaId);
    setTransferTargetStrat(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] uppercase tracking-wider">
              Metodología y Didáctica
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] mt-1">
            Banco de Estrategias Pedagógicas ({currentLevel.replace('_', ' ')})
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Estrategias de enseñanza-aprendizaje y estrategias de evaluación con transferencia curricular entre áreas.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#c29f2e] text-[#1B1C33] font-extrabold rounded-xl shadow-cba-gold transition-all"
        >
          <Plus className="w-4 h-4" />
          Nueva Estrategia
        </button>
      </div>

      {/* Tabs Type, Search & Area Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Strategy Type Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto">
          <button
            onClick={() => setActiveStrategyType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeStrategyType === 'ALL'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({levelStrategies.length})
          </button>
          <button
            onClick={() => setActiveStrategyType('ENSENANZA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeStrategyType === 'ENSENANZA'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Enseñanza-Aprendizaje
          </button>
          <button
            onClick={() => setActiveStrategyType('EVALUACION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeStrategyType === 'EVALUACION'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            Evaluación
          </button>
        </div>

        {/* Search & Area Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar estrategia..."
              className="w-full pl-9 pr-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
            />
          </div>

          <label htmlFor="select-strat-area-filter" className="sr-only">
            Filtrar por área
          </label>
          <select
            id="select-strat-area-filter"
            value={selectedAreaId}
            onChange={(e) => setSelectedAreaId(e.target.value)}
            aria-label="Filtrar por área de formación"
            className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
          >
            <option value="ALL">Todas las áreas</option>
            {levelAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Strategies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStrategies.map((strat) => {
          const area = levelAreas.find(a => a.id === strat.areaId);
          const isEnsenanza = strat.type === 'ENSENANZA';

          return (
            <div
              key={strat.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                      isEnsenanza
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    }`}
                  >
                    {isEnsenanza ? <Lightbulb className="w-3 h-3 text-[#D4AF37]" /> : <ClipboardCheck className="w-3 h-3 text-emerald-600" />}
                    {isEnsenanza ? 'Enseñanza-Aprendizaje' : 'Estrategia de Evaluación'}
                  </span>

                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Fase: {strat.category}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#2C2E53] mt-1">{strat.name}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{strat.description}</p>

                <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <span className="font-bold text-[#2C2E53] block text-[11px] uppercase tracking-wider mb-0.5">
                    Recursos didácticos:
                  </span>
                  {strat.resources}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 truncate max-w-[200px]">
                  Área: {area?.name || 'Común'}
                </span>

                <button
                  onClick={() => {
                    setTransferTargetStrat(strat);
                    setTransferTargetAreaId(
                      levelAreas.find(a => a.id !== strat.areaId)?.id || levelAreas[0]?.id || ''
                    );
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#2C2E53] bg-slate-100 hover:bg-[#2C2E53] hover:text-[#D4AF37] rounded-lg transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  Transferir Área
                </button>
              </div>
            </div>
          );
        })}

        {filteredStrategies.length === 0 && (
          <div className="col-span-2 p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-medium">No se encontraron estrategias en esta categoría.</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-3 text-xs font-bold text-[#2C2E53] underline"
            >
              Registrar la primera estrategia
            </button>
          </div>
        )}
      </div>

      {/* Modal: Create Strategy */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-lg text-[#2C2E53]">Registrar Nueva Estrategia</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipo de Estrategia *
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'ENSENANZA' | 'EVALUACION')}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  >
                    <option value="ENSENANZA">Enseñanza - Aprendizaje</option>
                    <option value="EVALUACION">Estrategia de Evaluación</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Momento / Fase Didáctica *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  >
                    <option value="Inicio">Inicio / Activación</option>
                    <option value="Desarrollo">Desarrollo / Construcción</option>
                    <option value="Cierre">Cierre / Síntesis</option>
                    <option value="Investigación">Investigación STEAM</option>
                    <option value="Digital / Robótica">Digital / Robótica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Área de Formación *
                </label>
                <select
                  value={newAreaId}
                  onChange={(e) => setNewAreaId(e.target.value)}
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
                  Nombre de la Estrategia *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Debate Socrático con Rúbrica Rápida"
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción del Procedimiento *
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe la secuencia de actividades didácticas..."
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recursos y Materiales Necesarios
                </label>
                <input
                  type="text"
                  value={newResources}
                  onChange={(e) => setNewResources(e.target.value)}
                  placeholder="Ej. Tablets, sets de robótica, hojas de cotejo impresas"
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                />
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
                  Guardar Estrategia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Transfer Strategy */}
      {transferTargetStrat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-lg text-[#2C2E53] flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#D4AF37]" />
                Transferir Estrategia a Otra Área
              </h3>
              <button
                onClick={() => setTransferTargetStrat(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-[#2C2E53] bg-[#D4AF37]/20 px-2 py-0.5 rounded">
                  {transferTargetStrat.type === 'ENSENANZA' ? 'Enseñanza' : 'Evaluación'}
                </span>
                <p className="font-bold text-xs text-slate-800 mt-1">
                  {transferTargetStrat.name}
                </p>
                <span className="text-[11px] text-slate-500">
                  Área actual: {levelAreas.find(a => a.id === transferTargetStrat.areaId)?.name}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Área de Destino para Transferir *
                </label>
                <select
                  value={transferTargetAreaId}
                  onChange={(e) => setTransferTargetAreaId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  required
                >
                  {levelAreas.map(a => (
                    <option key={a.id} value={a.id} disabled={a.id === transferTargetStrat.areaId}>
                      {a.name} ({a.code})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  La estrategia didáctica se adaptará al banco curricular del área seleccionada.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTransferTargetStrat(null)}
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
