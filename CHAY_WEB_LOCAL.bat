@echo off
chcp 65001 >nul
title MENSTYLE Fashion - Khoi Dong Full He Thong (Frontend + Backend)
color 0B

echo ========================================================
echo       DANG KHOI DONG TOAN BO HE THONG MENSTYLE...
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Dang khoi dong Backend Server (Node.js - Port 5000)...
start /b cmd /c "cd server && npm start"

echo.
echo [2/3] Dang khoi dong Frontend Client (Vite - Port 5173)...
start /b cmd /c "npm run dev"

echo.
echo [3/3] Dang ket noi MongoDB Atlas va mo trinh duyet...
timeout /t 3 >nul

start http://localhost:5173/

echo.
echo ========================================================
echo   HE THONG DA CHAY THANH CONG TAI:
echo   - Trang Khach Hang: http://localhost:5173/
echo   - Trang Quan Tri  : http://localhost:5173/?admin
echo   - Backend API     : http://localhost:5000/api/health
echo.
echo   Tai khoan Admin : admin  (hoac admin@menstyle.vn)
echo   Mat khau Admin  : admin  (hoac admin123 / Admin@123456)
echo.
echo   (Vui long giu cua so nay de duy tri may chu web)
echo ========================================================
echo.
pause
