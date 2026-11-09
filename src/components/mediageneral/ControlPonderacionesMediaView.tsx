import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG } from '../../types';
import {
  Percent,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  Users,
  Printer,
  Layers
} from 'lucide-react';

export const ControlPonderacionesMediaView: React.FC = () => {
  const {
    areas,
    activeLapso,
    auditMediaGeneralStrategyWeights
  } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>(LEVEL_GRADES_CATALOG.MEDIA_GENERAL[0]);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(activeLapso as 1 | 2 | 3);
  const [filterIssuesOnly, setFilterIssuesOnly] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Auditorías calculadas desde el contexto
  const audits = useMemo(() => {
    return auditMediaGeneralStrategyWeights(selectedGrade, selectedSection, selectedLapso);
  }, [auditMediaGeneralStrategyWeights, selectedGrade, selectedSection, selectedLapso]);

  const filteredAudits = useMemo(() => {
    return audits
      .filter(a => {
        if (!filterIssuesOnly) return true;
        return a.exceedsMaxLimit || a.totalWeightPercent !== 100;
      })
      .filter(a => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          (a.areaName || '').toLowerCase().includes(term) ||
          (a.teacherName || '').toLowerCase().includes(term)
        );
      });
  }, [audits, filterIssuesOnly, searchTerm]);

  // Resumen estadístico
  const stats = useMemo(() => {
    const total = audits.length;
    const compliant = audits.filter(a => !a.exceedsMaxLimit).length;
    const nonCompliant = total - compliant;
    return { total, compliant, nonCompliant };
  }, [audits]);

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
            <Percent className="w-6 h-6 text-white" />
            Estrategias y Ponderaciones
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Auditoría de cumplimiento normativo MPPE: verificación del tope de 20% (4 pts) por actividad y suma del 100% por lapso.
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
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar asignatura o docente..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <button
            onClick={() => setFilterIssuesOnly(!filterIssuesOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              filterIssuesOnly
                ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{filterIssuesOnly ? 'Solo Observaciones' : 'Ver Todos'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas de Cumplimiento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Asignaturas Auditadas</div>
            <div className="text-xl font-black text-[#2C2E53] dark:text-white mt-0.5">{stats.total}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Cumplen Normativa (Tope ≤ 20%)</div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{stats.compliant}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-black">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Requieren Corrección</div>
            <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">{stats.nonCompliant}</div>
          </div>
        </div>
      </div>

      {/* Tabla de Auditoría */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#D4AF37]" />
              <span>Auditoría de Ponderaciones — {selectedGrade} "{selectedSection}"</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Control de límites normativos: Máx. 20% por evaluación • Suma ponderada total: 100%
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {filteredAudits.length} cátedra(s)
          </span>
        </div>

        {filteredAudits.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No se encontraron asignaturas registradas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Asignatura</th>
                  <th className="py-3 px-4">Docente</th>
                  <th className="py-3 px-4 text-center">N° Estrategias</th>
                  <th className="py-3 px-4 text-center">Mayor Ponderación</th>
                  <th className="py-3 px-4 text-center">Suma Total</th>
                  <th className="py-3 px-4 text-center">Diagnóstico Normativo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAudits.map(audit => {
                  const isCompliant = !audit.exceedsMaxLimit;

                  return (
                    <tr
                      key={audit.areaId}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3 px-4 font-bold text-[#2C2E53] dark:text-slate-100">
                        {audit.areaName}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {audit.teacherName || 'Docente de Cátedra'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-500">
                        {audit.strategiesCount}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-black text-sm">
                        <span className={audit.maxSingleWeightPercent > 20 ? 'text-rose-600' : 'text-emerald-600'}>
                          {audit.maxSingleWeightPercent}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                        {audit.totalWeightPercent}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isCompliant
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}>
                          {isCompliant ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Cumple Norma</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3" />
                              <span>Excede Máx. 20%</span>
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
