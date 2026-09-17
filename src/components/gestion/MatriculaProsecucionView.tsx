import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  ArrowRight,
  CheckCircle2,
  Filter,
  Download,
  Printer,
  Calendar,
  Layers,
  School
} from 'lucide-react';

export const MatriculaProsecucionView: React.FC = () => {
  const { students, currentSection } = useApp();
  const [selectedOriginGrade, setSelectedOriginGrade] = useState('3er Año');
  const [selectedOriginSection, setSelectedOriginSection] = useState('A');
  const [targetGrade, setTargetGrade] = useState('4to Año');
  const [targetSection, setTargetSection] = useState('A');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(students.map((s) => s.id));
  const [prosecutionSuccess, setProsecutionSuccess] = useState(false);

  const totalBoys = students.filter((s) => s.gender === 'M').length;
  const totalGirls = students.filter((s) => s.gender === 'F').length;

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map((s) => s.id));
    }
  };

  const handleExecuteProsecution = () => {
    setProsecutionSuccess(true);
    setTimeout(() => setProsecutionSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Control de Matrícula y Promoción
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C2E53] mt-1">Matrícula y Prosecución Masiva</h2>
          <p className="text-xs text-slate-500">
            ADM: Inscripciones masivas por sección y auditoría censal de estudiantes matriculados en el plantel.
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Varones</span>
            <span className="text-sm font-black text-[#2C2E53]">{totalBoys}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Hembras</span>
            <span className="text-sm font-black text-[#2C2E53]">{totalGirls}</span>
          </div>
          <div className="px-4 py-1.5 rounded-xl bg-[#2C2E53] text-[#D4AF37] text-center border border-[#D4AF37]/30 shadow-sm">
            <span className="text-[10px] font-bold block uppercase opacity-80">Total General</span>
            <span className="text-sm font-black">{students.length}</span>
          </div>
        </div>
      </div>

      {prosecutionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ¡Prosecución masiva ejecutada exitosamente! Se promovieron {selectedStudentIds.length} estudiantes hacia {targetGrade} Sección {targetSection}.
        </div>
      )}

      {/* Prosecution Parameters Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-cba-card space-y-4">
        <h3 className="font-extrabold text-sm text-[#2C2E53] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#D4AF37]" />
          Parámetros de Prosecución en Bloque (Año Escolar 2026-2027)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold">
          <div>
            <label className="text-slate-600 block mb-1">Grado Origen:</label>
            <select
              value={selectedOriginGrade}
              onChange={(e) => setSelectedOriginGrade(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
            >
              <option value="3er Año">3er Año (Media General)</option>
              <option value="4to Año">4to Año (Media General)</option>
              <option value="6to Grado">6to Grado (Primaria)</option>
            </select>
          </div>
          <div>
            <label className="text-slate-600 block mb-1">Sección Origen:</label>
            <select
              value={selectedOriginSection}
              onChange={(e) => setSelectedOriginSection(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
            >
              <option value="A">Sección A</option>
              <option value="B">Sección B</option>
            </select>
          </div>
          <div>
            <label className="text-slate-600 block mb-1">Grado Destino:</label>
            <select
              value={targetGrade}
              onChange={(e) => setTargetGrade(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
            >
              <option value="4to Año">4to Año (Media General)</option>
              <option value="5to Año">5to Año (Media General)</option>
              <option value="1er Año">1er Año (Media General)</option>
            </select>
          </div>
          <div>
            <label className="text-slate-600 block mb-1">Sección Destino:</label>
            <select
              value={targetSection}
              onChange={(e) => setTargetSection(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
            >
              <option value="A">Sección A</option>
              <option value="B">Sección B</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matricula Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              {selectedStudentIds.length === students.length ? 'Desmarcar Todos' : 'Seleccionar Todos'}
            </button>
            <span className="text-xs text-slate-500 font-medium">
              ({selectedStudentIds.length} de {students.length} seleccionados)
            </span>
          </div>

          <button
            onClick={handleExecuteProsecution}
            disabled={selectedStudentIds.length === 0}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            Promover Nómina Seleccionada
          </button>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[#1B1C33] text-white uppercase text-[10px] tracking-wider font-extrabold">
            <tr>
              <th className="py-3 px-4 w-12 text-center">Sel.</th>
              <th className="py-3 px-4">Cédula</th>
              <th className="py-3 px-4">Apellidos y Nombres</th>
              <th className="py-3 px-4">Género</th>
              <th className="py-3 px-4">Representante Legal</th>
              <th className="py-3 px-4">Teléfono Contacto</th>
              <th className="py-3 px-4 text-center">Estatus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {students.map((stu) => {
              const isSelected = selectedStudentIds.includes(stu.id);
              return (
                <tr
                  key={stu.id}
                  onClick={() => toggleSelectStudent(stu.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-50/40 hover:bg-amber-50/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectStudent(stu.id)}
                      className="rounded text-[#2C2E53] focus:ring-[#D4AF37]"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#2C2E53]">{stu.cedula}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{stu.fullName}</td>
                  <td className="py-3 px-4 font-semibold">{stu.gender === 'M' ? 'Masc.' : 'Fem.'}</td>
                  <td className="py-3 px-4 text-slate-600">{stu.representativeName}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{stu.representativePhone}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        stu.status === 'REGULAR'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : stu.status === 'MATERIA_PENDIENTE'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {stu.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
