import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { EducationalLevel, BulletinObservationTemplate, ObservationCategory, LEVEL_GRADES_CATALOG } from '../../../types';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  Search,
  Filter,
  X,
  Sparkles,
  BookOpen,
  Award,
  HeartHandshake
} from 'lucide-react';

interface ObservacionesBoletinModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLevel?: EducationalLevel;
}

const CATEGORY_METADATA: Record<ObservationCategory, { label: string; icon: any; color: string }> = {
  RENDIMIENTO: { label: 'Rendimiento Académico', icon: Award, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  ACTITUD: { label: 'Actitud y Hábitos', icon: Sparkles, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  CONVIVENCIA: { label: 'Convivencia y Valores', icon: HeartHandshake, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
  RECOMENDACION: { label: 'Recomendaciones al Hogar', icon: BookOpen, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' }
};

export const ObservacionesBoletinModal: React.FC<ObservacionesBoletinModalProps> = ({
  isOpen,
  onClose,
  initialLevel = 'INICIAL'
}) => {
  const { observationTemplates, saveObservationTemplate, deleteObservationTemplate } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<EducationalLevel>(initialLevel);
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<BulletinObservationTemplate | null>(null);
  const [formData, setFormData] = useState<Partial<BulletinObservationTemplate>>({
    level: initialLevel,
    category: 'RENDIMIENTO',
    code: '',
    title: '',
    text: '',
    grade: '',
    active: true
  });

  const levelTemplates = useMemo(() => {
    return (observationTemplates || []).filter(t => t.level === selectedLevel);
  }, [observationTemplates, selectedLevel]);

  const filteredTemplates = useMemo(() => {
    return levelTemplates.filter(t => {
      if (selectedCategory !== 'TODAS' && t.category !== selectedCategory) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const code = (t.code || '').toLowerCase();
        const title = (t.title || '').toLowerCase();
        const text = (t.text || '').toLowerCase();
        if (!code.includes(term) && !title.includes(term) && !text.includes(term)) return false;
      }
      return true;
    });
  }, [levelTemplates, selectedCategory, searchTerm]);

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setFormData({
      level: selectedLevel,
      category: 'RENDIMIENTO',
      code: `${selectedLevel.substring(0, 3)}-${Date.now().toString().slice(-4)}`,
      title: '',
      text: '',
      grade: '',
      active: true
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (template: BulletinObservationTemplate) => {
    setEditingTemplate(template);
    setFormData({ ...template });
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.text?.trim()) return;

    const templateToSave: BulletinObservationTemplate = {
      id: editingTemplate?.id || `obs-${Date.now()}`,
      level: selectedLevel,
      category: (formData.category as ObservationCategory) || 'RENDIMIENTO',
      code: formData.code?.trim() || `OBS-${Date.now().toString().slice(-4)}`,
      title: formData.title.trim(),
      text: formData.text.trim(),
      grade: formData.grade?.trim() || undefined,
      active: formData.active ?? true
    };

    await saveObservationTemplate(templateToSave);
    setIsFormOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro de eliminar esta observación predefinida?')) {
      await deleteObservationTemplate(id);
    }
  };

  const handleCopyText = (template: BulletinObservationTemplate) => {
    navigator.clipboard.writeText(template.text);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#2C2E53] p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl text-[#D4AF37] border border-white/10">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Banco Institucional de Observaciones para el Boletín
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#1B1C33] font-bold">
                  {selectedLevel.replace('_', ' ')}
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Frases predeterminadas por categorías para informes descriptivos y boletines informativos.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Level Selector */}
            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['INICIAL', 'PRIMARIA', 'MEDIA_GENERAL'] as EducationalLevel[]).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedLevel(lvl);
                    setSelectedCategory('TODAS');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedLevel === lvl
                      ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {lvl === 'MEDIA_GENERAL' ? 'Media General' : lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
            >
              <option value="TODAS">Todas las Categorías</option>
              <option value="RENDIMIENTO">Rendimiento Académico</option>
              <option value="ACTITUD">Actitud y Hábitos</option>
              <option value="CONVIVENCIA">Convivencia y Valores</option>
              <option value="RECOMENDACION">Recomendaciones al Hogar</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por palabra o código..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
              />
            </div>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#1B1C33] font-black text-xs rounded-xl shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              Nueva Observación
            </button>
          </div>
        </div>

        {/* Content Area / List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredTemplates.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-sm text-slate-600 dark:text-slate-300">
                No hay observaciones registradas para este filtro
              </p>
              <p className="text-xs">
                Puede registrar una nueva observación pulsando el botón superior.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map(template => {
                const catMeta = CATEGORY_METADATA[template.category] || CATEGORY_METADATA.RENDIMIENTO;
                const Icon = catMeta.icon;

                return (
                  <div
                    key={template.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${catMeta.color} flex items-center gap-1`}>
                            <Icon className="w-3 h-3" />
                            {catMeta.label}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-400">
                            {template.code}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyText(template)}
                            className="p-1.5 text-slate-400 hover:text-[#2C2E53] dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            title="Copiar texto de observación"
                          >
                            {copiedId === template.id ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleOpenEdit(template)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                            title="Editar observación"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(template.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 transition"
                            title="Eliminar observación"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-[#2C2E53] dark:text-slate-100 mb-1">
                        {template.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        "{template.text}"
                      </p>
                    </div>

                    {template.grade && (
                      <div className="mt-3 text-[10px] text-slate-400">
                        Aplicable preferente a: <strong className="text-slate-600 dark:text-slate-300">{template.grade}</strong>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal / Form Create/Edit */}
        {isFormOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
                  {editingTemplate ? 'Editar Observación Predefinida' : 'Nueva Observación para el Boletín'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value as ObservationCategory })}
                      className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                    >
                      <option value="RENDIMIENTO">Rendimiento Académico</option>
                      <option value="ACTITUD">Actitud y Hábitos</option>
                      <option value="CONVIVENCIA">Convivencia y Valores</option>
                      <option value="RECOMENDACION">Recomendaciones al Hogar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Código
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={e => setFormData({ ...formData, code: e.target.value })}
                      className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Título o Descriptor Corto
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Comprensión Lectora y Fluidez"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Redacción Oficial de la Observación
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Escriba la frase o recomendación..."
                    value={formData.text}
                    onChange={e => setFormData({ ...formData, text: e.target.value })}
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Grado o Sala Aplicable (Opcional)
                  </label>
                  <select
                    value={formData.grade || ''}
                    onChange={e => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  >
                    <option value="">Aplica a todos los grados del nivel</option>
                    {(LEVEL_GRADES_CATALOG[selectedLevel] || []).map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] rounded-xl text-xs font-black shadow-md"
                  >
                    Guardar Observación
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div>
            Total de observaciones activas: <strong>{levelTemplates.length}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition"
          >
            Cerrar Catálogo
          </button>
        </div>

      </div>
    </div>
  );
};
