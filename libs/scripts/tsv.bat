@echo off
chcp 65001 > nul
REM TSV Import/Export Helper

if "%1"=="" goto usage

if /I "%1"=="export" goto export
if /I "%1"=="import" goto import
if /I "%1"=="exportall" goto exportall
goto usage

:export
if "%2"=="" (
    echo Error: Missing color
    goto usage
)
python import_from_tsv.py export %2
goto end

:import
if "%2"=="" (
    echo Error: Missing TSV file
    goto usage
)
if "%3"=="" (
    echo Error: Missing color
    goto usage
)
set MODE=update
if not "%4"=="" set MODE=%4
python import_from_tsv.py import %2 %3 %MODE%
goto end

:exportall
echo Exporting all colors...
for %%c in (ius golden yellow red green blue purple) do (
    echo.
    echo === Exporting %%c ===
    python import_from_tsv.py export %%c
)
echo.
echo All colors exported!
goto end

:usage
echo.
echo TSV Import/Export Helper
echo ========================
echo.
echo Usage:
echo   tsv.bat export ^<color^>
echo   tsv.bat import ^<tsv_file^> ^<color^> [mode]
echo   tsv.bat exportall
echo.
echo Examples:
echo   tsv.bat export golden
echo   tsv.bat import golden_skills.tsv golden
echo   tsv.bat import golden_skills.tsv golden update
echo   tsv.bat import golden_skills.tsv golden replace
echo   tsv.bat exportall
echo.
echo Colors: ius, golden, yellow, red, green, blue, purple
echo Modes: update (default), replace, add
echo.
goto end

:end
