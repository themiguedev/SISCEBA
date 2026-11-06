import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_GRADES_CATALOG, SpecializedSkillRecord } from '../../types';
import {
  Heart,
  Users,
  Search,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Sliders,
  ShieldCheck
} from 'lucide-react';

export const RasgosPersonalidadMediaView: React.FC = () => {
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

  // Estudiantes del salón en Media General
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

  // Registros de rasgos actitudinales existentes
  const actitudinalRecords = useMemo(() => {
    return (specializedSkills || []).filter(
      r =>
        r.level === 'MEDIA_GENERAL' &&
        r.grade === selectedGrade &&
        r.section === selectedSection &&
        r.lapso === selectedLapso &&
        r.type === 'ACTITUDINAL'
    );
  }, [specializedSkills, selectedGrade, selectedSection, selectedLapso]);

  // Estado local para los rasgos editables
  const [traitsMap, setTraitsMap] = useState<
    Record<
      string,
      {
        puntualidad: number;
        responsabilidad: number;
        uniforme: number;
        convivencia: number;
        colaboracion: number;
        obs: string;
      }
    >
  >({});

  React.useEffect(() => {
    const map: typeof traitsMap = {};
    salonStudents.forEach(stu => {
      const existing = actitudinalRecords.find(r => r.studentId === stu.id);
      map[stu.id] = {
        puntualidad: existing?.scoreNumeric ? Math.min(20, existing.scoreNumeric + 1) : 18,
        responsabilidad: existing?.scoreNumeric ?? 18,
        uniforme: 19,
        convivencia: 18,
        colaboracion: 17,
        obs: existing?.observacionesGenerales ?? 'Excelente desenvolvimiento en las actividades del plantel.'
      };
    });
    setTraitsMap(map);
  }, [salonStudents, actitudinalRecords]);

  const handleTraitChange = (
    studentId: string,
    field: keyof (typeof traitsMap)[string],
    value: any
  ) => {
    setTraitsMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const calculateFinalTraitScore = (studentId: string): number => {
    const data = traitsMap[studentId];
    if (!data) return 18;
    const avg =
      (Number(data.puntualidad) +
        Number(data.responsabilidad) +
        Number(data.uniforme) +
        Number(data.convivencia) +
        Number(data.colaboracion)) /
      5;
    return Math.round(avg);
  };

  const handleSaveStudent = async (studentId: string) => {
    const student = salonStudents.find(s => s.id === studentId);
    if (!student) return;

    const data = traitsMap[studentId];
    if (!data) return;

    const finalScore = calculateFinalTraitScore(studentId);
    const existing = actitudinalRecords.find(r => r.studentId === studentId);

    const record: SpecializedSkillRecord = {
      id: existing?.id || `skill-actitudinal-${studentId}-${selectedLapso}-${Date.now()}`,
      studentId,
      studentName: student.fullName,
      level: 'MEDIA_GENERAL',
      grade: selectedGrade,
      section: selectedSection,
      lapso: selectedLapso,
      type: 'ACTITUDINAL',
      scoreNumeric: finalScore,
      habitosTrabajo: `Responsabilidad: ${data.responsabilidad}/20. Puntualidad: ${data.puntualidad}/20.`,
      convivenciaSocial: `Convivencia: ${data.convivencia}/20. Porte de uniforme: ${data.uniforme}/20.`,
      autonomiaPersonal: `Colaboración: ${data.colaboracion}/20.`,
      observacionesGenerales: data.obs,
      evaluatedBy: currentUser?.fullName || currentRole,
      evaluatedAt: new Date().toISOString()
    };

    const ok = await saveSpecializedSkill(record);
    if (ok) {
      setSaveSuccessMsg(`Rasgos de ${student.fullName} guardados exitosamente (${finalScore}/20).`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  const handleSaveAll = async () => {
    let count = 0;
    for (const stu of salonStudents) {
      const data = traitsMap[stu.id];
      if (!data) continue;

      const finalScore = calculateFinalTraitScore(stu.id);
      const existing = actitudinalRecords.find(r => r.studentId === stu.id);

      const record: SpecializedSkillRecord = {
        id: existing?.id || `skill-actitudinal-${stu.id}-${selectedLapso}-${Date.now()}`,
        studentId: stu.id,
        studentName: stu.fullName,
        level: 'MEDIA_GENERAL',
        grade: selectedGrade,
        section: selectedSection,
        lapso: selectedLapso,
        type: 'ACTITUDINAL',
        scoreNumeric: finalScore,
        habitosTrabajo: `Responsabilidad: ${data.responsabilidad}/20. Puntualidad: ${data.puntualidad}/20.`,
        convivenciaSocial: `Convivencia: ${data.convivencia}/20. Porte de uniforme: ${data.uniforme}/20.`,
        autonomiaPersonal: `Colaboración: ${data.colaboracion}/20.`,
        observacionesGenerales: data.obs,
        evaluatedBy: currentUser?.fullName || currentRole,
        evaluatedAt: new Date().toISOString()
      };

      const ok = await saveSpecializedSkill(record);
      if (ok) count++;
    }

    setSaveSuccessMsg(`Se guardaron exitosamente ${count} registros de Rasgos de Personalidad.`);
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

      {/* Banner Explicativo de Rasgos de Personalidad */}
      <div className="bg-gradient-to-r from-purple-900/10 via-slate-50 to-pink-900/10 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-4 border border-purple-200/50 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#2C2E53] dark:text-white uppercase tracking-wider">
              Evaluación de Rasgos de Personalidad y Convivencia Escolar
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Escala Vigesimal Oficial (01 a 20) ponderada: Puntualidad, Responsabilidad, Porte de Uniforme, Respeto y Convivencia.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold text-slate-400">
          {salonStudents.length} alumno(s)
        </span>
      </div>

      {/* Tarjetas de Evaluación de Rasgos por Estudiante */}
      {salonStudents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 text-slate-400">
          No hay estudiantes en {selectedGrade} Sección "{selectedSection}".
        </div>
      ) : (
        <div className="space-y-4">
          {salonStudents.map(student => {
            const data = traitsMap[student.id] || {
              puntualidad: 18,
              responsabilidad: 18,
              uniforme: 19,
              convivencia: 18,
              colaboracion: 17,
              obs: ''
            };
            const finalScore = calculateFinalTraitScore(student.id);

            return (
              <div
                key={student.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-[240px]">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black">
                    {student.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#2C2E53] dark:text-slate-100">
                      {student.fullName}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      C.I. {student.cedula || 'S/C'}
                    </div>
                  </div>
                </div>

                {/* Dimensiones de Rasgos */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full xl:w-auto">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Puntualidad</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={data.puntualidad}
                      onChange={e => handleTraitChange(student.id, 'puntualidad', Number(e.target.value))}
                      className="w-full px-2 py-1 font-mono font-bold text-xs text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Responsabilidad</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={data.responsabilidad}
                      onChange={e => handleTraitChange(student.id, 'responsabilidad', Number(e.target.value))}
                      className="w-full px-2 py-1 font-mono font-bold text-xs text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Uniforme</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={data.uniforme}
                      onChange={e => handleTraitChange(student.id, 'uniforme', Number(e.target.value))}
                      className="w-full px-2 py-1 font-mono font-bold text-xs text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Convivencia</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={data.convivencia}
                      onChange={e => handleTraitChange(student.id, 'convivencia', Number(e.target.value))}
                      className="w-full px-2 py-1 font-mono font-bold text-xs text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Colaboración</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={data.colaboracion}
                      onChange={e => handleTraitChange(student.id, 'colaboracion', Number(e.target.value))}
                      className="w-full px-2 py-1 font-mono font-bold text-xs text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                {/* Nota Final de Rasgo & Guardar */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Nota Rasgo</div>
                    <div className="text-lg font-black font-mono text-[#D4AF37]">
                      {String(finalScore).padStart(2, '0')} / 20
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveStudent(student.id)}
                    className="p-2 bg-slate-100 hover:bg-[#2C2E53] hover:text-[#D4AF37] rounded-xl text-slate-700 dark:text-slate-200 transition"
                    title="Guardar rasgos de este estudiante"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
