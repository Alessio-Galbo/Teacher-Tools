# Registro delle Modifiche (Changelog)

Tutte le modifiche rilevanti apportate a **Teacher Tools** sono documentate in questo file.  
Il formato segue le convenzioni di [Keep a Changelog](https://keepachangelog.com/it/1.0.0/) e aderisce alle specifiche [Semantic Versioning 2.0 (Pre-release 0.x)](https://semver.org/lang/it/).

---

## [0.6.0] - 2026-09-07

### Aggiunto
- **Selezione Profilo Dispositivo & Loading Screen Nativo:**
  - Schermata di caricamento iniziale a zero-glimpse integrata nel DOM con icona ufficiale ad alta risoluzione (`assets/icon-192.png`).
  - Barra di caricamento progressivo a monitoraggio delle fasi di bootstrap (archivio locale, traduzioni, servizi, viste).
  - Scelta modalità operativa all'avvio: *Dispositivo Personale* (con bypass "Ricorda su questo dispositivo") vs *Computer Condiviso (Modalità Ospite)*.
- **Modalità Computer Condiviso (Ospite) & Onboarding Guidato:**
  - Badge permanente rosso in testata `[ 🔴 Ospite ]` per prevenire dimenticanze su LIM o PC d'istituto.
  - Schermata di onboarding d'aula con 3 scelte operative: *Sessione Vuota da Zero*, *Sincronizza da Smartphone* e *Ripristina Sessione Sospesa*.
  - Distruzione integrale istantanea dei dati (`clearAllStores()`) all'uscita esplicita dell'app a garanzia della privacy.
- **Blocco Schermo LIM & Gestione PIN di Emergenza:**
  - Schermata di blocco standby interattiva per oscurare i dati sensibili degli alunni quando il docente si allontana dalla cattedra, con visualizzazione del docente in servizio.
  - Tripla modalità di sblocco: inquadrando il QR dallo smartphone abbinato, toccando la notifica remota push sullo smartphone, oppure inserendo un PIN di emergenza a 4 cifre.
  - Gestione granulare del PIN dalle Impostazioni o direttamente dalla schermata di blocco con interfaccia responsive ottimizzata (su desktop allineata a riga singola, su mobile snella con icone ✏️/🗑️).
  - Modale PIN sagomata su misura (`modal-pin`) per un layout gradevole e minimale.
- **Salvataggio & Ripristino Cifrato Sessioni Sospese (Zero-Knowledge):**
  - Salvataggio condizionale automatico: se un collega preme "Termina Sessione Precedente" dalla schermata di blocco, la sessione viene cifrata con AES-GCM 256-bit usando il token dello smartphone abbinato e archiviata in forma protetta (`tt_suspended_guest_sessions`).
  - Uscita volontaria pulita: se l'app è in funzione e il docente clicca su Termina Sessione, tutti i dati vengono polverizzati senza creare sessioni sospese.
  - Riconoscimento crittografico passivo: inquadrando il QR dal telefono precedentemente associato, la postazione verifica l'hash del token e mostra un prompt privato per ripristinare il database o eliminare il salvataggio.
  - Scadenza naturale e auto-pruning a 30 giorni (ideale per coprire festività scolastiche, ponti o brevi assenze) con tetto massimo di 5 sessioni recenti.
- **Auto-Sync Cartella Locale / Cloud Desktop (Directory Sync):**
  - Integrazione nativa con la File System Access API (`window.showDirectoryPicker()`) per il mirroring continuo su cartelle collegate (Google Drive per Desktop, OneDrive, chiavette USB).
  - Supporto multi-cartella simultaneo e inibizione automatica totale in Modalità Ospite (gestore isolato in `TT_LocalSyncHandlesDB`).
- **Accoppiamento Crittografico & Rete Personale (Device Mesh):**
  - Generazione di token casuali a 256 bit crittografici (`crypto.getRandomValues`) e Codice QR generato via SVG nativo a zero dipendenze esterne.
  - Scansione fotocamera da smartphone e alternativa manuale con passphrase mnemonica a 4 parole.
  - Storico persistente dei codici di abbinamento su smartphone (`pairingHistory.js`) per riautenticazioni e sblocchi automatici.
- **LocalSync WebRTC ad Alta Velocità & Chunking Dati:**
  - Canale dati Peer-to-Peer diretto e crittografato su rete Wi-Fi o Hotspot tra PC e smartphone con badge di presenza interattivo in testata.
  - Trasferimento dati frammentato a pacchetti (chunking) e compressione Deflate/Gzip via `CompressionStream` con fallback per grandi archivi didattici.
  - Motore di fusione differenziale bilaterale degli store con creazione obbligatoria di `Pre-Sync Snapshot` prima di applicare modifiche.

---

## [0.5.0] - 2026-09-05

### Aggiunto
- **Modulo Strumenti & Utility Didattiche (Tools View):** nuova sezione principale nella barra di navigazione con selettore a tendina a tutta larghezza per l'accesso immediato agli strumenti didattici.
- **Semplificatore di Testo per DSA & BES:**
  - Spezzamento logico delle frasi basato su punteggiatura forte e congiunzioni coordinanti/subordinanti.
  - Selezione di 4 font ad alta leggibilità (OpenDyslexic, Atkinson Hyperlegible, Lexend, Arial).
  - Regolazione granulare di dimensione carattere, interlinea maggiorata e 4 palette di contrasto (Standard, Carta Crema, Giallo su Nero, Bianco su Blu).
  - Stampa scheda didattica ad alta leggibilità in PDF e copia rapida del testo negli appunti.
- **Generatore di Verifiche & Schede Didattiche (Quiz Builder):**
  - Composizione rapida quesiti: Scelta Multipla, Vero / Falso, Completa Frasi (Cloze con scorciatoia `[...]`) e Risposta Aperta con righe guidate.
  - Gestione Varianti Parallele (es. Fila A, Fila B) con rimescolamento casuale di domande e risposte (Fisher-Yates) mantenendo l'equivalenza dei contenuti.
  - Calcolo Punteggio Flessibile: pulsante toggle duale `[ ⚡ Calcola da quesiti | ⚖️ ]` (o `[ ⚡ Auto: Attivo | ⚖️ ]`) per commutare all'istante tra somma automatica e punteggio manuale.
  - Modale Pesi & Punteggi: interfaccia a box compatti con icone identificative (`🔘`, `✔️`, `🔤`, `✍️`), punteggio unitario `pt` e tasti `[ Annulla ]` e `[ Salva ]` centrati ed equidistanti.
  - Modulo Stampa Avanzato: 3 stili di intestazione (Istituzionale Formale, Lineare Moderno, Compatto Salvaspazio), impaginazione domande a 1 o 2 colonne, selettore granulare campi visibili (Docente, Alunno, Data & Classe, Punti, Voto, Argomento, Materia), stampa singola o collettiva di tutte le varianti senza margini browser.
  - Archivio Verifiche: persistenza locale su IndexedDB (`quiz_tests`), ricaricamento, duplicazione ("Salva come Nuova Copia") e modifica rapida.
- **Gestione Avanzata Località Scuole:**
  - Campi strutturati e separati per **Comune** e **Provincia** (sigla automatica a 2 lettere in maiuscolo) nella creazione e modifica istituti.
  - Visualizzazione gerarchica ordinata nei riquadri scuola (`📍 Comune (PR)` sotto il nome della scuola) e formattazione pulita nei menu a tendina (`Nome Scuola - Comune (PR)`).
- **Pulsante Informazioni (ℹ️) & Supporto Ko-fi:**
  - Nuovo pulsante dedicato nell'header accanto alle impostazioni.
  - Modale con versione corrente, informativa privacy 100% client-side, disclaimer legale e pulsante donazione Ko-fi.

### Risolto & Ottimizzato
- **Pulsante PWA a Piena Larghezza:** esteso il pulsante al 100% della larghezza della scheda (`btn-block`) sia su desktop che su mobile, con dicitura sintetica `"📲 Installa Applicazione"` per prevenire debordamenti.
- **Badge PWA Compatto:** etichette concise (`"Disponibile"` / `"✅ Installata"`) senza deformazioni su mobile.
- **Spaziatura Inferiore Footer Modali:** aggiunto respiro (18px di padding inferiore) per i pulsanti di azione nei dialoghi modali.
- **Ottimizzazione UI Mobile:**
  - Allineamento su singola riga per i pulsanti rapidi del Diario di Bordo.
  - Ritorno a capo naturale per il pulsante "Personalizza Frasi" nel modulo PEI.
  - Icona scuola `🏫` su smartphone e testo esteso `+ Aggiungi Scuola` su desktop.
- **Griglia Backup Impostazioni:** nuova griglia responsive a 3 colonne simmetriche su desktop e 1 colonna a tutta larghezza su mobile per `[ 💾 Salva con Nome ]`, `[ ⚡ Backup Rapido ]`, `[ 📂 Ripristina ]`.
- **Fix Troncamento Testo Cloud:** rimossa la limitazione ellissi su smartphone per la sincronizzazione Google Drive, consentendo il wrapping fluido della descrizione.
- **Profilo Docente a Due Colonne:** campi "Nome e Cognome" e "Materia" affiancati su 2 colonne simmetriche su schermi desktop (≥640px).

---

## [0.4.0] - 2026-09-04

### Aggiunto
- **Inserimento Studenti Unificato:** il modal `+👤` include ora due schede integrate: `👤 Singolo` (per la compilazione anagrafica e pedagogica dettagliata) e `📋 Da Elenco` (per incollare elenchi di classe da registro o fogli di calcolo con rilevamento istantaneo e pulizia nomi).
- **Macro-Gruppi Gerarchici nel Diario Note:** quando si visualizzano tutti gli studenti, le note sono organizzate in macro-gruppi visivi per Istituto Scolastico, con sottogruppi dedicati per *Note d'Istituto*, *Note di Classe* e *Note Individuali*.
- **Badge di Avanzamento Studente nell'Albero:** badge visivi di stato immediato (`↗ Promosso/a`, `↩ Rimandato/a`, `🎓 Fine Ciclo`) accanto al tipo di supporto didattico.
- **Guida Passo-Passo Google Cloud Console:** procedura guidata numerata a 4 passaggi integrata nel modal di inserimento Client ID.

### Risolto & Ottimizzato
- **Fix Allucinazioni nel Riepilogo Istituto:** corretto il filtro di appartenenza degli studenti alle scuole, eliminando l'inclusione indebita degli studenti generici senza plesso assegnato e attivando la deduplicazione.
- **Fix Priorità Badge Ripetenti in Classi Terminali:** invertita la priorità in `getAdvancementBadge`; gli alunni rimandati nella stessa classe (es. 5° B) ricevono ora regolarmente il badge giallo `↩ Rimandato/a` anziché essere contrassegnati a fine ciclo.
- **Fix Header Panoramica Classe:** eliminata la visualizzazione dell'ID interno (`cls_...`) a favore del nome effettivo della classe (es. `5° B`).
- **Pulsante `+👤` su Mobile:** convertito in `.btn-icon-only` per impedire l'occultamento su viewport ridotti (≤ 560px).
- **Intestazione Sezioni Responsive:** impaginazione verticale automatica su schermi < 640px per evitare il troncamento dei titoli.
- **Ridenominazione Trasparente Salvataggio:** rinominato *"Salva su File (iCloud)"* in *"Salva con Nome (File JSON)"* e *"Livello 3: Backup Locale & Salvataggio File"*, descrivendo con precisione l'azione su desktop e chiarificando l'uso su mobile.
- **Semplificazione Google Drive:** unificato il pulsante d'azione in *"⚙️ Configura Google Drive"* in assenza di credenziali, rimuovendo pulsanti duplicati che aprivano la stessa schermata.

---

## [0.3.0] - 2026-09-04

### Aggiunto
- **Avanzamento Anno Scolastico (Rollover):** procedura guidata di passaggio al nuovo anno scolastico con gestione contestuale di promossi, ripetenti e classi terminali a fine ciclo.
- **Selettore Anno Dinamico:** menu dropdown nell'header per commutare l'anno attivo o creare nuovi anni scolastici (presenti o futuri) in qualsiasi momento.
- **Schede di Lettura a 360°:** panoramica interattiva al click per Istituto Scolastico, Classe e Singolo Studente, con navigatore storico tra gli anni.
- **Tipologia Scuola & Grado Massimo:** supporto per Scuola Primaria, Secondaria di 1° Grado, Secondaria di 2° Grado o configurazione Personalizzata con limite classi flessibile.
- **Modifica Classe & Didattica:** possibilità di rinominare le classi e registrare la programmazione didattica annuale o annotazioni d'aula.

---

## [0.2.0] - 2026-09-04

### Aggiunto
- **Fascicolo / Verbale Osservazioni d'Aula:** generatore di relazione formattata in carta dossier ministeriale con intestazione, statistiche, stampa diretta in PDF e copia rapida.
- **Personalizzazione Frasario PEI:** gestione della visibilità delle formule ministeriali predefinite e aggiunta di formule pedagogiche personalizzate del docente.
- **Store `pei_phrases`:** persistenza delle formule personalizzate in IndexedDB, integrate nel backup JSON e nella sincronizzazione cloud.
- **Filtro Anno Attivo vs Storico Completo:** selettore nel diario di bordo per isolare le osservazioni dell'anno corrente o consultare lo storico pluriennale.

---

## [0.1.0] - 2026-09-04

### Rilascio Iniziale
- Compilatore PEI su 4 dimensioni ministeriali (D.I. 182) con formulazioni guidate.
- Diario di bordo rapido con categorie tematiche e tag.
- Gestione studenti, classi e istituti scolastici.
- Archiviazione locale su IndexedDB (funzionamento 100% offline).
- Sincronizzazione privata su Google Drive (OAuth 2.0 client-side).
- Esportazione e importazione backup in formato JSON.
- Internazionalizzazione bilingue (Italiano / Inglese).
- Progressive Web App (PWA) installabile con Service Worker.
- Strumenti di sviluppo locale (`Avvia_Teacher_Tools.bat`, `Tools/server.py`, `Tools/verify_rules.py`).
