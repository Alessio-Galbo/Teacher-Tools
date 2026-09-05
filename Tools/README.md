# Registro Strumenti e Utility (`/Tools`)

Questo documento funge da registro per tutti gli script e strumenti di supporto utilizzati nel ciclo di vita di Teacher Tools.

---

## 1. `verify_rules.py`
* **Scopo:** Validazione automatica dei vincoli architetturali del progetto prima del rilascio.
* **Cosa controlla:**
  1. **Regola delle 100 righe:** Accerta che nessun file (`.js`, `.css`, `.html`, `.py`, `.json`) superi il limite invalicabile di 100 righe di codice (emette warning sopra le 90 righe per refactoring tempestivo).
  2. **Zero codice inline:** Verifica che nei file HTML non siano presenti attributi `style=""` o tag `<style>` inline.
* **Come eseguirlo:**
  ```powershell
  python Tools/verify_rules.py
  ```

---

## 2. `server.py` & `Avvia_Teacher_Tools.bat`
* **Scopo:** Avvio rapido dell'applicazione in locale sia per uso su PC che per accesso diretto da smartphone connesso via Wi-Fi o Hotspot.
* **Cosa fa:**
  1. Rileva una porta libera disponibile (a partire dalla 8000) e si aggancia a tutte le interfacce di rete (`0.0.0.0`).
  2. Rileva l'indirizzo IP LAN / Hotspot del computer e stampa il link diretto per smartphone (`http://<ip>:<porta>`).
  3. Genera e mostra direttamente nel terminale un **Codice QR scansionabile** con la fotocamera del telefono per l'accesso istantaneo senza digitare l'IP.
  4. Apre automaticamente la finestra del browser del PC su `http://localhost:<porta>`.
  5. Mantiene attivo il server web locale fino alla chiusura della finestra.
* **Come utilizzarlo:**
  - Fare doppio clic sul file `Avvia_Teacher_Tools.bat` presente nella root del progetto.

---

## 3. `RELEASE_WORKFLOW.md`
* **Scopo:** Guida procedurale e architettura per il rilascio di nuove versioni e la gestione del changelog in-app.
* **Cosa descrive:**
  1. **Fonte Unica della Versione:** Come aggiornare `CURRENT_APP_VERSION` e `CHANGELOG_HISTORY` in `js/modules/info/changelogData.js`.
  2. **Zero-Hardcoding:** Registrazione delle chiavi descrittive in `locales/it.json` e `locales/en.json`.
  3. **Aggiornamento Cache PWA:** Incremento del numero di versione cache in `sw.js`.
  4. **Procedura di Rilascio Git & GitHub:** I comandi standard per tagging e pubblicazione note di rilascio.
* **Consulta la guida completa:** [RELEASE_WORKFLOW.md](RELEASE_WORKFLOW.md).
