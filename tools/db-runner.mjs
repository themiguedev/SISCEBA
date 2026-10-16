import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
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
const pidFile = path.join(rootDir, '.local_db', 'services.pid');

let pgProcess = null;
let apiProcess = null;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForPostgres() {
  process.stdout.write('⏳ Esperando motor PostgreSQL 16 (puerto 5432)... ');
  for (let i = 0; i < 30; i++) {
    try {
      execSync(`"${psqlExe}" -U postgres -h 127.0.0.1 -p 5432 -c "SELECT 1;"`, {
        stdio: 'ignore'
      });
      console.log('✅ Listo.');
      return true;
    } catch {
      await sleep(1000);
    }
  }
  throw new Error('PostgreSQL no respondió en el tiempo límite.');
}

async function waitForApiServer() {
  process.stdout.write('⏳ Esperando Servidor API Local (puerto 54321)... ');
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://127.0.0.1:54321/health');
      if (res.status === 200) {
        console.log('✅ Listo.');
        return true;
      }
    } catch {
      await sleep(1000);
    }
  }
  throw new Error('El Servidor API no respondió en el tiempo límite.');
}

function shutdown() {
  console.log('\n🛑 Cerrando servicios de base de datos local...');

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
    if (fs.existsSync(pidFile)) fs.unlinkSync(pidFile);
  } catch {}

  console.log('🏁 Todos los servicios locales han sido detenidos correctamente.');
  process.exit(0);
}

if (!process.env.SICEBA_DAEMON && !process.argv.includes('--daemon')) {
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

async function start() {
  console.log('=====================================================');
  console.log('🚀 INICIANDO ENTORNO DE BASE DE DATOS LOCAL SICE-CBA');
  console.log('=====================================================');

  // Limpiar postmaster.pid huérfano si existe y no hay proceso activo
  const postmasterPid = path.join(pgData, 'postmaster.pid');
  if (fs.existsSync(postmasterPid)) {
    try {
      execSync(`"${psqlExe}" -U postgres -h 127.0.0.1 -p 5432 -c "SELECT 1;"`, { stdio: 'ignore' });
      console.log('ℹ️ PostgreSQL ya está en ejecución.');
    } catch {
      console.log('🧹 Limpiando postmaster.pid huérfano...');
      try { fs.unlinkSync(postmasterPid); } catch {}
    }
  }

  // 1. Iniciar PostgreSQL
  console.log('🐘 Iniciando motor PostgreSQL 16...');
  pgProcess = spawn(postgresExe, ['-D', pgData], {
    stdio: 'ignore',
    windowsHide: true
  });

  await waitForPostgres();

  // 2. Iniciar Servidor API Local
  try {
    const res = await fetch('http://127.0.0.1:54321/health');
    if (res.status === 200) {
      console.log('ℹ️ Servidor API Local ya está activo en http://127.0.0.1:54321');
    } else {
      throw new Error('Servidor API no responde');
    }
  } catch {
    console.log('🌐 Iniciando Servidor API Local en http://127.0.0.1:54321...');
    apiProcess = spawn(process.execPath, [apiServerScript], {
      stdio: 'ignore',
      windowsHide: true
    });
    await waitForApiServer();
  }

  // Guardar PIDs
  fs.writeFileSync(
    pidFile,
    JSON.stringify({
      runnerPid: process.pid,
      pgPid: pgProcess ? pgProcess.pid : null,
      apiPid: apiProcess ? apiProcess.pid : null,
      startedAt: new Date().toISOString()
    }, null, 2)
  );

  console.log('\n=====================================================');
  console.log('🎉 BASE DE DATOS LOCAL ACTIVA Y LISTA PARA PRUEBAS');
  console.log('=====================================================');
  console.log('👉 PostgreSQL Nativo: postgresql://postgres@127.0.0.1:5432/sisceba');
  console.log('👉 Servidor API Local: http://127.0.0.1:54321/api/');
  console.log('👉 Diagnóstico Salud:  http://127.0.0.1:54321/health');
  console.log('=====================================================\n');

  // Mantener el proceso vivo indefinidamente
  if (process.stdin.setRawMode) process.stdin.resume();
  setInterval(() => {}, 1000 * 60 * 60);
}

process.on('uncaughtException', err => {
  console.error('[db-runner Uncaught Exception]:', err);
});

start().catch(err => {
  console.error('❌ Error fatal al iniciar servicios:', err);
  shutdown();
});
