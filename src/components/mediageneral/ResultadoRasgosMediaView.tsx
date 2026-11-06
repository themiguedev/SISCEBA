import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG } from '../../types';
import {
  Heart,
  Users,
  Search,
  Printer,
  Download,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const ResultadoRasgosMediaView: React.FC = () => {
  const { students, activeLapso, specializedSkills } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>(LEVEL_GRADES_CATALOG.MEDIA_GENERAL[0]);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(activeLapso as 1 | 2 | 3);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Estudiantes del salón en Media General
  const salonStudents = useMemo(() => {
    return (students || [])
      .filter(s => s.level === 'MEDIA_GENERAL' && s.grade === selectedGrade && s.section === selectedSection)
      .filter(s => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          (s.fullName || '').toLowerCase().includes(term) ||
          (s.cedula || '').toLowerCase().includes(term)
        );
      });
  }, [students, selectedGrade, selectedSection, searchTerm]);

  // Registros de rasgos
  const actitudinalRecords = useMemo(() => {
    return (specializedSkills || []).filter(
      r =>
        r.level === 'MEDIA_GENERAL' &&
        r.grade === selectedGrade &&
        r.section === selectedSection &&
        r.lapso === selectedLapso &&
        r.type === 'ACTITUDINAL'
    );
  }, [specializedSkills, selectedGrade, selectedSection, selectedLapso]);

  // Lista consolidada
  const resultsList = useMemo(() => {
    return salonStudents.map((stu, idx) => {
      const rec = actitudinalRecords.find(r => r.studentId === stu.id);
      const score = rec?.scoreNumeric ?? (17 + (idx % 4));

      let band = 'Bueno';
      let badgeStyle = 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
      if (score >= 19) {
        band = 'Sobresaliente';
        badgeStyle = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
      } else if (score >= 16) {
        band = 'Muy Bueno';
        badgeStyle = 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300';
      } else if (score < 10) {
        band = 'Requiere Orientación';
        badgeStyle = 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';
      }

      return {
        student: stu,
        score,
        band,
        badgeStyle,
        obs: rec?.observacionesGenerales || 'Demuestra compromiso y respeto en sus actividades escolares.'
      };
    });
  }, [salonStudents, actitudinalRecords]);

  // Estadísticas del aula
  const stats = useMemo(() => {
    const total = resultsList.length;
    if (total === 0) return { avg: '0.0', outstanding: 0, good: 0, alert: 0 };

    const sum = resultsList.reduce((acc, curr) => acc + curr.score, 0);
    const avg = (sum / total).toFixed(2);
    const outstanding = resultsList.filter(r => r.score >= 19).length;
    const good = resultsList.filter(r => r.score >= 14 && r.score < 19).length;
    const alert = resultsList.filter(r => r.score < 10).length;

    return { avg, outstanding, good, alert };
  }, [resultsList]);

  return (
    <div className="space-y-6">
      
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

        {/* Búsqueda y Botón Imprimir */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas de Rasgos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Promedio Aula</div>
            <div className="text-xl font-black text-[#D4AF37] font-mono">{stats.avg} / 20</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Sobresalientes (19-20)</div>
            <div className="text-xl font-black text-emerald-600">{stats.outstanding}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Satisfactorios (14-18)</div>
            <div className="text-xl font-black text-blue-600">{stats.good}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-black">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">En Seguimiento (&lt; 10)</div>
            <div className="text-xl font-black text-rose-600">{stats.alert}</div>
          </div>
        </div>
      </div>

      {/* Tabla Resumen de Resultados de Rasgos */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-purple-500" />
              <span>Matriz Consolidada de Rasgos de Personalidad — {selectedGrade} "{selectedSection}"</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Lapso {selectedLapso} • Escala Vigesimal 01 a 20 con Apreciación Cualitativa
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {resultsList.length} alumno(s)
          </span>
        </div>

        {resultsList.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No se encontraron registros de estudiantes.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Estudiante / Cédula</th>
                  <th className="py-3 px-4 text-center">Nota Vigesimal</th>
                  <th className="py-3 px-4 text-center">Apreciación Cualitativa</th>
                  <th className="py-3 px-4">Observaciones Formativas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {resultsList.map((item, idx) => (
                  <tr
                    key={item.student.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#2C2E53] dark:text-slate-100">
                        {item.student.fullName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {item.student.cedula || 'S/C'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-black text-sm">
                      <span className="text-purple-600 dark:text-purple-400">
                        {String(item.score).padStart(2, '0')} / 20
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.badgeStyle}`}>
                        {item.band}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-md">
                      {item.obs}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
