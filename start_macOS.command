#!/bin/bash
cd "$(dirname "$0")"
open http://localhost:8000/naka-dapp-vue
python3 serve_dist.py
