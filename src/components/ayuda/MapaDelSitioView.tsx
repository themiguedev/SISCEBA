import React, { useState } from 'react';
import {
  Compass,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Layers,
  BookOpen,
  ClipboardList,
  MessageSquare,
  Settings,
  Users,
  BarChart3,
  HelpCircle
} from 'lucide-react';

interface SiteMapItem {
  id: string;
  module: string;
  submodule: string;
  roleRequired: 'ADM' | 'UCE' | 'DOC' | 'TODOS';
  description: string;
  targetTab: string;
  targetSubTab?: string;
}

interface MapaDelSitioViewProps {
  onNavigate?: (tab: string, subTab?: string) => void;
}

export const MapaDelSitioView: React.FC<MapaDelSitioViewProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const siteMapItems: SiteMapItem[] = [
    // Escritorio
    {
      id: 'map-1',
      module: 'Escritorio',
      submodule: 'Tablero Principal / Dashboard',
      roleRequired: 'TODOS',
      description: 'Métricas de sesión, auditoría de accesos y widgets institucionales.',
      targetTab: 'ESCRITORIO',
      targetSubTab: 'DASHBOARD'
    },
    {
      id: 'map-2',
      module: 'Escritorio',
      submodule: 'Perfil de Usuario',
      roleRequired: 'TODOS',
      description: 'Gestión de credenciales, preferencias de notificación y datos personales.',
      targetTab: 'ESCRITORIO',
      targetSubTab: 'PERFIL'
    },
    {
      id: 'map-3',
      module: 'Escritorio',
      submodule: 'Ideas y Sugerencias',
      roleRequired: 'TODOS',
      description: 'Canal de retroalimentación directa con el equipo técnico de desarrollo.',
      targetTab: 'ESCRITORIO',
      targetSubTab: 'SUGERENCIAS'
    },

    // Gestión
    {
      id: 'map-4',
      module: 'Gestión',
      submodule: 'Inscripciones (Wizard en 3 Pasos)',
      roleRequired: 'ADM',
      description: 'ADM: Admisión formal de estudiantes vinculando representante, alumno y grado.',
      targetTab: 'GESTION',
      targetSubTab: 'INSCRIPCIONES'
    },
    {
      id: 'map-5',
      module: 'Gestión',
      submodule: 'Pases por Retraso',
      roleRequired: 'ADM',
      description: 'ADM: Registro y emisión de boletas de retraso con ticket imprimible.',
      targetTab: 'GESTION',
      targetSubTab: 'PASES'
    },
    {
      id: 'map-6',
      module: 'Gestión',
      submodule: 'Inasistencias Diarias y Generales',
      roleRequired: 'ADM',
      description: 'ADM / DOC: Control diario de presencia y acumulado por materia (límite 25%).',
      targetTab: 'GESTION',
      targetSubTab: 'INASISTENCIAS'
    },
    {
      id: 'map-7',
      module: 'Gestión',
      submodule: 'Registro de Conductas',
      roleRequired: 'ADM',
      description: 'ADM / DOC: Expediente de faltas, amonestaciones y reconocimientos positivos.',
      targetTab: 'GESTION',
      targetSubTab: 'CONDUCTAS'
    },
    {
      id: 'map-8',
      module: 'Gestión',
      submodule: 'Documentos Solicitados (SLA)',
      roleRequired: 'ADM',
      description: 'ADM: Bandeja de trámites con auditoría de días transcurridos de espera.',
      targetTab: 'GESTION',
      targetSubTab: 'DOCUMENTOS'
    },
    {
      id: 'map-9',
      module: 'Gestión',
      submodule: 'Bloqueo Administrativo',
      roleRequired: 'ADM',
      description: 'ADM: Restricción sincronizada de cuentas de representantes y alumnos por mora.',
      targetTab: 'GESTION',
      targetSubTab: 'BLOQUEO'
    },
    {
      id: 'map-10',
      module: 'Gestión',
      submodule: 'Títulos de Bachiller y Calibración',
      roleRequired: 'ADM',
      description: 'ADM: Asignación de seriales ministeriales, tomo, folio y calibración de impresión.',
      targetTab: 'GESTION',
      targetSubTab: 'TITULOS'
    },
    {
      id: 'map-11',
      module: 'Gestión',
      submodule: 'Matrícula y Prosecución',
      roleRequired: 'ADM',
      description: 'ADM: Reinscripción masiva por sección y auditoría censal de estudiantes.',
      targetTab: 'GESTION',
      targetSubTab: 'MATRICULA'
    },

    // Niveles Pedagógicos
    {
      id: 'map-12',
      module: 'Educación Inicial',
      submodule: 'Banco de Dimensiones e Indicadores',
      roleRequired: 'UCE',
      description: 'UCE / DOC: Áreas de desarrollo socioafectivo, cognitivo y psicomotor.',
      targetTab: 'INICIAL',
      targetSubTab: 'BANCO_COMPETENCIAS'
    },
    {
      id: 'map-13',
      module: 'Educación Inicial',
      submodule: 'Evaluación Diagnóstica (Robótica / TIC)',
      roleRequired: 'DOC',
      description: 'DOC: Matriz diagnóstica con módulo especial de robótica inicial.',
      targetTab: 'INICIAL',
      targetSubTab: 'DIAGNOSTICA'
    },
    {
      id: 'map-14',
      module: 'Educación Primaria',
      submodule: 'Competencias, Indicadores y Literales A-E',
      roleRequired: 'DOC',
      description: 'DOC / UCE: Seguimiento de evaluación continua y emisión de literales finales.',
      targetTab: 'PRIMARIA',
      targetSubTab: 'AREAS_PERFILES'
    },
    {
      id: 'map-15',
      module: 'Media General',
      submodule: 'Estrategias y Calificaciones Numéricas (01-20)',
      roleRequired: 'DOC',
      description: 'DOC: Planificación y carga procesal en escala vigesimal.',
      targetTab: 'MEDIA_GENERAL',
      targetSubTab: 'AREAS_PERFILES'
    },
    {
      id: 'map-16',
      module: 'Media General',
      submodule: 'Consejo de Curso y Actas',
      roleRequired: 'UCE',
      description: 'UCE: Juntas de evaluación de lapso, acuerdos y ajustes de calificaciones.',
      targetTab: 'MEDIA_GENERAL',
      targetSubTab: 'ACTAS_CONSEJO'
    },

    // Institucional
    {
      id: 'map-17',
      module: 'Consultas',
      submodule: 'Rendimiento Estudiantil (Sábana de Notas)',
      roleRequired: 'ADM',
      description: 'ADM / UCE: Consulta centralizada de notas de todos los estudiantes.',
      targetTab: 'CONSULTAS',
      targetSubTab: 'RENDIMIENTO'
    },
    {
      id: 'map-18',
      module: 'Comunidad',
      submodule: 'Noticias, Anuncios y Cumpleañeros',
      roleRequired: 'TODOS',
      description: 'Canal de comunicación institucional y avisos escolares.',
      targetTab: 'COMUNIDAD',
      targetSubTab: 'NOTICIAS'
    },
    {
      id: 'map-19',
      module: 'Configuración',
      submodule: 'Años Escolares y Apertura de Lapsos',
      roleRequired: 'ADM',
      description: 'ADM: Apertura y cierre de ventanas para la regla de carga docente.',
      targetTab: 'CONFIGURACION',
      targetSubTab: 'LAPSOS'
    }
  ];

  const filteredItems = siteMapItems.filter((item) => {
    const matchesRole = roleFilter === 'ALL' || item.roleRequired === roleFilter;
    const matchesSearch =
      item.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.submodule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Directorio Integral del Sistema SICE-CBA
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C2E53] mt-1">Mapa del Sitio y Auditoría de Rutas</h2>
          <p className="text-xs text-slate-500">
            Vista general del contenido del sitio con catálogo de permisos por rol institucional (ADM, UCE, DOC).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
            {siteMapItems.length} Rutas Documentadas
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'ADM', 'UCE', 'DOC', 'TODOS'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                roleFilter === r
                  ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {r === 'ALL' && 'Todos los Roles'}
              {r === 'ADM' && 'Administración (ADM)'}
              {r === 'UCE' && 'Control y Evaluación (UCE)'}
              {r === 'DOC' && 'Docentes (DOC)'}
              {r === 'TODOS' && 'Público General'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar ruta, función o módulo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
          />
        </div>
      </div>

      {/* Grid of Modules */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-cba-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1B1C33] text-white uppercase text-[10px] tracking-wider font-extrabold">
            <tr>
              <th className="py-3.5 px-4 w-12 text-center">Nro</th>
              <th className="py-3.5 px-4">Módulo General</th>
              <th className="py-3.5 px-4">Submódulo / Pantalla</th>
              <th className="py-3.5 px-4 text-center">Rol Requerido</th>
              <th className="py-3.5 px-4">Descripción Funcional</th>
              <th className="py-3.5 px-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {filteredItems.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                <td className="py-3 px-4 font-bold text-[#2C2E53]">{item.module}</td>
                <td className="py-3 px-4 font-extrabold text-slate-900">{item.submodule}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider border ${
                      item.roleRequired === 'ADM'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : item.roleRequired === 'UCE'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : item.roleRequired === 'DOC'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {item.roleRequired}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-500 text-[11px] max-w-md">{item.description}</td>
                <td className="py-3 px-4 text-center">
                  {onNavigate ? (
                    <button
                      onClick={() => onNavigate(item.targetTab, item.targetSubTab)}
                      className="px-3 py-1 bg-slate-100 hover:bg-[#2C2E53] hover:text-[#D4AF37] text-slate-700 font-bold text-[11px] rounded-lg transition flex items-center gap-1 mx-auto"
                    >
                      <span>Ir</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-slate-400 text-[10px]">Activo</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Institutional & Author Credits Card */}
      <div className="bg-gradient-to-r from-[#1B1C33] via-[#242646] to-[#1B1C33] rounded-2xl p-6 border border-[#2C2E53] shadow-lg text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 inline-block mb-2">
            Ficha Técnica del Sistema
          </span>
          <h3 className="text-base font-extrabold text-white">
            Sistema Integral de Control y Evaluación (SICE-CBA)
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            U.E.P. Colegio Bellas Artes • Maracaibo, Estado Zulia • Año Escolar 2026 - 2027
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-3.5 border border-white/10 text-right sm:text-right shrink-0">
          <span className="text-[10px] text-slate-300 block font-semibold">
            Autor & Ingeniero de Software:
          </span>
          <p className="text-sm font-black text-[#D4AF37] mt-0.5">
            Ing. en Informática Miguelangel Contreras Guillén
          </p>
          <span className="text-[10px] text-slate-400">
            Desarrollador Oficial • Versión v1.0.0-DEV
          </span>
        </div>
      </div>
    </div>
  );
};
