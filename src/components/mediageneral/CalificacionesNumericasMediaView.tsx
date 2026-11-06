import React from 'react';
import { ProcesalGradebookView } from '../evaluation/ProcesalGradebookView';
import { FileSpreadsheet, Award } from 'lucide-react';

interface CalificacionesNumericasMediaViewProps {
  onNavigateToAI?: () => void;
}

export const CalificacionesNumericasMediaView: React.FC<CalificacionesNumericasMediaViewProps> = ({
  onNavigateToAI
}) => {
  return (
    <div className="space-y-4">
      {/* Banner de Calificaciones Numéricas */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-xl">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-[#2C2E53] dark:text-white">
              Registro Procesal de Calificaciones Numéricas
            </h2>
            <p className="text-xs text-slate-400">
              Carga continua y directa de notas en la escala vigesimal oficial (01 a 20) por actividad pedagógica ponderada.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800/60">
          <Award className="w-3.5 h-3.5" />
          <span>Escala Vigesimal 01 - 20</span>
        </div>
      </div>

      <ProcesalGradebookView onNavigateToAI={onNavigateToAI} />
    </div>
  );
};
