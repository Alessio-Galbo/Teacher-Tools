<!-- hub:map:start -->
# Mappa: js/modules/notes/
Torna al [router](../../AGENTS.md) · 18 file
- [noteForm.js](../../js/modules/notes/noteForm.js): Form inline per aggiungere una nota con tag, destinatario (classe/studente) e metadati
- [noteItem.js](../../js/modules/notes/noteItem.js): Card di una singola nota con data, tag, badge classe e pulsanti modifica/elimina
- [noteModal.js](../../js/modules/notes/noteModal.js): Modale per creare o modificare una nota: sceglie destinatario, data, tag e salva
- [noteModalFields.js](../../js/modules/notes/noteModalFields.js): Campi del modale nota: data, testo e gruppi di tag precompilati dalla nota
- [noteTagGroups.js](../../js/modules/notes/noteTagGroups.js): Definisce i gruppi di tag (didattici, relazionali, esiti) e crea il box selezionabile
- [notesDossierRenderer.js](../../js/modules/notes/notesDossierRenderer.js): Costruisce il DOM del dossier stampabile delle note con intestazione e schede numerate
- [notesGroupRenderer.js](../../js/modules/notes/notesGroupRenderer.js): Renderizza i gruppi di note, anche macro-gruppi con sottogruppi, con conteggi e azioni
- [notesGrouper.js](../../js/modules/notes/notesGrouper.js): Raggruppa le note per ambito (studente, classe, scuola) in sezioni con icona e titolo
- [notesHeader.js](../../js/modules/notes/notesHeader.js): Intestazione della sezione note con titolo, pulsante cambio vista lista/tessere e riepilogo
- [notesHierarchy.js](../../js/modules/notes/notesHierarchy.js): Risolve l'ambito attivo (tutto, scuola, classe, studente) in un filtro gerarchico sulle note
- [notesModel.js](../../js/modules/notes/notesModel.js): Modello dati note su IndexedDB: aggiunta, modifica, lettura filtrata per tag, testo e anno
- [notesSchoolGrouper.js](../../js/modules/notes/notesSchoolGrouper.js): Raggruppa le note per scuola, classe e alunno in gruppi macro con sottogruppi
- [notesSearchBar.js](../../js/modules/notes/notesSearchBar.js): Campo di ricerca note e pulsante che genera il riepilogo in modale
- [notesSummaryGenerator.js](../../js/modules/notes/notesSummaryGenerator.js): Genera il testo del riepilogo osservazioni per ambito, tag e filtro ricerca
- [notesTagFilter.js](../../js/modules/notes/notesTagFilter.js): Barra di chip per filtrare le note per tag
- [notesView.js](../../js/modules/notes/notesView.js): Vista principale delle note: toolbar, filtri anno/tag, ricerca, modalità tessere/lista
- [notesYearFilter.js](../../js/modules/notes/notesYearFilter.js): Pulsanti per alternare note dell'anno corrente o di tutti gli anni
- [summaryModal.js](../../js/modules/notes/summaryModal.js): Modale del riepilogo note con copia negli appunti e stampa del dossier
<!-- hub:map:end -->
