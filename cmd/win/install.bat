@echo off

:: CUR: script directory, ROOT: aa-js directory
set "CUR=%~dp0"
cd /d "%CUR%..\.."
set "ROOT=%cd%"

:: init package.json
if not exist "package.json" (
    npm init
)

:: install dependencies
call :install typescript
call :install ts-node
call :install @date-fns/tz
call :install date-fns

:: install jest
call :install ts-jest
call :install @types/jest
call :install @jest/globals
call :install jest-environment-jsdom

call :install tsdown

:: install package
:install <package>
    setlocal
    set "package=%~1"
    if not exist ".\node_modules\.bin\%package%" (
        echo install %package%
        npm install -D %package%
    )
endlocal & exit /b 0