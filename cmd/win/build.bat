@echo off

REM CUR: script directory, ROOT: aa-js directory
set "CUR=%~dp0"
cd /d "%CUR%..\.."
set "ROOT=%cd%"

REM run package.json scripts.build
npm run build