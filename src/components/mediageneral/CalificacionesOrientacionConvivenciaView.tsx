import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG, SpecializedSkillRecord } from '../../types';
import {
  HeartHandshake,
  Users,
  Search,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  FileCheck2,
  Clock,
  Printer
} from 'lucide-react';

export const CalificacionesOrientacionConvivenciaView: React.FC = () => {
  const {
    students,
    activeLapso,
    specializedSkills,
    saveSpecializedSkill,
    currentRole,
    currentUser
  } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>(LEVEL_GRADES_CATALOG.MEDIA_GENERAL[0]);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedLapso, setSelectedLapso] = useState<1 | 2 | 3>(activeLapso as 1 | 2 | 3);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Estudiantes del salón seleccionado
  const salonStudents = useMemo(() => {
    return (students || [])
      .filter(s => s.level === 'MEDIA_GENERAL' && s.grade === selectedGrade && s.section === selectedSection)
      .filter(s => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          (s.fullName || '').toLowerCase().includes(term) ||
          (s.cedula || '').toLowerCase().includes(term)
        );
      });
  }, [students, selectedGrade, selectedSection, searchTerm]);

  // Registros de Orientación y Convivencia para este salón y lapso
  const orientacionRecords = useMemo(() => {
    return (specializedSkills || []).filter(
      r =>
        r.level === 'MEDIA_GENERAL' &&
        r.grade === selectedGrade &&
        r.section === selectedSection &&
        r.lapso === selectedLapso &&
        r.type === 'ORIENTACION_CONVIVENCIA'
    );
  }, [specializedSkills, selectedGrade, selectedSection, selectedLapso]);

  // Estado local para los campos editables
  const [editMap, setEditMap] = useState<Record<string, { scoreNumeric: number; obs: string; convivencia: string }>>({});

  // Sincronizar estado local con datos guardados
  React.useEffect(() => {
    const newMap: Record<string, { scoreNumeric: number; obs: string; convivencia: string }> = {};
    salonStudents.forEach(stu => {
      const existing = orientacionRecords.find(r => r.studentId === stu.id);
      newMap[stu.id] = {
        scoreNumeric: existing?.scoreNumeric ?? 18,
        obs: existing?.orientacionConvivenciaObs ?? '',
        convivencia: existing?.convivenciaSocial ?? 'Participación armónica y respeto a las normas del aula.'
      };
    });
    setEditMap(newMap);
  }, [salonStudents, orientacionRecords]);

  const handleFieldChange = (studentId: string, field: 'scoreNumeric' | 'obs' | 'convivencia', value: any) => {
    setEditMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSaveStudent = async (studentId: string) => {
    const student = salonStudents.find(s => s.id === studentId);
    if (!student) return;

    const data = editMap[studentId];
    if (!data) return;

    const existing = orientacionRecords.find(r => r.studentId === studentId);
    const record: SpecializedSkillRecord = {
      id: existing?.id || `skill-orientacion-${studentId}-${selectedLapso}-${Date.now()}`,
      studentId,
      studentName: student.fullName,
      level: 'MEDIA_GENERAL',
      grade: selectedGrade,
      section: selectedSection,
      lapso: selectedLapso,
      type: 'ORIENTACION_CONVIVENCIA',
      scoreNumeric: Number(data.scoreNumeric),
      convivenciaSocial: data.convivencia,
      orientacionConvivenciaObs: data.obs,
      evaluatedBy: currentUser?.fullName || currentRole,
      evaluatedAt: new Date().toISOString()
    };

    const ok = await saveSpecializedSkill(record);
    if (ok) {
      setSaveSuccessMsg(`Calificación de ${student.fullName} guardada correctamente.`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  const handleSaveAll = async () => {
    let successCount = 0;
    for (const stu of salonStudents) {
      const data = editMap[stu.id];
      if (!data) continue;

      const existing = orientacionRecords.find(r => r.studentId === stu.id);
      const record: SpecializedSkillRecord = {
        id: existing?.id || `skill-orientacion-${stu.id}-${selectedLapso}-${Date.now()}`,
        studentId: stu.id,
        studentName: stu.fullName,
        level: 'MEDIA_GENERAL',
        grade: selectedGrade,
        section: selectedSection,
        lapso: selectedLapso,
        type: 'ORIENTACION_CONVIVENCIA',
        scoreNumeric: Number(data.scoreNumeric),
        convivenciaSocial: data.convivencia,
        orientacionConvivenciaObs: data.obs,
        evaluatedBy: currentUser?.fullName || currentRole,
        evaluatedAt: new Date().toISOString()
      };

      const ok = await saveSpecializedSkill(record);
      if (ok) successCount++;
    }

    setSaveSuccessMsg(`Se guardaron exitosamente ${successCount} registros de Orientación y Convivencia.`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Barra de Filtros */}
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

          {/* Sección */}
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
        </div>

        {/* Búsqueda y Botón Guardar Todos */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar estudiante o cédula..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <button
            onClick={handleSaveAll}
            disabled={salonStudents.length === 0}
            className="px-4 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Todos</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-3 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200 font-bold">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Tarjeta Explicativa de Orientación y Convivencia */}
      <div className="bg-gradient-to-r from-teal-900/10 via-slate-50 to-blue-900/10 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-4 border border-teal-200/50 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#2C2E53] dark:text-white uppercase tracking-wider">
              Área de Formación: Orientación y Convivencia
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Evaluación cuantitativa vigesimal (01 a 20) articulada con el seguimiento biopsicosocial, valores de paz y convivencia ciudadana.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold text-slate-400">
          {salonStudents.length} alumno(s)
        </span>
      </div>

      {/* Lista de Calificación por Alumno */}
      {salonStudents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No hay estudiantes en {selectedGrade} Sección "{selectedSection}"
          </h4>
        </div>
      ) : (
        <div className="space-y-3">
          {salonStudents.map(student => {
            const data = editMap[student.id] || { scoreNumeric: 18, obs: '', convivencia: '' };
            const isPassing = data.scoreNumeric >= 10;

            return (
              <div
                key={student.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-[260px]">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#2C2E53] dark:text-[#D4AF37] flex items-center justify-center font-black">
                    {student.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#2C2E53] dark:text-slate-100">
                      {student.fullName}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      C.I. {student.cedula || 'Sin cédula'}
                    </div>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                  {/* Nota Cuantitativa */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Calificación (01-20)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={data.scoreNumeric}
                        onChange={e =>
                          handleFieldChange(
                            student.id,
                            'scoreNumeric',
                            Math.min(20, Math.max(1, Number(e.target.value) || 0))
                          )
                        }
                        className={`w-20 px-3 py-1.5 font-mono font-black text-sm rounded-xl border text-center outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                          isPassing
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-50/70 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
                        }`}
                      />
                      <span className="text-xs font-bold text-slate-400">/ 20</span>
                    </div>
                  </div>

                  {/* Convivencia y Relaciones Interpersonales */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Convivencia en Aula
                    </label>
                    <input
                      type="text"
                      value={data.convivencia}
                      onChange={e => handleFieldChange(student.id, 'convivencia', e.target.value)}
                      placeholder="Comportamiento, empatía y valores..."
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  {/* Observaciones Formativas */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Observación para el Boletín
                    </label>
                    <input
                      type="text"
                      value={data.obs}
                      onChange={e => handleFieldChange(student.id, 'obs', e.target.value)}
                      placeholder="Apreciación del docente guía..."
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Botón Guardar Individual */}
                <button
                  onClick={() => handleSaveStudent(student.id)}
                  className="px-3 py-2 bg-slate-100 hover:bg-[#2C2E53] hover:text-[#D4AF37] text-slate-700 dark:text-slate-200 dark:hover:text-[#D4AF37] rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                  title="Guardar registro de este estudiante"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
