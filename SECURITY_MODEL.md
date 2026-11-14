# Modelo de amenazas — SICE-CBA (themiguedev/SISCEBA)

Sistema Integral de Control y Evaluación de la U.E.P. Colegio Bellas Artes (Maracaibo). Gestiona notas oficiales (Inicial, Primaria, Media General), inscripciones, conducta, inasistencias, documentos oficiales (actas, boletines, títulos), planificación docente y comunicación con representantes.

Fuentes: código del repositorio, `docs/SECURITY_MIGRATION_ONPREMISE.md` (arquitectura de seguridad prevista), `deploy/` (NGINX, fail2ban, SQL de hardening, respaldos) y respuestas del usuario (marcadas como **[usuario]**).

## 1. Visión general y fronteras de confianza

```
Navegador (SPA React) ──HTTP/HTTPS──> NGINX (deploy/nginx/siceba.conf) o Vite :3000
        │                                         │ proxy /api, /SISCEBA/api
        └──────────── HTTP directo ──────────> Gateway REST Node :54321 (tools/api-server.mjs)
                                                   │ pool pg como superusuario postgres
                                                   v
                                           PostgreSQL 16 :5432 (BD sisceba)
```

- **[usuario]** El sistema está pensado para desplegarse en servidores (on‑premise del colegio). El README y `URLS_SICEBA.txt` describen acceso por LAN (`172.16.7.81:3000` y `:54321`); `deploy/` describe un despliegue con NGINX + TLS en `siceba.bellasartes.edu.ve`. `tools/configurar-firewall.bat` abre 3000 y 54321 en todos los perfiles de Windows Firewall.
- **[usuario]** En producción el puerto 54321 solo es accesible desde el propio servidor / proxy. Sin embargo, el cliente llama a `${window.location.origin}/api/<tabla>` (`getActiveApiUrl` en `src/lib/dbClient.ts`) y el proxy de Vite (`vite.config.ts`, `/api` y `/SISCEBA/api` → `127.0.0.1:54321`) reenvía esas peticiones: **cualquiera que llegue al frontend llega al gateway completo a través del proxy**, aunque el puerto 54321 esté cerrado. Restringir el puerto no reduce la exposición del gateway.
- **Frontera principal: navegador ↔ gateway.** Todo lo que corre en el navegador (login, RBAC, 2FA, rate limiting, verificación de contraseñas) está bajo control del usuario. El gateway (`tools/api-server.mjs`) no tiene autenticación ni autorización: expone cualquier tabla de `public` con GET/POST(upsert)/PATCH/DELETE, CORS `*`, escucha en `0.0.0.0`, y se conecta como `postgres` (superusuario). Lo que el cliente decide no es un control de seguridad para el servidor.
- **Frontera gateway ↔ PostgreSQL:** sin rol de mínimo privilegio en el código actual (`PG_CONN_STRING = postgres://postgres@127.0.0.1:5432/sisceba`); `deploy/sql/01_hardening_roles_rls.sql` define `cba_app_user` y RLS pero el gateway no lo usa ni propaga identidad de usuario, por lo que las políticas RLS no pueden distinguir usuarios.
- **Frontera NGINX ↔ Internet/LAN:** NGINX solo sirve el `dist` estático; no hace proxy de `/api`, y la CSP permite `connect-src http://localhost:54321`.

## 2. Componentes

| Componente | Código | Notas |
|---|---|---|
| **Cliente web** | `src/components/**`, `src/App.tsx`, `src/hooks`, `src/data`, `index.html`, `public/` | Vistas de gestión, evaluación, consultas, impresión de documentos oficiales. |
| **Autenticación y RBAC** | `src/context/AppContext.tsx` (login, sesión, códigos de registro), `src/utils/security.ts`, `src/utils/rbac.ts`, `src/utils/passwordUtils.ts`, `src/components/auth/**` | Todo en el cliente: PBKDF2 en navegador, migración de contraseñas en claro, rate limit en `localStorage`, TOTP (lista `ROLES_REQUIRING_2FA` vacía), `?autologin=admin`, sesión en `localStorage` (`sisceba_current_user`, `sisceba_auth_session`). |
| **Cliente de datos** | `src/lib/dbClient.ts`, `src/lib/supabaseClient.ts` (adaptador vigente que reexporta `dbClient`), `src/services/supabaseService.ts` | Traduce a la API estilo PostgREST; descarga `app_users` completos (incluido `password` y `two_factor_secret`). |
| **API Gateway** | `tools/api-server.mjs` | CRUD genérico sin autenticación; crea `admin` con contraseña fija al arrancar; `/health` expone métricas; errores devuelven `err.message` de PostgreSQL. |
| **Base de datos** | `deploy/sql/*.sql`, `tools/init-db.mjs`, `tools/setup-local-db.mjs`, `tools/update-role-constraint.mjs` | Tablas `app_users`, `students`, `evaluation_records`, `conduct_records`, `attendance_records`, `system_audit_logs`, etc. `supabase/` es legado (fuera de alcance). |
| **Infraestructura** | `deploy/nginx/`, `deploy/fail2ban/`, `deploy/scripts/`, `tools/*.bat`, `tools/*runner*.mjs`, `tools/start-daemon.mjs`, `tools/run-hidden.vbs`, `INICIAR_SICEBA.bat`, `DETENER_SICEBA.bat`, `vite.config.ts` | Arranque en Windows, firewall, proxy, respaldos cifrados GPG y DRP. |
| **Herramientas de datos** | `tools/seed-*.mjs`, `tools/sync-*.mjs`, `tools/migrate-*.mjs`, `tools/stress-test.mjs`, `tools/fix-*.mjs` | Scripts operativos ejecutados por el administrador. |

## 3. Puntos de entrada y quién llega

| Entrada | Alcance | Quién |
|---|---|---|
| SPA en `:3000/SISCEBA/` (Vite dev/preview, `host: true`, `allowedHosts: true`) o NGINX 443 | Red donde esté el servidor | Cualquier usuario con acceso de red, autenticado o no |
| Gateway REST (`/api/<tabla>`, `/rest/v1/<tabla>`, `/health`) vía proxy same‑origin `:3000/api`, `:3000/SISCEBA/api` | Todo el que llega al frontend **[usuario: el puerto 54321 directo solo es accesible desde el servidor/proxy]** | Cualquier cliente que llegue al frontend, sin credenciales (incluidos estudiantes). El acceso directo a 54321 desde otros equipos no aplica en producción |
| PostgreSQL `:5432` | Listado en `URLS_SICEBA.txt` con host de red | Depende de `pg_hba.conf` (fuera del repo) |
| Túnel público trycloudflare.com (`tools/server-runner.mjs`, si existe `tools/bin/cloudflared.exe`) hacia `:3000` | Internet | Cualquiera con la URL del túnel: llega al frontend y, por el proxy, al gateway |
| Parámetros de URL (`?autologin=admin`) y `localStorage` | Navegador | Cualquier usuario del equipo |
| Códigos de registro (autoregistro DOCENTE/SECRETARIA) | Login | Personas con un código válido |

## 4. Activos y sensibilidad

**[usuario] Todos los activos tienen la misma prioridad:**
- Integridad de calificaciones (`evaluation_records`) y documentos oficiales (actas, boletines, títulos de bachiller, matrícula).
- Confidencialidad de datos personales de estudiantes menores y representantes (cédulas, contactos, conducta, orientación, inasistencias).
- Cuentas y credenciales del personal (`app_users.password`, `two_factor_secret`, roles ADMINISTRADOR/DIRECTOR/COORDINACION).
- Integridad de la bitácora (`system_audit_logs`) y de los respaldos.

## 5. Atacantes

- **[usuario] Prioridad: estudiantes** que quieren cambiar notas o ver datos de otros. Tienen cuenta ESTUDIANTE (o la de su representante), acceso al frontend y, normalmente, a la red del colegio o del servidor; conocimiento técnico básico‑medio (DevTools, editar `localStorage`, llamar a la API con curl).
- Otros perfiles (representantes, personal que abusa de su rol, atacantes externos) siguen en alcance pero el usuario no los destacó.

## 6. Controles existentes

- Hash PBKDF2‑SHA256 100k iteraciones (`src/utils/security.ts`) — calculado y verificado en el cliente.
- RBAC por pestañas y sub‑pestañas (`src/utils/rbac.ts`) — solo oculta UI.
- Rate limit de login y 2FA TOTP en cliente; `ROLES_REQUIRING_2FA` está vacío.
- Gateway: nombres de tabla y columnas de `select`/`order` validados con regex; valores parametrizados (`$n`). Los nombres de columna en filtros, cuerpo de POST/PATCH y `on_conflict` se citan con `"..."` sin escapar comillas.
- Plan on‑premise (`docs/SECURITY_MIGRATION_ONPREMISE.md`): NGINX con TLS, HSTS, CSP, rate limiting, fail2ban, VLANs, `cba_app_user` + RLS, auditoría inmutable con triggers, respaldos GPG AES‑256. Gran parte no está conectada al código actual (el gateway usa `postgres`, NGINX no publica la API, el filtro fail2ban apunta a rutas que no existen).

## 7. Fuera de alcance / riesgo aceptado

- **[usuario]** Carpeta `supabase/` (schema, seed y migración de Supabase): legado, no se usa en producción. (`src/lib/supabaseClient.ts` sí está en uso como adaptador y sigue en alcance.)
- **[usuario]** Las credenciales de prueba documentadas en `CREDENCIALES_ROLES.md` se cambiarán antes de producción: los hallazgos que dependan solo de que esas contraseñas sigan vigentes se tratan como riesgo aceptado. No cubre credenciales fijadas en código que se recrean automáticamente ni contraseñas de BD/infraestructura.

## 8. Preguntas abiertas

- ¿El servidor de producción será accesible desde Internet o solo desde la LAN?
- ¿En producción se usará `deploy/nginx` (que no publica `/api`) o Vite preview en `:3000` con proxy?
- ¿`pg_hba.conf` permite conexiones de red a `:5432` sin contraseña?
- ¿Se aplicarán `deploy/sql/01_hardening_roles_rls.sql` y `02_system_audit_logs.sql` en producción?
