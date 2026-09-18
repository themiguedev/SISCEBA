import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Unlock,
  AlertOctagon,
  CheckCircle2,
  DollarSign,
  Search,
  User,
  ShieldAlert
} from 'lucide-react';

export const BloqueoAdministrativoView: React.FC = () => {
  const { adminBlocks, toggleAdminBlock } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlocks = adminBlocks.filter(
    (b) =>
      b.representativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Control de Cobranza y Acceso
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C2E53] mt-1">Bloqueo Administrativo</h2>
          <p className="text-xs text-slate-500">
            ADM: Bloquee o desbloquee las cuentas sincronizadas de representantes y sus alumnos por mora o recaudos.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por representante, alumno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Efecto del Bloqueo en la Plataforma Web:</span>
          Al activar el bloqueo administrativo, el representante y el estudiante quedan restringidos para la visualización de boletines, notas procesales y emisión de constancias de estudio en línea.
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1B1C33] text-white uppercase text-[10px] tracking-wider font-extrabold">
            <tr>
              <th className="py-3.5 px-4">Representante Titular</th>
              <th className="py-3.5 px-4">Estudiante Vinculado</th>
              <th className="py-3.5 px-4">Curso / Sección</th>
              <th className="py-3.5 px-4">Motivo del Bloqueo</th>
              <th className="py-3.5 px-4 text-center">Compromiso / Deuda</th>
              <th className="py-3.5 px-4 text-center">Estatus Acceso</th>
              <th className="py-3.5 px-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {filteredBlocks.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">{item.representativeName}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{item.studentName}</td>
                <td className="py-3 px-4">{item.gradeSection}</td>
                <td className="py-3 px-4 max-w-xs text-slate-600 truncate" title={item.reason}>
                  {item.reason}
                </td>
                <td className="py-3 px-4 text-center font-mono font-bold text-rose-600">
                  {item.debtAmount || '—'}
                </td>
                <td className="py-3 px-4 text-center">
                  {item.active ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 flex items-center justify-center gap-1 w-fit mx-auto">
                      <Lock className="w-3 h-3" />
                      Bloqueado
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center gap-1 w-fit mx-auto">
                      <Unlock className="w-3 h-3" />
                      Solvente / Activo
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => toggleAdminBlock(item.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 mx-auto ${
                      item.active
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                    }`}
                  >
                    {item.active ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        Desbloquear
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Bloquear
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};
