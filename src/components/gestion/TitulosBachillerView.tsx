import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TitleRecord } from '../../types';
import {
  GraduationCap,
  Printer,
  Sliders,
  CheckCircle2,
  FileText,
  Search,
  Save,
  Compass
} from 'lucide-react';

export const TitulosBachillerView: React.FC = () => {
  const { titles, saveTitleRecord } = useApp();
  const [selectedTitle, setSelectedTitle] = useState<TitleRecord | undefined>(titles[0]);
  const [saveBanner, setSaveBanner] = useState(false);

  // Calibration Margins State (in mm)
  const [marginTop, setMarginTop] = useState(45);
  const [marginLeft, setMarginLeft] = useState(30);
  const [fontScale, setFontScale] = useState(100);

  const activeTitle = selectedTitle || titles[0];

  if (!titles || titles.length === 0 || !activeTitle) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card">
          <h2 className="text-xl font-extrabold text-[#2C2E53]">Títulos de Bachiller y Calibración</h2>
          <p className="text-xs text-slate-500 mt-1">Secretaría de Grado y Egresos SICE-CBA</p>
        </div>
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-black text-[#2C2E53]">No hay títulos de bachiller registrados</h3>
          <p className="text-xs text-slate-500 mt-1">
            No existen folios ni seriales de título cargados actualmente en la base de datos.
          </p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    saveTitleRecord(activeTitle);
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Secretaría de Grado y Egresos
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C2E53] mt-1">Títulos de Bachiller y Calibración</h2>
          <p className="text-xs text-slate-500">
            ADM: Asignación de seriales ministeriales, tomo, folio y calibración de impresión en papel de seguridad.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Printer className="w-3.5 h-3.5" />
          Imprimir Título de Prueba
        </button>
      </div>

      {saveBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ¡Datos de título y parámetros de calibración guardados exitosamente!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Graduands List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-cba-card space-y-3">
            <h3 className="font-extrabold text-sm text-[#2C2E53]">Estudiantes Graduandos (5to Año)</h3>
            <div className="space-y-2">
              {titles.map((tit) => (
                <div
                  key={tit.id}
                  onClick={() => setSelectedTitle(tit)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    activeTitle.id === tit.id
                      ? 'bg-[#2C2E53] text-white border-[#2C2E53] shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <p className="font-bold text-xs truncate">{tit.studentName}</p>
                  <div className="flex items-center justify-between text-[11px] opacity-80 mt-1">
                    <span>{tit.cedula}</span>
                    <span className="font-mono font-bold">Serial: {tit.serialNumber.slice(-5)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center & Right: Form and Visual Calibrator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Form */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-[#2C2E53] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D4AF37]" />
                Ficha Ministerial del Título de Bachiller
              </h3>
              <span className="text-xs font-mono font-bold text-slate-400">
                Año Escolar: {activeTitle.schoolYear}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Serial de Papel de Seguridad:</label>
                <input
                  type="text"
                  value={activeTitle.serialNumber}
                  onChange={(e) => setSelectedTitle({ ...activeTitle, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tomo Registrado:</label>
                <input
                  type="text"
                  value={activeTitle.tomo}
                  onChange={(e) => setSelectedTitle({ ...activeTitle, tomo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Folio Registrado:</label>
                <input
                  type="text"
                  value={activeTitle.folio}
                  onChange={(e) => setSelectedTitle({ ...activeTitle, folio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Código Único de Registro:</label>
                <input
                  type="text"
                  value={activeTitle.registeredCode}
                  onChange={(e) => setSelectedTitle({ ...activeTitle, registeredCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Año de Graduación / Promoción:</label>
                <input
                  type="text"
                  value={activeTitle.graduationYear}
                  onChange={(e) => setSelectedTitle({ ...activeTitle, graduationYear: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Calibrator Sliders */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Sliders className="w-4 h-4 text-[#D4AF37]" />
                <span>Calibración de Márgenes de Impresión (Hardware / Impresora)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                <div>
                  <label className="text-slate-500 block mb-1">Margen Superior: {marginTop} mm</label>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={marginTop}
                    onChange={(e) => setMarginTop(Number(e.target.value))}
                    className="w-full accent-[#2C2E53]"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Margen Izquierdo: {marginLeft} mm</label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={marginLeft}
                    onChange={(e) => setMarginLeft(Number(e.target.value))}
                    className="w-full accent-[#2C2E53]"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Escala de Texto: {fontScale}%</label>
                  <input
                    type="range"
                    min="80"
                    max="120"
                    value={fontScale}
                    onChange={(e) => setFontScale(Number(e.target.value))}
                    className="w-full accent-[#2C2E53]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar Calibración y Datos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
