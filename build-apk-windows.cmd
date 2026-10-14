@echo off
rem ML Server Selector 1.4.0 - local APK build on Windows (see WINDOWS_APK_BUILD.md)
setlocal
cd /d "%~dp0"

where bun >nul 2>nul || (echo [ERROR] Bun not found. Install: powershell -c "irm bun.sh/install.ps1 | iex" & goto :fail)
where node >nul 2>nul || (echo [ERROR] Node.js not found. Install Node 22 LTS from nodejs.org & goto :fail)

if not defined JAVA_HOME if exist "%ProgramFiles%\Android\Android Studio\jbr\bin\java.exe" set "JAVA_HOME=%ProgramFiles%\Android\Android Studio\jbr"
if not defined JAVA_HOME (echo [ERROR] JAVA_HOME is not set. Install JDK 17 or Android Studio. & goto :fail)

if not defined ANDROID_HOME if exist "%LOCALAPPDATA%\Android\Sdk" set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
if not defined ANDROID_HOME (echo [ERROR] ANDROID_HOME is not set. Install Android Studio and its SDK. & goto :fail)

echo JAVA_HOME=%JAVA_HOME%
echo ANDROID_HOME=%ANDROID_HOME%
echo Project: %CD%

echo.
echo [1/3] bun install
call bun install || goto :fail

echo.
echo [2/3] expo prebuild (generates packages\mobile\android)
cd packages\mobile
call bunx expo prebuild -p android --clean --no-install || goto :fail

echo.
echo [3/3] gradlew assembleRelease (10-30 min on first run)
cd android
call gradlew.bat assembleRelease || goto :fail

copy /y "app\build\outputs\apk\release\app-release.apk" "%~dp0ML-Server-Selector-1.4.0.apk" >nul || goto :fail
echo.
echo DONE: %~dp0ML-Server-Selector-1.4.0.apk
endlocal
exit /b 0

:fail
echo.
echo BUILD FAILED. Copy the last ~50 lines above and send them.
endlocal
exit /b 1
