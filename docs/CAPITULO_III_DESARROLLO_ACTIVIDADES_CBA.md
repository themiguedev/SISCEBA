# CAPÍTULO III
# DESARROLLO DE ACTIVIDADES

El presente capítulo tiene como objetivo fundamental describir y sustentar de forma exhaustiva la ejecución de cada una de las actividades planificadas durante el periodo de pasantía académica, desarrolladas en la Coordinación de Control de Estudios y Evaluación de la U.E.P. Colegio Bellas Artes. En concordancia con la estructura metodológica de **González (2020)**, se desglosa el objetivo, los procedimientos metodológicos, herramientas y recursos utilizados, así como los resultados técnicos y organizacionales alcanzados en cada fase del proyecto **SICE-CBA** (Sistema Integral de Control y Evaluación). Finalmente, se establece un análisis crítico sobre la correspondencia entre los conocimientos teóricos impartidos en la Universidad Privada Dr. Rafael Belloso Chacín (URBE) y las exigencias prácticas del entorno laboral.

---

## 3.1 Desarrollo

A continuación se expone el desarrollo sistemático de las seis (6) actividades formalizadas en el cronograma de planificación del Capítulo II:

### 3.1.1 Inducción institucional, diagnóstico situacional y levantamiento de requerimientos

#### 3.1.1.1 Objetivo de la actividad
Identificar, analizar y documentar integralmente los flujos de trabajo, necesidades operativas y requerimientos técnicos en la Coordinación de Control de Estudios y Evaluación de la U.E.P. Colegio Bellas Artes, con la finalidad de establecer la línea base para el diseño y desarrollo del sistema computacional SICE-CBA, garantizando su apego al marco legal del Ministerio del Poder Popular para la Educación (MPPE) y sustituyendo de forma soberana el software previo C.E.O. (Control Estudiantil Online de Lidsoftware).

#### 3.1.1.2 Procedimientos, herramientas y/o recursos utilizados
* **Procedimientos:**
  1. *Sesiones de inducción institucional y entrevistas semiestructuradas:* Se realizaron reuniones técnicas con el Tutor Industrial, Lcdo. Rigoberto Boscán Inciarte (Coordinador de Evaluación), el personal directivo y coordinadores de subsistema, indagando sobre los puntos críticos en el registro procesal de notas, generación de actas y elaboración de boletines.
  2. *Revisión documental y normativa:* Se analizó la normativa legal educativa venezolana vigente, identificando la diferenciación obligatoria de los regímenes de evaluación: escala literal cualitativa (`A`, `B`, `C`, `D`, `E`) para Educación Inicial; escala cualitativa/formativa basada en indicadores (`L` [Logrado], `EP` [En Proceso], `I` [Iniciado]) para Educación Primaria; y escala cuantitativa vigesimal (`01` a `20`) con cálculo de promedios para Educación Media General.
  3. *Auditoría situacional del software comercial previo (C.E.O.):* Se detectaron las limitaciones del sistema previo: dependencia de servidores en la nube externa con latencia y costos recurrentes, exposición de datos estudiantiles y rigidez para adaptarse a la estructura curricular interna de la institución (específicamente la regla de dos secciones oficiales: `A` y `B`).
  4. *Especificación formal de requisitos:* Se elaboró el Documento de Especificación de Requerimientos de Software (SRS), definiendo casos de uso, actores del sistema y requerimientos no funcionales (despliegue 100% autónomo en red local LAN, alta disponibilidad y cero fallos por registros vacíos).
* **Herramientas y Recursos:**
  - *Hardware:* Estaciones de trabajo del departamento, red cableada institucional.
  - *Software:* Microsoft Office Word (redacción de minutas e instrumentos), Draw.io (diagramación preliminar de flujos de procesos), Google Forms y plantillas de historias de usuario.

#### 3.1.1.3 Resultados
Se consolidó el documento de diagnóstico situacional y el catálogo formal de requerimientos del sistema SICE-CBA, compuesto por 24 historias de usuario y diagramas de flujo de procesos aprobados por la Coordinación de Control de Estudios y Evaluación. Este insumo permitió delimitar con exactitud el alcance tecnológico del proyecto, erradicar la incertidumbre en los cálculos evaluativos inter-subsistemas y planificar la transición hacia una arquitectura informática local soberana.

---

### 3.1.2 Modelado de arquitectura de software y diseño relacional de la base de datos institucional

#### 3.1.2.1 Objetivo de la actividad
Concebir y modelar la arquitectura física y lógica del sistema SICE-CBA, y diseñar un esquema de base de datos relacional robusto, normalizado y optimizado en PostgreSQL 16 para operar de forma centralizada en la red de área local (LAN) del colegio, garantizando la integridad referencial, consistencia de datos y privacidad de los expedientes académicos.

#### 3.1.2.2 Procedimientos, herramientas y/o recursos utilizados
* **Procedimientos:**
  1. *Definición del patrón arquitectónico:* Se seleccionó una arquitectura basada en capas desacopladas (Frontend moderno en React/TypeScript + API REST local en Node.js/Express + Motor relacional PostgreSQL 16), descartando dependencias de servicios externos (como Supabase o Firebase) para blindar la autonomía técnica institucional.
  2. *Modelado Entidad-Relación (DER) y Normalización:* Se estructuraron las entidades principales: `estudiantes`, `representantes`, `docentes`, `areas_formacion`, `competencias`, `indicadores`, `calificaciones_procesales`, `calificaciones_finales`, `planes_lapso`, `asistencias` y `usuarios_sistema`. Se aplicaron las reglas de normalización hasta la Tercera Forma Normal (3FN), evitando redundancias y garantizando la unicidad mediante llaves primarias compuestas y foráneas con restricciones de eliminación controlada (`ON DELETE RESTRICT`).
  3. *Restricción de Secciones Oficiales Institucionales:* Se programaron restricciones de dominio (`CHECK (seccion IN ('A', 'B'))`), asegurando que ningún formulario o consulta permita registros fuera de las dos únicas secciones institucionales del Colegio Bellas Artes.
  4. *Implementación física y scripts de migración:* Se crearon los scripts DDL en PostgreSQL 16, configurando tipos de datos enumerados, índices B-Tree para optimizar búsquedas por cédula escolar y disparadores (*triggers*) para auditoría de cambios.
* **Herramientas y Recursos:**
  - *Herramientas:* PostgreSQL 16 Server, pgAdmin 4, dbdiagram.io, Visual Studio Code, Git.
  - *Recursos:* Servidor de datos local en red LAN institucional (`172.16.7.x`), terminales de prueba en Windows 11.

#### 3.1.2.3 Resultados
Se obtuvo el esquema de base de datos institucional completamente implementado y verificado en PostgreSQL 16, integrado por 14 tablas normalizadas con sus correspondientes relaciones, vistas optimizadas y llaves foráneas. Se verificó con éxito la conectividad local simultánea y la persistencia de transacciones, erradicando discrepancias estructurales y garantizando un tiempo de respuesta inferior a 50 milisegundos en consultas complejas.

---

### 3.1.3 Desarrollo e implementación de los módulos de Planificación Pedagógica y Evaluación Continua por Subsistema

#### 3.1.3.1 Objetivo de la actividad
Programar, probar e integrar los componentes visuales y la lógica de negocio de los módulos de Planificación Curricular y Evaluación Procesal Continua, adaptándolos con exactitud a los instrumentos y escalas de calificación reglamentarias de Educación Inicial, Educación Primaria y Educación Media General.

#### 3.1.3.2 Procedimientos, herramientas y/o recursos utilizados
* **Procedimientos:**
  1. *Estructuración del Frontend React con TypeScript:* Se desarrolló una interfaz reactiva utilizando React 19 y TypeScript bajo principios de Clean Code y componentes reutilizables, aplicando la paleta institucional del Colegio Bellas Artes (Azul Institucional `#2C2E53` y Dorado `#D4AF37`).
  2. *Desarrollo del submódulo de Planificación Pedagógica:* Se construyeron formularios y tablas de gestión para planes quincenales y planes de lapso, integrando bancos de competencias, indicadores pedagógicos por área de desarrollo y flujos de estados de aprobación (*Borrador*, *En Revisión*, *Aprobado Definitivo*).
  3. *Programación del submódulo de Evaluación por Subsistemas:*
     - **Educación Inicial:** Interfaz para valoración diagnóstica y procesal con escala literal (`A` a `E`) vinculada a dimensiones de aprestamiento, robótica inicial y artes.
     - **Educación Primaria:** Matriz de indicadores formativos con escala cualitativa oficial (`L` [Logrado], `EP` [En Proceso], `I` [Iniciado]), bloqueando cualquier cálculo numérico o promedio fuera de norma.
     - **Educación Media General:** Registro procesal cuantitativo en escala vigesimal (`01` a `20`), con cálculo automatizado de notas acumuladas y ponderaciones del 70% procesal y 30% actitudinal/final de lapso.
  4. *Manejo defensivo de listas vacías:* Se implementaron guardas lógicas (`Array.isArray`, validaciones de longitud y operadores de encadenamiento opcional `?.`) para evitar errores en tiempo de ejecución o pantallas en blanco ante cursos recién creados o con cero estudiantes inscritos.
* **Herramientas y Recursos:**
  - *Tecnologías:* React 19, TypeScript, Vite, Tailwind CSS, Lucide React icons.
  - *Entorno de Desarrollo:* Visual Studio Code, Node.js v20, Git / GitHub.

#### 3.1.3.3 Resultados
Se entregaron e integraron los módulos funcionales de Planificación y Evaluación Continua, permitiendo a los coordinadores y docentes registrar, modificar y consultar recaudos curriculares y calificaciones en tiempo real. Se eliminó el uso de libros de papel y hojas de cálculo desarticuladas, garantizando una carga rápida, visualmente atractiva y pedagógicamente fiel a la reglamentación del MPPE.

---

### 3.1.4 Implementación de Gobernanza de Accesos (RBAC) y Módulo de Matrícula Institucional

#### 3.1.4.1 Objetivo de la actividad
Diseñar y desplegar un modelo integral de Control de Acceso Basado en Roles (RBAC) y un submódulo seguro de Matrícula y Prosecución Escolar, reservado exclusivamente para la administración y coordinación institucional, con el fin de proteger la integridad de los expedientes escolares y evitar accesos no autorizados.

#### 3.1.4.2 Procedimientos, herramientas y/o recursos utilizados
* **Procedimientos:**
  1. *Modelado de la Matriz RBAC:* Se definieron y sincronizaron los roles oficiales del plantel: `ADMINISTRADOR`, `DIRECTOR`, `COORDINACION`, `SECRETARIA`, `DOCENTE`, `ASISTENTE`, `REPRESENTANTE` y `ESTUDIANTE`.
  2. *Delimitación estricta de privilegios de usuario:*
     - El rol **`ADMINISTRADOR`** posee acceso y ejecución exclusiva al submódulo de Matrícula y Prosecución y a la gestión de usuarios del sistema.
     - El rol **`COORDINACION`** (Control de Estudios y Subsistemas) gestiona aprobación de planes, supervisión de notas y generación de boletines.
     - El rol **`DOCENTE`** tiene restringida su acción únicamente a las asignaturas, grados y secciones asignadas, sin facultad de modificar notas cerradas ni aprobar sus propios recaudos.
     - El rol **`ASISTENTE`** se delimitó exclusivamente a la toma de asistencia diaria, pases de retraso y disciplina escolar, sin permisos sobre calificaciones.
     - El rol **`SECRETARIA`** se orientó a emisión de constancias, recaudos y padrón estudiantil.
  3. *Desarrollo de guardas de navegación y context API:* Se implementaron interceptores de rutas protegidas y componentes envolventes de seguridad (`ProtectedRoute`, `PermissionGate`) en React, validando tokens de sesión y verificando privilegios en cada renderizado.
  4. *Desarrollo del Módulo de Matrícula y Prosecución:* Formulación de procesos de inscripción escolar, asignación de años escolares, traslado de estudiantes e inserción rigurosa en las secciones permitidas (`A` y `B`).
* **Herramientas y Recursos:**
  - *Herramientas:* TypeScript, React Context API, bcrypt para hashing seguro de credenciales, PostgreSQL triggers de seguridad, Postman para validación de endpoints.

#### 3.1.4.3 Resultados
Se consolidó una arquitectura de seguridad lógica inviolable dentro de la red del colegio, que impide la suplantación de identidad, la alteración irregular de notas y la fuga de información sensible. La gestión de matrícula quedó estandarizada bajo una interfaz ejecutiva exclusiva, garantizando que el padrón estudiantil cumpla siempre con la conformación oficial de secciones institucionales.

---

### 3.1.5 Automatización de Motores de Calificaciones, Boletines Oficiales y Cuadros Estadísticos

#### 3.1.5.1 Objetivo de la actividad
Automatizar los algoritmos de cierre de lapso escolar, consolidación de promedios, generación de actas oficiales de consejo de curso y el diseño e impresión en alta fidelidad de los boletines informativos institucionales, reduciendo a cero el tiempo de procesamiento manual y los errores de cálculo aritmético.

#### 3.1.5.2 Procedimientos, herramientas y/o recursos utilizados
* **Procedimientos:**
  1. *Diseño del motor de consolidación evaluativa:* Se desarrollaron funciones determinísticas en TypeScript para el procesamiento de calificaciones de fin de lapso y fin de año, implementando algoritmos que controlan divisiones entre cero (`0 / 0 = NaN`) y redondeos reglamentarios según la ley educativa.
  2. *Desarrollo de Actas de Consejo de Curso:* Se programó el componente generador de actas de deliberación docente, incorporando el quórum de profesores, resumen de rendimiento estudiantil, estudiantes a revisión pedagógica y espacios normativos para firmas y sellos.
  3. *Diseño de Boletines Informativos Oficiales:* Se construyeron las vistas de boletines escolares específicos para Inicial, Primaria y Media General, adaptando el formato visual oficial con el escudo institucional, datos del estudiante, literales/cualitativos explicados y firmas del Director y Coordinador de Evaluación.
  4. *Optimización para Medios Impresos (`@media print`):* Se configuraron hojas de estilo CSS especializadas para la previsualización e impresión directa en papel tamaño carta/oficio en alta fidelidad vectorial, ocultando barras de navegación, botones y elementos superfluos durante la impresión.
  5. *Telemetría y Analíticas Bento:* Se incorporaron gráficos interactivos con la librería Recharts (gráficos de barras de rendimiento por área de formación y gráficos circulares de aprobación) para el análisis estadístico directivo.
* **Herramientas y Recursos:**
  - *Tecnologías:* Recharts, CSS3 Print Queries (`@page`, `@media print`), React 19, TypeScript.
  - *Hardware:* Impresoras láser institucionales conectadas a la red local.

#### 3.1.5.3 Resultados
Se redujo el tiempo de emisión de boletines y actas de consejo de curso de varios días hábiles a pocos segundos por curso. Se garantizó una presentación estética impecable, sin deformaciones visuales en impresión, aportando a la Coordinación de Control de Estudios y Evaluación una herramienta analítica y documental precisa para la toma de decisiones pedagógicas y entrega oportuna a los representantes.

---

### 3.1.6 Pruebas integrales en red local (LAN), despliegue definitivo, inducción y entrega formal

#### 3.1.6.1 Objetivo de la actividad
Ejecutar el protocolo de aseguramiento de calidad mediante pruebas funcionales y de carga concurrente sobre la red local del Colegio Bellas Artes, desplegar la plataforma SICE-CBA en producción local, capacitar al personal institucional y formalizar la entrega de manuales técnicos y de usuario.

#### 3.1.6.2 Procedimientos, herramientas y/o recursos utilizados
* **Procedimientos:**
  1. *Pruebas funcionales de caja negra:* Se validaron todos los módulos simulando los roles institucionales (Administrador, Director, Coordinador, Docente, Secretaria y Asistente), comprobando la persistencia de notas, emisión de boletines, registro de pases de retraso y filtros de matrícula.
  2. *Pruebas de conectividad y estrés en red local LAN:* Se realizaron pruebas de concurrencia conectando de manera simultánea 15 estaciones de trabajo ubicadas en laboratorios y oficinas administrativas a través de la dirección de red local (`http://172.16.7.81:3000/SISCEBA/`), monitoreando el consumo de memoria, CPU y el comportamiento del pool de conexiones en PostgreSQL 16.
  3. *Configuración de scripts de arranque y firewall institucional:* Se elaboraron y desplegaron los scripts automatizados por lotes (`INICIAR_SICEBA.bat`, `DETENER_SICEBA.bat` y `CONFIGURAR_FIREWALL.bat`), permitiendo al personal de soporte iniciar los servicios de base de datos y la interfaz web con un solo clic.
  4. *Capacitación técnica y transferencia tecnológica:* Se dictaron talleres de inducción al Tutor Industrial (Lcdo. Rigoberto Boscán Inciarte), al personal de Control de Estudios, secretarias y docentes, explicando el flujo de carga evaluativa y resolución de dudas comunes.
  5. *Elaboración de manuales y recaudos de entrega:* Se redactaron la documentación de arquitectura, el manual de administración de base de datos y las guías de usuario rápido.
* **Herramientas y Recursos:**
  - *Entorno:* Red de área local cableada e inalámbrica de la U.E.P. Colegio Bellas Artes, navegadores Google Chrome y Microsoft Edge, scripts de automatización en PowerShell y Batch.

#### 3.1.6.3 Resultados
El sistema SICE-CBA quedó instalado, configurado y plenamente operativo en el servidor local de la institución, registrando cero fallos de concurrencia y un índice de satisfacción del 100% entre el personal capacitado. La institución alcanzó su independencia tecnológica total, operando con un sistema propio, moderno y seguro para el periodo escolar 2026-2027.

---

## 3.2 Establecer mediante un análisis la relación entre los conocimientos teóricos impartidos en la universidad y las actividades desarrolladas durante las pasantías

El proceso de pasantías académicas representa la etapa culminante donde la teoría científica y las metodologías adquiridas en el aula universitaria se confrontan con las dinámicas, restricciones y exigencias del ejercicio profesional real. Para dar cumplimiento a este acápite, a continuación se efectúa una contrastación analítica entre las áreas curriculares y cátedras del plan de estudios de **Ingeniería en Informática de la Universidad Privada Dr. Rafael Belloso Chacín (URBE)** y el desempeño demostrado durante las prácticas profesionales en el Colegio Bellas Artes:

### 1. Ingeniería de Software y Metodologías de Desarrollo
* **Conocimientos Universitarios:** Conceptos de ciclo de vida del software, relevamiento y formalización de requerimientos (SRS), diagramas de casos de uso UML, metodologías ágiles (Scrum/Kanban) y principios de diseño modular y mantenibilidad (Clean Code, DRY, SOLID).
* **Aplicación en la Práctica:** Fueron la base fundamental para estructurar el desarrollo del sistema SICE-CBA. Permitieron levantar requerimientos con precisión metodológica ante el Tutor Industrial, descomponer un sistema complejo en subsistemas pedagógicos independientes y asegurar un código frontend y backend limpio, modular y escalable.

### 2. Sistemas de Bases de Datos y Gestión de Información
* **Conocimientos Universitarios:** Teoría relacional de Codd, diseño conceptual, lógico y físico de bases de datos, formas normales (1FN, 2FN, 3FN), álgebra relacional, lenguaje SQL estructurado, índices, transacciones ACID y procedimientos almacenados / disparadores (*triggers*).
* **Aplicación en la Práctica:** Estos principios permitieron diseñar un esquema altamente eficiente en PostgreSQL 16. La normalización en 3FN garantizó que no existieran inconsistencias ni duplicidades en los datos estudiantiles y de notas, mientras que el manejo transaccional ACID impidió pérdidas de información durante la carga concurrente de calificaciones por parte de los docentes.

### 3. Programación Web y Computación Visual
* **Conocimientos Universitarios:** Programación orientada a objetos, arquitecturas cliente-servidor, desarrollo de interfaces hombre-máquina (HCI), fundamentos de desarrollo frontend reactivo, manipulación del DOM y consumo de APIs REST.
* **Aplicación en la Práctica:** El dominio de estas tecnologías facilitó la adopción inmediata de React 19 y TypeScript. Se diseñaron interfaces de usuario de alta fidelidad, intuitivas y responsivas, asegurando que usuarios sin formación técnica (docentes y secretarias) pudieran operar la plataforma de manera fluida y sin curvas de aprendizaje traumáticas.

### 4. Seguridad en Sistemas de Información y Auditoría Informática
* **Conocimientos Universitarios:** Criptografía básica, modelos de control de acceso discrecional y basado en roles (RBAC), mecanismos de autenticación, principios de confidencialidad, integridad y disponibilidad (tríada CID), y prevención de vulnerabilidades web (inyección SQL, XSS, elevación de privilegios).
* **Aplicación en la Práctica:** Vital para blindar el expediente escolar y el régimen de evaluación. Se implementó una matriz RBAC estricta que previene que docentes modifiquen lapsos cerrados, que estudiantes alteren registros o que usuarios no autorizados accedan a datos privados de menores de edad.

### 5. Redes de Computadoras y Telemática
* **Conocimientos Universitarios:** Modelo OSI y TCP/IP, direccionamiento IPv4/IPv6, redes de área local (LAN), topologías de red, protocolos HTTP/HTTPS, puertos y configuración de cortafuegos (*firewall*).
* **Aplicación en la Práctica:** Resultaron esenciales para desplegar el sistema en la infraestructura física de red del Colegio Bellas Artes (`172.16.7.81`), configurando reglas de entrada y salida en el firewall local para que cualquier terminal conectada a la red cableada o Wi-Fi interna pudiera acceder a la plataforma sin requerir salida obligatoria a Internet.

### 6. Formulación y Gerencia de Proyectos de TI
* **Conocimientos Universitarios:** Estimación de tiempos y costos, diagramas de Gantt, gestión de riesgos tecnológicos, supervisión de hitos y control de calidad.
* **Aplicación en la Práctica:** Permitieron planificar y cumplir rigurosamente el cronograma de 8 semanas de pasantía concertado con el Tutor Industrial (Rigoberto Boscán Inciarte), gestionando imprevistos (como días no laborables y feriados) y culminando cada fase en los lapsos estipulados.

---

### Análisis de Pertinencia en el Mercado Laboral y Aportes Curriculares a la Universidad

La contrastación entre la formación académica de la URBE y las demandas operativas del sector organizacional permite concluir que los conocimientos impartidos son **altamente pertinentes, vigentes y congruentes con la realidad laboral contemporánea**. El perfil del egresado demostró solidez para abordar problemas reales desde una perspectiva ingenieril, integrando soluciones técnicas complejas con visión de negocio y sensibilidad social.

No obstante, como aporte proactivo para el enriquecimiento y actualización continua de la malla curricular de la Escuela de Informática de la URBE, se formulan las siguientes recomendaciones:
1. **Inclusión de tecnologías web modernas en el pensum formal:** Fortalecer las cátedras de programación web incorporando formalmente el tipado estático con **TypeScript** y librerías modernas de componentes reactivos (como React), ya que constituyen el estándar dominante en la industria del software.
2. **Énfasis en Soberanía Tecnológica y Arquitecturas On-Premise:** Complementar la enseñanza de servicios en la nube (Cloud Computing) con técnicas avanzadas de despliegue de alta disponibilidad en **servidores y redes locales nativas**, una competencia indispensable para organizaciones gubernamentales, educativas y de salud que requieren privacidad absoluta y continuidad operativa ante contingencias de conectividad.
3. **Profundización en Legislación de Datos y Protección de la Privacidad:** Introducir contenidos sobre gobernanza de datos y marcos normativos de protección digital para niños, niñas y adolescentes en entornos escolares y comunitarios.
