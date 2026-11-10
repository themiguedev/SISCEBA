import { execSync, spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const localDbDir = path.join(rootDir, '.local_db');
const pgsqlDir = path.join(localDbDir, 'pgsql');
const pgsqlBin = path.join(pgsqlDir, 'bin');
const pgData = path.join(localDbDir, 'data');
const postgresExe = path.join(pgsqlBin, 'postgres.exe');
const initdbExe = path.join(pgsqlBin, 'initdb.exe');
const zipPath = path.join(localDbDir, 'postgresql-16-binaries.zip');

const PG_ZIP_URL = 'https://get.enterprisedb.com/postgresql/postgresql-16.4-2-windows-x64-binaries.zip';

console.log('======================================================================');
console.log('📦 SICE-CBA: CONFIGURACIÓN AUTOMÁTICA DE BASE DE DATOS LOCAL POSTGRESQL');
console.log('======================================================================\n');

if (!fs.existsSync(localDbDir)) {
  fs.mkdirSync(localDbDir, { recursive: true });
}

async function setup() {
  // 1. Verificar o descargar binarios portables de PostgreSQL 16
  if (!fs.existsSync(postgresExe)) {
    console.log('⬇️  [1/3] Descargando motor PostgreSQL 16 portable para Windows (~326 MB)...');
    console.log(`    URL: ${PG_ZIP_URL}`);
    console.log('    Por favor espera un momento mientras se descarga...\n');

    try {
      execSync(`curl.exe -# -L -o "${zipPath}" "${PG_ZIP_URL}"`, { stdio: 'inherit' });
    } catch (err) {
      console.error('❌ Error al descargar PostgreSQL:', err.message);
      process.exit(1);
    }

    console.log('\n📂 [2/3] Extrayendo binarios de PostgreSQL en .local_db/pgsql...');
    try {
      execSync(`tar.exe -xf "${zipPath}" -C "${localDbDir}"`, { stdio: 'inherit' });
    } catch (err) {
      console.error('❌ Error al descomprimir PostgreSQL:', err.message);
      process.exit(1);
    }

    // Limpiar archivo ZIP descargado
    try {
      if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    } catch {}

    if (!fs.existsSync(postgresExe)) {
      console.error('❌ Error: No se encontró postgres.exe tras la extracción.');
      process.exit(1);
    }
    console.log('✅ Binarios de PostgreSQL 16 configurados correctamente.');
  } else {
    console.log('✅ [1/3] Binarios portables de PostgreSQL 16 ya presentes en .local_db/pgsql.');
  }

  // 2. Inicializar el clúster de datos en .local_db/data si no existe
  if (!fs.existsSync(pgData) || !fs.existsSync(path.join(pgData, 'PG_VERSION'))) {
    console.log('\n🌱 [2/3] Inicializando clúster de datos (initdb) en .local_db/data...');
    try {
      execSync(`"${initdbExe}" -D "${pgData}" -U postgres -E UTF8 --locale=C -A trust`, {
        stdio: 'inherit'
      });
      console.log('✅ Clúster de datos inicializado con éxito.');
    } catch (err) {
      console.error('❌ Error ejecutando initdb:', err.message);
      process.exit(1);
    }
  } else {
    console.log('✅ [2/3] Clúster de datos ya inicializado en .local_db/data.');
  }

  // 3. Ejecutar init-db.mjs para crear la base de datos sisceba, roles y esquemas
  console.log('\n📜 [3/3] Creando base de datos "sisceba" y ejecutando esquema institucional...');
  try {
    const initDbScript = path.join(__dirname, 'init-db.mjs');
    execSync(`node "${initDbScript}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Error inicializando esquema:', err.message);
    process.exit(1);
  }

  console.log('\n======================================================================');
  console.log('🎉 ¡CONFIGURACIÓN COMPLETADA CON ÉXITO!');
  console.log('   Ya puedes iniciar el sistema ejecutando INICIAR_SICEBA.bat');
  console.log('======================================================================\n');
}

setup().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
