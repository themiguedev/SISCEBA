import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG } from '../../types';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  Search,
  Users,
  Award,
  Sparkles,
  HelpCircle,
  Sliders,
  Layers
} from 'lucide-react';

export const ResultadoAutoevaluacionMediaView: React.FC = () => {
  const { students, activeLapso } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>(LEVEL_GRADES_CATALOG.MEDIA_GENERAL[0]);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(activeLapso as 1 | 2 | 3);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Configuración del Cronograma de Autoevaluación
  const [scheduleConfig, setScheduleConfig] = useState({
    startDate: '2025-11-10',
    endDate: '2025-11-25',
    weightPercent: 10,
    isOpen: true
  });

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

  // Simulación de estados de autoevaluación por estudiante
  const [studentSelfEvals, setStudentSelfEvals] = useState<Record<string, { score: number; reflection: string; status: 'VALIDADO' | 'PENDIENTE' }>>({});

  React.useEffect(() => {
    const map: Record<string, { score: number; reflection: string; status: 'VALIDADO' | 'PENDIENTE' }> = {};
    salonStudents.forEach((stu, idx) => {
      // Simular respuestas pedagógicas reales
      const baseScore = 16 + (idx % 5);
      map[stu.id] = {
        score: Math.min(20, baseScore),
        reflection: 'He cumplido puntualmente con mis asignaciones y participado en actividades grupales.',
        status: 'VALIDADO'
      };
    });
    setStudentSelfEvals(map);
  }, [salonStudents]);

  const handleScoreChange = (studentId: string, newScore: number) => {
    setStudentSelfEvals(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score: Math.min(20, Math.max(1, newScore))
      }
    }));
  };

  const handleReflectionChange = (studentId: string, text: string) => {
    setStudentSelfEvals(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        reflection: text
      }
    }));
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
            <Calendar className="w-6 h-6 text-white" />
            Resultado de Autoevaluación cronograma
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Gestione el cronograma, fechas de aplicación, ponderación reflexiva y registro de autoevaluación del estudiante.
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

      {/* Barra de Filtros y Cronograma */}
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

        {/* Búsqueda */}
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
      </div>

      {/* Tarjeta de Cronograma y Parámetros */}
      <div className="bg-gradient-to-r from-purple-900/10 via-slate-50 to-indigo-900/10 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 border border-purple-200/50 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-white">
              Cronograma Oficial de Autoevaluación del Lapso {selectedLapso}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ventana de aplicación: {scheduleConfig.startDate} al {scheduleConfig.endDate} • Peso Ponderado: {scheduleConfig.weightPercent}% de la nota procesal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Proceso Activo</span>
          </span>
        </div>
      </div>

      {/* Lista de Resultados de Autoevaluación */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#D4AF37]" />
              <span>Resultados de Autoevaluación — {selectedGrade} "{selectedSection}"</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Registro del proceso reflexivo del alumno con escala vigesimal (01 a 20)
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {salonStudents.length} alumno(s)
          </span>
        </div>

        {salonStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No hay estudiantes inscritos en este curso.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {salonStudents.map(student => {
              const data = studentSelfEvals[student.id] || { score: 18, reflection: '', status: 'VALIDADO' };
              const isPassing = data.score >= 10;

              return (
                <div
                  key={student.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                >
                  <div className="min-w-[260px]">
                    <div className="font-bold text-xs text-[#2C2E53] dark:text-slate-100">
                      {student.fullName}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      C.I. {student.cedula || 'S/C'}
                    </div>
                  </div>

                  <div className="flex-1 w-full">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Reflexión del Estudiante sobre su Desempeño
                    </label>
                    <input
                      type="text"
                      value={data.reflection}
                      onChange={e => handleReflectionChange(student.id, e.target.value)}
                      placeholder="Autocrítica formativa..."
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Auto-calificación</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={data.score}
                          onChange={e => handleScoreChange(student.id, Number(e.target.value))}
                          className="w-16 px-2 py-1 font-mono font-black text-sm text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        />
                        <span className="text-xs font-bold text-slate-400">/ 20</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {data.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
