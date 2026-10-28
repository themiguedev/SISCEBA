import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EducationalLevel } from '../../types';
import {
  ListChecks,
  Baby,
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { RecurrentesInicialView } from './recurrentes/RecurrentesInicialView';
import { RecurrentesPrimariaView } from './recurrentes/RecurrentesPrimariaView';
import { RecurrentesMediaView } from './recurrentes/RecurrentesMediaView';

interface TareasRecurrentesAdminViewProps {
  onNavigateToLevel?: (level: EducationalLevel, pillar: 'PLANIFICACION' | 'EVALUACION' | 'COMUNICACION', subTab?: string) => void;
  onNavigateToGestionSubtab?: (subTab: string) => void;
}

export const TareasRecurrentesAdminView: React.FC<TareasRecurrentesAdminViewProps> = ({
  onNavigateToLevel,
  onNavigateToGestionSubtab
}) => {
  const {
    students,
    areas,
    indicators,
    strategies,
    evaluations,
    activeLapso,
    isLapsoOpenForGrading,
    currentLevel,
    setCurrentLevel
  } = useApp();

  // Active level tab inside Tareas Recurrentes
  const [selectedSubsystem, setSelectedSubsystem] = useState<EducationalLevel>(currentLevel || 'INICIAL');

  // Stats calculation
  const totalStudents = (students || []).length;
  const totalAreas = (areas || []).length;
  const totalIndicators = (indicators || []).length;
  const totalStrategies = (strategies || []).length;

  return (
    <div className="space-y-6">
      
      {/* Executive Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#2C2E53] to-[#1B1C33] text-[#D4AF37] flex items-center justify-center shadow-lg border border-[#D4AF37]/30 shrink-0">
            <ListChecks className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                Torre de Control UCE
              </span>
              <span className="text-xs text-slate-400 font-bold">
                Colegio Bellas Artes
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#2C2E53] dark:text-slate-100 tracking-tight mt-0.5">
              Tareas Recurrentes del Administrador
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Supervisión académica integral por subsistema: banco de indicadores, auditoría ortográfica, porcentajes normativos, rasgos actitudinales, lectoescritura, grupos CRP y sábanas de notas (Pensum MPPE vs CBA).
            </p>
          </div>
        </div>

        {/* Global Status Pill */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Estado de Calificaciones</div>
            <div className="text-xs font-black text-[#2C2E53] dark:text-slate-200">
              Lapso {activeLapso}: {isLapsoOpenForGrading ? 'Abierto para Carga' : 'Bloqueado (Solo Supervisor)'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Matrícula Total</span>
          <strong className="text-xl font-black text-[#2C2E53] dark:text-slate-100 font-mono mt-0.5 block">
            {totalStudents}
          </strong>
          <span className="text-[10px] text-slate-500">Alumnos regulares</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Asignaturas Oficiales</span>
          <strong className="text-xl font-black text-sky-700 dark:text-sky-400 font-mono mt-0.5 block">
            {totalAreas}
          </strong>
          <span className="text-[10px] text-slate-500">Regulares e Integradas</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Indicadores de Logro</span>
          <strong className="text-xl font-black text-purple-700 dark:text-purple-400 font-mono mt-0.5 block">
            {totalIndicators}
          </strong>
          <span className="text-[10px] text-slate-500">Banco institucional</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Estrategias Didácticas</span>
          <strong className="text-xl font-black text-[#D4AF37] font-mono mt-0.5 block">
            {totalStrategies}
          </strong>
          <span className="text-[10px] text-slate-500">Catálogo formativo</span>
        </div>
      </div>

      {/* Subsystem Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setSelectedSubsystem('INICIAL')}
          className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black transition-all ${
            selectedSubsystem === 'INICIAL'
              ? 'bg-[#2C2E53] text-[#D4AF37] shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Baby className="w-4 h-4 shrink-0" />
          <span>+ Educación Inicial</span>
        </button>

        <button
          onClick={() => setSelectedSubsystem('PRIMARIA')}
          className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black transition-all ${
            selectedSubsystem === 'PRIMARIA'
              ? 'bg-[#2C2E53] text-[#D4AF37] shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4 shrink-0" />
          <span>+ Educación Primaria</span>
        </button>

        <button
          onClick={() => setSelectedSubsystem('MEDIA_GENERAL')}
          className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black transition-all ${
            selectedSubsystem === 'MEDIA_GENERAL'
              ? 'bg-[#2C2E53] text-[#D4AF37] shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>+ Educación Media General</span>
        </button>
      </div>

      {/* Active Subsystem Recurrent Tasks View */}
      <div className="animate-in fade-in duration-200">
        {selectedSubsystem === 'INICIAL' && (
          <RecurrentesInicialView
            onOpenIndicatorsBank={() => onNavigateToLevel?.('INICIAL', 'PLANIFICACION', 'BANCO_INDICADORES')}
            onOpenProcesalGradebook={() => onNavigateToLevel?.('INICIAL', 'EVALUACION', 'PROCESAL')}
          />
        )}

        {selectedSubsystem === 'PRIMARIA' && (
          <RecurrentesPrimariaView
            onOpenIndicatorsBank={() => onNavigateToLevel?.('PRIMARIA', 'PLANIFICACION', 'BANCO_INDICADORES')}
            onOpenProcesalGradebook={() => onNavigateToLevel?.('PRIMARIA', 'EVALUACION', 'PROCESAL')}
          />
        )}

        {selectedSubsystem === 'MEDIA_GENERAL' && (
          <RecurrentesMediaView
            onOpenStrategiesBank={() => onNavigateToLevel?.('MEDIA_GENERAL', 'PLANIFICACION', 'BANCO_ESTRATEGIAS')}
            onOpenProcesalGradebook={() => onNavigateToLevel?.('MEDIA_GENERAL', 'EVALUACION', 'PROCESAL')}
            onOpenCouncilMinutes={() => onNavigateToLevel?.('MEDIA_GENERAL', 'COMUNICACION', 'ACTAS_CONSEJO')}
            onOpenCRPWorkshops={() => onNavigateToGestionSubtab?.('TALLERES_CRP')}
          />
        )}
      </div>

    </div>
  );
};
