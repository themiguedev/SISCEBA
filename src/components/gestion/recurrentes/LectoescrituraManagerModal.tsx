import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  EducationalLevel,
  LEVEL_GRADES_CATALOG,
  SpecializedSkillRecord,
  SpecializedSkillType,
  QualitativeScore,
  LiteralScore
} from '../../../types';
import {
  BookOpen,
  Compass,
  Users,
  Search,
  Save,
  CheckCircle2,
  X,
  Sparkles,
  Edit,
  TrendingUp,
  FileCheck2,
  Clock
} from 'lucide-react';

interface LectoescrituraManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLevel?: EducationalLevel;
  initialType?: SpecializedSkillType;
}

export const LectoescrituraManagerModal: React.FC<LectoescrituraManagerModalProps> = ({
  isOpen,
  onClose,
  initialLevel = 'PRIMARIA',
  initialType = 'LECTOESCRITURA'
}) => {
  const { students, activeLapso, specializedSkills, saveSpecializedSkill, currentRole, currentUser } = useApp();

  const [selectedLevel, setSelectedLevel] = useState<EducationalLevel>(initialLevel);
  const [selectedType, setSelectedType] = useState<SpecializedSkillType>(initialType);
  const [selectedGrade, setSelectedGrade] = useState<string>(LEVEL_GRADES_CATALOG[initialLevel][0]);
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [savedAlert, setSavedAlert] = useState<boolean>(false);

  // Synchronize grade catalog on level change
  const handleLevelChange = (lvl: EducationalLevel) => {
    setSelectedLevel(lvl);
    setSelectedGrade(LEVEL_GRADES_CATALOG[lvl][0]);
    if (lvl === 'INICIAL') {
      setSelectedType('ACTITUDINAL');
    } else if (lvl === 'PRIMARIA') {
      setSelectedType('LECTOESCRITURA');
    } else {
      setSelectedType('PROYECTO_VIDA');
    }
  };

  // Filter students for current selection (Defensive empty guard)
  const targetStudents = useMemo(() => {
    return (students || []).filter(stu => {
      if (stu.level !== selectedLevel) return false;
      if (stu.grade !== selectedGrade) return false;
      if (stu.section !== selectedSection) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const name = (stu.fullName || '').toLowerCase();
        const cedula = (stu.cedula || '').toLowerCase();
        if (!name.includes(term) && !cedula.includes(term)) return false;
      }
      return true;
    });
  }, [students, selectedLevel, selectedGrade, selectedSection, searchTerm]);

  // Local grid state: studentId -> SpecializedSkillRecord
  const [recordsMap, setRecordsMap] = useState<Record<string, Partial<SpecializedSkillRecord>>>({});

  // Sync records with context state
  React.useEffect(() => {
    const map: Record<string, Partial<SpecializedSkillRecord>> = {};
    targetStudents.forEach(stu => {
      const existing = (specializedSkills || []).find(
        r => r.studentId === stu.id && r.lapso === activeLapso && r.type === selectedType
      );
      if (existing) {
        map[stu.id] = { ...existing };
      } else {
        // Defaults per subsystem
        map[stu.id] = {
          studentId: stu.id,
          studentName: stu.fullName,
          level: selectedLevel,
          grade: selectedGrade,
          section: selectedSection,
          lapso: activeLapso,
          type: selectedType,
          fluidezLectora: 'Fluida y con ritmo adecuado',
          comprensionLectora: 'Nivel Comprensivo Satisfactorio',
          velocidadPpm: selectedLevel === 'PRIMARIA' ? 100 : 160,
          caligrafiaOrtografia: 'Trazos legibles y ortografía regular',
          habitosTrabajo: 'Responsable y puntual',
          convivenciaSocial: 'Buena integración grupal',
          autonomiaPersonal: 'Autonomía adecuada',
          proyectoVidaMetas: selectedLevel === 'MEDIA_GENERAL' ? 'Orientación hacia ciencias o ingeniería' : '',
          orientacionConvivenciaObs: 'Actitud respetuosa y colaborativa',
          scoreQualitative: 'L',
          scoreLiteral: 'A',
          scoreNumeric: 17,
          observacionesGenerales: `Seguimiento de ${selectedType.toLowerCase()} - Lapso ${activeLapso}`
        };
      }
    });
    setRecordsMap(map);
  }, [targetStudents, activeLapso, selectedType, selectedLevel, selectedGrade, selectedSection, specializedSkills]);

  const handleFieldChange = (studentId: string, field: keyof SpecializedSkillRecord, value: any) => {
    setRecordsMap(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [field]: value
      }
    }));
  };

  const handleSaveAll = async () => {
    for (const stu of targetStudents) {
      const recData = recordsMap[stu.id];
      if (recData) {
        const fullRecord: SpecializedSkillRecord = {
          id: recData.id || `spec-${stu.id}-${selectedType}-${activeLapso}`,
          studentId: stu.id,
          studentName: stu.fullName,
          level: selectedLevel,
          grade: selectedGrade,
          section: selectedSection,
          lapso: activeLapso,
          type: selectedType,
          fluidezLectora: recData.fluidezLectora,
          comprensionLectora: recData.comprensionLectora,
          velocidadPpm: recData.velocidadPpm,
          caligrafiaOrtografia: recData.caligrafiaOrtografia,
          habitosTrabajo: recData.habitosTrabajo,
          convivenciaSocial: recData.convivenciaSocial,
          autonomiaPersonal: recData.autonomiaPersonal,
          proyectoVidaMetas: recData.proyectoVidaMetas,
          orientacionConvivenciaObs: recData.orientacionConvivenciaObs,
          scoreLiteral: selectedLevel === 'INICIAL' ? (recData.scoreLiteral as LiteralScore) : undefined,
          scoreQualitative: selectedLevel === 'PRIMARIA' ? (recData.scoreQualitative as QualitativeScore) : undefined,
          scoreNumeric: selectedLevel === 'MEDIA_GENERAL' ? Number(recData.scoreNumeric || 16) : undefined,
          observacionesGenerales: recData.observacionesGenerales,
          evaluatedBy: currentUser?.fullName || currentRole,
          evaluatedAt: new Date().toISOString().split('T')[0]
        };
        await saveSpecializedSkill(fullRecord);
      }
    }
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#2C2E53] p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl text-[#D4AF37] border border-white/10">
              {selectedType === 'PROYECTO_VIDA' ? (
                <Compass className="w-6 h-6" />
              ) : selectedType === 'ORIENTACION_CONVIVENCIA' ? (
                <Users className="w-6 h-6" />
              ) : (
                <BookOpen className="w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                {selectedType === 'LECTOESCRITURA' && 'Carga de Indicadores de Lectoescritura'}
                {selectedType === 'PROYECTO_VIDA' && 'Proyecto de Vida y Orientación Vocacional'}
                {selectedType === 'ORIENTACION_CONVIVENCIA' && 'Indicadores de Orientación y Convivencia'}
                {selectedType === 'ACTITUDINAL' && 'Carga y Revisión de Indicadores Actitudinales'}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#1B1C33] font-bold">
                  Lapso {activeLapso}
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Seguimiento de competencias transversales oficiales y registro cualitativo/cuantitativo.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Level Switcher */}
            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['INICIAL', 'PRIMARIA', 'MEDIA_GENERAL'] as EducationalLevel[]).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => handleLevelChange(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedLevel === lvl
                      ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {lvl === 'MEDIA_GENERAL' ? 'Media General' : lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Type Switcher based on level */}
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value as SpecializedSkillType)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
            >
              {selectedLevel === 'INICIAL' && (
                <option value="ACTITUDINAL">Indicadores Actitudinales y Hábitos</option>
              )}
              {selectedLevel === 'PRIMARIA' && (
                <>
                  <option value="LECTOESCRITURA">Lectoescritura (Fluidez y Comprensión)</option>
                  <option value="ACTITUDINAL">Indicadores Actitudinales y Convivencia</option>
                </>
              )}
              {selectedLevel === 'MEDIA_GENERAL' && (
                <>
                  <option value="PROYECTO_VIDA">Proyecto de Vida y Metas</option>
                  <option value="LECTOESCRITURA">Lectoescritura y Comprensión Analítica</option>
                  <option value="ORIENTACION_CONVIVENCIA">Orientación y Convivencia</option>
                  <option value="ACTITUDINAL">Rasgos de la Personalidad / Actitudinal</option>
                </>
              )}
            </select>

            {/* Grade Selector */}
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
            >
              {(LEVEL_GRADES_CATALOG[selectedLevel] || []).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            {/* Section Selector: STRICTLY A and B */}
            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['A', 'B'] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                    selectedSection === sec
                      ? 'bg-[#2C2E53] text-[#D4AF37]'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  Sec. {sec}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar alumno..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
              />
            </div>

            <button
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#1B1C33] font-black text-xs rounded-xl shadow-md transition"
            >
              <Save className="w-4 h-4" />
              Guardar Calificaciones
            </button>
          </div>
        </div>

        {savedAlert && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-2 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ¡Los registros transversales fueron actualizados exitosamente en la base de datos!
          </div>
        )}

        {/* Students Table / Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          {targetStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Users className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-bold text-sm text-slate-600 dark:text-slate-300">
                No hay estudiantes registrados en {selectedGrade} Sección {selectedSection}
              </p>
              <p className="text-xs">
                Verifique los filtros o inscriba alumnos en este grado y sección.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {targetStudents.map((stu, index) => {
                const rec = recordsMap[stu.id] || {};

                return (
                  <div
                    key={stu.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs font-black flex items-center justify-center">
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                        <div>
                          <h4 className="text-xs font-black text-[#2C2E53] dark:text-slate-100">
                            {stu.fullName}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            C.I. {stu.cedula} &nbsp;|&nbsp; {stu.grade} - Sección {stu.section}
                          </span>
                        </div>
                      </div>

                      {/* Evaluative Scale Input by Subsystem */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500">
                          Calificación:
                        </span>
                        {selectedLevel === 'MEDIA_GENERAL' ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={1}
                              max={20}
                              value={rec.scoreNumeric ?? 16}
                              onChange={e => handleFieldChange(stu.id, 'scoreNumeric', Number(e.target.value))}
                              className="w-16 p-1 text-center font-mono font-bold text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sky-700"
                            />
                            <span className="text-[10px] font-bold text-slate-400">/20</span>
                          </div>
                        ) : selectedLevel === 'PRIMARIA' ? (
                          <select
                            value={rec.scoreQualitative || 'L'}
                            onChange={e => handleFieldChange(stu.id, 'scoreQualitative', e.target.value)}
                            className="p-1 px-2 font-bold text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-emerald-700"
                          >
                            <option value="L">L (Logrado)</option>
                            <option value="EP">EP (En Proceso)</option>
                            <option value="I">I (Iniciado)</option>
                          </select>
                        ) : (
                          <select
                            value={rec.scoreLiteral || 'A'}
                            onChange={e => handleFieldChange(stu.id, 'scoreLiteral', e.target.value)}
                            className="p-1 px-2 font-bold text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-purple-700"
                          >
                            <option value="A">A (Excelente)</option>
                            <option value="B">B (Bueno)</option>
                            <option value="C">C (Aceptable)</option>
                            <option value="D">D (Requiere Apoyo)</option>
                            <option value="E">E (No Consolidado)</option>
                          </select>
                        )}
                      </div>
                    </div>

                    {/* Form Fields Depending on Type */}
                    {selectedType === 'LECTOESCRITURA' && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            Fluidez Lectora
                          </label>
                          <input
                            type="text"
                            value={rec.fluidezLectora || ''}
                            onChange={e => handleFieldChange(stu.id, 'fluidezLectora', e.target.value)}
                            placeholder="Ej: Lectura corrida y entonada"
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            Nivel de Comprensión
                          </label>
                          <input
                            type="text"
                            value={rec.comprensionLectora || ''}
                            onChange={e => handleFieldChange(stu.id, 'comprensionLectora', e.target.value)}
                            placeholder="Ej: Literal e Inferencial"
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1 flex items-center justify-between">
                            <span>Velocidad (PPM)</span>
                            <span className="text-slate-400 text-[9px]">palabras/min</span>
                          </label>
                          <input
                            type="number"
                            min={20}
                            max={350}
                            value={rec.velocidadPpm || 100}
                            onChange={e => handleFieldChange(stu.id, 'velocidadPpm', Number(e.target.value))}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            Caligrafía y Ortografía
                          </label>
                          <input
                            type="text"
                            value={rec.caligrafiaOrtografia || ''}
                            onChange={e => handleFieldChange(stu.id, 'caligrafiaOrtografia', e.target.value)}
                            placeholder="Ej: Trazos claros y legibles"
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {selectedType === 'PROYECTO_VIDA' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            Proyecto de Vida y Metas Vocacionales
                          </label>
                          <textarea
                            rows={2}
                            value={rec.proyectoVidaMetas || ''}
                            onChange={e => handleFieldChange(stu.id, 'proyectoVidaMetas', e.target.value)}
                            placeholder="Metas a mediano plazo, área vocacional de preferencia, intereses profesionales..."
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            Observación Orientadora / Recomendación Docente
                          </label>
                          <textarea
                            rows={2}
                            value={rec.observacionesGenerales || ''}
                            onChange={e => handleFieldChange(stu.id, 'observacionesGenerales', e.target.value)}
                            placeholder="Recomendaciones para consolidar sus aptitudes..."
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {(selectedType === 'ACTITUDINAL' || selectedType === 'ORIENTACION_CONVIVENCIA') && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            Hábitos de Trabajo y Responsabilidad
                          </label>
                          <input
                            type="text"
                            value={rec.habitosTrabajo || ''}
                            onChange={e => handleFieldChange(stu.id, 'habitosTrabajo', e.target.value)}
                            placeholder="Ej: Entrega puntual y ordenado"
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            Convivencia y Relaciones Interpersonales
                          </label>
                          <input
                            type="text"
                            value={rec.convivenciaSocial || ''}
                            onChange={e => handleFieldChange(stu.id, 'convivenciaSocial', e.target.value)}
                            placeholder="Ej: Respetuoso, dialogante"
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            Autonomía y Actitud Cívica
                          </label>
                          <input
                            type="text"
                            value={rec.autonomiaPersonal || ''}
                            onChange={e => handleFieldChange(stu.id, 'autonomiaPersonal', e.target.value)}
                            placeholder="Ej: Gran autonomía e iniciativa"
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div>
            Total de estudiantes en la sección: <strong>{targetStudents.length}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition"
            >
              Cerrar
            </button>
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-black rounded-xl transition shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
