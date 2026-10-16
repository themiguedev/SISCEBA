@echo off
title SICE-CBA - Habilitar Acceso de Red en Firewall
chcp 65001 >nul

echo ======================================================================
echo       CONFIGURANDO PERMISOS DE RED EN FIREWALL DE WINDOWS (SICE-CBA)
echo ======================================================================
echo.

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Solicitando permisos de Administrador para abrir los puertos...
    powershell -NoProfile -Command "Start-Process cmd.exe -Verb RunAs -ArgumentList '/c ""%~f0"" elevated' "
    exit /b
)

echo [1/3] Desbloqueando Node.js en Firewall...
netsh advfirewall firewall delete rule name="node.exe" >nul 2>&1
netsh advfirewall firewall delete rule name="Node.js: Server-side JavaScript" >nul 2>&1
netsh advfirewall firewall delete rule name="Node.js (SICE-CBA)" >nul 2>&1
netsh advfirewall firewall add rule name="Node.js (SICE-CBA)" dir=in action=allow program="D:\usuarios\uce.fcba\nodejs\node.exe" enable=yes profile=any >nul 2>&1

echo [2/3] Habilitando puerto 3000 (Frontend Web SICE-CBA)...
netsh advfirewall firewall delete rule name="SICE-CBA Web (Puerto 3000)" >nul 2>&1
netsh advfirewall firewall add rule name="SICE-CBA Web (Puerto 3000)" dir=in action=allow protocol=TCP localport=3000 enable=yes profile=any >nul 2>&1

echo [3/3] Habilitando puerto 54321 (API REST SICE-CBA)...
netsh advfirewall firewall delete rule name="SICE-CBA API (Puerto 54321)" >nul 2>&1
netsh advfirewall firewall add rule name="SICE-CBA API (Puerto 54321)" dir=in action=allow protocol=TCP localport=54321 enable=yes profile=any >nul 2>&1

echo.
echo ======================================================================
echo    ACCESO DE RED HABILITADO CON EXITO.
echo   Cualquier computador o dispositivo en la red de cable ya puede entrar.
echo ======================================================================
echo.

if "%1"=="elevated" (
    timeout /t 4 >nul
)
exit /b
