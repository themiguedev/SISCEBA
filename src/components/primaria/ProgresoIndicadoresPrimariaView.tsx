import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG, QualitativeScore, Indicator, Student, EvaluationRecord } from '../../types';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Users,
  BookOpen,
  Filter,
  BarChart3,
  Layers,
  ArrowRight,
  Sparkles,
  PieChart,
  ShieldAlert,
  Search,
  FileCheck2
} from 'lucide-react';

export const ProgresoIndicadoresPrimariaView: React.FC = () => {
  const { students, areas, indicators, evaluations, activeLapso } = useApp();

  const [selectedLapso, setSelectedLapso] = useState<number>(activeLapso);
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedSection, setSelectedSection] = useState<'ALL' | 'A' | 'B'>('ALL');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Estudiantes de Primaria
  const primariaStudents = useMemo(() => {
    return (students || []).filter(s => s.level === 'PRIMARIA');
  }, [students]);

  // Áreas de Primaria
  const primariaAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'PRIMARIA');
  }, [areas]);

  // Indicadores de Primaria
  const primariaIndicators = useMemo(() => {
    return (indicators || []).filter(i => i.level === 'PRIMARIA');
  }, [indicators]);

  // Evaluaciones de Primaria filtradas
  const filteredEvaluations = useMemo(() => {
    return (evaluations || []).filter(e => {
      if (e.lapso !== selectedLapso) return false;
      if (!e.scoreQualitative) return false;

      // Buscar estudiante
      const stu = primariaStudents.find(s => s.id === e.studentId);
      if (!stu) return false;

      if (selectedGrade !== 'ALL' && stu.grade !== selectedGrade) return false;
      if (selectedSection !== 'ALL' && stu.section !== selectedSection) return false;
      if (selectedAreaId !== 'ALL' && e.areaId !== selectedAreaId) return false;

      return true;
    });
  }, [evaluations, selectedLapso, primariaStudents, selectedGrade, selectedSection, selectedAreaId]);

  // KPIs Globales de Progreso
  const globalKPIs = useMemo(() => {
    const totalEvals = filteredEvaluations.length;
    let counts: Record<QualitativeScore, number> = { L: 0, A: 0, P: 0, I: 0 };

    filteredEvaluations.forEach(e => {
      if (e.scoreQualitative && counts[e.scoreQualitative] !== undefined) {
        counts[e.scoreQualitative]++;
      }
    });

    const percentL = totalEvals > 0 ? Math.round((counts.L / totalEvals) * 100) : 0;
    const percentA = totalEvals > 0 ? Math.round((counts.A / totalEvals) * 100) : 0;
    const percentP = totalEvals > 0 ? Math.round((counts.P / totalEvals) * 100) : 0;
    const percentI = totalEvals > 0 ? Math.round((counts.I / totalEvals) * 100) : 0;
    const priorityRate = percentP + percentI;

    return {
      totalEvals,
      counts,
      percentL,
      percentA,
      percentP,
      percentI,
      priorityRate
    };
  }, [filteredEvaluations]);

  // Desglose por Grado (1er a 6to Grado)
  const gradeBreakdown = useMemo(() => {
    return LEVEL_GRADES_CATALOG.PRIMARIA.map(grade => {
      const gradeStudents = primariaStudents.filter(s => s.grade === grade);
      const gradeStudentIds = new Set(gradeStudents.map(s => s.id));
      const gradeEvals = filteredEvaluations.filter(e => gradeStudentIds.has(e.studentId));

      let l = 0, a = 0, p = 0, i = 0;
      gradeEvals.forEach(e => {
        if (e.scoreQualitative === 'L') l++;
        else if (e.scoreQualitative === 'A') a++;
        else if (e.scoreQualitative === 'P') p++;
        else if (e.scoreQualitative === 'I') i++;
      });

      const total = gradeEvals.length;
      const pctL = total > 0 ? Math.round((l / total) * 100) : 0;
      const pctA = total > 0 ? Math.round((a / total) * 100) : 0;
      const pctP = total > 0 ? Math.round((p / total) * 100) : 0;
      const pctI = total > 0 ? Math.round((i / total) * 100) : 0;

      return {
        grade,
        totalStudents: gradeStudents.length,
        totalEvals: total,
        l, a, p, i,
        pctL, pctA, pctP, pctI
      };
    });
  }, [primariaStudents, filteredEvaluations]);

  // Indicadores con Mayor Dificultad (con mayor % de P e I)
  const highDifficultyIndicators = useMemo(() => {
    const map: Record<string, { indicator: Indicator; total: number; countPI: number; countL: number }> = {};

    filteredEvaluations.forEach(e => {
      if (!e.indicatorId) return;
      const indId = e.indicatorId;
      if (!map[indId]) {
        const ind = primariaIndicators.find(i => i.id === indId);
        if (ind) {
          map[indId] = { indicator: ind, total: 0, countPI: 0, countL: 0 };
        }
      }
      if (map[indId]) {
        map[indId].total++;
        if (e.scoreQualitative === 'P' || e.scoreQualitative === 'I') {
          map[indId].countPI++;
        } else if (e.scoreQualitative === 'L') {
          map[indId].countL++;
        }
      }
    });

    return Object.values(map)
      .filter(item => item.total >= 3)
      .map(item => ({
        ...item,
        percentPI: Math.round((item.countPI / item.total) * 100),
        percentL: Math.round((item.countL / item.total) * 100)
      }))
      .sort((a, b) => b.percentPI - a.percentPI)
      .slice(0, 5);
  }, [filteredEvaluations, primariaIndicators]);

  // Indicadores con Mayor Dominio / Logro (mayor % de L)
  const topMasteryIndicators = useMemo(() => {
    const map: Record<string, { indicator: Indicator; total: number; countL: number }> = {};

    filteredEvaluations.forEach(e => {
      if (!e.indicatorId) return;
      const indId = e.indicatorId;
      if (!map[indId]) {
        const ind = primariaIndicators.find(i => i.id === indId);
        if (ind) {
          map[indId] = { indicator: ind, total: 0, countL: 0 };
        }
      }
      if (map[indId]) {
        map[indId].total++;
        if (e.scoreQualitative === 'L') {
          map[indId].countL++;
        }
      }
    });

    return Object.values(map)
      .filter(item => item.total >= 3)
      .map(item => ({
        ...item,
        percentL: Math.round((item.countL / item.total) * 100)
      }))
      .sort((a, b) => b.percentL - a.percentL)
      .slice(0, 5);
  }, [filteredEvaluations, primariaIndicators]);

  // Estudiantes que requieren acompañamiento (con 2 o más indicadores en P o I)
  const studentsNeedingSupport = useMemo(() => {
    const stuMap: Record<string, { student: Student; countP: number; countI: number; areasSet: Set<string> }> = {};

    filteredEvaluations.forEach(e => {
      if (e.scoreQualitative === 'P' || e.scoreQualitative === 'I') {
        const stu = primariaStudents.find(s => s.id === e.studentId);
        if (stu) {
          if (!stuMap[stu.id]) {
            stuMap[stu.id] = { student: stu, countP: 0, countI: 0, areasSet: new Set() };
          }
          if (e.scoreQualitative === 'P') stuMap[stu.id].countP++;
          if (e.scoreQualitative === 'I') stuMap[stu.id].countI++;
          const area = primariaAreas.find(a => a.id === e.areaId);
          if (area) stuMap[stu.id].areasSet.add(area.name);
        }
      }
    });

    return Object.values(stuMap)
      .filter(item => (item.countP + item.countI) >= 2)
      .sort((a, b) => (b.countP + b.countI) - (a.countP + a.countI));
  }, [filteredEvaluations, primariaStudents, primariaAreas]);

  return (
    <div className="space-y-6">
      
      {/* Banner Principal Informativo CBA (Diseño de Referencia Oficial) */}
      <div className="bg-gradient-to-r from-[#2C2E53] via-[#1E2038] to-[#141525] rounded-2xl p-5 sm:p-6 text-white shadow-md border border-[#3D4066] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#0F1122]/90 text-amber-300 border border-[#D4AF37] shadow-xs">
              Control Curricular Oficial
            </span>
            <span className="text-xs text-amber-200/90 font-medium">
              Educación Primaria • C.E.O. SISCEBA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-white" />
            Progreso de los Indicadores de Evaluación
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Monitoreo analítico de dominio de criterios de logro por grado y área. Curvas cualitativas y alertas tempranas en escala oficial (L, A, P, I).
          </p>
        </div>

        {/* Selector de Lapso */}
        <div className="flex items-center gap-2 bg-white/10 dark:bg-black/30 p-2 rounded-2xl border border-white/15">
          <span className="text-xs font-bold text-amber-200 px-2">Momento:</span>
          {([1, 2, 3] as const).map(lap => (
            <button
              key={lap}
              onClick={() => setSelectedLapso(lap)}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition cursor-pointer ${
                selectedLapso === lap
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              Lapso {lap}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas KPI de Progreso Cualitativo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">
            Logrado (L)
          </span>
          <strong className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
            {globalKPIs.percentL}%
          </strong>
          <span className="text-[10px] text-slate-500">
            {globalKPIs.counts.L} evaluaciones consolidadas
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider block">
            Avanzando (A)
          </span>
          <strong className="text-2xl font-black text-sky-600 dark:text-sky-400 font-mono mt-0.5 block">
            {globalKPIs.percentA}%
          </strong>
          <span className="text-[10px] text-slate-500">
            {globalKPIs.counts.A} en buen ritmo
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block">
            En Proceso (P)
          </span>
          <strong className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5 block">
            {globalKPIs.percentP}%
          </strong>
          <span className="text-[10px] text-slate-500">
            {globalKPIs.counts.P} requieren práctica
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider block">
            Iniciado (I) • Alerta
          </span>
          <strong className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-0.5 block">
            {globalKPIs.percentI}%
          </strong>
          <span className="text-[10px] text-slate-500">
            {globalKPIs.counts.I} en nivel inicial
          </span>
        </div>
      </div>

      {/* Filtros Interactivos */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Grado */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
              Grado
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold dark:text-white"
            >
              <option value="ALL">Todos los Grados (1° a 6°)</option>
              {LEVEL_GRADES_CATALOG.PRIMARIA.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Sección (A y B) */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
              Sección
            </label>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedSection('ALL')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                  selectedSection === 'ALL' ? 'bg-[#2C2E53] text-[#D4AF37]' : 'text-slate-500'
                }`}
              >
                Todas
              </button>
              {(['A', 'B'] as const).map(sec => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedSection(sec)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                    selectedSection === sec ? 'bg-[#2C2E53] text-[#D4AF37]' : 'text-slate-500'
                  }`}
                >
                  Sección {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Área */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
              Área de Formación
            </label>
            <select
              value={selectedAreaId}
              onChange={(e) => setSelectedAreaId(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold dark:text-white min-w-[200px]"
            >
              <option value="ALL">Todas las Áreas</option>
              {primariaAreas.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-slate-400">
          {globalKPIs.totalEvals} calificaciones analizadas
        </span>
      </div>

      {/* Barra de Distribución Cualitativa Global */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-600" />
            <span>Distribución de la Escala Cualitativa Institucional (L, A, P, I)</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">
            Ponderación Formativa de Primaria
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${globalKPIs.percentL}%` }}
            title={`Logrado: ${globalKPIs.percentL}%`}
          />
          <div
            className="bg-sky-500 h-full transition-all duration-300"
            style={{ width: `${globalKPIs.percentA}%` }}
            title={`Avanzando: ${globalKPIs.percentA}%`}
          />
          <div
            className="bg-amber-400 h-full transition-all duration-300"
            style={{ width: `${globalKPIs.percentP}%` }}
            title={`En Proceso: ${globalKPIs.percentP}%`}
          />
          <div
            className="bg-rose-500 h-full transition-all duration-300"
            style={{ width: `${globalKPIs.percentI}%` }}
            title={`Iniciado: ${globalKPIs.percentI}%`}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Logrado (L): {globalKPIs.percentL}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" />
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Avanzando (A): {globalKPIs.percentA}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            <span className="font-bold text-slate-700 dark:text-slate-300">
              En Proceso (P): {globalKPIs.percentP}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Iniciado (I): {globalKPIs.percentI}%
            </span>
          </div>
        </div>
      </div>

      {/* Progreso por Grado (1er a 6to Grado) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Progreso Cualitativo por Grado Escolar</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">1er a 6to Grado</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {gradeBreakdown.map(gb => (
            <div
              key={gb.grade}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                  {gb.grade}
                </h4>
                <span className="text-[10px] font-bold text-slate-500 font-mono">
                  {gb.totalEvals} calificaciones
                </span>
              </div>

              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: `${gb.pctL}%` }} />
                <div className="bg-sky-500 h-full" style={{ width: `${gb.pctA}%` }} />
                <div className="bg-amber-400 h-full" style={{ width: `${gb.pctP}%` }} />
                <div className="bg-rose-500 h-full" style={{ width: `${gb.pctI}%` }} />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                <span className="text-emerald-600">{gb.pctL}% L</span>
                <span className="text-sky-600">{gb.pctA}% A</span>
                <span className="text-amber-600">{gb.pctP}% P</span>
                <span className="text-rose-600">{gb.pctI}% I</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secciones de Alertas e Indicadores Clave */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Indicadores con Mayor Desafío */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Indicadores con Mayor Atención Requerida (P / I)</span>
            </h3>
            <span className="text-[10px] font-bold uppercase text-slate-400">Refuerzo</span>
          </div>

          {highDifficultyIndicators.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No hay indicadores con rezago formativo significativo en este lapso.
            </div>
          ) : (
            <div className="space-y-2.5">
              {highDifficultyIndicators.map(item => (
                <div
                  key={item.indicator.id}
                  className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-[#2C2E53] text-[#D4AF37]">
                      {item.indicator.code}
                    </span>
                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300">
                      {item.percentPI}% en Proceso o Iniciado
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2">
                    {item.indicator.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Indicadores con Mayor Dominio */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Indicadores con Mayor Dominio Consolidado (L)</span>
            </h3>
            <span className="text-[10px] font-bold uppercase text-slate-400">Fortalezas</span>
          </div>

          {topMasteryIndicators.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No hay suficientes evaluaciones procesales registradas para calcular dominios.
            </div>
          ) : (
            <div className="space-y-2.5">
              {topMasteryIndicators.map(item => (
                <div
                  key={item.indicator.id}
                  className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-[#2C2E53] text-[#D4AF37]">
                      {item.indicator.code}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                      {item.percentL}% Logrado
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2">
                    {item.indicator.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Estudiantes con Alerta Pedagógica para Acompañamiento */}
      {studentsNeedingSupport.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                <span>Estudiantes Sugeridos para Acompañamiento y Refuerzo Pedagógico</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Alumnos con 2 o más indicadores en escala "P" (Proceso) o "I" (Iniciado) en el lapso.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              {studentsNeedingSupport.length} casos
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {studentsNeedingSupport.slice(0, 8).map(item => (
              <div
                key={item.student.id}
                className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.student.fullName}
                  </span>
                  <span className="text-slate-400 font-mono ml-2">
                    ({item.student.grade} - Sección {item.student.section})
                  </span>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Áreas de apoyo: {Array.from(item.areasSet).join(', ') || 'General'}
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] font-bold">
                  <span className="text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                    {item.countP} en Proceso
                  </span>
                  <span className="text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                    {item.countI} Iniciado
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
