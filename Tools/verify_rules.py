#!/usr/bin/env python3
"""
Tools/verify_rules.py
Wrapper sottile: le regole globali (file <= 100 righe, niente CSS/JS inline, HTML in stringhe, testi UI)
sono controllate da AI-hub/tools/project_rules.py. Stessi codici di uscita di prima: 1 solo se c'e'
un errore (righe oltre il limite o codice inline in HTML), altrimenti 0.
Percorso di AI-hub: variabile AI_HUB_ROOT, altrimenti la cartella "AI-hub" accanto a questo progetto.
"""

import os
import subprocess
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HUB = os.environ.get("AI_HUB_ROOT") or os.path.join(os.path.dirname(BASE), "AI-hub")
CHECKER = os.path.join(HUB, "tools", "project_rules.py")


def main():
    if not os.path.isfile(CHECKER):
        print(f"project_rules.py non trovato in {HUB} (imposta AI_HUB_ROOT).")
        return 2
    return subprocess.call([sys.executable, CHECKER, "--root", BASE] + sys.argv[1:])


if __name__ == "__main__":
    sys.exit(main())
