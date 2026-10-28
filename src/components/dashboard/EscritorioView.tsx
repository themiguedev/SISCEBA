import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import {
  Monitor,
  User,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  Send,
  Lock,
  Mail,
  CheckCircle2,
  TrendingUp,
  Cake,
  Lightbulb,
  FileText,
  ExternalLink,
  Layers,
  HelpCircle,
  Camera,
  Upload,
  Trash2,
  Check,
  Image as ImageIcon,
  Phone,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Plus,
  Edit2,
  Download,
  Printer,
  MapPin,
  CalendarCheck,
  ChevronRight,
  Filter,
  Users,
  Info,
  School
} from 'lucide-react';
import { EducationalLevel, UserSchedule, ScheduleBlock, ScheduleDay, AcademicAssignment, LEVEL_GRADES_CATALOG, Student } from '../../types';
import { OFFICIAL_AVATARS, getDefaultAvatarForUser } from '../../utils/avatarCatalog';
import { PasswordStrengthBar } from '../common/PasswordStrengthBar';
import { ROLE_METADATA } from '../../utils/rbac';

export type EscritorioTab = 'DASHBOARD' | 'PERFIL' | 'HORARIO' | 'SUGERENCIAS';

interface EscritorioViewProps {
  activeSubTab?: EscritorioTab;
  setActiveSubTab?: (tab: EscritorioTab) => void;
}

/**
 * Genera una grilla institucional de horario semanal pedagógico oficial
 * como respaldo cuando aún no se han cargado bloques de docentes específicos.
 */
const generateInstitutionalCurriculumSchedule = (child: Student): (ScheduleBlock & { teacherName?: string })[] => {
  const days: ScheduleDay[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
  const gradeSecStr = `${child.grade} Sección ${child.section}`;
  const blocks: (ScheduleBlock & { teacherName?: string })[] = [];

  if (child.level === 'MEDIA_GENERAL') {
    const isJunior = child.grade.includes('1') || child.grade.includes('2');
    const isSenior = child.grade.includes('4') || child.grade.includes('5');

    const periods = [
      { p: 1, s: '07:00', e: '07:45' },
      { p: 2, s: '07:45', e: '08:30' },
      { p: 3, s: '08:45', e: '09:30' },
      { p: 4, s: '09:30', e: '10:15' },
      { p: 5, s: '10:45', e: '11:30' },
      { p: 6, s: '11:30', e: '12:15' },
      { p: 7, s: '12:15', e: '13:00' },
      { p: 8, s: '13:00', e: '13:30' }
    ];

    const weeklyMap: Record<ScheduleDay, { name: string; color: string; room: string; teacher?: string }[]> = {
      LUNES: [
        { name: 'Matemáticas', color: 'indigo', room: 'Aula 14', teacher: 'Prof. Pedro Valera' },
        { name: 'Matemáticas', color: 'indigo', room: 'Aula 14', teacher: 'Prof. Pedro Valera' },
        { name: 'Castellano y Literatura', color: 'rose', room: 'Aula 14', teacher: 'Lic. Carmen Silva' },
        { name: 'Castellano y Literatura', color: 'rose', room: 'Aula 14', teacher: 'Lic. Carmen Silva' },
        { name: 'Educación Física', color: 'teal', room: 'Cancha Techada', teacher: 'Prof. Roberto Gómez' },
        { name: 'Educación Física', color: 'teal', room: 'Cancha Techada', teacher: 'Prof. Roberto Gómez' },
        { name: 'Orientación y Convivencia', color: 'amber', room: 'Aula 14', teacher: 'Lic. Elena Ramos' },
        { name: 'Estudio Dirigido', color: 'slate', room: 'Aula 14', teacher: 'Prof. Asesor de Sección' }
      ],
      MARTES: [
        { name: isJunior ? 'Ciencias Naturales' : 'Física', color: 'blue', room: isJunior ? 'Aula 14' : 'Lab. de Ciencias', teacher: 'Prof. Luis Zambrano' },
        { name: isJunior ? 'Ciencias Naturales' : 'Física', color: 'blue', room: isJunior ? 'Aula 14' : 'Lab. de Ciencias', teacher: 'Prof. Luis Zambrano' },
        { name: 'Inglés', color: 'violet', room: 'Aula 14', teacher: 'Prof. Andrea Márquez' },
        { name: 'Inglés', color: 'violet', room: 'Aula 14', teacher: 'Prof. Andrea Márquez' },
        { name: isJunior ? 'Arte y Patrimonio' : 'Biología', color: 'emerald', room: isJunior ? 'Aula de Arte' : 'Lab. de Biología', teacher: 'Lic. Daniel Peña' },
        { name: isJunior ? 'Arte y Patrimonio' : 'Biología', color: 'emerald', room: isJunior ? 'Aula de Arte' : 'Lab. de Biología', teacher: 'Lic. Daniel Peña' },
        { name: 'Geografía, Historia y Ciudadanía', color: 'amber', room: 'Aula 14', teacher: 'Prof. Rafael Colmenares' },
        { name: 'Geografía, Historia y Ciudadanía', color: 'amber', room: 'Aula 14', teacher: 'Prof. Rafael Colmenares' }
      ],
      MIERCOLES: [
        { name: isJunior ? 'Matemáticas' : 'Química', color: isJunior ? 'indigo' : 'emerald', room: isJunior ? 'Aula 14' : 'Lab. de Química', teacher: 'Prof. Víctor Mendoza' },
        { name: isJunior ? 'Matemáticas' : 'Química', color: isJunior ? 'indigo' : 'emerald', room: isJunior ? 'Aula 14' : 'Lab. de Química', teacher: 'Prof. Víctor Mendoza' },
        { name: 'Matemáticas', color: 'indigo', room: 'Aula 14', teacher: 'Prof. Pedro Valera' },
        { name: 'Castellano y Literatura', color: 'rose', room: 'Aula 14', teacher: 'Lic. Carmen Silva' },
        { name: isSenior ? 'Formación para la Soberanía Nal.' : 'Arte y Patrimonio', color: isSenior ? 'slate' : 'violet', room: 'Aula 14', teacher: 'Cap. Andrés Torrealba' },
        { name: isSenior ? 'Formación para la Soberanía Nal.' : 'Arte y Patrimonio', color: isSenior ? 'slate' : 'violet', room: 'Aula 14', teacher: 'Cap. Andrés Torrealba' },
        { name: 'Grupos CRP / Robótica', color: 'teal', room: 'Lab. STEAM', teacher: 'Prof. Carlos Mendoza' },
        { name: 'Grupos CRP / Robótica', color: 'teal', room: 'Lab. STEAM', teacher: 'Prof. Carlos Mendoza' }
      ],
      JUEVES: [
        { name: 'Geografía, Historia y Ciudadanía', color: 'amber', room: 'Aula 14', teacher: 'Prof. Rafael Colmenares' },
        { name: isJunior ? 'Ciencias Naturales' : 'Física', color: 'blue', room: 'Aula 14', teacher: 'Prof. Luis Zambrano' },
        { name: 'Inglés', color: 'violet', room: 'Aula 14', teacher: 'Prof. Andrea Márquez' },
        { name: 'Matemáticas', color: 'indigo', room: 'Aula 14', teacher: 'Prof. Pedro Valera' },
        { name: isJunior ? 'Educación Física' : 'Química', color: isJunior ? 'teal' : 'emerald', room: isJunior ? 'Cancha' : 'Lab. de Química', teacher: 'Prof. Víctor Mendoza' },
        { name: isJunior ? 'Educación Física' : 'Química', color: isJunior ? 'teal' : 'emerald', room: isJunior ? 'Cancha' : 'Lab. de Química', teacher: 'Prof. Víctor Mendoza' },
        { name: 'Proyecto de Investigación', color: 'blue', room: 'Aula 14', teacher: 'Lic. Elena Ramos' },
        { name: 'Atención Pedagógica UCE', color: 'slate', room: 'Aula 14', teacher: 'Coordinación Media General' }
      ],
      VIERNES: [
        { name: isJunior ? 'Castellano' : 'Biología', color: isJunior ? 'rose' : 'emerald', room: 'Aula 14', teacher: 'Lic. Daniel Peña' },
        { name: 'Matemáticas', color: 'indigo', room: 'Aula 14', teacher: 'Prof. Pedro Valera' },
        { name: 'Castellano y Literatura', color: 'rose', room: 'Aula 14', teacher: 'Lic. Carmen Silva' },
        { name: 'Proyecto Socio-Comunitario', color: 'blue', room: 'Aula 14', teacher: 'Prof. Asesor CBA' },
        { name: 'Encuentro Cultural y Deportivo', color: 'teal', room: 'Patio Central', teacher: 'Comité Deportivo CBA' },
        { name: 'Encuentro Cultural y Deportivo', color: 'teal', room: 'Patio Central', teacher: 'Comité Deportivo CBA' },
        { name: 'Cierre y Convivencia Escolar', color: 'amber', room: 'Aula 14', teacher: 'Docente Guía de Sección' },
        { name: 'Tutoría Pedagógica', color: 'slate', room: 'Aula 14', teacher: 'Docente Titular' }
      ]
    };

    days.forEach(day => {
      const daySlots = weeklyMap[day] || [];
      daySlots.forEach((slot, idx) => {
        const time = periods[idx];
        if (!time) return;
        blocks.push({
          id: `child-mg-${day}-${time.p}`,
          day,
          periodIndex: time.p,
          startTime: time.s,
          endTime: time.e,
          subjectName: slot.name,
          level: 'MEDIA_GENERAL',
          gradeSection: gradeSecStr,
          classroom: slot.room,
          color: slot.color,
          teacherName: slot.teacher
        });
      });
    });
  } else if (child.level === 'PRIMARIA') {
    const periods = [
      { p: 1, s: '07:00', e: '07:45' },
      { p: 2, s: '07:45', e: '08:30' },
      { p: 3, s: '08:45', e: '09:30' },
      { p: 4, s: '10:00', e: '10:45' },
      { p: 5, s: '10:45', e: '11:30' },
      { p: 6, s: '11:30', e: '12:15' }
    ];

    const weeklyMap: Record<ScheduleDay, { name: string; color: string; room: string; teacher?: string }[]> = {
      LUNES: [
        { name: 'Lengua y Comunicación', color: 'rose', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Lengua y Comunicación', color: 'rose', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Matemáticas para la Vida', color: 'indigo', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Ciencias de la Naturaleza', color: 'emerald', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Ciencias Sociales e Identidad', color: 'amber', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Lectura Guiada y Valores', color: 'blue', room: 'Biblioteca CBA', teacher: 'Docente de Grado' }
      ],
      MARTES: [
        { name: 'Matemáticas para la Vida', color: 'indigo', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Matemáticas para la Vida', color: 'indigo', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Lengua y Comunicación', color: 'rose', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Educación Física y Deporte', color: 'teal', room: 'Cancha Escolar', teacher: 'Prof. de Educación Física' },
        { name: 'Educación Estética: Artes Plásticas', color: 'violet', room: 'Taller de Arte', teacher: 'Especialista en Arte' },
        { name: 'Educación Estética: Música', color: 'amber', room: 'Salón de Música', teacher: 'Prof. de Música' }
      ],
      MIERCOLES: [
        { name: 'Ciencias de la Naturaleza y Tecnología', color: 'emerald', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Ciencias de la Naturaleza y Tecnología', color: 'emerald', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Matemáticas para la Vida', color: 'indigo', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Lengua y Comunicación', color: 'rose', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Inglés Inicial Lúdico', color: 'violet', room: `Salón ${child.grade}`, teacher: 'Prof. de Idiomas' },
        { name: 'Ajedrez Escolar y Lógica', color: 'indigo', room: 'Aula de Ajedrez', teacher: 'Instructor de Ajedrez' }
      ],
      JUEVES: [
        { name: 'Lengua y Comunicación', color: 'rose', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Lengua y Comunicación', color: 'rose', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Ciencias Sociales y Geografía', color: 'amber', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Educación Física y Deporte', color: 'teal', room: 'Cancha Escolar', teacher: 'Prof. de Educación Física' },
        { name: 'Matemáticas para la Vida', color: 'indigo', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Informática Educativa', color: 'blue', room: 'Aula de Computación', teacher: 'Especialista en Sistemas' }
      ],
      VIERNES: [
        { name: 'Proyecto de Aprendizaje Integrado', color: 'blue', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Proyecto de Aprendizaje Integrado', color: 'blue', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Matemáticas Recreativas', color: 'indigo', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Tradiciones Culturales y Folklore', color: 'violet', room: 'Patio Central', teacher: 'Comité Cultural' },
        { name: 'Cierre Pedagógico Semanal', color: 'rose', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' },
        { name: 'Convivencia y Habilidades para la Vida', color: 'teal', room: `Salón ${child.grade}`, teacher: 'Docente de Grado' }
      ]
    };

    days.forEach(day => {
      const daySlots = weeklyMap[day] || [];
      daySlots.forEach((slot, idx) => {
        const time = periods[idx];
        if (!time) return;
        blocks.push({
          id: `child-pri-${day}-${time.p}`,
          day,
          periodIndex: time.p,
          startTime: time.s,
          endTime: time.e,
          subjectName: slot.name,
          level: 'PRIMARIA',
          gradeSection: gradeSecStr,
          classroom: slot.room,
          color: slot.color,
          teacherName: slot.teacher
        });
      });
    });
  } else {
    // INICIAL
    const periods = [
      { p: 1, s: '07:00', e: '07:45' },
      { p: 2, s: '07:45', e: '08:30' },
      { p: 3, s: '08:45', e: '09:30' },
      { p: 4, s: '10:00', e: '10:45' },
      { p: 5, s: '10:45', e: '11:30' },
      { p: 6, s: '11:30', e: '12:15' }
    ];

    const weeklyMap: Record<ScheduleDay, { name: string; color: string; room: string; teacher?: string }[]> = {
      LUNES: [
        { name: 'Bienvenida, Cantos y Ronda Matutina', color: 'blue', room: 'Salón Infantil', teacher: 'Maestra Titular' },
        { name: 'Formación Personal, Social y Valores', color: 'rose', room: 'Salón Infantil', teacher: 'Maestra Titular' },
        { name: 'Relación con los Componentes del Ambiente', color: 'emerald', room: 'Rincón de Ciencias', teacher: 'Maestra Titular' },
        { name: 'Expresión Plástica y Dibujo Libre', color: 'violet', room: 'Mesa de Trabajo', teacher: 'Maestra Titular' },
        { name: 'Psicomotricidad y Juegos en Ronda', color: 'teal', room: 'Patio Infantil', teacher: 'Prof. de Educación Física' },
        { name: 'Cierre Afectivo y Despedida', color: 'amber', room: 'Salón Infantil', teacher: 'Maestra Titular' }
      ],
      MARTES: [
        { name: 'Bienvenida y Hábitos de Convivencia', color: 'blue', room: 'Salón Infantil', teacher: 'Maestra Titular' },
        { name: 'Nociones Lógicas y Figuras Geométricas', color: 'indigo', room: 'Salón Infantil', teacher: 'Maestra Titular' },
        { name: 'Cuidado de las Plantas y Medio Ambiente', color: 'emerald', room: 'Huerto Escolar', teacher: 'Maestra Titular' },
        { name: 'Modelado con Plastilina y Motricidad', color: 'rose', room: 'Mesa de Trabajo', teacher: 'Maestra Titular' },
        { name: 'Educación Física y Coordinación', color: 'teal', room: 'Patio Infantil', teacher: 'Prof. de Educación Física' },
        { name: 'Hora del Cuento y Cierre', color: 'amber', room: 'Rincón de Lectura', teacher: 'Maestra Titular' }
      ],
      MIERCOLES: [
        { name: 'Bienvenida y Cantos Tradicionales', color: 'blue', room: 'Salón Infantil', teacher: 'Maestra Titular' },
        { name: 'Lenguaje Oral, Rimas y Trabalenguas', color: 'rose', room: 'Salón Infantil', teacher: 'Maestra Titular' },
        { name: 'Pequeños Científicos y Texturas', color: 'emerald', room: 'Rincón de Ciencias', teacher: 'Maestra Titular' },
        { name: 'Expresión Musical y Ritmo Infantil', color: 'violet', room: 'Salón de Música', teacher: 'Prof. de Música' },
        { name: 'Ajedrez Infantil Lúdico', color: 'indigo', room: 'Salón Infantil', teacher: 'Instructor de Ajedrez' },
        { name: 'Cierre del Día y Despedida', color: 'amber', room: 'Salón Infantil', teacher: 'Maestra Titular' }
      ],
      JUEVES: [
        { name: 'Bienvenida y Asignación de Roles', color: 'blue', room: 'Salón Infantil', teacher: 'Maestra Titular' },
        { name: 'Identidad Familiar y Ciudadana', color: 'rose', room: 'Salón Infantil', teacher: 'Maestra Titular' },
        { name: 'Mi Cuerpo y Vida Saludable', color: 'emerald', room: 'Salón Infantil', teacher: 'Maestra Titular' },
        { name: 'Pintura Dactilar y Collage Creativo', color: 'violet', room: 'Mesa de Trabajo', teacher: 'Maestra Titular' },
        { name: 'Circuitos Psicomotores y Equilibrio', color: 'teal', room: 'Patio Infantil', teacher: 'Prof. de Educación Física' },
        { name: 'Ronda de Canciones y Despedida', color: 'amber', room: 'Salón Infantil', teacher: 'Maestra Titular' }
      ],
      VIERNES: [
        { name: 'Bienvenida y Saludo a la Bandera', color: 'blue', room: 'Patio Central', teacher: 'Maestra Titular' },
        { name: 'Títeres, Teatro y Expresión Gestual', color: 'rose', room: 'Rincón de Expresión', teacher: 'Maestra Titular' },
        { name: 'Juegos Sensoriales y Acuáticos', color: 'emerald', room: 'Área de Juegos', teacher: 'Maestra Titular' },
        { name: 'Manualidades y Expresión Libre', color: 'violet', room: 'Mesa de Trabajo', teacher: 'Maestra Titular' },
        { name: 'Recreación Compartida Guiada', color: 'teal', room: 'Patio Infantil', teacher: 'Comité de Inicial' },
        { name: 'Compartir Semanal y Cierre Afectivo', color: 'amber', room: 'Salón Infantil', teacher: 'Maestra Titular' }
      ]
    };

    days.forEach(day => {
      const daySlots = weeklyMap[day] || [];
      daySlots.forEach((slot, idx) => {
        const time = periods[idx];
        if (!time) return;
        blocks.push({
          id: `child-ini-${day}-${time.p}`,
          day,
          periodIndex: time.p,
          startTime: time.s,
          endTime: time.e,
          subjectName: slot.name,
          level: 'INICIAL',
          gradeSection: gradeSecStr,
          classroom: slot.room,
          color: slot.color,
          teacherName: slot.teacher
        });
      });
    });
  }

  return blocks;
};

export const EscritorioView: React.FC<EscritorioViewProps> = ({
  activeSubTab,
  setActiveSubTab
}) => {
  const {
    currentRole,
    birthdays,
    currentUser,
    users,
    updateUser,
    userSchedules,
    currentUserSchedule,
    saveUserSchedule,
    isSupabaseActive,
    isSavingCloud,
    students,
    scheduleTypes,
    areas,
    schoolData
  } = useApp();
  const [internalActiveTab, setInternalActiveTab] = useState<EscritorioTab>('DASHBOARD');

  // Estados para el Horario Institucional y de Representados
  const [scheduleDayFilter, setScheduleDayFilter] = useState<'TODOS' | ScheduleDay>('TODOS');
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [scheduleSavedToast, setScheduleSavedToast] = useState(false);

  // Detección de estudiantes representados para el rol de REPRESENTANTE
  const representedStudents = useMemo(() => {
    if (currentRole !== 'REPRESENTANTE') return [];

    const repName = currentUser?.fullName?.toLowerCase().trim() || '';
    const repEmail = currentUser?.email?.toLowerCase().trim() || '';
    const repCedula = currentUser?.cedula?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
    const repUsername = currentUser?.username?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';

    const matched = (students || []).filter((s) => {
      const sRepName = s.representativeName?.toLowerCase().trim() || '';
      const sRepEmail = s.representativeEmail?.toLowerCase().trim() || '';
      const sMotherCedula = s.motherInfo?.cedula?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
      const sFatherCedula = s.fatherInfo?.cedula?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
      const sMotherEmail = s.motherInfo?.correo?.toLowerCase().trim() || '';
      const sFatherEmail = s.fatherInfo?.correo?.toLowerCase().trim() || '';

      return (
        (repCedula && (sMotherCedula === repCedula || sFatherCedula === repCedula)) ||
        (repUsername && (sMotherCedula === repUsername || sFatherCedula === repUsername)) ||
        (repEmail && (sRepEmail === repEmail || sMotherEmail === repEmail || sFatherEmail === repEmail)) ||
        (repName && (sRepName.includes(repName) || repName.includes(sRepName)))
      );
    });

    if (matched.length > 0) return matched;

    // Si es el Administrador simulando el rol de Representante
    if (currentUser?.role === 'ADMINISTRADOR' && students && students.length > 0) {
      return students.slice(0, 3);
    }

    return [];
  }, [currentRole, currentUser, students]);

  // Detección de estudiante si el rol activo es ESTUDIANTE
  const currentStudent = useMemo(() => {
    if (currentRole !== 'ESTUDIANTE') return null;

    const normCedula = currentUser?.cedula?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
    const normUsername = currentUser?.username?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
    const userEmail = currentUser?.email?.toLowerCase().trim() || '';
    const userFullName = currentUser?.fullName?.toLowerCase().trim() || '';

    const matched = (students || []).filter((s) => {
      const studentCedula = s.cedula?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
      const studentEmail = s.representativeEmail?.toLowerCase().trim() || '';
      const studentName = s.fullName?.toLowerCase().trim() || '';

      return (
        (normCedula && studentCedula === normCedula) ||
        (normUsername && studentCedula === normUsername) ||
        (normUsername && normUsername === s.id.toLowerCase()) ||
        (userEmail && studentEmail === userEmail) ||
        (userFullName && studentName === userFullName)
      );
    });

    if (matched.length > 0) return matched[0];
    if (currentUser?.role === 'ADMINISTRADOR' && students && students.length > 0) {
      return students[0];
    }
    return null;
  }, [currentRole, currentUser, students]);

  // Función para obtener bloques de horario de un estudiante (directos, de docentes o curriculares)
  const getChildScheduleBlocks = (child: Student): (ScheduleBlock & { teacherName?: string })[] => {
    const cleanStr = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanGrade = cleanStr(child.grade || '');
    const cleanSec = cleanStr(child.section || '');
    const targetGS = cleanStr(`${child.grade} ${child.section}`);

    const collected: (ScheduleBlock & { teacherName?: string })[] = [];

    // 1. Bloques directos guardados para el estudiante por su ID o Cédula
    const directSched = (userSchedules || []).find(
      s => s.userId === child.id || (child.cedula && s.userId === child.cedula)
    );
    if (directSched && Array.isArray(directSched.blocks) && directSched.blocks.length > 0) {
      directSched.blocks.forEach(b => collected.push({ ...b }));
    }

    // 2. Bloques registrados por los docentes que coincidan con el Grado y Sección del alumno
    (userSchedules || []).forEach(sched => {
      if (sched.userId === child.id || sched.userId === child.cedula) return;
      const teacherUser = (users || []).find(u => u.id === sched.userId);
      (sched.blocks || []).forEach(b => {
        if (!b.gradeSection) return;
        const bGS = cleanStr(b.gradeSection);
        const matchesGrade = cleanGrade ? bGS.includes(cleanGrade) : false;
        const matchesSection = cleanSec ? bGS.includes(cleanSec) : true;
        const matchesLevel = !b.level || b.level === child.level;

        if ((bGS.includes(targetGS) || (matchesGrade && matchesSection)) && matchesLevel) {
          const exists = collected.some(
            c => c.day === b.day && (c.periodIndex === b.periodIndex || c.startTime === b.startTime)
          );
          if (!exists) {
            collected.push({
              ...b,
              teacherName: teacherUser ? teacherUser.fullName : undefined
            });
          }
        }
      });
    });

    if (collected.length > 0) {
      return collected;
    }

    // 3. Respaldo oficial según pensum curricular del colegio
    return generateInstitutionalCurriculumSchedule(child);
  };

  // Formulario de nuevo bloque de clase / labor
  const [blockDay, setBlockDay] = useState<ScheduleDay>('LUNES');
  const [blockStartTime, setBlockStartTime] = useState('07:00');
  const [blockEndTime, setBlockEndTime] = useState('07:45');
  const [blockPeriod, setBlockPeriod] = useState(1);
  const [blockSubject, setBlockSubject] = useState('');
  const [blockGradeSection, setBlockGradeSection] = useState('4to Año A');
  const [blockLevel, setBlockLevel] = useState<EducationalLevel>('MEDIA_GENERAL');
  const [blockClassroom, setBlockClassroom] = useState('Aula 1');
  const [blockColor, setBlockColor] = useState('blue');

  const activeTab = activeSubTab || internalActiveTab;
  const setActiveTab = (tab: EscritorioTab) => {
    if (setActiveSubTab) {
      setActiveSubTab(tab);
    }
    setInternalActiveTab(tab);
  };

  // Avatar Presets Catalog oficiales según la imagen de referencia (Trajes y círculos)
  const AVATAR_PRESETS = OFFICIAL_AVATARS;

  // Profile Form State synced with currentUser
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [cedula, setCedula] = useState(currentUser?.cedula || currentUser?.username || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [usernameError, setUsernameError] = useState('');
  const [gender, setGender] = useState<'MASCULINO' | 'FEMENINO'>(
    currentUser?.gender || (currentUser ? (getDefaultAvatarForUser(currentUser).includes('female') ? 'FEMENINO' : 'MASCULINO') : 'MASCULINO')
  );
  const [profileComment, setProfileComment] = useState(
    currentUser?.bio || 'Coordinación de Evaluación y Docencia - Colegio Bellas Artes'
  );
  const [receiveEmails, setReceiveEmails] = useState(currentUser?.receiveEmails !== false ? 'SI' : 'NO');
  const [receiveMessages, setReceiveMessages] = useState(currentUser?.receiveMessages !== false ? 'SI' : 'NO');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(
    currentUser?.avatarUrl || (currentUser ? getDefaultAvatarForUser(currentUser) : '')
  );
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [avatarGenderFilter, setAvatarGenderFilter] = useState<'ALL' | 'FEMENINO' | 'MASCULINO'>(
    currentUser?.gender || 'ALL'
  );
  const [profileSaved, setProfileSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Suggestions Form State
  const [suggestionMessage, setSuggestionMessage] = useState('');
  const [suggestionCheck, setSuggestionCheck] = useState(false);
  const [suggestionSent, setSuggestionSent] = useState(false);

  // Subsistemas / Niveles asignados
  const [selectedLevels, setSelectedLevels] = useState<EducationalLevel[]>(() => {
    if (currentUser?.allowedLevels && currentUser.allowedLevels.length > 0) {
      return currentUser.allowedLevels;
    }
    if (currentUser?.defaultLevel) {
      return [currentUser.defaultLevel];
    }
    return ['MEDIA_GENERAL'];
  });
  const [defaultLevel, setDefaultLevel] = useState<EducationalLevel>(currentUser?.defaultLevel || 'MEDIA_GENERAL');

  const toggleLevel = (lvl: EducationalLevel) => {
    setSelectedLevels(prev => {
      let next: EducationalLevel[];
      if (prev.includes(lvl)) {
        if (prev.length === 1) return prev; // Mantener al menos un nivel asignado
        next = prev.filter(l => l !== lvl);
      } else {
        next = [...prev, lvl];
      }
      if (!next.includes(defaultLevel)) {
        setDefaultLevel(next[0]);
      }
      return next;
    });
  };

  // Sincronizar si cambia de usuario en sesión
  React.useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setUsername(currentUser.username || '');
      setEmail(currentUser.email || '');
      setCedula(currentUser.cedula || currentUser.username || '');
      setPhone(currentUser.phone || '');
      setUsernameError('');
      const userGender = currentUser.gender || (getDefaultAvatarForUser(currentUser).includes('female') ? 'FEMENINO' : 'MASCULINO');
      setGender(userGender);
      setProfileComment(currentUser.bio || 'Coordinación de Evaluación y Docencia - Colegio Bellas Artes');
      setReceiveEmails(currentUser.receiveEmails !== false ? 'SI' : 'NO');
      setReceiveMessages(currentUser.receiveMessages !== false ? 'SI' : 'NO');
      setSelectedAvatarUrl(currentUser.avatarUrl || getDefaultAvatarForUser(currentUser));
      setAvatarGenderFilter(userGender);
      if (currentUser.allowedLevels && currentUser.allowedLevels.length > 0) {
        setSelectedLevels(currentUser.allowedLevels);
      } else if (currentUser.defaultLevel) {
        setSelectedLevels([currentUser.defaultLevel]);
      }
      if (currentUser.defaultLevel) {
        setDefaultLevel(currentUser.defaultLevel);
      }
    }
  }, [currentUser]);

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Manejador de carga de archivo local con compresión y redimensionamiento inteligente
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccione un archivo de imagen válido (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5 MB.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const rawDataUrl = reader.result;
        // Redimensionar la imagen a un avatar óptimo (máx 280x280) para guardar ágilmente en Supabase
        const img = new Image();
        img.onload = () => {
          const maxDim = 280;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setSelectedAvatarUrl(optimizedDataUrl);
          } else {
            setSelectedAvatarUrl(rawDataUrl);
          }
          setIsUploading(false);
        };
        img.onerror = () => {
          setSelectedAvatarUrl(rawDataUrl);
          setIsUploading(false);
        };
        img.src = rawDataUrl;
      }
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('Error al leer el archivo de imagen.');
    };
    reader.readAsDataURL(file);
  };

  // Manejador de URL externa personalizada
  const handleApplyCustomUrl = () => {
    if (!customImageUrl.trim()) return;
    setSelectedAvatarUrl(customImageUrl.trim());
    setCustomImageUrl('');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || isSavingProfile) return;
    setUsernameError('');

    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');
    if (!cleanUsername) {
      setUsernameError('El nombre de usuario no puede estar vacío.');
      return;
    }

    // Verificar si el nuevo username ya está en uso por otro usuario
    const isTaken = users.some(
      u => u.id !== currentUser.id && u.username.toLowerCase() === cleanUsername
    );
    if (isTaken) {
      setUsernameError(`El nombre de usuario "${cleanUsername}" ya está en uso por otra cuenta.`);
      return;
    }

    setIsSavingProfile(true);
    try {
      await updateUser(currentUser.id, {
        fullName: fullName.trim() || currentUser.fullName,
        username: cleanUsername,
        email: email.trim() || currentUser.email,
        cedula: cedula.trim() || currentUser.cedula || cleanUsername,
        phone: phone.trim(),
        gender: gender,
        bio: profileComment.trim(),
        avatarUrl: selectedAvatarUrl,
        receiveEmails: receiveEmails === 'SI',
        receiveMessages: receiveMessages === 'SI',
        allowedLevels: selectedLevels,
        defaultLevel: defaultLevel
      });

      // Actualizar también la preferencia de usuario recordado si coincidía
      const remembered = localStorage.getItem('sisceba_remembered_user');
      if (remembered && remembered.toLowerCase() === currentUser.username.toLowerCase()) {
        localStorage.setItem('sisceba_remembered_user', cleanUsername);
      }

      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3500);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      alert('No se pudo guardar el perfil en la base de datos.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentUser) return;
    if (!newPassword.trim()) {
      setPasswordError('Por favor ingrese la nueva contraseña.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe contener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden. Por favor verifique.');
      return;
    }

    try {
      await updateUser(currentUser.id, {
        password: newPassword
      });
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 4500);
    } catch {
      setPasswordError('Error al actualizar la contraseña en el sistema.');
    }
  };

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionMessage || !suggestionCheck) return;
    setSuggestionSent(true);
    setSuggestionMessage('');
    setSuggestionCheck(false);
    setTimeout(() => setSuggestionSent(false), 4000);
  };

  const todayBirthdays = birthdays.filter(b => b.isToday);

  return (
    <div className="space-y-6">
      {/* Top Unified Navigation & View Switcher */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#1B1C33] text-[#D4AF37] flex items-center justify-center font-black text-lg shadow-sm border border-[#2C2E53] shrink-0">
            CB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#2C2E53] dark:text-white">Escritorio de Operaciones y Control</h2>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/30">
                Auditoría Institucional
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Panel institucional de telemetría, auditoría de accesos y servicios al personal docente y administrativo
            </p>
          </div>
        </div>

      </div>

      {/* VIEW: DASHBOARD TABLERO */}
      {activeTab === 'DASHBOARD' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Session Audit & System Health */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audit Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-bold text-[#2C2E53] text-sm">Información de Auditoría y Sesión Activa</h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Conectado
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Última Visita</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">Hoy</p>
                  <p className="text-[11px] text-slate-500 font-medium">{new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Sesión Actual</span>
                  <p className="text-sm font-black text-emerald-600 mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Activa
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">En línea</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Año Escolar</span>
                  <p className="text-sm font-black text-[#2C2E53] mt-1">2026 - 2027</p>
                  <p className="text-[11px] text-slate-500 font-medium">Ciclo Oficial CBA</p>
                </div>
              </div>

              {/* Roles Asignados */}
              <div>
                <span className="text-xs font-bold text-slate-600 block mb-2">Rol y Perfil Asignado en esta Cuenta:</span>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm flex items-center gap-1.5 ${ROLE_METADATA[currentRole]?.badgeBg || 'bg-[#1B1C33] text-[#D4AF37] border-[#2C2E53]'}`}>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{ROLE_METADATA[currentRole]?.label || currentRole}</span>
                    <span className="opacity-75 text-[10px]">({currentRole})</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Sitios Más Visitados según el rol */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-bold text-[#2C2E53] text-sm">Sitios y Secciones Más Visitadas</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Frecuencia de Uso</span>
              </div>

              {currentRole === 'SECRETARIA' ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">1. Inasistencias y Pase de Lista</span>
                      <span className="text-emerald-600 font-extrabold">52.4 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '52.4%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">2. Registro de Conductas y Faltas</span>
                      <span className="text-amber-600 font-extrabold">31.8 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '31.8%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">3. Nóminas y Reportes de Asistencia</span>
                      <span className="text-[#D4AF37] font-extrabold">15.8 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-[#D4AF37] rounded-full" style={{ width: '15.8%' }}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">1. Calificaciones y Notas</span>
                      <span className="text-[#D4AF37] font-extrabold">36.3 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-[#D4AF37] rounded-full" style={{ width: '36.3%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">2. Planificación Didáctica</span>
                      <span className="text-blue-600 font-extrabold">26.6 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '26.6%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">3. Asistencias y Matrícula</span>
                      <span className="text-emerald-600 font-extrabold">21.2 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '21.2%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">4. Boletines y Reportes</span>
                      <span className="text-purple-600 font-extrabold">15.9 %</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '15.9%' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Widgets Cumpleañeros & Soporte */}
          <div className="space-y-6">
            {/* Cumpleañeros del Día */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Cake className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-extrabold text-[#2C2E53] text-sm">Cumpleañeros</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {todayBirthdays.length} Hoy
                </span>
              </div>

              <div className="space-y-3">
                {birthdays.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4 italic">
                    No hay cumpleaños registrados para esta fecha.
                  </p>
                ) : (
                  birthdays.map((b) => (
                    <div
                      key={b.id}
                      className={`p-3 rounded-xl border transition-all ${
                        b.isToday
                          ? 'bg-gradient-to-r from-amber-500/10 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/20 border-amber-300 dark:border-amber-500/40'
                          : 'bg-slate-50 dark:bg-white/[0.03] border-slate-100 dark:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs text-slate-800 dark:text-[#F8FAFC]">{b.fullName}</p>
                        {b.isToday && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500 text-white dark:bg-amber-500/20 dark:text-amber-300 dark:border dark:border-amber-500/40 animate-pulse">
                            ¡HOY!
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5">{b.gradeOrArea}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3 text-[#D4AF37]" />
                        {b.birthDate}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Canal Institucional CBA / Lidsoftware */}
            <div className="bg-gradient-to-br from-[#1B1C33] to-[#252747] text-white rounded-2xl p-6 border border-[#2C2E53] shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1 border border-[#D4AF37]/50 shadow-md">
                  <span className="text-[#2C2E53] font-black text-sm">CBA</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white">Canal Institucional • SICE-CBA</h4>
                  <p className="text-[10px] text-slate-300">Colegio Bellas Artes</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                Plataforma oficial sincronizada para el control escolar, notas oficiales, gestión docente y comunicación con las familias para el periodo escolar 2026-2027.
              </p>
              <div className="p-3 rounded-xl bg-[#141525]/80 border border-white/10 mb-3">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                  Autor y Desarrollador del Sistema:
                </span>
                <p className="text-xs font-black text-[#D4AF37] mt-0.5">
                  Ing. en Informática Miguelangel Contreras Guillén
                </p>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  Desarrollo de Software & Arquitectura SICE-CBA
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono">v1.0.0-DEV</span>
                <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Soporte Activo
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MI PERFIL */}
      {activeTab === 'PERFIL' && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Tarjeta Principal de Perfil */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-cba-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
              <div className="flex items-center gap-4">
                {/* Avatar Preview Grande con Aura Institucional y Micro-Zoom */}
                <div className="relative group shrink-0">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#2C2E53] opacity-35 blur-sm group-hover:opacity-75 transition duration-300 pointer-events-none" />
                  {selectedAvatarUrl ? (
                    <img
                      src={selectedAvatarUrl}
                      alt={currentUser?.fullName || 'Usuario'}
                      className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain bg-white border-2 border-[#D4AF37] shadow-xl p-0.5 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#2C2E53] to-[#1B1C33] text-[#D4AF37] border-2 border-[#D4AF37]/50 flex items-center justify-center font-black text-2xl sm:text-3xl shadow-xl group-hover:scale-105 transition-transform duration-300">
                      {(currentUser?.fullName?.[0] || currentRole[0] || 'U').toUpperCase()}
                    </div>
                  )}
                  <label
                    htmlFor="avatar-file-input"
                    className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] border border-[#D4AF37]/80 rounded-xl shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-115 active:scale-95 z-10"
                    title="Subir foto desde su equipo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </label>
                  <input
                    id="avatar-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-lg sm:text-xl text-[#2C2E53]">
                      {currentUser?.fullName || 'Perfil de Usuario'}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#2C2E53]/10 text-[#2C2E53] border border-[#2C2E53]/20">
                      {currentRole}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    @{currentUser?.username || 'usuario'} • {currentUser?.email || 'Sin correo asignado'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Personalice su foto institucional, elija un avatar oficial (hombre o mujer) o suba una imagen de su equipo.
                  </p>
                </div>
              </div>

              {selectedAvatarUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedAvatarUrl('')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition border border-rose-200 self-start sm:self-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Quitar Imagen
                </button>
              )}
            </div>

            {profileSaved && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>¡Perfil e imagen de usuario actualizados satisfactoriamente en SICE-CBA!</span>
              </div>
            )}

            {/* SECCIÓN 1: SELECCIÓN Y MODIFICACIÓN DE IMAGEN / AVATAR */}
            <div className="mb-8 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                  <h4 className="font-extrabold text-xs sm:text-sm text-[#2C2E53] uppercase tracking-wider">
                    Foto o Avatar de Usuario
                  </h4>
                </div>

                {/* Filtro de Género de Avatares (Hombre / Mujer / Todos) */}
                <div className="flex items-center bg-white p-0.5 rounded-xl border border-slate-200 text-xs font-bold shadow-xs">
                  <button
                    type="button"
                    onClick={() => setAvatarGenderFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      avatarGenderFilter === 'ALL'
                        ? 'bg-[#2C2E53] text-[#D4AF37]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarGenderFilter('FEMENINO')}
                    className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                      avatarGenderFilter === 'FEMENINO'
                        ? 'bg-[#2C2E53] text-[#D4AF37]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Mujer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarGenderFilter('MASCULINO')}
                    className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                      avatarGenderFilter === 'MASCULINO'
                        ? 'bg-[#2C2E53] text-[#D4AF37]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Hombre</span>
                  </button>
                </div>
              </div>

              {/* Galería de Avatares Predefinidos */}
              <div>
                <span className="block text-[11px] font-bold text-slate-500 mb-2">
                  Seleccione un avatar institucional oficial:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AVATAR_PRESETS.filter(
                    a => avatarGenderFilter === 'ALL' || a.gender === avatarGenderFilter
                  ).map(avatar => {
                    const isSelected = selectedAvatarUrl === avatar.svgDataUri;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => {
                          setSelectedAvatarUrl(avatar.svgDataUri);
                          setGender(avatar.gender);
                        }}
                        className={`relative group p-2 rounded-xl border transition-all text-left flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-[#2C2E53]/5 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={avatar.svgDataUri}
                            alt={avatar.label}
                            className="w-10 h-10 rounded-xl object-contain border border-slate-200 group-hover:scale-105 transition bg-white"
                          />
                          {isSelected && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-slate-800 truncate">
                            {avatar.label}
                          </p>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            {avatar.gender === 'FEMENINO' ? 'Femenino' : 'Masculino'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Alternativa: Subir archivo o ingresar URL */}
              <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Opción A: Subir imagen desde la computadora */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Subir imagen desde el equipo:
                  </span>
                  <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#2C2E53] bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-[#2C2E53] cursor-pointer text-xs font-semibold transition">
                    <Upload className="w-4 h-4 text-[#D4AF37]" />
                    <span>{isUploading ? 'Procesando imagen...' : 'Examinar foto local (PNG, JPG)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Formatos: PNG, JPG, JPEG o WEBP (Máximo 3 MB).
                  </span>
                </div>

                {/* Opción B: Enlace web directo a una foto */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    O pegar enlace / URL de imagen:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="https://ejemplo.com/mifoto.jpg"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      disabled={!customImageUrl.trim()}
                      className="px-3 py-1.5 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs disabled:opacity-50 transition shrink-0"
                    >
                      Aplicar
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Cargue una fotografía institucional alojada en la web.
                  </span>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: FORMULARIO DE DATOS PERSONALES Y PREFERENCIAS */}
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre Completo (Corregir transcripción):
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Nombres y apellidos institucionales.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cédula de Identidad (Editable):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="V-12345678"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Permite subsanar errores tipográficos de documento.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico Institucional:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Para recuperación de clave y notificaciones.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre de Usuario (Login / Acceso):
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''));
                      setUsernameError('');
                    }}
                    placeholder="Ej: cvillalobos"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-none focus:ring-2 ${
                      usernameError
                        ? 'border-rose-300 bg-rose-50/50 text-rose-900 focus:ring-rose-500'
                        : 'border-slate-300 bg-white text-slate-800 focus:ring-[#2C2E53]'
                    }`}
                  />
                  {usernameError ? (
                    <span className="text-[10px] text-rose-600 font-semibold mt-1 block">
                      {usernameError}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Nombre de usuario institucional para iniciar sesión.
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sexo / Género Institucional:
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => {
                      const newGender = e.target.value as 'MASCULINO' | 'FEMENINO';
                      setGender(newGender);
                      setAvatarGenderFilter(newGender);
                      // Si no ha subido una foto personalizada externa, ajustar avatar por defecto al sexo
                      if (!selectedAvatarUrl || selectedAvatarUrl.startsWith('data:image/svg+xml')) {
                        setSelectedAvatarUrl(
                          getDefaultAvatarForUser({
                            gender: newGender,
                            role: currentUser?.role,
                            fullName: fullName
                          })
                        );
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  >
                    <option value="MASCULINO">Hombre (Masculino)</option>
                    <option value="FEMENINO">Mujer (Femenino)</option>
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Define la correspondencia del avatar institucional.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teléfono de Contacto (Opcional):
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+58 412 1234567"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Para avisos internos o emergencias.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Biografía / Estado Institucional:
                </label>
                <textarea
                  rows={2}
                  value={profileComment}
                  onChange={(e) => setProfileComment(e.target.value)}
                  placeholder="Descripción de cargo o departamento..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                />
              </div>

              {/* SUBSISTEMAS / NIVELES EDUCATIVOS ASIGNADOS */}
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800">
                      Subsistemas / Niveles Educativos Asignados:
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Seleccione los niveles a los que tiene acceso en el colegio. Se habilitarán de inmediato en su barra de navegación.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 shrink-0">
                    {selectedLevels.length} {selectedLevels.length === 1 ? 'nivel activo' : 'niveles activos'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    {
                      id: 'INICIAL' as EducationalLevel,
                      title: 'Educación Inicial',
                      scale: 'Cualitativa (L / EP / I)',
                      icon: BookOpen,
                      color: 'text-amber-500',
                      badgeBg: 'bg-amber-500/15 text-amber-700 border-amber-300'
                    },
                    {
                      id: 'PRIMARIA' as EducationalLevel,
                      title: 'Educación Primaria',
                      scale: 'Formativa / Cualitativa',
                      icon: Layers,
                      color: 'text-emerald-500',
                      badgeBg: 'bg-emerald-500/15 text-emerald-700 border-emerald-300'
                    },
                    {
                      id: 'MEDIA_GENERAL' as EducationalLevel,
                      title: 'Media General',
                      scale: 'Cuantitativa (01 - 20 pts)',
                      icon: GraduationCap,
                      color: 'text-indigo-500',
                      badgeBg: 'bg-indigo-500/15 text-indigo-700 border-indigo-300'
                    }
                  ].map((item) => {
                    const isChecked = selectedLevels.includes(item.id);
                    const Icon = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => toggleLevel(item.id)}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                          isChecked
                            ? 'bg-[#1B1C33] text-white border-[#D4AF37] shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isChecked
                                ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs font-bold truncate ${isChecked ? 'text-white' : 'text-slate-800'}`}>
                              {item.title}
                            </p>
                            <p className={`text-[10px] truncate ${isChecked ? 'text-[#D4AF37]' : 'text-slate-400'}`}>
                              {item.scale}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? 'bg-[#D4AF37] border-[#D4AF37] text-slate-950'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Nivel Predeterminado al ingresar */}
                <div className="pt-2 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Nivel Principal Predeterminado:
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Nivel que se mostrará al iniciar sesión institucional.
                    </span>
                  </div>
                  <select
                    value={defaultLevel}
                    onChange={(e) => setDefaultLevel(e.target.value as EducationalLevel)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2C2E53] outline-none font-bold text-xs text-slate-800 shrink-0"
                  >
                    {selectedLevels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl === 'MEDIA_GENERAL'
                          ? 'Educación Media General'
                          : lvl === 'PRIMARIA'
                          ? 'Educación Primaria'
                          : 'Educación Inicial'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Notificaciones por Correo Electrónico:
                  </label>
                  <select
                    value={receiveEmails}
                    onChange={(e) => setReceiveEmails(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  >
                    <option value="SI">Sí, recibir notificaciones</option>
                    <option value="NO">No, desactivar correos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mensajería Interna SICE-CBA:
                  </label>
                  <select
                    value={receiveMessages}
                    onChange={(e) => setReceiveMessages(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                  >
                    <option value="SI">Sí, habilitar mensajería</option>
                    <option value="NO">No recibir mensajes</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Los cambios se reflejarán y guardarán inmediatamente en la base de datos de SICE-CBA.
                </span>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className={`px-6 py-2.5 rounded-xl bg-[#2C2E53] hover:bg-[#1E2A4A] text-[#D4AF37] font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                    isSavingProfile ? 'opacity-70 cursor-wait' : ''
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 text-[#D4AF37] ${isSavingProfile ? 'animate-spin' : ''}`} />
                  {isSavingProfile ? 'Guardando en Base de Datos...' : 'Guardar Perfil e Imagen'}
                </button>
              </div>
            </form>

            {/* SECCIÓN: CÁTEDRAS Y SALONES OFICIALES ASIGNADOS (DISTRIBUTIVO INSTITUCIONAL) */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#2C2E53] text-[#D4AF37] flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#2C2E53] flex items-center gap-2">
                      Cátedras y Salones Oficiales Asignados
                      {currentUser?.academicAssignments && currentUser.academicAssignments.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
                          {currentUser.academicAssignments.length} {currentUser.academicAssignments.length === 1 ? 'cátedra' : 'cátedras'}
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Distributivo de asignaturas y salones oficiales asignados institucionalmente por Dirección / Coordinación.
                    </p>
                  </div>
                </div>
              </div>

              {currentUser?.academicAssignments && currentUser.academicAssignments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentUser.academicAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="p-3.5 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-xl hover:border-blue-300 transition-all shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                            {assignment.level === 'MEDIA_GENERAL'
                              ? 'Media General'
                              : assignment.level === 'PRIMARIA'
                              ? 'Primaria'
                              : 'Inicial'}
                          </span>
                          <span className="text-[11px] font-black px-2 py-0.5 rounded bg-[#2C2E53] text-[#D4AF37]">
                            Sección "{assignment.section}"
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-xs mt-1">
                          {assignment.areaName || assignment.subjectName}
                        </h5>
                        <p className="text-[11px] font-semibold text-slate-600 mt-0.5">
                          {assignment.grade}
                        </p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>Cátedra Oficial</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Habilitada
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold mb-0.5">Sin asignación oficial de cátedras registrada</p>
                    <p className="text-amber-800 text-[11px]">
                      La Coordinación Académica y Dirección configuran las áreas y salones de enseñanza desde el módulo de <span className="font-bold">Gestión &gt; Usuarios</span>. Una vez asignadas, sus materias y salones se autocompletarán de forma inmediata en el Cuaderno de Calificaciones, Planificación Didáctica y Horarios.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* SECCIÓN 3: CAMBIO DE CONTRASEÑA CON GENERADOR ROBUSTO */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#2C2E53] text-[#D4AF37] flex items-center justify-center font-bold">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#2C2E53]">
                    Seguridad y Cambio de Contraseña
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Actualice su clave de acceso institucional o genere una contraseña robusta de alta seguridad.
                  </p>
                </div>
              </div>

              {passwordSuccess && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡Su contraseña institucional ha sido actualizada y protegida criptográficamente con éxito!</span>
                </div>
              )}

              {passwordError && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nueva Contraseña:
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nueva clave segura"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53] bg-white font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 transition"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <PasswordStrengthBar
                      password={newPassword}
                      onGeneratePassword={(gen) => setNewPassword(gen)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirmar Nueva Contraseña:
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita la nueva clave"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53] bg-white font-medium"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Asegúrese de que ambas contraseñas coincidan exactamente.
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!newPassword.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2C2E53] to-[#1B1C33] hover:from-[#1B1C33] hover:to-slate-900 text-[#D4AF37] font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Actualizar Contraseña</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MI HORARIO DE CLASES / LABORES (CONEXIÓN DIRECTA CON BASE DE DATOS) */}
      {activeTab === 'HORARIO' && (() => {
        const isRepresentative = currentRole === 'REPRESENTANTE';
        const isStudent = currentRole === 'ESTUDIANTE';
        const isFamilyOrStudent = isRepresentative || isStudent;
        const days: ScheduleDay[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];

        // VISTA PARA REPRESENTANTE O ESTUDIANTE: Visualización de Horario del Hijo/a o Alumno
        if (isFamilyOrStudent) {
          const activeChild: Student | null = isRepresentative
            ? (representedStudents.find(s => s.id === selectedChildId) || representedStudents[0] || null)
            : currentStudent;

          if (!activeChild) {
            return (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-cba-card text-center max-w-xl mx-auto space-y-4 my-8">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800/60 shadow-inner">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#2C2E53] dark:text-white">
                    {isRepresentative ? 'Sin Representados Vinculados' : 'Estudiante No Encontrado'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {isRepresentative
                      ? 'No se encontraron alumnos registrados asociados a su cuenta de representante legal. Si acaba de formalizar la inscripción en el plantel, por favor confirme que su cédula o correo coincidan con los datos de inscripción o consulte en Coordinación.'
                      : 'No se encontró una ficha de alumno asociada a este usuario en la base de datos actual.'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 font-mono inline-block border border-slate-200 dark:border-slate-700">
                  Usuario en sesión: <strong className="text-slate-800 dark:text-white">{currentUser?.fullName}</strong> (@{currentUser?.username})
                </div>
              </div>
            );
          }

          const childBlocks = getChildScheduleBlocks(activeChild);

          const blocksByDay = days.reduce((acc, day) => {
            acc[day] = childBlocks
              .filter(b => b.day === day)
              .sort((a, b) => a.periodIndex - b.periodIndex || a.startTime.localeCompare(b.startTime));
            return acc;
          }, {} as Record<ScheduleDay, (ScheduleBlock & { teacherName?: string })[]>);

          const now = new Date();
          const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
          const currentDayStr = dayNames[now.getDay()];
          const currentDayUpper: ScheduleDay | null = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'][now.getDay() - 1] as ScheduleDay || null;
          const currentMinutes = now.getHours() * 60 + now.getMinutes();

          const activeCurrentBlock = currentDayUpper
            ? childBlocks.find(b => {
                if (b.day !== currentDayUpper) return false;
                const [sH, sM] = (b.startTime || '00:00').split(':').map(Number);
                const [eH, eM] = (b.endTime || '23:59').split(':').map(Number);
                const startMin = (sH || 0) * 60 + (sM || 0);
                const endMin = (eH || 0) * 60 + (eM || 0);
                return currentMinutes >= startMin && currentMinutes <= endMin;
              })
            : null;

          const isRecessTime = (() => {
            if (!currentDayUpper) return false;
            if (activeChild.level === 'MEDIA_GENERAL') {
              return currentMinutes >= (10 * 60 + 15) && currentMinutes <= (10 * 60 + 45);
            }
            return currentMinutes >= (9 * 60 + 30) && currentMinutes <= (10 * 60);
          })();

          const uniqueSubjects = Array.from(new Set(childBlocks.map(b => b.subjectName))).map(subName => {
            const sample = childBlocks.find(blk => blk.subjectName === subName)!;
            const count = childBlocks.filter(blk => blk.subjectName === subName).length;
            return {
              name: subName,
              color: sample.color || 'blue',
              count,
              hoursWeekly: Math.round((count * 45) / 60 * 10) / 10,
              room: sample.classroom || 'Aula General',
              teacher: sample.teacherName || 'Docente Titular Asignado'
            };
          });

          const totalHours = childBlocks.length;

          return (
            <div className="space-y-6">
              {/* SELECTOR DE HIJO / REPRESENTADO (Si tiene más de 1 hijo) */}
              {isRepresentative && representedStudents.length > 1 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#D4AF37] flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#2C2E53] dark:text-white uppercase tracking-wider">
                        Seleccionar Hijo(a) / Representado(a):
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Tiene {representedStudents.length} representados registrados en la institución
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {representedStudents.map(child => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => setSelectedChildId(child.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs ${
                          activeChild.id === child.id
                            ? 'bg-gradient-to-r from-[#2C2E53] to-[#1B1C33] text-[#D4AF37] ring-2 ring-[#D4AF37]/50'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>{child.fullName}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-[#D4AF37]">
                          {child.grade} "{child.section}"
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CARD PRINCIPAL DE IDENTIFICACIÓN DEL HORARIO */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-cba-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#2C2E53] px-2.5 py-0.5 rounded-md shadow-2xs">
                      {isRepresentative ? 'Horario de Clases de mi Representado(a)' : 'Mi Horario de Clases CBA'}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      Año Escolar 2026 - 2027
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {activeChild.level === 'MEDIA_GENERAL'
                        ? 'Educación Media General'
                        : activeChild.level === 'PRIMARIA'
                        ? 'Educación Primaria'
                        : 'Educación Inicial'}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#2C2E53] dark:text-white flex flex-wrap items-center gap-2">
                    <span>{activeChild.fullName}</span>
                    <span className="text-sm font-extrabold text-[#D4AF37] bg-[#2C2E53]/10 dark:bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-lg border border-[#D4AF37]/30">
                      {activeChild.grade} • Sección "{activeChild.section}"
                    </span>
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      Cédula / Código: <strong className="font-mono text-slate-700 dark:text-slate-200">{activeChild.cedula}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Turno: <strong className="text-slate-700 dark:text-slate-200">
                        {activeChild.level === 'MEDIA_GENERAL'
                          ? 'Diurno Regular (07:00 a 13:30 • 8 Bloques de 45m)'
                          : 'Integral Matutino (07:00 a 12:15 • 6 Bloques de 45m)'}
                      </strong>
                    </span>
                    {isRepresentative && activeChild.representativeName && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Representante Legal: <strong className="text-slate-700 dark:text-slate-200">{activeChild.representativeName}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {!isRepresentative && (
                  <div className="flex items-center gap-2 w-full md:w-auto no-print">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2C2E53] to-[#1B1C33] hover:from-[#1B1C33] hover:to-slate-900 text-[#D4AF37] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/30"
                      title="Imprimir copia oficial del horario escolar"
                    >
                      <Printer className="w-4 h-4 text-[#D4AF37]" />
                      <span>Imprimir Horario Oficial</span>
                    </button>
                  </div>
                )}
              </div>

              {/* BANNER DINÁMICO DE ESTADO EN TIEMPO REAL */}
              {activeCurrentBlock ? (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-xs font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs animate-in fade-in">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping shrink-0" />
                    <span>
                      Actividad en curso ahora ({activeCurrentBlock.startTime} - {activeCurrentBlock.endTime}):{' '}
                      <strong className="text-amber-900 dark:text-amber-100 font-black">{activeCurrentBlock.subjectName}</strong>
                      {' • '}{activeCurrentBlock.classroom || 'Aula General'}
                      {activeCurrentBlock.teacherName && ` (Prof. ${activeCurrentBlock.teacherName})`}
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shrink-0">
                    En Aula • Hora {activeCurrentBlock.periodIndex}
                  </span>
                </div>
              ) : isRecessTime ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 text-xs font-bold flex items-center gap-2.5 shadow-xs">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    Momento de Recreo / Merienda y Esparcimiento Guiado en las áreas recreativas del plantel.
                  </span>
                </div>
              ) : null}

              {/* TOOLBAR DE FILTRO POR DÍA */}
              <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm no-print">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mr-1">Filtrar Día:</span>
                  <button
                    type="button"
                    onClick={() => setScheduleDayFilter('TODOS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      scheduleDayFilter === 'TODOS'
                        ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Semana Completa ({totalHours} Clases)
                  </button>
                  {days.map(d => {
                    const dayCount = childBlocks.filter(b => b.day === d).length;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setScheduleDayFilter(d)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          scheduleDayFilter === d
                            ? 'bg-[#2C2E53] text-[#D4AF37] shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {d} ({dayCount})
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  Carga escolar: <strong className="text-slate-800 dark:text-slate-200 font-black">{totalHours} sesiones</strong> ({uniqueSubjects.length} asignaturas)
                </div>
              </div>

              {/* GRILLA SEMANAL VISUAL (Lunes a Viernes) */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {days.map(day => {
                  const dayBlocks = blocksByDay[day] || [];
                  const isFilteredOut = scheduleDayFilter !== 'TODOS' && scheduleDayFilter !== day;
                  if (isFilteredOut) return null;

                  return (
                    <div
                      key={day}
                      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden transition-all ${
                        scheduleDayFilter === day ? 'md:col-span-5' : ''
                      }`}
                    >
                      {/* Encabezado del Día */}
                      <div className="p-3 bg-gradient-to-r from-slate-50 to-slate-100/70 dark:from-slate-800/80 dark:to-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CalendarCheck className="w-4 h-4 text-[#D4AF37]" />
                          <h4 className="font-extrabold text-xs text-slate-800 dark:text-white tracking-wide">
                            {day}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {dayBlocks.length} {dayBlocks.length === 1 ? 'bloque' : 'bloques'}
                        </span>
                      </div>

                      {/* Bloques del Día */}
                      <div className="p-3 space-y-2.5 flex-1 min-h-[140px] bg-slate-50/30 dark:bg-slate-950/20">
                        {dayBlocks.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                            <Clock className="w-6 h-6 text-slate-300 dark:text-slate-700 mb-1 stroke-1" />
                            <p className="text-[11px] italic">Sin actividades asignadas</p>
                          </div>
                        ) : (
                          dayBlocks.map((block) => {
                            const [startH, startM] = (block.startTime || '00:00').split(':').map(Number);
                            const [endH, endM] = (block.endTime || '23:59').split(':').map(Number);
                            const blockStartMin = (startH || 0) * 60 + (startM || 0);
                            const blockEndMin = (endH || 0) * 60 + (endM || 0);

                            const isCurrentBlock =
                              currentDayStr === day &&
                              currentMinutes >= blockStartMin &&
                              currentMinutes <= blockEndMin;

                            const colorClasses =
                              block.color === 'emerald'
                                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200'
                                : block.color === 'indigo'
                                ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200'
                                : block.color === 'violet'
                                ? 'border-violet-300 dark:border-violet-800 bg-violet-50/70 dark:bg-violet-950/40 text-violet-950 dark:text-violet-200'
                                : block.color === 'amber'
                                ? 'border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200'
                                : block.color === 'rose'
                                ? 'border-rose-300 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200'
                                : block.color === 'teal'
                                ? 'border-teal-300 dark:border-teal-800 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200'
                                : 'border-blue-300 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200';

                            const isBeforeRecess =
                              (activeChild.level === 'MEDIA_GENERAL' && block.periodIndex === 4) ||
                              ((activeChild.level === 'PRIMARIA' || activeChild.level === 'INICIAL') && block.periodIndex === 3);

                            return (
                              <React.Fragment key={block.id}>
                                <div
                                  className={`p-3 rounded-xl border ${colorClasses} shadow-xs relative transition-all duration-200 hover:shadow-md ${
                                    isCurrentBlock
                                      ? 'ring-2 ring-[#D4AF37] ring-offset-1 shadow-md bg-amber-50/90 dark:bg-amber-950/60'
                                      : ''
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-1 mb-1">
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/90 dark:bg-slate-900/90 shadow-2xs">
                                        {block.startTime} - {block.endTime}
                                      </span>
                                      {isCurrentBlock && (
                                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#D4AF37] text-slate-950 flex items-center gap-0.5 animate-pulse shadow-2xs">
                                          <Sparkles className="w-2.5 h-2.5" />
                                          En Curso
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/70 dark:bg-slate-900/70">
                                      Hora {block.periodIndex}
                                    </span>
                                  </div>

                                  <h5 className="font-extrabold text-xs leading-tight mb-1 text-slate-900 dark:text-white">
                                    {block.subjectName}
                                  </h5>

                                  <div className="space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                                    {block.teacherName && (
                                      <div className="flex items-center gap-1">
                                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                                        <span className="truncate">{block.teacherName}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span className="truncate">{block.classroom || 'Aula General'}</span>
                                    </div>
                                  </div>
                                </div>

                                {isBeforeRecess && (
                                  <div className="py-1 px-2.5 rounded-lg bg-gradient-to-r from-amber-100/80 to-amber-50/60 dark:from-amber-950/50 dark:to-amber-900/30 border border-amber-200/80 dark:border-amber-800/50 flex items-center justify-between text-[10px] font-bold text-amber-800 dark:text-amber-300">
                                    <span className="flex items-center gap-1.5">
                                      ☕ Recreo / Merienda Guiada
                                    </span>
                                    <span className="font-mono text-[9px]">
                                      {activeChild.level === 'MEDIA_GENERAL' ? '10:15 - 10:45' : '09:30 - 10:00'}
                                    </span>
                                  </div>
                                )}
                              </React.Fragment>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RESUMEN DE ASIGNATURAS Y DOCENTES (no-print) */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 no-print">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                    <h4 className="text-xs font-black uppercase text-[#2C2E53] dark:text-white tracking-wider">
                      Cátedras y Asignaturas Oficiales del Curso ({uniqueSubjects.length})
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {totalHours} sesiones pedagógicas / semana
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {uniqueSubjects.map(sub => (
                    <div
                      key={sub.name}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-start justify-between gap-2"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {sub.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{sub.teacher}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{sub.room}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                        {sub.count} {sub.count === 1 ? 'hora' : 'horas'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FORMATO OFICIAL IMPRESO (@media print) */}
              <div className="hidden print:block p-6 bg-white text-slate-900 space-y-4">
                <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-wide">República Bolivariana de Venezuela</h2>
                    <h3 className="text-xs font-bold uppercase">Ministerio del Poder Popular para la Educación</h3>
                    <h4 className="text-sm font-black text-[#1B1C33] mt-1">U.E. COLEGIO BELÉN SAN JUAN (SISCEBA)</h4>
                    <p className="text-[10px] font-mono text-slate-600">
                      Código DEA: {schoolData?.dea || 'OD-05241503'} • RIF: {schoolData?.rif || 'J-31456789-0'} • Circuito 05
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-black uppercase px-2.5 py-1 bg-slate-100 border border-slate-300 rounded block">
                      HORARIO OFICIAL DE CLASES
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                      Año Lectivo 2026 - 2027
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p><strong>Estudiante:</strong> {activeChild.fullName}</p>
                    <p><strong>Cédula / Escolar:</strong> {activeChild.cedula}</p>
                    <p><strong>Curso / Grado:</strong> {activeChild.grade} — Sección "{activeChild.section}"</p>
                  </div>
                  <div>
                    <p><strong>Nivel / Subsistema:</strong> {activeChild.level.replace('_', ' ')}</p>
                    <p><strong>Representante Legal:</strong> {activeChild.representativeName || currentUser?.fullName || 'Registrado'}</p>
                    <p><strong>Jornada:</strong> {activeChild.level === 'MEDIA_GENERAL' ? 'Diurno Regular (07:00 a 13:30)' : 'Integral Matutino (07:00 a 12:15)'}</p>
                  </div>
                </div>

                <table className="w-full text-center text-[10px] border-collapse border border-slate-400 mt-3">
                  <thead>
                    <tr className="bg-slate-100 font-black uppercase">
                      <th className="p-1.5 border border-slate-400 w-24">Hora / Bloque</th>
                      {days.map(d => (
                        <th key={d} className="p-1.5 border border-slate-400">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(activeChild.level === 'MEDIA_GENERAL' ? [1, 2, 3, 4, 5, 6, 7, 8] : [1, 2, 3, 4, 5, 6]).map(periodNum => (
                      <tr key={periodNum}>
                        <td className="p-1 border border-slate-400 font-mono font-bold bg-slate-50">
                          Bloque {periodNum}
                        </td>
                        {days.map(d => {
                          const blk = (blocksByDay[d] || []).find(b => b.periodIndex === periodNum);
                          return (
                            <td key={d} className="p-1 border border-slate-400 align-middle">
                              {blk ? (
                                <div>
                                  <strong className="block text-[10px] leading-tight">{blk.subjectName}</strong>
                                  <span className="block text-[8px] text-slate-600 font-mono">{blk.classroom || 'Aula'}</span>
                                  {blk.teacherName && (
                                    <span className="block text-[8px] text-slate-500 italic">{blk.teacherName}</span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[9px]">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pt-8 grid grid-cols-3 gap-6 text-center text-[10px] font-bold">
                  <div className="border-t border-slate-500 pt-1">
                    <p>Prof. Carlos R. Méndez P.</p>
                    <p className="font-normal text-slate-500">Director General</p>
                  </div>
                  <div className="border-t border-slate-500 pt-1">
                    <p>Coordinación Pedagógica</p>
                    <p className="font-normal text-slate-500">Sello Institucional CBA</p>
                  </div>
                  <div className="border-t border-slate-500 pt-1">
                    <p>Firma del Representante</p>
                    <p className="font-normal text-slate-500">Conformidad y Recepción</p>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // VISTA PARA PERSONAL / DOCENTES / ADMINISTRADORES (existente)
        const schedule = currentUserSchedule || {
          userId: currentUser?.id || 'usr-default',
          userRole: currentRole,
          schoolYear: '2026 - 2027',
          blocks: []
        };

        const filteredBlocks = scheduleDayFilter === 'TODOS'
          ? schedule.blocks
          : schedule.blocks.filter(b => b.day === scheduleDayFilter);

        // Agrupar bloques por día para la vista de cronograma
        const blocksByDay = days.reduce((acc, day) => {
          acc[day] = schedule.blocks
            .filter(b => b.day === day)
            .sort((a, b) => a.periodIndex - b.periodIndex || a.startTime.localeCompare(b.startTime));
          return acc;
        }, {} as Record<ScheduleDay, ScheduleBlock[]>);

        const handleAddBlockSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!blockSubject.trim() || !currentUser) return;

          const newBlock: ScheduleBlock = {
            id: `blk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            day: blockDay,
            startTime: blockStartTime,
            endTime: blockEndTime,
            periodIndex: Number(blockPeriod) || 1,
            subjectName: blockSubject.trim(),
            level: blockLevel,
            gradeSection: blockGradeSection.trim(),
            classroom: blockClassroom.trim() || 'Aula General',
            color: blockColor
          };

          const updatedSchedule: UserSchedule = {
            ...schedule,
            userId: currentUser.id,
            userRole: currentRole,
            blocks: [...schedule.blocks, newBlock]
          };

          const saved = await saveUserSchedule(updatedSchedule);
          if (saved) {
            setScheduleSavedToast(true);
            setTimeout(() => setScheduleSavedToast(false), 3000);
            setShowAddBlockModal(false);
            setBlockSubject('');
          }
        };

        const handleDeleteBlock = async (blockId: string) => {
          if (!currentUser) return;
          if (window.confirm('¿Desea eliminar esta sesión / hora de su horario?')) {
            const updatedSchedule: UserSchedule = {
              ...schedule,
              userId: currentUser.id,
              userRole: currentRole,
              blocks: schedule.blocks.filter(b => b.id !== blockId)
            };
            await saveUserSchedule(updatedSchedule);
            setScheduleSavedToast(true);
            setTimeout(() => setScheduleSavedToast(false), 3000);
          }
        };

        const totalHours = schedule.blocks.length;

        return (
          <div className="space-y-6">
            {/* Header de Mi Horario */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-cba-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Cronograma Personal & Académico
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Año: {schedule.schoolYear}
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#2C2E53] mt-1 flex items-center gap-2">
                  <span>Horario de: {currentUser?.fullName || 'Personal CBA'}</span>
                  <span className="text-xs font-bold text-slate-500 font-normal">
                    (@{currentUser?.username || 'usuario'} • {currentRole})
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualice y gestione sus bloques de clase, horas de atención o labores asignadas con sincronización en tiempo real.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowAddBlockModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Bloque</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
                  title="Imprimir copia de mi horario"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">Imprimir</span>
                </button>
              </div>
            </div>

            {scheduleSavedToast && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>¡Horario guardado y sincronizado exitosamente!</span>
              </div>
            )}

            {/* Toolbar de Filtro por Día y Resumen */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-xs font-bold text-slate-600 mr-1">Filtrar Día:</span>
                <button
                  type="button"
                  onClick={() => setScheduleDayFilter('TODOS')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    scheduleDayFilter === 'TODOS'
                      ? 'bg-[#2C2E53] text-[#D4AF37]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semana Completa ({totalHours} Horas)
                </button>
                {days.map(d => {
                  const dayCount = schedule.blocks.filter(b => b.day === d).length;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setScheduleDayFilter(d)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        scheduleDayFilter === d
                          ? 'bg-[#2C2E53] text-[#D4AF37]'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {d} ({dayCount})
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Total de sesiones registradas: <strong className="text-slate-800 font-black">{totalHours}</strong>
              </div>
            </div>

            {/* Grilla Semanal Visual Oficial (Lunes a Viernes) */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {days.map(day => {
                const dayBlocks = blocksByDay[day] || [];
                const isFilteredOut = scheduleDayFilter !== 'TODOS' && scheduleDayFilter !== day;
                if (isFilteredOut) return null;

                return (
                  <div
                    key={day}
                    className={`bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden transition-all ${
                      scheduleDayFilter === day ? 'md:col-span-5' : ''
                    }`}
                  >
                    {/* Encabezado del Día */}
                    <div className="p-3 bg-gradient-to-r from-slate-50 to-slate-100/60 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="w-4 h-4 text-[#D4AF37]" />
                        <h4 className="font-extrabold text-xs text-slate-800 tracking-wide">
                          {day}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {dayBlocks.length} {dayBlocks.length === 1 ? 'bloque' : 'bloques'}
                      </span>
                    </div>

                    {/* Bloques de Clase / Labor en el Día */}
                    <div className="p-3 space-y-2.5 flex-1 min-h-[140px] bg-slate-50/30">
                      {dayBlocks.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                          <Clock className="w-6 h-6 text-slate-300 mb-1 stroke-1" />
                          <p className="text-[11px] italic">Sin actividades asignadas</p>
                        </div>
                      ) : (
                        dayBlocks.map(block => {
                          const now = new Date();
                          const currentDayStr = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][now.getDay()];
                          const currentMinutes = now.getHours() * 60 + now.getMinutes();

                          const [startH, startM] = (block.startTime || '00:00').split(':').map(Number);
                          const [endH, endM] = (block.endTime || '23:59').split(':').map(Number);
                          const blockStartMin = (startH || 0) * 60 + (startM || 0);
                          const blockEndMin = (endH || 0) * 60 + (endM || 0);

                          const isCurrentBlock =
                            currentDayStr === day &&
                            currentMinutes >= blockStartMin &&
                            currentMinutes <= blockEndMin;

                          const colorClasses =
                            block.color === 'emerald'
                              ? 'border-emerald-300 bg-emerald-50/60 text-emerald-950'
                              : block.color === 'indigo'
                              ? 'border-indigo-300 bg-indigo-50/60 text-indigo-950'
                              : block.color === 'violet'
                              ? 'border-violet-300 bg-violet-50/60 text-violet-950'
                              : block.color === 'amber'
                              ? 'border-amber-300 bg-amber-50/60 text-amber-950'
                              : block.color === 'rose'
                              ? 'border-rose-300 bg-rose-50/60 text-rose-950'
                              : block.color === 'teal'
                              ? 'border-teal-300 bg-teal-50/60 text-teal-950'
                              : 'border-blue-300 bg-blue-50/60 text-blue-950';

                          return (
                            <div
                              key={block.id}
                              className={`p-3 rounded-xl border ${colorClasses} shadow-xs relative group transition-all duration-200 hover:shadow-md ${
                                isCurrentBlock
                                  ? 'ring-2 ring-[#D4AF37] ring-offset-1 shadow-md bg-amber-50/90'
                                  : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-1 mb-1">
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/90 shadow-2xs">
                                    {block.startTime} - {block.endTime}
                                  </span>
                                  {isCurrentBlock && (
                                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#D4AF37] text-slate-950 flex items-center gap-0.5 animate-pulse shadow-2xs">
                                      <Sparkles className="w-2.5 h-2.5" />
                                      En Curso
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/70">
                                  Hora {block.periodIndex}
                                </span>
                              </div>

                              <h5 className="font-extrabold text-xs leading-tight mb-1 text-slate-900">
                                {block.subjectName}
                              </h5>

                              <div className="space-y-0.5 text-[11px] text-slate-600 font-medium">
                                <div className="flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{block.gradeSection} ({block.level.replace('_', ' ')})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{block.classroom || 'Aula General'}</span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteBlock(block.id)}
                                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 rounded bg-white/80 hover:bg-white transition opacity-0 group-hover:opacity-100 shadow-2xs"
                                title="Eliminar este bloque"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* MODAL: AÑADIR NUEVO BLOQUE AL HORARIO */}
            {showAddBlockModal && typeof document !== 'undefined' && createPortal(
              <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#2C2E53] text-[#D4AF37] flex items-center justify-center font-bold">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#2C2E53]">Añadir Sesión al Horario</h4>
                        <p className="text-[10px] text-slate-400">Complete los datos de la clase o bloque</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddBlockModal(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddBlockSubmit} className="space-y-4">
                    {/* Atajo: Cargar desde Cátedra Oficial Asignada */}
                    {currentUser?.academicAssignments && currentUser.academicAssignments.length > 0 && (
                      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                        <label className="block text-[11px] font-black uppercase tracking-wider text-amber-900 mb-1.5 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                          Cargar desde Cátedra Oficial Asignada:
                        </label>
                        <select
                          className="w-full px-3 py-2 text-xs rounded-lg border border-amber-300 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                          defaultValue=""
                          onChange={(e) => {
                            const val = e.target.value;
                            if (!val) return;
                            const found = currentUser.academicAssignments?.find((a) => a.id === val);
                            if (found) {
                              setBlockSubject(found.areaName || found.subjectName || '');
                              setBlockLevel(found.level);
                              setBlockGradeSection(`${found.grade} ${found.section}`);
                            }
                          }}
                        >
                          <option value="">-- Seleccionar cátedra para autocompletar sesión --</option>
                          {currentUser.academicAssignments.map((assign) => (
                            <option key={assign.id} value={assign.id}>
                              {assign.areaName || assign.subjectName} — {assign.grade} "{assign.section}" ({assign.level === 'MEDIA_GENERAL' ? 'Media General' : assign.level === 'PRIMARIA' ? 'Primaria' : 'Inicial'})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Día de la Semana:</label>
                        <select
                          value={blockDay}
                          onChange={(e) => setBlockDay(e.target.value as ScheduleDay)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                        >
                          {days.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Número de Bloque / Hora:</label>
                        <select
                          value={blockPeriod}
                          onChange={(e) => setBlockPeriod(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                            <option key={p} value={p}>Hora {p}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Hora Inicio:</label>
                        <input
                          type="time"
                          required
                          value={blockStartTime}
                          onChange={(e) => setBlockStartTime(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Hora Fin:</label>
                        <input
                          type="time"
                          required
                          value={blockEndTime}
                          onChange={(e) => setBlockEndTime(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Materia / Asignatura / Labor:</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Física, Matemáticas, Atención UCE, Portería..."
                        value={blockSubject}
                        onChange={(e) => setBlockSubject(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Subsistema / Nivel:</label>
                        <select
                          value={blockLevel}
                          onChange={(e) => setBlockLevel(e.target.value as EducationalLevel)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                        >
                          <option value="MEDIA_GENERAL">Media General</option>
                          <option value="PRIMARIA">Primaria</option>
                          <option value="INICIAL">Inicial</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Grado / Sección / Área:</label>
                        <input
                          type="text"
                          required
                          list="schedule-grade-section-options"
                          placeholder="Ej. 4to Año A, Sala 5 Años B..."
                          value={blockGradeSection}
                          onChange={(e) => setBlockGradeSection(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                        />
                        <datalist id="schedule-grade-section-options">
                          {(LEVEL_GRADES_CATALOG[blockLevel] || []).flatMap((grade) => [
                            <option key={`${grade}-A`} value={`${grade} A`} />,
                            <option key={`${grade}-B`} value={`${grade} B`} />
                          ])}
                        </datalist>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Aula / Espacio Físico:</label>
                        <input
                          type="text"
                          placeholder="Ej. Aula 14, Lab de Informática, Cancha..."
                          value={blockClassroom}
                          onChange={(e) => setBlockClassroom(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Color de Identificación:</label>
                        <select
                          value={blockColor}
                          onChange={(e) => setBlockColor(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
                        >
                          <option value="blue">Azul (Ciencias / Regular)</option>
                          <option value="emerald">Verde (Prácticas / Recreo)</option>
                          <option value="indigo">Índigo (Teoría)</option>
                          <option value="violet">Violeta (Especialidad)</option>
                          <option value="amber">Ámbar (Atención / Reunión)</option>
                          <option value="rose">Rosa / Rojo (Control / Guardia)</option>
                          <option value="teal">Turquesa (Tutoría)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddBlockModal(false)}
                        className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingCloud}
                        className="px-5 py-2 rounded-xl bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4 text-[#D4AF37]" />
                        <span>{isSavingCloud ? 'Guardando...' : 'Guardar Bloque'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>,
              document.body
            )}
          </div>
        );
      })()}

      {/* VIEW: IDEAS Y SUGERENCIAS */}
      {activeTab === 'SUGERENCIAS' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-cba-card">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#2C2E53]">¡Sus Comentarios son Bienvenidos!</h3>
              <p className="text-xs text-slate-400">Canal directo con el equipo de soporte y desarrollo</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            Nuestro grupo de desarrollo quiere conocer su opinión. Ayúdenos a mejorar y háganos llegar sus sugerencias, comentarios e inquietudes técnicas mediante un simple mensaje.
          </p>

          {suggestionSent && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ¡Mensaje enviado con éxito al equipo de desarrollo de Lidsoftware / CBA!
            </div>
          )}

          <form onSubmit={handleSuggestionSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ingrese cualquier idea, sugerencia o inquietud:
              </label>
              <textarea
                rows={4}
                required
                value={suggestionMessage}
                onChange={(e) => setSuggestionMessage(e.target.value)}
                placeholder="Escriba aquí sus observaciones sobre el sistema o peticiones de mejora..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2C2E53]"
              />
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <input
                type="checkbox"
                id="checkVal"
                required
                checked={suggestionCheck}
                onChange={(e) => setSuggestionCheck(e.target.checked)}
                className="mt-0.5 rounded text-[#2C2E53] focus:ring-[#D4AF37]"
              />
              <label htmlFor="checkVal" className="text-xs text-slate-600 font-medium cursor-pointer select-none">
                Confirmo que deseo remitir esta sugerencia al departamento de soporte técnico del Colegio Bellas Artes.
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2C2E53] to-[#1B1C33] hover:from-[#1B1C33] hover:to-slate-900 text-[#D4AF37] font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Enviar Mensaje
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
