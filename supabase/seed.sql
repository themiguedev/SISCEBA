-- ==============================================================================
-- SISTEMA INTEGRAL DE CONTROL Y EVALUACIÓN (SICE-CBA)
-- U.E.P. COLEGIO BELLAS ARTES - DATOS DE SEMILLA (SEED DATA)
-- Año Escolar: 2026 - 2027
-- ==============================================================================

-- 1. ESTUDIANTES INICIALES
INSERT INTO students (id, cedula, full_name, gender, birth_date, level, grade, section, representative_name, representative_email, representative_phone, status, pending_subjects, avatar_url)
VALUES
-- Educación Inicial (Sala de 5 Años "A")
('stu-ini-1', 'V-36.120.401', 'Sofía Valentina Morales Rincón', 'F', '2021-04-12', 'INICIAL', 'Sala de 5 Años', 'A', 'Mariana Rincón de Morales', 'mariana.rincon@gmail.com', '+58 414-6123456', 'REGULAR', '{}', 'https://images.unsplash.com/photo-1595454223600-91fbdd77e16b?w=150'),
('stu-ini-2', 'V-36.120.402', 'Santiago Andrés Padrón Castillo', 'M', '2021-06-25', 'INICIAL', 'Sala de 5 Años', 'A', 'Carlos Padrón', 'cpadron@bellasartes.edu.ve', '+58 424-7654321', 'REGULAR', '{}', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'),
('stu-ini-3', 'V-36.120.403', 'Lucas Daniel Villalobos Nava', 'M', '2021-01-18', 'INICIAL', 'Sala de 5 Años', 'A', 'Daniel Villalobos', 'dvillalobos@gmail.com', '+58 412-9871234', 'EN_REVISION', '{}', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'),

-- Educación Primaria (5to Grado "A")
('stu-pri-1', 'V-34.981.201', 'Camila Victoria Hernández Ochoa', 'F', '2015-08-14', 'PRIMARIA', '5to Grado', 'A', 'Patricia Ochoa', 'pochoa@gmail.com', '+58 414-7221133', 'REGULAR', '{}', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'),
('stu-pri-2', 'V-34.981.202', 'Alejandro José Urdaneta Silva', 'M', '2015-11-03', 'PRIMARIA', '5to Grado', 'A', 'Roberto Urdaneta', 'rurdaneta@gmail.com', '+58 416-5544332', 'REGULAR', '{}', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'),
('stu-pri-3', 'V-34.981.203', 'Isabella Cristina Finol Boscán', 'F', '2015-03-29', 'PRIMARIA', '5to Grado', 'A', 'Gabriela Boscán', 'gboscan@gmail.com', '+58 424-6332211', 'EN_REVISION', '{}', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150'),

-- Media General (4to Año "A")
('stu-med-1', 'V-31.450.812', 'Andrés Eduardo Silva Bermúdez', 'M', '2009-05-20', 'MEDIA_GENERAL', '4to Año', 'A', 'Dra. María Bermúdez', 'mbermudez@clinicafalcon.com', '+58 414-6339900', 'REGULAR', '{}', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('stu-med-2', 'V-32.901.442', 'Camila Isabella Urdaneta Moreno', 'F', '2009-08-11', 'MEDIA_GENERAL', '4to Año', 'A', 'Ing. Carlos Urdaneta', 'curdaneta@oilfield.com', '+58 414-6338901', 'REGULAR', '{}', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
('stu-med-3', 'V-32.880.114', 'Mateo Sebastián Chacín Portillo', 'M', '2009-02-14', 'MEDIA_GENERAL', '4to Año', 'A', 'Lic. Patricia Portillo', 'pportillo@banco.com.ve', '+58 424-6112233', 'EN_REVISION', ARRAY['Física'], 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
('stu-med-4', 'V-31.990.231', 'Sofía Valentina Morales Rincón', 'F', '2009-11-30', 'MEDIA_GENERAL', '4to Año', 'A', 'Sr. Roberto Morales', 'rmorales@moralescorp.com', '+58 412-5556677', 'REGULAR', '{}', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'),
('stu-med-5', 'V-32.741.009', 'Sebastián Alejandro Romero Parra', 'M', '2009-07-09', 'MEDIA_GENERAL', '4to Año', 'A', 'Dra. Elena Parra de Romero', 'eparra@unizulia.edu.ve', '+58 414-7890123', 'MATERIA_PENDIENTE', ARRAY['Física (3er Año)'], 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150')
ON CONFLICT (id) DO NOTHING;

-- 2. ASIGNATURAS Y MALLA CURRICULAR
INSERT INTO subject_areas (id, code, name, level, type, weekly_hours, area_profile, teacher_profile, icon_name)
VALUES
-- Inicial
('ini-fp', 'INI-FP', 'Formación personal', 'INICIAL', 'REGULAR', 8, 'Fomenta el autoconcepto positivo, la autonomía personal, la convivencia armónica y valores.', 'Licenciado/a en Educación Inicial con formación en psicología evolutiva.', 'Heart'),
('ini-ca', 'INI-CA', 'Componentes del ambiente', 'INICIAL', 'REGULAR', 6, 'Desarrolla la curiosidad científica natural, exploración sensory-motora y nociones lógicas.', 'Docente de Educación Inicial con competencias en método inductivo.', 'Globe'),
('ini-ap', 'INI-AP', 'Artes Plásticas', 'INICIAL', 'REGULAR', 4, 'Estimula la motricidad fina, expresión gráfica y libertad creativa.', 'Especialista en artes visuales infantiles.', 'Palette'),
('ini-mus', 'INI-MUS', 'Música (Integrada)', 'INICIAL', 'INTEGRADA', 3, 'Sensibilización rítmica, discriminación auditiva y ensamble coral.', 'Profesor/a de Educación Musical método Orff y Kodály.', 'Music'),
('ini-ef', 'INI-EF', 'Educación Física (Integrada)', 'INICIAL', 'INTEGRADA', 3, 'Psicomotricidad global, equilibrio y esquema corporal.', 'Licenciado/a en Educación Física infantil.', 'Activity'),
('ini-aje', 'INI-AJE', 'Ajedrez (Integrada)', 'INICIAL', 'INTEGRADA', 2, 'Iniciación al tablero, ubicación espacial y concentración.', 'Instructor de Ajedrez Escolar avalado por FVA.', 'Award'),
('ini-nat', 'INI-NAT', 'Natación (Integrada)', 'INICIAL', 'INTEGRADA', 2, 'Familiarización con el agua, flotación y coordinación.', 'Entrenador de Natación Formativa y Salvavidas Certificado.', 'Waves'),
('ini-inf', 'INI-INF', 'Informática & Robótica Inicial', 'INICIAL', 'INTEGRADA', 2, 'Pensamiento lógico computacional temprano mediante kits sensoriales.', 'Ingeniero de Sistemas o Docente en Computación Educativa.', 'Cpu'),
('ini-ing', 'INI-ING', 'Inglés Preescolar', 'INICIAL', 'REGULAR', 4, 'Inmersión lúdica al idioma inglés mediante canciones y cuentos.', 'Docente bilingüe especialista en enseñanza temprana (ESL/TEFL).', 'Languages'),

-- Primaria
('pri-len', 'PRI-LEN', 'Lenguaje, Comunicación y Cultura', 'PRIMARIA', 'REGULAR', 7, 'Desarrollo integral de competencias lingüísticas, comprensión crítica y producción textual.', 'Licenciado/a en Educación Integral con mención en Lengua y Literatura.', 'BookOpen'),
('pri-mat', 'PRI-MAT', 'Matemáticas, Cs. Naturales y Sociedad', 'PRIMARIA', 'REGULAR', 7, 'Pensamiento lógico-matemático, cálculo operacional, geometría y método científico.', 'Licenciado/a en Educación Primaria especialista en Didáctica de las Matemáticas.', 'Calculator'),
('pri-soc', 'PRI-SOC', 'Ciencias Sociales y Ciudadanía', 'PRIMARIA', 'REGULAR', 4, 'Comprensión del proceso histórico nacional, identidad marabina, valores ciudadanos y ética.', 'Docente con experiencia en Geohistoria Escolar y Ciencias Sociales.', 'Compass'),
('pri-ap', 'PRI-AP', 'Artes Plásticas', 'PRIMARIA', 'REGULAR', 3, 'Expresión plástica bidimensional y tridimensional, teoría del color y patrimonio artístico.', 'Licenciado en Artes Plásticas o Educación Artística.', 'Palette'),
('pri-mus', 'PRI-MUS', 'Música (Integrada)', 'PRIMARIA', 'INTEGRADA', 2, 'Teoría musical aplicada, práctica coral y ejecución de instrumentos orquestales.', 'Músico profesional con formación pedagógica del Sistema Nacional de Orquestas.', 'Music'),
('pri-ef', 'PRI-EF', 'Educación Física (Integrada)', 'PRIMARIA', 'INTEGRADA', 3, 'Aptitud física, disciplinas predeportivas, fundamentos de atletismo y juego limpio.', 'Licenciado en Educación Física y Deporte Escolar.', 'Activity'),
('pri-aje', 'PRI-AJE', 'Ajedrez (Integrada)', 'PRIMARIA', 'INTEGRADA', 2, 'Aperturas, táctica, cálculo de variantes y juego estratégico formativo.', 'Maestro Nacional de Ajedrez con enfoque pedagógico.', 'Award'),
('pri-nat', 'PRI-NAT', 'Natación (Integrada)', 'PRIMARIA', 'INTEGRADA', 2, 'Dominio técnico de estilos libre, espalda y pecho.', 'Entrenador de Natación de Alto Rendimiento Escolar.', 'Waves'),
('pri-rob', 'PRI-ROB', 'Robótica & Computación', 'PRIMARIA', 'INTEGRADA', 2, 'Programación en bloques (Scratch), diseño algorítmico y sensores modulares.', 'Ingeniero en Computación/Mecatrónica con vocación pedagógica.', 'Cpu'),
('pri-ing', 'PRI-ING', 'Inglés Primaria', 'PRIMARIA', 'REGULAR', 5, 'Adquisición de fluidez comunicativa verbal y escrita, vocabulario y gramática funcional.', 'Licenciado en Idiomas Modernos con acreditación Cambridge/TOEFL.', 'Languages'),

-- Media General
('med-cas', 'MED-CAS', 'Castellano', 'MEDIA_GENERAL', 'REGULAR', 4, 'Análisis literario universal y latinoamericano, redacción académica y retórica.', 'Licenciado en Letras o Educación mención Lengua y Literatura.', 'BookOpen'),
('med-ing', 'MED-ING', 'Inglés y Otras Lenguas', 'MEDIA_GENERAL', 'REGULAR', 4, 'Dominio del marco B2/C1, producción de ensayos argumentativos y debate formal.', 'Licenciado en Idiomas Modernos mención Inglés Técnico y Académico.', 'Languages'),
('med-mat', 'MED-MAT', 'Matemáticas', 'MEDIA_GENERAL', 'REGULAR', 5, 'Álgebra formal, trigonometría, geometría analítica y cálculo infinitesimal.', 'Licenciado en Educación mención Matemáticas o Matemático Puro.', 'Calculator'),
('med-ef', 'MED-EF', 'Educación Física', 'MEDIA_GENERAL', 'REGULAR', 3, 'Acondicionamiento físico, fisiología del ejercicio y arbitraje deportivo.', 'Licenciado en Educación Física y Entrenamiento Deportivo.', 'Activity'),
('med-qui', 'MED-QUI', 'Química', 'MEDIA_GENERAL', 'REGULAR', 4, 'Química general, estequiometría, termodinámica y prácticas de laboratorio.', 'Licenciado en Química o Ingeniero Químico con componente docente.', 'FlaskConical'),
('med-fis', 'MED-FIS', 'Física', 'MEDIA_GENERAL', 'REGULAR', 4, 'Cinemática, dinámica newtoniana, electromagnetismo y cálculo vectorial.', 'Licenciado en Física o Ingeniero Mecánico/Eléctrico con componente docente.', 'Zap'),
('med-bio', 'MED-BIO', 'Biología', 'MEDIA_GENERAL', 'REGULAR', 4, 'Genética molecular, evolución biológica, anatomía humana y microbiología.', 'Licenciado en Biología o Médico Cirujano con diplomado docente.', 'Dna'),
('med-ghc', 'MED-GHC', 'Geografía, Historia y Ciudadanía', 'MEDIA_GENERAL', 'REGULAR', 4, 'Geopolítica contemporánea, historia económica de Venezuela y soberanía.', 'Licenciado en Educación mención Ciencias Sociales o Sociólogo.', 'Compass'),
('med-ocv', 'MED-OCV', 'Orientación y Convivencia', 'MEDIA_GENERAL', 'REGULAR', 2, 'Proyecto de vida, vocación profesional, resolución de conflictos y ciudadanía.', 'Psicólogo Escolar o Licenciado en Orientación Educativa.', 'Users'),
('med-rob', 'MED-ROB', 'Robótica (Integrada)', 'MEDIA_GENERAL', 'INTEGRADA', 3, 'Sistemas embebidos (ESP32/Arduino), IoT, visión artificial y automatización.', 'Ingeniero en Mecatrónica, Electrónica o Sistemas.', 'Cpu'),
('med-ag', 'MED-AG', 'Artes Gráficas (Integrada)', 'MEDIA_GENERAL', 'INTEGRADA', 3, 'Diseño digital editorial, modelado 3D, identidad corporativa y animación.', 'Diseñador Gráfico o Licenciado en Artes Audiovisuales.', 'Palette'),
('med-fin', 'MED-FIN', 'Finanzas & Emprendimiento', 'MEDIA_GENERAL', 'INTEGRADA', 3, 'Educación financiera, modelos Canvas, mercadeo y economía personal.', 'Economista o Administrador de Empresas con experiencia de mercado.', 'TrendingUp')
ON CONFLICT (id) DO NOTHING;

-- 3. CALIFICACIONES PROCESALES INICIALES
INSERT INTO evaluation_records (id, student_id, area_id, moment, lapso, score_numeric, score_qualitative, score_literal, observations, recorded_at, teacher_id)
VALUES
('eval-01', 'stu-med-1', 'med-mat', 'PROCESAL', 1, 19.00, NULL, NULL, 'Dominio sobresaliente en resolución analítica y gráfica de funciones polinómicas y racionales.', '2026-09-17', 'prof-docente-1'),
('eval-02', 'stu-med-1', 'med-fis', 'PROCESAL', 1, 18.00, NULL, NULL, 'Rigor impecable en el despeje de fórmulas y resolución de vectores en MRUV.', '2026-09-17', 'prof-docente-1'),
('eval-03', 'stu-med-1', 'med-qui', 'PROCESAL', 1, 19.00, NULL, NULL, 'Excelente informe técnico de laboratorio sobre preparación de soluciones y valoraciones.', '2026-09-17', 'prof-docente-1'),
('eval-04', 'stu-med-2', 'med-mat', 'PROCESAL', 1, 17.00, NULL, NULL, 'Muy buen desenvolvimiento en operaciones algebraicas complejas y trabajo en equipo.', '2026-09-17', 'prof-docente-1'),
('eval-05', 'stu-med-2', 'med-cas', 'PROCESAL', 1, 20.00, NULL, NULL, 'Ensayo analítico brillante con vocabulario sofisticado y sintaxis perfecta.', '2026-09-17', 'prof-docente-1'),
('eval-06', 'stu-med-3', 'med-mat', 'PROCESAL', 1, 12.00, NULL, NULL, 'Superó la prueba procesal tras cumplir con la guía remedial de polinomios.', '2026-09-17', 'prof-docente-1'),
('eval-07', 'stu-med-3', 'med-fis', 'PROCESAL', 1, 09.00, NULL, NULL, 'En revisión. Requiere refuerzo inmediato en trigonometría aplicada y descomposición vectorial.', '2026-09-17', 'prof-docente-1'),
('eval-08', 'stu-med-4', 'med-qui', 'PROCESAL', 1, 16.00, NULL, NULL, 'Recuperó satisfactoriamente los contenidos tras justificar reposo médico.', '2026-09-17', 'prof-docente-1'),
('eval-09', 'stu-med-5', 'med-fis', 'PROCESAL', 1, 08.00, NULL, NULL, 'Alerta de materia pendiente. Se citó al representante para firma de acta de compromiso.', '2026-09-17', 'prof-docente-1'),
('eval-10', 'stu-pri-1', 'pri-len', 'PROCESAL', 1, NULL, 'L', NULL, 'Lectura comprensiva de alta fluidez y redacción creativa de textos narrativos.', '2026-09-17', 'prof-pri-1'),
('eval-11', 'stu-pri-1', 'pri-rob', 'PROCESAL', 1, NULL, 'L', NULL, 'Lógica de bucles y condicionales en bloques desarrollada con total exactitud.', '2026-09-17', 'prof-pri-1'),
('eval-12', 'stu-ini-1', 'ini-inf', 'DIAGNOSTICA', 1, NULL, NULL, 'A', 'Reconoce comandos espaciales, trabajo colaborativo consolidado.', '2026-09-17', 'prof-ini-1')
ON CONFLICT (id) DO NOTHING;

-- 4. PASES DE RETRASO Y PORTERÍA
INSERT INTO pass_records (id, ticket_number, student_id, student_name, grade_section, date, time, reason, authorized_by, printed)
VALUES
('pass-001', 'RET-2026-0842', 'stu-med-3', 'Mateo Sebastián Chacín Portillo', '4to Año A', '2026-09-17', '07:22 AM', 'Congestión vehicular severa en Av. Bella Vista', 'Portería / Prof. Marcos Andrade', true),
('pass-002', 'RET-2026-0843', 'stu-pri-2', 'Alejandro José Urdaneta Silva', '5to Grado A', '2026-09-17', '07:35 AM', 'Cita odontológica a primera hora con justificativo', 'Portería / Coord. Primaria', false),
('pass-003', 'RET-2026-0844', 'stu-med-1', 'Andrés Eduardo Silva Bermúdez', '4to Año A', '2026-09-16', '07:18 AM', 'Avería mecánica en transporte escolar institucional', 'Portería Principal CBA', true)
ON CONFLICT (id) DO NOTHING;

-- 5. ASISTENCIA DIARIA
INSERT INTO daily_attendance (id, student_id, student_name, grade_section, date, status, justification, lapso)
VALUES
('att-d-1', 'stu-med-1', 'Andrés Eduardo Silva Bermúdez', '4to Año A', '2026-09-17', 'PRESENTE', 'Asistencia puntual y uniforme reglamentario.', 1),
('att-d-2', 'stu-med-2', 'Camila Isabella Urdaneta Moreno', '4to Año A', '2026-09-17', 'PRESENTE', 'Asistencia puntual.', 1),
('att-d-3', 'stu-med-3', 'Mateo Sebastián Chacín Portillo', '4to Año A', '2026-09-17', 'RETRASO', 'Ingreso con pase de portería foliado RET-2026-0842.', 1),
('att-d-4', 'stu-med-4', 'Sofía Valentina Morales Rincón', '4to Año A', '2026-09-17', 'INASISTENCIA_JUSTIFICADA', 'Reposo pediátrico por afección respiratoria temporal.', 1),
('att-d-5', 'stu-med-5', 'Sebastián Alejandro Romero Parra', '4to Año A', '2026-09-17', 'PRESENTE', 'Asistencia confirmada en lista matutina.', 1)
ON CONFLICT (id) DO NOTHING;

-- 6. SOLICITUDES DE DOCUMENTOS (SLA SECRETARÍA)
INSERT INTO document_requests (id, tracking_code, representative_name, student_name, grade_section, document_type, department, request_date, elapsed_days, status, notes)
VALUES
('doc-req-101', 'SOL-CBA-2026-019', 'Ing. Carlos Urdaneta', 'Camila Isabella Urdaneta Moreno', '4to Año A', 'Constancia de Estudio', 'Control de Estudios', '2026-09-14', 3, 'LISTO_ENTREGA', 'Firmada por Director y con sello húmedo oficial.'),
('doc-req-102', 'SOL-CBA-2026-020', 'Dra. María Bermúdez', 'Andrés Eduardo Silva Bermúdez', '4to Año A', 'Notas Certificadas', 'Control de Estudios', '2026-09-15', 2, 'EN_TRAMITE', 'En revisión de folio y firmas para trámite universitario exterior.'),
('doc-req-103', 'SOL-CBA-2026-021', 'Sr. Roberto Morales', 'Sofía Valentina Morales Rincón', '4to Año A', 'Solvencia Administrativa', 'Administración', '2026-09-16', 1, 'LISTO_ENTREGA', 'Emitida con balance cero.'),
('doc-req-104', 'SOL-CBA-2026-022', 'Lic. Patricia Portillo', 'Mateo Sebastián Chacín Portillo', '4to Año A', 'Carta de Buena Conducta', 'Dirección', '2026-09-17', 0, 'PENDIENTE', 'Requerida para solicitud de visa estudiantil.')
ON CONFLICT (id) DO NOTHING;

-- 7. BLOQUEOS ADMINISTRATIVOS
INSERT INTO administrative_blocks (id, representative_id, representative_name, student_id, student_name, grade_section, reason, block_date, active, debt_amount)
VALUES
('block-01', 'rep-colina', 'Sr. David Colina Villalobos', 'stu-med-3', 'Franco David Colina Rivas', '2do Año B', 'Mora acumulada de mensualidades escolares (Mayo - Julio 2026). Requiere acuerdo en Administración.', '2026-09-10', true, '$180.00 USD')
ON CONFLICT (id) DO NOTHING;

-- 8. TÍTULOS DE BACHILLER REGISTRADOS
INSERT INTO title_records (id, student_id, student_name, cedula, school_year, graduation_year, serial_number, tomo, folio, registered_code, calibrated)
VALUES
('tit-01', 'stu-med-1', 'Andrés Eduardo Silva Bermúdez', 'V-32.890.112', '2026-2027', '2027', 'MIN-MPPE-2027-09412', 'LVII', '084', 'REG-CBA-TIT-084', true),
('tit-02', 'stu-med-2', 'Camila Isabella Urdaneta Moreno', 'V-32.954.887', '2026-2027', '2027', 'MIN-MPPE-2027-09413', 'LVII', '085', 'REG-CBA-TIT-085', true)
ON CONFLICT (id) DO NOTHING;

-- 9. NOTICIAS Y CARTELERA COMUNITARIA
INSERT INTO community_notices (id, title, content, date, type, target_audience, author, pinned)
VALUES
('not-01', 'Apertura Formal del Año Escolar 2026-2027 y Nuevos Laboratorios STEAM', 'La Dirección General del Colegio Bellas Artes da la más cordial bienvenida a toda nuestra comunidad educativa.', '2026-09-16', 'NOTICIA', 'TODOS', 'Dirección General CBA', true),
('not-02', 'Cronograma de Entrega de Planificaciones Quincenales a Coordinación', 'Estimados docentes: recordamos consignar sus formatos de Primaria y Media General a través de la plataforma SICE-CBA.', '2026-09-17', 'ANUNCIO_URGENTE', 'DOCENTES', 'Coordinación Académica', false),
('not-03', 'Reunión General de Padres: Inducción a la Plataforma CBA', 'Convocatoria para representantes de nuevo ingreso en el Auditorio Principal el viernes 25 de septiembre a las 8:00 AM.', '2026-09-15', 'EVENTO', 'REPRESENTANTES', 'Departamento de Orientación', false)
ON CONFLICT (id) DO NOTHING;

-- 10. NOTIFICACIONES DEL SISTEMA
INSERT INTO system_notifications (id, title, message, timestamp, read, category, priority, recipient_role, student_name, action_tab, action_sub_tab, delivery_channels)
VALUES
('notif-1', 'Notas Publicadas • Castellano y Literatura', 'El Prof. Docente ha cargado las calificaciones procesales del Lapso 1. Notificación enviada a 4 representantes y alumnos.', 'Hace 10 min', false, 'CALIFICACIONES', 'ALTA', 'TODOS', 'Sofía Chacín y grupo', 'MEDIA_GENERAL', 'BOLETIN', ARRAY['PORTAL', 'EMAIL', 'SMS_WHATSAPP']),
('notif-2', 'Aviso de Portería • Pase de Retraso Emitido', 'Se registró el ingreso con retraso (07:28 AM) para Sofía Chacín. Notificado al representante vía SMS institucional.', 'Hace 45 min', false, 'ASISTENCIA', 'MEDIA', 'REPRESENTANTE', 'Sofía Chacín', 'GESTION', 'PASES', ARRAY['PORTAL', 'SMS_WHATSAPP']),
('notif-3', 'Constancia de Estudio Lista', 'La solicitud de Constancia de Estudio (CBA-DOC-2026-081) ha sido firmada y sellada en Control de Estudios.', 'Hace 2 horas', true, 'DOCUMENTOS', 'MEDIA', 'REPRESENTANTE', 'Diego Alejandro Silva', 'GESTION', 'DOCUMENTOS', ARRAY['PORTAL', 'EMAIL']),
('notif-4', 'Apertura de Lapso 1 • Carga de Evaluaciones', 'Dirección y Control de Estudios han habilitado el Lapso 1 para el registro formal de planes e indicadores.', 'Ayer', true, 'INSTITUCIONAL', 'BAJA', 'DOCENTE', NULL, 'CONFIGURACION', 'LAPSOS', ARRAY['PORTAL'])
ON CONFLICT (id) DO NOTHING;

-- 11. USUARIOS Y CUENTAS DE PRUEBA (POR MODO DE OPERACIÓN)
DELETE FROM app_users;

INSERT INTO app_users (id, username, password, full_name, email, role, default_level, active, avatar_url)
VALUES
('usr-admin', 'admin', 'cba2026*admin', 'Administrador General de Sistemas', 'admin@bellasartes.edu.ve', 'ADMINISTRADOR', 'MEDIA_GENERAL', true, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
('usr-director', 'director', 'cba2026*director', 'Prof. Director General CBA', 'director@bellasartes.edu.ve', 'DIRECTOR', 'MEDIA_GENERAL', true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('usr-coordinador', 'coordinador', 'cba2026*coordinador', 'Lic. Coordinación Control de Estudios (UCE)', 'coordinacion@bellasartes.edu.ve', 'COORDINACION', 'MEDIA_GENERAL', true, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
('usr-docente', 'docente', 'cba2026*docente', 'Prof. Docente Titular CBA', 'docente@bellasartes.edu.ve', 'DOCENTE', 'MEDIA_GENERAL', true, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
('usr-representante', 'representante', 'cba2026*representante', 'Padre y Representante Legal CBA', 'representante@bellasartes.edu.ve', 'REPRESENTANTE', 'MEDIA_GENERAL', true, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'),
('usr-estudiante', 'estudiante', 'cba2026*estudiante', 'Camila Isabella Urdaneta Moreno', 'estudiante@bellasartes.edu.ve', 'ESTUDIANTE', 'MEDIA_GENERAL', true, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
('usr-asistente', 'asistente', 'cba2026*asistente', 'Lic. Asistente de Asistencia y Disciplina', 'asistente@bellasartes.edu.ve', 'ASISTENTE', 'MEDIA_GENERAL', true, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150')
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  default_level = EXCLUDED.default_level,
  active = EXCLUDED.active,
  avatar_url = EXCLUDED.avatar_url;

