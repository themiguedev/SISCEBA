import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Competency } from '../../types';
import {
  Plus,
  ArrowRightLeft,
  Search,
  BookOpen,
  Filter,
  CheckCircle,
  X,
  Layers,
  Sparkles
} from 'lucide-react';

export const CompetenciesBank: React.FC = () => {
  const {
    levelAreas,
    competencies,
    currentLevel,
    activeLapso,
    addCompetency,
    transferCompetency
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [transferTargetComp, setTransferTargetComp] = useState<Competency | null>(null);
  const [transferLapso, setTransferLapso] = useState<1 | 2 | 3>(activeLapso === 1 ? 2 : 3);

  // Form State
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAreaId, setNewAreaId] = useState(levelAreas[0]?.id || '');
  const [newLapso, setNewLapso] = useState<1 | 2 | 3>(activeLapso);

  // Filter competencies by level, area, search
  const levelCompetencies = competencies.filter(c => c.level === currentLevel);
  const filteredCompetencies = levelCompetencies.filter(c => {
    const matchesArea = selectedAreaId === 'ALL' || c.areaId === selectedAreaId;
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesArea && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newTitle || !newDescription || !newAreaId) return;

    addCompetency({
      areaId: newAreaId,
      code: newCode.trim(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      level: currentLevel,
      lapso: newLapso
    });

    // Reset & close
    setNewCode('');
    setNewTitle('');
    setNewDescription('');
    setIsCreateModalOpen(false);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTargetComp) return;
    transferCompetency(transferTargetComp.id, transferLapso);
    setTransferTargetComp(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] uppercase tracking-wider">
              Banco Curricular Oficial
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] mt-1">
            Banco de Competencias ({currentLevel.replace('_', ' ')})
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Repositorio central de competencias pedagógicas con capacidad de registro ágil y transferencia inter-períodos.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#c29f2e] text-[#1B1C33] font-extrabold rounded-xl shadow-cba-gold transition-all"
        >
          <Plus className="w-4 h-4" />
          Nueva Competencia
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código, título o descripción..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="select-area-filter" className="text-xs font-bold text-slate-500 hidden sm:inline">
            Área:
          </label>
          <select
            id="select-area-filter"
            value={selectedAreaId}
            onChange={(e) => setSelectedAreaId(e.target.value)}
            aria-label="Filtrar competencias por área de formación"
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

      {/* Competencies Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCompetencies.map((comp) => {
          const area = levelAreas.find(a => a.id === comp.areaId);

          return (
            <div
              key={comp.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-[#2C2E53] text-[#D4AF37]">
                      {comp.code}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      Lapso {comp.lapso}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[150px]">
                    {area?.name}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#2C2E53] mt-1">{comp.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{comp.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Colegio Bellas Artes
                </span>

                <button
                  onClick={() => setTransferTargetComp(comp)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#2C2E53] bg-slate-100 hover:bg-[#2C2E53] hover:text-[#D4AF37] rounded-lg transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  Transferir
                </button>
              </div>
            </div>
          );
        })}

        {filteredCompetencies.length === 0 && (
          <div className="col-span-2 p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-medium">No se encontraron competencias registradas.</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-3 text-xs font-bold text-[#2C2E53] underline"
            >
              Registrar la primera competencia
            </button>
          </div>
        )}
      </div>

      {/* Modal: Create Competency */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-lg text-[#2C2E53]">Registrar Nueva Competencia</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
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
                  onChange={(e) => setNewAreaId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
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
                    Código de Competencia *
                  </label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="Ej. CP-MED-05"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lapso Académico *
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
                  Título de la Competencia *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Análisis Crítico de Textos Literarios"
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción Pedagógica *
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe la competencia integral y los desempeños esperados..."
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  required
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
                  Guardar en Banco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Transfer Competency */}
      {transferTargetComp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-lg text-[#2C2E53] flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#D4AF37]" />
                Transferir Competencia
              </h3>
              <button
                onClick={() => setTransferTargetComp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-[#2C2E53] bg-[#D4AF37]/20 px-2 py-0.5 rounded">
                  {transferTargetComp.code}
                </span>
                <p className="font-bold text-xs text-slate-800 mt-1">
                  {transferTargetComp.title}
                </p>
                <span className="text-[11px] text-slate-500">Lapso de Origen: Lapso {transferTargetComp.lapso}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Transferir o Replicar hacia Lapso *
                </label>
                <select
                  value={transferLapso}
                  onChange={(e) => setTransferLapso(Number(e.target.value) as 1 | 2 | 3)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                >
                  <option value={1} disabled={transferTargetComp.lapso === 1}>1er Lapso</option>
                  <option value={2} disabled={transferTargetComp.lapso === 2}>2do Lapso</option>
                  <option value={3} disabled={transferTargetComp.lapso === 3}>3er Lapso</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  La competencia se clonará con la nomenclatura curricular adaptada para el nuevo período pedagógico.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTransferTargetComp(null)}
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
