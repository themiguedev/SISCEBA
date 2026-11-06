import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG } from '../../types';
import {
  FileText,
  Printer,
  FileSpreadsheet,
  Download,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  Scale
} from 'lucide-react';
import { exportTableElementToExcel } from '../../utils/excelExport';

export const ActasOficialesMediaView: React.FC = () => {
  const { students, activeLapso, calculateStudentPensumAverages } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>(LEVEL_GRADES_CATALOG.MEDIA_GENERAL[0]);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(activeLapso as 1 | 2 | 3);
  const [actaType, setActaType] = useState<'CALIFICACIONES' | 'CONSEJO' | 'REVISION' | 'PENDIENTE'>('CALIFICACIONES');

  const salonStudents = useMemo(() => {
    return (students || []).filter(
      s => s.level === 'MEDIA_GENERAL' && s.grade === selectedGrade && s.section === selectedSection
    );
  }, [students, selectedGrade, selectedSection]);

  const studentsSummary = useMemo(() => {
    return salonStudents.map((stu, idx) => {
      const averages = calculateStudentPensumAverages(stu.id, selectedLapso);
      return {
        idx: idx + 1,
        student: stu,
        avgMppe: averages.averageMppe,
        avgCba: averages.averageCba,
        isPassing: averages.averageMppe >= 10
      };
    });
  }, [salonStudents, selectedLapso, calculateStudentPensumAverages]);

  const passingCount = studentsSummary.filter(s => s.isPassing).length;
  const failingCount = studentsSummary.length - passingCount;

  return (
    <div className="space-y-6">
      
      {/* Controles de Selección */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Año */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Año Escolar
            </label>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#2C2E53] dark:text-slate-100 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              {LEVEL_GRADES_CATALOG.MEDIA_GENERAL.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Sección Oficial */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Sección Oficial
            </label>
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['A', 'B'] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    selectedSection === sec
                      ? 'bg-[#2C2E53] text-[#D4AF37] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sección {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Lapso */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Momento / Lapso
            </label>
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {([1, 2, 3] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setSelectedLapso(l)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    selectedLapso === l
                      ? 'bg-[#D4AF37] text-slate-950 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {l}° Lapso
                </button>
              ))}
            </div>
          </div>

          {/* Tipo de Acta */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Tipo de Acta
            </label>
            <select
              value={actaType}
              onChange={e => setActaType(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#2C2E53] dark:text-slate-100 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="CALIFICACIONES">Acta de Calificaciones de Fin de Lapso</option>
              <option value="CONSEJO">Acta de Deliberación de Consejo de Curso</option>
              <option value="REVISION">Acta Oficial de Pruebas de Revisión</option>
              <option value="PENDIENTE">Acta de Evaluación de Materia Pendiente</option>
            </select>
          </div>
        </div>

        {/* Botones de Impresión */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const el = document.getElementById('cba-acta-oficial-container');
              if (el) {
                exportTableElementToExcel(el, {
                  title: `Acta Oficial CBA - ${selectedGrade} Sección ${selectedSection}`,
                  filename: `Acta_${actaType}_${selectedGrade.replace(/\s+/g, '_')}_Sec_${selectedSection}_L${selectedLapso}`,
                  orientation: 'portrait',
                  sheetName: `Acta ${actaType}`
                });
              } else {
                window.print();
              }
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Descargar e imprimir acta en formato Microsoft Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Imprimir en Excel</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Vista de impresión o PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir PDF</span>
          </button>
        </div>
      </div>

      {/* Formato Oficial del Acta */}
      <div id="cba-acta-oficial-container" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Membrete Oficial Bellas Artes */}
        <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-6 space-y-1">
          <div className="text-[10px] font-black tracking-widest uppercase text-slate-500">
            República Bolivariana de Venezuela • Ministerio del Poder Popular para la Educación
          </div>
          <h2 className="text-base sm:text-lg font-black text-[#2C2E53] dark:text-white uppercase tracking-wider">
            Unidad Educativa Privada Colegio "Bellas Artes"
          </h2>
          <div className="text-xs text-slate-500">
            Código DEA: PD00142003 • RIF: J-00000000-0 • Maracaibo, Estado Zulia
          </div>
          <div className="pt-3">
            <span className="inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-[#2C2E53] dark:text-[#D4AF37] border border-slate-200 dark:border-slate-700">
              {actaType === 'CALIFICACIONES' && 'ACTA DE ASENTAMIENTO DE CALIFICACIONES FINALES'}
              {actaType === 'CONSEJO' && 'ACTA DE CONSEJO DE CURSO Y ACUERDOS PEDAGÓGICOS'}
              {actaType === 'REVISION' && 'ACTA DE EVALUACIÓN DE PRUEBAS DE REVISIÓN DE JULIO'}
              {actaType === 'PENDIENTE' && 'ACTA DE CALIFICACIONES DE MATERIA PENDIENTE'}
            </span>
          </div>
        </div>

        {/* Encabezado del Acta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Año Escolar:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">2025 - 2026</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Nivel / Grado:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{selectedGrade} Sección "{selectedSection}"</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Momento / Lapso:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{selectedLapso}° Momento</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Matrícula Evaluada:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{salonStudents.length} Alumnos</span>
          </div>
        </div>

        {/* Tabla del Acta */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3 text-center">N°</th>
                <th className="py-2.5 px-4">Cédula de Identidad</th>
                <th className="py-2.5 px-4">Apellidos y Nombres</th>
                <th className="py-2.5 px-3 text-center">Prom. Regular MPPE</th>
                <th className="py-2.5 px-3 text-center">Prom. CBA</th>
                <th className="py-2.5 px-4 text-center">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentsSummary.map(row => (
                <tr key={row.student.id} className="hover:bg-slate-50/50">
                  <td className="py-2 px-3 text-center font-mono font-bold text-slate-400">
                    {String(row.idx).padStart(2, '0')}
                  </td>
                  <td className="py-2 px-4 font-mono font-bold text-slate-600 dark:text-slate-400">
                    {row.student.cedula || 'S/C'}
                  </td>
                  <td className="py-2 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {row.student.fullName}
                  </td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-sm">
                    {row.avgMppe > 0 ? row.avgMppe.toFixed(2) : '--'}
                  </td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-sm text-[#D4AF37]">
                    {row.avgCba > 0 ? row.avgCba.toFixed(2) : '--'}
                  </td>
                  <td className="py-2 px-4 text-center font-bold">
                    <span className={row.isPassing ? 'text-emerald-600' : 'text-rose-600'}>
                      {row.isPassing ? 'Aprobado' : 'Aplazado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen Estadístico y Fe de Cierre */}
        <div className="pt-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p>
            En fe de lo actuado, se deja constancia de que de un total de <strong className="text-slate-900 dark:text-white">{salonStudents.length}</strong> estudiantes matriculados, resultaron aprobados <strong className="text-emerald-600">{passingCount}</strong> y aplazados <strong className="text-rose-600">{failingCount}</strong>.
          </p>
          <p>
            Las calificaciones asentadas son producto de la aplicación del régimen de evaluación continua, formativa y cuantitativa en estricto apego al ordenamiento legal del Ministerio del Poder Popular para la Educación y el Proyecto Pedagógico del Colegio Bellas Artes.
          </p>
        </div>

        {/* Bloque de Firmas Institucionales */}
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-xs">
          <div className="space-y-1">
            <div className="border-t border-slate-300 dark:border-slate-700 pt-2 font-bold text-slate-800 dark:text-slate-200">
              Dirección General
            </div>
            <div className="text-[10px] text-slate-400">Firma y Sello</div>
          </div>

          <div className="space-y-1">
            <div className="border-t border-slate-300 dark:border-slate-700 pt-2 font-bold text-slate-800 dark:text-slate-200">
              Coordinación Pedagógica
            </div>
            <div className="text-[10px] text-slate-400">Media General</div>
          </div>

          <div className="space-y-1">
            <div className="border-t border-slate-300 dark:border-slate-700 pt-2 font-bold text-slate-800 dark:text-slate-200">
              Docente Guía de Sección
            </div>
            <div className="text-[10px] text-slate-400">Sección "{selectedSection}"</div>
          </div>
        </div>

      </div>

    </div>
  );
};
