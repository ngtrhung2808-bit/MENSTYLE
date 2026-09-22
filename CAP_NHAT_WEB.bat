@echo off
chcp 65001 >nul
title Cap Nhat Website MenStyle len Vercel
color 0A

echo ========================================================
echo       DANG DONG BO VA CAP NHAT WEBSITE LEN VERCEL...
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Kiem tra va them cac thay doi...
git add .

set /p msg=Nhap mo ta thay doi (hoac an Enter de dung mac dinh "Cap nhat giao dien"): 
if "%msg%"=="" set msg=Cap nhat giao dien website

echo.
echo [2/3] Luu thay doi vao he thong...
git commit -m "%msg%"

echo.
echo [3/3] Dang day len GitHub va kich hoat Vercel tu dong cap nhat...
git push origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo    CAP NHAT THANH CONG! 
    echo    Vercel dang tu dong build va cap nhat website sau 10 giay.
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo    CO LOI XAY RA KHI DAY LEN. Vui long kiem tra mang!
    echo ========================================================
)

echo.
pause
