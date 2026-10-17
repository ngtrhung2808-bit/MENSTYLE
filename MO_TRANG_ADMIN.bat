@echo off
chcp 65001 >nul
title Mo Trang Quan Tri MENSTYLE Admin (Localhost)
color 0E

echo ========================================================
echo       DANG KHOI DONG TRANG QUAN TRI MENSTYLE ADMIN...
echo ========================================================
echo.
echo Tai khoan mac dinh: admin
echo Mat khau mac dinh : admin123
echo.
echo Dang tu dong mo trinh duyet vao trang Quan tri...

cd /d "%~dp0"
start /b cmd /c "npm run dev"
timeout /t 1 >nul

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
