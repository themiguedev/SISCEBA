import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  User,
  BookOpen,
  FileText,
  Sparkles,
  ArrowRight,
  GraduationCap,
  ClipboardList
} from 'lucide-react';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: any, subTab?: string) => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const { students, areas, currentLevel } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredStudents = students
    .filter(s => s.level === currentLevel && s.fullName.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4);

  const filteredAreas = areas
    .filter(a => a.level === currentLevel && a.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4);

  const quickActions = [
    {
      title: 'Pases por Retraso y Portería',
      category: 'Gestión Escolar',
      tab: 'GESTION',
      subTab: 'PASES',
      icon: ClipboardList
    },
    {
      title: 'Asistente de Inscripciones (Wizard)',
      category: 'Gestión Escolar',
      tab: 'GESTION',
      subTab: 'INSCRIPCIONES',
      icon: GraduationCap
    },
    {
      title: 'Documentos Solicitados y Constancias (SLA)',
      category: 'Gestión Escolar',
      tab: 'GESTION',
      subTab: 'DOCUMENTOS',
      icon: FileText
    },
    {
      title: 'Plan Quincenal en Curso',
      category: 'Planificación',
      tab: currentLevel,
      subTab: 'PLAN_QUINCENAL',
      icon: BookOpen
    },
    {
      title: 'Registro de Evaluación Procesal',
      category: 'Evaluación',
      tab: currentLevel,
      subTab: 'PROCESAL',
      icon: FileText
    },
    {
      title: 'Mapa del Sitio y Auditoría de Rutas',
      category: 'Ayuda',
      tab: 'AYUDA',
      subTab: 'MAPA_SITIO',
      icon: BookOpen
    }
  ].filter(action => action.title.toLowerCase().includes(query.toLowerCase()) || action.category.toLowerCase().includes(query.toLowerCase()));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-slate-50/80">
          <Search className="w-5 h-5 text-[#D4AF37]" />
          <input
            type="text"
            placeholder="Buscar estudiantes, áreas curriculares, instrumentos o reportes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-300 rounded shadow-sm">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Quick Actions */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-2">
              Acciones y Módulos Rápidos
            </span>
            <div className="space-y-1">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onNavigate(action.tab, action.subTab);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#2C2E53]/5 group transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#2C2E53]/10 flex items-center justify-center text-[#2C2E53] group-hover:bg-[#2C2E53] group-hover:text-[#D4AF37] transition">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-[#2C2E53]">
                          {action.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {action.category}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Students Match */}
          {filteredStudents.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-2">
                Estudiantes ({currentLevel.replace('_', ' ')})
              </span>
              <div className="space-y-1">
                {filteredStudents.map((stu) => (
                  <button
                    key={stu.id}
                    onClick={() => {
                      onNavigate('EVALUACION', 'PROCESAL');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 group transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{stu.fullName}</p>
                        <p className="text-[10px] text-slate-400">Cédula: {stu.cedula} • {stu.grade}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold group-hover:bg-[#2C2E53] group-hover:text-white transition">
                      Ver Ficha
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Areas Match */}
          {filteredAreas.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-2">
                Áreas de Formación
              </span>
              <div className="space-y-1">
                {filteredAreas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => {
                      onNavigate('PLANIFICACION', 'AREAS_PERFILES');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 group transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{area.name}</p>
                        <p className="text-[10px] text-slate-400">Código: {area.code} • Modalidad: {area.type}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold group-hover:bg-[#2C2E53] group-hover:text-white transition">
                      Ver Perfil
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>U.E.P. Colegio Bellas Artes • SICE-CBA 2026</span>
          <span className="flex items-center gap-1 font-semibold text-slate-500">
            Presiona <kbd className="bg-white px-1.5 py-0.5 border border-slate-200 rounded">ESC</kbd> para cerrar
          </span>
        </div>
      </div>
    </div>
  );
};
