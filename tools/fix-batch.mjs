import fs from 'fs';
import path from 'path';

const projectDir = 'D:\\Usuarios\\UCE.FCBA\\Documents\\SIS-CBA';
const desktopDir = 'D:\\Usuarios\\UCE.FCBA\\Desktop';

const iniciarContent = [
  '@echo off',
  'title SICE-CBA - Iniciando en Segundo Plano',
  '',
  'REM 1. Ir a la carpeta del proyecto',
  `cd /d "${projectDir}"`,
  '',
  'REM 2. Ejecutar orquestador que levanta servicios en segundo plano',
  'node tools\\start-daemon.mjs',
  '',
  'REM 3. Salir y cerrar la consola de inmediato',
  'exit'
].join('\r\n') + '\r\n';

const detenerContent = [
  '@echo off',
  'title SICE-CBA - Detener Servicios en Segundo Plano',
  '',
  'echo ======================================================================',
  'echo           DETENIENDO SERVICIOS LOCALES SICE-CBA',
  'echo ======================================================================',
  'echo.',
  '',
  `cd /d "${projectDir}"`,
  '',
  'echo [1/2] Deteniendo base de datos, gateway y frontend...',
  'call npm.cmd run db:stop',
  '',
  'echo [2/2] Cerrando ventanas y consolas residuales...',
  'taskkill /FI "WINDOWTITLE eq SICE-CBA*" /T /F >nul 2>&1',
  '',
  'echo.',
  'echo ======================================================================',
  'echo   Todos los servicios y terminales han sido cerrados.',
  'echo ======================================================================',
  'echo.',
  'ping 127.0.0.1 -n 2 >nul',
  'exit'
].join('\r\n') + '\r\n';

fs.writeFileSync(path.join(desktopDir, 'INICIAR_SICEBA.bat'), iniciarContent, 'ascii');
fs.writeFileSync(path.join(projectDir, 'INICIAR_SICEBA.bat'), iniciarContent, 'ascii');
fs.writeFileSync(path.join(desktopDir, 'DETENER_SICEBA.bat'), detenerContent, 'ascii');
fs.writeFileSync(path.join(projectDir, 'DETENER_SICEBA.bat'), detenerContent, 'ascii');

console.log('Archivos .bat actualizados con éxito en el Escritorio y en la raíz del proyecto.');
