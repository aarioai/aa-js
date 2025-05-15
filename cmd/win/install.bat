@echo off

REM CUR: script directory, ROOT: aa-js directory
set "CUR=%~dp0"
cd /d "%CUR%..\.."
set "ROOT=%cd%"

REM init package.json
if not exist "package.json" (
    npm init
)
REM install tsdown
if not exist ".\node_modules\.bin\tsdown" (
    npm install -D tsdown
)

REM echo tsdown version
.\node_modules\.bin\tsdown --version