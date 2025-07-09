@echo off

set "CUR=%~dp0"
cd /d "%CUR%..\.."
set "ROOT=%cd%"

:: Version of nodejs must greater than 21
npm test