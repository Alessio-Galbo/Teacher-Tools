# Istruzioni Operative per Agenti AI (Teacher Tools)

Questo documento guida gli agenti AI e i collaboratori per mantenere coerenza e conformità architetturale.

---

## 1. Regole Architetturali Fondamentali
1. **Regola dei 100 limiti (Stop a 90 righe):** Nessun file (`.js`, `.css`, `.html`, `.py`, `.json`) deve mai superare le 100 righe. Se un file supera le 90 righe, rifattorizzare immediatamente.
2. **Zero Hardcoding (i18n):** Nessun testo visibile all'utente va inserito direttamente nel codice. Usare sempre `locales/it.json` e `locales/en.json`.
3. **Zero Inline Code:** Nessun CSS o JS inline. Utilizzare fogli di stile o moduli dedicati.
4. **Permission First su Git:** MAI eseguire `git commit` o `git push` in autonomia. Chiedere sempre esplicita conferma all'utente.
5. **Registro `/Tools`:** Mantenere sempre aggiornato `Tools/README.md` quando si aggiungono o modificano script/utility.

---

## 2. Sistema di Versione & Changelog
La versione dell'applicazione e le note di rilascio seguono il principio della **Singola Fonte di Verità**:

* **Fonte Dati & Costante Versione:** [`js/modules/info/changelogData.js`](js/modules/info/changelogData.js)
  * `CURRENT_APP_VERSION`: stringa con la versione attuale (es. `"0.5.0"`).
  * `CHANGELOG_HISTORY`: array con le release storiche (`version`, `date`, `titleKey`, `items`).
* **Interfaccia Badge & Modale:**
  * Il badge versione nella modale Info (`ℹ️`) legge direttamente `CURRENT_APP_VERSION`.
  * Accanto al badge c'è il pulsante `[ 📜 Changelog ]` gestito da [`js/modules/info/changelogModal.js`](js/modules/info/changelogModal.js).
* **Notifica Automatica al Lancio:**
  * [`js/modules/info/updateNotifier.js`](js/modules/info/updateNotifier.js) confronta all'avvio `CURRENT_APP_VERSION` con `localStorage` (`teacher_tools_last_seen_version`).
  * Se la versione è cambiata, mostra automaticamente la modale con le novità.

---

## 3. Come Rilasciare una Nuova Versione (Workflow in 4 Step)
Per rilasciare un aggiornamento (es. `v0.X.Y`):
1. **`js/modules/info/changelogData.js`:**
   * Aggiorna `CURRENT_APP_VERSION = "0.X.Y"`.
   * Aggiungi in testa a `CHANGELOG_HISTORY` la nuova voce con le relative chiavi i18n (`changelog_v0XY_title`, `items: [...]`).
2. **`locales/it.json` e `locales/en.json`:** Aggiungi le traduzioni delle chiavi create.
3. **`sw.js`:** Incrementa `CACHE_NAME` (es. `teachertools-v44` -> `teachertools-v45`).
4. **Verifica & Proposta:**
   * Esegui `python Tools/verify_rules.py`.
   * Proponi il piano e attendi la conferma dell'utente prima di eseguire commit e tag git.

Per i dettagli completi, consultare [`Tools/RELEASE_WORKFLOW.md`](Tools/RELEASE_WORKFLOW.md).
