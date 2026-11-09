import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BulletinObservationTemplate, ObservationCategory } from '../../types';
import {
  MessageSquare,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  Filter,
  X,
  Sparkles,
  BookOpen,
  Award,
  HeartHandshake,
  Layers
} from 'lucide-react';

const CATEGORY_METADATA: Record<ObservationCategory, { label: string; icon: any; color: string }> = {
  RENDIMIENTO: {
    label: 'Rendimiento Académico',
    icon: Award,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
  },
  ACTITUD: {
    label: 'Actitud y Hábitos',
    icon: Sparkles,
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
  },
  CONVIVENCIA: {
    label: 'Convivencia y Valores',
    icon: HeartHandshake,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
  },
  RECOMENDACION: {
    label: 'Recomendaciones al Hogar',
    icon: BookOpen,
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
  }
};

export const ObservacionesBoletinMediaView: React.FC = () => {
  const { observationTemplates, saveObservationTemplate, deleteObservationTemplate } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<BulletinObservationTemplate | null>(null);
  const [formData, setFormData] = useState<Partial<BulletinObservationTemplate>>({
    level: 'MEDIA_GENERAL',
    category: 'RENDIMIENTO',
    code: '',
    text: ''
  });

  // Filtrar plantillas de Media General
  const templates = useMemo(() => {
    return (observationTemplates || []).filter(t => t.level === 'MEDIA_GENERAL');
  }, [observationTemplates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchCat = selectedCategory === 'TODAS' || t.category === selectedCategory;
      const matchSearch =
        t.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.code.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [templates, selectedCategory, searchTerm]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenForm = (tpl?: BulletinObservationTemplate) => {
    if (tpl) {
      setEditingTemplate(tpl);
      setFormData(tpl);
    } else {
      setEditingTemplate(null);
      setFormData({
        level: 'MEDIA_GENERAL',
        category: 'RENDIMIENTO',
        code: `OBS-MG-${templates.length + 1}`,
        text: ''
      });
    }
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text || !formData.code) return;

    const record: BulletinObservationTemplate = {
      id: editingTemplate ? editingTemplate.id : `obs-mg-${Date.now()}`,
      level: 'MEDIA_GENERAL',
      category: formData.category || 'RENDIMIENTO',
      code: formData.code.trim().toUpperCase(),
      title: formData.code.trim().toUpperCase(),
      text: formData.text.trim(),
      active: true
    };

    await saveObservationTemplate(record);
    setIsFormOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Desea eliminar esta observación del catálogo oficial?')) {
      await deleteObservationTemplate(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Principal Informativo CBA (Diseño Oficial de Referencia) */}
      <div className="bg-gradient-to-r from-[#2C2E53] via-[#1E2038] to-[#141525] rounded-2xl p-5 sm:p-6 text-white shadow-md border border-[#3D4066] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#0F1122]/90 text-amber-300 border border-[#D4AF37] shadow-xs">
              Control Curricular Oficial
            </span>
            <span className="text-xs text-amber-200/90 font-medium">
              Educación Media General • C.E.O. SISCEBA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-white" />
            Observaciones al Boletín
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Catálogo institucional de apreciaciones descriptivas, recomendaciones pedagógicas y observaciones para boletines de Media General.
          </p>
        </div>

        {/* Resumen de catálogo activo */}
        <div className="flex items-center gap-2 bg-white/10 dark:bg-black/30 border border-white/15 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-100 shrink-0">
          <Layers className="w-4 h-4 text-amber-300" />
          <span>
            {templates.length} Plantillas • Media General • 2026-2027
          </span>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('TODAS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'TODAS'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Todas ({templates.length})
          </button>
          {(['RENDIMIENTO', 'ACTITUD', 'CONVIVENCIA', 'RECOMENDACION'] as ObservationCategory[]).map(cat => {
            const count = templates.filter(t => t.category === cat).length;
            const meta = CATEGORY_METADATA[cat];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-[#2C2E53] text-[#D4AF37] shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>{meta.label}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Búsqueda y Botón Nueva Observación */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar en el catálogo..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <button
            onClick={() => handleOpenForm()}
            className="px-4 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Observación</span>
          </button>
        </div>
      </div>

      {/* Catálogo de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(tpl => {
          const meta = CATEGORY_METADATA[tpl.category] || CATEGORY_METADATA.RENDIMIENTO;
          const CategoryIcon = meta.icon;

          return (
            <div
              key={tpl.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-sm transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${meta.color}`}>
                    <CategoryIcon className="w-3 h-3" />
                    <span>{meta.label}</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {tpl.code}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed italic">
                  "{tpl.text}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleCopy(tpl.text, tpl.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-600 hover:text-[#2C2E53] dark:text-slate-300 dark:hover:text-[#D4AF37] hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {copiedId === tpl.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copiada</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenForm(tpl)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(tpl.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Formulario */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                <span>{editingTemplate ? 'Editar Observación' : 'Nueva Observación Oficial'}</span>
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as ObservationCategory })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="RENDIMIENTO">Rendimiento Académico</option>
                  <option value="ACTITUD">Actitud y Hábitos</option>
                  <option value="CONVIVENCIA">Convivencia y Valores</option>
                  <option value="RECOMENDACION">Recomendaciones al Hogar</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Código Identificador
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ej: OBS-MG-01"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Texto de la Apreciación
                </label>
                <textarea
                  rows={4}
                  value={formData.text}
                  onChange={e => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Redacte la apreciación cualitativa para el boletín..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] rounded-xl font-black transition shadow-xs"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
