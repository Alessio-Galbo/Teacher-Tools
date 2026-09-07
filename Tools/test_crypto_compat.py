import sys
import subprocess
import hashlib
import json

if sys.platform == "win32":
    try: sys.stdout.reconfigure(encoding="utf-8")
    except Exception: pass

def test_crypto():
    cases = ["", "hello", "Teacher Tools 2026", "a" * 1000, "PEI - Dimensione 1: Relazione e Socializzazione! 🚀"]
    for c in cases:
        py_hash = hashlib.sha256(c.encode("utf-8")).hexdigest()
        node_cmd = f"import('./js/modules/sync/sha256.js').then(m => console.log(m.sha256Hex({json.dumps(c)})))"
        res = subprocess.run(["node", "-e", node_cmd], capture_output=True, text=True, check=True)
        js_hash = res.stdout.strip()
        assert py_hash == js_hash, f"Mismatch on {c}: {py_hash} vs {js_hash}"
    print("SUCCESS: All SHA-256 test cases match hashlib.sha256 bit-for-bit!")

if __name__ == "__main__":
    test_crypto()
