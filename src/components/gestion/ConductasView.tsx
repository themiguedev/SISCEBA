import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConductEntry } from '../../types';
import {
  ShieldAlert,
  Award,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  Calendar,
  User,
  X
} from 'lucide-react';

export const ConductasView: React.FC = () => {
  const { conducts, addConduct, students, activeLapso } = useApp();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [type, setType] = useState<ConductEntry['type']>('LEVE');
  const [description, setDescription] = useState('');
  const [agreements, setAgreements] = useState('');
  const [reportedBy, setReportedBy] = useState('Docente de Aula / Coordinación');

  const filteredConducts = conducts.filter((c) => {
    const matchesType = filterType === 'ALL' || c.type === filterType;
    const matchesSearch =
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.gradeSection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stu = students.find((s) => s.id === selectedStudentId);
    if (!stu) return;

    addConduct({
      studentId: stu.id,
      studentName: stu.fullName,
      gradeSection: `${stu.grade} ${stu.section}`,
      date: new Date().toISOString().split('T')[0],
      lapso: activeLapso,
      type: type,
      description: description,
      agreements: agreements,
      reportedBy: reportedBy
    });

    setIsModalOpen(false);
    setDescription('');
    setAgreements('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Convivencia y Disciplina Escolar
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C2E53] mt-1">Registro de Conductas</h2>
          <p className="text-xs text-slate-500">
            ADM / DOC: Agregue y consulte el registro de incidencias, llamados de atención y reconocimientos del alumno.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Incidencia
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'POSITIVA', 'LEVE', 'GRAVE', 'MUY_GRAVE'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterType === t
                  ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {t === 'ALL' && 'Todas las Incidencias'}
              {t === 'POSITIVA' && 'Reconocimientos (+)'}
              {t === 'LEVE' && 'Faltas Leves'}
              {t === 'GRAVE' && 'Faltas Graves'}
              {t === 'MUY_GRAVE' && 'Muy Graves'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por estudiante, curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
          />
        </div>
      </div>

      {/* Grid of Incidents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredConducts.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl p-5 border shadow-cba-card space-y-3 ${
              item.type === 'POSITIVA'
                ? 'border-emerald-200'
                : item.type === 'MUY_GRAVE'
                ? 'border-rose-300 ring-1 ring-rose-300'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    item.type === 'POSITIVA'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : item.type === 'LEVE'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {item.type.replace('_', ' ')}
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm mt-1">{item.studentName}</h4>
                <p className="text-[11px] text-slate-400 font-semibold">{item.gradeSection}</p>
              </div>

              <div className="text-right text-[11px] text-slate-400 font-medium">
                <p className="flex items-center gap-1 justify-end font-semibold text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {item.date}
                </p>
                <p>Lapso {item.lapso}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-0.5">Hecho / Descripción:</span>
              {item.description}
            </div>

            {item.agreements && (
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-950 leading-relaxed">
                <span className="font-bold text-amber-900 block mb-0.5">Compromisos / Acuerdos:</span>
                {item.agreements}
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>Reportado por: <strong>{item.reportedBy}</strong></span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Registrado en Expediente
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-extrabold text-[#2C2E53] text-base">Registrar Incidencia Conductual</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Seleccionar Estudiante:</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.grade} {s.section})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Incidencia:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ConductEntry['type'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                  >
                    <option value="POSITIVA">Reconocimiento Positivo (+)</option>
                    <option value="LEVE">Falta Leve</option>
                    <option value="GRAVE">Falta Grave</option>
                    <option value="MUY_GRAVE">Falta Muy Grave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reportado Por:</label>
                  <input
                    type="text"
                    required
                    value={reportedBy}
                    onChange={(e) => setReportedBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción del Hecho:</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalle de lo ocurrido según el manual de convivencia..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Acuerdos o Compromisos:</label>
                <textarea
                  rows={2}
                  value={agreements}
                  onChange={(e) => setAgreements(e.target.value)}
                  placeholder="Compromisos adquiridos con el estudiante y representante..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Asentar en Expediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
