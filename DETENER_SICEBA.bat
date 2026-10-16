@echo off
title SICE-CBA - Detener Servicios
chcp 65001 >nul
cd /d "D:\Usuarios\UCE.FCBA\Documents\SIS-CBA"
echo ======================================================================
echo           DETENIENDO SERVICIOS LOCALES SICE-CBA
echo ======================================================================
echo.
echo [1/2] Deteniendo base de datos, API y frontend...
node tools\db-stop.mjs
echo [2/2] Cerrando ventanas y consolas residuales...
taskkill /FI "WINDOWTITLE eq SICE-CBA*" /T /F >nul 2>&1
echo.
echo ======================================================================
echo   Todos los servicios y terminales han sido cerrados con exito.
echo ======================================================================
ping 127.0.0.1 -n 2 >nul
exit
