import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const pidFile = path.join(rootDir, '.local_db', 'services.pid');
const pgData = path.join(rootDir, '.local_db', 'data');
const pgCtlExe = path.join(rootDir, '.local_db', 'pgsql', 'bin', 'pg_ctl.exe');

console.log('🛑 Deteniendo servicios de base de datos local SICE-CBA...');

if (fs.existsSync(pidFile)) {
  try {
    const data = JSON.parse(fs.readFileSync(pidFile, 'utf-8'));
    console.log(`Deteniendo procesos asociados (Runner PID: ${data.runnerPid}, API PID: ${data.apiPid}, Vite PID: ${data.vitePid})...`);
    
    if (data.runnerPid) {
      try { process.kill(data.runnerPid); } catch {}
    }
    if (data.apiPid) {
      try { process.kill(data.apiPid); } catch {}
    }
    if (data.gatewayPid) {
      try { process.kill(data.gatewayPid); } catch {}
    }
    if (data.vitePid) {
      try { execSync(`taskkill /F /T /PID ${data.vitePid} 2>nul || exit 0`, { shell: 'cmd.exe', stdio: 'ignore' }); } catch {}
    }
    fs.unlinkSync(pidFile);
  } catch (e) {
    console.warn('Aviso leyendo pidFile:', e.message);
  }
}

// Asegurar apagado del servidor Vite en puerto 3000
try {
  execSync('powershell -NoProfile -Command "try { Get-NetTCPConnection -LocalPort 3000 -ErrorAction Stop | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } } catch {} exit 0"', { stdio: 'ignore' });
} catch {}

// Asegurar apagado del servidor API en puerto 54321
try {
  execSync('powershell -NoProfile -Command "try { Get-NetTCPConnection -LocalPort 54321 -ErrorAction Stop | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } } catch {} exit 0"', { stdio: 'ignore' });
} catch {}

// Asegurar apagado limpio de PostgreSQL
try {
  execSync(`"${pgCtlExe}" -D "${pgData}" -m fast stop`, { stdio: 'inherit' });
} catch {
  // Ya detenido
}

// Limpiar procesos huérfanos si quedara alguno
try {
  execSync('taskkill /F /IM postgrest.exe 2>nul || exit 0', { shell: 'cmd.exe', stdio: 'ignore' });
} catch {}
try {
  execSync('taskkill /F /IM cloudflared.exe 2>nul || exit 0', { shell: 'cmd.exe', stdio: 'ignore' });
} catch {}

// Limpiar postmaster.pid residual si existe
const postmasterPid = path.join(pgData, 'postmaster.pid');
if (fs.existsSync(postmasterPid)) {
  try { fs.unlinkSync(postmasterPid); } catch {}
}

console.log('✅ Base de datos y servicios locales detenidos correctamente.');
