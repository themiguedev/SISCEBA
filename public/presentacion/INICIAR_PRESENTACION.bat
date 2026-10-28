@echo off
title Presentación SICE-CBA vs Sistema Anterior (CEO)
chcp 65001 >nul
cls

echo =====================================================================
echo    SICE-CBA - Presentación Comparativa Institucional
echo    U.E.P. Colegio Bellas Artes
echo =====================================================================
echo.
echo  Abriendo presentación en su navegador web predeterminado...
echo.

cd /d "%~dp0"
start "" "index.html"

timeout /t 2 /nobreak >nul
exit
