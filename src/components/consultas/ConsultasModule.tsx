import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BoletinInformativoView } from '../communication/BoletinInformativoView';
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
  BookOpen,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

export type ConsultasSubTab = 'RENDIMIENTO' | 'BOLETIN' | 'ASISTENCIA' | 'ESTADISTICAS' | 'NOMINAS';

interface ConsultasModuleProps {
  activeSubTab?: ConsultasSubTab;
  setActiveSubTab?: (subTab: ConsultasSubTab) => void;
}

export const ConsultasModule: React.FC<ConsultasModuleProps> = ({
  activeSubTab,
  setActiveSubTab
}) => {
  const { students, evaluations, areas, currentLevel, activeLapso, currentRole, passes } = useApp();
  const [internalActiveTab, setInternalActiveTab] = useState<ConsultasSubTab>('RENDIMIENTO');

  const activeTab = activeSubTab || internalActiveTab;
  const setActiveTab = (tab: ConsultasSubTab) => {
    if (setActiveSubTab) {
      setActiveSubTab(tab);
    }
    setInternalActiveTab(tab);
  };
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.representativeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isFamilyOrStudent = currentRole === 'REPRESENTANTE' || currentRole === 'ESTUDIANTE';

  return (
    <div className="space-y-6">
      {/* Role-Specific Consultas Welcome Banner for Representante / Estudiante */}
      {isFamilyOrStudent && (
        <div className="bg-gradient-to-r from-[#2C2E53] via-[#1E2142] to-[#2C2E53] p-5 rounded-2xl border border-[#D4AF37]/40 shadow-xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#D4AF37] text-[#1B1C33] font-black flex items-center justify-center shrink-0 shadow-md">
              {currentRole === 'REPRESENTANTE' ? <Users className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                  {currentRole === 'REPRESENTANTE' ? 'Portal Oficial de Padres y Representantes' : 'Portal Oficial del Estudiante'}
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Acceso Exclusivo a Consultas
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-0.5">
                {currentRole === 'REPRESENTANTE'
                  ? 'Consulta Académica y Seguimiento de su Representado'
                  : 'Consulta de Calificaciones, Rendimiento y Asistencia'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Usted dispone de acceso en tiempo real a la sábana de notas, boletines informativos oficiales, estadísticas y récord de asistencias.
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-bold text-slate-300 block">Año Escolar Activo</span>
            <span className="text-xs font-black text-[#D4AF37] uppercase tracking-wider">2026 - 2027 • Lapso {activeLapso}</span>
          </div>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Auditoría, Boletines y Reportes Centrales
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C2E53] dark:text-white mt-1">
            Consultas y Rendimiento Estudiantil
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Centralización de calificaciones, emisión de boletines, estadísticas de rendimiento y control de asistencia.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition border border-slate-200 dark:border-slate-700 shadow-sm"
            title="Imprimir Consulta"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Imprimir Consulta</span>
          </button>
        </div>
      </div>

      {/* Full-Width Responsive Subtabs Navigation Bar (No text truncation) */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* 1. Sábana de Notas */}
        <button
          onClick={() => setActiveTab('RENDIMIENTO')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'RENDIMIENTO'
              ? 'bg-[#14232B] text-cyan-300 shadow-sm border border-cyan-500/40 ring-1 ring-cyan-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileSpreadsheet className={`w-4 h-4 shrink-0 ${activeTab === 'RENDIMIENTO' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span>Sábana de Notas</span>
        </button>

        {/* 2. Boletín Informativo */}
        <button
          onClick={() => setActiveTab('BOLETIN')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'BOLETIN'
              ? 'bg-[#14232B] text-cyan-300 shadow-sm border border-cyan-500/40 ring-1 ring-cyan-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className={`w-4 h-4 shrink-0 ${activeTab === 'BOLETIN' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span>Boletín Oficial</span>
        </button>

        {/* 3. Asistencia y Pases */}
        <button
          onClick={() => setActiveTab('ASISTENCIA')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'ASISTENCIA'
              ? 'bg-[#14232B] text-cyan-300 shadow-sm border border-cyan-500/40 ring-1 ring-cyan-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className={`w-4 h-4 shrink-0 ${activeTab === 'ASISTENCIA' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span>Asistencia & Pases</span>
        </button>

        {/* 4. Estadísticas */}
        <button
          onClick={() => setActiveTab('ESTADISTICAS')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'ESTADISTICAS'
              ? 'bg-[#14232B] text-cyan-300 shadow-sm border border-cyan-500/40 ring-1 ring-cyan-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className={`w-4 h-4 shrink-0 ${activeTab === 'ESTADISTICAS' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span>Estadísticas</span>
        </button>

        {/* 5. Nóminas / Expedientes */}
        <button
          onClick={() => setActiveTab('NOMINAS')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'NOMINAS'
              ? 'bg-[#14232B] text-cyan-300 shadow-sm border border-cyan-500/40 ring-1 ring-cyan-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className={`w-4 h-4 shrink-0 ${activeTab === 'NOMINAS' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span>Expedientes</span>
        </button>
      </div>

      {/* VIEW 1: RENDIMIENTO ESTUDIANTIL CONSOLIDADO (SÁBANA) */}
      {activeTab === 'RENDIMIENTO' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-cba-card overflow-hidden print:border-none print:shadow-none print-landscape">
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

          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                Consolidado por Alumno: Lapso {activeLapso}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/15 text-[#94721C] dark:text-amber-300">
                Año Escolar 2026-2027
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar estudiante, cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
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
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                {filteredStudents.map((stu) => {
                  const isChacin = stu.fullName.includes('Chacín');
                  const isRomero = stu.fullName.includes('Romero');
                  const mathScore = isChacin ? '12' : isRomero ? '14' : '18';
                  const castScore = isChacin ? '15' : '17';
                  const fisScore = isChacin ? '11' : isRomero ? '10' : '19';
                  const quiScore = isChacin ? '13' : '16';
                  const avg = isChacin ? '12.75' : isRomero ? '14.25' : '17.50';

                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#2C2E53] dark:text-amber-300">{stu.cedula}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{stu.fullName}</td>
                      <td className="py-3 px-4">{stu.grade} {stu.section}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold">{mathScore}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold">{castScore}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold">{fisScore}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold">{quiScore}</td>
                      <td className="py-3 px-4 text-center font-mono font-black text-[#2C2E53] dark:text-white">
                        <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                          {avg}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
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

      {/* VIEW 2: BOLETÍN OFICIAL DE CALIFICACIONES (Reutiliza el componente oficial) */}
      {activeTab === 'BOLETIN' && (
        <div className="space-y-4">
          <BoletinInformativoView />
        </div>
      )}

      {/* VIEW 3: ASISTENCIA Y PASES POR RETRASO */}
      {activeTab === 'ASISTENCIA' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Pases Registrados</span>
              <span className="text-3xl font-black text-[#2C2E53] dark:text-white mt-1 block">{passes.length}</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">100% justificados formalmente</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Índice de Puntualidad</span>
              <span className="text-3xl font-black text-[#D4AF37] mt-1 block">97.8%</span>
              <span className="text-[11px] text-slate-500 font-semibold">Dentro del umbral institucional CBA</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Notificación a Representantes</span>
              <span className="text-3xl font-black text-emerald-600 mt-1 block">Activa</span>
              <span className="text-[11px] text-slate-500 font-semibold">Vía SMS y correo oficial</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-cba-card overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[#2C2E53] dark:text-white">
                Historial de Pases por Retraso y Novedades de Asistencia
              </h3>
              <span className="text-xs font-bold text-slate-400">{passes.length} registros</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1B1C33] text-white uppercase text-[10px] tracking-wider font-extrabold">
                  <tr>
                    <th className="py-3 px-4">Estudiante</th>
                    <th className="py-3 px-4">Fecha y Hora</th>
                    <th className="py-3 px-4">Motivo Informado</th>
                    <th className="py-3 px-4">Autorizado Por</th>
                    <th className="py-3 px-4 text-center">Estado Notificación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {passes.map((pass) => (
                    <tr key={pass.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {pass.studentName}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {pass.date} • {pass.time}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {pass.reason}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {pass.authorizedBy}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {pass.printed ? `✓ Notificado (${pass.ticketNumber})` : `✓ Registrado (${pass.ticketNumber})`}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {passes.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                        No hay pases ni inasistencias registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: ESTADÍSTICAS */}
      {activeTab === 'ESTADISTICAS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card text-center space-y-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
              Tasa General de Aprobación
            </span>
            <p className="text-4xl font-black text-[#2C2E53] dark:text-white">94.2%</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">↑ +2.1% respecto al año anterior</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card text-center space-y-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
              Promedio General Institucional
            </span>
            <p className="text-4xl font-black text-[#D4AF37]">16.8 / 20</p>
            <p className="text-xs text-slate-500 font-semibold">Media General y Primaria</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card text-center space-y-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
              Alumnos con Materias Pendientes
            </span>
            <p className="text-4xl font-black text-amber-600">1</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 font-bold">En plan remedial activo</p>
          </div>
        </div>
      )}

      {/* VIEW 5: EXPEDIENTES / NÓMINAS */}
      {activeTab === 'NOMINAS' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-sm text-[#2C2E53] dark:text-white">
                Nómina Estudiantil y Datos de Representantes Legales
              </h3>
              <p className="text-xs text-slate-500">Expediente formal registrado ante el Control de Estudios (UCE).</p>
            </div>
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filtrar por nombre o representante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
              />
            </div>
          </div>
          <div className="space-y-2">
            {filteredStudents.map((stu) => (
              <div
                key={stu.id}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-white">{stu.fullName} ({stu.cedula})</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {stu.grade} {stu.section} • Representante: <strong className="text-slate-700 dark:text-slate-200">{stu.representativeName}</strong>
                  </p>
                </div>
                <div className="text-right text-[11px] text-slate-500 dark:text-slate-400">
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
