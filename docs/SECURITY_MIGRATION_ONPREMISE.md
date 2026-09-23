# Arquitectura de Ciberseguridad y Guía de Migración On-Premise
## Sistema Integral de Control y Evaluación • Colegio Bellas Artes (SICE-CBA)
**Documento de Ingeniería DevSecOps & Hardening Institucional**

---

### Resumen Ejecutivo
El presente documento formaliza el plan de ingeniería, auditoría de seguridad y despliegue del sistema **SICE-CBA** para su transición desde el entorno de pruebas en la nube (Supabase) hacia el servidor físico de producción local (*On-Premise*) en las instalaciones del **Colegio Bellas Artes**.

El diseño implementa un enfoque de **Defensa en Profundidad** (*Defense in Depth*) organizado en cuatro capas estrictas orientadas a neutralizar vectores de ataque del OWASP Top 10, mitigación de robo o suplantación de credenciales y protección integral contra ransomware.

---

### Capa 1: Blindaje de Autenticación, Sesiones y Cuentas
1. **Hashing Criptográfico de Contraseñas**:
   - Implementado mediante **PBKDF2** con `HMAC-SHA256`, 100,000 iteraciones y sal (*salt*) criptográfica aleatoria de 16 bytes generada por `crypto.getRandomValues`.
   - Formato estándar de almacenamiento: `$pbkdf2$<iteraciones>$<saltHex>$<hashHex>`.
   - **Migración Transparente**: Al iniciar sesión, el sistema detecta si la credencial almacenada está en texto plano; si es válida, la convierte inmediatamente al hash seguro y actualiza el registro en la base de datos sin fricción para el usuario.
2. **Defensa contra Ataques de Fuerza Bruta y Rate Limiting**:
   - Limitador de intentos por usuario/IP: máximo 5 intentos fallidos consecutivos en una ventana de 15 minutos.
   - Bloqueo temporal progresivo de 15 minutos al superar el umbral con notificación en pantalla.
3. **Autenticación de Dos Factores (2FA / TOTP RFC 6238)**:
   - Obligatorio para roles con altos privilegios institucionales: `ADMINISTRADOR`, `DIRECTOR`, `COORDINACION`.
   - Ventana de tiempo estricta de 30 segundos con tolerancia de $\pm 30$ segundos para contrarrestar desfase horario.

---

### Capa 2: Aislamiento de Red y Configuración del Servidor Físico
1. **Topología de Red Institucional (VLAN / DMZ)**:
   - **DMZ / Servidor Web (VLAN 10)**: IP `192.168.10.50` alojando el Reverse Proxy NGINX.
   - **LAN Administrativa Segura (VLAN 20)**: IP `192.168.20.0/24` para personal directivo y control de estudios.
   - **Segmento Académico / Aulas (VLAN 30)**: Acceso restringido únicamente a la aplicación web vía HTTPS.
   - **Segmento de Invitados / Wi-Fi Público (VLAN 40)**: Aislado completamente; sin acceso a la IP del servidor.
2. **Reverse Proxy NGINX Hardened (`deploy/nginx/siceba.conf`)**:
   - Redirección obligatoria HTTP $\to$ HTTPS (Puerto 80 redirigido permanentemente al 443).
   - Protocolos modernos **TLS 1.3** y **TLS 1.2** exclusivamente.
   - Cabeceras de seguridad activas:
     - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (HSTS).
     - `X-Frame-Options: DENY` (Mitigación total de Clickjacking).
     - `X-Content-Type-Options: nosniff`.
     - `Content-Security-Policy (CSP)` estricto permitiendo únicamente recursos autorizados.
     - `Permissions-Policy` bloqueando uso de geolocalización, cámara y micrófono.
3. **Firewall Perimetral UFW y Fail2ban (`deploy/fail2ban/`)**:
   - Reglas de filtrado activas:
     ```bash
     sudo ufw default deny incoming
     sudo ufw default allow outgoing
     sudo ufw allow 80/tcp
     sudo ufw allow 443/tcp
     sudo ufw allow from 192.168.20.0/24 to any port 2222 proto tcp # SSH restringido
     sudo ufw enable
     ```
   - Monitoreo dinámico con Fail2ban bloqueando direcciones IP tras 5 intentos fallidos en endpoints de autenticación.

---

### Capa 3: Blindaje de la Base de Datos PostgreSQL On-Premise
1. **Principio de Mínimo Privilegio**:
   - Desactivado el acceso directo del superusuario `postgres` para la aplicación web.
   - Rol de aplicación dedicado `cba_app_user` con permisos limitados a DML (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) en el esquema `public`. Prohibido el uso de DDL (`DROP`, `ALTER`, `CREATE TABLE`).
2. **Políticas de Seguridad a Nivel de Fila (Row Level Security - RLS)**:
   - Archivo: `deploy/sql/01_hardening_roles_rls.sql`.
   - `students`: Los representantes solo pueden leer la ficha de sus propios representados. Los estudiantes solo leen su propio registro.
   - `evaluation_records`: Los docentes solo pueden asentar o modificar notas en las materias que imparten. Estudiantes y representantes cuentan con acceso de solo lectura a notas publicadas.
3. **Mitigación de Inyección SQL**:
   - Consultas 100% parametrizadas en la capa de datos.

---

### Capa 4: Auditoría Inmutable y Plan de Respaldo Anti-Ransomware
1. **Pistas de Auditoría Inmutables (`deploy/sql/02_system_audit_logs.sql`)**:
   - Tabla `system_audit_logs` con triggers automáticos en `evaluation_records`, `app_users` y `students`.
   - Registra usuario causante, rol, IP, timestamp y diferencia exacta (*diff*) entre estado anterior y nuevo en formato JSONB.
   - Triggers bloquean cualquier operación de `UPDATE`, `DELETE` o `TRUNCATE` sobre los logs de auditoría para garantizar validez forense.
2. **Estrategia de Respaldo 3-2-1 (`deploy/scripts/backup-encrypted.sh`)**:
   - **3 Copias**: Servidor local, NAS institucional y medio físico fuera de línea (*Air-Gapped*).
   - **2 Medios Diferentes**: Disco SSD NVMe interno del servidor + NAS institucional en red local.
   - **1 Copia Fuera de Línea (*Air-Gap*)**: Unidad de disco duro externo desmontable almacenada en bóveda física institucional protegida contra sobretensiones y ransomware.
   - **Cifrado Simétrico Militar AES-256**: Cada volcado `pg_dump` es cifrado con GPG (`--cipher-algo AES256`) y verificado mediante checksum SHA-256.
3. **Plan de Recuperación ante Desastres (DRP - `deploy/scripts/restore-drp.sh`)**:
   - Procedimiento documentado y automatizado para verificación de integridad de checksum, descifrado seguro en memoria y restauración limpia de la base de datos institucional en minutos.

---

### Verificación y Despliegue
- La aplicación compila sin errores (`npm run build` ejecutado exitosamente con código 0).
- Todos los artefactos de configuración de infraestructura, scripts de automatización y esquemas de base de datos se encuentran versionados en el directorio `deploy/`.
