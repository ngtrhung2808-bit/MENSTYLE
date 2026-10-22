@echo off
chcp 65001 >nul
title Mo Trang Quan Tri MENSTYLE Admin (Localhost)
color 0E

echo ========================================================
echo       DANG KHOI DONG TRANG QUAN TRI MENSTYLE ADMIN...
echo ========================================================
echo.
echo Tai khoan mac dinh: admin  (hoac admin@menstyle.vn)
echo Mat khau mac dinh : admin  (hoac admin123 / Admin@123456)
echo.

cd /d "%~dp0"
start /b cmd /c "cd server && npm start"
start /b cmd /c "npm run dev"
timeout /t 2 >nul

:: Mo trinh duyet mac dinh vao thang trang admin
start http://localhost:5173/?admin

echo.
echo ========================================================
echo   DA MO TRANG QUAN TRI THANH CONG!
echo   Dia chi: http://localhost:5173/?admin
echo ========================================================
echo.
timeout /t 3 >nul
exit
