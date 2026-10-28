import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CATALOGO_REPORTES_CEO,
  CategoriaReporte,
  ReporteItem,
  getReportesImpresionesMap,
  incrementReporteImpresiones,
  getMergedReportesCatalog,
  saveReporteConfig,
  ReporteConfigOverrides
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
  ArrowLeft,
  Edit3,
  Sliders,
  Settings
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

  // Catálogo reactivo con configuraciones persistidas en navegador
  const [catalogItems, setCatalogItems] = useState<ReporteItem[]>(() => getMergedReportesCatalog());

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

  // Estado para el panel de MODIFICAR REGISTRO (idéntico a la captura de Fichas de los Alumnos)
  const [selectedReportForEdit, setSelectedReportForEdit] = useState<ReporteItem | null>(null);
  const [editNombre, setEditNombre] = useState<string>('');
  const [editUrl, setEditUrl] = useState<string>('');
  const [editOrden, setEditOrden] = useState<number | string>(0);
  const [editVisible, setEditVisible] = useState<'SI' | 'NO'>('SI');
  const [editDescripcion, setEditDescripcion] = useState<string>('');
  const [editFondoCabecera, setEditFondoCabecera] = useState<string>('79,130,187');
  const [editLetrasCabecera, setEditLetrasCabecera] = useState<string>('255,255,255');
  const [editFondoFilaPar, setEditFondoFilaPar] = useState<string>('255,255,255');
  const [editFondoFilaImpar, setEditFondoFilaImpar] = useState<string>('223,232,244');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Helpers de color (conversión entre 'R,G,B', 'rgb(...)', y '#HEX')
  const rgbStringToHex = (rgbStr: string): string => {
    const parts = (rgbStr || '').split(',').map((p) => parseInt(p.trim(), 10));
    if (parts.length < 3 || parts.some(isNaN)) return '#4F82BB';
    const r = Math.max(0, Math.min(255, parts[0]));
    const g = Math.max(0, Math.min(255, parts[1]));
    const b = Math.max(0, Math.min(255, parts[2]));
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
  };

  const hexToRgbString = (hex: string): string => {
    const clean = hex.replace('#', '');
    if (clean.length !== 6) return '79,130,187';
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `${r},${g},${b}`;
  };

  const toCssRgb = (rgbStr: string, fallback: string = '#4F82BB'): string => {
    const parts = (rgbStr || '').split(',').map((p) => parseInt(p.trim(), 10));
    if (parts.length < 3 || parts.some(isNaN)) return fallback;
    return `rgb(${parts[0]}, ${parts[1]}, ${parts[2]})`;
  };

  // Apertura del panel de MODIFICAR REGISTRO con valores del reporte
  const openModificarRegistro = (reporte: ReporteItem) => {
    setSelectedReportForEdit(reporte);
    setSelectedReportForFilter(null);
    setEditNombre(reporte.nombre || '');
    setEditUrl(reporte.url || `uce_reporte_${reporte.id.replace(/^adm-/, '').replace(/-/g, '_')}.php`);
    setEditOrden(reporte.orden !== undefined ? reporte.orden : 0);
    setEditVisible(reporte.visible || 'SI');
    setEditDescripcion(reporte.descripcion || '');
    setEditFondoCabecera(reporte.fondoCabecera || '79,130,187');
    setEditLetrasCabecera(reporte.letrasCabecera || '255,255,255');
    setEditFondoFilaPar(reporte.fondoFilaPar || '255,255,255');
    setEditFondoFilaImpar(reporte.fondoFilaImpar || '223,232,244');
    setSaveSuccessMsg(null);
  };

  // Guardado de MODIFICAR REGISTRO con persistencia
  const handleGuardarModificacion = () => {
    if (!selectedReportForEdit) return;

    const parsedOrden = typeof editOrden === 'number' ? editOrden : parseInt(String(editOrden), 10);
    const overrides: ReporteConfigOverrides = {
      nombre: editNombre.trim() || selectedReportForEdit.nombre,
      url: editUrl.trim() || selectedReportForEdit.url || `uce_reporte_${selectedReportForEdit.id.replace(/^adm-/, '').replace(/-/g, '_')}.php`,
      orden: isNaN(parsedOrden) ? 0 : parsedOrden,
      visible: editVisible,
      descripcion: editDescripcion.trim(),
      fondoCabecera: editFondoCabecera.trim() || '79,130,187',
      letrasCabecera: editLetrasCabecera.trim() || '255,255,255',
      fondoFilaPar: editFondoFilaPar.trim() || '255,255,255',
      fondoFilaImpar: editFondoFilaImpar.trim() || '223,232,244'
    };

    saveReporteConfig(selectedReportForEdit.id, overrides);
    const updatedCatalog = getMergedReportesCatalog();
    setCatalogItems(updatedCatalog);

    const updatedSelected = updatedCatalog.find((r) => r.id === selectedReportForEdit.id);
    if (updatedSelected) {
      setSelectedReportForEdit(updatedSelected);
    }

    if (addAuditLog) {
      addAuditLog(
        `MODIFICAR_REGISTRO_${selectedReportForEdit.codigoReporte || selectedReportForEdit.id}`,
        `Se modificaron los parámetros del reporte "${editNombre}" (Url: ${editUrl}, Orden: ${editOrden}, Visible: ${editVisible})`
      );
    }

    setSaveSuccessMsg('Registro modificado exitosamente en el sistema.');
    setTimeout(() => {
      setSaveSuccessMsg(null);
    }, 4500);
  };

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
    let list = [...catalogItems];

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
    // Si es sabana de promedios, abrir en ReporteInstitucionalModal para disponer de la barra interactiva de Consejo de Curso (Previo vs Definitivo), Lapsos y filtros avanzados
    if (reporte.id === 'adm-promedios-seccion-sabana' || reporte.id === 'adm-promedios') {
      const next = incrementReporteImpresiones(reporte.id);
      setImpresionesMap((prev) => ({ ...prev, [reporte.id]: next }));
      if (addAuditLog) {
        addAuditLog(
          `EMISION_REPORTE_${reporte.codigoReporte || reporte.id}`,
          `Generación de Sábana de Promedios por Sección: ${reporte.nombre}`
        );
      }
      setActiveReporteModal(reporte);
      return;
    }

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

  if (currentRole !== 'ADMINISTRADOR') {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <Printer className="w-10 h-10 text-[#D4AF37] mx-auto mb-3 opacity-80" />
        <h3 className="text-base font-bold text-slate-800 dark:text-white">Acceso Reservado</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          El Catálogo Oficial de Reportes (C.E.O.) está disponible únicamente para usuarios con el rol de Administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* TÍTULO Y DESCRIPCIÓN (IDÉNTICO A C.E.O.) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-cba-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#2C2E53] dark:text-white flex items-center gap-2">
              <span>Reportes</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {activeCategory === 'ADMINISTRADOR'
                ? 'ADM: Administra los reportes del sistema'
                : 'Visualice los reportes o informes existentes en el sistema.'}
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
              setSelectedReportForEdit(null);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              activeCategory === 'ADMINISTRADOR'
                ? 'bg-[#2C2E53] text-[#D4AF37] border-[#2C2E53] shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            Administrador del Sistema ({catalogItems.filter((r) => r.categoria === 'ADMINISTRADOR').length})
          </button>

          <button
            onClick={() => {
              setActiveCategory('TODOS');
              setSelectedReportForFilter(null);
              setSelectedReportForEdit(null);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              activeCategory === 'TODOS'
                ? 'bg-[#2C2E53] text-[#D4AF37] border-[#2C2E53] shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            Todos los Reportes ({catalogItems.length})
          </button>

          <button
            onClick={() => {
              setActiveCategory('DOCENTE');
              setSelectedReportForFilter(null);
              setSelectedReportForEdit(null);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              activeCategory === 'DOCENTE'
                ? 'bg-[#2C2E53] text-[#D4AF37] border-[#2C2E53] shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            Reportes Docente ({catalogItems.filter((r) => r.categoria === 'DOCENTE' || r.ambitoDocente).length})
          </button>

          <button
            onClick={() => {
              setActiveCategory('CONTROL_EVALUACION');
              setSelectedReportForFilter(null);
              setSelectedReportForEdit(null);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              activeCategory === 'CONTROL_EVALUACION'
                ? 'bg-[#2C2E53] text-[#D4AF37] border-[#2C2E53] shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            Control y Evaluación ({catalogItems.filter((r) => r.categoria === 'CONTROL_EVALUACION' || r.ambitoControlEstudios).length})
          </button>
        </div>
      </div>

      {/* CASO A: PANEL MODIFICAR REGISTRO (IDÉNTICO A LA CAPTURA DE FICHAS DE LOS ALUMNOS) */}
      {selectedReportForEdit ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-cba-card overflow-hidden animate-in fade-in duration-150">
          {/* ENCABEZADO CON TÍTULO EN MAYÚSCULAS Y SUBRAYADO NARANJA (EXACTO A LA CAPTURA) */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                  Reportes
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                  ADM: Administra los reportes del sistema
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    openFilterPanel(selectedReportForEdit);
                    setSelectedReportForEdit(null);
                  }}
                  className="px-3.5 py-1.5 bg-[#2C2E53] hover:bg-[#1f203b] text-[#D4AF37] font-bold text-xs rounded transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Configurar parámetros de filtro y emitir documento"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Filtros y Emisión</span>
                </button>
                <button
                  onClick={() => setSelectedReportForEdit(null)}
                  className="px-3.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Ver Reportes Disponibles</span>
                </button>
              </div>
            </div>

            {/* SEPARADOR NARANJA Y SUBTÍTULO MODIFICAR REGISTRO */}
            <div className="mt-4 border-b-2 border-orange-500 pb-1 w-full">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                MODIFICAR REGISTRO
              </h2>
            </div>
          </div>

          {/* BARRA DE BOTONES SUPERIOR */}
          <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={handleGuardarModificacion}
              className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded shadow-xs transition active:scale-95 cursor-pointer"
            >
              Modificar
            </button>
            <button
              onClick={() => setSelectedReportForEdit(null)}
              className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs rounded transition active:scale-95 cursor-pointer"
            >
              Atras
            </button>
          </div>

          {/* MENSAJE DE ÉXITO */}
          {saveSuccessMsg && (
            <div className="mx-5 mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* FORMULARIO TABULAR EXACTO AL DE LA CAPTURA */}
          <div className="overflow-x-auto p-1 sm:p-4">
            <table className="w-full text-left text-xs border-collapse">
              <tbody>
                {/* 1. Nombre */}
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="w-48 sm:w-56 py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 align-middle">
                    Nombre
                  </td>
                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      className="w-full max-w-2xl px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </td>
                </tr>

                {/* 2. Url */}
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 align-middle">
                    Url
                  </td>
                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="w-full max-w-2xl px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </td>
                </tr>

                {/* 3. Orden */}
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 align-middle">
                    Orden
                  </td>
                  <td className="py-2.5 px-4">
                    <input
                      type="number"
                      value={editOrden}
                      onChange={(e) => setEditOrden(e.target.value)}
                      className="w-24 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </td>
                </tr>

                {/* 4. Visible */}
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 align-middle">
                    Visible
                  </td>
                  <td className="py-2.5 px-4">
                    <select
                      value={editVisible}
                      onChange={(e) => setEditVisible(e.target.value as 'SI' | 'NO')}
                      className="w-full max-w-2xl px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                    >
                      <option value="SI">SI</option>
                      <option value="NO">NO</option>
                    </select>
                  </td>
                </tr>

                {/* 5. Descripción */}
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 align-top">
                    <div>Descripción</div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal mt-0.5">
                      Ingrese una breve descripción.
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    <textarea
                      rows={3}
                      value={editDescripcion}
                      onChange={(e) => setEditDescripcion(e.target.value)}
                      className="w-full max-w-2xl px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 resize-y"
                    />
                  </td>
                </tr>

                {/* 6. Fondo Cabecera */}
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 align-middle">
                    Fondo Cabecera
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editFondoCabecera}
                        onChange={(e) => setEditFondoCabecera(e.target.value)}
                        placeholder="79,130,187"
                        className="w-32 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <label
                        className="w-7 h-7 rounded border border-slate-400 dark:border-slate-600 shadow-2xs cursor-pointer shrink-0 transition hover:scale-105 inline-block"
                        style={{ backgroundColor: toCssRgb(editFondoCabecera, '#4F82BB') }}
                        title="Seleccionar color interactivo"
                      >
                        <input
                          type="color"
                          className="sr-only"
                          value={rgbStringToHex(editFondoCabecera)}
                          onChange={(e) => setEditFondoCabecera(hexToRgbString(e.target.value))}
                        />
                      </label>
                    </div>
                  </td>
                </tr>

                {/* 7. Letras Cabecera */}
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 align-middle">
                    Letras Cabecera
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editLetrasCabecera}
                        onChange={(e) => setEditLetrasCabecera(e.target.value)}
                        placeholder="255,255,255"
                        className="w-32 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <label
                        className="w-7 h-7 rounded border border-slate-400 dark:border-slate-600 shadow-2xs cursor-pointer shrink-0 transition hover:scale-105 inline-block"
                        style={{ backgroundColor: toCssRgb(editLetrasCabecera, '#FFFFFF') }}
                        title="Seleccionar color interactivo"
                      >
                        <input
                          type="color"
                          className="sr-only"
                          value={rgbStringToHex(editLetrasCabecera)}
                          onChange={(e) => setEditLetrasCabecera(hexToRgbString(e.target.value))}
                        />
                      </label>
                    </div>
                  </td>
                </tr>

                {/* 8. Fondo Fila Par */}
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 align-middle">
                    Fondo Fila Par
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editFondoFilaPar}
                        onChange={(e) => setEditFondoFilaPar(e.target.value)}
                        placeholder="255,255,255"
                        className="w-32 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <label
                        className="w-7 h-7 rounded border border-slate-400 dark:border-slate-600 shadow-2xs cursor-pointer shrink-0 transition hover:scale-105 inline-block"
                        style={{ backgroundColor: toCssRgb(editFondoFilaPar, '#FFFFFF') }}
                        title="Seleccionar color interactivo"
                      >
                        <input
                          type="color"
                          className="sr-only"
                          value={rgbStringToHex(editFondoFilaPar)}
                          onChange={(e) => setEditFondoFilaPar(hexToRgbString(e.target.value))}
                        />
                      </label>
                    </div>
                  </td>
                </tr>

                {/* 9. Fondo Fila Impar */}
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 align-middle">
                    Fondo Fila Impar
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editFondoFilaImpar}
                        onChange={(e) => setEditFondoFilaImpar(e.target.value)}
                        placeholder="223,232,244"
                        className="w-32 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <label
                        className="w-7 h-7 rounded border border-slate-400 dark:border-slate-600 shadow-2xs cursor-pointer shrink-0 transition hover:scale-105 inline-block"
                        style={{ backgroundColor: toCssRgb(editFondoFilaImpar, '#DFE8F4') }}
                        title="Seleccionar color interactivo"
                      >
                        <input
                          type="color"
                          className="sr-only"
                          value={rgbStringToHex(editFondoFilaImpar)}
                          onChange={(e) => setEditFondoFilaImpar(hexToRgbString(e.target.value))}
                        />
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BARRA DE BOTONES INFERIOR */}
          <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={handleGuardarModificacion}
              className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded shadow-xs transition active:scale-95 cursor-pointer"
            >
              Modificar
            </button>
            <button
              onClick={() => setSelectedReportForEdit(null)}
              className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs rounded transition active:scale-95 cursor-pointer"
            >
              Atras
            </button>
          </div>
        </div>
      ) : selectedReportForFilter ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-cba-card overflow-hidden animate-in fade-in duration-150">
          {/* ENCABEZADO CON TÍTULO EN MAYÚSCULAS Y SUBRAYADO NARANJA */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="inline-block border-b-2 border-orange-500 pb-1">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {selectedReportForFilter.nombre}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  openModificarRegistro(selectedReportForFilter);
                  setSelectedReportForFilter(null);
                }}
                className="px-3.5 py-1.5 rounded border border-orange-300 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 text-xs font-bold hover:bg-orange-100 dark:hover:bg-orange-900/40 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                title="Modificar registro de configuración del reporte"
              >
                <Edit3 className="w-3.5 h-3.5 text-orange-600" />
                <span>Modificar Registro</span>
              </button>

              <button
                onClick={() => setSelectedReportForFilter(null)}
                className="px-3.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ver Reportes Disponibles</span>
              </button>
            </div>
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
                        <div>Nota Mínima / Cota Inferior</div>
                        <div className="text-[10px] font-normal text-slate-500">Admite decimales (ej. 95.5 para diplomas)</div>
                      </td>
                      <td className="py-2.5 px-5">
                        <input
                          type="text"
                          maxLength={6}
                          value={filtroNotaMin}
                          onChange={(e) => setFiltroNotaMin(e.target.value)}
                          placeholder="95.5 / 01 / A"
                          className="w-28 px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-center font-bold focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </td>
                    </tr>

                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <td className="py-3 px-5 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-800/30">
                        <div>Nota Máxima / Cota Superior</div>
                        <div className="text-[10px] font-normal text-slate-500">Admite decimales (ej. 100.0)</div>
                      </td>
                      <td className="py-2.5 px-5">
                        <input
                          type="text"
                          maxLength={6}
                          value={filtroNotaMax}
                          onChange={(e) => setFiltroNotaMax(e.target.value)}
                          placeholder="100.0 / 20 / E"
                          className="w-28 px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-center font-bold focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                  {/* Columna Nombre */}
                  <th
                    onClick={() => toggleSort('nombre')}
                    className="p-3.5 cursor-pointer hover:text-orange-500 transition select-none w-1/3"
                  >
                    <div className="flex items-center justify-between">
                      <span>Nombre del Reporte</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>

                  {/* Columna Descripción */}
                  <th className="p-3.5 text-slate-700 dark:text-slate-300">
                    <span>Descripción</span>
                  </th>

                  {/* Columna Impresiones */}
                  <th
                    onClick={() => toggleSort('impresiones')}
                    className="p-3.5 w-28 text-right cursor-pointer hover:text-orange-500 transition select-none"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Impresiones</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>

                  {/* Columna Acciones */}
                  <th className="p-3.5 w-28 text-center">
                    <span>Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {paginatedReportes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 italic">
                      No se encontraron reportes que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  paginatedReportes.map((reporte) => {
                    const impressions = impresionesMap[reporte.id] ?? reporte.impresionesDefault;
                    return (
                      <tr
                        key={reporte.id}
                        onClick={() => openModificarRegistro(reporte)}
                        className="hover:bg-amber-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                        title="Haga clic para ver y modificar el registro de este reporte"
                      >
                        {/* Nombre del Reporte */}
                        <td className="p-3.5 align-middle">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0 group-hover:bg-[#2C2E53] group-hover:text-[#D4AF37] transition">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModificarRegistro(reporte);
                                }}
                                className="font-bold text-[#337ab7] hover:text-[#1d5987] dark:text-sky-400 dark:hover:text-sky-300 hover:underline cursor-pointer text-xs sm:text-[13px] transition"
                                title="Haga clic para modificar el registro de este reporte"
                              >
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
                          </div>
                        </td>

                        {/* Descripción (Exacto a la captura de C.E.O.) */}
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 text-xs font-medium align-middle">
                          {reporte.descripcion}
                        </td>

                        {/* Impresiones */}
                        <td className="p-3.5 text-right font-mono font-bold text-slate-800 dark:text-slate-200 align-middle">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                            {impressions}
                          </span>
                        </td>

                        {/* Botones de Acción (Modificar Registro y Emitir Reporte) */}
                        <td className="p-3.5 text-center align-middle">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openModificarRegistro(reporte);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800 transition active:scale-95 inline-flex items-center justify-center shadow-2xs"
                              title={`Modificar registro: ${reporte.nombre}`}
                            >
                              <Edit3 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openFilterPanel(reporte);
                              }}
                              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 inline-flex items-center justify-center shadow-2xs"
                              title={`Configurar e imprimir reporte: ${reporte.nombre}`}
                            >
                              <Printer className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                            </button>
                          </div>
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
