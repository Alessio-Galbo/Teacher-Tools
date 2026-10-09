"""IP di LAN e QR per aprire Teacher Tools dallo smartphone: strumento AI-hub lan_qr, con ripiego se AI-hub manca."""
import os
import socket
import sys

# Cartella di AI-hub da AI_HUB_PATH (default: quella di questo PC)
sys.path.append(os.path.join(os.environ.get("AI_HUB_PATH") or r"D:\Git Repositories\AI-hub", "tools"))
try:
    from lan_qr import lan_ip, qr_text
except ImportError:  # AI-hub assente (progetto clonato altrove): IP della rotta verso internet, niente QR
    qr_text = None

    def lan_ip():
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            try:
                s.connect(("8.8.8.8", 80))
                return s.getsockname()[0]
            except OSError:
                return "127.0.0.1"


def get_lan_ip():
    return lan_ip()


def print_qr(url):
    if qr_text is None:
        print("  (QR non disponibile senza AI-hub: apri il link smartphone)\n")
        return
    try:
        qr = qr_text(url)
        print("  📷 Inquadra il QR con la fotocamera dello smartphone:\n")
        print(qr)
    except Exception:
        pass
