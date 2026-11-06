import React from 'react';
import { TalleresCRPView } from '../gestion/TalleresCRPView';
import { Palette, Award, Sparkles } from 'lucide-react';

export const CalificacionesCRPMediaView: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Banner de Contexto para Media General */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-xl">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-[#2C2E53] dark:text-white">
              Grupos de Creación, Recreación y Producción (CRP)
            </h2>
            <p className="text-xs text-slate-400">
              Inscripción de talleres, asignación de docentes y carga de calificaciones literales (Escala Oficial A a N)
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800/60">
          <Award className="w-3.5 h-3.5" />
          <span>Normativa MPPE Media General</span>
        </div>
      </div>

      {/* Vista Oficial de Talleres CRP */}
      <TalleresCRPView />
    </div>
  );
};
