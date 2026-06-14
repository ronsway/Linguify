@echo off
echo Stopping Linguify dev server...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo Done.
