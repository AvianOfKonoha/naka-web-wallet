@echo off
cd /d %~dp0
start "" http://localhost:8000/withdraw-app
python\python.exe serve_dist.py
pause
