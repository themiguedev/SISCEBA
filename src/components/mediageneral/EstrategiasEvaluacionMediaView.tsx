import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG } from '../../types';
import {
  ClipboardList,
  Plus,
  BookOpen,
  Calendar,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Layers,
  Sparkles,
  Trash2
} from 'lucide-react';

export const EstrategiasEvaluacionMediaView: React.FC = () => {
  const { strategies, areas, activeLapso } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>(LEVEL_GRADES_CATALOG.MEDIA_GENERAL[0]);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(activeLapso as 1 | 2 | 3);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Áreas oficiales de Media General
  const mediaAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'MEDIA_GENERAL');
  }, [areas]);

  // Estrategias de Media General filtradas
  const filteredStrategies = useMemo(() => {
    return (strategies || [])
      .filter(s => s.level === 'MEDIA_GENERAL')
      .filter(s => (selectedAreaId === 'TODAS' ? true : s.areaId === selectedAreaId))
      .filter(s => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          (s.name || '').toLowerCase().includes(term) ||
          (s.description || '').toLowerCase().includes(term) ||
          (s.type || '').toLowerCase().includes(term)
        );
      });
  }, [strategies, selectedAreaId, searchTerm]);

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
            <ClipboardList className="w-6 h-6 text-white" />
            Estrategias de Evaluación
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Gestione y supervise las estrategias de evaluación continua, instrumentos técnicos y normativas del régimen vigesimal para Media General.
          </p>
        </div>

        {/* Resumen de aula activa */}
        <div className="flex items-center gap-2 bg-white/10 dark:bg-black/30 border border-white/15 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-100 shrink-0">
          <Layers className="w-4 h-4 text-amber-300" />
          <span>
            {selectedGrade} • Sec. {selectedSection} • L{selectedLapso} • 2026-2027
          </span>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Año */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Año Escolar
            </label>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#2C2E53] dark:text-slate-100 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              {LEVEL_GRADES_CATALOG.MEDIA_GENERAL.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Sección Oficial */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Sección Oficial
            </label>
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['A', 'B'] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    selectedSection === sec
                      ? 'bg-[#2C2E53] text-[#D4AF37] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sección {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Lapso */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Momento / Lapso
            </label>
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {([1, 2, 3] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setSelectedLapso(l)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    selectedLapso === l
                      ? 'bg-[#D4AF37] text-slate-950 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {l}° Lapso
                </button>
              ))}
            </div>
          </div>

          {/* Asignatura */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Asignatura
            </label>
            <select
              value={selectedAreaId}
              onChange={e => setSelectedAreaId(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#2C2E53] dark:text-slate-100 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="TODAS">Todas las Asignaturas</option>
              {mediaAreas.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar estrategia..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* Banner de Normativa MPPE de Estrategias */}
      <div className="bg-gradient-to-r from-emerald-900/10 via-slate-50 to-teal-900/10 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-4 border border-emerald-200/50 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#2C2E53] dark:text-white uppercase tracking-wider">
              Planificación y Supervisión de Estrategias de Evaluación
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Normativa MPPE: Cada actividad de evaluación continua tiene un peso ponderado máximo del 20% (4 puntos).
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-slate-400">
          {filteredStrategies.length} estrategia(s)
        </span>
      </div>

      {/* Grilla de Estrategias */}
      {filteredStrategies.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <ClipboardList className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No se han registrado estrategias para esta selección
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Consulte el Banco de Estrategias o verifique la planificación del docente en {selectedGrade}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStrategies.map(st => (
            <div
              key={st.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-sm transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {st.type || 'Estrategia Formativa'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#D4AF37]">
                    Ponderación: 20% máx.
                  </span>
                </div>

                <h4 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
                  {st.name}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">
                  {st.description || 'Estrategia evaluativa continua orientada al dominio de objetivos y competencias.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Cumple norma (≤ 20%)
                </span>
                <span className="font-mono text-[11px]">
                  {st.category || 'Formativa / Sumativa'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
