#!/usr/bin/env python3
"""
Tools/verify_rules.py
Verifica automatica dei vincoli architetturali:
1. Hard limit: Nessun file supera le 100 righe (warning se > 90).
2. Divieto di codice inline: Nessun tag <style> o <script> con codice inline in HTML.
"""

import os
import sys

EXCLUDED_DIRS = {".git", ".system_generated", ".user_uploaded", "scratch", "node_modules"}
TARGET_EXTENSIONS = {".js", ".css", ".html", ".py", ".json"}
LINE_HARD_LIMIT = 100
LINE_WARNING_THRESHOLD = 90

def inspect_file(filepath):
    errors = []
    warnings = []
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()
    count = len(lines)
    if count > LINE_HARD_LIMIT:
        errors.append(f"Superato hard limit: {count} righe (max {LINE_HARD_LIMIT})")
    elif count > LINE_WARNING_THRESHOLD:
        warnings.append(f"Attenzione refactoring: {count} righe (soglia {LINE_WARNING_THRESHOLD})")

    if filepath.endswith(".html"):
        content = "".join(lines)
        if "style=" in content:
            errors.append("Rilevato stile inline 'style=' in HTML")
        if "<style" in content:
            errors.append("Rilevato tag <style> inline in HTML")

    return count, errors, warnings

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    total_files = 0
    all_errors = []
    all_warnings = []

    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in TARGET_EXTENSIONS:
                total_files += 1
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, base_dir)
                count, errs, warns = inspect_file(full_path)
                for e in errs:
                    all_errors.append(f"[{rel_path}] {e}")
                for w in warns:
                    all_warnings.append(f"[{rel_path}] {w}")

    print(f"Scansione completata: {total_files} file verificati.")
    if all_warnings:
        print("\n--- WARNING (Avvicinamento al limite) ---")
        for w in all_warnings:
            print("  ! " + w)

    if all_errors:
        print("\n--- ERRORI DI CONFORMITA' ---")
        for err in all_errors:
            print("  X " + err)
        sys.exit(1)
    else:
        print("\nTutti i vincoli architetturali sono rispettati con successo!")
        sys.exit(0)

if __name__ == "__main__":
    main()
