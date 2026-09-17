import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentRequest } from '../../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Send,
  Building,
  User,
  X
} from 'lucide-react';

export const DocumentosSolicitadosView: React.FC = () => {
  const { documentRequests, updateDocumentStatus, addDocumentRequest, students } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [repName, setRepName] = useState('Ing. Carlos Urdaneta');
  const [docType, setDocType] = useState<DocumentRequest['documentType']>('Constancia de Estudio');
  const [department, setDepartment] = useState<DocumentRequest['department']>('Control de Estudios');
  const [notes, setNotes] = useState('');

  const filteredRequests = documentRequests.filter((req) => {
    const matchesStatus = filterStatus === 'ALL' || req.status === filterStatus;
    const matchesSearch =
      req.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.representativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stu = students.find((s) => s.id === selectedStudentId);
    if (!stu) return;

    addDocumentRequest({
      representativeName: repName,
      studentName: stu.fullName,
      gradeSection: `${stu.grade} ${stu.section}`,
      documentType: docType,
      department: department,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'PENDIENTE',
      notes: notes
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Trámites y Secretaría Escolar
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C2E53] mt-1">Documentos Solicitados</h2>
          <p className="text-xs text-slate-500">
            ADM: Gestione las solicitudes de constancias, notas certificadas y recaudos con auditoría de días de espera (SLA).
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Solicitud de Trámite
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'PENDIENTE', 'EN_TRAMITE', 'LISTO_ENTREGA', 'ENTREGADO'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterStatus === st
                  ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st === 'ALL' && 'Todos los Trámites'}
              {st === 'PENDIENTE' && 'Pendientes'}
              {st === 'EN_TRAMITE' && 'En Trámite'}
              {st === 'LISTO_ENTREGA' && 'Listos para Entrega'}
              {st === 'ENTREGADO' && 'Entregados'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por código, solicitante, alumno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1B1C33] text-white uppercase text-[10px] tracking-wider font-extrabold">
            <tr>
              <th className="py-3.5 px-4">Código / Trámite</th>
              <th className="py-3.5 px-4">Solicitante (Representante)</th>
              <th className="py-3.5 px-4">Estudiante / Curso</th>
              <th className="py-3.5 px-4">Documento</th>
              <th className="py-3.5 px-4">Departamento</th>
              <th className="py-3.5 px-4 text-center">Días Transcurridos (SLA)</th>
              <th className="py-3.5 px-4 text-center">Estatus</th>
              <th className="py-3.5 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {filteredRequests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-[#2C2E53]">
                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                    {req.trackingCode}
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-slate-900">{req.representativeName}</td>
                <td className="py-3 px-4">
                  <p className="font-semibold text-slate-800">{req.studentName}</p>
                  <p className="text-[10px] text-slate-400">{req.gradeSection}</p>
                </td>
                <td className="py-3 px-4 font-semibold text-[#2C2E53]">{req.documentType}</td>
                <td className="py-3 px-4 text-slate-500 text-[11px]">{req.department}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold inline-flex items-center gap-1 ${
                      req.elapsedDays > 5
                        ? 'bg-rose-100 text-rose-800'
                        : req.elapsedDays >= 3
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {req.elapsedDays} {req.elapsedDays === 1 ? 'día' : 'días'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <select
                    value={req.status}
                    onChange={(e) =>
                      updateDocumentStatus(req.id, e.target.value as DocumentRequest['status'])
                    }
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold focus:outline-none cursor-pointer border ${
                      req.status === 'ENTREGADO'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : req.status === 'LISTO_ENTREGA'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : req.status === 'EN_TRAMITE'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_TRAMITE">En Trámite</option>
                    <option value="LISTO_ENTREGA">Listo para Entrega</option>
                    <option value="ENTREGADO">Entregado</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-center">
                  {req.status !== 'ENTREGADO' && (
                    <button
                      onClick={() => updateDocumentStatus(req.id, 'ENTREGADO')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-sm transition flex items-center gap-1 mx-auto"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Marcar Entregado
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-extrabold text-[#2C2E53] text-base">Registrar Solicitud de Trámite</h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Solicitante / Representante:</label>
                <input
                  type="text"
                  required
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Documento:</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as DocumentRequest['documentType'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                  >
                    <option value="Constancia de Estudio">Constancia de Estudio</option>
                    <option value="Notas Certificadas">Notas Certificadas</option>
                    <option value="Carta de Buena Conducta">Carta de Buena Conducta</option>
                    <option value="Solvencia Administrativa">Solvencia Administrativa</option>
                    <option value="Certificación de Título">Certificación de Título</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Departamento Responsable:</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as DocumentRequest['department'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                  >
                    <option value="Control de Estudios">Control de Estudios</option>
                    <option value="Administración">Administración</option>
                    <option value="Dirección">Dirección</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Observaciones o Motivo del Trámite:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ej. Para consignar en embajada / trámite legal..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Crear Trámite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
