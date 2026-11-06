import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BulletinObservationTemplate,
  ObservationCategory,
  LEVEL_GRADES_CATALOG
} from '../../types';
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
  HeartHandshake,
  Save,
  CheckCircle2
} from 'lucide-react';

const CATEGORY_METADATA: Record<ObservationCategory, { label: string; icon: any; color: string }> = {
  RENDIMIENTO: { label: 'Rendimiento Académico', icon: Award, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  ACTITUD: { label: 'Actitud y Hábitos', icon: Sparkles, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  CONVIVENCIA: { label: 'Convivencia y Valores', icon: HeartHandshake, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
  RECOMENDACION: { label: 'Recomendaciones al Hogar', icon: BookOpen, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' }
};

export const ObservacionesBoletinPrimariaView: React.FC = () => {
  const { observationTemplates, saveObservationTemplate, deleteObservationTemplate, showToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [selectedGrade, setSelectedGrade] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<BulletinObservationTemplate | null>(null);
  const [formData, setFormData] = useState<Partial<BulletinObservationTemplate>>({
    level: 'PRIMARIA',
    category: 'RENDIMIENTO',
    code: '',
    title: '',
    text: '',
    grade: '',
    active: true
  });

  // Filtrar plantillas exclusivas de Educación Primaria
  const primariaTemplates = useMemo(() => {
    return (observationTemplates || []).filter(t => t.level === 'PRIMARIA');
  }, [observationTemplates]);

  const filteredTemplates = useMemo(() => {
    return primariaTemplates.filter(t => {
      if (selectedCategory !== 'TODAS' && t.category !== selectedCategory) return false;
      if (selectedGrade !== 'TODOS' && t.grade && t.grade !== selectedGrade) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const code = (t.code || '').toLowerCase();
        const title = (t.title || '').toLowerCase();
        const text = (t.text || '').toLowerCase();
        if (!code.includes(term) && !title.includes(term) && !text.includes(term)) return false;
      }
      return true;
    });
  }, [primariaTemplates, selectedCategory, selectedGrade, searchTerm]);

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setFormData({
      level: 'PRIMARIA',
      category: 'RENDIMIENTO',
      code: `PRI-${Date.now().toString().slice(-4)}`,
      title: '',
      text: '',
      grade: '',
      active: true
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (t: BulletinObservationTemplate) => {
    setEditingTemplate(t);
    setFormData({ ...t });
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.text?.trim() || !formData.code?.trim()) {
      showToast('Por favor complete todos los campos requeridos.', 'error');
      return;
    }

    const payload: BulletinObservationTemplate = {
      id: editingTemplate ? editingTemplate.id : `obs-pri-${Date.now()}`,
      level: 'PRIMARIA',
      category: (formData.category as ObservationCategory) || 'RENDIMIENTO',
      code: formData.code.trim().toUpperCase(),
      title: formData.title.trim(),
      text: formData.text.trim(),
      grade: formData.grade || undefined,
      active: formData.active ?? true
    };

    try {
      await saveObservationTemplate(payload);
      setIsFormOpen(false);
      showToast(
        editingTemplate
          ? 'Plantilla de observación actualizada exitosamente.'
          : 'Nueva frase pedagógica agregada al catálogo de Primaria.',
        'success'
      );
    } catch {
      showToast('Error al guardar la plantilla de observación.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta frase pedagógica del catálogo?')) {
      try {
        await deleteObservationTemplate(id);
        showToast('Frase de observación eliminada.', 'info');
      } catch {
        showToast('Error al eliminar la frase.', 'error');
      }
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Apreciación copiada al portapapeles.', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner de Cabecera */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2C2E53] to-[#1E2038] text-[#D4AF37] flex items-center justify-center font-black shadow-md shrink-0 border border-[#D4AF37]/30">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                Catálogo Pedagógico Oficial
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Educación Primaria CBA
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#2C2E53] dark:text-white mt-0.5">
              Lista de Observaciones para el Boletín
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Repositorio maestro de frases formativas, apreciaciones pedagógicas y recomendaciones para los informes de evaluación de 1er a 6to Grado.
            </p>
          </div>
        </div>

        {/* Botón Nueva Observación */}
        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 text-xs font-black rounded-xl bg-[#2C2E53] hover:bg-[#1E2038] text-[#D4AF37] shadow-md flex items-center gap-1.5 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Frase de Boletín</span>
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Búsqueda */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por título, código o texto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white"
            />
          </div>

          {/* Categoría */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white"
          >
            <option value="TODAS">Todas las Categorías</option>
            <option value="RENDIMIENTO">Rendimiento Académico</option>
            <option value="ACTITUD">Actitud y Hábitos</option>
            <option value="CONVIVENCIA">Convivencia y Valores</option>
            <option value="RECOMENDACION">Recomendaciones al Hogar</option>
          </select>

          {/* Grado */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white"
          >
            <option value="TODOS">Todos los Grados</option>
            {LEVEL_GRADES_CATALOG.PRIMARIA.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <span className="text-xs font-mono font-bold text-slate-400">
          {filteredTemplates.length} de {primariaTemplates.length} registradas
        </span>
      </div>

      {/* Cuadrícula de Frases Pedagógicas */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-800 dark:text-white">
            No se encontraron frases de observación
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Haga clic en "Nueva Frase de Boletín" para crear y catalogar una apreciación pedagógica para Primaria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map(item => {
            const cat = CATEGORY_METADATA[item.category] || CATEGORY_METADATA.RENDIMIENTO;
            const CatIcon = cat.icon;
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${cat.color}`}>
                        <CatIcon className="w-3 h-3" />
                        <span>{cat.label}</span>
                      </span>
                      {item.grade && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.grade}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[10px] font-black text-slate-400">
                      {item.code}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    "{item.text}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyText(item.text, item.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                      isCopied
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? '¡Copiado!' : 'Copiar Texto'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Editar frase"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Eliminar frase"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear / Editar Frase */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingTemplate ? 'Editar Frase de Boletín' : 'Nueva Frase de Boletín (Primaria)'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                    Código
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ObservationCategory })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold dark:text-white"
                  >
                    <option value="RENDIMIENTO">Rendimiento Académico</option>
                    <option value="ACTITUD">Actitud y Hábitos</option>
                    <option value="CONVIVENCIA">Convivencia y Valores</option>
                    <option value="RECOMENDACION">Recomendaciones al Hogar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                  Título Resumido / Criterio
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Comprensión Lectora y Fluidez"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                  Texto Formativo Oficial
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Redacte la apreciación formativa que se imprimirá en el boletín..."
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 leading-relaxed dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-black rounded-xl bg-[#2C2E53] hover:bg-[#1E2038] text-[#D4AF37] shadow-md flex items-center gap-1.5 transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Frase</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
