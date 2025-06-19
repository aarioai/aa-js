@echo off

REM CUR: script directory, ROOT: aa-ts directory
set "CUR=%~dp0"
cd /d "%CUR%..\.."
set "ROOT=%cd%"

REM init package.json
if not exist "package.json" (
    npm init
)
REM install tsdown
if not exist ".\node_modules\.bin\rolldown" (
    npm install -D rolldown
)

REM echo tsdown version
.\node_modules\.bin\rolldown --version