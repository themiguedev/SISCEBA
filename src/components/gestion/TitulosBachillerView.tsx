import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { TitleRecord, TitleBlockLayout, TitlePrintSettings } from '../../types';
import {
  GraduationCap,
  Printer,
  Sliders,
  CheckCircle2,
  FileText,
  Search,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Move,
  RotateCcw,
  Sparkles,
  Maximize2,
  Layers,
  Settings,
  UserCheck,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ShieldCheck,
  Download,
  AlertCircle
} from 'lucide-react';

// Bloques tipográficos oficiales del Título de Bachiller MPPE según el modelo de seguridad
const DEFAULT_TITLE_BLOCKS: TitleBlockLayout[] = [
  {
    id: 'serialNumber',
    label: 'Serial de Seguridad (Superior Derecho)',
    enabled: true,
    xMm: 222,
    yMm: 18,
    fontSizePt: 13,
    fontWeight: 'bold',
    letterSpacingMm: 2.2,
    lineHeight: 1.1,
    textAlign: 'left',
    fontFamily: 'mono',
    color: '#0f172a',
    sampleTemplate: '{{serialNumber}}'
  },
  {
    id: 'zonaPlantel',
    label: 'Zona Educativa / Plantel',
    enabled: true,
    xMm: 46,
    yMm: 68,
    fontSizePt: 9.8,
    fontWeight: 'normal',
    letterSpacingMm: 0.1,
    lineHeight: 1.25,
    textAlign: 'left',
    fontFamily: 'sans-serif',
    color: '#1e293b',
    sampleTemplate: 'Zona Educativa / Plantel: <strong>{{plantel}}</strong>'
  },
  {
    id: 'codigoPlantel',
    label: 'Código DEA del Plantel',
    enabled: true,
    xMm: 46,
    yMm: 74,
    fontSizePt: 9.8,
    fontWeight: 'normal',
    letterSpacingMm: 0.1,
    lineHeight: 1.25,
    textAlign: 'left',
    fontFamily: 'sans-serif',
    color: '#1e293b',
    sampleTemplate: 'Código: <strong>{{codigoPlantel}}</strong>'
  },
  {
    id: 'tituloMencion',
    label: 'Título de (Mención)',
    enabled: true,
    xMm: 46,
    yMm: 80,
    fontSizePt: 10.5,
    fontWeight: 'bold',
    letterSpacingMm: 0.4,
    lineHeight: 1.2,
    textAlign: 'left',
    fontFamily: 'sans-serif',
    color: '#0f172a',
    sampleTemplate: 'Título de: <strong>{{tituloMencion}}</strong>'
  },
  {
    id: 'planEstudio',
    label: 'Plan de Estudio y Código',
    enabled: true,
    xMm: 46,
    yMm: 86,
    fontSizePt: 9.8,
    fontWeight: 'normal',
    letterSpacingMm: 0.2,
    lineHeight: 1.25,
    textAlign: 'left',
    fontFamily: 'sans-serif',
    color: '#1e293b',
    sampleTemplate: 'Plan de estudio, Código Nro.: <strong>{{planEstudio}}, {{planCodigo}}</strong>'
  },
  {
    id: 'otorgadoA',
    label: 'Que se otorga a (Estudiante)',
    enabled: true,
    xMm: 46,
    yMm: 92,
    fontSizePt: 10.5,
    fontWeight: 'normal',
    letterSpacingMm: 0.3,
    lineHeight: 1.25,
    textAlign: 'left',
    fontFamily: 'sans-serif',
    color: '#0f172a',
    sampleTemplate: 'Que se otorga a: <strong style="font-size: 11pt;">{{studentName}}</strong>'
  },
  {
    id: 'cedulaIdentidad',
    label: 'Cédula de Identidad',
    enabled: true,
    xMm: 46,
    yMm: 98,
    fontSizePt: 9.8,
    fontWeight: 'normal',
    letterSpacingMm: 0.2,
    lineHeight: 1.25,
    textAlign: 'left',
    fontFamily: 'sans-serif',
    color: '#1e293b',
    sampleTemplate: 'Cédula de Identidad Nro.: <strong>{{cedula}}</strong>'
  },
  {
    id: 'nacidoEn',
    label: 'Nacido(a) en',
    enabled: true,
    xMm: 46,
    yMm: 104,
    fontSizePt: 9.8,
    fontWeight: 'normal',
    letterSpacingMm: 0.1,
    lineHeight: 1.25,
    textAlign: 'left',
    fontFamily: 'sans-serif',
    color: '#1e293b',
    sampleTemplate: 'Nacido (a) en: <strong>{{lugarNacimiento}}</strong>'
  },
  {
    id: 'fechaNacimiento',
    label: 'Fecha de Nacimiento',
    enabled: true,
    xMm: 46,
    yMm: 110,
    fontSizePt: 9.8,
    fontWeight: 'normal',
    letterSpacingMm: 0.1,
    lineHeight: 1.25,
    textAlign: 'left',
    fontFamily: 'sans-serif',
    color: '#1e293b',
    sampleTemplate: 'En Fecha: <strong>{{fechaNacimiento}}</strong>'
  },
  {
    id: 'requisitosLey',
    label: 'Cláusula Legal Ministerial',
    enabled: true,
    xMm: 46,
    yMm: 116,
    fontSizePt: 9.5,
    fontWeight: 'normal',
    letterSpacingMm: 0.1,
    lineHeight: 1.2,
    textAlign: 'left',
    fontFamily: 'sans-serif',
    color: '#334155',
    sampleTemplate: 'Previo el cumplimiento de los requisitos exigidos por la ley'
  },
  {
    id: 'expedicion',
    label: 'Lugar y Fecha de Expedición',
    enabled: true,
    xMm: 46,
    yMm: 122,
    fontSizePt: 9.8,
    fontWeight: 'normal',
    letterSpacingMm: 0.1,
    lineHeight: 1.25,
    textAlign: 'left',
    fontFamily: 'sans-serif',
    color: '#1e293b',
    sampleTemplate: 'Lugar y Fecha de expedición: <strong>{{lugarExpedicion}}, {{fechaExpedicion}}</strong>'
  },
  {
    id: 'anoEgreso',
    label: 'Año de Egreso',
    enabled: true,
    xMm: 46,
    yMm: 128,
    fontSizePt: 9.8,
    fontWeight: 'normal',
    letterSpacingMm: 0.2,
    lineHeight: 1.25,
    textAlign: 'left',
    fontFamily: 'sans-serif',
    color: '#1e293b',
    sampleTemplate: 'Año de Egreso: <strong>{{graduationYear}}</strong>'
  },
  {
    id: 'firmaDirector',
    label: 'Firma: Director(a) Plantel',
    enabled: true,
    xMm: 46,
    yMm: 153,
    fontSizePt: 7.2,
    fontWeight: 'normal',
    letterSpacingMm: 0.1,
    lineHeight: 1.2,
    textAlign: 'left',
    fontFamily: 'sans-serif',
    color: '#1e293b',
    sampleTemplate: '<div style="width: 145px; text-align: left;">Director(a) Plantel<br>Nombre: <strong>{{directorNombre}}</strong><br>C.I. {{directorCedula}}</div>'
  },
  {
    id: 'firmaControlEstudios',
    label: 'Firma: Control de Estudios / Consejo',
    enabled: true,
    xMm: 118,
    yMm: 153,
    fontSizePt: 7.2,
    fontWeight: 'normal',
    letterSpacingMm: 0.1,
    lineHeight: 1.2,
    textAlign: 'left',
    fontFamily: 'sans-serif',
    color: '#1e293b',
    sampleTemplate: '<div style="width: 165px; text-align: left;">Coordinador de Control de Estudio<br>Representante del Consejo General de Docentes<br>Nombre: <strong>{{coordinadorControlEstudio}}</strong><br>C.I. {{coordinadorCedula}}</div>'
  },
  {
    id: 'firmaFuncionarioMppe',
    label: 'Firma: Funcionario MPPE',
    enabled: true,
    xMm: 198,
    yMm: 153,
    fontSizePt: 7.2,
    fontWeight: 'normal',
    letterSpacingMm: 0.1,
    lineHeight: 1.2,
    textAlign: 'left',
    fontFamily: 'sans-serif',
    color: '#1e293b',
    sampleTemplate: '<div style="width: 145px; text-align: left;">Funcionario Designado por el<br>Ministerio del Poder Popular para la Educación<br>Nombre: <strong>{{funcionarioMppeNombre}}</strong><br>C.I. {{funcionarioMppeCedula}}</div>'
  },
  {
    id: 'folioTomoInfo',
    label: 'Folio y Tomo UCE (Pie de Certificación)',
    enabled: true,
    xMm: 46,
    yMm: 196,
    fontSizePt: 6.8,
    fontWeight: 'bold',
    letterSpacingMm: 0.2,
    lineHeight: 1.1,
    textAlign: 'left',
    fontFamily: 'mono',
    color: '#475569',
    sampleTemplate: 'REGISTRO UCE CBA: TOMO: {{tomo}} • FOLIO: {{folio}} • CÓDIGO: {{registeredCode}}'
  }
];

const DEFAULT_PRINT_SETTINGS: TitlePrintSettings = {
  pageWidthMm: 279.4, // Carta Horizontal estándar
  pageHeightMm: 215.9,
  orientation: 'landscape',
  marginTopMm: 0,
  marginLeftMm: 0,
  marginRightMm: 0,
  marginBottomMm: 0,
  globalFontScale: 100,
  showGuidelines: false,
  showBackgroundTemplate: true
};

export const TitulosBachillerView: React.FC = () => {
  const { titles, saveTitleRecord, deleteTitleRecord, students } = useApp();

  // Selected title state
  const [selectedTitleId, setSelectedTitleId] = useState<string>(titles[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [saveBanner, setSaveBanner] = useState(false);
  const [activeTab, setActiveTab] = useState<'EDITOR_DISENO' | 'DATOS_ALUMNO' | 'CONFIG_IMPRESION' | 'VISTA_DIGITALIZADA'>('EDITOR_DISENO');

  // Interactive Calibrator / Designer states
  const [selectedBlockId, setSelectedBlockId] = useState<string>('otorgadoA');
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Print settings
  const [printSettings, setPrintSettings] = useState<TitlePrintSettings>(DEFAULT_PRINT_SETTINGS);
  const [blocks, setBlocks] = useState<TitleBlockLayout[]>(DEFAULT_TITLE_BLOCKS);

  // New Title Form modal / toggle
  const [showNewModal, setShowNewModal] = useState(false);
  const [newStudentId, setNewStudentId] = useState('');

  // Active Title selection
  const activeTitle: TitleRecord | undefined = useMemo(() => {
    return titles.find((t) => t.id === selectedTitleId) || titles[0];
  }, [titles, selectedTitleId]);

  // Merge defaults with custom values
  const currentTitleData: TitleRecord = useMemo(() => {
    if (!activeTitle) {
      return {
        id: 'tit-cba-default',
        studentId: 'demo',
        studentName: "EMILIANNA MIA D'ALESSANDRO BEVACQUA",
        cedula: 'V 33.323.445',
        schoolYear: '2025-2026',
        graduationYear: '2026',
        serialNumber: 'AB 0307994',
        tomo: 'XXV',
        folio: '048',
        registeredCode: 'UCE-CBA-2026-BAC-048',
        calibrated: true,
        plantel: 'UNIDAD EDUCATIVA BELLAS ARTES',
        codigoPlantel: 'S1448D2313',
        tituloMencion: 'BACHILLER',
        planEstudio: 'EDUCACIÓN MEDIA GENERAL',
        planCodigo: '31059',
        lugarNacimiento: 'VENEZUELA, ZULIA, MUNICIPIO MARACAIBO',
        fechaNacimiento: '22 DE JULIO DE 2009',
        lugarExpedicion: 'ZULIA, MARACAIBO',
        fechaExpedicion: '27 DE JULIO DE 2026',
        directorNombre: 'MILAGRO DEL CARMEN VIERA ATENCIO',
        directorCedula: 'V 4.520.196',
        coordinadorControlEstudio: 'RIGOBERTO BOSCÁN INCIARTE',
        coordinadorCedula: 'V 5.057.049',
        funcionarioMppeNombre: 'JESIKA P. UZCÁTEGUI U.',
        funcionarioMppeCedula: 'V 12.541.943'
      };
    }

    return {
      plantel: 'UNIDAD EDUCATIVA BELLAS ARTES',
      codigoPlantel: 'S1448D2313',
      tituloMencion: 'BACHILLER',
      planEstudio: 'EDUCACIÓN MEDIA GENERAL',
      planCodigo: '31059',
      lugarNacimiento: 'VENEZUELA, ZULIA, MUNICIPIO MARACAIBO',
      fechaNacimiento: '22 DE JULIO DE 2009',
      lugarExpedicion: 'ZULIA, MARACAIBO',
      fechaExpedicion: '27 DE JULIO DE 2026',
      directorNombre: 'MILAGRO DEL CARMEN VIERA ATENCIO',
      directorCedula: 'V 4.520.196',
      coordinadorControlEstudio: 'RIGOBERTO BOSCÁN INCIARTE',
      coordinadorCedula: 'V 5.057.049',
      funcionarioMppeNombre: 'JESIKA P. UZCÁTEGUI U.',
      funcionarioMppeCedula: 'V 12.541.943',
      ...activeTitle
    };
  }, [activeTitle]);

  // Filtered titles list
  const filteredTitles = useMemo(() => {
    return titles.filter(
      (t) =>
        t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [titles, searchTerm]);

  // Active Block selected in Editor
  const activeBlock = useMemo(() => {
    return blocks.find((b) => b.id === selectedBlockId) || blocks[0];
  }, [blocks, selectedBlockId]);

  // Update block property
  const updateBlock = (blockId: string, updates: Partial<TitleBlockLayout>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, ...updates } : b))
    );
  };

  // Helper to replace template tokens
  const renderTemplateText = (template: string) => {
    return template
      .replace(/{{serialNumber}}/g, currentTitleData.serialNumber || 'AB 0000000')
      .replace(/{{plantel}}/g, currentTitleData.plantel || 'UNIDAD EDUCATIVA BELLAS ARTES')
      .replace(/{{codigoPlantel}}/g, currentTitleData.codigoPlantel || 'S1448D2313')
      .replace(/{{tituloMencion}}/g, currentTitleData.tituloMencion || 'BACHILLER')
      .replace(/{{planEstudio}}/g, currentTitleData.planEstudio || 'EDUCACIÓN MEDIA GENERAL')
      .replace(/{{planCodigo}}/g, currentTitleData.planCodigo || '31059')
      .replace(/{{studentName}}/g, currentTitleData.studentName || 'NOMBRE COMPLETO')
      .replace(/{{cedula}}/g, currentTitleData.cedula || 'V-00.000.000')
      .replace(/{{lugarNacimiento}}/g, currentTitleData.lugarNacimiento || 'VENEZUELA, ZULIA')
      .replace(/{{fechaNacimiento}}/g, currentTitleData.fechaNacimiento || '01 DE ENERO DE 2008')
      .replace(/{{lugarExpedicion}}/g, currentTitleData.lugarExpedicion || 'ZULIA, MARACAIBO')
      .replace(/{{fechaExpedicion}}/g, currentTitleData.fechaExpedicion || '27 DE JULIO DE 2026')
      .replace(/{{graduationYear}}/g, currentTitleData.graduationYear || '2026')
      .replace(/{{directorNombre}}/g, currentTitleData.directorNombre || 'MILAGRO DEL CARMEN VIERA')
      .replace(/{{directorCedula}}/g, currentTitleData.directorCedula || 'V 4.520.196')
      .replace(/{{coordinadorControlEstudio}}/g, currentTitleData.coordinadorControlEstudio || 'RIGOBERTO BOSCÁN')
      .replace(/{{coordinadorCedula}}/g, currentTitleData.coordinadorCedula || 'V 5.057.049')
      .replace(/{{funcionarioMppeNombre}}/g, currentTitleData.funcionarioMppeNombre || 'JESIKA P. UZCÁTEGUI')
      .replace(/{{funcionarioMppeCedula}}/g, currentTitleData.funcionarioMppeCedula || 'V 12.541.943')
      .replace(/{{tomo}}/g, currentTitleData.tomo || 'XXV')
      .replace(/{{folio}}/g, currentTitleData.folio || '001')
      .replace(/{{registeredCode}}/g, currentTitleData.registeredCode || 'CBA-TIT-001');
  };

  // Handle Save
  const handleSave = () => {
    if (!currentTitleData) return;
    const titleToSave: TitleRecord = {
      ...currentTitleData,
      customBlocks: blocks.reduce((acc, b) => ({ ...acc, [b.id]: b }), {}),
      printSettings
    };
    saveTitleRecord(titleToSave);
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3000);
  };

  // Reset blocks to default MPPE positioning
  const handleResetBlocks = () => {
    if (window.confirm('¿Desea restablecer las posiciones milimétricas de los textos al estándar original MPPE?')) {
      setBlocks(DEFAULT_TITLE_BLOCKS);
      setPrintSettings(DEFAULT_PRINT_SETTINGS);
    }
  };

  // Handle Create Title for 5th year student
  const handleCreateTitle = () => {
    const student = students.find((s) => s.id === newStudentId);
    if (!student) return;

    const newRecord: TitleRecord = {
      id: `tit-${Date.now()}`,
      studentId: student.id,
      studentName: student.fullName.toUpperCase(),
      cedula: student.cedula,
      schoolYear: '2025-2026',
      graduationYear: '2026',
      serialNumber: `AB 030${Math.floor(7000 + Math.random() * 2000)}`,
      tomo: 'XXV',
      folio: `${Math.floor(10 + Math.random() * 80)}`.padStart(3, '0'),
      registeredCode: `UCE-CBA-2026-BAC-${Math.floor(100 + Math.random() * 900)}`,
      calibrated: true,
      plantel: 'UNIDAD EDUCATIVA BELLAS ARTES',
      codigoPlantel: 'S1448D2313',
      tituloMencion: 'BACHILLER',
      planEstudio: 'EDUCACIÓN MEDIA GENERAL',
      planCodigo: '31059',
      lugarNacimiento: `${student.pais || 'VENEZUELA'}, ${student.estado || 'ZULIA'}, ${student.ciudad || 'MARACAIBO'}`.toUpperCase(),
      fechaNacimiento: student.birthDate || '22 DE JULIO DE 2008',
      lugarExpedicion: 'ZULIA, MARACAIBO',
      fechaExpedicion: '27 DE JULIO DE 2026',
      directorNombre: 'MILAGRO DEL CARMEN VIERA ATENCIO',
      directorCedula: 'V 4.520.196',
      coordinadorControlEstudio: 'RIGOBERTO BOSCÁN INCIARTE',
      coordinadorCedula: 'V 5.057.049',
      funcionarioMppeNombre: 'JESIKA P. UZCÁTEGUI U.',
      funcionarioMppeCedula: 'V 12.541.943'
    };

    saveTitleRecord(newRecord);
    setSelectedTitleId(newRecord.id);
    setShowNewModal(false);
    setNewStudentId('');
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Print stylesheet for physical certificate printing on blank security paper */}
      <style>{`
        @page {
          size: letter landscape;
          margin: 0;
        }
        @media print {
          html, body {
            width: 279.4mm !important;
            height: 215.9mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header, nav, aside, .no-print, button, .app-header, .sidebar {
            display: none !important;
          }
          .title-print-isolated-sheet {
            display: block !important;
            position: absolute !important;
            top: ${printSettings.marginTopMm}mm !important;
            left: ${printSettings.marginLeftMm}mm !important;
            width: ${printSettings.pageWidthMm}mm !important;
            height: ${printSettings.pageHeightMm}mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: none !important;
            box-shadow: none !important;
            border: none !important;
            overflow: hidden !important;
          }
          .title-template-bg, .guideline-grid {
            display: none !important; /* Never print reference template onto original security paper */
          }
        }
        @media screen {
          .title-print-isolated-sheet {
            display: none;
          }
        }
      `}</style>

      {/* Main Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] dark:text-[#D4AF37] uppercase tracking-wider">
              Secretaría de Grado y Egresos • Administrador
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] dark:text-white mt-1 flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-[#D4AF37]" />
            Emisión y Editor Calibrador de Títulos de Bachiller
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Herramienta gráfica de alta precisión milimétrica para la impresión de datos sobre el papel de seguridad oficial del Ministerio del Poder Popular para la Educación (MPPE / Casa de la Moneda).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nuevo Título
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2C2E53] hover:bg-[#1f213b] text-[#D4AF37] font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#c4a132] text-[#1e2038] font-black rounded-xl text-xs shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Imprimir Título
          </button>
        </div>
      </div>

      {saveBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ¡Parámetros tipográficos, calibración milimétrica y datos ministeriales guardados con éxito en la base de datos!
        </div>
      )}

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start no-print">
        
        {/* Left Sidebar: Titles List (3 cols) */}
        <div className="xl:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="font-extrabold text-sm text-[#2C2E53] dark:text-white flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#D4AF37]" />
              Graduandos ({titles.length})
            </h3>
            <span className="text-[10px] font-bold text-slate-400 font-mono">5to Año</span>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por alumno, C.I. o serial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
            />
          </div>

          {/* List items */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredTitles.map((t) => {
              const isSelected = activeTitle?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTitleId(t.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#2C2E53] text-white border-[#2C2E53] shadow-md ring-2 ring-[#D4AF37]/50'
                      : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <p className="font-extrabold text-xs truncate">{t.studentName}</p>
                  <div className="flex items-center justify-between text-[10px] mt-1 opacity-80">
                    <span>{t.cedula}</span>
                    <span className="font-mono font-bold text-[#D4AF37]">
                      {t.serialNumber || 'S/N'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] mt-1 pt-1 border-t border-slate-200/20 opacity-60">
                    <span>Tomo: {t.tomo || '--'}</span>
                    <span>Folio: {t.folio || '--'}</span>
                    <span>Egreso: {t.graduationYear}</span>
                  </div>
                </div>
              );
            })}

            {filteredTitles.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400">
                No se encontraron registros de título con ese criterio.
              </div>
            )}
          </div>
        </div>

        {/* Center & Right: High-Precision Visual Studio (9 cols) */}
        <div className="xl:col-span-9 space-y-4">
          
          {/* Studio Top Control Nav Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('EDITOR_DISENO')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'EDITOR_DISENO'
                    ? 'bg-[#2C2E53] text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Lienzo y Calibrador Visual
              </button>

              <button
                onClick={() => setActiveTab('DATOS_ALUMNO')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'DATOS_ALUMNO'
                    ? 'bg-[#2C2E53] text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Datos del Título (Formulario)
              </button>

              <button
                onClick={() => setActiveTab('CONFIG_IMPRESION')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'CONFIG_IMPRESION'
                    ? 'bg-[#2C2E53] text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                Ajustes de Impresión / Margen
              </button>

              <button
                onClick={() => setActiveTab('VISTA_DIGITALIZADA')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'VISTA_DIGITALIZADA'
                    ? 'bg-gradient-to-r from-amber-600 to-[#2C2E53] text-white shadow-md ring-2 ring-[#D4AF37]/50'
                    : 'bg-[#D4AF37]/15 text-[#92711d] dark:text-[#D4AF37] hover:bg-[#D4AF37]/25 font-bold border border-[#D4AF37]/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                Título Digitalizado Completo
              </button>
            </div>

            {/* Quick View Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPrintSettings(prev => ({ ...prev, showBackgroundTemplate: !prev.showBackgroundTemplate }))}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                  printSettings.showBackgroundTemplate
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200'
                }`}
                title="Muestra u oculta la foto del papel ministerial como referencia de calibración"
              >
                {printSettings.showBackgroundTemplate ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                Papel Fondo
              </button>

              <button
                onClick={() => setPrintSettings(prev => ({ ...prev, showGuidelines: !prev.showGuidelines }))}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                  printSettings.showGuidelines
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200'
                }`}
                title="Activa rejilla milimétrica"
              >
                <Sliders className="w-3.5 h-3.5" />
                Guías mm
              </button>

              <button
                onClick={handleResetBlocks}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Restablecer posiciones al estándar original"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restablecer
              </button>
            </div>
          </div>

          {/* TAB 1: VISUAL CANVAS & CALIBRATOR */}
          {activeTab === 'EDITOR_DISENO' && (
            <div className="space-y-4">
              
              {/* Selected Block Quick Editor Toolbar */}
              <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#D4AF37] text-slate-950 font-black text-[10px]">
                    BLOQUE ACTIVO
                  </span>
                  <select
                    value={selectedBlockId}
                    onChange={(e) => setSelectedBlockId(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    {blocks.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Position X */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-mono text-[11px]">X:</span>
                    <input
                      type="number"
                      step="1"
                      value={activeBlock.xMm}
                      onChange={(e) => updateBlock(activeBlock.id, { xMm: Number(e.target.value) })}
                      className="w-16 px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-center font-mono font-bold text-white text-xs"
                    />
                    <span className="text-[10px] text-slate-500">mm</span>
                  </div>

                  {/* Position Y */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-mono text-[11px]">Y:</span>
                    <input
                      type="number"
                      step="1"
                      value={activeBlock.yMm}
                      onChange={(e) => updateBlock(activeBlock.id, { yMm: Number(e.target.value) })}
                      className="w-16 px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-center font-mono font-bold text-white text-xs"
                    />
                    <span className="text-[10px] text-slate-500">mm</span>
                  </div>

                  {/* Font Size */}
                  <div className="flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="number"
                      step="0.5"
                      min="6"
                      max="24"
                      value={activeBlock.fontSizePt}
                      onChange={(e) => updateBlock(activeBlock.id, { fontSizePt: Number(e.target.value) })}
                      className="w-14 px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-center font-mono font-bold text-white text-xs"
                    />
                    <span className="text-[10px] text-slate-500">pt</span>
                  </div>

                  {/* Letter Spacing */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">Espaciado:</span>
                    <input
                      type="number"
                      step="0.1"
                      min="-1"
                      max="5"
                      value={activeBlock.letterSpacingMm}
                      onChange={(e) => updateBlock(activeBlock.id, { letterSpacingMm: Number(e.target.value) })}
                      className="w-14 px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-center font-mono font-bold text-white text-xs"
                    />
                    <span className="text-[10px] text-slate-500">mm</span>
                  </div>

                  {/* Font Weight */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateBlock(activeBlock.id, { fontWeight: activeBlock.fontWeight === 'bold' ? 'normal' : 'bold' })}
                      className={`px-2 py-0.5 rounded text-xs font-bold border ${
                        activeBlock.fontWeight === 'bold' || activeBlock.fontWeight === '900'
                          ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37]'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      B
                    </button>
                  </div>

                  {/* Visibility toggle */}
                  <button
                    onClick={() => updateBlock(activeBlock.id, { enabled: !activeBlock.enabled })}
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      activeBlock.enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {activeBlock.enabled ? 'Visible' : 'Oculto'}
                  </button>
                </div>
              </div>

              {/* High-fidelity WYSIWYG Canvas Wrapper */}
              <div className="overflow-x-auto pb-4 bg-slate-200 dark:bg-slate-950 p-4 rounded-2xl border border-slate-300 dark:border-slate-800 flex justify-center">
                
                {/* Simulated Certificate Sheet (279.4mm x 215.9mm - Standard Letter Landscape) */}
                <div
                  className="title-print-canvas relative bg-white shadow-2xl transition-all select-none overflow-hidden"
                  style={{
                    width: `${printSettings.pageWidthMm * 3.7795275591}px`, // 1mm = ~3.78px
                    height: `${printSettings.pageHeightMm * 3.7795275591}px`,
                    minWidth: `${printSettings.pageWidthMm * 3.7795275591}px`,
                    minHeight: `${printSettings.pageHeightMm * 3.7795275591}px`,
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'top center'
                  }}
                >
                  {/* Optional Background: Authentic MPPE Scanned Security Paper */}
                  {printSettings.showBackgroundTemplate && (
                    <img
                      src={`${import.meta.env.BASE_URL}plantilla-titulo-mppe.jpg`}
                      alt="Fondo Papel Seguridad Título"
                      className="title-template-bg absolute inset-0 w-full h-full object-fill pointer-events-none opacity-40 mix-blend-multiply"
                    />
                  )}

                  {/* Optional Millimeter Grid Guidelines */}
                  {printSettings.showGuidelines && (
                    <div
                      className="guideline-grid absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, rgba(0, 100, 255, 0.08) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(0, 100, 255, 0.08) 1px, transparent 1px)
                        `,
                        backgroundSize: `${10 * 3.7795}px ${10 * 3.7795}px` // 1cm grid
                      }}
                    >
                      <div className="absolute top-2 left-2 text-[9px] font-mono text-blue-500 bg-white/80 px-1 rounded">
                        Guía de calibración: Cuadrícula cada 10mm
                      </div>
                    </div>
                  )}

                  {/* Dynamic Render of All Blocks */}
                  {blocks.map((block) => {
                    if (!block.enabled) return null;
                    const isSelected = selectedBlockId === block.id;
                    const renderedHtml = renderTemplateText(block.sampleTemplate);

                    return (
                      <div
                        key={block.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBlockId(block.id);
                        }}
                        className={`absolute cursor-pointer transition-shadow ${
                          isSelected
                            ? 'ring-2 ring-[#D4AF37] bg-amber-500/10 rounded p-0.5 shadow-md z-30'
                            : 'hover:ring-1 hover:ring-blue-400 hover:bg-blue-50/20 z-10'
                        }`}
                        style={{
                          left: `${block.xMm * 3.7795}px`,
                          top: `${block.yMm * 3.7795}px`,
                          fontSize: `${block.fontSizePt * (printSettings.globalFontScale / 100)}pt`,
                          fontWeight: block.fontWeight,
                          letterSpacing: `${block.letterSpacingMm}mm`,
                          lineHeight: block.lineHeight,
                          textAlign: block.textAlign,
                          fontFamily: block.fontFamily === 'serif' ? 'Times New Roman, serif' : block.fontFamily === 'mono' ? 'Courier New, monospace' : 'Arial, sans-serif',
                          color: block.color
                        }}
                        dangerouslySetInnerHTML={{ __html: renderedHtml }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Instructions banner */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="leading-relaxed">
                  <strong>Recomendación para impresión física oficial:</strong> En papel de seguridad original en blanco (pre-impreso por la Casa de la Moneda), desactive el botón <em>"Papel Fondo"</em> para que el navegador únicamente imprima los textos en sus coordenadas exactas sin superponer la imagen escaneada.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDENT AND LEGAL CERTIFICATE DATA */}
          {activeTab === 'DATOS_ALUMNO' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-[#2C2E53] dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#D4AF37]" />
                  Expediente Ministerial de Grado • {currentTitleData.studentName}
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  Serial: {currentTitleData.serialNumber}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Serial Ministerial de Seguridad:
                  </label>
                  <input
                    type="text"
                    value={currentTitleData.serialNumber}
                    onChange={(e) => saveTitleRecord({ ...currentTitleData, serialNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tomo Registrado:
                  </label>
                  <input
                    type="text"
                    value={currentTitleData.tomo}
                    onChange={(e) => saveTitleRecord({ ...currentTitleData, tomo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Folio Registrado:
                  </label>
                  <input
                    type="text"
                    value={currentTitleData.folio}
                    onChange={(e) => saveTitleRecord({ ...currentTitleData, folio: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombres y Apellidos del Graduando:
                  </label>
                  <input
                    type="text"
                    value={currentTitleData.studentName}
                    onChange={(e) => saveTitleRecord({ ...currentTitleData, studentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cédula de Identidad:
                  </label>
                  <input
                    type="text"
                    value={currentTitleData.cedula}
                    onChange={(e) => saveTitleRecord({ ...currentTitleData, cedula: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Lugar de Nacimiento:
                  </label>
                  <input
                    type="text"
                    value={currentTitleData.lugarNacimiento}
                    onChange={(e) => saveTitleRecord({ ...currentTitleData, lugarNacimiento: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha de Nacimiento (Texto Legal):
                  </label>
                  <input
                    type="text"
                    value={currentTitleData.fechaNacimiento}
                    onChange={(e) => saveTitleRecord({ ...currentTitleData, fechaNacimiento: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Lugar y Fecha de Expedición:
                  </label>
                  <input
                    type="text"
                    value={currentTitleData.fechaExpedicion}
                    onChange={(e) => saveTitleRecord({ ...currentTitleData, fechaExpedicion: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Año de Egreso:
                  </label>
                  <input
                    type="text"
                    value={currentTitleData.graduationYear}
                    onChange={(e) => saveTitleRecord({ ...currentTitleData, graduationYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Código Único Registro UCE:
                  </label>
                  <input
                    type="text"
                    value={currentTitleData.registeredCode}
                    onChange={(e) => saveTitleRecord({ ...currentTitleData, registeredCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Firmantes Institucionales */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-black text-[#2C2E53] dark:text-white uppercase mb-3">
                  Autoridades Firmantes Oficiales (Gaceta Oficial MPPE)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <strong className="text-[11px] text-slate-500 block">Director(a) Plantel</strong>
                    <input
                      type="text"
                      placeholder="Nombre Director"
                      value={currentTitleData.directorNombre}
                      onChange={(e) => saveTitleRecord({ ...currentTitleData, directorNombre: e.target.value })}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                    />
                    <input
                      type="text"
                      placeholder="C.I. Director"
                      value={currentTitleData.directorCedula}
                      onChange={(e) => saveTitleRecord({ ...currentTitleData, directorCedula: e.target.value })}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <strong className="text-[11px] text-slate-500 block">Control de Estudios / Consejo</strong>
                    <input
                      type="text"
                      placeholder="Nombre Coordinador"
                      value={currentTitleData.coordinadorControlEstudio}
                      onChange={(e) => saveTitleRecord({ ...currentTitleData, coordinadorControlEstudio: e.target.value })}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                    />
                    <input
                      type="text"
                      placeholder="C.I. Coordinador"
                      value={currentTitleData.coordinadorCedula}
                      onChange={(e) => saveTitleRecord({ ...currentTitleData, coordinadorCedula: e.target.value })}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <strong className="text-[11px] text-slate-500 block">Funcionario Designado MPPE</strong>
                    <input
                      type="text"
                      placeholder="Nombre Funcionario MPPE"
                      value={currentTitleData.funcionarioMppeNombre}
                      onChange={(e) => saveTitleRecord({ ...currentTitleData, funcionarioMppeNombre: e.target.value })}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                    />
                    <input
                      type="text"
                      placeholder="C.I. Funcionario"
                      value={currentTitleData.funcionarioMppeCedula}
                      onChange={(e) => saveTitleRecord({ ...currentTitleData, funcionarioMppeCedula: e.target.value })}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRINT AND MARGIN SETTINGS */}
          {activeTab === 'CONFIG_IMPRESION' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-[#2C2E53] dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#D4AF37]" />
                  Ajustes Globales de Calibración de la Impresora
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                    Dimensiones del Papel
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Ancho (mm):</label>
                      <input
                        type="number"
                        value={printSettings.pageWidthMm}
                        onChange={(e) => setPrintSettings({ ...printSettings, pageWidthMm: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Alto (mm):</label>
                      <input
                        type="number"
                        value={printSettings.pageHeightMm}
                        onChange={(e) => setPrintSettings({ ...printSettings, pageHeightMm: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">
                      Escala Global Tipográfica: {printSettings.globalFontScale}%
                    </label>
                    <input
                      type="range"
                      min="75"
                      max="125"
                      value={printSettings.globalFontScale}
                      onChange={(e) => setPrintSettings({ ...printSettings, globalFontScale: Number(e.target.value) })}
                      className="w-full accent-[#2C2E53]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                    Márgenes Físicos de Salida (Offset de Bandeja)
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Offset Superior (mm):</label>
                      <input
                        type="number"
                        value={printSettings.marginTopMm}
                        onChange={(e) => setPrintSettings({ ...printSettings, marginTopMm: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Offset Izquierdo (mm):</label>
                      <input
                        type="number"
                        value={printSettings.marginLeftMm}
                        onChange={(e) => setPrintSettings({ ...printSettings, marginLeftMm: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 leading-relaxed">
                    Ajuste los offsets si su impresora física desplaza la hoja ligeramente al momento de alimentarla desde la bandeja.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VISTA DIGITALIZADA COMPLETA (Diploma Digital Oficial con Arte Completo) */}
          {activeTab === 'VISTA_DIGITALIZADA' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm text-[#2C2E53] dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    Título Digitalizado Oficial (Emisión Digital / Certificado Completo)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Reproducción digital fiel del pergamino ministerial con escudo de armas, efigie de Simón Rodríguez, tramas de seguridad y sellos oficiales listos para consulta o descarga PDF.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2C2E53] text-[#D4AF37] font-bold rounded-xl text-xs shadow hover:bg-[#1a1c33] transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir Certificado Completo
                </button>
              </div>

              {/* Digital Pergamino Sheet - Reconstrucción nativa vectorizada y fiel sin foto de fondo */}
              <div className="overflow-x-auto pb-4 bg-slate-400/30 dark:bg-slate-950 p-6 rounded-2xl border border-slate-300 dark:border-slate-800 flex justify-center">
                <div
                  className="relative bg-white text-slate-900 shadow-2xl overflow-hidden border border-slate-300 select-none"
                  style={{
                    width: '279.4mm',
                    height: '215.9mm',
                    minWidth: '279.4mm',
                    minHeight: '215.9mm',
                    boxSizing: 'border-box',
                    padding: '8mm 12mm 6mm 12mm',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                  }}
                >
                  {/* Orla de Seguridad Guilloché Esquina Inferior Izquierda */}
                  <img
                    src={`${import.meta.env.BASE_URL}titulo-guilloche-esquina.png`}
                    alt="Guilloché de Seguridad"
                    className="absolute bottom-0 left-0 w-[54%] h-auto max-h-[78%] pointer-events-none object-contain object-bottom opacity-85 z-0"
                  />

                  {/* Header: Simón Rodríguez Portrait, Escudo Nacional y Membrete */}
                  <div className="relative z-10 flex items-start justify-between">
                    {/* Simón Rodríguez Portrait Box (Esquina Superior Izquierda) */}
                    <div className="w-28 text-left pt-1 pl-1">
                      <div className="w-[84px] h-[106px] rounded overflow-hidden shadow-xs">
                        <img
                          src={`${import.meta.env.BASE_URL}titulo-simon-rodriguez.png`}
                          alt="Simón Rodríguez"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[7.5pt] font-black text-slate-800 tracking-wider block mt-1 pl-1">
                        Simón Rodríguez
                      </span>
                    </div>

                    {/* Escudo de Armas y Membrete Oficial Central */}
                    <div className="text-center flex-1 px-2 pt-1">
                      <div className="h-16 flex items-center justify-center mb-1">
                        <img
                          src={`${import.meta.env.BASE_URL}titulo-escudo-venezuela.png`}
                          alt="Escudo de Armas de Venezuela"
                          className="h-14 w-auto object-contain"
                        />
                      </div>
                      <h1 className="text-[14pt] font-black tracking-wide text-slate-900 leading-tight uppercase font-serif">
                        República Bolivariana de Venezuela
                      </h1>
                      <h2 className="text-[9.5pt] font-black tracking-wider text-slate-800 uppercase mt-0.5">
                        Ministerio del Poder Popular para la Educación
                      </h2>
                    </div>

                    {/* Serial de Seguridad (Esquina Superior Derecha) */}
                    <div className="w-36 text-right pt-2 pr-2">
                      <span className="font-mono text-[13pt] font-black tracking-[0.25em] text-slate-900 block">
                        {currentTitleData.serialNumber}
                      </span>
                    </div>
                  </div>

                  {/* Cuerpo del Título con Tipografía Oficial */}
                  <div className="relative z-10 mt-3 pl-28 pr-6 space-y-1 text-[9.8pt] text-slate-900 leading-snug">
                    <div className="flex">
                      <span className="w-48 text-slate-800">Zona Educativa / Plantel:</span>
                      <strong className="font-black text-slate-950 uppercase">{currentTitleData.plantel}</strong>
                    </div>
                    <div className="flex">
                      <span className="w-48 text-slate-800">Código:</span>
                      <strong className="font-black text-slate-950">{currentTitleData.codigoPlantel}</strong>
                    </div>
                    <div className="flex">
                      <span className="w-48 text-slate-800">Título de:</span>
                      <strong className="font-black text-slate-950 uppercase">{currentTitleData.tituloMencion}</strong>
                    </div>
                    <div className="flex">
                      <span className="w-48 text-slate-800">Plan de estudio, Código Nro.:</span>
                      <strong className="font-black text-slate-950 uppercase">{currentTitleData.planEstudio}, {currentTitleData.planCodigo}</strong>
                    </div>
                    <div className="flex pt-0.5">
                      <span className="w-48 text-slate-800">Que se otorga a:</span>
                      <strong className="font-black text-[10.8pt] text-slate-950 uppercase tracking-wide">{currentTitleData.studentName}</strong>
                    </div>
                    <div className="flex">
                      <span className="w-48 text-slate-800">Cédula de Identidad Nro.:</span>
                      <strong className="font-black text-slate-950">{currentTitleData.cedula}</strong>
                    </div>
                    <div className="flex">
                      <span className="w-48 text-slate-800">Nacido (a) en:</span>
                      <strong className="font-black text-slate-950 uppercase">{currentTitleData.lugarNacimiento}</strong>
                    </div>
                    <div className="flex">
                      <span className="w-48 text-slate-800">En Fecha:</span>
                      <strong className="font-black text-slate-950 uppercase">{currentTitleData.fechaNacimiento}</strong>
                    </div>
                    <div className="text-slate-800 text-[9.5pt] pt-0.5">
                      Previo el cumplimiento de los requisitos exigidos por la ley
                    </div>
                    <div className="flex">
                      <span className="w-48 text-slate-800">Lugar y Fecha de expedición:</span>
                      <strong className="font-black text-slate-950 uppercase">{currentTitleData.lugarExpedicion}, {currentTitleData.fechaExpedicion}</strong>
                    </div>
                    <div className="flex">
                      <span className="w-48 text-slate-800">Año de Egreso:</span>
                      <strong className="font-black text-slate-950">{currentTitleData.graduationYear}</strong>
                    </div>
                  </div>

                  {/* Firmas y Sellos Circulares Oficiales */}
                  <div className="relative z-10 mt-4 grid grid-cols-12 gap-2 items-end">
                    
                    {/* Columna 1: Firma y Datos del Director (cols 1 a 4) */}
                    <div className="col-span-4 pl-26">
                      <div className="h-10 relative">
                        <img
                          src={`${import.meta.env.BASE_URL}titulo-firma-director.png`}
                          alt="Firma Director"
                          className="h-9 w-auto object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="text-[7.2pt] leading-tight text-slate-800">
                        Director(a) Zona Educativa / Plantel<br />
                        Nombre: <strong className="font-black text-slate-950">{currentTitleData.directorNombre}</strong><br />
                        C.I. <strong className="font-mono text-slate-950">{currentTitleData.directorCedula}</strong>
                      </div>
                    </div>

                    {/* Columna 2: Firma Coordinador de Control de Estudios (cols 5 a 8) */}
                    <div className="col-span-4 pl-4">
                      <div className="h-10 relative">
                        <img
                          src={`${import.meta.env.BASE_URL}titulo-firma-coordinador.png`}
                          alt="Firma Coordinador"
                          className="h-9 w-auto object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="text-[7.2pt] leading-tight text-slate-800">
                        Coordinador de Control de Estudio<br />
                        Representante del Consejo General de Docentes<br />
                        Nombre: <strong className="font-black text-slate-950">{currentTitleData.coordinadorControlEstudio}</strong><br />
                        C.I. <strong className="font-mono text-slate-950">{currentTitleData.coordinadorCedula}</strong>
                      </div>
                    </div>

                    {/* Columna 3: Firma Funcionario MPPE (cols 9 a 12) */}
                    <div className="col-span-4 pl-4">
                      <div className="h-10 relative">
                        <img
                          src={`${import.meta.env.BASE_URL}titulo-firma-mppe.png`}
                          alt="Firma MPPE"
                          className="h-9 w-auto object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="text-[7.2pt] leading-tight text-slate-800">
                        Funcionario Designado por el<br />
                        Ministerio del Poder Popular para la Educación<br />
                        Nombre: <strong className="font-black text-slate-950">{currentTitleData.funcionarioMppeNombre}</strong><br />
                        C.I. <strong className="font-mono text-slate-950">{currentTitleData.funcionarioMppeCedula}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Fila de Sellos Circulares (Sello Plantel y Sello Zona Educativa) */}
                  <div className="relative z-10 mt-1 flex items-center justify-between px-20 pointer-events-none">
                    {/* Sello Plantel */}
                    <div className="w-28 h-28 -mt-2">
                      <img
                        src={`${import.meta.env.BASE_URL}titulo-sello-plantel.png`}
                        alt="Sello Oficial Plantel CBA"
                        className="w-full h-full object-contain mix-blend-multiply opacity-90"
                      />
                    </div>

                    {/* Leyenda central Sello de la Zona Educativa */}
                    <div className="text-center text-[7pt] text-slate-600 font-bold uppercase">
                      Sello de la<br />Zona Educativa
                    </div>

                    {/* Sello Zona Educativa Zulia CDCE */}
                    <div className="w-28 h-28 -mt-2">
                      <img
                        src={`${import.meta.env.BASE_URL}titulo-sello-zona.png`}
                        alt="Sello Zona Educativa Zulia"
                        className="w-full h-full object-contain mix-blend-multiply opacity-90"
                      />
                    </div>
                  </div>

                  {/* Pie Oficial con Casa de la Moneda y Logo Gobierno Bolivariano */}
                  <div className="relative z-10 flex items-center justify-between pt-1 border-t border-slate-300 text-[6.8pt] text-slate-600">
                    <div className="font-mono">
                      Casa de la Moneda - Venezuela
                    </div>
                    <div>
                      <img
                        src={`${import.meta.env.BASE_URL}titulo-logo-gobierno.png`}
                        alt="Gobierno Bolivariano de Venezuela - MPPE"
                        className="h-6 w-auto object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modal to Register New Graduate Title */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 max-w-md w-full space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#2C2E53] dark:text-white">
                  Generar Nuevo Título de Bachiller
                </h3>
                <p className="text-xs text-slate-500">Seleccione el estudiante promovido de 5to Año</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Estudiante de la Institución:
              </label>
              <select
                value={newStudentId}
                onChange={(e) => setNewStudentId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-[#2C2E53] dark:text-white"
              >
                <option value="">-- Seleccionar alumno --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.cedula}) - {s.grade} "{s.section}"
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                disabled={!newStudentId}
                onClick={handleCreateTitle}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2C2E53] text-[#D4AF37] hover:bg-[#1f213b] disabled:opacity-40"
              >
                Crear Título
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ISOLATED PRINT CANVAS (Strictly 279.4mm x 215.9mm Landscape - Only visible on window.print()) */}
      <div
        className="title-print-isolated-sheet"
        style={{
          width: `${printSettings.pageWidthMm}mm`,
          height: `${printSettings.pageHeightMm}mm`,
          position: 'relative'
        }}
      >
        {blocks.map((block) => {
          if (!block.enabled) return null;
          const renderedHtml = renderTemplateText(block.sampleTemplate);

          return (
            <div
              key={`print-${block.id}`}
              style={{
                position: 'absolute',
                left: `${block.xMm}mm`,
                top: `${block.yMm}mm`,
                fontSize: `${block.fontSizePt * (printSettings.globalFontScale / 100)}pt`,
                fontWeight: block.fontWeight,
                letterSpacing: `${block.letterSpacingMm}mm`,
                lineHeight: block.lineHeight,
                textAlign: block.textAlign,
                fontFamily: block.fontFamily === 'serif' ? 'Times New Roman, serif' : block.fontFamily === 'mono' ? 'Courier New, monospace' : 'Arial, sans-serif',
                color: '#000000',
                whiteSpace: 'nowrap'
              }}
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          );
        })}
      </div>
    </div>
  );
};
