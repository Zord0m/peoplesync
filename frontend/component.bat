@echo off
setlocal enabledelayedexpansion

rem Verifica se foi passado o nome do diretório como parâmetro
if "%1"=="" (
    echo Por favor, forneca o nome do diretorio como parametro.
    exit /b
)

rem Cria o diretório dentro de frontend/public/component com o nome passado
mkdir "%~dp0public\component\%1"

rem Cria os arquivos HTML, CSS e JS no diretório especificado
echo %1 > "%~dp0public\component\%1\%1.html"

echo /* CSS para %1 */ > "%~dp0public\component\%1\%1.css"

echo // JS para %1 > "%~dp0public\component\%1\%1.js"

echo Arquivos criados com sucesso em "%~dp0public\component\%1"
pause
