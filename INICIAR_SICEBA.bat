@echo off
title SICE-CBA - Servidor Principal de Red
chcp 65001 >nul

REM Si se ejecuta con permisos de Administrador, asegurar acceso por cable / red
net session >nul 2>&1
if %errorlevel% equ 0 (
    netsh advfirewall firewall delete rule name="node.exe" >nul 2>&1
    netsh advfirewall firewall add rule name="Node.js (SICE-CBA)" dir=in action=allow program="D:\usuarios\uce.fcba\nodejs\node.exe" enable=yes profile=any >nul 2>&1
    netsh advfirewall firewall add rule name="SICE-CBA Web (Puerto 3000)" dir=in action=allow protocol=TCP localport=3000 profile=any >nul 2>&1
    netsh advfirewall firewall add rule name="SICE-CBA API (Puerto 54321)" dir=in action=allow protocol=TCP localport=54321 profile=any >nul 2>&1
)

cd /d "D:\Usuarios\UCE.FCBA\Documents\SIS-CBA"
node tools\server-runner.mjs
if %errorlevel% neq 0 (
    echo.
    echo El servidor se detuvo con codigo: %errorlevel%
    pause
)
