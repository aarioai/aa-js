@echo off

REM CUR: script directory, ROOT: aa-ts directory
set "CUR=%~dp0"
cd /d "%CUR%..\.."
set "ROOT=%cd%"

REM https://tsdown.dev/zh-CN/options/watch-mode
echo Usage: --watch [path]
.\node_modules\.bin\tsdown --watch %1