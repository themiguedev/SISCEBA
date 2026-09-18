import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PassRecord } from '../../types';
import {
  Clock,
  Plus,
  Printer,
  Trash2,
  Search,
  Calendar,
  CheckCircle2,
  X,
  AlertTriangle,
  School,
  Ticket
} from 'lucide-react';

export const PasesRetrasoView: React.FC = () => {
  const { passes, addPass, deletePass, printPass, students, sendNotification } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-17');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTicketToPrint, setActiveTicketToPrint] = useState<PassRecord | null>(null);

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [passReason, setPassReason] = useState('Retraso por tráfico vehicular matutino');
  const [passTime, setPassTime] = useState('07:25 AM');
  const [authorizedBy, setAuthorizedBy] = useState('Portería Principal / Control de Estudios');

  const filteredPasses = passes.filter((p) => {
    const matchesDate = !selectedDate || p.date === selectedDate;
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.gradeSection.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDate && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stu = students.find((s) => s.id === selectedStudentId);
    if (!stu) return;

    const newPass = addPass({
      studentId: stu.id,
      studentName: stu.fullName,
      gradeSection: `${stu.grade} ${stu.section}`,
      date: selectedDate || new Date().toISOString().split('T')[0],
      time: passTime,
      reason: passReason,
      authorizedBy: authorizedBy,
      printed: false
    });

    // Despacho de notificación al representante y alumno
    sendNotification({
      title: `Aviso de Portería • Pase de Retraso #${newPass.ticketNumber}`,
      message: `Se registró el ingreso tardío a las ${passTime} para el estudiante ${stu.fullName} (${stu.grade} "${stu.section}"). Motivo: ${passReason}. Representante legal notificado.`,
      category: 'ASISTENCIA',
      priority: 'MEDIA',
      recipientRole: 'REPRESENTANTE',
      recipientName: stu.representativeName,
      studentName: stu.fullName,
      actionTab: 'GESTION',
      actionSubTab: 'PASES',
      deliveryChannels: ['PORTAL', 'SMS_WHATSAPP']
    });

    setIsCreateModalOpen(false);
    setActiveTicketToPrint(newPass);
  };

  const handlePrint = (pass: PassRecord) => {
    printPass(pass.id);
    setActiveTicketToPrint(pass);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Control de Acceso y Portería
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C2E53] mt-1">Pases por Retraso</h2>
          <p className="text-xs text-slate-500">
            ADM: Registre las llegadas tardías de los estudiantes y emita boletas oficiales de ingreso.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Imprimir Lista del Día
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Pase
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-bold text-slate-600">Fecha:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-slate-800 font-semibold focus:outline-none"
            />
          </div>
          {selectedDate && (
            <button
              onClick={() => setSelectedDate('')}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold underline"
            >
              Ver Todas
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por estudiante, ticket..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
          />
        </div>
      </div>

      {/* Passes Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1B1C33] text-white uppercase text-[10px] tracking-wider font-extrabold">
              <tr>
                <th className="py-3.5 px-4">Ticket N°</th>
                <th className="py-3.5 px-4">Fecha y Hora</th>
                <th className="py-3.5 px-4">Estudiante</th>
                <th className="py-3.5 px-4">Grado / Sección</th>
                <th className="py-3.5 px-4">Motivo del Retraso</th>
                <th className="py-3.5 px-4">Autorizado Por</th>
                <th className="py-3.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredPasses.length > 0 ? (
                filteredPasses.map((pass) => (
                  <tr key={pass.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#2C2E53]">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {pass.ticketNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="font-semibold text-slate-800">{pass.time}</span>
                        <span className="text-slate-400 text-[10px]">({pass.date})</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{pass.studentName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                        {pass.gradeSection}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600" title={pass.reason}>
                      {pass.reason}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{pass.authorizedBy}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handlePrint(pass)}
                          className={`p-1.5 rounded-lg border transition ${
                            pass.printed
                              ? 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                              : 'bg-amber-50 text-[#D4AF37] border-amber-200 hover:bg-amber-100'
                          }`}
                          title="Imprimir Boleta de Pase"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePass(pass.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition"
                          title="Eliminar Pase"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-sm text-slate-600">No existen registros de pases</p>
                    <p className="text-xs">No hay retrasos reportados para los criterios seleccionados.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE PASS MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-extrabold text-[#2C2E53] text-base">Registrar Nuevo Pase por Retraso</h3>
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.grade} {s.section}) - {s.cedula}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hora de Llegada:</label>
                  <input
                    type="text"
                    required
                    value={passTime}
                    onChange={(e) => setPassTime(e.target.value)}
                    placeholder="ej. 07:28 AM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Autorizado Por:</label>
                  <input
                    type="text"
                    required
                    value={authorizedBy}
                    onChange={(e) => setAuthorizedBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Motivo / Causa del Retraso:</label>
                <textarea
                  rows={3}
                  required
                  value={passReason}
                  onChange={(e) => setPassReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
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
                  Emitir Pase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE PASS TICKET PREVIEW MODAL */}
      {activeTicketToPrint && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 print:static print:bg-transparent print:backdrop-blur-none">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-300 print:shadow-none print:border-none print:p-2 animate-in zoom-in-95 duration-200">
            {/* Modal Non-print Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 no-print">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-xs font-black text-[#2C2E53]">
                  Vista Previa del Talonario Oficial
                </h3>
              </div>
              <button
                onClick={() => setActiveTicketToPrint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TALONARIO DUPLICADO OFICIAL CBA */}
            <div className="space-y-4">
              {/* TALÓN 1: COPIA REPRESENTANTE / ESTUDIANTE */}
              <div className="border border-slate-400 rounded-2xl p-4 bg-slate-50/50 print:bg-white text-center relative overflow-hidden">
                <span className="absolute top-2 right-2 text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#2C2E53] text-[#D4AF37]">
                  Copia 1: Alumno / Familia
                </span>

                <div className="flex items-center justify-center gap-2 mb-1">
                  <School className="w-5 h-5 text-[#2C2E53]" />
                  <div>
                    <h4 className="font-black text-xs text-[#2C2E53] uppercase tracking-wide">
                      U.E.P. Colegio Bellas Artes
                    </h4>
                    <span className="text-[9px] text-slate-500 font-semibold block">
                      Maracaibo • Control de Acceso y Asistencia
                    </span>
                  </div>
                </div>

                <div className="my-1.5 py-0.5 px-3 bg-[#2C2E53] text-[#D4AF37] rounded-lg font-mono font-black text-xs inline-block">
                  BOLETA N° {activeTicketToPrint.ticketNumber}
                </div>

                <div className="text-left text-xs space-y-1 mt-2 pt-2 border-t border-slate-300">
                  <div className="grid grid-cols-2 gap-1">
                    <p>
                      <span className="font-bold text-slate-500 text-[10px] block">Estudiante:</span>
                      <strong className="text-slate-900">{activeTicketToPrint.studentName}</strong>
                    </p>
                    <p>
                      <span className="font-bold text-slate-500 text-[10px] block">Curso / Sección:</span>
                      <strong className="text-slate-900">{activeTicketToPrint.gradeSection}</strong>
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    <p>
                      <span className="font-bold text-slate-500 text-[10px] block">Fecha y Hora:</span>
                      <span className="text-slate-800 font-semibold">{activeTicketToPrint.date} • {activeTicketToPrint.time}</span>
                    </p>
                    <p>
                      <span className="font-bold text-slate-500 text-[10px] block">Autorizado por:</span>
                      <span className="text-slate-800 font-semibold truncate block">{activeTicketToPrint.authorizedBy}</span>
                    </p>
                  </div>
                  <p className="pt-1">
                    <span className="font-bold text-slate-500 text-[10px] block">Causa declarada:</span>
                    <span className="text-slate-700 italic">{activeTicketToPrint.reason}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-300 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="h-0.5 bg-slate-400 w-full mb-1"></div>
                    <p className="text-[8px] font-bold text-slate-600 uppercase">Portería / Control</p>
                  </div>
                  <div>
                    <div className="h-0.5 bg-slate-400 w-full mb-1"></div>
                    <p className="text-[8px] font-bold text-slate-600 uppercase">Docente de Aula</p>
                  </div>
                </div>
              </div>

              {/* LÍNEA DE CORTE CON TIJERAS */}
              <div className="relative flex items-center justify-center my-2">
                <div className="border-t-2 border-dashed border-slate-400 w-full"></div>
                <span className="absolute bg-white px-3 text-[10px] text-slate-500 font-mono flex items-center gap-1 font-bold">
                  ✂️ CORTAR AQUÍ • TALONARIO OFICIAL
                </span>
              </div>

              {/* TALÓN 2: COPIA CONTROL DE PORTERÍA / ARCHIVO */}
              <div className="border border-slate-400 rounded-2xl p-4 bg-slate-50/50 print:bg-white text-center relative overflow-hidden">
                <span className="absolute top-2 right-2 text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                  Copia 2: Portería / Archivo
                </span>

                <div className="flex items-center justify-center gap-2 mb-1">
                  <School className="w-5 h-5 text-[#2C2E53]" />
                  <div>
                    <h4 className="font-black text-xs text-[#2C2E53] uppercase tracking-wide">
                      U.E.P. Colegio Bellas Artes
                    </h4>
                    <span className="text-[9px] text-slate-500 font-semibold block">
                      Auditoría Diaria • Boleta de Retraso
                    </span>
                  </div>
                </div>

                <div className="my-1.5 py-0.5 px-3 bg-[#2C2E53] text-[#D4AF37] rounded-lg font-mono font-black text-xs inline-block">
                  BOLETA N° {activeTicketToPrint.ticketNumber}
                </div>

                <div className="text-left text-xs space-y-1 mt-2 pt-2 border-t border-slate-300">
                  <div className="grid grid-cols-2 gap-1">
                    <p>
                      <span className="font-bold text-slate-500 text-[10px] block">Estudiante:</span>
                      <strong className="text-slate-900">{activeTicketToPrint.studentName}</strong>
                    </p>
                    <p>
                      <span className="font-bold text-slate-500 text-[10px] block">Curso / Sección:</span>
                      <strong className="text-slate-900">{activeTicketToPrint.gradeSection}</strong>
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    <p>
                      <span className="font-bold text-slate-500 text-[10px] block">Fecha y Hora:</span>
                      <span className="text-slate-800 font-semibold">{activeTicketToPrint.date} • {activeTicketToPrint.time}</span>
                    </p>
                    <p>
                      <span className="font-bold text-slate-500 text-[10px] block">Autorizado por:</span>
                      <span className="text-slate-800 font-semibold truncate block">{activeTicketToPrint.authorizedBy}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-300 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="h-0.5 bg-slate-400 w-full mb-1"></div>
                    <p className="text-[8px] font-bold text-slate-600 uppercase">Firma del Representante</p>
                  </div>
                  <div>
                    <div className="h-0.5 bg-slate-400 w-full mb-1"></div>
                    <p className="text-[8px] font-bold text-slate-600 uppercase">Sello de Control CBA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Non-print Footer Buttons */}
            <div className="mt-5 flex items-center justify-between no-print pt-3 border-t border-slate-200">
              <button
                onClick={() => setActiveTicketToPrint(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Imprimir Boleta Duplicada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
