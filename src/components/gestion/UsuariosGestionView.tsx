import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { UserRole, EducationalLevel, AppUser, AcademicAssignment, LEVEL_GRADES_CATALOG, Student } from '../../types';
import { ROLE_METADATA, normalizeCedulaUsername } from '../../utils/rbac';
import { getDefaultAvatarForUser } from '../../utils/avatarCatalog';
import { PasswordStrengthBar } from '../common/PasswordStrengthBar';
import {
  Users,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Search,
  Filter,
  Key,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Trash2,
  Edit2,
  Sparkles,
  Lock,
  Layers,
  GraduationCap,
  BookOpen,
  Briefcase,
  SlidersHorizontal,
  RefreshCw,
  Eye,
  EyeOff,
  Plus,
  X
} from 'lucide-react';

export const UsuariosGestionView: React.FC = () => {
  const {
    users,
    students,
    addUser,
    updateUser,
    deleteUser,
    syncStudentUsers,
    registrationCodes,
    createRegistrationCode,
    deleteRegistrationCode,
    cleanExpiredRegistrationCodes,
    currentUser,
    areas,
    saveTeacherAssignments
  } = useApp();

  const handleDeleteUser = async (userToDelete: AppUser) => {
    if (userToDelete.username === 'admin' || userToDelete.id === currentUser?.id) {
      alert('No es posible eliminar la cuenta principal de Administrador.');
      return;
    }
    if (confirm(`¿Confirma eliminar definitivamente la cuenta de ${userToDelete.fullName} (@${userToDelete.username})? Esta acción revocará su acceso y limpiará su registro de la base de datos.`)) {
      await deleteUser(userToDelete.id);
    }
  };

  // Filtros principales
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'TODOS' | UserRole>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'DIRECTORIO' | 'CODIGOS' | 'NUEVO'>('DIRECTORIO');

  // Filtros secundarios para Estudiantes
  const [studentLevelFilter, setStudentLevelFilter] = useState<'TODOS' | EducationalLevel>('TODOS');
  const [studentGradeFilter, setStudentGradeFilter] = useState<string>('TODOS');
  const [studentSectionFilter, setStudentSectionFilter] = useState<'TODAS' | 'A' | 'B'>('TODAS');
  const [isSyncingStudents, setIsSyncingStudents] = useState(false);
  const [syncFeedbackMsg, setSyncFeedbackMsg] = useState<string | null>(null);

  // Estado para creación de nuevo usuario
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('DOCENTE');
  const [newAdditionalRoles, setNewAdditionalRoles] = useState<UserRole[]>([]);
  const [newGender, setNewGender] = useState<'MASCULINO' | 'FEMENINO'>('FEMENINO');
  const [newSelectedLevels, setNewSelectedLevels] = useState<EducationalLevel[]>(['MEDIA_GENERAL']);
  const [newDefaultLevel, setNewDefaultLevel] = useState<EducationalLevel>('MEDIA_GENERAL');
  const [newStudentGrade, setNewStudentGrade] = useState<string>('1er Año');
  const [newStudentSection, setNewStudentSection] = useState<'A' | 'B'>('A');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');

  // Estado para edición integral de usuario modal (Roles, Seguridad, Subsistemas)
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [editPrimaryRole, setEditPrimaryRole] = useState<UserRole>('DOCENTE');
  const [editAdditionalRoles, setEditAdditionalRoles] = useState<UserRole[]>([]);
  const [editAllowedLevels, setEditAllowedLevels] = useState<EducationalLevel[]>(['MEDIA_GENERAL']);
  const [editStudentGrade, setEditStudentGrade] = useState<string>('1er Año');
  const [editStudentSection, setEditStudentSection] = useState<'A' | 'B'>('A');
  const [editModalTab, setEditModalTab] = useState<'ROLES' | 'SEGURIDAD' | 'SUBSISTEMAS'>('ROLES');
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState('');

  // Estado para gestión de Carga Académica Docente (Distributivo de Cátedra)
  const [assigningTeacher, setAssigningTeacher] = useState<AppUser | null>(null);
  const [tempAssignments, setTempAssignments] = useState<AcademicAssignment[]>([]);
  const [assignLevel, setAssignLevel] = useState<EducationalLevel>('MEDIA_GENERAL');
  const [assignGrade, setAssignGrade] = useState<string>('1er Año');
  const [assignSection, setAssignSection] = useState<'A' | 'B'>('A');
  const [assignAreaId, setAssignAreaId] = useState<string>('');
  const [assignmentSuccessMsg, setAssignmentSuccessMsg] = useState<string>('');
  const [isSavingAssignments, setIsSavingAssignments] = useState(false);

  const handleOpenAssignments = (teacher: AppUser) => {
    setAssigningTeacher(teacher);
    setTempAssignments(teacher.academicAssignments ? [...teacher.academicAssignments] : []);
    const defLevel = teacher.defaultLevel || 'MEDIA_GENERAL';
    setAssignLevel(defLevel);
    setAssignGrade(LEVEL_GRADES_CATALOG[defLevel][0]);
    setAssignSection('A');
    const firstArea = areas.find(a => a.level === defLevel);
    setAssignAreaId(firstArea?.id || '');
    setAssignmentSuccessMsg('');
  };

  const handleAssignLevelChange = (lvl: EducationalLevel) => {
    setAssignLevel(lvl);
    setAssignGrade(LEVEL_GRADES_CATALOG[lvl][0]);
    const firstArea = areas.find(a => a.level === lvl);
    setAssignAreaId(firstArea?.id || '');
  };

  const handleAddAssignment = () => {
    if (!assignAreaId) {
      alert('Por favor seleccione un área o materia oficial.');
      return;
    }
    const area = areas.find(a => a.id === assignAreaId);
    if (!area) return;

    const exists = tempAssignments.some(
      a => a.grade === assignGrade && a.section === assignSection && a.areaId === assignAreaId
    );
    if (exists) {
      alert(`La cátedra "${area.name}" para ${assignGrade} sección ${assignSection} ya está asignada.`);
      return;
    }

    const newAssignment: AcademicAssignment = {
      id: `asg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      level: assignLevel,
      grade: assignGrade,
      section: assignSection,
      areaId: area.id,
      areaCode: area.code,
      areaName: area.name
    };

    setTempAssignments(prev => [...prev, newAssignment]);
  };

  const handleAssignFullGradePackage = () => {
    const regularAreas = areas.filter(a => a.level === assignLevel && a.type === 'REGULAR');
    if (regularAreas.length === 0) {
      alert('No se encontraron asignaturas regulares en este nivel.');
      return;
    }

    const newItems: AcademicAssignment[] = [];
    regularAreas.forEach(area => {
      const exists = tempAssignments.some(
        a => a.grade === assignGrade && a.section === assignSection && a.areaId === area.id
      );
      if (!exists) {
        newItems.push({
          id: `asg-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          level: assignLevel,
          grade: assignGrade,
          section: assignSection,
          areaId: area.id,
          areaCode: area.code,
          areaName: area.name
        });
      }
    });

    if (newItems.length === 0) {
      alert(`Todas las asignaturas regulares de ${assignGrade} sección ${assignSection} ya estaban añadidas.`);
      return;
    }

    setTempAssignments(prev => [...prev, ...newItems]);
  };

  const handleRemoveAssignment = (assignmentId: string) => {
    setTempAssignments(prev => prev.filter(a => a.id !== assignmentId));
  };

  const handleSaveAssignments = async () => {
    if (!assigningTeacher) return;
    setIsSavingAssignments(true);
    const success = await saveTeacherAssignments(assigningTeacher.id, tempAssignments);
    setIsSavingAssignments(false);
    if (success) {
      setAssignmentSuccessMsg(`¡Carga académica actualizada exitosamente para ${assigningTeacher.fullName}!`);
      setTimeout(() => {
        setAssigningTeacher(null);
      }, 1200);
    } else {
      alert('Hubo un inconveniente al guardar las cátedras. Intente nuevamente.');
    }
  };

  // Estado de códigos de registro
  const [selectedRoleForCode, setSelectedRoleForCode] = useState<'DOCENTE' | 'SECRETARIA'>('DOCENTE');
  const [codeDurationHours, setCodeDurationHours] = useState<number>(48);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [cleanMessage, setCleanMessage] = useState<string | null>(null);

  // Toggle de roles adicionales
  const toggleAdditionalRole = (role: UserRole) => {
    setNewAdditionalRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  // Toggle de niveles asignados
  const toggleLevel = (lvl: EducationalLevel) => {
    setNewSelectedLevels(prev => {
      let next: EducationalLevel[];
      if (prev.includes(lvl)) {
        if (prev.length === 1) return prev;
        next = prev.filter(l => l !== lvl);
      } else {
        next = [...prev, lvl];
      }
      if (!next.includes(newDefaultLevel)) {
        setNewDefaultLevel(next[0]);
      }
      return next;
    });
  };

  // Mapa de estudiantes por cédula o username normalizado
  const studentsMap = useMemo(() => {
    const map = new Map<string, Student>();
    students.forEach(s => {
      if (s.cedula) {
        map.set(normalizeCedulaUsername(s.cedula), s);
      }
    });
    return map;
  }, [students]);

  // Estudiantes inscritos en matrícula sin cuenta de usuario
  const missingStudents = useMemo(() => {
    return students.filter(s => {
      if (!s.cedula) return false;
      const normCed = normalizeCedulaUsername(s.cedula);
      return normCed && !users.some(u => normalizeCedulaUsername(u.username) === normCed || (u.cedula && normalizeCedulaUsername(u.cedula) === normCed));
    });
  }, [students, users]);

  // Grados disponibles para filtro de estudiantes
  const availableStudentGrades = useMemo(() => {
    const gradesSet = new Set<string>();
    students.forEach(s => {
      if (s.grade && (studentLevelFilter === 'TODOS' || s.level === studentLevelFilter)) {
        gradesSet.add(s.grade);
      }
    });
    users.forEach(u => {
      if (u.role === 'ESTUDIANTE' && u.grade && (studentLevelFilter === 'TODOS' || u.defaultLevel === studentLevelFilter)) {
        gradesSet.add(u.grade);
      }
    });
    if (gradesSet.size === 0) {
      if (studentLevelFilter === 'MEDIA_GENERAL') return ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'];
      if (studentLevelFilter === 'PRIMARIA') return ['1er Grado', '2do Grado', '3er Grado', '4to Grado', '5to Grado', '6to Grado'];
      if (studentLevelFilter === 'INICIAL') return ['Sala de 3 Años', 'Sala de 4 Años', 'Sala de 5 Años'];
      return ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'];
    }
    return Array.from(gradesSet);
  }, [students, users, studentLevelFilter]);

  const handleSyncStudentAccounts = async () => {
    setIsSyncingStudents(true);
    setSyncFeedbackMsg(null);
    try {
      const res = await syncStudentUsers();
      if (res.created > 0 || res.updated > 0) {
        setSyncFeedbackMsg(`¡Sincronización completada! Se crearon ${res.created} cuenta(s) y se actualizaron ${res.updated}.`);
      } else {
        setSyncFeedbackMsg('Todas las cuentas de estudiantes están al día con la matrícula escolar.');
      }
    } catch (err) {
      console.error(err);
      setSyncFeedbackMsg('Ocurrió un inconveniente al sincronizar las cuentas de estudiantes.');
    } finally {
      setIsSyncingStudents(false);
      setTimeout(() => setSyncFeedbackMsg(null), 4000);
    }
  };

  // Conteo de usuarios por rol
  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {
      TODOS: users.length,
      ADMINISTRADOR: 0,
      DIRECTOR: 0,
      COORDINACION: 0,
      DOCENTE: 0,
      SECRETARIA: 0,
      REPRESENTANTE: 0,
      ESTUDIANTE: 0
    };

    users.forEach(u => {
      if (counts[u.role] !== undefined) {
        counts[u.role]++;
      } else {
        counts[u.role] = 1;
      }
    });

    return counts;
  }, [users]);

  // Lista de usuarios filtrada
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const isStudent = u.role === 'ESTUDIANTE';

      const matchesRole =
        selectedRoleFilter === 'TODOS' ||
        u.role === selectedRoleFilter ||
        (u.roles && u.roles.includes(selectedRoleFilter));

      if (!matchesRole) return false;

      // Filtros específicos cuando se visualizan Estudiantes
      if (selectedRoleFilter === 'ESTUDIANTE' || isStudent) {
        if (selectedRoleFilter === 'ESTUDIANTE') {
          if (studentLevelFilter !== 'TODOS' && u.defaultLevel !== studentLevelFilter) {
            return false;
          }
          if (studentGradeFilter !== 'TODOS' && u.grade !== studentGradeFilter) {
            return false;
          }
          if (studentSectionFilter !== 'TODAS' && u.section !== studentSectionFilter) {
            return false;
          }
        }
      }

      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;

      const normCedula = normalizeCedulaUsername(searchQuery);
      const qDigits = searchQuery.replace(/[^0-9]/g, '');

      return (
        u.fullName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.cedula && u.cedula.toLowerCase().includes(q)) ||
        (normCedula && normalizeCedulaUsername(u.username) === normCedula) ||
        (qDigits && u.username.replace(/[^0-9]/g, '').includes(qDigits)) ||
        (u.grade && u.grade.toLowerCase().includes(q)) ||
        (u.section && u.section.toLowerCase() === q)
      );
    });
  }, [users, selectedRoleFilter, searchQuery, studentLevelFilter, studentGradeFilter, studentSectionFilter]);

  // Manejar creación de nuevo usuario
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccessMessage('');
    setFormErrorMessage('');

    const cleanFullName = newFullName.trim();
    const cleanUsername = newUsername.trim().toLowerCase();
    const cleanEmail = newEmail.trim().toLowerCase();

    if (!cleanFullName || !cleanUsername || !cleanEmail || !newPassword.trim()) {
      setFormErrorMessage('Por favor complete todos los campos obligatorios (*).');
      return;
    }

    if (newPassword.length < 6) {
      setFormErrorMessage('La contraseña debe tener un mínimo de 6 caracteres.');
      return;
    }

    const userExists = users.some(
      u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanEmail
    );
    if (userExists) {
      setFormErrorMessage('El nombre de usuario o correo institucional ya está registrado.');
      return;
    }

    try {
      const avatar = getDefaultAvatarForUser({
        gender: newGender,
        role: newRole,
        fullName: cleanFullName
      });

      await addUser({
        fullName: cleanFullName,
        username: cleanUsername,
        email: cleanEmail,
        password: newPassword,
        role: newRole,
        roles: newAdditionalRoles.length > 0 ? newAdditionalRoles : undefined,
        gender: newGender,
        defaultLevel: newDefaultLevel,
        allowedLevels: newSelectedLevels,
        grade: newRole === 'ESTUDIANTE' ? newStudentGrade : undefined,
        section: newRole === 'ESTUDIANTE' ? newStudentSection : undefined,
        active: true,
        avatarUrl: avatar
      });

      setFormSuccessMessage(`¡Usuario @${cleanUsername} registrado exitosamente con rol ${newRole}!`);
      setNewFullName('');
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setNewAdditionalRoles([]);
      setTimeout(() => setFormSuccessMessage(''), 4000);
    } catch (err) {
      console.error(err);
      setFormErrorMessage('Error al guardar el nuevo usuario en el sistema.');
    }
  };

  // Manejar apertura de edición de usuario
  const handleOpenEditUser = (user: AppUser) => {
    setEditingUser(user);
    setEditPrimaryRole(user.role);
    setEditAdditionalRoles(user.roles ? [...user.roles] : []);
    setEditAllowedLevels(user.allowedLevels ? [...user.allowedLevels] : [user.defaultLevel || 'MEDIA_GENERAL']);
    setEditStudentGrade(user.grade || '1er Año');
    setEditStudentSection(user.section || 'A');
    setEditPassword('');
    setShowEditPassword(false);
    setEditSuccessMsg('');
    setEditModalTab('ROLES');
  };

  const toggleEditAdditionalRole = (role: UserRole) => {
    setEditAdditionalRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const toggleEditLevel = (lvl: EducationalLevel) => {
    setEditAllowedLevels(prev => {
      if (prev.includes(lvl)) {
        if (prev.length === 1) return prev;
        return prev.filter(l => l !== lvl);
      }
      return [...prev, lvl];
    });
  };

  // Manejar guardado de cambios de usuario (roles, subsistemas y/o contraseña)
  const handleSaveUserEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (editPassword.trim() && editPassword.trim().length < 6) {
      alert('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const updates: Partial<AppUser> = {
      role: editPrimaryRole,
      roles: editAdditionalRoles.filter(r => r !== editPrimaryRole),
      allowedLevels: editAllowedLevels,
      defaultLevel: editAllowedLevels[0] || editingUser.defaultLevel
    };

    if (editPrimaryRole === 'ESTUDIANTE') {
      updates.grade = editStudentGrade;
      updates.section = editStudentSection;
    }

    if (editPassword.trim()) {
      updates.password = editPassword.trim();
    }

    try {
      await updateUser(editingUser.id, updates);
      setEditSuccessMsg(`¡Usuario @${editingUser.username} actualizado con éxito!`);
      setTimeout(() => {
        setEditingUser(null);
        setEditSuccessMsg('');
      }, 1200);
    } catch (err) {
      console.error(err);
      alert('Error al guardar los cambios del usuario.');
    }
  };

  // Lista de categorías de roles para filtros y agrupamiento
  const ROLE_CATEGORIES: { id: UserRole; title: string; color: string; bg: string; icon: any }[] = [
    { id: 'ADMINISTRADOR', title: 'Administradores', color: 'text-red-700 dark:text-red-300', bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50', icon: ShieldCheck },
    { id: 'DIRECTOR', title: 'Directores', color: 'text-purple-700 dark:text-purple-300', bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/50', icon: Briefcase },
    { id: 'COORDINACION', title: 'Coordinación UCE', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50', icon: UserCheck },
    { id: 'DOCENTE', title: 'Cuerpo Docente', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50', icon: BookOpen },
    { id: 'SECRETARIA', title: 'Secretaría', color: 'text-indigo-700 dark:text-indigo-300', bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/50', icon: Layers },
    { id: 'REPRESENTANTE', title: 'Representantes', color: 'text-cyan-700 dark:text-cyan-300', bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-900/50', icon: Users },
    { id: 'ESTUDIANTE', title: 'Estudiantes', color: 'text-teal-700 dark:text-teal-300', bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900/50', icon: GraduationCap }
  ];

  return (
    <div className="space-y-6">
      {/* Banner Principal de Gestión de Usuarios y Roles */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1B1C33] via-[#242646] to-[#2C2E53] rounded-2xl text-white shadow-xl border border-[#D4AF37]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-black shadow-inner shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black tracking-wide text-white">
                Gestión Central de Usuarios y Roles
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-black uppercase">
                Exclusivo Admin
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Directorio institucional clasificado por roles, emisión de credenciales y códigos de autorización.
            </p>
          </div>
        </div>

        {/* Pestañas de Vista Rápida */}
        <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-xl border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('DIRECTORIO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'DIRECTORIO'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Directorio ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('NUEVO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'NUEVO'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Nuevo Usuario</span>
          </button>
          <button
            onClick={() => setActiveTab('CODIGOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'CODIGOS'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Códigos ({registrationCodes.length})</span>
          </button>
        </div>
      </div>

      {/* Grid de Resumen Estadístico por Rol */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        <button
          onClick={() => setSelectedRoleFilter('TODOS')}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
            selectedRoleFilter === 'TODOS'
              ? 'bg-[#1B1C33] text-white border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider opacity-80">Todos</span>
            <Users className="w-3.5 h-3.5 opacity-70" />
          </div>
          <span className="text-xl font-black mt-2">{roleCounts.TODOS}</span>
        </button>

        {ROLE_CATEGORIES.map(cat => {
          const isSelected = selectedRoleFilter === cat.id;
          const count = roleCounts[cat.id] || 0;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedRoleFilter(cat.id)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#1B1C33] text-white border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider truncate" title={cat.title}>
                  {cat.id === 'ESTUDIANTE' ? 'ALUMNOS' : cat.id.slice(0, 5)}
                </span>
                <Icon className="w-3.5 h-3.5 opacity-70 shrink-0" />
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xl font-black">{count}</span>
                <span className="text-[9px] opacity-70 font-semibold">{cat.title.split(' ')[0]}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* VISTA 1: DIRECTORIO DE USUARIOS CLASIFICADO POR ROLES */}
      {activeTab === 'DIRECTORIO' && (
        <div className="space-y-4">
          {/* Mensaje de retroalimentación de sincronización */}
          {syncFeedbackMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{syncFeedbackMsg}</span>
              </div>
            </div>
          )}

          {/* Banner de Sincronización si hay estudiantes de matrícula sin cuenta */}
          {missingStudents.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-amber-950 dark:text-amber-200">
                    Estudiantes de Matrícula Pendientes por Cuenta ({missingStudents.length})
                  </h4>
                  <p className="text-[11px] text-amber-800 dark:text-amber-400">
                    Existen {missingStudents.length} estudiantes inscritos en el plantel que aún no cuentan con usuario institucional generado.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSyncStudentAccounts}
                disabled={isSyncingStudents}
                className="px-3.5 py-2 bg-gradient-to-r from-[#1E2038] to-[#2C2E53] hover:from-[#151627] hover:to-[#222442] text-[#D4AF37] border border-[#D4AF37]/40 font-black rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 disabled:opacity-60"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                <span>{isSyncingStudents ? 'Sincronizando...' : 'Generar Cuentas de Estudiantes'}</span>
              </button>
            </div>
          )}

          {/* Barra de Filtros Específicos para Estudiantes */}
          {selectedRoleFilter === 'ESTUDIANTE' && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {/* Selector de Nivel */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(['TODOS', 'MEDIA_GENERAL', 'PRIMARIA', 'INICIAL'] as ('TODOS' | EducationalLevel)[]).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        setStudentLevelFilter(lvl);
                        setStudentGradeFilter('TODOS');
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                        studentLevelFilter === lvl
                          ? 'bg-[#1B1C33] text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      {lvl === 'TODOS' ? 'Todos' : lvl === 'MEDIA_GENERAL' ? 'Media General' : lvl === 'PRIMARIA' ? 'Primaria' : 'Inicial'}
                    </button>
                  ))}
                </div>

                {/* Selector de Grado / Año */}
                <select
                  value={studentGradeFilter}
                  onChange={e => setStudentGradeFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-[11px] text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
                >
                  <option value="TODOS">Todos los Años / Grados</option>
                  {availableStudentGrades.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>

                {/* Selector de Sección - Exclusivamente A y B (Regla 4) */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(['TODAS', 'A', 'B'] as ('TODAS' | 'A' | 'B')[]).map(sec => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setStudentSectionFilter(sec)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                        studentSectionFilter === sec
                          ? 'bg-[#1B1C33] text-[#D4AF37] border border-[#D4AF37]/50 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      {sec === 'TODAS' ? 'Sec. A y B' : `Sec. ${sec}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón de Sincronización Manual */}
              <button
                type="button"
                onClick={handleSyncStudentAccounts}
                disabled={isSyncingStudents}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#D4AF37] text-slate-700 dark:text-slate-200 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer self-start md:self-auto disabled:opacity-60"
                title="Verificar y sincronizar cuentas de estudiantes inscritos en matrícula"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#D4AF37] ${isSyncingStudents ? 'animate-spin' : ''}`} />
                <span>{isSyncingStudents ? 'Sincronizando...' : 'Sincronizar Matrícula'}</span>
              </button>
            </div>
          )}

          {/* Barra de Búsqueda y Filtros */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar por nombre, usuario, cédula o correo..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Mostrando {filteredUsers.length} de {users.length} usuarios
              </span>
              {selectedRoleFilter !== 'TODOS' && (
                <button
                  onClick={() => setSelectedRoleFilter('TODOS')}
                  className="text-xs font-bold text-[#D4AF37] hover:underline cursor-pointer"
                >
                  (Limpiar filtro)
                </button>
              )}
            </div>
          </div>

          {/* Listado agrupado por categorías de roles si el filtro es TODOS, o plano si hay filtro específico */}
          {filteredUsers.length === 0 ? (
            <div className="p-10 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto opacity-80" />
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">No se encontraron usuarios</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No existen cuentas registradas que coincidan con el rol o criterio de búsqueda ingresado.
              </p>
            </div>
          ) : selectedRoleFilter !== 'TODOS' ? (
            /* Vista de Rol Específico */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredUsers.map(user => {
                const normCed = normalizeCedulaUsername(user.username);
                const stu = studentsMap.get(normCed) || (user.cedula ? studentsMap.get(normalizeCedulaUsername(user.cedula)) : undefined);
                return (
                  <UserCard
                    key={user.id}
                    user={user}
                    student={stu}
                    currentUser={currentUser}
                    onEdit={() => handleOpenEditUser(user)}
                    onManageAssignments={() => handleOpenAssignments(user)}
                    onToggleStatus={() => {
                      if (user.username === 'admin' || user.id === currentUser?.id) {
                        alert('No es posible desactivar la cuenta principal de administrador.');
                        return;
                      }
                      const newStatus = !user.active;
                      if (confirm(`¿Confirma ${newStatus ? 'activar' : 'desactivar'} el acceso institucional para @${user.username}?`)) {
                        updateUser(user.id, { active: newStatus });
                      }
                    }}
                    onDelete={() => handleDeleteUser(user)}
                  />
                );
              })}
            </div>
          ) : (
            /* Vista Clasificada por Grupos de Roles */
            <div className="space-y-6">
              {ROLE_CATEGORIES.map(cat => {
                const groupUsers = filteredUsers.filter(u => u.role === cat.id);
                if (groupUsers.length === 0) return null;

                const Icon = cat.icon;

                return (
                  <div key={cat.id} className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${cat.bg}`}>
                          <Icon className={`w-4 h-4 ${cat.color}`} />
                        </div>
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                          {cat.title} ({groupUsers.length})
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {cat.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {groupUsers.map(user => {
                        const normCed = normalizeCedulaUsername(user.username);
                        const stu = studentsMap.get(normCed) || (user.cedula ? studentsMap.get(normalizeCedulaUsername(user.cedula)) : undefined);
                        return (
                          <UserCard
                            key={user.id}
                            user={user}
                            student={stu}
                            currentUser={currentUser}
                            onEdit={() => handleOpenEditUser(user)}
                            onManageAssignments={() => handleOpenAssignments(user)}
                            onToggleStatus={() => {
                              if (user.username === 'admin' || user.id === currentUser?.id) {
                                alert('No es posible desactivar la cuenta principal de administrador.');
                                return;
                              }
                              const newStatus = !user.active;
                              if (confirm(`¿Confirma ${newStatus ? 'activar' : 'desactivar'} el acceso institucional para @${user.username}?`)) {
                                updateUser(user.id, { active: newStatus });
                              }
                            }}
                            onDelete={() => handleDeleteUser(user)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VISTA 2: FORMULARIO DE NUEVO USUARIO INSTITUCIONAL */}
      {activeTab === 'NUEVO' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Registrar Nueva Cuenta en el Sistema
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Creación de credenciales con asignación de roles, subsistemas y permisos institucionales.
                </p>
              </div>
            </div>
          </div>

          {formSuccessMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{formSuccessMessage}</span>
            </div>
          )}

          {formErrorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formErrorMessage}</span>
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="sm:col-span-2 md:col-span-3">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Completo del Titular *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ej: Profa. Carmen Elena Villalobos"
                    value={newFullName}
                    onChange={e => setNewFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#2C2E53] outline-none font-medium text-slate-800 dark:text-slate-100"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de Usuario (Login) *
                </label>
                <input
                  type="text"
                  required
                  placeholder={newRole === 'REPRESENTANTE' || newRole === 'ESTUDIANTE' ? "Ej: V-18452991 ó 18452991" : "Ej: cvillalobos"}
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#2C2E53] outline-none font-mono text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico Institucional *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Ej: cvillalobos@bellasartes.edu.ve"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#2C2E53] outline-none text-slate-800 dark:text-slate-100"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Rol Principal Institucional *
                </label>
                <select
                  value={newRole}
                  onChange={e => {
                    const r = e.target.value as UserRole;
                    setNewRole(r);
                    setNewAdditionalRoles(prev => prev.filter(ar => ar !== r));
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#2C2E53] outline-none font-bold text-slate-800 dark:text-slate-100"
                >
                  <option value="DOCENTE">DOCENTE (Evaluación y Planificación)</option>
                  <option value="SECRETARIA">SECRETARIA (Asistencia y Conducta)</option>
                  <option value="COORDINACION">COORDINACION (Coordinación UCE)</option>
                  <option value="DIRECTOR">DIRECTOR (Dirección General)</option>
                  <option value="ADMINISTRADOR">ADMINISTRADOR (Administrador de Sistemas)</option>
                  <option value="REPRESENTANTE">REPRESENTANTE (Padre / Tutor)</option>
                  <option value="ESTUDIANTE">ESTUDIANTE (Alumno Regular)</option>
                </select>
              </div>

              {/* Si el rol es ESTUDIANTE: Selección de Grado y Sección Oficial */}
              {newRole === 'ESTUDIANTE' && (
                <div className="sm:col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-teal-500/10 dark:bg-teal-950/20 p-3.5 rounded-xl border border-teal-400/30 animate-in fade-in">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Grado / Año Escolar *
                    </label>
                    <select
                      value={newStudentGrade}
                      onChange={e => setNewStudentGrade(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100 outline-none"
                    >
                      {LEVEL_GRADES_CATALOG[newDefaultLevel].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Sección Oficial * (Exclusivamente A y B)
                    </label>
                    <select
                      value={newStudentSection}
                      onChange={e => setNewStudentSection(e.target.value as 'A' | 'B')}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100 outline-none"
                    >
                      <option value="A">Sección A</option>
                      <option value="B">Sección B</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Roles Adicionales */}
              <div className="sm:col-span-2 md:col-span-3 space-y-2 bg-amber-500/10 dark:bg-amber-950/20 p-3.5 rounded-xl border border-amber-400/30">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-slate-900 dark:text-slate-100 text-xs">
                      Funciones o Roles Adicionales Simultáneos (Agrupación de Privilegios)
                    </label>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Permite otorgar privilegios cruzados (ej. docente que a la vez es representante).
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-900 dark:text-amber-300 bg-amber-200 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                    {newAdditionalRoles.length} adicionales
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {(['DOCENTE', 'SECRETARIA', 'REPRESENTANTE', 'COORDINACION'] as UserRole[])
                    .filter(r => r !== newRole)
                    .map(r => {
                      const isChecked = newAdditionalRoles.includes(r);
                      return (
                        <button
                          type="button"
                          key={r}
                          onClick={() => toggleAdditionalRole(r)}
                          className={`p-2 rounded-xl border text-left transition flex items-center justify-between gap-1.5 cursor-pointer ${
                            isChecked
                              ? 'bg-[#1B1C33] text-[#D4AF37] border-[#D4AF37] shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                          }`}
                        >
                          <span className="text-xs font-bold truncate">{r}</span>
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                              isChecked
                                ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37]'
                                : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Subsistemas Asignados */}
              <div className="sm:col-span-2 md:col-span-2 space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                    Subsistemas / Niveles Educativos Asignados *
                  </label>
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                    {newSelectedLevels.length} seleccionados
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'MEDIA_GENERAL' as EducationalLevel, title: 'Media General', scale: '01 a 20 pts', icon: GraduationCap },
                    { id: 'PRIMARIA' as EducationalLevel, title: 'Primaria', scale: 'Literal A-E', icon: Layers },
                    { id: 'INICIAL' as EducationalLevel, title: 'Inicial', scale: 'Cualitativa L/EP/I', icon: BookOpen }
                  ].map(item => {
                    const isChecked = newSelectedLevels.includes(item.id);
                    const Icon = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => toggleLevel(item.id)}
                        className={`p-2 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                          isChecked
                            ? 'bg-[#1B1C33] text-white border-[#D4AF37] shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isChecked ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate">{item.title}</p>
                            <p className={`text-[10px] truncate ${isChecked ? 'text-[#D4AF37]' : 'text-slate-400'}`}>
                              {item.scale}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                            isChecked ? 'bg-[#D4AF37] border-[#D4AF37] text-slate-950' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sexo */}
              <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sexo (Para Avatar Institucional) *
                  </label>
                  <select
                    value={newGender}
                    onChange={e => setNewGender(e.target.value as 'MASCULINO' | 'FEMENINO')}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100"
                  >
                    <option value="FEMENINO">Femenino (Mujer)</option>
                    <option value="MASCULINO">Masculino (Hombre)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nivel Principal de Entrada:
                  </label>
                  <select
                    value={newDefaultLevel}
                    onChange={e => setNewDefaultLevel(e.target.value as EducationalLevel)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100"
                  >
                    {newSelectedLevels.map(lvl => (
                      <option key={lvl} value={lvl}>
                        {lvl === 'MEDIA_GENERAL' ? 'Media General' : lvl === 'PRIMARIA' ? 'Primaria' : 'Inicial'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contraseña */}
              <div className="sm:col-span-2 md:col-span-3 space-y-1 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contraseña Inicial *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Ingrese o genere una contraseña robusta"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-100 outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <PasswordStrengthBar
                  password={newPassword}
                  onGeneratePassword={gen => setNewPassword(gen)}
                  showGeneratorButton={true}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('DIRECTORIO')}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 font-bold"
              >
                Volver al Directorio
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-[#2C2E53] via-[#242646] to-[#1B1C33] hover:from-[#353866] hover:to-[#242646] text-[#D4AF37] border border-[#D4AF37]/50 font-black rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Registrar y Activar Cuenta</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VISTA 3: GESTIÓN DE CÓDIGOS DE AUTORIZACIÓN PARA AUTO-REGISTRO */}
      {activeTab === 'CODIGOS' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E2038] to-[#2C2E53] border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Códigos de Autorización de Un Solo Uso
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Emita códigos de auto-registro para que nuevos docentes y personal creen sus credenciales de forma autónoma.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedRoleForCode}
                onChange={e => setSelectedRoleForCode(e.target.value as 'DOCENTE' | 'SECRETARIA')}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-500/40 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
                title="Rol asignado al código"
              >
                <option value="DOCENTE">Rol: DOCENTE</option>
                <option value="SECRETARIA">Rol: SECRETARIA</option>
              </select>

              <select
                value={codeDurationHours}
                onChange={e => setCodeDurationHours(Number(e.target.value))}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                title="Plazo de caducidad automática"
              >
                <option value={24}>Caducidad: 24 Horas</option>
                <option value={48}>Caducidad: 48 Horas (Recomendado)</option>
                <option value={72}>Caducidad: 72 Horas (3 Días)</option>
                <option value={168}>Caducidad: 7 Días (1 Semana)</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  const newC = createRegistrationCode(selectedRoleForCode, codeDurationHours);
                  setCopiedCodeId(newC.id);
                  navigator.clipboard.writeText(newC.code).catch(() => {});
                  setTimeout(() => setCopiedCodeId(null), 3000);
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#1E2038] to-[#2C2E53] hover:from-[#151627] hover:to-[#222442] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-black rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                <span>Generar Código</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const cleaned = cleanExpiredRegistrationCodes();
                  setCleanMessage(cleaned > 0 ? `Se depuraron ${cleaned} código(s) caducados.` : 'No hay códigos caducados pendientes por depurar.');
                  setTimeout(() => setCleanMessage(null), 3500);
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Eliminar de inmediato códigos que ya sobrepasaron su plazo de expiración"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Depurar Caducados</span>
              </button>
            </div>
          </div>

          {cleanMessage && (
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-600" />
              <span>{cleanMessage}</span>
            </div>
          )}

          {/* Listado de Códigos Activos */}
          {registrationCodes.length === 0 ? (
            <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                No hay códigos de autorización activos pendientes por uso. Haga clic en "Generar Código" para emitir uno.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {registrationCodes.map(code => {
                const isCopied = copiedCodeId === code.id;
                const isExpired = code.expiresAt ? new Date(code.expiresAt).getTime() < Date.now() : false;
                const remainingHours = code.expiresAt ? Math.max(0, Math.round((new Date(code.expiresAt).getTime() - Date.now()) / (3600 * 1000))) : null;

                return (
                  <div
                    key={code.id}
                    className={`p-3.5 rounded-xl border shadow-xs flex items-center justify-between gap-2 transition ${
                      isExpired
                        ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900/60'
                        : 'bg-white dark:bg-slate-850 border-amber-200 dark:border-amber-500/30'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <code className={`font-mono font-black text-xs tracking-wider ${
                          isExpired ? 'text-rose-700 dark:text-rose-400 line-through' : 'text-[#2C2E53] dark:text-amber-300'
                        }`}>
                          {code.code}
                        </code>
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                          code.allowedRole === 'SECRETARIA'
                            ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300'
                            : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                        }`}>
                          {code.allowedRole || 'TODOS'}
                        </span>

                        {isExpired ? (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-600 text-white animate-pulse">
                            CADUCADO
                          </span>
                        ) : remainingHours !== null ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700" title={`Expira el ${new Date(code.expiresAt!).toLocaleString()}`}>
                            ⏳ {remainingHours}h vigentes
                          </span>
                        ) : null}
                      </div>

                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isExpired ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                        <span>{isExpired ? 'Código vencido (inválido)' : 'Uso único disponible'}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!isExpired && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(code.code).catch(() => {});
                            setCopiedCodeId(code.id);
                            setTimeout(() => setCopiedCodeId(null), 2500);
                          }}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition shrink-0 cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                          title="Copiar código"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteRegistrationCode(code.id)}
                        className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-bold transition shrink-0 cursor-pointer"
                        title={isExpired ? "Depurar código vencido" : "Revocar código"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL DE EDICIÓN INTEGRAL DE USUARIO (ROLES, SUBSISTEMAS Y CONTRASEÑA) */}
      {editingUser && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl p-6 space-y-4 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={editingUser.avatarUrl || getDefaultAvatarForUser(editingUser)}
                  alt={editingUser.fullName}
                  className="w-10 h-10 rounded-xl object-contain border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-black text-base text-slate-900 dark:text-slate-100 truncate">
                    Editar Perfil & Roles de Usuario
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    @{editingUser.username} • {editingUser.fullName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {editSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{editSuccessMsg}</span>
              </div>
            )}

            {/* Pestañas de Navegación del Modal */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setEditModalTab('ROLES')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  editModalTab === 'ROLES'
                    ? 'bg-white dark:bg-slate-900 text-[#D4AF37] shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Roles Institucionales
              </button>
              <button
                type="button"
                onClick={() => setEditModalTab('SUBSISTEMAS')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  editModalTab === 'SUBSISTEMAS'
                    ? 'bg-white dark:bg-slate-900 text-[#D4AF37] shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Subsistemas
              </button>
              <button
                type="button"
                onClick={() => setEditModalTab('SEGURIDAD')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  editModalTab === 'SEGURIDAD'
                    ? 'bg-white dark:bg-slate-900 text-[#D4AF37] shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Contraseña & Acceso
              </button>
            </div>

            <form onSubmit={handleSaveUserEdits} className="space-y-4 text-xs flex-1 overflow-y-auto pr-1">
              {/* TAB 1: ROLES */}
              {editModalTab === 'ROLES' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Rol Principal Institucional *
                    </label>
                    <select
                      value={editPrimaryRole}
                      onChange={e => {
                        const r = e.target.value as UserRole;
                        setEditPrimaryRole(r);
                        setEditAdditionalRoles(prev => prev.filter(ar => ar !== r));
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#2C2E53] outline-none font-bold text-slate-800 dark:text-slate-100"
                    >
                      <option value="DOCENTE">DOCENTE (Evaluación y Planificación)</option>
                      <option value="SECRETARIA">SECRETARIA (Asistencia y Conducta)</option>
                      <option value="COORDINACION">COORDINACION (Coordinación UCE)</option>
                      <option value="DIRECTOR">DIRECTOR (Dirección General)</option>
                      <option value="ADMINISTRADOR">ADMINISTRADOR (Administrador de Sistemas)</option>
                      <option value="REPRESENTANTE">REPRESENTANTE (Padre / Tutor)</option>
                      <option value="ESTUDIANTE">ESTUDIANTE (Alumno Regular)</option>
                    </select>
                  </div>

                  {/* Campos específicos si el rol editado es ESTUDIANTE */}
                  {editPrimaryRole === 'ESTUDIANTE' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-teal-500/10 dark:bg-teal-950/20 p-3.5 rounded-xl border border-teal-400/30 animate-in fade-in">
                      <div>
                        <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                          Grado / Año Escolar *
                        </label>
                        <select
                          value={editStudentGrade}
                          onChange={e => setEditStudentGrade(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100 outline-none"
                        >
                          {(LEVEL_GRADES_CATALOG[editingUser?.defaultLevel || 'MEDIA_GENERAL'] || ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año']).map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                          Sección Oficial * (Exclusivamente A y B)
                        </label>
                        <select
                          value={editStudentSection}
                          onChange={e => setEditStudentSection(e.target.value as 'A' | 'B')}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100 outline-none"
                        >
                          <option value="A">Sección A</option>
                          <option value="B">Sección B</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Roles Adicionales Simultáneos */}
                  <div className="space-y-2 bg-amber-500/10 dark:bg-amber-950/20 p-3.5 rounded-2xl border border-amber-400/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block font-bold text-slate-900 dark:text-slate-100 text-xs">
                          Roles Adicionales / Perfiles Simultáneos (Multi-Rol)
                        </label>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          Habilita la conmutación ágil de rol sin tener que cerrar sesión (ej. Docente + Representante).
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-900 dark:text-amber-300 bg-amber-200 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                        {editAdditionalRoles.length} adicionales
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                      {(['DOCENTE', 'SECRETARIA', 'REPRESENTANTE', 'COORDINACION', 'DIRECTOR'] as UserRole[])
                        .filter(r => r !== editPrimaryRole)
                        .map(r => {
                          const isChecked = editAdditionalRoles.includes(r);
                          return (
                            <button
                              type="button"
                              key={r}
                              onClick={() => toggleEditAdditionalRole(r)}
                              className={`p-2 rounded-xl border text-left transition flex items-center justify-between gap-1.5 cursor-pointer ${
                                isChecked
                                  ? 'bg-[#1B1C33] text-[#D4AF37] border-[#D4AF37] shadow-xs'
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                              }`}
                            >
                              <span className="text-xs font-bold truncate">{r}</span>
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                                  isChecked
                                    ? 'bg-[#D4AF37] border-[#D4AF37] text-slate-950 font-black text-[10px]'
                                    : 'border-slate-400 dark:border-slate-500'
                                }`}
                              >
                                {isChecked && '✓'}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SUBSISTEMAS */}
              {editModalTab === 'SUBSISTEMAS' && (
                <div className="space-y-3">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Subsistemas Educativos Autorizados
                  </label>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Define los niveles escolares a los que este usuario tiene acceso dentro del plantel:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {(['INICIAL', 'PRIMARIA', 'MEDIA_GENERAL'] as EducationalLevel[]).map(lvl => {
                      const isChecked = editAllowedLevels.includes(lvl);
                      return (
                        <button
                          type="button"
                          key={lvl}
                          onClick={() => toggleEditLevel(lvl)}
                          className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                            isChecked
                              ? 'bg-amber-500/10 border-[#D4AF37] text-amber-900 dark:text-amber-300 shadow-xs'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs">
                              {lvl === 'INICIAL' ? 'Inicial' : lvl === 'PRIMARIA' ? 'Primaria' : 'Media General'}
                            </span>
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                                isChecked
                                  ? 'bg-[#D4AF37] border-[#D4AF37] text-slate-950 font-black text-[10px]'
                                  : 'border-slate-400 dark:border-slate-500'
                              }`}
                            >
                              {isChecked && '✓'}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {lvl === 'INICIAL' ? 'Salas 3 a 5 Años' : lvl === 'PRIMARIA' ? '1° a 6° Grado' : '1° a 5° Año Bachillerato'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: SEGURIDAD */}
              {editModalTab === 'SEGURIDAD' && (
                <div className="space-y-3">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Restablecer Contraseña (Opcional)
                  </label>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Deje este campo en blanco si no desea alterar la contraseña actual del usuario.
                  </p>
                  <div className="relative">
                    <input
                      type={showEditPassword ? 'text' : 'password'}
                      placeholder="Nueva contraseña (mínimo 6 caracteres)"
                      value={editPassword}
                      onChange={e => setEditPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-100 outline-none"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {editPassword && (
                    <PasswordStrengthBar
                      password={editPassword}
                      onGeneratePassword={gen => setEditPassword(gen)}
                      showGeneratorButton={true}
                    />
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-black rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL DE ASIGNACIÓN ACADÉMICA / DISTRIBUTIVO DE CÁTEDRA */}
      {assigningTeacher && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl p-6 space-y-4 max-h-[90vh] flex flex-col animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
                    Distributivo de Cátedras & Salones
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Docente: <strong className="text-slate-800 dark:text-slate-200">{assigningTeacher.fullName}</strong> (@{assigningTeacher.username})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAssigningTeacher(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {assignmentSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{assignmentSuccessMsg}</span>
              </div>
            )}

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-xs">
              {/* Formulario de Asignación Rápida Oficial */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Añadir Asignación Oficial</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Malla preconfigurada institucional
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  {/* Selector Nivel */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Nivel / Subsistema:
                    </label>
                    <select
                      value={assignLevel}
                      onChange={e => handleAssignLevelChange(e.target.value as EducationalLevel)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="INICIAL">Educación Inicial</option>
                      <option value="PRIMARIA">Educación Primaria</option>
                      <option value="MEDIA_GENERAL">Media General</option>
                    </select>
                  </div>

                  {/* Selector Grado */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Grado / Año:
                    </label>
                    <select
                      value={assignGrade}
                      onChange={e => setAssignGrade(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {LEVEL_GRADES_CATALOG[assignLevel].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {/* Selector Sección - Exclusivamente A y B (Regla 4) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Sección Oficial:
                    </label>
                    <select
                      value={assignSection}
                      onChange={e => setAssignSection(e.target.value as 'A' | 'B')}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="A">Sección A</option>
                      <option value="B">Sección B</option>
                    </select>
                  </div>

                  {/* Selector Materia / Área Curricular Oficial */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Área / Materia:
                    </label>
                    <select
                      value={assignAreaId}
                      onChange={e => setAssignAreaId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {areas.filter(a => a.level === assignLevel).map(a => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleAddAssignment}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Cátedra</span>
                  </button>

                  {(assignLevel === 'INICIAL' || assignLevel === 'PRIMARIA') && (
                    <button
                      type="button"
                      onClick={handleAssignFullGradePackage}
                      className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                      title="Asigna todas las materias regulares del grado con 1 clic (para docentes de aula)"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Asignar Paquete Regular de Grado</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Lista de Cátedras Actuales */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                    Cátedras Asignadas ({tempAssignments.length})
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {tempAssignments.length === 0 ? 'Sin asignaciones' : 'Organizadas por grado y sección'}
                  </span>
                </div>

                {tempAssignments.length === 0 ? (
                  <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 text-xs">
                    El docente no tiene cátedras asignadas. Utilice el selector preconfigurado para asignarle materias y salones oficiales.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tempAssignments.map(asg => (
                      <div
                        key={asg.id}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-between gap-2 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                            {asg.areaName}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="px-1.5 py-0.2 rounded font-extrabold text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              {asg.grade} • Sec. {asg.section}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">
                              {asg.areaCode}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveAssignment(asg.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition shrink-0 cursor-pointer"
                          title="Desasignar cátedra"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setAssigningTeacher(null)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSavingAssignments}
                onClick={handleSaveAssignments}
                className="px-5 py-2 bg-[#2C2E53] hover:bg-[#1B1C33] text-[#D4AF37] font-black rounded-xl shadow-md transition text-xs flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
              >
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>{isSavingAssignments ? 'Guardando...' : 'Guardar Cátedras'}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// Subcomponente: Tarjeta de Usuario Institucional
const UserCard: React.FC<{
  user: AppUser;
  student?: Student;
  currentUser: AppUser | null;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete?: () => void;
  onManageAssignments?: () => void;
}> = ({ user, student, currentUser, onEdit, onToggleStatus, onDelete, onManageAssignments }) => {
  const roleMeta = ROLE_METADATA[user.role];
  const isTeacher = user.role === 'DOCENTE' || (user.roles && user.roles.includes('DOCENTE'));
  const isStudent = user.role === 'ESTUDIANTE';
  const [copiedCredentials, setCopiedCredentials] = useState(false);

  const displayGrade = user.grade || student?.grade || (user.defaultLevel === 'MEDIA_GENERAL' ? '1er Año' : user.defaultLevel === 'PRIMARIA' ? '1er Grado' : 'Inicial');
  const displaySection = user.section || student?.section || 'A';
  const displayCedula = user.cedula || student?.cedula || user.username.toUpperCase();
  const rawDigits = displayCedula.replace(/[^0-9]/g, '') || 'cba2026';

  const handleCopyCredentials = () => {
    const text = `Credenciales de Acceso SICE-CBA\nEstudiante: ${user.fullName}\nUsuario: ${user.username}\nCédula: ${displayCedula}\nClave Inicial: ${rawDigits}\nGrado: ${displayGrade} Sección ${displaySection}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedCredentials(true);
    setTimeout(() => setCopiedCredentials(false), 2500);
  };

  return (
    <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md hover:border-[#D4AF37]/50 dark:hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between gap-3 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={user.avatarUrl || getDefaultAvatarForUser(user)}
            alt={user.fullName}
            className="w-11 h-11 rounded-xl object-contain border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-50 dark:bg-slate-800 p-0.5"
          />
          <div className="min-w-0">
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate leading-tight">
              {user.fullName}
            </h4>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate mt-0.5">
              <User className="w-3 h-3 text-slate-400 shrink-0" />
              <span>@{user.username}</span>
            </p>
          </div>
        </div>

        <span
          className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border shrink-0 ${
            roleMeta?.badgeBg || 'bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          {roleMeta?.badge || user.role}
        </span>
      </div>

      {/* Correo y Niveles */}
      <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
        {/* Datos específicos de Estudiante */}
        {isStudent ? (
          <div className="p-2.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60 space-y-2">
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <span className="px-2 py-0.5 rounded-lg font-black text-[10px] bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700/60 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{displayGrade} • Sección {displaySection}</span>
              </span>
              <span className="font-mono text-[10px] text-teal-800 dark:text-teal-300 font-bold px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800/50">
                {displayCedula}
              </span>
            </div>

            {student?.representativeName && (
              <p className="text-[10px] text-slate-600 dark:text-slate-300 flex items-center gap-1 truncate" title={`Representante: ${student.representativeName}`}>
                <Users className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">Rep: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{student.representativeName}</strong></span>
              </p>
            )}

            <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-teal-200/60 dark:border-teal-900/60 text-[10px]">
              <span className="font-mono text-slate-600 dark:text-slate-400">
                Clave inicial: <strong className="text-slate-900 dark:text-slate-100 font-mono font-black">{rawDigits}</strong>
              </span>
              <button
                type="button"
                onClick={handleCopyCredentials}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer shrink-0 ${
                  copiedCredentials
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-200 border-teal-300 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/40'
                }`}
                title="Copiar credenciales de acceso institucional"
              >
                {copiedCredentials ? (
                  <>
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 truncate">
            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{user.email || 'Sin correo asignado'}</span>
          </div>
        )}

        {/* Roles adicionales */}
        {!isStudent && user.roles && user.roles.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap pt-0.5">
            <span className="text-[9px] font-bold text-slate-400">Funciones:</span>
            {user.roles.map(r => (
              <span
                key={r}
                className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400/15 text-amber-900 dark:text-amber-300 border border-amber-400/30"
              >
                +{r}
              </span>
            ))}
          </div>
        )}

        {/* Subsistemas asignados */}
        {!isStudent && user.allowedLevels && user.allowedLevels.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap pt-0.5">
            {user.allowedLevels.map(lvl => (
              <span
                key={lvl}
                className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${
                  lvl === user.defaultLevel
                    ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700/60'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {lvl === 'MEDIA_GENERAL' ? 'Media General' : lvl === 'PRIMARIA' ? 'Primaria' : 'Inicial'}
                {lvl === user.defaultLevel && ' ★'}
              </span>
            ))}
          </div>
        )}
        {/* Cátedras Asignadas para Docente */}
        {isTeacher && (
          <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-indigo-500" />
              <span>Cátedras: {user.academicAssignments?.length || 0}</span>
            </span>
            {user.academicAssignments && user.academicAssignments.length > 0 && (
              <span
                className="text-[9px] font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.2 rounded border border-indigo-200 dark:border-indigo-800/50 truncate max-w-[170px]"
                title={user.academicAssignments.map(a => `${a.areaName} (${a.grade} ${a.section})`).join(', ')}
              >
                {user.academicAssignments.map(a => `${a.grade.replace(' Grado','G').replace(' Año','A').replace('Sala de ','S')}${a.section}`).slice(0, 3).join(', ')}
                {user.academicAssignments.length > 3 && ` +${user.academicAssignments.length - 3}`}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Botones de Gestión */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1 text-[10px] font-bold">
          <span className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          <span className={user.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
            {user.active ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {isTeacher && onManageAssignments && (
            <button
              type="button"
              onClick={onManageAssignments}
              className="p-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition cursor-pointer flex items-center gap-1 text-[11px] font-bold"
              title="Gestionar Cátedras y Salones Oficiales"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Cátedras</span>
            </button>
          )}
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            title="Resetear contraseña"
          >
            <Key className="w-3.5 h-3.5 text-amber-600" />
          </button>
          {user.username !== 'admin' && user.id !== currentUser?.id && (
            <>
              <button
                type="button"
                onClick={onToggleStatus}
                className={`p-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                  user.active
                    ? 'border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-red-950/30 text-rose-600 hover:bg-rose-100'
                    : 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 hover:bg-emerald-100'
                }`}
                title={user.active ? 'Desactivar cuenta' : 'Activar cuenta'}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 transition cursor-pointer"
                  title="Eliminar usuario definitivamente"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
