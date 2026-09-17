import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Calendar,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  School,
  Clock,
  UserCheck,
  Layers,
  Save
} from 'lucide-react';

export const ConfiguracionModule: React.FC = () => {
  const { schoolYearConfig, toggleLapsoGrading, isLapsoOpenForGrading, activeLapso } = useApp();
  const [activeTab, setActiveTab] = useState<'LAPSOS' | 'ESTRUCTURA' | 'DOCENTES'>('LAPSOS');
  const [saveBanner, setSaveBanner] = useState(false);

  const handleSaveSettings = () => {
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Parámetros y Control del Sistema
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C2E53] mt-1">Configuración Institucional</h2>
          <p className="text-xs text-slate-500">
            ADM: Administración de años escolares, apertura y bloqueo de ventanas evaluativas de lapso y catálogo escolar.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('LAPSOS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'LAPSOS'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Años Escolares y Lapsos
          </button>
          <button
            onClick={() => setActiveTab('ESTRUCTURA')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ESTRUCTURA'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Grados y Secciones
          </button>
          <button
            onClick={() => setActiveTab('DOCENTES')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'DOCENTES'
                ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Carga Horaria y Docentes
          </button>
        </div>
      </div>

      {saveBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ¡Configuración guardada y sincronizada para toda la institución!
        </div>
      )}

      {/* VIEW 1: LAPSOS Y REGLA DE BLOQUEO TEMPORAL */}
      {activeTab === 'LAPSOS' && (
        <div className="space-y-6">
          {/* Regla de negocio banner */}
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 transition-colors ${
              isLapsoOpenForGrading
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            {isLapsoOpenForGrading ? (
              <Unlock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Lock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-extrabold block text-sm mb-0.5">
                Estado del Lapso {activeLapso}:{' '}
                {isLapsoOpenForGrading ? 'HABILITADO PARA CARGA DOCENTE' : 'BLOQUEADO PARA CARGA'}
              </span>
              {isLapsoOpenForGrading ? (
                <span>
                  Los docentes pueden asentar calificaciones, literales e indicadores de logro normalmente en sus planillas.
                </span>
              ) : (
                <span className="font-bold text-rose-700">
                  Regla de negocio activa: Los docentes verán el banner de restricción reglamentario: <br />
                  <code className="bg-rose-100 px-1.5 py-0.5 rounded font-mono font-black text-rose-900 text-[11px] mt-1 inline-block">
                    ⛔ "No existen lapsos habilitados para la carga de registros."
                  </code>
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-extrabold text-sm text-[#2C2E53]">
                  Periodo Lectivo Activo: {schoolYearConfig.year}
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">3 Lapsos Pedagógicos</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-[#1B1C33] text-white uppercase text-[10px] tracking-wider font-extrabold">
                <tr>
                  <th className="py-3.5 px-4">Lapso Académico</th>
                  <th className="py-3.5 px-4">Fecha de Inicio</th>
                  <th className="py-3.5 px-4">Fecha de Cierre</th>
                  <th className="py-3.5 px-4 text-center">Ventana de Carga de Notas</th>
                  <th className="py-3.5 px-4 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {schoolYearConfig.lapsos.map((l) => (
                  <tr key={l.lapso} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{l.name}</p>
                      {activeLapso === l.lapso && (
                        <span className="text-[10px] text-[#D4AF37] font-extrabold block">
                          ● Lapso en curso en interfaz
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono">{l.startDate}</td>
                    <td className="py-3.5 px-4 font-mono">{l.endDate}</td>
                    <td className="py-3.5 px-4 text-center">
                      {l.isGradingOpen ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                          <Unlock className="w-3 h-3" />
                          Habilitado / Abierto
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 inline-flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Cerrado / Bloqueado
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleLapsoGrading(l.lapso)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition shadow-sm ${
                          l.isGradingOpen
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {l.isGradingOpen ? 'Cerrar Lapso' : 'Abrir para Carga'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: ESTRUCTURA DE CURSOS */}
      {activeTab === 'ESTRUCTURA' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-[#2C2E53] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D4AF37]" />
              Estructura de Niveles, Grados y Secciones
            </h3>
            <span className="text-xs text-slate-400">Colegio Bellas Artes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-xs font-black uppercase text-amber-700">Educación Inicial</span>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Sala de 3 Años (Secciones A y B)</li>
                <li>• Sala de 4 Años (Secciones A y B)</li>
                <li>• Sala de 5 Años (Secciones A y B)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-xs font-black uppercase text-emerald-700">Educación Primaria</span>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• 1er Grado a 3er Grado (A, B, C)</li>
                <li>• 4to Grado a 6to Grado (A, B, C)</li>
                <li>• Enfoque de Literales A a E</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-xs font-black uppercase text-blue-700">Media General</span>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• 1er Año a 3er Año (A, B)</li>
                <li>• 4to Año y 5to Año (A, B)</li>
                <li>• Escala Numérica 01 a 20</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: DOCENTES */}
      {activeTab === 'DOCENTES' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-[#2C2E53] flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#D4AF37]" />
              Plantilla y Asignación de Docentes Guías
            </h3>
            <span className="text-xs text-slate-400">Año Escolar 2026-2027</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Prof. Alejandro Rivas</p>
                <p className="text-slate-500 text-[11px]">Matemáticas • 22h semanales</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-700">
                Docente Guía: 4to Año A
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Prof. Elena Barrios</p>
                <p className="text-slate-500 text-[11px]">Castellano y Creación Literaria • 20h semanales</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-700">
                Docente Guía: 4to Año B
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Prof. Marcos Andrade</p>
                <p className="text-slate-500 text-[11px]">Física y Laboratorio • 18h semanales</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-700">
                Docente Guía: 3er Año A
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
