import fs from 'fs';
import path from 'path';

const projectDir = 'D:\\Usuarios\\UCE.FCBA\\Documents\\SIS-CBA';
const desktopDir = 'D:\\Usuarios\\UCE.FCBA\\Desktop';

const iniciarContent = [
  '@echo off',
  'title SICE-CBA - Servidor Principal de Red',
  'chcp 65001 >nul',
  '',
  'REM Si se ejecuta con permisos de Administrador, asegurar acceso por cable / red',
  'net session >nul 2>&1',
  'if %errorlevel% equ 0 (',
  '    netsh advfirewall firewall delete rule name="node.exe" >nul 2>&1',
  '    netsh advfirewall firewall add rule name="Node.js (SICE-CBA)" dir=in action=allow program="D:\\usuarios\\uce.fcba\\nodejs\\node.exe" enable=yes profile=any >nul 2>&1',
  '    netsh advfirewall firewall add rule name="SICE-CBA Web (Puerto 3000)" dir=in action=allow protocol=TCP localport=3000 profile=any >nul 2>&1',
  '    netsh advfirewall firewall add rule name="SICE-CBA API (Puerto 54321)" dir=in action=allow protocol=TCP localport=54321 profile=any >nul 2>&1',
  ')',
  '',
  'cd /d "D:\\Usuarios\\UCE.FCBA\\Documents\\SIS-CBA"',
  'node tools\\server-runner.mjs',
  'if %errorlevel% neq 0 (',
  '    echo.',
  '    echo El servidor se detuvo con codigo: %errorlevel%',
  '    pause',
  ')'
].join('\r\n') + '\r\n';

const detenerContent = [
  '@echo off',
  'title SICE-CBA - Detener Servicios',
  'chcp 65001 >nul',
  'cd /d "D:\\Usuarios\\UCE.FCBA\\Documents\\SIS-CBA"',
  'echo ======================================================================',
  'echo           DETENIENDO SERVICIOS LOCALES SICE-CBA',
  'echo ======================================================================',
  'echo.',
  'echo [1/2] Deteniendo base de datos, API y frontend...',
  'node tools\\db-stop.mjs',
  'echo [2/2] Cerrando ventanas y consolas residuales...',
  'taskkill /FI "WINDOWTITLE eq SICE-CBA*" /T /F >nul 2>&1',
  'echo.',
  'echo ======================================================================',
  'echo   Todos los servicios y terminales han sido cerrados con exito.',
  'echo ======================================================================',
  'ping 127.0.0.1 -n 2 >nul',
  'exit'
].join('\r\n') + '\r\n';

const firewallContent = [
  '@echo off',
  'title SICE-CBA - Habilitar Acceso de Red en Firewall',
  'chcp 65001 >nul',
  '',
  'echo ======================================================================',
  'echo       CONFIGURANDO PERMISOS DE RED EN FIREWALL DE WINDOWS (SICE-CBA)',
  'echo ======================================================================',
  'echo.',
  '',
  'net session >nul 2>&1',
  'if %errorlevel% neq 0 (',
  '    echo [!] Solicitando permisos de Administrador para abrir los puertos...',
  '    powershell -NoProfile -Command "Start-Process cmd.exe -Verb RunAs -ArgumentList \'/c \"\"%~f0\"\" elevated\' "',
  '    exit /b',
  ')',
  '',
  'echo [1/3] Desbloqueando Node.js en Firewall...',
  'netsh advfirewall firewall delete rule name="node.exe" >nul 2>&1',
  'netsh advfirewall firewall delete rule name="Node.js: Server-side JavaScript" >nul 2>&1',
  'netsh advfirewall firewall delete rule name="Node.js (SICE-CBA)" >nul 2>&1',
  'netsh advfirewall firewall add rule name="Node.js (SICE-CBA)" dir=in action=allow program="D:\\usuarios\\uce.fcba\\nodejs\\node.exe" enable=yes profile=any >nul 2>&1',
  '',
  'echo [2/3] Habilitando puerto 3000 (Frontend Web SICE-CBA)...',
  'netsh advfirewall firewall delete rule name="SICE-CBA Web (Puerto 3000)" >nul 2>&1',
  'netsh advfirewall firewall add rule name="SICE-CBA Web (Puerto 3000)" dir=in action=allow protocol=TCP localport=3000 enable=yes profile=any >nul 2>&1',
  '',
  'echo [3/3] Habilitando puerto 54321 (API REST SICE-CBA)...',
  'netsh advfirewall firewall delete rule name="SICE-CBA API (Puerto 54321)" >nul 2>&1',
  'netsh advfirewall firewall add rule name="SICE-CBA API (Puerto 54321)" dir=in action=allow protocol=TCP localport=54321 enable=yes profile=any >nul 2>&1',
  '',
  'echo.',
  'echo ======================================================================',
  'echo   ✅ ACCESO DE RED HABILITADO CON EXITO.',
  'echo   Cualquier computador o dispositivo en la red de cable ya puede entrar.',
  'echo ======================================================================',
  'echo.',
  '',
  'if "%1"=="elevated" (',
  '    timeout /t 4 >nul',
  ')',
  'exit /b'
].join('\r\n') + '\r\n';

// Guardar en proyecto
fs.writeFileSync(path.join(projectDir, 'INICIAR_SICEBA.bat'), iniciarContent, 'ascii');
fs.writeFileSync(path.join(projectDir, 'DETENER_SICEBA.bat'), detenerContent, 'ascii');
fs.writeFileSync(path.join(projectDir, 'tools', 'configurar-firewall.bat'), firewallContent, 'ascii');

// Guardar en Escritorio
fs.writeFileSync(path.join(desktopDir, 'INICIAR_SICEBA.bat'), iniciarContent, 'ascii');
fs.writeFileSync(path.join(desktopDir, 'DETENER_SICEBA.bat'), detenerContent, 'ascii');
fs.writeFileSync(path.join(desktopDir, 'CONFIGURAR_FIREWALL.bat'), firewallContent, 'ascii');

console.log('✅ Archivos .bat sincronizados con CRLF estricto.');
