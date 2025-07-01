@echo off
cd /d %~dp0
start "" http://localhost:8000/dapp-withdraw
python\python.exe serve_dist.py
pause
