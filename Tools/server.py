#!/usr/bin/env python3
"""
Tools/server.py
Server HTTP locale con rilevamento IP e codice QR per smartphone.
"""

import os
import argparse
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

# IP LAN + QR: Tools/lan_link.py (strumento AI-hub lan_qr, con ripiego se AI-hub manca)
from lan_link import get_lan_ip, print_qr  # noqa: E402

def find_available_port(start_port=8000, max_attempts=15):
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("0.0.0.0", port))
                return port
            except OSError:
                continue
    return start_port

def requested_port():
    """Porta scelta: --port N, poi variabile PORT (assegnata dall'AI-hub), poi 8000."""
    parser = argparse.ArgumentParser(description="Teacher Tools - server locale")
    parser.add_argument("--port", type=int, default=8000)
    args, _ = parser.parse_known_args()
    env = os.environ.get("PORT", "")
    if env.isdigit() and not any(a.startswith("--port") for a in sys.argv[1:]):
        return int(env)
    return args.port

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root_dir)

    try: sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # stdout rediretto (log AI-hub) in cp1252
    except Exception: pass
    port = find_available_port(requested_port())
    lan_ip = get_lan_ip()
    local_url = f"http://localhost:{port}"
    mobile_url = f"http://{lan_ip}:{port}"

    print("=" * 62)
    print("  TEACHER TOOLS - SERVER ATTIVO")
    print(f"  💻 Dal tuo computer:  {local_url}")
    print(f"  📱 Dal tuo smartphone: {mobile_url}")
    print("=" * 62)

    print_qr(mobile_url)
    webbrowser.open(local_url)

    ThreadingHTTPServer.daemon_threads = True
    server = ThreadingHTTPServer(("0.0.0.0", port), QuietHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
        sys.exit(0)

if __name__ == "__main__":
    main()
