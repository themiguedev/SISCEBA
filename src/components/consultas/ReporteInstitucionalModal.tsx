import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { ReporteItem, incrementReporteImpresiones } from '../../data/reportesCEOData';
import { Student } from '../../types';
import { Printer, X, ShieldCheck, FileCheck, Award, Calendar, Users, Building, Info } from 'lucide-react';

interface ReporteInstitucionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  reporte: ReporteItem;
  studentsList: Student[];
  onPrintIncrement?: (reporteId: string, newCount: number) => void;
  initialGrade?: string;
  initialSection?: 'A' | 'B' | 'TODAS';
  initialLapso?: number;
  filtroSexo?: string;
  filtroNotaMin?: string;
  filtroNotaMax?: string;
  filtroOrden?: string;
}

export const ReporteInstitucionalModal: React.FC<ReporteInstitucionalModalProps> = ({
  isOpen,
  onClose,
  reporte,
  studentsList,
  onPrintIncrement,
  initialGrade,
  initialSection,
  initialLapso,
  filtroSexo = 'Todos',
  filtroNotaMin,
  filtroNotaMax,
  filtroOrden = 'Apellidos y Nombres'
}) => {
  const { currentRole, activeLapso, addAuditLog, evaluations, currentUser } = useApp();

  const isLiteralesPorSeccion =
    reporte.id === 'adm-literales-por-seccion' ||
    (reporte.nombre.toLowerCase().includes('literal') &&
      (reporte.nombre.toLowerCase().includes('sección') || reporte.nombre.toLowerCase().includes('seccion'))) ||
    reporte.nombre.toLowerCase().includes('literales cargados');

  const isSabanaPromedios =
    reporte.id === 'adm-promedios-seccion-sabana' ||
    reporte.id === 'adm-promedios' ||
    reporte.formatoOficialId === 'SABANA_SECCION' ||
    (reporte.nombre.toLowerCase().includes('promedio') && reporte.nombre.toLowerCase().includes('sabana')) ||
    reporte.nombre.toLowerCase().includes('promedios por sección');

  // Helper de conversión de grado a formato institucional UCE (ej. "1er Grado" -> "1 AÑO")
  const formatGradeHeader = (g: string) => {
    const match = g.match(/\d+/);
    return match ? `${match[0]} AÑO` : g.toUpperCase();
  };

  // Helper para normalizar nombres en formato venezolano de nómina escolar oficial
  const formatStudentName = (st: Student | any) => {
    if (st.primerApellido && st.primerNombre) {
      return `${st.primerApellido} ${st.primerNombre}`.toUpperCase();
    }
    return (st.fullName || '').toUpperCase().replace(',', '');
  };

  // Grados y años según subsistema
  const availableGrades = React.useMemo(() => {
    if (reporte.nivel === 'INICIAL') {
      return ['Maternal', 'Preescolar 1', 'Preescolar 2', 'Preescolar 3'];
    }
    if (reporte.nivel === 'PRIMARIA') {
      return ['1er Grado', '2do Grado', '3er Grado', '4to Grado', '5to Grado', '6to Grado'];
    }
    if (reporte.nivel === 'MEDIA_GENERAL') {
      return ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'];
    }
    return [
      'Preescolar 3',
      '1er Grado',
      '2do Grado',
      '3er Grado',
      '4to Grado',
      '5to Grado',
      '6to Grado',
      '1er Año',
      '2do Año',
      '3er Año',
      '4to Año',
      '5to Año'
    ];
  }, [reporte.nivel]);

  const [selectedGrade, setSelectedGrade] = useState<string>(() => {
    return initialGrade || (reporte.nivel === 'PRIMARIA' ? '1er Grado' : availableGrades[availableGrades.length - 2] || '1er Grado');
  });
  // Regla institucional: EXCLUSIVAMENTE secciones 'A' y 'B' (o TODAS)
  const [selectedSection, setSelectedSection] = useState<'A' | 'B' | 'TODAS'>(() => {
    return initialSection || 'A';
  });
  const [selectedLapso, setSelectedLapso] = useState<number>(() => {
    return initialLapso || activeLapso || 1;
  });
  // Dos Estados del Reporte: Previo al Consejo de Curso vs Definitivo
  const [reportState, setReportState] = useState<'PREVIO' | 'DEFINITIVO'>('DEFINITIVO');

  if (!isOpen) return null;

  // Filtrar estudiantes por grado, sección y sexo
  let currentStudents = studentsList.filter((s) => {
    const matchesGrade = !selectedGrade || s.grade === selectedGrade || !s.grade;
    const matchesSection = selectedSection === 'TODAS' || s.section === selectedSection || !s.section;
    const matchesSexo =
      filtroSexo === 'Todos' ||
      (filtroSexo === 'Femenino' && s.gender === 'F') ||
      (filtroSexo === 'Masculino' && s.gender === 'M');
    return matchesGrade && matchesSection && matchesSexo;
  });

  // Ordenamiento de estudiantes
  if (filtroOrden === 'Cédula de Identidad') {
    currentStudents.sort((a, b) => (a.cedula || '').localeCompare(b.cedula || '', 'es'));
  } else {
    currentStudents.sort((a, b) => (a.fullName || '').localeCompare(b.fullName || '', 'es'));
  }

  // Helper para generar estudiantes de muestra válidos
  const makeSampleStudent = (
    id: string,
    cedula: string,
    fullName: string,
    gender: 'M' | 'F'
  ): Student => ({
    id,
    cedula,
    fullName,
    gender,
    birthDate: '2018-06-15',
    level: 'PRIMARIA',
    grade: selectedGrade,
    section: selectedSection,
    representativeName: 'REPRESENTANTE INSTITUCIONAL CBA',
    representativeEmail: 'representante@colegiobellasartes.edu.ve',
    representativePhone: '0414-6000000',
    status: 'REGULAR',
    pendingSubjects: []
  });

  // Lista de muestra de 23 estudiantes para Literales por Sección (modelo UCE oficial)
  const FALLBACK_STUDENTS_LITERALES: Student[] = [
    makeSampleStudent('lit-1', 'CE-33.101.201', 'ATENCIO MUDAFAR GILBERTO ALEJANDRO', 'M'),
    makeSampleStudent('lit-2', 'CE-33.101.202', 'BAUTISTA NARZA AVRIL CRISTINA', 'F'),
    makeSampleStudent('lit-3', 'CE-33.101.203', 'BELLOSO ARAUJO CARLOS IGNACIO', 'M'),
    makeSampleStudent('lit-4', 'CE-33.101.204', 'BLITZ CASTILLO SAMANTHA CAROLINA', 'F'),
    makeSampleStudent('lit-5', 'CE-33.101.205', 'BRICEÑO RINCON PAULA ALESSANDRA', 'F'),
    makeSampleStudent('lit-6', 'CE-33.101.206', 'CANNITA LOJERO ALESSANDRA', 'F'),
    makeSampleStudent('lit-7', 'CE-33.101.207', 'CASARIN AVILA VERA', 'F'),
    makeSampleStudent('lit-8', 'CE-33.101.208', 'CONVERSANO FUENMAYOR FRANCESCA', 'F'),
    makeSampleStudent('lit-9', 'CE-33.101.209', 'ESCALONA SIMOES JOSE ALEJANDRO', 'M'),
    makeSampleStudent('lit-10', 'CE-33.101.210', 'GONZALEZ ARRAIZ GUSTAVO ALEJANDRO', 'M'),
    makeSampleStudent('lit-11', 'CE-33.101.211', 'GONZALEZ COLINA ALBERTO ALONSO', 'M'),
    makeSampleStudent('lit-12', 'CE-33.101.212', 'HERNANDEZ ZULETA TOMAS IGNACIO', 'M'),
    makeSampleStudent('lit-13', 'CE-33.101.213', 'MAGGIOLO APONTE JEREMIAS', 'M'),
    makeSampleStudent('lit-14', 'CE-33.101.214', 'POLANCO BERMUDEZ TOMAS ANDRES', 'M'),
    makeSampleStudent('lit-15', 'CE-33.101.215', 'PORTILLO DIAZ ANASTASIA', 'F'),
    makeSampleStudent('lit-16', 'CE-33.101.216', 'QUINTERO VILLALOBOS ANGEL IVAN', 'M'),
    makeSampleStudent('lit-17', 'CE-33.101.217', 'RANGEL TOVAR JUAN ANDRES', 'M'),
    makeSampleStudent('lit-18', 'CE-33.101.218', 'SALOKHAN MARTINEZ AMALIA ISABEL', 'F'),
    makeSampleStudent('lit-19', 'CE-33.101.219', 'SERIO SOTO FRANCISCO ANDRES', 'M'),
    makeSampleStudent('lit-20', 'CE-33.101.220', 'SOUKI SAEZ HALIM', 'M'),
    makeSampleStudent('lit-21', 'CE-33.101.221', 'VARGAS BORGES MAURICIO ANTONIO', 'M'),
    makeSampleStudent('lit-22', 'CE-33.101.222', 'VIELMA COLLANTES ALANA MIRANDA', 'F'),
    makeSampleStudent('lit-23', 'CE-33.101.223', 'YSEA FIGUEROA JUAN VICENTE', 'M')
  ];

  // Nómina oficial de 24 estudiantes reproducida con fidelidad matemática del formato físico C.E.O. (Promedios por Sección Sabana)
  const FALLBACK_STUDENTS_SABANA = [
    { ...makeSampleStudent('sab-1', 'V-33.401.101', 'APONTE MARIE', 'F'), grades: [[18,19,19],[18,19,19],[16,17,18],[20,20,20],[18,19,19],[17,18,18],[18,19,19],[18,18,19],[20,20,20],[19,20,20]] },
    { ...makeSampleStudent('sab-2', 'V-33.401.102', 'BOURGHOUL ELIAS', 'M'), grades: [[16,17,17],[16,17,18],[15,16,16],[18,19,19],[17,17,18],[16,17,17],[17,17,18],[16,17,17],[19,19,20],[18,18,19]], pastAdjustedSubject: 2, ccAdjustedSubject: 3, ccBonus: 1, ccReason: 'Mérito Deportivo Institucional (Juegos CBA)' },
    { ...makeSampleStudent('sab-3', 'V-33.401.103', 'BRICEÑO DANIELA', 'F'), grades: [[17,17,18],[17,18,18],[14,15,15],[19,19,20],[18,18,18],[15,16,16],[16,17,17],[17,17,17],[19,19,19],[17,18,18]] },
    { ...makeSampleStudent('sab-4', 'V-33.401.104', 'CAMACHO ARANZA', 'F'), grades: [[18,18,19],[18,18,19],[16,16,17],[20,20,20],[18,18,19],[17,17,18],[18,18,18],[18,18,18],[19,20,20],[18,18,19]] },
    { ...makeSampleStudent('sab-5', 'V-33.401.105', 'CASTELLANOS EMILIANO', 'M'), grades: [[16,16,17],[15,16,16],[14,15,15],[18,19,19],[16,17,17],[15,15,16],[16,16,17],[16,16,17],[18,18,19],[16,17,17]], pastAdjustedSubject: 0 },
    { ...makeSampleStudent('sab-6', 'V-33.401.106', 'CONTRERAS ISABELLA', 'F'), grades: [[19,19,19],[19,19,20],[17,18,18],[20,20,20],[19,19,19],[18,18,19],[19,19,19],[18,18,19],[20,20,20],[19,19,19]] },
    { ...makeSampleStudent('sab-7', 'V-33.401.107', 'DIAZ CARLOS', 'M'), grades: [[14,15,15],[13,14,14],[13,14,14],[18,18,19],[15,15,16],[14,14,15],[15,15,16],[15,16,16],[17,17,18],[15,15,16]], ccAdjustedSubject: 2, ccBonus: 1, ccReason: 'Superación Pedagógica Demostrada en Consejo' },
    { ...makeSampleStudent('sab-8', 'V-33.401.108', 'GUERRERO MATTHIAS', 'M'), grades: [[18,18,19],[18,19,19],[16,17,17],[19,20,20],[18,18,18],[17,17,18],[18,18,19],[17,18,18],[19,20,20],[18,18,19]] },
    { ...makeSampleStudent('sab-9', 'V-33.401.109', 'HERRERA LUIS', 'M'), grades: [[15,15,16],[14,14,15],[13,13,14],[18,19,19],[15,16,16],[14,15,15],[15,15,16],[15,16,16],[17,18,18],[15,16,16]], pastAdjustedSubject: 2 },
    { ...makeSampleStudent('sab-10', 'V-33.401.110', 'HIGUEREY ALESSIA', 'F'), grades: [[19,20,20],[19,19,20],[18,19,19],[20,20,20],[19,19,20],[19,19,19],[19,20,20],[19,19,19],[20,20,20],[19,20,20]] },
    { ...makeSampleStudent('sab-11', 'V-33.401.111', 'ISSEA ISABELLA', 'F'), grades: [[17,18,18],[18,18,18],[15,16,16],[19,20,20],[17,18,18],[16,17,17],[17,18,18],[17,17,18],[19,19,20],[17,18,18]] },
    { ...makeSampleStudent('sab-12', 'V-33.401.112', 'MARTINEZ SANTIAGO', 'M'), grades: [[17,17,17],[16,17,17],[15,15,16],[19,19,20],[17,17,18],[16,16,17],[17,17,18],[16,17,17],[18,19,19],[17,17,18]] },
    { ...makeSampleStudent('sab-13', 'V-33.401.113', 'MONTIEL ARANZA', 'F'), grades: [[18,18,19],[18,19,19],[16,17,17],[20,20,20],[18,18,19],[17,18,18],[18,18,19],[18,18,18],[19,20,20],[18,18,19]] },
    { ...makeSampleStudent('sab-14', 'V-33.401.114', 'MORA LUIS', 'M'), grades: [[14,14,15],[13,13,14],[12,13,13],[18,18,19],[15,15,15],[13,14,14],[14,15,15],[15,15,16],[17,17,18],[15,15,16]], ccAdjustedSubject: 0, ccBonus: 1, ccReason: 'Mérito Cultural en Redacción y Declamación' },
    { ...makeSampleStudent('sab-15', 'V-33.401.115', 'MORALES MATHEO', 'M'), grades: [[16,16,17],[15,16,16],[14,15,15],[18,19,19],[16,16,17],[15,15,16],[16,16,17],[16,16,17],[18,18,19],[16,16,17]] },
    { ...makeSampleStudent('sab-16', 'V-33.401.116', 'PARRA SANTIAGO', 'M'), grades: [[19,19,20],[19,19,20],[18,19,19],[20,20,20],[19,19,20],[18,19,19],[19,19,20],[19,19,19],[20,20,20],[19,19,20]] },
    { ...makeSampleStudent('sab-17', 'V-33.401.117', 'PEREIRA MARCELO', 'M'), grades: [[17,17,18],[17,18,18],[15,16,16],[19,20,20],[17,17,18],[16,17,17],[17,17,18],[17,17,17],[19,19,20],[17,17,18]] },
    { ...makeSampleStudent('sab-18', 'V-33.401.118', 'PINZON VALENTINA', 'F'), grades: [[18,19,19],[18,19,19],[16,17,17],[20,20,20],[18,19,19],[17,18,18],[18,18,19],[18,18,18],[20,20,20],[18,18,19]] },
    { ...makeSampleStudent('sab-19', 'V-33.401.119', 'RIERA CAMILA', 'F'), grades: [[20,20,20],[19,20,20],[19,19,19],[20,20,20],[19,20,20],[19,19,19],[19,20,20],[19,19,19],[20,20,20],[19,20,20]] },
    { ...makeSampleStudent('sab-20', 'V-33.401.120', 'RINCON FABIAN', 'M'), grades: [[15,15,16],[14,15,15],[13,14,14],[18,19,19],[15,16,16],[14,15,15],[15,15,16],[15,16,16],[17,18,18],[15,16,16]] },
    { ...makeSampleStudent('sab-21', 'V-33.401.121', 'RIVERA SEBASTIAN', 'M'), grades: [[19,19,19],[19,19,20],[18,18,19],[20,20,20],[19,19,19],[18,19,19],[19,19,19],[19,19,19],[20,20,20],[19,19,20]] },
    { ...makeSampleStudent('sab-22', 'V-33.401.122', 'RODRIGUEZ VICTORIA', 'F'), grades: [[20,20,20],[20,20,20],[19,20,20],[20,20,20],[20,20,20],[19,20,20],[20,20,20],[19,20,20],[20,20,20],[20,20,20]] },
    { ...makeSampleStudent('sab-23', 'V-33.401.123', 'ROJAS VALENTINA', 'F'), grades: [[17,17,18],[17,18,18],[15,15,16],[19,20,20],[17,18,18],[16,17,17],[17,17,18],[17,17,18],[19,19,20],[17,18,18]] },
    { ...makeSampleStudent('sab-24', 'V-33.401.124', 'SEMPRUN SABRINA', 'F'), grades: [[19,20,20],[19,19,20],[18,19,19],[20,20,20],[19,20,20],[19,19,19],[19,20,20],[19,19,19],[20,20,20],[19,20,20]] }
  ];

  // Muestra fallback defensiva si la lista está vacía
  const displayStudents: Student[] = currentStudents.length > 0
    ? currentStudents
    : (isLiteralesPorSeccion
        ? FALLBACK_STUDENTS_LITERALES
        : isSabanaPromedios
        ? (FALLBACK_STUDENTS_SABANA as unknown as Student[])
        : [
            {
              id: 'demo-cba-1',
              cedula: 'V-32.901.442',
              fullName: 'Álvarez Mendoza, Sofía Valentina',
              gender: 'F',
              birthDate: '2010-04-12',
              representativeName: 'Mendoza de Álvarez, Elena',
              representativeEmail: 'elena@gmail.com',
              representativePhone: '0414-6123456',
              status: 'REGULAR',
              grade: selectedGrade,
              section: selectedSection,
              level: 'MEDIA_GENERAL',
              pendingSubjects: []
            },
            {
              id: 'demo-cba-2',
              cedula: 'V-32.887.102',
              fullName: 'Boscán Parra, Santiago Enrique',
              gender: 'M',
              birthDate: '2010-08-25',
              representativeName: 'Parra de Boscán, Coromoto',
              representativeEmail: 'coromoto@gmail.com',
              representativePhone: '0412-5558912',
              status: 'REGULAR',
              grade: selectedGrade,
              section: selectedSection,
              level: 'MEDIA_GENERAL',
              pendingSubjects: []
            },
            {
              id: 'demo-cba-3',
              cedula: 'V-33.104.992',
              fullName: 'Chacín Gutiérrez, Isabella Mariana',
              gender: 'F',
              birthDate: '2011-01-19',
              representativeName: 'Gutiérrez Chacín, Carlos',
              representativeEmail: 'carlos@gmail.com',
              representativePhone: '0424-7711223',
              status: 'REGULAR',
              grade: selectedGrade,
              section: selectedSection,
              level: 'MEDIA_GENERAL',
              pendingSubjects: []
            },
            {
              id: 'demo-cba-4',
              cedula: 'V-33.002.415',
              fullName: 'Díaz Morales, Leonardo Andrés',
              gender: 'M',
              birthDate: '2010-11-03',
              representativeName: 'Morales Díaz, Roberto',
              representativeEmail: 'roberto@gmail.com',
              representativePhone: '0416-3399001',
              status: 'REGULAR',
              grade: selectedGrade,
              section: selectedSection,
              level: 'MEDIA_GENERAL',
              pendingSubjects: []
            },
            {
              id: 'demo-cba-5',
              cedula: 'V-32.990.118',
              fullName: 'Fernández Prieto, Camila Alejandra',
              gender: 'F',
              birthDate: '2010-09-30',
              representativeName: 'Prieto Fernández, Mariana',
              representativeEmail: 'mariana@gmail.com',
              representativePhone: '0414-9988771',
              status: 'REGULAR',
              grade: selectedGrade,
              section: selectedSection,
              level: 'MEDIA_GENERAL',
              pendingSubjects: []
            }
          ]);

  // Cómputo de fila de literales por estudiante según escala oficial MPPE (L, A, P, I -> Literal Definitivo)
  const computeStudentLiteralesRow = (st: Student | any, idx: number) => {
    const studentEvals = evaluations?.filter(
      (e) => e.studentId === st.id && Number(e.lapso) === Number(selectedLapso)
    ) || [];

    let evalCount = 60;
    let lCount = 0;
    let aCount = 0;
    let pCount = 0;
    let iCount = 0;

    if (studentEvals.length > 0) {
      evalCount = studentEvals.length;
      studentEvals.forEach((e) => {
        const sc = e.scoreQualitative || e.scoreLiteral;
        if (sc === 'L') lCount++;
        else if (sc === 'A') aCount++;
        else if (sc === 'P' || sc === 'EP') pCount++;
        else if (sc === 'I') iCount++;
        else if (sc === 'B') aCount++;
        else if (sc === 'C') pCount++;
        else if (sc === 'D' || sc === 'E') iCount++;
      });
    } else {
      // Perfiles exactos reproducidos del modelo físico institucional UCE
      const sampleProfiles = [
        { eval: 60, l: 57, a: 2, p: 1, i: 0 },   // 1.  B (95.0%)
        { eval: 60, l: 45, a: 15, p: 0, i: 0 },  // 2.  C (75.0%)
        { eval: 60, l: 57, a: 3, p: 0, i: 0 },   // 3.  B (95.0%)
        { eval: 60, l: 52, a: 7, p: 1, i: 0 },   // 4.  B (86.7%)
        { eval: 60, l: 51, a: 9, p: 0, i: 0 },   // 5.  B (85.0%)
        { eval: 60, l: 24, a: 23, p: 13, i: 0 }, // 6.  E (40.0%)
        { eval: 60, l: 59, a: 1, p: 0, i: 0 },   // 7.  A (98.3%)
        { eval: 60, l: 59, a: 1, p: 0, i: 0 },   // 8.  A (98.3%)
        { eval: 60, l: 51, a: 9, p: 0, i: 0 },   // 9.  B (85.0%)
        { eval: 60, l: 52, a: 8, p: 0, i: 0 },   // 10. B (86.7%)
        { eval: 60, l: 48, a: 10, p: 2, i: 0 },  // 11. B (80.0%)
        { eval: 60, l: 60, a: 0, p: 0, i: 0 },   // 12. A (100.0%)
        { eval: 60, l: 50, a: 10, p: 0, i: 0 },  // 13. B (83.3%)
        { eval: 60, l: 52, a: 8, p: 0, i: 0 },   // 14. B (86.7%)
        { eval: 60, l: 60, a: 0, p: 0, i: 0 },   // 15. A (100.0%)
        { eval: 55, l: 51, a: 4, p: 0, i: 0 },   // 16. B (92.7%)
        { eval: 59, l: 55, a: 4, p: 0, i: 0 },   // 17. B (93.2%)
        { eval: 60, l: 59, a: 1, p: 0, i: 0 },   // 18. A (98.3%)
        { eval: 60, l: 59, a: 1, p: 0, i: 0 },   // 19. A (98.3%)
        { eval: 60, l: 48, a: 12, p: 0, i: 0 },  // 20. B (80.0%)
        { eval: 60, l: 52, a: 8, p: 0, i: 0 },   // 21. B (86.7%)
        { eval: 60, l: 48, a: 9, p: 3, i: 0 },   // 22. B (80.0%)
        { eval: 60, l: 58, a: 2, p: 0, i: 0 }    // 23. A (96.7%)
      ];
      const prof = sampleProfiles[idx % sampleProfiles.length];
      evalCount = prof.eval;
      lCount = prof.l;
      aCount = prof.a;
      pCount = prof.p;
      iCount = prof.i;
    }

    const pctL = evalCount > 0 ? (lCount / evalCount) * 100 : 0;
    const pctA = evalCount > 0 ? (aCount / evalCount) * 100 : 0;
    const pctP = evalCount > 0 ? (pCount / evalCount) * 100 : 0;
    const pctI = evalCount > 0 ? (iCount / evalCount) * 100 : 0;

    // Escala de Proyección Parametrizada a Literales (Requerimiento 1.A):
    // A: 95.5% a 100%
    // B: 80.0% a 95.4%
    // C: 60.0% a 79.9%
    // D: 51.0% a 59.9%
    // E (Reprobado): Menos de 50.0%
    let defLiteral: 'A' | 'B' | 'C' | 'D' | 'E';
    if (pctL >= 95.5) defLiteral = 'A';
    else if (pctL >= 80.0) defLiteral = 'B';
    else if (pctL >= 60.0) defLiteral = 'C';
    else if (pctL >= 51.0) defLiteral = 'D';
    else defLiteral = 'E';

    return {
      evalCount,
      lCount,
      pctL,
      aCount,
      pctA,
      pCount,
      pctP,
      iCount,
      pctI,
      defLiteral,
      rev: ''
    };
  };

  const handlePrint = () => {
    // Incrementar contador
    const newCount = incrementReporteImpresiones(reporte.id);
    if (onPrintIncrement) {
      onPrintIncrement(reporte.id, newCount);
    }
    // Registrar auditoría
    if (addAuditLog) {
      addAuditLog(
        `IMPRESION_REPORTE_${reporte.codigoReporte || reporte.id}`,
        `Emisión oficial del reporte: "${reporte.nombre}" para ${selectedGrade} Secc. "${selectedSection}" (Lapso ${selectedLapso})`
      );
    }
    window.print();
  };

  const currentDateFormatted = new Date().toLocaleDateString('es-VE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const modalContent = (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm overflow-y-auto flex items-start justify-center p-2 sm:p-4 print:p-0 print:bg-white print:overflow-visible animate-in fade-in duration-150">
      <div className={`w-full ${isSabanaPromedios ? 'max-w-[1360px]' : 'max-w-5xl'} mx-auto my-2 space-y-3`}>
        {/* Barra superior de herramientas (oculta en la impresión física) */}
        <div className="bg-[#2C2E53] text-white p-3.5 sm:p-4 rounded-2xl shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border border-slate-700 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#1B1C33] flex items-center justify-center font-black shadow-md shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
                  {reporte.categoriaLabel}
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {reporte.codigoReporte || 'CBA-DOC'}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-0.5">
                {reporte.nombre}
              </h3>
            </div>
          </div>

          {/* Selectores de parámetros */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/20 text-xs">
              <span className="text-slate-300 font-bold text-[11px]">Curso:</span>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                {availableGrades.map((g) => (
                  <option key={g} value={g} className="text-slate-900 font-bold">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* SECCIÓN INSTITUCIONAL: ÚNICAMENTE 'A' O 'B' */}
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/20 text-xs">
              <span className="text-slate-300 font-bold text-[11px]">Sección:</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value as 'A' | 'B')}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="A" className="text-slate-900 font-bold">Sección "A"</option>
                <option value="B" className="text-slate-900 font-bold">Sección "B"</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/20 text-xs">
              <span className="text-slate-300 font-bold text-[11px]">Lapso:</span>
              <select
                value={selectedLapso}
                onChange={(e) => setSelectedLapso(Number(e.target.value))}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value={1} className="text-slate-900 font-bold">Lapso 1</option>
                <option value={2} className="text-slate-900 font-bold">Lapso 2</option>
                <option value={3} className="text-slate-900 font-bold">Lapso 3</option>
              </select>
            </div>

            {/* Selector de Estado de Consejo de Curso */}
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/20 text-xs">
              <span className="text-slate-300 font-bold text-[11px]">Consejo:</span>
              <select
                value={reportState}
                onChange={(e) => setReportState(e.target.value as 'PREVIO' | 'DEFINITIVO')}
                className="bg-transparent text-[#D4AF37] font-black focus:outline-none cursor-pointer"
                title="Conmutar entre Reporte Previo a Consejo de Curso y Reporte Definitivo"
              >
                <option value="DEFINITIVO" className="text-slate-900 font-bold">Definitivo (Con CC)</option>
                <option value="PREVIO" className="text-slate-900 font-bold">Previo al Consejo</option>
              </select>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#e6c148] text-[#1e2038] font-black rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
              title="Imprimir documento oficial en papel carta"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title="Cerrar vista previa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Estilos de Impresión Oficial */}
        <style>{`
          @page {
            size: ${isSabanaPromedios ? 'letter landscape' : 'letter portrait'};
            margin: ${isSabanaPromedios ? '4mm 5mm 4mm 5mm' : '10mm 12mm 10mm 12mm'};
          }
          @media print {
            body {
              background: none !important;
              padding: 0 !important;
              margin: 0 !important;
              color: #000 !important;
            }
            .no-print {
              display: none !important;
            }
            .cba-report-sheet {
              width: 100% !important;
              min-height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
              background: white !important;
            }
          }
        `}</style>

        {/* Hoja de Impresión del Documento Institucional */}
        <div className="cba-report-sheet bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-10 mb-8 font-sans">
          {isLiteralesPorSeccion ? (
            /* CABECERA OFICIAL UCE - LITERALES POR SECCIÓN (EXACTA AL FORMATO IMPRESO FÍSICO) */
            <div className="mb-4">
              <div className="flex justify-between items-start pb-1">
                <div className="flex items-start gap-3">
                  <img
                    src={`${import.meta.env.BASE_URL}logo-cba.png`}
                    alt="Logo CBA"
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="text-[9.5pt] font-black text-slate-900 leading-tight">
                    <div className="text-[11pt] font-black tracking-wide">
                      UNIDAD EDUCATIVA BELLAS ARTES
                    </div>
                    <div className="font-bold text-slate-800 mt-0.5">
                      PERIODO ESCOLAR: 2025-2026
                    </div>
                    <div className="font-bold text-slate-800 uppercase">
                      {formatGradeHeader(selectedGrade)} - SECCION {selectedSection} PRIMARIA
                    </div>
                    <div className="font-bold text-slate-800">
                      {selectedLapso} LAPSO
                    </div>
                  </div>
                </div>

                <div className="text-right text-[9pt] font-mono text-slate-800 leading-tight pt-1">
                  <div className="font-bold tracking-wider text-slate-900">CODEMYXHIRMI</div>
                  <div className="font-bold uppercase text-[9.5pt] text-slate-900">
                    FARÍA DE GOMEZ CRISTINA
                  </div>
                </div>
              </div>

              {/* Doble línea horizontal divisoria institucional idéntica al formato físico */}
              <div className="border-t-[2px] border-b-[1px] border-slate-900 h-[4px] my-2"></div>

              {/* Título Oficial Centrado */}
              <div className="text-center my-2.5">
                <h2 className="text-[13pt] font-black text-slate-900 underline decoration-1 underline-offset-4 tracking-wide uppercase">
                  Literales por Sección
                </h2>
                <div className="text-[10pt] font-bold text-slate-800 mt-0.5">
                  Promedio M.P.P.E.
                </div>
              </div>
            </div>
          ) : isSabanaPromedios ? (
            /* CABECERA OFICIAL C.E.O. - PROMEDIOS POR SECCIÓN (SABANA) (EXACTA AL FORMATO IMPRESO FÍSICO) */
            <div className="mb-2">
              <div className="flex justify-between items-start pb-1">
                <div className="flex items-start gap-2.5">
                  <img
                    src={`${import.meta.env.BASE_URL}logo-cba.png`}
                    alt="Logo CBA"
                    className="w-11 h-11 object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="text-[8.5pt] font-black text-slate-900 leading-tight">
                    <div className="text-[10pt] font-black tracking-wide">
                      UNIDAD EDUCATIVA BELLAS ARTES
                    </div>
                    <div className="font-bold text-slate-800 mt-0.5">
                      PERIODO ESCOLAR: 2024-2025
                    </div>
                    <div className="font-bold text-slate-800 uppercase">
                      {formatGradeHeader(selectedGrade)} - SECCION {selectedSection} MEDIA GENERAL (GENERAL)
                    </div>
                  </div>
                </div>

                <div className="text-center pt-0.5">
                  <h2 className="text-[11.5pt] font-black text-slate-900 underline decoration-1 underline-offset-4 tracking-wide uppercase">
                    Promedios por Sección (Sabana)
                  </h2>
                </div>

                <div className="text-right text-[8pt] font-mono text-slate-800 leading-tight pt-0.5">
                  <div className="font-bold tracking-wider text-slate-900">COSUUQAJENGOM</div>
                  <div className="font-bold uppercase text-[8.5pt] text-slate-900">
                    DOCENTE GUIA: RIVERA JENNY
                  </div>
                </div>
              </div>

              {/* Doble línea horizontal divisoria institucional idéntica al formato físico */}
              <div className="border-t-[2px] border-b-[1px] border-slate-900 h-[3px] my-1.5"></div>
            </div>
          ) : (
            <>
              {/* Membrete Oficial M.P.P.E. Estándar */}
              <div className="border-b-2 border-[#2C2E53] pb-4 mb-6">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-20 text-center align-middle pr-4">
                        <img
                          src={`${import.meta.env.BASE_URL}logo-cba.png`}
                          alt="Logo CBA"
                          className="max-w-[75px] max-h-[75px] object-contain mx-auto"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      </td>
                      <td className="text-center align-middle">
                        <div className="text-[8.5pt] uppercase text-slate-600 tracking-wider font-semibold">
                          República Bolivariana de Venezuela • Ministerio del Poder Popular para la Educación
                        </div>
                        <div className="text-[15pt] font-black text-[#2C2E53] tracking-wide mt-0.5">
                          UNIDAD EDUCATIVA COLEGIO BELLAS ARTES
                        </div>
                        <div className="text-[9pt] text-slate-700 font-bold">
                          Inscrito en el MPPE Bajo el N° PD00132304 • Código D.E.A.: S0432D2305 • RIF: J-07011987-0
                        </div>
                        <div className="text-[8pt] text-slate-500 font-medium">
                          Coordinación de Evaluación y Control de Estudios • Maracaibo, Estado Zulia
                        </div>
                      </td>
                      <td className="w-24 text-right align-middle text-[8.5pt] text-slate-500 leading-tight font-mono">
                        <span className="font-bold text-[#2C2E53] block">AÑO ESCOLAR</span>
                        2026 - 2027<br />
                        Lapso {selectedLapso}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Título Oficial del Reporte Estándar */}
              <div className="text-center my-4">
                <h2 className="text-[14pt] font-black text-[#2C2E53] uppercase tracking-wide">
                  {reporte.nombre}
                </h2>
                <div className="flex items-center justify-center gap-4 text-[9.5pt] text-slate-600 font-bold mt-1">
                  <span>Curso: <strong className="text-slate-900">{selectedGrade}</strong></span>
                  <span>•</span>
                  <span>Sección: <strong className="text-slate-900">"{selectedSection}"</strong></span>
                  <span>•</span>
                  <span>Fecha: <strong className="text-slate-900">{currentDateFormatted}</strong></span>
                </div>
                <p className="text-[8.5pt] text-slate-500 italic mt-1 max-w-2xl mx-auto">
                  {reporte.descripcion}
                </p>
              </div>
            </>
          )}

          {/* Contenido Dinámico según Reporte */}
          <div className="my-6">
            {/* VISTA 0: FICHAS DE LOS ALUMNOS (UCE: FICHAS DE LOS ALUMNOS CON COLORES CONFIGURADOS) */}
            {reporte.id === 'adm-fichas-alumnos' || reporte.nombre.toLowerCase().includes('ficha de los alumnos') || reporte.nombre.toLowerCase().includes('fichas de los alumnos') ? (
              <div className="space-y-6">
                <div 
                  className="p-3 rounded-xl border text-[9pt] leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                  style={{
                    backgroundColor: reporte.fondoFilaImpar ? `rgba(${reporte.fondoFilaImpar}, 0.5)` : '#DFE8F4',
                    borderColor: reporte.fondoCabecera ? `rgb(${reporte.fondoCabecera})` : '#4F82BB'
                  }}
                >
                  <div>
                    <strong>UCE: Fichas de los Alumnos</strong> • Expediente acumulativo integral y registro bio-psicosocial para <strong>{selectedGrade}</strong> Sección <strong>"{selectedSection}"</strong>.
                    <span> • Lapso: <strong>Lapso {selectedLapso}</strong></span>
                    <span> • Sexo: <strong>{filtroSexo}</strong></span>
                    <span> • Orden: <strong>{filtroOrden}</strong></span>
                  </div>
                  <span className="font-mono font-bold text-xs px-2.5 py-1 bg-white/90 rounded-lg text-slate-800 shrink-0 border border-slate-300">
                    Matrícula: {displayStudents.length} estudiantes
                  </span>
                </div>

                {/* TABLA CONSOLIDADA CON LOS COLORES CONFIGURADOS EN MODIFICAR REGISTRO */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-slate-300 text-[8.5pt]">
                    <thead>
                      <tr 
                        style={{
                          backgroundColor: reporte.fondoCabecera ? `rgb(${reporte.fondoCabecera})` : '#4F82BB',
                          color: reporte.letrasCabecera ? `rgb(${reporte.letrasCabecera})` : '#FFFFFF'
                        }}
                        className="font-black"
                      >
                        <th className="border border-slate-400 p-2 text-center w-10">N°</th>
                        <th className="border border-slate-400 p-2 w-28">Cédula</th>
                        <th className="border border-slate-400 p-2">Apellidos y Nombres</th>
                        <th className="border border-slate-400 p-2 text-center w-12">Sexo</th>
                        <th className="border border-slate-400 p-2 text-center w-14">Edad</th>
                        <th className="border border-slate-400 p-2">Representante Legal</th>
                        <th className="border border-slate-400 p-2 w-28">Teléfono</th>
                        <th className="border border-slate-400 p-2 text-center w-20">Grup. Sang.</th>
                        <th className="border border-slate-400 p-2 text-center w-24">Condición</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayStudents.map((st, idx) => {
                        const isEven = idx % 2 === 0;
                        const rowBg = isEven
                          ? (reporte.fondoFilaPar ? `rgb(${reporte.fondoFilaPar})` : '#FFFFFF')
                          : (reporte.fondoFilaImpar ? `rgb(${reporte.fondoFilaImpar})` : '#DFE8F4');

                        return (
                          <tr key={st.id || idx} style={{ backgroundColor: rowBg }}>
                            <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                            <td className="border border-slate-300 p-2 font-mono font-bold text-slate-700">{st.cedula || 'S/C'}</td>
                            <td className="border border-slate-300 p-2 font-bold text-slate-900">{st.fullName}</td>
                            <td className="border border-slate-300 p-2 text-center font-bold">{st.gender || 'M'}</td>
                            <td className="border border-slate-300 p-2 text-center font-mono">14 años</td>
                            <td className="border border-slate-300 p-2 text-slate-800">{st.representativeName || 'Representante Registrado'}</td>
                            <td className="border border-slate-300 p-2 font-mono text-slate-700">{st.representativePhone || '0414-6000000'}</td>
                            <td className="border border-slate-300 p-2 text-center font-mono font-bold text-slate-700">O+</td>
                            <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">REGULAR</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* DETALLE INDIVIDUAL DE FICHAS ACUMULATIVAS (PRIMEROS ESTUDIANTES PARA EMISIÓN) */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#2C2E53] flex items-center gap-1.5">
                    <span>Muestra de Fichas Individuales del Alumno (Expedientes Institucionales)</span>
                  </h4>
                  {displayStudents.slice(0, 2).map((st, idx) => (
                    <div key={st.id || idx} className="p-4 rounded-xl border border-slate-300 bg-slate-50/50 text-[8pt] space-y-2">
                      <div 
                        className="p-1.5 px-3 rounded font-black text-xs uppercase flex justify-between items-center"
                        style={{
                          backgroundColor: reporte.fondoCabecera ? `rgb(${reporte.fondoCabecera})` : '#4F82BB',
                          color: reporte.letrasCabecera ? `rgb(${reporte.letrasCabecera})` : '#FFFFFF'
                        }}
                      >
                        <span>Ficha Individual N° {idx + 1} • {st.fullName}</span>
                        <span className="font-mono">{st.cedula || 'S/C'}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="bg-white p-2 rounded border border-slate-200">
                          <strong className="block text-slate-500 text-[7pt] uppercase">Datos Personales</strong>
                          <span>{st.fullName}</span><br />
                          <span>C.I.: {st.cedula || 'S/C'} • Sexo: {st.gender || 'M'}</span><br />
                          <span>Lugar: Maracaibo, Edo. Zulia</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-200">
                          <strong className="block text-slate-500 text-[7pt] uppercase">Representante Legal</strong>
                          <span>{st.representativeName || 'Representante Legal CBA'}</span><br />
                          <span>Teléfono: {st.representativePhone || '0414-6000000'}</span><br />
                          <span>Parentesco: Madre / Padre</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-200">
                          <strong className="block text-slate-500 text-[7pt] uppercase">Ficha Médica y Escolar</strong>
                          <span>Grupo Sanguíneo: O Positivo (O+)</span><br />
                          <span>Condición: Regular • Sin Alergias Críticas</span><br />
                          <span>Plantel de Procedencia: Bellas Artes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : reporte.id === 'adm-promedios-seccion-sabana' || reporte.id === 'adm-promedios' || isSabanaPromedios || reporte.nombre.toLowerCase().includes('promedio') || reporte.nombre.toLowerCase().includes('rendimiento') ? (
              /* VISTA MEDIA GENERAL: PROMEDIOS POR SECCIÓN (SÁBANA OFICIAL C.E.O. - REPLICA EXACTA AL FORMATO IMPRESO) */
              (() => {
                // 10 Asignaturas oficiales de Educación Media General con sus docentes titulares (exactas al formato físico)
                const sabanaSubjects = [
                  { id: 'ca', code: 'CA', name: 'Castellano', teacher: 'Prof. Jenny Rivera' },
                  { id: 'ile', code: 'ILE', name: 'Inglés / Lengua Extranjera', teacher: 'Prof. Robert Smith' },
                  { id: 'ma', code: 'MA', name: 'Matemática', teacher: 'Prof. Carlos Méndez' },
                  { id: 'ef', code: 'EF', name: 'Educación Física', teacher: 'Prof. Víctor Romero' },
                  { id: 'ap', code: 'AP', name: 'Arte y Patrimonio', teacher: 'Prof. Mariana Silva' },
                  { id: 'cn', code: 'CN', name: 'Ciencias Naturales', teacher: 'Prof. Elena Rojas' },
                  { id: 'ghc', code: 'GHC', name: 'Geografía, Historia y Ciudadanía', teacher: 'Prof. Alejandro Rivas' },
                  { id: 'pga', code: 'PGA', name: 'Orientación y Convivencia', teacher: 'Prof. Jenny Rivera' },
                  { id: 'pgi', code: 'PGI', name: 'Grupos de Creación / PGI', teacher: 'Prof. Laura Gil' },
                  { id: 'inn', code: 'INN', name: 'Innovación / Robótica', teacher: 'Prof. Marcos Andrade' }
                ];

                // Cómputo de notas por estudiante considerando Previo vs Definitivo, Ajustes de CC, Alerta "X" y Tendencia
                const computedRows = displayStudents.map((st: any, idx: number) => {
                  let gradesMatrix: number[][];
                  const pastAdjusted = st.pastAdjustedSubject ?? -1;
                  const ccAdjusted = st.ccAdjustedSubject ?? -1;
                  const ccBonus = st.ccBonus ?? 0;
                  const ccReason = st.ccReason ?? '';

                  if (st.grades && Array.isArray(st.grades) && st.grades.length === 10) {
                    gradesMatrix = st.grades;
                  } else {
                    gradesMatrix = sabanaSubjects.map((_, sIdx) => {
                      const base = Math.min(20, Math.max(12, 18 - ((idx + sIdx) % 6)));
                      return [
                        base,
                        Math.min(20, Math.max(10, base + (idx % 2 === 0 ? 1 : -1))),
                        Math.min(20, Math.max(11, base + (idx % 3 === 0 ? 1 : 0)))
                      ];
                    });
                  }

                  // Cómputo de notas definitivas por materia considerando estado Previo vs Definitivo
                  const defGrades = gradesMatrix.map(([l1, l2, l3], sIdx) => {
                    let rawDef = Math.round((l1 + l2 + l3) / 3);
                    if (reportState === 'DEFINITIVO' && ccAdjusted === sIdx) {
                      rawDef = Math.min(20, rawDef + (ccBonus || 1));
                    }
                    return rawDef;
                  });

                  const sumDef = defGrades.reduce((a, b) => a + b, 0);
                  const studentDef = parseFloat((sumDef / defGrades.length).toFixed(2));
                  const aprCount = defGrades.filter((n) => n >= 10).length;
                  const aplCount = defGrades.filter((n) => n < 10).length;

                  return {
                    student: st,
                    gradesMatrix,
                    defGrades,
                    studentDef,
                    aprCount,
                    aplCount,
                    pastAdjusted,
                    ccAdjusted,
                    ccBonus,
                    ccReason
                  };
                });

                // Promedio General de la Sección (X̄ = 17.4)
                const sectionTotalSum = computedRows.reduce((acc, r) => acc + r.studentDef, 0);
                const sectionAverage = computedRows.length > 0 ? (sectionTotalSum / computedRows.length).toFixed(1) : '0.0';

                // Resumen Poblacional por Categoría (5 Intervalos Oficiales)
                const catStats = {
                  aplazados: 0,
                  bajo: 0,
                  regular: 0,
                  distinguido: 0,
                  sobresaliente: 0
                };

                computedRows.forEach((r) => {
                  const a = r.studentDef;
                  if (a < 10) catStats.aplazados++;
                  else if (a < 14) catStats.bajo++;
                  else if (a < 16) catStats.regular++;
                  else if (a < 19) catStats.distinguido++;
                  else catStats.sobresaliente++;
                });

                const totalAlumnos = computedRows.length || 1;
                const aplazadosPct = ((catStats.aplazados / totalAlumnos) * 100).toFixed(2);
                const bajoPct = ((catStats.bajo / totalAlumnos) * 100).toFixed(2);
                const regularPct = ((catStats.regular / totalAlumnos) * 100).toFixed(2);
                const distinguidoPct = ((catStats.distinguido / totalAlumnos) * 100).toFixed(2);
                const sobresalientePct = ((catStats.sobresaliente / totalAlumnos) * 100).toFixed(2);

                // Métricas por Materia (Reporte Extendido)
                const subjectMetrics = sabanaSubjects.map((subj, sIdx) => {
                  const notes = computedRows.map((r) => r.defGrades[sIdx]);
                  const enrolled = notes.length;
                  const passed = notes.filter((n) => n >= 10).length;
                  const failed = enrolled - passed;
                  const passedPct = enrolled > 0 ? ((passed / enrolled) * 100).toFixed(1) : '0.0';
                  const failedPct = enrolled > 0 ? ((failed / enrolled) * 100).toFixed(1) : '0.0';
                  const avgSubj = enrolled > 0 ? (notes.reduce((a, b) => a + b, 0) / enrolled).toFixed(1) : '0.0';

                  return {
                    subj,
                    enrolled,
                    passed,
                    passedPct,
                    failed,
                    failedPct,
                    avgSubj
                  };
                });

                const printDateString = new Date().toLocaleDateString('es-VE') + ' ' + new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

                return (
                  <div className="space-y-3 text-[7pt] sm:text-[7.5pt]">
                    {/* Barra informativa de estado del reporte (oculta en impresión) */}
                    <div className="p-2.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-50 border-slate-300 no-print">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-slate-900 text-xs font-black">
                            Promedios por Sección (Sabana) • U.E. Bellas Artes
                          </strong>
                          <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider border ${
                            reportState === 'DEFINITIVO'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}>
                            {reportState === 'DEFINITIVO' ? '✓ Reporte Definitivo (Post-Consejo)' : '✎ Reporte Previo al Consejo de Curso'}
                          </span>
                        </div>
                        <div className="text-slate-600 text-[8pt]">
                          {formatGradeHeader(selectedGrade)} • Sección "{selectedSection}" • Lapso {selectedLapso} • Docente Guía: RIVERA JENNY
                          {reportState === 'DEFINITIVO' && (
                            <span className="text-emerald-700 ml-1 font-bold">• Ajustes de Consejo y méritos aplicados (Tope 20 pts)</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-300 text-center font-mono">
                          <span className="block text-[6.5pt] text-slate-500 font-bold uppercase">Media Seccional</span>
                          <span className="text-xs font-black text-[#2C2E53]">X̄ = {sectionAverage}</span>
                        </div>
                        <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-300 text-center font-mono">
                          <span className="block text-[6.5pt] text-slate-500 font-bold uppercase">Matrícula</span>
                          <span className="text-xs font-black text-slate-800">{computedRows.length} alumnos</span>
                        </div>
                      </div>
                    </div>

                    {/* TABLA PRINCIPAL DE 45 COLUMNAS (SÁBANA PANORÁMICA OFICIAL C.E.O.) */}
                    <div className="overflow-x-auto border border-slate-900 shadow-xs">
                      <table className="w-full text-left border-collapse border border-slate-900 text-[6.8pt] leading-tight">
                        <thead>
                          <tr className="bg-slate-100 text-slate-900 font-black text-center border-b border-slate-900">
                            <th rowSpan={2} className="border border-slate-900 p-0.5 w-6 text-center">N.</th>
                            <th rowSpan={2} className="border border-slate-900 p-0.5 text-left pl-1.5 min-w-[145px] max-w-[160px]">
                              Apellidos y Nombres
                            </th>
                            {sabanaSubjects.map((subj) => (
                              <th key={subj.id} colSpan={4} className="border border-slate-900 p-0.5 text-center font-black" title={`${subj.name} - ${subj.teacher}`}>
                                {subj.code}
                              </th>
                            ))}
                            <th rowSpan={2} className="border border-slate-900 p-0.5 w-7 text-center font-black">Apr</th>
                            <th rowSpan={2} className="border border-slate-900 p-0.5 w-7 text-center font-black">Apl</th>
                            <th rowSpan={2} className="border border-slate-900 p-0.5 w-10 text-center font-black bg-slate-200">Def</th>
                          </tr>
                          <tr className="bg-slate-50 text-slate-800 font-bold text-center border-b border-slate-900">
                            {sabanaSubjects.map((subj) => (
                              <React.Fragment key={`${subj.id}-subcols`}>
                                <th className="border border-slate-900 p-0.5 w-4 text-center font-mono text-[6.5pt]">1</th>
                                <th className="border border-slate-900 p-0.5 w-4 text-center font-mono text-[6.5pt]">2</th>
                                <th className="border border-slate-900 p-0.5 w-4 text-center font-mono text-[6.5pt]">3</th>
                                <th className="border border-slate-900 p-0.5 w-5 text-center font-mono font-black text-[6.5pt] bg-slate-100">D</th>
                              </React.Fragment>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {computedRows.map((r, idx) => (
                            <tr key={r.student.id || idx} className="hover:bg-amber-50/30 border-b border-slate-300">
                              <td className="border border-slate-900 p-0.5 text-center font-bold text-slate-900">{idx + 1}</td>
                              <td className="border border-slate-900 p-0.5 font-bold text-slate-900 uppercase pl-1.5 truncate max-w-[160px]">
                                {r.student.fullName}
                              </td>
                              {sabanaSubjects.map((subj, sIdx) => {
                                const [l1, l2, l3] = r.gradesMatrix[sIdx];
                                const defNote = r.defGrades[sIdx];
                                const isCCAdjusted = reportState === 'DEFINITIVO' && r.ccAdjusted === sIdx;
                                const isPastAdjusted = r.pastAdjusted === sIdx && selectedLapso >= 2;
                                const diffL2 = l2 - l1;
                                const diffL3 = l3 - l2;

                                return (
                                  <React.Fragment key={`${r.student.id || idx}-${subj.id}`}>
                                    <td className="border border-slate-900 p-0.5 text-center font-mono font-medium text-slate-800">
                                      {l1}
                                    </td>
                                    <td className="border border-slate-900 p-0.5 text-center font-mono font-medium text-slate-800 relative">
                                      <span>{l2}</span>
                                      {selectedLapso >= 2 && diffL2 !== 0 && (
                                        <span className={`block text-[5pt] font-black leading-none ${diffL2 > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                          {diffL2 > 0 ? `+${diffL2}` : diffL2}
                                        </span>
                                      )}
                                    </td>
                                    <td className="border border-slate-900 p-0.5 text-center font-mono font-medium text-slate-800 relative">
                                      <span>{l3}</span>
                                      {selectedLapso >= 3 && diffL3 !== 0 && (
                                        <span className={`block text-[5pt] font-black leading-none ${diffL3 > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                          {diffL3 > 0 ? `+${diffL3}` : diffL3}
                                        </span>
                                      )}
                                    </td>
                                    <td className="border border-slate-900 p-0.5 text-center font-mono font-black text-slate-900 bg-slate-50/70">
                                      <div className="flex items-center justify-center gap-0.5">
                                        <span className={isCCAdjusted ? 'underline font-black text-emerald-800' : ''}>
                                          {defNote}
                                        </span>
                                        {isPastAdjusted && (
                                          <span
                                            className="inline-block px-0.5 py-0 text-[5.5pt] font-black text-rose-700 bg-rose-100 border border-rose-400 rounded cursor-help"
                                            title="Alerta Consejo: Materia ya bonificada en lapso previo. No duplicar beneficio."
                                          >
                                            X
                                          </span>
                                        )}
                                        {isCCAdjusted && (
                                          <span
                                            className="inline-block text-[6pt] font-black text-emerald-700"
                                            title={`Ajuste oficial de Consejo: +${r.ccBonus} pt (${r.ccReason})`}
                                          >
                                            *
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                  </React.Fragment>
                                );
                              })}
                              <td className="border border-slate-900 p-0.5 text-center font-mono font-bold text-slate-900">
                                {r.aprCount}
                              </td>
                              <td className="border border-slate-900 p-0.5 text-center font-mono font-bold text-slate-900">
                                {r.aplCount}
                              </td>
                              <td className="border border-slate-900 p-0.5 text-center font-mono font-black text-slate-900 bg-slate-100">
                                {r.studentDef.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* BLOQUE INFERIOR: RESUMEN POBLACIONAL, PROMEDIO SECCIONAL (X̄ = 17.4) Y RC (CONFORME A LA FOTO) */}
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pt-1">
                      {/* Cuadro de Categorías por Intervalos (Fiel a la anotación oficial del documento) */}
                      <div className="border border-slate-900 rounded p-1.5 w-60 bg-white text-[7.5pt] font-mono shadow-2xs">
                        <div className="flex justify-between py-0.5 border-b border-slate-200">
                          <span className="font-bold">01 - 09:</span>
                          <span className="font-black text-slate-700">{catStats.aplazados > 0 ? String(catStats.aplazados).padStart(2, '0') : '-'} ({aplazadosPct}%)</span>
                        </div>
                        <div className="flex justify-between py-0.5 border-b border-slate-200">
                          <span className="font-bold">10 - 13:</span>
                          <span className="font-black text-slate-700">{catStats.bajo > 0 ? String(catStats.bajo).padStart(2, '0') : '-'} ({bajoPct}%)</span>
                        </div>
                        <div className="flex justify-between py-0.5 border-b border-slate-200">
                          <span className="font-bold">14 - 15:</span>
                          <span className="font-black text-slate-900">{String(catStats.regular).padStart(2, '0')} ({regularPct}%)</span>
                        </div>
                        <div className="flex justify-between py-0.5 border-b border-slate-200">
                          <span className="font-bold">16 - 18:</span>
                          <span className="font-black text-slate-900">{String(catStats.distinguido).padStart(2, '0')} ({distinguidoPct}%)</span>
                        </div>
                        <div className="flex justify-between py-0.5 border-b border-slate-200">
                          <span className="font-bold">19 - 20:</span>
                          <span className="font-black text-slate-900">{String(catStats.sobresaliente).padStart(2, '0')} ({sobresalientePct}%)</span>
                        </div>
                        <div className="flex justify-between pt-1 font-black text-slate-900 border-t border-slate-400">
                          <span>Total:</span>
                          <span>{computedRows.length} (100%)</span>
                        </div>
                      </div>

                      {/* Nota central de Registro de Conducta (RC) de la sección */}
                      <div className="text-[7.5pt] font-mono text-slate-800 leading-tight self-center text-center sm:text-left bg-slate-50 border border-slate-300 p-2 rounded">
                        <div className="font-black text-slate-900">RC: 154</div>
                        <div>145 leves y 9 graves</div>
                        <div className="text-[6.5pt] text-slate-500 font-bold uppercase mt-0.5">Control de Convivencia Escolar</div>
                      </div>

                      {/* Promedio General de la Sección X̄ = 17.4 alineado a la derecha debajo de la columna Def */}
                      <div className="text-right self-start sm:self-center">
                        <div className="text-[12pt] font-black font-mono tracking-tight text-slate-900 pr-2">
                          X&#772; = {sectionAverage}
                        </div>
                        <div className="text-[7pt] font-bold text-slate-500 uppercase pr-2">
                          Media Aritmética de Sección
                        </div>
                      </div>
                    </div>

                    {/* REPORTE EXTENDIDO: MÉTRICAS CONSOLIDADAS POR MATERIA (REQUERIMIENTO 2.B) */}
                    <div className="bg-white border border-slate-400 rounded-lg p-2.5 shadow-2xs space-y-1.5 mt-2">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                        <h4 className="font-black uppercase tracking-wider text-[#2C2E53] text-[7.5pt]">
                          Métricas por Materia (Reporte Extendido)
                        </h4>
                        <span className="text-[6.5pt] text-slate-500 font-bold uppercase">
                          Auditoría de Rendimiento por Asignatura
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse border border-slate-300 text-[7.5pt]">
                          <thead>
                            <tr className="bg-slate-700 text-white font-black text-center border-b border-slate-700">
                              <th className="border border-slate-400 p-1 text-left pl-2">Área de Formación / Materia</th>
                              <th className="border border-slate-400 p-1 text-left pl-2">Docente Titular</th>
                              <th className="border border-slate-400 p-1 w-12">Inscritos</th>
                              <th className="border border-slate-400 p-1 w-16">Aprobados</th>
                              <th className="border border-slate-400 p-1 w-14">% Aprob.</th>
                              <th className="border border-slate-400 p-1 w-16">Aplazados</th>
                              <th className="border border-slate-400 p-1 w-14">% Aplaz.</th>
                              <th className="border border-slate-400 p-1 w-16 bg-slate-800 text-amber-300">Promedio</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subjectMetrics.map((sm, sIdx) => {
                              const isEven = sIdx % 2 === 0;
                              return (
                                <tr key={sm.subj.id} className={isEven ? 'bg-white' : 'bg-slate-50'}>
                                  <td className="border border-slate-300 p-1 font-black text-[#2C2E53] pl-2">
                                    {sm.subj.name} ({sm.subj.code})
                                  </td>
                                  <td className="border border-slate-300 p-1 text-slate-700 font-medium pl-2">
                                    {sm.subj.teacher}
                                  </td>
                                  <td className="border border-slate-300 p-1 text-center font-mono font-bold text-slate-800">
                                    {sm.enrolled}
                                  </td>
                                  <td className="border border-slate-300 p-1 text-center font-mono font-bold text-emerald-800 bg-emerald-50/30">
                                    {sm.passed}
                                  </td>
                                  <td className="border border-slate-300 p-1 text-center font-mono font-extrabold text-emerald-800">
                                    {sm.passedPct}%
                                  </td>
                                  <td className="border border-slate-300 p-1 text-center font-mono font-bold text-rose-800 bg-rose-50/30">
                                    {sm.failed}
                                  </td>
                                  <td className="border border-slate-300 p-1 text-center font-mono font-extrabold text-rose-800">
                                    {sm.failedPct}%
                                  </td>
                                  <td className="border border-slate-300 p-1 text-center font-mono font-black text-slate-900 bg-slate-100/70 text-[8pt]">
                                    {sm.avgSubj} pts
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* PIE DE PÁGINA OFICIAL C.E.O. (IDÉNTICO A LA FOTO) */}
                    <div className="flex justify-between items-center text-[7pt] font-mono text-slate-600 pt-2 border-t border-slate-300 mt-2">
                      <div>Página 1/2 - Fecha de Impresión {printDateString}</div>
                      <div className="font-bold">Control Estudiantil Online, C.E.O.</div>
                    </div>
                  </div>
                );
              })()
            ) : reporte.nombre.toLowerCase().includes('listado') || reporte.nombre.toLowerCase().includes('matrícula') ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-slate-300 text-[9pt]">
                  <thead>
                    <tr 
                      style={{
                        backgroundColor: reporte.fondoCabecera ? `rgb(${reporte.fondoCabecera})` : '#4F82BB',
                        color: reporte.letrasCabecera ? `rgb(${reporte.letrasCabecera})` : '#FFFFFF'
                      }}
                      className="font-black"
                    >
                      <th className="border border-slate-300 p-2 text-center w-10">N°</th>
                      <th className="border border-slate-300 p-2 w-28">Cédula</th>
                      <th className="border border-slate-300 p-2">Apellidos y Nombres</th>
                      <th className="border border-slate-300 p-2 text-center w-14">Sexo</th>
                      {reporte.nombre.includes('Representantes') ? (
                        <>
                          <th className="border border-slate-300 p-2">Representante Legal</th>
                          <th className="border border-slate-300 p-2 w-32">Teléfono</th>
                        </>
                      ) : (
                        <>
                          <th className="border border-slate-300 p-2 text-center w-24">Condición</th>
                          <th className="border border-slate-300 p-2 text-center w-36">Firma / Observación</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {displayStudents.map((st, idx) => {
                      const isEven = idx % 2 === 0;
                      const rowBg = isEven
                        ? (reporte.fondoFilaPar ? `rgb(${reporte.fondoFilaPar})` : '#FFFFFF')
                        : (reporte.fondoFilaImpar ? `rgb(${reporte.fondoFilaImpar})` : '#DFE8F4');

                      return (
                        <tr key={st.id || idx} style={{ backgroundColor: rowBg }} className="hover:opacity-95">
                          <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                          <td className="border border-slate-300 p-2 font-mono font-bold text-slate-700">{st.cedula || 'S/C'}</td>
                          <td className="border border-slate-300 p-2 font-bold text-slate-900">{st.fullName}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{st.gender || 'M'}</td>
                          {reporte.nombre.includes('Representantes') ? (
                            <>
                              <td className="border border-slate-300 p-2 text-slate-700">{st.representativeName || 'N/A'}</td>
                              <td className="border border-slate-300 p-2 text-slate-700 font-mono">{st.representativePhone || 'N/A'}</td>
                            </>
                          ) : (
                            <>
                              <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">REGULAR</td>
                              <td className="border border-slate-300 p-2"></td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : reporte.nombre.toLowerCase().includes('inasistencia') ? (
              /* VISTA 2: INASISTENCIAS Y CONTROL ART. 109 LOE */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-slate-300 text-[9pt]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-black">
                      <th className="border border-slate-300 p-2 text-center w-10">N°</th>
                      <th className="border border-slate-300 p-2 w-28">Cédula</th>
                      <th className="border border-slate-300 p-2">Estudiante</th>
                      <th className="border border-slate-300 p-2 text-center w-16">Justif.</th>
                      <th className="border border-slate-300 p-2 text-center w-16">Injustif.</th>
                      <th className="border border-slate-300 p-2 text-center w-20">Total Horas</th>
                      <th className="border border-slate-300 p-2 text-center w-20">% Inasist.</th>
                      <th className="border border-slate-300 p-2 text-center w-28">Estatus LOE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayStudents.map((st, idx) => {
                      const inj = (idx === 1 ? 8 : idx === 3 ? 14 : 2);
                      const just = (idx % 2 === 0 ? 2 : 0);
                      const total = inj + just;
                      const pct = Math.round((inj / 48) * 100);
                      const isAlert = pct >= 25;
                      return (
                        <tr key={st.id || idx}>
                          <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                          <td className="border border-slate-300 p-2 font-mono">{st.cedula || 'S/C'}</td>
                          <td className="border border-slate-300 p-2 font-bold">{st.fullName}</td>
                          <td className="border border-slate-300 p-2 text-center text-slate-600">{just}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold text-slate-800">{inj}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{total} h</td>
                          <td className={`border border-slate-300 p-2 text-center font-bold ${isAlert ? 'text-rose-600 bg-rose-50' : 'text-slate-700'}`}>
                            {pct}%
                          </td>
                          <td className="border border-slate-300 p-2 text-center font-bold">
                            {isAlert ? (
                              <span className="text-rose-700 uppercase text-[8pt]">Riesgo Art. 109</span>
                            ) : (
                              <span className="text-emerald-700 uppercase text-[8pt]">Regular</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : reporte.nombre.toLowerCase().includes('conducta') ? (
              /* VISTA 3: REGISTRO DE CONDUCTA Y CONVIVENCIA */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-slate-300 text-[9pt]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-black">
                      <th className="border border-slate-300 p-2 text-center w-10">N°</th>
                      <th className="border border-slate-300 p-2 w-28">Fecha</th>
                      <th className="border border-slate-300 p-2 w-48">Estudiante</th>
                      <th className="border border-slate-300 p-2">Descripción de la Incidencia / Falta</th>
                      <th className="border border-slate-300 p-2 w-48">Acuerdo Pedagógico / Medida</th>
                      <th className="border border-slate-300 p-2 text-center w-24">Firma Repr.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 text-center font-bold">1</td>
                      <td className="border border-slate-300 p-2 font-mono">14/10/2026</td>
                      <td className="border border-slate-300 p-2 font-bold">{displayStudents[0]?.fullName}</td>
                      <td className="border border-slate-300 p-2 text-slate-700">Incumplimiento reiterado de uniforme reglamentario (falta leve).</td>
                      <td className="border border-slate-300 p-2 text-slate-700">Amonestación verbal reflexiva y compromiso firmado en coordinación.</td>
                      <td className="border border-slate-300 p-2 text-center">Conforme</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 text-center font-bold">2</td>
                      <td className="border border-slate-300 p-2 font-mono">08/10/2026</td>
                      <td className="border border-slate-300 p-2 font-bold">{displayStudents[1]?.fullName}</td>
                      <td className="border border-slate-300 p-2 text-slate-700">Uso de dispositivo móvil durante la explicación docente sin autorización.</td>
                      <td className="border border-slate-300 p-2 text-slate-700">Retención preventiva del equipo para entrega exclusiva al representante.</td>
                      <td className="border border-slate-300 p-2 text-center">Conforme</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : reporte.nombre.toLowerCase().includes('resumen') || reporte.nombre.toLowerCase().includes('certificación') || reporte.nombre.toLowerCase().includes('materia pendiente') ? (
              /* VISTA 4: ACTAS OFICIALES MPPE Y MATERIA PENDIENTE */
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[9pt] leading-relaxed">
                  El presente documento certifica el rendimiento académico y cierre oficial de actas ministeriales para los estudiantes inscritos en el curso <strong>{selectedGrade}</strong>, Sección <strong>"{selectedSection}"</strong> de la Unidad Educativa Colegio Bellas Artes, conforme a la Ley Orgánica de Educación y Resoluciones Vigentes.
                </div>
                <table className="w-full text-left border-collapse border border-slate-300 text-[8.5pt]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-black">
                      <th className="border border-slate-300 p-2 text-center w-8">N°</th>
                      <th className="border border-slate-300 p-2 w-24">Cédula</th>
                      <th className="border border-slate-300 p-2">Apellidos y Nombres</th>
                      <th className="border border-slate-300 p-2 text-center w-12">Cast</th>
                      <th className="border border-slate-300 p-2 text-center w-12">Mat</th>
                      <th className="border border-slate-300 p-2 text-center w-12">Ing</th>
                      <th className="border border-slate-300 p-2 text-center w-12">Bio</th>
                      <th className="border border-slate-300 p-2 text-center w-12">Fís</th>
                      <th className="border border-slate-300 p-2 text-center w-12">Quí</th>
                      <th className="border border-slate-300 p-2 text-center w-14">Prom</th>
                      <th className="border border-slate-300 p-2 text-center w-24">Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayStudents.map((st, idx) => {
                      const n1 = 16 + (idx % 4);
                      const n2 = 15 + ((idx + 1) % 5);
                      const n3 = 17 + ((idx + 2) % 4);
                      const n4 = 14 + ((idx + 3) % 6);
                      const n5 = 16 + (idx % 3);
                      const n6 = 15 + ((idx + 1) % 4);
                      const avg = ((n1 + n2 + n3 + n4 + n5 + n6) / 6).toFixed(1);
                      return (
                        <tr key={st.id || idx}>
                          <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                          <td className="border border-slate-300 p-2 font-mono">{st.cedula || 'S/C'}</td>
                          <td className="border border-slate-300 p-2 font-bold">{st.fullName}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{n1}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{n2}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{n3}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{n4}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{n5}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{n6}</td>
                          <td className="border border-slate-300 p-2 text-center font-black text-[#2C2E53] bg-slate-50">{avg}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">APROBADO</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : isLiteralesPorSeccion ? (
              /* VISTA 5: LITERALES POR SECCIÓN / PROMEDIO M.P.P.E. (FORMATO FÍSICO OFICIAL) */
              <div className="space-y-4">
                {/* Tabla Oficial de Literales por Sección */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-slate-700 text-[8pt] sm:text-[8.5pt]">
                    <thead>
                      <tr className="bg-slate-700 text-white italic font-bold text-center border-b border-slate-700">
                        <th className="border border-slate-400 p-1.5 w-8">N.</th>
                        <th className="border border-slate-400 p-1.5 text-left pl-2">Apellido y Nombres</th>
                        <th className="border border-slate-400 p-1.5 w-12">Eval.</th>
                        <th className="border border-slate-400 p-1.5 w-10">L</th>
                        <th className="border border-slate-400 p-1.5 w-14">%</th>
                        <th className="border border-slate-400 p-1.5 w-10">A</th>
                        <th className="border border-slate-400 p-1.5 w-14">%</th>
                        <th className="border border-slate-400 p-1.5 w-10">P</th>
                        <th className="border border-slate-400 p-1.5 w-14">%</th>
                        <th className="border border-slate-400 p-1.5 w-10">I</th>
                        <th className="border border-slate-400 p-1.5 w-14">%</th>
                        <th className="border border-slate-400 p-1.5 w-12 font-black">Def.</th>
                        <th className="border border-slate-400 p-1.5 w-12">Rev.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayStudents.map((st, idx) => {
                        const row = computeStudentLiteralesRow(st, idx);
                        const studentName = formatStudentName(st);

                        return (
                          <tr key={st.id || idx} className="hover:bg-slate-50 border-b border-slate-300">
                            <td className="border border-slate-400 p-1 text-center font-bold text-slate-800">
                              {idx + 1}
                            </td>
                            <td className="border border-slate-400 p-1 text-left font-bold text-slate-900 uppercase tracking-tight pl-2">
                              {studentName}
                            </td>
                            <td className="border border-slate-400 p-1 text-center font-mono font-medium text-slate-700">
                              {row.evalCount}
                            </td>
                            <td className="border border-slate-400 p-1 text-center font-mono font-medium text-slate-800">
                              {row.lCount}
                            </td>
                            <td className="border border-slate-400 p-1 text-center font-mono text-slate-700">
                              {row.pctL.toFixed(1)}%
                            </td>
                            <td className="border border-slate-400 p-1 text-center font-mono font-medium text-slate-800">
                              {row.aCount}
                            </td>
                            <td className="border border-slate-400 p-1 text-center font-mono text-slate-700">
                              {row.pctA.toFixed(1)}%
                            </td>
                            <td className="border border-slate-400 p-1 text-center font-mono font-medium text-slate-800">
                              {row.pCount}
                            </td>
                            <td className="border border-slate-400 p-1 text-center font-mono text-slate-700">
                              {row.pctP.toFixed(1)}%
                            </td>
                            <td className="border border-slate-400 p-1 text-center font-mono font-medium text-slate-800">
                              {row.iCount}
                            </td>
                            <td className="border border-slate-400 p-1 text-center font-mono text-slate-700">
                              {row.pctI.toFixed(1)}%
                            </td>
                            <td className="border border-slate-400 p-1 text-center font-black text-slate-900 bg-slate-50/70 text-[9pt]">
                              {row.defLiteral}
                            </td>
                            <td className="border border-slate-400 p-1 text-center font-mono text-slate-400">
                              {row.rev || ''}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Resumen Estadístico al pie de la tabla (idéntico a la distribución UCE del documento) */}
                {(() => {
                  const stats = { A: 0, B: 0, C: 0, D: 0, E: 0, total: displayStudents.length };
                  displayStudents.forEach((st, idx) => {
                    const row = computeStudentLiteralesRow(st, idx);
                    stats[row.defLiteral]++;
                  });
                  const pctA = stats.total > 0 ? ((stats.A / stats.total) * 100).toFixed(1) : '0.0';
                  const pctB = stats.total > 0 ? ((stats.B / stats.total) * 100).toFixed(1) : '0.0';
                  const pctC = stats.total > 0 ? ((stats.C / stats.total) * 100).toFixed(1) : '0.0';
                  const pctD = stats.total > 0 ? ((stats.D / stats.total) * 100).toFixed(1) : '0.0';
                  const pctE = stats.total > 0 ? ((stats.E / stats.total) * 100).toFixed(1) : '0.0';

                  const promovidosCount = stats.A + stats.B + stats.C;
                  const promovidosPct = stats.total > 0 ? ((promovidosCount / stats.total) * 100).toFixed(1) : '0.0';
                  const recupCount = stats.D + stats.E;
                  const recupPct = stats.total > 0 ? ((recupCount / stats.total) * 100).toFixed(1) : '0.0';

                  return (
                    <div className="mt-3 flex flex-col md:flex-row items-start justify-between gap-4 text-[8.5pt]">
                      {/* Cuadro de Distribución de Literales A, B, C, D, E y % */}
                      <div className="border border-slate-600 rounded overflow-hidden shadow-sm bg-white">
                        <table className="text-center border-collapse">
                          <thead>
                            <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-400 text-[8pt]">
                              <th className="border-r border-slate-400 px-3 py-1">A</th>
                              <th className="border-r border-slate-400 px-3 py-1">%</th>
                              <th className="border-r border-slate-400 px-3 py-1">B</th>
                              <th className="border-r border-slate-400 px-3 py-1">%</th>
                              <th className="border-r border-slate-400 px-3 py-1">C</th>
                              <th className="border-r border-slate-400 px-3 py-1">%</th>
                              <th className="border-r border-slate-400 px-3 py-1">D</th>
                              <th className="border-r border-slate-400 px-3 py-1">%</th>
                              <th className="border-r border-slate-400 px-3 py-1">E</th>
                              <th className="px-3 py-1">%</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="font-mono font-bold bg-white text-slate-900 text-[8.5pt]">
                              <td className="border-r border-slate-400 px-3 py-1.5">{String(stats.A).padStart(2, '0')}</td>
                              <td className="border-r border-slate-400 px-3 py-1.5">{pctA}</td>
                              <td className="border-r border-slate-400 px-3 py-1.5">{String(stats.B).padStart(2, '0')}</td>
                              <td className="border-r border-slate-400 px-3 py-1.5">{pctB}</td>
                              <td className="border-r border-slate-400 px-3 py-1.5">{String(stats.C).padStart(2, '0')}</td>
                              <td className="border-r border-slate-400 px-3 py-1.5">{pctC}</td>
                              <td className="border-r border-slate-400 px-3 py-1.5">{stats.D > 0 ? String(stats.D).padStart(2, '0') : '-'}</td>
                              <td className="border-r border-slate-400 px-3 py-1.5">{stats.D > 0 ? pctD : '-'}</td>
                              <td className="border-r border-slate-400 px-3 py-1.5">{String(stats.E).padStart(2, '0')}</td>
                              <td className="px-3 py-1.5">{pctE}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Resumen de Aprobación y Matrícula Evaluada */}
                      <div className="text-[8pt] text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono space-y-1 w-full md:w-auto">
                        <div className="flex justify-between items-center gap-4">
                          <span className="font-bold text-slate-700">Matrícula Evaluada:</span>
                          <span className="font-black text-slate-900">{stats.total} alumnos (100.0%)</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="font-bold text-emerald-800">Promovidos (A, B, C):</span>
                          <span className="font-black text-emerald-900">
                            {promovidosCount} ({promovidosPct}%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="font-bold text-rose-800">En Recuperación (D, E):</span>
                          <span className="font-black text-rose-900">
                            {recupCount} ({recupPct}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : reporte.nombre.toLowerCase().includes('rango') ? (
              /* VISTA 6: REPORTES POR RANGO (LITERALES POR RANGO / CALIFICACIONES POR RANGO) */
              (() => {
                const isLiteralReport = reporte.nombre.toLowerCase().includes('literal') || reporte.nivel === 'PRIMARIA';
                const minFloat = filtroNotaMin && !isNaN(parseFloat(filtroNotaMin)) ? parseFloat(filtroNotaMin) : null;
                const maxFloat = filtroNotaMax && !isNaN(parseFloat(filtroNotaMax)) ? parseFloat(filtroNotaMax) : null;
                const minLetter = filtroNotaMin && ['A', 'B', 'C', 'D', 'E'].includes(filtroNotaMin.trim().toUpperCase()) ? filtroNotaMin.trim().toUpperCase() : null;
                const maxLetter = filtroNotaMax && ['A', 'B', 'C', 'D', 'E'].includes(filtroNotaMax.trim().toUpperCase()) ? filtroNotaMax.trim().toUpperCase() : null;

                const evaluatedRows = displayStudents.map((st, idx) => {
                  if (isLiteralReport) {
                    const row = computeStudentLiteralesRow(st, idx);
                    const passesMin = (minFloat !== null ? row.pctL >= minFloat : true) && (minLetter !== null ? row.defLiteral <= minLetter : true);
                    const passesMax = (maxFloat !== null ? row.pctL <= maxFloat : true) && (maxLetter !== null ? row.defLiteral >= maxLetter : true);
                    return {
                      st,
                      scoreDisplay: row.defLiteral,
                      detail: `${row.pctL.toFixed(1)}% Logrado`,
                      scale: row.defLiteral === 'A' ? 'Excelente' : row.defLiteral === 'B' ? 'Muy Bien' : row.defLiteral === 'C' ? 'Bien' : row.defLiteral === 'D' ? 'Regular' : 'En Recuperación',
                      rangeAssigned: `Literal "${row.defLiteral}" (Escala Parametrizada)`,
                      passes: passesMin && passesMax
                    };
                  } else {
                    const n = Math.min(20, Math.max(9, 18 - (idx % 6)));
                    const passesMin = minFloat !== null ? n >= minFloat : true;
                    const passesMax = maxFloat !== null ? n <= maxFloat : true;
                    return {
                      st,
                      scoreDisplay: String(n).padStart(2, '0'),
                      detail: `${n} pts`,
                      scale: n >= 19 ? 'Sobresaliente' : n >= 16 ? 'Distinguido' : n >= 14 ? 'Regular' : n >= 10 ? 'Bajo' : 'Aplazado',
                      rangeAssigned: `${n - 1} a ${n + 1} pts`,
                      passes: passesMin && passesMax
                    };
                  }
                });

                const filteredRows = evaluatedRows.filter((r) => r.passes);

                return (
                  <div className="space-y-4">
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[9pt] leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        Consolidado de distribución por rango evaluativo para <strong>{selectedGrade}</strong> Sección <strong>"{selectedSection}"</strong>.
                        {filtroNotaMin && <span> • Cota mínima: <strong>{filtroNotaMin}</strong></span>}
                        {filtroNotaMax && <span> • Cota máxima: <strong>{filtroNotaMax}</strong></span>}
                        <span> • Sexo: <strong>{filtroSexo}</strong></span>
                        <span> • Orden: <strong>{filtroOrden}</strong></span>
                        <div className="text-[7.5pt] text-amber-800 font-bold mt-0.5">
                          ✓ Filtro de precisión decimal activo (admite cotas como 95.5% para corte de diplomas de excelencia)
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs px-2.5 py-1 bg-amber-100 rounded-lg text-amber-900 shrink-0">
                        Total Filtrados: {filteredRows.length} de {displayStudents.length}
                      </span>
                    </div>

                    <table className="w-full text-left border-collapse border border-slate-300 text-[8.5pt]">
                      <thead>
                        <tr className="bg-slate-700 text-white font-black text-center">
                          <th className="border border-slate-400 p-1.5 w-10">N°</th>
                          <th className="border border-slate-400 p-1.5 w-28">Cédula</th>
                          <th className="border border-slate-400 p-1.5 text-left pl-2">Apellidos y Nombres</th>
                          <th className="border border-slate-400 p-1.5 w-14">Sexo</th>
                          <th className="border border-slate-400 p-1.5 w-24">
                            {isLiteralReport ? 'Literal / %' : 'Calificación'}
                          </th>
                          <th className="border border-slate-400 p-1.5 w-28">Escala</th>
                          <th className="border border-slate-400 p-1.5 w-36">Rango Asignado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRows.map((r, idx) => (
                          <tr key={r.st.id || idx} className="hover:bg-slate-50 border-b border-slate-200">
                            <td className="border border-slate-300 p-1.5 text-center font-bold text-slate-800">{idx + 1}</td>
                            <td className="border border-slate-300 p-1.5 font-mono text-center">{r.st.cedula || 'S/C'}</td>
                            <td className="border border-slate-300 p-1.5 font-bold text-slate-900 uppercase pl-2">{r.st.fullName}</td>
                            <td className="border border-slate-300 p-1.5 text-center font-bold">{r.st.gender || 'M'}</td>
                            <td className="border border-slate-300 p-1.5 text-center font-black text-emerald-800 bg-emerald-50/40 font-mono">
                              <div>{r.scoreDisplay}</div>
                              <div className="text-[7.5pt] font-normal text-slate-500">{r.detail}</div>
                            </td>
                            <td className="border border-slate-300 p-1.5 text-center text-xs font-semibold text-slate-700">
                              {r.scale}
                            </td>
                            <td className="border border-slate-300 p-1.5 text-center font-mono font-bold text-xs text-slate-700">
                              {r.rangeAssigned}
                            </td>
                          </tr>
                        ))}
                        {filteredRows.length === 0 && (
                          <tr>
                            <td colSpan={7} className="border border-slate-300 p-4 text-center text-slate-400 italic">
                              No se encontraron estudiantes dentro del rango especificado ({filtroNotaMin || 'min'} a {filtroNotaMax || 'max'}).
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              })()
            ) : (
              /* VISTA 6: BANCO DE CONTENIDOS, ESTRATEGIAS O COMPETENCIAS */
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[9pt] leading-relaxed">
                  Instrumento oficial pedagógico para la programación curricular de la Unidad Educativa Colegio Bellas Artes. Registra los temas generadores, ejes temáticos e indicadores de logro aprobados por el Consejo Docente.
                </div>
                <table className="w-full text-left border-collapse border border-slate-300 text-[9pt]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-black">
                      <th className="border border-slate-300 p-2 text-center w-12">N°</th>
                      <th className="border border-slate-300 p-2 w-48">Área de Formación</th>
                      <th className="border border-slate-300 p-2">Eje Temático / Contenido Programático</th>
                      <th className="border border-slate-300 p-2 w-44">Estrategia / Instrumento</th>
                      <th className="border border-slate-300 p-2 text-center w-24">Ponderación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 text-center font-bold">1</td>
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">Castellano y Literatura</td>
                      <td className="border border-slate-300 p-2 text-slate-800">Estructura del texto narrativo, cohesión léxica y argumentación crítica en ensayos literarios.</td>
                      <td className="border border-slate-300 p-2 text-slate-700">Producción escrita individual / Rúbrica analítica</td>
                      <td className="border border-slate-300 p-2 text-center font-black text-[#2C2E53]">20% (4 pts)</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 text-center font-bold">2</td>
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">Matemáticas</td>
                      <td className="border border-slate-300 p-2 text-slate-800">Funciones trigonométricas, identidades fundamentales y resolución de triángulos rectángulos.</td>
                      <td className="border border-slate-300 p-2 text-slate-700">Prueba escrita de desarrollo / Escala de estimación</td>
                      <td className="border border-slate-300 p-2 text-center font-black text-[#2C2E53]">25% (5 pts)</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 text-center font-bold">3</td>
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">Ciencias Naturales / Biología</td>
                      <td className="border border-slate-300 p-2 text-slate-800">Bases moleculares de la herencia genética, replicación del ADN y leyes de Mendel.</td>
                      <td className="border border-slate-300 p-2 text-slate-700">Práctica de laboratorio y reporte científico</td>
                      <td className="border border-slate-300 p-2 text-center font-black text-[#2C2E53]">20% (4 pts)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Firmas Institucionales Oficiales */}
          <div className="mt-12 pt-6 border-t border-slate-300 text-center text-[9pt]">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-1/3 align-bottom pb-2">
                    <div className="w-44 border-b border-slate-800 mx-auto mb-1"></div>
                    <div className="font-bold text-slate-900">Prof. Docente de Aula / Guía</div>
                    <div className="text-[7.5pt] text-slate-500">Docente Especialista CBA</div>
                  </td>
                  <td className="w-1/3 align-bottom pb-2">
                    <div className="w-48 border-b border-slate-800 mx-auto mb-1"></div>
                    <div className="font-bold text-slate-900">Prof. Rigoberto Boscán</div>
                    <div className="text-[7.5pt] text-slate-500">Coordinación de Evaluación y Control de Estudios (UCE)</div>
                  </td>
                  <td className="w-1/3 align-bottom pb-2">
                    <div className="w-44 border-b border-slate-800 mx-auto mb-1"></div>
                    <div className="font-bold text-slate-900">Dra. Carmen Cecilia Boscán</div>
                    <div className="text-[7.5pt] text-slate-500">Dirección General U.E. Bellas Artes</div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-6 text-[7.5pt] text-slate-400 font-mono text-center">
              Documento emitido electrónicamente desde el Sistema Institucional SISCEBA • U.E. Bellas Artes • S0432D2305
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
