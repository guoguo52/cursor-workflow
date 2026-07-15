@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  《白衬衫》政府展示全案 · 本地预览
echo  地址: http://127.0.0.1:8770/
echo  （本项目专用端口，勿与乐动敦煌 8765 混用）
echo.
python -m http.server 8770
pause
