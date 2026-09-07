#!/usr/bin/env python3
"""
Tools/test_qr_validity.py
Verifica di conformità matematica del generatore QR Code di Teacher Tools
rispetto allo standard ufficiale ISO/IEC 18004.
"""

import subprocess
import json
import sys
import qrcode

def main():
    test_url = "https://alessio-galbo.github.io/Teacher-Tools/#pair=1234567890abcdef"
    js_cmd = f"""
    import('./js/modules/sync/qrMatrix.js').then(m => {{
      const matrix = m.encodeQRMatrix('{test_url}');
      console.log(JSON.stringify(matrix));
    }});
    """
    res = subprocess.run(["node", "-e", js_cmd], capture_output=True, text=True)
    if res.returncode != 0:
        print("Errore esecuzione Node.js:", res.stderr)
        sys.exit(1)

    js_matrix = json.loads(res.stdout)
    qr = qrcode.QRCode(version=5, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=1, border=0, mask_pattern=0)
    qr.add_data(test_url)
    qr.make(fit=False)
    py_matrix = qr.get_matrix()

    size = len(py_matrix)
    diffs = sum(1 for r in range(size) for c in range(size) if js_matrix[r][c] != py_matrix[r][c])

    if diffs == 0:
        print(f"VERIFICA SUPERATA: La matrice QR ({size}x{size}) coincide al 100% con lo standard ISO/IEC 18004.")
        sys.exit(0)
    else:
        print(f"ERRORE: Rilevate {diffs} differenze su {size*size} moduli.")
        sys.exit(1)

if __name__ == "__main__":
    main()
