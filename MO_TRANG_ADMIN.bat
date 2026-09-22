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

:: Mo trinh duyet mac dinh vao thang trang admin
start http://localhost:5173/?admin

echo.
echo ========================================================
echo   DA MO TRINH DUYET THANH CONG!
echo   (Neu web chua chay, nho bat them terminal: npm run dev)
echo ========================================================
echo.
timeout /t 3 >nul
exit
