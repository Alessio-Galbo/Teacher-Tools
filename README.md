# Teacher Tools 🎒
> **Suite Didattica & Gestionale per Docenti** — PWA Offline-First, Privacy al 100%, Multi-Istituto & Multi-Anno.

[![Pre-release](https://img.shields.io/badge/version-v0.5.0--beta-orange.svg)](CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-installable-green.svg)](manifest.json)
[![Zero Server](https://img.shields.io/badge/Privacy-100%25%20Client--Side-brightgreen.svg)](#-privacy--sicurezza-dei-dati)
[![Ko-fi](https://img.shields.io/badge/Support-Ko--fi-ff5f5f.svg?logo=kofi)](https://ko-fi.com/devangel)

Teacher Tools è un'applicazione web moderna concepita per insegnanti curricolari e docenti di sostegno. È progettata per funzionare interamente in locale nel browser (client-side), senza alcun server o database esterno: tutti i dati risiedono esclusivamente sul dispositivo del docente.

---

## 🌟 Moduli & Funzionalità Principali

### 1. 🔤 Semplificatore di Testo per DSA & BES
* **Spezzamento Logico delle Frasi:** segmentazione del testo basata sulla sintassi e sulla punteggiatura per facilitare la lettura e la comprensione.
* **Tipografia ad Alta Leggibilità:** supporto a caratteri studiati per la dislessia (OpenDyslexic, Atkinson Hyperlegible, Lexend, Arial) con regolazione di dimensione e interlinea.
* **Palette di Contrasto Visivo:** modalità Standard, Carta Crema, Giallo su Nero e Bianco su Blu.
* **Stampa & Copia:** generazione di schede didattiche pulite in PDF e copia rapida negli appunti.

### 2. 📝 Generatore di Verifiche & Schede Didattiche (Quiz Builder)
* **4 Tipologie di Quesito:** Scelta Multipla, Vero / Falso, Completa Frasi (Cloze `[...]`) e Risposta Aperta guidata.
* **Varianti Parallele Automatiche:** generazione di File A, B, ecc. con rimescolamento casuale delle domande e risposte (Fisher-Yates) mantenendo l'equivalenza didattica.
* **Calcolo Punteggio Flessibile:** pulsante duale per calcolo automatico dei punti dai quesiti o impostazione manuale, con pesi configurabili per tipologia.
* **Stampa Professionale:** stili di intestazione personalizzati (Istituzionale, Lineare, Compatto), impaginazione a 1 o 2 colonne, filtri campi e stampa multipla.

### 3. 📋 Compilatore PEI & Frasario Pedagogico (D.I. 182)
* **4 Dimensioni Ministeriali:** Relazione/socializzazione, Comunicazione/linguaggio, Autonomia/orientamento, Cognitiva/apprendimento.
* **Personalizzazione Frasario:** possibilità di nascondere le formule ministeriali standard e aggiungere formulazioni pedagogiche personalizzate.
* **Fascicolo Completo & Stampa:** anteprima documento in stile dossier ministeriale con stampa diretta e salvataggio PDF.

### 4. 📓 Diario di Bordo & Verbale Osservazioni d'Aula
* **Raggruppamento Gerarchico:** Macro-Gruppi visivi per Istituto con sottogruppi ordinati (*Note d'Istituto*, *Note di Classe*, *Note Individuali*).
* **Filtro Temporale Flessibile:** visualizzazione per Anno Scolastico Attivo o consultazione dello Storico Completo pluriennale.
* **Verbale Formattato:** esportazione osservazioni con testata d'istituto, statistiche e opzioni di stampa PDF.

### 5. 🏫 Scuola, Classi & Avanzamento Anno (Rollover)
* **Località Strutturata:** campi separati per Comune e Provincia (sigla 2 lettere) con anteprime ordinate.
* **Configurazione Istituti:** supporto a Primaria, Secondaria di 1° Grado, Secondaria di 2° Grado o Personalizzata.
* **Avanzamento Guidato (Rollover):** gestione di promossi, ripetenti e classi terminali a fine ciclo con badge visivi immediati.

---

## 🔒 Privacy & Sicurezza dei Dati su 3 Livelli
1. **Livello 1 (Offline Locale):** archiviazione istantanea su **IndexedDB** nel browser, funzionante al 100% offline.
2. **Livello 2 (Cloud Sync Google Drive):** sincronizzazione privata tramite OAuth 2.0 (Google Identity Services) direttamente sulla cartella riservata `TeacherTools_Data` di Google Drive, senza intermediari.
3. **Livello 3 (Backup & Migrazione):**
   * **Salva con Nome:** selezione della cartella locale di salvataggio (o cartella iCloud Drive / Google Drive).
   * **Scarica Backup Rapido & Ripristina:** esportazione e importazione in formato JSON per migrare i dati tra diversi dispositivi.

---

## ⚖️ Note Legali & Manleva
* **Strumento Ausiliario:** Teacher Tools è un supporto didattico e gestionale per la produttività personale del docente e **non sostituisce** i registri elettronici ministeriali ufficiali (ClasseViva, Axios, SIDI), che rimangono gli unici depositari formali della documentazione scolastica.
* **Licenza:** Rilasciato sotto licenza open source [MIT](LICENSE).

---

## ☕ Supporta il Progetto
Se trovi utile Teacher Tools per il tuo lavoro quotidiano a scuola, puoi supportare lo sviluppo offrendo un caffè:
👉 **[Supporta devangel su Ko-fi](https://ko-fi.com/devangel)**

---

## 🚀 Come Avviare l'Applicazione
* **Online (PWA):** Apri l'app nel browser e clicca su *"Installa Applicazione"* per usarla a schermo intero e offline su smartphone, tablet o PC.
* **Locale su Windows:** Fai doppio clic su `Avvia_Teacher_Tools.bat` per avviare il server locale portatile.
