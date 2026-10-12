"""Verifica che sw.js precarichi tutti i file dell'app e che l'aggiornamento attenda il tocco dell'utente."""
import re
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SW = ROOT / "sw.js"
# Moduli presenti ma non importati da nessuno: restano nel repo per scelta dell'utente (2026-10-12).
UNUSED = {
    "js/modules/history/historyView.js",
    "js/modules/school/classListCard.js",
    "js/modules/school/schoolStudentsList.js",
    "js/modules/students/studentsView.js",
}


def listed_files(src):
    js = set(re.findall(r'"\./(js/[^"]+\.js)"', src))
    css_names = re.search(r"const CSS = \[(.*?)\]", src, re.S).group(1)
    css = {f"css/{n}.css" for n in re.findall(r'"([^"]+)"', css_names)}
    core = re.search(r"const CORE_ASSETS = \[(.*?)\];", src, re.S).group(1)
    other = {p for p in re.findall(r'"\./([^"]+)"', core) if p}
    return js | css | other


class SwPrecacheTest(unittest.TestCase):
    def setUp(self):
        self.src = SW.read_text(encoding="utf-8")
        self.listed = listed_files(self.src)

    def test_listed_files_exist(self):
        missing = sorted(p for p in self.listed if not (ROOT / p).is_file())
        self.assertEqual(missing, [], "sw.js elenca file inesistenti: l'installazione fallirebbe")

    def test_every_app_file_is_precached(self):
        disk = {p.relative_to(ROOT).as_posix() for d in ("js", "css", "assets", "locales") for p in (ROOT / d).rglob("*") if p.is_file()}
        self.assertEqual(sorted(disk - self.listed - UNUSED), [], "file dell'app non precaricati: mancherebbero offline")

    def test_update_waits_for_user(self):
        install = re.search(r'addEventListener\("install".*?\n\}\);', self.src, re.S).group(0)
        self.assertNotIn("skipWaiting", install)
        self.assertIn('"SKIP_WAITING"', self.src)
        client = (ROOT / "js/services/pwaInstallService.js").read_text(encoding="utf-8")
        self.assertNotIn("location.reload", client)

    def test_sw_syntax(self):
        res = subprocess.run(["node", "--check", str(SW)], capture_output=True, text=True)
        self.assertEqual(res.returncode, 0, res.stderr)


if __name__ == "__main__":
    unittest.main()
