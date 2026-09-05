#!/usr/bin/env python3
"""
Tools/server.py
Server HTTP locale con rilevamento IP e codice QR per smartphone.
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

def get_lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def find_available_port(start_port=8000, max_attempts=15):
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("0.0.0.0", port))
                return port
            except OSError:
                continue
    return start_port

def print_qr(url):
    try:
        if sys.platform == "win32":
            try:
                sys.stdout.reconfigure(encoding="utf-8")
            except Exception:
                pass
        import qrcode
        qr = qrcode.QRCode(border=1)
        qr.add_data(url)
        qr.make(fit=True)
        print("  📷 Inquadra il QR con la fotocamera dello smartphone:\n")
        qr.print_ascii(invert=True)
        print()
    except Exception:
        pass

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root_dir)

    port = find_available_port(8000)
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
