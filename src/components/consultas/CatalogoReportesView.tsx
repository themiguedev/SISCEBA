import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CATALOGO_REPORTES_CEO,
  CategoriaReporte,
  ReporteItem,
  getReportesImpresionesMap,
  incrementReporteImpresiones
} from '../../data/reportesCEOData';
import { Student } from '../../types';
import { OfficialFormatType } from '../common/OfficialFormatPrintModal';
import { ReporteInstitucionalModal } from './ReporteInstitucionalModal';
import {
  Printer,
  Search,
  Filter,
  FileText,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Layers,
  Award,
  CheckCircle2,
  Clock,
  ArrowLeft
} from 'lucide-react';

interface CatalogoReportesViewProps {
  students: Student[];
  onNavigateToBoletin?: (subsystem?: string) => void;
  onOpenOficialFormat?: (format: OfficialFormatType) => void;
}

export const CatalogoReportesView: React.FC<CatalogoReportesViewProps> = ({
  students,
  onNavigateToBoletin,
  onOpenOficialFormat
}) => {
  const { currentRole, addAuditLog } = useApp();

  // Mapa de impresiones persistido
  const [impresionesMap, setImpresionesMap] = useState<Record<string, number>>(() => {
    return getReportesImpresionesMap();
  });

  // Filtros del catálogo
  const [activeCategory, setActiveCategory] = useState<CategoriaReporte | 'TODOS'>('ADMINISTRADOR');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<'nombre' | 'impresiones'>('nombre');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Estado del modal de reporte institucional
  const [activeReporteModal, setActiveReporteModal] = useState<ReporteItem | null>(null);

  // Estado para el panel de configuración de filtros del reporte seleccionado (idéntico a C.E.O.)
  const [selectedReportForFilter, setSelectedReportForFilter] = useState<ReporteItem | null>(null);

  // Parámetros de filtros de reporte (idénticos a las pantallas de C.E.O.)
  const [filtroAno, setFiltroAno] = useState<string>('');
  const [filtroLapso, setFiltroLapso] = useState<number>(0);
  const [filtroGrado, setFiltroGrado] = useState<string>('');
  const [filtroSeccion, setFiltroSeccion] = useState<'A' | 'B' | 'TODAS' | ''>('');
  const [filtroPromedio, setFiltroPromedio] = useState<string>('Interno');
  const [filtroNotaMin, setFiltroNotaMin] = useState<string>('');
  const [filtroNotaMax, setFiltroNotaMax] = useState<string>('');
  const [filtroSexo, setFiltroSexo] = useState<string>('Todos');
  const [filtroOrden, setFiltroOrden] = useState<string>('Apellidos y Nombres');

  // Filtrado y ordenamiento de reportes
  const filteredReportes = useMemo(() => {
    let list = [...CATALOGO_REPORTES_CEO];

    // Filtro por categoría
    if (activeCategory === 'ADMINISTRADOR') {
      list = list.filter((r) => r.categoria === 'ADMINISTRADOR');
    } else if (activeCategory === 'DOCENTE') {
      list = list.filter((r) => r.categoria === 'DOCENTE' || r.ambitoDocente);
    } else if (activeCategory === 'CONTROL_EVALUACION') {
      list = list.filter((r) => r.categoria === 'CONTROL_EVALUACION' || r.ambitoControlEstudios);
    }

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.nombre.toLowerCase().includes(term) ||
          r.descripcion.toLowerCase().includes(term) ||
          r.categoriaLabel.toLowerCase().includes(term) ||
          (r.codigoReporte && r.codigoReporte.toLowerCase().includes(term))
      );
    }

    // Ordenamiento
    list.sort((a, b) => {
      if (sortField === 'nombre') {
        const cmp = a.nombre.localeCompare(b.nombre, 'es');
        return sortOrder === 'asc' ? cmp : -cmp;
      } else {
        const countA = impresionesMap[a.id] ?? a.impresionesDefault;
        const countB = impresionesMap[b.id] ?? b.impresionesDefault;
        return sortOrder === 'asc' ? countA - countB : countB - countA;
      }
    });

    return list;
  }, [activeCategory, searchTerm, sortField, sortOrder, impresionesMap]);

  // Paginación
  const totalRecords = filteredReportes.length;
  const totalPages = pageSize === 9999 ? 1 : Math.ceil(totalRecords / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedReportes = useMemo(() => {
    if (pageSize === 9999) return filteredReportes;
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredReportes.slice(start, start + pageSize);
  }, [filteredReportes, safeCurrentPage, pageSize]);

  // Manejador de apertura del panel de filtros de un reporte (idéntico a la acción en C.E.O.)
  const openFilterPanel = (reporte: ReporteItem) => {
    setSelectedReportForFilter(reporte);
    setFiltroAno('');
    setFiltroLapso(0);
    setFiltroGrado('');
    setFiltroSeccion('');
    setFiltroPromedio('Interno');
    setFiltroNotaMin('');
    setFiltroNotaMax('');
    setFiltroSexo('Todos');
    setFiltroOrden('Apellidos y Nombres');
  };

  // Grados disponibles para el reporte seleccionado
  const availableGradesForSelectedReport = useMemo(() => {
    if (!selectedReportForFilter) return [];
    if (selectedReportForFilter.nivel === 'INICIAL') {
      return ['Maternal', 'Preescolar 1', 'Preescolar 2', 'Preescolar 3'];
    }
    if (selectedReportForFilter.nivel === 'PRIMARIA') {
      return ['1er Grado', '2do Grado', '3er Grado', '4to Grado', '5to Grado', '6to Grado'];
    }
    if (selectedReportForFilter.nivel === 'MEDIA_GENERAL') {
      return ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'];
    }
    return [
      'Preescolar 3',
      '1er Grado',
      '2do Grado',
      '3er Grado',
      '4to Grado',
      '5to Grado',
      '6to Grado',
      '1er Año',
      '2do Año',
      '3er Año',
      '4to Año',
      '5to Año'
    ];
  }, [selectedReportForFilter]);

  // Manejador de emisión / generación física del reporte
  const handlePrintClick = (reporte: ReporteItem) => {
    // Si tiene un formato oficial asociado y se pasó callback
    if (reporte.formatoOficialId && onOpenOficialFormat) {
      const next = incrementReporteImpresiones(reporte.id);
      setImpresionesMap((prev) => ({ ...prev, [reporte.id]: next }));
      if (addAuditLog) {
        addAuditLog(
          `EMISION_REPORTE_${reporte.codigoReporte || reporte.id}`,
          `Generación de formato oficial: ${reporte.nombre}`
        );
      }
      onOpenOficialFormat(reporte.formatoOficialId);
      return;
    }

    // Si es un boletín y se pasó callback de navegación
    if (reporte.tipoAccion === 'BOLETIN' && onNavigateToBoletin) {
      const next = incrementReporteImpresiones(reporte.id);
      setImpresionesMap((prev) => ({ ...prev, [reporte.id]: next }));
      if (addAuditLog) {
        addAuditLog(
          `EMISION_REPORTE_${reporte.codigoReporte || reporte.id}`,
          `Acceso a módulo de boletín oficial: ${reporte.nombre}`
        );
      }
      onNavigateToBoletin(reporte.subsystem);
      return;
    }

    // Por defecto: abre el modal oficial de impresión institucional con los parámetros configurados
    setActiveReporteModal(reporte);
  };

  const handleGenerarReporte = () => {
    if (!selectedReportForFilter) return;
    handlePrintClick(selectedReportForFilter);
  };

  const handlePrintIncrement = (reporteId: string, newCount: number) => {
    setImpresionesMap((prev) => ({ ...prev, [reporteId]: newCount }));
  };

  const toggleSort = (field: 'nombre' | 'impresiones') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'impresiones' ? 'desc' : 'asc');
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* TÍTULO Y DESCRIPCIÓN (IDÉNTICO A C.E.O.) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-cba-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
              <span>Reportes</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Visualice los reportes o informes existentes en el sistema.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>C.E.O. Control Estudiantil Online • U.E. Bellas Artes</span>
          </div>
        </div>

        {/* Chips de selección de Categoría */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setActiveCategory('ADMINISTRADOR');
              setSelectedReportForFilter(null);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              activeCategory === 'ADMINISTRADOR'
                ? 'bg-[#2C2E53] text-[#D4AF37] border-[#2C2E53] shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            Administrador del Sistema ({CATALOGO_REPORTES_CEO.filter((r) => r.categoria === 'ADMINISTRADOR').length})
          </button>

          <button
            onClick={() => {
              setActiveCategory('TODOS');
              setSelectedReportForFilter(null);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              activeCategory === 'TODOS'
                ? 'bg-[#2C2E53] text-[#D4AF37] border-[#2C2E53] shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            Todos los Reportes ({CATALOGO_REPORTES_CEO.length})
          </button>

          <button
            onClick={() => {
              setActiveCategory('DOCENTE');
              setSelectedReportForFilter(null);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              activeCategory === 'DOCENTE'
                ? 'bg-[#2C2E53] text-[#D4AF37] border-[#2C2E53] shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            Reportes Docente ({CATALOGO_REPORTES_CEO.filter((r) => r.categoria === 'DOCENTE' || r.ambitoDocente).length})
          </button>

          <button
            onClick={() => {
              setActiveCategory('CONTROL_EVALUACION');
              setSelectedReportForFilter(null);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              activeCategory === 'CONTROL_EVALUACION'
                ? 'bg-[#2C2E53] text-[#D4AF37] border-[#2C2E53] shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            Control y Evaluación ({CATALOGO_REPORTES_CEO.filter((r) => r.categoria === 'CONTROL_EVALUACION' || r.ambitoControlEstudios).length})
          </button>
        </div>
      </div>

      {/* CASO A: PANEL OFICIAL DE FILTROS DEL REPORTE (IDÉNTICO A LA CAPTURA "LITERALES POR RANGO") */}
      {selectedReportForFilter ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-cba-card overflow-hidden animate-in fade-in duration-150">
          {/* ENCABEZADO CON TÍTULO EN MAYÚSCULAS Y SUBRAYADO NARANJA */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="inline-block border-b-2 border-orange-500 pb-1">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {selectedReportForFilter.nombre}
              </h2>
            </div>

            <button
              onClick={() => setSelectedReportForFilter(null)}
              className="px-3.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver Reportes Disponibles</span>
            </button>
          </div>

          {/* BARRA DE BOTONES SUPERIOR */}
          <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={handleGenerarReporte}
              className="px-5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded shadow-xs transition active:scale-95 cursor-pointer"
            >
              Generar
            </button>
            <button
              onClick={() => setSelectedReportForFilter(null)}
              className="px-5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 font-bold text-xs rounded transition active:scale-95 cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          {/* FORMULARIO DE PARÁMETROS TABULAR (DISEÑO 1:1 CON C.E.O.) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <tbody>
                {/* 1. Año Escolar */}
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="w-52 py-3 px-5 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-800/30">
                    Año Escolar
                  </td>
                  <td className="py-2.5 px-5">
                    <select
                      value={filtroAno}
                      onChange={(e) => setFiltroAno(e.target.value)}
                      className="w-full max-w-xl px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                    >
                      <option value="">Año Escolar</option>
                      <option value="2025 - 2026">2025 - 2026</option>
                      <option value="2026 - 2027">2026 - 2027</option>
                      <option value="2024 - 2025">2024 - 2025</option>
                    </select>
                  </td>
                </tr>

                {/* 2. Lapsos */}
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="py-3 px-5 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-800/30">
                    Lapsos
                  </td>
                  <td className="py-2.5 px-5">
                    <select
                      value={filtroLapso}
                      onChange={(e) => setFiltroLapso(Number(e.target.value))}
                      className="w-full max-w-xl px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                    >
                      <option value={0}>Lapso</option>
                      <option value={1}>Lapso 1</option>
                      <option value={2}>Lapso 2</option>
                      <option value={3}>Lapso 3</option>
                    </select>
                  </td>
                </tr>

                {/* 3. Grado */}
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="py-3 px-5 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-800/30">
                    Grado
                  </td>
                  <td className="py-2.5 px-5">
                    <select
                      value={filtroGrado}
                      onChange={(e) => setFiltroGrado(e.target.value)}
                      className="w-full max-w-xl px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                    >
                      <option value="">Grado</option>
                      {availableGradesForSelectedReport.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </td>
                </tr>

                {/* 4. Sección */}
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="py-3 px-5 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-800/30">
                    Sección
                  </td>
                  <td className="py-2.5 px-5">
                    <select
                      value={filtroSeccion}
                      onChange={(e) => setFiltroSeccion(e.target.value as 'A' | 'B' | 'TODAS' | '')}
                      className="w-full max-w-xl px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                    >
                      <option value="">Sección</option>
                      <option value="A">Sección "A"</option>
                      <option value="B">Sección "B"</option>
                      <option value="TODAS">Todas las Secciones</option>
                    </select>
                  </td>
                </tr>

                {/* 5. Promedio */}
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="py-3 px-5 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-800/30">
                    Promedio
                  </td>
                  <td className="py-2.5 px-5">
                    <select
                      value={filtroPromedio}
                      onChange={(e) => setFiltroPromedio(e.target.value)}
                      className="w-full max-w-xl px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                    >
                      <option value="Interno">Interno</option>
                      <option value="Mismo">Mismo</option>
                      <option value="Definitivo">Definitivo</option>
                    </select>
                  </td>
                </tr>

                {/* 6 y 7. Nota Mínima y Nota Máxima (Exclusivo para reportes por rango) */}
                {selectedReportForFilter.nombre.toLowerCase().includes('rango') && (
                  <>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <td className="py-3 px-5 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-800/30">
                        Nota Mínima
                      </td>
                      <td className="py-2.5 px-5">
                        <input
                          type="text"
                          maxLength={4}
                          value={filtroNotaMin}
                          onChange={(e) => setFiltroNotaMin(e.target.value)}
                          placeholder="01 / A"
                          className="w-20 px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-center font-bold focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </td>
                    </tr>

                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <td className="py-3 px-5 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-800/30">
                        Nota Máxima
                      </td>
                      <td className="py-2.5 px-5">
                        <input
                          type="text"
                          maxLength={4}
                          value={filtroNotaMax}
                          onChange={(e) => setFiltroNotaMax(e.target.value)}
                          placeholder="20 / E"
                          className="w-20 px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-center font-bold focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </td>
                    </tr>
                  </>
                )}

                {/* 8. Sexo */}
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="py-3 px-5 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-800/30">
                    Sexo
                  </td>
                  <td className="py-2.5 px-5">
                    <select
                      value={filtroSexo}
                      onChange={(e) => setFiltroSexo(e.target.value)}
                      className="w-full max-w-xl px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                    >
                      <option value="Todos">Todos</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Masculino">Masculino</option>
                    </select>
                  </td>
                </tr>

                {/* 9. Orden */}
                <tr>
                  <td className="py-3 px-5 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-800/30">
                    Orden
                  </td>
                  <td className="py-2.5 px-5">
                    <select
                      value={filtroOrden}
                      onChange={(e) => setFiltroOrden(e.target.value)}
                      className="w-full max-w-xl px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                    >
                      <option value="Apellidos y Nombres">Apellidos y Nombres</option>
                      <option value="Cédula de Identidad">Cédula de Identidad</option>
                      <option value="Calificación / Literal">Calificación / Literal</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BARRA DE BOTONES INFERIOR */}
          <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={handleGenerarReporte}
              className="px-5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded shadow-xs transition active:scale-95 cursor-pointer"
            >
              Generar
            </button>
            <button
              onClick={() => setSelectedReportForFilter(null)}
              className="px-5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 font-bold text-xs rounded transition active:scale-95 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        /* CASO B: TABLA DEL CATÁLOGO DE 89 REPORTES (FORMATO EXACTO DE LAS FOTOS) */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-cba-card overflow-hidden">
          {/* ENCABEZADO DE SECCIÓN CON LÍNEA NARANJA/DORADA CARACTERÍSTICA */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
            <div className="inline-block border-b-2 border-orange-500 pb-1">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {activeCategory === 'TODOS'
                  ? 'CATÁLOGO GENERAL DE REPORTES E INFORMES'
                  : activeCategory === 'ADMINISTRADOR'
                  ? 'REPORTES ADMINISTRADOR DEL SISTEMA'
                  : activeCategory === 'DOCENTE'
                  ? 'REPORTES DOCENTE'
                  : 'REPORTES CONTROL Y EVALUACION'}
              </h2>
            </div>

            {/* BARRA DE HERRAMIENTAS: "Mostrando X registros" y "Buscar:" (Estilo DataTables C.E.O.) */}
            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
              {/* Selector de registros */}
              <div className="flex items-center gap-2">
                <span>Mostrando</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={9999}>Todos</option>
                </select>
                <span>registros</span>
              </div>

              {/* Input de búsqueda */}
              <div className="flex items-center gap-2">
                <span className="font-bold">Buscar:</span>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder=""
                    className="w-44 sm:w-56 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* TABLA PRINCIPAL DE DATOS */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                  {/* Columna Descripción */}
                  <th
                    onClick={() => toggleSort('nombre')}
                    className="p-3.5 cursor-pointer hover:text-orange-500 transition select-none"
                  >
                    <div className="flex items-center justify-between">
                      <span>Descripción del Reporte</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>

                  {/* Columna Impresiones */}
                  <th
                    onClick={() => toggleSort('impresiones')}
                    className="p-3.5 w-32 text-right cursor-pointer hover:text-orange-500 transition select-none"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Impresiones</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>

                  {/* Columna Imprimir */}
                  <th className="p-3.5 w-24 text-center">
                    <span>Imprimir</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {paginatedReportes.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-400 italic">
                      No se encontraron reportes que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  paginatedReportes.map((reporte) => {
                    const impressions = impresionesMap[reporte.id] ?? reporte.impresionesDefault;
                    return (
                      <tr
                        key={reporte.id}
                        onClick={() => openFilterPanel(reporte)}
                        className="hover:bg-amber-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                        title="Haga clic para configurar filtros y emitir reporte"
                      >
                        {/* Descripción */}
                        <td className="p-3.5">
                          <div className="flex items-start gap-2.5">
                            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0 mt-0.5 group-hover:bg-[#2C2E53] group-hover:text-[#D4AF37] transition">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-[13px] group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                                  {reporte.nombre}
                                </span>
                                {reporte.codigoReporte && (
                                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                    {reporte.codigoReporte}
                                  </span>
                                )}
                                {reporte.nivel !== 'TODOS' && (
                                  <span className="text-[9.5pt] sm:text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                                    {reporte.nivel === 'INICIAL' ? 'Inicial' : reporte.nivel === 'PRIMARIA' ? 'Primaria' : 'Media General'}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                {reporte.descripcion}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Impresiones */}
                        <td className="p-3.5 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                            {impressions}
                          </span>
                        </td>

                        {/* Botón Imprimir (Exacto a las capturas C.E.O.) */}
                        <td className="p-3.5 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openFilterPanel(reporte);
                            }}
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 inline-flex items-center justify-center shadow-2xs"
                            title={`Configurar e imprimir reporte: ${reporte.nombre}`}
                          >
                            <Printer className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PIE DE TABLA Y PAGINACIÓN (IDÉNTICO A LAS CAPTURAS) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div>
              Mostrando de{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {totalRecords === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}
              </strong>{' '}
              a{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {Math.min(safeCurrentPage * pageSize, totalRecords)}
              </strong>{' '}
              de <strong className="text-slate-800 dark:text-slate-200">{totalRecords}</strong> registros
            </div>

            {/* Botones de paginación */}
            <div className="flex items-center gap-1 flex-wrap">
              <button
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition"
              >
                Primero
              </button>
              <button
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition"
              >
                Anterior
              </button>

              {/* Números de página con ventana deslizante de 5 botones (idéntico a DataTables C.E.O.) */}
              {(() => {
                const maxButtons = 5;
                if (totalPages <= maxButtons) {
                  return Array.from({ length: totalPages }, (_, i) => i + 1);
                }
                let start = Math.max(1, safeCurrentPage - Math.floor(maxButtons / 2));
                let end = start + maxButtons - 1;
                if (end > totalPages) {
                  end = totalPages;
                  start = Math.max(1, end - maxButtons + 1);
                }
                return Array.from({ length: end - start + 1 }, (_, i) => start + i);
              })().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded text-xs font-bold transition ${
                    safeCurrentPage === page
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={safeCurrentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition"
              >
                Siguiente
              </button>
              <button
                disabled={safeCurrentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(totalPages)}
                className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition"
              >
                Último
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Institucional de Emisión e Impresión */}
      {activeReporteModal && (
        <ReporteInstitucionalModal
          isOpen={Boolean(activeReporteModal)}
          onClose={() => setActiveReporteModal(null)}
          reporte={activeReporteModal}
          studentsList={students}
          onPrintIncrement={handlePrintIncrement}
          initialGrade={filtroGrado || (availableGradesForSelectedReport[0] || '1er Grado')}
          initialSection={(filtroSeccion as 'A' | 'B' | 'TODAS') || 'A'}
          initialLapso={filtroLapso > 0 ? filtroLapso : 1}
          filtroSexo={filtroSexo}
          filtroNotaMin={filtroNotaMin}
          filtroNotaMax={filtroNotaMax}
          filtroOrden={filtroOrden}
        />
      )}
    </div>
  );
};
