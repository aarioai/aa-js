@echo off

set "CUR=%~dp0"
cd /d "%CUR%..\.."
set "ROOT=%cd%"

npm test