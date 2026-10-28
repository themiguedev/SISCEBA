import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { EducationalResource, ResourceCategory } from '../../types';
import {
  Boxes,
  Plus,
  Search,
  BookOpen,
  X,
  Filter,
  MapPin,
  Package,
  Layers,
  ArrowRightLeft,
  Sparkles,
  Dumbbell,
  Palette,
  TestTube,
  Laptop,
  CheckCircle2,
  Trash2
} from 'lucide-react';

const CATEGORY_METADATA: Record<ResourceCategory, { label: string; icon: any; color: string; badge: string }> = {
  DEPORTIVO_PSICOMOTOR: {
    label: 'Deportivo y Psicomotor',
    icon: Dumbbell,
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    badge: 'bg-amber-500 text-white'
  },
  MANIPULATIVO_CONCRETO: {
    label: 'Manipulativo y Concreto',
    icon: Boxes,
    color: 'bg-teal-100 text-teal-800 border-teal-300',
    badge: 'bg-teal-600 text-white'
  },
  ARTISTICO_PLASTICO: {
    label: 'Artístico y Plástico',
    icon: Palette,
    color: 'bg-pink-100 text-pink-800 border-pink-300',
    badge: 'bg-pink-600 text-white'
  },
  LABORATORIO_CIENTIFICO: {
    label: 'Laboratorio y Ciencias',
    icon: TestTube,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    badge: 'bg-indigo-600 text-white'
  },
  DIGITAL_TECNOLOGICO: {
    label: 'Digital y Tecnológico',
    icon: Laptop,
    color: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    badge: 'bg-cyan-600 text-white'
  },
  BIBLIOGRAFICO_IMPRESO: {
    label: 'Bibliográfico e Impreso',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    badge: 'bg-blue-600 text-white'
  },
  AUDIOVISUAL_MULTIMEDIA: {
    label: 'Audiovisual y Multimedia',
    icon: Sparkles,
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    badge: 'bg-purple-600 text-white'
  }
};

export const EducationalResourcesBank: React.FC = () => {
  const {
    levelAreas,
    areas,
    educationalResources,
    currentLevel,
    addEducationalResource,
    deleteEducationalResource,
    transferEducationalResource
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [transferTarget, setTransferTarget] = useState<EducationalResource | null>(null);
  const [transferAreaId, setTransferAreaId] = useState<string>(levelAreas[0]?.id || '');

  // Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ResourceCategory>('DEPORTIVO_PSICOMOTOR');
  const [newAreaId, setNewAreaId] = useState<string>(levelAreas[0]?.id || '');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('Depósito General CBA');
  const [newQuantity, setNewQuantity] = useState<number>(10);
  const [newReusable, setNewReusable] = useState(true);

  // Filtrado por nivel, área, categoría y texto
  const levelResources = educationalResources.filter(r => r.level === currentLevel);
  const filteredResources = levelResources.filter(res => {
    const matchesArea = selectedAreaId === 'ALL' || res.areaId === selectedAreaId;
    const matchesCat = selectedCategory === 'ALL' || res.category === selectedCategory;
    const matchesSearch =
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (res.description && res.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (res.location && res.location.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesArea && matchesCat && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addEducationalResource({
      name: newName.trim(),
      category: newCategory,
      areaId: newAreaId,
      level: currentLevel,
      description: newDescription.trim() || undefined,
      location: newLocation.trim() || undefined,
      quantity: Number(newQuantity) || 1,
      isReusable: newReusable
    });

    setNewName('');
    setNewDescription('');
    setIsCreateModalOpen(false);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTarget || !transferAreaId) return;
    transferEducationalResource(transferTarget.id, transferAreaId);
    setTransferTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#2C2E53]">
            Banco de Recursos y Materiales ({currentLevel.replace('_', ' ')})
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Catálogo precargado de balones, aros, materiales manipulativos, instrumentos de laboratorio y recursos para evitar la transcripción anual repetitiva.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#c29f2e] text-[#1B1C33] font-extrabold rounded-xl shadow-cba-gold transition-all"
        >
          <Plus className="w-4 h-4" />
          Nuevo Recurso Didáctico
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por material, balón, aro, instrumento o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Categoría Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl focus:ring-2 focus:ring-[#2C2E53] outline-none"
            >
              <option value="ALL">Todas las Categorías</option>
              {Object.entries(CATEGORY_METADATA).map(([catKey, meta]) => (
                <option key={catKey} value={catKey}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>

          {/* Área Filter */}
          <select
            value={selectedAreaId}
            onChange={(e) => setSelectedAreaId(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl focus:ring-2 focus:ring-[#2C2E53] outline-none max-w-[200px]"
          >
            <option value="ALL">Todas las Áreas</option>
            {levelAreas.map(area => (
              <option key={area.id} value={area.id}>{area.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Resources Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => {
          const areaObj = areas.find(a => a.id === res.areaId);
          const meta = CATEGORY_METADATA[res.category] || {
            label: res.category,
            icon: Package,
            color: 'bg-slate-100 text-slate-700 border-slate-300',
            badge: 'bg-slate-700 text-white'
          };
          const CatIcon = meta.icon;

          return (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Category Badge & Quantity */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${meta.color}`}>
                    <CatIcon className="w-3 h-3" />
                    {meta.label}
                  </span>
                  {res.quantity !== undefined && (
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {res.quantity} {res.quantity === 1 ? 'unidad' : 'unidades'}
                    </span>
                  )}
                </div>

                {/* Resource Title */}
                <h4 className="font-extrabold text-sm text-[#2C2E53] group-hover:text-blue-900 transition-colors">
                  {res.name}
                </h4>

                {/* Description */}
                {res.description && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {res.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                {/* Area & Location */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="font-bold text-slate-600 truncate max-w-[150px]">
                    {areaObj?.name || 'Recurso General'}
                  </span>
                  {res.location && (
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" />
                      {res.location}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      setTransferTarget(res);
                      setTransferAreaId(levelAreas[0]?.id || '');
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition"
                  >
                    <ArrowRightLeft className="w-3 h-3" />
                    Transferir Área
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar el recurso didáctico "${res.name}"?`)) {
                        deleteEducationalResource(res.id);
                      }
                    }}
                    className="p-1 text-slate-300 hover:text-red-500 rounded transition"
                    title="Eliminar recurso"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Boxes className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-black text-slate-700 text-sm">No se encontraron recursos didácticos</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            No hay recursos que coincidan con la búsqueda o filtro actual. Puede registrar un nuevo material o cargar los predeterminados.
          </p>
        </div>
      )}

      {/* CREATE MODAL */}
      {isCreateModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#2C2E53] text-[#D4AF37] flex items-center justify-center font-black">
                  <Boxes className="w-4 h-4" />
                </div>
                <h3 className="font-black text-base text-[#2C2E53]">
                  Registrar Nuevo Recurso Didáctico
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre del Recurso / Material:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Balones de fútbol sala Mikasa, Aros de psicomotricidad 60cm..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2C2E53] outline-none font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Categoría Didáctica:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ResourceCategory)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 font-bold focus:ring-2 focus:ring-[#2C2E53] outline-none"
                  >
                    {Object.entries(CATEGORY_METADATA).map(([catKey, meta]) => (
                      <option key={catKey} value={catKey}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Área de Formación:
                  </label>
                  <select
                    value={newAreaId}
                    onChange={(e) => setNewAreaId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 font-bold focus:ring-2 focus:ring-[#2C2E53] outline-none"
                  >
                    {levelAreas.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cantidad Disponible:
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-[#2C2E53] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ubicación / Depósito:
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Ej. Cancha Techada, Lab de Ciencias..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 font-medium focus:ring-2 focus:ring-[#2C2E53] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción pedagógica / Especificación:
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detalles de tamaño, material, uso recomendado en planificaciones..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 font-medium focus:ring-2 focus:ring-[#2C2E53] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C2E53] hover:bg-[#1E2A4A] text-[#D4AF37] font-extrabold text-xs rounded-xl shadow-md"
                >
                  Guardar en Banco Oficial
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* TRANSFER MODAL */}
      {transferTarget && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-black text-sm text-[#2C2E53] mb-2 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-blue-600" />
              Transferir Recurso a Otra Área
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Transfiriendo: <span className="font-bold text-slate-800">{transferTarget.name}</span>
            </p>

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Área de Destino:
                </label>
                <select
                  value={transferAreaId}
                  onChange={(e) => setTransferAreaId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-[#2C2E53]"
                >
                  {areas.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.level})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTransferTarget(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C2E53] text-[#D4AF37] font-extrabold text-xs rounded-xl shadow"
                >
                  Confirmar Transferencia
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
