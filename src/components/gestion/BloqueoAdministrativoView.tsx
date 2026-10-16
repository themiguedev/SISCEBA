import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Unlock,
  AlertOctagon,
  CheckCircle2,
  DollarSign,
  Search,
  User,
  ShieldAlert,
  Plus,
  Trash2,
  Filter,
  Calendar,
  AlertTriangle,
  X,
  CreditCard,
  Layers
} from 'lucide-react';
import { AdministrativeBlockEntry } from '../../types';

export const BloqueoAdministrativoView: React.FC = () => {
  const {
    adminBlocks,
    toggleAdminBlock,
    addAdminBlock,
    deleteAdminBlock,
    students,
    currentUser
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'BLOQUEADOS' | 'SOLVENTES'>('TODOS');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for new Block
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [concept, setConcept] = useState<AdministrativeBlockEntry['concept']>('MATRICULA');
  const [reason, setReason] = useState('');
  const [debtAmount, setDebtAmount] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  // Auto-fill student data
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleOpenModal = () => {
    setSelectedStudentId(students[0]?.id || '');
    setConcept('MATRICULA');
    setReason('Pendiente pago de matrícula escolar 2026-2027');
    setDebtAmount(50);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    addAdminBlock({
      representativeId: `rep-${selectedStudent.id}`,
      representativeName: selectedStudent.representativeName || 'Representante Legal',
      studentId: selectedStudent.id,
      studentName: selectedStudent.fullName,
      gradeSection: `${selectedStudent.grade} "${selectedStudent.section}"`,
      reason: reason.trim() || 'Compromiso administrativo pendiente',
      blockDate: new Date().toISOString().split('T')[0],
      active: true,
      debtAmount: debtAmount !== '' ? Number(debtAmount) : undefined,
      concept,
      notes: notes.trim() || undefined
    });

    setIsModalOpen(false);
  };

  const filteredBlocks = adminBlocks.filter((b) => {
    const matchesSearch =
      b.representativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.concept && b.concept.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'BLOQUEADOS') return b.active;
    if (statusFilter === 'SOLVENTES') return !b.active;
    return true;
  });

  // KPI Calculations
  const totalBlocked = adminBlocks.filter(b => b.active).length;
  const totalSolvent = adminBlocks.filter(b => !b.active).length;
  const totalDebt = adminBlocks
    .filter(b => b.active && b.debtAmount)
    .reduce((sum, b) => sum + (Number(b.debtAmount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#2C2E53] dark:text-white">
            Bloqueo Administrativo
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gestión institucional de solvencia. Los alumnos o representantes con bloqueo activo no podrán consultar boletines ni emitir recaudos hasta solventar en caja.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95 whitespace-nowrap self-stretch md:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Registrar Bloqueo Administrativo
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Cuentas Bloqueadas</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block">{totalBlocked}</span>
            <span className="text-[10px] text-slate-400">Acceso a boletín restringido</span>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Cuentas Solventes</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">{totalSolvent}</span>
            <span className="text-[10px] text-slate-400">Desbloqueadas tras pago</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
            <Unlock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Compromiso Total Mora</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
              ${totalDebt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-400">Monto total referencial</span>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Padrón Monitoreado</span>
            <span className="text-2xl font-black text-[#2C2E53] dark:text-white mt-1 block">{adminBlocks.length}</span>
            <span className="text-[10px] text-slate-400">Registros en historial</span>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-[#2C2E53] dark:text-white border border-slate-200 dark:border-slate-700">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Information Alert */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Protección y Sincronización Institucional:</span>
          Al activar el bloqueo administrativo, el sistema oculta inmediatamente el boletín informativo a representantes y alumnos vinculados, desplegando un aviso formal con los requisitos y montos para regularizarse con la oficina de Cobranzas.
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filtrar:
          </span>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 text-xs font-bold">
            <button
              onClick={() => setStatusFilter('TODOS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'TODOS'
                  ? 'bg-white dark:bg-slate-700 text-[#2C2E53] dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Todos ({adminBlocks.length})
            </button>
            <button
              onClick={() => setStatusFilter('BLOQUEADOS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'BLOQUEADOS'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-rose-600 dark:hover:text-rose-400'
              }`}
            >
              Bloqueados ({totalBlocked})
            </button>
            <button
              onClick={() => setStatusFilter('SOLVENTES')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'SOLVENTES'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              Solventes ({totalSolvent})
            </button>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por estudiante, representante, concepto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-cba-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1B1C33] text-white uppercase text-[10px] tracking-wider font-extrabold">
              <tr>
                <th className="py-3.5 px-4">Estudiante</th>
                <th className="py-3.5 px-4">Curso y Sección</th>
                <th className="py-3.5 px-4">Representante Legal</th>
                <th className="py-3.5 px-4">Concepto</th>
                <th className="py-3.5 px-4">Motivo del Bloqueo</th>
                <th className="py-3.5 px-4 text-center">Monto Referencial</th>
                <th className="py-3.5 px-4 text-center">Estado de Acceso</th>
                <th className="py-3.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {filteredBlocks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No se encontraron registros de bloqueo administrativo bajo este criterio.
                  </td>
                </tr>
              ) : (
                filteredBlocks.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div>{item.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">ID: {item.studentId}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {item.gradeSection || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{item.representativeName}</div>
                      <div className="text-[10px] text-slate-400">Fecha Bloqueo: {item.blockDate}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.concept || 'MATRICULA'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-slate-600 dark:text-slate-400">
                      <div className="truncate font-medium" title={item.reason}>{item.reason}</div>
                      {item.notes && (
                        <div className="text-[10px] text-slate-400 truncate italic">Nota: {item.notes}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-600 dark:text-rose-400">
                      {item.debtAmount ? `$${Number(item.debtAmount).toFixed(2)}` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.active ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center justify-center gap-1 w-fit mx-auto">
                          <Lock className="w-3 h-3" />
                          Bloqueado
                        </span>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1 w-fit">
                            <Unlock className="w-3 h-3" />
                            Solvente
                          </span>
                          {item.unblockedDate && (
                            <span className="text-[9px] text-slate-400 mt-0.5">
                              {item.unblockedDate}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => toggleAdminBlock(item.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95 ${
                            item.active
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-rose-600 hover:bg-rose-700 text-white'
                          }`}
                          title={item.active ? 'Marcar Solvente (Desbloquear)' : 'Reactivar Bloqueo'}
                        >
                          {item.active ? (
                            <>
                              <Unlock className="w-3.5 h-3.5" />
                              Desbloquear
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              Bloquear
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`¿Está seguro de eliminar el registro administrativo de ${item.studentName}?`)) {
                              deleteAdminBlock(item.id);
                            }
                          }}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                          title="Eliminar Registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Registrar Bloqueo Administrativo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-fade-in my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-100 dark:border-rose-900">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#2C2E53] dark:text-white">
                    Registrar Bloqueo Administrativo
                  </h3>
                  <p className="text-xs text-slate-500">Restricción de boletines y constancias por mora</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlock} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Seleccionar Estudiante <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.cedula}) — {s.grade} "{s.section}"
                    </option>
                  ))}
                </select>
              </div>

              {selectedStudent && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Representante:</span>
                    <span className="font-bold text-slate-800 dark:text-white">{selectedStudent.representativeName || 'No especificado'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Curso y Sección:</span>
                    <span className="font-bold text-slate-800 dark:text-white">{selectedStudent.grade} "{selectedStudent.section}"</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Concepto de Mora <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={concept}
                    onChange={(e) => setConcept(e.target.value as AdministrativeBlockEntry['concept'])}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="MATRICULA">Matrícula Escolar</option>
                    <option value="MENSUALIDAD">Mensualidad(es)</option>
                    <option value="RECAUDOS">Recaudos Pendientes</option>
                    <option value="MATERIALES">Material Didáctico</option>
                    <option value="OTRO">Otro Concepto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Monto Deuda ($ USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={debtAmount}
                      onChange={(e) => setDebtAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Motivo / Observación del Bloqueo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Saldo deudor de matrícula correspondiente al año escolar 2026-2027"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notas Internas de Cobranzas (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Instrucciones especiales para secretaría o caja..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95"
                >
                  Guardar y Activar Bloqueo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
