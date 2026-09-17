import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectArea } from '../../types';
import {
  BookOpen,
  UserCheck,
  Clock,
  Search,
  Filter,
  Layers,
  Sparkles,
  Info,
  Palette,
  Calculator,
  Compass,
  Landmark,
  Activity,
  Award,
  Waves,
  Languages,
  Flag,
  Monitor,
  Cpu,
  DollarSign,
  Heart,
  Globe,
  Smile,
  Zap,
  FlaskConical,
  Dna,
  MapPin,
  Shield,
  Users,
  Image,
  Code,
  TrendingUp,
  Navigation,
  Building,
  Feather,
  CheckCircle
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Palette,
  Calculator,
  Compass,
  Landmark,
  Activity,
  Award,
  Waves,
  Languages,
  Flag,
  Monitor,
  Cpu,
  DollarSign,
  Heart,
  Globe,
  Smile,
  Zap,
  FlaskConical,
  Dna,
  MapPin,
  Shield,
  Users,
  Image,
  Code,
  TrendingUp,
  Navigation,
  Building,
  Feather,
  CheckCircle,
  Sparkles
};

export const AreasProfilesView: React.FC = () => {
  const { levelAreas, currentLevel, competencies, indicators } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'REGULAR' | 'INTEGRADA' | 'ESPECIALIZADA'>('ALL');
  const [selectedArea, setSelectedArea] = useState<SubjectArea | null>(levelAreas[0] || null);

  const filteredAreas = levelAreas.filter(area => {
    const matchesSearch =
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || area.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] uppercase tracking-wider">
              Estructura Curricular Institucional
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] mt-1">
            Áreas de Formación y Perfiles Docentes ({currentLevel.replace('_', ' ')})
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Gestión de perfiles de área, perfiles docentes requeridos y carga horaria semanal oficial según la normativa pedagógica del Colegio Bellas Artes.
          </p>
        </div>

        {/* Stats summary badge */}
        <div className="flex items-center gap-3 bg-[#2C2E53]/5 p-3 rounded-xl border border-[#2C2E53]/10">
          <div className="text-center px-2">
            <span className="block text-2xl font-black text-[#2C2E53]">{levelAreas.length}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Áreas Totales</span>
          </div>
          <div className="h-8 w-px bg-slate-300"></div>
          <div className="text-center px-2">
            <span className="block text-2xl font-black text-[#D4AF37]">
              {levelAreas.filter(a => a.type !== 'REGULAR').length}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Especializadas</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar área de formación..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C2E53] focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 mr-1 hidden sm:inline" />
          {(['ALL', 'REGULAR', 'INTEGRADA', 'ESPECIALIZADA'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterType === type
                  ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {type === 'ALL'
                ? 'Todas'
                : type === 'REGULAR'
                ? 'Regulares'
                : type === 'INTEGRADA'
                ? 'Integradas'
                : 'Especializadas Bellas Artes'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Areas + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Areas */}
        <div className="lg:col-span-2 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredAreas.map((area) => {
              const IconComponent = iconMap[area.iconName] || BookOpen;
              const isSelected = selectedArea?.id === area.id;
              const areaComps = competencies.filter(c => c.areaId === area.id);
              const areaInds = indicators.filter(i => i.areaId === area.id);

              return (
                <div
                  key={area.id}
                  onClick={() => setSelectedArea(area)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#2C2E53] shadow-cba-card ring-2 ring-[#2C2E53]/20'
                      : 'bg-white border-slate-200 hover:border-[#D4AF37]/60 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                          isSelected
                            ? 'bg-[#2C2E53] text-[#D4AF37]'
                            : 'bg-slate-100 text-[#2C2E53]'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {area.code}
                        </span>
                        <h3 className="font-bold text-slate-800 text-sm mt-0.5 leading-snug">
                          {area.name}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        area.type === 'ESPECIALIZADA'
                          ? 'bg-[#D4AF37]/15 text-[#94721C] border-[#D4AF37]/40'
                          : area.type === 'INTEGRADA'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {area.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                    {area.areaProfile}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {area.weeklyHours}h semanales
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#2C2E53]">
                      <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {areaComps.length} comp. • {areaInds.length} ind.
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Profiles for Selected Area */}
        <div className="lg:col-span-1">
          {selectedArea ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card sticky top-28 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-black uppercase text-[#D4AF37] tracking-wider">
                    {selectedArea.type}
                  </span>
                  <h3 className="text-lg font-black text-[#2C2E53] leading-tight">
                    {selectedArea.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">Código: {selectedArea.code}</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#2C2E53] text-[#D4AF37] flex items-center justify-center font-bold shadow-md">
                  {React.createElement(iconMap[selectedArea.iconName] || BookOpen, { className: 'w-6 h-6' })}
                </div>
              </div>

              {/* Area Profile Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2C2E53] uppercase tracking-wide">
                  <Info className="w-4 h-4 text-[#D4AF37]" />
                  Perfil del Área de Formación
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedArea.areaProfile}
                </p>
              </div>

              {/* Teacher Profile Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2C2E53] uppercase tracking-wide">
                  <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                  Perfil Docente Requerido
                </div>
                <p className="text-xs text-slate-600 bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/40 leading-relaxed">
                  {selectedArea.teacherProfile}
                </p>
              </div>

              {/* Curricular Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-xs text-slate-500 font-medium block">Carga Semanal</span>
                  <span className="text-xl font-black text-[#2C2E53]">{selectedArea.weeklyHours} hrs</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-xs text-slate-500 font-medium block">Nivel Escolar</span>
                  <span className="text-xs font-black text-[#D4AF37] block mt-1">
                    {selectedArea.level}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center text-slate-400">
              Selecciona un área para ver su perfil completo
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
