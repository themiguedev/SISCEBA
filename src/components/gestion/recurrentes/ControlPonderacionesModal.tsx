import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Percent,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Search,
  Filter,
  X,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  Users
} from 'lucide-react';
import { LEVEL_GRADES_CATALOG } from '../../../types';

interface ControlPonderacionesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlPonderacionesModal: React.FC<ControlPonderacionesModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    areas,
    indicators,
    evaluations,
    students,
    activeLapso,
    auditMediaGeneralStrategyWeights
  } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>('1er Año');
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('TODAS');
  const [filterIssuesOnly, setFilterIssuesOnly] = useState<boolean>(false);

  // Audits calculated from context
  const audits = useMemo(() => {
    return auditMediaGeneralStrategyWeights(selectedGrade, selectedSection, activeLapso);
  }, [auditMediaGeneralStrategyWeights, selectedGrade, selectedSection, activeLapso]);

  const targetStudents = useMemo(() => {
    return (students || []).filter(
      s => s.level === 'MEDIA_GENERAL' && s.grade === selectedGrade && s.section === selectedSection
    );
  }, [students, selectedGrade, selectedSection]);

  const mediaAreas = useMemo(() => {
    return (areas || []).filter(a => a.level === 'MEDIA_GENERAL');
  }, [areas]);

  // Enriquecer cada auditoría con el desglose de estrategias y cobertura de notas cargadas
  const detailedAudits = useMemo(() => {
    return audits.map(audit => {
      // Indicadores / Estrategias de esta área
      const areaInds = (indicators || []).filter(
        i => i.areaId === audit.areaId && i.level === 'MEDIA_GENERAL' && i.lapso === activeLapso
      );

      // Desglose de actividades
      const activities = areaInds.map(ind => {
        const weight = ind.weight || 20;
        const isExcessive = weight > 20;

        // Notas cargadas para este indicador en esta sección
        const evalsLoaded = (evaluations || []).filter(
          e => e.areaId === audit.areaId &&
               e.indicatorId === ind.id &&
               e.lapso === activeLapso &&
               targetStudents.some(stu => stu.id === e.studentId) &&
               e.scoreNumeric !== undefined
        );

        const loadedCount = evalsLoaded.length;
        const totalCount = targetStudents.length;
        const loadedPercentage = totalCount > 0 ? Math.round((loadedCount / totalCount) * 100) : 0;

        return {
          indicatorId: ind.id,
          code: ind.code,
          description: ind.description,
          instrument: ind.evaluationInstrument || 'Escala de Estimación',
          weight,
          isExcessive,
          loadedCount,
          totalCount,
          loadedPercentage
        };
      });

      return {
        ...audit,
        activities
      };
    });
  }, [audits, indicators, evaluations, activeLapso, targetStudents]);

  const filteredAudits = useMemo(() => {
    return detailedAudits.filter(item => {
      if (selectedAreaId !== 'TODAS' && item.areaId !== selectedAreaId) return false;
      if (filterIssuesOnly && item.isCompliant) return false;
      return true;
    });
  }, [detailedAudits, selectedAreaId, filterIssuesOnly]);

  if (!isOpen) return null;

  const totalNonCompliant = detailedAudits.filter(a => !a.isCompliant).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#2C2E53] p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl text-[#D4AF37] border border-white/10">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Control de Ponderaciones y Seguimiento de Notas por Estrategia
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#1B1C33] font-bold">
                  Media General - Lapso {activeLapso}
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Verificación de tope normativo del 20% por estrategia, sumatoria del 70% procesal y cobertura de carga.
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

        {/* Filters */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Grade Selector */}
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
            >
              {LEVEL_GRADES_CATALOG.MEDIA_GENERAL.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            {/* Section Selector: STRICTLY A and B */}
            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['A', 'B'] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                    selectedSection === sec
                      ? 'bg-[#2C2E53] text-[#D4AF37]'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  Sección {sec}
                </button>
              ))}
            </div>

            {/* Area Filter */}
            <select
              value={selectedAreaId}
              onChange={e => setSelectedAreaId(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
            >
              <option value="TODAS">Todas las Asignaturas ({mediaAreas.length})</option>
              {mediaAreas.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>

            {/* Non-compliant Filter */}
            <button
              onClick={() => setFilterIssuesOnly(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                filterIssuesOnly
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              Solo con Infracción de Ponderación ({totalNonCompliant})
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Estudiantes en nómina: <strong>{targetStudents.length}</strong>
          </div>
        </div>

        {/* Content Table / Audits */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredAudits.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-75" />
              <p className="font-bold text-sm text-slate-600 dark:text-slate-300">
                Todas las ponderaciones cumplen con los lineamientos ministeriales
              </p>
              <p className="text-xs">
                Ninguna estrategia excede el 20% y las sumatorias respetan la escala del lapso.
              </p>
            </div>
          ) : (
            filteredAudits.map(item => (
              <div
                key={item.areaId}
                className={`p-5 rounded-2xl border transition-all ${
                  item.isCompliant
                    ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                    : 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30 shadow-md'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#2C2E53] text-[#D4AF37] flex items-center justify-center font-bold text-sm">
                      {item.areaName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#2C2E53] dark:text-slate-100">
                        {item.areaName}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {selectedGrade} - Sección {selectedSection} &nbsp;|&nbsp; {item.activities.length} estrategias declaradas
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black ${
                      item.isCompliant
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300'
                    }`}>
                      {item.isCompliant ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Conforme a Norma MPPE
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Infracción Detectada
                        </>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-bold">Sumatoria Declarada</span>
                      <strong className={`text-base font-black font-mono ${
                        item.totalWeightPercent === 70 || item.totalWeightPercent === 100
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}>
                        {item.totalWeightPercent}%
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Warning Alert Note */}
                {!item.isCompliant && (
                  <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{item.notes}</span>
                  </div>
                )}

                {/* Detailed Activities Grid */}
                <div className="space-y-2 mt-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Desglose de Estrategias y Cobertura de Notas Cargadas
                  </span>
                  
                  {item.activities.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-2">
                      No hay actividades evaluativas registradas para esta materia en el lapso.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {item.activities.map(act => (
                        <div
                          key={act.indicatorId}
                          className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                            act.isExcessive
                              ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                              : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-mono font-bold text-[#2C2E53] dark:text-[#D4AF37] text-[11px]">
                                {act.code}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md font-mono font-black text-[11px] ${
                                act.isExcessive
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                              }`}>
                                {act.weight}%
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-tight">
                              {act.description}
                            </p>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                              <span>Notas cargadas:</span>
                              <strong className="font-mono text-slate-700 dark:text-slate-300">
                                {act.loadedCount} de {act.totalCount} ({act.loadedPercentage}%)
                              </strong>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  act.loadedPercentage === 100
                                    ? 'bg-emerald-500'
                                    : act.loadedPercentage > 0
                                    ? 'bg-amber-500'
                                    : 'bg-slate-400'
                                }`}
                                style={{ width: `${act.loadedPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div>
            Total de materias analizadas: <strong>{mediaAreas.length}</strong> | Infracciones: <strong className="text-rose-600">{totalNonCompliant}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition"
          >
            Cerrar Control
          </button>
        </div>

      </div>
    </div>
  );
};
