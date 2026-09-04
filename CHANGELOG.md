# Registro delle Modifiche (Changelog)

Tutte le modifiche rilevanti apportate a **Teacher Tools** sono documentate in questo file.  
Il formato segue le convenzioni di [Keep a Changelog](https://keepachangelog.com/it/1.0.0/) e aderisce al Semantic Versioning.

---

## [2.1.0] - 2026-09-04

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

## [2.0.0] - 2026-09-04

### Aggiunto
- **Avanzamento Anno Scolastico (Rollover):** procedura guidata di passaggio al nuovo anno scolastico con gestione contestuale di promossi, ripetenti e classi terminali a fine ciclo.
- **Selettore Anno Dinamico:** menu dropdown nell'header per commutare l'anno attivo o creare nuovi anni scolastici (presenti o futuri) in qualsiasi momento.
- **Schede di Lettura a 360°:** panoramica interattiva al click per Istituto Scolastico, Classe e Singolo Studente, con navigatore storico tra gli anni.
- **Tipologia Scuola & Grado Massimo:** supporto per Scuola Primaria, Secondaria di 1° Grado, Secondaria di 2° Grado o configurazione Personalizzata con limite classi flessibile.
- **Modifica Classe & Didattica:** possibilità di rinominare le classi e registrare la programmazione didattica annuale o annotazioni d'aula.

---

## [1.5.0] - 2026-09-04

### Aggiunto
- **Fascicolo / Verbale Osservazioni d'Aula:** generatore di relazione formattata in carta dossier ministeriale con intestazione, statistiche, stampa diretta in PDF e copia rapida.
- **Personalizzazione Frasario PEI:** gestione della visibilità delle formule ministeriali ministeriali e aggiunta di formule pedagogiche personalizzate del docente.
- **Store `pei_phrases`:** persistenza delle formule personalizzate in IndexedDB, integrate nel backup JSON e nella sincronizzazione cloud.
- **Filtro Anno Attivo vs Storico Completo:** selettore nel diario di bordo per isolare le osservazioni dell'anno corrente o consultare lo storico pluriennale.

---

## [1.0.0] - 2026-09-04

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
