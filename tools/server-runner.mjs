import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const pgsqlBin = path.join(rootDir, '.local_db', 'pgsql', 'bin');
const pgData = path.join(rootDir, '.local_db', 'data');
const postgresExe = path.join(pgsqlBin, 'postgres.exe');
const psqlExe = path.join(pgsqlBin, 'psql.exe');
const pgCtlExe = path.join(pgsqlBin, 'pg_ctl.exe');
const apiServerScript = path.join(__dirname, 'api-server.mjs');
const viteBin = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');
const cfBin = path.join(rootDir, 'tools', 'bin', 'cloudflared.exe');
const pidFile = path.join(rootDir, '.local_db', 'services.pid');

let pgProcess = null;
let apiProcess = null;
let viteProcess = null;
let cfProcess = null;
let cloudflareUrl = '';
let isShuttingDown = false;
let startTime = Date.now();

// Códigos ANSI para decoración visual de la consola
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  boldCyan: '\x1b[1;36m',
  green: '\x1b[32m',
  boldGreen: '\x1b[1;32m',
  yellow: '\x1b[33m',
  boldYellow: '\x1b[1;33m',
  blue: '\x1b[34m',
  boldBlue: '\x1b[1;34m',
  magenta: '\x1b[35m',
  boldMagenta: '\x1b[1;35m',
  white: '\x1b[37m',
  boldWhite: '\x1b[1;37m',
  gray: '\x1b[90m',
  bgGreen: '\x1b[42;30m',
  bgCyan: '\x1b[46;30m',
  bgBlue: '\x1b[44;37m',
  bgYellow: '\x1b[43;30m'
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Obtener la dirección IP activa de la red local (Ethernet / Wi-Fi)
function getLocalNetworkIp() {
  const nets = os.networkInterfaces();
  const candidates = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const isIPv4 = net.family === 'IPv4' || net.family === 4;
      if (isIPv4 && !net.internal) {
        candidates.push({ name, address: net.address });
      }
    }
  }

  const privateIp = candidates.find(item => {
    const ip = item.address;
    if (ip.startsWith('192.168.')) return true;
    if (ip.startsWith('10.')) return true;
    if (ip.startsWith('172.')) {
      const secondOctet = parseInt(ip.split('.')[1], 10);
      if (secondOctet >= 16 && secondOctet <= 31) return true;
    }
    return false;
  });

  if (privateIp) return privateIp.address;

  const nonApipa = candidates.find(item => !item.address.startsWith('169.254'));
  if (nonApipa) return nonApipa.address;

  if (candidates.length > 0) return candidates[0].address;
  return 'localhost';
}

const lanIp = getLocalNetworkIp();
const lanUrl = `http://${lanIp}:3000/SISCEBA/`;
const localUrl = 'http://localhost:3000/SISCEBA/';

async function checkUrl(url, timeoutMs = 1500) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res.status >= 200 && res.status < 400;
  } catch {
    return false;
  }
}

async function isPostgresRunning() {
  try {
    execSync(`"${psqlExe}" -U postgres -h 127.0.0.1 -p 5432 -c "SELECT 1;"`, {
      stdio: 'ignore'
    });
    return true;
  } catch {
    return false;
  }
}

function startCloudflareTunnel() {
  return new Promise((resolve) => {
    if (!fs.existsSync(cfBin)) {
      resolve(null);
      return;
    }

    cfProcess = spawn(cfBin, ['tunnel', '--url', 'http://localhost:3000'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true
    });

    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(null);
      }
    }, 15000);

    const checkOutput = (chunk) => {
      const text = chunk.toString();
      const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
      if (match && !resolved) {
        resolved = true;
        clearTimeout(timer);
        cloudflareUrl = `${match[0]}/SISCEBA/`;
        try {
          fs.writeFileSync(path.join(rootDir, '.local_db', 'tunnel_url.txt'), cloudflareUrl, 'utf-8');
        } catch {}
        resolve(cloudflareUrl);
      }
    };

    cfProcess.stderr.on('data', checkOutput);
    cfProcess.stdout.on('data', checkOutput);

    cfProcess.on('error', () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        resolve(null);
      }
    });
  });
}

function printHeader() {
  console.clear();
  console.log(`${c.boldCyan}╔════════════════════════════════════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.boldCyan}║                                                                                ║${c.reset}`);
  console.log(`${c.boldCyan}║   ███████╗██╗  ██████╗███████╗      ██████╗██████╗   █████╗                    ║${c.reset}`);
  console.log(`${c.boldCyan}║   ██╔════╝██║ ██╔════╝██╔════╝     ██╔════╝██╔══██╗ ██╔══██╗                   ║${c.reset}`);
  console.log(`${c.boldCyan}║   ███████╗██║ ██║     █████╗  ███╗ ██║     ██████╔╝ ███████║                   ║${c.reset}`);
  console.log(`${c.boldCyan}║   ╚════██║██║ ██║     ██╔══╝  ╚══╝ ██║     ██╔══██╗ ██╔══██║                   ║${c.reset}`);
  console.log(`${c.boldCyan}║   ███████║██║ ╚██████╗███████╗     ╚██████╗██████╔╝ ██║  ██║                   ║${c.reset}`);
  console.log(`${c.boldCyan}║   ╚══════╝╚═╝  ╚═════╝╚══════╝      ╚═════╝╚═════╝  ╚═╝  ╚═╝                   ║${c.reset}`);
  console.log(`${c.boldCyan}║                                                                                ║${c.reset}`);
  console.log(`${c.boldWhite}║             SISTEMA INTEGRAL DE CONTROL DE ESTUDIOS (SICE-CBA)                 ║${c.reset}`);
  console.log(`${c.gray}║          U.E. Colegio Bellas Artes · Servidor con Cloudflare Tunnel            ║${c.reset}`);
  console.log(`${c.boldCyan}╚════════════════════════════════════════════════════════════════════════════════╝${c.reset}\n`);
}

function notifyConnectionEstablished() {
  process.stdout.write('\x07\x07');

  try {
    spawn('powershell.exe', [
      '-NoProfile',
      '-Command',
      '[System.Media.SystemSounds]::Asterisk.Play()'
    ], { stdio: 'ignore', windowsHide: true }).unref();
  } catch {}

  const activePublicUrl = cloudflareUrl || lanUrl;

  // Copiar automáticamente al portapapeles
  try {
    execSync('clip', { input: activePublicUrl });
  } catch {}

  try {
    const vbsPath = path.join(rootDir, '.local_db', 'notify_ready.vbs');
    const vbsContent = [
      'Set ws = CreateObject("WScript.Shell")',
      `ws.Popup "¡SICE-CBA Conexión Establecida con Éxito!" & vbCrLf & vbCrLf & "Enlace para Cualquier Computador o Teléfono:" & vbCrLf & "${activePublicUrl}" & vbCrLf & vbCrLf & "(Copiado al portapapeles automáticamente)", 4, "SICE-CBA - En Línea", 64`,
      'Set fso = CreateObject("Scripting.FileSystemObject")',
      'If fso.FileExists(WScript.ScriptFullName) Then fso.DeleteFile WScript.ScriptFullName'
    ].join('\r\n') + '\r\n';

    fs.writeFileSync(vbsPath, vbsContent, 'ascii');
    spawn('wscript.exe', ['//nologo', vbsPath], {
      stdio: 'ignore',
      windowsHide: true,
      detached: true
    }).unref();
  } catch {}

  try {
    spawn('explorer.exe', [localUrl], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    }).unref();
  } catch {}
}

function renderDashboard(statusMessage = '') {
  printHeader();

  console.log(`${c.boldGreen}╔════════════════════════════════════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.boldGreen}║        ✨ ¡CONEXIÓN ESTABLECIDA CON ÉXITO - SERVIDOR EN LÍNEA! ✨              ║${c.reset}`);
  console.log(`${c.boldGreen}╚════════════════════════════════════════════════════════════════════════════════╝${c.reset}\n`);

  if (cloudflareUrl) {
    console.log(`${c.boldGreen}┌─ 🚀 ENLACE CLOUDFLARE TUNNEL (CUALQUIER OTRA PC, TELÉFONO O TABLET) ───────────┐${c.reset}`);
    console.log(`${c.green}│${c.reset}                                                                                ${c.green}│${c.reset}`);
    console.log(`${c.green}│${c.reset}  ${c.boldWhite}Enlace Seguro:  ${c.boldYellow}${cloudflareUrl.padEnd(61)}${c.reset} ${c.green}│${c.reset}`);
    console.log(`${c.green}│${c.reset}                                                                                ${c.green}│${c.reset}`);
    console.log(`${c.green}│${c.reset}  ${c.white}🌐 ¡Entra desde tu otra PC abriendo este enlace directamente en el navegador!  ${c.reset}${c.green}│${c.reset}`);
    console.log(`${c.green}│${c.reset}  ${c.gray}   🔒 100% Seguro con HTTPS · Bypassea firewalls y bloqueos de red local.      ${c.reset}${c.green}│${c.reset}`);
    console.log(`${c.boldGreen}└────────────────────────────────────────────────────────────────────────────────┘${c.reset}\n`);
  }

  console.log(`${c.boldCyan}┌─ 🔌 ACCESO POR RED LOCAL DE CABLE ETHERNET (LAN) ──────────────────────────────┐${c.reset}`);
  console.log(`${c.cyan}│${c.reset}  ${c.white}Enlace de Cable:${c.reset}  ${c.boldCyan}${lanUrl.padEnd(61)}${c.reset} ${c.cyan}│${c.reset}`);
  console.log(`${c.cyan}│${c.reset}  ${c.gray}Dominio Red:      LAN.FCBA.COM · Subred 172.16.7.x (Requiere Firewall abierto) ${c.reset} ${c.cyan}│${c.reset}`);
  console.log(`${c.boldCyan}└────────────────────────────────────────────────────────────────────────────────┘${c.reset}\n`);

  console.log(`${c.boldBlue}┌─ 💻 ACCESO EN ESTE COMPUTADOR (LOCAL) ─────────────────────────────────────────┐${c.reset}`);
  console.log(`${c.blue}│${c.reset}  ${c.white}Enlace Local:   ${c.boldCyan}${localUrl.padEnd(61)}${c.reset} ${c.blue}│${c.reset}`);
  console.log(`${c.boldBlue}└────────────────────────────────────────────────────────────────────────────────┘${c.reset}\n`);

  console.log(`${c.boldYellow}┌─ ⚙️  ESTADO DE SERVICIOS EN SEGUNDO PLANO ─────────────────────────────────────┐${c.reset}`);
  console.log(`${c.yellow}│${c.reset}  ${c.green}●${c.reset} ${c.white}Base de Datos:${c.reset}   PostgreSQL 16 Nativo Local  ${c.gray}[Puerto 5432]${c.reset}    ${c.boldGreen}ACTIVO${c.reset}  ${c.yellow}│${c.reset}`);
  console.log(`${c.yellow}│${c.reset}  ${c.green}●${c.reset} ${c.white}API REST:${c.reset}        Servidor Nativo Node.js     ${c.gray}[Puerto 54321]${c.reset}   ${c.boldGreen}ACTIVO${c.reset}  ${c.yellow}│${c.reset}`);
  console.log(`${c.yellow}│${c.reset}  ${c.green}●${c.reset} ${c.white}Frontend Web:${c.reset}    Vite SPA con Host Global    ${c.gray}[Puerto 3000]${c.reset}    ${c.boldGreen}ACTIVO${c.reset}  ${c.yellow}│${c.reset}`);
  if (cloudflareUrl) {
    console.log(`${c.yellow}│${c.reset}  ${c.green}●${c.reset} ${c.white}Cloudflare:${c.reset}      Túnel Cifrado Seguro HTTPS  ${c.gray}[Bypasa Firewall]${c.reset} ${c.boldGreen}ACTIVO${c.reset}  ${c.yellow}│${c.reset}`);
  }
  console.log(`${c.boldYellow}└────────────────────────────────────────────────────────────────────────────────┘${c.reset}\n`);

  if (statusMessage) {
    console.log(`${c.boldYellow}👉 ${statusMessage}${c.reset}\n`);
  }

  console.log(`${c.boldWhite}Opciones de control:${c.reset}`);
  if (cloudflareUrl) {
    console.log(`  ${c.boldGreen}[1]${c.reset} Copiar enlace de Cloudflare Tunnel (${c.boldYellow}${cloudflareUrl}${c.reset}) al portapapeles`);
  }
  console.log(`  ${c.boldCyan}[2]${c.reset} Abrir sistema en el navegador local (${c.cyan}localhost:3000${c.reset})`);
  console.log(`  ${c.boldCyan}[3]${c.reset} Copiar enlace de red de cable (${c.cyan}${lanUrl}${c.reset}) al portapapeles`);
  console.log(`  ${c.boldCyan}[4]${c.reset} Configurar regla en Firewall de Windows (para red por cable)`);
  console.log(`  ${c.boldMagenta}[Q]${c.reset} Detener servidor y cerrar todos los servicios de forma limpia\n`);
  console.log(`${c.dim}Mantén esta ventana abierta para permitir el acceso a los demás dispositivos.${c.reset}`);
}

async function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n\n${c.boldYellow}🛑 Deteniendo servidor SICE-CBA y liberando puertos...${c.reset}`);

  if (cfProcess) {
    try { cfProcess.kill('SIGTERM'); } catch {}
    try { execSync('taskkill /F /IM cloudflared.exe 2>nul || exit 0', { shell: 'cmd.exe', stdio: 'ignore' }); } catch {}
  }
  if (viteProcess) {
    try { viteProcess.kill('SIGTERM'); } catch {}
  }
  if (apiProcess) {
    try { apiProcess.kill('SIGTERM'); } catch {}
  }
  if (pgProcess) {
    try {
      execSync(`"${pgCtlExe}" -D "${pgData}" -m fast stop`, { stdio: 'ignore' });
    } catch {
      try { pgProcess.kill('SIGINT'); } catch {}
    }
  }

  try {
    execSync('powershell -NoProfile -Command "try { Get-NetTCPConnection -LocalPort 3000, 54321 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } } catch {} exit 0"', { stdio: 'ignore' });
  } catch {}

  try {
    if (fs.existsSync(pidFile)) fs.unlinkSync(pidFile);
  } catch {}

  console.log(`${c.boldGreen}✅ Todos los servicios y túneles han sido cerrados correctamente.${c.reset}`);
  console.log(`${c.gray}¡Hasta pronto!${c.reset}\n`);

  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function start() {
  printHeader();

  console.log(`${c.boldWhite}Iniciando servicios en segundo plano...${c.reset}\n`);

  const postmasterPid = path.join(pgData, 'postmaster.pid');
  const pgAlreadyRunning = await isPostgresRunning();
  if (fs.existsSync(postmasterPid) && !pgAlreadyRunning) {
    try { fs.unlinkSync(postmasterPid); } catch {}
  }

  // 1. Iniciar PostgreSQL 16
  process.stdout.write(`  ${c.yellow}⏳${c.reset} [1/4] Base de Datos PostgreSQL 16 (Local)... `);
  if (!pgAlreadyRunning) {
    pgProcess = spawn(postgresExe, ['-D', pgData], {
      stdio: 'ignore',
      windowsHide: true
    });

    let pgReady = false;
    for (let i = 0; i < 20; i++) {
      await sleep(1000);
      if (await isPostgresRunning()) {
        pgReady = true;
        break;
      }
    }
    if (!pgReady) {
      console.log(`${c.boldMagenta}[FALLO]${c.reset}`);
      throw new Error('PostgreSQL no respondió a tiempo.');
    }
  }
  console.log(`${c.boldGreen}[ LISTO ]${c.reset}`);

  // 2. Iniciar Servidor API REST Local
  process.stdout.write(`  ${c.yellow}⏳${c.reset} [2/4] Servidor API REST Nativo (Puerto 54321)... `);
  const apiAlreadyRunning = await checkUrl('http://127.0.0.1:54321/health');
  if (!apiAlreadyRunning) {
    apiProcess = spawn(process.execPath, [apiServerScript], {
      stdio: 'ignore',
      windowsHide: true
    });

    let apiReady = false;
    for (let i = 0; i < 20; i++) {
      await sleep(1000);
      if (await checkUrl('http://127.0.0.1:54321/health')) {
        apiReady = true;
        break;
      }
    }
    if (!apiReady) {
      console.log(`${c.boldMagenta}[FALLO]${c.reset}`);
      throw new Error('El Servidor API no respondió a tiempo.');
    }
  }
  console.log(`${c.boldGreen}[ LISTO ]${c.reset}`);

  // 3. Iniciar Servidor Web Vite
  process.stdout.write(`  ${c.yellow}⏳${c.reset} [3/4] Servidor Web Vite para Red (Puerto 3000)... `);
  const viteAlreadyRunning = await checkUrl('http://localhost:3000/SISCEBA/');
  if (!viteAlreadyRunning) {
    viteProcess = spawn(process.execPath, [viteBin, '--host', '0.0.0.0', '--port', '3000'], {
      cwd: rootDir,
      stdio: 'ignore',
      windowsHide: true
    });

    let viteReady = false;
    for (let i = 0; i < 25; i++) {
      await sleep(1000);
      if (await checkUrl('http://localhost:3000/SISCEBA/')) {
        viteReady = true;
        break;
      }
    }
    if (!viteReady) {
      console.log(`${c.boldMagenta}[FALLO]${c.reset}`);
      throw new Error('El Servidor Web Frontend no respondió a tiempo.');
    }
  }
  console.log(`${c.boldGreen}[ LISTO ]${c.reset}`);

  // 4. Iniciar Cloudflare Tunnel
  process.stdout.write(`  ${c.yellow}⏳${c.reset} [4/4] Cloudflare Tunnel Seguro (HTTPS Multi-Dispositivo)... `);
  const tunnelResult = await startCloudflareTunnel();
  if (tunnelResult) {
    console.log(`${c.boldGreen}[ CONECTADO ]${c.reset}\n`);
  } else {
    console.log(`${c.yellow}[ OMITIDO - MODO LOCAL ACTIVO ]${c.reset}\n`);
  }

  // Guardar PIDs
  try {
    fs.writeFileSync(pidFile, JSON.stringify({
      runnerPid: process.pid,
      pgPid: pgProcess ? pgProcess.pid : null,
      apiPid: apiProcess ? apiProcess.pid : null,
      vitePid: viteProcess ? viteProcess.pid : null,
      cfPid: cfProcess ? cfProcess.pid : null,
      cloudflareUrl: cloudflareUrl || null,
      startedAt: new Date().toISOString()
    }, null, 2));
  } catch {}

  notifyConnectionEstablished();
  renderDashboard();

  if (process.stdin.isTTY) {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.on('keypress', async (str, key) => {
      if (key.ctrl && key.name === 'c') {
        await shutdown();
        return;
      }

      const input = (str || '').toLowerCase();

      if (input === 'q') {
        await shutdown();
      } else if (input === '1' && cloudflareUrl) {
        try {
          execSync('clip', { input: cloudflareUrl });
          renderDashboard(`📋 ¡Enlace Cloudflare Tunnel copiado al portapapeles! (${cloudflareUrl})`);
        } catch {
          renderDashboard(`⚠️ Enlace: ${cloudflareUrl}`);
        }
      } else if (input === '2') {
        try {
          spawn('explorer.exe', [localUrl], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
        } catch {}
        renderDashboard('🌐 Navegador abierto con éxito en http://localhost:3000/SISCEBA/');
      } else if (input === '3') {
        try {
          execSync('clip', { input: lanUrl });
          renderDashboard(`📋 Enlace de cable copiado al portapapeles: ${lanUrl}`);
        } catch {}
      } else if (input === '4') {
        const fwBat = path.join(rootDir, 'tools', 'configurar-firewall.bat');
        try {
          spawn('cmd.exe', ['/c', fwBat], { detached: true, stdio: 'ignore' }).unref();
          renderDashboard('🛡️ Solicitud de configuración de Firewall ejecutada con permisos de administrador.');
        } catch (e) {
          renderDashboard(`⚠️ Error ejecutando asistente de Firewall: ${e.message}`);
        }
      }
    });
  } else {
    setInterval(() => {}, 1000 * 60 * 60);
  }
}

start().catch(async (err) => {
  console.error(`\n${c.boldMagenta}❌ Error iniciando el sistema:${c.reset}`, err.message);
  await shutdown();
});
