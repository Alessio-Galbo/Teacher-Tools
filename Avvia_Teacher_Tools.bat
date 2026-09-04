@echo off
title Teacher Tools Launcher
cd /d "%~dp0"

where python >nul 2>nul
if %errorlevel% equ 0 (
    python Tools\server.py
    goto end
)

where py >nul 2>nul
if %errorlevel% equ 0 (
    py Tools\server.py
    goto end
)

echo [ERRORE] Python non e stato trovato nel sistema.
echo Installa Python per avviare Teacher Tools.
pause

:end
