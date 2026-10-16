import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const pidFile = path.join(rootDir, '.local_db', 'services.pid');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function checkUrl(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.status >= 200 && res.status < 400;
  } catch {
    return false;
  }
}

async function checkViteApp(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.status !== 200) return false;
    const text = await res.text();
    return text.includes('id="root"');
  } catch {
    return false;
  }
}

async function main() {
  console.log('======================================================================');
  console.log('   🚀 INICIANDO SISTEMA SICE-CBA (MODO SEGUNDO PLANO / BACKGROUND)   ');
  console.log('======================================================================\n');

  // Limpiar posibles terminales residuales de versiones previas
  try {
    execSync('taskkill /FI "WINDOWTITLE eq SICE-CBA [Base de Datos & Gateway]*" /T /F 2>nul || exit 0', {
      shell: 'cmd.exe',
      stdio: 'ignore',
      windowsHide: true
    });
  } catch {}

  const dbAlreadyUp = await checkUrl('http://127.0.0.1:54321/health');
  const viteAlreadyUp = await checkUrl('http://localhost:3000/SISCEBA/');

  let spawnedRunner = null;
  let spawnedVite = null;

  // Limpiar postmaster.pid huérfano si la BD no responde
  const postmasterPid = path.join(rootDir, '.local_db', 'data', 'postmaster.pid');
  if (fs.existsSync(postmasterPid) && !dbAlreadyUp) {
    try {
      const psqlExe = path.join(rootDir, '.local_db', 'pgsql', 'bin', 'psql.exe');
      execSync(`"${psqlExe}" -U postgres -h 127.0.0.1 -p 5432 -c "SELECT 1;"`, { stdio: 'ignore' });
    } catch {
      try { fs.unlinkSync(postmasterPid); } catch {}
    }
  }

  const vbsRunner = path.join(__dirname, 'run-hidden.vbs');

  // 1. Iniciar Base de Datos si no está activa
  if (!dbAlreadyUp) {
    console.log('🐘 Iniciando motor PostgreSQL y Servidor API Local en segundo plano...');
    const dbRunnerScript = path.join(__dirname, 'db-runner.mjs');
    try {
      execSync(`wscript.exe //nologo "${vbsRunner}" "${process.execPath}" "${dbRunnerScript}" "--daemon"`, {
        cwd: rootDir,
        stdio: 'ignore',
        windowsHide: true
      });
    } catch {
      spawn(process.execPath, [dbRunnerScript, '--daemon'], {
        cwd: rootDir,
        detached: true,
        stdio: 'ignore',
        windowsHide: true
      }).unref();
    }
  } else {
    console.log('ℹ️ Base de Datos y Servidor API ya están en ejecución.');
  }

  // 2. Iniciar Vite si no está activo
  if (!viteAlreadyUp) {
    console.log('⚡ Iniciando Servidor Frontend Vite en segundo plano...');
    const viteBin = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');
    try {
      execSync(`wscript.exe //nologo "${vbsRunner}" "${process.execPath}" "${viteBin}"`, {
        cwd: rootDir,
        stdio: 'ignore',
        windowsHide: true
      });
    } catch {
      spawn(process.execPath, [viteBin], {
        cwd: rootDir,
        detached: true,
        stdio: 'ignore',
        windowsHide: true
      }).unref();
    }
  } else {
    console.log('ℹ️ Servidor Frontend Vite ya está en ejecución.');
  }

  // Guardar PID de Vite de forma síncrona
  if (spawnedVite && spawnedVite.pid) {
    try {
      let currentData = {};
      if (fs.existsSync(pidFile)) {
        currentData = JSON.parse(fs.readFileSync(pidFile, 'utf-8'));
      }
      currentData.vitePid = spawnedVite.pid;
      fs.writeFileSync(pidFile, JSON.stringify(currentData, null, 2));
    } catch {}
  }

  // 3. Esperar a que ambos servicios respondan
  console.log('\n⏳ Esperando confirmación de servicios...');
  const maxAttempts = 35;
  let attempts = 0;
  let dbReady = dbAlreadyUp;
  let viteReady = viteAlreadyUp;

  while (attempts < maxAttempts && (!dbReady || !viteReady)) {
    await sleep(1000);
    attempts++;

    if (!dbReady) {
      dbReady = await checkUrl('http://127.0.0.1:54321/health');
    }
    if (!viteReady) {
      viteReady = await checkViteApp('http://localhost:3000/SISCEBA/');
    }

    process.stdout.write(`   • Verificando servicios (${attempts}s)... BD: ${dbReady ? '✅' : '⏳'} | Frontend: ${viteReady ? '✅' : '⏳'}\r`);
  }

  console.log('\n');

  if (!dbReady || !viteReady) {
    console.error('⚠️ Uno o más servicios tardaron más de lo esperado en responder.');
    console.error(`   Base de Datos: ${dbReady ? 'OK' : 'No responde'}`);
    console.error(`   Frontend Vite: ${viteReady ? 'OK' : 'No responde'}`);
    process.exit(1);
  }

  // 4. Abrir en el navegador predeterminado (en segundo plano sin consola)
  console.log('🌐 Abriendo navegador en http://localhost:3000/SISCEBA/ ...');
  try {
    spawn('explorer.exe', ['http://localhost:3000/SISCEBA/'], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    }).unref();
  } catch {}

  // 5. Imprimir resumen
  console.log('======================================================================');
  console.log('🎉 ¡SICE-CBA HA SIDO LEVANTADO CON ÉXITO EN SEGUNDO PLANO!');
  console.log('======================================================================');
  console.log('👉 URL: http://localhost:3000/SISCEBA/');
  console.log('👉 Todos los servicios y terminales pasan a segundo plano.');
  console.log('======================================================================\n');

  // 6. Lanzar aviso emergente de Windows mediante WScript (GUI pura, 0 consolas)
  try {
    const vbsPath = path.join(rootDir, '.local_db', 'notify.vbs');
    const vbsContent = [
      'Set ws = CreateObject("WScript.Shell")',
      'ws.Popup "¡SICE-CBA está listo y activo en segundo plano!" & vbCrLf & vbCrLf & "Acceso: http://localhost:3000/SISCEBA/", 4, "SICE-CBA - En Línea", 64',
      'Set fso = CreateObject("Scripting.FileSystemObject")',
      'If fso.FileExists(WScript.ScriptFullName) Then fso.DeleteFile WScript.ScriptFullName'
    ].join('\r\n') + '\r\n';

    fs.writeFileSync(vbsPath, vbsContent, 'ascii');

    spawn('wscript.exe', ['//nologo', vbsPath], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    }).unref();
  } catch {}

  console.log('👋 Cerrando consola. Disfruta tu sesión de trabajo.');

  // Forzar salida inmediata para cerrar la consola del .bat sin demora
  process.exit(0);
}

main().catch(err => {
  console.error('Error iniciando el sistema en segundo plano:', err);
  process.exit(1);
});
