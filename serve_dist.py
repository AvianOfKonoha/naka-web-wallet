import http.server
import socketserver
import os
import mimetypes
from urllib.parse import unquote

PORT = 8000
MOUNT_PATH = "/naka-dapp-vue"
DIST_DIR = "dist"

# Fix MIME type for JS modules
mimetypes.add_type('application/javascript', '.js')

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Remove query params
        path = unquote(path.split('?')[0])
        # Only serve files under /
        if path.startswith(MOUNT_PATH):
            relative_path = path[len(MOUNT_PATH):]
            if relative_path == "/" or relative_path == "":
                relative_path = "/index.html"
            return os.path.join(DIST_DIR, relative_path.lstrip("/"))
        # For anything else, respond with 404
        return "/dev/null"  # Non-existent path to trigger 404

    def log_message(self, format, *args):
        return  # silence logging

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"Serving 'dist/' at http://localhost:{PORT}{MOUNT_PATH}")
    httpd.serve_forever()
