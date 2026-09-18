import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Users,
  FileSpreadsheet,
  Printer,
  Search,
  Filter,
  Download,
  GraduationCap,
  Award,
  BookOpen
} from 'lucide-react';

interface ConsultasModuleProps {
  activeSubTab?: 'RENDIMIENTO' | 'ESTADISTICAS' | 'NOMINAS';
  setActiveSubTab?: (subTab: 'RENDIMIENTO' | 'ESTADISTICAS' | 'NOMINAS') => void;
}

export const ConsultasModule: React.FC<ConsultasModuleProps> = ({
  activeSubTab,
  setActiveSubTab
}) => {
  const { students, evaluations, areas, currentLevel, activeLapso } = useApp();
  const [internalActiveTab, setInternalActiveTab] = useState<'RENDIMIENTO' | 'ESTADISTICAS' | 'NOMINAS'>('RENDIMIENTO');

  const activeTab = activeSubTab || internalActiveTab;
  const setActiveTab = (tab: 'RENDIMIENTO' | 'ESTADISTICAS' | 'NOMINAS') => {
    if (setActiveSubTab) {
      setActiveSubTab(tab);
    }
    setInternalActiveTab(tab);
  };
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cedula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Auditoría y Reportes Centrales
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C2E53] mt-1">Consultas y Rendimiento Estudiantil</h2>
          <p className="text-xs text-slate-500">
            ADM / UCE: Centralización de calificaciones, boletines consolidados e informes estadísticos de rendimiento.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtabs Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('RENDIMIENTO')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'RENDIMIENTO'
                  ? 'bg-[#14232B] text-cyan-300 shadow-sm border border-cyan-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSpreadsheet className={`w-3.5 h-3.5 ${activeTab === 'RENDIMIENTO' ? 'text-cyan-400' : 'text-slate-400'}`} />
              Sábana de Notas
            </button>
            <button
              onClick={() => setActiveTab('ESTADISTICAS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ESTADISTICAS'
                  ? 'bg-[#14232B] text-cyan-300 shadow-sm border border-cyan-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className={`w-3.5 h-3.5 ${activeTab === 'ESTADISTICAS' ? 'text-cyan-400' : 'text-slate-400'}`} />
              Estadísticas
            </button>
            <button
              onClick={() => setActiveTab('NOMINAS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'NOMINAS'
                  ? 'bg-[#14232B] text-cyan-300 shadow-sm border border-cyan-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className={`w-3.5 h-3.5 ${activeTab === 'NOMINAS' ? 'text-cyan-400' : 'text-slate-400'}`} />
              Nómina General
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Imprimir Consulta"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VIEW 1: RENDIMIENTO ESTUDIANTIL CONSOLIDADO */}
      {activeTab === 'RENDIMIENTO' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden print:border-none print:shadow-none print-landscape">
          {/* Official Printable Institutional Header */}
          <div className="hidden print:block mb-3 border-b-2 border-[#2C2E53] pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={`${import.meta.env.BASE_URL}logo-cba.png`}
                  alt="Colegio Bellas Artes"
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-500 block">
                    República Bolivariana de Venezuela • MPPE • Código DEA S0432D2305
                  </span>
                  <h1 className="text-sm font-black text-[#2C2E53] tracking-tight">
                    U.E.P. COLEGIO BELLAS ARTES • SÁBANA OFICIAL DE RENDIMIENTO ESTUDIANTIL
                  </h1>
                </div>
              </div>
              <div className="text-right text-[10px]">
                <span className="font-extrabold text-[#2C2E53] block">LAPSO {activeLapso} • 2026-2027</span>
                <span className="text-slate-500">Maracaibo, Estado Zulia</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-700">Consolidado por Alumno: Lapso {activeLapso}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/15 text-[#94721C]">
                Año Escolar 2026-2027
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1B1C33] text-white uppercase text-[10px] tracking-wider font-extrabold">
                <tr>
                  <th className="py-3.5 px-4">Cédula</th>
                  <th className="py-3.5 px-4">Estudiante</th>
                  <th className="py-3.5 px-4">Grado / Sección</th>
                  <th className="py-3.5 px-4 text-center">Matemáticas</th>
                  <th className="py-3.5 px-4 text-center">Castellano</th>
                  <th className="py-3.5 px-4 text-center">Física</th>
                  <th className="py-3.5 px-4 text-center">Química</th>
                  <th className="py-3.5 px-4 text-center">Promedio Lapso</th>
                  <th className="py-3.5 px-4 text-center">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredStudents.map((stu) => {
                  // Mock calculated scores
                  const isChacin = stu.fullName.includes('Chacín');
                  const isRomero = stu.fullName.includes('Romero');
                  const mathScore = isChacin ? '12' : isRomero ? '14' : '18';
                  const castScore = isChacin ? '15' : '17';
                  const fisScore = isChacin ? '11' : isRomero ? '10' : '19';
                  const quiScore = isChacin ? '13' : '16';
                  const avg = isChacin ? '12.75' : isRomero ? '14.25' : '17.50';

                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#2C2E53]">{stu.cedula}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{stu.fullName}</td>
                      <td className="py-3 px-4">{stu.grade} {stu.section}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold">{mathScore}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold">{castScore}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold">{fisScore}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold">{quiScore}</td>
                      <td className="py-3 px-4 text-center font-mono font-black text-[#2C2E53]">
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                          {avg}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Aprobado
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Printable Official Signatures & Footer */}
          <div className="hidden print:block pt-6 print-signatures">
            <div className="grid grid-cols-3 gap-6 text-center text-[10px]">
              <div className="border-t border-slate-400 pt-1">
                <strong className="block text-[#2C2E53]">Lic. Carolina Sánchez</strong>
                <span className="text-slate-500">Coordinación de Evaluación</span>
              </div>
              <div className="border-t border-slate-400 pt-1">
                <strong className="block text-[#2C2E53]">Prof. Docente Guía</strong>
                <span className="text-slate-500">Docente de Asignatura</span>
              </div>
              <div className="border-t border-slate-400 pt-1">
                <strong className="block text-[#2C2E53]">Dirección Académica CBA</strong>
                <span className="text-slate-500">Sello de Control y Auditoría</span>
              </div>
            </div>
            <div className="mt-3 text-[8px] text-slate-400 font-mono text-center">
              Documento Oficial del Sistema Integral de Control y Evaluación (SICE-CBA) • U.E.P. Colegio Bellas Artes • Emisión: {new Date().toLocaleDateString('es-VE')}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ESTADÍSTICAS */}
      {activeTab === 'ESTADISTICAS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card text-center space-y-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
              Tasa General de Aprobación
            </span>
            <p className="text-4xl font-black text-[#2C2E53]">94.2%</p>
            <p className="text-xs text-emerald-600 font-bold">↑ +2.1% respecto al año anterior</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card text-center space-y-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
              Promedio General Institucional
            </span>
            <p className="text-4xl font-black text-[#D4AF37]">16.8 / 20</p>
            <p className="text-xs text-slate-500 font-semibold">Media General y Primaria</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card text-center space-y-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
              Alumnos con Materias Pendientes
            </span>
            <p className="text-4xl font-black text-amber-600">1</p>
            <p className="text-xs text-amber-700 font-bold">En plan remedial activo</p>
          </div>
        </div>
      )}

      {/* VIEW 3: NÓMINAS */}
      {activeTab === 'NOMINAS' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card space-y-4">
          <h3 className="font-extrabold text-sm text-[#2C2E53]">Nómina Completa y Representantes Legales</h3>
          <div className="space-y-2">
            {students.map((stu) => (
              <div
                key={stu.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div>
                  <p className="font-bold text-xs text-slate-900">{stu.fullName} ({stu.cedula})</p>
                  <p className="text-[11px] text-slate-500">
                    {stu.grade} {stu.section} • Representante: <strong>{stu.representativeName}</strong>
                  </p>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <p className="font-mono">{stu.representativePhone}</p>
                  <p>{stu.representativeEmail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
