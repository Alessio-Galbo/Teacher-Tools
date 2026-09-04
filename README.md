# Teacher Tools 🎒
> **Suite Didattica & Gestionale per Docenti** — PWA Offline-First, Privacy al 100%, Multi-Istituto & Multi-Anno.

Teacher Tools è un'applicazione web moderna pensata per insegnanti e docenti di sostegno. È progettata per funzionare interamente in locale nel browser (client-side), senza alcun server o database esterno: tutti i dati risiedono esclusivamente sul dispositivo dell'utente.

---

## 🌟 Moduli & Funzionalità Principali

### 1. 📋 Compilatore PEI & Frasario Pedagogico (D.I. 182)
* **4 Dimensioni Ministeriali:**
  * Dimensione 1: Relazione, interazione e socializzazione.
  * Dimensione 2: Comunicazione e linguaggio.
  * Dimensione 3: Autonomia e orientamento.
  * Dimensione 4: Cognitiva, neuropsicologica e dell'apprendimento.
* **Personalizzazione Frasario:** visualizza o nascondi le formule ministeriali predefinite e aggiungi le tue formulazioni pedagogiche private, salvate e sincronizzate nei backup.
* **Fascicolo Completo & Stampa:** anteprima del documento formattato in stile dossier ministeriale con stampa diretta e salvataggio PDF.

### 2. 📓 Diario di Bordo & Verbale Osservazioni d'Aula
* **Raggruppamento Gerarchico:** Macro-Gruppi visivi per Istituto Scolastico con sottogruppi ordinati (*Note d'Istituto*, *Note di Classe*, *Note Individuali dello Studente*).
* **Filtro Temporale Flessibile:** visualizzazione per **Anno Scolastico Attivo** o consultazione dell'intero **Storico Completo** pluriennale.
* **Generatore di Riepilogo / Verbale:** esporta le osservazioni in un verbale formattato in carta dossier ministeriale con testata d'istituto, conteggi e opzioni di stampa PDF o copia rapida.

### 3. 🏫 Scuola, Classi & Avanzamento Anno (Rollover)
* **Configurazione Istituti:** supporto a scuola Primaria, Secondaria di 1° Grado, Secondaria di 2° Grado o modalità Personalizzata (con definizione del grado massimo).
* **Albero Didattico Interattivo:** visualizzazione ad albero con navigazione rapida e schede di panoramica a 360° per Istituto, Classe e Singolo Studente.
* **Avanzamento Guidato (Rollover):** procedura per il passaggio di anno con gestione automatica di promossi, ripetenti e classi terminali a fine ciclo.
* **Badge di Stato:** indicazione visiva immediata accanto all'alunno (`↗ Promosso/a`, `↩ Rimandato/a`, `🎓 Fine Ciclo`).

### 4. 👥 Gestione Alunni Unificata
* **Modal Unificata a Schede:**
  * **👤 Singolo:** compilazione dettagliata dei dati anagrafici, tipologia di supporto (*PEI*, *BES*, *Curricolare*) e note diagnostiche riservate.
  * **📋 Da Elenco:** inserimento massivo incollando la lista della classe dal registro elettronico o da Excel con pulizia automatica di numeri ed elenchi puntati.
* **Pinning:** possibilità di fissare in evidenza gli alunni seguiti prioritariamente.

### 5. 🔒 Sicurezza dei Dati su 3 Livelli
1. **Livello 1 (Offline Locale):** archiviazione istantanea su **IndexedDB** nel browser, funzionante al 100% offline.
2. **Livello 2 (Cloud Sync Google Drive):** sincronizzazione privata tramite OAuth 2.0 (Google Identity Services) direttamente sulla cartella riservata `TeacherTools_Data` di Google Drive, senza intermediari.
3. **Livello 3 (Backup & Migrazione):**
   * **Salva con Nome:** selezione della cartella locale di salvataggio (o cartella iCloud Drive / Google Drive).
   * **Scarica Backup Rapido & Ripristina:** esportazione e importazione in formato JSON per migrare i dati tra diversi dispositivi.

---

## 🚀 Come Avviare l'Applicazione

### Avvio Rapido su Windows:
Fare doppio clic sul file presente nella cartella principale:
```bat
Avvia_Teacher_Tools.bat
```
Lo script rileva una porta libera, avvia il server locale (`Tools/server.py`) e apre automaticamente la web app nel browser predefinito.

### Esecuzione Manuale:
```powershell
python Tools/server.py
```
Oppure aprire `index.html` tramite qualsiasi web server locale (es. Live Server di VS Code).

---

## 📐 Vincoli Architetturali & Linee Guida

Il progetto adotta standard ingegneristici rigorosi verificati automaticamente dallo script [`Tools/verify_rules.py`](file:///d:/Git%20Repositories/Teacher%20Tools/Tools/verify_rules.py):
1. **Regola delle 100 righe:** nessun file (`.js`, `.css`, `.html`, `.py`) può superare le 100 righe di codice (soglia di refactoring a 90 righe).
2. **Zero Hardcoding (i18n):** ogni testo dell'interfaccia risiede nei dizionari multilingua [`locales/it.json`](file:///d:/Git%20Repositories/Teacher%20Tools/locales/it.json) e [`locales/en.json`](file:///d:/Git%20Repositories/Teacher%20Tools/locales/en.json).
3. **Zero Codice Inline:** separazione assoluta tra logica JavaScript, template DOM e fogli di stile CSS Vanilla.
4. **PWA Offline:** Service Worker con cache dinamica e manifest per installazione su iPhone, iPad, Android e PC.

---

## 🛠️ Strumenti & Utility
Consultare il documento dedicato [Tools/README.md](file:///d:/Git%20Repositories/Teacher%20Tools/Tools/README.md) per i dettagli sugli script di supporto e manutenzione.
