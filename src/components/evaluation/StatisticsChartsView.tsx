import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Award,
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const StatisticsChartsView: React.FC = () => {
  const { currentLevel, activeLapso, levelAreas, levelStudents } = useApp();

  // Color Constants matching Bellas Artes
  const NAVY = '#2C2E53';
  const GOLD = '#D4AF37';
  const EMERALD = '#10B981';
  const RED = '#EF4444';
  const AMBER = '#F59E0B';

  // Area Performance Mock Data based on currentLevel
  const areaPerformanceData = levelAreas.slice(0, 7).map(area => {
    const approvalRate =
      area.name.includes('Robótica') || area.name.includes('Arte') || area.name.includes('Inglés')
        ? 96
        : area.name.includes('Matemáticas') || area.name.includes('Física')
        ? 82
        : 90;

    const averageGrade =
      currentLevel === 'MEDIA_GENERAL'
        ? area.name.includes('Matemáticas') ? 14.2 : 16.8
        : undefined;

    return {
      name: area.name.length > 14 ? `${area.name.slice(0, 12)}...` : area.name,
      tasaAprobacion: approvalRate,
      promedio: averageGrade
    };
  });

  // Distribution Data per subsystem
  const distributionData =
    currentLevel === 'MEDIA_GENERAL'
      ? [
          { name: 'Excelente (18-20)', value: 35, color: GOLD },
          { name: 'Notable (15-17)', value: 40, color: NAVY },
          { name: 'Aprobado (10-14)', value: 18, color: EMERALD },
          { name: 'En Riesgo (01-09)', value: 7, color: RED }
        ]
      : currentLevel === 'INICIAL'
      ? [
          { name: 'Literal A (Excelente)', value: 45, color: EMERALD },
          { name: 'Literal B (Bueno)', value: 35, color: GOLD },
          { name: 'Literal C (Aceptable)', value: 12, color: NAVY },
          { name: 'Literal D/E (Acompañamiento)', value: 8, color: RED }
        ]
      : [
          { name: 'Logrado (L)', value: 75, color: EMERALD },
          { name: 'En Proceso (P / EP)', value: 20, color: GOLD },
          { name: 'Iniciado (I)', value: 5, color: RED }
        ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-xs font-bold text-[#2C2E53] uppercase tracking-wider">
              Analítica Pedagógica Automatizada
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2C2E53] mt-1">
            Cuadros Estadísticos Consolidados ({currentLevel.replace('_', ' ')})
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Visualización estadística del rendimiento, distribución de logros por área y detección de alertas tempranas.
          </p>
        </div>

        {/* Global Metric Badge */}
        <div className="flex items-center gap-3 bg-[#2C2E53] text-white p-3.5 rounded-2xl shadow-md border border-[#414474]">
          <div className="text-center px-3 border-r border-[#414474]">
            <span className="text-xl font-black text-[#D4AF37]">93.2%</span>
            <span className="text-[10px] font-bold text-slate-300 block uppercase">Aprobación Global</span>
          </div>
          <div className="text-center px-3">
            <span className="text-xl font-black text-white">{levelStudents.length}</span>
            <span className="text-[10px] font-bold text-slate-300 block uppercase">Estudiantes</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Rendimiento Alto</span>
            <span className="text-2xl font-black text-[#2C2E53]">75%</span>
            <span className="text-[11px] text-emerald-600 font-bold">Sin alertas de riesgo</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Promedio General</span>
            <span className="text-2xl font-black text-[#D4AF37]">
              {currentLevel === 'MEDIA_GENERAL' ? '16.4 / 20' : 'Nivel Alto (A/B)'}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">+0.8 vs período anterior</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Casos a Revisión</span>
            <span className="text-2xl font-black text-red-600">
              {levelStudents.filter(s => s.status === 'EN_REVISION').length}
            </span>
            <span className="text-[11px] text-red-500 font-bold">Requieren Plan Remedial</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2C2E53] flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Área Destacada</span>
            <span className="text-base font-black text-[#2C2E53] truncate block">Robótica & Artes</span>
            <span className="text-[11px] text-emerald-600 font-bold">98% Satisfacción</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Aprobación por Área */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-cba-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-[#2C2E53]">
                Tasa de Logro / Aprobación por Área (%)
              </h3>
              <p className="text-xs text-slate-400">Desempeño consolidado en Lapso {activeLapso}</p>
            </div>
            <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-20} textAnchor="end" />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Tasa de Logro']}
                  contentStyle={{ backgroundColor: '#2C2E53', color: '#fff', borderRadius: '12px', border: 'none' }}
                />
                <Bar dataKey="tasaAprobacion" fill={NAVY} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Distribución de Calificaciones */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-cba-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-[#2C2E53]">
                Distribución Proporcional de Calificaciones
              </h3>
              <p className="text-xs text-slate-400">Proporción de estudiantes según escala de desempeño</p>
            </div>
            <Users className="w-5 h-5 text-[#D4AF37]" />
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Estudiantes']}
                  contentStyle={{ backgroundColor: '#2C2E53', color: '#fff', borderRadius: '12px', border: 'none' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
