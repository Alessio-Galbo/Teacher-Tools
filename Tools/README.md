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
* **Scopo:** Avvio rapido dell'applicazione in locale con un solo doppio clic, senza necessità di aprire il terminale o digitare comandi.
* **Cosa fa:**
  1. Rileva una porta libera disponibile (a partire dalla 8000).
  2. Apre automaticamente la finestra del browser predefinito all'indirizzo `http://localhost:<porta>`.
  3. Mantiene attivo il server web locale fino alla chiusura della finestra.
* **Come utilizzarlo:**
  - Fare doppio clic sul file `Avvia_Teacher_Tools.bat` presente nella root del progetto.

