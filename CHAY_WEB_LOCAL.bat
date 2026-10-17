@echo off
chcp 65001 >nul
title MENSTYLE Fashion - Khoi Dong & Mo Website Localhost
color 0B

echo ========================================================
echo       DANG KHOI DONG HE THONG MENSTYLE LOCALHOST...
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Dang kiem tra va khoi dong may chu Vite Local...
start /b cmd /c "npm run dev"

echo.
echo [2/2] Dang mo trinh duyet vao trang web MenStyle...
timeout /t 2 >nul
start http://localhost:5173/

echo.
echo ========================================================
echo   HE THONG DA CHAY THANH CONG TAI:
echo   - Trang Khach Hang: http://localhost:5173/
echo   - Trang Quan Tri  : http://localhost:5173/?admin
echo.
echo   (Nhan giu cua so nay de duy tri may chu web)
echo ========================================================
echo.
pause
