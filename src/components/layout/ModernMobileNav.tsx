import React from 'react';
import { useApp } from '../../context/AppContext';
import { MainNavigationTab } from '../../types';
import { hasTabAccess, hasSubTabAccess } from '../../utils/rbac';
import {
  Home,
  ClipboardList,
  GraduationCap,
  BarChart3,
  Menu,
  BookOpen,
  CalendarCheck,
  FileSpreadsheet
} from 'lucide-react';

interface ModernMobileNavProps {
  activeTab: MainNavigationTab;
  onNavigate: (tab: MainNavigationTab, subTab?: string) => void;
  onOpenSidebar: () => void;
}

export const ModernMobileNav: React.FC<ModernMobileNavProps> = ({
  activeTab,
  onNavigate,
  onOpenSidebar
}) => {
  const { currentRole, currentLevel } = useApp();

  // Determinamos los ítems clave según el rol del usuario
  const isFamilyOrStudent = currentRole === 'REPRESENTANTE' || currentRole === 'ESTUDIANTE';
  const isAsistente = currentRole === 'ASISTENTE';
  const isSecretaria = currentRole === 'SECRETARIA';

  // Configuración de accesos directos principales adaptados por rol
  const getNavItems = () => {
    if (isFamilyOrStudent) {
      return [
        {
          id: 'ESCRITORIO' as MainNavigationTab,
          label: 'Inicio',
          icon: Home,
          onClick: () => onNavigate('ESCRITORIO', 'DASHBOARD'),
          isActive: activeTab === 'ESCRITORIO'
        },
        {
          id: 'CONSULTAS' as MainNavigationTab,
          label: 'Notas',
          icon: FileSpreadsheet,
          onClick: () => onNavigate('CONSULTAS', 'RENDIMIENTO'),
          isActive: activeTab === 'CONSULTAS'
        },
        {
          id: 'CONSULTAS' as MainNavigationTab,
          label: 'Boletín',
          icon: GraduationCap,
          onClick: () => onNavigate('CONSULTAS', 'BOLETIN'),
          isActive: false
        }
      ];
    }

    if (isAsistente) {
      return [
        {
          id: 'ESCRITORIO' as MainNavigationTab,
          label: 'Inicio',
          icon: Home,
          onClick: () => onNavigate('ESCRITORIO', 'DASHBOARD'),
          isActive: activeTab === 'ESCRITORIO'
        },
        {
          id: 'GESTION' as MainNavigationTab,
          label: 'Pases',
          icon: ClipboardList,
          onClick: () => onNavigate('GESTION', 'PASES'),
          isActive: activeTab === 'GESTION'
        },
        {
          id: 'GESTION' as MainNavigationTab,
          label: 'Asistencia',
          icon: CalendarCheck,
          onClick: () => onNavigate('GESTION', 'INASISTENCIAS'),
          isActive: false
        }
      ];
    }

    if (isSecretaria) {
      return [
        {
          id: 'ESCRITORIO' as MainNavigationTab,
          label: 'Inicio',
          icon: Home,
          onClick: () => onNavigate('ESCRITORIO', 'DASHBOARD'),
          isActive: activeTab === 'ESCRITORIO'
        },
        {
          id: 'GESTION' as MainNavigationTab,
          label: 'Inscripción',
          icon: ClipboardList,
          onClick: () => onNavigate('GESTION', 'INSCRIPCIONES'),
          isActive: activeTab === 'GESTION'
        },
        {
          id: 'GESTION' as MainNavigationTab,
          label: 'Matrícula',
          icon: BarChart3,
          onClick: () => onNavigate('GESTION', 'MATRICULA'),
          isActive: false
        }
      ];
    }

    // Directores, Coordinación, Docentes, Administrador
    return [
      {
        id: 'ESCRITORIO' as MainNavigationTab,
        label: 'Inicio',
        icon: Home,
        onClick: () => onNavigate('ESCRITORIO', 'DASHBOARD'),
        isActive: activeTab === 'ESCRITORIO'
      },
      {
        id: (hasTabAccess(currentRole, currentLevel) ? currentLevel : 'GESTION') as MainNavigationTab,
        label: hasTabAccess(currentRole, currentLevel) ? 'Evaluación' : 'Gestión',
        icon: hasTabAccess(currentRole, currentLevel) ? BookOpen : ClipboardList,
        onClick: () => {
          if (hasTabAccess(currentRole, currentLevel)) {
            onNavigate('EVALUACION' as any, 'PROCESAL');
          } else {
            onNavigate('GESTION', 'MATRICULA');
          }
        },
        isActive: activeTab === currentLevel || activeTab === 'GESTION'
      },
      {
        id: 'CONSULTAS' as MainNavigationTab,
        label: 'Reportes',
        icon: BarChart3,
        onClick: () => onNavigate('CONSULTAS', 'RENDIMIENTO'),
        isActive: activeTab === 'CONSULTAS'
      }
    ];
  };

  const navItems = getNavItems();

  return (
    <nav
      aria-label="Navegación móvil inferior"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#16172B]/95 border-t border-[#2C2E53] backdrop-blur-lg px-2 py-1 safe-area-pb no-print shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto h-16">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={item.onClick}
              className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all duration-150 select-none cursor-pointer ${
                item.isActive
                  ? 'text-[#F5C842] font-black scale-105'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${item.isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                )}
              </div>
              <span className="text-[11px] tracking-tight mt-1 font-semibold leading-none">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Botón de Menú Completo para abrir el Drawer */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 px-1 text-slate-400 hover:text-white active:scale-95 transition-all select-none rounded-xl cursor-pointer"
          title="Abrir menú completo de navegación"
          aria-label="Abrir menú"
        >
          <div className="p-1.5 rounded-lg bg-[#2C2E53]/60 border border-[#414474]/40">
            <Menu className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-[11px] tracking-tight mt-1 font-semibold text-amber-200/90 leading-none">
            Menú
          </span>
        </button>
      </div>
    </nav>
  );
};
