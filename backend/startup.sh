#!/bin/bash
cd /home/site/wwwroot
python3 -m pip install --no-cache-dir -r requirements.txt
gunicorn --bind=0.0.0.0:8000 --timeout 600 --workers 2 app:app