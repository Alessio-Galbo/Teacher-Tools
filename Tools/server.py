#!/usr/bin/env python3
"""
Tools/server.py
Server HTTP locale multi-thread con auto-apertura del browser.
"""

import os
import sys
import socket
import mimetypes
import webbrowser
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("application/json", ".json")

class QuietHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

def find_available_port(start_port=8000, max_attempts=15):
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    return start_port

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root_dir)

    port = find_available_port(8000)
    url = f"http://localhost:{port}"

    print("=" * 55)
    print("  TEACHER TOOLS - SERVER LOCALE ATTIVO")
    print(f"  URL: {url}")
    print("  [NOTA] Lascia aperta questa finestra mentre usi l'app.")
    print("  (Chiudendola, il server si arresta).")
    print("=" * 55)

    webbrowser.open(url)

    ThreadingHTTPServer.daemon_threads = True
    server = ThreadingHTTPServer(("127.0.0.1", port), QuietHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
        sys.exit(0)

if __name__ == "__main__":
    main()
